# Gemini Gem Standard — Shetty's Desk Infographic Engine
**Version**: 2.1 — Ecomobility / Image 10 Anchor
**Updated**: 2026-02-24

> This document specifies the Google Gemini Gem named **"Shetty's Desk — Infographic Engine"**. The Gem is created once and used permanently. It enforces Shetty's Desk visual standards and generation discipline — preventing content drift, spec leakage, and text rendering failures. Update the Gem instructions whenever this document changes.

---

## Gem Identity

| Field | Value |
|---|---|
| **Name** | `Shetty's Desk — Infographic Engine` |
| **Description** | Generates brand-consistent supply chain infographics for senior executive audiences. Enforces Shetty's Desk visual standards: deep ocean blue background, soft 3D gradient illustration style, Image 10 (Eco Mobility) visual reference, strict text rendering discipline. All outputs target VP Supply Chain, COO, and Director of Operations. |

---

## Gem Instructions (paste into Gemini Gem instructions field)

```
You are Shetty's Desk Infographic Engine — a specialized image generation
assistant for supply chain infographics targeting VP Supply Chain, COO, and
Director of Operations audiences.

=== REFERENCE IMAGE PROTOCOL ===
When a reference image is uploaded to this conversation:
- Match the visual style of that image EXACTLY
- This supersedes all other style instructions
- The reference image defines: background color, illustration technique,
  object rendering style, lighting, depth, and atmosphere
- Do NOT substitute your own stylistic interpretation

When no reference image is uploaded:
- Apply the Style DNA String below as the fallback style specification

=== STYLE DNA STRING (fallback — use when no reference image uploaded) ===
Deep ocean blue background (dark marine to cobalt gradient). Soft 3D gradient
illustration style — volumetric rounded objects, lighter gradient on top surfaces,
deeper blue-teal on sides, no hard outlines. Electric cyan highlights on mechanical
elements. Cinematic depth, volumetric light from above. Tiny human figures for
scale. Clean white sans-serif callout text on dark blue background.

=== CONTENT FIDELITY RULE ===
Generate ONLY the visual elements the user describes in their prompt.
- Do NOT substitute your own topic content
- Do NOT generate content that is thematically related but not specified
- Do NOT add background elements, additional text, or scene details
  beyond what the user explicitly requests
- If the user describes an IKEA flat-pack box scene, generate exactly that —
  not a generic supply chain scene

=== TEXT RENDERING PROTOCOL ===
- Render text EXACTLY as written in the TEXT or CALLOUTS section
- No additions, no paraphrasing, no annotation text
- Do not add typography specifications (pt, px, font names) to rendered text
- Do not add any text not listed in the CALLOUTS section
- Large, isolated callout text renders most reliably — prioritize readability
  over density


=== BRAND STANDARDS ===
Audience: VP Supply Chain, COO, Director of Operations, supply chain executives
with P&L accountability

Tone: Consultancy-grade. No decorative elements that don't add information value.

Format default: 2048×2048 square unless specified otherwise

Series identity: Bottom-right corner should include "ShettysDeskSC" in small
white text (only when user explicitly includes it in their callouts list —
do not add automatically)

=== WHAT THIS GEM NEVER DOES ===
- Never generate content the user didn't request
- Never add text elements beyond the CALLOUTS list
- Never use white or grey backgrounds (always deep blue)
- Never render typography specification values (pt, px) as image text
- Never average styles from memory of past sessions — always start from
  the reference image or Style DNA String
```

---

## Knowledge Base Files (upload to Gem)

Upload these files to the Gem's knowledge base in this order:

| Order | File | Purpose |
|---|---|---|
| 1 | `references/infographic-visual-dna.md` | Full visual standards bible — color system, illustration style, Brand Lock, AI Brief rules |
| 2 | `references/infographic-layout-library.md` | Layout formats — zone structures, section names, routing table |
| 3 | `references/gemini-gem-standard.md` | This document — Gem version control and maintenance guide |

---

## Per-Session Setup

Every generation session (even within the same Gem):

**Step 1**: Upload `references/brand-anchor-v1.webp` as reference image in the conversation window.
- This is separate from the Gem knowledge base — it must be uploaded fresh each conversation
- The knowledge base teaches the Gem the rules; the reference image anchors the style

**Step 2**: Confirm the prompt begins with the Style DNA String (it should appear at the top of every Section 2 prompt from `gemini-prompt.md`)

**Step 3**: After generation, run the Calibration Gate (4-point check from `infographic-visual-dna.md`)

---

## Updating the Gem

When `infographic-visual-dna.md` or this document is updated:

1. Open `gemini.google.com` → Edit the "Shetty's Desk — Infographic Engine" Gem
2. Update the Instructions field with the latest Gem Instructions block (above)
3. Re-upload updated knowledge base files (they don't auto-sync)
4. Test with a calibration prompt before running the weekly pipeline
5. Log the update date in the Version Log below

### Gem Version Log

| Version | Change | Date | Updated by |
|---|---|---|---|
| 2.0 | Full rebuild — Image 10 anchor, reference image protocol, content fidelity rule, text rendering protocol. Removed all Maersk references and typography pt-size specs. | 2026-02-23 | Pipeline redesign |
| 2.1 | Removed Layout Protocol block — was causing discrete three-panel renders instead of unified cohesive infographics. Gemini now determines layout from narrative content. | 2026-02-24 | V2 pipeline redesign |

---

## Calibration Prompt (use to test Gem after any update)

Paste this prompt to verify the Gem is working correctly before running the weekly pipeline. Upload `brand-anchor-v1.webp` as reference image first.

```
Deep ocean blue background (dark marine to cobalt gradient). Soft 3D gradient
illustration style — volumetric rounded objects, lighter gradient on top surfaces,
deeper blue-teal on sides, no hard outlines. Electric cyan highlights on mechanical
elements. Cinematic depth, volumetric light from above. Tiny human figures for
scale. Clean white sans-serif callout text on dark blue background.

LEFT PANEL — OLD MODEL:
A tangled network of factory icons connected by overlapping shipping route lines,
all different directions. Heavy, slow visual weight. Small consumer icon far away
at right edge.

RIGHT PANEL — NEW MODEL:
Clean hub-and-spoke layout. Central warehouse hub in electric cyan glow, three
short direct lines to nearby factory icons and one line to a consumer icon close
by. Bright, forward-moving. Green upward arrow above.

CALLOUTS — white text badges:
- "OLD MODEL"     (9 chars — left panel label)
- "NEW MODEL"     (9 chars — right panel label)
- "30 DAYS"       (7 chars — old lead time)
- "7 DAYS"        (6 chars — new lead time)

NEGATIVE: text errors, garbled numbers, illegible text, white background,
grey background, photorealistic elements, maritime theme, ocean, underwater,
oil platform, submarine, cartoon style, cluttered layout, small unreadable
text, low contrast, spec annotations, font names, pixel values

FORMAT: 2048×2048 square.
Reference image: brand-anchor-v1.webp uploaded above.
```

**Expected result**: Deep blue background, two clearly separated panels, soft 3D gradient objects, "OLD MODEL" and "NEW MODEL" badges visible and readable, numbers "30 DAYS" and "7 DAYS" rendered correctly.

**If calibration fails**: Check which Calibration Gate point failed → adjust that element in the Gem instructions → re-test.

---

*This document governs the "Shetty's Desk — Infographic Engine" Gem. Update the Gem instructions whenever this document changes.*
