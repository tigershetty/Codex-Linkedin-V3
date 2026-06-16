---
name: 101
description: Use when the user runs /101 [topic-number]. Single-step Supply Chain 101 pipeline. Takes a topic number (1-24) from the 90-day plan, generates 10 hook options + LinkedIn caption + ChatGPT Image 2 prompt in one pass. No research, no control gates.
---

# /101 Skill — Supply Chain 101 Pipeline

## Purpose
Single-step pipeline for the Supply Chain 101 series. Takes a topic number from the 90-day plan, generates 10 hook options + LinkedIn caption + ChatGPT Image 2 prompt in one pass. No research stage, no control gates. User picks and adjusts at the end.

## Invoke
```
/101 [topic-number]
```
Example: `/101 2` → generates hooks + caption + ChatGPT Image 2 prompt for Topic 2 (Supply Chain vs. Logistics)

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
- Bullet points use • not -

---

## Step 3: Write LinkedIn Caption

Follow the 101 post structure (from `references/101-voice.md`):

1. **Hook** (1–2 sentences) — use selected hook verbatim
2. **Series Frame** (1–2 sentences) — position in SC 101 series, reference previous episode by number and topic
3. **Core Explanation** (2–3 sentences) — the concept in plain language, builds through reasoning
4. **Bullets** (2–4) — one sentence each unless content genuinely requires two. No bold headers inside bullets. Vary structure — not every bullet needs the same format.
5. **Opinion / Reframe** (1–2 sentences) — use Tiger's bridges: "What I believe is...", "My view on this is...", "Here's the thing most people miss..."
6. **CTA Question** — single open question, accessible to non-practitioners
7. **Sign-off + Hashtags**

**Use the Caption Direction from the plan** as the guide for framing and closing question.

**Voice rules — calibrate against published Ep3–22 before presenting:**
- **150–220 words total.** Published episodes average 180 words. Over 220 = over-explanation, recut.
- Sentences connect ideas with reasoning: "because", "so", "which means", "and that's"
- Bullets: one sentence each. Vary length and structure across them — not uniform.
- No bold labels inside bullet text ("**Quality**:", "**Delivery**:") — the bullet itself carries the label
- Plain language. No em dashes. No ANCHORS labels. No citation format.
- Bullet points use • not - (applies to all output: captions, hook options, ChatGPT Image 2 prompt content lists)
- At least one opinion bridge from Tiger's set — rotate, never repeat the same one twice in a row
- One moment that sounds like Tiger thinking out loud — slightly imperfect, first-person where natural
- Sign-off: "Found this useful? Follow Poornajith Shetty and Shetty's Desk for more supply chain insights and save/repost this for [specific reference use]."
- Hashtags: #ShettysDesk #SupplyChainIntelligence #SCM #SupplyChain101 + 1 topic-specific tag

---

## Step 4: Generate ChatGPT Image 2 Prompt

**Image tool: ChatGPT (GPT Image 2).** Paste the prompt into ChatGPT and **attach `references/brand-anchor-v1.webp`** in the same message — that is the style/colour reference (same brand anchor as before, now used in ChatGPT instead of the Gemini Gem). GPT Image 2 renders on-image text reliably, so keep labels exact and short.

Use this exact template structure. The VISUAL ANCHOR block is mandatory — it is what makes each infographic visually distinctive and eye-catching. Without it, the output is structurally correct but visually generic.

**VISUAL ANCHOR rules:**
- 3–5 sentences only. Placed between THE QUESTION THIS ANSWERS and VISUAL STRUCTURE.
- Describes one dominant visual metaphor with spatial specificity — how the layout feels, what dimensional quality it has, what the focal element is, where the eye goes first.
- Names the single most important element on the canvas (the brightest, the largest, the one point of tension).
- No colour instructions — the brand anchor image handles colour. No narrative prose about the concept. No NEGATIVE block.
- This block is what separates a visually striking render from a generic one. Never skip it.

```
Task: Create an infographic image for the summary below (after the rules).

Rules: Use the image attached as a reference on style, aesthetics, colours, and illustration technique. Use a different layout for the structure to elaborate details based on the summary. Do not use any information or text from the attached image — only style. Use it only for inspiration. Square 1:1 format (1024x1024).

TOPIC: [Topic name]
THE QUESTION THIS ANSWERS: [The Question It Answers from the plan — verbatim]

VISUAL ANCHOR: [3–5 sentences. Name the dominant visual metaphor and dimensional concept — how the layout is rendered in space, what quality it has, what the single focal element is, where the eye goes first. No colour instructions. No concept explanation. No prose about supply chain.]

VISUAL STRUCTURE: [1–2 sentences describing the dominant layout — taken from the Visual Format in the plan. Name the spatial logic: what is on the left/right/top/bottom/centre, what the focal point is.]

CONTENT TO INCLUDE ON THE IMAGE:
- Heading: "[Short heading, max 8 words]" (Bold)
- [Named section or element 1 — use spatial labels: LEFT SIDE / RIGHT SIDE / TOP / CENTRE / etc.]:
  - [Label]: [2–3 word value or short phrase — not sentences]
  - [Label]: [2–3 word value or short phrase]
- [Named section or element 2]:
  - [Label]: [2–3 word value]
  - [Label]: [2–3 word value]
- [Annotation line — carries the opinion from the caption. One sentence, specific.]

CONTENT RULES:
- Maximum 60 words total on the image (excluding labels and axis text)
- Heading: maximum 8 words, set in Bold
- Every element must be readable at mobile phone size
- [One rule specific to this visual format — e.g. "The wave amplification should be the dominant visual"]
- Data labels and annotations preferred over paragraph text

DO NOT:
- Use font sizes below 14px at final output resolution
- Add decorative elements that do not carry information
```

Populate from the plan's Visual Format and Caption Direction. Keep content list tight — only what must appear on the image. Total prompt length: 40–55 lines maximum.

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

CHATGPT IMAGE 2 PROMPT (paste-ready):
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
   - ChatGPT Image 2 prompt
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

## ChatGPT Image 2 Prompt (paste-ready)
[full ChatGPT Image 2 prompt]
```

---

## Quality Check (run before presenting)

- [ ] All 10 hooks use different opening words and different structural devices?
- [ ] Caption follows 101 post structure (hook, series frame, explanation, 3 bullets, reframe, CTA, sign-off)?
- [ ] Caption is 150–300 words?
- [ ] No em dashes, no AI slop, no ANCHORS labels, no citation format?
- [ ] CTA is an open question accessible to non-practitioners?
- [ ] Sign-off includes "Follow Poornajith Shetty" + save prompt?
- [ ] ChatGPT Image 2 prompt uses the plan's visual format and brand kit template?
- [ ] A non-practitioner could read the caption over coffee and understand the concept?

---

## Token Budget
~4–6K tokens per run. Reads 101-plan.md, 101-voice.md, and 101-series-tracker.md only.
No research files, no source library, no deep-dive references.
