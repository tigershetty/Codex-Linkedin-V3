# Workflow Learning — Demand Review To Sequence Board

**Date:** 2026-07-08  
**Source post:** `data/2026-W30/demand-review-to-sequence-board/`  
**Applies to:** AI-for-SC flagship visuals and captions

## What Worked

The winning direction combined a GPT Image 2 premium 3D/isometric artifact with deterministic logo finishing and a value-first AI caption.

The image worked once it became a real operating artifact: a demand review board feeding family impact, constraint checks, changeover risk, sequence options, and verification. The visual quality came from the board feeling useful before a meeting, not from generic AI polish.

The caption worked once it stopped centering on caveats and started centering on the actual capability: Claude can take scattered planning inputs and turn them into a planner-challengeable meeting board.

## What Slowed Us Down

- We promoted outputs too early based on internal QA instead of Tiger's visual verdict.
- We treated logo overlays as a final technical step, but they needed design-level placement checks.
- The AI-for-SC caption template pushed the post toward warning language instead of tool capability and reader value.
- Some render iterations preserved the topic but lost the brand story: luminous white/pale-blue field, navy/azure structure, coral for misses, green for verified flow, and premium physical staging.
- Some visual corrections risked repainting the full image when the right move was surgical cleanup only.

## New Workflow Rules

1. Start every AI-for-SC flagship with the value chain:
   - input pack the reader can gather,
   - tool output artifact,
   - meeting/workflow payoff,
   - boundary logic kept in the brief.

2. The published caption should lead with what the tool can build. Boundary or risk language is optional in the caption and should only appear when it strengthens trust without weakening engagement.

3. Target accepted 101-style caption length unless the user asks for deeper treatment: usually about 250-330 words.

4. Build hooks around real workflow tension, not generic AI promises. Strong hooks name the current tool or meeting gap, then the artifact the AI can help create.

5. For deterministic logos, ask GPT Image 2 to reserve blank built-in slots. Overlay exact assets after generation:
   - tool logos belong inside small chip/icon slots without added background boxes,
   - Shetty's Desk belongs on a plate/placard with safe padding,
   - trim transparent logo canvas before scaling,
   - inspect a tight crop before promoting to `visual.png`.

6. Do not regenerate a whole image to fix a logo, footer, source line, or chip unless the composition itself is wrong. Preserve the winning camera angle, depth, shadows, desk props, and visual hierarchy.

7. Do not call a render final just because the audit passes. For flagship visuals, Tiger's taste verdict can override the self-scored QA.

## Reusable Caption Pattern

```text
[Current tool/meeting limitation] can show [diagnostic], but [AI tool] can help turn it into [operating artifact / questions / decision board].

[Meeting consequence.]

[What the current system can already show.]

But the team still needs the next layer:
[2-5 practical questions.]

This is where [AI tool] becomes useful if we stop treating it like [low-value use] and start using it to build [artifact].

Give it [input pack].

Ask for [output artifact].

The useful output is [meeting artifact] with:
• [module]
• [module]
• [module]
• [module]

[Capability statement in Tiger voice.]

[Operating value.]

[Specific CTA question.]
```

## Reusable Visual Pattern

```text
Premium supply-chain operating artifact in a believable 3D/isometric scene.

Left: diagnostic signal.
Middle: translation layer / constraint bridge.
Right: options or decisions.
Bottom: verification / commitment strip.
Logo: exact deterministic asset on an authored plate.
Tool chip: exact deterministic asset inside a reserved slot.
```
