# contract-pricing-models — Image prompt (GPT Image 2, paste-ready)
**Series**: Supply Chain 101 · **Week**: 2026-W27 (RW02) · Post 2 · Episode TBD (pending Ep35 tracker reconcile)
**Topic**: Fixed-Price vs Cost-Plus vs Time & Materials — who carries the risk when costs move.
**Framework**: "Who Eats the Overrun" — three vertical cost bars, one worked example, bar height = the buyer's final bill.
**Visual lane**: AI-still / GPT Image 2 (same lane as Post 1). See `references/ai-still-prompt-learnings.md`.
**Execution**: Higgsfield · `gpt_image_2` · aspect `3:4` · resolution `4k` · quality `high` · **5 references (4 white-bg anchors + logo, logo LAST)**.

## Why this framework
Decomposed the message ("3 pricing models, who carries the risk") → claim chosen = **risk allocation made literal**, not placed on an axis (the Risk-Seesaw spectrum was rejected). Distinct shape from Post 1 (pillars/structure). The bars are given real, differentiated heights by a single illustrative worked example so the chart *proves* the point instead of schematising it.

## The worked example (illustrative — label it as such on the card)
One custom tooling order, agreed ≈ **€100k**, runs **€20k over** (material spike + rework → real cost €120k). Same overrun, three models, three buyer bills:
- **Fixed-Price** → buyer pays ≈ **€105k** (capped; ~€5k risk premium baked in up front). Supplier absorbs the ~€15k gap.
- **Time & Materials** → buyer pays ≈ **€120k** (pay for what was used). Shared, leans buyer.
- **Cost-Plus** → buyer pays ≈ **€132k** (actual €120k + ~10% fee). Buyer carries it all.

Bar heights = the buyer's final bill: **105 < 120 < 132**. That difference is the lesson.

---

## Prompt

Task: Create a clean, modern, design-forward infographic — an information-design graphic like the Financial Times or The Economist would publish. Flat vector design, even clean illumination, flat-on, no camera angle, no dramatic lighting, no scene, no photography.

Rules: Use the attached images as style references — match their clean flat-design look, deep-navy and azure palette, crisp dimensional illustration and bold typography. Do not copy their subject matter. The last image is the Shetty's Desk logo; reproduce it exactly and place it small in the bottom-left corner. Aspect ratio 3:4.

CONCEPT: One job, priced three ways. The same custom tooling order is agreed at €100k and runs €20k over budget. Three contract pricing models decide who pays that overrun, so the buyer's final bill is different in each. The chart proves it through bar height.

LAYOUT: A clean, modern bar-chart infographic on a light background. Three tall vertical bars stand side by side across the lower two-thirds of the canvas, one per pricing model, at clearly different heights (short, medium, tall). A single thin horizontal reference line runs across all three at the agreed-budget level, labelled "AGREED €100k". Each bar is filled deep navy up to the agreed line; the part of a bar that rises ABOVE the line is the overrun — the money at risk.

THE THREE BARS, left to right, heights visibly different from short to tall:
- FIXED-PRICE — shortest bar, about €105k, capped near the agreed line. A thin azure band at its base is labelled "risk premium". The ~€15k the supplier absorbs is drawn as a faint grey hatched block floating ABOVE the bar (not the buyer's money), with a small badge "SUPPLIER CARRIES IT". Figure label: "Buyer pays €105k".
- TIME & MATERIALS — medium bar, about €120k. Navy up to the agreed line, then a coral overrun block above the line, with a badge "SHARED, LEANS BUYER". Figure label: "Buyer pays €120k".
- COST-PLUS — tallest bar, about €132k. Navy up to the agreed line, then a tall coral block above the line (overrun plus fee), with a badge "BUYER CARRIES IT". Figure label: "Buyer pays €132k".

TEXT ON THE IMAGE (bold, beautifully set, max two type families):
- Heading at top, bold: "Same job. Three prices."
- Italic subline beneath it: "One €100k order, €20k over. Your final bill depends on who carries the risk."
- The three model names as bold-caps labels beneath their bars: FIXED-PRICE, TIME & MATERIALS, COST-PLUS.
- The "AGREED €100k" reference-line label, the three "Buyer pays" figures, and the three who-carries-it badges as described above.
- A small low-contrast footnote: "Illustrative example".
- The attached Shetty's Desk logo reproduced exactly, small and clean in the bottom-left corner.

DESIGN: crisp flat-design bar chart, generous whitespace, strong alignment grid, bold legible sans-serif. Restrained palette: deep navy and azure as the base, ONE coral accent reserved only for the overrun blocks the BUYER pays (Time & Materials and Cost-Plus); the supplier-absorbed gap stays neutral grey. Even, flat, front-facing — no camera angle, no dramatic lighting. Modern, confident, like a premium editorial data graphic. Every word and number crisp and legible at phone size.

---

## Generation record 1 ("Who Eats the Overrun" — anchors back)
- **Run**: 2026-06-29 · `gpt_image_2` · 3:4 · 4K · quality high · **4 white-bg anchors + logo** (`99601e58…`, `a5059fdd…`, `079e1b1e…`, `6ccd9b76…`, `7c3fc954…` LAST).
- Job `b3ba2250-cefc-49ae-831c-222c76330924`.
- PNG not committable (CDN host egress-blocked) — judged in the Higgsfield panel.
