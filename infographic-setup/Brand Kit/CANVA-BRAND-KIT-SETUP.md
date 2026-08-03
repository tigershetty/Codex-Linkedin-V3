# Shetty's Desk → Canva Brand Kit — Setup Sheet

The Canva connector can read Brand Kits but **cannot create the native Brand Kit object** (colors / fonts / logo / guidelines) — that's UI-only. This sheet makes building it a copy-paste job. Everything below is pre-formatted to drop straight into Canva's **Brand Hub → Brand Kits → + Add new**.

> Brand voice / written guidelines and multiple color palettes require **Canva Pro or Teams** (Brand Hub). Free accounts get one color palette + brand fonts.

---

## STEP 1 — Create the kit

1. Open Canva → left sidebar **Brand** (Brand Hub) → **Brand Kits** → **+ Add new**.
2. Name it: **Shetty's Desk**.

---

## STEP 2 — Add brand colors

In the Brand Kit, under **Brand Colors**, click **+ Add** (create a palette/group per section below). Click each swatch → paste the HEX (without the # if Canva omits it) → rename the swatch.

### Palette: Primary Blues
| Name | HEX |
|---|---|
| Azure (primary) | `2798FB` |
| Sky | `50A9F7` |
| Royal | `247BE1` |
| Deep | `215DC3` |
| Navy | `1939A5` |

### Palette: Accents
| Name | HEX |
|---|---|
| Eco Green (signature) | `38E6A6` |
| Mint | `8FF3CC` |
| Coral (alert) | `E27199` |

### Palette: Tints
| Name | HEX |
|---|---|
| Tint 100 | `E2F0FB` |
| Tint 200 | `C5E2F8` |
| Tint 300 | `A6D1F8` |
| Tint 400 | `7CBAF6` |

### Palette: Neutrals
| Name | HEX |
|---|---|
| Ink (text) | `15315C` |
| Muted (body) | `5D7599` |
| Line | `DCEAF8` |
| White (canvas) | `FFFFFF` |

**Quick-paste list (all 16):**
`2798FB, 50A9F7, 247BE1, 215DC3, 1939A5, 38E6A6, 8FF3CC, E27199, E2F0FB, C5E2F8, A6D1F8, 7CBAF6, 15315C, 5D7599, DCEAF8, FFFFFF`

---

## STEP 3 — Add brand fonts

Under **Brand Fonts**, set:

- **Heading font:** Poppins — style **ExtraBold (800)**, UPPERCASE, letter-spacing +0.6.
- **Subheading font:** Poppins — **Bold (700)**, Title Case.
- **Body font:** Poppins — **Light (300) / Regular (400)**, color Muted `#5D7599`.

(Poppins is in Canva's font library. Montserrat is an acceptable alternative.)

---

## STEP 4 — Add the logos

Under **Brand Logos**, upload the four files from `logos/`:

| Variant | File |
|---|---|
| Primary (terracotta + white) | `1.png` |
| Duotone (terracotta + olive) | `2.png` |
| Mono white | `3.png` |
| Mono olive | `4.png` |

Logo colors: Terracotta `#D97656` · Olive `#3C3828` — the **identity layer**, kept separate from the azure/eco content palette.

---

## STEP 5 — Add Brand Guidelines (Pro/Teams)

In Brand Hub → **Brand Guidelines** (or add a "Guidelines" note in the kit), paste the blocks below. This is the "how to create new things" layer.

### Brand essence
Optimistic, credible, modern, data-driven and human. Clean white space, luminous blue gradients, and a vivid green that always signals the protected or positive path. Precision artifacts use smooth isometric 2.5D vector art; standard native feed scenes use a tactile Operating Studio Commitment Object when the reader needs to see a decision boundary.

### Color meaning (the rule that creates consistency)
- **Blue** = the system / neutral subject matter.
- **Green** = positive, progress, the smart choice, the highlighted win. Reserve for ONE element per graphic.
- **Coral** = negative, cost, the old way. Use sparingly.
- The signature **eco-gradient** (`#8FF3CC → #38E6A6 → #2798FB`) lands on the win.

### Typography
Poppins throughout. Headers 800 UPPERCASE; body 300–400. Signature move: an oversized bold number beside a small light uppercase caption (e.g. **97%** OF THE TIME).

### Illustration style
For precision artifacts: flat-design isometric / 2.5D vector with smooth blue gradients, soft long shadows, rounded forms, pure white background, and generous white space. For standard native feed scenes: allow tactile studio realism—brushed aluminium, cobalt structure, clear acrylic, and visible causal mechanics—but never generic logistics stock photography, dashboards, or overlays. Never put green on a negative element.

### Precision-artifact layout modules
Pin header → intro + character → concept row (3–4 icons) → hero scene → stat callout → sources footer.

> **V5 standard-post route:** a normal LinkedIn feed post is one native Operating Studio scene,
> not a Canva assembly. Start with a live reader tension and one physical mechanism; use Canva
> modules only for an explicitly selected carousel or exact artifact.

### LinkedIn formats
Portrait 1080×1350 (4:5, default) · Square 1080×1080 · Carousel 1080×1350 · Banner 1584×396 · Story 1080×1920. Keep ~6% safe margins; export at 2×.

---

## STEP 6 — How to create new documents/files WITH this kit

**A. New on-brand Canva design**
1. Create any design (e.g. **1080×1350** for a LinkedIn post).
2. In the editor, open the **Brand** tab → your colors and fonts are one click away. Apply **Brand Kit** to recolor/retype quickly.
3. For a carousel or exact artifact, build with the layout modules above; set background to White
   `#FFFFFF`. Do not use this as a finishing layer over a native feed scene.

**B. Reusable templates**
After designing a cover/interior you like, **… menu → Create a brand template** so the whole series starts from it (these *can* be created from designs).

**C. AI-generated illustrations (Gemini / ChatGPT Image 2 / Claude Code)**
For a standard feed post, use the V5 Native Scene block in `PROMPT-LIBRARY.txt`; render one
coherent composition and do not assemble overlays. For a carousel or exact artifact, use the precision-artifact
style block + module templates, then place the modules into the Canva design.

---

## STEP 7 — Apply it via the connector (what I *can* automate)

Once the Brand Kit exists, I can:
- **Generate on-brand designs** that reference it (I'll pass its brand-kit ID).
- **Create & publish brand templates** from a design you approve.
- **Export** any design to PDF/PNG/PPTX.

Just tell me, after you've created "Shetty's Desk", and I'll pick it up by ID.

---

*Companion files: brand-tokens.json · STYLE-GUIDE.md · PROMPT-LIBRARY.txt · Shettys-Desk-Brand-Kit-DETAILED.pdf*
