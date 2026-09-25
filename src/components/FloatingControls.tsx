import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import MusicControl from './MusicControl';

interface FloatingControlsProps {
  isPlaying: boolean;
  onMusicToggle: () => void;
  onFirework: () => void;
  onLantern: () => void;
}

export default function FloatingControls({
  isPlaying,
  onMusicToggle,
  onFirework,
  onLantern,
}: FloatingControlsProps) {
  return (
    <div
      className="fixed bottom-6 right-4 flex flex-col gap-3 safe-bottom"
      style={{ zIndex: 40 }}
    >
      <Tooltip label="Pháo hoa ✨">
        <motion.button
          onClick={onFirework}
          aria-label="Bắn pháo hoa"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center justify-center rounded-full"
          style={{
            width: 44,
            height: 44,
            background: 'rgba(10, 16, 42, 0.7)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 209, 102, 0.25)',
            color: '#ffa94d',
            cursor: 'pointer',
          }}
        >
          <Sparkles size={18} />
        </motion.button>
      </Tooltip>

      <Tooltip label="Thả đèn 🏮">
        <motion.button
          onClick={onLantern}
          aria-label="Thả một chiếc đèn lồng"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center justify-center rounded-full text-lg"
          style={{
            width: 44,
            height: 44,
            background: 'rgba(10, 16, 42, 0.7)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 209, 102, 0.25)',
            cursor: 'pointer',
          }}
        >
          🏮
        </motion.button>
      </Tooltip>

      <MusicControl isPlaying={isPlaying} onToggle={onMusicToggle} />
    </div>
  );
}

function Tooltip({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="relative group flex justify-end">
      {children}
      <div
        className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"
        style={{
          background: 'rgba(10, 16, 42, 0.85)',
          color: '#ffe69a',
          border: '1px solid rgba(255,209,102,0.2)',
        }}
      >
        {label}
      </div>
    </div>
  );
}
