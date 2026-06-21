# AI for SC — Price-Increase Counter-Arguments

**Week**: 2026-W26 · **Plan Week**: PW23 · **Run Week**: RW01
**Theme**: Procurement (Supplier evaluation)
**Role**: Purchaser
**Tool**: Claude
**Episode**: Ep06 (AI for SC series) · Post 4 of RW01
**Visual Format**: Negotiation Table (their argument ↔ your counter)
**Hero Statement**: "Every argument they'll make. Every answer you'll need."
**Status**: Ready — pending publish

---

## Selected Hook
**Type**: Result-First
**Text**: A supplier wants +9%. Before the meeting, have Claude build a should-cost model that shows how much of it actually holds up.

> **Rebuilt 2026-06-21** around the "tool builds a real artifact" direction (the Copilot-in-Excel equivalent): the post now shows **Claude Code building a should-cost model** (`should-cost-model.csv`) — every cost line indexed to a public benchmark, summing to a defensible **+5.6%** against the **+9%** ask (a 3.4% gap to negotiate).

---

## 10 Hook Options

1. **Decision-Pressure** — The supplier meeting is in 48 hours and you have a price increase to push back on. Most purchasers prep that in their head. Claude builds you the full argument map first.
2. **Paradox** — The supplier has spent weeks preparing their price increase. You get a 30-minute slot to respond. Claude evens that out before you sit down.
3. **Question-How** — How do you prep for a price-increase meeting when your notes are an email thread and a half-remembered call? Claude turns that into a structured counter for each of their likely arguments.
4. **Timeline-Shock** — A purchaser preps a tough supplier meeting from memory and a spreadsheet in an hour. Claude maps every argument and counter in fifteen minutes.
5. **Contrarian** — You don't beat a price increase by saying no. You beat it by answering the specific reason behind it, and Claude helps you name the reason first.
6. **Result-First** — Picture a two-column sheet: every argument the supplier will use on the left, your evidence-backed counter on the right. That is the prep. Here is how Claude builds it.
7. **Stat-Lead** — A supplier brings maybe five arguments to justify an increase. Walk in with a counter to all five and the conversation changes. Claude drafts the five before you do.
8. **Question-Why** — Why do purchasers lose the price conversation in the first ten minutes? Because the supplier framed it and they're reacting. Claude lets you pre-empt the frame.
9. **Personal-Reflection** — I've watched good purchasers get talked past on price, not because they were wrong, but because they hadn't rehearsed the specific pushback. Claude is the rehearsal partner.
10. **Comparison-Gap** — Walking in with "we can't accept that" and walking in with a counter for each of their points are two different meetings. The second one starts with Claude.

---

## LinkedIn Caption

A supplier wants +9%. Before the meeting, have Claude build a should-cost model that shows how much of it actually holds up.

We're on procurement this month at Shetty's Desk. The 101 posts covered how to weigh suppliers; this is the moment that tests one: the price conversation, where they've prepped for weeks and you've had a day.

A "+9%" is really a stack of claims, and each one only moves the slice of cost it actually touches. So instead of arguing a position, you build a model.

In Claude Code you don't just talk it through, you build the thing. Point Claude at the quote and the last PO: split the price into material, labour, energy, overhead and margin, tie each line to a public index, and apply new price = base times current over base index, weighted by that line's share. It writes the model, sums it, and lands on what's defensible. In my example that was about +5.6% against a +9% ask, which turns a vague argument into a specific 3.4% gap they have to justify.

How to do it:
• Open Claude Code (or Claude with your files). Give it the quote, the last PO, and the category.
• Paste the prompt below to build the should-cost model and index each line.
• Have it role-play the supplier's sales director so you can rehearse.

Claude because this is structured analysis and document-building, exactly what it's good at. And when NOT to use it: never quote a number it produced without checking the real index yourself, because it can't see the supplier's true cost shares and it will guess the index values.

What you get: a should-cost model you built before the meeting, and a defensible number instead of an opinion.

Try this before your next price review.

Follow Poornajith Shetty and Shetty's Desk for more supply chain insights, and save this for the next increase that lands in your inbox.

#ShettysDesk #SupplyChainIntelligence #SCM #AIforSupplyChain #Procurement

---

## Copy-paste prompt (Claude)

```
I'm a purchaser. A supplier wants +[X]% on [part/category].
Context: [paste the quote / last PO / what you know of their cost base].

1. Build a should-cost model for the part: split price into material, labour,
   energy/freight, overhead, margin, and label every share as an estimate I must verify.
2. Tie each line to a public index and apply new price = base × (current ÷ base
   index), weighted by that line's share — name the index (PPI commodity series,
   LME, EIA diesel, BLS ECI, FX reference rate).
3. Sum to a defensible increase and compare it to their ask; show me the gap.
4. Role-play the supplier's sales director for 3–4 rounds so I can rehearse.
5. Flag every number you guessed and the exact source I must check before I use it.
```

> Built for **Claude Code / Claude with files** — point it at the quote and last PO and it
> writes the should-cost model as a real artifact (e.g. `should-cost-model.csv`), the way
> Copilot builds the scorecard inside Excel. Depth first: the model is only as good as the
> indices you verify.

> **Accuracy note (from research-brief.md):** the indexation formula and the steel-PPI
> example (BLS WPU1017: 303.5 → 326.1 = +7.4%) are real; the 60% material share is
> illustrative, so +4.5% is a worked example of the *method*, not a fixed answer. Claude
> can't see private costs and will guess index values — re-pull every index from BLS / LME /
> EIA before quoting it. The card teaches the method with a real public index, not an
> AI-invented "justified %".

---

## Artifact example (what Claude Code builds)

A real example of the artifact the post describes lives beside this file:
- **`should-cost-model.csv`** — the model itself: 5 cost lines, each with its share, the public index it tracks, the index move, and the resulting contribution to price; summing to a defensible **+5.6%** against the supplier's **+9%** ask (3.4% gap). Shares are illustrative; every index move must be re-pulled from its source before use.
- **`renderer/out/should-cost-model-dashboard.png`** (template `renderer/templates/should-cost-model-dashboard.html`) — the same CSV shown **on a dashboard**: KPI strip (ask / defensible / gap), the cost build-up table, and a stacked build-up bar that fills to +5.6% with the 3.4% gap hatched up to the +9% ask. This is the "tool builds a real artifact, here's the dashboard" view.

## Render Brief (code-render — primary visual)

**Format**: Tool-builds-the-artifact (the Copilot-in-Excel equivalent, for Claude). A **Claude Code session** that builds a **should-cost model**, shown above the artifact it produces. 4:5-ish (1080×1500). Bright Shetty's Desk system (azure + eco-green on white, Poppins).

**Pin header**: badge → title "Don't rehearse the argument. Have Claude build the model." → azure rule. Sub names the surface ("In Claude Code…"). Big clean Claude mark top-right (no caption).

**Hero — the build**: a dark **Claude Code panel** (3-dot title bar, mono body) showing the purchaser's ask (`▸ build a should-cost model … test their +9%`) and Claude's actions (`● Read quote/PO`, `● Write should-cost-model.csv`, `● Indexed steel→PPI, labour→ECI, freight→EIA`) ending on `✓ Defensible ≈ +5.6% · asked +9% · gap 3.4%`. Authentic to Claude Code's actual UX.

**Artifact — the model it built**: a `should-cost-model.csv` table (Cost line · Share · Index it tracks · Move · Δ on price) — Steel 60% PPI +7.4%→+4.4%, Labour 15% ECI +3.5%→+0.5%, Energy/freight 10% EIA +6%→+0.6%, Overhead 8%→+0.1%, Margin 7%→0% — summing to **+5.6% defensible**. A gap note frames the **3.4%** vs the +9% ask as the part to negotiate. Honesty kept: shares labelled illustrative, "verify each index"; steel +7.4% is the verified anchor.

**Footer (house standard, RW01 — unified 2026-06-21)**: gradient footrule above the row; **Shetty's Desk Logo 2** (`assets/logos/shettys-desk-logo-2.png`, dark-wordmark lockup, ~74px, no separate text label) on the left, **"Poornajith Shetty"** signature on the right. All four RW01 posts (101 + AISC) now share Logo 2.

**Icons/logos**: big Claude mark (`assets/logos/claude-color.svg`) top-right, no caption; chart-line glyph on the artifact header; amber alert-triangle on the honesty + gap notes. No row icons (the model table replaced the argument grid).

---

## Rendered Output

Primary: `renderer/templates/ai06-negotiation-table.html` → `renderer/out/ai06-negotiation-table.png` → `visual.png`. **Rebuilt 2026-06-21 (v2)** to the "tool builds a real artifact" direction: a **Claude Code session** building a **should-cost-model.csv** (5 cost lines, each indexed to a public benchmark) → summing to **+5.6% defensible vs +9% asked**, 3.4% gap. Big clean **Claude Code** mark top-right (no caption; updated 2026-06-21 — the post shows Claude *Code* building the artifact), expanded justified copy-paste prompt, Logo 2 footer. (Template filename kept as `ai06-negotiation-table.html` for continuity.)

## GIF (HyperFrames / GSAP anim lane)

**Reader-first motion (rev. 2026-06-21).** Earlier cut ran the session and built the table line by line, which delayed reading and kept the card in motion throughout. New principle: **the session, the should-cost-model.csv table and the prompt are complete and legible in every frame**; exactly ONE focal motion. Here that is the **computed answer**: the **+5.6% defensible** total pulses eco (scale + glow) so the eye lands on the result, while every line of the session and the prompt stays still to read. Seamless ~3.2s loop (yoyo, no hold). Output: `renderer/out/ai06-negotiation-table.gif` (+ `.mp4`).

**Build:** `ai06-negotiation-table-anim.html` reuses the still's build script untouched (full card), then a small paused GSAP timeline pulses only `.atot .big`; render via `render-anim.mjs` (`HOLD_S=0 GIF_W=640`).
