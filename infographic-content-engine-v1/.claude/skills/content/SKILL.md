---
name: content-infographic
description: Use when the user runs /content [slug]. Requires message-commit.md to exist. Produces two narrative summaries for Gemini and a LinkedIn caption in Tiger's authentic voice.
---

# Content Skill — Infographic Content Engine v1

## Purpose
Transform citation-grade research into two outputs in one file: (1) a narrative summary for the Gemini image prompt, and (2) the ANCHORS LinkedIn caption. Replaces the former /copy and /design skills.

## Invoke
```
/content [topic-slug]
```

## Prerequisites
- `data/{week}/{topic-slug}/research.md` must exist
- `data/{week}/{topic-slug}/message-commit.md` must exist (run /message first)

## Output
```
data/{YYYY-W##}/{topic-slug}/content.md
```

---

## Quality Bar — Read Before Starting

The LinkedIn caption must meet all of these before you begin writing:

**Structure**: Tiger's 7-part post structure (see `references/published-voice.md`)
**Word count**: 200–350 words total — never exceed 350
**Hook**: Opens with the Selected Hook from message-commit.md (verbatim or near-verbatim)
**Bullets**: Three named bullets — numbers embedded naturally mid-sentence, not appended as citations
**Opinion**: Arguable position — not a summary, not hedged
**CTA**: Single open question, ≥15 words, names "your organisation" or "your supply chain"

**Do NOT:**
- Use ANCHORS slot labels (A:, N:, C:, H:, O:, R:, S:, T:) anywhere in the caption
- Write more than 350 words
- Use citation format in bullets ("Organisation, Year." appended at the end)
- Write in McKinsey formality ("the strategic implications of...")
- Use em dashes — replace with a period or restructure: "not X — it is Y" → "not X. It is Y."
- Use rhetorical yes/no questions in the CTA
- Use AI slop: "leverage", "utilize", "delve", "moreover", "furthermore", "it is important to note", "plays a crucial role", "navigating the complexities of"
- Over-hedge: "it could be argued", "arguably", "one might consider"

---

## Step 1: Read Inputs

Read `message-commit.md`. Extract:
- `committed_message` — the one paradox sentence
- `hero_number` + `what_it_proves` — the single dominant figure
- `opening_sentences` — Variant A (paradox-first) and Variant B (scene-first) openings
- `section_themes` — all 3 themes with their data points
- `selected_hook` — the hook text chosen at Control Gate 2 (use verbatim in caption)

Read `references/published-voice.md` before writing the caption (Step 4).
This is the voice anchor. Do not write a single word of the caption until you have read it.

Read `research.md` for caption evidence only:
- Evidence Ledger — for named bullet data points
- Decision Ledger — for CTA framing and Save Hook benchmarks (if applicable)

---

## Step 2: Write Narrative — Variant A (Paradox-Led)

Target: 300–350 words total. Use the Variant A opening sentence from message-commit.md,
then 3 section headers with bullets. This is the format that produced the Zara,
Nike, and Dabbawala renders.

**Format**:

```
[Variant A opening sentences from message-commit.md — 2–3 sentences, states paradox
with hero number. NOT inside any section header. This is the editorial premise.]

### [Section Theme 1 header from message-commit.md]
- [Specific number]: [1 sentence explanation]
- [Specific number]: [1 sentence explanation]
- [Specific number]: [1 sentence explanation]

### [Section Theme 2 header from message-commit.md]
- [Specific number]: [1 sentence explanation]
- [Specific number]: [1 sentence explanation]
- [Specific number]: [1 sentence explanation]

### [Section Theme 3 header from message-commit.md — contains hero number]
- **[Hero number]**: [what it means — the most prominent bullet]
- [Supporting contrast or comparison with specific figures]
- [Decision implication bullet — committed message restated as practical frame]
```

**Rules for bullets**:
- Every bullet contains at least one specific figure (number, %, ratio, dollar amount, timeframe)
- Each bullet is 1–2 sentences maximum
- No bullet contains only explanation without a number
- Hero number is the first or most visually prominent bullet in Section 3

**Variant A tone**: Mechanism-first. Start from how the system was built.
Each section advances the story toward the paradox. Paradox is confirmed at the end.

**What NOT to include**: Zone labels, hex codes, typography specs, layout directives,
illustration style instructions, callout character limits, prose paragraphs.

---

## Step 3: Write Narrative — Variant B (Scene-Led)

Same structure as Variant A (same 3 section headers, same data points), different entry point.
Target: 300–350 words total.

**Format**:

```
[Variant B opening sentences from message-commit.md — 2–3 sentences, starts with
operational scene or most counterintuitive single fact. NOT the paradox statement.
The paradox emerges from the sections, not the opening.]

### [Section Theme 1 header — may reorder bullets to lead with the most surprising figure]
- [Same bullets as Variant A, or reordered]

### [Section Theme 2 header]
- [Same bullets as Variant A]

### [Section Theme 3 header]
- **[Hero number]**: [what it means]
- [Supporting contrast]
- [Final bullet: committed message stated as conclusion — "The moat and the trap are the same mechanism"]
```

**Variant B tone**: Result-first. Open with the number or scene that creates
the "wait, how is that possible?" reaction. Sections explain what produced that result.
Paradox is stated LAST, not first.

**Note**: Variant A and B argue the SAME committed message. Same 3 section headers.
Same data points. Same hero number. Only the opening and the final bullet differ.

---

## Step 4: Write LinkedIn Caption in Tiger's Voice

Read `references/published-voice.md` now if you have not already. Write using Tiger's 7-part post structure — not ANCHORS slots.

**Format**:

```
[Selected Hook — copy from message-commit.md "Selected Hook" field, 1-2 sentences.
If near-verbatim adaptation improves flow, note the change. Otherwise use verbatim.]

[Context — 1-2 sentences. The mechanism or why this matters to a VP Supply Chain.
Does NOT reveal the anchor case outcome yet. Creates tension, not resolution.]

[Three named bullets — write in Tiger's narrative style:
• [Named company or mechanism]: [1-2 sentences. Number embedded naturally mid-sentence.]
• [Named company or mechanism]: [1-2 sentences. Number embedded naturally mid-sentence.]
• [Named company or mechanism]: [1-2 sentences. Number embedded naturally mid-sentence.]]

[Opinion — "My take:" followed by 1-2 sentences. Arguable position.
State a claim that a reasonable person could disagree with.
Not: "This is an important lesson." Yes: "My take: the issue is not demand forecasting — it is who built capacity before demand arrived."]

[CTA — single open question. ≥15 words. Names "your organisation" or "your supply chain".
Cannot be answered yes/no. Requires the reader to reveal something about their own context.]

[Save Hook — OPTIONAL. Only include when the topic produces genuinely reusable benchmarks.
Write naturally: "The [topic] benchmarks worth saving: [brief list or prose]."
Skip this section entirely if no clear benchmarks exist.]

#ShettysDesk #SupplyChainIntelligence #SCM #[topic-tag-1] #[topic-tag-2]
```

**Caption self-check before proceeding:**
- Word count 200–350?
- Opens with Selected Hook from message-commit.md?
- Three bullets — each with an embedded number, no citation suffix?
- Opinion is arguable (not a summary)?
- CTA is open-ended, ≥15 words?
- No ANCHORS slot labels anywhere?

---

## Quality Check (7 points — run before saving)

- [ ] Variant A: 300–350 words, uses section headers + bullets (NOT prose paragraphs)?
- [ ] Variant B: opens with scene or counterintuitive fact (NOT the paradox statement)?
- [ ] Every bullet in both variants contains at least one specific figure?
- [ ] Hero number is the first or most prominent bullet in Section 3 of both variants?
- [ ] Caption: 200–350 words, opens with Selected Hook from message-commit.md?
- [ ] Caption: three named bullets with embedded numbers (no citation suffix)?
- [ ] Zero em dashes, zero "leverage/utilize/delve", zero ANCHORS slot labels?

---

## Output File Structure

```
# Content — [topic-slug]
**Week**: [YYYY-W##]
**Pipeline stage**: Content → passes to /gemini-prompt

---

## Narrative Summary — Variant A (Paradox-Led)

[Opening: 2–3 sentences, paradox stated with hero number. No section header.]

### [Section 1 header — mechanism or origin]
- [Specific number]: [1 sentence]
- [Specific number]: [1 sentence]
- [Specific number]: [1 sentence]

### [Section 2 header — pressure or context]
- [Specific number]: [1 sentence]
- [Specific number]: [1 sentence]
- [Specific number]: [1 sentence]

### [Section 3 header — payoff]
- **[Hero number]**: [what it proves]
- [Supporting contrast]: [1 sentence]
- [Decision implication]: [1 sentence]

---

## Narrative Summary — Variant B (Scene-Led)

[Opening: 2–3 sentences, starts with scene or counterintuitive fact. No section header.]

### [Section 1 header — same or reordered from Variant A]
- [Same bullets as Variant A]

### [Section 2 header]
- [Same bullets]

### [Section 3 header]
- **[Hero number]**: [what it proves]
- [Supporting contrast]
- [Paradox as final bullet]

---

## LinkedIn Caption

[Hook — 1-2 sentences from message-commit.md Selected Hook]

[Context — 1-2 sentences]

[Three named bullets:]
• [Named company/mechanism]: [sentence with embedded number]
• [Named company/mechanism]: [sentence with embedded number]
• [Named company/mechanism]: [sentence with embedded number]

My take: [arguable position, 1-2 sentences]

[CTA question — ≥15 words, names "your organisation" or "your supply chain"]

[Save Hook — optional, only if genuine benchmarks exist]

#ShettysDesk #SupplyChainIntelligence #SCM #[tag] #[tag]
```

---

## Token Budget
~6–9K tokens per run. Reads message-commit.md (primary input) and research.md
(for ANCHORS only). Two 300–350 word bullet narratives + ANCHORS caption ≈ 900–1,100 words output.
Do not load infographic-visual-dna.md — the message-commit.md provides all structural direction.
