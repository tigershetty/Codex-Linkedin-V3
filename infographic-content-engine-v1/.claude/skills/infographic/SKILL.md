---
name: infographic
description: Use when the user runs /infographic or /infographic [slug]. Master entry point for the full Shetty's Desk pipeline — runs scout through gemini-prompt in sequence, pausing at Control Gate 1 (topic selection) and Control Gate 2 (hook selection) for user input.
---

# Infographic Pipeline Orchestrator — Shetty's Desk

## Purpose
Single command that drives the full production pipeline from topic selection through
paste-ready Gemini prompts. Detects current stage from existing files. Resumes from
the correct stage — never restarts work that is already done.

## Invoke
```
/infographic                    ← no topic yet — starts from scout
/infographic [slug]             ← resumes from the right stage for that slug
```

## Base Directory
All data files live under: `data/{YYYY-W##}/{slug}/`
Current week folder is determined from the most recent topic-scout.md in the data/
directory, or from today's date if no scout file exists.

---

## Stage Detection — Run First

Before running any stage, check which files exist for the given slug.
If no slug was provided, skip to Stage 0.

| Files present for this slug | Resume from |
|---|---|
| Nothing | Stage 0 — Scout |
| topic-scout.md only, no slug selected | Stage 0b — Topic selection (CG1) |
| topic-scout.md, slug known, no research.md | Stage 1 — Research |
| research.md exists, no message-commit.md | Stage 2 — Message |
| message-commit.md exists, no content.md | Stage 3 — Content |
| content.md exists, no gemini-prompt.md | Stage 4 — Gemini Prompt |
| All pipeline files present, post not yet live | Pipeline complete — print completion summary, offer to re-run any stage |
| All pipeline files present + post is live | Stage 5 — Analytics |

State this detection aloud before proceeding:
"Detected stage: [stage name]. Resuming from [stage name] for [slug]."

---

## Stage 0 — Scout (no slug provided)

Before running /scout: dispatch the learning-advisor agent to check memory files.
Surface advisory notes to Tiger. Tiger reviews (5 seconds). Proceed with stage.
The learning-advisor is advisory — it does not block the stage from proceeding.

Use the scout skill (`/scout`).

Presents 4 topic candidates (2 Trending + 2 Evergreen) with hooks, sources, and
novelty check.

**PAUSE — Control Gate 1:**
Wait for the user to select a topic from the scout output.
Do not proceed to Stage 1 until a slug is confirmed.

---

## Stage 1 — Research

Use the research skill (`/research [slug]`).

Runs citation-grade research on the selected topic. Produces research.md.
No gate — runs to completion automatically.
Print: "✅ Stage 1 complete — research.md written. Starting message commit..."

---

## Stage 2 — Message Commit

Before running /message: dispatch the learning-advisor agent to check memory files.
Surface advisory notes to Tiger. Tiger reviews (5 seconds). Proceed with stage.
The learning-advisor is advisory — it does not block the stage from proceeding.

Use the message skill (`/message [slug]`).

Locks the committed story, hero number, opening sentences, and section themes.
Generates all 10 hook options.

**PAUSE — Control Gate 2:**
Present the full CG2 block (story + 10 hooks) and wait for the user to select
a hook (1–10) or type a custom hook.
Do not proceed to Stage 3 until a hook is confirmed and written to message-commit.md.

---

## Stage 3 — Content

Use the content skill (`/content [slug]`).

Produces Variant A narrative, Variant B narrative, and the LinkedIn caption in
Tiger's 7-part voice.
No gate — runs to completion automatically.
Print: "✅ Stage 3 complete — content.md written. Assembling Gemini prompts..."

---

## Stage 4 — Gemini Prompt

Before running /gemini-prompt: dispatch the learning-advisor agent to check memory files.
Surface advisory notes to Tiger. Tiger reviews (5 seconds). Proceed with stage.
The learning-advisor is advisory — it does not block the stage from proceeding.

Use the gemini-prompt skill (`/gemini-prompt [slug]`).

Assembles paste-ready Gemini prompts with Rules block, Story Premise, Visual Anchor,
and LinkedIn Caption.
No gate — runs to completion automatically.

---

## Stage 5 — Analytics (post-publish)

Run after the LinkedIn post is live and the Excel file is prepared
(LinkedIn export + Caption and Gemini Prompt sheets added).

Use the analytics skill (`/analytics [slug]`).

Reads Excel (4 sheets), extracts pipeline decisions, calculates derived metrics,
writes analytics.md and appends analytics-log.csv.
No gate — runs to completion automatically.
Print: "✅ Stage 5 complete — analytics.md written. [N] rows in analytics-log.csv."

---

## Completion Output

After Stage 4, print:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE COMPLETE — [slug]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Files produced:
  ✅ data/[week]/[slug]/research.md
  ✅ data/[week]/[slug]/message-commit.md
  ✅ data/[week]/[slug]/content.md
  ✅ data/[week]/[slug]/gemini-prompt.md

Next step:
  1. Open gemini-prompt.md
  2. Go to gemini.google.com → Shetty's Desk — Infographic Engine gem
  3. Upload references/brand-anchor-v1.webp as style reference
  4. Paste Variant A prompt → generate → run Calibration Check
  5. Paste Variant B prompt → compare → pick stronger render
  6. Export PNG 2048x2048 → post on LinkedIn with caption from content.md

Post-publish (after LinkedIn):
  7. Run /analytics [slug] once Excel file is prepared
     → writes data/[week]/[slug]/analytics.md
     → appends data/analytics-log.csv
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Gate Rules (immutable)

- Never skip CG1 or CG2 under any circumstance
- Never advance past a gate based on a previous session's selection — always confirm in the current session
- If a file already exists for a stage, announce it and ask: "Stage [N] file already exists. Re-run or use existing?" before overwriting
- If a stage fails or produces unexpected output, stop and report — do not auto-retry silently

---

## Token Budget
~500 tokens for orchestration logic. Each stage uses its own skill token budget.
This skill delegates — it does not duplicate stage logic.
