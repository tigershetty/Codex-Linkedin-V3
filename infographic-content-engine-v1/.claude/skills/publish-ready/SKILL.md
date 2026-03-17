---
name: publish-ready
description: Use when the user runs /publish-ready [slug]. Reads content.md to validate the LinkedIn caption against voice rules, word count, and structure. Presents a final pre-publication checklist before the post goes live on LinkedIn.
---

# Publish-Ready Skill — Shetty's Desk

## Purpose
Final gate before LinkedIn. Reads content.md and gemini-prompt.md for the given
slug and runs a structured pre-publication checklist. Catches voice violations,
word count breaches, and missing render steps before the post goes live.

## Invoke
```
/publish-ready [topic-slug]
```

## Prerequisites
- `data/{week}/{topic-slug}/content.md` must exist
- `data/{week}/{topic-slug}/gemini-prompt.md` must exist

---

## Step 1: Read Files

Read `content.md`. Extract:
- LinkedIn Caption (full text)
- Word count (count words in caption body only — exclude the hook label)

Read `message-commit.md`. Extract:
- `selected_hook` (the verbatim hook text)

---

## Step 2: Run Voice Check

Check the LinkedIn Caption against each rule. Flag exact violations with
the offending line quoted.

| Rule | Check |
|---|---|
| No em dashes | No ` — ` in caption |
| No ANCHORS labels | No A:, N:, C:, H:, O:, R:, S:, T: anywhere |
| No AI slop | "leverage", "utilize", "delve", "moreover", "furthermore", "plays a crucial role", "it is important to note", "in today's landscape" |
| No over-hedging | "it could be argued", "arguably", "one might consider" |
| No yes/no CTA | CTA must not be a yes/no rhetorical question |
| Opens with hook | First line of caption must match selected_hook verbatim |
| Word count | Caption must be 200–350 words |

---

## Step 3: Print Checklist

Print this block with each item resolved as ✅ PASS or ❌ FAIL [reason]:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PUBLISH-READY — [slug]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CAPTION VOICE CHECK
  [ ] No em dashes
  [ ] No ANCHORS slot labels
  [ ] No AI slop words
  [ ] No over-hedging
  [ ] CTA is not a yes/no question
  [ ] Opens with selected hook verbatim
  [ ] Word count: [N] words (target: 200–350)

GEMINI RENDER STEPS (manual — check before exporting)
  [ ] Opened gemini.google.com → Shetty's Desk — Infographic Engine gem
  [ ] Uploaded references/brand-anchor-v1.webp as style reference this session
  [ ] Generated Variant A → ran 3-point Calibration Check
  [ ] Generated Variant B → compared → picked stronger render
  [ ] Exported PNG 2048×2048

LINKEDIN POST STEPS (manual)
  [ ] PNG uploaded to LinkedIn post
  [ ] Caption copied from content.md (not from gemini-prompt.md)
  [ ] Hashtags added if using
  [ ] Scheduled or published

DISTRIBUTION TIMING (supply chain VP / COO / Director audience)
  Best days:    Tuesday, Wednesday, Thursday
  Best window:  7–9am audience local time
  Golden hour:  First 60 min drives algorithm weighting.
                Be available to respond to early comments immediately after posting.
  Replay:       Post the 48-Hour Replay Prompt from research.md at ~48h after publish.

RETROSPECTIVE REMINDER
  Set a reminder to run in 7 days:
  /retrospective [slug]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

If any CAPTION VOICE CHECK item is ❌ FAIL:
- Quote the exact offending line
- Suggest the fix inline
- Do NOT auto-rewrite the caption — flag it for Tiger to decide

If all CAPTION VOICE CHECK items pass: print `CAPTION CLEAR — ready to post.`

---

## Token Budget
~1K tokens per run. Reads content.md and message-commit.md only.
