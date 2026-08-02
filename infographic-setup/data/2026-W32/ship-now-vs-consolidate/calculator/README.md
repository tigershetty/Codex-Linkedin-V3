# Ship Now vs Consolidate Calculator

**Version:** `0.2.0`

**Status:** locally verified; public website handoff on hold

**Audience:** purchasing practitioners, KAMs, logistics/planning colleagues, and supply-chain managers

## What it does

This is a customer-first decision aid for one narrow inbound release decision:

> Shipment A is ready. A second compatible PO will be ready shortly. Should A ship now, or wait to consolidate with B?

The tool runs four gates in order:

1. data and compatibility;
2. customer need-by across best, base, and worst sensitivity cases;
3. costs that genuinely differ between shipping now and waiting;
4. joint KAM + Purchasing Manager approval for any service-risk exception.

It never releases a shipment, changes ERP/TMS data, averages the scenarios into a false expected value, or converts an exception into a “safe” service result.

## First safe run

From the repository root:

```bash
python3 -m http.server 4173 --bind 127.0.0.1 \
  --directory infographic-setup/data/2026-W32/ship-now-vs-consolidate
```

Open `http://127.0.0.1:4173/calculator/`, then load one of the three synthetic cases. Those values are invented for logic testing and are not business results.

Run the deterministic checks with:

```bash
node --test infographic-setup/data/2026-W32/ship-now-vs-consolidate/calculator/decision-engine.test.mjs
```

No package installation, account, email gate, backend, or production-system access is required.

## Decision outputs

- `DATA STOP` — load-bearing information is missing, stale, uncertain, unreliable, expired, or inconsistent.
- `DO NOT CONSOLIDATE` — compatibility fails; the next non-consolidated response still has to be checked against need-by.
- `SHIP NOW` — ship-now is robust while consolidation is not, or both options are robust and consolidation fails the declared economic threshold.
- `CONSOLIDATE` — consolidation is the only robust service option, or both options are robust and consolidation exceeds the declared minimum net saving.
- `REVIEW` — service is safe but economic cases disagree.
- `REPLAN / EXPEDITE` — neither option protects need-by across every credible case; a joint KAM + Purchasing Manager response is required.

When the service gate fails, a consolidation override stays locked until both named owners approve it with a decision time and reason. The calculated default remains `SHIP NOW` even after a joint exception is recorded.

## Calculation corrections made during implementation

- Held time is `actual consolidation departure - A ready`, not merely `B ready - A ready`. This captures carrier cutoffs or delayed departures after B is available.
- A ship-now timeline is captured so the tool can evaluate the brief's “both options late” branch honestly.
- Each option is judged by its worst credible service slack before economics; the tool cannot recommend an economically cheaper option that is not robust.
- Departures earlier than the evaluation time are rejected as no longer feasible.
- Exception decisions must fall between evaluation and their actual recording time, and edited approval fields disable export until the record is updated.
- The user chooses one wait-cost method. Direct daily differential cost and the annual-rate shortcut are never added together.
- The annual-rate shortcut stays blocked until the user confirms that holding A creates incremental cost versus the ship-now timeline.
- Blank is not converted to zero. Decisions use full precision and round only for display.

## Files

| File | Purpose |
|---|---|
| `index.html` | Accessible single-page decision board |
| `styles.css` | Responsive operating-desk interface and print treatment |
| `app.mjs` | Browser input, result, stale-state, export, and synthetic-case adapter |
| `decision-engine.mjs` | Pure validation, calculation, decision, exception, and recurrence logic |
| `fixtures.mjs` | Adapter from the canonical synthetic fixture into dated calculator inputs |
| `decision-engine.test.mjs` | Fixture and edge-case verification using Node's built-in test runner |
| `MANIFEST.json` | Artifact contract and publication boundary |
| `validation-report.md` | Calculation and browser-verification evidence |
| `qa/` | Selected desktop and mobile result screenshots |

## Inputs that remain organization policy

The calculator exposes these instead of inventing them:

- minimum worthwhile net saving `M`;
- whether a source is current, uncertain, or stale;
- recurring-exception count and threshold;
- the actual best/base/worst dates and freight quotes.

The current MVP uses elapsed 24-hour days. A future calendar-day or business/transport-calendar option requires an explicit operating rule before implementation.

## Publication boundary

This local artifact is complete enough for review and website porting, but it is not published. The V4 source, public wording, caption, still, website preview, and production gates remain separate. A later website port should preserve this engine contract, the no-email access rule, the synthetic warning, and the audit export.
