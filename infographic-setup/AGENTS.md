# Infographic Setup — Active Agent Instructions

This folder is the active LinkedIn content engine for Shetty's Desk.

## Start Here

1. Read `../tiger-voice.md` for voice.
2. Read `CLAUDE.md` for the current pipeline map and operational gotchas.
3. Read `references/audience-intelligence.md`, `references/content-demand-proof-gate-v1.md`, and `references/topic-selection-scorecard.md` before accepting a topic into production.
4. Read `references/top100-creator-attribution-and-audit-2026-07.md` before treating a Top-100 reference as creator or performance proof. `top100-reference-intelligence.md` remains a visual-mechanics source.
5. Read `references/visual-engine-v2.md` before creating any new visual.
6. Read `references/creative-engine-v3-lean.md` before creating or judging a GPT Image 2 prompt.
7. For flagship visuals, read `references/holy-grail-visual-standard.md` before writing the prompt. The benchmark example is `data/2026-W28/supply-chain-resilience-os/visual.png`.
8. For AI-for-SC flagship visuals/captions, read `references/workflow-learning-2026-07-08-demand-review-to-sequence-board.md` so the post starts with the input pack, tool artifact, meeting payoff, and deterministic logo plan.
9. For AI-for-SC education posts, read `references/ai-creator-education-growth-playbook.md`, `references/ai-work-surfaces-benchmark-2026-07.md`, and `references/linkedin-creator-benchmark-50-2026.md`. Lead with one memorable supply-chain distinction, then teach the current execution layer: persistent method, connected context, specialized work, a control gate, a finished artifact, and operating cadence. Ordinary chat is a scratchpad, not the flagship capability story.
10. Read `references/render-first-improve-second-v1.md` before beginning a post package. Build the post draft first, then improve and approve it as one system.
11. Before animating any selected draft still, read `references/motion-engine-v1.md`. Motion is a layout-adaptive production lane, not a reusable EOQ animation template.
12. Before a post or resource moves to the website, read `references/publish-resource-handoff-v2.md` and `references/publish-asset-spec-v1.md`.
13. Use `references/master-calendar.md`, `references/101-plan.md`, and `references/ai-for-sc-plan-v2.md` as candidate banks, not as blind autopilot.
14. Use `references/calendar-reference-adaptation-map-v1.md` as adaptation history, not performance evidence.

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
- **Motion companion package:** during the Draft Sprint, build `visual-motion.gif` + `visual-motion.mp4` from the selected 1080 x 1350 still when motion can add sequence, dependency, comparison, state change, or decision logic. Use `references/motion-engine-v1.md`, `node scripts/init-motion-project.mjs data/{week}/{slug}`, and the motion brief/shot-plan/QA templates. Choreography must follow the visual's own layout; approval happens with the integrated package.

The goal is audience and argument fidelity first, then world-class visual execution when the evidence earns it.

## Current Content Workflow

Before research, hooks, captions, or visuals:

- define the audience segment,
- record at least three audience receipts from at least two source types and pass `references/content-demand-proof-gate-v1.md`,
- score the topic with `references/topic-selection-scorecard.md`,
- record lead-reference creator, original source, observed response, funnel, confidence, and whether it is reference-informed or performance-supported,
- define the Holy Grail fit for flagship visuals: operating artifact, meeting moment, supply-chain scene, content backbone, module map, and logo plan,
- for AI-for-SC, define one core professional distinction and the execution architecture using `references/ai-creator-education-growth-playbook.md`; verify named capabilities with `references/ai-work-surfaces-benchmark-2026-07.md`, score the caption with `references/linkedin-creator-benchmark-50-2026.md`, and do not present ordinary file-upload chat as a sophisticated workflow,
- create a content brief from `templates/content-brief-v2-template.md` for major posts,
- create a creative brief from `templates/creative-brief-lite-template.md` before prompting GPT Image 2,
- compile the GPT Image 2 prompt with `node scripts/compile-gpt-image-prompt.mjs data/{week}/{slug}`,
- review the rendered output with `templates/visual-output-review-template.md`,
- render GPT Image 2 portrait candidates at 1024 x 1536 with every meaningful element inside the centered 1024 x 1280 safe area,
- promote one exact 1080 x 1350 draft to both `visual.png` and `visual-linkedin.png`; the two files must be byte-identical,
- run `node scripts/audit-visual-package.mjs data/{week}/{slug}` before treating a flagship visual as complete,
- generate at least ten structurally distinct hooks and a caption draft during the same sprint; run Tiger voice QA and `skills/stay-human-shetty`,
- build motion before intermediate approvals when the value sentence is strong; otherwise record a draft still-only rationale,
- run `node scripts/audit-motion-package.mjs data/{week}/{slug}` before treating an eligible still + motion package as complete,
- create a resource plan for every post, but normally score and build it after the post package is approved and observed demand or strategic need is recorded; qualifying resources must publish transparent individual downloads, a branded instruction PDF plus Markdown guide, a safe first-run path using governed copies of the reader's own files, explicit output contracts, a download manifest, checksums, and validation; ZIP delivery is legacy-only,
- run `node scripts/audit-resource-package.mjs data/{week}/{slug}` before a qualifying resource enters the integrated approval checkpoint,
- inspect and improve the still + writing + motion package together, request explicit post-package approval, then construct and approve the warranted resource,
- initialize schema v2 with `node scripts/init-post-package.mjs data/{week}/{slug} --series ai-for-sc|sc101 [--resource-required]`; only the approved complete package and resource decision make the website `ready`,
- use MP4 for website motion previews and retain GIF for LinkedIn,
- use `templates/weekly-signal-scan-template.md` when selecting a full week,
- capture 1-hour, 24-hour, and 7-day learning in `post-performance-learning.md` before using the post as a historical prior.

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
- For new posts, `visual.png` and `visual-linkedin.png` must both be exactly 1080 x 1350, below 5 MB, and byte-identical. Keep model-native images as candidates; use a prompt-safe center crop for promotion and the non-cropping fit treatment only for legacy recovery.
- Never publish a draft caption or infer approval from a visual go-ahead. Website work begins only after the schema v2 ready audit confirms the approved post package and resource decision.
