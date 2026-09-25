import { motion } from 'framer-motion';

interface LanternProps {
  x: number; // 0-100 percent from left
  size: number; // relative size
  duration: number; // float animation seconds
  delay: number;
  swayAmount: number; // degrees
  opacity: number;
  color: string;
  style?: React.CSSProperties;
}

export default function Lantern({
  x, size, duration, delay, swayAmount, opacity, color, style
}: LanternProps) {
  const w = size;
  const h = size * 1.5;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        bottom: '-5%',
        width: w,
        height: h + size * 0.5,
        opacity,
        ...style,
      }}
      animate={{
        y: [0, -(window.innerHeight + h + 50)],
        x: [0, Math.sin(delay) * swayAmount, -Math.sin(delay + 1) * swayAmount * 0.8, 0],
        rotate: [0, swayAmount * 0.15, -swayAmount * 0.1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
        x: {
          duration: duration * 0.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        },
        rotate: {
          duration: duration * 0.4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: delay + 0.5,
        },
      }}
    >
      <LanternSVG color={color} width={w} height={h} />
    </motion.div>
  );
}

function LanternSVG({ color, width, height }: { color: string; width: number; height: number }) {
  const glowId = `glow-${Math.random().toString(36).slice(2)}`;
  return (
    <svg viewBox="0 0 40 80" xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
      <defs>
        <radialGradient id={`body-${glowId}`} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#fff8e0" stopOpacity="0.9" />
          <stop offset="40%" stopColor={color} stopOpacity="0.95" />
          <stop offset="100%" stopColor={color} stopOpacity="0.7" />
        </radialGradient>
        <filter id={`glow-${glowId}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* String top */}
      <line x1="20" y1="0" x2="20" y2="8" stroke={color} strokeWidth="1.5" strokeOpacity="0.8" />

      {/* Top cap */}
      <rect x="12" y="7" width="16" height="5" rx="2" fill={color} fillOpacity="0.9" />

      {/* Lantern body */}
      <ellipse cx="20" cy="40" rx="16" ry="23" fill={`url(#body-${glowId})`} filter={`url(#glow-${glowId})`} />

      {/* Ribs */}
      {[-8, -4, 0, 4, 8].map((offset) => (
        <ellipse key={offset} cx="20" cy="40" rx="16" ry="2"
          fill="none" stroke={color} strokeWidth="0.8" strokeOpacity="0.3"
          style={{ transform: `translateY(${offset * 2.5}px)` }}
        />
      ))}

      {/* Bottom cap */}
      <rect x="12" y="61" width="16" height="4" rx="2" fill={color} fillOpacity="0.9" />

      {/* Tassel strings */}
      <line x1="17" y1="65" x2="15" y2="78" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
      <line x1="20" y1="65" x2="20" y2="80" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
      <line x1="23" y1="65" x2="25" y2="78" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
    </svg>
  );
}
