-- ============================================================================
-- Migration 002: RLS Policies (Public Read, Service Write)
-- ============================================================================
-- Option A: Public catalog - anyone can read, only service can write
-- ============================================================================

-- ============================================================================
-- ENABLE RLS
-- ============================================================================
alter table public.locations enable row level security;
alter table public.events enable row level security;
alter table public.restaurants enable row level security;
alter table public.rentals enable row level security;

-- ============================================================================
-- PUBLIC READ POLICIES (anon + authenticated can SELECT active records)
-- ============================================================================

create policy "public read locations" on public.locations
for select using (deleted_at is null);

create policy "public read events" on public.events
for select using (deleted_at is null);

create policy "public read restaurants" on public.restaurants
for select using (deleted_at is null);

create policy "public read rentals" on public.rentals
for select using (deleted_at is null);

-- ============================================================================
-- NO PUBLIC WRITES
-- ============================================================================
-- Do not create INSERT/UPDATE/DELETE policies for public roles
-- Only service role (Edge Functions) can write via service_role_key
-- This ensures data quality and prevents spam

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Test as anon (should work):
-- SET ROLE anon;
-- SELECT * FROM events;
-- RESET ROLE;

-- Test write as anon (should fail):
-- SET ROLE anon;
-- INSERT INTO events (name) VALUES ('test'); -- SHOULD FAIL
-- RESET ROLE;
