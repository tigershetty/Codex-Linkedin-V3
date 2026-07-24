---
name: prepare-sop-data-readiness
description: Prepare the data and performance readiness review before an S&OP cycle. Use when an agent needs to reconcile source versions, test freshness and comparability, separate data-quality issues from real performance exceptions, and produce a trusted exception pack with owners and evidence gaps.
---

> Standalone edition v1.2.0. This one Markdown file contains the complete method, input contract, output contract, guardrails, and first-run instructions. Attach it directly to ChatGPT, Claude, Gemini, Codex, or another approved AI workspace. For native Agent Skill installation, save it as `SKILL.md` inside a folder named `prepare-sop-data-readiness`. No companion file, bundled dataset, or proprietary tool is required.

# Prepare S&OP Data Readiness

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


Turn scattered actuals, prior plans, KPI results, assumptions, and source notes into a reviewable exception pack. Do not turn uncertain evidence into false certainty.

## Inputs

Ask for the fields in the embedded input template below. At minimum require:

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
7. Produce the output contract in the embedded output template below.

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

---

## Embedded Input Template

## Data And Performance Readiness Input

### Cycle

- Cycle:
- Horizon:
- Calendar:
- Planning grain:
- Units and currency:
- Exception thresholds:

### Source Ledger

| Source | Measure | Version | As of | Owner | Grain/unit | Known issue |
|---|---|---|---|---|---|---|
| | | | | | | |

### Performance

| Measure | Actual | Prior plan/target | Variance | Period | Source |
|---|---:|---:|---:|---|---|
| | | | | | |

### Changes And Evidence

| Item | What changed | Evidence | Owner | Downstream review |
|---|---|---|---|---|
| | | | | |

---

## Embedded Output Template

## Trusted Exception Pack

### Source-To-Input Map

| Requirement | Source file | Field / section | Owner | Version / as of | Status |
|---|---|---|---|---|---|

### Readiness Gaps

| Gap or conflict | Decision impact | Owner | Evidence needed | Due |
|---|---|---|---|---|

### Readiness Verdict

`READY / READY WITH EXCEPTIONS / NOT READY`

### Source Ledger

| Source | Version/as of | Status | Owner | Decision impact |
|---|---|---|---|---|

### Exceptions

| Priority | Classification | Evidence | Variance | Owner | Next check | Downstream impact |
|---|---|---|---:|---|---|---|

### Assumption Changes

| Assumption | Previous | Current | Evidence | Reviews affected |
|---|---|---|---|---|

### Unresolved Evidence Gaps

| Gap | Why it matters | Owner | Required by |
|---|---|---|---|

### Hand-Off

- Portfolio receives:
- Demand receives:
- Supply receives:
- Integrated Reconciliation receives:

### Human Review Required

- Trust decision:
- Threshold exceptions:
- Conflicting-source decisions:
