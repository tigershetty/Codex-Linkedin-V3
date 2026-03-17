# Analytics Feedback Loop — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a `/analytics [slug]` skill that reads a 4-sheet LinkedIn Excel export and writes `analytics.md` + `analytics-log.csv`, then extend `pattern-synthesizer` to read the CSV and surface four new analysis dimensions.

**Architecture:** New skill reads Excel via Python/openpyxl, pulls pipeline decisions from existing week files, derives 5 metrics, and writes two outputs. Pattern-synthesizer gains a new data source (CSV) and two new output tables in `style-guide-learned.md`. No diff comparison at this stage — pure data capture.

**Tech Stack:** Python 3 + openpyxl (already installed), Markdown skill files, CSV

**Design doc:** `docs/plans/2026-03-03-analytics-feedback-loop-design.md`

---

## Task 1: Create `/analytics` skill skeleton

**Files:**
- Create: `.claude/skills/analytics/SKILL.md`

**Step 1: Define expected output (validation fixture)**

Before writing anything, write down what a correct run on Maersk should produce.
Open `LinkedIn Analytics/Infographics/Analytics/Maersk - Post Analytics.xlsx` and
confirm these values will appear in the output:

```
impressions:      55142
members_reached:  37264
followers_gained: 114
saves:            63
reposts:          30
engagement_rate:  ≈ 0.86%   (361+36+30+63+27 / 55142 × 100)
reach_efficiency: ≈ 67.59%  (37264 / 55142 × 100)
save_rate:        ≈ 0.17%   (63 / 37264 × 100)
composite_score:  ≈ 256.86  (63×3 + 30×2 + 0.86)
```

Keep these numbers visible. They are your pass/fail criteria for Task 3.

**Step 2: Write the skill header block**

Create `.claude/skills/analytics/SKILL.md` with the frontmatter and Purpose section:

```markdown
---
name: analytics
description: Use when the user runs /analytics [slug], after a LinkedIn post is live
  and the Excel analytics file is prepared. Reads 4-sheet Excel (PERFORMANCE,
  TOP DEMOGRAPHICS, CAPTION, GEMINI PROMPT), pulls pipeline decisions from existing
  week files, writes analytics.md and appends analytics-log.csv.
---

# Analytics Skill — Infographic Content Engine v1

## Purpose
Capture full post-publish data for the Shetty's Desk learning layer.
Reads the LinkedIn analytics Excel (4 sheets), derives 5 composite metrics,
and writes two outputs: a per-post analytics.md record and a row in the master
analytics-log.csv correlation table.

## Invoke
/analytics [topic-slug]

## Prerequisites
- LinkedIn analytics Excel file present in:
  LinkedIn Analytics/Infographics/Analytics/
- Excel must have 4 sheets: PERFORMANCE, TOP DEMOGRAPHICS, CAPTION, GEMINI PROMPT
- data/{week}/{slug}/message-commit.md must exist
- data/{week}/{slug}/research.md must exist
- data/{week}/{slug}/gemini-prompt.md must exist

## Output
data/{YYYY-W##}/{slug}/analytics.md
data/analytics-log.csv  (appended)
```

**Step 3: Commit skeleton**

```bash
git add .claude/skills/analytics/SKILL.md
git commit -m "feat: add analytics skill skeleton"
```

---

## Task 2: Write Step 1 — Excel file finder

**Files:**
- Modify: `.claude/skills/analytics/SKILL.md` — append Step 1 section

**Step 1: Write the Step 1 block**

Append to SKILL.md:

```markdown
---

## Step 1 — Find Excel File

Run this Python snippet to list candidates:

```python
import glob
files = glob.glob("LinkedIn Analytics/Infographics/Analytics/*.xlsx")
for f in files:
    print(f)
```

Match the slug to the filename (case-insensitive, partial match).
Examples:
- slug: maersk-container-pivot → matches "Maersk - Post Analytics.xlsx"
- slug: zara-supply-chain → matches "Zara - Post Analytics.xlsx"
- slug: hormuz-supply-chain-shock → ask user: no obvious match

If exactly one match: proceed silently.
If multiple matches: list them and ask "Which file for [slug]?"
If zero matches: print the expected path pattern and stop.
```

**Step 2: Verify logic covers all 4 existing files**

Check each existing file name manually:
- `Maersk - Post Analytics.xlsx` → slug fragment "maersk" matches ✓
- `Zara - Post Analytics.xlsx` → slug fragment "zara" matches ✓
- `Nike - Post Analytics.xlsx` → slug fragment "nike" matches ✓
- `Dabbawalas - Post Analytics.xlsx` → slug fragment "dabbawala" matches ✓

**Step 3: Commit**

```bash
git add .claude/skills/analytics/SKILL.md
git commit -m "feat: analytics skill — Step 1 Excel file finder"
```

---

## Task 3: Write Step 2 — Excel reader (all 4 sheets)

**Files:**
- Modify: `.claude/skills/analytics/SKILL.md` — append Step 2 section

**Step 1: Write the Step 2 block**

Append to SKILL.md. This is the core Python extraction block:

```markdown
---

## Step 2 — Read Excel (4 Sheets)

Run the following Python to extract all data. Strip commas from numeric strings
before casting (LinkedIn formats "55,142" not "55142").

```python
import openpyxl

def clean_int(val):
    if val is None:
        return 0
    return int(str(val).replace(",", "").strip())

wb = openpyxl.load_workbook(excel_path)

# --- PERFORMANCE sheet ---
ws_perf = wb["PERFORMANCE"]
perf = {row[0]: row[1] for row in ws_perf.iter_rows(values_only=True) if row[0]}

post_url          = perf.get("Post URL", "")
post_date         = perf.get("Post Date", "")
publish_time      = perf.get("Post Publish Time", "")
impressions       = clean_int(perf.get("Impressions"))
members_reached   = clean_int(perf.get("Members reached"))
profile_viewers   = clean_int(perf.get("Profile viewers from this post"))
followers_gained  = clean_int(perf.get("Followers gained from this post"))
reactions         = clean_int(perf.get("Reactions"))
comments          = clean_int(perf.get("Comments"))
reposts           = clean_int(perf.get("Reposts"))
saves             = clean_int(perf.get("Saves"))
sends             = clean_int(perf.get("Sends on LinkedIn"))

# --- TOP DEMOGRAPHICS sheet ---
ws_demo = wb["TOP DEMOGRAPHICS"]
demo = {}
current_cat = None
for row in ws_demo.iter_rows(values_only=True):
    cat, val, pct = row[0], row[1], row[2]
    if cat and val is None:
        current_cat = cat
    elif current_cat and val and current_cat not in demo:
        demo[current_cat] = (val, round(float(pct) * 100, 1) if pct else None)

top_company_size = demo.get("Company size", ("unknown", None))
top_job_title    = demo.get("Job title", ("unknown", None))
top_location     = demo.get("Location", ("unknown", None))
top_company      = demo.get("Company", ("unknown", None))
top_industry     = demo.get("Industry", ("unknown", None))
top_seniority    = demo.get("Seniority", ("unknown", None))

# --- CAPTION sheet ---
ws_cap = wb["CAPTION"]
final_caption = "\n".join(
    str(row[0]) for row in ws_cap.iter_rows(values_only=True)
    if row[0] is not None
)

# --- GEMINI PROMPT sheet ---
ws_gem = wb["GEMINI PROMPT"]
final_gemini_prompt = "\n".join(
    str(row[0]) for row in ws_gem.iter_rows(values_only=True)
    if row[0] is not None
)

# Detect variant (A = Paradox-Led, B = Scene-Led)
if "Paradox-Led" in final_gemini_prompt or "170 ships" not in final_gemini_prompt[:200]:
    gemini_variant = "A"
elif "Scene-Led" in final_gemini_prompt or "170 ships" in final_gemini_prompt[:200]:
    gemini_variant = "B"
else:
    gemini_variant = "unknown"
```

Error handling:
- If sheet name not found: warn "Sheet [NAME] not found in [file]. Add it and re-run."
  Write "[not provided]" for that field. Continue.
- If CAPTION or GEMINI PROMPT missing: warn but continue. Mark gemini_variant = "unknown".
```

**Step 2: Verify extraction against Maersk fixture**

After writing the block, mentally trace through Maersk data:
- `perf.get("Impressions")` → "55,142" → `clean_int` → 55142 ✓
- `perf.get("Saves")` → "63" → 63 ✓
- TOP DEMOGRAPHICS first "Seniority" row → "Senior", 34% ✓
- CAPTION sheet → full caption text ✓

**Step 3: Commit**

```bash
git add .claude/skills/analytics/SKILL.md
git commit -m "feat: analytics skill — Step 2 Excel reader (4 sheets)"
```

---

## Task 4: Write Step 3 — Pipeline decision reader

**Files:**
- Modify: `.claude/skills/analytics/SKILL.md` — append Step 3 section

**Step 1: Identify the week folder**

The skill must locate the correct `data/{YYYY-W##}/{slug}/` folder.
Use Glob: `data/*/{slug}/message-commit.md` — take the most recent match.

**Step 2: Write the Step 3 block**

Append to SKILL.md:

```markdown
---

## Step 3 — Read Pipeline Decisions

Use the Glob tool to find the week folder:
Pattern: data/*/{slug}/message-commit.md
Take the most recent result. Extract week from the path.

Read message-commit.md:
- hook_type: look for line starting with "hook_type:" or "**Hook type**"
- hook_number: look for "Selected hook:" or "Hook [N]"
- hero_number: look for "hero_number:" or "**Hero number**"

Read research.md:
- topic_type: look for "topic_type:" field in the ```  block
- layout: look for "recommended_layout:" field
- illustration_style: look for "illustration_style:" field

Read gemini-prompt.md:
- section_count: count lines matching pattern "^[123]:" in the Variant A block
  (between "## Variant A" and "## Variant B")

If any file is missing: set affected fields to "unknown", print a warning,
and continue — do not stop the skill.
```

**Step 3: Commit**

```bash
git add .claude/skills/analytics/SKILL.md
git commit -m "feat: analytics skill — Step 3 pipeline decision reader"
```

---

## Task 5: Write Steps 4–7 — Metrics, analytics.md, CSV, confirm

**Files:**
- Modify: `.claude/skills/analytics/SKILL.md` — append Steps 4–7

**Step 1: Write the derived metrics block (Step 4)**

Append:

```markdown
---

## Step 4 — Calculate Derived Metrics

```python
def safe_div(a, b, pct=True):
    if b == 0:
        return 0.0
    result = a / b
    return round(result * 100, 2) if pct else round(result, 2)

engagement_rate     = safe_div(reactions + comments + reposts + saves + sends, impressions)
reach_efficiency    = safe_div(members_reached, impressions)
save_rate           = safe_div(saves, members_reached)
follower_conversion = safe_div(followers_gained, members_reached)
composite_score     = round(saves * 3 + reposts * 2 + engagement_rate * 1, 2)
```
```

**Step 2: Write analytics.md writer (Step 5)**

Append the full analytics.md template block from the design doc (Section Component 1,
Step 5). Use exact field names. Wrap final_caption and final_gemini_prompt in their
own sections at the end of the file.

**Step 3: Write CSV append logic (Step 6)**

Append:

```markdown
---

## Step 6 — Append Row to analytics-log.csv

```python
import csv, os

csv_path = "data/analytics-log.csv"
headers = [
    "week", "slug", "post_date", "publish_time", "post_url",
    "topic_type", "hook_type", "hook_number", "hero_number",
    "layout", "illustration_style", "section_count", "gemini_variant",
    "impressions", "members_reached", "profile_viewers", "followers_gained",
    "reactions", "comments", "reposts", "saves", "sends",
    "engagement_rate", "reach_efficiency", "save_rate",
    "follower_conversion", "composite_score",
    "top_seniority", "top_industry", "top_company_size"
]

write_header = not os.path.exists(csv_path)
with open(csv_path, "a", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=headers)
    if write_header:
        writer.writeheader()
    writer.writerow({
        "week": week, "slug": slug, "post_date": post_date,
        "publish_time": publish_time, "post_url": post_url,
        "topic_type": topic_type, "hook_type": hook_type,
        "hook_number": hook_number, "hero_number": hero_number,
        "layout": layout, "illustration_style": illustration_style,
        "section_count": section_count, "gemini_variant": gemini_variant,
        "impressions": impressions, "members_reached": members_reached,
        "profile_viewers": profile_viewers, "followers_gained": followers_gained,
        "reactions": reactions, "comments": comments, "reposts": reposts,
        "saves": saves, "sends": sends,
        "engagement_rate": engagement_rate, "reach_efficiency": reach_efficiency,
        "save_rate": save_rate, "follower_conversion": follower_conversion,
        "composite_score": composite_score,
        "top_seniority": top_seniority[0], "top_industry": top_industry[0],
        "top_company_size": top_company_size[0]
    })
```
```

**Step 4: Write confirm block (Step 7)**

Append:

```markdown
---

## Step 7 — Confirm

Print:
✅ Analytics logged — [slug] / [week]
   analytics.md written to data/[week]/[slug]/analytics.md
   analytics-log.csv → [N] rows total
   Composite score: [composite_score] | Reach efficiency: [reach_efficiency]% | Save rate: [save_rate]%

## Token Budget
~2K tokens per run. Reads 4 Excel sheets + 3 pipeline files. Writes 2 files.
```

**Step 5: Commit**

```bash
git add .claude/skills/analytics/SKILL.md
git commit -m "feat: analytics skill — Steps 4-7 metrics, output, CSV, confirm"
```

---

## Task 6: Validate skill on Maersk (live test)

**Files:**
- Read: `LinkedIn Analytics/Infographics/Analytics/Maersk - Post Analytics.xlsx`
- Verify: `data/2026-W??/maersk-*/analytics.md` (locate the correct week folder)
- Verify: `data/analytics-log.csv`

**Step 1: Run the skill**

```
/analytics [maersk-slug]
```

Replace [maersk-slug] with the actual Maersk post slug from `data/` folder.

**Step 2: Check analytics.md against fixture values**

Open the generated analytics.md. Verify:
```
impressions:      55142       ✓ / ✗
members_reached:  37264       ✓ / ✗
followers_gained: 114         ✓ / ✗
saves:            63          ✓ / ✗
reposts:          30          ✓ / ✗
composite_score:  ≈256.86     ✓ / ✗
reach_efficiency: ≈67.59%     ✓ / ✗
top_seniority:    Senior      ✓ / ✗
```

If any value fails: fix the extraction logic in SKILL.md. Re-run. Do not proceed
to Task 7 until all fixture values pass.

**Step 3: Check analytics-log.csv**

Open `data/analytics-log.csv`. Confirm:
- Header row exists with all 30 columns in correct order
- Row 1 contains Maersk data with correct numeric values
- No empty cells in numeric columns

**Step 4: Commit**

```bash
git add data/analytics-log.csv
git add data/*/maersk*/analytics.md
git commit -m "feat: analytics skill validated on Maersk — fixture values pass"
```

---

## Task 7: Backfill remaining 3 posts

**Files:**
- Run analytics on: Zara, Nike, Dabbawalas

**Step 1: Run analytics on each post**

```
/analytics [zara-slug]
/analytics [nike-slug]
/analytics [dabbawala-slug]
```

**Step 2: Verify CSV has 4 rows**

```python
import csv
with open("data/analytics-log.csv") as f:
    rows = list(csv.DictReader(f))
    print(f"Rows: {len(rows)}")  # Expected: 4
    for r in rows:
        print(r["slug"], r["impressions"], r["composite_score"])
```

Expected output:
```
maersk-[slug]      55142   ~256
zara-[slug]        731     ~2
nike-[slug]        565     ~0
dabbawala-[slug]   335     ~3
```

**Step 3: Commit**

```bash
git add data/analytics-log.csv data/*/analytics.md
git commit -m "feat: backfill analytics for Zara, Nike, Dabbawalas — 4 rows in CSV"
```

---

## Task 8: Update `pattern-synthesizer` agent

**Files:**
- Modify: `.claude/agents/pattern-synthesizer.md`

**Step 1: Add CSV data source to Step 1**

After the existing "Read `memory/feedback-log.md`" and "Glob `data/*/performance.md`"
lines, insert:

```markdown
- Read `data/analytics-log.csv` if it exists
  - If CSV has ≥4 rows: use as primary numeric data source for all metric analysis
  - If CSV has <4 rows or does not exist: fall back to data/*/performance.md
```

**Step 2: Add 4 new analysis dimensions to Step 2**

After the existing three dimensions (Gemini prompt formats, Hook type, Topic category),
append:

```markdown
**Reach efficiency** (requires ≥4 CSV rows):
- Group analytics-log.csv rows by topic_type
- Calculate average reach_efficiency per group
- Identify: which topic types earn organic reach vs. inflated impression counts?
- Threshold for Confirmed Effective: avg reach_efficiency ≥ 70% across 3+ posts

**Save rate** (requires ≥4 CSV rows):
- Group analytics-log.csv rows by hook_type
- Calculate average save_rate per group
- Identify: which hook types produce content audiences keep as reference?
- Threshold for Confirmed Effective: avg save_rate ≥ 1% across 3+ posts

**Audience seniority resonance** (requires ≥4 CSV rows):
- For each topic_type + hook_type combination, note top_seniority value
- Identify: which content combinations drive Director/VP/Senior vs. Entry engagement?
- Write as observation only — no threshold gate (qualitative signal, not numeric)

**Gemini variant performance** (requires ≥6 CSV rows, ≥3 per variant):
- Group by gemini_variant (A / B)
- Calculate average composite_score per variant
- Identify: does Paradox-Led or Scene-Led narrative produce stronger engagement?
- Skip if fewer than 3 posts per variant — note "Insufficient data for variant comparison"
```

**Step 3: Add 2 new output tables to Step 3**

After the existing table writes, append:

```markdown
Write two new tables to memory/style-guide-learned.md if ≥4 CSV rows exist:

## Audience Demographics Patterns
| Topic type | Top seniority | Top industry | Posts |
|---|---|---|---|
| [populate from CSV] |

## Reach & Engagement Efficiency
| Hook type | Avg reach_eff | Avg save_rate | Avg composite | Posts |
|---|---|---|---|---|
| [populate from CSV] |

Only write a row when the group has ≥2 data points.
Never delete existing rows — only add or update.
```

**Step 4: Commit**

```bash
git add .claude/agents/pattern-synthesizer.md
git commit -m "feat: extend pattern-synthesizer to read analytics-log.csv — 4 new dimensions"
```

---

## Task 9: Update pipeline orchestrator

**Files:**
- Modify: `.claude/skills/infographic/SKILL.md`

**Step 1: Add Stage 5 to the stage detection table**

Find the stage detection table. Add one row:

```markdown
| All pipeline files present + post is live | Stage 5 — Analytics |
```

**Step 2: Add Stage 5 section**

After the existing Stage 4 section, add:

```markdown
---

## Stage 5 — Analytics (post-publish)

Run after the LinkedIn post is live and the Excel file is prepared
(LinkedIn export + CAPTION and GEMINI PROMPT sheets added).

Use the analytics skill (`/analytics [slug]`).

Reads Excel (4 sheets), extracts pipeline decisions, calculates derived metrics,
writes analytics.md and appends analytics-log.csv.
No gate — runs to completion automatically.
Print: "✅ Stage 5 complete — analytics.md written. [N] rows in analytics-log.csv."
```

**Step 3: Update completion output**

In the Completion Output block, add after the existing file list:

```markdown
Post-publish (after LinkedIn):
  7. Run /analytics [slug] once Excel file is prepared
     → writes data/[week]/[slug]/analytics.md
     → appends data/analytics-log.csv
```

**Step 4: Commit**

```bash
git add .claude/skills/infographic/SKILL.md
git commit -m "feat: add Stage 5 analytics to pipeline orchestrator"
```

---

## Task 10: Final verification

**Step 1: Run pattern-synthesizer**

```
/retrospective [any-slug]  ← run to trigger pattern-synthesizer check
```

Or invoke pattern-synthesizer directly and confirm it reads analytics-log.csv.

**Step 2: Check style-guide-learned.md**

Open `memory/style-guide-learned.md`. Confirm:
- "Audience Demographics Patterns" table exists (even if sparse with 4 posts)
- "Reach & Engagement Efficiency" table exists
- Maersk data is visible in the patterns (it will dominate given its scale)
- No existing tables were deleted or corrupted

**Step 3: Verify Gemini variant field**

Check the 4 analytics.md files. Confirm `gemini_variant` is populated for each.
If all are "unknown": the variant detection logic in Step 2 needs adjustment —
update the detection heuristic in SKILL.md.

**Step 4: Final commit**

```bash
git add memory/style-guide-learned.md
git commit -m "feat: analytics feedback loop complete — 4 posts backfilled, pattern-synthesizer extended"
```

---

## Execution Order Summary

```
Task 1  → analytics SKILL.md skeleton
Task 2  → Step 1: Excel file finder
Task 3  → Step 2: Excel reader (4 sheets)
Task 4  → Step 3: pipeline decision reader
Task 5  → Steps 4-7: metrics + outputs
Task 6  → Live validation on Maersk ← DO NOT skip
Task 7  → Backfill Zara, Nike, Dabbawalas
Task 8  → Extend pattern-synthesizer
Task 9  → Update orchestrator
Task 10 → Final verification
```

Total: ~10 tasks, ~45–60 minutes. Do not proceed past Task 6 until Maersk fixture
values pass exactly.
