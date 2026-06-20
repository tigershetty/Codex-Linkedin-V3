---
name: analytics
description: Use when the user runs /analytics [slug], after a LinkedIn post is live and its
  analytics Excel export is saved. Reads the LinkedIn Excel (PERFORMANCE + TOP DEMOGRAPHICS),
  pulls the creative decisions from the post file (101-copy.md or ai-for-sc-[slug].md), derives
  the performance metrics, writes analytics.md, and appends a row to analytics-log.csv.
---

# Analytics Skill — Shetty's Desk

## Purpose
Capture post-publish performance for the learning loop. Works for both active pipelines
(Supply Chain 101 and AI for Supply Chain). Reads the LinkedIn analytics Excel, derives the
metrics, and writes two outputs: a per-post `analytics.md` and a row in `data/analytics-log.csv`.

## Invoke
```
/analytics [topic-slug]
```

## Prerequisites
- LinkedIn analytics Excel saved in `data/analytics-exports/` (create the folder if needed).
  Sheets used: **PERFORMANCE** and **TOP DEMOGRAPHICS** (a **Caption** sheet is read if present).
- The post file exists: `data/{week}/{slug}/101-copy.md` **or** `data/{week}/{slug}/ai-for-sc-{slug}.md`.

## Output
```
data/{YYYY-W##}/{slug}/analytics.md
data/analytics-log.csv   (appended)
```

---

## Step 1 — Find the post file + Excel

Locate the post file (this also tells you the week and the content type):
```python
import glob
hits  = glob.glob(f"data/*/{slug}/101-copy.md") + glob.glob(f"data/*/{slug}/ai-for-sc-{slug}.md")
post_path    = hits[0]
week         = post_path.split("/")[1]                      # e.g. 2026-W21
content_type = "101" if post_path.endswith("101-copy.md") else "ai-for-sc"
```
If no post file: print the expected paths and stop.

Find the Excel by matching the slug to the filename (case-insensitive, partial match on the first word):
```python
xls = glob.glob("data/analytics-exports/*.xlsx")
```
One match → proceed. Multiple → ask which. Zero → print the expected path and stop.

---

## Step 2 — Read the Excel (PERFORMANCE + TOP DEMOGRAPHICS)

LinkedIn formats numbers like "55,142" — strip commas before casting.
```python
import openpyxl
def clean_int(v): return 0 if v is None else int(str(v).replace(",", "").strip())

wb = openpyxl.load_workbook(excel_path)
perf = {r[0]: r[1] for r in wb["PERFORMANCE"].iter_rows(values_only=True) if r[0]}

post_url         = perf.get("Post URL", "")
post_date        = perf.get("Post Date", "")
impressions      = clean_int(perf.get("Impressions"))
members_reached  = clean_int(perf.get("Members reached"))
profile_viewers  = clean_int(perf.get("Profile viewers from this post"))
followers_gained = clean_int(perf.get("Followers gained from this post"))
reactions        = clean_int(perf.get("Reactions"))
comments         = clean_int(perf.get("Comments"))
reposts          = clean_int(perf.get("Reposts"))
saves            = clean_int(perf.get("Saves"))
sends            = clean_int(perf.get("Sends on LinkedIn"))

# TOP DEMOGRAPHICS: first occurrence of each category = the top entry
demo = {}
for r in wb["TOP DEMOGRAPHICS"].iter_rows(min_row=2, values_only=True):
    cat, val, pct = (r + (None, None, None))[:3]
    if cat and val is not None and cat not in demo:
        demo[cat] = (val, round(float(pct) * 100, 1) if pct else None)
top_seniority = demo.get("Seniority", ("unknown", None))
top_industry  = demo.get("Industry",  ("unknown", None))
top_job_title = demo.get("Job title", ("unknown", None))
top_company_size = demo.get("Company size", ("unknown", None))
```
If a sheet is missing: warn, set its fields to defaults, continue.

---

## Step 3 — Read the creative decisions from the post file

Both `101-copy.md` and `ai-for-sc-{slug}.md` use the same hook block.
```python
text = open(post_path, encoding="utf-8").read()

# hook_type: under "## Selected Hook", the line "**Type**: ..."
import re
m = re.search(r"## Selected Hook.*?\*\*Type\*\*:\s*(.+)", text, re.S)
hook_type = m.group(1).strip() if m else "unknown"

# caption_preview: first non-empty line under "## LinkedIn Caption"
cap = re.search(r"## LinkedIn Caption\s*(.+)", text, re.S)
caption_preview = ""
if cap:
    for line in cap.group(1).splitlines():
        if line.strip():
            caption_preview = line.strip()[:120]
            break
```
Extra context for `analytics.md` (header fields, optional — skip any that are absent):
- **101**: `**Topic**` and `**Episode**`; visual tool = ChatGPT (GPT Image 2).
- **AI for SC**: `**Role**`, `**Tool**`, `**Visual Format**`, `**Hero Statement**`; visual tool = code-render.

---

## Step 4 — Derive metrics
```python
def pct(a, b): return 0.0 if b == 0 else round(a / b * 100, 2)
engagement_rate     = pct(reactions + comments + reposts + saves + sends, impressions)
reach_efficiency    = pct(members_reached, impressions)
save_rate           = pct(saves, members_reached)
follower_conversion = pct(followers_gained, members_reached)
composite_score     = round(saves * 3 + reposts * 2 + engagement_rate, 2)
```

---

## Step 5 — Write analytics.md

`data/{week}/{slug}/analytics.md`:
```markdown
# Analytics — {slug}

## Metadata
Week: {week} · Content type: {content_type} · Post date: {post_date}
Post URL: {post_url}

## Creative Decisions
Hook type: {hook_type}
[101]      Topic: {topic} · Episode: {episode} · Visual: ChatGPT (GPT Image 2)
[AI for SC] Role: {role} · Tool: {tool} · Visual format: {visual_format} · Visual: code-render

## Performance
| Metric | Value |
|---|---|
| Impressions | {impressions} |
| Members reached | {members_reached} |
| Profile viewers | {profile_viewers} |
| Followers gained | {followers_gained} |
| Reactions / Comments / Reposts | {reactions} / {comments} / {reposts} |
| Saves / Sends | {saves} / {sends} |

## Derived
| Signal | Value |
|---|---|
| Engagement rate | {engagement_rate}% |
| Reach efficiency | {reach_efficiency}% |
| Save rate | {save_rate}% |
| Follower conversion | {follower_conversion}% |
| Composite score | {composite_score} |

## Top Audience
Seniority: {top_seniority} · Industry: {top_industry} · Job title: {top_job_title} · Company size: {top_company_size}
```

---

## Step 6 — Append to analytics-log.csv

Use this **exact** header (matches the existing file — do not change column order):
```python
import csv, os
csv_path = "data/analytics-log.csv"
headers = ["week","slug","post_date","post_url","impressions","members_reached",
           "reactions","comments","reposts","saves","profile_viewers","followers_gained",
           "engagement_rate","save_rate","follower_conversion","composite_score",
           "content_type","hook_type","caption_preview"]
row = {"week":week,"slug":slug,"post_date":post_date,"post_url":post_url,
       "impressions":impressions,"members_reached":members_reached,"reactions":reactions,
       "comments":comments,"reposts":reposts,"saves":saves,"profile_viewers":profile_viewers,
       "followers_gained":followers_gained,"engagement_rate":engagement_rate,"save_rate":save_rate,
       "follower_conversion":follower_conversion,"composite_score":composite_score,
       "content_type":content_type,"hook_type":hook_type,"caption_preview":caption_preview}
write_header = not os.path.exists(csv_path)
with open(csv_path, "a", newline="") as f:
    w = csv.DictWriter(f, fieldnames=headers)
    if write_header: w.writeheader()
    w.writerow(row)
```

---

## Step 7 — Confirm
```
✅ Analytics logged — {slug} / {week} ({content_type})
   analytics.md written · analytics-log.csv → {N} rows
   Save rate: {save_rate}% | Engagement: {engagement_rate}% | Composite: {composite_score}
```

## Token Budget
~2K tokens. Reads 1 Excel + 1 post file. Writes 2 files.
