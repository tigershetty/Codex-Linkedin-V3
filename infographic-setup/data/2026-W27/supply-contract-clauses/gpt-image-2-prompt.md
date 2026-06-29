# supply-contract-clauses — Image prompt (paste-ready, GPT Image 2 / Gemini form)
**Week**: 2026-W27 (RW02) · **Concept**: V7 "The Edifice" — six-column portico, liability over-reinforced, scope cracking
**Written in the archived "Gemini Prompt (paste-ready)" house form** (matches W21–W26 procurement posts).
**Execution**: Higgsfield · `gpt_image_2` · aspect `1:1` · resolution `2k`/`4k` · quality `high` · **2 reference images attached**
- Image 1 = `references/brand-anchor-v1.webp` (style only) — import via the public Netlify preview URL, server-side.
- Image 2 = `renderer/assets/logos/shettys-desk-logo-2.png` (the logo to place bottom-left) — import the same way.

> Direction: take the look **directly from the attached anchor** (deep-blue, soft-3D gradient, the outputs we used to
> get before). The prompt does **not** describe the anchor and carries **no source line** — the Shetty's Desk logo
> sits bottom-left instead.

---

## Prompt

Task: Create an infographic image for the summary below (after the rules).

Rules: Use the attached images as style references — follow them for style, colours and illustration technique, not their subject matter. The last image is the Shetty's Desk logo; reproduce it as given and place it small in the bottom-left corner. Aspect ratio 1:1, resolution 2048x2048.

TOPIC: The Six Clauses That Hold a Supply Contract
THE QUESTION THIS ANSWERS: Teams negotiate liability the hardest, so why do most disputes start somewhere else?

VISUAL FORMAT: One grand six-column stone temple (a classical portico) as a single unified hero structure — not panels.

VISUAL ANCHOR: A grand classical portico with six tall stone columns stands as one structure that represents a single supply contract, filling the canvas with cinematic depth and volumetric light from above. Four columns stand calm and identical. Two columns break the pattern and carry the whole story. One column is encased head to toe in construction scaffolding — poles, ledgers, diagonal braces and clamps — with two tiny human figures still reinforcing it, over-built and over-protected. A second column is split by a single deep fracture running top to bottom, its base crumbling into rubble, lit by one warm caution glow. The cracked column is the single focal break: everything else is calm and structural, and the eye lands on the fracture. A triangular pediment and a carved frieze sit across the top of the columns.

VISUAL STRUCTURE: Six columns left to right on a stepped base, pediment and frieze above, each column labelled beneath. The scaffolded column (cool structural accent) and the cracked column (warm caution accent) are the two stand-outs; the cracked column is the focal point.

HEADING: "Everyone reinforces the wrong clause" — bold, positioned at the top. Below it in italic: "Six clauses hold a supply contract. The cracks start at the one nobody guards."

HERO STATEMENT: "77% of disputes start at scope." — large and bold near the cracked column, with "scope" in the warm accent colour.

CONTENT TO INCLUDE ON THE IMAGE:
- Frieze across the top of the temple: "THE SUPPLY CONTRACT"
- Round seal in the centre of the pediment: "6 CLAUSES"
- SIX COLUMN LABELS (bold, left to right, one beneath each column):
  • PRICE & INDEXATION
  • SCOPE & SPECIFICATION   (this is the cracked column — the focal point)
  • DELIVERY & LEAD TIME
  • QUALITY & SLA
  • LIABILITY & REMEDIES    (this is the scaffolded column)
  • TERM & EXIT
- Ribbon banner on the scaffolded Liability column: "FOUGHT HARDEST"
- Small tag beside the Liability column: "#1 most-negotiated since 2007"
- Ribbon banner on the cracked Scope column: "WHERE IT BITES"
- Bottom-left corner: the attached Shetty's Desk logo (Image 2), placed as-is.
- Bottom-right corner: a small signature "Poornajith Shetty"

CONTENT RULES:
- Total words on the image: 70 to 110 (excluding the six column labels).
- Heading: maximum 6 words, bold. Subtitle in italic below it.
- Column names and banners in bold capitals; every element readable at mobile phone size.
- The cracked Scope column is the single focal point; the scaffolded Liability column is the secondary stand-out; the other four columns recede.
- Use only two accents: one cool structural accent on the scaffolding, one warm caution accent on the crack and the "77%".
- Maximum 2 font families throughout.

DO NOT:
- Use font sizes below 14px at final output resolution.
- Use more than 2 font families.
- Include em dashes anywhere on the image. Replace with a comma or full stop.
- Add source attribution, reference text, or footnote text anywhere.
- Leave empty canvas space at the top, bottom, or sides.

---

## Generation record (Higgsfield · GPT Image 2 · anchor + logo)
- **Run**: 2026-06-29 · model `gpt_image_2` · aspect `1:1` · resolution `2k` · quality `high` · 1 image · 2 references
- Job `e1926913-d068-48ea-8fa9-723473f86c06` (2048×2048)
- Image 1 (style) = anchor `brand-anchor-v1.webp`, imported as media `1d05cd74-6ff1-4619-9869-dfc4952cfc00`
- Image 2 (logo) = `shettys-desk-logo-2.png`, imported as media `7c3fc954-26f2-466f-8419-6a52a9d9a67b`
- Both imported server-side from the public Netlify deploy-preview URLs (egress workaround):
  `…/infographic-setup/references/brand-anchor-v1.webp` and `…/renderer/assets/logos/shettys-desk-logo-2.png`
- Renders in the Higgsfield panel; PNG could not be committed (CDN host blocked by session egress policy).

---

## Generation record 2 (white-bg multi-anchor experiment)
- **Run**: 2026-06-29 · `gpt_image_2` · 1:1 · 2k · high · 1 image · **5 references (4 style + logo)**
- Job `8efe0499-1484-46c9-8fed-adb4d391ce3e` (2048×2048)
- Style anchors (white-bg eco-mobility pages, imported from Netlify preview `/_archive/eco-mobility/`):
  - `3..webp` Perks → media `99601e58-92b7-4e0a-bb91-b09f8eaa98a2`
  - `5.webp` Batteries → media `a5059fdd-7839-461e-944a-5e964163baa6`
  - `6.webp` EV cutaway → media `079e1b1e-7bd2-44d7-b1c4-af52205a59d1`
  - `8.webp` Renewable → media `6ccd9b76-1288-4c7b-bbc0-6ea41cfd303c`
- Logo = `shettys-desk-logo-2.png` → media `7c3fc954-26f2-466f-8419-6a52a9d9a67b`
- Purpose: fix the muddy colour from the deep-blue anchor (image 10) by switching to white-bg anchors; test 4–5 reference blending. PNG not committable (CDN egress-blocked).

---

## Generation record 3 (4-model bracket — same trimmed prompt + same 5 references)
- **Run**: 2026-06-29 · trimmed Rules block (refer-to-image / reproduce-logo-bottom-left / aspect ratio only) · same 4 white-bg anchors + logo · 4:5 where supported, else 3:4.
- Reference media (logo LAST): `99601e58…` Perks · `a5059fdd…` Batteries · `079e1b1e…` EV-cutaway · `6ccd9b76…` Renewable · `7c3fc954…` logo.
- Models requested vs the engine Higgsfield actually ran (backend remaps the nano IDs):
  - requested `nano_banana_pro` → ran **nano_banana_2** · job `169d06fe-4f5f-4894-af3b-ee0b4f3e457b` · 4:5 · 1856×2304 · 2k
  - requested `nano_banana_2` → ran **nano_banana_flash** · job `21dfc037-ed4a-4905-afef-2b507943ab05` · 4:5 · 1856×2304 · 2k
  - `seedream_v4_5` (quality high) · job `d93c7099-5948-4413-9683-e26e685d375f` · 3:4 · 3456×4608 (native 4K)
  - `flux_2` (variant pro, 2k) · job `ff582f23-3ddc-48bf-be9f-a5a27097f275` · 3:4 · 1440×1920
- Purpose: pick the best engine for the text-heavy infographic. PNGs not committable (CDN host egress-blocked) — judged visually in the Higgsfield panel.
- **Read (2026-06-29):** Seedream 4.5 was the only one close; the two Nano variants and FLUX read flat/AI. Decision: keep GPT Image 2 + Seedream, rewrite the prompt from a *content-spec* into an *art-direction brief* (more dramatic, designer-crafted). See Round 4.

---

## Round 4 — dramatic / designer rewrite (monumental-cinematic art direction)
**What changed vs the old prompt:** reframed from "infographic" to a *dramatic editorial conceptual illustration*; added a full ART DIRECTION layer (low hero angle, single raking key light, restrained warm-stone palette + one cold + one hot accent, three depth planes, weathered material, ominous mood, negative-space composition); light carries the focal hierarchy instead of a "focal point" sentence; on-image text halved; `DO NOT` block removed and all constraints phrased positively. **References: logo only** (the white-bg style anchors fought the new look) — brand accents written into the prompt instead. Aspect 3:4 (GPT can't do 4:5; Seedream 3:4 native 4K).

### Prompt A — GPT Image 2 (structured, text-rich)

A dramatic editorial conceptual illustration: a colossal six-column stone portico shot from a low hero angle, composed like a monumental fine-art poster. This is editorial illustration, not a flat infographic.

ART DIRECTION:
- Camera: low angle looking up, so the portico feels monumental and slightly imposing.
- Light: one hard shaft of light rakes in from the upper right and ignites a single cracked column; the rest of the structure falls into deep, cool shadow. Light, not labels, marks what matters.
- Palette: restrained. Warm stone neutrals (sandstone, bone, taupe) as the base; ONE cold accent, steel-blue, on the scaffolding; ONE hot accent, molten coral, glowing inside the crack and on the "77%". No other colours.
- Depth: three planes — foreground rubble in shadow, midground the six columns, background a hazy sky with drifting dust and atmosphere.
- Material: weathered, tactile carved stone with real chisel texture; the scaffold is cold steel tubing; the fracture glows from within like molten light leaking out.
- Mood: monumental, ominous, the quiet moment before something load-bearing gives way.
- Composition: the temple fills the lower two-thirds; the title sits in the upper open sky; the cracked column sits on the right-third line; generous negative space, deliberate asymmetry and tension.

THE SCENE: Six tall stone columns stand as one structure, a single supply contract. Four stand calm, identical, in shadow. Two break the pattern. One column is wrapped head to toe in steel scaffolding with two tiny human figures still reinforcing it, over-built and over-protected. The other is split by one deep fracture from top to bottom, its base crumbling into rubble, glowing coral from within. A triangular pediment crowns the columns.

TEXT ON THE IMAGE (sparse and beautifully set, at most two type families):
- Title in the upper sky, bold: "Everyone reinforces the wrong clause"
- Italic subline beneath it: "Six clauses hold a supply contract. The cracks start at the one nobody guards."
- Large, near the cracked column: "77% of disputes start at scope" with "scope" in the coral accent.
- One short bold-caps label beneath each column: PRICE & INDEXATION, SCOPE & SPECIFICATION, DELIVERY & LEAD TIME, QUALITY & SLA, LIABILITY & REMEDIES, TERM & EXIT.
- A small banner on the scaffolded column: "FOUGHT HARDEST". A small banner on the cracked column: "WHERE IT BITES".
- The attached Shetty's Desk logo reproduced exactly, small and clean in the bottom-left corner.

Aspect ratio 3:4. Every word crisp and legible at phone size. Let the image breathe; the open sky is intentional.

### Prompt B — Seedream 4.5 (mood-led, text-light)

A moody, dramatic architectural illustration rendered with painterly chiaroscuro and rich pigment, like a fine-art editorial poster rather than a flat infographic. A colossal six-column stone portico rises from a low hero angle, monumental and imposing. One hard shaft of light rakes across the scene from the upper right and sets a single cracked column glowing while everything else sinks into deep, cool shadow. The palette is restrained and cinematic: warm sandstone and bone neutrals, one cold steel-blue accent on scaffolding, one molten-coral glow inside the fracture, nothing else. Three planes of depth: rubble in the shadowed foreground, the six columns in the midground, a hazy dust-filled sky behind. The stone is weathered and tactile; one column is wrapped head to toe in cold steel scaffolding with two tiny figures still reinforcing it, over-built; another is split top to bottom by a deep coral-glowing fracture, its base crumbling into rubble. The mood is ominous, the quiet before something load-bearing gives way. Composition: the temple sits in the lower two-thirds, open sky above for the title, the cracked column on the right third, generous negative space and deliberate tension.

Minimal text, beautifully set, at most two type families:
- Title in the sky: "Everyone reinforces the wrong clause"
- Large by the cracked column: "77% of disputes start at scope" (the word "scope" in coral)
- One bold label beneath each of the six columns: PRICE & INDEXATION, SCOPE & SPECIFICATION, DELIVERY & LEAD TIME, QUALITY & SLA, LIABILITY & REMEDIES, TERM & EXIT
- The attached Shetty's Desk logo reproduced exactly, small, bottom-left.

Aspect ratio 3:4, ultra-high resolution, crisp legible lettering.

### Generation record 4 (dramatic rewrite — logo-only reference)
- **Run**: 2026-06-29 · monumental-cinematic art-direction rewrite · **logo-only** reference (`7c3fc954…`) · 3:4 · 4K.
- Prompt A → `gpt_image_2` (quality high, resolution 4k) · job `20879813-27a9-4da9-ab38-0015a9673bce` · 2880×3840.
- Prompt B → `seedream_v4_5` (quality high) · job `39e92b64-c538-4c6a-bc1b-e8e364374090` · 3456×4608.
- White-bg style anchors deliberately dropped (they pulled the output back to flat AI-infographic); brand accents written into the prompt instead. PNGs not committable (CDN egress-blocked) — judged in the Higgsfield panel.
