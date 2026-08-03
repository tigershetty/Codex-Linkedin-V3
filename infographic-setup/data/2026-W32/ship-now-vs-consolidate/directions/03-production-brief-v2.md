# Direction 03 Production Brief v2 — Customer-Safe Timing Corridor

**Status:** historical precursor / creative hypothesis. Its deterministic HTML route is superseded
by Direction 04's native `visual-v12-time-to-wait-tableau-corrected.png`; retain this file for the
decision logic, not as a current render or publication route.
**Creative family:** half-truth → missing dimension → decision rule
**Primary post job:** saves and relevant follows
**Brand expression:** Shetty's Desk Operating Studio

## Story card

**Primary reader:** Purchasing practitioner or Purchasing Manager who holds a ready PO to test a
combined freight option.
**Exact work moment:** PO A is packed; PO B may be ready tomorrow; the freight quote rewards a
hold; the customer need-by does not move.
**Opening tension:** `HOLD THIS READY SHIPMENT UNTIL TOMORROW?`
**Visible proof:** the uncertain readiness range of PO B reaches beyond the physical last-safe-
departure gate, while the ready PO and truck are already inside the protected departure path.
**Reader path:** cheaper quote → uncertain second PO → last-safe gate → customer consequence →
release rule.
**Saveable keep:** hold only if the *latest credible* B-ready date clears the last safe departure.
**Caption adds:** why the quote gets too much attention, how to treat unclear dates, and who makes
an exception explicit.

## Why this replaces Direction 01

The old route-switch visual restored the right colour and material language, but it did not prove
why waiting was dangerous. This direction makes the governing fact visible: a wait is only safe
inside a finite customer-safe window. It is therefore a new story mechanism, not a cosmetic V3 pass.

## Public claim boundary

This is a proposed professional decision rule, grounded in the approved Tiger source, not a
customer result, cost claim, timing forecast, or universal optimisation formula.

- Customer need-by is considered before freight saving.
- A credible service miss while shipping now protects the date means ship now is the standard choice.
- When the customer date, supplier-ready range, or transit basis is unclear, do not create false
  precision to justify the hold.
- A genuine exception requires KAM and Purchasing Manager escalation; escalation records the risk,
  it does not make it safe.

Source: `TS-20260802-02-A` through `TS-20260802-02-D` in `../tiger-source.md`.

## Exact visual content

| Placement | Exact content |
|---|---|
| Kicker | `SUPPLY CHAIN 101 · INBOUND FREIGHT` |
| Headline | `HOLD THIS READY SHIPMENT UNTIL TOMORROW?` |
| Deck | `A cheaper freight quote is not the same as time to wait.` |
| Hero labels | `PO A / READY NOW`; `PO B / CREDIBLE READY RANGE`; `LAST SAFE / DEPARTURE`; `CUSTOMER / NEED-BY` |
| Hero rule | `WAIT WINDOW` — green only, ending at the last-safe-departure gate |
| Timeline | `READY NOW → B READY RANGE → LAST SAFE DEPARTURE → CUSTOMER NEED-BY` |
| Saveable rule | `Hold only if B's latest credible ready date clears the last safe departure.` |
| Boundary | `If the range crosses the gate: release PO A. No clear date: KAM + Purchasing Manager escalate.` |

## Historical asset route

- Hero scene: `../visual-assets/customer-safe-timing-corridor-v1.png`
- Deterministic source: `renderer/templates/sc101-customer-safe-window-v3.html`
- Draft export: `../visual-v3.png`

No date, cost, supplier, customer, or outcome is invented. The hero uses blue for the operating
system, green only for protected waiting time, and coral only for uncertainty and risk.
