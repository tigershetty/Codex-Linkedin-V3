#!/usr/bin/env node
/**
 * Records an explicit, reversible visual-access boundary for pending saved
 * references. It deliberately does not fabricate visual analysis or remove a
 * source URL; a future authorized batch recovery can replace this state.
 */
import { readReviewLedger, writeReviewFoundation } from './lib/reference-review.mjs';

const deferredAt = '2026-08-05T00:00:00.000Z';
const reason = 'Temporarily inaccessible for complete visual review: the 2026-08-05 browser pilot confirmed live post availability but did not provide a reliable batch media-capture path. Preserve the post URL and retry only with an authorized, batch-capable source.';
const records = readReviewLedger();
let changed = 0;

const updated = records.map((record) => {
  if (record.review?.status !== 'pending_media') return record;
  changed += 1;
  return {
    ...record,
    media: {
      ...record.media,
      status: 'explicitly_inaccessible',
      availability_note: 'Media recovery deferred. No local visual asset is currently available; see inaccessible reason and browser-recovery pilot evidence.',
      checked_at: deferredAt,
    },
    review: {
      ...record.review,
      status: 'inaccessible',
      inaccessible_reason: reason,
    },
  };
});

const validation = writeReviewFoundation(updated);
if (!validation.valid) {
  console.error(validation.errors.map((error) => `FAIL ${error}`).join('\n'));
  process.exit(1);
}
console.log(`Marked ${changed} pending saved references as temporarily inaccessible for visual review.`);
