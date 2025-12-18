# Database Tables - Bookings & Payments
## Reservation, Watchlist, & Payment Management

**Version:** 1.0  
**Database:** PostgreSQL (Supabase)  
**Status:** ✅ Production Ready

---

## Bookings & Reservations

### bookings
**Purpose:** Confirmed reservations and tickets

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  itinerary_item_id UUID REFERENCES itinerary_items(id),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  type VARCHAR(50) NOT NULL,
  confirmation_number VARCHAR(100),
  
  -- Venue
  venue_name VARCHAR(255) NOT NULL,
  venue_contact JSONB,
  
  -- Timing
  booking_date DATE NOT NULL,
  booking_time TIME,
  party_size INT DEFAULT 1,
  
  -- Cost
  total_cost DECIMAL(10,2),
  deposit_paid DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Payment
  payment_status VARCHAR(20) DEFAULT 'pending',
  payment_intent_id VARCHAR(255),
  
  -- Cancellation
  cancellation_policy TEXT,
  cancellable_until TIMESTAMP,
  cancellation_fee DECIMAL(10,2),
  
  -- Status
  booking_status VARCHAR(20) DEFAULT 'pending',
  
  -- Auto-Booking
  auto_booked BOOLEAN DEFAULT false,
  auto_book_trigger VARCHAR(50),
  
  special_requests TEXT,
  confirmation_sent_at TIMESTAMP,
  reminder_sent_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bookings_trip ON bookings(trip_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(booking_status);
CREATE INDEX idx_bookings_confirmation ON bookings(confirmation_number);
```

**Type Values:**
- `dining` - Restaurant reservation
- `event` - Concert/sports ticket
- `activity` - Tour/experience booking
- `accommodation` - Hotel room

**Payment Status:**
- `pending` - Not yet charged
- `authorized` - Card authorized, not captured
- `paid` - Payment completed
- `refunded` - Money returned
- `failed` - Payment error

**Booking Status:**
- `pending` - Awaiting confirmation
- `confirmed` - Venue confirmed
- `completed` - Event/meal happened
- `cancelled` - User cancelled
- `no_show` - User didn't show up

---

### watchlist_items
**Purpose:** Price monitoring and auto-booking queue

```sql
CREATE TABLE watchlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  type VARCHAR(50) NOT NULL,
  item_id UUID,
  item_name VARCHAR(255) NOT NULL,
  
  -- Price Monitoring
  target_price DECIMAL(10,2),
  current_price DECIMAL(10,2),
  price_history JSONB,
  
  -- Availability
  desired_date DATE,
  desired_time TIME,
  party_size INT,
  availability_status VARCHAR(20),
  
  -- Auto-Booking
  auto_book_enabled BOOLEAN DEFAULT false,
  auto_book_conditions JSONB,
  
  -- Alerts
  alert_on_price_drop BOOLEAN DEFAULT true,
  alert_on_availability BOOLEAN DEFAULT true,
  last_alert_sent_at TIMESTAMP,
  
  status VARCHAR(20) DEFAULT 'active',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_watchlist_trip ON watchlist_items(trip_id);
CREATE INDEX idx_watchlist_user ON watchlist_items(user_id);
CREATE INDEX idx_watchlist_status ON watchlist_items(status);
CREATE INDEX idx_watchlist_auto_book ON watchlist_items(auto_book_enabled);
```

**Auto-Book Conditions (JSONB):**
```json
{
  "max_price": 150.00,
  "require_refundable": true,
  "max_deposit": 50.00,
  "preferred_times": ["19:00", "19:30", "20:00"],
  "notification_before_booking": 300
}
```

**Availability Status:**
- `available` - Can book now
- `limited` - <20% capacity left
- `sold_out` - No availability

**Status:**
- `active` - Currently monitoring
- `booked` - Successfully booked
- `expired` - Past desired date
- `removed` - User removed from watchlist

---

## Payment Management

### payment_methods
**Purpose:** Stored payment cards (Stripe tokens)

```sql
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  stripe_payment_method_id VARCHAR(255) UNIQUE,
  
  -- Card Info (tokenized)
  card_brand VARCHAR(50),
  card_last4 VARCHAR(4),
  card_exp_month INT,
  card_exp_year INT,
  
  billing_address JSONB,
  
  is_default BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payment_user ON payment_methods(user_id);
```

**Security Notes:**
- ✅ Never store full card numbers
- ✅ Use Stripe tokens only
- ✅ PCI-DSS Level 1 compliant via Stripe
- ✅ Billing address encrypted at rest

---

## Budget & Expenses

### expenses
**Purpose:** Track actual spending during trip

```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  booking_id UUID REFERENCES bookings(id),
  
  category VARCHAR(50) NOT NULL,
  merchant_name VARCHAR(255),
  description TEXT,
  
  -- Amount
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  amount_usd DECIMAL(10,2),
  
  expense_date DATE NOT NULL,
  expense_time TIME,
  
  payment_method VARCHAR(50),
  
  -- Receipt
  receipt_url TEXT,
  receipt_ocr_data JSONB,
  
  -- Categorization
  auto_categorized BOOLEAN DEFAULT false,
  category_confidence DECIMAL(3,2),
  
  -- Group Expense
  is_group_expense BOOLEAN DEFAULT false,
  split_between INT DEFAULT 1,
  amount_per_person DECIMAL(10,2),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_expenses_trip ON expenses(trip_id);
CREATE INDEX idx_expenses_user ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_expenses_category ON expenses(category);
```

**Category Values:**
- `dining` - Meals and drinks
- `activities` - Tours, museums, experiences
- `transport` - Taxis, metro, flights
- `lodging` - Hotels, Airbnb
- `shopping` - Souvenirs, purchases

**Receipt OCR Data (JSONB):**
```json
{
  "merchant": "Carmen Restaurant",
  "date": "2025-12-18",
  "total": 85.00,
  "items": [
    {"name": "Ceviche", "price": 25.00},
    {"name": "Wine", "price": 30.00}
  ],
  "tax": 8.50,
  "tip": 12.75
}
```

---

## Query Examples

### Get All Confirmed Bookings for Trip
```sql
SELECT b.*, ii.title as activity_name
FROM bookings b
LEFT JOIN itinerary_items ii ON b.itinerary_item_id = ii.id
WHERE b.trip_id = $trip_id
  AND b.booking_status = 'confirmed'
ORDER BY b.booking_date, b.booking_time;
```

### Get Active Watchlist with Price Drops
```sql
SELECT w.*,
       (w.current_price - LAG(w.current_price) 
        OVER (PARTITION BY w.id ORDER BY w.updated_at)) as price_change
FROM watchlist_items w
WHERE w.user_id = $user_id
  AND w.status = 'active'
  AND w.auto_book_enabled = true
ORDER BY price_change DESC;
```

### Calculate Trip Spending by Category
```sql
SELECT 
  e.category,
  COUNT(*) as transaction_count,
  SUM(e.amount_usd) as total_spent,
  AVG(e.amount_usd) as avg_per_transaction
FROM expenses e
WHERE e.trip_id = $trip_id
GROUP BY e.category
ORDER BY total_spent DESC;
```

### Check User's Default Payment Method
```sql
SELECT *
FROM payment_methods
WHERE user_id = $user_id
  AND is_default = true
  AND active = true
LIMIT 1;
```

---

## Background Jobs

**Price Monitoring (Every 30s):**
```sql
-- Find items needing price check
SELECT * FROM watchlist_items
WHERE status = 'active'
  AND (last_alert_sent_at IS NULL 
       OR last_alert_sent_at < NOW() - INTERVAL '5 minutes')
ORDER BY updated_at ASC
LIMIT 100;
```

**Send Booking Reminders (Every 15 min):**
```sql
-- Find bookings in next 2 hours without reminder
SELECT * FROM bookings
WHERE booking_status = 'confirmed'
  AND booking_date = CURRENT_DATE
  AND booking_time BETWEEN NOW() AND NOW() + INTERVAL '2 hours'
  AND reminder_sent_at IS NULL;
```

---

## Data Retention

**Completed Bookings:** Keep forever (revenue history)  
**Cancelled Bookings:** Keep 1 year (analytics)  
**Watchlist (expired):** Delete after 30 days  
**Expenses:** Keep forever (tax records)  
**Payment Methods:** Keep until user deletes

---

**Next:** See `database-venues.md` for restaurant/event/activity tables
