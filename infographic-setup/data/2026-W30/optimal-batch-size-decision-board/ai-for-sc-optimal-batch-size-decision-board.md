# AI for Supply Chain — Optimal Batch Size Decision Board

**Week:** `2026-W30`  
**Series:** AI for Supply Chain  
**Episode candidate:** Ep14 / fourth post in the current production-planning set  
**Role:** Supply Planner  
**Tool:** ChatGPT  
**Use case:** calculate and stress-test optimal batch size using setup cost, demand rate, holding cost, and production constraints  
**Visual:** Batch Size Decision Board  

## Workflow Summary

ChatGPT should not be used as a magic calculator that returns one neat EOQ number and ends the conversation. The stronger workflow is to give it the real planning context, ask it to calculate the first-pass formula result, and then force it to build the review artifact the planner needs.

## Input Pack

- demand rate by SKU or product family
- setup cost or changeover time/cost
- holding cost per unit per period
- current batch size
- MOQ or pack-size rule
- production rate if replenishment happens gradually
- shelf-life or expiry rule
- capacity calendar
- service priority
- demand variability
- planner assumptions and comments

## ChatGPT Task

Ask ChatGPT to produce a batch-size decision board:

- first-pass EOQ
- smaller/current/larger batch comparison
- setup or changeover burden
- inventory exposure
- capacity fit
- service risk
- assumptions driving the result
- verification questions before changing ERP/MES or master data

## Boundary / Human Decision Point

ChatGPT structures the model and review board. The planner validates the cost assumptions, capacity calendar, MOQ, shelf life, demand volatility, and ERP/MES impact before any batch-size change becomes real.

## Copy-Paste Prompt Seed

```text
You are helping me prepare a batch-size decision board for a supply planning review.

Use the uploaded spreadsheet and calculate a first-pass EOQ for each SKU or product family using demand rate, setup/order cost, and annual holding cost per unit. If production is gradual rather than received all at once, flag where an EPQ/EBQ-style production-rate adjustment may be more appropriate.

Then build a planner-reviewable table with:
1. current batch size
2. EOQ or calculated first-pass batch
3. smaller-batch option
4. larger-batch option
5. setup/changeover burden
6. inventory exposure
7. capacity fit
8. service risk
9. assumptions that drive the answer
10. verification questions before changing ERP/MES or master data

Do not treat the formula output as the final decision. Show the trade-offs and highlight where the inputs are weak, missing, or require planner validation.
```

## Render Direction

The visual should feel like a premium Shetty's Desk operating artifact: a formula-to-trade-off decision board, not a basic formula cheat sheet. The hero is the decision surface: EOQ core, cost curve, three option lanes, trade-off check, and planner verification strip.
