# 101 Copy — abc-xyz-inventory-classification
**Week**: 2026-W16
**Topic**: #14 — ABC/XYZ Inventory Classification
**Episode**: 14
**Series**: Supply Chain 101

---

## Selected Hook
**Type**: Stat-Lead
**Text**: 20% of your SKUs drive 80% of your revenue. That's the Pareto principle, and most supply chain teams know it. But revenue alone doesn't tell you how to plan them from an SC perspective. It is the second dimension, demand predictability, that changes everything.

## LinkedIn Caption

20% of your SKUs drive 80% of your revenue. That's the Pareto principle, and most supply chain teams know it. But revenue alone doesn't tell you how to plan them from an SC perspective. It is the second dimension, demand predictability, that changes everything.

This is Episode 14 of Supply Chain 101. In Episodes 12 and 13 we covered safety stock and lead time. Today we're looking at how you decide which SKUs deserve the most planning attention in the first place, because treating 10,000 SKUs the same way is how planners burn out and inventory gets misallocated.

ABC classification sorts your SKUs by value contribution:
- A items: the top 20% of SKUs that drive roughly 80% of revenue
- B items: the next 30% contributing around 15%
- C items: the bottom 50% contributing the remaining 5%
That's useful, but it only tells you what matters financially. It doesn't tell you how to plan it. That's where XYZ comes in.

XYZ classification sorts by demand predictability:
- X items: stable, predictable demand (low forecast error)
- Y items: some variability, often seasonal or trend-driven
- Z items: erratic, unpredictable, hard to forecast

Combine the two into a 3x3 matrix, and suddenly the planning approach becomes obvious:
- AX (high value, stable demand): automate replenishment, minimal manual intervention
- AZ (high value, erratic demand): your planner's full attention, manual review, tighter safety stock monitoring
- CZ (low value, erratic demand): seriously consider whether these should still be in your catalogue

The matrix doesn't just classify inventory. It classifies where human effort should go. And in most organisations, that effort is spread evenly when it should be concentrated.

How many SKUs fall in your CZ box, and does anyone review them?

---

Found this useful?
Follow Poornajith Shetty for more supply chain insights and save/repost this for the next time someone asks how to prioritise 10,000 SKUs with a team of five.

#ShettysDesk #SupplyChainIntelligence #SCM #SupplyChain101 #InventoryManagement

## Hook Options — All 10 (reference)
1. [Question-Why]: "Why does your planner spend the same amount of time on a SKU that sells 10 units a year as one that sells 10,000? Because nobody told the system which ones matter, and the planning logic treats them all the same."
2. [Question-How]: "How do you manage 10,000 SKUs when your planning team has capacity for maybe 500? You don't manage all of them. You classify them, and the classification tells you which ones need human attention and which ones can run on autopilot."
3. [Stat-Lead]: "20% of your SKUs drive 80% of your revenue. That's the Pareto principle, and most supply chain teams know it. But revenue alone doesn't tell you how to plan them. The second dimension, demand predictability, changes everything."
4. [Contrarian]: "Sorting your inventory by revenue is useful but incomplete. A high-revenue SKU with stable demand is easy to plan. A high-revenue SKU with erratic demand is a nightmare. Same revenue contribution, completely different planning approach. One dimension isn't enough."
5. [Paradox]: "Your most valuable SKU and your most problematic SKU might generate the same revenue. The difference is that one sells predictably every week and the other spikes without warning. Revenue tells you what matters. Demand pattern tells you how to manage it."
6. [Personal-Reflection]: "I've seen teams pour planning effort into high-revenue SKUs that practically manage themselves because demand is rock-steady, while ignoring lower-revenue items with volatile demand that kept causing stockouts. The effort was misallocated because the classification only had one axis."
7. [Result-First]: "Stockouts on your top products. Excess inventory on your slow movers. Both problems often trace back to the same root cause: every SKU getting the same planning logic regardless of its value or demand behaviour. Classification fixes that."
8. [Timeline-Shock]: "Monday: your planner manually reviews safety stock for a SKU that sells 5 units a month with clockwork regularity. Tuesday: that same planner doesn't have time to review a SKU that sells 5,000 units a month with demand that swings 40% week to week. Both got the same priority in the system. One needed attention. The other didn't."
9. [Comparison-Gap]: "ABC tells you which SKUs drive the most revenue. XYZ tells you which SKUs have the most predictable demand. Alone, each gives you half the picture. Combined in a 3x3 matrix, they tell you exactly where to focus your planning effort and where to automate."
10. [Decision-Pressure]: "How many of your SKUs fall in the CZ box: low revenue, unpredictable demand? And does anyone review whether they should still be in the catalogue?"

---

## Gemini Prompt (paste-ready)

Task: Create an infographic image for the summary below (after the rules).

Rules: Use the image attached as a reference on style, aesthetics, colours, and illustration technique. Use a different layout for the structure to elaborate details based on the summary. Do not use any information or text from the attached image — only style. Use it only for inspiration. Aspect ratio 1:1, resolution 2048x2048.

TOPIC: ABC/XYZ Inventory Classification
THE QUESTION THIS ANSWERS: I have 10,000 SKUs. How do I decide which ones get attention?
VISUAL STRUCTURE: A 3x3 matrix grid. Rows labelled A/B/C (revenue contribution, high to low). Columns labelled X/Y/Z (demand predictability, stable to erratic). Each cell contains a short planning implication.

CONTENT TO INCLUDE ON THE IMAGE:
- Heading: "ABC/XYZ Matrix" (Bold, max 8 words)
- Row labels (left side): A (top 20% sales, ~80% revenue), B (next 30% sales, ~15% revenue), C (bottom 50% sales, ~5% revenue)
- Column labels (top): X (Stable demand), Y (Variable demand), Z (Erratic demand)
- 9 cells with short planning actions:
  - AX: Automate replenishment
  - AY: Forecast-driven, regular review
  - AZ: Manual attention, tight monitoring
  - BX: Automate with periodic check
  - BY: Standard planning
  - BZ: Review safety stock frequently
  - CX: Minimal effort, auto-reorder
  - CY: Reduce complexity
  - CZ: Consider discontinuing

CONTENT RULES:
- Maximum 60 words total on the image (excluding labels and axis text)
- Heading: maximum 8 words, set in Bold
- Every element must be readable at mobile phone size
- The 3x3 matrix should be the dominant visual element
- Data labels and annotations preferred over paragraph text

DO NOT:
- Use font sizes below 14px at final output resolution
