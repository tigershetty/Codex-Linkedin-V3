# Visual Output Review — Supplier Flexibility Matrix

**Week:** 2026-W28  
**Slug:** supplier-flexibility-matrix  
**Candidate:** `gpt-image-2-candidate-v8-logo-locked.png`  
**Reviewer:** Codex  
**Date:** 2026-07-01  

## 1. Feed-Size Read

**What the eye sees first:** A large cobalt editorial question above a dense, ranked supplier flexibility matrix.  
**What the reader understands in 2 seconds:** This is a practical supplier ranking/check template for deciding who can absorb a demand spike and who needs verification.  
**What makes this worth saving:** The image has the right ambition and reference-card density, but it is not publish-ready because the rendered text/asset quality and status logic are not reliable enough.

## 2. Scores

| Dimension | Score 1-5 | Notes |
|---|---:|---|
| Stop-scroll clarity | 5 | The headline is large and editorial while the matrix remains instantly recognizable. |
| Save utility | 4 | Supplier rows, flexibility columns, row tags, scale guide, constraint key, confidence guide, workflow, and verification column make it useful, but the repeated tiny text lowers practical usability. |
| Reference adaptation | 5 | Strong transfer of ref 87 row mechanics, ref 70 workflow logic, and ref 5 saveable-card completeness. |
| Shetty's Desk originality | 4 | The Claude -> Matrix -> Action strip plus planner verification is ownable, but the logo lock creates a boxed/clipped artifact and does not feel integrated. |
| Visual argument | 4 | The image shows supplier flexibility as measurable dimensions, but the status logic is contradictory: risk rows still show Ready/Evidence checked. |
| Brand ownership | 3 | Cobalt/cream language is strong, but the Shetty logo overlay is visually poor and the Claude mark crowds the label. |
| Mobile readability | 3 | The main matrix is readable, but repeated lower/higher/faster/slower and verify text make the card too busy at mobile size. |
| Text/data integrity | 2 | Text is mostly spelled correctly, but placement and logic fail: duplicated Call first, repeated Ready/Evidence checked on risky suppliers, unhelpful trophy cue, and logo/render artifacts. |

**Average excluding text/data integrity:** 4.0  
**Publish decision:** regenerate / use HTML control until rendered text and logo quality pass

## 3. Rendered Asset QA

- [x] No rendered text distortion, malformed letters, clipped words, or spelling drift
- [ ] No repeated or misplaced text outside the approved placement map
- [ ] No logo approximation, logo clipping, boxed logo artifact, or bad overlay placement
- [ ] No visual/data contradiction between labels, status tags, icons, and implied ranking
- [ ] No tiny repeated text that hurts mobile readability
- [ ] No decorative marks that imply unapproved meaning

Observed failures:

- The Shetty logo overlay sits in a visible cream box, clips/crowds the footer, and does not feel like native brand chrome.
- Supplier A and Supplier B both use `Call first`; the artifact should either justify that explicitly or force one primary call.
- `Watch risk` rows still show `Ready` and `Evidence checked`, which contradicts the implied operating decision.
- The repeated cell labels `Lower`, `Higher`, `Faster`, `Slower`, `Ready`, and `Evidence checked` make the image too text-heavy for mobile.
- The trophy icon in the top-left matrix header implies a ranking/award cue that is not defined in the content.
- The Claude symbol is oversized and crowds the `Claude` label.

## 4. Hard-Fail Check

- [x] No misspelled or incorrect text
- [x] No invented numbers or supplier names
- [ ] Real Shetty logo locked via deterministic overlay
- [x] Not a generic dashboard/card grid
- [x] Contains a reusable artifact
- [x] Clear audience job
- [ ] Feels ownable to Shetty's Desk

## 5. Fix Path

**If revising prompt, change the:** text hierarchy / row status logic / logo treatment / legend density  
**Specific next prompt change:** Reserve fewer repeated text strings inside cells, force exactly one `Call first`, make risky rows fail verification visually, and reserve a clean blank footer logo zone for deterministic compositing.  
**Final note:** Candidate v8-logo-locked proves the value-density direction, but it fails publish QA. Do not publish this render.
