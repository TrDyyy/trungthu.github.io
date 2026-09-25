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

-- ============================================================
-- Kiểm tra kết quả:
-- select * from public.wishes order by created_at desc limit 10;
-- ============================================================
