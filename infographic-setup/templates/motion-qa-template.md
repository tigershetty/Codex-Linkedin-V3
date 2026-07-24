# Motion QA - {Post Title}

**Week:** `{YYYY-W##}`  
**Slug:** `{slug}`  
**Source:** `data/{week}/{slug}/visual.png`  
**GIF:** `data/{week}/{slug}/visual-motion.gif`  
**MP4:** `data/{week}/{slug}/visual-motion.mp4`  
**Composition:** `videos/{slug}-motion/compositions/main.html`  
**Date:** `{YYYY-MM-DD}`

## 1. Motion Contract

**Why motion earns its place:**  
`{sequence/change and reading logic}`

**Visual archetype:**  
`{decision board / process / matrix / table / formula / comparison / hierarchy / network / annotated hero / calendar / operating system}`

**Major beats:**  
`{4-6 beat summary}`

## 2. Source-Fidelity Gate

- [ ] `visual.png` is the selected exact 1080 x 1350 Draft Sprint source
- [ ] Complete visual is the opening frame
- [ ] Complete visual is the closing frame
- [ ] Body text remains locked
- [ ] Exact logos remain locked or use verified transparent assets
- [ ] No raw rectangular crop moves above the source
- [ ] Motion does not change formula, chart, or data meaning

**Frame 0 pixel difference:** `{must be 0}`  
**Final frame pixel difference:** `{must be 0}`

## 3. Motion-Value And Transition QA

- [ ] Motion demonstrates sequence, dependency, comparison, state change, or decision logic
- [ ] Multiple meaningful source-authored or deterministic value layers move
- [ ] Highlights and finishing effects are subordinate to the teaching mechanism
- [ ] Reset frame inspected at source resolution when covers are used; otherwise the strongest focus-transition frame was inspected
- [ ] No ghost text, formula fragments, duplicated shadows, object remnants, or destructive reconstruction
- [ ] Cover plates match the source lighting and panel boundaries, or were rejected in favor of registered source highlights
- [ ] Integrated charts/scenes reveal as compound components where required
- [ ] Highlights remain registered to their source elements
- [ ] Signal dots, rings, or traces never cover text or logos
- [ ] No incoherent overlap during any transition

**Reset/focus frame inspected:** `{frame number and timestamp}`  
**Tight crops inspected:** `{regions}`  
**Corrections made:** `{notes}`

## 4. Reading And Feed QA

| Dimension | Score 1-5 | Notes |
|---|---:|---|
| Noticeability |  |  |
| Reading order |  |  |
| Source fidelity |  |  |
| Value added |  |  |
| Layout fit |  |  |
| Restraint |  |  |
| Technical finish |  |  |
| Pause readability |  |  |

**Average:**  
**Source fidelity score:**  
**Motion-value score:**
**Pass bar:** average 4.3+, source fidelity 5, motion value 4+, no hard fail

## 5. Media Specs

| Output | Dimensions | FPS | Duration | Frames | Size |
|---|---:|---:|---:|---:|---:|
| GIF |  |  |  |  |  |
| MP4 |  |  |  |  |  |

- [ ] GIF uses palette generation and palette use
- [ ] GIF text remains readable after palette conversion
- [ ] MP4 is full practical resolution
- [ ] Final complete hold is at least 1.2 seconds
- [ ] Representative-frame contact sheet inspected

## 6. Decision

**Status:** pass / revise / reject  
**Canonical outputs promoted:** yes / no  
**Remaining concern:**  
**Reusable learning for the next post:**  

Run `node scripts/audit-motion-package.mjs data/{week}/{slug}` after completing this file.
