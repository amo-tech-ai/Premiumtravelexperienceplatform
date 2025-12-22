-- ============================================================================
-- QUICK FIX: Create locations table and seed demo data
-- ============================================================================
-- Run this in Supabase SQL Editor to fix "table not found" error
-- Time: 2 minutes
-- ============================================================================

-- Step 1: Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Create helper function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Create profiles table (if not exists)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 4: Create locations table
CREATE TABLE IF NOT EXISTS locations (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- External identifiers
  google_place_id TEXT UNIQUE,
  yelp_id TEXT,
  ticketmaster_id TEXT,
  external_id TEXT,
  source TEXT NOT NULL CHECK (source IN ('google', 'yelp', 'ticketmaster', 'manual', 'ai_generated')),
  
  -- Basic info
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('restaurant', 'event', 'rental', 'poi', 'hotel', 'activity')),
  subcategory TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Location
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Contact
  phone TEXT,
  website TEXT,
  email TEXT,
  
  -- Media
  primary_image_url TEXT,
  images JSONB,
  
  -- Details (category-specific)
  details JSONB,
  
  -- Restaurant-specific
  cuisine_types TEXT[],
  price_level INTEGER CHECK (price_level >= 1 AND price_level <= 4),
  dietary_options TEXT[],
  ambiance TEXT[],
  opening_hours TEXT,
  reservation_url TEXT,
  
  -- Event-specific
  event_start_time TIMESTAMPTZ,
  event_end_time TIMESTAMPTZ,
  event_type TEXT,
  ticket_url TEXT,
  price_range TEXT,
  capacity INTEGER,
  
  -- Rental-specific
  vehicle_type TEXT,
  rental_features TEXT[],
  hourly_rate DECIMAL(10, 2),
  daily_rate DECIMAL(10, 2),
  passenger_capacity INTEGER,
  luggage_capacity INTEGER,
  transmission TEXT,
  fuel_type TEXT,
  year INTEGER,
  mileage_limit INTEGER,
  
  -- Ratings
  rating DECIMAL(3, 2),
  rating_count INTEGER DEFAULT 0,
  
  -- Hours
  hours_of_operation JSONB,
  is_open_now BOOLEAN,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  
  -- Cache metadata
  data_freshness TIMESTAMPTZ DEFAULT NOW(),
  cache_expires_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Step 5: Create indexes
CREATE INDEX IF NOT EXISTS idx_locations_category ON locations(category);
CREATE INDEX IF NOT EXISTS idx_locations_city ON locations(city) WHERE city IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_locations_active ON locations(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_locations_event_time ON locations(event_start_time, event_end_time) WHERE category = 'event';

-- Step 6: Enable RLS
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Step 7: Create RLS policies
DROP POLICY IF EXISTS "Locations are viewable by everyone" ON locations;
CREATE POLICY "Locations are viewable by everyone"
  ON locations FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Service can manage locations" ON locations;
CREATE POLICY "Service can manage locations"
  ON locations FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- Step 8: Create trigger
DROP TRIGGER IF EXISTS update_locations_updated_at ON locations;
CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED DEMO DATA
-- ============================================================================

-- Clear existing demo data (optional)
-- DELETE FROM locations WHERE source = 'manual';

-- Insert Events
INSERT INTO locations (
  name, category, event_type, description, address, city, country,
  event_start_time, event_end_time, primary_image_url, source, is_active
) VALUES
(
  'Medellín Music Festival',
  'event',
  'concert',
  'The biggest music festival in Colombia featuring international and local artists across multiple genres',
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
  'Annual flower festival celebrating Medellín''s culture with parades, concerts, and flower displays',
  'Multiple locations across Medellín',
  'Medellín',
  'Colombia',
  '2025-08-01 10:00:00+00',
  '2025-08-10 20:00:00+00',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=1200',
  'manual',
  true
),
(
  'Colombiamoda Fashion Week',
  'event',
  'fashion',
  'Latin America''s premier fashion event showcasing Colombian designers',
  'Plaza Mayor Convention Center',
  'Medellín',
  'Colombia',
  '2025-07-25 14:00:00+00',
  '2025-07-27 22:00:00+00',
  'https://images.unsplash.com/photo-1558769132-cb1aea8f4477?auto=format&fit=crop&q=80&w=1200',
  'manual',
  true
);

-- Insert Restaurants
INSERT INTO locations (
  name, category, cuisine_types, price_level, rating, description,
  address, city, country, phone, website, primary_image_url,
  dietary_options, source, is_active
) VALUES
(
  'Carmen',
  'restaurant',
  ARRAY['Colombian', 'Contemporary', 'Fine Dining'],
  4,
  4.8,
  'Award-winning fine dining restaurant showcasing Colombian ingredients with modern techniques in a colonial house',
  'Carrera 36 #10A-27, El Poblado',
  'Medellín',
  'Colombia',
  '+57 4 311 6658',
  'https://carmen.com.co',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1200',
  ARRAY['Vegetarian Options', 'Gluten-free Options'],
  'manual',
  true
),
(
  'El Cielo',
  'restaurant',
  ARRAY['Colombian', 'Fusion', 'Molecular'],
  4,
  4.9,
  'Sensory dining experience combining Colombian flavors with molecular gastronomy techniques',
  'Calle 9 Sur #43B-95, El Poblado',
  'Medellín',
  'Colombia',
  '+57 4 268 3485',
  'https://elcielo.com.co',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
  ARRAY['Vegetarian Options'],
  'manual',
  true
),
(
  'Oci.Mde',
  'restaurant',
  ARRAY['Peruvian', 'Seafood', 'Contemporary'],
  3,
  4.7,
  'Modern Peruvian cuisine with fresh seafood and creative cocktails',
  'Carrera 37 #8A-32, El Poblado',
  'Medellín',
  'Colombia',
  '+57 4 444 4448',
  'https://ocimde.com',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1200',
  ARRAY['Pescatarian Options', 'Gluten-free Options'],
  'manual',
  true
);

-- Insert Rentals
INSERT INTO locations (
  name, category, vehicle_type, daily_rate, description,
  address, city, country, phone, primary_image_url,
  rental_features, passenger_capacity, transmission, fuel_type,
  source, is_active
) VALUES
(
  'Toyota Fortuner 2024 - SUV',
  'rental',
  'suv',
  75.00,
  'Spacious 7-seater SUV perfect for exploring Colombia. Includes GPS, AC, and full insurance.',
  'Calle 10 #43-33, El Poblado',
  'Medellín',
  'Colombia',
  '+57 300 123 4567',
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200',
  ARRAY['GPS Navigation', 'Air Conditioning', 'Bluetooth Audio', 'Backup Camera', 'Full Insurance'],
  7,
  'Automatic',
  'Gasoline',
  'manual',
  true
),
(
  'Honda PCX 150 Scooter',
  'rental',
  'scooter',
  25.00,
  'Perfect for navigating Medellín traffic. Easy to park, fuel efficient, helmet and lock included.',
  'Carrera 70 #44-10, Laureles',
  'Medellín',
  'Colombia',
  '+57 300 987 6543',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1200',
  ARRAY['Helmet Included', 'Under-seat Storage', 'Fuel Efficient', 'Lock Included'],
  2,
  'Automatic',
  'Gasoline',
  'manual',
  true
),
(
  'Trek Mountain Bike',
  'rental',
  'bicycle',
  15.00,
  'High-quality mountain bike for exploring Medellín''s ciclovía and parks. Helmet and lock included.',
  'Calle 33 #70-30, Laureles',
  'Medellín',
  'Colombia',
  '+57 311 555 7788',
  'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&q=80&w=1200',
  ARRAY['Helmet Included', 'Lock Included', 'Repair Kit', 'Water Bottle Holder'],
  1,
  'Manual',
  'None',
  'manual',
  true
);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check table exists
SELECT 'locations table created' AS status, COUNT(*) AS row_count FROM locations;

-- Verify data by category
SELECT 
  category,
  COUNT(*) AS count,
  ARRAY_AGG(name ORDER BY name) AS items
FROM locations
WHERE is_active = true
GROUP BY category
ORDER BY category;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Database setup complete!';
  RAISE NOTICE '✅ locations table created';
  RAISE NOTICE '✅ Demo data inserted';
  RAISE NOTICE '✅ Indexes created';
  RAISE NOTICE '✅ RLS policies enabled';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Next steps:';
  RAISE NOTICE '1. Refresh your frontend application';
  RAISE NOTICE '2. Navigate to /events to see demo events';
  RAISE NOTICE '3. Navigate to /restaurants to see demo restaurants';
  RAISE NOTICE '4. Navigate to /rentals to see demo rentals';
END $$;
