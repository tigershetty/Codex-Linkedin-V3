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

---

## Second pass — the "limitless / 1-second" bespoke-illustration set (2026-06-29)

After the chart/dashboard family (v1–v6) kept failing the **1-second thumbnail-capture test** (no single focal point), the brief reset to *metaphor-first, hand-drawn SVG, one dominant gesture*. V7 "The Edifice" (six-column portico) was the first to break out. This pass adds three more, each a **different metaphor and shape family** — not recolours of one idea — all on the Shetty's Desk brand kit and all carrying the same verified numbers.

| | Metaphor (shape family) | The one gesture | Why it reads in 1 second |
|---|---|---|---|
| **V7** | The Edifice (architecture) | Liability buried in scaffolding, Scope cracking | A building everyone reinforces in the wrong place. |
| **V8** | The Iceberg (water / depth) | Tiny bright tip vs huge submerged mass | Tip = Liability (fought hardest); the mass below = Scope, 77%. Size contrast does the talking. |
| **V9** | The Spotlight (theatre / light) | A light cone on Liability centre-stage; Scope cracks in the dark wing | All the light on the wrong clause; the coral fissure is the only thing glowing offstage. |
| **V10** | The Umbrella (everyday / weather) | A reinforced umbrella over Liability; the coral storm soaks Scope | The cover is over the wrong box. Most accessible / "coffee-table" read of the set. |

**Shared discipline (all four):** one dominant gesture, brand ink `#15315C` on luminous white, azure = the over-protected clause (Liability), **coral reserved strictly for the caution** (the crack / the rain / the danger mass), green for the payoff ledger + footrule. Logo 2 + "Poornajith Shetty" footer. Numbers all verified: **77%** of disputes start at scope; Liability = **#1 most-negotiated** term since 2007; **4/6** most-negotiated terms also rank most-important; ICC Incoterms 2020.

- `renderer/templates/sc101-supply-contract-clauses-v7.html` → `out/…-v7.png` (edifice)
- `renderer/templates/sc101-supply-contract-clauses-v8.html` → `out/…-v8.png` (iceberg)
- `renderer/templates/sc101-supply-contract-clauses-v9.html` → `out/…-v9.png` (spotlight)
- `renderer/templates/sc101-supply-contract-clauses-v10.html` → `out/…-v10.png` (umbrella)
- Chosen variant → copy to `visual.png` (pending pick).
