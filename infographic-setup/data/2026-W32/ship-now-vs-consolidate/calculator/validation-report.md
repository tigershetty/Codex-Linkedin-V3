# Calculator Validation Report

**Date:** `2026-08-02`

**Version:** `0.2.0`

**Result:** `PASS — local artifact`

**Publication:** `HOLD`

## Deterministic engine

`node --test calculator/decision-engine.test.mjs` passed `20/20` tests with no package installation.

Verified outcomes:

- green fixture → `CONSOLIDATE`, including the validated freight savings, incremental wait cost, net values, service slack, economic break-even, and robust six-day service limit;
- amber fixture → worst case remains `€168.49` positive but is three days late, so the result is `SHIP NOW` with a joint-exception path;
- red fixture → `DATA STOP` with the three canonical corrective actions and no scenario calculation;
- ETA equal to need-by passes; one minute late fails;
- compatibility fail and compatibility unknown remain distinct;
- missing latest-ready date, unordered ranges, and dispatch before readiness stop the calculation;
- expired quotes and quotes that expire before dispatch stop the calculation;
- zero daily wait cost does not fabricate an economic break-even;
- all-fail, mixed, and exact-threshold economic cases return the declared outcomes;
- one approval never unlocks an exception; both complete approvals record a manual override without changing the `SHIP NOW` service result;
- the option-level worst credible service case is evaluated before economics: only-consolidation-robust returns service-driven `CONSOLIDATE`, while neither-option-robust returns `REPLAN / EXPEDITE` with joint operational escalation;
- elapsed ship-now or consolidation departures are rejected;
- exception approval is valid only between evaluation and the explicit recording time;
- no economic headroom at zero hold returns zero permitted hold rather than a positive service-only allowance;
- every required source/owner field is a hard audit gate;
- negative costs, currency mismatch, and future source timestamps are rejected;
- held time follows actual departure rather than only supplier readiness.

## Browser verification

The real interface was exercised in a Chromium browser through the locally served site.

| Check | Result |
|---|---|
| Desktop `1440 × 1000` | Pass |
| Mobile `390 × 844` | Pass |
| Mobile document width equals viewport | Pass — `390 = 390`, no page-level horizontal overflow |
| Scenario table containment | Pass — table scrolls inside its own region without forcing the page or result banner wider |
| Green, amber, and red buttons | Pass |
| Service columns appear before economic columns | Pass |
| Any core-input change marks the decision stale | Pass |
| Stale result disables print and JSON export | Pass |
| One approval remains incomplete | Pass |
| Two named approvals + time + reason record the exception | Pass |
| Editing a recorded approval immediately disables print/export | Pass |
| Updating the edited record shows rejection without changing `SHIP NOW` | Pass |
| Neither-option-robust case shows joint KAM + Purchasing Manager replan escalation | Pass |
| Exported JSON preserves `SHIP_NOW_SERVICE`, `-3` days, `€168.4931506849315`, both owners, and the human boundary | Pass |
| Synthetic warning on screen and in export | Pass |
| Browser console errors/warnings | Pass — `0 / 0` |

Selected visual evidence:

- [desktop consolidate result](qa/desktop-consolidate-result.png)
- [mobile service-risk result](qa/mobile-service-risk-result.png)

## Boundaries not claimed

- No production PO, supplier, customer, quote, or carrier data was used.
- The tool is not deployed and has no backend or persistence.
- Elapsed 24-hour days are the only implemented date basis; calendar-day and business/transport-calendar rules are not implied.
- Organization defaults for `M`, freshness tolerance, the near-threshold band, and recurring-exception threshold remain intentionally unassigned.
- The screenshots and fixture outputs are synthetic validation evidence, not business results.
