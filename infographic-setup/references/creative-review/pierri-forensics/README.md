# Pierri Corpus — Asset-Bound Forensics

**Purpose:** retain precise, inspectable observations from the user-supplied Pierri media corpus.
This is a creative-retrieval aid, not a benchmark, performance study, or a licence to reproduce a
creator's distinctive work.

## What the record means

- `asset-manifest-v1.json` inventories every **locally available** media asset from the existing
  provenance index. It records whether an asset has a detailed sidecar, never whether it was a
  successful LinkedIn post. The current manifest contains all **53 / 53** supplied local assets
  as direct, source-hash-bound reviews.
- `records/PIERRI-###.json` contains only a **directly inspected** source asset. It binds every
  observation to a source hash, canvas, caption-link status, and (for GIFs) sampled temporal
  positions.
- `queued_asset_available` means the local source exists but has not received a detailed visual
  review. It cannot be treated as a forensic finding or a high-confidence visual retrieval input.
  There are currently no queued local assets; the status remains part of the schema so a future
  source addition cannot be silently treated as reviewed.
- `asserted_by_numeric_id` is not an original post pairing. The supplied workbook lacks a direct
  media link, post URL, date, and native analytics. Asset `2` is explicitly marked as a known
  visual/caption mismatch.

The completed set covers multiple reader jobs: comparison, selection, sequence, hierarchy,
dependency, formulas, evidence displays, annotated examples, and motion demonstrations. It does
not make the source corpus a performance sample, nor does it turn every observed visual treatment
into a Shetty's Desk default.

## Commands

```bash
# Validates committed provenance records; succeeds in a clean clone without ignored raw media.
node scripts/build-pierri-forensics-manifest.mjs
node scripts/validate-pierri-forensics.mjs

# Requires the original user-supplied raw corpus and verifies its bytes and GIF metadata.
node scripts/validate-pierri-forensics.mjs --require-source-media
```

The builder reads `vincent-pierri-corpus-index-v1.json`; it never reads, moves, or writes the raw
media folder. The default validator checks the committed index, manifest, and forensic sidecars;
it deliberately does **not** pretend ignored raw media is present in every checkout. Its final line
states that raw-media verification was skipped and whether the expected source paths are locally
available.

Use `--require-source-media` only with the original user-supplied corpus restored at the
repository-relative paths recorded by the index. It fails when any source file is unavailable and,
when the full corpus is present, reads each source **without modifying it** to check the source-index
and sidecar hash, format, canvas, GIF frame count, one-cycle GCE duration, and sampled timestamp
bounds. Neither mode upgrades caption association or performance evidence.

## How to add or revise a review

1. Inspect the original local asset directly. For a GIF, inspect start, meaningful intermediate,
   and near-complete states; record the exact in-cycle source timestamps (each must be greater than
   or equal to `0` and less than the GIF's GCE duration). Do not infer observations from a caption,
   filename, preview, or a neighbouring asset.
2. Add `records/PIERRI-###.json` using `pierri-asset-forensic.schema.json`.
3. Do not copy a source creator's wording, artwork, palette, handwritten accents, or visual
   signature into an active post. Capture the **reader job and logical mechanism**, not the skin.
4. Rebuild and validate the manifest. The manifest builder reads the source index and sidecars
   only; it never modifies raw media.

For cross-corpus direction, use `vincent-pierri-corpus-analysis-v2.md`; the older v1 report
remains a wider, provenance-aware narrative reference. The v2 analysis distinguishes direct
asset observations from its derived production hypotheses.
