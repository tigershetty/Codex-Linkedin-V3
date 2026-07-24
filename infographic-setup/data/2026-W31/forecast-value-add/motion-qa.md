# Motion QA - Did The Override Add Value?

**Week:** `2026-W31`  
**Slug:** `forecast-value-add`  
**Source:** `data/2026-W31/forecast-value-add/visual-linkedin.png` (`1080 x 1350`)  
**GIF:** `data/2026-W31/forecast-value-add/visual-motion.gif`  
**MP4:** `data/2026-W31/forecast-value-add/visual-motion.mp4`  
**Composition:** `videos/forecast-value-add-motion/compositions/main.html`  
**Date:** `2026-07-17`

## 1. Motion Contract

**Why motion earns its place:**  
The reader sees the three evidence traces establish the comparison, the two WAPE values resolve into FVA, and the result become an override decision before the evidence rows and input pack close the review.

**Visual archetype:**  
formula + comparison + decision rule + evidence table

**Major beats:**  
evidence traces -> FVA calculation -> decision rule -> override ledger -> input pack -> complete still

## 2. Source-Fidelity Gate

- [x] `visual-linkedin.png` was approved before motion production began
- [x] Complete visual is the opening frame
- [x] Complete visual is the closing frame
- [x] Body text remains locked
- [x] Exact logos remain locked
- [x] No raw rectangular crop moves above the source
- [x] Motion does not change formula, chart, or data meaning

**Frame 0 pixel difference:** `0`  
**Final frame pixel difference:** `0`

Frame `210` at `7.0s` and frame `270` at `9.0s` are also pixel-identical to the source.

## 3. Reset And Transition QA

- [x] Strongest focus-transition frames inspected at source resolution
- [x] No ghost text, formula fragments, duplicated shadows, object remnants, or destructive reconstruction
- [x] Covers were rejected; registered source highlights preserve the complete still
- [x] The chart remains a locked compound component
- [x] Highlights remain registered to the exact source pixels
- [x] Focus rings do not cover text or logos
- [x] No incoherent overlap during any transition

**Reset/focus frames inspected:** frames `30`, `90`, `147`, `168`, `189`, `210`, and `270`  
**Tight regions inspected:** corrected chart callouts and traces; FVA formula/result; decision rail; all ledger rows; input pack; both logos  
**Corrections made:** separated navy and azure masks by hue, tightened exact-value masks, removed header/screw leakage from ledger masks, generated source-mask halos, and added registered row-boundary rings.

## 4. Reading And Feed QA

| Dimension | Score 1-5 | Notes |
|---|---:|---|
| Noticeability | 4.6 | Trace sweeps and row rings are visible in-feed without obscuring the artifact. |
| Reading order | 4.9 | The sequence follows evidence, calculation, action, examples, and inputs. |
| Source fidelity | 5.0 | Base art never moves; all highlight geometry comes from approved pixels. |
| Layout fit | 4.9 | Choreography is specific to this chart, comparator, rail, and ledger. |
| Restraint | 5.0 | Text, formulas, logos, panels, and props stay locked. |
| Technical finish | 5.0 | No ghosting, jumps, overlaps, or loop seam. |
| Pause readability | 5.0 | Every representative lossless and GIF frame remains coherent. |

**Average:** `4.91`  
**Source fidelity score:** `5.0`  
**Pass bar:** average 4.3+, source fidelity 5, no hard fail

## 5. Media Specs

| Output | Dimensions | FPS | Duration | Frames | Size |
|---|---:|---:|---:|---:|---:|
| GIF | `720 x 900` | `18` | `9.06s` | `163` | `945,253 bytes` |
| MP4 | `1080 x 1350` | `30` | `9.03s` | `271` | `411,286 bytes` |

- [x] GIF uses palette generation and palette use
- [x] GIF text remains readable after palette conversion
- [x] MP4 is full practical resolution
- [x] Final complete hold is `2.0s`
- [x] Representative lossless and encoded-GIF contact sheets inspected

## 6. Decision

**Status:** pass  
**Canonical outputs promoted:** yes; the prior tall master export was replaced by the LinkedIn-native 4:5 package  
**Remaining concern:** user approval remains pending; hooks and caption are intentionally deferred.  
**Reusable learning for the next post:** exact color-mask halos make trace motion noticeable without redrawing the chart; row-boundary rings are a clean fallback when source-only text luminance is too subtle.
