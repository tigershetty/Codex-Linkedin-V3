# Pierri Corpus — Asset-Bound Forensics

**Purpose:** retain precise, inspectable observations from the user-supplied Pierri media corpus.
This is a creative-retrieval aid, not a benchmark, performance study, or a licence to reproduce a
creator's distinctive work.

## What the record means

- `asset-manifest-v1.json` inventories every **locally available** media asset from the existing
  provenance index. It records whether an asset has a detailed sidecar, never whether it was a
  successful LinkedIn post.
- `records/PIERRI-###.json` contains only a **directly inspected** source asset. It binds every
  observation to a source hash, canvas, caption-link status, and (for GIFs) sampled temporal
  positions.
- `queued_asset_available` means the local source exists but has not received a detailed visual
  review. It cannot be treated as a forensic finding or a high-confidence visual retrieval input.
- `asserted_by_numeric_id` is not an original post pairing. The supplied workbook lacks a direct
  media link, post URL, date, and native analytics. Asset `2` is explicitly marked as a known
  visual/caption mismatch.

The present starter set is intentionally varied: hierarchy, comparison, table, selection tree,
layered spatial metaphor, curve/spectrum, process map, and motion-catalog examples. It is not a
claim that the remaining assets are less useful.

## Commands

```bash
node scripts/build-pierri-forensics-manifest.mjs
node scripts/validate-pierri-forensics.mjs
```

The builder reads `vincent-pierri-corpus-index-v1.json`; it never reads, moves, or writes the raw
media folder. The validator checks source-index consistency, sidecar linkage, hash binding, and the
fact that no caption association or performance claim has been silently upgraded.

## How to add a review

1. Inspect the original local asset directly. For a GIF, inspect start, meaningful intermediate,
   and near-complete states; record the exact sampled timestamps.
2. Add `records/PIERRI-###.json` using `pierri-asset-forensic.schema.json`.
3. Do not copy a source creator's wording, artwork, palette, handwritten accents, or visual
   signature into an active post. Capture the **reader job and logical mechanism**, not the skin.
4. Rebuild and validate the manifest.

For cross-corpus direction, use `vincent-pierri-corpus-analysis-v2.md`; the older v1 report
remains a wider, provenance-aware narrative reference.
