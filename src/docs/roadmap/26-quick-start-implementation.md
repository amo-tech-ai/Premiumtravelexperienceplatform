# ⚡ Quick Start Implementation Guide

**For:** Immediate database setup and backend wiring  
**Time:** 2-3 hours to production-ready state  
**Prerequisites:** Supabase project access, admin permissions

---

## 🎯 What We're Fixing

**Current Problem:**
- SQL tables defined but never created
- All data flows through temporary KV store
- No authentication
- AI not connected
- No conversation persistence

**Solution:**
Deploy SQL schema → Update backend → Connect AI → Enable auth

---

## Step 1: Deploy SQL Schema (30 minutes)

### 1.1 Access Supabase SQL Editor

1. Open https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** in left sidebar
4. Click **New query**

### 1.2 Enable Extensions

```sql
-- Copy and paste this, then click RUN
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Verify
SELECT * FROM pg_extension WHERE extname IN ('uuid-ossp', 'vector');
-- Should return 2 rows
```

### 1.3 Run Schema Files

**Execute in this exact order:**

#### File 1: Profiles
```bash
# Copy contents of /supabase/schemas/00-core-profiles.sql
# Paste into SQL Editor
# Click RUN
```

#### File 2: Conversations
```bash
# Copy contents of /supabase/schemas/02-core-conversations.sql
# Paste into SQL Editor
# Click RUN
```

#### File 3: Places
```bash
# Copy contents of /supabase/schemas/03-core-places.sql
# Paste into SQL Editor
# Click RUN
```

#### File 4: Itinerary
```bash
# Copy contents of /supabase/schemas/04-core-itinerary.sql
# Paste into SQL Editor
# Click RUN
```

#### File 5: Embeddings (Optional for Phase 1)
```bash
# Copy contents of /supabase/schemas/10-advanced-embeddings.sql
# Paste into SQL Editor
# Click RUN
```

#### File 6: Automations (Optional for Phase 1)
```bash
# Copy contents of /supabase/schemas/11-advanced-automations.sql
# Paste into SQL Editor
# Click RUN
```

### 1.4 Verify Tables Created

```sql
-- Run this query to verify
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name NOT LIKE 'kv_store%'
ORDER BY table_name;

-- Expected output (at minimum):
-- conversations
-- itinerary_items
-- locations
-- messages
-- profiles
-- saved_places
-- trips
-- collections
-- reminders
-- trip_collaborators
-- ai_runs
```

### 1.5 Seed Demo User

```sql
-- Insert demo user for testing
INSERT INTO profiles (id, email, full_name, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'demo@localscout.ai',
  'Demo User',
  true
) ON CONFLICT (id) DO UPDATE 
SET email = EXCLUDED.email;

-- Verify
SELECT * FROM profiles WHERE email = 'demo@localscout.ai';
```

✅ **Checkpoint:** You should now have 12+ tables in your database

---

## Step 2: Update Backend Services (45 minutes)

### 2.1 Update Database Setup Service

Open `/supabase/functions/server/database-setup.tsx`

**Find this function:**
```typescript
export async function getUserTrips(userId: string): Promise<Trip[]> {
  const keys = await kv.getByPrefix(`trips:${userId}:`);
  return keys.map(k => k.value);
}
```

**Replace with:**
```typescript
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const getSupabaseAdmin = () => {
  return createClient(
    Deno.env.get("SUPABASE_URL") || "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
  );
};

export async function getUserTrips(userId: string): Promise<Trip[]> {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching trips:', error);
    throw error;
  }
  
  return data || [];
}
```

**Apply same pattern to:**
- `createTrip()`
- `getTrip()`
- `updateTrip()`
- `deleteTrip()`
- `getTripItems()`
- `addTripItem()`
- `updateTripItem()`
- `deleteTripItem()`
- `getSavedPlaces()`
- `savePlace()`
- `unsavePlace()`
- `getUserPreferences()`
- `updateUserPreferences()`

### 2.2 Add Conversation Persistence

Create new file `/supabase/functions/server/conversations-service.ts`:

```typescript
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const getSupabaseAdmin = () => {
  return createClient(
    Deno.env.get("SUPABASE_URL") || "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
  );
};

export async function getOrCreateConversation(
  userId: string,
  contextType: string = 'general'
) {
  const supabase = getSupabaseAdmin();
  
  // Try to get active conversation
  const { data: existing } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .eq('context_type', contextType)
    .eq('is_active', true)
    .order('last_message_at', { ascending: false })
    .limit(1)
    .single();
  
  if (existing) return existing;
  
  // Create new conversation
  const { data: newConv, error } = await supabase
    .from('conversations')
    .insert({
      user_id: userId,
      context_type: contextType,
      title: `${contextType} conversation`,
    })
    .select()
    .single();
  
  if (error) throw error;
  return newConv;
}

export async function addMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string,
  uiData?: any
) {
  const supabase = getSupabaseAdmin();
  
  // Get current message count for sequence number
  const { count } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('conversation_id', conversationId);
  
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      role,
      content,
      ui_data: uiData,
      sequence_number: (count || 0) + 1,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getConversationHistory(
  conversationId: string,
  limit: number = 50
) {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('sequence_number', { ascending: true })
    .limit(limit);
  
  if (error) throw error;
  return data || [];
}

export async function createAIRun(runData: any) {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase
    .from('ai_runs')
    .insert(runData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
```

### 2.3 Update AI Service to Persist Conversations

Open `/supabase/functions/server/ai-service.tsx`

**Find `processMessage()` method and update:**

```typescript
import * as conversations from './conversations-service.ts';

async processMessage(input: {
  message: string;
  conversationId?: string;
  tripId?: string;
  userId: string;
  history?: any[];
}): Promise<AIResponse> {
  const startTime = Date.now();
  
  try {
    // 1. Get or create conversation
    const conversation = await conversations.getOrCreateConversation(
      input.userId,
      input.tripId ? 'itinerary' : 'general'
    );
    
    // 2. Save user message
    await conversations.addMessage(
      conversation.id,
      'user',
      input.message
    );
    
    // 3. Build context from history
    const history = await conversations.getConversationHistory(
      conversation.id,
      10  // Last 10 messages
    );
    
    // 4. Process with AI (existing logic)
    const response = await this.geminiClient.generateContent({
      prompt: input.message,
      history: history.map(m => ({
        role: m.role,
        content: m.content
      })),
      // ... rest of processing
    });
    
    // 5. Save AI response
    await conversations.addMessage(
      conversation.id,
      'assistant',
      response.text,
      response.suggestions  // Save structured data
    );
    
    // 6. Log AI run for analytics
    await conversations.createAIRun({
      user_id: input.userId,
      conversation_id: conversation.id,
      agent_type: 'orchestrator',
      model: 'gemini-1.5-flash',
      prompt: input.message,
      response: response.text,
      tokens_total: response.usageMetadata?.totalTokenCount || 0,
      latency_ms: Date.now() - startTime,
      status: 'success'
    });
    
    return {
      message: response.text,
      agent: 'orchestrator',
      suggestions: response.suggestions || [],
      conversationId: conversation.id
    };
    
  } catch (error) {
    console.error('Error in processMessage:', error);
    
    // Log failed run
    await conversations.createAIRun({
      user_id: input.userId,
      agent_type: 'orchestrator',
      model: 'gemini-1.5-flash',
      prompt: input.message,
      error_message: error.message,
      status: 'error',
      latency_ms: Date.now() - startTime
    });
    
    throw error;
  }
}
```

✅ **Checkpoint:** Backend now persists all AI conversations

---

## Step 3: Connect Gemini AI (15 minutes)

### 3.1 Get Gemini API Key

1. Visit https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key (starts with `AIza...`)

### 3.2 Set Environment Variable

**In Supabase Dashboard:**
1. Go to **Project Settings** → **Edge Functions**
2. Click **Add new secret**
3. Name: `GEMINI_API_KEY`
4. Value: Paste your API key
5. Click **Save**

### 3.3 Verify Connection

Test the AI endpoint:

```bash
curl -X POST \
  https://YOUR-PROJECT.supabase.co/functions/v1/make-server-fd8c4bf7/ai/chat \
  -H "Authorization: Bearer demo-user" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, can you help me plan a trip to Medellín?",
    "userId": "00000000-0000-0000-0000-000000000000"
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "message": "I'd be happy to help you plan...",
    "agent": "orchestrator",
    "suggestions": [...],
    "conversationId": "uuid-here"
  }
}
```

✅ **Checkpoint:** AI is now connected and responses persist

---

## Step 4: Enable RLS & Authentication (30 minutes)

### 4.1 Verify RLS Policies

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('trips', 'profiles', 'saved_places', 'conversations');

-- All should show: rowsecurity = true
```

### 4.2 Test RLS Policies

```sql
-- Simulate user request (should only see own data)
SELECT 
  set_config('request.jwt.claims', 
    '{"sub":"00000000-0000-0000-0000-000000000000"}', 
    false
  );

-- This should work (user's own trips)
SELECT * FROM trips WHERE user_id = '00000000-0000-0000-0000-000000000000';

-- This should return empty (different user)
SELECT * FROM trips WHERE user_id = 'different-user-id';
```

### 4.3 Set Up Supabase Auth (Frontend)

**For now, continue using demo mode.** To implement real auth:

1. Add signup page: `/pages/auth/SignupPage.tsx`
2. Add login page: `/pages/auth/LoginPage.tsx`
3. Use Supabase Auth:
   ```typescript
   import { createClient } from '@supabase/supabase-js';
   
   const supabase = createClient(
     process.env.SUPABASE_URL,
     process.env.SUPABASE_ANON_KEY
   );
   
   // Signup
   const { data, error } = await supabase.auth.signUp({
     email: 'user@example.com',
     password: 'password123'
   });
   
   // Login
   const { data: session } = await supabase.auth.signInWithPassword({
     email: 'user@example.com',
     password: 'password123'
   });
   
   // Use session token in API requests
   fetch('/api/trips', {
     headers: {
       'Authorization': `Bearer ${session.access_token}`
     }
   });
   ```

✅ **Checkpoint:** RLS is active, ready for production auth

---

## Step 5: Migrate Existing Data (30 minutes)

### 5.1 Export KV Data

Create `/supabase/functions/server/migrate-kv-to-sql.ts`:

```typescript
import * as kv from './kv_store.tsx';
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
);

export async function migrateTrips(userId: string) {
  console.log(`Migrating trips for user: ${userId}`);
  
  // Get all trips from KV
  const tripKeys = await kv.getByPrefix(`trips:${userId}:`);
  
  for (const { value: trip } of tripKeys) {
    // Check if already exists
    const { data: existing } = await supabase
      .from('trips')
      .select('id')
      .eq('id', trip.id)
      .single();
    
    if (existing) {
      console.log(`Trip ${trip.id} already migrated, skipping`);
      continue;
    }
    
    // Insert into SQL
    const { error } = await supabase
      .from('trips')
      .insert({
        id: trip.id,
        user_id: trip.user_id,
        owner_id: trip.user_id,  // Same as user_id for now
        title: trip.title,
        destination: trip.destination,
        start_date: trip.start_date,
        end_date: trip.end_date,
        description: trip.description,
        cover_image: trip.cover_image,
        status: trip.status || 'planning',
        created_at: trip.created_at,
        updated_at: trip.updated_at
      });
    
    if (error) {
      console.error(`Failed to migrate trip ${trip.id}:`, error);
    } else {
      console.log(`✅ Migrated trip: ${trip.title}`);
    }
  }
}

export async function migrateTripItems(tripId: string) {
  console.log(`Migrating items for trip: ${tripId}`);
  
  const itemKeys = await kv.getByPrefix(`trip_items:${tripId}:`);
  
  for (const { value: item } of itemKeys) {
    const { error } = await supabase
      .from('itinerary_items')
      .insert({
        id: item.id,
        trip_id: item.trip_id,
        title: item.title,
        description: item.description,
        item_type: item.type || 'custom',
        day_number: item.day,
        sort_order: item.order,
        start_time: item.start_time,
        end_time: item.end_time,
        status: item.booking_status === 'confirmed' ? 'booked' : 'planned',
        notes: item.notes,
        ai_suggested: item.ai_suggested || false,
        created_at: item.created_at,
        updated_at: item.updated_at
      })
      .onConflict('id')
      .ignoreDuplicates();
    
    if (!error) {
      console.log(`✅ Migrated item: ${item.title}`);
    }
  }
}

// Run migration
if (import.meta.main) {
  await migrateTrips('demo-user');
  // Add more users as needed
}
```

### 5.2 Run Migration

```bash
# Deploy migration function
supabase functions deploy migrate-kv-to-sql

# Run it
curl -X POST https://YOUR-PROJECT.supabase.co/functions/v1/migrate-kv-to-sql
```

### 5.3 Verify Migration

```sql
-- Count migrated records
SELECT 'trips' as table_name, COUNT(*) as count FROM trips
UNION ALL
SELECT 'itinerary_items', COUNT(*) FROM itinerary_items
UNION ALL
SELECT 'saved_places', COUNT(*) FROM saved_places;
```

✅ **Checkpoint:** Historical data preserved in SQL

---

## Step 6: Update Locations Service (15 minutes)

### 6.1 Switch to SQL for Locations

The `locations-service.ts` already uses SQL! Just need to populate the table.

### 6.2 Migrate Locations from KV to SQL

```typescript
// One-time script
import * as kvLocations from './kv-locations-service.ts';

async function migrateLocations() {
  const supabase = getSupabaseAdmin();
  
  // Get all events from KV
  const events = await kvLocations.getLocationsByCategory('event');
  
  for (const event of events) {
    await supabase.from('locations').insert({
      id: event.id,
      category: 'event',
      source: event.source || 'manual',
      name: event.name,
      description: event.description,
      city: event.city,
      country: event.country,
      address: event.address,
      event_type: event.event_type,
      event_start_time: event.event_start_time,
      event_end_time: event.event_end_time,
      primary_image_url: event.primary_image_url,
      is_active: event.is_active !== false,
      created_at: event.created_at,
      updated_at: event.updated_at
    }).onConflict('id').ignoreDuplicates();
  }
  
  // Repeat for restaurants and rentals
}
```

✅ **Checkpoint:** All locations in SQL database

---

## Step 7: Test Everything (30 minutes)

### 7.1 Frontend Smoke Tests

Open your app and test:

- [ ] Create new trip → Should save to SQL
- [ ] Add items to trip → Should save to SQL
- [ ] Save a place → Should save to SQL
- [ ] Send AI message → Should persist conversation
- [ ] Refresh page → Conversation history should load
- [ ] View events → Should load from SQL
- [ ] Search locations → Should query SQL

### 7.2 Backend Smoke Tests

```bash
# Health check
curl https://YOUR-PROJECT.supabase.co/functions/v1/make-server-fd8c4bf7/health

# Get trips (should query SQL)
curl https://YOUR-PROJECT.supabase.co/functions/v1/make-server-fd8c4bf7/trips \
  -H "Authorization: Bearer demo-user"

# Get events (should query SQL)
curl https://YOUR-PROJECT.supabase.co/functions/v1/make-server-fd8c4bf7/events

# AI chat (should persist)
curl -X POST https://YOUR-PROJECT.supabase.co/functions/v1/make-server-fd8c4bf7/ai/chat \
  -H "Authorization: Bearer demo-user" \
  -H "Content-Type: application/json" \
  -d '{"message": "Test message", "userId": "00000000-0000-0000-0000-000000000000"}'

# Check conversation was saved
# Open Supabase Dashboard → Table Editor → conversations
# Should see new conversation
```

### 7.3 Performance Check

```sql
-- Check query performance
EXPLAIN ANALYZE
SELECT * FROM trips WHERE user_id = '00000000-0000-0000-0000-000000000000';

-- Should use index: idx_trips_user_id
-- Execution time should be < 10ms
```

✅ **Checkpoint:** All systems operational

---

## Step 8: Deploy & Monitor (15 minutes)

### 8.1 Deploy Edge Functions

```bash
# If you made local changes, deploy them
supabase functions deploy make-server-fd8c4bf7
```

### 8.2 Set Up Basic Monitoring

**In Supabase Dashboard:**
1. Go to **Database** → **Query Performance**
2. Enable **Query Performance Insights**
3. Monitor slow queries (> 100ms)

**Set Up Alerts (Optional):**
1. Go to **Project Settings** → **Integrations**
2. Connect Slack/Discord for error alerts
3. Set up health check monitoring

### 8.3 Update Environment Variables

**Production checklist:**
- ✅ `SUPABASE_URL` - Set
- ✅ `SUPABASE_ANON_KEY` - Set
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Set (server-side only)
- ✅ `GEMINI_API_KEY` - Set
- ⚠️ `GOOGLE_MAPS_API_KEY` - Optional, set if using Maps
- ⚠️ `SENDGRID_API_KEY` - Optional, for email notifications

✅ **Checkpoint:** Production-ready deployment

---

## Verification Checklist

Before considering implementation complete:

### Database
- [ ] All 12+ tables created
- [ ] RLS policies active on all tables
- [ ] Indexes created successfully
- [ ] Demo user seeded

### Backend
- [ ] Edge Functions deployed
- [ ] Database service uses SQL
- [ ] AI service persists conversations
- [ ] All CRUD operations work

### AI Integration
- [ ] Gemini API key set
- [ ] AI responses working
- [ ] Conversations persist
- [ ] History retrieves correctly

### Data Migration
- [ ] Trips migrated from KV
- [ ] Trip items migrated
- [ ] Saved places migrated
- [ ] Locations in SQL

### Testing
- [ ] All API endpoints return 200
- [ ] RLS prevents unauthorized access
- [ ] AI chat works end-to-end
- [ ] Frontend displays correct data

### Monitoring
- [ ] Query performance insights enabled
- [ ] Error tracking configured
- [ ] Health checks passing

---

## Troubleshooting

### Issue: Tables Not Created

**Error:** `relation "trips" does not exist`

**Solution:**
```sql
-- Verify schema was run
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'trips';

-- If empty, re-run the SQL file
-- Copy contents of /supabase/schemas/04-core-itinerary.sql
-- Paste into SQL Editor and run
```

### Issue: RLS Blocking Queries

**Error:** `new row violates row-level security policy`

**Solution:**
```sql
-- Temporarily disable RLS for testing (DON'T DO IN PRODUCTION)
ALTER TABLE trips DISABLE ROW LEVEL SECURITY;

-- Or ensure you're using service role key in backend:
const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')  // This bypasses RLS
);
```

### Issue: AI Not Responding

**Error:** `AI service not ready`

**Solution:**
```bash
# Check if API key is set
echo $GEMINI_API_KEY

# If empty, set it in Supabase Dashboard:
# Project Settings → Edge Functions → Secrets
# Add: GEMINI_API_KEY = your-key-here

# Redeploy functions to pick up new env vars
supabase functions deploy make-server-fd8c4bf7
```

### Issue: Slow Queries

**Error:** Queries taking > 100ms

**Solution:**
```sql
-- Check if indexes exist
SELECT indexname FROM pg_indexes WHERE tablename = 'trips';

-- Should see: idx_trips_user_id, idx_trips_status, etc.

-- If missing, re-run schema file or create manually:
CREATE INDEX idx_trips_user_id ON trips(user_id);
```

---

## Next Steps After Implementation

1. **Week 1:** Monitor performance and fix any issues
2. **Week 2:** Implement real authentication (signup/login)
3. **Week 3:** Set up reminder automation
4. **Week 4:** Add embeddings for semantic search
5. **Month 2:** Build analytics dashboard

---

## Support

**Documentation:**
- Full Analysis: `/docs/roadmap/23-frontend-backend-wiring-analysis.md`
- Architecture: `/docs/roadmap/25-architecture-visual-reference.md`
- SQL Schemas: `/supabase/schemas/*.sql`

**Need Help?**
- Check Supabase docs: https://supabase.com/docs
- Gemini AI docs: https://ai.google.dev/docs
- Internal docs: `/docs/` folder

---

**Status:** ✅ **Ready to implement** - follow steps sequentially for best results
