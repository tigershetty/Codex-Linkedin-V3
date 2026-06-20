# Infographic Layout Library — Shetty's Desk

> Extensible library of infographic layouts. Skills route to layouts based on topic type. New layouts can be added as new entries without modifying any skill files.
> **Reference**: `references/infographic-visual-dna.md` for color, typography, and style specs.

---

## How to Use This Library

1. The `/copy` skill classifies the topic type from `research.md`
2. The skill looks up the topic type in the routing table below
3. The recommended primary layout is selected automatically
4. The user may override at Control Gate 2

**Adding new layouts**: Append a new section following the same zone specification format. No skill files need to be updated.

---

## Layout Routing Table (Quick Reference)

| Topic Type | Primary Layout | Secondary Layout |
|---|---|---|
| Company Strategic Pivot | Comparison | Dual Narrative |
| Comparison / Before-After | Comparison | Data Story |
| Process / How-It-Works | Process Flow | Hub/Spoke |
| Strategic Framework | Framework (2x2) | Comparison |
| Case Study | Case Study | Data Story |
| Data / Statistical | Statistical | Data Story |
| Trend / Timeline | Timeline | Annotated Timeline |
| Mechanism / Root Cause | Hub/Spoke | Process Flow |
| Editorial / Thought Leadership | Editorial | Myth/Reality Table |
| Multi-proof / Evidence-based | Evidence Stack | Statistical |
| Policy evolution / Inflection points | Annotated Timeline | Timeline |
| Geographic / Trade route | Density Map | Hub/Spoke |
| Same market, different decisions | Dual Narrative | Comparison |
| Benchmarking / KPI vs threshold | Threshold Gauge | Statistical |
| Contrarian / Myth-busting | Myth/Reality Table | Editorial |
| Maturity / Priority ranking | Pyramid/Hierarchy | Framework (2x2) |

---

## Core 9 Layouts

---

### Layout 1: Comparison (L/R Split)

**Best for**: Company Strategic Pivot, Before/After, Old Model vs. New Model
**Reference style**: Maersk Strategic Pivot
**Narrative model**: Strategic Narrative, SCQA

**Zone Map**:
```
┌─────────────────────────────────────┐
│           TITLE ZONE (T)            │  10-15% height
├──────────────┬──────────────────────┤
│  LEFT PANEL  │   CENTER MECH ZONE   │  40-50% height
│   (Before /  │  (Trigger / Why it   │
│   Old Model) │   changed — HERO)    │
├──────────────┴──────────────────────┤
│          RIGHT PANEL (After /       │  25-30% height
│          New Model / Outcome)       │
├─────────────────────────────────────┤
│         FOOTER / CTA ZONE           │  8-12% height
└─────────────────────────────────────┘
```

**Zone Specifications**:
| Zone | Role | Weight | Dimensions | Key Content |
|---|---|---|---|---|
| T | Title + series hook | ACCENT | 100% × 12% | Headline ≤8 words (ALL CAPS), series mark |
| LEFT PANEL | Pre-pivot / before state | SECONDARY | 45% × 45% | Headline, 2-3 body sentences, 1-2 data callouts |
| CENTER MECH | Trigger mechanism / catalyst | PRIMARY | 100% × 45% (full-width behind split) | Headline, core mechanism, 1 hero stat |
| RIGHT PANEL | New model / outcome / proof | SECONDARY | 55% × 30% | Outcome headline, quantified result, decision implication |
| FOOTER | CTA + series mark | ACCENT | 100% × 10% | 1-sentence CTA, ShettysDeskSC \| W## |

**Visual hierarchy rule**: CENTER MECH is PRIMARY — the eye enters here. LEFT and RIGHT panels flank and support.

---

### Layout 2: Process Flow

**Best for**: How-It-Works, Sequential processes, Step-by-step mechanisms
**Reference style**: Ecomobility
**Narrative model**: Sequential

**Zone Map**:
```
┌─────────────────────────────────────┐
│           TITLE ZONE (T)            │  10-15% height
├────────┬────────┬────────┬──────────┤
│ STEP 1 │ STEP 2 │ STEP 3 │  STEP 4  │  35-40% height
│   ↓    │   ↓    │   ↓    │    ↓     │
├─────────────────────────────────────┤
│          OUTCOME ZONE               │  20-25% height
├─────────────────────────────────────┤
│              CTA ZONE               │  10-12% height
└─────────────────────────────────────┘
```

**Zone Specifications**:
| Zone | Role | Weight | Key Content |
|---|---|---|---|
| T | Title | ACCENT | Headline ≤8 words |
| STEP 1-4 | Sequential process steps | SECONDARY | Step number, ≤6-word label, ≤1 sentence description, 1 icon |
| OUTCOME | Final outcome / result | PRIMARY | Headline, 1-2 quantified results, semantic color callout |
| CTA | Action / decision | ACCENT | 1 decision question or 3-step numbered list |

**Arrow treatment**: Right-pointing arrows (→) between step zones. Use `#4fc3f7` cyan for arrows.

---

### Layout 3: Hub/Spoke

**Best for**: Mechanism analysis, Root cause, "X is caused by Y, Z, A, B"
**Reference style**: Custom (consultancy diagnostic)
**Narrative model**: Problem→Solution

**Zone Map**:
```
┌─────────────────────────────────────┐
│           TITLE ZONE (T)            │
├──────────────────────────────────────┤
│  SPOKE  │                │  SPOKE   │
│   (1)   │  CENTRAL HUB   │   (2)    │
│         │   (PRIMARY)    │          │
│  SPOKE  │                │  SPOKE   │
│   (3)   │                │   (4)    │
├──────────┴────────────────┴──────────┤
│         KEY STAT / OUTCOME           │
├─────────────────────────────────────┤
│              CTA ZONE               │
└─────────────────────────────────────┘
```

**Zone Specifications**:
| Zone | Role | Weight | Key Content |
|---|---|---|---|
| T | Title | ACCENT | Headline ≤8 words |
| CENTRAL HUB | Core concept / central failure / mechanism | PRIMARY | Short label (≤4 words), supporting icon, 1 stat |
| SPOKE 1-4 | Contributing factors / consequences | SECONDARY | ≤6-word label, ≤1 sentence, semantic icon |
| KEY STAT | Quantified impact of hub | SECONDARY | Hero stat + semantic color |
| CTA | Decision | ACCENT | 1 sentence action |

**Extension**: 5th and 6th spokes possible — reduce to 5-6-word labels, no description text.

---

### Layout 4: Data Story

**Best for**: Statistical insight, Data-driven narrative with single key chart
**Reference style**: McKinsey-style
**Narrative model**: Data-Heavy, SCQA

**Zone Map**:
```
┌─────────────────────────────────────┐
│           TITLE ZONE (T)            │
├─────────────────────────────────────┤
│         CONTEXT ZONE (C)            │  15% height
├─────────────────────────────────────┤
│          HERO STAT ZONE             │  20% height — PRIMARY
├─────────────────────────────────────┤
│         CHART ZONE (CH)             │  30% height
├─────────────────────────────────────┤
│         INSIGHT ZONE (I)            │  10% height
├─────────────────────────────────────┤
│              CTA ZONE               │
└─────────────────────────────────────┘
```

**Chart annotation hierarchy** (4-layer — mandatory):
1. Slide headline (interpretive claim, large, bold)
2. Chart sub-claim (chart-specific insight, 18pt, `#f59e0b` amber, above chart)
3. Chart itself (semantic color, data series)
4. Source annotation (9pt, `#99bcdb`, below chart, left-aligned)

---

### Layout 5: Timeline

**Best for**: Historical progression, 4-6 events leading to a decision point
**Reference style**: Visual Capitalist-style
**Narrative model**: Contrarian, Historical

**Zone Map**:
```
┌─────────────────────────────────────┐
│           TITLE ZONE (T)            │
├─────────────────────────────────────┤
│  DATE ─●─ EVENT ─●─ EVENT ─●─ DATE │  Timeline spine — horizontal or vertical
│         EVENT 1    EVENT 2-N        │  35-40% height
├─────────────────────────────────────┤
│         OUTCOME / KEY INSIGHT       │  PRIMARY — 20% height
├─────────────────────────────────────┤
│              CTA ZONE               │
└─────────────────────────────────────┘
```

**Event node spec**: Year/date label, ≤8-word event description, 1 semantic icon, 1 data callout if available.
**Spine**: Horizontal timeline preferred for 4 events. Vertical for 5-6 events (use Annotated Timeline layout instead).

---

### Layout 6: Framework (2x2 Matrix)

**Best for**: Strategic positioning, Quadrant decision tools, "Where do you fall?" content
**Reference style**: BCG-style
**Narrative model**: Framework→Application

**Zone Map**:
```
┌─────────────────────────────────────┐
│           TITLE ZONE (T)            │
├──────────────────────────────────── ┤
│  Y-AXIS LABEL                       │
│     ┌──────────────┬──────────────┐ │
│     │ QUADRANT A   │ QUADRANT B   │ │  30-35% height each
│     │ (top-left)   │ (top-right)  │ │
│     │              │              │ │
│     ├──────────────┼──────────────┤ │
│     │ QUADRANT C   │ QUADRANT D   │ │
│     │ (bottom-left)│(bottom-right)│ │
│     └──────────────┴──────────────┘ │
│                X-AXIS LABEL         │
├─────────────────────────────────────┤
│     BENCHMARK TEST (3 questions)    │  See Mechanic 4
├─────────────────────────────────────┤
│              CTA ZONE               │
└─────────────────────────────────────┘
```

**Benchmark Test** (bottom-right callout box — MANDATORY for Framework layouts):
- Three yes/no threshold questions
- Scoring: "2+ yes → [action]. 1 yes → [prepare]. 0 yes → [build foundation]"
- Format: callout box, `#1c3182` navy background, `#f59e0b` amber header

---

### Layout 7: Case Study

**Best for**: Single company deep-dive, Problem→Solution→Result narrative
**Reference style**: Deloitte-style
**Narrative model**: Problem→Solution→Action

**Zone Map**:
```
┌─────────────────────────────────────┐
│           TITLE ZONE (T)            │
├─────────────────────────────────────┤
│         PROBLEM ZONE (P)            │  15% — context, wrong assumption
├─────────────────────────────────────┤
│         ACTION ZONE (A)             │  PRIMARY — 25% — what they did
├─────────────────────────────────────┤
│         RESULT ZONE (R)             │  20% — quantified outcome
├─────────────────────────────────────┤
│     DECISION TOOL / FRAMEWORK       │  15% — transferable to reader
├─────────────────────────────────────┤
│              CTA ZONE               │
└─────────────────────────────────────┘
```

---

### Layout 8: Statistical

**Best for**: Multiple-stat stories with one dominant hero stat
**Reference style**: Visual Capitalist-style
**Narrative model**: Data-Heavy

**Zone Map**:
```
┌─────────────────────────────────────┐
│           TITLE ZONE (T)            │
├─────────────────────────────────────┤
│       HERO STAT ZONE (PRIMARY)      │  25-30% — dominant oversized stat
├─────────────────────────────────────┤
│  STAT 2  │  STAT 3  │  STAT 4-5    │  20% — supporting stats
├─────────────────────────────────────┤
│         CONTEXT ZONE                │  10% — why this matters
├─────────────────────────────────────┤
│              CTA ZONE               │
└─────────────────────────────────────┘
```

**Asymmetric tension rule**: Hero stat gets most saturated color. Supporting stats in `#99bcdb`. Hero stat label 20% larger than other labels. Annotation arrow: "This is the number."

---

### Layout 9: Editorial

**Best for**: Thought leadership, Opinion pieces, PSA-style executive decisions
**Reference style**: Ecomobility-style (Style B)
**Narrative model**: PSA (Executive Decision)

**Zone Map**:
```
┌─────────────────────────────────────┐
│           TITLE ZONE (T)            │
├─────────────────────────────────────┤
│         THESIS ZONE (TH)            │  20% — the argument
├─────────────────────────────────────┤
│       VISUAL STORY ZONE (V)         │  PRIMARY — 30% — editorial illustration
├─────────────────────────────────────┤
│         KEY POINT ZONE              │  15% — the single most important insight
├─────────────────────────────────────┤
│              CTA ZONE               │
└─────────────────────────────────────┘
```

---

## Advanced 7 Layouts

---

### Layout 10: Evidence Stack

**Best for**: Multi-proof arguments where no single chart dominates; "here is the accumulated evidence" structure
**Key feature**: Accumulated evidence IS the visual argument — each band is equal-weight

**Zone Map**:
```
┌─────────────────────────────────────┐
│           TITLE ZONE (T)            │
├─────────────────────────────────────┤
│  BAND 1: Label │ Data │ Source tag  │  Each band = 20-22% height
├─────────────────────────────────────┤
│  BAND 2: Label │ Data │ Source tag  │
├─────────────────────────────────────┤
│  BAND 3: Label │ Data │ Source tag  │
├─────────────────────────────────────┤
│  BAND 4: Label │ Data │ Source tag  │  (optional 4th band)
├─────────────────────────────────────┤
│              CTA ZONE               │
└─────────────────────────────────────┘
```

**Band spec**: Each band contains: category label (≤6 words), data point (1 number + unit), source tag (8pt gray), optional semantic icon. No band is PRIMARY — equal visual weight creates argument through accumulation.

---

### Layout 11: Annotated Timeline

**Best for**: Policy evolution, cost inflection points, regime changes with variable impact magnitude
**Key feature**: Callout boxes sized proportionally to impact magnitude

**Zone Map**:
```
┌─────────────────────────────────────┐
│           TITLE ZONE (T)            │
├─────────────────────────────────────┤
│                                     │
│  ●───────●───────●───────●───────●  │  Chronological spine (horizontal)
│  │       │       │       │       │  │
│ [small] [LARGE] [med]  [LARGE]  [s] │  Callout boxes — sized by impact
│                                     │
├─────────────────────────────────────┤
│         KEY TAKEAWAY ZONE (PRIMARY) │
├─────────────────────────────────────┤
│              CTA ZONE               │
└─────────────────────────────────────┘
```

**Callout sizing**: Map impact magnitude to callout box height/width. A landmark event (e.g., COVID disruption) gets 3× the box size of a minor policy update.

---

### Layout 12: Density Map / Choropleth

**Best for**: Nearshoring analysis, trade routes, regional risk distribution, geographic supply chain data
**Key feature**: Spatial encoding of supply chain data — geography carries the argument

**Zone Map**:
```
┌─────────────────────────────────────┐
│           TITLE ZONE (T)            │
├─────────────────────────────────────┤
│                                     │
│         MAP ZONE (PRIMARY)          │  40-50% height
│   [Regions color-coded by          │
│    intensity — semantic palette]    │
│                                     │
├─────────────────────────────────────┤
│  ANN.1  │  ANN.2  │  ANN.3  │ ANN4 │  Annotation callouts
├─────────────────────────────────────┤
│              CTA ZONE               │
└─────────────────────────────────────┘
```

**Color encoding**: Use semantic palette mapped to intensity. Green (#10b981) = low risk / high opportunity. Amber (#f59e0b) = moderate. Red (#ef4444) = high risk / low opportunity.

---

### Layout 13: Dual Narrative

**Best for**: Same market, different decisions, different outcomes — "Company A vs Company B"
**Key feature**: Collapses what would be a 2-slide carousel into 1 simultaneous reveal. Reader sees both paths at once.

**Zone Map**:
```
┌─────────────────────────────────────┐
│           TITLE ZONE (T)            │
├──────────────────┬──────────────────┤
│   LEFT COLUMN    │   RIGHT COLUMN   │
│  Company A:      │  Company B:      │  40% height
│  Decision 1 ↓    │  Decision 1 ↓    │
│  Decision 2 ↓    │  Decision 2 ↓    │
│  Decision 3 ↓    │  Decision 3 ↓    │
│  OUTCOME (A)     │  OUTCOME (B)     │
├──────────────────┴──────────────────┤
│    FOOTER: The decision that        │  PRIMARY — "The one thing that..."
│    made the difference              │
└─────────────────────────────────────┘
```

**Divider**: Thin vertical rule (1px, `#99bcdb`) separating the two columns. Left column = positive/winning case (`#10b981` accent). Right column = negative/losing case (`#ef4444` accent).

---

### Layout 14: Threshold Gauge

**Best for**: KPI benchmarking, "where you stand" content, performance-to-threshold comparisons
**Key feature**: VPs and COOs think in thresholds — this layout speaks their internal language

**Zone Map**:
```
┌─────────────────────────────────────┐
│           TITLE ZONE (T)            │
├─────────────────────────────────────┤
│                                     │
│     GAUGE ZONE (PRIMARY)            │  35% height
│   [Semi-circular gauge:             │
│    Red zone | Amber zone | Green]   │
│         ↑ CURRENT VALUE             │
│                                     │
├─────────────────────────────────────┤
│  RED ZONE  │  AMBER ZONE  │  GREEN  │  Zone interpretation (what each means)
│  meaning   │   meaning    │  zone   │
├─────────────────────────────────────┤
│     DECISION IMPLICATION            │  "Your number is in [zone]. This means..."
├─────────────────────────────────────┤
│              CTA ZONE               │
└─────────────────────────────────────┘
```

**Gauge colors**: Red zone `#ef4444`, Amber zone `#f59e0b`, Green zone `#10b981`. Current value pointer in `#ffffff`.

---

### Layout 15: Myth/Reality Table

**Best for**: Contrarian, viral, data-backed myth-busting content
**Key feature**: The rebuttal structure creates a systematic argument — most shareable format for contrarian takes

**Zone Map**:
```
┌─────────────────────────────────────┐
│           TITLE ZONE (T)            │
├─────────────────────────────────────┤
│  MYTH HEADER  │  REALITY HEADER    │  Column headers row
├──────────────────┬──────────────────┤
│ "What most       │ "What the data   │  Row 1 — 15-20% height
│  teams believe"  │  actually shows" │
├──────────────────┼──────────────────┤
│  Row 2           │  Row 2           │
├──────────────────┼──────────────────┤
│  Row 3           │  Row 3           │
├──────────────────┼──────────────────┤
│  Row 4-5 (opt)   │  Row 4-5 (opt)   │
├─────────────────────────────────────┤
│              CTA ZONE               │
└─────────────────────────────────────┘
```

**Color treatment**: MYTH column = `#ef4444` red header + `#1c3182` navy cell background. REALITY column = `#10b981` green header + slightly lighter navy cell background. The color contrast makes the argument before the reader reads a word.

---

### Layout 16: Pyramid/Hierarchy Cascade

**Best for**: Maturity models, priority ranking, "what matters most first" decision frameworks
**Key feature**: Vertical position and tier size communicate relative importance — no need for rank labels

**Zone Map**:
```
┌─────────────────────────────────────┐
│           TITLE ZONE (T)            │
├─────────────────────────────────────┤
│            ▲ TIER 1                 │  Apex — most important (narrowest)
│           ▲▲▲ TIER 2               │  15% width increase per level
│          ▲▲▲▲▲ TIER 3              │
│        ▲▲▲▲▲▲▲▲ TIER 4             │
│      ▲▲▲▲▲▲▲▲▲▲▲ TIER 5 (BASE)    │  Foundation (widest)
├─────────────────────────────────────┤
│         KEY INSIGHT ZONE            │  PRIMARY — "Most orgs are here..."
├─────────────────────────────────────┤
│              CTA ZONE               │
└─────────────────────────────────────┘
```

**Tier spec**: Each tier contains tier number, label (≤5 words), and 1 metric or descriptor. Tier 1 (apex): `#10b981` green accent. Tier 5 (base): `#6b7280` gray (this is where most companies currently sit — the gap is the visual argument).

---

## Extensibility Protocol

To add a new layout:
1. Append a new section following the format above
2. Include: layout name, best-for, reference style, narrative model, zone map (ASCII), zone specifications table
3. Add to the Layout Routing Table at the top of this file
4. No skill files need to be updated — the Copy skill reads this file at runtime

**Version**: 16 layouts (9 core + 7 advanced). Current as of 2026-W08.
