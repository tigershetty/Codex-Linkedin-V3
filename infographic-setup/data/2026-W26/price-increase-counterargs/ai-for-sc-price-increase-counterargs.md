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

We're on procurement this month at Shetty's Desk. The 101 posts covered how to weigh suppliers; this is the moment that decides whether that supplier stays worth it: the price-increase conversation, where the supplier has prepared for weeks and you've had a day.

Here's the thing most people miss. You don't win that meeting by refusing the increase. You win it by answering the specific reason underneath it, because "raw material costs went up" and "our margin is under pressure" need completely different responses.

Claude is strong here because this is structured reasoning, not calculation: anticipate positions, organise them, draft a measured counter for each.

How to do it:
• Open Claude. Give it the supplier, the category, the size of the increase, and any context you have (the email, the last contract, what you know about their cost base).
• Prompt: "A supplier is asking for a 9% increase on [category]. List the most likely arguments they'll use to justify it. For each one, give me a calm, evidence-based counter-argument and the one question I should ask to test it."
• Pressure-test the output against your own knowledge, cut anything that doesn't fit, and keep the two or three counters that land hardest.
• Walk in with the map, not a script.

And the honest limit. Claude models likely arguments from patterns, it does not know this supplier's private cost data. Treat it as your rehearsal partner, not a source of facts you haven't verified. Do not quote a number to a supplier that you got from AI and didn't check.

What you get: a two-column argument-and-counter map, ready before they open with their number.

Try this before your next price review.

Follow Poornajith Shetty and Shetty's Desk for more supply chain insights, and save this for the next increase that lands in your inbox.

#ShettysDesk #SupplyChainIntelligence #SCM #AIforSupplyChain #Procurement

---

## Copy-paste prompt (Claude)

```
I'm a purchaser preparing for a supplier negotiation.
Supplier: [name]. Category: [category]. They're requesting a [X]% increase.
Context: [paste the email / last contract terms / what you know of their cost base].

1. List the 5 most likely arguments they'll use to justify the increase.
2. For each argument, give me:
   - a calm, evidence-based counter-argument,
   - the single best question I can ask to test whether the argument holds.
3. Flag which of their arguments is hardest to counter, and why.
Keep it to a two-column table: "Their argument" | "My counter + test question".
```

---

## Render Brief (code-render — primary visual)

**Format**: Negotiation Table (two-column argument map). 4:5 (1080×1350). Bright Shetty's Desk system (azure + eco-green on white, Poppins).

**Pin header**: badge → UPPERCASE title "THE PRICE-INCREASE PLAYBOOK" → thin azure rule. Sub: "Every argument they'll make, every answer you'll need." Claude mark (clay `#D97757`) sized into the top-right whitespace.

**Hero**: "9%" (their ask, coral) → an eco-green reframe: *you don't beat an increase by refusing it — you answer the reason underneath it.* **No invented "justified %"** on the canvas: Claude does not know the supplier's private cost data, so putting a fabricated figure there would contradict the post's own honesty rule (and the "every number is real" standard). The reframe carries the point without a made-up number.

**Body — the two-column table**: left column "THEIR ARGUMENT" (coral-tinted, 4 rows: raw material costs, labour/wage pressure, margin compression, low volume), right column "YOUR COUNTER + TEST QUESTION" (azure/eco, the calm response + the one test question per row). The single hardest-to-counter row (margin pressure) is flagged with a small amber "hardest to counter" marker. A compact copy-paste Claude prompt block sits above the footer (the visible-prompt AISC moat).

**Footer (house standard, RW01)**: gradient footrule above the row (never a divider over the logo); Shetty's Desk logo (≈55px) + wordmark on the left, **"Poornajith Shetty"** signature on the right. Consistent across all four RW01 posts.

**Icons/logos**: Claude mark (`assets/logos/claude`) top-right; Lucide glyphs per row (package, users, trending-down, layers); amber alert-triangle on the hardest row.

---

## Rendered Output

Primary: `renderer/templates/ai06-negotiation-table.html` → `renderer/out/ai06-negotiation-table.png` → `visual.png`. **Rendered (2026-06-21)** to the new visual standard (honest hero, in-image prompt, house signature footer). Ep05 is the post carried through the full 3-way render experiment this week.
