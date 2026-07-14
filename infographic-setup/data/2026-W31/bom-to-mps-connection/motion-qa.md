# Motion QA - From MPS To Materials

**Week:** `2026-W31`  
**Slug:** `bom-to-mps-connection`  
**Source:** `data/2026-W31/bom-to-mps-connection/visual.png`  
**GIF:** `data/2026-W31/bom-to-mps-connection/visual-motion.gif`  
**MP4:** `data/2026-W31/bom-to-mps-connection/visual-motion.mp4`  
**Composition:** `videos/bom-to-mps-connection-motion/compositions/main.html`  
**Date:** `2026-07-13`

## 1. Motion Contract

**Why motion earns its place:**  
The reader can now watch one finished-good commitment propagate into gross component quantities, a net bearing requirement, backward timing, and planned-supply recommendations in the same order the planning logic works.

**Visual archetype:**  
`process + annotated hero + calculation`

**Major beats:**  
complete still -> MPS trigger -> four BOM branches -> `50 / 50 / 100 / 200` component requirements -> `100 - 20 - 30 = 50` bearing netting -> right-to-left time phasing -> make/buy/reschedule -> BOM/MPS/MRP distinction -> complete still

## 2. Source-Fidelity Gate

- [x] `visual.png` was approved before motion production began
- [x] Complete visual is the opening frame
- [x] Complete visual is the closing frame
- [x] Body text and exact calculations remain locked
- [x] Exact Shetty's Desk logo remains locked
- [x] No raw rectangular crop moves above the source
- [x] No component, count, schedule label, or planning meaning changes

**Frame 0 pixel difference:** `0`  
**Final frame pixel difference:** `0`

Endpoint proof was measured against retained lossless QA frames at 10 fps. Both frames had zero changed pixels and a maximum RGB delta of zero against the approved `visual.png`.

## 3. Transition QA

- [x] Registered highlights align with their source elements
- [x] BOM traces follow the authored component branches
- [x] Component trays resolve in the correct `50 / 50 / 100 / 200` order
- [x] Netting resolves as `100 gross - 20 on hand - 30 scheduled receipt = 50 net`
- [x] Time-phasing signals travel right to left
- [x] Make, buy, and reschedule remain recommendations rather than deterministic orders
- [x] Signals do not cover the logo or alter body copy
- [x] No ghost text, duplicated shadows, object remnants, jumps, or visible loop seam

**Representative frames inspected:** `f_0000.png`, `f_0007.png`, `f_0015.png`, `f_0022.png`, `f_0032.png`, `f_0040.png`, `f_0047.png`, `f_0052.png`, `f_0059.png`, `f_0068.png`, `f_0090.png`  
**Corrections made before final export:** supply-action masks were tightened so `MAKE`, `BUY`, and `RESCHEDULE` pulse independently without repeatedly illuminating the `PLANNED SUPPLY` title.

## 4. Reading And Feed QA

| Dimension | Score 1-5 | Notes |
|---|---:|---|
| Noticeability | 5 | Bright branch signals, calculation progression, and backward timing are visible at GIF feed size. |
| Reading order | 5 | The animation follows the exact MPS-to-materials causal sequence. |
| Source fidelity | 5 | The approved still remains intact and every emphasis is transient and source-registered. |
| Layout fit | 5 | Routes follow this visual's BOM branches, equation, timing arrows, and action plate. |
| Restraint | 5 | Headline, body copy, numbers, components, and logo never move. |
| Technical finish | 5 | No patches, overlaps, palette breakage, or endpoint mismatch. |
| Pause readability | 5 | Every inspected frame remains a coherent, readable infographic. |

**Average:** `5.0/5`  
**Source fidelity score:** `5/5`  
**Pass bar:** passed - average 4.3+, source fidelity 5, no hard fail

## 5. Media Specs

| Output | Dimensions | FPS | Duration | Frames | Size |
|---|---:|---:|---:|---:|---:|
| GIF | 720 x 1517 | 18 | 9.06s | 163 | 2,504,117 bytes |
| MP4 | 864 x 1820 | 30 | 9.03s | 271 | 703,607 bytes |

- [x] GIF uses palette generation and palette use
- [x] GIF text and color states remain readable after palette conversion
- [x] MP4 is full practical source resolution
- [x] Final complete hold is at least 1.5 seconds
- [x] Representative encoded-GIF contact sheet inspected

## 6. Decision

**Status:** pass  
**Canonical outputs promoted:** yes  
**Remaining concern:** none at the motion gate  
**Reusable learning for the next post:** follow the visual's real causal structure. Use source-registered highlights for authored elements, SVG signals only on existing information routes, a zero-difference endpoint test, and one dominant motion beat per decision layer.
