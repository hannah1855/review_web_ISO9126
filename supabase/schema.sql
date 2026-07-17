-- ============================================================
-- ISO 9126 Software Quality Review — Supabase Schema
-- Jalankan di SQL Editor project Supabase Anda
-- ============================================================

-- Extensi (biasanya sudah aktif)
create extension if not exists "pgcrypto";

-- Tabel utama review
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  app_name text not null,
  app_type text not null check (app_type in ('website', 'mobile', 'desktop', 'other')),
  app_url text,
  reviewer_name text not null default 'Anonim',
  review_mode text not null check (review_mode in ('manual', 'ai')),
  notes text,
  -- Skor sub-karakteristik ISO 9126: { "suitability": 4, "accuracy": 5, ... }
  scores jsonb not null default '{}'::jsonb,
  -- Catatan per sub-karakteristik: { "suitability": "Alasan skor..." }
  comments jsonb not null default '{}'::jsonb,
  -- Ringkasan AI (hanya mode ai)
  ai_summary text,
  ai_model text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index untuk daftar & filter
create index if not exists reviews_created_at_idx on public.reviews (created_at desc);
create index if not exists reviews_app_name_idx on public.reviews (app_name);
create index if not exists reviews_review_mode_idx on public.reviews (review_mode);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reviews_set_updated_at on public.reviews;
create trigger reviews_set_updated_at
  before update on public.reviews
  for each row
  execute function public.set_updated_at();

-- RLS: akses publik untuk demo (bisa diperketat dengan auth nanti)
alter table public.reviews enable row level security;

drop policy if exists "reviews_select_all" on public.reviews;
create policy "reviews_select_all"
  on public.reviews for select
  using (true);

drop policy if exists "reviews_insert_all" on public.reviews;
create policy "reviews_insert_all"
  on public.reviews for insert
  with check (true);

drop policy if exists "reviews_update_all" on public.reviews;
create policy "reviews_update_all"
  on public.reviews for update
  using (true)
  with check (true);

drop policy if exists "reviews_delete_all" on public.reviews;
create policy "reviews_delete_all"
  on public.reviews for delete
  using (true);

-- Realtime (opsional)
-- alter publication supabase_realtime add table public.reviews;
