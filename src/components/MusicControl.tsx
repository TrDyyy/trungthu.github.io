import { Music, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

interface MusicControlProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export default function MusicControl({ isPlaying, onToggle }: MusicControlProps) {
  return (
    <motion.button
      onClick={onToggle}
      aria-label={isPlaying ? 'Tắt nhạc' : 'Bật nhạc nền Trung Thu'}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="relative flex items-center justify-center rounded-full"
      style={{
        width: 44,
        height: 44,
        background: 'rgba(10, 16, 42, 0.7)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 209, 102, 0.25)',
        color: isPlaying ? '#ffd43b' : '#9ca3af',
        cursor: 'pointer',
      }}
    >
      {isPlaying && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              '0 0 8px rgba(255, 212, 59, 0.3)',
              '0 0 14px rgba(255, 212, 59, 0.5)',
              '0 0 8px rgba(255, 212, 59, 0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      {isPlaying ? <Music size={18} /> : <VolumeX size={18} />}
    </motion.button>
  );
}

