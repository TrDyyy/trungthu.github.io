import { useEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { randomBetween, randomChoice } from '../utils/random';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  trail: Array<{ x: number; y: number }>;
}

interface FireworkBurst {
  particles: Particle[];
}

const COLORS = [
  '#ffd43b', '#ff922b', '#ff6b35', '#fa5252',
  '#f783ac', '#cc5de8', '#748ffc', '#63e6be',
  '#ffec99', '#ffa94d',
];

const MAX_PARTICLES_MOBILE = 40;
const MAX_PARTICLES_DESKTOP = 80;

export function useFireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bursts = useRef<FireworkBurst[]>([]);
  const animRef = useRef<number>(0);
  const lastFirework = useRef<number>(0);

  return { canvasRef, bursts, animRef, lastFirework };
}

interface FireworksCanvasProps {
  onMount?: (fire: (x: number, y: number) => void) => void;
}

export default function FireworksCanvas({ onMount }: FireworksCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bursts = useRef<FireworkBurst[]>([]);
  const animRef = useRef<number>(0);
  const lastAuto = useRef<number>(0);
  const reducedMotion = useReducedMotion();

  const isMobile = () => window.innerWidth < 768;

  const createBurst = useCallback((x: number, y: number) => {
    const maxP = isMobile() ? MAX_PARTICLES_MOBILE : MAX_PARTICLES_DESKTOP;
    const count = Math.floor(randomBetween(maxP * 0.5, maxP));
    const color = randomChoice(COLORS);
    const color2 = randomChoice(COLORS);

    const particles: Particle[] = Array.from({ length: count }, () => {
      const angle = randomBetween(0, Math.PI * 2);
      const speed = randomBetween(2, 9);
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: randomBetween(0.5, 1),
        color: Math.random() > 0.5 ? color : color2,
        size: randomBetween(2, 4.5),
        trail: [],
      };
    });

    bursts.current.push({ particles });
  }, []);

  useEffect(() => {
    if (onMount) {
      onMount(createBurst);
    }
  }, [onMount, createBurst]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (now: number) => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Auto fireworks
      if (!reducedMotion && now - lastAuto.current > randomBetween(4000, 8000)) {
        lastAuto.current = now;
        const x = randomBetween(canvas.width * 0.1, canvas.width * 0.9);
        const y = randomBetween(canvas.height * 0.05, canvas.height * 0.35);
        createBurst(x, y);
      }

      // Update and draw bursts
      bursts.current = bursts.current.filter((burst) => {
        burst.particles = burst.particles.filter((p) => {
          // Update
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > 4) p.trail.shift();

          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.12; // gravity
          p.vx *= 0.985; // air resistance
          p.life -= 0.018;

          if (p.life <= 0) return false;

          // Draw trail
          if (p.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(p.trail[0].x, p.trail[0].y);
            for (let i = 1; i < p.trail.length; i++) {
              ctx.lineTo(p.trail[i].x, p.trail[i].y);
            }
            ctx.strokeStyle = p.color + Math.floor(p.life * 128).toString(16).padStart(2, '0');
            ctx.lineWidth = p.size * 0.5;
            ctx.stroke();
          }

          // Draw particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
          ctx.fillStyle = p.color + Math.floor(p.life * 255).toString(16).padStart(2, '0');
          ctx.fill();

          return true;
        });
        return burst.particles.length > 0;
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animRef.current);
      } else {
        animRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [reducedMotion, createBurst]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 8 }}
      aria-hidden="true"
    />
  );
}
