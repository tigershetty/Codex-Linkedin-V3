# Motion QA - MPS As A Production Commitment

**Week:** `2026-W31`  
**Slug:** `mps-as-a-production-commitment`  
**Source:** `data/2026-W31/mps-as-a-production-commitment/visual.png`  
**GIF:** `data/2026-W31/mps-as-a-production-commitment/visual-motion.gif`  
**MP4:** `data/2026-W31/mps-as-a-production-commitment/visual-motion.mp4`  
**Composition:** `videos/mps-as-a-production-commitment-motion/compositions/main.html`  
**Date:** `2026-07-13`

## 1. Motion Contract

**Why motion earns its place:**  
The reader needs to see demand inputs converge on the MPS, the commitment fence activate, and capacity, materials, and production-order consequences respond in production-review order.

**Visual archetype:**  
`process + annotated hero`

**Major beats:**  
complete still -> three input signals -> schedule-status emphasis -> fence/lock confirmation -> three horizon states -> three execution rails -> freeze/firming distinction -> complete still

## 2. Source-Fidelity Gate

- [x] `visual.png` was approved before motion production began
- [x] Complete visual is the opening frame
- [x] Complete visual is the closing frame
- [x] Body text remains locked
- [x] Exact logo remains locked
- [x] No raw rectangular crop moves above the source
- [x] Motion does not change schedule, horizon, or control meaning

**Frame 0 pixel difference:** `0`  
**Final frame pixel difference:** `0`

Endpoint proof was measured against retained lossless QA frames at 10 fps. Both `ImageChops.difference(...).getbbox()` results were `None`, with RGB extrema of zero.

## 3. Reset And Transition QA

- [x] The strongest focus-transition frames were inspected at source resolution
- [x] No ghost text, duplicated shadows, object remnants, or destructive reconstruction
- [x] Destructive status/horizon/model covers were rejected after reset-frame QA
- [x] Integrated board, printed grid, fence, pedestals, and models stay source-locked
- [x] Highlights remain registered to their source elements
- [x] Signal dots and traces do not cover text or logos
- [x] No incoherent overlap during any transition

**Reset/focus frame inspected:** `f_0005.png` at `0.5s`; this build uses no destructive reset  
**Tight crops inspected:** input connectors, commitment fence and lock, all three output rails, freeze/firming cards, bottom logo placard  
**Corrections made:** removed fitted model plates, rejected local inpaint covers that damaged the runway grid, and promoted source-locked highlight/signal choreography

## 4. Reading And Feed QA

| Dimension | Score 1-5 | Notes |
|---|---:|---|
| Noticeability | 5 | Bright route signals and the fence sweep are clear without overwhelming the still. |
| Reading order | 5 | Inputs, commitment boundary, execution consequences, and control distinction land sequentially. |
| Source fidelity | 5 | The approved visual remains intact; motion layers are registered and transient. |
| Layout fit | 5 | Every path and emphasis follows this visual's actual pipes, fence, zones, and cards. |
| Restraint | 5 | Headline, body text, schedule values, models, and logo never move. |
| Technical finish | 5 | No patches, ghosts, jumps, overlaps, or visible loop seam. |
| Pause readability | 5 | Every representative frame remains a coherent version of the complete infographic. |

**Average:** `5.0/5`  
**Source fidelity score:** `5/5`  
**Pass bar:** passed - average 4.3+, source fidelity 5, no hard fail

## 5. Media Specs

| Output | Dimensions | FPS | Duration | Frames | Size |
|---|---:|---:|---:|---:|---:|
| GIF | 720 x 1518 | 18 | 8.45s | 152 | 1,745,807 bytes |
| MP4 | 864 x 1820 | 30 | 8.43s | 253 | 573,472 bytes |

- [x] GIF uses palette generation and palette use
- [x] GIF text remains readable after palette conversion
- [x] MP4 is full practical resolution
- [x] Final complete hold is 2.1 seconds
- [x] Representative-frame contact sheet inspected

## 6. Decision

**Status:** pass  
**Canonical outputs promoted:** yes  
**Remaining concern:** none at the motion gate  
**Reusable learning for the next post:** attempt delayed clearing only when source-resolution reset QA is clean. When a flattened visual contains printed grids, perspective, and compound shadows, preserve it and sequence registered source highlights plus signals along existing paths.
