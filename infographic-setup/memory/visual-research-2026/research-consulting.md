# Consulting Chart & Exhibit Format Bank
*Research brief for the Shetty's Desk supply-chain content engine — expanding the visual framework library*

**Purpose:** Catalogue the canonical chart/exhibit formats used by top strategy firms (McKinsey, BCG, Bain, Gartner, Deloitte, Booz/Big-4) plus the classic slide-craft literature, so the `/101` and `/ai-for-sc` pipelines can render consulting-grade single-panel infographics via the code-render path (HTML→PNG, no d3).

**How to read each entry:**
- **Name + firm** — who owns/popularized it
- **Argument shape** — the idea it proves (the "shape of the claim")
- **Visual mechanics** — how it's built (axes, encoding, bands)
- **SC use** — a concrete supply-chain / procurement / planning example
- **Render** — feasibility in plain HTML/CSS/SVG (no d3): Easy / Medium / Hard
- **Polish layer** — the consulting finish (action title, source band, callout)

> **Code-render scope:** "Easy" = static HTML/CSS divs or hand-placed SVG. "Medium" = a little coordinate/running-sum math you compute in template logic, then emit static SVG. "Hard" = needs real scale/regression/log math or non-trivial auto-layout geometry.

---

## PART 1 — THE FORMAT BANK (24 formats)

### 2×2 / MATRIX FAMILY

#### 1. BCG Growth-Share Matrix
- **Firm:** BCG (Bruce Henderson, ~1970). Their most iconic exhibit.
- **Argument shape:** Allocate cash across a portfolio by growth × competitive position. Milk cash cows → fund stars and selected question marks; cull dogs.
- **Visual mechanics:** 2×2. Y = market growth rate (split ~10%); X = relative market share (your share ÷ largest rival, split at **1.0×**, and conventionally **reversed** — high share on the left). Quadrants: **Stars** (hi-growth/hi-share), **Cash Cows** (lo/hi), **Question Marks** (hi/lo), **Dogs** (lo/lo). Units plotted as **bubbles sized by revenue**.
- **SC use:** Portfolio your SKUs — high-velocity/high-margin SKUs (stars) get priority + expedited supply; "dog" SKUs get rationalized out to cut network complexity.
- **Render:** **Easy–Medium** — four CSS quadrants + positioned circles sized by revenue→radius. Only math is mapping (share, growth)→x/y and area→radius.
- **Polish:** Action title "Two SKU families fund the entire catalogue"; accent only the cash-cow bubble, grey the rest.

#### 2. Generic 2×2 Matrix (incl. Kraljic, Eisenhower, effort×impact)
- **Firm:** BCG popularized the form; now universal MBB / case-interview staple.
- **Argument shape:** Split a decision by **two opposing dimensions** and act differently per quadrant. Fast, memorable, forces a binary cut.
- **Visual mechanics:** Two axes (low→high), four labeled quadrants, optional diagonal good→bad gradient, items as dots or just quadrant labels.
- **SC use:** **Kraljic matrix** — procurement's native 2×2: **supply risk × profit impact** → Leverage / Strategic / Non-critical / Bottleneck items, each with a distinct sourcing strategy. Or supplier prioritization (spend × risk).
- **Render:** **Easy** — pure CSS grid, two axis labels, four cells. The canonical "free" template; everything else can reuse its frame.
- **Polish:** One accent quadrant ("Strategic — your top 6 suppliers live here"); source band cites the spend cube.

#### 3. Bubble / Scatter with Quadrants
- **Firm:** Generic MBB; the data-bearing cousin of the 2×2.
- **Argument shape:** Position items on two continuous dimensions, with a **third variable encoded as bubble size** — shows clustering and outliers, not just quadrant membership.
- **Visual mechanics:** XY scatter with two midlines splitting into quadrants; each item a circle; radius = a third metric (revenue, volume). Verified real-world use: plot suppliers by margin contribution (Y) × dependence (X), bubble = revenue — a quantified Kraljic.
- **SC use:** Supplier base — X = supply risk, Y = annual spend, bubble = number of SKUs sourced. Surfaces the "big-spend, high-risk, many-SKU" supplier that needs a mitigation plan.
- **Render:** **Medium** — positioned circles are easy; honest axis scaling (min/max→pixels) is the only math. No regression needed.
- **Polish:** Highlight the one dangerous bubble in accent red; "so-what" arrow: "Single-source + 40% of spend."

#### 4. Gartner Magic Quadrant *(trademarked — reproduce idea-shape, not trade dress)*
- **Firm:** Gartner (registered trademark; Gartner protects reuse aggressively).
- **Argument shape:** "Who leads vs. who's promising." Upper-right is where you want a vendor.
- **Visual mechanics:** Square plot. X = **Completeness of Vision**, Y = **Ability to Execute**. Two midlines → **Leaders** (upper-right), **Challengers** (upper-left), **Visionaries** (lower-right), **Niche Players** (lower-left). Vendors as labeled dots.
- **SC use:** Plot SC-planning software vendors or a 3PL shortlist on "delivers today" × "roadmap/vision." Or reframe playfully: "Magic Quadrant of demand-forecasting methods."
- **Render:** **Easy** — bordered box + crossing midlines + four labels + positioned dots.
- **Polish:** Use original labels/styling; never imply Gartner endorsement. Action title states the verdict, not "Vendor Landscape."

---

### CHANGE / DECOMPOSITION CHARTS

#### 5. Waterfall / Bridge Chart
- **Firm:** McKinsey/MBB deck staple (popularized via think-cell; not single-firm).
- **Argument shape:** "How do we get from A to B, and what each step contributes." Decomposition of a change.
- **Visual mechanics:** X = steps in contribution order; Y = magnitude (start at zero). First and last bars are **anchored full columns**; intermediate bars **float** from the running cumulative total. Two colors for increases vs. decreases; connector lines link bar tops to next base.
- **SC use:** **Landed-cost bridge** — base unit cost → +tariff → +freight → −volume discount → −nearshoring saving → final landed cost. Or a forecast-accuracy / service-level bridge.
- **Render:** **Medium** — compute each bar's cumulative offset (running sum), emit positioned `<rect>`s + connector `<line>`s. Only "work" is the running-total arithmetic.
- **Polish:** Title = the net result ("Tariffs add $1.40; nearshoring claws back $0.90"); accent the single biggest driver.

#### 6. Marimekko / Mekko (Mosaic) Chart
- **Firm:** McKinsey/BCG market-structure analysis.
- **Argument shape:** Two-dimensional market map in one picture — "which segments are big **and** who owns share within them." Where-to-play.
- **Visual mechanics:** 100%-wide chart. **Column width** = category's share of grand total; **height segments** = composition within that category; therefore **rectangle area** = absolute contribution. (Statisticians: a mosaic plot.)
- **SC use:** **Spend cube** — column width = spend per category (logistics, raw materials, packaging), segment height = supplier share within each. Shows where consolidation leverage is biggest.
- **Render:** **Medium** — compute each column's pixel width from its share, stack inner segments by within-column %. Simple proportions; nested divs or rects.
- **Polish:** Highlight the widest-column / most-fragmented cell; footnote the spend source + period.

#### 7. Driver Tree / Value Tree (ROIC tree)
- **Firm:** McKinsey (value-based management; the ROIC driver tree).
- **Argument shape:** "This headline metric is the arithmetic product of these sub-drivers — pull this lever, watch it ripple up." Causal/mathematical decomposition pinpointing the actionable lever.
- **Visual mechanics:** Left-to-right (or top-down) node tree. Root = outcome (e.g., ROIC) splitting via defined operations (= margin × capital turns) into branches, recursively to controllable leaf KPIs. Connectors labeled with operators (×, +, −).
- **SC use:** Decompose **cash-to-cash cycle** → DIO + DSO − DPO → DIO into safety stock + lot sizing + forecast error. Shows planners which lever frees working capital.
- **Render:** **Medium** for a fixed 2–3 level tree (boxes + SVG lines at known coordinates); **Hard** if arbitrary-depth auto-layout. Hardcode the depth → drops to **Easy**.
- **Polish:** Accent the single leaf with the biggest leverage; "so-what" callout on the freed cash.

#### 8. Tornado / Sensitivity Chart
- **Firm:** Generic analytics / corporate finance; standard consulting sensitivity device.
- **Argument shape:** "Which assumptions actually matter?" Ranks input variables by their impact on an output.
- **Visual mechanics:** Horizontal bars extending **left/right from a central base-case axis**; each bar = one variable's downside↔upside swing. Sorted **widest-at-top** → the iconic tornado taper. Best with 7–12 variables (under 5 doesn't justify the format).
- **SC use:** Network-redesign NPV sensitivity — which driver (fuel price, labor rate, demand volume, lease cost) swings the savings most. Or inventory-cost sensitivity to lead-time variance.
- **Render:** **Medium** — bars mirrored around a centerline, sorted by total span; positioned rects, simple math.
- **Polish:** Accent the top (widest) bar; title "Fuel price alone swings NPV by ±$4M."

#### 9. Butterfly / Back-to-Back Bar
- **Firm:** Generic; demographic + comparison convention.
- **Argument shape:** Compare **two datasets with the same categories/scale, mirrored** — winners vs. losers, before vs. after, A vs. B at a glance.
- **Visual mechanics:** Shared central category axis; bars extend left for series A, right for series B (mirrored). Population-pyramid is the classic instance. (Note: visually similar to the tornado, but encodes *two paired series*, not sensitivity ranking.)
- **SC use:** Inbound vs. outbound volume by region; or forecast vs. actual by SKU family; or budgeted vs. actual freight spend by lane.
- **Render:** **Easy–Medium** — two mirrored sets of width-scaled bars around a center axis.
- **Polish:** Two-color (one per side) + grey gridline; title states the gap, not "A vs. B."

---

### TIME / TRAJECTORY CHARTS

#### 10. McKinsey Three Horizons of Growth
- **Firm:** McKinsey (*The Alchemy of Growth*, 1999).
- **Argument shape:** "Don't bet only on today — fund three time-staggered waves so growth never falls off a cliff." Portfolio-of-time-horizons balance.
- **Visual mechanics:** X = time, Y = value/profit. Three overlapping S-curves rising/decaying in sequence — H1 (core, ~1–3 yrs), H2 (emerging, ~2–5 yrs), H3 (options/bets, ~5–12 yrs). Envelope of the three is a smooth rising line. Often annotated with a 70/20/10 resource split.
- **SC use:** H1 = squeeze cost from current network (freight RFPs, S&OP discipline); H2 = nearshoring + multi-sourcing rollout; H3 = autonomous planning / digital twin / AI demand sensing. A 7-year roadmap.
- **Render:** **Medium** — three SVG Bézier S-curves on a labeled axis box; control points hand-tuned once (not data-driven), then reusable.
- **Polish:** Accent the horizon you're arguing for; source/footnote band for the resource split.

#### 11. S-Curve (Adoption / Diffusion)
- **Firm:** Everett Rogers, *Diffusion of Innovations* (1962) for the adopter framing; logistic curve is generic.
- **Argument shape:** Adoption is **slow start → rapid takeoff → saturation**. Used to argue "we're at the inflection / about to go mainstream."
- **Visual mechanics:** Cumulative adoption (Y) vs. time (X) as a flat-S logistic curve. Optionally paired with the **bell-curve adopter segments**: Innovators 2.5% → Early Adopters 13.5% → Early Majority 34% → Late Majority 34% → Laggards 16% (a normal-curve partition, *not* an empirical measurement).
- **SC use:** Plot a SC tech (AI demand planning, control towers, autonomous MHE) on the S-curve: "we've just crossed early adopters into early majority — the takeoff zone." Natural duo with the Hype Cycle.
- **Render:** **Medium** — one SVG Bézier flat-S (tuned once); axis + segment bands are easy.
- **Polish:** Mark "you are here" with the accent; footnote the segment percentages as a convention.

#### 12. Gartner Hype Cycle *(trademarked)*
- **Firm:** Gartner (Jackie Fenn, 1995; trademarked).
- **Argument shape:** Expectations aren't linear — tech overshoots into hype, crashes, then recovers to durable usefulness. "Don't bail at the trough."
- **Visual mechanics:** One curve, Expectations (Y) vs. Time/Maturity (X): steep rise to a peak, drop to a low, gentle rise to a plateau. Five zones: **Innovation Trigger → Peak of Inflated Expectations → Trough of Disillusionment → Slope of Enlightenment → Plateau of Productivity.** Technologies plotted as dots riding the curve.
- **SC use:** Place SC tech on the curve — "blockchain traceability" sliding into the trough, "AI demand sensing" climbing the slope, "RFID" at the plateau. Strong recurring content series.
- **Render:** **Medium** — signature peak-then-plateau curve as one hand-tuned SVG `<path>`; zone labels + dots trivial.
- **Polish:** Use original labels; accent the one tech you're discussing; cite your own positioning rationale in the footnote.

#### 13. Experience / Learning Curve
- **Firm:** BCG (Henderson, 1960s–70s) — the engine behind the growth-share matrix.
- **Argument shape:** "Unit cost falls a predictable % (typically 20–30%) every time **cumulative** production doubles" — accumulated share buys durable cost advantage.
- **Visual mechanics:** (a) Linear axes: convex decaying curve (cost/unit vs. cumulative volume). (b) **Log-log axes:** the same becomes a **straight downward line** (the diagnostic form); slope = learning rate (80% curve = cost → 80% per doubling).
- **SC use:** Project a new component's landed cost as supplier cumulative output scales; justify committing volume to ride the curve down. Or warehouse pick-cost vs. cumulative throughput.
- **Render:** **Hard** — honest version needs a real **log scale** + power-law `cost = a·V^(−b)` math. Linear convex curve alone is Medium.
- **Polish:** Accent the projected future cost point; footnote the assumed learning rate.

#### 14. Slope Chart / Bump Chart
- **Firm:** Generic; storytelling-with-data staple, heavy in consulting before/after slides.
- **Argument shape:** **Slope** = two time points, shows who rose/fell/held (before↔after). **Bump** = rank changes across 3+ periods.
- **Visual mechanics:** Slope = two vertical axes (left = before, right = after), each category a line connecting its two values; direction/steepness encodes change. Bump = rank (Y) vs. time (X), lines crossing as ranks swap. Direct labels, no legend.
- **SC use:** Supplier OTIF before vs. after a scorecard program (slope); or carrier rank by reliability across four quarters (bump). Lane cost ranking shifts over a year.
- **Render:** **Easy–Medium** — slope is two columns of points + connecting `<line>`s; bump adds more periods. Minimal math.
- **Polish:** Accent the one line that moved most; grey the flat ones (ghosting).

#### 15. Football Field (Range) Chart
- **Firm:** Investment banking / M&A (pitchbook + fairness-opinion staple).
- **Argument shape:** Synthesize **multiple methods into one defensible range** — shows where methods converge (high confidence) vs. diverge (judgment).
- **Visual mechanics:** Horizontal **floating bars**, one per method (DCF, comps, precedent transactions, 52-week range), on a common value axis. Overlap zone = the consensus range. Often a vertical line/shaded band marks the offered price. (Built in Excel as a stacked bar with the "minimum" series set to no-fill.)
- **SC use:** "Total landed cost range" across estimation methods (should-cost model, supplier quotes, benchmark index, historical actuals) — shows the defensible negotiation range and where to anchor.
- **Render:** **Easy–Medium** — floating horizontal bars (left offset + width) on a shared axis; one vertical marker line. Simple offset math.
- **Polish:** Accent the convergence band; vertical "target" line in the lead color; title states the range.

---

### MATURITY / STATUS / SCORECARD

#### 16. Maturity Model / Capability Ladder (staircase)
- **Firm:** CMMI (Carnegie Mellon / ISACA); the staircase is reused by Deloitte, KPMG, every consultancy.
- **Argument shape:** Progress is **staged and cumulative** — climb one rung at a time. "Here's where you are; here's the next rung."
- **Visual mechanics:** Ascending staircase of 4–5 labeled blocks rising left→right. CMMI rungs: 1 Initial → 2 Managed → 3 Defined → 4 Quantitatively Managed → 5 Optimizing. Diagonal arrow + "you are here" marker.
- **SC use:** **Procurement Maturity Ladder** — Reactive buying → Centralized sourcing → Category management → Analytics-driven → Autonomous/AI-orchestrated. Or S&OP maturity. Very on-brand for a teaching pipeline.
- **Render:** **Easy** — flexbox row of progressively taller divs (`align-items: flex-end`); labels inside each step. No paths.
- **Polish:** Accent the current rung + the next-target rung; title names the gap.

#### 17. Heatmap / RAG (Red-Amber-Green) Status Grid
- **Firm:** Generic PMO / PRINCE2; ubiquitous in Big-4 status decks.
- **Argument shape:** "At-a-glance health across many cells." Color does the work: Green on-track / Amber attention / Red urgent. Scan for the red.
- **Visual mechanics:** Table/matrix. Rows = items (workstreams, suppliers, KPIs); columns = dimensions (scope, time, budget, quality, risk) or time periods. Each cell R/A/G filled (continuous-gradient heatmap is the numeric cousin).
- **SC use:** Supplier risk dashboard — rows = suppliers, columns = (financial health, OTIF, quality PPM, geopolitical exposure, single-source risk), RAG-coded. Or category × region spend-risk heatmap.
- **Render:** **Easy** — HTML `<table>` (or CSS grid) with per-cell background from data. The most trivial format here.
- **Polish:** Limit to 3 status colors; title states the headline ("3 of 12 suppliers are red on single-source risk").

#### 18. Harvey Balls Scorecard
- **Firm:** Booz Allen Hamilton (Harvey Poppel, 1970s — named after him).
- **Argument shape:** Qualitative ratings made **comparable at a glance** without numbers — "how fully does each option meet each criterion."
- **Visual mechanics:** Comparison table; rows = options, columns = criteria. Each cell a circle filled to one of **five levels: empty, ¼, ½, ¾, full.** Scan columns for fullest balls.
- **SC use:** 3PL/carrier selection — rows = carriers, columns = (cost, transit reliability, coverage, sustainability, tech integration), each a Harvey ball. Or WMS/TMS feature comparison.
- **Render:** **Easy–Medium** — each ball is a small SVG (circle outline + filled arc/clip). Build 5 reusable snippets once, then table-fill. Half/quarter fills (arc path or clip-rect) are the only mild fiddle.
- **Polish:** Accent the winning column; footnote the scoring rubric.

#### 19. Spider / Radar Chart
- **Firm:** Generic; consulting capability-assessment + balanced-scorecard staple.
- **Argument shape:** Multivariate profile on one shape — strengths/weaknesses across 5–8 normalized dimensions; outliers pop instantly.
- **Visual mechanics:** Axes radiate from a center; each variable one spoke; values plotted along spokes and connected into a polygon. Best 5–8 variables, all normalized to one scale; **≤3 overlaid series** (more = unreadable). **Caveat:** axis order changes the polygon shape — don't over-read silhouette.
- **SC use:** Supplier capability radar — (quality, cost, delivery, innovation, ESG, financial stability); overlay your supplier vs. the category benchmark.
- **Render:** **Medium** — spokes + polygon via SVG; needs trig (cos/sin per axis angle) to place vertices, but no library.
- **Polish:** Two series max (focal accent vs. greyed benchmark); title states the gap dimension.

---

### PROCESS / STRUCTURE / METAPHOR

#### 20. Value Chain (Porter)
- **Firm:** Michael Porter, *Competitive Advantage* (1985).
- **Argument shape:** A firm is a **sequence of value-adding activities**; decompose to find where margin/advantage come from.
- **Visual mechanics:** Rightward **chevron** (arrowhead = **Margin**). Bottom band = **Primary activities** (Inbound Logistics → Operations → Outbound Logistics → Marketing & Sales → Service); top bars = **Support activities** (Firm Infrastructure, HR, Technology Development, Procurement).
- **SC use:** Almost native — annotate where supply chain lives (inbound/operations/outbound) and how Procurement (a support activity) feeds every stage. Great for "where SC sits in the firm."
- **Render:** **Medium** — stacked support bars easy; the rightward "Margin" chevron needs an SVG polygon / CSS clip-path (drawn once, reused).
- **Polish:** Accent the SC stages; title "Supply chain touches 3 of 5 primary activities."

#### 21. Stage-Gate / Process Flow / Swimlane
- **Firm:** Stage-Gate® = Robert Cooper (trademarked); swimlanes = generic BPMN/process-mapping.
- **Argument shape:** "Who does what, in what order, where the handoffs are." Swimlanes add accountability (lane = actor); gates add go/kill decision points.
- **Visual mechanics:** Horizontal lanes (one per role); steps = boxes in the owning lane; arrows connect left→right; diamonds = decision gates. Crossing a lane boundary = a handoff (the failure-prone moment).
- **SC use:** **Procure-to-pay** or order-to-cash swimlane — lanes for Requisitioner / Procurement / Approver / Supplier / AP; gates at "approve PR," "approve invoice." Exposes where delays happen.
- **Render:** **Medium** — lanes + boxes are easy CSS grid; **connector arrows between arbitrary boxes** are the hard part without d3 (SVG lines/markers, hand-placed coords). Linear flows manageable; branching gets fiddly.
- **Polish:** Accent the bottleneck handoff; title names the slow gate.

#### 22. RACI / RAPID Matrix
- **Firm:** RACI = generic PM; **RAPID®** = Bain trademark.
- **Argument shape:** "For every task, exactly who is responsible/accountable/etc." Kills ambiguity and orphaned tasks. (RAPID = **R**ecommend, **A**gree, **P**erform, **I**nput, **D**ecide — roles, not a sequence; Decide is the single owner.)
- **Visual mechanics:** Grid — rows = tasks/decisions, columns = roles/people; cells hold R/A/C/I (or RAPID letters). RACI rule of thumb: exactly one **A** per row.
- **SC use:** Supplier-onboarding RACI (rows: credit check, quality audit, contract sign-off, system setup, first PO; columns: Procurement, Quality, Legal, Finance, Supplier) — exposes where two teams both think they own a step, or nobody does. Or RAPID on an "expedite vs. hold a late shipment" decision.
- **Render:** **Easy** — styled HTML `<table>` with single letters; optional per-letter color. Trivial.
- **Polish:** Accent the orphaned/conflicted cell; title states the gap.

#### 23. Funnel Chart
- **Firm:** Generic sales/marketing analytics.
- **Argument shape:** **Progressive drop-off through sequential stages** — wide top, narrow bottom. "Find the stage where you're losing the most" (the bottleneck).
- **Visual mechanics:** Stacked, center-aligned bars of decreasing width top→bottom, each labeled with stage + count/%; stage-to-stage conversion rates annotated between bands.
- **SC use:** Procurement sourcing funnel — Suppliers identified → RFQ sent → Responses → Shortlisted → Qualified → Awarded. Or demand funnel: forecast → confirmed orders → fulfilled → on-time delivered.
- **Render:** **Easy** (rectangular/stepped) — center-aligned width-scaled divs. **Medium** for true sloped trapezoids (one SVG polygon per band). Rectangular reads fine.
- **Polish:** Accent the biggest-leak stage; title states the worst conversion.

#### 24. Iceberg Diagram (visible vs. hidden)
- **Firm:** Generic metaphor; popularized in cost-of-poor-quality and Total Cost of Ownership analysis.
- **Argument shape:** **What you see is a fraction of what's there** — small visible tip, large hidden mass (illustrative ~20/80). "The real costs are below the surface."
- **Visual mechanics:** Iceberg silhouette bisected by a **waterline**. Above: few visible items (small area). Below: large area, many hidden items. Color shift at the waterline.
- **SC use:** **Total Cost of Ownership iceberg** — above: purchase price. Below: freight, duties, inventory carrying, quality failures, expediting, supplier risk, rework, lost sales. Classic, highly shareable procurement teaching exhibit.
- **Render:** **Medium** — iceberg silhouette = one SVG polygon (or two stacked shapes split at the waterline); labels positioned. Settle for a stacked tip/base abstraction → **Easy**.
- **Polish:** Accent the hidden mass; title "Purchase price is 20% of true cost."

---

### Quick-reference render table

| # | Format | Firm most associated | Render (no-d3) | Key build trick |
|---|---|---|---|---|
| 1 | Growth-Share Matrix | BCG | Easy–Medium | 4 quadrants + sized bubbles |
| 2 | Generic 2×2 / Kraljic | BCG / generic | Easy | CSS grid, 4 cells |
| 3 | Bubble w/ quadrants | MBB | Medium | axis scaling + radius |
| 4 | Magic Quadrant | Gartner (TM) | Easy | box + midlines + dots |
| 5 | Waterfall / Bridge | McKinsey/MBB | Medium | running-sum offsets |
| 6 | Marimekko / Mekko | McKinsey/BCG | Medium | proportional widths |
| 7 | Driver / Value tree | McKinsey | Medium (Easy if fixed depth) | boxes + lines |
| 8 | Tornado / sensitivity | generic | Medium | mirrored sorted bars |
| 9 | Butterfly / back-to-back | generic | Easy–Medium | mirrored bars |
| 10 | Three Horizons | McKinsey | Medium | 3 Bézier S-curves |
| 11 | S-curve (adoption) | Rogers 1962 | Medium | 1 Bézier flat-S |
| 12 | Hype Cycle | Gartner (TM) | Medium | peak→plateau path |
| 13 | Experience curve | BCG | Hard | log-log / power law |
| 14 | Slope / bump | generic | Easy–Medium | points + connectors |
| 15 | Football field | IB / M&A | Easy–Medium | floating bars + marker |
| 16 | Maturity ladder | CMMI | Easy | rising flex blocks |
| 17 | RAG heatmap | PMO/PRINCE2 | Easy | per-cell bg color |
| 18 | Harvey balls | Booz Allen | Easy–Medium | 5 reusable SVG fills |
| 19 | Spider / radar | generic | Medium | trig vertex placement |
| 20 | Value chain | Porter 1985 | Medium | chevron polygon |
| 21 | Swimlane / stage-gate | Cooper (TM) / generic | Medium | connector arrows |
| 22 | RACI / RAPID | generic / Bain (TM) | Easy | letter-filled table |
| 23 | Funnel | generic | Easy | centered width bars |
| 24 | Iceberg | generic (TCO) | Medium | silhouette + waterline |

**Best first targets for the engine (all Easy, high reuse):** 2×2/Kraljic, RAG heatmap, RACI/RAPID, maturity ladder, Magic Quadrant frame, funnel, slope, football field. **Defer:** experience curve (#13, real log math).

---

## PART 2 — THE SLIDE-CRAFT RULES WORTH STEALING

These are the MBB "house rules" — they make a panel *read* as consulting-grade regardless of chart type. Build them into the render template once.

### Rule 1 — Action titles (the single most important rule)
The title is a **complete sentence stating the takeaway**, not a topic label. If a reader reads only the title, they get the conclusion.
- **Topic title (bad):** "Q3 Revenue" · "Stockout Analysis" · "Supplier Overview"
- **Action title (good):** "Two suppliers drive 60% of your stockout risk" · "Daily AI forecasts cut stockouts 30%"
- Rules: lead with the subject, active verb, **put a number in it** when possible, one line, one claim. If there's an "and" joining two ideas → split into two panels.
- **Storyline test:** read all titles in a series in sequence — they should chain into a paragraph that makes the whole argument.

### Rule 2 — One message per exhibit
Each panel proves exactly one insight (the one in the action title). The body *supports*, never *complicates*. Two charts to make two points = two panels.

### Rule 3 — The lead/highlight color on the ONE element that matters
- Palette = **one dark neutral (text) + grey (everything) + one accent (emphasis).** 2–3 colors max.
- Color the single data point/bar that proves the point; **grey down (ghost) the rest.** Color = "look here," never decoration. If three things are highlighted, nothing is.
- Emphasis can also be a circle or arrow on the focal element.

### Rule 4 — Ghosting non-focus elements
De-emphasize (grey/lighten/shrink) everything that isn't the focus so the highlighted element pops. Context stays present but recedes. (This is the "ghost chart" gray-comparison convention: focal series in accent, benchmark/prior/competitors in grey.)

### Rule 5 — The "so-what" callout
Point at any element and ask "so what?" — if it doesn't connect to the action title, cut it. Add **one** explicit callout (a short attached note/arrow) spelling out the implication the chart alone doesn't state, e.g., "↑ 3× since automation."

### Rule 6 — Footnote / source discipline
- **Source line**, bottom of panel, format `Source: [origin], [year]`. Cite the data origin **every time** — at MBB this is non-negotiable.
- **Footnotes** for definitions, units, caveats; superscript markers; terse.
- For a content brand: a consistent small always-present source line builds trust and signals rigor — make it a **template element**, not an afterthought.

### Rule 7 — Pyramid Principle structure (Minto)
- **Communicate top-down** even though you *think* bottom-up. Headline = conclusion; visual = support. Never make readers assemble the conclusion.
- Structure: **Governing thought** (one main message) → **Key lines** (2–4 grouped, MECE, logically ordered reasons) → **Support** (the data under each).
- Panel recipe: one big claim (title) + 3 supporting blocks + the numbers in each.
- **SCQA hook** (great for the caption): **Situation** (accepted context) → **Complication** (what changed) → **Question** (implicit) → **Answer** (= the action title). Example: "Most warehouses run on weekly forecasts. *But* demand now shifts daily. *So how do you plan?* → Daily AI forecasts cut stockouts 30%."

### Rule 8 — MECE grouping (McKinsey)
Any list/breakdown must have **no overlaps** (each item in one bucket) and **no gaps** (buckets cover everything).
- Pre-publish test for any "3 reasons / 4 types / 5 steps" infographic: could an item belong in two buckets (not ME)? Is there an obvious missing case (not CE)? Aim for **2–4 buckets**; >5 usually signals not-yet-MECE.

### Rule 9 — Choose the chart from the MESSAGE, not the data (Zelazny + Abela)
Write the takeaway as a sentence first, then pick the form by **comparison type**:

| Comparison (Zelazny / Abela) | Trigger words | Chart form |
|---|---|---|
| **Component / Composition** | "share," "% of total," "made up of" | Pie *(use sparingly)* or 100% stacked bar; waterfall if it builds |
| **Item / Comparison** | "larger than," "ranks," "vs." | Horizontal **bar** (ranking) |
| **Time series** | "grew," "trend," "declined" | **Column** (few periods) / **Line** (many) |
| **Frequency / Distribution** | "spread," "range," "concentration" | Histogram / scatter |
| **Correlation / Relationship** | "relates to," "the more… the more" | **Scatter** (2 vars) / **bubble** (3 vars) |

- **Bar = items ranked; Column = change over time.** Keep the convention strict; don't mix in one panel.
- Bar + column + line cover ~80–90% of needs; reach for pie/scatter only on genuine component/correlation claims.
- **Pie caution:** McKinsey-school practice effectively avoids pies (the eye reads angles poorly) — a 100%-stacked bar usually beats a pie for share. (This is a McKinsey *culture* position, not a Zelazny rule; Zelazny permits pies for true component messages.)

### Rule 10 — Elevator test + 80/20 + ghost-deck process (McKinsey Way)
- **Elevator test:** if you can't state the panel's point in ~30 seconds, it's saying too much. The action title *is* your elevator pitch.
- **80/20 lens:** hunt the 80/20 in any dataset — it's inherently a strong, shareable message (20% of SKUs = 80% of revenue).
- **Ghost-deck process:** draft **all action titles** across a content series first (titles-only skeleton), validate the storyline, *then* build the graphics.

---

## PART 3 — VERIFICATION FLAGS

What I could and couldn't confirm:

- **Trademarks — reproduce idea-shape, not trade dress:** "Magic Quadrant," "Hype Cycle" (Gartner), "Stage-Gate" (Cooper), "RAPID," "Results Delivery" (Bain) are registered marks. Gartner protects its formats aggressively. For content, clone the *idea-shape* with original labels/styling and framing; never imply endorsement.
- **"Ghost chart" — two meanings:** (a) the gray-comparison render (focal series colored, rest greyed) — the rendering-relevant one used above; (b) a draft "ghost/skeleton" placeholder slide used in storyboarding. Both are real consulting terms; confirm which is meant if it comes up.
- **"Elephant chart" — could NOT verify as a canonical Bain/NPS exhibit.** The well-documented "elephant curve" is the **Lakner–Milanovic global growth-incidence curve** (2013 economics) — % income growth (Y) across world income percentiles (X), elephant-shaped. NPS is better rendered as a **divergent stacked bar** (%Promoters − %Detractors around a center line). Treat the elephant curve as a *separate economics exhibit*, not a Bain format.
- **Adopter percentages** (2.5 / 13.5 / 34 / 34 / 16) are Rogers' standard-deviation partition of a normal curve — a modeling convention, not an empirical measurement of any specific technology.
- **Iceberg 20/80 split** and **experience-curve 20–30%/doubling** are illustrative conventions/typical ranges, not measured constants — vary to your data.
- **BCG axis thresholds** (relative share split at 1.0×, growth ~10%) and the **share-axis reversal** (high share on the left) are corroborated conventions.
- **Zelazny's exact trigger-word lists** and **Abela's deepest leaf charts** (variable-width column, 3D area) are corroborated across secondary summaries but not primary-source-verified — the top-level frameworks are solid; the finest leaves rely on secondary sources.
- **The "McKinsey bans pie charts" claim** is a culture/practice position (per StrategyU), not a rule from Zelazny, who permits pies for genuine component messages.
- **Method note:** all data gathered via WebSearch result summaries cross-checked across multiple independent sources. **WebFetch was blocked (HTTP 403)** on several primary targets (Zelazny/Abela PDFs, Gartner paywalled pages, several blogs) due to per-site anti-bot user-agent blocking — the proxy itself was healthy. No claim above rests on a single source.

---

### Primary sources consulted (selected)
McKinsey Three Horizons (*The Alchemy of Growth*); Gartner [Magic Quadrant](https://www.gartner.com/en/research/methodologies/magic-quadrants-research) & [Hype Cycle](https://www.gartner.com/en/research/methodologies/gartner-hype-cycle) methodologies; [Harvey balls (Wikipedia)](https://en.wikipedia.org/wiki/Harvey_balls) + [Braithwaite history](https://gobraithwaite.com/thinking/a-brief-history-of-harvey-balls/); [Porter's Value Chain (MindTools)](https://www.mindtools.com/ajhsltf/porters-value-chain/); [Kraljic Matrix (CIPS)](https://www.cips.org/intelligence-hub/supplier-relationship-management/kraljic-matrix); [Football field (Wall Street Prep)](https://www.wallstreetprep.com/knowledge/football-field-valuation-real-example-excel-template/); [Tornado diagram (Wikipedia)](https://en.wikipedia.org/wiki/Tornado_diagram); [Slope chart (Wikipedia)](https://en.wikipedia.org/wiki/Slope_chart); [TCO Iceberg (Supply Chain Today)](https://www.supplychaintoday.com/total-cost-of-ownership-tco-iceberg-model-and-80-20-principle/); [Rogers Diffusion (Umbrex)](https://umbrex.com/resources/frameworks/strategy-frameworks/rogers-diffusion-of-innovations-curve/); Zelazny *Say It With Charts*; Rasiel *The McKinsey Way*; Minto *The Pyramid Principle* ([McKinsey alumni interview](https://www.mckinsey.com/alumni/news-and-events/global-news/alumni-news/barbara-minto-mece-i-invented-it-so-i-get-to-say-how-to-pronounce-it)); [Abela Chart Chooser](https://extremepresentation.com/wp-content/uploads/chart-chooser-2020.pdf); action-title craft ([Slideworks](https://slideworks.io/resources/how-to-write-action-titles-like-mckinsey), [SlideScience](https://slidescience.co/action-titles/)).
