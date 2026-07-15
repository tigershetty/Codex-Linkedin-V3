# LinkedIn Caption - Demand Sensing SKU Routing

**Status:** 2026 execution-surface V3 draft; pending user approval
**Series:** AI for Supply Chain
**Tool position:** Claude Cowork role plugin with a controlled Claude Code path
**Companion:** `ai-workflow-starter-guide.md`
**Tool research:** `references/ai-work-surfaces-benchmark-2026-07.md`

## Recommended Hook

Claude becomes genuinely useful for demand planning when it can prepare the same routing decision every cycle, with the same policy, evidence, and checks.

## Hook Options

1. **Repeatable decision:** Claude becomes genuinely useful for demand planning when it can prepare the same routing decision every cycle, with the same policy, evidence, and checks.
2. **Prompt versus workflow:** A prompt can classify 50 SKUs once. A Claude workflow can rebuild the routing board every week, explain every move, and stop when the evidence is weak.
3. **Execution architecture:** The next step in demand sensing is not a longer prompt. It is a reusable Claude workflow with connected data, specialist workers, and a planner approval gate.
4. **Method persistence:** If Claude needs the routing rules explained every week, you have a conversation, but you do not yet have an operating workflow.
5. **Evidence first:** Most AI demand-planning demos end at the answer. The useful system starts with traceable inputs, a routing policy, and an exception board the planner can challenge.
6. **Skill upgrade:** The real upgrade is not giving Claude more context. It is turning the planning method into a skill the team can run consistently.
7. **Decision-window hook:** A faster signal only matters when it can still change a decision, and a useful Claude workflow should show both.
8. **Cowork hook:** Claude Cowork can now run connected and scheduled workflows. The supply-chain question is which operating artifact deserves that cadence.
9. **Worker pattern:** Three focused workers are more useful than one long prompt here: one profiles demand, one routes the SKU, and one tries to reject the result.
10. **Trust gate:** Before letting AI refresh a planning board every week, make it prove why each SKU moved and which decision is still open.

## 2026 Capability Audit

This audit measures the guidance in the caption, not expected reach or engagement.

| Dimension | Chat-first V2 | Execution V3 | What changed |
|---|---:|---:|---|
| Current product surface | 2 | 5 | Moves from ordinary chat to Cowork plugins, scheduled tasks, and Claude Code controls |
| Reusable method | 3 | 5 | Preserves routing policy as a named skill rather than rebuilding a prompt |
| Connected context | 2 | 4 | Uses approved sources or governed exports with source dates |
| Work orchestration | 2 | 5 | Separates profiling, routing, and independent verification |
| Deterministic control | 2 | 5 | Adds scoped tools plus hooks and tests that can block invalid output |
| Operating artifact | 4 | 5 | Produces the board, change log, exception list, meeting brief, and manifest |
| Cadence | 2 | 5 | Runs the approved package before the review through a scheduled task |
| Human ownership | 5 | 5 | Keeps policy approval and system-of-record changes with the planner |
| **Total** | **22/40** | **39/40** | **Passes the current execution-depth gate** |

## Voice QA

**Verdict:** pass as an advanced AI-for-SC publish candidate

- [x] Opens with a current capability and a practical demand-planning payoff.
- [x] Explains how to use Claude beyond a one-off conversation.
- [x] Names the reusable skill, connected context, workers, checks, outputs, and cadence.
- [x] Distinguishes Cowork's business-user lane from Claude Code's controlled execution lane.
- [x] Gives more space to what the workflow can build than to limitations.
- [x] Keeps the planner's role precise without turning the caption into a caveat list.
- [x] Uses connected reasoning and avoids generic AI-creator cadence.

## Draft Caption

Claude becomes genuinely useful for demand planning when it can prepare the same routing decision every cycle, with the same policy, evidence, and checks.

That is a very different capability from uploading a spreadsheet into chat and asking which SKUs need demand sensing.

For this workflow, I would build a Demand Sensing Router in Claude Cowork. The purpose is to prepare a traceable routing board before the demand review, so the planner can spend time challenging the exceptions rather than rebuilding the analysis.

The Cowork plugin would contain one reusable skill with the approved routing policy: demand regularity, variability, volume and value, signal freshness, response window, and lifecycle treatment.

Then I would connect the approved source files or systems and split the work between three specialist workers:

• the profile worker runs the approved ADI / zero-gap and CV2 / size-change checks
• the routing worker places each SKU-location into `SENSE FREQUENTLY`, `PLAN MONTHLY`, or `SPECIAL METHOD / REVIEW`
• the verification worker checks whether the route is supported by evidence, whether required fields are missing, and whether the operating decision is still open

The output should be more than one table. I would ask Claude to produce:

• the current routing board
• a route-change log showing which SKUs moved and why
• a data-quality and low-confidence exception list
• a meeting brief connecting each change to replenishment, deployment, allocation, or production sequence

Once the method is trusted, Cowork can run it as a scheduled task before the weekly demand review using the same connected tools, skill, and installed plugin. That means the team does not have to reconstruct the context and instructions each cycle.

For an environment that needs more deterministic control, the same design can run in Claude Code. MCP can provide scoped access to approved sources, each subagent can be limited to the tools it needs, and hooks or tests can block the output when required data is missing, a calculation fails, or an unsupported route is proposed.

The planner still approves the forecast policy and any system-of-record change. But the meeting can start further forward: which SKU changed lane, what signal triggered it, which decision remains open, and what evidence still needs to be challenged.

That is the shift I find interesting in 2026. The value is no longer the answer Claude gives in one conversation. It is the operating workflow the team can inspect, rerun, and improve.

If your demand review ran tomorrow, which part of this routing workflow would you trust Claude to prepare, and which decision would still need planner approval?

---

Follow [Poornajith Shetty](https://www.linkedin.com/in/shettys-desk/) and [Shetty's Desk](https://www.linkedin.com/company/shetty-s-desk/) for more supply chain insights, and save this for your next demand-planning review.
