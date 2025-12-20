# Supabase Schema Design — Trip Operating System

**Date:** December 20, 2024  
**Purpose:** Production-ready database schema staged for incremental implementation  
**Status:** Complete architectural design

---

## 🎯 Overview

This directory contains the **complete Supabase schema design** for the Trip Operating System, organized into **5 incremental implementation stages**.

Each stage is designed to be independently deployable, with clear dependencies and upgrade paths.

---

## 📦 Implementation Stages

### Stage 1 — Core Schema (SHIP FIRST)
**File:** `01-core-schema.md`  
**Purpose:** Foundational data for minimum viable product  
**Timeline:** Week 1-2  
**Status:** 🔴 Required for MVP

**Contains:**
- User profiles
- Trips and itineraries
- Basic locations/places
- User preferences

**Dependencies:** None (pure foundation)

---

### Stage 2 — Advanced Features
**File:** `02-advanced-schema.md`  
**Purpose:** Enhanced product capabilities  
**Timeline:** Week 3-4  
**Status:** 🟡 Important for engagement

**Contains:**
- Saved places and collections
- Trip collaboration
- Group voting and preferences
- Tagging system

**Dependencies:** Stage 1

---

### Stage 3 — AI Agents & Intelligence
**File:** `03-ai-agents-schema.md`  
**Purpose:** AI-powered features and memory  
**Timeline:** Week 5-6  
**Status:** 🟢 Enhances experience

**Contains:**
- AI agent definitions
- AI run tracking
- Message history
- Context memory
- Token usage and costs

**Dependencies:** Stage 1, Stage 2 (optional)

---

### Stage 4 — Payments & Monetization
**File:** `04-payments-stripe-schema.md`  
**Purpose:** Subscription and billing infrastructure  
**Timeline:** Week 7-8  
**Status:** 🟢 Revenue generation

**Contains:**
- Stripe subscriptions
- Usage limits
- Billing events
- Invoice tracking

**Dependencies:** Stage 1, Stage 3 (for usage tracking)

---

### Stage 5 — WhatsApp & Automations
**File:** `05-whatsapp-automation-schema.md`  
**Purpose:** Messaging and workflow automation  
**Timeline:** Week 9-10  
**Status:** 🟢 Advanced engagement

**Contains:**
- WhatsApp integration
- Notification preferences
- Automation rules
- Scheduled jobs
- Delivery tracking

**Dependencies:** Stage 1, Stage 3 (optional for AI-powered messages)

---

## 📊 Entity Relationship Diagrams

All ERDs are stored in `/docs/supabase/schema/diagrams/`:

| Diagram | Stage | Tables | Relationships |
|---------|-------|--------|---------------|
| `erd-core.mmd` | 1 | 5 core tables | Basic ownership |
| `erd-advanced.mmd` | 2 | 6 tables | Many-to-many + collaboration |
| `erd-ai.mmd` | 3 | 5 tables | AI runs → users/trips |
| `erd-payments.mmd` | 4 | 5 tables | Stripe → users |
| `erd-whatsapp.mmd` | 5 | 6 tables | Messages → trips/users |

---

## 🔐 Security Model

### Row Level Security (RLS)

**All tables have RLS enabled.** No exceptions.

**Policy Patterns:**

1. **User-owned resources** (profiles, trips, settings)
   - SELECT: `user_id = auth.uid()`
   - INSERT: `user_id = auth.uid()`
   - UPDATE: `user_id = auth.uid()`
   - DELETE: `user_id = auth.uid()`

2. **Collaborative resources** (shared trips, collections)
   - SELECT: Owner OR collaborator
   - INSERT: Authenticated users
   - UPDATE: Owner OR collaborator with edit permission
   - DELETE: Owner only

3. **Read-only client tables** (ai_runs, billing_events)
   - SELECT: `user_id = auth.uid()`
   - INSERT: Service role only (via Edge Functions)
   - UPDATE: Service role only
   - DELETE: Service role only

4. **Public readable** (None in this system)

---

## 🏗️ Technical Standards

### Naming Conventions

- **Tables:** `snake_case`, plural (e.g., `trips`, `saved_places`)
- **Columns:** `snake_case` (e.g., `user_id`, `created_at`)
- **Indexes:** `idx_<table>_<column>` (e.g., `idx_trips_user_id`)
- **Foreign Keys:** `fk_<table>_<column>` (e.g., `fk_trips_user_id`)
- **Policies:** `"Descriptive policy name"` (e.g., `"Users can view their own trips"`)

### Required Columns

All tables include:
- `id uuid primary key default gen_random_uuid()`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

### Data Types

- **UUIDs:** All primary keys and foreign keys
- **Timestamps:** `timestamptz` (UTC timezone-aware)
- **Text:** `text` (unlimited) or `varchar(n)` for constrained
- **JSON:** `jsonb` (binary JSON for performance)
- **Numbers:** `integer`, `bigint`, or `numeric` (for money)
- **Booleans:** `boolean` with defaults

---

## 📁 Schema File Organization

Schemas are stored in `/supabase/schemas/` following declarative pattern:

```
supabase/
└── schemas/
    ├── 001_core_tables.sql
    ├── 002_core_rls.sql
    ├── 003_advanced_tables.sql
    ├── 004_advanced_rls.sql
    ├── 005_ai_tables.sql
    ├── 006_ai_rls.sql
    ├── 007_payments_tables.sql
    ├── 008_payments_rls.sql
    ├── 009_whatsapp_tables.sql
    └── 010_whatsapp_rls.sql
```

**Important:** Files execute in lexicographic order. Dependencies must be respected.

---

## 🚀 Edge Functions

### Required by Stage

**Stage 1 (Core):**
- None (pure database operations via client)

**Stage 2 (Advanced):**
- `invite-collaborator` - Send collaboration invites
- `accept-invitation` - Accept and create collaborator record

**Stage 3 (AI):**
- `run-ai-agent` - Execute AI agent with tracking
- `summarize-trip` - Generate trip summaries
- `optimize-itinerary` - AI-powered optimization
- `classify-place` - Categorize places

**Stage 4 (Payments):**
- `create-checkout-session` - Initialize Stripe checkout
- `handle-stripe-webhook` - Process Stripe events
- `enforce-usage-limits` - Check and enforce limits

**Stage 5 (WhatsApp):**
- `send-whatsapp-message` - Send message via WhatsApp API
- `schedule-reminder` - Create scheduled notifications
- `handle-whatsapp-webhook` - Process status updates
- `trigger-automation` - Execute automation rules

---

## 📊 Storage Buckets

### trip-images
- **Purpose:** Trip photos and thumbnails
- **Access:** Private (RLS)
- **Policy:** User can upload to their trips

### place-photos
- **Purpose:** Saved place images
- **Access:** Private (RLS)
- **Policy:** User can upload to their places

### user-avatars
- **Purpose:** Profile pictures
- **Access:** Public read, private write
- **Policy:** User can upload their own avatar

---

## 🔄 Realtime Subscriptions

### Enabled Tables

**Stage 1:**
- `trips` - Real-time updates for shared trips
- `trip_items` - Live itinerary changes

**Stage 2:**
- `collaborators` - New collaborator notifications
- `votes` - Live voting on group trips

**Stage 3:**
- `ai_messages` - Stream AI responses

**Stage 5:**
- `whatsapp_messages` - Live message status

---

## 📈 Performance Optimization

### Indexing Strategy

**Foreign Keys:**
- Auto-indexed on all `user_id` columns
- Auto-indexed on all relationship columns

**Common Queries:**
- `trips.status` - Filter by planning/booked/completed
- `saved_places.category` - Filter by place type
- `ai_runs.created_at` - Time-based queries
- `subscriptions.status` - Active subscription checks

**Composite Indexes:**
- `(user_id, created_at DESC)` - User's recent items
- `(trip_id, day_number, order_index)` - Itinerary ordering
- `(user_id, status)` - User's active trips

---

## 🧪 Testing Strategy

### Each Stage Includes:

1. **Schema tests**
   - Tables created correctly
   - Relationships enforced
   - Indexes exist

2. **RLS tests**
   - Users can only see their data
   - Collaborators have appropriate access
   - Service role bypasses RLS

3. **Performance tests**
   - Query execution time < 100ms
   - Index usage verified
   - N+1 queries eliminated

4. **Integration tests**
   - Edge Functions work correctly
   - Realtime subscriptions function
   - Storage policies enforced

---

## 📋 Migration Workflow

### For Each Stage:

```bash
# 1. Stop Supabase
supabase stop

# 2. Add schema files to /supabase/schemas/
# (e.g., 001_core_tables.sql, 002_core_rls.sql)

# 3. Generate migration
supabase db diff -f stage_1_core_schema

# 4. Review migration in supabase/migrations/

# 5. Start and test
supabase start

# 6. Verify
supabase db lint
```

---

## 📊 Database Statistics (Projected)

### Expected Table Sizes (1 year, 10K users)

| Table | Rows | Growth Rate | Storage |
|-------|------|-------------|---------|
| profiles | 10K | 1K/month | 1 MB |
| trips | 50K | 5K/month | 50 MB |
| trip_items | 500K | 50K/month | 200 MB |
| saved_places | 100K | 10K/month | 100 MB |
| ai_runs | 500K | 100K/month | 500 MB |
| ai_messages | 2M | 400K/month | 2 GB |
| whatsapp_messages | 1M | 200K/month | 500 MB |

**Total estimated:** ~3.5 GB first year

---

## 🔗 Related Documentation

- **[Declarative Schema Best Practices](/docs/supabase/01-declarative-schema-best-practices.md)**
- **[Postgres SQL Style Guide](/docs/supabase/02-postgres-sql-style-guide.md)**
- **[Creating Migrations](/docs/supabase/03-creating-migrations.md)**
- **[Creating RLS Policies](/docs/supabase/04-creating-rls-policies.md)**
- **[Creating Database Functions](/docs/supabase/05-creating-functions.md)**
- **[Creating Edge Functions](/docs/supabase/06-creating-edge-functions.md)**

---

## 🎯 Implementation Checklist

### Pre-implementation
- [ ] Review all 5 stage documents
- [ ] Understand dependencies
- [ ] Plan timeline (10 weeks)
- [ ] Set up Supabase project
- [ ] Configure environment variables

### Stage 1 (Core)
- [ ] Create schema files
- [ ] Generate migration
- [ ] Deploy to staging
- [ ] Test RLS policies
- [ ] Deploy to production

### Stage 2 (Advanced)
- [ ] Create schema files
- [ ] Generate migration
- [ ] Implement Edge Functions
- [ ] Test collaboration
- [ ] Deploy to production

### Stage 3 (AI)
- [ ] Create schema files
- [ ] Generate migration
- [ ] Implement AI Edge Functions
- [ ] Set up API keys
- [ ] Test AI flows
- [ ] Deploy to production

### Stage 4 (Payments)
- [ ] Create schema files
- [ ] Generate migration
- [ ] Set up Stripe
- [ ] Implement webhooks
- [ ] Test billing flows
- [ ] Deploy to production

### Stage 5 (WhatsApp)
- [ ] Create schema files
- [ ] Generate migration
- [ ] Set up WhatsApp Business API
- [ ] Implement webhooks
- [ ] Test automations
- [ ] Deploy to production

---

## 📞 Support

### Questions?
- **Schema design:** Review individual stage documents
- **RLS policies:** See `/docs/supabase/04-creating-rls-policies.md`
- **Edge Functions:** See `/docs/supabase/06-creating-edge-functions.md`
- **Migration issues:** See `/docs/supabase/03-creating-migrations.md`

---

**Status:** ✅ Complete schema design  
**Ready for:** Implementation Stage 1  
**Estimated Timeline:** 10 weeks for all stages  
**Production-Ready:** Yes

---

**Created:** December 20, 2024  
**Architect:** Senior Backend Team  
**Review Status:** Pending team approval
