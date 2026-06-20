# Top-100 Visual DNA — Reproduction Spec & Workflow Plan
**Created**: 2026-06-14
**Status**: Active working plan — pick up here next session
**Source corpus**: `infographic-setup/references/top 100/` (100 LinkedIn infographics curated by Tiger as highest-engagement references) + `Reference File and Caption.xlsx`
**Method**: 95/96 images analyzed via 9 parallel vision agents against a fixed schema (only `11.gif` unrendered — 5.5MB; covered by its twin `15.gif`). Dimensions measured from file headers.
**Purpose**: Get the visual structure of these images down to a science so Shetty's Desk can REPRODUCE them with our own SC + AI spin.

---

## 0. Reproduction-critical facts (measured, not guessed)

- **Canvas format: 4:5 portrait dominates.** 64/97 are exactly 4:5 (1080×1350); 85/97 are portrait; only 9 square, 3 landscape. The densest reference tables go taller still (file 22 = 1280×2060, r=0.62).
- **ACTION**: change the renderer + Gemini target from the current `2048×2048` (1:1) in `renderer/brand-params.json` to **4:5 portrait — 1080×1350 baseline, 1440×1800 for @2x retina**, with an "extra-tall" 1080×1600–2060 variant for dense tables. The 1:1 square spec is wrong for this genre.
- One landscape outlier (file 32, OTIF dashboard, 1625×968) confirmed by the agent as "crops awkwardly in feed" — landscape is an anti-pattern here.

---

## 1. Corpus composition (validates the moat)

- **~45% on-brand** (SC / procurement / inventory / Lean), **~20% AI-tool** (heavily overlapping SC), **~22% LinkedIn-growth**, **~10% business-strategy**, **~4% writing**.
- The **SC × AI intersection is the largest and highest-quality cluster.** A defined house style already exists in this exact lane: coral-on-cream + the Claude spark mark, run by the "Supply Chain AI Pro" account (Asmaa Gad): files **22, 29, 34, 38, 49, 67, 70, 71, 84, 97**. Several are already ~80% in our brand palette.
- Implication: the format is proven and the lane is real, so **the moat is Tiger's practitioner data + voice, not the layout** (the layout is already being copied by others).

**Winning layouts ranked by frequency:** Cheat-sheet grid (~20) › Mixed dashboard (~12) › Comparison/versus (~10) › Numbered listicle (~10) › **Maturity ladder (~7, disproportionately high-engagement + on-brand)** › Framework diagram (~7) › Dense table (~4) › Radial hub (~4) › Decision tree (rare, flagship). **Absent from the winners: radar/spider charts** (they exist in our 50-format library but no high performer uses them).

---

## 2. The 10 Laws (the grammar every winner obeys)

1. **3-zone vertical skeleton** — Title (2 lines, one word color-popped, + a credibility stat/subtitle) / Body / Footer (avatar + handle + one CTA). Body never touches the edges.
2. **A repeated per-cell schema is the #1 "designed-not-generated" tell** — every card obeys ONE fixed micro-template: anchor (number/icon) → bold short label → one-line gloss → optional mini-visual → optional tag. Recurring tags: *Use For / Best For / Try This / Key Use / Limitation / Pro Tip / Common Mistake / Why It Works.*
3. **One eye-first hero** — a giant title, OR a giant number ("65", "92%", "$250B"), OR a structural shape. Quantity-in-title is itself a hook.
4. **Color does ONE job, chosen deliberately** — semantic (one hue per category/level, or red/green diagnostic) beats decorative banding.
5. **Saves = self-location + paste-ready utility** — "most people are stuck on Level 1 / which role are you?" (71, 87, 91, 100, 35) + literal formula boxes & copy-paste prompts (5, 25, 38, 47, 77, 99). The card becomes a tool, not a poster.
6. **Density is a feature for this audience — only if disciplined.** 250–600 words works when banded/railed with a repeated schema; un-scaffolded density collapses (65, 56, 89). Dense = save-to-zoom, so the caption hook carries the in-feed job.
7. **Credibility wired into the visual** — real logos, screenshots, product mockups, or a big analyzed-sample stat. Proof before a word is read.
8. **Depth bands add authority cheaply** — a "How They Connect" flow (77), an "Apply it: weekly/monthly/quarterly" cadence (82), a synthesis footer (13), a "THE SHIFT" thesis (70). Turns a list into a system.
9. **Geometry beyond the grid reads premium but is hard to AI-generate** — rings, pyramids, hub-spoke, funnels → render these in code (GSAP/HTML) for clean geometry + exact numbers.
10. **Flat-clean beats illustrated; proof-pass is non-negotiable** — AI-illustrated chrome (3D titles, skylines), typos (33 "ALIGNMEMT", 89 "susccess"), watermark spam (73/74/81), micro-type, and 16:9 crops all read "generated."

---

## 3. The 8 Power Formats (evidence-ranked, on-brand) + steal-files

| # | Format | Save-driver | Steal-files (rebuild first in **bold**) |
|---|---|---|---|
| PF1 | **Maturity Ladder / Levels** | self-location ("you're on Level 1") | **71** (Layers of Claude for Procurement), 91, 100, 29, 59 |
| PF2 | **Comparison / Versus** | disambiguation, naive-vs-correct | **33** (S&OP center-spine), 13, 47, 73, 35, 24 |
| PF3 | **KPI / Formula Card** | paste-ready formula + current value + target | **5** (inventory formulas), 25, 77, 82, 99, 59 |
| PF4 | **Cheat-Sheet Grid** | complete N-item reference, category-colored | **70** (22 Claude features), 94, 22, 17, 84, 10 |
| PF5 | **Radial Hub / Feature Map** | central spark → feature cards w/ "BEST FOR:" | **97** (Claude Code for SC), 67, 2.gif, 84 |
| PF6 | **Decision Tree** | "which tool/model for which task" | **54** (Claude model decision tree) |
| PF7 | **Ranked Role/Item Cards** | big % per card, automate-vs-stays-human | **87** (AI Exposure Index), 43 |
| PF8 | **Anatomy / Labeled Diagram** | labeled tree left, definitions right | **80** (Claude Code structure), 95, 65, 69 |

Supporting (use when concept demands): **Process Flow / Pipeline** (3, 39, 69, 83.gif), **Concept Metaphor** (44 broken stack, 64 roles-as-birds — series engine), **Funnel** (68).

---

## 4. Subject → Format selector (format MUST follow the concept)

Per Tiger's directive: the format is chosen by what the post is trying to explain.

| If the post's concept is… | Use format |
|---|---|
| "There are N levels / most are stuck at L1 / maturity / evolution over time" | PF1 Maturity Ladder |
| "X vs Y (vs Z) / before vs after / naive vs correct / myth vs reality" | PF2 Comparison |
| "How to calculate / the formula / the KPI / the metric" | PF3 KPI/Formula Card |
| "N things / every X / complete list / glossary / use-case library" | PF4 Cheat-Sheet Grid |
| "How to use [tool] for [function] / capabilities / feature map" | PF5 Radial Hub |
| "Which [tool/method] should I use / when to use what" | PF6 Decision Tree |
| "Ranked / scored / AI-exposure / who wins" | PF7 Ranked Cards |
| "Anatomy of / what's inside / structure of / the components" | PF8 Anatomy |
| "The process / the steps / how it flows end-to-end" | Process Flow |
| "One argument / one big POV / a sticky reframe" | Concept Metaphor (sparingly) |

This table becomes the visual-spec step in `/autopilot` (replaces "pick from 50 formats" with a concept-driven selector that resolves to one of these 8 + 3 supporting).

---

## 5. Shetty's Desk adaptation decisions (locked from this session)

- **Color (per Tiger):** base = **coral (#C15F3C) + cream (#F4F3EE) + charcoal/ink (#191919) + two semantic tones** (one caution, one good) used ONLY for diagnostic do/don't & good/bad rows. For tool-specific posts rendered in HTML/GSAP, use that **tool's identity palette** (Claude coral, ChatGPT green, Copilot gradient, Gemini blue, Perplexity teal — already in `brand-params.json`). Encode maturity/levels by **coral light→deep**, before/after by **muted-grey vs coral**.
- **No AI-illustration chrome** — flat-clean only. No 3D extruded titles, no decorative skylines/rockets, no watermark tiling.
- **Density discipline** — every cell obeys one repeated schema; cap ~5–6 rows per group; design for save-zoom but keep title + hero legible at feed size.
- **Self-location hook** baked into ladder + ranked formats ("most people never leave Level 1").
- **Paste-ready utility** — formula boxes + copy-paste prompt blocks are the top save-driver; include in KPI/prompt cards.
- **Ownable motif** — the Claude coral spark mark as center node on cream (PF5).
- **Series engines** — "Layers of [X]" (PF1) and "SC roles as [metaphor]" (file 64) are repeatable weekly series.

---

## 6. Reproduction workflow (how we actually recreate these)

**Two render paths, selected by whether data/structure is load-bearing:**

- **Path A — GSAP/HTML deterministic render** (primary). For PF1–PF8 (ladders, formula cards, comparisons, grids, tables, anatomy, decision trees, hubs): exact numbers + brand-locked layout + clean geometry. Canvas **1080×1350 (4:5)**, @2x = 1440×1800; extra-tall variant for dense tables. One parametric HTML template per power format, `{{TOKEN}}` slots, Puppeteer screenshot after `document.fonts.ready`.
- **Path B — Gemini / Nano-Banana Pro** (secondary). For illustration/metaphor posts (roles-as-birds, broken-stack) where exact data is NOT load-bearing. Use tool-identity palette + a style reference image. **Always number-verify** (diffusion models hallucinate data).

**Per-format build recipe (what each template/prompt must encode):** canvas 4:5 · 3-zone skeleton · the repeated per-cell schema (Law 2) · one hero (Law 3) · coral/semantic color logic (§5) · one depth band (Law 8) · footer identity bar. Then validate: **render → visual-QA against the 10 Laws + bug checklist → compare to the nearest steal-file → iterate (max 2).**

---

## 7. Gaps in this analysis + how to fill them (critical)

| # | Gap | Severity | Fix |
|---|---|---|---|
| G1 | **No engagement metrics per image.** "Highest engagement" is Tiger's assertion; the Excel has only filename + caption. Rankings are a design-quality proxy, not measured performance. | HIGH | Ask Tiger for impressions/saves per ref if available; else treat as a *taste/style* sample, not a performance sample, and validate against our own analytics-log.csv winners. |
| G2 | **No quantitative layout specs.** Vision gave "dense, coral accent," not grid/margin/type-scale numbers needed to rebuild. | HIGH | For the flagship steal-files, extract exact grid (cols/gutter/margin), type scale, card aspect ratios → encode into the GSAP templates. (Canvas dims now measured — §0.) |
| G3 | **No ground-truth by me.** All 95 delegated to sub-agents; inter-rater variance in word-counts/hex/density. | MED | Personally spot-check the 8 flagships (71, 97, 54, 87, 5, 33, 80, 70) before templating. |
| G4 | **Visual-rhetoric layer under-analyzed** (the creative/storytelling Tiger cares most about) — how the visual *makes the argument* (funnel narrows = conversion; cracked stack = broken logic; escalating flow = more rigor). | MED-HIGH | Add a "metaphor → meaning" catalog so format selection is argument-driven, not just layout-driven. |
| G5 | **Selection/survivorship bias** — curated from accounts Tiger follows (Hills, Partaker, Gad, Hassid); over-represents his taste. | MED | Fine as a *style target*; be explicit it is not "what wins on LinkedIn generally." |
| G6 | **GIF motion under-studied** — only static frames + "motion mostly decorative." | LOW | Decision: ship static (motion adds no info). Revisit only if we want feed autoplay attention. |
| G7 | **No caption↔visual coupling map** — hook line vs visual archetype analyzed separately. | MED | Map hook-type → visual-archetype pairings to drive the writer + visual-spec steps. |
| G8 | **Fonts not identified** — "serif title / sans body" only; brand fonts still PENDING in brand-params.json. | MED | Identify ref fonts + lock Shetty's brand fonts from the Canva kit. |
| G9 | **Icon system undefined** — winners use consistent line-icon sets; no style/source chosen. | MED | Define icon style (weight, fill, radius) + source (Recraft/Lucide) for GSAP templates. |
| G10 | **No anti-pattern corpus** — studied 100 winners, no matched low performers, so patterns are common-not-proven-causal. | MED | Use our analytics-log.csv bottom performers + formats absent from the top 100 as the contrast set. |
| G11 | **No pilot reconstruction** — zero recreated examples; the whole goal is unproven until we rebuild one. | HIGH | Pilot: rebuild file 71 (maturity ladder) and file 97 (radial hub) as coral-on-cream 4:5 templates; compare side-by-side. |
| G12 | `11.gif` unrendered (5.5MB). | TRIVIAL | Covered by twin 15.gif; optionally downscale + re-read. |

---

## 8. What to do in EXECUTION mode (next session pickup checklist)

1. **Fix the canvas spec** in `renderer/brand-params.json`: 2048² → 4:5 (1080×1350 / 1440×1800).
2. **Spot-check 8 flagships** (G3) and extract quantitative layout specs (G2).
3. **Pilot reconstruction** (G11): build GSAP/HTML templates for **PF1 (file 71)** and **PF5 (file 97)** in coral-on-cream 4:5; render with Puppeteer; compare to reference.
4. **Lock brand kit** (G8/G9): fonts + icon system from the Canva kit.
5. **Wire the Subject→Format selector (§4)** into the `/autopilot` visual-spec step; add the 10 Laws + bug checklist to the visual-QA agent.
6. **Add the metaphor→meaning catalog (G4)** for storytelling-led posts.
7. **Cross-reference our analytics-log.csv** (G1/G10) to confirm the patterns hold on Tiger's own data.

---

## 9. Reference index (by steal-tier)

★★ Flagship (rebuild first): **71** PF1 ladder · **97** PF5 hub · **87** PF7 ranked roles
★ Strong on-brand steal: 5,13,22,25,29,33,34,35,38,46,47,49,51,52,54,59,61,64,67,69,70,73,77,80,84,85,90,94,96,100, 20.gif
✓ Useful (SC dense / AI craft): 17,18,24,26,31,32,39,53,56,65,74,76,78,79,81,82,89,95,99, 2.gif,15.gif,83.gif
○ Craft-only (growth/off-topic — study layout not subject): 7,8,9,10,14,16,19',21,23,28,30,36,37,40,42,43,45,48,50,55,57,60,62,63,66,68,72,88,92,93, 27.gif,41.gif,58.gif
1,3,4 — AI/no-code/skills, mixed value. 11.gif — unrendered.

(Full per-image schema breakdowns live in the 9 agent reports from the 2026-06-14 session transcript.)
