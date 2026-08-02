# LinkedIn Content-Market-Fit Audit — 2026-08-02

This is a read-only research snapshot for V4 topic selection and experiment design. No LinkedIn post, profile, relationship, reaction, comment, message, follow state, or publishing state was changed.

## What is here

- `audit-report.md` — evidence-backed findings, opportunity map, and 90-day plan.
- `posts.csv` / `posts.jsonl` — 953 deduplicated post records containing observations only.
- `inferences.csv` / `inferences.jsonl` — one explicitly inferred classification row per post.
- `provenance.csv` — one row per source observation, including access method and limitations.
- `engagement-observations.csv` — long-form metrics with denominators and comparability notes.
- `source-snapshots/` — immutable raw snapshots of the 60 native post-analytics records and 480 saved-post cards collected in the live browser session.
- `summary.json` — reproducible counts, overlaps, performance summary, and curated-pattern distributions.
- `validation-report.json` — uniqueness, referential-integrity, normalization, and parse checks.
- `topic-opportunity-map.csv` — evidence-layered topic hypotheses and disconfirmation gates.
- `90-day-experiment-roadmap.csv` — sequenced experiments, controls, metrics, and decision gates.
- `manual-review-overrides.csv` — manual, high-confidence annotations for the strategically important performance extremes.
- `data-dictionary.md` — field definitions, evidence status, and normalization rules.
- `update-procedure.md` — conservative repeatable refresh procedure.
- `scripts/build-content-market-fit-database.mjs` — dependency-free database builder.

## Evidence discipline

Three layers remain separate throughout:

1. **Observed performance:** Tiger's native LinkedIn post analytics. This is the strongest evidence of what has worked for this account, but still observational rather than causal.
2. **Curated creative references:** saved posts and the existing Top-100 library. The 480 saved records are intentionally curated examples the user found interesting and observed to be high-performing. They are not a random taste sample. They are strong packaging and creative-pattern evidence, but they are not automatic proof of demand from Tiger's target audience.
3. **Market-demand signals:** the Stage-0 current-market corpus and the V4 weekly pain scan. These are directional evidence of recurring audience pains. Automated semantic labels failed the Stage-0 reliability gate and must not be treated as ground truth.

No correlation in this package is described as a causal content mechanic. Unlike metrics are never silently compared: public interactions are not impressions; creator-relative response ratios are not reach rates; and current profile-viewer snapshots are not post-attributed profile views.

## Snapshot scope

- Collection time: `2026-08-02T18:05:05.577Z` for the consolidated build.
- Native published posts: 60 of 60 reasonably accessible posts inspected.
- Saved collection: 480 unique cards after loading until the pagination control disappeared and repeated end-of-list checks produced no new records.
- Saved posts with activity IDs: 463; without an exposed canonical activity URL: 17.
- Saved cards with an image preview: 435; without an image preview: 45.
- Existing Top-100 cases: 72 unique records; 61 activity-ID matches with the current saved census.
- Stage-0 current-market records: 402.
- Deduplicated cross-source database: 953 posts, 1,014 provenance rows.
