# Infographic Content Engine v1 — Shetty's Desk

## Session Start — Do This First
1. Check `data/` for the current ISO week folder and active slug
2. Report which stage the active slug is at (which files exist)
3. **Ask: "Deep Dive or Supply Chain 101?"** — this determines the pipeline (CG0)
4. For Deep Dive: remind to upload `references/brand-anchor-v1.webp` to the Gemini Gem
5. Flag any incomplete gates: CG1 (topic not selected), CG2 (hook not selected — deep dive only)

## What This Is
A Claude Code pipeline that produces LinkedIn supply chain infographics for Tiger Shetty's
"Shetty's Desk" brand. Two content types, two pipelines, one engine.

## CG0 — Content Type Selection (Control Gate 0)

Before any work starts, determine the content type:

```
"Which content type are we working on today?"

  [1] Supply Chain 101   → /101 pipeline (accessible, educational, 90-day plan)
  [2] Deep Dive          → /infographic pipeline (data-heavy, case-study driven)
```

| | Supply Chain 101 | Deep Dive |
|---|---|---|
| Audience | Experts AND non-practitioners | VP Supply Chain, COO, Directors |
| Vocabulary | Plain language, no jargon | Industry-grade, numbers-heavy |
| Research | None — topics pre-planned in 90-day plan | Full /research with evidence ledger |
| Hooks | Metaphor-led, accessible | Data-led, case-study anchored |
| Caption | 150–300 words, educational tone | 200–350 words, 7-part structure with stats |
| Control gates | None (single-step) | CG1 (topic) + CG2 (hook) |
| Visual | Gemini with 101 brand kit template | Gemini with deep-dive visual DNA |
| Frequency | 2/week (Wed + one other) | Weekly |

---

## Pipeline 1: Supply Chain 101

```
/101 [topic-number]    ← single step, no gates
```

Generates 10 hooks + LinkedIn caption + Gemini prompt in one pass from the 90-day plan.
User picks hook and adjusts at the end. No research, no scout, no message commit.

| Command | Trigger | Output |
|---|---|---|
| `/101 [topic-number]` | Topic number from 90-day plan (1–24) | `data/{week}/{slug}/101-copy.md` |

**Reference files (101 only):**
| File | Purpose |
|---|---|
| `references/101-plan.md` | 90-day content plan — 24 topics with hooks, visuals, caption directions |
| `references/101-voice.md` | 101 voice anchor — plain language, series framing, adapted hook taxonomy |
| `data/101-series-tracker.md` | Published episodes log — tracks which topics are done |

---

## Pipeline 2: Deep Dive (unchanged)

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
  sources.csv                         ← deep dive source library
  recently-used-sources.md            ← deep dive deduplication
  analytics-log.csv                   ← performance metrics
  {YYYY-W##}/                         ← ISO week folder
    topic-scout.md                    ← deep dive candidates
    {topic-slug}/
      research.md                     ← deep dive only
      message-commit.md              ← deep dive only (contains selected hook)
      content.md                      ← deep dive only
      101-copy.md                     ← 101 only (hooks + caption + Gemini prompt)
      gemini-prompt.md                ← deep dive only (101 prompt is inside 101-copy.md)
      performance.md                  ← post-publish metrics (7 days later)
```

## Voice Rules
- **Deep Dive**: @./references/published-voice.md
- **101**: @./references/101-voice.md

## Gotchas
- **IKEA content is excluded** — do not use as voice or content reference
- **NEGATIVE prompt blocks degrade render quality** — never add them to Gemini prompts
- **Hooks become the verbatim opening line of the published post** — voice rules apply at hook generation
- **Deep dive: research.md must exist before /message** — /message will error on scout data alone
- **Deep dive: CG2 requires explicit hook selection (1–10)** before /content runs
- **Deep dive: brand-anchor-v1.webp must be uploaded each Gemini session** — not stored in the gem
- **101: no research stage** — the 90-day plan IS the source of truth for topic content
- **101: no CG2** — all 10 hooks + caption generated in one pass, user picks at the end

## Audience
- **Deep Dive**: VP Supply Chain, COO, Director of Operations — senior practitioners, not academics. Write as a peer, not a consultant. Numbers mid-sentence. Short sentences.
- **101**: Experts AND non-practitioners. Write as a teacher, not a consultant. Plain language. Could someone outside supply chain understand this over coffee?
