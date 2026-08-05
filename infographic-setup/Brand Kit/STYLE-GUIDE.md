# Shetty's Desk — Brand Kit & Infographic Style Guide (Historical V3/V5 Reference)

> **V4 reset notice:** Operating Studio is preserved as historical design material, not an active
> default. Use `../references/creative-review/signature-system-v1.md` for new V4 work.

A reusable visual system for LinkedIn infographics and precision artifacts. The DNA is extracted
from a polished isometric infographic reference set and generalized so it applies to **any topic**
— business, tech, career, data, ideas — not just the original subject.

Use this file as the human-readable guide. For machine use (Claude Code), pair it with `brand-tokens.json`. For image models, use `PROMPT-LIBRARY.txt` and the visual one-pager `Shettys-Desk-Brand-Kit.pdf`.

> **V5 standard-post override:** a normal LinkedIn post is one image-engine-native **Instrumented
> Operating Explanation**, not an assembled infographic. Start with the reader's live tension, choose
> one rendered operating system—an instrumented decision board, causal atlas, paired-state rig, or a
> **Commitment Object** when an irreversible boundary must be felt—and render one composition. Never
> paste an HTML/SVG, dashboard, title, footer, or logo overlay
> over that final scene. The current authority is
> `../references/brand-kits/shettys-desk-operating-studio/FRAME.md`. The modular rules below are
> retained for explicit carousels and exact artifacts.

---

## 1. Brand Essence

Optimistic, science-led, credible, modern. Clean and airy, built on luminous blue gradients with a vivid **signature green** that always signals *positive / progress / the smart choice*. Data-driven but human. The precision-artifact expression uses smooth isometric 2.5D vector art on white; the standard V5 post uses a tangible or diagrammatic premium Operating Studio **Instrumented Operating Explanation**. A **Commitment Object** is the high-tension subgrammar for a decision that has an irreversible boundary and must be felt before it is explained.

Three cues make the precision-artifact expression recognizable:

1. **The signature green→blue gradient** on the positive/highlight element.
2. **Flat isometric 2.5D illustration** with soft long shadows on pure white.
3. **Mixed-weight stat callouts** — a huge bold number beside light supporting words.

---

## 1b. Logo

The Shetty's Desk mark: a **hand-textured chalk ring** above a serif *Shetty's* wordmark with italic *DESK*. It is deliberately organic and warm — a counterpoint to the clean isometric content style.

| Variant | File | Use |
|---|---|---|
| **Primary** (terracotta + white) | `logos/1.png` | Default — avatar, profile, covers, watermarks on dark |
| Duotone (terracotta + olive) | `logos/2.png` | Warm editorial contexts on dark |
| Mono white | `logos/3.png` | Single-color on dark or saturated surfaces (incl. Navy `#1939A5`) |
| Mono olive | `logos/4.png` | Single-color on light/cream surfaces; print |

**Logo colors:** Terracotta `#D97656` · Olive `#3C3828` · White `#FFFFFF`. All four files are **800×800 transparent PNGs** — they sit on any surface; a dark canvas (`#000000` / Navy `#1939A5`) shows them best.

**The two-layer rule:** the logo palette is the **identity layer** (terracotta/olive, textured, serif, dark canvas); the azure/eco-green system is the **content layer** (the operating world and its semantic decisions). Flat isometric on white is one precision-artifact expression, not the rule for every native scene. Keep the layers separate. A small exact logo may be used on an approved carousel or separate exact artifact; a standard native scene relies on the profile and caption unless the owned mark can be built into the render without an overlay. Never recolor, stretch, outline, or add effects to the mark.

## 2. Color Palette

Blues carry the system. Green and coral are **meaning-bearing** — use them deliberately, never decoratively.

### Primary — Blues

| Token | HEX | Role |
|---|---|---|
| Azure | `#2798FB` | Primary brand blue — the hero color |
| Sky | `#50A9F7` | Lighter primary, highlights |
| Royal | `#247BE1` | Mid-tone, secondary fills |
| Deep | `#215DC3` | Headlines on light, depth |
| Navy | `#1939A5` | Darkest blue — strong contrast, footers |

### Accents — meaning-bearing

| Token | HEX | Role |
|---|---|---|
| **Eco Green** | `#38E6A6` | **SIGNATURE** — positive / progress / highlight / smart choice |
| Mint | `#8FF3CC` | Light end of the signature green gradient |
| Coral | `#E27199` | Negative / warning / the costly or old way (sparingly) |

### Light tints — backgrounds, fills, depth

| Token | HEX | Role |
|---|---|---|
| Tint 100 | `#E2F0FB` | Page & card backgrounds |
| Tint 200 | `#C5E2F8` | Fills, dividers |
| Tint 300 | `#A6D1F8` | Depth, secondary fills |
| Tint 400 | `#7CBAF6` | Stronger tint, shadows |

### Neutrals — text & structure

| Token | HEX | Role |
|---|---|---|
| Ink | `#15315C` | Primary text |
| Muted | `#5D7599` | Body / captions |
| Line | `#DCEAF8` | Borders, rules |
| White | `#FFFFFF` | Canvas — always the background |

### Color semantics (do not break these)

- **Blue** = the world, the system, infrastructure, neutral subject matter.
- **Green** = positive, progress, growth, the recommended choice, highlighted data.
- **Coral** = negative, warning, cost, friction, the old/inferior way. Used sparingly.

---

## 3. Signature Gradients

The gradients are the heart of the look.

| Gradient | CSS | Use |
|---|---|---|
| Blue | `linear-gradient(135deg,#50A9F7 0%,#215DC3 55%,#1939A5 100%)` | Infrastructure, scenes, UI, hero panels |
| **Eco ★** | `linear-gradient(135deg,#8FF3CC 0%,#38E6A6 45%,#2798FB 100%)` | **Signature** — the positive/progress element in every graphic |
| Tint wash | `linear-gradient(135deg,#E2F0FB,#A6D1F8)` | Section backgrounds, cards |

> The **Eco gradient** is the single most distinctive brand asset. It should appear in nearly every infographic, on whatever element represents the win.

---

## 4. Typography

A single geometric sans across the system. The reference uses a Gotham/Montserrat-style face; **Poppins** (free, Google Fonts) is the recommended substitute. Montserrat is an equally good alternative.

| Role | Spec |
|---|---|
| Section header | Poppins 800 · UPPERCASE · tracking +0.6px · 23–40px |
| Item / icon label | Poppins 700 · Title Case · 16–22px |
| Body | Poppins 300–400 · `#5D7599` · 13–15px |
| Stat number | Poppins 800 · 40–90px · green if positive, deep blue if neutral |
| Stat caption | Poppins 300 · UPPERCASE · 14–18px |

**Signature move:** the mixed-weight stat callout — a huge 800-weight number beside small 300-weight uppercase words, e.g. **97%** `OF THE TIME`.

---

## 5. Illustration & Iconography

The brand has two deliberate visual modes. A standard native feed post uses an **Instrumented Operating Explanation**: a tangible or diagrammatic operating system whose visible inputs, causal path, decision boundary, and saveable rule make the work legible. A tactile **Commitment Object** is its high-tension subgrammar when an irreversible decision boundary must become physically clear. An explicitly selected carousel or exact artifact uses flat-design **isometric / 2.5D vector** art: smooth blue gradients, soft long shadows, rounded geometric forms, gentle glows, pure-white background.

**Do — standard native feed scene**

- Start with one instrumented operating explanation: an instrumented decision board, causal atlas, paired-state rig, or another coherent operating system. Use a Commitment Object when the work has a point of no return: a release gate, lock, fence, timing rig, allocation boundary, or capacity slot.
- Make every visible pressure act on the same operating system; the recommendation must be legible from its causal path, its boundary, or what can pass, stop, lock, or release.
- Use tactile studio materials — brushed aluminium, cobalt anodising, clear acrylic — without drifting into generic warehouse stock photography.
- Keep any in-image words short and physically integral to the scene.

**Do — precision artifact / carousel**

- Isometric or front-flat vector with smooth gradient fills
- Pure white / very light blue background
- Signature green gradient reserved for the positive/highlight element
- Soft, diffused long shadows (never harsh or black)
- Friendly mini-figures + green rounded speech bubbles for a human touch
- Generous negative space; one clear focal object

**Don't — in either mode**

- No generic stock logistics photography or disconnected decorative props
- No hard black outlines or hand-drawn sketch look
- No dark or busy backgrounds
- Don't use green for anything negative/costly
- No harsh or black drop shadows
- Avoid clutter — keep it editorial and airy

**Generalized motifs** (swap the original subject for yours): release gates, timing rigs, capacity slots, allocation locks, route rails, loaded carriers, isometric laptops/phones/dashboards, charts & growth arrows, people at work, city blocks, connected nodes & dashed paths, map pins & number badges, green speech bubbles, lightbulbs/gears/targets, globe.

> The reference images in `/reference-images` show the original subject (EVs/energy). **Attach them for the *art style*, not the content** — tell the model "match this rendering style, not the subject."

---

## 6. Carousel and precision-artifact layout system

Reusable module anatomy — combine these blocks for any infographic:

1. **Pin header** — a number/topic badge + UPPERCASE title, underlined by a thin azure rule that fades right.
2. **Intro + character** — a short light-weight paragraph paired with a mini-figure and a green speech bubble holding a topic icon.
3. **Concept row** — 3–4 isometric icons, each with a bold label + 1-line caption. The workhorse module.
4. **Hero scene** — one large isometric illustration as the centerpiece, lots of white around it.
5. **Stat callout** — an oversized mixed-weight number (green = positive, coral = negative) + short caption.
6. **Sources footer** — centered small blue "Sources:" list. Citing data is part of the brand's credibility.

### LinkedIn output formats

| Format | Pixels | Ratio | Use |
|---|---|---|---|
| Square | 1080×1080 | 1:1 | Standard single feed post |
| **Portrait** | 1080×1350 | 4:5 | Max feed real estate (**recommended default**) |
| Carousel slide | 1080×1350 | 4:5 | PDF/document carousel |
| Banner | 1584×396 | 4:1 | Profile / article banner |
| Story / long-scroll | 1080×1920 | 9:16 | Vertical |

---

## 7. How to Generate (3 tools)

The same DNA, fed the way each tool prefers:

**Gemini — Nano Banana Pro** → attach 1–2 reference images + paste the Gemini prompt from `PROMPT-LIBRARY.txt`. Strong at reference-image consistency and in-image text. Or drag in the one-page PDF as the style reference.

**ChatGPT Image 2** → for a standard feed post, lead with the V5 Native Scene block and its chosen Instrumented Operating Explanation, not a generic style label. Use a Commitment Object only when the decision has an irreversible boundary. For a carousel or exact artifact, lead with "flat-design isometric vector infographic, pure white background." Reuse the appropriate style block within its visual mode. Drag in the relevant reference image too.

**Claude Code** → for a standard post, use the Operating Studio frame and a native image-engine prompt. It may use the tokens to build an editable HTML/SVG only when a separate exact artifact or carousel has been explicitly selected.

**Standard workflow:** choose one reader tension → one physical or visual mechanism → one native image-engine composition → five-reader check. The visual family can vary with the argument; the palette and colour meanings maintain ownership.

**Precision-artifact workflow:** generate each *module* separately on a white background → assemble in the layout anatomy. Use this only when the reader needs an exact controlled artifact, not as a default feed-image finish.

---

*Shetty's Desk — Brand Kit. Visual DNA derived from an isometric infographic reference set and generalized for reuse.*
