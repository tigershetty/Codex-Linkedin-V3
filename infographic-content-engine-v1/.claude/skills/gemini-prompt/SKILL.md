---
name: gemini-prompt-infographic
description: Use when the user runs /gemini-prompt [slug]. Requires content.md to exist. Assembles paste-ready Gemini prompts with the fixed Rules block, story premise, and calibration checklist.
---

# Gemini Prompt Skill — Infographic Content Engine v1

## Purpose
Assemble paste-ready Gemini image prompts from the narrative summary in content.md. Outputs two variants (process-led + outcome-led) using the simple Rules + Summary format that produced the Nike, Zara, and Dabbawala infographics.

## Invoke
```
/gemini-prompt [topic-slug]
```

## Prerequisites
- `data/{week}/{topic-slug}/content.md` must exist with both Variant A and Variant B narrative summaries
- `data/{week}/{topic-slug}/message-commit.md` must exist

## Output
```
data/{YYYY-W##}/{topic-slug}/gemini-prompt.md
```

---

## Step 1: Read Content

Read `content.md`. Extract:
- Variant A narrative summary (paradox-led)
- Variant B narrative summary (scene-led)
- LinkedIn Caption (Tiger's 7-part voice — written by /content)

Read `message-commit.md`. Extract:
- `committed_message` → used as Story Premise line in the Rules block
- `hero_number` + `what_it_proves` → used as Visual Anchor line in the Rules block

---

## Step 2: Extract Content Section Data

From `content.md` Variant A narrative, extract:
- The two or three `### Section Heading` titles (strip the `###`)
- From each section, the **first stat** in each bullet: the number/figure before the colon
  - e.g. `- **94% → 70%**: Pilot...` → extract `94% (Pilot Validation) → 70% (Live Production)`
  - e.g. `- **Forecast horizon collapse**: Seven-day forecasts stay accurate at 85%...` → extract `7-day: 85% accurate` and `30-day: 65% accurate`
- Max 3 data lines per section
- Max 3 sections total

**Condensation rules (mandatory):**
- NO markdown: strip all `**`, `###`, `-`, `[S##]`, `*`
- NO prose: keep only the stat and its label
- NO colour descriptions: the reference image handles style
- Use `→` for before/after pairs (e.g. `94% → 70%`)
- Use `Label: Value` for single stats (e.g. `7-day: 85% accurate`)
- Target: 50–70 words total in the content block below the Rules line

## Step 3: Assemble the Gemini Prompt File

Build `gemini-prompt.md` with this exact structure:

**Variant A — Numbered Sections prompt:**

~~~
Task: Create an infographic image for the summary below (after the rules).

Rules: Use the image attached as a reference on style, aesthetics,
colours, and illustration technique. Use a different layout for the
structure to elaborate details based on the summary. Do not use any
information or text from the attached image — only style. Use it only
for inspiration. Aspect ratio 1:1, resolution 2048x2048.

Main Theme: [TOPIC HEADLINE — from message-commit.md committed_message, plain text]

1: [SECTION 1 HEADING — stripped of ###]
[DATA LINE 1]
[DATA LINE 2]
[DATA LINE 3 — optional]

2: [SECTION 2 HEADING — stripped of ###]
[DATA LINE 1]
[DATA LINE 2]
[DATA LINE 3 — optional]

3: [SECTION 3 HEADING — optional, only if a third distinct cluster exists]
[DATA LINE 1]
[DATA LINE 2]
~~~

**Variant B:** Same Rules block. Same Main Theme. Use different section emphasis from Variant B narrative — e.g. reorder sections or pick alternative stats from different bullets to produce visual variety.

**Validation before saving:**
- [ ] No markdown syntax anywhere in the prompt body
- [ ] Content block is 50–80 words (not more)
- [ ] Main Theme is present and plain text
- [ ] Each section has a numbered heading (`1:` not `### 1.`)
- [ ] Thinking level: add `Thinking: high` as last line if prompt is complex (3 sections with 3 data lines each)

---

## Output File Structure

```
# Gemini Prompt — [topic-slug]
**Week**: [YYYY-W##]

## Quick Start
1. Open gemini.google.com → Select Gem "Shetty's Desk — Infographic Engine"
2. Upload references/brand-anchor-v1.webp as style reference (drag into chat)
3. Paste Variant A prompt → generate → run 3-point Calibration Check
4. Paste Variant B prompt → compare renders → pick stronger output
5. Export PNG 2048×2048 → post on LinkedIn with caption below

---

## Variant A — Paradox-Led Narrative

Task: Create an infographic image for the summary below (after the rules).

Rules: Use the image attached as a reference on style, aesthetics,
colours, and illustration technique. Use a different layout for the
structure to elaborate details based on the summary. Do not use any
information or text from the attached image — only style. Use it only
for inspiration. Aspect ratio 1:1, resolution 2048x2048.

Main Theme: [TOPIC HEADLINE]

1: [SECTION 1 HEADING]
[DATA LINE 1]
[DATA LINE 2]

2: [SECTION 2 HEADING]
[DATA LINE 1]
[DATA LINE 2]

---

## Variant B — Scene-Led Narrative

Task: Create an infographic image for the summary below (after the rules).

Rules: [same fixed block]

Main Theme: [SAME TOPIC HEADLINE]

1: [SECTION 1 HEADING — different emphasis from Variant A]
[DATA LINE 1]
[DATA LINE 2]

2: [SECTION 2 HEADING — different emphasis]
[DATA LINE 1]
[DATA LINE 2]

---

## Calibration Check (run after each render)
- [ ] Background is deep blue (not white or grey)?
- [ ] Text is readable — no garbled numbers or spec annotations visible?
- [ ] Single dominant visual element present — the hero number or its object stands out?

2-3 render attempts per variant is normal. If a check fails: identify the specific
failing element → adjust that element in content.md → re-generate. Do not rewrite
the entire narrative on one failure.

---

## LinkedIn Caption
[LinkedIn Caption from content.md]
```

---

## Token Budget
~1–2K tokens per run. Reads content.md and message-commit.md only.
Rules block is fixed — no colour/theme description needed (reference image handles style).
Content block target: 50–80 words. No narrative paste.
