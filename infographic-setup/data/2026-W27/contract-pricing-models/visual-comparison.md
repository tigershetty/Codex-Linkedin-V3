# contract-pricing-models — Visual Comparison

**Week:** 2026-W27  
**Slug:** contract-pricing-models  
**Series:** Supply Chain 101  
**Final visual:** `visual.png`

## 1. Visual Move

> This image should make the reader see that contract pricing is not "three price types"; it is one risk boundary sliding between supplier and buyer.

## 2. Inputs

| Input | Notes |
|---|---|
| Content source | `101-copy.md` |
| Brand frame | `references/brand-kits/cobalt-grid/FRAME.md` |
| GPT prompt | `gpt-image-2-prompt-v2.md` |
| HTML control | `html-control.md` |

## 3. GPT Image 2 Lane

**Prompt file:** `gpt-image-2-prompt-v2.md`

**Candidate:** `gpt-image-2-candidate-v2.png`  
**Target:** an editorial, reference-led version of "The Shifting Boundary."  
**Decision rule:** keep it only if the moving boundary remains obvious and all labels are legible.

| Dimension | Score 1-5 | Notes |
|---|---:|---|
| Reference fidelity | 4 | Strong Cobalt Grid read; could still use more surprising reference-level composition in a future pass |
| Brand ownership | 5 | Cream, cobalt, grid, hairlines, QR mark, serif headline carry the identity |
| Argument clarity | 5 | The moving boundary is instantly readable |
| Editorial craft | 4 | Clean, restrained, premium; slightly conservative but polished |
| Mobile legibility | 5 | Core labels and row captions are readable |
| Data integrity | 5 | No invented numbers or percentages |
| Distinctiveness | 4 | Not a generic dashboard; still close to the control diagram by design |

## 4. HTML Control Lane

**Renderer template:** `renderer/templates/contract-pricing-models-cobalt-control.html`  
**Rendered output:** `renderer/out/contract-pricing-models-cobalt-control.png` and copied to `html-control.png`

**Control purpose:** prove the structure and keep a deterministic backup.

| Dimension | Score 1-5 | Notes |
|---|---:|---|
| Structure fit | 5 | One moving boundary exactly matches the idea |
| Exactness | 5 | No invented figures |
| Brand fit | 4 | Strong Cobalt Grid direction |
| Mobile legibility | 4 | Readable after polish pass; generated candidate has cleaner spacing |
| Publish readiness | 4 | Strong backup/control, but GPT candidate is cleaner as the final still |

## 5. Final Decision

**Chosen lane:** GPT Image 2

**Final rationale:** the GPT Image 2 candidate preserved the exact moving-boundary logic while tightening the crop and simplifying the overall composition. The HTML control remains the deterministic backup and structure proof.

**Reusable seed:** "The Shifting Boundary" is reusable for any contract, risk, cost, or ownership topic where the same event lands differently depending on commercial terms.
