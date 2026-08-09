# Supply-Chain Opportunity Map v1

**Status:** active upstream scope control<br>
**Use before:** `creative-opportunity-selection.md` when a broad supply-chain area needs a more
specific reader and work context<br>
**Does not replace:** the four starting paths, Creative Genome retrieval, the Fast Post Loop, claim
support, or Field Guide admission

## Decision

Use a small, source-linked **Supply-Chain Opportunity Map** to turn a broad area of expertise into
one bounded reader opportunity. It maps work and decisions; it does **not** create content pillars,
a publishing calendar, a universal score, or an obligation to reach a fixed number of levels.

```text
work context + operating object + decision or tension + reader job
  -> bounded scope window
  -> Creative Opportunity Selection
  -> Fast Post Loop / Field Guide / flagship / park
```

The map is private production infrastructure. A public visual earns its own spatial model after the
claim, reader payoff, and evidence boundary are selected. Do not automatically publish a mind map
because one exists backstage.

## What transfers from Pierri — and the correction

Pierri's expertise-map idea is useful because it makes it possible to zoom from a broad discipline
into a smaller, usable reference. The error would be treating **ten layers** as evidence of depth.
For Shetty's Desk, depth is earned only when a branch changes at least one of these:

1. the reader who recognises the moment;
2. the operating object or artifact being examined;
3. the decision, trade-off, hand-off, or question at stake;
4. the evidence or claim route required;
5. the boundary, exception, or accountable owner; or
6. the relationship the public visual must make visible.

If a branch changes none of those, it is an alias, decoration, or false precision. Stop branching.
Labels such as `planning`, `procurement`, `AI`, and `supply chain` may remain useful navigation
nodes, but are never by themselves candidate-ready post subjects.

## The data model

The map is a graph where necessary, not a forced hierarchy. A tree is appropriate only for a real
parent/child relationship. An operational hand-off, dependency, measure, or trade-off must be an
explicit edge with a stated basis.

### Node record

| Field | Purpose |
|---|---|
| `node_id`, `label`, `kind`, `aliases` | Stable navigation without creating duplicate buzzwords. `kind` may be `function`, `role`, `work_object`, `decision`, `tension`, `method`, `metric`, `system`, or `event`. |
| `reader_contexts` | Named role plus a recognisable work moment. |
| `work_artifacts` | Actual objects the reader sees or uses: order, confirmation, forecast, contract, capacity view, KPI, meeting, etc. |
| `decision_questions` | The question that changes an action, explanation, preparation, or escalation. |
| `boundaries_and_exceptions` | What the node cannot decide alone, what can be stale, and who owns the next check. |
| `cognitive_jobs` | `recognise`, `orient`, `choose`, `explain`, `diagnose`, `prepare`, or `compare`. |
| `truth_routes` and `evidence_routes` | Permitted claim classes and the source or method route they need; not a claim of proof by association. |
| `creative_retrieval_tags` | Reader-state, cognitive-job, and visual-relation terms for saved-post retrieval. |
| `not_a_claim`, `status`, `last_reviewed` | Prevents a navigation label from being presented as an operating law. Status is `navigation_only`, `candidate_ready`, or `corroborated`; it is never a performance score. |

### Edge record

Each edge needs `from_id`, `relation`, `to_id`, and `basis`.

Allowed relations are deliberately limited: `constrains`, `feeds`, `hands_off_to`, `measures`,
`trades_off_with`, `validates`, `owns`, or `requires`. Its basis must be a `source_link`,
`documented_method`, or an explicitly labelled `hypothesis`. Never draw an association line just
because two ideas are adjacent in a subject-matter taxonomy.

### Source capsule

A source registry entry used by a `source_backed` branch must carry a complete `source_capsule`:

| Field | Purpose |
|---|---|
| `source_locator` | Exact source section, page location or bounded unit being relied on. |
| `accessed_on` | The real `YYYY-MM-DD` access date. |
| `supported_paraphrase` | The limited statement the source supports in our own words. |
| `evidence_note_path` | A local research-note path where the source was assessed with its boundary. |

The validator checks the local note path and every selected source in the branch, including its
selected nodes and edges. An incomplete capsule is not a minor warning: the branch remains a
`research_seed` until the source record is repaired. A complete capsule makes a branch eligible for
Opportunity Selection only; it never turns a source into a proven public claim or a publish-ready
post.

### Scope window

The map does not select a topic. It emits one small **scope window** for the existing Opportunity
Board:

```text
one reader and work moment
+ one operating object or signal
+ one decision or tension
+ one cognitive job
+ one claim/truth route
+ an explicit in-scope and out-of-scope boundary
```

Use [the schema](creative-genome/schemas/supply-chain-opportunity-map-scope.schema.json) and
[blank template](../templates/supply-chain-opportunity-map-scope-template.json) only when this
extra context resolves a genuinely broad starting point. Do not build a dataset before the map has a
real production use.

The first deliberately small source-backed graph is
`creative-genome/supply-chain-knowledge-map-v1.json`. It contains three candidate branches only:
supplier confirmation/customer promise, batch/consolidate/dispatch, and planning-exception policy.
It is not a domain taxonomy. Use `validate-supply-chain-knowledge-map.mjs` and
`select-supply-chain-knowledge-map.mjs` to retrieve a narrow/deep/wide scope card; a source-backed
branch becomes eligible for Creative Opportunity Selection, never automatically build-ready.

From `infographic-setup/`, validate a completed window with:

```bash
node scripts/validate-opportunity-map-scope.mjs \
  --input data/{week}/{slug}/opportunity-map-scope.json
```

The validator checks scope hygiene only. It cannot select a topic, prove a claim, or approve a post.

## Gates

| Gate | Pass condition | Failure action |
|---|---|---|
| **1. Map admission** | A proposed node or edge makes a new reader, artifact, decision, boundary, source route, or visual relationship visible. | Keep it as an alias/navigation term, or do not add it. |
| **2. Depth stop** | Each added branch changes the public contract in one of the six ways above. | Stop branching; more layers are not more expertise. |
| **3. Scope window** | One reader moment, object/signal, decision/tension, cognitive job, truth route, and out-of-scope boundary can be named in plain language. | Reframe or park; do not use a larger map to disguise vagueness. |
| **4. Existing opportunity selection** | The existing Care, Range, Useful payoff, Claim contract, and Channel job checks pass. | Use the existing `explore`, `build`, or `park` decision. The map never scores virality. |
| **5. Route selection** | The selected route is proportionate to the required work and evidence. | Follow the route rules below. |

## Route handoff

### Fast Post Loop

Use the map as a **three-minute lookup**, not a research phase:

1. Take one already-formed scope window, or form one only from information already in hand.
2. Retrieve two to four saved references by `reader state + cognitive job + required visual relation`.
3. Write the three rough routes and select or park by minute 25.

Do not expand the map, research every adjacent branch, or create a Field Guide merely because a
scope window looks intelligent. If no route yields a visible tension and one useful keep, park it or
explicitly declare a flagship later.

### Field Guide

A scope window is **necessary context, not Field Guide admission**. Escalate only when the direction
also has a repeatable reader moment, one useful decision/check/explanation, three to seven
independent modules, an owner/input/boundary, a truthful spatial relationship, and plausible return
use without its caption.

The Field Guide receives a selected **subgraph**, normally only the nodes and edges needed for its
promise. The complete map is never a Field Guide page, and an unverified relation must not become a
public network visual.

### Flagship

Declare a flagship when the scope needs a detailed evidence trail, a durable public artifact, a new
creative family, or a genuinely cross-functional relationship. The map then improves the reference
query; it still does not preselect the creative family or visual shape.

## One illustrative scope window — not a current post selection

```yaml
reader_and_moment: "A supply planner learns that a supplier confirmation changed after a customer date was discussed."
operating_object: "Open customer order, supplier confirmation, and freight scenario."
decision_or_tension: "Release a partial shipment, wait to consolidate, or escalate the customer promise?"
cognitive_job: "choose and explain"
truth_route: "operating method / framework"
in_scope: "A shared way to separate date reliability, customer exposure, and differential economics before an exception decision."
out_of_scope: "It does not set company freight thresholds, promise a recovery date, or replace the accountable release decision."
relation_to_show: "conditional decision and hand-off"
```

This can seed a Fast Post if one visible distinction and useful keep are enough. It can become a
Field Guide only if its checks, ownership, exceptions, and return-use value pass the specialist
admission test. It is not evidence that the method has been deployed, that any freight number is
correct, or that a particular release outcome is universally right.

## Learning boundary

Post outcomes update the **creative-atom transfer record**, not the factual truth of this map. Add
or correct a node/edge only when the underlying operating relationship or source record changes.
Saved references remain creative signals, public evidence remains claim support, and account
performance remains a separate learning layer.
