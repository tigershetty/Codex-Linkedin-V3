# Layout & Framework Intelligence

**Version:** 1.0 · **Created:** 2026-06-20 · **For:** Shetty's Desk infographic engine (Supply Chain 101 + AI for Supply Chain)
**Purpose:** A permanent layout/framework *selector*. For every topic, pick the single best-matching visual layout instead of defaulting to one (e.g. the 4-card grid). This file benchmarks the top ~200 visual layouts and frameworks used in professional infographics and consulting decks, scores each for HTML/CSS/GSAP code-render feasibility, and maps the high-impact ones to supply-chain use.

## How to use this file

1. **Start at §1 — The Selector.** Read the concept you're explaining ("this is a *trade-off*", "this is a *hidden cost*", "this is a *sequence*") and jump to the matching layout.
2. **Confirm against §2 — Catalog.** Each row has: what it explains best · the question it answers · anatomy · visual-rhetoric (why the shape persuades) · render feasibility · source. Use this to verify the shape *argues* the point, not just decorates it.
3. **Sanity-check against §3 — Consulting benchmark** for credibility/conventions (action titles, MECE, Harvey balls, etc.).
4. **For the code-render pipeline (AI for SC),** go to §4 — the shortlist of patterns that are both high-impact and Easy/Medium to build in HTML/CSS/GSAP, mapped to SC use cases and cross-referenced to our 50-format library in `ai-for-sc-visual-dna.md`.

**Engine constraints assumed throughout:** HTML→PNG via Playwright/Chrome (deterministic, seek-safe), optional GSAP for animated GIF/MP4, brand = azure-blue + eco-green on white, Poppins, mobile-legible (≥14px), 1:1 or portrait. "Feasibility" is rated for *this* stack:
- **Easy** = flexbox/grid + borders/backgrounds + simple SVG; no math.
- **Medium** = SVG paths/`clip-path`/CSS transforms (3D, isometric), some geometry, GSAP timeline.
- **Hard** = layout algorithms (force-directed, Sankey routing, treemap squarify, Voronoi) or dense data binding — usually needs a JS lib (d3) at render time.

**The one rule:** the layout must *make the argument*. A funnel claims "narrowing/conversion"; a pyramid claims "foundation/hierarchy"; a matrix claims "two independent trade-offs"; a waterfall claims "contribution/bridge"; an iceberg claims "hidden mass." If the shape's built-in claim is false for your topic, the layout is wrong even if it looks good.

---

## 1. The Selector — "If the concept is ___ → use ___"

Primary decision table. Read the *nature of the idea*, pick the layout. Render feasibility in brackets: [E]asy / [M]edium / [H]ard for our HTML/CSS/GSAP stack.

### A. By the shape of the idea

| If the concept is… | The argument you're making | Use this layout | Avoid |
|---|---|---|---|
| A **sequence / process** (order matters) | "Do A, then B, then C" | Process flow / pipeline [E], Numbered steps [E], Swimlane if multi-actor [M] | Pie, matrix |
| A **cycle** (no start/end, self-reinforcing) | "It loops / compounds" | Cycle/loop ring [E], Flywheel [M], Infinity loop [M] | Linear flow |
| A **hierarchy / foundation** | "B rests on A" | Pyramid/triangle [E], Stacked building blocks [E], Tree/org chart [E] | Funnel |
| A **narrowing / filtering / conversion** | "Many in, few out" | Funnel [E], Triage funnel [E] | Pyramid (inverts the claim) |
| A **progression / levels of maturity** | "Where are you on the ladder?" | Maturity ladder / staircase [E], Spectrum/continuum [E] | 2×2 |
| **Two independent trade-offs** | "Position by X and Y" | 2×2 matrix / quadrant [E], Scatter if many points [M] | Bar chart |
| A **ranking / leaderboard** | "Who's #1" | Ordered bar / lollipop [E], Ranked cards [E] | Pie |
| **Part-to-whole (one moment)** | "These pieces make the whole" | Stacked bar [E], Donut [E], Treemap [H], Waffle/unit [E] | Line |
| **Contribution / build-up / bridge** | "Start → +/− moves → end" | Waterfall / bridge [E] | Pie |
| **Hidden vs visible cost** | "The real cost is below the surface" | Iceberg [E], Cost anatomy cross-section [M] | Bar chart |
| A **comparison of 2–4 options** | "A vs B on these criteria" | Comparison table / scorecard [E], Before/after split [E], Harvey-ball matrix [E] | Venn |
| A **transformation (then → now)** | "It changed from X to Y" | Before/after split [E], Slope chart [E] | Two pies |
| **Overlap / shared attributes** | "These share a middle" | Venn (2–3 circles) [E] | Matrix |
| A **central concept with satellites** | "X connects to many things" | Hub-and-spoke / radial [E], Mind map [M] | Timeline |
| **Flow of volume between states** | "X amount moves from A to B" | Sankey [H], Chord [H], Network map [H] | Bar |
| A **decision / branching logic** | "If this, then that" | Decision tree [M], Flowchart [M] | Pyramid |
| **Change over time (trend)** | "It rises/falls/cycles" | Line [E], Area [E], Column-over-time [E], Connected scatter [M] | Pie |
| **A schedule / plan over time** | "What happens when" | Timeline/roadmap [E], Gantt [M], Calendar grid [E] | Funnel |
| **An anatomy / how-it's-built** | "Here are the parts and labels" | Labelled diagram / exploded view / call-outs [M] | Bar |
| **A single number that matters** | "This figure is the point" | Big-number stat / metric card [E], Formula card [E] | Table |
| **Distribution / spread / outliers** | "Most cluster here; outliers there" | Histogram [E], Box/violin [M], Dot strip [E], Beeswarm [H] | Pie |
| **Concentric containment / scope** | "Inner depends on outer" | Concentric rings / onion / target [E] | Funnel |
| **A driver/value tree** | "This metric = these levers" | Driver tree / formula tree [M], Issue tree [E] | Pie |
| **Risk / prioritization** | "High-impact, high-likelihood = act" | Risk matrix (2×2 with plotted dots) [M], Impact–effort [E] | Timeline |
| **A reference / cheat-sheet** | "Here's everything in one grid" | Cheat-sheet grid / reference card [E], Periodic-table layout [E] | Single chart |
| **Cause-and-effect (root cause)** | "These causes feed the problem" | Fishbone / Ishikawa [M], Why-tree [E] | Pie |
| **A journey / experience over stages** | "The customer/order moves through stages" | Journey map [M], Pipeline [E] | Pie |
| **A spectrum between two poles** | "It sits between extremes" | Continuum / slider scale [E], Diverging bar [E] | Pyramid |

### B. By the *question the audience asks* (data-viz canon — FT Visual Vocabulary)

| The question | Family | Go-to chart(s) [feasibility] |
|---|---|---|
| "How do these *compare* in size?" | **Magnitude** | Column/bar [E], paired bar [E], lollipop [E], isotype/pictogram [E], radar [M] |
| "What's the *trend* over time?" | **Change over time** | Line [E], area [E], column-time [E], slope [E], fan/projection [M], calendar heatmap [M] |
| "How is the whole *divided*?" | **Part-to-whole** | Stacked bar [E], pie/donut [E], treemap [H], waffle [E], Marimekko [M], waterfall [E] |
| "Where does it *rank*?" | **Ranking** | Ordered bar/column [E], dot-strip [E], slope [E], lollipop [E] |
| "How far from a *benchmark*?" | **Deviation** | Diverging bar [E], surplus/deficit area [M], spine [E] |
| "How are values *spread*?" | **Distribution** | Histogram [E], box [M], violin [M], population pyramid [E], dot-strip [E], beeswarm [H] |
| "Do two variables *relate*?" | **Correlation** | Scatter [M], bubble [M], connected scatter [M], XY heatmap [M] |
| "How much *moves* between states?" | **Flow** | Sankey [H], chord [H], network [H], waterfall [E] |
| "What's the *geographic* pattern?" | **Spatial** | Choropleth [H], proportional-symbol map [M], flow map [H], cartogram [H] |

> Sources: FT Visual Vocabulary (9 families) and Abela's "Chart Chooser" (Comparison / Composition / Distribution / Relationship) — see §3 and Sources.

### C. Quick reverse-lookup (supply-chain trigger words → layout)

| SC trigger | Layout | Our 50-format match |
|---|---|---|
| "should-cost / TCO / landed cost" | Cost anatomy cross-section, Iceberg | Format 6, 12 |
| "savings breakdown / variance by component" | Waterfall bridge | Format 9 |
| "working-capital / DIO-DSO-DPO" | Bridge (two-state) | Format 11 |
| "SKU / supplier segmentation" | 2×2 matrix | Format 20 |
| "carrier / supplier / tool comparison" | Scorecard table (+ Harvey balls) | Format 18 |
| "risk register" | Risk 2×2 with plotted dots | Format 43 |
| "supplier health (multi-dimension)" | Radar / spider | Format 44 |
| "exception triage / inbox" | Funnel | Format 33 |
| "workflow where AI intervenes at one step" | Numbered step flow (highlight one) | Format 34 |
| "orders/docs through gates" | Pipeline | Format 35 |
| "safety stock / reorder point" | Stacked level / inventory stack | Format 40 |
| "demand = trend + seasonality + noise" | Stacked decomposition bands | Format 22 |
| "leading indicators → outcome" | Network / correlation map | Format 24 |
| "bottleneck / constraint" | Narrowing channel | Format 48 |
| "maturity of capability" | Maturity ladder / staircase | (new — add) |
| "payback / breakeven" | Cumulative line crossing zero | Format 8 |
| "S&OP cadence / planning calendar" | Calendar grid / roadmap | Format 30 |

---

## 2. Catalog by family

Format of each row: **Name** | Explains best | Question it answers (when) | Anatomy/structure | Visual-rhetoric (why it persuades) | Render [E/M/H] | Source/firm.

### Family 1 — Slide & infographic LAYOUT archetypes

| # | Name | Explains best | When to use | Anatomy | Visual-rhetoric | Render | Source |
|---|---|---|---|---|---|---|---|
| 1 | **Hierarchy pyramid / triangle** | Layered hierarchy, foundations | "What rests on what?" | Horizontal bands stacked, widest at base | Base = foundation; apex = goal; gravity implies stability/dependency | E | Maslow; SmartArt |
| 2 | **Inverted pyramid** | Filtering to essence; narrowing detail | "From broad to specific" | Triangle apex-down, bands narrowing | Downward taper = distillation/priority | E | Journalism inverted pyramid |
| 3 | **Maturity ladder / staircase** | Progression through stages, self-location | "What level are we at?" | Ascending steps, each labelled | Each step = a gained capability; rising = improvement | E | Capability maturity model |
| 4 | **Funnel (conversion)** | Narrowing volume across stages | "How many survive each stage?" | Stacked trapezoids shrinking downward | Narrowing = loss/selection; implies optimization opportunity | E | Marketing/sales funnel |
| 5 | **Inverted funnel (amplify)** | Growth/expansion from a seed | "How does it scale out?" | Trapezoids widening downward | Widening = amplification/reach | E | Growth marketing |
| 6 | **2×2 matrix / quadrant** | Position on two independent axes | "Where does it sit on X and Y?" | Cross axes, 4 named quadrants, items plotted | Two orthogonal axes imply independence; quadrant names = prescriptions | E | BCG; Eisenhower |
| 7 | **3×3 / nine-box grid** | Finer position than 2×2 | "Which of nine cells?" | 3×3 grid, cells named | More granularity = nuance/credibility | E | GE-McKinsey |
| 8 | **Hub-and-spoke / radial** | Central concept + satellites | "What connects to the core?" | Center node, radiating arms to leaf nodes | Center = primacy; spokes = dependency on core | E | Mind-map; SmartArt radial |
| 9 | **Spider/web hub** | Many peripheral items orbiting | "What surrounds X?" | Concentric arrangement, central anchor | Encirclement = comprehensiveness | E | Concept poster |
| 10 | **Timeline (horizontal)** | Chronology of events | "What happened when?" | Horizontal axis, dated markers/cards | Left→right = past→future; spacing = duration | E | Priestley timeline |
| 11 | **Timeline (vertical)** | Chronology in feed/mobile | "Sequence, scrollable" | Vertical spine, alternating cards | Top→bottom = earlier→later | E | Vertical infographic |
| 12 | **Snake / winding timeline** | Long sequence in compact space | "Many steps, fits 1:1" | S-curving path with nodes | Path implies a journey; folds save space | M | Roadmap infographic |
| 13 | **Roadmap** | Plan of phases toward a goal | "What's the plan ahead?" | Lane(s) with milestones over time horizons | Road metaphor = direction/destination | E | Product roadmap |
| 14 | **Process flow / pipeline** | Linear ordered steps | "What's the order of operations?" | Boxes + arrows left→right | Arrows = causation/sequence | E | Flowchart |
| 15 | **Flowchart (branching)** | Process with decisions | "What path given conditions?" | Boxes + diamonds (decisions) + arrows | Diamonds = choice points; logic made visible | M | ISO flowchart |
| 16 | **Swimlane diagram** | Process across actors/depts | "Who does what, when?" | Horizontal lanes per actor, steps within | Lanes = ownership; hand-offs visible | M | BPMN swimlane |
| 17 | **Waterfall / bridge** | Build-up of a total from parts | "How do we get from start to end?" | Floating bars stepping up/down to a total | Floating bars = incremental contribution | E | McKinsey/BCG bridge |
| 18 | **Sankey diagram** | Flow magnitudes between states | "How much goes where?" | Nodes + proportional-width ribbons | Ribbon width = volume; conservation of flow | H | Minard; energy flow |
| 19 | **Chord diagram** | Bidirectional flows among nodes | "Who exchanges with whom?" | Circle of nodes + arcs sized by flow | Circular = closed system; arcs = relationships | H | d3 chord |
| 20 | **Iceberg** | Hidden vs visible mass | "What's below the surface?" | Tip above waterline, larger mass below | Submerged bulk = hidden cost/risk | E | Iceberg metaphor |
| 21 | **Comparison / versus** | Two options head-to-head | "A or B?" | Two columns, mirrored attributes | Symmetry forces direct comparison | E | Versus infographic |
| 22 | **Comparison table / scorecard** | Many options × criteria | "Which scores best?" | Grid: options × criteria, cell values/marks | Grid = objectivity; winner row highlighted | E | Consulting scorecard |
| 23 | **Cheat-sheet grid** | Dense reference in one view | "Everything at a glance" | Uniform card grid, each a fact | Density = completeness/save-value | E | Reference card |
| 24 | **Periodic-table layout** | Categorized item taxonomy | "All the items, grouped" | Element-cell grid, colour-coded groups | Borrows science authority; implies completeness | E | Periodic Table of X |
| 25 | **Anatomy / labelled diagram** | Parts of a thing | "What are the components?" | Central object + leader lines to labels | Call-outs = expert annotation | M | Exploded diagram |
| 26 | **Exploded view** | Assembly / layered build | "How does it fit together?" | Object parts separated along an axis | Separation = reveals internal structure | M | Engineering drawing |
| 27 | **Decision tree** | Sequential decisions to outcomes | "Which outcome do I reach?" | Root node branching to leaves | Branching = exhaustive logic; trace a path | M | CART; flow logic |
| 28 | **Venn diagram (2)** | Overlap of two sets | "What do they share?" | Two overlapping circles | Intersection = the shared truth | E | Set theory |
| 29 | **Venn diagram (3)** | Three-way overlap / sweet spot | "What's the sweet spot?" | Three circles, central intersection | Center = the rare ideal | E | Ikigai/3-circle |
| 30 | **Euler diagram** | Subset/containment of sets | "Is A inside B?" | Nested non-overlapping circles | Containment = "is a kind of" | E | Logic |
| 31 | **Mind map** | Idea expansion from a center | "What branches from this?" | Central node, organic branches | Organic = brainstorm/comprehensiveness | M | Buzan mind map |
| 32 | **Concept map** | Linked concepts with verbs | "How do concepts relate?" | Nodes + labelled link verbs | Labelled links = explicit reasoning | M | Novak concept map |
| 33 | **Gantt chart** | Tasks scheduled over time | "What runs in parallel and when?" | Rows = tasks, horizontal bars over time axis | Bar length/overlap = duration/parallelism | M | Gantt |
| 34 | **Dashboard / KPI grid** | Multiple metrics at a glance | "How are we doing overall?" | Grid of KPI cards (value + trend) | Compact dense panel = control/oversight | E | BI dashboards |
| 35 | **Big-number / stat card** | A single key figure | "What's the headline number?" | Huge numeral + tiny caption | Scale = importance; one thing to remember | E | Stat infographic |
| 36 | **Formula / equation card** | A calculation made legible | "How is it computed?" | Equation typeset + variable callouts | Showing the math = transparency/rigor | E | Metric card |
| 37 | **Ranked cards / leaderboard** | Ordered list of items | "Top N in order" | Numbered cards, descending | Rank numbers = competition/priority | E | Top-10 list |
| 38 | **Before/after split** | Transformation | "What changed?" | Two equal halves, mirrored elements | Mirror = isolates the delta | E | Before/after |
| 39 | **Then/now slider** | Same scene, two states | "Old vs new" | Two panels (or wipe) | Direct overlay = undeniable change | E | Comparison slider |
| 40 | **Cycle / loop ring** | Repeating process | "What goes around?" | Circular arrows, 3–6 stages | No endpoint = ongoing/self-sustaining | E | Cycle diagram |
| 41 | **Infinity loop** | Two interlocked cycles | "How do two loops feed each other?" | Figure-8 with stages | Crossover = mutual reinforcement | M | DevOps infinity |
| 42 | **Flywheel** | Self-reinforcing momentum | "What compounds growth?" | Wheel with sequential pushes | Spinning = momentum/compounding | M | Collins flywheel |
| 43 | **Stacked bar / column** | Composition across categories | "How is each split?" | Bars segmented by component | Segment height = share | E | Standard chart |
| 44 | **100% stacked bar** | Share comparison across groups | "How does the mix differ?" | All bars normalized to 100% | Equal heights isolate proportion | E | Standard chart |
| 45 | **Treemap** | Nested part-to-whole | "What's biggest within groups?" | Nested rectangles sized by value | Area = magnitude; nesting = hierarchy | H | Shneiderman treemap |
| 46 | **Waffle / unit chart** | Proportion as countable units | "What fraction, concretely?" | 10×10 grid of squares filled | Counting squares = tangible proportion | E | Pictogram grid |
| 47 | **Isotype / pictogram** | Quantity via repeated icons | "How many, relatably?" | Repeated icons, partial last | Icons = human-relatable counts | E | Neurath ISOTYPE |
| 48 | **Concentric rings / onion** | Layered scope/dependency | "What's at the core vs edge?" | Nested rings, core to outer | Inner = essential, outer = peripheral | E | Onion model |
| 49 | **Target / bullseye** | Focus / priority centering | "What's the center target?" | Concentric circles, center marked | Center = the goal/ideal | E | Target diagram |
| 50 | **Spectrum / continuum** | Position between two poles | "How extreme is it?" | Horizontal gradient bar + marker | Gradient = no hard categories | E | Continuum |
| 51 | **Slider scale** | A rating on a fixed range | "Where on the scale?" | Track + thumb at value | Thumb position = the verdict | E | UI slider |
| 52 | **Network / node-link** | Relationships among many entities | "Who connects to whom?" | Nodes + edges, layout by clustering | Clusters = communities; hubs = power | H | Graph viz |
| 53 | **Org chart / tree** | Reporting/containment hierarchy | "Who reports to whom?" | Top node branching down | Top = authority; depth = layers | E | Org chart |
| 54 | **Fishbone / Ishikawa** | Causes of an effect | "What causes the problem?" | Spine to effect, ribs = cause categories | Ribs feeding spine = converging causation | M | Ishikawa |
| 55 | **Why-tree (5 Whys)** | Root-cause drilldown | "What's the real cause?" | Chain of "why?" nodes | Drilldown = depth of analysis | E | Toyota 5 Whys |
| 56 | **Journey map** | Experience across stages | "What does the actor feel/do at each stage?" | Stages × layers (actions, emotions) | Stage-by-stage = empathy/holism | M | UX journey map |
| 57 | **Stepped staircase (up)** | Cumulative gains | "How do gains stack?" | Rising steps, cumulative | Climb = effort→reward | E | Staircase infographic |
| 58 | **Building blocks / stack** | Components assembled | "What's the stack?" | Blocks stacked vertically | Stacking = built-upon dependency | E | Tech-stack diagram |
| 59 | **Nested boxes / containment** | Scope within scope | "What contains what?" | Boxes inside boxes | Containment = membership/scope | E | Set containment |
| 60 | **Quote / callout card** | A single statement | "What's the takeaway line?" | Large quote + attribution | Whitespace = authority of the words | E | Quote graphic |
| 61 | **Checklist / do-don't** | Actionable list / contrasts | "What to do (and not)?" | Ticks vs crosses, two columns | Tick/cross = clear prescription | E | Checklist graphic |
| 62 | **Tip / numbered list** | Sequential advice | "Steps to follow" | Numbered rows | Numbers = order/completeness | E | Listicle |
| 63 | **Map / geographic overlay** | Spatial distribution | "Where, geographically?" | Map + markers/shading | Real geography = grounded credibility | M-H | Choropleth |
| 64 | **Heat map (grid)** | Intensity across two dimensions | "Where is it hottest?" | Grid of colour-coded cells | Colour intensity = magnitude at a glance | E | Heatmap |
| 65 | **Calendar grid** | Time-based plan/events | "What happens which week?" | Month/week grid with events | Familiar calendar = immediately usable | E | Calendar infographic |
| 66 | **Bracket / tournament** | Pairwise elimination | "Who wins head-to-head?" | Binary bracket converging to a winner | Convergence = a single victor | E | Tournament bracket |
| 67 | **Pyramid of needs (Maslow)** | Prioritized layered needs | "What's foundational vs aspirational?" | 5-tier triangle | Lower tiers prerequisite to higher | E | Maslow |
| 68 | **Iceberg-of-ignorance** | Visible vs hidden problems | "What leaders don't see" | Iceberg with org levels | Submerged = unsurfaced issues | E | Sidney Yoshida |
| 69 | **Diverging bar (deviation)** | +/- from a reference | "Who's above/below baseline?" | Bars left/right of a zero line | Split at zero = winners/losers | E | FT Visual Vocab |
| 70 | **Population pyramid** | Two-sided distribution | "How do two groups compare by band?" | Mirrored horizontal bars | Mirror = symmetric comparison | E | Demography |
| 71 | **Slope chart** | Change between two points | "Up or down, and rank shifts?" | Two axes + connecting lines | Line slope = direction; crossings = rank change | E | Tufte slopegraph |
| 72 | **Connected scatter** | Two variables over time | "How do X and Y co-move?" | Scatter points connected in time order | Path = trajectory through state space | M | FT Visual Vocab |
| 73 | **Bubble chart** | Three variables (x,y,size) | "Position + magnitude" | Scatter with sized bubbles | Bubble size = third dimension | M | Gapminder |
| 74 | **Radar / spider chart** | Multi-attribute profile | "What's the shape of strengths?" | Polar axes, polygon connecting values | Polygon shape = profile gestalt | M | Radar |
| 75 | **Bullet graph** | KPI vs target with bands | "On target or not?" | Bar + target tick + qualitative bands | Tick vs bar = pass/fail at a glance | E | Few bullet graph |
| 76 | **Gauge / dial** | Single value on a range | "How full / how fast?" | Semicircle dial + needle | Needle in red zone = alarm | M | Dashboard gauge |
| 77 | **Sparkline grid** | Many micro-trends | "Trend per item, compactly" | Tiny line per row | Compact lines = pattern scanning | E | Tufte sparkline |
| 78 | **Pictorial fraction** | A proportion as an icon | "X in N are…" | Row of icons, some filled | Filled icons = relatable share | E | Isotype |
| 79 | **Stepped pyramid (layers+steps)** | Hierarchy you climb | "Levels you ascend" | Pyramid drawn as steps | Climb + tier = effortful progression | M | Hybrid |
| 80 | **Matrix grid / bingo card** | Taxonomy of combinations | "All combinations laid out" | N×M labelled grid | Grid = systematic coverage | E | Taxonomy grid |

### Family 2 — Consulting / strategy FRAMEWORKS (the named models)

| # | Name | Explains best | When to use | Anatomy | Visual-rhetoric | Render | Source/firm |
|---|---|---|---|---|---|---|---|
| 81 | **Minto Pyramid Principle** | Top-down argument structure | "Lead with the answer" | Governing thought → key line → support, MECE | Answer-first = executive clarity | E (as layout) | Minto/McKinsey [CFI: scqa] |
| 82 | **SCQA storyline** | Framing a problem narrative | "Set up the question" | Situation–Complication–Question–Answer | Tension→resolution arc | E | Minto [CFI: scqa] |
| 83 | **Action title (slide)** | One slide = one assertion | "What's the 'so what'?" | Full-sentence takeaway headline + supporting exhibit | Title states conclusion, body proves it | E | McKinsey/BCG convention |
| 84 | **Ghost deck / storyboard** | Argument skeleton before data | "Plan the logic first" | Empty slides w/ action titles only | Logic before evidence = rigor | E | Consulting workflow |
| 85 | **MECE buckets** | Exhaustive non-overlapping split | "Have we covered everything?" | Parallel labelled buckets | No gaps/overlaps = completeness | E | McKinsey |
| 86 | **Issue tree** | Decompose a question | "What sub-questions matter?" | Root question → branches | Branching = structured problem-solving | E | McKinsey |
| 87 | **Logic / hypothesis tree** | Test a hypothesis | "What must be true?" | Hypothesis → supporting sub-claims | Tree = falsifiable structure | E | McKinsey |
| 88 | **Driver / value-driver tree** | Decompose a metric into levers | "What moves this KPI?" | KPI = factors, multiplied/added down the tree | Math decomposition = where to act | M | McKinsey/Bain |
| 89 | **BCG growth-share matrix** | Portfolio prioritization | "Invest, milk, or divest?" | Market growth × relative share; Stars/Cows/?/Dogs | Quadrant labels = portfolio prescription | E | BCG 1970 [CFI: bcg-matrix] |
| 90 | **GE-McKinsey nine-box** | Portfolio (finer) | "Industry attractiveness × strength" | 3×3 grid, invest/hold/harvest | More cells = nuanced investment logic | E | GE/McKinsey [CFI: strategic-analysis] |
| 91 | **Ansoff matrix** | Growth strategy choice | "New/old product × market?" | 2×2: penetration/dev/dev/diversify | Quadrants = risk-graded growth paths | E | Ansoff 1957 [CFI: ansoff-matrix] |
| 92 | **Eisenhower matrix** | Prioritization | "Urgent × important?" | 2×2: do/schedule/delegate/delete | Quadrant = action prescription | E | Eisenhower |
| 93 | **Impact–effort matrix** | Quick-win prioritization | "What's worth doing first?" | 2×2: impact × effort; quick wins top-left | Quick-wins quadrant = obvious start | E | Agile/lean |
| 94 | **Risk matrix (probability×impact)** | Risk ranking | "Which risks first?" | 2×2/5×5, severity colour bands | Top-right red = act now | M | ISO 31000 |
| 95 | **Porter generic strategies** | Competitive positioning | "Cost or differentiation, scope?" | 2×2: advantage × scope | Quadrant = strategic identity | E | Porter |
| 96 | **Porter's Five Forces** | Industry attractiveness | "How profitable is this industry?" | Central box + 4 surrounding forces | Surrounding pressures = squeeze on profit | E | Porter (1979) |
| 97 | **Porter value chain** | Where value is created | "Which activities add value?" | Primary activities arrow + support rows; margin tail | Arrow toward margin = value accumulation | M | Porter (1985) |
| 98 | **McKinsey 7S** | Org alignment | "Are the 7 elements aligned?" | Hub-and-spoke of S's around shared values | Interconnection = holistic alignment | E | McKinsey/Peters-Waterman |
| 99 | **Three Horizons of Growth** | Innovation portfolio over time | "Balance core vs future?" | Three overlapping S-curves over time | Successive curves = sustained growth | M | McKinsey (Baghai et al.) |
| 100 | **S-curve** | Adoption / maturity lifecycle | "Where on the lifecycle?" | Sigmoid: slow–fast–plateau | The plateau warns of saturation | E | Diffusion theory |
| 101 | **Experience / learning curve** | Cost declines with volume | "Does scale cut cost?" | Downward log-log curve | Falling line = scale advantage | E | BCG |
| 102 | **Collins flywheel** | Compounding momentum | "What self-reinforces?" | Wheel of reinforcing steps | Momentum metaphor = inevitability | M | Jim Collins |
| 103 | **Marimekko / Mekko chart** | Two-dimensional market map | "Segment size × share within?" | Variable-width stacked columns | Both axes encode value = dense market view | M | BCG/Mars [CFI: types-of-graphs] |
| 104 | **Waterfall / bridge (consulting)** | Variance/contribution bridge | "What drives the change A→B?" | Floating bars + connectors | Each bar = a driver of the gap | E | McKinsey/BCG [CFI: waterfall-chart-template] |
| 105 | **Football-field chart** | Valuation range overlap | "What's the value range?" | Horizontal bars per method, overlap zone | Overlap = defensible value range | E | IB valuation [CFI: ballpark-figure] |
| 106 | **Harvey balls** | Qualitative comparison | "How well on each criterion?" | Pie-fraction icons (0–4/4) in a grid | Fill level = quick ordinal rating | E | Poppel/Booz Allen [CFI: types-of-graphs] |
| 107 | **RACI matrix** | Roles & responsibilities | "Who's R/A/C/I?" | Tasks × people grid, R/A/C/I cells | Grid = unambiguous ownership | E | PM convention |
| 108 | **Heat map (RAG)** | Status across dimensions | "Where's red?" | Grid of red/amber/green cells | Traffic-light = instant triage | E | Consulting status |
| 109 | **Tornado diagram** | Sensitivity ranking | "Which input matters most?" | Horizontal bars sorted by swing | Widest bar on top = biggest lever | E | Decision analysis |
| 110 | **Spider/radar (capability)** | Capability vs benchmark | "Where are the gaps?" | Polar axes, current vs target polygons | Gap between polygons = improvement area | M | Consulting benchmark |
| 111 | **Stage-gate** | Phased approval process | "What gate are we at?" | Phases separated by decision gates | Gates = disciplined go/no-go | E | Cooper stage-gate |
| 112 | **Capability maturity model** | Maturity assessment | "What level (1–5)?" | 5 ascending stages with criteria | Levels = an aspirational ladder | E | CMM/CMMI |
| 113 | **Value pool / profit pool** | Where profit concentrates | "Where's the money?" | Width=revenue, height=margin bars | Area = profit concentration | M | Bain |
| 114 | **Customer journey funnel (AARRR)** | Lifecycle metrics | "Where do users drop?" | Funnel: acquisition→revenue→referral | Drop-off at each stage = leak | E | Pirate metrics |
| 115 | **Kraljic matrix** | Procurement category strategy | "How to manage this spend?" | 2×2: supply risk × profit impact | Quadrant = sourcing strategy | E | Kraljic (procurement) |
| 116 | **Ansoff-style risk ladder** | Escalating strategic risk | "How risky is each move?" | Steps of increasing risk | Higher step = bigger bet | E | Strategy |
| 117 | **PESTLE wheel** | Macro-environment scan | "What external forces?" | Hub + 6 factor segments | Encircling factors = comprehensive scan | E | Strategy |
| 118 | **SWOT 2×2** | Internal/external assessment | "Strengths/weaknesses/opps/threats?" | 4-quadrant grid | Quadrants = balanced self-assessment | E | Strategy classic |
| 119 | **VRIO** | Resource-based advantage test | "Is this resource an advantage?" | Sequential yes/no flow | Gauntlet of tests = rigorous filter | E | Barney |
| 120 | **Balanced scorecard** | Multi-perspective performance | "Are all 4 perspectives healthy?" | 4 linked quadrants (financial/customer/process/learning) | Linkage = cause-effect of strategy | M | Kaplan-Norton |
| 121 | **Strategy map** | Linked strategic objectives | "How do objectives cause results?" | Layered objectives + arrows | Upward arrows = value causation | M | Kaplan-Norton |
| 122 | **Business Model Canvas** | Whole business on one page | "How does the business work?" | 9-block fixed grid | One-page completeness = systemic view | E | Osterwalder |
| 123 | **Value Proposition Canvas** | Fit between product & needs | "Does it fit the customer?" | Two halves: profile vs value map | Two-side fit = product-market logic | M | Osterwalder |
| 124 | **McKinsey Three Horizons (lanes)** | Initiative portfolio by horizon | "Balance now/next/future?" | Three time-lanes with initiatives | Lanes = deliberate future-proofing | E | McKinsey |
| 125 | **Wardley map** | Strategic landscape & evolution | "What's evolving toward commodity?" | Value chain (y) × evolution (x) | Movement rightward = commoditization | H | Simon Wardley |
| 126 | **OKR tree** | Objectives → key results | "How do goals cascade?" | Objective node → measurable KRs | Cascade = alignment top-to-bottom | E | OKR method |
| 127 | **Hoshin X-matrix** | Strategy deployment | "How do goals/tactics/metrics link?" | X-shaped 4-quadrant correlation matrix | Cross-correlation = tight alignment | M | Lean/Hoshin |
| 128 | **DuPont analysis tree** | ROE decomposition | "What drives return on equity?" | ROE = margin × turnover × leverage tree | Multiplicative tree = financial levers | M | DuPont |
| 129 | **Cynefin framework** | Sense-making by complexity | "Simple, complicated, complex, chaotic?" | 4 domains + center disorder | Domains = matched decision style | E | Snowden |
| 130 | **Two-by-two scenario matrix** | Scenario planning | "What futures under 2 uncertainties?" | 2×2 of critical uncertainties, named worlds | Four named worlds = robust planning | E | Shell scenarios |
| 130a | **Governing thought** | The one apex idea a deck must prove | "If they remember one sentence, what?" | Single declarative thesis above all support | Everything below becomes 'proof' | E | Minto [CFI: scqa] |
| 130b | **Hypothesis tree** | Hypothesis-driven workplan | "What would prove our hunch?" | Top hypothesis → sub-hypotheses → tests | Front-load answer, then disprove = speed | E | McKinsey [CFI: strategic-problem-solving] |
| 130c | **Horizontal/vertical logic check** | Deck coherence audit | "Do titles flow; does each slide prove its title?" | Vertical (slide proves title) + horizontal (titles tell story) | Auditable argument chain | E | Minto |
| 130d | **TAM–SAM–SOM** | Market sizing | "How big is the realistic opportunity?" | Concentric circles: total → serviceable → obtainable | Nested narrowing = credible, conservative claim | E | VC convention [CFI: som] |
| 130e | **Hedgehog concept** | Strategic focus sweet-spot | "What should we singularly focus on?" | 3 circles: passion × best-in-world × economic engine | Intersection = disciplined focus | E | Collins [CFI: organic-growth] |
| 130f | **Crossing the Chasm / adoption curve** | Tech go-to-market sequencing | "How to cross from early adopters to mainstream?" | Bell curve of adopters with a 'chasm' gap | The chasm dramatizes GTM risk | M | Moore / Rogers |
| 130g | **Blue Ocean strategy canvas** | Differentiation away from rivals | "How to make competition irrelevant?" | Value curve across competitive factors vs rivals | Divergent curve = uncontested space | M | Kim & Mauborgne |
| 130h | **Pareto chart (80/20)** | Vital-few prioritization | "Which few causes drive most effect?" | Descending bars + cumulative % line at ~80% | 80/20 line justifies focusing on top bars | E | Pareto/Juran [CFI: types-of-graphs] |
| 130i | **Value stream map** | Process value vs waste | "Where is the waste in our flow?" | Material+info flow, cycle/lead times, inventory triangles | Quantified waste = lean target | M | Lean/TPS |
| 130j | **Kanban board** | Work-in-progress flow | "Where is each item in the pipeline?" | Columns by stage (To-do/Doing/Done) with cards | WIP flow exposes bottlenecks | E | Toyota/Agile |
| 130k | **Bullet chart** | KPI vs target with bands | "Are we hitting target?" | Bar + target tick over shaded ranges | Compact pass/fail KPI | E | Few [CFI: bullet-chart-guide] |
| 130l | **Sensitivity table (data table)** | Output across varying inputs | "How does the answer move with assumptions?" | 1- or 2-way grid, cells heat-shaded | Robustness = pre-empts 'what if you're wrong' | E | FP&A [CFI: npv] |
| 130m | **"So-what" insight box** | The conclusion stated for the reader | "What does this exhibit mean for us?" | Boxed callout stating the implication | Removes interpretation burden | E | Consulting convention |

### Family 3 — Data-viz chart canon (FT Visual Vocabulary + Abela)

| # | Name | Explains best | When to use | Anatomy | Visual-rhetoric | Render | Source |
|---|---|---|---|---|---|---|---|
| 131 | **Column chart** | Magnitude across few categories | "Compare sizes" | Vertical bars, categorical x | Height = quantity, baseline at zero | E | FT (Magnitude) |
| 132 | **Bar chart** | Magnitude with long labels | "Compare, many/long names" | Horizontal bars | Length = quantity | E | FT (Magnitude) |
| 133 | **Paired column/bar** | Two series compared | "A vs B per category" | Side-by-side bars | Adjacency = direct compare | E | FT (Magnitude) |
| 134 | **Lollipop chart** | Ranking, less ink | "Rank without heavy bars" | Stem + dot | Dot tip = the value, low clutter | E | FT (Ranking) |
| 135 | **Proportional symbol** | Magnitude via size | "Big differences in size" | Circles sized by value | Area = magnitude | E | FT (Magnitude) |
| 136 | **Line chart** | Trend over continuous time | "How does it move?" | Connected points over time | Slope = rate of change | E | FT (Change over time) |
| 137 | **Area chart** | Trend + cumulative volume | "Trend and total" | Filled line | Fill = accumulated magnitude | E | FT (Change over time) |
| 138 | **Stacked area** | Composition over time | "How does the mix evolve?" | Stacked filled bands | Band thickness over time = changing share | E | FT |
| 139 | **Fan chart (projection)** | Forecast with uncertainty | "What's the likely range?" | Central line + widening bands | Widening = growing uncertainty | M | FT (Change over time) |
| 140 | **Stock/OHLC chart** | Price ranges over time | "High/low/open/close?" | Candles/bars per period | Range marks = volatility | M | FT |
| 141 | **Calendar heatmap** | Daily intensity over a year | "Which days are hot?" | Grid of day-cells coloured | Density = seasonality/streaks | M | FT |
| 142 | **Histogram** | Distribution of one variable | "How are values spread?" | Bars over value bins | Shape = the distribution | E | FT (Distribution) |
| 143 | **Box plot** | Distribution summary | "Median, spread, outliers?" | Box (IQR) + whiskers + points | Compact 5-number summary | M | FT (Distribution) |
| 144 | **Violin plot** | Distribution density | "Where do values cluster?" | Mirrored density curve | Bulge = where mass concentrates | M | FT (Distribution) |
| 145 | **Dot strip plot** | Few values' spread/rank | "Spread of a small set" | Dots along an axis | Position = value, no clutter | E | FT (Distribution/Ranking) |
| 146 | **Barcode plot** | Dense 1-D distribution | "Every data point's value" | Thin ticks on an axis | Tick density = concentration | E | FT (Distribution) |
| 147 | **Cumulative curve (CDF)** | Cumulative share | "What % below threshold?" | Rising curve to 100% | Curve shape = inequality/coverage | E | FT (Distribution) |
| 148 | **Scatter plot** | Correlation of two variables | "Do they relate?" | Points in x–y plane | Cloud shape/slope = relationship | M | FT (Correlation) |
| 149 | **XY heatmap** | Density of 2-D relationship | "Where do pairs concentrate?" | Grid coloured by count | Hot cells = common combinations | M | FT (Correlation) |
| 150 | **Line + column combo** | Two metrics, different scales | "Volume and rate together" | Bars + overlaid line, dual axis | Two encodings = compound story | E | FT (Correlation) |
| 151 | **Pie chart** | Few-part composition (1 moment) | "Simple split of a whole" | Circle sliced by angle | Angle = share (use ≤5 slices) | E | FT (Part-to-whole) |
| 152 | **Donut chart** | Composition + center stat | "Split + a headline number" | Pie with hole for a number | Center label = the 'so what' | E | FT (Part-to-whole) |
| 153 | **Arc / semicircle** | Single proportion | "How far to goal?" | Half-donut progress | Sweep = completion | E | FT (Part-to-whole) |
| 154 | **Voronoi** | Region-of-influence partition | "Whose territory?" | Plane split into cells around seeds | Cells = nearest-dominance zones | H | FT (Part-to-whole) |
| 155 | **Gridplot** | Part-to-whole as a grid | "Share as countable cells" | Filled grid (waffle) | Counting = tangible proportion | E | FT (Part-to-whole) |
| 156 | **Surplus/deficit area** | Deviation over time | "Above or below baseline when?" | Filled area above/below zero | Coloured surplus vs deficit | M | FT (Deviation) |
| 157 | **Spine chart** | Two-direction composition | "Split each item two ways" | Bars diverging from center | Center split = paired share | E | FT (Deviation) |
| 158 | **Ordered proportional symbol** | Ranked magnitude | "Rank + size together" | Sized symbols in order | Size + order = double encoding | M | FT (Ranking) |
| 159 | **Parallel coordinates** | Many variables per item | "Multi-attribute patterns?" | Parallel axes + lines | Crossing lines = trade-offs | H | FT (Magnitude) |
| 160 | **Choropleth map** | Rate/ratio by region | "Geographic rate pattern?" | Regions shaded by value | Shading = regional intensity | H | FT (Spatial) |
| 161 | **Proportional-symbol map** | Counts by location | "Where are the big counts?" | Sized markers on a map | Size on geography = magnitude where | M | FT (Spatial) |
| 162 | **Flow map** | Movement between places | "What moves where?" | Lines/arrows on a map | Line weight = flow volume | H | FT (Spatial) |
| 163 | **Cartogram** | Value-distorted geography | "Size = value, not area" | Regions resized by value | Distortion = importance over land area | H | FT (Spatial) |
| 164 | **Dot density map** | Raw counts spatially | "Where do events occur?" | One dot per N events | Dot clustering = hotspots | M | FT (Spatial) |
| 165 | **Contour map** | Continuous spatial value | "Gradient over space" | Iso-lines / shading | Contours = terrain of the metric | H | FT (Spatial) |
| 166 | **Priestley timeline** | Durations of entities | "How long did each last?" | Horizontal bars on a time axis | Bar length/overlap = lifespan/era | E | FT (Change over time) |
| 167 | **Circle timeline** | Events sized over time | "When + how big?" | Time axis + sized circles | Size = event magnitude | E | FT (Change over time) |
| 168 | **Seismogram** | High-frequency change | "Volatility over time?" | Dense oscillating line | Amplitude = intensity | E | FT (Change over time) |
| 169 | **Bump chart** | Rank changes over time | "Who overtakes whom?" | Ranked lines crossing | Crossings = competitive shifts | M | Ranking-over-time |
| 170 | **Streamgraph** | Composition flow over time | "Organic share evolution" | Stacked area around a center axis | Flowing bands = shifting mix | M | NYT streamgraph |

### Family 4 — Additional infographic / explainer patterns (rounding to ~200)

| # | Name | Explains best | When to use | Anatomy | Visual-rhetoric | Render | Source |
|---|---|---|---|---|---|---|---|
| 171 | **Stat strip (3-up KPIs)** | Three headline numbers | "Top 3 figures" | Row of three big numbers | Triad = memorable summary | E | Infographic |
| 172 | **Step-by-step recipe card** | Procedure with inputs | "How to do it" | Ingredients + numbered steps | Recipe framing = followable | E | How-to |
| 173 | **Anatomy of a [thing]** | Labelled breakdown | "What's inside it?" | Object + numbered callouts | Dissection = expertise | M | Explainer |
| 174 | **Comparison spectrum** | Items along one axis | "Where does each fall?" | Axis with placed items | Placement = relative judgement | E | Continuum |
| 175 | **Layer cake / strata** | Stacked layers of a system | "What sits on what?" | Horizontal strata | Strata = dependency stack | E | Geology metaphor |
| 176 | **Cross-section cutaway** | Internal structure | "What's the internal makeup?" | Object sliced to reveal layers | Cut = hidden internals revealed | M | Cutaway diagram |
| 177 | **Pyramid funnel hybrid** | Hierarchy that narrows | "Levels that filter" | Triangle with stage labels | Tier + narrowing dual claim | E | Hybrid |
| 178 | **Matrix of icons (capability grid)** | Feature coverage | "Who has which features?" | Rows×cols of tick/cross icons | Coverage grid = completeness compare | E | Feature matrix |
| 179 | **Timeline + milestones combo** | Plan with key dates | "Path with checkpoints" | Line + flagged milestones | Flags = commitments | E | Roadmap |
| 180 | **Curved/road journey** | Multi-stage journey | "The road ahead" | Winding road with stops | Road = directional progress | M | Journey infographic |
| 181 | **Mountain / summit** | Effort toward a peak goal | "The climb to the goal" | Mountain with base-camps | Summit = the aspiration | M | Metaphor |
| 182 | **Bridge metaphor (gap)** | Closing a gap | "How to get across?" | Two cliffs + bridge of steps | Bridge = the plan to close gap | M | Metaphor |
| 183 | **Domino chain** | Cascading consequences | "One thing triggers the next" | Falling dominoes in sequence | Cascade = inevitability of chain | M | Metaphor |
| 184 | **Lever / fulcrum** | Disproportionate impact | "Small input, big output" | Lever pivoting on fulcrum | Mechanical advantage = leverage | M | Metaphor |
| 185 | **Scales / balance** | Trade-off weighing | "What outweighs what?" | Balance beam tilting | Tilt = which side wins | M | Metaphor |
| 186 | **Tug-of-war** | Opposing forces | "What pulls each way?" | Two sides pulling a line | Rope position = net balance | M | Metaphor |
| 187 | **Puzzle pieces** | Components that fit | "How parts complete a whole" | Interlocking pieces | Fit = integration/completeness | M | Metaphor |
| 188 | **Gears / cogs** | Interdependent mechanisms | "How parts drive each other" | Meshing gears | Meshing = interdependence | M | Metaphor |
| 189 | **Funnel + leaks** | Loss at each stage | "Where do we lose volume?" | Funnel with side leaks | Leaks = quantified loss points | M | Conversion |
| 190 | **Pyramid of evidence** | Strength of evidence levels | "How strong is the proof?" | Tiered triangle of evidence types | Apex = strongest evidence | E | EBM pyramid |
| 191 | **Concentric scope (org)** | Self → team → org → world | "What's in scope?" | Nested rings of scope | Outer rings = wider influence | E | Circle of influence |
| 192 | **Spectrum quadrant blend** | Two spectrums crossed | "Two continuous trade-offs" | Gradient-filled 2×2 | Continuous fill = no hard lines | M | Positioning |
| 193 | **Decision matrix (weighted)** | Scored option selection | "Which option wins on weighted criteria?" | Options×criteria with weights+scores | Weighted total = defensible pick | E | Pugh matrix |
| 194 | **Pugh / concept-selection** | Compare vs a baseline | "Better/same/worse than baseline?" | +/0/- grid vs reference | Net score = clear winner | E | Pugh |
| 195 | **Kano model** | Feature satisfaction types | "Which features delight?" | Curves: basic/performance/delight | Curve type = investment logic | M | Kano |
| 196 | **Eisenhower + flow hybrid** | Triage to action | "Sort then act" | 2×2 feeding action lanes | Sort→route = operational clarity | M | Productivity |
| 197 | **Sunburst** | Hierarchical part-to-whole | "Nested shares radially" | Concentric ring segments | Rings outward = deeper hierarchy | H | d3 sunburst |
| 198 | **Icicle diagram** | Hierarchy as nested bars | "Tree as proportional blocks" | Stacked nested rectangles | Block width = subtree size | M | d3 icicle |
| 199 | **Dendrogram** | Clustering hierarchy | "How do items group?" | Tree of merges by similarity | Merge height = dissimilarity | M | Clustering |
| 200 | **Alluvial diagram** | Category flows over stages | "How do groups re-sort over time?" | Sankey-like blocks across stages | Re-routing ribbons = regrouping | H | Alluvial |
| 201 | **Beeswarm** | Distribution without overlap | "Each point, packed" | Jittered non-overlapping dots | Packed dots = honest distribution | H | d3 beeswarm |
| 202 | **Waffle + small multiples** | Compare proportions across groups | "Mix per group, side by side" | Grid of mini-waffles | Repetition = honest comparison | E | Small multiples |
| 203 | **Small multiples (trellis)** | Same chart, many facets | "Compare the same view across groups" | Grid of identical mini-charts | Repetition isolates one variable | E | Tufte small multiples |
| 204 | **Tier list (S-A-B-C)** | Ranked categorical buckets | "Which tier does each fall in?" | Labelled rows, items placed | Tier rows = ordinal verdict | E | Tier-list meme/format |
| 205 | **Pros & cons / T-chart** | Trade-off weighing | "Do upsides beat downsides?" | Two columns: pros (+) vs cons (−) | Longer column 'wins' the verdict | E | Decision aid |
| 206 | **Progress bar / ring** | Completion toward a goal | "How far to 100%?" | Filled portion vs remaining | Empty remainder creates urgency | E | UI progress |
| 207 | **Gauge / speedometer** | Single value vs range | "In the green or red?" | Semicircle dial + needle | Needle in red = instant alarm | M | Dashboard |
| 208 | **Coxcomb / wind-rose (polar area)** | Cyclical magnitudes | "How do values vary around a cycle?" | Wedges from center, area = value | Radial suits periodic data; area dramatizes peaks | M | Nightingale |
| 209 | **Word cloud** | Term frequency/emphasis | "What themes dominate the text?" | Words sized by frequency, packed | Size = importance, gist at a glance | M | Text viz |
| 210 | **Modular / tiled poster** | Many facets of one topic | "All angles in one canvas" | Grid of independent content modules | Modular menu = high info-per-glance | E | Poster infographic |
| 211 | **Cluster / grouping diagram** | Categorized item sets | "What belongs together?" | Items inside labelled group bubbles | Grouping turns clutter into themes | E | Affinity diagram |
| 212 | **Path / game-board journey** | Playful linear journey | "How do I progress start→finish?" | Winding board with stops/milestones | Game framing boosts engagement | M | Board-game infographic |
| 213 | **Mountain / summit** | Effort toward a peak goal | "The climb to the goal" | Peak with base-camps up the slope | Summit = worthy visible climb | M | Metaphor |
| 214 | **Polaroid / photo-caption grid** | Curated visual examples | "What do these look like, with context?" | Image cards + captions in a grid | Photos confer realism; grid = curated set | E | Curation grid |
| 215 | **Affinity / sticky-note map** | Clustering raw inputs into themes | "What patterns emerge from many notes?" | Loose notes grouped into named clusters | Bottom-up grouping = discovered structure | E | Design thinking |

---

## 3. Consulting benchmark — what the firms actually use

Verified from the data-viz canon (FT Visual Vocabulary, fully reviewed) and the consulting-communication canon (Minto; firm conventions). Key conventions a Shetty's Desk infographic can borrow for *credibility*:

**Storyline & structure (McKinsey / BCG / Bain shared):**
- **Pyramid Principle (Barbara Minto)** — answer first, then MECE supporting arguments. Every deck = one governing thought decomposed. Our equivalent: lead the image with the *conclusion* (hero number / action title), prove it below.
- **Action titles** — each slide's headline is a full-sentence *assertion* ("Lead times fall 40% when we localize Tier-2"), not a topic ("Lead times"). Apply to infographic headings.
- **SCQA** — Situation, Complication, Question, Answer for the framing line.
- **MECE** — buckets must not overlap and must be collectively exhaustive. Our multi-card layouts should pass this test.
- **Ghost decks** — storyboard the argument with empty action-titled slides before adding data.

**Signature exhibits (the chart vocabulary that signals "consulting-grade"):**
- **Waterfall / bridge** — the McKinsey/BCG default for explaining "what drives the change from A to B" (cost build-up, profit bridge, variance). High value, **Easy** to render. (Our Format 9, 11.)
- **Marimekko / Mekko** — variable-width stacked columns encoding *two* dimensions (segment size × within-share). The classic market-map exhibit. **Medium** (proportional widths + heights). 
- **2×2 strategy matrices** — BCG growth-share (Stars/Cash Cows/Question Marks/Dogs), GE-McKinsey nine-box, Ansoff, Eisenhower, Kraljic (procurement), risk. Signals strategic positioning. **Easy**.
- **Football-field chart** — overlapping horizontal valuation ranges; the banking standard for "value lives in this range." **Easy**.
- **Harvey balls** — quarter-filled circles for ordinal qualitative comparison in a criteria grid. Booz/McKinsey heritage. **Easy** (5 SVG states).
- **Heat maps / RAG status** — red-amber-green grids for portfolio/risk status at a glance. **Easy**.
- **Driver / value-driver trees** — decompose a KPI into multiplicative/additive levers; shows *where to act*. **Medium**.
- **RACI** — responsibility grid (Responsible/Accountable/Consulted/Informed). **Easy**.
- **Tornado / sensitivity** — sorted horizontal bars ranking which input swings the outcome most. **Easy**.
- **S-curve / Three Horizons / experience curve** — lifecycle and growth-portfolio arguments. **Easy–Medium**.
- **Porter Five Forces / Value Chain / 7S** — named structural frameworks; instantly legible to a business audience. **Easy–Medium**.

**Why these matter for us:** they are *pre-credentialed*. A reader who has sat in a strategy meeting recognizes a waterfall, a 2×2, or Harvey balls instantly and reads them as rigorous. Borrowing the *form* (not the jargon) lets a supply-chain infographic inherit that credibility while staying plain-language.

> Note on sourcing: the FT Visual Vocabulary was retrieved and reviewed in full (9 families, all chart types). Per-framework URLs from **Corporate Finance Institute (CFI)** — the one consulting-knowledge domain reachable in this environment — were captured for the major frameworks (Pyramid/SCQA, MECE/issue trees, BCG, GE-McKinsey, Ansoff, SWOT, PESTEL, Porter, 7S, Three Horizons, experience curve, flywheel, waterfall, Mekko, football-field, Harvey balls, bullet chart, etc.) and are marked inline as `[CFI: <slug>]` (resolve via the CFI base URL in Sources). Direct fetches to Wikipedia and most other commercial blogs returned HTTP 403; for those, the originating author/firm is cited. Framework names, anatomies, and attributions are the well-established canon (Minto 1987; Porter 1979/1985; BCG 1970; Kaplan-Norton 1992; Osterwalder; Cooper; Kraljic 1983; Collins 2001) and were cross-confirmed by two independent research passes.

---

## 4. Top picks for our code-render engine

Shortlist: high-impact AND Easy/Medium in HTML/CSS/GSAP, mapped to supply-chain use and to our existing 50-format library (`ai-for-sc-visual-dna.md`). These should be the *default candidates* the selector reaches for.

| Pick | Build notes (HTML/CSS/GSAP) | Feasibility | SC use case | 50-format link |
|---|---|---|---|---|
| **Waterfall / bridge** | Flexbox row of absolutely-positioned bars at running totals; GSAP grow-in per bar | E | Savings breakdown, cost build-up, WC bridge | F9, F11 |
| **2×2 matrix (plotted)** | CSS grid 2×2 + absolutely-positioned dots by %; GSAP dot drop-in | E | SKU/supplier segmentation, risk, Kraljic | F20, F43, F19 |
| **Iceberg** | SVG path waterline + stacked bands below; GSAP reveal-down | E | TCO/hidden cost, tariff impact | F12 |
| **Funnel** | Stacked CSS trapezoids (`clip-path: polygon`); GSAP stage count-up | E | Exception triage, conversion, drop-off | F33 |
| **Maturity ladder / staircase** | Flexbox ascending steps (transform translateY); GSAP step-climb | E | AI/data maturity, capability levels | *new — recommend adding* |
| **Numbered step flow (one highlighted)** | Flex row of cards + connector arrows; highlight intervention step | E | Workflow where AI saves one step | F34 |
| **Pipeline (gated stages)** | Flex columns w/ token counts; GSAP token flow | E | Orders/docs through approval gates | F35 |
| **Stacked level / inventory stack** | Vertical flex bands + threshold line; GSAP fill | E | Safety stock, reorder point | F40 |
| **Scorecard / comparison table (+ Harvey balls)** | CSS grid + 5-state SVG ball component; winner row highlight | E | Carrier/supplier/tool comparison | F18 |
| **Cost anatomy cross-section** | Concentric SVG rings or layered bands sized by %; radial reveal | M | Should-cost, landed cost strata | F6 |
| **Cycle / loop & flywheel** | SVG circle path + nodes; GSAP rotate / sequential pulse | E–M | Replenishment loop, S&OP cycle, compounding | *new* |
| **Big-number / formula card** | Typography + SVG callout lines to variables; GSAP count-up | E | Hero metric, EOQ/safety-stock formula | F7, F10 |
| **Radar / spider** | SVG polygon from polar coords; GSAP draw-on | M | Supplier health across dimensions | F44 |
| **Stacked decomposition bands** | Aligned mini-charts sharing x-axis (CSS grid rows) | M | Demand = trend+seasonality+noise | F22 |
| **Network / correlation map (small)** | SVG nodes + weighted edges (hand-placed, ≤8 nodes) | M | Leading indicators → outcome; lane network | F24, F38 |
| **Slope chart / before-after split** | Two-axis SVG lines, or mirrored CSS halves; GSAP slide-in | E | Then→now transformation, rank shift | F15 |
| **Calendar grid / roadmap** | CSS grid month×week + event chips; GSAP highlight cluster | E | S&OP cadence, seasonal triggers | F30 |
| **Concentric rings / onion** | Nested SVG circles, labelled; radial reveal | E | Scope/dependency, control-tower layers | *new* |
| **Marimekko / Mekko** | Flex columns variable-width (% basis) × stacked rows | M | Spend by category × supplier mix; market map | *new — strong add* |
| **Tornado / sensitivity** | Horizontal bars sorted by swing, centered on baseline | E | Which input drives cost most; FVA levers | F26-adjacent |

**Avoid in code-render (defer to AI-image or skip):** Sankey, chord, treemap (squarify), Voronoi, sunburst, beeswarm, cartogram, choropleth, force-directed networks — these need a layout algorithm (d3) and rarely read well at mobile 1:1. If the data genuinely demands flow visualization, simplify to a 3–5 node weighted network or a waterfall.

**Recommended additions to the 50-format library (not currently covered):** Maturity ladder/staircase · Cycle/flywheel loop · Concentric rings/onion · Marimekko/Mekko · Tornado/sensitivity · Slope chart. Each is Easy–Medium and fills a real SC explanatory gap.

---

## Executive summary (12 lines)

1. The single most useful artifact here is **§1 The Selector** — read the *nature of the idea* (sequence, trade-off, hidden cost, contribution, hierarchy) and the layout follows; stop defaulting to the 4-card grid.
2. **Every layout makes a built-in argument.** Funnel = narrowing/conversion; pyramid = foundation; matrix = two independent trade-offs; waterfall = contribution; iceberg = hidden mass; ladder = self-location. If the claim is false for the topic, the layout is wrong.
3. The **data-viz canon reduces to nine questions** (FT Visual Vocabulary): magnitude, change-over-time, part-to-whole, ranking, deviation, distribution, correlation, flow, spatial — match the question, then the chart.
4. **Abela's Chart Chooser** collapses further to four: comparison, composition, distribution, relationship — a fast first cut when in doubt.
5. **Consulting credibility comes from a small set of signature exhibits**: waterfall/bridge, 2×2 matrices, Marimekko, football-field, Harvey balls, RAG heat maps, driver trees, RACI, tornado. Borrowing the *form* inherits the rigor.
6. **Minto's Pyramid Principle + action titles** translate directly to our images: lead with the conclusion (hero number / assertion headline), prove it below, keep supporting points MECE.
7. For our HTML/CSS/GSAP stack, the **highest-ROI builds are Easy**: waterfall, 2×2, iceberg, funnel, staircase, step-flow, pipeline, stacked-level, scorecard+Harvey balls, calendar, slope/before-after.
8. **Cost anatomy, radar, Mekko, decomposition bands, small networks** are Medium but high-value for SC — worth the SVG effort.
9. **Avoid in code-render**: Sankey, chord, treemap, Voronoi, sunburst, cartogram, force-directed graphs — they need d3 layout algorithms and read poorly at mobile 1:1.
10. Our existing 50-format library already covers most winners; the **gaps to add are: maturity ladder, cycle/flywheel, concentric rings, Marimekko, tornado, slope chart.**
11. **Mobile-1:1 discipline**: prefer layouts that stay legible with ≤6 elements and ≥14px text; dense charts (parallel coords, beeswarm, big networks) violate this.
12. **Selection beats decoration**: the catalog (§2, 200+ entries) exists so each topic gets the *one* shape whose rhetoric matches its meaning — that is the whole point of this intelligence.

---

## Sources

Primary source retrieved and reviewed in full:
- **FT Visual Vocabulary** (Financial Times, chart-doctor repository) — the 9 chart families and their chart types. https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary · interactive: https://ft-interactive.github.io/visual-vocabulary/

Data-viz chart-selection canon:
- **Andrew Abela, "Chart Chooser"** (Extreme Presentation Method) — comparison / composition / distribution / relationship decision tree. https://extremepresentation.com/design/charts/
- **Stephen Few** — bullet graphs, dashboard design (Perceptual Edge). https://www.perceptualedge.com/
- **Edward Tufte** — small multiples, sparklines, slopegraphs. https://www.edwardtufte.com/
- **Tableau, "Which chart or graph is right for you?"** https://www.tableau.com/learn/whitepapers/which-chart-or-graph-is-right-for-you

Consulting / strategy frameworks — **Corporate Finance Institute** (per-framework pages, reachable this session; `[CFI: slug]` inline refs resolve against `https://corporatefinanceinstitute.com/resources/...`):
- Pyramid Principle / SCQA / action titles: https://corporatefinanceinstitute.com/resources/career/scqa/
- MECE / issue trees / strategic problem-solving: https://corporatefinanceinstitute.com/resources/management/strategic-problem-solving/
- BCG matrix: https://corporatefinanceinstitute.com/resources/management/boston-consulting-group-bcg-matrix/
- Ansoff matrix: https://corporatefinanceinstitute.com/resources/management/ansoff-matrix/
- SWOT: https://corporatefinanceinstitute.com/resources/management/swot-analysis/ · PESTEL: https://corporatefinanceinstitute.com/resources/management/pestel-analysis/
- Corporate strategy hub (Porter Five Forces, generic strategies, 7S, BMC): https://corporatefinanceinstitute.com/resources/management/corporate-strategy/
- Strategic analysis (value chain, GE-McKinsey, fishbone, maturity, journey, funnel): https://corporatefinanceinstitute.com/resources/management/strategic-analysis/
- Experience curve: https://corporatefinanceinstitute.com/resources/management/experience-curve/ · Flywheel/Hedgehog: https://corporatefinanceinstitute.com/resources/management/organic-growth/
- Three Horizons / horizon analysis: https://corporatefinanceinstitute.com/resources/career-map/sell-side/capital-markets/horizon-analysis/
- Strategic planning (Balanced Scorecard, strategy map, OKR, stage-gate, roadmap, Gantt, Kanban): https://corporatefinanceinstitute.com/resources/management/strategic-planning/
- TAM-SAM-SOM: https://corporatefinanceinstitute.com/resources/management/serviceable-obtainable-market-som/
- Chart types (Mekko, waterfall, funnel, bubble, Harvey balls, radar, Pareto): https://corporatefinanceinstitute.com/resources/excel/types-of-graphs/
- Waterfall template: https://corporatefinanceinstitute.com/resources/financial-modeling/waterfall-chart-template/ · Bullet chart: https://corporatefinanceinstitute.com/resources/financial-modeling/bullet-chart-guide/
- Football-field / valuation range: https://corporatefinanceinstitute.com/resources/knowledge/valuation/ballpark-figure

Consulting / strategy frameworks (originating author/firm — canonical references):
- **Barbara Minto, *The Pyramid Principle*** (1987) — pyramid logic, SCQA, MECE, action titles.
- **Michael Porter** — Five Forces (HBR, 1979); Value Chain & generic strategies (*Competitive Advantage*, 1985).
- **Boston Consulting Group** — growth-share matrix (1970); experience curve; Marimekko/Mekko.
- **GE / McKinsey** — nine-box matrix; **McKinsey 7S** (Peters & Waterman); **Three Horizons of Growth** (Baghai, Coley, White).
- **Kaplan & Norton** — Balanced Scorecard / Strategy Map (HBR, 1992/1996).
- **Alexander Osterwalder** — Business Model Canvas / Value Proposition Canvas.
- **Robert Cooper** — Stage-Gate.
- **Peter Kraljic** — purchasing portfolio matrix (HBR, 1983).
- **Jim Collins** — the Flywheel (*Good to Great*).
- **Dave Snowden** — Cynefin framework.
- **Simon Wardley** — Wardley mapping.
- **Kaoru Ishikawa** — fishbone / cause-effect diagram.

Infographic layout taxonomies (template-library conventions — canonical documentation pages; categories cross-confirmed, specific URLs blocked by HTTP 403 this session):
- Venngage types-of-infographics: https://venngage.com/blog/types-of-infographics/
- Piktochart: https://piktochart.com/blog/types-of-infographics/ · Visme: https://visme.co/blog/types-of-infographics/ · Canva: https://www.canva.com/learn/infographic-design/ · Infogram: https://infogram.com/blog/types-of-infographics/
- Microsoft SmartArt categories (list/process/cycle/hierarchy/relationship/matrix/pyramid/picture) — de-facto layout taxonomy: https://support.microsoft.com/en-us/office/learn-more-about-smartart-graphics-6ea4fdb0-aa40-4fa9-9348-662d8af6ca2c
- Data-to-Viz: https://www.data-to-viz.com/ · Data Viz Project: https://datavizproject.com/ · Data Viz Catalogue: https://datavizcatalogue.com/
- Gartner Magic Quadrant methodology: https://www.gartner.com/en/research/methodologies/magic-quadrants-research
- Per-pattern references (Wikipedia — 403 this session but canonical): Sankey, Funnel chart, Waterfall chart, Ishikawa diagram, Decision tree, Venn diagram, Gantt chart, Treemapping, Mind map, Pictogram, Maslow's hierarchy.

> Environment note: WebFetch returned HTTP 403 for most commercial and Wikipedia URLs during compilation. The **FT Visual Vocabulary (GitHub)** was retrievable in full and anchors the data-viz section; **Corporate Finance Institute** was reachable via search and supplies per-framework consulting URLs (above). Other URLs are canonical documentation pages (where each pattern is normally found) compiled by two independent research passes but not byte-verified this session. Refresh URLs when direct fetches are available.
