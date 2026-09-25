import { useState, useEffect, useCallback, useRef } from 'react';
import { Wish } from '../types/wish';
import { fetchWishes, createWish, subscribeToNewWishes } from '../services/wishService';
import { isSupabaseConfigured } from '../lib/supabase';

type Status = 'idle' | 'loading' | 'error' | 'ready';

interface UseWishesReturn {
  wishes: Wish[];
  status: Status;
  isLive: boolean;       // true khi đang kết nối realtime
  addWish: (wish: Omit<Wish, 'id' | 'createdAt'>) => Promise<Wish>;
}

export function useWishes(): UseWishesReturn {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [isLive, setIsLive] = useState(false);
  const unsubRef = useRef<() => void>(() => {});

  // ── Initial fetch ──────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    fetchWishes()
      .then((data) => {
        if (cancelled) return;
        setWishes(data);
        setStatus('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setStatus('error');
      });

    return () => { cancelled = true; };
  }, []);

  // ── Realtime subscription ──────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const unsub = subscribeToNewWishes((newWish) => {
      setIsLive(true);
      setWishes((prev) => {
        // Tránh duplicate nếu wish này do chính user hiện tại gửi
        if (prev.some((w) => w.id === newWish.id)) return prev;
        return [newWish, ...prev].slice(0, 50);
      });
    });

    unsubRef.current = unsub;

    // Đánh dấu live sau khi subscribe thành công (delay nhỏ)
    const t = setTimeout(() => setIsLive(true), 1500);

    return () => {
      clearTimeout(t);
      unsub();
      setIsLive(false);
    };
  }, []);

  // ── Add wish ───────────────────────────────────────────────
  const addWish = useCallback(async (wish: Omit<Wish, 'id' | 'createdAt'>): Promise<Wish> => {
    const created = await createWish(wish);

    // Optimistic update — thêm ngay trước khi realtime event đến
    setWishes((prev) => {
      if (prev.some((w) => w.id === created.id)) return prev;
      return [created, ...prev].slice(0, 50);
    });

    return created;
  }, []);

  return { wishes, status, isLive, addWish };
}
