# Visual Comparison — Supplier Concentration Risk

**Week:** 2026-W28  
**Slug:** supplier-concentration-risk  
**Series:** Supply Chain 101  
**Date:** 2026-06-30  
**Final visual:** `visual.png`

## 1. Visual Move

> This image should make the reader see that supplier risk is concentrated in a few load-bearing relationships by showing a broad supplier base narrowing into three structural dependency pillars.

## 2. Inputs

| Input | Notes |
|---|---|
| Content brief | `content-brief-v2.md` |
| Brand frame | `references/brand-kits/cobalt-grid/FRAME.md` |
| Visual workflow | `references/visual-engine-v2.md` |
| Reference learning | `reference-learning-card.md` |
| Creative brief | `creative-brief-lite.md` |
| Compiled prompt | `gpt-image-2-prompt-compiled.md` |
| Output review | `visual-output-review.md` |
| Content source | `101-copy.md` |

## 3. GPT Image 2 Lane

**Prompt file:** `gpt-image-2-prompt.md`  
**Compiled next-iteration prompt:** `gpt-image-2-prompt-compiled.md`  
**Generated candidates:** `gpt-image-2-candidate-v1.png`, `gpt-image-2-candidate-v2.png`, `gpt-image-2-candidate-v3.png`

**Generation notes:**

- Engine: GPT Image 2 through the built-in image generation path
- Aspect ratio: 3:4 portrait
- Style target: Cobalt Grid editorial infographic, not dashboard

**Candidate judgment:**

| Dimension | Score 1-5 | Notes |
|---|---:|---|
| Reference fidelity | 5 | v3 feels much closer to a premium reference poster than v1/v2. |
| Brand ownership | 5 | Cobalt/cream/grid/editorial type are strong and ownable. |
| Argument clarity | 5 | The many-to-three dependency funnel is immediate. |
| Editorial craft | 5 | v3 has cleaner spacing, stronger hierarchy, and better label placement. |
| Mobile legibility | 5 | Shortened labels read cleanly. |
| Data integrity | 5 | No invented statistics or supplier names; supplied text appears materially correct. |
| Distinctiveness | 5 | The output no longer feels like a generic dashboard/card post. |

## 4. HTML Control Lane

**Renderer template:** `../../../../renderer/templates/supplier-concentration-risk-control.html`  
**Rendered output:** `../../../../renderer/out/supplier-concentration-risk-control.png` (pending browser render)  
**Post-folder copy:** `html-control.png` (pending browser render)

**Control purpose:**

- Exact text integrity
- Backup publish candidate
- Layout comparison against the generated image

**Control judgment:**

| Dimension | Score 1-5 | Notes |
|---|---:|---|
| Structure fit | 5 | Template uses a clean funnel-to-pillars structure that maps directly to the thesis. |
| Exactness | 5 | Text is deterministic and source-controlled in HTML. |
| Brand fit | 5 | Cobalt Grid atoms are explicit in the template. |
| Mobile legibility | 4 | Expected strong headline and pillar labels; verify after PNG render. |
| Publish readiness | 3 | Template is ready; PNG render still pending. |

## 5. Final Decision

**Chosen lane:** GPT Image 2, candidate v3.

**Why this wins:**

The GPT lane now has the right ambition and polish: v3 treats supplier concentration as an architectural dependency problem, not as a generic risk matrix, and the shortened labels fixed the biggest readability issue from v1/v2. The HTML lane is ready as a deterministic fallback, but its PNG still needs the browser render.

**Required fixes before publish:**

- Render the HTML control PNG when unsandboxed browser execution is available.
- Optional: add the bottom review question only if it can be controlled through the compiler without reintroducing text drift.
- Do one final crop/feed-size check before posting.

**Archive notes / reusable seed:**

Reuse the dependency-funnel/pillar structure for future resilience topics where the real lesson is hidden dependency, not visible spend.
