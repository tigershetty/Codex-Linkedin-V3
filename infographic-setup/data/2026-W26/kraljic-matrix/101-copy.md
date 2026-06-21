# 101 Copy — kraljic-matrix
**Week**: 2026-W26 · **Run Week**: RW01
**Topic**: The Kraljic Matrix — why you can't manage every supplier the same way
**Episode**: Ep35 (101 series) · **Series**: Supply Chain 101 · Procurement
**Research**: `research-brief.md` (consultant-grade, sourced — HBR 1983 origin, two axes, four quadrants)

---

## Selected Hook
**Type**: Comparison-Gap
**Text**: Buying milk and buying a wedding ring use the same wallet and completely different behaviour. So does procurement.

## LinkedIn Caption

Buying milk and buying a wedding ring use the same wallet and completely different behaviour. So does procurement.

This month on Shetty's Desk we're on procurement, and underneath comparing quotes sits a bigger idea: you can't manage every supplier the same way.

In 1983, Peter Kraljic drew a simple 2x2 in Harvard Business Review. Plot everything you buy on two questions, how much it moves your profit and how hard it is to source, and where it lands tells you how to behave.

• Leverage items are big spend but easy to find, so you make suppliers compete on price.
• Strategic items are critical and hard to replace, so you build the relationship and protect it.
• Bottleneck items are cheap but single-source, so the job is to secure supply before it bites.
• Routine items are the small stuff, so you automate them and stop spending attention there.

Here's the thing most people miss. The instinct is to negotiate hardest where it's easy. The matrix tells you to put your energy where both the stakes and the risk are high.

Which of your suppliers are you treating as routine when they're quietly strategic?

Follow Poornajith Shetty and Shetty's Desk for more supply chain insights, and save this for the next time you plan where your time goes.

#ShettysDesk #SupplyChainIntelligence #SCM #SupplyChain101 #Procurement

---

## Hook Options — All 10 (reference)
1. Question-Why: Why do most teams haggle hardest over the cheapest things they buy?
2. Question-How: How do you know which suppliers to fight on price and which to protect?
3. Stat-Lead: One 2x2 grid, drawn in 1983, still decides how the best buyers spend their time.
4. Contrarian: Treating every supplier the same way is the most expensive habit in procurement.
5. Paradox: The cheapest thing you buy can be the one that stops your whole line.
6. Personal-Reflection: I used to think good buying meant getting everything cheaper. Then someone showed me this grid.
7. Result-First: Sort everything you buy into four boxes, and you instantly know where to spend your attention.
8. Timeline-Shock: A purchase order for paperclips and one for a custom part get the same effort in most companies. They shouldn't.
9. Comparison-Gap: Buying milk and buying a wedding ring use the same wallet and completely different behaviour. So does procurement.
10. Decision-Pressure: If a supplier vanished tomorrow, which of your purchases would actually hurt?

---

## Visual Spec (layout-select)
- **Shape of the idea**: a 2×2 portfolio map (segmentation). **Composition Mode A** — single hero matrix with in-place quadrant annotations.
- **Selected layout**: genuinely-3D isometric 2×2 (JS clip-path isometry) — four raised tiles, **height encodes management attention** (Strategic tallest → Routine flattest). Axes: "Supply risk →" and "↑ Profit impact". Quadrant cards (name + posture pill + everyday example). Bottom panel: the two axis-questions + the four resulting playbooks (fills space with teaching, no AI-tool logo).
- Brand frame: azure/eco/ink/Poppins on white; coral = the Bottleneck (risk) tile only. Footer = Logo 2 + signature.

## Code-render visual (primary)
`renderer/templates/sc101-kraljic-matrix.html` → `renderer/out/sc101-kraljic-matrix.png` → `visual.png`. Isometric raised-tile 2×2; built 2026-06-21 to the new standard, every label from the research brief.

## GIF (HyperFrames / GSAP anim lane)
`renderer/templates/sc101-kraljic-matrix-anim.html` → `renderer/out/sc101-kraljic-matrix.gif` (+ `.mp4`). **Motion spine:** *build the field, the tallest tile resolves*. Tiles rise short→tall (Routine → Leverage/Bottleneck → **Strategic** rises tallest and pulses), then quadrant cards pop, axis labels draw, the two-question + four-playbook panel staggers in, insight lands. ~4.8s + 1.5s hold, loops. Paused GSAP timeline (`window.__tl/__dur/__ready`); render via `render-anim.mjs` (`HOLD_S=1.5 GIF_W=640`).

## ChatGPT Image 2 Prompt (backup, paste-ready)
```
Task: Create an infographic image for the summary below.
Rules: Use the attached image only for style/colour/illustration technique, not content. Square or 4:5.
TOPIC: The Kraljic Matrix — managing suppliers by type
VISUAL ANCHOR: A clean isometric 2x2 grid of four raised tiles seen at a slight angle, the back-right tile tallest and brightest, the front tile lowest and muted; the eye lands on the tall tile first, then reads the grid. Crisp, dimensional, lots of calm white space around it.
VISUAL STRUCTURE: 2x2 matrix. X-axis "Supply risk", Y-axis "Profit impact". Four labelled quadrants.
CONTENT TO INCLUDE:
- Heading: "Four kinds of spend. Four ways to buy."
- Top-right tile "STRATEGIC — partner & protect"
- Top-left tile "LEVERAGE — push on price"
- Bottom-right tile "BOTTLENECK — secure supply"
- Bottom-left tile "ROUTINE — automate & forget"
- Axis labels: "Supply risk →", "↑ Profit impact"
CONTENT RULES: max ~55 words on image; every label readable at phone size; the tallest tile is the focal point.
DO NOT: use font sizes below 14px; add decorative elements that carry no information.
```
