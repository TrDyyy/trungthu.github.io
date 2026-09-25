import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { randomBetween } from '../utils/random';

interface CloudConfig {
  id: number;
  top: string;
  width: string;
  opacity: number;
  duration: number;
  blur: string;
  delay: number;
  direction: 1 | -1;
  color: string;
}

export default function CloudLayer() {
  const reducedMotion = useReducedMotion();

  const clouds = useMemo<CloudConfig[]>(() => [
    // Far layer — slow, low opacity
    {
      id: 1,
      top: '12%',
      width: '45vw',
      opacity: 0.18,
      duration: 80,
      blur: '8px',
      delay: 0,
      direction: 1,
      color: 'rgba(100, 120, 180, 0.9)',
    },
    {
      id: 2,
      top: '18%',
      width: '35vw',
      opacity: 0.14,
      duration: 100,
      blur: '10px',
      delay: -40,
      direction: -1,
      color: 'rgba(80, 100, 160, 0.9)',
    },
    // Near moon clouds
    {
      id: 3,
      top: '3%',
      width: '28vw',
      opacity: 0.25,
      duration: 55,
      blur: '4px',
      delay: -20,
      direction: 1,
      color: 'rgba(120, 140, 200, 0.8)',
    },
    {
      id: 4,
      top: '7%',
      width: '20vw',
      opacity: 0.2,
      duration: 65,
      blur: '5px',
      delay: -10,
      direction: -1,
      color: 'rgba(90, 110, 170, 0.9)',
    },
  ], []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 4 }}>
      {clouds.map((cloud) => (
        <motion.div
          key={cloud.id}
          className="absolute"
          style={{
            top: cloud.top,
            width: cloud.width,
            height: `calc(${cloud.width} * 0.35)`,
            opacity: cloud.opacity,
            filter: `blur(${cloud.blur})`,
            left: cloud.direction === 1 ? '-30%' : '110%',
          }}
          animate={reducedMotion ? {} : {
            x: cloud.direction === 1
              ? ['0%', '160vw']
              : ['0%', '-160vw'],
          }}
          transition={{
            duration: cloud.duration,
            delay: cloud.delay,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: randomBetween(0, 5),
          }}
        >
          {/* Cloud shape using overlapping ellipses */}
          <CloudShape color={cloud.color} />
        </motion.div>
      ))}
    </div>
  );
}

function CloudShape({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 300 90" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <filter id="cloud-blur">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>
      <ellipse cx="150" cy="65" rx="140" ry="28" fill={color} />
      <ellipse cx="100" cy="50" rx="70" ry="38" fill={color} />
      <ellipse cx="180" cy="48" rx="80" ry="42" fill={color} />
      <ellipse cx="130" cy="40" rx="60" ry="36" fill={color} />
      <ellipse cx="220" cy="55" rx="55" ry="30" fill={color} />
    </svg>
  );
}
