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
**Type**: Decision-Pressure
**Text**: The supplier meeting is in 48 hours and you have a price increase to push back on. Most purchasers prep that in their head. Claude builds you the full argument map first.

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

The supplier meeting is in 48 hours and you have a price increase to push back on. Most purchasers prep that in their head. Claude builds you the full argument map first.

We're on procurement this month at Shetty's Desk. The 101 posts covered how to weigh suppliers; this is the moment that decides whether one stays worth it: the price conversation, where they've prepared for weeks and you've had a day.

Here's the thing most people miss. A "9% increase" isn't one number, it's a stack of claims, and each one hits a different line of the cost. Raw material, labour, freight, margin all need different answers, and most of them only move a fraction of the price.

What Claude does well here is structure, not calculation. It builds a should-cost skeleton (material, labour, energy, overhead, margin), then for each claim it runs the indexation test, new price = base price times current index over base index, applied only to that line's share. If steel rose 7.4% on the public index and steel is 60% of the part, that's roughly 4.5% on price, not 9%.

How to do it:
• Open Claude. Give it the supplier, the category, the increase, and any context (the email, the last contract, what you know of their cost base).
• Paste the prompt below: build the should-cost, index each claim to a named public source (BLS PPI, the LME, EIA diesel, the ECI), and draft a counter plus the one question that tests each argument.
• Have it role-play the supplier's sales director so you can rehearse the pushback.

And the honest limit. Claude can't see their private costs, and it will guess at index numbers, so it's your rehearsal partner, not a source of facts. Pull the real index from BLS or the LME yourself before you quote it. When NOT to use it: never carry a figure from AI into the room unchecked.

What you get: a should-cost-anchored counter-map, ready before they open with their number.

Try this before your next price review.

Follow Poornajith Shetty and Shetty's Desk for more supply chain insights, and save this for the next increase that lands in your inbox.

#ShettysDesk #SupplyChainIntelligence #SCM #AIforSupplyChain #Procurement

---

## Copy-paste prompt (Claude)

```
I'm a purchaser. A supplier wants a [X]% increase on [category], citing
[their reasons]. Context: [paste the email / last contract / cost-base notes].

1. Build a should-cost skeleton — material, labour, energy/freight, overhead,
   margin — and label every share as an estimate I must verify.
2. For each reason, run the indexation test: new price = base × (current index ÷
   base index), applied only to that line's share. Name the public index I should
   cite for each (PPI commodity series, LME, EIA diesel, BLS ECI, FX reference rate).
3. Give a calm, evidence-based counter and the one question that tests each claim.
   Flag which argument is hardest to counter.
4. Then role-play the supplier's sales director for 3–4 rounds so I can rehearse.
5. Suggest a two-way indexed clause (price falls when the index falls), and mark
   every number you guessed so I can check it against the real source.
```

> **Accuracy note (from research-brief.md):** the indexation formula and the steel-PPI
> example (BLS WPU1017: 303.5 → 326.1 = +7.4%) are real; the 60% material share is
> illustrative, so +4.5% is a worked example of the *method*, not a fixed answer. Claude
> can't see private costs and will guess index values — re-pull every index from BLS / LME /
> EIA before quoting it. The card teaches the method with a real public index, not an
> AI-invented "justified %".

---

## Render Brief (code-render — primary visual)

**Format**: Negotiation Table (two-column argument map). 4:5 (1080×1350). Bright Shetty's Desk system (azure + eco-green on white, Poppins).

**Pin header**: badge → UPPERCASE title "THE PRICE-INCREASE PLAYBOOK" → thin azure rule. Sub: "Every argument they'll make, every answer you'll need." Claude mark (clay `#D97757`) sized into the top-right whitespace.

**Hero / reframe**: "+9%" (their ask, coral) → "a stack of claims" — you answer each against the cost line it hits. The honesty rule is kept by **teaching the indexation *method* with a real public index, not an AI-invented "justified %"**: the card shows steel PPI (BLS WPU1017) 303.5 → 326.1 = +7.4%, then ×60% material share ≈ +4.5% defensible vs the +9% ask. The +7.4% index move is verified; the 60% share is labelled illustrative, so +4.5% reads as a worked example of the method, not a fabricated answer.

**Body — the two-column table**: left column "THEIR ARGUMENT" (coral-tinted, 4 rows: raw material costs, labour/wage pressure, margin compression, low volume), right column "YOUR COUNTER + TEST QUESTION" (azure/eco, the calm response + the one test question per row). The single hardest-to-counter row (margin pressure) is flagged with a small amber "hardest to counter" marker. A compact copy-paste Claude prompt block sits above the footer (the visible-prompt AISC moat).

**Footer (house standard, RW01 — unified 2026-06-21)**: gradient footrule above the row; **Shetty's Desk Logo 2** (`assets/logos/shettys-desk-logo-2.png`, dark-wordmark lockup, ~74px, no separate text label) on the left, **"Poornajith Shetty"** signature on the right. All four RW01 posts (101 + AISC) now share Logo 2.

**Icons/logos**: Claude mark (`assets/logos/claude`) top-right; Lucide glyphs per row (package, users, trending-down, layers); amber alert-triangle on the hardest row.

---

## Rendered Output

Primary: `renderer/templates/ai06-negotiation-table.html` → `renderer/out/ai06-negotiation-table.png` → `visual.png`. **Rebuilt 2026-06-21** to the new standard: 4-row argument↔counter+test-question grid, plus two visual models — a **should-cost stacked bar** and an **indexation worked example** (WPU1017 +7.4% × 60% = +4.5% vs +9%). Big clean Claude mark (no "with Claude"), expanded justified copy-paste prompt, Logo 2 footer.
