---
name: creative-recombine
description: Retrieve and recombine Tiger's saved LinkedIn references into original Shetty's Desk content directions. Use when selecting or developing a LinkedIn post, Substack flagship, website artifact, hook, visual structure, framework, or product bridge before research depth and production are fixed.
---

# Creative Recombine

Use Tiger's saved-post corpus as the creative north star. Treat every saved post as a positive signal;
do not revalidate whether it deserves use.

## Frame the query

1. Read `references/creative-genome-recombination-engine-v1.md` and the active genome manifest.
2. Define the reader, work moment, decision or curiosity, care statement, possible content modes, and
   patterns Shetty's Desk has overused.
3. Create `data/{week}/{slug}/reference-query.json` from the template.
4. Keep `eligible_creative_signals` restricted to curated saved or Top-100 sources, use a 10-15
   result limit, and request Tiger precedents separately.

## Retrieve

Run:

```bash
node scripts/retrieve-creative-references.mjs \
  --query data/{week}/{slug}/reference-query.json \
  --output data/{week}/{slug}/reference-candidates.json

node scripts/compile-recombination-brief.mjs \
  --candidates data/{week}/{slug}/reference-candidates.json \
  --output data/{week}/{slug}/recombination-brief.md
```

Rankings indicate fit, never universal quality. Inspect the real visual before treating a visual
mechanic as verified.

## Decompose and recombine

1. Extract attention, argument, visual, utility, and bridge atoms from the shortlist.
2. Generate ten concepts. Change the argument, visual object, utility, or bridge; headline-only
   variants do not count.
3. Develop at least three genuinely different directions. Utility, visual idea, and narrative are a
   useful default spread, not a quota.
4. Keep one reader promise across every selected atom.
5. Select two to four curated references for attention, comprehension, utility, and bridge. Saved
   posts are the default north star; Top-100-only cases supplement them when they add useful range.
   One source may fill several roles.
6. Add up to two Tiger precedents to understand transfer on this account.
7. Record the exact transformation and anti-copy boundary for every source.

## Build and validate the bundle

Create `reference-bundle.json` from the template. Mark it `ready` only after the actual visual used for
comprehension has been inspected and the 3/10/30 reader contract, selected direction, and coherence
rationale are complete.

```bash
node scripts/validate-reference-bundle.mjs \
  --input data/{week}/{slug}/reference-bundle.json
```

## Handoff

Pass the selected direction to `content-brief-v2.md`. Choose the content mode after exploration, then
route only the claims that require research. Do not demand numerical proof for a correctly attributed
framework, and never use an internal test fixture as a public outcome.

Return the ten concepts, three developed directions, selected bundle, claim-support needs, and the
specific question that still needs Tiger's judgment.
