import { motion } from 'framer-motion';
import { Wish } from '../types/wish';

interface WishCardProps {
  wish: Wish;
  index: number;
  isNew?: boolean;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return '';
  }
}

export default function WishCard({ wish, index, isNew }: WishCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: isNew ? 0 : index * 0.08,
        ease: 'easeOut',
      }}
      className="glass-card-hover p-5 flex flex-col gap-2"
      style={{ minHeight: 120 }}
    >
      {/* Lantern icon */}
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0 mt-0.5">🏮</span>
        <blockquote className="text-amber-100 text-sm leading-relaxed flex-1" style={{ fontStyle: 'italic' }}>
          "{wish.message}"
        </blockquote>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: '1px solid rgba(255,209,102,0.1)' }}>
        <span className="text-amber-400 text-sm font-medium">
          {wish.name ? `— ${wish.name}` : '— Vô danh'}
        </span>
        <time className="text-amber-300/40 text-xs">{formatDate(wish.createdAt)}</time>
      </div>
    </motion.article>
  );
}
