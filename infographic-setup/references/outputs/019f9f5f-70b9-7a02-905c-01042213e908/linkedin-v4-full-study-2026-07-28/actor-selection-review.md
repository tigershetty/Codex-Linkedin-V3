# Apify Actor Selection Review

**Checked:** 2026-07-28 through the authenticated Apify MCP
**Decision:** retain HarvestAPI profile details + profile posts as the primary stack; retain
HarvestAPI post search as a targeted resolver only
**Boundary:** no comments, reactor identities, engager profiles, or email search

## Decision table

| Actor | Fit for this study | Free-tier price observed | Public Store signal observed | Decision |
|---|---|---:|---|---|
| `harvestapi/linkedin-profile-scraper` | follower strata and public profile identity without email | $0.004/profile | 9,290 monthly users; 99.7% run success; 4.38 rating | primary profile lane |
| `harvestapi/linkedin-profile-posts` | bounded or full profile histories; exact post URLs; media, quote and repost fields | $0.002/post + $0.00005 start | 7,585 monthly users; 26,954 total users; 99.9% run success; 4.17 rating | primary post lane |
| `harvestapi/linkedin-post-search` | query/author-filtered LinkedIn post discovery | $0.002/post + $0.00005 start; optional enrichment costs extra | 4,823 monthly users; 20,520 total users; 99.6% run success; 4.94 rating | future missing-permalink resolver only |
| `apimaestro/linkedin-profile-posts` | comparable profile-post history | $0.005/result | 2,121 monthly users; 98.1% run success; 4.81 rating | rejected: higher cost and smaller evidence base |
| `datadoping/linkedin-posts-search-scraper` | keyword search, not the same profile-history job | $0.00155/post | 245 monthly users; 98.6% run success; free-tier caps reported | rejected as primary; different retrieval job |

Store signals are a point-in-time selection aid, not a guarantee. The paid canary and final schema
validation are stronger evidence for this specific workflow.

## Why the selected stack stays

1. The primary post Actor returned caption, author, timestamp, public interactions, images,
   documents, video, article, quote, and repost information in one schema.
2. It supports exact post URLs and profile histories with the same $0.002 post event, so the
   normalization layer can deduplicate both without maintaining a second schema.
3. Reactions and comments can be disabled explicitly. That protects the agreed privacy and budget
   boundary.
4. The canary exposed wrapper duplication and quote/media ambiguity; those issues were corrected in
   the repository normalizer and the full corpus then passed every schema check.
5. Switching Actors would introduce schema drift without resolving the study's central limits:
   public interactions are not reach, the codebook did not pass, and transfer still requires Tiger
   experiments.

## Incremental-spend decision

A live 16-URL retry was refused before run creation by the account monthly hard limit. Extending all
14 censored peer histories and resolving the remaining Top-100 permalinks could improve coverage,
but would not make the observational findings causal or validate transfer. The user therefore
declined the €35 tier jump for Stage 0.

Reopen paid collection only if a prospective V4 decision depends on one of the missing cases. At
that point:

1. recover the 16 known exact URLs with the primary post Actor;
2. use the post-search Actor for opening-line + author resolution of the ten unresolved permalinks;
3. extend only the specific creator histories needed for a cohort/size decision;
4. keep the same no-comment, no-reaction, no-email boundary;
5. rerun normalization, validation, analysis, reliability impact review, and workbook export.
