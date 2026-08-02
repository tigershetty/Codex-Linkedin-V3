---
name: "101"
description: Build or revise a Supply Chain 101 post from an approved practitioner decision. Use for /101 requests, accessible supply-chain explainers, decision artifacts, captions, and visuals that begin with Creative Genome retrieval, apply claim-proportionate support, and preserve Tiger's approved voice when used.
---

# Supply Chain 101

Build one useful explanation for a real supply-chain decision. Treat the calendar as a candidate bank, not an instruction to publish.

## Start with the Creative Genome

1. Read `references/creative-genome/active-manifest.json` and the active genome snapshot.
2. Read the slug's `content-brief-v2.md` when present. Define the target role, live decision, stakes, care statement, artifact, and channel job.
3. Create or update `data/{week}/{slug}/reference-query.json`.
4. Retrieve positive saved-post elements and the closest Tiger performance precedents. Treat every saved post as a positive creative signal.
5. Inspect the actual visual for any visual candidate. Do not infer visual mechanics from a preview flag.
6. Select two to four curated references plus relevant, separate Tiger precedents. Record the hook, visual, explanation, save, and artifact mechanics in `reference-bundle.json`.
7. Recombine mechanisms, never wording, creator branding, unsupported claims, or subject matter.

Do not use a fixed hook taxonomy, force a reference count, or assign a universal content score. Rank references by fit to this reader and decision.

## Route the claims

Choose the content mode after recombination. Match support to each planned claim:

- For a framework, checklist, visual map, or workflow, verify the logic, attribution, scope, and failure boundary. A full research brief is optional.
- For facts, formulas, calculations, comparisons, or company outcomes, run `research-engine` at the depth needed and keep traceable claim IDs.
- For an editorial explanation without load-bearing external facts, keep the support ledger in `content-brief-v2.md` and do not manufacture a case.
- Present simulation only when explicitly selected and labelled. Keep internal software fixtures outside public proof, hooks, and outcomes.
- Route Tiger experience, beliefs, and first-person authority through `tiger-source.md` and `references/tiger-source-gate-v1.md`.

Narrow or remove an unsupported claim before discarding the whole idea.

## Build the post

1. Write the reader contract in one sentence: `For [role] in [moment], this helps them [understand, decide, or act] because [reason it matters].`
2. Draft the strongest opening from the selected creative tension and supported claims. Offer an alternative only when it tests a materially different promise.
3. Explain the decision in plain language while preserving the real operating boundary.
4. Give the reader a reusable formula, map, decision rule, checklist, or artifact when it improves the task.
5. Apply `tiger-voice.md`. Use connected reasoning, specific language, and an approved stance. Avoid fixed paragraph counts, fixed sign-offs, and generic engagement questions.
6. Keep the caption and visual complementary. Let the caption explain why; let the visual make the decision or system legible.

## Build the visual

1. Run `layout-select` with `reference-bundle.json` and the claim-support file required by the selected mode.
2. Build one primary visual argument. Create another only when it tests a different argument, not a recolour.
3. Use GPT Image 2 for editorial composition and HTML/code-render for exact tables, formulas, charts, or text-heavy controls.
4. Use the current brand frame and exact logo assets. Insert exact text, numbers, and logos deterministically when generation could distort them.
5. Promote only an explicitly approved still to `visual.png`. Apply the existing motion eligibility gate afterward; do not alter `gif-storyboard`.

## Required package

- `reference-query.json`
- `reference-candidates.json`
- `reference-bundle.json`
- `support-note.md` or `research-brief.md` when the claim route requires it
- `content-brief-v2.md`
- `tiger-source.md` when required
- `linkedin-caption.md`
- `creative-brief-lite.md`
- `visual-output-review.md`
- approved `visual.png`
- `publish-manifest.json` after explicit approval

## Stop conditions

Stop production when the care statement is weak, the central claim cannot be supported or narrowed, the selected comprehension mechanic has not been inspected, a public number lacks a claim ID, or required Tiger authority is still unapproved. Report the missing decision instead of filling the gap.
