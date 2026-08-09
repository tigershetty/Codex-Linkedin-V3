#!/usr/bin/env node
/**
 * Validate a Creative Composition Packet.
 *
 * A Working Infographic must prove three things before it can be called
 * `valid_ready`: its reader-value candidate is genuinely build-ready, its
 * source roles point to canonical reviewed records, and three materially
 * different low-fidelity objects existed before one route was selected.
 *
 * This is a route-admission check. It is not a visual taste oracle or a
 * publication approval.
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateResourceCandidateCard } from './validate-resource-candidate-card.mjs';

const STATUS = new Set(['draft', 'routes_ready', 'route_selected', 'valid_ready', 'killed']);
const OBJECTS = new Set(['decision_path', 'comparison', 'tradeoff_field', 'diagnostic', 'system_map', 'taxonomy', 'maturity_model', 'sequence', 'before_after', 'data_display', 'value_driver_tree', 'other']);
const SELECT = new Set(['pending', 'select', 'hybridise', 'kill']);
const DIRECTION_EXTENSIONS = new Set(['.md', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.pdf']);
const REVIEW_EXTENSIONS = new Set(['.md', '.json', '.txt']);
const ACTIVE_STATUSES = new Set(['routes_ready', 'route_selected', 'valid_ready']);

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const SETUP_ROOT = resolve(SCRIPT_DIR, '..');
const ROLE_RULES = {
  information_mechanism: {
    corpus: 'pierri',
    canonicalRoot: 'references/creative-review/pierri-forensics/records',
    mechanismPrefixes: ['/transferable_mechanism/', '/visual_anatomy/', '/motion/'],
    antiCopyPointer: '/anti_copy_boundary',
  },
  attention_or_utility: {
    corpus: 'top100',
    canonicalRoot: 'references/creative-review/top100-forensics',
    mechanismPrefixes: ['/recombination/', '/attention_physics/', '/content_mechanics/', '/visual_forensics/'],
    antiCopyPointer: '/recombination/anti_copy_boundary',
  },
  caption_mechanism: {
    corpus: 'top100',
    canonicalRoot: 'references/creative-review/top100-forensics',
    mechanismPrefixes: ['/source_context/caption_'],
    antiCopyPointer: '/recombination/anti_copy_boundary',
  },
};

const PACKET_FIELDS = new Set([
  '$schema',
  'schema_version',
  'status',
  'packet_id',
  'candidate_card_path',
  'source_roles',
  'routes',
  'selection',
  'selected_route_review_path',
  'notes',
]);
const SOURCE_ROLE_FIELDS = new Set(['corpus', 'record_id', 'record_path', 'canonical_mechanism_pointer', 'anti_copy_boundary_pointer']);
const ROUTE_FIELDS = new Set([
  'route_id',
  'semantic_object',
  'direction_artifact_path',
  'spatial_truth',
  'first_frame',
  'reading_route',
  'density_translation',
  'visual_carries',
  'caption_carries',
  'anti_copy_transformation',
  'kill_condition',
]);
const SELECTION_FIELDS = new Set(['decision', 'selected_route_id', 'reason']);

function text(value) { return typeof value === 'string' ? value.trim() : ''; }
function object(value) { return value && typeof value === 'object' && !Array.isArray(value); }
function array(value) { return Array.isArray(value); }
function requireText(errors, value, label) { if (!text(value)) errors.push(`${label} is required`); }
function requireString(errors, value, label) { if (typeof value !== 'string') errors.push(`${label} must be a string`); }

function validateKnownFields(errors, value, allowed, label) {
  if (!object(value)) return;
  Object.keys(value).forEach((field) => {
    if (!allowed.has(field)) errors.push(`${label}.${field} is not allowed by the Creative Composition Packet contract`);
  });
}

function requireFields(errors, value, fields, label) {
  fields.forEach((field) => {
    if (!(field in value)) errors.push(`${label}.${field} is required`);
  });
}

function readJson(path, label, errors) {
  if (!existsSync(path)) {
    errors.push(`${label} does not exist: ${path}`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    errors.push(`${label} is not valid JSON: ${error.message}`);
    return null;
  }
}

function inside(parent, child) {
  const result = relative(parent, child);
  return result && !result.startsWith(`..${sep}`) && result !== '..' && !result.startsWith('..');
}

function validSha256(value) {
  return typeof value === 'string' && /^[a-f0-9]{64}$/i.test(value);
}

function decodePointerToken(token) {
  return token.replace(/~1/g, '/').replace(/~0/g, '~');
}

function resolveJsonPointer(record, pointer) {
  if (typeof pointer !== 'string' || !pointer.startsWith('/')) return { found: false, value: undefined };
  let current = record;
  for (const rawToken of pointer.slice(1).split('/')) {
    const token = decodePointerToken(rawToken);
    if (array(current)) {
      if (!/^(0|[1-9]\d*)$/.test(token) || Number(token) >= current.length) return { found: false, value: undefined };
      current = current[Number(token)];
      continue;
    }
    if (!object(current) || !(token in current)) return { found: false, value: undefined };
    current = current[token];
  }
  return { found: true, value: current };
}

function usefulCanonicalValue(value) {
  if (typeof value === 'string') return Boolean(value.trim());
  if (array(value)) return value.length > 0 && value.every((item) => typeof item === 'string' && item.trim());
  return false;
}

function hashFile(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function validateCanonicalRecordLocation(role, reference, root, errors) {
  const rule = ROLE_RULES[role];
  const label = `source_roles.${role}`;
  if (!text(reference.record_path)) return null;
  const recordPath = resolve(root, reference.record_path);
  const canonicalRoot = resolve(root, rule.canonicalRoot);
  if (!inside(canonicalRoot, recordPath)) {
    errors.push(`${label}.record_path must point inside the canonical ${rule.corpus} forensic corpus`);
    return null;
  }
  if (!recordPath.endsWith(`${sep}${reference.record_id}.json`)) {
    errors.push(`${label}.record_path must name its canonical record_id file`);
  }
  return recordPath;
}

function validatePierriCanonicalRecord(record, reference, label, errors) {
  const expectedId = `PIERRI-${String(record.asset_id).padStart(3, '0')}`;
  if (record.review_status !== 'reviewed_direct_asset') errors.push(`${label} must use a directly reviewed Pierri asset`);
  if (expectedId !== reference.record_id) errors.push(`${label}.record_id does not match the canonical Pierri asset_id`);
  if (!validSha256(record.source_asset?.sha256)) errors.push(`${label} canonical Pierri record is missing source_asset.sha256`);
  if (!text(record.inspection?.reviewer)) errors.push(`${label} canonical Pierri record is missing direct inspection evidence`);
}

function validateTop100CanonicalRecord(record, reference, label, errors) {
  if (record.forensic_record_status !== 'manual_forensic_review') errors.push(`${label} must use a direct-reviewed Top-100 forensic record`);
  if (record.reference_id !== reference.record_id) errors.push(`${label}.record_id does not match the canonical Top-100 record`);
  if (record.asset?.status !== 'manually_reviewed') errors.push(`${label} canonical Top-100 asset must be manually reviewed`);
  if (!validSha256(record.asset?.sha256)) errors.push(`${label} canonical Top-100 record is missing asset.sha256`);
  if (record.asset?.manual_review_evidence?.asset_sha256 !== record.asset?.sha256) {
    errors.push(`${label} canonical Top-100 manual review evidence must match the source asset hash`);
  }
}

function validateReference(role, reference, root, errors, loadedSources) {
  const label = `source_roles.${role}`;
  const rule = ROLE_RULES[role];
  if (!object(reference)) {
    errors.push(`${label} must be an object`);
    return;
  }
  validateKnownFields(errors, reference, SOURCE_ROLE_FIELDS, label);
  requireFields(errors, reference, SOURCE_ROLE_FIELDS, label);
  ['corpus', 'record_id', 'record_path', 'canonical_mechanism_pointer', 'anti_copy_boundary_pointer'].forEach((field) => requireText(errors, reference[field], `${label}.${field}`));
  if (reference.corpus !== rule.corpus) errors.push(`${label}.corpus must be ${rule.corpus}; this role cannot be substituted by another corpus`);

  const recordPath = validateCanonicalRecordLocation(role, reference, root, errors);
  if (!recordPath) return;
  const record = readJson(recordPath, `${label}.record_path`, errors);
  if (!record) return;

  if (rule.corpus === 'pierri') validatePierriCanonicalRecord(record, reference, label, errors);
  else validateTop100CanonicalRecord(record, reference, label, errors);

  const pointer = text(reference.canonical_mechanism_pointer);
  if (pointer && !rule.mechanismPrefixes.some((prefix) => pointer.startsWith(prefix))) {
    errors.push(`${label}.canonical_mechanism_pointer must select an allowed canonical ${role.replaceAll('_', ' ')} field`);
  }
  const selected = resolveJsonPointer(record, pointer);
  if (!selected.found || !usefulCanonicalValue(selected.value)) {
    errors.push(`${label}.canonical_mechanism_pointer must resolve to a non-empty canonical text field or text array`);
  }

  if (reference.anti_copy_boundary_pointer !== rule.antiCopyPointer) {
    errors.push(`${label}.anti_copy_boundary_pointer must be ${rule.antiCopyPointer}; anti-copy text is loaded from the canonical record, not rewritten here`);
  }
  const boundary = resolveJsonPointer(record, reference.anti_copy_boundary_pointer);
  if (!boundary.found || !usefulCanonicalValue(boundary.value)) {
    errors.push(`${label}.anti_copy_boundary_pointer must resolve to the canonical anti-copy boundary`);
  }

  if (role === 'caption_mechanism') {
    const context = record.source_context;
    const hasCaptionContext = context?.caption_available === true
      && (text(context.caption_hook) || (array(context.caption_argument_segments) && context.caption_argument_segments.some((segment) => text(segment))));
    if (!hasCaptionContext) errors.push(`${label} requires canonical caption context with an available hook or argument segment`);
    if (!validSha256(context?.caption_sha256)) errors.push(`${label} canonical caption context is missing caption_sha256`);
  }

  loadedSources.push({
    role,
    corpus: rule.corpus,
    record_id: reference.record_id,
    mechanism_pointer: pointer,
  });
}

function validateCandidate(candidatePath, errors) {
  const candidate = readJson(candidatePath, 'candidate_card_path', errors);
  if (!candidate) return null;
  const candidateErrors = validateResourceCandidateCard(candidate);
  candidateErrors.forEach((error) => errors.push(`candidate_card_path failed full Resource Candidate Card validation: ${error}`));
  if (candidate.status !== 'build_ready') errors.push('routes_ready, route_selected, and valid_ready packets require candidate_card_path.status=build_ready');
  return candidate;
}

function validateDirectionArtifact(route, label, root, errors) {
  const artifactPath = text(route.direction_artifact_path);
  if (!artifactPath) return null;
  const extension = extname(artifactPath).toLowerCase();
  if (!DIRECTION_EXTENSIONS.has(extension)) {
    errors.push(`${label}.direction_artifact_path must be a low-fidelity .md, .svg, or mockup file (.png, .jpg, .jpeg, .webp, .pdf)`);
    return null;
  }
  const path = resolve(root, artifactPath);
  if (!existsSync(path)) {
    errors.push(`${label}.direction_artifact_path does not exist: ${path}`);
    return null;
  }
  if (!statSync(path).isFile() || statSync(path).size === 0) {
    errors.push(`${label}.direction_artifact_path must be a non-empty file`);
    return null;
  }
  if (extension === '.md') {
    const content = readFileSync(path, 'utf8').trim();
    if (content.length < 80) errors.push(`${label}.direction_artifact_path markdown is too slight to evidence a real route`);
    if (!content.includes(route.semantic_object)) errors.push(`${label}.direction_artifact_path markdown must name its declared semantic_object`);
  }
  return { path, hash: hashFile(path) };
}

function validateRoute(route, index, root, errors) {
  const label = `routes[${index}]`;
  if (!object(route)) {
    errors.push(`${label} must be an object`);
    return { id: '', artifact: null };
  }
  validateKnownFields(errors, route, ROUTE_FIELDS, label);
  requireFields(errors, route, ROUTE_FIELDS, label);
  ['route_id', 'direction_artifact_path', 'spatial_truth', 'first_frame', 'reading_route', 'visual_carries', 'caption_carries', 'anti_copy_transformation', 'kill_condition'].forEach((field) => requireText(errors, route[field], `${label}.${field}`));
  if (!OBJECTS.has(route.semantic_object)) errors.push(`${label}.semantic_object is invalid`);
  if (!array(route.density_translation) || route.density_translation.length === 0 || route.density_translation.some((item) => !text(item))) {
    errors.push(`${label}.density_translation needs at least one earned micro-unit`);
  }
  return { id: text(route.route_id), artifact: validateDirectionArtifact(route, label, root, errors) };
}

function validateSelection(selection, errors) {
  const label = 'selection';
  if (!object(selection)) {
    errors.push(`${label} must be an object`);
    return;
  }
  validateKnownFields(errors, selection, SELECTION_FIELDS, label);
  requireFields(errors, selection, SELECTION_FIELDS, label);
  if (!SELECT.has(selection.decision)) errors.push('selection.decision is invalid');
  if (!(typeof selection.selected_route_id === 'string' || selection.selected_route_id === null)) errors.push('selection.selected_route_id must be a string or null');
  requireString(errors, selection.reason, 'selection.reason');
}

function validateSelectedRouteReview(pathValue, selectedRouteId, root, errors) {
  const label = 'selected_route_review_path';
  const sourcePath = text(pathValue);
  if (!sourcePath) {
    errors.push(`${label} is required before a packet can be valid_ready`);
    return;
  }
  const extension = extname(sourcePath).toLowerCase();
  if (!REVIEW_EXTENSIONS.has(extension)) {
    errors.push(`${label} must be a concise .md, .txt, or .json review artifact`);
    return;
  }
  const path = resolve(root, sourcePath);
  if (!existsSync(path) || !statSync(path).isFile() || statSync(path).size === 0) {
    errors.push(`${label} must point to a non-empty review artifact`);
    return;
  }
  const content = readFileSync(path, 'utf8').trim();
  if (content.length < 80) errors.push(`${label} is too slight to document a selected-route review`);
  if (selectedRouteId && !content.includes(selectedRouteId)) {
    errors.push(`${label} must name the selected_route_id so the review cannot silently apply to another route`);
  }
}

function usage() {
  return `Usage:\n  node scripts/validate-creative-composition-packet.mjs --input <creative-composition-packet.json>\n  node scripts/validate-creative-composition-packet.mjs <creative-composition-packet.json>\n\nThis checks source provenance, route diversity, and low-fidelity route evidence. It does not approve a final visual or publication.\n`;
}

function parseArgs(args) {
  const options = { positional: [] };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--input') {
      options.input = args[index + 1];
      index += 1;
    } else if (arg.startsWith('--input=')) options.input = arg.slice('--input='.length);
    else if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
    else options.positional.push(arg);
  }
  return options;
}

export function validateCreativeCompositionPacket(packet, { root = SETUP_ROOT } = {}) {
  const errors = [];
  const loadedSources = [];
  if (!object(packet)) return { errors: ['root must be an object'], loadedSources };

  validateKnownFields(errors, packet, PACKET_FIELDS, 'root');
  const required = ['schema_version', 'status', 'packet_id', 'candidate_card_path', 'source_roles', 'routes', 'selection'];
  requireFields(errors, packet, required, 'root');
  if (packet.schema_version !== '1.0.0') errors.push('schema_version must be 1.0.0');
  if (!STATUS.has(packet.status)) errors.push('status is invalid');
  ['packet_id', 'candidate_card_path'].forEach((field) => requireString(errors, packet[field], field));
  if ('$schema' in packet) requireString(errors, packet.$schema, '$schema');
  if ('notes' in packet) requireString(errors, packet.notes, 'notes');
  if ('selected_route_review_path' in packet && packet.selected_route_review_path !== null) requireString(errors, packet.selected_route_review_path, 'selected_route_review_path');
  validateSelection(packet.selection, errors);

  const active = ACTIVE_STATUSES.has(packet.status);
  if (active) {
    const candidatePath = text(packet.candidate_card_path) ? resolve(root, packet.candidate_card_path) : null;
    if (!candidatePath) errors.push('candidate_card_path is required for an active packet');
    else validateCandidate(candidatePath, errors);

    const roles = packet.source_roles;
    if (!object(roles)) errors.push('source_roles must be an object');
    else {
      validateKnownFields(errors, roles, new Set(Object.keys(ROLE_RULES)), 'source_roles');
      Object.keys(ROLE_RULES).forEach((role) => validateReference(role, roles[role], root, errors, loadedSources));
    }
  } else if (!object(packet.source_roles)) {
    errors.push('source_roles must be an object');
  }

  const routeIds = new Set();
  const semanticObjects = new Set();
  const artifactPaths = new Set();
  const artifactHashes = new Set();
  if (!array(packet.routes)) errors.push('routes must be an array');
  else if (active) {
    packet.routes.forEach((route, index) => {
      const { id, artifact } = validateRoute(route, index, root, errors);
      if (id) {
        if (routeIds.has(id)) errors.push(`routes contains duplicate route_id: ${id}`);
        routeIds.add(id);
      }
      if (route?.semantic_object) semanticObjects.add(route.semantic_object);
      if (artifact) {
        if (artifactPaths.has(artifact.path)) errors.push('routes must not reuse one low-fidelity direction artifact path');
        if (artifactHashes.has(artifact.hash)) errors.push('routes must not reuse identical low-fidelity direction artifacts');
        artifactPaths.add(artifact.path);
        artifactHashes.add(artifact.hash);
      }
    });
    if (packet.routes.length < 3) errors.push('routes_ready, route_selected, and valid_ready packets need at least three routes');
    if (semanticObjects.size < 3) errors.push('routes must contain at least three different semantic objects; colour or headline variants do not count');
    if (artifactPaths.size < 3) errors.push('routes need three distinct, material low-fidelity direction artifacts');
  }

  if (['route_selected', 'valid_ready'].includes(packet.status)) {
    const selection = packet.selection;
    if (!['select', 'hybridise'].includes(selection?.decision)) errors.push('route_selected and valid_ready require selection.decision=select or hybridise');
    requireText(errors, selection?.selected_route_id, 'selection.selected_route_id');
    requireText(errors, selection?.reason, 'selection.reason');
    if (text(selection?.selected_route_id) && !routeIds.has(selection.selected_route_id)) errors.push('selection.selected_route_id must name a declared route');
  }

  if (packet.status === 'valid_ready') {
    validateSelectedRouteReview(packet.selected_route_review_path, text(packet.selection?.selected_route_id), root, errors);
  }

  return { errors, loadedSources };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }
  const input = options.input ?? options.positional[0];
  if (!input) throw new Error('Provide --input <creative-composition-packet.json>.');
  const path = resolve(process.cwd(), input);
  const errors = [];
  const packet = readJson(path, 'input', errors);
  if (!packet) {
    errors.forEach((error) => console.error(`FAIL ${error}`));
    process.exitCode = 1;
    return;
  }
  const result = validateCreativeCompositionPacket(packet, { root: process.cwd() });
  const allErrors = [...errors, ...result.errors];
  if (allErrors.length) {
    allErrors.forEach((error) => console.error(`FAIL ${error}`));
    process.exitCode = 1;
    return;
  }
  console.log(`Creative Composition Packet valid: ${packet.packet_id || '[draft]'} | status=${packet.status}`);
  if (result.loadedSources.length) {
    console.log(`Canonical source roles loaded: ${result.loadedSources.map((source) => `${source.role}=${source.record_id}`).join(', ')}`);
  }
  console.log('valid_ready means the route package may enter visual production; it is not final-visual or publication approval.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(`FAIL ${error.message}`);
    process.exitCode = 1;
  }
}
