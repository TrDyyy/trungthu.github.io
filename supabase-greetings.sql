-- Run once in Supabase Dashboard > SQL Editor.
-- Creates shareable greeting cards and a public image bucket (max 5 MB per image).

create table if not exists public.greetings (
  id          uuid        primary key default gen_random_uuid(),
  sender      text        not null check (char_length(sender) between 1 and 50),
  receiver    text        check (receiver is null or char_length(receiver) between 1 and 50),
  message     text        not null check (char_length(message) between 1 and 400),
  image_url   text,
  created_at  timestamptz not null default now()
);

alter table public.greetings add column if not exists image_url text;
alter table public.greetings enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'greetings' and policyname = 'Public can read greetings') then
    create policy "Public can read greetings" on public.greetings for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'greetings' and policyname = 'Public can create greetings') then
    create policy "Public can create greetings" on public.greetings for insert with check (
      char_length(sender) between 1 and 50 and char_length(message) between 1 and 400
    );
  end if;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('greeting-images', 'greeting-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public can upload greeting images') then
    create policy "Public can upload greeting images" on storage.objects for insert to anon with check (bucket_id = 'greeting-images');
  end if;
end $$;
