#!/usr/bin/env node

/**
 * Bind rendered Motion Lab outputs to the exact geometry module, composition,
 * selected source, and retained endpoint frames used for this render. There is
 * deliberately no timestamp: --check can prove whether the record is stale.
 */

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoDir = resolve(scriptDir, '..', '..');
const manifestPath = join(
  repoDir,
  'infographic-setup',
  'data',
  '2026-W32',
  'supply-risk-motion-lab',
  'field-guide-motion-manifest.json',
);

function usage() {
  return `Usage:
  node record_render_provenance.mjs --fps <number> --gif-fps <number> --gif-width <number> --hold-seconds <number>
  node record_render_provenance.mjs --check --fps <number> --gif-fps <number> --gif-width <number> --hold-seconds <number>`;
}

function parseArgs(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--check') options.check = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else if (['--fps', '--gif-fps', '--gif-width', '--hold-seconds'].includes(arg)) {
      options[arg.slice(2).replaceAll('-', '_')] = Number(args[index + 1]);
      index += 1;
    } else throw new Error(`Unknown option: ${arg}`);
  }
  for (const key of ['fps', 'gif_fps', 'gif_width', 'hold_seconds']) {
    if (!Number.isFinite(options[key]) || options[key] < 0) throw new Error(`${key.replaceAll('_', '-')} must be a non-negative number`);
  }
  return options;
}

function sha256(path) {
  if (!existsSync(path)) throw new Error(`Required render file is missing: ${path}`);
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function readJson(path, label) {
  if (!existsSync(path)) throw new Error(`${label} is missing: ${path}`);
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error.message}`);
  }
}

function inside(parent, relativePath, label) {
  const resolved = resolve(parent, relativePath);
  const relation = relative(parent, resolved);
  if (relation === '' || relation === '..' || relation.startsWith(`..${sep}`)) {
    throw new Error(`${label} must resolve inside ${parent}`);
  }
  return resolved;
}

function canonical(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }
  const manifest = readJson(manifestPath, 'Field Guide motion manifest');
  const compositionFinalStillSeconds = manifest.timeline?.final_still_seconds;
  if (!Number.isFinite(compositionFinalStillSeconds) || compositionFinalStillSeconds < 1.2) {
    throw new Error('motion manifest must record a final_still_seconds value of at least 1.2');
  }
  const dataDir = inside(repoDir, manifest.package.data_directory, 'package.data_directory');
  const provenancePath = inside(scriptDir, manifest.package.render_provenance, 'package.render_provenance');
  const sourcePath = inside(repoDir, manifest.source.selected_still, 'source.selected_still');
  const geometryPath = inside(dataDir, manifest.package.overlay_geometry, 'package.overlay_geometry');
  const compositionPath = inside(scriptDir, manifest.package.composition, 'package.composition');
  const generatedGeometryPath = join(scriptDir, 'assets', 'overlay-geometry.generated.js');
  const openingPath = inside(scriptDir, manifest.package.outputs.first_frame, 'package.outputs.first_frame');
  const finalPath = inside(scriptDir, manifest.package.outputs.final_frame, 'package.outputs.final_frame');
  const gifPath = inside(dataDir, manifest.package.outputs.gif, 'package.outputs.gif');
  const mp4Path = inside(dataDir, manifest.package.outputs.mp4, 'package.outputs.mp4');

  const record = {
    "schema_version": "1.0.0",
    "motion_id": manifest.motion_id,
    "source": {
      "path": manifest.source.selected_still,
      "sha256": sha256(sourcePath)
    },
    "render_inputs": {
      "overlay_geometry": {
        "path": relative(repoDir, geometryPath),
        "sha256": sha256(geometryPath)
      },
      "generated_overlay_module": {
        "path": relative(repoDir, generatedGeometryPath),
        "sha256": sha256(generatedGeometryPath)
      },
      "composition": {
        "path": relative(repoDir, compositionPath),
        "sha256": sha256(compositionPath)
      }
    },
    "retained_endpoints": {
      "opening": {
        "path": relative(repoDir, openingPath),
        "sha256": sha256(openingPath)
      },
      "final": {
        "path": relative(repoDir, finalPath),
        "sha256": sha256(finalPath)
      }
    },
    "outputs": {
      "gif": {
        "path": relative(repoDir, gifPath),
        "sha256": sha256(gifPath)
      },
      "mp4": {
        "path": relative(repoDir, mp4Path),
        "sha256": sha256(mp4Path)
      }
    },
    "renderer": {
      "frames_per_second": options.fps,
      "gif_frames_per_second": options.gif_fps,
      "gif_width": options.gif_width,
      "renderer_appended_hold_seconds": options.hold_seconds,
      "composition_final_still_seconds": compositionFinalStillSeconds
    }
  };
  const rendered = canonical(record);
  if (options.check) {
    if (!existsSync(provenancePath)) throw new Error('render provenance is missing; re-render and record it');
    if (readFileSync(provenancePath, 'utf8') !== rendered) {
      throw new Error('render provenance is stale; re-render or re-record it after source, geometry, composition, endpoint, or output changes');
    }
    console.log(`Render provenance is fresh for ${manifest.motion_id}`);
    return;
  }
  writeFileSync(provenancePath, rendered, 'utf8');
  console.log(`Wrote ${relative(repoDir, provenancePath)}`);
}

try {
  main();
} catch (error) {
  console.error(`Render provenance recording failed: ${error.message}`);
  process.exitCode = 1;
}
