# Creating Database Functions

**Date:** December 20, 2024  
**Purpose:** Guidelines for creating PostgreSQL functions in Supabase  
**Compliance:** Required for all database functions

---

## 🎯 Overview

You're a Supabase Postgres expert in writing database functions. Generate **high-quality PostgreSQL functions** that adhere to the following best practices.

This document provides the complete guidelines for creating PostgreSQL functions in the Trip Operating System using Supabase.

---

## General Guidelines

### 1. Default to `SECURITY INVOKER`

**Rule:** Functions should run with the permissions of the user invoking the function, ensuring safer access control.

**Why:** This prevents privilege escalation and ensures functions respect Row Level Security (RLS) policies.

**When to use `SECURITY DEFINER`:** Only when explicitly required (e.g., creating audit logs that users shouldn't directly access). Always explain the rationale.

**Example:**

```sql
create or replace function public.get_user_trips()
returns table (
  id uuid,
  name text,
  destination text
)
language plpgsql
security invoker  -- ✅ Runs with user's permissions
set search_path = ''
as $$
begin
  return query
  select t.id, t.name, t.destination
  from public.trips t
  where t.user_id = auth.uid();
end;
$$;
```

---

### 2. Set the `search_path` Configuration Parameter

**Rule:** Always set `search_path` to an empty string (`set search_path = '';`).

**Why:** This avoids unexpected behavior and security risks caused by resolving object references in untrusted or unintended schemas.

**Requirement:** Use fully qualified names (e.g., `schema_name.table_name`) for all database objects referenced within the function.

**Example:**

```sql
create or replace function public.count_user_trips()
returns integer
language plpgsql
security invoker
set search_path = ''  -- ✅ Always set to empty
as $$
declare
  trip_count integer;
begin
  select count(*)
  into trip_count
  from public.trips  -- ✅ Fully qualified name
  where user_id = auth.uid();
  
  return trip_count;
end;
$$;
```

---

### 3. Adhere to SQL Standards and Validation

**Rule:** Ensure all queries within the function are valid PostgreSQL SQL queries and compatible with the specified context (i.e., Supabase).

**Requirements:**
- ✅ Use Postgres-compatible SQL
- ✅ Test functions in Supabase environment
- ✅ Validate with actual data
- ✅ Handle edge cases
- ✅ Include error handling

---

## Best Practices

### 1. Minimize Side Effects

**Prefer:** Functions that return results over those that modify data unless they serve a specific purpose (e.g., triggers).

**Why:** Pure functions are easier to test, debug, and reason about.

#### ❌ Avoid (unless necessary)

```sql
create or replace function public.increment_view_count(trip_id uuid)
returns void  -- Side effect with no return value
language plpgsql
security invoker
set search_path = ''
as $$
begin
  update public.trips
  set view_count = view_count + 1
  where id = trip_id;
end;
$$;
```

#### ✅ Prefer

```sql
create or replace function public.get_trip_with_view_count(trip_id uuid)
returns table (
  id uuid,
  name text,
  view_count integer
)
language plpgsql
security invoker
set search_path = ''
as $$
begin
  return query
  select t.id, t.name, t.view_count
  from public.trips t
  where t.id = trip_id;
end;
$$;
```

---

### 2. Use Explicit Typing

**Rule:** Clearly specify input and output types, avoiding ambiguous or loosely typed parameters.

#### ❌ Avoid

```sql
create or replace function public.calculate_total(data json)
returns numeric  -- Unclear what "data" contains
-- ...
```

#### ✅ Prefer

```sql
create or replace function public.calculate_trip_budget(
  trip_id uuid,
  currency_code text default 'USD'
)
returns numeric
language plpgsql
security invoker
set search_path = ''
as $$
declare
  total numeric;
begin
  select sum(p.price)
  into total
  from public.places p
  where p.trip_id = calculate_trip_budget.trip_id;
  
  return total;
end;
$$;
```

---

### 3. Default to Immutable or Stable Functions

**Rule:** Where possible, declare functions as `IMMUTABLE` or `STABLE` to allow better optimization by PostgreSQL. Use `VOLATILE` only if the function modifies data or has side effects.

**Function Volatility:**

- **`IMMUTABLE`** - Always returns same result for same inputs (e.g., mathematical functions)
- **`STABLE`** - Returns same result within a single query (e.g., `auth.uid()`)
- **`VOLATILE`** - Can return different results and/or has side effects (default if not specified)

**Examples:**

#### IMMUTABLE

```sql
create or replace function public.calculate_distance(
  lat1 numeric,
  lon1 numeric,
  lat2 numeric,
  lon2 numeric
)
returns numeric
language sql
security invoker
set search_path = ''
immutable  -- ✅ Always same result for same inputs
as $$
  select acos(
    sin(radians(lat1)) * sin(radians(lat2)) +
    cos(radians(lat1)) * cos(radians(lat2)) * cos(radians(lon2 - lon1))
  ) * 6371;  -- Earth radius in km
$$;
```

#### STABLE

```sql
create or replace function public.get_current_user_email()
returns text
language plpgsql
security invoker
set search_path = ''
stable  -- ✅ Same result within query, but can change between queries
as $$
begin
  return (select email from public.users where id = auth.uid());
end;
$$;
```

#### VOLATILE (explicit)

```sql
create or replace function public.create_trip_with_defaults(
  trip_name text,
  destination text
)
returns uuid
language plpgsql
security invoker
set search_path = ''
volatile  -- ✅ Modifies data
as $$
declare
  new_trip_id uuid;
begin
  insert into public.trips (user_id, name, destination, status)
  values (auth.uid(), trip_name, destination, 'planning')
  returning id into new_trip_id;
  
  return new_trip_id;
end;
$$;
```

---

### 4. Triggers (if Applicable)

**Rule:** If the function is used as a trigger, include a valid `CREATE TRIGGER` statement that attaches the function to the desired table and event (e.g., `BEFORE INSERT`).

**Requirements:**
- ✅ Trigger function must return `trigger` type
- ✅ Access `NEW` and `OLD` records as needed
- ✅ Return `NEW` to proceed with operation
- ✅ Return `NULL` to skip operation

**Example:**

```sql
create or replace function public.update_trip_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger update_trip_updated_at_trigger
before update on public.trips
for each row
execute function public.update_trip_updated_at();
```

---

## Example Templates

### Simple Function with `SECURITY INVOKER`

```sql
create or replace function my_schema.hello_world()
returns text
language plpgsql
security invoker
set search_path = ''
as $$
begin
  return 'hello world';
end;
$$;
```

---

### Function with Parameters and Fully Qualified Object Names

```sql
create or replace function public.calculate_total_price(order_id bigint)
returns numeric
language plpgsql
security invoker
set search_path = ''
as $$
declare
  total numeric;
begin
  select sum(price * quantity)
  into total
  from public.order_items
  where order_id = calculate_total_price.order_id;

  return total;
end;
$$;
```

---

### Function as a Trigger

```sql
create or replace function my_schema.update_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Update the "updated_at" column on row modification
  new.updated_at := now();
  return new;
end;
$$;

create trigger update_updated_at_trigger
before update on my_schema.my_table
for each row
execute function my_schema.update_updated_at();
```

---

### Function with Error Handling

```sql
create or replace function my_schema.safe_divide(numerator numeric, denominator numeric)
returns numeric
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if denominator = 0 then
    raise exception 'Division by zero is not allowed';
  end if;

  return numerator / denominator;
end;
$$;
```

---

### Immutable Function for Better Optimization

```sql
create or replace function my_schema.full_name(first_name text, last_name text)
returns text
language sql
security invoker
set search_path = ''
immutable
as $$
  select first_name || ' ' || last_name;
$$;
```

---

## Trip Operating System Examples

### Example 1: Get User Trip Count

Returns the total number of trips for the current user.

```sql
create or replace function public.get_user_trip_count()
returns integer
language plpgsql
security invoker
set search_path = ''
stable
as $$
declare
  trip_count integer;
begin
  select count(*)
  into trip_count
  from public.trips
  where user_id = auth.uid();
  
  return trip_count;
end;
$$;
```

---

### Example 2: Get Trip Summary

Returns detailed trip information with calculated fields.

```sql
create or replace function public.get_trip_summary(p_trip_id uuid)
returns table (
  trip_id uuid,
  trip_name text,
  destination text,
  total_places integer,
  total_budget numeric,
  days_count integer
)
language plpgsql
security invoker
set search_path = ''
stable
as $$
begin
  return query
  select 
    t.id,
    t.name,
    t.destination,
    (select count(*) from public.places p where p.trip_id = t.id)::integer,
    (select sum(p.price) from public.places p where p.trip_id = t.id),
    (t.end_date - t.start_date + 1)::integer
  from public.trips t
  where t.id = p_trip_id
    and t.user_id = auth.uid();
end;
$$;
```

---

### Example 3: Create Trip with Defaults

Creates a new trip with sensible defaults and returns the ID.

```sql
create or replace function public.create_trip_with_defaults(
  p_name text,
  p_destination text,
  p_start_date date,
  p_end_date date
)
returns uuid
language plpgsql
security invoker
set search_path = ''
volatile
as $$
declare
  new_trip_id uuid;
  current_user_id uuid;
begin
  -- Get current user
  current_user_id := auth.uid();
  
  if current_user_id is null then
    raise exception 'User must be authenticated';
  end if;
  
  -- Validate dates
  if p_end_date < p_start_date then
    raise exception 'End date must be after start date';
  end if;
  
  -- Create trip
  insert into public.trips (
    user_id,
    name,
    destination,
    start_date,
    end_date,
    status,
    travelers
  )
  values (
    current_user_id,
    p_name,
    p_destination,
    p_start_date,
    p_end_date,
    'planning',
    1
  )
  returning id into new_trip_id;
  
  return new_trip_id;
end;
$$;
```

---

### Example 4: Archive Old Trips

Marks trips as archived if they ended more than 30 days ago.

```sql
create or replace function public.archive_old_trips()
returns integer
language plpgsql
security invoker
set search_path = ''
volatile
as $$
declare
  archived_count integer;
begin
  update public.trips
  set status = 'archived'
  where user_id = auth.uid()
    and end_date < current_date - interval '30 days'
    and status != 'archived';
  
  get diagnostics archived_count = row_count;
  
  return archived_count;
end;
$$;
```

---

### Example 5: Calculate Trip Budget

Calculates total budget for a trip with optional currency conversion.

```sql
create or replace function public.calculate_trip_budget(
  p_trip_id uuid,
  p_currency text default 'USD'
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
stable
as $$
declare
  result jsonb;
  total_places numeric;
  total_activities numeric;
  total_transport numeric;
  grand_total numeric;
begin
  -- Verify user owns the trip
  if not exists (
    select 1 from public.trips
    where id = p_trip_id and user_id = auth.uid()
  ) then
    raise exception 'Trip not found or access denied';
  end if;
  
  -- Calculate totals by category
  select 
    coalesce(sum(case when category = 'accommodation' then price else 0 end), 0),
    coalesce(sum(case when category = 'activity' then price else 0 end), 0),
    coalesce(sum(case when category = 'transport' then price else 0 end), 0)
  into total_places, total_activities, total_transport
  from public.places
  where trip_id = p_trip_id;
  
  grand_total := total_places + total_activities + total_transport;
  
  -- Build result
  result := jsonb_build_object(
    'currency', p_currency,
    'accommodation', total_places,
    'activities', total_activities,
    'transport', total_transport,
    'total', grand_total
  );
  
  return result;
end;
$$;
```

---

### Example 6: Trigger - Update Trip Statistics

Automatically updates trip statistics when places are added/removed.

```sql
create or replace function public.update_trip_statistics()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_trip_id uuid;
  v_place_count integer;
  v_total_budget numeric;
begin
  -- Determine which trip to update
  if tg_op = 'DELETE' then
    v_trip_id := old.trip_id;
  else
    v_trip_id := new.trip_id;
  end if;
  
  -- Calculate statistics
  select 
    count(*),
    coalesce(sum(price), 0)
  into v_place_count, v_total_budget
  from public.places
  where trip_id = v_trip_id;
  
  -- Update trip
  update public.trips
  set 
    place_count = v_place_count,
    total_budget = v_total_budget,
    updated_at = now()
  where id = v_trip_id;
  
  -- Return appropriate record
  if tg_op = 'DELETE' then
    return old;
  else
    return new;
  end if;
end;
$$;

create trigger update_trip_statistics_trigger
after insert or update or delete on public.places
for each row
execute function public.update_trip_statistics();
```

---

### Example 7: Search Trips

Full-text search across trips with ranking.

```sql
create or replace function public.search_trips(search_query text)
returns table (
  trip_id uuid,
  trip_name text,
  destination text,
  relevance real
)
language plpgsql
security invoker
set search_path = ''
stable
as $$
begin
  return query
  select 
    t.id,
    t.name,
    t.destination,
    ts_rank(
      to_tsvector('english', coalesce(t.name, '') || ' ' || coalesce(t.destination, '') || ' ' || coalesce(t.description, '')),
      plainto_tsquery('english', search_query)
    ) as relevance
  from public.trips t
  where t.user_id = auth.uid()
    and (
      to_tsvector('english', coalesce(t.name, '') || ' ' || coalesce(t.destination, '') || ' ' || coalesce(t.description, ''))
      @@ plainto_tsquery('english', search_query)
    )
  order by relevance desc;
end;
$$;
```

---

### Example 8: Get Shared Trip Access

Returns users who have access to a shared trip.

```sql
create or replace function public.get_trip_collaborators(p_trip_id uuid)
returns table (
  user_id uuid,
  user_email text,
  permission_level text,
  shared_at timestamptz
)
language plpgsql
security invoker
set search_path = ''
stable
as $$
begin
  -- Verify user owns or has access to the trip
  if not exists (
    select 1 from public.trips
    where id = p_trip_id and user_id = auth.uid()
  ) then
    raise exception 'Trip not found or access denied';
  end if;
  
  return query
  select 
    ts.collaborator_id,
    u.email,
    ts.permission_level,
    ts.created_at
  from public.trip_shares ts
  join public.users u on u.id = ts.collaborator_id
  where ts.trip_id = p_trip_id;
end;
$$;
```

---

### Example 9: Validate Trip Budget

Checks if a trip's total expenses exceed the budget.

```sql
create or replace function public.validate_trip_budget(p_trip_id uuid)
returns jsonb
language plpgsql
security invoker
set search_path = ''
stable
as $$
declare
  v_budget numeric;
  v_total_expenses numeric;
  v_remaining numeric;
  v_is_over_budget boolean;
begin
  -- Get trip budget and calculate expenses
  select 
    t.budget,
    coalesce(sum(p.price), 0)
  into v_budget, v_total_expenses
  from public.trips t
  left join public.places p on p.trip_id = t.id
  where t.id = p_trip_id
    and t.user_id = auth.uid()
  group by t.budget;
  
  if v_budget is null then
    raise exception 'Trip not found or no budget set';
  end if;
  
  v_remaining := v_budget - v_total_expenses;
  v_is_over_budget := v_total_expenses > v_budget;
  
  return jsonb_build_object(
    'budget', v_budget,
    'expenses', v_total_expenses,
    'remaining', v_remaining,
    'is_over_budget', v_is_over_budget,
    'percentage_used', round((v_total_expenses / v_budget * 100)::numeric, 2)
  );
end;
$$;
```

---

### Example 10: Security Definer Function (Special Case)

Creates an audit log entry that users shouldn't directly access.

```sql
create or replace function public.log_trip_access(
  p_trip_id uuid,
  p_action text
)
returns void
language plpgsql
security definer  -- ⚠️ Special case: needs elevated privileges
set search_path = ''
volatile
as $$
begin
  -- Insert into audit log table (users don't have direct access)
  insert into private.audit_log (
    user_id,
    trip_id,
    action,
    timestamp
  )
  values (
    auth.uid(),
    p_trip_id,
    p_action,
    now()
  );
end;
$$;

-- Grant execute to authenticated users
grant execute on function public.log_trip_access(uuid, text) to authenticated;

-- Note: This function uses SECURITY DEFINER because:
-- 1. Users don't have direct INSERT access to private.audit_log
-- 2. We want to ensure audit logs are tamper-proof
-- 3. The function is simple and well-controlled
```

---

## Function Return Types

### Scalar Returns

Returns a single value:

```sql
create or replace function public.get_trip_count()
returns integer
-- ...
```

---

### Table Returns

Returns multiple rows and columns:

```sql
create or replace function public.get_upcoming_trips()
returns table (
  id uuid,
  name text,
  start_date date
)
-- ...
```

---

### SETOF Returns

Returns multiple rows of a specific type:

```sql
create or replace function public.get_all_trips()
returns setof public.trips
language sql
security invoker
set search_path = ''
stable
as $$
  select * from public.trips where user_id = auth.uid();
$$;
```

---

### JSON/JSONB Returns

Returns structured data:

```sql
create or replace function public.get_trip_stats()
returns jsonb
language plpgsql
security invoker
set search_path = ''
stable
as $$
declare
  stats jsonb;
begin
  select jsonb_build_object(
    'total_trips', count(*),
    'planned', count(*) filter (where status = 'planning'),
    'completed', count(*) filter (where status = 'completed')
  )
  into stats
  from public.trips
  where user_id = auth.uid();
  
  return stats;
end;
$$;
```

---

## Error Handling

### Basic Error Handling

```sql
create or replace function public.delete_trip(p_trip_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
volatile
as $$
begin
  if not exists (
    select 1 from public.trips
    where id = p_trip_id and user_id = auth.uid()
  ) then
    raise exception 'Trip not found or access denied';
  end if;
  
  delete from public.trips where id = p_trip_id;
end;
$$;
```

---

### Advanced Error Handling with EXCEPTION

```sql
create or replace function public.safe_create_trip(
  p_name text,
  p_destination text
)
returns uuid
language plpgsql
security invoker
set search_path = ''
volatile
as $$
declare
  new_trip_id uuid;
begin
  begin
    insert into public.trips (user_id, name, destination)
    values (auth.uid(), p_name, p_destination)
    returning id into new_trip_id;
    
    return new_trip_id;
  exception
    when unique_violation then
      raise exception 'Trip with this name already exists';
    when foreign_key_violation then
      raise exception 'Invalid user reference';
    when others then
      raise exception 'Failed to create trip: %', sqlerrm;
  end;
end;
$$;
```

---

## Performance Optimization

### Use SQL Language for Simple Functions

SQL functions are faster than PL/pgSQL for simple operations:

#### ❌ Less Efficient (PL/pgSQL)

```sql
create or replace function public.get_trip_name(p_trip_id uuid)
returns text
language plpgsql
security invoker
set search_path = ''
stable
as $$
declare
  trip_name text;
begin
  select name into trip_name
  from public.trips
  where id = p_trip_id;
  
  return trip_name;
end;
$$;
```

#### ✅ More Efficient (SQL)

```sql
create or replace function public.get_trip_name(p_trip_id uuid)
returns text
language sql
security invoker
set search_path = ''
stable
as $$
  select name from public.trips where id = p_trip_id;
$$;
```

---

### Avoid Unnecessary Queries

Cache values instead of re-querying:

#### ❌ Inefficient

```sql
create or replace function public.process_trip(p_trip_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
volatile
as $$
begin
  -- Queries trips table 3 times!
  update public.places set trip_name = (select name from public.trips where id = p_trip_id);
  update public.places set trip_destination = (select destination from public.trips where id = p_trip_id);
  update public.places set trip_dates = (select start_date || ' - ' || end_date from public.trips where id = p_trip_id);
end;
$$;
```

#### ✅ Efficient

```sql
create or replace function public.process_trip(p_trip_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
volatile
as $$
declare
  v_trip record;
begin
  -- Query once, use multiple times
  select name, destination, start_date, end_date
  into v_trip
  from public.trips
  where id = p_trip_id;
  
  update public.places
  set 
    trip_name = v_trip.name,
    trip_destination = v_trip.destination,
    trip_dates = v_trip.start_date || ' - ' || v_trip.end_date
  where trip_id = p_trip_id;
end;
$$;
```

---

## Testing Functions

### Using psql

```sql
-- Test basic function
select public.get_user_trip_count();

-- Test function with parameters
select * from public.get_trip_summary('123e4567-e89b-12d3-a456-426614174000');

-- Test as different user (locally)
set role authenticated;
set request.jwt.claims.sub to 'user-uuid-here';
select public.get_user_trip_count();
reset role;
```

---

### Using Supabase Client

```typescript
// Call function from TypeScript
const { data, error } = await supabase.rpc('get_user_trip_count');

// Call function with parameters
const { data, error } = await supabase.rpc('get_trip_summary', {
  p_trip_id: '123e4567-e89b-12d3-a456-426614174000'
});

// Call function that returns table
const { data, error } = await supabase.rpc('search_trips', {
  search_query: 'paris'
});
```

---

## Common Patterns

### Pattern 1: Get User-Specific Data

```sql
create or replace function public.get_user_[resource]()
returns table (...)
language plpgsql
security invoker
set search_path = ''
stable
as $$
begin
  return query
  select [columns]
  from public.[table]
  where user_id = auth.uid();
end;
$$;
```

---

### Pattern 2: Create with Validation

```sql
create or replace function public.create_[resource](
  p_param1 type1,
  p_param2 type2
)
returns uuid
language plpgsql
security invoker
set search_path = ''
volatile
as $$
declare
  new_id uuid;
begin
  -- Validate
  if [validation_condition] then
    raise exception 'Validation failed';
  end if;
  
  -- Create
  insert into public.[table] (user_id, col1, col2)
  values (auth.uid(), p_param1, p_param2)
  returning id into new_id;
  
  return new_id;
end;
$$;
```

---

### Pattern 3: Update with Ownership Check

```sql
create or replace function public.update_[resource](
  p_id uuid,
  p_param1 type1
)
returns void
language plpgsql
security invoker
set search_path = ''
volatile
as $$
begin
  -- Verify ownership
  if not exists (
    select 1 from public.[table]
    where id = p_id and user_id = auth.uid()
  ) then
    raise exception 'Resource not found or access denied';
  end if;
  
  -- Update
  update public.[table]
  set col1 = p_param1, updated_at = now()
  where id = p_id;
end;
$$;
```

---

### Pattern 4: Aggregate Statistics

```sql
create or replace function public.get_[resource]_stats()
returns jsonb
language plpgsql
security invoker
set search_path = ''
stable
as $$
declare
  stats jsonb;
begin
  select jsonb_build_object(
    'total', count(*),
    'category1', count(*) filter (where condition1),
    'category2', count(*) filter (where condition2)
  )
  into stats
  from public.[table]
  where user_id = auth.uid();
  
  return stats;
end;
$$;
```

---

## Quick Reference Checklist

### Before Creating Function

- [ ] Determine function purpose
- [ ] Choose appropriate return type
- [ ] Decide on SECURITY INVOKER vs DEFINER
- [ ] Determine volatility (IMMUTABLE, STABLE, VOLATILE)
- [ ] Plan error handling

### Creating Function

- [ ] Use lowercase SQL
- [ ] Set `search_path = ''`
- [ ] Use fully qualified names
- [ ] Use explicit parameter types
- [ ] Add error handling
- [ ] Include validation
- [ ] Document complex logic
- [ ] Choose appropriate language (SQL vs PL/pgSQL)

### After Creating Function

- [ ] Test with different inputs
- [ ] Test with edge cases
- [ ] Test with both anon and authenticated users
- [ ] Verify performance with EXPLAIN ANALYZE
- [ ] Grant appropriate permissions
- [ ] Document function purpose

---

## 🔗 Related Documentation

- **[Creating Migrations](/docs/supabase/03-creating-migrations.md)** - How to add functions in migrations
- **[Creating RLS Policies](/docs/supabase/04-creating-rls-policies.md)** - Using functions in RLS policies
- **[Postgres SQL Style Guide](/docs/supabase/02-postgres-sql-style-guide.md)** - SQL coding standards

---

## 📚 Additional Resources

### Official Documentation
- [PostgreSQL Functions](https://www.postgresql.org/docs/current/sql-createfunction.html)
- [Supabase Database Functions](https://supabase.com/docs/guides/database/functions)
- [PostgreSQL PL/pgSQL](https://www.postgresql.org/docs/current/plpgsql.html)

---

**Status:** Required for all database functions  
**Last Updated:** December 20, 2024  
**Maintained by:** Database Team
