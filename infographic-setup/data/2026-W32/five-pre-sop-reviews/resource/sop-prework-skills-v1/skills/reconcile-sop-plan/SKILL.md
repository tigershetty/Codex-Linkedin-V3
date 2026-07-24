---
name: reconcile-sop-plan
description: Reconcile trusted performance exceptions, approved portfolio changes, the consensus demand plan, supply response options, and financial implications into a decision-ready pre-S&OP package. Use when an agent needs to resolve issues within delegated authority, quantify remaining gaps and trade-offs, compare scenarios, and prepare a recommendation with explicit executive decision asks.
---

# Reconcile S&OP Plan

Convert four functional hand-offs into one cross-functional recommendation. The output is not a stack of review summaries; it is the smallest complete package needed to choose and commit one plan.

## Inputs

Ask for the fields in [assets/input-template.md](assets/input-template.md). At minimum require:

- trusted exception pack from Data and Performance Readiness, or equivalent source evidence from the user's project files;
- approved portfolio changes and unresolved portfolio conditions, or the source records needed to establish their decision state;
- consensus demand plan, scenarios, assumptions, and triggers, or equivalent demand-review evidence;
- supply feasibility verdicts and response options, or the constraint and response evidence needed to assess them;
- financial targets, valuation rules, and supplied option impacts;
- decision rights, escalation thresholds, owners, and executive meeting date.

Reject stale or mismatched cycles, calendars, units, versions, or scenario names before reconciliation.

## Method

1. Build one cross-review source and version ledger.
2. Reconcile portfolio, demand, supply, inventory, service, and financial implications by scenario.
3. Separate issues already resolved within delegated authority from trade-offs that require executive authority.
4. Quantify gaps only with supplied values and approved formulas; label unquantified effects.
5. Compare viable options against the same dimensions and time horizon.
6. State the recommendation, rationale, conditions, reversibility, and consequences of delay.
7. Convert each unresolved trade-off into one explicit decision ask.
8. Produce the output contract in [assets/output-template.md](assets/output-template.md).

## Guardrails

- Never invent revenue, margin, cost, working-capital, service, or risk impacts.
- Do not combine incompatible scenarios or source versions.
- Do not escalate a problem without at least one feasible option or a clear evidence gap preventing options.
- Do not hide functional disagreement inside a single average.
- Keep recommendation, approval, and system-of-record change as separate acts.
- Preserve minority or rejected options when their trade-off remains relevant.

## Executive Readiness Gate

An issue earns executive time only when it has:

`READY = EVIDENCE + OWNER + OPTIONS + ASK`

Return `NOT READY` when any one of the four elements is missing. Route the item back to the review that owns the missing evidence or option.

## Output

Return:

1. source-to-input map and readiness-gap list;
2. integrated plan and gap bridge;
3. resolved-items log;
4. option comparison with value and operating consequences;
5. recommendation and conditions;
6. executive decision asks and commitment log shell.

End with `HUMAN REVIEW REQUIRED`. The S&OP lead and finance validate the package; accountable executives choose, allocate, and commit. The agent does not approve the plan.
