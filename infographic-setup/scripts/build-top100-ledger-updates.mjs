#!/usr/bin/env node
/**
 * Converts completed Top-100 forensic records into review-ledger updates for
 * the corresponding saved-post records. This is deliberately a mapping step:
 * it makes direct visual inspection reusable in the 480-post foundation, but
 * it does not mark any unmapped reference as reviewed.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { resolveActiveGenome, stableJsonl } from './lib/creative-genome.mjs';

const root = process.cwd();
const forensicRoot = resolve(root, 'references/creative-review/top100-forensics');
const outputPath = resolve(root, 'references/creative-review/top100-ledger-updates-2026-08-05.jsonl');
const REVIEWED_AT = '2026-08-05T00:00:00.000Z';

const stringify = (value) => Array.isArray(value) ? value.join(' → ') : value;
const first = (...values) => values.find((value) => typeof value === 'string' && value.trim()) ?? '';

function top100Number(assetPath) {
  if (typeof assetPath !== 'string') return null;
  const match = basename(assetPath).match(/^(\d+)/);
  return match ? Number(match[1]) : null;
}

function forensicFor(number) {
  const path = resolve(forensicRoot, `TOP100-${String(number).padStart(3, '0')}.json`);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8'));
}

function updateFromForensic(referenceId, forensic) {
  const mechanism = forensic.recombination?.mechanism_fingerprint ?? {};
  const visual = forensic.visual_forensics ?? {};
  const content = forensic.content_mechanics ?? {};
  const attention = forensic.attention_physics ?? {};
  const assetPath = forensic.asset?.path ?? '(asset path unavailable)';
  const readerState = stringify(mechanism.reader_state ?? forensic.reader_situation?.primary_reader_state ?? []);

  return {
    reference_id: referenceId,
    media: {
      status: 'available_local',
      checked_at: REVIEWED_AT,
      availability_note: `Directly inspected Top-100 visual asset mapped to ${forensic.reference_id}: ${assetPath}.`,
    },
    review: {
      status: 'manual_reviewed',
      reviewed_at: REVIEWED_AT,
      reviewer: 'Codex direct visual forensic review',
      evidence: `Direct local visual inspection recorded in ${forensic.reference_id}; source caption is context only. See references/creative-review/top100-forensics/${forensic.reference_id}.json.`,
    },
    creative: {
      attention_mechanism: first(attention.thumbnail_read_0_3_seconds, mechanism.primary_cognitive_job),
      lived_work_moment: readerState || 'Topic-neutral reader state captured in the linked forensic record.',
      reader_payoff: first(content.reader_payoff, attention.value_exchange_10_30_seconds, mechanism.primary_cognitive_job),
      argument_sequence: stringify(content.argument_sequence ?? mechanism.information_grammar ?? []),
      utility: stringify(content.save_share_return_motives ?? mechanism.social_action_mechanics ?? []),
      emotional_trigger: first(attention.identity_or_curiosity_trigger, readerState),
      transferable_atoms: stringify(forensic.recombination?.transferable_atoms ?? []),
      anti_copy_boundary: stringify(forensic.recombination?.anti_copy_boundary ?? []),
    },
    visual: {
      composition: first(visual.asset_specific_observation, visual.composition_and_grid),
      hierarchy: visual.hierarchy ?? '',
      eye_path: stringify(visual.eye_path ?? []),
      imagery: visual.imagery_role ?? '',
      typography: visual.typography ?? '',
      layout: visual.composition_and_grid ?? '',
      pacing: visual.density_and_pacing ?? '',
      technical_treatment: visual.colour_material_and_contrast ?? '',
      visual_mechanism: first(attention.promise_proved_by_visual, visual.dominant_anchor),
      craft_notes: stringify(visual.craft_observations ?? []),
    },
  };
}

const { records } = resolveActiveGenome();
const updates = [];
const missingForensicAssets = [];
const mappedAssets = new Map();

for (const record of records.filter((candidate) => candidate.corpus_signals?.saved_positive?.value === true)) {
  const numbers = [...new Set((record.creative_assets?.top100_references ?? [])
    .map((asset) => top100Number(asset.local_asset_path))
    .filter(Boolean))];
  if (!numbers.length) continue;
  if (numbers.length > 1) {
    throw new Error(`${record.reference_id} has multiple Top-100 assets; mapping must be deliberately resolved.`);
  }
  const number = numbers[0];
  const forensic = forensicFor(number);
  if (!forensic) {
    missingForensicAssets.push({ reference_id: record.reference_id, top100_asset_number: number });
    continue;
  }
  if (mappedAssets.has(number)) {
    throw new Error(`Top-100 asset ${number} maps to more than one saved reference.`);
  }
  mappedAssets.set(number, record.reference_id);
  updates.push(updateFromForensic(record.reference_id, forensic));
}

if (missingForensicAssets.length) {
  throw new Error(`Mapped assets missing forensic records: ${JSON.stringify(missingForensicAssets)}`);
}

updates.sort((left, right) => left.reference_id.localeCompare(right.reference_id));
writeFileSync(outputPath, stableJsonl(updates));
console.log(`Wrote ${updates.length} mapped Top-100 ledger update(s) to ${outputPath}.`);
