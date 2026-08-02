# LinkedIn V4 Apify Validation

**Status:** PASS
**Errors:** 0
**Warnings:** 0

| Check | Result | Severity | Detail |
|---|---|---|---|
| schema-v2 | PASS | error | schemaVersion=2 |
| raw-provenance | PASS | error | Every raw post file has a SHA-256 checksum. |
| canonical-key-completeness | PASS | error | 0 incomplete keys. |
| unique-canonical-keys | PASS | error | 2173 posts; 2173 unique keys. |
| activity-provenance | PASS | error | 2325 activities checked. |
| outcomes-not-coerced | PASS | error | Missing outcomes remain null; observed outcomes are numeric. |
| outcome-arithmetic | PASS | error | Public interactions equal reactions + comments + reposts. |
| media-preserved | PASS | error | At least one static/multi-image and one video post are preserved. |
| media-not-false-default | PASS | error | Unknown media is represented as unknown/null. |
| repost-wrappers-separated | PASS | error | Repost wrappers are separate from canonical posts. |
| canonical-preference | PASS | error | When the canonical original row is present, it is preferred over wrappers. |
| wrapper-only-groups | PASS | warning | 7 groups contain wrappers only; retained as unresolved originals. |
| no-silent-conflicts | PASS | error | All conflict flags are explicit. |
| maturity-labelled | PASS | error | Every post has an outcome maturity label. |
| chronological-order | PASS | error | Canonical posts are sorted chronologically. |
| profile-count | PASS | warning | 81 profiles normalized. |
| quote-observability | PASS | error | 2173/2173 quote values explicitly observed. |
| quote-format-separated | PASS | error | Quote delivery is separated from text-only and retains embedded-media subtype. |
| top100-attribution-separated | PASS | error | Top-100 attribution is stored separately from posting-author fields. |
