# Resource Plan - Demand Sensing SKU Routing

**Week:** `2026-W31`
**Slug:** `demand-sensing-sku-routing`
**Series:** `AI for Supply Chain`

## Eligibility

| Test | Yes / No | Evidence |
|---|---|---|
| Reusable method, skill, workflow, or decision policy | Yes | Demand Sensing Router skill and three-lane cadence policy |
| Safe synthetic input pack | Yes | Sample demand history and routing-context CSVs |
| Deterministic script, schema, checklist, or validator | Yes | ADI/CV2 profiler, routing validator, data contract, and checklist |
| Three or more reviewable outputs | Yes | Routing board, route-change log, exceptions, review brief, and run manifest |
| Useful first run without production access | Yes | `python3 START.py` runs entirely on synthetic data |
| Explicit failure modes and human decision boundary | Yes | Unsupported routes fail validation; planner approves policy and system changes |

**Score:** `6/6`
**Decision:** `resource required`

## Package Contract

**Name:** Shetty's Desk Demand Sensing Router
**Version:** `1.2.0`
**First safe run:** `python3 START.py`
**Inputs:** demand history + dated routing context
**Expected outputs:** routing board + change log + exceptions + review brief + manifest
**Validation:** deterministic profile fixture, routing validator, and SHA-256 checksums
**Human decision boundary:** planner approves forecast method, cadence, master data, and every system-of-record change
**Direct download:** `yes - no email/account gate`
**Field guide:** `4 pages, official Shetty's Desk logo and identity palette`
**Website status:** `built on follow-up branch; hold publication until caption approval and preview verification`
