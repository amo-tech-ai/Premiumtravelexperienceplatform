# 📋 LOCAL SCOUT SYSTEM OVERVIEW
## Trip Operating System - Complete Technical Documentation

**Last Updated:** December 21, 2024  
**Version:** 1.0.0  
**Status:** 75% Production Ready  
**Environment:** Figma Make (React + Supabase)

---

## 📑 TABLE OF CONTENTS

1. [Tech Stack](#tech-stack)
2. [Directory Structure](#directory-structure)
3. [Sitemap](#sitemap)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend Architecture](#backend-architecture)
6. [AI System](#ai-system)
7. [Database Schema](#database-schema)
8. [User Journeys](#user-journeys)
9. [Design System](#design-system)
10. [Workflows](#workflows)

---

## 🛠️ TECH STACK

### **Frontend**
```yaml
Framework: React 18.x
Language: TypeScript
Router: react-router-dom@6.x
State Management: React Context API
Build Tool: Vite (Figma Make environment)

UI Libraries:
  - Tailwind CSS v4.0 (no config file)
  - Radix UI (headless components)
  - Lucide React (icons)
  - Framer Motion → motion/react (animations)
  - Recharts (data visualization)
  - React Slick (carousels)
  - React DnD (drag & drop)

Forms & Validation:
  - react-hook-form@7.55.0
  - Custom validation utilities

Image Handling:
  - Unsplash API (stock images)
  - figma:asset (imported images)
  - ImageWithFallback component
```

### **Backend**
```yaml
Runtime: Deno (Supabase Edge Functions)
Framework: Hono (web framework)
Language: TypeScript

Core Services:
  - Supabase (BaaS platform)
  - Supabase Auth (authentication)
  - Supabase Storage (file storage)
  - Edge Functions (serverless)

Key Packages:
  - npm:hono (web framework)
  - npm:hono/cors (CORS middleware)
  - npm:hono/logger (request logging)
  - npm:hono/streaming (SSE/streaming)
```

### **Database**
```yaml
Primary: Supabase Postgres
Key-Value Store: kv_store_fd8c4bf7 (custom KV table)

Schema Design:
  - Key-based storage (user:trips, user:places, etc.)
  - JSON storage for flexible schemas
  - No direct SQL migrations (KV abstraction)
```

### **AI & ML**
```yaml
Provider: Google Gemini (via API)
Model: gemini-pro (default)
Features:
  - Function calling
  - Streaming responses
  - Context management
  - Multi-agent orchestration

Custom Components:
  - Event bus (agent communication)
  - Context manager (conversation state)
  - Collaboration engine (agent coordination)
  - Proactive assistant (suggestions)
  - 6 specialized agents
```

### **DevOps & Deployment**
```yaml
Hosting: Supabase (managed)
CDN: Supabase CDN
Domain: [project-id].supabase.co
SSL: Automatic (Supabase)
Environment: Production (no staging)

Monitoring:
  - Console.log (Edge Function logs)
  - Supabase Dashboard (metrics)
  - Custom analytics service
```

---

## 📁 DIRECTORY STRUCTURE

```
/
├── App.tsx                          # Root component with routing
│
├── components/                      # React components (200+)
│   ├── ProgressTracker.tsx         # Job progress UI (NEW)
│   ├── ai/                         # AI-specific components (15)
│   │   ├── AIChatInterface.tsx
│   │   ├── AIConcierge.tsx
│   │   ├── AIStatusIndicator.tsx
│   │   ├── AIWizardBridge.tsx
│   │   ├── AdvancedAIDemo.tsx
│   │   ├── AgentStatusPanel.tsx
│   │   ├── ChatBubble.tsx
│   │   ├── ConciergeFab.tsx
│   │   ├── ConciergeOverlay.tsx
│   │   ├── StreamingChatInterface.tsx
│   │   └── cards/
│   │       └── DiningCard.tsx
│   │
│   ├── booking/                    # Booking components (4)
│   │   ├── BookingFlow.tsx
│   │   ├── BookingSheet.tsx
│   │   ├── DetailBookingCard.tsx
│   │   └── MobileBookingBar.tsx
│   │
│   ├── common/                     # Shared utilities
│   │   └── ErrorBoundary.tsx
│   │
│   ├── events/                     # Event components (3)
│   │   ├── EventCard.tsx
│   │   ├── EventDetailSheet.tsx
│   │   └── LocalEventsHub.tsx
│   │
│   ├── experiences/                # Experience components (10)
│   │   ├── ExperienceCard.tsx
│   │   ├── ExperienceGrid.tsx
│   │   ├── ExperienceHero.tsx
│   │   ├── DetailHero.tsx
│   │   ├── BookingCard.tsx
│   │   └── ...
│   │
│   ├── explore/                    # Explore/Map components (4)
│   │   ├── ExploreFilters.tsx
│   │   ├── ExploreMap.tsx
│   │   ├── PlaceCard.tsx
│   │   └── PlaceDetailDrawer.tsx
│   │
│   ├── home/                       # Home page components (3)
│   ├── home-v2/                    # Home v2 components (4)
│   │
│   ├── itinerary/                  # Itinerary components (6)
│   │   ├── ItineraryDayHeader.tsx
│   │   ├── ItineraryItem.tsx
│   │   ├── PlannerFeed.tsx
│   │   ├── PlannerMap.tsx
│   │   ├── PlannerSidebar.tsx
│   │   └── TripPlannerLayout.tsx
│   │
│   ├── landing/                    # Landing page components (12)
│   │   ├── Hero.tsx
│   │   ├── HeroSearch.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── DestinationGrid.tsx
│   │   └── ...
│   │
│   ├── layout/                     # Layout components (8)
│   │   ├── AppShell.tsx
│   │   ├── MainLayout.tsx
│   │   ├── Navbar.tsx
│   │   ├── TopNav.tsx
│   │   ├── BottomNav.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── WizardLayout.tsx
│   │
│   ├── modals/                     # Modal components (3)
│   │   ├── AddActivityModal.tsx
│   │   ├── EditActivityModal.tsx
│   │   └── DeleteActivityDialog.tsx
│   │
│   ├── pricing/                    # Pricing components (7)
│   │   ├── PricingHero.tsx
│   │   ├── PricingCard.tsx
│   │   ├── FeatureComparisonTable.tsx
│   │   └── ...
│   │
│   ├── trip-details/               # Trip detail components (8)
│   │   ├── TripDetailsContext.tsx
│   │   ├── AIActionsPanel.tsx
│   │   ├── ItineraryFeed.tsx
│   │   ├── TripMap.tsx
│   │   ├── TripSidebar.tsx
│   │   └── luxury/                 # Luxury variant (6)
│   │       ├── LuxuryItineraryFeed.tsx
│   │       ├── DaySection.tsx
│   │       ├── ItineraryItemCard.tsx
│   │       └── ...
│   │
│   ├── ui/                         # Base UI components (40+)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── sheet.tsx
│   │   ├── accordion.tsx
│   │   ├── alert.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── calendar.tsx
│   │   ├── carousel.tsx
│   │   ├── checkbox.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── progress.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   │
│   ├── wizard/                     # Wizard components (7)
│   │   ├── ModeSelection.tsx
│   │   ├── FilterWizard.tsx
│   │   ├── ResultsList.tsx
│   │   ├── ResultsMap.tsx
│   │   └── ...
│   │
│   └── use-cases/                  # Use case components (6)
│       ├── UseCaseLayout.tsx
│       ├── SolutionShowcase.tsx
│       └── ...
│
├── context/                        # React Context providers (3)
│   ├── AIContext.tsx              # AI state management
│   ├── TripContext.tsx            # Trip state management
│   └── WizardContext.tsx          # Wizard state management
│
├── hooks/                          # Custom React hooks (4)
│   ├── useAdvancedAI.ts
│   ├── useSavedPlaces.ts
│   ├── useTrips.ts
│   └── useJobStatus.ts            # Job polling (NEW)
│
├── lib/                            # Core libraries
│   ├── ai/                         # AI system (10 files)
│   │   ├── agents/                 # 6 specialized agents
│   │   │   ├── base-agent.ts
│   │   │   ├── booking-assistant.ts
│   │   │   ├── budget-guardian.ts
│   │   │   ├── dining-orchestrator.ts
│   │   │   ├── event-curator.ts
│   │   │   ├── itinerary-optimizer.ts
│   │   │   └── local-scout.ts
│   │   ├── collaboration-engine.ts
│   │   ├── context-manager.ts
│   │   ├── event-bus.ts
│   │   ├── gemini-client.ts
│   │   ├── gemini-tools.ts
│   │   ├── gemini.ts
│   │   ├── orchestrator.ts
│   │   ├── proactive-assistant.ts
│   │   └── types.ts
│   │
│   ├── api/                        # API client (5 files)
│   │   ├── client.ts              # Base HTTP client
│   │   ├── index.ts
│   │   ├── preferences.ts
│   │   ├── saved-places.ts
│   │   ├── trips.ts
│   │   └── types.ts
│   │
│   ├── services/                   # Service layer (6 files)
│   │   ├── analytics.ts
│   │   ├── collaboration.ts
│   │   ├── export.ts
│   │   ├── geocoding.ts
│   │   ├── notifications.ts
│   │   └── pwa.ts
│   │
│   ├── supabase/                   # Supabase integration
│   │   ├── client.ts
│   │   ├── queries/
│   │   │   └── trips.ts
│   │   └── types.ts
│   │
│   └── utils/                      # Utility functions (3)
│       ├── currency.ts
│       ├── date.ts
│       └── validation.ts
│
├── pages/                          # Page components (45+)
│   ├── Home.tsx
│   ├── Dashboard.tsx
│   ├── Concierge.tsx
│   ├── Explorer.tsx
│   ├── Pricing.tsx
│   ├── HowItWorks.tsx
│   ├── HowItWorksV2.tsx
│   ├── FeatureGallery.tsx
│   ├── ProductionStatus.tsx
│   ├── StyleGuide.tsx
│   ├── Architecture.tsx
│   ├── WhatsNew.tsx
│   │
│   ├── app/                        # App pages (3)
│   │   ├── TripsPage.tsx
│   │   ├── TripDetailPage.tsx
│   │   └── ConciergePage.tsx
│   │
│   ├── real-estate/                # Real estate pages (4)
│   │   ├── RealEstateHome.tsx
│   │   ├── PropertySearch.tsx
│   │   ├── PropertyDetail.tsx
│   │   └── MarketInsights.tsx
│   │
│   ├── saved/                      # Saved places (1)
│   │   └── SavedPlacesPage.tsx
│   │
│   ├── trip/                       # Trip pages (1)
│   │   └── TripDetailsPage.tsx
│   │
│   └── use-cases/                  # Use case pages (4)
│       ├── UseCasesIndex.tsx
│       ├── DigitalNomadPage.tsx
│       ├── LuxuryTravelerPage.tsx
│       └── GroupTripPage.tsx
│
├── supabase/functions/server/      # Edge Functions (5 files)
│   ├── index.tsx                   # Main server (31 endpoints)
│   ├── ai-service.tsx              # AI integration
│   ├── database-setup.tsx          # Database operations
│   ├── job-service.ts              # Async job queue (NEW)
│   └── kv_store.tsx                # Key-value store (PROTECTED)
│
├── utils/                          # Utility functions (10)
│   ├── aiAutomation.ts
│   ├── animation.ts
│   ├── budget.ts
│   ├── distance.ts
│   ├── formatting.ts
│   ├── mockEngine.ts
│   ├── mockTripData.ts
│   ├── mockValidation.ts
│   ├── scoring.ts
│   ├── time.ts
│   └── supabase/
│       └── info.tsx                # Supabase credentials
│
├── data/                           # Mock data (3)
│   ├── mock-trip-data.ts
│   ├── mockTripData.ts
│   └── tripTemplates.ts
│
├── styles/                         # Global styles
│   └── globals.css                 # Tailwind + design tokens
│
├── types/                          # TypeScript types (1)
│   └── wizard.ts
│
├── public/                         # Static assets
│   ├── manifest.json               # PWA manifest
│   └── service-worker.js           # Service worker
│
└── docs/                           # Documentation (150+ files)
    ├── main/                       # Main docs (NEW)
    │   └── 01-overview.md          # This file
    ├── roadmap/                    # Implementation roadmap
    ├── features/                   # Feature docs
    ├── architecture/               # System architecture
    ├── supabase/                   # Database docs
    └── ...
```

**Total Files:** 450+  
**Total Lines of Code:** ~50,000+

---

## 🗺️ SITEMAP

### **PUBLIC WEBSITE** (Marketing & Info)

```
/ (Home)
│
├── /how-it-works              # Product explanation
├── /how-it-works-v2           # Detailed walkthrough
├── /pricing                   # Pricing plans
│
├── /use-cases                 # Use case hub
│   ├── /use-cases/digital-nomad
│   ├── /use-cases/luxury-traveler
│   └── /use-cases/group-trip
│
├── /features                  # Feature gallery
├── /ai-demo                   # AI capabilities demo
└── /whats-new                 # Product updates
```

### **CORE APPLICATION** (Trip Planning)

```
/dashboard                     # User dashboard
│
├── /trips                     # Trip list (App)
│   ├── /trips/:id            # Trip details (App)
│   └── /itinerary            # Itinerary builder
│
├── /concierge                 # AI Concierge chat
├── /chats                     # Chat history
│
├── /map                       # Explorer map view
├── /explore                   # Explore places
│
├── /saved                     # Saved places
│
└── /wizard/:category          # Mini-wizards
    ├── /wizard/dining
    ├── /wizard/events
    ├── /wizard/experiences
    └── /wizard/stays
```

### **DISCOVERY & SEARCH**

```
/experiences/medellin          # City experiences
├── /experiences/:id           # Experience detail
└── /experiences/medellin/la-deriva

/restaurants/:id               # Restaurant detail
/events/:id                    # Event detail

/results                       # Search results
```

### **REAL ESTATE** (Vertical)

```
/real-estate                   # Real estate home
├── /real-estate/search        # Property search
├── /real-estate/listing/:id   # Property detail
└── /real-estate/market-data   # Market insights
```

### **SYSTEM PAGES**

```
/status                        # Production status
/architecture                  # System architecture
/style-guide                   # Design system
```

---

## 🎨 FRONTEND ARCHITECTURE

### **Framework Setup**
```typescript
// App.tsx - Root component
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AIProvider>           // AI state management
          <TripProvider>       // Trip state management
            <WizardProvider>   // Wizard state management
              <AppShell>       // Layout wrapper
                <Routes>
                  {/* 45+ routes */}
                </Routes>
              </AppShell>
            </WizardProvider>
          </TripProvider>
        </AIProvider>
      </Router>
    </ErrorBoundary>
  );
}
```

### **State Management Pattern**
```
React Context API
├── AIContext - AI agent state, conversation history
├── TripContext - Active trip, items, collaborators
└── WizardContext - Wizard flow state, filters, results

Custom Hooks
├── useTrips() - Trip CRUD operations
├── useSavedPlaces() - Saved places management
├── useAdvancedAI() - AI interaction
└── useJobStatus() - Async job polling
```

### **Component Architecture**
```
Atomic Design Pattern:
├── Atoms - ui/ components (buttons, inputs, badges)
├── Molecules - Composite UI (cards, forms)
├── Organisms - Feature components (modals, panels)
├── Templates - Layout components (AppShell, MainLayout)
└── Pages - Page-level components (Home, Dashboard)

Naming Convention:
- PascalCase for components (TripCard.tsx)
- camelCase for hooks (useTrips.ts)
- kebab-case for utilities (api-client.ts)
```

### **Routing Strategy**
```typescript
Public Routes (no auth):
  / - Home
  /pricing - Pricing
  /how-it-works - How it works
  /use-cases/* - Use case pages
  
Protected Routes (needs auth - currently demo):
  /dashboard - Dashboard
  /trips - Trips list
  /trips/:id - Trip details
  /concierge - AI Concierge
  /saved - Saved places
  
System Routes:
  /status - Production status
  /architecture - System docs
  /style-guide - Design system
```

---

## 🔧 BACKEND ARCHITECTURE

### **Server Structure**
```typescript
// /supabase/functions/server/index.tsx
import { Hono } from "npm:hono";

const app = new Hono();

// Middleware
app.use('*', logger(console.log));
app.use('/*', cors({ origin: "*" }));

// Routes (31 endpoints)
app.get('/make-server-fd8c4bf7/health', ...);
app.get('/make-server-fd8c4bf7/trips', ...);
app.post('/make-server-fd8c4bf7/trips', ...);
// ... 28 more

Deno.serve(app.fetch);
```

### **API Endpoints (31 Total)**

#### **Core CRUD (17 endpoints)**
```
TRIPS (5):
  GET    /trips              List user trips
  GET    /trips/:id          Get trip details
  POST   /trips              Create trip
  PUT    /trips/:id          Update trip
  DELETE /trips/:id          Delete trip

TRIP ITEMS (4):
  GET    /trips/:id/items           List trip items
  POST   /trips/:id/items           Add item
  PUT    /trips/:id/items/:itemId   Update item
  DELETE /trips/:id/items/:itemId   Delete item

SAVED PLACES (3):
  GET    /saved              List saved places
  POST   /saved              Save place
  DELETE /saved/:id          Remove place

USER PREFERENCES (2):
  GET    /preferences        Get preferences
  PUT    /preferences        Update preferences

COLLECTIONS (3):
  GET    /collections        List collections
  POST   /collections        Create collection
  POST   /collections/:id/places/:placeId  Add place
```

#### **AI & Search (3 endpoints)**
```
AI CHAT:
  POST   /ai/chat            AI chat (blocking)
  POST   /ai/chat/stream     AI chat (streaming)

SEARCH:
  GET    /places/search      Search places (TODO)
```

#### **Job Queue (6 endpoints)** ✅ NEW
```
JOBS:
  POST   /jobs               Create job
  GET    /jobs               List user jobs
  GET    /jobs/:id           Get job status
  POST   /jobs/:id/cancel    Cancel job
  DELETE /jobs/:id           Delete job
  POST   /jobs/cleanup       Cleanup expired (cron)
```

#### **Utility (2 endpoints)**
```
HEALTH & DEMO:
  GET    /health             Health check
  POST   /seed-demo          Seed demo data
```

### **Service Layer**

```typescript
// Database Service
database-setup.tsx:
  - getUserTrips()
  - getTrip()
  - createTrip()
  - updateTrip()
  - deleteTrip()
  - getTripItems()
  - addTripItem()
  - updateTripItem()
  - deleteTripItem()
  - getSavedPlaces()
  - savePlace()
  - unsavePlace()
  - getUserPreferences()
  - updateUserPreferences()
  - getUserCollections()
  - createCollection()
  - addPlaceToCollection()
  - seedDemoData()

// AI Service
ai-service.tsx:
  - getAIService()
  - processMessage()
  - processMessageStream()
  - isReady()

// Job Service (NEW)
job-service.ts:
  - createJob()
  - getJob()
  - getUserJobs()
  - updateJob()
  - cancelJob()
  - deleteJob()
  - processJob()
  - cleanupExpiredJobs()
```

### **Error Handling**
```typescript
// Standard error response
function errorResponse(message: string, status: number) {
  return {
    error: message,
    status,
    timestamp: new Date().toISOString(),
  };
}

// Standard success response
function successResponse(data: any, message?: string) {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}
```

---

## 🤖 AI SYSTEM

### **Architecture Overview**
```
┌─────────────────────────────────────────────────────────┐
│                   AI Orchestrator                       │
│  - Routes requests to appropriate agents                │
│  - Manages conversation context                         │
│  - Coordinates multi-agent collaboration                │
└──────────┬──────────────────────────────────────────────┘
           │
           ├──────────────────────────────────────────────┐
           │                                              │
┌──────────▼──────────┐                    ┌──────────────▼────────┐
│   Event Bus         │◄───────────────────┤  Context Manager      │
│  - Agent messages   │                    │  - Conversation state │
│  - Coordination     │                    │  - User preferences   │
└──────────┬──────────┘                    │  - Trip context       │
           │                               └───────────────────────┘
           │
           ├─────────┬─────────┬─────────┬─────────┬─────────┐
           │         │         │         │         │         │
     ┌─────▼─┐  ┌───▼───┐ ┌──▼───┐ ┌───▼──┐ ┌───▼──┐ ┌───▼──┐
     │Local  │  │Dining │ │Event │ │Itin. │ │Budget│ │Book. │
     │Scout  │  │Orch.  │ │Curat.│ │Optim.│ │Guard.│ │Asst. │
     └───────┘  └───────┘ └──────┘ └──────┘ └──────┘ └──────┘
```

### **6 Specialized Agents**

#### **1. Local Scout Agent**
```typescript
// /lib/ai/agents/local-scout.ts
Purpose: Discover hidden gems, local experiences
Capabilities:
  - Research neighborhoods
  - Find authentic experiences
  - Cultural insights
  - Off-the-beaten-path recommendations

Tools:
  - searchPlaces()
  - getNeighborhoodInfo()
  - findLocalEvents()
```

#### **2. Dining Orchestrator**
```typescript
// /lib/ai/agents/dining-orchestrator.ts
Purpose: Restaurant recommendations & reservations
Capabilities:
  - Cuisine matching
  - Dietary restrictions
  - Budget-aware suggestions
  - Reservation optimization

Tools:
  - searchRestaurants()
  - checkAvailability()
  - makeReservation()
```

#### **3. Event Curator**
```typescript
// /lib/ai/agents/event-curator.ts
Purpose: Find and recommend events
Capabilities:
  - Event discovery
  - Interest matching
  - Timing optimization
  - Ticket management

Tools:
  - searchEvents()
  - getEventDetails()
  - checkTicketAvailability()
```

#### **4. Itinerary Optimizer**
```typescript
// /lib/ai/agents/itinerary-optimizer.ts
Purpose: Optimize trip schedules
Capabilities:
  - Route optimization
  - Time management
  - Conflict resolution
  - Realistic scheduling

Tools:
  - calculateRoute()
  - optimizeSchedule()
  - detectConflicts()
```

#### **5. Budget Guardian**
```typescript
// /lib/ai/agents/budget-guardian.ts
Purpose: Budget tracking & recommendations
Capabilities:
  - Cost tracking
  - Budget alerts
  - Value optimization
  - Currency conversion

Tools:
  - trackExpense()
  - checkBudget()
  - suggestAlternatives()
```

#### **6. Booking Assistant**
```typescript
// /lib/ai/agents/booking-assistant.ts
Purpose: Handle bookings & confirmations
Capabilities:
  - Booking management
  - Confirmation tracking
  - Cancellation handling
  - Modification requests

Tools:
  - createBooking()
  - trackBooking()
  - modifyBooking()
```

### **Supporting Systems**

#### **Collaboration Engine**
```typescript
// /lib/ai/collaboration-engine.ts
Purpose: Multi-agent coordination
Features:
  - Agent handoffs
  - Task delegation
  - Consensus building
  - Conflict resolution
```

#### **Proactive Assistant**
```typescript
// /lib/ai/proactive-assistant.ts
Purpose: Anticipate user needs
Features:
  - Contextual suggestions
  - Predictive recommendations
  - Automated reminders
  - Smart notifications
```

#### **Event Bus**
```typescript
// /lib/ai/event-bus.ts
Purpose: Agent communication
Features:
  - Message passing
  - Event subscriptions
  - State synchronization
  - Real-time updates
```

### **AI Job Types** (Async Processing)
```typescript
Job Types:
  - ai_trip_generation    // Multi-step trip planning
  - ai_research           // Deep research queries
  - ai_optimization       // Itinerary optimization
  - ai_concierge_query    // Complex concierge requests
  - data_export           // Export user data
  - bulk_import           // Import large datasets

Job Flow:
  1. Client creates job → immediate return with job ID
  2. Server processes in background
  3. Updates progress (0-100%)
  4. Stores result when complete
  5. Client polls for status
```

---

## 🗄️ DATABASE SCHEMA

### **Key-Value Store Structure**
```typescript
// All data stored in: kv_store_fd8c4bf7 table
// Schema: (key: text PRIMARY KEY, value: jsonb)

Key Patterns:
  trips:{userId}:{tripId}              → Trip object
  trip_items:{tripId}:{itemId}         → Trip item
  saved:{userId}:{placeId}             → Saved place
  user_prefs:{userId}                  → User preferences
  collections:{userId}:{collectionId}  → Collection
  job:{jobId}                          → Async job
  user_jobs:{userId}                   → Job ID list
```

### **Data Types**

#### **Trip**
```typescript
interface Trip {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  description?: string;
  cover_image?: string;
  collaborators?: string[];
  status: 'draft' | 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}
```

#### **Trip Item**
```typescript
interface TripItem {
  id: string;
  trip_id: string;
  type: 'place' | 'event' | 'accommodation' | 'transport' | 'note';
  title: string;
  description?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  date: string;
  start_time?: string;
  end_time?: string;
  day: number;
  order: number;
  price?: number;
  currency?: string;
  url?: string;
  image?: string;
  rating?: number;
  category?: string;
  notes?: string;
  booking_status?: 'none' | 'pending' | 'confirmed' | 'cancelled';
  ai_suggested?: boolean;
  ai_reasoning?: string;
  created_at: string;
  updated_at: string;
}
```

#### **Saved Place**
```typescript
interface SavedPlace {
  id: string;
  user_id: string;
  place_id: string;
  title: string;
  description?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  image?: string;
  category?: string;
  rating?: number;
  price_level?: number;
  url?: string;
  collections?: string[];
  notes?: string;
  saved_at: string;
}
```

#### **Job** (NEW)
```typescript
interface Job {
  id: string;
  userId: string;
  type: JobType;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100
  input: any;
  result?: any;
  error?: string;
  checkpoints: Record<string, any>;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  expiresAt: string; // 24 hours
}
```

---

## 👤 USER JOURNEYS

### **Journey 1: New User → First Trip**
```
1. Land on homepage (/)
2. Click "Plan a Trip" → /dashboard
3. Create new trip → POST /trips
4. Add destinations → POST /trips/:id/items
5. Get AI suggestions → POST /jobs (type: ai_trip_generation)
6. Poll for progress → GET /jobs/:id
7. Review generated itinerary
8. Customize & save
9. Share with collaborators
```

### **Journey 2: Research & Discovery**
```
1. Open AI Concierge (/concierge)
2. Ask: "Best hidden restaurants in Paris"
3. Create async job → POST /jobs (type: ai_research)
4. See progress tracker (0% → 100%)
5. Review AI recommendations
6. Save favorites → POST /saved
7. Add to trip → POST /trips/:id/items
```

### **Journey 3: Itinerary Optimization**
```
1. Open trip details → /trips/:id
2. Click "Optimize Schedule"
3. AI analyzes → POST /jobs (type: ai_optimization)
4. Shows progress: "Analyzing routes... 40%"
5. Presents optimized version
6. User approves changes
7. Trip updated → PUT /trips/:id
```

### **Journey 4: Booking Flow**
```
1. Browse experiences → /experiences/medellin
2. Click experience → /experiences/:id
3. View details & pricing
4. Click "Book" → BookingSheet opens
5. Select date/time
6. Confirm booking
7. Booking Assistant handles → POST /bookings
8. Confirmation stored
```

### **Journey 5: Collaboration**
```
1. Create trip → POST /trips
2. Invite collaborators → PUT /trips/:id
3. Share link
4. Collaborators add suggestions
5. Real-time sync via event bus
6. Vote on activities
7. Finalize itinerary
```

---

## 🎨 DESIGN SYSTEM

### **Visual Style**
```
Aesthetic: Luxury, Calm, Confident
Typography: Editorial (serif headlines, sans-serif body)
Color Palette: Soft, muted tones
Shadows: Subtle, elegant
Motion: Restrained, purposeful
Cards: Illustrated, visual-first
Layout: Generous whitespace
```

### **Typography System**
```css
/* globals.css */
h1 { /* Hero headlines */ }
h2 { /* Section titles */ }
h3 { /* Subsection titles */ }
h4 { /* Card titles */ }
p  { /* Body text */ }

Font families:
  - Serif for headlines (luxury feel)
  - Sans-serif for body (readability)
  
DO NOT USE:
  - Tailwind font-size classes (text-xl, text-2xl)
  - Tailwind font-weight classes (font-bold)
  - Tailwind line-height classes (leading-tight)
  
Reason: Custom typography defined in globals.css
```

### **Color Tokens**
```css
:root {
  --background: /* Base background */
  --foreground: /* Text color */
  --card: /* Card background */
  --card-foreground: /* Card text */
  --primary: /* Brand color */
  --primary-foreground: /* Primary text */
  --muted: /* Subtle backgrounds */
  --muted-foreground: /* Subtle text */
  --accent: /* Highlight color */
  --destructive: /* Error/delete */
  --border: /* Border color */
  --input: /* Input border */
  --ring: /* Focus ring */
}
```

### **Component Variants**
```typescript
Button:
  - default (primary action)
  - outline (secondary action)
  - ghost (tertiary action)
  - destructive (delete/cancel)
  - link (text button)

Card:
  - default (standard card)
  - luxury (illustrated, elevated)
  - glass (glassmorphism)

Badge:
  - default, secondary, destructive, outline
```

### **Layout Patterns**
```
AppShell:
  ├── TopNav (desktop) / BottomNav (mobile)
  ├── Sidebar (optional, collapsible)
  ├── Main content area
  └── Footer

MainLayout:
  ├── Header (page title, actions)
  ├── Content (grid/flex)
  └── Aside (filters, details)

WizardLayout:
  ├── Progress indicator
  ├── Step content
  └── Navigation (back/next)
```

### **Responsive Breakpoints**
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

---

## ⚙️ WORKFLOWS

### **Workflow 1: Trip Creation**
```mermaid
Frontend                    Backend                     Database
   │                          │                            │
   ├─[1] Create Trip Form     │                            │
   │                          │                            │
   ├─[2] POST /trips──────────►                            │
   │     {title, destination} │                            │
   │                          │                            │
   │                          ├─[3] Validate input         │
   │                          │                            │
   │                          ├─[4] Generate ID            │
   │                          │                            │
   │                          ├─[5] kv.set()──────────────►│
   │                          │     trips:{userId}:{id}    │
   │                          │                            │
   │◄─[6] Return trip─────────┤                            │
   │     {id, title, ...}     │                            │
   │                          │                            │
   ├─[7] Navigate to /trips/:id                            │
```

### **Workflow 2: AI Trip Generation (Async)**
```mermaid
Frontend                Backend                 Job Service
   │                      │                         │
   ├─[1] Request trip gen │                         │
   │                      │                         │
   ├─[2] POST /jobs───────►                         │
   │     {type: ai_trip}  │                         │
   │                      │                         │
   │                      ├─[3] createJob()────────►│
   │                      │                         │
   │                      │                         ├─[4] Store job
   │                      │                         │     status: queued
   │                      │                         │
   │◄─[5] Return job ID───┤◄────────────────────────┤
   │     {id: "abc123"}   │                         │
   │                      │                         │
   │                      ├─[6] processJob()────────► (background)
   │                      │     (async, don't wait) │
   │                      │                         ├─[7] Update: running
   │                      │                         ├─[8] Call AI (step 1)
   │                      │                         ├─[9] Update: 30%
   │                      │                         ├─[10] Call AI (step 2)
   │                      │                         ├─[11] Update: 70%
   │                      │                         ├─[12] Format result
   │                      │                         ├─[13] Update: completed
   │                      │                         │
   ├─[14] Poll GET /jobs/:id ────────────────────────►
   │      (every 2 seconds)│                         │
   │                      │                         │
   │◄─[15] Return status──┤◄────────────────────────┤
   │      {progress: 70%} │                         │
   │                      │                         │
   ├─[16] Show progress   │                         │
   │      "Optimizing...  │                         │
   │       70%"           │                         │
   │                      │                         │
   ├─[17] Poll again      │                         │
   │                      │                         │
   │◄─[18] Return complete┤                         │
   │      {status: done,  │                         │
   │       result: {...}} │                         │
   │                      │                         │
   ├─[19] Display results │                         │
```

### **Workflow 3: Real-time Collaboration**
```mermaid
User A                  Event Bus              User B
  │                        │                      │
  ├─[1] Add activity       │                      │
  │                        │                      │
  ├─[2] POST /trips/:id/items                     │
  │                        │                      │
  │                        ├─[3] Emit event       │
  │                        │     trip.item.added  │
  │                        │                      │
  │                        │                      ├─[4] Receive event
  │                        │                      │
  │                        │                      ├─[5] Fetch updated trip
  │                        │                      │
  │                        │                      ├─[6] Re-render
  │                        │                      │     (shows new item)
```

---

## 📊 CURRENT STATUS SUMMARY

### **Progress by Layer**
```
Frontend:     85% ████████████████████░░░░
Backend:      75% ███████████████████░░░░░
AI System:    75% ███████████████████░░░░░
Database:     80% ████████████████████░░░░
Design:      100% ████████████████████████
Testing:       5% ██░░░░░░░░░░░░░░░░░░░░░░
Docs:         60% ████████████████░░░░░░░░

Overall:      75% ███████████████████░░░░░
```

### **Feature Completion**
```
✅ COMPLETE:
  - Trip CRUD
  - Trip Items CRUD  
  - Saved Places
  - Preferences
  - Collections
  - AI Chat
  - Async Job Queue ← NEW
  - Progress Tracking
  - 200+ UI Components
  - 6 AI Agents
  - Design System
  - PWA Support

🔴 MISSING:
  - PII-Safe AI Logging
  - Database Idempotency
  - Temp Client IDs (Optimistic UI)
  - Real Authentication
  - AI Confirmation Modal
  - Rate Limiting
  - Comprehensive Testing
```

### **Next Implementation Steps**
```
Week 1:
  Day 1-3: ✅ Async Job Queue (COMPLETE)
  Day 3-4: 🔴 PII-Safe AI Logging (NEXT)
  Day 4-5: 🔴 Database Idempotency
  Day 5:   🔴 Temp Client IDs

Week 2:
  Day 1-2: 🔴 Real Authentication
  Day 3-4: 🔴 AI Confirmation Modal
  Day 5:   🔴 Rate Limiting + Polish

Week 3:
  Launch Prep & Testing
```

---

## 🔗 QUICK LINKS

### **Documentation**
- [Implementation Status](/docs/IMPLEMENTATION-STATUS-CURRENT.md)
- [Progress Dashboard](/docs/roadmap/00-PROGRESS-DASHBOARD.md)
- [Phase 1 Complete](/docs/roadmap/05-IMPLEMENTATION-PHASE-1-COMPLETE.md)
- [Feature Index](/docs/00-FEATURE-INDEX.md)

### **Code References**
- Backend: `/supabase/functions/server/`
- Frontend: `/components/`, `/pages/`
- AI System: `/lib/ai/`
- API Client: `/lib/api/`
- Hooks: `/hooks/`

---

**Document Version:** 1.0.0  
**Last Updated:** December 21, 2024  
**Lines:** 964  
**Status:** ✅ Complete
