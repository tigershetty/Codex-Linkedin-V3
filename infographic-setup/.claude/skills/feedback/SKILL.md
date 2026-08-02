---
name: feedback
description: Capture Tiger's qualitative judgment after a caption, visual, artifact, or published package is approved, revised, or rejected. Use for /feedback requests to attach exact feedback to Creative Genome bundle and element IDs and turn it into a concrete adaptation instruction.
---

# Feedback

Record Tiger's judgment as first-party learning about the current adaptation.

## Resolve context

1. Find the slug and published or reviewed asset.
2. Read `reference-bundle.json` and identify the relevant hook, visual, explanation, save, and artifact element IDs.
3. Read existing feedback before appending. Never overwrite Tiger's earlier words.

## Capture the feedback

Use notes already supplied by Tiger. Ask only for missing information that changes the learning:

1. What worked or felt worth keeping?
2. What felt confusing, generic, excessive, off-voice, or unusable?
3. Which exact change should the next adaptation make?

Do not ask Tiger to classify a hook taxonomy or assign a universal score.

## Write the entry

Append to `memory/feedback-log.md`:

```markdown
## {date} — {content_id}

- Creative bundle: {creative_bundle_id}
- Genome references: {genome_reference_ids}
- Creative elements: {creative_element_ids}
- Asset and status: {caption|visual|artifact|package} / {approved|revise|rejected}
- Element IDs reviewed: {ids}
- Tiger's exact feedback: {verbatim}
- Keep: {specific mechanism}
- Change: {specific adaptation}
- Next-use instruction: {one executable instruction}
```

Record which element the instruction applies to. Separate Tiger's exact words from Codex's interpretation.

## Preserve source status

Apply approval or rejection to this output and its adaptation. Never invalidate or downgrade the saved reference. If Tiger rejects the borrowed mechanism itself, record `do_not_reuse_for_shettys_desk` on the element-learning layer while preserving its positive saved signal.

Confirm the file, content ID, bundle ID, element IDs, and appended instruction.
