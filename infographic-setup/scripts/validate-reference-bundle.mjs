#!/usr/bin/env node

import { resolve } from 'node:path';
import {
  SCHEMA_VERSION,
  parseCliArgs,
  readJson,
  requireFile,
  resolveActiveGenome,
} from './lib/creative-genome.mjs';

const REQUIRED_ROLES = new Set(['attention', 'comprehension', 'utility', 'bridge']);
const ALLOWED_CLAIM_MODES = new Set([
  'documented_case',
  'public_data_analysis',
  'formula_or_method',
  'tool_workflow',
  'tiger_interpretation',
  'editorial_explainer',
  'sourced_fact',
  'comparative_or_causal',
  'simulation_or_hypothesis',
  'mixed',
]);

function validateBundle(bundle, genome, allowDraft) {
  const errors = [];
  const isDraft = bundle.status === 'draft';
  const draftAllowed = allowDraft && isDraft;

  if (bundle.schema_version !== SCHEMA_VERSION) {
    errors.push(`schema_version must be ${SCHEMA_VERSION}`);
  }
  if (!['draft', 'ready'].includes(bundle.status)) errors.push('status must be draft or ready');
  if (isDraft && !allowDraft) {
    errors.push('draft bundles require --allow-draft');
  }
  if (!draftAllowed) {
    for (const field of ['creative_bundle_id', 'query_id', 'content_id']) {
      const value = String(bundle[field] ?? '').trim();
      if (!value) {
        errors.push(`${field} is required for a ready bundle`);
      } else if (/(?:^|[-_])(draft|placeholder|todo|tbd)(?:$|[-_])/i.test(value)) {
        errors.push(`${field} must use a production identifier, not a template placeholder`);
      }
    }
  }
  if (!ALLOWED_CLAIM_MODES.has(bundle.claim_mode)) {
    errors.push(`unsupported claim_mode: ${bundle.claim_mode}`);
  }
  if (bundle.snapshot_id !== genome.manifest.snapshot.id) {
    errors.push(
      `snapshot_id must match the active genome (${genome.manifest.snapshot.id})`,
    );
  }
  if (!bundle.reader_contract || typeof bundle.reader_contract !== 'object') {
    errors.push('reader_contract is required');
  } else if (!draftAllowed) {
    for (const field of ['problem_3s', 'insight_10s', 'action_30s']) {
      if (!String(bundle.reader_contract[field] ?? '').trim()) {
        errors.push(`reader_contract.${field} is required for a ready bundle`);
      }
    }
  }
  if (!draftAllowed && !String(bundle.selected_direction ?? '').trim()) {
    errors.push('selected_direction is required for a ready bundle');
  }
  if (!draftAllowed && !String(bundle.coherence_rationale ?? '').trim()) {
    errors.push('coherence_rationale is required for a ready bundle');
  }

  if (!Array.isArray(bundle.references)) {
    errors.push('references must be an array');
    return errors;
  }
  if (!draftAllowed && (bundle.references.length < 2 || bundle.references.length > 4)) {
    errors.push('a ready bundle must use 2-4 references');
  }
  if (bundle.references.length > 4) errors.push('a bundle cannot use more than 4 references');

  const genomeIndex = new Map(genome.records.map((record) => [record.reference_id, record]));
  const referenceIds = new Set();
  const creativeElementIds = new Set();
  const coveredRoles = new Set();

  for (const [index, entry] of bundle.references.entries()) {
    const label = `references[${index}]`;
    if (!entry.reference_id || !genomeIndex.has(entry.reference_id)) {
      errors.push(`${label}.reference_id is not present in the active Creative Genome`);
      continue;
    }
    if (referenceIds.has(entry.reference_id)) {
      errors.push(`${label}.reference_id is duplicated`);
    }
    referenceIds.add(entry.reference_id);

    if (!Array.isArray(entry.roles) || entry.roles.length === 0) {
      errors.push(`${label}.roles must contain at least one role`);
    } else {
      for (const role of entry.roles) {
        if (!REQUIRED_ROLES.has(role)) errors.push(`${label}.roles contains unknown role ${role}`);
        coveredRoles.add(role);
      }
    }

    if (!Array.isArray(entry.atoms)) {
      errors.push(`${label}.atoms must be an array`);
    } else {
      if (!draftAllowed && !entry.atoms.length) {
        errors.push(`${label} must name at least one creative atom`);
      }
      for (const [atomIndex, atom] of entry.atoms.entries()) {
        const atomLabel = `${label}.atoms[${atomIndex}]`;
        if (!atom?.creative_element_id?.trim()) {
          errors.push(`${atomLabel}.creative_element_id is required`);
        } else if (!/^CE-/.test(atom.creative_element_id)) {
          errors.push(`${atomLabel}.creative_element_id must begin with CE-`);
        } else if (creativeElementIds.has(atom.creative_element_id)) {
          errors.push(`${atomLabel}.creative_element_id is duplicated`);
        } else {
          creativeElementIds.add(atom.creative_element_id);
        }
        if (!['attention', 'argument', 'visual', 'utility', 'tone', 'bridge'].includes(atom?.atom_type)) {
          errors.push(`${atomLabel}.atom_type is invalid`);
        }
        if (!draftAllowed && !atom?.source_mechanism?.trim()) {
          errors.push(`${atomLabel}.source_mechanism is required`);
        }
        if (!draftAllowed && !atom?.adaptation?.trim()) {
          errors.push(`${atomLabel}.adaptation is required`);
        }
      }
    }
    if (!draftAllowed && !entry.anti_copy_boundary?.trim()) {
      errors.push(`${label}.anti_copy_boundary is required`);
    }

    const source = genomeIndex.get(entry.reference_id);
    if (
      !source.corpus_signals.saved_positive.value &&
      !source.corpus_signals.top100_curated_reference
    ) {
      errors.push(`${label} must be a Tiger-saved or Top-100 curated creative reference`);
    }
    const sourceVisual = source.annotations.visual_structure;
    if (entry.visual_claim_status === 'genome_manual_verified') {
      if (
        sourceVisual.status !== 'manual_verified' ||
        sourceVisual.inspection_level !== 'manual_lightbox'
      ) {
        errors.push(
          `${label} cannot use genome_manual_verified; the source was not manually lightbox-reviewed`,
        );
      }
    }
    if (
      entry.roles?.includes('comprehension') &&
      !['source_visual_inspected', 'genome_manual_verified'].includes(entry.visual_claim_status) &&
      !draftAllowed
    ) {
      errors.push(`${label} fills comprehension but its source visual has not been inspected`);
    }
    if (
      entry.visual_claim_status === 'source_visual_inspected' &&
      !entry.visual_inspection_note?.trim()
    ) {
      errors.push(`${label}.visual_inspection_note is required after source visual inspection`);
    }
    if (!['not_used', 'pending_inspection', 'source_visual_inspected', 'genome_manual_verified'].includes(entry.visual_claim_status)) {
      errors.push(`${label}.visual_claim_status is invalid`);
    }
  }

  if (!Array.isArray(bundle.tiger_precedent_ids) || bundle.tiger_precedent_ids.length > 2) {
    errors.push('tiger_precedent_ids must be an array with at most 2 IDs');
  } else {
    const tigerPrecedentIds = new Set();
    for (const precedentId of bundle.tiger_precedent_ids) {
      if (tigerPrecedentIds.has(precedentId)) {
        errors.push(`Tiger precedent ${precedentId} is duplicated`);
      }
      tigerPrecedentIds.add(precedentId);
      if (referenceIds.has(precedentId)) {
        errors.push(`Tiger precedent ${precedentId} must remain separate from curated creative references`);
      }
      const precedent = genomeIndex.get(precedentId);
      if (!precedent?.corpus_signals.tiger_native_performance) {
        errors.push(`Tiger precedent ${precedentId} is not a Tiger native-performance record`);
      }
    }
  }

  if (!draftAllowed) {
    for (const role of REQUIRED_ROLES) {
      if (!coveredRoles.has(role)) errors.push(`ready bundle does not cover role: ${role}`);
    }
  }

  return errors;
}

function main() {
  const options = parseCliArgs(process.argv.slice(2));
  const input = options.input || options._[0];
  if (!input) {
    throw new Error(
      'Usage: validate-reference-bundle.mjs --input <reference-bundle.json> [--allow-draft]',
    );
  }

  const inputPath = requireFile(resolve(process.cwd(), input), 'Reference bundle');
  const bundle = readJson(inputPath);
  const genome = resolveActiveGenome();
  const errors = validateBundle(bundle, genome, Boolean(options['allow-draft']));

  if (errors.length) {
    throw new Error(`Reference bundle validation failed:\n- ${errors.join('\n- ')}`);
  }

  process.stdout.write(
    `Reference bundle valid: ${bundle.creative_bundle_id} | status=${bundle.status} | references=${bundle.references.length} | snapshot=${bundle.snapshot_id}\n`,
  );
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
