-- ============================================================================
-- CORE SCHEMA: User Preferences
-- ============================================================================
-- Description: User preferences for AI personalization and recommendations
-- Phase: Core (Phase 1)
-- Dependencies: profiles
-- ============================================================================

-- ============================================================================
-- TABLE: user_preferences
-- ============================================================================
-- Description: Detailed user preferences for AI-powered recommendations
-- RLS: Enabled (users can only manage their own preferences)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_preferences (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Dining Preferences
  dietary_restrictions TEXT[] DEFAULT '{}',
  favorite_cuisines TEXT[] DEFAULT '{}',
  disliked_cuisines TEXT[] DEFAULT '{}',
  price_range_dining TEXT DEFAULT 'moderate' CHECK (price_range_dining IN ('budget', 'moderate', 'upscale', 'luxury')),
  preferred_dining_time TEXT[] DEFAULT '{}', -- ['breakfast', 'lunch', 'dinner', 'late-night']
  ambiance_preferences TEXT[] DEFAULT '{}', -- ['casual', 'romantic', 'family-friendly', 'trendy', 'quiet']
  
  -- Event Preferences
  event_categories TEXT[] DEFAULT '{}', -- ['concerts', 'sports', 'theater', 'festivals', 'nightlife']
  preferred_event_times TEXT[] DEFAULT '{}', -- ['morning', 'afternoon', 'evening', 'late-night']
  event_price_range TEXT DEFAULT 'moderate' CHECK (event_price_range IN ('free', 'budget', 'moderate', 'premium')),
  
  -- Rental Preferences
  vehicle_types TEXT[] DEFAULT '{}', -- ['sedan', 'suv', 'luxury', 'electric', 'motorcycle']
  rental_features TEXT[] DEFAULT '{}', -- ['gps', 'wifi', 'child-seat', 'automatic', 'manual']
  rental_price_range TEXT DEFAULT 'moderate' CHECK (rental_price_range IN ('budget', 'moderate', 'premium', 'luxury')),
  
  -- Travel Style
  travel_style TEXT[] DEFAULT '{}', -- ['adventure', 'relaxation', 'culture', 'nightlife', 'foodie', 'budget', 'luxury']
  pace_preference TEXT DEFAULT 'moderate' CHECK (pace_preference IN ('relaxed', 'moderate', 'packed')),
  group_type TEXT DEFAULT 'solo' CHECK (group_type IN ('solo', 'couple', 'family', 'friends', 'business')),
  
  -- Accessibility
  accessibility_needs TEXT[] DEFAULT '{}', -- ['wheelchair', 'hearing', 'visual', 'mobility']
  
  -- AI Behavior Preferences
  ai_proactivity_level TEXT DEFAULT 'balanced' CHECK (ai_proactivity_level IN ('minimal', 'balanced', 'proactive')),
  suggestion_frequency TEXT DEFAULT 'normal' CHECK (suggestion_frequency IN ('rare', 'normal', 'frequent')),
  auto_optimize_itinerary BOOLEAN DEFAULT true,
  
  -- Budget Management
  default_budget_per_day DECIMAL(10, 2),
  default_budget_currency TEXT DEFAULT 'USD',
  track_spending BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT user_preferences_user_id_unique UNIQUE (user_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Primary user lookup
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- AI preference queries
CREATE INDEX IF NOT EXISTS idx_user_preferences_travel_style ON user_preferences USING GIN(travel_style);
CREATE INDEX IF NOT EXISTS idx_user_preferences_cuisines ON user_preferences USING GIN(favorite_cuisines);
CREATE INDEX IF NOT EXISTS idx_user_preferences_event_categories ON user_preferences USING GIN(event_categories);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own preferences
CREATE POLICY "Users can view own preferences"
  ON user_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own preferences
CREATE POLICY "Users can insert own preferences"
  ON user_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own preferences
CREATE POLICY "Users can update own preferences"
  ON user_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own preferences
CREATE POLICY "Users can delete own preferences"
  ON user_preferences
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger: Update updated_at timestamp
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTIONS: Default Preferences
-- ============================================================================

-- Function: Create default preferences for new users
CREATE OR REPLACE FUNCTION create_default_preferences(p_user_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO user_preferences (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE user_preferences IS 'User preferences for AI-powered personalized recommendations';
COMMENT ON COLUMN user_preferences.dietary_restrictions IS 'Array of dietary restrictions (vegetarian, vegan, gluten-free, etc.)';
COMMENT ON COLUMN user_preferences.travel_style IS 'User''s travel style preferences for AI personalization';
COMMENT ON COLUMN user_preferences.ai_proactivity_level IS 'How proactive the AI should be with suggestions';
