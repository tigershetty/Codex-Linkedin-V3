---
name: feedback-capture
description: Use when Tiger approves a Gemini render, rejects a render, or finishes posting for the week. Captures qualitative feedback into memory/feedback-log.md. Invoked with /feedback [slug] [notes].
---

# Feedback Capture Skill — Infographic Content Engine v1

## Purpose
Record what worked and what didn't for each week's infographic run. Writes a structured entry to `memory/feedback-log.md`. This is the only way the learning layer gets its input — run it within 24 hours of a Gemini render approval or a LinkedIn post going live.

## Invoke
```
/feedback [topic-slug] [optional: brief notes in quotes]
```

Example:
```
/feedback ai-demand-sensing-30-percent-miss "numbered sections worked, caption needs company name"
```

## What This Skill Does

**Step 1: Read context**
- Read `memory/feedback-log.md` to get the current schema
- Find the correct week's data folder: `data/*/[slug]/`
- Read `gemini-prompt.md` to determine which prompt format was used
- Read `message-commit.md` to get hook type used

**Step 2: Ask Tiger three rapid questions (one at a time)**

1. "Gemini render quality — World-class / Approved / Needed iteration / Rejected?"
2. "Caption quality — Strong / Weak opening / Missing context / Needs rewrite?"
3. "Anything specific to note for next week? (enter to skip)"

**Step 3: Write the feedback entry**

Append a new entry to `memory/feedback-log.md` in this format:

```
## [YYYY-W##] — [slug]

**Date logged**: [today]
**Hook type used**: [from message-commit.md]
**Hook performance**: [fill from /retrospective after 7 days]
**Gemini prompt format**: [from gemini-prompt.md — describe in one line]
**Gemini render quality**: [Tiger's answer from Step 2]
**Caption quality**: [Tiger's answer from Step 2]
**Tiger's notes**: [Tiger's answer from Step 2, or "none"]

**What worked**: [infer from render quality + notes]
**What to change**: [infer from caption quality + notes]
**Advisory for next week**: [one suggestion based on pattern]
```

**Step 4: Confirm**
Output: "Feedback logged for [slug] → memory/feedback-log.md updated. [N] weeks in log."

## Token Budget
~500 tokens. Reads 3 files, writes one append. Fast.
