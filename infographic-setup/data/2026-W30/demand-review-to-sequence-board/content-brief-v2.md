# Content Brief v2 — Demand Review To Sequence Board

**Week:** `2026-W30`  
**Slug:** `demand-review-to-sequence-board`  
**Series:** `AI for Supply Chain`  
**Candidate source:** `calendar` / `user-approved combo`

## 1. Topic Qualification

**Topic:** Demand Review Dashboard + Sequence to Cut Changeover  
**Audience segment:** S&OP analysts, demand planners, production planners, and supply-chain managers who have to translate forecast variance into factory action  
**Audience pain/desire:** the demand review often explains variance but leaves the production planner to manually work out what the miss does to product family mix, constraints, and changeover exposure  
**Post promise:** show how Claude can turn a demand review into a sequence decision board without pretending to replace the planner or optimizer  
**Why now:** this connects the two recent 101 posts: demand planning decisions and production plan translation. It shows the AI-for-SC version of that handoff.  
**Tiger authority:** practical operator lens: the useful AI workflow is not "ask AI for the schedule"; it is "use AI to structure the decision before the planner validates it."

## 2. Topic Score

| Dimension | Score |
|---|---:|
| Audience pain / desire /25 | 23 |
| Save utility /20 | 19 |
| Visual potential /15 | 15 |
| Freshness / timing /15 | 13 |
| Tiger authority /10 | 9 |
| Research strength /10 | 8 |
| Series fit /5 | 5 |
| **Total /100** | 92 |

**Decision:** `build`

## 3. Top-100 Reference Fit

**Reference-proven promise:** a planning artifact becomes save-worthy when it connects a familiar dashboard to the next decision the team must make.  
**Power format:** PF8 anatomy + PF6 decision tree + AI workflow card  
**Closest top-100 reference files:** `references/top 100/13.jpeg`; `references/top 100/39.jpeg`; `references/top 100/51.jpeg`; `references/top 100/70.jpeg`; `references/top 100/89.jpeg`  
**Caption pattern to adapt:** tool limitation -> AI workflow artifact -> meeting-room value -> operating question  
**Save trigger:** demand-to-sequence review board / verification checklist  
**Audience value in one sentence:** the reader can use the post as a model for turning forecast variance into production sequence options and planner checks.  
**Why this is Shetty's Desk, not a generic creator:** it treats AI as a planning co-pilot inside the real S&OP-to-factory handoff, with constraints and human sign-off visible.

## 4. Research Thesis

**Non-obvious thesis:** the demand review is not finished when the variance is explained; it is finished when the affected production decisions are visible.  
**Counterargument / caveat:** Claude should not be treated as the scheduling system of record or as an optimizer that commits the factory schedule; keep this logic in the brief while the published caption leads with the value of the artifact.  
**What people get wrong:** teams use AI to summarize dashboards, but the higher-value use case is connecting the miss to the factory decision: product family impact, constraint exposure, changeover risk, and sequence options.  
**Meeting-room use:** use before a demand review, S&OP supply review, or production-planning huddle where demand has moved and the team needs to decide what changes next.

## 5. Content Shape

**Hook direction:** role + Excel/Power BI limitation + Claude unlock  
**Opening line candidate:** Power BI can show you the error, but Claude can help turn it into the questions the planner needs on the table.  
**Core explanation:** start from forecast vs actual and root-cause notes, identify affected product families, map the miss into capacity/material/service/changeover checks, draft 2-3 sequence options, then validate against ERP/MES rules and planner judgment.  
**Reusable takeaway:** a demand-to-sequence review board with four zones: variance signal, constraint translation, sequence options, and human verification.  
**CTA question:** If demand moved tomorrow, would your review show the sequence decision that changes first?

## 6. Visual Argument

> The reader should understand `AI creates value when it translates demand variance into a production decision board` because the image shows `a premium demand review surface feeding a Claude-assisted constraint bridge and three planner-verifiable sequence options`.

**Primary visual structure:** premium 3D/isometric planning table with a split artifact: demand variance board on the left, constraint translation spine in the center, sequence option board on the right, human verification strip at the bottom  
**Reference direction:** Ref 13 for forecast-to-decision boundary, Ref 39 for S&OP alignment structure, Ref 51 and 70 for AI workflow artifact, Ref 89 for demand planning depth, Holy Grail standard for premium Shetty's Desk finish  
**Data/labels needed:** conceptual only; no invented time savings, percentages, or optimization scores  
**HTML control needed?** `no` — user explicitly requested GPT Image 2 render only; no backup render required.

## 7. AI-for-SC Only

**Role:** S&OP Analyst working with a Production Planner  
**Recurring frustration:** forecast accuracy and variance data live in Excel/Power BI, while sequence rules, material checks, and changeover logic sit in ERP/MES or planner knowledge  
**Input data required:** forecast vs actual by product family; open orders; current production plan; line/resource constraints; changeover rules; material availability; due dates; service priority; planner comments  
**AI workflow:** ask Claude to convert the demand miss into a structured board: variance summary, affected families, likely root cause, constraint checks, changeover risk, 2-3 sequence options, and planner verification questions  
**Verification step:** planner checks materials, tooling, quality constraints, frozen schedule windows, ERP/MES feasibility, and customer promise impact before any schedule change  
**Boundary / human decision point:** Claude structures the meeting artifact; the planner challenges the output and translates validated decisions into ERP/MES.  
**Caption value promise:** Power BI shows the error; Claude helps convert scattered planning inputs into the questions and sequence options the planner needs on the table.  
**Reusable artifact:** demand-to-sequence board / decision board / review pack / verification checklist
