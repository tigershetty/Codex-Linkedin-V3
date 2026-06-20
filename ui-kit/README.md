# UI Kit — Salvaged Blocks & Animations

Reusable React components salvaged from the retired web app (now in `_archive/web-app/`).
Kept for future reuse.

## Components (`components/`)
| Component | What it is |
|---|---|
| `SpiralAnimation.jsx` | Animated spiral background/visual |
| `BackgroundPaths.jsx` | Animated flowing background paths |
| `DottedSurface.jsx` | 3D dotted surface (three.js) |
| `SplashScreen.jsx` | Intro/splash screen animation |
| `TextAnimate.jsx` | Text reveal/entrance animation |
| `MorphingText.jsx` | Text that morphs between strings |
| `AnimatedCircularProgressBar.jsx` | Animated circular progress indicator |

`tokens.css` — design tokens (colours, spacing, type) these components were built against.

## Dependencies
Install these in any project that reuses the kit:
```
react  framer-motion  gsap  three
```

## Notes
- Presentation-only "blocks." The app-specific components (`ChatPanel`, `RunDetailPanel`) and pages
  stayed with the archived app in `_archive/web-app/`.
- To use one: copy the `.jsx` into your project, install the deps above, pull tokens from `tokens.css`.
