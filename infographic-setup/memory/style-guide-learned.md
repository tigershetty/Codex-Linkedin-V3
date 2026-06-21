# Style Guide — Learned Patterns

Updated by: pattern-synthesizer agent (runs after /retrospective, requires 4+ weeks of data)
Read by: learning-advisor agent at start of each pipeline stage

Last updated: 2026-06-21 — manual entry: code-render visual standard (supplier-quote)

---

## Code-Render Visual Patterns (manual, 2026-06-21)
*Source: perfecting `renderer/templates/sc101-quote-iso-towers.html` as the new visual bar. Full detail in `references/render-pilot-workflow.md` §2b + §4 and `renderer/README.md` §6b. Applies to **101 (now code-render primary)** and AI for SC.*

**Design — confirmed effective**
| Pattern | What it is | Why it works |
|---|---|---|
| Composition Mode A — hero-dominant/integrated | Hero owns 60–70%, detail embedded *into* it via leader-lined annotations on a strict anchor grid | Keeps the eye on one focal object for a single complex mechanism; no block clutter |
| Composition Mode B — layered 4-layer | 3D hero + scorecard + part-to-whole bar + side callouts | Fills whitespace with *information*; comparison topics get clean separate cuts |
| Real 3D via JS `clip-path` isometry | `iso(u,v)=[OX+(u−v)*a, OY+(u+v)*b]`; cap light → left mid → right dark | Deterministic genuine depth; CSS 3D transforms were fragile and abandoned |
| Multi-element from the 200-pattern library | Combine #43 towers + #106 Harvey balls + #44 share bar + callouts in one still | Consulting-grade density; reserve unused patterns for later posts on the topic |
| Footrule-above-row footer; tighter padding; fill the canvas | Full-width rule sits above the foot row (never over the logo); ~22–24px padding; rescale hero to fill | "Use the space, don't frame it with border" |
| SC 101 footer = Logo 2 (dark-wordmark lockup) | `shettys-desk-logo-2.png` ~74px on the LEFT (carries the wordmark → no separate text label) + "Poornajith Shetty" signature on the RIGHT | Logo 1's wordmark is white = invisible on the white card; Logo 2 is built for light backgrounds |

**Technical — confirmed gotchas**
| Gotcha | Fix |
|---|---|
| `inset:'auto'` wipes earlier `left`/`top` (shorthand) | Set `inset='auto'` BEFORE `left`/`top` |
| `clip-path` clips `box-shadow` | Use `filter:drop-shadow()` for depth on clipped shapes |
| CSS-grid divider on an inner div does nothing | Make it a real grid item: `gridColumn:'1/5'` |
| `node render.mjs` fails after cwd drift | Always call the renderer with an absolute path |

---

## Gemini Prompt Patterns

### Confirmed Effective
| Format | Evidence | First confirmed |
|---|---|---|
| Numbered sections (1: / 2:) + plain data | W09 world-class render on first attempt | 2026-W09 |

### Confirmed Ineffective
| Format | Evidence | First flagged |
|---|---|---|
| Markdown narrative (###, **, - bullets) | NB2 rendered markdown as literal text | 2026-W09 |

---

## Hook Performance

| Hook type | Avg engagement vs. baseline | Weeks sampled |
|---|---|---|
| [filled by pattern-synthesizer after 4 weeks] | | |

---

## Caption Patterns

| Pattern | Evidence | Status |
|---|---|---|
| Named company anchor in bullet 1 | Tested W09 — engagement TBD | Testing |

---

## Topic Category Performance

| Category | Avg impressions | Avg comments | Weeks |
|---|---|---|---|
| [filled by pattern-synthesizer] | | | |

---

## Prompt Format Evolution

| Week | Format change | Outcome |
|---|---|---|
| W09 | Switched to numbered sections — removed markdown | World-class render, confirmed fix |

---

## Audience Demographics Patterns
*Source: analytics-log.csv — updated by pattern-synthesizer when ≥4 rows exist*
*Note: rows with topic_type=unknown are backfill posts (pre-pipeline analytics era)*

| Topic type | Top seniority | Top industry | Posts |
|---|---|---|---|
| unknown (backfill) | Senior | Transportation, Logistics, Supply Chain and Storage | 4 |

---

## Reach & Engagement Efficiency
*Source: analytics-log.csv — updated by pattern-synthesizer when ≥4 rows exist*
*Note: hook_type=unknown for backfill posts; rows require ≥2 data points per group*

| Hook type | Avg reach_eff | Avg save_rate | Avg composite | Posts |
|---|---|---|---|---|
| unknown (backfill) | 63.0% | 0.23% | 65.59 | 4 |
