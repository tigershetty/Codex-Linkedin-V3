#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  REVIEW_LEDGER_PATH,
  readReviewLedger,
  validateReviewLedger,
  writeReviewFoundation,
} from './lib/reference-review.mjs';
import { readJsonl } from './lib/creative-genome.mjs';

const inputIndex = process.argv.indexOf('--input');
if (inputIndex === -1 || !process.argv[inputIndex + 1]) {
  console.error('Usage: node scripts/apply-reference-review-updates.mjs --input path/to/updates.jsonl');
  process.exit(2);
}

const inputPath = resolve(process.cwd(), process.argv[inputIndex + 1]);
const updates = readJsonl(inputPath);
const records = readReviewLedger();
const byId = new Map(records.map((record) => [record.reference_id, record]));

for (const update of updates) {
  if (!update.reference_id || !byId.has(update.reference_id)) {
    console.error(`FAIL unknown review reference_id: ${update.reference_id ?? '(missing)'}`);
    process.exit(1);
  }
  const current = byId.get(update.reference_id);
  byId.set(update.reference_id, {
    ...current,
    media: { ...current.media, ...(update.media ?? {}) },
    review: { ...current.review, ...(update.review ?? {}) },
    creative: { ...current.creative, ...(update.creative ?? {}) },
    visual: { ...current.visual, ...(update.visual ?? {}) },
  });
}

const merged = [...byId.values()].sort((left, right) => left.reference_id.localeCompare(right.reference_id));
const validation = validateReviewLedger(merged);
if (!validation.valid) {
  console.error(validation.errors.map((error) => `FAIL ${error}`).join('\n'));
  process.exit(1);
}

writeReviewFoundation(merged);
console.log(`Applied ${updates.length} review update(s) to ${REVIEW_LEDGER_PATH}.`);
