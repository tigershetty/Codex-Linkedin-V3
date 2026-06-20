---
name: ai-for-sc
description: Use when the user runs /ai-for-sc [week] or /ai-for-sc [week] [use-case-slug]. Monthly theme model pipeline for AI for Supply Chain series. Generates two practical use-case posts per week — each for a specific SC role and AI tool — from the approved monthly topic bank. Loads tiger-voice.md, published-voice.md, 101-voice.md, and ai-for-sc-visual-dna.md before generating.
---

# /ai-for-sc Skill — AI for Supply Chain Pipeline (v3)

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
Read all of these before generating a single word. They are the intelligence base.

| File | What it provides |
|---|---|
| `tiger-voice.md` | Voice DNA — rhythm, opinion style, what to reject, pattern breakers |
| `references/published-voice.md` | Hook quality bar, "NOT THIS" list, annotated examples |
| `references/101-voice.md` | Accessible register, plain language first, adapted hook taxonomy |
| `references/ai-for-sc-plan-v2.md` | Pre-defined topic plan — load the week's two use cases (Role, Tool, Use Case, Hook direction, Visual format) |
| `references/ai-for-sc-visual-dna.md` | 50-format visual library — used now for **concept selection** (the spatial idea + Hero Number), not for writing a prompt |
| `references/render-pilot-workflow.md` | The code-render pipeline + design/technical learnings checklist — the visual is rendered, not prompted |
| `renderer/` | The deterministic HTML→PNG/MP4/GIF renderer + component-kit templates the infographic is built from |
| `data/ai-for-sc-series-tracker.md` | Episode tracking — last use case, tool, and role used |

**Read all of these before generating a single word.**

---

## Step 1: Load All Intelligence

1. Read `tiger-voice.md` — internalize:
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

4. Read `references/ai-for-sc-plan-v2.md` — extract Post A and Post B for the requested week. Note the Role, Tool, Use Case, and Hook direction for each. Do not define use cases at runtime — the plan is the source of truth.

5. Read `data/ai-for-sc-series-tracker.md` — note:
   - Last episode number
   - Which SC roles and tools have been used recently — avoid repeating the same role or tool two weeks in a row

---

## Step 2: Load Pre-Defined Use Cases

Use cases are pre-defined in `references/ai-for-sc-plan-v2.md`. Do not define them at runtime.

1. Open `references/ai-for-sc-plan-v2.md` and locate the entry for the requested week
2. Extract Post A and Post B — Role, Tool, Use Case, Hook direction
3. Cross-check `data/ai-for-sc-series-tracker.md` — confirm this episode hasn't been published already
4. Present to the user before generating anything:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 W[##] — [Theme]
 Pre-defined use cases:

 Post A (Ep[##]): [Role] + [Tool]
 → [Use Case]

 Post B (Ep[##]): [Role] + [Tool]
 → [Use Case]

 Confirm to proceed, or override a use case?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

5. If confirmed — proceed to Step 3 (hooks) for Post A
6. If the user overrides a use case — accept it and verify:
   - Different SC role from the other post
   - Different AI tool from the other post
   - Not a repeat of a role + use case already in the series tracker

Do NOT generate hooks until use cases are confirmed.

### AI Tool Selection (reference)
- **Claude** — document drafting, structured analysis, RFQ generation, compliance language, scenario framing
- **ChatGPT** — calculation, formula-based analysis, scoring models, cost comparisons, scenario modelling
- **Copilot** — Excel formulas, Power BI, Word/PowerPoint, in-file data analysis, Microsoft 365 workflows
- **Gemini** — market research, trade compliance, multi-source web search, live data

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

## Step 5: Build the Render Brief + Code-Render the Infographic

**The infographic is now rendered deterministically from code — there is NO Gemini / AI-image prompt.** Data and text are computed in HTML, never painted by a diffusion model, so the numbers are always exact and the brand is locked. The renderer lives in `renderer/` (merged from the html-render pilot). See `references/render-pilot-workflow.md` for the full pipeline and the learnings checklist.

### 5.1 Load the concept + the render kit
- Read `references/ai-for-sc-visual-dna.md` for the **concept only** — the assigned format (the plan's Visual line: Blueprint Draft, Cost Anatomy, Signal Scan, etc.) gives you the spatial idea and the Hero Number convention ("[Manual time] → [AI-assisted time]"). Use it to choose the bespoke visual concept, NOT to write a prompt.
- Skim `renderer/README.md` and an existing template (e.g. `renderer/templates/pf7-blueprint-draft.html`) — this is the component kit and the brand frame you build on. Design one bespoke concept on the same homogeneous Shetty's Desk frame ("design system, not parametrisation").

### 5.2 Write the render brief
The render brief is the content-depth layer that replaces the Gemini prompt. For this post, lock down:
- **Real data** — every number that will appear, sourced (field benchmark or stated assumption). No placeholders.
- **The bespoke visual concept** — the one dominant structure (what is where, the focal element, the Hero Number).
- **The verbatim on-canvas prompt** — the exact copy-paste prompt text shown on the infographic (the visible, usable prompt is the AI-for-SC moat).
- **A worked example** — the concrete before/after the visual demonstrates.
- **The honest limitation** — the "when NOT to use" rendered as the watch-for element.
- **The closing thesis** — the one save-worthy line.

### 5.3 Build the HTML template
Assemble a self-contained template at `renderer/templates/[use-case-slug].html` from the component kit:
- Brand frame intact: azure + eco-green + ink + Poppins, luminous on WHITE, flat. Coral = caution / cost accent only.
- **The AI tool appears only as its logo** (`renderer/assets/logos/`) plus woven into the heading ("…using Claude") — never a tool-branded palette, never a reproduced trademark.
- Big readable blocks; every number hard-coded from the brief; the verbatim prompt as a scannable stepped list; data bars that encode the real values (fills must be `display:block`); Hero Number 3–4x body text; Shetty's Desk Logo 4 (mono) in the bottom-right corner.
- Work through the learnings checklist in `references/render-pilot-workflow.md` §2.

### 5.4 Render
From `renderer/` (always use an absolute path — the shell cwd drifts):
- **Still (default):** `NODE_PATH=$(npm root -g) node render.mjs templates/[slug].html out/[slug].png`
- **Animated (only when the sequence or ambient motion earns it):** build `[slug]-anim.html` (unfold — when sequence carries meaning) or `[slug]-path.html` (ambient orbit — content static, motion decorative), then `node render-anim.mjs templates/[slug]-anim.html out/[slug]` → `out/[slug].mp4` + `out/[slug].gif`.
- QA by reading the rendered PNG (or an extracted frame) and iterating until it passes the checklist.

**Output:** `out/[use-case-slug].png` (plus `.mp4` / `.gif` if animated). No AI-image prompt is produced and no image is generated by a diffusion model — the visual is deterministic code.

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

RENDER BRIEF:
[concept + real data + verbatim on-canvas prompt + worked example + limitation + thesis]

RENDERED INFOGRAPHIC:
out/[use-case-slug].png   (+ out/[use-case-slug].mp4 / .gif if animated)

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

## Render Brief
- **Concept / format**: [bespoke visual concept + the assigned format]
- **Real data**: [every number on the canvas, sourced]
- **Hero Number**: [Manual time] → [AI-assisted time]
- **Verbatim on-canvas prompt**: [the exact copy-paste prompt shown on the image]
- **Worked example**: [the before/after the visual demonstrates]
- **Limitation (watch-for)**: [when NOT to use]
- **Thesis**: [the one save-worthy line]

## Rendered Output
- Template: `renderer/templates/[use-case-slug].html`
- Still: `renderer/out/[use-case-slug].png`
- Animated (if used): `renderer/out/[use-case-slug].mp4` + `.gif`
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

**Visual (code render):**
- [ ] Bespoke visual concept chosen from the assigned format (not defaulted to a generic grid)?
- [ ] Concept is visually distinct from the previous post in the same month?
- [ ] Every number on the canvas is real and hard-coded from the render brief (no placeholders)?
- [ ] Hero Number present ([manual] → [AI-assisted]), real, and the largest text element?
- [ ] Data bars encode the real values, with `display:block` fills (no empty tracks)?
- [ ] The verbatim copy-paste prompt is shown on the canvas as a scannable stepped list?
- [ ] AI tool appears ONLY as its logo + woven into the heading — no tool-branded palette, no reproduced trademark?
- [ ] Brand frame intact: azure / eco-green / ink / Poppins on white; coral used only for caution/cost?
- [ ] Shetty's Desk Logo 4 (mono) in the bottom-right corner?
- [ ] Rendered with `render.mjs` (and `render-anim.mjs` only if motion earns it) and QA'd by reading the PNG/frame?
- [ ] Legible at mobile size; passes the learnings checklist in render-pilot-workflow.md §2?

**PDF (if requested):**
- [ ] Prompt template has all variables in [BRACKETS] with clear labels?
- [ ] "What to watch for" lists failure modes specific to this task — not generic AI caveats?
- [ ] Tool rationale explains WHY this tool for THIS task?

---

## Token Budget
~5–8K tokens per post. ~10–14K for both posts in one run.
