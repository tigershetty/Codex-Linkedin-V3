#!/usr/bin/env node

/**
 * Validate the deterministic handoff between a Field Guide master and its
 * optional motion experiment. This is deliberately schema/contract validation;
 * it does not decide whether a topic deserves motion or make a performance
 * prediction.
 */

import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = resolve(fileURLToPath(new URL('.', import.meta.url)));
const infographicDir = resolve(scriptDir, '..');
const repoDir = resolve(infographicDir, '..');

const STATUSES = new Set(['template', 'draft', 'ready_for_qa', 'selected']);
const SOURCE_KINDS = new Set(['figma_field_guide']);
const CHANGE_TYPES = new Set(['state_change', 'path', 'state_or_path', 'regrouping', 'cause_and_effect']);
const REGION_ROLES = new Set(['signal_origin', 'decision_path', 'boundary_or_exception', 'state', 'action']);
const REGION_MOTION = new Set(['highlight', 'path_trace', 'state_change', 'locked']);

function usage() {
  return `Usage:
  node scripts/validate-field-guide-motion-manifest.mjs --input <manifest.json> [--verify-files]
  node scripts/validate-field-guide-motion-manifest.mjs <manifest.json> [--verify-files]

The template status checks structural placeholders only. A draft, ready_for_qa,
or selected manifest must contain real Field Guide source, package, semantic
region, timeline, and motion-eligibility records. --verify-files additionally
checks the selected still and its SHA-256 after an approved local export.
`;
}

function parseArgs(args) {
  const options = { positional: [] };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--verify-files') options.verifyFiles = true;
    else if (arg === '--input') {
      options.input = args[index + 1];
      index += 1;
    } else if (arg.startsWith('--input=')) options.input = arg.slice('--input='.length);
    else if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
    else options.positional.push(arg);
  }
  return options;
}

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function object(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function list(value) {
  return Array.isArray(value);
}

function addRequired(errors, value, label) {
  if (!text(value)) errors.push(`${label} is required`);
}

function isTemplate(spec) {
  return spec.status === 'template';
}

function isSafeRepoRelativePath(value) {
  const candidate = text(value);
  if (!candidate || candidate.startsWith('/') || candidate.includes('\\')) return false;
  const resolved = resolve(repoDir, candidate);
  const relation = relative(repoDir, resolved);
  return relation !== '' && relation !== '..' && !relation.startsWith(`..${sep}`);
}

function requireSafePath(errors, value, label) {
  if (!isSafeRepoRelativePath(value)) errors.push(`${label} must be a non-empty repository-relative path`);
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function containsTemplatePlaceholder(value) {
  return /REPLACE|\[.*\]/i.test(text(value));
}

function isInside(parent, candidate) {
  const relation = relative(parent, candidate);
  return relation !== '' && relation !== '..' && !relation.startsWith(`..${sep}`);
}

function validateTemplateOrLiveShape(spec, errors) {
  addRequired(errors, spec.motion_id, 'motion_id');
  addRequired(errors, spec.title, 'title');
  addRequired(errors, spec.field_guide_spec, 'field_guide_spec');
  if (!object(spec.source)) {
    errors.push('source must be an object');
  } else {
    addRequired(errors, spec.source.kind, 'source.kind');
    addRequired(errors, spec.source.figma_file_key, 'source.figma_file_key');
    addRequired(errors, spec.source.still_node_id, 'source.still_node_id');
    addRequired(errors, spec.source.motion_frame_node_id, 'source.motion_frame_node_id');
    addRequired(errors, spec.source.selected_still, 'source.selected_still');
    addRequired(errors, spec.source.sha256, 'source.sha256');
  }
  if (!object(spec.package)) {
    errors.push('package must be an object');
  } else {
    for (const key of ['data_directory', 'motion_project_directory', 'motion_brief', 'shot_plan', 'composition', 'asset_builder', 'overlay_geometry', 'render_provenance']) {
      addRequired(errors, spec.package[key], `package.${key}`);
    }
    if (!object(spec.package.outputs)) {
      errors.push('package.outputs must be an object');
    } else {
      for (const key of ['gif', 'mp4', 'qa', 'first_frame', 'final_frame']) {
        addRequired(errors, spec.package.outputs[key], `package.outputs.${key}`);
      }
    }
  }
  if (!object(spec.eligibility)) {
    errors.push('eligibility must be an object');
  } else {
    for (const key of ['statement', 'change_type', 'reader_value']) addRequired(errors, spec.eligibility[key], `eligibility.${key}`);
    if (typeof spec.eligibility.not_a_performance_claim !== 'boolean') {
      errors.push('eligibility.not_a_performance_claim must be boolean');
    }
  }
  if (!list(spec.locked_elements) || spec.locked_elements.length === 0) {
    errors.push('locked_elements must be a non-empty array');
  }
  if (!list(spec.semantic_regions) || spec.semantic_regions.length < 3) {
    errors.push('semantic_regions must contain at least three regions');
  }
  if (!object(spec.timeline)) {
    errors.push('timeline must be an object');
  } else {
    for (const key of ['duration_seconds', 'opening_still_seconds', 'final_still_seconds']) {
      if (!Number.isFinite(spec.timeline[key])) errors.push(`timeline.${key} must be a number`);
    }
    if (!list(spec.timeline.beats) || spec.timeline.beats.length < 3) {
      errors.push('timeline.beats must contain at least three beats');
    }
  }
}

function validateLiveManifest(spec, errors, options) {
  if (!SOURCE_KINDS.has(spec.source?.kind)) {
    errors.push(`source.kind must be one of: ${[...SOURCE_KINDS].join(', ')}`);
  }
  for (const [label, value] of [
    ['field_guide_spec', spec.field_guide_spec],
    ['source.selected_still', spec.source?.selected_still],
    ['package.data_directory', spec.package?.data_directory],
    ['package.motion_project_directory', spec.package?.motion_project_directory],
    ['package.overlay_geometry', spec.package?.overlay_geometry],
  ]) requireSafePath(errors, value, label);
  if (!String(spec.package?.data_directory || '').startsWith('infographic-setup/data/')) {
    errors.push('package.data_directory must be inside infographic-setup/data/');
  }
  if (!String(spec.package?.motion_project_directory || '').startsWith('videos/')) {
    errors.push('package.motion_project_directory must be inside videos/');
  }
  if (!/^[a-f0-9]{64}$/i.test(text(spec.source?.sha256))) {
    errors.push('source.sha256 must be the 64-character SHA-256 of the approved local still');
  }
  for (const [label, value] of [
    ['source.figma_file_key', spec.source?.figma_file_key],
    ['source.still_node_id', spec.source?.still_node_id],
    ['source.motion_frame_node_id', spec.source?.motion_frame_node_id],
    ['source.selected_still', spec.source?.selected_still],
  ]) {
    if (containsTemplatePlaceholder(value)) errors.push(`${label} cannot contain a template placeholder in a live manifest`);
  }

  const packageDir = resolve(repoDir, spec.package?.data_directory || '');
  const motionProjectDir = resolve(repoDir, spec.package?.motion_project_directory || '');
  const sourceStill = resolve(repoDir, spec.source?.selected_still || '');
  const fieldGuideSpec = resolve(repoDir, spec.field_guide_spec || '');
  const overlayGeometry = resolve(packageDir, spec.package?.overlay_geometry || '');
  const renderProvenance = resolve(motionProjectDir, spec.package?.render_provenance || '');
  if (!isInside(packageDir, sourceStill)) {
    errors.push('source.selected_still must sit inside package.data_directory');
  }
  if (!isInside(packageDir, fieldGuideSpec)) {
    errors.push('field_guide_spec must sit inside package.data_directory');
  }
  if (!isInside(packageDir, overlayGeometry)) {
    errors.push('package.overlay_geometry must sit inside package.data_directory');
  }
  if (!isInside(motionProjectDir, renderProvenance)) {
    errors.push('package.render_provenance must sit inside package.motion_project_directory');
  }

  const eligibility = spec.eligibility ?? {};
  if (!String(eligibility.statement || '').startsWith('Motion helps because')) {
    errors.push('eligibility.statement must start with "Motion helps because"');
  }
  if (!CHANGE_TYPES.has(eligibility.change_type)) {
    errors.push(`eligibility.change_type must be one of: ${[...CHANGE_TYPES].join(', ')}`);
  }
  if (eligibility.not_a_performance_claim !== true) {
    errors.push('eligibility.not_a_performance_claim must be true');
  }

  const ids = new Set();
  let movingRegions = 0;
  for (const [index, region] of (spec.semantic_regions ?? []).entries()) {
    const label = `semantic_regions[${index}]`;
    if (!object(region)) {
      errors.push(`${label} must be an object`);
      continue;
    }
    for (const key of ['id', 'figma_node_id', 'role', 'motion_mode', 'communication_job']) {
      addRequired(errors, region[key], `${label}.${key}`);
    }
    if (containsTemplatePlaceholder(region.figma_node_id)) {
      errors.push(`${label}.figma_node_id cannot contain a template placeholder in a live manifest`);
    }
    if (ids.has(region.id)) errors.push(`${label}.id is duplicated: ${region.id}`);
    ids.add(region.id);
    if (!REGION_ROLES.has(region.role)) errors.push(`${label}.role is not a recognised Field Guide motion role`);
    if (!REGION_MOTION.has(region.motion_mode)) errors.push(`${label}.motion_mode is not a recognised motion mode`);
    if (region.motion_mode !== 'locked') movingRegions += 1;
  }
  if (movingRegions === 0) errors.push('semantic_regions needs at least one non-locked motion unit');

  const timeline = spec.timeline ?? {};
  if (timeline.duration_seconds < 4 || timeline.duration_seconds > 12) {
    errors.push('timeline.duration_seconds must be between 4 and 12 seconds for a lab proof');
  }
  if (timeline.opening_still_seconds < 0.4) errors.push('timeline.opening_still_seconds must be at least 0.4');
  if (timeline.final_still_seconds < 1.2) errors.push('timeline.final_still_seconds must be at least 1.2');
  let lastStart = -1;
  for (const [index, beat] of (timeline.beats ?? []).entries()) {
    const label = `timeline.beats[${index}]`;
    if (!object(beat)) {
      errors.push(`${label} must be an object`);
      continue;
    }
    for (const key of ['id', 'communication_job']) addRequired(errors, beat[key], `${label}.${key}`);
    if (!Number.isFinite(beat.start) || !Number.isFinite(beat.end) || beat.start < 0 || beat.end <= beat.start) {
      errors.push(`${label} needs numeric start/end with 0 <= start < end`);
    } else {
      if (beat.start < lastStart) errors.push(`${label}.start must not move backwards in the reading order`);
      if (beat.end > timeline.duration_seconds) errors.push(`${label}.end must not exceed timeline.duration_seconds`);
      lastStart = beat.start;
    }
  }

  if (options.verifyFiles && errors.length === 0) {
    const fieldGuidePath = resolve(repoDir, spec.field_guide_spec);
    if (!existsSync(fieldGuidePath)) {
      errors.push(`Field Guide spec does not exist: ${spec.field_guide_spec}`);
    } else {
      try {
        const fieldGuide = JSON.parse(readFileSync(fieldGuidePath, 'utf8'));
        if (!text(fieldGuide.field_guide_id)) {
          errors.push('Field Guide spec field_guide_id is required for a motion experiment');
        } else if (fieldGuide.field_guide_id !== spec.motion_id) {
          errors.push(`Field Guide spec field_guide_id ${fieldGuide.field_guide_id} does not match motion_id ${spec.motion_id}`);
        }
      } catch (error) {
        errors.push(`Field Guide spec is not valid JSON: ${error.message}`);
      }
    }
    const sourcePath = resolve(repoDir, spec.source.selected_still);
    if (!existsSync(sourcePath)) {
      errors.push(`selected source still does not exist: ${spec.source.selected_still}`);
    } else if (sha256(sourcePath) !== spec.source.sha256.toLowerCase()) {
      errors.push('source.sha256 does not match the current selected source still');
    }
    const overlayPath = resolve(packageDir, spec.package.overlay_geometry);
    if (!existsSync(overlayPath)) {
      errors.push(`overlay geometry does not exist: ${spec.package.overlay_geometry}`);
    } else {
      try {
        const overlay = JSON.parse(readFileSync(overlayPath, 'utf8'));
        if (!text(overlay.geometry_id) || overlay.motion_id !== spec.motion_id) {
          errors.push('overlay geometry must carry a geometry_id and match motion_id');
        }
      } catch (error) {
        errors.push(`overlay geometry is not valid JSON: ${error.message}`);
      }
    }
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }
  const input = options.input ?? options.positional[0];
  if (!input || options.positional.length > (options.input ? 0 : 1)) {
    throw new Error('Provide exactly one manifest path.');
  }
  const sourcePath = resolve(input);
  if (!existsSync(sourcePath)) throw new Error(`Manifest does not exist: ${sourcePath}`);
  const spec = JSON.parse(readFileSync(sourcePath, 'utf8'));
  const errors = [];
  if (!STATUSES.has(spec.status)) {
    errors.push(`status must be one of: ${[...STATUSES].join(', ')}`);
  }
  validateTemplateOrLiveShape(spec, errors);
  if (!isTemplate(spec)) validateLiveManifest(spec, errors, options);
  if (errors.length) {
    console.error(`Field Guide motion manifest invalid: ${sourcePath}`);
    errors.forEach((error) => console.error(`- ${error}`));
    process.exitCode = 1;
    return;
  }
  const mode = isTemplate(spec) ? 'template' : `${spec.status}${options.verifyFiles ? ' + file verification' : ''}`;
  console.log(`Field Guide motion manifest valid (${mode}): ${spec.motion_id}`);
}

try {
  main();
} catch (error) {
  console.error(`Field Guide motion manifest validation failed: ${error.message}`);
  process.exitCode = 2;
}
