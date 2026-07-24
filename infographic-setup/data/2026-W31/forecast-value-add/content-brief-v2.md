# Content Brief v2 - Forecast Value Add

**Week:** `2026-W31`
**Slug:** `forecast-value-add`
**Series:** `AI for Supply Chain`
**Candidate source:** `calendar`

## 1. Topic Qualification

**Topic:** Forecast Value Add (FVA) - did a human override improve the forecast it replaced?
**Audience segment:** Demand planners, demand planning managers, S&OP leaders, supply chain analysts, and early-career planners.
**Audience pain/desire:** Teams spend substantial time adjusting forecasts but often review the size of the error without testing whether the adjustment itself added value.
**Post promise:** Give the reader a practical FVA test that compares the adjusted forecast with its prior baseline and routes the override to keep, review, or stop.
**Why now:** ChatGPT can inspect structured spreadsheet data, calculate comparison metrics, and return reviewable tables and charts. This makes FVA a practical repeatable workflow rather than a specialist analysis rebuilt from scratch.
**Tiger authority:** Translate forecasting theory into a planner-reviewable operating artifact, with the calculation separated from the decision the team still owns.

## 2. Topic Score

| Dimension | Score |
|---|---:|
| Audience pain / desire /25 | 22 |
| Save utility /20 | 18 |
| Visual potential /15 | 14 |
| Freshness / timing /15 | 12 |
| Tiger authority /10 | 8 |
| Research strength /10 | 8 |
| Series fit /5 | 4 |
| **Total /100** | **86** |

**Decision:** `build`

## 3. Top-100 Reference Fit

**Reference-proven promise:** Find whether forecasting effort improves the number.
**Power format:** PF3 KPI / formula card, strengthened with PF2 comparison and a decision rule.
**Closest top-100 reference files:** `references/top 100/32.jpeg`, `references/top 100/59.png`, `references/top 100/77.jpeg`, `references/top 100/96.jpeg`.
**Caption pattern to adapt:** Diagnostic opening + worked example + actual input pack + review artifact + operating question.
**Save trigger:** FVA override test card and decision rule.
**Audience value in one sentence:** A planner can prove which overrides add repeatable value and which ones are consuming effort while making the forecast worse.
**Why this is Shetty's Desk, not a generic creator:** It connects the metric to the planning review, the override reason, and the decision about what the process should keep doing.

## 4. Research Thesis

**Non-obvious thesis:** Forecast accuracy tells you how wrong the forecast was; FVA tells you whether a process step made it better or worse than the forecast it replaced.
**Counterargument / caveat:** FVA depends on a declared error metric, comparable horizons and frozen forecast versions. Positive FVA can still be too small or inconsistent to justify the effort.
**What people get wrong:** They compare the adjusted forecast only with actual demand, omit the original baseline, mix forecast vintages, or treat one positive period as proof that every override rule works.
**Meeting-room use:** Review FVA by SKU, family, planner, and reason code; isolate repeatable wins, neutral work, and harmful adjustment patterns before changing the forecast process.

## 5. Content Shape

**Hook direction:** Contrarian accountability - human judgment should have to beat the forecast it replaced.
**Opening line candidate:** A forecast override is not valuable because it sounds informed. It is valuable only if it improves the number it replaced.
**Core explanation:** Use the same actuals and error metric to compare the baseline forecast with the human-adjusted forecast. Define FVA in error percentage points as baseline error minus adjusted error. Positive improves the forecast; zero adds no measurable gain; negative makes it worse.
**Reusable takeaway:** Keep an override register with the baseline, adjustment, reason, evidence, owner, horizon, actual, and resulting FVA. Learn from repeatable positive patterns and challenge repeated negative ones.
**CTA question:** If you measured every override against the forecast it replaced, which reason code would still earn the planner's time?

## 6. Visual Argument

> The reader should understand that an override must beat its baseline because the image shows actual demand calibrating two competing forecast traces and an FVA comparator routing the result to keep, review, or stop.

**Primary visual structure:** A premium 3D forecast calibration bench with an actual-demand reference rail, separate baseline and adjusted traces, a central FVA comparator, and a compact decision ledger.
**Reference direction:** Holy Grail physical staging + Ref 59 formula clarity + Ref 32's distinction between the number teams track and the diagnostic that matters.
**Data/labels needed:** Actual demand; naive baseline; human adjusted; baseline WAPE 18.2%; adjusted WAPE 12.7%; FVA +5.5 pts; positive / zero / negative rules; illustrative override reasons.
**HTML control needed?** `no` - GPT Image 2 first; deterministic logo cleanup only.

## 7. AI-for-SC Only

**Role:** Demand Planner
**Recurring frustration:** Forecast adjustments are debated one at a time, but the team cannot show which adjustment types improve accuracy consistently.
**Input data required:** Item-location, period, actual demand, baseline forecast, adjusted forecast, forecast vintage, horizon, override reason, evidence note, planner/owner, and optional value or volume weight.
**Current execution surface:** ChatGPT data analysis or ChatGPT for Excel / Google Sheets.

**Reusable unit:** Reusable FVA Review Skill plus deterministic workbook/script.

**Connected context:** Approved CSV/XLSX forecast history, override register, reason-code dictionary, and planning calendar.

**Work split:** Deterministic formulas or a script calculate WAPE and FVA; ChatGPT checks data quality, groups patterns, drafts the review board, and explains exceptions.

**Control gate:** Reject rows with missing actuals, mismatched horizons, absent baseline versions, or zero aggregate actual denominator. Recalculate the published figures independently before review.

**Finished artifact package:** FVA scorecard, override-value register, reason-code summary, harmful-override exceptions, and a demand-review brief.

**Cadence:** Monthly after actuals close, with an optional rolling exception view.

**Boundary / human decision point:** The planner approves whether an override rule is kept, retrained, narrowed, or removed; ChatGPT does not update the system-of-record forecast or planning policy.
**Caption value promise:** ChatGPT can turn forecast-version history into a review package that shows where overrides add value, where they add noise, and which patterns deserve investigation.
**Research date and official sources:** 2026-07-16. SAS, `Forecast Value Added Analysis: Step-by-Step`; OpenAI Help Center, `Extracting Insights with ChatGPT Data Analysis`; OpenAI Help Center, `ChatGPT for Excel and Google Sheets`.

**Reusable artifact:** FVA review pack: input schema, calculator, override register, decision board, validation checklist, and reusable Skill instructions.

## 8. Resource And Publish Handoff

**Resource eligibility score:** `6/6`
**Resource decision:** `required`
**Resource required for this post:** `yes`
**Resource construction gate:** `blocked until post package approval`
**Safe first run:** Run the calculator against a synthetic 12-month, 12-SKU file; produce the FVA board without production access or write-back.
**Direct download:** `yes - no email/account gate`
**Hook status:** `draft` / `approved`
**Selected hook:**
**Caption status:** `draft` / `approved`
**Visual status:** `approved`
**Motion status:** `pending`
**Post package status:** `draft`
**LinkedIn export:** native 4:5 / `visual-linkedin.png` required
**Website status:** `hold`
