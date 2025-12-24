# SUPABASE SCHEMA RECOMMENDATIONS
## Based on AI Implementation Requirements & Production Progress Tracker

**Document:** 06-schema-recommendations.md  
**Created:** December 24, 2024  
**Purpose:** Identify required Supabase schemas for AI features  
**Status:** ⚠️ IMPORTANT NOTE - Figma Make Constraint

---

## ⚠️ CRITICAL CONSTRAINT: FIGMA MAKE ENVIRONMENT

**Figma Make does NOT support custom Postgres tables.**

According to the system constraints:
- ❌ Cannot create custom Postgres tables via migrations
- ❌ Cannot run DDL statements (CREATE TABLE, ALTER TABLE, etc.)
- ✅ Can ONLY use the pre-configured `kv_store_fd8c4bf7` table
- ✅ Must use KV store pattern for all data storage

**All schema files in `/supabase/schemas/` are for REFERENCE ONLY** - they document the ideal production schema but cannot be applied in Figma Make.

---

## 📊 SCHEMA REQUIREMENTS ANALYSIS

Based on `/docs/03-implementation/` documentation, here are the schemas needed for AI features:

### Table 1: Core AI Features Schema Requirements

| Schema Name | Purpose | Status in Figma Make | Priority | Alternative Solution |
|-------------|---------|---------------------|----------|---------------------|
| **conversations** | Store AI chat sessions | ❌ Cannot create | P0 - Critical | Use KV: `conversation:{id}` |
| **messages** | Individual chat messages | ❌ Cannot create | P0 - Critical | Use KV: `message:{id}` |
| **ai_runs** | Track agent execution logs | ❌ Cannot create | P1 - High | Use KV: `ai_run:{id}` |
| **ai_context** | Store conversation context | ❌ Cannot create | P0 - Critical | Use KV: `context:{conversationId}` |
| **user_preferences** | User AI preferences | ❌ Cannot create | P1 - High | Use KV: `preferences:{userId}` |
| **proactive_suggestions** | AI-generated suggestions | ❌ Cannot create | P2 - Medium | Use KV: `suggestion:{id}` |
| **conflict_resolutions** | Detected & resolved conflicts | ❌ Cannot create | P2 - Medium | Use KV: `conflict:{id}` |
| **budget_tracking** | Real-time budget monitoring | ❌ Cannot create | P2 - Medium | Use KV: `budget:{tripId}` |
| **booking_workflows** | Multi-step booking states | ❌ Cannot create | P2 - Medium | Use KV: `workflow:{id}` |

---

### Table 2: Trip Management Schema Requirements

| Schema Name | Purpose | Status in Figma Make | Priority | Alternative Solution |
|-------------|---------|---------------------|----------|---------------------|
| **trips** | User trip/itinerary data | ❌ Cannot create | P0 - Critical | Use KV: `trip:{id}` |
| **itinerary_items** | Activities in trip | ❌ Cannot create | P0 - Critical | Use KV: `item:{id}` |
| **locations** | Places (events/restaurants/rentals) | ❌ Cannot create | P0 - Critical | Use KV: `event:{id}`, `restaurant:{id}`, `rental:{id}` |
| **saved_places** | User's saved locations | ❌ Cannot create | P1 - High | Use KV: `saved:{userId}:{placeId}` |
| **collections** | User-created place collections | ❌ Cannot create | P2 - Medium | Use KV: `collection:{id}` |
| **trip_collaborators** | Shared trip access | ❌ Cannot create | P3 - Low | Use KV: `collaborator:{tripId}:{userId}` |

---

### Table 3: Advanced AI Features Schema Requirements

| Schema Name | Purpose | Status in Figma Make | Priority | Alternative Solution |
|-------------|---------|---------------------|----------|---------------------|
| **embeddings** | Vector search for semantic matching | ❌ Cannot create | P3 - Low | Not feasible in KV store |
| **web_sources** | Cached web content for grounding | ❌ Cannot create | P3 - Low | Use KV: `websource:{url_hash}` |
| **automation_rules** | User-defined automation | ❌ Cannot create | P3 - Low | Use KV: `automation:{id}` |
| **automation_jobs** | Background job queue | ❌ Cannot create | P2 - Medium | Use KV: `job:{id}` (already implemented) |
| **automation_logs** | Execution history | ❌ Cannot create | P3 - Low | Use KV: `log:{jobId}` |

---

### Table 4: User & Auth Schema Requirements

| Schema Name | Purpose | Status in Figma Make | Priority | Alternative Solution |
|-------------|---------|---------------------|----------|---------------------|
| **profiles** | User profile data | ❌ Cannot create | P0 - Critical | Use KV: `profile:{userId}` |
| **user_sessions** | Active user sessions | ❌ Cannot create | P1 - High | Use localStorage + KV backup |
| **api_keys** | User API key storage | ❌ Cannot create | P2 - Medium | Use KV: `apikey:{userId}` (encrypted) |

---

## 🗂️ KV STORE IMPLEMENTATION STRATEGY

Since custom Postgres tables are not available, here's the recommended KV store key naming convention:

### Primary Entities

```typescript
// Conversations & Messages
"conversation:{uuid}"              → Conversation object
"conversation:index:{userId}"      → Array of conversation IDs
"message:{uuid}"                   → Message object
"messages:index:{conversationId}"  → Array of message IDs

// AI Execution
"ai_run:{uuid}"                    → AI execution log
"ai_runs:index:{userId}"           → Array of run IDs
"context:{conversationId}"         → Current conversation context
"context:history:{conversationId}" → Historical context snapshots

// Trips & Itinerary
"trip:{uuid}"                      → Trip object
"trips:index:{userId}"             → Array of trip IDs (already implemented)
"item:{uuid}"                      → Itinerary item
"items:index:{tripId}"             → Array of item IDs

// Locations (already implemented)
"event:{uuid}"                     → Event object
"events:index"                     → Array of event IDs
"restaurant:{uuid}"                → Restaurant object
"restaurants:index"                → Array of restaurant IDs
"rental:{uuid}"                    → Rental object
"rentals:index"                    → Array of rental IDs

// User Data
"profile:{userId}"                 → User profile
"preferences:{userId}"             → User preferences
"saved:{userId}"                   → Array of saved place IDs

// AI Suggestions
"suggestion:{uuid}"                → Proactive suggestion
"suggestions:index:{userId}"       → Array of suggestion IDs
"suggestions:active:{userId}"      → Currently active suggestions

// Conflicts
"conflict:{uuid}"                  → Conflict detection record
"conflicts:index:{tripId}"         → Array of conflict IDs

// Budgets
"budget:{tripId}"                  → Budget tracking data
"budget:alerts:{tripId}"           → Budget alert history

// Workflows
"workflow:{uuid}"                  → Booking workflow state
"workflows:index:{userId}"         → Array of workflow IDs

// Collections
"collection:{uuid}"                → User collection
"collections:index:{userId}"       → Array of collection IDs

// Jobs (already implemented)
"job:{uuid}"                       → Background job
"jobs:index"                       → Array of job IDs
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Core AI (P0 - Critical)

- [x] **conversations** - KV pattern: `conversation:{id}` ✅
  - Store: conversation metadata, participant, created_at
  - Index: `conversation:index:{userId}`
  
- [x] **messages** - KV pattern: `message:{id}` ✅
  - Store: role, content, timestamp, conversationId
  - Index: `messages:index:{conversationId}`
  
- [x] **ai_context** - KV pattern: `context:{conversationId}` ✅
  - Store: current entities, preferences, session data
  - Update: on every message exchange
  
- [x] **trips** - KV pattern: `trip:{id}` ✅ ALREADY IMPLEMENTED
  - Already working via KV store
  
- [x] **locations** - KV pattern: `event:{id}`, `restaurant:{id}`, `rental:{id}` ✅ ALREADY IMPLEMENTED
  - Already working via KV store

### Phase 2: Tracking & Analytics (P1 - High)

- [ ] **ai_runs** - KV pattern: `ai_run:{id}` ⏳
  - Store: agent_name, input, output, duration, tokens
  - Purpose: Debug & analytics
  
- [ ] **user_preferences** - KV pattern: `preferences:{userId}` ⏳
  - Store: AI settings, notification preferences
  - Purpose: Personalization
  
- [ ] **saved_places** - KV pattern: `saved:{userId}` ⏳
  - Store: array of saved location IDs
  - Purpose: Wishlist feature

### Phase 3: Advanced Features (P2 - Medium)

- [ ] **proactive_suggestions** - KV pattern: `suggestion:{id}` ⏳
  - Store: suggestion content, confidence, shown_at
  - Purpose: Proactive assistant
  
- [ ] **conflict_resolutions** - KV pattern: `conflict:{id}` ⏳
  - Store: conflict type, detection time, resolution
  - Purpose: Conflict resolver
  
- [ ] **budget_tracking** - KV pattern: `budget:{tripId}` ⏳
  - Store: total, spent, alerts, breakdown
  - Purpose: Budget guardian
  
- [ ] **booking_workflows** - KV pattern: `workflow:{id}` ⏳
  - Store: current_step, data, status
  - Purpose: Smart booking

### Phase 4: Future Enhancements (P3 - Low)

- [ ] **collections** - KV pattern: `collection:{id}` ⏳
- [ ] **automation_rules** - KV pattern: `automation:{id}` ⏳
- [ ] **web_sources** - KV pattern: `websource:{hash}` ⏳

---

## 🔧 SERVICE FILE CREATION PLAN

### Existing Services (✅ Complete)
```
/supabase/functions/server/
├── kv_store.tsx              ✅ Core KV utilities
├── db-events-service.ts      ✅ Events CRUD
├── db-restaurants-service.ts ✅ Restaurants CRUD
├── db-rentals-service.ts     ✅ Rentals CRUD
└── job-service.ts            ✅ Background jobs
```

### Services to Create (⏳ Needed)

```typescript
/supabase/functions/server/
├── db-conversations-service.ts    ⏳ Conversations CRUD
├── db-messages-service.ts         ⏳ Messages CRUD
├── db-context-service.ts          ⏳ Context persistence
├── db-preferences-service.ts      ⏳ User preferences
├── db-ai-runs-service.ts          ⏳ AI execution logs
├── db-suggestions-service.ts      ⏳ Proactive suggestions
├── db-conflicts-service.ts        ⏳ Conflict tracking
├── db-budgets-service.ts          ⏳ Budget tracking
└── db-workflows-service.ts        ⏳ Workflow state
```

---

## 📊 MAPPING: IDEAL SCHEMA → KV IMPLEMENTATION

### Example: Conversations Table

**Ideal Postgres Schema:**
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  title TEXT,
  agent_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**KV Store Implementation:**
```typescript
// Key: conversation:{uuid}
// Value:
{
  id: "conv-123",
  userId: "user-456",
  title: "Plan my Paris trip",
  agentType: "local-scout",
  createdAt: "2024-12-24T10:00:00Z",
  updatedAt: "2024-12-24T10:30:00Z"
}

// Index key: conversation:index:user-456
// Value: ["conv-123", "conv-124", "conv-125"]
```

### Example: AI Runs Table

**Ideal Postgres Schema:**
```sql
CREATE TABLE ai_runs (
  id UUID PRIMARY KEY,
  user_id UUID,
  agent_name TEXT,
  input_tokens INTEGER,
  output_tokens INTEGER,
  duration_ms INTEGER,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**KV Store Implementation:**
```typescript
// Key: ai_run:{uuid}
// Value:
{
  id: "run-789",
  userId: "user-456",
  agentName: "dining-orchestrator",
  inputTokens: 250,
  outputTokens: 180,
  durationMs: 1200,
  status: "success",
  createdAt: "2024-12-24T10:15:00Z"
}

// Index key: ai_runs:index:user-456
// Value: ["run-789", "run-790", ...]
```

---

## 🚀 NEXT STEPS

### Immediate Actions (This Week)

1. ✅ **Accept KV Store Limitation**
   - Understand that custom Postgres tables cannot be created
   - All schemas in `/supabase/schemas/` are reference documentation only
   
2. ⏳ **Create KV-Based Services**
   - Start with conversations service (P0)
   - Add messages service (P0)
   - Add context persistence (P0)
   
3. ⏳ **Update AI Integration**
   - Wire AI agents to use KV-based services
   - Store conversation history
   - Persist AI context

### Short-term (Next 2 Weeks)

4. ⏳ **Implement Tracking**
   - AI runs logging
   - User preferences
   - Saved places
   
5. ⏳ **Add Advanced Features**
   - Proactive suggestions storage
   - Conflict detection storage
   - Budget tracking storage

### Long-term (Future Production)

6. ⏳ **Migration Path**
   - When moving to standalone Supabase (outside Figma Make)
   - Apply actual SQL schemas from `/supabase/schemas/`
   - Migrate data from KV store to proper tables
   - Enable RLS policies
   - Set up vector search (pgvector)

---

## 📝 SUMMARY

### What We Have
- ✅ Schema reference files (for future production)
- ✅ KV store infrastructure
- ✅ Working services for events/restaurants/rentals
- ✅ Job service for background tasks

### What We Need
- ⏳ KV-based services for AI features (conversations, messages, context)
- ⏳ KV-based tracking (AI runs, preferences)
- ⏳ KV-based advanced features (suggestions, conflicts, budgets)

### Key Constraint
- ❌ **Cannot create custom Postgres tables in Figma Make**
- ✅ **Must use KV store pattern for everything**
- ✅ **Schema files are reference documentation for future production deployment**

---

**Document Status:** ✅ Complete & Actionable  
**Last Updated:** December 24, 2024  
**Next Review:** After Phase 1 KV services created  
**Owner:** Backend Team
