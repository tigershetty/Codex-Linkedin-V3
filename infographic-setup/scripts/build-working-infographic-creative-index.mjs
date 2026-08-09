#!/usr/bin/env node
/**
 * Build the three-role creative index for high-density Working Infographics.
 *
 * Pierri supplies source-bound information-structure mechanisms. Tiger's
 * manually reviewed Top-100 supplies attention/utility and caption mechanics.
 * No pool selects a supply-chain topic or proves a public claim.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const pierriRoot = resolve(root, 'references/creative-review/pierri-forensics/records');
const top100Root = resolve(root, 'references/creative-review/top100-forensics');
const outputPath = resolve(root, 'references/creative-genome/working-infographic-creative-index-v1.json');

function text(value) { return typeof value === 'string' ? value.trim() : ''; }
function list(value) { return Array.isArray(value) ? value.filter((item) => text(item)) : []; }
function read(path) { return JSON.parse(readFileSync(path, 'utf8')); }
function unique(items) { return [...new Set(items.filter((item) => text(item)))]; }
function top100Family(record) {
  const fingerprint = record.recombination?.mechanism_fingerprint ?? {};
  return text(fingerprint.mechanism_family)
    || text(record.mechanism_family)
    || list(fingerprint.visual_grammar)[0]
    || 'unclassified';
}

function pierriRecord(path) {
  const record = read(path);
  if (record.review_status !== 'reviewed_direct_asset') return null;
  const id = `PIERRI-${String(record.asset_id).padStart(3, '0')}`;
  return {
    record_id: id,
    record_path: `references/creative-review/pierri-forensics/records/${id}.json`,
    corpus: 'pierri',
    asset_format: record.source_asset?.format ?? null,
    argument_shape: text(record.transferable_mechanism?.argument_shape),
    reader_job: text(record.transferable_mechanism?.reader_job),
    mechanism: text(record.transferable_mechanism?.mechanism),
    use_condition: text(record.transferable_mechanism?.use_condition),
    motion_mode: record.motion?.mode ?? 'unknown',
    motion_job: text(record.motion?.motion_job),
    caption_available: record.caption_link?.caption_available === true,
    caption_association_boundary: text(record.caption_link?.limitation),
    anti_copy_boundary: text(record.anti_copy_boundary),
    claim_boundary: text(record.claim_boundary?.note),
  };
}

function top100Record(path) {
  const record = read(path);
  if (record.forensic_record_status !== 'manual_forensic_review') return null;
  const fingerprint = record.recombination?.mechanism_fingerprint ?? {};
  const context = record.source_context ?? {};
  const mechanics = record.content_mechanics ?? {};
  const attention = record.attention_physics ?? {};
  const visual = record.visual_forensics ?? {};
  return {
    record_id: text(record.reference_id),
    record_path: `references/creative-review/top100-forensics/${text(record.reference_id)}.json`,
    corpus: 'top100',
    mechanism_family: top100Family(record),
    primary_cognitive_job: text(fingerprint.primary_cognitive_job) || text(mechanics.primary_cognitive_job),
    reader_states: unique(list(fingerprint.reader_state)),
    social_actions: unique(list(fingerprint.social_action_mechanics).concat(list(mechanics.save_share_return_motives))),
    attention_mechanism: text(attention.thumbnail_read_0_3_seconds),
    visible_proof: text(attention.promise_proved_by_visual),
    utility: text(mechanics.reader_payoff),
    caption_hook: text(context.caption_hook),
    caption_choreography: text(mechanics.caption_to_visual_choreography),
    caption_available: Boolean(text(context.caption_hook)),
    anti_copy_boundary: list(record.recombination?.anti_copy_boundary).join(' | '),
    claim_boundary: text(record.review_method?.boundary),
    visual_anchor: text(visual.dominant_anchor),
  };
}

function load(rootPath, matcher, projector) {
  if (!existsSync(rootPath)) throw new Error(`Expected source directory is missing: ${rootPath}`);
  return readdirSync(rootPath)
    .filter(matcher)
    .sort()
    .map((name) => projector(resolve(rootPath, name)))
    .filter(Boolean);
}

const pierri = load(pierriRoot, (name) => /^PIERRI-\d{3}\.json$/.test(name), pierriRecord);
const top100 = load(top100Root, (name) => /^TOP100-\d{3}\.json$/.test(name), top100Record);

const output = {
  schema_version: '1.0.0',
  generated_at: '2026-08-07',
  purpose: 'Three independent creative source pools for high-density Working Infographic composition. This index does not choose a subject, establish market demand, prove claims, or predict post performance.',
  provenance_contract: {
    pierri: 'Only Pierri records with review_status=reviewed_direct_asset are included. Caption availability records a supplied numeric-ID association and must not be treated as verified post pairing.',
    top100: 'Only Top-100 records with forensic_record_status=manual_forensic_review are included. Curated reference status is creative input, not performance proof.',
    usage: 'A Creative Composition Packet must give information mechanism, attention/utility, and caption mechanism separate roles with anti-copy boundaries.'
  },
  summary: {
    pierri_information_records: pierri.length,
    top100_attention_utility_records: top100.length,
    top100_caption_records: top100.filter((record) => record.caption_available).length,
    pierri_caption_context_records: pierri.filter((record) => record.caption_available).length,
    pierri_argument_shapes: unique(pierri.map((record) => record.argument_shape)).sort(),
    top100_mechanism_families: unique(top100.map((record) => record.mechanism_family)).sort(),
  },
  source_roles: {
    information_mechanisms: pierri,
    attention_or_utility: top100,
    caption_mechanisms: top100.filter((record) => record.caption_available).map((record) => ({
      record_id: record.record_id,
      record_path: record.record_path,
      corpus: record.corpus,
      opening_move: record.caption_hook,
      visual_caption_division: record.caption_choreography,
      anti_copy_boundary: record.anti_copy_boundary,
      claim_boundary: record.claim_boundary,
    })),
  },
};

writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Built Working Infographic Creative Index: ${pierri.length} Pierri information records; ${top100.length} Top-100 attention/utility records; ${output.summary.top100_caption_records} Top-100 caption records.`);
