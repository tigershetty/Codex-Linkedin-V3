---
name: ai-for-sc
description: Use when the user runs /ai-for-sc [week] or /ai-for-sc [week] [post-type]. Monthly theme model pipeline for AI for Supply Chain series. Generates LinkedIn caption + PDF draft for SC Practitioner post (Post 3) and/or Leader post (Post 4) from the approved topic bank. Loads tiger-voice.md, published-voice.md, and 101-voice.md before generating to apply full voice DNA and visual intelligence from the existing series.
---

# /ai-for-sc Skill — AI for Supply Chain Pipeline

## Purpose
Generates AI for Supply Chain posts from the approved monthly topic bank. One week = one sub-topic = two posts (SC Practitioner + Leader). Each post outputs two files: a LinkedIn caption and a PDF draft. Hooks, captions, and Gemini prompts draw directly from the same voice DNA and visual frameworks that built the Ep1–24 series.

## Invoke
```
/ai-for-sc [week]              → generates BOTH posts (Practitioner + Leader) for that week
/ai-for-sc [week] practitioner → generates Practitioner post only
/ai-for-sc [week] leader       → generates Leader post only
```
Examples:
- `/ai-for-sc W21` → Week 21 sub-topic (Procurement: Supplier Scorecard) — both posts
- `/ai-for-sc W30 practitioner` → Week 30 Practitioner post (Capacity: RCCP with Claude)
- `/ai-for-sc W30 leader` → Week 30 Leader post (Capacity: presenting a capacity constraint)

## Prerequisites
The following files MUST be read at the start of every run. They are the intelligence base:

| File | What it provides |
|---|---|
| `~/Claude Nano /tiger-voice.md` | Tiger's voice DNA — rhythm, opinion style, what to reject, pattern breakers |
| `references/published-voice.md` | Deep dive voice: 7-part structure, voice markers, annotated examples, "NOT THIS" list |
| `references/101-voice.md` | 101 voice: accessible register, hook taxonomy adaptations, audience calibration |
| `infographic-content-engine-v1/CLAUDE.md` Part 3 | Approved topic bank — extract the week's sub-topic and post titles |
| `data/ai-for-sc-series-tracker.md` | Episode number tracking and last published context |

**Read all five before generating a single word.**

---

## Step 1: Load All Intelligence

1. Read `~/Claude Nano /tiger-voice.md` — internalize:
   - Natural rhythm: longer flowing sentences, connective tissue ("because", "so", "which means")
   - Opinion bridges: "My view on this is that...", "Here's the thing most people miss...", "If you look at the bigger picture..."
   - Pattern breakers: sentence starting with "And"/"But", parenthetical asides, varied bullet structure
   - Primary rejection: choppy AI fragments ("Short. Punchy. Done.") — NEVER
   - Hook philosophy: pattern interrupt, earns the next sentence immediately, puts the reader in a position before they've decided where to stand

2. Read `references/published-voice.md` — internalize:
   - Hook taxonomy: 10 hook types with specific examples
   - Voice markers: named firms in bullets, numbers embedded mid-sentence, personal frame as opener
   - "NOT THIS" list: ANCHORS labels, citation format, choppy fragments, em dashes, AI slop language
   - Annotated examples: Dabbawala (stat-lead), McKesson (contrarian), Maersk (question-why) — use these as the quality bar

3. Read `references/101-voice.md` — internalize:
   - Accessible register and how it differs from deep dive (plain language first, technical term second)
   - Pattern breakers adapted for 101: everyday examples, relatable contradictions
   - What 101 voice is NOT: too technical, too corporate, choppy AI fragments

4. Read `infographic-content-engine-v1/CLAUDE.md` Part 3 — extract:
   - Month theme and week sub-topic
   - Post 3 title (SC Practitioner task description)
   - Post 4 title (Leader decision description)
   - Infer: the daily friction for the practitioner, the high-stakes scenario for the leader

5. Read `data/ai-for-sc-series-tracker.md` — note last episode number and what was last published

6. Identify the primary AI tool for this week's task using the AI Tool Selection Layer:
   - **Claude**: document drafting, multi-step reasoning, structured analysis, scenario framing, compliance language
   - **ChatGPT**: calculation, formula-based analysis, fast iteration, broad data interpretation, image generation
   - **Gemini**: multi-source research, real-time data, Google Workspace integration
   - **Copilot**: Excel, Word, Teams — in-file formulas, data analysis, PowerPoint

---

## Step 2: Generate 10 Hook Options (per post)

With all voice intelligence loaded, generate 10 hooks using the full hook taxonomy.

The hook is the single most important line in the post. It must do two jobs simultaneously: interrupt the scroll AND signal exactly who this post is for. Reference the Maersk, McKesson, and Dabbawala examples from `published-voice.md` as the quality bar.

| # | Hook Type | SC Practitioner Adaptation | Leader Adaptation |
|---|---|---|---|
| 1 | Question-Why | "Why does [specific daily task] take [X hours] when it shouldn't?" | "Why are your most experienced leaders still slower than your analysts at [decision type]?" |
| 2 | Question-How | "How do you [complete specific task] in 20 minutes when it used to take half a day?" | "How do you walk into a [board/S&OP/capacity] meeting with the same analysis your team spent 3 days building?" |
| 3 | Stat-Lead | Number that quantifies time saved, error rate, or cost found | Scale of the decision or the cost of being wrong by [X]% |
| 4 | Contrarian | Challenge the assumption that this task requires manual effort | Challenge the assumption about what AI is actually useful for in SC decisions |
| 5 | Paradox | A task that looks simple but costs more time than it should | A decision that looks clear until you realise the information underneath it is incomplete |
| 6 | Personal-Reflection | "I built this workflow because my team was redoing the same [task] every week..." | "I stopped waiting for analysis and started building the frame myself. Here is what changed." |
| 7 | Result-First | Start with what the prompt produced — then the method | Start with the decision quality or speed that changed — then how |
| 8 | Timeline-Shock | "[X hours] manually. [Y minutes] with [Tool]. Same output." | "Your analyst built the model in [X] minutes. You have [Y] hours to make the call. Here is how AI closes that gap." |
| 9 | Comparison-Gap | Two practitioners: one running AI workflows, one not — same task, different time | Two leaders: one who preps with AI, one who walks in cold — same meeting, different room |
| 10 | Decision-Pressure | "Which of your [daily tasks/SKUs/suppliers] would you run this on first?" | "Which of your next three decisions would benefit most from having the analysis done before the room fills up?" |

**Hook rules (non-negotiable):**
- Each hook opens with a DIFFERENT first word
- Each hook uses a DIFFERENT structural device
- No em dashes. Use periods.
- No AI slop: unlock, game-changer, revolutionise, dive into, harness, leverage, empower, transform, navigate
- Lead with the supply chain problem or time pressure — not with the tool
- The hook becomes the verbatim opening line of the published post
- Write as Tiger would say it out loud — test against the published-voice.md examples
- **SC Practitioner hook**: specific task + specific time frame. If there's no time frame it's not a practitioner hook.
- **Leader hook**: time pressure + competitiveness tension COMBINED. Both elements must be present.

---

## Step 3: Write LinkedIn Caption

Apply voice rules from all three reference files simultaneously:
- Rhythm: flowing sentences with connective reasoning (tiger-voice.md)
- Numbers and firms: embedded mid-sentence, not appended as citations (published-voice.md)
- Plain language for the SC concept, technical only for the AI mechanics (101-voice.md)

### SC Practitioner Caption Structure (Post 3)

```
1. HOOK (1–2 sentences)          — use placeholder hook from Step 2
2. THE PROBLEM (2 sentences)     — what this task looks like without AI: the specific friction
                                    NOT generic ("it takes time") — specific ("you pull data from 3 systems,
                                    rebuild the same spreadsheet, and spend the first hour just getting the numbers right")
3. WHAT AI DOES (2–3 sentences)  — plain language, starts from the problem not the tool
                                    "Claude takes [input], structures [process], and returns [output] — in the format
                                    you'd build manually but in a fraction of the time"
4. THE STEPS (3–4 steps)         — what the practitioner actually does. Specific and copy-able.
                                    "Open Claude. Paste this: [brief prompt summary]. Adjust [X]. Get [output]."
5. TOOL + WHY (1 sentence)       — "[Tool] because [one-line rationale tied to THIS task]"
                                    Not "because AI is powerful" — because "demand plan documents need
                                    coherent long-form structure that ChatGPT loses across 3+ outputs"
6. WHEN NOT TO USE (1 sentence)  — trust-builder. Name one specific condition.
                                    "If your input data hasn't been cleaned, the output structure is right but
                                    the numbers will mislead you."
7. WHAT YOU GET (1 sentence)     — output format: what they can act on, screenshot, or hand to a manager
8. CTA + DOWNLOAD                — "Try this before your next [specific trigger]. Get the full prompt template at shettysdesk.com"
9. SIGN-OFF + HASHTAGS
```

**Word count**: 220–320 words.

### Leader Caption Structure (Post 4)

```
1. HOOK (1–2 sentences)           — use placeholder hook from Step 2
2. THE SCENARIO (2 sentences)     — the specific high-stakes situation: decision type, time window, information gap
                                     "You have [X hours]. The [decision] involves [specific variables]. Your team
                                     is building the analysis. You need to arrive already thinking."
3. WHAT AI DOES (2–3 sentences)   — NOT summarising slides, NOT replacing judgement
                                     "AI structures the trade-offs before you walk in. It surfaces the questions
                                     you'd want answered and the assumptions worth pressure-testing."
4. THE FRAMEWORK (3–4 points)     — the mental model or decision structure AI helps build
                                     Questions to ask. Scenarios to test. Risks to name. What the data can't tell you.
                                     Apply tiger-voice.md opinion bridges here — "Here's the thing most people miss..."
5. TOOL + WHY (1 sentence)        — "[Tool] because [one-line rationale for this decision type]"
6. WHEN NOT TO USE (1 sentence)   — where human judgement is non-negotiable in this decision
                                     "The final call on [specific element] still requires your read of the room —
                                     no model has that context."
7. CTA + DOWNLOAD                 — "Before your next [specific meeting]. Get the full framework at shettysdesk.com"
8. SIGN-OFF + HASHTAGS
```

**Word count**: 220–320 words.

### Caption Rules (both post types)
- Sentences flow with connective reasoning — no stacked fragments
- Numbers embedded mid-sentence ("cuts lead time from 3 months to 2 weeks"), not appended as citations
- At least 1 pattern breaker per post: sentence starting with "And" or "But", parenthetical aside, or a sentence running longer than feels optimal when building through an idea
- Human+AI boundary must be explicit: what AI structures vs. what the human validates and decides
- No ANCHORS labels, no citation format, no em dashes
- Bullet points use • not - (applies to all output: captions, hook options, Gemini prompt content lists)
- AI must not be positioned as replacing judgement — it structures thinking, not decisions
- Sign-off: "Follow Poornajith Shetty and Shetty's Desk for more supply chain insights and save this for [specific reference use]."
- Hashtags: #ShettysDesk #SupplyChainIntelligence #SCM #AIforSupplyChain + 1 topic-specific tag (5 max)

---

## Step 4: Generate Gemini Prompt (Infographic Visual)

The visual is not an afterthought. Pick the format that fits the post's task — using the same visual logic that made Ep1–24 work. The test: can it be sketched in 30 seconds and understood in 10 seconds by someone outside supply chain?

**Visual format selection guide** (informed by what worked in Ep1–24):

| Format | When to use | Ep1–24 precedent |
|---|---|---|
| Paste-ready prompt with [BRACKETS] | One-shot task the reader can use immediately | — |
| Step-by-step horizontal flow (5–7 steps) | Task has a clear sequence from input to output | Ep5 (S&OP flow), Ep22 (O2C/P2P) |
| Decision tree / branching flow | Topic is a choice between paths | Ep6 (push vs pull decoupling point) |
| Comparison grid (2–3 columns) | Two or three things that look similar but aren't | Ep2 (SC vs. Logistics), Ep3 (planning vs. scheduling) |
| Before/After split panel | Transformation IS the value — show what changes | — |
| Cheat sheet — numbered list with outcomes | Reference material the reader returns to | Ep23 (10 KPIs) |
| Funnel (narrowing stages) | Topic involves qualifying, filtering, or prioritising | Ep14 (ABC/XYZ) |
| Workflow map (connected nodes) | Multiple tools/steps/people involved | Ep8 (SCOR racetrack) |
| Stacked bar / timeline with zones | Time-phased concept or capacity zones | Ep12 (sawtooth), Ep13 (lead time stacked bar) |

**For SC Practitioner posts**: visual shows the workflow or prompt template — something they can act on immediately.
**For Leader posts**: visual shows the decision framework, scenario structure, or trade-off map — something they run before walking into the room.

Build the Gemini prompt using this exact template. The VISUAL ANCHOR block is mandatory — it is what makes each infographic visually distinctive. Without it, the output is structurally correct but visually generic.

**VISUAL ANCHOR rules:**
- 3–5 sentences only. Placed between THE QUESTION THIS ANSWERS and VISUAL STRUCTURE.
- Describes one dominant visual metaphor with spatial specificity — how the layout feels, what dimensional quality it has, what the focal element is, where the eye goes first.
- Names the single most important element on the canvas (the brightest, the largest, the one point of tension).
- No colour instructions — the brand anchor image handles colour. No narrative prose about the concept. No NEGATIVE block.
- This block is what separates a visually striking render from a generic one. Never skip it.

```
Task: Create an infographic image for the summary below (after the rules).

Rules: Use the image attached as a reference on style, aesthetics, colours, and illustration technique. Use a different layout for the structure to elaborate details based on the summary. Do not use any information or text from the attached image — only style. Use it only for inspiration. Aspect ratio 1:1, resolution 2048x2048.

TOPIC: [Topic name — SC Practitioner: task-focused. Leader: decision-focused.]
THE QUESTION THIS ANSWERS: [The specific friction or decision this post addresses]

VISUAL ANCHOR: [3–5 sentences. Name the dominant visual metaphor and dimensional concept — how the layout is rendered in space, what quality it has, what the single focal element is, where the eye goes first. No colour instructions. No concept explanation.]

VISUAL STRUCTURE: [1–2 sentences. Name the dominant layout and spatial logic — what is on left/right/top/bottom/centre, what the focal point is. SC Practitioner: workflow or template the reader acts on. Leader: decision framework or scenario structure they run before the room.]

CONTENT TO INCLUDE ON THE IMAGE:
- Heading: "[Short heading, max 8 words]" (Bold)
- [Named section — use spatial labels: LEFT / RIGHT / TOP / CENTRE / STEP 1 / etc.]:
  - [Label]: [2–3 word value — not sentences]
  - [Label]: [2–3 word value]
- [Annotation — carries the key insight. One sentence, specific.]

CONTENT RULES:
- Maximum 60 words total on the image (excluding labels)
- Heading: maximum 8 words, set in Bold
- Every element must be readable at mobile phone size
- [One format-specific rule — name the dominant visual element]
- Data labels and annotations preferred over paragraph text

DO NOT:
- Use font sizes below 14px at final output resolution
- Add decorative elements that do not carry information
```

Do NOT include negative prompts — they degrade render quality.

Output as a paste-ready block the user copies directly into Gemini.

---

## Step 5: Write PDF Draft

One PDF per post. 3–5 pages. Written as structured markdown that translates directly into a designed PDF (Canva or Gamma).

The MavGPT language tutor PDF is the format model — practical, copy-paste-ready, no fluff.

```markdown
# [Task Name] — AI for Supply Chain
**Tool**: [Tool name]
**Post type**: [SC Practitioner / Leader]
**Week**: [YYYY-W##]
**Series**: AI for Supply Chain — [Month Theme] Edition

---

## Page 1 — Cover
**Title**: [Task name — action-oriented, max 8 words]
**Subtitle**: [What problem this solves in one line]
**Tool**: [Tool name]
**Series tagline**: "One task. One tool. One paste-ready template."

---

## Page 2 — The Problem (Without AI)
[2–3 paragraphs. The specific friction — not generic. What this task looks like manually:
the time it takes, where the errors happen, what gets missed, why it matters.
Write this in Tiger's voice — flowing, connected, specific.]

---

## Page 3 — The Full Prompt Template
**When to use**: [The specific trigger — before which meeting, review, or task]
**Paste into**: [Tool name + URL or where to find it]

```
[FULL PROMPT — all variable inputs clearly labelled in [BRACKETS]]
```

**Inputs to fill in before pasting:**
| [BRACKET] | What it is | Where to find it |
|---|---|---|
| [BRACKET 1] | [description] | [source] |
| [BRACKET 2] | [description] | [source] |
| [BRACKET 3] | [description] | [source] |

---

## Page 4 — Tool Notes
**Why [Tool] for this task**: [One paragraph — specific to this task type, not generic AI praise]

**What to watch for**:
- [Specific failure mode 1 for this task]
- [Specific failure mode 2 for this task]
- [Specific failure mode 3 — when the output looks right but misleads]

**If [Tool] doesn't work**: Try [Alternative] when [specific condition].

---

## Page 5 — What You Get Back + Tips
**Expected output**: [Format, length, structure of what AI returns]

**What to do with it**:
1. [First action — validate X]
2. [Second action — adjust Y for your context]
3. [Third action — use it in Z]

**Common mistakes**:
- [Mistake 1 — most common reason for bad output on this specific prompt]
- [Mistake 2]

**When NOT to use AI here**: [One specific condition where this approach fails or where human judgement is non-negotiable]
```

---

## Step 6: Present Everything for Selection

Present outputs in a clean block per post type:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 AI FOR SUPPLY CHAIN — W[##] · [Sub-topic]
 [SC PRACTITIONER / LEADER] POST (Post [3/4])
 Tool: [Tool name]
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

PDF DRAFT PREVIEW — Page 3 (prompt template):
[Page 3 content only — the paste-ready prompt with BRACKETS labelled]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pick a hook (1-10) · Adjust caption if needed
Confirm to save both files.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

When both posts are generated in one run, show Practitioner block first, then Leader block.

---

## Step 7: Save

After user confirms hook selection and any adjustments:

1. Write `data/{YYYY-W##}/{topic-slug}/ai-for-sc-practitioner.md`
2. Write `data/{YYYY-W##}/{topic-slug}/ai-for-sc-practitioner-pdf.md`
3. Write `data/{YYYY-W##}/{topic-slug}/ai-for-sc-leader.md`
4. Write `data/{YYYY-W##}/{topic-slug}/ai-for-sc-leader-pdf.md`
5. Update `data/ai-for-sc-series-tracker.md` with new entries

---

## Output File Structure

### ai-for-sc-[type].md

```markdown
# AI for SC — [post-type] · [topic-slug]
**Week**: [YYYY-W##]
**Sub-topic**: [Sub-topic]
**Month theme**: [Theme]
**Post type**: [SC Practitioner / Leader]
**Primary tool**: [Tool name]

---

## Selected Hook
**Type**: [hook type]
**Text**: [full hook text]

## LinkedIn Caption
[full caption with selected hook]

## Hook Options — All 10 (reference)
1. [Question-Why]: [text]
...

---

## Gemini Prompt (paste-ready)
[full prompt]
```

### ai-for-sc-[type]-pdf.md

```markdown
# PDF Draft — [post-type] · [topic-slug]
**Week**: [YYYY-W##]
**Tool**: [Tool name]
**Post type**: [SC Practitioner / Leader]

---

[Full 5-page PDF content]
```

---

## Quality Check (run before presenting)

**Hooks:**
- [ ] All 10 open with different first words and different structural devices?
- [ ] SC Practitioner hook has a specific time frame?
- [ ] Leader hook combines time pressure AND competitiveness tension — both present?
- [ ] Hooks lead with the SC problem, not with the tool?
- [ ] No em dashes, no AI slop language?
- [ ] Quality bar: would this hook stop someone mid-scroll who runs this type of task or decision?

**Caption:**
- [ ] Sentences flow with connective reasoning — no stacked fragments?
- [ ] Numbers embedded mid-sentence, not cited?
- [ ] "When NOT to use AI" sentence is task-specific?
- [ ] Human+AI boundary is explicit?
- [ ] The specific friction (Problem section) is concrete, not generic?
- [ ] Steps are specific enough to follow without the PDF?
- [ ] At least 1 pattern breaker from tiger-voice.md?
- [ ] 220–320 words?
- [ ] Reads like Tiger wrote it, not like a chatbot generated it?

**Visual (Gemini prompt):**
- [ ] Visual format matches the task type (workflow vs. framework vs. prompt template)?
- [ ] Could be sketched in 30 seconds and understood in 10?
- [ ] Consistent with visual DNA from Ep1–24?
- [ ] No negative prompts?

**PDF Draft:**
- [ ] Prompt template has all variables in [BRACKETS] with clear labels?
- [ ] "What to watch for" lists failure modes specific to this task?
- [ ] "When NOT to use AI" is task-specific?
- [ ] Tool rationale explains WHY this tool for THIS task — not generic?

---

## Token Budget
~8–12K tokens per full run (both posts). Reads tiger-voice.md, published-voice.md, 101-voice.md, CLAUDE.md Part 3, and ai-for-sc-series-tracker.md.
Single-post runs: ~5–7K tokens.
