# Jan Schwochow — Craft Study for Code-Rendered Supply-Chain Infographics

**Subject:** Jan Schwochow (Stern → KircherBurkhardt → Golden Section Graphics 2007 → Infographics Group 2017 → Schwochow Visual Stories). One of the ~10 named "masters of visual journalism." Books: *Understanding the World — The Atlas of Infographics* (TASCHEN), *The World Explained in 264 Infographics* (Prestel), *Understanding Germany*, *Understanding the Wall*, *The Global Economy as You've Never Seen It* (99 infographics, Axiom Gold 2019). 28× Malofiej, German/European Design Awards, ADC.

**Access note (honest):** Schwochow's own site (`schwochow.de`, `schwochow.shop`), the editorial review blogs (halcyonrealms, thetangential, newspaperdesign interview), and IBM's isometric guide all returned **HTTP 403** through the agent proxy (confirmed via proxy status — gateway policy denials). I could not view portfolio images directly. This report reconstructs his craft from search-result summaries (incl. a substantive 2025 newspaperdesign.org interview summary and the TASCHEN/Prestel descriptions) **plus** established knowledge of his widely-published work, and grounds the reproducibility ratings in the project's actual `renderer/` conventions (which already draw SVG isometric scenes). Treat image-level specifics as informed reconstruction, not first-hand observation.

---

## 1. His signature formats (and HTML/CSS/SVG reproducibility)

Schwochow's house style is the **"knowledge graphic"**: a single large panel that *teaches one system* by turning data into an illustrated narrative the eye can walk through. Recurring formats:

| Format | What it is | Repro in HTML/CSS/SVG | Rating |
|---|---|---|---|
| **Large-canvas editorial knowledge graphic** | One topic, one panel, dense but zoned; fold-out spreads in the books | Native to our card model — zoning + focal hero + supporting panels | **Easy** |
| **Isometric cutaway** (building/port/machine sliced open) | 30° scene with the front wall removed so you see inside | SVG paths on an iso grid; our renderer already does this (`sc101-planning-fence-iso`, `sc101-quote-iso-towers`) | **Medium** |
| **Exploded view** | Components pulled apart along an axis, gaps annotated | Iso shapes offset along the 2:1 axis + dashed leader lines | **Medium** |
| **"Anatomy of / how it works" explainer** | Labeled object/system with numbered keys | Hero illustration + numbered callout key | **Easy–Medium** |
| **Annotated 3D scene** (people/objects at work) | Populated iso vignette with leader-line labels | Iso scene + characters as SVG (characters are the hard part) | **Medium–Hard** |
| **Process panorama** | Left-to-right journey (e.g. supply chain of jeans, aircraft-parts origin map) | Horizontal flow band with staged scenes + connectors | **Easy–Medium** |
| **Metaphor-as-data** | An economy drawn as a machine, a network as a city | Conceptual — code-render is fine; the *idea* is the work | **Medium** (design-led) |
| **Hand-built editorial maps** (freight routes, aircraft-part origins) | Stylized map + flow lines + insets | SVG map = **Hard** to author by hand; simplified schematic map = Medium | **Hard** |

**Takeaway:** the most on-brand, highest-ROI formats for us are the **isometric cutaway**, the **"anatomy of / how it works" explainer**, and the **process panorama** — all three are Easy–Medium in our existing pipeline.

---

## 2. Isometric craft (how the scenes are built, lit, annotated)

**Construction**
- True isometric = **30° axes**, a **2:1 (26.57°) "video-game" iso** for tile work; the equal-measure projection means no perspective convergence, so every tile is reusable and the scene reads as a measurable diagram, not a photo.
- Two reliable code routes:
  1. **SVG path math** (what `renderer/` already uses): place points on an iso lattice, draw each face as a `<path>`. Most control, cleanest annotation anchoring. Preferred.
  2. **CSS 3D transform**: rotate parent `45deg`, `skewY(-30deg)`, scale Y; or the single matrix `matrix(0.866, 0.5, -0.866, 0.5, 0, 0)`. Faster for box stacks, harder to annotate precisely. Use `transform-style:preserve-3d`.
- **Cutaway reveal:** draw the full volume, then omit/clip the **front-facing wall** so the interior reads. In SVG, just don't draw that face (or use a lower-opacity "ghost" of it). This is the single move that turns a box into a Schwochow cutaway.

**Lighting (the "knowledge-graphic finish")**
- Flat-but-dimensional: each cube gets **three tones of one hue** — top lightest, left mid, right darkest (a fixed top-left light). Consistent face-shading across the whole scene is what makes a busy iso panel feel coherent rather than noisy.
- Soft, single contact shadow under the volume (one `radial-gradient` ellipse), not per-object drop shadows.

**Annotation**
- **Numbered callouts (1,2,3…)** sit *in* the scene as small circular badges; a matching **numbered key** lives in a margin strip — this lets the illustration stay clean while the explanation lives outside it.
- **Leader lines:** thin (1–1.5px), often with a small dot at the anchor and a 90°/45° elbow, landing on a label chip. Keep all elbows at the same angles for rhythm.

**Legibility under density**
- One scene, one light direction, one line weight, a tightly limited palette, and labels pulled to the *edges* on leader lines (not crammed inside). Density comes from *quantity of small consistent parts*, never from many styles.

---

## 3. Composition & information density

This is Schwochow's real superpower: a huge amount of information in one panel without clutter.

- **Zoning** — the panel is divided into clear regions (hero scene, key/legend, supporting stat panels, caption chips). Each region has one job.
- **Focal hierarchy** — one dominant hero element (the cutaway/scene) wins ~50–60% of the canvas; everything else is visibly subordinate (smaller, lighter, bordered panels).
- **Guided reading path** — he composes a deliberate route (title → hero → numbered key → detail insets → footer). Numbering and left-to-right/foreground-to-background flow do the wayfinding. From the interview: he sees himself as an **editor and storyteller** who *selects, condenses, and accentuates* — the graphic reveals the story angle hidden in the data.
- **Insets / zoom details** — a small framed "detail" pulled out of the main scene at larger scale (the magnifier move). Cheap to reproduce: a bordered rounded card showing one zoomed component.
- **Process before pixels** — his stated method: *understand the data first, sketch in pencil as a team, decide the visualization form, then build.* The concept (what metaphor/cutaway carries the idea) is decided before any rendering. Steal this: pick the format in `layout-select` deliberately, don't default.

---

## 4. Color & line style (the editorial discipline)

- **Restrained editorial palette:** a small set of brand/topic hues used *systematically* (category = color), with tints/shades for the iso face-shading. Never rainbow-by-default; color carries meaning.
- **Line weight discipline:** consistent hairline strokes for structure, slightly heavier for the hero silhouette. Uniform line weight across a panel is a hallmark — it's what makes 200 small elements read as one system.
- **Flat fills + 3-tone shading** rather than gradients-everywhere; gradients reserved for light/depth, not decoration.
- **Labeling conventions:** small-caps / uppercase tracked labels for kickers and key headers; numerals emphasized (large, bold) because the number is usually the payload; muted secondary text so the data pops.
- **Finish:** clean, "scientific but warm" — accurate, vetted, never gimmicky. He insists on scientifically sound data ("visual truth in a noisy world").

This maps almost 1:1 onto our kit: azure/eco/ink as the systematic category palette, Poppins (with tracked uppercase kickers + bold numerals), flat luminous-on-white, hairline `--line` strokes — the renderer already encodes this discipline.

---

## 5. Annotation system (the scaffolding)

The reusable "knowledge-graphic" scaffolding to standardize:

1. **Numbered key** — circular numbered badges in-scene + a matching numbered list in a side/footer strip.
2. **Leader lines** — hairline + anchor dot + consistent elbow angle → label chip; labels live at the canvas edges.
3. **Mini-legend** — a compact swatch+meaning row (color = category), placed once, near the hero.
4. **Callout boxes** — small bordered/rounded cards for "detail," "definition," or "so what," filling whitespace with *teaching* (the project's existing `sc101-quote-iso-towers` already does exactly this — side callouts that "fill whitespace with teaching").
5. **Caption chips** — small white rounded labels dropped onto the scene to name zones ("NOW / LOCKED", "FUTURE / FLEXIBLE") — already in `sc101-planning-fence-iso`.

---

## 6. Reproducible takeaways — moves to steal for a 1080×1350 card

Brand frame: azure `#2798FB` + eco-green `#38E6A6` + ink `#15315C`, Poppins, luminous-on-white.

**Worked example — "Anatomy of a Port" / isometric warehouse-port cutaway:**
1. **Pick a teachable system, not a chart.** Choose a topic that has *parts* (a warehouse, a port, a contract, a shipment). The format is "cut it open and label it."
2. **One hero, 55% of canvas.** Build the iso scene in SVG at 30° (or 2:1), front wall omitted for the cutaway. Reuse one tile/box "kit" — author 2–3 box prototypes, then duplicate.
3. **3-tone face shading, one light (top-left).** Top = lightest azure/eco tint, left = mid, right = deep. Apply to *every* solid for coherence.
4. **Numbered key (1–6).** Circular badges in-scene; matching numbered key in a right-hand or footer strip. Keep the scene clean; explanations live in the strip.
5. **Leader lines, hairline + dot + fixed elbow angle**, labels at edges. Same angle for all = rhythm.
6. **Category = color.** Map each zone (inbound / storage / outbound / customs) to one brand hue; reuse the swatch in a one-line mini-legend.
7. **2–3 teaching callouts** in the whitespace (definition / "so what" / one stat), bordered rounded cards.
8. **One inset zoom** of the most important component at 1.5–2× — the magnifier move.
9. **Numbers are the payload:** set key figures large/bold in ink; mute the supporting prose.
10. **Guided path:** kicker → hero scene → numbered key → inset → footer (Logo 2 left + signature right). Compose so the eye is *led*, not left to wander.
11. **Single contact shadow**, flat fills, hairline `--line` strokes — no per-object drop shadows, no decorative gradients.

**Two more ready concepts**
- **"How a supply contract works" (annotated scene):** the contract drawn as a building/machine; clauses = labeled rooms/parts; risk clauses highlighted in coral; numbered key explains each. (Project already has `sc101-supply-contract-clauses` + `contract-risk-review` to extend with iso treatment.)
- **Process panorama — "The journey of [a product]":** horizontal left→right band, 4–6 staged mini-scenes (source → factory → port → DC → store), connectors between, one stat under each stage. Foreground-to-distance or near-to-far depth optional.

**Reproducibility verdict for our pipeline:** isometric cutaway = **Medium** (SVG path route, already in repo); anatomy/how-it-works explainer = **Easy–Medium**; process panorama = **Easy–Medium**; populated annotated scene with characters = **Hard** (the figures, not the layout). The composition/annotation discipline (zoning, numbered key, leader lines, category-color, one light) is **Easy** and is the highest-leverage thing to standardize — it's what makes a panel look like Schwochow regardless of the specific illustration.

---

## Sources (search-summary level; many full pages 403'd via proxy)
- schwochow.de/about (403 on fetch) — bio, process, "editor and storyteller" framing
- newspaperdesign.org — "Jan Schwochow on Reimagining INGRAPHICS: Visual Truth in a Noisy World" (2025) — process: understand data → pencil sketch as team → choose form → build
- TASCHEN — *Understanding the World. The Atlas of Infographics* (5 chapters, 280+ graphics, 7 fold-outs)
- Prestel — *The World Explained in 264 Infographics*
- The Experiment / Amazon — *The Global Economy as You've Never Seen It* (99 infographics; jeans supply chain, aircraft-part origins, freight maps)
- schwochow.shop — *Understanding the Wall* (3D infographics, timelines, cutaways of watchtowers/border fortifications)
- Golden Section Graphics blog / *IN GRAPHICS* magazine; Malofiej/ADC award record
- CSS/SVG iso technique: freefrontend, jointjs, tutsplus, MDN skew/matrix; IBM Design Language isometric guide (403 on fetch)
- Repo grounding: `infographic-setup/renderer/templates/sc101-planning-fence-iso.html`, `sc101-quote-iso-towers.html`, `ai05-supplier-scorecard-3d.html`
