# Holy Grail Visual Standard

**Created:** 2026-07-02  
**Status:** Active north-star standard for flagship visuals  
**Canonical example:** `data/2026-W28/supply-chain-resilience-os/visual.png`  
**Supporting prompt seed:** `data/2026-W28/supply-chain-resilience-os/gpt-image-2-prompt-v2.md`  
**Companion files:** `visual-engine-v2.md`, `creative-engine-v3-lean.md`, `artifact-creator-mining-v1.md`, `top100-reference-intelligence.md`

## 1. Why This Is The Standard

The `supply-chain-resilience-os` render is the first output in this repo that reached the target Tiger described as world-class:

- It stops the scroll at thumbnail size.
- It feels like a premium operating artifact, not a generic infographic.
- The central object is useful enough to save, print, and use before a meeting.
- The 3D/isometric desk scene gives status and depth without becoming an irrelevant hero.
- The supply-chain context is visible before reading any small labels.
- The logo placement feels like authorship, not decoration.

This is now the benchmark. Future flagship visuals should be judged against it, not against average LinkedIn posts.

Important: the benchmark is a quality and brand-story standard, not a single layout to repeat. Future posts should feel like they come from the same high-end Shetty's Desk design studio, while choosing the artifact architecture that best fits the topic. A demand-planning artifact may be a decision ledger, forecast board, control-table, or assumption map. A procurement artifact may be a negotiation map or contract pack. A resilience artifact may be an operating system. The family resemblance should come from craft, palette discipline, authorship, dimensional polish, and usefulness, not from copying one composition.

## 2. The Formula

The winning pattern is:

> premium one-page operating artifact + supply-chain-native 3D scene + restrained brand authorship + exact post-production cleanup

Do not interpret this as "make everything look like the same resilience poster." Interpret it as a production grammar:

| Layer | Requirement |
|---|---|
| Artifact promise | The image must promise a reusable tool: OS, playbook, field manual, decision map, diagnostic, scorecard, review pack, checklist, operating model, or one-page book. |
| Reader job | The artifact must be useful before a real task: supplier review, S&OP meeting, disruption call, inventory audit, forecast review, negotiation, QBR, AI workflow test. |
| Supply-chain hero | The hero scene must be native to the topic: port, supplier, warehouse, route, factory, risk radar, planning desk, control tower, inventory shelf, contract pack, or operating table. |
| Module diversity | If the image contains multiple modules, they must use different visual logics: wave, network, route, curve, hub, loop, matrix, stack, decision tree, anatomy, map. Repeated identical cards are not enough. |
| Brand ownership | The Shetty's Desk palette and logo must feel authored into the piece. Logos should be exact assets or carefully post-processed, not guessed by the renderer. |
| Text discipline | GPT Image 2 can create the artifact composition, but exact-text and logo cleanup remain QA-critical. |
| Background realism | Premium/luminous must not become sterile AI-showroom. Use human-edited studio cues: matte texture, shallow depth of field, tactile shadows, faint printed planning artifacts, and restrained environmental detail. |
| Semantic anchoring | Every label, leader line, icon, and chart mark must have one clear meaning. If two labels point to the same object, or a root-cause marker points to the wrong curve, the render fails. |

## 2A. Brand Story, Not Layout Replication

Every flagship artifact should make the reader feel: "This is unmistakably Shetty's Desk." That does not mean every image uses Ref 19, a poster grid, or the SC OS composition.

The consistent brand story is:

- luminous white / pale-blue operating space,
- azure and navy structural system,
- eco-green only for progress, learning, recovery, or positive signal,
- coral only for risk, miss, bias, or exception,
- premium supply-chain physical staging,
- useful artifact first, decoration second,
- restrained Shetty's Desk authorship,
- consulting-grade hierarchy and spacing,
- dense but readable practitioner value,
- believable edited-studio environments rather than generic synthetic corridors.

For current 3D/isometric flagship posts, use this stricter brand lock when prompting:

| Role | Color / Treatment |
|---|---|
| Ground | luminous white / very pale blue, close to `#F7FBFF` and `#EAF3FF` |
| Structure | cobalt / azure rails and glass edges, close to `#1F2BE0` and `#2798FB` |
| Ink | deep navy, close to `#15315C` or darker |
| Risk / miss / exception | coral only, close to `#D97757` / `#C15F3C` |
| Positive / verified / protected flow | eco-green only, close to `#1E9B6C` / `#2DBE7E` |
| Typography feel | large navy/azure title hierarchy like SC OS and Production Plan; compact uppercase sans labels; avoid ornate old-style serif drift |

Avoid warm beige plaque endings, purple/orange cube palettes, colorful SaaS dashboard accents, or decorative color that is not carrying semantic meaning.

The variable artifact architecture is topic-specific:

| Topic Need | Better Artifact Type |
|---|---|
| Decide between options | decision board, decision tree, operating map |
| Diagnose a failure | diagnostic board, anatomy, failure map |
| Run a meeting | field manual, agenda board, control room |
| Compare concepts | boundary card, versus map, split artifact |
| Track performance | scorecard, control chart, operating dashboard |
| Explain a flow | process panorama, system map, route table |
| Teach a reusable method | playbook, one-page book, checklist, formula card |

Use topic-specific references to choose the artifact type. Use the Shetty's Desk brand system to make it feel like part of the same authored world.

## 3. Required Inputs Before Rendering

Every flagship post must gather these inputs before writing the GPT Image 2 prompt:

```md
HOLY GRAIL FIT:
What makes this topic worthy of a premium operating artifact?

OPERATING ARTIFACT:
What would the reader save and use later?

MEETING MOMENT:
Where would this artifact be useful in real work?

SUPPLY-CHAIN SCENE:
What physical/operational world should surround the artifact?

CONTENT BACKBONE:
Which legitimate framework, process, dataset, or practitioner logic gives it substance?

MODULE MAP:
What 5-9 submodules belong on the artifact, and what distinct visual metaphor should each use?

TEXT LOCK:
Which exact strings may appear, and which areas must stay text-free?

LOGO PLAN:
Which logos are model-rendered cues, and which must be post-processed from repo assets?
```

If any answer is weak, do not render yet.

For named tool logos in AI-for-SC posts, do not ask GPT Image 2 to reproduce the logo. Ask it to reserve a small chip or icon slot, then overlay the exact repo asset after generation. Current deterministic assets include `renderer/assets/logos/claude-color.png`, `renderer/assets/logos/claude-color.svg`, `renderer/assets/logos/openai.svg`, `renderer/assets/logos/copilot-color.svg`, and `renderer/assets/logos/shettys-desk-logo-2.png`.

Deterministic logo overlays must be treated as production finishing, not decoration:

- the GPT render should reserve a blank chip/plate that already looks designed into the scene,
- tool logos should sit inside the intended icon slot without an added background box,
- the Shetty's Desk logo should sit inside the placard/plate with safe top and bottom padding,
- if the plate is horizontal, trim transparent canvas before scaling so the visible lockup fits the plate,
- inspect a tight crop of each logo zone before promoting the output to `visual.png`.

## 4. Reverse-Engineering Recipe

Use this sequence for each new flagship visual:

1. **Name the artifact.** Use an object name that feels save-worthy: `Supply Chain Resilience OS`, `Supplier Review Field Manual`, `Demand Planning Decision Book`, `Procurement Negotiation Map`.
2. **Pick the reader's meeting.** The image must help with one concrete moment, not "educate everyone."
3. **Choose the operating backbone.** Use SCOR, APQC, TTS/TTR, Kraljic, S&OP, inventory math, forecast decomposition, QBR scorecards, contract clauses, or role-specific AI workflows.
4. **Design the artifact modules.** Each module needs a distinct geometry that explains the point.
5. **Stage it in a premium supply-chain scene.** The scene supports the artifact: desk, control room, port table, warehouse table, planning wall, factory floor model.
6. **Prompt GPT Image 2 openly but with text lock.** Let it compose the studio-quality artifact and scene. Do not over-specify the layout like HTML.
7. **Do surgical cleanup only.** Remove wrong tool chips, bad source lines, or logo artifacts while preserving the successful render angle and depth.
8. **Set the final as `visual.png`.** Keep failed variants, but mark the chosen one clearly in review notes.

## 5. Prompt Pattern

Use this prompt block in addition to the normal Creative Engine v3 prompt:

```md
HOLY GRAIL CALIBER:
Use `supply-chain-resilience-os/visual.png` as the quality bar: a premium one-page operating artifact staged in a clean 3D/isometric supply-chain desk scene. Do not copy that topic or layout exactly. Match the level of clarity, depth, usefulness, dimensional polish, and brand authorship.

ARTIFACT-FIRST DIRECTION:
The artifact is the hero. The surrounding 3D scene supports the topic and adds credibility, but it must not steal attention from the operating tool.

MODULE DIVERSITY:
Use distinct visual metaphors across the artifact modules. Avoid repeated equal cards unless the topic is explicitly a comparison table.

POST-PRODUCTION PLAN:
Leave a clean logo zone for the exact Shetty's Desk logo. Avoid source text or tool chips unless they are explicitly requested. If a tool/logo is used, it must be small and removable without damaging the composition.
```

## 6. QA Gate

A render cannot be called Holy Grail caliber unless all of these are true:

- [ ] The artifact name is readable at feed size.
- [ ] The visual has an immediate premium 3D/isometric presence.
- [ ] The artifact looks useful without needing the caption.
- [ ] The supply-chain topic is obvious from the scene or modules.
- [ ] The module logic is varied and meaningful, not repeated decoration.
- [ ] The Shetty's Desk logo is clean, centered or intentionally placed, and not clipped/boxed/warped.
- [ ] Any removed chip/source/footer cleanup preserves the original angle, shadows, desk props, and composition.
- [ ] No wrong, misspelled, or hallucinated load-bearing text remains.
- [ ] Chart labels point to the exact visual element they describe; no two labels share the same wrong anchor.
- [ ] Context icons are labeled or visually self-explanatory; no decorative logo-like marks that require private knowledge.
- [ ] The background feels like a high-end edited artifact scene, not a sterile AI showroom, sci-fi corridor, or generic hologram wall.
- [ ] Failed cleanup variants are not promoted to `visual.png`.
- [ ] The user/taste verdict agrees with the score. A self-scored review cannot override Tiger's visual judgment.
- [ ] The output does not feel like a toy-like icon sheet, generic vector template, or cartoon workbook when compared side-by-side with `supply-chain-resilience-os/visual.png`.
- [ ] "Uses the same references" is not enough. It must match the benchmark's finish: elevated artifact depth, consulting-grade hierarchy, restrained color, authored texture, and premium physical staging.

## 6A. Caption QA Gate

Every Holy Grail post must ship with a caption file that includes 10 hook options before the recommended caption. The 10 hooks should cover different structural devices from the local hook taxonomy, open with different first words where possible, and avoid sounding like tiny variations of the same line.

Voice QA should be explicit:

- [ ] The verdict says whether the first draft sounds like Tiger or only sounds polished.
- [ ] The caption has connective reasoning, not a hook followed by a neat list.
- [ ] The core opinion is clear enough that the reader knows what Tiger believes.
- [ ] The practical meeting-room value is visible.
- [ ] The CTA asks a real operating question, not a generic engagement prompt.

For AI-for-SC captions, apply the Demand Review To Sequence Board learning:

- [ ] Lead with the tool's useful output, not a warning.
- [ ] Name the input pack the reader can gather.
- [ ] Name the artifact the tool can build: board, matrix, review pack, checklist, prompt, model, or decision tree.
- [ ] Show the meeting-room payoff in plain language.
- [ ] Keep the main caption in the same range as accepted 101 captions, usually about 250-330 words unless the topic truly needs more.
- [ ] Boundary/risk logic belongs in the brief by default; include an explicit warning sentence in the published caption only when it strengthens the post.
- [ ] The hook should be specific enough to publish as the first line, not merely a label for the visual.

## 7. Failure Modes From This Session

These are specifically banned as final paths:

| Failure | Why it failed |
|---|---|
| Flat footer-band cleanup | It destroyed the successful desk angle and made the image feel patched. |
| Over-broad deterministic repaint | It preserved the artifact but broke the premium scene continuity. |
| Logo replacement with mismatched asset treatment | It ignored the user's request to keep the same Shetty's Desk logo feel. |
| Model redraw of the whole image for a small edit | It risks losing the exact composition that made the image work. |
| Warm workbook drift | It follows the topic but loses the luminous Holy Grail brand system. |
| Cartoon vector simplification | It uses the right labels and colors but feels like a toy diagram instead of a high-end design-studio artifact. |
| Self-scored audit pass | It can make a weak visual look "approved" on paper because the review is written by the same process that produced it. Tiger's visual verdict overrides this. |
| AI showroom background | It looks premium at first glance, but the sterile glowing corridor, hologram panels, and too-perfect symmetry reveal the model instead of the design studio. |
| Semantic label collision | It looks polished, but a label points to the wrong curve, two labels point to the same point, or an icon has no readable meaning. This destroys trust. |

Correct behavior:

> Preserve the successful generated composition. Change only the explicitly requested elements.

For new flagship renders, correct behavior also means:

> Do not promote a visual to `visual.png` as final until it has passed a side-by-side visual comparison against the canonical benchmark. If the result is only directionally closer, name it as a candidate, not as the final.

## 8. Candidate Topics That Fit This Standard

- Supplier Review Field Manual
- Demand Planning Decision Book
- Procurement Negotiation Map
- Inventory Positioning OS
- S&OP Meeting Control System
- Contract Risk Operating Manual
- AI Planning Copilot Field Guide
- Forecast Exception Triage Board
- Supplier Recovery Playbook
- Replenishment Cadence OS

Not every post needs this level. Use it for flagship posts where the image should become a save-worthy artifact and brand-defining benchmark.
