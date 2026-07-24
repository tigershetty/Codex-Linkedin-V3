# Motion Engine v1 - Adaptive Picture-First Motion

**Version:** 1.2
**Date:** 2026-07-19
**Status:** Active motion standard for Supply Chain 101 and AI for Supply Chain
**Reference implementations:** `videos/optimal-batch-size-motion/`; `videos/five-pre-sop-reviews-motion/`
**Reference outputs:** `data/2026-W30/optimal-batch-size-decision-board/visual-motion.gif`; `data/2026-W32/five-pre-sop-reviews/visual-motion.gif`

## 1. Purpose

Motion is the standard companion lane for a selected exact 4:5 `visual.png` when
the value gate passes. Build it during the Draft Sprint and approve it with the
integrated package. The default eligible package is `visual.png`,
`visual-motion.gif`, and `visual-motion.mp4`. Motion must make the still easier
to notice, understand, or follow without replacing the still as the primary
artifact. A still-only result requires a documented eligibility exception.

The operating principle is:

> Keep the authored visual intact. Animate complete source-authored objects or
> deterministic data layers so the motion demonstrates how the artifact works.

This is not a universal EOQ animation template. The tools and QA gates repeat;
the choreography does not.

## 2. What This Session Proved

| Finding | What went wrong before | Production rule |
|---|---|---|
| Overlay-only motion feels detached | Broad glows and strokes sat above the PNG instead of moving with its content | An overlay may emphasize a source element, but the main event must be a source component revealing, changing state, or carrying a signal |
| Rectangular crops create collisions | A crop includes neighboring pixels, text, shadows, and background, then overlaps them when moved | Never animate raw rectangular crops as floating layers |
| A flattened render is not a layered design file | Objects, shadows, reflections, and nearby marks are fused into one bitmap | Define semantic components from the visible layout; do not pretend every object can be extracted independently |
| Compound graphics must stay compound | Separately masking the EOQ chart's curves left shadows and fragments behind | When elements share shadows or occlusion, reveal the whole chart/panel as one component, then emphasize its sub-elements |
| Subtle luminance alone is easy to miss | The cleanest early GIF was polished but barely noticeable in-feed | Use an intentional delayed reveal when the goal is stop-scroll motion; preserve a complete opening frame so the post still reads instantly |
| Erasure quality determines credibility | Weak masks left ghost text, formula fragments, and object shadows | Inspect the fully cleared state at source resolution before rendering the final GIF |
| A clean reset is not always possible | MPS status, horizon, and model covers damaged the printed grid, perspective, or compound shadows | Reject destructive clearing when reconstruction is not credible; keep the still locked and use delayed registered highlights plus signals along existing paths |
| Text and logos are fragile | Moving or rebuilding them introduces drift, overlap, and brand damage | Keep all body text, formulas that cannot be isolated cleanly, and exact logos locked unless the motion concept specifically requires a verified reveal |
| The still needs reading time | Continuous effects make a dense infographic harder to consume | End with at least 1.2 seconds of the complete, motion-free visual |
| The loop must preserve the approved art | A near-match is not enough for a picture-first post | The first and final lossless frames must be pixel-identical to `visual.png` |

## 3. Motion Eligibility Gate

Use motion only when it can add at least one of these:

- the visual contains a meaningful reading order,
- a decision signal can travel through the artifact,
- a comparison becomes clearer through sequencing,
- a process, hierarchy, or build-up benefits from reveal,
- delayed component loading makes a dense image easier to enter.

Keep the still only when motion would be decorative, force text to move, obscure
the hero, or require inventing hidden pixels that do not exist.

Write this sentence before production:

> Motion adds value beyond the still by showing [sequence, dependency,
> comparison, state change, or decision logic].

If the sentence is weak, do not animate the post.

## 4. Constants And Variables

### Constants across every post

- `visual.png` is the exact 1080 x 1350 immutable visual source.
- The opening frame is the complete still.
- The closing frame is the complete still.
- Exact text, numbers, formulas, logos, and brand geometry remain correct.
- Motion stays inside registered semantic regions.
- The GIF remains readable when paused on any frame.
- A full-resolution MP4 master is exported with every GIF.
- The GIF is the LinkedIn publishing asset. The website serves the MP4 master with the approved still as poster and keeps the GIF only as fallback.
- Playwright captures deterministic frames; FFmpeg performs final encoding.

### Variables authored for every post

- motion archetype,
- semantic component map,
- reading order,
- number and duration of beats,
- extraction or cover method per component,
- signal path,
- emphasis style,
- final hold length.

Repeat the production system, not the composition.

## 5. Choose Choreography From The Layout

| Visual archetype | Preferred motion grammar |
|---|---|
| Decision board | input or formula -> analysis -> options -> trade-off -> verification |
| Process or workflow | reveal stages in operating order; move one signal through the path |
| Matrix or quadrant | establish axes -> reveal quadrants -> locate or move the decision marker |
| Table or scorecard | reveal headers -> scan only the decisive rows/columns -> land on the decision cell |
| Formula or model | notation -> variables -> curve or worked example -> decision implication |
| Comparison | establish both sides -> reveal the meaningful differences -> resolve the choice |
| Hierarchy or stack | build from foundation upward; emphasize the load-bearing layer |
| Network or map | establish nodes -> trace one route -> show the constraint or handoff |
| Annotated hero | keep the hero fixed; reveal callouts around it in a deliberate eye path |
| Calendar or sequence | move through a few priority moments, not every cell |
| Operating system or playbook | open with the complete artifact; reveal modules in the meeting's decision order |

The archetype defines the eye path. It does not prescribe the art direction.

## 6. Layer Model

Every production composition may use these layer types:

1. **Locked canonical still** - the exact `visual.png` used for the opening and restored hold.
2. **Clean authored stage** - a deterministic background plate used when the composition genuinely deconstructs or assembles.
3. **Source-authored components** - complete objects isolated with alpha masks, including their own text, materials, shadows, and meaning.
4. **Deterministic vector or data layers** - SVG paths, chart traces, counters, or geometry reconstructed from verified source values.
5. **Hand-off and state signals** - brief labels, packets, pips, or traces that expose sequence or decision logic.
6. **Finishing effects** - restrained highlights or sheens that support an already meaningful beat.

Finishing effects cannot be the main event. Broad rings, glows, and sweeps above a flattened PNG fail when they do not change understanding.

## 7. Isolation Decision Tree

Choose the least invasive method that produces a clean reset:

| Source condition | Method |
|---|---|
| Flat, distinct color such as a formula stroke, status scale, or checkmark | Build a semantic color mask; create a clean cover and source-colored highlight from that mask |
| Object cluster inside a clean card or panel | Fit a pale surface from light, low-chroma source pixels; cover the complete object cluster; reveal it as one unit |
| Integrated chart, 3D object, or scene with shared shadows | Treat the complete chart/scene region as one semantic component; emphasize sub-elements only after the whole unit returns |
| Clean transparent source asset exists | Use the actual transparent asset, registered to the visual |
| Complete 3D or editorial object has a separable silhouette | Isolate the full object with a shaped alpha mask and animate it as one source-authored component |
| Verified data can be reconstructed exactly | Build a deterministic SVG/data layer and compare its labels and values to the source |
| Background cannot be reconstructed credibly | Do not erase or move the component; use a local highlight or signal instead |
| Text, exact logo, or formula would need approximation | Keep it locked |

Hard rule: if the fully cleared frame contains ghosts, duplicated shadows,
clipped words, or obvious patches, the component map is wrong. Change the
component boundary or isolation method before tuning animation.

## 8. Production Workflow

### Step 1 - Lock the selected draft still

- Correct text, formulas, logos, and data before motion.
- Promote the selected exact 1080 x 1350 draft to `visual.png` and `visual-linkedin.png`.
- Do not animate a still that still needs text, logo, formula, or data repairs.

### Step 2 - Write the motion brief

Copy `templates/motion-brief-template.md` into the post's motion project. Define:

- why motion earns its place,
- visual archetype,
- reading order,
- locked elements,
- semantic reveal units,
- isolation method per unit,
- timeline and final hold,
- hard QA risks.

Initialize the folder contract without overwriting existing work:

```bash
node scripts/init-motion-project.mjs data/{week}/{slug}
```

Use `--dry-run` to preview the files. The initializer copies the selected visual,
records its true dimensions, and creates a static composition contract. It does
not invent the semantic components or choreography.

### Step 3 - Create the shot plan

Copy `templates/motion-shot-plan-template.json`. Keep four to six major beats.
Each beat must have one communication job.

### Step 4 - Build motion assets

Use deterministic image processing for masks and covers:

- Pillow and NumPy for semantic masks, fitted surfaces, and source highlights,
- actual transparent logos or icons only when they are already authored assets,
- no image-model redraw during motion production.

Store generated files under:

```text
videos/{slug}-motion/assets/
  visual.png
  masks/
  covers/
  highlights/
```

### Step 5 - Author the timeline

Use one self-contained HTML composition with GSAP:

```text
videos/{slug}-motion/compositions/main.html
```

The timeline must be paused and scrub-able through `window.__tl`. Set
`window.__dur` and wait for all images before setting `window.__ready = true`.

### Step 6 - Run low-cost QA first

Render at 10fps and retain frames. Inspect at minimum:

- frame 0,
- fully cleared/reset frame when the choreography uses one; otherwise the strongest focus-transition frame,
- one frame from every reveal beat,
- complete final hold,
- final frame.

Do not proceed because the GIF thumbnail looks acceptable. Inspect the reset
and tight transition regions at source resolution.

Set `FRAMES_DIR=../../videos/{slug}-motion/qa/frames` when invoking
`render-anim.mjs` so QA evidence stays with the motion project.

### Step 7 - Render publish outputs

Default target:

```text
MP4: source aspect ratio, 30fps, full practical resolution
GIF: 720px wide, 18-20fps, palettegen/paletteuse, usually 8-14 seconds
```

Place canonical outputs in the post folder:

```text
visual-motion.gif
visual-motion.mp4
```

Descriptive candidate suffixes are allowed during iteration. Promote only one
canonical pair after selection.

### Step 8 - Verify endpoints and specs

- Compare source versus frame 0: pixel difference must be zero.
- Compare source versus final frame: pixel difference must be zero.
- Check dimensions, duration, frame rate, frame count, and file size with
  `ffprobe`.
- View a contact sheet of representative frames.
- Record the results in `templates/motion-qa-template.md`.
- Run `node scripts/audit-motion-package.mjs data/{week}/{slug}`.

## 9. Timing Blueprint

Use this as a starting rhythm, not a fixed template:

| Phase | Typical time | Purpose |
|---|---:|---|
| Complete opening still | 0.20-0.40s | Strong first frame and immediate comprehension |
| Reset/deconstruction or focus transition | 0.25-0.45s | Create an intentional delayed reading state without forcing destructive erasure |
| Main reveal beats | 0.40-0.90s each | Rebuild the reading path |
| Micro emphasis | 0.18-0.40s | Confirm a decision point without creating visual noise |
| Complete final hold | 1.20-2.00s | Let the reader consume the finished artifact |

Prefer one clear action at a time. Small overlaps are allowed when they preserve
continuity, but simultaneous animation across distant regions usually reads as
noise.

## 10. Motion QA Gates

### Hard fails

- first or final lossless frame differs from `visual.png`,
- wrong, clipped, ghosted, duplicated, or moving text,
- approximate or moving brand/tool logos,
- raw crop rectangles visibly overlap the source,
- reset covers look pasted on or leave source remnants,
- a highlight points to the wrong element,
- motion changes the meaning of a chart or formula,
- hero visibility is reduced,
- the animation never rests on the complete visual,
- GIF palette damage makes text materially harder to read.
- motion consists mainly of decorative highlights above a flattened still,
- the value added beyond the still cannot be stated or seen.

### Quality score

Score 1-5:

| Dimension | A score of 5 means |
|---|---|
| Noticeability | Motion is obvious in-feed without becoming loud |
| Reading order | The sequence makes the artifact easier to follow |
| Source fidelity | It feels authored from the still, not placed above it |
| Value added | Motion makes sequence, dependency, comparison, state, or decision logic easier to understand |
| Layout fit | Choreography is specific to this composition |
| Restraint | Text, logos, background, and hero remain stable |
| Technical finish | No ghosts, overlaps, jumps, or loop seams |
| Pause readability | Every representative frame remains coherent |

Publish bar: average 4.3 or higher, with 5 for source fidelity, at least 4 for value added, and no hard fail.

## 11. Project Contract

```text
videos/{slug}-motion/
  README.md
  motion-brief.md
  shot-plan.json
  build_motion_assets.py
  assets/
    visual.png
    stage-background.png
    layers/
    masks/
    covers/
    highlights/
  compositions/
    main.html
  qa/

infographic-setup/data/{week}/{slug}/
  visual.png
  visual-motion.gif
  visual-motion.mp4
  motion-qa.md
```

The Python asset builder and HTML composition are deliberately bespoke. Reuse
the folder contract, renderer, layer types, and QA gates; adapt the component
logic to the post.

## 12. Reference Implementation: EOQ Decision Board

The EOQ motion project is the benchmark because it solved three different
isolation problems in one visual:

- formula, trade-off indicators, and checks used semantic color masks,
- 3D batch models used fitted clean panel plates,
- the cost chart became one compound reveal because its curves shared shadows,
- source-derived highlights and small SVG signals provided emphasis,
- the full visual opened and closed the loop exactly,
- the final GIF remained picture-first at 1.1MB.

Reference files:

- `videos/optimal-batch-size-motion/README.md`
- `videos/optimal-batch-size-motion/build_motion_masks.py`
- `videos/optimal-batch-size-motion/compositions/delayed-reveal.html`
- `videos/optimal-batch-size-motion/shot-plan-delayed-reveal.json`

Use these as implementation evidence, not as a layout template.

## 13. Reference Implementation: Five Pre-S&OP Reviews

This project is the benchmark for advanced motion built from a flattened GPT Image 2 still:

- seven complete source-authored modules were isolated with shaped alpha masks;
- the headline and brand lockup remained stable on a deterministic clean stage;
- five review stations assembled in operating order instead of receiving pulses;
- each hand-off travelled along a registered SVG route;
- the executive decision surface appeared only after all five review inputs existed;
- the readiness rule resolved last;
- lossless frames 0, 300, 330, and 360 were pixel-identical to the canonical still;
- the encoded GIF received a separate contact-sheet inspection.

Reference files:

- `videos/five-pre-sop-reviews-motion/build_motion_assets.py`
- `videos/five-pre-sop-reviews-motion/compositions/main.html`
- `videos/five-pre-sop-reviews-motion/motion-brief.md`
- `videos/five-pre-sop-reviews-motion/shot-plan.json`
- `data/2026-W32/five-pre-sop-reviews/motion-qa.md`

Reuse the layer and QA logic, not the five-station choreography.
