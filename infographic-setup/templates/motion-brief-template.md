# Motion Brief - {Post Title}

**Post folder:** `data/{week}/{slug}/`  
**Source visual:** active path resolved from `data/{week}/{slug}/post-card.md`
**Motion project:** `videos/{slug}-motion/`  
**Status:** draft / QA / selected

## 1. Motion Job

**Motion helps this post because:**  
The reader needs to see `{sequence/change}` in the order `{reading logic}`.

**Picture-first promise:**  
The complete still remains understandable and is the first and final frame.

**Motion archetype:**  
decision board / process / matrix / table / formula / comparison / hierarchy /
network / annotated hero / calendar / operating system

## 2. Reading Order

1. `{first visual decision}`
2. `{second visual decision}`
3. `{third visual decision}`
4. `{resolution or action}`

## 3. Locked Elements

These never move, disappear, or get redrawn:

- `{headline and subheading}`
- `{body labels or exact formula text}`
- `{Shetty's Desk logo}`
- `{tool/platform logo}`
- `{hero graphic or background scene}`
- `{panel frames and structural geometry}`

## 4. Semantic Component Map

| ID | Communication job | Source region | Isolation method | Reveal behavior | Risk |
|---|---|---|---|---|---|
| `unit-01` | `{what it teaches}` | `[x1,y1,x2,y2]` | semantic mask / fitted plate / whole component / highlight only | wipe / fade / trace / pulse | `{ghosts, shared shadow, text proximity}` |
| `unit-02` | `{what it teaches}` | `[x1,y1,x2,y2]` | `{method}` | `{behavior}` | `{risk}` |
| `unit-03` | `{what it teaches}` | `[x1,y1,x2,y2]` | `{method}` | `{behavior}` | `{risk}` |

**Compound-component decisions:**  
List any elements that must reveal as one unit because they share shadows,
occlusion, reflections, or labels.

**Elements intentionally not isolated:**  
List items where clean background reconstruction is not credible.

## 5. Signal Plan

**Signal path or decision marker:** `{none or describe}`  
**Purpose:** `{what it explains}`  
**Allowed marks:** source-derived highlight / SVG dot / ring / trace / check pulse  
**Clear-space rule:** `{where signals may travel without covering content}`

## 6. Timeline

| Time | Beat | Visible change | Reader takeaway |
|---|---|---|---|
| `0.00-0.30` | complete still | no motion | understand the artifact |
| `0.30-0.65` | reset or focus transition | selected units clear only when reconstruction is credible; otherwise source-locked highlights establish focus | prepare the reading path |
| `{time}` | beat 1 | `{component action}` | `{meaning}` |
| `{time}` | beat 2 | `{component action}` | `{meaning}` |
| `{time}` | beat 3 | `{component action}` | `{meaning}` |
| `{time}` | final hold | complete still, no accents | read and save |

**Target duration:** `{6-9 seconds}`  
**Final complete hold:** `{at least 1.2 seconds}`

## 7. Asset Plan

- [ ] Copy the approved active visual into the motion project as `assets/visual.png`
- [ ] Build semantic masks only for cleanly isolatable color/content
- [ ] Build fitted covers only where reset-frame reconstruction is clean
- [ ] Keep integrated scenes/charts as whole components
- [ ] Build transparent source-colored highlights
- [ ] Use registered highlight-only motion when a clean cover is impossible
- [ ] Use exact transparent assets for any logo/icon motion
- [ ] Record all coordinates in `shot-plan.json`

## 8. QA Risks

- `{most likely ghosting area}`
- `{text or logo proximity}`
- `{shared shadow or reflection}`
- `{GIF palette risk}`
- `{loop seam risk}`

## 9. Output Contract

- `data/{week}/{slug}/visual-motion.gif`
- `data/{week}/{slug}/visual-motion.mp4`
- `data/{week}/{slug}/motion-qa.md`

The first and final lossless frames must be pixel-identical to the active visual resolved from
`post-card.md`.
Run `node scripts/audit-motion-package.mjs data/{week}/{slug}` after export.
