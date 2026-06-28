---
name: 101
description: Use when the user runs /101 [topic-number or slug]. Supply Chain 101 pipeline. Runs the research-engine FIRST to build a consultant-grade sourced research brief, then takes the topic from the plan and generates 10 hook options + LinkedIn caption + 3 DISTINCT code-rendered infographic variants (renderer/, HTML→PNG) for the user to pick one. The ChatGPT Image 2 prompt is kept as a backup visual path. No control gates.
---

# /101 Skill — Supply Chain 101 Pipeline

## Purpose
Pipeline for the Supply Chain 101 series. Takes a topic from the plan, **runs the research-engine first** (mandatory consultant-grade, sourced research brief — see Step 0), then generates 10 hook options + LinkedIn caption + **3 distinct code-rendered infographic variants** (`renderer/`, HTML→PNG) for the user to pick one. No control gates. User picks the hook and the visual variant at the end. The research brief is what lets the cards carry real, sourced numbers instead of the plan's generic framing.

**Visual path (changed 2026-06-21):** 101 is now **code-render primary** — the infographic is built deterministically in `renderer/` (same kit + brand frame as AI for SC, but **no AI-tool logo** and the accessible 101 register). The **ChatGPT (GPT Image 2) prompt is the backup** path, kept in `101-copy.md` for illustration/metaphor posts with no load-bearing structure. See `references/render-pilot-workflow.md` §4.

## Invoke
```
/101 [topic-number]
```
Example: `/101 2` → generates hooks + caption + ChatGPT Image 2 prompt for Topic 2 (Supply Chain vs. Logistics)

## Prerequisites
- `references/101-plan.md` must exist (the 90-day content plan)
- `references/101-voice.md` must exist (101 voice anchor)
- `references/layout-frameworks-intelligence.md` (200-pattern layout selector + composition modes) and `references/render-pilot-workflow.md` (code-render pipeline + learnings) — for the visual
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

## Step 2: Generate 10 Hook Options

Generate all 10 hooks using the hook taxonomy adapted for 101 voice:

| # | Type | 101 Adaptation |
|---|---|---|
| 1 | Question-Why | Everyday question, not industry puzzle |
| 2 | Question-How | Frame around a familiar product or experience |
| 3 | Stat-Lead | Simple, surprising number — not a dense ratio |
| 4 | Contrarian | Challenge a common assumption non-practitioners hold |
| 5 | Paradox | Relatable contradiction, not a mechanism chain |
| 6 | Personal-Reflection | "I get asked this all the time..." framing |
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
- Sign-off: "Found this useful? Follow Poornajith Shetty and Shetty's Desk for more supply chain insights and save/repost this for [specific reference use]."
- Hashtags: #ShettysDesk #SupplyChainIntelligence #SCM #SupplyChain101 + 1 topic-specific tag

---

## Step 4: Code-Render the Infographic — 3 DISTINCT VARIANTS (PRIMARY)

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

## Step 4B: ChatGPT Image 2 Prompt (BACKUP path)

Generate this **as a fallback** and keep it in `101-copy.md` — use it instead of the code-render only when the concept is purely illustrative/metaphorical with no load-bearing structure (or when a render isn't feasible in-session).

**Image tool: ChatGPT (GPT Image 2).** Paste the prompt into ChatGPT and **attach `references/brand-anchor-v1.webp`** in the same message — that is the style/colour reference (same brand anchor as before, now used in ChatGPT instead of the Gemini Gem). GPT Image 2 renders on-image text reliably, so keep labels exact and short.

Use this exact template structure. The VISUAL ANCHOR block is mandatory — it is what makes each infographic visually distinctive and eye-catching. Without it, the output is structurally correct but visually generic.

**VISUAL ANCHOR rules:**
- 3–5 sentences only. Placed between THE QUESTION THIS ANSWERS and VISUAL STRUCTURE.
- Describes one dominant visual metaphor with spatial specificity — how the layout feels, what dimensional quality it has, what the focal element is, where the eye goes first.
- Names the single most important element on the canvas (the brightest, the largest, the one point of tension).
- No colour instructions — the brand anchor image handles colour. No narrative prose about the concept. No NEGATIVE block.
- This block is what separates a visually striking render from a generic one. Never skip it.

```
Task: Create an infographic image for the summary below (after the rules).

Rules: Use the image attached as a reference on style, aesthetics, colours, and illustration technique. Use a different layout for the structure to elaborate details based on the summary. Do not use any information or text from the attached image — only style. Use it only for inspiration. Square 1:1 format (1024x1024).

TOPIC: [Topic name]
THE QUESTION THIS ANSWERS: [The Question It Answers from the plan — verbatim]

VISUAL ANCHOR: [3–5 sentences. Name the dominant visual metaphor and dimensional concept — how the layout is rendered in space, what quality it has, what the single focal element is, where the eye goes first. No colour instructions. No concept explanation. No prose about supply chain.]

VISUAL STRUCTURE: [1–2 sentences describing the dominant layout — taken from the Visual Format in the plan. Name the spatial logic: what is on the left/right/top/bottom/centre, what the focal point is.]

CONTENT TO INCLUDE ON THE IMAGE:
- Heading: "[Short heading, max 8 words]" (Bold)
- [Named section or element 1 — use spatial labels: LEFT SIDE / RIGHT SIDE / TOP / CENTRE / etc.]:
  - [Label]: [2–3 word value or short phrase — not sentences]
  - [Label]: [2–3 word value or short phrase]
- [Named section or element 2]:
  - [Label]: [2–3 word value]
  - [Label]: [2–3 word value]
- [Annotation line — carries the opinion from the caption. One sentence, specific.]

CONTENT RULES:
- Maximum 60 words total on the image (excluding labels and axis text)
- Heading: maximum 8 words, set in Bold
- Every element must be readable at mobile phone size
- [One rule specific to this visual format — e.g. "The wave amplification should be the dominant visual"]
- Data labels and annotations preferred over paragraph text

DO NOT:
- Use font sizes below 14px at final output resolution
- Add decorative elements that do not carry information
```

Populate from the plan's Visual Format and Caption Direction. Keep content list tight — only what must appear on the image. Total prompt length: 40–55 lines maximum.

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
   - All 10 hook options (reference)
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

## Hook Options — All 10 (reference)
1. [Question-Why]: [text]
2. [Question-How]: [text]
3. [Stat-Lead]: [text]
4. [Contrarian]: [text]
5. [Paradox]: [text]
6. [Personal-Reflection]: [text]
7. [Result-First]: [text]
8. [Timeline-Shock]: [text]
9. [Comparison-Gap]: [text]
10. [Decision-Pressure]: [text]

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
- [ ] All 10 hooks use different opening words and different structural devices?
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
