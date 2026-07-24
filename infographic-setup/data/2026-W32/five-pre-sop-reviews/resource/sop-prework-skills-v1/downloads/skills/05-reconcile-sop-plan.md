---
name: reconcile-sop-plan
description: Reconcile trusted performance exceptions, approved portfolio changes, the consensus demand plan, supply response options, and financial implications into a decision-ready pre-S&OP package. Use when an agent needs to resolve issues within delegated authority, quantify remaining gaps and trade-offs, compare scenarios, and prepare a recommendation with explicit executive decision asks.
---

> Standalone edition v1.2.0. This one Markdown file contains the complete method, input contract, output contract, guardrails, and first-run instructions. Attach it directly to ChatGPT, Claude, Gemini, Codex, or another approved AI workspace. For native Agent Skill installation, save it as `SKILL.md` inside a folder named `reconcile-sop-plan`. No companion file, bundled dataset, or proprietary tool is required.

# Reconcile S&OP Plan

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


Convert four functional hand-offs into one cross-functional recommendation. The output is not a stack of review summaries; it is the smallest complete package needed to choose and commit one plan.

## Inputs

Ask for the fields in the embedded input template below. At minimum require:

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
8. Produce the output contract in the embedded output template below.

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

---

## Embedded Input Template

## Integrated Reconciliation Input

### Cycle And Authority

- Cycle / horizon:
- Executive meeting date:
- Calendar / grain / units / currency:
- Escalation thresholds:
- Decision-rights map:

### Review Hand-Offs

| Review | File/version | As of | Verdict | Owner | Unresolved items |
|---|---|---|---|---|---|
| Data + Performance | | | | | |
| Portfolio | | | | | |
| Demand | | | | | |
| Supply | | | | | |

### Financial And Strategic Context

| Measure/commitment | Target | Current view | Valuation rule/source | Owner |
|---|---:|---:|---|---|
| | | | | |

### Candidate Decisions

| Issue | Available options | Authority required | Decision deadline | Consequence of delay |
|---|---|---|---|---|
| | | | | |

---

## Embedded Output Template

## Executive S&OP Decision Package

### Source-To-Input Map

| Requirement | Source file | Field / section | Owner | Version / as of | Status |
|---|---|---|---|---|---|

### Readiness Gaps

| Gap or conflict | Decision impact | Owner | Evidence needed | Due |
|---|---|---|---|---|

### Readiness Verdict

`READY / READY WITH EXCEPTIONS / NOT READY`

### Integrated Plan And Gap Bridge

| Scenario | Demand | Supply response | Service | Inventory | Financial/value view | Gap to commitment |
|---|---:|---|---|---|---|---|

### Resolved Before Executive S&OP

| Issue | Resolution | Authority used | Owner | Downstream action |
|---|---|---|---|---|

### Executive Options

| Option | Evidence | Operating consequence | Value consequence | Risk/reversibility | Owner |
|---|---|---|---|---|---|

### Recommendation

- Recommended option:
- Rationale:
- Conditions:
- Consequence of delay:
- Trigger to revisit:

### Decision Asks

| Ask | Evidence | Accountable owner | Options | Decision required by |
|---|---|---|---|---|

### Commitment Log Shell

| Decision | Owner | Effective period | System/action update | Due | Confirmation |
|---|---|---|---|---|---|

### Human Review Required

- Finance validation:
- S&OP lead validation:
- Executive decisions and commitments:
