---
name: 101
description: Use when the user runs /101 [topic-number or slug]. V4 Supply Chain 101 pipeline: qualify an audience decision problem, run sourced research, load Tiger provenance, draft three evidence-led openings, and produce one strong approved still through Visual Engine v2 plus motion when eligible.
---

# /101 Skill — Supply Chain 101 Pipeline

## Purpose
Turn a demonstrated supply-chain decision problem into a sourced, useful and recognisably Tiger explanation. The calendar supplies candidates only; the V4 weekly board decides what earns production.

## V4 Override — Read First

This section supersedes every conflicting legacy instruction later in this file.

1. Read `references/v4-audience-growth-operating-system.md`, the completed `content-brief-v2.md`, `research-brief.md`, `references/tiger-source-gate-v1.md`, and `tiger-source.md` when one is required.
2. Draft **three intentionally different evidence-led openings**, not ten mechanically different hooks. Personal reflection is unavailable unless an approved source ID supports it.
3. Follow Visual Engine v2: GPT Image 2 is the primary creative renderer; HTML/code-render is the exact-data and backup lane. Build one strong concept first. Create alternatives only to test meaningfully different visual arguments.
4. After still approval, Motion Engine v1 is the normal companion lane unless the eligibility gate records a still-only exception.
5. Do not use a fixed sign-off or compulsory paragraph pattern. The problem, proof, artifact and Tiger judgment determine the shape.
6. Every fact traces to `research-brief.md`; every personal, employer, result or credential claim traces to `tiger-source.md` or the approved Voice Bank.

The legacy ten-hook, three-code-render and code-render-primary sections below remain as historical production detail only. Ignore them whenever they conflict with this override.

## Invoke
```
/101 [topic-number]
```
Example: `/101 2` → generates hooks + caption + ChatGPT Image 2 prompt for Topic 2 (Supply Chain vs. Logistics)

## Prerequisites
- `references/101-plan.md` must exist (the 90-day content plan)
- `references/101-voice.md` must exist (101 voice anchor)
- `references/layout-frameworks-intelligence.md` (200-pattern layout selector + composition modes) and `references/render-pilot-workflow.md` (code-render pipeline + learnings) — for the visual
- `references/ai-still-prompt-learnings.md` — the GPT Image 2 backup-lane playbook (only when Step 4B is the chosen path)
- `renderer/` must exist (the HTML→PNG renderer + component-kit templates); `renderer/README.md` is the build playbook

## Output
```
data/{YYYY-W##}/{topic-slug}/101-copy.md
```

---

## Step 0: Research Engine (MANDATORY — runs first)

Before any hook or caption, run **`/research-engine 101 [topic-slug]`** (see
`.claude/skills/research-engine/SKILL.md`). It spawns the **research-analyst** agent
to build a consultant-grade, sourced, reliability-tagged brief and writes
`data/{YYYY-W##}/{topic-slug}/research-brief.md`.

- If a current `research-brief.md` already exists for the slug, reuse it.
- The brief is the source of truth for **every number on the card and in the caption** —
  the plan gives the angle, the brief gives the verified facts. Do not invent figures;
  if the brief couldn't verify something, don't put it on the card.
- Do not proceed to Step 2 until the brief clears the research-engine quality gate.
- Do not proceed to drafting until the source mode is recorded. If the post uses
  Tiger's experience, judgment, employer, results, or credentials, create and approve
  `data/{YYYY-W##}/{topic-slug}/tiger-source.md` first.

---

## Step 1: Load Inputs

1. Read the `research-brief.md` from Step 0 — this is the fact base.
2. Read `references/101-plan.md` — extract the row for the requested topic number
2. Read `references/101-voice.md` — load voice rules
3. Read `data/101-series-tracker.md` — check episode number and what was published last
4. Extract from the plan row:
   - Topic name
   - The Question It Answers
   - Hook direction
   - Visual Format
   - Caption Direction

---

## Step 2: Generate 3 Evidence-Led Openings

Select three meaningfully different patterns from this library. Do not complete the taxonomy for its own sake:

| # | Type | 101 Adaptation |
|---|---|---|
| 1 | Question-Why | Everyday question, not industry puzzle |
| 2 | Question-How | Frame around a familiar product or experience |
| 3 | Stat-Lead | Simple, surprising number — not a dense ratio |
| 4 | Contrarian | Challenge a common assumption non-practitioners hold |
| 5 | Paradox | Relatable contradiction, not a mechanism chain |
| 6 | Personal-Reflection | Available only when the statement maps to an approved Tiger source ID; never invent repeated questions or experience |
| 7 | Result-First | Start with a visible outcome, then explain |
| 8 | Timeline-Shock | Trace a product journey as a timeline |
| 9 | Comparison-Gap | Two things people think are the same, shown as different |
| 10 | Decision-Pressure | Question the reader can ask in their own workplace |

**Rules:**
- Use the plan's Hook direction as inspiration for the strongest option
- Each hook opens with a DIFFERENT first word
- Each hook uses a DIFFERENT structural device
- No em dashes. Use periods.
- No AI slop language
- Write as Tiger would say it out loud
- Plain language — a non-practitioner should understand every hook
- Bullet points use • not -

---

## Step 3: Write LinkedIn Caption

Follow the 101 post structure (from `references/101-voice.md`):

1. **Hook** (1–2 sentences) — use selected hook verbatim
2. **Series Frame** (1–2 sentences) — position in SC 101 series, reference previous episode by number and topic
3. **Core Explanation** (2–3 sentences) — the concept in plain language, builds through reasoning
4. **Bullets** (2–4) — one sentence each unless content genuinely requires two. No bold headers inside bullets. Vary structure — not every bullet needs the same format.
5. **Opinion / Reframe** (1–2 sentences) — use Tiger's bridges: "What I believe is...", "My view on this is...", "Here's the thing most people miss..."
6. **CTA Question** — single open question, accessible to non-practitioners
7. **Sign-off + Hashtags**

**Use the Caption Direction from the plan** as the guide for framing and closing question.

**Voice rules — calibrate against published Ep3–22 before presenting:**
- **150–220 words total.** Published episodes average 180 words. Over 220 = over-explanation, recut.
- Sentences connect ideas with reasoning: "because", "so", "which means", "and that's"
- Bullets: one sentence each. Vary length and structure across them — not uniform.
- No bold labels inside bullet text ("**Quality**:", "**Delivery**:") — the bullet itself carries the label
- Plain language. No em dashes. No ANCHORS labels. No citation format.
- Bullet points use • not - (applies to all output: captions, hook options, ChatGPT Image 2 prompt content lists)
- At least one opinion bridge from Tiger's set — rotate, never repeat the same one twice in a row
- One moment that sounds like Tiger thinking out loud — slightly imperfect, first-person where natural
- Ending: choose a specific question, action, caveat, or invitation only when it earns its place; do not repeat a fixed sign-off.
- Hashtags: #ShettysDesk #SupplyChainIntelligence #SCM #SupplyChain101 + 1 topic-specific tag

---

## Legacy Step 4 Reference: Code-Render Control Lane

> Do not execute this legacy section by default. Follow `references/visual-engine-v2.md` and the V4 override above. Use the material below only when the approved content brief explicitly requires an HTML exact-data control or when reproducing a historic code-render artifact.

**The 101 visual is built deterministically in `renderer/` (HTML→PNG)** — same component kit + brand frame as AI for SC, with two 101 differences: **no AI-tool logo** (101 has no tool mark) and the accessible 101 register. Data and text are computed in code, never painted by an image model, so numbers are exact and the brand is locked.

> **The variety rule (2026-06-28): render 3 visually distinct concepts for EVERY post, then present all 3 for the user to pick one.** This guarantees range across the feed — each post offers three genuinely different frameworks and the chosen visual is never a lazy default. The 3 must differ from **each other** in layout framework AND dominant visual device — three different skeletons, not three colour swaps of one idea. The ChatGPT (GPT Image 2) prompt in Step 4B stays the **backup** path.

### 4.1 Select 3 distinct layouts + composition modes (`layout-select`)
- Name the **shape of the idea** (comparison · funnel · hierarchy · part-to-whole · hidden cost · sequence · single number · slope · radar · cycle · anatomy · …).
- Run `layout-select`, which returns **3 distinct layout frameworks**, each arguing the point a different way. Example (contract-clauses): (1) a slope/bump crossing (#71), (2) an integrated clause-map hero (Mode A), (3) a part-to-whole or 2×2 cut. Each variant gets its own composition mode (A integrated / B layered) and its own dominant hero device.
- **Distinctness rule:** the 3 must use 3 different benchmark patterns and 3 different hero devices — no two share the same skeleton. Reserve still-unused patterns for future posts on the topic.

### 4.2 Build + render all 3 variants
- **Read `references/premium-visual-craft.md` first** — the craft layer (Orion design tokens, the data-journalism house style, consulting slide-craft, chart-styling recipes). Every variant applies it: title-as-a-claim, one accent + ghost the rest, direct labels, the source/footrule band, the Orion stat-card cadence for any hero number, tinted two-layer shadows + hairline borders + concentric radii. A right-shape render with generic styling still looks generic.
- Skim `renderer/README.md` (esp. §3 brand kit, §6/§6b 3D, §7 layout laws) and a reference template (`renderer/templates/sc101-quote-iso-towers.html`). Build a self-contained template **per variant**: `renderer/templates/sc101-[topic-slug]-v1.html`, `-v2.html`, `-v3.html` — each **one bespoke concept on the homogeneous Shetty's Desk frame**, never a `{{token}}` fill-in, never a recolour of a sibling.
- Brand frame (all 3): azure + eco-green + ink + Poppins, luminous on WHITE, flat; coral = caution/cost only. **No AI-tool logo.** Footrule-above-row footer — **Shetty's Desk Logo 2** (`assets/logos/shettys-desk-logo-2.png`, dark-wordmark lockup, ~74px, carries the wordmark so **no separate text label**) on the LEFT + **"Poornajith Shetty"** signature on the RIGHT. (Never Logo 1 — white wordmark, invisible on white.) Every number hard-coded from the research brief.
- For real 3D depth use **JS `clip-path` isometry**, not CSS 3D transforms (README §6b). Harvey balls via `conic-gradient`.
- Render each (always absolute path — cwd drifts):
  `CHROME_PATH=… NODE_PATH=$(npm root -g) node render.mjs templates/sc101-[slug]-vN.html out/sc101-[slug]-vN.png`
  then **QA each PNG** against `renderer/README.md` §9 + `render-pilot-workflow.md` §2/§2b, and iterate (≈2 passes per variant). **All 3 must clear the QA bar before presenting** — don't ship a weak third just to hit the count; if a framework genuinely won't work for the topic, swap it for the next-best distinct pattern rather than presenting a dud.

### 4.3 Select + save
- Present all 3 (Step 5). After the user picks one, copy **that** render to `data/{YYYY-W##}/{topic-slug}/visual.png`. Keep all 3 template files and the 3 `out/sc101-[slug]-vN.png` — the unused two are the variety log and the seed for future posts on the topic.

### 4.4 (Optional) motion
After the still is approved, a GIF/MP4 version can be produced via `render-anim.mjs` only when sequence carries meaning (rare for 101). A still PNG is the default.

---

## Legacy Step 4B Reference: Superseded Image-Prompt Workflow

> Do not use the Nano Banana or Higgsfield instructions below for new V4 work. The active primary lane is `references/visual-engine-v2.md`; this section is preserved only as historical prompt-learning context.

Generate this **as a fallback** and keep it in `101-copy.md` — use it instead of the code-render only when the concept is purely illustrative/metaphorical with no load-bearing structure (or when a render isn't feasible in-session).

> **Read `references/ai-still-prompt-learnings.md` — §8 FIRST — before writing this prompt.** §8 is the current operative spec (Nano Banana Pro + viral scaffold + anchor & real logo + batch of 3); §0–§7 are the foundational learnings (framework-first selection, info-design-not-cinematography register, egress constraint). The rules below are the short form of §8.

**Image tool: Nano Banana Pro via the Higgsfield MCP** (`generate_image`, model `nano_banana_pro` — remaps to `nano_banana_2` in job records, expected). Run a **batch of 3** (`count: 3`) and let the user pick one. **Default aspect/resolution: `3:4`, `2k`** (and write `resolution 2480x3312` into the prompt text). Never use 1k — on-image text goes soft.

**References (attach two, logo LAST):** (1) the **single original brand anchor** `brand-anchor-v1.webp` (media `1d05cd74-…`), **style-only** with a hard "take nothing from it" rule; (2) the **real Shetty's Desk logo** (media `7c3fc954-…`), **reproduce exactly, bottom-left** — it must be **transparent/no background** (`remove_background` it first if needed). Media IDs + rationale in learnings §8.2.

**Register — design-forward, not cinematic.** Frame it as *"a clean, modern, design-forward infographic / an information-design graphic like the FT or Economist"*: flat or flat-dimensional, even clean illumination, flat-on, **no camera angle, no dramatic lighting, no scene, no photography.** Mark standouts **by design** (a grid, a crack, a tag, a colour accent), not by light. "More dramatic / less AI-like" from the user means *conceptually sharper and cleaner*, never cinematography.

Use this template structure. The VISUAL ANCHOR block is mandatory — it is what makes each infographic visually distinctive. Without it, the output is structurally correct but visually generic.

**VISUAL ANCHOR rules:**
- 3–5 sentences only. Placed between THE QUESTION THIS ANSWERS and VISUAL STRUCTURE.
- Describes one dominant **design-forward** metaphor with spatial specificity — how the layout is composed flat-on, what flat-dimensional quality it has, what the focal element is, where the eye goes first. No camera/lighting/mood language.
- Names the single most important element on the canvas (the one point of tension — marked by design, not by light).
- This block is what separates a visually striking render from a generic one. Never skip it.

```
Task: Create a clean, modern, design-forward infographic for the summary below (after the rules).

Rules: Use the attached images as style references — follow them for style, colours and illustration technique, not their subject matter. The last image is the Shetty's Desk logo; reproduce it as given and place it small in the bottom-left corner. Aspect ratio 3:4.

TOPIC: [Topic name]
THE QUESTION THIS ANSWERS: [The Question It Answers from the plan — verbatim]

VISUAL ANCHOR: [3–5 sentences. Name the dominant design-forward metaphor — how the layout is composed flat-on, what flat-dimensional quality it has, what the single focal element is, where the eye goes first. No camera, lighting, or mood language. No concept explanation.]

VISUAL STRUCTURE: [1–2 sentences describing the dominant layout — taken from the Visual Format in the plan. Name the spatial logic: what is on the left/right/top/bottom/centre, what the focal point is. Flat-on, even illumination.]

CONTENT TO INCLUDE ON THE IMAGE:
- Heading: "[Short heading, max 8 words]" (Bold)
- [Named section or element 1 — use spatial labels: LEFT SIDE / RIGHT SIDE / TOP / CENTRE / etc.]:
  - [Label]: [2–3 word value or short phrase — not sentences]
  - [Label]: [2–3 word value or short phrase]
- [Named section or element 2]:
  - [Label]: [2–3 word value]
  - [Label]: [2–3 word value]
- [Annotation line — carries the opinion from the caption. One sentence, specific.]

DESIGN: crisp flat-design infographic, generous whitespace, strong alignment grid, bold legible sans-serif, max 2 font families. Restrained palette: deep navy + azure base, ONE coral accent reserved for the single caution/focal element only. Even, flat, front-facing — no camera angle, no dramatic lighting, no 3D scene. Every word legible at phone size; data labels preferred over paragraph text.
```

**DO-NOT blocks:** on **Nano Banana Pro**, exactly **one technical** `DO NOT` is allowed and is part of the viral recipe — the font floor (≤14px). Do **not** add style-negatives or a list. **If this prompt is ever ported to GPT Image 2, drop the DO-NOT entirely** — negative blocks degrade that engine (CLAUDE.md hard rule). Otherwise phrase constraints positively. **No colour prescription** — the anchor governs palette. Populate from the plan's Visual Format and Caption Direction. Keep the content list tight (only what must appear on the image) and honour the on-image word cap (~45). Total prompt length: 40–55 lines maximum.

---

## Step 5: Present Everything for Selection

Present all outputs in one block:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SUPPLY CHAIN 101 — TOPIC [#]: [Topic Name]
 Episode [N] · Series: Supply Chain 101
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10 HOOK OPTIONS:
1.  [Question-Why]:        "[text]"
2.  [Question-How]:        "[text]"
3.  [Stat-Lead]:           "[text]"
4.  [Contrarian]:          "[text]"
5.  [Paradox]:             "[text]"
6.  [Personal-Reflection]: "[text]"
7.  [Result-First]:        "[text]"
8.  [Timeline-Shock]:      "[text]"
9.  [Comparison-Gap]:      "[text]"
10. [Decision-Pressure]:   "[text]"

LINKEDIN CAPTION (using hook [#] as placeholder):
[full caption]

3 RENDERED INFOGRAPHIC VARIANTS (primary — pick 1):
 V1 · [framework / hero device]:  renderer/out/sc101-[slug]-v1.png
 V2 · [framework / hero device]:  renderer/out/sc101-[slug]-v2.png
 V3 · [framework / hero device]:  renderer/out/sc101-[slug]-v3.png
(send all 3 PNGs to the user; one-line what makes each distinct)

CHATGPT IMAGE 2 PROMPT (backup, paste-ready):
[full prompt]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pick a hook (1-10) AND a visual variant (V1/V2/V3),
adjust caption if needed, then confirm to save.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Surface all 3 renders to the user** (e.g. via the file-send tool) so the choice is visual, not described.

---

## Step 6: Save

After user confirms hook selection, **visual-variant choice**, and any adjustments:

1. Write `data/{YYYY-W##}/{topic-slug}/101-copy.md` with:
   - Selected hook
   - Final caption
   - Three tested opening options with their experiment rationale and source IDs
   - Visual Spec — the 3 variants offered (framework + hero device each) and **which variant was chosen**, plus the chosen template + `visual.png` path
   - ChatGPT Image 2 prompt (backup)
2. Copy the **chosen** variant's render to `data/{YYYY-W##}/{topic-slug}/visual.png`. Keep all 3 `renderer/templates/sc101-[slug]-vN.html` and `renderer/out/sc101-[slug]-vN.png` on disk (variety log + future-post seed).
3. Update `data/101-series-tracker.md` with the new entry (note the chosen framework in the Hook Type / notes column so the feed's range is traceable)

---

## Output File Structure

```markdown
# 101 Copy — [topic-slug]
**Week**: [YYYY-W##]
**Topic**: #[number] — [Topic Name]
**Episode**: [N]
**Series**: Supply Chain 101

---

## Selected Hook
**Type**: [hook type]
**Text**: [full hook text]

## LinkedIn Caption
[full caption with selected hook swapped in]

## Opening Options — Three Tested
1. [pattern + hypothesis + source IDs]: [text]
2. [pattern + hypothesis + source IDs]: [text]
3. [pattern + hypothesis + source IDs]: [text]

---

## Visual Spec (layout-select) — 3 variants offered
- Shape of the idea · the 3 distinct frameworks rendered (V1/V2/V3 — pattern + hero device + composition mode each) · feasibility · benchmark #(s) used.
- **Chosen variant:** Vn — [framework] — why it won.

## Code-render visual (primary)
- V1 `renderer/templates/sc101-[slug]-v1.html` → `out/sc101-[slug]-v1.png` — [concept]
- V2 `renderer/templates/sc101-[slug]-v2.html` → `out/sc101-[slug]-v2.png` — [concept]
- V3 `renderer/templates/sc101-[slug]-v3.html` → `out/sc101-[slug]-v3.png` — [concept]
- **Chosen → `visual.png`:** V[n] (`sc101-[slug]-v[n].png`).

## ChatGPT Image 2 Prompt (backup, paste-ready)
[full ChatGPT Image 2 prompt — illustration fallback]
```

---

## Quality Check (run before presenting)

- [ ] **`research-brief.md` exists, cleared the research-engine gate, and every on-card / in-caption number traces to a sourced fact in it (none invented)?**
- [ ] Three openings test meaningfully different arguments or audience recognition cues?
- [ ] Any personal opening maps to an approved Tiger source ID?
- [ ] Caption follows 101 post structure (hook, series frame, explanation, 3 bullets, reframe, CTA, sign-off)?
- [ ] Caption is 150–300 words?
- [ ] No em dashes, no AI slop, no ANCHORS labels, no citation format?
- [ ] CTA is an open question accessible to non-practitioners?
- [ ] Sign-off includes "Follow Poornajith Shetty" + save prompt?
- [ ] **Visual: `layout-select` returned 3 DISTINCT frameworks (3 different benchmark patterns + 3 different hero devices — not recolours of one idea)?**
- [ ] **Visual: all 3 variants code-rendered on the brand frame, NO AI-tool logo, every number hard-coded; each PNG QA'd against README §9; all 3 surfaced to the user to pick from?**
- [ ] **Visual: real 3D (if used) via JS clip-path isometry, not CSS 3D transforms; footrule-above-row footer (Shetty's Desk Logo 2 left + "Poornajith Shetty" signature right — never Logo 1); each canvas filled (no dead whitespace / heavy border)?**
- [ ] **Visual: chosen variant copied to `visual.png`; all 3 templates + 3 out PNGs kept on disk?**
- [ ] ChatGPT Image 2 prompt (backup) present and uses the plan's visual format + brand anchor?
- [ ] A non-practitioner could read the caption over coffee and understand the concept?

---

## Token Budget
~14–20K tokens per run (the visual step now builds + QAs **3 distinct renders**, not one). Reads 101-plan.md, 101-voice.md, 101-series-tracker.md, plus the visual references (layout-frameworks-intelligence.md, render-pilot-workflow.md, renderer/README.md + a reference template) and iterates on each of the 3 variants. No source library, no deep-dive references.
