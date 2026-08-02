# Repeatable Update Procedure

## Guardrails

The refresh is strictly read-only. Do not publish, edit, delete, react, comment, connect, message, follow or unfollow, or change profile, save, notification, or privacy state. If LinkedIn requires login, stop and let the user complete it.

## 1. Freeze the comparison window

Record the collection timestamp, LinkedIn date range, profile follower count, and aggregate analytics cards. Do not compare a rolling 365-day snapshot with a lifetime post count without labeling the scope difference.

For experiments, collect each post at matched ages: `T+24h`, `T+7d`, and `T+28d`. Revisions after those timestamps must append a new observation rather than overwrite the previous one.

## 2. Refresh published posts

1. Open the user's published-content list in the logged-in browser.
2. Load until no new reasonably accessible posts appear.
3. Capture activity ID, URL, visible date/age, caption, native format, and post-specific analytics for each post.
4. Record visible zeros as zero and inaccessible fields as missing.
5. Preserve the aggregate snapshot separately. Never force aggregate and post-page components to reconcile.
6. Export the raw rows as a dated JSONL snapshot before rebuilding the consolidated database.

## 3. Refresh saved posts conservatively

1. Open LinkedIn's saved-post collection.
2. Load results using the platform's visible pagination control and normal scrolling.
3. Deduplicate continuously by activity ID.
4. Stop only after the pagination control is gone and five consecutive end-of-list checks add no new activity IDs.
5. For cards without an activity URL, preserve author, relative age, caption text, and a conservative unresolved key; never merge them on caption similarity alone.
6. Save the raw census as a dated JSONL snapshot.

The collection is intentionally curated. Retain this assumption in every refresh: saved membership means the user selected the post as an interesting/high-performing reference. It does not mean the post is a random sample or that its topic has been validated for Tiger's target market.

## 4. Refresh repository evidence

Use the canonical Top-100 and current-market CSVs referenced by the V4 operating system. Record their file paths and collection dates. If the Stage-0 meaning-classification gate still fails, keep those semantic tags directional.

## 5. Rebuild

Run the dependency-free builder with four inputs:

- live Tiger analytics rows;
- live saved-post rows;
- canonical `top100-cases.csv`;
- canonical `current-market-posts.csv`.

The module entry point is `buildContentMarketFitDatabase(...)` in `scripts/build-content-market-fit-database.mjs`. It writes the observation, inference, provenance, engagement, snapshot, and summary files without changing LinkedIn.

## 6. Validate before use

- All JSON and JSONL rows parse.
- Native-post count matches the reasonably accessible published list.
- Saved count is stable after repeated end checks.
- Activity IDs are unique within each raw snapshot.
- Every consolidated row has at least one provenance ID.
- Every normalized rate has the stated denominator.
- Missing fields are explicit.
- Overlap counts are reported, not assumed.
- Aggregate and page-level discrepancies are preserved as discrepancies.
- Decision-critical tags are manually reviewed and recorded in `manual-review-overrides.csv`.

## 7. Append experiment outcomes

For each V4 post, add a compact experiment ledger with topic, audience, hypothesis, controlled variable, publication age, impressions, saves, sends, reposts, profile viewers, relevant followers, qualified comments, signups, unique tool uses, and customer conversations. Do not declare a mechanism from one post; require replication or a clear disconfirmation.

