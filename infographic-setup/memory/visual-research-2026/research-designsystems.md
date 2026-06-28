# Premium Data-Viz UI Research — SetProduct "Orion" & the Modern Dashboard Aesthetic

**For:** Shetty's Desk code-rendered LinkedIn infographics (1080×1350, HTML/CSS/SVG → PNG)
**Brand frame:** azure `#2798FB` + eco-green `#38E6A6` + ink `#15315C`, Poppins, luminous-on-white, flat-isometric.
**Date:** 2026-06-28

---

## 0. Access honesty — what I could and couldn't open

The agent proxy **hard-blocks (HTTP 403 / Cloudflare)** the most relevant primary sources:

- ❌ `setproduct.com` — every path (Orion template page, dataviz index, blog, Gumroad mirror) returned 403.
- ❌ `dribbble.com` — all SetProduct/Alien-Pixels shot pages returned 403 (Cloudflare bot wall).
- ❌ `joshwcomeau.com`, `seedflip.co`, `pixeldarts.com`, `mantlr.com`, `uikitfree.com`, `designsystems.surf` — 403.
- ✅ **WebSearch worked throughout** — I reconstructed Orion's spec from search snippets (which surfaced real hex values, component counts, chart taxonomy) + SetProduct's own product copy that leaked through search.
- ✅ **GitHub raw worked** — pulled the full **Refactoring UI** rules file (concrete shadow/spacing/type/color scales). This is the single most load-bearing source in this report and its values are quoted verbatim below.

Everything labeled "Orion" below is **reconstructed** from search snippets + my own prior knowledge of the kit, not a live page read. Treat hex values sourced from Dribbble snippets as indicative of the dark-theme palette, not a definitive token dump.

---

## 1. ORION — THE CENTERPIECE (reconstructed spec)

### 1.1 What Orion actually is
A Figma data-visualization design system by **Roman Kamushken / Alien Pixels for SetProduct**: ~50 full-width chart templates, **200+ dataviz widgets**, **500 auto-layout components**, shipped as **two independent .FIG files (light + dark)** with full Color + Text styles. Chart taxonomy is unusually broad: bar (H/V), line, area, **donut/pie**, bubble, **gauge/radial**, radar/polar, sankey, treemap, heatmap, bullet, cohort, gantt, hexbin, candlestick, **sparklines**, and **KPI stat widgets**. The premium signal is *systematization* — every widget is one component family with swappable data, consistent radii, consistent legend, consistent number treatment.

### 1.2 Color system (reconstructed)
**Dark theme** (the hero look in most Orion shots). Surfaced hex from search: near-black canvas `#030206`, panel `#070A5C`/deep indigo, with **electric accent series** `#020EF5` (blue), `#050BA4`, plus saturated reds `#BA0B0A`/`#5B1A1A` and a muted green `#84BFA9` for series differentiation.
- **Canvas:** true near-black, not pure `#000` — `#0B0E14`–`#111` range, so elevated cards (one step lighter) read as lifted.
- **Card surface:** one luminance step above canvas (e.g. `#161A22`), often with a 1px hairline border at ~6–10% white.
- **Accent discipline:** one dominant brand hue (electric blue) carries ~80% of the color; the data-series palette is a *tuned set* (hue ≥30° apart, equal perceptual weight) used only inside charts.
- **Semantic:** green = positive/up, red = negative/down, amber = warning — applied to delta chips and trend arrows, never decoratively.

**Light theme:** white/`#F7F8FA` canvas, white cards, soft cool-grey gridlines (`#EEF1F5`), ink text. This is the theme closest to Shetty's Desk.

### 1.3 KPI / stat-card anatomy (the reusable unit)
The Orion stat card is the highest-leverage component to clone. Anatomy, top→bottom:
1. **Eyebrow label** — 11–12px, uppercase, `letter-spacing: .06em`, weight 500–600, muted/tertiary color. Often paired with a small mono icon in a tinted square chip.
2. **Hero number** — 32–48px, weight 600–700, **tabular figures** (`font-variant-numeric: tabular-nums`), tight tracking (`-0.02em`). Optional unit ("k", "%", "$") at smaller size and lighter weight, baseline-aligned.
3. **Delta chip** — pill badge, `↑ 12.4%` in green tint (bg `green/12%`, text `green/100`) or red, radius ~999px, 11–12px, weight 600.
4. **Micro-context** — "vs last week" 11–12px tertiary.
5. **Sparkline / micro-bar** anchored to the card bottom edge, full-bleed, ~28–40px tall, gradient area fill fading to transparent.

This vertical rhythm (tiny label → huge number → small delta → micro chart) is *the* premium tell.

### 1.4 Chart styling rules (what makes Orion charts look modern)
- **Bars:** rounded top caps only (`border-radius: 6px 6px 0 0`), generous inter-bar gap (bar ≈ 60–70% of band), often a **vertical gradient fill** (accent → 70% lighter at base) or a single flat accent with one highlighted bar in full saturation and the rest dimmed.
- **Lines:** 2–3px stroke, **rounded line caps & joins** (`stroke-linecap/linejoin: round`), no markers except endpoints; **soft gradient area** under the line (accent at 18–24% opacity fading to 0%). Smooth monotone curves, not jagged polylines.
- **Donut/pie:** thick ring (not thin), **rounded segment ends**, small gap between segments (2–4px stroke gap), **big centered value + tiny label** in the hole. Micro-legend as a 2-col list of `● label … value` rows, not a chart-attached legend.
- **Gauge/radial:** 270° arc, rounded cap, track at ~8% accent, fill at full accent or gradient; value centered.
- **Progress:** pill track (radius 999px), 6–10px tall, track tinted, fill accent (often gradient), optional label-on-bar at the right end.
- **Gridlines:** horizontal only, hairline, very low contrast (`#EEF1F5` light / white-6% dark), **no vertical gridlines, no chart border, no axis spine**. Axis labels are tertiary 11px.
- **Labels-on-element:** values sit on/above bars and at line endpoints rather than forcing the eye to a Y-axis — reduces clutter.

### 1.5 Elevation / shadow (Orion light theme)
Soft, **colored** (not black) ambient shadow — a single low-contrast diffuse layer for the lifted card, e.g. `0 8px 24px rgba(21,49,92,.08)` plus a 1px hairline border. Dark theme leans on **luminance contrast + hairline borders** rather than shadow (shadows barely read on dark, so the lift comes from the card being one step lighter than canvas + a top inner-highlight `inset 0 1px 0 rgba(255,255,255,.04)`).

### 1.6 Corner-radius scale
Consistent radii are a huge "expensive" tell. Orion-class scale: **chips/badges 999px (full pill)**, buttons/inputs 8px, **cards 12–16px**, inner wells/chart panels 8–12px, icon tiles 8–10px. Never mix arbitrary radii — pick 2–3 and nest them (outer card radius > inner element radius by ~4px so corners stay concentric).

### 1.7 Spacing grid & density
Strict **4/8px grid**. Dense data stays uncluttered via: (a) consistent 16–24px card padding, (b) tight grouping of related items / wide gaps between groups, (c) hairline dividers instead of heavy rules, (d) generous whitespace around the hero number, (e) right-aligned numeric columns in tables so decimals line up.

### 1.8 Typography
Display/UI sans (Orion ships Inter-like). Pairing logic = **huge number + tiny uppercase label**:
- Hero stat 32–48 / 600–700 / tabular / tracking −0.02em.
- Eyebrow 11–12 / 600 / uppercase / tracking +0.06em / tertiary color.
- Body/table 13–14 / 400–500.
- Tabular numerals **everywhere numbers change** so columns don't shimmer.

### 1.9 Component details that separate $5k from generic
Concentric corner radii; optical alignment of the number's baseline with its unit; one accent doing 80% of the work; tabular figures; hairline borders instead of drop shadows on dark; consistent 1.5px–2px icon stroke weight matching the type weight; delta chips with tinted (not solid) backgrounds; no pure black / no pure white (slightly tinted neutrals); whitespace as the primary separator.

---

## 2. CROSS-SOURCE TECHNIQUE LIBRARY (reproducible in CSS)

### 2.1 Depth & elevation
**Refactoring UI shadow scale (verbatim, light theme):**
| Level | Use | Value |
|---|---|---|
| xs | buttons | `0 1px 2px rgba(0,0,0,.05)` |
| sm | cards | `0 1px 3px rgba(0,0,0,.1), 0 1px 2px rgba(0,0,0,.06)` |
| md | dropdowns | `0 4px 6px rgba(0,0,0,.1), 0 2px 4px rgba(0,0,0,.06)` |
| lg | modals | `0 10px 15px rgba(0,0,0,.1), 0 4px 6px rgba(0,0,0,.05)` |
| xl | hero | `0 20px 25px rgba(0,0,0,.15), 0 10px 10px rgba(0,0,0,.05)` |

Rules: **always two layers** (tight crisp shadow + large soft atmosphere). **Tint the shadow toward the brand ink** rather than pure black on a light luminous bg. Add an **inner top highlight** (`inset 0 1px 0 rgba(255,255,255,.6)`) on light cards for a "lifted glass" lip. Depth without shadow = overlap + lighter-is-closer + colored top border.

### 2.2 Grid & spacing
4/8 scale: `4,8,12,16,24,32,48,64,96,128`. Wider gaps between unrelated blocks, tighter within a group. Line length 45–75ch. Don't fill the whole frame — give elements only the space they need.

### 2.3 Typography
Type scale `12,14,16,18,20,24,30,36,48,60,72`. Headings line-height 1–1.25, body 1.5. Tighten big headings (−0.02 to −0.05em), widen small uppercase labels (+0.05em). Drive hierarchy with **weight + color first, size last**. Right-align numbers; tabular figures for any changing number.

### 2.4 Color systems
One brand hue does 80%; greys 8–9 shades; each semantic color a 9-step ramp (50→900). Text = three tiers (dark / mid-grey / light-grey). Slightly tinted neutrals beat pure grey. **Data-series palette:** hues ≥30° apart, equal saturation/lightness; blue-orange is the most color-blind-safe pair; never rely on color alone — add label/position/shape. Cap categorical at ~6 colors.

### 2.5 Chart styling
Rounded bar caps; rounded line caps/joins; gradient area fills fading to transparent; donut via `conic-gradient` + radial mask for the hole; progress/gauge via `conic-gradient` + `@property`-animated custom prop; horizontal-only hairline gridlines via `repeating-linear-gradient`; labels-on-element; micro-legends as text rows.

### 2.6 Component anatomy
KPI card (§1.3); **segmented control** = pill track, active segment a white pill with sm shadow sliding over tinted bg; **chips/badges** = full-pill, tinted bg + saturated text; **tables** = no vertical borders, hairline row dividers, right-aligned tabular numerics, sticky muted uppercase header; **progress meters** = pill track + accent fill; **timeline rail** = 2px vertical line with node dots; **leader-lined annotations** = thin connector from a dot on the data to an offset label.

### 2.7 The "expensive" details
Consistent concentric radii · optical (not metric) alignment · one disciplined accent · tabular figures · hairline borders over heavy ones · matched icon stroke weight · tinted shadows & tinted neutrals · whitespace as the separator · restraint everywhere.

### 2.8 Linear / Vercel / Stripe / Untitled UI / Tremor takeaways
- **Borders functionally invisible** — white at ~8% (dark) / ink at ~8% (light); structure without weight.
- **Flat core UI, gradients only as background atmosphere** (radial fades), never on buttons/cards.
- **One color does the work** (Linear purple, Stripe gradient, Vercel mono+blue).
- **Vercel "blueprint grid"** — faint dot/line grid behind content for an engineered feel.
- **Untitled UI** — neutral low-saturation greys; tokens for color/space/radius/shadow/type; refined default shadows + gradients.
- **Tremor** — production defaults worth copying: rounded bars, soft gridlines, sparklines, KPI cards, restrained categorical palette.

---

## 2.9 Muzli infographic feed + editorial data-viz patterns

*Access: `search.muz.li`, `muz.li`, and the three named Orion Dribbble shots (23040575, 14821140, 14466982) all returned **403** via the proxy. Patterns below reconstructed from Muzli's search-surfaced collection copy + 2026 infographic-trend articles.*

Recurring premium patterns across the Muzli infographic / dashboard feed and the modern "data-viz editorial" look:
- **Data-first, not decoration** — layout is built around *one insight per card*, charts earn their place; the headline number is the hero, the chart is supporting evidence. This maps exactly onto Orion's stat-card hierarchy.
- **Soft-edged cards + restrained pastel accent + clear type** is the formula cited for "dozens of data points without overwhelm" — i.e. the uncluttered-density trick = consistent radii + one accent + generous whitespace + hairline dividers.
- **Editorial number-led hero** — oversized hero figure with a tiny kicker label, then a compact supporting chart; treat the card like a magazine stat callout. Strong, slightly oversized display type is the dominant 2026 infographic trend.
- **Chart discipline** — bar charts as the default (most universally read); pie/donut only for part-to-whole with <6 segments; no 3D, no chart-junk. Reinforces §2.5.
- **Sectioned grid / modular cards** — Muzli-trend infographics read as a grid of self-contained modules, each a mini stat card, unified by shared radius/shadow/accent — the same systematization that makes Orion look premium.
- **Captioned data + micro-annotation** — short labels directly on the data (label-on-element, leader-lined callouts) instead of distant legends.

**Net add for Shetty's Desk:** treat each 1080×1350 card as *one editorial insight* — oversized hero number, tiny kicker, one supporting azure chart, generous white space — rather than a dense dashboard. That's the highest-conversion form of the Orion language for a feed.

---

## 3. ORION → SHETTY'S DESK TRANSLATION (1080×1350, pure HTML/CSS)

**Tokens to define once:**
```css
:root{
  --ink:#15315C; --azure:#2798FB; --green:#38E6A6;
  --canvas:#F6F9FE;            /* luminous, faint cool tint */
  --card:#FFFFFF;
  --ink-60:rgba(21,49,92,.60); --ink-40:rgba(21,49,92,.40);
  --hair:rgba(21,49,92,.08);   /* invisible-ish border */
  --azure-12:rgba(39,152,251,.12);
  --green-14:rgba(56,230,166,.16);
  /* radii */ --r-pill:999px; --r-card:20px; --r-inner:12px; --r-tile:12px;
  /* shadow: tinted toward ink, two layers + top lip */
  --lift:0 1px 2px rgba(21,49,92,.06), 0 12px 28px rgba(21,49,92,.10),
         inset 0 1px 0 rgba(255,255,255,.7);
  --font:"Poppins",sans-serif;
}
```

| Orion technique | Shetty's Desk application |
|---|---|
| **Stat-card anatomy** | Eyebrow 12px uppercase Poppins 600 `--ink-40` +.06em → hero number 64–84px (bigger for feed legibility) Poppins 700 ink `tabular-nums` −0.02em → green/red delta pill → micro sparkline at card foot. |
| **One accent does 80%** | Azure is the dominant hue; **eco-green reserved for "positive/eco/up"** semantics + one hero accent. Ink is text + tinted shadow. Don't let green and azure fight — green is the spice, azure the dish. |
| **Tinted, two-layer shadow** | `--lift` above — never black, always ink-tinted, plus a white inner-top lip so white cards lift off the luminous canvas. |
| **Hairline borders** | `1px solid var(--hair)` on cards/wells instead of heavy strokes. |
| **Concentric radii** | Card 20px, inner well/chart 12px, chips full-pill, icon tiles 12px. Never mix random radii. |
| **4/8 grid** | 64px page margin, 24px card padding, 8/16/24/32 internal gaps. |
| **Rounded bars + gradient** | SVG/`<div>` bars, `border-radius:8px 8px 0 0`, fill `linear-gradient(var(--azure), #BFE0FF)`; highlight one bar full-azure, dim the rest to `--azure-12`. |
| **Line chart** | 3px azure stroke, round caps/joins, area `linear-gradient(rgba(39,152,251,.22), transparent)`; green endpoint dot for the "now" value. |
| **Donut** | `conic-gradient` ring (azure → green segments), radial-mask hole, big ink value + tiny label centered. |
| **Progress / gauge** | Pill track `--azure-12`, fill azure→green gradient; or 270° `conic-gradient` gauge. |
| **Gridlines** | Horizontal hairlines only via `repeating-linear-gradient(transparent 0, transparent 47px, var(--hair) 48px)`; no axis spine, no vertical lines. |
| **Delta chip** | `background:var(--green-14); color:#0FB87E; border-radius:999px; font:600 12px Poppins` with ↑ glyph. |
| **Segmented control** | Pill track `--azure-12`; active = white pill + sm shadow. |
| **Table** | Hairline row dividers only, uppercase `--ink-40` header, right-aligned `tabular-nums`. |
| **Vercel blueprint grid** | Optional faint dot grid behind content: `radial-gradient(var(--hair) 1px, transparent 1px)` 24px — engineered, on-brand for supply-chain. |
| **Flat-isometric** | Keep iso illustrations flat with a **single soft contact shadow** (`filter: drop-shadow(0 18px 24px rgba(21,49,92,.12))`) — matches the "expensive" tinted-shadow language. |
| **Tabular figures** | `font-variant-numeric: tabular-nums` on every number that varies. |
| **Restraint** | No pure black, no pure white text (use ink + `--ink-60`); whitespace as the separator; one accent; consistent 1.75px icon stroke to match Poppins weight. |

**Brand-safety guardrails:** stay on the **light/luminous** Orion theme (the dark-theme electric-blue palette is off-brand). Convert any gradient to azure→green or azure→light-azure only. Keep elevation subtle (this is print-like, not glassy neon). Green must read as semantic/eco, not random series color.

---

## 4. MORE SOURCES TO FOLLOW (premium data-viz / dashboard vein)

1. **SetProduct** (Roman Kamushken) — Orion, Hyper Charts, Charts UI Kit, Material Desktop, Neolex, S8. The reference.
2. **Alien Pixels** — the studio that drew most Orion shots.
3. **Refactoring UI** (Adam Wathan + Steve Schoger) — the rulebook; @steveschoger on X for micro-craft.
4. **Tremor** (tremor.so) — open-source React dashboard charts; copy their defaults.
5. **Untitled UI** (untitledui.com) — largest Figma kit; tokens, shadows, neutrals.
6. **Linear** (linear.app) — restraint, borders-as-structure, one-accent.
7. **Vercel / Geist** — blueprint grid, mono-influenced type, flat surfaces.
8. **Stripe** — gradient-as-signature, dashboard polish, docs craft.
9. **Mintlify** — clean docs/data presentation.
10. **Tailwind UI / Catalyst** — production component anatomy.
11. **Cred design team** — fintech depth, microinteractions, dark premium.
12. **Pitch** — editorial-meets-data slide craft.
13. **Superlist** — bold gradient identity done tastefully.
14. **Tableau / Datawrapper / Flourish** blogs — chart-styling fundamentals.
15. **Nicholas Rougeux, Federica Fragapane, Giorgia Lupi (Pentagram)** — high-craft dataviz.
16. **Datylon** + **Atlassian dataviz color guide** — series-palette rules.
17. **IBM Carbon Charts** — accessible dataviz tokens.
18. **Josh W. Comeau** (joshwcomeau.com) — designing realistic CSS shadows/gradients.
19. **Cred/Razorpay, Ramp, Mercury, Arc** (fintech) dashboards — Dribbble/Behance.
20. **Dribbble creators:** Nixtio, Syncrely, Victoria Grinevich, Kevin Dukkon; **Behance** "data visualization" galleries; **Muzli** dashboard roundups.

---

## 5. Sources
- [SetProduct Orion](https://www.setproduct.com/templates/orion) · [dataviz index](https://www.setproduct.com/dataviz) · [Charts kit](https://www.setproduct.com/templates/charts) · [Hyper Charts](https://www.setproduct.com/templates/hyper-charts) · [Material Desktop](https://www.setproduct.com/templates/material-desktop) — *all 403 via proxy; reconstructed from search.*
- [Orion Dribbble shots](https://dribbble.com/setproduct) (donut, dataviz widgets, dark theme) — *403; palette hex via search snippets.*
- [Refactoring UI](https://refactoringui.com/) · [skill rules file (GitHub raw, fetched OK)](https://github.com/ZLStas/skills/blob/main/skills/refactoring-ui/SKILL.md)
- [Tremor](https://www.tremor.so/) · [bar chart docs](https://npm.tremor.so/docs/visualizations/bar-chart)
- [Untitled UI](https://www.untitledui.com/)
- [Vercel design (SeedFlip)](https://seedflip.co/blog/vercel-design-system) · [SetProduct blueprint-grid guide](https://www.setproduct.com/blog/complete-guide-to-blueprint-grid-design) — *403.*
- [Stripe/Linear/Vercel principles (PixelDarts)](https://www.pixeldarts.com/en/post/four-design-principles-behind-stripe-linear-and-vercel) · [Mantlr](https://mantlr.com/blog/stripe-linear-vercel-premium-ui) — *403.*
- [Atlassian dataviz colors](https://www.atlassian.com/data/charts/how-to-choose-colors-data-visualization) · [Datylon](https://www.datylon.com/blog/a-guide-to-data-visualization-color-palette) · [Okabe-Ito / accessible sequences (arXiv)](https://arxiv.org/pdf/2107.02270)
- [CSS conic-gradient donut (CSS-Tricks)](https://css-tricks.com/using-conic-gradients-css-variables-create-doughnut-chart-output-range-input/) · [Josh Comeau shadows](https://www.joshwcomeau.com/css/designing-shadows/) — *403.*
- [Elevation patterns (designsystems.surf)](https://designsystems.surf/articles/depth-with-purpose-how-elevation-adds-realism-and-hierarchy) — *403.*
- [Muzli infographic feed](https://search.muz.li/search/infographic) · [Muzli infographics collection](https://muz.li/inspiration/infographics/) · [Muzli dashboards 2026](https://muz.li/blog/best-dashboard-design-examples-inspirations-for-2026/) — *403 direct; reconstructed from search.*
- Named Orion shots [23040575](https://dribbble.com/shots/23040575), [14821140](https://dribbble.com/shots/14821140), [14466982](https://dribbble.com/shots/14466982) — *403.*
- [2026 infographic trends (Venngage)](https://venngage.com/blog/infographic-design-trends/)
