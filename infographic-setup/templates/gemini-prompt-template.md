# Gemini Prompt Template — Infographic Content Engine v1

> Copy this template when building the final output file. This mirrors the output of /gemini-prompt [slug].

---

# Gemini Prompt — [topic-slug]
**Week**: [YYYY-W##]

## Quick Start
1. Open gemini.google.com → Select Gem **"Shetty's Desk — Infographic Engine"**
2. Upload `references/brand-anchor-v1.webp` as style reference (drag into chat before pasting)
3. Paste **Variant A** → generate → run 3-point Calibration Check
4. Paste **Variant B** → generate → run Calibration Check → compare renders
5. Pick stronger render → export as PNG 2048×2048
6. Post on LinkedIn → paste caption below → post sources as first comment

---

## Variant A — Paradox-Led Narrative

```
Task: Create an infographic image for the summary below (after the rules).

Rules: Use the image attached as a reference on style, aesthetics,
colours, and illustration technique. Use a different layout for the
structure to elaborate details based on the summary. Do not use any
information or text from the attached image — only style. Use it only
for inspiration. Aspect ratio 1:1, resolution 2048×2048.

Story premise: [PASTE committed_message from message-commit.md — one sentence]
Visual anchor: [PASTE hero_number] — [PASTE what_it_proves]. Make this the
most visually prominent element on the canvas.

[PASTE VARIANT A NARRATIVE SUMMARY FROM content.md]
```

---

## Variant B — Scene-Led Narrative

```
Task: Create an infographic image for the summary below (after the rules).

Rules: Use the image attached as a reference on style, aesthetics,
colours, and illustration technique. Use a different layout for the
structure to elaborate details based on the summary. Do not use any
information or text from the attached image — only style. Use it only
for inspiration. Aspect ratio 1:1, resolution 2048×2048.

Story premise: [SAME committed_message as Variant A]
Visual anchor: [SAME hero_number] — [SAME what_it_proves]. Make this the
most visually prominent element on the canvas.

[PASTE VARIANT B NARRATIVE SUMMARY FROM content.md]
```

---

## Calibration Check (run after each render)
- [ ] Background is deep blue (not white or grey)?
- [ ] Text is readable — no garbled numbers or spec annotations visible?
- [ ] Single dominant visual element present — the hero number or its object stands out?

2-3 render attempts per variant is normal. If a check fails: identify the specific
failing element → adjust that element in content.md → re-generate.
Do not rewrite the entire narrative on one failure.

---

## LinkedIn Caption

[PASTE ANCHORS CAPTION FROM content.md]

---

## Sources (post as first comment)

SOURCES:
1. [Organisation, Year] — [URL]
2. [Organisation, Year] — [URL]
[Add rows 3-12 as needed. Do not exceed 12.]
