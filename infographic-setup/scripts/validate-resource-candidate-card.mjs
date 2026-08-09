#!/usr/bin/env node
/**
 * Validate a Resource Candidate Card.
 *
 * The card is deliberately a decision record, not a numeric score. Its job is
 * to stop an attractive visual from standing in for a concrete reader problem.
 * A Composition Packet runs this same validator again before it can use the
 * card as a build-ready input.
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const STATUS = new Set(['draft', 'explore', 'build_ready', 'reframed', 'parked']);
const CONFIDENCE = new Set(['observed', 'documented_method', 'tiger_judgment', 'hypothesis']);
const SOURCE_TYPES = new Set(['public_research', 'official_guidance', 'documented_case', 'tiger_source', 'saved_reference_signal', 'market_scan', 'hypothesis']);
const PUBLIC_STATUS = new Set(['supported', 'framework_logic', 'tiger_judgment', 'illustrative_only', 'not_public_ready']);
const CLAIM_MODES = new Set(['framework', 'operating_method', 'evidence_display', 'case', 'calculation', 'tiger_judgment', 'hypothesis_or_simulation']);
const MARKET_STATUS = new Set(['not_started', 'lightweight_reviewed', 'not_applicable_with_reason']);
const DECISIONS = new Set(['explore', 'build', 'reframe', 'park']);

const ROOT_FIELDS = new Set([
  '$schema',
  'schema_version',
  'status',
  'candidate_id',
  'reader_contract',
  'problem_signal',
  'immediate_handle',
  'useful_angle',
  'density_inventory',
  'claim_route',
  'market_scan',
  'knowledge_map',
  'decision',
  'notes',
]);

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function object(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function array(value) {
  return Array.isArray(value);
}

function nonPlaceholder(value) {
  const candidate = text(value);
  return candidate && !/(?:^|[-_])(draft|placeholder|todo|tbd)(?:$|[-_])/i.test(candidate);
}

function requireText(errors, value, label) {
  if (!text(value)) errors.push(`${label} is required`);
}

function requireString(errors, value, label) {
  if (typeof value !== 'string') errors.push(`${label} must be a string`);
}

function requireArrayOfStrings(errors, value, label) {
  if (!array(value)) {
    errors.push(`${label} must be an array`);
    return;
  }
  value.forEach((item, index) => requireString(errors, item, `${label}[${index}]`));
}

function validateKnownFields(errors, value, allowed, label) {
  if (!object(value)) return;
  Object.keys(value).forEach((field) => {
    if (!allowed.has(field)) errors.push(`${label}.${field} is not allowed by the Resource Candidate Card contract`);
  });
}

function requireFields(errors, value, fields, label) {
  fields.forEach((field) => {
    if (!(field in value)) errors.push(`${label}.${field} is required`);
  });
}

function validateReaderContract(reader, errors) {
  const label = 'reader_contract';
  if (!object(reader)) {
    errors.push(`${label} must be an object`);
    return;
  }
  const fields = ['reader', 'exact_work_moment', 'reader_language', 'broad_bridge'];
  validateKnownFields(errors, reader, new Set(fields), label);
  requireFields(errors, reader, fields, label);
  fields.forEach((field) => requireString(errors, reader[field], `${label}.${field}`));
}

function validateSourceRecord(source, index, errors) {
  const label = `problem_signal.source_records[${index}]`;
  if (!object(source)) {
    errors.push(`${label} must be an object`);
    return;
  }
  const required = ['source_id', 'source_type', 'location', 'use'];
  validateKnownFields(errors, source, new Set([...required, 'limitation']), label);
  requireFields(errors, source, required, label);
  ['source_id', 'location', 'use', 'limitation'].forEach((field) => {
    if (field in source) requireString(errors, source[field], `${label}.${field}`);
  });
  ['source_id', 'source_type', 'location', 'use'].forEach((field) => requireText(errors, source[field], `${label}.${field}`));
  if (!SOURCE_TYPES.has(source.source_type)) errors.push(`${label}.source_type is invalid`);
}

function validateProblemSignal(signal, errors) {
  const label = 'problem_signal';
  if (!object(signal)) {
    errors.push(`${label} must be an object`);
    return;
  }
  const fields = ['observed_problem', 'source_records', 'confidence', 'unknowns'];
  validateKnownFields(errors, signal, new Set(fields), label);
  requireFields(errors, signal, fields, label);
  requireString(errors, signal.observed_problem, `${label}.observed_problem`);
  if (!array(signal.source_records)) errors.push(`${label}.source_records must be an array`);
  else signal.source_records.forEach((source, index) => validateSourceRecord(source, index, errors));
  if (!CONFIDENCE.has(signal.confidence)) errors.push(`${label}.confidence is invalid`);
  requireArrayOfStrings(errors, signal.unknowns, `${label}.unknowns`);
}

function validateImmediateHandle(handle, errors) {
  const label = 'immediate_handle';
  if (!object(handle)) {
    errors.push(`${label} must be an object`);
    return;
  }
  const fields = ['reader_can_do', 'before_after_difference', 'not_solved'];
  validateKnownFields(errors, handle, new Set(fields), label);
  requireFields(errors, handle, fields, label);
  fields.forEach((field) => requireString(errors, handle[field], `${label}.${field}`));
}

function validateUsefulAngle(angle, errors) {
  const label = 'useful_angle';
  if (!object(angle)) {
    errors.push(`${label} must be an object`);
    return;
  }
  const fields = ['familiar_version', 'specific_difference', 'reframe_if_generic'];
  validateKnownFields(errors, angle, new Set(fields), label);
  requireFields(errors, angle, fields, label);
  fields.forEach((field) => requireString(errors, angle[field], `${label}.${field}`));
}

function validateDensityItem(item, index, errors) {
  const label = `density_inventory[${index}]`;
  if (!object(item)) {
    errors.push(`${label} must be an object`);
    return;
  }
  const fields = ['unit', 'uncertainty_removed', 'support_route', 'public_status'];
  validateKnownFields(errors, item, new Set(fields), label);
  requireFields(errors, item, fields, label);
  ['unit', 'uncertainty_removed', 'support_route'].forEach((field) => requireText(errors, item[field], `${label}.${field}`));
  if (!PUBLIC_STATUS.has(item.public_status)) errors.push(`${label}.public_status is invalid`);
}

function validateClaimRoute(route, errors) {
  const label = 'claim_route';
  if (!object(route)) {
    errors.push(`${label} must be an object`);
    return;
  }
  const fields = ['mode', 'public_wording_boundary', 'required_support'];
  validateKnownFields(errors, route, new Set(fields), label);
  requireFields(errors, route, fields, label);
  if (!CLAIM_MODES.has(route.mode)) errors.push(`${label}.mode is invalid`);
  requireString(errors, route.public_wording_boundary, `${label}.public_wording_boundary`);
  requireArrayOfStrings(errors, route.required_support, `${label}.required_support`);
}

function validateMarketScan(scan, errors) {
  const label = 'market_scan';
  if (!object(scan)) {
    errors.push(`${label} must be an object`);
    return;
  }
  const fields = ['status', 'finding', 'references'];
  validateKnownFields(errors, scan, new Set(fields), label);
  requireFields(errors, scan, fields, label);
  if (!MARKET_STATUS.has(scan.status)) errors.push(`${label}.status is invalid`);
  requireString(errors, scan.finding, `${label}.finding`);
  requireArrayOfStrings(errors, scan.references, `${label}.references`);
}

function validateKnowledgeMap(map, errors) {
  if (map === undefined) return;
  const label = 'knowledge_map';
  if (!object(map)) {
    errors.push(`${label} must be an object when present`);
    return;
  }
  const fields = ['branch_id', 'scope_window_path', 'branch_status'];
  validateKnownFields(errors, map, new Set(fields), label);
  fields.forEach((field) => {
    if (field in map) requireString(errors, map[field], `${label}.${field}`);
  });
  if ('branch_status' in map && !['unmapped', 'research_seed', 'source_backed'].includes(map.branch_status)) {
    errors.push(`${label}.branch_status is invalid`);
  }
}

function validateDecision(decision, errors) {
  const label = 'decision';
  if (!object(decision)) {
    errors.push(`${label} must be an object`);
    return;
  }
  const fields = ['outcome', 'reason', 'next_step'];
  validateKnownFields(errors, decision, new Set(fields), label);
  requireFields(errors, decision, fields, label);
  if (!DECISIONS.has(decision.outcome)) errors.push(`${label}.outcome is invalid`);
  ['reason', 'next_step'].forEach((field) => requireString(errors, decision[field], `${label}.${field}`));
}

function validateReady(card, errors) {
  if (!nonPlaceholder(card.candidate_id)) errors.push('candidate_id must be non-placeholder when status is build_ready');

  const reader = card.reader_contract;
  if (object(reader)) ['reader', 'exact_work_moment', 'reader_language', 'broad_bridge'].forEach((field) => requireText(errors, reader[field], `reader_contract.${field}`));

  const signal = card.problem_signal;
  if (object(signal)) {
    requireText(errors, signal.observed_problem, 'problem_signal.observed_problem');
    if (!array(signal.source_records) || signal.source_records.length === 0) errors.push('build_ready candidate needs at least one problem_signal source record');
  }

  const handle = card.immediate_handle;
  if (object(handle)) ['reader_can_do', 'before_after_difference', 'not_solved'].forEach((field) => requireText(errors, handle[field], `immediate_handle.${field}`));

  const angle = card.useful_angle;
  if (object(angle)) ['familiar_version', 'specific_difference', 'reframe_if_generic'].forEach((field) => requireText(errors, angle[field], `useful_angle.${field}`));

  if (!array(card.density_inventory) || card.density_inventory.length < 3) {
    errors.push('build_ready candidate needs at least three density items; each must remove a named uncertainty');
  }

  const route = card.claim_route;
  if (object(route)) {
    requireText(errors, route.public_wording_boundary, 'claim_route.public_wording_boundary');
    if (!array(route.required_support) || route.required_support.length === 0) errors.push('build_ready candidate needs at least one claim_route.required_support entry');
  }

  const scan = card.market_scan;
  if (object(scan)) {
    if (!['lightweight_reviewed', 'not_applicable_with_reason'].includes(scan.status)) {
      errors.push('build_ready candidate needs a lightweight market scan or a stated reason it is not applicable');
    }
    requireText(errors, scan.finding, 'market_scan.finding');
    if (scan.status === 'lightweight_reviewed' && (!array(scan.references) || scan.references.length === 0)) {
      errors.push('a lightweight_reviewed market scan needs at least one reference');
    }
  }

  const decision = card.decision;
  if (!object(decision) || decision.outcome !== 'build') errors.push('build_ready candidate requires decision.outcome=build');
  else {
    requireText(errors, decision.reason, 'decision.reason');
    requireText(errors, decision.next_step, 'decision.next_step');
  }
}

/**
 * Return all structural and build-ready errors without printing or exiting.
 * Composition Packet validation intentionally calls the CLI so the exact same
 * check remains the canonical admission rule.
 */
export function validateResourceCandidateCard(card) {
  const errors = [];
  if (!object(card)) return ['root must be an object'];

  validateKnownFields(errors, card, ROOT_FIELDS, 'root');
  const required = ['schema_version', 'status', 'candidate_id', 'reader_contract', 'problem_signal', 'immediate_handle', 'useful_angle', 'density_inventory', 'claim_route', 'market_scan', 'decision'];
  requireFields(errors, card, required, 'root');
  if (card.schema_version !== '1.0.0') errors.push('schema_version must be 1.0.0');
  if (!STATUS.has(card.status)) errors.push('status is invalid');
  requireString(errors, card.candidate_id, 'candidate_id');
  if ('$schema' in card) requireString(errors, card.$schema, '$schema');
  if ('notes' in card) requireString(errors, card.notes, 'notes');

  validateReaderContract(card.reader_contract, errors);
  validateProblemSignal(card.problem_signal, errors);
  validateImmediateHandle(card.immediate_handle, errors);
  validateUsefulAngle(card.useful_angle, errors);

  if (!array(card.density_inventory)) errors.push('density_inventory must be an array');
  else card.density_inventory.forEach((item, index) => validateDensityItem(item, index, errors));

  validateClaimRoute(card.claim_route, errors);
  validateMarketScan(card.market_scan, errors);
  validateKnowledgeMap(card.knowledge_map, errors);
  validateDecision(card.decision, errors);

  if (card.status !== 'draft' && object(card.decision)) {
    requireText(errors, card.decision.reason, 'decision.reason');
    requireText(errors, card.decision.next_step, 'decision.next_step');
  }
  if (card.status === 'build_ready') validateReady(card, errors);
  if (card.status === 'parked' && card.decision?.outcome !== 'park') errors.push('parked card requires decision.outcome=park');
  if (card.status === 'reframed' && card.decision?.outcome !== 'reframe') errors.push('reframed card requires decision.outcome=reframe');

  return errors;
}

function usage() {
  return `Usage:\n  node scripts/validate-resource-candidate-card.mjs --input <resource-candidate-card.json>\n  node scripts/validate-resource-candidate-card.mjs <resource-candidate-card.json>\n\nThis validates the card's reader-value contract. It does not choose a topic, prove a claim, or approve publication.\n`;
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

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }
  const input = options.input ?? options.positional[0];
  if (!input) throw new Error('Provide --input <resource-candidate-card.json>.');
  const path = resolve(process.cwd(), input);
  if (!existsSync(path)) throw new Error(`Input does not exist: ${path}`);

  let card;
  try {
    card = JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    throw new Error(`Input is not valid JSON: ${error.message}`);
  }

  const errors = validateResourceCandidateCard(card);
  if (errors.length) {
    errors.forEach((error) => console.error(`FAIL ${error}`));
    process.exitCode = 1;
    return;
  }
  console.log(`Resource Candidate Card valid: ${card.candidate_id || '[draft]'} | status=${card.status}`);
  console.log('This is a reader-value admission check, not claim verification or publication approval.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(`FAIL ${error.message}`);
    process.exitCode = 1;
  }
}
