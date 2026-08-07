#!/usr/bin/env node
/**
 * Maps Top-100 forensic records into the corresponding saved-post review
 * ledger. Only an asset-hashed, manually evidenced forensic record can mark a
 * saved post as manually reviewed; template-assisted candidates stay ready for
 * manual review and do not inject unverified creative anatomy into the ledger.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { resolveActiveGenome, stableJsonl } from './lib/creative-genome.mjs';

const root = process.cwd();
const forensicRoot = resolve(root, 'references/creative-review/top100-forensics');
const outputPath = resolve(root, 'references/creative-review/top100-ledger-updates-2026-08-05.jsonl');
const stringify = (value) => Array.isArray(value) ? value.join(' → ') : value;
const first = (...values) => values.find((value) => typeof value === 'string' && value.trim()) ?? '';
const manualForensic = (forensic) => forensic?.forensic_record_status === 'manual_forensic_review'
  && forensic.review_method?.mode === 'manual_asset_review'
  && forensic.asset?.status === 'manually_reviewed';

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
  const isManual = manualForensic(forensic);
  const mechanism = forensic.recombination?.mechanism_fingerprint ?? {};
  const visual = forensic.visual_forensics ?? {};
  const content = forensic.content_mechanics ?? {};
  const attention = forensic.attention_physics ?? {};
  const assetPath = forensic.asset?.path ?? '(asset path unavailable)';
  const readerState = stringify(mechanism.reader_state ?? forensic.reader_situation?.primary_reader_state ?? []);

  const update = {
    reference_id: referenceId,
    media: {
      status: 'available_local',
      checked_at: isManual ? forensic.review_method.reviewed_at : forensic.review_method.generated_at ?? null,
      asset_sha256: forensic.asset?.sha256 ? { [assetPath]: forensic.asset.sha256 } : {},
      availability_note: isManual
        ? `Manually reviewed Top-100 visual asset mapped to ${forensic.reference_id}: ${assetPath}.`
        : `Local Top-100 asset mapped to provisional candidate ${forensic.reference_id}: ${assetPath}. Manual visual review is still required.`,
    },
    review: {
      status: isManual ? 'manual_reviewed' : 'ready_for_manual_review',
      reviewed_at: isManual ? forensic.review_method.reviewed_at : null,
      reviewer: isManual ? forensic.review_method.reviewer : null,
      evidence: isManual
        ? `${forensic.review_method.evidence} See references/creative-review/top100-forensics/${forensic.reference_id}.json.`
        : null,
      review_kind: isManual ? 'manual_asset_review' : 'template_assisted_candidate',
      candidate_forensic_path: `references/creative-review/top100-forensics/${forensic.reference_id}.json`,
    },
  };

  if (!isManual) return update;
  return {
    ...update,
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
