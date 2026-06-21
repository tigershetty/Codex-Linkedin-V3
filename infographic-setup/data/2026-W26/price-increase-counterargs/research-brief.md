# Research Brief — price-increase-counterargs
**Pipeline**: AI for SC · **Week**: 2026-W26 (RW01 / PW23) · **Generated**: 2026-06-21
**Standard**: consultant-grade, verified, reliability-tagged
**Role**: Purchaser · **Tool**: Claude

## 1. Framing
A supplier brings weeks of prep and one number (+X%). Use Claude to build the counter-map
first: for every argument, the evidence-based answer and the one question that tests it —
all anchored to a should-cost build and public indices.

## 2. Verified facts & data
- **Indexation formula** (how to test a claimed increase): **new price = base price × (current index ÷ base index)**; %-increase = (current − base) ÷ base. This is exactly the logic in **BLS's own "PPI Price Adjustment Guide for Contracting Parties."** **[High]** CARD-READY.
- **Steel PPI** (BLS series **WPU1017**, Steel Mill Products): ≈ **303.5 (Apr 2025)** → **326.1 (May 2025)** ⇒ **+7.4%**; steel up ~20%+ YoY entering 2026. FRED/BLS (via search snippets — re-pull before quoting). **[High data / re-verify]** CARD-READY.
- **Public indices a buyer cites**: US PPI by commodity (BLS), **LME** official prices (copper/aluminium), **EIA** diesel / fuel-surcharge, **BLS ECI** (labour, ~3–4% recently), central-bank reference FX rates. **[High/SOLID]**
- **Should-cost / clean-sheet**: bottom-up cost build (material + labour + machine + tooling + packaging + freight + scrap/yield + overhead + fair margin) priced against benchmarks; roots in US DoD "should-cost reviews"; McKinsey "Cleansheet". **[Med/SOLID]**
- **The move both worked examples encode**: an index move applies **only to that cost element, weighted by its share of total cost** — never to the whole price. So +7.4% steel × **60% material share ≈ +4.5%** defensible on price, not +9%. (Index [High]; 60% share [Illustrative].) CARD-READY.

## 3. The "so what"
A +9% ask is not one number — it's a stack of claims. Answer each against the cost line it
actually hits. A published index is harder to argue with than a blanket assertion.

## 4. Visual-data candidates
- Should-cost stacked bar (cost anatomy; margin = the negotiable "give").
- Indexation worked example: 303.5 → 326.1 = +7.4%, ×60% = +4.5% vs +9% ask (compare bars).
- 4-row argument↔counter+test-question grid (material / labour / margin-HARDEST / freight).

## 5. Caption support
- Name the real indices (PPI/WPU1017, LME, EIA, ECI) — concrete and checkable.
- ECI ~3–4% as the reality-check on "labour rose by [double digits]" → soft-attribute.

## 6. Tool + method layer
**What Claude does well here**: structures the should-cost skeleton, generates counters +
test questions, role-plays the supplier for rehearsal, proposes a two-way indexed clause.
**Honest limits → "when NOT to use AI"** [SOLID]:
- Claude **can't see the supplier's private cost structure** — every cost-share % is a guess to validate.
- It **will estimate/guess index values** (training cutoff, no live BLS/LME/EIA feed in-context) and may be wrong — re-check every index against the published source before citing it to a supplier.
- It's a **rehearsal/structuring partner, not a data source**. The buyer owns verification of base/current index values, dates, and cost shares.
**Expanded prompt seed** → should-cost skeleton (labelled estimates) → indexation test naming the index per line → counter + test question, flag the hardest → role-play 3–4 rounds → two-way indexed clause + "get for every give" → mark every guessed number to verify.

## 7. Honesty ledger
- Steel WPU1017 monthly values sourced via search snippets of FRED/BLS (pages blocked direct fetch). **Re-pull exact base/current from fred.stlouisfed.org/series/WPU1017 before publishing.** The +7.4% / +4.5% arithmetic is correct for the inputs shown; the 60% material share is illustrative.
- "+9% ask" is an illustrative scenario number.

## Sources
- BLS: *PPI Price Adjustment Guide for Contracting Parties*, *CPI escalation factsheet*, *ECI*; FRED/BLS *Steel Mill Products PPI (WPU1017)*
- LME official prices; EIA diesel/fuel; ECB/Fed reference FX
- McKinsey *Cleansheet / should-cost*; aPriori / ISM / CIPS should-cost & TCO; KARRASS / CASME negotiation tactics
