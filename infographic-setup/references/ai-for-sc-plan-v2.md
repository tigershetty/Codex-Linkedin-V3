# AI for Supply Chain — Topic Plan v2 (W21–W52)
**Version**: 2.0
**Aligned with**: `references/101-plan.md` monthly themes
**Used by**: `/ai-for-sc` skill (Step 2: Load Pre-Defined Use Cases)
**Status**: Active from W21 (2026-06-07)

---

## How to Read This File

Each week has two posts (Post A and Post B). Every post entry specifies:
- **Role** — the specific SC role this post speaks to
- **Tool** — the AI tool used (Claude / ChatGPT / Copilot / Gemini)
- **Use Case** — the specific task or workflow the post covers
- **Hook direction** — the hook type and angle that fits this use case
- **Visual** — standard 4-card workflow grid unless noted otherwise

**Series standard visual**: 4-card workflow grid — TRIGGER (top-left) → INPUT (top-right) → OUTPUT (bottom-left) → ACTION (bottom-right). Each card: 2–3 bullet specifics + one callout line. Exceptions noted per post.

**Tool selection guide** (quick reference):
- **Claude** — document drafting, structured analysis, multi-step reasoning, scenario framing, policy/compliance language
- **ChatGPT** — calculation, formula-based analysis, scoring models, fast iteration, broad data interpretation
- **Copilot** — Excel formulas, Power BI, Word/PowerPoint, in-file data analysis, Microsoft 365 workflows
- **Gemini** — market research, trade compliance, multi-source search, web-linked data

**Role diversity rule**: Each week uses 2 different SC roles.
**Tool diversity rule**: Each week uses 2 different AI tools.

---

## Month 1: Procurement (W21–W25)

The first monthly theme. Both 101 Advanced and AI for SC cover the procurement function simultaneously. 101 teaches the foundational concepts (supplier scorecards, PO flow, RFQ, spend analysis, contract management). AI for SC shows the daily workflows where AI cuts hours of manual work.

---

### W21 — 101 context: Supplier Scorecard (Post 1) | How a PO works (Post 2)

**Post A — AI for SC Ep01**
- **Role**: Purchaser
- **Tool**: Claude
- **Use Case**: Draft an RFQ with evaluation criteria and weighted scoring matrix
- **Hook direction**: Timeline-Shock — hours to draft an RFQ from scratch vs. 20 minutes with Claude producing the evaluation template, criteria weighting, and scoring matrix
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep02**
- **Role**: Category Manager
- **Tool**: ChatGPT
- **Use Case**: Build a should-cost model to anchor negotiation before supplier meeting
- **Hook direction**: Decision-Pressure — walk into the negotiation knowing the number the supplier can justify before they present their quote
- **Visual**: Standard 4-card workflow grid

---

### W22 — 101 context: Procurement cycle 7-step flow (Post 1) | Spend analysis (Post 2)

**Post A — AI for SC Ep03**
- **Role**: Purchaser
- **Tool**: Claude
- **Use Case**: Review a supplier contract and flag the 5 highest-risk clauses with plain-language explanations
- **Hook direction**: Paradox — the contract that looks standard is the one that costs you when something goes wrong; Claude finds the clauses before your lawyer does
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep04**
- **Role**: Category Manager
- **Tool**: Gemini
- **Use Case**: Research current market pricing trends to challenge a supplier's proposed price increase
- **Hook direction**: Contrarian — stop accepting the price the supplier brings to the table; here's the data that challenges it
- **Visual**: Standard 4-card workflow grid

---

### W23 — 101 context: How to compare supplier quotes (Post 1) | Procurement funnel (Post 2)

**Post A — AI for SC Ep05**
- **Role**: Category Manager
- **Tool**: Copilot
- **Use Case**: Build a supplier evaluation scorecard in Excel for quarterly business reviews (QBRs)
- **Hook direction**: Question-How — how do you run a QBR when your supplier data lives in 3 different systems and a folder of emails?
- **Visual**: Dashboard mockup layout — scorecard template showing criteria columns and supplier rows

**Post B — AI for SC Ep06**
- **Role**: Purchaser
- **Tool**: Claude
- **Use Case**: Model a supplier's likely price increase arguments and build counter-arguments for the negotiation
- **Hook direction**: Decision-Pressure — the supplier meeting is in 48 hours; run this before you walk in
- **Visual**: Standard 4-card workflow grid

---

### W24 — 101 context: Production BOM (Post 1) | OEE (Post 2)

**Post A — AI for SC Ep07**
- **Role**: Purchaser
- **Tool**: Claude
- **Use Case**: Analyse maverick spend — identify purchasing outside contracted suppliers and quantify the cost
- **Hook direction**: Stat-Lead — a significant share of spend happens outside contract terms; Claude finds it before your next spend review
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep08**
- **Role**: Category Manager
- **Tool**: ChatGPT
- **Use Case**: Total cost of ownership (TCO) comparison across 3 supplier quotes — beyond unit price
- **Hook direction**: Comparison-Gap — unit price tells you one number; total cost of ownership tells you which supplier is actually cheaper
- **Visual**: 3-column comparison visual (Supplier A / Supplier B / Supplier C, cost components as rows)

---

### W25 — 101 context: Supplier concentration risk (Post 1) | Supplier performance review (Post 2)

**Post A — AI for SC Ep09**
- **Role**: Supply Planner
- **Tool**: Claude
- **Use Case**: Build a supplier flexibility matrix — how much volume swing can each supplier absorb and in what timeframe?
- **Hook direction**: Question-Why — why do volume swings always expose the same 3 suppliers? Build the matrix before the next demand spike
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep10**
- **Role**: Category Manager
- **Tool**: Gemini
- **Use Case**: Build a supplier risk profile — financial stability, geographic exposure, contract expiry, single-source risk
- **Hook direction**: Result-First — start with what a complete supplier risk profile looks like, then show how Gemini builds it in minutes from public sources
- **Visual**: Standard 4-card workflow grid

---

## Month 2: Production Planning (W26–W31)

The second monthly theme. 101 covers demand forecasting, production plans, MPS, S&OP, capacity planning, and safety stock. AI for SC shows how planners and analysts use AI to do the analysis that feeds these processes — demand decomposition, bias detection, scenario modelling, forecast accuracy tracking.

---

### W26 — 101 context: How demand forecasting works (Post 1) | Demand plan vs. forecast (Post 2)

**Post A — AI for SC Ep11**
- **Role**: Demand Planner
- **Tool**: Claude
- **Use Case**: Decompose historical demand into trend, seasonality, and noise to identify the root cause of forecast error
- **Hook direction**: Question-Why — why does your forecast keep being wrong in the same direction? The answer is in the decomposition
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep12**
- **Role**: S&OP Analyst
- **Tool**: Copilot
- **Use Case**: Build a demand review tracking dashboard in Excel/Power BI — forecast vs. actuals by product family with variance flagging
- **Hook direction**: Question-How — how do you run the demand review when forecast accuracy data is scattered across SAP, Excel, and 3 manual reports?
- **Visual**: Dashboard mockup layout

---

### W27 — 101 context: What is a production plan (Post 1) | Scheduling horizon zones (Post 2)

**Post A — AI for SC Ep13**
- **Role**: Production Planner
- **Tool**: Claude
- **Use Case**: Suggest 3 production sequences that minimise changeover time for a given product mix
- **Hook direction**: Stat-Lead — every changeover that runs over plan is capacity your team can't get back; Claude sequences the run before your scheduler does it manually
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep14**
- **Role**: Supply Planner
- **Tool**: ChatGPT
- **Use Case**: Calculate optimal batch size using setup cost, demand rate, and holding cost — Economic Order Quantity applied to production
- **Hook direction**: Question-How — how do you find the batch size that minimises total cost without running the formula every time the demand rate changes?
- **Visual**: Formula visualisation — inputs (setup cost, demand, holding cost) → calculation → output (optimal batch size + cost comparison at 3 batch sizes)

---

### W28 — 101 context: MPS as production commitment (Post 1) | BOM and MPS connection (Post 2)

**Post A — AI for SC Ep15**
- **Role**: Supply Planner
- **Tool**: Claude
- **Use Case**: Identify which SKUs should be on demand sensing (short-cycle) vs. monthly statistical forecasting based on demand variability and volume
- **Hook direction**: Paradox — not all SKUs should be planned the same way; the ones on monthly forecasting are the ones causing your worst stockouts
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep16**
- **Role**: Demand Planner
- **Tool**: ChatGPT
- **Use Case**: Calculate forecast value-add (FVA) — does your adjusted forecast actually beat the naive baseline?
- **Hook direction**: Contrarian — if your forecast adjustments don't beat a naive model, you're adding noise, not insight; here's how to prove it
- **Visual**: Before/after comparison — naive baseline vs. adjusted forecast with FVA score and implication

---

### W29 — 101 context: 5 pre-S&OP reviews (Post 1) | What kills an S&OP (Post 2)

**Post A — AI for SC Ep17**
- **Role**: S&OP Analyst
- **Tool**: Claude
- **Use Case**: Write the S&OP demand review narrative with root cause analysis for each variance from plan
- **Hook direction**: Timeline-Shock — demand review narrative that takes a full day to write: Claude produces the draft in 15 minutes from your actuals and commentary
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep18**
- **Role**: Demand Planner
- **Tool**: Copilot
- **Use Case**: Track forecast accuracy by product family in Excel — MAPE, bias, and trend over 13 weeks
- **Hook direction**: Question-How — how do you know which product families are dragging your forecast accuracy down without rebuilding the tracker every month?
- **Visual**: Dashboard mockup layout

---

### W30 — 101 context: Capacity utilisation (Post 1) | What is RCCP (Post 2)

**Post A — AI for SC Ep19**
- **Role**: Production Planner
- **Tool**: Claude
- **Use Case**: Identify the production bottleneck by analysing cycle time per station against the production schedule
- **Hook direction**: Result-First — start with what the bottleneck analysis surfaces and the decision it enables, then show the 20-minute Claude workflow
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep20**
- **Role**: Supply Planner
- **Tool**: ChatGPT
- **Use Case**: Model 3 capacity scenarios for the next peak season: overtime, weekend shift, and outsource — cost, lead time, and risk for each
- **Hook direction**: Decision-Pressure — the S&OP plan is set; now which capacity option do you commit to and how do you explain the trade-offs to leadership?
- **Visual**: 3-column scenario comparison (OT / Weekend shift / Outsource, cost + lead time + risk as rows)

---

### W31 — 101 context: Reorder point (Post 1) | Service level cost curve (Post 2)

**Post A — AI for SC Ep21**
- **Role**: Demand Planner
- **Tool**: Claude
- **Use Case**: Analyse promotion lift — how much did the promotion actually drive versus base demand, and how accurate was the forecast?
- **Hook direction**: Contrarian — your promotion forecast has a systematic error; Claude shows you where the bias is so you can fix it for the next campaign
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep22**
- **Role**: S&OP Analyst
- **Tool**: Gemini
- **Use Case**: Research leading economic and category indicators that correlate with your demand — what signals predict your category 8 weeks ahead?
- **Hook direction**: Question-Why — why wait for the forecast to be wrong when the signal that explains it is already public and searchable?
- **Visual**: Standard 4-card workflow grid

---

## Month 3: Inventory Management (W32–W35)

The third monthly theme. 101 covers the 4 types of inventory, inventory positioning, turnover metrics, SKU rationalisation, the cash conversion cycle, and stockout root cause. AI for SC shows how supply planners and warehouse managers use AI to do the analysis that drives smarter stock decisions.

---

### W32 — 101 context: 4 types of inventory (Post 1) | Inventory positioning in network (Post 2)

**Post A — AI for SC Ep23**
- **Role**: Supply Planner
- **Tool**: Claude
- **Use Case**: Audit safety stock parameters — find SKUs where the parameters are aged, over-specified, or no longer reflect current lead time and variability
- **Hook direction**: Stat-Lead — a significant share of safety stock is set using parameters that haven't been reviewed in over 2 years; Claude runs the audit in 20 minutes
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep24**
- **Role**: Demand Planner
- **Tool**: ChatGPT
- **Use Case**: Calculate revenue at risk from forecast inaccuracy — how much stockout and overstock cost your product lines annually
- **Hook direction**: Question-How — how do you put a number on what bad forecasting is costing you before the CFO asks?
- **Visual**: Formula visualisation — inputs → revenue at risk calculation → cost breakdown (stockout vs. overstock)

---

### W33 — 101 context: Inventory turnover (Post 1) | Pareto in procurement (Post 2)

**Post A — AI for SC Ep25**
- **Role**: Supply Planner
- **Tool**: Claude
- **Use Case**: Model what happens to your stockout risk if your primary supplier's lead time doubles — week-by-week impact on stock position
- **Hook direction**: Timeline-Shock — a 5-day lead time extension becomes a 3-week stockout if you don't model it before it happens; here's the 15-minute workflow
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep26**
- **Role**: Demand Planner
- **Tool**: Copilot
- **Use Case**: Segment SKUs by demand variability and volume in Excel to identify which should move from make-to-stock to make-to-order
- **Hook direction**: Contrarian — some SKUs shouldn't be in stock at all; the variability and volume data tells you which ones before you're stuck with obsolete inventory
- **Visual**: Dashboard mockup layout — variability vs. volume matrix with quadrant labels

---

### W34 — 101 context: SKU rationalisation (Post 1) | Cash conversion cycle (Post 2)

**Post A — AI for SC Ep27**
- **Role**: Warehouse Manager
- **Tool**: Claude
- **Use Case**: Analyse warehouse utilisation by zone to identify slotting inefficiencies — which slow movers are occupying the golden zone?
- **Hook direction**: Question-Why — why is the golden zone full of slow movers and the fast movers at the back? Claude maps it from your transaction data
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep28**
- **Role**: Supply Planner
- **Tool**: Copilot
- **Use Case**: Build an inventory replenishment calendar by SKU tier in Excel — when to reorder, how much, and which SKUs are on watch
- **Hook direction**: Question-How — how do you manage reorder timing across 200 SKUs without building the calendar from scratch every week?
- **Visual**: Dashboard mockup layout — weekly calendar with SKU tiers as rows and reorder triggers highlighted

---

### W35 — 101 context: Stockout root cause (Post 1) | 5 supply chain failure modes (Post 2)

**Post A — AI for SC Ep29**
- **Role**: Warehouse Manager
- **Tool**: Claude
- **Use Case**: Develop a slotting strategy — which SKUs belong in the golden zone, which in bulk storage, which off-site, which should be discontinued
- **Hook direction**: Decision-Pressure — the next warehouse layout review is coming; build the slotting recommendation before the conversation, not during it
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep30**
- **Role**: Supply Planner
- **Tool**: ChatGPT
- **Use Case**: Compare 3 replenishment strategies for a product family — fixed quantity, fixed interval, and min-max — on total inventory cost and service level
- **Hook direction**: Comparison-Gap — same SKU, 3 replenishment rules, 3 different inventory positions; ChatGPT runs the cost comparison before you commit to one
- **Visual**: 3-column comparison (Fixed Qty / Fixed Interval / Min-Max, cost + service level + volatility as rows)

---

## Month 4: Logistics & Fulfilment (W36–W40)

The fourth monthly theme. 101 covers OTIF, 3PL RFPs, order management, cross-docking, reverse logistics, last mile, and incident response. AI for SC shows how logistics coordinators, transport specialists, and supply planners use AI to manage carrier performance, transport spend, and supply disruptions.

---

### W36 — 101 context: OTIF vs. fill rate (Post 1) | 3PL RFP (Post 2)

**Post A — AI for SC Ep31**
- **Role**: Logistics Coordinator
- **Tool**: Claude
- **Use Case**: Compress daily exception management — turn 90 minutes of transport admin into a 20-minute structured workflow using Claude to triage, summarise, and draft responses
- **Hook direction**: Timeline-Shock — 90 minutes of daily exception emails to 20 minutes of structured triage; here's the workflow
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep32**
- **Role**: Transport Specialist
- **Tool**: ChatGPT
- **Use Case**: Reveal 8–12% transport savings by analysing lane-level spend data — which lanes are overpaying and where is consolidation possible?
- **Hook direction**: Stat-Lead — 8–12% of transport spend sits in consolidation opportunities that aren't visible at the total spend level; here's the lane-level analysis
- **Visual**: Standard 4-card workflow grid

---

### W37 — 101 context: Order management (Post 1) | Cross-docking (Post 2)

**Post A — AI for SC Ep33**
- **Role**: Logistics Coordinator
- **Tool**: ChatGPT
- **Use Case**: Compare 3 carrier quotes by total transport cost — beyond rate per shipment to include transit time, accessorial charges, and carrier reliability score
- **Hook direction**: Comparison-Gap — 3 carrier quotes look different at face value; total transport cost tells which is actually cheapest
- **Visual**: 3-column comparison (Carrier A / Carrier B / Carrier C, with cost components and performance score)

**Post B — AI for SC Ep34**
- **Role**: Transport Specialist
- **Tool**: Copilot
- **Use Case**: Build a carrier performance dashboard in Excel/Power BI — OTIF%, cost per shipment, claims rate, and invoice accuracy by carrier
- **Hook direction**: Question-How — how do you hold carriers accountable when the data lives in the TMS, the finance system, and a shared inbox?
- **Visual**: Dashboard mockup layout

---

### W38 — 101 context: Reverse logistics (Post 1) | 5 stages of a return (Post 2)

**Post A — AI for SC Ep35**
- **Role**: Logistics Coordinator
- **Tool**: Claude
- **Use Case**: Analyse 6 months of transport spend by lane to identify where you're overpaying and where consolidation could save cost
- **Hook direction**: Result-First — start with what the lane analysis produces (specific lanes, savings opportunities, consolidation options), then the 25-minute Claude workflow
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep36**
- **Role**: Supply Planner
- **Tool**: ChatGPT
- **Use Case**: Identify the supply chain bottleneck across the supplier, production, and warehouse layers — where is the constraint actually sitting?
- **Hook direction**: Question-Why — the constraint keeps showing up in the same place every quarter; here's how to find where it actually is, not where it appears to be
- **Visual**: Standard 4-card workflow grid

---

### W39 — 101 context: Last mile delivery (Post 1) | Cold chain logistics (Post 2)

**Post A — AI for SC Ep37**
- **Role**: Supply Planner
- **Tool**: Claude
- **Use Case**: Compare peak season capacity options — overtime, weekend shift, and outsourcing — on cost, lead time, and risk for an upcoming demand peak
- **Hook direction**: Decision-Pressure — peak season is 8 weeks out; which capacity option do you commit to and how do you present the trade-offs to leadership?
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep38**
- **Role**: Warehouse Manager
- **Tool**: Copilot
- **Use Case**: Calculate throughput rate per labour hour by shift in Excel — identify which shifts are running at full efficiency and which have hidden capacity losses
- **Hook direction**: Stat-Lead — the gap between best and worst shift throughput is often 20–30%; Copilot surfaces it from your time-and-motion data
- **Visual**: Dashboard mockup layout

---

### W40 — 101 context: Supply chain war room (Post 1) | 3 types of supply disruption (Post 2)

**Post A — AI for SC Ep39**
- **Role**: Logistics Coordinator
- **Tool**: Claude
- **Use Case**: Build a disruption response playbook for the top 3 suppliers — what to do in the first 48 hours if each one fails
- **Hook direction**: Paradox — most disruption plans exist on paper until the disruption happens and nobody follows them; Claude builds the one your team actually uses
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep40**
- **Role**: Supply Planner
- **Tool**: ChatGPT
- **Use Case**: Stress-test the supply plan: demand spikes 25% and 2 suppliers fail simultaneously — model the stockout risk and recovery timeline
- **Hook direction**: Decision-Pressure — stress-test your supply plan before the crisis does it for you; here's the 20-minute scenario model
- **Visual**: Standard 4-card workflow grid

---

## Month 5: Supply Chain Technology (W41–W44)

The fifth monthly theme. 101 covers ERP, WMS/TMS stacks, supply chain visibility, control towers, digital twins, IBP, and VMI. AI for SC shows how analysts, planners, and SC managers use AI to work with these systems — filling gaps where ERP falls short, building templates the systems should produce, and doing the analysis the tech stack can't automate.

---

### W41 — 101 context: What is an ERP (Post 1) | SC technology stack (Post 2)

**Post A — AI for SC Ep41**
- **Role**: SC Analyst
- **Tool**: Claude
- **Use Case**: Map current ERP data gaps — what data is missing, inaccurate, or delayed that prevents reliable forecasting and planning
- **Hook direction**: Question-Why — why is the ERP data available but the forecast still unreliable? The answer is usually in the gaps Claude helps you find
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep42**
- **Role**: Supply Planner
- **Tool**: Copilot
- **Use Case**: Build a manual MRP check in Excel to validate whether ERP-generated purchase orders are actually correct
- **Hook direction**: Contrarian — the ERP runs MRP automatically; here's why every supply planner should know how to check it manually before an order goes out
- **Visual**: Formula visualisation — MRP inputs (demand, stock on hand, safety stock, lead time) → manual calculation → comparison with ERP output

---

### W42 — 101 context: Supply chain visibility (Post 1) | What is a control tower (Post 2)

**Post A — AI for SC Ep43**
- **Role**: Logistics Coordinator
- **Tool**: Gemini
- **Use Case**: Trade compliance in 60 seconds — classify an HS code, check import duties, and confirm export documentation requirements using Gemini's live web search
- **Hook direction**: Timeline-Shock — HS code classification and compliance check that takes 20 minutes of manual search: 60 seconds with Gemini
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep44**
- **Role**: SC Manager
- **Tool**: Claude
- **Use Case**: Build an exception management template for control tower triage — how to categorise, prioritise, and respond to supply chain exceptions before they escalate
- **Hook direction**: Question-How — how do you decide which of the 40 exceptions in this morning's report actually need your attention today?
- **Visual**: Standard 4-card workflow grid

---

### W43 — 101 context: What is a SC audit (Post 1) | Digital twin (Post 2)

**Post A — AI for SC Ep45**
- **Role**: SC Analyst
- **Tool**: Copilot
- **Use Case**: Build a weekly SC KPI dashboard in Excel tracking 5 key metrics — OTIF, inventory turns, forecast accuracy, days of supply, and perfect order rate
- **Hook direction**: Result-First — show what the finished dashboard looks like and the decision it enables, then the 3-hour Copilot build process
- **Visual**: Dashboard mockup layout

**Post B — AI for SC Ep46**
- **Role**: Demand Planner
- **Tool**: Claude
- **Use Case**: Write a data quality audit for planning system inputs — identify which data fields are incomplete, inconsistent, or systematically biased before the next planning cycle
- **Hook direction**: Question-Why — before you improve the forecast, check if the data it runs on is clean; most forecast errors start here
- **Visual**: Standard 4-card workflow grid

---

### W44 — 101 context: IBP (Post 1) | VMI (Post 2)

**Post A — AI for SC Ep47**
- **Role**: Supply Planner
- **Tool**: Claude
- **Use Case**: Write VMI replenishment rules for a supplier handover document — min/max levels, trigger conditions, ordering frequency, and escalation protocol
- **Hook direction**: Paradox — VMI gives the supplier visibility into your stock; here's how to write the rules that protect you before you hand over that access
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep48**
- **Role**: SC Manager
- **Tool**: Copilot
- **Use Case**: Build an IBP/S&OP data handshake template in Excel — what data Finance, Sales, and Operations each need to submit and by when for the S&OP cycle to run
- **Hook direction**: Decision-Pressure — the S&OP cycle keeps stalling because Finance submits late with incomplete data; build the handshake template before the next cycle
- **Visual**: Dashboard mockup layout

---

## Month 6: Risk / Finance / Career (W45–W48)

The sixth monthly theme. 101 covers SC finance, working capital, landed cost, tariffs, resilience, NPI timelines, and the SC career ladder. AI for SC shows how category managers, supply planners, and SC managers use AI to build the financial models, business cases, and risk frameworks that support high-stakes decisions.

---

### W45 — 101 context: SC finance for non-finance (Post 1) | Landed cost (Post 2)

**Post A — AI for SC Ep49**
- **Role**: Category Manager
- **Tool**: Claude
- **Use Case**: Calculate the annualised cost of a current procurement problem — maverick spend, contract leakage, or supplier failure — to build the case for intervention
- **Hook direction**: Result-First — start with what the cost calculation produces (a number leadership can act on), then the 20-minute Claude build
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep50**
- **Role**: Supply Planner
- **Tool**: ChatGPT
- **Use Case**: Calculate the working capital impact of reducing inventory by 5 days across a product line — how much cash does that free and where does it come from?
- **Hook direction**: Stat-Lead — 5 fewer inventory days across your product line frees more working capital than most teams realise; here's the calculation
- **Visual**: Formula visualisation — inputs (DIO, revenue, inventory value) → 5-day reduction calculation → working capital freed

---

### W46 — 101 context: Tariff impact (Post 1) | 3 types of SC resilience (Post 2)

**Post A — AI for SC Ep51**
- **Role**: Category Manager
- **Tool**: Claude
- **Use Case**: Model the expected annual cost reduction from consolidating 3 suppliers to 1 — volume discount, admin cost saving, and contract leverage
- **Hook direction**: Question-How — how do you model what supplier consolidation saves before you go to procurement leadership with a recommendation?
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep52**
- **Role**: SC Manager
- **Tool**: ChatGPT
- **Use Case**: Build a cost of inaction model — what does NOT fixing this supply chain problem cost per quarter in lost margin, expedite fees, and management time?
- **Hook direction**: Contrarian — the business case should start with what NOT changing costs, not what the investment returns; here's how to build it
- **Visual**: Before/after comparison — current state costs vs. investment + return, with payback timeline

---

### W47 — 101 context: NPI supply chain timeline (Post 1) | NPI process breakpoints (Post 2)

**Post A — AI for SC Ep53**
- **Role**: SC Manager
- **Tool**: Claude
- **Use Case**: Write a one-page executive summary for a supply chain investment — problem, solution, investment required, and expected return in plain language
- **Hook direction**: Decision-Pressure — the business case review is in 2 weeks; build the executive summary now, not the night before
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep54**
- **Role**: Category Manager
- **Tool**: Copilot
- **Use Case**: Model the working capital impact of extending payment terms from 30 to 60 days across the top 10 suppliers in Excel
- **Hook direction**: Stat-Lead — extending terms 30 days across your top suppliers frees significant working capital; Copilot models it supplier by supplier
- **Visual**: Dashboard mockup layout — suppliers as rows, current terms vs. extended terms, working capital impact per supplier and total

---

### W48 — 101 context: What a SC Director actually does (Post 1) | From SC analyst to SC director (Post 2)

**Post A — AI for SC Ep55**
- **Role**: Supply Planner
- **Tool**: Claude
- **Use Case**: Build a month-by-month payback model for a supply chain initiative — when does the investment pay back and how does cumulative savings build?
- **Hook direction**: Question-How — how do you show leadership exactly when the investment pays back, not just that it does?
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep56**
- **Role**: SC Manager
- **Tool**: Copilot
- **Use Case**: Build a supply chain risk register in Excel — list top risks, assign financial exposure, probability, and mitigation owner
- **Hook direction**: Result-First — show what a completed risk register looks like and the conversation it enables with leadership, then the 2-hour Copilot build
- **Visual**: Dashboard mockup layout

---

## Month 7: Toolkit & Year-End (W49–W52)

The seventh and final monthly theme. 101 covers AI tool selection guides, AI adoption patterns, year-in-review concepts, and SC leader priorities for 2027. AI for SC turns the spotlight inward — building the personal workflows, team guides, and planning tools that make everything else in this series easier to sustain.

---

### W49 — 101 context: Which AI tool for which SC task (Post 1) | 5 times AI fails in SC (Post 2)

**Post A — AI for SC Ep57**
- **Role**: Demand Planner
- **Tool**: Claude
- **Use Case**: Build a personal prompt library — 5 paste-ready forecasting prompts for the tasks you run every week
- **Hook direction**: Question-How — if you could only keep 5 AI prompts for your forecasting workflow, which would they be and why?
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep58**
- **Role**: Logistics Coordinator
- **Tool**: Copilot
- **Use Case**: Build a SC KPI tracker template in Excel that the whole team can update weekly — OTIF, exceptions logged, and carrier performance in one sheet
- **Hook direction**: Timeline-Shock — building a shared KPI tracker from scratch takes most of a morning; Copilot builds the template in 10 minutes
- **Visual**: Dashboard mockup layout

---

### W50 — 101 context: AI fluency without a training programme (Post 1) | SC AI adoption curve (Post 2)

**Post A — AI for SC Ep59**
- **Role**: SC Analyst
- **Tool**: Claude
- **Use Case**: Write a 1-page AI workflow guide for your SC team — what to use AI for, what to check, and the 3 prompts your team should start with today
- **Hook direction**: Question-Why — why do most AI adoption efforts stall at 2 people using it after 3 months? The guide your team actually needs is not a training deck
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep60**
- **Role**: SC Manager
- **Tool**: Gemini
- **Use Case**: Research how benchmark SC teams are using AI by function — what are companies like yours actually doing with AI in procurement, planning, and logistics?
- **Hook direction**: Contrarian — before you build your AI roadmap, know what teams like yours have already figured out; Gemini finds it across industry reports and case studies
- **Visual**: Standard 4-card workflow grid

---

### W51 — 101 context: 10 SC concepts for 2027 (Post 1) | What changed in SC in 2026 (Post 2)

**Post A — AI for SC Ep61**
- **Role**: Supply Planner
- **Tool**: Claude
- **Use Case**: Write the year-end supply chain performance narrative for leadership — what the function delivered, where it fell short, and what the data shows
- **Hook direction**: Decision-Pressure — the year-end review is on the calendar; write the supply chain narrative before the meeting, not during it
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep62**
- **Role**: SC Manager
- **Tool**: ChatGPT
- **Use Case**: Model 3 scenarios for the 2027 SC challenges most likely to affect your function — optimistic, base case, and downside
- **Hook direction**: Question-How — how do you frame next year's SC risks as scenarios rather than a list of assumptions no one reads?
- **Visual**: 3-column scenario comparison (Optimistic / Base / Downside, with SC implication and team response for each)

---

### W52 — 101 context: SC challenges that will define 2027 (Post 1) | How SC leaders prepare (Post 2)

**Post A — AI for SC Ep63**
- **Role**: SC Manager
- **Tool**: Claude
- **Use Case**: Build the Q1 2027 AI priority list — which 3 SC workflows will you focus AI on first based on this year's gaps and team readiness?
- **Hook direction**: Result-First — show what the priority list looks like (3 workflows, with rationale and first step), then the 30-minute Claude process
- **Visual**: Standard 4-card workflow grid

**Post B — AI for SC Ep64**
- **Role**: Demand Planner
- **Tool**: Copilot
- **Use Case**: Build a 52-week SC planning calendar template in Excel — key milestones, S&OP dates, review cycles, and seasonal triggers mapped to the week
- **Hook direction**: Timeline-Shock — manually building your planning calendar for the year takes most of a morning; Copilot builds the template from your inputs in 20 minutes
- **Visual**: Dashboard mockup layout

---

## Episode Index

| Ep | Week | Role | Tool | Use Case (short) |
|---|---|---|---|---|
| 01 | W21 | Purchaser | Claude | RFQ with evaluation criteria and scoring matrix |
| 02 | W21 | Category Manager | ChatGPT | Should-cost model for negotiation |
| 03 | W22 | Purchaser | Claude | Contract review — flag 5 risk clauses |
| 04 | W22 | Category Manager | Gemini | Market pricing research to challenge supplier |
| 05 | W23 | Category Manager | Copilot | Supplier scorecard for QBRs in Excel |
| 06 | W23 | Purchaser | Claude | Supplier price increase counter-arguments |
| 07 | W24 | Purchaser | Claude | Maverick spend analysis |
| 08 | W24 | Category Manager | ChatGPT | TCO comparison across 3 supplier quotes |
| 09 | W25 | Supply Planner | Claude | Supplier flexibility matrix |
| 10 | W25 | Category Manager | Gemini | Supplier risk profile |
| 11 | W26 | Demand Planner | Claude | Demand decomposition (trend / seasonality / noise) |
| 12 | W26 | S&OP Analyst | Copilot | Demand review tracking dashboard |
| 13 | W27 | Production Planner | Claude | Production sequence — minimise changeover |
| 14 | W27 | Supply Planner | ChatGPT | Optimal batch size calculation |
| 15 | W28 | Supply Planner | Claude | SKUs for demand sensing vs. monthly forecasting |
| 16 | W28 | Demand Planner | ChatGPT | Forecast value-add vs. naive baseline |
| 17 | W29 | S&OP Analyst | Claude | S&OP demand review narrative |
| 18 | W29 | Demand Planner | Copilot | Forecast accuracy tracking by product family |
| 19 | W30 | Production Planner | Claude | Bottleneck identification by cycle time |
| 20 | W30 | Supply Planner | ChatGPT | 3 capacity scenarios for peak season |
| 21 | W31 | Demand Planner | Claude | Promotion lift analysis |
| 22 | W31 | S&OP Analyst | Gemini | Leading indicators for 8-week forecast |
| 23 | W32 | Supply Planner | Claude | Safety stock parameter audit |
| 24 | W32 | Demand Planner | ChatGPT | Revenue at risk from forecast inaccuracy |
| 25 | W33 | Supply Planner | Claude | Lead time doubling — stockout risk model |
| 26 | W33 | Demand Planner | Copilot | SKU segmentation by variability (MTS vs. MTO) |
| 27 | W34 | Warehouse Manager | Claude | Warehouse utilisation by zone — slotting audit |
| 28 | W34 | Supply Planner | Copilot | Inventory replenishment calendar by SKU tier |
| 29 | W35 | Warehouse Manager | Claude | Slotting strategy — golden zone, bulk, offsite |
| 30 | W35 | Supply Planner | ChatGPT | Replenishment strategy comparison — 3 methods |
| 31 | W36 | Logistics Coordinator | Claude | Exception management — transport admin compression |
| 32 | W36 | Transport Specialist | ChatGPT | Lane-level transport savings (8–12%) |
| 33 | W37 | Logistics Coordinator | ChatGPT | Carrier quote comparison — total transport cost |
| 34 | W37 | Transport Specialist | Copilot | Carrier performance dashboard |
| 35 | W38 | Logistics Coordinator | Claude | 6-month transport spend by lane |
| 36 | W38 | Supply Planner | ChatGPT | Bottleneck identification across SC layers |
| 37 | W39 | Supply Planner | Claude | Peak season capacity options comparison |
| 38 | W39 | Warehouse Manager | Copilot | Throughput rate per labour hour by shift |
| 39 | W40 | Logistics Coordinator | Claude | Disruption response playbook (top 3 suppliers) |
| 40 | W40 | Supply Planner | ChatGPT | Supply stress-test: demand +25%, 2 suppliers fail |
| 41 | W41 | SC Analyst | Claude | ERP data gap mapping for forecasting |
| 42 | W41 | Supply Planner | Copilot | Manual MRP check in Excel |
| 43 | W42 | Logistics Coordinator | Gemini | Trade compliance — HS code in 60 seconds |
| 44 | W42 | SC Manager | Claude | Control tower exception management template |
| 45 | W43 | SC Analyst | Copilot | Weekly SC KPI dashboard (5 metrics) |
| 46 | W43 | Demand Planner | Claude | Planning data quality audit |
| 47 | W44 | Supply Planner | Claude | VMI replenishment rules document |
| 48 | W44 | SC Manager | Copilot | IBP/S&OP data handshake template |
| 49 | W45 | Category Manager | Claude | Annualised cost of procurement problem |
| 50 | W45 | Supply Planner | ChatGPT | Working capital from 5-day inventory reduction |
| 51 | W46 | Category Manager | Claude | Supplier consolidation cost model |
| 52 | W46 | SC Manager | ChatGPT | Cost of inaction model |
| 53 | W47 | SC Manager | Claude | Executive summary for SC investment |
| 54 | W47 | Category Manager | Copilot | Payment terms extension model (30→60 days) |
| 55 | W48 | Supply Planner | Claude | Month-by-month payback model |
| 56 | W48 | SC Manager | Copilot | SC risk register in Excel |
| 57 | W49 | Demand Planner | Claude | Personal prompt library — 5 forecasting prompts |
| 58 | W49 | Logistics Coordinator | Copilot | Team SC KPI tracker template |
| 59 | W50 | SC Analyst | Claude | 1-page AI workflow guide for team |
| 60 | W50 | SC Manager | Gemini | Benchmark research — how SC teams use AI |
| 61 | W51 | Supply Planner | Claude | Year-end SC performance narrative |
| 62 | W51 | SC Manager | ChatGPT | 3 scenarios for 2027 SC challenges |
| 63 | W52 | SC Manager | Claude | Q1 2027 AI priority list |
| 64 | W52 | Demand Planner | Copilot | 52-week SC planning calendar template |
