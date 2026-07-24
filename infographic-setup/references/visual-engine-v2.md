# Visual Engine v2 — GPT Image 2 First, HTML Control Lane

**Version:** 2.2
**Date:** 2026-07-19
**Status:** Active production workflow for new 101 and AI for Supply Chain visuals
**North star:** reference-fidelity first, lean inputs, world-class infographic output.
**Holy Grail benchmark:** `data/2026-W28/supply-chain-resilience-os/visual.png` via `references/holy-grail-visual-standard.md`.

This file supersedes the old assumption that the code-render path is always primary. The new system uses **ChatGPT / GPT Image 2 as the primary creative renderer** because the best recent results came from open, reference-led prompts. The HTML renderer stays active as the **backup, comparison, and precision lane** so every post can be checked against a deterministic layout when exact text, numbers, or structure matter.

## 1. Operating Thesis

The old workflow tried to "train" the visual system mostly through prose. That produced competent cards, but too often the output looked like a polished dashboard instead of a distinctive editorial infographic.

Visual Engine v2 changes the job of each layer:

| Layer | Job |
|---|---|
| Reference set | Carries style, taste, composition ambition, and visual fidelity |
| Cobalt Grid brand frame | Carries the brand atoms and restraint rules |
| Prompt | Carries the argument, structure, exact content, and mobile readability constraints |
| GPT Image 2 | Produces the primary visual direction |
| HTML renderer | Produces a deterministic control image for comparison, backup, and exact-data cases |
| QA scorecard | Decides whether the result is publishable, not just "nice" |

The core principle: **references do the style work; the prompt does the thinking work.**

### 1.1 Holy Grail Flagship Lane

For flagship posts, the default ambition is now:

> supply-chain operating intelligence rendered as a premium one-page artifact in a credible 3D/isometric supply-chain scene.

Read `references/holy-grail-visual-standard.md` before prompting. The `supply-chain-resilience-os` image proved the working formula:

| Layer | What must be designed before render |
|---|---|
| Operating artifact | OS, playbook, field manual, decision map, diagnostic, scorecard, review pack, or one-page book |
| Meeting moment | The real workflow where the reader would use it |
| Content backbone | SCOR, APQC, TTS/TTR, Kraljic, S&OP, inventory math, forecast decomposition, QBR logic, contract clauses, or role-specific AI workflow |
| Module map | 5-9 useful modules with distinct visual metaphors, not repeated cards |
| Supply-chain scene | Desk/control-room/port/warehouse/factory/planning-table context that supports the artifact |
| Logo plan | Exact Shetty's Desk placement and any removable tool/logo zones, with reserved built-in plates/chips for deterministic overlays |

Do not use this lane for every lightweight post. Use it when the post should be a brand-defining saved artifact.

## 2. Default Render Lanes

| Lane | Status | Use when | Output |
|---|---|---|---|
| GPT Image 2 | **Primary** | Default for new infographic concepts, especially when the visual needs editorial judgment, metaphor, unusual composition, or reference fidelity | 1024 x 1536 model candidate composed for a centered 4:5 safe area |
| GPT Image 2 Holy Grail artifact | **Flagship primary** | Save-worthy posts where the image should become an operating tool: OS, field manual, playbook, diagnostic, decision map, or one-page book | Premium 3D/isometric artifact scene + surgical cleanup |
| HTML / code-render | **Backup + control** | Exact numbers, dense tables, text-heavy comparisons, charts that must be pixel-perfect, or when GPT output misses the structure | HTML template + PNG in `renderer/` |
| Motion / GIF / MP4 | **Standard Draft Sprint lane when earned** | After the selected exact 4:5 draft exists and sequence, dependency, comparison, state change, or decision logic improves the argument | Layout-adaptive motion artifact via `motion-engine-v1.md` |

For each flagship post, keep both lanes when practical:

1. One GPT Image 2 prompt and generation record.
2. One HTML control render or wireframe render.
3. A short comparison note explaining which image is final and why.

### 2.1 Native Render And Canonical Promotion

GPT Image 2 and LinkedIn have different canvas jobs. Never let the model-native file become the canonical post by accident.

For new portrait posts:

1. generate at `1024x1536`;
2. keep every meaningful object, title, label, formula, logo zone, and footer inside the centered `1024x1280` content-safe area;
3. reserve the top and bottom 128 pixels for expendable atmosphere only;
4. center-crop the safe composition to 4:5 and resize once to 1080 x 1350;
5. promote the same exact bytes to `visual.png` and `visual-linkedin.png`;
6. keep the native generation under a descriptive candidate filename.

The visual audit rejects a canonical `visual.png` that is not exactly 1080 x 1350. The old branded fit/side-rail treatment is only for legacy recovery where no prompt-safe source exists.

## 3. Brand Seed — Cobalt Grid Adapted For LinkedIn

The active brand seed is:

`references/brand-kits/cobalt-grid/FRAME.md`

Cobalt Grid is not a prison. It is the starting brand grammar:

| Atom | Active rule |
|---|---|
| Color | warm cream paper + electric cobalt as the base system |
| Grid | visible graph-paper / measured-plane sensibility |
| Type | editorial serif dominance, restrained sans labels, mono chrome when useful |
| Shape | square, flat, no soft dashboard cards |
| Depth | structural depth only; no glossy z-axis look |
| Density | sparse declarative frames or dense ledgers, not generic four-card dashboards |
| Signature | pixel-stack, ledger, hairline, QR/glitch, mono indexing can be borrowed as recurring marks |

The Cobalt Grid source is two-color, but LinkedIn posts may occasionally need one semantic accent when the claim demands it. The accent must be rare, functional, and tied to meaning. If the image starts to look like a multi-color SaaS dashboard, it failed the brand frame.

## 4. Reference-Fidelity Method

Use the 100 reference images as a production grammar, not a mood board.

Before selecting references, read `references/top100-reference-intelligence.md`. The reference set now carries both image intelligence and caption intelligence: the visual format, stop-scroll promise, save trigger, and audience value artifact. Do not use references only for style.

For every post, select **3 to 5 references**:

| Reference type | Purpose |
|---|---|
| Structure reference | The layout family that makes the argument |
| Caption promise reference | The opening tension, value promise, and save trigger to adapt |
| Craft reference | Typography, spacing, label economy, editorial confidence |
| Brand reference | Cobalt Grid or Shetty's Desk anchor |
| Optional tension reference | A contrasting composition that prevents sameness |

Before prompting, write the post's visual move in one sentence:

> "This image should make the reader feel/see that [claim] by using [visual structure]."

If that sentence is vague, the prompt is not ready.

Also write the stop-scroll sentence:

> "At feed size, the reader should instantly see [shape/claim] and think [why this is worth saving]."

For Holy Grail candidates, also write the artifact contract:

```md
Holy Grail fit:
Operating artifact:
Meeting moment:
Supply-chain scene:
Content backbone:
Module map:
Logo plan:
```

## 5. Best Single Prompt Workflow

The default is **one strong prompt**, not a menu of tiny variants.

Creative Engine v3 adds the required preflight. Before rendering, create `creative-brief-lite.md` from `templates/creative-brief-lite-template.md`, compile the prompt with `node scripts/compile-gpt-image-prompt.mjs data/{week}/{slug}`, and check the compiled prompt against `references/creative-engine-v3-lean.md`.

### Step 1 — Claim Decomposition

Write the message in one line. Then list the hidden visual claims:

| Claim type | Example visual families |
|---|---|
| Hidden mass | iceberg, cutaway, submerged system |
| Mismatch | slope, offset markers, split ranking |
| Weak link | chain, pillars, keystone, fault line |
| Process | flow, relay, conveyor, decision tree |
| Concentration | Pareto, waffle, treemap, stacked share |
| Before/after | diptych, threshold, conversion frame |

Pick the one claim the visual should lead with.

### Step 2 — Framework Lock

Choose the one structure that makes the claim. Do this before adding style words.

Bad: "make it premium, cinematic, more dramatic."
Good: "show six contract clauses as one architectural structure where Scope is the load-bearing cracked column."

### Step 3 — Prompt Skeleton

Use this skeleton for GPT Image 2:

```md
Task: Create a world-class editorial infographic for LinkedIn.

Use the attached references for visual intelligence: composition, hierarchy, restraint, spacing, and craft.
Follow the brand frame: warm cream paper, electric cobalt ink, visible grid discipline, editorial serif headline, restrained labels, flat structural depth.
Create a fresh layout; do not copy the subject matter or exact composition of any reference.

REFERENCE INTELLIGENCE:
- Structure reference: [file] — adapt [format/eye path], not the subject.
- Caption promise reference: [file] — adapt [audience promise/save trigger].
- Craft reference: [file or brand frame] — adapt [density/hierarchy/restraint].

CREATIVE USP:
[why this beats a generic LinkedIn infographic]

STOP-SCROLL TEST:
At feed size, the reader should instantly see [shape/claim] and think [why this is worth saving].

TOPIC:
[one line]

THE QUESTION THIS ANSWERS:
[reader's actual question, in plain language]

VISUAL STRUCTURE:
[one dominant visual system; name the focal element and how the eye should move]

CONTENT TO INCLUDE ON THE IMAGE:
- Heading: "[max 8 words]"
- Subheading: "[short, useful]"
- Labels: [exact labels]
- Data/facts: [only sourced facts from the research brief]

CONTENT RULES:
- Mobile-readable at LinkedIn feed size
- Labels over paragraphs
- One dominant visual idea
- Every number must match the research brief
- Keep on-image text lean

BRAND FEEL:
Editorial, measured, sharp, reference-led, not a generic SaaS dashboard.
```

For Holy Grail candidates, add the block from `holy-grail-visual-standard.md`:

```md
HOLY GRAIL CALIBER:
Use `supply-chain-resilience-os/visual.png` as the quality bar: a premium one-page operating artifact staged in a clean 3D/isometric supply-chain desk scene. Do not copy that topic or layout exactly. Match the level of clarity, depth, usefulness, dimensional polish, and brand authorship.

ARTIFACT-FIRST DIRECTION:
The artifact is the hero. The surrounding 3D scene supports the topic and adds credibility, but it must not steal attention from the operating tool.

POST-PRODUCTION PLAN:
Leave a clean logo zone for the exact Shetty's Desk logo. Avoid source text or tool chips unless explicitly requested. If a tool/logo is used, it must be small and removable without damaging the composition.

LOGO FINISHING:
Ask GPT Image 2 for blank built-in logo zones, not approximate logos. Use the exact repo assets after generation. Tool logos belong in small chip/icon slots. Shetty's Desk belongs on a designed plate or placard with safe padding. If a generated chip includes an approximate tool mark, rebuild or clean the chip before inserting the official asset. Inspect tight crops of every logo zone before promoting the result to `visual.png`; no duplicated overlays, ghosted marks, or "exact enough" logo approvals.

FORMULA FINISHING:
When the formula is the hero, do not ask for or approve calculator syntax such as `SQRT(2DS/H)`. Ask for proper mathematical notation: a visible radical over the full expression and a stacked fraction for division where space allows. Inspect a tight crop before promotion; reject ghosted old text, slash-only shorthand when a fraction is expected, or cramped math that does not survive feed size.
```

For GPT Image 2, avoid long negative prompt blocks. Phrase constraints positively.

### Step 4 — HTML Control

After the GPT prompt is written, create a small HTML control only if it helps answer one of these:

- Does the structure actually fit the content?
- Are the numbers readable and truthful?
- Would a deterministic version outperform the generated image?
- Is the generated image drifting away from the brand frame?

The HTML control does not need to be beautiful every time. It needs to be honest.

### Step 5 - Motion Draft Lane

Motion is produced after the exact 4:5 still is selected for the Draft Sprint. Read
`references/motion-engine-v1.md`, then answer:

> Motion helps this post because the reader needs to see [sequence/change] in
> the order [reading logic].

If that sentence is weak, record a draft still-only rationale. Otherwise build the GIF and MP4 before the integrated improvement pass; approval still happens at the final package checkpoint.

When motion is earned:

- create a post-specific motion brief from `templates/motion-brief-template.md`,
- map semantic components from the actual layout,
- keep the complete still as the locked base,
- use source-fitted covers, source-derived highlights, and restrained SVG signals,
- never move raw rectangular crops, body text, or approximate logos,
- export both GIF and full-resolution MP4,
- require pixel-identical opening and closing lossless frames.
- run `node scripts/audit-motion-package.mjs data/{week}/{slug}` before promotion.

The EOQ decision board is the implementation benchmark, not a choreography
template: `videos/optimal-batch-size-motion/`.

## 6. Artifact Contract

Each visual post folder should aim for:

| File | Purpose |
|---|---|
| `research-brief.md` | sourced facts, definitions, examples |
| `101-copy.md` or `ai-for-sc-[slug].md` | caption, hooks, post copy |
| `gpt-image-2-prompt.md` | final prompt, references used, generation notes |
| `gpt-image-2-prompt-compiled.md` | prompt compiled from the creative brief and reference card; preferred draft for GPT Image 2 |
| `creative-brief-lite.md` | one-page audience value, reference fit, visual argument, and creative USP |
| `holy-grail-fit.md` or Holy Grail fields in `creative-brief-lite.md` | flagship-only artifact contract: operating artifact, meeting moment, supply-chain scene, content backbone, module map, text lock, and logo plan |
| `visual-output-review.md` | post-render scoring against stop-scroll, save utility, reference adaptation, originality, readability, and integrity |
| `html-control.md` or renderer template link | backup/control lane notes |
| `visual-comparison.md` | side-by-side judgment and final pick |
| `visual.png` | selected exact 1080 x 1350 canonical visual |
| `visual-linkedin.png` | byte-identical 1080 x 1350 posting asset |
| `visual-motion.gif` | standard picture-first motion companion built during the Draft Sprint when earned |
| `visual-motion.mp4` | standard full-resolution motion master built during the Draft Sprint when earned |
| `motion-qa.md` | motion QA: reset/focus frames, endpoint pixel checks, media specs, and promotion decision |
| `resource-plan.md` | resource eligibility and package contract for every post |
| `publish-manifest.json` | explicit caption/still approval and website handoff status |

Do not let generated experiments become the source of truth. The source of truth is the prompt, references, comparison note, and exact 1080 x 1350 `visual.png`. Native model renders remain candidates.

Read `references/publish-asset-spec-v1.md` before promotion. For new work, create the prompt-safe 4:5 artwork first and place the same pixels in `visual.png` and `visual-linkedin.png`. The visual audit must pass before the manifest can record still approval.

## 7. Visual QA Scorecard

Score every candidate from 1 to 5:

| Dimension | What 5 means |
|---|---|
| Reference fidelity | It feels like it belongs in the top reference set, not adjacent stock art |
| Brand ownership | Cobalt Grid / Shetty's Desk DNA is obvious without a logo doing all the work |
| Argument clarity | The structure teaches the idea in under 2 seconds |
| Editorial craft | Type, spacing, hierarchy, and restraint feel designed, not decorated |
| Mobile legibility | The key claim and labels survive feed-size viewing |
| Data integrity | No invented numbers, labels, claims, or misleading chart shapes |
| Distinctiveness | It is not another generic four-card dashboard |

For AI-for-SC flagship posts, add a caption/visual consistency check before publish:

- the visual shows an operating artifact the tool can help build,
- the caption names the reader's input pack,
- the caption names the output artifact,
- the caption explains the meeting/workflow value,
- explicit AI-risk warnings are not forced into the published copy when they weaken the hook or value promise.

Publish bar:

- **Minimum:** 4 average, no dimension below 3.
- **World-class target:** 4.5 average, with 5s in argument clarity and editorial craft.
- If distinctiveness is 2 or lower, change the framework before changing adjectives.

## 8. Removal / De-Emphasis Plan

Do not delete files without explicit approval. Instead:

| Legacy item | New handling |
|---|---|
| Old code-render-primary language | Mark as superseded by Visual Engine v2 |
| Gemini handoff prompts | Deep Dive archive / emergency legacy only |
| Nano Banana-first lane | Historical experiment; GPT Image 2 is now the primary creative renderer |
| Tracked `renderer/out` duplicates | Keep for now, but move toward canonical post-folder artifacts and generated-output ignore policy |
| Stale trackers | Reconcile against `master-calendar.md` and actual `data/` folders before using |

## 9. Practical First Principles

1. Start from the argument, not the decoration.
2. Use the fewest inputs that preserve taste: 3 to 5 references, one brand frame, one strong prompt.
3. Make one structure dominate.
4. Let the grid, type, and restraint create brand memory.
5. Keep HTML rendering alive as a control, not as the default creative bottleneck.
6. Improve by changing the framework first, then the prompt, then the renderer.
7. For motion, repeat the production system but redesign the choreography around each visual's layout.
