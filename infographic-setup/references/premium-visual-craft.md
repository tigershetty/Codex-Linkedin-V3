# Premium Visual Craft — the "how to make it look world-class" layer
**Created**: 2026-06-28 · **Status**: Active. Read this alongside `layout-frameworks-intelligence.md` before building any render.
**Companion files**: `layout-frameworks-intelligence.md` (picks *which* layout) · `renderer/README.md` (the build kit) · `memory/visual-benchmarks/top100-visual-dna.md` (the 100-image analysis).

> **What this file is.** `layout-frameworks-intelligence.md` answers *which framework argues the idea*. This file answers the other half — **how to render any framework so it looks like Visual Capitalist / The Economist / a SetProduct dashboard, not a generic slide.** It is distilled from a 2026 research sweep across SetProduct **Orion**, Visual Capitalist + Voronoi, The Economist + FT (Burn-Murdoch), McKinsey/BCG/Bain/Gartner exhibit craft, Eric Partaker, and Visualize Value. The single biggest quality lever we have is no longer *which* chart — it's *this craft layer applied consistently*.

---

## 0. The five rules that do 80% of the work

1. **The title is a sentence, not a label.** State the takeaway with a number — "Liability is fought hardest and almost never breaks", not "Contract clauses". (Economist/FT/McKinsey all agree; eye-tracking says readers hit the title first.)
2. **One card, one message.** Everything else is support or annotation. Two messages → two variants, never one crowded card.
3. **One accent + grey everything else (ghosting).** Saturation is a spotlight — spend it on the *one* element that proves the point; mute the rest to grey/tint. If three things are highlighted, nothing is.
4. **Annotate on the data, not in a legend.** Direct end-of-line labels, value-on-bar, leader-lined callouts. A legend is a last resort. Well-annotated beats minimalist for both engagement and recall (Burn-Murdoch).
5. **Always carry a quiet source line.** Small, low-contrast, bottom of card: `Source: …  ·  Shetty's Desk`. It signals rigor and doubles as a brand watermark (the Visual Capitalist "source band").

If a render violates one of these five, fix that before anything else.

---

## 1. The Orion design tokens (drop into every template `:root`)

Reconstructed from the SetProduct **Orion** data-viz system and Refactoring UI, mapped onto the Shetty's Desk brand (azure `#2798FB` + eco-green `#38E6A6` + ink `#15315C`, Poppins, luminous-on-white). **Use the light/luminous theme** — Orion's dark electric-blue theme is off-brand.

```css
:root{
  /* brand */
  --ink:#15315C; --azure:#2798FB; --green:#38E6A6; --green-deep:#0E9A6E; --coral:#E27199; --coral-deep:#cf5c84;
  /* neutrals — slightly tinted, never pure grey/black */
  --canvas:#F6F9FE; --card:#FFFFFF;
  --ink-70:rgba(21,49,92,.70); --ink-55:rgba(21,49,92,.55); --ink-40:rgba(21,49,92,.40);
  --hair:rgba(21,49,92,.08);                 /* "invisible" hairline border */
  --grey:#9DB1CC;                            /* the ghost colour for de-emphasised data */
  --grey-fill:#E7EEF7;                       /* ghost fill / track */
  /* tints for chips */
  --azure-12:rgba(39,152,251,.12); --green-16:rgba(56,230,166,.16); --coral-14:rgba(226,113,153,.14);
  /* radii — concentric, never mixed at random */
  --r-pill:999px; --r-card:20px; --r-inner:12px; --r-tile:10px;
  /* elevation — tinted toward ink (never black), two layers + a white top lip */
  --lift:0 1px 2px rgba(21,49,92,.06), 0 12px 28px rgba(21,49,92,.10), inset 0 1px 0 rgba(255,255,255,.7);
  --lift-sm:0 1px 2px rgba(21,49,92,.05), 0 6px 16px rgba(21,49,92,.08);
  --font:"Poppins",system-ui,sans-serif;
}
*{ font-variant-numeric: tabular-nums; }   /* every changing number lines up */
```

**Spacing** — a strict 4/8 grid: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64`. Wide gaps *between* groups, tight gaps *within* a group. Page margin 40–64px; card padding 20–28px.

**Type scale** — `12 · 14 · 16 · 18 · 20 · 24 · 30 · 36 · 48 · 60 · 72`. Drive hierarchy with **weight + colour first, size last**. Tighten big headings (`letter-spacing:-0.02em`), widen small uppercase labels (`+0.06em`). Body line-height 1.4–1.5, headings 1.0–1.1.

---

## 2. The Orion stat-card — our new primitive

The single highest-leverage thing to clone. Vertical rhythm, top→bottom:

1. **Eyebrow** — 12px, uppercase, `+0.06em`, weight 600, `--ink-40`; often a small mono icon in a tinted square tile.
2. **Hero number** — 56–84px (bigger than Orion's desktop sizes, for feed legibility), weight 700–800, tabular, `-0.02em`. Unit ("%", "k", "$") smaller and lighter, baseline-aligned.
3. **Delta chip** — full-pill, tinted bg + saturated text: `↑ 30%` green for good, `↓` / coral for bad. `background:var(--green-16); color:var(--green-deep)`.
4. **Micro-context** — "vs last quarter", 12px `--ink-40`.
5. **Micro-chart** — a sparkline / mini-bar anchored to the card's bottom edge, ~28–40px tall, gradient area fading to transparent.

This *tiny-label → huge-number → small-delta → micro-chart* cadence is the premium tell. Use it for any "single number" or KPI moment.

---

## 3. Chart-styling recipes (what makes a chart look modern, in pure CSS/SVG)

| Element | The premium recipe |
|---|---|
| **Bars** | Rounded top caps `border-radius:8px 8px 0 0`; bar ≈ 60–70% of band (generous gap); vertical gradient `linear-gradient(var(--azure),#BFE0FF)`; **highlight one bar full-azure, ghost the rest to `--grey-fill`.** Value label sits *on/above* the bar, not on a Y-axis. |
| **Lines** | 2.5–3px stroke, `stroke-linecap/linejoin:round`, no markers except the endpoint; soft area fill `linear-gradient(rgba(39,152,251,.22),transparent)`; smooth monotone curve, not jagged. Green dot on the "now" endpoint. |
| **Donut** | Thick ring via `conic-gradient`, 2–4px gaps between segments, radial-mask hole, **big centred value + tiny label** in the hole; legend as a 2-col `● label … value` text list, never chart-attached. |
| **Progress / gauge** | Pill track `--azure-12` (radius 999px, 8–12px tall), fill azure→green gradient, optional label-on-bar at the right end; gauge = 270° `conic-gradient`, rounded cap. |
| **Gridlines** | Horizontal hairlines only, `--hair`, via `repeating-linear-gradient`. **No vertical lines, no axis spine, no chart border.** Axis labels 11–12px `--ink-40`. |
| **Harvey balls** | `conic-gradient(<colour> 0 X%, var(--grey-fill) X% 100%)` — five fills (0/¼/½/¾/full) for a scorecard. |
| **Dumbbell** | Thin grey connector + two coloured dots per row; **sort by gap size**, annotate the widest gap. The connector *is* the story. |
| **Slope / bump** | Two axes, one line per item, direct labels both ends; **colour only the 1–2 lines the story is about, ghost the rest.** Round caps; bezier with control points at ~0.42× the span. |
| **Iceberg / hidden-mass** | Small tip above a waterline, large mass below; colour shift at the line; label the hidden items. |

**Colour for data series:** one accent does 80%. Categorical sets: hues ≥30° apart, equal saturation; cap at ~6; never rely on colour alone (add label/position). **Eco-green is semantic** (positive / eco / "the win") — never a random series colour. Coral is cost/caution only.

---

## 4. Elevation, radii, borders — the "expensive" details

- **Two-layer tinted shadow** (`--lift`), never pure black; add the white inner-top lip so white cards lift off the luminous canvas. On busy areas use `--lift-sm`.
- **Hairline borders** (`1px solid var(--hair)`) instead of heavy strokes — structure without weight (Linear/Vercel/Untitled UI all do this).
- **Concentric radii** — outer card 20 → inner well 12 → chips full-pill → icon tile 10. Outer radius always > inner by ~4–8px so corners nest cleanly. Never mix arbitrary radii.
- **Tinted neutrals** — no pure `#000`/`#fff` for text; use `--ink` / `--ink-55`. Slightly tinted greys read richer than flat grey.
- **Matched icon stroke** — ~1.75px to sit with Poppins weight; one icon style throughout a card.
- **Optional blueprint grid** — a faint dot grid behind content (`radial-gradient(var(--hair) 1px, transparent 1px) 24px`) reads "engineered", on-brand for supply chain. Use sparingly.
- **Whitespace is the separator** — reach for space before a divider; reach for a hairline divider before a box.

---

## 5. House-style rules (data journalism — Economist / FT / Visual Capitalist)

- **Title = a full-sentence claim with a number.** Subtitle holds the qualifiers (unit, scope, period). Metadata never in the title.
- **The Z-read** — readers go title → subtitle → data → source. Put the message in text, the proof in the visual.
- **One accent + greys; ghost the supporting cast.** (Economist Red; FT colours only the entities the story is about.)
- **Direct labels over legends; annotation layered on the data** — event arrows, shaded bands, end-of-line labels.
- **The source band** — a quiet bottom line/band with `Source: …` + the Shetty's Desk mark. Mandatory, every card. Doubles as the brand watermark and the footrule footer we already use.
- **Big-number + band framing (Visual Capitalist)** — an oversized hero figure top-left, the visual centre, the source band bottom. Instantly recognisable and screenshot-friendly.
- **Mobile-thumbnail legibility** — big type, thick lines, few elements; the headline + hero must read at feed-thumbnail size; dense detail is "save-to-zoom".
- **Honour complexity, cut chart-junk** — strip gridlines/3D/redundant ticks; keep *meaningful* annotation (Scientific American).

---

## 6. Consulting slide-craft (McKinsey / BCG / Bain / Gartner)

- **Action title** (the #1 rule) — lead with the subject, active verb, a number, one claim, one line. Storyline test: the titles across a week's posts should chain into a paragraph.
- **Pyramid Principle** — governing thought (title) → 2–4 MECE key lines → the support under each. Communicate top-down even though you analysed bottom-up.
- **SCQA hook for the caption** — Situation → Complication → (implicit) Question → Answer (= the action title).
- **MECE** — any "3 reasons / 4 types / 5 steps" must have no overlaps and no gaps; aim for 2–4 buckets, >5 usually means not-yet-MECE.
- **Pick the chart from the message, not the data** (Zelazny/Abela): *bar* = items ranked; *column* = change over few periods; *line* = many periods; *scatter/bubble* = relationship; *100% stacked / waterfall* = composition. Avoid pies (angles read poorly) — a 100% stacked bar beats a pie.
- **The "so-what" callout** — one explicit attached note spelling out the implication the chart alone doesn't state.
- **Trademark care** — "Magic Quadrant", "Hype Cycle", "Stage-Gate", "RAPID" are marks: reproduce the *idea-shape* with our own labels and styling, never the trade dress or an implied endorsement.

---

## 7. LinkedIn / save-psychology (what actually gets kept)

- **People save a reusable thinking tool, not a pretty fact.** Matrices, checklists, canvases, decision trees, cheat-sheets, "anatomy of" — formats the viewer will *operate* later — out-save single stat cards. Design for "I'll use this," not "nice, true."
- **Three save triggers:** reference value ("future-me needs this") · self-assessment ("I see myself using it") · identity ("re-sharing this makes me look sharp"). Hit at least one.
- **Visualize Value discipline** — one idea per visual, reduced to shapes; extreme restraint; a system so consistent it's recognisable at a glance.
- **Eric Partaker pattern** — big numbered hook title, uniform rounded modules (equal visual weight per row), monochrome + one accent, heavy whitespace, footer self-branding, portrait 4:5. Each card is a standalone reference sheet.
- **Format = 4:5 (1080×1350)** mobile-first; one idea + one headline per card; the headline-skim test must pass.

---

## 8. Pre-flight craft QA (run on every render, on top of README §9)

- [ ] **Title is a full-sentence claim with a number** (not a topic label)?
- [ ] **One message**, everything else support/annotation?
- [ ] **One accent; the supporting cast is ghosted** to grey/tint (saturation only on the focal element)?
- [ ] **Eco-green used semantically** (positive/win/eco), not as a random series colour?
- [ ] **Direct labels on the data**; no legend the eye must cross-reference?
- [ ] **Quiet source line / footrule + Logo present** (the brand band)?
- [ ] **Stat / hero number** uses the Orion cadence (tiny eyebrow → huge tabular number → delta chip) where there's a headline figure?
- [ ] **Tinted two-layer shadow + hairline border + concentric radii**; no pure black/white; no heavy strokes?
- [ ] **Tabular figures** on every number; numbers right-aligned in any table/column?
- [ ] **Chart styling**: rounded caps, gradient/▮soft fills, horizontal-only hairline gridlines, no axis spine?
- [ ] **Reads at feed-thumbnail size** (title + hero legible); dense detail is intentional save-to-zoom?
- [ ] **It's a reusable tool** (matrix/ladder/checklist/anatomy) where the topic allows — a save-worthy structure, not just a fact?

---

## 9. Sources (2026 research sweep)
- **Design systems / Orion:** SetProduct Orion + dataviz kits; Refactoring UI (Wathan/Schoger); Tremor; Untitled UI; Linear / Vercel / Stripe; Muzli infographic feed. *(Most primary pages 403-blocked to automated fetch; reconstructed from search + Refactoring UI rules pulled from GitHub.)*
- **Data journalism:** Visual Capitalist + Voronoi; The Economist visual style; FT / John Burn-Murdoch annotation research; NYT Upshot (Amanda Cox); Our World in Data; Reuters Graphics; National Geographic; Scientific American (Jen Christiansen).
- **Consulting:** McKinsey (Three Horizons, driver trees, Pyramid Principle/Minto), BCG (growth-share, experience curve, Mekko), Bain (RAPID), Gartner (Magic Quadrant, Hype Cycle), Booz Allen (Harvey balls), Porter (value chain), Zelazny *Say It With Charts*, Abela chart chooser.
- **LinkedIn / save psychology:** Eric Partaker; Jack Butcher / Visualize Value; Tufte data-ink ratio; NN/g aesthetic-minimalist heuristic; 2026 LinkedIn carousel best-practice guides.
- Full per-report detail + verification flags: `memory/visual-research-2026/` (`research-datajournalism.md`, `research-consulting.md`, `research-designsystems.md`). The LinkedIn / save-psychology + Eric Partaker findings are synthesised into §7 above.
- **Honesty flag:** most primary pages (SetProduct, Dribbble, Muzli, Visual Capitalist, FT, Gartner, consulting PDFs) were 403-blocked to automated fetch; reports were reconstructed from search + the reachable sources (Refactoring UI on GitHub, the FT Visual Vocabulary repo). Hard numbers are flagged by reliability in each report; treat reconstructed design specs as indicative.
