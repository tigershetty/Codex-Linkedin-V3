# Calendar Reference Adaptation Map v1

**Date:** 2026-07-01  
**Status:** Active bridge between `master-calendar.md` and `top100-reference-intelligence.md`  
**Purpose:** preserve optional curated-reference packaging hypotheses for legacy calendar candidates after they pass the V4 audience/evidence gate.

## Rule

When a selected V4 post uses this map, capture a curated-reference package:

```md
Audience job:
Curated-winner promise hypothesis:
Power format:
Caption pattern:
Save trigger:
Visual argument:
Shetty's Desk originality:
```

The calendar gives the topic. This map gives the reason the audience should stop, save, and trust it.

## Audit

Run this after editing the map:

```bash
node scripts/audit-calendar-reference-map.mjs
```

The audit checks the internal completeness of the historical RW03-RW12 four-post map. Passing it
does not admit a topic, set V4's five-post weekly portfolio, or prove performance. V4 topic
admission remains upstream.

## RW03 — Procurement / Supplier Performance

| Post | Audience job | Curated-winner promise hypothesis | Power format | Caption pattern | Save trigger | Visual argument |
|---|---|---|---|---|---|---|
| `supplier-concentration-risk` | Avoid a mistake | Find the suppliers that can stop the business | Concept metaphor + PF6 decision test | specific pain opener + practical test | 3-question supplier dependency test | many suppliers narrow into three load-bearing columns |
| `supplier-review-failure` | Make a better decision | Turn supplier reviews from scorekeeping into action | PF2 comparison / versus | "what people do vs what works" | review meeting checklist | old review loop vs action-driven review loop |
| `supplier-flexibility-matrix` | Save time | See which suppliers can absorb a demand spike | PF7 ranked cards + matrix | role pain + workflow artifact | supplier flexibility matrix template for planners | suppliers scored by capacity, lead time, mix flexibility, response speed |
| `supplier-risk-profile` | Explain clearly | Show risk as dependency, impact, and recovery time | PF8 anatomy | artifact promise + caveat | supplier risk profile template | one supplier card decomposed into risk layers |

## RW04 — Production Planning / Demand Forecasting

| Post | Audience job | Curated-winner promise hypothesis | Power format | Caption pattern | Save trigger | Visual argument |
|---|---|---|---|---|---|---|
| How demand forecasting works | Explain clearly | Forecasting is a decision input, not a crystal ball | Process flow | misconception opener | forecast-to-decision map | demand signal moves through history, assumptions, review, and decision |
| Demand plan vs. forecast | Make a better decision | Know which number is prediction and which number is commitment | PF2 comparison | misconception correction + boundary artifact | forecast vs demand-plan boundary card | two paths split from one demand signal |
| Demand decomposition | Save time | Break a messy demand change into drivers | PF4 cheat-sheet grid | workflow artifact | decomposition checklist | demand change decomposed into base, promo, seasonality, one-offs |
| Demand review dashboard | Look sharper at work | Turn charts into a meeting narrative | PF8 anatomy + mixed dashboard | meeting-room pain | demand-review narrative checklist | dashboard zones map to "what changed / why / decision needed" |

## RW05 — Production Planning / Production Planning

| Post | Audience job | Curated-winner promise hypothesis | Power format | Caption pattern | Save trigger | Visual argument |
|---|---|---|---|---|---|---|
| What is a production plan | Explain clearly | Translate demand into what the factory can actually build | Process flow | plain-English system explanation | demand-to-build process map | forecast becomes constraints, materials, capacity, and schedule |
| Scheduling horizon | Avoid a mistake | Know what is frozen, flexible, and still negotiable | PF1 maturity/zone ladder | decision boundary | frozen/slushy/liquid rule card | timeline bands show decreasing flexibility as the production date gets closer |
| Sequence to cut changeover | Make a better decision | Stop losing capacity through bad sequence choices | PF6 decision tree | role pain + before/after | changeover decision tree | jobs route through a sequence optimizer with trade-off callouts |
| Optimal batch size | Make a better decision | Find the batch size where setup and holding cost meet | PF3 KPI/formula card | formula + worked example | EOQ/batch-size reference | formula block plus visual balance between setup and inventory |

## RW06 — Production Planning / MPS

| Post | Audience job | Curated-winner promise hypothesis | Power format | Caption pattern | Save trigger | Visual argument |
|---|---|---|---|---|---|---|
| MPS as a production commitment | Explain clearly | Show the line between plan and promise | PF2 comparison | concept reset | MPS commitment boundary card | forecast, demand plan, and MPS separated by commitment level |
| BOM to MPS connection | Explain clearly | Show how one finished good becomes many material needs | PF8 anatomy | artifact anatomy | BOM-to-MPS explainer | finished-good demand explodes into components and timing |
| Sensing vs monthly SKUs | Make a better decision | Decide which SKUs deserve faster signal review | PF7 ranked cards | prioritization + eligibility artifact | sensing eligibility checklist | SKUs ranked by volatility, value, and service impact |
| Forecast value-add | Avoid a mistake | Find whether forecasting effort improves the number | PF3 KPI/formula card | diagnostic + worked example | FVA test card | baseline forecast compared to human-adjusted forecast |

## RW07 — Production Planning / S&OP

| Post | Audience job | Curated-winner promise hypothesis | Power format | Caption pattern | Save trigger | Visual argument |
|---|---|---|---|---|---|---|
| The 5 pre-S&OP reviews | Save time | Know what must be settled before executive S&OP | PF4 cheat-sheet grid | complete reference | 5-review checklist | five review blocks feed into one executive decision |
| What kills an S&OP | Avoid a mistake | Spot the failure modes before the meeting becomes theatre | PF4 failure grid | problem-solution artifact | S&OP failure-mode checklist | warning signs arranged around the meeting table |
| Demand review narrative | Look sharper at work | Turn forecast variance into a story leadership can decide on | PF8 anatomy | meeting-room pain | narrative template | variance chart connected to explanation, risk, and ask |
| Forecast accuracy tracker | Save time | Track accuracy without hiding bias or volatility | PF3 KPI/reference card | metric literacy | accuracy tracker template | KPI stack separates accuracy, bias, and volatility |

## RW08 — Production Planning / Capacity Planning

| Post | Audience job | Curated-winner promise hypothesis | Power format | Caption pattern | Save trigger | Visual argument |
|---|---|---|---|---|---|---|
| Capacity utilisation | Avoid a mistake | 100% utilisation can make the system worse | Concept metaphor + PF2 | contrarian with caveat | utilisation trade-off card | capacity bar shows hidden queue and lost flexibility near 100% |
| RCCP | Explain clearly | Test whether the approved plan can actually be built | PF6 decision test | meeting-room question | RCCP question set | plan passes through rough-cut capacity checks |
| Bottleneck by cycle time | Make a better decision | Find the station controlling throughput | PF8 anatomy + process flow | diagnostic + audit artifact | bottleneck audit | line stations sized by cycle time with one constraint highlighted |
| 3 capacity scenarios | Make a better decision | Compare what breaks under upside, base, and downside demand | PF2 comparison + scenario grid | planning artifact | 3-scenario table | three demand futures stress the same capacity base |

## RW09 — Production Planning / Safety Stock

| Post | Audience job | Curated-winner promise hypothesis | Power format | Caption pattern | Save trigger | Visual argument |
|---|---|---|---|---|---|---|
| Reorder point | Save time | Know when to reorder before stock hits zero | PF3 formula card | formula + plain meaning | reorder point card | demand line crosses lead-time demand plus safety stock |
| Service level cost curve | Make a better decision | See why every extra point of service costs more | PF3 chart card | trade-off explanation | service-level trade-off curve | curve steepens as service level approaches the high end |
| Promotion lift analysis | Avoid a mistake | Separate real lift from noise before replenishment changes | PF6 decision test | analyst workflow | promotion-lift checklist | promo demand split into baseline, lift, and cannibalization |
| Leading indicators | Look sharper at work | Track signals before the forecast misses | PF4 cheat-sheet grid | early-warning promise | leading-indicator list | signal dashboard grouped by market, customer, supply, internal |

## RW10 — Inventory Management / Stock Review

| Post | Audience job | Curated-winner promise hypothesis | Power format | Caption pattern | Save trigger | Visual argument |
|---|---|---|---|---|---|---|
| The 4 types of inventory | Explain clearly | Know what each inventory bucket is protecting against | PF4 cheat-sheet grid | concept map | inventory-type reference | four inventory types mapped to risk they absorb |
| Inventory positioning | Make a better decision | Put stock where it protects service without trapping cash | PF6 decision tree | decision artifact | positioning decision tree | nodes show push/pull, postponement, decoupling point |
| Safety-stock audit | Avoid a mistake | Find SKUs where the buffer no longer matches reality | PF4 diagnostic grid | practical audit | safety-stock audit checklist | SKU rows flagged by volatility, lead time, service, obsolescence |
| Revenue at risk | Explain clearly | Translate inventory gaps into customer/revenue impact | PF7 ranked cards | executive framing | revenue-at-risk ranking | top SKUs ranked by lost-service consequence |

## RW11 — Inventory Management / Inventory Metrics

| Post | Audience job | Curated-winner promise hypothesis | Power format | Caption pattern | Save trigger | Visual argument |
|---|---|---|---|---|---|---|
| Inventory turnover | Explain clearly | Turnover is speed, not automatically health | PF3 KPI card | metric caveat | turnover interpretation card | turnover formula plus service, cash, and stockout danger zones |
| Pareto in procurement | Make a better decision | Find the few suppliers or SKUs driving most of the outcome | PF7 ranked cards | prioritization + review artifact | Pareto review template | ranked bars show where attention concentrates |
| Lead-time-doubling model | Avoid a mistake | See what happens when lead time doubles before it happens | PF2 scenario comparison | risk simulation | lead-time stress test | base vs doubled lead time changes reorder point and exposure |
| SKU segmentation | Save time | Decide what should be MTS, MTO, or engineer-to-order | PF6 decision tree | decision artifact | SKU segmentation tree | SKU attributes route to make-to-stock / make-to-order / engineer-to-order |

## RW12 — Inventory Management / SKU Management

| Post | Audience job | Curated-winner promise hypothesis | Power format | Caption pattern | Save trigger | Visual argument |
|---|---|---|---|---|---|---|
| SKU rationalisation | Avoid a mistake | Remove complexity without cutting useful choice | PF6 decision tree | decision caveat | rationalisation test | SKU branches split into keep, combine, retire, investigate |
| Cash conversion cycle | Explain clearly | Show how inventory decisions trap or release cash | Process flow + PF3 | finance translation | CCC explainer | cash moves through inventory, receivables, payables, and back |
| Slotting/utilisation audit | Save time | Find warehouse space that is slowing the operation | PF8 anatomy | operational audit | slotting audit checklist | warehouse zones labelled by velocity, pick path, congestion |
| Replenishment calendar | Save time | Turn reorder chaos into a weekly operating rhythm | PF4 calendar/grid | workflow artifact | replenishment cadence template | weekly calendar blocks show review, order, expedite, exception |

## How To Use This Map

Use this section only after a topic passes the V4 audience/evidence gate and the editor decides that curated-reference packaging will materially improve it.

1. Find the relevant legacy row or accepted topic analogue.
2. Run `node scripts/compile-topic-seed.mjs {topic-or-slug}` to pull the row plus matching power-format hypotheses.
3. If an external reference is selected, fill `templates/reference-learning-card-template.md` for only the useful 1–3 references.
4. Put the optional reference fit into `content-brief-v2.md` without replacing the topic's pain and proof evidence.
5. Fill `creative-brief-lite.md` from the accepted content brief and the useful packaging lessons.
6. Run `node scripts/build-visual-package.mjs data/{week}/{slug}`.

If no row improves the accepted topic, record `Top-100 not used` and continue with the stronger evidence or artifact mechanic. A missing map fit never rejects or reframes a topic by itself.
