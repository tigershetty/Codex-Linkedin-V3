---
name: prepare-sop-data-readiness
description: Prepare the data and performance readiness review before an S&OP cycle. Use when an agent needs to reconcile source versions, test freshness and comparability, separate data-quality issues from real performance exceptions, and produce a trusted exception pack with owners and evidence gaps.
---

# Prepare S&OP Data Readiness

Turn scattered actuals, prior plans, KPI results, assumptions, and source notes into a reviewable exception pack. Do not turn uncertain evidence into false certainty.

## Inputs

Ask for the fields in [assets/input-template.md](assets/input-template.md). At minimum require:

- cycle, horizon, calendar, currency, units, and planning grain;
- source name, owner, version, and as-of timestamp;
- actual versus prior plan or target;
- agreed exception thresholds;
- assumption and data-quality change logs.

Stop and list missing evidence when the period, unit, version, or source timestamp cannot be aligned.

## Method

1. Build a source ledger. Keep conflicting versions visible until an owner resolves them.
2. Align grain, calendar, units, currency, and sign convention before comparison.
3. Recalculate only explicit formulas. Show the formula and preserve the supplied values.
4. Classify every flagged item as one of:
   - `data quality issue`;
   - `performance exception`;
   - `assumption change`;
   - `unresolved evidence gap`.
5. Prioritize by decision impact, not by percentage variance alone.
6. Record the owner, next evidence action, due point, and downstream review affected.
7. Produce the output contract in [assets/output-template.md](assets/output-template.md).

## Guardrails

- Never invent missing actuals, timestamps, thresholds, causes, or owner decisions.
- Do not label correlation as root cause.
- Do not silently choose one source when versions conflict.
- Keep `unknown` distinct from zero and from not applicable.
- Flag late data separately from poor performance.
- Preserve confidential or customer-identifying data only when the user has supplied and authorized it.

## Handoff Gate

The exception pack is ready only when each item has:

`EVIDENCE + OWNER + NEXT CHECK + DOWNSTREAM IMPACT`

Return `NOT READY` for any exception that would force the next review to rediscover the source, unit, period, or evidence owner.

## Output

Return:

1. source-to-input map and readiness-gap list;
2. source ledger;
3. exception register;
4. assumption changes;
5. unresolved evidence gaps;
6. trusted hand-off summary for Portfolio, Demand, Supply, and Integrated Reconciliation.

End with a short `HUMAN REVIEW REQUIRED` section. The agent prepares evidence; the S&OP lead and data owners approve what is trusted.
