// Custom AnimatedCircularProgressBar — inspired by Magic UI's
// animated-circular-progress-bar registry component.
// Pure SVG + CSS transitions, no external dependencies.
//
// Props:
//   value               — 0–100. If omitted, auto-cycles (demo / indeterminate mode).
//   gaugePrimaryColor   — arc fill color  (default: #00e5ff)
//   gaugeSecondaryColor — track fill color (default: rgba(0,229,255,0.12))
//   size                — diameter in px (default: 56)
//   strokeWidth         — arc stroke width in px (default: 5)
//   showValue           — render the percentage label (default: false)

import { useEffect, useState } from 'react'

export function AnimatedCircularProgressBar({
  value: externalValue,
  gaugePrimaryColor   = '#00e5ff',
  gaugeSecondaryColor = 'rgba(0, 229, 255, 0.12)',
  size        = 56,
  strokeWidth = 5,
  showValue   = false,
}) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    // External value provided → just sync it
    if (externalValue !== undefined) {
      setValue(externalValue)
      return
    }

    // No external value → cycle 0 → 10 → … → 100 → 0 (indeterminate visual)
    const increment = (prev) => (prev >= 100 ? 0 : prev + 10)
    setValue(increment)
    const id = setInterval(() => setValue(increment), 2000)
    return () => clearInterval(id)
  }, [externalValue])

  const radius        = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset        = circumference - (value / 100) * circumference

  return (
    <div
      style={{
        position:  'relative',
        width:     size,
        height:    size,
        flexShrink: 0,
      }}
    >
      {/* SVG rotated so arc starts at 12 o'clock */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)', display: 'block' }}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={gaugeSecondaryColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={gaugePrimaryColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>

      {showValue && (
        <div
          style={{
            position:       'absolute',
            inset:          0,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            fontSize:       `${size * 0.22}px`,
            fontWeight:     600,
            color:          gaugePrimaryColor,
          }}
        >
          {value}%
        </div>
      )}
    </div>
  )
}
