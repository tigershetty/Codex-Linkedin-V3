# Design Skill — Infographic Content Engine v1

## Purpose
Transform the zone script from `infographic-copy.md` into a complete per-zone visual specification, ready for AI image generation. Output: one consolidated `infographic-design.md` with zone-level visual specs encoded in the Shetty's Desk visual language.

## Invoke
```
/design [topic-slug]
```

## Prerequisites
`data/{week}/{topic-slug}/infographic-copy.md` must exist with:
- Layout and Format selected
- Zone script complete (all zones present)
- Illustration style selected (Style A or Style B)

## Output
```
data/{YYYY-W##}/{topic-slug}/infographic-design.md
```

---

## Step 1: Load Visual Standards

Read `references/infographic-visual-dna.md` — color palette, typography, illustration styles, compositional rules, quality gates.
Read `references/infographic-layout-library.md` — zone map for the selected layout.

---

## Step 2: Route Illustration Style

Use the `illustration_style` from `infographic-copy.md`:

| Style | When to use | AI prompt style string |
|---|---|---|
| **Style A: Maersk Dense** | High data density, consultancy topics, company pivots, mechanisms | `"consultancy-grade infographic illustration, isometric flat-3D hybrid, blue monochrome palette #4182bc, cyan-white glow accents #4fc3f7, clean vector icons, high data density, smooth gradients, executive aesthetic"` |
| **Style B: Ecomobility Minimal** | Editorial, thought leadership, myth-busting, timeline topics | `"editorial infographic illustration, pure flat vector, minimal white-on-blue #4182bc, generous white space, no shadows, no depth, clean geometric forms, magazine editorial quality"` |

---

## Step 3: Build Per-Zone Visual Specification

For each zone in the zone script, produce the following specification:

### Zone Visual Spec Format

```
## Zone [ID]: [ZONE ROLE]
**Copy weight**: [PRIMARY / SECONDARY / ACCENT]
**Dimensions**: [% of canvas width × % of canvas height]
**Position**: [top-left / top-right / center / etc.]

### Content
- Headline: [copy text — ALL CAPS, ≤8 words]
- Subheadline: [optional — mixed case, ≤12 words]
- Body: [copy text — ≤2 sentences]
- Data Callouts:
  - [Number] [Label] → Color: [hex]
  - [Number] [Label] → Color: [hex]

### Visual
- Dominant element: [illustration / chart / stat / diagram / icon array]
- Illustration style: [Style A: Maersk Dense / Style B: Ecomobility Minimal]
- Scene description: [specific enough for AI image generation — ≤50 words]
- Compositional direction: [Subject position, negative space, focal point]

### Colors
- Background: [hex] [role]
- Panel container: [hex] (if zone uses a panel)
- Headline text: #ffffff
- Body text: #ffffff or #99bcdb
- Data callout 1: [hex] [semantic meaning]
- Data callout 2: [hex] [semantic meaning]
- Accent element: [hex]

### Typography
- Headline: Rotis Sans Serif Bold, [pt], #ffffff, ALL CAPS
- Body: Rotis Sans Serif Regular, [pt], #ffffff or #99bcdb
- Data callout: Rotis Sans Serif Bold, [oversized pt], [semantic color hex]
- Citation (if applicable): Rotis Sans Serif Regular, 8pt, #99bcdb, italic

### Chart Specification (if applicable)
- Chart type: [HB / WF / 2x2 / Timeline / Gauge / Table]
- Data series: [label, value, color hex for each bar/segment]
- Interpretive claim (headline): [what the chart argues — not just what it shows]
- Sub-claim (above chart, 18pt, #f59e0b): [chart-specific insight]
- Source annotation (below chart, 9pt, #99bcdb): [Organisation Year]
- Asymmetric tension: [which bar/series gets most saturated color + annotation arrow]
```

---

## Step 4: Apply Visual Excellence Standards

### Standard 1: Semantic Icon Assignment
Assign icons from the 12-icon vocabulary in `references/infographic-visual-dna.md`:
- Decision nodes: checkmark (confirmed) / X-mark (failed)
- Process steps: right-arrow (progression)
- Data trends: up-arrow (growth) / down-arrow (decline)
- Geographic zones: globe icon
- People/workforce elements: person icon

### Standard 2: Cinematic Color Grading
Apply tonal treatment based on zone content:
- **Hook / Climax zones** (opportunity, growth, positive outcomes): cool cinematic treatment
  `"color temperature: cool 5000K, blue-cyan channel boosted, warm tones desaturated, shadow depth: teal undertones, highlight: cool white"`
- **Counter-case / Failure zones** (risk, decline, cautionary):
  `"desaturated 30-40%, flat contrast, documentary quality, no cinematic lighting"`

### Standard 3: Chart Annotation Hierarchy (4-layer, mandatory for all chart zones)
1. Zone headline (interpretive claim — what the chart argues)
2. Sub-claim (chart-specific insight, 18pt, `#f59e0b` amber accent, ABOVE chart)
3. Chart (with semantic colors, asymmetric tension on primary bar)
4. Source annotation (9pt, `#99bcdb` gray, BELOW chart, left-aligned)

### Standard 4: Asymmetric Chart Tension
The data series carrying the primary insight:
- Most saturated color in the palette
- Data label 20% larger than other labels
- Annotation arrow pointing to it: "This is the gap" or "This is the number"

### Standard 5: Compositional Dead Zone Rules
For every zone with an illustration:
- Primary subject: left 60% of zone width
- Right 40%: negative space (for headline overlay at thumbnail scale)
- Top 10%: clear (LinkedIn feed avatar overlay zone)
- Bottom 30%: high contrast (white text must read at any size)

---

## CONTROL GATE 4 — Design Review (required before /gemini-prompt)

After producing the full visual spec, present:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 DESIGN REVIEW — APPROVE BEFORE GENERATING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Layout: [name]
Format: [dimensions]
Illustration style: [Maersk Dense / Ecomobility Minimal]
PRIMARY zone: [zone ID] — [brief description]
Color palette: Background #4182bc | Panels #1c3182 | Text #ffffff / #99bcdb
Zones specified: [count] zones

Quality gates:
✅ Background #4182bc confirmed (not too dark)
✅ Exactly 1 PRIMARY zone
✅ All hex codes explicit
✅ Semantic colors assigned correctly
✅ No sources/citations in image
✅ Series markers specified
[✅ or ❌ for each gate]

Any changes before generating? Y to approve / describe changes.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

User approves or requests changes. Once approved, `/gemini-prompt` can run.

---

## Output Structure: infographic-design.md

```markdown
# Infographic Design Spec — [topic-slug]

## Overview
Layout: [name]
Format: [Square 2048×2048 / Tall Scroll / Multi-panel]
Illustration Style: [Style A or Style B]
PRIMARY Zone: [zone ID + description]
Total Zones: [count]

---

## Global Style
Background: #4182bc (medium royal steel blue — dominant)
Panel containers: #1c3182 (deep navy)
Secondary text: #99bcdb (powder blue)
Primary text: #ffffff (white)
Glow accent: #4fc3f7 (cyan-teal)
Typography: Rotis Sans Serif throughout
Series mark: ShettysDeskSC | W{##} — bottom-right, 8pt #99bcdb
Top rule: 2px horizontal, #4fc3f7 — top edge

---

[Per-zone visual specifications — one section per zone, following Zone Visual Spec Format]

---

## Quality Gates
- [ ] Background #4182bc (not too dark, not #1c3182)?
- [ ] Exactly 1 PRIMARY zone?
- [ ] Semantic colors: green=positive, red=negative, amber=warning, gray=neutral?
- [ ] No dark text on blue backgrounds?
- [ ] All hex codes explicit (no generic color names)?
- [ ] No sources/citations in infographic?
- [ ] Illustration style consistent across all zones?
- [ ] White space budget: ≥20% of frame area pure background?
- [ ] Compositional direction specified for all illustration zones?
- [ ] Series identity markers in spec (top cyan rule + ShettysDeskSC | W##)?
- [ ] All text strings ≤25 characters per element (Imagen rendering limit)?
```

---

## Quality Contracts

### Hard Requirements
- Per-zone spec present for every zone in the layout
- Color palette uses only the verified hex codes from `infographic-visual-dna.md`
- Exactly 1 PRIMARY zone
- All hex codes explicit (no generic names)
- Quality gates table complete with pass/fail
- Control Gate 4 presented and approved by user

### Quality Standards (Claude judgment)
- Chart sub-claim is interpretive (argues a position) not merely descriptive
- Compositional direction avoids the LinkedIn mobile dead zones
- Cinematic grading applied to Hook zone and Counter-case zone
- Series markers (top rule + ShettysDeskSC | W##) present in Global Style section

---

## Self-Validation Checklist

Before presenting Control Gate 4:

- [ ] All zones from copy.md have a design spec?
- [ ] Background #4182bc dominant (not the dark #1c3182)?
- [ ] Typography: Rotis Sans Serif named for all text roles?
- [ ] Chart zones: all 4 annotation layers present?
- [ ] Illustration zones: compositional direction specified?
- [ ] Exactly 1 PRIMARY zone?
- [ ] Semantic colors correctly applied?
- [ ] All text strings ≤25 characters?
- [ ] Series markers specified in Global Style?
- [ ] Quality gates table all answered?
