# Infographic Content Engine V2 — Pipeline Redesign
**Date**: 2026-02-24
**Status**: APPROVED — ready for implementation
**Authored by**: Brainstorming session — Tiger Shetty + Claude

---

## Problem Statement

The V1 pipeline over-constrains Gemini rather than guiding it. Zone specifications, hex codes, callout character limits, and explicit layout directives fight the AI's natural ability to produce cohesive, information-rich infographics. Comparison: the IKEA render (V1 engine, 26,000-char prompt) produced three discontinuous panels with sparse callouts. The Nike, Zara, and Dabbawala renders (simple reference image + plain summary, ~600 words) produced unified, flowing, data-rich infographics.

**Root causes:**
1. The Layout Protocol in the Gem instructed Gemini to make zones "visually distinct and readable as a separate zone" — causing the three-panel discontinuity
2. Max 6 callouts, max 12 chars each — stripping all context from data points
3. Zone specs (hex codes, typography pt sizes, compositional direction) — never survived to render, added zero value
4. No font (Rotis Sans Serif) can be enforced in AI image generation — the attempt was theatre
5. Topic scouting was tuned only for recency, missing timeless operational excellence gold mines

---

## Decision: Option B — Streamlined 3-Stage Pipeline

```
CURRENT (4 stages)               NEW V2 (3 stages)
──────────────────               ────────────────────────
research.md         ──────────►  research.md       (expanded: equal-weight 2+2 topic menu)
infographic-copy.md ──┐
                      ├────────►  content.md        (merged: summary + ANCHORS caption)
infographic-design.md─┘
gemini-prompt.md    ──────────►  gemini-prompt.md  (simplified: Rules + 2 narrative variants)
```

---

## Stage 1: Research

### What stays
- All existing research discipline: data gathering, source verification, narrative spine, Evidence Ledger
- `sources.csv` and `recently-used-sources.md` tracking
- `research.md` output format

### What changes: Equal-Weight 2+2 Topic Menu

The topic scout now proposes **4 candidates of equal priority**: 2 Trending + 2 Evergreen Gold Mines. No hierarchy. The weekly editorial pick is a human decision based on timing, audience feel, and variety.

**New topic-scout.md output structure:**

```
## Weekly Topic Menu — W[##]

### Tier 1 — Trending (2 candidates)
| Slug | Hook | Primary source | Why this week |
|---|---|---|---|
| [slug] | [hook sentence] | [source] | [recency/timeliness signal] |
| [slug] | [hook sentence] | [source] | [recency/timeliness signal] |

### Tier 2 — Evergreen Gold Mines (2 candidates)
| Slug | Hook | Primary source | Gold mine criteria |
|---|---|---|---|
| [slug] | [hook sentence] | [source] | [which criterion — see below] |
| [slug] | [hook sentence] | [source] | [which criterion] |

## Editorial Pick This Week
**Selected**: [slug]
**Rationale**: [one sentence — why this topic, why this week]
```

**Evergreen search criteria** (new — add to scout instructions):
1. Organisation with exceptional supply chain performance, under-documented on LinkedIn
2. Historical or manual system that outperforms modern tech equivalents
3. "Impossible number" — error rate, throughput, speed figure that defies expectation
4. Surprising contrast: different industry, different era, same underlying supply chain principle
5. Academic or benchmark finding most practitioners haven't seen visualised

**Tier balance target**: Over any 4-week rolling window, aim for roughly equal Tier 1 / Tier 2 representation. Not a hard rule — editorial judgment overrides.

---

## Stage 2: Content

### What this replaces
`infographic-copy.md` + `infographic-design.md` → single `content.md`

### What disappears
- Zone-by-zone copy scripts (Zone A, B, C, D, E, T, CTA)
- Hex color codes in the content file
- Typography point sizes
- Illustration style selection (Style A / Style B)
- Compositional direction specs
- Callout character limit rules
- Design quality gates (12-point checklist)

### Part 1: Narrative Summary

**Purpose**: Becomes the body of the Gemini prompt. Rich content context for Gemini to interpret visually.

**Structure**: Flexible skeleton — framing elements are fixed, section headers adapt to the topic.

```
## Narrative Summary — [topic-slug]

**Core tension**: [one sentence — the surprising or counterintuitive thing about this topic]
**Audience takeaway**: [what a VP/COO should do or think differently after reading this]

### [Section header — follows the topic's natural structure]
[3-6 sentences. All key data points embedded naturally in prose.
Describes the mechanism, the numbers, the "how it works".
Named entities, specific figures, operational details — give Gemini real material.]

### [Section header]
[3-6 sentences per sub-section.]

### [Section header — typically the surprising conclusion or contrast]
[Contrast, comparison, the payoff data point.]
```

**Length target**: 400–700 words. Long enough for visual interpretation richness. Short enough to stay focused.

**What the narrative should include**:
- All key data points from research, embedded as sentences (not spec fields)
- Named mechanisms ("the coding system", "precision timing", "the paradox loop")
- Specific numbers with units and context
- Operational detail vivid enough that Gemini can choose the right visual metaphors
- The core contrast or tension that makes the topic worth reading

**What the narrative must NOT include**:
- Zone labels (Zone A, PRIMARY, etc.)
- Hex codes or color instructions
- Typography specifications
- Layout directives ("show this in a three-panel layout")
- Illustration style instructions

---

### Part 2: ANCHORS LinkedIn Caption

Written in the same file, immediately after the Narrative Summary. Same ANCHORS structure as V1.

```
## ANCHORS Caption — [topic-slug]

A (Hook): [≤140 chars, specific number, active voice, not rhetorical]
N (Bridge): [2-3 sentences, cost of inaction, does NOT reveal the anchor case result]
C (Context): [≤25 words, decision shift + what framework they'll see]
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

**Quality check** (simplified from 12 to 5):
- [ ] Hook ≤140 chars, specific number, active voice?
- [ ] 3 H-bullets each forwardable in Slack without context?
- [ ] CTA cannot be answered yes/no, names "your organisation"?
- [ ] S section has 3+ numbered benchmarks?
- [ ] Zero em dashes, zero "leverage/utilize/delve"?

---

## Stage 3: Gemini Prompt

### What this replaces
`gemini-prompt.md` (26,000 chars, 9 sections) → `gemini-prompt.md` (~700–1,000 words, 3 sections)

### What disappears
- Section 1: Gem setup block (stays in `gemini-gem-standard.md` as one-time reference — not repeated per topic)
- Variant A / Variant B style distinction (Maersk Dense vs. Ecomobility Minimal)
- Section 3: AI Studio alternative prompt
- Section 3b: 3-panel Document Post
- All callout character limit rules
- All zone specification language
- Layout protocol directives
- Typography and hex code instructions in the prompt

### New structure

```
# Gemini Prompt — [topic-slug]
Week: [YYYY-W##]

## Quick Start
1. Open gemini.google.com → Select Gem "Shetty's Desk — Infographic Engine"
2. Upload brand-anchor-v1.webp as style reference
3. Paste Variant A or B → generate → run 2-point Calibration Check
4. Paste the other variant → compare → pick stronger render
5. Export PNG 2048×2048 → post with caption below

---

## Variant A — Process-Led Narrative

Task: Create an infographic image for the summary below (after the rules).

Rules: Use the image attached as a reference on style, aesthetics, colours,
and illustration technique. Use a different layout for the structure to
elaborate details based on the summary. Do not use any information or text
from the attached image — only style. Use it only for inspiration.
Aspect ratio 1:1, resolution 2048×2048.

[NARRATIVE SUMMARY — PROCESS-LED VERSION]
[Tell the story chronologically / mechanistically:
 "Here is how the system works, step by step."]

---

## Variant B — Outcome-Led Narrative

Task: Create an infographic image for the summary below (after the rules).

Rules: [same Rules block — identical]

[NARRATIVE SUMMARY — OUTCOME-LED VERSION]
[Open with the surprising result or impossible number first,
 then explain the system that produces it.]

---

## Calibration Check (run after each render)
- [ ] Background is deep blue (not white or grey)?
- [ ] Text is readable (no garbled numbers or spec annotations leaked in)?

---

## LinkedIn Caption
[PASTE ANCHORS CAPTION FROM content.md]
```

### Variant definition

| | Variant A | Variant B |
|---|---|---|
| **Framing** | Process-led | Outcome-led |
| **Entry** | "Here is how the system works" | "Here is the surprising result — now here is why" |
| **Structure** | Chronological / mechanistic | Conclusion-first / contrast |
| **Gemini layout tendency** | Timeline / flow layouts | Hub / contrast / comparison layouts |
| **Content** | Identical data points | Identical data points |
| **Rules block** | Identical | Identical |

Both variants are written in the Content stage (Part 1). The Gemini prompt file pastes them in with the fixed Rules block.

---

## Gem Instructions Update

### What changes in the Gem
Remove the **Layout Protocol** block entirely. This is the block that instructed Gemini to make sections "visually distinct and readable as a separate zone" — the root cause of the three-panel discontinuity.

**Block to remove from Gem instructions:**
```
=== LAYOUT PROTOCOL ===
When a LAYOUT line is specified (e.g., "LAYOUT: Three-panel comparison"):
- Maintain that structural organization in the generated image
- Each named section (LEFT PANEL, CENTER PANEL, RIGHT PANEL) should be
  visually distinct and readable as a separate zone
- The section marked PRIMARY should receive the most visual prominence
  (largest area, brightest cyan accents, most detailed illustration)
```

### What stays in the Gem
- Reference image protocol ✅
- Style DNA String ✅
- Content fidelity rule ✅
- Text rendering protocol ✅
- Brand standards (audience, tone, deep blue) ✅
- What this Gem never does ✅

---

## Files Changed Summary

| File | Action | Notes |
|---|---|---|
| `templates/infographic-copy-template.md` | Replace | Becomes `templates/content-template.md` |
| `templates/infographic-design-template.md` | Delete | Merged into content-template |
| `templates/gemini-prompt-template.md` | Replace | Simplified to Rules + 2 variants + caption |
| `references/gemini-gem-standard.md` | Update | Remove Layout Protocol block from Gem instructions |
| `references/infographic-visual-dna.md` | Update | Remove callout char limit rules, remove zone spec rules, remove font enforcement section |
| `references/infographic-layout-library.md` | No change | Layouts remain as editorial reference — not injected into AI prompts |
| `data/*/topic-scout.md` | New format | 2+2 equal-weight topic menu |
| `data/[topic]/content.md` | New file | Replaces infographic-copy.md + infographic-design.md |
| `data/[topic]/gemini-prompt.md` | Replace | Simplified structure |

---

## What This Does NOT Change

- Research discipline and data gathering approach
- `sources.csv` source tracking
- `recently-used-sources.md` recency tracking
- Brand anchor upload protocol (`brand-anchor-v1.webp` uploaded every session)
- ANCHORS caption structure (A through T)
- Calibration Gate (reduced to 2 checks: blue background + readable text)
- Continuous improvement protocol (Phase 1→2→3→4 brand anchor evolution)

---

## Success Criteria

After 4 weeks of V2 production:
- [ ] All renders produce unified single-scene infographics (no discontinuous panels)
- [ ] Callout boxes contain full sentences with context (not single number + one-word label)
- [ ] Variant A/B comparison yields a clear winner pattern (process-led or outcome-led)
- [ ] Topic menu includes at least 1 Evergreen Gold Mine per 2-week cycle
- [ ] Total prompt file size stays under 1,200 words per topic
