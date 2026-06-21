# AI for SC — Supplier Scorecard for QBRs

**Week**: 2026-W26 · **Plan Week**: PW23 · **Run Week**: RW01
**Theme**: Procurement (Supplier evaluation)
**Role**: Category Manager
**Tool**: Microsoft Copilot (Excel)
**Episode**: Ep05 (AI for SC series) · Post 3 of RW01
**Visual Format**: Dashboard Preview (supplier scorecard grid)
**Hero Statement**: "One sheet. Five criteria. A QBR that actually decides something."
**Status**: Ready — pending publish
**Render subject**: This post is the 3-way render experiment (HyperFrames GIF · Higgsfield still · GSAP/HTML PNG). See `data/2026-W26/render-experiment/analysis.md`.

---

## Selected Hook
**Type**: Decision-Pressure
**Text**: Your supplier QBR is Thursday, and the numbers are scattered across SAP exports, a finance file, and your inbox. Pull them into one clean table, and Copilot scores, weights and ranks every supplier before you walk in.

---

## 10 Hook Options

1. **Question-How** — How do you run a supplier QBR when the scorecard lives in SAP, a finance export, and a folder of emails? Copilot pulls it into one sheet before you walk in.
2. **Timeline-Shock** — Building the supplier scorecard in Excel for the quarterly review eats most of a category manager's day. Copilot drafts the template in ten minutes.
3. **Decision-Pressure** — The QBR is Thursday and your supplier data is in three systems. You can spend Wednesday copy-pasting, or you can let Copilot assemble the scorecard.
4. **Contrarian** — A supplier review without a scorecard is just a catch-up call. Copilot turns the catch-up into a decision by putting every supplier on the same five columns.
5. **Question-Why** — Why does every QBR start with both sides disagreeing on the numbers? Because nobody built the one scorecard first. Copilot does.
6. **Result-First** — Picture every supplier on one Excel sheet, scored 1 to 5 on the same five criteria, ranked and colour-coded. That is the QBR. Here is how Copilot builds it.
7. **Paradox** — The category manager has the most supplier data in the company and the least time to shape it. Copilot in Excel closes that gap.
8. **Stat-Lead** — Five criteria, weighted, across every supplier you manage. That single sheet is what separates a real QBR from a status update, and Copilot assembles it from your existing exports.
9. **Comparison-Gap** — Last quarter's review was a slide of talking points. This quarter's is a scorecard that ranks them. The difference is twenty minutes with Copilot.
10. **Personal-Reflection** — I've sat in supplier reviews where everyone nodded and nothing changed. The fix was never a better meeting. It was a scorecard built before the meeting.

---

## LinkedIn Caption

Your supplier QBR is Thursday, and the numbers are scattered across SAP exports, a finance file, and your inbox. Pull them into one clean table, and Copilot scores, weights and ranks every supplier before you walk in.

This month on Shetty's Desk we're on procurement, and the 101 side covered how to weigh and shortlist suppliers. This is the working version for a category manager: the quarterly review, where the scorecard is meant to drive the conversation and usually can't, because nobody had time to build it.

What most people get wrong is this. The hard part of a QBR isn't the meeting. It's getting every supplier onto the same columns first, scored the same way, so the ranking is a fact and not an argument.

What Copilot in Excel actually does, and doesn't: it won't reach into SAP or your inbox for you, and it needs a paid Microsoft 365 Copilot licence. You assemble one clean table; then it scores each supplier, builds the weighted total with SUMPRODUCT, ranks them, and colour-codes the sheet in minutes.

How to do it:
• Export your metrics into one Excel table, one row per supplier (on-time-in-full, defect rate, price, responsiveness, compliance).
• Paste the prompt below: normalise each metric, weight them, compute the weighted total, rank, and heatmap green to red.
• Set the weights to what this quarter actually rewards, then re-derive the top supplier's score by hand before you trust the ranking.

Copilot because the scoring, weighting and formatting is exactly the in-file work it's built for. And when NOT to use it: never let it invent a score for data you don't have, because a tidy scorecard built on stale delivery numbers is just wrong, faster.

What you walk in with: every supplier on one weighted sheet, ranked and ready to decide.

Try this before your next QBR.

Follow Poornajith Shetty and Shetty's Desk for more supply chain insights, and save this for the week your reviews come due.

#ShettysDesk #SupplyChainIntelligence #SCM #AIforSupplyChain #Procurement

---

## Copy-paste prompt (Copilot in Excel)

```
First make sure the data is one clean Excel table — one row per supplier,
one header row, no merged cells. Then, from that table:
1. Normalise each metric to 0–100 where higher is better — and invert
   defect/PPM so fewer defects score higher. State the formula you use.
2. Compute a weighted composite with SUMPRODUCT: Quality 30%, On-time 25%,
   Price 20%, Responsiveness 15%, Compliance 10% (confirm they sum to 100%).
3. Add a Tier column: ≥85 Preferred, 70–84 Approved, <70 At-risk. Rank highest first.
4. Apply a red-to-green colour scale to every criterion column and the composite.
5. Summarise each supplier's top strength, top risk, and one QBR action.
6. Show your working and recompute the top supplier's score so I can verify the math.
```

> **Accuracy note (from research-brief.md):** Copilot in Excel edits **only the open
> workbook** — it can't pull from SAP/ERP, email, or the web, and needs a paid M365
> Copilot licence. The human assembles the clean table; Copilot scores/weights/ranks/
> formats/summarises. It can mis-weight or misstate a number, so the human re-derives the
> top score by hand. Sourced to Microsoft's own Copilot-in-Excel docs.

---

## Render Brief (code-render — primary visual)

**Format**: Dashboard Preview / scorecard grid. 4:5 (1080×1350). Bright Shetty's Desk system (azure + eco-green on white, Poppins).

**Pin header**: number/topic badge → UPPERCASE title "SUPPLIER SCORECARD" → thin azure rule fading right. Sub: "The one sheet that turns a QBR into a decision." Featured tool mark (Microsoft Copilot) sized into the top-right whitespace (Law 11), as a capability signal, not a "Powered by" line.

**Hero**: mixed-weight stat callout — large 800 number "5" beside small 300 uppercase "CRITERIA, ONE WEIGHTED SHEET".

**Body — the scorecard table**:
- Columns: Supplier | Quality | On-time | Price | Responsive | Compliance | **Weighted total** (right, emphasised).
- Rows: 3 suppliers (Supplier A / B / C) with realistic 1–5 scores shown as filled chips or dot-fills; the weighting row sits above the score columns.
- The **winning supplier** row (highest weighted total) is highlighted with the eco-green→azure signature gradient on its total cell; the weakest total is a soft coral chip. Blue = structure/headers; green = the win; coral (sparingly) = the laggard.
- Tool colour rule: content stays in Shetty's palette; the **Copilot logo** appears only as its own four-point gradient mark.

**Footer (house standard, RW01 — unified 2026-06-21)**: gradient footrule above the row; **Shetty's Desk Logo 2** (`assets/logos/shettys-desk-logo-2.png`, dark-wordmark lockup, ~74px, no separate text label) on the left, **"Poornajith Shetty"** signature on the right. All four RW01 posts (101 + AISC) now share Logo 2.

**Icons/logos**: Microsoft Copilot mark (`assets/logos/` lobehub) top-right; Excel mark (`../Icons and Logos/Microsoft_Excel_2013-2019_logo.svg`) small, near the "in Excel" cue; Lucide glyphs for column headers (check-circle, truck, tag, message-circle, shield).

**Animation variant (HyperFrames / GSAP anim)**: rows fade+slide in one at a time top to bottom; each score chip counts/fills; the weighted-total bars grow left-to-right; on the final beat the winning row's total cell lights up in the eco gradient and a subtle "ranked" tick appears. Seamless, ~5–6s, loopable.

---

## Rendered Output

| Lane | Tool | File |
|---|---|---|
| Code-render (still) | GSAP/HTML → Playwright/Chrome | `renderer/out/ai05-supplier-scorecard.png` |
| Code-render (motion) | HyperFrames paradigm (GSAP anim → ffmpeg) | `renderer/out/ai05-supplier-scorecard.gif` / `.mp4` |
| AI still | Higgsfield (Recraft 4.1) | `data/2026-W26/render-experiment/higgsfield-ai05.png` |

Comparative analysis: `data/2026-W26/render-experiment/analysis.md`.

**Flagship still (current direction, rebuilt 2026-06-21):** `renderer/templates/ai05-supplier-scorecard-3d.html` → `out/ai05-supplier-scorecard-3d.png` → `visual.png`. Hero = a Copilot-in-Excel **weighted scorecard table** (3 suppliers × 5 heatmap criteria + weighted total/QoQ), plus a second visual model — a **supplier radar chart** beside the price-alone→weighted **rank-flip**. Big clean Copilot mark top-right (no caption text), expanded justified copy-paste prompt, Logo 2 footer.

---

## GIF Storyboard (HyperFrames / GSAP anim lane)

**Reader-first motion (rev. 2026-06-21).** Earlier cut built every element in sequence, which left the card half-formed for most of the loop and gave a scroller nowhere to read. New principle: **the whole scorecard (table, radar, rank-flip, verdict, prompt) is complete and legible in every frame**; exactly ONE focal motion draws the eye to the insight. Here the hero DATA reveals once to catch the eye — the weighted bars fill, the totals count up to 4.45 / 3.80 / 2.95, the crown drops on B — then a calm glow holds on the winner. The dense score grid, radar, rank-flip and all text are present and static from frame 0. ~4.6s loop. Output: `renderer/out/ai05-supplier-scorecard-3d.gif` (+ `.mp4`).

**Build:** `ai05-supplier-scorecard-3d-anim.html` reuses the still's build script untouched (full card), then a small paused GSAP timeline (`window.__tl/__dur/__ready`) pulses only `.totcell.win .big` + `.crown`; render via `render-anim.mjs` (`HOLD_S=0 GIF_W=640`).
