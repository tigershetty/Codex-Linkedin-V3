# AI Creator Education and Growth Playbook

**Status:** active reference
**Applies to:** AI for Supply Chain posts
**Research date:** 2026-07-14
**Purpose:** teach practical AI adoption without turning Shetty's Desk into a generic AI-news account

Use this playbook with:

- `linkedin-creator-benchmark-50-2026.md` for cross-domain creator systems and caption QA;
- `ai-work-surfaces-benchmark-2026-07.md` for current product surfaces, execution patterns, and official capability evidence.

## Strategic Position

Shetty's Desk should not compete on AI news volume. Its defensible lane is:

> One real supply-chain decision, turned into a visible AI workflow and a planner-reviewable operating artifact.

The model name can change. The recognizable editorial promise should not:

- a practitioner knows which job is being improved;
- the inputs are concrete enough to gather;
- the current execution surface and workflow architecture are named;
- the output is a useful board, table, review pack, or decision note;
- operating judgment remains visible;
- the reader can save the post and reproduce the first version.

## What Strong AI Educators Repeatedly Do

This is an editorial-pattern review, not a claim that one format causes reach.

| Creator / publisher | Public content pattern | What Shetty's Desk should adapt |
|---|---|---|
| [Ethan Mollick / One Useful Thing](https://www.oneusefulthing.org/about) | Research-backed experiments, practical interpretation, and explicit uncertainty | Explain what changed in the work, what the test showed, and what still needs human judgment |
| [Allie K. Miller](https://www.alliekmiller.com/home) | Converts AI concepts into business tactics, progressive learning, workflow redesign | Translate features into a role-specific business workflow and give readers a next step |
| [Rowan Cheung / The Rundown AI](https://www.rundown.ai/articles/introducing-rundown-university) | Pairs new capabilities with short tutorials, workflows, images, and implementation guidance | Pair the finished artifact with a concise setup path, not just a feature announcement |
| [Matt Wolfe / Future Tools](https://futuretools.io/about) | Curates, tests, compares, and explains which tools matter for a job | Compare tools by task fit instead of declaring one universal winner |
| [Simon Willison](https://simonwillison.net/) | Publishes exact prompts, commands, transcripts, tests, outputs, and failures | Show enough evidence that an advanced reader can inspect or reproduce the workflow |
| [Rachel Woods / The AI Exchange](https://www.theaiexchange.com/) | Turns recurring processes into reusable AI playbooks | Treat the prompt as one component of a repeatable operating method |
| [Lisa Crosbie](https://lisacrosbie.com/) | Beginner-friendly tutorials, comparisons, and complete product walkthroughs | Explain where to click, what to add, and what the reader should expect back |
| [Nate B. Jones](https://www.natebjones.com/) | Deep analysis, actionable frameworks, practical tests, and explicit anti-hype positioning | Give readers a decision rule for choosing chat, project, agent, or automation |

## Common Mechanics Worth Reusing

1. **One job per post.** The post solves a named recurring task instead of listing broad AI possibilities.
2. **Input to output proof.** Readers see the source pack, setup, transformation, and useful artifact.
3. **A copyable component.** The post includes a skill contract, plugin map, agent definition, validation checklist, schema, or template.
4. **Current execution depth.** A flagship post explains the persistent method, connected context, work split, control gate, artifact, and cadence rather than stopping at ordinary chat.
5. **Tool selection by fit.** The content explains why a surface is appropriate for the job.
6. **Visible tests.** Examples, screenshots, tables, GIFs, corrections, and before/after outputs create evidence.
7. **A named series.** The audience can recognize what will arrive next and why it is worth following.
8. **Honest iteration.** A useful failure or correction is documented when it changes the method.

## The Editorial Unit

The flagship caption should usually carry **one memorable professional distinction**. A deep post can contain several supporting elements, but they must all prove the same central idea.

For example, a demand-sensing post may own this distinction:

> A faster signal only creates operating value when the business still has time to change a decision.

The routing tests, input pack, AI artifact, and practitioner question can all support that idea. The execution architecture should make the capability concrete without becoming a generic tour of every AI feature.

This prevents a common failure: combining a strong supply-chain post and a strong AI setup post into one caption, then weakening both.

## The Shetty's Desk AI Execution Stack

Flagship AI-for-SC posts should normally show this stack. Ordinary chat can be used for discovery, but it is not the capability story.

| Layer | Question the post must answer | Supply-chain example |
|---|---|---|
| 1. Persistent method | What expertise is saved between runs? | Routing policy stored as a reusable skill |
| 2. Connected context | Where does current evidence come from? | Approved files, enterprise connectors, apps, or scoped MCP tools |
| 3. Specialized execution | How is the work divided and completed? | Profile worker, routing worker, and independent verifier |
| 4. Control gate | What can reject or stop an unsupported output? | Schema test, freshness check, blocking hook, or human checkpoint |
| 5. Finished artifact | What does the team receive? | Routing board, route-change log, exception list, and meeting brief |
| 6. Operating cadence | How does the workflow re-enter the business process? | Scheduled pre-review run with planner approval |

The rule is simple: preserve the method, connect the evidence, separate the work, and make failure visible before adding cadence or write actions.

## Product Surface Map - July 2026

Product availability can vary by plan, administrator settings, and rollout. Verify the current product documentation before publication.

| Ecosystem | Current business surface | Reusable and connected execution | Control and cadence |
|---|---|---|---|
| Claude | [Cowork](https://claude.com/blog/cowork-plugins) | Plugins can combine skills, connectors, commands, and subagents; Claude Code adds scoped MCP and file/script execution | [Claude Code hooks](https://code.claude.com/docs/en/hooks), permissions, tests, and [Cowork scheduled tasks](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork) |
| OpenAI | [ChatGPT Work](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) | [Plugins](https://help.openai.com/en/articles/20001256-plugins-in-chatgpt-and-codex) combine skills, apps, and templates; Codex handles version-controlled file and code work | Work Scheduled Tasks and Codex tests, review, skills, apps, and automations |
| Microsoft 365 | Copilot agents and [Notebooks](https://support.microsoft.com/en-us/Microsoft-365-Copilot/get-started-with-microsoft-365-copilot-notebooks) | Agents connect organizational knowledge; Workflows automate supported Microsoft 365 services | Visual testing, DLP, Teams input, scheduled prompts, schedules, and event triggers where available |
| Google | Workspace Studio and [Gemini Enterprise](https://cloud.google.com/blog/products/ai-machine-learning/whats-new-in-gemini-enterprise) | Skills, agents, Projects, connectors, BYO-MCP, and long-running work | Deterministic nodes, human checkpoints, observability, recurring work, and Spark |
| xAI | [Grok Skills](https://x.ai/news/grok-skills) and [Grok Build](https://x.ai/news/grok-build-cli) | Skills, plugins, AGENTS.md, MCP, hooks, and parallel subagents | Plan approval and headless scripts; Build remains early beta |

## Standard Post Architecture

AI-for-SC posts should usually use this sequence without turning every caption into the same template:

1. **Professional distinction:** teach the supply-chain truth in the first two lines.
2. **Operating scene:** show where that distinction changes a real meeting or decision.
3. **Current capability promise:** name the execution surface and what it can build for that job.
4. **Workflow architecture:** identify the reusable unit, connected context, work split, and control gate.
5. **Artifact package:** describe the board, change log, exception pack, report, or interface produced.
6. **Cadence and ownership:** explain how the workflow repeats and where human approval remains.
7. **Practitioner question:** ask the reader to diagnose a decision, policy, or control point in their operation.

Keep the main caption near the established AI-for-SC range. The caption must still name enough of the execution architecture to teach something current. Put exact configuration, file structures, source schemas, scripts, and product comparison in a companion guide or follow-up.

## Recurring Series System

Use a small number of recognizable formats so variety comes from the operating artifact, not random styling.

### 1. Build The Artifact

- Lead with the planning decision.
- Show the input pack.
- Reveal the finished operating artifact.
- Give one starter prompt.

### 2. Set It Up

- Show the reusable skill or plugin, connected sources, workers, controls, and schedule.
- Include an exact architecture map or build checklist.
- Use the same supply-chain job from the previous post.

### 3. Tool Fit Test

- Run the same job through two or more relevant product surfaces.
- Compare context handling, artifact quality, repeatability, and effort.
- Choose by use case, not brand loyalty.

### 4. After Three Runs

- Publish what the planner corrected.
- Show which instruction, check, or input was added.
- Explain how the workflow improved.

### 5. Template Drop

- Share the skill contract, plugin map, agent definition, input schema, review table, or control checklist.
- Make the save value obvious in the visual itself.

## Engagement Principles

LinkedIn says its current Feed aims to surface content that is timely, relevant to professional goals, and grounded in trust. Its ranking also learns from what members read, return to, engage with, or repeatedly skip. The practical response is not to manufacture dwell time. It is to make the post genuinely useful to a clearly defined professional audience. See [LinkedIn's 2026 Feed engineering overview](https://www.linkedin.com/blog/engineering/feed/engineering-the-next-generation-of-linkedins-feed) and its [dwell-time quality work](https://www.linkedin.com/blog/engineering/feed/leveraging-dwell-time-to-improve-member-experiences-on-the-linkedin-feed).

For Shetty's Desk:

- optimize for practitioner relevance before broad reach;
- use a visual that can be understood without opening the caption;
- let the caption add setup and operating depth rather than restating the image;
- ask questions that a planner, buyer, scheduler, or leader can answer from experience;
- create follow-ups from real reader questions;
- show human review and editing of AI-assisted outputs, consistent with [LinkedIn's AI-content guidance](https://www.linkedin.com/help/linkedin/answer/a1481496).

## Quality Gate

Before an AI education post is approved, confirm:

- [ ] one named supply-chain job is visible;
- [ ] the first two lines teach a useful professional distinction rather than leading with product mechanics;
- [ ] one core idea organizes the caption;
- [ ] the current workflow limitation is specific;
- [ ] the input pack is credible and gatherable;
- [ ] the artifact is shown or precisely defined;
- [ ] the named product surface reflects current official capabilities;
- [ ] the reusable method, connected context, work split, and control gate are visible;
- [ ] at least one check can reject, block, or route an unsupported result to review;
- [ ] the finished artifact and operating cadence are explicit;
- [ ] the tool claims match current official documentation;
- [ ] the post does not imply that one tool fits every environment;
- [ ] the CTA asks about an operating decision or workflow;
- [ ] the visual and caption have both received human QA;
- [ ] the caption scores at least 32/40 using `linkedin-creator-benchmark-50-2026.md`;
