# Infographic Content Engine v1 — Shetty's Desk

## Session Start — Do This First
1. Check `data/` for the current ISO week folder and active slug
2. Report which stage the active slug is at (which files exist)
3. **Auto-check for incomplete AI for SC posts**: scan for any `{slug}/` folders containing `ai-for-sc-practitioner.md` without a matching `ai-for-sc-practitioner-pdf.md`, or `ai-for-sc-leader.md` without `ai-for-sc-leader-pdf.md` — flag these as incomplete
4. **Ask: "Deep Dive, Supply Chain 101, or AI for Supply Chain?"** — this determines the pipeline (CG0)
5. For Deep Dive: remind to upload `references/brand-anchor-v1.webp` to the Gemini Gem
6. Flag any incomplete gates: CG1 (topic not selected), CG2 (hook not selected — deep dive only)

## What This Is
A Claude Code pipeline that produces LinkedIn supply chain infographics for Tiger Shetty's
"Shetty's Desk" brand. Two content types, two pipelines, one engine.

## CG0 — Content Type Selection (Control Gate 0)

Before any work starts, determine the content type:

```
"Which content type are we working on today?"

  [1] Supply Chain 101       → /101 pipeline (foundational, educational, monthly theme model)
  [2] AI for Supply Chain    → /ai-for-sc pipeline (SC Practitioner + Leader posts, PDF drafts)
  [3] Deep Dive              → /infographic pipeline (data-heavy, case-study driven) [PAUSED]
```

| | Supply Chain 101 | AI for Supply Chain | Deep Dive |
|---|---|---|---|
| Audience | Experts AND non-practitioners | Any SC role — role called out by the task (purchaser, planner, logistics coordinator, etc.) | VP Supply Chain, COO, Directors |
| Vocabulary | Plain language, technical terms explained | Action-oriented, tool-specific, no hype | Industry-grade, numbers-heavy |
| Research | None — topics pre-planned in monthly topic bank | None — use cases defined at runtime within monthly theme | Full /research with evidence ledger |
| Hooks | Metaphor-led, accessible | Role + current limitation + AI unlock — specific enough the right person self-identifies | Data-led, case-study anchored |
| Caption | 150–300 words, educational tone | 220–320 words, practical, copy-paste level | 200–350 words, 7-part structure with stats |
| Control gates | None (single-step) | None — PDF is a yes/no gate after caption is approved | CG1 (topic) + CG2 (hook) |
| Visual | Gemini with 101 brand kit template | Gemini — workflow, prompt template, or reference cheat sheet | Gemini with deep-dive visual DNA |
| Frequency | 2/week (Posts 1+2 in weekly sub-topic) | 2/week (Posts 3+4 in weekly sub-topic) | Paused |
| Output files | `101-copy.md` | `ai-for-sc-[use-case-slug].md` + optional `ai-for-sc-[use-case-slug]-pdf.md` | `content.md` + `gemini-prompt.md` |

---

## Pipeline 1: Supply Chain 101

```
/101 [topic-slug]    ← single step, no gates
```

Generates 10 hooks + LinkedIn caption + Gemini prompt in one pass from the monthly topic bank.
User picks hook and adjusts at the end. No research, no scout, no message commit.
Topics follow the monthly theme model in this file (Part 3 — see CLAUDE.md). `/101` runs Posts 1 and 2 of each week.

| Command | Trigger | Output |
|---|---|---|
| `/101 [topic-slug]` | Topic slug from monthly topic bank | `data/{week}/{slug}/101-copy.md` |

**Reference files (101 only):**
| File | Purpose |
|---|---|
| `references/101-plan.md` | Monthly topic bank — all foundational topics with hooks, visuals, caption directions |
| `references/101-voice.md` | 101 voice anchor — plain language, series framing, adapted hook taxonomy |
| `data/101-series-tracker.md` | Published episodes log — tracks which topics are done |

---

## Pipeline 2: AI for Supply Chain (v2 — updated 2026-06-07)

```
/ai-for-sc [week]                 ← generates BOTH use-case posts for that week
/ai-for-sc [week] [use-case-slug] ← generates one specific post
```

Generates two practical AI use-case posts per week within the monthly theme. No fixed audience tiers (Practitioner/Leader) — each post is written for a specific SC role determined by the task. Both posts stay practical, concrete, and copy-paste ready.

One week = one theme = two posts. Each post: different SC role, different AI tool, different use case — same theme.

Before generating, the skill loads: `tiger-voice.md`, `references/published-voice.md`, and `references/101-voice.md` — all three voice references apply.

| Command | Trigger | Output files |
|---|---|---|
| `/ai-for-sc [week]` | Week number from monthly topic bank | `ai-for-sc-[use-case-a-slug].md` + `ai-for-sc-[use-case-b-slug].md` (+ PDF files if requested) |
| `/ai-for-sc [week] [slug]` | Specific use case slug | `ai-for-sc-[use-case-slug].md` (+ PDF if requested) |

**Reference files (AI for SC only):**
| File | Purpose |
|---|---|
| `~/Claude Nano /tiger-voice.md` | Master voice DNA — loaded first, applies to all AI for SC output |
| `references/published-voice.md` | Hook quality bar, "NOT THIS" list, annotated examples |
| `references/101-voice.md` | Accessible register for the SC concept layer |
| `data/ai-for-sc-series-tracker.md` | Published episodes log — tracks role, tool, use case, week |

---

## Pipeline 3: Deep Dive (PAUSED)

```
/infographic              ← start here (no topic selected)
/infographic [slug]       ← resume from the correct stage
```

Full stage sequence (with gate positions):
```
/scout → [CG1: pick topic] → /research → /message → [CG2: pick hook] → /content → /gemini-prompt
```

| Command | Trigger condition | Output file |
|---|---|---|
| `/scout` | Weekly topic selection | `data/{week}/topic-scout.md` |
| `/research [slug]` | Topic selected from scout | `data/{week}/{slug}/research.md` |
| `/message [slug]` | research.md exists | `data/{week}/{slug}/message-commit.md` |
| `/content [slug]` | message-commit.md exists | `data/{week}/{slug}/content.md` |
| `/gemini-prompt [slug]` | content.md exists | `data/{week}/{slug}/gemini-prompt.md` |
| `/retrospective [slug]` | 7 days after publish | `data/{week}/{slug}/performance.md` |
| `/infographic [slug?]` | Any point in pipeline | Orchestrates all above in sequence |

**Reference files (deep dive only):**
| File | Purpose |
|---|---|
| `references/published-voice.md` | Tiger's voice: 7-part structure, markers, annotated examples, "Do NOT" list |
| `references/brand-anchor-v1.webp` | Style reference — upload to Gemini Gem each session |
| `references/gemini-gem-standard.md` | Gemini Gem instructions (paste into gemini.google.com gem setup) |
| `references/infographic-visual-dna.md` | Visual style system and layout rules |
| `references/infographic-layout-library.md` | Layout templates and composition patterns |

---

## Data Directory Structure
```
data/
  101-series-tracker.md               ← 101 series published log
  ai-for-sc-series-tracker.md         ← AI for SC published log (Practitioner + Leader)
  sources.csv                         ← deep dive source library
  recently-used-sources.md            ← deep dive deduplication
  analytics-log.csv                   ← performance metrics
  {YYYY-W##}/                         ← ISO week folder
    topic-scout.md                    ← deep dive candidates (deep dive only)
    {topic-slug}/
      101-copy.md                     ← 101 only (hooks + caption + Gemini prompt)
      ai-for-sc-practitioner.md       ← AI for SC Practitioner post (hooks + caption + Gemini prompt)
      ai-for-sc-practitioner-pdf.md   ← AI for SC Practitioner PDF draft (5-page markdown)
      ai-for-sc-leader.md             ← AI for SC Leader post (hooks + caption + Gemini prompt)
      ai-for-sc-leader-pdf.md         ← AI for SC Leader PDF draft (5-page markdown)
      research.md                     ← deep dive only
      message-commit.md               ← deep dive only (contains selected hook)
      content.md                      ← deep dive only
      gemini-prompt.md                ← deep dive only (101 and AI for SC prompts live in their own files)
      performance.md                  ← post-publish metrics (7 days later)
```

## Voice Rules
- **Deep Dive**: @./references/published-voice.md
- **101**: @./references/101-voice.md

## Gotchas
- **IKEA content is excluded** — do not use as voice or content reference
- **NEGATIVE prompt blocks degrade render quality** — never add them to Gemini prompts
- **Hooks become the verbatim opening line of the published post** — voice rules apply at hook generation
- **AI for SC: PDF draft is optional** — after caption + Gemini prompt are presented, ask "Would you like a PDF draft? (Yes / No)" before generating
- **AI for SC: run `/retrospective` before generating a new week's posts** — save rate by visual format type informs format choice
- **AI for SC: load tiger-voice.md + published-voice.md + 101-voice.md before generating** — all three references apply
- **AI for SC: hook must name role + current limitation + AI unlock** — all three elements required; "current limitation" must name the actual tool (SAP, Excel, Power BI) not generic friction
- **AI for SC: "When NOT to use AI" sentence is mandatory in every post** — it is the trust signal, not optional
- **AI for SC: two posts per week = two different SC roles + two different AI tools** — do not repeat the same role or tool in the same week
- **AI for SC: use cases are defined at runtime** — not pre-assigned. Check the series tracker to avoid repeating a role + use case combination
- **101: no research stage** — the monthly topic bank in this CLAUDE.md IS the source of truth for topic content
- **101: no CG2** — all 10 hooks + caption generated in one pass, user picks at the end
- **Deep dive: research.md must exist before /message** — /message will error on scout data alone
- **Deep dive: CG2 requires explicit hook selection (1–10)** before /content runs
- **Deep dive: brand-anchor-v1.webp must be uploaded each Gemini session** — not stored in the gem

## Audience
- **Supply Chain 101**: Experts AND non-practitioners. Write as a teacher, not a consultant. Plain language. Could someone outside supply chain understand this over coffee?
- **AI for SC**: Any SC role — purchaser, supply planner, demand planner, logistics coordinator, transport specialist, category manager, warehouse manager, S&OP analyst. The role is determined by the use case, not assigned in advance. Hook names the role + the specific current limitation (SAP, Excel, manual process) + the AI unlock. Both posts per week are practical and copy-paste ready — no abstract leadership framing.
- **Deep Dive** (paused): VP Supply Chain, COO, Director of Operations — senior practitioners, not academics. Write as a peer, not a consultant. Numbers mid-sentence.
