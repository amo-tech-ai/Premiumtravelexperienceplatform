# Database Tables - Core Schema
## User, Trip, & Itinerary Management

**Version:** 1.0  
**Database:** PostgreSQL (Supabase)  
**Status:** ✅ Production Ready

---

## Core User Tables

### users
**Purpose:** Core user accounts and authentication

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(50),
  avatar_url TEXT,
  
  -- Auth
  auth_provider VARCHAR(50) DEFAULT 'email',
  
  -- Preferences
  preferred_currency VARCHAR(3) DEFAULT 'USD',
  preferred_language VARCHAR(5) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC',
  
  -- Subscription
  subscription_tier VARCHAR(20) DEFAULT 'free',
  subscription_status VARCHAR(20) DEFAULT 'active',
  subscription_expires_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription ON users(subscription_tier);
```

**Relations:**
- → user_preferences (1:1)
- → trips (1:many, as creator)
- → trip_members (many:many via junction)

---

### user_preferences
**Purpose:** User behavioral preferences and ML vectors

```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Dietary
  dietary_restrictions TEXT[],
  favorite_cuisines TEXT[],
  
  -- Travel Style
  travel_pace VARCHAR(20),
  accommodation_preference VARCHAR(20),
  activity_energy_level VARCHAR(20),
  
  -- ML Embedding
  interest_vector VECTOR(128),
  
  -- Learned Behaviors
  preferred_dining_time TIME,
  budget_consciousness DECIMAL(3,2),
  
  -- AI Settings
  auto_optimize_enabled BOOLEAN DEFAULT false,
  auto_book_enabled BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_prefs_user ON user_preferences(user_id);
```

**ML Vector Usage:**
- 128-dimensional embedding for semantic matching
- Updated daily based on user interactions
- Used by all agents for personalized recommendations

---

## Trip Management

### trips
**Purpose:** Core trip entity with budget and settings

```sql
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  title VARCHAR(255) NOT NULL,
  destination_city VARCHAR(100) NOT NULL,
  destination_country VARCHAR(100),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- Budget
  total_budget DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  budget_breakdown JSONB,
  
  status VARCHAR(20) DEFAULT 'planning',
  
  -- Settings
  optimization_preferences JSONB,
  notification_settings JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_trips_creator ON trips(creator_id);
CREATE INDEX idx_trips_dates ON trips(start_date, end_date);
CREATE INDEX idx_trips_destination ON trips(destination_city);
```

**Status Values:**
- `planning` - Still being built
- `confirmed` - Ready to go
- `in_progress` - Currently happening
- `completed` - Trip finished
- `cancelled` - Cancelled

---

### trip_members
**Purpose:** Multi-user trip coordination

```sql
CREATE TABLE trip_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  role VARCHAR(20) DEFAULT 'member',
  individual_budget DECIMAL(10,2),
  
  joined_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(trip_id, user_id)
);

CREATE INDEX idx_trip_members_trip ON trip_members(trip_id);
CREATE INDEX idx_trip_members_user ON trip_members(user_id);
```

**Role Hierarchy:**
- `organizer` - Full control, can delete trip
- `co_organizer` - Can edit, can't delete
- `member` - Can add items, can view
- `viewer` - Read-only access

---

## Itinerary & Timeline

### itinerary_items
**Purpose:** Activities, bookings, and timeline blocks

```sql
CREATE TABLE itinerary_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- References
  restaurant_id UUID,
  event_id UUID,
  activity_id UUID,
  
  -- Timing
  day_number INT NOT NULL,
  start_time TIME,
  end_time TIME,
  duration_minutes INT,
  
  -- Location
  location_name VARCHAR(255),
  address TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  
  -- Cost
  estimated_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  
  -- Status
  status VARCHAR(20) DEFAULT 'planned',
  priority VARCHAR(20) DEFAULT 'normal',
  locked BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  order_index INT
);

CREATE INDEX idx_itinerary_trip ON itinerary_items(trip_id);
CREATE INDEX idx_itinerary_day ON itinerary_items(trip_id, day_number);
CREATE INDEX idx_itinerary_time ON itinerary_items(trip_id, day_number, start_time);
```

**Type Values:**
- `dining` - Restaurant reservation
- `activity` - Tour, museum, experience
- `event` - Concert, sports, festival
- `accommodation` - Hotel check-in/out
- `transport` - Flight, taxi, metro
- `buffer` - Rest time, travel time

**Priority Values:**
- `must_have` - User marked as essential
- `high` - Important to user
- `normal` - Standard priority
- `optional` - Can be removed if needed

**Locked Field:**
- If `true`, optimizer won't move this item
- User can lock items to preserve them

---

## Query Examples

### Get User's Active Trips
```sql
SELECT t.*, 
       COUNT(DISTINCT tm.user_id) as member_count,
       COUNT(DISTINCT ii.id) as item_count
FROM trips t
LEFT JOIN trip_members tm ON t.id = tm.trip_id
LEFT JOIN itinerary_items ii ON t.id = ii.trip_id
WHERE t.creator_id = $user_id
  AND t.deleted_at IS NULL
  AND t.status IN ('planning', 'confirmed', 'in_progress')
GROUP BY t.id
ORDER BY t.start_date DESC;
```

### Get Day's Itinerary
```sql
SELECT *
FROM itinerary_items
WHERE trip_id = $trip_id
  AND day_number = $day_number
ORDER BY start_time ASC, order_index ASC;
```

### Check Trip Budget Status
```sql
SELECT 
  t.total_budget,
  COALESCE(SUM(ii.actual_cost), 0) as spent,
  t.total_budget - COALESCE(SUM(ii.actual_cost), 0) as remaining
FROM trips t
LEFT JOIN itinerary_items ii ON t.id = ii.trip_id
WHERE t.id = $trip_id
GROUP BY t.id;
```

---

## Data Integrity Rules

**Foreign Keys:**
- All references use `ON DELETE CASCADE` for trips
- Users use `ON DELETE SET NULL` for bookings (preserve history)

**Soft Deletes:**
- Users, trips use `deleted_at` instead of hard delete
- Preserves data for analytics and audit

**Timestamps:**
- All tables have `created_at` and `updated_at`
- Use triggers for automatic `updated_at` maintenance

**Validation:**
- Dates: `start_date` must be <= `end_date`
- Budget: Must be positive or NULL
- Day numbers: Must be >= 1 and <= trip duration

---

## Performance Considerations

**Indexes:**
- All foreign keys indexed
- Date ranges for trip queries
- Location data for geospatial queries (PostGIS)

**Partitioning:**
- Consider partitioning `itinerary_items` by trip_id for large scale

**Caching Strategy:**
- Cache user preferences in Redis (1 hour TTL)
- Cache trip data in Redis (15 min TTL)
- Invalidate cache on updates

---

**Next:** See `database-bookings.md` for booking-related tables
