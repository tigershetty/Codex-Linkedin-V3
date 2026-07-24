# Motion QA - The Five Pre-S&OP Reviews

**Week:** `2026-W32`  
**Slug:** `five-pre-sop-reviews`  
**Source:** `data/2026-W32/five-pre-sop-reviews/visual.png`  
**GIF:** `data/2026-W32/five-pre-sop-reviews/visual-motion.gif`  
**MP4:** `data/2026-W32/five-pre-sop-reviews/visual-motion.mp4`  
**Composition:** `videos/five-pre-sop-reviews-motion/compositions/main.html`  
**Date:** `2026-07-19`

## 1. Motion Contract

**Why motion earns its place:**  
The still shows the finished pre-S&OP architecture. The motion demonstrates how the architecture works: each review arrives as a complete source-authored module, names its operating hand-off, sends one decision packet toward the center, and enables the executive decision surface only after all five inputs exist.

**Visual archetype:**  
`layered 3D process assembly + hand-off routing + decision resolution`

**Major beats:**  
complete still -> clean architecture stage -> five reviews assemble -> hand-offs travel -> Executive S&OP resolves -> four decisions lock -> readiness test builds -> complete still

## 2. Source-Fidelity Gate

- [x] `visual.png` and `visual-linkedin.png` are identical 1080 x 1350 files
- [x] Complete visual is the opening frame
- [x] Complete visual is restored at frame `f_0300.png`
- [x] Complete visual remains restored through frame `f_0360.png`
- [x] Seven moving modules are alpha-isolated from the approved source
- [x] Headline, review copy, executive actions, readiness equation, and logo remain source-locked
- [x] No raw rectangular crop is animated above the source
- [x] No text is regenerated or retyped inside the moving review modules

**Frame 0 pixel difference:** `0`  
**Restored frame 300 pixel difference:** `0`  
**Final frame pixel difference:** `0`

Endpoint proof was measured against retained lossless 1080 x 1350 frames at 30 fps. Direct RGB comparison reports zero changed pixels at frames `f_0000.png`, `f_0300.png`, `f_0330.png`, and `f_0360.png`.

## 3. Motion-Value Gate

- [x] Review stations rise and settle as complete 3D objects, rather than receiving highlight overlays
- [x] Temporary labels name the useful output of each review
- [x] SVG routes draw in the source geometry and packets travel toward Executive S&OP
- [x] The executive table appears only after the five review inputs exist
- [x] Four action pips resolve the exact decision sequence already printed on the table
- [x] The readiness strip assembles last and locks `EVIDENCE + OWNER + OPTIONS + ASK`
- [x] The final system sheen is subordinate to the content and clears before the reading hold

The motion adds sequence, dependency, and hand-off meaning that the still cannot communicate in one glance. It does not add decorative movement to already complete content.

## 4. Transition QA

- [x] Reviews `01` through `05` assemble in operating order
- [x] Every hand-off route terminates at the executive decision surface
- [x] The central table remains visually distinct from integrated reconciliation
- [x] Hand-off labels clear before the next dense reading state
- [x] Route effects do not cover the executive action text
- [x] The readiness equation receives one distinct final emphasis
- [x] The Shetty's Desk logo remains unobstructed
- [x] No duplicate module, ghost text, visible crop edge, jump, or loop seam remains

**Representative lossless frames inspected:** `f_0000.png`, `f_0015.png`, `f_0030.png`, `f_0048.png`, `f_0072.png`, `f_0099.png`, `f_0126.png`, `f_0147.png`, `f_0174.png`, `f_0201.png`, `f_0234.png`, `f_0270.png`, `f_0300.png`, `f_0330.png`, `f_0360.png`  
**Corrections made before final export:** the clean-stage header was shortened so it no longer retained the top of the Portfolio module; the footer feather now begins below the readiness strip; all seven source components use shaped alpha isolation; the closing transition restores the untouched canonical still.

## 5. Reading And Feed QA

| Dimension | Score 1-5 | Notes |
|---|---:|---|
| Noticeability | 5 | The poster visibly disassembles into a clean stage and rebuilds as an operating system. |
| Reading order | 5 | Data, portfolio, demand, supply, reconciliation, executive action, and readiness form one clear sequence. |
| Source fidelity | 5 | Exact source modules carry the approved typography, text, materials, and logo. |
| Value added | 5 | Motion explains hand-offs and dependency, not just visual emphasis. |
| Layout fit | 5 | Choreography is registered to this visual's five-station geometry. |
| Restraint | 5 | Added labels are brief; decorative effects disappear before the final reading hold. |
| Technical finish | 5 | No overlap error, palette breakage, source patch, or endpoint mismatch was found. |
| Pause readability | 5 | Every inspected beat remains a coherent standalone infographic frame. |

**Average:** `5.0/5`  
**Source fidelity score:** `5/5`  
**Motion-value score:** `5/5`  
**Pass bar:** passed - average 4.3+, source fidelity 5, motion value 4+, no hard fail

## 6. Media Specs

| Output | Dimensions | FPS | Duration | Frames | Size |
|---|---:|---:|---:|---:|---:|
| GIF | 720 x 900 | 18 | 12.06s | 217 | 9,164,980 bytes |
| MP4 | 1080 x 1350 | 30 | 12.03s | 361 | 1,247,371 bytes |

- [x] GIF uses `palettegen` and `paletteuse`
- [x] Encoded-GIF contact sheet was inspected independently from lossless frames
- [x] GIF text, logo, and color states remain readable after palette conversion
- [x] GIF stays below LinkedIn's 100 MB ceiling and 500-frame limit
- [x] MP4 retains the full 1080 x 1350 LinkedIn master resolution
- [x] Final complete-still hold lasts more than two seconds
- [x] Lossless and encoded contact sheets are retained in the motion project QA folder

## 7. Decision

**Status:** pass  
**Canonical outputs promoted:** yes  
**Remaining concern:** none at the motion gate  
**Reusable learning for the next post:** isolate complete authored objects, animate the operating relationship between them, add only labels that reveal the hand-off, and restore the exact still for reading. A motion treatment does not pass merely because pixels move; it must communicate sequence, dependency, comparison, state change, or decision logic that the still cannot show alone.
