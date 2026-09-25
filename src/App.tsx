import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Canvas components
import StarField from './components/StarField';
import CloudLayer from './components/CloudLayer';
import FireworksCanvas from './components/FireworksCanvas';

// Visual components
import Moon from './components/Moon';
import LanternField from './components/LanternField';
import WishLantern from './components/WishLantern';
import FloatingControls from './components/FloatingControls';

// Modals
import WishModal from './components/WishModal';
import GreetingCard from './components/GreetingCard';

// Sections
import HeroSection from './sections/HeroSection';
import WishesSection from './sections/WishesSection';
import GreetingSection from './sections/GreetingSection';
import Footer from './sections/Footer';

// Data & hooks
import { useWishes } from './hooks/useWishes';
import { useAudio } from './hooks/useAudio';
import { Greeting } from './types/wish';
import { isSupabaseConfigured } from './lib/supabase';
import { createGreeting, fetchGreeting } from './services/greetingService';

// Toast
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full text-sm text-amber-50 shadow-lg"
          style={{
            background: 'rgba(20, 32, 80, 0.95)',
            border: '1px solid rgba(255, 209, 102, 0.3)',
            backdropFilter: 'blur(10px)',
            zIndex: 200,
            whiteSpace: 'nowrap',
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Loading screen
function LoadingScreen({ done }: { done: boolean }) {
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 flex flex-col items-center justify-center"
          style={{
            background: 'linear-gradient(to bottom, #020617, #07152f)',
            zIndex: 9999,
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl mb-4"
          >
            🌕
          </motion.div>
          <p className="text-amber-200/60 text-sm italic">Đang thắp sáng đêm trăng...</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [wishModalOpen, setWishModalOpen] = useState(false);
  const [activeWishLantern, setActiveWishLantern] = useState<{ wish: string } | null>(null);
  const [greeting, setGreeting] = useState<Greeting | null>(null);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const { wishes, status: wishStatus, isLive, addWish } = useWishes();
  const { isPlaying, toggle: toggleMusic } = useAudio(`${import.meta.env.BASE_URL}audio/audio.mp3`);

  const fireFnRef = useRef<((x: number, y: number) => void) | null>(null);
  const greetingSectionRef = useRef<HTMLElement>(null);
  const clickCooldown = useRef(false);

  useEffect(() => {
    const greetingId = new URLSearchParams(window.location.search).get('g');
    if (!greetingId) return;
    fetchGreeting(greetingId).then((sharedGreeting) => {
      if (sharedGreeting) setGreeting(sharedGreeting);
    });
  }, []);

  const handleGreetingGenerated = useCallback(async (newGreeting: Greeting, image?: File | null) => {
    setGreeting(await createGreeting(newGreeting, image));
  }, []);

  // Show loading briefly then reveal
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1500);
    return () => clearTimeout(t);
  }, []);

  // Click sky to fire firework
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Only fire if clicking background (not buttons/inputs/etc)
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') ||
        target.closest('[role="dialog"]') ||
        target.closest('form') ||
        target.closest('nav')
      ) return;

      if (clickCooldown.current) return;
      clickCooldown.current = true;
      setTimeout(() => { clickCooldown.current = false; }, 400);

      if (fireFnRef.current) {
        fireFnRef.current(e.clientX, e.clientY);
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const showToast = useCallback((message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  }, []);

  const handleWishSubmit = useCallback(async (wish: string, name: string) => {
    try {
      await addWish({ message: wish, name: name || undefined });
    } catch {
      showToast('Có lỗi khi gửi điều ước. Vui lòng thử lại.');
      return;
    }
    setActiveWishLantern({ wish });
  }, [addWish, showToast]);

  const handleWishLanternComplete = useCallback(() => {
    setActiveWishLantern(null);
    showToast('✨ Điều ước của bạn đã được gửi đến ánh trăng.');

    // Fire a small firework near the moon
    if (fireFnRef.current) {
      fireFnRef.current(
        window.innerWidth / 2 + (Math.random() - 0.5) * 100,
        window.innerHeight * 0.15 + Math.random() * 50
      );
    }
  }, [showToast]);

  const handleMoonClick = useCallback(() => {
    // Fire a couple fireworks
    setTimeout(() => {
      if (fireFnRef.current) {
        fireFnRef.current(
          window.innerWidth * 0.3 + Math.random() * 50,
          window.innerHeight * 0.2
        );
        setTimeout(() => {
          if (fireFnRef.current) {
            fireFnRef.current(
              window.innerWidth * 0.65 + Math.random() * 50,
              window.innerHeight * 0.15
            );
          }
        }, 500);
      }
    }, 1000);
  }, []);

  const handleFirework = useCallback(() => {
    if (fireFnRef.current) {
      fireFnRef.current(
        window.innerWidth * (0.2 + Math.random() * 0.6),
        window.innerHeight * (0.1 + Math.random() * 0.3)
      );
    }
  }, []);

  const handleScrollToGreeting = useCallback(() => {
    greetingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: 'linear-gradient(180deg, #020617 0%, #07152f 30%, #101d46 60%, #0f1a3e 100%)' }}>
      <LoadingScreen done={loaded} />

      {/* Fixed canvas layers */}
      <StarField />
      <CloudLayer />
      <LanternField />
      <FireworksCanvas onMount={(fn) => { fireFnRef.current = fn; }} />

      {/* Moon */}
      <div className="fixed top-0 left-0 right-0 flex justify-center pt-8 sm:pt-12" style={{ zIndex: 5 }}>
        <Moon onMoonClick={handleMoonClick} />
      </div>

      {/* Wish lantern animation */}
      {activeWishLantern && (
        <WishLantern
          wish={activeWishLantern.wish}
          onComplete={handleWishLanternComplete}
        />
      )}

      {/* Main scrollable content */}
      <main className="relative" style={{ zIndex: 10 }}>
        <HeroSection
          onWishModal={() => setWishModalOpen(true)}
          onGreetingScroll={handleScrollToGreeting}
        />

        {/* Divider mist */}
        <div
          className="relative h-24 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(7, 21, 47, 0.6), transparent)',
          }}
        />

        <WishesSection
          wishes={wishes}
          isLoading={wishStatus === 'loading'}
          isLive={isLive}
          isSupabase={isSupabaseConfigured}
          onAddWish={() => setWishModalOpen(true)}
        />

        <div className="h-12 pointer-events-none" />

        <GreetingSection
          sectionRef={greetingSectionRef}
          onGreetingGenerated={handleGreetingGenerated}
        />

        <Footer />
      </main>

      {/* Modals */}
      <WishModal
        isOpen={wishModalOpen}
        onClose={() => setWishModalOpen(false)}
        onSubmit={handleWishSubmit}
      />

      <GreetingCard
        greeting={greeting}
        onClose={() => setGreeting(null)}
      />

      {/* Floating controls */}
      <FloatingControls
        isPlaying={isPlaying}
        onMusicToggle={toggleMusic}
        onFirework={handleFirework}
        onLantern={() => setWishModalOpen(true)}
      />

      {/* Toast */}
      <Toast visible={toast.visible} message={toast.message} />
    </div>
  );
}
