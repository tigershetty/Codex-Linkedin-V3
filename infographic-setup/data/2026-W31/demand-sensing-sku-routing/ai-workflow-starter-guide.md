# Claude Demand Sensing Router - 2026 Build Guide

**Audience:** planners, analysts, and transformation teams building a repeatable Claude workflow
**Purpose:** turn the visual's routing logic into a connected, scheduled, and planner-reviewable operating package
**Primary surface:** Claude Cowork with a role plugin
**Controlled surface:** Claude Code with skills, MCP, restricted subagents, scripts, and blocking validation
**Research date:** 2026-07-14

## What This Builds

The workflow prepares a demand-sensing routing package before the demand review. It does not decide the final forecast policy or update the planning system.

Each run produces:

1. `routing-board.xlsx` or `routing-board.csv`;
2. `route-change-log.xlsx` showing what moved since the last cycle and why;
3. `data-quality-exceptions.xlsx` for missing, stale, or low-confidence evidence;
4. `demand-review-brief.md` connecting route changes to open operating decisions;
5. `run-manifest.json` containing source dates, policy version, run time, and validation status.

## Lane A - Claude Cowork Role Plugin

Use Cowork when the team needs a business-user workflow that can work across approved files and connected tools, create finished artifacts, and run on a schedule.

Anthropic documents that [Cowork plugins](https://claude.com/blog/cowork-plugins) can bundle skills, connectors, slash commands, and subagents. [Scheduled tasks](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork) can use those same connected tools, skills, and installed plugins.

### 1. Reusable Skill - `demand-sensing-routing-policy`

The skill should preserve:

- the required fields and data dictionary;
- approved ADI / zero-gap and CV2 / size-change definitions;
- volume and value treatment;
- signal-freshness rules;
- response-window definitions by decision type;
- lifecycle and intermittent-demand treatment;
- the three allowed routing lanes;
- the fixed output schema;
- missing-data and low-confidence behavior;
- one planner-approved example.

The skill is the method. It should not contain current-cycle numbers.

### 2. Connected Context

Connect only approved sources, or place governed exports in one controlled folder:

- demand history by SKU-location;
- forecast and actuals;
- open orders or POS signals;
- inventory and deployment position;
- lead time and service priority;
- promotion and lifecycle status;
- current planning policy;
- planner comments and known one-offs;
- the previous cycle's routing board.

Record the extract time and source name in the run manifest. A signal without a date cannot pass the freshness test.

### 3. Specialized Workers

Configure the plugin around three separate jobs.

#### Demand Profile Worker

- validates the required columns;
- runs the approved regularity and variability calculations;
- identifies zero-demand gaps, size changes, and lifecycle conditions;
- writes the evidence table;
- cannot assign the final routing lane.

#### Cadence Routing Worker

- reads the evidence table and routing skill;
- recommends `SENSE FREQUENTLY`, `PLAN MONTHLY`, or `SPECIAL METHOD / REVIEW`;
- names the trigger signal and response window;
- identifies the replenishment, deployment, allocation, or sequence decision still open;
- writes a routing reason that points back to evidence fields.

#### Routing Verification Worker

- checks that every route has evidence;
- rejects stale or undated signals;
- rejects a frequent-sensing route when no operating decision remains open;
- sends missing, conflicting, or low-confidence cases to planner review;
- compares the result with the previous cycle and explains every lane change;
- cannot approve a planning-system or master-data update.

### 4. Scheduled Pre-Review Task

Once the manual runs are stable, schedule one Cowork task before the weekly demand review:

```text
Run the installed Demand Sensing Router plugin against the latest approved source package.

Use routing-policy version CURRENT. First validate the source dates and required fields. Then run the demand profile, cadence routing, and independent verification workers in that order.

Produce the routing board, route-change log, data-quality exceptions, demand-review brief, and run manifest. Do not publish a final route for any item that fails verification. Do not write back to the planning system. Notify the planner when the package is ready for approval.
```

The scheduled run should prepare the meeting. It should not silently close exceptions or change policy.

## Lane B - Controlled Claude Code Package

Use Claude Code when the workflow needs deterministic calculations, several files, version control, scoped database or tool access, and blocking QA.

### Logical Package

```text
demand-sensing-router/
  CLAUDE.md
  policy/
    routing-policy.md
    data-dictionary.md
    decision-windows.md
  inputs/
    current/
    previous/
  scripts/
    validate-inputs
    profile-demand
    verify-routing
  templates/
    routing-board
    route-change-log
    demand-review-brief
  outputs/
  tests/
```

### Controls To Implement

Claude Code supports [custom subagents](https://code.claude.com/docs/en/sub-agents) with restricted tools, permissions, skills, MCP servers, hooks, and memory. Use that control surface deliberately:

- give the profile worker read access plus only the approved calculation script;
- give the routing worker read access to policy and evidence plus write access only to the draft output folder;
- make the verifier read-only and independent from the routing worker;
- scope each MCP connection to the worker that needs it;
- keep source systems read-only for the first implementation;
- use a command hook or test to block completion when validation fails.

Blocking checks should include:

1. missing required columns;
2. duplicate SKU-location-period rows;
3. undated or stale trigger signals;
4. calculations that did not run successfully;
5. routing reasons without evidence fields;
6. frequent-sensing recommendations without an open response window;
7. route changes without an explanation;
8. output rows that bypass planner review after a failed check.

Anthropic's [hooks documentation](https://code.claude.com/docs/en/hooks) supports blocking decisions before or after tool use. The production check should be a deterministic command or test where possible; an LLM verifier can add a second opinion but should not replace numeric and schema validation.

## Planner Approval Board

The planner should receive one review table:

```text
SKU | LOCATION | PREVIOUS LANE | PROPOSED LANE | ROUTING EVIDENCE |
TRIGGER SIGNAL | SIGNAL DATE | RESPONSE WINDOW | DECISION SUPPORTED |
MISSING DATA | VERIFICATION STATUS | PLANNER DECISION | COMMENT
```

The meeting starts with the rows that changed lane, failed verification, or have a closing response window. Stable rows remain available but do not consume the same attention.

## Tool Adaptation

The operating method is portable even though the product architecture changes:

| Product | Equivalent build |
|---|---|
| ChatGPT / Codex | ChatGPT Work or Codex + plugin + skill + approved apps + Scheduled Task / automation |
| Microsoft 365 Copilot | Agent + Notebook context + Microsoft 365 sources + Workflow or scheduled prompt + Teams approval |
| Gemini | Workspace Studio or Gemini Enterprise agent + reusable skill + deterministic nodes + human checkpoint + recurring run |
| Grok | Grok Skill or Grok Build + MCP + hooks + parallel workers + headless script |

Use `references/ai-work-surfaces-benchmark-2026-07.md` before promising any named capability. Availability changes by plan, region, administrator settings, and rollout status.

## Publishable Value

The sophisticated lesson is not that Claude can classify SKUs. It is that the team can preserve a planning policy as a reusable skill, connect the evidence, split the work, reject unsupported routes, produce the same operating package, and run it before every review without rebuilding the method from a blank conversation.
