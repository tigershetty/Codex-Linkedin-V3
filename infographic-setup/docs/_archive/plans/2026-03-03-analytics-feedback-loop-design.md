# Design — Analytics Feedback Loop
**Date**: 2026-03-03
**Status**: Approved
**Scope**: New `/analytics [slug]` skill + `pattern-synthesizer` agent extension

---

## Problem

The existing feedback layer captures qualitative data (`/feedback`) and 4 performance
metrics (`/retrospective`). The `pattern-synthesizer` agent correlates these against
topic type, hook type, and Gemini prompt format — but has no access to the full
LinkedIn metric set, audience demographics, or the final published artefacts (caption
and Gemini prompt as-used). The learning layer is operating on partial signal.

---

## Decision

Build a new `/analytics [slug]` skill as a pure data capture layer (Stage 5 of the
pipeline). It reads a 4-sheet Excel file the user exports from LinkedIn and enriches
with two additional sheets (CAPTION, GEMINI PROMPT). It writes two outputs:
`analytics.md` (per-post detail record) and `analytics-log.csv` (master correlation
table). Extend `pattern-synthesizer` to read the CSV and surface four new analysis
dimensions. No caption diff comparison at this stage — that is deferred to W18+
when sufficient data exists for statistical meaning.

---

## Excel File Convention

**Location**: `LinkedIn Analytics/Infographics/Analytics/`
**Naming**: `[Post name] - Post Analytics.xlsx`
**Sheets**:

| Sheet | Source | Contents |
|---|---|---|
| `PERFORMANCE` | LinkedIn export | 13 rows: Post URL, Post Date, Publish Time + 9 metrics |
| `TOP DEMOGRAPHICS` | LinkedIn export | 30 rows: Company size, Job title, Location, Company, Industry, Seniority (top 5 each) |
| `CAPTION` | User adds | Full text of final published LinkedIn caption (post-edit version) |
| `GEMINI PROMPT` | User adds | Full text of the Gemini prompt variant actually used for rendering |

---

## Component 1 — `/analytics [slug]` Skill

**Invoke**: `/analytics [slug]`
**Run after**: LinkedIn post is live and Excel file is prepared (both LinkedIn sheets
exported + CAPTION and GEMINI PROMPT sheets added by user)
**Output files**: `data/{YYYY-W##}/{slug}/analytics.md` + `data/analytics-log.csv`

### Step 1 — Find Excel file
- Glob `LinkedIn Analytics/Infographics/Analytics/*.xlsx`
- Match filename to slug (fuzzy — e.g. "Zara" matches "zara-supply-chain-pivot")
- If ambiguous: list candidates and ask user to confirm
- If not found: print path convention and stop

### Step 2 — Read Excel (4 sheets)

**PERFORMANCE sheet** — extract rows 1–13:
```
Post URL        → post_url
Post Date       → post_date
Post Publish Time → publish_time
Impressions     → impressions
Members reached → members_reached
Profile viewers → profile_viewers
Followers gained → followers_gained
Reactions       → reactions
Comments        → comments
Reposts         → reposts
Saves           → saves
Sends on LinkedIn → sends
```

**TOP DEMOGRAPHICS sheet** — extract top entry (row 1) per category:
```
Company size    → top_company_size
Job title       → top_job_title
Location        → top_location
Company         → top_company
Industry        → top_industry
Seniority       → top_seniority
```

**CAPTION sheet** — read full cell text → `final_caption`

**GEMINI PROMPT sheet** — read full cell text → `final_gemini_prompt`
Detect variant from prompt text: if "Paradox-Led" or section order matches Variant A
→ `gemini_variant = A`; if "Scene-Led" or section order matches Variant B →
`gemini_variant = B`; else → `gemini_variant = unknown`

### Step 3 — Read pipeline decisions

Read existing week files for this slug:

| Field | Source | Extraction |
|---|---|---|
| `hook_type` | `message-commit.md` | `hook_type:` field |
| `hook_number` | `message-commit.md` | Which of 1–10 was selected |
| `hero_number` | `message-commit.md` | `hero_number:` field |
| `topic_type` | `research.md` | `topic_type:` field |
| `layout` | `research.md` | `recommended_layout:` field |
| `illustration_style` | `research.md` | `illustration_style:` field |
| `section_count` | `gemini-prompt.md` | Count of `1:`, `2:`, `3:` lines in Variant A block |

### Step 4 — Calculate derived metrics

```
engagement_rate     = (reactions + comments + reposts + saves + sends) / impressions × 100
reach_efficiency    = members_reached / impressions × 100
save_rate           = saves / members_reached × 100
follower_conversion = followers_gained / members_reached × 100
composite_score     = saves × 3 + reposts × 2 + engagement_rate × 1
```

Round all to 2 decimal places.

### Step 5 — Write `analytics.md`

Path: `data/{YYYY-W##}/{slug}/analytics.md`

Structure:
```markdown
# Analytics — [slug]

## Metadata
Week: [YYYY-W##]
Slug: [slug]
Post date: [post_date]
Publish time: [publish_time]
Post URL: [post_url]

## Pipeline Decisions
Topic type: [topic_type]
Layout: [layout]
Illustration style: [illustration_style]
Hook type: [hook_type] (Hook [hook_number])
Hero number: [hero_number]
Section count: [section_count]
Gemini variant used: [A / B / unknown]

## Performance Metrics
| Metric | Value |
|---|---|
| Impressions | [n] |
| Members reached | [n] |
| Profile viewers | [n] |
| Followers gained | [n] |
| Reactions | [n] |
| Comments | [n] |
| Reposts | [n] |
| Saves | [n] |
| Sends | [n] |

## Derived Metrics
| Signal | Value |
|---|---|
| Engagement rate | [n]% |
| Reach efficiency | [n]% |
| Save rate | [n]% |
| Follower conversion | [n]% |
| Composite score | [n] |

## Audience Demographics (Top)
| Category | Value | % |
|---|---|---|
| Seniority | [top_seniority] | [%] |
| Industry | [top_industry] | [%] |
| Job title | [top_job_title] | [%] |
| Company size | [top_company_size] | [%] |
| Company | [top_company] | [%] |
| Location | [top_location] | [%] |

## Final Caption (as published)
[final_caption full text]

## Final Gemini Prompt (as used)
[final_gemini_prompt full text]
```

### Step 6 — Append row to `analytics-log.csv`

Path: `data/analytics-log.csv`
Create file with header row if it does not exist.

**Column order (30 columns)**:
```
week, slug, post_date, publish_time, post_url,
topic_type, hook_type, hook_number, hero_number,
layout, illustration_style, section_count, gemini_variant,
impressions, members_reached, profile_viewers, followers_gained,
reactions, comments, reposts, saves, sends,
engagement_rate, reach_efficiency, save_rate, follower_conversion,
composite_score,
top_seniority, top_industry, top_company_size
```

### Step 7 — Confirm output
```
✅ Analytics logged — [slug] / [week]
   analytics.md written
   analytics-log.csv → [N] rows total
   Composite score: [N] | Reach efficiency: [N]% | Save rate: [N]%
```

### Error handling
- Missing sheet (CAPTION or GEMINI PROMPT): warn and continue — write `[not provided]`
  in analytics.md; omit from CSV columns `final_caption` / `gemini_variant`
- Missing pipeline file: warn which file is missing, fill field as `unknown`
- Numeric parsing failure (e.g. "55,142" with comma): strip commas before casting to int

---

## Component 2 — `pattern-synthesizer` Extension

**Trigger**: unchanged — 4+ weeks of data, run after `/retrospective`
**Write target**: unchanged — `memory/style-guide-learned.md`

### Addition 1 — New data source in Step 1

After existing reads, add:
```
- Read data/analytics-log.csv if it exists
- If CSV exists and has ≥4 rows: use CSV as primary numeric source
- If CSV does not exist: fall back to data/*/performance.md as today
```

The CSV supersedes `performance.md` for numeric pattern analysis. `performance.md`
remains as the human-readable per-post record.

### Addition 2 — Four new analysis dimensions in Step 2

**Reach efficiency** (minimum 4 posts):
- Group by topic_type → average reach_efficiency per type
- Signal: which topic types earn organic reach vs. inflated impression counts?
- Threshold for Confirmed Effective: avg reach_efficiency ≥ 70% across 3+ posts

**Save rate** (minimum 4 posts):
- Group by hook_type → average save_rate per type
- Signal: which hook types produce content audiences keep as reference?
- Threshold for Confirmed Effective: avg save_rate ≥ 1% across 3+ posts

**Audience seniority resonance** (minimum 4 posts):
- Group by topic_type + hook_type → top_seniority distribution
- Signal: which content combinations drive Director/VP/Senior vs. Entry engagement?
- Write as observation, not threshold-gated (qualitative signal)

**Gemini variant performance** (minimum 6 posts):
- Group by gemini_variant (A / B) → average composite_score per variant
- Signal: does Paradox-Led or Scene-Led narrative produce stronger engagement?
- Minimum 3 posts per variant before drawing conclusion

### Addition 3 — Two new tables in `style-guide-learned.md`

Append after existing tables:

```markdown
## Audience Demographics Patterns
| Topic type | Top seniority | Top industry | Posts |
|---|---|---|---|
| [type] | [seniority] | [industry] | [n] |

## Reach & Engagement Efficiency
| Hook type | Avg reach_eff | Avg save_rate | Avg composite | Posts |
|---|---|---|---|---|
| [hook] | [n]% | [n]% | [n] | [n] |
```

Update trigger for these tables: 4+ rows in analytics-log.csv (not 4 feedback-log
entries — the CSV is the source of truth for these dimensions).

---

## Pipeline Position

```
Stage 0  Scout          → topic-scout.md
Stage 1  Research       → research.md
Stage 2  Message Commit → message-commit.md        [CG2]
Stage 3  Content        → content.md
Stage 4  Gemini Prompt  → gemini-prompt.md
── post manually on LinkedIn ──────────────────
Stage 5  Analytics      → analytics.md
                        → analytics-log.csv (append)
── 7 days later ────────────────────────────────
         Retrospective  → performance.md (qualitative + 4 metrics)
── 4+ weeks of data ────────────────────────────
         Pattern Synthesizer → style-guide-learned.md (updated)
```

---

## Out of Scope (deferred)

- **Caption diff comparison** (draft vs. final): deferred to W18+ when 10+ posts exist.
  The `pattern-synthesizer` is the correct agent for this — not `/analytics`.
  Data is captured now (final_caption stored in analytics.md) so comparison is possible
  retroactively once the feature is built.

- **Batch analytics** (multiple posts in one session): current design is one post per
  run. Revisit if workflow friction becomes apparent after 4 weeks.

- **Automated Excel file detection by slug**: current design uses fuzzy filename match.
  If naming conventions diverge, revisit with an explicit `--file` flag.

---

## Files Created / Modified

| Action | File |
|---|---|
| Create | `.claude/skills/analytics/SKILL.md` |
| Create | `data/analytics-log.csv` (on first run) |
| Create | `data/{week}/{slug}/analytics.md` (per post) |
| Modify | `.claude/agents/pattern-synthesizer.md` |
| Modify | `memory/style-guide-learned.md` (new tables added by agent at runtime) |
