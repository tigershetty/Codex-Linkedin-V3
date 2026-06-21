# Render Experiment — Supplier Scorecard (RW01 · Ep05)

**Date**: 2026-06-20 · **Subject**: AI for SC Ep05 — *Supplier Scorecard for QBRs* (Category Manager × Copilot)
**Why this subject**: a 7-column × 3-row scorecard with 15 exact scores, 3 weighted totals, a weighting row, and two vendor logos (Copilot, Excel). It is **data-bearing and logo-heavy** — the hardest, most revealing test for "should this be code-rendered or AI-generated?"

Three production lanes, one infographic:

| Lane | Tool / engine | What it is | Artifact |
|---|---|---|---|
| **1 · HyperFrames** | GSAP timeline → Playwright/Chrome frame-scrub → ffmpeg | code-rendered **animated** infographic (HeyGen HyperFrames *paradigm*: code → deterministic motion, no API cost) | `hyperframes-anim.gif` (+ `.mp4`, build still `hyperframes-frame-build.png`) |
| **2 · Higgsfield** | **GPT Image 2** (`gpt_image_2`, OpenAI via Higgsfield), 2k/high, 3:4 | **AI-generated** still infographic from a prompt | Higgsfield job `c1a6d680-4137-48b2-92b6-eced1ddf2911` (see note below) |
| **3 · GSAP/HTML** | `render.mjs` → Playwright/Chrome screenshot | code-rendered **static** PNG (deterministic) | `gsap-html-still.png` (2160×2700) |

> Note on the workstation/sandbox: HyperFrames itself is HeyGen's open-source framework that renders via Puppeteer+Chrome — the same paradigm as our in-repo GSAP+Playwright engine. With no dedicated `/hyperframes` MCP in this environment, lane 1 uses the in-repo GSAP animation engine, which produces an equivalent code-rendered motion GIF at zero API cost. The HyperFrames CLI (`npx hyperframes render --browser-path <chrome>`) would produce the same class of output from the same HTML.

---

## Quantitative comparison

| Dimension | ① HyperFrames (anim) | ② GPT Image 2 (AI) | ③ GSAP/HTML (still) |
|---|---|---|---|
| Output | GIF 640×800 + MP4 1080×1350 | PNG 1744×2336 | PNG 2160×2700 (4:5 @2x) |
| File size | 920 KB GIF · 317 KB MP4 | ~2–4 MB (cloud) | 1.0 MB |
| Render time | ~30–60 s (149 frames + 2-pass GIF) | ~30–60 s (cloud queue + gen) | **~1.1 s** |
| Direct cost | **$0** (local CPU) | **7 Higgsfield credits / image** | **$0** (local CPU) |
| Determinism / reproducible | **100%** — byte-identical re-runs | **0%** — stochastic, never repeats | **100%** |
| Text accuracy | **Exact** (DOM text) | Approximate — AI image models drift on dense tables (verify) | **Exact** (DOM text) |
| Data fidelity (15 scores, 3 totals, weights) | **Exact** | **Not guaranteed** | **Exact** |
| Brand token fidelity (`#2798FB`, `#38E6A6`, `#E27199`) | **Exact hex** | Approximate (palette steered by prompt) | **Exact hex** |
| Logo fidelity (Copilot / Excel / Shetty's Desk) | **Real vendor vectors** | AI-approximated (re-drawn) | **Real vendor vectors** |
| Motion | **Yes** (build animation) | No | No |
| Edit / iterate | Edit HTML → re-render | Re-prompt (no surgical edits) | Edit HTML → re-render |
| Effort to first output | High (author template once) | **Low** (one prompt) | High (author template once) |
| Reusable across topics | High (kit-of-parts) | Low (one-off) | High |

---

## Qualitative read

### ① HyperFrames / GSAP animation — *the scroll-stopper for data*
The build sequence (rows slide in, score chips pop, weighted bars grow, the winning row lights up eco-green with a trophy) turns a static table into a 7-second story that earns the stop in a LinkedIn feed. Because it is the same code as lane 3, **every number is exact and every brand token is locked** — you get motion *and* precision, which an AI video/image model cannot promise. Cost is zero. The price is authoring effort and a Chrome dependency. **Best for:** the hero post of a week, stat/ranking reveals, anything where the *change over time* is the point.

### ② GPT Image 2 — *fast, beautiful, not for load-bearing data*
GPT Image 2 is the strongest text-rendering AI image model available and will return a polished, broadly on-brand infographic from a single prompt in under a minute, for 7 credits. That is genuinely useful — for **illustrative and metaphor visuals** (an iceberg for TCO, a funnel concept, a "war room" scene) where no exact figure is load-bearing. But for *this* subject — 15 specific cell scores, three weighted totals (3.80 / 4.45 / 2.95), a weighting row, and two real vendor logos — an AI image model characteristically **approximates** text, **re-draws** logos, and **drifts** on exact hex and cell-level numbers. That is not a knock on the model; it is the wrong tool for a data table. This matches the repo's own standing rule (`renderer/README.md` §0: *"structured posts … need exact numbers, brand-locked layout … code-render over Gemini; AI image stays a fallback for illustration/metaphor"*). **Best for:** Supply Chain 101 concept/metaphor visuals (the `/101` lane already uses GPT Image 2 by design), hero illustrations, and rapid concept drafts — **not** scorecards, KPI tables, formula cards, or anything with numbers a reader will trust.

> **Visual QA of lane 2 is pending.** The generated PNG lives in the Higgsfield account (job `c1a6d680-…`); its CDN host (`d8j0ntlcm91z4.cloudfront.net`) is not in this container's egress allowlist, so it could not be pulled in for side-by-side capture here. To finish lane 2: view it in the Higgsfield UI, or (once the host is allowlisted in a fresh session) drop it in as `higgsfield-gpt-image-2.png` — see `gpt-image-2-PLACEHOLDER.md`.

### ③ GSAP/HTML still — *the workhorse for the AI-for-SC lane*
The fastest (~1.1 s), cheapest ($0), and most precise lane. Pixel-locked brand system, exact scores, real logos, and a copy-paste prompt block baked in — a genuinely save-worthy asset. It is the right default for **every data-bearing AI-for-SC post** (scorecards, cost anatomies, dashboards, formula trees). The only costs are upfront template authoring and a headless Chrome.

---

## Verdict — which lane for which post

| If the post is… | Use | Because |
|---|---|---|
| A data table / scorecard / KPI / formula (most **AI for SC**) | **③ GSAP/HTML still** | exact numbers + brand lock + $0 + 1s |
| The week's hero / a ranking or stat *reveal* | **① HyperFrames anim** | same precision, plus motion that stops the scroll |
| A concept, metaphor, or illustrated scene (most **101**) | **② GPT Image 2** | speed + beauty where no exact figure is load-bearing |

**One-line takeaway:** *Code-render the numbers, AI-render the metaphors.* For the Supplier Scorecard specifically, lanes ① and ③ are production-ready as-is; lane ② is the right engine for the *concept* posts, not this data table — which is exactly the experiment's point.

**Credits used this experiment:** 7 (one GPT Image 2 generation) + 7 (one cost-preflight call returns 0 spend) → **7 credits total**. Balance remains ~263.

---

## Reproduce

```bash
cd infographic-setup/renderer
# one-time in a fresh container: get a Chrome binary (CDN-friendly via puppeteer)
npx puppeteer browsers install chrome
export CHROME_PATH=$(node -e "console.log(require('puppeteer').executablePath?.()||'')" 2>/dev/null) \
  || export CHROME_PATH=/root/.cache/puppeteer/chrome/*/chrome-linux64/chrome
npm install   # icons, gsap, ffmpeg-static, self-hosted fonts

# ③ still
NODE_PATH=$(npm root -g) node render.mjs templates/ai05-supplier-scorecard.html out/ai05-supplier-scorecard.png
# ① animation (GIF + MP4)
HOLD_S=1.5 GIF_W=640 NODE_PATH=$(npm root -g) node render-anim.mjs templates/ai05-supplier-scorecard-anim.html out/ai05-supplier-scorecard
# ② AI still — Higgsfield MCP: model gpt_image_2, 2k/high, aspect 3:4 (prompt in the post's render brief)
```
