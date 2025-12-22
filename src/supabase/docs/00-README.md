# Supabase Backend Documentation

**Local Scout AI - Complete Backend System**

## Overview

This directory contains the complete Supabase backend implementation for the Local Scout AI travel planning platform, including:

- **Declarative SQL Schemas** - Database schema definitions
- **Edge Functions** - Serverless API endpoints
- **Documentation** - Architecture diagrams and guides
- **Migrations** - Auto-generated migration files (via `supabase db diff`)

## Directory Structure

```
/supabase/
├── schemas/                   # Declarative schema definitions (source of truth)
│   ├── 00-core-profiles.sql         # User profiles
│   ├── 01-core-preferences.sql      # User preferences
│   ├── 02-core-conversations.sql    # AI conversations
│   ├── 03-core-places.sql           # Places & locations
│   ├── 04-core-itinerary.sql        # Trips & itinerary
│   ├── 10-advanced-embeddings.sql   # Vector embeddings (pgvector)
│   └── 11-advanced-automations.sql  # Automation rules & jobs
│
├── migrations/                # Auto-generated migration files
│   └── [timestamp]_*.sql            # Generated via `supabase db diff`
│
├── functions/                 # Edge Functions (serverless API)
│   ├── ai-orchestrator/             # Main AI agent router
│   ├── actions/                     # Action endpoints
│   └── webhooks/                    # Webhook handlers
│
└── docs/                      # Documentation
    ├── 00-README.md                 # This file
    ├── 01-core-architecture.md      # Core system architecture
    ├── 02-advanced-architecture.md  # Advanced features
    ├── 03-entity-relationships.md   # ERD diagrams
    ├── 04-data-flows.md             # Data flow diagrams
    ├── 05-api-contracts.md          # API endpoint documentation
    └── 06-implementation-order.md   # Step-by-step implementation

```

## Quick Start

### 1. Prerequisites

```bash
# Install Supabase CLI
npm install -g supabase

# Or with Homebrew
brew install supabase/tap/supabase
```

### 2. Initialize Local Development

```bash
# Start local Supabase
supabase start

# This will start:
# - PostgreSQL database
# - Kong API Gateway
# - GoTrue auth server
# - Realtime server
# - Storage server
```

### 3. Apply Schema

```bash
# Apply all schema files in order
for file in supabase/schemas/*.sql; do
  supabase db execute --file "$file"
done

# Or apply individually
supabase db execute --file supabase/schemas/00-core-profiles.sql
```

### 4. Generate Migration (After Schema Changes)

```bash
# Stop local Supabase first
supabase stop

# Generate migration from schema diff
supabase db diff -f initial_schema

# This creates: supabase/migrations/[timestamp]_initial_schema.sql

# Start Supabase again
supabase start
```

### 5. Deploy Edge Functions

```bash
# Deploy AI orchestrator
supabase functions deploy ai-orchestrator

# Set environment variables
supabase secrets set GEMINI_API_KEY=your_key_here
```

## Schema Organization

### Phase 1: Core Features (00-04)

**Required for MVP. Implement these first.**

- **00-core-profiles.sql** - User accounts, profiles, settings
- **01-core-preferences.sql** - User preferences for AI personalization
- **02-core-conversations.sql** - AI chat conversations & messages
- **03-core-places.sql** - Locations, saved places, search cache
- **04-core-itinerary.sql** - Trips, itinerary items, reminders

**Estimated time:** 2-3 weeks

### Phase 2: Advanced Features (10-11)

**Enhance AI capabilities and automation.**

- **10-advanced-embeddings.sql** - Vector embeddings for semantic search (pgvector)
- **11-advanced-automations.sql** - Automation rules, background jobs, workflows

**Estimated time:** 1-2 weeks

## Key Features

### ✅ Implemented Features

1. **User Management**
   - Profile creation with auto-trigger on signup
   - Preferences management
   - Privacy controls

2. **AI Conversations**
   - Multi-turn conversations
   - Message history
   - AI run tracking & analytics

3. **Places & Discovery**
   - Normalized location data
   - Saved places & collections
   - Search caching
   - Nearby search (haversine distance)

4. **Trip Planning**
   - Trip CRUD operations
   - Itinerary builder with day-by-day items
   - Reminders & notifications
   - Collaboration & sharing

5. **Security (RLS)**
   - Row-level security on all user tables
   - Service-role access for backend operations
   - Public read for shareable content

### 🚧 Advanced Features (Phase 2)

6. **Vector Search (pgvector)**
   - Semantic search for locations
   - Conversation history search
   - Similar place recommendations

7. **Automations**
   - User-defined automation rules
   - Background job queue
   - Scheduled tasks
   - Event-driven actions

## Database Statistics

### Tables Overview

| Category | Tables | Total Columns | Indexes |
|----------|--------|---------------|---------|
| Core | 12 | 180+ | 60+ |
| Advanced | 5 | 70+ | 20+ |
| **Total** | **17** | **250+** | **80+** |

### Storage Estimates (per 1000 users)

| Table | Estimated Rows | Storage |
|-------|----------------|---------|
| profiles | 1,000 | ~500 KB |
| conversations | 5,000 | ~2 MB |
| messages | 50,000 | ~20 MB |
| locations | 10,000 | ~10 MB |
| saved_places | 20,000 | ~5 MB |
| trips | 3,000 | ~2 MB |
| itinerary_items | 30,000 | ~15 MB |
| embeddings | 100,000 | ~600 MB (vector data) |
| **Total** | **219,000** | **~650 MB** |

## Performance Optimization

### Indexes

All tables have appropriate indexes for:
- Primary key lookups (automatic)
- Foreign key relationships
- Common query patterns
- User-specific queries (with RLS)
- Time-based queries
- Geospatial queries

### Query Optimization

1. **Use prepared statements** for repeated queries
2. **Limit result sets** with pagination
3. **Use indexes** for WHERE clauses
4. **Avoid SELECT *** - specify columns
5. **Use JOIN instead of subqueries** when possible
6. **Cache frequently accessed data** in search_cache table

### Caching Strategy

- **Search results**: Cached in `search_cache` table
- **Location data**: TTL-based expiration
- **API responses**: Edge Function level caching
- **Static content**: CDN caching

## Security

### Row-Level Security (RLS)

All user-facing tables have RLS enabled:

```sql
-- Example: Users can only see their own trips
CREATE POLICY "Users can view own trips"
  ON trips FOR SELECT
  USING (auth.uid() = user_id);
```

### Authentication

- **JWT validation** via Supabase Auth
- **Service role** for backend operations
- **Anonymous access** blocked by default
- **Rate limiting** on API endpoints

### Data Protection

- **Encrypted at rest** (Supabase default)
- **SSL/TLS in transit**
- **RLS policies** prevent data leaks
- **Audit logging** via automation_logs

## API Endpoints

### Edge Functions

All API endpoints are serverless Edge Functions:

**AI & Chat**
- `POST /ai-orchestrator` - Main AI agent router
- `POST /ai-orchestrator?stream=true` - Streaming responses

**Actions**
- `POST /actions/itinerary/add` - Add to itinerary
- `POST /actions/favorites/save` - Save place
- `POST /actions/reminders/create` - Create reminder
- `POST /actions/booking/request` - Request booking

**Webhooks**
- `POST /webhooks/stripe` - Stripe payment webhook
- `POST /webhooks/calendar` - Calendar sync

See `/supabase/docs/05-api-contracts.md` for detailed API documentation.

## Environment Variables

Required environment variables:

```bash
# Supabase (auto-configured)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Services
GEMINI_API_KEY=your_gemini_key

# Optional: External APIs
GOOGLE_MAPS_API_KEY=your_maps_key
YELP_API_KEY=your_yelp_key
TICKETMASTER_API_KEY=your_ticketmaster_key
```

## Testing

### Local Testing

```bash
# Start Supabase with seed data
supabase start
supabase db reset --seed

# Test Edge Functions locally
supabase functions serve ai-orchestrator

# Call function
curl -X POST http://localhost:54321/functions/v1/ai-orchestrator \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message": "Find events in Medellín"}'
```

### Database Testing

```bash
# Run tests (if you have pgTAP installed)
supabase test db

# Check migrations
supabase db push --dry-run
```

## Deployment

### Production Deployment

```bash
# Link to remote project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push

# Deploy functions
supabase functions deploy ai-orchestrator

# Set secrets
supabase secrets set GEMINI_API_KEY=your_production_key
```

## Monitoring

### Database Metrics

Monitor in Supabase Dashboard:
- Active connections
- Query performance
- Table sizes
- Index usage
- RLS policy performance

### Function Metrics

- Invocation count
- Error rate
- Average latency
- Cold start frequency

## Troubleshooting

### Common Issues

**1. Migration conflicts**
```bash
# Reset local database
supabase db reset

# Re-apply migrations
supabase db push
```

**2. RLS policy blocking queries**
```sql
-- Check active policies
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- Temporarily disable (DEV ONLY)
ALTER TABLE your_table DISABLE ROW LEVEL SECURITY;
```

**3. Edge Function timeout**
```typescript
// Increase timeout (max 150s)
// In function config
{ "timeout": 150 }
```

## Next Steps

1. **Read** `/supabase/docs/01-core-architecture.md` for system overview
2. **Review** `/supabase/docs/03-entity-relationships.md` for ERD diagrams
3. **Implement** following `/supabase/docs/06-implementation-order.md`
4. **Test** with local Supabase instance
5. **Deploy** to production

## Support

- **Supabase Docs**: https://supabase.com/docs
- **pgvector**: https://github.com/pgvector/pgvector
- **Gemini AI**: https://ai.google.dev/docs

## License

Proprietary - Local Scout AI Platform

---

**Last Updated:** 2025-01-22  
**Schema Version:** 1.0.0  
**Status:** Production Ready
