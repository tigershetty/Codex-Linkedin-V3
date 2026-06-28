# Orion (SetProduct) Data-Viz Design System — Spec Reconstruction

**Date:** 2026-06-28
**Goal:** Pin the most concrete, reproducible-in-CSS details of SetProduct's Orion dataviz kit, to extend an existing reconstruction.

---

## 0. Access status — the Figma files could NOT be opened

Both client-linked Figma files returned **HTTP 403 Forbidden** via WebFetch (auth/JS-gated, as expected):
- `figma.com/file/Iux7Y8FMOYj3JsSF9VQnON/Orion-Demo` → 403
- `figma.com/file/zbKbDJmTleKgwP47ApVJf2/Orion-UI-kit-(preview)` → 403

The Figma **Community** mirror (`figma.com/community/file/1321360738741130308`) is also 403/JS-gated.
**Every WebFetch attempt 403'd**, including the SetProduct product page, Gumroad, and the secondary mirrors (uikitfree.com, figmaelements.com) — all are Cloudflare/bot-gated. So everything below is reconstructed from **WebSearch result snippets only**, not from the design files. Items are tagged **[CONFIRMED]** (stated in sources), **[HOUSE-STD]** (SetProduct's documented standard conventions, very likely applied in Orion), or **[INFERRED]** (best-practice reconstruction, verify against the actual file).

> Bottom line: the one genuinely NEW hard fact beyond "Orion is a dataviz Figma kit with light/dark themes" is the **typeface (Manrope)** and SetProduct's **house token scale** (8px spacing, 4-step radius, 4-step elevation). The Orion-specific **categorical chart hexes are NOT published** anywhere reachable and must be sampled from the .FIG file or exported PNGs.

---

## 1. Kit scope / structure [CONFIRMED]

- Figma library, **light + dark themes shipped as two independent `.FIG` files** (use one or both). This matters: the light theme is a separate file, so light tokens are self-contained.
- Size claims vary by version (the kit has grown): older **25+ templates / 180+ widgets / 480 components**; current marketing says **50+ full-width chart/dashboard templates, 200+ dataviz widgets, ~500 components** (some pages inflate to "2500+ components" counting variants).
- Built **entirely on Auto-layout + Figma variants**, with shared **Color styles + Text styles** — i.e. it is tokenized, not ad-hoc.
- Chart families present: **bar, line/area, donut/pie, bubble, plus gauges, progress, KPI/stat widgets, bar-stacked, infographics**.
- Author: Alien Pixels / Roman Kamushken for SetProduct. Sibling kit "Hyper Charts" shares the same design language.

## 2. Typography [CONFIRMED typeface; scale HOUSE-STD/INFERRED]

- **Typeface: Manrope** (geometric/grotesque sans, free, open-source). This is the single most concrete NEW reproducible fact. Manrope has **tabular/lining figures** suitable for numeric KPI alignment — use `font-feature-settings: "tnum" 1;` for chart axis + KPI numbers.
- Weights in play (Manrope ships 200–800): practically **Regular 400 / Medium 500 / SemiBold 600 / Bold 700/800**. KPI headline numbers = 700/800; labels/captions = 500/600.
- Suggested type scale (SetProduct house rhythm, **INFERRED** — verify):
  - KPI headline / big number: **28–40px / 700–800**, tight line-height (~1.1)
  - Card title / section header: **16–18px / 600**
  - Body / table cell: **14px / 400–500**
  - Axis labels, legend, captions: **12px / 500**
  - Micro-label / unit: **10–11px / 500**, often uppercase with letter-spacing.
- CSS fallback stack: `"Manrope", "Inter", system-ui, sans-serif`.

## 3. Spacing, radius, elevation tokens [HOUSE-STD — SetProduct's documented foundation]

From SetProduct's own design-system-foundation guidance (their kits share this grammar):
- **Spacing: 8px base unit**, scale 0 → 80px (4px used as the half-step). So 4 / 8 / 12 / 16 / 24 / 32 / 40 / 48 / 64 / 80.
- **Corner-radius scale (4 steps):**
  - `radius.1` — small controls (chips, toggles, tags) ≈ **4px**
  - `radius.2` — inputs, buttons ≈ **8px**
  - `radius.3` — cards & panels ≈ **12px**
  - `radius.4` — modals / large surfaces ≈ **16px**
- **Elevation (4 steps):** `elevation.0` canvas/flat → `elevation.1` cards → `elevation.2` popovers/dropdowns → `elevation.3` modals. SetProduct's stated house aesthetic: **subtle 1px border + a mild shadow reads cleaner than a heavy shadow** — so expect low-opacity, small-blur shadows (e.g. `0 1px 2px rgba(16,24,40,.05)`, `0 4px 8px rgba(16,24,40,.08)`), NOT dramatic drop shadows.

## 4. Color tokens [INFERRED — exact Orion hexes are NOT published]

**Important:** No reachable source publishes Orion's actual categorical/series hexes. Web "Orion color palette" hits are all unrelated (Orion Pharma, paint codes, Pantone "Orion Blue"). The light-theme structure below is reconstructed from SetProduct's house style + dashboard-design blog; **sample the real values from the .FIG / exported PNGs before locking them.**

Light theme structure (reconstruct, then verify):
- **Canvas / page background:** very light cool gray — ~`#F7F8FA` / `#F5F6F8` (not pure white).
- **Card / surface:** pure or near-white — `#FFFFFF`, separated from canvas by a hairline border.
- **Hairline border / divider:** ~`#E4E7EC` / `#EAECF0`.
- **Text tiers:** primary ~`#101828`/`#1D2939`; secondary/muted ~`#475467`/`#667085`; tertiary/axis ~`#98A2B3`.
- **Accent / primary brand:** a vivid blue/indigo — Orion leans **electric blue–violet** (one captured older palette literally listed `#0413F1`, `#090F96`, `#080A61`, `#030209` — a deep-blue → near-black indigo ramp; treat as indicative of Orion's blue-dominant identity, not the final token).
- **Semantic up/positive:** green ~`#12B76A`/`#16A34A`. **Down/negative:** red ~`#F04438`/`#EF4444`. **Warning:** amber ~`#F79009`. (SetProduct's dashboard blog: delta is **color-coded by direction only — green up / red down — and must read in grayscale**, so always pair with an arrow glyph, and DON'T tint the headline number itself.)
- **Categorical data-series palette:** Orion's signature is a **blue-led multi-hue set** (blue → violet/purple → teal/green → amber → pink). Expect ~6–8 series hues. **These specific hexes are the single biggest gap — must be eyedropped from the file.**

## 5. Chart specifics [INFERRED — house/best-practice; verify in file]

- **Bars:** rounded top corners, **~4px (radius.1) on the top two corners** of vertical bars; category gap ratio roughly **40–50%** (bars a touch wider than the gaps); grouped bars share a tight inner gap (~4px).
- **Gradient fills:** area/line charts use a **vertical fade gradient** from the series color (~15–25% alpha at top) to transparent at the baseline — a SetProduct signature look.
- **Line stroke:** **~2px** (≈1.5–2.5px); smooth/monotone curves common; data points as small filled dots only on hover/active.
- **Donut/pie:** **donut ring ≈ 20–28% of radius** (medium-thick ring, not a thin gauge); small **gap/stroke between segments (~2–4px white separator)**; center reserved for a total/KPI. SetProduct rule: **donut only for ≤5 slices.**
- **Gauge:** semicircular (**180°**) and ~**240–270° "speedometer"** arcs both appear; rounded arc caps; track in a light neutral with the value arc in accent.
- **Progress:** thin pill bars, fully rounded caps (height ~6–8px), track in neutral-100, fill in accent or semantic.
- **Gridlines:** **horizontal only**, very light (`#EAECF0`-ish, often dashed or 1px solid), no vertical grid, no chart border — minimal, recedes behind data.
- **Legend:** SetProduct preaches **labels directly on chart elements over separate legends**; where a legend exists it's a horizontal row of small **dot/swatch + label** chips, 12px.
- **Tooltip:** floating card, dark or white, `radius.2` (8px), `elevation.2` shadow, small caret, shows series swatch + value with tabular figures.

## 6. Component anatomy [INFERRED from SetProduct dashboard blog + house tokens]

- **KPI / stat card:** card surface, `radius.3` (12px), padding ~16–24px. **Three slots:** (1) headline number (Manrope 28–40 / 700–800, tabular), (2) delta with arrow + green/red, (3) comparison label ("vs last 7 days", muted 12px). Often a **mini sparkline/area** in the card. Heaviest visual weight in the dashboard, placed in a top row.
- **Tables:** clear header/row split, **restrained borders** (horizontal dividers only), sortable columns, 14px cells, comfortable row height (~44–48px), numeric columns right-aligned with tabular figures.
- **Chips / badges:** `radius.1`, small (12px text), tinted-background + colored-text status pills (success/warn/error tints).
- **Segmented control:** pill group, `radius.2`, active segment = white pill on neutral track (light theme) with subtle shadow.
- **Tooltips:** see §5.

## 7. Orion Demo dashboard layout — distinctive cues worth copying [INFERRED]

- **Top KPI row** of 3–4 stat cards (big number + delta + sparkline) carrying the heaviest weight.
- **Full-width / "full-screen" chart templates** are Orion's headline selling point — large hero charts that span the content width with generous whitespace.
- **Card-based modular grid** on the 8px system; charts live in white cards on a light-gray canvas, separated by hairline borders + soft shadows.
- **Gradient area charts + rounded bars + center-labeled donuts** are the recurring visual signature.
- Light + dark are **mirror layouts** (same structure, swapped tokens), so a single layout reconstruction serves both themes.

---

## 8. What to verify against the real file (gaps)
1. **Exact categorical series hexes** (biggest gap — none published).
2. Exact light-theme canvas/card/border/text hexes (above are reconstructed, not sampled).
3. Exact bar radius, donut ring %, line px, gauge degrees.
4. Exact Manrope sizes/weights per text style.
5. Exact shadow token values.
→ All of these require eyedropping the `.FIG` file or its exported PNGs; they are not on the open web.

## Sources
- https://www.setproduct.com/templates/orion
- https://setproduct.gumroad.com/l/orion-for-figma
- https://www.setproduct.com/freebies/orion-dataviz-templates
- https://www.setproduct.com/blog/how-to-design-a-ui-kit-foundation (Manrope + token scale)
- https://www.setproduct.com/blog/dashboard-ui-design (KPI slots, green/red delta, legend-on-element)
- https://www.setproduct.com/dataviz
- https://dribbble.com/shots/23040575 ; /14821140 ; /14466982 (Orion shots)
- https://www.figma.com/community/file/1321360738741130308 (community mirror, 403-gated)
- Client Figma files (403): /file/Iux7Y8FMOYj3JsSF9VQnON ; /file/zbKbDJmTleKgwP47ApVJf2
