# Visual Comparison — Optimal Batch Size Decision Board

**Week:** `2026-W30`  
**Slug:** `optimal-batch-size-decision-board`  
**Primary lane:** GPT Image 2  
**HTML/control lane:** skipped per current user direction; no backup render required  

## Candidate Log

| Candidate | Lane | Status | Notes |
|---|---|---|---|
| `gpt-image-2-candidate-v1.png` | GPT Image 2 | base render | Strong structure, readable title, EOQ core, cost curve, option lanes, and verification strip. Needed deterministic tool/brand finishing. |
| `gpt-image-2-candidate-v1-openai-clean.png` | post-production | not selected | Exact OpenAI mark added; Shetty placard left generated. Strong but not fully brand locked. |
| `gpt-image-2-candidate-v1-logo-clean.png` | post-production | rejected | Full wordmark crop created a white sticker effect and damaged the placard. |
| `gpt-image-2-candidate-v1-logo-test-no-cover.png` | post-production | rejected | Exact wordmark without cover became visually muddy on top of the generated nameplate. |
| `gpt-image-2-candidate-v1-logo-final.png` | post-production | rejected after review | Exact mark component over generated placard text created an incorrect double-logo feel. |
| `gpt-image-2-candidate-v1-logo-rectified-v3-navy-inset.png` | post-production | superseded | Exact official Shetty's Desk terracotta/white components rebuilt into a placard-safe horizontal lockup on a navy identity inset; later failed tool-logo QA because the ChatGPT chip still had duplicated/generated logo artifacts. |
| `gpt-image-2-candidate-v1-logo-rectified-v5-chatgpt-lock.png` | post-production | superseded | Keeps the official Shetty's Desk navy inset and rebuilds the ChatGPT chip with the exact repo icon-only asset, one controlled label, and no duplicated generated logo. Later superseded because the formula still used calculator-style `SQRT(2DS/H)` notation. |
| `gpt-image-2-candidate-v1-logo-rectified-v7-formula-lock.png` | post-production | selected | Preserves the logo fixes and redraws the EOQ core as proper mathematical notation: square root over a stacked `2DS` over `H` fraction. |

## Final Pick

**Selected visual:** `visual.png` from `gpt-image-2-candidate-v1-logo-rectified-v7-formula-lock.png`  
**Reason:** strongest balance of visual quality, readability, brand feel, deterministic logo correctness, and mathematical formula correctness. The render keeps the original GPT Image 2 composition, exact Shetty's Desk identity inset, clean ChatGPT chip, and premium white/azure artifact language while replacing the calculator-style formula with proper square-root/fraction notation.  

## Reusable Learning

Formula posts should not become plain cheat sheets. The stronger Shetty's Desk route is to make the formula the start of a decision artifact: input pack, formula core, cost curve, option comparison, trade-off check, and planner verification.

Formula learning: if the formula is the hero, do not accept calculator syntax such as `SQRT(2DS/H)` as final. Use proper mathematical notation, with a visible radical and a stacked fraction when the division is part of the formula.

Logo learning: never preserve AI-generated Shetty's Desk wordmarks or generated/duplicated tool marks as a "clean enough" fallback. If the scene needs a horizontal nameplate but the official asset is stacked, either create a controlled dark identity inset using official components, prompt a taller plate for the stacked lockup, or add a proper official horizontal lockup asset before final rendering. For tool chips, rebuild the chip if necessary so the final has one exact asset, visible padding, and no ghosted model-drawn logo underneath.
