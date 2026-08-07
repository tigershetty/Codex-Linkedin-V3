#!/usr/bin/env node
/**
 * Applies the generated Top-100 review-status mapping to the canonical
 * 480-post ledger. This is deliberately separate from building the mapping so
 * a provenance downgrade cannot silently preserve old manual-review anatomy.
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  readReviewLedger,
  validateReviewLedger,
  writeReviewFoundation,
} from './lib/reference-review.mjs';

const root = process.cwd();
const updatesPath = resolve(root, 'references/creative-review/top100-ledger-updates-2026-08-05.jsonl');
const CREATIVE_FIELDS = [
  'attention_mechanism',
  'lived_work_moment',
  'reader_payoff',
  'argument_sequence',
  'utility',
  'emotional_trigger',
  'transferable_atoms',
  'anti_copy_boundary',
];
const VISUAL_FIELDS = [
  'composition',
  'hierarchy',
  'eye_path',
  'imagery',
  'typography',
  'layout',
  'pacing',
  'technical_treatment',
  'visual_mechanism',
  'craft_notes',
];
const blank = (fields) => Object.fromEntries(fields.map((field) => [field, null]));

if (!existsSync(updatesPath)) {
  throw new Error(`Missing generated Top-100 ledger updates: ${updatesPath}`);
}
const updates = readFileSync(updatesPath, 'utf8').trim().split('\n').filter(Boolean).map((line) => JSON.parse(line));
const ledger = readReviewLedger();
const ledgerById = new Map(ledger.map((record) => [record.reference_id, record]));

for (const update of updates) {
  const record = ledgerById.get(update.reference_id);
  if (!record) throw new Error(`Top-100 update references missing ledger record ${update.reference_id}`);
  const expectedPaths = record.media?.asset_paths ?? [];
  const updateHashes = update.media?.asset_sha256 ?? {};
  if (expectedPaths.length !== 1 || updateHashes[expectedPaths[0]] == null) {
    throw new Error(`${update.reference_id}: generated update does not hash the exact linked Top-100 asset.`);
  }
  record.media = { ...record.media, ...update.media };
  record.review = { ...record.review, ...update.review, inaccessible_reason: null };
  if (update.review?.status === 'manual_reviewed') {
    record.creative = { ...record.creative, ...(update.creative ?? {}) };
    record.visual = { ...record.visual, ...(update.visual ?? {}) };
  } else if (update.review?.status === 'ready_for_manual_review') {
    // Old template-generated anatomy must not survive a status downgrade.
    record.creative = blank(CREATIVE_FIELDS);
    record.visual = blank(VISUAL_FIELDS);
  } else {
    throw new Error(`${update.reference_id}: unsupported Top-100 update status ${update.review?.status}`);
  }
}

const validation = validateReviewLedger(ledger);
if (!validation.valid) {
  throw new Error(`Refusing to write invalid review ledger:\n${validation.errors.join('\n')}`);
}
writeReviewFoundation(ledger);
console.log(`Applied ${updates.length} Top-100 update(s): manual=${validation.counts.manual_reviewed}, ready_for_manual_review=${validation.counts.ready_for_manual_review}.`);
