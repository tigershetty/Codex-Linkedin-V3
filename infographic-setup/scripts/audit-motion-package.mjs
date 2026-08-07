#!/usr/bin/env node

/**
 * Audit an image-led motion package or a Field Guide Motion Lab package.
 *
 * A motion-qa.md can document review decisions, but it is not proof that the
 * opening and closing frames equal the approved source. This audit decodes the
 * retained PNG endpoints to raw RGBA through verify-motion-endpoints.mjs.
 */

import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const infographicDir = resolve(scriptDir, '..');
const repoDir = resolve(infographicDir, '..');
const dataDir = join(infographicDir, 'data');

function usage() {
  return `Usage:
  node scripts/audit-motion-package.mjs data/{week}/{slug}
  node scripts/audit-motion-package.mjs --manifest data/_lab/{slug}/field-guide-motion-manifest.json

The legacy route resolves the selected still from post-card.md. The manifest
route uses the selected Figma Field Guide still and its recorded source SHA-256.`;
}

function parseArgs(args) {
  const options = { positional: [] };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--manifest') {
      options.manifest = args[index + 1];
      index += 1;
    } else if (arg.startsWith('--manifest=')) options.manifest = arg.slice('--manifest='.length);
    else if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
    else options.positional.push(arg);
  }
  return options;
}

function assertInside(parent, candidate, label) {
  const resolved = resolve(candidate);
  const relation = relative(parent, resolved);
  if (relation === '' || relation === '..' || relation.startsWith(`..${sep}`)) {
    throw new Error(`${label} must resolve inside ${relative(repoDir, parent)}/.`);
  }
  return resolved;
}

function file(path) {
  return Boolean(path) && existsSync(path) && statSync(path).isFile();
}

function nonEmpty(path, minimum = 1) {
  return file(path) && statSync(path).size >= minimum;
}

function read(path) {
  return file(path) ? readFileSync(path, 'utf8') : '';
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function selectedVisual(postDir) {
  const postCardPath = join(postDir, 'post-card.md');
  if (!file(postCardPath)) return { path: join(postDir, 'visual.png'), error: '' };
  const card = read(postCardPath);
  const match = card.match(/^\*\*Active visual:?\*\*\s*(.*)$/m);
  const candidate = match?.[1]?.replace(/`/g, '').trim();
  if (!candidate) return { path: '', error: 'Active visual is missing from post-card.md.' };
  try {
    return { path: assertInside(postDir, resolve(postDir, candidate), `Active visual (${candidate})`), error: '' };
  } catch (error) {
    return { path: '', error: error.message };
  }
}

function legacyFrameEndpoints(projectDir) {
  const framesDir = join(projectDir, 'qa', 'frames');
  if (!existsSync(framesDir)) return { first: '', final: '' };
  const frames = readdirSync(framesDir)
    .filter((name) => /^f_\d+\.png$/i.test(name))
    .sort((left, right) => Number(left.match(/\d+/)[0]) - Number(right.match(/\d+/)[0]));
  return {
    first: join(framesDir, 'f_0000.png'),
    final: frames.length ? join(framesDir, frames.at(-1)) : '',
  };
}

function probe(path) {
  if (!file(path)) return null;
  const result = spawnSync('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height,nb_frames,duration',
    '-show_entries', 'format=duration,size',
    '-of', 'json',
    path,
  ], { encoding: 'utf8' });
  if (result.status !== 0) return null;
  try {
    return JSON.parse(result.stdout);
  } catch {
    return null;
  }
}

function verifyManifest(manifestPath) {
  const validatorPath = join(scriptDir, 'validate-field-guide-motion-manifest.mjs');
  const result = spawnSync(process.execPath, [validatorPath, '--input', manifestPath, '--verify-files'], {
    encoding: 'utf8',
  });
  return {
    pass: result.status === 0,
    detail: [result.stdout, result.stderr].filter(Boolean).join('\n').trim(),
  };
}

function verifyEndpoints(source, first, final, sourceHash) {
  if (!nonEmpty(source, 1) || !nonEmpty(first, 1) || !nonEmpty(final, 1)) return null;
  const verifierPath = join(scriptDir, 'verify-motion-endpoints.mjs');
  const args = [verifierPath, '--source', source, '--first', first, '--final', final, '--json'];
  if (sourceHash) args.push('--sha256', sourceHash);
  const result = spawnSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  try {
    return {
      report: JSON.parse(result.stdout),
      pass: result.status === 0,
      detail: (result.stderr || '').trim(),
    };
  } catch {
    return {
      report: null,
      pass: false,
      detail: [result.stdout, result.stderr].filter(Boolean).join('\n').trim(),
    };
  }
}

function verifyOverlayFreshness(assetBuilderPath) {
  if (!file(assetBuilderPath)) return { pass: false, detail: 'Motion asset builder is missing.' };
  const result = spawnSync(process.execPath, [assetBuilderPath, '--check'], {
    encoding: 'utf8',
    maxBuffer: 4 * 1024 * 1024,
  });
  return {
    pass: result.status === 0,
    detail: [result.stdout, result.stderr].filter(Boolean).join('\n').trim(),
  };
}

function verifyRenderProvenance(setup) {
  if (!file(setup.renderProvenancePath)) {
    return { pass: false, detail: 'Render provenance is missing; re-render and record it.' };
  }
  try {
    const record = JSON.parse(readFileSync(setup.renderProvenancePath, 'utf8'));
    const expected = [
      ['motion_id', record.motion_id, setup.motionId],
      ['source path', record.source?.path, relative(repoDir, setup.visual)],
      ['source SHA-256', record.source?.sha256, sha256(setup.visual)],
      ['overlay geometry path', record.render_inputs?.overlay_geometry?.path, relative(repoDir, setup.overlayGeometryPath)],
      ['overlay geometry SHA-256', record.render_inputs?.overlay_geometry?.sha256, sha256(setup.overlayGeometryPath)],
      ['generated overlay module path', record.render_inputs?.generated_overlay_module?.path, relative(repoDir, setup.generatedOverlayPath)],
      ['generated overlay module SHA-256', record.render_inputs?.generated_overlay_module?.sha256, sha256(setup.generatedOverlayPath)],
      ['composition path', record.render_inputs?.composition?.path, relative(repoDir, setup.compositionPath)],
      ['composition SHA-256', record.render_inputs?.composition?.sha256, sha256(setup.compositionPath)],
      ['opening endpoint SHA-256', record.retained_endpoints?.opening?.sha256, sha256(setup.firstFrame)],
      ['final endpoint SHA-256', record.retained_endpoints?.final?.sha256, sha256(setup.finalFrame)],
      ['GIF SHA-256', record.outputs?.gif?.sha256, sha256(setup.gif)],
      ['MP4 SHA-256', record.outputs?.mp4?.sha256, sha256(setup.mp4)],
      ['composition final still seconds', record.renderer?.composition_final_still_seconds, setup.finalStillSeconds],
    ];
    const mismatches = expected.filter(([, actual, expectedValue]) => actual !== expectedValue).map(([label]) => label);
    return {
      pass: mismatches.length === 0,
      detail: mismatches.length ? `Render provenance is stale for: ${mismatches.join(', ')}.` : 'Render provenance matches current source, geometry, composition, endpoints, and outputs.',
    };
  } catch (error) {
    return { pass: false, detail: `Could not validate render provenance: ${error.message}` };
  }
}

function endpointDetail(endpointReport, endpoint, fallback) {
  const result = endpointReport?.report?.[endpoint];
  if (!result) return endpointReport?.detail || fallback;
  if (result.pass) return 'Decoded raw-RGBA pixels matched the approved source.';
  return `Decoded raw-RGBA mismatch: ${result.reason}; changed_pixels=${result.changed_pixels ?? 'n/a'}; ` +
    `changed_channels=${result.changed_channels ?? 'n/a'}; max_channel_delta=${result.max_channel_delta ?? 'n/a'}.`;
}

function loadLegacy(input) {
  const postDir = assertInside(dataDir, resolve(infographicDir, input.replace(/^infographic-setup\//, '')), 'Post folder');
  const selected = selectedVisual(postDir);
  const slug = basename(postDir);
  const projectDir = join(repoDir, 'videos', `${slug}-motion`);
  const endpoints = legacyFrameEndpoints(projectDir);
  return {
    mode: 'legacy post-card',
    postDir,
    projectDir,
    selected,
    visual: selected.path,
    sourceHash: null,
    gif: join(postDir, 'visual-motion.gif'),
    mp4: join(postDir, 'visual-motion.mp4'),
    qaPath: join(postDir, 'motion-qa.md'),
    briefPath: join(projectDir, 'motion-brief.md'),
    shotPath: join(projectDir, 'shot-plan.json'),
    compositionPath: join(projectDir, 'compositions', 'main.html'),
    copiedVisual: join(projectDir, 'assets', 'visual.png'),
    assetBuilderPath: null,
    overlayGeometryPath: null,
    generatedOverlayPath: null,
    assetManifestPath: null,
    renderProvenancePath: null,
    motionId: null,
    finalStillSeconds: null,
    firstFrame: endpoints.first,
    finalFrame: endpoints.final,
    manifestValidation: null,
  };
}

function loadManifest(input) {
  const manifestPath = assertInside(dataDir, resolve(input), 'Field Guide motion manifest');
  if (!file(manifestPath)) throw new Error(`Field Guide motion manifest does not exist: ${manifestPath}`);
  const manifestValidation = verifyManifest(manifestPath);
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (manifest.status === 'template') {
    throw new Error('A template Field Guide motion manifest cannot be audited as an experiment.');
  }
  const postDir = assertInside(dataDir, resolve(repoDir, manifest.package.data_directory), 'manifest package.data_directory');
  const projectDir = assertInside(join(repoDir, 'videos'), resolve(repoDir, manifest.package.motion_project_directory), 'manifest package.motion_project_directory');
  const local = (value, label) => assertInside(projectDir, resolve(projectDir, value), label);
  const output = (value, label) => assertInside(postDir, resolve(postDir, value), label);
  const source = assertInside(postDir, resolve(repoDir, manifest.source.selected_still), 'manifest source.selected_still');
  const overlayGeometryPath = output(manifest.package.overlay_geometry, 'manifest package.overlay_geometry');
  return {
    mode: 'Field Guide manifest',
    postDir,
    projectDir,
    selected: { path: source, error: '' },
    visual: source,
    sourceHash: manifest.source.sha256,
    gif: output(manifest.package.outputs.gif, 'manifest package.outputs.gif'),
    mp4: output(manifest.package.outputs.mp4, 'manifest package.outputs.mp4'),
    qaPath: output(manifest.package.outputs.qa, 'manifest package.outputs.qa'),
    briefPath: local(manifest.package.motion_brief, 'manifest package.motion_brief'),
    shotPath: local(manifest.package.shot_plan, 'manifest package.shot_plan'),
    compositionPath: local(manifest.package.composition, 'manifest package.composition'),
    copiedVisual: join(projectDir, 'assets', 'visual.png'),
    assetBuilderPath: local(manifest.package.asset_builder, 'manifest package.asset_builder'),
    overlayGeometryPath,
    generatedOverlayPath: join(projectDir, 'assets', 'overlay-geometry.generated.js'),
    assetManifestPath: join(projectDir, 'assets', 'asset-manifest.json'),
    renderProvenancePath: local(manifest.package.render_provenance, 'manifest package.render_provenance'),
    motionId: manifest.motion_id,
    finalStillSeconds: manifest.timeline?.final_still_seconds,
    firstFrame: local(manifest.package.outputs.first_frame, 'manifest package.outputs.first_frame'),
    finalFrame: local(manifest.package.outputs.final_frame, 'manifest package.outputs.final_frame'),
    manifestValidation,
    manifestPath,
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }
  if (options.manifest && options.positional.length) throw new Error('Choose either a post folder or --manifest, not both.');
  if (!options.manifest && options.positional.length !== 1) throw new Error(usage());
  if (options.manifest === '') throw new Error('--manifest needs a path.');

  const setup = options.manifest ? loadManifest(options.manifest) : loadLegacy(options.positional[0]);
  const checks = [];
  const check = (label, pass, fix) => checks.push({ label, pass: Boolean(pass), fix });
  const sourceExists = !setup.selected.error && nonEmpty(setup.visual, 1000);
  const endpointReport = verifyEndpoints(setup.visual, setup.firstFrame, setup.finalFrame, setup.sourceHash);
  const overlayFreshness = setup.assetBuilderPath ? verifyOverlayFreshness(setup.assetBuilderPath) : null;
  const renderProvenance = setup.renderProvenancePath ? verifyRenderProvenance(setup) : null;

  if (setup.manifestValidation) {
    check(
      'Field Guide motion manifest validates with source SHA-256',
      setup.manifestValidation.pass,
      setup.manifestValidation.detail || 'Validate the Field Guide manifest and selected source still.',
    );
  }
  check(
    'approved source visual exists',
    sourceExists,
    setup.selected.error || 'Set the selected source visual to an approved non-empty PNG.',
  );
  check('canonical GIF exists', nonEmpty(setup.gif, 1000), 'Export visual-motion.gif.');
  check('canonical MP4 exists', nonEmpty(setup.mp4, 1000), 'Export visual-motion.mp4.');
  check('motion QA exists', nonEmpty(setup.qaPath, 100), 'Complete motion-qa.md.');
  check('motion brief exists', nonEmpty(setup.briefPath, 100), 'Complete the post-specific motion brief.');
  check('shot plan exists', nonEmpty(setup.shotPath, 100), 'Complete shot-plan.json.');
  check('composition exists', nonEmpty(setup.compositionPath, 100), 'Author the motion composition.');
  check('retained opening lossless frame exists', nonEmpty(setup.firstFrame, 1000), 'Retain frame 0 as a lossless PNG.');
  check('retained final lossless frame exists', nonEmpty(setup.finalFrame, 1000), 'Retain the final still frame as a lossless PNG.');

  const builderExists = setup.assetBuilderPath
    ? file(setup.assetBuilderPath)
    : existsSync(setup.projectDir) && readdirSync(setup.projectDir).some(
      (name) => /^build_motion.*\.(py|mjs|js)$/.test(name),
    );
  check('motion asset builder exists', builderExists, 'Add a deterministic build_motion* asset script.');
  if (setup.overlayGeometryPath) {
    check('versioned overlay geometry record exists', nonEmpty(setup.overlayGeometryPath, 100), 'Create the manifest-bound motion-overlay-geometry.json record.');
    check('generated overlay geometry module exists', nonEmpty(setup.generatedOverlayPath, 100), 'Run the motion asset builder to generate overlay geometry.');
    check('overlay asset manifest exists', nonEmpty(setup.assetManifestPath, 100), 'Run the motion asset builder to write its asset manifest.');
    check(
      'generated overlay geometry is fresh against manifest/source',
      overlayFreshness?.pass,
      overlayFreshness?.detail || 'Run build_motion_assets.mjs and re-render after the source or geometry changes.',
    );
    check(
      'render provenance is fresh against geometry and composition',
      renderProvenance?.pass,
      renderProvenance?.detail || 'Re-render and record the current Field Guide Motion Lab package.',
    );
  }

  const qa = read(setup.qaPath);
  check('motion QA decision passes', /Status:\*\*\s*pass\b/i.test(qa), 'Resolve motion QA and set Status to pass.');
  check('canonical outputs promoted', /Canonical outputs promoted:\*\*\s*yes\b/i.test(qa), 'Promote one canonical GIF/MP4 pair.');

  const composition = read(setup.compositionPath);
  check('composition locks approved visual', /\.\.\/assets\/visual\.png/.test(composition), 'Use the copied approved visual as the locked base.');
  check(
    'motion project copies the approved source visual',
    sourceExists && nonEmpty(setup.copiedVisual, 1000)
      && readFileSync(setup.visual).equals(readFileSync(setup.copiedVisual)),
    'Copy the selected approved source visual to videos/{slug}-motion/assets/visual.png.',
  );
  check('composition exposes deterministic timeline', /window\.__tl\s*=/.test(composition) && /window\.__dur\s*=/.test(composition), 'Expose window.__tl and window.__dur.');
  if (setup.overlayGeometryPath) {
    check(
      'composition consumes generated overlay geometry',
      /overlay-geometry\.generated\.js/.test(composition)
        && /window\.__fieldGuideOverlayGeometry/.test(composition)
        && /geometry\.segments\.forEach/.test(composition),
      'Load assets/overlay-geometry.generated.js and build the overlay from geometry.segments.',
    );
    check(
      'composition contains no inline SVG path coordinates',
      !/<path\b[^>]*\bd=/.test(composition) && !/\bM\d+(?:\.\d+)?\s+\d+/.test(composition),
      'Remove hand-coded SVG path data; keep coordinates only in the versioned geometry record.',
    );
  }

  let shotValid = false;
  try {
    const shot = JSON.parse(read(setup.shotPath));
    shotValid = Number(shot.durationSeconds) > 0 && Array.isArray(shot.beats) && shot.beats.length >= 4;
  } catch {}
  check('shot plan is valid', shotValid, 'Use valid JSON with durationSeconds and at least four beats.');

  check(
    setup.sourceHash ? 'source SHA-256 matches the Field Guide manifest' : 'source SHA-256 was computed from the approved still',
    Boolean(endpointReport?.report?.source?.sha256) && endpointReport.report.source.sha256_matches,
    endpointReport?.detail || 'Run the decoded-pixel endpoint verifier with the approved source still.',
  );
  check(
    'opening endpoint is raw-RGBA pixel-identical to source',
    endpointReport?.report?.first?.pass,
    endpointDetail(endpointReport, 'first', 'Render and retain a lossless opening PNG identical to the approved source.'),
  );
  check(
    'closing endpoint is raw-RGBA pixel-identical to source',
    endpointReport?.report?.final?.pass,
    endpointDetail(endpointReport, 'final', 'Render and retain a lossless final PNG identical to the approved source.'),
  );

  const gifProbe = probe(setup.gif);
  const mp4Probe = probe(setup.mp4);
  check('GIF media probe passes', gifProbe?.streams?.[0]?.width > 0 && Number(gifProbe?.format?.duration) > 0, 'Fix the GIF encoding.');
  check('MP4 media probe passes', mp4Probe?.streams?.[0]?.width > 0 && Number(mp4Probe?.format?.duration) > 0, 'Fix the MP4 encoding.');
  check('GIF stays below LinkedIn size ceiling', file(setup.gif) && statSync(setup.gif).size <= 100 * 1024 * 1024, 'Reduce the GIF below 100 MB.');
  check('GIF stays below 500 frames', Number(gifProbe?.streams?.[0]?.nb_frames) <= 500, 'Shorten or lower the GIF frame count to 500 or fewer.');
  check('GIF is at least 552 pixels wide', Number(gifProbe?.streams?.[0]?.width) >= 552, 'Export a GIF at least 552 pixels wide.');
  check('MP4 master is at least 720 pixels wide', Number(mp4Probe?.streams?.[0]?.width) >= 720, 'Export the website MP4 master at least 720 pixels wide.');

  if (endpointReport?.report?.source?.sha256) {
    console.log(`SOURCE SHA-256 ${endpointReport.report.source.sha256}`);
  }
  for (const item of checks) {
    console.log(`${item.pass ? 'PASS' : 'FAIL'} ${item.label}`);
    if (!item.pass) console.log(`     ${item.fix}`);
  }

  const failures = checks.filter((item) => !item.pass);
  if (failures.length) {
    console.error(`\n${failures.length} motion package check(s) failed.`);
    process.exitCode = 1;
    return;
  }

  console.log(`\nMotion package audit passed (${setup.mode}): ${relative(repoDir, setup.postDir)}`);
}

try {
  main();
} catch (error) {
  console.error(`Motion package audit failed: ${error.message}`);
  process.exitCode = 2;
}
