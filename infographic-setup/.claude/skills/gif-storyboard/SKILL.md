---
name: gif-storyboard
description: Use after a still infographic is approved, to storyboard and build a short looping GIF/MP4 from the infographic's OWN elements via HyperFrames/GSAP. Invoked with /gif-storyboard [slug]. Turns a static code-rendered infographic into a motion version without redesigning it.
---

# GIF Storyboard — from infographic to motion (Shetty's Desk)

## Purpose
Every AI-for-SC (and optionally 101) post ships a **still** first (the deterministic code-render).
This skill adds the **next phase**: a short, looping **motion** version built from the *same elements*
of the approved still — no new design, just choreographed reveal. Output feeds the HyperFrames /
in-repo GSAP anim lane (`renderer/render-anim.mjs` → MP4 + GIF).

**Rule of the lane:** the GIF is the still in motion. Do not invent new content for the GIF — animate
what is already on the approved infographic. Depth (3D) is kept; motion adds *sequence and emphasis*.

## When to run
After the still template is approved (`renderer/templates/<slug>.html` → `out/<slug>.png`).
```
/gif-storyboard [slug]
```

## Step 1 — Inventory the elements (from the approved still)
List every animatable element and its role: title, tool mark, stat-band KPIs, legend, the hero
(slabs / funnel / bars / cards), per-item data (chips, scores, deltas), insight band, prompt block, footer.

## Step 2 — Choose the motion spine (how the argument unfolds)
Pick ONE narrative spine that matches the layout's visual rhetoric, then sequence reveals to it:

| Layout (still) | Motion spine (the GIF tells this story) |
|---|---|
| Ranked slabs / podium (PF7) | build the field, then the **rank resolves** — losers settle, winner rises + crown lands |
| Funnel | pour from the wide top, each stage **narrows and drops count** to the eco tip |
| Comparison / versus | left "claim" types in, then the right **counter answers it** row by row |
| Maturity ladder | climb **level by level**, "START HERE" pulses at the base |
| Formula / KPI card | inputs fly in → **formula assembles** → result counts up |
| Waterfall / bridge | bars **step up/down** to the final total |
| Process flow / cycle | a token **travels the path**, each node lights as it passes |
| Anatomy / hub | center appears → **spokes/labels radiate** outward |

## Step 3 — The brand motion grammar (keep it disciplined)
- **Seek-safe, deterministic** (works with `render-anim.mjs` scrub + HyperFrames): one paused GSAP
  master timeline on `window.__tl`, `window.__dur`, `window.__ready`. No `Date.now()`/`Math.random()`.
- **Reveal, don't decorate.** Each element enters once, with intent. Stagger top→bottom / build→resolve.
- **Earn the climax.** ~70% of the timeline builds; the last ~30% is the payoff (winner rises, funnel hits 1, counter lands, result counts up).
- **Numbers count up** (stat-band KPIs, weighted scores, percentages) — motion makes data feel computed.
- **Eco-green is the resolve color** — the positive/win element gets the final highlight beat.
- **Icons can animate** (draw-on stroke, pop-in, gentle loop) — animate the Lucide/lobehub SVGs in
  `renderer/assets/` with GSAP (we do NOT use React `lucide-animated`; same result, fits the engine).
- **Loop clean:** end on a held, complete frame (`HOLD_S`) so the GIF rests on the full infographic.
- Length **5–8s**, GIF width ~640 for LinkedIn.

## Step 4 — Write the storyboard (beats table)
Produce a beats table: `t (s) | element | motion | ease | note`. Save it in the post file under
`## GIF Storyboard`. This is the spec the anim template implements.

## Step 5 — Build + render
- Copy the approved still template → `<slug>-anim.html`; add the GSAP timeline per the beats; expose
  `__tl/__dur/__ready`; set initial states with `gsap.from`/`set`.
- Render: `HOLD_S=1.5 GIF_W=640 CHROME_PATH=<chrome> NODE_PATH=$(npm root -g) node render-anim.mjs templates/<slug>-anim.html out/<slug>`
- QA the GIF against the still (same final frame), then save `<slug>.gif` + `.mp4` with the post.

## Step 6 — (Optional) HyperFrames CLI path
For richer motion-graphic treatments, author the same composition for the installed HyperFrames skills
(`/motion-graphics`) and render with `npx hyperframes render --browser-path <chrome>`. Same paradigm
(code → deterministic motion, no API cost); use when the GIF needs more than reveal choreography.

## Token budget
~1–2K. Reads the still template + post file; writes the storyboard + one anim template.
