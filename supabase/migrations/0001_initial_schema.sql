/* =====================================================================
   CORRECTED SQL MIGRATION
   Key change: replace every blanket `TO authenticated USING (true)` admin
   policy with an explicit admin gate `public.is_admin()`, so the future
   client-portal `authenticated` users cannot read private full-res URLs,
   contact PII, or other clients' data. Adds search_path hardening to the
   trigger fn. Everything else from the original is retained.
   Delimiter: SQL below, then "=== FILE: /types/index.ts ===" then barrel.
   ===================================================================== */

-- ---------- Extensions ----------
create extension if not exists pgcrypto with schema extensions; -- gen_random_uuid()

-- ---------- Enums ----------
do $$ begin
  create type public.gallery_type as enum ('portfolio', 'client');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.query_status as enum ('new', 'read', 'replied');
exception when duplicate_object then null; end $$;

-- ---------- Admin gate ----------
-- Returns true only for the photographer-admin. Implementation options:
--   (a) a custom JWT claim / app_metadata role set on Summy's auth user, or
--   (b) an explicit admins table. Shown here via a JWT app_metadata role.
-- SECURITY DEFINER + locked search_path so it is safe to call from RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- ---------- Shared updated_at trigger fn (search_path hardened) ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =====================================================================
-- categories
-- =====================================================================
create table if not exists public.categories (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  label         text not null,
  description   text,
  display_order integer not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists categories_display_order_idx
  on public.categories (display_order);

-- =====================================================================
-- clients & projects (future client portal - created first for FKs)
-- =====================================================================
create table if not exists public.clients (
  id           uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  name         text not null,
  email        text not null,
  created_at   timestamptz not null default now()
);

create table if not exists public.projects (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references public.clients(id) on delete cascade,
  name         text not null,
  is_delivered boolean not null default false,
  delivered_at timestamptz,
  created_at   timestamptz not null default now()
);

create index if not exists projects_client_id_idx on public.projects (client_id);

-- =====================================================================
-- photos
-- =====================================================================
create table if not exists public.photos (
  id             uuid primary key default gen_random_uuid(),
  category_id    uuid references public.categories(id) on delete set null,
  full_res_url   text not null,
  compressed_url text not null,
  alt_text       text,
  camera         text,
  lens           text,
  aperture       text,
  shutter        text,
  iso            integer,
  taken_at       timestamptz,
  is_visible     boolean not null default false,
  display_order  integer not null default 0,
  gallery_type   public.gallery_type not null default 'portfolio',
  client_id      uuid references public.clients(id) on delete set null,
  project_id     uuid references public.projects(id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists photos_public_gallery_idx
  on public.photos (category_id, display_order)
  where is_visible = true and gallery_type = 'portfolio';

create index if not exists photos_gallery_type_idx on public.photos (gallery_type);
create index if not exists photos_client_id_idx on public.photos (client_id);
create index if not exists photos_project_id_idx on public.photos (project_id);

drop trigger if exists photos_set_updated_at on public.photos;
create trigger photos_set_updated_at
  before update on public.photos
  for each row execute function public.set_updated_at();

-- =====================================================================
-- contact_queries
-- =====================================================================
create table if not exists public.contact_queries (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  email          text not null,
  phone          text,
  category_id    uuid references public.categories(id) on delete set null,
  category_label text,
  description    text,
  preferred_date date,
  utm_source     text,
  utm_medium     text,
  utm_campaign   text,
  referrer       text,
  landing_page   text,
  user_agent     text,
  status         public.query_status not null default 'new',
  created_at     timestamptz not null default now()
);

create index if not exists contact_queries_status_idx on public.contact_queries (status);
create index if not exists contact_queries_created_at_idx on public.contact_queries (created_at desc);

-- =====================================================================
-- about_content (single active row enforced via partial unique index)
-- =====================================================================
create table if not exists public.about_content (
  id           uuid primary key default gen_random_uuid(),
  bio          text,
  photo_url    text,
  tagline      text,
  social_links jsonb not null default '{}'::jsonb,
  is_active    boolean not null default true,
  updated_at   timestamptz not null default now()
);

create unique index if not exists about_content_single_active_idx
  on public.about_content (is_active)
  where is_active;

drop trigger if exists about_content_set_updated_at on public.about_content;
create trigger about_content_set_updated_at
  before update on public.about_content
  for each row execute function public.set_updated_at();

-- =====================================================================
-- traffic_sources
-- =====================================================================
create table if not exists public.traffic_sources (
  id           uuid primary key default gen_random_uuid(),
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  utm_content  text,
  utm_term     text,
  page         text not null,
  referrer     text,
  created_at   timestamptz not null default now()
);

create index if not exists traffic_sources_created_at_idx on public.traffic_sources (created_at desc);
create index if not exists traffic_sources_utm_source_idx on public.traffic_sources (utm_source);

-- =====================================================================
-- Seed the four fixed service categories
-- =====================================================================
insert into public.categories (slug, label, display_order) values
  ('people',      'People',      1),
  ('businesses',  'Businesses',  2),
  ('hospitality', 'Hospitality', 3),
  ('real-estate', 'Real Estate', 4)
on conflict (slug) do nothing;

-- =====================================================================
-- Row Level Security - admin = public.is_admin(), NOT bare authenticated
-- =====================================================================

-- ---- categories ----
alter table public.categories enable row level security;

drop policy if exists categories_public_read on public.categories;
create policy categories_public_read on public.categories
  for select to anon, authenticated using (true);

drop policy if exists categories_admin_write on public.categories;
create policy categories_admin_write on public.categories
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- ---- photos ----
alter table public.photos enable row level security;

-- Public: only visible portfolio photos.
drop policy if exists photos_public_read on public.photos;
create policy photos_public_read on public.photos
  for select to anon
  using (is_visible = true and gallery_type = 'portfolio');

-- Admin: full read.
drop policy if exists photos_admin_read on public.photos;
create policy photos_admin_read on public.photos
  for select to authenticated
  using ((select public.is_admin()));

-- Client-portal owner: read ONLY their own delivered client photos.
drop policy if exists photos_client_owner_read on public.photos;
create policy photos_client_owner_read on public.photos
  for select to authenticated
  using (
    gallery_type = 'client'
    and client_id in (
      select c.id from public.clients c
      where c.auth_user_id = (select auth.uid())
    )
  );

-- Admin: all writes.
drop policy if exists photos_admin_write on public.photos;
create policy photos_admin_write on public.photos
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- ---- contact_queries ----
alter table public.contact_queries enable row level security;

drop policy if exists contact_queries_public_insert on public.contact_queries;
create policy contact_queries_public_insert on public.contact_queries
  for insert to anon, authenticated
  with check (status = 'new');

drop policy if exists contact_queries_admin_read on public.contact_queries;
create policy contact_queries_admin_read on public.contact_queries
  for select to authenticated using ((select public.is_admin()));

drop policy if exists contact_queries_admin_update on public.contact_queries;
create policy contact_queries_admin_update on public.contact_queries
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists contact_queries_admin_delete on public.contact_queries;
create policy contact_queries_admin_delete on public.contact_queries
  for delete to authenticated using ((select public.is_admin()));

-- ---- about_content ----
alter table public.about_content enable row level security;

drop policy if exists about_content_public_read on public.about_content;
create policy about_content_public_read on public.about_content
  for select to anon, authenticated using (true);

drop policy if exists about_content_admin_write on public.about_content;
create policy about_content_admin_write on public.about_content
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- ---- traffic_sources ----
alter table public.traffic_sources enable row level security;

drop policy if exists traffic_sources_public_insert on public.traffic_sources;
create policy traffic_sources_public_insert on public.traffic_sources
  for insert to anon, authenticated with check (true);

drop policy if exists traffic_sources_admin_read on public.traffic_sources;
create policy traffic_sources_admin_read on public.traffic_sources
  for select to authenticated using ((select public.is_admin()));

-- ---- clients / projects ----
alter table public.clients enable row level security;
alter table public.projects enable row level security;

-- Admin manages all clients.
drop policy if exists clients_admin_all on public.clients;
create policy clients_admin_all on public.clients
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- Client-portal user may read ONLY their own client row.
drop policy if exists clients_self_read on public.clients;
create policy clients_self_read on public.clients
  for select to authenticated
  using (auth_user_id = (select auth.uid()));

-- Admin manages all projects.
drop policy if exists projects_admin_all on public.projects;
create policy projects_admin_all on public.projects
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- Client-portal user may read ONLY their own delivered projects.
drop policy if exists projects_client_owner_read on public.projects;
create policy projects_client_owner_read on public.projects
  for select to authenticated
  using (
    client_id in (
      select c.id from public.clients c
      where c.auth_user_id = (select auth.uid())
    )
  );

-- =====================================================================
-- Storage buckets
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('photos-full-res', 'photos-full-res', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('photos-previews', 'photos-previews', true)
on conflict (id) do nothing;

-- ---- Private full-res: ADMIN-ONLY (clients download via signed URLs) ----
drop policy if exists "full_res admin read" on storage.objects;
create policy "full_res admin read" on storage.objects
  for select to authenticated
  using (bucket_id = 'photos-full-res' and (select public.is_admin()));

drop policy if exists "full_res admin write" on storage.objects;
create policy "full_res admin write" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'photos-full-res' and (select public.is_admin()));

drop policy if exists "full_res admin update" on storage.objects;
create policy "full_res admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'photos-full-res' and (select public.is_admin()))
  with check (bucket_id = 'photos-full-res' and (select public.is_admin()));

drop policy if exists "full_res admin delete" on storage.objects;
create policy "full_res admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'photos-full-res' and (select public.is_admin()));

-- ---- Public previews: world-read (bucket public=true); ADMIN-only writes ----
drop policy if exists "previews public read" on storage.objects;
create policy "previews public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'photos-previews');

drop policy if exists "previews admin write" on storage.objects;
create policy "previews admin write" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'photos-previews' and (select public.is_admin()));

drop policy if exists "previews admin update" on storage.objects;
create policy "previews admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'photos-previews' and (select public.is_admin()))
  with check (bucket_id = 'photos-previews' and (select public.is_admin()));

drop policy if exists "previews admin delete" on storage.objects;
create policy "previews admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'photos-previews' and (select public.is_admin()));
