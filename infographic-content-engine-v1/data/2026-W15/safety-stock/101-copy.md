# 101 Copy — safety-stock
**Week**: 2026-W15
**Topic**: #12 — Safety Stock
**Episode**: 12
**Series**: Supply Chain 101

---

## Selected Hook
**Type**: Paradox
**Text**: Safety stock exists because the future is uncertain. But most companies calculate it using averages, which assume the future behaves like the past. The very thing safety stock is meant to protect against is the thing the formula ignores.

## LinkedIn Caption

Safety stock exists because the future is uncertain. But most companies calculate it using averages, which assume the future behaves like the past. The very thing safety stock is meant to protect against is the thing the formula ignores.

This is Episode 12 of Supply Chain 101. In Episode 11 we covered the bullwhip effect and how demand signals distort as they move upstream. Today we're looking at one of the most direct consequences of that distortion: how much extra inventory you keep as a buffer.

Safety stock is the cushion between your expected demand and reality. When your supplier delivers late, or demand spikes unexpectedly, safety stock is what keeps the customer from waiting.

It sits below your regular inventory (called cycle stock) and above zero, and ideally you never touch it. But it's there so the business doesn't stop when something goes wrong.

The calculation depends on three variables:
- Demand variability: how much does customer demand fluctuate?
- Supply variability: how reliable are your supplier lead times?
- Service level target: what percentage of orders do you want to fulfil from stock?

If demand is stable and your supplier is reliable, you need less safety stock. If either one is volatile, you need more. And if your target service level is 99% instead of 95%, the buffer increases significantly, because that last 4% is expensive.

What most people do not realise is that reducing lead time variability is a better lever than tweaking the safety stock formula. A supplier that always delivers in 10 days needs less buffer than one that averages 10 days but swings between 7 and 15.

When did you last recalculate your safety stock parameters?

---

Found this useful? Follow Poornajith Shetty for more supply chain insights and save/repost this for the next time someone asks why you hold so much (or so little) inventory.

#ShettysDesk #SupplyChainIntelligence #SCM #SupplyChain101 #InventoryManagement

## Hook Options — All 10 (reference)
1. [Question-Why]: "Why does your warehouse hold three months of a product that sells predictably every week? Because someone set a safety stock level years ago, and nobody has recalculated it since."
2. [Question-How]: "How does a company decide to keep 500 extra units of a product on a shelf, just in case? The answer involves three variables. Most companies use one, ignore the other two, and then wonder why they're either overstocked or out of stock."
3. [Stat-Lead]: "Safety stock is the inventory you hope you never need but cannot afford not to have. Most companies either hold too much of it or calculate it with a formula from 1958 and never revisit. Both are expensive. One just shows up on the balance sheet faster."
4. [Contrarian]: "The best way to reduce safety stock isn't a better formula. It's reducing lead time variability. Most companies optimise the calculation when they should be fixing the input. A supplier that delivers in 5 days plus or minus 1 needs far less safety stock than one that delivers in 5 days plus or minus 5."
5. [Paradox]: "Safety stock exists because the future is uncertain. But most companies calculate it using averages, which assume the future behaves like the past. The very thing safety stock is meant to protect against is the thing the formula ignores."
6. [Personal-Reflection]: "I've reviewed safety stock parameters that hadn't been touched in three years. Demand had shifted, lead times had changed, and the buffer was either protecting against a risk that no longer existed or missing one that did. The formula was fine. Nobody was maintaining the inputs."
7. [Result-First]: "An out-of-stock costs you a sale. Excess stock costs you warehouse space, tied-up cash, and eventual markdowns. Safety stock is the buffer between the two, and the difference between too much and too little comes down to three variables most companies don't review often enough."
8. [Timeline-Shock]: "2023: your planner set safety stock at 200 units based on that year's demand variability and a 14-day supplier lead time. 2026: demand has shifted, the supplier now delivers in 9 days, and the safety stock is still 200 units. Nobody changed it. The inventory is costing you money every month for a risk that shrank two years ago."
9. [Comparison-Gap]: "Two products. Same factory. Same supplier. Product A has stable demand and consistent lead times. Product B has seasonal spikes and a supplier that's unreliable. Both have the same safety stock level. One is overstocked. The other keeps running out. The formula doesn't know the difference because nobody told it."
10. [Decision-Pressure]: "When did you last recalculate your safety stock parameters? If the answer is 'when we set them up,' you're either holding too much inventory or not enough, and you won't know which until it costs you."

---

## Gemini Prompt (paste-ready)

Task: Create an infographic image for the summary below (after the rules).

Rules: Use the image attached as a reference on style, aesthetics, colours, and illustration technique. Use a different layout for the structure to elaborate details based on the summary. Do not use any information or text from the attached image — only style. Use it only for inspiration. Aspect ratio 1:1, resolution 2048x2048.

TOPIC: Safety Stock
THE QUESTION THIS ANSWERS: How much extra inventory should I hold just in case?
VISUAL STRUCTURE: Classic inventory sawtooth diagram showing cycle stock rising and falling over time, with a horizontal safety stock line below it. Key elements labelled: reorder point, lead time, cycle stock, safety stock. Below the diagram: the three input variables.

CONTENT TO INCLUDE ON THE IMAGE:
- Heading: "Safety Stock" (Bold, max 8 words)
- Sawtooth inventory diagram:
  - Y-axis: Inventory level
  - X-axis: Time
  - Sawtooth pattern showing inventory rising (replenishment) and falling (demand)
  - Horizontal line near bottom: SAFETY STOCK level
  - Label: CYCLE STOCK (the regular rise-and-fall portion)
  - Label: REORDER POINT (the level at which a new order is triggered)
  - Shaded area: LEAD TIME (the gap between reorder and replenishment arrival)
- Below the diagram — 3 INPUT VARIABLES:
  - Demand variability: How much does demand fluctuate?
  - Supply variability: How reliable are lead times?
  - Service level target: What % of orders to fulfil from stock?
- Annotation: "Consistency matters more than speed."

CONTENT RULES:
- Maximum 60 words total on the image (excluding labels and axis text)
- Heading: maximum 8 words, set in Bold
- Every element must be readable at mobile phone size
- The sawtooth diagram should be the dominant visual element
- Data labels and annotations preferred over paragraph text

DO NOT:
- Use font sizes below 14px at final output resolution
