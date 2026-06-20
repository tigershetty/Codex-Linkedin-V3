# Infographic Visual DNA
**Version**: 2.1 — Ecomobility / Image 10 Anchor
**Updated**: 2026-02-24
**Status**: ACTIVE — replaces Maersk-anchored V1.0

> This is the master visual standards bible for the Infographic Content Engine V1. All skills, prompts, and Gemini generations reference this document. Do not override these standards at the skill level — change them here and they propagate everywhere.

---

## Brand Anchor

**Primary reference**: `references/brand-anchor-v1.webp` (Image 10 from Eco Mobility series — full image, uncropped)

**What this image defines**: deep ocean blue background, soft 3D gradient illustration style, volumetric objects with lighter gradient on top and deeper blue-teal on sides, electric cyan highlights on mechanical/tech elements, cinematic depth with volumetric light from above, tiny human figures for scale throughout, ground-plane staging (objects sit on dark blue rectangular island bases).

**Upload protocol**: Upload `brand-anchor-v1.webp` as reference image #1 in EVERY Gemini generation session. Never skip this step — the reference image is the primary style enforcer for color, illustration technique, object rendering, lighting, and atmosphere. The Style DNA String (below) is the verbal backup.

**Version history**:
| Version | File | Source | Trigger |
|---|---|---|---|
| v1 (current) | `brand-anchor-v1.webp` | Image 10, Eco Mobility | Initial setup |
| v2 (pending) | `brand-anchor-v2.webp` | Best of first 5 own infographics | After 5 renders pass Calibration Gate |
| v3+ (future) | `brand-anchor-v3.webp` | Pool of 2-3 best own infographics | After 10-15 good renders |

---

## Style DNA String (Verbal Anchor)

> ⚠️ BRAND ASSET — Do not modify this string ad-hoc. Changes require a version bump and rationale logged in the version log below.

This exact string is prepended to EVERY AI image prompt, verbatim:

```
Deep ocean blue background (dark marine to cobalt gradient). Soft 3D gradient
illustration style — volumetric rounded objects, lighter gradient on top surfaces,
deeper blue-teal on sides, no hard outlines. Electric cyan highlights on mechanical
elements. Cinematic depth, volumetric light from above. Tiny human figures for
scale. Clean white sans-serif callout text on dark blue background.
```

**Version log**:
| Version | Change | Date |
|---|---|---|
| v1 | Initial string, derived from Image 10 (Eco Mobility) analysis | 2026-02-23 |

**When to update**: Only when Calibration Gate data reveals a consistent failure that the current string fails to prevent. Log the specific failure mode and the string change in the version log.

---

## Color System

Colors are enforced by the reference image (physical anchor) and the Style DNA String (verbal anchor). Hex codes below are for reference and Gem instructions — do NOT include hex codes in AI image prompts (they don't translate to accurate color; reference images do).

### Structural Colors (from Image 10)
| Role | Description | Approx Hex | Source |
|---|---|---|---|
| Background (dominant) | Deep marine to cobalt blue | `#0a2856` → `#1565c0` | Image 10 — full-frame ocean blue |
| Object surfaces (top) | Lighter cobalt blue | `#1e88e5` | Image 10 — gradient top of 3D objects |
| Object surfaces (side) | Deep teal-blue | `#0d47a1` | Image 10 — gradient sides of 3D objects |
| Glow/highlight | Electric cyan | `#00e5ff` | Image 10 — glowing element edges and tech accents |
| Text / callouts | Pure white | `#ffffff` | All image 10 text elements |

### Semantic Colors (for illustration content direction)
| Meaning | Color | Use |
|---|---|---|
| Positive / growth / success | Emerald green | Green checkmarks, upward arrows, growth indicators |
| Negative / failure / risk | Crimson red | Red walls, falling indicators, risk markers |
| Warning / transition | Amber | Caution elements, in-transition states |
| Neutral / background data | Light blue | Secondary callouts, supporting information |

### Color in AI Prompts — What Works vs. What Doesn't
- ❌ Hex codes (`#1565c0`) — AI image models don't translate these accurately
- ❌ RGB values — same problem
- ✅ Descriptive language: "deep ocean blue", "electric cyan glow", "dark marine", "cobalt gradient"
- ✅ Reference image: the physical anchor carries the color information more accurately than any text description

---

## Illustration Style

**Technique**: Soft 3D gradient — volumetric objects with smooth gradient fills. NOT flat vector. NOT hard-edged isometric. Objects appear to have dimensional depth through gradient transitions alone, with no visible outlines separating them from background.

**Object rendering rules** (derived from Image 10):
1. Lighter gradient on the top/top-left of every object (simulates overhead cinematic light)
2. Deeper blue-teal on the bottom/right sides (shadow)
3. Electric cyan glow around edges of tech/mechanical elements
4. No hard outlines — objects defined by color gradient transitions only
5. Objects sit on dark rectangular ground-plane "islands" slightly darker than the background
6. Subtle drop shadows below the ground plane (dark blue, not black)

**Scale figures**: Tiny human silhouettes (approximately 5% of frame height) appear throughout to give sense of scale to larger objects. Monochromatic blue — slightly lighter or darker than background, visible but not distracting.

**Visual depth**: Cinematic depth created by size variation (closer = larger), overlapping elements, and background shifting from darker at edges to slightly lighter at center (volumetric underwater light quality).

**What to avoid**: No cartoonish proportions, no hard clip-art outlines, no flat vector without depth cues, no photorealistic textures.

---

## Layout Library Integration

When the Gemini Prompt skill generates an AI Brief, it routes to the correct Layout Library entry by topic type, then maps zones to atmospheric section descriptions.

**Topic type → Layout → AI Brief section names**:

| Topic Type | Layout | AI Brief Sections |
|---|---|---|
| Company Strategic Pivot | Comparison (three-panel) | LEFT — Pre-Pivot \| CENTER — Mechanism (PRIMARY) \| RIGHT — New Model |
| Before/After | Comparison (two-panel) | LEFT — Before \| RIGHT — After |
| How-It-Works / Process | Process Flow | STEP 1 → STEP 2 → STEP 3 → OUTCOME |
| Mechanism / Root Cause | Hub/Spoke | CENTER HUB + SURROUNDING NODES (3-5) |
| Strategic Framework | Framework (2x2) | TOP-LEFT — Q1 \| TOP-RIGHT — Q2 \| BOTTOM-LEFT — Q3 \| BOTTOM-RIGHT — Q4 |
| Data Story | Statistical | HERO STAT (dominant) + SUPPORTING STATS (3 smaller panels) |
| Timeline | Timeline | BAND 1 → BAND 2 → BAND 3 → BAND 4 (chronological) |
| Contrarian / Myth-Bust | Myth/Reality | LEFT — MYTH \| RIGHT — REALITY |

**Key constraint**: For AI image generation, all layouts reduce to maximum 3 structural sections. Complex layouts (Hub/Spoke with 6 nodes, Timeline with 7 events) are simplified to 3 primary visual areas for reliable rendering.

---

## AI Brief Rules (Structured Scene Format)

Every AI image brief must follow this structure. Full translation workflow in `.claude/skills/gemini-prompt/SKILL.md`.

### Prompt Structure (V2)

Every AI image prompt follows the Rules + Summary format:

```
Task: Create an infographic image for the summary below (after the rules).

Rules: Use the image attached as a reference on style, aesthetics,
colours, and illustration technique. Use a different layout for the
structure to elaborate details based on the summary. Do not use any
information or text from the attached image — only style. Use it only
for inspiration. Aspect ratio 1:1, resolution 2048×2048.

[NARRATIVE SUMMARY — 400-700 words of structured content prose]
```

The narrative summary is written by the `/content` skill in `content.md`.

### Text in AI Prompts

Text appears in the infographic as part of the narrative summary — Gemini renders callout labels and data points naturally from the content. No character limits. No maximum count. Rich contextual sentences produce better callout boxes than sparse number + label pairs.

**Still avoid in AI prompts**: `pt` `px` hex codes zone coordinates spec annotations

### Standard Negative Prompt Block
Include at the end of every AI image prompt:
```
NEGATIVE: text errors, garbled numbers, illegible text, white background,
grey background, photorealistic elements, maritime theme, ocean, underwater,
oil platform, submarine, cartoon style, cluttered layout, small unreadable
text, low contrast, spec annotations, font names, pixel values
```

Add **topic-specific negatives** after the standard block:
- Retail/brand infographics: add "store interior, retail shelving"
- Finance/banking: add "bank branch, teller, cash"
- Maritime/port topics: REMOVE ocean/underwater from negatives (those are correct content)
- Manufacturing: add "white collar office, suit, boardroom"

---

## Brand Lock System

The Brand Lock is the complete set of constraints applied at every generation session to maintain brand consistency. Imagen/Gemini has no memory across sessions — consistency is engineered through these constraints, not assumed.

### Five Components (all required, every session)

| # | Component | What it is | Applied when |
|---|---|---|---|
| 1 | Canonical Reference | `brand-anchor-v1.webp` uploaded to session | Start of every generation |
| 2 | Style DNA String | Fixed 65-word verbal description, verbatim | First line of every AI prompt |
| 3 | Text Protocol | Narrative summary format — rich sentences, no char limits | During content writing |
| 4 | Calibration Gate | 4-point post-generation check + render budget | After every render |
| 5 | Negative Prompts | Standard block + topic-specific additions | After CALLOUTS in every prompt |

### Calibration Gate (Component 4)

Run after EVERY render. Do not post without checking.

- [ ] **Background**: deep blue? (fail = white or grey background appeared)
- [ ] **Text**: readable, no spec annotations leaked? (fail = "13pt" or font name visible in image)
- [ ] **Numbers**: rendered correctly? (fail = digit garbling, e.g. "40444" for "40")
- [ ] **Layout**: sections visible and distinct? (fail = undifferentiated single scene)

**Render budget**: 2-3 generation attempts is normal and expected. If Attempt 1 fails 2+ checks:
1. Identify the specific failing element
2. Adjust ONLY that element (shorten callout, simplify scene description, remove problematic character)
3. Re-generate (Attempt 2)
4. Attempt 3 if needed — pick best passing render from all attempts
5. Log the failure as a Render Finding below

### Render Findings Log

Record failures here to improve Style DNA String and callout rules over time.

| Date | Failure mode | Element that failed | Fix applied | Result |
|---|---|---|---|---|
| — | — | — | — | — |

---

## Continuous Improvement Protocol

The brand reference evolves from Ecomobility's DNA toward your own infographics' DNA through a 4-phase loop.

| Phase | Reference | Quality Threshold | Action |
|---|---|---|---|
| **Phase 1** (now) | Image 10 — `brand-anchor-v1.webp` | — | Apply full Brand Lock every session |
| **Phase 2** | Best own infographic — `brand-anchor-v2.webp` | 5 renders pass Calibration Gate (3+/4 checks) | Review all 5. Select best. Save as v2. Update Component 1. |
| **Phase 3** | Pool of 2-3 best own infographics | 10-15 good renders from Phase 2 | Curate top 3. Use best as primary reference. |
| **Phase 4** | Fine-tuned Imagen (Vertex AI) | 20+ approved renders | Submit to Vertex AI fine-tuning. True model-level brand consistency. |

**How to promote Phase 1 → Phase 2**: After 5 renders pass Calibration Gate, evaluate all 5 on: (a) correct deep blue, (b) clean 3D illustration quality, (c) readable callouts, (d) correct section structure. Select highest-scoring render. Save to `references/brand-anchor-v2.webp`. Update version history table above.

---

## Semantic Icon Vocabulary

Consistent icon descriptions for use in AI brief section descriptions.

| Icon | AI prompt description | Semantic meaning |
|---|---|---|
| Upward arrow | "bright green upward arrow" | Growth, increase, positive |
| Downward arrow | "crimson red downward arrow" | Decline, risk |
| Checkmark | "green glowing checkmark" | Confirmed, competitive advantage |
| Barrier | "rising dark red wall" | Blocked, tariff, competitive threat |
| Globe | "blue globe with glowing trade route lines" | Global scope |
| Factory | "3D blue factory silhouette with smokestack" | Manufacturing, production |
| Building | "dark blue office tower" | Corporate, institutional |
| Clock | "blue clock face" | Time-sensitive, deadline |
| Lock | "dark blue padlock" | Constraint, protected |
| Scale figure | "tiny blue human figure at base" | Scale reference |
| Container/ship | "blue freight container or cargo ship silhouette" | Logistics, supply chain |
| Map pin | "bright cyan location pin" | Geographic specificity |

---

## Render Quality Gates

Checked after each Gemini render before selecting the final image:

1. Semantic colors applied correctly (green=positive, red=negative, amber=warning)
2. Illustration style consistent (soft 3D gradient — no flat vector mixed in)
3. No sources/citations in the infographic image (sources go in first comment)
4. Background is deep blue throughout (no white or light zones)
5. Breathing room: minimum 20% of frame area is background (no content overlay)

---

*Authoritative visual standard for Infographic Content Engine V1. Changes require version bump + rationale in relevant section.*
