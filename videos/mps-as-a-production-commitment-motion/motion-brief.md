# Motion Brief - MPS As A Production Commitment

**Post folder:** `data/2026-W31/mps-as-a-production-commitment/`  
**Source visual:** `data/2026-W31/mps-as-a-production-commitment/visual.png`  
**Motion project:** `videos/mps-as-a-production-commitment-motion/`  
**Status:** production

## 1. Motion Job

**Motion helps this post because:**  
The reader needs to see demand inputs become a controlled MPS commitment and then flow into capacity, materials, and production orders in the same order a production review follows.

**Picture-first promise:**  
The complete still remains understandable and is the first and final frame.

**Motion archetype:**  
process + annotated hero

## 2. Reading Order

1. Demand plan, customer orders, and inventory position converge on the MPS board.
2. The three schedule statuses resolve as item, quantity, and period cross into commitment.
3. The commitment fence separates protected, controlled-change, and flexible time.
4. Capacity, material requirements, and production orders load as downstream consequences.
5. Freeze and firming land as two different controls before the full still rests.

## 3. Locked Elements

These never move, disappear, or get redrawn:

- headline and subheading
- all item, quantity, period, and explanatory text
- Shetty's Desk logo and bottom placard
- table grid, board frame, commitment fence, rails, and background scene
- all exact numbers and schedule periods

Original status and zone labels remain visible in the locked base. Their exact source pixels receive delayed, registered highlight wipes; nothing is redrawn or erased.

## 4. Semantic Component Map

| ID | Communication job | Source region | Isolation method | Reveal behavior | Risk |
|---|---|---|---|---|---|
| `input-demand` | establish demand input | `[44,346,170,455]` | semantic blue mask | source-color pulse + route signal | text proximity |
| `input-orders` | establish customer-order input | `[175,323,310,447]` | semantic blue mask | source-color pulse + route signal | text proximity |
| `input-inventory` | establish inventory input | `[300,304,415,427]` | semantic blue mask | source-color pulse + route signal | text proximity |
| `status-firm-1` | load first committed row | `[505,492,601,548]` | semantic green source highlight | wipe + pulse | table grid remains locked |
| `status-firm-2` | load second committed row | `[515,526,613,588]` | semantic green source highlight | wipe + pulse | table grid remains locked |
| `status-planned` | separate planned from firm | `[528,566,644,635]` | semantic blue source highlight | wipe + pulse | table grid remains locked |
| `zone-protected` | identify protected horizon | `[218,798,399,968]` | semantic green source highlight | vertical wipe + pulse | perspective boundary remains locked |
| `zone-controlled` | identify controlled change | `[420,755,602,943]` | semantic orange source highlight | vertical wipe + pulse | perspective boundary remains locked |
| `zone-flexible` | identify flexible horizon | `[611,735,778,917]` | semantic blue source highlight | vertical wipe + pulse | perspective boundary remains locked |
| `model-capacity` | show capacity consequence | `[49,1081,286,1306]` | registered source highlight only | route arrival + pulse | integrated shadows prevent clean erasure |
| `model-materials` | show material consequence | `[336,1110,551,1310]` | registered source highlight only | route arrival + pulse | rack shadows prevent clean erasure |
| `model-orders` | show production-order consequence | `[592,1087,817,1308]` | registered source highlight only | route arrival + pulse | clipboard shadows prevent clean erasure |
| `freeze-control` | distinguish freeze | `[56,1426,390,1525]` | semantic green mask | source-color pulse | body text must stay static |
| `firming-control` | distinguish firming | `[447,1426,806,1525]` | semantic orange mask | source-color pulse | body text must stay static |

**Compound-component decisions:**  
The schedule grid, horizon panels, and downstream models stay locked because their printed textures, objects, platforms, and cast shadows cannot be erased credibly. Delayed source highlights replace destructive component clearing.

**Elements intentionally not isolated:**  
The title, input cards, complete MPS board, fence structure, rails, lower explanatory bands, and logo remain locked. Signals follow their existing paths without covering labels.

## 5. Signal Plan

**Signal path or decision marker:** three input dots converge on the board; one fence sweep confirms the boundary; three output dots travel down the existing execution rails  
**Purpose:** make the demand-to-commitment-to-execution sequence obvious without adding a second interface  
**Allowed marks:** source-derived highlight, SVG dot, ring, and restrained trace  
**Clear-space rule:** dots stay on existing pipes or the fence rail and disappear before the final hold

## 6. Timeline

| Time | Beat | Visible change | Reader takeaway |
|---|---|---|---|
| `0.00-0.35` | complete still | no motion | understand the full artifact |
| `0.35-1.45` | inputs | three input cards pulse and signals converge on the MPS board | the schedule starts from real planning inputs |
| `1.42-2.32` | schedule rows | two firm statuses and one planned status resolve | status changes the commitment level |
| `2.28-3.48` | fence and horizons | fence signal, lock pulse, then protected/controlled/flexible reveal | near-term change needs different control |
| `3.45-5.18` | execution consequences | three rail signals arrive as capacity, materials, and production-order models load | an MPS change moves execution work |
| `5.12-6.18` | control distinction | freeze and firming pulse separately; takeaway receives a restrained sweep | protection and conversion are different controls |
| `6.30-8.40` | final hold | complete still, no accents | read and save |

**Target duration:** `8.4 seconds`  
**Final complete hold:** `2.1 seconds`

## 7. Asset Plan

- [x] Copy approved `visual.png` into the motion project
- [x] Build semantic masks only for cleanly isolatable source colors
- [x] Reject destructive covers where printed grids, shadows, or compound geometry cannot be reconstructed cleanly
- [x] Keep the integrated board and background locked
- [x] Build transparent source-colored highlights
- [x] Keep the logo stationary and untouched
- [x] Record all coordinates in `shot-plan.json`

## 8. QA Risks

- status and horizon highlights must remain registered to their source pixels
- all board geometry and downstream models must remain source-locked
- fence and rail signals must not cross labels
- green/orange GIF palette must remain distinct
- first and final frames must match the source exactly

## 9. Output Contract

- `data/2026-W31/mps-as-a-production-commitment/visual-motion.gif`
- `data/2026-W31/mps-as-a-production-commitment/visual-motion.mp4`
- `data/2026-W31/mps-as-a-production-commitment/motion-qa.md`

The first and final lossless frames must be pixel-identical to `visual.png`.
