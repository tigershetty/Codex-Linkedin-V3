# Visual Comparison — Supplier Flexibility Matrix

**Week:** 2026-W28  
**Slug:** supplier-flexibility-matrix  
**Series:** AI for Supply Chain  
**Date:** 2026-07-01  
**Final visual:** `visual.png`

## 1. Visual Move

One sentence:

> This image should make the reader see that supplier flexibility is measurable before a spike by using a ranked supplier matrix with verification as the final action.

## 2. Inputs

| Input | Notes |
|---|---|
| Research brief | `content-brief-v2.md` |
| Brand frame | `references/brand-kits/cobalt-grid/FRAME.md` |
| Structure references | Top-100 caption/index patterns refs 87, 70, and 5; ranked cards, matrix utility, AI workflow artifact |
| Content source | `creative-brief-lite.md` + `reference-learning-card.md` |
| Logo assets | `renderer/assets/logos/shettys-desk-logo-2.png`; `Icons and Logos/Claude AI 2.svg.png`; `Icons and Logos/Claude Full Logo.svg.png` |

## 3. GPT Image 2 Lane

**Prompt file:** `gpt-image-2-prompt.md`

**References attached:**
- `reference-learning-card.md`
- `creative-brief-lite.md`
- logo/asset references listed in `creative-brief-lite.md`

**Generation notes:**
- Engine: GPT Image 2 via built-in image generation
- Aspect ratio: portrait feed infographic
- Result location / panel notes: `gpt-image-2-candidate-v8-logo-locked.png` promoted to `visual.png`
- Logo lock: `gpt-image-2-candidate-v8.png` passed through `scripts/lock-logo-assets.py` to overlay the exact Shetty mark and reinforce the Claude symbol.

**Candidate judgment before rendered QA downgrade:**

| Dimension | Score 1-5 | Notes |
|---|---:|---|
| Reference fidelity | 4 | Strong ranked/matrix/saveable direction, but the final render still misses exact execution. |
| Brand ownership | 3 | Cobalt/cream direction is strong; logo-lock execution exposed overlay artifacts. |
| Argument clarity | 4 | Decision question is clear, but row status contradictions weaken trust. |
| Editorial craft | 4 | Dense and reference-like, but repeated text and symbol crowding reduce polish. |
| Mobile legibility | 3 | Feed-level hierarchy works; repeated micro-labels make zoom reading noisy. |
| Data integrity | 2 | Current selected visual has row-action contradictions and rendered text risk. |
| Distinctiveness | 4 | Better than a standard dashboard, but not yet a publish-safe Shetty artifact. |

**Variant history:** `gpt-image-2-candidate-v2.png` was the first safe final because text integrity held. `gpt-image-2-candidate-v3.png` improved the visible reference mechanics from refs 87/70/5, especially row schema, conceptual scoring bars, and workflow panels, but failed text lock by adding/altering rail labels. `gpt-image-2-candidate-v4.png` preserved richer craft while keeping the text-placement rule cleaner. `gpt-image-2-candidate-v5.png` pushed editorial detail further but duplicated workflow labels across the matrix and workflow strip. `gpt-image-2-candidate-v6.png` added the explicit text placement map and fixed duplicate-label failure. `gpt-image-2-candidate-v7.png` proved the richer reference-card direction but invented an uncontrolled legend. `gpt-image-2-candidate-v8.png` made that legend controlled, but the logo-locked version exposed overlay and contradiction failures. `gpt-image-2-candidate-v9.png` fixed some row logic and logo-zone behavior, but still invented unapproved captions, so it is a learning candidate only.

## 4. HTML Control Lane

**Renderer template:** `renderer/templates/supplier-flexibility-matrix-control.html`  
**Rendered output:** `renderer/out/supplier-flexibility-matrix-control.png` and package copy `html-control.png`  

**Control purpose:**
- Exact text backup, deterministic layout comparison, and future GIF/MP4 extension source.

**Control judgment:**

| Dimension | Score 1-5 | Notes |
|---|---:|---|
| Structure fit | 5 | Uses the same five-row supplier matrix and Claude -> Matrix -> Action flow. |
| Exactness | 5 | All text is deterministic and locked in HTML. |
| Brand fit | 4 | Strong Cobalt Grid control, though less organic/editorial than GPT Image 2. |
| Mobile legibility | 4 | Excellent table legibility; the dense grid is intentionally save-to-zoom. |
| Publish readiness | 4 | Usable as backup after human QA; GPT Image 2 remains the stronger feed visual. |

## 5. Premium HTML/SVG Test Lane

**Renderer template:** `renderer/templates/supplier-flexibility-matrix-premium.html`  
**Rendered output:** `renderer/out/supplier-flexibility-matrix-premium.png` and package copy `html-premium-control.png`  

**Test purpose:**
- Determine whether a higher-craft deterministic HTML/SVG renderer can close the gap between plain HTML control and GPT Image 2 while preserving exact text, logos, row logic, and QA reliability.

**Premium control judgment:**

| Dimension | Score 1-5 | Notes |
|---|---:|---|
| Structure fit | 5 | Keeps the supplier matrix, legend, Claude -> Matrix -> Action strip, and bottom decision question. |
| Exactness | 5 | Text is deterministic; no malformed letters, invented captions, or repeated row labels. |
| Brand fit | 4 | Strong Cobalt Grid system with exact Claude and Shetty logo assets; less organic than GPT Image 2 but much cleaner. |
| Mobile legibility | 5 | Clear hierarchy, readable row states, and save-to-zoom detail without text drift. |
| Value density | 4 | Adds rank badges, status tags, score key, constraint key, confidence marks, and verification states. |
| Publish readiness | 4 | Strong backup/control candidate; still could benefit from a dedicated Shetty wordmark crop and more editorial warmth before replacing the hybrid lane. |

## 6. 3D Isometric Test Lane

**Renderer template:** `renderer/templates/supplier-flexibility-matrix-3d-isometric.html`  
**Rendered output:** `renderer/out/supplier-flexibility-matrix-3d-isometric.png` and package copy `html-3d-isometric-control.png`  

**Test purpose:**
- Explore whether the same supplier matrix can become a more creative 3D decision object: a raised capacity terrain where supplier height and platform risk communicate the ranking before the viewer reads the table detail.

**3D control judgment:**

| Dimension | Score 1-5 | Notes |
|---|---:|---|
| Structure fit | 4 | Preserves the five suppliers, criteria, action labels, legend, Claude -> Matrix -> Action strip, and bottom decision question. |
| Exactness | 5 | Text and logos are deterministic; no GPT-rendered text errors. |
| Brand fit | 4 | Cobalt Grid plus isometric prism language feels more distinctive than the flat control while staying exact. |
| Mobile legibility | 4 | Strong object-level read; dense criterion labels are more zoom-oriented than the premium flat matrix. |
| Value density | 4 | Makes A/B/C/D/E status visible through height, risk striping, action tags, side callouts, and legend. |
| Publish readiness | 3 | Good creative test, but not yet the safest production answer; use when stop-scroll 3D metaphor matters more than table-like auditability. |

## 7. True Three.js 3D Test Lane

**Renderer template:** `renderer/templates/supplier-flexibility-matrix-3d-three.html`  
**Rendered output:** `renderer/out/supplier-flexibility-matrix-3d-three.png` and package copy `html-3d-three-control.png`  

**Test purpose:**
- Replace the flat/isometric sketch with a readable deterministic WebGL artifact: real Three.js geometry for the supplier terrain, exact HTML text overlays for every label/action, and a right-side decision panel that tells the reader what to do without decoding the 3D object.
- Correct the final readability issues from the first 3D pass: remove cramped/rotated labels from the hero, move criteria into a clean rail, separate the scene label from the subtitle, and enlarge the 3D terrain so the supplier ranking is easier to follow.

**Three.js control judgment:**

| Dimension | Score 1-5 | Notes |
|---|---:|---|
| Structure fit | 5 | Preserves the five suppliers, five criteria, action labels, legend, workflow strip, and bottom decision question. |
| Exactness | 5 | All text/logos remain deterministic HTML/SVG overlays; Three.js only renders geometry. |
| Brand fit | 4 | Cobalt Grid stays intact while the central object becomes a real 3D capacity terrain. |
| Mobile legibility | 4 | Strong object read plus readable decision cards; the hero labels, criteria rail, and decision text no longer collide. Legend still rewards zoom. |
| Value density | 5 | Adds the decision path: Supplier A = Call first, B/C = Backup, D/E = Watch risk, plus how to read height/shape/risk. |
| Publish readiness | 4 | Best 3D test so far. It now has reader value, not just visual novelty; still less audit-dense than the premium flat matrix. |

**Verification:** WebGL canvas rendered and returned nonblank pixel samples in desktop and mobile-sized viewport checks after the final readability pass; PNG output is 2160x2700.

## 8. GPT Image 2 Hero-First Test Lane

**Prompt file:** `gpt-image-2-hero-first-prompt.md`  
**Reference inspiration:** user-provided ChatGPT Image 2 examples from July 2, 2026: a dense "The Logistician" octopus infographic and its expanded hero-only variant.  

**Test purpose:**
- Return to GPT Image 2 as the primary creative renderer by giving it a scene-first, hero-led creative problem instead of forcing a rigid matrix/table.
- Translate the supplier flexibility matrix into a visual world: one adaptive hero creature, one demand spike, five supplier platforms, and route strength that communicates the decision before the reader studies labels.

**Hero-first judgment:**

| Dimension | Score 1-5 | Notes |
|---|---:|---|
| Structure fit | 4 | The matrix logic becomes five supplier routes/platforms instead of rows. Supplier A reads as strongest, B/C as backup, D/E as risk. |
| Exactness | 3 | GPT rendering still needs text QA and possible deterministic logo/text overlay before publish. |
| Brand fit | 4 | Strong Cobalt Grid flavor with cream/cobalt base and orange used meaningfully for the demand spike. |
| Mobile legibility | 4 | The core scene reads faster than the table versions because the hero, spike, and supplier paths are immediate. |
| Value density | 5 | Stronger save value than the 3D control: the reader can understand the planning decision visually, not just intellectually. |
| Publish readiness | 4 | Best creative direction so far, but final candidate still needs exported image capture, text review, and likely deterministic overlay for logo/footer accuracy. |

**What changed from the previous prompts:**
- The prompt stops asking GPT Image 2 to be a table renderer.
- The matrix becomes an annotated supply-chain scene with physical supplier platforms and route strength.
- The hero image is the first-viewport signal; labels support the scene instead of competing with it.
- On-image text is intentionally sparse: headline, subheading, supplier/action labels, criteria cues, and one bottom question.

## 9. GPT Image 2 Studio Base + HTML/SVG Overlay Lane

**Base prompt:** `gpt-image-2-studio-base-prompt.md`  
**Base image:** `gpt-image-2-studio-base-candidate-v1.png`  
**Overlay template:** `renderer/templates/supplier-flexibility-matrix-studio-overlay.html`  
**Rendered output:** `renderer/out/supplier-flexibility-matrix-studio-overlay.png` and package copy `gpt-image-2-studio-overlay-v1.png`

**Test purpose:**
- Move from a mascot-led GPT image to a professional, supply-chain-native hero object: a physical supplier capacity stress-test table.
- Keep GPT Image 2 responsible for tactile scene richness, miniature logistics details, route strength, and supplier-state differences.
- Keep final text, supplier labels, criteria labels, footer, and logo deterministic through HTML/SVG overlay.

**Hybrid overlay judgment after re-review:**

| Dimension | Score 1-5 | Notes |
|---|---:|---|
| Structure fit | 5 | The five platforms, demand spike, route strength, and A/B/C vs D/E decision states map directly to supplier flexibility. |
| Exactness | 5 | Final visible text is deterministic HTML/SVG instead of GPT-rendered microtype. |
| Brand fit | 3 | Cobalt Grid typography is accurate, but the large overlay cards feel pasted on top of the scene and push the image back toward UI/dashboard language. |
| Mobile legibility | 4 | Headline, supplier/action cards, criteria rail, and bottom question are readable, but readability comes at the cost of visual elegance. |
| Value density | 4 | The logic is useful, but the overlay explains too much instead of letting the scene carry the intelligence. |
| Publish readiness | 2 | Rejected as a direction after re-review. It is useful as a prototype of deterministic labeling, but not the high-end studio aesthetic target. |

**What this taught us:**
- The hero needs to be operational, but operational alone is not enough.
- Deterministic text is necessary for accuracy, but large deterministic cards can kill the authored/editorial feel.
- The overlay should be minimal editorial annotation, not a visible UI layer.
- A better next render should make the five supplier states readable from the scene itself, with only small deterministic annotations added later.

## 10. Final Decision

**Chosen lane:** no publish-ready final yet. After re-review, the studio overlay is rejected as the final direction. The strongest learning is to use GPT Image 2 for a scene-first, supply-chain-native visual, then add only minimal deterministic editorial annotation. Premium HTML/SVG remains the safest text-exact control.

**Why this wins:**

No earlier GPT Image 2 candidate is currently publish-ready. `gpt-image-2-candidate-v8-logo-locked.png` has the strongest density, but fails rendered asset QA. `gpt-image-2-candidate-v9.png` has cleaner logic, but fails exact-text discipline. The premium HTML/SVG render proves the deterministic lane can carry the truth layer while keeping exact words and logic. The true Three.js render proves a coded 3D lane can be readable, but still feels too engineered. The hero-first GPT Image 2 prompt proved that scene-led rendering is stronger than table-led rendering, but the animal hero was not relevant enough. The studio-base overlay proved that relevance improves when the hero is operational, but large HTML/SVG cards over the scene are the wrong aesthetic direction. The next production path should be GPT Image 2 first for an authored, supply-chain-native scene, with deterministic annotation used sparingly and invisibly.

**Required fixes before publish:**
- Do not publish the current `visual.png`.
- Build a hybrid final candidate with deterministic text/logo overlays, or use the HTML control lane as the text-exact backup.
- Keep premium HTML/SVG control as backup and comparison lane; publish GPT Image 2 only when rendered asset QA passes or when deterministic overlays lock final text/logos.
- Use Three.js 3D control when the concept benefits from physical/spatial hierarchy; avoid it when the post needs a dense reusable template first.

**Archive notes / reusable seed:**

Reuse the five-row named supplier matrix pattern plus the strict text-placement rule for AI-for-SC posts where the value is a planning template. Borrow reference mechanics as structure and micro-detail, but assign every allowed text string to one intended home before rendering. For text-heavy artifacts, do not rely on GPT Image 2 to render final text. Use GPT Image 2 for composition/style and deterministic overlays for final text/logo, then run the Rendered Asset QA gate before promotion.
