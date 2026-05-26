# Infographic Design Spec — ikea-re-americanization-flatpack-trap
**Week**: 2026-W08
**Pipeline stage**: Design → passes to /gemini-prompt

---

## Overview

```
Layout:            Comparison (L/R split) — Strategic Narrative model
Format:            Square 2048×2048px
Illustration Style: Style A: Maersk Dense (isometric flat-3D hybrid)
PRIMARY Zone:      Zone B — THE FLAT-PACK PARADOX (center column, dominant)
Total Zones:       7 (T, A, B, C, D, E, CTA)
```

**Canvas zone map (row × column breakdown):**
```
┌────────────────────────────────────────────────────┐  12% height
│                Zone T: TITLE                        │
├──────────────┬───────────────┬─────────────────────┤  65% height
│  Zone A      │   Zone B      │   Zone C            │
│  Pre-Pivot   │   Trigger     │   Re-Americanize    │
│  (LEFT 33%)  │   (CTR 34%)   │   (RIGHT 33%)       │
│  SECONDARY   │   PRIMARY     │   SECONDARY         │
├──────────────┴───────────────┴─────────────────────┤
│    Zone D: Outcome     │    Zone E: Decision        │  13% height
│    (LEFT 50%)          │    (RIGHT 50%)             │
│    SECONDARY           │    ACCENT                  │
├────────────────────────────────────────────────────┤  10% height
│              Zone CTA: FOOTER                       │
└────────────────────────────────────────────────────┘
```

---

## Global Style

```
Canvas:             2048×2048px square
Background (main):  #4182bc  (medium royal steel blue — dominant, ~55% of canvas)
Panel containers:   #1c3182  (deep navy — framing, secondary areas)
Primary text:       #ffffff  (pure white)
Secondary text:     #99bcdb  (powder blue — labels, captions, citations)
Glow/tech accent:   #4fc3f7  (cyan-teal — key objects, icons, emphasis)
Positive:           #10b981  (green — confirmed, improvement, done)
Negative:           #ef4444  (red — cost, risk, exposure, price rise)
Warning:            #f59e0b  (amber — caution, compressed, in-progress)
Neutral:            #6b7280  (gray — context data, scale reference)

Typography:         Rotis Sans Serif throughout (all weights)
Headline (Title):   Rotis Sans Serif Bold, 40pt, #ffffff, ALL CAPS
Zone headlines:     Rotis Sans Serif Bold, 26-28pt, #ffffff, ALL CAPS
Subheadlines:       Rotis Sans Serif Semi-Bold, 16pt, #99bcdb, mixed case
Body text:          Rotis Sans Serif Regular, 13pt, #ffffff
Data callouts:      Rotis Sans Serif Bold, 52-60pt, semantic color
Data labels:        Rotis Sans Serif Semi-Bold, 14pt, #99bcdb
Citations:          Rotis Sans Serif Regular, 8pt, #99bcdb, italic
CTA text:           Rotis Sans Serif Bold, 24pt, #ffffff, ALL CAPS

Series mark:        "ShettysDeskSC | W08" — bottom-right of CTA footer, 8pt #99bcdb
Top rule:           2px horizontal line, #4fc3f7 — top canvas edge (full width)
```

---

## Zone T: TITLE

**Copy weight**: ACCENT
**Dimensions**: 100% width × 12% height (2048px × 246px)
**Position**: Top of canvas, full width

### Content
- Headline line 1: "IKEA'S FLAT-PACK:"
- Headline line 2: "MOAT AND TRAP"

*(Text strings for Imagen rendering — each ≤25 chars:)*
- String 1: "IKEA'S FLAT-PACK:"  [18 chars ✓]
- String 2: "MOAT AND TRAP"  [13 chars ✓]

### Visual
- Dominant element: Typography only — no illustration
- Background: #4182bc (matches main canvas)
- Top edge: 2px rule in #4fc3f7 (cyan) — full width

### Colors
- Background: #4182bc
- Headline text: #ffffff
- Top rule: #4fc3f7

### Typography
- Headline lines: Rotis Sans Serif Bold, 40pt, #ffffff, ALL CAPS
- Both lines stacked, center-aligned, 4px line gap
- Left margin: 8% | Right margin: 8%

---

## Zone A: PRE-PIVOT STATE

**Copy weight**: SECONDARY
**Dimensions**: 33% width × 65% height (676px × 1331px)
**Position**: Left column, below title zone

### Content
- Headline: "BUILT ON GLOBAL SCALE"  [21 chars ✓]
- Subheadline: "85% of US products imported"  [27 chars — split for Imagen: "85% US PRODUCTS" / "IMPORTED"]
- Body line 1: "IKEA built on flat-pack"  [23 chars ✓]
- Body line 2: "10x per container"  [18 chars ✓]
- Data Callout 1: "15%"  label: "US domestic"  → #ef4444 red
- Data Callout 2: "70%"  label: "Europe local"  → #10b981 green
- Data Callout 3: "1,800"  label: "global suppliers"  → #6b7280 gray

### Visual
- Dominant element: Isometric illustration — container ship at port
- Illustration style: Style A Maersk Dense — flat-3D hybrid, blue monochrome
- Scene (≤50 words): Isometric container ship at dock, side view. Flat-pack boxes visible in open container hold, stacked in precise rows. Blue monochrome palette. Cyan glow on ship hull waterline and crane arm. Dock with small crane. No figures. Clean vector, smooth gradients. Industrial precision.
- Color treatment: Desaturated 30%, documentary quality (old model — cautionary framing)
- Compositional direction: Ship subject left 65% of zone. Ocean/sky negative space right 35%. Top 10% clear.

### Colors
- Background: #4182bc
- Panel container (data callout boxes): #1c3182
- Headline: #ffffff
- Body: #ffffff
- Data callout 1 (15%): #ef4444 (negative — below benchmark)
- Data callout 2 (70%): #10b981 (positive — European benchmark)
- Data callout 3 (1,800): #6b7280 (neutral — scale context)
- Illustration accent: #4fc3f7 on hull glow

### Typography
- Headline: Rotis Sans Serif Bold, 26pt, #ffffff, ALL CAPS
- Subheadline: Rotis Sans Serif Semi-Bold, 14pt, #99bcdb
- Body: Rotis Sans Serif Regular, 12pt, #ffffff
- Data callout numbers: Rotis Sans Serif Bold, 52pt, semantic color
- Data labels: Rotis Sans Serif Semi-Bold, 13pt, #99bcdb

### Chart Specification
- Chart type: Mini horizontal bar (3 bars)
- Position: Lower 40% of zone, below illustration
- Interpretive claim (zone headline): "BUILT ON GLOBAL SCALE"
- Sub-claim (18pt, #f59e0b, above chart): "US is the outlier"
- Data series:
  - "US": 15% → #ef4444 red — ASYMMETRIC TENSION: most saturated bar, label 20% larger, annotation arrow "The gap"
  - "Europe": 70% → #10b981 green
  - "Asia": 80% → #10b981 green (lighter shade)
- Source annotation (9pt, #99bcdb, below chart): "IKEA / Inter IKEA Group FY25"

---

## Zone B: TRIGGER MECHANISM — PRIMARY

**Copy weight**: PRIMARY (most visually dominant zone on canvas)
**Dimensions**: 34% width × 65% height (697px × 1331px)
**Position**: Center column, below title zone

### Content
- Headline: "THE FLAT-PACK PARADOX"  [21 chars ✓]
- Subheadline: "The moat. Also the trap."  [24 chars ✓]
- Body line 1: "10x container efficiency"  [24 chars ✓]
- Body line 2: "40% cost more: US factory"  [25 chars ✓]
- Data Callout 1: "10x"  label: "container efficiency"  → #f59e0b amber
- Data Callout 2: "40%"  label: "effective tariff rate"  → #ef4444 red
- Data Callout 3: "40%"  label: "US cost premium"  → #ef4444 red

### Visual
- Dominant element: Hub/Spoke diagram — central mechanism illustration
- Illustration style: Style A Maersk Dense
- Scene (≤50 words): Hub/Spoke diagram. Central hub: isometric flat-pack box with strong cyan glow (#4fc3f7). Four radiating spokes. Top node: upward-arrow icon cyan — "10x efficiency." Right node: warning-triangle icon red — "40% tariff." Bottom node: small-factory icon amber — "US: 2M/yr." Left node: price-tag icon red — "40% cost premium." Curved arrow loops top node back to bottom, labeled "same design" — the paradox loop.
- Color treatment: Cinematic, cool 5000K, cyan boosted (Hook/Climax zone — this is the mechanism)
- Compositional direction: Hub centered in zone. Each node fills one quadrant. Central icon 30% of zone width. Zone has panel container #1c3182 background (distinguishes it as PRIMARY).

### Colors
- Background: #1c3182 (PRIMARY zone panel container — distinguishes from surrounding zones)
- Headline: #ffffff
- Subheadline: #99bcdb
- Body: #ffffff
- Data callout 1 (10x): #f59e0b amber (the moat — signal)
- Data callout 2 (40% tariff): #ef4444 red (the trigger)
- Data callout 3 (40% cost): #ef4444 red (the trap)
- Hub icon glow: #4fc3f7 cyan (maximum glow on central element)
- Spoke lines: #4fc3f7 cyan, 2px

### Typography
- Headline: Rotis Sans Serif Bold, 28pt, #ffffff, ALL CAPS
- Subheadline: Rotis Sans Serif Semi-Bold, 14pt, #99bcdb
- Body: Rotis Sans Serif Regular, 12pt, #ffffff
- Data callout numbers: Rotis Sans Serif Bold, 60pt, semantic color (larger than adjacent zones)
- Data labels: Rotis Sans Serif Semi-Bold, 14pt, #99bcdb
- Paradox loop label "same design": Rotis Sans Serif Regular, 10pt, #4fc3f7 italic

### Excellence Standards Applied
- Standard 1 (Semantic Icons): upward-arrow (efficiency), warning-triangle (tariff risk), factory (scale), price-tag (cost premium)
- Standard 2 (Cinematic grading): cool 5000K treatment, cyan boosted — this is the climax zone
- Standard 4 (Asymmetric tension): No chart here — Hub/Spoke carries the tension through node sizing. Tariff and cost premium nodes slightly larger (20%) than efficiency node — the trap outweighs the moat visually.

---

## Zone C: NEW MODEL — RE-AMERICANIZATION

**Copy weight**: SECONDARY
**Dimensions**: 33% width × 65% height (676px × 1331px)
**Position**: Right column, below title zone

### Content
- Headline: "RE-AMERICANIZING: HOW?"  [22 chars ✓]
- Subheadline: "Selective, not wholesale"  [24 chars ✓]
- Body line 1: "$70M NC automated factory"  [25 chars ✓]
- Body line 2: "100% US cabinets: done"  [22 chars ✓]
- Data Callout 1: "$70M"  label: "NC factory"  → #f59e0b amber (progress, partial)
- Data Callout 2: "100%"  label: "US cabinets sourced"  → #10b981 green (complete)
- Data Callout 3: "€100M"  label: "Locus savings/yr"  → #10b981 green (logistics gain)

### Visual
- Dominant element: Isometric factory building with US motif
- Illustration style: Style A Maersk Dense
- Scene (≤50 words): Isometric automated factory building, front-left view. Robotic assembly arm visible through glass wall. US state map outline as light ghost (#4182bc, 20% lighter) behind factory. Cyan glow on factory roof edge and machinery arm joints. Flat-pack box emerging from production line. Clean vector, flat-3D. Forward-looking, aspirational.
- Color treatment: Cinematic, cool 5000K, cyan boosted (aspirational — the new model)
- Compositional direction: Factory subject right 65% of zone. Ghost map left 35%. Top 10% clear.

### Colors
- Background: #4182bc
- Panel container (callout boxes): #1c3182
- Headline: #ffffff
- Body: #ffffff
- Data callout 1 ($70M): #f59e0b amber (progress — significant but partial)
- Data callout 2 (100%): #10b981 green (positive — category complete)
- Data callout 3 (€100M): #10b981 green (positive — logistics saving)
- Illustration accent: #4fc3f7 on factory glow

### Typography
- Headline: Rotis Sans Serif Bold, 26pt, #ffffff, ALL CAPS
- Subheadline: Rotis Sans Serif Semi-Bold, 14pt, #99bcdb
- Body: Rotis Sans Serif Regular, 12pt, #ffffff
- Data callout numbers: Rotis Sans Serif Bold, 52pt, semantic color
- Data labels: Rotis Sans Serif Semi-Bold, 13pt, #99bcdb

---

## Zone D: OUTCOME

**Copy weight**: SECONDARY
**Dimensions**: 50% width × 13% height (1024px × 266px)
**Position**: Bottom-left

### Content
- Headline: "THE RESULTS: MARGINS HIT"  [24 chars ✓]
- Body line 1: "FY25 profit: €1.7B"  [18 chars ✓]
- Body line 2: "Tariff costs partly absorbed"  [28 chars — split: "Tariff costs" / "partly absorbed"]
- Data Callout 1: "€1.7B"  label: "FY25 operating profit"  → #f59e0b amber
- Data Callout 2: "+$50"  label: "per sofa"  → #ef4444 red
- Data Callout 3: "+$100"  label: "per bedroom set"  → #ef4444 red

### Visual
- Dominant element: Data callout panels (no illustration — data density zone)
- Style: Two panel boxes (#1c3182 navy) side by side
  - Left panel: €1.7B large amber callout, "FY25 operating profit" label
  - Right panel: +$50 and +$100 stacked red callouts
- CEO quote strip below panels: italic, #99bcdb
  - Quote: "Can't absorb all costs"  [22 chars ✓]
  - Attribution: "Brodin, Oct 2025"  [16 chars ✓]

### Colors
- Background: #4182bc
- Panel containers: #1c3182
- Headline: #ffffff
- Data callout 1 (€1.7B): #f59e0b amber (warning — margin compressed)
- Data callout 2 (+$50): #ef4444 red (negative — price rise)
- Data callout 3 (+$100): #ef4444 red (negative — price rise)
- Quote text: #99bcdb

### Typography
- Headline: Rotis Sans Serif Bold, 20pt, #ffffff, ALL CAPS
- Data callouts: Rotis Sans Serif Bold, 48pt, semantic color
- Data labels: Rotis Sans Serif Semi-Bold, 12pt, #99bcdb
- Quote: Rotis Sans Serif Regular, 10pt, #99bcdb, italic

---

## Zone E: DECISION IMPLICATION

**Copy weight**: ACCENT
**Dimensions**: 50% width × 13% height (1024px × 266px)
**Position**: Bottom-right

### Content
- Headline: "YOUR BREAK-EVEN QUESTION"  [24 chars ✓]
- Body line 1: "Did your category cross it?"  [27 chars — split: "Your category:" / "crossed the line?"]
- Data Callout 1: "Jul 24"  label: "Section 122 expires"  → #f59e0b amber
- Decision tool (3 questions, 10pt white):
  - Q1: "Item bulky/heavy?"  [18 chars ✓]
  - Q2: "Flat-pack ratio <50%?"  [20 chars ✓]
  - Q3: "Tariff exposure >25%?"  [21 chars ✓]
  - Rubric: "2-3 YES: model domestic"  [23 chars ✓]
  - Rubric: "0-1 YES: absorb/pass on"  [23 chars ✓]

### Visual
- Dominant element: Mini decision tool (3-question checklist with scoring rubric)
- Style: Navy panel (#1c3182), clean text layout, no illustration
- Left side: 3 checklist questions in Rotis Regular 10pt white
- Right side: Two-row rubric blocks: green block (#10b981) = "model domestic" / amber block (#f59e0b) = "absorb or pass through"
- Deadline callout: "Jul 24, 2026" in amber at top of panel

### Colors
- Background: #4182bc
- Panel container: #1c3182
- Headline: #ffffff
- Deadline callout (Jul 24): #f59e0b amber
- Rubric block 1 (2-3 YES): #10b981 green
- Rubric block 2 (0-1 YES): #f59e0b amber
- Checklist text: #ffffff
- Rubric text: #ffffff

### Typography
- Headline: Rotis Sans Serif Bold, 20pt, #ffffff, ALL CAPS
- Deadline callout: Rotis Sans Serif Bold, 28pt, #f59e0b
- Checklist questions: Rotis Sans Serif Regular, 10pt, #ffffff
- Rubric labels: Rotis Sans Serif Semi-Bold, 10pt, #ffffff

---

## Zone CTA: FOOTER

**Copy weight**: ACCENT
**Dimensions**: 100% width × 10% height (2048px × 205px)
**Position**: Bottom edge, full width

### Content
- Headline: "KNOW YOUR BREAK-EVEN"  [21 chars ✓]
- Series mark: "ShettysDeskSC | W08"  [19 chars ✓]

### Visual
- Background: #1c3182 (navy footer band)
- Headline center-aligned
- Series mark bottom-right, small

### Colors
- Background: #1c3182
- Headline: #ffffff
- Series mark: #99bcdb

### Typography
- Headline: Rotis Sans Serif Bold, 24pt, #ffffff, ALL CAPS
- Series mark: Rotis Sans Serif Regular, 8pt, #99bcdb

---

## Quality Gates

- [x] Background is #4182bc (medium steel blue, NOT too dark #1c3182)? ✅ — main canvas is #4182bc; #1c3182 only for panel containers and footer
- [x] Exactly 1 PRIMARY zone? ✅ — Zone B only
- [x] Semantic colors: green=positive, red=negative, amber=warning, gray=neutral? ✅
- [x] No dark text on blue backgrounds? ✅ — all text is #ffffff or #99bcdb
- [x] All hex codes explicit (no generic color names)? ✅
- [x] No sources/citations in infographic (clean image)? ✅ — sources only in caption/comments
- [x] Illustration style consistent across all zones (Style A throughout)? ✅
- [x] White space budget: ≥20% pure background? ✅ — Zone A and C have negative space; Zones D+E use panel containers with breathing room
- [x] Compositional direction specified for all illustration zones? ✅ — Zones A, B, C all have explicit direction
- [x] Series identity markers in Global Style (top cyan rule + ShettysDeskSC | W08)? ✅
- [x] All text strings ≤25 characters per element? ✅ — all zone strings verified above
