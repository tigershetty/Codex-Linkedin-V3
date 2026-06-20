# Shetty's Desk — Master Run Calendar
**Recalibrated**: 2026-06-20 (was drifting — built for W21 start, but only W21–W22 shipped)
**This file is the single source of truth for: what week am I on, what posts this week, what's the status.**

---

## The one idea that makes this simple

There are **two kinds of "week"** and keeping them separate is what stops the drift:

| | What it is | Example | Changes? |
|---|---|---|---|
| **Run Week (RW##)** | The week you actually **post**. Counted from the relaunch, anchored to the real calendar. | RW01 = week of Jun 22 | Re-anchored to today |
| **Plan Week (PW##)** | The **content's identity** in the topic banks (`101-plan.md`, `ai-for-sc-plan-v2.md`). Never moves. | PW23 = "Supplier evaluation" | Fixed forever |

**You think in Run Weeks. The skills read Plan Weeks.** This file is the bridge. If you ever fall behind or skip a week, you only re-point this table — you never renumber the content.

**Data folders** stay ISO-week named (`data/2026-W26/…`) so they sort correctly and match the post date.

---

## How to run a week (the weekly loop)

Each Run Week = **4 posts** on **one theme**: 2 × Supply Chain 101 (the concept) + 2 × AI for SC (the workflow).

```
1.  Open this file → find the current Run Week row → note its slugs + commands.
2.  /101 [slug]                     → Post 1 + Post 2  (concept)         → data/{ISO-week}/{slug}/101-copy.md
3.  /ai-for-sc W[PW] [slug]         → Post 3 + Post 4  (AI workflow)     → data/{ISO-week}/{slug}/ai-for-sc-{slug}.md
4.  Render the visual (pick the lane): code-render PNG (/renderer) · animated GIF (HyperFrames) · AI still (Higgsfield)
5.  Post on LinkedIn → tick the box in this file → /feedback [slug]
6.  After analytics export: /analytics [slug]
```

> **Cadence is yours.** The table assumes one Run Week per real calendar week, but the only thing that matters is order. Behind? Just keep going down the rows — the dates are a guide, the sequence is the contract.

---

## Status snapshot (as of recalibration)

| Plan Week | Theme / sub-topic | 101 (P1+P2) | AI for SC (P3+P4) |
|---|---|---|---|
| PW21 | Procurement / What is procurement | ✅ shipped | ✅ shipped (Ep01 RFQ, Ep02 should-cost) |
| PW22 | Procurement / RFQ & sourcing | ✅ copy saved | ⚠️ **gap** — Ep03 (contract review) + Ep04 (market pricing) never produced |
| **PW23 →** | **Procurement / Supplier evaluation** | **▶ RW01 — building now** | **▶ RW01 — building now** |

> **The PW22 AI gap is optional backfill.** The relaunch picks up cleanly at PW23 to keep momentum. If you want the two missing PW22 AI posts later, run `/ai-for-sc W22`.

---

## The Run Calendar (next 12 weeks — detailed)

Legend: ☐ to do · ◐ drafted · ✅ posted

| Run Wk | Dates (2026) | Data folder | Theme | Sub-topic | 101 — Post 1 | 101 — Post 2 | AI for SC — Post 3 | AI for SC — Post 4 |
|---|---|---|---|---|---|---|---|---|
| **RW01** | **Jun 22–28** | `2026-W26` | Procurement | Supplier evaluation | ◐ Compare supplier quotes `compare-supplier-quotes` | ◐ Procurement funnel (100→1) `procurement-funnel` | ◐ Ep05 · Cat. Mgr × Copilot · Supplier scorecard for QBRs `supplier-scorecard-qbr` | ◐ Ep06 · Purchaser × Claude · Price-increase counter-args `price-increase-counterargs` |
| RW02 | Jun 29–Jul 5 | `2026-W27` | Procurement | Contract management | ☐ Production BOM (the recipe) | ☐ OEE — why 85% beats 100% | ☐ Ep07 · Purchaser × Claude · Maverick spend analysis | ☐ Ep08 · Cat. Mgr × ChatGPT · TCO across 3 quotes |
| RW03 | Jul 6–12 | `2026-W28` | Procurement | Supplier performance | ☐ Supplier concentration risk | ☐ Supplier performance review | ☐ Ep09 · Supply Planner × Claude · Supplier flexibility matrix | ☐ Ep10 · Cat. Mgr × Gemini · Supplier risk profile |
| RW04 | Jul 13–19 | `2026-W29` | Production Planning | Demand forecasting | ☐ How demand forecasting works | ☐ Demand plan vs. forecast | ☐ Ep11 · Demand Planner × Claude · Demand decomposition | ☐ Ep12 · S&OP Analyst × Copilot · Demand review dashboard |
| RW05 | Jul 20–26 | `2026-W30` | Production Planning | Production planning | ☐ What is a production plan | ☐ Scheduling horizon (frozen/slushy/liquid) | ☐ Ep13 · Prod. Planner × Claude · Sequence to cut changeover | ☐ Ep14 · Supply Planner × ChatGPT · Optimal batch size (EOQ) |
| RW06 | Jul 27–Aug 2 | `2026-W31` | Production Planning | MPS | ☐ MPS as a production commitment | ☐ BOM ↔ MPS connection | ☐ Ep15 · Supply Planner × Claude · Sensing vs. monthly SKUs | ☐ Ep16 · Demand Planner × ChatGPT · Forecast value-add (FVA) |
| RW07 | Aug 3–9 | `2026-W32` | Production Planning | S&OP | ☐ The 5 pre-S&OP reviews | ☐ What kills an S&OP | ☐ Ep17 · S&OP Analyst × Claude · Demand review narrative | ☐ Ep18 · Demand Planner × Copilot · Forecast accuracy tracker |
| RW08 | Aug 10–16 | `2026-W33` | Production Planning | Capacity planning | ☐ Capacity utilisation (100% isn't the goal) | ☐ What is RCCP | ☐ Ep19 · Prod. Planner × Claude · Bottleneck by cycle time | ☐ Ep20 · Supply Planner × ChatGPT · 3 capacity scenarios |
| RW09 | Aug 17–23 | `2026-W34` | Production Planning | Safety stock | ☐ Reorder point | ☐ Service level cost curve | ☐ Ep21 · Demand Planner × Claude · Promotion lift analysis | ☐ Ep22 · S&OP Analyst × Gemini · Leading indicators |
| RW10 | Aug 24–30 | `2026-W35` | Inventory Management | Stock review | ☐ The 4 types of inventory | ☐ Inventory positioning | ☐ Ep23 · Supply Planner × Claude · Safety-stock audit | ☐ Ep24 · Demand Planner × ChatGPT · Revenue at risk |
| RW11 | Aug 31–Sep 6 | `2026-W36` | Inventory Management | Inventory metrics | ☐ Inventory turnover | ☐ Pareto in procurement | ☐ Ep25 · Supply Planner × Claude · Lead-time-doubling model | ☐ Ep26 · Demand Planner × Copilot · SKU segmentation (MTS/MTO) |
| RW12 | Sep 7–13 | `2026-W37` | Inventory Management | SKU management | ☐ SKU rationalisation | ☐ Cash conversion cycle | ☐ Ep27 · Warehouse Mgr × Claude · Slotting/utilisation audit | ☐ Ep28 · Supply Planner × Copilot · Replenishment calendar |

> `/ai-for-sc` takes the **Plan Week** number. RW01 → `PW23` → run `/ai-for-sc W23`. The PW for each row = PW22 + RW number (RW01=PW23, RW02=PW24 … RW12=PW34).

---

## Beyond RW12 — thematic outline to year-end

The content banks run through PW52. Same loop, same mapping (RW## → PW = RW+22). Detailed topics live in the plans.

| Run Wks | Dates | Plan Wks | Theme | Source |
|---|---|---|---|---|
| RW13 | Sep 14–20 | PW35 | Inventory Management (close) | `101-plan.md` · `ai-for-sc-plan-v2.md` |
| RW14–18 | Sep 21–Oct 25 | PW36–40 | **Logistics & Fulfilment** | both plans |
| RW19–22 | Oct 26–Nov 22 | PW41–44 | **Supply Chain Technology** | both plans |
| RW23–26 | Nov 23–Dec 20 | PW45–48 | **Risk / Finance / Career** | both plans |
| RW27–30 | Dec 21–Jan 17 ('27) | PW49–52 | **Toolkit & Year-End** | both plans |

---

## Monthly themes (the spine — one function per month, both series aligned)

| Theme | Plan Weeks | One teaches… (101) | The other shows… (AI for SC) |
|---|---|---|---|
| Procurement | PW21–25 | scorecards, PO flow, RFQ, spend, supplier eval | RFQ drafting, should-cost, contract review, TCO, risk profiling |
| Production Planning | PW26–31 | forecasting, prod plans, MPS, S&OP, capacity, safety stock | demand decomposition, sequencing, FVA, narratives, scenarios |
| Inventory Management | PW32–35 | inventory types, positioning, turnover, SKU rationalisation | safety-stock audits, segmentation, slotting, replenishment |
| Logistics & Fulfilment | PW36–40 | OTIF, 3PL, order mgmt, cross-dock, last mile | exception triage, lane savings, carrier compare, playbooks |
| SC Technology | PW41–44 | ERP, control tower, digital twin, IBP, VMI | ERP gap maps, MRP checks, compliance, dashboards |
| Risk / Finance / Career | PW45–48 | SC finance, landed cost, tariffs, resilience, career | cost-of-problem, working capital, payback, risk registers |
| Toolkit & Year-End | PW49–52 | AI tool selection, adoption, 2027 outlook | prompt libraries, team guides, year-end narratives |

---

## Pointers
- **101 topics** → `references/101-plan.md` (Monthly Theme Model section, keyed by Plan Week)
- **AI for SC use cases** → `references/ai-for-sc-plan-v2.md` (keyed by Plan Week, Episode Index at the bottom)
- **Trackers** → `data/101-series-tracker.md` · `data/ai-for-sc-series-tracker.md`
- **Voice** → `tiger-voice.md` (root) + `references/101-voice.md` + `references/published-voice.md`
- **Render** → `renderer/README.md` (code-render) · HyperFrames skills (`/motion-graphics`) · Higgsfield MCP (AI still)
