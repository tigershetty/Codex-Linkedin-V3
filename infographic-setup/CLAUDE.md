# Infographic Content Engine — Shetty's Desk

A research, audience-growth, and production engine for Tiger Shetty's "Shetty's Desk" brand.
LinkedIn, Substack, and the website share one V4 upstream system; Supply Chain 101 and AI for
Supply Chain remain downstream production lanes. (Deep Dive is archived — see below.)

## V4 Precedence

Read `references/v4-audience-growth-operating-system.md` first. It is authoritative for the
target audience, five-post LinkedIn cadence, manual commenting, Substack cadence, website
artifact role, public-evidence lanes, topic admission, and Tiger source gate. Older calendars,
plans, and pipeline instructions are candidate or production references when they conflict
with V4 upstream decisions.

## Session Start — Do This First
1. Read `references/v4-audience-growth-operating-system.md`.
2. Check `data/` for the current ISO week folder and active slug.
3. Report which stage the active slug is at and whether the task is topic selection, research, production, distribution, or measurement.
4. **Auto-check incomplete AI-for-SC posts**: note missing visual/motion QA, `resource-plan.md`, caption approval, or `publish-manifest.json`.
5. Read `references/audience-intelligence.md` + `references/topic-selection-scorecard.md` before accepting a topic. Load `references/top100-reference-intelligence.md` only when an accepted topic needs curated-success packaging hypotheses.
6. Confirm the public-evidence path, channel role, and `references/tiger-source-gate-v1.md` status before final copy.
7. Read `references/visual-engine-v2.md` before creating or revising any visual.
8. Read `references/creative-engine-v3-lean.md` before creating or judging a GPT Image 2 prompt.
9. Use `references/calendar-reference-adaptation-map-v1.md` only as optional packaging intelligence after the topic passes V4 qualification.
10. For AI-for-SC flagship visuals/captions, read `references/workflow-learning-2026-07-08-demand-review-to-sequence-board.md` before drafting; it captures the latest value-first caption and deterministic logo-overlay rules.
11. For GIF/MP4 work, read `references/motion-engine-v1.md` before creating masks, layers, or a timeline.
12. Before a resource or website handoff, read `references/publish-resource-handoff-v1.md` and `references/publish-asset-spec-v1.md`.
13. Choose Supply Chain 101 or AI for Supply Chain only after V4 has accepted the audience problem and content brief.

## Pick the Production Lane

V4 selects the topic and channel job first. The following lanes shape an accepted idea; they
do not decide what deserves publication and do not receive an automatic weekly quota.

```
  [1] Supply Chain 101       → /101 pipeline (foundational, educational)
  [2] AI for Supply Chain    → /ai-for-sc pipeline (qualified role-based AI use case, resource eligibility gate)
```

| | Supply Chain 101 | AI for Supply Chain |
|---|---|---|
| Audience | Experts AND non-practitioners | Any SC role — called out by the task (purchaser, planner, logistics coordinator, etc.) |
| Vocabulary | Plain language, technical terms explained | Action-oriented, tool-specific, no hype |
| Research | **research-engine first** — consultant-grade sourced brief per topic (plan gives the angle, brief gives verified facts) | **research-engine first** — parallel tool-layer + method-layer sourced brief per use case |
| Hooks | Metaphor-led, accessible | Role + current limitation + AI unlock |
| Caption | Length earned by clear practitioner value | Length earned by current execution detail and evidence |
| Control gates | Still + caption approval before website handoff | Still + caption approval, resource eligibility, then website preview |
| Visual | **Visual Engine v2** — GPT Image 2 primary; HTML/code-render backup + comparison lane; Motion Engine v1 standard GIF/MP4 companion after still approval unless a still-only exception is recorded | **Visual Engine v2** — GPT Image 2 primary for stills; HTML/code-render for exact-data controls; Motion Engine v1 standard layout-adaptive GIF/MP4 companion after still approval unless a still-only exception is recorded |
| Frequency | Evidence-led allocation within the five-post weekly LinkedIn portfolio | Evidence-led allocation within the five-post weekly LinkedIn portfolio |
| Output | caption + approved still + motion package | caption + approved still + motion + resource decision + publish manifest |

---

## Pipeline 1: Supply Chain 101

```
/101 [topic-slug]    ← production command after V4 topic, evidence, and source gates
```

Generates three evidence-led openings, a provenance-checked LinkedIn caption, and a **Visual Engine v2 infographic** after V4 topic admission. ChatGPT / GPT Image 2 is the primary creative rendering lane; HTML/code-render (`renderer/`, HTML→PNG) is retained as the deterministic backup and comparison lane when exact structure, text, or data needs a control.
Tiger approves the opening, stance, caption, and final visual. The **research-engine runs first**, followed by the Tiger source and publish gates.
Topics may come from `references/101-plan.md` and `references/master-calendar.md`, but those files
are candidate banks. The accepted V4 content brief supplies the audience problem, evidence,
channel role, and final angle.

| Command | Trigger | Output |
|---|---|---|
| `/101 [topic-slug]` | Topic slug from monthly topic bank | `data/{week}/{slug}/101-copy.md` |

**Reference files (101 only):**
| File | Purpose |
|---|---|
| `references/101-plan.md` | Monthly topic bank — all foundational topics with hooks, visuals, caption directions |
| `references/audience-intelligence.md` | Audience segments, pain/desire map, save triggers, and topic tests |
| `references/topic-selection-scorecard.md` | Production gate — topic must score before research/caption/visual work |
| `references/top100-reference-intelligence.md` | Top-100 image + caption intelligence — power format, stop-scroll promise, save trigger, and Shetty's Desk adaptation |
| `references/top100-caption-index.md` | Lean generated caption lookup — opener type, promise, artifact, and save trigger from the workbook |
| `references/calendar-reference-adaptation-map-v1.md` | RW03-RW12 candidate topics translated into curated-winner mechanic hypotheses, power formats, caption patterns, and save triggers |
| `references/creative-engine-v3-lean.md` | Lean creative brief, prompt preflight, output review, and package audit for GPT Image 2 outputs |
| `references/101-voice.md` | 101 voice anchor — plain language, series framing, adapted hook taxonomy |
| `references/layout-frameworks-intelligence.md` | 200-pattern layout selector + composition-mode guide — pick the visual layout for the code-render |
| `references/render-pilot-workflow.md` | Code-render pipeline + design/technical learnings (now shared by 101 + AI for SC) |
| `references/visual-engine-v2.md` | Active visual workflow — GPT Image 2 first, HTML control lane, Cobalt Grid brand seed, QA scorecard |
| `references/motion-engine-v1.md` | Optional picture-first motion lane — semantic component mapping, layout-adaptive choreography, deterministic GIF/MP4 QA |
| `references/publish-resource-handoff-v1.md` | Final caption/still approval, AI-resource eligibility, direct download, and website handoff |
| `references/publish-asset-spec-v1.md` | LinkedIn 4:5 export, canonical-master preservation, and MP4-first website delivery |
| `references/brand-kits/cobalt-grid/FRAME.md` | Current brand frame seed — cream/cobalt grid, editorial type, flat structural restraint |
| `renderer/` | The deterministic HTML→PNG renderer + component-kit templates the 101 infographic is built from |
| `data/101-series-tracker.md` | Published episodes log — tracks which topics are done |

---

## Pipeline 2: AI for Supply Chain

```
/ai-for-sc [week]                 ← generates only that week's V4-board-approved AI use case(s)
/ai-for-sc [week] [use-case-slug] ← generates one specific post
```

Generates practical AI use-case posts for accepted V4 topics. Each post is written for a
specific planning, purchasing, or transformation role and stays practical, concrete, and
reviewable. A week may contain one or more AI-for-SC posts when the evidence-led portfolio
warrants them; the old two-post theme allocation is not automatic.

Before generating, load `tiger-voice.md` as the voice authority and the approved Tiger source
note for the post. `references/published-voice.md` and `references/101-voice.md` may provide
historical examples and accessible-register guidance, but they cannot substitute for fresh
Tiger judgment or impose one repeated caption structure.

| Command | Trigger | Output files |
|---|---|---|
| `/ai-for-sc [week]` | Week number from legacy topic bank | One file per V4-board-approved use case; no automatic A+B pair (+ PDF if requested) |
| `/ai-for-sc [week] [slug]` | Specific use case slug | `ai-for-sc-[use-case-slug].md` (+ PDF if requested) |

**Reference files (AI for SC only):**
| File | Purpose |
|---|---|
| `tiger-voice.md` | Master voice DNA — loaded first, applies to all AI for SC output |
| `references/audience-intelligence.md` | Audience segments, role pains, AI-curious team needs |
| `references/topic-selection-scorecard.md` | Production gate — topic/use case must score before build |
| `references/top100-reference-intelligence.md` | Optional Top-100 image + caption intelligence after topic admission; use only when the curated-winner mechanic improves the visual format, hook pattern, or save trigger |
| `references/top100-caption-index.md` | Lean generated caption lookup — opener type, promise, artifact, and save trigger from the workbook |
| `references/calendar-reference-adaptation-map-v1.md` | RW03-RW12 candidate topics translated into curated-winner mechanic hypotheses, power formats, caption patterns, and save triggers |
| `references/creative-engine-v3-lean.md` | Lean creative brief, prompt preflight, output review, and package audit for GPT Image 2 outputs |
| `references/ai-creator-education-growth-playbook.md` | Current AI education system — creator patterns, execution stack, setup guidance, recurring formats, and engagement principles |
| `references/ai-work-surfaces-benchmark-2026-07.md` | Current official Claude, ChatGPT/Codex, Copilot, Gemini, and Grok execution surfaces plus the AI caption depth standard |
| `references/linkedin-creator-benchmark-50-2026.md` | Cross-domain benchmark cohort, platform evidence, transferable creator systems, and the 40-point caption QA scorecard |
| `references/published-voice.md` | Hook quality bar, "NOT THIS" list, annotated examples |
| `references/101-voice.md` | Accessible register for the SC concept layer |
| `references/ai-for-sc-plan-v2.md` | W21–W52 candidate use-case bank — not an automatic production queue |
| `references/ai-for-sc-visual-dna.md` | Visual style system — structure/format selection |
| `references/ai-for-sc-creative-intelligence.md` | Creative intelligence from 53 reference images — structure inventory, creative-device combinations, visual ambition bar |
| `references/visual-engine-v2.md` | Active visual workflow — GPT Image 2 first, HTML control lane, Cobalt Grid brand seed, QA scorecard |
| `references/render-pilot-workflow.md` | Code-render pipeline + design/technical learnings |
| `references/motion-engine-v1.md` | Optional picture-first motion lane — semantic component mapping, layout-adaptive choreography, deterministic GIF/MP4 QA |
| `references/master-calendar.md` | Top-level monthly theme calendar — both series aligned |
| `data/ai-for-sc-series-tracker.md` | Published episodes log — tracks role, tool, use case, week |

---

## Deep Dive — ARCHIVED

The data-heavy, research-backed pipeline (`/scout → /research → /message → /content → /gemini-prompt`)
is archived under `skills-archive/deep-dive/` (8 skills + deep-dive-only references).
To resume it, see `skills-archive/deep-dive/README.md`.

---

## Data Directory Structure
```
data/
  101-series-tracker.md               ← 101 series published log
  ai-for-sc-series-tracker.md         ← AI for SC published log (role-based use cases)
  analytics-log.csv                   ← performance metrics
  {YYYY-W##}/                         ← ISO week folder
    {topic-slug}/
      101-copy.md                     ← 101 (hooks + caption)
      ai-for-sc-[use-case-slug].md     ← AI for SC post: hooks + caption + visual brief
      gpt-image-2-prompt.md            ← primary visual prompt + reference list + generation notes
      visual-comparison.md             ← GPT Image 2 vs HTML/control judgment, final pick
      visual-motion.gif                ← standard picture-first motion companion after still approval
      visual-motion.mp4                ← standard full-resolution motion master
      motion-qa.md                     ← endpoint, transition-frame, and media-spec QA
      resource-plan.md                 ← AI-for-SC resource eligibility and package contract
      publish-manifest.json            ← caption/still approval and website handoff status
      analytics.md                     ← post-publish metrics
```
(Older week folders may also contain Deep Dive files — `research.md`, `message-commit.md`, `content.md`, `gemini-prompt.md` — from before that pipeline was archived.)

## Voice Rules
- **101**: @./references/101-voice.md (+ `tiger-voice.md`)
- **AI for SC**: `tiger-voice.md` + the approved Tiger source note; @./references/published-voice.md and @./references/101-voice.md are supporting examples only

## Gotchas
- **V4 Audience Growth OS is active (2026-07-28)** — read `references/v4-audience-growth-operating-system.md` first. The pilot uses five LinkedIn posts per week, 20–30 minutes of thoughtful manual commenting on publishing days, one Substack flagship every two weeks, three Substack Notes per week, and artifact-led website publishing. Do not automate comments or collapse channel outcomes into one score.
- **Tiger source gate** — use `references/tiger-source-gate-v1.md` and `templates/tiger-source-note-template.md`. Public research can identify and prove the topic, but it cannot manufacture Tiger's point of view. Without Tiger's approved stance, failure boundary, first check, human owner, and uncertainty, Codex may research and outline but must not finalize a flagship first-person caption or Substack issue.
- **IKEA content is excluded** — do not use as voice or content reference
- **Visual Engine v2 is active (2026-06-30)** — GPT Image 2 is the **primary creative renderer** for new visual concepts. HTML/code-render remains the **backup and comparison lane** for deterministic structure, exact data, and fallback publish candidates. Read `references/visual-engine-v2.md` first.
- **Content Engine Audit v1 is active (2026-06-30)** — read `references/content-engine-audit-v1.md` when rebuilding calendar/topics/research. The calendar is a candidate library, not a blind autopilot.
- **Topic selection gate** — before building a new post, define the audience segment and score the topic via `references/topic-selection-scorecard.md`. If the topic scores below 75, reframe or park it.
- **Audience intelligence first** — use `references/audience-intelligence.md` to choose the audience job: explain clearly, make a better decision, avoid a mistake, look sharper at work, save time, or use AI safely.
- **Top-100 reference intelligence is optional packaging intelligence** — use `references/top100-reference-intelligence.md` after V4 topic admission when a curated-winner mechanic materially sharpens the promise or information structure. A flagship may instead proceed on stronger Tiger, peer, practitioner-pain, or primary-source evidence; record `Top-100 not used` rather than forcing a weak analogy. The Top-100 is not causal proof. Use `templates/reference-learning-card-template.md` only for selected references.
- **Lean caption index** — use `references/top100-caption-index.md` before opening `references/top 100/Reference File and Caption.xlsx`. Regenerate it with `/Users/tigershetty/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/extract-top100-caption-index.py` after the workbook changes.
- **Creative Engine v3 is active (2026-07-01)** — use `references/creative-engine-v3-lean.md` to keep GPT Image 2 work lean and strict: one-page creative brief, `node scripts/compile-gpt-image-prompt.mjs data/{week}/{slug}`, prompt preflight, output review, then `node scripts/audit-visual-package.mjs data/{week}/{slug}`.
- **Next-12-week editorial rebuild** — `references/editorial-rebuild-next-12-weeks.md` preserves useful candidate angles, but V4 qualification decides whether any row proceeds.
- **Calendar reference map** — `references/calendar-reference-adaptation-map-v1.md` is optional packaging intelligence after V4 topic admission; it does not prove demand or select the topic.
- **Best Single Prompt standard** — default to one strong, reference-led GPT Image 2 prompt built from a locked visual framework. Do not generate three near-identical variants. If a result is generic, change the framework before changing adjectives.
- **HTML comparison standard** — keep HTML rendering available as a control lane. For flagship posts, use `templates/visual-comparison-template.md` to capture GPT Image 2 output, HTML control notes, QA scores, final pick, and reusable learnings.
- **Cobalt Grid brand seed** — use `references/brand-kits/cobalt-grid/FRAME.md` as the active visual brand frame: warm cream, electric cobalt, grid discipline, editorial serif hierarchy, flat structural depth, square geometry, restrained labels.
- **Legacy 3-variant code-render standard (2026-06-28)** — superseded for new still-image posts by Visual Engine v2. Use three full HTML variants only when the HTML lane is the chosen final lane or when the user explicitly asks for coded options.
- **101 visual is no longer code-render primary by default** — GPT Image 2 leads; code-render is the backup/control path.
- **Motion Engine v1 is active (2026-07-13)** — after `visual.png` is approved, the default package includes `visual-motion.gif` and `visual-motion.mp4`. Read `references/motion-engine-v1.md`; map semantic components from the actual layout, keep text/logos/base art locked, use source-fitted covers only when reset QA is clean, otherwise use registered source highlights/signals, and require pixel-identical first/final lossless frames. A still-only output needs a documented eligibility exception.
- **Motion project initializer** — run `node scripts/init-motion-project.mjs data/{week}/{slug}` after still approval. It creates missing brief, shot plan, composition contract, source copy, and QA folders without overwriting existing work.
- **Motion package audit** — run `node scripts/audit-motion-package.mjs data/{week}/{slug}` after export. Do not promote motion without canonical GIF/MP4 files, endpoint proof, completed QA, and a pass decision.
- **Publish/resource handoff** — website publication is the final stage after caption and still approval. Use `publish-manifest.json`; never infer caption approval from visual approval.
- **AI-for-SC resource gate** — score every post with `templates/resource-plan-template.md`. A qualifying pack uses a direct no-email ZIP, four-page branded field guide by default, one safe first run, synthetic inputs, completed outputs, manifest, checksums, and validation.
- **Asset export rule** — preserve `visual.png` as the canonical master. Use native 1080 x 1350 or create a non-cropping `visual-linkedin.png` companion when the master is taller than 4:5. Serve MP4 on the website and retain GIF for LinkedIn.
- **SC 101 footer uses Logo 2** (`renderer/assets/logos/shettys-desk-logo-2.png`, the dark-wordmark lockup for light backgrounds, ~74px on the LEFT) + **"Poornajith Shetty"** signature on the RIGHT. Logo 2 carries the "Shetty's Desk" wordmark, so there is **no separate text label**. Never use Logo 1 on the cards — its wordmark is white and invisible on white.
- **NEGATIVE prompt blocks degrade GPT Image 2 quality** — avoid long negative/DO-NOT blocks; phrase constraints positively.
- **AI-still legacy learnings live at `references/ai-still-prompt-learnings.md`**. Use it for historical lessons, especially framework-first thinking and GPT Image 2 prompt hygiene. Its Nano Banana-first §8 is superseded by `references/visual-engine-v2.md`.
- **Hooks become the verbatim opening line of the published post** — voice rules apply at hook generation
- **AI for SC: resource is eligibility-led** — do not generate a generic optional five-page PDF. Use the six-point resource gate and build a compact runnable pack only when the post earns one.
- **AI for SC: `references/ai-for-sc-plan-v2.md` is a candidate bank** — use an entry only after it passes the V4 audience, evidence, artifact, channel, and Tiger-source gates
- **AI for SC voice** — `tiger-voice.md` and the approved Tiger source note are authoritative. `published-voice.md` is historical and `101-voice.md` is optional accessible-register guidance.
- **AI for SC: hook must name role + current limitation + AI unlock** — "current limitation" must name the actual tool (SAP, Excel, Power BI), not generic friction
- **AI for SC: boundary logic is mandatory in the brief, not automatically in the published caption** — capture where AI should not own the decision, but lead the post with the useful artifact, workflow promise, and practical value. Include explicit risk language only when it improves trust without making the caption caveat-heavy.
- **AI for SC: teach one professional distinction and a current execution architecture** — use `references/ai-creator-education-growth-playbook.md`, `references/ai-work-surfaces-benchmark-2026-07.md`, and `references/linkedin-creator-benchmark-50-2026.md`. A flagship caption should name the persistent method, connected context, specialized execution, control gate, finished artifact, cadence, and human owner. Ordinary chat is a scratchpad, not a sophisticated July 2026 workflow. Tool-specific posts should feature the real product surface and explain the transferable operating method.
- **AI for SC: avoid repetitive role/tool combinations** — when multiple AI-for-SC posts are selected in one week, vary the role, decision, evidence, and tool where that improves the portfolio; do not force variety at the expense of audience value
- **AI for SC: check `data/ai-for-sc-series-tracker.md` before generating** — confirm the episode hasn't been published, and verify no role + use case repeat
- **Research-engine runs after V4 topic admission and before copy/visual production** (`.claude/skills/research-engine/` + the `research-analyst` agent) — it builds a consultant-grade, sourced, reliability-tagged `research-brief.md` per slug. The approved V4 content brief gives the audience problem and angle; the research brief gives the verified facts and numbers. Nothing goes on a card or in a caption unsourced. Concrete/demonstrable examples are layered on top of this depth, never instead of it.
- **101 uses V4 gates** — qualify the audience problem, complete sourced research, record source mode, test three openings, and require explicit caption/still approval.

## Audience
- **Primary V4 audience**: working supply-chain planners and planning managers, purchasing/procurement practitioners, and supply-chain transformation leaders.
- **Supply Chain 101**: use the accessible register when an accepted V4 decision or foundation benefits from plain-language explanation. Secondary audiences may understand it, but the primary practitioner job remains clear.
- **AI for SC**: name the planner, buyer, procurement, or transformation role; the specific current limitation; the inspectable artifact; the validation step; and the human-owned decision.
- **Deep Dive**: archived — see `skills-archive/deep-dive/`.
