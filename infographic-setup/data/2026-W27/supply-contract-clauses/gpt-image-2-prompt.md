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

Rules: Several images are attached. All but the last are STYLE REFERENCES ONLY — follow them directly for style, aesthetics, colours, tones, materials, lighting and illustration technique: a clean white background, soft three-dimensional gradient shapes, azure-blue, emerald-green and coral-pink accents, and bold dark-navy headings. Take every colour and tone from these images; do not invent a palette and do not use any colour codes or hex values. Ignore their subject matter entirely — do not copy any vehicles, batteries, wind turbines, solar panels, charging icons, dashboards or any other objects from them; use them only for look and feel. The LAST image is the Shetty's Desk logo — reproduce it exactly as given, do not restyle or relabel it, and place it small and clean in the bottom-left corner. Build the scene only from the summary below. Aspect ratio 1:1, resolution 2048x2048.

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
