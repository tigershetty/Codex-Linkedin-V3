#!/usr/bin/env node
import { readReviewLedger, reviewCompleteness, validateReviewLedger } from './lib/reference-review.mjs';

const requireComplete = process.argv.includes('--require-complete');
const records = readReviewLedger();
const validation = requireComplete
  ? reviewCompleteness(records)
  : validateReviewLedger(records);

for (const error of validation.errors) console.error(`FAIL ${error}`);
console.log(`Reference review: total=${validation.counts.total} manually_reviewed=${validation.counts.manual_reviewed} inaccessible=${validation.counts.inaccessible} pending_media=${validation.counts.pending_media}`);
if (!validation.valid) process.exit(1);
console.log(requireComplete ? 'Reference-review foundation complete.' : 'Reference-review ledger is structurally valid.');
