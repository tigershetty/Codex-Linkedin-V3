---
name: test-sop-supply-feasibility
description: Test the consensus demand plan and scenarios against material, capacity, inventory, lead-time, policy, and service constraints before integrated reconciliation. Use when an agent needs to identify binding constraints, distinguish feasible from conditional or infeasible responses, and compare supply options with explicit service, inventory, capacity, cost, timing, and execution consequences.
---

> Standalone edition v1.2.0. This one Markdown file contains the complete method, input contract, output contract, guardrails, and first-run instructions. Attach it directly to ChatGPT, Claude, Gemini, Codex, or another approved AI workspace. For native Agent Skill installation, save it as `SKILL.md` inside a folder named `test-sop-supply-feasibility`. No companion file, bundled dataset, or proprietary tool is required.

# Test S&OP Supply Feasibility

## Use This Skill With Your Project

This skill works independently. Use outputs from earlier S&OP reviews when they exist, or map equivalent evidence from your own project files. Do not assume that another skill has already run.

1. Create governed, read-only copies of the source files for one review cycle. CSV or XLSX exports, planning reports, approved presentations, decision logs, and working documents are valid inputs. Start with one product family, region, or business unit when the full scope is too large.
2. Remove or mask personal, customer-identifying, commercially sensitive, and credential data unless your AI environment and use are explicitly approved.
3. Attach this skill file and the relevant project files to your AI workspace. Do not connect the skill directly to a production system for the first run.
4. Require a source-to-input map before analysis. Your files do not need to use the same column names as the embedded template, but the agent must show which source, field, owner, version, and as-of date satisfies each requirement.
5. Choose a run mode. Use `READINESS` to map evidence and gaps without building the review artifact. Use `BUILD` only when minimum evidence is sufficient.
6. Keep missing fields, conflicting versions, and uncertain assumptions visible. The named business owner reviews the artifact before it becomes a hand-off.

### Required First Output

Before the review artifact, return:

| Requirement | Source file | Field / section | Owner | Version / as of | Status |
|---|---|---|---|---|---|

Then list every missing, stale, conflicting, or unclear input. If a load-bearing requirement is not satisfied, stop in `READINESS` mode and return a readiness-gap list. Do not manufacture a completed artifact.

### First-Run Prompt

> Use this skill with my attached project files. Start in READINESS mode. Create the required source-to-input map, show which file and field satisfies each embedded input, and list anything missing, stale, conflicting, or unclear. Do not invent values or silently resolve conflicts. Move to BUILD mode only when the minimum evidence is sufficient. Then follow the method, return the embedded output contract, and end with the human decisions still required.


Turn a demand plan into a set of feasible response options. A plan is not feasible because totals balance; timing, location, materials, policy, and execution windows must also work.

## Inputs

Ask for the fields in the embedded input template below. At minimum require:

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
7. Produce the output contract in the embedded output template below.

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

---

## Embedded Input Template

## Supply Feasibility Input

### Cycle And Model

- Cycle / horizon / bucket:
- Product-location-resource grain:
- Units:
- Frozen/protected horizon:
- Decision rights:

### Demand Scenarios

| Scenario | Item/location | Period | Demand | Service priority | Source/version |
|---|---|---|---:|---|---|
| | | | | | |

### Inventory And Supply

| Item/location | Opening inventory | Backlog | Policy/target | Material availability | Lead time | MOQ/lot/yield |
|---|---:|---:|---|---|---|---|
| | | | | | | |

### Capacity And Commitments

| Resource/location | Period | Available capacity | Planned load | Downtime | Released/protected orders | Source |
|---|---|---:|---:|---|---|---|
| | | | | | | |

### Permitted Levers And Costs

| Lever | Authority | Limit/window | Supplied cost/value | Owner |
|---|---|---|---:|---|
| | | | | |

---

## Embedded Output Template

## Feasible Supply Response And Options

### Source-To-Input Map

| Requirement | Source file | Field / section | Owner | Version / as of | Status |
|---|---|---|---|---|---|

### Readiness Gaps

| Gap or conflict | Decision impact | Owner | Evidence needed | Due |
|---|---|---|---|---|

### Review Verdict

`READY / READY WITH CONDITIONS / NOT READY`

### Scenario Feasibility

| Scenario | Verdict | First binding constraint | Period | Shortfall/range | Evidence quality |
|---|---|---|---|---:|---|

### Constraint Register

| Priority | Item/resource | Constraint | Timing | Root-cause evidence | Owner | Next check |
|---|---|---|---|---|---|---|

### Response Options

| Option | Service | Inventory | Capacity/material | Cost/value | Timing | Execution risk | Owner |
|---|---|---|---|---|---|---|---|

### Protected-Horizon Impact

| Option | Released/protected commitment affected | Approval needed | Decision deadline |
|---|---|---|---|

### Reconciliation Hand-Off

- Feasible response set:
- Conditional options:
- Infeasible scenarios:
- Decisions still open:

### Human Review Required

- Constraint data accepted:
- Response option authorized:
- Execution or system changes approved:
