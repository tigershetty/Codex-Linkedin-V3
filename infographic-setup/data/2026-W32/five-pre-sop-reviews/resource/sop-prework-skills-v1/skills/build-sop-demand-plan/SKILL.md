---
name: build-sop-demand-plan
description: Build the pre-S&OP consensus demand view from demand history, a baseline forecast, approved portfolio changes, commercial events, customer evidence, and explicit assumptions. Use when an agent needs to separate signal from judgment, reconcile overrides, build evidence-backed scenarios, and hand a demand plan with range, risks, owners, and open decisions to Supply Review.
---

# Build S&OP Demand Plan

Convert demand evidence and commercial judgment into a reviewable operating commitment. Keep the statistical forecast, proposed adjustments, and approved demand plan visible as separate layers.

## Inputs

Ask for the fields in [assets/input-template.md](assets/input-template.md). At minimum require:

- cycle, horizon, bucket, grain, units, currency, and cutoff date;
- history and actual orders/consumption with source timestamps;
- baseline forecast and model/version identifier;
- approved portfolio changes;
- event, promotion, customer, market, lifecycle, and pricing assumptions;
- override owner, evidence, period, magnitude, and expiry;
- scenario assumptions and decision triggers.

Return missing fields as evidence gaps. Do not fill them with plausible values.

## Method

1. Align actuals, baseline, events, overrides, and portfolio changes to one grain and calendar.
2. Separate observed signal from inferred cause and from commercial judgment.
3. Build an assumption ledger before changing the baseline.
4. Reconcile every adjustment to a named owner, evidence source, affected period, and expiry condition.
5. Construct a consensus view and, where supplied assumptions justify it, a bounded downside and upside scenario.
6. Identify the decisions that each scenario could change: replenishment, allocation, capacity, deployment, inventory, or customer commitment.
7. Produce the output contract in [assets/output-template.md](assets/output-template.md).

## Guardrails

- Never invent event uplift, probabilities, elasticity, customer orders, or forecast accuracy.
- Do not treat an override as truth because it is recent or senior.
- Do not blend baseline and judgment so completely that the adjustment cannot be traced.
- Keep orders, shipments, consumption, and unconstrained demand distinct.
- Label scenarios as conditional views, not probabilistic forecasts, unless probabilities were supplied and approved.
- Do not declare one perfect forecast; expose uncertainty and decision sensitivity.

## Handoff Gate

The demand plan is ready for Supply Review only when it has:

`BASELINE + ASSUMPTIONS + RANGE + OWNER + DECISION TRIGGERS`

Return `NOT READY` when an adjustment lacks evidence, ownership, an affected period, or a clear implication for a planning decision.

## Output

Return:

1. source-to-input map and readiness-gap list;
2. baseline-to-consensus bridge;
3. consensus demand plan by agreed grain;
4. scenario table with explicit assumptions and triggers;
5. override and assumption ledger;
6. demand risks, evidence gaps, and Supply Review hand-off.

End with `HUMAN REVIEW REQUIRED`. Demand and commercial owners approve the consensus plan and overrides; the agent prepares traceable alternatives.
