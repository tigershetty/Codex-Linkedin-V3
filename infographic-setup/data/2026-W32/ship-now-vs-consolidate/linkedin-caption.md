# LinkedIn Caption — C3 Canonical Selection

**Week:** `2026-W32`
**Slug:** `ship-now-vs-consolidate`
**Hook:** `H1`
**Status:** selected draft; Tiger approval and publication pending
**Selected source:** `linkedin-caption-v10-temporal-consolidation.md`

## Recommended Caption

A lower combined rate can be worth waiting for, but only if the customer date is not being used as the buffer.

Take the simple version in the visual: A is ready now. B may be able to join the same departure, but its readiness is a range. Holding A creates a fuller load if B arrives early enough; it also spends the last departure that still protects the customer if B does not.

Freight research calls that trade-off temporal consolidation. A fuller shipment can reduce transport cost, while holding the first available order can add inventory or other holding cost. That is useful context, but it still leaves the operational question: where is the last departure that the customer date cannot afford to lose?

That is where I would start. Work backwards from the need-by date and test the latest credible edge of B’s range. If it crosses the departure while A can still protect the date, release A before the saving is compared.

If neither route protects the date, the issue has moved beyond a freight calculation. The KAM and Purchasing Manager need to own the exception together. And if the same exception keeps returning, the process needs repair rather than another workaround—promise reliability, customer-date clarity, or the freight setup underneath it.

Where does your process draw the last departure it cannot afford to lose?

## Publish Disclosure

Use this line only after Tiger's final visual and caption approval makes it accurate:

> Visual produced with AI assistance. The decision method and final wording were reviewed before publication.

## Source And Claim Map

| Passage | Support | Treatment |
|---|---|---|
| Temporal consolidation is a cost-and-waiting trade-off | Bookbinder & Higginson (2002); Wei, Çetinkaya & Cline (2023) | research context only; no individual optimisation result is claimed |
| Customer need-by is tested before freight economics | `TS-20260802-02-A`; `CL-C3-02` | Tiger professional judgment and proposed decision order |
| Latest credible supplier-ready date crossing the safe departure changes the release decision | `TS-20260802-02-B`; `CL-C3-05` | Tiger operating recommendation, framed as a proposed rule |
| KAM + Purchasing Manager jointly own a genuine exception | `TS-20260802-02-C`; `CL-C3-05` | Tiger governance recommendation; approval does not make the risk safe |
| Repeated exceptions require system correction | `TS-20260802-02-D`; `CL-C3-06` | Tiger interpretation; no universal recurrence threshold claimed |
| Current compatible inputs are required before comparing options | `CL-C3-01`; `research-brief.md` sections 3, 5, and 6 | Scope and false-precision boundary |

## Voice And Publication QA

- [x] Uses Tiger's approved professional judgment without inventing an anecdote, result, customer, team practice, or deployment.
- [x] Uses a framework blind spot rather than a reported live incident.
- [x] Adds the method boundary and governance that the image does not need to repeat.
- [x] Gives the core decision rule on LinkedIn without requiring a comment, email, or click.
- [x] Avoids emojis, hashtags, manufactured numerical proof, and generic AI fragments.
- [ ] Tiger approves the exact final caption.
- [ ] Tiger approves the exact final visual.
- [ ] Publication is separately authorised.
