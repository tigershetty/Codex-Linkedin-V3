# Publish Asset Specification v1

**Version:** 1.0
**Date:** 2026-07-15
**Status:** Active export and website media standard

## Current Audit

Nineteen canonical `visual.png` files were reviewed.

- All nineteen are below LinkedIn's 5 MB organic photo limit.
- All are at least 864 pixels wide and are strong enough for the current website's 760-pixel content column.
- Eighteen are taller than the 4:5 organic LinkedIn boundary. Only `2026-W27/supply-contract-clauses/visual.png` currently falls inside the accepted 3:1 to 4:5 range.
- Most recent GPT Image 2 masters are 1024 x 1536 (2:3). EOQ is 1003 x 1568; MPS/BOM are 864 x 1820/1821.
- Website stills are safe because the article component uses width-constrained `object-contain` behavior and preserves the native ratio.
- Website GIFs range from roughly 1.1 MB to 3.8 MB. Existing MP4 masters are only about 383 KB to 954 KB and should be served on the website.

## Canonical And Export Files

| File | Purpose | Rule |
|---|---|---|
| `visual.png` | Canonical approved master | Preserve exactly after approval |
| `visual-linkedin.png` | Organic feed companion | 1080 x 1350 (4:5), under 5 MB |
| `visual-motion.gif` | LinkedIn motion companion | Under 100 MB and 500 frames; remain readable when paused |
| `visual-motion.mp4` | Website/full-resolution master | Same visual ratio, H.264-compatible delivery, still poster |

## LinkedIn Still Rule

Design future posts natively at 1080 x 1350 when the concept allows it.

When the approved master is taller:

1. do not crop the artifact;
2. do not scale or distort the artwork;
3. create `visual-linkedin.png` on a 1080 x 1350 branded field;
4. fit the full master inside the field with intentional side rails or supporting brand space;
5. inspect feed-size text after export.

The companion is an export treatment, not a redesigned post.

## Website Rule

- Preserve the canonical native ratio.
- Use Next Image for stills with explicit width/height and responsive sizes.
- Use MP4 for motion preview when available; retain GIF only as fallback and publishing asset.
- Use the approved still as the video poster.
- Test at mobile and desktop widths for clipping, overflow, and unreadable controls.

## Audit Commands

```bash
node scripts/audit-visual-package.mjs data/{week}/{slug}
node scripts/audit-motion-package.mjs data/{week}/{slug}
```

The visual audit reports a LinkedIn geometry warning when the canonical master is outside 4:5 and no compliant companion export exists.

## Official References

- LinkedIn photo requirements: https://www.linkedin.com/help/linkedin/answer/a596184
- LinkedIn document posts: https://www.linkedin.com/help/linkedin/answer/a519831
- LinkedIn supported media file types: https://www.linkedin.com/help/linkedin/answer/a564109
- LinkedIn single-image specifications: https://www.linkedin.com/help/linkedin/answer/a426534/single-image-ads-advertising-specifications
