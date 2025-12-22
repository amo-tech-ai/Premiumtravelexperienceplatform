# 🛠️ TECH STACK & SYSTEM ARCHITECTURE
## Local Scout - Trip Operating System

**Last Updated:** December 21, 2024  
**Version:** 1.0.0  
**Environment:** Figma Make (React + Supabase)

---

## 📊 STACK OVERVIEW

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                        │
│  React + TypeScript + Tailwind CSS + Radix UI           │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────┴────────────────────────────────────────┐
│                    BACKEND LAYER                         │
│  Supabase Edge Functions (Deno + Hono)                  │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────┴────────────────────────────────────────┐
│                   DATABASE LAYER                         │
│  Supabase (PostgreSQL + KV Store)                       │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────┴────────────────────────────────────────┐
│                    AI LAYER                              │
│  Google Gemini 1.5 (Flash + Pro)                        │
└──────────────────────────────────────────────────────────┘
```

---

## 🎨 FRONTEND STACK

### **Core Framework**
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | Latest (via Figma Make) | UI framework |
| **TypeScript** | Latest | Type safety |
| **React Router** | `react-router-dom` | Client-side routing |
| **Vite** | Implicit (via Figma Make) | Build tool & dev server |

**Key Features:**
- ✅ Hot Module Replacement (HMR)
- ✅ Fast builds
- ✅ Code splitting
- ✅ TypeScript support
- ✅ Environment variables (`import.meta.env`)

---

### **UI Component Libraries**

#### **1. Radix UI** (Headless Components)
```typescript
import { Slot } from "@radix-ui/react-slot@1.1.2";
```

**Components Used:**
- `@radix-ui/react-slot` - Component composition
- `@radix-ui/react-dialog` - Modals/dialogs
- `@radix-ui/react-dropdown-menu` - Dropdowns
- `@radix-ui/react-popover` - Popovers
- `@radix-ui/react-select` - Select inputs
- `@radix-ui/react-accordion` - Accordions
- `@radix-ui/react-tabs` - Tabs
- `@radix-ui/react-tooltip` - Tooltips
- `@radix-ui/react-switch` - Toggle switches
- `@radix-ui/react-checkbox` - Checkboxes
- `@radix-ui/react-radio-group` - Radio buttons
- `@radix-ui/react-slider` - Range sliders
- `@radix-ui/react-progress` - Progress bars
- `@radix-ui/react-avatar` - Avatars
- `@radix-ui/react-badge` - Badges
- And 20+ more components

---

#### **2. Class Variance Authority**
```typescript
import { cva, type VariantProps } from "class-variance-authority@0.7.1";
```

**Purpose:** Type-safe variant management for components

**Example:**
```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-white",
        outline: "border bg-background",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3",
        lg: "h-10 px-6",
      }
    }
  }
);
```

---

### **Styling System**

#### **Tailwind CSS v4.0**
```css
@custom-variant dark (&:is(.dark *));
```

**Configuration:**
- ✅ **No config file** - Using Tailwind v4 CSS-based config
- ✅ **Custom properties** - Design tokens in `:root`
- ✅ **Dark mode** - Custom variant system
- ✅ **Design tokens** - All in `/styles/globals.css`

**Design Tokens:**
```css
:root {
  --background: #F7F7F5;
  --foreground: oklch(0.145 0 0);
  --primary: #064E3B;
  --accent: #FBBF24;
  --font-weight-medium: 500;
  /* 40+ design tokens */
}
```

**Typography:**
- **Sans:** Inter (300, 400, 500, 600)
- **Serif:** Playfair Display (400, 500, 600, 700, italic)

---

### **Icon Library**

#### **Lucide React**
```typescript
import { Menu, X, Search, Calendar, MapPin } from 'lucide-react';
```

**Features:**
- ✅ 1,000+ icons
- ✅ Tree-shakeable
- ✅ Customizable size/color
- ✅ Accessible

**Icons Used:**
- Navigation: Menu, X, ChevronDown, ArrowRight
- Actions: Plus, Trash2, Edit, Save, Download
- Content: Calendar, MapPin, Clock, DollarSign
- Status: CheckCircle2, XCircle, AlertCircle, Loader2
- Social: Instagram, Twitter, Facebook
- And 100+ more

---

### **Charts & Visualization**

#### **Recharts**
```typescript
import { LineChart, BarChart, PieChart, ResponsiveContainer } from 'recharts';
```

**Used For:**
- Trip statistics
- Budget tracking
- Analytics dashboards
- Market insights

---

### **Forms & Validation**

#### **React Hook Form**
```typescript
import { useForm } from 'react-hook-form@7.55.0';
```

**Features:**
- ✅ Performance-optimized
- ✅ TypeScript support
- ✅ Built-in validation
- ✅ Error handling

---

### **Notifications**

#### **Sonner** (Toast Notifications)
```typescript
import { toast } from "sonner@2.0.3";
```

**Usage:**
```typescript
toast.success('Trip created!');
toast.error('Failed to save');
toast.loading('Processing...');
```

---

### **Animation**

#### **Motion (Framer Motion)**
```typescript
import { motion } from 'motion/react';
```

**Used For:**
- Page transitions
- Card animations
- Scroll animations
- Gesture handling

**Philosophy:** Used with restraint for purposeful motion

---

### **Carousel**

#### **React Slick**
```typescript
import Slider from 'react-slick';
```

**Used For:**
- Image galleries
- Destination showcases
- Recommendation carousels

---

### **Utilities**

| Library | Purpose |
|---------|---------|
| **clsx** / **cn** | Conditional className merging |
| **date-fns** | Date manipulation |
| **react-dnd** | Drag and drop (itinerary) |

---

## 🔧 BACKEND STACK

### **Runtime: Deno**

**Supabase Edge Functions** run on **Deno** (not Node.js)

**Key Differences:**
```typescript
// ✅ Use npm: prefix for packages
import { Hono } from "npm:hono";

// ✅ Use Deno.env for environment variables
const apiKey = Deno.env.get('GEMINI_API_KEY');

// ✅ Use Deno.serve
Deno.serve(app.fetch);

// ✅ Node built-ins need node: prefix
import process from "node:process";
```

---

### **Web Framework: Hono**

```typescript
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { stream } from "npm:hono/streaming";
```

**Why Hono?**
- ✅ Ultra-lightweight (< 3KB)
- ✅ Express-like API
- ✅ Built for edge runtime
- ✅ TypeScript-first
- ✅ Streaming support

**Features Used:**
- CORS middleware
- Logger middleware
- Streaming responses (AI chat)
- Request/response helpers

---

### **API Architecture**

```
Base URL: https://[PROJECT_ID].supabase.co/functions/v1/make-server-fd8c4bf7

Endpoints (25 total):
├── /health                              GET    Health check
├── /trips                               GET    List trips
├── /trips                               POST   Create trip
├── /trips/:id                           GET    Get trip
├── /trips/:id                           PUT    Update trip
├── /trips/:id                           DELETE Delete trip
├── /trips/:id/items                     GET    List items
├── /trips/:id/items                     POST   Add item
├── /trips/:id/items/:itemId             PUT    Update item
├── /trips/:id/items/:itemId             DELETE Delete item
├── /saved                               GET    List saved places
├── /saved                               POST   Save place
├── /saved/:placeId                      DELETE Unsave place
├── /preferences                         GET    Get preferences
├── /preferences                         PUT    Update preferences
├── /collections                         GET    List collections
├── /collections                         POST   Create collection
├── /collections/:id/places/:placeId     POST   Add to collection
├── /ai/chat                             POST   AI chat (sync)
├── /ai/chat/stream                      POST   AI chat (streaming)
├── /jobs                                POST   Create job
├── /jobs/:id                            GET    Get job status
├── /jobs                                GET    List jobs
├── /jobs/:id/cancel                     POST   Cancel job
├── /jobs/:id                            DELETE Delete job
└── /jobs/cleanup                        POST   Cleanup jobs (cron)
```

---

### **Authentication**

#### **Current: Demo Mode**
```typescript
function getUserId(req: any): string {
  return 'demo-user'; // ❌ Everyone is same user
}
```

#### **Production (To Implement):**
```typescript
import { createClient } from '@supabase/supabase-js';

async function getUserId(req: any): Promise<string> {
  const token = req.header('Authorization').replace('Bearer ', '');
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) throw new Error('Unauthorized');
  return user.id;
}
```

---

## 💾 DATABASE STACK

### **Supabase PostgreSQL**

**Schema Strategy:**
- Using **KV Store** pattern (not traditional tables)
- Data stored as JSON in key-value pairs
- Flexible schema-less approach

**Key Pattern:**
```typescript
// trips:{userId}:{tripId}
// trip_items:{tripId}:{itemId}
// saved:{userId}:{placeId}
// user_prefs:{userId}
// job:{jobId}
```

---

### **KV Store Operations**

```typescript
import * as kv from "./kv_store.tsx";

// Basic operations
await kv.set(key, value);
const value = await kv.get(key);
await kv.del(key);

// Bulk operations
await kv.mset([{ key, value }, ...]);
const values = await kv.mget([key1, key2]);
await kv.mdel([key1, key2]);

// Prefix search
const items = await kv.getByPrefix('trips:user123:');
```

---

### **Data Models**

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

interface TripItem {
  id: string;
  trip_id: string;
  type: 'place' | 'event' | 'accommodation' | 'transport' | 'note';
  title: string;
  description?: string;
  location?: { lat: number; lng: number; address: string };
  date: string;
  start_time?: string;
  end_time?: string;
  day: number;
  order: number;
  price?: number;
  currency?: string;
  booking_status?: 'none' | 'pending' | 'confirmed' | 'cancelled';
  ai_suggested?: boolean;
  ai_reasoning?: string;
}

interface Job {
  id: string;
  userId: string;
  type: 'ai_trip_generation' | 'ai_research' | 'ai_optimization' | ...;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100
  input: any;
  result?: any;
  error?: string;
  checkpoints: Record<string, any>;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  expiresAt: string;
}
```

---

## 🤖 AI STACK

### **Google Gemini**

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
```

**Models:**
- **gemini-1.5-flash** - Fast, good for most use cases (default)
- **gemini-1.5-pro** - More powerful, complex tasks

**Configuration:**
```typescript
const DEFAULT_CONFIG = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 2048,
};
```

---

### **AI Agent Architecture**

**6 Specialized Agents:**

```typescript
/lib/ai/agents/
├── base-agent.ts           // Abstract base class
├── local-scout.ts          // Destination research
├── itinerary-optimizer.ts  // Trip planning
├── dining-orchestrator.ts  // Restaurant recommendations
├── budget-guardian.ts      // Budget tracking
├── booking-assistant.ts    // Booking help
└── event-curator.ts        // Events & activities
```

**Orchestration:**
```typescript
/lib/ai/
├── orchestrator.ts         // Agent coordination
├── event-bus.ts            // Inter-agent messaging
├── context-manager.ts      // Conversation context
├── proactive-assistant.ts  // Proactive suggestions
└── collaboration-engine.ts // Multi-agent collaboration
```

---

### **AI Features**

| Feature | Status | Powered By |
|---------|--------|------------|
| Trip Generation | ✅ | Gemini + Job Queue |
| Destination Research | ✅ | Local Scout Agent |
| Restaurant Recommendations | ✅ | Dining Orchestrator |
| Itinerary Optimization | ✅ | Itinerary Optimizer |
| Budget Tracking | ✅ | Budget Guardian |
| Chat Concierge | ✅ | All Agents + Orchestrator |
| Streaming Responses | ✅ | Gemini Streaming API |
| Function Calling | ✅ | Gemini Tools API |

---

## 🗂️ PROJECT STRUCTURE

```
/
├── App.tsx                    # Root component (45+ routes)
├── styles/
│   └── globals.css            # Tailwind + Design tokens
│
├── components/                # 200+ components
│   ├── ai/                    # AI-related components
│   │   ├── AIChatInterface.tsx
│   │   ├── AIStatusIndicator.tsx
│   │   ├── AgentStatusPanel.tsx
│   │   └── ProgressTracker.tsx
│   ├── ui/                    # Radix UI wrappers
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── 50+ more...
│   ├── layout/                # Layout components
│   │   ├── AppShell.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── modals/                # Modal dialogs
│   │   ├── AddActivityModal.tsx
│   │   ├── EditActivityModal.tsx
│   │   └── DeleteActivityDialog.tsx
│   ├── trip-details/          # Trip management
│   │   ├── TripSidebar.tsx
│   │   ├── ItineraryFeed.tsx
│   │   └── luxury/
│   │       ├── LuxuryItineraryFeed.tsx
│   │       ├── DaySection.tsx
│   │       └── ItineraryItemCard.tsx
│   └── ... (20+ more directories)
│
├── pages/                     # 45+ pages
│   ├── Home.tsx
│   ├── Dashboard.tsx
│   ├── Explorer.tsx
│   ├── Concierge.tsx
│   ├── app/                   # App pages
│   │   ├── TripsPage.tsx
│   │   ├── TripDetailPage.tsx
│   │   └── ConciergePage.tsx
│   ├── use-cases/             # Use case pages
│   │   ├── DigitalNomadPage.tsx
│   │   ├── LuxuryTravelerPage.tsx
│   │   └── GroupTripPage.tsx
│   └── real-estate/           # Real estate feature
│       ├── RealEstateHome.tsx
│       ├── PropertySearch.tsx
│       └── PropertyDetail.tsx
│
├── hooks/                     # Custom React hooks
│   ├── useTrips.ts
│   ├── useSavedPlaces.ts
│   ├── useAdvancedAI.ts
│   ├── useJobStatus.ts        # NEW: Job polling
│   └── use-mobile.ts
│
├── context/                   # React Context
│   ├── AIContext.tsx          # AI state
│   ├── TripContext.tsx        # Trip state
│   └── WizardContext.tsx      # Wizard state
│
├── lib/                       # Core libraries
│   ├── ai/                    # AI modules
│   │   ├── agents/            # 6 AI agents
│   │   ├── gemini-client.ts   # Gemini wrapper
│   │   ├── orchestrator.ts    # Agent coordination
│   │   ├── event-bus.ts       # Messaging
│   │   └── collaboration-engine.ts
│   ├── api/                   # API clients
│   │   ├── client.ts          # HTTP client
│   │   ├── trips.ts           # Trip API
│   │   └── saved-places.ts    # Saved places API
│   ├── supabase/              # Supabase
│   │   ├── client.ts          # Supabase client
│   │   ├── types.ts           # Database types
│   │   └── queries/
│   │       └── trips.ts
│   ├── services/              # Services
│   │   ├── analytics.ts       # Analytics
│   │   ├── pwa.ts             # PWA support
│   │   └── notifications.ts   # Notifications
│   └── utils/                 # Utilities
│       ├── date.ts
│       ├── currency.ts
│       └── validation.ts
│
├── supabase/functions/server/ # Backend
│   ├── index.tsx              # Main server (25 endpoints)
│   ├── kv_store.tsx           # KV operations
│   ├── database-setup.tsx     # DB schema
│   ├── ai-service.tsx         # AI service
│   └── job-service.ts         # Job queue
│
├── data/                      # Mock data
│   ├── mockTripData.ts
│   ├── tripTemplates.ts
│   └── mock-trip-data.ts
│
├── types/                     # TypeScript types
│   └── wizard.ts
│
├── utils/                     # Utilities
│   ├── supabase/
│   │   └── info.tsx           # Supabase config
│   ├── formatting.ts
│   ├── budget.ts
│   └── validation.ts
│
├── public/                    # Static assets
│   ├── manifest.json          # PWA manifest
│   └── service-worker.js      # Service worker
│
└── docs/                      # Documentation (100+ files)
    ├── roadmap/               # Implementation roadmap
    ├── features/              # Feature specs
    ├── architecture/          # Architecture docs
    └── supabase/              # Database docs
```

---

## 🚏 ROUTING SITEMAP

### **Public Pages**
```
/ ................................ Home page
/how-it-works .................... How it works
/pricing ......................... Pricing page
/use-cases ....................... Use cases index
  ├── /use-cases/digital-nomad ... Digital nomad
  ├── /use-cases/luxury-traveler . Luxury traveler
  └── /use-cases/group-trip ...... Group trips
```

### **Core App Pages**
```
/dashboard ....................... User dashboard
/app/trips ....................... Trips list (new)
/app/trip/:id .................... Trip detail (new)
/app/concierge ................... Concierge (new)
/trip/:id ........................ Trip detail (old)
```

### **Discovery & Exploration**
```
/explore ......................... Explore destinations
/map ............................. Map explorer
/wizard/:category ................ Category wizard
/results ......................... Search results
/concierge ....................... AI concierge
```

### **Content Pages**
```
/experiences/medellin ............ Medellin experiences
/experiences/:id ................. Experience detail
/restaurants/:id ................. Restaurant detail
/saved ........................... Saved places
/collections ..................... Collections
/chats ........................... Chat history
```

### **Itinerary**
```
/itinerary ....................... Itinerary wizard
/itinerary/new ................... New itinerary
/itineraries ..................... All itineraries (alias to dashboard)
```

### **Real Estate** (Bonus Feature)
```
/real-estate ..................... Real estate home
/real-estate/search .............. Property search
/real-estate/listing/:id ......... Property detail
/real-estate/market-data ......... Market insights
```

### **Internal/Debug Pages**
```
/style-guide ..................... Design system
/architecture .................... Architecture docs
/status .......................... Production status
/features ........................ Feature gallery
/ai-demo ......................... AI demo
```

### **404**
```
* ................................ 404 Not found
```

**Total Routes:** 45+

---

## 🔐 ENVIRONMENT VARIABLES

### **Frontend (.env)**
```bash
# Supabase
VITE_SUPABASE_URL=https://[PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=[PUBLIC_ANON_KEY]

# Google Gemini AI
VITE_GEMINI_API_KEY=[YOUR_API_KEY]
```

### **Backend (Supabase Secrets)**
```bash
# Supabase (Auto-provided)
SUPABASE_URL=https://[PROJECT_ID].supabase.co
SUPABASE_ANON_KEY=[PUBLIC_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[SERVICE_ROLE_KEY]
SUPABASE_DB_URL=postgresql://...

# Google Gemini AI
GEMINI_API_KEY=[YOUR_API_KEY]
```

---

## 🚀 BUILD & DEPLOYMENT

### **Development**
```bash
# Figma Make handles this automatically
# No manual build commands needed
```

### **Production**
```bash
# Frontend: Deployed via Figma Make
# Backend: Supabase Edge Functions auto-deploy
# Database: Supabase managed PostgreSQL
```

---

## 📦 PACKAGE DEPENDENCIES

### **Frontend**
```json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-router-dom": "latest",
    "@supabase/supabase-js": "latest",
    "@google/generative-ai": "latest",
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "0.7.1",
    "lucide-react": "latest",
    "recharts": "latest",
    "react-hook-form": "7.55.0",
    "sonner": "2.0.3",
    "motion": "latest",
    "react-slick": "latest",
    "react-dnd": "latest",
    "date-fns": "latest"
  }
}
```

### **Backend (Deno)**
```typescript
// All packages imported via npm: prefix
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
```

---

## 🎨 DESIGN SYSTEM

### **Color Palette**
```css
Primary (Green): #064E3B
Accent (Gold): #FBBF24
Background: #F7F7F5
Destructive (Red): #d4183d
```

### **Typography**
- **Headings:** Playfair Display (serif)
- **Body:** Inter (sans-serif)
- **Weights:** 300, 400, 500, 600, 700

### **Design Philosophy**
- ✅ Luxury, calm, confident aesthetic
- ✅ Editorial typography
- ✅ Illustrated cards
- ✅ Soft shadows
- ✅ Motion with restraint and purpose
- ✅ Accessible contrast ratios

---

## 📊 PERFORMANCE METRICS

### **Current**
- Build time: < 10s (Vite)
- Page load: < 2s
- Time to Interactive: < 3s
- Bundle size: ~500KB (estimated)

### **Targets**
- Build time: < 5s
- Page load: < 1.5s
- Time to Interactive: < 2s
- Lighthouse Score: 90+

---

## 🔒 SECURITY

### **Frontend**
- ✅ TypeScript for type safety
- ✅ Content Security Policy (via Figma Make)
- ✅ XSS protection (React escaping)
- 🔴 Authentication (demo mode - needs production auth)

### **Backend**
- ✅ CORS configured
- ✅ Request logging
- ✅ Error handling
- 🔴 Rate limiting (to be implemented)
- 🔴 JWT validation (to be implemented)
- 🔴 Input sanitization (to be enhanced)

---

## 📈 MONITORING & ANALYTICS

### **Built-in**
- ✅ Console logging (development)
- ✅ Error boundaries (production)
- ✅ Service worker (PWA)
- ✅ Analytics service (basic)

### **To Implement**
- 🔴 Error tracking (Sentry)
- 🔴 Performance monitoring
- 🔴 User analytics
- 🔴 API monitoring

---

## 🧪 TESTING

### **Current Status**
- ✅ TypeScript type checking
- ✅ Error boundaries
- 🔴 Unit tests (0%)
- 🔴 Integration tests (0%)
- 🔴 E2E tests (0%)

### **Testing Stack (To Implement)**
- Vitest (unit tests)
- React Testing Library (component tests)
- Playwright (E2E tests)

---

## 📚 DOCUMENTATION

### **Available**
- ✅ Code comments
- ✅ README files
- ✅ Architecture docs
- ✅ Feature specs
- ✅ Implementation guides
- ✅ **This tech stack doc**

### **Location**
```
/docs/
├── TECH-STACK.md ................ This file
├── IMPLEMENTATION-STATUS-CURRENT.md
├── roadmap/
│   ├── 00-PROGRESS-DASHBOARD.md
│   └── 05-IMPLEMENTATION-PHASE-1-COMPLETE.md
├── features/
├── architecture/
└── supabase/
```

---

## 🔄 VERSION CONTROL

### **Current**
- Git-based (via Figma Make)
- No package.json versioning
- Managed by Figma Make platform

---

## 🎯 COMPATIBILITY

### **Browsers**
- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browsers

### **Devices**
- ✅ Desktop (1920x1080+)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667+)

---

## 📞 SUPPORT & RESOURCES

### **Documentation**
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org
- Tailwind CSS: https://tailwindcss.com
- Radix UI: https://www.radix-ui.com
- Supabase: https://supabase.com/docs
- Hono: https://hono.dev
- Gemini AI: https://ai.google.dev

### **Internal**
- `/docs/` - All documentation
- `/pages/Architecture.tsx` - Visual system map
- `/pages/StyleGuide.tsx` - Design system showcase

---

## ✅ TECH STACK SUMMARY

**Frontend:** React + TypeScript + Tailwind CSS + Radix UI  
**Backend:** Deno + Hono + Supabase Edge Functions  
**Database:** Supabase PostgreSQL (KV Store pattern)  
**AI:** Google Gemini 1.5 (Flash + Pro)  
**Routing:** React Router (45+ routes)  
**Icons:** Lucide React  
**Charts:** Recharts  
**Forms:** React Hook Form  
**Notifications:** Sonner  
**Animation:** Motion (Framer Motion)  
**Build:** Vite (via Figma Make)  
**Deployment:** Figma Make Platform  

**Total Components:** 200+  
**Total Pages:** 45+  
**Total API Endpoints:** 25  
**Total AI Agents:** 6  

---

**Last Updated:** December 21, 2024  
**Status:** ✅ Complete & Verified  
**Maintained By:** Development Team
