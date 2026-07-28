# LinkedIn V4 Pilot — Outcome-Blind Codebook v1

**Date:** 2026-07-27
**Status:** Not frozen; 2026-07-28 model inter-run consistency gate failed
**Unit:** one LinkedIn post: caption, native attachment, and visible link preview
**Companion:** `linkedin-v4-stage0-research-spec.md`

## Why This Exists

The current engine contains useful labels, but it mixes three different layers:

1. LinkedIn media format: text, image, document, video;
2. editorial structure: ladder, formula card, decision tree, process flow;
3. resource quality: reusable method, input pack, validation, download.

Those layers cannot share a single “format” or “artifact” field. The pilot codes observable post characteristics before performance is visible. Production-quality judgment happens only after winner/control analysis.

## Blind View

Coders may see:

- full caption text;
- native attachment or an adequate capture of it;
- visible link preview;
- publication date only when needed to resolve timely-news content.

Coders must not see:

- reactions, comments, or reposts;
- comments beneath the post;
- creator follower count;
- creator performance history;
- creator identity;
- Tiger/Track A/Track B membership;
- Top-100 case, winner/control, or post-rank labels.

Numeric claims about the subject matter remain visible. Claims about the post's own reach or engagement are masked during coding.

Tiger posts, Track A posts, Top-100 cases, and same-author controls must be mixed under randomized post IDs. Coding batches may be balanced by evidence layer, but coders must not be told the balance or the source of any individual post.

## Coding Rules

- Assign one primary value per field.
- Code what is explicitly observable, not what the creator probably intended.
- Apply the stated tie rule rather than adding a new label.
- Record a short evidence phrase and `high` or `low` confidence for every field.
- The original LinkedIn post is required to code native platform format. A saved JPEG, GIF, or PDF export does not reveal whether LinkedIn delivered it as an image, gallery, document, or video.
- If the caption is complete but the native attachment is unavailable, retain caption-only fields and mark attachment-dependent fields `NA`; exclude the post from comparisons involving those fields.
- If the caption or the primary visual content is materially incomplete, mark the post ineligible rather than guessing.

## 1. Audience Specificity

| Code | Value | Definition |
|---|---|---|
| AS1 | Role/title/stage | Names an occupation, title, seniority, or career stage: planners, buyers, CPOs, early-career professionals |
| AS2 | Task/situation cohort | Defines readers by a specific responsibility or problem without naming a title: people running S&OP, anyone handling supplier increases |
| AS3 | Function/industry cohort | Names a discipline, department, or industry: procurement teams, supply-chain professionals, manufacturers |
| AS4 | Broad professional cohort | Leaders, managers, founders, teams, businesses, or employees without functional specificity |
| AS5 | General/unstated | “You,” “people,” “everyone,” or no audience cue |

Tie rule: choose the most specific explicit cue: `AS1 > AS2 > AS3 > AS4 > AS5`. A company named as an example is not the audience.

## 2. Entry Hook

Use the first two substantive caption sentences. If the caption contains no claim, question, or promise, use the cover headline.

| Code | Value | Definition |
|---|---|---|
| H1 | Evidence/result | Leads with measured performance, a statistic, or an observed result |
| H2 | Pain/consequence scene | Names recognizable work friction, stakes, or an undesirable consequence |
| H3 | Correction/distinction | Challenges a belief or establishes “not X, but Y” |
| H4 | Method/artifact promise | Promises a procedure, tool, template, model, or direct solution |
| H5 | Complete list/map | Promises a bounded collection, handbook, map, ranked list, or comprehensive reference |
| H6 | Personal/build story | Leads with something the author built, tried, learned, or experienced |
| H7 | Timely change/news | Leads with a recent event, policy, product release, or market change |
| H8 | Curiosity question | A genuine question that does not already qualify as H1–H7 |
| H9 | Plain premise/announcement | Topic label, announcement, or introduction without a functional hook |

Edge rules:

- “I built X and it produced €3k” is H1, not H6.
- “10 Excel formulas planners need” is H5; the number is an item count, not evidence.
- “Why do planners keep expediting?” is H2 because the question contains the pain.
- Punctuation alone does not make a hook H8.

## 3. Job Promised

Code the reader's primary expected change after consuming the post.

| Code | Value | Definition |
|---|---|---|
| J1 | Understand/explain | Comprehend a concept or explain it to someone else |
| J2 | Decide/diagnose | Compare options, diagnose a condition, or defend a decision |
| J3 | Prevent/fix failure | Avoid a mistake, reduce risk, or repair a recurring failure |
| J4 | Execute/create faster | Perform, automate, or produce a work output |
| J5 | Advance/influence/lead | Improve career position, credibility, communication, or leadership |
| J6 | Evaluate/adopt tools safely | Judge capability, limits, governance, or appropriate AI/tool use |
| J7 | Interpret current change | Understand what a market, regulatory, company, or technology event means |
| J8 | Connect/inspire/entertain | Reflection, motivation, community, or entertainment is the dominant payoff |
| J0 | None/unclear | No reader outcome can be identified |

Tie rules:

- An AI tutorial that produces an output is J4.
- A post about what AI should and should not own is J6.
- Choose J3 when a named failure is central; choose J2 when option selection is central.
- An explicit promised outcome beats an implied benefit.

## 4. Primary Proof

Code the load-bearing support for the main claim.

| Code | Value | Definition |
|---|---|---|
| P1 | First-party result/test | Author's own experiment, dataset, measured result, or inspectable case |
| P2 | External empirical evidence | Attributed study, benchmark, official data, or named source |
| P3 | Worked demonstration | Inputs, method, and output are shown well enough to reproduce the reasoning |
| P4 | Named real-world case | Company, event, or person used as a concrete example without reproducible analysis |
| P5 | Practitioner observation | Firsthand or earned-experience judgment without inspectable evidence |
| P6 | Reasoned model only | Formula, framework, or logical argument with no empirical validation |
| P0 | No proof | Unsupported assertion, generic advice, or decorative screenshot |

Tie rule: select what supports the main claim; if equally load-bearing use `P1 > P2 > P3 > P4 > P5 > P6 > P0`.

A screenshot is not automatically proof. It must document a result or worked demonstration. “Research shows” without a named or linked source is P0.

## 5. Primary Artifact

| Code | Value | Definition |
|---|---|---|
| AR1 | Executable/interactive | Usable calculator, generator, dashboard, app, or live tool |
| AR2 | Downloadable resource | Workbook, PDF, ZIP, dataset, template file, or guide |
| AR3 | Copyable operating asset | Prompt, script, checklist, schema, SOP, or table fully usable from the post |
| AR4 | Decision/reference artifact | Formula, matrix, map, model, cheat sheet, or decision rule embedded in the post |
| AR5 | Completed example only | Screenshot or output demonstrates the result but cannot itself be reused |
| AR0 | None | No reusable or inspectable artifact |

Tie rule: code the main reader deliverable; if equal use `AR1 > AR2 > AR3 > AR4 > AR5 > AR0`.

A polished infographic is not automatically AR4. It must function as a reusable reference or decision aid. A product screenshot with no usable path is AR5.

## 6. Platform Format

| Code | Value |
|---|---|
| F1 | Text only |
| F2 | Single static image |
| F3 | Multi-image gallery |
| F4 | Native document/PDF carousel |
| F5 | Native video or animated GIF |
| F6 | Link/article/newsletter preview |
| F7 | Poll, event, audio, or other native format |

The native attachment determines the code. A URL in an image caption does not turn an image post into F6. Editorial structures such as ladder, formula card, decision tree, or process flow do not belong in this field.

## 7. Primary CTA

Use the highest-commitment explicit ask.

| Code | Value | Definition |
|---|---|---|
| C1 | Commercial conversion | Buy, book, request a demo, apply, or join a paid offer |
| C4 | Keyword gate | Comment a word, symbol, or email to receive a resource |
| C2 | Traffic/owned audience | Click, visit, use, download, register free, or subscribe |
| C3 | Direct contact | DM, email, connect, or contact the author |
| C5 | Practitioner discussion | Question requires workplace experience, diagnosis, or a concrete example |
| C6 | Generic discussion | Opinion, yes/no, “what do you think?”, or “what did I miss?” |
| C7 | Platform engagement | Like, follow, save, share, repost, or tag |
| C0 | None | No explicit action requested |

Tie order is the table order. “Follow me, and where does your process break?” is C5. “Comment GUIDE or use the link” is C4.

## 8. Content Class

Code the organizing spine of the post, not its hook or CTA.

| Code | Value | Definition |
|---|---|---|
| K1 | How-to/workflow | Reader-directed steps from input to output |
| K2 | Decision/diagnostic framework | Helps choose, prioritize, assess, or diagnose |
| K3 | Explainer/reference | Organizes knowledge, definitions, formulas, or a reference set without a decision process |
| K4 | Case/build/experiment | What the author or another actor built, tested, changed, or achieved |
| K5 | News/data/thesis | Interprets an external event, dataset, trend, or contested position |
| K6 | Career/leadership/people | Career movement, management, communication, talent, or workplace behavior |
| K7 | Personal/community/inspiration | Personal reflection or community content without a primary professional method |
| K8 | Promotion/offer/update | Product, event, hiring, company, or service promotion is the dominant substance |

Edge rules:

- If the author's actions and result form the narrative spine, use K4.
- If instructions to the reader form the spine, use K1.
- A framework for choosing is K2; a framework that only organizes knowledge is K3.
- A teaching post with a closing product mention stays K1–K6. Use K8 only when the offer or update dominates.
- Current-event company analysis is K5; a retrospective operating case is K4.

## 9. Problem Family

Code the main work problem or subject being addressed. This field identifies what the post is about; `Job Promised` identifies what the reader should be able to do afterward.

| Code | Value |
|---|---|
| PB1 | Planning and forecasting |
| PB2 | Inventory and replenishment |
| PB3 | Logistics, warehousing, or transport |
| PB4 | Procurement, sourcing, or suppliers |
| PB5 | Transformation, systems, ERP, or operating model |
| PB6 | AI workflows, adoption, or governance |
| PB7 | Excel, data, analytics, or BI |
| PB8 | Lean, process improvement, quality, or constraints |
| PB9 | Career, leadership, communication, or people |
| PB10 | Marketing, growth, sales, or creator work |
| PB11 | Business strategy, finance, or entrepreneurship |
| PB12 | Other or unclear |

Tie rule: code the problem that supplies the post's main stakes. An AI workflow for supplier analysis is PB4 when supplier analysis is the end job and PB6 when AI adoption itself is the teaching subject. Record one secondary family only when two are genuinely co-equal.

## 10. Primary Visual Structure

Code the dominant information architecture of the native attachment, not its illustration style.

| Code | Value | Definition |
|---|---|---|
| VS0 | No primary visual structure | Text only, link preview only, or a decorative visual with no teaching structure |
| VS1 | Reference or cheat sheet | A compact lookup surface such as formulas, KPIs, definitions, or a handbook page |
| VS2 | Process or workflow | A sequence of actions, stages, or handoffs |
| VS3 | Decision tree or branching path | Conditional choices lead to different actions or outcomes |
| VS4 | Comparison or matrix | Options, states, or methods are contrasted across common dimensions |
| VS5 | Checklist, grid, or index | A modular collection whose items can be scanned independently |
| VS6 | Chart, data, or formula | Quantitative relationship, plotted evidence, equation, or calculation is central |
| VS7 | Worked screenshot or demonstration | A tool, input, transformation, and/or output is visibly demonstrated |
| VS8 | Narrative illustration or metaphor | A visual story or analogy carries the explanation |
| VS9 | Other or genuinely mixed | No structure above clearly dominates |

Tie rule: choose the structure that delivers the main promise, not the cover. A carousel may contain several structures; code the one doing the most explanatory work.

### Visual descriptors

These descriptors remain separate from `Primary Visual Structure` so a visual can be compared without turning design into a single taste score.

| Field | Allowed values | Coding question |
|---|---|---|
| `cover_promise` | outcome, method, list/map, question, topic, none | What does the first visible frame promise? |
| `information_density` | low, medium, high | How much distinct information must be processed per frame? |
| `reading_path` | single-focus, linear, branching, modular | How is the reader expected to move through the information? |
| `actionability_depth` | read, adapt, copy, run | Can the reader only understand it, adapt it, copy a complete asset, or execute it directly? |
| `stop_scroll_device` | number, contrast/correction, complete-system, recognizable-object, human, other, none | What visible device creates the initial interruption? |

## 11. Operational Completeness

Code each field independently as `yes`, `no`, or `NA`. A component counts only when it is explicit enough for the reader to use; implication does not count.

| Field | `yes` means |
|---|---|
| `OC_INPUTS` | Required data, materials, assumptions, or starting conditions are named |
| `OC_STEPS` | The operating sequence or transformation is explicit |
| `OC_OUTPUT` | The expected deliverable, decision, or result is shown or precisely defined |
| `OC_VALIDATION` | A check, tolerance, source, test, reconciliation, or failure condition is supplied |

Do not collapse these fields into a quality score during coding. A post can legitimately show only a decision rule or only a worked output.

## 12. Distribution Dependency

Code every applicable flag independently as `yes` or `no`.

| Field | `yes` means the post's response materially depends on |
|---|---|
| `DD_NEWS` | a current event, release, policy, trend, or time-sensitive claim |
| `DD_PROMOTION` | an offer, giveaway, launch, event, hiring announcement, or commercial incentive |
| `DD_PERSONAL_AUTHORITY` | the author's identity, status, personal milestone, access, or prior audience relationship |
| `DD_COMMENT_GATE` | commenting a keyword or symbol to receive the promised resource |
| `DD_EVERGREEN` | the central value remains useful without any of the four dependencies above |

`DD_EVERGREEN=yes` normally requires the other four flags to be `no`. If a timeless method is wrapped in a timely hook, code both the actual dependency and `DD_EVERGREEN=no`; do not infer how the post might have performed with a different hook.

## Reliability Gate

Use two isolated coding passes.

1. Select 16 calibration posts balanced across Tiger, Track A, Top-100 cases, matched controls, formats, visual structures, and ambiguous cases.
2. Randomize post IDs and hide engagement, followers, author identity, evidence-layer membership, author history, case/control status, and outcome labels.
3. Each coder assigns every applicable core and V4-module field, an evidence phrase, and confidence.
4. Require at least 85% overall exact agreement, at least 80% agreement on every categorical or binary field, and Gwet's AC1 of at least 0.70 per field.
5. Adjudicate disagreements and revise or collapse ambiguous categories.
6. Code a fresh 12-post holdout with all evidence layers represented.
7. Require at least 90% overall exact agreement, no field below 80%, and no repeated unresolved edge case.

Do not improve agreement by showing performance. If a field fails twice, simplify the taxonomy.

### Observed model inter-run result — 2026-07-28

Two isolated model passes coded 16 calibration and 12 holdout captions without identity or
outcomes. This is an inter-run consistency check, not human validity.

- calibration overall exact agreement: `89.2%`, above the 85% overall threshold;
- calibration failed field thresholds: audience specificity `75.0%` and primary artifact `68.8%`; both also missed the AC1 requirement;
- holdout overall exact agreement: `89.8%`, below the 90% threshold and descriptive only because calibration had already failed;
- holdout audience specificity was `66.7%`; `DD_EVERGREEN` AC1 was `0.676`;
- platform format agreed 100%, but only because the native-format summary was explicit;
- primary visual structure and visual descriptors were not tested because the blind sample did not expose attachments.

**Decision:** do not freeze or use the meaning-heavy codes as decision-grade evidence. Keep the
automated screen exploratory. Before a future reliability round, clarify/collapse audience
specificity and artifact boundaries, adjudicate operational-completeness edge cases, provide
outcome-blind attachment captures, and then draw a fresh holdout. Do not rerun merely to obtain a
passing number.

## Freeze Rule

After the holdout passes:

- store the final codebook version and checksum;
- code all eligible posts before outcomes are joined;
- never add a category because a high-performing post does not fit;
- log unavoidable interpretation changes and rerun the full blind coding pass.
