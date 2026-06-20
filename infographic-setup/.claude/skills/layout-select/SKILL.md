---
name: layout-select
description: Use before code-rendering any infographic, to pick the SINGLE best-matching visual layout for the topic instead of defaulting to one format. Reads references/layout-frameworks-intelligence.md (228 patterns + selector). Run as the visual-spec step inside /101 and /ai-for-sc, or standalone via /layout-select [topic].
---

# Layout Select — the best layout per topic (Shetty's Desk)

## Why this exists
The engine kept defaulting to one layout. This step forces **exploration**: every topic gets the
layout whose *built-in argument matches the idea*, drawn from the research library
`references/layout-frameworks-intelligence.md` (228 patterns, consulting-benchmarked, render-scored).

## The one rule
**The layout must make the argument.** A funnel claims "narrowing"; a 2×2 claims "two independent
trade-offs"; a waterfall claims "contribution/bridge"; an iceberg claims "hidden mass"; a ladder
claims "progression/self-location." If the shape's claim is false for the topic, it is the wrong
layout — even if it looks good. Do **not** reuse last week's layout unless the *shape of the idea* repeats.

## Procedure (≈5 steps)
1. **Name the shape of the idea** in one phrase: sequence · cycle · hierarchy · narrowing · progression ·
   two trade-offs · ranking · part-to-whole · contribution/bridge · hidden cost · comparison ·
   transformation (then→now) · overlap · hub+satellites · decision/branching · trend · schedule ·
   anatomy · single number · distribution · concentric scope · driver tree · risk · reference grid ·
   root cause · journey · spectrum.
2. **Open `references/layout-frameworks-intelligence.md` §1 Selector** → match the shape → get the layout
   + render feasibility [E/M/H]. Cross-check **§1C** (supply-chain trigger words → layout → our 50-format #).
3. **Confirm against §2 Catalog** that the shape's *visual-rhetoric* argues the point (not just decorates).
4. **Prefer §4 shortlist** (high-impact AND Easy/Medium for HTML/CSS/GSAP). Avoid Hard patterns
   (Sankey, chord, treemap, Voronoi, force/network, cartogram) — they need d3 and read poorly at 1:1/mobile.
5. **Emit a one-line visual spec** → feed the render brief:
   `Layout = <pattern> (idea is <shape>); hero = <focal element>; depth = 3D extrusion where it adds clarity; brand = azure+green on white; tool mark = hero corner.`

## Output
Append to the post file under `## Visual Spec`:
- Shape of the idea · chosen layout (+ why it argues the point) · feasibility · the 50-format # (if any) ·
  the one-line spec. Then build the HTML template in `renderer/templates/`, render, QA, and — after the
  still is approved — run `/gif-storyboard` for the motion version.

## Variety guardrail
Before finalizing, check the **last 2–3 posts' layouts** (trackers / recent `renderer/templates/`). If the
selector lands on the same layout, either the ideas genuinely share a shape (fine) or push to the next-best
matching pattern in §2 so the feed shows range.

## New formats to favour (from the research, filling real SC gaps)
Maturity ladder/staircase · cycle/flywheel · concentric rings/onion · Marimekko · tornado · slope chart —
all Easy–Medium to code-render and currently under-used.

## Token budget
~1K. Reads the intelligence file (§1 + relevant §2 rows). Writes the visual spec line into the post.
