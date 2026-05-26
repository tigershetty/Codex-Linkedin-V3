---
name: retrospective-performance
description: Use when the user runs /retrospective [slug], typically 7 days after publishing. Updates performance.md and recently-used-sources.md to close the Scout feedback loop.
---

# Retrospective Skill — Infographic Content Engine v1

## Purpose
Capture post-publication performance data 7 days after publishing. Write a `performance.md` record to the topic folder. Update `data/recently-used-sources.md`. Scout reads this data when scoring next week's topic candidates — high-performing topic types and companies are up-ranked.

## Invoke
```
/retrospective [topic-slug]
```

Run 7 days after the LinkedIn post goes live.

## Prerequisites
- `data/{week}/{topic-slug}/gemini-prompt.md` must exist
- User must provide 4 LinkedIn metrics (see input prompt below)

## Output
```
data/{YYYY-W##}/{topic-slug}/performance.md
data/recently-used-sources.md  (updated)
```

---

## Input Prompt (presented to user)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 RETROSPECTIVE — ENTER PERFORMANCE DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Topic: [topic-slug]
Week: [YYYY-W##]

Please provide 4 metrics from the LinkedIn post analytics:

1. Impressions: ___
2. Engagement rate: ___% (Reactions + Comments + Reposts + Clicks / Impressions)
3. Saves: ___
4. Reposts: ___

Optional:
5. LinkedIn post URL: ___
6. Comments count: ___
7. Reactions count: ___
8. Format used: [Single image / Document Post]

Enter metrics to generate performance record.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## performance.md Structure

```markdown
# Performance Record — [topic-slug]

## Metadata
Week: [YYYY-W##]
Published: [date if known]
Slug: [topic-slug]
Topic type: [from infographic-copy.md]
Layout used: [from infographic-copy.md]
Format: [Single image 2048×2048 / Document Post / Tall Scroll]
Illustration style: [Style A / Style B]
LinkedIn URL: [if provided]

## Metrics (at 7 days)
| Metric | Value |
|---|---|
| Impressions | [N] |
| Engagement rate | [N]% |
| Saves | [N] |
| Reposts | [N] |
| Comments | [N if provided] |
| Reactions | [N if provided] |

## Performance Score
Composite score for Scout up-ranking (saves × 3 + reposts × 2 + engagement_rate × 1):
**Score: [N]**

Benchmark:
- Saves ≥25: High save performance → up-rank this topic type
- Reposts ≥10: High share performance → up-rank this company/topic
- Engagement ≥4%: Above LinkedIn average for this content type
- Score ≥100: Top performance → strongly up-rank

## Scout Signal
**Topic type performance**: [topic_type] → [High / Average / Below average] (score: [N] vs historical avg: [N if available])
**Anchor case performance**: "[Company name]" posts → [trend if multiple data points]
**Layout performance**: [layout name] → [signal]
**Format signal**: [Single image / Document Post] → [engagement delta if Document Post available]

## Sources Used (Week Recap)
[List of organizations cited in this post — for recently-used-sources.md tracking]
1. [Organisation, Tier, Week]
2. [Organisation, Tier, Week]
...

## Notes
[Any contextual notes: post was boosted / organic only / unusual external event / topic was time-sensitive etc.]
```

---

## Update recently-used-sources.md

After writing performance.md, update `data/recently-used-sources.md`:

1. Read existing file (create if it doesn't exist)
2. Add current week's sources to the log
3. Remove entries older than 4 weeks
4. Write updated file

**recently-used-sources.md format**:
```markdown
# Recently Used Sources Log
Last updated: [YYYY-W##]

| Week | Organisation | Times Used (4-week window) |
|---|---|---|
| 2026-W08 | McKinsey | 2 |
| 2026-W08 | BCG | 1 |
| 2026-W07 | MIT CTL | 1 |
...

## Over-use flags (≥3 times in 4 weeks):
- [Organisation] — used [N] times. De-prioritize as first source next 2 weeks.
```

---

## Scout Integration Rules

Scout reads all `performance.md` files in `data/*/` when generating topic candidates. The composite score influences candidate ranking:

| Score | Scout Action |
|---|---|
| ≥150 | Strongly up-rank this topic type. Note: "[Type] posts average 150+ score." |
| 100-149 | Up-rank this topic type. |
| 60-99 | No adjustment. Note as average. |
| <60 | Down-rank this topic type for the next 2 weeks. |

**Company pivot special rule**: If any Company Strategic Pivot post scores ≥100, increase the Company Pivot signal domain weight for the next 4 weeks. The Maersk post benchmark (30K impressions, 42 saves, 18 reposts) = performance score ~172 → strongly up-rank.

---

## 48-Hour Replay Prompt Reminder

At the start of the retrospective, remind the user:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 REPLAY PROMPT REMINDER (if not yet used)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The 48-Hour Replay Prompt from research.md was:
"[replay prompt text]"

If you haven't used this yet, post it now to re-activate the post in the algorithm feed.
This works up to 72 hours after publishing (diminishing returns after that).
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Quality Contract

The retrospective is a lightweight 5-minute process. Its value is in the data accumulation — 4 weeks of performance records give Scout enough signal to meaningfully adjust topic and source selection. Without this data, Scout operates blind on historical performance.
