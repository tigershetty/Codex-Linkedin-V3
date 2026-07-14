# Motion Brief - From MPS To Materials

**Post folder:** `data/2026-W31/bom-to-mps-connection/`  
**Source visual:** `data/2026-W31/bom-to-mps-connection/visual.png`  
**Motion project:** `videos/bom-to-mps-connection-motion/`  
**Status:** production

## 1. Motion Job

**Motion helps this post because:**  
The visual describes a causal planning sequence. Motion should make one finished-good commitment visibly propagate into component quantities, net requirements, backward timing, and planned supply.

**Picture-first promise:**  
The approved still is always present, remains readable, and appears pixel-identically at the first and final frame.

**Motion archetype:**  
process + annotated hero + calculation

## 2. Reading Order

1. The MPS commitment sends one signal into the BOM explosion.
2. Four BOM branches resolve into housing, motor, bearings, and fasteners.
3. The four gross component requirements pulse in sequence: `50`, `50`, `100`, `200`.
4. Bearings become the worked netting line: `100 - 20 - 30 = 50`.
5. The timing signal moves backward from finished-good due to component need to planned release.
6. Make, buy, and reschedule resolve as planned-supply recommendations.
7. BOM, MPS, and MRP receive a final distinction pass before the complete still rests.

## 3. Locked Elements

- headline, subheading, and every authored text label
- all quantities, arithmetic, component counts, and arrows in the base artwork
- pump, motor, bearings, fasteners, props, surfaces, shadows, and perspective
- Shetty's Desk logo and bottom placard
- all plates, frames, borders, and explanatory bands

No body text, number, icon, component, or logo is translated, redrawn, or replaced. Motion uses registered source highlights and signals that follow the existing information architecture.

## 4. Semantic Component Map

| ID | Communication job | Source region | Isolation method | Reveal behavior |
|---|---|---|---|---|
| `mps-ticket` | establish finished-good commitment | `[281,151,569,348]` | blue source highlight | pulse + downward signal |
| `bom-label` | trigger component explosion | `[300,368,550,421]` | blue source highlight | pulse + branch traces |
| `tray-housing` | show housing gross requirement | `[10,722,216,994]` | object source highlight | registered pulse |
| `tray-motor` | show motor gross requirement | `[238,722,450,994]` | object source highlight | registered pulse |
| `tray-bearings` | show bearing gross requirement | `[454,722,637,994]` | object source highlight | registered pulse |
| `tray-fasteners` | show fastener gross requirement | `[652,722,836,994]` | object source highlight | registered pulse |
| `net-gross` | begin bearing netting | `[35,1028,219,1192]` | object source highlight | calculation pulse |
| `net-on-hand` | subtract inventory | `[236,1035,397,1189]` | green source highlight | calculation pulse |
| `net-receipt` | subtract scheduled receipt | `[437,1035,601,1189]` | green source highlight | calculation pulse |
| `net-result` | land net requirement | `[640,1035,813,1191]` | red source highlight | stronger result pulse |
| `supply-*` | resolve three planned-supply actions | lower action plate | blue source highlights | sequential pulse |
| `dist-*` | distinguish BOM, MPS, and MRP | lower definition strip | blue source highlights | final reading pass |

## 5. Signal Plan

- one cobalt signal travels from the MPS ticket to the BOM label
- four cobalt branch traces follow the existing BOM routes
- one short bearing signal links the gross requirement to MRP netting
- a calculation cursor travels left to right across the netting equation
- two cobalt timing signals travel right to left, matching backward scheduling

Signals stay clear of labels and disappear before the final hold.

## 6. Timeline

| Time | Beat | Visible change | Reader takeaway |
|---|---|---|---|
| `0.00-0.30` | complete still | no motion | see the complete artifact |
| `0.30-1.25` | MPS trigger | MPS ticket and BOM label pulse; signal drops into the explosion | the MPS starts the material calculation |
| `1.10-2.55` | BOM explosion | four branch traces arrive; component trays pulse `50 / 50 / 100 / 200` | per-unit usage becomes gross requirements |
| `2.45-4.25` | MRP netting | bearings link to the equation; `100 - 20 - 30 = 50` resolves | available supply reduces the planned requirement |
| `4.20-5.55` | backward timing | signals move from finished-good due to component need to planned release | requirements are time-phased backward |
| `5.45-6.55` | planned supply | make, buy, and reschedule pulse in order | MRP proposes supply actions |
| `6.45-7.35` | distinction | BOM, MPS, and MRP pulse in sequence | each planning object has a different job |
| `7.45-9.00` | final hold | complete still, no accents | read, save, and cleanly loop |

**Target duration:** `9.0 seconds`  
**Final complete hold:** `1.55 seconds`

## 7. QA Risks

- branch traces must follow the authored connection logic and never imply a different component count
- netting order must remain `100 gross - 20 on hand - 30 scheduled receipt = 50 net`
- timeline motion must travel right to left
- all registered highlights must align with the exact source pixels
- the logo must remain motionless and untouched
- first and final lossless frames must match `visual.png`

## 8. Output Contract

- `data/2026-W31/bom-to-mps-connection/visual-motion.gif`
- `data/2026-W31/bom-to-mps-connection/visual-motion.mp4`
- `data/2026-W31/bom-to-mps-connection/motion-qa.md`

The first and final lossless frames must be pixel-identical to `visual.png`.
