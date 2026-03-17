# Learning Layer + Prompt Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the Shetty's Desk infographic pipeline from stateless analog (user-only input every week) to a stateful learning system where agents accumulate feedback, surface patterns, and improve recommendations automatically over time — while fixing the Gemini prompt format that was rendering markdown as literal text.

**Architecture:** Three additions to the existing 7-skill pipeline: (1) a redesigned `/gemini-prompt` SKILL.md using the proven numbered-sections format (no markdown, no narrative dumps), (2) a `memory/` store that accumulates structured weekly feedback and synthesised patterns, and (3) three new agents: `/feedback` skill (user-triggered input capture), `learning-advisor` agent (pre-stage advisory notes read from memory), and `pattern-synthesizer` agent (monthly pattern synthesis after `/retrospective`).

**Tech Stack:** `.claude/agents/` markdown agent files (same format as existing `voice-reviewer.md`), `.claude/skills/` SKILL.md files, plain markdown memory files.

**Confirmed Design Decisions:**
- Gemini prompt Rules block stays EXACTLY as confirmed by Tiger (no colour/theme descriptions — reference image handles style)
- New prompt format: `Main Theme:` + numbered sections `1:` `2:` with plain data lines (~60 words total content)
- Learning = structured memory files that grow weekly + agents that read them before each decision point
- `.claude/agents/` directory already exists in this project (voice-reviewer.md is there)

---

## Phase A — Immediate Fixes (do first, validates the new format)

### Task 1: Fix the LinkedIn Caption in content.md

**Why:** Caption lacks a named company anchor, end-result context, and the hybrid benchmark number appears too late for a quick-scroll reader.

**Files:**
- Modify: `data/2026-W09/ai-demand-sensing-30-percent-miss/content.md`

**Change:** Replace the three bullet points under "What companies actually found when they tested:" with the Unilever-anchored version below. Everything else in the caption stays unchanged.

**Step 1: Replace bullet 1 (generic vendor → Unilever anchor)**

Current:
```
• Demand sensing vendors promised 15% forecast improvement. Live validation showed 28% miss rates. Pilot metrics do not transfer to production. The realization came too late for the budget cycle.
```

Replace with:
```
• Unilever deployed AI demand sensing across 60% of its SKU base in 2024. Live validation: 28% miss rate against 6% with traditional methods on identical data. They scaled back to hybrid. Outcome: 8% miss rate. Cost avoidance: $4.2M per year. Pilot metrics do not transfer to production.
```

**Step 2: Add hybrid benchmark to paragraph 2 (before "Here's why")**

Current last sentence of paragraph 2:
```
Here's why pure AI is failing at scale.
```

Replace with:
```
Hybrid systems with guardrails achieve 15% miss rate — half of pure AI, better than humans at 22%. Here's why the gap exists.
```

**Step 3: Validate word count stays within 200–350**

Count words in the full caption after edits. Run voice-reviewer agent to confirm no new violations.

**Step 4: Commit**
```bash
git add "data/2026-W09/ai-demand-sensing-30-percent-miss/content.md"
git commit -m "fix(caption): add Unilever anchor, move hybrid benchmark higher — W09"
```

---

### Task 2: Regenerate gemini-prompt.md with the proven numbered-sections format

**Why:** Current `gemini-prompt.md` uses the old long-narrative format. Tiger confirmed the winning format (numbered sections, ~60 words, no markdown). Update the output file to match what actually works.

**Files:**
- Modify: `data/2026-W09/ai-demand-sensing-30-percent-miss/gemini-prompt.md`

**Step 1: Open gemini-prompt.md and replace the two prompt bodies**

Keep the Quick Start section unchanged. Keep the Calibration Check unchanged. Keep the LinkedIn Caption section unchanged.

Replace **Variant A — Paradox-Led Narrative** prompt body with:

```
Task: Create an infographic image for the summary below (after the rules).

Rules: Use the image attached as a reference on style, aesthetics,
colours, and illustration technique. Use a different layout for the
structure to elaborate details based on the summary. Do not use any
information or text from the attached image — only style. Use it only
for inspiration. Aspect ratio 1:1, resolution 2048x2048.

Main Theme: AI Forecast Failure

1: The Pilot-to-Production Accuracy Cliff
94% (Pilot Validation) → 70% (Live Production)
Forecast Horizon Collapse:
7-day: 85% accurate
30-day: 65% accurate

2: Why Pure AI Is Failing — What Works Instead
Human-plus-AI (Hybrid) systems are best:
Hybrid w/ Guardrails: 15% miss rate
Human-plus-Stats: 22% miss rate
Pure AI: 30% miss rate
```

Replace **Variant B — Scene-Led Narrative** prompt body with:

```
Task: Create an infographic image for the summary below (after the rules).

Rules: Use the image attached as a reference on style, aesthetics,
colours, and illustration technique. Use a different layout for the
structure to elaborate details based on the summary. Do not use any
information or text from the attached image — only style. Use it only
for inspiration. Aspect ratio 1:1, resolution 2048x2048.

Main Theme: AI Forecast Failure

1: The Accuracy Cliff — What You Were Promised vs. What You Got
94% pilot accuracy → 70% live production
Safety stock: ±12% (traditional) → ±25% (with AI)
42% of deployments paused or scaled back in 2025–2026

2: The Method That Actually Works
Hybrid w/ Guardrails: 15% miss rate
Human + Statistical: 22% miss rate
Pure AI: 30% miss rate
Cost per miss: $320K per SKU per quarter
```

**Step 2: Validate format**

Check that the prompt body contains:
- [ ] No `###` or `##` headers
- [ ] No `**bold**` or `*italic*` markers
- [ ] No `- ` bullet points
- [ ] No `[S##]` source annotations
- [ ] `Main Theme:` present
- [ ] Sections numbered `1:` and `2:` (not `Section 1:` or markdown headings)
- [ ] Under 80 words total in the content section (below the Rules block)

**Step 3: Commit**
```bash
git add "data/2026-W09/ai-demand-sensing-30-percent-miss/gemini-prompt.md"
git commit -m "fix(gemini-prompt): apply numbered-sections format — W09 proven output"
```

---

### Task 3: Redesign gemini-prompt SKILL.md template

**Why:** The SKILL.md currently instructs Claude to paste the full Variant A/B narrative summaries (~300 words) from content.md. That format caused markdown to render as literal text. Replace the extraction logic with the numbered-sections format for all future weeks.

**Files:**
- Modify: `.claude/skills/gemini-prompt/SKILL.md`

**Step 1: Replace Step 2 "Assemble the Gemini Prompt File" section**

The new assembly logic reads the section headings and hero stats from content.md and condenses them — it does NOT paste the full narrative. Rules block stays identical.

Replace the entire **Step 2: Assemble the Gemini Prompt File** section with:

```markdown
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
```

**Step 2: Update the Token Budget note**

Replace:
```
~2–3K tokens per run. Reads content.md and message-commit.md only. No reference
files needed — the Rules block is fixed and the two editorial direction lines
are drawn directly from message-commit.md.
```

With:
```
~1–2K tokens per run. Reads content.md and message-commit.md only.
Rules block is fixed — no colour/theme description needed (reference image handles style).
Content block target: 50–80 words. No narrative paste.
```

**Step 3: Validate the updated SKILL.md produces correct format**

Read the updated SKILL.md. Mentally trace through what Claude would output for W09's `ai-demand-sensing-30-percent-miss`. Confirm the output would match the proven prompt from Task 2 above.

**Step 4: Commit**
```bash
git add ".claude/skills/gemini-prompt/SKILL.md"
git commit -m "redesign(skill): gemini-prompt uses numbered-sections format — no narrative paste"
```

---

## Phase B — Memory Infrastructure

### Task 4: Create memory/feedback-log.md with W09 seed entry

**Why:** The feedback-log is the input pipe for the learning system. It grows one entry per week. Without it, the learning-advisor agent has nothing to read. Seed it with W09 so the system starts learning from day one.

**Files:**
- Create: `memory/feedback-log.md`

**Step 1: Create the file with schema header and W09 entry**

```markdown
# Feedback Log — Shetty's Desk Infographic Engine

Schema: One entry per week. Written by /feedback skill after Gemini render approval or post publish.
Read by: learning-advisor agent (pre-stage), pattern-synthesizer agent (post-retrospective).

---

## 2026-W09 — ai-demand-sensing-30-percent-miss

**Date logged**: 2026-03-01
**Hook type used**: Question-Why
**Hook performance**: [fill from /retrospective after 7 days]
**Gemini prompt format**: Numbered sections — Main Theme + 2 clusters, plain data, ~60 words
**Gemini render quality**: World-class — approved on first variant
**Reference image used**: brand-anchor-v1.webp
**Caption quality**: Good data density — added Unilever anchor for company specificity
**Sections used**: 2 (Pilot-to-Production Cliff / Why Pure AI Is Failing)
**Hero number**: 30% (miss rate)

**What worked**:
- Numbered sections format (1: / 2:) with plain `Label: Value` data produced clean render immediately
- No markdown = no literal text rendering. Confirmed fix.
- 2 focused data clusters is the right scope — NB2 rendered both sections clearly
- Reference image style carried all colour/aesthetic work — no need to describe in prompt

**What to change**:
- Caption needs named company anchor earlier (added Unilever — test if engagement improves)
- Could test 3 sections next week to see if more data clusters work at this prompt length

**Advisory for next week**: If Question-Why hook used again, compare engagement. If lower, try Stat-Lead hook.
```

**Step 2: Confirm file created at correct path**

Run: `ls memory/` — expect to see `feedback-log.md`

**Step 3: Commit**
```bash
git add "memory/feedback-log.md"
git commit -m "feat(memory): create feedback-log with W09 seed entry — learning layer begins"
```

---

### Task 5: Create memory/style-guide-learned.md

**Why:** This is where the pattern-synthesizer agent writes synthesised patterns after 4+ weeks of data. Create the template now so the schema is locked and the agent knows where to write.

**Files:**
- Create: `memory/style-guide-learned.md`

**Step 1: Create the file**

```markdown
# Style Guide — Learned Patterns

Updated by: pattern-synthesizer agent (runs after /retrospective, requires 4+ weeks of data)
Read by: learning-advisor agent at start of each pipeline stage

Last updated: [not yet — first synthesis runs after W13 retrospective]

---

## Gemini Prompt Patterns

### Confirmed Effective
| Format | Evidence | First confirmed |
|---|---|---|
| Numbered sections (1: / 2:) + plain data | W09 world-class render on first attempt | 2026-W09 |

### Confirmed Ineffective
| Format | Evidence | First flagged |
|---|---|---|
| Markdown narrative (###, **, - bullets) | NB2 rendered markdown as literal text | 2026-W09 |

---

## Hook Performance

| Hook type | Avg engagement vs. baseline | Weeks sampled |
|---|---|---|
| [filled by pattern-synthesizer after 4 weeks] | | |

---

## Caption Patterns

| Pattern | Evidence | Status |
|---|---|---|
| Named company anchor in bullet 1 | Tested W09 — engagement TBD | Testing |

---

## Topic Category Performance

| Category | Avg impressions | Avg comments | Weeks |
|---|---|---|---|
| [filled by pattern-synthesizer] | | | |

---

## Prompt Format Evolution

| Week | Format change | Outcome |
|---|---|---|
| W09 | Switched to numbered sections — removed markdown | World-class render, confirmed fix |
```

**Step 2: Commit**
```bash
git add "memory/style-guide-learned.md"
git commit -m "feat(memory): create style-guide-learned template — pattern-synthesizer target"
```

---

## Phase C — Learning Agents

### Task 6: Create /feedback skill

**Why:** The feedback skill is the input pipe. Without a quick way to capture what worked after a render, the memory files stay empty. This skill takes 30 seconds to run and writes a structured entry.

**Files:**
- Create: `.claude/skills/feedback/SKILL.md`

**Step 1: Create the skill file**

```markdown
---
name: feedback-capture
description: Use when Tiger approves a Gemini render, rejects a render, or finishes posting for the week. Captures qualitative feedback into memory/feedback-log.md. Invoked with /feedback [slug] [notes].
---

# Feedback Capture Skill — Infographic Content Engine v1

## Purpose
Record what worked and what didn't for each week's infographic run. Writes a structured entry to `memory/feedback-log.md`. This is the only way the learning layer gets its input — run it within 24 hours of a Gemini render approval or a LinkedIn post going live.

## Invoke
```
/feedback [topic-slug] [optional: brief notes in quotes]
```

Example:
```
/feedback ai-demand-sensing-30-percent-miss "numbered sections worked, caption needs company name"
```

## What This Skill Does

**Step 1: Read context**
- Read `memory/feedback-log.md` to get the current schema
- Find the correct week's data folder: `data/*/[slug]/`
- Read `gemini-prompt.md` to determine which prompt format was used
- Read `message-commit.md` to get hook type used

**Step 2: Ask Tiger three rapid questions (one at a time)**

1. "Gemini render quality — World-class / Approved / Needed iteration / Rejected?"
2. "Caption quality — Strong / Weak opening / Missing context / Needs rewrite?"
3. "Anything specific to note for next week? (enter to skip)"

**Step 3: Write the feedback entry**

Append a new entry to `memory/feedback-log.md` in this format:

```
## [YYYY-W##] — [slug]

**Date logged**: [today]
**Hook type used**: [from message-commit.md]
**Hook performance**: [fill from /retrospective after 7 days]
**Gemini prompt format**: [from gemini-prompt.md — describe in one line]
**Gemini render quality**: [Tiger's answer from Step 2]
**Caption quality**: [Tiger's answer from Step 2]
**Tiger's notes**: [Tiger's answer from Step 2, or "none"]

**What worked**: [infer from render quality + notes]
**What to change**: [infer from caption quality + notes]
**Advisory for next week**: [one suggestion based on pattern]
```

**Step 4: Confirm**
Output: "Feedback logged for [slug] → memory/feedback-log.md updated. [N] weeks in log."

## Token Budget
~500 tokens. Reads 3 files, writes one append. Fast.
```

**Step 2: Validate the skill path**

Run: `ls .claude/skills/feedback/` — expect to see `SKILL.md`

**Step 3: Commit**
```bash
git add ".claude/skills/feedback/SKILL.md"
git commit -m "feat(skill): add /feedback capture skill — learning layer input pipe"
```

---

### Task 7: Create learning-advisor agent

**Why:** This is the agent that makes the pipeline feel like it's learning. It reads memory files before each stage and surfaces evidence-based advisory notes. The user still makes all decisions — but now has data to inform them.

**Files:**
- Create: `.claude/agents/learning-advisor.md`

**Step 1: Create the agent file**

```markdown
---
name: learning-advisor
description: Use this agent at the start of any infographic pipeline stage to surface advisory notes from accumulated feedback and performance data. Run before /scout, /message, /gemini-prompt, or /content. Examples:

<example>
Context: User runs /scout to begin a new week.
user: "/scout"
assistant: "I'll run the learning-advisor first to surface any patterns from previous weeks, then proceed with /scout."
<commentary>
Before choosing topics, knowing which categories and hook types performed best is directly useful.
</commentary>
</example>

<example>
Context: User runs /message after research is complete.
user: "/message ai-demand-sensing-30-percent-miss"
assistant: "Running learning-advisor to check hook type performance before presenting the 10 hooks."
<commentary>
At the hook selection stage, the advisor can rank hook types by historical engagement — turning a 10-option menu into a data-informed shortlist.
</commentary>
</example>

<example>
Context: User runs /gemini-prompt to assemble the final Gemini prompts.
user: "/gemini-prompt ai-demand-sensing-30-percent-miss"
assistant: "Running learning-advisor to confirm the prompt format before assembling."
<commentary>
At the gemini-prompt stage, the advisor confirms which prompt format produced approved renders and flags any format patterns that previously failed.
</commentary>
</example>

model: inherit
color: cyan
tools: ["Read", "Glob"]
---

You are the learning advisor for the Shetty's Desk Infographic Engine. You run before each pipeline stage and surface 2–3 evidence-based advisory notes drawn from the accumulated memory files. You do not make decisions — you surface patterns so Tiger can make better-informed ones.

**Your Core Responsibilities:**
1. Read `memory/feedback-log.md` for patterns from past weeks
2. Read `memory/style-guide-learned.md` for confirmed effective/ineffective patterns
3. Read available `data/*/performance.md` files for engagement data (if present from /retrospective)
4. Surface 2–3 advisory notes relevant to the current stage
5. Output nothing beyond the advisory block — no summaries, no preamble

**Analysis Process:**

Step 1 — Determine which stage is running
- Read the conversation context to identify the current stage (scout / message / content / gemini-prompt)

Step 2 — Read memory files
- Read `memory/feedback-log.md` — look for patterns in the last 4 entries
- Read `memory/style-guide-learned.md` — check "Confirmed Effective" and "Confirmed Ineffective" sections
- Glob `data/*/performance.md` — if any exist, read the most recent 3

Step 3 — Filter to stage-relevant patterns
- Scout stage: topic category performance, topics that generated strong engagement
- Message stage: hook type performance, hook types with high vs low engagement rates
- Content stage: caption patterns, company anchor presence vs. absence impact
- Gemini-prompt stage: prompt format history, render quality by format type

Step 4 — Output the advisory block

**Output Format:**

```
★ Advisory — [Stage Name] ─────────────────
[1] [Evidence-based observation. Pattern: last N weeks.]
[2] [Evidence-based observation. Pattern: last N weeks.]
[3] [Evidence-based observation — optional, only if strongly evidenced.]
─────────────────────────────────────────
```

**Quality Standards:**
- Only surface patterns with 2+ data points — never advise from a single week
- State the evidence count: "last 3 weeks", "2 of 2 renders approved with X format"
- Keep each advisory to one sentence — no elaboration
- If memory/feedback-log.md does not exist or has fewer than 2 entries: output "★ Advisory — [Stage]: Insufficient data for pattern detection. Memory log has [N] entries — advisory activates at 2+."
- Never recommend a specific decision — only surface the pattern

**Edge Cases:**
- Missing memory files: report missing file path, output advisory as unavailable
- All patterns are neutral (no strong signal): output "No strong signal in current data — all patterns within normal variance"
- Contradicting patterns: surface both with evidence counts and note the contradiction
```

**Step 2: Validate the agent file**

Read the created file. Check:
- [ ] frontmatter has `name`, `description`, `model`, `color`, `tools`
- [ ] `description` has at least 2 `<example>` blocks with `<commentary>`
- [ ] System prompt written in second person ("You are...")
- [ ] Output format section is clear and complete

**Step 3: Commit**
```bash
git add ".claude/agents/learning-advisor.md"
git commit -m "feat(agent): add learning-advisor — pre-stage pattern advisory from memory files"
```

---

### Task 8: Create pattern-synthesizer agent

**Why:** After 4+ weeks of feedback data accumulates, this agent reads everything and writes synthesised patterns to style-guide-learned.md. It closes the learning loop by converting raw weekly entries into durable institutional knowledge.

**Files:**
- Create: `.claude/agents/pattern-synthesizer.md`

**Step 1: Create the agent file**

```markdown
---
name: pattern-synthesizer
description: Use this agent after /retrospective when 4 or more weeks of feedback data exist in memory/feedback-log.md. Synthesises patterns from feedback log and performance data, then updates memory/style-guide-learned.md. Examples:

<example>
Context: User has just run /retrospective for W12 (the 4th week of data).
user: "/retrospective ai-supply-chain-nearshoring"
assistant: "Retrospective complete. Running pattern-synthesizer — we now have 4 weeks of data to synthesise."
<commentary>
At 4 weeks, there's enough signal to identify patterns in hook types, topic categories, and prompt formats.
</commentary>
</example>

<example>
Context: User asks the system to review what it has learned.
user: "What patterns have we identified so far?"
assistant: "I'll run the pattern-synthesizer to analyse the current memory data and give you a summary."
<commentary>
Explicit pattern review request triggers synthesis even if fewer than 4 weeks exist.
</commentary>
</example>

model: inherit
color: green
tools: ["Read", "Write", "Glob"]
---

You are the pattern synthesizer for the Shetty's Desk Infographic Engine. After 4+ weeks of feedback data accumulates, you read all memory and performance files, identify statistically meaningful patterns, and update `memory/style-guide-learned.md` with your findings. You turn raw weekly observations into durable institutional knowledge that improves every future run.

**Your Core Responsibilities:**
1. Read all entries in `memory/feedback-log.md`
2. Glob and read all available `data/*/performance.md` files
3. Identify patterns across 3 dimensions: Gemini prompt formats, hook type performance, topic category performance
4. Write a synthesised update to `memory/style-guide-learned.md`
5. Output a summary of what was updated and what the top 3 actionable patterns are

**Analysis Process:**

Step 1 — Read all memory and performance data
- Read `memory/feedback-log.md` — all entries
- Glob `data/*/performance.md` — read all available
- Note: require minimum 4 feedback-log entries to produce pattern tables; if fewer, output "Insufficient data" and stop

Step 2 — Analyse three pattern dimensions

**Gemini prompt formats:**
- Group entries by format type (numbered sections / narrative / labeled fields / etc.)
- Cross-reference with "Gemini render quality" field (World-class / Approved / Needed iteration / Rejected)
- Identify: which format has highest approval rate on first attempt?

**Hook type performance:**
- Group entries by hook type (Question-Why / Stat-Lead / Paradox / etc.)
- Cross-reference with performance.md engagement data (impressions, comments, shares)
- Identify: which hook type has highest average engagement vs. baseline?

**Topic category performance:**
- Group entries by topic category (AI/automation / operational efficiency / cost reduction / etc.)
- Cross-reference with performance.md data
- Identify: which category drives most engagement?

Step 3 — Write to style-guide-learned.md

Update the relevant tables in `memory/style-guide-learned.md`:
- "Confirmed Effective" and "Confirmed Ineffective" in Gemini Prompt Patterns section
- Hook Performance table with avg engagement data
- Topic Category Performance table
- Caption Patterns table (named company anchor vs. generic — if enough data)
- Append to Prompt Format Evolution table

Step 4 — Output synthesis summary

**Output Format:**

```
★ Pattern Synthesis Complete ────────────────────
Weeks analysed: [N] | Performance data available: [Y/N]

Top 3 actionable patterns:
[1] [Pattern — evidence: N data points]
[2] [Pattern — evidence: N data points]
[3] [Pattern — evidence: N data points]

style-guide-learned.md updated. [N] table rows added/modified.
─────────────────────────────────────────────────
```

**Quality Standards:**
- Only write to Confirmed Effective/Ineffective after 3+ consistent data points
- Always show evidence count — never claim a pattern without stating how many weeks support it
- If data is contradictory (pattern exists in some weeks, absent in others), note the variance
- Never delete existing confirmed patterns — only add or move to "Needs Reconfirmation" if new data contradicts them
```

**Step 2: Commit**
```bash
git add ".claude/agents/pattern-synthesizer.md"
git commit -m "feat(agent): add pattern-synthesizer — monthly synthesis of learned patterns"
```

---

## Phase D — Pipeline Integration

### Task 9: Wire learning-advisor into the infographic orchestrator

**Why:** The learning-advisor agent only helps if it actually runs before each stage. The `/infographic` orchestrator SKILL.md needs to dispatch it automatically at the start of each stage.

**Files:**
- Modify: `.claude/skills/infographic/SKILL.md`

**Step 1: Read the current infographic SKILL.md**

Find the Stage Dispatch section — this is where the orchestrator routes to sub-skills.

**Step 2: Add learning-advisor dispatch before each stage**

For each stage entry in the Stage Dispatch table, add one line before the sub-skill invocation:

```
Before running [stage-skill]: dispatch learning-advisor agent to check memory files.
Surface advisory notes to Tiger. Tiger reviews (5 seconds). Proceed with stage.
```

The learning-advisor runs as a parallel advisory read — it does not block the stage from proceeding. If Tiger wants to act on an advisory note, they do so before the stage's control gate. If not, the stage proceeds normally.

**Step 3: Validate**

Read the updated SKILL.md. Confirm that:
- [ ] learning-advisor dispatch is mentioned before /scout
- [ ] learning-advisor dispatch is mentioned before /message
- [ ] learning-advisor dispatch is mentioned before /gemini-prompt
- [ ] The agent is described as "advisory — does not block stage"

**Step 4: Commit**
```bash
git add ".claude/skills/infographic/SKILL.md"
git commit -m "integrate(pipeline): wire learning-advisor pre-flight into infographic orchestrator"
```

---

## Execution Order Summary

| Phase | Task | Files changed | Time estimate |
|---|---|---|---|
| A | 1 — Fix caption | content.md | 5 min |
| A | 2 — Regenerate gemini-prompt.md | gemini-prompt.md | 5 min |
| A | 3 — Redesign SKILL.md template | .claude/skills/gemini-prompt/SKILL.md | 10 min |
| B | 4 — Create feedback-log.md | memory/feedback-log.md | 5 min |
| B | 5 — Create style-guide-learned.md | memory/style-guide-learned.md | 5 min |
| C | 6 — Create /feedback skill | .claude/skills/feedback/SKILL.md | 10 min |
| C | 7 — Create learning-advisor agent | .claude/agents/learning-advisor.md | 10 min |
| C | 8 — Create pattern-synthesizer agent | .claude/agents/pattern-synthesizer.md | 10 min |
| D | 9 — Wire orchestrator | .claude/skills/infographic/SKILL.md | 5 min |

**Total: ~65 minutes across 9 tasks. Phase A can be done in this session. Phases B–D in next session.**

---

## What Changes Week-to-Week After This Plan

| Week | What the system does differently |
|---|---|
| W09 | New prompt format active. Caption has Unilever anchor. /feedback available to capture notes. |
| W10 | learning-advisor reads W09 feedback entry. Surfaces 1 advisory note (single data point). |
| W11 | learning-advisor reads W09+W10. First multi-week pattern detection possible. |
| W12 | learning-advisor reads W09–W11. Stronger signal on hook types and prompt formats. |
| W13+ | pattern-synthesizer runs after retrospective. style-guide-learned.md gets first full update. Advisory notes become increasingly specific and evidence-backed. |

---

## Reference: Confirmed Winning Gemini Prompt Format

This is the format that produced the world-class W09 output. All future `/gemini-prompt` runs use this template:

```
Task: Create an infographic image for the summary below (after the rules).

Rules: Use the image attached as a reference on style, aesthetics,
colours, and illustration technique. Use a different layout for the
structure to elaborate details based on the summary. Do not use any
information or text from the attached image — only style. Use it only
for inspiration. Aspect ratio 1:1, resolution 2048x2048.

Main Theme: [TOPIC HEADLINE — plain text]

1: [SECTION HEADING — stripped of ###]
[DATA LINE 1 — Label: Value or Label → Value]
[DATA LINE 2]
[DATA LINE 3 — optional]

2: [SECTION HEADING]
[DATA LINE 1]
[DATA LINE 2]
[DATA LINE 3 — optional]
```

**Hard rules:**
- Rules block is fixed and unchanged every week
- NO markdown in the content block (no ##, **, -, [brackets])
- NO colour/theme description (reference image handles style)
- 50–80 words total in content block
- Numbered sections: `1:` `2:` (not `Section 1:` not `### 1.`)
