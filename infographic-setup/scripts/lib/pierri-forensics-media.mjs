import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const GIF_HEADERS = new Set(['GIF87a', 'GIF89a']);
const JPEG_SOF_MARKERS = new Set([
  0xc0, 0xc1, 0xc2, 0xc3,
  0xc5, 0xc6, 0xc7,
  0xc9, 0xca, 0xcb,
  0xcd, 0xce, 0xcf,
]);

export const sha256 = (value) => createHash('sha256').update(value).digest('hex');

function requireBytes(buffer, offset, length, label) {
  if (offset < 0 || length < 0 || offset + length > buffer.length) {
    throw new Error(`${label}: unexpected end of file`);
  }
}

function skipGifSubBlocks(buffer, offset, label) {
  let cursor = offset;
  while (true) {
    requireBytes(buffer, cursor, 1, label);
    const size = buffer[cursor];
    cursor += 1;
    if (size === 0) return cursor;
    requireBytes(buffer, cursor, size, label);
    cursor += size;
  }
}

function inspectGif(buffer) {
  requireBytes(buffer, 0, 13, 'GIF header');
  const header = buffer.subarray(0, 6).toString('ascii');
  if (!GIF_HEADERS.has(header)) throw new Error(`GIF header: unsupported signature ${JSON.stringify(header)}`);

  const width = buffer.readUInt16LE(6);
  const height = buffer.readUInt16LE(8);
  let cursor = 13;
  const screenPacked = buffer[10];
  if (screenPacked & 0x80) {
    const globalColourTableBytes = 3 * (2 ** ((screenPacked & 0x07) + 1));
    requireBytes(buffer, cursor, globalColourTableBytes, 'GIF global colour table');
    cursor += globalColourTableBytes;
  }

  let frameCount = 0;
  let totalDurationMs = 0;
  let pendingDelayMs = 0;
  const frameStartPositionsMs = [];

  while (cursor < buffer.length) {
    const block = buffer[cursor];
    cursor += 1;

    if (block === 0x3b) break; // trailer

    if (block === 0x21) { // extension
      requireBytes(buffer, cursor, 1, 'GIF extension label');
      const label = buffer[cursor];
      cursor += 1;

      if (label === 0xf9) { // Graphic Control Extension
        requireBytes(buffer, cursor, 1, 'GIF graphic control extension size');
        const blockSize = buffer[cursor];
        cursor += 1;
        if (blockSize !== 4) throw new Error(`GIF graphic control extension: expected 4 bytes, found ${blockSize}`);
        requireBytes(buffer, cursor, blockSize + 1, 'GIF graphic control extension payload');
        pendingDelayMs = buffer.readUInt16LE(cursor + 1) * 10;
        cursor += blockSize;
        if (buffer[cursor] !== 0) throw new Error('GIF graphic control extension: missing block terminator');
        cursor += 1;
        continue;
      }

      // All non-GCE extensions have one fixed-size data block followed by GIF sub-blocks.
      requireBytes(buffer, cursor, 1, 'GIF extension block size');
      const blockSize = buffer[cursor];
      cursor += 1;
      requireBytes(buffer, cursor, blockSize, 'GIF extension payload');
      cursor += blockSize;
      cursor = skipGifSubBlocks(buffer, cursor, 'GIF extension sub-blocks');
      continue;
    }

    if (block === 0x2c) { // image descriptor
      requireBytes(buffer, cursor, 9, 'GIF image descriptor');
      const imagePacked = buffer[cursor + 8];
      cursor += 9;
      if (imagePacked & 0x80) {
        const localColourTableBytes = 3 * (2 ** ((imagePacked & 0x07) + 1));
        requireBytes(buffer, cursor, localColourTableBytes, 'GIF local colour table');
        cursor += localColourTableBytes;
      }
      requireBytes(buffer, cursor, 1, 'GIF LZW minimum code size');
      cursor += 1;
      cursor = skipGifSubBlocks(buffer, cursor, 'GIF image data sub-blocks');

      frameStartPositionsMs.push(totalDurationMs);
      totalDurationMs += pendingDelayMs;
      pendingDelayMs = 0;
      frameCount += 1;
      continue;
    }

    throw new Error(`GIF data stream: unsupported block 0x${block.toString(16).padStart(2, '0')}`);
  }

  if (!frameCount) throw new Error('GIF data stream: no image frames found');
  return {
    format: 'gif',
    canvas: { width, height },
    frame_count: frameCount,
    duration_ms_from_gce: totalDurationMs,
    frame_start_positions_ms: frameStartPositionsMs,
  };
}

function inspectJpeg(buffer) {
  requireBytes(buffer, 0, 2, 'JPEG header');
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) throw new Error('JPEG header: missing SOI marker');

  let cursor = 2;
  while (cursor < buffer.length) {
    while (cursor < buffer.length && buffer[cursor] === 0xff) cursor += 1;
    requireBytes(buffer, cursor, 1, 'JPEG marker');
    const marker = buffer[cursor];
    cursor += 1;

    if (marker === 0xd9 || marker === 0xda) break; // EOI or start of entropy-coded scan.
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;

    requireBytes(buffer, cursor, 2, 'JPEG segment length');
    const segmentLength = buffer.readUInt16BE(cursor);
    if (segmentLength < 2) throw new Error(`JPEG marker 0x${marker.toString(16)}: invalid segment length ${segmentLength}`);
    requireBytes(buffer, cursor, segmentLength, `JPEG marker 0x${marker.toString(16)} payload`);

    if (JPEG_SOF_MARKERS.has(marker)) {
      if (segmentLength < 8) throw new Error(`JPEG start-of-frame marker 0x${marker.toString(16)}: payload too short`);
      return {
        format: 'jpeg',
        canvas: {
          width: buffer.readUInt16BE(cursor + 5),
          height: buffer.readUInt16BE(cursor + 3),
        },
        frame_count: null,
        duration_ms_from_gce: null,
        frame_start_positions_ms: [],
      };
    }
    cursor += segmentLength;
  }

  throw new Error('JPEG data stream: no start-of-frame marker found');
}

export function inspectPierriMediaBuffer(buffer) {
  requireBytes(buffer, 0, 2, 'media header');
  const header = buffer.subarray(0, 6).toString('ascii');
  if (GIF_HEADERS.has(header)) return inspectGif(buffer);
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return inspectJpeg(buffer);
  throw new Error('Unsupported local source asset format; expected GIF87a/GIF89a or JPEG SOI');
}

export async function inspectPierriMediaFile(filePath) {
  const buffer = await readFile(filePath);
  return {
    ...inspectPierriMediaBuffer(buffer),
    sha256: sha256(buffer),
  };
}
