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

**Footer (house standard, RW01)**: gradient footrule above the row (never a divider over the logo — fixes the old `.foot::before` overlap); Shetty's Desk logo (≈55px) + wordmark on the left, **"Poornajith Shetty"** signature on the right. Consistent across all four RW01 posts.

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

**Flagship still (current direction):** `renderer/templates/ai05-supplier-scorecard-3d.html` → `out/ai05-supplier-scorecard-3d.png` — 3D extruded ranked slabs, dark stat-band + score legend, big Copilot mark, no RW01/series labels in-image.

---

## GIF Storyboard (HyperFrames / GSAP anim lane)

**Motion spine:** ranked slabs — *build the field, then the rank resolves* (winner B rises + crown lands). 6.5s, hold 1.5s, loop. Built from the 3D still's own elements (no new content).

| t (s) | Element | Motion | Ease | Note |
|---|---|---|---|---|
| 0.0–0.6 | Title + Copilot mark | title fade/slide up; Copilot mark pops in (scale 0→1, slight spin) | back.out | mark is the hero corner |
| 0.5–1.1 | Stat-band | slides down; KPIs **count up** (3 · 5 · B · 1.50) | power2 | numbers feel computed |
| 1.0–1.3 | Score legend | chips 1→5 pop left-to-right | back.out | sets the 1–5 scale |
| 1.3–1.6 | THE SHIFT line | "price alone → A" flashes **coral**, then "weight what matters → B" resolves **eco** | power1 | the argument |
| 1.6–3.0 | 3 slabs | extrude up in order A → C → B; per-slab criteria chips pop (stagger); scores **count up** to 3.80 / 2.95 / 4.45; bars fill; deltas fade | back.out / power2 | depth kept |
| 3.0–3.6 | Rank resolve (climax) | B slab lifts to top with eco glow; **crown drops in**; A & C settle | back.out(2) | the payoff |
| 3.6–4.1 | Worked verdict | fades in; "4.45" pulses eco once | power1 | lands the thesis |
| 4.1–4.6 | Prompt + footer | fade up | power1 | utility + brand |
| 4.6–6.5 | Hold | full infographic held for the loop rest | — | clean loop |

**Build:** copy `ai05-supplier-scorecard-3d.html` → `ai05-supplier-scorecard-3d-anim.html`; add a paused GSAP master timeline (`window.__tl/__dur/__ready`) implementing the beats; render via `render-anim.mjs` (`HOLD_S=1.5 GIF_W=640`). Icons animate from the in-repo Lucide/lobehub SVGs (GSAP), not React.
