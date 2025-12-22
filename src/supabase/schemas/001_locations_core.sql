-- ============================================================================
-- Migration 001: Core Locations Schema (Supabase-First Architecture)
-- ============================================================================
-- Normalized schema: locations + events/restaurants/rentals
-- ============================================================================

create extension if not exists pgcrypto;

-- ============================================================================
-- LOCATIONS (shared physical places)
-- ============================================================================
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  area text,
  address text,
  lat double precision,
  lng double precision,
  place_id text, -- optional (google)
  source text default 'manual',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ============================================================================
-- EVENTS
-- ============================================================================
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  location_id uuid references public.locations(id) on delete set null,
  name text not null,
  description text,
  category text,
  price_tier text,
  rating numeric(3,2),
  start_time timestamptz,
  end_time timestamptz,
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ============================================================================
-- RESTAURANTS
-- ============================================================================
create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  location_id uuid references public.locations(id) on delete set null,
  name text not null,
  description text,
  cuisine text,
  price_tier text,
  rating numeric(3,2),
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ============================================================================
-- RENTALS
-- ============================================================================
create table if not exists public.rentals (
  id uuid primary key default gen_random_uuid(),
  location_id uuid references public.locations(id) on delete set null,
  name text not null,
  description text,
  rental_type text, -- car/scooter/stay
  price_amount numeric(12,2),
  price_unit text, -- per_day/per_night
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ============================================================================
-- TRIGGERS (auto-update updated_at)
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_locations_updated_at on public.locations;
create trigger trg_locations_updated_at
before update on public.locations
for each row execute function public.set_updated_at();

drop trigger if exists trg_events_updated_at on public.events;
create trigger trg_events_updated_at
before update on public.events
for each row execute function public.set_updated_at();

drop trigger if exists trg_restaurants_updated_at on public.restaurants;
create trigger trg_restaurants_updated_at
before update on public.restaurants
for each row execute function public.set_updated_at();

drop trigger if exists trg_rentals_updated_at on public.rentals;
create trigger trg_rentals_updated_at
before update on public.rentals
for each row execute function public.set_updated_at();

-- ============================================================================
-- INDEXES (performance)
-- ============================================================================
create index if not exists idx_locations_area on public.locations(area) where deleted_at is null;
create index if not exists idx_events_start_time on public.events(start_time) where deleted_at is null;
create index if not exists idx_events_location_id on public.events(location_id) where deleted_at is null;
create index if not exists idx_restaurants_location_id on public.restaurants(location_id) where deleted_at is null;
create index if not exists idx_rentals_location_id on public.rentals(location_id) where deleted_at is null;

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Run this to verify:
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('locations', 'events', 'restaurants', 'rentals');
