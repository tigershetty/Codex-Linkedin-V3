#!/usr/bin/env node

/**
 * Verify the source-fidelity part of a motion package with decoded pixels.
 *
 * File-byte equality is not enough: two valid PNG encoders can produce different
 * files for the same image. This script decodes source, opening and closing
 * frames to raw RGBA through ffmpeg, then compares every channel. It can also
 * pin the approved source file to a SHA-256 recorded in a Field Guide motion
 * manifest.
 */

import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

function usage() {
  return `Usage:
  node scripts/verify-motion-endpoints.mjs \\
    --source <approved-still.png> \\
    --first <lossless-opening-frame.png> \\
    --final <lossless-closing-frame.png> [--sha256 <source-sha256>] [--json]

The source, first, and final inputs are decoded to raw RGBA. The command fails
when either endpoint differs by even one channel value, dimensions differ, or an
optional source SHA-256 does not match the approved still.
`;
}

function parseArgs(args) {
  const options = { positional: [] };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--json') options.json = true;
    else if (arg === '--source' || arg === '--first' || arg === '--final' || arg === '--sha256') {
      options[arg.slice(2)] = args[index + 1];
      index += 1;
    } else if (arg.startsWith('--source=')) options.source = arg.slice('--source='.length);
    else if (arg.startsWith('--first=')) options.first = arg.slice('--first='.length);
    else if (arg.startsWith('--final=')) options.final = arg.slice('--final='.length);
    else if (arg.startsWith('--sha256=')) options.sha256 = arg.slice('--sha256='.length);
    else if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
    else options.positional.push(arg);
  }
  return options;
}

function requireFile(value, label) {
  if (!value) throw new Error(`${label} is required`);
  const path = resolve(value);
  if (!existsSync(path)) throw new Error(`${label} does not exist: ${path}`);
  return path;
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function probe(path) {
  const result = spawnSync('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height',
    '-of', 'json',
    path,
  ], { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
  if (result.status !== 0) {
    throw new Error(`ffprobe failed for ${path}: ${(result.stderr || '').trim()}`);
  }
  const metadata = JSON.parse(result.stdout || '{}');
  const stream = metadata.streams?.[0];
  if (!Number.isInteger(stream?.width) || !Number.isInteger(stream?.height)) {
    throw new Error(`ffprobe returned no video dimensions for ${path}`);
  }
  return { width: stream.width, height: stream.height };
}

function decodeRgba(path, dimensions) {
  const result = spawnSync('ffmpeg', [
    '-v', 'error',
    '-i', path,
    '-frames:v', '1',
    '-pix_fmt', 'rgba',
    '-f', 'rawvideo',
    'pipe:1',
  ], { encoding: null, maxBuffer: 256 * 1024 * 1024 });
  if (result.status !== 0) {
    const stderr = result.stderr ? result.stderr.toString('utf8').trim() : '';
    throw new Error(`ffmpeg could not decode ${path}: ${stderr}`);
  }
  const expectedLength = dimensions.width * dimensions.height * 4;
  if (result.stdout.length !== expectedLength) {
    throw new Error(
      `decoded RGBA length mismatch for ${path}: expected ${expectedLength}, got ${result.stdout.length}`,
    );
  }
  return result.stdout;
}

function compareDecoded(source, candidate, sourceDimensions, candidateDimensions) {
  if (
    sourceDimensions.width !== candidateDimensions.width
    || sourceDimensions.height !== candidateDimensions.height
  ) {
    return {
      pass: false,
      reason: 'dimension_mismatch',
      source_dimensions: sourceDimensions,
      candidate_dimensions: candidateDimensions,
      changed_pixels: null,
      changed_channels: null,
      max_channel_delta: null,
    };
  }

  let changedPixels = 0;
  let changedChannels = 0;
  let maxChannelDelta = 0;
  let lastChangedPixel = -1;
  for (let index = 0; index < source.length; index += 1) {
    const delta = Math.abs(source[index] - candidate[index]);
    if (delta === 0) continue;
    changedChannels += 1;
    maxChannelDelta = Math.max(maxChannelDelta, delta);
    const pixelIndex = Math.floor(index / 4);
    if (pixelIndex !== lastChangedPixel) {
      changedPixels += 1;
      lastChangedPixel = pixelIndex;
    }
  }
  return {
    pass: changedChannels === 0,
    reason: changedChannels === 0 ? 'pixel_identical' : 'pixel_difference',
    source_dimensions: sourceDimensions,
    candidate_dimensions: candidateDimensions,
    changed_pixels: changedPixels,
    changed_channels: changedChannels,
    max_channel_delta: maxChannelDelta,
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }
  if (options.positional.length > 0) {
    throw new Error(`Unexpected positional argument(s): ${options.positional.join(', ')}`);
  }

  const sourcePath = requireFile(options.source, '--source');
  const firstPath = requireFile(options.first, '--first');
  const finalPath = requireFile(options.final, '--final');
  if (options.sha256 && !/^[a-f0-9]{64}$/i.test(options.sha256)) {
    throw new Error('--sha256 must be a 64-character hexadecimal SHA-256 value');
  }

  const sourceHash = sha256(sourcePath);
  const sourceDimensions = probe(sourcePath);
  const sourceRgba = decodeRgba(sourcePath, sourceDimensions);
  const firstDimensions = probe(firstPath);
  const finalDimensions = probe(finalPath);
  const report = {
    source: {
      path: sourcePath,
      sha256: sourceHash,
      expected_sha256: options.sha256 || null,
      sha256_matches: !options.sha256 || sourceHash === options.sha256.toLowerCase(),
      dimensions: sourceDimensions,
    },
    first: {
      path: firstPath,
      ...compareDecoded(
        sourceRgba,
        decodeRgba(firstPath, firstDimensions),
        sourceDimensions,
        firstDimensions,
      ),
    },
    final: {
      path: finalPath,
      ...compareDecoded(
        sourceRgba,
        decodeRgba(finalPath, finalDimensions),
        sourceDimensions,
        finalDimensions,
      ),
    },
  };
  report.pass = report.source.sha256_matches && report.first.pass && report.final.pass;

  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`SOURCE SHA-256 ${report.source.sha256_matches ? 'PASS' : 'FAIL'} ${sourceHash}`);
    if (options.sha256) console.log(`EXPECTED SHA-256 ${options.sha256.toLowerCase()}`);
    for (const endpoint of ['first', 'final']) {
      const result = report[endpoint];
      const detail = result.pass
        ? `${result.source_dimensions.width}x${result.source_dimensions.height}; pixel-identical`
        : `${result.reason}; changed_pixels=${result.changed_pixels ?? 'n/a'}; changed_channels=${result.changed_channels ?? 'n/a'}; max_delta=${result.max_channel_delta ?? 'n/a'}`;
      console.log(`${endpoint.toUpperCase()} ${result.pass ? 'PASS' : 'FAIL'} ${detail}`);
    }
  }

  if (!report.pass) process.exitCode = 1;
}

try {
  main();
} catch (error) {
  console.error(`Motion endpoint verification failed: ${error.message}`);
  process.exitCode = 2;
}
