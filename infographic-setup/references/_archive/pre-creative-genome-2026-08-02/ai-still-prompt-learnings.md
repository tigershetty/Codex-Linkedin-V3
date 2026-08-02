# AI-Still Visual Path — Historical Learnings

**Version:** 1.2 · **Created:** 2026-06-29 · **Updated:** 2026-06-30.
**Scope:** historical AI-still lessons. The active visual workflow is now `visual-engine-v2.md`: **GPT Image 2 primary, HTML/code-render backup and comparison lane, Cobalt Grid brand seed.**
**Source:** distilled from the `supply-contract-clauses` and `contract-pricing-models` iterations, June 2026.

> **CURRENT APPROACH (v2.0, 2026-06-30):** read `visual-engine-v2.md` first. The Nano Banana Pro section below is preserved as experiment history, not the default. The durable lessons that still apply are framework-first selection, reference-led prompting, information-design register, no invented data, and avoiding negative prompt blocks for GPT Image 2.

---

## 0. The one big lesson — framework first, prompt second

When an AI-still infographic looks **"good but generic,"** the fix is almost always the **framework** (what argument the shape makes), not more prompt wording. We burned several rounds polishing adjectives on the wrong framework — it just produces a well-polished generic. Change the framework, *then* tune the prompt.

### How to select a framework — claim decomposition
A post's message usually contains **several arguable claims**, and **each claim points to a different visual family.** Choosing *which claim to lead with* is the real creative fork. Don't anchor on one metaphor and hunt for neighbours of it (that's how we got stuck on "the temple").

1. Write the message in one line.
2. List every distinct claim hiding inside it.
3. Map each claim to a family (the shape that *makes that argument* — see `layout-frameworks-intelligence.md` §1, "the one rule").
4. Pick by (a) which claim is the headline and (b) the data-integrity filter below.

Worked example — *"Six clauses; teams fight Liability hardest; 77% of disputes start at Scope":*

| Lead claim | Shape must say | Family |
|---|---|---|
| Hidden mass | visible tip / huge submerged body | Iceberg, cutaway |
| Ranking mismatch | two orders that cross | Dumbbell, slope, diverging bars |
| Misallocated defense | force aimed at the wrong target | Scales, fortress/wrong-gate, target |
| Structure with one weak member | a system one weak part decides | **Edifice / pillars (LOCKED here)**, weak-link chain, keystone |
| Concentration | one slice dwarfs the rest | Pareto, treemap, waffle |
| Cascade / origin | first domino → chain reaction | Domino, fishbone, fault line |

### Data integrity narrows the choice
Only **verified facts** may appear on the card. Frameworks that need per-item numbers we don't have (diverging bars across all six clauses, a scatter) would force invented figures — **forbidden**. Metaphor/structural frameworks that need only the known facts are both safer and usually more striking. Keep every non-highlighted item **neutral and unmarked** — claim nothing about it.

---

## 1. Prompt register — information-design infographic, NOT cinematography

When the user asks for **"more dramatic / less AI-like / like a designer made it,"** that means **conceptually sharper and cleaner / design-forward** — it does **not** mean cinematography. A cinematic brief (low camera angle, raking light, chiaroscuro, "ominous mood," weathered texture, depth planes) produces a moody photographic **scene** — the exact opposite of a crisp infographic. That round was rejected outright.

Write the prompt as:
- *"A clean, modern, design-forward infographic"* / *"an information-design graphic like the Financial Times or The Economist would publish."*
- Flat vector or **flat-dimensional** illustration; **even, clean illumination**; flat-on / front-facing; **no camera angle, no dramatic lighting, no scene, no photography.**
- Mark the standouts **by design, not by light** — a scaffold grid, a crack line, a tag, a colour accent — so the focal hierarchy survives the flat treatment.

---

## 2. Reference anchors are load-bearing — never strip them

Dropping the brand style anchors (running logo-only) made the engine fall back to its **generic prior** (a stock stone temple) and the output stopped looking like Shetty's Desk. Restoring the anchors fixed it in one round.

- **Always attach the 4 white-bg brand anchors + the logo (logo LAST).** These teach the clean Shetty's Desk look; the prompt's colour words alone do not.
- The white-bg anchors beat the original deep-blue `brand-anchor-v1.webp` (which rendered muddy colour). Prefer the white-bg set.
- Write the brand accents into the prompt **as well** (navy / azure base, one coral accent) — but the anchors do the heavy lifting.

**Persistent Higgsfield media IDs (this workspace):**
| Anchor | Media ID |
|---|---|
| Perks (white-bg) | `99601e58-92b7-4e0a-bb91-b09f8eaa98a2` |
| Batteries (white-bg) | `a5059fdd-7839-461e-944a-5e964163baa6` |
| EV-cutaway (white-bg) | `079e1b1e-7bd2-44d7-b1c4-af52205a59d1` |
| Renewable (white-bg) | `6ccd9b76-1288-4c7b-bbc0-6ea41cfd303c` |
| Shetty's Desk logo (LAST) | `7c3fc954-26f2-466f-8419-6a52a9d9a67b` |

---

## 3. Prompt hygiene

- **Let the anchors govern style — don't describe it (added 2026-06-29).** The reference anchors already carry the look. Spelling out style adjectives in the prompt — *"flat vector / flat-design / even illumination / no camera angle / iconographic two-tone silhouettes / NOT cartoonish / NOT 3D"* — does two harmful things: it **duplicates** the anchors, and it **over-constrains the engine toward generic/cartoon output** (asking for "simple two-tone silhouettes" literally requests cartoon figures, and the Ep36 triptych came back cartoonish because of it). Strip the style layer entirely; describe only **what is in the scene** (the subjects, the composition, the on-image text) and the **one semantic colour call** (which element gets the caution accent). Style = anchors' job; content = prompt's job. This is the original Gemini-house-form discipline ("use the attached image for style only") — keep it.
- **Trim the Rules block.** Minimal rules work: *"Use the attached images as style references — follow style, colours and technique, not their subject matter. The last image is the Shetty's Desk logo; reproduce it as given, small, bottom-left. Aspect ratio 3:4."* The anchors carry the rest.
- **No NEGATIVE / DO-NOT blocks.** Confirmed again: negative-prompt blocks degrade GPT Image 2. Phrase every constraint **positively**. (This is also a CLAUDE.md hard rule; the old 101 SKILL.md Step 4B template still carried a `DO NOT` block — it has been removed.)
- **One coral accent, reserved.** Coral only on the single caution element (the failing item + its number). Navy + azure is the base; ghost everything non-focal.

---

## 4. Engine & platform quirks (GPT Image 2 via Higgsfield)

- **GPT Image 2 cannot do 4:5.** Supported: 1:1, 4:3, 3:4, 16:9, 9:16, 3:2, 2:3. Use **3:4** for the portrait 101 card. (The old skill template said 1:1 — outdated.)
- Standard params: `quality: high`, `resolution: 4k`.
- GPT Image 2's internal engine name surfaces as **"videotape-alpha"** in job records — expected, not an error.
- **Backend remaps the nano IDs:** requesting `nano_banana_pro` actually ran `nano_banana_2`; `nano_banana_2` ran `nano_banana_flash`. Always record the engine that *ran*, not the one requested.
- **FLUX.2** takes references under role `image_references`, not `image`.

### Engine bracket (when choosing a model)
Run the **same prompt + references** across candidates (`gpt_image_2`, `seedream_v4_5`, `nano_banana_2`, `nano_banana_flash`, `flux_2`) at 4:5 where supported else 3:4, and let the user judge in-panel. Verdict this session: **GPT Image 2 best for text-heavy infographic typography**; Seedream close on mood; nano variants + FLUX read flat/AI.

---

## 5. Egress constraint (this remote environment)

The CloudFront output host (`d8j0ntlcm91z4.cloudfront.net`) and `upload.higgsfield.ai` are **blocked by session egress policy (403).** Consequences:
- **I cannot view or download the generated PNGs** — the user must judge each render visually in the Higgsfield panel. Every generation is gated on their read.
- Reference media must be **imported server-side** (e.g. via a public Netlify deploy-preview URL → `media_import_url`), because direct upload is blocked.
- Do **not** route around the block — report the blocked host and proceed via the user's eyes.

---

## 6. The locked template — "structure with one weak member"

The chosen visual for `supply-contract-clauses` (Ep35) is the **crisp pillars / "Edifice"** prompt and it is the reusable seed for any *"N-part structure, one part is the surprising weak point"* 101 post:

> Six clean **flat-dimensional columns** = one unified structure (the contract). The **over-defended** item is wrapped in an azure scaffold grid ("FOUGHT HARDEST"); the **actually-failing** item carries a single coral crack line ("WHERE IT BITES" + the stat). The other items are calm, identical, navy. Flat-on, even illumination, anchors + logo, header bar + per-column labels, 3:4.

Full paste-ready prompt: `data/2026-W27/supply-contract-clauses/gpt-image-2-prompt.md` → **"LOCKED VISUAL"**.

---

## 7. Process notes

- **Present the framework before generating.** The user gates each generation — and since I can't show them the PNG, they judge it in-panel. Don't fire a generation they haven't blessed.
- **When asked for judgment, commit to ONE strong pick** with a short rationale. Don't dump a menu — that reads as indecision (the user pushed back on menus twice).
- **Keep a future-post seed log.** Shelved this session: **"The Mismatch"** — a pure information-design graphic (a six-clause spine with two offset markers, effort vs failure). Good, just not chosen for this card.

---

## 8. Historical approach (v1.1) — Nano Banana Pro + viral scaffold + anchor & real logo

This was the operative spec for the AI-still lane on 2026-06-29, locked from the `contract-pricing-models` ("Shifting Line") iteration. It is now superseded by `visual-engine-v2.md` for new posts, but preserved because the scaffold and lessons are still useful when diagnosing generated outputs.

### 8.1 Engine & run config
- **Engine: `nano_banana_pro`.** The backend **remaps it to `nano_banana_2`** in job records — expected, not an error. Record the engine that *ran*.
- **Batch of 3** every time — `count: 3` — and the user picks the strongest. (Same "pick one of three" spirit as the code-render variety rule.)
- **Default aspect & resolution for posts going forward: `3:4`, `2k`** (param), with `resolution 2480x3312` written into the prompt text. *(The `contract-pricing-models` winner happened to be run at 1:1 / 2k while testing the viral scaffold; 3:4 portrait is the standing default for LinkedIn from the next post on.)*
- Resolution param accepts `1k` / `2k` / `4k`; **1k makes on-image text soft** — use **2k+**. Nano at 1k defaults silently, so always set `2k`.

### 8.2 References — one anchor + the real logo (transparent)
- **Reference 1 = the original brand anchor alone**, `brand-anchor-v1.webp` → media `1d05cd74-6ff1-4619-9869-dfc4952cfc00`, used **style-only**. (Single anchor + a hard "take nothing from it" rule held style without subject bleed — we no longer need the 4 white-bg anchors for this engine/scaffold.)
- **Reference 2 (LAST) = the real Shetty's Desk logo**, media `7c3fc954-26f2-466f-8419-6a52a9d9a67b`, **reproduce exactly, bottom-left**. Feeding the actual logo beats a text-"wordmark" instruction and removes the post-hoc compositing step.
- **Logo must be transparent / no background.** If the logo media has a white box, run `remove_background` (media_type `image`) on it first and use the resulting transparent media as Reference 2. Prep this once and reuse the transparent media ID.

### 8.3 Prompt scaffold — lifted from Tiger's most-viral post
Use this exact section skeleton (it is the proven viral structure):

```
Task: Create an infographic image for the summary below (after the rules).

Rules: Use the FIRST attached image as a reference on style, aesthetics, colours, and illustration
technique only. Use a different layout from it — do not use any object, subject, information or text
from the attached image; style only, for inspiration. The SECOND (last) attached image is the
Shetty's Desk logo — reproduce it exactly as given, small, in the bottom-left corner; do not redraw
or restyle it. Aspect ratio 3:4, resolution 2480x3312.

TOPIC: [one line]
THE QUESTION THIS ANSWERS: [the reader's real question, first person]
VISUAL STRUCTURE: [one unified system; name the ONE element that moves; "...is the dominant visual element."]

CONTENT TO INCLUDE ON THE IMAGE:
- Heading: "[≤8 words]" (Bold, max 8 words)
- Subheading: "[short, parallel]"
- [exact labels + per-item short captions]

CONTENT RULES:
- Maximum 45 words total on the image (excluding axis labels and model names)
- Heading: maximum 8 words, set in Bold
- [the one standout element]; the rest visually calm
- Every element readable at mobile phone size
- Data labels and short captions preferred over paragraph text

DO NOT:
- Use font sizes below 14px at final output resolution
```

The levers that make it land (all from the viral post): **THE QUESTION THIS ANSWERS** framing line · a **hard on-image word cap (~45)** · **"data labels/short captions over paragraph text"** · an explicit **dominant-element** call · the **"use a different layout from the attached image"** anti-bleed rule · **aspect + resolution restated in the prompt text** · a **per-item takeaway caption** so the argument lands in ~2 seconds.

### 8.4 The one allowed DO-NOT
A **single technical** `DO NOT` (the 14px font floor) is fine on **Nano Banana Pro** and is part of the viral recipe. This is the one exception to the "no negative blocks" rule — and it holds only because it is a single technical constraint, not a list of style-negatives. **If this prompt is ever ported to GPT Image 2, drop the DO-NOT block** (negative blocks degrade that engine — see §3).

### 8.5 No colour prescription
Don't name brand colours in the prompt. The anchor governs palette. Describe only the scene, the on-image text, and which one element is the standout (by design, not by colour word). This is the §3 "anchors govern style" rule, taken to its conclusion.

### 8.6 The locked template — "The Shifting Line" (a boundary that slides)
The chosen visual for `contract-pricing-models` and the reusable seed for any *"same input, allocated differently across N cases"* post (risk, cost, ownership, blame):

> N identical horizontal bars stacked; each split into two zones by one bold divider (party A left, party B right). The **same marker** (the overrun / the input) sits on every divider, identical in size; **only the divider's position changes** across the bars, so the eye reads the argument by watching one line walk. A short per-bar caption states the takeaway ("A absorbs it" / "Shared" / "B absorbs it"). One standout element; everything else calm.

Full paste-ready prompt: `data/2026-W27/contract-pricing-models/gpt-image-2-prompt.md` → **"REWRITE … Generation record 7"** / Framework C.

### 8.7 Standing constraints that still apply
Egress block (§5) is unchanged — **the user judges every render in the Higgsfield panel; I cannot view the PNGs.** Framework-first (§0), info-design-not-cinematography register (§1), and prompt hygiene (§3) all still govern.
