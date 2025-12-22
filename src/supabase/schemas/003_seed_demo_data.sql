-- ============================================================================
-- Migration 003: Seed Demo Data (Dev Only)
-- ============================================================================
-- Run manually in dev/staging - DO NOT auto-execute in production
-- ============================================================================

-- ============================================================================
-- SEED LOCATIONS (shared physical places)
-- ============================================================================

INSERT INTO public.locations (name, area, address, lat, lng, source) VALUES
('Plaza Mayor', 'El Poblado', 'Calle 41, Medellín', 6.244203, -75.573553, 'manual'),
('Parque Lleras', 'El Poblado', 'Carrera 37, Medellín', 6.208763, -75.569088, 'manual'),
('Carrera 70', 'Laureles', 'Carrera 70, Medellín', 6.246429, -75.596557, 'manual')
ON CONFLICT DO NOTHING
RETURNING id;

-- ============================================================================
-- SEED EVENTS
-- ============================================================================

WITH loc AS (SELECT id FROM public.locations WHERE name = 'Plaza Mayor' LIMIT 1)
INSERT INTO public.events (location_id, name, description, category, start_time, end_time, source_url)
SELECT 
  loc.id,
  'Medellín Music Festival',
  'The biggest music festival in Colombia featuring international and local artists',
  'concert',
  '2025-03-15T19:00:00Z'::timestamptz,
  '2025-03-15T23:00:00Z'::timestamptz,
  'https://medellinmusicfestival.com'
FROM loc;

WITH loc AS (SELECT id FROM public.locations WHERE name = 'Plaza Mayor' LIMIT 1)
INSERT INTO public.events (location_id, name, description, category, start_time, end_time, source_url)
SELECT 
  loc.id,
  'Feria de las Flores',
  'Annual flower festival celebrating Medellín''s culture',
  'festival',
  '2025-08-01T10:00:00Z'::timestamptz,
  '2025-08-10T20:00:00Z'::timestamptz,
  'https://feriadelasflores.com'
FROM loc;

WITH loc AS (SELECT id FROM public.locations WHERE name = 'Plaza Mayor' LIMIT 1)
INSERT INTO public.events (location_id, name, description, category, start_time, end_time, source_url)
SELECT 
  loc.id,
  'Colombiamoda Fashion Week',
  'Latin America''s premier fashion event',
  'fashion',
  '2025-07-25T14:00:00Z'::timestamptz,
  '2025-07-27T22:00:00Z'::timestamptz,
  'https://colombiamoda.com'
FROM loc;

-- ============================================================================
-- SEED RESTAURANTS
-- ============================================================================

WITH loc AS (SELECT id FROM public.locations WHERE name = 'Parque Lleras' LIMIT 1)
INSERT INTO public.restaurants (location_id, name, description, cuisine, price_tier, rating, source_url)
SELECT 
  loc.id,
  'Carmen',
  'Fine dining restaurant showcasing Colombian ingredients',
  'Colombian',
  '$$$$',
  4.8,
  'https://carmen.com.co'
FROM loc;

WITH loc AS (SELECT id FROM public.locations WHERE name = 'Parque Lleras' LIMIT 1)
INSERT INTO public.restaurants (location_id, name, description, cuisine, price_tier, rating, source_url)
SELECT 
  loc.id,
  'El Cielo',
  'Sensory dining experience with molecular gastronomy',
  'Fusion',
  '$$$$',
  4.9,
  'https://elcielo.com.co'
FROM loc;

WITH loc AS (SELECT id FROM public.locations WHERE name = 'Parque Lleras' LIMIT 1)
INSERT INTO public.restaurants (location_id, name, description, cuisine, price_tier, rating, source_url)
SELECT 
  loc.id,
  'Oci.Mde',
  'Modern Peruvian cuisine with fresh seafood',
  'Peruvian',
  '$$$',
  4.7,
  'https://ocimde.com'
FROM loc;

-- ============================================================================
-- SEED RENTALS
-- ============================================================================

WITH loc AS (SELECT id FROM public.locations WHERE name = 'Carrera 70' LIMIT 1)
INSERT INTO public.rentals (location_id, name, description, rental_type, price_amount, price_unit, source_url)
SELECT 
  loc.id,
  'Toyota Fortuner 2024',
  'Spacious SUV perfect for exploring Colombia',
  'car',
  75.00,
  'per_day',
  'https://rent-a-car-medellin.com'
FROM loc;

WITH loc AS (SELECT id FROM public.locations WHERE name = 'Carrera 70' LIMIT 1)
INSERT INTO public.rentals (location_id, name, description, rental_type, price_amount, price_unit, source_url)
SELECT 
  loc.id,
  'Honda PCX 150 Scooter',
  'Perfect for navigating Medellín traffic',
  'scooter',
  25.00,
  'per_day',
  'https://moto-rentals-medellin.com'
FROM loc;

WITH loc AS (SELECT id FROM public.locations WHERE name = 'Carrera 70' LIMIT 1)
INSERT INTO public.rentals (location_id, name, description, rental_type, price_amount, price_unit, source_url)
SELECT 
  loc.id,
  'Trek Mountain Bike',
  'High-quality mountain bike for exploring',
  'bicycle',
  15.00,
  'per_day',
  'https://bike-rentals-medellin.com'
FROM loc;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
DECLARE
  location_count INTEGER;
  event_count INTEGER;
  restaurant_count INTEGER;
  rental_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO location_count FROM public.locations WHERE deleted_at IS NULL;
  SELECT COUNT(*) INTO event_count FROM public.events WHERE deleted_at IS NULL;
  SELECT COUNT(*) INTO restaurant_count FROM public.restaurants WHERE deleted_at IS NULL;
  SELECT COUNT(*) INTO rental_count FROM public.rentals WHERE deleted_at IS NULL;
  
  RAISE NOTICE '✅ Seeded data:';
  RAISE NOTICE '  - Locations: %', location_count;
  RAISE NOTICE '  - Events: %', event_count;
  RAISE NOTICE '  - Restaurants: %', restaurant_count;
  RAISE NOTICE '  - Rentals: %', rental_count;
END $$;

-- View sample data with joins
SELECT 
  'event' as type,
  e.name,
  e.category,
  l.area,
  l.address
FROM public.events e
LEFT JOIN public.locations l ON e.location_id = l.id
WHERE e.deleted_at IS NULL
UNION ALL
SELECT 
  'restaurant' as type,
  r.name,
  r.cuisine as category,
  l.area,
  l.address
FROM public.restaurants r
LEFT JOIN public.locations l ON r.location_id = l.id
WHERE r.deleted_at IS NULL
UNION ALL
SELECT 
  'rental' as type,
  rn.name,
  rn.rental_type as category,
  l.area,
  l.address
FROM public.rentals rn
LEFT JOIN public.locations l ON rn.location_id = l.id
WHERE rn.deleted_at IS NULL;
