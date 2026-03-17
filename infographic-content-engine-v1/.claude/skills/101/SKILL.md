---
name: 101
description: Use when the user runs /101 [topic-number]. Single-step Supply Chain 101 pipeline. Takes a topic number (1-24) from the 90-day plan, generates 10 hook options + LinkedIn caption + Gemini prompt in one pass. No research, no control gates.
---

# /101 Skill — Supply Chain 101 Pipeline

## Purpose
Single-step pipeline for the Supply Chain 101 series. Takes a topic number from the 90-day plan, generates 10 hook options + LinkedIn caption + Gemini prompt in one pass. No research stage, no control gates. User picks and adjusts at the end.

## Invoke
```
/101 [topic-number]
```
Example: `/101 2` → generates hooks + caption + Gemini prompt for Topic 2 (Supply Chain vs. Logistics)

## Prerequisites
- `references/101-plan.md` must exist (the 90-day content plan)
- `references/101-voice.md` must exist (101 voice anchor)

## Output
```
data/{YYYY-W##}/{topic-slug}/101-copy.md
```

---

## Step 1: Load Inputs

1. Read `references/101-plan.md` — extract the row for the requested topic number
2. Read `references/101-voice.md` — load voice rules
3. Read `data/101-series-tracker.md` — check episode number and what was published last
4. Extract from the plan row:
   - Topic name
   - The Question It Answers
   - Hook direction
   - Visual Format
   - Caption Direction

---

## Step 2: Generate 10 Hook Options

Generate all 10 hooks using the hook taxonomy adapted for 101 voice:

| # | Type | 101 Adaptation |
|---|---|---|
| 1 | Question-Why | Everyday question, not industry puzzle |
| 2 | Question-How | Frame around a familiar product or experience |
| 3 | Stat-Lead | Simple, surprising number — not a dense ratio |
| 4 | Contrarian | Challenge a common assumption non-practitioners hold |
| 5 | Paradox | Relatable contradiction, not a mechanism chain |
| 6 | Personal-Reflection | "I get asked this all the time..." framing |
| 7 | Result-First | Start with a visible outcome, then explain |
| 8 | Timeline-Shock | Trace a product journey as a timeline |
| 9 | Comparison-Gap | Two things people think are the same, shown as different |
| 10 | Decision-Pressure | Question the reader can ask in their own workplace |

**Rules:**
- Use the plan's Hook direction as inspiration for the strongest option
- Each hook opens with a DIFFERENT first word
- Each hook uses a DIFFERENT structural device
- No em dashes. Use periods.
- No AI slop language
- Write as Tiger would say it out loud
- Plain language — a non-practitioner should understand every hook

---

## Step 3: Write LinkedIn Caption

Follow the 101 post structure (from `references/101-voice.md`):

1. **Hook** (1–2 sentences) — placeholder: use the strongest hook from Step 2
2. **Series Frame** (1–2 sentences) — position in SC 101 series, reference previous post
3. **Core Explanation** (2–3 sentences) — the concept in plain language
4. **Three Bullets** — each explains one aspect with a simple example
5. **Reframe / Opinion** (1–2 sentences) — practical insight
6. **CTA Question** — open, reflective, accessible
7. **Sign-off + Hashtags**

**Use the Caption Direction from the plan** as guidance for structure and closing question.

**Voice rules:**
- 150–300 words total
- Plain language first, technical terms explained
- Numbers sparingly, only when they clarify
- Could someone outside supply chain understand this over coffee?
- No ANCHORS labels, no citation format, no em dashes
- Sign-off: "Follow Poornajith Shetty for more supply chain insights and save this for [specific reference use]."
- Hashtags: #ShettysDesk #SupplyChainIntelligence #SCM #SupplyChain101 + 1 topic-specific tag

---

## Step 4: Generate Gemini Prompt

Build the Gemini prompt using the template from `references/101-plan.md`:

1. Insert the topic name
2. Insert "The Question It Answers" from the plan
3. Insert the Visual Format description from the plan
4. Keep all brand kit rules, content rules, and DO NOTs from the template
5. Add any specific content from the caption bullets that should appear on the image

**Output the Gemini prompt as a paste-ready block** — the user copies it directly into Gemini.

---

## Step 5: Present Everything for Selection

Present all outputs in one block:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SUPPLY CHAIN 101 — TOPIC [#]: [Topic Name]
 Episode [N] · Series: Supply Chain 101
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10 HOOK OPTIONS:
1.  [Question-Why]:        "[text]"
2.  [Question-How]:        "[text]"
3.  [Stat-Lead]:           "[text]"
4.  [Contrarian]:          "[text]"
5.  [Paradox]:             "[text]"
6.  [Personal-Reflection]: "[text]"
7.  [Result-First]:        "[text]"
8.  [Timeline-Shock]:      "[text]"
9.  [Comparison-Gap]:      "[text]"
10. [Decision-Pressure]:   "[text]"

LINKEDIN CAPTION (using hook [#] as placeholder):
[full caption]

GEMINI PROMPT (paste-ready):
[full prompt]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pick a hook (1-10), adjust caption if needed,
then confirm to save.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Step 6: Save

After user confirms hook selection and any adjustments:

1. Write `data/{YYYY-W##}/{topic-slug}/101-copy.md` with:
   - Selected hook
   - Final caption
   - All 10 hook options (reference)
   - Gemini prompt
2. Update `data/101-series-tracker.md` with the new entry

---

## Output File Structure

```markdown
# 101 Copy — [topic-slug]
**Week**: [YYYY-W##]
**Topic**: #[number] — [Topic Name]
**Episode**: [N]
**Series**: Supply Chain 101

---

## Selected Hook
**Type**: [hook type]
**Text**: [full hook text]

## LinkedIn Caption
[full caption with selected hook swapped in]

## Hook Options — All 10 (reference)
1. [Question-Why]: [text]
2. [Question-How]: [text]
3. [Stat-Lead]: [text]
4. [Contrarian]: [text]
5. [Paradox]: [text]
6. [Personal-Reflection]: [text]
7. [Result-First]: [text]
8. [Timeline-Shock]: [text]
9. [Comparison-Gap]: [text]
10. [Decision-Pressure]: [text]

---

## Gemini Prompt (paste-ready)
[full Gemini prompt]
```

---

## Quality Check (run before presenting)

- [ ] All 10 hooks use different opening words and different structural devices?
- [ ] Caption follows 101 post structure (hook, series frame, explanation, 3 bullets, reframe, CTA, sign-off)?
- [ ] Caption is 150–300 words?
- [ ] No em dashes, no AI slop, no ANCHORS labels, no citation format?
- [ ] CTA is an open question accessible to non-practitioners?
- [ ] Sign-off includes "Follow Poornajith Shetty" + save prompt?
- [ ] Gemini prompt uses the plan's visual format and brand kit template?
- [ ] A non-practitioner could read the caption over coffee and understand the concept?

---

## Token Budget
~4–6K tokens per run. Reads 101-plan.md, 101-voice.md, and 101-series-tracker.md only.
No research files, no source library, no deep-dive references.
