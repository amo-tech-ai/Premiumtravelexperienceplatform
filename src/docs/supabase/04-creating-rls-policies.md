# Creating Row Level Security (RLS) Policies

**Date:** December 20, 2024  
**Purpose:** Complete guide for creating Supabase RLS policies  
**Compliance:** Required for all database security

---

## 🎯 Overview

You're a Supabase Postgres expert in writing row level security policies. Your purpose is to generate a policy with the constraints given by the user. You should first retrieve schema information to write policies for, usually the 'public' schema.

This document provides the complete guidelines for creating Row Level Security (RLS) policies in the Trip Operating System using Supabase.

---

## Output Instructions

The output should use the following instructions:

- ✅ The generated SQL must be **valid SQL**.
- ✅ You can use only **CREATE POLICY or ALTER POLICY** queries, no other queries are allowed.
- ✅ Always use **double apostrophe** in SQL strings (e.g. `'Night''s watch'`)
- ✅ You can add **short explanations** to your messages.
- ✅ The result should be a **valid markdown**. The SQL code should be wrapped in ``` (including sql language tag).
- ✅ Always use **`auth.uid()`** instead of `current_user`.
- ✅ **SELECT** policies should always have **USING** but not WITH CHECK
- ✅ **INSERT** policies should always have **WITH CHECK** but not USING
- ✅ **UPDATE** policies should always have **WITH CHECK** and most often have **USING**
- ✅ **DELETE** policies should always have **USING** but not WITH CHECK
- ✅ Don't use **`FOR ALL`**. Instead separate into 4 separate policies for select, insert, update, and delete.
- ✅ The policy name should be **short but detailed text** explaining the policy, enclosed in **double quotes**.
- ✅ Always put **explanations as separate text**. Never use inline SQL comments.
- ✅ If the user asks for something that's not related to SQL policies, explain to the user that you can only help with policies.
- ✅ **Discourage `RESTRICTIVE` policies** and encourage **`PERMISSIVE` policies**, and explain why.

---

## Policy Template Example

The output should look like this:

```sql
CREATE POLICY "My descriptive policy." ON books FOR INSERT to authenticated USING ( (select auth.uid()) = author_id ) WITH ( true );
```

---

## Authenticated and Unauthenticated Roles

Since you are running in a Supabase environment, take note of these Supabase-specific additions below.

Supabase maps every request to one of the roles:

- **`anon`**: an unauthenticated request (the user is not logged in)
- **`authenticated`**: an authenticated request (the user is logged in)

These are actually [Postgres Roles](/docs/guides/database/postgres/roles). You can use these roles within your Policies using the `TO` clause:

### Example: Public Access

```sql
create policy "Profiles are viewable by everyone"
on profiles
for select
to authenticated, anon
using ( true );

-- OR

create policy "Public profiles are viewable only by authenticated users"
on profiles
for select
to authenticated
using ( true );
```

### ⚠️ Correct Syntax Order

Note that `for ...` must be added **after the table** but **before the roles**. `to ...` must be added **after** `for ...`:

#### ❌ Incorrect

```sql
create policy "Public profiles are viewable only by authenticated users"
on profiles
to authenticated
for select
using ( true );
```

#### ✅ Correct

```sql
create policy "Public profiles are viewable only by authenticated users"
on profiles
for select
to authenticated
using ( true );
```

---

## Multiple Operations

PostgreSQL policies do not support specifying multiple operations in a single FOR clause. You need to create **separate policies for each operation**.

### ❌ Incorrect

```sql
create policy "Profiles can be created and deleted by any user"
on profiles
for insert, delete -- cannot create a policy on multiple operators
to authenticated
with check ( true )
using ( true );
```

### ✅ Correct

```sql
create policy "Profiles can be created by any user"
on profiles
for insert
to authenticated
with check ( true );

create policy "Profiles can be deleted by any user"
on profiles
for delete
to authenticated
using ( true );
```

---

## Policy Operation Rules

### SELECT Policies

**Rules:**
- ✅ Always use **USING**
- ❌ Never use **WITH CHECK**

**Example:**

```sql
create policy "Users can view their own trips"
on trips
for select
to authenticated
using ( (select auth.uid()) = user_id );
```

---

### INSERT Policies

**Rules:**
- ✅ Always use **WITH CHECK**
- ❌ Never use **USING**

**Example:**

```sql
create policy "Users can create their own trips"
on trips
for insert
to authenticated
with check ( (select auth.uid()) = user_id );
```

---

### UPDATE Policies

**Rules:**
- ✅ Always use **WITH CHECK**
- ✅ Most often use **USING**

**Example:**

```sql
create policy "Users can update their own trips"
on trips
for update
to authenticated
using ( (select auth.uid()) = user_id )
with check ( (select auth.uid()) = user_id );
```

---

### DELETE Policies

**Rules:**
- ✅ Always use **USING**
- ❌ Never use **WITH CHECK**

**Example:**

```sql
create policy "Users can delete their own trips"
on trips
for delete
to authenticated
using ( (select auth.uid()) = user_id );
```

---

## Helper Functions

Supabase provides some helper functions that make it easier to write Policies.

### `auth.uid()`

Returns the **ID of the user** making the request.

**Example:**

```sql
create policy "Users can access their own data"
on users
for select
to authenticated
using ( (select auth.uid()) = id );
```

---

### `auth.jwt()`

Returns the **JWT of the user** making the request. Anything that you store in the user's `raw_app_meta_data` column or the `raw_user_meta_data` column will be accessible using this function. It's important to know the distinction between these two:

- **`raw_user_meta_data`** - can be updated by the authenticated user using the `supabase.auth.update()` function. It is **not** a good place to store authorization data.
- **`raw_app_meta_data`** - **cannot** be updated by the user, so it's a **good place** to store authorization data.

#### Team-Based Authorization Example

The `auth.jwt()` function is extremely versatile. For example, if you store some team data inside `app_metadata`, you can use it to determine whether a particular user belongs to a team. For example, if this was an array of IDs:

```sql
create policy "User is in team"
on my_table
for select
to authenticated
using ( team_id in (select auth.jwt() -> 'app_metadata' -> 'teams'));
```

---

### Multi-Factor Authentication (MFA)

The `auth.jwt()` function can be used to check for [Multi-Factor Authentication](/docs/guides/auth/auth-mfa#enforce-rules-for-mfa-logins). For example, you could restrict a user from updating their profile unless they have at least 2 levels of authentication (Assurance Level 2):

```sql
create policy "Restrict updates."
on profiles
as restrictive
for update
to authenticated using (
  (select auth.jwt()->>'aal') = 'aal2'
);
```

---

## PERMISSIVE vs RESTRICTIVE Policies

### ✅ Prefer PERMISSIVE (Default)

**PERMISSIVE policies** are the default and are generally recommended. Multiple PERMISSIVE policies are combined with **OR** logic - if **any** policy allows the action, it's permitted.

**Example:**

```sql
create policy "Users can view their own trips"
on trips
for select
to authenticated
using ( (select auth.uid()) = user_id );

create policy "Users can view shared trips"
on trips
for select
to authenticated
using ( shared = true );
```

With PERMISSIVE policies, a user can view their trip **OR** any shared trip.

---

### ⚠️ Use RESTRICTIVE Sparingly

**RESTRICTIVE policies** are combined with **AND** logic - **all** policies must allow the action. This can create unexpected behavior and make policies harder to reason about.

**Why discourage RESTRICTIVE:**
- ❌ More complex to understand
- ❌ Harder to debug
- ❌ Can create unexpected denials
- ❌ Difficult to combine with PERMISSIVE policies

**When to use RESTRICTIVE:**
- ✅ Adding additional security layer (like MFA requirement)
- ✅ Enforcing global constraints

**Example of valid RESTRICTIVE use:**

```sql
create policy "Require MFA for sensitive operations"
on sensitive_data
as restrictive
for update
to authenticated
using ( (select auth.jwt()->>'aal') = 'aal2' );
```

---

## RLS Performance Recommendations

Every authorization system has an impact on performance. While row level security is powerful, the performance impact is important to keep in mind. This is especially true for queries that scan every row in a table - like many `select` operations, including those using limit, offset, and ordering.

Based on a series of [tests](https://github.com/GaryAustin1/RLS-Performance), we have a few recommendations for RLS:

---

### 1. Add Indexes

Make sure you've added [indexes](/docs/guides/database/postgres/indexes) on any columns used within the Policies which are not already indexed (or primary keys). For a Policy like this:

```sql
create policy "Users can access their own records" on test_table
to authenticated
using ( (select auth.uid()) = user_id );
```

You can add an index like:

```sql
create index userid
on test_table
using btree (user_id);
```

---

### 2. Call Functions with `select`

You can use `select` statement to improve policies that use functions. For example, instead of this:

#### ❌ Less Efficient

```sql
create policy "Users can access their own records" on test_table
to authenticated
using ( auth.uid() = user_id );
```

#### ✅ More Efficient

```sql
create policy "Users can access their own records" on test_table
to authenticated
using ( (select auth.uid()) = user_id );
```

**Why this works:**

This method works well for JWT functions like `auth.uid()` and `auth.jwt()` as well as `security definer` Functions. Wrapping the function causes an `initPlan` to be run by the Postgres optimizer, which allows it to "cache" the results per-statement, rather than calling the function on each row.

**⚠️ Caution:** You can only use this technique if the results of the query or function do not change based on the row data.

---

### 3. Minimize Joins

You can often rewrite your Policies to avoid joins between the source and the target table. Instead, try to organize your policy to fetch all the relevant data from the target table into an array or set, then you can use an `IN` or `ANY` operation in your filter.

#### ❌ Slow (with join)

This is an example of a slow policy which joins the source `test_table` to the target `team_user`:

```sql
create policy "Users can access records belonging to their teams" on test_table
to authenticated
using (
  (select auth.uid()) in (
    select user_id
    from team_user
    where team_user.team_id = team_id -- joins to the source "test_table.team_id"
  )
);
```

#### ✅ Fast (without join)

We can rewrite this to avoid this join, and instead select the filter criteria into a set:

```sql
create policy "Users can access records belonging to their teams" on test_table
to authenticated
using (
  team_id in (
    select team_id
    from team_user
    where user_id = (select auth.uid()) -- no join
  )
);
```

---

### 4. Specify Roles in Your Policies

Always use the Role inside your policies, specified by the `TO` operator. For example, instead of this query:

#### ❌ Less Efficient

```sql
create policy "Users can access their own records" on rls_test
using ( auth.uid() = user_id );
```

#### ✅ More Efficient

```sql
create policy "Users can access their own records" on rls_test
to authenticated
using ( (select auth.uid()) = user_id );
```

**Why this works:**

This prevents the policy `( (select auth.uid()) = user_id )` from running for any `anon` users, since the execution stops at the `to authenticated` step.

---

## Complete Example: Trips Table

Here's a complete example showing all RLS policies for the `trips` table:

### Enable RLS

```sql
alter table public.trips enable row level security;
```

### SELECT Policy

Users can view their own trips:

```sql
create policy "Users can view their own trips"
on public.trips
for select
to authenticated
using ( (select auth.uid()) = user_id );
```

Anonymous users cannot view any trips:

```sql
create policy "Anonymous users cannot view trips"
on public.trips
for select
to anon
using ( false );
```

### INSERT Policy

Users can create trips assigned to themselves:

```sql
create policy "Users can create their own trips"
on public.trips
for insert
to authenticated
with check ( (select auth.uid()) = user_id );
```

Anonymous users cannot create trips:

```sql
create policy "Anonymous users cannot create trips"
on public.trips
for insert
to anon
with check ( false );
```

### UPDATE Policy

Users can update their own trips:

```sql
create policy "Users can update their own trips"
on public.trips
for update
to authenticated
using ( (select auth.uid()) = user_id )
with check ( (select auth.uid()) = user_id );
```

Anonymous users cannot update trips:

```sql
create policy "Anonymous users cannot update trips"
on public.trips
for update
to anon
using ( false );
```

### DELETE Policy

Users can delete their own trips:

```sql
create policy "Users can delete their own trips"
on public.trips
for delete
to authenticated
using ( (select auth.uid()) = user_id );
```

Anonymous users cannot delete trips:

```sql
create policy "Anonymous users cannot delete trips"
on public.trips
for delete
to anon
using ( false );
```

---

## Trip Operating System Examples

### Example 1: Shared Trips

Allow users to view trips that have been shared with them:

```sql
create policy "Users can view shared trips"
on public.trips
for select
to authenticated
using (
  (select auth.uid()) in (
    select user_id
    from public.trip_shares
    where trip_id = id
  )
);
```

### Example 2: Public Destinations

Allow anyone to view popular destinations:

```sql
create policy "Anyone can view destinations"
on public.destinations
for select
to authenticated, anon
using ( true );
```

### Example 3: Team Collaboration

Allow team members to collaborate on trips:

```sql
create policy "Team members can edit team trips"
on public.trips
for update
to authenticated
using (
  team_id in (
    select team_id
    from public.team_members
    where user_id = (select auth.uid())
  )
)
with check (
  team_id in (
    select team_id
    from public.team_members
    where user_id = (select auth.uid())
  )
);
```

### Example 4: Budget Constraints

Ensure users cannot create trips over their budget limit:

```sql
create policy "Users cannot exceed budget limit"
on public.trips
for insert
to authenticated
with check (
  budget <= (
    select budget_limit
    from public.user_settings
    where user_id = (select auth.uid())
  )
);
```

### Example 5: Admin Override

Allow admins to view all trips:

```sql
create policy "Admins can view all trips"
on public.trips
for select
to authenticated
using (
  (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);
```

---

## Common Patterns

### Pattern 1: Own Data Only

```sql
create policy "Users can [operation] their own [resource]"
on public.[table]
for [select|insert|update|delete]
to authenticated
[using|with check] ( (select auth.uid()) = user_id );
```

### Pattern 2: Public Read, Authenticated Write

```sql
-- Read policy
create policy "Anyone can view [resource]"
on public.[table]
for select
to authenticated, anon
using ( true );

-- Write policy
create policy "Authenticated users can create [resource]"
on public.[table]
for insert
to authenticated
with check ( true );
```

### Pattern 3: Team-Based Access

```sql
create policy "Team members can [operation] team [resource]"
on public.[table]
for [select|update|delete]
to authenticated
[using|with check] (
  team_id in (
    select team_id
    from public.team_members
    where user_id = (select auth.uid())
  )
);
```

### Pattern 4: Role-Based Access

```sql
create policy "Admins can [operation] all [resource]"
on public.[table]
for [select|update|delete]
to authenticated
[using|with check] (
  (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);
```

---

## Testing RLS Policies

### Local Testing

```sql
-- Test as authenticated user
set role authenticated;
set request.jwt.claims.sub to 'user-uuid-here';

-- Run queries to test policies
select * from trips;

-- Reset
reset role;
```

### Using Supabase Client

```typescript
// Test as authenticated user
const { data, error } = await supabase
  .from('trips')
  .select('*')
  .eq('user_id', userId);

// Should only return user's own trips
```

---

## Quick Reference Checklist

### Before Creating Policies

- [ ] Enable RLS on the table
- [ ] Understand who needs access (anon vs authenticated)
- [ ] Determine what operations are needed (SELECT, INSERT, UPDATE, DELETE)
- [ ] Consider performance implications

### Creating Policies

- [ ] Use correct syntax order (table → for → to → using/with check)
- [ ] Create separate policy for each operation
- [ ] Use descriptive policy names in double quotes
- [ ] Specify role with `to` clause
- [ ] Use `(select auth.uid())` for performance
- [ ] Add indexes on columns used in policies
- [ ] Avoid joins when possible

### After Creating Policies

- [ ] Test with both anon and authenticated users
- [ ] Verify performance with EXPLAIN ANALYZE
- [ ] Document policy purpose
- [ ] Review with security team

---

## 🔗 Related Documentation

- **[Creating Migrations](/docs/supabase/03-creating-migrations.md)** - How to create RLS in migrations
- **[Declarative Schema Best Practices](/docs/supabase/01-declarative-schema-best-practices.md)** - Schema management workflow
- **[Postgres SQL Style Guide](/docs/supabase/02-postgres-sql-style-guide.md)** - SQL coding standards

---

## 📚 Additional Resources

### Official Documentation
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)

---

**Status:** Required for all tables  
**Last Updated:** December 20, 2024  
**Maintained by:** Database Security Team
