import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Greeting } from '../types/wish';

const IMAGE_BUCKET = 'greeting-images';

interface GreetingRow {
  id: string;
  sender: string;
  receiver: string | null;
  message: string;
  image_url: string | null;
  created_at: string;
}

function rowToGreeting(row: GreetingRow): Greeting {
  return {
    id: row.id,
    sender: row.sender,
    receiver: row.receiver ?? undefined,
    message: row.message,
    imageUrl: row.image_url ?? undefined,
    createdAt: row.created_at,
  };
}

function extensionFor(file: File): string {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return extension && /^[a-z0-9]+$/.test(extension) ? extension : 'jpg';
}

/** Save a greeting and its optional image. Falls back to a local preview without Supabase. */
export async function createGreeting(
  greeting: Omit<Greeting, 'id' | 'createdAt' | 'imageUrl'>,
  image?: File | null,
): Promise<Greeting> {
  if (!isSupabaseConfigured || !supabase) {
    return { ...greeting, imageUrl: image ? URL.createObjectURL(image) : undefined };
  }

  const id = crypto.randomUUID();
  let imageUrl: string | undefined;

  if (image) {
    const path = `${id}.${extensionFor(image)}`;
    const { error: uploadError } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(path, image, { cacheControl: '31536000', contentType: image.type, upsert: false });
    if (uploadError) throw new Error(uploadError.message);

    imageUrl = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
  }

  const { data, error } = await supabase
    .from('greetings')
    .insert({
      id,
      sender: greeting.sender,
      receiver: greeting.receiver || null,
      message: greeting.message,
      image_url: imageUrl || null,
    })
    .select('id, sender, receiver, message, image_url, created_at')
    .single();

  if (error || !data) throw new Error(error?.message ?? 'Unable to save greeting');
  return rowToGreeting(data as GreetingRow);
}

/** Retrieve a greeting opened from its public share link. */
export async function fetchGreeting(id: string): Promise<Greeting | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase
    .from('greetings')
    .select('id, sender, receiver, message, image_url, created_at')
    .eq('id', id)
    .maybeSingle();
  return error || !data ? null : rowToGreeting(data as GreetingRow);
}
