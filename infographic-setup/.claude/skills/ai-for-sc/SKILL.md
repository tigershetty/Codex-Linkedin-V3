---
name: ai-for-sc
description: Use when the user runs /ai-for-sc [week] or /ai-for-sc [week] [use-case-slug]. Monthly theme model pipeline for AI for Supply Chain series. Generates two practical use-case posts per week — each for a specific SC role and AI tool — from the approved monthly topic bank. Loads tiger-voice.md, published-voice.md, and 101-voice.md before generating.
---

# /ai-for-sc Skill — AI for Supply Chain Pipeline (v2)

## Purpose
Generates AI for Supply Chain posts from practical use cases within the approved monthly theme model. One week = one theme = two posts. Each post covers a specific SC role + specific AI use case + specific tool. No fixed audience tiers — the role is determined by the task. Posts are practical, concrete, and copy-paste ready.

## Invoke
```
/ai-for-sc [week]                    → generates BOTH use-case posts for that week
/ai-for-sc [week] [use-case-slug]    → generates one specific post
```
Examples:
- `/ai-for-sc W21` → Week 21 (Procurement theme) — two practical use-case posts
- `/ai-for-sc W21 rfq-with-claude` → W21 RFQ use case only
- `/ai-for-sc W26 demand-simulation` → W26 demand simulation use case only

## Prerequisites
Read all five before generating a single word. They are the intelligence base.

| File | What it provides |
|---|---|
| `~/Claude Nano /tiger-voice.md` | Voice DNA — rhythm, opinion style, what to reject, pattern breakers |
| `references/published-voice.md` | Hook quality bar, "NOT THIS" list, annotated examples |
| `references/101-voice.md` | Accessible register, plain language first, adapted hook taxonomy |
| `infographic-setup/CLAUDE.md` Part 3 | Monthly theme model — extract the week's theme |
| `data/ai-for-sc-series-tracker.md` | Episode tracking — last use case, tool, and role used |

**Read all five before generating a single word.**

---

## Step 1: Load All Intelligence

1. Read `~/Claude Nano /tiger-voice.md` — internalize:
   - Natural rhythm: longer flowing sentences, connective tissue ("because", "so", "which means")
   - Opinion bridges: "My view on this is that...", "Here's the thing most people miss...", "If you look at the bigger picture..."
   - Pattern breakers: sentence starting with "And"/"But", parenthetical asides, varied bullet structure
   - Primary rejection: choppy AI fragments ("Short. Punchy. Done.") — NEVER
   - Hook philosophy: pattern interrupt, earns the next sentence immediately

2. Read `references/published-voice.md` — internalize:
   - Hook taxonomy: 10 hook types with specific examples
   - Voice markers: numbers embedded mid-sentence, personal frame as opener, "NOT THIS" list
   - Annotated examples: Dabbawala, McKesson, Maersk — use as the quality bar

3. Read `references/101-voice.md` — internalize:
   - Accessible register: plain language first, technical term explained second
   - The test: would the right SC person read this over coffee and recognise their own workflow?

4. Read `infographic-setup/CLAUDE.md` Part 3 — extract:
   - Month theme and week sub-topic for the requested week
   - Adjacent weeks' themes to avoid repetition

5. Read `data/ai-for-sc-series-tracker.md` — note:
   - Last episode number
   - Which SC roles and tools have been used recently — avoid repeating the same role or tool two weeks in a row

---

## Step 2: Define the Two Use Cases

For each week, identify two practical AI use cases within the week's theme. Each use case must specify:

| Field | Description |
|---|---|
| **Role** | The specific SC role this post is for. Examples: purchaser, supply planner, logistics coordinator, transport specialist, demand planner, category manager, warehouse manager, S&OP analyst. Name the role explicitly in the post. |
| **Current workflow** | What they do today and which tool they use: SAP, Excel, Power BI, email, manual research, SharePoint. Be specific. |
| **The friction** | The specific pain: takes X days, requires IT ticket, produces inconsistent results, misses variable Y, rebuilds same spreadsheet weekly. |
| **AI tool** | Claude / ChatGPT / Copilot / Grok — matched to the task type (see selection layer below). |
| **The unlock** | What changes concretely: produces the document in 20 minutes, runs the simulation, retrieves country-specific regulation, generates the checklist. |
| **Output format** | What the person gets back: a paste-ready document, a dashboard spec, a compliance checklist, a comparison table. |

### AI Tool Selection Layer
- **Claude**: Long-form document drafting, multi-step reasoning, RFQ generation, policy/compliance research, structured analysis, scenario framing, country export documentation
- **ChatGPT**: Calculation, formula-based analysis, broad data interpretation, fast iteration, image generation, supplier scoring models
- **Copilot**: Excel formulas, Power BI dashboards, Word/PowerPoint, in-file data analysis, Teams integration — anything that lives inside Microsoft 365
- **Grok**: Real-time data, news-linked research, live market signals, tariff and regulatory updates

### Use Case Selection Rules
- Use cases must serve **different SC roles** within the same week's theme — avoid two posts for the same job title in the same week
- Avoid using the **same AI tool** twice in the same week
- Check the series tracker: avoid repeating a **role + use case combination** that has already been covered
- One use case should be a **workflow task** (something the person does regularly); the other can be a **new capability** (something AI enables that wasn't feasible before)
- Use cases are defined at runtime — they are not pre-assigned. Pick the two that are most relevant, practical, and differentiated for the week's theme

If the user has pre-defined the use case (e.g., "RFQ with Claude for a purchaser"), accept it and proceed. If not, propose two use cases and get confirmation before generating.

---

## Step 3: Generate 10 Hook Options (per post)

With all voice intelligence loaded, generate 10 hooks per use case.

**New hook rule — replaces the Practitioner/Leader distinction:**

The hook must do three things simultaneously:
1. **Name the role or recognisable situation** — the right person reads this and thinks "that's me" or "that's my team"
2. **Name the current limitation** — specific enough to be credible: SAP, Excel, 3-day turnaround, manual research, IT queue, the same spreadsheet rebuilt every week
3. **Show the AI unlock** — concrete: time saved, capability added, workflow changed, document produced

The hook becomes the verbatim opening line of the published post. Test it: would the right person stop scrolling because they recognise their own friction?

| # | Hook Type | AI for SC Adaptation |
|---|---|---|
| 1 | Question-Why | "Why does [specific task] take [X days] when [AI tool] produces it in [Y minutes]?" |
| 2 | Question-How | "How do you [complete specific task] in [short time] when it used to take [longer]?" |
| 3 | Stat-Lead | Number that quantifies the before/after: time, error rate, coverage gap, cost |
| 4 | Contrarian | Challenge the assumption that [task] requires manual effort, a specialist, or an IT ticket |
| 5 | Paradox | A task that looks routine but costs more time or quality than it should |
| 6 | Personal-Reflection | "I built this workflow because my team was [doing X manually] every [week/quarter]..." |
| 7 | Result-First | Start with what AI produced — then show the method |
| 8 | Timeline-Shock | "[X hours] manually. [Y minutes] with [Tool]. Same output." |
| 9 | Comparison-Gap | Same role, same task — one using AI, one not. Different outcome. |
| 10 | Decision-Pressure | "Which of your [tasks / suppliers / lanes] would you run this on first?" |

**Hook rules (non-negotiable):**
- Each hook opens with a DIFFERENT first word
- Each hook uses a DIFFERENT structural device
- No em dashes. Use periods.
- No AI slop: unlock, game-changer, revolutionise, dive into, harness, leverage, empower, transform, navigate
- Lead with the role's situation or current tool — not with the AI tool itself
- Hook names the role either explicitly ("If you are a supply planner...") or situationally so specifically that the right person self-identifies

---

## Step 4: Write LinkedIn Caption

Single unified caption structure for all AI for SC posts. The role, tool, and friction determine what goes in each section — the structure stays constant.

```
1. HOOK (1–2 sentences)        — selected hook, verbatim
2. THE BEFORE (2 sentences)    — what this person does today without AI:
                                  specific tool (SAP, Power BI, Excel, email),
                                  specific friction, specific cost (time, quality, risk)
                                  NOT generic — "you pull data from 3 systems, rebuild the
                                  same spreadsheet, and spend the first hour just getting
                                  the numbers right"
3. WHAT AI DOES (2–3 sent.)   — concrete, starts from the friction not the tool
                                  "[Tool] takes [input], structures [process], returns
                                  [output] — in the format you'd build manually but in a
                                  fraction of the time"
4. HOW TO DO IT (3–4 steps)   — specific and copy-paste level. What they literally do.
                                  "Open [tool]. Paste this prompt: [summary]. Adjust [X].
                                  Get [output]."
5. TOOL + WHY (1 sentence)     — "[Tool] because [one-line rationale tied to THIS task]"
                                  Not "because AI is powerful" — because "RFQ documents
                                  need coherent multi-section structure that holds across
                                  6 supplier types"
6. WHEN NOT TO USE (1 sent.)   — one specific condition where this fails or where human
                                  judgement is non-negotiable
7. WHAT YOU GET (1 sentence)   — output format: what they can act on, screenshot, or hand on
8. CTA                         — "Try this before your next [specific trigger]."
9. SIGN-OFF + HASHTAGS
```

**Word count**: 220–320 words.

### Caption Rules (non-negotiable)
- Sentences flow with connective reasoning — no stacked fragments
- Numbers embedded mid-sentence ("cuts the process from 3 days to 20 minutes"), not appended as citations
- At least 1 pattern breaker per post: sentence starting with "And" or "But", parenthetical aside, or a sentence running longer than feels optimal when working through an idea
- Human+AI boundary must be explicit: what AI produces vs. what the person validates, adjusts, and decides
- No ANCHORS labels, no citation format, no em dashes
- Bullet points use • not -
- AI must not be positioned as replacing judgement — it handles the production or research layer; the SC professional owns the decision
- Sign-off: "Follow Poornajith Shetty and Shetty's Desk for more supply chain insights and save this for [specific reference use]."
- Hashtags: #ShettysDesk #SupplyChainIntelligence #SCM #AIforSupplyChain + 1 topic-specific tag (5 max)

---

## Step 5: Generate Gemini Prompt (Infographic Visual)

The visual must be immediately readable and task-specific. Match the format to the use case type.

| Use case type | Visual format |
|---|---|
| Workflow task (RFQ, documentation, report) | Step-by-step horizontal flow OR paste-ready prompt template |
| Research/compliance (export docs, regulations, Incoterms) | Decision tree OR reference cheat sheet by condition |
| Analysis/simulation (demand swings, capacity, scenarios) | Before/after comparison OR capacity model with formula |
| New capability (agentic, continuous monitoring) | Architecture diagram (simplified) OR outcome map |

Build the Gemini prompt using this exact template. The VISUAL ANCHOR block is mandatory.

**VISUAL ANCHOR rules:**
- 3–5 sentences only. Placed between THE QUESTION THIS ANSWERS and VISUAL STRUCTURE.
- Describes one dominant visual metaphor with spatial specificity — how the layout feels, what dimensional quality it has, what the focal element is, where the eye goes first.
- Names the single most important element on the canvas.
- No colour instructions — the brand anchor image handles colour. No narrative prose about the concept. No NEGATIVE block.

```
Task: Create an infographic image for the summary below (after the rules).

Rules: Use the image attached as a reference on style, aesthetics, colours, and illustration technique. Use a different layout for the structure to elaborate details based on the summary. Do not use any information or text from the attached image — only style. Use it only for inspiration. Aspect ratio 1:1, resolution 2048x2048.

TOPIC: [Topic name — role-specific, task-focused]
THE QUESTION THIS ANSWERS: [The specific friction or capability gap this post addresses]

VISUAL ANCHOR: [3–5 sentences. Name the dominant visual metaphor and dimensional concept — how the layout is rendered in space, what quality it has, what the single focal element is, where the eye goes first. No colour instructions. No concept explanation.]

VISUAL STRUCTURE: [1–2 sentences. Name the dominant layout and spatial logic — what is on left/right/top/bottom/centre, what the focal point is. Match the format to the use case type.]

CONTENT TO INCLUDE ON THE IMAGE:
- Heading: "[Short heading, max 8 words]" (Bold)
- [Named section — use spatial labels: LEFT / RIGHT / TOP / CENTRE / STEP 1 / etc.]:
  - [Label]: [2–3 word value — not sentences]
  - [Label]: [2–3 word value]
- [Annotation — the key insight. One sentence, specific.]
- Tool badge: "[Tool name]" — bottom right corner

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

---

## Step 6: Present & PDF Gate

Present for each post in this format:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 AI FOR SUPPLY CHAIN — W[##] · [Theme]
 POST [A/B]: [Role] — [Use case name]
 Tool: [Tool name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10 HOOK OPTIONS:
1.  [Question-Why]:        "[text]"
...

LINKEDIN CAPTION (using hook [#] as placeholder):
[full caption]

GEMINI PROMPT (paste-ready):
[full prompt]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pick a hook (1–10). Adjust caption if needed.
Would you like a PDF draft for this post? (Yes / No)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

After the user confirms hook selection and PDF decision: save files, then present Post B (if running both).

---

## Step 7: Write PDF Draft (if requested)

Five pages. Written as structured markdown for Canva or Gamma.

```markdown
# [Task Name] — AI for Supply Chain
**Tool**: [Tool name]
**Role**: [SC role this is for]
**Week**: [YYYY-W##]
**Theme**: [Monthly theme]
**Series**: AI for Supply Chain — [Theme] Edition

---

## Page 1 — Cover
**Title**: [Task name — action-oriented, max 8 words]
**Subtitle**: [What problem this solves in one line]
**Tool**: [Tool name]
**Series tagline**: "One role. One tool. One paste-ready workflow."

---

## Page 2 — The Problem (Without AI)
[2–3 paragraphs. The specific friction in Tiger's voice — flowing, connected, specific.
What this task looks like manually: the time it takes, where the quality drops,
what gets missed, why it matters to this specific role.]

---

## Page 3 — The Full Prompt Template
**When to use**: [The specific trigger — before which task, meeting, or deadline]
**Paste into**: [Tool name + where to find it]

[FULL PROMPT — all variable inputs clearly labelled in [BRACKETS]]

**Inputs to fill in before pasting:**
| [BRACKET] | What it is | Where to find it |
|---|---|---|
| [BRACKET 1] | [description] | [source] |

---

## Page 4 — Tool Notes
**Why [Tool] for this task**: [One paragraph — specific to this task, not generic AI praise]

**What to watch for**:
• [Specific failure mode 1 for this task]
• [Specific failure mode 2]
• [When the output looks right but misleads]

**If [Tool] doesn't work**: Try [Alternative] when [specific condition].

---

## Page 5 — What You Get Back + Tips
**Expected output**: [Format, length, structure of what AI returns]

**What to do with it**:
1. [Validate X]
2. [Adjust Y for your context]
3. [Use in Z]

**Common mistakes**:
• [Most common reason for bad output on this specific task]
• [Second mistake]

**When NOT to use AI here**: [One specific condition where human judgement is non-negotiable]
```

---

## Step 8: Save

After hook confirmed and PDF decision made:

1. Write `data/{YYYY-W##}/{use-case-slug}/ai-for-sc-[use-case-slug].md`
2. Write `data/{YYYY-W##}/{use-case-slug}/ai-for-sc-[use-case-slug]-pdf.md` (only if PDF requested)
3. Update `data/ai-for-sc-series-tracker.md` — add new entry with episode number, role, tool, use case slug, week

---

## Output File Structure

### ai-for-sc-[use-case-slug].md

```markdown
# AI for SC — [use-case-slug]
**Week**: [YYYY-W##]
**Theme**: [Monthly theme]
**Role**: [SC role]
**Tool**: [AI tool]
**Episode**: Ep[#]

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

### ai-for-sc-[use-case-slug]-pdf.md

```markdown
# PDF Draft — [use-case-slug]
**Week**: [YYYY-W##]
**Role**: [SC role]
**Tool**: [Tool name]

---

[Full 5-page PDF content]
```

---

## Quality Check (run before presenting)

**Use Cases:**
- [ ] Two different SC roles — not the same job title twice in the same week?
- [ ] Two different AI tools — not the same tool twice?
- [ ] Neither use case repeats a role + task combination already in the series tracker?
- [ ] One use case is a regular workflow task; the other adds a new capability?

**Hooks:**
- [ ] All 10 open with different first words and different structural devices?
- [ ] Hook names the role or situation specifically enough to self-identify?
- [ ] Hook names the current limitation (specific tool or manual process)?
- [ ] Hook shows the AI unlock concretely?
- [ ] No em dashes, no AI slop?
- [ ] Would the right person stop mid-scroll because they recognise their own workflow?

**Caption:**
- [ ] THE BEFORE names the actual current tool (SAP, Excel, Power BI, email) — not generic friction?
- [ ] WHAT AI DOES starts from the friction, not the tool?
- [ ] HOW TO DO IT is specific enough to follow without the PDF?
- [ ] "When NOT to use AI" is task-specific (not generic)?
- [ ] Human+AI boundary is explicit?
- [ ] At least 1 pattern breaker from tiger-voice.md?
- [ ] 220–320 words?
- [ ] Reads like Tiger wrote it — flowing, connected, specific?
- [ ] Bullets use • not -?

**Visual (Gemini prompt):**
- [ ] Visual format matches the use case type?
- [ ] Could be sketched in 30 seconds and understood in 10 seconds by someone outside SC?
- [ ] VISUAL ANCHOR is present, specific, and names the focal element?
- [ ] No negative prompts?

**PDF (if requested):**
- [ ] Prompt template has all variables in [BRACKETS] with clear labels?
- [ ] "What to watch for" lists failure modes specific to this task — not generic AI caveats?
- [ ] Tool rationale explains WHY this tool for THIS task?

---

## Token Budget
~5–8K tokens per post. ~10–14K for both posts in one run.
