# Best-Performing Infographic Formats from Premier Data-Journalism Outlets
### A format bank for a LinkedIn supply-chain content brand (Shetty's Desk)

**Compiled:** 2026-06-28
**Method:** WebSearch across all named outlets + format-specific dataviz literature. WebFetch was **blocked (HTTP 403)** by the agent proxy on `visualcapitalist.com`, `gijn.org`, and `lab.imedd.org` — so direct-page reads of Visual Capitalist's Top-25 list and the two Burn-Murdoch interviews could NOT be retrieved. Those outlets are covered via search snippets + corroborating secondary sources, and I flag where a claim is inferred rather than directly verified.

**Honesty note on verification:**
- **Verified well** (multiple corroborating sources): Economist house style (red tag, headline title, one-message rule), Burn-Murdoch's annotation philosophy, OWID/Datawrapper area-chart practice, the slope/dumbbell/bump/connected-scatter family, Sankey supply-chain fit, cartogram/hexbin/tile-grid map family, generic house-style rules (titles, source lines, direct labeling).
- **Partially verified** (search snippets only, page bodies blocked): Visual Capitalist / Voronoi specific top-performers; National Geographic cutaway tradition; Scientific American / Jen Christiansen approach.
- **Could NOT verify directly:** exact engagement/save numbers for any single graphic; Bloomberg has **no public dataviz style guide** (only inferred traits: saturated color + Bloomberg typeface).

---

## PART 1 — THE FORMAT BANK (28 formats)

For each: **Argument shape** · **Mechanics** · **Why it performs** · **Supply-chain use** · **Code-render (HTML/CSS/SVG, no d3)** · **Signature polish**

---

### A. RANKING & COMPARISON

**1. Ranked horizontal bar ("league table")**
- **Argument:** ranking / comparison.
- **Mechanics:** bars sorted longest→shortest, single accent color, value labels at bar end, category labels left-aligned inside or beside the bar. No gridlines needed.
- **Why it performs:** instantly answers "who's #1?" — the most screenshot-saved chart shape on LinkedIn. Zero learning curve.
- **Supply-chain:** "Top 10 ports by container throughput," "Lead-time by supplier region," "Freight cost per lane." Highlight your one focal bar in brand color, grey the rest.
- **Code-render:** **Easy.** Pure flexbox div widths or SVG rects. Width = value/max × 100%.
- **Signature polish (Economist):** the single most important bar gets full red; everything else mid-grey. Headline title states the takeaway, not the metric.

**2. Slope chart ("before/after lines")**
- **Argument:** change-over-time between exactly two points + rank shift.
- **Mechanics:** two vertical axes (Year A / Year B), one line per category, direct labels at both ends. Up = green/brand, down = grey or red.
- **Why it performs:** the eye reads direction as story — "who rose, who fell" — in one glance. Breaks down past ~15 lines.
- **Supply-chain:** "On-time delivery: 2023 vs 2025 by carrier," "Inventory turns pre/post S&OP rollout."
- **Code-render:** **Easy–Medium.** SVG `<line>` + `<text>`; compute y from value.
- **Signature polish:** label only the lines that moved; mute the flat ones to near-grey.

**3. Dumbbell / barbell chart**
- **Argument:** the *gap* between two values per category.
- **Mechanics:** two dots joined by a thin connector, sorted by gap size; the two dot colors are a fixed two-color pair.
- **Why it performs:** the connecting line literally draws the "distance" — gap inequality is visceral.
- **Supply-chain:** "Quoted vs actual lead time by supplier," "Planned vs realized landed cost," "Target vs actual fill rate."
- **Code-render:** **Easy.** SVG: line + two circles per row.
- **Signature polish:** sort by gap, not alphabetically; annotate the widest gap with a callout.

**4. Bump chart ("rank race")**
- **Argument:** rank changes across many periods (who leads over time).
- **Mechanics:** rank on y (1 at top), time on x, one line per entity, lines cross as ranks swap. Highlight 1–2 entities in color.
- **Why it performs:** the crossings are the drama; reads like a standings table animated.
- **Supply-chain:** "Supplier scorecard rank by quarter," "Top sourcing countries over 5 years."
- **Code-render:** **Medium.** SVG polylines; manageable with ≤8 entities.
- **Signature polish (FT):** colour only the 1–2 entities the story is about, grey the field.

**5. Connected scatterplot**
- **Argument:** two variables' joint path over time (correlation + trajectory).
- **Mechanics:** x = var A, y = var B, points connected in time order, arrowhead on the latest point, sparse year labels.
- **Why it performs:** shows a *loop or reversal* a normal line chart hides; signals analytical depth.
- **Supply-chain:** "Inventory vs service level over a year," "Freight cost vs volume," "Stockouts vs forecast accuracy."
- **Code-render:** **Medium.** SVG path + labeled nodes.
- **Signature polish (NYT):** label only inflection-point years; arrowhead marks "now."

---

### B. PART-TO-WHOLE & CONCENTRATION

**6. Voronoi / weighted "bubble-pack" treemap ("the X in one chart")**
- **Argument:** part-to-whole + concentration, with many parts at once.
- **Mechanics (Visual Capitalist signature):** the whole = one tessellated shape; each cell's area ∝ its value; cells grouped/colored by category; bold value labels inside large cells. *(Mechanics from VC snippets — page body blocked.)*
- **Why it performs:** turns a boring "100% = …" into a dense, map-like object people zoom into and save. VC's "$105T World Economy" is the canonical example.
- **Supply-chain:** "Global container fleet by operator," "Total logistics spend by category," "Where one product's landed cost goes."
- **Code-render:** **Hard.** True Voronoi tessellation needs a layout algorithm (effectively d3-voronoi). A **squarified treemap** is the achievable HTML/CSS substitute — nested fl. boxes, area ≈ value.
- **Signature polish (VC):** giant headline number top-left, bold cell labels, a **source band** across the bottom + logo.

**7. Treemap (nested rectangles)**
- **Argument:** hierarchy + part-to-whole.
- **Mechanics:** rectangles sized by value, nested by category, color = category, biggest top-left.
- **Why it performs:** compresses a whole taxonomy into one frame; good for "where does it all go."
- **Supply-chain:** "Spend cube: category → subcategory → supplier," "Portfolio of SKUs by revenue."
- **Code-render:** **Medium.** Squarified algorithm is ~40 lines of JS over flexbox/absolute divs; no d3 required.
- **Signature polish:** label only cells big enough to hold text; tiny cells get a hover/footnote.

**8. Waffle / unit chart (10×10 square grid)**
- **Argument:** part-to-whole as a percentage you can *count*.
- **Mechanics:** 100 squares; filled squares = the %; one accent color vs light grey.
- **Why it performs:** "73 out of 100" is more concrete and shareable than a pie; reads on mobile thumbnail.
- **Supply-chain:** "73% of shipments arrived on time," "1 in 4 SKUs drives 80% of revenue."
- **Code-render:** **Easy.** CSS grid of 100 divs, toggle a fill class.
- **Signature polish:** pair the grid with one giant number; isotype version replaces squares with relevant icons (containers, trucks).

**9. Pictogram / isotype array**
- **Argument:** magnitude/comparison via repeated icons.
- **Mechanics:** rows of identical icons, each icon = N units; partial icon clipped for remainder.
- **Why it performs:** concrete, human, instantly legible; the icon ties to the subject.
- **Supply-chain:** "Each truck = 1,000 TEU," "Each figure = 10,000 warehouse workers."
- **Code-render:** **Easy.** Repeat an inline SVG icon; clip the last with width/overflow.
- **Signature polish (Nat Geo lineage):** custom-drawn, on-topic icon, not a generic clip-art glyph.

**10. Stacked bar / 100% stacked bar**
- **Argument:** composition + comparison across categories.
- **Mechanics:** each bar segmented by component; either absolute (compare totals) or 100% (compare mix). Direct segment labels.
- **Why it performs:** shows mix and total together; the workhorse comparison frame.
- **Supply-chain:** "Cost structure per unit by plant," "Mode split (air/ocean/road) by region."
- **Code-render:** **Easy.** Flex row of colored divs summing to 100%.
- **Signature polish:** limit to 3–4 segments; label inside if segment is wide enough, else lead-line out.

**11. Marimekko / Mekko (variable-width stacked bar)**
- **Argument:** two-dimensional part-to-whole (segment share × market size).
- **Mechanics:** column widths ∝ category size, segment heights ∝ share within. Area = the real story.
- **Why it performs:** packs market size AND mix into one rectangle — a "consultant power chart."
- **Supply-chain:** "Spend by category (width) × supplier concentration within (height)," "Revenue by region × channel mix."
- **Code-render:** **Medium.** Nested flexbox: outer widths %, inner heights %.
- **Signature polish:** keep to a 4×3 grid max; label only dominant cells.

**12. Pareto chart (80/20)**
- **Argument:** concentration — the vital few vs trivial many.
- **Mechanics:** sorted descending bars + cumulative % line crossing the 80% gridline.
- **Why it performs:** the 80/20 line is a recognizable "aha"; ready-made management narrative.
- **Supply-chain:** "20% of SKUs = 80% of stockouts," "Few lanes drive most freight spend."
- **Code-render:** **Medium.** Bars (easy) + an SVG cumulative line overlaid + one dashed 80% rule.
- **Signature polish:** shade the "vital few" zone; annotate the 80% crossing point explicitly.

---

### C. FLOW & PROCESS

**13. Sankey diagram (flow)**
- **Argument:** flow / transformation — how a whole splits and recombines across stages.
- **Mechanics:** nodes = stages, links = flows, link **width ∝ volume**; color by source or category.
- **Why it performs:** combines network ("what connects to what") + magnitude ("how much") in one image; feels like an X-ray of a system. Search sources repeatedly name **supply chain** as the textbook Sankey use case.
- **Supply-chain:** "Raw material → supplier → plant → DC → customer, sized by volume," "Where total landed cost flows," "Returns/scrap flow."
- **Code-render:** **Hard.** Curved link geometry + node layout is the work; a **stage-to-stage ribbon** with straight `<path>` links is a feasible simplified build, but true Sankey routing is effectively a library job.
- **Signature polish:** label flows with both % and absolute; one highlighted path in brand color, rest muted.

**14. Process / stepper flow (numbered stages)**
- **Argument:** sequence / pipeline.
- **Mechanics:** horizontal chain of labeled blocks with arrows/chevrons; optional metric under each step.
- **Why it performs:** explains a system simply; the "explainer" format LinkedIn educators live on.
- **Supply-chain:** "S&OP cycle in 5 steps," "Order-to-cash," "Procure-to-pay."
- **Code-render:** **Easy.** Flexbox of cards + CSS chevrons/arrows.
- **Signature polish:** consistent card sizing, one accent per active step, a metric badge per stage.

**15. Chord / network diagram**
- **Argument:** bilateral relationships / trade flows between many entities.
- **Mechanics:** entities on a circle, ribbons connecting them, ribbon width ∝ flow.
- **Why it performs:** dense and beautiful; signals "global system" at a glance.
- **Supply-chain:** "Trade flows between regions," "Inter-plant transfers."
- **Code-render:** **Hard.** Arc + ribbon geometry needs trig/layout; not a clean no-d3 build.
- **Signature polish:** highlight one origin's ribbons, grey the rest.

**16. Gantt / timeline bar**
- **Argument:** duration + sequence over time.
- **Mechanics:** horizontal bars positioned and sized along a time axis; rows = activities.
- **Why it performs:** universally legible schedule; good for "how long things take."
- **Supply-chain:** "Lead-time waterfall: order→production→transit→customs→delivery," "Project / ramp timeline."
- **Code-render:** **Easy.** Absolute-positioned bars on a percentage time axis.
- **Signature polish:** color the critical path; annotate the bottleneck segment.

**17. Waterfall chart (bridge)**
- **Argument:** how a total is built up / eroded by sequential contributions.
- **Mechanics:** floating bars stepping from a start total to an end total; up = adds, down = subtracts, distinct colors.
- **Why it performs:** the "bridge" makes cause-and-effect on a number obvious — a finance/ops staple.
- **Supply-chain:** "From ex-works price to landed cost (freight + duty + insurance + handling)," "Forecast → actual variance bridge."
- **Code-render:** **Medium.** Bars with computed top offsets; connector lines between steps.
- **Signature polish:** subtotals in dark, increments in muted; label each delta with its sign.

---

### D. CHANGE-OVER-TIME

**18. Annotated line chart (FT/Economist signature)**
- **Argument:** change over time, with the *meaning* built in.
- **Mechanics:** clean line(s), but **annotations layered directly on the data** — arrows to events, shaded recession/disruption bands, the focal series in color and others grey, end-of-line direct labels (no legend).
- **Why it performs:** Burn-Murdoch's core finding — **minimalist charts scored *lowest*; readers preferred many well-placed annotations** and a strong narrative title. Eye-tracking shows a **"Z" read: title → axes → data**, so text carries the story. Annotation = retention.
- **Supply-chain:** "Container spot rate with COVID/Suez/Red Sea events marked," "Inventory levels with the shortage shaded."
- **Code-render:** **Medium.** SVG polyline + `<text>` callouts + a shaded `<rect>` band. The annotations are HTML/CSS-cheap and are the whole value.
- **Signature polish (FT):** annotation layering — arrows tying prose to exact points; recession shading; the title is a full sentence claim.

**19. Small multiples (trellis grid)**
- **Argument:** compare the same metric across many entities — pattern vs outlier.
- **Mechanics:** a grid of tiny identical charts, **shared axes/scale**, sorted; one panel highlighted.
- **Why it performs:** lets the eye scan dozens of trends and spot the odd one out; reads as rigorous.
- **Supply-chain:** "Demand curve per SKU family," "On-time % per DC," "Price trend per commodity."
- **Code-render:** **Medium.** CSS grid of mini inline-SVG sparkline-style charts; reuse one component.
- **Signature polish:** identical scales (non-negotiable), grey baseline + one colored series, sort panels by a meaningful order.

**20. Streamgraph / stacked area**
- **Argument:** composition changing over time.
- **Mechanics:** stacked bands over a time axis; OWID-style direct labels on the bands, 3–5 layers max, largest at bottom.
- **Why it performs:** shows shifting mix as a flowing shape; good for "the composition changed."
- **Supply-chain:** "Mode-of-transport mix over time," "Sourcing-region share evolution."
- **Code-render:** **Medium.** SVG stacked `<path>` areas; band y-offsets computed.
- **Signature polish (OWID):** annotate every major direction change, label bands directly, no legend.

**21. Area chart with reference band**
- **Argument:** a trend against a "normal" range.
- **Mechanics:** line/area + a shaded band for historical normal or target; deviations pop.
- **Why it performs:** instantly shows "are we inside or outside normal?"
- **Supply-chain:** "Inventory days vs target band," "Lead time vs SLA band."
- **Code-render:** **Easy–Medium.** SVG band `<rect>`/`<path>` behind the line.
- **Signature polish:** shade the band light grey, breaches in red; annotate the worst breach.

**22. Sparkline row / table-with-trends**
- **Argument:** ranking + trend together, compactly.
- **Mechanics:** a table where each row carries a tiny inline trend line + a current value + delta.
- **Why it performs:** dense, scannable, "dashboard" feel; great for carousels.
- **Supply-chain:** "Supplier scorecard: KPI value + 12-mo sparkline + arrow."
- **Code-render:** **Easy.** HTML table + tiny inline SVG per row.
- **Signature polish:** color the delta arrow only; keep sparklines monochrome and same-scale.

---

### E. DISTRIBUTION

**23. Beeswarm / dot-strip plot**
- **Argument:** distribution + individual points (clusters, outliers).
- **Mechanics:** one dot per item along an axis, jittered so none overlap; color/size optional.
- **Why it performs:** shows the *spread and the outliers as real things*, not a bar; feels granular and honest.
- **Supply-chain:** "Lead time per shipment (see the long tail)," "Cost per order across suppliers."
- **Code-render:** **Medium.** Positioning x by value, y by a simple collision offset; doable without d3 but the layout is the work.
- **Signature polish:** label only the extreme outliers; one accent dot for "your" item vs the field.

**24. Histogram / distribution bars**
- **Argument:** shape of a single variable's distribution.
- **Mechanics:** binned counts as adjacent bars; median/mean line annotated.
- **Why it performs:** reveals skew and tails a single average hides.
- **Supply-chain:** "Distribution of delivery delays," "Order-size distribution."
- **Code-render:** **Easy.** Bars from pre-binned data.
- **Signature polish:** mark and label the median; shade the problem tail.

**25. Ridgeline ("joyplot")**
- **Argument:** how a distribution shifts across categories/time.
- **Mechanics:** stacked, slightly overlapping density curves, one per group, offset vertically.
- **Why it performs:** striking and memorable; shows distributional change, not just averages.
- **Supply-chain:** "Lead-time distribution by month (watch it widen during disruption)."
- **Code-render:** **Hard.** Needs density estimation + overlapping area paths; pre-compute curves to make it feasible.
- **Signature polish:** subtle overlap, single hue with opacity, label each ridge directly.

---

### F. GEOGRAPHIC

**26. Choropleth map**
- **Argument:** geographic variation of a metric.
- **Mechanics:** regions shaded by value on a sequential scale; legend or annotated extremes.
- **Why it performs:** "where is it worst/best" reads instantly; maps get saved.
- **Supply-chain:** "Tariff exposure by country," "Port congestion by region," "Supplier concentration by geography."
- **Code-render:** **Medium.** Inline SVG map paths + a value→fill function. Easy once you have the SVG; hard to build the geometry from scratch.
- **Signature polish:** restrained sequential ramp (not rainbow); annotate the 2–3 notable regions directly on the map.

**27. Tile-grid / hexbin map**
- **Argument:** geographic comparison with *equal visual weight* per region.
- **Mechanics:** every region = same-size square/hex, arranged to approximate geography; value = fill.
- **Why it performs:** removes the "big empty region looks important" bias of choropleths; modern, NYT/NPR-coded.
- **Supply-chain:** "Service level by US state," "Risk score by country" where small hubs matter as much as big ones.
- **Code-render:** **Easy–Medium.** CSS grid of squares (tile-grid) is genuinely easy; hexes need clip-path.
- **Signature polish (NPR):** consistent tile size, region abbreviation + value inside each tile, no separate legend.

**28. Flow map / bivalent map (origin-destination)**
- **Argument:** geographic flow between places.
- **Mechanics:** map base + curved arcs origin→destination, width ∝ volume.
- **Why it performs:** literally draws trade/logistics routes; high "system" wow factor.
- **Supply-chain:** "Top import lanes into a DC network," "Reshoring shift in sourcing geography."
- **Code-render:** **Hard.** Map projection + arc routing; simplify to a few hand-placed arcs to make it feasible.
- **Signature polish:** 1–2 highlighted lanes in brand color, rest muted; annotate volumes.

---

## PART 2 — CROSS-CUTTING "HOUSE STYLE" RULES

These are what make premier-outlet work look premium regardless of chart type. Steal all of them.

**1. The title is a sentence, not a label.**
Economist/FT golden rule: the title states the *insight* ("Container rates have fallen 80% from their peak"), not the metric ("Container rates 2021–2025"). Eye-tracking shows readers hit the title first — make it carry the message. Subtitle holds the qualifiers (units, geography, timeframe). Metadata never goes in the title.

**2. One chart, one message.**
Prioritize a single takeaway; demote everything else to annotation. If you have two messages, make two charts. This is the most-repeated rule across Economist, FT, Urban Institute, and Datawrapper guidance.

**3. Annotation over legend; label directly.**
Put text *on* the data — end-of-line labels, callouts, event arrows — instead of a separate legend the reader must cross-reference. Burn-Murdoch's research: well-annotated charts beat minimalist ones for engagement AND recall. Legends are a last resort.

**4. Color restraint = one accent + greys.**
The focal series/bar gets the brand/accent color; everything else is greyscale "supporting cast." Economist does this with Econ Red (#E3120B); FT colors only the 1–2 entities the story is about. Saturation draws the eye — spend it on the one thing that matters. (Bloomberg is the loud exception: saturated palette to grab attention — but that's a deliberate brand choice, not a default.)

**5. The source/footnote line is mandatory and quiet.**
Every chart has a source line, lower area, small, light grey ("Source: …; Chart: Shetty's Desk"). It signals rigor and is also a free credibility/brand watermark. Visual Capitalist formalizes this as a **source band** across the bottom with logo.

**6. The "bold number + band" framing (Visual Capitalist).**
A giant headline number top-left, the visual in the middle, a branded source band at the bottom, consistent logo placement. This template is why VC graphics are instantly recognizable and screenshot-friendly. *(From VC snippets; full page reads were proxy-blocked.)*

**7. Type hierarchy is the design.**
Amanda Cox (NYT Upshot): typography/design "done properly are really about hierarchy and clarity." Title (largest, bold) → subtitle (medium, light) → annotations → axis labels → source (smallest). Few weights, consistent.

**8. Mobile/thumbnail legibility.**
LinkedIn is read on phones. Big type, thick lines, high contrast, few elements. The waffle/big-number/ranked-bar formats survive as a thumbnail; dense Voronoi/Sankey need a "zoom-in" second slide.

**9. Honor complexity but remove chartjunk.**
Scientific American (Jen Christiansen): "honoring complexity, avoiding misinformation, visualizing uncertainty." FT: no more info than necessary, but think *hard* about the text. Strip gridlines, 3D, redundant ticks — keep meaningful annotation.

**10. Consistent templating.**
FT templates everything for consistency (they use D3 + a style guide). For a code-render pipeline, this maps to: a fixed CSS design-token set (colors, type scale, margins, source-band component) reused across every format. Consistency is what makes a feed look like a *brand*, not a folder of charts.

---

## PART 3 — PRIORITIZED PICK LIST FOR THE CODE-RENDER PIPELINE (no-d3 HTML/CSS/SVG)

**Build first (Easy + high-performing + supply-chain-native):**
1. Ranked horizontal bar (#1)
2. Waffle / big-number unit chart (#8)
3. Slope chart (#2)
4. Dumbbell chart (#3)
5. Process/stepper flow (#14)
6. Annotated line chart (#18) — the FT/Economist money format
7. Stacked / 100% bar (#10)
8. Tile-grid map (#27)

**Build second (Medium, strong differentiators):**
9. Waterfall/bridge (#17) — landed-cost stories
10. Pareto 80/20 (#12)
11. Small multiples (#19)
12. Connected scatterplot (#5)
13. Treemap (squarified) (#7) — the achievable VC-style part-to-whole
14. Beeswarm (#23)

**Aspirational (Hard; simplify or accept a library):**
15. Sankey (#13) — the single most on-brand supply-chain format; worth a simplified straight-ribbon build
16. Voronoi (#6) — substitute a squarified treemap to get 80% of the effect
17. Flow map (#28), Chord (#15), Ridgeline (#25)

---

## SOURCES (verified via search; * = page body blocked by proxy, snippet only)

- Visual Capitalist — Top 25 of 2025*, Voronoi app announcement, $105T World Economy: https://www.visualcapitalist.com/our-top-25-visualizations-of-2025/ · https://www.visualcapitalist.com/visual-capitalist-new-app-voronoi/ · https://www.voronoiapp.com/
- John Burn-Murdoch / FT — GIJN* and iMEdD* interviews: https://gijn.org/stories/data-visualization-storytelling-tips-john-burn-murdoch/ · https://lab.imedd.org/en/from-data-to-storytelling-concept-and-design-tips-from-the-financial-times-john-burn-murdoch/ · https://johnburnmurdoch.github.io/
- The Economist style: https://medium.com/@aecharts/how-to-create-the-economist-style-charts-f2052ba6d6d3 · https://fountn.design/resource/the-economist-visual-style-guide/
- NYT Upshot / Amanda Cox: https://www.informationisbeautifulawards.com/news/118-the-nyt-s-best-data-visualizations-of-the-year
- Reuters Graphics (chart modules): https://github.com/reuters-graphics/awesome-charts
- Our World in Data / area-chart practice (Datawrapper Academy): https://academy.datawrapper.de/article/128-what-to-consider-when-creating-area-charts
- Bloomberg Graphics: https://www.bloomberg.com/graphics/infographics/ · color traits via https://www.datawrapper.de/blog/colors-for-data-vis-style-guides
- National Geographic infographic tradition: https://www.fastcompany.com/3067134/100-years-of-brilliant-infographics-from-national-geographic
- Scientific American / Jen Christiansen: https://www.jenchristiansen.com/ · https://www.datawrapper.de/blog/book-club-building-science-graphics
- Format references: slope/dumbbell/bump/connected-scatter (PolicyViz, Domo, Wikipedia); Sankey + supply chain (Domo, Plotly); cartogram/hexbin/tile-grid (NPR, data-to-viz); beeswarm/ridgeline (FlowingData, datavizcatalogue)
- House-style rules: Urban Institute style guide · Datawrapper · Depict Data Studio · data.europa.eu visualization-titles guide
