# Infographic Setup — Active Agent Instructions

This folder is the active LinkedIn content engine for Shetty's Desk.

## Start Here

1. Read `../tiger-voice.md` for voice.
2. Read `CLAUDE.md` for the current pipeline map and operational gotchas.
3. Read `references/audience-intelligence.md`, `references/topic-selection-scorecard.md`, and `references/top100-reference-intelligence.md` before accepting a topic into production.
4. Read `references/visual-engine-v2.md` before creating any new visual.
5. Read `references/creative-engine-v3-lean.md` before creating or judging a GPT Image 2 prompt.
6. For flagship visuals, read `references/holy-grail-visual-standard.md` before writing the prompt. The benchmark example is `data/2026-W28/supply-chain-resilience-os/visual.png`.
7. For AI-for-SC flagship visuals/captions, read `references/workflow-learning-2026-07-08-demand-review-to-sequence-board.md` so the post starts with the input pack, tool artifact, meeting payoff, and deterministic logo plan.
8. Before animating any approved still, read `references/motion-engine-v1.md`. Motion is a layout-adaptive finishing lane, not a reusable EOQ animation template.
9. Use `references/master-calendar.md`, `references/101-plan.md`, and `references/ai-for-sc-plan-v2.md` as candidate banks, not as blind autopilot.
10. Use `references/calendar-reference-adaptation-map-v1.md` to convert calendar candidates into reference-proven promises, power formats, and save triggers.

## Current Visual Workflow

Visual Engine v2 is active:

- **Primary creative renderer:** ChatGPT / GPT Image 2.
- **Backup and comparison lane:** HTML/code-render via `renderer/`.
- **Brand seed:** `references/brand-kits/cobalt-grid/FRAME.md`.
- **Reference intelligence:** `references/top100-reference-intelligence.md` maps the top-100 images + captions into power formats, stop-scroll promises, save triggers, and prompt inputs.
- **Caption lookup:** `references/top100-caption-index.md` is the lean generated index from the caption workbook; use it before opening the full `.xlsx`.
- **Creative QA:** `references/creative-engine-v3-lean.md` defines the one-page brief, GPT Image 2 prompt preflight, output review, and package audit.
- **Holy Grail standard:** `references/holy-grail-visual-standard.md` defines the artifact-first benchmark from `data/2026-W28/supply-chain-resilience-os/visual.png`; use it for flagship posts that should feel save-worthy and world-class.
- **Comparison artifact:** use `templates/visual-comparison-template.md` for flagship posts.
- **Motion companion package:** after `visual.png` is approved, default to `visual.png` + `visual-motion.gif` + `visual-motion.mp4`. Use `references/motion-engine-v1.md`, `node scripts/init-motion-project.mjs data/{week}/{slug}`, and the motion brief/shot-plan/QA templates. The still remains canonical; choreography must follow the visual's own layout and reading order. Record a still-only exception only when the motion eligibility sentence is genuinely weak.

The goal is reference-fidelity first: a world-class editorial infographic, not a generic dashboard.

## Current Content Workflow

Before research, hooks, captions, or visuals:

- define the audience segment,
- score the topic with `references/topic-selection-scorecard.md`,
- define the top-100 reference fit: power format, caption promise, save trigger, and Shetty's Desk originality,
- define the Holy Grail fit for flagship visuals: operating artifact, meeting moment, supply-chain scene, content backbone, module map, and logo plan,
- create a content brief from `templates/content-brief-v2-template.md` for major posts,
- create a creative brief from `templates/creative-brief-lite-template.md` before prompting GPT Image 2,
- compile the GPT Image 2 prompt with `node scripts/compile-gpt-image-prompt.mjs data/{week}/{slug}`,
- review the rendered output with `templates/visual-output-review-template.md`,
- run `node scripts/audit-visual-package.mjs data/{week}/{slug}` before treating a flagship visual as complete,
- only after the still passes QA, apply the motion eligibility gate in `references/motion-engine-v1.md`; build the standard GIF/MP4 companion when sequence or reveal improves the argument, otherwise record the still-only exception,
- run `node scripts/audit-motion-package.mjs data/{week}/{slug}` before treating an eligible still + motion package as complete,
- use `templates/weekly-signal-scan-template.md` when selecting a full week.

The calendar is a candidate library. Audience demand, save utility, research strength, and Tiger's authority decide what actually gets built.

For RW03-RW12, read `references/editorial-rebuild-next-12-weeks.md` before using the old calendar row.
For RW03-RW12, also read `references/calendar-reference-adaptation-map-v1.md` before drafting the content brief or visual prompt.

## Rules

- Always check for existing files before creating new ones.
- Never delete files without explicit approval.
- Never install packages silently.
- Keep generated artifacts traceable to a prompt, references, and a final comparison note.
- Do not invent numbers, deltas, dates, or claims. Every load-bearing fact must come from the research brief or approved source material.
- For motion, the first and final lossless frames must match the approved `visual.png` exactly. Never animate raw rectangular crops, approximate logos, or moving body text.
