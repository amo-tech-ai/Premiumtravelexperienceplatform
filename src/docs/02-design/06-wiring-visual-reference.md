# WIRING VISUAL REFERENCE
## Frontend-Backend Connection Map

**Document:** 06-wiring-visual-reference.md  
**Last Updated:** December 22, 2024  
**Purpose:** Visual guide to API connections and data flow

---

## 🔌 API WIRING DIAGRAM

```
FRONTEND                    BACKEND                     DATABASE
========                    =======                     ========

/app/trips                  GET /trips                  trips table
  ↓                           ↓                           ↓
TripsPage.tsx   ────────→   index.tsx   ────────→   Supabase PostgreSQL
  ↓                           ↓                           ↓
useTrips hook               trip endpoints              KV store
```

---

## 📡 API ENDPOINTS (25)

### Trips (6 endpoints)
```
GET    /trips              → List all trips
POST   /trips              → Create trip
GET    /trips/:id          → Get trip details
PUT    /trips/:id          → Update trip
DELETE /trips/:id          → Delete trip
```

### Trip Items (4 endpoints)
```
GET    /trips/:id/items         → List items
POST   /trips/:id/items         → Add item
PUT    /trips/:id/items/:itemId → Update item
DELETE /trips/:id/items/:itemId → Delete item
```

### AI (2 endpoints)
```
POST   /ai/chat            → Synchronous chat
POST   /ai/chat/stream     → Streaming chat
```

### Jobs (5 endpoints)
```
POST   /jobs               → Create job
GET    /jobs/:id           → Get job status
GET    /jobs               → List jobs
POST   /jobs/:id/cancel    → Cancel job
POST   /jobs/cleanup       → Cleanup (cron)
```

---

## 🔄 DATA FLOW

### Create Trip Flow
```
1. User clicks "Create Trip" button
2. TripCreateModal opens
3. User fills form → validates
4. POST /trips with trip data
5. Backend creates trip in DB
6. Returns trip object
7. Frontend updates state
8. Redirects to /app/trip/:id
```

### AI Chat Flow
```
1. User types message in Concierge
2. POST /ai/chat with message
3. Backend calls Gemini API
4. Streams response back
5. Frontend displays in chat
6. Saves to conversation history
```

---

## 🗄️ DATABASE SCHEMA

### Tables
- `trips` - Trip metadata
- `trip_items` - Activities/places
- `saved_places` - User saved places
- `user_preferences` - User settings
- `collections` - Place collections
- `jobs` - Background job queue

---

**Document Location:** `/docs/02-design/06-wiring-visual-reference.md`  
**Previous Location:** `/docs/WIRING-VISUAL-REFERENCE.md`  
**Full diagrams:** See `/docs/architecture/` for detailed wiring
