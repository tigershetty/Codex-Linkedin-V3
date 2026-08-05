---
name: analytics
description: Capture and interpret LinkedIn, Substack, and website performance after publication. Use for /analytics requests and performance reviews that must link outcomes to the exact Creative Genome reference bundle and elements used, preserve channel-specific metrics, and update transfer learning without downgrading saved references.
---

# Analytics

Record what happened to this adaptation on Tiger's channels. Do not judge the source reference itself.

## Identify the package

1. Resolve `content_id`, channel, publication time, URL, and checkpoint.
2. Read the exact `reference-bundle.json` used at publication.
3. Record `creative_bundle_id`, genome snapshot, `genome_reference_ids`, Tiger precedent IDs, and
   stable `creative_element_ids` by role: attention, comprehension, utility, and bridge.
4. Refuse to analyze a draft bundle that differs from the published package.

## Capture observations

Append observations at 24 hours, 7 days, and 28 days. Preserve the actual capture timestamp when late.
Record both the assembly `transfer_result` and one `element_transfer` result per creative element.

- LinkedIn: impressions, reach, reactions, comments, reposts, saves, sends, profile viewers, followers gained, and link/artifact actions when exposed.
- Substack: views, recipients, opens, clicks, subscriptions, unsubscribes, comments, restacks, and referrals when exposed.
- Website: qualified visitors, artifact starts, completions, downloads, return use, and source channel.
- Qualitative: practitioner role, implementation question, correction, counterexample, or reported use.

Write unavailable values as blank, never zero. Keep unlike channel metrics separate.

## Compare appropriately

Use Tiger posts at the same channel, maturity, native format, audience job, and mechanism as the comparison set. Report raw outcomes and useful rates separately. Do not calculate or use a universal composite score.

## Record element transfer

For each published element, append one transfer observation:

```text
element_id | role | adaptation | observed outcome | comparison | transfer status | next change
```

Use `pending`, `transferred`, `unclear`, or `did_not_transfer` as the transfer status. Apply the status only to this Shetty's Desk adaptation.

Never change `saved_by_tiger`, `positive_creative_signal`, or the source reference's creative status because our post underperformed. A weak result means the chosen combination, translation, audience match, execution, or distribution did not transfer as intended.

## Update files

1. Append the channel snapshot to `data/analytics-log.csv` without overwriting an existing content/checkpoint row.
2. Update `data/{week}/{slug}/analytics.md` with metrics, comparison set, element transfer, practitioner signals, and one next action.
3. Update the Creative Genome learning index only through bundle and element IDs.
4. Preserve prior snapshots and corrections as an audit trail.

## Report

Return the primary channel outcome, the strongest practitioner signal, which bundle elements transferred or need adaptation, and the next change. Avoid causal claims that the observed data cannot support, but do not reopen whether the saved references were worth saving.
