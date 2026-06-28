# Craft Research: Shirley Wu & Nicholas Felton

**Goal:** Extract reproducible craft for code-rendered (HTML/CSS/SVG) LinkedIn infographics.
**Brand constraints:** azure `#2798FB` + eco-green `#38E6A6` + ink `#15315C`, Poppins, luminous-on-white, 1080×1350.

> **Access note (be honest):** The agent proxy returned **HTTP 403 on every WebFetch** — feltron.com, datasketch.es, Wikipedia, Medium, informationisbeautifulawards, thewhyaxis all blocked. This report is reconstructed from **WebSearch result snippets + domain knowledge** of both designers' published work. Direct primary-source page inspection (e.g. reading the actual FAR09/FAR14 PDFs or the Hamilton DOM) was not possible. Treat layout numbers below as informed reconstruction, not measured.

---

## A) SHIRLEY WU — Creative/Artistic Encoding

Award-winning creative data-viz developer (d3.js, React, Canvas). Known for *Hamilton* (every line, for The Pudding), *Legends* (51 female Nobel laureates as 3D crystals), and *Data Sketches* (24 projects with Nadieh Bremer). Teaches at Frontend Masters; framework rooted in Tamara Munzner's *Visualization Analysis and Design*.

### A1. Creative-encoding approach — data → custom organic/illustrative form

- **Marks + channels is the core vocabulary.** A *mark* is a geometric shape (circle, dot, rect, path) that a data row maps to; *channels* are modifiers on that mark (x/y position, color, size, width, height, curvature, opacity). Wu designs by deliberately **choosing which channels carry which variables**, rather than accepting a chart type's defaults.
- **Encode multiple variables onto ONE custom mark.** *Legends*: each laureate = a crystal, simultaneously encoding 4 variables — **color** = award category, **size** = "influence," **position** = decade, **facets** = Wikipedia data. *Hamilton*: each line = a circle, **color** = character, **position/curvature** = relationship/conversation, with arc shapes "inspired by musical sheets" to carry theme. The lesson: a bespoke glyph lets you pack 3–4 data dimensions into a single readable object.
- **Visual metaphor ties the form back to the dataset.** She picks marks "that tie back into the dataset itself" — musical-sheet arcs for a musical, crystal facets for prismatic achievement. The metaphor is the bridge that makes an unconventional shape feel inevitable, not arbitrary.
- **When unconventional beats a bar chart:** when the *relationships/structure* are the story (who appears with whom, clustering, flow) rather than a single magnitude ranking; when you want an emotional/aesthetic hook to make people stop and read; when one object must hold several variables at once. She frames it as a **spectrum between art and data**, chosen by asking *"What do I want the end-user to experience?"* For a pure magnitude comparison, she'd still use a bar.

### A2. How she keeps unconventional encodings readable

- **Sketch first, on paper/iPad with visual metaphors**, then prototype fast in Observable + Vega-Lite to confirm/deny hypotheses before committing to custom code. Readability is designed at the napkin stage.
- **Scrollytelling / progressive reveal.** Dense pieces don't dump everything at once: scrolling animates and *introduces one encoding at a time*, building the legend in the reader's head before the full tool appears at the end. (Static analog: a vertical card sequence that introduces color, then size, then position one panel at a time.)
- **Legends and annotations are made deliberately, often by hand.** She switches from code to Illustrator/Affinity Designer specifically to craft legends and annotations "that are very hard to do coding-wise." Implication: the legend gets *design attention equal to the chart*, not an afterthought.
- **Disciplined, reusable color system.** She keeps a **personal palette she draws from on every project**, giving her work a consistent feel — and almost always uses a **very white OR very dark background** so color reads as pure signal. White-background + saturated marks is exactly our brand setup.

### A3. Reproducible in static HTML/CSS/SVG (no d3 runtime), single card

| Technique | How to reproduce statically | Effort |
|---|---|---|
| Circle/dot mark with color-by-category | Inline `<circle>` / CSS dots; brand 3-color = up to 3 categories legibly | **Easy** |
| Custom glyph holding 2–3 variables (size + color + position) | Hand-place `<circle r=…>` / SVG `<path>`; vary `r` by value, fill by category, y by group | **Medium** |
| Visual-metaphor mark (icon-as-data, e.g. a truck/box scaled by value) | SVG path or icon, scaled/duplicated; small multiples of the icon | **Medium** |
| Crafted, hand-designed legend + annotations | Build legend as a styled HTML block (flex row of swatch+label); arrows/callouts via absolutely-positioned `<div>`/SVG line | **Easy** |
| Progressive-reveal "scrollytelling" | NOT in one static card — fake it with a **top-to-bottom panel sequence** (intro color → intro size → full view) | **Hard** (true motion); Medium as a panel sequence |
| Force-directed / packed organic layout | Pre-compute positions (offline d3 or by hand) and hard-code cx/cy; can't run the simulation in a static render | **Hard** |

---

## B) NICHOLAS FELTON — Minimalist Data-Report Aesthetic

Pioneer of the personal annual report (Feltron Annual Reports, 2005–2014; 2006–2011 in MoMA's permanent collection). Co-founded Daytum; later on Facebook's Timeline team. The "annual report" finish is his signature.

### B1. Signature minimalist data-report aesthetic

- **Charts stripped to the bone.** "Exercises in minimalism" — **axes, units and gridlines omitted**, line/bar/pie reduced to the bare minimum. The shape and the labeled number carry the meaning; chart furniture is deleted.
- **Aesthetics-forward.** Famously "more about aesthetics than data" — the *visual quality* outranks every data point being individually readable. A page works as a composed object first, a lookup table second.
- **Severely restricted palette.** Typically **~3 colors, often 1 fluorescent accent** (the signature fluorescent/rich red) on a neutral ground; the accent **highlights key points/hero numbers** across the spread. Limiting the palette forces every color to mean something.
- **Immaculate typographic grid.** Tight modular grid; numerals treated as display type. Rotating but always-refined type choices (Garage Gothic, Titling Gothic, Feijoa, Univers Ultra Light Condensed, Input). Numbers are the heroes — big, set in a strong face, given air.
- **Small multiples + dense stat tables + ranked lists.** Repeated tiny charts/icons in a grid for comparison; "most/least" ranked lists; calendars and maps as repeated-unit fields. Density is organized by **repetition on a grid**, which is what makes a packed page feel calm.
- **Premium "annual report" finish.** The final 2014 edition: 16-page book, foil stamping, metallic inks. Even on screen, the cues to steal are generous margins, hairline rules, consistent baseline, and one accent.

### B2. Stat-callout + legend + footnote discipline

- **Precise numbers with units and context.** Quantified-self rigor — exact figures, the unit stated once, comparisons ("X% of…", "most frequent…"). The big number is paired with a small qualifying label.
- **Hero number → small label → optional footnote.** A repeating module: oversized figure, tiny caption beneath, fine-print source/method note at the panel edge. The **footnote/source line is part of the aesthetic**, set in the smallest weight, often greyed — it signals rigor *and* fills the grid quietly.
- **Calm-from-density via system.** A dense page feels premium because (1) one consistent grid, (2) one accent color used sparingly, (3) tons of white space / generous margins, (4) hairline rules instead of boxes, (5) consistent number/label typographic pairing repeated everywhere. The discipline — not decoration — is what reads as "premium."

### B3. Reproducible in static HTML/CSS/SVG, stat-heavy card

| Technique | How to reproduce statically | Effort |
|---|---|---|
| Hero number + tiny label + source footnote module | Flex/grid cell: huge `font-weight:700` numeral, small caption, `font-size:11px` grey source line | **Easy** |
| 3-color discipline, 1 accent for hero stats | Use ink `#15315C` for body, azure for structure, green `#38E6A6` reserved as the single hero accent | **Easy** |
| Small multiples grid (repeated tiny charts/icons) | CSS grid of identical mini-modules; each a tiny bar/donut sized by value | **Easy–Medium** |
| Stat table / ranked "most" list | Semantic `<table>` or grid rows: rank · label · value, hairline `border-bottom` | **Easy** |
| Axis-less stripped charts | SVG bars/lines with no axis, no gridlines; label only endpoints | **Easy** |
| Immaculate modular grid + hairline rules | CSS Grid + `1px` rules at low opacity; strict baseline via consistent line-height | **Medium** (discipline, not difficulty) |
| Calendar/map as repeated-unit field | CSS grid of 365 cells or a region grid, colored by value (heatmap) | **Medium** |
| Print-finish cues (foil/metallic) | Fake with subtle gradient on accent + crisp shadows; true foil not reproducible | **Hard** (cosmetic only) |

---

## STEAL LIST — for the 1080×1350 code-render pipeline

**From Shirley Wu (use on concept/"AI-for-SC" + relationship/flow topics):**
1. **One bespoke glyph, 2–3 variables.** Pick a brand-relevant mark (box, truck, node) and let **size = magnitude, fill = category (max 3 = our 3 colors), position = group**. One object, several dimensions.
2. **Metaphor mark over generic chart** when the story is structure/relationship/flow, not a single ranking. Make the shape echo the topic (a supply *chain* → linked nodes; a *bottleneck* → narrowing path).
3. **Build the legend by hand as a first-class HTML block** — swatch + label flex row, plus 1–2 annotation callouts (absolutely-positioned line + label) pointing the eye to the key mark.
4. **Lock a reusable palette + pure-white ground.** Our azure/green/ink on luminous white is already the "white background so color is signal" setup — reserve **green as the spotlight color**, azure/ink as structure.
5. **Stage the read top-to-bottom** as a fake-scrollytelling panel sequence (intro the encoding, then the full picture) since one feed card can't animate.

**From Nicholas Felton (use on stat-heavy "SC 101" + data cards):**
6. **Hero-number module, repeated:** giant Poppins numeral → tiny label → grey 11px source/footnote. Make it the page's rhythm.
7. **Strip the chart:** no axes, no gridlines, label endpoints only. Let shape + number speak.
8. **3-color discipline, 1 accent.** Ink body, azure structure, **green only on hero stats** — Felton's "limit the palette so color means something."
9. **Small-multiples grid** of identical mini-charts/icons for comparison; **ranked "most/least" lists** with hairline `border-bottom` rules.
10. **Calm-via-system:** one modular CSS grid, hairline rules (not boxes), generous margins, consistent number/label pairing, source line on every stat. Density organized by repetition = premium, not busy.

**Combined default for our cards:** Felton's grid + hero-number + footnote discipline as the **skeleton**; Wu's one bespoke metaphor-glyph + hand-crafted legend as the **focal element**; brand 3-color with **green reserved as the single accent**; pure white ground; Poppins numerals as display type.

---

### Sources
- [Designing Beautiful Data Visualisations: An Interview with Shirley Wu — Medium/Oliver Lindberg](https://medium.com/ux-and-front-end-interviews/designing-beautiful-data-visualisations-an-interview-with-shirley-wu-4c2f6d01c0d1)
- [Shirley Wu — Wikipedia](https://en.wikipedia.org/wiki/Shirley_Wu)
- [Data Sketches](https://www.datasketch.es/)
- [An Interactive Visualization of Every Line in Hamilton — Information is Beautiful Awards](https://www.informationisbeautifulawards.com/showcase/2346-an-interactive-visualization-of-every-line-in-hamilton)
- [Building Custom Data Visualizations — Frontend Masters](https://frontendmasters.com/courses/d3-js-custom-charts/)
- [Drawing Out 'Data Sketches' — Nightingale/Medium](https://medium.com/nightingale/drawing-out-data-sketches-58da7e6fd824)
- [Nicholas Felton — Wikipedia](https://en.wikipedia.org/wiki/Nicholas_Felton_(graphic_designer))
- [The Feltron Annual Report — 99% Invisible](https://99percentinvisible.org/episode/episode-31-the-feltron-annual-report/)
- [The Why Axis — Feltron Annual Reports Start to Feel Like Annual Reports](http://thewhyaxis.info/feltron/)
- [Feltron 2014 Annual Report Printing — DATAGRAPHIC](https://datagraphicdesign.com/project/feltron-annual-report/)
- [Feltron 2005 / 2013 Annual Report — Fonts In Use](https://fontsinuse.com/uses/1600/feltron-2005-annual-report)
- [Nicholas Felton Unveils His Latest Annual Report — Fast Company](https://www.fastcompany.com/1672108/nicholas-felton-unveils-his-latest-annual-report)
