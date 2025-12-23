# SUPABASE MIGRATION README
## Database Migration Guide

**Document:** 07-migration-readme.md  
**Last Updated:** December 22, 2024  
**Purpose:** Guide for migrating from KV store to Supabase PostgreSQL

---

## 🎯 MIGRATION OVERVIEW

### Current State
- **From:** KV Store (key-value pairs)
- **To:** Supabase PostgreSQL (normalized tables)
- **Status:** Backend 100%, Deployment pending

### Key Changes
1. **Schema:** Normalized relational database
2. **APIs:** Updated to use SQL queries
3. **RLS:** Row-Level Security policies
4. **Indexes:** Optimized for performance

---

## 📊 SCHEMA MIGRATION

### Old (KV Store)
```typescript
Key: "trips:{userId}:{tripId}"
Value: { ...tripData }
```

### New (PostgreSQL)
```sql
CREATE TABLE trips (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  destination TEXT,
  start_date DATE,
  end_date DATE,
  ...
);
```

---

## 🔄 MIGRATION STEPS

### 1. Schema Creation
```bash
# Run schema migrations
psql -f /supabase/schemas/001_locations_core.sql
psql -f /supabase/schemas/002_rls_policies.sql
psql -f /supabase/schemas/003_seed_demo_data.sql
```

### 2. Data Migration
- Export data from KV store
- Transform to SQL format
- Import into PostgreSQL
- Verify data integrity

### 3. API Updates
- Update backend services
- Switch to new DB functions
- Test all endpoints
- Deploy changes

### 4. Validation
- Compare data counts
- Test CRUD operations
- Verify RLS policies
- Performance testing

---

## ⚠️ CRITICAL REQUIREMENTS

### Before Migration
- [ ] Backup all KV data
- [ ] Test migration in dev
- [ ] Document rollback plan
- [ ] Notify users of downtime

### During Migration
- [ ] Maintenance mode ON
- [ ] Run migrations
- [ ] Verify data
- [ ] Test endpoints

### After Migration
- [ ] Monitoring active
- [ ] Performance metrics
- [ ] User feedback
- [ ] Rollback ready

---

## 📁 FILES CREATED

### Schema Files
1. `001_locations_core.sql` - Core tables
2. `002_rls_policies.sql` - Security policies
3. `003_seed_demo_data.sql` - Demo data

### Service Files
1. `db-locations-service.ts` - Locations API
2. `db-events-service.ts` - Events API
3. `db-restaurants-service.ts` - Restaurants API
4. `db-rentals-service.ts` - Rentals API

---

## 🔐 SECURITY

### RLS Policies
- Users can only access their own data
- Public data readable by all
- Admin override for support

### API Security
- JWT validation on all endpoints
- Rate limiting per user
- Input sanitization
- SQL injection prevention

---

**Document Location:** `/docs/supabase/07-migration-readme.md`  
**Previous Location:** `/docs/SUPABASE-MIGRATION-README.md`  
**Migration Status:** See `/docs/roadmap/DATABASE-MIGRATION-STATUS.md`
