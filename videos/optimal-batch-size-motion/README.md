# Optimal Batch Size Motion GIF

**Source visual:** `infographic-setup/data/2026-W30/optimal-batch-size-decision-board/visual.png`

**Approved GIF:** `../../infographic-setup/data/2026-W30/optimal-batch-size-decision-board/visual-motion-studio-final.gif`  
**Approved MP4 master:** `../../infographic-setup/data/2026-W30/optimal-batch-size-decision-board/visual-motion-studio-final.mp4`

**Selected delayed-reveal GIF:** `../../infographic-setup/data/2026-W30/optimal-batch-size-decision-board/visual-motion.gif`  
**Selected delayed-reveal MP4:** `../../infographic-setup/data/2026-W30/optimal-batch-size-decision-board/visual-motion.mp4`  
**Selected iteration retained:** `visual-motion-delayed-reveal-v2.gif` / `.mp4`

## Treatment

Short picture-first motion poster for LinkedIn. The approved visual is the immutable base. One decision signal moves through the operating logic:

- opening still hold,
- formula luminance reveal,
- cost-curve trace and tracked decision dot,
- smaller/current/larger batch-model illumination,
- trade-off indicator scan,
- five planner-verification pulses,
- exact return to the approved still for the loop.

## Approved Compositing Model

`visual.png` remains locked at all times. Motion assets are alpha masks derived from the source pixels and converted into transparent, source-colored highlight PNGs. There are no duplicated panel crops, moving text layers, redrawn logos, or approximate replacement cards.

```text
approved visual.png
  + source-derived semantic alpha masks
  + transparent source-colored highlight layers
  + tightly registered SVG signal markers
  -> deterministic GSAP timeline
  -> Playwright frame capture
  -> FFmpeg MP4 + palette-optimized GIF
```

The first and final lossless frames must match `visual.png` exactly.

## Delayed-Reveal Variant

The revised variant makes the motion readable at feed speed. Selected source
components clear behind fitted, source-matched glass plates and then return in
the order a planner would read the decision:

1. EOQ formula
2. complete cost chart, with separate line emphasis
3. smaller, current, and larger batch models
4. four trade-off rows
5. five verification checks

The title, explanatory copy, logos, panel frames, and surrounding factory scene
never move. The final 1.5 seconds restore the complete still for reading and a
clean loop.

- Choreography: `shot-plan-delayed-reveal.json`
- Composition: `compositions/delayed-reveal.html`
- Clean cover plates: `assets/covers/`

Rebuild:

```bash
/Users/tigershetty/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 videos/optimal-batch-size-motion/build_motion_masks.py
cd infographic-setup/renderer
env W=1003 H=1568 FPS=30 GIF_FPS=20 GIF_W=720 HOLD_S=0 node render-anim.mjs ../../videos/optimal-batch-size-motion/compositions/delayed-reveal.html ../data/2026-W30/optimal-batch-size-decision-board/visual-motion-delayed-reveal-v2
```

## Rejected Experiments

`render_motion_gif.py`, `extract_motion_layers.py`, `motion-map.json`, and `templates/optimal-batch-size-motion-poster.html` belong to the prototype and rectangular-crop experiments. They are retained for traceability only and must not be used as the production method.

## Approved Semantic-Mask Lane

- Design contract: `frame.md`
- Choreography: `shot-plan.json`
- Mask/highlight builder: `build_motion_masks.py`
- Generated mask audit: `assets/mask-manifest.json`
- Generated mask contact sheet: `assets/mask-contact-sheet.png`
- Composition: `compositions/index.html`
- Deterministic renderer: `../../infographic-setup/renderer/render-anim.mjs`
- Encoder: system FFmpeg with palette generation and palette use

Rebuild:

```bash
/Users/tigershetty/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 videos/optimal-batch-size-motion/build_motion_masks.py
cd infographic-setup/renderer
env W=1003 H=1568 FPS=30 GIF_FPS=20 GIF_W=720 node render-anim.mjs ../../videos/optimal-batch-size-motion/compositions/index.html ../data/2026-W30/optimal-batch-size-decision-board/visual-motion-studio-final
```

## QA Gates

- No duplicated source crops or approximate replacement artwork.
- Reset covers must be source-fitted clean plates, tightly registered, and gone before the final hold.
- Every bitmap motion layer has a transparent alpha channel.
- Text, formula meaning, logos, panel geometry, and source lighting stay locked.
- Motion remains inside the intended semantic region.
- First frame pixel diff against `visual.png`: zero.
- Final frame pixel diff against `visual.png`: zero.
