# Postgres SQL Style Guide

**Date:** December 20, 2024  
**Purpose:** SQL coding standards and best practices  
**Compliance:** Recommended for all SQL code

---

## 🎯 Overview

This document defines the SQL coding standards for all PostgreSQL/Supabase database work in the Trip Operating System. Following these guidelines ensures consistency, readability, and maintainability.

---

## General

- Use **lowercase** for SQL reserved words to maintain consistency and readability.
- Employ **consistent, descriptive identifiers** for tables, columns, and other database objects.
- Use **white space and indentation** to enhance the readability of your code.
- Store dates in **ISO 8601 format** (`yyyy-mm-ddThh:mm:ss.sssss`).
- Include **comments** for complex logic, using `/* ... */` for block comments and `--` for line comments.

---

## Naming Conventions

### Rules

- **Avoid SQL reserved words** and ensure names are unique and under 63 characters.
- Use **snake_case** for tables and columns.
- Prefer **plurals** for table names.
- Prefer **singular** names for columns.

### Examples

✅ **Good:**
```sql
-- Table names: plural, snake_case
users
trip_items
saved_places
budget_entries

-- Column names: singular, snake_case
user_id
first_name
created_at
price_level
```

❌ **Bad:**
```sql
-- Don't use: camelCase, PascalCase, UPPERCASE
User
tripItems
SavedPlaces
BUDGET_ENTRIES

-- Don't use: reserved words
user
order
select
```

---

## Tables

### Guidelines

- **Avoid prefixes** like `tbl_` and ensure no table name matches any of its column names.
- Always add an **`id` column** of type `identity generated always` unless otherwise specified.
- Create all tables in the **`public` schema** unless otherwise specified.
- Always add the **schema** to SQL queries for clarity.
- Always add a **comment** to describe what the table does. The comment can be up to 1024 characters.

### Example

```sql
create table books (
  id bigint generated always as identity primary key,
  title text not null,
  author_id bigint references authors (id)
);

comment on table books is 'A list of all the books in the library.';
```

### Complete Example (Trip Operating System)

```sql
-- File: supabase/schemas/trips.sql
-- Purpose: Trip planning and itinerary management
-- Dependencies: users.sql

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
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  constraint trips_dates_check check (end_date >= start_date),
  constraint trips_budget_check check (budget >= 0),
  constraint trips_travelers_check check (travelers > 0)
);

comment on table public.trips is 'User trip plans with dates, budget, and destination information.';
comment on column public.trips.user_id is 'Reference to the user who created the trip.';
comment on column public.trips.budget is 'Total budget for the trip in USD.';
comment on column public.trips.travelers is 'Number of travelers on the trip.';

-- Indexes
create index idx_trips_user_id on public.trips (user_id);
create index idx_trips_dates on public.trips (start_date, end_date);

-- Row Level Security
alter table public.trips enable row level security;

create policy "Users can view own trips"
  on public.trips
  for select
  using (auth.uid() = user_id);

create policy "Users can create own trips"
  on public.trips
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own trips"
  on public.trips
  for update
  using (auth.uid() = user_id);

create policy "Users can delete own trips"
  on public.trips
  for delete
  using (auth.uid() = user_id);
```

---

## Columns

### Guidelines

- Use **singular names** and avoid generic names like `id`.
- For references to foreign tables, use the **singular of the table name** with the `_id` suffix. For example `user_id` to reference the `users` table.
- Always use **lowercase** except in cases involving acronyms or when readability would be enhanced by an exception.

### Examples

✅ **Good:**
```sql
create table trip_items (
  id bigint generated always as identity primary key,
  trip_id uuid references trips (id),        -- Singular 'trip' + '_id'
  place_id uuid references places (id),      -- Singular 'place' + '_id'
  title text not null,
  type text not null,
  time text,
  cost numeric(10, 2),
  created_at timestamptz default now()
);
```

❌ **Bad:**
```sql
create table trip_items (
  id bigint generated always as identity primary key,
  trips_id uuid,           -- ❌ Should be 'trip_id' (singular)
  placeID uuid,            -- ❌ Should be 'place_id' (snake_case)
  Title text,              -- ❌ Should be 'title' (lowercase)
  itemType text,           -- ❌ Should be 'type' or 'item_type'
  createdAt timestamptz    -- ❌ Should be 'created_at' (snake_case)
);
```

---

## Queries

### General Guidelines

- When the query is **shorter**, keep it on just a few lines.
- As it gets **larger**, start adding newlines for readability.
- Add **spaces** for readability.

### Smaller Queries

```sql
select *
from employees
where end_date is null;

update employees
set end_date = '2023-12-31'
where employee_id = 1001;
```

### Larger Queries

```sql
select
  first_name,
  last_name
from
  employees
where
  start_date between '2021-01-01' and '2021-12-31'
and
  status = 'employed';
```

### Trip Operating System Examples

**Simple query:**
```sql
select *
from public.trips
where user_id = auth.uid();
```

**Complex query:**
```sql
select
  trips.id,
  trips.name,
  trips.destination,
  count(trip_items.id) as item_count,
  sum(trip_items.cost) as total_cost
from
  public.trips
left join
  public.trip_items on trips.id = trip_items.trip_id
where
  trips.user_id = auth.uid()
and
  trips.start_date >= current_date
group by
  trips.id,
  trips.name,
  trips.destination
order by
  trips.start_date asc;
```

---

## Joins and Subqueries

### Guidelines

- Format **joins and subqueries** for clarity, aligning them with related SQL clauses.
- Prefer **full table names** when referencing tables. This helps for readability.

### Example

```sql
select
  employees.employee_name,
  departments.department_name
from
  employees
join
  departments on employees.department_id = departments.department_id
where
  employees.start_date > '2022-01-01';
```

### Trip Operating System Example

```sql
select
  trips.name as trip_name,
  trips.destination,
  users.name as user_name,
  users.email,
  count(trip_items.id) as total_items
from
  public.trips
join
  public.users on trips.user_id = users.id
left join
  public.trip_items on trips.id = trip_items.trip_id
where
  trips.start_date >= current_date
and
  trips.user_id = auth.uid()
group by
  trips.id,
  trips.name,
  trips.destination,
  users.name,
  users.email
order by
  trips.start_date asc;
```

---

## Aliases

### Guidelines

- Use **meaningful aliases** that reflect the data or transformation applied.
- Always include the **`as` keyword** for clarity.

### Examples

✅ **Good:**
```sql
select count(*) as total_employees
from employees
where end_date is null;

select
  trips.name as trip_name,
  users.email as user_email,
  sum(trip_items.cost) as total_budget_used
from public.trips
join public.users on trips.user_id = users.id
left join public.trip_items on trips.id = trip_items.trip_id
group by trips.id, users.id;
```

❌ **Bad:**
```sql
select count(*) total_employees      -- ❌ Missing 'as'
from employees;

select
  t.name n,                          -- ❌ Unclear aliases
  u.email e,
  sum(ti.cost) c
from trips t
join users u on t.user_id = u.id
left join trip_items ti on t.id = ti.trip_id;
```

---

## Complex Queries and CTEs

### Guidelines

- If a query is **extremely complex**, prefer a **CTE** (Common Table Expression).
- Make sure the CTE is **clear and linear**. Prefer readability over performance.
- Add **comments** to each block.

### Example

```sql
with department_employees as (
  -- Get all employees and their departments
  select
    employees.department_id,
    employees.first_name,
    employees.last_name,
    departments.department_name
  from
    employees
  join
    departments on employees.department_id = departments.department_id
),
employee_counts as (
  -- Count how many employees in each department
  select
    department_name,
    count(*) as num_employees
  from
    department_employees
  group by
    department_name
)
select
  department_name,
  num_employees
from
  employee_counts
order by
  department_name;
```

### Trip Operating System Example

```sql
with user_trips as (
  -- Get all trips for the current user
  select
    id,
    name,
    destination,
    start_date,
    end_date,
    budget
  from
    public.trips
  where
    user_id = auth.uid()
),
trip_expenses as (
  -- Calculate total expenses per trip
  select
    trip_id,
    count(*) as item_count,
    sum(cost) as total_spent
  from
    public.trip_items
  where
    trip_id in (select id from user_trips)
  group by
    trip_id
),
trip_summary as (
  -- Combine trip info with expense data
  select
    user_trips.id,
    user_trips.name,
    user_trips.destination,
    user_trips.budget,
    coalesce(trip_expenses.total_spent, 0) as spent,
    user_trips.budget - coalesce(trip_expenses.total_spent, 0) as remaining,
    coalesce(trip_expenses.item_count, 0) as items
  from
    user_trips
  left join
    trip_expenses on user_trips.id = trip_expenses.trip_id
)
select
  id,
  name,
  destination,
  budget,
  spent,
  remaining,
  items,
  round((spent / nullif(budget, 0) * 100), 2) as budget_used_percent
from
  trip_summary
order by
  start_date desc;
```

---

## Additional Best Practices

### Data Types

**Prefer specific types:**
```sql
-- ✅ Good
created_at timestamptz default now()
price numeric(10, 2)
is_active boolean default true

-- ❌ Bad
created_at varchar(50)
price varchar(20)
is_active varchar(5)
```

### Constraints

**Always add meaningful constraints:**
```sql
create table trips (
  id uuid primary key default uuid_generate_v4(),
  budget numeric(10, 2),
  travelers integer,
  start_date date not null,
  end_date date not null,
  
  -- Add descriptive constraints
  constraint trips_budget_positive check (budget >= 0),
  constraint trips_travelers_positive check (travelers > 0),
  constraint trips_date_order check (end_date >= start_date)
);
```

### Indexes

**Create indexes for common queries:**
```sql
-- Foreign keys (almost always need indexes)
create index idx_trips_user_id on trips (user_id);
create index idx_trip_items_trip_id on trip_items (trip_id);

-- Common filters
create index idx_trips_dates on trips (start_date, end_date);
create index idx_trips_destination on trips (destination);

-- Unique constraints
create unique index idx_users_email on users (email);
```

### Functions

**Format functions clearly:**
```sql
create or replace function calculate_trip_budget(trip_id uuid)
returns numeric
language sql
stable
as $$
  select
    coalesce(sum(cost), 0) as total
  from
    public.trip_items
  where
    trip_id = $1;
$$;

comment on function calculate_trip_budget(uuid) is 'Calculates total budget used for a trip.';
```

---

## Quick Reference Checklist

### Before Writing SQL

- [ ] Use lowercase for SQL keywords
- [ ] Use snake_case for identifiers
- [ ] Plan for readability (CTEs for complex queries)

### Tables

- [ ] Use plural names (e.g., `trips`, `users`)
- [ ] Add `id` column (identity or uuid)
- [ ] Include schema in queries (`public.trips`)
- [ ] Add table comment
- [ ] Add column comments for important fields

### Columns

- [ ] Use singular names (e.g., `user_id`, `name`)
- [ ] Foreign keys: `{table_singular}_id` (e.g., `trip_id`)
- [ ] Add constraints where appropriate
- [ ] Use appropriate data types

### Queries

- [ ] Format for readability
- [ ] Use meaningful aliases with `as`
- [ ] Prefer full table names in joins
- [ ] Add comments for complex logic
- [ ] Use CTEs for very complex queries

---

## 🔗 Related Documentation

- **[Declarative Schema Best Practices](/docs/supabase/01-declarative-schema-best-practices.md)** - Schema management workflow
- **[Architecture → ERD](/docs/architecture/02-entity-relationship-diagram.md)** - Complete database schema
- **[Supabase README](/docs/supabase/README.md)** - Supabase setup and workflow

---

## 📚 Examples Repository

For more complete examples, see:
- `/docs/architecture/02-entity-relationship-diagram.md` - Full schema with SQL
- `/supabase/schemas/` - Actual schema files (once created)

---

**Status:** Recommended best practices  
**Last Updated:** December 20, 2024  
**Maintained by:** Database Team
