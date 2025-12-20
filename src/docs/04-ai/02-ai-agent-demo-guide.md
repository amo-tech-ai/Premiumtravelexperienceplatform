# 🤖 AI Agent Demo Guide - Trip Operating System

## 📍 Where to See the Agents

### **Quick Navigation:**
```
/dashboard          → Create trips, see AI suggestions
/trip/:id           → Itinerary builder with AI optimization
/concierge          → Chat with all 6 AI agents
AI Actions Panel    → Inside /trip/:id (right sidebar)
```

---

## 🎯 All 6 AI Agents Explained

### **1. 🧭 Local Scout Agent**
**What it does:** Discovers local events, activities, and attractions

**Where to see it:**
- **Concierge Chat** (`/concierge`)
- **Ideas Panel** (right sidebar in `/trip/:id`)

**Demo Queries:**
```
"What should I do in Medellín?"
"Show me events this weekend"
"Best activities in El Poblado"
"Things to do at night"
"Free attractions in Medellín"
```

**Expected Response:**
- List of 5-10 events/activities
- Categories: music, art, cultural, nightlife
- Prices, dates, locations
- Popularity indicators

**Current Status:** ✅ Working with mock data, ready for Gemini

---

### **2. 🍽️ Dining Orchestrator Agent**
**What it does:** Finds restaurants, matches cuisines, suggests reservations

**Where to see it:**
- **Concierge Chat** (`/concierge`)
- **Add Item to Itinerary** (food category)

**Demo Queries:**
```
"Best Italian restaurants in El Poblado"
"Where can I get authentic Colombian food?"
"Cheap eats under $10"
"Romantic dinner spot"
"Vegetarian restaurants"
```

**Expected Response:**
- Restaurant recommendations
- Cuisine types, price ranges
- Ratings and reviews
- Available reservation times
- Location details

**Current Status:** ✅ Working with mock data, ready for Gemini

---

### **3. 🗺️ Itinerary Optimizer Agent**
**What it does:** Optimizes routes, detects conflicts, smart scheduling

**Where to see it:**
- **AI Actions Panel** → "Optimize Route" button
- **AI Actions Panel** → "Check Conflicts" button
- **Concierge Chat** (`/concierge`)

**Demo Actions:**
1. Go to `/trip/:id`
2. Add 3-5 activities to different days
3. Click **"AI Actions"** in right sidebar
4. Click **"Optimize Route"** → See reordered activities
5. Click **"Check Conflicts"** → See overlapping times

**Demo Queries:**
```
"Optimize my itinerary"
"Are there any scheduling conflicts?"
"Best order for these activities"
"Group nearby locations together"
```

**Expected Response:**
- Reordered activities by proximity
- Time saved calculation
- Distance saved
- Conflict warnings with details

**Current Status:** ✅ Working with rule-based logic + Gemini ready

---

### **4. ✈️ Booking Assistant Agent**
**What it does:** Searches flights, hotels, restaurants, activities

**Where to see it:**
- **Concierge Chat** (`/concierge`)
- **Bookings Panel** (right sidebar in `/trip/:id`)

**Demo Queries:**
```
"Find flights from New York to Medellín"
"Hotels in El Poblado under $150/night"
"Book a table at El Cielo for 2 people"
"Coffee tour in Guatapé"
"Paragliding experience"
```

**Expected Response:**

**Flights:**
- 3-5 flight options
- Airlines, times, prices
- Direct vs. layover
- Availability status

**Hotels:**
- 4-6 hotel options
- Star ratings, amenities
- Price per night
- Area/neighborhood

**Restaurants:**
- Available times
- Party size options
- Price ranges
- Cuisine types

**Activities:**
- Tours & experiences
- Durations & prices
- What's included
- Availability

**Current Status:** ✅ Working with realistic mocks, ready for API integration

---

### **5. 🎭 Event Curator Agent**
**What it does:** Discovers events, checks tickets, personalizes recommendations

**Where to see it:**
- **Concierge Chat** (`/concierge`)
- **Ideas Panel** (right sidebar in `/trip/:id`)

**Demo Queries:**
```
"What events are happening this week?"
"Concerts in Medellín"
"Art exhibitions near me"
"Salsa dancing events"
"Football matches this weekend"
```

**Expected Response:**
- 5-10 events matching criteria
- Categories: music, art, food, sports, nightlife
- Dates, venues, prices
- Ticket availability
- Popularity (trending, sold out, etc.)

**Sample Events You'll See:**
- Medellín Flower Festival Parade
- Karol G Concert
- Salsa Night at Eslabón Prendido
- Contemporary Art Exhibition
- Street Food Festival
- Football Match
- Comedy Night

**Current Status:** ✅ Working with curated mock events, ready for Ticketmaster API

---

### **6. 💰 Budget Guardian Agent**
**What it does:** Tracks budget, alerts overspending, suggests savings

**Where to see it:**
- **Budget Summary** (top of itinerary in `/trip/:id`)
- **Concierge Chat** (`/concierge`)
- **AI Actions Panel** → Auto-triggers on budget issues

**Demo Steps:**
1. Go to `/trip/:id`
2. Add activities with costs
3. Watch budget bar update in real-time
4. Go over budget → See alert from Budget Guardian
5. Ask AI for savings suggestions

**Demo Queries:**
```
"Am I over budget?"
"How can I save money?"
"What's my spending breakdown?"
"Find cheaper alternatives"
"Budget-friendly activities"
```

**Expected Response:**
- Budget status (safe, warning, exceeded)
- Spending breakdown by category
- Cost per day average
- Savings suggestions with specific tips
- Alternative options

**Current Status:** ✅ Working with real-time calculations + AI suggestions ready

---

## 🎬 DEMO WALKTHROUGH - Step by Step

### **DEMO 1: Test All Agents in Concierge Chat**

1. **Open the AI Concierge**
   ```
   Navigate to: /concierge
   ```

2. **Test Each Agent:**

   **Local Scout:**
   ```
   Type: "What should I do in Medellín this weekend?"
   ```
   → See events, activities, local recommendations

   **Dining Orchestrator:**
   ```
   Type: "Best Italian restaurants in El Poblado"
   ```
   → See restaurant recommendations with prices

   **Event Curator:**
   ```
   Type: "Are there any concerts happening?"
   ```
   → See music events with ticket info

   **Booking Assistant:**
   ```
   Type: "Find me a hotel in El Poblado for $100/night"
   ```
   → See hotel options with amenities

   **Budget Guardian:**
   ```
   Type: "I'm on a $500 budget, any tips?"
   ```
   → See budget advice and savings tips

   **Itinerary Optimizer:**
   ```
   Type: "Optimize my route for tomorrow"
   ```
   → See route optimization suggestions

---

### **DEMO 2: Build an Itinerary with AI Help**

1. **Create a New Trip**
   ```
   Navigate to: /dashboard
   Click: "Create New Trip" button
   Fill in:
   - Destination: Medellín
   - Dates: Jan 15-20, 2025
   - Budget: $1500
   - Travelers: 2
   ```

2. **Add Activities**
   ```
   On trip details page:
   - Click "+" to add items
   - Add: "Comuna 13 Tour" ($25, 3 hours)
   - Add: "Lunch at El Cielo" ($50, 2 hours)
   - Add: "Coffee Tasting" ($30, 1.5 hours)
   - Add: "Paragliding" ($65, 3 hours)
   ```

3. **Watch Budget Guardian**
   ```
   - See budget bar update in real-time
   - Total: $170 / $1500
   - See breakdown by category
   ```

4. **Optimize Route**
   ```
   - Open right sidebar → "AI Actions" tab
   - Click "Optimize Route"
   - See modal with:
     * Reordered activities
     * Time saved: ~45 min
     * Distance saved: ~12 km
   ```

5. **Check Conflicts**
   ```
   - Click "Check Conflicts"
   - See any overlapping times
   - Get suggestions to fix
   ```

6. **Get Ideas**
   ```
   - Open right sidebar → "Ideas" tab
   - See AI-suggested activities
   - Click to add to itinerary
   ```

---

### **DEMO 3: Search & Book**

1. **Search for Restaurants**
   ```
   Navigate to: /concierge
   Type: "Find restaurants for dinner tonight"
   
   Expected Response:
   - El Cielo (Colombian Fusion, $$$$)
   - Carmen (Contemporary Latin, $$$)
   - Oci.Mde (Mediterranean, $$$)
   
   Each with:
   - Available times: 6:00 PM, 7:00 PM, 8:00 PM
   - Party size options
   - Ratings & reviews
   ```

2. **Search for Hotels**
   ```
   Type: "Hotels in El Poblado under $200"
   
   Expected Response:
   - The Click Clack Hotel ($180/night, 4.8⭐)
   - Elcielo Hotel ($320/night, 4.9⭐) [over budget but shown]
   - Masaya Medellín ($85/night, 4.6⭐)
   
   Each with:
   - Star rating
   - Amenities
   - Total price for stay
   - Availability
   ```

3. **Search for Flights**
   ```
   Type: "Flights from JFK to Medellín on January 15"
   
   Expected Response:
   - Avianca AV 123 (Direct, $250, 4h 30m)
   - Copa Airlines CM 456 (1 stop, $200, 6h 30m)
   - LATAM LA 789 (Direct, $350, 5h 15m)
   
   Each with:
   - Departure/arrival times
   - Stops
   - Duration
   - Price per person
   ```

4. **Search for Activities**
   ```
   Type: "Day tours near Medellín"
   
   Expected Response:
   - Comuna 13 Graffiti Tour ($25, 3 hours)
   - Coffee Farm Tour in Guatapé ($85, full day)
   - Paragliding Adventure ($65, 2-3 hours)
   
   Each with:
   - Duration & price
   - What's included
   - Ratings
   - Availability
   ```

---

### **DEMO 4: Budget Tracking**

1. **Create Budget-Limited Trip**
   ```
   Create trip with $500 budget
   ```

2. **Add Expensive Items**
   ```
   Add:
   - Luxury hotel: $300/night × 3 = $900
   - See Budget Guardian alert: "OVER BUDGET by $400"
   ```

3. **Ask for Savings**
   ```
   Go to /concierge
   Type: "How can I save money on this trip?"
   
   Expected Response:
   - "Switch to Masaya Medellín ($85/night) → Save $645"
   - "Replace dinner at El Cielo with local spot → Save $30"
   - "Use metro instead of taxis → Save $50"
   - "Free walking tours instead of paid → Save $25"
   - "Total potential savings: $750"
   ```

4. **View Breakdown**
   ```
   In /trip/:id, see budget panel:
   - Food: 35%
   - Activities: 25%
   - Logistics: 10%
   - Stay: 30%
   ```

---

## 🎨 UI Locations - Where to Find Everything

### **Main Navigation:**
```
┌─────────────────────────────────────────┐
│  [Logo] Dashboard  Concierge  Profile   │ ← Top nav bar
└─────────────────────────────────────────┘
```

### **Dashboard Page (`/dashboard`):**
```
┌─────────────────────────────────────────┐
│  My Trips                               │
│  ┌─────┐ ┌─────┐ ┌─────┐               │
│  │ T1  │ │ T2  │ │ T3  │               │
│  └─────┘ └─────┘ └─────┘               │
│                                         │
│  [+ Create New Trip]  ← Click to start │
└─────────────────────────────────────────┘
```

### **Trip Details Page (`/trip/:id`):**
```
┌──────────┬─────────────────┬────────────┐
│          │                 │            │
│ Left Nav │  ITINERARY      │  SIDEBAR   │
│          │                 │            │
│  Home    │  ┌──────────┐   │ [Tabs]     │
│  Trips   │  │ Day 1    │   │            │
│  Guide   │  │ • Item 1 │   │ Itinerary  │
│          │  │ • Item 2 │   │ Bookings   │
│          │  └──────────┘   │ Ideas   ←  │
│          │                 │ Media      │
│          │  ┌──────────┐   │ Details    │
│          │  │ Day 2    │   │ Calendar   │
│          │  │ • Item 3 │   │ AI Actions │
│          │  └──────────┘   │            │
│          │                 │            │
│          │  Budget: ███ 60%│            │
└──────────┴─────────────────┴────────────┘
              ↑                    ↑
        Drag & drop          Click tabs
        Add items            to see agents
```

### **AI Actions Panel (Inside Trip Details):**
```
Click "AI Actions" tab in right sidebar:

┌────────────────────────────┐
│  AI ACTIONS                │
├────────────────────────────┤
│                            │
│  🌟 Auto-Generate          │ ← Full itinerary
│     Let AI build trip      │
│                            │
│  🗺️  Optimize Route        │ ← Itinerary Optimizer
│     Save time & distance   │
│                            │
│  ⚠️  Check Conflicts       │ ← Itinerary Optimizer
│     Find scheduling issues │
│                            │
│  💰 Budget Check           │ ← Budget Guardian
│     Review spending        │
│                            │
│  🎭 Discover Events        │ ← Event Curator
│     What's happening       │
│                            │
│  🍽️  Find Restaurants      │ ← Dining Orchestrator
│     Best dining spots      │
│                            │
│  ✈️  Search Bookings       │ ← Booking Assistant
│     Flights, hotels, etc.  │
└────────────────────────────┘
```

### **Concierge Chat (`/concierge`):**
```
┌─────────────────────────────────────────┐
│  AI Concierge                           │
├─────────────────────────────────────────┤
│                                         │
│  [AI] Welcome! Ask me about events,    │
│       dining, bookings, or planning.    │
│                                         │
│  [You] What should I do in Medellín?   │
│                                         │
│  [AI] Based on your interests, here    │
│       are 5 top activities...          │
│       • Comuna 13 Tour                 │
│       • Coffee Tasting                 │
│       • Paragliding                    │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Type your message...              │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
         ↑
  All 6 agents respond here
  based on your query
```

---

## 🧪 Testing Each Agent - Quick Reference

| Agent | Test Location | Action | What to Look For |
|-------|---------------|--------|------------------|
| **Local Scout** | `/concierge` | Ask: "Things to do" | Events, activities list |
| **Dining Orchestrator** | `/concierge` | Ask: "Find restaurants" | Restaurant recommendations |
| **Itinerary Optimizer** | `/trip/:id` → AI Actions | Click "Optimize Route" | Reordered activities, savings |
| **Itinerary Optimizer** | `/trip/:id` → AI Actions | Click "Check Conflicts" | Time overlap warnings |
| **Booking Assistant** | `/concierge` | Ask: "Book a hotel" | Hotel search results |
| **Event Curator** | `/concierge` | Ask: "Events this week" | Event listings with tickets |
| **Budget Guardian** | `/trip/:id` | Add expensive items | Budget alerts, % used |

---

## 🎯 Agent Status Dashboard

Want to see which agents are active? Open browser console and type:

```javascript
// Check all agents are initialized
import { getAgentStatus } from '/lib/ai/agents/index';
console.log(getAgentStatus());

// Expected output:
{
  local_scout: true,
  dining_orchestrator: true,
  itinerary_optimizer: true,
  booking_assistant: true,
  event_curator: true,
  budget_guardian: true
}
```

---

## 🔄 Current vs. Future State

### **Current (Mock Data):**
- ✅ All agents respond instantly
- ✅ Realistic mock data
- ✅ Full functionality testing
- ✅ No API keys needed

### **After Gemini Connection:**
- ✨ Personalized responses
- ✨ Real-time event discovery
- ✨ Context-aware recommendations
- ✨ Natural language understanding
- ✨ Multi-turn conversations

---

## 📱 Mobile Demo

All agents work on mobile too!

**On mobile:**
1. Bottom-right: **AI Concierge** (chat bubble)
2. Bottom-left: **Trip Tools** (sidebar access)
3. Tap any action to trigger agents

---

## 🎬 Video Demo Script

**30-Second Demo:**
```
1. Open /dashboard → Click "Create Trip"
2. Fill in: Medellín, Jan 15-20, $1500
3. Add 3 activities with costs
4. Watch budget update real-time
5. Click "Optimize Route" → See savings
6. Open concierge → Ask "Best restaurants?"
7. See 5 recommendations instantly
```

**2-Minute Full Demo:**
```
1. Dashboard → Create trip
2. Add 5+ activities to itinerary
3. Drag to reorder days
4. Check conflicts → See warnings
5. Optimize route → See new order
6. Ask AI about events → Get recommendations
7. Search hotels → See options
8. Add expensive item → Budget alert
9. Ask for savings → Get tips
10. Show Ideas panel → AI suggestions
```

---

## 🐛 Troubleshooting

**Agent not responding?**
- Check browser console for errors
- Verify you're on correct route
- Try refreshing the page

**Mock data not showing?**
- Check orchestrator is initialized
- Open console: `getOrchestrator()`
- Agents initialize on first query

**Can't find AI Actions panel?**
- Go to `/trip/:id`
- Look for right sidebar
- Click "AI Actions" tab
- On mobile: tap bottom-left button

---

**Ready to test?** Start at `/dashboard` and create your first trip! 🚀
