# S&OP Pre-Work Skills - Start Here

**Version:** `1.2.0`

Use five standalone workflows with the files your business already uses to prepare S&OP. The public library is deliberately small: one instruction PDF, this Markdown guide, and five self-contained skill files. There is no bundled dataset, completed answer, archive, email gate, account, or proprietary tool requirement.

## 1. Choose What To Download

Start with `SOP-PREWORK-START-HERE.pdf`. It explains the sequence, safe first run, expected hand-offs, and human approval boundary.

The individual download library contains exactly seven files:

- one branded instruction PDF;
- one Markdown edition of the same guide;
- five self-contained skill files with their setup instructions, input requirements, first-run prompt, method, guardrails, and output templates embedded.

Download only the review you need, or use all five in this order:

1. `01-prepare-sop-data-readiness.md` establishes trusted actuals, assumptions, and exceptions.
2. `02-review-sop-portfolio.md` separates proposed lifecycle changes from approved planning inputs.
3. `03-build-sop-demand-plan.md` reconciles baseline, evidence, judgment, and scenarios.
4. `04-test-sop-supply-feasibility.md` tests scenarios against constraints and response levers.
5. `05-reconcile-sop-plan.md` resolves what can be resolved and prepares the remaining executive decisions.

Each skill works independently. Earlier skill outputs can strengthen the next review, but they are never a hidden dependency: each skill can map equivalent evidence from your own project files and must stop with a readiness-gap list when that evidence is insufficient.

## 2. Start With Your Own Project

Create a working copy of the source data for one S&OP cycle. Begin with a narrow scope such as one product family, region, or business unit. Use governed CSV or XLSX exports, planning reports, approved presentations, decision logs, or other working documents rather than connecting the skill directly to a production system. The library does not provide example data because the method is designed to map the evidence already used in your business.

For each skill:

1. Download the standalone skill file for the review you want to prepare.
2. Attach it to ChatGPT, Claude, Gemini, Codex, or another approved AI workspace as project instructions or reference material.
3. Add copies of your relevant source files. The files do not need to match the template columns exactly; require the agent to map each available field to the embedded input contract before analysis.
4. Start in `READINESS` mode. Require the source-to-input map and review all missing, stale, conflicting, or unclear evidence.
5. Move to `BUILD` mode only when the minimum evidence is sufficient.
6. Review the artifact with the named business owner before it becomes an input to the next review.

Suggested first prompt:

> Use this skill with my attached project files. Start in READINESS mode. Create the required source-to-input map, show which file and field satisfies each embedded input, and list anything missing, stale, conflicting, or unclear. Do not invent values or silently resolve conflicts. Move to BUILD mode only when the minimum evidence is sufficient. Then follow the method, return the embedded output contract, and end with the human decisions still required.

Remove or mask personal, customer-identifying, commercially sensitive, and credential data unless the selected AI environment and use are explicitly approved. Keep the original source files unchanged and save the generated artifact as a separate draft for review.

## 3. Load A Skill Into Your Tool

- **ChatGPT, Claude, or Gemini:** upload one skill file with the relevant project files, then paste the first-run prompt. Use a project or workspace approved for the data you are sharing.
- **Codex or another Agent Skills-compatible tool:** create a folder using the skill name, rename the downloaded file to `SKILL.md`, and place it in that folder. The file has valid skill frontmatter and needs no companion assets.
- **Any other document-capable assistant:** attach the skill as reference instructions and explicitly ask the assistant to follow its method and output contract.

The five files are frameworks, not software integrations. They do not require API keys, production-system access, or matching column names. They do require enough traceable evidence to support the requested review.

## 4. Judge The Hand-Off, Not The Meeting

| Review | The skill must produce | It must not do |
|---|---|---|
| Data + Performance | trusted source ledger and prioritized exception pack | choose a preferred source silently |
| Portfolio | explicit decision state and downstream impact | turn a roadmap date into approval |
| Demand | baseline-to-consensus bridge and conditional scenarios | hide overrides inside one number |
| Supply | feasibility verdicts and comparable response options | assume infinite capacity or materials |
| Reconciliation | recommendation, options, and explicit decision asks | approve the plan or invent value impacts |

A complete-looking document can still be weak. Reject an output when it cannot show where a number came from, who owns the assumption, which decision could change, or what remains unknown.

Use one shared readiness rule for anything sent to executives:

`READY = EVIDENCE + OWNER + OPTIONS + ASK`

This is a Shetty's Desk operating synthesis, not a quoted industry standard.

## 5. Keep Accountable Decisions With People

These skills prepare decisions; they do not make accountable business decisions.

- Data owners decide which source and version are trusted.
- Product and portfolio owners approve lifecycle changes.
- Commercial and demand owners approve overrides and the consensus demand plan.
- Operations, supply, procurement, and finance approve response options and values.
- Executives choose the scenario, allocate resources, and commit one plan.
- Authorized system owners make system-of-record changes.

Adapt review names, grain, thresholds, approval rights, calendars, and templates to the business. Preserve the control logic: uncertain evidence stays uncertain, options use comparable dimensions, and an executive ask always names the owner and decision window.

The skills are framework files, not a universal S&OP design or a substitute for the source systems behind it. Adapt the fields and thresholds deliberately, record the changes, and never treat an agent-produced artifact as an approved operating plan.
