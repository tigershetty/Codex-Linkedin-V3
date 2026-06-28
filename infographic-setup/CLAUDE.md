# Infographic Content Engine — Shetty's Desk

A Claude Code pipeline that produces LinkedIn supply chain infographics for Tiger Shetty's
"Shetty's Desk" brand. **Two active pipelines, one engine.** (Deep Dive is archived — see below.)

## Session Start — Do This First
1. Check `data/` for the current ISO week folder and active slug
2. Report which stage the active slug is at (which files exist)
3. **Auto-check for incomplete AI for SC posts**: scan for any `{slug}/` folders containing `ai-for-sc-[slug].md` — note any where a PDF was likely requested but `ai-for-sc-[slug]-pdf.md` is missing
4. **Ask: "Supply Chain 101 or AI for Supply Chain?"** — this determines the pipeline

## Pick the Pipeline

```
  [1] Supply Chain 101       → /101 pipeline (foundational, educational)
  [2] AI for Supply Chain    → /ai-for-sc pipeline (two role-based AI use-case posts, optional PDF)
```

| | Supply Chain 101 | AI for Supply Chain |
|---|---|---|
| Audience | Experts AND non-practitioners | Any SC role — called out by the task (purchaser, planner, logistics coordinator, etc.) |
| Vocabulary | Plain language, technical terms explained | Action-oriented, tool-specific, no hype |
| Research | **research-engine first** — consultant-grade sourced brief per topic (plan gives the angle, brief gives verified facts) | **research-engine first** — parallel tool-layer + method-layer sourced brief per use case |
| Hooks | Metaphor-led, accessible | Role + current limitation + AI unlock |
| Caption | 150–300 words, educational tone | 220–320 words, practical, copy-paste level |
| Control gates | None (single-step) | None — PDF is a yes/no gate after the caption |
| Visual | **Code-render** (`renderer/`) — HTML→PNG (primary); ChatGPT GPT Image 2 prompt = backup | Code-render (`renderer/`) — HTML→PNG/GIF/MP4 |
| Frequency | 2/week (Posts 1+2 in the weekly sub-topic) | 2/week (Posts 3+4 in the weekly sub-topic) |
| Output | `101-copy.md` | `ai-for-sc-[use-case-slug].md` (+ optional `-pdf.md`) |

---

## Pipeline 1: Supply Chain 101

```
/101 [topic-slug]    ← single step, no gates
```

Generates 10 hooks + LinkedIn caption + a **code-rendered infographic** (`renderer/`, HTML→PNG) in one pass from the monthly topic bank. A ChatGPT (GPT Image 2) prompt is kept as the **backup** visual path (illustration fallback when code-render isn't the right fit).
User picks hook and adjusts at the end. The **research-engine runs first** (consultant-grade sourced brief); no scout, no message-commit gates.
Topics come from `references/101-plan.md` (see also `references/master-calendar.md`). `/101` runs Posts 1 and 2 of each week.

| Command | Trigger | Output |
|---|---|---|
| `/101 [topic-slug]` | Topic slug from monthly topic bank | `data/{week}/{slug}/101-copy.md` |

**Reference files (101 only):**
| File | Purpose |
|---|---|
| `references/101-plan.md` | Monthly topic bank — all foundational topics with hooks, visuals, caption directions |
| `references/101-voice.md` | 101 voice anchor — plain language, series framing, adapted hook taxonomy |
| `references/layout-frameworks-intelligence.md` | 200-pattern layout selector + composition-mode guide — pick the visual layout for the code-render |
| `references/render-pilot-workflow.md` | Code-render pipeline + design/technical learnings (now shared by 101 + AI for SC) |
| `renderer/` | The deterministic HTML→PNG renderer + component-kit templates the 101 infographic is built from |
| `data/101-series-tracker.md` | Published episodes log — tracks which topics are done |

---

## Pipeline 2: AI for Supply Chain

```
/ai-for-sc [week]                 ← generates BOTH use-case posts for that week
/ai-for-sc [week] [use-case-slug] ← generates one specific post
```

Generates two practical AI use-case posts per week within the monthly theme. No fixed audience tiers — each post is written for a specific SC role determined by the task. Both posts stay practical, concrete, and copy-paste ready.

One week = one theme = two posts. Each post: different SC role, different AI tool, different use case — same theme.

Before generating, the skill loads: `tiger-voice.md`, `references/published-voice.md`, and `references/101-voice.md` (voice), plus `references/ai-for-sc-visual-dna.md` and `references/ai-for-sc-creative-intelligence.md` (visual intelligence).

| Command | Trigger | Output files |
|---|---|---|
| `/ai-for-sc [week]` | Week number from monthly topic bank | `ai-for-sc-[use-case-a-slug].md` + `ai-for-sc-[use-case-b-slug].md` (+ PDF files if requested) |
| `/ai-for-sc [week] [slug]` | Specific use case slug | `ai-for-sc-[use-case-slug].md` (+ PDF if requested) |

**Reference files (AI for SC only):**
| File | Purpose |
|---|---|
| `tiger-voice.md` | Master voice DNA — loaded first, applies to all AI for SC output |
| `references/published-voice.md` | Hook quality bar, "NOT THIS" list, annotated examples |
| `references/101-voice.md` | Accessible register for the SC concept layer |
| `references/ai-for-sc-plan-v2.md` | Fully pre-defined W21–W52 use-case plan — Role, Tool, Use Case, Hook direction per post |
| `references/ai-for-sc-visual-dna.md` | Visual style system — structure/format selection |
| `references/ai-for-sc-creative-intelligence.md` | Creative intelligence from 53 reference images — structure inventory, creative-device combinations, visual ambition bar |
| `references/render-pilot-workflow.md` | Code-render pipeline + design/technical learnings |
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
      101-copy.md                     ← 101 (hooks + caption + ChatGPT Image 2 prompt)
      ai-for-sc-[use-case-slug].md     ← AI for SC post: hooks + caption + render brief (visual code-rendered to renderer/out/)
      ai-for-sc-[use-case-slug]-pdf.md ← AI for SC PDF draft (5-page markdown, only if requested)
      analytics.md                    ← post-publish metrics
```
(Older week folders may also contain Deep Dive files — `research.md`, `message-commit.md`, `content.md`, `gemini-prompt.md` — from before that pipeline was archived.)

## Voice Rules
- **101**: @./references/101-voice.md (+ `tiger-voice.md`)
- **AI for SC**: `tiger-voice.md` + @./references/published-voice.md + @./references/101-voice.md

## Gotchas
- **IKEA content is excluded** — do not use as voice or content reference
- **3-variant render standard (2026-06-28)** — EVERY post (101 + AI for SC) renders **3 visually distinct concepts** (3 different layout frameworks + hero devices via `layout-select`, never recolours of one idea) and the user **picks one**. Build `<slug>-v1/-v2/-v3.html`, QA each, surface all 3, copy the chosen render to `visual.png`, and keep all 3 templates + out PNGs (variety log + future-post seed). This is the variety guarantee — no two posts lean on the same default.
- **101 visual is now code-rendered** (`renderer/`, HTML→PNG) — pick **3 distinct layouts** via `layout-select`, build the templates, render and QA each PNG. The ChatGPT (GPT Image 2) prompt is the **backup** path (illustration fallback), kept in `101-copy.md`.
- **SC 101 footer uses Logo 2** (`renderer/assets/logos/shettys-desk-logo-2.png`, the dark-wordmark lockup for light backgrounds, ~74px on the LEFT) + **"Poornajith Shetty"** signature on the RIGHT. Logo 2 carries the "Shetty's Desk" wordmark, so there is **no separate text label**. Never use Logo 1 on the cards — its wordmark is white and invisible on white.
- **NEGATIVE prompt blocks degrade render quality** — never add them to the 101 ChatGPT (GPT Image 2) backup prompt
- **Hooks become the verbatim opening line of the published post** — voice rules apply at hook generation
- **AI for SC: PDF draft is optional** — after caption + render brief (+ rendered infographic) are presented, ask "Would you like a PDF draft? (Yes / No)" before generating
- **AI for SC: use cases are pre-defined in `references/ai-for-sc-plan-v2.md`** — load it at Step 1 and confirm the pre-defined use cases with the user before generating hooks
- **AI for SC: load tiger-voice.md + published-voice.md + 101-voice.md before generating** — all three voice references apply
- **AI for SC: hook must name role + current limitation + AI unlock** — "current limitation" must name the actual tool (SAP, Excel, Power BI), not generic friction
- **AI for SC: "When NOT to use AI" sentence is mandatory in every post** — it is the trust signal, not optional
- **AI for SC: two posts per week = two different SC roles + two different AI tools** — do not repeat the same role or tool in the same week
- **AI for SC: check `data/ai-for-sc-series-tracker.md` before generating** — confirm the episode hasn't been published, and verify no role + use case repeat
- **Research-engine runs FIRST on every 101 + AI for SC run** (`.claude/skills/research-engine/` + the `research-analyst` agent) — it builds a consultant-grade, sourced, reliability-tagged `research-brief.md` per slug. `references/101-plan.md` / `ai-for-sc-plan-v2.md` give the topic/angle; the brief gives the verified facts and numbers. Nothing goes on a card or in a caption unsourced. Concrete/demonstrable examples (tool-in-host-surface: Copilot-in-Excel, Claude-in-Claude-Code/Cowork) are layered on top of this depth, never instead of it.
- **101: no control gates** — all 10 hooks + caption generated in one pass, user picks at the end

## Audience
- **Supply Chain 101**: Experts AND non-practitioners. Write as a teacher, not a consultant. Plain language. Could someone outside supply chain understand this over coffee?
- **AI for SC**: Any SC role — purchaser, supply planner, demand planner, logistics coordinator, transport specialist, category manager, warehouse manager, S&OP analyst. The role is determined by the use case, not assigned in advance. Hook names the role + the specific current limitation (SAP, Excel, manual process) + the AI unlock. Both posts per week are practical and copy-paste ready.
- **Deep Dive**: archived — see `skills-archive/deep-dive/`.
