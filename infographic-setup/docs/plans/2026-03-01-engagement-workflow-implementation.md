# Engagement Workflow Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Inject LinkedIn Signal Scan intelligence into Scout and add a Distribution Timing block to Publish-Ready — delivering real-world engagement signal at the point of topic selection, with zero new commands.

**Architecture:** Two skill files are modified. Scout gains a split Trending/Evergreen firecrawl scan (2 parallel searches, concurrency-safe) that informs an expanded 10-topic weekly pool (5+5, full-depth × 2 + shortlist × 3 per tier). Publish-Ready gains a 5-line distribution timing block. No other files change.

**Tech Stack:** Markdown skill files, firecrawl CLI (already authenticated), bash parallel execution (`&` + `wait`), git.

**Design doc:** `docs/plans/2026-03-01-engagement-workflow-design.md`

---

## Files Being Modified

```
.claude/skills/scout/SKILL.md         ← 4 surgical changes (Tasks 1-4)
.claude/skills/publish-ready/SKILL.md ← 1 append (Task 5)
```

Everything else is untouched.

---

## Verification Approach

Skill files are prompts, not runnable code. "Testing" means:
1. Read the modified section and confirm it matches the spec exactly
2. Check that no existing sections were accidentally broken
3. Grep for removed or mis-placed content

All verification steps use `grep` and `Read` — no live skill invocation required.

---

### Task 1: Add LinkedIn Signal Scan — Firecrawl Calls + Output Section

**What this does:** Adds the two parallel firecrawl searches and the Signal Scan output
section to Scout. These run at Scout start before signal domain scanning begins.

**Files:**
- Modify: `.claude/skills/scout/SKILL.md`

---

**Step 1: Locate the insertion point**

Read the current Scout skill and find the `## Invoke` section (around line 10-15).
The Signal Scan section goes AFTER `## Invoke` and BEFORE `## Output Structure`.

```bash
grep -n "## Invoke\|## Output Structure\|## CONTROL GATE" \
  "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/.claude/skills/scout/SKILL.md"
```

Expected: Lines numbers for `## Invoke`, `## Output Structure`, `## CONTROL GATE 1`.
This tells you exactly where to insert.

---

**Step 2: Insert the LinkedIn Signal Scan section**

Insert this block BETWEEN `## Invoke` and `## Output Structure`:

```markdown
---

## LinkedIn Signal Scan

Runs automatically at Scout start — before any signal domain scanning.
Two parallel firecrawl searches execute concurrently (matches concurrency cap of 2).

### Firecrawl Search Calls

```bash
# Search 1 — Trending Signal (reactions + comments, last 7 days)
firecrawl search "supply chain logistics procurement linkedin posts trending 2026" \
  --limit 15 --tbs qdr:w \
  -o "data/{YYYY-W##}/signal-trending.json" --json &

# Search 2 — Evergreen Signal (saves + long-tail, last 4-8 weeks)
firecrawl search "supply chain best performing saved framework benchmark infographic linkedin" \
  --limit 15 --tbs qdr:m \
  -o "data/{YYYY-W##}/signal-evergreen.json" --json &

wait
```

Replace `{YYYY-W##}` with the current ISO week folder before running.
Credit cost: ~2 credits per Scout run.

### Reverse-Engineering Logic

For each result snippet, extract:
- **Hook type**: Stat-Lead / Paradox / Contrarian / Timeline-Shock / Comparison-Gap
- **Opening pattern**: Number-first / Question-first / Assertion-first / Scene-first
- **Topic angle**: Mechanism / Case Study / Benchmark / Framework / Data comparison
- **Engagement driver**: What about this post matched the VP Supply Chain's decision context
- **Gap signal**: What similar posts are NOT covering — open territory to own

### Signal Scan Output (written into topic-scout.md above the topic menu)

```
## LinkedIn Signal Scan — W[##]

### Trending Signals → informs Tier 1
(reactions + comments, last 7 days)

Top performing post patterns this week:
| Pattern | Topic Area | Hook Type | Why it's working |
|---------|------------|-----------|-----------------|
| [reverse-engineered from snippet] | [topic] | [hook type] | [engagement driver] |

Emergent themes: [2-3 topic clusters with traction this week]
Gap opportunity: [what's discussed but not yet visualised as an infographic]

---

### Evergreen Signals → informs Tier 2
(saves + shares, last 4-8 weeks still circulating)

High-save content patterns still circulating:
| Pattern | Topic Area | Format | Why it keeps getting saved |
|---------|------------|--------|--------------------------|
| [reverse-engineered from snippet] | [topic] | [carousel/infographic] | [reuse intent driver] |

Evergreen gap: [under-visualised benchmark or framework with proven save behaviour]
```

---

```

---

**Step 3: Verify the insertion**

```bash
grep -n "LinkedIn Signal Scan\|Firecrawl Search Calls\|Reverse-Engineering\|Trending Signals\|Evergreen Signals" \
  "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/.claude/skills/scout/SKILL.md"
```

Expected: All 5 terms found, with line numbers in the right order
(Signal Scan section before Output Structure section).

---

**Step 4: Confirm existing sections are intact**

```bash
grep -n "## Invoke\|## Output Structure\|## CONTROL GATE\|## Signal Domains\|## Evergreen Gold Mine\|## Quality Contracts" \
  "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/.claude/skills/scout/SKILL.md"
```

Expected: All original section headers still present at their original relative order.

---

**Step 5: Commit**

```bash
cd "/Users/tigershetty/Claude Nano /infographic-content-engine-v1" && \
git add .claude/skills/scout/SKILL.md && \
git commit -m "feat(scout): add LinkedIn Signal Scan section with split Trending/Evergreen firecrawl searches

Two parallel searches run at Scout start before signal domain scanning:
- Trending search (qdr:w): reactions + comments signal, last 7 days
- Evergreen search (qdr:m): saves + long-tail signal, last 4-8 weeks

Reverse-engineering logic extracts hook type, opening pattern, topic angle,
engagement driver, and gap signal from each result snippet.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 2: Expand CG1 Topic Menu from 4 to 10 Candidates (5+5)

**What this does:** Replaces the 4-candidate CG1 output block (2 Trending + 2 Evergreen)
with the 10-candidate pool format (5+5, full-depth × 2 + shortlist × 3 per tier).

**Files:**
- Modify: `.claude/skills/scout/SKILL.md`

---

**Step 1: Find the current CG1 output block**

```bash
grep -n "SCOUT COMPLETE\|TIER 1\|TIER 2\|Enter 1-4\|Enter 1-2" \
  "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/.claude/skills/scout/SKILL.md"
```

Expected: The CG1 presentation block that shows the current 4-candidate format.
Note the start and end line numbers.

---

**Step 2: Replace the CG1 output block**

Replace the current CG1 presentation block (the fenced code block showing the
4-candidate menu) with this new 10-candidate format:

```markdown
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SCOUT COMPLETE — SELECT YOUR TOPIC (10 candidates)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TIER 1 — TRENDING (5 candidates)
Informed by: Trending Signal Scan + 6 signal domains

FULL DEPTH — ready for /research immediately:
  1. [slug] — [headline ≤12 words]
     Hook:          "[stat or contrarian claim]"
     Signal match:  [which trending pattern this responds to]
     Why this week: [1 sentence timeliness signal]
     Sources:       [3-5 from sources.csv]
     Novelty delta: [vs. existing slugs in data/]

  2. [slug] — [same format as 1]

SIGNAL SHORTLIST — promoted to full depth on selection:
  3. [slug] — [hook sentence] | Signal: [trending pattern matched]
  4. [slug] — [hook sentence] | Signal: [trending pattern matched]
  5. [slug] — [hook sentence] | Signal: [trending pattern matched]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TIER 2 — EVERGREEN GOLD MINES (5 candidates)
Informed by: Evergreen Signal Scan + 5 Gold Mine criteria

FULL DEPTH — ready for /research immediately:
  6. [slug] — [headline ≤12 words]
     Hook:          "[impossible number or contrast]"
     Signal match:  [which evergreen gap this fills]
     Gold mine:     [which of 5 criteria satisfied]
     Sources:       [3-5 from sources.csv]
     Novelty delta: [vs. existing slugs in data/]

  7. [slug] — [same format as 6]

SIGNAL SHORTLIST — promoted to full depth on selection:
  8. [slug] — [hook sentence] | Gold mine: [criteria matched]
  9. [slug] — [hook sentence] | Gold mine: [criteria matched]
 10. [slug] — [hook sentence] | Gold mine: [criteria matched]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Enter 1-10 to select. Shortlist picks (3-5, 8-10) trigger a
60-second top-up before /research runs. Equal weight — your pick.
Add optional context: "I want to focus on [angle / company / data]"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
```

---

**Step 3: Verify old format is gone, new format is present**

```bash
grep -n "Enter 1-4\|Enter 1-2\|2 Trending\|2 Evergreen" \
  "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/.claude/skills/scout/SKILL.md"
```

Expected: No results. Old 4-candidate references removed.

```bash
grep -n "Enter 1-10\|FULL DEPTH\|SIGNAL SHORTLIST\|Signal match\|Gold mine:" \
  "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/.claude/skills/scout/SKILL.md"
```

Expected: All 5 terms found.

---

**Step 4: Commit**

```bash
cd "/Users/tigershetty/Claude Nano /infographic-content-engine-v1" && \
git add .claude/skills/scout/SKILL.md && \
git commit -m "feat(scout): expand CG1 topic menu from 4 to 10 candidates (5+5)

Full-depth candidates (1-2, 6-7): all fields complete, ready for /research.
Signal shortlist candidates (3-5, 8-10): slug + hook + signal/gold mine field.
Weekly pool designed for 2-3 picks across the week at 2-3x/week posting cadence.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 3: Add Shortlist Promotion Flow to Scout

**What this does:** Adds the logic that fires when a shortlist candidate (3-5 or 8-10)
is selected at CG1. Scout runs a targeted top-up search, fills missing fields, then
proceeds normally.

**Files:**
- Modify: `.claude/skills/scout/SKILL.md`

---

**Step 1: Find the Message Hypothesis section**

```bash
grep -n "ONE MORE THING\|Message Hypothesis\|CONFIRM STORY" \
  "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/.claude/skills/scout/SKILL.md"
```

Expected: The "ONE MORE THING — CONFIRM STORY HYPOTHESIS" block.
The shortlist promotion flow goes BEFORE this block — it fires between CG1 selection
and the Message Hypothesis step.

---

**Step 2: Insert the shortlist promotion block**

Insert immediately AFTER the CG1 output block (Task 2) and BEFORE the
"ONE MORE THING" Message Hypothesis section:

```markdown
### Shortlist Promotion (fires when user selects 3-5 or 8-10)

When a shortlist candidate is selected, Scout runs one targeted search before
proceeding to Message Hypothesis. This fills the missing full-depth fields.

```bash
# Replace [topic-slug] with the selected candidate slug
firecrawl search "[topic-slug] supply chain linkedin analysis sources data" \
  --limit 10 --tbs qdr:m \
  -o "data/{YYYY-W##}/signal-shortlist-[topic-slug].json" --json
```

Using the search results, fill the missing fields inline:
- `Sources:` — 3-5 relevant sources from sources.csv cross-referenced with results
- `Novelty delta:` — confirm not a clone of existing slugs in data/
- `Why this week:` (Tier 1) or `Gold mine rationale:` (Tier 2) — 1 sentence

Once filled, present to the user as:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SHORTLIST TOP-UP COMPLETE — [slug]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sources confirmed: [3-5 sources]
Novelty delta:     [vs. existing slugs — clear / flagged]
[Why this week / Gold mine]: [1 sentence]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Then proceed immediately to Message Hypothesis confirmation.

```

---

**Step 3: Verify the promotion block is in the right position**

```bash
grep -n "Shortlist Promotion\|shortlist-\|TOP-UP COMPLETE\|ONE MORE THING" \
  "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/.claude/skills/scout/SKILL.md"
```

Expected: "Shortlist Promotion" appears BEFORE "ONE MORE THING" in line order.

---

**Step 4: Commit**

```bash
cd "/Users/tigershetty/Claude Nano /infographic-content-engine-v1" && \
git add .claude/skills/scout/SKILL.md && \
git commit -m "feat(scout): add shortlist promotion flow for candidates 3-5 and 8-10

When a shortlist pick is selected at CG1, one targeted firecrawl search fills
missing fields (sources, novelty delta, timeliness/gold-mine rationale).
Presents TOP-UP COMPLETE confirmation before proceeding to Message Hypothesis.
~1 credit, ~60 seconds — transparent to user.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 4: Update Scout Self-Validation Checklist + Token Budget + Output Structure

**What this does:** Adds the new Signal Scan checklist items, updates the candidate
count references from 4 to 10, and revises the token budget estimate.

**Files:**
- Modify: `.claude/skills/scout/SKILL.md`

---

**Step 1: Find the self-validation checklist**

```bash
grep -n "Self-Validation Checklist\|Exactly 4 candidates\|Exactly 2 Tier 1\|Exactly 2 Tier 2" \
  "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/.claude/skills/scout/SKILL.md"
```

Expected: The checklist block with the old 4-candidate rules.

---

**Step 2: Update candidate count references in the checklist**

Find and replace these specific checklist lines:

OLD:
```
- [ ] Exactly 4 candidates?
```
NEW:
```
- [ ] Exactly 10 candidates (5 Tier 1 + 5 Tier 2)?
```

OLD:
```
- [ ] Exactly 2 Tier 1 (Trending) and exactly 2 Tier 2 (Evergreen Gold Mine) candidates present?
```
NEW:
```
- [ ] Exactly 5 Tier 1 candidates (2 full depth + 3 shortlist)?
- [ ] Exactly 5 Tier 2 candidates (2 full depth + 3 shortlist)?
```

---

**Step 3: Add Signal Scan checklist items**

Append these items to the checklist, BEFORE the Message Hypothesis items:

```markdown
- [ ] signal-trending.json written to data/{week}/?
- [ ] signal-evergreen.json written to data/{week}/?
- [ ] LinkedIn Signal Scan section present in topic-scout.md?
- [ ] Trending Signals table: ≥3 post patterns reverse-engineered?
- [ ] Evergreen Signals table: ≥2 circulating patterns identified?
- [ ] Gap opportunity identified for each tier?
- [ ] Signal match field populated for all full-depth candidates (1-2, 6-7)?
```

---

**Step 4: Update the Token Budget section**

Find the `## Token Budget` section at the bottom of the skill. Update it:

OLD:
```
~5-8K tokens per run.
```
NEW:
```
~8-12K tokens per run. Signal scan synthesis adds ~2-3K over baseline.
Full candidates (1-2, 6-7) are same depth as prior 4-candidate format.
Shortlist candidates (3-5, 8-10) are 1 line each — minimal token cost.
```

---

**Step 5: Update the Output Structure section**

Find the `topic-scout.md Sections (in order)` list. Prepend a new item:

Add as the FIRST item in the numbered list (before existing item 1 "Signal Summary"):

```markdown
**0. LinkedIn Signal Scan** (new — generated from firecrawl results)
Two tables: Trending Signals (last 7 days) and Evergreen Signals (last 4-8 weeks).
Each table reverse-engineers post patterns: hook type, topic angle, engagement driver.
Gap opportunity identified for each tier. Written above the topic menu.
```

Renumber the existing items 1-5 to 2-6, OR add a note that this is the new first section.

---

**Step 6: Verify all checklist updates**

```bash
grep -n "Exactly 10\|Exactly 5 Tier 1\|Exactly 5 Tier 2\|signal-trending\|signal-evergreen\|Signal Scan section\|Signal match field" \
  "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/.claude/skills/scout/SKILL.md"
```

Expected: All 7 new checklist items found.

```bash
grep -n "Exactly 4 candidates\|Exactly 2 Tier 1 (Trending) and exactly 2 Tier 2" \
  "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/.claude/skills/scout/SKILL.md"
```

Expected: No results. Old candidate count references removed.

```bash
grep -n "8-12K\|Signal scan synthesis" \
  "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/.claude/skills/scout/SKILL.md"
```

Expected: Token budget line updated.

---

**Step 7: Commit**

```bash
cd "/Users/tigershetty/Claude Nano /infographic-content-engine-v1" && \
git add .claude/skills/scout/SKILL.md && \
git commit -m "feat(scout): update self-validation checklist, token budget, output structure

Checklist: 4→10 candidate count, add 7 Signal Scan verification items.
Token budget: 5-8K → 8-12K with rationale.
Output structure: LinkedIn Signal Scan added as section 0 (first in topic-scout.md).

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 5: Add Distribution Timing Block to Publish-Ready

**What this does:** Appends a 5-line distribution timing note to the existing
Publish-Ready checklist, between LINKEDIN POST STEPS and RETROSPECTIVE REMINDER.

**Files:**
- Modify: `.claude/skills/publish-ready/SKILL.md`

---

**Step 1: Find the insertion point**

```bash
grep -n "LINKEDIN POST STEPS\|RETROSPECTIVE REMINDER\|Set a reminder" \
  "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/.claude/skills/publish-ready/SKILL.md"
```

Expected: Line numbers for `LINKEDIN POST STEPS` and `RETROSPECTIVE REMINDER`.
Insert the new block between them.

---

**Step 2: Insert the Distribution Timing block**

Add this block BETWEEN the `LINKEDIN POST STEPS` block and `RETROSPECTIVE REMINDER`:

```markdown
DISTRIBUTION TIMING (supply chain VP / COO / Director audience)
  Best days:    Tuesday, Wednesday, Thursday
  Best window:  7–9am audience local time
  Golden hour:  First 60 min drives algorithm weighting.
                Be available to respond to early comments immediately after posting.
  Replay:       Post the 48-Hour Replay Prompt from research.md at ~48h after publish.
```

Inside the existing fenced code block that contains the checklist output, so it
prints as part of the PUBLISH-READY output. Keep the same indentation style
as the surrounding blocks.

---

**Step 3: Verify the insertion**

```bash
grep -n "DISTRIBUTION TIMING\|Best days\|Golden hour\|Best window\|Replay:" \
  "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/.claude/skills/publish-ready/SKILL.md"
```

Expected: All 5 terms found.

```bash
grep -n "LINKEDIN POST STEPS\|DISTRIBUTION TIMING\|RETROSPECTIVE REMINDER" \
  "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/.claude/skills/publish-ready/SKILL.md"
```

Expected: Lines in this order — LINKEDIN POST STEPS, then DISTRIBUTION TIMING,
then RETROSPECTIVE REMINDER. Confirms correct position.

---

**Step 4: Confirm no other sections changed**

```bash
grep -n "CAPTION VOICE CHECK\|GEMINI RENDER STEPS\|LINKEDIN POST STEPS\|RETROSPECTIVE REMINDER" \
  "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/.claude/skills/publish-ready/SKILL.md"
```

Expected: All 4 original section headers still present, in original order.

---

**Step 5: Commit**

```bash
cd "/Users/tigershetty/Claude Nano /infographic-content-engine-v1" && \
git add .claude/skills/publish-ready/SKILL.md && \
git commit -m "feat(publish-ready): add Distribution Timing block

5-line block inserted between LINKEDIN POST STEPS and RETROSPECTIVE REMINDER.
Covers: best days (Tue-Thu), best window (7-9am), golden hour guidance,
and 48h replay prompt reminder. No other changes.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 6: Final Verification Pass

**What this does:** End-to-end structural check across both modified files.
Confirms the design doc is fully reflected in the skill files.

---

**Step 1: Check Scout file section order is correct**

```bash
grep -n "^## \|^### " \
  "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/.claude/skills/scout/SKILL.md" \
  | head -40
```

Expected order of top-level sections:
1. `## Purpose`
2. `## Invoke`
3. `## LinkedIn Signal Scan` ← new
4. `## CONTROL GATE 1 — Topic Selection`
5. `## Output Structure`
6. (remaining original sections in original order)

---

**Step 2: Confirm zero regressions — original quality contracts intact**

```bash
grep -n "Hard Requirements\|Quality Standards\|Novelty Bar\|Token Budget\|Target Audience\|Signal Domains Scanned\|Evergreen Gold Mine Criteria\|Company Strategic Pivot" \
  "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/.claude/skills/scout/SKILL.md"
```

Expected: All 8 terms found. None removed.

---

**Step 3: Confirm publish-ready is clean**

```bash
wc -l "/Users/tigershetty/Claude Nano /infographic-content-engine-v1/.claude/skills/publish-ready/SKILL.md"
```

Expected: ~105-115 lines (original was ~100 lines, +5 for new timing block).

---

**Step 4: Check git log is clean**

```bash
cd "/Users/tigershetty/Claude Nano /infographic-content-engine-v1" && git log --oneline
```

Expected: 6 commits total:
```
(latest) feat(publish-ready): add Distribution Timing block
feat(scout): update self-validation checklist, token budget, output structure
feat(scout): add shortlist promotion flow for candidates 3-5 and 8-10
feat(scout): expand CG1 topic menu from 4 to 10 candidates (5+5)
feat(scout): add LinkedIn Signal Scan section with split firecrawl searches
Initial commit + engagement workflow design doc
```

---

**Step 5: Final commit (if any cleanup needed)**

If no cleanup: implementation is complete. No final commit needed.
If minor fixes applied: `git add` and `git commit -m "fix(scout): [specific fix]"`.

---

## Success Criteria (from design doc)

After 4 weeks of production at 2-3x/week cadence:

- [ ] Topic selection demonstrably reflects LinkedIn signal patterns (Signal match
      field is populated and traceable in topic-scout.md week-over-week)
- [ ] At least 1 Evergreen Gold Mine published per week (5+5 pool not biased toward Trending)
- [ ] Shortlist promotion completes in <60s without user friction
- [ ] Distribution timing followed; first-60-min engagement measurably improves vs baseline
- [ ] Firecrawl credit consumption ≤6 credits/week for signal scanning
- [ ] Scout token budget stays under 12K tokens per run

---

## Quick Reference — Change Surface

| File | Task | Type | Lines changed (est.) |
|------|------|------|---------------------|
| `scout/SKILL.md` | Task 1 | Insert Signal Scan section | +60 lines |
| `scout/SKILL.md` | Task 2 | Replace CG1 block | ~30 lines replaced |
| `scout/SKILL.md` | Task 3 | Insert shortlist promotion | +25 lines |
| `scout/SKILL.md` | Task 4 | Update checklist + budget | ~15 lines updated |
| `publish-ready/SKILL.md` | Task 5 | Append timing block | +6 lines |
