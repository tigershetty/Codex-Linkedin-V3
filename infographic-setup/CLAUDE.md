# Infographic Content Engine — Shetty's Desk

A Claude Code pipeline that produces LinkedIn supply chain infographics for Tiger Shetty's
"Shetty's Desk" brand. **Two active pipelines, one engine.** (Deep Dive is archived — see below.)

## Session Start — Do This First
1. Check `data/` for the current ISO week folder and active slug
2. Report which stage the active slug is at (which files exist)
3. **Auto-check incomplete AI-for-SC posts**: note missing visual/motion QA, ten-hook set, caption approval, post-package approval, `resource-plan.md`, or schema v2 `publish-manifest.json`
4. Read `references/audience-intelligence.md` + `references/content-demand-proof-gate-v1.md` + `references/topic-selection-scorecard.md` before accepting a topic
5. Read `references/top100-creator-attribution-and-audit-2026-07.md` before using Top-100 creator or performance claims
6. Read `references/visual-engine-v2.md` before creating or revising any visual
7. Read `references/creative-engine-v3-lean.md` before creating or judging a GPT Image 2 prompt
8. Use `references/calendar-reference-adaptation-map-v1.md` as adaptation history after demand proof, not as topic authorization
9. For AI-for-SC flagship visuals/captions, read `references/workflow-learning-2026-07-08-demand-review-to-sequence-board.md` before drafting; it captures the latest value-first caption and deterministic logo-overlay rules.
10. Read `references/render-first-improve-second-v1.md` before production; build the complete post draft before the integrated correction and approval pass.
11. For GIF/MP4 work, read `references/motion-engine-v1.md` before creating masks, layers, or a timeline.
12. Before a resource or website handoff, read `references/publish-resource-handoff-v2.md` and `references/publish-asset-spec-v1.md`.
13. **Ask: "Supply Chain 101 or AI for Supply Chain?"** — this determines the pipeline

## Pick the Pipeline

```
  [1] Supply Chain 101       → /101 pipeline (foundational, educational)
  [2] AI for Supply Chain    → /ai-for-sc pipeline (two role-based AI use cases, resource eligibility gate)
```

| | Supply Chain 101 | AI for Supply Chain |
|---|---|---|
| Audience | Experts AND non-practitioners | Any SC role — called out by the task (purchaser, planner, logistics coordinator, etc.) |
| Vocabulary | Plain language, technical terms explained | Action-oriented, tool-specific, no hype |
| Research | **research-engine first** — consultant-grade sourced brief per topic (plan gives the angle, brief gives verified facts) | **research-engine first** — parallel tool-layer + method-layer sourced brief per use case |
| Hooks | Metaphor-led, accessible | Role + current limitation + AI unlock |
| Caption | 150–300 words, educational tone | 300–450 words when current execution detail earns the space |
| Control gates | Demand lock -> post draft -> integrated improvement -> post approval -> warranted resource -> website | Demand lock -> post draft -> integrated improvement -> post approval -> warranted resource -> website |
| Visual | **Visual Engine v2** — GPT Image 2 primary; exact 1080 x 1350 canonical promotion; HTML/code-render backup; Motion Engine v1 built in the Draft Sprint when it adds meaning | **Visual Engine v2** — GPT Image 2 primary; exact 1080 x 1350 canonical promotion; HTML/code-render for exact data; layout-adaptive motion built before final package approval |
| Frequency | 2/week (Posts 1+2 in the weekly sub-topic) | 2/week (Posts 3+4 in the weekly sub-topic) |
| Output | approved hooks/caption + still + motion + post package + resource decision | approved hooks/caption + still + motion + post package + validated resource + publish manifest v2 |

---

## Pipeline 1: Supply Chain 101

```
/101 [topic-slug]    ← runs only after demand proof and topic scoring
```

Generates the carrier authorized by the brief: 10 hooks + LinkedIn caption and, when warranted, a **Visual Engine v2 infographic**. ChatGPT / GPT Image 2 is the primary creative rendering lane; HTML/code-render (`renderer/`, HTML→PNG) is retained as the deterministic backup and comparison lane when exact structure, text, or data needs a control.
User picks hook and adjusts at the end. The **research-engine runs first** (consultant-grade sourced brief); no scout, no message-commit gates.
Topics may come from `references/101-plan.md` and `references/master-calendar.md`, but those files are candidate banks. The weekly signal scan and demand gate decide what is built.

| Command | Trigger | Output |
|---|---|---|
| `/101 [topic-slug]` | Topic slug from monthly topic bank | `data/{week}/{slug}/101-copy.md` |

**Reference files (101 only):**
| File | Purpose |
|---|---|
| `references/101-plan.md` | Monthly topic bank — all foundational topics with hooks, visuals, caption directions |
| `references/audience-intelligence.md` | Audience segments, pain/desire map, save triggers, and topic tests |
| `references/content-demand-proof-gate-v1.md` | Non-compensable audience evidence, authority, argument, provenance, and pre-render challenge gate |
| `references/topic-selection-scorecard.md` | Production gate — topic must score before research/caption/visual work |
| `references/top100-reference-intelligence.md` | Top-100 image + caption intelligence — power format, stop-scroll promise, save trigger, and Shetty's Desk adaptation |
| `references/top100-creator-attribution-and-audit-2026-07.md` | Creator/source attribution, repost caveats, live-system evidence, and confidence |
| `references/top100-caption-index.md` | Lean generated caption lookup — opener type, promise, artifact, and save trigger from the workbook |
| `references/calendar-reference-adaptation-map-v1.md` | RW03-RW12 adaptation history; use mechanics only after the demand gate passes |
| `references/creative-engine-v3-lean.md` | Lean creative brief, prompt preflight, output review, and package audit for GPT Image 2 outputs |
| `references/101-voice.md` | 101 voice anchor — plain language, series framing, adapted hook taxonomy |
| `references/layout-frameworks-intelligence.md` | 200-pattern layout selector + composition-mode guide — pick the visual layout for the code-render |
| `references/render-pilot-workflow.md` | Code-render pipeline + design/technical learnings (now shared by 101 + AI for SC) |
| `references/visual-engine-v2.md` | Active visual workflow — GPT Image 2 first, HTML control lane, Cobalt Grid brand seed, QA scorecard |
| `references/motion-engine-v1.md` | Optional picture-first motion lane — semantic component mapping, layout-adaptive choreography, deterministic GIF/MP4 QA |
| `references/render-first-improve-second-v1.md` | Demand lock, post draft, integrated correction, post approval, then resource/website learning |
| `references/publish-resource-handoff-v2.md` | Post-first approval, demand-earned resource construction, direct downloads, and website readiness |
| `references/publish-asset-spec-v1.md` | LinkedIn 4:5 export, canonical-master preservation, and MP4-first website delivery |
| `references/brand-kits/cobalt-grid/FRAME.md` | Current brand frame seed — cream/cobalt grid, editorial type, flat structural restraint |
| `renderer/` | The deterministic HTML→PNG renderer + component-kit templates the 101 infographic is built from |
| `data/101-series-tracker.md` | Published episodes log — tracks which topics are done |

---

## Pipeline 2: AI for Supply Chain

```
/ai-for-sc [week]                 ← generates BOTH use-case posts for that week
/ai-for-sc [week] [use-case-slug] ← generates one specific post
```

Generates practical AI use-case candidates within the monthly theme. No fixed audience tiers: each post is written for a specific SC role and must pass the same demand-proof gate. Posts stay practical, concrete, and evidence-bounded.

The calendar may propose two AI posts for a week. Production depth depends on evidence; a weak candidate can be replaced, tested lightly, or parked.

Before generating, the skill loads: `tiger-voice.md`, `references/published-voice.md`, and `references/101-voice.md` (voice), plus `references/ai-for-sc-visual-dna.md` and `references/ai-for-sc-creative-intelligence.md` (visual intelligence).

| Command | Trigger | Output files |
|---|---|---|
| `/ai-for-sc [week]` | Week number from monthly topic bank | `ai-for-sc-[use-case-a-slug].md` + `ai-for-sc-[use-case-b-slug].md` (+ PDF files if requested) |
| `/ai-for-sc [week] [slug]` | Specific use case slug | `ai-for-sc-[use-case-slug].md` (+ PDF if requested) |

**Reference files (AI for SC only):**
| File | Purpose |
|---|---|
| `tiger-voice.md` | Master voice DNA — loaded first, applies to all AI for SC output |
| `references/audience-intelligence.md` | Audience segments, role pains, AI-curious team needs |
| `references/content-demand-proof-gate-v1.md` | Non-compensable audience evidence, authority, argument, provenance, and pre-render challenge gate |
| `references/topic-selection-scorecard.md` | Production gate — topic/use case must score before build |
| `references/top100-reference-intelligence.md` | Top-100 image + caption intelligence — use before selecting the visual format, hook pattern, and save trigger |
| `references/top100-creator-attribution-and-audit-2026-07.md` | Creator/source attribution, repost caveats, live-system evidence, and confidence |
| `references/top100-caption-index.md` | Lean generated caption lookup — opener type, promise, artifact, and save trigger from the workbook |
| `references/calendar-reference-adaptation-map-v1.md` | RW03-RW12 adaptation history; use mechanics only after the demand gate passes |
| `references/creative-engine-v3-lean.md` | Lean creative brief, prompt preflight, output review, and package audit for GPT Image 2 outputs |
| `references/ai-creator-education-growth-playbook.md` | Current AI education system — creator patterns, execution stack, setup guidance, recurring formats, and engagement principles |
| `references/ai-work-surfaces-benchmark-2026-07.md` | Current official Claude, ChatGPT/Codex, Copilot, Gemini, and Grok execution surfaces plus the AI caption depth standard |
| `references/linkedin-creator-benchmark-50-2026.md` | Cross-domain benchmark cohort, platform evidence, transferable creator systems, and the 40-point caption QA scorecard |
| `references/published-voice.md` | Hook quality bar, "NOT THIS" list, annotated examples |
| `references/101-voice.md` | Accessible register for the SC concept layer |
| `references/ai-for-sc-plan-v2.md` | Fully pre-defined W21–W52 use-case plan — Role, Tool, Use Case, Hook direction per post |
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
      visual-motion.gif                ← picture-first motion companion built in the Draft Sprint
      visual-motion.mp4                ← standard full-resolution motion master
      motion-qa.md                     ← endpoint, transition-frame, and media-spec QA
      resource-plan.md                 ← post resource eligibility and package contract
      publish-manifest.json            ← schema v2 hook/caption/still/motion/post/resource/website state
      analytics.md                     ← post-publish metrics
```
(Older week folders may also contain Deep Dive files — `research.md`, `message-commit.md`, `content.md`, `gemini-prompt.md` — from before that pipeline was archived.)

## Voice Rules
- **101**: @./references/101-voice.md (+ `tiger-voice.md`)
- **AI for SC**: `tiger-voice.md` + @./references/published-voice.md + @./references/101-voice.md

## Gotchas
- **IKEA content is excluded** — do not use as voice or content reference
- **Visual Engine v2 is active (2026-06-30)** — GPT Image 2 is the **primary creative renderer** for new visual concepts. HTML/code-render remains the **backup and comparison lane** for deterministic structure, exact data, and fallback publish candidates. Read `references/visual-engine-v2.md` first.
- **Content Engine Audit v1 is active (2026-06-30)** — read `references/content-engine-audit-v1.md` when rebuilding calendar/topics/research. The calendar is a candidate library, not a blind autopilot.
- **Demand proof is non-compensable (2026-07-20)** — before scoring, record three dated audience receipts from two source types, historical priors, Tiger's authority source, the argument, and reference provenance via `references/content-demand-proof-gate-v1.md`.
- **Topic selection gate** — after demand proof, score via `references/topic-selection-scorecard.md`. If the topic scores below 75, reframe or park it. Visual potential cannot rescue weak demand.
- **Audience intelligence first** — use `references/audience-intelligence.md` to choose the audience job: explain clearly, make a better decision, avoid a mistake, look sharper at work, save time, or use AI safely.
- **Top-100 provenance audit is active (2026-07-20)** — `references/top100-reference-intelligence.md` is a visual-mechanics library. Use `references/top100-creator-attribution-and-audit-2026-07.md` for creator, original-source, repost, and confidence claims. Say `reference-informed` unless live performance or business evidence supports `performance-supported`.
- **Lean caption index** — use `references/top100-caption-index.md` before opening `references/top 100/Reference File and Caption.xlsx`. Regenerate it with `/Users/tigershetty/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/extract-top100-caption-index.py` after the workbook changes.
- **Creative Engine v3 is active (2026-07-01)** — use `references/creative-engine-v3-lean.md` to keep GPT Image 2 work lean and strict: one-page creative brief, `node scripts/compile-gpt-image-prompt.mjs data/{week}/{slug}`, prompt preflight, output review, then `node scripts/audit-visual-package.mjs data/{week}/{slug}`.
- **Next-12-week editorial rebuild** — use `references/editorial-rebuild-next-12-weeks.md` before continuing RW03-RW12. It scores the existing calendar and gives the audience-led rebuild angles.
- **Calendar reference map** — for RW03-RW12, use `references/calendar-reference-adaptation-map-v1.md` to package each topic before research, copy, or visual generation.
- **Best Single Prompt standard** — default to one strong, reference-led GPT Image 2 prompt built from a locked visual framework. Do not generate three near-identical variants. If a result is generic, change the framework before changing adjectives.
- **HTML comparison standard** — keep HTML rendering available as a control lane. For flagship posts, use `templates/visual-comparison-template.md` to capture GPT Image 2 output, HTML control notes, QA scores, final pick, and reusable learnings.
- **Cobalt Grid brand seed** — use `references/brand-kits/cobalt-grid/FRAME.md` as the active visual brand frame: warm cream, electric cobalt, grid discipline, editorial serif hierarchy, flat structural depth, square geometry, restrained labels.
- **Legacy 3-variant code-render standard (2026-06-28)** — superseded for new still-image posts by Visual Engine v2. Use three full HTML variants only when the HTML lane is the chosen final lane or when the user explicitly asks for coded options.
- **101 visual is no longer code-render primary by default** — GPT Image 2 leads; code-render is the backup/control path.
- **Render first, improve second is active (2026-07-19)** — use `references/render-first-improve-second-v1.md` after demand and argument lock. Build the still, ten hooks, caption draft, and meaningful motion before the integrated correction pass. Approve the post package before normal resource construction; draft states never receive fake timestamps.
- **Motion Engine v1 is active (2026-07-13)** — once the selected 1080 x 1350 draft still exists, build `visual-motion.gif` and `visual-motion.mp4` during the Draft Sprint when motion adds sequence, dependency, comparison, state change, or decision logic. Keep text/logos/base art locked and require pixel-identical opening/restored lossless frames. Highlight-only decoration does not satisfy the value gate.
- **Motion project initializer** — run `node scripts/init-motion-project.mjs data/{week}/{slug}` after the selected draft still exists. It creates missing brief, shot plan, composition contract, source copy, and QA folders without overwriting existing work.
- **Motion package audit** — run `node scripts/audit-motion-package.mjs data/{week}/{slug}` after export. Do not promote motion without canonical GIF/MP4 files, endpoint proof, completed QA, and a pass decision.
- **Publish/resource handoff** — use schema v2 and `references/publish-resource-handoff-v2.md`. Resources normally follow post-package approval and recorded audience demand or strategic need. Website handoff waits for the approved post package and validated resource decision.
- **Resource gate** — score every 101 and AI-for-SC post with `templates/resource-plan-template.md`. A qualifying resource uses transparent individual downloads, a branded instruction PDF plus Markdown guide, a safe first-run path using governed copies of the reader's own files, source-to-input mapping before analysis, explicit output contracts, a download manifest, checksums, validation, and a human decision boundary. For bring-your-own-project skills, missing minimum evidence returns readiness gaps instead of a fabricated artifact. ZIP delivery is legacy-only.
- **Resource package audit** — run `node scripts/audit-resource-package.mjs data/{week}/{slug}` after building the library. It checks the instruction PDF, Markdown guide, public file inventory, standalone skill contracts, manifests, hashes, and human-control guidance.
- **Asset export rule** — GPT Image 2 portrait candidates use 1024 x 1536 with a centered 1024 x 1280 content-safe area. Promote the same exact 1080 x 1350 pixels to both `visual.png` and `visual-linkedin.png`; retain the model-native image only as a candidate. Serve MP4 on the website and retain GIF for LinkedIn.
- **SC 101 footer uses Logo 2** (`renderer/assets/logos/shettys-desk-logo-2.png`, the dark-wordmark lockup for light backgrounds, ~74px on the LEFT) + **"Poornajith Shetty"** signature on the RIGHT. Logo 2 carries the "Shetty's Desk" wordmark, so there is **no separate text label**. Never use Logo 1 on the cards — its wordmark is white and invisible on white.
- **NEGATIVE prompt blocks degrade GPT Image 2 quality** — avoid long negative/DO-NOT blocks; phrase constraints positively.
- **AI-still legacy learnings live at `references/ai-still-prompt-learnings.md`**. Use it for historical lessons, especially framework-first thinking and GPT Image 2 prompt hygiene. Its Nano Banana-first §8 is superseded by `references/visual-engine-v2.md`.
- **Hooks become the verbatim opening line of the published post** — voice rules apply at hook generation
- **AI for SC: resource is eligibility-led** — do not generate a generic optional five-page PDF. Use the six-point resource gate and build a compact runnable pack only when the post earns one.
- **AI for SC: use cases are pre-defined in `references/ai-for-sc-plan-v2.md`** — load it at Step 1 and confirm the pre-defined use cases with the user before generating hooks
- **AI for SC: load tiger-voice.md + published-voice.md + 101-voice.md before generating** — all three voice references apply
- **AI for SC: hook must name role + current limitation + AI unlock** — "current limitation" must name the actual tool (SAP, Excel, Power BI), not generic friction
- **AI for SC: boundary logic is mandatory in the brief, not automatically in the published caption** — capture where AI should not own the decision, but lead the post with the useful artifact, workflow promise, and practical value. Include explicit risk language only when it improves trust without making the caption caveat-heavy.
- **AI for SC: teach one professional distinction and a current execution architecture** — use `references/ai-creator-education-growth-playbook.md`, `references/ai-work-surfaces-benchmark-2026-07.md`, and `references/linkedin-creator-benchmark-50-2026.md`. A flagship caption should name the persistent method, connected context, specialized execution, control gate, finished artifact, cadence, and human owner. Ordinary chat is a scratchpad, not a sophisticated July 2026 workflow. Tool-specific posts should feature the real product surface and explain the transferable operating method.
- **AI for SC: two posts per week = two different SC roles + two different AI tools** — do not repeat the same role or tool in the same week
- **AI for SC: check `data/ai-for-sc-series-tracker.md` before generating** — confirm the episode hasn't been published, and verify no role + use case repeat
- **Research-engine runs FIRST on every 101 + AI for SC run** (`.claude/skills/research-engine/` + the `research-analyst` agent) — it builds a consultant-grade, sourced, reliability-tagged `research-brief.md` per slug. `references/101-plan.md` / `ai-for-sc-plan-v2.md` give the topic/angle; the brief gives the verified facts and numbers. Nothing goes on a card or in a caption unsourced. Concrete/demonstrable examples (tool-in-host-surface: Copilot-in-Excel, Claude-in-Claude-Code/Cowork) are layered on top of this depth, never instead of it.
- **101: no control gates** — all 10 hooks + caption generated in one pass, user picks at the end

## Audience
- **Supply Chain 101**: Experts AND non-practitioners. Write as a teacher, not a consultant. Plain language. Could someone outside supply chain understand this over coffee?
- **AI for SC**: Any SC role — purchaser, supply planner, demand planner, logistics coordinator, transport specialist, category manager, warehouse manager, S&OP analyst. The role is determined by the use case, not assigned in advance. Hook names the role + the specific current limitation (SAP, Excel, manual process) + the AI unlock. Both posts per week are practical and copy-paste ready.
- **Deep Dive**: archived — see `skills-archive/deep-dive/`.
