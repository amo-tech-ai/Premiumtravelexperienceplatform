# Current Sitemap — As-Is Analysis

**Date:** December 20, 2024  
**Status:** Current production structure  
**Issues Identified:** 5 critical

---

## 🗺️ Existing Routes

### Production Routes

| Route | Label | Purpose | Status |
|-------|-------|---------|--------|
| `/explore` | Explore | Main dashboard / discovery | ✅ Primary |
| `/chats` | Chats | User conversations | ✅ Core |
| `/itineraries` | Itineraries | Trip management | 🟡 Rename needed |
| `/saved` | Saved | Collections / bookmarks | ✅ Core |
| `/concierge` | Concierge | AI assistant | ✅ Core |
| `/dashboard` | Dashboard | Legacy dashboard | 🔴 Duplicate |
| `/trip/mock1` | Trip Detail | Prototype page | 🟡 Hardcoded |

---

## 📊 Current Sitemap Diagram

```mermaid
flowchart TD
    Start([User Enters App]) --> Auth{Authenticated?}
    Auth -->|No| Login[Login Page]
    Auth -->|Yes| Explore[/explore - Main Dashboard]
    
    Explore --> Chats[/chats - Conversations]
    Explore --> Itineraries[/itineraries - Trip List]
    Explore --> Saved[/saved - Collections]
    Explore --> Concierge[/concierge - AI Assistant]
    Explore --> Dashboard[/dashboard - Legacy Dashboard]
    
    Itineraries --> TripDetail[/trip/mock1 - Trip Detail]
    
    style Explore fill:#6366f1,color:#fff
    style Dashboard fill:#ef4444,color:#fff
    style TripDetail fill:#f59e0b,color:#fff
```

---

## 🚨 Critical Issues

### Issue #1: Duplicate Dashboards

**Problem:**
- `/explore` = Main dashboard
- `/dashboard` = Secondary dashboard

**Impact:**
- User confusion (which is home?)
- Duplicate functionality
- Maintenance burden

**Recommendation:** Remove `/dashboard`, make `/explore` the single entry point

---

### Issue #2: Inconsistent Naming

**Problem:**
- `/itineraries` (technical term)
- Should be `/trips` (user-friendly)

**Impact:**
- Less intuitive for users
- "Itineraries" sounds formal/complex
- "Trips" is universal

**Recommendation:** Rename `/itineraries` → `/trips`

---

### Issue #3: Hardcoded Prototype Routes

**Problem:**
- `/trip/mock1` (hardcoded ID)
- Not using dynamic routes

**Impact:**
- Can't navigate to real trips
- Prototype bleeding into production

**Recommendation:** Change to `/trip/:id` (dynamic)

---

### Issue #4: Flat Navigation

**Problem:**
- All routes at same level
- No hierarchy or grouping
- No contextual navigation

**Impact:**
- Harder to scale
- No logical groupings
- Missing contextual features

**Recommendation:** Add nested routes for features

---

### Issue #5: Missing Key Routes

**Problem:**
- No trip planning flow
- No map views
- No booking management
- No collection detail pages
- No chat detail/history

**Impact:**
- Incomplete feature set
- Users must leave app for core actions

**Recommendation:** Add advanced routes (see 03-proposed-advanced.md)

---

## 📋 Route Analysis

### `/explore` — Main Dashboard ✅

**Purpose:** Discovery hub, primary entry point  
**Status:** ✅ Correct (should remain main dashboard)  
**User Actions:**
- Browse destinations
- See recommendations
- Quick access to trips
- Search locations

**Recommendation:** Keep, enhance with widgets

---

### `/chats` — Conversations ✅

**Purpose:** Message history  
**Status:** ✅ Logical  
**User Actions:**
- View all conversations
- Start new chat
- Search messages

**Recommendation:** Keep, add nested routes for detail

---

### `/itineraries` — Trips 🟡

**Purpose:** Trip management  
**Status:** 🟡 Rename needed  
**User Actions:**
- View all trips
- Create new trip
- Filter/search trips

**Recommendation:** Rename to `/trips`

---

### `/saved` — Collections ✅

**Purpose:** Bookmarked places  
**Status:** ✅ Logical  
**User Actions:**
- View saved places
- Organize collections
- Share collections

**Recommendation:** Keep, add collection detail pages

---

### `/concierge` — AI Assistant ✅

**Purpose:** AI concierge interface  
**Status:** ✅ Core feature  
**User Actions:**
- Ask questions
- Get recommendations
- Plan trips

**Recommendation:** Keep, add contextual modes

---

### `/dashboard` — Legacy Dashboard 🔴

**Purpose:** Secondary dashboard (?)  
**Status:** 🔴 Redundant  
**User Actions:**
- Unclear (duplicates /explore)

**Recommendation:** **REMOVE** — consolidate into `/explore`

---

### `/trip/mock1` — Trip Detail 🟡

**Purpose:** Trip detail view  
**Status:** 🟡 Hardcoded prototype  
**User Actions:**
- View trip details
- Edit itinerary
- See map

**Recommendation:** Change to `/trip/:id` (dynamic)

---

## 🏗️ Current Information Architecture

```mermaid
graph TD
    subgraph "Entry Points"
        A[/explore]
        B[/dashboard]
    end
    
    subgraph "Core Features"
        C[/chats]
        D[/itineraries]
        E[/saved]
        F[/concierge]
    end
    
    subgraph "Detail Pages"
        G[/trip/mock1]
    end
    
    A --> C
    A --> D
    A --> E
    A --> F
    B --> C
    B --> D
    D --> G
    
    style A fill:#6366f1,color:#fff
    style B fill:#ef4444,color:#fff
    style G fill:#f59e0b,color:#fff
```

---

## 📊 Route Metrics

| Metric | Value | Status |
|--------|-------|--------|
| Total routes | 7 | 🟡 Too few |
| Entry points | 2 | 🔴 Duplicate |
| Detail pages | 1 | 🔴 Insufficient |
| Dynamic routes | 0 | 🔴 None |
| Nested routes | 0 | 🔴 None |
| Dead ends | 3 | 🟡 Needs work |

---

## 🎯 Problems Summary

1. **Duplicate dashboards** (/explore + /dashboard)
2. **Inconsistent naming** (itineraries vs trips)
3. **Hardcoded routes** (/trip/mock1)
4. **Flat structure** (no hierarchy)
5. **Missing features** (no planning, map, bookings)
6. **No dynamic routes** (can't navigate to real data)
7. **No nested contexts** (no trip-specific actions)

---

## ✅ What's Working

1. ✅ `/explore` as main dashboard (good choice)
2. ✅ Clear core features (chats, trips, saved, concierge)
3. ✅ Logical grouping of functionality
4. ✅ User-friendly labels (except "itineraries")

---

## 🚀 Migration Path

### Phase 1: Fix Critical Issues (Week 1)

1. Remove `/dashboard` route
2. Redirect `/dashboard` → `/explore`
3. Rename `/itineraries` → `/trips`
4. Change `/trip/mock1` → `/trip/:id`

### Phase 2: Add Core Features (Week 2)

5. Add `/trip/:id` dynamic routing
6. Add `/saved/collections/:id`
7. Add `/chats/:id` detail view

### Phase 3: Add Advanced Features (Week 3-4)

8. Add `/trip/:id/plan` (planning mode)
9. Add `/trip/:id/map` (map view)
10. Add contextual AI features

---

## 📋 Recommendations

**Priority 1 (Critical):**
- [ ] Remove `/dashboard` (redundant)
- [ ] Rename `/itineraries` → `/trips`
- [ ] Fix `/trip/mock1` → `/trip/:id`

**Priority 2 (High):**
- [ ] Add dynamic routing
- [ ] Add detail pages for all resources
- [ ] Create nested contextual routes

**Priority 3 (Medium):**
- [ ] Add advanced features (planning, maps)
- [ ] Implement contextual AI modes
- [ ] Add booking management

---

**Next:** See `02-proposed-core.md` for improved structure
