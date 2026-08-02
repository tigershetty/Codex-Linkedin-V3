# C3 Research Brief — Ship Now vs Consolidate

- **Week:** `2026-W32`
- **Content ID:** `2026-W32-ship-now-vs-consolidate-linkedin-01`
- **Research date:** `2026-07-29`
- **Status:** operating order approved by Tiger; calculator built and locally verified
- **Source mode:** `research-led` with fresh Tiger decision rules in `tiger-source.md`
- **Production gate:** calculator build authorized and complete; no caption, visual, Substack issue, public website handoff, or publication authorized yet

## 0. Executive Decision

This is not an EOQ, batch-size, or AI-tools post.

It addresses one narrower release decision:

> Shipment A is ready. A second compatible inbound PO will be ready shortly. Should the buyer ship A now or hold it to consolidate with B?

The model is a rolling release rule, not a one-shot score. It tests consolidation only after customer service passes, then compares freight saved with the costs that genuinely change between the ship-now and wait options. When credible scenarios disagree on service, the standard answer is `ship now`; an exception moves to a joint KAM + Purchasing Manager escalation.

## 1. Why This Is Genuinely New

| Prior W30 optimal-batch-size post | C3 shipment-release decision |
|---|---|
| Quantity decision: how much to order or produce | Timing decision: whether a ready shipment should leave now |
| EOQ, setup/order cost, and holding cost | Actual separate/consolidated freight quotes, waiting cost, and arrival risk |
| Smaller/current/larger batch options | Best/base/worst supplier-ready, transit, and freight scenarios |
| ChatGPT-led promise | Buyer/customer decision-led promise; no AI tool in the opening |
| General service-risk indicator | Customer need-by date is a hard gate |
| Planner review | Joint KAM + Purchasing Manager exception approval |

The W30 post produced one public interaction after 18 days and sat at 0.25x Tiger's mature median response. Repeating its formula card, options table, or “AI makes the trade-off visible” promise would not be a new experiment.

## 2. Captured Tiger Decision Rules

These statements are captured but not yet approved as public wording:

1. **Customer first:** inspect the customer need-by date before freight savings.
2. **Exceptions are governed:** exceptions are allowed through escalation, but cannot become the normal operating method.
3. **Two decision owners:** the KAM protects the customer commitment; the Purchasing Manager owns the purchasing/freight trade-off.
4. **Inputs are unstable:** supplier-ready dates may be unreliable, customer dates may need clarification, and freight costs are dynamic.
5. **Test uncertainty explicitly:** use best/base/worst cases and force escalation when a credible case threatens the need-by date.

Source: `data/2026-W32/ship-now-vs-consolidate/tiger-source.md`.

## 3. Decision Scope

### First-version operating context

- two inbound POs from the same supplier;
- same pickup lane, destination, service class, and compatible handling requirements;
- shipment A is ready now;
- shipment B has an earliest, likely, and latest ready date;
- the buyer has current separate and consolidated freight quotes;
- a KAM-confirmed customer need-by date exists.

### Compatibility gate

Do not run the economics until the POs are operationally compatible. Check:

- origin/pickup and destination;
- transport mode and service level;
- available weight/cube/capacity;
- packaging and loading constraints;
- dangerous-goods, temperature, customs, or other compliance constraints;
- consolidation handling or hub requirements;
- quality and document readiness;
- carrier cutoff and the first feasible departure after release.

### Exclusions

- network optimization across many suppliers or routes;
- carrier selection;
- EOQ, MOQ, or production-batch optimization;
- inventory-policy changes;
- customer-date negotiation without KAM ownership;
- automated release or ERP/TMS master-data updates.

## 4. Evidence and What It Supports

| Evidence | What it supports | What it does not support |
|---|---|---|
| [June 2026 Logistics Managers' Index](https://www.the-lmi.com/june-2026-logistics-managers-index.html): Transportation Prices `92.4`, Inventory Costs `75.9`, Transportation Capacity `30.8` | Freight and inventory cost pressure can move at the same time; the trade-off is currently relevant | The indices are diffusion measures, not the user's freight rate or carrying-cost percentage |
| [KPMG 2026 supply-chain survey](https://kpmg.com/kpmg-us/content/dam/kpmg/corporate-communications/pdf/2026/US%20procurement_supply%20chain%20survey_2026.pdf): 38% cited logistics/transportation as the largest value-leakage source | The problem has an executive-recognized cost consequence | A self-reported, large-company survey does not validate this calculator's decision quality |
| [Bookbinder and Higginson, 2002](https://www.sciencedirect.com/science/article/pii/S1366554502000145) | Temporal consolidation trades lower transportation cost against inventory carrying cost and customer waiting | Their probabilistic private-carriage model is not the formula used in this one-off PO decision aid |
| [Malmberg and Marklund, 2023](https://lup.lub.lu.se/search/publication/a07d41aa-01a4-4cee-81ac-bea7e6a95e00) | Inventory and shipment decisions should be evaluated jointly, including costs and fill-rate/service effects | Their multi-echelon quantity-based model does not directly solve two inbound POs |
| [Wei, Çetinkaya, and Cline, 2023](https://doi.org/10.1016/j.tre.2023.103135) | Integrated consolidation models examine transport cost together with delay and inventory effects | The published optimization assumptions do not establish a universal one-time release rule |
| [BTS Freight Analysis Framework](https://www.bts.gov/faf) | Public context for freight flows, shipment weight/value, modes, commodities, and geographies | FAF is not a live commercial freight-quote source |

## 5. Input Contract

### Hard-gate inputs

| Input | Required treatment | Owner/source |
|---|---|---|
| Customer need-by date | Confirmed date and time; record when it was confirmed | KAM / customer commitment |
| Shipment A ready date | Confirmed release status | Supplier / purchasing |
| Shipment B ready range | Earliest, likely, latest; include confidence and last update | Supplier / purchasing |
| Transit-time range | Best, base, worst plus required handling/buffer days | Carrier/forwarder |
| Quote validity | Separate and consolidated quote timestamp and valid-through date | Carrier/forwarder / purchasing |
| Compatibility | Pass/fail for lane, destination, service, capacity, handling, and compliance | Purchasing/logistics |
| Incoterm and named place | Record which option changes cost, risk, or ownership timing | PO/contract / purchasing |

### Economic inputs

| Input | Symbol | Unit |
|---|---|---|
| Freight cost to ship A now | `F_A` | currency |
| Freight cost to ship B separately later | `F_B` | currency |
| Consolidated freight cost by scenario | `F_C,s` | currency |
| Incremental inventory/capital/ownership cost versus ship now | `Delta I_s` | currency |
| Incremental storage, handling, documentation, brokerage, terminal, and administrative cost | `Delta S_s` | currency |
| Incremental recovery, expedite, shortage, or other operational consequence, if defensibly quantified | `Delta R_s` | currency |
| Incremental waiting cost per day for the linear illustration | `k_s` | currency/day |
| Business minimum worthwhile net saving | `M` | currency |

The first version must not invent missing rates, dates, or customer commitments. Missing or stale hard-gate inputs stop automatic consolidation.

## 6. Transparent Decision Model

For scenario `s` in `best`, `base`, and `worst`:

```text
supplier_wait_days_s = max(0, ready_B_s - ready_A)

consolidated_dispatch_s = first_feasible_departure_after(ready_B_s)

hold_days_s = max(0, consolidated_dispatch_s - ready_A)

consolidated_ETA_s =
  consolidated_dispatch_s + handling_days_s + transit_days_s

ship_now_ETA_s =
  ship_now_dispatch + ship_now_handling_days_s + ship_now_transit_days_s

service_slack_days_s = customer_need_by - consolidated_ETA_s

freight_saved_s = F_A + F_B - F_C,s

incremental_nonfreight_cost_s = Delta I_s + Delta S_s + Delta R_s

net_consolidation_value_s =
  freight_saved_s - incremental_nonfreight_cost_s

economic_break_even_hold_s =
  (freight_saved_s - C0_s - M) / k_s

latest_safe_hold_s =
  customer_need_by - handling_days_s - transit_days_s - ready_A
```

For the linear illustration, `incremental_nonfreight_cost_s(h) = C0_s + k_s × h`, where `C0_s` is the one-off differential cost, `k_s` is the defensible incremental cost per held day, and `h` runs until the actual consolidation departure. Using `ready_B - ready_A` alone understates held time when a carrier cutoff delays dispatch after B becomes ready.

`Delta I_s` must compare the two ownership/inventory timelines. `V_A × carrying rate × waiting days / 365` is valid only when holding A creates that incremental cost versus the ship-now baseline. If ownership and capital exposure are unchanged while A moves into transit, that shortcut may overstate the cost and must be replaced with the actual differential storage, financing, or handling cost.

The linear break-even calculation is illustrative and valid only when the numerator is positive, incremental wait cost is reasonably linear, and the quote remains valid. The operational waiting limit is the smaller of the economic and service limits:

```text
permitted_hold_s = min(economic_break_even_hold_s, latest_safe_hold_s)

robust_permitted_hold = min(permitted_hold_s across all credible scenarios)
```

With dynamic or piecewise freight pricing, calculate net value at each feasible departure and use the last wait point where every credible scenario remains service-feasible and non-negative. Reprice at quote expiry, carrier cutoff, and material supplier updates.

### Decision logic

1. **Compatibility fails:** `DO NOT CONSOLIDATE`; evaluate and, if necessary, expedite the next feasible non-consolidated response against need-by.
2. **Need-by, supplier-ready range, transit range, or current quote is missing/stale:** `DATA STOP`; do not hold A under a new consolidation decision.
3. **Neither option protects need-by across every credible scenario:** `REPLAN / EXPEDITE / CUSTOMER DISCUSSION`; require a joint KAM + Purchasing Manager response and do not select the cheaper miss.
4. **Only ship-now is robust:** default `SHIP NOW`. Waiting becomes `ESCALATE — KAM + PURCHASING MANAGER` and a joint exception never relabels the miss as safe.
5. **Only consolidation is robust:** `CONSOLIDATE`; the customer date takes precedence and economics remain informational.
6. **Both options are robust and all consolidation net values exceed `M`:** `CONSOLIDATE`.
7. **Both options are robust but all consolidation net values are at or below `M`:** `SHIP NOW`.
8. **Both options are robust but the economic scenarios disagree or sit near the threshold:** `REVIEW`; refresh quotes or narrow the uncertainty.
9. **Repeated exceptions:** flag the governing rule, supplier reliability, customer-date process, or freight setup for system correction.

This is a transparent decision aid, not a universal optimizer or an autonomous shipping instruction.

## 7. Synthetic Test Run

All values below are invented solely to test the logic.

### Case A — Green: consolidate

Common inputs: need-by `day 16`; separate freight `€1,450`; shipment-A value `€30,000`; **synthetic assumption** that holding A at origin creates an incremental `24%` annualized cost versus the ship-now timeline; incremental handling `€50`.

| Scenario | B ready / wait | Transit | ETA | Consolidated freight | Freight saved | Waiting cost | Net value | Service |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Best | day 2 / 2 days | 8 days | day 10 | €980 | €470 | €39.45 | €380.55 | pass |
| Base | day 3 / 3 days | 9 days | day 12 | €1,050 | €400 | €59.18 | €290.82 | pass |
| Worst | day 4 / 4 days | 10 days | day 14 | €1,120 | €330 | €78.90 | €201.10 | pass |

Economic break-even wait: `21.29 / 17.74 / 14.19` days. Latest safe wait: `8 / 7 / 6` days. Actual waiting is inside both limits in every scenario.

The waiting-cost rows are valid only under the stated incremental-cost assumption. If the Incoterm and ownership timeline show no incremental capital cost, replace them with the real differential storage/handling cost and recalculate.

**Output:** `CONSOLIDATE` — subject to quote validity and compatibility checks.

### Case B — Amber: economics say yes; customer gate says no

Common inputs: need-by `day 16`; separate freight `€1,550`; shipment-A value `€25,000`; the same synthetic incremental `24%` waiting-cost assumption; incremental handling `€50`.

| Scenario | B ready / wait | Transit | ETA | Consolidated freight | Freight saved | Waiting cost | Net value | Service |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Best | day 2 / 2 days | 7 days | day 9 | €1,050 | €500 | €32.88 | €417.12 | pass |
| Base | day 5 / 5 days | 9 days | day 14 | €1,125 | €425 | €82.19 | €292.81 | pass |
| Worst | day 8 / 8 days | 11 days | day 19 | €1,200 | €350 | €131.51 | €168.49 | **fail by 3 days** |

Every scenario shows positive net value, but the worst credible case misses the customer date. The cost result cannot overrule the service gate.

**Output:** default `SHIP NOW`; if the business still wants to wait, `ESCALATE — KAM + PURCHASING MANAGER`.

### Case C — Red: false precision/data stop

- supplier gives no credible latest-ready date for B;
- customer need-by date is not confirmed by the KAM;
- the consolidated quote has expired or has no validity timestamp.

The model does not manufacture ranges or return an “optimal” answer.

**Output:** `DATA STOP`; do not newly hold shipment A. Refresh the customer commitment, supplier range, and freight quote first.

## 8. Minimum Artifact Specification

The first useful calculator needs five surfaces:

1. **Input and freshness panel:** source, owner, timestamp, validity, and confidence for each hard-gate input.
2. **Option timelines:** cost, ownership, location, and service consequences under ship-now versus consolidate.
3. **Scenario table:** best/base/worst wait, first feasible departure, ETA, service slack, freight saved, incremental non-freight cost, and net value.
4. **Decision banner:** `ship now / consolidate / escalate / review / data stop`, with the exact reason.
5. **Audit record:** KAM decision, Purchasing Manager decision, exception reason, decision time, and recurring-exception flag.

It does not need AI, login, a large dashboard, or an email gate in its minimum useful version.

**Implemented:** `calculator/` is a zero-dependency, website-ready decision board that shares one deterministic engine across the browser interface and automated tests. It adds the ship-now timeline required to evaluate the “both options late” branch, exports an auditable JSON decision record, and keeps public publication on hold.

## 9. Prospective Content Experiment

- **Opening variable:** role decision first, not named tool/task first.
- **Decision promise:** determine when waiting for a compatible PO is safe and when freight savings must lose to the customer date.
- **Visible proof:** completed amber case where the economics are positive but the service gate rejects automatic consolidation.
- **Save trigger:** the hard-gate order and break-even/service-limit comparison.
- **Matched baseline:** W30 optimal-batch-size/EOQ post and other recent tool-led workflows.
- **Primary outcome:** Day-7 members reached and saves, reported separately.
- **Guardrail:** comments/follows from purchasing, logistics, planning, KAM, or transformation roles.

## 10. Open Gates

- Tiger has not approved public wording.
- Tiger has not yet stated what originally made this problem worth exploring.
- Tiger has not stated what remains uncertain after seeing the tested logic.
- `M`, quote-freshness tolerance, scenario definitions, and recurring-exception threshold still need operating defaults.
- Best/base/worst cases are sensitivity tests, not an expected value unless defensible probabilities exist.
- Three scenarios cannot protect against omitted tail events; ranges should eventually come from supplier promise-error history and quote volatility.
- Incoterms allocate obligations, costs, and risk but do not by themselves define title or the customer delay consequence.
- The synthetic run must not be presented as a business result.
- Tiger accepted the operating order on `2026-08-02`; the calculator was then built and verified locally. This approval does not approve public wording or publication.

## Sources

- Logistics Managers' Index — June 2026: https://www.the-lmi.com/june-2026-logistics-managers-index.html
- KPMG — The State of Next-Gen Supply Chain, March 2026: https://kpmg.com/kpmg-us/content/dam/kpmg/corporate-communications/pdf/2026/US%20procurement_supply%20chain%20survey_2026.pdf
- Bookbinder, J. H. and Higginson, J. K. — Probabilistic modeling of freight consolidation by private carriage: https://doi.org/10.1016/S1366-5545(02)00014-5
- Malmberg, F. and Marklund, J. — Evaluation and control of inventory distribution systems with quantity-based shipment consolidation: https://doi.org/10.1002/nav.22090
- Wei, L., Çetinkaya, S., and Cline, D. B. H. — Inbound replenishment and outbound dispatch decisions under hybrid shipment consolidation policies: https://doi.org/10.1016/j.tre.2023.103135
- ICC — Incoterms 2020 introduction: https://library.iccwbo.org/content/tfb/BOOKS/BK_0049/BK_0049_03_Introduction.htm
- Bureau of Transportation Statistics — Freight Analysis Framework: https://www.bts.gov/faf
