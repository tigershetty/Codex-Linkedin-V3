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

## Forensic creative record

For an inspectable post, record the following layers. A one-line label or style description is not a review.

- **source context:** creator, exact caption/transcript where available, asset state, post format,
  observable performance context, and what is unknown. Caption analysis is a separate channel; it
  never substitutes for visual inspection.
- **creative anatomy:** attention mechanism, tension, reader identity trigger, lived work moment,
  payoff timing, argument sequence, utility, emotion, share/save motive, bridge, transferable atoms,
  and anti-copy boundary;
- **visual forensics:** crop and density, layout grid, dominant visual anchor, hierarchy, eye path,
  information chunks, imagery role, typography system, colour/material treatment, pacing, contrast,
  and visual proof of the promise;
- **caption-to-visual choreography:** what the image communicates in three seconds, what the caption
  adds that the image cannot, where the post creates a reveal, and whether it earns recognition,
  understanding, practical use, or intrigue;
- **reverse construction:** a topic-neutral mechanism fingerprint, prompt-style build specification,
  editable levers (with topic intentionally unselected), generic input conditions, expected reader
  response, anti-copy boundary, and falsification test.

Use `references/creative-review/reference-forensics-v1.md` and the JSON template under
`references/creative-review/` for a Top-100 or flagship review. The existing manual ledger remains
the structural acceptance layer for the 480-post foundation; the forensic record is the depth layer
that makes the Genome genuinely reusable.

Use the completed library to retrieve mechanisms and principles, never wording, topic, artwork,
character, composition, or identity from a source creator.
