# AI-Still Visual Path — GPT Image 2 / Higgsfield (the 101 backup lane) — Learnings

**Version:** 1.0 · **Created:** 2026-06-29 · **For:** the Supply Chain 101 backup visual path (illustration/metaphor posts).
**Scope:** the AI-still image lane only — code-render (`renderer/`, HTML→PNG) stays the **primary** 101 visual (see `render-pilot-workflow.md`). This file is the playbook for when the backup lane is used: how to pick the framework, write the prompt, and run the engine.
**Source:** distilled from the `supply-contract-clauses` (Ep35) iteration, June 2026 — ~6 prompt rounds before the visual locked.

---

## 0. The one big lesson — framework first, prompt second

When an AI-still infographic looks **"good but generic,"** the fix is almost always the **framework** (what argument the shape makes), not more prompt wording. We burned several rounds polishing adjectives on the wrong framework — it just produces a well-polished generic. Change the framework, *then* tune the prompt.

### How to select a framework — claim decomposition
A post's message usually contains **several arguable claims**, and **each claim points to a different visual family.** Choosing *which claim to lead with* is the real creative fork. Don't anchor on one metaphor and hunt for neighbours of it (that's how we got stuck on "the temple").

1. Write the message in one line.
2. List every distinct claim hiding inside it.
3. Map each claim to a family (the shape that *makes that argument* — see `layout-frameworks-intelligence.md` §1, "the one rule").
4. Pick by (a) which claim is the headline and (b) the data-integrity filter below.

Worked example — *"Six clauses; teams fight Liability hardest; 77% of disputes start at Scope":*

| Lead claim | Shape must say | Family |
|---|---|---|
| Hidden mass | visible tip / huge submerged body | Iceberg, cutaway |
| Ranking mismatch | two orders that cross | Dumbbell, slope, diverging bars |
| Misallocated defense | force aimed at the wrong target | Scales, fortress/wrong-gate, target |
| Structure with one weak member | a system one weak part decides | **Edifice / pillars (LOCKED here)**, weak-link chain, keystone |
| Concentration | one slice dwarfs the rest | Pareto, treemap, waffle |
| Cascade / origin | first domino → chain reaction | Domino, fishbone, fault line |

### Data integrity narrows the choice
Only **verified facts** may appear on the card. Frameworks that need per-item numbers we don't have (diverging bars across all six clauses, a scatter) would force invented figures — **forbidden**. Metaphor/structural frameworks that need only the known facts are both safer and usually more striking. Keep every non-highlighted item **neutral and unmarked** — claim nothing about it.

---

## 1. Prompt register — information-design infographic, NOT cinematography

When the user asks for **"more dramatic / less AI-like / like a designer made it,"** that means **conceptually sharper and cleaner / design-forward** — it does **not** mean cinematography. A cinematic brief (low camera angle, raking light, chiaroscuro, "ominous mood," weathered texture, depth planes) produces a moody photographic **scene** — the exact opposite of a crisp infographic. That round was rejected outright.

Write the prompt as:
- *"A clean, modern, design-forward infographic"* / *"an information-design graphic like the Financial Times or The Economist would publish."*
- Flat vector or **flat-dimensional** illustration; **even, clean illumination**; flat-on / front-facing; **no camera angle, no dramatic lighting, no scene, no photography.**
- Mark the standouts **by design, not by light** — a scaffold grid, a crack line, a tag, a colour accent — so the focal hierarchy survives the flat treatment.

---

## 2. Reference anchors are load-bearing — never strip them

Dropping the brand style anchors (running logo-only) made the engine fall back to its **generic prior** (a stock stone temple) and the output stopped looking like Shetty's Desk. Restoring the anchors fixed it in one round.

- **Always attach the 4 white-bg brand anchors + the logo (logo LAST).** These teach the clean Shetty's Desk look; the prompt's colour words alone do not.
- The white-bg anchors beat the original deep-blue `brand-anchor-v1.webp` (which rendered muddy colour). Prefer the white-bg set.
- Write the brand accents into the prompt **as well** (navy / azure base, one coral accent) — but the anchors do the heavy lifting.

**Persistent Higgsfield media IDs (this workspace):**
| Anchor | Media ID |
|---|---|
| Perks (white-bg) | `99601e58-92b7-4e0a-bb91-b09f8eaa98a2` |
| Batteries (white-bg) | `a5059fdd-7839-461e-944a-5e964163baa6` |
| EV-cutaway (white-bg) | `079e1b1e-7bd2-44d7-b1c4-af52205a59d1` |
| Renewable (white-bg) | `6ccd9b76-1288-4c7b-bbc0-6ea41cfd303c` |
| Shetty's Desk logo (LAST) | `7c3fc954-26f2-466f-8419-6a52a9d9a67b` |

---

## 3. Prompt hygiene

- **Let the anchors govern style — don't describe it (added 2026-06-29).** The reference anchors already carry the look. Spelling out style adjectives in the prompt — *"flat vector / flat-design / even illumination / no camera angle / iconographic two-tone silhouettes / NOT cartoonish / NOT 3D"* — does two harmful things: it **duplicates** the anchors, and it **over-constrains the engine toward generic/cartoon output** (asking for "simple two-tone silhouettes" literally requests cartoon figures, and the Ep36 triptych came back cartoonish because of it). Strip the style layer entirely; describe only **what is in the scene** (the subjects, the composition, the on-image text) and the **one semantic colour call** (which element gets the caution accent). Style = anchors' job; content = prompt's job. This is the original Gemini-house-form discipline ("use the attached image for style only") — keep it.
- **Trim the Rules block.** Minimal rules work: *"Use the attached images as style references — follow style, colours and technique, not their subject matter. The last image is the Shetty's Desk logo; reproduce it as given, small, bottom-left. Aspect ratio 3:4."* The anchors carry the rest.
- **No NEGATIVE / DO-NOT blocks.** Confirmed again: negative-prompt blocks degrade GPT Image 2. Phrase every constraint **positively**. (This is also a CLAUDE.md hard rule; the old 101 SKILL.md Step 4B template still carried a `DO NOT` block — it has been removed.)
- **One coral accent, reserved.** Coral only on the single caution element (the failing item + its number). Navy + azure is the base; ghost everything non-focal.

---

## 4. Engine & platform quirks (GPT Image 2 via Higgsfield)

- **GPT Image 2 cannot do 4:5.** Supported: 1:1, 4:3, 3:4, 16:9, 9:16, 3:2, 2:3. Use **3:4** for the portrait 101 card. (The old skill template said 1:1 — outdated.)
- Standard params: `quality: high`, `resolution: 4k`.
- GPT Image 2's internal engine name surfaces as **"videotape-alpha"** in job records — expected, not an error.
- **Backend remaps the nano IDs:** requesting `nano_banana_pro` actually ran `nano_banana_2`; `nano_banana_2` ran `nano_banana_flash`. Always record the engine that *ran*, not the one requested.
- **FLUX.2** takes references under role `image_references`, not `image`.

### Engine bracket (when choosing a model)
Run the **same prompt + references** across candidates (`gpt_image_2`, `seedream_v4_5`, `nano_banana_2`, `nano_banana_flash`, `flux_2`) at 4:5 where supported else 3:4, and let the user judge in-panel. Verdict this session: **GPT Image 2 best for text-heavy infographic typography**; Seedream close on mood; nano variants + FLUX read flat/AI.

---

## 5. Egress constraint (this remote environment)

The CloudFront output host (`d8j0ntlcm91z4.cloudfront.net`) and `upload.higgsfield.ai` are **blocked by session egress policy (403).** Consequences:
- **I cannot view or download the generated PNGs** — the user must judge each render visually in the Higgsfield panel. Every generation is gated on their read.
- Reference media must be **imported server-side** (e.g. via a public Netlify deploy-preview URL → `media_import_url`), because direct upload is blocked.
- Do **not** route around the block — report the blocked host and proceed via the user's eyes.

---

## 6. The locked template — "structure with one weak member"

The chosen visual for `supply-contract-clauses` (Ep35) is the **crisp pillars / "Edifice"** prompt and it is the reusable seed for any *"N-part structure, one part is the surprising weak point"* 101 post:

> Six clean **flat-dimensional columns** = one unified structure (the contract). The **over-defended** item is wrapped in an azure scaffold grid ("FOUGHT HARDEST"); the **actually-failing** item carries a single coral crack line ("WHERE IT BITES" + the stat). The other items are calm, identical, navy. Flat-on, even illumination, anchors + logo, header bar + per-column labels, 3:4.

Full paste-ready prompt: `data/2026-W27/supply-contract-clauses/gpt-image-2-prompt.md` → **"LOCKED VISUAL"**.

---

## 7. Process notes

- **Present the framework before generating.** The user gates each generation — and since I can't show them the PNG, they judge it in-panel. Don't fire a generation they haven't blessed.
- **When asked for judgment, commit to ONE strong pick** with a short rationale. Don't dump a menu — that reads as indecision (the user pushed back on menus twice).
- **Keep a future-post seed log.** Shelved this session: **"The Mismatch"** — a pure information-design graphic (a six-clause spine with two offset markers, effort vs failure). Good, just not chosen for this card.
