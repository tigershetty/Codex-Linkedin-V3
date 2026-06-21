# Research Brief — supplier-scorecard-qbr
**Pipeline**: AI for SC · **Week**: 2026-W26 (RW01 / PW23) · **Generated**: 2026-06-21
**Standard**: consultant-grade, verified, reliability-tagged
**Role**: Category Manager · **Tool**: Microsoft 365 Copilot in Excel

## 1. Framing
Score every supplier on the same weighted criteria so a Quarterly Business Review opens
on a decision, not a debate. The hard part isn't the meeting — it's getting every supplier
onto one clean, comparable sheet. Copilot in Excel does the scoring/weighting/ranking/
formatting once you've assembled the table.

## 2. Verified facts & data
- Copilot in Excel can **generate & apply formulas** (incl. `SUMPRODUCT` for weighted totals) and **Explain Formula** step-by-step. Microsoft Support, "Generate formula rows and columns with Copilot in Excel". **[High]**
- Copilot can **apply conditional formatting** — colour scales (red→green heatmaps), top/bottom-N, rules — from prompts. Microsoft Excel Tech Community blog, "Color, Conditions, and Copilot". **[High]** CARD-READY (the heatmap is real).
- Copilot can **create charts/PivotTables, build/transform tables, summarise & surface outliers**. Microsoft Support / M365 Blog (22 Apr 2026). **[High]**
- **Agent Mode in Excel** reached GA on **22 Apr 2026**; **COPILOT() worksheet function** puts an LLM call in a cell (e.g. classify free-text supplier comments). M365 Blog / Excel release notes. **[High]/[Med]**
- **Weighted-scorecard convention** (manufacturing/F&B): Delivery ~40% / Quality ~30% / Cost ~20% / Soft ~10% — or Quality 40 / Delivery 30 / Cost 20 / Resp 10; **category-dependent, set by a cross-functional committee**. ISM / APQC / SRM sources. **[Med]** CARD weights used on the infographic (Q30/OT25/P20/R15/C10) are a valid internally-consistent variant.
- **Carter's 10 Cs** (Ray Carter; 7→10 Cs; CIPS Level 4 canon): Competency, Capacity, Commitment, Consistency, Cost, Cash, Communication, Control, CSR, Culture. CIPS / Mindtools / Toolshero consensus. **[High]** CAPTION-SUPPORT (soft-attribute).

## 3. The "so what"
The cheapest quote is often the costliest supplier. Weight what a QBR actually measures
(quality + delivery), and the price-leader can fall to the middle of the ranking.

## 4. Visual-data candidates
- Scorecard table: 3 suppliers × 5 weighted criteria, 1–5 heatmap cells, weighted total + QoQ delta. (B 4.45 / A 3.80 / C 2.95 — internally consistent with the weights.)
- Radar/spider chart: same 5 axes, one polygon per supplier (the "profile" visual model).
- Rank-flip: price-alone (A›C›B) → weighted (B›A›C).

## 5. Caption support
- Carter's 10 Cs / ISM criteria → soft-attribute ("the classic supplier-evaluation criteria").
- The weighting-is-a-committee-decision point (don't outsource the weights blindly).

## 6. Tool + method layer
**Can do today** [High]: normalise metrics, SUMPRODUCT weighted score, rank, RAG heatmap,
charts, per-supplier summary — all from prompts, on a clean Excel **Table**.
**Honest limits → "when NOT to use AI"** [High unless noted]:
- Needs a **paid M365 Copilot licence** (no free in-grid tier).
- **Does NOT reach SAP/ERP, email, or live web** on its own — editing "only works with the
  currently open workbook." You export the metrics in first.
- Needs **clean, structured data** (Excel Table, single header, no merged cells); quality
  drops on messy files. Microsoft "Format data for Copilot in Excel". [High]
- It's an LLM — can **mis-weight a column or misstate a number**; the human must
  re-derive the top supplier's score and confirm weights sum to 100% before it leaves the room. [Med]
**Expanded prompt seed** → see the on-card prompt + caption (normalise w/ defect inversion →
SUMPRODUCT weights → tiers → rank → RAG heatmap → summary → show working to verify).

## 7. Honesty ledger
- On-card scores (B/A/C) are an illustrative but internally-consistent worked example, not a real client dataset — framed as such.
- Weighting split is one valid convention; real weights are category-specific.

## Sources
- Microsoft Support: *Edit with Copilot in Excel*, *FAQ about Copilot in Excel*, *Format data for Copilot in Excel*, *Generate formula rows and columns with Copilot in Excel*
- Microsoft Excel Tech Community: *Color, Conditions, and Copilot*
- Microsoft 365 Blog (22 Apr 2026): *Copilot agentic capabilities GA*
- CIPS / Mindtools / Toolshero: *Carter's 10 Cs*; ISM & APQC supplier-evaluation criteria
