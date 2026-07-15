# Research Brief - Demand Sensing SKU Routing

**Week:** `2026-W31`
**Slug:** `demand-sensing-sku-routing`
**Series:** `AI for Supply Chain`
**Role:** Supply Planner
**Tool:** Claude
**Research date:** 2026-07-14

## Research Question

How can a planner use Claude to create a first-pass routing board that separates SKUs suited to frequent near-term demand sensing, standard monthly forecasting, or specialized exception treatment?

## Core Finding

Demand sensing and monthly forecasting solve different planning-horizon problems. SAP describes demand sensing as a near-future, short-term process that combines a consensus demand plan with recent signals such as orders, deliveries, promotions, point-of-sale data, inventory, price, and other market information. Jobs typically run daily or weekly and produce a daily short-term forecast. Mid- to long-term demand forecasting remains the baseline planning layer.

The practical implication is not that every volatile SKU should be sensed more often. A useful routing decision must also test whether a fresh signal exists, whether the business can still respond inside the horizon, and whether the item's demand pattern needs a specialized intermittent-demand method rather than a faster version of the standard forecast.

## Planner Routing Logic

### Route A - Sense Frequently

Best candidate characteristics:

- recent orders, POS, promotion, inventory, or market signals arrive at daily or weekly cadence;
- the near-term demand shape is moving materially enough to affect deployment, replenishment, allocation, or production sequence;
- the response window is short enough that acting on the signal can still change an operating decision;
- the item has enough signal density to support a meaningful short-term adjustment.

Output: a near-term sensed-demand adjustment that is compared with the consensus or baseline plan.

### Route B - Plan Monthly

Best candidate characteristics:

- demand is comparatively stable or its meaningful decisions sit at a longer horizon;
- new downstream information is weak, late, or unlikely to change the near-term operating decision;
- history, trend, seasonality, commercial assumptions, and consensus inputs remain the useful baseline;
- the monthly cycle supports capacity, inventory, financial, and supply alignment.

Output: a baseline or consensus forecast maintained through the standard planning cadence.

### Route C - Special Method / Planner Review

Use an exception lane when:

- demand contains long zero-demand gaps or irregular order intervals;
- non-zero demand quantities vary sharply;
- the item is new, phasing in, phasing out, or becoming obsolete;
- a simple sense-faster-versus-plan-monthly choice would hide the actual forecasting problem.

The Syntetos-Boylan-Croston classification uses Average Demand Interval (ADI) and squared coefficient of variation (CV2) to distinguish smooth, erratic, intermittent, and lumpy demand. These measures are useful diagnostic inputs, not a universal automatic routing rule.

## Claude Workflow

### Input Pack

- SKU-location-customer demand history at the most useful available time grain;
- zero-demand periods, order frequency, average volume, and demand variability;
- recent orders, open orders, POS, promotion, inventory, price, and lifecycle signals where available;
- forecast snapshots, actuals, bias/error history, lead time, service priority, and decision horizon;
- planner comments describing known one-offs and data-quality issues.

### Prompt Job

Ask Claude to:

1. calculate or summarize demand regularity, variability, volume/value, signal freshness, response window, and lifecycle state;
2. place every SKU-location combination into `SENSE FREQUENTLY`, `PLAN MONTHLY`, or `SPECIAL METHOD / REVIEW`;
3. state the routing reason in one line;
4. name the signal that should trigger the next review;
5. name the operating decision the cadence is meant to support;
6. flag missing data and low-confidence classifications for planner review.

### Output Artifact

A planner-reviewable routing table with these fields:

`SKU / LOCATION / DEMAND PATTERN / SIGNAL FRESHNESS / RESPONSE WINDOW / LIFECYCLE / RECOMMENDED CADENCE / ROUTING REASON / TRIGGER SIGNAL / DECISION SUPPORTED / REVIEW FLAG`

## Integrity Rules For The Visual

- Do not claim demand sensing is automatically better than forecasting.
- Do not route intermittent or lumpy demand to sensing solely because variability is high.
- Do not invent accuracy improvements, service gains, time savings, or portfolio percentages.
- Keep the distinction horizon-based: near-term signal adjustment versus baseline/consensus planning.
- Show Claude as the builder of a first-pass operating artifact, not as the final planning authority.
- Label any example routing as conceptual; the post contains no company dataset.

## Sources

1. SAP Help Portal, **Demand Sensing** - near-future demand, recent data, short-term trends, signal examples, and demand-sensing purpose: https://help.sap.com/docs/SAP_INTEGRATED_BUSINESS_PLANNING/feae3cea3cc549aaa9d9de7d363a83e6/c4143c55a5ef9a2de10000000a174cb4.html
2. SAP Help Portal, **Demand Sensing Process** - consensus demand plus orders, deliveries, forecast snapshots, calendar, promotions, price, POS, consumption, and inventory; typical daily/weekly processing: https://help.sap.com/docs/SAP_INTEGRATED_BUSINESS_PLANNING/feae3cea3cc549aaa9d9de7d363a83e6/26578154c2652357e10000000a44176d.html
3. SAP Help Portal, **Creating a Forecast Model for Demand Sensing** - daily periodicity, day/week inputs, and short-term model configuration: https://help.sap.com/docs/SAP_INTEGRATED_BUSINESS_PLANNING/c1fb60cb1e9c49d99ada277ae57e9e6c/172cd5561e69be43e10000000a441470.html
4. Syntetos, Boylan, and Croston, **On the categorization of demand patterns**, Journal of the Operational Research Society 56(5), 2005, DOI 10.1057/palgrave.jors.2601841: https://www.tandfonline.com/doi/abs/10.1057/palgrave.jors.2601841%4010.1080/tfocoll.2026.0.issue-jors-john-boylan
5. Anthropic, **Claude can now create and edit files** - structured analysis and spreadsheet output from uploaded data: https://www.anthropic.com/news/create-files
