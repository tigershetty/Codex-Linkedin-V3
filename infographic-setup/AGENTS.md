# Infographic Setup — Active Agent Instructions

This folder is the active V4 audience-growth and content-production engine for Shetty's Desk.

## Start Here

1. Read `references/v4-audience-growth-operating-system.md`. It is authoritative for audience, cadence, channels, evidence, topic admission, and the Tiger source gate.
2. Read `../tiger-voice.md` for voice and `references/tiger-source-gate-v1.md` for authenticity and provenance.
3. Read `CLAUDE.md` for the current pipeline map and operational gotchas.
4. Read `references/audience-intelligence.md` and `references/topic-selection-scorecard.md` before accepting a topic into production. Read `references/top100-reference-intelligence.md` only when curated-success packaging is being considered after qualification.
5. Read `references/visual-engine-v2.md` before creating any new visual.
6. Read `references/creative-engine-v3-lean.md` before creating or judging a GPT Image 2 prompt.
7. For flagship visuals, read `references/holy-grail-visual-standard.md` before writing the prompt. The benchmark example is `data/2026-W28/supply-chain-resilience-os/visual.png`.
8. For AI-for-SC flagship visuals/captions, read `references/workflow-learning-2026-07-08-demand-review-to-sequence-board.md` so the post starts with the input pack, tool artifact, meeting payoff, and deterministic logo plan.
9. For AI-for-SC education posts, read `references/ai-creator-education-growth-playbook.md`, `references/ai-work-surfaces-benchmark-2026-07.md`, and `references/linkedin-creator-benchmark-50-2026.md`. Lead with one memorable supply-chain distinction, then teach the current execution layer: persistent method, connected context, specialized work, a control gate, a finished artifact, and operating cadence. Ordinary chat is a scratchpad, not the flagship capability story.
10. Before animating any approved still, read `references/motion-engine-v1.md`. Motion is a layout-adaptive finishing lane, not a reusable EOQ animation template.
11. Before a post or resource moves to the website, read `references/publish-resource-handoff-v1.md` and `references/publish-asset-spec-v1.md`.
12. Use `references/master-calendar.md`, `references/101-plan.md`, and `references/ai-for-sc-plan-v2.md` as candidate banks, not as blind autopilot.
13. Use `references/calendar-reference-adaptation-map-v1.md` as optional packaging intelligence after a topic passes V4 qualification. Its Top-100 patterns are curated-winner hypotheses, not causal proof.

## V4 Pilot Cadence

- Publish five LinkedIn posts per week as an evidence-led portfolio; do not force a fixed 2 × 101 plus 2 × AI allocation.
- Spend 20–30 minutes on thoughtful, manual LinkedIn commenting on publishing days. Codex may prepare context but must not automate or publish comments.
- Publish one Substack flagship every two weeks and three Substack Notes per week.
- Build a website artifact only when it materially extends the post or article.
- Measure LinkedIn, Substack, and website outcomes separately. Do not collapse them into one universal score.

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

- run the public-evidence signal scan from `references/v4-audience-growth-operating-system.md`,
- define the audience segment,
- score the topic with `references/topic-selection-scorecard.md`,
- identify the strongest evidence/packaging lane; when Top-100 is genuinely useful, define its curated-winner mechanic hypothesis, and otherwise record `Top-100 not used` plus the stronger Tiger, peer, public-pain, or primary-source basis,
- record the channel role: LinkedIn standalone, Substack pillar/support, website artifact, or an intentional combination,
- create `tiger-source.md` from `templates/tiger-source-note-template.md` and pass `references/tiger-source-gate-v1.md` before final first-person copy,
- define the Holy Grail fit for flagship visuals: operating artifact, meeting moment, supply-chain scene, content backbone, module map, and logo plan,
- for AI-for-SC, define one core professional distinction and the execution architecture using `references/ai-creator-education-growth-playbook.md`; verify named capabilities with `references/ai-work-surfaces-benchmark-2026-07.md`, score the caption with `references/linkedin-creator-benchmark-50-2026.md`, and do not present ordinary file-upload chat as a sophisticated workflow,
- create a content brief from `templates/content-brief-v2-template.md` for major posts,
- create a creative brief from `templates/creative-brief-lite-template.md` before prompting GPT Image 2,
- compile the GPT Image 2 prompt with `node scripts/compile-gpt-image-prompt.mjs data/{week}/{slug}`,
- review the rendered output with `templates/visual-output-review-template.md`,
- run `node scripts/audit-visual-package.mjs data/{week}/{slug}` before treating a flagship visual as complete,
- only after the still passes QA, apply the motion eligibility gate in `references/motion-engine-v1.md`; build the standard GIF/MP4 companion when sequence or reveal improves the argument, otherwise record the still-only exception,
- run `node scripts/audit-motion-package.mjs data/{week}/{slug}` before treating an eligible still + motion package as complete,
- for AI-for-SC, complete `resource-plan.md`; eligible packs use a direct no-email ZIP, compact branded guide, synthetic first run, completed examples, manifest, checksums, and validation,
- after explicit caption and still approval, create `publish-manifest.json` and move the website handoff from `hold` to `ready`,
- use MP4 for website motion previews and retain GIF for LinkedIn,
- use `templates/weekly-signal-scan-template.md` when selecting a full week.

The calendar is a candidate library. Audience pain, competitive and public evidence, artifact value, channel fit, and Tiger's approved judgment decide what actually gets built.

`references/editorial-rebuild-next-12-weeks.md` and `references/calendar-reference-adaptation-map-v1.md` preserve useful candidate and packaging work, but neither overrides V4 topic qualification.

## Rules

- Always check for existing files before creating new ones.
- Never delete files without explicit approval.
- Never install packages silently.
- Keep generated artifacts traceable to a prompt, references, and a final comparison note.
- Do not invent numbers, deltas, dates, or claims. Every load-bearing fact must come from the research brief or approved source material.
- Do not invent Tiger's experience, anecdotes, conversations, results, or beliefs. Without a Tiger source note, research and neutral outlining may continue, but a flagship first-person caption or Substack issue is not final.
- For motion, the first and final lossless frames must match the approved `visual.png` exactly. Never animate raw rectangular crops, approximate logos, or moving body text.
- Preserve `visual.png` as the canonical master. For organic LinkedIn posts, use a native 1080 x 1350 visual or a non-cropping `visual-linkedin.png` companion when the master is taller than 4:5.
- Never publish a draft caption or infer approval from a visual go-ahead. Website updates are the final stage after explicit caption and still approval.
