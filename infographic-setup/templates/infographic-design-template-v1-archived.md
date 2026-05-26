# Infographic Design Template — Shetty's Desk

> Copy this template when starting design spec for a new topic. Fill in all fields. This mirrors the output of /design [slug].

---

# Infographic Design Spec — [topic-slug]

## Overview
Layout: [name from references/infographic-layout-library.md]
Format: [Square 2048×2048 / Tall Scroll 1080×2700 / Multi-panel 2048×2048×3]
Illustration Style: [Style A: Maersk Dense / Style B: Ecomobility Minimal]
PRIMARY Zone: [zone ID] — [brief description of what it contains]
Total Zones: [count]

---

## Global Style

```
Canvas: 2048×2048px square (or specified format)
Background: #4182bc (medium royal steel blue — dominant, lighter tone)
Panel containers: #1c3182 (deep navy — framing, secondary)
Primary text: #ffffff (pure white)
Secondary text/labels: #99bcdb (powder blue)
Glow/tech accent: #4fc3f7 (cyan-teal)
Positive callouts: #10b981 (green)
Negative callouts: #ef4444 (red)
Warning callouts: #f59e0b (amber)
Neutral callouts: #6b7280 (gray)

Typography: Rotis Sans Serif throughout
Headline: Bold, ALL CAPS, 36-48pt, #ffffff
Zone headlines: Bold, ALL CAPS, 24-32pt, #ffffff
Body: Regular, mixed case, 13-15pt, #ffffff or #99bcdb
Data callouts: Bold, 48-72pt, semantic color
Citations: Regular, italic, 8-9pt, #99bcdb

Series mark: ShettysDeskSC | W{##} — bottom-right, 8pt #99bcdb
Top rule: 2px horizontal, #4fc3f7 — top edge of canvas
```

---

## Zone [T]: TITLE
**Copy weight**: ACCENT
**Dimensions**: 100% width × 12% height
**Position**: Top of canvas, full width

### Content
- Headline: [copy from infographic-copy.md — ALL CAPS, ≤8 words]
- Subheadline: [optional]

### Visual
- Background: #4182bc with top 2px #4fc3f7 rule
- No illustration in title zone — text only

### Colors
- Background: #4182bc
- Headline text: #ffffff
- Subheadline text: #99bcdb

### Typography
- Headline: Rotis Sans Serif Bold, 40pt, #ffffff, ALL CAPS
- Subheadline: Rotis Sans Serif Regular, 18pt, #99bcdb

---

## Zone [ID]: [ROLE]
**Copy weight**: PRIMARY
**Dimensions**: [%]% width × [%]% height
**Position**: [center / left / right / etc.]

### Content
- Headline: "[ALL CAPS ≤8 WORDS]"
- Body: "[≤2 sentences]"
- Data Callout 1: "[Number] [Label ≤15 chars]" → #[hex] (semantic meaning)
- Data Callout 2: "[Number] [Label]" → #[hex]

### Visual
- Dominant element: [illustration / chart / stat / diagram]
- Style: [Style A: isometric flat-3D / Style B: pure flat vector]
- Scene: [Specific description ≤50 words — objects, mood, lighting]
- Compositional direction: [Subject in left 60%, negative space right 40%]
- Color treatment: [Cinematic cool (5000K, cyan boosted) / Documentary flat (desaturated)]

### Colors
- Background: #4182bc
- Panel container: #1c3182 (if zone uses a panel box)
- Headline: #ffffff
- Body: #ffffff
- Data callout 1: #[semantic hex] — [positive/negative/warning/neutral]
- Data callout 2: #[semantic hex]
- Illustration accent: #4fc3f7 (cyan glow on key objects)

### Typography
- Headline: Rotis Sans Serif Bold, 28pt, #ffffff, ALL CAPS
- Body: Rotis Sans Serif Regular, 14pt, #ffffff
- Data callout: Rotis Sans Serif Bold, 56pt, #[semantic color]
- Data label: Rotis Sans Serif Semi-Bold, 16pt, #99bcdb

### Chart Specification (if applicable)
- Chart type: [HB (horizontal bar) / WF (waterfall) / 2x2 / Timeline / Gauge / Table]
- Interpretive claim (zone headline): "[what the chart argues]"
- Sub-claim (above chart, 18pt, #f59e0b amber): "[chart-specific insight]"
- Data series:
  - [Label]: [Value] → #[hex] [semantic meaning]
  - [Label]: [Value] → #[hex]
  - [Insight bar — asymmetric tension]: Most saturated color + label 20% larger + annotation arrow "This is the gap"
- Source (below chart, 9pt, #99bcdb): "[Organisation Year]"

---

## Zone [ID]: [ROLE]
**Copy weight**: SECONDARY
**Dimensions**: [%]% width × [%]% height
**Position**: [position description]

[... repeat zone spec block for each zone in the layout ...]

---

## Zone [ID]: CTA / FOOTER
**Copy weight**: ACCENT
**Dimensions**: 100% width × 10% height
**Position**: Bottom of canvas, full width

### Content
- Headline: [CTA text]
- Series mark: "ShettysDeskSC | W{##}"

### Visual
- Background: #1c3182 (navy footer band)

### Colors
- Background: #1c3182
- Headline: #ffffff
- Series mark: #99bcdb, 8pt

---

## Quality Gates
- [ ] Background is #4182bc (lighter steel-blue, NOT the dark #1c3182)?
- [ ] Exactly 1 PRIMARY zone?
- [ ] Semantic colors: green=positive, red=negative, amber=warning, gray=neutral?
- [ ] No dark text on blue backgrounds (white or #99bcdb only)?
- [ ] All hex codes explicit — no generic color names?
- [ ] No sources/citations in infographic (clean image)?
- [ ] Illustration style consistent across all zones (Style A or B, not mixed)?
- [ ] White space budget: ≥20% of frame area pure background?
- [ ] Compositional direction specified for all illustration zones?
- [ ] Series identity markers in Global Style (top cyan rule + ShettysDeskSC | W##)?
- [ ] All text strings ≤25 characters per element?
- [ ] Chart zones: all 4 annotation layers present (claim/sub-claim/chart/source)?
