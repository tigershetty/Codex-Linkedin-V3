# Top-100 Reference Intelligence — Image + Caption Engine

**Date:** 2026-06-30  
**Status:** Active upstream input for topic selection, captions, and Visual Engine v2 prompts  
**Source corpus:** `references/top 100/` + `references/top 100/Reference File and Caption.xlsx`  
**Lean caption lookup:** `references/top100-caption-index.md`  
**Lean visual lookup:** `references/top100-visual-inventory.md` + `references/top100-contact-sheet.html`  
**Companion analysis:** `memory/visual-benchmarks/top100-visual-dna.md` and `memory/visual-benchmarks/benchmark-library.md`

## 1. Operating Principle

The top-100 references are not a mood board. They are a proof set.

Each reference contains two kinds of intelligence:

| Layer | What to extract | How it improves Shetty's Desk |
|---|---|---|
| Image | format, hierarchy, density, structure, proof devices, save mechanics | makes GPT Image 2 outputs more distinctive and less dashboard-like |
| Caption | opening tension, audience promise, authority proof, list cadence, CTA/save trigger | makes the topic feel useful before the reader even zooms into the image |

Every flagship post must answer:

> Which reference-proven stop-scroll promise are we adapting, and what makes it specific to supply chain?

If the answer is "it looks nice," the reference has not been used correctly.

## 2. Lean Usage Rule

Do **not** load all 100 images/captions into a normal production run.

Use this sequence instead:

1. Pick the topic and audience job.
2. Choose the nearest **power format** from the selector below.
3. Run `node scripts/compile-topic-seed.mjs {topic-or-slug}` to pull the calendar row, power-format mechanics, and initial Top-100 image-caption shortlist.
4. Use `top100-visual-inventory.md` or `top100-contact-sheet.html` to visually shortlist references before opening individual image files.
5. Use `top100-caption-index.md` to verify caption promises and save triggers without opening the workbook.
6. Open only **3 references**:
   - one structure reference,
   - one caption/promise reference,
   - one craft/brand reference.
7. Fill one `Reference Learning Card` from `templates/reference-learning-card-template.md`.
8. Feed only the extracted lessons into the content brief and GPT Image 2 prompt.

This preserves taste without burning context.

## 3. What The Top 100 Proves

The existing corpus analysis found these production facts:

- 4:5 portrait dominates; square and landscape are usually weaker for this genre.
- Dense reference cards work when each cell follows one repeated reading schema.
- The strongest posts are useful artifacts, not decorative posters.
- The visual structure must be the argument: ladder for maturity, funnel for narrowing, map for navigation, formula card for calculation, decision tree for choice.
- Captions do not merely describe the image. They sell the audience value: save this, use this, decide faster, avoid this mistake, explain this better.

## 4. Power Formats To Reuse

Use the top-100 format only when it matches the topic's actual promise.

| Format | Use when the post promises | Best for Shetty's Desk |
|---|---|---|
| PF1 Maturity ladder | "Where am I now, and what is the next level?" | career maps, supplier maturity, AI adoption levels, planning maturity |
| PF2 Comparison / versus | "What is the difference, and why does it matter?" | tactical vs strategic, landed cost vs unit price, forecast vs plan |
| PF3 KPI / formula card | "How do I calculate or diagnose this?" | safety stock, reorder point, OTIF, inventory turns, forecast error |
| PF4 Cheat-sheet grid | "Give me the complete reference I can save." | clauses, acronyms, supplier review questions, AI prompt libraries |
| PF5 Radial hub / feature map | "How does one tool/system support many tasks?" | Claude/ChatGPT/Copilot for procurement, planning, logistics |
| PF6 Decision tree | "Which option should I choose?" | pricing model, sourcing strategy, AI model/tool choice, expedite decision |
| PF7 Ranked role/item cards | "Which roles/items are most exposed or important?" | AI exposure by SC role, supplier risk rankings, automation suitability |
| PF8 Anatomy / labeled diagram | "What is inside this system or document?" | contract anatomy, PO flow, ERP/MRP structure, S&OP pack |
| Supporting: Process flow | "How does it move end to end?" | demand-to-supply, PR-to-PO, escalation workflows |
| Supporting: Concept metaphor | "What is the sticky reframe?" | hidden risk, weak link, capacity bottleneck, dependency map |

## 5. Caption Patterns Worth Stealing

Use the captions as audience-promise models, not as voice models. Tiger's voice still comes from `tiger-voice.md`.

Start with `top100-caption-index.md`, which condenses each caption into:

- opening type,
- opener,
- promise / second beat,
- artifact type,
- save trigger.

Open the full spreadsheet only after selecting the 1-3 references that matter for the post.

| Caption move | What it does | Shetty's Desk adaptation |
|---|---|---|
| Specific pain opener | Names a problem the reader already recognizes | "The supplier that hurts you most is not always the one with the biggest invoice." |
| Credibility proof | Shows the author has earned the claim | "From replenishment and purchasing work, this is where the meeting usually gets stuck." |
| Tool/artifact promise | Tells the reader exactly what they can use | "Save this three-question test for the next supplier review." |
| High-density list | Makes the post feel complete and save-worthy | Use for checklists, formula cards, prompt libraries, and review guides. |
| Personal preference | Makes the framework feel chosen, not generated | "The one I would look at first is..." |
| Repost/save CTA | Gives the reader a clear sharing reason | Use sparingly; prefer task-specific save triggers over generic engagement asks. |

## 6. Topic Gate: Reference-Proven Value

Before a topic enters production, define its reference fit:

```md
Reference-proven promise:
Power format:
Closest top-100 reference files:
Caption pattern to adapt:
Save trigger:
Audience value in one sentence:
Visual argument in one sentence:
Why this is Shetty's Desk, not a generic creator:
```

Reject or reframe the topic if:

- the reference fit is only aesthetic,
- the caption promise is generic,
- the post would not become a useful artifact,
- the format does not make the argument clearer,
- Tiger cannot add practitioner context,
- the image would be another generic card grid.

## 7. Calendar Adaptation Rule

The calendar remains a candidate bank. The top-100 layer decides how a candidate becomes worth making.

| Calendar topic type | Weak calendar frame | Reference-led frame |
|---|---|---|
| Definition | "What is X?" | "The decision boundary that X creates" |
| List | "5 types of X" | "Which type should you use when the stakes change?" |
| Workflow | "How process X works" | "Where process X breaks, and how to catch it earlier" |
| AI use case | "AI can do task Y" | "This role is stuck at this workflow bottleneck; here is the safe AI-assisted move" |
| Concept | "Here is the concept" | "Here is the meeting-room test that proves whether you understand the concept" |

## 8. GPT Image 2 Prompt Upgrade

Every flagship GPT Image 2 prompt should now include a short reference intelligence block:

```md
REFERENCE INTELLIGENCE:
- Structure reference: [file] — adapt [format/eye path], not the subject.
- Caption promise reference: [file] — adapt [audience promise/save trigger].
- Craft reference: [file or brand frame] — adapt [density/hierarchy/restraint].

CREATIVE USP:
This image should beat a generic LinkedIn infographic because [one sentence].

STOP-SCROLL TEST:
At feed size, the reader should instantly see [shape/claim] and think [why this is worth saving].
```

Keep the prompt open enough for GPT Image 2 to compose creatively. Do not turn the prompt into a full HTML spec unless exact text/data is the main risk.

## 9. Quality Bar

A publishable post must score at least 4/5 on all four reference-intelligence dimensions:

| Dimension | What 5 means |
|---|---|
| Stop-scroll promise | The first line + image shape make the reader pause because the topic solves a recognizable problem. |
| Save utility | The post is useful enough to revisit before a meeting, task, interview, or workflow. |
| Reference adaptation | The output borrows proven structure/caption mechanics without copying subject matter. |
| Shetty's Desk originality | Tiger's practitioner lens is visible in the problem, example, caveat, or decision rule. |

## 10. Immediate Use On Current Example

For `supplier-concentration-risk`, the reference-led read is:

- **Promise:** "Find the three suppliers that can stop the business."
- **Format:** supporting Concept Metaphor + PF6-style decision test.
- **Caption pattern:** specific pain opener + practical three-question test + save trigger.
- **Visual argument:** broad supplier base narrowing into three load-bearing dependencies.
- **USP:** moves supplier risk away from spend-only thinking and into operational replaceability.

That is the level of specificity every future topic needs before visual generation.

## 11. Downstream Files

The Top-100 corpus should flow through these lean files before any prompt is written:

- `references/top100-caption-index.md` for opener, promise, artifact, and save-trigger patterns.
- `references/top100-visual-inventory.md` for image path, aspect ratio, inferred visual route, and artifact type.
- `references/top100-contact-sheet.html` for fast visual shortlisting.
- `references/top100-visual-mechanics-index.md` for concrete mechanics from inspected images.
- `references/calendar-reference-adaptation-map-v1.md` for assigning a power format and caption pattern to each calendar topic.

Do not paste long caption blocks or many images into a prompt. The production unit is the extracted lesson: one structure move, one caption promise, one craft move, and one Shetty-specific operating insight.
