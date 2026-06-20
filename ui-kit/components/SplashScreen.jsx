import { useState } from 'react'
import { TextAnimate } from './TextAnimate'
import { MorphingText } from './MorphingText'

// Pipeline stages shown as the cycling subtitle below the title
const PIPELINE_STAGES = [
  'Scout', 'Research', 'Message',
  'Content', 'Gemini Prompt', 'Publish',
]

export default function SplashScreen({ onEnter }) {
  const [fading, setFading] = useState(false)

  const handleEnter = () => {
    setFading(true)
    setTimeout(() => onEnter(), 700)
  }

  return (
    <div
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        20,
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        justifyContent:'center',
        opacity:       fading ? 0 : 1,
        transition:    'opacity 0.7s ease',
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        {/* Eyebrow label */}
        <p
          style={{
            color:          '#718096',
            fontSize:       '0.694rem',
            letterSpacing:  '0.2em',
            textTransform:  'uppercase',
            margin:         '0 0 12px',
            fontFamily:     '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          Shetty's Desk
        </p>

        {/* Main title — each character blurs in */}
        <h1
          style={{
            color:         '#e2e8f0',
            fontSize:      '1.44rem',
            fontWeight:    700,
            margin:        '0 0 16px',
            fontFamily:    '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            letterSpacing: '-0.01em',
          }}
        >
          <TextAnimate animation="blurInUp" by="character" once delay={0.1}>
            Infographic Engine
          </TextAnimate>
        </h1>

        {/* Cycling pipeline stage names */}
        <p
          style={{
            margin:        '0 0 48px',
            fontSize:      '0.694rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontFamily:    '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          <MorphingText
            texts={PIPELINE_STAGES}
            interval={2000}
            style={{ color: '#4a5568' }}
          />
        </p>

        <EnterButton onClick={handleEnter} />
      </div>
    </div>
  )
}

function EnterButton({ onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:   hovered ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
        border:       `1px solid rgba(0, 229, 255, ${hovered ? '0.8' : '0.4'})`,
        color:        '#00e5ff',
        padding:      '12px 32px',
        borderRadius: '8px',
        fontSize:     '0.833rem',
        letterSpacing:'0.06em',
        cursor:       'pointer',
        fontFamily:   '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        transition:   'background 0.2s, border-color 0.2s',
      }}
    >
      Enter ShettysDesk Engine
    </button>
  )
}
