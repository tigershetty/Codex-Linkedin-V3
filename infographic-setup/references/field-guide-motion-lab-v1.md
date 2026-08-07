# Field Guide Motion Lab v1

**Status:** internal experiment contract. It is not a new publishing lane and it does not authorise
motion for a selected still.

## Purpose

Prove one reusable motion primitive for an exact Field Guide without changing the Field Guide's
truth contract: an explicit signal, state change, or route makes a reader's existing reference
easier to follow. The still remains the primary resource. The experiment package is intentionally
separate from a scheduled post until Tiger approves the exact visual, caption, and channel handoff.

The first internal experiment is a narrow **Supply Risk Escalation Gate**: an explicitly
illustrative signal moves through source reliability, customer exposure, and recovery checks before
the visible exception/owner action. It is a bounded framework, not a supplier-performance claim,
customer case, calculated outcome, or proof that a particular workflow has been deployed.

Do not animate the current Cross-functional Translator Map: its approved review selected `still`
because comparison and return use are its reader value. Do not reopen the parked Ship Now vs
Consolidate route for this lab.

## Why this is a separate control path

The legacy Picture-First Motion Engine operates on a flattened approved image and therefore uses
source-derived masks, covers, highlights, and strict pixel-identical endpoint frames. A Field Guide
starts as an editable Figma master. Its control layer records the Figma source, selected local still,
named semantic regions, and the one motion job before a renderer is selected.

Use this sequence:

```text
Field Guide spec + named Figma source
  -> selected local still + SHA-256
  -> motion manifest
  -> versioned overlay-geometry record (Figma nodes + canvas coordinates)
  -> deterministic asset builder + generated geometry/hash manifest
  -> motion brief / shot plan
  -> one signal-path or state-change treatment
  -> retained lossless endpoint frames
  -> raw-RGBA source-fidelity verification
  -> render-provenance record bound to source, geometry, composition, endpoints, and media
  -> MP4/GIF candidates + contact-sheet review
```

Do not use GPT Image, a video generation model, inpainting, or moving crop rectangles to animate
exact text, source notes, logo geometry, or a Field Guide's working structure.

## Motion eligibility note

Motion may be tested only when this sentence is specific and true:

> Motion helps because the reader needs to see **[a state change, route, regrouping, or cause-and-effect]** in **[the decision-relevant order]**.

The evidence basis is a comprehension rationale, not an engagement promise. Heer and Robertson's
work on animated transitions is useful here because meaningful staged transitions can help a viewer
track objects and change; it does **not** show that GIFs, videos, or a particular frame rate improve
LinkedIn reach. The manifest must therefore record `not_a_performance_claim: true`, and post-level
analytics remain the only evidence of what transferred for this account.

Source: [Heer & Robertson, *Animated Transitions in Statistical Data Graphics*](https://idl.uw.edu/papers/animated-transitions).

## Manifest contract

Copy `templates/field-guide-motion-manifest-template.json` into the experiment package. A non-template
manifest must include all of the following:

| Required record | Why it exists |
|---|---|
| Figma file key, still node, and top-level motion frame | keeps the editable source and export target unambiguous |
| selected local still + SHA-256 | prevents silent source drift after an approved export |
| data package and motion-project locations | lets tools inspect the same object rather than infer an old `post-card.md` |
| semantic regions with a communication job | makes every animated unit explain something |
| locked elements | protects exact typography, marks, and the complete reference |
| eligibility sentence and no-performance-claim flag | blocks decorative motion and borrowed algorithm claims |
| versioned overlay geometry | binds every SVG segment to named Figma node IDs, canvas coordinates, timing, and a communication job |
| deterministic asset manifest | proves the composition is using a current generated geometry module rather than copied coordinates |
| render provenance | prevents an old GIF/MP4 from being passed off as the result of the current source and composition |
| opening/final frame paths | enables real decoded-pixel endpoint checks |

Validate a manifest before an experiment:

```bash
node scripts/validate-field-guide-motion-manifest.mjs \
  --input data/{week}/{slug}/field-guide-motion-manifest.json --verify-files
```

Initialize its local motion project only after the selected still exists:

```bash
node scripts/init-motion-project.mjs \
  --manifest data/{week}/{slug}/field-guide-motion-manifest.json --dry-run
```

## Default render choice

For the initial experiment use the existing local GSAP + Playwright + FFmpeg renderer:

- Figma owns exact typography and the complete static artifact.
- The renderer owns only a small SVG signal, source-registered highlight, or state accent. Its
  coordinates live only in the versioned geometry record; the composition consumes the generated
  module and must not carry duplicate SVG path literals.
- All text, values, source notes, and marks stay locked.
- The output begins and ends on the complete still; retain the lossless first and final screenshots.

Figma's native timeline and MP4 export may be tested in a separate sandbox only after a small
feature-gate check. Its motion API is feature-gated and MP4 is lossy, so it is not yet the source-
fidelity baseline. Remotion, HyperFrames, and generative video are not introduced for the first lab.

## Required QA

1. Validate the Field Guide package and its motion manifest, then run its asset builder in `--check`
   mode. The builder must reject an overlay whose Figma identity, source SHA, canvas, semantic nodes,
   or generated hash has drifted.
2. Render retained lossless PNG frames, including frame 0 and the final still frame, then record
   render provenance for the current source, geometry, generated module, composition, endpoints, and
   media candidates.
3. Run `verify-motion-endpoints.mjs` against those frames. It decodes image pixels to RGBA and
   verifies the selected still SHA-256, not a self-reported sentence in `motion-qa.md`.
4. Run `audit-motion-package.mjs --manifest ...`; it must verify the generated geometry is fresh,
   the composition consumes it, and the render provenance is current before it reports a pass.
5. Inspect a contact sheet at source resolution: opening, one frame per meaningful beat, any reset
   or handoff, final hold, and final frame.
6. Check the complete still remains useful when animation is unavailable or paused.
7. Keep MP4 and GIF as evaluated candidates. Do not assume the legacy GIF-as-LinkedIn-default rule
   is right for exact, type-heavy Field Guides; record the actual publishing-format choice and
   measured result separately.

The experiment passes only if the animated path adds a reader-visible explanation and every retained
endpoint matches the selected still exactly. A polished effect without an additional explanation is
a failed experiment.
