import { createClient } from '@supabase/supabase-js';

const configuredSupabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
// The Dashboard's Project URL is the preferred value. Also accept a copied
// REST endpoint so a trailing /rest/v1 does not produce /rest/v1/rest/v1.
const supabaseUrl = configuredSupabaseUrl?.replace(/\/rest\/v1\/?$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Supabase client — null khi chưa cấu hình env vars.
 * Mọi service phải kiểm tra null trước khi gọi.
 */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        realtime: { params: { eventsPerSecond: 5 } },
      })
    : null;

export const isSupabaseConfigured = supabase !== null;
