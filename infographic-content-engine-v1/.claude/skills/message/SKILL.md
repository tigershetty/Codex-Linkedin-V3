---
name: message-commit
description: Use when the user runs /message [slug]. Requires research.md to exist. Locks the committed story, generates 10 hook options, and presents Control Gate 2 before /content runs.
---

# Message Skill — Infographic Content Engine v1

## Purpose
Lock the single story this infographic argues. Runs between /research and /content.
Confirms or revises the Message Hypothesis from scout. Selects the hero number.
Writes the opening sentence (2–3 sentences that open both content.md variants).
Assembles 2–3 section themes with data points that /content will turn into bullets.

## Invoke
```
/message [topic-slug]
```

## Prerequisites
- `data/{week}/{topic-slug}/research.md` must exist
- `data/{week}/topic-scout.md` must include a Message Hypothesis section

## Output
```
data/{YYYY-W##}/{topic-slug}/message-commit.md
```

---

## Step 1: Read Inputs

Read `research.md`. Extract:
- `core_tension` (wrong_assumption + cost_of_inaction)
- Evidence Ledger — all data points ordered by audience impact
- Business Cases — anchor case mechanism chain

Read `topic-scout.md`. Extract:
- Message Hypothesis (Story, Viewer feels, Hero number)

---

## Step 2: Confirm or Revise the Message

Review the Message Hypothesis against what research actually proves.

**Confirmed**: Top 3 Evidence Ledger data points all support the same paradox as the hypothesis → confirm verbatim.

**Revised**: Research reveals a stronger or more surprising tension → revise.
Write: "Revised from hypothesis: [original] → [revised]"

The committed message must be one sentence. Format:
"The same [X] that [made Y possible] has made [Z] structurally impossible/inevitable."

---

## Step 3: Select the Hero Number

From the Evidence Ledger: the single most impactful figure.
- Most extreme (a ratio, a contrast between two figures)
- Most counterintuitive (creates genuine disbelief)
- Most decisive (the number that closes the argument)

If the story is a ratio (e.g., 2M vs 20M units), express as the ratio (10x) or the more extreme figure.

One number only. This number appears prominently in both content.md variants.

---

## Step 4: Write the Opening Sentence

Write 2–3 sentences that will open BOTH Variant A and Variant B in content.md. These sentences:
- State the paradox/tension with one specific number
- Create the "wait, how is that possible?" reaction
- Do NOT belong under any section header — they precede all sections

**Variant A opening**: States the paradox directly (mechanism-first).
Example: "IKEA built EUR 44.6 billion in global sales on one design insight: flat-pack furniture ships 10 times more product per container than assembled rivals. The same design now makes domestic manufacturing in America structurally impossible at scale. The moat and the trap are the same mechanism."

**Variant B opening**: States the result first, not the paradox (scene-first).
Example: "IKEA spent USD 70 million on a US factory. It produces 2 million units per year. The comparable Chinese plant produces 20 million. Here is why the investment cannot close the gap."

Write BOTH opening variants.

---

## Step 4b: Generate 10 Hook Options

Generate all 10 hooks now. Each must be written for the specific committed message and hero number — not as templates, as actual draft copy ready to publish.

**10 Hook Taxonomy with patterns:**

| # | Type | Structural Device | Pattern |
|---|---|---|---|
| 1 | Question-Why | Open question + surprising subject | "Why is [world's largest/most recognised X] doing Y instead of Z?" |
| 2 | Question-How | Open question + impossible outcome | "How do you get [X impressive outcome] without [obvious method]?" |
| 3 | Stat-Lead | Number → meaning → contrast | "[Impossible number]. [What it means in one phrase]. [Brief contrast that sharpens the surprise.]" |
| 4 | Contrarian | "Most X believe Y. Company proved the opposite." | "Most [supply chain leaders / CFOs / procurement teams] are focused on [common belief]. [Company] proved the opposite." |
| 5 | Paradox | "Same X that made Y possible made Z impossible." | "The same [mechanism] that [created advantage] has made [strategic move] structurally impossible." |
| 6 | Personal-Reflection | "I've been dissecting X. The gap is N." | "I've been dissecting [topic]. The gap between [what people assume] and [what actually happens] is [specific finding]." |
| 7 | Result-First | Outcome → no expected method → here's why | "[Seemingly impossible outcome]. No [expected technology]. No [expected asset]. Here is what actually produces it." |
| 8 | Timeline-Shock | Decision in year → consequence N years later | "[Company] made [decision] in [year]. [N years] later, [consequence no one expected]." |
| 9 | Comparison-Gap | A does X. B does 5x X. Gap isn't what you think. | "[Company A] does [metric]. [Company B] does [5x metric]. The difference isn't [what leaders assume]." |
| 10 | Decision-Pressure | You have N days. Here's what data says. | "You have [N days / a window / this quarter] to decide. Here is what [Company]'s data says about [the decision you are avoiding]." |

**Self-check quality gate — run before Step 5:**
```
BEFORE PROCEEDING: verify all 10 hooks pass BOTH checks:

CHECK 1 — Distinctiveness:
- Each hook opens with a DIFFERENT first word
- Each hook uses a DIFFERENT structural device (question / stat / assertion / paradox / personal frame)
- No two hooks make the same opening argument, even in different words
If any two hooks feel similar → delete the weaker. Write a different type.

CHECK 2 — Voice (the hook becomes the opening line of the published post):
- No em dashes. Replace with a period or restructure the sentence.
  ✗ "not better technology — it is process design"
  ✓ "not better technology. It is process design."
- No AI slop: "leverage", "utilize", "delve", "moreover", "furthermore",
  "it is important to note", "one might consider", "in today's landscape"
- No over-hedging: "it could be argued", "arguably", "some might say"
- No rhetorical yes/no questions (reserved for CTA only)
- Write as Tiger would say it out loud. Short. Direct. No throat-clearing.

Do NOT move to Step 5 until all 10 hooks pass both checks.
```

---

## Step 5: Draft 2–3 Section Themes

Each section theme becomes one section in content.md with 3–4 bullets. For each:
- Name the section (5–7 word header)
- List 3–4 data points from the Evidence Ledger that belong in it
- Note the visual structure implied (comparison / timeline / mechanism / pressure / payoff)

**Section theme types that work well for Gemini:**
- **Comparison**: Two numbers at different scales (2M vs 20M, 10x ratio)
- **Timeline/Process**: Sequential events with timestamps or percentages
- **Mechanism**: How a system works step by step (the daily workflow, the design principle)
- **Pressure**: The external force that made the paradox visible (tariff, market event, deadline)
- **Payoff**: The hero number + what it means for the reader's decision

**Section 3 always contains the hero number** as the opening or most prominent data point.

---

## Step 6: CONTROL GATE 2 — Present for User Confirmation

Present the committed message AND all 10 hooks before writing message-commit.md:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 MESSAGE COMMIT — CONFIRM BEFORE /content RUNS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Committed message:
  [one sentence paradox/tension]

Hero number: [figure] — [5-word explanation of what it proves]

Opening sentences:
  Variant A: [2–3 sentence paradox-first opening]
  Variant B: [2–3 sentence scene-first opening]

Section themes:
  1. [Section name] → [3 data points]
  2. [Section name] → [3 data points]
  3. [Section name — hero number] → [3 data points]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SELECT YOUR HOOK (10 options — pick one)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. [Question-Why]:      "[draft hook text]"
2. [Question-How]:      "[draft hook text]"
3. [Stat-Lead]:         "[draft hook text]"
4. [Contrarian]:        "[draft hook text]"
5. [Paradox]:           "[draft hook text]"
6. [Personal-Reflection]: "[draft hook text]"
7. [Result-First]:      "[draft hook text]"
8. [Timeline-Shock]:    "[draft hook text]"
9. [Comparison-Gap]:    "[draft hook text]"
10. [Decision-Pressure]: "[draft hook text]"

Enter 1-10 to select, or type your own hook.
Press Enter to confirm story without changing, or type adjustments.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Output File Structure

```markdown
# Message Commit — [topic-slug]
**Week**: [YYYY-W##]
**Pipeline stage**: Message Commit → passes to /content

---

## Committed Message
[One paradox/tension sentence. Format: "The same [X] that [made Y] has made [Z]."]

## Hero Number
**Figure**: [single number or ratio]
**What it proves**: [5–8 words]

## Opening Sentences

**Variant A** (paradox-first — used to open Variant A in content.md):
[2–3 sentences. States paradox with hero number. Mechanism-first.]

**Variant B** (scene-first — used to open Variant B in content.md):
[2–3 sentences. States result or operational scene first. Paradox emerges later.]

## Section Themes

### Theme 1: [section name, 5–7 words]
**Visual structure**: [comparison / timeline / mechanism / pressure / payoff]
**Data points** (for /content to turn into bullets):
- [Data point from Evidence Ledger + source ID]
- [Data point + source ID]
- [Data point + source ID]

### Theme 2: [section name]
**Visual structure**: [type]
**Data points**:
- [Data point + source ID]
- [Data point + source ID]
- [Data point + source ID]

### Theme 3: [section name — contains hero number]
**Visual structure**: payoff
**Data points**:
- [Hero number + what it means for the reader's decision]
- [Supporting contrast or comparison]
- [Decision implication — restates committed message as a practical frame]

---

## Selected Hook
**Type**: [hook type from taxonomy — e.g., "Stat-Lead"]
**Text**: [full hook text selected at CG2]

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
*Hypothesis origin: [confirmed / revised from: original hypothesis text]*
```

---

## Quality Check (8 points — run before saving)

- [ ] Committed message is one sentence in paradox/tension format ("same X that Y has made Z")?
- [ ] Hero number is one specific figure or ratio — not a range, not a description?
- [ ] Variant A opening: 2–3 sentences, paradox stated with hero number?
- [ ] Variant B opening: 2–3 sentences, starts with result/scene — NOT the paradox statement?
- [ ] All 3 section themes have 3+ data points each?
- [ ] Section 3 contains the hero number as its first or most prominent data point?
- [ ] All 10 hooks generated, each using a different structural device and different opening word?
- [ ] Selected hook written into message-commit.md under "Selected Hook"?

---

## Token Budget
~4–6K tokens per run. Reads research.md and topic-scout.md only.
No reference files required.
