# supply-contract-clauses — 3 craft variants + QA
**Week**: 2026-W27 (RW02) · **Generated**: 2026-06-28
**What this is**: the post rebuilt under the new **3-variant standard** + the new **premium craft layer** (`references/premium-visual-craft.md`), produced from the 2026 research sweep (SetProduct Orion, Visual Capitalist/FT/Economist, McKinsey/BCG/Gartner, Eric Partaker, Visualize Value).

---

## The 3 variants (pick one)

| | Framework (distinct skeleton) | Hero device | Why it works |
|---|---|---|---|
| **V1** | Slope / bump crossing (#71) | Two crossing hero lines | The crossing *is* the thesis — Liability dives, Scope climbs. Most visually dramatic. |
| **V2** | 2×2 matrix (#6 / Kraljic family) | 4 named quadrants + plotted clauses | A **reusable decision tool** (highest save-value); the diagonal mismatch is unmistakable. |
| **V3** | Dumbbell / gap chart (#216) | Per-clause gap rows + Orion stat card | Cleanest "scoreboard" read; rows flip coral→green top to bottom. |

All three: 4:5 (1080×1350), no AI-tool logo, Logo 2 + signature footer.

---

## What changed vs the previous render — the craft layer applied

The old card (committed `sc101-supply-contract-clauses.html`, the 1240-tall slope) was already a good *shape*. The upgrade is **craft**, applied to all three:

| Craft move (from `premium-visual-craft.md`) | Before | After |
|---|---|---|
| **Title = a full-sentence claim** | "A supply contract isn't boilerplate…" (close) | All three lead with a claim that states the takeaway ("The clause you fight hardest is rarely the one that bites" / "You negotiate the wrong corner" / "What you fight isn't what breaks"). |
| **Source band (mandatory, quiet)** | absent | Every card now carries a quiet `Source: WorldCC (IACCM)… · ICC Incoterms 2020` line by the footer — rigor signal + brand watermark (the Visual Capitalist move). |
| **Orion stat-card cadence** | the "4" was a loose number in a box | Now a proper Orion KPI unit: eyebrow ("Most-negotiated vs most-important") → huge tabular number → caption. V3 uses the full top-right stat card. |
| **One accent + ghosting** | middle lines were coloured-ish | The 4 non-hero clauses are **ghosted to grey/tint**; saturation is spent only on the two hero clauses (Liability coral, Scope green). |
| **Tabular figures** | default proportional | `font-variant-numeric: tabular-nums` everywhere numbers appear (ranks, deltas, the "4"). |
| **Elevation / radii / borders** | flat-ish boxes | Tinted **two-layer shadows** (never black) + white top lip, **hairline borders**, **concentric radii** (card 20 → inner 12 → pill) — the SetProduct "expensive" tells. |
| **No em dashes** | a few "—" on the card | replaced with periods/colons across all three (brand house style). |
| **Canvas fill (Law 10)** | the slope had bottom dead space | V1 slope enlarged, V3 rows enlarged + scale axis added, so each fills the 4:5 frame. |
| **Direct labels, no legend lookup** | ok | reinforced — labels sit on the data both ends; the legend is only the colour key. |

### What improved, concretely
- **Reads as a brand, not a chart.** The shared token set (Orion tokens block) means all three look like one system — the thing that makes a feed recognisable.
- **The focal point is unambiguous.** Ghosting the four supporting clauses makes the two hero clauses (the whole point) pop instantly at thumbnail size.
- **It's now a save-worthy *tool*, not just a fact** — especially V2 (a 2×2 a reader can re-apply to their own contract), which the LinkedIn save-psychology research flags as the highest-save format class.
- **Credibility up** — action-title + source band + tabular numbers are the consulting/data-journalism rigor signals, applied consistently.

---

## Honesty note (unchanged from the research brief)
The hard numbers are sourced: Limitation of Liability = #1 most-negotiated term since 2007; "only 4 of the most-negotiated terms make the most-important list"; scope cited by ~3 in 4 teams as a dispute source; Incoterms 2020 = 11 rules. The per-clause **negotiation-effort / dispute-frequency intensities** used to position dots/lines are **relative**, derived from WorldCC/IACCM's *ranked* findings (not precise percentages) — every card labels them as such.

## Files
- `renderer/templates/sc101-supply-contract-clauses-v1.html` → `out/…-v1.png` (slope)
- `renderer/templates/sc101-supply-contract-clauses-v2.html` → `out/…-v2.png` (2×2)
- `renderer/templates/sc101-supply-contract-clauses-v3.html` → `out/…-v3.png` (dumbbell)
- Chosen variant → copy to `visual.png` (pending pick).
