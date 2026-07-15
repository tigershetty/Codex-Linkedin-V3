# AI Work Surfaces Benchmark - July 2026

**Status:** active research reference
**Research date:** 2026-07-14
**Applies to:** AI-for-Supply-Chain topic selection, research, captions, companion guides, and tool claims
**Purpose:** keep Shetty's Desk AI content at the current execution layer rather than teaching 2022-style chat prompting

## Executive Finding

The current professional AI layer is no longer defined by a better chat window. Across the leading ecosystems, the common architecture is:

1. **persistent method** through a skill, plugin, agent, project, or governed instruction set;
2. **connected context** through apps, connectors, MCP servers, workspace files, or enterprise data sources;
3. **specialized execution** through subagents, workflow steps, deterministic nodes, scripts, or tools;
4. **verification and control** through restricted permissions, hooks, tests, human checkpoints, or approval gates;
5. **finished artifacts** such as spreadsheets, reports, presentations, exception packs, or interactive interfaces;
6. **cadence** through schedules, triggers, monitoring, long-running agents, or headless execution.

For Shetty's Desk, ordinary chat is now a scratchpad or discovery surface. A flagship AI-for-SC post should teach the execution architecture unless the post is explicitly for first-time users.

## Current Official Product Evidence

### Claude

- [Cowork plugins](https://claude.com/blog/cowork-plugins) can bundle skills, connectors, slash commands, and subagents so Claude can be tailored to a role, team, or company.
- [Cowork scheduled tasks](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork) can run on demand or on a recurring cadence and use the same connected tools, skills, and installed plugins as regular Cowork tasks.
- [Claude Code subagents](https://code.claude.com/docs/en/sub-agents) support custom prompts, tool restrictions, permission modes, skills, MCP servers, hooks, and persistent memory.
- [Claude Code hooks](https://code.claude.com/docs/en/hooks) can call commands, prompts, agents, HTTP endpoints, or connected MCP tools. Blocking decisions can prevent a tool call or stop an invalid workflow step.

**Supply-chain implication:** Claude can support a role plugin in Cowork for business users and a more deterministic Claude Code implementation when the workflow needs scripts, scoped tools, validation, or stronger controls.

### ChatGPT and Codex

- [ChatGPT Work](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) was introduced on July 9, 2026 for longer tasks across connected apps and files. It can create finished documents, spreadsheets, presentations, reports, and Sites, while Scheduled Tasks can repeat, trigger, or monitor work.
- [Plugins in ChatGPT and Codex](https://help.openai.com/en/articles/20001256-plugins-in-chatgpt-and-codex) package skills, apps, and app templates into workflow capabilities. Apps provide governed access to external systems, data, and actions.
- [Skills in ChatGPT](https://help.openai.com/en/articles/20001066-skills-in-chatgpt) are reusable and shareable workflows that can contain instructions, examples, supporting resources, and code. OpenAI Skills follow the Agent Skills open standard.

**Supply-chain implication:** Work is the business execution surface, while Codex is appropriate when the workflow lives in files, code, scripts, tests, or a version-controlled operating package.

### Microsoft 365 Copilot

- [Copilot agents](https://support.microsoft.com/en-us/Microsoft-365-Copilot/get-started-with-agents-in-the-microsoft-365-copilot-app) can connect to organizational knowledge and data sources and automate or execute business processes.
- [Copilot Notebooks](https://support.microsoft.com/en-us/Microsoft-365-Copilot/get-started-with-microsoft-365-copilot-notebooks) provide a shared, scoped workspace for files, pages, meeting notes, links, and custom instructions.
- [Copilot Workflows](https://support.microsoft.com/en-US/Microsoft-365-Copilot/get-started-with-workflows-in-microsoft-365-copilot) can generate automations across supported Microsoft 365 services, including scheduled or event-triggered actions and human input through Teams adaptive cards. As of the research date, Workflows is an early-access Frontier feature.
- [Scheduled prompts](https://support.microsoft.com/en-us/microsoft-365-copilot/schedule-your-most-used-copilot-prompts) can run recurring Copilot prompts where the required license and admin settings are available.

**Supply-chain implication:** Copilot is especially relevant when the planning context, review meeting, approvals, and source documents already live in SharePoint, Teams, Outlook, Excel, or Planner.

### Gemini

- [Google Workspace Studio](https://workspace.google.com/blog/product-announcements/introducing-google-workspace-studio-agents-for-everyday-work) is a generally available surface for designing, managing, and sharing agents across Workspace, with no-code workflows and custom Apps Script steps.
- [Gemini Enterprise](https://cloud.google.com/blog/products/ai-machine-learning/whats-new-in-gemini-enterprise) supports reusable skills, deterministic nodes, human-in-the-loop checkpoints, long-running agents, observability, Projects, connected data, and bring-your-own MCP integrations.
- [Gemini Spark](https://cloud.google.com/blog/products/ai-machine-learning/innovations-from-google-io-26-on-google-cloud) is positioned as a background personal agent that can run multi-step and recurring work with approvals for higher-risk actions.

**Supply-chain implication:** Gemini Enterprise is the clearest current example of combining generative reasoning with deterministic workflow nodes, human approval, observability, and long-running execution in one enterprise surface.

### Grok

- [Grok Skills](https://x.ai/news/grok-skills) provide persistent, shareable workflows and built-in document, spreadsheet, presentation, and PDF production.
- [Grok Build](https://x.ai/news/grok-build-cli) is an early-beta terminal agent with plan/review/approve, AGENTS.md support, plugins, hooks, skills, MCP servers, parallel subagents, worktrees, and headless execution for scripts and automations.

**Supply-chain implication:** Grok now has credible reusable-skill and technical-agent surfaces, but Build remains an early beta and should be described accordingly.

## Cross-Tool Capability Map

| Ecosystem | Business execution surface | Reusable method | Connected context/actions | Orchestration and control | Recurring operation | Strongest current fit |
|---|---|---|---|---|---|---|
| Claude | Cowork | Plugins and skills | Connectors; MCP in Code | Subagents; permissions; hooks and tests in Code | Cowork scheduled tasks | Role-specific workflow that can graduate into a controlled file/data pipeline |
| OpenAI | ChatGPT Work | Plugins and skills | Apps; local files and desktop tools; Codex connectors | Work for long tasks; Codex for files, scripts, tests, and review | Work Scheduled Tasks; Codex automations | Finished business artifacts plus a version-controlled execution lane |
| Microsoft | Copilot agents and Notebooks | Agent instructions and scoped notebook context | Microsoft 365 data and supported services | Agents; visual Workflows; DLP; adaptive-card input | Scheduled prompts; workflow schedules and triggers | Work already centered in Microsoft 365 and team approvals |
| Google | Workspace Studio and Gemini Enterprise | Skills, agents, Projects | Workspace, partner connectors, and BYO-MCP | Deterministic nodes, human checkpoints, observability, long-running agents | Studio flows, long-running agents, Spark recurring work | Enterprise orchestration with explicit governance and traceability |
| xAI | Grok Skills and Grok Build | Skills, plugins, AGENTS.md | MCP servers and repo tools in Build | Plan approval, hooks, subagents, worktrees | Headless scripts and external automation | Technical workflows and portable skill-based document production |

This map compares documented capability surfaces, not model intelligence or vendor quality. Availability varies by plan, region, administrator configuration, and rollout status.

## The New Shetty's Desk Caption Standard

An AI-for-SC caption should now answer at least seven of these nine questions:

1. **Surface:** Which current execution surface is being used, and why does it fit this job?
2. **Reusable unit:** What is preserved as the skill, plugin, agent, workflow, or governed instruction set?
3. **Context:** Which approved files, connected systems, or MCP tools provide the evidence?
4. **Work split:** Which worker, subagent, deterministic step, or tool performs each part?
5. **Control:** What validation, permission, hook, test, or approval prevents a plausible but unsupported result?
6. **Artifact:** Which spreadsheet, decision board, exception pack, report, or interface is produced?
7. **Cadence:** Is the workflow run on demand, scheduled, triggered, monitored, or long-running?
8. **Human ownership:** Which decision remains with the planner, buyer, scheduler, or leader?
9. **Meeting payoff:** How does the artifact move the operating conversation forward?

## Depth Rules

- Do not present uploading a file to ordinary chat as a sophisticated 2026 workflow.
- Do not use `agent` as a decorative word. Name its inputs, tools, permissions, work, outputs, and stop conditions.
- Do not claim a connected workflow when the example only contains manually uploaded files.
- Prefer one exact workflow architecture over a broad list of product features.
- Show what becomes reusable between runs: policy, context, tools, checks, and output schema.
- Include one control that can reject or stop the output, not only a reminder to review it.
- Describe the finished operating artifact and the meeting decision it prepares.
- Treat schedules and write actions as an earned final layer, not the first demonstration.

## Research Refresh Rule

Product surfaces are changing quickly. Before publishing any named-tool claim:

1. check the vendor's official release notes or help center;
2. record the research date in the post package;
3. distinguish generally available, beta, preview, and early-access features;
4. avoid claiming a feature is available to every plan or workspace;
5. update this benchmark when the operating surface materially changes.
