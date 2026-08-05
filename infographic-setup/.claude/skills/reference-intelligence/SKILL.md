---
name: reference-intelligence
description: Build, recover, manually review, and retrieve Shetty's Desk saved-post creative intelligence. Use for the 480-post review foundation, visual availability audits, authorized media recovery, creative-atom annotation, or reference-library queries.
---

# Reference Intelligence

Treat every saved post as a positive creative signal. Do not argue whether it was worth saving.

## Foundation first

1. Run `node scripts/build-reference-review-foundation.mjs`.
2. Read `references/creative-review/reference-review-status.md` and recovery queue.
3. Retrieve media only through authorized, read-only access; store it under
   `references/creative-review/media/{reference_id}/`.
4. Apply a complete manual record through `apply-reference-review-updates.mjs`.
5. Run structural validation after every batch and complete validation before V4 production.

Never call a caption, thumbnail, or heuristic label a visual review. Mark unavailable media as
`explicitly_inaccessible` with a real reason rather than guessing.

## Manual review record

For an inspectable post, record both layers:

- creative anatomy: attention mechanism, lived work moment, payoff, argument, utility, emotion,
  transferable atoms, and anti-copy boundary;
- visual craft: composition, hierarchy, eye path, imagery, typography, layout, pacing, technical
  treatment, visual mechanism, and craft notes.

Use the completed library to retrieve mechanisms and principles, never wording, topic, artwork,
character, composition, or identity from a source creator.
