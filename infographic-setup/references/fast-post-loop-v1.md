# Fast Post Loop v1

**Status:** active only after the Creative Review Foundation and calibration gate pass

## Why it exists

Five posts a week cannot be five miniature consulting engagements. This loop protects the useful
creative work and removes the paperwork that was delaying it.

Use this for an ordinary LinkedIn post. Use the full Creative Genome package only when the post is
a flagship, contains a substantial evidence claim, or needs a real downloadable artifact.

Before any V4 production, run `node scripts/validate-reference-review-foundation.mjs --require-complete`.
The first release after it passes is a declared calibration post. Do not restart the five-post cadence
until the calibration review records the approved visual, caption, audience-relevance sample, and
one transfer decision.

## The 75-minute ceiling

The first 25 minutes decide whether this topic deserves production. The rest is a short execution
window, not permission to keep exploring until something looks acceptable.

| Time | Do only this |
|---|---|
| 0-3 minutes | Name the reader, real work moment, tension, and one thing they could keep. If starting from a broad domain, take one existing scope window from `supply-chain-opportunity-map-v1.md`; do not build or extend a map. |
| 3-7 minutes | Pull two to four saved references from the current shelf. Take the useful atoms; do not retrieve the whole archive. |
| 7-17 minutes | Write up to three rough routes (`A:`, `B:`, `C:`). Each has a different work moment, visual proof, hook, and saveable keep. They are not rendered layouts. |
| 17-22 minutes | Run the five reader checks in rough form. Kill routes that do not clear them. |
| 22-25 minutes | Select one route or park the topic. Record the selection and render budget in the post card. |
| 25-75 minutes | Produce the selected route, one caption and its one permitted rewrite, then stop. |

This is a ceiling, not a minimum. If there is no credible route at minute 25, park it; do not make a
calculator, research dossier, full reference bundle, detailed concept board, or extra finished
tiles to rescue it. Those are flagship work.

### Optional map handoff

The Supply-Chain Opportunity Map is a three-minute lookup for a broad starting point, not an added
Fast Post stage. Its only output is one bounded scope window: reader/moment, object or signal,
decision/tension, cognitive job, truth route, and boundary. Use that window to retrieve references
and write rough routes; never map adjacent branches, research every node, or treat the map as a
Field Guide admission test.

## The post card

One file, `post-card.md`, is the source of truth for a standard post. It starts with the route lock:

    **Route:** standard
    **Started at:** 2026-08-03T09:00:00+02:00
    **Selected at:** 2026-08-03T09:25:00+02:00
    **Render budget:** 1 or 2
    **Render paths:** visual-first.png, visual-correction.png
    **Reader and real work moment:**
    **Opening tension:**
    **The visible proof:**
    **The useful keep:**
    **Saved references used:**
    **Three rough routes:**
    A: ...
    B: ...
    C: ...
    **Selected route and why:**
    **Active visual:**
    **Active caption:**
    **Claim boundary:**
    **Publication status:** draft / approved by Tiger / published

Use an ISO timestamp with a timezone. `Selected at` must be within 30 minutes of `Started at`;
the operational target is 25. `Render paths` lists every active PNG in the package, including the
active visual. The active visual and caption paths are explicit, so a check may never silently
review an older `visual.png` simply because it happens to exist.

## The five reader checks

1. **Stop:** Would the right reader recognise the situation, understand a useful promise, or feel a deliberate visual intrigue in three seconds?
2. **Show:** Does the image itself show the tension, rather than a caption explaining it? For a
   constraint route, can the reader see the evidence → boundary → changed action with the headline
   covered?
3. **Keep:** Is there one useful rule, map, or distinction worth saving?
4. **True:** Are the visible claims proportionate to the support we actually have?
5. **Tiger:** Does the caption sound like a relatable translator or challenging peer making a clear point, not a generic explainer?

One critical no triggers one named correction, not a new direction. For a constraint route, that
correction must repair the causal proof of the boundary; if it does not, park the post. Never use
extra production effort to disguise a weak story.

## Rendering rule

For a standard image-led post, the final visual is rendered natively by the image engine.
Do not paste HTML, SVG, dashboard cards, or a title layer over an image to make it feel finished.
The scene, hierarchy, text treatment, and visual tension must be one rendered composition.

The render budget is one or two native image renders total:

1. The selected first render.
2. One correction only, named against the failed reader check (for example, `correction—make the
   decision boundary visible`).

A third render is not a revision; it is a new direction. Park it or move it to a declared
flagship. Do not keep unused active PNGs beside the selected one: list the first render and, if
used, the correction in `Render paths`.

Write one caption after the visual. It may receive one rewrite after the reader check. If the
caption still fails the Tiger or Keep check, park the post rather than adding more versions.

An exact spreadsheet, field guide, calculator, or document may be a separate artifact when it adds
genuine utility. It is not a compulsory lower strip bolted onto a social visual.

## Field Guide exception

Use the specialist Field Guide Notebook route only when the selected post needs a compact working
reference and passes the admission test in `v5-field-guide-notebook-production-system.md`. It may
remain a standard post if the first 25 minutes still select it, but it needs a
`field-guide-spec.json`, a deterministic Figma master, and the Field Guide review; it never becomes
a generic card template or a reason to expand a weak daily topic into a flagship.

## Flagship and brand-lab route

This loop is deliberately narrow. Declare a separate `**Route:** flagship` or brand-lab package
when one of these is true:

- a new creative family needs a fresh 10-15 reference exploration;
- a numerical, company, research, or current-tool claim needs a detailed evidence trail;
- a public artifact will be used repeatedly;
- the post is a brand-defining flagship, Substack issue, or website resource.
- the work needs a calculator, a full research dossier, more than three rough routes, or more than
  two image renders.

The flagship route uses the existing reference bundle, recombination brief, claim ledger, and full
production audit. It must declare itself as flagship before expansion; it is never the automatic
default. Do not mix its active bundle, calculator, directions, or extra renders into a standard
post package. A parked standard topic may return only as a newly declared flagship, not as a
quietly expanding daily post.
