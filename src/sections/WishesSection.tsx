import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import WishCard from '../components/WishCard';
import { Wish } from '../types/wish';

interface WishesSectionProps {
  wishes: Wish[];
  isLoading?: boolean;
  isLive?: boolean;
  isSupabase?: boolean;
  onAddWish: () => void;
}

export default function WishesSection({ wishes, isLoading, isLive, isSupabase, onAddWish }: WishesSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section
      ref={ref}
      className="relative py-20 px-4"
      style={{ zIndex: 10 }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <h2 className="font-display text-2xl sm:text-3xl text-gradient-gold font-semibold">
              🏮 Những điều ước dưới ánh trăng
            </h2>
            {/* Live indicator */}
            {isSupabase && (
              <span
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                style={{
                  background: isLive ? 'rgba(34, 197, 94, 0.12)' : 'rgba(255,209,102,0.08)',
                  border: `1px solid ${isLive ? 'rgba(34,197,94,0.3)' : 'rgba(255,209,102,0.2)'}`,
                  color: isLive ? '#86efac' : '#fbbf24',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: isLive ? '#4ade80' : '#fbbf24',
                    boxShadow: isLive ? '0 0 6px #4ade80' : 'none',
                    animation: isLive ? 'pulse 2s infinite' : 'none',
                  }}
                />
                {isLive ? 'Live' : 'Đang kết nối...'}
              </span>
            )}
          </div>
          <p className="text-amber-200/60 text-sm">
            Mỗi chiếc đèn mang theo một mong ước nhỏ.
            {isSupabase && <span className="ml-1 text-amber-300/40">Đồng bộ thời gian thực.</span>}
          </p>
        </motion.div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="glass-card p-5 min-h-[120px]"
                style={{ animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite` }}
              >
                <div className="h-4 rounded mb-3" style={{ background: 'rgba(255,209,102,0.08)', width: '80%' }} />
                <div className="h-3 rounded mb-2" style={{ background: 'rgba(255,209,102,0.06)', width: '100%' }} />
                <div className="h-3 rounded" style={{ background: 'rgba(255,209,102,0.06)', width: '60%' }} />
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {!isLoading && wishes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishes.map((wish, i) => (
              <WishCard key={wish.id} wish={wish} index={i} />
            ))}
          </div>
        ) : !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="text-4xl mb-4">🌙</div>
            <p className="text-amber-200/60 text-sm leading-relaxed">
              Bầu trời vẫn đang chờ điều ước đầu tiên.
              <br />
              Hãy thả một chiếc đèn lên nhé.
            </p>
            <button onClick={onAddWish} className="btn-primary mt-6 text-sm">
              🏮 Thả đèn ước nguyện
            </button>
          </motion.div>
        )}

        {/* Add more */}
        {!isLoading && wishes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-center mt-10"
          >
            <button onClick={onAddWish} className="btn-secondary text-sm">
              + Thêm điều ước của bạn
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
