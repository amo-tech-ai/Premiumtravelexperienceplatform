# 🚨 DEPLOYMENT REQUIRED - ONE CRITICAL STEP

## ✅ Code Errors FIXED

The import errors have been resolved:
- ✅ Removed deleted file imports from `/supabase/functions/server/index.tsx`
- ✅ Updated unified search route to use new database services
- ✅ Edge Function will now deploy successfully

## 🔴 Still Need to Run: SQL Migrations

**The database tables don't exist yet!** You must manually run the SQL migrations.

### How to Run SQL Migrations

**Open:** Supabase Dashboard → SQL Editor

**Run these 3 scripts in order:**

```sql
-- 1. COPY/PASTE: /supabase/schemas/001_locations_core.sql
-- Creates tables + triggers + indexes

-- 2. COPY/PASTE: /supabase/schemas/002_rls_policies.sql
-- Enables row-level security

-- 3. COPY/PASTE: /supabase/schemas/003_seed_demo_data.sql
-- Seeds 3 locations, 3 events, 3 restaurants, 3 rentals
```

**This will fix:** `Could not find the table 'public.locations' in the schema cache`

---

## After Both Steps

1. **Function will auto-redeploy** (or manually trigger deploy)
2. **Test endpoints:**
   - GET `/events` → should return 3 Medellín events
   - GET `/restaurants` → should return 3 restaurants
   - GET `/rentals` → should return 3 rentals

---

## Why This Happened

- The migration created new services but didn't clean up old imports
- The tables don't exist until you manually run the SQL migrations
- Figma Make can't auto-run SQL migrations (must be done in Supabase Dashboard)

---

## Next: Verify Everything Works

After completing both steps, check:

```bash
curl https://YOUR-PROJECT.supabase.co/functions/v1/make-server-fd8c4bf7/events
```

Expected: JSON with 3 events, each with nested location data.