# Visual Output Review — Supplier Concentration Risk v2

**Week:** 2026-W28  
**Slug:** supplier-concentration-risk  
**Candidate:** `gpt-image-2-candidate-v2.png`  
**Reviewer:** Codex  
**Date:** 2026-07-01  

## 1. Feed-Size Read

**What the eye sees first:** the same strong headline and an improved many-suppliers-to-three-pillars dependency system.  
**What the reader understands in 2 seconds:** supplier count can hide dependency concentration.  
**What makes this worth saving:** the lower decision-test band is more useful than v1, but it includes model-invented text.

## 2. Scores

| Dimension | Score 1-5 | Notes |
|---|---:|---|
| Stop-scroll clarity | 5 | Still excellent. |
| Save utility | 5 | The model added a useful test band, which is directionally right. |
| Reference adaptation | 4 | Better artifact behavior than v1; still not fully controlled. |
| Shetty's Desk originality | 4 | Dependency/review logic feels relevant to procurement work. |
| Visual argument | 5 | Stronger than v1 because the pillars and test band work together. |
| Brand ownership | 4 | Cobalt Grid remains clear. |
| Mobile readability | 4 | Pillar labels are improved. |
| Text/data integrity | 2 | Hard fail: model invented extra in-image text not listed in the prompt. |

**Average excluding text/data integrity:** 4.4  
**Publish decision:** regenerate with stricter text lock

## 3. Hard-Fail Check

- [ ] No misspelled or incorrect text
- [x] No invented numbers, labels, logos, or supplier names
- [x] Not a generic dashboard/card grid
- [x] Contains a reusable artifact
- [x] Clear audience job
- [x] Feels ownable to Shetty's Desk

## 4. Fix Path

**If revising prompt, change the:** text lock  
**Specific next prompt change:** explicitly instruct GPT Image 2 to render only the listed text strings and not add section headers such as "PF6 TEST", "ASK THESE", or explanatory questions unless those strings are listed in CONTENT.  
**Final note:** v2 confirms the direction. The design is more useful than v1, but it cannot be final while text integrity fails.
