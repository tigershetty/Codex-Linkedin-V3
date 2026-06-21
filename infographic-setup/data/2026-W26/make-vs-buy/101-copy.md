# 101 Copy — make-vs-buy
**Week**: 2026-W26 · **Run Week**: RW01
**Topic**: Make vs. Buy — the decision that quietly shapes the whole business
**Episode**: Ep36 (101 series) · **Series**: Supply Chain 101 · Procurement
**Research**: `research-brief.md` (consultant-grade, sourced — TCE/Williamson, Prahalad & Hamel HBR 1990, TCO)

---

## Selected Hook
**Type**: Contrarian
**Text**: "It's cheaper to buy" is only half the question, and the wrong half to start with.

## LinkedIn Caption

"It's cheaper to buy" is only half the question, and the wrong half to start with.

We're on procurement this month at Shetty's Desk, and this is the decision that quietly shapes the whole business: do you make something yourself, or buy it from a supplier?

It feels like a price comparison, but it isn't. Two ideas sit underneath it. Transaction cost economics says make it in-house when dealing with the market is too costly or risky, and buy when the market does it cleanly. The core-competence view says keep what makes you different and outsource the rest.

So you weigh both sides on more than cost:

• Make gives you control and builds your own capability, but you carry the fixed cost and own every defect.
• Buy rents a supplier's expertise and flexes with demand, but adds dependency and hands them the margin.

And the honest comparison is total cost of ownership, not the price per unit. The cheap quote that ties up your critical know-how can be the most expensive call you make.

My view on this is simple: buy what the market makes better and cheaper, and make what makes you, you.

Where have you outsourced something that turned out to be core?

Follow Poornajith Shetty and Shetty's Desk for more supply chain insights, and save this before your next build-or-buy call.

#ShettysDesk #SupplyChainIntelligence #SCM #SupplyChain101 #Procurement

---

## Hook Options — All 10 (reference)
1. Question-Why: Why do some companies build the very thing their rival just outsourced?
2. Question-How: How does a company decide what to build itself and what to buy in?
3. Stat-Lead: Two of the ideas behind this decision earned a Nobel and a landmark HBR paper.
4. Contrarian: "It's cheaper to buy" is only half the question, and the wrong half to start with.
5. Paradox: The cheaper option can quietly cost you the thing that made you special.
6. Personal-Reflection: I used to think make-vs-buy was a finance call. It's really a strategy call.
7. Result-First: Decide what's core to you first, and the make-or-buy answer almost falls out on its own.
8. Timeline-Shock: Outsource it this year to save money, lose the capability in three, miss it forever.
9. Comparison-Gap: Cooking dinner or ordering in is the same call companies make on everything they sell.
10. Decision-Pressure: If you outsourced your hardest process tomorrow, would you be saving money or giving away your edge?

---

## Visual Spec (layout-select)
- **Shape of the idea**: a trade-off / decision. **Composition Mode A→B hybrid** — a single hero metaphor (3D balance scale) plus a data-dense decision table.
- **Selected layout**: a balance-scale hero (SVG, dimensional) with the **gating question above it** ("Is it core to what makes you, you?" → YES keep in-house / NO buy in) and two pans labelled MAKE / BUY. Below it, a **MAKE-vs-BUY decision table** across five dimensions (Cost, Capability, Risk, Quality, Speed/fit) with a closing rule: decide on total cost of ownership, not unit price. The table is the whitespace filler (like the quote-towers scorecard).
- Brand frame: azure/eco/ink/Poppins on white; coral = "unit price" caution only. No AI-tool logo. Footer = Logo 2 + signature.

## Code-render visual (primary)
`renderer/templates/sc101-make-vs-buy.html` → `renderer/out/sc101-make-vs-buy.png` → `visual.png`. Balance hero + 5-dimension decision table; built 2026-06-21 to the new standard. Refined 2026-06-21: scale raised and dashed YES→MAKE / NO→BUY connectors added to fill the dead zone above the beam.

## GIF (HyperFrames / GSAP anim lane)
`renderer/templates/sc101-make-vs-buy-anim.html` → `renderer/out/sc101-make-vs-buy.gif` (+ `.mp4`). **Motion spine:** *the question, then the answer* (versus). The gating question drops in → the balance scale assembles (stand, beam opens from centre, pans drop) → the dashed connectors flow to each pan → the 5-row decision table answers row by row → the **total-cost-of-ownership** footer resolves eco. ~4.6s + 1.5s hold, loops. Paused GSAP timeline; SVG grouped (`#stand/#beamG/#hangers/#pansG`); render via `render-anim.mjs` (`HOLD_S=1.5 GIF_W=640`).

## ChatGPT Image 2 Prompt (backup, paste-ready)
```
Task: Create an infographic image for the summary below.
Rules: Use the attached image only for style/colour/illustration technique, not content. 4:5 portrait.
TOPIC: Make vs. Buy — build it in-house or buy from a supplier
VISUAL ANCHOR: A clean, dimensional balance scale centred on the canvas, level and in equilibrium, two shallow pans either side. A short question floats above the pivot; the eye lands on the question, then the two pans. Calm, premium, lots of white space.
VISUAL STRUCTURE: Balance scale, MAKE pan left, BUY pan right, gating question above. A small comparison table beneath.
CONTENT TO INCLUDE:
- Heading: "Build it yourself, or buy it in?"
- Above the pivot: "Is it core to what makes you, you?"
- Left pan: "MAKE — build in-house"
- Right pan: "BUY — source from a supplier"
- One line under the scale: "Decide on total cost of ownership, not the unit price."
CONTENT RULES: max ~50 words on image; readable at phone size; the scale is the dominant element.
DO NOT: use font sizes below 14px; tilt the scale heavily to one side; add decorative clutter.
```
