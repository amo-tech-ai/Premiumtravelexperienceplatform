# 🔧 DATABASE SETUP REQUIRED

## ERROR DIAGNOSIS

```
Error: Could not find the table 'public.locations' in the schema cache
```

**Cause:** The `locations` table has not been created in the Supabase database yet.

**Solution:** Run the SQL schema migration to create the table.

---

## STEP-BY-STEP FIX

### Step 1: Access Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project: **zkwcbyxiwklihegjhuql**
3. Click **SQL Editor** in the left sidebar

### Step 2: Run Core Schema Migration

Copy and paste the contents of `/supabase/schemas/03-core-places.sql` into the SQL Editor and click **Run**.

This will create:
- ✅ `locations` table (events, restaurants, rentals)
- ✅ `saved_places` table
- ✅ `collections` table
- ✅ `search_cache` table
- ✅ Indexes for performance
- ✅ RLS policies
- ✅ Triggers for updated_at

### Step 3: Verify Table Creation

Run this query to verify:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'locations';
```

Expected result: Should return `locations`

### Step 4: Check Profiles Table Exists

The schema references `profiles` table. Verify it exists:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'profiles';
```

If it doesn't exist, run `/supabase/schemas/01-core-auth.sql` first.

### Step 5: Seed Demo Data (Optional)

To test the system immediately, you can add some demo data:

```sql
-- Insert demo events
INSERT INTO locations (
  name, 
  category, 
  event_type, 
  description, 
  address, 
  city, 
  country,
  event_start_time,
  event_end_time,
  primary_image_url,
  source,
  is_active
) VALUES
(
  'Medellín Music Festival',
  'event',
  'concert',
  'The biggest music festival in Colombia featuring international and local artists',
  'Plaza Mayor, Calle 41',
  'Medellín',
  'Colombia',
  '2025-03-15 19:00:00+00',
  '2025-03-15 23:00:00+00',
  'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1200',
  'manual',
  true
),
(
  'Feria de las Flores',
  'event',
  'festival',
  'Annual flower festival celebrating Medellín''s culture',
  'Multiple locations',
  'Medellín',
  'Colombia',
  '2025-08-01 10:00:00+00',
  '2025-08-10 20:00:00+00',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=1200',
  'manual',
  true
);

-- Insert demo restaurants
INSERT INTO locations (
  name,
  category,
  cuisine_types,
  price_level,
  rating,
  description,
  address,
  city,
  country,
  phone,
  website,
  primary_image_url,
  source,
  is_active
) VALUES
(
  'Carmen',
  'restaurant',
  ARRAY['Colombian', 'Contemporary'],
  4,
  4.8,
  'Fine dining restaurant showcasing Colombian ingredients with modern techniques',
  'Carrera 36 #10A-27',
  'Medellín',
  'Colombia',
  '+57 4 311 6658',
  'https://carmen.com.co',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1200',
  'manual',
  true
),
(
  'El Cielo',
  'restaurant',
  ARRAY['Colombian', 'Fusion'],
  4,
  4.9,
  'Sensory dining experience with molecular gastronomy',
  'Calle 9 Sur #43B-95',
  'Medellín',
  'Colombia',
  '+57 4 268 3485',
  'https://elcielo.com.co',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
  'manual',
  true
);

-- Insert demo rentals
INSERT INTO locations (
  name,
  category,
  vehicle_type,
  daily_rate,
  description,
  address,
  city,
  country,
  phone,
  primary_image_url,
  rental_features,
  source,
  is_active
) VALUES
(
  'Toyota Fortuner 2024',
  'rental',
  'SUV',
  75.00,
  'Spacious SUV perfect for exploring Colombia. Automatic transmission, AC, GPS included.',
  'Calle 10 #43-33',
  'Medellín',
  'Colombia',
  '+57 300 123 4567',
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200',
  ARRAY['GPS', 'Air Conditioning', 'Automatic', 'Bluetooth'],
  'manual',
  true
),
(
  'Honda PCX 150 Scooter',
  'rental',
  'scooter',
  25.00,
  'Perfect for navigating Medellín traffic. Easy to park, fuel efficient.',
  'Carrera 70 #44-10',
  'Medellín',
  'Colombia',
  '+57 300 987 6543',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1200',
  ARRAY['Helmet Included', 'Under-seat Storage', 'Fuel Efficient'],
  'manual',
  true
);
```

### Step 6: Test Endpoints

Once tables are created, test the endpoints:

```bash
# Test events
curl https://zkwcbyxiwklihegjhuql.supabase.co/functions/v1/make-server-fd8c4bf7/events \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Test restaurants
curl https://zkwcbyxiwklihegjhuql.supabase.co/functions/v1/make-server-fd8c4bf7/restaurants \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Test rentals
curl https://zkwcbyxiwklihegjhuql.supabase.co/functions/v1/make-server-fd8c4bf7/rentals \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Step 7: Reload Frontend

After creating tables and seeding data:
1. Refresh the browser
2. Navigate to /events
3. Should see data loading correctly

---

## ALTERNATIVE: Check for Existing Tables

If tables might already exist but with different schema, run this to check:

```sql
-- Check all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check locations table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'locations'
ORDER BY ordinal_position;
```

---

## TROUBLESHOOTING

### Issue: "profiles table does not exist"

**Solution:** Run profiles schema first:
```sql
-- Create profiles table (if not exists)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Issue: "function update_updated_at_column does not exist"

**Solution:** Create the function first:
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## VERIFICATION CHECKLIST

After running the schema:

- [ ] `locations` table exists
- [ ] `saved_places` table exists
- [ ] `collections` table exists
- [ ] `search_cache` table exists
- [ ] RLS policies are enabled
- [ ] Indexes are created
- [ ] Sample data inserted (optional)
- [ ] Server endpoints return 200 OK
- [ ] Frontend loads without errors

---

## FILES TO RUN IN ORDER

1. `/supabase/schemas/01-core-auth.sql` (if profiles doesn't exist)
2. `/supabase/schemas/03-core-places.sql` ← **THIS ONE FIXES THE ERROR**
3. Seed data (SQL above, optional)

---

## STATUS

**Current:** ❌ Table doesn't exist  
**After Fix:** ✅ Table exists + Sample data  
**Time:** 5-10 minutes  

