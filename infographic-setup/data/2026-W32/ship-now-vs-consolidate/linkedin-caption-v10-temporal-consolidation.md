# LinkedIn Caption — C3 V10 Temporal Consolidation

**Status:** selected draft; Tiger’s final wording approval and publication remain pending.

A lower combined rate can be worth waiting for, but only if the customer date is not being used as the buffer.

Take the simple version in the visual: A is ready now. B may be able to join the same departure, but its readiness is a range. Holding A creates a fuller load if B arrives early enough; it also spends the last departure that still protects the customer if B does not.

Freight research calls that trade-off temporal consolidation. A fuller shipment can reduce transport cost, while holding the first available order can add inventory or other holding cost. That is useful context, but it still leaves the operational question: where is the last departure that the customer date cannot afford to lose?

That is where I would start. Work backwards from the need-by date and test the latest credible edge of B’s range. If it crosses the departure while A can still protect the date, release A before the saving is compared.

If neither route protects the date, the issue has moved beyond a freight calculation. The KAM and Purchasing Manager need to own the exception together. And if the same exception keeps returning, the process needs repair rather than another workaround—promise reliability, customer-date clarity, or the freight setup underneath it.

Where does your process draw the last departure it cannot afford to lose?

---

## Research context for a source note or pinned comment

Research context, not a claimed result: freight-consolidation research shows why waiting for a fuller load is a genuine cost-and-waiting trade-off. It does not establish a customer need-by rule, predict an individual shipment, or validate this decision aid. The customer-first gate and KAM + Purchasing Manager escalation are a proposed operating rule.

- [Bookbinder & Higginson (2002)](https://doi.org/10.1016/S1366-5545(02)00014-5) models temporal consolidation, including the maximum hold of early orders and inventory-carrying consequences.
- [Wei, Çetinkaya & Cline (2023)](https://doi.org/10.1016/j.tre.2023.103135) compares time-, quantity-, and hybrid-consolidation policies under stated model assumptions.

## Source and claim map

| Passage | Support | Treatment |
|---|---|---|
| Temporal consolidation is a cost-and-waiting trade-off | Bookbinder & Higginson (2002); Wei, Çetinkaya & Cline (2023) | research context only; no claim of an individual optimisation result |
| Start from customer need-by; release A when B’s latest credible edge crosses the safe departure | `TS-20260802-02-A`, `TS-20260802-02-B` | Tiger professional judgment / proposed operating rule |
| KAM + Purchasing Manager jointly own a genuine exception | `TS-20260802-02-C` | Tiger governance recommendation; ownership does not make service risk safe |
| Repeated exceptions require system correction | `TS-20260802-02-D` | Tiger interpretation; no universal recurrence threshold claimed |

## Publication QA

- [x] The counterfactual duplicate A in the visual is explained in the first paragraph.
- [x] No personal anecdote, customer result, saving, supplier performance, probability, or deployment is claimed.
- [x] The research supports the trade-off, not Tiger’s operating rule or the calculator.
- [x] The caption adds reasoning and ownership rather than reading every visual label aloud.
- [ ] Tiger approves the exact wording.
- [ ] Tiger approves the final visual.
- [ ] Publication is separately authorised.
