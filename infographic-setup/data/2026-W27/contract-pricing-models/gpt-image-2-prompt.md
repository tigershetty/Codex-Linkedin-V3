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
- **Read (2026-06-29):** Rejected. Faults — (1) cryptic title ("Same job. Three prices." didn't name contracts/risk); (2) the euro bars forced fabricated numbers → the "Illustrative example" tag gutted the authority; (3) didn't "say" enough visually. Decision: drop the chart, go **metaphor-first** with a self-explaining comparison title. See Framework B.

---

## Framework B — "Who Carries the Weight" (visual metaphor, triptych)
**Why:** built from scratch (not the pattern bank) per the user's ask — a visual metaphor that shows + explains. "Carries the risk" is made literal: the cost overrun is a coral boulder, and each pricing model decides who hauls it. Triptych (same scene ×3, only the bearer changes) = learn one panel, read the rest. No fabricated euros → no disclaimer. Title names the lot. Caution noted: figures can render cartoonish — prompt forces clean flat iconographic silhouettes.

### Prompt — GPT Image 2 (Who Carries the Weight)

Task: Create a clean, modern, design-forward infographic — a flat vector editorial illustration like a premium explainer. Flat-design illustration, even clean illumination, flat-on, no camera angle, no dramatic lighting, no photography.

Rules: Use the attached images as style references — match their clean flat-design look, deep-navy and azure palette, crisp illustration and bold typography. Do not copy their subject matter. The last image is the Shetty's Desk logo; reproduce it exactly and place it small in the bottom-left corner. Aspect ratio 3:4.

CONCEPT: Three ways to price a contract, shown as one repeated scene. When a job runs over budget, the extra cost is a heavy boulder labelled "THE OVERRUN". Who has to carry that boulder depends on the pricing model. Two simple flat figures appear in every panel — a BUYER and a SUPPLIER — drawn in the same clean iconographic style throughout.

LAYOUT: A triptych — three equal vertical panels side by side, divided by thin hairline rules, filling the middle of the canvas. Each panel is the SAME scene with one difference: who carries the coral boulder. Each panel has its model name in bold caps at the top and a short caption at the bottom.

THE THREE PANELS, left to right:
- FIXED-PRICE: the SUPPLIER figure carries the whole coral boulder on their back, bent under the weight; the BUYER stands upright and free beside them. Caption: "Supplier carries it. You pay a premium for that."
- TIME & MATERIALS: the coral boulder hangs from a pole balanced across BOTH figures' shoulders, carried together. Caption: "Carried together."
- COST-PLUS: the BUYER figure carries the whole coral boulder on their back, bent under the weight; the SUPPLIER stands upright and free beside them. Caption: "Buyer carries every extra cost."

TEXT ON THE IMAGE (bold, beautifully set, max two type families):
- Heading at top, bold: "Fixed-Price vs Cost-Plus vs Time & Materials"
- Subline beneath it: "When a job runs over budget, who carries the risk?"
- The three model names as bold-caps labels at the top of each panel, and the three captions beneath each panel as described.
- The boulder labelled "THE OVERRUN" in each panel.
- The two figures labelled "BUYER" and "SUPPLIER", small and consistent.
- The attached Shetty's Desk logo reproduced exactly, small and clean in the bottom-left corner.

DESIGN: crisp flat-design vector illustration, simple iconographic figures (clean two-tone silhouettes, NOT cartoonish, NOT 3D, no faces needed), generous whitespace, strong alignment grid, bold legible sans-serif. Restrained palette: deep navy and azure for the figures and structure, ONE coral accent reserved only for the boulder (the overrun). Even, flat, front-facing — no camera angle, no dramatic lighting. Modern, confident, editorial. Every word legible at phone size.

### Generation record 2 (Who Carries the Weight — anchors back)
- **Run**: 2026-06-29 · `gpt_image_2` · 3:4 · 4K · quality high · **4 white-bg anchors + logo** (`99601e58…`, `a5059fdd…`, `079e1b1e-7bd2-44d7-b1c4-af52205a59d1`, `6ccd9b76…`, `7c3fc954…` LAST).
- Job `ec18c629-c2cf-4e55-85b6-e339f87db9a8`. (First attempt failed on a mistyped EV-cutaway media ID — the full correct ID is `079e1b1e-7bd2-44d7-b1c4-af52205a59d1`; the tool's "egress" hint was a red herring.)
- PNG not committable (CDN host egress-blocked) — judged in the Higgsfield panel.
