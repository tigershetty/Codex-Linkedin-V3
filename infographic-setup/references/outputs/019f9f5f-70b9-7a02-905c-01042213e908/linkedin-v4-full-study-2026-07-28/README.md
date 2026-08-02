# LinkedIn V4 Stage-0 Full Study

**Run date:** 2026-07-28
**Status:** collection, normalization, validation, and observational screening complete; coverage and reliability limits remain explicit
**Recorded Apify spend:** `$5.066` across 31 Actor executions (30 data-producing; one charged limit-terminated)
**Budget decision:** retain the current corpus; do not buy the €35 tier merely to improve completeness
**Privacy boundary:** no commenter list, reactor list, email search, or private competitor data

## Critical conclusion

The corpus improves V4 topic and experiment selection, but it does not support a universal
LinkedIn-growth formula. The frozen 24-person peer design cannot be filled from the current
candidate pool, 27 Top-100 references remain absent, the recovered Top-100 set is almost entirely
single-image posts, and no mechanic passed the cross-track portable threshold.

The Scout Queue contains 15 `screen_A` combinations, but they are discovery prompts produced by
an automated meaning taxonomy that failed reliability—not validated topics or a leaderboard.
The reliability provenance check also records one codebook-hash mismatch and two missing hashes;
the package makes no exact-final-codebook claim and preserves the coding outputs unchanged.

The missing histories and references could be reduced with more paid extraction, but that would
primarily improve sample completeness—not resolve causality, reliability, or transfer to Tiger's
account. The next euro is better spent only after prospective results show that one of those gaps
blocks a real decision.

## What is defensible now

| Lane | Defensible use | Do not claim |
|---|---|---|
| Tiger | 58 mature public originals; exact joins to all 50 private ranked rows | the private Top-Posts export is a complete failure census |
| Current market | 20-creator radar, 15-creator decision, and 10-creator strict panels | the frozen 24-person balanced design succeeded |
| Top-100 | 73 reference rows / 72 unique cases; 42 baseline-qualified | every reference was recovered or formats are representative |
| Automated features | auditable screening, scouting, and hypothesis nomination | human validity, causality, or a permanent V4 rule |
| Native media | images, galleries, documents, videos, articles, and quote subtypes are preserved | visual structure, GIF/static equivalence, or quote-performance validity |

## Package map

- `00-input-plan.json` — exact executed pre-host-canonicalization inputs and pre-run budget envelope
- `00-input-plan-correction-note.md` — locale-host duplicate disclosure, corrected future-run counts, and builder/source hashes
- `01-raw/` — Actor inputs, run metadata, row projections, canary files, and the blocked recovery-attempt log
- `02-normalized/full-normalized.json` — canonical posts plus separate activity/repost provenance
- `02-normalized/full-validation.md` — fail-closed schema validation
- `02-normalized/creator-eligibility.csv` — confirmed, left-censored, observed-fail, and missing-history states
- `02-normalized/top100-resolution.csv` — all 100 reference rows and recovery status
- `03-blind/` — randomized caption sample, two independent model coding passes, and inter-run consistency output
- `04-analysis/current-market-posts.csv` — radar/decision/strict panel registry
- `04-analysis/track-a-posts.csv` — strict mechanical panel with within-creator outcomes
- `04-analysis/tiger-public-posts.csv` — mature Tiger public census
- `04-analysis/top100-cases.csv` — recovered cases and baseline sufficiency
- `04-analysis/matched-controls.csv` — automated-heuristic (`AH`) matches, not Grade A/B human matches
- `04-analysis/mechanic-effects.csv` and `evidence-matrix.csv` — exploratory effects and cross-track classifications
- `04-analysis/scout-queue.csv` — provisional problem/job/artifact combinations for prospective tests
- `actor-selection-review.md` — point-in-time Actor comparison, retained stack, and no-upgrade decision
- `stage0-completion-report.md` — decision summary, limitations, and V4 changes
- `linkedin-v4-stage0-research-control-final.xlsx` — human-readable control workbook

## Reproduce the normalized analysis

The preserved paid extraction under `01-raw/` is immutable evidence. Re-running that collection
would create new Apify spend and a different point-in-time snapshot; it is not part of this
reproduction path. From the repository root, the following commands rebuild normalization,
validation, analysis, and the reliability report from the preserved raw rows:

```sh
STUDY_DIR="infographic-setup/references/outputs/019f9f5f-70b9-7a02-905c-01042213e908/linkedin-v4-full-study-2026-07-28"

node infographic-setup/scripts/normalize-linkedin-v4-apify.mjs \
  --raw-posts "$STUDY_DIR/01-raw/full/posts" \
  --raw-profiles "$STUDY_DIR/01-raw/full/profiles" \
  --identity-map infographic-setup/references/linkedin-v4-stage0-top100-identity-resolutions.json \
  --manifest "$STUDY_DIR/00-input-plan.json" \
  --output "$STUDY_DIR/02-normalized/full-normalized.json" \
  --as-of 2026-07-28

node infographic-setup/scripts/validate-linkedin-v4-apify.mjs \
  --input "$STUDY_DIR/02-normalized/full-normalized.json" \
  --report "$STUDY_DIR/02-normalized/full-validation.md"

node infographic-setup/scripts/analyze-linkedin-v4-stage0.mjs \
  --normalized "$STUDY_DIR/02-normalized/full-normalized.json" \
  --creator-pool infographic-setup/references/linkedin-v4-stage0-creator-pool.csv \
  --identity-map infographic-setup/references/linkedin-v4-stage0-top100-identity-resolutions.json \
  --output-dir "$STUDY_DIR"

node infographic-setup/scripts/evaluate-linkedin-v4-reliability.mjs \
  --items "$STUDY_DIR/03-blind/coding-items.json" \
  --coder-a "$STUDY_DIR/03-blind/coder-a.json" \
  --coder-b "$STUDY_DIR/03-blind/coder-b.json" \
  --codebook infographic-setup/references/linkedin-v4-stage0-codebook-v1.md \
  --output-dir "$STUDY_DIR/03-blind"
```

`coder-a.json` and `coder-b.json` are preserved independent coding-pass outputs, not regenerated
by the deterministic analysis script. Coder A records the current blind-input hash but an earlier
codebook hash; Coder B embeds neither input nor codebook hashes. The failed consistency result is
reproducible from the preserved files, but the package cannot prove that both passes used the exact
final codebook. The final control workbook has its own committed builder and
must be run only with Codex's loader-provided spreadsheet runtime; its CLI is documented by
`node infographic-setup/scripts/build-linkedin-v4-stage0-workbook.mjs --help`.

The analysis is observational. Public interactions are not impressions, reach, saves, follows,
clicks, downloads, leads, or revenue. Current follower counts are used only for strata and never as
historical engagement denominators.
