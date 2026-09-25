import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WishLanternProps {
  wish: string;
  onComplete: () => void;
}

export default function WishLantern({ wish, onComplete }: WishLanternProps) {
  const [phase, setPhase] = useState<'appear' | 'rise' | 'done'>('appear');
  const [showWish, setShowWish] = useState(true);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('rise'), 800);
    const t2 = setTimeout(() => setShowWish(false), 2500);
    const t3 = setTimeout(() => {
      setPhase('done');
      onCompleteRef.current();
    }, 8000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (phase === 'done') return null;

  return (
    <div
      className="fixed pointer-events-none"
      style={{
        left: '50%',
        bottom: '15%',
        transform: 'translateX(-50%)',
        zIndex: 50,
      }}
    >
      <motion.div
        initial={{ y: 0, opacity: 0, scale: 0.5 }}
        animate={
          phase === 'appear'
            ? { opacity: 1, scale: 1, y: 0 }
            : {
                y: -window.innerHeight * 0.85,
                opacity: [1, 1, 1, 0.6, 0],
                x: [0, 20, -15, 10, -5, 0],
                scale: [1, 0.95, 0.9, 0.7, 0.5],
              }
        }
        transition={
          phase === 'appear'
            ? { duration: 0.6, ease: 'backOut' }
            : {
                duration: 7,
                ease: 'easeIn',
                x: { duration: 7, ease: 'easeInOut', repeat: 0 },
              }
        }
        className="flex flex-col items-center"
      >
        {/* Glow */}
        <div
          className="absolute rounded-full"
          style={{
            width: 120,
            height: 120,
            background: 'radial-gradient(circle, rgba(255, 180, 50, 0.4) 0%, transparent 70%)',
            filter: 'blur(15px)',
            top: -20,
            left: -30,
          }}
        />

        {/* Wish text bubble */}
        <AnimatePresence>
          {showWish && wish && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="glass-card px-4 py-2 mb-2 text-center max-w-xs"
              style={{ fontSize: '0.78rem' }}
            >
              <p className="text-amber-100 italic">"{wish}"</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wish lantern SVG */}
        <svg viewBox="0 0 60 120" xmlns="http://www.w3.org/2000/svg" width={60} height={120}>
          <defs>
            <radialGradient id="wish-body" cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor="#fff3cd" stopOpacity="1" />
              <stop offset="35%" stopColor="#ff922b" stopOpacity="1" />
              <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.9" />
            </radialGradient>
            <filter id="wish-glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* String */}
          <line x1="30" y1="0" x2="30" y2="12" stroke="#ff922b" strokeWidth="2" />

          {/* Top cap */}
          <rect x="18" y="10" width="24" height="8" rx="3" fill="#ff922b" />

          {/* Body */}
          <ellipse cx="30" cy="60" rx="24" ry="35" fill="url(#wish-body)" filter="url(#wish-glow)" />

          {/* Ribs */}
          {[-14, -7, 0, 7, 14].map((offset) => (
            <ellipse
              key={offset}
              cx="30"
              cy={60 + offset}
              rx="24"
              ry="3"
              fill="none"
              stroke="#ff6b35"
              strokeWidth="1"
              strokeOpacity="0.4"
            />
          ))}

          {/* Bottom cap */}
          <rect x="18" y="93" width="24" height="6" rx="3" fill="#ff922b" />

          {/* Tassels */}
          <line x1="25" y1="99" x2="22" y2="115" stroke="#ff922b" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="30" y1="99" x2="30" y2="118" stroke="#ff922b" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="35" y1="99" x2="38" y2="115" stroke="#ff922b" strokeWidth="1.5" strokeOpacity="0.8" />
        </svg>
      </motion.div>

      {/* Sparkles near moon arrival */}
      {phase === 'rise' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 0, 1, 0] }}
          transition={{ duration: 7, times: [0, 0.5, 0.7, 0.85, 1] }}
          className="absolute"
          style={{ top: -window.innerHeight * 0.7, left: -40, width: 80, height: 80 }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-amber-300"
              animate={{
                x: Math.cos((i / 6) * Math.PI * 2) * 30,
                y: Math.sin((i / 6) * Math.PI * 2) * 30,
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              style={{ left: 40, top: 40 }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
