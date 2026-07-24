# The Five Pre-S&OP Reviews Motion

**Source:** `../../infographic-setup/data/2026-W32/five-pre-sop-reviews/visual-linkedin.png` (`1080 x 1350`)  
**GIF:** `../../infographic-setup/data/2026-W32/five-pre-sop-reviews/visual-motion.gif`  
**MP4:** `../../infographic-setup/data/2026-W32/five-pre-sop-reviews/visual-motion.mp4`

## Motion Logic

The approved still remains locked. Registered source highlights animate the reading order:

1. data and performance readiness
2. portfolio review
3. demand review
4. supply review
5. integrated reconciliation
6. executive S&OP convergence
7. readiness equation

All accents clear by `7.1s`, followed by a `1.9s` complete-still hold.

## Build

```bash
python videos/five-pre-sop-reviews-motion/build_motion_assets.py
```

Publish render:

```bash
cd infographic-setup/renderer
env W=1080 H=1350 FPS=30 GIF_FPS=18 GIF_W=720 KEEP_FRAMES=1 \
  FRAMES_DIR=../../videos/five-pre-sop-reviews-motion/qa/frames-final \
  node render-anim.mjs \
  ../../videos/five-pre-sop-reviews-motion/compositions/main.html \
  ../data/2026-W32/five-pre-sop-reviews/visual-motion
```

## QA Contract

- frame `0`: pixel-identical to `visual-linkedin.png`
- frame `213` at `7.1s`: pixel-identical to `visual-linkedin.png`
- frame `270` at `9.0s`: pixel-identical to `visual-linkedin.png`
- all review text and the exact logo remain locked
- no raw rectangular crop appears above the source
