# AI for SC — Should-Cost Model
**Week**: 2026-W21
**Theme**: Procurement
**Role**: Category Manager
**Tool**: ChatGPT
**Episode**: Ep02
**Visual Format**: Cost Anatomy
**Hero Statement**: "4 layers. 1 you can move."
**Status**: Ready — pending publish

---

## Selected Hook
**Type**: Decision-Pressure / Question-Why
**Text**: Your supplier's price increase lands on your desk 48 hours before the meeting. How much of it can they actually justify?

## LinkedIn Caption

Your supplier's price increase lands on your desk 48 hours before the meeting. How much of it can they actually justify?

Most category managers walk in with last year's price and a margin assumption from memory. The actual cost build stays on their side of the table: raw materials, labour, overhead, and the margin layer sitting on top of all of it. The negotiation opens with their number and you respond to it.

A should-cost model changes that.

Last week, we reviewed we broke down the RFQ now we focus on cost modeling. You give ChatGPT the product specs, the bill of materials in whatever form you have, and the key cost drivers. ChatGPT structures the cost model: separates the four layers, sizes each one proportionally, and returns a should-cost range with the margin layer visible.

Now you know which layers are structural (commodity costs, labour rates, fixed overhead) and which one you can actually move.

How to do it:
• Open ChatGPT. Paste your product specs and any BOM data you have.
• Prompt: "Build a should-cost model for [product]. Components: [list]. Key drivers: [materials, labour region, annual volume]. Show each cost layer as a percentage of total and as an absolute value. Where does supplier margin typically sit in this category?"
• Cross-reference the output against any commodity data you have. Adjust one assumption. You have a credible anchor.
• Walk into the meeting with it.

ChatGPT works here because this is a structuring and calculation task: multiple input types, proportional cost layers, margin separated out.

And one honest limitation: if the product has proprietary inputs the supplier will not disclose, the model becomes directional rather than precise. Use it to anchor the conversation, not to challenge line by line.

What you get: a cost breakdown by layer with percentages and a should-cost range, ready before they present their number.

Try this before your next supplier price review.

---

Follow Poornajith Shetty and Shetty's Desk for more supply chain insights and save this for the next time a price increase arrives without a cost justification attached.

#ShettysDesk #SupplyChainIntelligence #SCM #AIforSupplyChain #Procurement

---

## Gemini Prompt (paste-ready)

Task: Create an infographic image for the summary below (after the rules).

Rules: Use the image attached as a reference on style, aesthetics, colours,
and illustration technique. Use a different layout for the structure to
elaborate details based on the summary. Do not use any information or text
from the attached image — only style. Use it only for inspiration. Aspect
ratio 1:1, resolution 2048x2048.

TOOL IDENTITY: ChatGPT (OpenAI). Background: light neutral Surface (#F7F7F8)
across the entire canvas. All structural accents use OpenAI green (#10A37F).
Text: near-black (#0D0D0D). Tool symbol: a smooth, continuous loop forming
a stylised rounded shape, two curved forms completing each other in a fluid,
seamless circle, like an infinity symbol closed into itself. Rendered in
OpenAI green. Positioned top-right, large and structural, occupying roughly
12% of canvas width. This image should feel like it belongs to ChatGPT's
visual language without reproducing any trademarked logo.

TOPIC: Know Which Cost Layer You Can Actually Move

THE QUESTION THIS ANSWERS: How does a category manager know which part of
a supplier's quoted price is worth arguing before the negotiation starts?

VISUAL FORMAT: Cost Anatomy

VISUAL ANCHOR: The canvas centres on a product component silhouette rendered
as a geological cross-section, cut through the middle to reveal four
concentric cost layers expanding outward like tree growth rings. Each ring
is labelled and proportionally sized to its cost contribution. The margin
layer (outermost interior ring) is highlighted in OpenAI green with a
distinct border, separated visually from the three structural inner layers
rendered in muted tones. The outermost ring is the supplier's quoted price.
The eye enters at the outer ring, moves inward, and stops at the highlighted
margin layer. That layer is the focal point of the entire composition.

VISUAL STRUCTURE: The cross-section occupies the canvas centre. To the
right: a vertical label stack listing each layer with its percentage
contribution as a short horizontal bar. The margin bar is OpenAI green;
the other three bars are muted. Above the cross-section: the hero statement
and heading. The highlighted margin layer is the single most important
element on the canvas.

HERO STATEMENT: "4 layers. 1 you can move." — positioned above the
cross-section, bold, near-black (#0D0D0D). "1 you can move." set in
OpenAI green. Largest text on the canvas. First element the eye finds.

HEADING: "Know Their Cost Before They Reveal Their Price" — bold,
near-black (#0D0D0D). Positioned directly below the hero statement.

CONTENT TO INCLUDE ON THE IMAGE:
- Tool symbol: smooth continuous loop, two curved forms closing into
  each other — OpenAI green, top-right, large and structural
- OUTER RING: "Quoted Price" — supplier reference baseline, labelled
  at outer edge in near-black
- MARGIN LAYER (outermost interior, highlighted): "Supplier Margin" —
  22% band, OpenAI green border. Sub-label: "THE LAYER YOU CAN MOVE"
  in OpenAI green, small italic
- LAYER 3: "Manufacturing Overhead" — 18% band, muted tone
- LAYER 2: "Direct Labour" — 20% band, muted tone
- CORE (innermost): "Raw Material Cost" — 40% band, widest ring, muted tone
- RIGHT PANEL — LAYER SUMMARY (vertical label list with bars):
    Raw Material    40%  [bar — muted grey]
    Labour          20%  [bar — muted grey]
    Overhead        18%  [bar — muted grey]
    Margin          22%  [bar — OpenAI green]
  Margin bar is OpenAI green. All other bars are muted grey.
- ANNOTATION LINE (bottom of canvas, centred, italic, small):
  "AI builds the map. You decide where to push."

CONTENT RULES:
- Total words on image: 80-120 (all text combined)
- Hero statement is the largest text element — first thing the eye finds
- Raw Material core band is widest; Supplier Margin band is narrower.
  Layer widths are proportional to their % values.
- Margin layer is visually distinct from the other three — it is the
  focal element of the entire composition
- Canvas background stays light neutral (#F7F7F8) throughout — no dark zones
- Maximum 2 font families throughout
- Every element readable at mobile phone size
- Aspect ratio 1:1

DO NOT:
- Use font sizes below 14px at final output resolution
- Add decorative elements that do not carry information
- Use gradients on backgrounds — solid colour panels only
- Place text on complex or illustrative backgrounds
- Use more than 2 font families
- Include em dashes anywhere on the image. Replace with a comma or full stop.
- Add source attribution, reference text, or footnote text anywhere
- Leave empty canvas space at the top, bottom, or sides
