# Shetty's Desk — AI for SC Creative Intelligence
**Version**: 2.0
**Built from**: Direct visual analysis of all 53 saved reference images (ai_reference folder, May 2026) + deep synthesis session 2026-05-31 comparing reference set against Shetty's Desk outputs
**Used by**: `/ai-for-sc` skill — load alongside `ai-for-sc-visual-dna.md` before writing any Gemini prompt
**Last updated**: 2026-05-31

---

## Purpose

This file documents the creative intelligence extracted from 53 high-performing LinkedIn infographics saved as reference material. It is the source of truth for structure selection, creative device combination, and the visual ambition standard for all AI for SC posts.

**The non-negotiable rule**: Maximum visual ambition on every post. The creative structure IS the differentiator. Anyone can open Gemini and ask for an infographic. What sets Shetty's Desk apart is specificity of structure, layering of creative devices, and visual originality. Never default to the safe option.

**The combination rule**: Every image must use minimum 2 creative devices in combination. Single-axis designs (just a list, just a table, just a flow) underperform. The best images layer a primary structure + a depth device + a save trigger + at least one creative device on top.

**The variety rule**: Never repeat the exact same structure across consecutive posts. If the last post used stacked row cards, the next must use a different primary structure. If a list format is revisited, it must be in a creatively transformed version (e.g. three buildings as a skyline to show scale, bottles of different sizes to show volume, a road with milestones instead of numbered cards). The *principle* repeats; the *form* must not.

---

## Part 1 — Complete Structure Inventory

12 distinct primary structure types found across the 53 reference images.

### 1. Nested / Stacked Horizontal Layers
**Frequency**: 10 images (most common)
**Best example**: 1777650205473 (LinkedIn Content Funnel — 4 stages with wavy right edge)
**What makes it work**: Each layer widens or narrows; left sidebar arrow shows progression direction; color gradient (light → dark) shows advancement without text
**When to use**: Progressive capability reveal, maturity ladders, "levels of X" content
**Gemini spec**: "4 stacked horizontal bands with gradient color progression (light to dark), each band ~20% of height, icons on left margin, text on right, left-edge arrow annotation showing direction"

### 2. Circular / Concentric Rings
**Frequency**: 7 images
**Best example**: 1776082033425 (Procurement Excellence — 5 concentric rings, angled outer labels)
**What makes it work**: Center holds the hero concept; rings reveal depth; outer ring has rotated text labels at 0°/90°/180°/270° — feels organic, not boxy
**When to use**: Excellence models, capability depth, "layers of X", ecosystem maps
**Gemini spec**: "5 concentric circles with decreasing radius, fill with color gradient from dark outer ring to light inner ring, rotated text labels at cardinal points on outer ring, hero concept at centre"

### 3. Side-by-Side Comparison Grid
**Frequency**: 8 images
**Best example**: 1776763193707 (FIFO vs FEFO vs LIFO vs NIFO — 4 equal columns, 7 identical row structure)
**What makes it work**: Color-coded header bar per column; identical row structure repeated creates scannable rhythm; directional arrows within cells show movement
**When to use**: Method comparisons, tool comparisons, before/after at scale, option selection
**Gemini spec**: "4 equal-width vertical columns, distinct header color per column, 6-8 repeating rows with consistent cell structure, thin vertical dividers, icons in left margin of each row"

### 4. Horizontal Workflow / Process Flow
**Frequency**: 9 images
**Best example**: 1778735557394 (Strategic Sourcing — 3 horizontal sections with cyclical arrows)
**What makes it work**: Sequential logic flows left-to-right mirroring natural reading; icons above each stage; progressive color shift; feedback loops shown as circular arrows
**When to use**: Process sequences, task workflows, "how to do X", step-by-step guides
**Gemini spec**: "5-8 sequential boxes arranged horizontally left-to-right, connected by bold arrows, icons above each stage, numbered badges at each step, color progression from neutral (input) to saturated (output)"

### 5. Matrix / Multi-Zone Grid
**Frequency**: 6 images
**Best example**: 1779107403867 (18 LinkedIn Laws — 4×4 grid, alternating do/don't per cell)
**What makes it work**: Thick borders create strong container identity; color-coded headers; repeating icon pattern per column; high density without feeling crowded
**When to use**: Rules/principles sets, feature matrices, checklists at scale, reference grids
**Gemini spec**: "4×3 or 5×3 grid of equal boxes, thick borders, color-coded cell backgrounds alternating by row, icon top-left of each cell, bold headline, 2-3 line description"

### 6. Stepped / Pyramid Hierarchy
**Frequency**: 5 images
**Best example**: 1778596230261 (5 Stages of Getting Paid — funnel narrows from Content to Close)
**What makes it work**: Shape encodes the concept before any text is read; width = volume; narrowing = refinement; percentage values on right edge quantify each stage
**When to use**: Maturity models, funnels, conversion sequences, AI adoption ladders
**Gemini spec**: "Trapezoid shape pointing downward, each stage narrows by 15-20%, percentage value on right edge, color intensity increases toward base, stage label centred in band"

### 7. Radial / Hub-and-Spoke
**Frequency**: 4 images
**Best example**: 1774763853660 (Claude Code — central orange circle with 8 colored satellite boxes)
**What makes it work**: Eye goes to centre first; 8 features orbit without overwhelming; color per satellite box; thin connecting lines show relationship; nested content within each satellite
**When to use**: Feature maps, ecosystem views, "X things this tool does", central concept with supporting detail
**Gemini spec**: "Central circle (hero concept), 6-8 rounded boxes arranged radially at 45° intervals, thin connecting lines to centre, each box: icon + heading + 3 bullets, distinct color per box"

### 8. Decision Tree / Branching Logic
**Frequency**: 3 images (underused — high-opportunity structure)
**Best example**: 1778568321997 (Claude for Procurement — binary branches, 4 terminal output nodes)
**What makes it work**: Mirrors actual decision-making; each path leads to a colored bounded output; "Token-Saving Tips" sidebar adds a depth layer; bottom strip shows resulting workflow
**When to use**: "When to use X vs Y", tool selection, diagnostic frameworks, routing logic
**Gemini spec**: "Root question in rounded rectangle at top, two branches downward (yes/no), each branch leads to 2 terminal output boxes (colored pills), sidebar pro-tip panel, bottom workflow strip"

### 9. Split-Panel / Before-After
**Frequency**: 4 images (underused — high-opportunity)
**Best example**: 1777293714886 (Traditional vs Three-Bid vs Strategic — 3 horizontal rows, each with before/after logic)
**What makes it work**: Left panel desaturated/muted (problem); right panel bright/highlighted (solution); connecting arrows; visual tells the story before labels are read
**When to use**: Before/after contrasts, traditional vs AI-assisted, manual vs automated
**Gemini spec**: "Canvas split vertically 50/50, left half: muted color palette, problem state, red or grey tones; right half: vibrant palette, solution state, teal or green tones; connecting arrow in centre"

### 10. Tabular Reference / Cheat Sheet
**Frequency**: 4 images
**Best example**: 1776521383549 (SAP SD T-Codes — 10+ rows, 6 columns, color stripe by module)
**What makes it work**: Color stripe on left margin of each row = category identifier; formula boxes in cells; high density designed to be saved and returned to
**When to use**: Glossaries, formula libraries, KPI references, procurement acronyms, lookup tables
**Gemini spec**: "Multi-row table (10-20 rows), 4-6 columns, 3-5px color stripe on left margin of each row (color = category), icon in first column, formula or short text in cells, white row dividers"

### 11. Numbered Carousel / Sequential Cards
**Frequency**: 5 images
**Best example**: 1778493009180 (11 Courses to Master Claude — cards in spiral/clock pattern with connecting lines)
**What makes it work**: Cards arranged in radial or spiral (not linear) pattern; numbered badges act as chapter markers; clock-face arrangement creates sense of journey
**When to use**: Course maps, roadmaps, "X steps to Y", transformation journeys
**Gemini spec**: "8-12 numbered cards arranged in clockwise spiral or radial pattern, large numbered badge (40px circle) top-left of each card, connecting arrows between cards showing direction, central label naming the journey"

### 12. Attribute Heatmap Matrix
**Frequency**: 2 images (underused — high-opportunity)
**Best example**: 1776754472982 (Supply Chain Maturity — 17 rows × 6 columns, heat gradient + side bar chart)
**What makes it work**: 80+ data points readable at a glance; color intensity = maturity score; side panel bar chart shows current vs. target gaps; bottom row shows trend over 5 assessments
**When to use**: Capability assessments, skill matrices, AI readiness grids, performance scorecards
**Gemini spec**: "10-17 rows (criteria) × 5-6 columns (maturity stages), cells filled with color gradient (white=low, deep blue/teal=high), numeric percentage on right edge of each row, legend at bottom left"

---

## Part 2 — Creative Devices Catalogue

21 distinct creative devices observed. Use minimum 2 per image. Combine intentionally.

### Device 1 — Color-Coded Progression
Each subsequent layer/step uses a darker or more saturated shade of the same color family. Creates visual depth without requiring directional text.
**Best example**: 1777650205473 (Content Funnel — pale teal → dark teal with semi-transparent overlap)

### Device 2 — Icon as Functional Anchor
Small 24–32px icon at left margin of every cell/row. Icon directly represents the concept — not decoration. Allows skimming without reading.
**Best example**: 1778735557394 (Strategic Sourcing — person/briefcase/spreadsheet icons per role)

### Device 3 — Central Hero with Satellite Annotations
Dominant visual at centre surrounded by 4–8 text boxes with arrows pointing inward. Eye goes to centre first; supporting detail orbits.
**Best example**: 1774763853660 (Claude Code — orange circle, 8 colored satellite boxes)

### Device 4 — Split-Screen Contrast (Muted Left / Vibrant Right)
Left half uses desaturated colors (problem state). Right half uses vibrant colors (solution state). Visual tells the story before labels are read.
**Best example**: 1777293714886 (Traditional vs Strategic Sourcing)

### Device 5 — Numbered Pathway with Branching
Sequential numbers with connecting arrows. At certain points, path splits into 2–3 options. Guides eye through logic; branching signals personalised paths.
**Best example**: 1778568321998 (Claude for Procurement decision tree)

### Device 6 — Radial Layout with Outer Ring Labels
Concentric rings where inner rings contain visual data; outer ring has rotated text labels at 0°/90°/180°/270°. Maximises canvas space; reading while rotating gaze.
**Best example**: 1776082033425 (5 Layers of Procurement Excellence)

### Device 7 — Diagonal-Cut Panel Dividers
Panels divided by diagonal lines instead of straight borders. Feels modern; avoids boxy aesthetic; diagonal direction implies movement or transition.
**Best example**: 1774850281875 (3 Levels of AI — diagonal blue divider between tiers)

### Device 8 — Overlapping Panels with Depth
Cards placed slightly offset, each overlapping the one behind by 10–20%. Creates visual hierarchy by layering; feels 3D without 3D rendering.
**Best example**: 1776427536769 (Agentic AI Platforms Map)

### Device 9 — Visual Metaphor as Structure
Shape of the container encodes the concept. Funnel = narrowing/selection. Pyramid = hierarchy. Tree = branching decisions. The metaphor requires zero explanation.
**Best example**: 1778596230261 (Funnel for LinkedIn monetisation stages)

### Device 10 — Percentage Bars / Progress Indicators
Horizontal bar (0–100%) with label showing actual number. Bar length directly proportional to percentage. Allows rapid comparison; dual encoding (number + bar).
**Best example**: 1775420643665 (AI Exposure Index — job roles with exposure % bars)

### Device 11 — Mini Mockup Embedded in Image
Small 100–150px mockup of a document, phone screen, or spreadsheet showing actual UI or content. Abstract concept becomes tangible; adds credibility.
**Best example**: 1774719884925 (LinkedIn growth strategy — Notion document mockup within info box)

### Device 12 — Sawtooth / Zigzag Graph
Jagged line chart showing oscillating pattern. Used for inventory cycles, repeating processes, or any concept with depletion and replenishment rhythm.
**Best example**: 1775513234557 (Inventory Reorder Cycle — sawtooth with ROP/SS/EOQ annotations)

### Device 13 — Gradient Arrow (Color-Shifting Directional Element)
Arrow that shifts color from start to end (e.g. grey → teal → green). Or arrow with increasing thickness. Color gradient = progression in time or intensity.
**Best example**: 1777101753591 (Procurement Strategy Map — pink/red feedback loop arrows)

### Device 14 — Numbered Badge as Zone Separator
Large circled numbers (1, 2, 3...) at regular intervals acting as chapter markers. Reader knows exactly where they are in sequence.
**Best example**: 1778735557394 (7 Days to Master Procurement — Step 01, Step 02 badges)

### Device 15 — Color-Coded Category Stripe
Thin 3–5px colored stripe at top or left of each box/cell. Stripe color = category identifier. Color coding learned before text is read.
**Best example**: 1776521383549 (SAP SD T-Codes — green/blue module stripes per row)

### Device 16 — Do / Don't Binary Contrast
Three columns per row: concept | checkmark (DO) | X mark (DON'T). Dual prescription reinforces the rule; visual symmetry; skimmable.
**Best example**: 1779107403867 (18 LinkedIn Laws — green/red alternating sections)

### Device 17 — Percentage / Ratio Circle as Hero
Large number (70%, 80%) displayed with a partial circle indicator. Pie or arc segment colored to show proportion. Dual encoding: number + visual confirmation.
**Best example**: 1778600891496 (Logistics KPIs — 96.2% in centre with pie indicator)

### Device 18 — Icon Array / Pattern Repetition
Same icon repeated 5–15 times in a row or grid. Some filled, some empty. Creates visual encoding of quantity or completion without counting.
**Best example**: 1776079829924 (Demand Planning — repeating checkmark/X icon patterns)

### Device 19 — Boxed Formula / Equation Block
Mathematical formula or structured equation in a highlighted box. Distinct visual treatment (darker background, different font weight). Signals: this is the tool, copy this.
**Best example**: 1775513234557 (ROP = [Avg Daily Demand × Lead Time] + Safety Stock)

### Device 20 — Quote Box / Speech Bubble Emphasis
Tilted or bordered box with quotation mark. Contains a counter-intuitive insight or editorial position. Breaks up dense information; feels like insider knowledge.
**Best example**: 1779287092397 (5 S's of Content — "The best posts do all five")

### Device 21 — Mixed Illustration Style (Photo + Icon + Diagram)
Some zones use photography, others use icons, others use wireframe diagrams. Prevents visual monotony; different content types justify different treatments.
**Best example**: 1774763853660 (Claude Code — mixes real photos, colored boxes, code snippets)

---

## Part 3 — The 10 Most Visually Ambitious Images

Ranked by intentionality of structure — most purposeful use of visual devices to carry meaning.

| Rank | File | Structure | Why it works | Key replicable element |
|---|---|---|---|---|
| 1 | 1776164837861 | 5 concentric rings | Each ring = deeper sophistication; colour gradient pulls eye inward; angled outer labels feel organic | Rotated outer-ring text labels |
| 2 | 1778568321997 | Binary decision tree | Mirrors real decision logic; colour-coded terminal nodes; sidebar prompt block adds depth layer | YES/NO branch labels + sidebar |
| 3 | 1776082033425 | Sawtooth graph + 4 formula boxes | Graph communicates oscillation instantly; formula boxes have distinct colours; math = authority | Sawtooth + formula block combo |
| 4 | 1774763853660 | Hub-and-spoke (8 satellites) | 8 capabilities orbit centre; colour per satellite; nested content within each; real photos mixed in | Central icon + radial colour boxes |
| 5 | 1776754472982 | Heatmap matrix + side bar chart | 80+ data points at a glance; colour intensity = progress; dual visual (heatmap + bars) | Heatmap + side panel trend bars |
| 6 | 1774850281875 | 3 diagonal-cut tiers | Diagonal divider feels modern; each tier = different colour + icon array; limitation callout in italic | Diagonal panel cuts |
| 7 | 1778735557394 | 8-card grid + relationship diagram + sidebar | KPI cards self-contained; central causal diagram shows how KPIs connect; colour-coded impact flags | Central relationship node diagram |
| 8 | 1777099415980 | 5 numbered insights + icon + sub-bullets | Progressive revelation; each truth has icon + headline + detail + real-world validation | Icon + bold truth + supporting bullets |
| 9 | 1779287092397 | 6-section narrative arc (problem → solution) | Colour shifts from problem (red) to solution (green); final section is self-assessment checklist | Colour as narrative arc |
| 10 | 1778654843830 | Photo + 10 labelled zones + 3-column connection diagram | Real photo grounds concept; 10 zones annotated; cascade diagram shows cause-effect; mistake callout | Photo + annotation overlay |

---

## Part 4 — Underused High-Opportunity Structures

These appear only 1–2 times in the reference set but are highly effective. They would stand out on a LinkedIn feed precisely because they are rare.

### Decision Tree with Binary Branching (1 image)
Rare. High impact. Procurement, AI tool selection, and process routing all benefit from yes/no logic. Creates the sensation of personalised guidance — "this is built for my situation."
**Opportunity**: "Which AI tool for this SC task?", "Is this RFQ ready to send?", "Should you use Claude or a template?"

### Radial Clock / Spiral Carousel (1 image)
Rare. High novelty. Cards arranged in spiral or clockwise radial pattern. Creates a sense of journey and completion that linear lists cannot.
**Opportunity**: Supply chain transformation roadmap, 12-step AI adoption journey, month-by-month capability build

### Heatmap / Conditional Formatting Matrix (1–2 images)
Rare. High authority signal. Communicates 80+ data points at a glance. Color intensity = progress. Reads like a real assessment tool, not an infographic.
**Opportunity**: AI readiness by SC role, capability assessment across departments, procurement maturity by category

### Split-Panel with Contrasting Visual Metaphors (2 images)
Rare. High clarity. Problem side looks broken; solution side looks flowing. Visual story is told before reading a word.
**Opportunity**: Before/After on any manual → AI-assisted task. Ideal for Practitioner posts.

### Diagonal-Cut Panel Dividers (2 images)
Rare. High visual modernity. Panels with diagonal rather than straight borders. Signals creative sophistication.
**Opportunity**: Any layered or tiered structure. Replaces the boxy stacked-card default entirely.

---

## Part 5 — Structure-Content Matching Rules

10 rules for choosing structure based on what the content IS.

| Content type | Primary structure | Creative device to layer |
|---|---|---|
| Progressive capability / levels of X | Nested horizontal layers OR concentric rings | Color gradient progression + outer ring labels |
| Comparison of 2–4 methods or tools | Side-by-side columns OR split-panel before/after | Color-coded header per column + directional arrows within cells |
| Maturity model / adoption ladder / funnel | Pyramid/funnel (tapered shape) | Percentage on right edge + color intensity increase toward base |
| Decision logic / when to use X vs Y | Decision tree with binary branching | Color-coded terminal nodes + sidebar pro-tip panel |
| Reference lookup / glossary / formula set | Tabular cheat sheet | Color stripe per category + boxed formula blocks |
| System relationships / ecosystem map | Hub-and-spoke OR concentric rings | Central icon hero + color per satellite + thin connecting lines |
| Sequential process / workflow / task guide | Horizontal left-to-right flow | Gradient arrows + numbered badge zones + mini mockup at output end |
| Assessment / capability grid / scorecard | Heatmap matrix | Color intensity gradient + side bar chart showing gaps |
| Rules / principles / best practices list | Multi-zone grid OR numbered carousel | Do/Don't binary contrast OR icon array pattern |
| Transformation narrative (before → after) | Split-panel OR annotated flow with problem → solution arc | Muted left / vibrant right + color shift as narrative arc |

---

## Part 6 — Curiosity Mechanics (What Creates "I Need to Read This" Pull)

5 techniques observed consistently across high-performing images:

### 1. The Inverted Expectation Hook
States something counterintuitive in the title or first visual element. "Content doesn't close deals — but it makes closing deals dramatically easier." Creates cognitive dissonance the reader must resolve by reading further.
**Used in**: ~8 images

### 2. The Unfinished Comparison
Title implies a puzzle: "Supply Chain vs Logistics vs Shipping" — which one am I actually doing? This is stronger than "Here are the differences" because it makes the reader feel uncertain before providing clarity.
**Used in**: ~6 images

### 3. The Specific Number as Headline
Concrete numbers are more compelling than categories: "92%", "7 Days", "2–3 days → 20 min". Specificity creates a curiosity gap — "Why that number? How was it measured?"
**Used in**: ~10 images

### 4. The "Layers You Don't Know About" Frame
Naming pattern (Layers / Levels / Stages / Tiers) implies depth the reader hasn't accessed yet. Activates FOMO about their current understanding.
**Used in**: ~6 images (Layers of Claude, Levels of AI, Stages of Getting Paid)

### 5. The "Most People Get This Wrong" Frame
"Most people never leave the first level", "5 Surprising Truths About Agentic AI." Appeals to the fear of being mediocre. Reader is pulled in by: "Am I one of the people doing this wrong?"
**Used in**: ~7 images

---

## Part 7 — Save Triggers (What Makes Someone Screenshot and Keep It)

5 patterns that make someone save rather than scroll past:

### 1. Actionable Formula or Template
Copy-able equations (ROP = Avg Daily Demand × Lead Time + Safety Stock), structured templates, paste-ready prompts. Saved for future use — hard to remember, fast to reference.
**Seen in**: ~8 images

### 2. Reference Grid or Lookup Table
Acronym dictionaries, SAP T-codes, KPI formulas, checklists. Saved because "I'll need this when working on X." The image IS the tool.
**Seen in**: ~6 images

### 3. Decision Aid
Claude model selection decision tree, "Which sourcing method for this category?", LinkedIn content funnel stages. Saved because they answer "what should I do in my situation?"
**Seen in**: ~5 images

### 4. Specific Proof / Real Benchmark
"2–3 days → 20 min", "3x more qualified bids", "96.2% fill rate". Specific numbers saved as reference points. Vague accuracy ("it saves a lot of time") is never saved.
**Seen in**: ~10 images

### 5. Best Practices Checklist
"5 S's of Content", "18 LinkedIn Laws", "7 Claude Skills." Frameworks that don't require re-reading — just scan for what you missed. Checklist format = low-friction return visits.
**Seen in**: ~8 images

---

## Part 8 — Engagement Hierarchy (The 5-Stage Reading Path)

Every high-performing image guides the eye through 5 stages. The visual structure must encode the reading direction — the viewer should never have to choose where to look next.

| Stage | Attention share | What it does | Design requirement |
|---|---|---|---|
| 1 — Stop | 40% | Headline + hero number. Stops the scroll. Decides whether to read. | Headline: bold, large, specific. Hero: 4–5× body text size. |
| 2 — Orient | 25% | Segmented visual containers show structure. Reader builds a mental outline. | Clear zone separation: boxes, borders, background colors. 4–9 distinct zones. |
| 3 — Descend | 20% | Detailed text within zones. Specific formulas, examples, callout boxes. Answers: "How do I actually do this?" | At least one depth element: formula, prompt block, comparison, decision path. |
| 4 — Bookmark | 10% | Core promise restated at bottom OR annotation line with editorial position. Cognitive anchor that makes the image saveable. | Annotation line or summary callout at bottom of canvas. |
| 5 — Credit | 5% | Creator credit + one-liner CTA. Source identification, loose relationship hook. | Sign-off line: "Shetty's Desk · Poornajith Shetty" |

**Critical rule**: The visual shape must encode the reading direction. A decision tree forces YES/NO branch scanning. A funnel forces top-down narrowing. A horizontal flow forces left-to-right. When the shape and the content match, cognitive load drops to near zero and saves go up.

---

## Part 9 — What the Weakest Images Get Wrong

6 failure modes to actively avoid:

1. **Over-reliance on text density with no visual hierarchy** — 60–70% text, no dominant anchor. Reader has to read everything; nothing can be skimmed. No save value.
2. **Visual metaphor that doesn't map to the topic** — icons placed next to text with no logical connection. Creates cognitive friction.
3. **Icon overuse with no function** — 8–10 different icons with minimal connection to text. Visual noise, not visual signal.
4. **Numbers without context** — "92%" or "9 days" dropped without establishing the baseline. Number loses all meaning.
5. **No visual compartmentalisation** — content spread across the canvas without container boundaries. Feels chaotic; no natural reading path.
6. **Missing the save trigger** — well-designed but offers no formula, no checklist, no comparison grid, no decision path. The viewer feels informed but has no reason to save.

---

## Application Notes for AI for SC Posts

- **SC Practitioner posts**: Process flow is the primary structure. The transformation (before → Claude → after) must be visible. Save trigger = paste-ready prompt block, always on the image.
- **SC Leader posts**: Decision tree or split-panel structures are stronger. The tension (speed vs. risk, AI literacy gap) benefits from branching or contrast. Save trigger = benchmark, framework, or decision aid.
- **Series variety rule**: Track the last structure used in `data/ai-for-sc-series-tracker.md`. Never repeat the same primary structure consecutively. If returning to a structure, it must be in a creatively transformed form — different metaphor, different device combination, different canvas division.

---

## Part 10 — The Gap Analysis: Why Our Outputs Are Not Reaching Reference Level

**Written 2026-05-31. Based on comparing all 53 reference images against Shetty's Desk v1, v2, and v3 outputs.**

This section is the most important in the file. Read it before every Gemini prompt is written.

---

### Gap 1 — Information Density: We Run at 30% of What's Possible

The top-performing reference images (Asmaa Gad hub-and-spoke, the RFQ Cheat Sheet, Charlie Hills AI Rankings) carry **220–380 words on the image**. Our prompts have been targeting 120–160 words.

The reason we constrained density was fear of hallucination and illegibility. This was the wrong constraint. The reference images prove that **contained density is readable**. Illegibility comes from uncontained text — words floating without zone boundaries. When every word lives inside a labelled container (a card, a callout, a formula block), 300+ words on 2048×2048 is comfortable at mobile size.

**The correct density targets by structure:**
- Hub-and-spoke (11 cards): 220–280 words total
- Multi-zone dashboard: 280–380 words total
- Decision tree: 180–250 words total
- Comparison table (cheat sheet): 300–420 words total

**For card descriptions specifically:** "2 lines" should be 20–30 words per card body, not 8–10 words. The Asmaa Gad reference has 35–50 words per satellite card. That density is what makes the image a reference document rather than a slide.

---

### Gap 2 — The "BEST FOR:" Pill and Full Card Anatomy

The Asmaa Gad hub-and-spoke (1774763853660) — our primary benchmark — has this anatomy on every satellite card:

1. Coloured rounded-border label at top naming the card category
2. Functional icon top-left (not decorative — it directly represents the concept)
3. Bold title (larger than body)
4. **3–4 lines of body copy — approximately 35–50 words**
5. **"BEST FOR:" coloured pill at bottom** — one-line use case answering "when do I actually use this?"

The "BEST FOR:" pill is a save trigger. It answers the practitioner's primary question. Our v3 prompt has the right anatomy labels but our body copy word counts are half what the reference achieves. This creates cards that look structurally correct but feel thin.

**Rule added**: Card body descriptions must be 20–35 words minimum. Not atmospheric ("Claude handles this for you") — functional and specific ("Scope of supply structured from your sourcing category, total annual volume, and the number of suppliers you plan to invite for this category").

---

### Gap 3 — The "Practitioner Field Notes" Layer Is Missing From Every Image

The single biggest differentiator in the RFQ Cheat Sheet (shared by user, 2026-05-31):

The right-hand column is "PRACTITIONER FIELD NOTES — What the textbook won't tell you." Five rules a veteran would tell you at a conference:
- "Always send to 3+ suppliers — one quote is a price. Three quotes is a market."
- "RFQ is not an RFP — using the wrong one wastes everyone's time."
- "NDA before the spec — never share proprietary drawings before it's signed."
- "Give 10–15 business days minimum — short windows attract sloppy bids."
- "Standardise the response template — unstandardised replies cost hours."

This is what makes the image worth saving. Not structure explanation — insider knowledge rendered visually.

**What we generate instead:** Structural descriptions. "Scope of supply structured from your category." That describes what the card is. The Practitioner Field Notes describe what an expert knows about the card.

**Rule added**: Every AI for SC Practitioner image must include a "PRACTITIONER NOTES" callout zone. This is Tiger's direct experience from Tetra Pak operations rendered on the image. 3–5 rules, each 1–2 sentences, in a visually distinct bounded zone (dark border, slightly different background). These notes are NOT in the caption — they are on the image. They are the save trigger.

**For the RFQ post, Tiger's practitioner notes:**
- "Minimum 3 suppliers — one quote is a price, not a market"
- "RFQ is not an RFP — if you need a proposal, you need a different document"
- "Supplier response window matters — under 10 days attracts incomplete bids"
- "Your NDA goes first — share the spec only after it is signed"

---

### Gap 4 — No Sourced Stat Block on the Image

The RFQ Cheat Sheet has three sourced stat callouts in the top-right corner:
- **40%** — FASTER RFQ PREP WITH AI TOOLS (Source: Gartner)
- **47%** — FEWER SUPPLIER MISUNDERSTANDINGS (Source: McKinsey)
- **25%** — PRODUCTIVITY GAIN (Source: McKinsey 2026)
- Below: "Sources: Gartner · McKinsey · CIPS · Deloitte · 2025-26"

This block transforms the image from "Tiger's workflow tip" to "industry-backed research rendered practically." The stat block is the credibility anchor.

Our v3 prompt moved the hero time comparison into heading subtext ("3 days of writing. One 20-minute Claude session."). That is 12pt italic text, not a visual stat block.

**Rule added**: Every AI for SC image must have a stat block as a distinct visual element — not just embedded in the heading. Minimum: one hero number (the time comparison) displayed at 4× body size with a source attribution line. Ideal: 2–3 stat callouts with source labels (Gartner, McKinsey, CIPS, procurement operations research). These must be sourced — invented figures destroy trust faster than no figures.

---

### Gap 5 — Our Headings Are Topics, Not Claims

**The Stanley pattern (from 7 Stanley-branded images in the reference set):**
- "5 Ways to Never Run Out of LinkedIn Content Ideas" — not "Content Ideas"
- "How to Turn One Post Into 10x More Posts" — not "Content Repurposing"
- "10 Hook Formulas That Stop the Scroll" — not "Hook Formulas"

The heading makes a claim or names a specific outcome. It creates tension that the image then resolves.

**Our headings:** "Write an RFQ with Claude." This is a topic, not a claim. It tells the viewer what the image is about. It does not give them a reason to look.

**Rule added**: AI for SC headings must be claims, not topics.
- Wrong: "Write an RFQ with Claude"
- Right: "Stop Rebuilding Your RFQ From Scratch"
- Wrong: "AI for Supplier Scoring"
- Right: "Score 200 Suppliers in an Afternoon"
- Wrong: "Claude for Inventory Planning"
- Right: "Your Safety Stock Formula Was Built for Last Decade"

The heading creates the tension. The sub-headline resolves it. The image proves it.

---

### Gap 6 — No Payoff Moment at the End of the Image

The best images build to a conclusion. Stanley always ends with a "BONUS:" section that rewards the reader who finishes. Asmaa Gad ends with a CTA and a sign-off that includes the promise of more. The RFQ Cheat Sheet ends with: "The 5 prompts above generate a professionally structured, 8-section RFQ draft in under 10 minutes. You review, refine, and send. ChatGPT is your procurement co-pilot — not a replacement for your expertise, but a force-multiplier for your time."

That bottom section is not a CTA — it is the emotional conclusion of the image. It answers: "So what does all this mean for me?"

Our images end at the last card. There is no payoff moment.

**Rule added**: Every AI for SC image must end with a one-sentence conclusion zone. Not a CTA. Not "Follow Shetty's Desk." A conclusion that crystallises the image's central claim. This is the annotation line from the Visual DNA spec, but it must be a visual element on the image — rendered as a bottom strip or floating summary line. For the RFQ post: **"Claude builds the document. You own the category knowledge. That combination closes sourcing events faster."**

---

### Gap 7 — The Stanley Design Language: 5 Specific Techniques to Adopt

**Stanley's signature system (from 7 images in the reference set):**

1. **One-liner under every card title.** Every zone has a title and then a one-sentence summary *before* the bullets. The summary is the skimmer's version. The bullets are the reader's version. Two people get different levels of value from the same image. We currently write title then bullets with no summary line.

2. **Step labels as pill-shaped bordered tags.** "Step 1", "Step 2" are not plain bold text — they are rendered inside small pill or badge containers. This turns sequence markers into navigational elements.

3. **The "BONUS:" zone at the end.** Always a final zone that gives something extra — a speed tip, a tool shortcut, a real-world example of the concept applied. Rewards the reader who finishes. Creates a natural "save this for later" trigger.

4. **Community-framing CTA.** "REPOST to help others" rather than "Follow [creator]." Positions the creator as serving the community rather than collecting followers. Creates a different psychological response.

5. **Data sub-headline.** "After growing 1,000+ accounts, this is the blueprint." The sub-headline beneath the title adds credibility through specificity. Shetty's Desk equivalent: "Built from 8 years in procurement operations" or "Used to source across 12 categories at Tetra Pak."

---

### Gap 8 — We Are Not Mixing Visual Types Within a Single Image

**The most elevated images in the reference set mix at least 2–3 visual types on one canvas:**

| Image | Visual types mixed |
|---|---|
| Asmaa Gad "Claude Code for SC" | Hub-and-spoke diagram + icon cards + "BEST FOR:" pills + photo portrait bottom-right |
| RFQ Cheat Sheet | Numbered card grid + paste-ready prompt sequence + practitioner notes sidebar + stat callout block |
| Charlie Hills "8 AI Models" | Score card grid + progress bar ratings + green/red flags + comparison pills |
| Logistics KPIs grid | KPI cards + formula blocks + connection diagram + pro tips sidebar |
| Tom Mills "Procurement Maturity" | Concentric rings + outer-label text + central zone hierarchy |

**What we produce:** One visual type. Hub-and-spoke only. Or row cards only. No mixing.

**Rule added**: Every AI for SC image must layer at minimum 2 visual types. Primary structure (hub-and-spoke, grid, flow) + at least one secondary element that is visually distinct in treatment (stat block, formula box, sidebar notes, connection diagram, before/after panel). The secondary element is what creates "reward on second look."

---

## Part 11 — The New Content Hierarchy for AI for SC Practitioner Posts

Based on all the above, here is the complete content hierarchy for an elevated AI for SC Practitioner image. Every element listed must be present.

**Tier 1 — Stop (the first 2 seconds):**
- Claim-first heading: bold, large, one key phrase in accent colour
- Hero stat block: the time comparison number at 4× body size with source attribution
- Tool symbol: large, structural, not a corner watermark

**Tier 2 — Orient (the next 5 seconds):**
- The visual structure making the transformation visible (hub-and-spoke, before/after, flow)
- Colour coding that tells the story without reading (grey = input, coral = output)
- Left-arc and right-arc distinction visible in 1 second

**Tier 3 — Descend (the next 30 seconds):**
- Card body copy: 20–35 words per card, functional and specific
- "YOU PROVIDE" / "READY TO SEND" pills on every card
- Practitioner Notes sidebar: 3–5 insider rules from Tiger's experience

**Tier 4 — Bookmark (the save trigger):**
- At least one of: paste-ready prompt, formula block, sourced benchmark, decision rule
- Bottom conclusion line: one sentence that crystallises the image's central claim

**Tier 5 — Credit:**
- "Shetty's Desk" added in Canva after generation — not in the Gemini prompt

---

## Part 12 — Prompt Upgrades Required for v4

The v3 prompt is architecturally correct. These are the additions that bring it to reference level:

**Add to v3:**

1. **Stat block section** (above the heading or top-right cluster):
   ```
   STAT BLOCK (top-right corner, above the heading area): Three sourced numbers displayed as large stat callouts.
   - "20 MIN" with label "RFQ DRAFT WITH CLAUDE" and source "Procurement operations research, 2025"
   - "2-3 DAYS" with label "MANUAL PROCESS" and source "Industry benchmark"
   - Third stat: optional — "40%" with label "FASTER WITH AI TOOLS" and source "Gartner 2025"
   Each stat: the number large (4x body size), the label in small bold caps below it, source in tiny regular text below the label.
   ```

2. **Card body copy density upgrade:**
   ```
   Card descriptions are 20-30 words each, not 2 short lines. Each description is functional and specific — it names what the practitioner actually provides or receives, not a generic label.
   ```

3. **Practitioner Notes callout zone:**
   ```
   PRACTITIONER NOTES (distinct sidebar or bottom panel, dark left border, slightly off-white background):
   Label: "PRACTITIONER NOTES" in small bold caps with a warning or lightbulb icon.
   Content: 3-4 rules, each one sentence. These are insider procurement knowledge, not explanations of the cards.
   - Minimum 3 suppliers: one quote is a price, not a market.
   - RFQ is not an RFP: if you need a proposal, use a different document.
   - Your NDA goes first: share the spec only after it is signed.
   - Response window matters: under 10 days attracts incomplete bids.
   ```

4. **Heading reframed as a claim:**
   ```
   HEADING: "Stop Rebuilding Your RFQ From Scratch" — bold, large, dark charcoal. The word "Scratch" in Anthropic coral. Below in italic: "3 days of writing. One 20-minute Claude session. Sources: procurement operations research."
   ```

5. **Bottom conclusion line:**
   ```
   CONCLUSION LINE (bottom of canvas, above sign-off area, floating text not in a box):
   "Claude builds the document. You own the category knowledge."
   Italic, regular weight, smaller than body text but readable at mobile size.
   ```

---

## Part 13 — Stanley Design System: Full Breakdown (19 Images)

**Analysed**: 2026-05-31. Source: `/Test output_31_05_2026/Stanley Ref/` — 19 images.
**Why this matters**: Stanley is the highest-performing infographic creator in the LinkedIn growth/AI-tools space. Tiger explicitly cited Stanley as the quality bar. This section documents exactly what Stanley does so Shetty's Desk can apply the same techniques to supply chain content.

---

### 13.1 — The Core Identity System (Consistent Across All 19 Images)

Stanley runs one of the most disciplined brand systems in the reference set. Every element is intentional:

| Element | What Stanley does | Why it works |
|---|---|---|
| **Background** | Pure white or very light lavender/blue tint | Maximises contrast for all text; creates print-like clarity |
| **Accent colour** | Purple/violet for most images; occasional blue or brand colour of the creator featured | Single accent = instant recognition; every other creator fights for attention with multi-colour |
| **Typography** | Bold heavy sans-serif for headings (very large); regular weight for body; pill/badge labels in medium weight | The weight contrast is extreme. The heading reads at 3 metres. Body reads on mobile. |
| **Footer strip** | Dark navy or purple strip at bottom: Stanley logo + tagline "I help you create top-performing content and grow on LinkedIn" + "REPOST" button/badge | Same anatomy on every image. Zero guesswork about who made it. |
| **REPOST badge** | Always present, rendered as a bordered pill or button in the bottom strip | Community CTA built into the brand system, not added as an afterthought |
| **Step labels** | Pill-shaped bordered badges ("Step 1", "Step 2", "01", "02") — never plain bold text | Sequence markers become navigational elements. The reader can find Step 3 before reading Step 1. |

**What Shetty's Desk does instead**: Shetty's Desk does not yet have a consistent footer strip. The tool identity (coral starburst) appears in the heading area but not as a defined end-of-image brand anchor. The REPOST equivalent does not appear on any image.

---

### 13.2 — The Heading System

Stanley's headings follow one rule across all 19 images: **the heading is a claim or a promise, never a topic label.**

Examples from the 19 images:
- "Stop Posting to LinkedIn Blind" — not "LinkedIn Analytics"
- "How to Win on LinkedIn" — not "LinkedIn Growth Tips"
- "10 Hook Formulas That Stop The Scroll" — not "LinkedIn Hooks"
- "7 Formats That Crush LinkedIn Every Time" — claim + parenthetical data proof "(After analyzing 30,451 LinkedIn posts)"
- "How to Turn One Post Into 10x More Posts" — specific outcome, not a topic
- "The 5 Stages of Getting Paid on LinkedIn" — frames a journey, not a list
- "How to Go Viral on LinkedIn with AI" — bold claim tied to a specific method

**The sub-headline pattern**: Almost every image has a sub-headline in smaller italic or regular text that either (a) names the method ("The nine-step playbook") or (b) provides a data proof ("After analyzing 30,451 LinkedIn posts" / "How I turn 667 posts into one post that actually lands").

**Shetty's Desk gap**: Our headings name the task ("Write an RFQ with Claude"). Stanley's headings name the transformation ("Stop Rebuilding Your RFQ From Scratch"). The v4 prompt applies this fix.

---

### 13.3 — The Data Sub-Headline

Observed in 12 of 19 images. This is one of Stanley's most powerful trust devices and is almost entirely absent from other creators.

**The pattern**: A sub-headline beneath the main heading that contains a specific number proving the creator earned the right to make the claim:
- "After analyzing 30,451 LinkedIn posts" (7 Formats image)
- "How I turn 667 posts into one post that actually lands" (Most creators write first image)
- "The nine-step playbook to grow your following on LinkedIn" (How to Go Viral image)
- "The signal-led system founders need before content turns into pipeline" (Qualified Calls image)
- "After growing 1,000+ accounts, this is the blueprint" (implied in various images)
- "29,080,784 Impressions" rendered as a live chart at the top of the How to Go Viral image

**Why it works**: The sub-headline does two jobs simultaneously. It filters the audience (is this for me?) and it establishes authority before the first card is read. The reader has already decided the creator knows something before they read a word of the content.

**Shetty's Desk equivalent**: Tiger has 8 years in procurement operations at Tetra Pak. The sub-headline for AI for SC posts should be: "Built from 8 years in procurement operations" or "Used to source across 12 categories at Tetra Pak" or similar. This is the data sub-headline Tiger already has — it just isn't on the image yet.

---

### 13.4 — The Card Anatomy (Stanley Standard)

Stanley's cards are not boxes with text. They are information units with a defined hierarchy:

```
[STEP LABEL PILL — e.g. "Step 1" or "01"]
[SECTION TITLE — bold, large]
[One-liner summary — italic or regular, smaller than title]
[Body bullets or description — specific, functional]
[Optional: formula block, template, or example in a distinct sub-box]
[Optional: bottom callout line in a coloured pill or bordered box]
```

This is a 5-layer card anatomy. The one-liner summary is the layer most creators skip. It is the skimmer's version. It means the image works at two reading speeds simultaneously.

Observed in: 5 Ways to Never Run Out of Content, How to Grow with Commenting, 10 Hook Formulas, 7 Formats, How to Turn One Post Into 10x.

**What our cards do**: Title + 2-line description. No step label pill. No one-liner summary. No formula sub-box.

---

### 13.5 — The BONUS Zone

Present in 9 of 19 Stanley images. This is one of Stanley's most distinctive structural moves.

**What it is**: A final zone at the bottom of the image — after all the numbered steps or sections — that gives one extra thing the reader did not expect. It is not a summary. It is not a CTA. It is genuinely additional value.

Examples:
- "BONUS: Comments create validated post ideas. If a comment gets good reach and engagement? You know it will make a great post." (How to Grow with Commenting)
- "BONUS: Speed this up with Stanley — Ask Stanley: 'Analyze my last 20 posts and suggest content pillars...' 2 hours of analysis in 2 minutes" (5 Ways image)

**Why it works**: The BONUS zone rewards the reader who reads to the end. It creates a reason to read the whole image rather than skim and bounce. It also functions as a save trigger — the bonus tip is often the single most practical piece of content in the image.

**Shetty's Desk equivalent**: For AI for SC images, the BONUS could be: a single paste-ready Claude prompt for the topic, a "watch out for" warning from Tiger's field experience, or a "speed this up" shortcut. The Practitioner Notes zone in v4 plays a similar role but is embedded mid-image rather than positioned as an end-of-image reward.

---

### 13.6 — The REPOST CTA System

Stanley uses a specific two-word CTA: **"REPOST to help others"** or **"REPOST TO HELP OTHERS"** — not "Follow me", not "Like and share", not "Comment below."

The framing is community-oriented ("to help others") rather than creator-oriented ("to grow my page"). This distinction is significant. The reader is reposting as an act of generosity to their network, not as a favour to Stanley. It converts differently.

The REPOST badge is part of the brand footer strip — it appears on every image in the same position, same visual treatment. It is not added ad-hoc.

**Shetty's Desk current CTA**: "Follow Poornajith Shetty and Shetty's Desk for more supply chain insights" — creator-oriented, added in Canva. This works but is different in psychology. The Stanley framing is worth testing.

---

### 13.7 — Visual Type Mixing (The Multi-Layer Technique)

Stanley almost never uses a single visual type. Even simple images layer 2 to 3 types:

| Image | Primary type | Secondary type | Tertiary type |
|---|---|---|---|
| 10 Hook Formulas | 2-column card grid | Stat block (80%, 10, Line 1) | Formula template boxes inside each card |
| How to Win on LinkedIn | Multi-section reference table | Annotated post mock-up | Bar chart (70-20-10 rule) |
| 7 Formats | Numbered section cards | Per-section mini-visuals (funnel icon, chart, timeline) | Data footnote strip |
| How to Go Viral with AI | 9-step numbered grid | Live performance chart at top | Paste-ready prompts in each card |
| 5 Stages of Getting Paid | Funnel diagram | Numbered callout text alongside funnel | Bottom conclusion strip |
| How to Grow with Commenting | 2-column comparison table | Flow diagram (conversation ladder) | Emoji icon column |

**What this creates**: The image rewards multiple passes. The first pass (skim) reads the headings and the main visual. The second pass (read) reads the card bodies. The third pass (study) reads the formula boxes and mini-diagrams inside the cards. Three reading depths = three opportunities to earn a save.

**Shetty's Desk gap**: Every AI for SC image uses one visual type. The hub-and-spoke v4 prompt adds a Practitioner Notes panel as a secondary visual type — this is the first step toward this technique. The next iteration should add a third layer.

---

### 13.8 — Stanley's Density Calibration

Stanley is dense but never overwhelming. The technique is **progressive density**: the heading is sparse, the section titles are medium density, the card bodies are high density, and the formula/template sub-boxes are maximum density.

This creates a natural reading path where each layer of detail requires more commitment from the reader. A skimmer gets 20% of the value. A reader gets 60%. A practitioner who studies the formula boxes gets 100%.

**Word counts observed in Stanley images**:
- 10 Hook Formulas: approx 300 words on image
- How to Win on LinkedIn: approx 380 words (their densest image)
- 5 Ways to Never Run Out of Content: approx 260 words
- How to Grow with Commenting: approx 240 words
- 7 Formats: approx 220 words

These are the same density targets identified in Gap 1 of Part 10. Stanley validates the 220-380 word range as the right target.

---

### 13.9 — What Stanley Does NOT Do (Equally Instructive)

Things absent from all 19 Stanley images:

1. **No decorative icons disconnected from content** — every icon directly represents the section concept. No generic "lightbulb for ideas" or "magnifying glass for research."
2. **No gradient backgrounds** — every image uses flat solid fills or white. Gradients appear only on specific accent elements like the funnel shape.
3. **No dark mode or coloured backgrounds** — Stanley uses light backgrounds consistently. This is a distribution decision as much as an aesthetic one: light backgrounds render better as LinkedIn thumbnails and are more legible at small sizes.
4. **No paragraph blocks without structure** — even sections with more flowing copy break it into short lines with arrows or dots. There is never a wall of text.
5. **No heading without a sub-headline** — the claim heading is always paired with a context line. Never a lone heading.
6. **No empty quadrants or dead space** — every region of the canvas carries content. If a section has fewer points, a formula box or mini-diagram fills the space.

---

### 13.10 — Direct Comparisons: Stanley vs Shetty's Desk Current State

| Design decision | Stanley | Shetty's Desk (v3) | Gap |
|---|---|---|---|
| Heading type | Claim ("Stop Posting Blind") | Topic ("Write an RFQ with Claude") | Fixed in v4 |
| Data sub-headline | Specific number proof ("30,451 posts") | Generic ("3 days to 20 min") | Not yet in prompt |
| Card anatomy | 5 layers incl. one-liner summary | 2 layers (title + description) | One-liner added in v4 |
| Card body length | 25-40 words | 8-10 words | Fixed to 20-30 words in v4 |
| Practitioner knowledge layer | Domain-specific insider tips | None | Practitioner Notes added in v4 |
| BONUS zone | Present in 9 of 19 images | None | Next version |
| REPOST CTA framing | "REPOST to help others" | "Follow Poornajith Shetty" | Caption level, not image level |
| Visual type layering | 2-3 types per image | 1 type | 2 types in v4 (hub + notes panel) |
| Word count | 220-380 per image | 120-160 | Fixed to 220-280 in v4 |
| Footer brand strip | Identical on every image | Added in Canva post-generation | Canva process unchanged |
| Step label pills | Pill-shaped bordered badges | Plain bold text or none | Next version |

---

### 13.11 — Priority Techniques to Adopt for Shetty's Desk

Ranked by impact on save rate (highest first):

1. **Claim headings** — Already fixed in v4. Highest single impact. The heading is the scroll-stopper. No other improvement matters if the heading is a topic label.

2. **Data sub-headline with Tiger's credentials** — "Built from 8 years in procurement operations at Tetra Pak" or "Used across 12 sourcing categories." This is the authority signal that makes the insider knowledge credible. Apply to all AI for SC Practitioner posts.

3. **One-liner summary under each card title** — Fixed in v4 card specs. The skimmer reads this. The reader reads the body. Two audiences served by one addition.

4. **Card body at 20-30 words, functional and specific** — Fixed in v4. Generic descriptions ("Claude handles this for you") are not saves triggers. Specific descriptions ("Your bullet list converted into numbered technical clauses with performance thresholds") are.

5. **BONUS zone** — Not in v4 yet. Next highest priority after validating v4. For AI for SC: the BONUS should be the paste-ready Claude prompt or Tiger's single most important field rule for the topic.

6. **REPOST framing in caption** — "REPOST to help a procurement professional in your network" is testable in the next caption without any image change.

7. **Step label pills** — Visual upgrade. Applies more to numbered/step formats than hub-and-spoke. Schedule for next format that uses numbered sequence.

8. **Multi-visual-type layering beyond two** — Post-v4. Add a third layer (formula sub-box, mini-chart, or comparison panel within a card) once the two-layer v4 has been validated through Gemini.
