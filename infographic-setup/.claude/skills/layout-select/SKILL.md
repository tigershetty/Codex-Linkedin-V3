---
name: layout-select
description: Use before code-rendering any infographic, to pick 3 DISTINCT best-matching visual layouts for the topic (one per render variant) instead of defaulting to one format. Reads references/layout-frameworks-intelligence.md (228 patterns + selector). Run as the visual-spec step inside /101 and /ai-for-sc, or standalone via /layout-select [topic].
---

# Layout Select — 3 distinct layouts per topic (Shetty's Desk)

## Why this exists
The engine kept defaulting to one layout. This step forces **exploration**: every topic gets the
layouts whose *built-in argument matches the idea*, drawn from the research library
`references/layout-frameworks-intelligence.md` (228 patterns, consulting-benchmarked, render-scored).

## What it returns (changed 2026-06-28)
The visual step now renders **3 distinct variants per post** for the user to pick one — so this skill
returns **3 different frameworks**, not one. The 3 must use **3 different benchmark patterns and 3
different hero devices** (e.g. a slope/bump crossing, an integrated Mode-A hero map, and a part-to-whole
or 2×2 cut) — three different skeletons that each argue the same idea a different way, never recolours of
one layout. All 3 still obey the one rule below.

## The one rule
**The layout must make the argument.** A funnel claims "narrowing"; a 2×2 claims "two independent
trade-offs"; a waterfall claims "contribution/bridge"; an iceberg claims "hidden mass"; a ladder
claims "progression/self-location." If the shape's claim is false for the topic, it is the wrong
layout — even if it looks good. Do **not** reuse last week's layout unless the *shape of the idea* repeats.

## Procedure (≈6 steps)
1. **Name the shape of the idea** in one phrase: sequence · cycle · hierarchy · narrowing · progression ·
   two trade-offs · ranking · part-to-whole · contribution/bridge · hidden cost · comparison ·
   transformation (then→now) · overlap · hub+satellites · decision/branching · trend · schedule ·
   anatomy · single number · distribution · concentric scope · driver tree · risk · reference grid ·
   root cause · journey · spectrum. Most ideas legitimately support **several** shapes — list the 3–4 that fit.
2. **Open `references/layout-frameworks-intelligence.md` §1 Selector** → match each shape → get the layout
   + render feasibility [E/M/H]. Cross-check **§1C** (supply-chain trigger words → layout → our 50-format #).
3. **Confirm against §2 Catalog** that each shape's *visual-rhetoric* argues the point (not just decorates).
4. **Prefer §4 shortlist** (high-impact AND Easy/Medium for HTML/CSS/GSAP). Avoid Hard patterns
   (Sankey, chord, treemap, Voronoi, force/network, cartogram) — they need d3 and read poorly at 1:1/mobile.
5. **Choose the 3 most distinct winners** — 3 different benchmark patterns + 3 different hero devices, each
   with its own composition mode (A hero-dominant/integrated vs B layered multi-block). Reject any pair that
   shares a skeleton; reach for the next-best matching pattern instead. Rank them best→third.
6. **Emit 3 one-line visual specs** (V1/V2/V3) → feed the render brief, each:
   `Layout = <pattern> (idea is <shape>); mode = <A integrated 60–70% hero | B layered hero + 2–3 elements>; hero = <focal element>; depth = real 3D via JS clip-path isometry where it adds clarity (not CSS 3D transforms); brand = azure+green on white; tool mark = hero corner (AI-for-SC only — 101 has none).`

## Output
Append to the post file under `## Visual Spec`:
- Shape of the idea · the **3 chosen layouts (V1/V2/V3)** (+ why each argues the point) · feasibility · the
  50-format # (if any) · the 3 one-line specs. Then build **3 HTML templates** (`...-v1/-v2/-v3.html`),
  render and QA each, present all 3, and — after the user picks one — run `/gif-storyboard` on the chosen
  variant for the motion version if it earns it.

## Variety guardrail
The **within-post** rule is the guarantee: the 3 variants must be mutually distinct (3 patterns, 3 hero
devices) every run, so each post already shows range. As a soft extra, if a framework was used on the
**last post**, prefer a fresh one for the new post's V1 — but the hard requirement is the 3-distinct-within-
the-post rule, not a cross-week tracker.

## Composition mode — A (integrated) vs B (layered) (2026-06-21)
After the layout, decide how much of the canvas the hero owns. **The mode follows the topic shape:**
- **Mode A — hero-dominant / integrated.** *One complex thing* (a single mechanism, "how X works", one object with many facets). The hero takes **60–70% of the canvas** and the supporting detail is embedded *into and around* it — leader-line annotations pinned to points on the hero, in-place data labels on each element, anchored micro-viz beside each part, an embedded value axis/legend, a zoom inset — **instead of adding separate blocks**. *Guardrail:* only works on a strict anchor grid with leader lines; pinned, lined annotations read consulting-grade — loose floating text is the "text all over the place" reject.
- **Mode B — layered multi-block.** *A comparison / ranking / multiple independent data cuts.* A 3D hero + 2–3 clean supporting elements, the **4-layer** pattern: gestalt (3D hero) + precision (scorecard) + proportion (part-to-whole) + narration (side callouts). **Fill whitespace with information, not decoration.** (Exemplar: `renderer/templates/sc101-quote-iso-towers.html`.)
- A single still may **combine benchmark patterns** (e.g. stacked towers #43 + Harvey balls #106 + part-to-whole #44 + side callouts); reserve unused patterns (radar #74, slope #71, tornado #109, bullet #75) for later posts on the same topic so the feed shows range.

## Depth: use real isometric 3D, not CSS 3D transforms
When the spec calls for 3D, build it with **JS-computed `clip-path` isometry** (`iso(u,v)=[OX+(u−v)*a, OY+(u+v)*b]`; cap lightest → left wall mid → right wall darkest). CSS 3D transforms (`rotateX/Y`, `translateZ`, `preserve-3d`) are fragile and were abandoned. See `renderer/README.md` §6b and `render-pilot-workflow.md` §2b.

## New formats to favour (from the research, filling real SC gaps)
Maturity ladder/staircase · cycle/flywheel · concentric rings/onion · Marimekko · tornado · slope chart —
all Easy–Medium to code-render and currently under-used.

## Token budget
~1–2K. Reads the intelligence file (§1 + relevant §2 rows). Writes the 3 visual-spec lines (V1/V2/V3) into the post.
