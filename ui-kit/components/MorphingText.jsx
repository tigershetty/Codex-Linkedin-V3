// Custom MorphingText — inspired by Magic UI's morphing-text registry component.
// Cycles through an array of strings, blurring out the current text and
// blurring in the next one. Pure CSS filter transitions — no canvas, no
// Tailwind, no framer-motion.
//
// Props:
//   texts      — string[]  (required)
//   interval   — ms between morphs (default: 2500)
//   style      — style overrides applied to the wrapper span

import { useEffect, useState } from 'react'

export function MorphingText({ texts = [], interval = 2500, style = {} }) {
  const [index, setIndex] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (texts.length < 2) return

    const timer = setInterval(() => {
      // Blur-out current text
      setLeaving(true)

      // After the blur-out completes, swap text and blur back in
      setTimeout(() => {
        setIndex((i) => (i + 1) % texts.length)
        setLeaving(false)
      }, 350)
    }, interval)

    return () => clearInterval(timer)
  }, [texts.length, interval])

  return (
    <span
      style={{
        display:    'inline-block',
        filter:     leaving ? 'blur(10px)' : 'blur(0)',
        opacity:    leaving ? 0 : 1,
        transform:  leaving ? 'scale(0.95)' : 'scale(1)',
        transition: 'filter 0.35s ease, opacity 0.35s ease, transform 0.35s ease',
        ...style,
      }}
    >
      {texts[index]}
    </span>
  )
}
