# Supply Chain 101 — The Procurement Funnel

**Plan Week**: PW23 · **Run Week**: RW01 · **ISO**: 2026-W26
**Topic**: The procurement funnel — from 100 suppliers to 1 signed PO
**Episode**: 101 Advanced — Procurement / Supplier evaluation (Post 2)
**The question it answers**: How do we go from a long list of potential suppliers to actually placing the order?

---

## Selected Hook
**Type**: Result-First
**Text**: 100 suppliers on the market. 1 signed purchase order. Everything that goes wrong later usually traces back to a step someone skipped in between.

---

## 10 Hook Options

1. **Result-First** — 100 suppliers on the market. 1 signed purchase order. Everything that goes wrong later usually traces back to a step someone skipped in between.
2. **Contrarian** — Most teams skip steps in sourcing because they are busy. Every skipped step is a risk you carry straight into the contract.
3. **Question-How** — How do you get from a list of a hundred possible suppliers down to the one you actually trust with the order?
4. **Stat-Lead** — You start with maybe 100 options and end with 1. The four filters in between are the entire job.
5. **Comparison-Gap** — A long list is not a shortlist, and a shortlist is not a decision. Most sourcing pain comes from treating them as the same thing.
6. **Paradox** — The more suppliers you start with, the safer it feels, and the more dangerous it gets if you don't filter them properly.
7. **Personal-Reflection** — I've watched teams jump straight from "here's a list" to "sign the PO," and I've watched what it costs them six months on.
8. **Decision-Pressure** — The order needs placing this quarter. The temptation is to shortcut the funnel. The shortcut is exactly what you'll be explaining later.
9. **Question-Why** — Why does the supplier who looked perfect on the website become the problem nobody can fix?
10. **Timeline-Shock** — Narrowing a hundred suppliers to one should take weeks. Done in an afternoon, it takes years to recover from.

---

## LinkedIn Caption

100 suppliers on the market. 1 signed purchase order. Everything that goes wrong later usually traces back to a step someone skipped in between.

We're on procurement this month at Shetty's Desk, and once you know how to score quotes, the next question is how you got to those quotes in the first place. That path has a shape, and it is a funnel.

It usually runs like this. You start broad, with everyone who could supply the thing. You qualify them down with a quick request for information, asking the basic questions that rule most names out fast. The ones left get a proper request for quotation. You evaluate those against the criteria that matter, and you award to one.

• The widest stage is the cheapest place to say no, so be generous about who you let in and ruthless about who moves up.

• The middle is where the real work lives. An RFI tells you who is capable. An RFQ tells you who is competitive. They are different questions, and rushing them together is where teams lose visibility.

• The narrow end feels like a formality. It is not. The reference check and the final terms are the last cheap chance to catch something before it becomes a contract.

If you look at the bigger picture, the most important filter is not price at any stage. It is whether the supplier can grow with you, because the order you place today is rarely the last one.

At which stage in this funnel does your team spend the least time, and is that the stage that keeps producing surprises?

Follow Poornajith Shetty and Shetty's Desk for more supply chain insights, and save this as the map for your next sourcing project.

#ShettysDesk #SupplyChainIntelligence #SCM #SupplyChain101 #Procurement

---

## Visual Spec (layout-select)
- **Shape of the idea:** sequential narrowing — many candidates filtered down to one decision, with a named gate between each stage.
- **Selected layout:** **3D funnel** (stacked tapered frustums). Each stage is a true 3D frustum with an elliptical rim and curvature shading, so the cone reads as a physical funnel, not flat bands. The decreasing width encodes the argument — the widest stage is the "cheapest place to say no", the narrowest (eco-green "Awarded" tip) is where a wrong call costs most. An annotation rail names the filter at each level without crowding the cone (max white space). Distinct from the iso value-towers used in Post 1 this week (variety across the week).
- **Feasibility:** Medium (JS-computed frustums + rims) · **Brand:** azure→deep-blue range with eco "awarded" tip, elliptical 3D rims + cast shadow, no tool mark (101).

## Code-render visual (primary)
`renderer/templates/sc101-procurement-funnel-3d.html` → `renderer/out/sc101-procurement-funnel-3d.png` (3D funnel, azure+green brand system) → `visual.png`. Exact stage counts (100→20→8→3→1), filter rail, drop-counts, eco awarded tip, "purchase order signed" pill. The ChatGPT Image 2 prompt below is the illustration fallback. (`sc101-procurement-funnel.html` is the prior flat-trapezoid version, kept for reference.)

## ChatGPT Image 2 Prompt

A clean, modern supply chain infographic in a 4:5 portrait format on a luminous white-to-very-light-blue background. Title at top in bold dark navy: "The Procurement Funnel" with a smaller subtitle "From 100 suppliers to 1 signed PO." Centre shows a clear vertical funnel narrowing top to bottom, with five stages, each a horizontal band getting smaller: "100 — On the market", "20 — RFI qualified", "8 — RFQ issued", "3 — Evaluated", "1 — Awarded + PO signed". Each band has a short one-line filter label to its right on a thin annotation rail. The bands use a graduated azure-to-deep-blue range, and the final "1 — Awarded" band is highlighted in a fresh eco-green. Flat, geometric, premium business style. Azure blue (#2798FB) and its darker range for the funnel, eco-green (#38E6A6) for the awarded stage, ink-blue (#15315C) text, Poppins-style geometric sans-serif. Generous white space, clean geometry, no photographic elements. Do not render any logos.
