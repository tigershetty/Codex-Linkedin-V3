---
name: test-sop-supply-feasibility
description: Test the consensus demand plan and scenarios against material, capacity, inventory, lead-time, policy, and service constraints before integrated reconciliation. Use when an agent needs to identify binding constraints, distinguish feasible from conditional or infeasible responses, and compare supply options with explicit service, inventory, capacity, cost, timing, and execution consequences.
---

# Test S&OP Supply Feasibility

Turn a demand plan into a set of feasible response options. A plan is not feasible because totals balance; timing, location, materials, policy, and execution windows must also work.

## Inputs

Ask for the fields in [assets/input-template.md](assets/input-template.md). At minimum require:

- demand plan and named scenarios at an agreed grain and calendar;
- opening inventory, inventory policy, backlog, and service priorities;
- capacity by resource and period, including calendars and known downtime;
- material availability, lead times, yields, lot/MOQ rules, and supplier constraints;
- frozen or protected horizons and execution commitments;
- approved cost inputs and decision rights for overtime, outsourcing, allocation, or expedites.

Record unavailable constraint data as unknown; do not assume unconstrained supply.

## Method

1. Align demand, inventory, capacity, and material data to one product-location-time model.
2. Test each scenario separately; do not average scenarios into one artificial plan.
3. Identify the first binding constraint by period and the next constraint after it.
4. Classify each scenario as `feasible`, `conditional`, `infeasible`, or `not testable`.
5. Build response options from permitted levers: inventory, timing, allocation, capacity, sourcing, formulation/substitution, service promise, or demand shaping.
6. Show the consequence of each option across service, inventory, capacity, cost/value, timing, and execution risk.
7. Produce the output contract in [assets/output-template.md](assets/output-template.md).

## Guardrails

- Never invent capacity, material availability, conversion rates, costs, yields, or lead times.
- Do not imply that aggregate capacity proves SKU-period feasibility.
- Keep a mathematical shortfall separate from an operational root cause.
- Do not recommend an expedite, substitution, overtime, or outsourcing action when authority or inputs are missing.
- Flag protected-horizon changes and released-order impacts explicitly.
- Avoid false precision when the source data supports only a range.

## Handoff Gate

A supply response is ready for reconciliation only when it has:

`CONSTRAINT + OPTION + CONSEQUENCE + OWNER + DECISION WINDOW`

Return `NOT READY` when an option cannot be evaluated against the relevant material, capacity, inventory, service, or timing constraint.

## Output

Return:

1. source-to-input map and readiness-gap list;
2. scenario feasibility verdicts;
3. binding-constraint register;
4. response-option comparison;
5. protected-horizon and execution impacts;
6. recommended feasible response set and unresolved decisions.

End with `HUMAN REVIEW REQUIRED`. Operations, supply, procurement, and relevant commercial/finance owners approve the response; the agent makes the trade-offs reviewable.
