# Implementation Order - Step-by-Step Guide

**Recommended order for implementing the Supabase backend**

## Overview

This guide provides a systematic, testable approach to implementing the complete backend system. Each phase builds on the previous, allowing for incremental deployment and testing.

**Total Time Estimate:** 3-4 weeks  
**Team Size:** 1-2 developers  
**Prerequisites:** Supabase CLI, PostgreSQL knowledge, TypeScript/Deno basics

---

## Phase 1: Core Foundation (Week 1)

**Goal:** Set up database, authentication, and basic user management  
**Time:** 5-7 days  
**Priority:** P0 (Blocking)

### Day 1-2: Environment Setup

#### Tasks
- [ ] Install Supabase CLI
- [ ] Initialize local Supabase project
- [ ] Configure environment variables
- [ ] Set up version control for schemas

#### Steps

```bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Initialize project
cd your-project
supabase init

# 3. Start local Supabase
supabase start

# Note the output - you'll need these URLs and keys:
# - API URL: http://localhost:54321
# - GraphQL URL: http://localhost:54321/graphql/v1
# - DB URL: postgresql://postgres:postgres@localhost:54322/postgres
# - Studio URL: http://localhost:54323
# - Inbucket URL: http://localhost:54324
# - anon key: eyJh...
# - service_role key: eyJh...

# 4. Create .env file
cat > .env << EOF
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_key
EOF
```

#### Verification
- [ ] Supabase Studio accessible at http://localhost:54323
- [ ] Can connect to database via psql
- [ ] Environment variables loaded

---

### Day 3: User Profiles & Preferences

#### Tasks
- [ ] Apply profiles schema
- [ ] Apply preferences schema
- [ ] Test auto-profile creation trigger
- [ ] Verify RLS policies

#### Steps

```bash
# 1. Apply schemas
supabase db execute --file supabase/schemas/00-core-profiles.sql
supabase db execute --file supabase/schemas/01-core-preferences.sql

# 2. Test in Supabase Studio SQL Editor
# Create a test user (simulating auth.users)
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'test@example.com',
  '{"name": "Test User"}'::jsonb
);

# 3. Verify profile was auto-created
SELECT * FROM profiles WHERE id = '00000000-0000-0000-0000-000000000001';

# 4. Create preferences
INSERT INTO user_preferences (user_id, favorite_cuisines, travel_style)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  ARRAY['Italian', 'Japanese'],
  ARRAY['foodie', 'culture']
);

# 5. Verify RLS works
SET request.jwt.claims.sub = '00000000-0000-0000-0000-000000000001';
SELECT * FROM profiles; -- Should see only this user's profile
```

#### Verification
- [ ] Profile auto-created on user signup
- [ ] Preferences can be saved
- [ ] RLS prevents cross-user access
- [ ] Triggers update `updated_at` correctly

---

### Day 4-5: Conversations & AI Messages

#### Tasks
- [ ] Apply conversations schema
- [ ] Test conversation creation
- [ ] Test message ordering
- [ ] Verify AI run tracking

#### Steps

```bash
# 1. Apply schema
supabase db execute --file supabase/schemas/02-core-conversations.sql

# 2. Create test conversation
INSERT INTO conversations (user_id, context_type, location_context)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'restaurants',
  '{"city": "Medellín", "lat": 6.2442, "lng": -75.5812}'::jsonb
)
RETURNING id;

# 3. Add messages
INSERT INTO messages (conversation_id, role, content, sequence_number)
VALUES
  ('<conversation_id>', 'user', 'Find Italian restaurants', 1),
  ('<conversation_id>', 'assistant', 'Here are some great options...', 2);

# 4. Verify message count updated
SELECT message_count, last_message_at FROM conversations
WHERE id = '<conversation_id>';

# 5. Track AI run
INSERT INTO ai_runs (
  user_id, conversation_id, agent_type, model, prompt, status
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '<conversation_id>',
  'restaurants',
  'gemini-1.5-flash',
  'Find Italian restaurants',
  'success'
);
```

#### Verification
- [ ] Conversations created successfully
- [ ] Messages ordered by sequence_number
- [ ] Conversation metadata updates on new message
- [ ] AI runs tracked with performance metrics

---

### Day 6-7: Places & Search

#### Tasks
- [ ] Apply places schema
- [ ] Test location creation
- [ ] Test saved places
- [ ] Test nearby search function

#### Steps

```bash
# 1. Apply schema
supabase db execute --file supabase/schemas/03-core-places.sql

# 2. Create test locations
INSERT INTO locations (
  name, category, google_place_id, cuisine_types, latitude, longitude,
  city, rating, price_level, source
)
VALUES
  ('Oci.Mde', 'restaurant', 'ChIJ123', ARRAY['Mediterranean', 'Fusion'],
   6.2088, -75.5672, 'Medellín', 4.8, 3, 'google'),
  ('El Cielo', 'restaurant', 'ChIJ456', ARRAY['Colombian', 'Fine Dining'],
   6.2077, -75.5736, 'Medellín', 4.9, 4, 'google'),
  ('Parque Lleras', 'poi', 'ChIJ789', ARRAY['nightlife', 'dining'],
   6.2088, -75.5672, 'Medellín', 4.5, 2, 'google');

# 3. Save a place
INSERT INTO saved_places (user_id, location_id, is_favorite, notes)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  (SELECT id FROM locations WHERE name = 'Oci.Mde'),
  true,
  'Amazing views and food!'
);

# 4. Test nearby search
SELECT * FROM find_nearby_places(6.2088, -75.5672, 5.0, 'restaurant', 10);

# 5. Create collection
INSERT INTO collections (user_id, name, description)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Medellín Must-Try',
  'Best restaurants in Medellín'
);
```

#### Verification
- [ ] Locations created with geospatial data
- [ ] Saved places work with RLS
- [ ] Nearby search returns correct results
- [ ] Collections organize saved places

---

## Phase 2: Trip Planning (Week 2)

**Goal:** Implement trip and itinerary management  
**Time:** 5-7 days  
**Priority:** P0 (Blocking)

### Day 8-9: Trips & Itinerary

#### Tasks
- [ ] Apply itinerary schema
- [ ] Test trip creation
- [ ] Test itinerary item management
- [ ] Test day-based organization

#### Steps

```bash
# 1. Apply schema
supabase db execute --file supabase/schemas/04-core-itinerary.sql

# 2. Create test trip
INSERT INTO trips (
  user_id, owner_id, title, destination, start_date, end_date, budget
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Medellín Adventure',
  'Medellín, Colombia',
  '2025-02-01',
  '2025-02-05',
  1500.00
)
RETURNING id;

# 3. Add itinerary items
INSERT INTO itinerary_items (
  trip_id, location_id, title, item_type, day_number,
  start_time, end_time, estimated_cost, sort_order
)
VALUES
  -- Day 1
  ('<trip_id>', (SELECT id FROM locations WHERE name = 'Oci.Mde'),
   'Dinner at Oci.Mde', 'restaurant', 1, '19:00', '21:00', 120.00, 1),
  
  -- Day 2
  ('<trip_id>', (SELECT id FROM locations WHERE name = 'El Cielo'),
   'Lunch at El Cielo', 'restaurant', 2, '13:00', '15:00', 150.00, 1),
  
  ('<trip_id>', (SELECT id FROM locations WHERE name = 'Parque Lleras'),
   'Explore Parque Lleras', 'activity', 2, '20:00', '23:00', 50.00, 2);

# 4. Verify order
SELECT day_number, sort_order, title, start_time
FROM itinerary_items
WHERE trip_id = '<trip_id>'
ORDER BY day_number, sort_order;
```

#### Verification
- [ ] Trips created with date validation
- [ ] Items organized by day and order
- [ ] Cost tracking works
- [ ] RLS prevents cross-user access

---

### Day 10-11: Reminders & Collaboration

#### Tasks
- [ ] Test reminder creation
- [ ] Test auto-reminder trigger
- [ ] Test trip collaboration
- [ ] Test collaborator permissions

#### Steps

```bash
# 1. Create manual reminder
INSERT INTO reminders (
  user_id, trip_id, title, reminder_type, remind_at
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '<trip_id>',
  'Pack bags for Medellín',
  'custom',
  '2025-01-31 10:00:00'
);

# 2. Add item with booking needed (auto-creates reminder)
INSERT INTO itinerary_items (
  trip_id, title, item_type, day_number, start_time, booking_status, sort_order
)
VALUES (
  '<trip_id>',
  'Helicopter tour',
  'activity',
  3,
  '10:00',
  'needed',
  1
);

# 3. Verify auto-reminder created
SELECT * FROM reminders WHERE trip_id = '<trip_id>' ORDER BY created_at DESC;

# 4. Add collaborator
INSERT INTO trip_collaborators (trip_id, user_id, role, can_edit)
VALUES (
  '<trip_id>',
  '00000000-0000-0000-0000-000000000002',
  'editor',
  true
);

# 5. Test collaborator access
SET request.jwt.claims.sub = '00000000-0000-0000-0000-000000000002';
SELECT * FROM trips WHERE id = '<trip_id>'; -- Should see trip
```

#### Verification
- [ ] Manual reminders created
- [ ] Auto-reminders trigger on booking items
- [ ] Collaborators can view trips
- [ ] Editor role can modify items

---

### Day 12: Data Migration & Cleanup

#### Tasks
- [ ] Generate migration files
- [ ] Test migration rollback
- [ ] Clean up test data
- [ ] Document schema

#### Steps

```bash
# 1. Stop Supabase
supabase stop

# 2. Generate migration from schema diff
supabase db diff -f core_schema_v1

# This creates: supabase/migrations/YYYYMMDDHHMMSS_core_schema_v1.sql

# 3. Review generated migration
cat supabase/migrations/*_core_schema_v1.sql

# 4. Start Supabase and test
supabase start

# 5. Reset to test migration
supabase db reset

# 6. Verify all tables created
supabase db execute --stdin <<EOF
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
EOF
```

#### Verification
- [ ] Migration file generated correctly
- [ ] Reset applies all migrations
- [ ] No errors in migration
- [ ] All constraints and indexes present

---

## Phase 3: Advanced Features (Week 3)

**Goal:** Implement vector search and automation  
**Time:** 5-7 days  
**Priority:** P1 (Important)

### Day 13-14: Vector Embeddings (pgvector)

#### Tasks
- [ ] Install pgvector extension
- [ ] Apply embeddings schema
- [ ] Create test embeddings
- [ ] Test semantic search

#### Steps

```bash
# 1. Install pgvector (if not already installed)
# On Supabase Cloud, it's pre-installed
# For local, ensure Docker image has it

# 2. Apply schema
supabase db execute --file supabase/schemas/10-advanced-embeddings.sql

# 3. Create test embedding (using mock vector)
# In production, this would come from Gemini API
INSERT INTO embeddings (entity_type, entity_id, content, embedding, model)
VALUES (
  'location',
  (SELECT id FROM locations WHERE name = 'Oci.Mde'),
  'Mediterranean fusion restaurant with amazing city views, perfect for romantic dinners',
  array_fill(0.1, ARRAY[1536])::vector, -- Mock embedding
  'text-embedding-ada-002'
);

# 4. Test semantic search
SELECT * FROM search_locations_semantic(
  array_fill(0.1, ARRAY[1536])::vector, -- Query embedding
  0.7, -- Threshold
  5    -- Limit
);

# 5. Test similar places
SELECT * FROM find_similar_places(
  (SELECT id FROM locations WHERE name = 'Oci.Mde'),
  5
);
```

#### Verification
- [ ] pgvector extension enabled
- [ ] Embeddings table created with vector column
- [ ] HNSW index created
- [ ] Semantic search returns results

---

### Day 15-16: Automation System

#### Tasks
- [ ] Apply automation schema
- [ ] Create test automation rule
- [ ] Test job queue
- [ ] Test job processing

#### Steps

```bash
# 1. Apply schema
supabase db execute --file supabase/schemas/11-advanced-automations.sql

# 2. Create automation rule
INSERT INTO automation_rules (
  user_id, name, trigger_type, trigger_config, actions, schedule_cron
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Daily Event Suggestions',
  'time_based',
  '{"schedule": "0 9 * * *", "timezone": "America/New_York"}'::jsonb,
  '[
    {"type": "ai_suggestion", "config": {"agent": "events", "prompt": "Find events today"}},
    {"type": "send_notification", "config": {"title": "Today''s Events"}}
  ]'::jsonb,
  '0 9 * * *'
);

# 3. Create manual job
INSERT INTO automation_jobs (
  user_id, job_type, payload, status, priority
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'ai_suggestion',
  '{"agent": "events", "prompt": "Find concerts this weekend"}'::jsonb,
  'pending',
  5
);

# 4. Get next job (simulating worker)
SELECT * FROM get_next_automation_job();

# 5. Complete job
UPDATE automation_jobs
SET status = 'success', completed_at = NOW()
WHERE id = '<job_id>';

# 6. Verify rule stats updated
SELECT run_count, success_count, last_run_at
FROM automation_rules
WHERE name = 'Daily Event Suggestions';
```

#### Verification
- [ ] Automation rules created
- [ ] Jobs queued and processed
- [ ] Retry logic works
- [ ] Run stats tracked correctly

---

### Day 17: Integration Testing

#### Tasks
- [ ] Test complete user flow
- [ ] Test cross-table queries
- [ ] Test RLS across relationships
- [ ] Performance testing

#### Steps

```bash
# Complete user flow test
# 1. User signs up → profile created
# 2. User sets preferences
# 3. User chats with AI → conversation + messages
# 4. User saves place → saved_places
# 5. User creates trip → trips
# 6. User adds items → itinerary_items
# 7. System creates reminder → reminders
# 8. User shares trip → trip_collaborators

# Run this SQL transaction:
BEGIN;

-- 1. Create user
INSERT INTO auth.users (id, email) VALUES ('<user_id>', 'flow@test.com');

-- 2. Set preferences (auto-created by trigger, update it)
UPDATE user_preferences
SET favorite_cuisines = ARRAY['Italian'], travel_style = ARRAY['foodie']
WHERE user_id = '<user_id>';

-- 3. Create conversation
INSERT INTO conversations (user_id, context_type)
VALUES ('<user_id>', 'restaurants') RETURNING id;

-- 4-8... (continue flow)

COMMIT;
```

#### Verification
- [ ] All triggers fire correctly
- [ ] RLS policies don't leak data
- [ ] Foreign key constraints enforced
- [ ] No orphaned records

---

## Phase 4: Edge Functions (Week 4)

**Goal:** Deploy AI orchestrator and action endpoints  
**Time:** 5-7 days  
**Priority:** P0 (Blocking)

### Day 18-19: AI Orchestrator Function

#### Tasks
- [ ] Create Edge Function
- [ ] Test locally
- [ ] Deploy to Supabase
- [ ] Test in production

#### Steps

```bash
# 1. Edge function already created at:
# /supabase/functions/ai-orchestrator/index.ts

# 2. Test locally
supabase functions serve ai-orchestrator

# 3. In another terminal, test call
curl -X POST http://localhost:54321/functions/v1/ai-orchestrator \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Find events in Medellín this weekend",
    "mode": "events",
    "context": {
      "location": {"city": "Medellín", "lat": 6.2442, "lng": -75.5812}
    }
  }'

# 4. Deploy
supabase functions deploy ai-orchestrator

# 5. Set secrets
supabase secrets set GEMINI_API_KEY=your_production_key
```

#### Verification
- [ ] Function responds locally
- [ ] AI responses generated
- [ ] Messages saved to database
- [ ] AI runs tracked

---

### Day 20-21: Action Endpoints

#### Tasks
- [ ] Create action functions
- [ ] Test itinerary actions
- [ ] Test favorite actions
- [ ] Test reminder actions

#### Create these functions:

```typescript
// /supabase/functions/actions-itinerary/index.ts
// POST /actions-itinerary
// { action: 'add', tripId, locationId, dayNumber }

// /supabase/functions/actions-favorites/index.ts
// POST /actions-favorites
// { action: 'save', locationId, collectionName }

// /supabase/functions/actions-reminders/index.ts
// POST /actions-reminders
// { action: 'create', tripId, remindAt, title }
```

#### Verification
- [ ] Actions complete successfully
- [ ] Database updated correctly
- [ ] Errors handled gracefully

---

### Day 22: Documentation & Handoff

#### Tasks
- [ ] Complete API documentation
- [ ] Create deployment runbook
- [ ] Write troubleshooting guide
- [ ] Prepare demo

---

## Testing Checklist

### Unit Tests (Schema Level)
- [ ] All triggers fire correctly
- [ ] All RLS policies work
- [ ] All functions return expected results
- [ ] All constraints enforced

### Integration Tests
- [ ] Complete user flows work end-to-end
- [ ] Cross-table queries perform well
- [ ] No data leaks across users
- [ ] Collaborators have correct access

### Performance Tests
- [ ] Queries return in <200ms
- [ ] Vector searches complete in <500ms
- [ ] Job queue processes efficiently
- [ ] No N+1 query problems

### Security Tests
- [ ] RLS prevents unauthorized access
- [ ] SQL injection prevented
- [ ] JWT validation works
- [ ] Service role properly secured

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Migration files reviewed
- [ ] Secrets configured
- [ ] Backup strategy in place

### Deployment
- [ ] Link to production project
- [ ] Push migrations
- [ ] Deploy Edge Functions
- [ ] Set production secrets
- [ ] Verify health checks

### Post-Deployment
- [ ] Monitor error rates
- [ ] Check query performance
- [ ] Verify RLS policies active
- [ ] Test critical user flows

---

**Next Steps:**
1. Start with Phase 1, Day 1
2. Complete each phase before moving to next
3. Test thoroughly at each step
4. Document any deviations from plan

**Estimated Total Time:** 3-4 weeks for full implementation
