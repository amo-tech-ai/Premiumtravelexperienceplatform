# Stage 2 — Advanced Features Schema

**Stage:** 2 of 5  
**Purpose:** Enhanced product capabilities and collaboration  
**Timeline:** Week 3-4  
**Dependencies:** Stage 1 (Core)  
**Status:** 🟡 Important for engagement

---

## Overview

Stage 2 extends the core schema with advanced features: saved places, collections, trip collaboration, group voting, and tagging.

**Tables:** 6  
**Estimated rows (10K users, 1 year):** ~200K  
**Storage:** ~100 MB

---

## Tables

### saved_places
**Purpose:** User's personal collection of favorite places

```sql
create table public.saved_places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  location_id uuid references public.locations(id) on delete set null,
  name text not null,
  category text not null default 'other',
  notes text,
  rating numeric(2, 1) check (rating >= 0 and rating <= 5),
  visited boolean default false,
  visited_date date,
  photos jsonb default '[]'::jsonb,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_saved_places_user_id on public.saved_places(user_id);
create index idx_saved_places_location_id on public.saved_places(location_id);
create index idx_saved_places_category on public.saved_places(category);
```

---

### collections
**Purpose:** Organize saved places into themed lists

```sql
create table public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  icon text,
  color text,
  is_public boolean default false,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_collections_user_id on public.collections(user_id);
create index idx_collections_public on public.collections(is_public) where is_public = true;
```

---

### collection_items
**Purpose:** Many-to-many: collections ↔ saved_places

```sql
create table public.collection_items (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections(id) on delete cascade,
  saved_place_id uuid not null references public.saved_places(id) on delete cascade,
  order_index integer not null default 0,
  notes text,
  created_at timestamptz default now(),
  unique(collection_id, saved_place_id)
);

create index idx_collection_items_collection_id on public.collection_items(collection_id);
create index idx_collection_items_saved_place_id on public.collection_items(saved_place_id);
create index idx_collection_items_order on public.collection_items(collection_id, order_index);
```

---

### collaborators
**Purpose:** Share trips with other users

```sql
create table public.collaborators (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  invited_by uuid not null references auth.users(id) on delete cascade,
  role text not null default 'viewer' check (role in ('owner', 'editor', 'viewer')),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  can_edit boolean default false,
  can_invite boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(trip_id, user_id)
);

create index idx_collaborators_trip_id on public.collaborators(trip_id);
create index idx_collaborators_user_id on public.collaborators(user_id);
create index idx_collaborators_status on public.collaborators(status);
```

---

### votes
**Purpose:** Group decision-making on trip items

```sql
create table public.votes (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  trip_item_id uuid references public.trip_items(id) on delete cascade,
  saved_place_id uuid references public.saved_places(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  vote_type text not null check (vote_type in ('up', 'down', 'favorite')),
  created_at timestamptz default now(),
  unique(trip_item_id, user_id, vote_type),
  unique(saved_place_id, user_id, vote_type),
  check (
    (trip_item_id is not null and saved_place_id is null) or
    (trip_item_id is null and saved_place_id is not null)
  )
);

create index idx_votes_trip_id on public.votes(trip_id);
create index idx_votes_trip_item_id on public.votes(trip_item_id);
create index idx_votes_user_id on public.votes(user_id);
```

---

### tags
**Purpose:** Flexible labeling system

```sql
create table public.tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resource_type text not null check (resource_type in ('trip', 'trip_item', 'saved_place', 'collection')),
  resource_id uuid not null,
  tag_name text not null,
  color text,
  created_at timestamptz default now(),
  unique(user_id, resource_type, resource_id, tag_name)
);

create index idx_tags_user_id on public.tags(user_id);
create index idx_tags_resource on public.tags(resource_type, resource_id);
create index idx_tags_name on public.tags(tag_name);
```

---

## Relationships

See `/docs/supabase/schema/diagrams/erd-advanced.mmd`

**Key Relationships:**
- Users → Saved Places (1:N)
- Users → Collections (1:N)
- Collections → Saved Places (N:M via collection_items)
- Trips → Collaborators (1:N)
- Users → Collaborators (1:N)
- Trip Items → Votes (1:N)
- Saved Places → Votes (1:N)
- Any Resource → Tags (1:N)

---

## RLS Strategy

### saved_places

```sql
alter table public.saved_places enable row level security;

create policy "Users can view their own saved places"
  on public.saved_places for select
  to authenticated
  using ( user_id = auth.uid() );

create policy "Users can create their own saved places"
  on public.saved_places for insert
  to authenticated
  with check ( user_id = auth.uid() );

create policy "Users can update their own saved places"
  on public.saved_places for update
  to authenticated
  using ( user_id = auth.uid() )
  with check ( user_id = auth.uid() );

create policy "Users can delete their own saved places"
  on public.saved_places for delete
  to authenticated
  using ( user_id = auth.uid() );
```

---

### collections

```sql
alter table public.collections enable row level security;

create policy "Users can view their own collections"
  on public.collections for select
  to authenticated
  using ( user_id = auth.uid() );

create policy "Users can view public collections"
  on public.collections for select
  to authenticated
  using ( is_public = true );

create policy "Users can create their own collections"
  on public.collections for insert
  to authenticated
  with check ( user_id = auth.uid() );

create policy "Users can update their own collections"
  on public.collections for update
  to authenticated
  using ( user_id = auth.uid() )
  with check ( user_id = auth.uid() );

create policy "Users can delete their own collections"
  on public.collections for delete
  to authenticated
  using ( user_id = auth.uid() );
```

---

### collaborators

```sql
alter table public.collaborators enable row level security;

create policy "Users can view collaborators for their trips"
  on public.collaborators for select
  to authenticated
  using (
    trip_id in (
      select id from public.trips where user_id = auth.uid()
    )
    or user_id = auth.uid()
  );

create policy "Trip owners can invite collaborators"
  on public.collaborators for insert
  to authenticated
  with check (
    trip_id in (
      select id from public.trips where user_id = auth.uid()
    )
  );

create policy "Collaborators can update their own status"
  on public.collaborators for update
  to authenticated
  using ( user_id = auth.uid() )
  with check ( user_id = auth.uid() );

create policy "Trip owners can remove collaborators"
  on public.collaborators for delete
  to authenticated
  using (
    trip_id in (
      select id from public.trips where user_id = auth.uid()
    )
  );
```

---

### votes

```sql
alter table public.votes enable row level security;

create policy "Users can view votes for accessible trips"
  on public.votes for select
  to authenticated
  using (
    trip_id in (
      select t.id from public.trips t
      left join public.collaborators c on c.trip_id = t.id
      where t.user_id = auth.uid() or c.user_id = auth.uid()
    )
  );

create policy "Collaborators can create votes"
  on public.votes for insert
  to authenticated
  with check (
    user_id = auth.uid() and
    trip_id in (
      select t.id from public.trips t
      left join public.collaborators c on c.trip_id = t.id
      where t.user_id = auth.uid() or c.user_id = auth.uid()
    )
  );

create policy "Users can update their own votes"
  on public.votes for update
  to authenticated
  using ( user_id = auth.uid() )
  with check ( user_id = auth.uid() );

create policy "Users can delete their own votes"
  on public.votes for delete
  to authenticated
  using ( user_id = auth.uid() );
```

---

## Edge Functions

### invite-collaborator

```typescript
// supabase/functions/invite-collaborator/index.ts
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

Deno.serve(async (req: Request) => {
  const { trip_id, email, role } = await req.json();
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  
  // Find user by email
  const { data: invitee } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();
  
  if (!invitee) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
  }
  
  // Create collaboration
  const { data, error } = await supabase
    .from('collaborators')
    .insert({
      trip_id,
      user_id: invitee.id,
      invited_by: (await supabase.auth.getUser()).data.user!.id,
      role,
      status: 'pending'
    })
    .select()
    .single();
  
  // Send email notification
  // ... (use Resend or similar)
  
  return new Response(JSON.stringify(data));
});
```

---

## Realtime Usage

```sql
-- Enable realtime for collaboration
alter publication supabase_realtime add table public.collaborators;
alter publication supabase_realtime add table public.votes;
```

**Client subscription:**
```typescript
const collaboratorsChannel = supabase
  .channel('trip-collaborators')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'collaborators',
      filter: `trip_id=eq.${tripId}`
    },
    (payload) => console.log('Collaborator update:', payload)
  )
  .subscribe();
```

---

## Migration Notes

```bash
# Add schema files
supabase/schemas/004_advanced_tables.sql
supabase/schemas/005_advanced_rls.sql

# Generate migration
supabase stop
supabase db diff -f advanced_features
supabase start
```

---

## 🔗 Related Documentation

- **[Stage 1 - Core Schema](/docs/supabase/schema/01-core-schema.md)**
- **[Stage 3 - AI Schema](/docs/supabase/schema/03-ai-agents-schema.md)**

---

**Status:** ✅ Ready for implementation  
**Dependencies:** Stage 1  
**Next Stage:** AI Agents (Stage 3)
