-- ============================================================================
-- CORE SCHEMA: User Profiles
-- ============================================================================
-- Description: User profile management with preferences and settings
-- Phase: Core (Phase 1)
-- Dependencies: None (requires auth.users from Supabase Auth)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: profiles
-- ============================================================================
-- Description: User profile data extending Supabase auth.users
-- RLS: Enabled (users can only read/update their own profile)
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  -- Primary key (matches auth.users.id)
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Profile information
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  
  -- Location preferences
  default_location TEXT,
  default_city TEXT,
  default_country TEXT,
  default_latitude DECIMAL(10, 8),
  default_longitude DECIMAL(11, 8),
  
  -- User settings
  timezone TEXT DEFAULT 'UTC',
  language TEXT DEFAULT 'en',
  currency TEXT DEFAULT 'USD',
  
  -- Notification preferences
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  
  -- Privacy settings
  profile_visibility TEXT DEFAULT 'private' CHECK (profile_visibility IN ('public', 'friends', 'private')),
  share_location BOOLEAN DEFAULT false,
  
  -- Account status
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  premium_expires_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_login_at TIMESTAMPTZ,
  onboarding_completed BOOLEAN DEFAULT false,
  
  -- Indexes for common queries
  CONSTRAINT profiles_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Primary lookup by email
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Location-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_default_location ON profiles(default_location) WHERE default_location IS NOT NULL;

-- Active premium users
CREATE INDEX IF NOT EXISTS idx_profiles_premium ON profiles(is_premium, premium_expires_at) WHERE is_premium = true;

-- Last login tracking
CREATE INDEX IF NOT EXISTS idx_profiles_last_login ON profiles(last_login_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Public profiles can be viewed by anyone (for sharing)
CREATE POLICY "Public profiles viewable by all"
  ON profiles
  FOR SELECT
  USING (profile_visibility = 'public');

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger: Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Trigger: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth.users with app-specific data';
COMMENT ON COLUMN profiles.id IS 'Primary key matching auth.users.id';
COMMENT ON COLUMN profiles.default_location IS 'User''s preferred default location for searches';
COMMENT ON COLUMN profiles.is_premium IS 'Premium subscription status';
COMMENT ON COLUMN profiles.profile_visibility IS 'Who can view this profile: public, friends, or private';
