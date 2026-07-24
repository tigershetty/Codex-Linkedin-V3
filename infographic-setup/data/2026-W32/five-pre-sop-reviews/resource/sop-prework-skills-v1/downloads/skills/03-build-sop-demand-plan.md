---
name: build-sop-demand-plan
description: Build the pre-S&OP consensus demand view from demand history, a baseline forecast, approved portfolio changes, commercial events, customer evidence, and explicit assumptions. Use when an agent needs to separate signal from judgment, reconcile overrides, build evidence-backed scenarios, and hand a demand plan with range, risks, owners, and open decisions to Supply Review.
---

> Standalone edition v1.2.0. This one Markdown file contains the complete method, input contract, output contract, guardrails, and first-run instructions. Attach it directly to ChatGPT, Claude, Gemini, Codex, or another approved AI workspace. For native Agent Skill installation, save it as `SKILL.md` inside a folder named `build-sop-demand-plan`. No companion file, bundled dataset, or proprietary tool is required.

# Build S&OP Demand Plan

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


Convert demand evidence and commercial judgment into a reviewable operating commitment. Keep the statistical forecast, proposed adjustments, and approved demand plan visible as separate layers.

## Inputs

Ask for the fields in the embedded input template below. At minimum require:

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
7. Produce the output contract in the embedded output template below.

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

---

## Embedded Input Template

## Demand Review Input

### Cycle

- Cycle / horizon / bucket:
- Product-location grain:
- Units / currency:
- Data cutoff:
- Demand definition: orders / shipments / consumption / other

### Baseline And Actuals

| Item/location | Period | Actual | Baseline forecast | Model/version | Source/as of |
|---|---|---:|---:|---|---|
| | | | | | |

### Adjustments And Assumptions

| ID | Item/location | Period | Adjustment | Assumption/evidence | Owner | Expiry/trigger |
|---|---|---|---:|---|---|---|
| | | | | | | |

### Approved Portfolio Changes

| Change ID | Item/location | Effective period | Demand implication | Approval evidence |
|---|---|---|---|---|
| | | | | |

### Scenario Inputs

| Scenario | Changed assumption | Supplied value/range | Decision it could change |
|---|---|---|---|
| | | | |

---

## Embedded Output Template

## Consensus Demand And Scenarios

### Source-To-Input Map

| Requirement | Source file | Field / section | Owner | Version / as of | Status |
|---|---|---|---|---|---|

### Readiness Gaps

| Gap or conflict | Decision impact | Owner | Evidence needed | Due |
|---|---|---|---|---|

### Review Verdict

`READY / READY WITH EXCEPTIONS / NOT READY`

### Baseline-To-Consensus Bridge

| Item/location | Period | Baseline | Approved adjustment | Consensus | Owner/evidence |
|---|---|---:|---:|---:|---|

### Scenario View

| Scenario | Demand range | Assumptions | Trigger | Decision sensitivity |
|---|---|---|---|---|

### Assumption And Override Ledger

| ID | Layer | Assumption/override | Evidence | Owner | Expiry | Status |
|---|---|---|---|---|---|---|

### Risks And Evidence Gaps

| Priority | Risk/gap | Period | Decision impact | Owner | Next evidence |
|---|---|---|---|---|---|

### Supply Review Hand-Off

- Consensus plan:
- Scenarios to test:
- Service/customer priorities:
- Decisions still open:

### Human Review Required

- Consensus approval:
- Override decisions:
- Scenario assumptions accepted:
