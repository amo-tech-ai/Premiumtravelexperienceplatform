# 🚀 Quick Start Demo - See AI Agents in Action!

## 📍 **Step 1: Navigate to AI Concierge**

Open your browser and go to:
```
http://localhost:5173/concierge
```

Or from anywhere in the app:
- Click **"AI Concierge"** in the top navigation bar

---

## 🎬 **Step 2: See All 6 Agents**

When the page loads, you'll see:

**LEFT SIDE** (40%): Chat interface  
**RIGHT SIDE** (60%): **Agent Status Panel** with all 6 agents

### **The 6 Agents You'll See:**

1. **🧭 Local Scout** (Blue)
2. **🍽️ Dining Orchestrator** (Orange)
3. **🗺️ Itinerary Optimizer** (Green)
4. **✈️ Booking Assistant** (Purple)
5. **🎭 Event Curator** (Pink)
6. **💰 Budget Guardian** (Green)

---

## 🧪 **Step 3: Test Each Agent**

### **Option A: Click "Test Agent" Button**
1. Click **"AI Agents"** dropdown on the right side
2. Click any agent card to expand it
3. See example query like: _"What should I do in Medellín this weekend?"_
4. Click **"Test Agent"** button
5. Watch the query appear in the chat
6. See the agent's response!

### **Option B: Type Your Own Query**

In the chat input at the bottom, type any of these:

**Test Local Scout:**
```
What should I do in Medellín?
```

**Test Dining Orchestrator:**
```
Best Italian restaurants in El Poblado
```

**Test Event Curator:**
```
What concerts are happening this week?
```

**Test Booking Assistant:**
```
Find hotels in El Poblado under $150/night
```

**Test Itinerary Optimizer:**
```
Optimize my itinerary for tomorrow
```

**Test Budget Guardian:**
```
Am I over budget?
```

---

## 📱 **Step 4: See Agents in Trip Builder**

1. Go to **Dashboard**: `http://localhost:5173/dashboard`
2. Click **"Create New Trip"**
3. Fill in:
   - Destination: **Medellín**
   - Dates: **Jan 15-20, 2025**
   - Budget: **$1500**
   - Travelers: **2**
4. Click through the wizard
5. You'll land on the Trip Details page

### **Now Test Agents in Context:**

**See Itinerary Optimizer:**
1. Add 3-5 activities to Day 1
2. Open right sidebar → Click **"AI Actions"** tab
3. Click **"Optimize Route"** button
4. See optimization modal with savings!

**See Budget Guardian:**
1. Add activities with costs
2. Watch the budget bar at top update in real-time
3. Add expensive items to go over budget
4. See alert: "Over budget by $X"

**See Event Curator:**
1. Open right sidebar → Click **"Ideas"** tab
2. See AI-suggested events and activities
3. Click to add to your trip

---

## 🎯 **What You'll See From Each Agent**

### **🧭 Local Scout Response:**
```
Here are top activities in Medellín:

• Comuna 13 Graffiti Tour ($25, 3 hours)
• Coffee Tasting Experience ($30, 1.5 hours)
• Paragliding Adventure ($65, 2-3 hours)
• Explore Poblado (Free, 2 hours)
• Cable Car to Parque Arvi ($5, Full day)
```

### **🍽️ Dining Orchestrator Response:**
```
Best Italian restaurants in El Poblado:

• El Cielo (Colombian Fusion, $$$$, 4.9⭐)
  Available: 6:00 PM, 7:00 PM, 9:00 PM
  
• Carmen (Contemporary Latin, $$$, 4.7⭐)
  Available: 7:00 PM, 7:30 PM, 8:00 PM
  
• Oci.Mde (Mediterranean, $$$, 4.8⭐)
  Available: 6:30 PM, 7:00 PM, 8:30 PM
```

### **🗺️ Itinerary Optimizer Response:**
```
Route optimized! 

Time Saved: 45 minutes
Distance Saved: 12.3 km
Cost Saved: $15

Changes made:
• Grouped nearby activities in El Poblado
• Moved coffee tasting after Comuna 13 (same area)
• Scheduled indoor activities during afternoon heat
```

### **✈️ Booking Assistant Response:**
```
Found 3 flights to Medellín:

• Avianca AV 123
  JFK → MDE | Direct | 4h 30m
  Dep: 8:00 AM | Arr: 12:30 PM
  $250/person

• Copa Airlines CM 456
  JFK → MDE | 1 stop (Panama) | 6h 30m
  Dep: 11:15 AM | Arr: 5:45 PM
  $200/person

• LATAM LA 789
  JFK → MDE | Direct | 5h 15m
  Dep: 6:00 PM | Arr: 11:15 PM
  $350/person
```

### **🎭 Event Curator Response:**
```
Events happening this week:

• Medellín Flower Festival Parade
  Dec 22, 10:00 AM | Avenida Guayabal
  $25 | Almost sold out! 🔥

• Karol G Concert
  Dec 28, 7:00 PM | Atanasio Girardot
  $80 | Selling fast

• Salsa Night at Eslabón Prendido
  Tonight, 9:00 PM | Centro
  $10 | Popular spot 🎵
```

### **💰 Budget Guardian Response:**
```
Budget Status: ⚠️ WARNING

Total Budget: $1,500
Spent: $1,280 (85%)
Remaining: $220

Breakdown:
• Food: $450 (35%)
• Activities: $380 (30%)
• Stay: $400 (31%)
• Logistics: $50 (4%)

💡 Savings Tips:
• Replace El Cielo dinner with local spot → Save $30
• Use metro instead of taxis → Save $50
• Free walking tours → Save $25
Total potential savings: $105
```

---

## 🔍 **Where Else to Find Agents**

### **Dashboard** (`/dashboard`)
- AI suggestions for new trips
- Smart recommendations based on past trips

### **Trip Details** (`/trip/:id`)
- **Right Sidebar → AI Actions tab:**
  - Auto-Generate Trip
  - Optimize Route
  - Check Conflicts
  - Budget Check
  - Discover Events
  - Find Restaurants
  - Search Bookings

- **Right Sidebar → Ideas tab:**
  - Event Curator suggestions
  - Local Scout recommendations

- **Right Sidebar → Bookings tab:**
  - Booking Assistant results

- **Budget Bar (top of page):**
  - Budget Guardian real-time tracking
  - Alerts when over budget

### **Mobile**
- Bottom-right: **AI Concierge** button (floating chat)
- Bottom-left: **Trip Tools** button (opens sidebar)

---

## 🎨 **Visual Tour**

### **Concierge Page Layout:**
```
┌─────────────────────────────────────────────────────┐
│  🏠 Dashboard    💬 AI Concierge    👤 Profile      │ ← Nav
├──────────────────┬──────────────────────────────────┤
│                  │                                  │
│  💬 CHAT (40%)   │  🎯 AGENT PANEL (60%)            │
│                  │                                  │
│  [AI] Welcome!   │  ┌──────────────────────────┐   │
│                  │  │ AI AGENTS ▼              │   │
│  [You] Find      │  ├──────────────────────────┤   │
│  restaurants     │  │                          │   │
│                  │  │ 🧭 Local Scout      ✅   │ ← Click to expand
│  [AI] Here are   │  │ 🍽️ Dining Orch.    ✅   │
│  3 options...    │  │ 🗺️ Itinerary Opt.  ✅   │
│                  │  │ ✈️ Booking Asst.   ✅   │
│  ┌─────────────┐ │  │ 🎭 Event Curator   ✅   │
│  │ Type here...│ │  │ 💰 Budget Guard.   ✅   │
│  └─────────────┘ │  └──────────────────────────┘   │
│                  │                                  │
└──────────────────┴──────────────────────────────────┘
```

### **Trip Details Page:**
```
┌─────┬──────────────────────┬─────────────┐
│ Nav │   ITINERARY          │  SIDEBAR    │
│     │                      │             │
│     │  Budget: ████ 85%    │ [Tabs]      │
│     │  $1,280 / $1,500     │             │
│     │                      │ Itinerary   │
│     │  Day 1               │ Bookings    │
│     │  • Activity 1  $25   │ Ideas    ←  │ Event Curator
│     │  • Lunch      $50    │ Media       │
│     │  • Activity 2  $30   │ Details     │
│     │                      │ Calendar    │
│     │  Day 2               │ AI Actions  │ ← ALL agents
│     │  • Tour       $85    │             │
│     │                      │             │
│     │                      │ [Optimize]  │ ← Itinerary Opt.
│     │                      │ [Conflicts] │ ← Itinerary Opt.
│     │                      │ [Budget]    │ ← Budget Guard.
│     │                      │ [Events]    │ ← Event Curator
└─────┴──────────────────────┴─────────────┘
```

---

## ✅ **Quick Test Checklist**

- [ ] Open `/concierge` page
- [ ] See Agent Status Panel on right
- [ ] Click "AI Agents" dropdown to expand
- [ ] Click any agent card to see details
- [ ] Click "Test Agent" button
- [ ] See query appear in chat
- [ ] See agent response
- [ ] Try typing your own query
- [ ] Go to `/dashboard`
- [ ] Create a new trip
- [ ] Add activities to itinerary
- [ ] Click "Optimize Route" in AI Actions
- [ ] See optimization modal
- [ ] Add costs and watch budget update
- [ ] Check Ideas panel for suggestions

---

## 🐛 **Troubleshooting**

**Don't see Agent Panel?**
- Make sure you're on desktop (>1024px width)
- Try refreshing the page
- Check browser console for errors

**Agents not responding?**
- Responses are instant with mock data
- Check network tab for errors
- Clear chat and try again

**Can't find AI Actions?**
- Must be on `/trip/:id` page (not dashboard)
- Look for right sidebar
- Click tabs at top of sidebar

---

## 🎉 **You're Ready!**

All 6 agents are working and ready to demo. Start at:

👉 **`/concierge`** to see all agents  
👉 **Create a trip** to see agents in context  
👉 **Click "Test Agent"** buttons to try each one

**Next Step:** Connect Gemini API for real AI-powered responses! 🚀
