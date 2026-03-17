# Copy Skill — Infographic Content Engine v1

## Purpose
Transform citation-grade research into a spatial zone script for a single-image infographic. Output: one consolidated `infographic-copy.md` with narrative spine, layout routing, hook engineering, and zone-by-zone copy ready for the `/design` skill.

## Invoke
```
/copy [topic-slug]
```

## Prerequisites
`data/{week}/{topic-slug}/research.md` must exist.

## Output
```
data/{YYYY-W##}/{topic-slug}/infographic-copy.md
```

---

## Step 1: Read Research and Classify Topic

Read `research.md`. Extract:
- `topic_type` from the Topic Type + Layout Signal section
- `recommended_layout` from research
- Core Tension spine (wrong_assumption, cost_of_inaction, decision_shift)
- Hook Candidates (A, B, C)
- Business Cases
- Evidence Ledger top 8 data points

Load layout zone spec from `references/infographic-layout-library.md` for the recommended layout.

---

## CONTROL GATE 2 — Layout and Format Selection

Before writing the zone script, present to the user:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 COPY — LAYOUT & FORMAT SELECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Topic type identified: [type]
Recommended layout: [layout name]
Reason: [1-sentence rationale from research]
Illustration style: [Style A: Maersk Dense / Style B: Ecomobility Minimal]

Format options:
⭐ A. Square (2048×2048) — single image post  [recommended for most topics]
   B. Tall Scroll (1080×2700) — editorial / long-form data story
   C. Multi-panel (3 panels, 2048×2048 each) — Document Post (6.60% avg engagement)

Override layout? Enter layout name from references/infographic-layout-library.md or press Enter to confirm.
Enter A/B/C for format.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

User responds (e.g., "A" or "B" or "C Comparison") before zone script is written.
Save selection to `infographic-copy.md` header.

---

## Step 2: Build Narrative Spine

Fill the narrative spine from research.md Core Tension + Mechanism Chain:

```
narrative_model: [SCQA / Strategic Narrative / Sequential / Framework→Application / Problem→Solution→Action / Data-Heavy / Contrarian / PSA]
core_tension: [Promise/Expectation BUT Reality creates Consequence]
wrong_assumption: [Common belief provably costing the audience]
cost_of_inaction: [Quantified consequence]
decision_shift: [Specific actionable behavior change]
proof_sequence:
  trigger: [What creates the problem — quantified]
  structural_move: [What the anchor case did — specific]
  economic_consequence: [Quantified delta — anchor vs counter]
  decision_implication: [Decision threshold or framework]
mechanism_chain: trigger → structural_move → economic_consequence → decision_implication
anchor_case_id: BC-###
counter_case_id: BC-###
```

---

## Step 3: Spatial Zone Script

Write copy for each zone defined in the selected layout.
Load the zone map from `references/infographic-layout-library.md`.

### Zone Script Format

```
Zone [ID]: [ZONE ROLE]
Weight: [PRIMARY / SECONDARY / ACCENT]
Headline: [≤8 words, ALL CAPS]
Subheadline: [≤12 words, optional]
Body: [≤2 sentences, 15-35 words total]
Data Callouts:
  - [Number] [Label] [Semantic color: green/red/amber/gray]
  - [Number] [Label] [Semantic color]
  - [Number] [Label] [Semantic color]  (max 3 callouts)
Visual Direction: [Illustration description: type, scene, key objects, mood]
Compositional Direction: [Where subject sits: e.g., "Subject left 60%, negative space right 40%"]
```

### Strategic Narrative Model (for Company Strategic Pivot topic type)

When `narrative_model` is **Strategic Narrative**, use this zone structure:
```
Zone A: PRE-PIVOT STATE (SECONDARY)
  Headline: "[COMPANY] WAS BUILT FOR [OLD MODEL]"
  Body: What the company was doing. The old model. Often commodity/volatile.
  Data: 1-2 callouts showing the old state metrics.

Zone B: TRIGGER MECHANISM (PRIMARY — center, most prominent)
  Headline: "THEN [SPECIFIC CATALYST] CHANGED THE CALCULATION"
  Body: What forced the change. Market signal, crisis, or strategic insight.
  Data: 1 callout showing the triggering data point.
  Visual: Most prominent zone. Center position.

Zone C: NEW MODEL / EXECUTION (SECONDARY)
  Headline: "[COMPANY] IS NOW BETTING ON [NEW MODEL]"
  Body: What they actually did. Specific acquisitions, investments, restructuring.
  Data: 1-2 callouts showing the execution metrics.

Zone D: OUTCOME / MEASUREMENT (SECONDARY)
  Headline: "THE RESULTS: [SPECIFIC NUMBER]"
  Body: Quantified result. Revenue, margin, market share.
  If failure story: cost of failed strategy (stock decline, lost contracts).
  Data: 1-2 outcome metrics.

Zone E: DECISION IMPLICATION (ACCENT)
  Headline: "THE QUESTION FOR YOUR SUPPLY CHAIN"
  Body: What this means for the reader's organization. Transferable mechanism.
  CTA: "Where does your model sit on this spectrum?"
```

---

## Step 4: Hook Engineering (CONTROL GATE 3)

After producing the zone script, generate 3 infographic title variants. Score each on 5 criteria.

### Scoring Criteria (1 point each)
1. **Specificity**: Contains a specific number or named entity
2. **Curiosity Gap**: Creates a knowledge gap the reader wants to close
3. **Stakes**: Names a consequence the target audience cares about
4. **Contrarian Signal**: Challenges a common assumption
5. **Thumbnail Readability**: Works as a LinkedIn feed thumbnail headline (≤8 words, ALL CAPS readable at 450px wide)

### Threshold: 3/5 to pass. Regenerate any variant scoring ≤2.

Present CONTROL GATE 3:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 COPY — SELECT INFOGRAPHIC TITLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This title is the LinkedIn thumbnail headline — it IS the scroll-stopper.

⭐ A. [Stakes-Led]   "[Specific consequence]. [Reason it's worse]." (Score: [N]/5)
   B. [Stat-Led]     "[Surprising number]: [contrarian claim]" (Score: [N]/5)
   C. [Contrarian]   "[Wrong assumption most VPs have]" (Score: [N]/5)

Score breakdown: Specificity [A/B/C] | Curiosity [A/B/C] | Stakes [A/B/C] | Contrarian [A/B/C] | Thumbnail [A/B/C]

Enter A/B/C to confirm.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Selected title becomes:
1. The infographic's primary headline (Title Zone content)
2. The Caption Section A (Hook) starting point

---

## Step 5: ANCHORS Caption Draft

Draft the full LinkedIn caption using the ANCHORS framework. This draft is refined in the `/gemini-prompt` skill.

| Section | Source | Rules |
|---|---|---|
| **A** (Hook) | Selected title variant | ≤140 chars. Must contain specific number. Active voice. Not a question. |
| **N** (Bridge) | `cost_of_inaction` from research | 2-3 sentences. Does NOT reveal anchor case result. Creates tension. |
| **C** (Context) | `decision_shift` + Framework Zone name | ≤25 words. Names the specific framework or zone. |
| **H** (Insights) | Data callouts from Mechanism Zone, Data Zone, Framework Zone | Exactly 3 bullets. Each starts with number or named entity. **Shareable Framing Rule**: each bullet forward-able verbatim in a Slack message without context. |
| **O** (Opinion) | `wrong_assumption` as arguable position | Opens with "My read:" or "My take:". Must be arguable — not self-evident. |
| **R** (CTA) | `core_tension` + Framework Zone | Comment-driving question. Cannot be answered yes/no. Names "your organisation". Requires ≥15 word response. |
| **S** (Save Hook) | Top 3-5 thresholds/benchmarks from Evidence Ledger | Numbered list format. "Save this for your next [decision type]." |
| **Swipe Guide** | 2 most insight-dense zones | "[Zone A] and [Zone B] are the ones to save." |
| **T** (Tags) | Hardcoded + topic tag + role tag | Exactly 5 hashtags: #ShettysDeskSC #SupplyChainIntelligence #SCM + 1 topic + 1 role |

**Total target**: 900-1,200 characters.

---

## Copy Rules (Hard Gates)

- **Headlines**: ≤8 words, ALL CAPS (tighter than V3 for single-image readability)
- **Body per zone**: ≤2 sentences, 15-35 words total
- **Data callouts**: max 3 per zone, each with semantic color
- **EM DASH GATE**: Zero em dashes (—) anywhere. Use commas, colons, semicolons, or split sentences.
- **VOICE GATE**: Active voice. No hedging.
- **BANNED WORDS**: "leverage", "utilize", "delve", "unlock", "seamless", "holistic"
- **WRITING VOICE**: "McKinsey partner briefing a supply chain executive board. Confident. Precise. Impatient with vagueness."
- **TEXT LENGTH**: Keep every text string ≤25 characters for AI image generation (Imagen rendering limit)

---

## Output Structure: infographic-copy.md

```markdown
# Infographic Copy — [topic-slug]

## Header
Layout: [selected layout name]
Format: [Square 2048×2048 / Tall Scroll 1080×2700 / Multi-panel 2048×2048×3]
Narrative Model: [model name]
Illustration Style: [Style A: Maersk Dense / Style B: Ecomobility Minimal]
Selected Title: [chosen variant from Hook Engineering]

---

## Narrative Spine
[core_tension, wrong_assumption, cost_of_inaction, decision_shift, mechanism_chain]

---

## Zone Script
[All zones in layout order — each zone following Zone Script Format above]

---

## Hook Engineering
[All 3 variants with scores]
**Selected**: [A/B/C] — [title text]

---

## ANCHORS Caption Draft
[Full ANCHORS caption following Section A through T]

---

## Caption Quality Check
- [ ] Zero em dashes?
- [ ] Hook: ≤140 chars, specific number, active voice, not rhetorical?
- [ ] H bullets: all start with number or named entity?
- [ ] H bullets: all forward-able verbatim in Slack without context?
- [ ] Opinion opens "My read:" or "My take:"?
- [ ] CTA: cannot be answered yes/no, names "your organisation"?
- [ ] S section: 3-5 numbered benchmarks, ends "Save this for your next [decision]"?
- [ ] Exactly 5 hashtags?
- [ ] Total: [N] characters (target 900-1,200)?
```

---

## Quality Contracts

### Hard Requirements
- Layout and format explicitly selected (from Control Gate 2)
- Narrative spine complete with all 6 fields
- Zone script present for every zone in the selected layout
- Exactly 1 zone marked PRIMARY
- Hook Engineering: 3 variants, all scored, 1 selected (Control Gate 3 answered)
- ANCHORS caption: all 8 sections (A through T including S and Swipe Guide)
- Caption quality check table: all items answered

### Quality Standards (Claude judgment)
- Title zone headline is the selected hook variant (verbatim)
- PRIMARY zone is visually justified by narrative weight
- Strategic Narrative zones used when topic_type is Company Strategic Pivot
- S section benchmarks are specific numbers a VP could cite in a meeting

---

## Self-Validation Checklist

Before outputting infographic-copy.md:

- [ ] Control Gate 2 was presented and answered?
- [ ] Control Gate 3 was presented and answered (3 title variants scored)?
- [ ] Narrative spine complete?
- [ ] Zone script covers all zones in selected layout?
- [ ] Exactly 1 PRIMARY zone?
- [ ] All headlines ≤8 words?
- [ ] All body text ≤2 sentences per zone?
- [ ] All data callouts assigned semantic colors?
- [ ] Zero em dashes in zone copy and caption?
- [ ] ANCHORS caption: all 8 sections present?
- [ ] Caption quality check table complete?

**If any checkbox fails**: Revise before outputting.
