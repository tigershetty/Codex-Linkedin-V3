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
**Type**: Question-How
**Text**: How do you run a supplier QBR when the scorecard lives in SAP, a finance export, and a folder of emails? Copilot pulls it into one sheet before you walk in.

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

How do you run a supplier QBR when the scorecard lives in SAP, a finance export, and a folder of emails? Copilot pulls it into one sheet before you walk in.

This month on Shetty's Desk we're on procurement, and the 101 side covered how to score and shortlist suppliers. This is the working version of that for a category manager: the quarterly business review, where the scorecard is supposed to drive the conversation and usually doesn't, because nobody had time to build it.

Here's the thing most people miss. The hard part of a QBR is not the meeting. It is getting every supplier onto the same five columns before the meeting, when the data is scattered across systems that don't talk to each other.

Copilot in Excel is built for exactly this kind of in-file assembly.

How to do it:
• Drop your raw exports into one workbook (one tab per source is fine).
• Prompt Copilot: "Build a supplier scorecard. Rows = suppliers from these tabs. Columns = Quality, On-time delivery, Price competitiveness, Responsiveness, Compliance, each scored 1 to 5. Add a weighting row, calculate a weighted total per supplier, rank them, and colour-code green to red."
• Check the weights against what you actually care about this quarter, and adjust one or two.
• Bring the ranked sheet into the room and let it set the agenda.

And one honest limit. Copilot scores what you feed it, so a tidy scorecard built on stale delivery data is still wrong, just faster. Refresh the inputs before you trust the ranking. Do not use AI to invent scores you don't have data for.

What you walk in with: every supplier ranked on one weighted sheet, ready to decide, not just discuss.

Try this before your next quarterly review.

Follow Poornajith Shetty and Shetty's Desk for more supply chain insights, and save this for the week your QBRs come due.

#ShettysDesk #SupplyChainIntelligence #SCM #AIforSupplyChain #Procurement

---

## Copy-paste prompt (Copilot in Excel)

```
Build a supplier scorecard from the data in these tabs.
- Rows: each supplier (de-duplicate across tabs by name).
- Columns: Quality, On-time delivery, Price competitiveness,
  Responsiveness, Compliance — each scored 1–5.
- Add a weighting row above the table (weights sum to 100%).
- Compute a weighted total (0–5) per supplier and rank them.
- Conditional-format each score cell green (5) to red (1),
  and bold the top-ranked supplier's row.
Return it as a clean table on a new sheet called "QBR Scorecard".
```

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

**Footer**: coral-thread sign-off — thin rule + Shetty's Desk logo + handle (left) + closing thesis in coral (right): "Score it before the meeting, or the meeting scores you."

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
