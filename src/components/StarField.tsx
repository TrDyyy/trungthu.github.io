import { useEffect, useRef, useMemo } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { randomBetween } from '../utils/random';

interface Star {
  x: number;
  y: number;
  r: number;
  opacity: number;
  twinkleDuration: number;
  twinkleOffset: number;
  isShootingStar?: boolean;
}

const isMobile = () => window.innerWidth < 768;

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const animRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const shootingStarRef = useRef<{
    x: number; y: number; vx: number; vy: number; opacity: number; active: boolean;
  }>({ x: 0, y: 0, vx: 0, vy: 0, opacity: 0, active: false });
  const lastShootingStarTime = useRef<number>(0);

  const starCount = useMemo(() => (isMobile() ? 80 : 200), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Regenerate stars on resize
      starsRef.current = Array.from({ length: starCount }, () => ({
        x: randomBetween(0, canvas.width),
        y: randomBetween(0, canvas.height * 0.85),
        r: randomBetween(0.3, 2.2),
        opacity: randomBetween(0.1, 0.9),
        twinkleDuration: randomBetween(2000, 6000),
        twinkleOffset: randomBetween(0, 6000),
      }));
    };

    resize();
    window.addEventListener('resize', resize);

    let startTime = performance.now();

    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = now - startTime;

      if (!reducedMotion) {
        // Shooting star logic
        const timeSinceShoot = now - lastShootingStarTime.current;
        if (!shootingStarRef.current.active && timeSinceShoot > randomBetween(12000, 20000)) {
          lastShootingStarTime.current = now;
          const ss = shootingStarRef.current;
          ss.x = randomBetween(canvas.width * 0.1, canvas.width * 0.8);
          ss.y = randomBetween(20, canvas.height * 0.25);
          ss.vx = randomBetween(4, 8);
          ss.vy = randomBetween(2, 4);
          ss.opacity = 1;
          ss.active = true;
        }

        if (shootingStarRef.current.active) {
          const ss = shootingStarRef.current;
          ctx.save();
          ctx.beginPath();
          const gradient = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * 20, ss.y - ss.vy * 20);
          gradient.addColorStop(0, `rgba(255, 255, 220, ${ss.opacity})`);
          gradient.addColorStop(1, 'rgba(255, 255, 220, 0)');
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.5;
          ctx.moveTo(ss.x, ss.y);
          ctx.lineTo(ss.x - ss.vx * 20, ss.y - ss.vy * 20);
          ctx.stroke();
          ctx.restore();

          ss.x += ss.vx;
          ss.y += ss.vy;
          ss.opacity -= 0.025;
          if (ss.opacity <= 0 || ss.x > canvas.width || ss.y > canvas.height) {
            ss.active = false;
          }
        }
      }

      for (const star of starsRef.current) {
        let opacity = star.opacity;
        if (!reducedMotion) {
          const twinklePhase = ((elapsed + star.twinkleOffset) % star.twinkleDuration) / star.twinkleDuration;
          opacity = star.opacity * (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(twinklePhase * Math.PI * 2)));
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 248, 220, ${opacity})`;
        ctx.fill();

        // Add tiny glow for larger stars
        if (star.r > 1.5) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 248, 200, ${opacity * 0.15})`;
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animRef.current);
      } else {
        startTime = performance.now();
        animRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [reducedMotion, starCount]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  );
}
