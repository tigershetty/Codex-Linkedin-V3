---
name: feedback-capture
description: Use when Tiger approves a visual, rejects one, or finishes posting for the week.
  Captures qualitative feedback into memory/feedback-log.md. Works for both active pipelines
  (Supply Chain 101 and AI for Supply Chain). Invoked with /feedback [slug] [notes].
---

# Feedback Capture Skill — Shetty's Desk

## Purpose
Record what worked and what didn't for each post, so the learning layer has qualitative input.
Writes a structured entry to `memory/feedback-log.md`. Run it within 24 hours of approving a
visual or publishing a post.

## Invoke
```
/feedback [topic-slug] [optional: brief notes in quotes]
```
Example:
```
/feedback rfq-with-claude "hero number landed, caption opening too long"
```

## What This Skill Does

**Step 1: Read context**
- Read `memory/feedback-log.md` to get the current schema.
- Find the post file: `data/*/{slug}/101-copy.md` or `data/*/{slug}/ai-for-sc-{slug}.md`.
  - Which file it is sets the **content type** (101 vs AI for SC).
  - Read the **hook type** ("## Selected Hook" → "**Type**:").
  - Read the **visual**: for 101 = the ChatGPT (GPT Image 2) prompt; for AI for SC = the
    code-render template named in the header / Render Brief (`renderer/templates/...`).

**Step 2: Ask Tiger three rapid questions (one at a time)**
1. "Visual quality — World-class / Approved / Needed iteration / Rejected?"
   (the rendered infographic — GPT Image 2 for 101, code-render for AI for SC)
2. "Caption quality — Strong / Weak opening / Missing context / Needs rewrite?"
3. "Anything specific to note for next week? (enter to skip)"

**Step 3: Write the feedback entry**

Append to `memory/feedback-log.md`:
```
## [YYYY-W##] — [slug]  ([101 | AI for SC])

**Date logged**: [today]
**Hook type used**: [from the post file]
**Visual**: [101: GPT Image 2 prompt | AI for SC: code-render template name]
**Visual quality**: [answer from Step 2]
**Caption quality**: [answer from Step 2]
**Tiger's notes**: [answer from Step 2, or "none"]

**What worked**: [infer from visual quality + notes]
**What to change**: [infer from caption quality + notes]
**Advisory for next week**: [one suggestion based on the pattern]
```

**Step 4: Confirm**
Output: "Feedback logged for [slug] → memory/feedback-log.md updated. [N] entries in log."

## Token Budget
~500 tokens. Reads 2 files, writes one append. Fast.
