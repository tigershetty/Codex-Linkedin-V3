#!/usr/bin/env node

/**
 * Validate the production contract for a Field Guide package.
 *
 * This is deliberately a small, dependency-free guardrail. It validates whether a
 * guide has made its reader promise, visual semantics, claim support, boundaries,
 * and motion decision explicit. It does not judge the quality of a topic or prove
 * a cited source is true.
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const TRUTH_CLASSES = new Set([
  'framework',
  'evidence_display',
  'operating_method',
  'case_or_event',
  'hypothesis_or_simulation',
  'tiger_judgment',
]);

const SPATIAL_MODELS = new Set([
  'annotated_anatomy',
  'comparison',
  'cycle',
  'decision_tree',
  'flow',
  'hierarchy',
  'matrix',
  'network',
  'reference_grid',
  'spectrum',
  'table',
  'timeline',
  'translator_atlas',
  'custom',
]);

const MODULE_TYPES = new Set([
  'check',
  'decision',
  'evidence',
  'exception',
  'reference',
  'step',
]);

const CLAIM_TYPES = new Set([
  'framework',
  'method',
  'formula',
  'factual',
  'numerical',
  'causal',
  'company',
  'personal',
  'case_outcome',
  'editorial_interpretation',
]);

const EVIDENCE_STATUSES = new Set(['not_required', 'supported', 'qualified', 'remove']);
const BOUNDARY_TYPES = new Set(['boundary', 'exception', 'both']);
const MOTION_DECISIONS = new Set(['still', 'motion']);
const EXTERNAL_CLAIM_TYPES = new Set([
  'factual',
  'numerical',
  'causal',
  'company',
  'personal',
  'case_outcome',
]);

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function object(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function list(value) {
  return Array.isArray(value);
}

function usage() {
  return `Usage:
  node scripts/validate-field-guide-package.mjs --input <field-guide-spec.json>
  node scripts/validate-field-guide-package.mjs <field-guide-spec.json>

Options:
  --allow-draft   Validate a deliberately draft package. Draft is never publish-ready.
  --help          Show this help.

The validator checks the Field Guide's reader contract, truth class, semantic shape,
module count, claim/evidence contract, boundary or exception, and motion decision.
It does not select a topic, visual style, prove external sources are correct, or audit package
closure. Run audit-field-guide-package.mjs against field-guide-manifest.json for the linked Figma,
export/hash, caption, review, reference, and analytics record.
`;
}

function parseArgs(args) {
  const options = { positional: [] };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--allow-draft') options.allowDraft = true;
    else if (arg === '--input') {
      options.input = args[index + 1];
      index += 1;
    } else if (arg.startsWith('--input=')) {
      options.input = arg.slice('--input='.length);
    } else if (arg.startsWith('-')) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      options.positional.push(arg);
    }
  }
  return options;
}

function requireText(errors, value, label) {
  if (!text(value)) errors.push(`${label} is required`);
}

function uniqueNonEmpty(values) {
  return list(values) && values.length > 0 && values.every((value) => text(value));
}

function validateReaderContract(spec, errors) {
  const contract = spec.reader_contract;
  if (!object(contract)) {
    errors.push('reader_contract must be an object');
    return;
  }
  for (const field of [
    'reader_moment',
    'reader_payoff',
    'decision_question',
    'glance_3s',
    'scan_10s',
    'use_30s',
  ]) {
    requireText(errors, contract[field], `reader_contract.${field}`);
  }
}

function validateScope(spec, errors) {
  const scope = spec.scope;
  if (!object(scope)) {
    errors.push('scope must be an object');
    return;
  }
  for (const field of ['in_scope', 'not_for', 'assumptions']) {
    requireText(errors, scope[field], `scope.${field}`);
  }
}

function validateVisualArgument(spec, errors) {
  const argument = spec.visual_argument;
  if (!object(argument)) {
    errors.push('visual_argument must be an object');
    return;
  }
  if (!SPATIAL_MODELS.has(argument.spatial_model)) {
    errors.push(
      `visual_argument.spatial_model must be one of: ${[...SPATIAL_MODELS].join(', ')}`,
    );
  }
  for (const field of ['spatial_claim', 'why_shape_truthful', 'anti_misread']) {
    requireText(errors, argument[field], `visual_argument.${field}`);
  }
}

function validateEvidence(claim, label, errors, { draftAllowed, truthClass }) {
  const evidence = claim.evidence;
  if (!object(evidence)) {
    errors.push(`${label}.evidence must be an object`);
    return false;
  }

  if (!EVIDENCE_STATUSES.has(evidence.status)) {
    errors.push(`${label}.evidence.status must be one of: ${[...EVIDENCE_STATUSES].join(', ')}`);
    return false;
  }

  if (evidence.status === 'remove' && !draftAllowed) {
    errors.push(`${label}.evidence.status cannot be remove in a ready package`);
  }

  const hasSources = uniqueNonEmpty(evidence.source_ids);
  const hasDerivation = text(evidence.derivation);
  const needsExternalEvidence = EXTERNAL_CLAIM_TYPES.has(claim.claim_type);
  const needsFormulaSupport = claim.claim_type === 'formula';
  const evidenceDisplayClaim = truthClass === 'evidence_display' && claim.claim_type !== 'framework';
  const caseClaim = truthClass === 'case_or_event' && claim.claim_type !== 'framework';
  const needsSupport = needsExternalEvidence || needsFormulaSupport || evidenceDisplayClaim || caseClaim;

  if (needsSupport && !['supported', 'qualified'].includes(evidence.status)) {
    errors.push(`${label} needs evidence.status supported or qualified for ${claim.claim_type}`);
  }
  if (needsSupport && !hasSources && !(needsFormulaSupport && hasDerivation)) {
    errors.push(`${label} needs non-empty evidence.source_ids${needsFormulaSupport ? ' or evidence.derivation' : ''}`);
  }
  if (evidence.status === 'not_required' && !text(evidence.rationale)) {
    errors.push(`${label}.evidence.rationale is required when evidence.status is not_required`);
  }
  if (evidence.status === 'qualified' && !text(evidence.qualification)) {
    errors.push(`${label}.evidence.qualification is required when evidence.status is qualified`);
  }

  return ['supported', 'qualified'].includes(evidence.status) && (hasSources || hasDerivation);
}

function validateClaims(spec, errors, draftAllowed) {
  if (!list(spec.claims) || spec.claims.length === 0) {
    errors.push('claims must be a non-empty array');
    return new Set();
  }

  const claimIds = new Set();
  let supportedEvidenceClaims = 0;
  let supportedCaseClaims = 0;

  for (const [index, claim] of spec.claims.entries()) {
    const label = `claims[${index}]`;
    if (!object(claim)) {
      errors.push(`${label} must be an object`);
      continue;
    }
    requireText(errors, claim.claim_id, `${label}.claim_id`);
    if (text(claim.claim_id)) {
      if (claimIds.has(claim.claim_id)) errors.push(`${label}.claim_id is duplicated: ${claim.claim_id}`);
      claimIds.add(claim.claim_id);
    }
    requireText(errors, claim.text, `${label}.text`);
    if (!CLAIM_TYPES.has(claim.claim_type)) {
      errors.push(`${label}.claim_type must be one of: ${[...CLAIM_TYPES].join(', ')}`);
    }

    const supported = validateEvidence(claim, label, errors, {
      draftAllowed,
      truthClass: spec.truth_class,
    });
    if (supported) supportedEvidenceClaims += 1;
    if (supported && ['case_outcome', 'factual', 'company', 'numerical', 'causal'].includes(claim.claim_type)) {
      supportedCaseClaims += 1;
    }
  }

  if (spec.truth_class === 'evidence_display' && supportedEvidenceClaims === 0) {
    errors.push('truth_class evidence_display needs at least one supported or qualified claim with source evidence');
  }
  if (spec.truth_class === 'case_or_event' && supportedCaseClaims === 0) {
    errors.push('truth_class case_or_event needs at least one supported or qualified factual, company, numerical, causal, or case_outcome claim');
  }

  return claimIds;
}

function validateModules(spec, claimIds, errors) {
  if (!list(spec.modules)) {
    errors.push('modules must be an array');
    return;
  }
  if (spec.modules.length < 3 || spec.modules.length > 7) {
    errors.push(`modules must contain 3–7 modules; found ${spec.modules.length}`);
  }

  const moduleIds = new Set();
  for (const [index, module] of spec.modules.entries()) {
    const label = `modules[${index}]`;
    if (!object(module)) {
      errors.push(`${label} must be an object`);
      continue;
    }
    requireText(errors, module.module_id, `${label}.module_id`);
    if (text(module.module_id)) {
      if (moduleIds.has(module.module_id)) errors.push(`${label}.module_id is duplicated: ${module.module_id}`);
      moduleIds.add(module.module_id);
    }
    requireText(errors, module.title, `${label}.title`);
    requireText(errors, module.reader_action, `${label}.reader_action`);
    if (!MODULE_TYPES.has(module.module_type)) {
      errors.push(`${label}.module_type must be one of: ${[...MODULE_TYPES].join(', ')}`);
    }
    if (!uniqueNonEmpty(module.claim_ids)) {
      errors.push(`${label}.claim_ids must be a non-empty array of claim IDs`);
    } else {
      for (const claimId of module.claim_ids) {
        if (!claimIds.has(claimId)) errors.push(`${label}.claim_ids references unknown claim: ${claimId}`);
      }
    }
  }
}

function validateBoundary(spec, claimIds, errors) {
  const boundary = spec.boundary_or_exception;
  if (!object(boundary)) {
    errors.push('boundary_or_exception must be an object');
    return;
  }
  if (!BOUNDARY_TYPES.has(boundary.type)) {
    errors.push(`boundary_or_exception.type must be one of: ${[...BOUNDARY_TYPES].join(', ')}`);
  }
  for (const field of ['statement', 'reader_response']) {
    requireText(errors, boundary[field], `boundary_or_exception.${field}`);
  }
  if (boundary.claim_ids !== undefined) {
    if (!uniqueNonEmpty(boundary.claim_ids)) {
      errors.push('boundary_or_exception.claim_ids must be a non-empty array when supplied');
    } else {
      for (const claimId of boundary.claim_ids) {
        if (!claimIds.has(claimId)) {
          errors.push(`boundary_or_exception.claim_ids references unknown claim: ${claimId}`);
        }
      }
    }
  }
}

function validateMethodContract(spec, errors) {
  if (spec.truth_class !== 'operating_method') return;
  const contract = spec.method_contract;
  if (!object(contract)) {
    errors.push('method_contract is required when truth_class is operating_method');
    return;
  }
  for (const field of ['inputs', 'validation', 'human_decision_boundary']) {
    requireText(errors, contract[field], `method_contract.${field}`);
  }
}

function validateTruthContract(spec, errors) {
  const contract = spec.truth_contract;
  if (!object(contract)) {
    errors.push('truth_contract must be an object');
    return;
  }
  for (const field of ['basis', 'scope', 'not_claiming']) {
    requireText(errors, contract[field], `truth_contract.${field}`);
  }
}

function validateSimulationContract(spec, errors) {
  if (spec.truth_class !== 'hypothesis_or_simulation') return;
  const contract = spec.simulation_contract;
  if (!object(contract)) {
    errors.push('simulation_contract is required when truth_class is hypothesis_or_simulation');
    return;
  }
  for (const field of ['label', 'inputs', 'method', 'uncertainty']) {
    requireText(errors, contract[field], `simulation_contract.${field}`);
  }
}

function validateTigerJudgmentContract(spec, errors) {
  if (spec.truth_class !== 'tiger_judgment') return;
  const contract = spec.tiger_judgment_contract;
  if (!object(contract)) {
    errors.push('tiger_judgment_contract is required when truth_class is tiger_judgment');
    return;
  }
  for (const field of ['tiger_source_id', 'judgment_framing']) {
    requireText(errors, contract[field], `tiger_judgment_contract.${field}`);
  }
}

function validateMotion(spec, errors) {
  const motion = spec.motion;
  if (!object(motion)) {
    errors.push('motion must be an object');
    return;
  }
  if (!MOTION_DECISIONS.has(motion.decision)) {
    errors.push(`motion.decision must be one of: ${[...MOTION_DECISIONS].join(', ')}`);
    return;
  }
  if (motion.decision === 'motion') {
    requireText(errors, motion.reason, 'motion.reason');
    requireText(errors, motion.communicates, 'motion.communicates');
    if (motion.static_counterpart !== true) {
      errors.push('motion.static_counterpart must be true when motion.decision is motion');
    }
  }
}

function validateSpec(spec, { allowDraft }) {
  const errors = [];
  if (!object(spec)) return ['spec must be a JSON object'];

  if (spec.schema_version !== '1.0.0') errors.push('schema_version must be 1.0.0');
  if (!['draft', 'ready'].includes(spec.status)) errors.push('status must be draft or ready');
  if (spec.status === 'draft' && !allowDraft) {
    errors.push('draft packages require --allow-draft');
  }
  for (const field of ['field_guide_id', 'artifact_type', 'family', 'title', 'primary_reader', 'truth_class', 'next_action']) {
    requireText(errors, spec[field], field);
  }
  if (spec.artifact_type && spec.artifact_type !== 'field_guide') {
    errors.push('artifact_type must be field_guide');
  }
  if (spec.truth_class && !TRUTH_CLASSES.has(spec.truth_class)) {
    errors.push(`truth_class must be one of: ${[...TRUTH_CLASSES].join(', ')}`);
  }

  validateReaderContract(spec, errors);
  validateScope(spec, errors);
  validateVisualArgument(spec, errors);
  const claimIds = validateClaims(spec, errors, allowDraft);
  validateModules(spec, claimIds, errors);
  validateBoundary(spec, claimIds, errors);
  validateTruthContract(spec, errors);
  validateMethodContract(spec, errors);
  validateSimulationContract(spec, errors);
  validateTigerJudgmentContract(spec, errors);
  validateMotion(spec, errors);

  return errors;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(usage());
    return;
  }

  const input = options.input || options.positional[0];
  if (!input) throw new Error(`Missing input file.\n\n${usage()}`);

  const inputPath = resolve(process.cwd(), input);
  if (!existsSync(inputPath)) throw new Error(`Field Guide spec not found: ${inputPath}`);

  let spec;
  try {
    spec = JSON.parse(readFileSync(inputPath, 'utf8'));
  } catch (error) {
    throw new Error(`Could not parse JSON at ${inputPath}: ${error.message}`);
  }

  const errors = validateSpec(spec, { allowDraft: Boolean(options.allowDraft) });
  if (errors.length) {
    throw new Error(`Field Guide package validation failed:\n- ${errors.join('\n- ')}`);
  }

  process.stdout.write(
    `Field Guide package valid: ${spec.field_guide_id} | status=${spec.status} | truth_class=${spec.truth_class} | modules=${spec.modules.length}\n`,
  );
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
