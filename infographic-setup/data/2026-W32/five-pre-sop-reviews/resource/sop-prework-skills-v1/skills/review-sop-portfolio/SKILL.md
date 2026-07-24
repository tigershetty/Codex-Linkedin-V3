---
name: review-sop-portfolio
description: Review launches, phase-outs, substitutions, and lifecycle changes before the demand and supply reviews in an S&OP cycle. Use when an agent needs to separate proposed from approved portfolio changes, test cross-functional readiness, expose downstream demand, supply, inventory, finance, and customer impacts, and produce an approved-change hand-off with unresolved decisions.
---

# Review S&OP Portfolio

Turn a product roadmap and lifecycle change log into an explicit portfolio decision pack. A date in a roadmap is not an approved planning assumption.

## Inputs

Ask for the fields in [assets/input-template.md](assets/input-template.md). At minimum require:

- cycle, horizon, planning grain, and decision rights;
- launch, phase-out, relaunch, substitution, and packaging-change proposals;
- milestone status, evidence owner, and approval state;
- demand, inventory, material, capacity, financial, and customer implications;
- no-later-than date for each downstream planning change.

Keep `proposed`, `conditional`, `approved`, `deferred`, and `cancelled` distinct.

## Method

1. Create one change record per product-location or explicitly declared planning family.
2. Validate identity, effective date, predecessor/successor relationship, and approval owner.
3. Test readiness against supplied criteria: commercial, technical, regulatory, material, capacity, customer, and system/master-data.
4. Map each change across demand, supply, inventory, finance, and customer commitments.
5. Identify stranded inventory, overlap, cannibalization, obsolescence, service, and transition risks only when supported by supplied evidence.
6. Classify the decision state and record conditions still open.
7. Produce the output contract in [assets/output-template.md](assets/output-template.md).

## Guardrails

- Never convert a target date into an approved date without named approval evidence.
- Do not infer demand transfer, cannibalization, yield, shelf life, or write-off value.
- Keep product readiness separate from supply readiness.
- Preserve uncertainty when successor timing or customer migration is unresolved.
- Do not close a phase-out while open customer, regulatory, inventory, or material exposure remains undocumented.

## Handoff Gate

A portfolio change is ready for downstream planning only when it has:

`DECISION STATE + EFFECTIVE DATE + OWNER + DOWNSTREAM IMPACT`

Return `NOT READY` when the planning team would have to guess whether the change is approved, when it takes effect, or what assumption to use.

## Output

Return:

1. source-to-input map and readiness-gap list;
2. portfolio decision register;
3. readiness and dependency gaps;
4. downstream impact map;
5. inventory and transition exposure;
6. approved-change hand-off for Demand, Supply, and Integrated Reconciliation.

End with `HUMAN REVIEW REQUIRED`. Product/portfolio and accountable business owners approve lifecycle decisions; the agent structures evidence and consequences.
