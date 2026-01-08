-- Migration: create_media_table
-- Purpose: create a table to store metadata for images used in the website (photos and partner logos)
-- Affected tables: public.media
-- Notes:
--   - This table supports two categories: 'photo' (for main page visuals) and 'partner' (for partner logos)
--   - All files are expected to be stored in the 'media' bucket in Supabase Storage
--   - Row Level Security (RLS) is enabled with granular policies for anon and authenticated users

-- Drop table if exists (idempotent migration)
drop table if exists public.media;

-- Create the media table with metadata for images
create table public.media (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  bucket text not null default 'media',
  category text not null check (category in ('photo', 'partner')),
  alt_text text,
  title text,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.media enable row level security;

-- Policy: allow public read access for anon role
create policy "media_select_anon"
  on public.media for select
  to anon
  using (true);

-- Policy: allow public read access for authenticated role
create policy "media_select_authenticated"
  on public.media for select
  to authenticated
  using (true);

-- Policy: allow insert for authenticated users (e.g., admin via API routes)
create policy "media_insert_authenticated"
  on public.media for insert
  to authenticated
  with check (true);

-- Policy: allow update for authenticated users
create policy "media_update_authenticated"
  on public.media for update
  to authenticated
  using (true)
  with check (true);

-- Policy: allow delete for authenticated users
create policy "media_delete_authenticated"
  on public.media for delete
  to authenticated
  using (true);

-- Add table and column comments for documentation
comment on table public.media is 'Stores metadata for images (photos and partner logos) used across the website.';
comment on column public.media.filename is 'Name of the file as stored in Supabase Storage (e.g., "logo.png").';
comment on column public.media.bucket is 'Name of the Supabase Storage bucket (default: "media").';
comment on column public.media.category is 'Category of the image: "photo" for main visuals, "partner" for partner logos.';
comment on column public.media.alt_text is 'Alternative text for accessibility and SEO.';
comment on column public.media.title is 'Human-readable title or label for the image.';
comment on column public.media.created_at is 'Timestamp when the record was created.';