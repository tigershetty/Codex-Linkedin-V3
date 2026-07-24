# Publish Asset Specification v1

**Version:** 1.1
**Date:** 2026-07-19
**Status:** Active export and website media standard

## Canonical Rule For New Posts

The approved artwork is the LinkedIn artwork. Do not keep a tall model render as `visual.png` and treat 4:5 as a secondary afterthought.

| File | Purpose | Rule |
|---|---|---|
| descriptive candidate PNG | native GPT Image 2 evidence | normally 1024 x 1536; never canonical |
| `visual.png` | canonical approved still | exactly 1080 x 1350, below 5 MB |
| `visual-linkedin.png` | organic-feed posting asset | byte-identical to `visual.png` |
| `visual-motion.gif` | LinkedIn motion companion | 4:5, under 100 MB and 500 frames, readable when paused |
| `visual-motion.mp4` | website/full-resolution master | 1080 x 1350 where practical, H.264-compatible, still poster |

Both still filenames must have the same SHA-256 hash for every new post.

## GPT Image 2 Promotion

GPT Image 2 portrait generation normally uses 1024 x 1536. Compose the candidate for promotion before rendering:

- centered content-safe area: 1024 x 1280;
- expendable top atmosphere: 128 pixels;
- expendable bottom atmosphere: 128 pixels;
- no title, label, logo, formula, arrow endpoint, or meaningful object outside the safe area.

Promote with:

```bash
python scripts/export-linkedin-still.py \
  --input data/{week}/{slug}/{candidate}.png \
  --out data/{week}/{slug}/visual-linkedin.png \
  --canonical data/{week}/{slug}/visual.png \
  --mode safe-crop
```

The script center-crops the prompt-safe composition to 4:5, resizes once to 1080 x 1350, and writes the exact same PNG bytes to both canonical paths.

## Legacy Recovery

Use `--mode legacy-fit` only when an older approved artifact cannot be regenerated or safely cropped. It preserves the full tall artifact on a quiet branded field. Record the reason in `visual-output-review.md`.

Legacy recovery is not the template for new visual design.

## Still QA

Before approval:

1. verify both files are 1080 x 1350;
2. verify SHA-256 equality;
3. verify each file is below 5 MB;
4. inspect the full image at feed size;
5. inspect tight crops of text, data, formulas, visual anchors, and logos;
6. run `node scripts/audit-visual-package.mjs data/{week}/{slug}`.

## Motion QA

- Use the exact canonical `visual.png` as the motion source and poster.
- MP4 retains 1080 x 1350 at 30 fps where practical.
- GIF normally uses 720 x 900 and 18-20 fps with `palettegen` and `paletteuse`.
- Opening and restored lossless frames match `visual.png` with zero pixel difference.
- Inspect the encoded GIF separately from the lossless source frames.
- Run `node scripts/audit-motion-package.mjs data/{week}/{slug}`.

## Website Rule

- Preserve the exact 4:5 still.
- Use Next Image with explicit width/height and responsive sizes.
- Use MP4 for motion preview when available; retain GIF as fallback and LinkedIn publishing asset.
- Use the approved still as the video poster.
- Test mobile and desktop for clipping, overflow, readability, controls, and download behavior.

## Official References

- GPT Image 2 model sizes: https://developers.openai.com/api/docs/models/gpt-image-2
- LinkedIn photo requirements: https://www.linkedin.com/help/linkedin/answer/a596184
- LinkedIn supported media file types: https://www.linkedin.com/help/linkedin/answer/a564109
