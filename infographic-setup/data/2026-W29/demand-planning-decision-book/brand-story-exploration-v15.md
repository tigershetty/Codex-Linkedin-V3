# Brand Story Exploration v15 — Background + Text QA

## User Feedback Incorporated

Keep:

- v14 glass/acrylic artifact quality,
- v14A heading confidence,
- v14B decision miniatures and differentiated lens architecture,
- demand-planning labels that make the artifact understandable without the caption.

Fix:

- reduce the synthetic AI-showroom background,
- make the environment feel like an edited design-studio photograph,
- verify load-bearing chart labels,
- correct the Decision Lens semantics so `FORECAST`, `ACTUAL`, and `ROOT ASSUMPTION` do not share the same visual anchor.

## Candidate A

**Prompt:** `gpt-image-2-prompt-v15a-background-text-qa.md`  
**Generated file:** `gpt-image-2-candidate-v15a-background-text-qa.png`  
**Artifact:** Demand Planning Decision Table  

**What improved:** The background now reads more like a photographed planning studio with a real tabletop, muted wall texture, and shallow planning-board context. The table remains highly readable, the evidence rail is intact, and the legend/context/decision text is clean.

**QA read:** `FORECAST`, `ACTUAL`, `MISS`, and `ASSUMPTION TEST` each have clear meaning. Decision labels and actions are readable. This is the safer business artifact.

**Residual risk:** The desk/notebook edge adds human realism, but if we want stricter artifact-only composition, future prompts should explicitly block foreground notebooks and papers.

## Candidate B

**Prompt:** `gpt-image-2-prompt-v15b-background-text-qa.md`  
**Generated file:** `gpt-image-2-candidate-v15b-background-text-qa.png`  
**Artifact:** Demand Planning Decision Lens  

**What improved:** The background no longer feels like a pristine AI corridor. It has softer editorial depth, tactile tabletop shadows, and more believable planning-room context. The central lens remains a stronger creative departure from SC OS.

**QA read:** `FORECAST` points to the cobalt curve, `ACTUAL` points to the coral curve, and `ROOT ASSUMPTION` points to the central inspected marker. This directly fixes the v14 concern where the label logic could be read as pointing to the same thing.

**Residual risk:** If this becomes final, the exact-logo production layer should be handled separately rather than patched over the generated logo area.

## Recommendation

Use **Candidate B** if the goal is a more ownable, differentiated Shetty's Desk artifact.

Use **Candidate A** if the goal is maximum immediate readability and lower risk.

The best next production route is B's lens architecture with A's slightly more operational/table-like clarity if one final synthesis is needed.

## Reusable Learning

- Background realism is now a first-class QA gate. Luminous and premium should not become sterile blue sci-fi.
- A human-edited planning studio background needs matte texture, shallow depth, real tabletop shadows, faint printed planning artifacts, and less symmetrical glow.
- Every chart label needs a single visual anchor. If two labels point to the same curve/point, the render fails even if the image looks beautiful.
- Context labels beat anonymous icons. A supply-chain reader should know what the symbol means without guessing.
- SC OS is still the quality benchmark, but v15 proves the same brand story can support very different artifact architectures.
