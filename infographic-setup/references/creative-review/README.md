# Creative Review Foundation

`reference-review-ledger.jsonl` is the evidence-bound visual and creative-review layer for all 480
saved posts. It is intentionally separate from the immutable content-market-fit audit and generated
Creative Genome.

## Rules

- A caption or preview never counts as visual inspection.
- `needs_authorized_retrieval` means no local asset is currently available; retrieve only through an authorized, read-only source.
- `explicitly_inaccessible` requires a recorded reason.
- `manual_reviewed` requires an inspectable local asset, a matching SHA-256 for every reviewed asset,
  a reviewer, valid review date, record-specific evidence, and all creative-anatomy and visual-craft
  fields. GIF reviews additionally require frame index, timestamp, and observation evidence.
- V4 calibration and five-post cadence remain blocked until `validate-reference-review-foundation.mjs --require-complete` passes.

## Commands

```bash
node scripts/build-reference-review-foundation.mjs
node scripts/validate-reference-review-foundation.mjs
node scripts/validate-reference-review-foundation.mjs --require-complete
node scripts/apply-reference-review-updates.mjs --input references/creative-review/updates.jsonl
```

Place authorized captures under `references/creative-review/media/{reference_id}/`, prepare a JSONL update matching `update-example.jsonl`, apply it, then validate. The update command rejects a manual review that lacks a real asset or a complete creative and visual record.
