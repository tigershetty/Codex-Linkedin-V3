---
name: review-sop-portfolio
description: Review launches, phase-outs, substitutions, and lifecycle changes before the demand and supply reviews in an S&OP cycle. Use when an agent needs to separate proposed from approved portfolio changes, test cross-functional readiness, expose downstream demand, supply, inventory, finance, and customer impacts, and produce an approved-change hand-off with unresolved decisions.
---

> Standalone edition v1.2.0. This one Markdown file contains the complete method, input contract, output contract, guardrails, and first-run instructions. Attach it directly to ChatGPT, Claude, Gemini, Codex, or another approved AI workspace. For native Agent Skill installation, save it as `SKILL.md` inside a folder named `review-sop-portfolio`. No companion file, bundled dataset, or proprietary tool is required.

# Review S&OP Portfolio

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


Turn a product roadmap and lifecycle change log into an explicit portfolio decision pack. A date in a roadmap is not an approved planning assumption.

## Inputs

Ask for the fields in the embedded input template below. At minimum require:

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
7. Produce the output contract in the embedded output template below.

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

---

## Embedded Input Template

## Portfolio Review Input

### Cycle And Authority

- Cycle / horizon:
- Planning grain:
- Executive meeting date:
- Decision-rights owner:
- Approval evidence accepted:

### Change Register

| Change ID | Product/location | Change type | Proposed date | Status | Owner | Evidence |
|---|---|---|---|---|---|---|
| | | launch / phase-out / substitution / other | | | | |

### Readiness And Impact

| Change ID | Commercial | Technical/regulatory | Material/capacity | Customer | Master data | Inventory/value exposure |
|---|---|---|---|---|---|---|
| | | | | | | |

### Dependencies

| Change ID | Dependency or open condition | Owner | Needed by | Reviews affected |
|---|---|---|---|---|
| | | | | |

---

## Embedded Output Template

## Approved Portfolio Changes

### Source-To-Input Map

| Requirement | Source file | Field / section | Owner | Version / as of | Status |
|---|---|---|---|---|---|

### Readiness Gaps

| Gap or conflict | Decision impact | Owner | Evidence needed | Due |
|---|---|---|---|---|

### Review Verdict

`READY / READY WITH CONDITIONS / NOT READY`

### Decision Register

| Change ID | Decision state | Effective date | Conditions | Approval owner | Evidence |
|---|---|---|---|---|---|

### Downstream Impact Map

| Change ID | Demand | Supply/material | Inventory | Finance/value | Customer | System/master data |
|---|---|---|---|---|---|---|

### Transition Exposure

| Change ID | Exposure | Quantity/value if supplied | Mitigation option | Owner | Decision date |
|---|---|---:|---|---|---|

### Hand-Off

- Demand planning changes:
- Supply planning changes:
- Integrated Reconciliation choices:

### Human Review Required

- Approvals still required:
- Conditions accepted or rejected:
- System-of-record changes authorized:
