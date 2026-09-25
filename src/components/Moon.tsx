import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MoonProps {
  onMoonClick: () => void;
}

interface MoonMessageState {
  visible: boolean;
  text: string;
}

export default function Moon({ onMoonClick }: MoonProps) {
  const [isGlowing, setIsGlowing] = useState(false);
  const [message, setMessage] = useState<MoonMessageState>({ visible: false, text: '' });

  const handleClick = useCallback(() => {
    setIsGlowing(true);
    setMessage({ visible: true, text: 'Trăng vẫn ở đây,\nmong bạn cũng đang bình an.' });

    setTimeout(() => {
      setMessage({ visible: false, text: '' });
    }, 3000);

    setTimeout(() => {
      setIsGlowing(false);
    }, 2000);

    onMoonClick();
  }, [onMoonClick]);

  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center" style={{ zIndex: 5 }}>
      {/* Atmospheric outer glow */}
      <motion.div
        className="relative flex items-center justify-center"
        animate={isGlowing ? { scale: 1.05 } : { scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Large atmospheric glow */}
        <div
          className="absolute rounded-full"
          style={{
            width: '40vw',
            height: '40vw',
            maxWidth: 420,
            maxHeight: 420,
            background: 'radial-gradient(circle, rgba(255,209,102,0.06) 0%, rgba(255,180,50,0.03) 50%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />

        {/* Medium glow */}
        <motion.div
          className="absolute rounded-full"
          animate={isGlowing ? {
            boxShadow: '0 0 80px 30px rgba(255, 209, 102, 0.35)',
          } : {
            boxShadow: '0 0 60px 20px rgba(255, 209, 102, 0.18)',
          }}
          transition={{ duration: 0.8 }}
          style={{
            width: '22vw',
            height: '22vw',
            maxWidth: 260,
            maxHeight: 260,
            background: 'radial-gradient(circle, rgba(255,230,154,0.15) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Moon body */}
        <motion.button
          onClick={handleClick}
          aria-label="Bấm vào mặt trăng để nhận thông điệp bí mật"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          animate={isGlowing ? {
            boxShadow: '0 0 50px 15px rgba(255, 230, 154, 0.6), inset 0 0 30px rgba(255,255,200,0.2)',
          } : {
            boxShadow: '0 0 30px 8px rgba(255, 220, 100, 0.25), inset 0 0 20px rgba(255,255,180,0.1)',
          }}
          transition={{ duration: 0.8 }}
          className="relative rounded-full cursor-pointer border-none p-0 outline-none focus:outline-none"
          style={{
            width: '18vw',
            height: '18vw',
            maxWidth: 220,
            maxHeight: 220,
            minWidth: 100,
            minHeight: 100,
            background: `
              radial-gradient(ellipse at 35% 35%, #fff8e1 0%, #fff3bf 25%, #ffe69a 55%, #ffd166 80%, #ffb347 100%)
            `,
          }}
        >
          {/* Moon texture overlay */}
          <div
            className="absolute inset-0 rounded-full opacity-30"
            style={{
              background: `
                radial-gradient(ellipse at 60% 65%, rgba(200,160,50,0.4) 0%, transparent 50%),
                radial-gradient(circle at 30% 40%, rgba(255,255,255,0.2) 0%, transparent 30%),
                radial-gradient(circle at 75% 25%, rgba(180,140,40,0.2) 0%, transparent 20%),
                radial-gradient(circle at 20% 70%, rgba(180,140,40,0.15) 0%, transparent 15%)
              `,
            }}
          />
          {/* Subtle crater details */}
          <div className="absolute inset-0 rounded-full" style={{
            background: `
              radial-gradient(circle at 40% 55%, rgba(180,140,60,0.12) 0%, transparent 12%),
              radial-gradient(circle at 70% 35%, rgba(160,120,40,0.1) 0%, transparent 8%),
              radial-gradient(circle at 25% 30%, rgba(200,170,80,0.08) 0%, transparent 10%)
            `,
          }} />
        </motion.button>
      </motion.div>

      {/* Easter egg message */}
      <AnimatePresence>
        {message.visible && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="absolute glass-card text-center px-6 py-4 mt-2 whitespace-pre-line"
            style={{
              top: '100%',
              marginTop: '1rem',
              width: 'max-content',
              maxWidth: '280px',
              zIndex: 20,
            }}
          >
            <div className="text-2xl mb-1">🌕</div>
            <p className="text-amber-100 text-sm font-body leading-relaxed" style={{ fontStyle: 'italic' }}>
              {message.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
