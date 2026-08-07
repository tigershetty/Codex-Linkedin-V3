# Top-100 forensic review records

This directory separates **actual asset-specific review** from a useful but non-evidentiary
template layer. It is intentionally separate from the 480-post foundation ledger.

## Record statuses

- `manual_forensic_review` — the only high-confidence status. It requires the exact local asset
  hash, reviewer, review date, record-specific evidence, and—where the asset is a GIF—frame-level
  evidence. These records can enter Creative Genome retrieval.
- `provisional_template_assisted_candidate` — a review queue aid derived from the Top-100 discovery
  index and reusable profile mapping. It preserves candidate mechanisms and caption context, but it
  is **not** a visual inspection and cannot be used as a verified creative mechanism.

There are 97 local Top-100 assets: 60 asset-hashed manual forensic reviews and 37 provisional
candidates awaiting record-specific inspection. Assets `006`, `012`, and `075` are absent from the
local Top-100 folder. The 100 workbook caption contexts remain in
`../top100-forensic-source-context.jsonl`.

## Promotion protocol

To promote a candidate to `manual_forensic_review`:

1. Inspect the exact local file; do not rely on its caption, preview, or template labels.
2. Record the asset's SHA-256, reviewer, review date, and asset-bound evidence.
3. For a GIF, record at least one meaningful frame observation with frame index and timestamp.
4. Add the asset-bound manual review to the canonical 480-post ledger first. It is the review
   source of truth and must contain all creative/visual anatomy fields.
5. Run `node scripts/promote-manual-ledger-forensics.mjs --check` from `infographic-setup/` to
   verify that the ledger asset path, hash, reviewer, date, evidence, and any GIF frames can be
   safely promoted. Only then run it again with `--write`.
6. The promotion script restructures direct ledger observations into the v2 forensic schema and
   removes the candidate's template hypotheses. It does not manufacture new asset observations or
   validate source-post claims.
7. Run `node scripts/validate-top100-forensics.mjs`, then
   `node scripts/build-top100-creative-genome.mjs` and
   `node scripts/validate-top100-creative-genome.mjs` before retrieval.

The saved-post ledger remains the completeness gate for the 480-post review. Captions are source
context only; visual claims require the exact inspected asset.
