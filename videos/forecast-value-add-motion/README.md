# Forecast Value Add Motion

**Source:** `../../infographic-setup/data/2026-W31/forecast-value-add/visual-linkedin.png` (`1080 x 1350`)  
**GIF:** `../../infographic-setup/data/2026-W31/forecast-value-add/visual-motion.gif`  
**MP4:** `../../infographic-setup/data/2026-W31/forecast-value-add/visual-motion.mp4`

## Motion Logic

The approved still remains locked. Source-derived masks animate the reading order:

1. actual demand, human adjusted, and naive baseline traces
2. baseline WAPE, adjusted WAPE, and positive FVA
3. positive, zero, and negative decision rules
4. promotion, customer event, and no-evidence ledger rows
5. the repeatable input pack

All accents clear by `7.0s`, followed by a `2.0s` complete-still hold.

## Build

```bash
python videos/forecast-value-add-motion/build_motion_assets.py
```

Draft QA render:

```bash
cd infographic-setup/renderer
env W=1080 H=1350 FPS=10 GIF_FPS=10 GIF_W=600 KEEP_FRAMES=1 \
  FRAMES_DIR=../../videos/forecast-value-add-motion/qa/frames-draft \
  node render-anim.mjs \
  ../../videos/forecast-value-add-motion/compositions/main.html \
  ../../videos/forecast-value-add-motion/qa/forecast-value-add-draft
```

Publish render:

```bash
cd infographic-setup/renderer
env W=1080 H=1350 FPS=30 GIF_FPS=18 GIF_W=720 KEEP_FRAMES=1 \
  FRAMES_DIR=../../videos/forecast-value-add-motion/qa/frames-linkedin \
  node render-anim.mjs \
  ../../videos/forecast-value-add-motion/compositions/main.html \
  ../data/2026-W31/forecast-value-add/visual-motion
```

## QA

- frame `0`: pixel-identical to `visual-linkedin.png`
- frame `210` at `7.0s`: pixel-identical to `visual-linkedin.png`
- frame `270` at `9.0s`: pixel-identical to `visual-linkedin.png`
- final contact sheet: `qa/final-linkedin-contact-sheet.png`
- palette-converted contact sheet: `qa/encoded-gif-linkedin-contact-sheet.png`
