---
name: research-engine
description: Research and verify claims for Supply Chain 101, AI for Supply Chain, Substack, website artifacts, and public-data explainers. Use before drafting when a post needs a documented case, public dataset, formula, standard, current product capability, market event, or Tiger source routing.
---

# Research Engine

Build only the support the planned claims require. Read the reference query or bundle first so the
research answers the intended reader decision instead of collecting generic facts.

## Frame the research

1. Read `reference-query.json` or `reference-bundle.json`, the content brief, and the care statement.
2. List the exact claims required by the hook, visual, caption, and artifact.
3. Assign one claim mode to each claim before searching.

## Route by claim mode

| Claim mode | Use for | Preferred evidence |
|---|---|---|
| `editorial_explainer` | framework, checklist, map, or explanation | authoritative method source when borrowed; logic, scope, and failure boundary |
| `formula_or_method` | formula, standard, scientific or operating method | standard body, peer-reviewed paper, authoritative technical source |
| `sourced_fact` | descriptive fact or timely event | primary announcement, authority, official dataset, or company source |
| `documented_case` | deployed action, success, failure, or operating result | company filing/report, named case, public implementation record, peer-reviewed case |
| `public_data_analysis` | measurable condition, comparison, calculation, or chart | official dataset, regulator, statistics agency, public company data |
| `tool_workflow` | current AI/product surface, rollout, connector, or control | current official vendor documentation plus real input/output when an outcome is claimed |
| `tiger_interpretation` | belief, experience, authority, first-person result | approved `tiger-source.md` or Voice Bank entry |
| `comparative_or_causal` | comparative or causal statement | evidence capable of supporting that exact wording |
| `simulation_or_hypothesis` | explicit scenario or proposition to test | visible label, assumptions, limits, and disconfirmation route |
| `creative mechanic` | hook, visual, save, or artifact packaging | Creative Genome element; never factual support for our claim |

Split independent modes across parallel researchers when that improves speed or source quality. Keep one owner responsible for reconciling conflicts.

## Source rules

- Prefer primary and authoritative sources.
- Search current official documentation for unstable product, company, regulatory, or market claims.
- Record the source title, URL, publication date, accessed date, exact supporting passage or table, and applicable conditions.
- Preserve contrary or failed cases when they change the decision boundary.
- Use a real public case or source-backed dataset for every claimed real outcome.
- Allow a correctly attributed non-numerical framework without manufacturing a case or dataset.
- Keep internal software fixtures outside public results and validation stories. If simulation is the
  explicitly selected content mode, label it visibly and state its limits.
- Drop, narrow, or reframe an unsupported claim. Do not soften an invented number into credibility.

## Write the proportionate support file

Use `support-note.md` for definition, attribution, or narrow factual checks. Use `research-brief.md`
for cases, datasets, calculations, comparisons, current product architecture, or multi-claim work.

Include:

1. Reader role, decision, stakes, care statement, and artifact.
2. Claim ledger with stable claim IDs, claim mode, exact wording, evidence, conditions, and status.
3. Documented real-world cases and their outcomes.
4. Public-data fields, formulas, units, assumptions, and reproducible calculations.
5. Counter-evidence, failure cases, and applicability boundaries.
6. Visual-ready facts linked to claim IDs.
7. Caption-ready facts linked to claim IDs.
8. AI-only capability and domain-method sections when applicable.
9. Tiger-source requirements separated from public facts.
10. Source list and an unresolved-claims list.

## Gate the handoff

Pass when every load-bearing claim meets its own support burden: attributed methods are correct,
numbers have claim IDs, claimed real examples are traceable, calculations reproduce, and current
capabilities are official. Narrow or remove failed claims first; return `reframe` or `park` only when
the central reader promise cannot survive.

Do not assign a universal topic score. Report which required claims passed, failed, or remain unresolved.
