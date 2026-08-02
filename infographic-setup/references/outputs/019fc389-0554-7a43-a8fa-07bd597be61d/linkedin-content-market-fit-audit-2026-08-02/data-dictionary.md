# Data Dictionary

## Design principles

- `posts.*` stores observed or directly supplied source fields. Empty means unavailable, not zero.
- `inferences.*` stores interpretation. It is deliberately separate and carries method, confidence, and limits.
- `provenance.*` records where every observation came from and what the surface did not expose.
- `engagement-observations.*` stores one metric per row, its denominator when available, and a comparison warning.
- Activity-ID timestamps are computationally inferred and never substituted silently for a visible publication date.
- Deduplication uses LinkedIn activity ID first. Rows without an activity ID use a conservative source-specific key and remain visibly unresolved.

## `posts.csv` and `posts.jsonl`

| Field | Meaning | Evidence status |
|---|---|---|
| `record_id` | Stable database key, normally `LI-<activity_id>` | Constructed identifier |
| `activity_id` | LinkedIn activity identifier when exposed | Observed from URL/source |
| `canonical_url` | Best available post URL | Observed/normalized |
| `author` | Visible or repository-supplied author | Observed |
| `author_profile_url` | Visible or repository-supplied profile URL | Observed |
| `published_at_observed` | Source-supplied publication timestamp | Observed; may be empty |
| `published_at_inferred_from_activity_id` | Timestamp decoded from LinkedIn's snowflake-style activity ID | Inferred; never equivalent to a visible date |
| `relative_age_observed` | Relative age string visible on the saved/post surface | Observed; may drift |
| `source_memberships` | Set of evidence collections containing the record | Observed membership |
| `caption_observed` | Caption text available on the source surface | Observed; truncation is possible on cards |
| `hook_observed` | First-line text supplied by the source or extracted from the observed caption | Observed/derived text |
| `native_format_code` | Stage-0 format code where present | Repository observation |
| `visual_observed` | Limited direct visual/card observation | Observed; detailed structure is usually inferred separately |
| `reactions` | Native reaction count | Observed when exposed |
| `comments` | Native comment count | Observed when exposed |
| `reposts` | Native repost count | Observed when exposed; aggregate component did not reconcile with post pages |
| `impressions` | Native impression count | Observed for Tiger's posts only |
| `saves` | Native save count | Observed for Tiger's posts only |
| `sends` | Native send count | Observed for Tiger's posts only |
| `profile_viewers_from_post` | Profile viewers attributed by the post-analytics page | Observed |
| `followers_gained` | Followers attributed by the post-analytics page | Observed; not net follower growth |
| `social_engagements` | Sum of page-level reactions, comments, reposts, saves, and sends | Derived from observed page fields |
| `public_interactions` | Reactions + comments + reposts on repository/reference surfaces | Derived; not comparable to impressions |
| `creator_follower_count_at_stage0` | Creator follower count captured in Stage 0 | Observed at prior collection time |
| `creator_median_public_interactions` | Stage-0 creator baseline | Derived from prior corpus |
| `response_ratio` | Public interactions divided by creator median | Derived; not an impression rate |
| `reaction_rate` | Reactions / impressions | Normalized only when impressions exist |
| `comment_rate` | Comments / impressions | Same |
| `repost_rate` | Reposts / impressions | Same |
| `save_rate` | Saves / impressions | Same |
| `send_rate` | Sends / impressions | Same |
| `profile_viewer_rate` | Post-attributed profile viewers / impressions | Same |
| `follower_conversion` | Post-attributed follower gains / impressions | Same |
| `hook_code`, `job_code`, `proof_code`, `artifact_code`, `content_class_code`, `problem_family_code`, `cta_code` | Stage-0 codebook fields | Automated classifications; not decision-grade |
| `collection_timestamp` | Timestamp of the relevant observation | Observed system time |
| `missing_fields` | Explicit list of unavailable high-value fields | Constructed completeness record |
| `observation_confidence` | Confidence in the source fields | Curator assessment |
| `provenance_ids` | Links to `provenance.csv` | Constructed relationship |

## `inferences.csv` and `inferences.jsonl`

| Field | Meaning |
|---|---|
| `record_id` | Link to the observation record |
| `target_audience` | Hypothesized primary audience |
| `problem_family` | Hypothesized problem cluster |
| `job_to_be_done` | Hypothesized reader job |
| `topic` | Hypothesized topic label |
| `hook_observed` | Repeated observed hook for reviewer convenience |
| `hook_type` | Packaging/mechanism classification |
| `promise` | Inferred reader outcome or information promise |
| `proof_type` | Inferred proof category, not proof validity |
| `lived_experience_signal` | Whether first-person language is visible; authenticity is not independently verified |
| `emotional_trigger` | Hypothesized emotional mechanism |
| `artifact_type` | Hypothesized utility/artifact type |
| `format` | Inferred native format |
| `visual_structure` | Inferred visual organization; image-preview presence alone does not validate it |
| `cta` | Inferred CTA family |
| `inference_method` | Rule/codebook method used |
| `inference_confidence` | Confidence tier; most large-scale semantic tags are low |
| `evidence_limit` | Claim restriction attached to the row |

The automated fields are a triage layer. Use `manual-review-overrides.csv` for decision-critical records and manually validate any additional record before using its semantic labels in a V4 decision.

## `provenance.csv`

| Field | Meaning |
|---|---|
| `provenance_id` | Stable observation identifier |
| `record_id` | Link to the post record |
| `source_type` | Live native analytics, live curated save, Top-100 library, or current-market corpus |
| `source_reference` | URL or repository record reference |
| `collected_at` | Observation timestamp |
| `access_method` | Browser or repository method |
| `read_only` | Always `true` for this audit |
| `observation_scope` | Fields that surface made visible |
| `limitations` | Missing scope and sampling caveats |
| `confidence` | Confidence in the visible fields |

## `engagement-observations.csv`

| Field | Meaning |
|---|---|
| `engagement_id` | Stable metric-row key |
| `record_id` | Link to the post |
| `metric_name`, `metric_value` | Observed metric and value |
| `denominator_name`, `denominator_value` | Denominator used for normalization, when legitimate |
| `normalized_value` | Metric / denominator; empty if the ratio would be invalid |
| `collection_timestamp` | Time of observation |
| `provenance_ids` | Source observations supporting the number |
| `comparability_note` | Warning about age, surface, or metric-definition mismatches |

## Missing-value and confidence rules

- `null` or blank = not exposed or not reliably recoverable.
- Numeric `0` = a visible zero on the source surface.
- `high` = directly visible native/source field.
- `medium` = deterministic transformation of a high-confidence observation.
- `low-to-medium` = codebook/rule classification requiring manual review.
- `low` = broad heuristic used only for routing research.

