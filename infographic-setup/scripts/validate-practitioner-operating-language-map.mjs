#!/usr/bin/env node

/**
 * Validate a bounded Practitioner Operating Language Map.
 *
 * The map makes terminology and role context inspectable before a supply-chain
 * post uses them. It does not decide what to publish, prove that a practice is
 * universal, or replace claim verification.
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const STATUS = new Set(['draft', 'ready']);
const SOURCE_TYPES = new Set([
  'canonical_standard',
  'official_system_guidance',
  'academic_or_industry_research',
  'documented_case',
  'practitioner_public_signal',
  'role_description',
  'tiger_source',
]);
const SOURCE_SUPPORTS = new Set([
  'canonical_term',
  'system_term',
  'system_behavior',
  'field_phrase',
  'work_moment',
  'artifact',
  'trigger',
  'decision',
  'consequence',
  'claim_boundary',
]);
const SYSTEM_MODES = new Set(['generic', 'vendor_specific', 'cross_vendor']);
const PHRASE_TYPES = new Set(['observed_practitioner_phrase', 'system_label']);
const TERM_CLASSES = new Set(['canonical_term', 'system_term', 'field_term', 'abbreviation', 'plain_language']);
const CONTEXT_MODES = new Set(['generic', 'vendor_specific', 'cross_vendor']);
const VARIANT_TYPES = new Set(['system_label', 'field_alias', 'abbreviation', 'regional_variant']);
const COPY_USAGE = new Set(['generic_safe', 'system_labeled', 'explain_first', 'do_not_use']);
const AUDIT_STATUS = new Set(['not_run', 'pass', 'needs_review']);
const SURFACE_TYPES = new Set(['visual', 'caption', 'both']);

const ROOT_FIELDS = new Set([
  '$schema',
  'schema_version',
  'status',
  'map_id',
  'scope',
  'source_registry',
  'phrases',
  'terms',
  'claim_boundary',
  'final_copy_audit',
  'notes',
]);

function usage() {
  return `Usage:
  node scripts/validate-practitioner-operating-language-map.mjs --input <map.json>
  node scripts/validate-practitioner-operating-language-map.mjs --input <map.json> --final-copy-audit <audit.json>
  node scripts/validate-practitioner-operating-language-map.mjs <map.json>

Options:
  --allow-draft       Validate a draft map without ready-state admission checks.
  --final-copy-audit  Validate a separate optional final-copy audit against the map.
  --help              Show this help.

This checks terminology, source/context traceability, system variants, non-equivalence boundaries,
and optional copy-to-map linkage. It does not select a topic, prove a claim, or approve publication.
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
    } else if (arg.startsWith('--input=')) options.input = arg.slice('--input='.length);
    else if (arg === '--final-copy-audit') {
      options.finalCopyAudit = args[index + 1];
      index += 1;
    } else if (arg.startsWith('--final-copy-audit=')) options.finalCopyAudit = arg.slice('--final-copy-audit='.length);
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

function array(value) {
  return Array.isArray(value);
}

function normalised(value) {
  return text(value).toLocaleLowerCase();
}

function readyId(value) {
  const candidate = text(value);
  return Boolean(candidate) && !/(?:^|[-_])(draft|placeholder|todo|tbd)(?:$|[-_])/i.test(candidate);
}

function isIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text(value))) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function requiredText(errors, value, label) {
  if (!text(value)) errors.push(`${label} is required`);
}

function requiredBoolean(errors, value, label) {
  if (typeof value !== 'boolean') errors.push(`${label} must be a boolean`);
}

function requireArray(errors, value, label) {
  if (!array(value)) {
    errors.push(`${label} must be an array`);
    return false;
  }
  return true;
}

function validateKnownFields(errors, value, allowed, label) {
  if (!object(value)) return;
  Object.keys(value).forEach((field) => {
    if (!allowed.has(field)) errors.push(`${label}.${field} is not allowed by the Practitioner Operating Language Map contract`);
  });
}

function requireFields(errors, value, fields, label) {
  fields.forEach((field) => {
    if (!(field in value)) errors.push(`${label}.${field} is required`);
  });
}

function validateStringArray(errors, value, label, { min = 0, unique = false } = {}) {
  if (!requireArray(errors, value, label)) return [];
  if (value.length < min) errors.push(`${label} needs at least ${min} item${min === 1 ? '' : 's'}`);
  const values = [];
  value.forEach((entry, index) => {
    requiredText(errors, entry, `${label}[${index}]`);
    if (text(entry)) values.push(text(entry));
  });
  if (unique && new Set(values).size !== values.length) errors.push(`${label} must not contain duplicate values`);
  return values;
}

function validateSourceContext(value, label, errors, ready) {
  if (!object(value)) {
    errors.push(`${label} must be an object`);
    return;
  }
  const fields = ['role_or_audience', 'work_context', 'system_context'];
  validateKnownFields(errors, value, new Set(fields), label);
  requireFields(errors, value, fields, label);
  fields.forEach((field) => {
    if (field in value && typeof value[field] !== 'string') errors.push(`${label}.${field} must be a string`);
    if (ready) requiredText(errors, value[field], `${label}.${field}`);
  });
}

function validateSource(source, index, errors, ready) {
  const label = `source_registry[${index}]`;
  if (!object(source)) {
    errors.push(`${label} must be an object`);
    return '';
  }
  const fields = ['source_id', 'source_type', 'location', 'accessed_on', 'context', 'supports', 'supported_paraphrase', 'limitation'];
  validateKnownFields(errors, source, new Set(fields), label);
  requireFields(errors, source, fields, label);
  fields.filter((field) => ['source_id', 'location', 'accessed_on', 'supported_paraphrase', 'limitation'].includes(field)).forEach((field) => {
    if (field in source && typeof source[field] !== 'string') errors.push(`${label}.${field} must be a string`);
  });
  if (!SOURCE_TYPES.has(source.source_type)) errors.push(`${label}.source_type is invalid`);
  if (text(source.accessed_on) && !isIsoDate(source.accessed_on)) errors.push(`${label}.accessed_on must use YYYY-MM-DD`);
  if (ready) {
    ['source_id', 'location', 'accessed_on', 'supported_paraphrase', 'limitation'].forEach((field) => requiredText(errors, source[field], `${label}.${field}`));
  }
  validateSourceContext(source.context, `${label}.context`, errors, ready);
  const supports = validateStringArray(errors, source.supports, `${label}.supports`, { min: ready ? 1 : 0, unique: true });
  supports.forEach((support) => {
    if (!SOURCE_SUPPORTS.has(support)) errors.push(`${label}.supports contains invalid support type: ${support}`);
  });
  return text(source.source_id);
}

function validateSystemScope(scope, errors, ready) {
  const label = 'scope.system_scope';
  if (!object(scope)) {
    errors.push(`${label} must be an object`);
    return;
  }
  const fields = ['mode', 'systems', 'wording_boundary'];
  validateKnownFields(errors, scope, new Set(fields), label);
  requireFields(errors, scope, fields, label);
  if (!SYSTEM_MODES.has(scope.mode)) errors.push(`${label}.mode is invalid`);
  if (scope.wording_boundary !== undefined && typeof scope.wording_boundary !== 'string') errors.push(`${label}.wording_boundary must be a string`);
  if (ready) requiredText(errors, scope.wording_boundary, `${label}.wording_boundary`);

  if (!requireArray(errors, scope.systems, `${label}.systems`)) return;
  const systemKeys = new Set();
  scope.systems.forEach((system, index) => {
    const systemLabel = `${label}.systems[${index}]`;
    if (!object(system)) {
      errors.push(`${systemLabel} must be an object`);
      return;
    }
    const systemFields = ['vendor', 'product_or_context'];
    validateKnownFields(errors, system, new Set(systemFields), systemLabel);
    requireFields(errors, system, systemFields, systemLabel);
    systemFields.forEach((field) => {
      if (field in system && typeof system[field] !== 'string') errors.push(`${systemLabel}.${field} must be a string`);
      if (ready) requiredText(errors, system[field], `${systemLabel}.${field}`);
    });
    const key = `${normalised(system.vendor)}::${normalised(system.product_or_context)}`;
    if (text(system.vendor) && text(system.product_or_context)) {
      if (systemKeys.has(key)) errors.push(`${label}.systems has duplicate vendor/product context: ${system.vendor} / ${system.product_or_context}`);
      systemKeys.add(key);
    }
  });
  if (ready && scope.mode === 'vendor_specific' && scope.systems.length < 1) {
    errors.push(`${label}.vendor_specific needs one named system`);
  }
  if (ready && scope.mode === 'cross_vendor' && scope.systems.length < 2) {
    errors.push(`${label}.cross_vendor needs at least two named systems`);
  }
}

function validateScope(scope, errors, ready, sourceIds) {
  if (!object(scope)) {
    errors.push('scope must be an object');
    return;
  }
  const fields = ['primary_role', 'exact_work_moment', 'artifact', 'trigger', 'decision', 'consequence', 'system_scope', 'source_refs'];
  validateKnownFields(errors, scope, new Set(fields), 'scope');
  requireFields(errors, scope, fields, 'scope');
  fields.filter((field) => !['system_scope', 'source_refs'].includes(field)).forEach((field) => {
    if (field in scope && typeof scope[field] !== 'string') errors.push(`scope.${field} must be a string`);
    if (ready) requiredText(errors, scope[field], `scope.${field}`);
  });
  validateSystemScope(scope.system_scope, errors, ready);
  const refs = validateStringArray(errors, scope.source_refs, 'scope.source_refs', { min: ready ? 1 : 0, unique: true });
  refs.forEach((ref) => {
    if (!sourceIds.has(ref)) errors.push(`scope.source_refs references unknown source: ${ref}`);
  });
}

function validatePhrase(phrase, index, errors, ready, sourcesById) {
  const label = `phrases[${index}]`;
  if (!object(phrase)) {
    errors.push(`${label} must be an object`);
    return '';
  }
  const fields = ['phrase_id', 'exact_phrase', 'phrase_type', 'source_excerpt', 'source_refs', 'usage_note'];
  validateKnownFields(errors, phrase, new Set(fields), label);
  requireFields(errors, phrase, fields, label);
  ['phrase_id', 'exact_phrase', 'source_excerpt', 'usage_note'].forEach((field) => {
    if (field in phrase && typeof phrase[field] !== 'string') errors.push(`${label}.${field} must be a string`);
    if (ready) requiredText(errors, phrase[field], `${label}.${field}`);
  });
  if (!PHRASE_TYPES.has(phrase.phrase_type)) errors.push(`${label}.phrase_type is invalid`);
  if (text(phrase.exact_phrase) && text(phrase.source_excerpt)
    && !normalised(phrase.source_excerpt).includes(normalised(phrase.exact_phrase))) {
    errors.push(`${label}.source_excerpt must contain exact_phrase so the phrase remains auditable`);
  }
  const refs = validateStringArray(errors, phrase.source_refs, `${label}.source_refs`, { min: ready ? 1 : 0, unique: true });
  const sources = refs.map((ref) => sourcesById.get(ref)).filter(Boolean);
  refs.forEach((ref) => {
    if (!sourcesById.has(ref)) errors.push(`${label}.source_refs references unknown source: ${ref}`);
  });
  if (ready && phrase.phrase_type === 'observed_practitioner_phrase') {
    const nativeEvidence = sources.some((source) => (
      ['practitioner_public_signal', 'role_description', 'tiger_source'].includes(source.source_type)
      && source.supports?.includes('field_phrase')
    ));
    if (!nativeEvidence) {
      errors.push(`${label}.observed_practitioner_phrase needs a native-language source with supports=field_phrase`);
    }
  }
  if (ready && phrase.phrase_type === 'system_label') {
    const systemEvidence = sources.some((source) => (
      source.source_type === 'official_system_guidance'
      && (source.supports?.includes('system_term') || source.supports?.includes('system_behavior'))
    ));
    if (!systemEvidence) errors.push(`${label}.system_label needs official system guidance`);
  }
  return text(phrase.phrase_id);
}

function validateTermVariant(variant, label, errors, ready, sourcesById) {
  if (!object(variant)) {
    errors.push(`${label} must be an object`);
    return '';
  }
  const fields = ['variant_id', 'label', 'variant_type', 'system_context', 'copy_usage', 'source_refs'];
  validateKnownFields(errors, variant, new Set(fields), label);
  requireFields(errors, variant, fields, label);
  ['variant_id', 'label', 'system_context'].forEach((field) => {
    if (field in variant && typeof variant[field] !== 'string') errors.push(`${label}.${field} must be a string`);
    if (ready) requiredText(errors, variant[field], `${label}.${field}`);
  });
  if (!VARIANT_TYPES.has(variant.variant_type)) errors.push(`${label}.variant_type is invalid`);
  if (!COPY_USAGE.has(variant.copy_usage)) errors.push(`${label}.copy_usage is invalid`);
  const refs = validateStringArray(errors, variant.source_refs, `${label}.source_refs`, { min: ready ? 1 : 0, unique: true });
  refs.forEach((ref) => {
    if (!sourcesById.has(ref)) errors.push(`${label}.source_refs references unknown source: ${ref}`);
  });
  if (ready && variant.variant_type === 'system_label') {
    const hasSystemEvidence = refs.some((ref) => sourcesById.get(ref)?.source_type === 'official_system_guidance');
    if (!hasSystemEvidence) errors.push(`${label}.system_label needs an official_system_guidance source`);
  }
  return text(variant.variant_id);
}

function validateNonEquivalence(boundary, label, errors, ready, sourcesById) {
  if (!object(boundary)) {
    errors.push(`${label} must be an object`);
    return;
  }
  const fields = ['not_equivalent_to', 'reason', 'source_refs'];
  validateKnownFields(errors, boundary, new Set(fields), label);
  requireFields(errors, boundary, fields, label);
  ['not_equivalent_to', 'reason'].forEach((field) => {
    if (field in boundary && typeof boundary[field] !== 'string') errors.push(`${label}.${field} must be a string`);
    if (ready) requiredText(errors, boundary[field], `${label}.${field}`);
  });
  const refs = validateStringArray(errors, boundary.source_refs, `${label}.source_refs`, { min: ready ? 1 : 0, unique: true });
  refs.forEach((ref) => {
    if (!sourcesById.has(ref)) errors.push(`${label}.source_refs references unknown source: ${ref}`);
  });
}

function validateTerm(term, index, errors, ready, sourcesById) {
  const label = `terms[${index}]`;
  if (!object(term)) {
    errors.push(`${label} must be an object`);
    return { id: '', variants: new Map(), term: null };
  }
  const fields = ['term_id', 'canonical_concept', 'public_label', 'term_class', 'context_mode', 'source_refs', 'variants', 'non_equivalences'];
  validateKnownFields(errors, term, new Set(fields), label);
  requireFields(errors, term, fields, label);
  ['term_id', 'canonical_concept', 'public_label'].forEach((field) => {
    if (field in term && typeof term[field] !== 'string') errors.push(`${label}.${field} must be a string`);
    if (ready) requiredText(errors, term[field], `${label}.${field}`);
  });
  if (!TERM_CLASSES.has(term.term_class)) errors.push(`${label}.term_class is invalid`);
  if (!CONTEXT_MODES.has(term.context_mode)) errors.push(`${label}.context_mode is invalid`);
  const refs = validateStringArray(errors, term.source_refs, `${label}.source_refs`, { min: ready ? 1 : 0, unique: true });
  refs.forEach((ref) => {
    if (!sourcesById.has(ref)) errors.push(`${label}.source_refs references unknown source: ${ref}`);
  });
  if (ready && term.term_class !== 'plain_language') {
    const authoritative = refs.some((ref) => ['canonical_standard', 'official_system_guidance'].includes(sourcesById.get(ref)?.source_type));
    if (!authoritative) errors.push(`${label} needs canonical_standard or official_system_guidance terminology evidence`);
  }

  const variantsById = new Map();
  if (!requireArray(errors, term.variants, `${label}.variants`)) {
    // Keep collecting diagnostics below.
  } else {
    if (ready && term.variants.length === 0) errors.push(`${label}.variants needs at least one variant`);
    term.variants.forEach((variant, variantIndex) => {
      const variantId = validateTermVariant(variant, `${label}.variants[${variantIndex}]`, errors, ready, sourcesById);
      if (variantId) {
        if (variantsById.has(variantId)) errors.push(`${label}.variants contains duplicate variant_id: ${variantId}`);
        variantsById.set(variantId, variant);
      }
    });
  }
  if (ready && term.context_mode === 'vendor_specific') {
    const namedSystemVariant = [...variantsById.values()].some((variant) => text(variant.system_context));
    if (!namedSystemVariant) errors.push(`${label}.vendor_specific needs a variant with named system_context`);
  }
  if (ready && term.context_mode === 'cross_vendor') {
    const contexts = new Set([...variantsById.values()].map((variant) => normalised(variant.system_context)).filter(Boolean));
    if (contexts.size < 2) errors.push(`${label}.cross_vendor needs variants for at least two system contexts`);
  }

  if (!requireArray(errors, term.non_equivalences, `${label}.non_equivalences`)) {
    // Keep collecting diagnostics below.
  } else {
    if (ready && term.non_equivalences.length === 0) errors.push(`${label}.non_equivalences needs at least one boundary`);
    term.non_equivalences.forEach((boundary, boundaryIndex) => {
      validateNonEquivalence(boundary, `${label}.non_equivalences[${boundaryIndex}]`, errors, ready, sourcesById);
      if (text(boundary?.not_equivalent_to) && normalised(boundary.not_equivalent_to) === normalised(term.public_label)) {
        errors.push(`${label}.non_equivalences[${boundaryIndex}] cannot restate the public label as its own boundary`);
      }
    });
  }
  return { id: text(term.term_id), variants: variantsById, term };
}

function validateClaimBoundary(boundary, errors, ready, sourcesById) {
  const label = 'claim_boundary';
  if (!object(boundary)) {
    errors.push(`${label} must be an object`);
    return;
  }
  const fields = ['public_wording_boundary', 'does_not_establish', 'source_refs'];
  validateKnownFields(errors, boundary, new Set(fields), label);
  requireFields(errors, boundary, fields, label);
  ['public_wording_boundary', 'does_not_establish'].forEach((field) => {
    if (field in boundary && typeof boundary[field] !== 'string') errors.push(`${label}.${field} must be a string`);
    if (ready) requiredText(errors, boundary[field], `${label}.${field}`);
  });
  const refs = validateStringArray(errors, boundary.source_refs, `${label}.source_refs`, { min: ready ? 1 : 0, unique: true });
  refs.forEach((ref) => {
    if (!sourcesById.has(ref)) errors.push(`${label}.source_refs references unknown source: ${ref}`);
  });
}

function validateCopyAudit(audit, map, termRecords, errors, label = 'final_copy_audit') {
  if (!object(audit)) {
    errors.push(`${label} must be an object`);
    return;
  }
  const fields = ['map_id', 'status', 'reviewed_at', 'reviewer', 'surfaces', 'decision_note'];
  validateKnownFields(errors, audit, new Set(fields), label);
  requireFields(errors, audit, fields, label);
  if (text(audit.map_id) !== text(map.map_id)) errors.push(`${label}.map_id must match map_id`);
  if (!AUDIT_STATUS.has(audit.status)) errors.push(`${label}.status is invalid`);
  ['map_id', 'reviewed_at', 'reviewer', 'decision_note'].forEach((field) => {
    if (field in audit && typeof audit[field] !== 'string') errors.push(`${label}.${field} must be a string`);
  });
  if (text(audit.reviewed_at) && !isIsoDate(audit.reviewed_at)) errors.push(`${label}.reviewed_at must use YYYY-MM-DD`);
  const isPass = audit.status === 'pass';
  if (isPass) ['map_id', 'reviewed_at', 'reviewer', 'decision_note'].forEach((field) => requiredText(errors, audit[field], `${label}.${field}`));
  if (!requireArray(errors, audit.surfaces, `${label}.surfaces`)) return;
  if (isPass && audit.surfaces.length === 0) errors.push(`${label}.pass needs at least one audited copy surface`);
  const surfaceIds = new Set();
  audit.surfaces.forEach((surface, index) => {
    const surfaceLabel = `${label}.surfaces[${index}]`;
    if (!object(surface)) {
      errors.push(`${surfaceLabel} must be an object`);
      return;
    }
    const surfaceFields = ['surface_id', 'surface_type', 'exact_copy', 'term_uses', 'unmapped_technical_terms', 'unresolved_non_equivalences', 'false_universality_flags'];
    validateKnownFields(errors, surface, new Set(surfaceFields), surfaceLabel);
    requireFields(errors, surface, surfaceFields, surfaceLabel);
    if (!SURFACE_TYPES.has(surface.surface_type)) errors.push(`${surfaceLabel}.surface_type is invalid`);
    ['surface_id', 'exact_copy'].forEach((field) => {
      if (field in surface && typeof surface[field] !== 'string') errors.push(`${surfaceLabel}.${field} must be a string`);
      if (isPass) requiredText(errors, surface[field], `${surfaceLabel}.${field}`);
    });
    if (text(surface.surface_id)) {
      if (surfaceIds.has(surface.surface_id)) errors.push(`${label}.surfaces contains duplicate surface_id: ${surface.surface_id}`);
      surfaceIds.add(surface.surface_id);
    }
    if (!requireArray(errors, surface.term_uses, `${surfaceLabel}.term_uses`)) return;
    if (isPass && surface.term_uses.length === 0) errors.push(`${surfaceLabel}.term_uses needs at least one mapped term when audit status is pass`);
    surface.term_uses.forEach((termUse, termUseIndex) => {
      const termLabel = `${surfaceLabel}.term_uses[${termUseIndex}]`;
      if (!object(termUse)) {
        errors.push(`${termLabel} must be an object`);
        return;
      }
      const termFields = ['term_id', 'variant_id', 'rendered_as', 'system_context_shown'];
      validateKnownFields(errors, termUse, new Set(termFields), termLabel);
      ['term_id', 'rendered_as', 'system_context_shown'].forEach((field) => {
        if (!(field in termUse)) errors.push(`${termLabel}.${field} is required`);
      });
      if ('term_id' in termUse && typeof termUse.term_id !== 'string') errors.push(`${termLabel}.term_id must be a string`);
      if ('variant_id' in termUse && typeof termUse.variant_id !== 'string') errors.push(`${termLabel}.variant_id must be a string when present`);
      if ('rendered_as' in termUse && typeof termUse.rendered_as !== 'string') errors.push(`${termLabel}.rendered_as must be a string`);
      requiredBoolean(errors, termUse.system_context_shown, `${termLabel}.system_context_shown`);
      if (isPass) {
        requiredText(errors, termUse.term_id, `${termLabel}.term_id`);
        requiredText(errors, termUse.rendered_as, `${termLabel}.rendered_as`);
      }
      const record = termRecords.get(termUse.term_id);
      if (!record) {
        errors.push(`${termLabel}.term_id references unknown term: ${termUse.term_id}`);
        return;
      }
      if (text(termUse.rendered_as) && text(surface.exact_copy)
        && !normalised(surface.exact_copy).includes(normalised(termUse.rendered_as))) {
        errors.push(`${termLabel}.rendered_as must appear in the exact_copy being audited`);
      }
      let variant;
      if (text(termUse.variant_id)) {
        variant = record.variants.get(termUse.variant_id);
        if (!variant) errors.push(`${termLabel}.variant_id references unknown variant: ${termUse.variant_id}`);
      }
      if (record.term.context_mode === 'vendor_specific' && !text(termUse.variant_id)) {
        errors.push(`${termLabel} must name a variant for a vendor_specific term`);
      }
      if (variant?.copy_usage === 'do_not_use') errors.push(`${termLabel} uses a variant marked do_not_use`);
      if ((variant?.copy_usage === 'system_labeled' || record.term.context_mode === 'vendor_specific')
        && termUse.system_context_shown !== true) {
        errors.push(`${termLabel} requires system_context_shown=true`);
      }
    });
    const unmapped = validateStringArray(errors, surface.unmapped_technical_terms, `${surfaceLabel}.unmapped_technical_terms`, { unique: true });
    const unresolved = validateStringArray(errors, surface.unresolved_non_equivalences, `${surfaceLabel}.unresolved_non_equivalences`, { unique: true });
    const universal = validateStringArray(errors, surface.false_universality_flags, `${surfaceLabel}.false_universality_flags`, { unique: true });
    if (isPass && unmapped.length) errors.push(`${surfaceLabel}.pass cannot retain unmapped_technical_terms`);
    if (isPass && unresolved.length) errors.push(`${surfaceLabel}.pass cannot retain unresolved_non_equivalences`);
    if (isPass && universal.length) errors.push(`${surfaceLabel}.pass cannot retain false_universality_flags`);
  });
}

export function validatePractitionerOperatingLanguageMap(map, { allowDraft = false, finalCopyAudit = undefined } = {}) {
  const errors = [];
  if (!object(map)) return ['root must be an object'];
  validateKnownFields(errors, map, ROOT_FIELDS, 'root');
  const required = ['schema_version', 'status', 'map_id', 'scope', 'source_registry', 'phrases', 'terms', 'claim_boundary'];
  requireFields(errors, map, required, 'root');
  if (map.schema_version !== '1.0.0') errors.push('schema_version must be 1.0.0');
  if (!STATUS.has(map.status)) errors.push('status must be draft or ready');
  if (map.status === 'draft' && !allowDraft) errors.push('draft input requires --allow-draft');
  if ('$schema' in map && typeof map.$schema !== 'string') errors.push('$schema must be a string');
  if ('notes' in map && typeof map.notes !== 'string') errors.push('notes must be a string');
  const ready = map.status === 'ready';
  if (ready && !readyId(map.map_id)) errors.push('map_id must be a non-placeholder value when status is ready');
  if (!ready && map.map_id !== undefined && typeof map.map_id !== 'string') errors.push('map_id must be a string');

  const sourcesById = new Map();
  if (!requireArray(errors, map.source_registry, 'source_registry')) {
    // Continue with the empty registry to collect useful reference errors.
  } else {
    if (ready && map.source_registry.length < 2) errors.push('ready map needs at least two source records');
    map.source_registry.forEach((source, index) => {
      const id = validateSource(source, index, errors, ready);
      if (id) {
        if (sourcesById.has(id)) errors.push(`source_registry contains duplicate source_id: ${id}`);
        sourcesById.set(id, source);
      }
    });
  }
  if (ready) {
    const sourceTypes = new Set([...sourcesById.values()].map((source) => source.source_type));
    if (![...sourceTypes].some((type) => ['canonical_standard', 'official_system_guidance'].includes(type))) {
      errors.push('ready map needs canonical or official system terminology evidence');
    }
    if (![...sourceTypes].some((type) => ['practitioner_public_signal', 'role_description', 'tiger_source'].includes(type))) {
      errors.push('ready map needs a native-language source: practitioner_public_signal, role_description, or tiger_source');
    }
  }

  validateScope(map.scope, errors, ready, new Set(sourcesById.keys()));

  const phraseIds = new Set();
  if (!requireArray(errors, map.phrases, 'phrases')) {
    // Continue with remaining record checks.
  } else {
    if (ready && map.phrases.length < 1) errors.push('ready map needs at least one exact phrase record');
    map.phrases.forEach((phrase, index) => {
      const id = validatePhrase(phrase, index, errors, ready, sourcesById);
      if (id) {
        if (phraseIds.has(id)) errors.push(`phrases contains duplicate phrase_id: ${id}`);
        phraseIds.add(id);
      }
    });
    if (ready && !map.phrases.some((phrase) => phrase?.phrase_type === 'observed_practitioner_phrase')) {
      errors.push('ready map needs at least one observed_practitioner_phrase; system labels alone are not native-language evidence');
    }
  }

  const termRecords = new Map();
  if (!requireArray(errors, map.terms, 'terms')) {
    // Continue with claim-boundary and audit checks.
  } else {
    if (ready && map.terms.length < 1) errors.push('ready map needs at least one term record');
    map.terms.forEach((term, index) => {
      const record = validateTerm(term, index, errors, ready, sourcesById);
      if (record.id) {
        if (termRecords.has(record.id)) errors.push(`terms contains duplicate term_id: ${record.id}`);
        termRecords.set(record.id, record);
      }
    });
  }

  validateClaimBoundary(map.claim_boundary, errors, ready, sourcesById);
  if ('final_copy_audit' in map && finalCopyAudit !== undefined) {
    errors.push('Provide final-copy audit inline or with --final-copy-audit, not both');
  } else if ('final_copy_audit' in map) {
    validateCopyAudit(map.final_copy_audit, map, termRecords, errors);
  } else if (finalCopyAudit !== undefined) {
    validateCopyAudit(finalCopyAudit, map, termRecords, errors, 'external_final_copy_audit');
  }
  return errors;
}

function readJson(path, label) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error.message}`);
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(usage());
    return;
  }
  const input = options.input ?? options.positional[0];
  if (!input) throw new Error('Provide --input <map.json>.');
  const inputPath = resolve(process.cwd(), input);
  if (!existsSync(inputPath)) throw new Error(`Input does not exist: ${inputPath}`);
  const finalCopyAuditPath = options.finalCopyAudit ? resolve(process.cwd(), options.finalCopyAudit) : undefined;
  if (finalCopyAuditPath && !existsSync(finalCopyAuditPath)) throw new Error(`Final-copy audit does not exist: ${finalCopyAuditPath}`);
  const map = readJson(inputPath, 'Input');
  const finalCopyAudit = finalCopyAuditPath ? readJson(finalCopyAuditPath, 'Final-copy audit') : undefined;
  const errors = validatePractitionerOperatingLanguageMap(map, {
    allowDraft: options.allowDraft,
    finalCopyAudit,
  });
  if (errors.length) {
    errors.forEach((error) => process.stderr.write(`FAIL ${error}\n`));
    process.exitCode = 1;
    return;
  }
  process.stdout.write(`Practitioner Operating Language Map valid: ${map.map_id || '[draft]'} | status=${map.status}\n`);
  if (finalCopyAudit || map.final_copy_audit) process.stdout.write('Optional final-copy audit valid and linked to the map.\n');
  process.stdout.write('This is terminology/context QA, not topic selection, claim verification, or publication approval.\n');
}

try {
  main();
} catch (error) {
  process.stderr.write(`FAIL ${error.message}\n`);
  process.exitCode = 1;
}
