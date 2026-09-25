import { motion } from 'framer-motion';

interface HeroSectionProps {
  onWishModal: () => void;
  onGreetingScroll: () => void;
}

export default function HeroSection({ onWishModal, onGreetingScroll }: HeroSectionProps) {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
        delayChildren: 1.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pb-24 pt-32"
      style={{ zIndex: 10 }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center gap-4 max-w-2xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs tracking-wider uppercase"
          style={{
            background: 'rgba(255, 146, 43, 0.12)',
            border: '1px solid rgba(255, 146, 43, 0.3)',
            color: '#ffa94d',
            letterSpacing: '0.12em',
          }}
        >
          🏮 Tết Trung Thu 2026
        </motion.div>

        {/* Main heading */}
        <motion.div variants={itemVariants}>
          <h1
            className="font-display font-bold leading-none text-gradient-gold text-shadow-gold"
            style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', letterSpacing: '-0.02em' }}
          >
            Trung Thu
          </h1>
          <h2
            className="font-display font-semibold leading-tight"
            style={{
              fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
              background: 'linear-gradient(135deg, #ffe69a, #ffd166)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.05em',
              textShadow: 'none',
            }}
          >
            Vui Vẻ
          </h2>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-amber-200/70 max-w-sm leading-relaxed"
          style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', fontStyle: 'italic' }}
        >
          Nguyện ánh trăng đêm nay mang những điều tốt đẹp nhất đến bên bạn.
        </motion.p>

        {/* CTA buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 mt-4 w-full justify-center">
          <button
            onClick={onWishModal}
            className="btn-primary text-base"
            style={{ minWidth: 200 }}
          >
            🏮 Thả đèn ước nguyện
          </button>
          <button
            onClick={onGreetingScroll}
            className="btn-secondary text-base"
            style={{ minWidth: 180 }}
          >
            ✨ Gửi lời chúc
          </button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex flex-col items-center gap-2 text-amber-300/40"
          style={{ fontSize: '0.78rem' }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ↓
          </motion.div>
          <span>Khám phá thêm</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
