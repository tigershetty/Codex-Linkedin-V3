# Reference Forensics v1 — Reverse Creative Intelligence

## Why this exists

The old review record could tell us *what category* an image belonged to. It could not reliably tell
us how the post caused a reader to stop, understand, save, share, or return. This record reverses a
successful post into a production-grade specification without turning it into something to copy.

It is the equivalent of reverse-engineering a strong image-generation prompt, except the output is a
human-readable and machine-queryable **creative build brief**.

## Evidence contract

Keep these inputs distinct:

| Input | What it may establish | What it may not establish |
|---|---|---|
| Actual image/video frame | composition, craft, hierarchy, visual promise, reading route | caption argument, outcome validity, post performance |
| Caption/transcript | hook, argument, tone, CTA, creator judgement | unseen visual craft |
| Analytics / post metadata | observed distribution and interaction context | a universal causal rule |
| External source | factual claim, data point, case result | why the visual itself worked |

If a source is missing, say `unknown`; do not fill the gap with a plausible story.

## Required forensic record

Every Top-100 record has the fields in `forensic-record-template.json`.

### 1. Source and reader situation

Name the creator, original post context, format, caption hook, audience state, and work moment. State
what is *visible*, what is caption-derived, and what remains unknown.

### 2. Attention physics

Describe the first 0–3 second read: visual anchor, promise, tension, contrast, number, identity cue,
or metaphor. Then explain the 3–10 second comprehension path and the 10–30 second value exchange.

### 3. Visual mechanics

Record aspect ratio, safe margins, grid, zones, density, visual anchor, eye path, type hierarchy,
contrast, palette/material, icon/illustration role, and whether the visual proves the premise rather
than merely decorating it.

### 4. Content mechanics

Identify the claim mode, information compression method, argument/reveal sequence, reader emotion,
and exact reason a reader could save, share, comment, or revisit it. Then state the unique job of the
caption; it must add more than a transcription of the image.

### 5. Mechanism fingerprint and reverse construction

The forensic record does **not** choose a topic. It extracts the reusable grammar that topic selection
may later call upon. A good fingerprint answers:

- What cognitive job is this post doing: distinguish, diagnose, orient, compare, sequence, reveal,
  commemorate, productise a reference, or make a reader feel recognised?
- What reader state makes that job useful: confusion, disagreement, uncertainty, invisibility,
  overload, ambition, or identity?
- What observable structure carries the job: matrix, ladder, map, scene, before/after, character
  archetypes, field guide, collection, or product proof?
- What social action does it invite: save, send, tag, debate, self-identify, revisit, or act?
- When should it *not* be used: for example, a comparison cannot explain a causal sequence and a
  metaphor cannot carry a high-stakes numerical claim.

Only after retrieval has selected a reader tension and content mode can the mechanism combine with a
topic. The record must not pre-select a supply-chain subject or pretend it knows the next post.

Write the reverse construction in this neutral form:

```text
When the selected opportunity contains [reader state] and needs [cognitive job], use [visual
primitive] to make [abstract tension] visible in the first frame. Build the information in this
sequence: [sequence]. Make the visual itself deliver [reader payoff]; let the caption deliver
[separate caption job]. Require [generic input conditions]. Do not use this mechanism when
[incompatible condition]. Do not borrow [source creator's distinctive expression].
```

Then list editable levers and generic input conditions. `Topic` is an intentionally blank lever, not
a recommendation from the record.

## Gate for use in V4

No image becomes a Creative Genome reference bundle merely because it is visually attractive. It must
have:

1. a verified visual record;
2. a specific attention and reader-payoff mechanism;
3. a caption-to-visual relationship or an explicit `caption_unavailable` state;
4. a topic-neutral mechanism fingerprint and original transformation path;
5. an anti-copy boundary; and
6. a falsification question: *what result would show this mechanism did not transfer for us?*

## Applying it to the Top-100

1. Analyse all local assets in `top100-forensics/`.
2. Use the Top-100 workbook only for source context and caption analysis; do not infer visual facts
   from it.
3. Map the 59 matching assets into the 480-post ledger after the forensic record exists.
4. Use the 38 additional Top-100 assets as a supplementary reference shelf, not as discarded extras.
5. Retrieve references by specific mechanisms and reader outcomes, never by superficial style alone.
