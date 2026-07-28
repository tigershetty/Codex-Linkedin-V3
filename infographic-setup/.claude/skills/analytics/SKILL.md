---
name: analytics
description: Use after a LinkedIn post, Substack issue, or website artifact is live. Captures standardized Day-7 and Day-30 channel metrics, updates the package analytics.md, and appends a linked snapshot to data/analytics-log.csv.
---

# Analytics Skill — Shetty's Desk

## Purpose

`data/analytics-log.csv` is the single cross-channel performance ledger for LinkedIn, Substack and website outputs. Every row is one content item on one channel at one measurement checkpoint. Related outputs share the same package slug and use explicit content IDs.

This skill supports both active content pipelines and Substack/website distribution. It does not combine unlike channel outcomes into a universal score.

## Invoke

```text
/analytics [slug] [channel] [checkpoint]
```

- `channel`: `linkedin`, `substack`, or `website`
- `checkpoint`: `7` or `30`, measured as days after publication or artifact launch
- If channel or checkpoint is omitted, infer only when one unambiguous source exists; otherwise ask.

## Identity Contract

Use these identifiers before reading metrics:

- `slug`: shared package ID linking research, five LinkedIn slots, a Substack issue and a website artifact.
- `content_id`: stable channel item ID: `{channel}:{YYYY-W##}:{slug}:{sequence}`.
- `linked_content_id`: the direct upstream or downstream item being tested, when applicable.
- `experiment_id`: the weekly experiment from `templates/weekly-signal-scan-template.md`, when applicable.

Never use a URL as the only identifier. Never merge two channel items because they share a headline.

## Sources

### LinkedIn

Preferred source: the private LinkedIn analytics export in `data/analytics-exports/`. Use the `PERFORMANCE` and `TOP DEMOGRAPHICS` sheets and the `Caption` sheet when present.

Capture:

- impressions, members reached, reactions, comments, reposts, saves and sends;
- profile viewers and followers gained;
- audience at publish when recorded;
- post URL and publication date.

Apify may later supply public post URL/activity ID, date, caption, format and public reactions/comments/reposts. It cannot replace private impressions, reach, saves, profile viewers, follower gain or click data.

### Substack

Preferred source: the publication dashboard, captured manually at the standard checkpoint.

Capture:

- issue views and email recipients;
- open rate and link clicks;
- free subscribers gained from the issue;
- unsubscribes, comments and restacks when available;
- subscribers at publish, issue URL and publication date.

Use blank for an unavailable metric. Never convert missing values to zero.

### Website

Preferred source: the site's analytics and explicit artifact events.

Capture:

- unique visitors to the artifact page;
- artifact downloads;
- tool starts and tool completions;
- launch URL and launch date.

An event counts only when its definition is stable. Page views are not downloads; downloads are not completed use.

## Standard Checkpoints

- **Day 7:** first comparison point for distribution and initial conversion.
- **Day 30:** durable reach, repeat discovery and downstream use.

Set `captured_at` to the actual capture timestamp and `snapshot_day` to `7` or `30`. If captured late, preserve the actual timestamp and note the variance. Compare content only at the same checkpoint and within the same channel and format unless the analysis explicitly says otherwise.

## Cross-Channel Ledger Schema

The current CSV begins with a legacy LinkedIn schema. On the first cross-channel append, migrate it to the following superset without deleting or reordering existing rows. Preserve every existing column and value; backfill new fields as blank, except `channel=linkedin` for identifiable historical LinkedIn rows.

### Existing fields retained

```text
week,slug,post_date,post_url,impressions,members_reached,reactions,comments,
reposts,saves,profile_viewers,followers_gained,engagement_rate,save_rate,
follower_conversion,composite_score,content_type,hook_type,caption_preview
```

### Fields appended

```text
channel,content_id,linked_content_id,experiment_id,snapshot_day,captured_at,
audience_at_publish,sends,substack_views,email_recipients,open_rate,link_clicks,
free_subscribers_gained,unsubscribes,restacks,unique_visitors,
artifact_downloads,tool_starts,tool_completions,click_rate,
subscriber_conversion,artifact_conversion,tool_completion_rate,notes
```

Field definitions:

| Field | Definition |
|---|---|
| `slug` | Shared package ID; retained for backward compatibility. |
| `content_id` | Unique channel item ID. |
| `linked_content_id` | Directly linked item whose flow is being tested. |
| `snapshot_day` | Standard checkpoint: 7 or 30. |
| `captured_at` | Actual ISO timestamp of metric capture. |
| `audience_at_publish` | LinkedIn followers or Substack subscribers at publication; blank for website. |
| `substack_views` | Views reported for the issue. |
| `email_recipients` | Delivered/eligible email recipients reported for the issue. |
| `link_clicks` | Issue link clicks; do not infer website visits from this field. |
| `unique_visitors` | Unique visitors to the website artifact page. |
| `artifact_downloads` | Confirmed artifact-download events. |
| `tool_starts` | Confirmed starts of an interactive workflow. |
| `tool_completions` | Confirmed successful completions of that workflow. |

`post_date` and `post_url` remain the publication/launch date and URL for all channels despite their legacy names.

## Derived Metrics

Calculate only when the denominator is available and greater than zero; otherwise leave blank.

```text
LinkedIn engagement rate = (reactions + comments + reposts + saves + sends) / impressions
LinkedIn save rate = saves / members_reached
LinkedIn follower conversion = followers_gained / members_reached
Substack click rate = link_clicks / email_recipients
Substack subscriber conversion = free_subscribers_gained / substack_views
Website artifact conversion = artifact_downloads / unique_visitors
Website tool completion rate = tool_completions / tool_starts
```

Store rates consistently as percentages, matching the existing ledger convention.

`composite_score` is a historical compatibility field only. Leave it blank for new snapshots. It must never rank topics, select formats, compare channels, or act as a production gate.

## Per-Package Analytics File

Update, rather than overwrite, `data/{YYYY-W##}/{slug}/analytics.md`.

Use one section per content item and checkpoint:

```markdown
## {channel} — {content_id} — Day {snapshot_day}

- Captured: {captured_at}
- Published: {post_date}
- URL: {post_url}
- Linked item: {linked_content_id or none}
- Experiment: {experiment_id or none}

| Metric | Value |
|---|---:|
| ... | ... |

### Interpretation
- What happened:
- What the metric can support:
- What it cannot support:
- What to repeat, stop, or test next:
```

Keep the final published caption or issue title as compact context. Do not copy a full Substack article into the analytics file.

## Append Rules

1. Read the current CSV header and all existing rows.
2. If the appended fields are absent, perform a one-time superset migration while preserving all existing data.
3. Reject an append when the tuple `(content_id, snapshot_day)` already exists unless the user explicitly requests a correction.
4. Write unavailable values as blank, never zero.
5. Preserve source precision; do not estimate missing private metrics from public interactions.
6. Append the new row, then verify column count, row count and the written identifiers.

## Decision Rules

- Compare LinkedIn posts against Tiger's recent LinkedIn baseline at the same age and format.
- Compare Substack issues against prior Substack issues at the same checkpoint.
- Compare website artifacts by the same event definitions and observation window.
- Use cross-channel linkage to ask whether discovery produced deeper reading or artifact use; do not add the metrics together.
- A single outlier generates a hypothesis, not a permanent rule.
- Record one next action tied to the weekly experiment.

## Confirm

```text
Analytics logged — {content_id} / Day {snapshot_day}
analytics.md updated · analytics-log.csv verified
Primary channel signal: {metric} = {value}
Next test: {one action}
```

Do not report or celebrate `composite_score`.
