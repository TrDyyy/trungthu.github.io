import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <footer
      ref={ref}
      className="relative py-16 px-4 text-center overflow-hidden"
      style={{ zIndex: 10 }}
    >
      {/* Divider */}
      <div
        className="w-32 h-px mx-auto mb-10"
        style={{ background: 'linear-gradient(to right, transparent, rgba(255,209,102,0.3), transparent)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-md mx-auto"
      >
        <div className="text-2xl mb-4">🌕</div>
        <p
          className="text-amber-200/60 text-sm leading-relaxed"
          style={{ fontStyle: 'italic' }}
        >
          Dưới cùng một ánh trăng,
          <br />
          mong chúng ta đều đang bình an.
        </p>
        <div className="flex justify-center gap-4 my-5 text-base opacity-70">
          🏮 🌟 🏮
        </div>
        <p className="text-amber-300/40 text-xs">
          Trung Thu 2026
        </p>
      </motion.div>

      {/* Safe area bottom */}
      <div className="h-4 safe-bottom" />
    </footer>
  );
}
