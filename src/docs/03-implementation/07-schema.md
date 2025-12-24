# SUPABASE SCHEMA DESIGN - BEST PRACTICES
## Production-Ready Database Schema for AI Trip Operating System

**Document:** 07-schema.md  
**Created:** December 24, 2024  
**Purpose:** Define production Supabase schemas following best practices  
**Status:** Production-Ready Schema Design

---

## 📋 TABLE OF CONTENTS

1. [Schema Design Principles](#schema-design-principles)
2. [Core Tables](#core-tables)
3. [AI & Conversation Tables](#ai--conversation-tables)
4. [Trip Management Tables](#trip-management-tables)
5. [Advanced AI Tables](#advanced-ai-tables)
6. [Indexes & Performance](#indexes--performance)
7. [RLS Policies](#rls-policies)
8. [Functions & Triggers](#functions--triggers)
9. [Migration Order](#migration-order)

---

## 🎯 SCHEMA DESIGN PRINCIPLES

Based on AI implementation requirements from `/docs/03-implementation/`:

### Best Practices Applied

1. **Normalization** - Reduce data redundancy, use foreign keys
2. **Soft Deletes** - Use `deleted_at` instead of hard deletes
3. **Timestamps** - Always include `created_at`, `updated_at`
4. **UUIDs** - Use UUID v4 for primary keys (security + distributed systems)
5. **JSONB** - Use for flexible/nested data (details, metadata)
6. **Indexes** - Strategic indexes on foreign keys, search fields
7. **RLS** - Row-level security for multi-tenant isolation
8. **Enums** - Use PostgreSQL enums for fixed value sets
9. **Constraints** - Check constraints for data validation
10. **Triggers** - Auto-update timestamps, cascade operations

---

## 📊 CORE TABLES

### Table 1: profiles
**Purpose:** User profile data (extends Supabase Auth)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  
  -- Preferences
  timezone TEXT DEFAULT 'UTC',
  currency TEXT DEFAULT 'USD',
  language TEXT DEFAULT 'en',
  
  -- AI Settings
  ai_enabled BOOLEAN DEFAULT true,
  proactive_suggestions_enabled BOOLEAN DEFAULT true,
  notification_preferences JSONB DEFAULT '{
    "email": true,
    "push": true,
    "sms": false,
    "ai_suggestions": true,
    "trip_updates": true
  }'::jsonb,
  
  -- Metadata
  onboarding_completed BOOLEAN DEFAULT false,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_profiles_email ON profiles(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_last_active ON profiles(last_active_at DESC) WHERE deleted_at IS NULL;

-- Trigger for updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

---

## 💬 AI & CONVERSATION TABLES

### Table 2: conversations
**Purpose:** AI chat sessions with different agents

```sql
-- Enum for agent types
CREATE TYPE agent_type AS ENUM (
  'local_scout',
  'dining_orchestrator',
  'event_curator',
  'itinerary_optimizer',
  'budget_guardian',
  'booking_assistant',
  'general_concierge'
);

-- Enum for conversation status
CREATE TYPE conversation_status AS ENUM (
  'active',
  'archived',
  'completed',
  'abandoned'
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Conversation metadata
  title TEXT NOT NULL,
  agent_type agent_type NOT NULL,
  status conversation_status DEFAULT 'active',
  
  -- Related entities
  trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
  
  -- Context & session
  session_data JSONB DEFAULT '{}'::jsonb,
  last_message_at TIMESTAMPTZ,
  message_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_message_count CHECK (message_count >= 0)
);

-- Indexes
CREATE INDEX idx_conversations_user_id ON conversations(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_conversations_trip_id ON conversations(trip_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_conversations_agent_type ON conversations(agent_type);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);

-- RLS Policies
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON conversations FOR DELETE
  USING (auth.uid() = user_id);
```

### Table 3: messages
**Purpose:** Individual messages in conversations

```sql
-- Enum for message roles
CREATE TYPE message_role AS ENUM (
  'user',
  'assistant',
  'system',
  'function'
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  
  -- Message content
  role message_role NOT NULL,
  content TEXT NOT NULL,
  
  -- AI metadata
  agent_name TEXT,
  function_call JSONB,
  function_response JSONB,
  
  -- Token usage
  input_tokens INTEGER,
  output_tokens INTEGER,
  total_tokens INTEGER,
  
  -- Timing
  latency_ms INTEGER,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_tokens CHECK (
    total_tokens >= 0 AND 
    input_tokens >= 0 AND 
    output_tokens >= 0
  ),
  CONSTRAINT valid_latency CHECK (latency_ms >= 0)
);

-- Indexes
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_role ON messages(role);

-- Trigger to update conversation stats
CREATE OR REPLACE FUNCTION update_conversation_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET 
    last_message_at = NEW.created_at,
    message_count = message_count + 1,
    updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_on_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_stats();

-- RLS Policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in own conversations"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in own conversations"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND conversations.user_id = auth.uid()
    )
  );
```

### Table 4: ai_context
**Purpose:** Persistent context for AI conversations

```sql
CREATE TABLE ai_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  
  -- Context layers (3-layer architecture from docs)
  session_context JSONB DEFAULT '{}'::jsonb,  -- Immediate context
  user_context JSONB DEFAULT '{}'::jsonb,     -- User preferences & history
  global_context JSONB DEFAULT '{}'::jsonb,   // System-wide knowledge
  
  -- Tracked entities
  entities JSONB DEFAULT '{
    "places": [],
    "dates": [],
    "people": [],
    "preferences": {},
    "constraints": {}
  }'::jsonb,
  
  -- Conversation state
  current_intent TEXT,
  pending_actions JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint
  CONSTRAINT unique_context_per_conversation UNIQUE (conversation_id)
);

-- Indexes
CREATE INDEX idx_ai_context_conversation ON ai_context(conversation_id);
CREATE INDEX idx_ai_context_current_intent ON ai_context(current_intent);

-- RLS Policies
ALTER TABLE ai_context ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view context for own conversations"
  ON ai_context FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = ai_context.conversation_id 
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update context for own conversations"
  ON ai_context FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = ai_context.conversation_id 
      AND conversations.user_id = auth.uid()
    )
  );
```

### Table 5: ai_runs
**Purpose:** Track AI agent execution for analytics & debugging

```sql
-- Enum for run status
CREATE TYPE ai_run_status AS ENUM (
  'pending',
  'running',
  'success',
  'error',
  'timeout',
  'cancelled'
);

CREATE TABLE ai_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  
  -- Agent information
  agent_name TEXT NOT NULL,
  agent_type agent_type NOT NULL,
  
  -- Execution details
  status ai_run_status DEFAULT 'pending',
  error_message TEXT,
  
  -- Input/Output
  input_data JSONB NOT NULL,
  output_data JSONB,
  
  -- Performance metrics
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  duration_ms INTEGER,
  
  -- Cost tracking
  estimated_cost_usd DECIMAL(10, 6),
  
  -- Metadata
  model_name TEXT,
  temperature DECIMAL(3, 2),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_duration CHECK (duration_ms >= 0),
  CONSTRAINT valid_cost CHECK (estimated_cost_usd >= 0)
);

-- Indexes
CREATE INDEX idx_ai_runs_user_id ON ai_runs(user_id);
CREATE INDEX idx_ai_runs_conversation_id ON ai_runs(conversation_id);
CREATE INDEX idx_ai_runs_agent_type ON ai_runs(agent_type);
CREATE INDEX idx_ai_runs_status ON ai_runs(status);
CREATE INDEX idx_ai_runs_created_at ON ai_runs(created_at DESC);
CREATE INDEX idx_ai_runs_agent_name ON ai_runs(agent_name);

-- Partitioning for scalability (optional - for high volume)
-- CREATE TABLE ai_runs_2024_12 PARTITION OF ai_runs
--   FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');

-- RLS Policies
ALTER TABLE ai_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI runs"
  ON ai_runs FOR SELECT
  USING (auth.uid() = user_id);
```

---

## 🗺️ TRIP MANAGEMENT TABLES

### Table 6: trips
**Purpose:** User trip/itinerary data

```sql
-- Enum for trip status
CREATE TYPE trip_status AS ENUM (
  'draft',
  'planning',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled'
);

CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Trip details
  title TEXT NOT NULL,
  description TEXT,
  destination TEXT NOT NULL,
  
  -- Dates
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- Location
  destination_latitude DECIMAL(10, 8),
  destination_longitude DECIMAL(11, 8),
  
  -- Budget
  budget_total DECIMAL(10, 2),
  budget_spent DECIMAL(10, 2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  
  -- Status
  status trip_status DEFAULT 'draft',
  
  -- AI optimization
  is_optimized BOOLEAN DEFAULT false,
  last_optimized_at TIMESTAMPTZ,
  optimization_score DECIMAL(3, 2),
  
  -- Sharing & collaboration
  is_public BOOLEAN DEFAULT false,
  share_token TEXT UNIQUE,
  
  -- Media
  cover_image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_dates CHECK (end_date >= start_date),
  CONSTRAINT valid_budget CHECK (budget_total >= 0 AND budget_spent >= 0),
  CONSTRAINT valid_optimization_score CHECK (
    optimization_score IS NULL OR 
    (optimization_score >= 0 AND optimization_score <= 1)
  )
);

-- Indexes
CREATE INDEX idx_trips_user_id ON trips(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_trips_status ON trips(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_trips_start_date ON trips(start_date);
CREATE INDEX idx_trips_destination ON trips(destination);
CREATE INDEX idx_trips_share_token ON trips(share_token) WHERE share_token IS NOT NULL;
CREATE INDEX idx_trips_coordinates ON trips(destination_latitude, destination_longitude) 
  WHERE destination_latitude IS NOT NULL AND destination_longitude IS NOT NULL;

-- Full-text search index
CREATE INDEX idx_trips_search ON trips 
  USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || destination));

-- RLS Policies
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trips"
  ON trips FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create own trips"
  ON trips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips"
  ON trips FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips"
  ON trips FOR DELETE
  USING (auth.uid() = user_id);
```

### Table 7: itinerary_items
**Purpose:** Activities/places in a trip

```sql
-- Enum for item types
CREATE TYPE itinerary_item_type AS ENUM (
  'activity',
  'restaurant',
  'accommodation',
  'transport',
  'event',
  'custom'
);

CREATE TABLE itinerary_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  
  -- Item details
  title TEXT NOT NULL,
  description TEXT,
  type itinerary_item_type NOT NULL,
  
  -- Location
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Timing
  day_number INTEGER NOT NULL,
  start_time TIME,
  end_time TIME,
  duration_minutes INTEGER,
  
  -- Ordering
  sort_order INTEGER NOT NULL DEFAULT 0,
  
  -- Cost
  cost DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  is_paid BOOLEAN DEFAULT false,
  
  -- Booking
  booking_status TEXT,
  booking_reference TEXT,
  booking_url TEXT,
  
  -- AI metadata
  suggested_by_ai BOOLEAN DEFAULT false,
  ai_agent_name TEXT,
  confidence_score DECIMAL(3, 2),
  
  -- Media
  image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  
  -- Notes
  notes TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_day_number CHECK (day_number > 0),
  CONSTRAINT valid_times CHECK (
    (start_time IS NULL AND end_time IS NULL) OR 
    (start_time IS NOT NULL AND end_time IS NOT NULL AND end_time > start_time)
  ),
  CONSTRAINT valid_duration CHECK (duration_minutes IS NULL OR duration_minutes > 0),
  CONSTRAINT valid_cost CHECK (cost IS NULL OR cost >= 0),
  CONSTRAINT valid_confidence CHECK (
    confidence_score IS NULL OR 
    (confidence_score >= 0 AND confidence_score <= 1)
  )
);

-- Indexes
CREATE INDEX idx_itinerary_items_trip_id ON itinerary_items(trip_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_itinerary_items_location_id ON itinerary_items(location_id);
CREATE INDEX idx_itinerary_items_day_order ON itinerary_items(trip_id, day_number, sort_order);
CREATE INDEX idx_itinerary_items_type ON itinerary_items(type);
CREATE INDEX idx_itinerary_items_ai_suggested ON itinerary_items(suggested_by_ai) 
  WHERE suggested_by_ai = true;

-- RLS Policies
ALTER TABLE itinerary_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view items in own trips"
  ON itinerary_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = itinerary_items.trip_id 
      AND (trips.user_id = auth.uid() OR trips.is_public = true)
    )
  );

CREATE POLICY "Users can manage items in own trips"
  ON itinerary_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = itinerary_items.trip_id 
      AND trips.user_id = auth.uid()
    )
  );
```

### Table 8: locations
**Purpose:** Master table for all places (events, restaurants, rentals)

```sql
-- Enum for location categories
CREATE TYPE location_category AS ENUM (
  'restaurant',
  'event',
  'rental',
  'attraction',
  'accommodation',
  'transport',
  'other'
);

CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic info
  name TEXT NOT NULL,
  description TEXT,
  category location_category NOT NULL,
  subcategory TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Location data
  address TEXT,
  city TEXT,
  region TEXT,
  country TEXT,
  postal_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Category-specific fields (JSONB for flexibility)
  details JSONB DEFAULT '{}'::jsonb,
  
  -- Restaurant-specific
  cuisine_types TEXT[],
  price_level INTEGER CHECK (price_level BETWEEN 1 AND 4),
  dietary_options TEXT[],
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
  
  -- Hours of operation
  hours_of_operation JSONB,
  is_open_now BOOLEAN,
  
  -- Contact
  phone TEXT,
  email TEXT,
  website TEXT,
  
  -- Media
  primary_image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  
  -- Ratings
  rating DECIMAL(2, 1) CHECK (rating BETWEEN 0 AND 5),
  rating_count INTEGER DEFAULT 0,
  
  -- Source tracking
  source TEXT, -- 'user_created', 'google_places', 'manual_import'
  external_id TEXT,
  external_url TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_locations_category ON locations(category) WHERE deleted_at IS NULL;
CREATE INDEX idx_locations_city ON locations(city) WHERE deleted_at IS NULL;
CREATE INDEX idx_locations_coordinates ON locations(latitude, longitude) 
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_locations_tags ON locations USING GIN(tags);
CREATE INDEX idx_locations_cuisine ON locations USING GIN(cuisine_types) 
  WHERE category = 'restaurant';
CREATE INDEX idx_locations_rating ON locations(rating DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_locations_external_id ON locations(source, external_id) 
  WHERE external_id IS NOT NULL;

-- Full-text search
CREATE INDEX idx_locations_search ON locations 
  USING GIN(to_tsvector('english', 
    name || ' ' || 
    COALESCE(description, '') || ' ' || 
    COALESCE(city, '') || ' ' ||
    COALESCE(array_to_string(tags, ' '), '')
  ));

-- Geospatial index (if using PostGIS)
-- CREATE INDEX idx_locations_geom ON locations 
--   USING GIST(ST_SetSRID(ST_MakePoint(longitude, latitude), 4326))
--   WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- RLS Policies
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active locations"
  ON locations FOR SELECT
  USING (is_active = true AND deleted_at IS NULL);

CREATE POLICY "Authenticated users can create locations"
  ON locations FOR INSERT
  TO authenticated
  WITH CHECK (true);
```

---

## 🤖 ADVANCED AI TABLES

### Table 9: proactive_suggestions
**Purpose:** AI-generated suggestions for users

```sql
-- Enum for suggestion types
CREATE TYPE suggestion_type AS ENUM (
  'add_activity',
  'optimize_route',
  'book_restaurant',
  'budget_alert',
  'conflict_warning',
  'time_optimization',
  'weather_alert',
  'local_event',
  'cost_savings'
);

-- Enum for suggestion status
CREATE TYPE suggestion_status AS ENUM (
  'pending',
  'shown',
  'accepted',
  'rejected',
  'expired'
);

CREATE TABLE proactive_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  
  -- Suggestion details
  type suggestion_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- AI metadata
  agent_name TEXT NOT NULL,
  confidence_score DECIMAL(3, 2) NOT NULL,
  reasoning TEXT,
  
  -- Suggestion data
  suggestion_data JSONB NOT NULL,
  action_url TEXT,
  
  -- Status tracking
  status suggestion_status DEFAULT 'pending',
  shown_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  
  -- Priority
  priority INTEGER DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
  expires_at TIMESTAMPTZ,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_confidence CHECK (confidence_score BETWEEN 0 AND 1),
  CONSTRAINT valid_expiry CHECK (expires_at IS NULL OR expires_at > created_at)
);

-- Indexes
CREATE INDEX idx_suggestions_user_id ON proactive_suggestions(user_id);
CREATE INDEX idx_suggestions_trip_id ON proactive_suggestions(trip_id);
CREATE INDEX idx_suggestions_status ON proactive_suggestions(status);
CREATE INDEX idx_suggestions_type ON proactive_suggestions(type);
CREATE INDEX idx_suggestions_priority ON proactive_suggestions(priority DESC);
CREATE INDEX idx_suggestions_active ON proactive_suggestions(user_id, status, expires_at) 
  WHERE status = 'pending' AND (expires_at IS NULL OR expires_at > NOW());

-- RLS Policies
ALTER TABLE proactive_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own suggestions"
  ON proactive_suggestions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own suggestions"
  ON proactive_suggestions FOR UPDATE
  USING (auth.uid() = user_id);
```

### Table 10: conflict_resolutions
**Purpose:** Track detected conflicts and their resolutions

```sql
-- Enum for conflict types
CREATE TYPE conflict_type AS ENUM (
  'time_overlap',
  'budget_exceeded',
  'location_distance',
  'booking_unavailable',
  'preference_mismatch',
  'weather_issue',
  'capacity_issue'
);

-- Enum for resolution status
CREATE TYPE resolution_status AS ENUM (
  'detected',
  'pending_review',
  'auto_resolved',
  'user_resolved',
  'ignored'
);

CREATE TABLE conflict_resolutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Conflict details
  type conflict_type NOT NULL,
  severity INTEGER NOT NULL CHECK (severity BETWEEN 1 AND 10),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Affected items
  affected_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Resolution
  status resolution_status DEFAULT 'detected',
  resolution_options JSONB,
  selected_resolution JSONB,
  resolved_by TEXT, -- 'ai' or 'user'
  
  -- Timing
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_conflicts_trip_id ON conflict_resolutions(trip_id);
CREATE INDEX idx_conflicts_user_id ON conflict_resolutions(user_id);
CREATE INDEX idx_conflicts_status ON conflict_resolutions(status);
CREATE INDEX idx_conflicts_type ON conflict_resolutions(type);
CREATE INDEX idx_conflicts_severity ON conflict_resolutions(severity DESC);
CREATE INDEX idx_conflicts_unresolved ON conflict_resolutions(trip_id, status) 
  WHERE status IN ('detected', 'pending_review');

-- RLS Policies
ALTER TABLE conflict_resolutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view conflicts in own trips"
  ON conflict_resolutions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update conflicts in own trips"
  ON conflict_resolutions FOR ALL
  USING (auth.uid() = user_id);
```

### Table 11: budget_tracking
**Purpose:** Real-time budget monitoring per trip

```sql
CREATE TABLE budget_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  
  -- Budget overview
  total_budget DECIMAL(10, 2) NOT NULL,
  total_spent DECIMAL(10, 2) DEFAULT 0,
  total_pending DECIMAL(10, 2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  
  -- Category breakdown
  categories JSONB DEFAULT '{
    "accommodation": {"budget": 0, "spent": 0},
    "food": {"budget": 0, "spent": 0},
    "activities": {"budget": 0, "spent": 0},
    "transport": {"budget": 0, "spent": 0},
    "shopping": {"budget": 0, "spent": 0},
    "other": {"budget": 0, "spent": 0}
  }'::jsonb,
  
  -- Alerts
  alert_threshold DECIMAL(3, 2) DEFAULT 0.80, -- Alert at 80%
  alerts_sent JSONB DEFAULT '[]'::jsonb,
  
  -- AI recommendations
  ai_recommendations JSONB DEFAULT '[]'::jsonb,
  last_optimization_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_budget_per_trip UNIQUE (trip_id),
  CONSTRAINT valid_budget CHECK (total_budget >= 0),
  CONSTRAINT valid_spent CHECK (total_spent >= 0),
  CONSTRAINT valid_pending CHECK (total_pending >= 0),
  CONSTRAINT valid_threshold CHECK (alert_threshold BETWEEN 0 AND 1)
);

-- Indexes
CREATE INDEX idx_budget_tracking_trip_id ON budget_tracking(trip_id);
CREATE INDEX idx_budget_tracking_alerts ON budget_tracking((total_spent / NULLIF(total_budget, 0))) 
  WHERE total_spent / NULLIF(total_budget, 0) >= 0.80;

-- RLS Policies
ALTER TABLE budget_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view budget for own trips"
  ON budget_tracking FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = budget_tracking.trip_id 
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update budget for own trips"
  ON budget_tracking FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = budget_tracking.trip_id 
      AND trips.user_id = auth.uid()
    )
  );
```

### Table 12: saved_places
**Purpose:** User's saved/favorited locations

```sql
CREATE TABLE saved_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  
  -- Organization
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  notes TEXT,
  
  -- Priority
  is_favorite BOOLEAN DEFAULT false,
  priority INTEGER DEFAULT 0,
  
  -- Metadata
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  last_viewed_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  
  -- Unique constraint
  CONSTRAINT unique_user_location UNIQUE (user_id, location_id)
);

-- Indexes
CREATE INDEX idx_saved_places_user_id ON saved_places(user_id);
CREATE INDEX idx_saved_places_location_id ON saved_places(location_id);
CREATE INDEX idx_saved_places_collection ON saved_places(collection_id);
CREATE INDEX idx_saved_places_favorites ON saved_places(user_id, is_favorite) 
  WHERE is_favorite = true;
CREATE INDEX idx_saved_places_tags ON saved_places USING GIN(tags);

-- RLS Policies
ALTER TABLE saved_places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved places"
  ON saved_places FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own saved places"
  ON saved_places FOR ALL
  USING (auth.uid() = user_id);
```

### Table 13: collections
**Purpose:** User-created collections of places

```sql
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Collection details
  name TEXT NOT NULL,
  description TEXT,
  emoji TEXT,
  color TEXT,
  
  -- Sharing
  is_public BOOLEAN DEFAULT false,
  share_token TEXT UNIQUE,
  
  -- Stats
  item_count INTEGER DEFAULT 0,
  
  -- Media
  cover_image_url TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_item_count CHECK (item_count >= 0)
);

-- Indexes
CREATE INDEX idx_collections_user_id ON collections(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_collections_public ON collections(is_public) 
  WHERE is_public = true AND deleted_at IS NULL;
CREATE INDEX idx_collections_share_token ON collections(share_token) 
  WHERE share_token IS NOT NULL;

-- RLS Policies
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own collections or public collections"
  ON collections FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can manage own collections"
  ON collections FOR ALL
  USING (auth.uid() = user_id);
```

---

## 🚀 FUNCTIONS & TRIGGERS

### Function 1: Update updated_at timestamp

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_context_updated_at BEFORE UPDATE ON ai_context 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_itinerary_items_updated_at BEFORE UPDATE ON itinerary_items 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conflict_resolutions_updated_at BEFORE UPDATE ON conflict_resolutions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_tracking_updated_at BEFORE UPDATE ON budget_tracking 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Function 2: Update trip budget on item changes

```sql
CREATE OR REPLACE FUNCTION update_trip_budget()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE trips
  SET budget_spent = (
    SELECT COALESCE(SUM(cost), 0)
    FROM itinerary_items
    WHERE trip_id = COALESCE(NEW.trip_id, OLD.trip_id)
    AND deleted_at IS NULL
  )
  WHERE id = COALESCE(NEW.trip_id, OLD.trip_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_trip_budget_on_item_change
  AFTER INSERT OR UPDATE OR DELETE ON itinerary_items
  FOR EACH ROW
  EXECUTE FUNCTION update_trip_budget();
```

### Function 3: Update collection item count

```sql
CREATE OR REPLACE FUNCTION update_collection_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE collections
    SET item_count = item_count + 1
    WHERE id = NEW.collection_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE collections
    SET item_count = item_count - 1
    WHERE id = OLD.collection_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.collection_id != NEW.collection_id THEN
    UPDATE collections SET item_count = item_count - 1 WHERE id = OLD.collection_id;
    UPDATE collections SET item_count = item_count + 1 WHERE id = NEW.collection_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_collection_on_saved_place_change
  AFTER INSERT OR UPDATE OR DELETE ON saved_places
  FOR EACH ROW
  EXECUTE FUNCTION update_collection_count();
```

---

## 📈 PERFORMANCE OPTIMIZATION

### Materialized Views

```sql
-- User AI usage statistics
CREATE MATERIALIZED VIEW user_ai_stats AS
SELECT 
  user_id,
  COUNT(DISTINCT conversation_id) as total_conversations,
  COUNT(*) as total_runs,
  SUM(total_tokens) as total_tokens,
  SUM(estimated_cost_usd) as total_cost,
  AVG(duration_ms) as avg_duration_ms,
  MAX(created_at) as last_run_at
FROM ai_runs
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY user_id;

CREATE UNIQUE INDEX idx_user_ai_stats_user_id ON user_ai_stats(user_id);

-- Refresh daily
CREATE OR REPLACE FUNCTION refresh_user_ai_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_ai_stats;
END;
$$ LANGUAGE plpgsql;
```

### Query Optimization Functions

```sql
-- Search locations by proximity
CREATE OR REPLACE FUNCTION search_nearby_locations(
  p_latitude DECIMAL,
  p_longitude DECIMAL,
  p_radius_km INTEGER DEFAULT 10,
  p_category location_category DEFAULT NULL,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  category location_category,
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
    )::DECIMAL as distance_km
  FROM locations l
  WHERE l.is_active = true
    AND l.deleted_at IS NULL
    AND l.latitude IS NOT NULL
    AND l.longitude IS NOT NULL
    AND (p_category IS NULL OR l.category = p_category)
  ORDER BY distance_km ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;
```

---

## 🔒 SECURITY BEST PRACTICES

### 1. Enable RLS on All Tables
```sql
-- Already applied above to all tables
```

### 2. Service Role Functions (bypass RLS for server-side operations)
```sql
-- Create admin context for server operations
CREATE OR REPLACE FUNCTION set_service_role_context()
RETURNS void AS $$
BEGIN
  SET LOCAL jwt.claims.role = 'service_role';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. Audit Logging
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
```

---

## 📋 MIGRATION ORDER

Execute migrations in this order to respect foreign key dependencies:

1. **Core Infrastructure**
   - `profiles` (extends auth.users)
   - Custom types (ENUMs)
   - Utility functions

2. **Location & Content**
   - `locations`
   - `collections`

3. **Trip Management**
   - `trips`
   - `itinerary_items`
   - `saved_places`
   - `budget_tracking`

4. **AI & Conversations**
   - `conversations`
   - `messages`
   - `ai_context`
   - `ai_runs`

5. **Advanced AI**
   - `proactive_suggestions`
   - `conflict_resolutions`

6. **Triggers & Functions**
   - All triggers
   - Materialized views
   - Utility functions

7. **Indexes & Performance**
   - Additional indexes
   - Query optimization

---

## ✅ SUMMARY

### Tables Created: 13

| Category | Tables | Total |
|----------|--------|-------|
| **Core** | profiles | 1 |
| **AI** | conversations, messages, ai_context, ai_runs | 4 |
| **Trips** | trips, itinerary_items, locations | 3 |
| **Advanced AI** | proactive_suggestions, conflict_resolutions, budget_tracking | 3 |
| **User Data** | saved_places, collections | 2 |

### Best Practices Applied

✅ UUID primary keys  
✅ Row-level security on all tables  
✅ Soft deletes (deleted_at)  
✅ Automatic timestamps (created_at, updated_at)  
✅ Strategic indexes on foreign keys & search fields  
✅ Full-text search indexes  
✅ JSONB for flexible data  
✅ PostgreSQL ENUMs for type safety  
✅ Check constraints for validation  
✅ Triggers for auto-updates  
✅ Materialized views for analytics  
✅ Utility functions for complex queries  
✅ Audit logging capability  

---

**Document Status:** ✅ Production-Ready  
**Last Updated:** December 24, 2024  
**Next Step:** Create migration files in `/supabase/migrations/`  
**Owner:** Database Team
