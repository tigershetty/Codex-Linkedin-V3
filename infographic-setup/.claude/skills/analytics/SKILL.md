---
name: analytics
description: Use when the user runs /analytics [slug], after a LinkedIn post is live
  and the Excel analytics file is prepared. Reads 4-sheet Excel (PERFORMANCE,
  TOP DEMOGRAPHICS, Caption, Gemini Prompt), pulls pipeline decisions from existing
  week files, derives 5 metrics, and writes analytics.md and appends analytics-log.csv.
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
  ../Analytics/Infographics/Analytics/
- Excel must have 4 sheets: PERFORMANCE, TOP DEMOGRAPHICS, Caption, Gemini Prompt
- data/{week}/{slug}/message-commit.md must exist
- data/{week}/{slug}/research.md must exist
- data/{week}/{slug}/gemini-prompt.md must exist

## Output
data/{YYYY-W##}/{slug}/analytics.md
data/analytics-log.csv  (appended)

---

## Step 1 — Find Excel File

Run this Python snippet to list candidates:

```python
import glob
files = glob.glob("../Analytics/Infographics/Analytics/*.xlsx")
for f in files:
    print(f)
```

Match the slug to the filename (case-insensitive, partial match on the first word).
Examples:
- slug: maersk-container-pivot → matches "Maersk - Post Analytics.xlsx"
- slug: zara-supply-chain → matches "Zara - Post Analytics.xlsx"
- slug: hormuz-supply-chain-shock → ask user: no obvious match

If exactly one match: proceed silently.
If multiple matches: list them and ask "Which file for [slug]?"
If zero matches: print the expected path pattern and stop.

Verified against existing files:
- `Maersk - Post Analytics.xlsx` → slug fragment "maersk" matches ✓
- `Zara - Post Analytics.xlsx` → slug fragment "zara" matches ✓
- `Nike - Post Analytics.xlsx` → slug fragment "nike" matches ✓
- `Dabbawalas - Post Analytics.xlsx` → slug fragment "dabbawala" matches ✓

---

## Step 2 — Read Excel (4 Sheets)

Run the following Python to extract all data. Strip commas from numeric strings
before casting (LinkedIn formats "55,142" not "55142"). Sheet names are title case.

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
# Sheet structure: header row, then flat rows (category, value, pct) repeated per entry.
# Collect the first occurrence of each category (= top entry).
ws_demo = wb["TOP DEMOGRAPHICS"]
demo = {}
for row in ws_demo.iter_rows(min_row=2, values_only=True):
    cat, val, pct = row[0], row[1], row[2]
    if cat and val is not None and cat not in demo:
        demo[cat] = (val, round(float(pct) * 100, 1) if pct else None)

top_company_size = demo.get("Company size", ("unknown", None))
top_job_title    = demo.get("Job title", ("unknown", None))
top_location     = demo.get("Location", ("unknown", None))
top_company      = demo.get("Company", ("unknown", None))
top_industry     = demo.get("Industry", ("unknown", None))
top_seniority    = demo.get("Seniority", ("unknown", None))

# --- Caption sheet (title case) ---
ws_cap = wb["Caption"]
final_caption = "\n".join(
    str(row[0]) for row in ws_cap.iter_rows(values_only=True)
    if row[0] is not None
)

# --- Gemini Prompt sheet (title case) ---
ws_gem = wb["Gemini Prompt"]
final_gemini_prompt = "\n".join(
    str(row[0]) for row in ws_gem.iter_rows(values_only=True)
    if row[0] is not None
)

# Detect variant (A = Paradox-Led, B = Scene-Led, v0 = pre-variant, v1 = Task-format single variant)
if "Paradox-Led" in final_gemini_prompt:
    gemini_variant = "A"
elif "Scene-Led" in final_gemini_prompt:
    gemini_variant = "B"
elif final_gemini_prompt.strip().startswith("Create a detailed"):
    gemini_variant = "v0"   # pre-variant single prompt (Maersk era)
elif final_gemini_prompt.strip().startswith("Task:") and "Story premise:" not in final_gemini_prompt:
    gemini_variant = "v1"   # Task+Rules format, single variant (Zara/Nike/Dabbawalas era)
else:
    gemini_variant = "unknown"
```

Error handling:
- If sheet name not found: warn "Sheet [NAME] not found in [file]. Add it and re-run."
  Write "[not provided]" for that field. Continue.
- If Caption or Gemini Prompt missing: warn but continue. Mark gemini_variant = "unknown".

---

## Step 3 — Read Pipeline Decisions

Use the Glob tool to find the week folder:
Pattern: data/*/{slug}/message-commit.md
Take the most recent result. Extract week from the path (e.g. "data/2026-W09/..." → week = "2026-W09").

If any file is missing: set affected fields to "unknown", print a warning, and continue.

### From message-commit.md

**hook_type**: Find the "## Selected Hook" section. Read the line `**Type**: [value]`.
Example: `**Type**: Timeline-Shock` → hook_type = "Timeline-Shock"

**hook_number**: In "## Hook Options — All 10 (reference)", find the numbered line containing
`[hook_type]` in brackets. Extract the number at line start.
Example: `8. [Timeline-Shock]: "..."` → hook_number = 8
If no match: hook_number = "unknown"

**hero_number**: Find the "## Hero Number" section. Read `**Figure**: [value]`.
Example: `**Figure**: 54` → hero_number = "54"

### From research.md

All three fields live inside the fenced ``` block under "## 3. Topic Type + Layout Signal".
Read each field as the text after the colon, stripped of leading/trailing whitespace.

**topic_type**: line starting with `topic_type:`
Example: `topic_type:           Benchmarking / KPI vs threshold` → "Benchmarking / KPI vs threshold"

**layout**: line starting with `recommended_layout:`
Example: `recommended_layout:   Dual Narrative (L13)` → "Dual Narrative (L13)"

**illustration_style**: line starting with `illustration_style:`
Example: `illustration_style:   Style A (Maersk Dense)` → "Style A (Maersk Dense)"

### From gemini-prompt.md

**section_count**: Count `### ` header lines (H3 markdown headers) in the Variant A block only.
The Variant A block runs from "## Variant A" to "## Variant B".
Example: 3 headers (`### Three Decisions...`, `### What the 10-K...`, `### What 54 Turns...`) → section_count = 3

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

---

## Step 5 — Write analytics.md

Path: `data/{week}/{slug}/analytics.md`
Create the slug directory if it does not exist.

```markdown
# Analytics — {slug}

## Metadata
Week: {week}
Slug: {slug}
Post date: {post_date}
Publish time: {publish_time}
Post URL: {post_url}

## Pipeline Decisions
Topic type: {topic_type}
Layout: {layout}
Illustration style: {illustration_style}
Hook type: {hook_type} (Hook {hook_number})
Hero number: {hero_number}
Section count: {section_count}
Gemini variant used: {gemini_variant}

## Performance Metrics
| Metric | Value |
|---|---|
| Impressions | {impressions} |
| Members reached | {members_reached} |
| Profile viewers | {profile_viewers} |
| Followers gained | {followers_gained} |
| Reactions | {reactions} |
| Comments | {comments} |
| Reposts | {reposts} |
| Saves | {saves} |
| Sends | {sends} |

## Derived Metrics
| Signal | Value |
|---|---|
| Engagement rate | {engagement_rate}% |
| Reach efficiency | {reach_efficiency}% |
| Save rate | {save_rate}% |
| Follower conversion | {follower_conversion}% |
| Composite score | {composite_score} |

## Audience Demographics (Top)
| Category | Value | % |
|---|---|---|
| Seniority | {top_seniority[0]} | {top_seniority[1]} |
| Industry | {top_industry[0]} | {top_industry[1]} |
| Job title | {top_job_title[0]} | {top_job_title[1]} |
| Company size | {top_company_size[0]} | {top_company_size[1]} |
| Company | {top_company[0]} | {top_company[1]} |
| Location | {top_location[0]} | {top_location[1]} |

## Final Caption (as published)
{final_caption}

## Final Gemini Prompt (as used)
{final_gemini_prompt}
```

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

---

## Step 7 — Confirm

Print:
```
✅ Analytics logged — {slug} / {week}
   analytics.md written to data/{week}/{slug}/analytics.md
   analytics-log.csv → {N} rows total
   Composite score: {composite_score} | Reach efficiency: {reach_efficiency}% | Save rate: {save_rate}%
```

## Token Budget
~2K tokens per run. Reads 4 Excel sheets + 3 pipeline files. Writes 2 files.
