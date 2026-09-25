/**
 * wishService.ts
 *
 * Service layer cho Wish data.
 * Dùng Supabase khi được cấu hình, fallback về localStorage.
 * Để migrate sang API khác: chỉ cần thay file này.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Wish } from '../types/wish';
import { DEFAULT_WISHES, STORAGE_KEY, MAX_WISHES } from '../data/wishes';

// ─── Local Storage helpers ───────────────────────────────────────────────────

function readLocal(): Wish[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...DEFAULT_WISHES];
    const parsed = JSON.parse(raw) as Wish[];
    return Array.isArray(parsed) ? parsed : [...DEFAULT_WISHES];
  } catch {
    return [...DEFAULT_WISHES];
  }
}

function writeLocal(wishes: Wish[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes.slice(0, MAX_WISHES)));
  } catch {
    // Ignore quota errors
  }
}

// ─── Supabase row type ───────────────────────────────────────────────────────

interface WishRow {
  id: string;
  name: string | null;
  message: string;
  created_at: string;
}

function rowToWish(row: WishRow): Wish {
  return {
    id: row.id,
    name: row.name ?? undefined,
    message: row.message,
    createdAt: row.created_at,
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Lấy danh sách wishes mới nhất.
 * - Supabase: query 50 bản ghi mới nhất
 * - Fallback: localStorage + default wishes
 */
export async function fetchWishes(): Promise<Wish[]> {
  if (!isSupabaseConfigured || !supabase) {
    return readLocal();
  }

  const { data, error } = await supabase
    .from('wishes')
    .select('id, name, message, created_at')
    .order('created_at', { ascending: false })
    .limit(MAX_WISHES);

  if (error || !data) {
    console.warn('[wishService] Supabase fetch failed, fallback to local:', error?.message);
    return readLocal();
  }

  return (data as WishRow[]).map(rowToWish);
}

/**
 * Gửi một wish mới.
 * - Supabase: insert vào database
 * - Fallback: prepend vào localStorage
 * Trả về Wish đã được tạo (với id và createdAt từ server).
 */
export async function createWish(wish: Omit<Wish, 'id' | 'createdAt'>): Promise<Wish> {
  if (!isSupabaseConfigured || !supabase) {
    const newWish: Wish = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: wish.name,
      message: wish.message,
      createdAt: new Date().toISOString(),
    };
    const current = readLocal().filter((w) => !w.id.startsWith('default-'));
    writeLocal([newWish, ...current]);
    return newWish;
  }

  const { data, error } = await supabase
    .from('wishes')
    .insert({ name: wish.name ?? null, message: wish.message })
    .select('id, name, message, created_at')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Insert failed');
  }

  return rowToWish(data as WishRow);
}

/**
 * Subscribe realtime — gọi callback mỗi khi có wish mới từ bất kỳ user nào.
 * Trả về hàm unsubscribe để cleanup.
 */
export function subscribeToNewWishes(onNew: (wish: Wish) => void): () => void {
  if (!isSupabaseConfigured || !supabase) {
    return () => {};
  }

  const channel = supabase
    .channel('public:wishes')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'wishes' },
      (payload) => {
        const row = payload.new as WishRow;
        if (row?.id && row?.message) {
          onNew(rowToWish(row));
        }
      }
    )
    .subscribe();

  return () => {
    supabase?.removeChannel(channel);
  };
}
