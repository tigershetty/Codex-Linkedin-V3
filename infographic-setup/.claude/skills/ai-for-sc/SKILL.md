---
name: ai-for-sc
description: Use when the user runs /ai-for-sc [week] or /ai-for-sc [week] [use-case-slug]. Monthly theme model pipeline for AI for Supply Chain series. Runs the research-engine FIRST so every AI-tool capability, execution-surface, method, and data claim is verified from current official sources. Generates practical role-specific posts that teach persistent method, connected context, specialized execution, control gates, finished artifacts, cadence, and human ownership.
---

# /ai-for-sc Skill — AI for Supply Chain Pipeline (v3)

## Purpose
Generates AI for Supply Chain posts from practical use cases within the approved monthly theme model. One week = one theme = two posts. Each post covers a specific SC role + specific AI use case + specific tool. No fixed audience tiers — the role is determined by the task. Posts are practical, concrete, and copy-paste ready.

## Invoke
```
/ai-for-sc [week]                    → generates BOTH use-case posts for that week
/ai-for-sc [week] [use-case-slug]    → generates one specific post
```
Examples:
- `/ai-for-sc W21` → Week 21 (Procurement theme) — two practical use-case posts
- `/ai-for-sc W21 rfq-with-claude` → W21 RFQ use case only
- `/ai-for-sc W26 demand-simulation` → W26 demand simulation use case only

## Prerequisites
Read all of these before generating a single word. They are the intelligence base.

| File | What it provides |
|---|---|
| `tiger-voice.md` | Voice DNA — rhythm, opinion style, what to reject, pattern breakers |
| `references/published-voice.md` | Hook quality bar, "NOT THIS" list, annotated examples |
| `references/101-voice.md` | Accessible register, plain language first, adapted hook taxonomy |
| `references/ai-for-sc-plan-v2.md` | Pre-defined topic plan — load the week's two use cases (Role, Tool, Use Case, Hook direction, Visual format) |
| `references/ai-creator-education-growth-playbook.md` | Current AI education system and execution-stack standard |
| `references/ai-work-surfaces-benchmark-2026-07.md` | Current official product surfaces and the nine-question caption-depth standard |
| `references/linkedin-creator-benchmark-50-2026.md` | Cross-domain creator patterns and 40-point caption QA |
| `references/ai-for-sc-visual-dna.md` | 50-format visual library for spatial concepts, hero devices, and variety |
| `references/ai-for-sc-creative-intelligence.md` | Creative intelligence from 53 references: structures, devices, and the visual ambition bar |
| `references/visual-engine-v2.md` | GPT Image 2 primary workflow, HTML control lane, artifact contract, and visual QA |
| `references/creative-engine-v3-lean.md` | Lean creative brief, prompt compilation, reference adaptation, and output review |
| `references/motion-engine-v1.md` | Post-specific semantic motion, GIF/MP4 output, and endpoint QA |
| `references/publish-resource-handoff-v1.md` | Caption approval, resource eligibility, direct download, and website publication gate |
| `data/ai-for-sc-series-tracker.md` | Episode tracking — last use case, tool, and role used |

**Read all of these before generating a single word.**

---

## Step 0: Research Engine (MANDATORY — runs first)

Before loading voice or generating anything, run **`/research-engine ai-for-sc [use-case-slug]`**
for each post (see `.claude/skills/research-engine/SKILL.md`). For AI for SC it spawns
**two research-analyst agents in parallel**:
- **Tool layer** — what the named AI product surface can *actually* do today from the
  vendor's own docs: reusable methods, connected context/actions, orchestration,
  controls, artifact production, cadence, rollout status, and access limits.
- **Method/domain layer** — the real formulae, indices, criteria, weights and benchmarks
  the workflow depends on (e.g. should-cost build, PPI/LME indexation, scorecard weights).

It writes `data/{YYYY-W##}/{slug}/research-brief.md`. **Every capability claim, number,
index and the execution architecture are built from this brief** — never asserted from
memory. A tool capability that can't be sourced to vendor docs does not go on the card.
Do not proceed until the brief clears the research-engine quality gate.

> This is what makes the depth high enough to build on. Concrete, demonstrable examples
> (e.g. showing the tool operate inside its host surface — Copilot in Excel, or Claude in
> Claude Code / Cowork building a real artifact) are layered on top of this verified depth,
> never instead of it.

---

## Step 1: Load All Intelligence

0. Read the `research-brief.md`(s) from Step 0 — the verified fact base for both posts.

1. Read `tiger-voice.md` — internalize:
   - Natural rhythm: longer flowing sentences, connective tissue ("because", "so", "which means")
   - Opinion bridges: "My view on this is that...", "Here's the thing most people miss...", "If you look at the bigger picture..."
   - Pattern breakers: sentence starting with "And"/"But", parenthetical asides, varied bullet structure
   - Primary rejection: choppy AI fragments ("Short. Punchy. Done.") — NEVER
   - Hook philosophy: pattern interrupt, earns the next sentence immediately

2. Read `references/published-voice.md` — internalize:
   - Hook taxonomy: 10 hook types with specific examples
   - Voice markers: numbers embedded mid-sentence, personal frame as opener, "NOT THIS" list
   - Annotated examples: Dabbawala, McKesson, Maersk — use as the quality bar

3. Read `references/101-voice.md` — internalize:
   - Accessible register: plain language first, technical term explained second
   - The test: would the right SC person read this over coffee and recognise their own workflow?

4. Read `references/ai-for-sc-plan-v2.md` — extract Post A and Post B for the requested week. Note the Role, Tool, Use Case, and Hook direction for each. Do not define use cases at runtime — the plan is the source of truth.

5. Read `data/ai-for-sc-series-tracker.md` — note:
   - Last episode number
   - Which SC roles and tools have been used recently — avoid repeating the same role or tool two weeks in a row

---

## Step 2: Load Pre-Defined Use Cases

Use cases are pre-defined in `references/ai-for-sc-plan-v2.md`. Do not define them at runtime.

1. Open `references/ai-for-sc-plan-v2.md` and locate the entry for the requested week
2. Extract Post A and Post B — Role, Tool, Use Case, Hook direction
3. Cross-check `data/ai-for-sc-series-tracker.md` — confirm this episode hasn't been published already
4. Present to the user before generating anything:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 W[##] — [Theme]
 Pre-defined use cases:

 Post A (Ep[##]): [Role] + [Tool]
 → [Use Case]

 Post B (Ep[##]): [Role] + [Tool]
 → [Use Case]

 Confirm to proceed, or override a use case?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

5. If confirmed — proceed to Step 3 (hooks) for Post A
6. If the user overrides a use case — accept it and verify:
   - Different SC role from the other post
   - Different AI tool from the other post
   - Not a repeat of a role + use case already in the series tracker

Do NOT generate hooks until use cases are confirmed.

### AI Tool Selection (verify before every run)
- **Claude** — Cowork role plugins and scheduled tasks; Claude Code for skills, scoped subagents, MCP, scripts, hooks, and tests
- **OpenAI** — ChatGPT Work for connected long-running business tasks and finished artifacts; Codex for version-controlled files, code, skills, apps, and automations
- **Microsoft 365 Copilot** — agents and Notebooks for organizational context; Workflows and scheduled prompts where available
- **Gemini** — Workspace Studio or Gemini Enterprise for agents, reusable skills, deterministic nodes, human checkpoints, connectors, and long-running work
- **Grok** — persistent Skills for artifact production; Grok Build for plugins, MCP, hooks, subagents, and headless execution while it remains early beta

---

## Step 3: Generate 10 Hook Options (per post)

With all voice intelligence loaded, generate 10 hooks per use case.

**New hook rule — replaces the Practitioner/Leader distinction:**

The hook must do three things simultaneously:
1. **Name the role or recognisable situation** — the right person reads this and thinks "that's me" or "that's my team"
2. **Name the current limitation** — specific enough to be credible: SAP, Excel, 3-day turnaround, manual research, IT queue, the same spreadsheet rebuilt every week
3. **Show the operating unlock** — concrete: persistent method, connected context, control added, artifact produced, or meeting moved forward

The hook becomes the verbatim opening line of the published post. Test it: would the right person stop scrolling because they recognise their own friction?

| # | Hook Type | AI for SC Adaptation |
|---|---|---|
| 1 | Question-Why | "Why does the team rebuild [workflow] every cycle when the method can be preserved as a skill?" |
| 2 | Question-How | "How would [role] run [decision workflow] with connected evidence and a control gate?" |
| 3 | Stat-Lead | Use only a verified number that materially changes the decision; do not invent time savings |
| 4 | Contrarian | Challenge the assumption that [task] requires manual effort, a specialist, or an IT ticket |
| 5 | Paradox | A task that looks routine but costs more time or quality than it should |
| 6 | Personal-Reflection | "I built this workflow because my team was [doing X manually] every [week/quarter]..." |
| 7 | Result-First | Start with what AI produced — then show the method |
| 8 | Workflow-Progression | One-off answer versus a reusable, controlled, scheduled operating artifact |
| 9 | Comparison-Gap | Same decision, different execution architecture or control depth |
| 10 | Decision-Pressure | "Which of your [tasks / suppliers / lanes] would you run this on first?" |

**Hook rules (non-negotiable):**
- Each hook opens with a DIFFERENT first word
- Each hook uses a DIFFERENT structural device
- No em dashes. Use periods.
- No AI slop: unlock, game-changer, revolutionise, dive into, harness, leverage, empower, transform, navigate
- Lead with the professional distinction, operating situation, or current capability; the AI tool may lead only when its new surface is the actual news and payoff
- Hook names the role either explicitly ("If you are a supply planner...") or situationally so specifically that the right person self-identifies

---

## Step 4: Write LinkedIn Caption

Use this as a reasoning checklist, not a rigid paragraph template. The role, decision, execution surface, and artifact should change the shape of the caption.

```
1. PROFESSIONAL DISTINCTION    — selected hook, verbatim; teaches something immediately
2. OPERATING SCENE             — where the current workflow loses time, context, control, or decision quality
3. CURRENT SURFACE + WHY       — Cowork, Claude Code, Work, Codex, Copilot agent, Workspace Studio, etc.
4. EXECUTION ARCHITECTURE      — reusable skill/plugin/agent + connected evidence + worker/tool split + control gate
5. ARTIFACT PACKAGE            — exact board, change log, exception pack, report, or interface produced
6. CADENCE + HUMAN OWNER       — schedule/trigger/monitor plus the decision that remains with the practitioner
7. MEETING PAYOFF              — how the team starts further forward
8. PRACTITIONER QUESTION       — invites an operating diagnosis, not agreement
9. SIGN-OFF
```

**Word count**: 300–450 words when the execution detail earns the space.

### Caption Rules (non-negotiable)
- Sentences flow with connective reasoning — no stacked fragments
- Use numbers only when verified and decision-relevant; do not manufacture a time-saving hook
- At least 1 pattern breaker per post: sentence starting with "And" or "But", parenthetical aside, or a sentence running longer than feels optimal when working through an idea
- Human+AI boundary must be explicit: what the workflow prepares, what a control can reject, and what the person validates, adjusts, and decides
- No ANCHORS labels, no citation format, no em dashes
- Bullet points use • not -
- Ordinary file-upload chat is not the flagship capability story
- Name at least seven of nine depth elements from `references/ai-work-surfaces-benchmark-2026-07.md`
- At least one validation must be able to reject, block, or route an unsupported result to review
- AI must not be positioned as replacing judgement; the SC professional owns the operating decision
- Sign-off: "Follow Poornajith Shetty and Shetty's Desk for more supply chain insights and save this for [specific reference use]."
- Hashtags: #ShettysDesk #SupplyChainIntelligence #SCM #AIforSupplyChain + 1 topic-specific tag (5 max)

---

## Step 5: Build The GPT Image 2 Still

Visual Engine v2 is the active lane. GPT Image 2 is the primary creative renderer; HTML/code-render is a backup and exact-data control, not the default.

### 5.1 Build the creative packet

1. Complete `content-brief-v2.md`, `reference-learning-card.md`, and `creative-brief-lite.md`.
2. Select three to five references for structure, caption promise, craft, brand, and optional contrast.
3. Define one dominant visual argument, the exact text map, value-density layer, execution architecture, and logo zones.
4. Compile `gpt-image-2-prompt-compiled.md` with the repo script.

### 5.2 Render one strong concept

- Give GPT Image 2 enough composition freedom to build a premium editorial artifact around the topic.
- Make the operating artifact the hero. The surrounding supply-chain scene supports the idea rather than repeating a generic dashboard.
- Use exact tool and Shetty's Desk assets as reference inputs. Ask for integrated blank plates or chips, then perform deterministic logo finishing with the official repo assets.
- Keep every number, formula, label, and relationship traceable to `research-brief.md`.
- Generate additional candidates only when they test genuinely different architectures. Do not manufacture three near-identical variants.

### 5.3 QA and promote

1. Review the candidate with `visual-output-review.md`.
2. Inspect tight crops of every logo, formula, and load-bearing label.
3. Use the HTML lane only when exact table, chart, formula, or text control would outperform the image render.
4. After the user approves the still, promote it to `visual.png` and run:

```bash
node scripts/audit-visual-package.mjs data/{week}/{slug}
```

---

## Step 6: Build The Motion Companion

Only begin after `visual.png` is explicitly approved.

1. Apply the eligibility sentence from `references/motion-engine-v1.md`.
2. Initialize the post-specific project with `node scripts/init-motion-project.mjs data/{week}/{slug}`.
3. Map semantic components from the actual layout; do not reuse a fixed choreography.
4. Keep exact text, logos, and base art locked. Use delayed source-component reveals, registered highlights, and signals that follow the visual's reading order.
5. Export `visual-motion.gif` for LinkedIn and `visual-motion.mp4` as the full-resolution website/video master.
6. Require pixel-identical first and final lossless frames, then run the motion package audit.

---

## Step 7: Decide Whether The Post Earns A Downloadable Resource

Complete the resource eligibility gate for every AI-for-SC post. Build a resource when at least four of these are true:

- the post teaches a reusable method, skill, workflow, or decision policy;
- a safe synthetic input pack can be provided;
- at least one deterministic script, schema, checklist, or validation can be included;
- the workflow produces three or more reviewable outputs;
- a beginner can complete a useful first run without production access;
- the human decision boundary and failure modes can be made explicit.

When eligible, the resource package must include:

- a direct ZIP download with no email or account gate;
- a four-page Shetty's Desk field guide by default;
- one safe command or equally simple first-run path;
- synthetic sample inputs and completed expected outputs;
- reusable instructions or a skill, deterministic checks, and a validation checklist;
- `MANIFEST.json`, version notes, checksums, limitations, and the human review boundary.

Write the eligibility result in `resource-plan.md` even when the decision is `not warranted`.

---

## Step 8: Caption Approval And Website Handoff

1. Present ten engineered hooks and one voice-QA caption candidate after the still and resource promise are clear.
2. Do not mark the caption approved from inference. Record the user's final text verbatim only after explicit confirmation.
3. Create `publish-manifest.json` from `templates/publish-manifest-template.json`. Keep `caption.status` as `draft` until confirmed.
4. Only when the caption and still are both approved may `website.status` move to `ready`.
5. Update the separate `shettys-desk-site` repo on a `codex/*` branch:
   - add the approved caption and still to Published Posts;
   - use MP4 for website motion when available while retaining GIF for LinkedIn;
   - add the versioned direct-download resource page and ZIP when eligible;
   - verify desktop, mobile, article, resource, and download routes;
   - push a Vercel preview for approval before merging to production.
6. Update `data/ai-for-sc-series-tracker.md` only with the final approved post package.

---
## Output File Structure

Each completed post folder should contain:

```text
data/{YYYY-W##}/{use-case-slug}/
|-- research-brief.md
|-- content-brief-v2.md
|-- reference-learning-card.md
|-- creative-brief-lite.md
|-- gpt-image-2-prompt.md
|-- gpt-image-2-prompt-compiled.md
|-- visual-output-review.md
|-- visual.png
|-- visual-motion.gif
|-- visual-motion.mp4
|-- motion-qa.md
|-- linkedin-caption.md
|-- resource-plan.md
`-- publish-manifest.json
```

- `visual.png` is the approved canonical still.
- `visual-motion.gif` is the LinkedIn motion companion when eligible.
- `visual-motion.mp4` is the website and full-resolution motion master.
- `linkedin-caption.md` keeps all ten hooks and the exact caption approval status.
- `resource-plan.md` records whether a downloadable pack is required and why.
- `publish-manifest.json` is the final cross-repo handoff; it cannot be ready while the caption or still is unapproved.

---
## Quality Check (run before presenting)

**Research (gate — check first):**
- [ ] `research-brief.md` exists for each post and cleared the research-engine gate?
- [ ] Every AI-tool capability claim is sourced to the vendor's own docs (with reliability tag)?
- [ ] Every number, index value, weight and execution-surface claim traces to the brief — none asserted from memory?
- [ ] Product availability is labelled accurately as generally available, beta, preview, or early access?

**Use Cases:**
- [ ] Two different SC roles — not the same job title twice in the same week?
- [ ] Two different AI tools — not the same tool twice?
- [ ] Neither use case repeats a role + task combination already in the series tracker?
- [ ] One use case is a regular workflow task; the other adds a new capability?

**Hooks:**
- [ ] All 10 open with different first words and different structural devices?
- [ ] Hook names the role or situation specifically enough to self-identify?
- [ ] Hook names the current limitation (specific tool or manual process)?
- [ ] Hook shows the AI unlock concretely?
- [ ] No em dashes, no AI slop?
- [ ] Would the right person stop mid-scroll because they recognise their own workflow?

**Caption:**
- [ ] The first two lines teach a professional distinction or current capability with an operating payoff?
- [ ] The named product surface is current and verified against official documentation?
- [ ] The reusable method, connected context, work split, control gate, artifact package, cadence, and human owner are visible?
- [ ] At least one control can reject, block, or route an unsupported output to review?
- [ ] The meeting payoff is explicit?
- [ ] Human+AI boundary is precise without allowing caveats to dominate?
- [ ] At least 1 pattern breaker from tiger-voice.md?
- [ ] 300–450 words when the execution detail earns the space?
- [ ] Reads like Tiger wrote it — flowing, connected, specific?
- [ ] Bullets use • not -?

**Visual (GPT Image 2 primary):**
- [ ] One dominant visual argument and operating artifact lead the composition?
- [ ] The architecture is distinct from recent posts while the design language remains recognizably Shetty's Desk?
- [ ] Every number, formula, label, and relationship traces to the research brief?
- [ ] Exact tool and Shetty's Desk assets were used as inputs or inserted deterministically into designed zones?
- [ ] Tight logo, formula, and text crops pass with no clipping, approximation, ghosting, or duplicate overlays?
- [ ] The visual-output review clears the creative floor and text/data integrity is 5/5?
- [ ] The approved still was promoted to `visual.png` before motion began?
- [ ] LinkedIn export dimensions and file size were checked against `references/publish-asset-spec-v1.md`?

**Motion:**
- [ ] Motion eligibility is documented?
- [ ] Choreography follows this visual's actual layout and reading order?
- [ ] Exact text, logos, and base art remain locked?
- [ ] GIF and MP4 outputs pass endpoint and media QA?

**Resource and website handoff:**
- [ ] `resource-plan.md` records the eligibility score and decision?
- [ ] An eligible pack has a direct no-email ZIP, compact branded guide, synthetic first run, completed examples, manifest, checksums, and validation?
- [ ] The caption and still are explicitly approved before `website.status` becomes `ready`?
- [ ] The website uses MP4 for motion when available and keeps GIF for LinkedIn?
---

## Token Budget
~5–8K tokens per post. ~10–14K for both posts in one run.
