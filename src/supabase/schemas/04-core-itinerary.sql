-- ============================================================================
-- CORE SCHEMA: Trips & Itinerary
-- ============================================================================
-- Description: Trip planning and itinerary management
-- Phase: Core (Phase 1)
-- Dependencies: profiles, locations
-- ============================================================================

-- ============================================================================
-- TABLE: trips
-- ============================================================================
-- Description: User trips/itineraries
-- RLS: Enabled (users can only manage their own trips)
-- Note: This extends the existing kv_store-based trips with relational structure
-- ============================================================================

CREATE TABLE IF NOT EXISTS trips (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Basic info
  title TEXT NOT NULL,
  description TEXT,
  destination TEXT NOT NULL,
  
  -- Dates
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- Media
  cover_image TEXT,
  
  -- Status
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'archived', 'cancelled')),
  
  -- Visibility
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'shared', 'public')),
  
  -- Collaboration
  collaborators UUID[] DEFAULT '{}',
  owner_id UUID NOT NULL REFERENCES profiles(id),
  
  -- Budget
  budget DECIMAL(10, 2),
  budget_currency TEXT DEFAULT 'USD',
  estimated_cost DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  
  -- AI context
  ai_generated BOOLEAN DEFAULT false,
  ai_model_used TEXT,
  user_preferences_snapshot JSONB, -- Snapshot of preferences at time of creation
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT trips_dates_check CHECK (end_date >= start_date)
);

-- ============================================================================
-- TABLE: itinerary_items
-- ============================================================================
-- Description: Individual items in trip itinerary
-- RLS: Enabled (users can only manage items in their trips)
-- ============================================================================

CREATE TABLE IF NOT EXISTS itinerary_items (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  
  -- Item details
  title TEXT NOT NULL,
  description TEXT,
  notes TEXT,
  
  -- Type
  item_type TEXT NOT NULL CHECK (item_type IN ('restaurant', 'event', 'activity', 'rental', 'hotel', 'flight', 'transport', 'custom')),
  
  -- Scheduling
  day_number INTEGER NOT NULL, -- Which day of the trip (1-indexed)
  start_time TIME,
  end_time TIME,
  duration_minutes INTEGER,
  is_all_day BOOLEAN DEFAULT false,
  
  -- Location (if not linked to locations table)
  custom_location TEXT,
  custom_address TEXT,
  custom_latitude DECIMAL(10, 8),
  custom_longitude DECIMAL(11, 8),
  
  -- Cost
  estimated_cost DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  cost_category TEXT CHECK (cost_category IN ('food', 'transport', 'accommodation', 'entertainment', 'shopping', 'other')),
  
  -- Status
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'booked', 'confirmed', 'completed', 'cancelled', 'skipped')),
  
  -- Booking
  booking_reference TEXT,
  booking_url TEXT,
  booking_contact TEXT,
  booking_status TEXT CHECK (booking_status IN ('not_needed', 'needed', 'requested', 'confirmed', 'cancelled')),
  
  -- Priority
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'must-do')),
  is_flexible BOOLEAN DEFAULT true,
  
  -- AI metadata
  ai_suggested BOOLEAN DEFAULT false,
  ai_confidence DECIMAL(3, 2),
  ai_reason TEXT,
  
  -- Order
  sort_order INTEGER NOT NULL DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES profiles(id),
  
  -- Constraints
  CONSTRAINT itinerary_items_time_check CHECK (
    (start_time IS NULL AND end_time IS NULL) OR
    (start_time IS NOT NULL AND end_time IS NULL) OR
    (start_time IS NOT NULL AND end_time IS NOT NULL AND end_time > start_time)
  )
);

-- ============================================================================
-- TABLE: reminders
-- ============================================================================
-- Description: User reminders for trips and itinerary items
-- RLS: Enabled (users can only manage their own reminders)
-- ============================================================================

CREATE TABLE IF NOT EXISTS reminders (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- What to remind about
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  itinerary_item_id UUID REFERENCES itinerary_items(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  
  -- Reminder details
  title TEXT NOT NULL,
  message TEXT,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('booking', 'departure', 'check-in', 'activity', 'custom')),
  
  -- Timing
  remind_at TIMESTAMPTZ NOT NULL,
  advance_notice_minutes INTEGER DEFAULT 60,
  
  -- Delivery
  send_email BOOLEAN DEFAULT true,
  send_push BOOLEAN DEFAULT true,
  send_sms BOOLEAN DEFAULT false,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  sent_at TIMESTAMPTZ,
  
  -- Recurrence
  is_recurring BOOLEAN DEFAULT false,
  recurrence_rule TEXT, -- iCal RRULE format
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- TABLE: trip_collaborators
-- ============================================================================
-- Description: Collaboration on trips
-- RLS: Enabled
-- ============================================================================

CREATE TABLE IF NOT EXISTS trip_collaborators (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Role
  role TEXT DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'viewer')),
  
  -- Permissions
  can_edit BOOLEAN DEFAULT false,
  can_invite BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  
  -- Invite
  invited_by UUID REFERENCES profiles(id),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'removed')),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT trip_collaborators_unique UNIQUE (trip_id, user_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Trips
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_dates ON trips(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_trips_owner_id ON trips(owner_id);
CREATE INDEX IF NOT EXISTS idx_trips_collaborators ON trips USING GIN(collaborators);

-- Itinerary Items
CREATE INDEX IF NOT EXISTS idx_itinerary_items_trip_id ON itinerary_items(trip_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_items_day ON itinerary_items(trip_id, day_number, sort_order);
CREATE INDEX IF NOT EXISTS idx_itinerary_items_location_id ON itinerary_items(location_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_items_type ON itinerary_items(item_type);
CREATE INDEX IF NOT EXISTS idx_itinerary_items_status ON itinerary_items(status);

-- Reminders
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_trip_id ON reminders(trip_id);
CREATE INDEX IF NOT EXISTS idx_reminders_item_id ON reminders(itinerary_item_id);
CREATE INDEX IF NOT EXISTS idx_reminders_remind_at ON reminders(remind_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_reminders_pending ON reminders(status, remind_at) WHERE status = 'pending';

-- Collaborators
CREATE INDEX IF NOT EXISTS idx_trip_collaborators_trip_id ON trip_collaborators(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_collaborators_user_id ON trip_collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_collaborators_status ON trip_collaborators(status);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Trips
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trips"
  ON trips FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = owner_id OR auth.uid() = ANY(collaborators));

CREATE POLICY "Users can create trips"
  ON trips FOR INSERT
  WITH CHECK (auth.uid() = user_id AND auth.uid() = owner_id);

CREATE POLICY "Owners can update trips"
  ON trips FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete trips"
  ON trips FOR DELETE
  USING (auth.uid() = owner_id);

-- Itinerary Items
ALTER TABLE itinerary_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view items in accessible trips"
  ON itinerary_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itinerary_items.trip_id
      AND (trips.user_id = auth.uid() OR trips.owner_id = auth.uid() OR auth.uid() = ANY(trips.collaborators))
    )
  );

CREATE POLICY "Users can manage items in own trips"
  ON itinerary_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itinerary_items.trip_id
      AND (trips.owner_id = auth.uid() OR 
           EXISTS (
             SELECT 1 FROM trip_collaborators
             WHERE trip_collaborators.trip_id = trips.id
             AND trip_collaborators.user_id = auth.uid()
             AND trip_collaborators.can_edit = true
           ))
    )
  );

-- Reminders
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own reminders"
  ON reminders FOR ALL
  USING (auth.uid() = user_id);

-- Collaborators
ALTER TABLE trip_collaborators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view collaborators of accessible trips"
  ON trip_collaborators FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_collaborators.trip_id
      AND (trips.owner_id = auth.uid() OR auth.uid() = ANY(trips.collaborators))
    )
  );

CREATE POLICY "Trip owners can manage collaborators"
  ON trip_collaborators FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_collaborators.trip_id
      AND trips.owner_id = auth.uid()
    )
  );

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update timestamps
CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON trips
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_itinerary_items_updated_at
  BEFORE UPDATE ON itinerary_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reminders_updated_at
  BEFORE UPDATE ON reminders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-create reminder when itinerary item with booking is added
CREATE OR REPLACE FUNCTION auto_create_booking_reminder()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_status = 'needed' AND NEW.start_time IS NOT NULL THEN
    INSERT INTO reminders (
      user_id,
      trip_id,
      itinerary_item_id,
      title,
      message,
      reminder_type,
      remind_at,
      advance_notice_minutes
    )
    SELECT
      t.user_id,
      NEW.trip_id,
      NEW.id,
      'Booking reminder: ' || NEW.title,
      'Don''t forget to book: ' || NEW.title,
      'booking',
      (t.start_date + NEW.start_time - INTERVAL '3 days'),
      4320 -- 3 days in minutes
    FROM trips t
    WHERE t.id = NEW.trip_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_itinerary_item_booking_needed
  AFTER INSERT ON itinerary_items
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_booking_reminder();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE trips IS 'User trips and itineraries';
COMMENT ON TABLE itinerary_items IS 'Individual activities/items in trip itinerary';
COMMENT ON TABLE reminders IS 'User reminders for trips and activities';
COMMENT ON TABLE trip_collaborators IS 'Trip collaboration and sharing';
COMMENT ON COLUMN itinerary_items.day_number IS '1-indexed day number in trip (1 = first day)';
COMMENT ON COLUMN itinerary_items.sort_order IS 'Order of items within a day';
