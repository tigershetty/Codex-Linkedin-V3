# Shetty's Desk — Brand Kit (Pack Contents)

A reusable visual system for creating on-brand LinkedIn infographics, with the right format for each tool you use.

| File | What it is | Best for |
|---|---|---|
| **Shettys-Desk-Brand-Kit.html** | Interactive kit — click-to-copy colors, gradients, type, illustration rules, and a live **AI Prompt Studio** | Browsing the system; building prompts by hand |
| **Shettys-Desk-Brand-Kit.pdf** | Visual 1-page reference (swatches, gradients, examples, master style block) | **Drag into Gemini / ChatGPT Image 2** as a quick style reference |
| **Shettys-Desk-Brand-Kit-DETAILED.pdf** | The full 20-page brand book — essence, complete color specs (hex/RGB/CMYK), gradients, type, illustration rules, motif library, layout, formats, the entire AI prompt system, per-tool guides, worked examples, reference gallery, and a QA checklist | The complete reference; deep onboarding; thorough style attachment |
| **PROMPT-LIBRARY.txt** | Copy-paste master style block + module templates + ready examples per model | Generating images fast in any model |
| **brand-tokens.json** | Machine-readable tokens (colors, gradients, fonts, prompts, formats) | **Claude Code** — single source of truth |
| **STYLE-GUIDE.md** | Full human + machine readable style guide | Reference / onboarding / Claude Code |
| **reference-images/** | 7 high-res style exemplars | Attach as "match this art style" references |
| **logos/** | The 4 original logo files: 1.png (terracotta+white), 2.png (terracotta+olive), 3.png (mono white), 4.png (mono olive) — 800×800 transparent PNGs | Avatar, covers, watermarks; uploaded to the Canva Brand Kit |

## Quick start by tool

**Gemini (Nano Banana Pro)** → attach `Shettys-Desk-Brand-Kit.pdf` (or 1–2 reference images) + paste the Gemini prompt from `PROMPT-LIBRARY.txt`. Fill in your subject.

**ChatGPT Image 2** → paste the ChatGPT prompt from `PROMPT-LIBRARY.txt`, lead with the style block, attach a reference image. Reuse the same block every time for a coherent series.

**Claude Code** → "Read `brand-tokens.json` and build a 1080×1350 LinkedIn carousel using the Shetty's Desk tokens…" It injects colors/gradients/fonts into editable HTML/SVG.

## The one rule

Keep the **master style block identical** across everything and change only the `{subject}`. Generate each module on a white background, then assemble in the layout anatomy. That's what keeps the whole feed looking like one brand.

> Note: reference images show the original subject (mobility/energy). Attach them for the **art style**, not the content.
