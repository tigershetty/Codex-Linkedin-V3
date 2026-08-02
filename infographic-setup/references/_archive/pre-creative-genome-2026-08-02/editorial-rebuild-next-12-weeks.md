# Editorial Rebuild — Next 12 Weeks

**Date:** 2026-06-30  
**Status:** Historical candidate/reframing board; V4 weekly admission supersedes its pair-selection rule
**Input files:** `master-calendar.md`, `101-plan.md`, `ai-for-sc-plan-v2.md`, `audience-intelligence.md`, `topic-selection-scorecard.md`, `analytics-log.csv`, `content-engine-audit-v1.md`

## Purpose

This file converts the existing calendar from a curriculum sequence into an audience-led editorial board.

The original calendar remains useful as a candidate library. This rebuild decides what should actually be built, what needs reframing, and what should be parked.

## Editorial Rules

1. Every topic must serve a defined audience segment.
2. Every topic must have a meeting-room or workflow use.
3. Every topic must produce a reusable takeaway.
4. Every visual must express an argument, not decorate a definition.
5. AI-for-SC posts must produce an artifact: prompt, table schema, checklist, model, dashboard, or meeting narrative.
6. Career leverage and operating mental models must appear regularly because analytics show they create saves and followers.

## External Benchmark Inputs

These are not topic sources by themselves; they explain what the calendar must respond to.

| Signal | Why it matters for Shetty's Desk |
|---|---|
| LinkedIn feed ranking has moved toward sequential relevance and time-spent optimization | Posts need stronger professional relevance, retention, and save-worthy utility. |
| Gartner-reported AI skill demand in supply chain is accelerating sharply | AI-for-SC should shift from "tool demo" to "career and workflow capability." |
| Agentic AI supply-chain research is emerging around disruption monitoring, retail operations, and human-in-loop coordination | AI content should cover workflow orchestration, verification, and governance, not only prompting. |
| Supply-chain/cyber resilience concern is rising around third-party risk and visibility gaps | Procurement and supplier-risk topics should connect to concentration, visibility, and dependency mapping. |

Benchmark links are tracked in `content-engine-audit-v1.md` and should be refreshed during each signal scan.

## Scoring Legend

| Score | Action |
|---:|---|
| 90-100 | Build now |
| 85-89 | Strong |
| 75-84 | Build if reframed well |
| 60-74 | Reframe before build |
| <60 | Park or replace |

## RW03 — Supplier Performance

**Original row:** Supplier concentration risk · Supplier performance review · Supplier flexibility matrix · Supplier risk profile  
**Audience priority:** managers, category managers, supply planners  
**Editorial thesis:** supplier performance is not a scorecard problem; it is dependency, accountability, and switching optionality.

| Slot | Original | Score | Decision | Rebuilt angle |
|---|---|---:|---|---|
| 101 P1 | Supplier concentration risk | 88 | Build | **The 3 suppliers that can stop your company** — many suppliers on paper, very few true alternatives in practice. |
| 101 P2 | Supplier performance review | 76 | Reframe | **Why supplier reviews change nothing** — the review loop fails when it produces scores without consequences. |
| AI P3 | Supplier flexibility matrix | 84 | Build if artifact-led | **Can this supplier absorb a demand spike?** Claude builds a flexibility matrix from capacity, lead time, and allocation history. |
| AI P4 | Supplier risk profile | 86 | Build | **Your supplier risk profile is missing the dependency map** — Gemini gathers public signals, but human verifies exposure and alternatives. |

**Weekly mix:** risk map + failure-mode loop + AI matrix + AI risk profile.  
**Visual direction:** dependency Pareto, performance review loop with broken handoff, flexibility matrix, supplier-risk dossier.

## RW04 — Demand Forecasting

**Original row:** How demand forecasting works · Demand plan vs forecast · Demand decomposition · Demand review dashboard  
**Audience priority:** demand planners, S&OP analysts, non-SC leaders  
**Editorial thesis:** forecasts do not fail because people cannot predict the future; they fail because organizations confuse numbers, decisions, and assumptions.

| Slot | Original | Score | Decision | Rebuilt angle |
|---|---|---:|---|---|
| 101 P1 | How demand forecasting works | 74 | Reframe | **Why your forecast is wrong in the same direction every month** — forecast error as signal, not embarrassment. |
| 101 P2 | Demand plan vs forecast | 87 | Build | **A forecast is a number. A demand plan is a decision.** |
| AI P3 | Demand decomposition | 86 | Build | **Trend, seasonality, noise: which part is actually wrong?** Claude turns historical demand into an error diagnosis. |
| AI P4 | Demand review dashboard | 78 | Reframe | **The demand review needs a narrative, not another dashboard** — Copilot turns variance into decision notes. |

**Weekly mix:** operating distinction + decision narrative + diagnostic AI.  
**Visual direction:** number-to-decision split, decomposition layers, variance-to-decision board.

## RW05 — Production Planning

**Original row:** What is a production plan · Scheduling horizon · Sequence to cut changeover · EOQ batch size  
**Audience priority:** planners, production managers, commercial peers who ask for changes  
**Editorial thesis:** production planning is where demand ambition meets factory physics.

| Slot | Original | Score | Decision | Rebuilt angle |
|---|---|---:|---|---|
| 101 P1 | What is a production plan | 70 | Reframe | **The demand plan says 10,000 units. What does the factory actually do next?** |
| 101 P2 | Scheduling horizon | 88 | Build | **Why this week is locked but next month is flexible** — frozen, slushy, liquid zones as a conflict reducer. |
| AI P3 | Sequence to cut changeover | 87 | Build | **The schedule is feasible but still wastes capacity** — Claude proposes sequences and the planner verifies constraints. |
| AI P4 | Optimal batch size / EOQ | 80 | Build if practical | **The batch size that looks efficient may be tying up cash** — ChatGPT calculates the cost curve, human checks assumptions. |

**Weekly mix:** non-SC explanation + planning fence + sequencing workflow + cost model.  
**Visual direction:** demand-to-factory translation cascade, planning fence, sequence board, cost curve.

## RW06 — MPS / BOM

**Original row:** MPS commitment · BOM/MPS connection · Sensing vs monthly SKUs · FVA  
**Audience priority:** planners, analysts, early-career SC professionals  
**Editorial thesis:** planning maturity improves when teams know what is locked, what explodes into requirements, and what actually adds forecast value.

| Slot | Original | Score | Decision | Rebuilt angle |
|---|---|---:|---|---|
| 101 P1 | MPS as commitment | 82 | Build with clarity | **The production plan becomes real when the MPS freezes** |
| 101 P2 | BOM ↔ MPS connection | 78 | Reframe | **One MPS change can trigger 200 component decisions** |
| AI P3 | Sensing vs monthly SKUs | 85 | Build | **Not every SKU deserves the same forecast cycle** — Claude segments SKUs by variability and volume. |
| AI P4 | FVA | 86 | Build | **Did your human override improve the forecast or add noise?** ChatGPT calculates forecast value-add. |

**Weekly mix:** planning commitment + hidden explosion + segmentation + accountability metric.  
**Visual direction:** lock/freeze timeline, BOM explosion, two-track forecast map, FVA before/after.

## RW07 — S&OP

**Original row:** 5 pre-S&OP reviews · What kills S&OP · Demand review narrative · Forecast tracker  
**Audience priority:** managers, S&OP analysts, cross-functional leaders  
**Editorial thesis:** S&OP fails when the meeting tries to do the work the process should have done before it.

| Slot | Original | Score | Decision | Rebuilt angle |
|---|---|---:|---|---|
| 101 P1 | 5 pre-S&OP reviews | 86 | Build | **The executive S&OP meeting is not where the work happens** |
| 101 P2 | What kills S&OP | 91 | Build now | **Why your S&OP produces slides but no decisions** |
| AI P3 | Demand review narrative | 88 | Build | **Turn variance tables into a decision story** — Claude drafts the narrative, analyst verifies causes. |
| AI P4 | Forecast accuracy tracker | 78 | Reframe | **Which product family is dragging the forecast down?** Copilot builds the tracker and flags bias. |

**Weekly mix:** process map + failure modes + narrative artifact + tracker.  
**Visual direction:** pre-work chain, broken decision loop, narrative card, accuracy heatmap.

## RW08 — Capacity Planning

**Original row:** Capacity utilization · RCCP · bottleneck by cycle time · 3 capacity scenarios  
**Audience priority:** production planners, supply planners, operations managers, leadership peers  
**Editorial thesis:** capacity planning is the difference between a plan that looks good and a factory that can execute it.

| Slot | Original | Score | Decision | Rebuilt angle |
|---|---|---:|---|---|
| 101 P1 | Capacity utilization | 89 | Build | **100% utilization is how a factory loses flexibility** |
| 101 P2 | RCCP | 83 | Build if reframed | **The S&OP plan is approved. Can the factory actually build it?** |
| AI P3 | Bottleneck by cycle time | 86 | Build | **The bottleneck is not always where the expediting happens** |
| AI P4 | 3 capacity scenarios | 88 | Build | **Overtime, weekend shift, outsource: which option do you defend?** |

**Weekly mix:** contrarian metric + reality check + bottleneck diagnosis + scenario decision.  
**Visual direction:** utilization danger curve, RCCP gate, bottleneck line, diverging scenario paths.

## RW09 — Safety Stock / Service Level

**Original row:** Reorder point · Service level cost curve · promotion lift · leading indicators  
**Audience priority:** supply planners, demand planners, finance partners  
**Editorial thesis:** inventory buffers are decisions about uncertainty, not piles of stock.

| Slot | Original | Score | Decision | Rebuilt angle |
|---|---|---:|---|---|
| 101 P1 | Reorder point | 86 | Build | **Why you keep stocking out between orders** |
| 101 P2 | Service level cost curve | 90 | Build now | **The last 2% of service level can cost more than it protects** |
| AI P3 | Promotion lift analysis | 82 | Build | **Did the promotion create demand or steal it from next month?** |
| AI P4 | Leading indicators | 80 | Build if concrete | **What signal predicts your category before your forecast sees it?** |

**Weekly mix:** buffer logic + finance trade-off + demand analysis + signal scan.  
**Visual direction:** reorder-point failure band, service-cost curve, lift decomposition, signal map.

## RW10 — Inventory Positioning

**Original row:** 4 types of inventory · Inventory positioning · safety-stock audit · revenue at risk  
**Audience priority:** supply planners, warehouse managers, finance/SC leaders  
**Editorial thesis:** inventory is not one thing; it is cash placed at different points to protect different risks.

| Slot | Original | Score | Decision | Rebuilt angle |
|---|---|---:|---|---|
| 101 P1 | 4 types of inventory | 68 | Reframe hard | **The inventory you see is solving four different problems** |
| 101 P2 | Inventory positioning | 84 | Build | **Where inventory sits decides which promise it protects** |
| AI P3 | Safety-stock audit | 87 | Build | **Which SKUs are carrying safety stock from an old reality?** |
| AI P4 | Revenue at risk | 86 | Build | **Bad forecasting is not an accuracy problem. It is revenue at risk.** |

**Weekly mix:** concept reframed as risk/cash map + positioning + audit + CFO-facing number.  
**Visual direction:** inventory purpose map, network positioning map, aging-parameter audit, revenue-at-risk bridge.

## RW11 — Inventory Metrics

**Original row:** Inventory turnover · Pareto in procurement · lead-time-doubling model · SKU segmentation  
**Audience priority:** planners, procurement, managers  
**Editorial thesis:** the wrong metric makes the wrong SKU look like the problem.

| Slot | Original | Score | Decision | Rebuilt angle |
|---|---|---:|---|---|
| 101 P1 | Inventory turnover | 82 | Build | **High inventory turns can still hide bad service** |
| 101 P2 | Pareto in procurement | 74 | Reframe or move | **The 20% of SKUs/suppliers that deserve 80% of your attention** — decide whether this is procurement or inventory before build. |
| AI P3 | Lead-time-doubling model | 88 | Build | **A 5-day lead-time change can create a 3-week stockout** |
| AI P4 | SKU segmentation | 86 | Build | **Stop planning every SKU the same way** |

**Weekly mix:** metric caveat + attention map + disruption model + segmentation artifact.  
**Visual direction:** turnover/service quadrant, Pareto attention map, lead-time cascade, MTS/MTO segmentation matrix.

## RW12 — SKU Management / Working Capital

**Original row:** SKU rationalisation · Cash conversion cycle · slotting audit · replenishment calendar  
**Audience priority:** managers, planners, warehouse leaders, finance partners  
**Editorial thesis:** SKU complexity and working capital are where supply chain becomes a leadership conversation.

| Slot | Original | Score | Decision | Rebuilt angle |
|---|---|---:|---|---|
| 101 P1 | SKU rationalisation | 86 | Build | **Some SKUs should not exist anymore** |
| 101 P2 | Cash conversion cycle | 91 | Build now | **Supply chain sits between cash going out and cash coming back** |
| AI P3 | Slotting/utilisation audit | 84 | Build | **The fast movers are not always where the warehouse thinks they are** |
| AI P4 | Replenishment calendar | 78 | Reframe | **Which SKUs need decisions this week, not someday?** |

**Weekly mix:** portfolio pruning + finance map + warehouse audit + replenishment decision calendar.  
**Visual direction:** SKU pruning ladder, cash conversion cycle bridge, warehouse heatmap, decision calendar.

## Cross-Calendar Corrections

### 1. Add a recurring career/role map every 4-6 weeks

The analytics are too strong to ignore. Candidate inserts:

| Insert window | Topic |
|---|---|
| RW05 or RW06 | **The planning career ladder: analyst → planner → S&OP lead → director** |
| RW08 | **What a production planner actually decides all day** |
| RW12 | **From supply planner to supply chain manager: the skill shift** |

These can replace the weakest 101 slot in a week if the score is higher.

### 2. Add one timely signal slot per month

At least once per month, one post should come from the signal scan rather than the old calendar.

Candidate signal themes for 2026:

- AI skills in supply-chain hiring,
- agentic AI and human-in-the-loop supply-chain workflows,
- supplier/cyber concentration risk,
- warehouse robotics and exception-handling roles,
- memory/component constraints driven by AI infrastructure,
- tariff/cost cascade where relevant.

### 3. Replace "tool demo" language in AI-for-SC

Every AI-for-SC post title should name the role pain or decision, not the tool capability.

Weak:

> Build a demand review dashboard with Copilot.

Strong:

> The demand review has 12 charts and no decision. Copilot can help write the narrative, but only if the variance table is clean.

### 4. Make every week produce at least one artifact

Artifacts:

- decision matrix,
- scorecard,
- prompt,
- verification checklist,
- meeting narrative,
- cost model,
- scenario tree,
- signal scan table.

## Recommended Next Production Week

If continuing chronologically after RW02, build RW03 only after this signal scan:

```md
Audience bet:
Managers and category managers who need to explain supplier dependency and performance without hiding behind scorecards.

Best 101:
The 3 suppliers that can stop your company.

Best AI-for-SC:
Your supplier risk profile is missing the dependency map.

Reason:
This week combines audience pain, manager relevance, supplier-risk timing, and a strong visual argument. It also continues procurement without feeling like a textbook.
```

## What To Park

Park or rebuild later:

- generic "4 types of inventory" unless reframed through cash/risk,
- generic "what is production plan" unless framed through demand-to-factory translation,
- generic dashboards unless paired with decision narrative,
- generic tool-selection posts unless connected to a real workflow and verification step.

## Operating Decision

Use this file as one candidate/reframing input for RW03-RW12. For each V4 week:

1. run a signal scan,
2. score the candidates,
3. select five posts as one evidence-led portfolio across any justified production lanes,
4. keep a function theme or 101 + AI pairing only if it improves audience value and the declared experiment.
