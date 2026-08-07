# Motion Brief — Before You Escalate a Supply Risk

**Source package:** `data/2026-W32/supply-risk-motion-lab/`<br>
**Source visual:** `field-guide-motion-manifest.json`; Figma file `lAiBPFCz9FDuM74CN5chDd`, still/motion root `37:3`<br>
**Motion project:** `videos/supply-risk-motion-lab-motion/`<br>
**Status:** internal draft Motion Lab — not approved for publication

## 1. Motion Job

**Motion helps because:** the reader needs to see one illustrative risk signal pass through the four
ordered checks before it becomes a joint exception.

**Picture-first promise:** the complete still is useful by itself and is pixel-identical at the first
and final retained frames.

**Motion archetype:** four-gate decision flow.

## 2. Reading Order

1. Date reliability — a changed date is not a customer promise.
2. Customer exposure — test the need-by separately.
3. Recovery check — test options without converting them into a promise.
4. Joint exception — KAM and Purchasing Manager own the remaining credible gap.

## 3. Locked Elements

The composition never moves, hides, redraws, or re-typesets:

- headline, subheading, field note, next-meeting question, and footer;
- all gate questions, body labels, numbers, rules, and original arrow geometry;
- Shetty's Desk marks and source labels;
- the complete approved `assets/visual.png` still.

## 4. Semantic Component Map

| ID | Figma region | Communication job | Isolation method | Motion behavior | Risk control |
|---|---|---|---|---|---|
| `risk-signal` | `37:52` hidden signal | represent one illustrative signal, not a customer event | small registered SVG dot | travels only along named gate rules and existing arrow corridors | never crosses text or marks |
| `date-reliability` | `37:11` | show the first unanswered check | source-aligned rule highlight | 3px scan on existing orange rule | no panel/label motion |
| `customer-exposure` | `37:18` | show that need-by is a distinct question | source-aligned rule highlight + existing right-arrow corridor | trace then brief rule scan | no claim about a real miss |
| `recovery-check` | `37:25` | show recovery is tested before it is promised | source-aligned rule highlight + existing down-arrow corridor | trace then brief rule scan | no recovery outcome shown |
| `joint-exception` | `37:32` | show where remaining risk is jointly owned | source-aligned rule highlight + existing left-arrow corridor | trace then brief rule scan | no fabricated approval/result |

**Compound-component decision:** every gate remains part of the locked still. No cover, crop,
inpainting, or reconstructed background is used.

## 5. Signal Plan

**Signal path:** orange date rule → existing right-arrow corridor → coral customer-exposure rule →
existing down-arrow corridor → blue recovery rule → existing left-arrow corridor → green joint-
exception rule.

**Purpose:** give the four questions a decision-relevant order without altering their text or
suggesting that a particular supplier, customer, recovery option, or exception has occurred.

**Clear-space rule:** the dot travels on the existing coloured rules and the three source arrows;
no signal may enter a text block, logo, field note, or footer.

## 6. Timeline

| Time | Beat | Visible change | Reader takeaway |
|---|---|---|---|
| `0.00–0.70` | complete still | no accent | read the complete method first |
| `0.70–1.55` | date reliability | orange rule scan | validate the supplier signal |
| `1.55–3.10` | customer exposure | trace across existing arrow, then coral rule scan | need-by is a separate test |
| `3.10–4.55` | recovery check | trace down existing arrow, then blue rule scan | recovery is a check, not a promise |
| `4.55–5.30` | joint exception | trace left existing arrow, then green rule scan | remaining gap has joint ownership |
| `5.30–6.50` | final hold | all accents absent | return to the useful static reference |

**Target duration:** `6.5 seconds`<br>
**Final complete hold:** `1.2 seconds`

## 7. Asset Plan

- [x] Copy the approved local Figma export to `assets/visual.png`.
- [x] Use an inline SVG signal/highlight overlay only; no source-derived crop, cover, or image-model redraw is needed.
- [x] Register the overlay in `data/2026-W32/supply-risk-motion-lab/motion-overlay-geometry.json`, tying every segment to Figma gate nodes `37:11`, `37:18`, `37:25`, `37:32` and hidden signal `37:52`.
- [x] Generate `assets/overlay-geometry.generated.js` and `assets/asset-manifest.json` with `node build_motion_assets.mjs`; `compositions/main.html` reads only that generated geometry.
- [x] Record `qa/render-provenance.json` after the final render so source, geometry, composition, endpoints, GIF, and MP4 remain bound to the same run.
- [x] Keep all exact typography, arrows, marks, and panel geometry locked in the source still.

## 8. QA Risks

- the signal dot could cover body copy if its route leaves the existing rules/arrows;
- GIF palette conversion could muddy the four rule colours;
- any visible accent at frame `0` or frame `195` is a hard fail;
- a visually pleasing loop is not enough: the path must make the gate dependency easier to follow.

## 9. Output Contract

- `data/2026-W32/supply-risk-motion-lab/visual-motion.gif`
- `data/2026-W32/supply-risk-motion-lab/visual-motion.mp4`
- `data/2026-W32/supply-risk-motion-lab/motion-qa.md`
- `data/2026-W32/supply-risk-motion-lab/motion-overlay-geometry.json`
- `videos/supply-risk-motion-lab-motion/assets/asset-manifest.json`
- `videos/supply-risk-motion-lab-motion/qa/render-provenance.json`
- versioned proof endpoints `qa/opening-source-frame.png` and `qa/final-source-frame.png`

Run `node scripts/audit-motion-package.mjs --manifest data/2026-W32/supply-risk-motion-lab/field-guide-motion-manifest.json`
from `infographic-setup/` after export.
