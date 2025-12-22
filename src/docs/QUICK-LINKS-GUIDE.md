# ⚡ QUICK LINKS GUIDE
## Local Scout Trip Operating System - Fast Access

**Last Updated:** December 21, 2024  
**Purpose:** Instant access to all features  

---

## 🌐 PUBLIC WEBSITE

### **Marketing Pages**
| Link | Description |
|------|-------------|
| [`/`](/) | **Home** - Landing page |
| [`/pricing`](/pricing) | **Pricing** - Plans & pricing |
| [`/how-it-works`](/how-it-works) | **How It Works** - Product overview |
| [`/how-it-works-v2`](/how-it-works-v2) | **Detailed Guide** - Full walkthrough |
| [`/use-cases`](/use-cases) | **Use Cases** - All scenarios |
| [`/use-cases/digital-nomad`](/use-cases/digital-nomad) | Digital Nomad use case |
| [`/use-cases/luxury-traveler`](/use-cases/luxury-traveler) | Luxury Traveler use case |
| [`/use-cases/group-trip`](/use-cases/group-trip) | Group Trip use case |

---

## 📱 APP FEATURES

### **Core App Pages**
| Link | Description |
|------|-------------|
| [`/dashboard`](/dashboard) | **Dashboard** - Main hub |
| [`/app/trips`](/app/trips) | **Trips** - All your trips |
| [`/explore`](/explore) | **Explore** - Discover places |
| [`/map`](/map) | **Map Explorer** - Interactive map |
| [`/saved`](/saved) | **Saved Places** - Your collections |
| [`/chats`](/chats) | **Chats** - AI conversations |
| [`/concierge`](/concierge) | **AI Concierge** - Chat interface |
| [`/app/concierge`](/app/concierge) | **App Concierge** - App version |

### **Trip Management**
| Link | Description |
|------|-------------|
| [`/itinerary/new`](/itinerary/new) | **Create Trip** - New itinerary wizard |
| [`/trip/:id`](/trip/:id) | **Trip Detail** - View/edit trip |
| [`/app/trip/:id`](/app/trip/:id) | **App Trip Detail** - App version |

---

## 🧙 WIZARDS & DISCOVERY

### **Category Wizards**
| Link | Description |
|------|-------------|
| [`/wizard/dining`](/wizard/dining) | **Dining Wizard** - Find restaurants |
| [`/wizard/experiences`](/wizard/experiences) | **Experiences** - Find activities |
| [`/wizard/events`](/wizard/events) | **Events** - Find events |
| [`/wizard/stays`](/wizard/stays) | **Stays** - Find accommodation |
| [`/wizard/activities`](/wizard/activities) | **Activities** - Find things to do |

### **Experiences**
| Link | Description |
|------|-------------|
| [`/experiences/medellin`](/experiences/medellin) | **Medellín Experiences** - City guide |
| [`/experiences/:id`](/experiences/:id) | **Experience Detail** - Single experience |
| [`/restaurants/:id`](/restaurants/:id) | **Restaurant Detail** - Single restaurant |

---

## 🏠 REAL ESTATE

### **Property Features**
| Link | Description |
|------|-------------|
| [`/real-estate`](/real-estate) | **RE Home** - Real estate landing |
| [`/real-estate/search`](/real-estate/search) | **Property Search** - Find properties |
| [`/real-estate/listing/:id`](/real-estate/listing/:id) | **Property Detail** - View listing |
| [`/real-estate/market-data`](/real-estate/market-data) | **Market Insights** - Analytics |

---

## 🤖 AI FEATURES

### **AI Agents** (Backend Services)
All agents work through the AI Concierge interface:

1. **Itinerary Optimizer** - Route optimization & timing
2. **Local Scout** - Hidden gems & local tips
3. **Dining Orchestrator** - Restaurant recommendations
4. **Budget Guardian** - Cost tracking & alerts
5. **Booking Assistant** - Reservation management
6. **Event Curator** - Events & activities

**Access via:**
- [`/concierge`](/concierge) - Main AI interface
- [`/app/concierge`](/app/concierge) - App AI interface
- Floating chat button (all pages)

---

## 🛠️ DEVELOPER/ADMIN

### **System Pages**
| Link | Description |
|------|-------------|
| [`/ai-demo`](/ai-demo) | **AI Demo** - Advanced AI showcase |
| [`/features`](/features) | **Feature Gallery** - All features demo |
| [`/status`](/status) | **Production Status** - System health |
| [`/architecture`](/architecture) | **Architecture** - System docs (internal) |
| [`/style-guide`](/style-guide) | **Style Guide** - Design system |
| [`/app/whats-new`](/app/whats-new) | **What's New** - Product updates |

---

## 🔗 API ENDPOINTS

### **Base URL**
```
https://{project-id}.supabase.co/functions/v1/make-server-fd8c4bf7
```

### **Trip Endpoints**
```
GET    /trips              List all trips
GET    /trips/:id          Get single trip
POST   /trips              Create trip
PUT    /trips/:id          Update trip
DELETE /trips/:id          Delete trip

GET    /trips/:id/items         List trip items
POST   /trips/:id/items         Add item to trip
PUT    /trips/:id/items/:itemId Update trip item
DELETE /trips/:id/items/:itemId Delete trip item
```

### **AI Endpoints**
```
POST   /ai/chat            Chat with AI
POST   /ai/optimize        Optimize itinerary
POST   /ai/suggest         Get suggestions
```

### **User Endpoints**
```
GET    /saved-places       List saved places
POST   /saved-places       Save place
DELETE /saved-places/:id   Remove saved place

GET    /preferences        Get user preferences
PUT    /preferences        Update preferences
```

---

## 📊 WORKFLOWS

### **Quick Actions**

**Create a Trip:**
```
1. Click "Create Trip" → /itinerary/new
2. Enter destination & dates
3. Set preferences
4. AI generates itinerary
5. Review & customize
6. Save to dashboard
```

**Find a Restaurant:**
```
1. Go to /wizard/dining
2. Select preferences
3. AI recommends options
4. View on map/list
5. Save or add to trip
```

**Ask AI Concierge:**
```
1. Click chat button (or /concierge)
2. Type question
3. Get instant answers
4. Follow-up questions
5. Save results
```

**Explore a City:**
```
1. Go to /explore
2. Apply filters
3. Browse map/list
4. Click for details
5. Save favorites
```

---

## 🎨 COMPONENT QUICK REFERENCE

### **Key Components**

**Layouts:**
- `AppShell` - Main layout wrapper
- `MainLayout` - Standard page layout
- `WizardLayout` - Wizard wrapper

**AI:**
- `AIConcierge` - Full AI chat interface
- `ConciergeFab` - Floating chat button
- `ChatInterface` - Generic chat component

**Trip:**
- `TripDetailsPage` - Trip detail view
- `ItineraryFeed` - Day-by-day itinerary
- `DaySection` - Single day section
- `ItineraryItemCard` - Activity card

**Discovery:**
- `ExplorePage` - Explore dashboard
- `PlaceCard` - Place preview card
- `ExperienceCard` - Experience card
- `PlaceDetailDrawer` - Detail drawer

**Booking:**
- `BookingSheet` - Booking flow
- `BookingCard` - Booking widget
- `DetailBookingCard` - Detail page booking

---

## 📱 MOBILE ACCESS

### **Bottom Navigation Items**
```
Home     → /dashboard
Explore  → /explore
Trips    → /app/trips
Saved    → /saved
Profile  → /profile
```

### **Mobile-Optimized Pages**
- All pages are responsive
- Bottom nav on mobile (<768px)
- Drawer/sheet components for modals
- Touch-friendly buttons (44px+)

---

## 🔐 AUTHENTICATION (Planned)

### **Auth Routes** (To Be Implemented)
```
/auth/signin         Sign in
/auth/signup         Sign up
/auth/reset          Password reset
/auth/verify         Email verification
```

**Current Status:** Demo mode (no auth required)

---

## 🚀 COMMON TASKS

### **For Users:**

**I want to...**

- **Plan a trip** → [`/itinerary/new`](/itinerary/new)
- **Find restaurants** → [`/wizard/dining`](/wizard/dining)
- **Explore a city** → [`/explore`](/explore)
- **Chat with AI** → [`/concierge`](/concierge)
- **View my trips** → [`/app/trips`](/app/trips)
- **See saved places** → [`/saved`](/saved)
- **Find events** → [`/wizard/events`](/wizard/events)
- **Search properties** → [`/real-estate/search`](/real-estate/search)

### **For Developers:**

**I want to...**

- **See AI demo** → [`/ai-demo`](/ai-demo)
- **View all features** → [`/features`](/features)
- **Check system status** → [`/status`](/status)
- **Read architecture** → [`/architecture`](/architecture)
- **View design system** → [`/style-guide`](/style-guide)

---

## 📂 FILE LOCATIONS

### **Key Directories:**
```
/components/ai/           AI & chat components
/components/trip-details/ Trip management
/components/wizard/       Wizard components
/components/experiences/  Experience components
/components/booking/      Booking flows

/pages/                   All route pages
/pages/app/               App-specific pages
/pages/use-cases/         Use case pages
/pages/real-estate/       Real estate pages

/lib/ai/agents/           6 AI agents
/lib/api/                 API client
/lib/services/            System services

/supabase/functions/server/ Edge functions
```

---

## 🎯 DIRECT LINKS (Development)

### **Local Development:**
```
http://localhost:5173/
http://localhost:5173/dashboard
http://localhost:5173/concierge
http://localhost:5173/itinerary/new
http://localhost:5173/explore
```

### **Production (Example):**
```
https://localscout.app/
https://localscout.app/dashboard
https://localscout.app/concierge
https://localscout.app/pricing
```

---

## 📖 DOCUMENTATION LINKS

### **Main Documentation:**
- [Complete Feature Sitemap](COMPLETE-FEATURE-SITEMAP.md)
- [Production Wiring System](PRODUCTION-WIRING-SYSTEM.md)
- [Progress Dashboard](roadmap/00-PROGRESS-DASHBOARD.md)
- [Production Checklist](roadmap/03-production-wiring-checklist.md)
- [Wiring Verification](roadmap/04-production-wiring-verification.md)

### **Architecture:**
- [System Architecture](architecture/01-system-architecture.md)
- [AI Agent Orchestration](architecture/05-ai-agent-orchestration.md)
- [User Journeys](architecture/04-user-journeys.md)

### **Features:**
- [Implementation Status](features/00-IMPLEMENTATION-STATUS.md)
- [AI Features](ai-features/chatai.md)

---

## 🔍 SEARCH INDEX

**Keywords:** trip planning, AI concierge, itinerary, travel, experiences, real estate, dining, events, activities, booking, wizard, dashboard, map, explore, saved places, chat, agents

---

## ⚡ KEYBOARD SHORTCUTS (Planned)

```
Ctrl/Cmd + K     → Open search
Ctrl/Cmd + /     → Open AI concierge
Ctrl/Cmd + N     → New trip
Ctrl/Cmd + S     → Save changes
Esc              → Close modal/drawer
```

---

**Document Version:** 1.0  
**Last Updated:** December 21, 2024  
**Status:** ✅ READY FOR USE

**Quick Access:** Bookmark this page for instant navigation!
