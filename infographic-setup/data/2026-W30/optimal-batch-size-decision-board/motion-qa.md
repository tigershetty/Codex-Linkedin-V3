# Motion QA - Batch Size Decision Board

**Week:** `2026-W30`  
**Slug:** `optimal-batch-size-decision-board`  
**Source:** `visual.png`  
**Selected GIF:** `visual-motion.gif`  
**Selected MP4:** `visual-motion.mp4`  
**Iteration retained:** `visual-motion-delayed-reveal-v2.gif` / `.mp4`  
**Composition:** `videos/optimal-batch-size-motion/compositions/delayed-reveal.html`  
**Date:** `2026-07-13`

## 1. Motion Contract

**Why motion earns its place:**  
The reader needs to see the EOQ decision board assemble in its operating order:
formula, cost logic, batch options, trade-offs, then planner verification.

**Visual archetype:** decision board + formula model  
**Major beats:** formula -> complete cost chart -> three batch models -> four
trade-off rows -> five verification checks -> complete reading hold

## 2. Source-Fidelity Gate

- [x] `visual.png` was approved before the selected motion build
- [x] Complete visual is the opening frame
- [x] Complete visual is the closing frame
- [x] Body text and both logos remain locked
- [x] No raw rectangular source crop moves above the visual
- [x] Motion preserves the formula, chart, and decision meaning

**Frame 0 pixel difference:** `0` - FFmpeg PSNR `inf` for every channel  
**Final frame pixel difference:** `0` - FFmpeg PSNR `inf` for every channel

## 3. Reset And Transition QA

- [x] Fully cleared frame inspected at source resolution
- [x] Formula fragments removed by hardened semantic cover
- [x] Batch-object shadows removed by fitted whole-card plates
- [x] Cost chart converted from separate curve erasure to one compound reveal
- [x] Trade-off scales and verification checks remain aligned
- [x] Highlights and SVG signals remain registered to source elements
- [x] No text, logo, or panel-frame overlap

**Reset frame inspected:** frame `18`, approximately `0.60s`, at `1003x1568`  
**Representative frames inspected:** 0, 18, 42, 72, 105, 144, 186, 240  
**Key correction:** the chart's curves, labels, shadows, and trough could not be
cleanly erased as independent pixels, so the complete chart became one semantic
component while its individual curves retained short emphasis passes.

## 4. Reading And Feed QA

| Dimension | Score 1-5 | Notes |
|---|---:|---|
| Noticeability | 5 | Delayed loading is clear at feed speed |
| Reading order | 5 | Follows the board's decision logic |
| Source fidelity | 5 | Motion is registered to the approved still |
| Layout fit | 5 | Choreography is specific to this board |
| Restraint | 5 | Text, logos, title, hero scene, and frames remain fixed |
| Technical finish | 5 | Clean reset and exact endpoint restoration |
| Pause readability | 5 | Sampled frames remain coherent |

**Average:** `5.0`  
**Status:** pass

## 5. Media Specs

| Output | Dimensions | FPS | Duration | Frames | Size |
|---|---:|---:|---:|---:|---:|
| GIF | 720x1126 | 20 | 8.05s | 161 | 1,147,519 bytes |
| MP4 | 1002x1568 | 30 | 8.03s | 241 | 391,798 bytes |

- [x] GIF encoded with `palettegen` and `paletteuse`
- [x] GIF text remains readable after palette conversion
- [x] MP4 retained at full practical resolution
- [x] Complete final hold exceeds 1.2 seconds
- [x] Representative-frame contact sheet inspected

## 6. Reusable Learning

Repeat the semantic-component method, deterministic renderer, and QA gates.
Redesign the component map and choreography for every visual. A flattened image
must be segmented according to how its objects, shadows, labels, and panels are
actually fused, not according to a generic animation template.

