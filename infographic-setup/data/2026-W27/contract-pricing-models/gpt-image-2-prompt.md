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
> **Revised (2026-06-29):** v1 (Generation record 2) over-prescribed the style — "flat vector / iconographic silhouettes / even illumination / no camera angle / NOT cartoonish" — which duplicated the anchors *and* steered the engine toward cartoon figures (asking for "simple two-tone silhouettes" literally requests cartoons). v2 below strips ALL style adjectives and lets the **reference anchors govern style**; the prompt describes only the scene + the on-image text. New learning folded into `references/ai-still-prompt-learnings.md`.

Task: Create an infographic image for the summary below (after the rules).

Rules: Use the attached images as style references — follow them for style, aesthetics, colours and illustration technique, not their subject matter. The last image is the Shetty's Desk logo; reproduce it exactly and place it small in the bottom-left corner. Aspect ratio 3:4.

TOPIC: Three ways to price a contract, and who carries the risk when a job runs over budget.

CONCEPT: One repeated scene across three panels. When a job runs over budget, the extra cost is a heavy boulder labelled "THE OVERRUN". Who carries that boulder depends on the pricing model. A BUYER and a SUPPLIER appear in every panel; only who carries the boulder changes.

LAYOUT: A triptych — three equal panels side by side, each with its pricing model named in bold caps at the top and a short caption at the bottom.
- FIXED-PRICE: the SUPPLIER carries the whole boulder, bent under its weight; the BUYER stands upright and free. Caption: "Supplier carries it. You pay a premium for that."
- TIME & MATERIALS: the boulder hangs from a pole carried across both their shoulders, together. Caption: "Carried together."
- COST-PLUS: the BUYER carries the whole boulder, bent under its weight; the SUPPLIER stands upright and free. Caption: "Buyer carries every extra cost."

TEXT ON THE IMAGE:
- Heading: "Fixed-Price vs Cost-Plus vs Time & Materials"
- Subline: "When a job runs over budget, who carries the risk?"
- Each panel's model name and caption as above.
- The boulder labelled "THE OVERRUN"; the figures labelled "BUYER" and "SUPPLIER".
- The Shetty's Desk logo, bottom-left.

The boulder (the overrun) is the one element in the warm caution accent; everything else stays in the brand's cool tones. Keep every word legible at phone size.

### Generation record 2 (Who Carries the Weight — anchors back)
- **Run**: 2026-06-29 · `gpt_image_2` · 3:4 · 4K · quality high · **4 white-bg anchors + logo** (`99601e58…`, `a5059fdd…`, `079e1b1e-7bd2-44d7-b1c4-af52205a59d1`, `6ccd9b76…`, `7c3fc954…` LAST).
- Job `ec18c629-c2cf-4e55-85b6-e339f87db9a8`. (First attempt failed on a mistyped EV-cutaway media ID — the full correct ID is `079e1b1e-7bd2-44d7-b1c4-af52205a59d1`; the tool's "egress" hint was a red herring.)
- PNG not committable (CDN host egress-blocked) — judged in the Higgsfield panel.
- **Read (2026-06-29):** Figures too cartoonish. Root cause: the prompt over-prescribed the style (flat-vector / iconographic silhouettes / no camera / NOT cartoonish), which duplicated the anchors and pushed the engine toward cartoon. → v2 strips style adjectives, lets anchors govern style.

### Generation record 3 (Who Carries the Weight — v2, style-stripped prompt)
- **Run**: 2026-06-29 · `gpt_image_2` · 3:4 · 4K · quality high · same 4 anchors + logo.
- Job `7e1f93ad-7587-43d5-be53-4eaf00af168e`. Prompt = the revised lean version above (no style adjectives; anchors carry style).
- PNG not committable (CDN host egress-blocked) — judged in the Higgsfield panel.

### Generation record 4 (Nano Banana 2 bracket — same lean prompt, same references)
- **Run**: 2026-06-29 · requested `nano_banana_2` → **ran `nano_banana_flash`** (backend remap, again) · 3:4 · **1k** (model default, not 4k) · 3 iterations · same 4 anchors + logo.
- Jobs `76bbb7ab-65d2-49f1-abf5-13381b86c8f9`, `837f947b-bccf-47bf-beb7-fd14cb5beb92`, `70c5be8f-f501-4180-ac3e-05d06db5337d` (864×1184).
- Purpose: test whether Nano renders the figures less cartoonish than GPT Image 2. Trade-off to watch: text fidelity at 1k on a text-heavy triptych. PNGs not committable (CDN egress-blocked) — judged in the Higgsfield panel.

---

## Framework A — "Umbrella in the Cost Storm" (visual metaphor, triptych)
**Why:** the other shortlisted metaphor (build #1). Rain = rising costs; the umbrella = the contract. Who stays dry under the umbrella maps to who carries the risk. Same comparison title.

### Prompt — (Umbrella, lean / style-stripped)
Task: Create an infographic image for the summary below (after the rules).

Rules: Use the attached image as a style reference only — follow it for style, aesthetics, colours and illustration technique. Do NOT copy or include any object, subject, scene, label or text from the reference image in the final image; take style only. Aspect ratio 3:4. Place a small Shetty's Desk wordmark logo in the bottom-left corner.

TOPIC: Three ways to price a contract, and who carries the risk when a job runs over budget.

CONCEPT: One repeated scene across three panels. Rain falls in every panel, labelled "RISING COSTS" — the unexpected extra costs when a job runs over. An umbrella stands for the contract. A BUYER and a SUPPLIER stand together in each panel; who the umbrella protects changes.

LAYOUT: A triptych — three equal panels side by side, each with its pricing model named in bold caps at the top and a short caption at the bottom.
- FIXED-PRICE: the SUPPLIER holds the umbrella fully over the BUYER. The buyer stays dry; the supplier stands out in the rain, getting soaked. Caption: "Supplier shields you. You pay a premium for that."
- TIME & MATERIALS: the umbrella tilts between them; both are half in the rain. Caption: "You share the weather."
- COST-PLUS: the BUYER stands with no umbrella, drenched in the rain; the SUPPLIER stays dry under their own cover. Caption: "Every extra cost rains on you."

TEXT ON THE IMAGE:
- Heading: "Fixed-Price vs Cost-Plus vs Time & Materials"
- Subline: "When costs rise, who stays dry?"
- Each panel's model name and caption as above.
- The rain labelled "RISING COSTS"; the figures labelled "BUYER" and "SUPPLIER".
- The Shetty's Desk logo, bottom-left.

The rain (rising costs) is the one element in the warm caution accent; everything else stays in the brand's cool tones. Keep every word legible at phone size.

---

## Generation record 5 (single ORIGINAL anchor — Nano Banana 2, both metaphors)
- **Change**: per request, dropped the 4 white-bg anchors + logo and used the **original brand anchor ALONE** (`brand-anchor-v1.webp` → media `1d05cd74-6ff1-4619-9869-dfc4952cfc00`), with the Rules block hardened to "style only — do NOT copy any object/subject/scene/label/text from the reference." Logo therefore approximated (no logo reference) — composite the real Logo 2 later if a Nano variant wins.
- **Run**: 2026-06-29 · requested `nano_banana_2` → ran `nano_banana_flash` · 3:4 · 1k · single reference.
  - **Umbrella** (build #1) → job `02e84131-9f9e-4472-b63d-50c585ae0332` (864×1184).
  - **Who Carries the Weight** (build #2) → job `435942b6-fa2a-4f49-a2d4-c6307747ded0` (864×1184).
- PNGs not committable (CDN egress-blocked) — judged in the Higgsfield panel.

---

## REWRITE (2026-06-29) — system-not-scene direction

Umbrella / Boulder / "Who Carries the Weight" all rejected: they are metaphor *illustrations of figures*, which (a) drag the engine toward cartoon, (b) don't let you *see the risk boundary move*, and (c) are a scene, not a system. The "wow" references are one unified structure where a single element transforms. Two reworked frameworks below carry the pricing-models argument the same way the Ep35 pillars carried Post 1.

### Framework C — "The Shifting Line" (lead pick)
The concept is definitional: a cost overrun lands on the **supplier** (Fixed-Price), is **shared** (T&M), or lands on the **buyer** (Cost-Plus) — a boundary that slides. One form, one element moves. No fabricated numbers (it's WHO, not how-much).
- Three identical horizontal bars stacked; each runs SUPPLIER (left) ↔ BUYER (right), split by one bold vertical line.
- Fixed-Price → line hard right; T&M → line centre; Cost-Plus → line hard left.
- A small "THE OVERRUN" wedge sits on each bar's dividing line — the single coral caution accent.
- Heading: "When the cost moves, who absorbs it?"

### Framework D — "The Risk Meter" (backup)
One horizontal axis `SUPPLIER ◄———► BUYER`; the three models plotted as a descending staircase across it. Same logic, more "single striking gauge," less grid.

### Generation record 6 (single ORIGINAL anchor — nano_banana_pro, both frameworks)
- **Setup**: original brand anchor ALONE (`1d05cd74-6ff1-4619-9869-dfc4952cfc00`), style-only rule, 3:4. Logo approximated (composite real Logo 2 later if a Nano variant wins).
- **Run**: 2026-06-29 · requested `nano_banana_pro` → **remapped to `nano_banana_2`** · 3:4 · **1k** (default — text soft; offer a 4k re-run if needed) · single reference.
  - **Shifting Line** (Framework C) → job `363ee313-9b7e-434f-a70c-c17110e3b50e`.
  - **Risk Meter** (Framework D) → job `8bf9171d-a9f7-4f8c-8b4c-07ba475bd7ec`.
- PNGs not committable (CDN egress-blocked) — judged in the Higgsfield panel.
