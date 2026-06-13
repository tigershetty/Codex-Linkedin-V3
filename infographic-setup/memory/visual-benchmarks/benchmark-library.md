# Benchmark Library — Visual Reference Analysis
**Source images**: 19 JPEGs in this directory (Stanley-brand LinkedIn growth content)
**Analysed**: 2026-06-13
**Purpose**: Visual quality bible for the critic agent and visual-QA agent. Read this before scoring any post.

---

## What These Images Represent

All 19 images are Stanley-brand LinkedIn growth infographics — ceiling-level single-image reference cards. They were saved because they represent the best of what dense, functional, save-worthy infographics look like in practice. The topic (LinkedIn growth) differs from Shetty's Desk (SC + AI), but the visual grammar is identical: dense, evergreen, reference-card format built to be saved and used again.

---

## 10 Design Rules Extracted from the Batch

### R1 — Visual IS the concept, not a container for text
The best images are structurally correct: funnels for conversion funnels, circles for time allocation, hub-and-spoke for "one-to-many," tier systems for progression stages. The layout metaphor and the content meaning are the same object. When you see the shape, you understand the argument before reading a word. Test: could you describe what the post is about just from the shape?

### R2 — One hue family, used semantically
Navy→mid→bright blue encodes funnel depth. Purple marks "what you should do" vs grey for "what most people do." Accent colour is not decoration — it marks the key point in each section. Two-colour discipline (background + one accent) = designed. Accent sprayed randomly = generated. Shetty's Desk adaptation: Claude coral marks AI output; warm grey marks human input. This carries the transformation story without a word.

### R3 — Repeated reading scaffold — learn one card, read all
Every card in the image uses the same anatomy: icon top-left, bold title in ALL CAPS, 2–4 lines of body, optional pill/tag at bottom. Consistent anatomy means the reader's eye knows where to look on every card. This is what enables dense images to be readable at mobile size — you're not learning a new format on each card.

### R4 — One thesis sentence as a spine
Every strong image has one sentence that holds the whole argument. Often vertical or at the bottom. "Every post moves someone closer to yes." "Content doesn't close deals. But it makes closing deals dramatically easier." "The best posts do all five. The average post does none intentionally." This sentence is what gets quoted. It's the sentence that earns the save.

### R5 — Summary footer = pin-it payload
The bottom of the canvas is the most saveable element. A tight summary sentence or 2-3 word formula (2x TOFU / 2x MOFU / 1x BOFU) compresses the entire image into a portable takeaway. This is what the person screenshots before a meeting or shares in Slack. Shetty's Desk equivalent: "Before your next [specific SC task], use this to..."

### R6 — Two-colour discipline separates designed from generated
The images that look most professional use two colours: one background, one accent. The accent is used with discipline — only on the most important element per section. When a third colour is added (e.g. green for "good," red for "bad"), it is semantic not decorative. AI-generated images tend to introduce colour arbitrarily; disciplined accent use is the tell that something was designed.

### R7 — Hero number is the first thing the eye finds (2–4× larger than body)
Every top-performing image leads with a specific, precise number: 30,451 posts analysed, 3.4x resource list saves, 80% never read past line 3, 29,080,784 impressions. The number is 2–4× larger than body text. It is always real and specific — "~80%" is weaker than "80%", "millions" is worthless next to "29,080,784". The number signals: data-backed, not opinion.

### R8 — Real screenshots / real tool embeds = instant credibility
6 of 19 images embed actual screenshots of tools — Stanley analytics, a LinkedIn post with real numbers, an Apify interface. "I actually ran this and here is the output" is the most credible claim in an infographic. For Shetty's Desk this means: show the actual Claude interface or the actual Excel formula output, not an abstract diagram of what AI does.

### R9 — Mixed visual syntax prevents scan fatigue
The best images mix: table + flow diagram + text block + icon row + mini-chart. Every section has a different visual treatment. "Wall of identical cards" is the failure mode — the same format repeated 8 times reads as monotonous even when the content varies. Rule: never use the same layout format 3 times in a row within one image.

### R10 — Branding only in footer, content owns the canvas
Author name, avatar, and Repost badge appear only at the bottom. Never a large watermark over content. The Shetty's Desk logo is footer-only. The content fills 95% of the canvas. This is counterintuitive — less branding, more save-worthy.

---

## Shetty's Desk Adaptations

These rules apply to SC + AI content with the following adjustments:

| General rule | Shetty's Desk adaptation |
|---|---|
| R1: Visual IS the concept | For SC: the visual shows the process, flow, or decision — not a generic card grid. A 1PL→5PL post should visually escalate from left to right. A safety stock post should show the formula components as a visual equation. |
| R7: Hero number | For SC: use operational data — time saved, cost avoided, inventory turns, error rate, before/after comparison. Not "80% of creators..." — "2–3 days → 20 minutes with Claude." |
| R8: Real tool embed | For AI-for-SC: show the actual Claude prompt text as a visible block. The output format shown. The before/after workflow side by side. Not a generic "AI magic" illustration. |
| R5: Pin-it payload footer | For SC: "Before your next [procurement decision / safety stock review / supplier scorecard], use this frame." Specific trigger, not generic. |

---

## Common Production Bugs (visual-QA checklist)

Caught in these 19 images — flag these in every Shetty's Desk visual:

- **Text overflow / run-on**: "too salesyQuick frameworks" (Stanley funnel) — text bleeds across adjacent element. Check every card at mobile size.
- **Inconsistent icon sizing**: some icons 24px, others 32px in the same image. Pick one size and lock it.
- **Orphaned text labels**: a label appears next to an arrow with no clear connection to a card. Every label needs an anchor.
- **Empty canvas corners**: top-left or bottom-right left blank when cards don't fill the space. Cards should extend to within 80px of the canvas edge.
- **Background bleed**: pill or badge background colour bleeding 1–2px outside the rounded corner. Check render at 2x.
- **Caption overflow into footer**: the last line of body copy sits on top of the footer zone. Leave 80px clearance above the footer.

---

## Images in This Library

| File | Creator | Format | Best rule illustrated |
|---|---|---|---|
| 1773945592599.jpeg | Ayesha Ameer | 4-step dark card grid | R9 mixed syntax, R2 semantic colour |
| 1774475909865.jpeg | Charlie Hills | 7-step dense reference + screenshots | R8 real embeds, R3 scaffold |
| 1775667346813.jpeg | Charlie Hills | Multi-section data reference | R7 hero numbers, R9 mixed syntax |
| 1777317392944.jpeg | Stanley | Circle/pie time allocation | R1 visual IS concept |
| 1777565147437.jpeg | Stanley | 7-card numbered list with data bar | R7 hero stat, R3 scaffold |
| 1777643469012.jpeg | Stanley | 8-section dense reference | R9 mixed syntax |
| 1778164217668.jpeg | Stanley | STANLEY acronym table | R6 two-colour (purple/green), R3 scaffold |
| 1778508466511.jpeg | Stanley | 5-step 2×2 grid | R5 pin-it footer |
| 1778596230261.jpeg | Stanley | Funnel diagram | R1 visual IS concept, R6 two-colour |
| 1778753878659.jpeg | Richard van der Blom | 3-step editorial + screenshots | R8 real data, R10 minimal branding |
| 1778767469345.jpeg | Stanley | 10-card hook formula reference | R3 scaffold, R7 stat bar |
| 1778853600952.jpeg | Stanley | 5-step with varied syntax per step | R9 mixed syntax, R5 pin-it |
| 1779107403867.jpeg | Brandon Smithwrick | 5-row icon + text | R6 two-colour, R4 thesis spine, R5 footer |
| 1779275357218.jpeg | Charlie Hills | 9-card 3×3 grid + line chart | R7 hero number (29M), R8 real data |
| 1779459893538.jpeg | Ayesha Ameer | 6-section 2×3 grid | R3 scaffold, R2 semantic purple |
| 1779719416205.jpeg | Stanley | 8-section varied grid | R9 mixed syntax |
| 1779890483267.jpeg | Stanley | 4-section with results metrics | R7 hero ($1.5M ARR), R5 results footer |
| 1779978580678.jpeg | Stanley | TOFU/MOFU/BOFU funnel | R1 visual IS concept, R4 thesis spine, R5 pin-it |
| 1780065010524.jpeg | Stanley/LinkedIn | 3-tier progression system | R1 visual IS concept, R3 scaffold |

---

## The Single Most Saveable Format

The "cheat sheet / one-page reference card" format is the highest-save single image format across all 19 benchmarks and confirmed by Shetty's Desk's own analytics (Career Map: 411 saves vs Maersk: 62 saves). Characteristics:
- Dense but organised (not cluttered — every element has a place)
- Specific enough to be useful (not abstract or generic)
- Glanceable at mobile size (can skim in 10 seconds, read in 60)
- A person would send this to their team before a meeting
- The summary footer compresses the whole image into a sharable quote
