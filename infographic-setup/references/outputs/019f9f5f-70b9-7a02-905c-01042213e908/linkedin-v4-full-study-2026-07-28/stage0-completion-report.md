# LinkedIn V4 Stage-0 Completion Report

**Date:** 2026-07-28
**Decision:** move into a prospective V4 audience-learning pilot; do not install an external
creator mechanic as a permanent rule
**Recorded Apify spend:** `$5.066` across 31 Actor executions (30 data-producing; one charged limit-terminated)
**Hard stop:** `$8.25`, inside the user's €10 ceiling
**Budget decision:** do not buy the €35 tier solely to recover censored histories or missing
Top-100 rows

## Executive decision

The research system is now materially better than V3: it can measure Tiger, monitor current
creators at different evidence thresholds, preserve the known-success Top-100 cases, scout topics,
and keep public proof, utility, voice, distribution, and outcomes connected.

The data does **not** say that we have reverse-engineered reach. No mechanic passed the cross-track
portable threshold. The original 24-person balanced peer design is infeasible with the current
pool, the reliability gate for meaning-heavy codes failed, and the recovered Top-100 set is almost
entirely static images. V4 must therefore be an experiment system, not a polished-content recipe.

The final completion retry was attempted after reviewing alternative Apify Actors. The account hard
limit blocked it before run creation. HarvestAPI's profile-post Actor remains the
best fit for this corpus on price, adoption, success rate, media fields, and explicit no-comment /
no-reaction controls; the search Actor is a useful future resolver for missing permalinks. Neither
would change the most important uncertainty: whether a mechanic transfers to Tiger's account. A
€35 tier upgrade is therefore not justified for Stage 0.

The point-in-time comparison and fallback rules are preserved in `actor-selection-review.md`.

## What was completed

| Workstream | Result |
|---|---|
| Apify collection | 81 profile result rows and 2,325 post activities; no people-level comments/reactions or email enrichment |
| Spend control | $5.066 recorded across 31 Actor executions; 30 produced study data, one charged $0.004 limit-terminated profile execution did not; final 16-URL retry was refused before run creation |
| Normalization | 2,173 canonical posts plus 2,325 separately preserved activities; 144 duplicate/wrapper groups |
| Schema validation | PASS with zero errors and zero warnings |
| Tiger | 60 public rows; 58 mature originals; all 50 private ranked rows reconcile deterministically |
| Current market | 30 candidates classified into confirmed, left-censored, observed-fail, and missing-history states |
| Top-100 | 73 reference rows recovered as 72 unique cases; 42 baseline-qualified; every missing reference visible |
| Outcomes | within-creator medians, response ratios, percentiles, winner flags, and automated-heuristic controls |
| Reliability | two isolated 28-post coding passes completed; formal freeze gate failed; provenance check recorded three issues |
| V4 integration | audience-first operating system, evidence gate, Tiger source gate, Substack/website roles, weekly experiment loop, and publish provenance |

## Coverage: what the sample can support

### Tiger

The private export records 50 ranked post URLs, not a complete post census. All 50 join to the
public corpus; eight additional mature public originals have no private row and remain public-only.
The top post accounts for 53.2% of export-period impressions, the top three 78.9%, and the top five
85.4%. That proves outlier dependence, not why the outliers won.

### Current market / peers

| Panel or state | Creators | Posts | Use |
|---|---:|---:|---|
| Radar (`>=10 posts / >=4 weeks`) | 20 | 402 | discovery and monitoring |
| Decision (`>=15 / >=6`) | 15 | 338 | directional screening |
| Strict (`>=20 / >=8`) | 10 | 247 | sensitivity and provisional peer effects |
| Left-censored | 14 | — | unresolved; never label as failed |
| Observed fail | 5 | — | did not meet cadence in observable, uncensored history |
| Missing history | 1 | — | profile resolved; no activities returned |

The frozen quota was 12 near, six growing, and six established creators across three subject
cohorts. Even if every unresolved history later passes, the current pool can fill only 19 of 24
slots. It still needs at least three planning-near, one planning-growing, and one
implementation-near replacement candidates.

### Top-100

- 73/100 reference rows and 72 unique posts are recovered;
- references 1 and 63 remain two provenance rows joined to one canonical post;
- 42 cases have at least ten usable same-author baseline posts and enter the quantitative lane;
- 30 recovered cases remain descriptive-only;
- 27 references are absent: 16 exact URLs are known, ten permalinks remain unresolved, and one
  source row has neither a local image nor a caption;
- 71/72 recovered unique cases are reported single images and one is an article;
- after company-page, missing-asset, and local-GIF conflicts, the clean local static lane is 63 personal cases.

Top-100 can support image-mechanic and caption hypotheses. It cannot establish a native-format
ranking or prove that static images beat documents, galleries, video, text, articles, or quotes.

## What the observational screen found

All findings below use versioned automated observable-feature rules and public interactions, not impressions or reach.
They nominate experiments only.

### Heuristic peer signals

- `H1 evidence/result opening` met the automated peer screen but not the Top-100 heuristic screen;
- `AR3 copyable operating asset` met the automated peer screen but not the Top-100 heuristic screen.

These are one-variable **peer-lane test prompts**, not validated topics or permanent caption rules.

### Heuristic Top-100 signals

Correction and method-promise hooks (`H3`, `H4`), external or worked proof (`P2`, `P3`), reasoned
models (`P6`), and embedded decision/reference artifacts (`AR4`) appeared as automated Top-100
signals without passing the peer screen. Treat them as inspiration, adapt one at a time, and validate
on Tiger.

### Provisional scout combinations

Fifteen combinations met the mechanical `screen_A` rule of at least two posts, two creators, and
two independent evidence layers. Because the meaning taxonomy failed reliability, the following
are investigation prompts rather than validated opportunity labels:

1. AI workflow + understand/execute/prevent a failure + visible or copyable operating asset;
2. procurement/supplier decision + understand/diagnose + formula, matrix, map, or decision reference;
3. inventory/replenishment failure prevention + decision/reference artifact + public formula or data path.

Broad creator-growth, business, and leadership combinations also surfaced, but they fail the V4
audience gate unless translated into a real planning, purchasing, logistics, or transformation job.

## Reliability result

The two model passes agreed on 89.2% of calibration decisions overall, but audience specificity
reached only 75.0% and primary artifact 68.8%; required field agreement was 80% and AC1 0.70.
Calibration therefore failed. Holdout agreement was 89.8% versus the required 90% and is
descriptive only because calibration had already failed. Visual structure was not tested because
the blind input contained captions and native-format summaries, not outcome-blind attachment
captures.

The provenance check found `coder_a_codebook_sha_mismatch`, `coder_b_input_sha_missing`, and
`coder_b_codebook_sha_missing`. Coder A records the current blind-input hash but an earlier codebook
hash; Coder B embeds neither input nor codebook hashes. Those records are preserved as observed and
are not backfilled. The failed consistency result reproduces from the preserved outputs, but this
package cannot claim that both passes used the exact final codebook/input hash.

Consequences:

- do not freeze the meaning-heavy taxonomy;
- do not relabel automated `AH1/AH2/AH3` matches as human Grade A/B/C;
- keep current topic, artifact, and audience labels as screening aids;
- revise audience-specificity and artifact boundaries before a future fresh holdout;
- require both coders to embed matching blind-input and frozen-codebook hashes in that fresh run;
- do not repeat coding merely to force a passing number;
- do not repair missing coding-pass provenance retrospectively; run a fresh, hash-locked round if decision-grade coding is later needed.

## V4 operating map

```text
MEASURE
Tiger mature outcomes by outcome family, not one magic score

SCAN
Tiger + radar/decision/strict panels + Top-100 + public pain + primary sources
+ Substack + timely WorldMonitor discovery

QUALIFY
Named practitioner pain -> public proof -> useful artifact -> Tiger contribution
-> channel job -> one declared experiment

BUILD
Source brief -> Tiger source note -> worked method/artifact -> caption -> visual/motion

DISTRIBUTE
5 useful LinkedIn posts/week + 20-30 minutes manual thoughtful comments
+ fortnightly Substack when depth is earned + website only when utility is earned

LEARN
Day-7 and Day-30 outcomes -> matched Tiger baseline -> repeat, revise, or stop
```

## What changes now

1. The calendar is a candidate bank, not a production queue.
2. Top-100 references are optional packaging intelligence, not mandatory causal evidence.
3. Topic admission starts with a practitioner decision or pain, not a visual format.
4. Every flagship needs a public proof path, artifact decision, and Tiger-approved judgment.
5. Five weekly posts form a portfolio; old 101/AI series do not receive automatic quotas.
6. One interpretable variable is tested at a time.
7. LinkedIn, Substack, and the website have different jobs; no hollow trailers or duplicate copy.
8. Codex automates research, joins, screening, briefs, artifacts, and QA. Tiger owns judgment,
   thoughtful comments, approval, and publishing.

## First pilot decision

Week 1 should investigate the 15 `screen_A` combinations alongside current public pain and
primary-source evidence, then shortlist six candidates. Do not publish the automated queue as “the
top topics.” Score the six,
capture Tiger's source note, select five posts as one portfolio, and test one variable:

> Does making the consequential decision and usable artifact legible in the opening improve Day-7
> qualified reach and saves versus comparable Tiger posts?

Judge the result at Day 7 and Day 30. Require repetition before standardizing a mechanic.

## Deferred gaps—not hidden failures

- do not buy the €35 Apify tier just to improve Stage-0 completeness; recover the 16 known Top-100
  URLs after the account limit resets or only when a later decision explicitly depends on them;
- manually resolve the ten missing Top-100 permalinks without guessing; retain the one unavailable
  source row as unavailable unless new source evidence appears;
- recruit the five missing cohort/size candidates before retrying a balanced peer design;
- archive outcome-blind media captures and run a revised visual-code reliability round;
- gather prospective Substack and website outcomes; Stage 0 contains no historical owned-channel
  performance data.

The completed study is a strong starting instrument. It is not permission to stop learning.
