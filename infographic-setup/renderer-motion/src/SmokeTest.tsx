import React, {useEffect, useRef} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {SparklesIcon} from 'lucide-animated';

// Smoke test: proves the Remotion motion lane renders React + Motion + lucide-animated
// to MP4/GIF via our Chrome. Core motion is Remotion-frame-driven (deterministic);
// the lucide-animated icon is included to test whether its Framer-Motion runtime
// is captured frame-accurately by Remotion.
export const SmokeTest: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pop = spring({frame, fps, config: {damping: 13, mass: 0.7}});
  const titleO = interpolate(frame, [6, 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const titleY = interpolate(frame, [6, 24], [28, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const subO = interpolate(frame, [16, 34], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const iconRef = useRef<{startAnimation: () => void} | null>(null);
  useEffect(() => {
    iconRef.current?.startAnimation?.();
  }, []);

  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(ellipse 60% 40% at 85% 5%, rgba(56,230,166,.18), transparent 60%),' +
          'linear-gradient(180deg,#FFFFFF 0%,#F4FAFE 60%,#EAF3FD 100%)',
        fontFamily: 'Poppins, system-ui, sans-serif',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 36,
      }}
    >
      <div style={{transform: `scale(${pop})`}}>
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: 48,
            background: 'linear-gradient(135deg,#8FF3CC,#38E6A6,#2798FB)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#053b2b',
            boxShadow: '0 24px 50px rgba(20,176,126,.30)',
          }}
        >
          <div ref={iconRef as never}>
            <SparklesIcon size={120} />
          </div>
        </div>
      </div>
      <div style={{opacity: titleO, transform: `translateY(${titleY}px)`, fontSize: 70, fontWeight: 800, color: '#15315C', letterSpacing: -1}}>
        Shetty&apos;s Desk
      </div>
      <div style={{opacity: subO, fontSize: 26, fontWeight: 400, color: '#5D7599'}}>
        Motion lane · Remotion smoke test
      </div>
    </AbsoluteFill>
  );
};
