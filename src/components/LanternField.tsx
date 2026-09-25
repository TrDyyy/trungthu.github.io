import { useMemo } from 'react';
import Lantern from './Lantern';
import { randomBetween, randomChoice } from '../utils/random';
import { useReducedMotion } from '../hooks/useReducedMotion';

const LANTERN_COLORS = ['#ff922b', '#ff6b35', '#ffa94d', '#ff8a1f', '#ffd166'];

interface LanternConfig {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  swayAmount: number;
  opacity: number;
  color: string;
}

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

export default function LanternField() {
  const reducedMotion = useReducedMotion();
  const count = isMobile() ? 8 : 15;

  const lanterns = useMemo<LanternConfig[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: randomBetween(2, 98),
      size: randomBetween(16, 40),
      duration: randomBetween(14, 28),
      delay: randomBetween(-20, 0),
      swayAmount: randomBetween(8, 25),
      opacity: randomBetween(0.4, 0.9),
      color: randomChoice(LANTERN_COLORS),
    }));
  }, [count]);

  if (reducedMotion) {
    return null;
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 6 }}>
      {lanterns.map((l) => (
        <Lantern key={l.id} {...l} />
      ))}
    </div>
  );
}
