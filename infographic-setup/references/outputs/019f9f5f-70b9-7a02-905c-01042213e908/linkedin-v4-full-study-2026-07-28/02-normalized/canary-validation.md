# LinkedIn V4 Apify Validation

**Status:** PASS_WITH_WARNINGS
**Errors:** 0
**Warnings:** 1

| Check | Result | Severity | Detail |
|---|---|---|---|
| schema-v2 | PASS | error | schemaVersion=2 |
| raw-provenance | PASS | error | Every raw post file has a SHA-256 checksum. |
| canonical-key-completeness | PASS | error | 0 incomplete keys. |
| unique-canonical-keys | PASS | error | 28 posts; 28 unique keys. |
| activity-provenance | PASS | error | 32 activities checked. |
| outcomes-not-coerced | PASS | error | Missing outcomes remain null; observed outcomes are numeric. |
| outcome-arithmetic | PASS | error | Public interactions equal reactions + comments + reposts. |
| media-preserved | PASS | error | At least one static/multi-image and one video post are preserved. |
| media-not-false-default | PASS | error | Unknown media is represented as unknown/null. |
| repost-wrappers-separated | PASS | error | Repost wrappers are separate from canonical posts. |
| canonical-preference | PASS | error | Duplicate/wrapper groups prefer the canonical activity row. |
| no-silent-conflicts | PASS | error | All conflict flags are explicit. |
| maturity-labelled | PASS | error | Every post has an outcome maturity label. |
| chronological-order | PASS | error | Canonical posts are sorted chronologically. |
| profile-count | PASS | warning | 3 profiles normalized. |
| quote-observability | FAIL | warning | 0/28 quote values observed. |
| top100-attribution-separated | PASS | error | Top-100 attribution is stored separately from posting-author fields. |
