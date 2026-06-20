// Faithful TypeScript → JavaScript conversion of the BackgroundPaths component.
// Used as a fixed full-screen background layer behind all app pages.
//
// Changes from original:
//   - TypeScript types removed
//   - Tailwind classNames → inline styles (project has no Tailwind)
//   - dark: variants → light-mode only (app uses :root light theme)
//   - @/components/ui/button → not used (no title/button in background-only variant)
//   - `repeat: Number.POSITIVE_INFINITY` → `repeat: Infinity` (identical value)
//   - Title + letter animation omitted — this component is background only;
//     the SplashScreen handles entry text.

import { motion } from 'framer-motion'

// FloatingPaths: 36 layered SVG curves that flow and pulse.
// `position` (1 or -1) mirrors the set of paths to create bilateral symmetry.
function FloatingPaths({ position }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }))

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <svg
        style={{ width: '100%', height: '100%', color: '#0f172a' }}
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity:    [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat:   Infinity,
              ease:     'linear',
            }}
          />
        ))}
      </svg>
    </div>
  )
}

// BackgroundPaths: renders two mirrored FloatingPaths sets.
// Used in App.jsx as the fixed background behind all pages.
export function BackgroundPaths() {
  return (
    <>
      <FloatingPaths position={1}  />
      <FloatingPaths position={-1} />
    </>
  )
}
