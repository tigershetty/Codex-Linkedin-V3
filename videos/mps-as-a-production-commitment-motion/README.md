# MPS As A Production Commitment Motion

Source: `infographic-setup/data/2026-W31/mps-as-a-production-commitment/visual.png`

This is a layout-specific Motion Engine v1 build. It keeps the approved still
locked, uses delayed semantic source-color highlights for exact labels and
icons, keeps the runway and compound downstream models intact, and traces
signals only along paths already present in the artwork. Destructive covers
were rejected because the printed grid, perspective, shadows, and pedestal
geometry cannot be erased cleanly from a flattened PNG.

## Build

```bash
/Users/tigershetty/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 videos/mps-as-a-production-commitment-motion/build_motion_assets.py
cd infographic-setup/renderer
env W=864 H=1821 FPS=30 GIF_FPS=18 GIF_W=720 HOLD_S=0 node render-anim.mjs ../../videos/mps-as-a-production-commitment-motion/compositions/main.html ../data/2026-W31/mps-as-a-production-commitment/visual-motion
```

For low-cost QA, set `FPS=10`, `GIF_FPS=10`, `GIF_W=480`, `KEEP_FRAMES=1`, and
`FRAMES_DIR=../../videos/mps-as-a-production-commitment-motion/qa/frames`.

The first and final captured PNG frames must be pixel-identical to the source.
