# Creative Engine v3 — Lean Reference-Led Production

**Date:** 2026-07-19
**Status:** Active QA layer on top of Visual Engine v2  
**Purpose:** make every GPT Image 2 output earn attention, save value, and Shetty's Desk originality before it is treated as publishable.
**Flagship benchmark:** `holy-grail-visual-standard.md` and `data/2026-W28/supply-chain-resilience-os/visual.png`.

## 1. The Job

Visual Engine v2 made GPT Image 2 the primary renderer. Creative Engine v3 makes sure the renderer is fed the right creative problem.

The engine has one question:

> What will make the right supply-chain reader stop, understand the point fast, and save the image because it helps with a real task, meeting, or career moment?

If the answer is not clear before prompting, the visual will drift into generic infographic territory.

For flagship posts, add a second question:

> What operating artifact would a supply-chain leader save, print, and use before a real meeting?

If the answer is only "an infographic," the prompt is not Holy Grail-ready.

## 2. The Lean Flow

Use this flow for flagship 101 and AI-for-SC posts. Read `render-first-improve-second-v1.md`; the numbers below are production order, not approval gates.

### Pass A - Complete Draft Sprint

1. **Audience job:** pick one job from `audience-intelligence.md`.
2. **Reference fit:** use `top100-reference-intelligence.md`, `top100-caption-index.md`, `top100-visual-inventory.md`, `top100-contact-sheet.html`, `top100-visual-mechanics-index.md`, and, for RW03-RW12, `calendar-reference-adaptation-map-v1.md`. Run `node scripts/audit-calendar-reference-map.mjs` after editing the map.
3. **Topic seed:** run `node scripts/compile-topic-seed.mjs {topic-or-slug}` to get a compact audience/promise/format/mechanics starter plus shortlisted Top-100 image-caption references.
4. **Holy Grail fit:** for flagship posts, read `holy-grail-visual-standard.md` and define the operating artifact, meeting moment, supply-chain scene, content backbone, module map, text lock, and logo plan.
5. **Creative brief:** fill `templates/creative-brief-lite-template.md`.
6. **Build package:** run `node scripts/build-visual-package.mjs data/{week}/{slug}`. This compiles the GPT Image 2 prompt, syncs the canonical prompt, compiles the lean creative packet, runs the creative-director score, and runs the strict audit.
7. **Prompt preflight:** check `creative-packet.md` first; open the full prompt only if a render is about to happen.
8. **Render:** GPT Image 2 first at 1024 x 1536 with the centered 1024 x 1280 content-safe area; use HTML control when exact text/data needs a backup.
9. **4:5 draft promotion:** promote the selected candidate to exact 1080 x 1350 and place identical bytes in `visual.png` and `visual-linkedin.png`.
10. **Writing draft:** produce ten structurally different hooks and one caption draft.
11. **Motion draft:** apply `motion-engine-v1.md` once the selected exact 4:5 still exists. Build motion when it adds sequence, dependency, comparison, state change, or decision logic.
12. **Resource draft:** score every post with `resource-plan.md`; build a safe, useful package during the sprint when it qualifies.

### Pass B - Integrated Improvement

13. **Output review:** fill `templates/visual-output-review-template.md` and inspect all text, data, formulas, anchors, and brand zones.
14. **Logo/cleanup crop check:** inspect tight crops of every deterministic logo or cleanup zone before approval.
15. **Motion-value check:** reject highlight-only decoration; inspect source layers, representative lossless frames, endpoint pixel equality, and the encoded GIF.
16. **Writing check:** run Tiger voice QA and `skills/stay-human-shetty`; remove explained morals, tidy single-track structure, visual echo, template footprints, and cosmetic hook variety.
17. **Resource check:** validate the instruction PDF, Markdown guide, transparent individual downloads, safe first-run path, output contracts, manifest, checksums, and human decision boundary.
18. **Package audit:** rerun visual, motion, resource, and publish-handoff audits after corrections.

### Pass C - One Final Approval

19. Show the improved package together and record explicit approval only for the exact still, writing, motion, resource decision, and complete post package the user accepts.

## 3. Creative Brief Must Fit On One Page

The brief is deliberately small. It should carry only the logic GPT Image 2 needs:

- audience job,
- stop-scroll claim,
- save trigger,
- top-100 format,
- caption pattern from `top100-caption-index.md`,
- shortlisted visual references from `top100-visual-inventory.md` or `top100-contact-sheet.html`,
- visual mechanics from `top100-visual-mechanics-index.md` or the selected reference image,
- visual metaphor,
- Holy Grail fit for flagship posts,
- exact on-image text,
- text placement map,
- brand frame,
- data integrity rule.

For AI-for-SC posts, the brief must also define the value chain before copy is written:

- input pack the reader can gather,
- tool output artifact,
- meeting or workflow payoff,
- human/boundary logic to keep in the brief,
- whether the published caption should be value-first, boundary-explicit, or balanced.

Do not let the caveat become the caption. The strongest AI-for-SC posts explain what the tool can build for a real workflow, then make the operating judgment visible through the artifact and CTA.

If a brief needs many paragraphs to explain the idea, the idea is not visually sharp yet.

## 4. GPT Image 2 Prompt Preflight

Before rendering, the prompt must pass all 8 checks:

| Check | Pass condition |
|---|---|
| Audience value | The prompt says what the reader gets, not only what the image shows. |
| Stop-scroll shape | The feed-size visual object is named: ladder, map, funnel, anatomy, formula, decision tree, etc. |
| Save trigger | The image contains a reusable artifact: test, checklist, formula, map, prompt, template, or decision rule. |
| Holy Grail fit | For flagship posts, the prompt defines the operating artifact, meeting moment, 3D/isometric supply-chain scene, content backbone, module map, and logo plan. |
| Reference adaptation | The prompt names what to adapt from the top-100 references without copying subject matter. |
| Visual mechanics | The prompt names concrete image mechanics: row schema, legend, metric strip, dotted rails, worked example, utility strip, or equivalent. |
| Creative USP | The prompt states why this beats a generic LinkedIn infographic. |
| Text discipline | On-image text is exact, short, and ranked by importance. |
| Data integrity | Every number is sourced, hypothetical, or explicitly conceptual. |
| Semantic anchoring | Each label has one intended visual anchor; chart labels, arrows, icons, and root-cause markers cannot point to the wrong object or share the same ambiguous point. |
| Background realism | The environment is specified as an edited, believable artifact scene, not a generic AI showroom, sci-fi corridor, or glowing dashboard wall. |
| Prompt openness | The prompt gives a strong structure but leaves room for composition; avoid long negative blocks. |

GPT Image 2 prompts should separate **composition freedom** from **text discipline**. Let the renderer invent the strongest editorial object, but lock the exact text strings and their intended homes.

Failing any check means revise the brief before rendering.

The preferred package refresh command is:

```bash
node scripts/build-visual-package.mjs data/{week}/{slug}
```

This writes `gpt-image-2-prompt-compiled.md`, syncs `gpt-image-2-prompt.md`, writes `creative-packet.md`, writes `creative-director-score.md`, and runs the strict audit. Use `--check-only` when you only want to score/audit without regenerating compiled files.

The creative-director score can also be run directly:

```bash
node scripts/score-creative-director.mjs data/{week}/{slug}
```

It scores the brief, reference card, and GPT Image 2 prompt across audience payoff, stop-scroll tension, save utility, Top-100 adaptation, and renderer leverage. Minimum bar: 85/100 and no dimension below 16/20.

The preferred topic starter is:

```bash
node scripts/compile-topic-seed.mjs supplier-flexibility-matrix
```

This reads `calendar-reference-adaptation-map-v1.md`, `top100-visual-mechanics-index.md`, `top100-visual-inventory.md`, and `top100-caption-index.md`, then prints a compact seed with audience payoff, stop-scroll promise, power format, visual mechanics, reusable artifact, USP, and a shortlist of actual reference images/captions to inspect. Use it before filling `creative-brief-lite.md`.

Refresh the Top-100 visual routing layer with:

```bash
node scripts/build-top100-visual-inventory.mjs
```

This writes `references/top100-visual-inventory.md` and `references/top100-contact-sheet.html` from the local Top-100 images plus the caption index. Use the contact sheet to pick references visually without loading the full corpus into the prompt context.

The lower-level prompt compiler is:

```bash
node scripts/compile-gpt-image-prompt.mjs data/{week}/{slug}
```

Use it only for debugging or when intentionally comparing prompt variants.

The lower-level compact packet compiler is:

```bash
node scripts/compile-creative-packet.mjs data/{week}/{slug}
```

This writes `creative-packet.md`. It is the lean handoff: audience payoff, stop-scroll reason, Top-100 adaptation, exact text, render instruction, and QA gate. Do not reopen the whole calendar, workbook, or long planning docs unless the topic itself changes.

## 5. Prompt Shape

Use this order:

```md
TASK:
Create a world-class editorial LinkedIn infographic.

HOLY GRAIL CALIBER: [for flagship posts only]
[how this matches the benchmark quality of `supply-chain-resilience-os/visual.png` without copying the topic]

AUDIENCE VALUE:
[who this helps + what they can do after reading]

REFERENCE INTELLIGENCE:
- Structure: [reference family/file] -> adapt [format/eye path]
- Caption promise: [reference family/file] -> adapt [save trigger]
- Craft: [brand/reference] -> adapt [hierarchy/density/restraint]

CREATIVE USP:
[why this beats a generic infographic]

STOP-SCROLL TEST:
At feed size, the reader should see [shape/claim] and think [reason to save].

VISUAL STRUCTURE:
[one dominant visual metaphor]

OPERATING ARTIFACT:
[what the reader would save and use later; meeting/task where it is useful]

VALUE-DENSITY LAYER:
[the reusable operating detail the image must show: scoring marks, comparison cues, exception states, workflow evidence, verification marks, mini-legend logic, or artifact-specific micro-structure]

CREATIVE DIRECTION:
[premium editorial design intent]

IMAGE ENGINE INTENT:
[why GPT Image 2 should compose this as a visually forward artifact, not a rigid dashboard]

COMPOSITION FREEDOM:
[where the renderer has room: asymmetric grid, layered matrix, annotated object, ranked index, loop, formula card, metaphor]

MODULE MAP:
[for artifact-first posts, list the 5-9 modules and the distinct visual metaphor for each]

CONTENT:
[exact heading, subheading, labels, footer]

LOGO / ASSET INSERTS:
[backticked repo paths for the Shetty's Desk logo plus any named tool/platform logos; use actual assets as GPT Image 2 reference/insert inputs, not guessed logo approximations]

POST-PRODUCTION PLAN:
[what must be fixed after generation: exact logo placement, chip removal, source/footer cleanup, text repair, or HTML/SVG overlay; preserve the winning angle and 3D composition]

TEXT PLACEMENT MAP:
[which exact strings belong in the title, artifact, workflow, bottom, and footer zones; block duplicate labels]

TEXT LOCK:
[exact text only; no invented headers, labels, stats, or captions]

TEXT PLACEMENT RULE:
[each text string has one intended home; use visual marks instead of new words]

BRAND:
[brand atoms]

INTEGRITY:
[numbers/source/text rules]
```

Keep constraints positive. A short "Do not" line is acceptable for hard risks, but long negative prompt blocks usually make the output colder and more generic.

## 6. Output Review Gate

A rendered image is not publishable until it passes:

| Dimension | Minimum | World-class target |
|---|---:|---:|
| Stop-scroll clarity | 4 | 5 |
| Save utility | 4 | 5 |
| Reference adaptation | 4 | 5 |
| Shetty's Desk originality | 4 | 5 |
| Visual argument | 4 | 5 |
| Brand ownership | 4 | 5 |
| Mobile readability | 4 | 5 |
| Text/data integrity | 5 | 5 |
| Holy Grail fit, if flagship | 4 | 5 |

The audit now enforces this floor. A package can be complete enough to inspect but still fail the publish gate if scores, hard-fail boxes, HTML backup requirements, or text/data integrity are weak.

Hard fails:

- wrong or misspelled text,
- correct words attached to the wrong visual object,
- invented statistic,
- generic dashboard/card-grid feel,
- generic AI-showroom background,
- no reusable artifact,
- no clear audience job,
- visual style could belong to any creator.
- for flagship posts: no operating artifact, no premium 3D/isometric presence, or cleanup that destroys the winning composition.
- for formula-led posts: calculator syntax such as `SQRT(...)` where proper mathematical notation should be used.

Logo finishing checks:

- Shetty's Desk logo must be exact, not model-redrawn.
- Shetty's Desk logo must sit inside the generated plate/placard with visible padding, not graze the border or float like a sticker.
- Named tool logos must use exact assets and sit inside the intended chip/icon slot without a forced background box.
- Named tool logos must be single-instance exact assets: no duplicated overlays, ghosted model-drawn logo underneath, approximate icon geometry, or "exact enough" approval.
- If a generated chip already contains an approximate logo, rebuild or clean the chip before inserting the official asset.
- If the logo asset contains transparent canvas, trim to visible content before scaling.
- Promote only after tight crops confirm every logo zone looks authored into the scene and matches the source asset.

Formula finishing checks:

- If a formula is the hero, use mathematical notation, not calculator syntax.
- Square roots should show a radical bar over the full expression.
- Divisions inside a hero formula should use a stacked fraction where space allows, not slash-only shorthand.
- Promote only after a tight crop confirms the formula is readable, mathematically correct, and free of ghosted previous text.

AI-for-SC caption checks:

- The hook is publishable as the first line and names a real role/tool/workflow gap.
- The main caption is usually 250-330 words, unless the user explicitly wants a deeper essay.
- The caption names the input pack and the output artifact.
- The caption explains the meeting payoff.
- Explicit "When not to use AI" language is optional in the published caption; boundary logic must still exist in the brief.

## 7. When To Regenerate

Regenerate if:

- the visual is pretty but not useful,
- the structure does not teach the idea in two seconds,
- the save trigger is missing,
- the prompt relied on adjectives instead of a specific visual metaphor,
- the top-100 reference lesson is invisible.
- a Holy Grail candidate loses the artifact-first composition during cleanup.

Do not regenerate by adding more adjectives. Change the framework, reference lesson, or on-image artifact.

## 8. What "Best On LinkedIn" Means Here

The goal is not to out-polish everyone. The goal is to own a lane:

> supply-chain operating intelligence rendered as save-worthy editorial artifacts.

The post should feel like something a practitioner could use before a supplier review, S&OP meeting, inventory audit, negotiation, forecast review, or AI workflow test.
