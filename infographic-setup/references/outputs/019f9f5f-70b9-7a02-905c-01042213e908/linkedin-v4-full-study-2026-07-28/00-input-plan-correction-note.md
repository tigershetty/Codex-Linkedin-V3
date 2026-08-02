# Input-Plan Canonicalization Note

**Date:** 2026-07-28
**Applies to:** `00-input-plan.json`
**Decision:** preserve the executed plan unchanged as run provenance; use the current builder for any future run

## What changed

The executed plan was generated before LinkedIn locale hosts were canonicalized to
`www.linkedin.com`. It therefore retained two duplicate profile identities:

- `uk.linkedin.com/in/ericpartaker` and `www.linkedin.com/in/ericpartaker`;
- `fr.linkedin.com/in/yonathan-levy` and `www.linkedin.com/in/yonathan-levy`.

The executed plan records 55 Track-B profile URLs, 83 external profile URLs, and 81 personal
profile URLs including Tiger. After host canonicalization, the same source files produce 53, 81,
and 79 respectively. This is planning overhead, not 12.5% versus 10% content duplication.
Normalization canonicalized profile and post URLs before analysis, so the locale aliases were not
treated as distinct creators in outcome comparisons.

## Version binding

- Identity-map SHA-256: `a76e2d4850a46d1307a8ecbe2b395bb11be0cf9c5ba33819bfaf7bfef836be22`
- Creator-pool SHA-256: `3623cc77039234cc52175fc339c679c3f1216d397e796d07145c0dc1393704a5`
- Current builder SHA-256: `9e6fcaa7663cfb92715c06f1ed4787186548d723b8862b9285ddb78cd58ac222`
- Current corrected counts: 30 Track-A candidates, 53 Track-B profiles, 88 exact posts,
  81 external profiles, 79 personal profiles including Tiger, and three company pages.

Do not overwrite `00-input-plan.json`: it is the exact input contract used for the paid study.
Generate a new dated plan for any future extraction.
