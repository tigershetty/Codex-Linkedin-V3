#!/usr/bin/env node
import {
  REVIEW_LEDGER_PATH,
  REVIEW_QUEUE_PATH,
  REVIEW_STATUS_PATH,
  buildReviewLedger,
  readReviewLedger,
  statusMarkdown,
  validateReviewLedger,
  writeReviewFoundation,
} from './lib/reference-review.mjs';
import { readFileSync } from 'node:fs';
import { stableJsonl } from './lib/creative-genome.mjs';

const check = process.argv.includes('--check');
const existing = readReviewLedger();
const records = buildReviewLedger(existing);
const validation = validateReviewLedger(records);

if (!validation.valid) {
  console.error(validation.errors.map((error) => `FAIL ${error}`).join('\n'));
  process.exit(1);
}

if (check) {
  const expectedLedger = stableJsonl(records);
  const currentLedger = readFileSync(REVIEW_LEDGER_PATH, 'utf8');
  const currentStatus = readFileSync(REVIEW_STATUS_PATH, 'utf8');
  if (currentLedger !== expectedLedger || currentStatus !== statusMarkdown(validation)) {
    console.error('FAIL reference-review foundation differs from its deterministic build.');
    process.exit(1);
  }
  console.log('Reference-review foundation is current.');
} else {
  writeReviewFoundation(records);
  console.log(`Reference-review foundation built: total=${validation.counts.total} local=${validation.counts.available_local} pending_media=${validation.counts.pending_media}`);
  console.log(`Ledger: ${REVIEW_LEDGER_PATH}`);
  console.log(`Recovery queue: ${REVIEW_QUEUE_PATH}`);
}
