# Research Brief — Demand Review To Sequence Board

**Week:** `2026-W30`  
**Slug:** `demand-review-to-sequence-board`  
**Series:** AI for Supply Chain  
**Status:** lean sourced brief for GPT Image 2 + caption

## 1. Working Thesis

The demand review becomes more useful when it does not stop at variance explanation. The next layer is operational translation: what product families are affected, which constraints changed, what sequence choices are now exposed, and what the planner must verify before the schedule is touched.

## 2. Source Anchors

| Source | What it supports | Reliability |
|---|---|---|
| Microsoft Learn, Dynamics 365 Supply Chain, production process overview: `https://learn.microsoft.com/en-us/dynamics365/supply-chain/production-control/production-process-overview` | Production execution depends on orders, BOM/routes, scheduling, release, and material availability checks. | High, primary vendor documentation |
| Microsoft Learn, Dynamics 365 Supply Chain, master planning overview: `https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/master-planning-home-page` | Master planning balances material and capacity requirements and calculates planned orders. | High, primary vendor documentation |
| Anthropic Docs, prompt engineering overview: `https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview` | Claude outputs improve when the user defines role, context, task, constraints, examples, and desired output. | High, primary vendor documentation |
| Anthropic Docs, use XML tags: `https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags` | Structured tags help separate source data, instructions, and output sections for more consistent prompts. | High, primary vendor documentation |
| Internal content engine references: `references/ai-for-sc-plan-v2.md`; `references/calendar-reference-adaptation-map-v1.md`; `references/holy-grail-visual-standard.md` | Calendar fit, AI-for-SC hook direction, and visual quality bar. | High, project source of truth |

## 3. Practical Workflow Logic

**Inputs the analyst needs before using Claude**

- Forecast vs actual by product family and period.
- Open orders and customer promise dates.
- Current production plan and frozen schedule window.
- Line/resource constraints and capacity assumptions.
- Changeover rules by product family, format, material, allergen, color, tool, or cleaning class.
- Material availability and shortage notes.
- Due date, service priority, and planner comments.

**Claude should produce**

- Demand variance summary: what moved and where.
- Root-cause hypothesis: promotion, pull-forward, lost order, order shift, customer delay, baseline issue, or signal noise.
- Affected product families and lines.
- Constraint translation: materials, capacity, service promise, changeover exposure.
- 2-3 sequence options with reasoning, not a committed schedule.
- Planner verification checklist.

**Human planner must verify**

- Material availability and supplier constraints.
- Tooling, quality, cleaning, allergen, color, or format changeover rules.
- Frozen schedule windows.
- ERP/MES feasibility and master-data accuracy.
- Service impact, customer priority, and escalation rules.

## 4. Caption Claims Allowed

- The forecast variance is diagnostic; the demand plan becomes operational when the team decides what changes next.
- AI is most useful here as a reasoning layer that translates scattered demand-review data into a structured planning conversation.
- Claude can draft the board, sequence options, and verification questions, but the planner owns feasibility and the final schedule decision.
- Avoid fake time savings, fake percentage improvement, or claiming optimization without actual plant data.

## 5. Visual Claims Allowed

- Left side: forecast vs actual / demand miss.
- Middle: constraint translation layer.
- Right side: sequence options A/B/C.
- Bottom: human verification strip.
- Claude may appear as a small workflow chip, not as the hero.
- No invented optimization score or dollar impact.

## 6. Prompt Skeleton For The AI Workflow

```text
<role>
You are helping an S&OP analyst prepare for a production-planning review.
</role>

<input_data>
Forecast vs actual by product family:
Open orders:
Current production plan:
Line/resource constraints:
Changeover rules:
Material availability:
Service priority:
Planner comments:
</input_data>

<task>
Build a demand-to-sequence review board. Show what changed, which product families are affected, which constraints need checking, and 2-3 production sequence options that may reduce unnecessary changeover.
</task>

<verification>
List the planner checks required before any schedule change is committed in ERP/MES.
</verification>
```

## 7. Data Integrity Rule

This post is conceptual and workflow-based. It should not include exact time savings, cost savings, changeover minutes, forecast accuracy percentages, or capacity deltas unless a future plant-specific source provides them.
