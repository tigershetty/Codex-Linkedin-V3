#!/usr/bin/env node

/**
 * Build the reproducible, source-registered SVG overlay contract for the
 * Supply Risk Field Guide Motion Lab.
 *
 * There are intentionally no extracted bitmap assets. The builder validates a
 * versioned geometry record against the Field Guide motion manifest and emits
 * a deterministic browser module plus an auditable asset manifest. The HTML
 * composition must consume the generated module rather than duplicate paths
 * or coordinates by hand.
 */

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoDir = resolve(scriptDir, '..', '..');
const sourcePath = join(scriptDir, 'assets', 'visual.png');
const manifestPath = join(
  repoDir,
  'infographic-setup',
  'data',
  '2026-W32',
  'supply-risk-motion-lab',
  'field-guide-motion-manifest.json',
);
const generatedModulePath = join(scriptDir, 'assets', 'overlay-geometry.generated.js');
const assetManifestPath = join(scriptDir, 'assets', 'asset-manifest.json');
const allowedTones = new Set(['date', 'exposure', 'recovery', 'exception']);

function usage() {
  return `Usage:
  node build_motion_assets.mjs
  node build_motion_assets.mjs --check

The default command validates the approved still + overlay geometry and writes
the deterministic generated geometry module and asset manifest. --check does
not write; it fails if either generated output is stale.`;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function readJson(path, label) {
  if (!existsSync(path)) throw new Error(`${label} is missing: ${path}`);
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error.message}`);
  }
}

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function safeRelative(base, candidate, label) {
  const value = text(candidate);
  if (!value) throw new Error(`${label} is required`);
  const resolved = resolve(base, value);
  const relation = relative(base, resolved);
  if (relation === '' || relation === '..' || relation.startsWith(`..${sep}`)) {
    throw new Error(`${label} must resolve inside ${base}`);
  }
  return resolved;
}

function pngDimensions(path) {
  const buffer = readFileSync(path);
  if (buffer.subarray(1, 4).toString('ascii') !== 'PNG') {
    throw new Error('assets/visual.png must be a PNG');
  }
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function pathFromPoints(points) {
  return points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x} ${y}`).join(' ');
}

function canonicalJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function parseArgs(args) {
  const options = {};
  for (const arg of args) {
    if (arg === '--check') options.check = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else throw new Error(`Unknown option: ${arg}`);
  }
  return options;
}

function finalHoldStart(manifest) {
  const finalHold = manifest.timeline?.beats?.find((beat) => beat.id === 'final-hold');
  assert(Number.isFinite(finalHold?.start), 'motion manifest must have a numeric final-hold start');
  return finalHold.start;
}

function build() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }
  assert(existsSync(sourcePath), `Approved source still is missing: ${sourcePath}`);
  const motionManifest = readJson(manifestPath, 'Field Guide motion manifest');
  const packageDir = safeRelative(repoDir, motionManifest.package?.data_directory, 'manifest package.data_directory');
  const geometryPath = safeRelative(packageDir, motionManifest.package?.overlay_geometry, 'manifest package.overlay_geometry');
  const geometry = readJson(geometryPath, 'Motion overlay geometry');
  const sourceHash = sha256(readFileSync(sourcePath));
  const geometryHash = sha256(readFileSync(geometryPath));
  const dimensions = pngDimensions(sourcePath);

  assert(sourceHash === motionManifest.source?.sha256, 'assets/visual.png does not match source SHA-256 in the Field Guide motion manifest');
  assert(geometry.motion_id === motionManifest.motion_id, 'overlay geometry motion_id does not match the Field Guide motion manifest');
  assert(text(geometry.geometry_id), 'overlay geometry geometry_id is required');
  assert(geometry.source?.figma_file_key === motionManifest.source?.figma_file_key, 'overlay geometry Figma file key does not match motion manifest');
  assert(geometry.source?.motion_frame_node_id === motionManifest.source?.motion_frame_node_id, 'overlay geometry motion frame node does not match motion manifest');
  assert(geometry.source?.selected_still === motionManifest.source?.selected_still, 'overlay geometry selected still does not match motion manifest');
  assert(geometry.source?.sha256 === motionManifest.source?.sha256, 'overlay geometry source SHA-256 does not match motion manifest');
  assert(
    geometry.source?.canvas?.width === dimensions.width && geometry.source?.canvas?.height === dimensions.height,
    `overlay geometry canvas must equal approved source dimensions ${dimensions.width}x${dimensions.height}`,
  );

  const regionsByNode = new Map(
    (motionManifest.semantic_regions ?? []).map((region) => [region.figma_node_id, region]),
  );
  const signalNode = geometry.signal?.figma_node_id;
  assert(regionsByNode.get(signalNode)?.role === 'signal_origin', 'overlay signal must reference a signal_origin semantic region');
  assert(Array.isArray(geometry.signal?.restrictions) && geometry.signal.restrictions.length > 0, 'overlay signal restrictions are required');
  assert(Array.isArray(geometry.segments) && geometry.segments.length > 0, 'overlay geometry needs at least one segment');

  const seenIds = new Set();
  let lastStart = -1;
  const openingStill = motionManifest.timeline?.opening_still_seconds;
  const finalStart = finalHoldStart(motionManifest);
  const segments = geometry.segments.map((segment, index) => {
    const label = `segments[${index}]`;
    assert(text(segment.id), `${label}.id is required`);
    assert(!seenIds.has(segment.id), `${label}.id is duplicated: ${segment.id}`);
    seenIds.add(segment.id);
    assert(Array.isArray(segment.figma_node_ids) && segment.figma_node_ids.length > 0, `${label}.figma_node_ids is required`);
    segment.figma_node_ids.forEach((nodeId) => assert(regionsByNode.has(nodeId), `${label} references unknown Figma node ${nodeId}`));
    assert(text(segment.role), `${label}.role is required`);
    assert(allowedTones.has(segment.tone), `${label}.tone must be one of ${[...allowedTones].join(', ')}`);
    assert(Array.isArray(segment.canvas_points) && segment.canvas_points.length >= 2, `${label}.canvas_points needs at least two points`);
    segment.canvas_points.forEach((point, pointIndex) => {
      assert(Array.isArray(point) && point.length === 2 && point.every(Number.isFinite), `${label}.canvas_points[${pointIndex}] must be [x, y] numbers`);
      assert(point[0] >= 0 && point[0] <= dimensions.width && point[1] >= 0 && point[1] <= dimensions.height, `${label}.canvas_points[${pointIndex}] falls outside the source canvas`);
    });
    assert(Number.isFinite(segment.dot_radius) && segment.dot_radius > 0 && segment.dot_radius <= 16, `${label}.dot_radius must be between 0 and 16`);
    const timing = segment.timing ?? {};
    assert(Number.isFinite(timing.start) && Number.isFinite(timing.travel_seconds) && Number.isFinite(timing.hold_seconds), `${label}.timing requires numeric start, travel_seconds, and hold_seconds`);
    assert(timing.start >= openingStill, `${label}.timing.start must not interrupt the opening still`);
    assert(timing.start >= lastStart, `${label}.timing.start must not move backwards`);
    assert(timing.travel_seconds > 0 && timing.hold_seconds >= 0, `${label}.timing values are invalid`);
    assert(timing.start + timing.travel_seconds + timing.hold_seconds <= finalStart, `${label} must finish before the final static hold`);
    lastStart = timing.start;
    assert(text(segment.communication_job), `${label}.communication_job is required`);
    return {
      id: segment.id,
      figma_node_ids: segment.figma_node_ids,
      role: segment.role,
      tone: segment.tone,
      svg_path: pathFromPoints(segment.canvas_points),
      initial_point: { x: segment.canvas_points[0][0], y: segment.canvas_points[0][1] },
      dot_radius: segment.dot_radius,
      timing: {
        start: segment.timing.start,
        travel_seconds: segment.timing.travel_seconds,
        hold_seconds: segment.timing.hold_seconds,
      },
      communication_job: segment.communication_job,
    };
  });

  const generatedGeometry = {
    schema_version: '1.0.0',
    geometry_id: geometry.geometry_id,
    motion_id: motionManifest.motion_id,
    source_sha256: sourceHash,
    geometry_source_sha256: geometryHash,
    canvas: dimensions,
    timeline: {
      duration_seconds: motionManifest.timeline.duration_seconds,
      opening_still_seconds: motionManifest.timeline.opening_still_seconds,
      final_still_seconds: motionManifest.timeline.final_still_seconds,
    },
    signal: {
      figma_node_id: signalNode,
      restrictions: geometry.signal.restrictions,
    },
    segments,
  };
  const moduleText = `// Generated by build_motion_assets.mjs. Do not hand-edit.\n` +
    `window.__fieldGuideOverlayGeometry = Object.freeze(${JSON.stringify(generatedGeometry, null, 2)});\n`;
  const generatedModuleHash = sha256(moduleText);
  const assetManifest = {
    schema_version: '1.1.0',
    motion_id: motionManifest.motion_id,
    source: 'assets/visual.png',
    source_sha256: sourceHash,
    generated_assets: ['assets/overlay-geometry.generated.js'],
    overlay_geometry: {
      geometry_id: geometry.geometry_id,
      source: relative(repoDir, geometryPath),
      source_sha256: geometryHash,
      generated_module: 'assets/overlay-geometry.generated.js',
      generated_module_sha256: generatedModuleHash,
      canvas: dimensions,
      signal_node: signalNode,
      segment_ids: segments.map((segment) => segment.id),
      restrictions: geometry.signal.restrictions,
    },
  };
  const assetManifestText = canonicalJson(assetManifest);

  if (options.check) {
    assert(existsSync(generatedModulePath), 'generated overlay geometry module is missing; run build_motion_assets.mjs');
    assert(existsSync(assetManifestPath), 'asset manifest is missing; run build_motion_assets.mjs');
    assert(readFileSync(generatedModulePath, 'utf8') === moduleText, 'generated overlay geometry module is stale; run build_motion_assets.mjs');
    assert(readFileSync(assetManifestPath, 'utf8') === assetManifestText, 'asset manifest is stale; run build_motion_assets.mjs');
    console.log(`Overlay geometry is fresh for ${motionManifest.motion_id}`);
    return;
  }

  writeFileSync(generatedModulePath, moduleText, 'utf8');
  writeFileSync(assetManifestPath, assetManifestText, 'utf8');
  console.log(`Validated ${geometry.geometry_id} and wrote ${relative(repoDir, generatedModulePath)} + ${relative(repoDir, assetManifestPath)}`);
}

try {
  build();
} catch (error) {
  console.error(`Motion asset build failed: ${error.message}`);
  process.exitCode = 1;
}
