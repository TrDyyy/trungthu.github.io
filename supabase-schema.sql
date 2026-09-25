-- ============================================================
-- Trung Thu Wishes — Supabase Schema
-- Chạy file này trong Supabase SQL Editor
-- ============================================================

-- Tạo bảng wishes
create table if not exists public.wishes (
  id          uuid        primary key default gen_random_uuid(),
  name        text,
  message     text        not null check (char_length(message) between 1 and 300),
  created_at  timestamptz not null    default now()
);

-- Index cho sort theo thời gian
create index if not exists wishes_created_at_idx on public.wishes (created_at desc);

-- Row Level Security
alter table public.wishes enable row level security;

-- Ai cũng có thể đọc
create policy "Public can read wishes"
  on public.wishes for select
  using (true);

-- Ai cũng có thể gửi lời chúc
create policy "Public can insert wishes"
  on public.wishes for insert
  with check (
    char_length(message) between 1 and 300
  );

-- Không ai có thể update hoặc delete (chỉ admin qua service_role)
-- (Không tạo policy cho UPDATE/DELETE → mặc định bị chặn)

-- Enable Realtime cho bảng này
alter publication supabase_realtime add table public.wishes;

-- Thiệp chúc: public để người nhận mở qua link chia sẻ.
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

create policy "Public can read greetings"
  on public.greetings for select using (true);

create policy "Public can create greetings"
  on public.greetings for insert with check (
    char_length(sender) between 1 and 50 and char_length(message) between 1 and 400
  );

-- Bucket public: người nhận có link sẽ xem được ảnh. Chỉ nhận JPG/PNG/WebP <= 5 MB.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('greeting-images', 'greeting-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

create policy "Public can upload greeting images"
  on storage.objects for insert to anon with check (bucket_id = 'greeting-images');

-- ============================================================
-- Kiểm tra kết quả:
-- select * from public.wishes order by created_at desc limit 10;
-- ============================================================
