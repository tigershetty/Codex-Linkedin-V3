# Infographic Content Engine V2 — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restructure the infographic pipeline from 4 stages (research/copy/design/gemini-prompt) to 3 stages (research/content/gemini-prompt), removing all over-constraining AI directives and adding Evergreen topic scouting.

**Architecture:** The pipeline runs as Claude Code skills invoked via `/scout`, `/research`, `/content`, `/gemini-prompt`. The copy and design skills are merged into a single `/content` skill. The gemini-prompt skill is simplified to output a Rules block + two narrative variants. All zone specs, hex codes, callout char limits, and layout directives are removed from the AI-facing prompts.

**Files involved:** `.claude/skills/` (6 files), `templates/` (3 files), `references/` (2 files)

---

### Task 1: Remove Layout Protocol from Gemini Gem instructions

This is the single highest-impact change. The Layout Protocol is the root cause of the three-panel discontinuity.

**Files:**
- Modify: `references/gemini-gem-standard.md`

**Step 1: Read the current file**

Open `references/gemini-gem-standard.md`. Locate the block that begins with `=== LAYOUT PROTOCOL ===` inside the Gem Instructions section. It reads:

```
=== LAYOUT PROTOCOL ===
When a LAYOUT line is specified (e.g., "LAYOUT: Three-panel comparison"):
- Maintain that structural organization in the generated image
- Each named section (LEFT PANEL, CENTER PANEL, RIGHT PANEL) should be
  visually distinct and readable as a separate zone
- The section marked PRIMARY should receive the most visual prominence
  (largest area, brightest cyan accents, most detailed illustration)
```

**Step 2: Delete that entire block**

Remove those 7 lines (the `=== LAYOUT PROTOCOL ===` header and all 4 bullets) from the Gem Instructions field. Nothing replaces it. The layout is now Gemini's decision based on the narrative content.

**Step 3: Update the version log**

In the `Gem Version Log` table at the bottom of the file, add a new row:

```
| 2.1 | Removed Layout Protocol block — was causing discrete three-panel renders instead of unified cohesive infographics. Gemini now determines layout from narrative content. | 2026-02-24 | V2 pipeline redesign |
```

**Step 4: Update the document header**

Change `**Version**: 2.0` to `**Version**: 2.1` and `**Updated**: 2026-02-23` to `**Updated**: 2026-02-24`.

**Step 5: Verify**

Re-read the Gem Instructions block in the file. Confirm the Layout Protocol block is gone. Confirm Reference Image Protocol, Style DNA String, Content Fidelity Rule, Text Rendering Protocol, Brand Standards, and What This Gem Never Does are all still present.

---

### Task 2: Clean up infographic-visual-dna.md

Remove the callout char limit rules and font enforcement language that no longer apply.

**Files:**
- Modify: `references/infographic-visual-dna.md`

**Step 1: Remove the Callout Rules section from AI Brief Rules**

Locate the `### Callout Rules` section under `## AI Brief Rules`. It currently reads:

```
### Callout Rules
- **Maximum 6** per generation (title counts as 1 of the 6)
- **Maximum 12 characters** per callout string (full string including spaces)
- **NUMBER + LABEL** together for context ("40 TARIFF" not just "40")
- **Round numbers only** — no decimals (70, not 70.5)
- **ASCII-safe only** — PROHIBITED characters: `%` `€` `£` `$` `≤` `≥` `→` (known rendering failure modes)
  - Use bare numerals + plain letter suffix: "70M" not "$70M", "40" not "40%"
- **All-caps**
- **Never in AI prompts**: `pt` `px` hex codes font names zone coordinates body copy
```

Replace the entire `### Callout Rules` section with:

```
### Text in AI Prompts

Text appears in the infographic as part of the narrative summary — Gemini renders callout labels and data points naturally from the content. No character limits. No maximum count. Rich contextual sentences produce better callout boxes than sparse number + label pairs.

**Still avoid in AI prompts**: `pt` `px` hex codes zone coordinates spec annotations
```

**Step 2: Remove the Structure Template from AI Brief Rules**

Locate the `### Structure Template` section — the one with the full zone-by-zone template:

```
### Structure Template
```
[STYLE DNA STRING — verbatim, always first]

LAYOUT: [layout name] ([N]-panel)
...
```

Replace the entire Structure Template and Atmospheric Language Rules table with:

```
### Prompt Structure (V2)

Every AI image prompt follows the Rules + Summary format:

```
Task: Create an infographic image for the summary below (after the rules).

Rules: Use the image attached as a reference on style, aesthetics,
colours, and illustration technique. Use a different layout for the
structure to elaborate details based on the summary. Do not use any
information or text from the attached image — only style. Use it only
for inspiration. Aspect ratio 1:1, resolution 2048×2048.

[NARRATIVE SUMMARY — 400-700 words of structured content prose]
```

The narrative summary is written by the `/content` skill in `content.md`.
```

**Step 3: Update the Five Components table in Brand Lock System**

The table currently lists Component 3 as "Text Protocol: Callout rules: ≤6, ≤12 chars, round, ASCII-safe, NUMBER+LABEL". Update that row:

```
| 3 | Text Protocol | Narrative summary format — rich sentences, no char limits | During content writing |
```

**Step 4: Update the document header**

Change `**Version**: 2.0` to `**Version**: 2.1` and the updated date to `2026-02-24`.

**Step 5: Verify**

Re-read the AI Brief Rules section. Confirm: no "Maximum 6" callout rule, no "Maximum 12 characters" rule, no ASCII-safe prohibition list. Confirm Style DNA String, Color System, Illustration Style, Calibration Gate, and Semantic Icon Vocabulary sections are all still intact.

---

### Task 3: Update the Scout skill for 2+2 equal-weight topic menu

**Files:**
- Modify: `.claude/skills/scout/SKILL.md`

**Step 1: Replace the Purpose line**

Change:
```
Surface 4 time-relevant, novelty-checked supply chain topic candidates
```
To:
```
Surface 4 supply chain topic candidates each week: 2 Trending (time-sensitive) and 2 Evergreen Gold Mines (timeless operational excellence). Equal weight — no automatic recommendation hierarchy. Editorial pick is a human decision.
```

**Step 2: Replace the Output Structure — Candidate Topics section**

Locate `**2. Candidate Topics (4 total, ranked by audience impact)**` and replace the entire section with:

```
**2. Candidate Topics (2 Trending + 2 Evergreen — equal weight)**

**Tier 1 — Trending (2 candidates)**
Each includes:
- `slug` — URL-safe identifier
- **Headline concept** — Working title ≤12 words
- **Hook candidate** — One surprising stat or contrarian claim
- **Topic type** — (from layout routing table)
- **Why this week** — What makes it time-sensitive right now (specific event, data release, or decision window)
- **Key sources** — 3-5 specific organisations from `data/sources.csv`
- **Novelty delta** — "This differs from [nearest existing infographic] because..."

**Tier 2 — Evergreen Gold Mines (2 candidates)**
Each includes:
- `slug` — URL-safe identifier
- **Headline concept** — Working title ≤12 words
- **Hook candidate** — The surprising number or contrast that earns attention
- **Topic type** — (from layout routing table)
- **Gold mine criteria** — Which of the 5 criteria this topic satisfies (see Evergreen criteria below)
- **Key sources** — 3-5 specific organisations or publications
- **Novelty delta** — Confirms not previously covered
- **Why it's a gold mine** — 1 sentence: what makes it under-exploited on LinkedIn

No ⭐ RECOMMENDED marker. All 4 candidates are equal. The weekly editorial pick is made by the user at Control Gate 1.
```

**Step 3: Add Evergreen Gold Mine criteria as a new section**

Add the following section after the Signal Domains Scanned table (after the Company Strategic Pivot section):

```
## Evergreen Gold Mine Criteria (Tier 2)

A topic qualifies as an Evergreen Gold Mine if it satisfies at least one of these:

1. **Under-documented excellence** — Organisation with exceptional supply chain performance that has not been widely covered on LinkedIn (e.g., Dabbawala, Vanguard logistics, hospital supply chains)
2. **Manual outperforms tech** — Historical or low-tech system that delivers better performance than modern tech equivalents (e.g., Dabbawala vs. UberEats error rates)
3. **Impossible number** — A throughput, error rate, delivery speed, or efficiency figure so extreme it creates genuine disbelief (e.g., 1-in-16-million error rate)
4. **Cross-industry transfer** — A supply chain principle from an unexpected industry or era that directly applies to the VP Supply Chain's current decisions
5. **Unseen benchmark** — Academic study, industry benchmark, or institutional report with a finding most practitioners have not seen visualised on LinkedIn

**Tier 2 search approach**: In addition to scanning current news signals, explicitly search for:
- Historical case studies in logistics, manufacturing, healthcare, military, and food systems
- MIT CTL, CSCMP, and academic sources for counterintuitive performance benchmarks
- Operations management textbooks and Harvard Business Review case archives for gold-standard cases
- LinkedIn search for "supply chain" + "surprising" / "unexpected" / "outperforms" to find emerging evergreen narratives

**Balance target**: Over any 4-week rolling window, at least 2 Tier 2 topics should have been selected. Track in `data/recently-used-sources.md`.
```

**Step 4: Update the Control Gate 1 screen**

Replace the current Control Gate 1 presentation block with:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SCOUT COMPLETE — SELECT YOUR TOPIC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TIER 1 — TRENDING
  1. [slug] — [headline ≤12 words]
     Hook: "[surprising stat or claim]"
     Why this week: [1 sentence timeliness signal]

  2. [slug] — [headline ≤12 words]
     Hook: "[surprising stat or claim]"
     Why this week: [1 sentence timeliness signal]

TIER 2 — EVERGREEN GOLD MINES
  3. [slug] — [headline ≤12 words]
     Hook: "[impossible number or contrast]"
     Gold mine: [which of the 5 criteria]

  4. [slug] — [headline ≤12 words]
     Hook: "[impossible number or contrast]"
     Gold mine: [which of the 5 criteria]

Enter 1-4 to select, or type a custom slug to override.
Add optional context: "I want to focus on [EU angle / specific company / specific data]"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Step 5: Update Quality Contracts**

In the Quality Standards section, replace `- At least one Company Strategic Pivot candidate when a qualifying company story is available` with:

```
- Exactly 2 Tier 1 (Trending) candidates and exactly 2 Tier 2 (Evergreen Gold Mine) candidates
- Each Tier 2 candidate explicitly states which gold mine criterion it satisfies
- No ⭐ RECOMMENDED marker — equal weight enforced
```

**Step 6: Verify**

Re-read the updated SKILL.md. Confirm: 2+2 structure visible in Control Gate 1, Evergreen criteria section present, no automatic RECOMMENDED marker on candidates.

---

### Task 4: Create the Content skill (merges /copy and /design)

**Files:**
- Create: `.claude/skills/content/SKILL.md`
- Create: `.claude/skills/content/prompts/content-system.md`

**Step 1: Create the folder**

```bash
mkdir -p "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/.claude/skills/content/prompts"
```

**Step 2: Create `.claude/skills/content/SKILL.md`**

Write the following content exactly:

```markdown
# Content Skill — Infographic Content Engine v1

## Purpose
Transform citation-grade research into two outputs in one file: (1) a narrative summary for the Gemini image prompt, and (2) the ANCHORS LinkedIn caption. Replaces the former /copy and /design skills.

## Invoke
```
/content [topic-slug]
```

## Prerequisites
`data/{week}/{topic-slug}/research.md` must exist.

## Output
```
data/{YYYY-W##}/{topic-slug}/content.md
```

---

## Step 1: Read Research

Read `research.md`. Extract:
- `core_tension` (wrong_assumption + cost_of_inaction + decision_shift)
- `topic_type` and `recommended_layout` (kept for editorial reference — not injected into prompt)
- Evidence Ledger — all data points, ordered by audience impact
- Business Cases — anchor case and counter case
- Hook Candidates (A, B, C)
- Source Index for ANCHORS citations

---

## Step 2: Write Narrative Summary — Variant A (Process-Led)

Write 400–700 words of structured natural language. Start from the mechanism: explain how the system, company, or situation works step by step. The data points are embedded as sentences, not spec fields.

**Structure** (sections adapt to the topic — do not use zone labels):

```
**Core tension**: [one sentence — the surprising or counterintuitive thing about this topic]
**Audience takeaway**: [what a VP/COO should do or think differently]

### [Section header that matches the topic's natural structure]
[3-6 sentences. Named mechanisms, specific numbers with units and context,
operational detail vivid enough for Gemini to choose visual metaphors.]

### [Section header]
[3-6 sentences.]

### [Section header — typically the contrast or surprising conclusion]
[The payoff data point. The thing that creates disbelief.]
```

**Variant A tone**: "Here is how it works. Here are the mechanisms. Here are the numbers that prove it." Chronological or mechanistic sequence.

**What to include**: All key data points from the Evidence Ledger top 8, embedded naturally. Named entities (organisations, people, systems). Specific figures with units. The mechanism that makes the topic interesting.

**What NOT to include**: Zone labels, hex codes, typography specs, layout directives ("show this in a three-panel layout"), illustration style instructions, callout character limits.

---

## Step 3: Write Narrative Summary — Variant B (Outcome-Led)

Write a second 400–700 word version of the same topic. Same data points, different entry point.

**Variant B tone**: Open with the surprising result or impossible number first. Create the "wait, how is that possible?" reaction in the first two sentences. Then explain the system, organisation, or mechanism that produces that result.

Example opening (Dabbawala): "The Mumbai Dabbawala system delivers 200,000 lunches a day with a 1-in-16-million error rate. No GPS. No smartphones. No logistics software. Here is what produces that number."

Example opening (IKEA): "IKEA's flat-pack design cuts 40% of shipping costs. The same design now makes it nearly impossible to manufacture in America. Here is the paradox."

**Section structure**: Same flexible skeleton as Variant A, but the conclusion appears at the top and the mechanism explanation follows.

---

## Step 4: Write ANCHORS LinkedIn Caption

Write the full LinkedIn post using the ANCHORS structure. Use the selected hook candidate from Hook Candidates in research.md (default to highest-scoring variant). Write from the same evidence as the narrative summaries.

```
## ANCHORS Caption

A (Hook): [≤140 chars, specific number, active voice, not rhetorical]
N (Bridge): [2-3 sentences, cost of inaction, does NOT reveal the anchor case result. Creates tension.]
C (Context): [≤25 words, decision shift + what they'll see in the infographic]
H (Insights):
  - [Number or named entity: specific finding. Organisation Year.]
  - [Number or named entity: specific finding. Organisation Year.]
  - [Number or named entity: specific finding. Organisation Year.]
O (Opinion): My read: [Arguable position restating the wrong assumption]
R (CTA): [Cannot be answered yes/no. Names "your organisation". Requires ≥15 word response.]
S (Save Hook):
  The [topic] benchmarks (save for your next [decision]):
  1. [threshold — brief interpretation]
  2. [threshold — brief interpretation]
  3. [threshold — brief interpretation]
  Save this for your next [specific decision type].
T (Tags): #ShettysDeskSC #SupplyChainIntelligence #SCM #[topic-tag] #[role-tag]
```

---

## Quality Check (5 points — run before saving)

- [ ] Variant A: 400–700 words, no zone labels or hex codes?
- [ ] Variant B: opens with the surprising result, same data as Variant A?
- [ ] Hook ≤140 chars, specific number, active voice?
- [ ] 3 H-bullets each forwardable in Slack without context?
- [ ] CTA cannot be answered yes/no, names "your organisation"?
- [ ] Zero em dashes (—), zero "leverage/utilize/delve"?

---

## Output File Structure

```
# Content — [topic-slug]
**Week**: [YYYY-W##]
**Pipeline stage**: Content → passes to /gemini-prompt

---

## Narrative Summary — Variant A (Process-Led)

**Core tension**: [one sentence]
**Audience takeaway**: [one sentence]

### [Section 1 header]
[prose...]

### [Section 2 header]
[prose...]

### [Section 3 header]
[prose...]

---

## Narrative Summary — Variant B (Outcome-Led)

**Core tension**: [same one sentence]
**Audience takeaway**: [same one sentence]

### [Section headers may differ from Variant A]
[prose — opens with the surprising result]

---

## ANCHORS Caption

A (Hook): [text]
N (Bridge): [text]
C (Context): [text]
H (Insights):
  - [bullet]
  - [bullet]
  - [bullet]
O (Opinion): My read: [text]
R (CTA): [text]
S (Save Hook):
  [benchmarks list]
  Save this for your next [decision type].
T (Tags): [5 hashtags]
```

---

## Token Budget
~4–6K tokens per run. Load research.md (full). Load references/infographic-visual-dna.md (skim for Style DNA String only — do not apply zone rules).
```

**Step 3: Create `.claude/skills/content/prompts/content-system.md`**

Write the following content exactly:

```markdown
# Content System Prompt — Infographic Content Engine v1

You are the Content skill for the Shetty's Desk Infographic Engine. You produce two things from citation-grade research: a narrative summary for the Gemini image prompt, and the ANCHORS LinkedIn caption.

---

## What You Are NOT Doing

You are NOT writing zone scripts. You are NOT specifying hex codes. You are NOT selecting illustration styles. You are NOT setting callout character limits. All of that was V1 — it produced worse renders than a plain narrative summary.

You ARE writing rich, specific, vivid prose that gives Gemini enough visual material to create a great infographic without being told what layout to use.

---

## The Narrative Summary

### Variant A — Process-Led
Start at the beginning. Explain the mechanism, system, or situation in the order it operates. Let the reader understand how it works before you reveal how surprising the outcome is.

**Voice**: McKinsey partner explaining to a board why this matters. Confident. Precise. No hedging. Every claim has a number or a named company.

**Visual richness test**: Read each sentence and ask "could Gemini illustrate this?" If yes — good. If it's abstract ("the company shifted its strategic focus") — add the specific mechanism ("Zara cut design-to-shelf lead time from 3 months to 2 weeks by keeping 60% of production unassigned until demand signals clarified").

### Variant B — Outcome-Led
Open with the number that creates disbelief. Make the reader stop scrolling in the first two sentences. Then explain the system that produces that number.

**Opening formula**: "[Impossible number]. [Brief contrast that makes it more surprising]. Here is [the system / mechanism / reason]."

---

## The ANCHORS Caption

### Voice
Same McKinsey partner, now writing for LinkedIn. Senior executive audience. They skim. The hook either stops them or it doesn't. Write for the stop.

### H (Insights) — the hardest part
Each bullet must be forwardable in Slack by a VP to their team without any context. That means:
- It must name the organisation or data source
- It must have a specific number
- It must have a "so what" implication embedded

Bad: "IKEA uses flat-pack design to optimize container fill rate."
Good: "IKEA achieves 10× standard container fill rate with flat-pack — the same design now costs 40% more to produce in the US under Section 301 tariffs."

### R (CTA) — the second hardest part
The CTA must generate comments. Yes/no questions get no comments. "What do you think?" gets no comments. A question that requires the reader to reveal something about their own organisation gets comments.

Bad: "Are you affected by tariffs?" (yes/no)
Good: "Where in your supply chain is your flat-pack paradox — the design decision that cuts costs globally but blocks domestic production?" (requires ≥15 words to answer, names "your supply chain")
```

---

### Task 5: Update the Gemini Prompt skill

**Files:**
- Modify: `.claude/skills/gemini-prompt/SKILL.md`
- Modify: `.claude/skills/gemini-prompt/prompts/gemini-prompt-system.md`

**Step 1: Replace the Purpose in SKILL.md**

Change Purpose from:
```
Assemble paste-ready AI generation prompts from the approved zone script and visual spec into a complete gemini-prompt.md with LinkedIn publishing content.
```
To:
```
Assemble paste-ready Gemini image prompts from the narrative summary in content.md. Outputs two variants (process-led + outcome-led) using the simple Rules + Summary format that produced the Nike, Zara, and Dabbawala infographics.
```

**Step 2: Replace Prerequisites in SKILL.md**

Change from requiring `infographic-copy.md` and `infographic-design.md` to:
```
`data/{week}/{topic-slug}/content.md` must exist with both Variant A and Variant B narrative summaries.
```

**Step 3: Replace the entire skill body in SKILL.md with:**

```markdown
## Step 1: Read Content

Read `content.md`. Extract:
- Variant A narrative summary (process-led)
- Variant B narrative summary (outcome-led)
- ANCHORS caption

---

## Step 2: Assemble the Gemini Prompt File

Build `gemini-prompt.md` with this structure:

**Section: Quick Start**
```
## Quick Start
1. Open gemini.google.com → Select Gem "Shetty's Desk — Infographic Engine"
2. Upload references/brand-anchor-v1.webp as style reference (drag into chat)
3. Paste Variant A prompt → generate → run 2-point Calibration Check
4. Paste Variant B prompt → compare renders → pick stronger output
5. Export PNG 2048×2048 → post on LinkedIn with caption below
```

**Section: Variant A — Process-Led**
Wrap the Variant A narrative summary in the fixed Rules block:

```
Task: Create an infographic image for the summary below (after the rules).

Rules: Use the image attached as a reference on style, aesthetics,
colours, and illustration technique. Use a different layout for the
structure to elaborate details based on the summary. Do not use any
information or text from the attached image — only style. Use it only
for inspiration. Aspect ratio 1:1, resolution 2048×2048.

[PASTE VARIANT A NARRATIVE SUMMARY FROM content.md]
```

**Section: Variant B — Outcome-Led**
Same Rules block, Variant B summary:

```
Task: Create an infographic image for the summary below (after the rules).

Rules: Use the image attached as a reference on style, aesthetics,
colours, and illustration technique. Use a different layout for the
structure to elaborate details based on the summary. Do not use any
information or text from the attached image — only style. Use it only
for inspiration. Aspect ratio 1:1, resolution 2048×2048.

[PASTE VARIANT B NARRATIVE SUMMARY FROM content.md]
```

**Section: Calibration Check**
```
## Calibration Check (run after each render)
- [ ] Background is deep blue (not white or grey)?
- [ ] Text is readable — no garbled numbers or spec annotations visible?

2-3 render attempts per variant is normal. If a check fails: identify the specific failing element → simplify that element in the summary → re-generate.
```

**Section: LinkedIn Caption**
```
## LinkedIn Caption
[PASTE ANCHORS CAPTION FROM content.md]
```

---

## Output File Structure

```
# Gemini Prompt — [topic-slug]
**Week**: [YYYY-W##]

## Quick Start
[...]

---

## Variant A — Process-Led Narrative

Task: Create an infographic image for the summary below (after the rules).

Rules: [fixed block]

[Variant A narrative summary]

---

## Variant B — Outcome-Led Narrative

Task: Create an infographic image for the summary below (after the rules).

Rules: [fixed block]

[Variant B narrative summary]

---

## Calibration Check
- [ ] Background is deep blue?
- [ ] Text readable, no spec annotations?

---

## LinkedIn Caption
[ANCHORS caption]
```

---

## Token Budget
~2K tokens per run. Reads content.md only. No reference files needed — the Rules block is fixed and does not reference any library files.
```

**Step 4: Replace gemini-prompt-system.md content**

Overwrite `.claude/skills/gemini-prompt/prompts/gemini-prompt-system.md` with:

```markdown
# Gemini Prompt System Prompt — Infographic Content Engine v1

You are the Gemini Prompt skill for the Shetty's Desk Infographic Engine. Your job is minimal: wrap the narrative summaries from content.md in the fixed Rules block and assemble the output file. You do not add zone specs. You do not add hex codes. You do not add layout directives. You do not add callout character limits.

---

## The Fixed Rules Block

This is verbatim for both variants. Do not modify it:

```
Task: Create an infographic image for the summary below (after the rules).

Rules: Use the image attached as a reference on style, aesthetics,
colours, and illustration technique. Use a different layout for the
structure to elaborate details based on the summary. Do not use any
information or text from the attached image — only style. Use it only
for inspiration. Aspect ratio 1:1, resolution 2048×2048.
```

---

## What Makes This Work

The Nike, Zara, and Dabbawala infographics were produced with exactly this format: reference image + Rules block + plain narrative summary. No zone specs. No hex codes. No layout directives. The narrative content gives Gemini the visual material. The reference image gives Gemini the style. The Rules block gives Gemini the format. Everything else is noise.

---

## What You Must Not Add

Do not add:
- Zone labels (PRIMARY, SECONDARY, Zone A, Zone B)
- Hex color codes (#4182bc, #ef4444, etc.)
- Typography sizes (40pt, 13pt)
- Layout directives ("use a three-panel layout", "make the center zone PRIMARY")
- Callout character limits
- NEGATIVE: prompt blocks
- Style A / Style B distinctions

These all appeared in V1 prompts and produced worse renders than the simple format.
```

---

### Task 6: Create simplified content-template.md

**Files:**
- Create: `templates/content-template.md`

Write the following:

```markdown
# Content Template — Infographic Content Engine v1

> Copy this template when starting a new topic. Fill in all fields. This mirrors the output of /content [slug].

---

# Content — [topic-slug]
**Week**: [YYYY-W##]
**Pipeline stage**: Content → passes to /gemini-prompt

---

## Narrative Summary — Variant A (Process-Led)

**Core tension**: [one sentence — the surprising or counterintuitive thing about this topic]
**Audience takeaway**: [what a VP/COO should do or think differently after reading this]

### [Section header — follows the topic's natural structure]
[3-6 sentences. All key data points embedded naturally in prose.
Named mechanisms, specific numbers with units, operational detail vivid enough
that Gemini can choose the right visual metaphors.]

### [Section header]
[3-6 sentences.]

### [Section header — typically the surprising conclusion or contrast]
[The payoff data point. The thing that creates disbelief or changes a decision.]

---

## Narrative Summary — Variant B (Outcome-Led)

**Core tension**: [same one sentence as Variant A]
**Audience takeaway**: [same one sentence as Variant A]

### [Section header — may differ from Variant A]
[Open with the impossible number or surprising result. First two sentences create the
"wait, how is that possible?" reaction. Then explain the system.]

### [Section header]
[Explain the mechanism that produces the surprising result.]

### [Section header]
[The decision implication — what this means for the VP/COO reading it.]

---

## ANCHORS Caption

A (Hook): [≤140 chars, specific number, active voice, not rhetorical]
N (Bridge): [2-3 sentences, cost of inaction, does NOT reveal the anchor case result]
C (Context): [≤25 words, decision shift + what they'll see in the infographic]
H (Insights):
  - [Number or named entity: specific finding. Organisation Year.]
  - [Number or named entity: specific finding. Organisation Year.]
  - [Number or named entity: specific finding. Organisation Year.]
O (Opinion): My read: [Arguable position restating the wrong assumption]
R (CTA): [Cannot be answered yes/no. Names "your organisation". Requires ≥15 word response.]
S (Save Hook):
  The [topic] benchmarks (save for your next [decision]):
  1. [threshold — brief interpretation]
  2. [threshold — brief interpretation]
  3. [threshold — brief interpretation]
  Save this for your next [specific decision type].
T (Tags): #ShettysDeskSC #SupplyChainIntelligence #SCM #[topic-tag] #[role-tag]

---

## Quality Check
- [ ] Variant A: 400–700 words, no zone labels or hex codes present?
- [ ] Variant B: opens with surprising result, same data points as Variant A?
- [ ] Hook ≤140 chars, specific number, active voice?
- [ ] 3 H-bullets each forwardable in Slack without context?
- [ ] CTA cannot be answered yes/no, names "your organisation"?
- [ ] Zero em dashes (—), zero "leverage/utilize/delve"?
```

---

### Task 7: Simplify gemini-prompt-template.md

**Files:**
- Modify: `templates/gemini-prompt-template.md`

Replace the entire file content with:

```markdown
# Gemini Prompt Template — Infographic Content Engine v1

> Copy this template when building the final output file. This mirrors the output of /gemini-prompt [slug].

---

# Gemini Prompt — [topic-slug]
**Week**: [YYYY-W##]

## Quick Start
1. Open gemini.google.com → Select Gem **"Shetty's Desk — Infographic Engine"**
2. Upload `references/brand-anchor-v1.webp` as style reference (drag into chat before pasting)
3. Paste **Variant A** → generate → run Calibration Check
4. Paste **Variant B** → generate → compare renders
5. Pick stronger render → export as PNG 2048×2048
6. Post on LinkedIn → paste caption below → post sources as first comment

---

## Variant A — Process-Led Narrative

```
Task: Create an infographic image for the summary below (after the rules).

Rules: Use the image attached as a reference on style, aesthetics,
colours, and illustration technique. Use a different layout for the
structure to elaborate details based on the summary. Do not use any
information or text from the attached image — only style. Use it only
for inspiration. Aspect ratio 1:1, resolution 2048×2048.

[PASTE VARIANT A NARRATIVE SUMMARY FROM content.md]
```

---

## Variant B — Outcome-Led Narrative

```
Task: Create an infographic image for the summary below (after the rules).

Rules: Use the image attached as a reference on style, aesthetics,
colours, and illustration technique. Use a different layout for the
structure to elaborate details based on the summary. Do not use any
information or text from the attached image — only style. Use it only
for inspiration. Aspect ratio 1:1, resolution 2048×2048.

[PASTE VARIANT B NARRATIVE SUMMARY FROM content.md]
```

---

## Calibration Check (run after each render)
- [ ] Background is deep blue (not white or grey)?
- [ ] Text is readable — no garbled numbers or spec annotations visible?

2-3 render attempts per variant is normal. If a check fails: simplify the failing element in the summary → re-generate.

---

## LinkedIn Caption

[PASTE ANCHORS CAPTION FROM content.md]

---

## Sources (post as first comment)

SOURCES:
1. [Organisation, Year] — [URL]
2. [Organisation, Year] — [URL]
[up to 12 max]
```

---

### Task 8: Archive old skills and templates

**Files:**
- Rename: `.claude/skills/copy/` → `.claude/skills/copy-v1-archived/`
- Rename: `.claude/skills/design/` → `.claude/skills/design-v1-archived/`
- Rename: `templates/infographic-copy-template.md` → `templates/infographic-copy-template-v1-archived.md`
- Rename: `templates/infographic-design-template.md` → `templates/infographic-design-template-v1-archived.md`

**Step 1: Archive skill folders**

```bash
mv "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/.claude/skills/copy" \
   "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/.claude/skills/copy-v1-archived"

mv "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/.claude/skills/design" \
   "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/.claude/skills/design-v1-archived"
```

**Step 2: Archive templates**

```bash
mv "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/templates/infographic-copy-template.md" \
   "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/templates/infographic-copy-template-v1-archived.md"

mv "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/templates/infographic-design-template.md" \
   "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/templates/infographic-design-template-v1-archived.md"
```

**Step 3: Verify**

```bash
ls "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/.claude/skills/"
ls "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/templates/"
```

Expected: `copy-v1-archived`, `design-v1-archived`, `content` (new), `gemini-prompt` (updated) in skills. `content-template.md` (new), `gemini-prompt-template.md` (updated), two `-v1-archived.md` files in templates.

---

### Task 9: End-to-end verification walkthrough

No new files. This task is a manual check of the complete V2 pipeline.

**Step 1: Trace the pipeline forward**

Read each file in order and confirm the handoff makes sense:

1. `/scout` → reads `references/` for signal domains → outputs 2+2 topic menu → confirm Evergreen Tier 2 section is present in SKILL.md
2. `/research [slug]` → unchanged → outputs `research.md`
3. `/content [slug]` → reads `research.md` → outputs `content.md` with Variant A + Variant B + ANCHORS → confirm SKILL.md exists at `.claude/skills/content/SKILL.md`
4. `/gemini-prompt [slug]` → reads `content.md` → outputs `gemini-prompt.md` with Rules + Variant A + Variant B + Caption → confirm simplified SKILL.md

**Step 2: Check for orphaned references**

Search for any remaining references to zone scripts, hex codes, or callout char limits in the active (non-archived) files:

```bash
grep -r "Zone A\|Zone B\|PRIMARY zone\|≤12 char\|Maximum 6\|#4182bc\|Rotis Sans Serif" \
  "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/.claude/skills/content/" \
  "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/.claude/skills/gemini-prompt/" \
  "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/templates/content-template.md" \
  "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/templates/gemini-prompt-template.md"
```

Expected: zero matches. Any match means a V1 constraint leaked into V2 — fix it before proceeding.

**Step 3: Confirm Gem instructions are updated**

Re-read `references/gemini-gem-standard.md`. The Gem Instructions block must NOT contain the Layout Protocol section. Confirm the version log shows 2.1 with the Layout Protocol removal rationale.

**Step 4: Confirm Visual DNA is updated**

Re-read `references/infographic-visual-dna.md`. The AI Brief Rules section must NOT contain "Maximum 6" callout rule or "Maximum 12 characters" rule.

**Step 5: Done check**

- [ ] `.claude/skills/content/` exists with SKILL.md and prompts/content-system.md?
- [ ] `.claude/skills/copy-v1-archived/` exists (old skill safely archived)?
- [ ] `.claude/skills/design-v1-archived/` exists (old skill safely archived)?
- [ ] `templates/content-template.md` exists?
- [ ] `templates/gemini-prompt-template.md` is the simplified V2 version?
- [ ] `references/gemini-gem-standard.md` version is 2.1, no Layout Protocol?
- [ ] `references/infographic-visual-dna.md` has no callout char limits in active sections?
- [ ] Grep returns zero V1 constraint matches in V2 files?

---

## Execution Order

Tasks must be executed in this order (each depends on the previous being clean):

1. Task 1 — Gem standard (highest impact, standalone)
2. Task 2 — Visual DNA (standalone)
3. Task 3 — Scout skill update (standalone)
4. Task 4 — Create content skill (new files, no dependencies)
5. Task 5 — Update gemini-prompt skill (depends on content skill existing for context)
6. Task 6 — Create content-template.md (standalone)
7. Task 7 — Simplify gemini-prompt-template.md (standalone)
8. Task 8 — Archive old skills and templates (do last — confirms nothing references them)
9. Task 9 — End-to-end verification (do last of all)

---

## First V2 Production Run

After Task 9 passes, test the new pipeline on the **Dabbawala topic** (you already have the research):

1. Run `/content dabbawala-mumbai` — the output should be two narrative summaries + ANCHORS caption, no zone labels anywhere
2. Run `/gemini-prompt dabbawala-mumbai` — the output should be a short file: Quick Start + two Rules+Summary blocks + Calibration Check + Caption
3. Upload brand-anchor-v1.webp + paste Variant A into Gemini → compare to the manually-prompted Dabbawala render
4. If the quality is similar or better: V2 is validated
5. Log the result in `docs/plans/2026-02-24-pipeline-v2-design.md` under Success Criteria
