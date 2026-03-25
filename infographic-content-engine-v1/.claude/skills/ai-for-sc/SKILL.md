---
name: ai-for-sc
description: Use when the user runs /ai-for-sc [topic-number]. Single-step AI for Supply Chain pipeline. Takes a topic number (1-24) from the 90-day plan, generates 10 hook options + LinkedIn caption + Gemini prompt in one pass. Three post types (A/B/C) with type-specific structures.
---

# /ai-for-sc Skill — AI for Supply Chain Pipeline

## Purpose
Single-step pipeline for the AI for Supply Chain series. Takes a topic number from the 90-day plan, generates 10 hook options + LinkedIn caption + Gemini prompt in one pass. No research stage, no control gates. User picks and adjusts at the end.

## Invoke
```
/ai-for-sc [topic-number]
```
Example: `/ai-for-sc 1` → generates hooks + caption + Gemini prompt for Topic 1 (Demand Planning)

## Prerequisites
- `references/ai-for-sc-plan.md` must exist (the 90-day content plan)
- `references/ai-for-sc-voice.md` must exist (voice anchor)

## Output
```
data/{YYYY-W##}/{topic-slug}/ai-for-sc-copy.md
```

---

## Step 1: Load Inputs

1. Read `references/ai-for-sc-plan.md` — extract the row for the requested topic number
2. Read `references/ai-for-sc-voice.md` — load voice rules
3. Read `data/ai-for-sc-series-tracker.md` — check episode number and what was published last
4. Extract from the plan row:
   - Topic number and name
   - Post type (A = Cheat Sheet, B = Workflow, C = Conversation Starter)
   - The Question It Answers
   - Hook direction
   - Visual Format
   - Caption Direction
5. If the topic is Type A (Cheat Sheet), also load the **Prompt Content Reference** section from the plan for the full prompt texts

---

## Step 2: Generate 10 Hook Options

Generate all 10 hooks using the hook taxonomy from `ai-for-sc-voice.md`:

| # | Type | AI for SC Adaptation |
|---|---|---|
| 1 | Question-Why | Role-specific frustration, not abstract curiosity |
| 2 | Question-How | Grounded in a specific workflow or weekly task |
| 3 | Stat-Lead | Number that quantifies time saved, cost found, or error exposed |
| 4 | Contrarian | Challenge assumption about AI OR about how SC work is done |
| 5 | Paradox | Good aggregate metric with hidden problem underneath |
| 6 | Personal-Reflection | "I built this workflow because..." framing |
| 7 | Result-First | Start with what the prompt produced, then the method |
| 8 | Timeline-Shock | Manual time vs. AI-assisted time for same task |
| 9 | Comparison-Gap | Two practitioners: one with AI workflows, one without |
| 10 | Decision-Pressure | "Which of your [tasks/suppliers/SKUs] would you test first?" |

**Rules:**
- Use the plan's Hook direction as inspiration for the strongest option
- Each hook opens with a DIFFERENT first word
- Each hook uses a DIFFERENT structural device
- No em dashes. Use periods.
- No AI slop language (unlock, game-changer, revolutionise, dive into, harness, leverage, empower)
- Write as Tiger would say it out loud
- The hook becomes the verbatim opening line of the published post
- Hooks should lead with the supply chain problem, not with AI

---

## Step 3: Write LinkedIn Caption

Follow the type-specific structure from `ai-for-sc-voice.md`:

### Type A — Cheat Sheet Caption
1. **Hook** (1–2 sentences) — placeholder: use strongest hook from Step 2
2. **Series Frame** (1 sentence) — natural mention of AI for Supply Chain series
3. **Framing** (2–3 sentences) — why these prompts matter, what levers they target
4. **3–4 Highlight Prompts** — most impactful from the list, explain WHY each matters
5. **Money Shot** (1 sentence) — the prompt that gets budget approval or changes a conversation
6. **CTA** — "try prompt #X with [your actual data type]"
7. **Sign-off + hashtags**

Word count: 250–350 words.

### Type B — Workflow Caption
1. **Hook** (1–2 sentences) — the problem + time/cost frame
2. **Series Frame** (1 sentence)
3. **Workflow Walk-through** (3–5 sentences) — step-by-step, referencing visual stages
4. **The Insight** (1–2 sentences) — human+AI boundary: what AI does vs. what you validate
5. **CTA** — "before your next [meeting/review/cycle], try this"
6. **Sign-off + hashtags**

Word count: 200–300 words.

### Type C — Conversation Starter Caption
1. **Hook** (1–2 sentences) — bold opinion or reframe
2. **Series Frame** (1 sentence)
3. **The Argument** (3–5 sentences) — build case with SC-specific examples
4. **The Practical Takeaway** (1–2 sentences) — what to do with this insight
5. **CTA** — open question that invites reflection and comment
6. **Sign-off + hashtags**

Word count: 200–300 words.

### Caption Rules (all types)
- **Use the Caption Direction from the plan** as guidance
- No ANCHORS labels, no citation format, no em dashes
- Sign-off: "Follow Poornajith Shetty for more supply chain insights and save this for [specific reference use]."
- Hashtags at end of caption (not on infographic): #ShettysDesk #SupplyChainIntelligence #SCM #AIforSupplyChain + 1 topic-specific tag
- Human+AI boundary must be clear
- Prompts referenced must be specific enough to copy-paste
- "Try prompt #X with your actual [data type]" — always name the data type
- Free-tier tools only. Name which tool fits if relevant (Claude for long docs, Gemini for web search)
- Never position AI as replacing judgement

---

## Step 4: Generate Gemini Prompt

Build the Gemini prompt using the template from `references/ai-for-sc-plan.md`:

1. Set POST TYPE to A, B, or C based on the topic
2. Insert the topic name
3. Insert "The Question It Answers"
4. Insert the Visual Format description
5. Insert type-specific design rules from the template
6. Add CONTENT FOR THE IMAGE:
   - **Type A**: the numbered prompt texts (from Prompt Content Reference in the plan) + one-line outcomes
   - **Type B**: the workflow steps + sample prompt + sample output snippet
   - **Type C**: the headline text + supporting comparison/framework/data point
7. Keep all brand kit rules, content rules, and DO NOTs from the template

**Output the Gemini prompt as a paste-ready block.**

---

## Step 5: Present Everything for Selection

Present all outputs in one block:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 AI FOR SUPPLY CHAIN — TOPIC [#]: [Topic Name]
 Type [A/B/C] · Episode [N] · Series: AI for Supply Chain
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

1. Write `data/{YYYY-W##}/{topic-slug}/ai-for-sc-copy.md` with:
   - Selected hook
   - Final caption
   - All 10 hook options (reference)
   - Gemini prompt
2. Update `data/ai-for-sc-series-tracker.md` with the new entry

---

## Output File Structure

```markdown
# AI for SC Copy — [topic-slug]
**Week**: [YYYY-W##]
**Topic**: #[number] — [Topic Name]
**Type**: [A/B/C — Cheat Sheet/Workflow/Conversation Starter]
**Episode**: [N]
**Series**: AI for Supply Chain

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
- [ ] Hooks lead with the supply chain problem, not with AI?
- [ ] Caption follows the correct type-specific structure (A/B/C)?
- [ ] Caption is within word count for this type?
- [ ] No em dashes, no AI slop, no ANCHORS labels, no citation format?
- [ ] Human+AI boundary is clear (what AI does vs. what you validate)?
- [ ] Prompts referenced are specific enough to copy-paste?
- [ ] CTA names a specific data type ("try prompt #X with your actual [data]")?
- [ ] Free-tier tools only, with tool-task fit explained where relevant?
- [ ] Series frame is natural, one sentence, no episode number?
- [ ] Sign-off includes "Follow Poornajith Shetty" + save prompt?
- [ ] Gemini prompt uses the correct type-specific design rules (A/B/C)?
- [ ] A supply chain professional with 2+ years experience would know which prompt to try first?

---

## Token Budget
~5–8K tokens per run. Reads ai-for-sc-plan.md, ai-for-sc-voice.md, and ai-for-sc-series-tracker.md only.
Type A topics read additional prompt content from the plan's Prompt Content Reference section.
No research files, no source library, no deep-dive references.
