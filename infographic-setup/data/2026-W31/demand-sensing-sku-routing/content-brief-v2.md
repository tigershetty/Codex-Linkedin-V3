# Content Brief v2 - Demand Sensing SKU Routing

**Week:** `2026-W31`
**Slug:** `demand-sensing-sku-routing`
**Series:** `AI for Supply Chain`
**Candidate source:** `calendar + editorial rebuild + audience need`

## 1. Topic Qualification

**Topic:** Use Claude to decide which SKUs deserve frequent demand sensing, monthly forecasting, or specialized review
**Audience segment:** supply planners, demand planners, S&OP analysts, planning managers, and early-career planning professionals
**Audience pain/desire:** stop applying one forecast cadence to a portfolio with different demand patterns, signal quality, and response windows
**Post promise:** show the input pack, routing tests, output artifact, and operating decisions behind a planner-reviewable SKU cadence board
**Why now:** it is RW06 Post 3 and extends the MPS/BOM week from planning mechanics into differentiated planning attention
**Tiger authority:** translate demand-sensing language into a practical portfolio decision that a planning team can review and maintain

## 2. Topic Score

| Dimension | Score |
|---|---:|
| Audience pain / desire /25 | 23 |
| Save utility /20 | 19 |
| Visual potential /15 | 15 |
| Freshness / timing /15 | 11 |
| Tiger authority /10 | 9 |
| Research strength /10 | 9 |
| Series fit /5 | 5 |
| **Total /100** | **91** |

**Decision:** `build`

## 3. Top-100 Reference Fit

**Reference-proven promise:** help the reader choose the right operating route rather than explain one more AI feature
**Power format:** PF6 decision tree + PF7 ranked-item logic + parallel workflow tracks
**Closest top-100 reference files:** Ref 11 for parallel workflow tracks, Ref 54 for decision routing, Ref 13 for plain-language planning distinctions, and Ref 70 for dense Claude artifact logic
**Caption pattern to adapt:** misconception -> input pack -> artifact -> planning decisions -> review question
**Save trigger:** Forecast Cadence Routing Map
**Audience value in one sentence:** a planner can use the board to challenge why every SKU is receiving the same forecasting cadence
**Why this is Shetty's Desk, not a generic creator:** it adds the response-window and special-method checks that prevent a simplistic volatility-only segmentation

## 4. Research Thesis

**Non-obvious thesis:** a faster forecast cycle only creates value when a fresh signal arrives and the business can still change a decision inside the response window
**Counterargument / caveat:** intermittent, lumpy, new, or phase-out items may need specialized methods or lifecycle logic instead of either standard lane
**What people get wrong:** demand sensing is treated as a superior forecast for every SKU, or high variability is treated as sufficient proof that an item belongs on a faster cadence
**Meeting-room use:** review the portfolio routing, challenge the reason, and assign the signal and decision each cadence is meant to support

## 5. Content Shape

**Hook direction:** portfolio mismatch / planning attention
**Opening line candidate:** Not every SKU deserves the same forecast cycle, and not every volatile SKU deserves demand sensing.
**Core explanation:** show what demand sensing changes, which tests determine routing, why the standard monthly layer still matters, and where special methods are required
**Reusable takeaway:** Forecast Cadence Routing Map
**CTA question:** which SKUs in your portfolio are being reviewed too slowly, and which are being reviewed faster without a decision to change?

## 6. Visual Argument

> The reader should understand that forecast cadence is a portfolio-routing decision because the image shows one SKU stream passing through five visible tests and branching into three operationally different planning lanes.

**Primary visual structure:** premium isometric planning switchyard with a central Claude-assisted routing gate, two large contrasting rails, and one narrow exception siding
**Reference direction:** Ref 11 parallel tracks, Ref 54 decision routing, Ref 13 role distinction, Ref 70 artifact density, and Holy Grail finish without repeating prior board or runway architecture
**Data/labels needed:** exact input pack, five routing tests, three routes, and the planning decisions each route supports
**HTML control needed?** `no`

## 7. AI-for-SC Only

**Role:** Supply Planner
**Recurring frustration:** every SKU receives the same monthly process even though signal speed, demand pattern, and response urgency differ
**Input data required:** demand history, zero-demand gaps, volume/value, variability, recent order/POS/promotion signals, lead time, service priority, lifecycle, forecast error, and planner comments
**Current execution surface:** Claude Cowork role plugin; controlled Claude Code package when deterministic calculations, scoped tools, and blocking QA are required
**Reusable unit:** `demand-sensing-routing-policy` skill plus the Demand Sensing Router plugin
**Connected context:** approved demand, forecast, order/POS, inventory, lead-time, service, lifecycle, planner-comment, and previous-cycle routing sources
**Work split:** demand-profile worker -> cadence-routing worker -> independent routing-verification worker
**Control gate:** reject missing or stale evidence, failed calculations, unsupported reasons, and frequent-sensing routes with no open response window; route failures to planner review
**Finished artifact package:** routing board / route-change log / data-quality exceptions / demand-review brief / run manifest
**Cadence:** scheduled Cowork run before the weekly demand review after the manual workflow is trusted
**Boundary / human decision point:** the planner owns the final cadence, forecasting method, and system-of-record change
**Caption value promise:** show how Claude can preserve the routing method, connect the evidence, prepare the same traceable package each cycle, and stop unsupported routes before planner review
**Research date and official sources:** 2026-07-14; Anthropic Cowork plugins, Cowork scheduled tasks, Claude Code subagents, and Claude Code hooks documentation
**Reusable artifact:** skill contract / worker map / control checklist / routing board / change log / review pack
