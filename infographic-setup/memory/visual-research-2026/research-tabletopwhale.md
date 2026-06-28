# Eleanor Lutz / Tabletop Whale — Craft Techniques for Code-Rendered Infographics

**Goal:** Extract concrete, reproducible techniques a supply-chain LinkedIn brand can adopt for HTML/CSS/SVG infographic cards (1080×1350). Brand palette to adapt into: azure `#2798FB` + eco-green `#38E6A6` + ink `#15315C` on white.

## Access notes (honesty about sources)
- `tabletopwhale.com`, `eleanorlutz.com`, `mymodernmet.com`, GitHub API, and the `github.com/eleanorlutz` HTML pages all **403'd or 404'd** through the proxy.
- **What I got directly (highest value):** the raw README "tutorials" she writes for each Atlas of Space project — these ARE her documented, step-by-step craft method. Successfully fetched: `topography_atlas_of_space`, `asteroids_atlas_of_space`, `western_constellations_atlas_of_space`. These are her own words on process.
- Reconstructed the rest from WebSearch snippets (Storybench interview, Live Science, ScienceAlert, Dribbble blog, kottke) plus prior knowledge of her well-known pieces.
- Repo names that 404'd (`who_is_in_space...`, `solarsystem...`) are guesses; her real repos are the three above plus `worldstars_atlas_of_space`, `jupiter_atlas_of_space`, `mercury_atlas_of_space`.

---

## 1. Her signature compositions

| Composition | What it is | Pure HTML/CSS/SVG without d3? | Difficulty |
|---|---|---|---|
| **Radial / polar orbit map** | Objects plotted on a circle, distance = radius (often **log-scaled** because density concentrates near center) | SVG: place items with `cx,cy = center + r·cos(θ), r·sin(θ)`. No d3 needed — trig in a templating loop. | **Medium** |
| **Concentric rings as label anchors** | She draws ~200 blended circles; labels ride specific rings via "type on a path" | SVG `<circle>` rings + `<textPath href="#ring">`. This is the single most "Lutz" move and it's native SVG. | **Medium** |
| **Topographic / contour styling** | Stacked filled contour bands, each a flat color step, hillshade underneath | Hard to do from real elevation data, but the *look* (nested offset blobs, stepped color bands) fakes well with layered SVG paths or radial-gradient color steps. | **Hard** (real) / **Easy** (faux) |
| **Taxonomy / radial phylogeny wheel** | Categories fanned around a circle, leaf items on the rim | SVG sectors via `path` arcs + rotated label groups. | **Medium** |
| **Decorative bordered "plate"** | Map sits inside an ornamental frame with corner scrollwork + a title cartouche | Pure CSS border + corner SVG ornaments + a header/footer band. | **Easy** |
| **Dense-but-legible labeling** | Leader lines from a point to a label parked on a ring/margin | SVG line + text; align labels to a shared baseline/ring. | **Medium** |
| **Inset corner maps / zoom callouts** | Small secondary panels at different zoom in the corners | CSS grid sub-panels. | **Easy** |

**Key structural trick (reproducible verbatim):** she uses *matplotlib gridspec so each subplot occupies exact pixel locations inside a decorative border.* The HTML/CSS analog: **CSS Grid with named areas** — the ornamental frame is one layer, the data plot is a grid cell sized to exact pixels inside it. Frame and data are separate layers that align by coordinate, not by flow.

---

## 2. Color & palette craft (her hallmark)

**How she builds palettes:**
- Designed **14 different color schemes** up front, then **collapsed to ONE shared palette of ~70 colors** used across the *entire series* — cohesion over per-piece novelty. (Originally wanted a unique palette per planet; rejected it as incoherent.)
- Tests every candidate palette **three ways**: as **discrete blocks**, as **pieces of a complex pattern**, and as a **continuous gradient**. A color only ships if it survives all three uses.
- Stores colors as a **CSV/config file** (`colors.csv` maps each object type → hex) so she can swap schemes without touching code. *Decouple palette from layout.*
- **Dark backgrounds + jewel tones**: stars/objects get **exaggerated** color separation between classes so they pop on near-black; saturation is pushed beyond physically-accurate for legibility.
- Vintage-scientific richness comes from **muted, slightly-desaturated mid-tones with a few saturated accents**, not a rainbow — think aged-paper neutrals + 2–3 jewel accents.

**Adapting to the brand (azure / eco-green / ink on white):**
- Build a **frozen ~12–16 swatch palette** as a JSON/CSS-vars file = your `colors.csv`. Brand-true, reused every card → instant series cohesion (her #1 lesson).
- Derive a **harmonious ramp** between the three brand hues rather than using only the 3 flats: e.g. ink→azure→eco-green as a sequential scale for "good/bad/neutral" data, plus 4–5 tints of each at fixed lightness steps.
- Get "vintage richness" on white without going dark: **knock saturation down ~10–15% and warm the neutrals** (off-white `#F7F4EC` paper instead of pure white; ink-tinted greys for gridlines, never pure black/grey). Reserve full-saturation azure/green for the 1–2 hero data marks only ("earned" color).
- Apply her gradient-tail trick: on lines/orbits/flows, fade stroke from **0% → 100% opacity** along its path (in CSS, an SVG `linearGradient` on the stroke). Gives motion/direction cheaply.

---

## 3. Typography & labeling

- **Two fonts only, every piece:** a display face (she uses *Moon* / *RedFlower*) + a workhorse. Consistency = brand. Pick one azure-era display + one neutral text face and never deviate.
- **Type on a path:** labels curve to follow the geometry (orbits, contour lines, rings). In SVG = `<textPath>`. This single move is most of the "scientific plate" feeling.
- **Greek/Unicode glyphs as data marks:** she labels with `♮ ✜ ◈`, Greek letters, superscripts to encode categories compactly. Supply-chain analog: small consistent glyph set for node types (factory, port, warehouse).
- **Legibility stack for text over busy/dark art:** every label gets **two glow layers (4px + 10px blur, 20% opacity)** PLUS a dark drop shadow beneath. CSS analog: layered `text-shadow` (one tight dark, one wide light halo) so labels read over any texture.
- **Label placement workflow:** plot anchor scatter points + reference baselines programmatically, then nudge labels to a shared baseline/ring. Lesson: **labels snap to a structure (a ring, a margin column, a baseline grid)** — never floated freely. That's what makes dense labeling look engineered, not messy.
- **Leader lines** run from the data point to a label parked on the rim/margin — keeps the dense center clean.

---

## 4. The "scientific plate / editorial poster" aesthetic — specific moves

1. **Ornamental frame around the whole plate** — she hand-paints scrollwork (William Morris / Mucha / NYPL digital archive references) to wrap the rounded map. Reproducible as a CSS border + SVG corner ornaments + a thin inner keyline.
2. **Title cartouche + footer credit band** — every plate has a labeled title block and a "data source" line. Treat the source citation as a *design element*, not fine print. (Supply-chain win: it signals rigor.)
3. **Inset legend as a mini-composition** — the legend isn't a list; it's a small designed object (often a ring or swatch matrix), echoing the main layout.
4. **Gridlines as decoration + function** — perpendicular/polar gridlines that are both readable coordinates AND texture; kept thin and low-contrast (ink-tinted grey).
5. **Minimum-thickness rule** — in her planet cores, "every layer has a minimum visible thickness" so nothing vanishes. Layout lesson: enforce a min size on every data band/segment so the composition stays legible even when data says "tiny."
6. **Blur the busy, sharpen the signal** — background imagery (Stellarium surfaces) intentionally blurred so labels/data stay the focus. Hierarchy via blur, not just color.
7. **Restrained ornament density** — she *tried* 18 repeated border patterns, found them "too cluttered," cut to one. The plate look = ornament that frames, never invades the data.

---

## 5. Data-as-art balance (rigor AND beauty)

- **Every number traces to a public source** (NASA, USGS, IAU, HYG catalog) and she ships the open data + code. Beauty is layered *on top of* real data, never instead of it. Maps directly to your research-brief-first pipeline.
- **Build order = layout → color → illustration/animation** (her stated process). Decoration is the *last* layer, applied to a correct structure.
- **Decoration is earned where it encodes**: gradient tails encode direction of motion; glyph choice encodes object class; ring position encodes distance. Chartjunk is rejected (the 18-pattern border cut). Test: *if the ornament also carries information or hierarchy, keep it; if it's pure noise, cut it.*
- **Log scales when density demands** — orbit map centers at 27,000,000 km and scales logarithmically because objects cluster near the sun. For supply-chain (lead times, volumes spanning orders of magnitude) this is the same fix: log-radius or log-size so the dense end stays readable.

---

## 6. Reproducible takeaways — steal list for a 1080×1350 code-rendered card

1. **Frozen brand palette as a config file** (CSS vars / JSON, ~14 swatches). Reuse on every card = series cohesion. *Her single biggest lesson.*
2. **Validate each color in 3 modes** (block / pattern / gradient) before adding it.
3. **Warm off-white "paper" (`#F7F4EC`), ink-tinted greys** for grid/labels, full-saturation azure/green reserved for hero marks only.
4. **Radial layout recipe (no d3):** center `(cx,cy)`; for each item `r = scale(value)` (log if spread is wide); `x = cx + r·cos(θ)`, `y = cy + r·sin(θ)`. Loop in the template, emit SVG `<circle>`/`<g>`.
5. **Concentric-ring legend / labels:** draw N `<circle>` rings; attach labels via `<textPath href="#ringN">`; this is the signature "Lutz" move and it's native SVG.
6. **Leader-line labeling:** anchor labels to a margin column or a ring, connect with thin SVG leader lines; never float labels.
7. **Label legibility stack:** every on-art label gets `text-shadow` = one tight dark + one wide light halo (her 4px/10px glow + dark shadow).
8. **Type-on-path** for any curved/orbital/contour label (`<textPath>`).
9. **Two-font rule**, locked for the whole series; source-citation line treated as a design element.
10. **Ornamental frame layer** separate from the data layer, aligned via **CSS Grid named areas** (her gridspec-in-exact-pixels trick). Corner SVG ornaments + inner keyline + title cartouche + footer credit band = "museum plate."
11. **Faux topo texture in CSS:** stacked `radial-gradient` color *steps* (hard stops, not smooth) or nested offset SVG paths to mimic contour bands cheaply.
12. **Gradient-along-stroke** (SVG `linearGradient`, 0%→100% opacity) to show flow direction on routes/arrows.
13. **Minimum-thickness / minimum-size rule** on every segment so tiny data still reads.
14. **Hierarchy by blur:** soften background art so labels/data dominate.
15. **Log scale when values span orders of magnitude** (lead times, volumes) so the dense end stays legible.
16. **Decoration must encode or frame** — if an ornament carries no info and frames nothing, cut it (her 18-border lesson).

## Source URLs
- https://github.com/eleanorlutz/topography_atlas_of_space (README = primary tutorial, fetched)
- https://github.com/eleanorlutz/asteroids_atlas_of_space (README, fetched)
- https://github.com/eleanorlutz/western_constellations_atlas_of_space (README, fetched)
- https://tabletopwhale.com/2019/06/03/an-atlas-of-space.html (403, reconstructed from search)
- https://www.storybench.org/meet-your-maker-eleanor-lutz-on-drawing-science/ (interview, via search)
- https://www.livescience.com/65761-eleanor-lutz-solar-system-map.html
- https://dribbble.com/stories/2019/06/11/when-science-meets-design-data-visualization-for-outer-space
- https://eleanorlutz.com/ (portfolio, 403)
