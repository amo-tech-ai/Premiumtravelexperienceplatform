# Creating Database Migrations

**Date:** December 20, 2024  
**Purpose:** Guidelines for creating Supabase database migration files  
**Compliance:** Required for all migration files

---

## 🎯 Overview

You are a Postgres Expert who loves creating secure database schemas.

This project uses the migrations provided by the Supabase CLI.

This document provides the complete guidelines for creating database migration files in the Trip Operating System using Supabase.

---

## Creating a Migration File

Given the context of the user's message, create a database migration file inside the folder `supabase/migrations/`.

### File Naming Convention

The file **MUST** follow this naming convention:

**Format:** `YYYYMMDDHHmmss_short_description.sql`

The file MUST be named in the format `YYYYMMDDHHmmss_short_description.sql` with proper casing for months, minutes, and seconds in **UTC time**:

1. `YYYY` - Four digits for the year (e.g., `2024`).
2. `MM` - Two digits for the month (01 to 12).
3. `DD` - Two digits for the day of the month (01 to 31).
4. `HH` - Two digits for the hour in 24-hour format (00 to 23).
5. `mm` - Two digits for the minute (00 to 59).
6. `ss` - Two digits for the second (00 to 59).
7. Add an appropriate description for the migration.

### Example

```
20240906123045_create_profiles.sql
```

### More Examples

```
20241220140000_create_users_table.sql
20241220140100_create_trips_table.sql
20241220140200_create_places_table.sql
20241220140300_add_user_preferences.sql
20241220140400_enable_rls_policies.sql
```

---

## SQL Guidelines

Write Postgres-compatible SQL code for Supabase migration files that:

### Required Elements

- **Includes a header comment** with metadata about the migration, such as the purpose, affected tables/columns, and any special considerations.
- **Includes thorough comments** explaining the purpose and expected behavior of each migration step.
- **Write all SQL in lowercase.**
- **Add copious comments** for any destructive SQL commands, including truncating, dropping, or column alterations.

### Row Level Security (RLS)

- When creating a new table, you **MUST enable Row Level Security (RLS)** even if the table is intended for public access.

### RLS Policies

When creating RLS Policies:

- **Ensure the policies cover all relevant access scenarios** (e.g. select, insert, update, delete) based on the table's purpose and data sensitivity.
- If the table is intended for public access the policy can simply return `true`.
- **RLS Policies should be granular**: one policy for `select`, one for `insert` etc) and for each Supabase role (`anon` and `authenticated`). **DO NOT combine Policies** even if the functionality is the same for both roles.
- **Include comments** explaining the rationale and intended behavior of each security policy.

### Production Quality

The generated SQL code should be:
- ✅ Production-ready
- ✅ Well-documented
- ✅ Aligned with Supabase's best practices

---

## Complete Migration Template

### Basic Template

```sql
-- ============================================================================
-- Migration: <Short Description>
-- Created: YYYY-MM-DD HH:mm:ss UTC
-- Purpose: <Detailed purpose of this migration>
-- 
-- Affected Tables: <list of tables>
-- Affected Columns: <list of columns if modifying existing tables>
-- Dependencies: <list of other migrations or tables this depends on>
-- 
-- Special Considerations:
-- - <any important notes>
-- - <breaking changes>
-- - <performance implications>
-- ============================================================================

-- <SQL statements here with comments>
```

---

## Example: Create Users Table

### File: `supabase/migrations/20241220140000_create_users_table.sql`

```sql
-- ============================================================================
-- Migration: Create Users Table
-- Created: 2024-12-20 14:00:00 UTC
-- Purpose: Create the core users table for authentication and profile data
-- 
-- Affected Tables: users (new)
-- Dependencies: None
-- 
-- Special Considerations:
-- - This table integrates with Supabase Auth
-- - RLS policies ensure users can only access their own data
-- - Email is unique and required for authentication
-- ============================================================================

-- Create users table
-- This table stores user profile information and settings
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text,
  avatar_url text,
  preferences jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  -- Constraints
  constraint users_email_check check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Add table comment
comment on table public.users is 'User profiles and authentication data';
comment on column public.users.email is 'User email address (unique, required for auth)';
comment on column public.users.preferences is 'User preferences and settings as JSON';

-- Create indexes for common queries
create index idx_users_email on public.users (email);
create index idx_users_created_at on public.users (created_at);

-- Enable Row Level Security
-- This ensures users can only access their own data
alter table public.users enable row level security;

-- RLS Policy: anon role cannot select users
-- Anonymous users should not be able to view user profiles
create policy "anon_users_select_policy"
  on public.users
  for select
  to anon
  using (false);

-- RLS Policy: authenticated users can select their own profile
-- Users can view their own profile data
create policy "authenticated_users_select_policy"
  on public.users
  for select
  to authenticated
  using (auth.uid() = id);

-- RLS Policy: anon role cannot insert users
-- Anonymous users cannot create user profiles (handled by auth)
create policy "anon_users_insert_policy"
  on public.users
  for insert
  to anon
  with check (false);

-- RLS Policy: authenticated users can insert their own profile
-- Users can create their own profile after authentication
create policy "authenticated_users_insert_policy"
  on public.users
  for insert
  to authenticated
  with check (auth.uid() = id);

-- RLS Policy: anon role cannot update users
-- Anonymous users cannot update user profiles
create policy "anon_users_update_policy"
  on public.users
  for update
  to anon
  using (false);

-- RLS Policy: authenticated users can update their own profile
-- Users can modify their own profile data
create policy "authenticated_users_update_policy"
  on public.users
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- RLS Policy: anon role cannot delete users
-- Anonymous users cannot delete user profiles
create policy "anon_users_delete_policy"
  on public.users
  for delete
  to anon
  using (false);

-- RLS Policy: authenticated users can delete their own profile
-- Users can delete their own profile (soft delete preferred)
create policy "authenticated_users_delete_policy"
  on public.users
  for delete
  to authenticated
  using (auth.uid() = id);
```

---

## Example: Create Trips Table with Foreign Keys

### File: `supabase/migrations/20241220140100_create_trips_table.sql`

```sql
-- ============================================================================
-- Migration: Create Trips Table
-- Created: 2024-12-20 14:01:00 UTC
-- Purpose: Create the trips table for storing user trip plans
-- 
-- Affected Tables: trips (new)
-- Dependencies: users table must exist
-- 
-- Special Considerations:
-- - Foreign key to users table with CASCADE delete
-- - Date validation ensures end_date >= start_date
-- - Budget and travelers must be positive values
-- ============================================================================

-- Create trips table
-- This table stores trip planning data including dates, budget, and destination
create table public.trips (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  destination text not null,
  start_date date not null,
  end_date date not null,
  budget numeric(10, 2),
  travelers integer default 1,
  image text,
  description text,
  status text default 'planning',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  -- Constraints ensure data integrity
  constraint trips_dates_check check (end_date >= start_date),
  constraint trips_budget_check check (budget is null or budget >= 0),
  constraint trips_travelers_check check (travelers > 0),
  constraint trips_status_check check (status in ('planning', 'confirmed', 'completed', 'cancelled'))
);

-- Add table and column comments
comment on table public.trips is 'User trip plans with dates, budget, and destination information';
comment on column public.trips.user_id is 'Reference to the user who created the trip';
comment on column public.trips.budget is 'Total budget for the trip in USD';
comment on column public.trips.travelers is 'Number of travelers on the trip';
comment on column public.trips.status is 'Current status of the trip planning';

-- Create indexes for common queries
create index idx_trips_user_id on public.trips (user_id);
create index idx_trips_dates on public.trips (start_date, end_date);
create index idx_trips_status on public.trips (status);
create index idx_trips_destination on public.trips (destination);

-- Enable Row Level Security
-- Users can only access their own trips
alter table public.trips enable row level security;

-- RLS Policy: anon role cannot select trips
-- Anonymous users cannot view trip data
create policy "anon_trips_select_policy"
  on public.trips
  for select
  to anon
  using (false);

-- RLS Policy: authenticated users can select their own trips
-- Users can view all their own trips
create policy "authenticated_trips_select_policy"
  on public.trips
  for select
  to authenticated
  using (auth.uid() = user_id);

-- RLS Policy: anon role cannot insert trips
-- Anonymous users cannot create trips
create policy "anon_trips_insert_policy"
  on public.trips
  for insert
  to anon
  with check (false);

-- RLS Policy: authenticated users can insert their own trips
-- Users can create trips assigned to themselves
create policy "authenticated_trips_insert_policy"
  on public.trips
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- RLS Policy: anon role cannot update trips
-- Anonymous users cannot modify trips
create policy "anon_trips_update_policy"
  on public.trips
  for update
  to anon
  using (false);

-- RLS Policy: authenticated users can update their own trips
-- Users can modify their own trips
create policy "authenticated_trips_update_policy"
  on public.trips
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- RLS Policy: anon role cannot delete trips
-- Anonymous users cannot delete trips
create policy "anon_trips_delete_policy"
  on public.trips
  for delete
  to anon
  using (false);

-- RLS Policy: authenticated users can delete their own trips
-- Users can delete their own trips
create policy "authenticated_trips_delete_policy"
  on public.trips
  for delete
  to authenticated
  using (auth.uid() = user_id);
```

---

## Example: Alter Table Migration

### File: `supabase/migrations/20241220140300_add_user_preferences.sql`

```sql
-- ============================================================================
-- Migration: Add User Preferences Columns
-- Created: 2024-12-20 14:03:00 UTC
-- Purpose: Add additional user preference columns for customization
-- 
-- Affected Tables: users (modified)
-- Affected Columns: theme, language, notifications_enabled (new)
-- Dependencies: users table must exist
-- 
-- Special Considerations:
-- - Non-destructive: only adding columns with default values
-- - Existing data will have default values applied
-- - No data loss expected
-- ============================================================================

-- Add theme preference column
-- Stores user's preferred UI theme (light/dark/auto)
alter table public.users
  add column theme text default 'auto'
  constraint users_theme_check check (theme in ('light', 'dark', 'auto'));

comment on column public.users.theme is 'User preferred UI theme (light, dark, or auto)';

-- Add language preference column
-- Stores user's preferred language (ISO 639-1 codes)
alter table public.users
  add column language text default 'en'
  constraint users_language_check check (length(language) = 2);

comment on column public.users.language is 'User preferred language (ISO 639-1 code)';

-- Add notifications preference column
-- Stores whether user wants to receive notifications
alter table public.users
  add column notifications_enabled boolean default true;

comment on column public.users.notifications_enabled is 'Whether user has notifications enabled';

-- Create index for language-based queries
create index idx_users_language on public.users (language);
```

---

## Example: Public Table with Open Access

### File: `supabase/migrations/20241220140400_create_public_destinations.sql`

```sql
-- ============================================================================
-- Migration: Create Public Destinations Table
-- Created: 2024-12-20 14:04:00 UTC
-- Purpose: Create a public table for popular travel destinations
-- 
-- Affected Tables: destinations (new)
-- Dependencies: None
-- 
-- Special Considerations:
-- - This table is publicly readable by all users (anon and authenticated)
-- - Only authenticated users can suggest new destinations
-- - RLS is still enabled for security, but policies allow public read
-- ============================================================================

-- Create destinations table
-- This table stores curated travel destination data
create table public.destinations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  country text not null,
  description text,
  image_url text,
  popular_months integer[] default '{}',
  average_budget numeric(10, 2),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add table comment
comment on table public.destinations is 'Curated list of popular travel destinations';
comment on column public.destinations.popular_months is 'Array of popular months to visit (1-12)';

-- Create indexes
create index idx_destinations_country on public.destinations (country);
create index idx_destinations_name on public.destinations (name);

-- Enable Row Level Security (required even for public tables)
alter table public.destinations enable row level security;

-- RLS Policy: anon role can select all destinations
-- Public access: anyone can view destinations
create policy "anon_destinations_select_policy"
  on public.destinations
  for select
  to anon
  using (true);

-- RLS Policy: authenticated users can select all destinations
-- Authenticated users can also view all destinations
create policy "authenticated_destinations_select_policy"
  on public.destinations
  for select
  to authenticated
  using (true);

-- RLS Policy: anon role cannot insert destinations
-- Anonymous users cannot add destinations
create policy "anon_destinations_insert_policy"
  on public.destinations
  for insert
  to anon
  with check (false);

-- RLS Policy: authenticated users can insert destinations
-- Authenticated users can suggest new destinations
create policy "authenticated_destinations_insert_policy"
  on public.destinations
  for insert
  to authenticated
  with check (true);

-- RLS Policy: anon role cannot update destinations
-- Anonymous users cannot modify destinations
create policy "anon_destinations_update_policy"
  on public.destinations
  for update
  to anon
  using (false);

-- RLS Policy: authenticated users cannot update destinations
-- Only admins should update destinations (not implemented yet)
create policy "authenticated_destinations_update_policy"
  on public.destinations
  for update
  to authenticated
  using (false);

-- RLS Policy: anon role cannot delete destinations
-- Anonymous users cannot delete destinations
create policy "anon_destinations_delete_policy"
  on public.destinations
  for delete
  to anon
  using (false);

-- RLS Policy: authenticated users cannot delete destinations
-- Only admins should delete destinations (not implemented yet)
create policy "authenticated_destinations_delete_policy"
  on public.destinations
  for delete
  to authenticated
  using (false);
```

---

## Example: Drop Column (Destructive)

### File: `supabase/migrations/20241220140500_remove_deprecated_columns.sql`

```sql
-- ============================================================================
-- Migration: Remove Deprecated Columns from Users Table
-- Created: 2024-12-20 14:05:00 UTC
-- Purpose: Remove deprecated columns that are no longer used
-- 
-- Affected Tables: users (modified)
-- Affected Columns: old_preferences, legacy_id (removed)
-- Dependencies: None
-- 
-- Special Considerations:
-- ⚠️  DESTRUCTIVE: This migration will permanently delete data
-- ⚠️  Ensure data has been migrated to new columns before running
-- ⚠️  Backup database before applying this migration
-- ⚠️  This cannot be easily rolled back - data will be lost
-- ============================================================================

-- ⚠️  WARNING: Dropping column 'old_preferences'
-- This column is no longer used after migration to 'preferences' (jsonb)
-- Ensure all data has been migrated before proceeding
alter table public.users
  drop column if exists old_preferences;

-- ⚠️  WARNING: Dropping column 'legacy_id'
-- This column was used for migration from old system
-- All references have been updated to use 'id' (uuid)
alter table public.users
  drop column if exists legacy_id;

-- Note: If you need to rollback this migration, you will need to:
-- 1. Restore from backup, or
-- 2. Manually recreate columns (data will be lost)
```

---

## Best Practices Summary

### DO ✅

- ✅ Use UTC timestamps in filename
- ✅ Include comprehensive header comment
- ✅ Add comments for each migration step
- ✅ Enable RLS on all tables
- ✅ Create granular RLS policies (one per operation per role)
- ✅ Use lowercase SQL
- ✅ Add constraints for data integrity
- ✅ Create indexes for foreign keys
- ✅ Add table and column comments
- ✅ Test migration locally before deploying

### DON'T ❌

- ❌ Skip RLS even for public tables
- ❌ Combine multiple policies into one
- ❌ Forget comments on destructive operations
- ❌ Use camelCase or PascalCase
- ❌ Skip header metadata
- ❌ Assume data exists without checks
- ❌ Deploy without testing locally

---

## Migration Checklist

Before creating a migration:

- [ ] Determine UTC timestamp for filename
- [ ] Write descriptive migration name
- [ ] Create header comment with metadata
- [ ] Write SQL in lowercase
- [ ] Add constraints for data integrity
- [ ] Create necessary indexes
- [ ] Enable RLS on new tables
- [ ] Create all RLS policies (select, insert, update, delete)
- [ ] Create separate policies for anon and authenticated roles
- [ ] Add table and column comments
- [ ] Test migration locally
- [ ] Review for destructive operations
- [ ] Add warnings for destructive operations
- [ ] Document rollback procedure if needed

---

## Testing Migrations Locally

```bash
# 1. Stop Supabase
supabase stop

# 2. Create your migration file
# supabase/migrations/YYYYMMDDHHmmss_description.sql

# 3. Start Supabase (applies migrations automatically)
supabase start

# 4. Verify migration was applied
supabase migration list

# 5. Test the changes
psql postgresql://postgres:postgres@localhost:54322/postgres

# 6. If issues found, fix and reset
supabase db reset
```

---

## Common Patterns

### Pattern: UUID Primary Key

```sql
create table public.example (
  id uuid primary key default uuid_generate_v4(),
  -- other columns
);
```

### Pattern: Timestamps

```sql
created_at timestamptz default now(),
updated_at timestamptz default now()
```

### Pattern: Foreign Key with Cascade

```sql
user_id uuid not null references public.users (id) on delete cascade
```

### Pattern: Check Constraints

```sql
constraint example_status_check check (status in ('active', 'inactive', 'deleted'))
```

### Pattern: RLS Policy Template

```sql
-- Enable RLS
alter table public.example enable row level security;

-- Anon Select
create policy "anon_example_select_policy"
  on public.example
  for select
  to anon
  using (false);

-- Authenticated Select
create policy "authenticated_example_select_policy"
  on public.example
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Repeat for insert, update, delete
```

---

## 🔗 Related Documentation

- **[Declarative Schema Best Practices](/docs/supabase/01-declarative-schema-best-practices.md)** - Schema management workflow
- **[Postgres SQL Style Guide](/docs/supabase/02-postgres-sql-style-guide.md)** - SQL coding standards
- **[Architecture → ERD](/docs/architecture/02-entity-relationship-diagram.md)** - Complete database schema

---

## 📚 Additional Resources

### Official Documentation
- [Supabase Migrations](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [PostgreSQL Row Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)

---

**Status:** Required best practices  
**Last Updated:** December 20, 2024  
**Maintained by:** Database Team
