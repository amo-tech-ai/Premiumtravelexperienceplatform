-- ============================================================================
-- CORE SCHEMA: Places & Saved Locations
-- ============================================================================
-- Description: Normalized places data (events, restaurants, rentals, POIs)
-- Phase: Core (Phase 1)
-- Dependencies: profiles
-- ============================================================================

-- Enable PostGIS for geospatial queries (optional but recommended)
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================================================
-- TABLE: locations
-- ============================================================================
-- Description: Normalized location/place data from various sources
-- RLS: Public read, service write
-- ============================================================================

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
  -- geom GEOGRAPHY(POINT, 4326), -- PostGIS geometry (uncomment if using PostGIS)
  
  -- Contact
  phone TEXT,
  website TEXT,
  email TEXT,
  
  -- Media
  primary_image_url TEXT,
  images JSONB, -- Array of image URLs
  
  -- Details (category-specific)
  details JSONB, -- Flexible JSON for category-specific data
  
  -- Restaurant-specific
  cuisine_types TEXT[],
  price_level INTEGER CHECK (price_level >= 1 AND price_level <= 4),
  dietary_options TEXT[], -- ['vegetarian', 'vegan', 'gluten-free']
  ambiance TEXT[],
  
  -- Event-specific
  event_start_time TIMESTAMPTZ,
  event_end_time TIMESTAMPTZ,
  event_type TEXT,
  ticket_url TEXT,
  
  -- Rental-specific
  vehicle_type TEXT,
  rental_features TEXT[],
  hourly_rate DECIMAL(10, 2),
  daily_rate DECIMAL(10, 2),
  
  -- Ratings
  rating DECIMAL(3, 2),
  rating_count INTEGER DEFAULT 0,
  
  -- Hours
  hours_of_operation JSONB, -- { "monday": { "open": "09:00", "close": "22:00" }, ... }
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

-- ============================================================================
-- TABLE: saved_places
-- ============================================================================
-- Description: User-saved places (favorites, wishlist)
-- RLS: Enabled (users can only manage their own saved places)
-- ============================================================================

CREATE TABLE IF NOT EXISTS saved_places (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  
  -- Organization
  collection_name TEXT DEFAULT 'default',
  is_favorite BOOLEAN DEFAULT false,
  
  -- User notes
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- User rating
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  
  -- Visit tracking
  visited BOOLEAN DEFAULT false,
  visit_date DATE,
  visit_count INTEGER DEFAULT 0,
  
  -- Reminders
  reminder_date TIMESTAMPTZ,
  reminder_sent BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT saved_places_user_location_unique UNIQUE (user_id, location_id)
);

-- ============================================================================
-- TABLE: collections
-- ============================================================================
-- Description: User-created collections of places
-- RLS: Enabled (users can only manage their own collections)
-- ============================================================================

CREATE TABLE IF NOT EXISTS collections (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Collection info
  name TEXT NOT NULL,
  description TEXT,
  emoji TEXT,
  color TEXT,
  
  -- Visibility
  is_public BOOLEAN DEFAULT false,
  is_collaborative BOOLEAN DEFAULT false,
  
  -- Stats
  place_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT collections_user_name_unique UNIQUE (user_id, name)
);

-- ============================================================================
-- TABLE: search_cache
-- ============================================================================
-- Description: Cache for AI search results to improve performance
-- RLS: Public read, service write
-- ============================================================================

CREATE TABLE IF NOT EXISTS search_cache (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Query
  query_hash TEXT NOT NULL UNIQUE, -- MD5 hash of normalized query params
  query_params JSONB NOT NULL,
  
  -- Results
  results JSONB NOT NULL, -- Array of place IDs + metadata
  result_count INTEGER NOT NULL,
  
  -- AI metadata
  ai_model TEXT,
  grounding_used BOOLEAN DEFAULT false,
  
  -- Cache control
  expires_at TIMESTAMPTZ NOT NULL,
  hit_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Locations
CREATE INDEX IF NOT EXISTS idx_locations_category ON locations(category);
CREATE INDEX IF NOT EXISTS idx_locations_city ON locations(city) WHERE city IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_locations_lat_lng ON locations(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_locations_google_place_id ON locations(google_place_id) WHERE google_place_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_locations_tags ON locations USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_locations_cuisine ON locations USING GIN(cuisine_types) WHERE category = 'restaurant';
CREATE INDEX IF NOT EXISTS idx_locations_rating ON locations(rating DESC) WHERE rating IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_locations_active ON locations(is_active) WHERE is_active = true;

-- Event time range queries
CREATE INDEX IF NOT EXISTS idx_locations_event_time ON locations(event_start_time, event_end_time) WHERE category = 'event';

-- PostGIS spatial index (uncomment if using PostGIS)
-- CREATE INDEX IF NOT EXISTS idx_locations_geom ON locations USING GIST(geom);

-- Saved Places
CREATE INDEX IF NOT EXISTS idx_saved_places_user_id ON saved_places(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_places_location_id ON saved_places(location_id);
CREATE INDEX IF NOT EXISTS idx_saved_places_collection ON saved_places(user_id, collection_name);
CREATE INDEX IF NOT EXISTS idx_saved_places_favorites ON saved_places(user_id) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS idx_saved_places_reminders ON saved_places(reminder_date) WHERE reminder_sent = false AND reminder_date IS NOT NULL;

-- Collections
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_public ON collections(is_public) WHERE is_public = true;

-- Search Cache
CREATE INDEX IF NOT EXISTS idx_search_cache_hash ON search_cache(query_hash);
CREATE INDEX IF NOT EXISTS idx_search_cache_expires ON search_cache(expires_at);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Locations (public read)
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Locations are viewable by everyone"
  ON locations FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service can manage locations"
  ON locations FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Saved Places
ALTER TABLE saved_places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved places"
  ON saved_places FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create saved places"
  ON saved_places FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved places"
  ON saved_places FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved places"
  ON saved_places FOR DELETE
  USING (auth.uid() = user_id);

-- Collections
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own collections"
  ON collections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Public collections viewable by all"
  ON collections FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can manage own collections"
  ON collections FOR ALL
  USING (auth.uid() = user_id);

-- Search Cache (public read)
ALTER TABLE search_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Search cache viewable by everyone"
  ON search_cache FOR SELECT
  USING (expires_at > NOW());

CREATE POLICY "Service can manage search cache"
  ON search_cache FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update timestamps
CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_places_updated_at
  BEFORE UPDATE ON saved_places
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update search cache access time
CREATE OR REPLACE FUNCTION update_search_cache_access()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_accessed_at = NOW();
  NEW.hit_count = OLD.hit_count + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_search_cache_accessed
  BEFORE UPDATE ON search_cache
  FOR EACH ROW
  EXECUTE FUNCTION update_search_cache_access();

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function: Find nearby places (without PostGIS)
CREATE OR REPLACE FUNCTION find_nearby_places(
  p_latitude DECIMAL,
  p_longitude DECIMAL,
  p_radius_km DECIMAL DEFAULT 5.0,
  p_category TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  category TEXT,
  distance_km DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id,
    l.name,
    l.category,
    (
      6371 * acos(
        cos(radians(p_latitude)) *
        cos(radians(l.latitude)) *
        cos(radians(l.longitude) - radians(p_longitude)) +
        sin(radians(p_latitude)) *
        sin(radians(l.latitude))
      )
    )::DECIMAL(10, 2) AS distance_km
  FROM locations l
  WHERE
    l.is_active = true
    AND l.latitude IS NOT NULL
    AND l.longitude IS NOT NULL
    AND (p_category IS NULL OR l.category = p_category)
  ORDER BY distance_km
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE locations IS 'Normalized place data from all sources (Google, Yelp, etc.)';
COMMENT ON TABLE saved_places IS 'User-saved places (favorites, wishlist)';
COMMENT ON TABLE collections IS 'User-created collections of places';
COMMENT ON TABLE search_cache IS 'Cache for AI search results';
COMMENT ON FUNCTION find_nearby_places IS 'Find places within radius using haversine distance';
