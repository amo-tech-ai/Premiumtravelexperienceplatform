# 🗺️ LOCAL SCOUT TRIP OPERATING SYSTEM
## Complete Feature Sitemap & Link Directory

**Last Updated:** December 21, 2024  
**Version:** 1.0  
**Status:** Production-Ready System Map

---

## 📖 TABLE OF CONTENTS

1. [Website Pages](#-website-pages)
2. [Application Dashboards](#-application-dashboards)
3. [AI Agents](#-ai-agents)
4. [Wizards & Flows](#-wizards--flows)
5. [Chatbots & Interfaces](#-chatbots--interfaces)
6. [Trip Management](#-trip-management)
7. [Discovery & Exploration](#-discovery--exploration)
8. [Real Estate Features](#-real-estate-features)
9. [User Features](#-user-features)
10. [System Features](#-system-features)
11. [Components Library](#-components-library)
12. [API Endpoints](#-api-endpoints)

---

## 🌐 WEBSITE PAGES

### **Public Marketing Pages**

| Page | Route | Component | Purpose | Status |
|------|-------|-----------|---------|--------|
| **Home** | `/` | `Home.tsx` | Landing page, hero, CTA | ✅ Live |
| **Pricing** | `/pricing` | `Pricing.tsx` | Plans, comparison, FAQ | ✅ Live |
| **How It Works** | `/how-it-works` | `HowItWorks.tsx` | Product walkthrough | ✅ Live |
| **How It Works V2** | `/how-it-works-v2` | `HowItWorksV2.tsx` | Detailed guide | ✅ Live |
| **What's New** | `/app/whats-new` | `WhatsNew.tsx` | Product updates | ✅ Live |
| **Style Guide** | `/style-guide` | `StyleGuide.tsx` | Design system | ✅ Live |
| **Architecture** | `/architecture` | `Architecture.tsx` | System docs (internal) | ✅ Live |
| **Status** | `/status` | `ProductionStatus.tsx` | System health | ✅ Live |
| **404 Not Found** | `*` | `NotFound.tsx` | Error page | ✅ Live |

**Links:**
```
Production:
https://yourapp.com/
https://yourapp.com/pricing
https://yourapp.com/how-it-works
https://yourapp.com/how-it-works-v2
https://yourapp.com/app/whats-new
```

---

### **Use Cases Pages**

| Page | Route | Component | Purpose | Status |
|------|-------|-----------|---------|--------|
| **Use Cases Index** | `/use-cases` | `UseCasesIndex.tsx` | All use cases | ✅ Live |
| **Digital Nomad** | `/use-cases/digital-nomad` | `DigitalNomadPage.tsx` | Remote workers | ✅ Live |
| **Luxury Traveler** | `/use-cases/luxury-traveler` | `LuxuryTravelerPage.tsx` | Premium travel | ✅ Live |
| **Group Trip** | `/use-cases/group-trip` | `GroupTripPage.tsx` | Group planning | ✅ Live |

**Links:**
```
https://yourapp.com/use-cases
https://yourapp.com/use-cases/digital-nomad
https://yourapp.com/use-cases/luxury-traveler
https://yourapp.com/use-cases/group-trip
```

**Features:**
- Before/After comparison
- Problem statement
- Solution showcase
- Example itineraries
- Testimonials
- Pricing teaser
- AI agents showcase

---

## 📊 APPLICATION DASHBOARDS

### **Core Dashboards**

| Dashboard | Route | Component | Purpose | Status |
|-----------|-------|-----------|---------|--------|
| **Main Dashboard** | `/dashboard` | `Dashboard.tsx` | Trip overview | ✅ Live |
| **Trip Discovery** | `/explore` | `TripDiscoveryDashboard.tsx` | AI-powered discovery | ✅ Live |
| **Trips Manager** | `/app/trips` | `TripsPage.tsx` | All trips list | ✅ Live |
| **Explore Page** | `/explore` | `ExplorePage.tsx` | Places & activities | ✅ Live |
| **Saved Places** | `/saved` | `SavedPlacesPage.tsx` | Collections | ✅ Live |
| **Chats** | `/chats` | `ChatsPage.tsx` | AI conversations | ✅ Live |
| **Feature Gallery** | `/features` | `FeatureGallery.tsx` | All features demo | ✅ Live |

**Links:**
```
App:
https://yourapp.com/dashboard
https://yourapp.com/app/trips
https://yourapp.com/explore
https://yourapp.com/saved
https://yourapp.com/chats
https://yourapp.com/features
```

---

### **Dashboard Components**

**Main Dashboard Features:**
- Trip cards grid
- Quick actions menu
- AI suggestions panel
- Recent activity feed
- Statistics widgets
- Create trip button

**Trip Discovery Dashboard:**
```typescript
Components:
- ConciergePromptBar
- SmartMapView
- StayRecommendationList
- ExperienceCardList
- EventCardList
- TripSummarySheet
```

**Explore Dashboard:**
```typescript
Features:
- Interactive map
- Filters (category, price, rating)
- Place cards
- Detail drawer
- Save to collection
- Add to trip
```

---

## 🤖 AI AGENTS

### **The Six Specialized Agents**

| Agent | File | Purpose | Status | API |
|-------|------|---------|--------|-----|
| **1. Itinerary Optimizer** | `itinerary-optimizer.ts` | Route optimization, timing | ✅ Active | `optimizeItinerary()` |
| **2. Local Scout** | `local-scout.ts` | Hidden gems, local tips | ✅ Active | `findLocalGems()` |
| **3. Dining Orchestrator** | `dining-orchestrator.ts` | Restaurant recommendations | ✅ Active | `recommendDining()` |
| **4. Budget Guardian** | `budget-guardian.ts` | Cost tracking, alerts | ✅ Active | `trackBudget()` |
| **5. Booking Assistant** | `booking-assistant.ts` | Reservation management | ✅ Active | `assistBooking()` |
| **6. Event Curator** | `event-curator.ts` | Events & activities | ✅ Active | `curateEvents()` |

**Agent Locations:**
```
/lib/ai/agents/
├── base-agent.ts           ← Base class
├── itinerary-optimizer.ts  ← Agent #1
├── local-scout.ts          ← Agent #2
├── dining-orchestrator.ts  ← Agent #3
├── budget-guardian.ts      ← Agent #4
├── booking-assistant.ts    ← Agent #5
├── event-curator.ts        ← Agent #6
└── index.ts                ← Exports
```

---

### **Agent Capabilities**

#### **1. Itinerary Optimizer Agent**
```typescript
Capabilities:
✓ Route optimization
✓ Time allocation
✓ Travel time calculation
✓ Pacing recommendations
✓ Conflict detection
✓ Smart reordering

Actions:
- analyzeItinerary()
- optimizeRouting()
- suggestAlternatives()
- detectConflicts()
```

#### **2. Local Scout Agent**
```typescript
Capabilities:
✓ Hidden gems discovery
✓ Local insider tips
✓ Neighborhood insights
✓ Cultural recommendations
✓ Safety information
✓ Seasonal suggestions

Actions:
- findHiddenGems()
- getLocalTips()
- analyzeNeighborhood()
- checkSafety()
```

#### **3. Dining Orchestrator Agent**
```typescript
Capabilities:
✓ Restaurant matching
✓ Cuisine preferences
✓ Dietary restrictions
✓ Reservation timing
✓ Price range filtering
✓ Special occasions

Actions:
- recommendRestaurants()
- checkAvailability()
- suggestDiningTimes()
- findAlternatives()
```

#### **4. Budget Guardian Agent**
```typescript
Capabilities:
✓ Cost tracking
✓ Budget allocation
✓ Overspend alerts
✓ Savings suggestions
✓ Currency conversion
✓ Price comparisons

Actions:
- trackExpenses()
- allocateBudget()
- alertOverspend()
- suggestSavings()
```

#### **5. Booking Assistant Agent**
```typescript
Capabilities:
✓ Availability checking
✓ Reservation management
✓ Confirmation tracking
✓ Cancellation handling
✓ Modification support
✓ Multi-provider search

Actions:
- checkAvailability()
- createBooking()
- manageReservations()
- handleCancellations()
```

#### **6. Event Curator Agent**
```typescript
Capabilities:
✓ Event discovery
✓ Festival tracking
✓ Cultural events
✓ Ticket availability
✓ Schedule integration
✓ Personalized suggestions

Actions:
- findEvents()
- curateExperiences()
- checkTickets()
- syncSchedule()
```

---

### **AI Orchestration System**

| Component | File | Purpose | Status |
|-----------|------|---------|--------|
| **Orchestrator** | `orchestrator.ts` | Agent coordination | ✅ Active |
| **Event Bus** | `event-bus.ts` | Agent communication | ✅ Active |
| **Context Manager** | `context-manager.ts` | State management | ✅ Active |
| **Collaboration Engine** | `collaboration-engine.ts` | Multi-agent tasks | ✅ Active |
| **Proactive Assistant** | `proactive-assistant.ts` | Predictive suggestions | ✅ Active |

**Architecture:**
```
User Request
     ↓
Orchestrator (decides which agents)
     ↓
Event Bus (coordinates communication)
     ↓
Multiple Agents (work in parallel)
     ↓
Collaboration Engine (merges results)
     ↓
Context Manager (updates state)
     ↓
Proactive Assistant (learns & suggests)
     ↓
User Response
```

---

## 🧙 WIZARDS & FLOWS

### **Interactive Wizards**

| Wizard | Route | Component | Purpose | Steps | Status |
|--------|-------|-----------|---------|-------|--------|
| **Itinerary Wizard** | `/itinerary/new` | `ItineraryWizard.tsx` | Trip creation | 4 | ✅ Live |
| **Wizard Flow** | `/wizard/:category` | `WizardFlow.tsx` | Category exploration | 3-5 | ✅ Live |
| **Filter Wizard** | N/A | `FilterWizard.tsx` | Preference filtering | 3 | ✅ Live |
| **Booking Sheet** | N/A | `BookingSheet.tsx` | Reservation flow | 2 | ✅ Live |

**Links:**
```
https://yourapp.com/itinerary/new
https://yourapp.com/wizard/dining
https://yourapp.com/wizard/experiences
https://yourapp.com/wizard/events
```

---

### **Itinerary Wizard Flow**

**Steps:**
```
Step 1: Destination & Dates
├─ Where are you going?
├─ When? (dates)
├─ How long? (duration)
└─ Travel style

Step 2: Preferences
├─ Interests (culture, food, nightlife)
├─ Budget range
├─ Pace (relaxed/moderate/packed)
└─ Group type (solo, couple, family)

Step 3: AI Generation
├─ Analyzing preferences
├─ Finding best spots
├─ Optimizing routes
└─ Creating itinerary

Step 4: Review & Customize
├─ View generated plan
├─ Drag & drop to edit
├─ Add/remove items
└─ Save to dashboard
```

**Component Tree:**
```typescript
<ItineraryWizard>
  <WizardLayout>
    <Step1_Destination />
    <Step2_Preferences />
    <Step3_AIGeneration />
    <Step4_Review />
  </WizardLayout>
</ItineraryWizard>
```

---

### **Category Wizard Flow**

**Categories:**
- 🍽️ Dining (`/wizard/dining`)
- 🎭 Experiences (`/wizard/experiences`)
- 🎉 Events (`/wizard/events`)
- 🏨 Stays (`/wizard/stays`)
- 🏃 Activities (`/wizard/activities`)

**Flow:**
```
Step 1: Mode Selection
├─ Quick Find
├─ Guided Discovery
└─ AI Recommendations

Step 2: Filters
├─ Price range
├─ Location
├─ Category
├─ Ratings
└─ Availability

Step 3: Results
├─ Map view
├─ List view
├─ Card view
└─ Detail drawer

Step 4: Actions
├─ Save to collection
├─ Add to trip
├─ Book now
└─ Share
```

---

## 💬 CHATBOTS & INTERFACES

### **AI Chat Interfaces**

| Interface | Component | Purpose | Features | Status |
|-----------|-----------|---------|----------|--------|
| **AI Concierge** | `AIConcierge.tsx` | Main chat interface | Full-screen chat | ✅ Live |
| **AI Chat Interface** | `AIChatInterface.tsx` | Embedded chat | Inline conversations | ✅ Live |
| **Streaming Chat** | `StreamingChatInterface.tsx` | Real-time responses | Streaming API | ✅ Live |
| **Concierge FAB** | `ConciergeFab.tsx` | Floating action button | Quick access | ✅ Live |
| **Concierge Overlay** | `ConciergeOverlay.tsx` | Modal chat | Overlay mode | ✅ Live |
| **Chat Interface** | `ChatInterface.tsx` | Generic chat | Reusable component | ✅ Live |

**Access Points:**
```
Routes:
- /concierge          → Full-page concierge
- /app/concierge      → App concierge
- /chats              → Chat history

Components:
- Floating button (all pages)
- Sidebar panel
- Modal overlay
- Inline chat boxes
```

---

### **Concierge Features**

**Capabilities:**
```typescript
✓ Natural language queries
✓ Multi-turn conversations
✓ Context awareness
✓ Streaming responses
✓ Follow-up suggestions
✓ Image understanding
✓ Voice input (planned)
✓ Multi-language (planned)

Interactions:
- "Find me restaurants in El Poblado"
- "Optimize my Thursday itinerary"
- "What events are happening this weekend?"
- "Book a table at Carmen for 2"
- "Show me hidden gems near my hotel"
```

**UI Components:**
```typescript
<AIConcierge>
  <ModeSelection />        ← Quick/Guided/AI
  <ChatBubble />           ← User/AI messages
  <ThinkingDots />         ← Loading state
  <FollowUpQuestion />     ← Suggestions
  <ResultsList />          ← Search results
  <ResultsMap />           ← Map view
  <ResultsTabs />          ← Organized results
  <ResultsDrawer />        ← Detail view
</AIConcierge>
```

---

### **Chat Page**

**Features:**
- Conversation history
- Pinned chats
- Search conversations
- Delete conversations
- Export chat logs
- Share conversations

**Component:**
```typescript
<ChatsPage>
  <ChatsList>
    <ChatPreview />
    <ChatPreview />
    ...
  </ChatsList>
  
  <ChatDetail>
    <MessageList />
    <InputBar />
  </ChatDetail>
</ChatsPage>
```

---

## 🗓️ TRIP MANAGEMENT

### **Trip Pages**

| Page | Route | Component | Purpose | Status |
|------|-------|-----------|---------|--------|
| **Trips List** | `/app/trips` | `TripsPage.tsx` | All trips | ✅ Live |
| **Trip Detail** | `/trip/:id` | `TripDetailsPage.tsx` | Single trip | ✅ Live |
| **Trip Detail (App)** | `/app/trip/:id` | `TripDetailPage.tsx` | App version | ✅ Live |
| **Create Trip** | Modal | `CreateTripModal.tsx` | New trip | ✅ Live |

**Links:**
```
https://yourapp.com/app/trips
https://yourapp.com/trip/abc123
https://yourapp.com/app/trip/abc123
```

---

### **Trip Detail Features**

**Layout:**
```
┌─────────────────────────────────────────┐
│ Trip Header                             │
│ - Title, dates, destination             │
│ - Quick stats (days, items, budget)     │
│ - Edit, share, export buttons           │
├─────────────────┬───────────────────────┤
│                 │                       │
│  Itinerary      │  Map                  │
│  Feed           │  (interactive)        │
│  (scrollable)   │                       │
│                 │                       │
│  - Day sections │  - Markers            │
│  - Activity     │  - Routes             │
│    cards        │  - Clusters           │
│  - Drag & drop  │                       │
│                 │                       │
├─────────────────┴───────────────────────┤
│ AI Actions Panel                        │
│ - Optimize itinerary                    │
│ - Find alternatives                     │
│ - Budget check                          │
│ - Get suggestions                       │
└─────────────────────────────────────────┘
```

**Components:**
```typescript
Trip Detail Page:
├── TripHeader
├── TripSidebar
│   ├── TripStatistics
│   ├── AIActionsPanel
│   └── ExportShareMenu
├── ItineraryFeed (or LuxuryItineraryFeed)
│   ├── DaySection[]
│   │   ├── ItineraryItemCard[]
│   │   └── AddPlaceModal
│   └── IdeasSection
└── TripMap
    ├── Markers
    ├── Routes
    └── Clusters
```

---

### **Itinerary Components**

| Component | Purpose | Features | Status |
|-----------|---------|----------|--------|
| **ItineraryFeed** | Day-by-day view | Standard layout | ✅ Live |
| **LuxuryItineraryFeed** | Premium view | Luxury design | ✅ Live |
| **DaySection** | Single day | Collapsible sections | ✅ Live |
| **ItineraryItemCard** | Activity card | Drag, edit, delete | ✅ Live |
| **ItineraryDayHeader** | Day header | Date, summary | ✅ Live |
| **ItineraryItem** | Item row | Time, title, actions | ✅ Live |

**Features:**
```typescript
Itinerary Capabilities:
✓ Drag & drop reordering
✓ Multi-day organization
✓ Time-based scheduling
✓ Budget tracking per item
✓ Location mapping
✓ Notes & descriptions
✓ Photo attachments
✓ Booking links
✓ Sharing
✓ Export (PDF, iCal)
```

---

### **Trip Modals**

| Modal | Component | Purpose | Actions | Status |
|-------|-----------|---------|---------|--------|
| **Create Trip** | `CreateTripModal.tsx` | New trip | Create | ✅ Live |
| **Trip Create** | `TripCreateModal.tsx` | Alternative | Create | ✅ Live |
| **Add Activity** | `AddActivityModal.tsx` | New activity | Add | ✅ Live |
| **Edit Activity** | `EditActivityModal.tsx` | Edit item | Update | ✅ Live |
| **Edit Item** | `EditItemModal.tsx` | Edit details | Update | ✅ Live |
| **Delete Activity** | `DeleteActivityDialog.tsx` | Remove item | Delete | ✅ Live |
| **Move to Day** | `MoveToDayModal.tsx` | Change day | Move | ✅ Live |
| **Add Place** | `AddPlaceModal.tsx` | Add location | Add | ✅ Live |

**Workflow:**
```
Create Trip
   ↓
Add Activities (manual or AI)
   ↓
Edit/Reorder/Delete
   ↓
Share/Export
```

---

## 🔍 DISCOVERY & EXPLORATION

### **Discovery Pages**

| Page | Route | Component | Purpose | Status |
|------|-------|-----------|---------|--------|
| **Explore** | `/explore` | `ExplorePage.tsx` | General discovery | ✅ Live |
| **Explorer** | `/map` | `Explorer.tsx` | Map explorer | ✅ Live |
| **Experiences (Medellín)** | `/experiences/medellin` | `MedellinExperiences.tsx` | City experiences | ✅ Live |
| **Experience Detail** | `/experiences/:id` | `ExperienceDetail.tsx` | Single experience | ✅ Live |
| **Restaurant Detail** | `/restaurants/:id` | `RestaurantDetail.tsx` | Single restaurant | ✅ Live |
| **Event Detail** | `/experiences/:id` | `EventDetail.tsx` | Single event | ✅ Live |

**Links:**
```
https://yourapp.com/explore
https://yourapp.com/map
https://yourapp.com/experiences/medellin
https://yourapp.com/experiences/la-deriva
https://yourapp.com/restaurants/carmen
```

---

### **Explore Features**

**Components:**
```typescript
<ExplorePage>
  <ExploreFilters />
  <ExploreMap />
  <PlaceCard[] />
  <PlaceDetailDrawer />
</ExplorePage>
```

**Filters:**
- Category (dining, events, activities, stays)
- Price range ($-$$$$)
- Distance radius
- Rating (1-5 stars)
- Open now
- Features (WiFi, outdoor, etc.)

**Views:**
- Map view
- List view
- Grid view
- Detail drawer

---

### **Experience Pages**

**Experience Detail Layout:**
```
┌─────────────────────────────────────────┐
│ Hero Image Gallery                      │
│ - Swipeable photos                      │
│ - Professional photography              │
├─────────────────────────────────────────┤
│ Experience Header                       │
│ - Title, rating, price                  │
│ - Location, category                    │
├─────────────────────────────────────────┤
│ Quick Facts                             │
│ - Duration, group size, difficulty      │
├─────────────────────────────────────────┤
│ Description                             │
│ - Full details                          │
│ - What's included                       │
│ - What to bring                         │
├─────────────────────────────────────────┤
│ Visual Story                            │
│ - Photo journey                         │
├─────────────────────────────────────────┤
│ Amenities                               │
│ - Features list                         │
├─────────────────────────────────────────┤
│ Trust Indicators                        │
│ - Reviews, verified badge               │
├─────────────────────────────────────────┤
│ Booking Card (sticky)                   │
│ - Select date/time                      │
│ - Number of guests                      │
│ - Book now CTA                          │
└─────────────────────────────────────────┘
```

**Components:**
```typescript
Experience Detail:
├── ExperienceHero
├── DetailHero
├── QuickFacts
├── VisualStory
├── Amenities
├── TrustIndicators
├── BookingCard
└── DetailBookingCard
```

---

## 🏠 REAL ESTATE FEATURES

### **Real Estate Pages**

| Page | Route | Component | Purpose | Status |
|------|-------|-----------|---------|--------|
| **RE Home** | `/real-estate` | `RealEstateHome.tsx` | Landing page | ✅ Live |
| **Property Search** | `/real-estate/search` | `PropertySearch.tsx` | Search listings | ✅ Live |
| **Property Detail** | `/real-estate/listing/:id` | `PropertyDetail.tsx` | Single property | ✅ Live |
| **Market Insights** | `/real-estate/market-data` | `MarketInsights.tsx` | Analytics | ✅ Live |

**Links:**
```
https://yourapp.com/real-estate
https://yourapp.com/real-estate/search
https://yourapp.com/real-estate/listing/prop123
https://yourapp.com/real-estate/market-data
```

---

### **Real Estate Components**

| Component | Purpose | Features | Status |
|-----------|---------|----------|--------|
| **RealEstateHero** | Landing hero | Search, filters | ✅ Live |
| **PropertyCard** | Listing card | Image, price, specs | ✅ Live |
| **NeighborhoodSlider** | Area explorer | Swipeable cards | ✅ Live |
| **MarketInsights** | Data dashboard | Charts, trends | ✅ Live |

**Features:**
```typescript
Real Estate System:
✓ Property listings (buy/rent)
✓ Neighborhood guides
✓ Market analytics
✓ Virtual tours
✓ Contact agents
✓ Save favorites
✓ Price alerts
✓ Investment analysis
✓ Schools & amenities
✓ Walkability scores
```

---

## 👤 USER FEATURES

### **User Pages**

| Feature | Route | Component | Purpose | Status |
|---------|-------|-----------|---------|--------|
| **Profile** | `/profile` | `Dashboard.tsx` | User settings | ✅ Live |
| **Saved Places** | `/saved` | `SavedPlacesPage.tsx` | Collections | ✅ Live |
| **Collections** | `/collections` | `SavedPlacesPage.tsx` | Alias | ✅ Live |

---

### **Saved Places**

**Features:**
```typescript
Collections:
✓ Create custom collections
✓ Save places (restaurants, events, etc.)
✓ Organize by category
✓ Add notes to places
✓ Share collections
✓ Export to trip
✓ Map view
✓ List view
```

**Component:**
```typescript
<SavedPlacesPage>
  <CollectionsList>
    <CollectionCard />
  </CollectionsList>
  
  <PlacesList>
    <PlaceCard />
  </PlacesList>
  
  <Actions>
    <CreateCollection />
    <ShareCollection />
    <ExportToTrip />
  </Actions>
</SavedPlacesPage>
```

---

## ⚙️ SYSTEM FEATURES

### **Developer/Admin Pages**

| Page | Route | Component | Purpose | Status |
|------|-------|-----------|---------|--------|
| **AI Demo** | `/ai-demo` | `AdvancedAIDemo.tsx` | AI showcase | ✅ Live |
| **Feature Gallery** | `/features` | `FeatureGallery.tsx` | All features | ✅ Live |
| **Production Status** | `/status` | `ProductionStatus.tsx` | Health check | ✅ Live |
| **Architecture** | `/architecture` | `Architecture.tsx` | System docs | ✅ Live |
| **Style Guide** | `/style-guide` | `StyleGuide.tsx` | Design tokens | ✅ Live |

---

### **PWA Features**

| Feature | Component | Purpose | Status |
|---------|-----------|---------|--------|
| **Install Prompt** | `InstallPrompt.tsx` | PWA installation | ✅ Live |
| **Service Worker** | `service-worker.js` | Offline support | ✅ Live |
| **Manifest** | `manifest.json` | PWA config | ✅ Live |

**PWA Capabilities:**
```typescript
✓ Install to home screen
✓ Offline mode
✓ Push notifications (planned)
✓ Background sync (planned)
✓ App-like experience
✓ Fast loading
```

---

### **System Services**

| Service | File | Purpose | Status |
|---------|------|---------|--------|
| **Analytics** | `analytics.ts` | Event tracking | ✅ Active |
| **Notifications** | `notifications.ts` | Push/toast | ✅ Active |
| **Geocoding** | `geocoding.ts` | Address lookup | ✅ Active |
| **Export** | `export.ts` | PDF/iCal export | ✅ Active |
| **Collaboration** | `collaboration.ts` | Sharing | ✅ Active |
| **PWA** | `pwa.ts` | PWA registration | ✅ Active |

---

## 📦 COMPONENTS LIBRARY

### **Layout Components**

| Component | Purpose | Features | Status |
|-----------|---------|----------|--------|
| **AppShell** | Main layout | Nav, footer, routing | ✅ Live |
| **MainLayout** | Page wrapper | Standard layout | ✅ Live |
| **WizardLayout** | Wizard wrapper | Step navigation | ✅ Live |
| **Navbar** | Top navigation | Logo, menu, auth | ✅ Live |
| **TopNav** | Alternative nav | Compact header | ✅ Live |
| **BottomNav** | Mobile nav | Fixed bottom bar | ✅ Live |
| **Sidebar** | Side panel | Collapsible menu | ✅ Live |
| **Footer** | Page footer | Links, subscribe | ✅ Live |

---

### **UI Components (shadcn/ui)**

**Available Components:**
```
✓ Accordion        ✓ Alert Dialog    ✓ Alert
✓ Aspect Ratio     ✓ Avatar          ✓ Badge
✓ Breadcrumb       ✓ Button          ✓ Calendar
✓ Card             ✓ Carousel        ✓ Chart
✓ Checkbox         ✓ Collapsible     ✓ Command
✓ Context Menu     ✓ Dialog          ✓ Drawer
✓ Dropdown Menu    ✓ Form            ✓ Hover Card
✓ Input OTP        ✓ Input           ✓ Label
✓ Menubar          ✓ Navigation      ✓ Pagination
✓ Popover          ✓ Progress        ✓ Radio Group
✓ Resizable        ✓ Scroll Area     ✓ Select
✓ Separator        ✓ Sheet           ✓ Sidebar
✓ Skeleton         ✓ Slider          ✓ Sonner (Toast)
✓ Switch           ✓ Table           ✓ Tabs
✓ Textarea         ✓ Toggle Group    ✓ Toggle
✓ Tooltip
```

**Total:** 50+ reusable components

---

### **Custom Components**

**AI Components:**
```
/components/ai/
├── AIAgentIntegration.tsx
├── AIChatInterface.tsx
├── AIConcierge.tsx
├── AIStatusIndicator.tsx
├── AIWizardBridge.tsx
├── AdvancedAIDemo.tsx
├── AgentStatusPanel.tsx
├── ChatBubble.tsx
├── ChatInterface.tsx
├── ConciergeFab.tsx
├── ConciergeOverlay.tsx
├── FollowUpQuestion.tsx
├── ModeSelection.tsx
├── ResultsDrawer.tsx
├── ResultsList.tsx
├── ResultsMap.tsx
├── ResultsTabs.tsx
├── StreamingChatInterface.tsx
└── ThinkingDots.tsx
```

**Trip Components:**
```
/components/trip-details/
├── AIActionsPanel.tsx
├── AIItineraryBridge.tsx
├── ItineraryFeed.tsx
├── TripDetailsContext.tsx
├── TripMap.tsx
├── TripSidebar.tsx
├── TripStatistics.tsx
└── /luxury/
    ├── AISuggestionsPanel.tsx
    ├── AddPlaceModal.tsx
    ├── DaySection.tsx
    ├── IdeasSection.tsx
    ├── ItineraryItemCard.tsx
    ├── LuxuryItineraryFeed.tsx
    └── TripHeader.tsx
```

**Booking Components:**
```
/components/booking/
├── BookingFlow.tsx
├── BookingSheet.tsx
├── DetailBookingCard.tsx
└── MobileBookingBar.tsx
```

**Experience Components:**
```
/components/experiences/
├── Amenities.tsx
├── BookingCard.tsx
├── CategoryRail.tsx
├── DetailHero.tsx
├── ExperienceCard.tsx
├── ExperienceFilterBar.tsx
├── ExperienceGallery.tsx
├── ExperienceGrid.tsx
├── ExperienceHero.tsx
├── QuickFacts.tsx
├── TrustIndicators.tsx
└── VisualStory.tsx
```

---

## 🔌 API ENDPOINTS

### **Backend Edge Functions**

**Base URL:**
```
https://{project-id}.supabase.co/functions/v1/make-server-fd8c4bf7
```

---

### **Trip Endpoints**

| Method | Endpoint | Purpose | Auth | Status |
|--------|----------|---------|------|--------|
| `GET` | `/trips` | List all trips | ✅ | ✅ Live |
| `GET` | `/trips/:id` | Get single trip | ✅ | ✅ Live |
| `POST` | `/trips` | Create trip | ✅ | ✅ Live |
| `PUT` | `/trips/:id` | Update trip | ✅ | ✅ Live |
| `DELETE` | `/trips/:id` | Delete trip | ✅ | ✅ Live |

**Request/Response:**
```typescript
// GET /trips
Response: {
  success: true,
  data: Trip[]
}

// POST /trips
Request: {
  title: string,
  destination: string,
  startDate: string,
  endDate: string,
  budget?: number
}
Response: {
  success: true,
  data: Trip
}
```

---

### **Trip Items Endpoints**

| Method | Endpoint | Purpose | Auth | Status |
|--------|----------|---------|------|--------|
| `GET` | `/trips/:id/items` | List items | ✅ | ✅ Live |
| `POST` | `/trips/:id/items` | Add item | ✅ | ✅ Live |
| `PUT` | `/trips/:id/items/:itemId` | Update item | ✅ | ✅ Live |
| `DELETE` | `/trips/:id/items/:itemId` | Delete item | ✅ | ✅ Live |

**Request/Response:**
```typescript
// POST /trips/:id/items
Request: {
  title: string,
  day: number,
  startTime?: string,
  endTime?: string,
  type: 'activity' | 'dining' | 'transport' | 'accommodation',
  cost?: number,
  location?: {
    name: string,
    address: string,
    coordinates?: { lat: number, lng: number }
  }
}
Response: {
  success: true,
  data: TripItem
}
```

---

### **AI Endpoints**

| Method | Endpoint | Purpose | Auth | Status |
|--------|----------|---------|------|--------|
| `POST` | `/ai/chat` | Chat with AI | ✅ | ✅ Live |
| `POST` | `/ai/optimize` | Optimize itinerary | ✅ | ✅ Live |
| `POST` | `/ai/suggest` | Get suggestions | ✅ | ✅ Live |

**Request/Response:**
```typescript
// POST /ai/chat
Request: {
  message: string,
  context?: {
    tripId?: string,
    location?: string
  },
  stream?: boolean
}
Response: {
  success: true,
  data: {
    message: string,
    suggestions?: string[]
  }
}
```

---

### **Saved Places Endpoints**

| Method | Endpoint | Purpose | Auth | Status |
|--------|----------|---------|------|--------|
| `GET` | `/saved-places` | List saved | ✅ | ✅ Live |
| `POST` | `/saved-places` | Save place | ✅ | ✅ Live |
| `DELETE` | `/saved-places/:id` | Remove place | ✅ | ✅ Live |

---

### **User Preferences Endpoints**

| Method | Endpoint | Purpose | Auth | Status |
|--------|----------|---------|------|--------|
| `GET` | `/preferences` | Get preferences | ✅ | ✅ Live |
| `PUT` | `/preferences` | Update preferences | ✅ | ✅ Live |

---

## 🎨 DESIGN SYSTEM

### **Design Tokens**

**File:** `/styles/globals.css`

**Colors:**
```css
Primary:   #2563eb (blue)
Secondary: #8b5cf6 (purple)
Accent:    #f59e0b (amber)
Success:   #10b981 (green)
Error:     #ef4444 (red)
Warning:   #f59e0b (amber)
```

**Typography:**
```css
Font Family: Inter (sans-serif)
Headings:    Playfair Display (serif) - luxury mode
Body:        Inter
Mono:        JetBrains Mono
```

**Spacing Scale:**
```css
xs:  4px
sm:  8px
md:  16px
lg:  24px
xl:  32px
2xl: 48px
3xl: 64px
```

**Breakpoints:**
```css
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

---

## 📱 MOBILE RESPONSIVE

### **Mobile-Specific Features**

| Feature | Component | Purpose | Status |
|---------|-----------|---------|--------|
| **Bottom Navigation** | `BottomNav.tsx` | Mobile nav | ✅ Live |
| **Mobile Booking Bar** | `MobileBookingBar.tsx` | Sticky booking | ✅ Live |
| **Drawer** | `drawer.tsx` | Bottom sheet | ✅ Live |
| **Sheet** | `sheet.tsx` | Side panel | ✅ Live |

**Responsive Patterns:**
```
Desktop:  Sidebar + Main + Right Panel
Tablet:   Collapsed Sidebar + Main
Mobile:   Bottom Nav + Full-width Main
```

---

## 🔐 AUTHENTICATION (Planned)

### **Auth Pages** (To Be Implemented)

| Page | Route | Purpose | Status |
|------|-------|---------|--------|
| **Sign In** | `/auth/signin` | Login | 🔴 Planned |
| **Sign Up** | `/auth/signup` | Register | 🔴 Planned |
| **Password Reset** | `/auth/reset` | Forgot password | 🔴 Planned |
| **Email Verify** | `/auth/verify` | Verify email | 🔴 Planned |

**Current Status:** Demo mode (no authentication)

---

## 📊 ANALYTICS & TRACKING

### **Events Tracked**

```typescript
Page Views:
✓ Every route change
✓ Modal opens
✓ Tab switches

User Actions:
✓ Trip created
✓ Activity added
✓ Place saved
✓ Share clicked
✓ Export triggered

AI Interactions:
✓ Chat message sent
✓ Agent activated
✓ Suggestion accepted
✓ Optimization requested

Errors:
✓ API failures
✓ Component errors
✓ User errors
```

---

## 🗂️ FILE STRUCTURE

### **Key Directories**

```
/
├── components/           ← 200+ React components
│   ├── ai/              ← AI & chat components
│   ├── booking/         ← Booking flows
│   ├── experiences/     ← Experience components
│   ├── trip-details/    ← Trip management
│   ├── wizard/          ← Wizard components
│   ├── layout/          ← Layout components
│   └── ui/              ← shadcn/ui components
│
├── pages/               ← 30+ route pages
│   ├── app/             ← App pages
│   ├── use-cases/       ← Use case pages
│   ├── real-estate/     ← RE pages
│   └── saved/           ← Saved places
│
├── lib/                 ← Libraries
│   ├── ai/              ← AI agents & services
│   ├── api/             ← API client
│   ├── services/        ← System services
│   └── utils/           ← Utilities
│
├── hooks/               ← Custom React hooks
├── context/             ← React contexts
├── styles/              ← Global styles
├── supabase/            ← Backend functions
│   └── functions/
│       └── server/      ← Edge functions
└── docs/                ← Documentation
```

---

## 🚀 QUICK ACCESS LINKS

### **Main Navigation**

```
Public Site:
→ Home                    https://yourapp.com/
→ Pricing                 https://yourapp.com/pricing
→ How It Works            https://yourapp.com/how-it-works
→ Use Cases               https://yourapp.com/use-cases

App:
→ Dashboard               https://yourapp.com/dashboard
→ Trips                   https://yourapp.com/app/trips
→ Explore                 https://yourapp.com/explore
→ Concierge               https://yourapp.com/concierge
→ Saved Places            https://yourapp.com/saved

Create:
→ New Trip                https://yourapp.com/itinerary/new
→ Find Dining             https://yourapp.com/wizard/dining
→ Find Experiences        https://yourapp.com/wizard/experiences
→ Find Events             https://yourapp.com/wizard/events

Real Estate:
→ RE Home                 https://yourapp.com/real-estate
→ Property Search         https://yourapp.com/real-estate/search
→ Market Insights         https://yourapp.com/real-estate/market-data

Developer:
→ AI Demo                 https://yourapp.com/ai-demo
→ Features                https://yourapp.com/features
→ Status                  https://yourapp.com/status
→ Architecture            https://yourapp.com/architecture
```

---

## 📈 FEATURE STATISTICS

### **By the Numbers**

```
Pages:              40+
Components:         200+
AI Agents:          6
Wizards:            4
Chatbots:           6 interfaces
API Endpoints:      15+
UI Components:      50+ (shadcn/ui)
Custom Components:  150+
Routes:             45+
```

---

## 🎯 USER WORKFLOWS

### **Primary Workflows**

**1. Plan a Trip**
```
Home → Create Trip → Add Activities → AI Optimize → Save
```

**2. Discover Places**
```
Explore → Filter → View Map/List → Save/Add to Trip
```

**3. AI Concierge**
```
Ask Question → Get Results → Refine → Save/Book
```

**4. Find Dining**
```
Wizard → Preferences → AI Match → View Details → Book
```

**5. Manage Trip**
```
Trips → Select Trip → View Itinerary → Edit → Share
```

---

## 🔄 INTEGRATION POINTS

### **External Services**

| Service | Purpose | Status |
|---------|---------|--------|
| **Supabase** | Backend, DB, Auth | ✅ Active |
| **Gemini AI** | AI conversations | ✅ Active |
| **Google Maps** | Geocoding, maps | ✅ Active |
| **Stripe** | Payments (planned) | 🔴 Not implemented |

---

## 📝 NOTES

### **Implementation Status**

- ✅ **LIVE** - Fully implemented and working
- 🟡 **PARTIAL** - Partially implemented
- 🔴 **PLANNED** - Not yet implemented

### **Authentication Note**

Current system uses **demo mode** for authentication. Real JWT validation needs to be implemented before production launch.

### **Payment Note**

Booking flows are UI-ready but payment integration (Stripe) is not yet implemented.

---

## 🔗 RELATED DOCUMENTATION

- [Production Wiring System](/docs/PRODUCTION-WIRING-SYSTEM.md)
- [Progress Dashboard](/docs/roadmap/00-PROGRESS-DASHBOARD.md)
- [Production Checklist](/docs/roadmap/03-production-wiring-checklist.md)
- [Frontend-Backend Verification](/docs/FRONTEND-BACKEND-WIRING-VERIFICATION.md)
- [Development Roadmap](/docs/DEVELOPMENT-ROADMAP-SUGGESTIONS.md)

---

**Document Version:** 1.0  
**Last Updated:** December 21, 2024  
**Maintained By:** Development Team  
**Next Update:** After major feature additions

**Status:** ✅ COMPLETE & VERIFIED
