# ⚡ TECH STACK - QUICK REFERENCE
## One-Page Cheat Sheet

---

## 🎯 CORE STACK

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend** | React | Latest |
| **Language** | TypeScript | Latest |
| **Build Tool** | Vite | Via Figma Make |
| **Styling** | Tailwind CSS | v4.0 |
| **Routing** | React Router | Latest |
| **Backend Runtime** | Deno | Edge Functions |
| **Backend Framework** | Hono | Latest |
| **Database** | Supabase PostgreSQL | Managed |
| **AI** | Google Gemini | 1.5 Flash/Pro |

---

## 📦 KEY PACKAGES

### **UI Components**
```typescript
// Radix UI (all components)
@radix-ui/react-dialog
@radix-ui/react-dropdown-menu
@radix-ui/react-select
@radix-ui/react-tabs
// + 20 more Radix components

// Variant management
class-variance-authority@0.7.1
```

### **Icons & Charts**
```typescript
lucide-react           // 1000+ icons
recharts               // Charts & graphs
```

### **Forms & Validation**
```typescript
react-hook-form@7.55.0  // Form handling
```

### **Notifications & Animation**
```typescript
sonner@2.0.3           // Toast notifications
motion/react           // Animations (Framer Motion)
```

### **Backend**
```typescript
// Deno imports (npm: prefix)
npm:hono               // Web framework
npm:hono/cors          // CORS middleware
npm:hono/logger        // Request logging
npm:hono/streaming     // SSE streaming
```

### **AI**
```typescript
@google/generative-ai  // Gemini AI client
```

### **Database**
```typescript
@supabase/supabase-js  // Supabase client
```

---

## 🏗️ PROJECT STRUCTURE

```
/
├── App.tsx                  # Main app (45+ routes)
├── components/              # 200+ components
│   ├── ui/                  # Radix UI wrappers
│   ├── ai/                  # AI components
│   ├── layout/              # Layout components
│   ├── modals/              # Dialogs & modals
│   └── trip-details/        # Trip features
├── pages/                   # 45+ pages
├── hooks/                   # Custom hooks
├── context/                 # React Context
├── lib/                     # Core libraries
│   ├── ai/                  # AI modules (6 agents)
│   ├── api/                 # API clients
│   └── supabase/            # Supabase utils
├── supabase/functions/server/  # Backend
│   ├── index.tsx            # Main server
│   ├── job-service.ts       # Job queue
│   ├── ai-service.tsx       # AI service
│   └── database-setup.tsx   # DB schema
├── styles/
│   └── globals.css          # Tailwind + tokens
└── docs/                    # Documentation
```

---

## 🎨 DESIGN TOKENS

```css
/* Colors */
--primary: #064E3B        /* Green */
--accent: #FBBF24         /* Gold */
--background: #F7F7F5     /* Off-white */
--destructive: #d4183d    /* Red */

/* Typography */
Font-Sans: Inter (300, 400, 500, 600)
Font-Serif: Playfair Display (400-700)
```

---

## 🚏 ROUTES (45+)

```
/                        Home
/dashboard               Dashboard
/app/trips               Trips list
/app/trip/:id            Trip detail
/concierge               AI Concierge
/explore                 Explore
/saved                   Saved places
/pricing                 Pricing
/use-cases               Use cases
/real-estate             Real estate
/style-guide             Design system
```

---

## 📡 API ENDPOINTS (25)

```
GET    /health
GET    /trips
POST   /trips
GET    /trips/:id
PUT    /trips/:id
DELETE /trips/:id
GET    /trips/:id/items
POST   /trips/:id/items
PUT    /trips/:id/items/:itemId
DELETE /trips/:id/items/:itemId
GET    /saved
POST   /saved
DELETE /saved/:placeId
GET    /preferences
PUT    /preferences
GET    /collections
POST   /collections
POST   /ai/chat
POST   /ai/chat/stream
POST   /jobs
GET    /jobs/:id
GET    /jobs
POST   /jobs/:id/cancel
DELETE /jobs/:id
POST   /jobs/cleanup
```

---

## 🤖 AI AGENTS (6)

```typescript
/lib/ai/agents/
├── local-scout.ts          # Destination research
├── itinerary-optimizer.ts  # Trip planning
├── dining-orchestrator.ts  # Restaurants
├── budget-guardian.ts      # Budget tracking
├── booking-assistant.ts    # Booking help
└── event-curator.ts        # Events & activities
```

---

## 🔧 COMMON IMPORTS

### **Components**
```typescript
// UI Components
import { Button } from './components/ui/button';
import { Dialog } from './components/ui/dialog';
import { Input } from './components/ui/input';
import { Select } from './components/ui/select';

// Icons
import { Menu, X, Search, Calendar } from 'lucide-react';

// Layout
import { AppShell } from './components/layout/AppShell';
import { Navbar } from './components/layout/Navbar';

// Routing
import { Link, useNavigate, useLocation } from 'react-router-dom';
```

### **Hooks**
```typescript
// React
import { useState, useEffect, useCallback } from 'react';

// Custom hooks
import { useTrips } from './hooks/useTrips';
import { useSavedPlaces } from './hooks/useSavedPlaces';
import { useJobStatus } from './hooks/useJobStatus';

// Context
import { useAI } from './context/AIContext';
import { useTrip } from './context/TripContext';
```

### **API**
```typescript
// Frontend API client
import { api } from './lib/api/client';

// Usage
const response = await api.get('/trips');
const trip = await api.post('/trips', { title: '...' });
```

### **Backend**
```typescript
// Deno Edge Function
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import * as kv from "./kv_store.tsx";

const app = new Hono();
app.use('/*', cors({ origin: '*' }));
```

---

## 🔐 ENV VARIABLES

```bash
# Frontend (.env)
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_ANON_KEY=[key]
VITE_GEMINI_API_KEY=[key]

# Backend (Supabase Secrets)
SUPABASE_URL=[auto]
SUPABASE_ANON_KEY=[auto]
SUPABASE_SERVICE_ROLE_KEY=[auto]
GEMINI_API_KEY=[manual]
```

---

## 💡 COMMON PATTERNS

### **Create Component**
```typescript
import React from 'react';
import { Button } from './ui/button';

export function MyComponent() {
  return (
    <div className="p-4">
      <Button>Click me</Button>
    </div>
  );
}
```

### **API Call**
```typescript
import { api } from './lib/api/client';

async function loadTrips() {
  try {
    const response = await api.get('/trips');
    return response.data;
  } catch (error) {
    console.error('Failed:', error);
  }
}
```

### **Backend Endpoint**
```typescript
app.get("/make-server-fd8c4bf7/trips", async (c) => {
  const userId = getUserId(c.req);
  const trips = await db.getUserTrips(userId);
  return c.json({ success: true, data: trips });
});
```

### **Job Queue**
```typescript
// Frontend
import { useCreateJob } from './hooks/useJobStatus';

const { createJob, job, progress } = useCreateJob({
  onComplete: (job) => console.log('Done!', job.result)
});

await createJob('ai_trip_generation', { destination: 'Paris' });
```

---

## 🎯 QUICK COMMANDS

### **Development**
```bash
# Handled by Figma Make
# No manual commands needed
```

### **Backend Deploy**
```bash
# Auto-deploys on save in Figma Make
```

---

## 📊 STATS

```
Components:       200+
Pages:            45+
Routes:           45+
API Endpoints:    25
AI Agents:        6
Lines of Code:    ~50,000+
Files:            500+
```

---

## 🔗 QUICK LINKS

- **Full Tech Stack:** `/docs/TECH-STACK.md`
- **Implementation Status:** `/docs/IMPLEMENTATION-STATUS-CURRENT.md`
- **Progress Dashboard:** `/docs/roadmap/00-PROGRESS-DASHBOARD.md`
- **Style Guide:** `/pages/StyleGuide.tsx` or visit `/style-guide`

---

**Last Updated:** December 21, 2024
