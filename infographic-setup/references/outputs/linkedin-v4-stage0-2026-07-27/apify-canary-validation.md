# LinkedIn V4 Stage 0 — Apify Canary Validation

**Run date:** 2026-07-28
**Decision:** **NO-GO for the full extraction as currently designed.** The profile Actor passed. The post Actor is usable for a text-and-public-response lane only after deterministic deduplication, but it failed the visual-format and duplicate-rate gates required for the V4 study.

## Executed scope and actual spend

| Actor | Run ID | Dataset ID | Inputs | Output | Actual cost |
|---|---|---|---:|---:|---:|
| `harvestapi/linkedin-profile-scraper` | `uSHJzvq9IHZTfrhNS` | `NA7hICSgGpoqlxjYI` | 3 profiles | 3 profiles | $0.01200 |
| `harvestapi/linkedin-profile-posts` | `zvZJchtRjqs9KCqcd` | `DhyZXerVrsMAjTgU0` | 3 profile histories + 2 exact posts | 32 raw rows | $0.06405 |
| **Total** |  |  |  | **35 rows** | **$0.07605** |

No email search, person-level reaction scraping, or comment scraping was enabled.

## What passed

- Identity resolution: 3/3 profiles matched the intended people.
- Target coverage: 5/5 post targets returned data; both exact-reference posts resolved.
- Core post fields: all 28 canonical posts retained an author, caption, canonical LinkedIn URL/activity ID, timestamp, and numeric likes/comments/shares.
- Attribution: the Angus Craig post remained authored by Angus while its caption explicitly credited Asmaa Gad and her map. Posting author and credited creator must remain separate fields.
- Cost: realized billing matched the quoted model exactly.

## What failed the written canary gate

1. **Duplicate overhead exceeded the threshold.** The post Actor returned 32 paid rows but only 28 canonical LinkedIn URLs. Four logical Asmaa Gad posts appeared twice under different Actor IDs and timestamps, producing 12.5% extra duplicate rows. The written proceed threshold is below 10%.
2. **Visual attachment coverage failed.** After canonical deduplication, the output exposed zero static-image/document attachments and only two video URLs. The sample cannot reliably distinguish text, image, carousel/PDF, or GIF posts. Known reference posts have local visual assets, so a zero-media result cannot be treated as text-only evidence.
3. **Repost/quote coverage was not verified.** No canonical row carried a usable repost flag, and every row used the generic type `post`.
4. **Returned order was not reliably chronological.** Timestamps are usable and can be sorted after extraction, but the raw row order cannot be accepted as the sampling order.
5. **The canary did not test full-window coverage.** The ten-row histories reached only 2026-05-05 for Stuart, 2026-07-24 for Asmaa after deduplication, and 2026-07-20 for Charlie. Sixteen of 28 canonical posts were under seven days old at capture, so their public-response totals were still immature.

## Directional signals only

These are pilot hypotheses, not platform-wide conclusions:

- 18/28 canonical posts mention an operating artifact or device such as a framework, system, guide, map, scorecard, toolkit, template, or workflow.
- 25/28 contain numbers; 10/28 use an explicit numbered list or sequence; 24/28 contain a question.
- Charlie Hills' two strongest catalog posts in the sample — “22 skills” and “17 plugins” — produced 3,890 combined public interactions and 364 shares. The transferable mechanic is compressed, categorized, installable utility, not the large account or stacked CTA by itself.
- Asmaa Gad's human post led her six unique posts on comments, while her role-specific Copilot/procurement post led her utility posts on shares. This supports testing a practitioner situation plus a practical tool instead of choosing “personal” or “useful” as mutually exclusive lanes.
- Angus Craig turned another creator's 65-platform map into a three-layer decision model. Eric Partaker combined a sourced pain statistic, authority, seven named frameworks, and brief operating guidance. Both support an attribution-plus-synthesis lane using public evidence.

Public interactions are not impressions, saves, clicks, or non-follower reach. Current creator sizes span 985 to 245,977 followers, so raw cross-creator totals are not comparable performance rates.

## Corrected pilot architecture — not yet authorized

1. **Profile lane:** retain `harvestapi/linkedin-profile-scraper`; it passed identity and follower-field checks.
2. **Text/public-response lane:** retain `harvestapi/linkedin-profile-posts` only with immutable raw rows plus a canonical table deduplicated on LinkedIn activity ID/URL. Preserve alternate Actor IDs and timestamps for auditability.
3. **Visual lane:** code the Top-100 against the 97 local assets already available. Do not infer format from the primary post Actor.
4. **Media cross-check:** test `apimaestro/linkedin-profile-posts` on the same three creators because its current schema explicitly exposes images, video, document/article media, post type, reaction breakdowns, and repost counts. Current Store price is $0.005 per result; a 10-post, three-profile correction canary would cost at most **$0.15**. No run is approved by this document.
5. **Age and sampling controls:** sort by canonical timestamp, label posts under seven days old as immature, rank within creator, and stop any creator batch that loses more than 20% of requested rows after deduplication. Never auto-extend histories.

The Top-100/local-asset lane, near-peer/current-market lane, and Tiger private baseline remain independent evidence layers until blind coding and outcome joining are complete.
