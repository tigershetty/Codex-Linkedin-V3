// Custom TextAnimate — inspired by Magic UI's text-animate registry component.
// Splits text by character or word and staggers the `blurInUp` CSS animation
// (defined in tokens.css) across each fragment.
//
// Props:
//   animation  — keyframe name from tokens.css (default: "blurInUp")
//   by         — "character" | "word"  (default: "character")
//   once       — boolean; true = plays once, false = loops (default: true)
//   delay      — initial delay before stagger begins, in seconds (default: 0)
//   duration   — per-fragment duration in seconds (default: 0.5)
//   stagger    — delay between fragments in seconds (default: 0.03)

export function TextAnimate({
  children = '',
  animation = 'blurInUp',
  by = 'character',
  once = true,
  delay = 0,
  duration = 0.5,
  stagger = 0.03,
  style = {},
}) {
  const text = String(children)
  const fragments = by === 'word' ? text.split(' ') : [...text]

  return (
    <span style={{ display: 'inline-block', ...style }}>
      {fragments.map((fragment, i) => (
        <span
          key={i}
          style={{
            display:                  'inline-block',
            animationName:            animation,
            animationDuration:        `${duration}s`,
            animationTimingFunction:  'ease-out',
            animationFillMode:        'both',
            animationIterationCount:  once ? 1 : 'infinite',
            animationDelay:           `${delay + i * stagger}s`,
          }}
        >
          {/* Preserve spaces — a bare ' ' collapses in inline layout */}
          {fragment === ' ' ? '\u00a0' : fragment}
          {/* Re-insert the space that split() consumed between words */}
          {by === 'word' && i < fragments.length - 1 ? '\u00a0' : ''}
        </span>
      ))}
    </span>
  )
}
