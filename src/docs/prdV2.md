# Product Requirements Document V2: Trip Operating System
## Local Scout AI - Feature, Use Case & AI Architecture Addendum

**Version:** 2.0  
**Date:** December 18, 2024  
**Status:** Production Ready - Implementation Phase  
**Design Status:** 🔒 LOCKED - No UI/UX changes required

---

## Table of Contents

1. [Feature Inventory (Core → Advanced)](#1-feature-inventory-core--advanced)
2. [AI Agents Architecture](#2-ai-agents-architecture)
3. [Top 10 AI Agents (Priority Order)](#3-top-10-ai-agents-priority-order)
4. [Concrete Use Cases](#4-concrete-use-cases)
5. [System Workflows](#5-system-workflows)
6. [Actions & Logic Map](#6-actions--logic-map)
7. [Architecture (Design-Locked)](#7-architecture-design-locked)
8. [Gemini 3 Pro Feature Usage](#8-gemini-3-pro-feature-usage)
9. [Advanced AI Features](#9-advanced-ai-features)
10. [Revenue Generation Models](#10-revenue-generation-models)
11. [Implementation Roadmap](#11-implementation-roadmap)
12. [Technical Architecture](#12-technical-architecture)
13. [Success Metrics & KPIs](#13-success-metrics--kpis)
14. [Competitive Advantages](#14-competitive-advantages)
15. [Risk Mitigation](#15-risk-mitigation)
16. [Production-Ready Guardrails](#16-production-ready-guardrails)

---

## 1. Feature Inventory (Core → Advanced)

### 1.1 Core Features (Must Ship) ✅

**These make the product usable WITHOUT AI.**

#### Trip Core
- ✅ Create / edit trip
- ✅ Set dates, travelers, destination
- ✅ Trip status management (planning, active, completed)
- ✅ Multi-trip dashboard view

#### Itinerary
- ✅ Day-by-day timeline view
- ✅ Manual add / edit / remove items
- ✅ Drag & reorder activities (react-dnd implemented)
- ✅ Time slot management
- ✅ Activity categorization (food, activity, logistics, event)

#### Bookings
- ✅ Flights, stays, activities, dining tracking
- ✅ Booking confirmation storage
- ✅ Right-side bookings panel (collapsible)
- ✅ Calendar integration preparation

#### Budget
- ✅ Trip budget setting
- ✅ Expense logging
- ✅ Category-based tracking
- ✅ Real-time totals

#### Concierge Chat (UI Exists)
- ✅ Natural language input
- ✅ Context-aware responses
- ✅ Global overlay (accessible from all pages)
- ✅ Intent detection framework

---

### 1.2 Advanced Features (AI-Enabled) 🚀

**These ENHANCE, never replace, core flows.**

#### Intelligent Automation
- 🔄 Auto-generate complete itinerary from preferences
- 🔄 Optimize itinerary (time, location, budget, energy)
- 🔄 Smart dining recommendations with contextual awareness
- 🔄 Automated booking with user approval gates
- 🔄 Date-specific event discovery
- 🔄 Local insider intelligence
- 🔄 Budget forecasting & proactive alerts
- 🔄 Group coordination & polling logic

#### Predictive Intelligence
- 🔄 Price drop monitoring & alerts
- 🔄 Availability prediction (sell-out warnings)
- 🔄 Weather-aware rescheduling
- 🔄 Crowd-level forecasting
- 🔄 Safety risk monitoring

#### Experience Enhancement
- 🔄 Hidden gem discovery
- 🔄 Cultural context & local customs
- 🔄 Real-time translation assistance
- 🔄 Post-trip memory generation
- 🔄 Loyalty rewards system

**Legend:**
- ✅ Already implemented
- 🔄 To be implemented (this document)

---

## 2. AI Agents Architecture

### 2.1 Fundamental Principle

> **AI never changes UI. It only writes data and emits events.**

```
┌─────────────────────────────────────────────┐
│         USER INTERFACE (React)              │
│         (Design Locked - No Changes)        │
└─────────────────┬───────────────────────────┘
                  │ Reads State
                  ↓
┌─────────────────────────────────────────────┐
│       SUPABASE DATABASE (PostgreSQL)        │
│       (Single Source of Truth)              │
└─────────────────┬───────────────────────────┘
                  ↑ Writes Data
                  │
┌─────────────────┴───────────────────────────┐
│            AI AGENT LAYER                   │
│   (Invisible Operators - No UI Presence)    │
│                                              │
│  [Dining] [Optimizer] [Booking] [Events]    │
│  [Local] [Budget] [Group] [Safety]          │
│  [Memory] [Real Estate]                     │
└─────────────────────────────────────────────┘
```

### 2.2 Agent Communication: Event Bus

All agents communicate via a central event bus (pub/sub pattern).

```typescript
// Event Bus Architecture
EventBus.emit('EVENTS_DISCOVERED', { events: [...] });
EventBus.on('BUDGET_EXCEEDED', (data) => { /* handle */ });

// No agent directly calls another agent
// All coordination happens through events
```

---

## 3. Top 10 AI Agents (Priority Order)

### Agent #1: Smart Itinerary Optimizer Agent 🎯

**Priority:** CRITICAL | **Revenue Impact:** HIGH | **User Demand:** ESSENTIAL

#### Purpose
Automatically optimizes trip schedules for time, cost, energy expenditure, and experience quality using multi-objective optimization algorithms.

#### Core Capabilities
- **Route Optimization:** Reduces daily travel time by 45-60 minutes using clustering algorithms
- **Energy Management:** Balances high-intensity and relaxation activities based on user fatigue patterns
- **Budget Allocation:** Distributes spending across categories based on user preferences and market pricing
- **Conflict Detection:** Identifies scheduling conflicts, overbooking, and impossible transitions
- **Weather-Aware Scheduling:** Moves indoor/outdoor activities based on 10-day forecasts

#### Workflows & Logic
```
User Action → AI Analysis → Optimization Engine → Conflict Resolution 
→ Smart Suggestions → User Approval → Auto-Scheduling

Sub-Workflows:
1. Real-time monitoring of itinerary changes
2. Continuous re-optimization when items added/removed
3. Batch processing for major schedule shifts
4. Learning from user acceptance/rejection patterns
```

#### Technical Implementation

**Input Schema:**
```typescript
interface OptimizerInput {
  days: Array<{
    dayNumber: number;
    date: string;
    items: Array<{
      id: string;
      title: string;
      location: { lat: number; lng: number };
      time: string;
      duration: string;
      cost: number;
      type: 'food' | 'activity' | 'logistics' | 'event';
      priority: 'locked' | 'flexible' | 'optional';
    }>;
  }>;
  optimizationGoal: 'time' | 'cost' | 'experience' | 'balanced';
  userPreferences: {
    maxDailyActivities: number;
    preferredPaceLevel: 'relaxed' | 'moderate' | 'packed';
    prioritizeLocal: boolean;
  };
  constraints: {
    lockedItems: string[]; // Item IDs that cannot be moved
    budgetLimit: number;
    mustInclude: string[]; // Required experiences
  };
}
```

**Gemini 3 Pro Features Used:**
- **Code Execution:** Haversine distance calculations, graph optimization algorithms
- **Gemini Thinking:** Multi-constraint reasoning (time + budget + energy simultaneously)
- **Structured Output:** Reordered itinerary with confidence scores

**Output Schema:**
```typescript
interface OptimizerOutput {
  reorderedDays: typeof OptimizerInput.days;
  savings: {
    time: number; // minutes saved per day
    distance: number; // km saved
    cost: number; // $ saved
    energy: number; // fatigue score reduction (0-100)
  };
  improvements: Array<{
    type: 'time' | 'cost' | 'route' | 'conflict';
    description: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  conflicts: Array<{
    itemId: string;
    issue: string;
    severity: 'critical' | 'warning' | 'info';
    resolution: string;
  }>;
  confidenceScore: number; // 0.00 - 1.00
}
```

#### Use Cases & Real-World Examples

**Example 1: Medellín Family Trip**
```
BEFORE:
Day 2:
- 9:00 AM: Comuna 13 Tour (Poblado pickup)
- 2:00 PM: Lunch in Laureles
- 6:00 PM: Dinner in Poblado
- 8:00 PM: Pueblito Paisa visit

AGENT DETECTS:
- 40-minute transit between Comuna 13 → Laureles (peak traffic)
- Pueblito Paisa closes at 8 PM (impossible)
- Inefficient routing: Poblado → Comuna 13 → Laureles → Poblado → Pueblito

OPTIMIZED:
Day 2:
- 9:00 AM: Comuna 13 Tour
- 1:30 PM: Lunch in Comuna 13 (local spot, authentic + cheaper)
- 3:30 PM: Pueblito Paisa (nearby, open, golden hour photos)
- 7:30 PM: Dinner in Poblado (more realistic timing)

SAVINGS:
- Time: 65 minutes
- Cost: $18 (less transit, cheaper lunch)
- Stress: Eliminated rushed schedule
```

**Example 2: Business Traveler**
```
SCENARIO: 3 meetings in El Poblado + leisure activities

AGENT LOGIC:
- Clusters meetings: 9 AM, 11 AM, 2 PM (same neighborhood)
- Schedules lunch at Provenza (5-min walk from meeting 3)
- Moves museum visit to evening (avoids midday traffic)
- Suggests coworking space between meetings 1 & 2 (productive wait time)

RESULT: 90 minutes saved, converted to productive work time
```

**Example 3: Weekend Explorer**
```
USER ADDS: 12 attractions for 2-day trip (physically impossible)

AGENT ANALYSIS:
- Detects 5.5 hours of travel time for original plan
- Identifies 3 "must-see" items (based on user's saved items history)
- Groups remaining 9 by geographic clusters
- Suggests Day 1: Poblado cluster (6 items), Day 2: Laureles cluster (6 items)

OPTIMIZED PLAN:
- 12 attractions → 8 realistic attractions
- 5.5 hours travel → 1.5 hours travel
- Added buffer time for spontaneous discoveries
```

#### Actions Triggered
```typescript
// Agent emits events after optimization
EventBus.emit('ITINERARY_OPTIMIZED', {
  tripId: 'uuid',
  changes: [...],
  savings: { time: 65, cost: 18, distance: 12 },
  requiresUserApproval: true
});

// UI listens for event, shows modal:
// "I found a better schedule that saves you 65 minutes. Review changes?"
```

#### Revenue Streams
- **Premium Tier:** $9.99/month for unlimited optimizations
- **Affiliate Commissions:** Suggested restaurants/activities generate 5-8% booking fees
- **B2B White-Label:** $299/month for travel agency integration

#### Benefits
- **User:** Saves 2-3 hours of manual planning per trip, eliminates scheduling stress
- **Platform:** 34% increase in booking conversion when optimization suggested
- **Partners:** Higher booking volume during optimal time slots (less cancellations)

---

### Agent #2: Predictive Booking Assistant Agent 💳

**Priority:** CRITICAL | **Revenue Impact:** VERY HIGH | **User Demand:** HIGH

#### Purpose
Proactively monitors availability and pricing for user-favorited items, automatically booking or alerting when optimal conditions are met.

#### Core Capabilities
- **Price Monitoring:** Tracks prices across 50+ booking platforms in real-time
- **Availability Prediction:** Uses ML to predict when popular restaurants/events will sell out
- **Dynamic Pricing Alerts:** Notifies users when prices drop below personalized thresholds
- **Auto-Booking:** With user permission, automatically books when criteria met
- **Cancellation Insurance:** Recommends free-cancellation options with probability scoring

#### Workflows & Logic
```
Item Saved → Price Tracking Initiated → ML Prediction Model 
→ Threshold Detection → Alert/Auto-Book → Confirmation 
→ Calendar Integration

Decision Tree:
- If price drops 15%+ → Immediate alert
- If availability < 20% and price stable → "Book now" recommendation
- If better alternatives found → Comparison notification
- If user pattern indicates urgency → Escalate priority
```

#### Technical Implementation

**Input Schema:**
```typescript
interface BookingAssistantInput {
  savedItemId: string;
  itemType: 'restaurant' | 'event' | 'stay' | 'experience';
  userPreferences: {
    maxPrice: number;
    preferredTimes: string[]; // ["7:00 PM", "8:00 PM"]
    partySize: number;
    autoBookEnabled: boolean;
    priceDropThreshold: number; // percentage (e.g., 15 = 15% drop)
  };
  tripDates: {
    start: string;
    end: string;
  };
}
```

**Gemini 3 Pro Features Used:**
- **Function Calling:** Direct integration with booking APIs (OpenTable, Eventbrite, etc.)
- **Search Grounding:** Real-time availability checks across platforms
- **Gemini Thinking:** Predicts sell-out probability based on historical patterns
- **Structured Output:** Booking confirmation data

**Prediction Model:**
```typescript
// ML Model for Sell-Out Prediction
interface SellOutPrediction {
  probability: number; // 0.00 - 1.00
  estimatedTimeToSellOut: number; // hours
  confidenceLevel: 'high' | 'medium' | 'low';
  factorsConsidered: Array<{
    factor: 'historical_velocity' | 'event_popularity' | 'capacity' | 'date_proximity';
    weight: number;
    contribution: number;
  }>;
}

// Example:
// Nacional football match
// Current availability: 18% of tickets
// Ticket velocity: 120 sold/hour (last 6 hours)
// Historical sellout time: 36 hours before game
// Prediction: 92% probability of sellout in 12 hours
```

**Output Schema:**
```typescript
interface BookingAssistantOutput {
  action: 'book' | 'alert' | 'monitor' | 'skip';
  reason: string;
  bookingDetails?: {
    venue: string;
    date: string;
    time: string;
    partySize: number;
    price: number;
    confirmationCode: string;
    cancellationPolicy: string;
  };
  alternatives?: Array<{
    venue: string;
    price: number;
    availability: string;
    matchScore: number; // How well it matches preferences
  }>;
  savings?: number; // If auto-booked during price drop
}
```

#### Use Cases & Real-World Examples

**Example 1: El Cielo Restaurant - Auto-Booking**
```
SCENARIO:
- User saves "El Cielo" for Saturday dinner (trip in 2 weeks)
- Sets max price: $150/person, preferred time: 8 PM
- Enables auto-booking

AGENT MONITORING:
Day 1-10: No 8 PM availability
Day 11: Table for 2 opens at 8:15 PM (cancellation detected)
         Price: $140/person (within budget)

AGENT ACTION:
- Auto-books immediately (within 3 seconds of availability)
- Charges user's pre-approved payment method
- Sends confirmation email + SMS
- Adds to itinerary Day 4, 8:15 PM slot
- Blocks alternative restaurants in that time window

USER EXPERIENCE:
Wakes up to notification: "Great news! I secured your table at El Cielo 
for Saturday 8:15 PM. Saved to your itinerary."
```

**Example 2: Nacional Football Match - Predictive Alert**
```
SCENARIO:
- User favorites "Atlético Nacional vs. Millonarios" match
- Current price: $45, availability: 35%
- No auto-booking enabled (wants to review first)

AGENT ANALYSIS:
- Historical data: Similar rivalry matches sell out 48 hours before
- Current velocity: 180 tickets/hour
- Prediction: 89% sellout probability in 36 hours
- Price surge risk: 60% probability of price increase to $80+

AGENT ACTION:
- Sends alert: "This match typically sells out 2 days before game. 
  Current tickets: $45 (Tribuna Norte - best atmosphere).
  I predict prices will jump to $80+ if you wait.
  Book now or enable auto-booking?"

USER DECISION:
- Books immediately, saves $35+ vs. waiting
```

**Example 3: Concert Secondary Market - Smart Alternative**
```
SCENARIO:
- User wants Karol G concert tickets (primary sold out)
- Monitoring secondary market (StubHub, Viagogo, local resellers)

AGENT MONITORING:
- Detects verified tickets at $200 (vs. $400 scalper prices)
- Validates seller legitimacy (Gemini URL Context tool checks seller profile)
- Compares to 50 other listings (best price + verified)

AGENT ACTION:
- Alerts: "Verified tickets found at $200 (face value $150, 
  best available price). Alternative: Similar artist 'Feid' 
  playing smaller venue next week, $80 tickets available."

USER VALUE:
- Saved $200 vs. average secondary market
- Got alternative suggestion matching music taste
```

#### Actions Triggered
```typescript
// Price drop detected
EventBus.emit('PRICE_DROP_DETECTED', {
  itemId: 'uuid',
  oldPrice: 180,
  newPrice: 140,
  dropPercentage: 22,
  autoBookEnabled: true
});

// Auto-booking executed
EventBus.emit('AUTO_BOOKING_COMPLETED', {
  bookingId: 'uuid',
  venue: 'El Cielo',
  totalCost: 280,
  confirmationCode: 'EC-2024-1234'
});

// UI updates itinerary + shows success message
```

#### Revenue Streams
- **Booking Fee:** 3-8% per transaction ($8.40 on $280 booking)
- **Premium Subscription:** $14.99/month for auto-booking feature
- **Affiliate Commissions:** 5-12% from booking partners
- **Data Licensing:** Demand forecasting data to venues ($50K+/year)

#### Benefits
- **User:** Never miss sold-out experiences, save average $47 per booking
- **Platform:** $23 average revenue per booking transaction
- **Partners:** Higher booking certainty, reduced no-show rates (pre-paid via platform)

---

### Agent #3: Local Insider Intelligence Agent 🗺️

**Priority:** HIGH | **Revenue Impact:** MEDIUM-HIGH | **User Demand:** VERY HIGH

#### Purpose
Provides hyper-local, real-time intelligence by synthesizing data from local sources, social media, resident reviews, and on-ground sensors.

#### Core Capabilities
- **Neighborhood Micro-Climate:** Block-level safety, noise, cleanliness scoring updated hourly
- **Hidden Gems Discovery:** Surfaces places with <500 reviews but 4.8+ ratings from verified locals
- **Real-Time Crowd Intelligence:** Live capacity tracking at restaurants, attractions, metro stations
- **Cultural Context:** Explains local customs, tipping etiquette, safety protocols by neighborhood
- **Language Assistance:** Translates menus, signs, provides pronunciation guides

#### Workflows & Logic
```
Location Context → Multi-Source Data Aggregation → Sentiment Analysis 
→ Credibility Scoring → Personalization Filter → Contextual Delivery

Data Sources Priority:
1. Instagram geotags (last 24 hours) - Weight: 30%
2. Local WhatsApp community reports - Weight: 25%
3. Transit system APIs - Weight: 15%
4. Police incident data - Weight: 15%
5. Weather micro-sensors - Weight: 10%
6. Reddit r/medellin sentiment - Weight: 5%
```

#### Technical Implementation

**Input Schema:**
```typescript
interface LocalInsiderInput {
  location: {
    lat: number;
    lng: number;
    neighborhood: string;
  };
  query: string; // "Is this area safe?" | "Find hidden restaurants" | "Crowd levels now?"
  userContext: {
    travelStyle: 'luxury' | 'budget' | 'authentic' | 'tourist';
    riskTolerance: 'cautious' | 'moderate' | 'adventurous';
    currentTime: string; // ISO 8601
    tripDates: { start: string; end: string };
  };
}
```

**Gemini 3 Pro Features Used:**
- **Deep Research:** City-specific knowledge bases, local forums, historical data
- **Search Grounding:** Real-time local event/incident monitoring
- **URL Context Tool:** Parse local news sites, community boards, Instagram posts
- **Multimodal Understanding:** Analyze photos from social media for crowd levels, conditions

**Credibility Scoring Algorithm:**
```typescript
interface SourceCredibility {
  source: 'instagram' | 'whatsapp' | 'reddit' | 'police' | 'official';
  dataPoint: string;
  credibilityScore: number; // 0.00 - 1.00
  recency: number; // minutes ago
  verificationLevel: 'verified' | 'crowdsourced' | 'official' | 'unverified';
}

// Example:
// Police report (official, 30 min ago): credibility = 0.95
// Instagram post (verified local, 2 hours ago): credibility = 0.75
// Reddit comment (unverified, 1 day ago): credibility = 0.40
// WhatsApp community (crowdsourced, 45 min ago): credibility = 0.82
```

**Output Schema:**
```typescript
interface LocalInsiderOutput {
  insights: Array<{
    category: 'safety' | 'crowd' | 'culture' | 'hidden_gem' | 'language' | 'timing';
    title: string;
    description: string;
    actionable: boolean;
    recommendation?: string;
    severity?: 'info' | 'warning' | 'alert';
    sources: SourceCredibility[];
  }>;
  neighborhoodScore: {
    safety: number; // 0-100
    authenticity: number;
    touristFriendly: number;
    valueForMoney: number;
    crowdLevel: 'empty' | 'moderate' | 'busy' | 'packed';
  };
  hiddenGems?: Array<{
    name: string;
    type: 'restaurant' | 'cafe' | 'bar' | 'attraction';
    localRating: number;
    touristRating: number; // Often lower due to obscurity
    whySpecial: string;
    distance: number; // meters from user
  }>;
}
```

#### Use Cases & Real-World Examples

**Example 1: Safety Alert - Comuna 13 Evening Visit**
```
USER QUERY: "Planning to visit Comuna 13 at 7 PM, is it safe?"

AGENT ANALYSIS:
- Checks police incident reports (last 7 days)
- Analyzes Instagram geotags (last 24 hours): 23 tourists posted between 9 AM - 4 PM, 0 posts after 6 PM
- Local WhatsApp groups: 3 reports of increased police presence at 6 PM (routine security shift change)
- Tourism board official hours: Recommends visits before 5 PM

INSIGHT GENERATED:
{
  category: 'safety',
  severity: 'warning',
  title: 'Comuna 13 Evening Safety Advisory',
  description: 'Comuna 13 graffiti tours are designed for daytime visits. 
                After 6 PM, tourist infrastructure (guides, security) is reduced. 
                Local residents recommend morning tours (9-11 AM) for best experience 
                and photos.',
  recommendation: 'Reschedule to tomorrow 10 AM. I found a local guide (Maria, 4.9★, 
                   180 tours) with availability. Morning light also better for photos.',
  sources: [
    { source: 'official', credibility: 0.95 },
    { source: 'instagram', credibility: 0.78 },
    { source: 'whatsapp', credibility: 0.82 }
  ]
}

USER ACTION: Accepts reschedule, books morning tour
OUTCOME: Safe, optimal experience + better photos
```

**Example 2: Hidden Restaurant Discovery - Laureles**
```
USER BEHAVIOR: Searching restaurants in Provenza (touristy, expensive)

AGENT INTERVENTION:
"I notice you're looking at Provenza. As a local insider tip, 
Laureles neighborhood (12 min away) has incredible authentic restaurants 
at 40% lower prices. Here's a hidden gem:

**La Provincia** (Laureles)
- 4.9★ from locals (only 127 reviews - not on tourist radar)
- Authentic bandeja paisa: $12 vs. $28 in Provenza
- 80% local clientele (you'll be one of few foreigners)
- Chef Luis trained at El Cielo before opening his own spot
- Verification: I analyzed 50 Instagram posts from verified Medellin residents

Why not on TripAdvisor? Locals don't leave reviews there - they share via WhatsApp.
Want me to book a table?"

DATA SOURCES:
- Instagram: 47 posts from verified locals (high engagement)
- Reddit r/medellin: 8 recommendations in last 6 months
- Local food blogger: "Best kept secret in Medellin" (2 weeks ago)
- Google Maps: 4.9★ but only 127 reviews (credibility: authentic)

USER DECISION: Books La Provincia
RESULT: Authentic experience, saves $50 on dinner for 2
```

**Example 3: Live Crowd Intelligence - Parque Lleras Friday Night**
```
USER INTENT: Planning to go clubbing in Parque Lleras (10 PM)

AGENT REAL-TIME DATA:
- Instagram Stories analysis (last 2 hours): 300+ geotags in 2-block radius
- Transit API: Metro station congestion at 180% capacity
- Club websites: Gusto, Vintrash, Social both show "Limited Capacity" warnings
- Local WhatsApp: Reports of 45-min wait at most clubs

INSIGHT:
"🚨 Parque Lleras is PACKED right now (300+ people in 2-block area).
Average wait: 45 minutes per club reports.

ALTERNATIVE SUGGESTION:
Los Patios neighborhood (15-min Uber, $4)
- Live music venues with no cover
- Current capacity: Moderate (analyzed via Instagram)
- Music style matches your Spotify: Reggaeton + Salsa
- Local secret: Better atmosphere, more dancing, fewer tourists
- Updated 10 minutes ago

Want me to show you venues on the map?"

USER VALUE:
- Avoids 45-min wait + overcrowded scene
- Discovers better experience aligned with preferences
- Saves cover charge ($20/person at Parque Lleras clubs)
```

**Example 4: Cultural Context - Tipping Etiquette**
```
USER LOCATION: First restaurant visit in Medellin

PROACTIVE INSIGHT (triggered by location + first-time visitor flag):
"💡 Local Tip: Colombia Tipping Culture
- Restaurants: 10% tip (propina) often included in bill - check first!
- If not included: 10% is standard, 15% is generous
- Taxis: Round up to nearest 1,000 COP (not percentage-based)
- Tour guides: 10,000-20,000 COP ($2.50-$5) per person
- Hotel staff: 5,000-10,000 COP per service

Fun fact: Colombians tip after receiving change, not by leaving it on the table."

USER BENEFIT:
- Avoids double-tipping mistake (saves $15)
- Cultural awareness = respect from locals
- Confidence in unfamiliar situations
```

#### Actions Triggered
```typescript
// Safety concern detected
EventBus.emit('SAFETY_ADVISORY', {
  location: 'Comuna 13',
  severity: 'warning',
  recommendation: 'Reschedule to daytime',
  alternativeTimes: ['10:00 AM', '2:00 PM']
});

// Hidden gem discovered
EventBus.emit('HIDDEN_GEM_FOUND', {
  venue: 'La Provincia',
  neighborhood: 'Laureles',
  localRating: 4.9,
  touristRating: 'undiscovered',
  savingsVsPopular: 40
});

// Crowd alert
EventBus.emit('CROWD_ALERT', {
  location: 'Parque Lleras',
  crowdLevel: 'packed',
  waitTime: 45,
  alternatives: [...]
});
```

#### Revenue Streams
- **Premium Neighborhood Insights:** $4.99/month per city
- **Sponsored "Local Favorite" Placements:** $500/month per venue (must meet quality threshold)
- **API Access:** $0.02/request for travel apps
- **Data Licensing:** Tourism boards pay for aggregated insights ($30K+/year)

#### Benefits
- **User:** Authentic experiences, avoid tourist traps, enhanced safety, cultural fluency
- **Platform:** 89% user retention when local insights used weekly, NPS score +28 points
- **Partners:** Local businesses gain international exposure without paying for traditional ads

---

### Agent #4: Group Coordination & Polling Agent 👥

**Priority:** HIGH | **Revenue Impact:** MEDIUM | **User Demand:** VERY HIGH

#### Purpose
Manages multi-traveler trips by facilitating democratic decision-making, budget tracking, and preference balancing.

#### Core Capabilities
- **Smart Polling:** Creates AI-generated polls for group decisions with ranked-choice voting
- **Preference Synthesis:** Analyzes individual profiles to suggest options satisfying most members
- **Budget Splitting:** Tracks who owes what, integrates with Venmo/PayPal/Nequi for settlements
- **Consensus Detection:** Identifies when group has implicit agreement without explicit voting
- **Conflict Mediation:** Suggests compromise solutions when preferences diverge

#### Workflows & Logic
```
Trip Created → Members Invited → Preference Collection → AI Analysis 
→ Options Ranking → Automated Polling → Vote Aggregation 
→ Winner Selection → Booking Initiation

Mediation Logic:
- If 3+ members → Weighted voting (trip organizer gets 1.5x weight)
- If budget conflict → Present tiered options (budget/mid/luxury)
- If activity conflict → Time-based splitting ("Group A morning, Group B afternoon")
- If no consensus → Suggest compromise or majority-wins with consolation
```

#### Technical Implementation

**Input Schema:**
```typescript
interface GroupCoordinationInput {
  tripId: string;
  members: Array<{
    userId: string;
    role: 'organizer' | 'member';
    preferences: {
      budget: { min: number; max: number };
      interests: string[];
      dietaryRestrictions: string[];
      mobilityLevel: 'high' | 'moderate' | 'low';
    };
    votingWeight: number; // Default: 1.0, Organizer: 1.5
  }>;
  decision: {
    type: 'restaurant' | 'activity' | 'timing' | 'accommodation';
    options: Array<{
      id: string;
      title: string;
      cost: number;
      pros: string[];
      cons: string[];
    }>;
    deadline: string; // When decision must be made
  };
}
```

**Gemini 3 Pro Features Used:**
- **Gemini Thinking:** Multi-party preference balancing (complex constraint satisfaction)
- **Structured Output:** Poll formatting, voting summaries, budget breakdowns
- **Function Calling:** Payment API integration (Venmo, PayPal, Nequi)

**Consensus Detection Algorithm:**
```typescript
interface ConsensusAnalysis {
  consensusLevel: 'unanimous' | 'strong' | 'moderate' | 'weak' | 'no_consensus';
  winningOption: string;
  votingBreakdown: {
    option: string;
    votes: number;
    percentage: number;
    supporters: string[]; // User IDs
  }[];
  dissenterCount: number;
  mediationNeeded: boolean;
  mediationStrategy?: 'compromise' | 'split_activity' | 'majority_wins' | 'organizer_decides';
}

// Example:
// 8 members voting on dinner
// Option A: 5 votes (62.5%)
// Option B: 3 votes (37.5%)
// Consensus: 'moderate' (no overwhelming majority)
// Mediation: Suggest lunch at Option B, dinner at Option A
```

**Output Schema:**
```typescript
interface GroupCoordinationOutput {
  decision: {
    selectedOption: string;
    consensusLevel: string;
    votingResults: ConsensusAnalysis;
    bookingDetails?: any;
  };
  budgetSplit: {
    totalCost: number;
    perPersonCost: number;
    customSplits?: Array<{
      userId: string;
      amount: number;
      reason?: string; // "Not attending this activity"
    }>;
    paymentRequests: Array<{
      userId: string;
      amount: number;
      method: 'venmo' | 'paypal' | 'nequi';
      status: 'pending' | 'paid';
    }>;
  };
  mediation?: {
    strategy: string;
    compromise: string;
    explanation: string;
  };
}
```

#### Use Cases & Real-World Examples

**Example 1: Bachelorette Party (8 people) - Activity Conflict Resolution**
```
SCENARIO:
- 4 members want clubbing in Parque Lleras
- 4 members want wine tasting in Valle de Aburrá
- Budget: $500 total for activities

AGENT ANALYSIS:
- Detects 50/50 split in preferences
- Identifies no overlap in activity types (high conflict)
- Checks time compatibility: Wine tour (daytime), clubbing (night)

MEDIATION STRATEGY: Time-based splitting
"I notice half the group wants wine tasting, half wants clubbing. 
Good news: We can do both!

📅 COMPROMISE ITINERARY:
**Saturday Afternoon** (2 PM - 6 PM)
Valle de Aburrá Wine Tour - $45/person (all 8 attend)
- Gorgeous scenery, great photos for everyone
- Light activity before evening energy

**Saturday Evening** (9 PM - 1 AM)
Parque Lleras Clubbing - $30/person (optional: 6 confirmed)
- 2 members opting out (wine was their preference)
- Those 2 get extra $30 credit for other activities

💰 BUDGET SPLIT:
- Wine tour: $360 / 8 people = $45 each
- Clubbing: $180 / 6 people = $30 each (2 not attending)
- Total spent: $540 (slight overage, but both groups happy)

VOTE: Approve this plan?"

RESULT:
- 8/8 approve (100% consensus after mediation)
- Both groups get their preferred activity
- Minimal budget overage accepted due to high satisfaction
```

**Example 2: Family Reunion (12 people, ages 8-70) - Multi-Tier Activities**
```
MEMBERS:
- 3 adults (30-45 years) - Want cultural activities
- 2 seniors (65-70 years) - Low mobility, prefer relaxing
- 4 kids (8-14 years) - High energy, want fun activities
- 3 young adults (18-25) - Want nightlife

AGENT ANALYSIS:
- Detects extreme age/interest diversity
- Budget: $1,200 for full day
- Time: 10 AM - 8 PM

PARALLEL ITINERARY SOLUTION:
"🎯 SPLIT ITINERARY FOR MAXIMUM HAPPINESS

**MORNING SESSION** (10 AM - 1 PM)
👶 Kids Group: Parque Explora (interactive science museum)
   - Cost: $15/kid x 4 = $60
   - 1 adult chaperone included

👨‍👩‍👧‍👦 Adults Group: Museo de Antioquia (Botero art collection)
   - Cost: $10/person x 4 = $40
   - Seniors included (wheelchair accessible)

**LUNCH** (1 PM - 2:30 PM)
👨‍👩‍👧‍👦 ALL GROUPS TOGETHER
   - El Rancherito (family-friendly, kid menu)
   - Cost: $25/person x 12 = $300
   - Large outdoor seating area

**AFTERNOON SESSION** (3 PM - 6 PM)
👵 Seniors: Hotel spa & pool time (rest/relax)
   - Included in hotel amenities (no extra cost)

👨‍👩‍👧‍👦 Everyone else: Parque Arví via Metrocable
   - Cost: $12/person x 10 = $120
   - Scenic, low-intensity walking

**EVENING** (8 PM onwards)
🌃 Young adults: Parque Lleras nightlife (optional)
   - Cost: $40/person x 3 = $120
   - Not included in family budget (they pay separately)

💰 TOTAL FAMILY COST: $520 (under $1,200 budget)
✅ Every age group gets activities matching their needs
✅ Shared family meal maintains bonding"

VOTE RESULTS:
- Adults: 6/6 approve
- Kids: 4/4 approve (excited for science museum)
- Seniors: 2/2 approve (love the spa option)
- Consensus: 'unanimous'

BOOKING: Agent proceeds with all reservations
```

**Example 3: Digital Nomad Meetup - Complex Bill Splitting**
```
SCENARIO:
- 6 people, co-working + lunch + coffee over 3 days
- Different people attend different sessions
- Need accurate expense tracking

AGENT TRACKING:
Day 1:
- Co-working space: $15 x 6 = $90 (all attend)
- Lunch: $18 x 6 = $108 (all attend)
- Afternoon coffee: $5 x 4 = $20 (2 people left early)

Day 2:
- Co-working: $15 x 5 = $75 (1 person sick)
- Lunch: $22 x 5 = $110
- Coffee: $5 x 5 = $25

Day 3:
- Co-working: $15 x 6 = $90
- Lunch: $20 x 4 = $80 (2 had other plans)
- Farewell drinks: $30 x 6 = $180

AGENT CALCULATION:
📊 EXPENSE BREAKDOWN BY PERSON:

Alice: $248 (attended everything)
Bob: $248 (attended everything)
Charlie: $228 (left early Day 1, missed Day 3 lunch)
Diana: $233 (missed Day 1 coffee)
Eric: $185 (sick Day 2 - missed co-working + lunch)
Frank: $248 (attended everything)

Total: $1,390

PAYMENT SETTLEMENT:
- Alice paid initial: $400 → Owed back: $152
- Bob paid: $300 → Owed back: $52
- Charlie owes: $228 → Nequi payment request sent
- Diana paid: $250 → Owed back: $17
- Eric owes: $185 → PayPal request sent
- Frank paid: $440 → Owed back: $192

AGENT ACTION:
"I've calculated everyone's share and sent payment requests.
3 people need to pay, 3 will receive refunds.
Nequi/PayPal links sent to each person.

Status tracking:
✅ Charlie paid $228 (3 min ago)
⏳ Eric payment pending
✅ Alice received $152 refund"

RESULT:
- Transparent accounting
- No awkward money conversations
- Settlement completed in 24 hours
```

#### Actions Triggered
```typescript
// Poll created
EventBus.emit('GROUP_POLL_CREATED', {
  tripId: 'uuid',
  pollType: 'restaurant',
  options: [...],
  deadline: '2024-12-20T18:00:00Z'
});

// Consensus reached
EventBus.emit('GROUP_CONSENSUS_REACHED', {
  tripId: 'uuid',
  winningOption: 'Valle de Aburrá Wine Tour',
  consensusLevel: 'strong',
  proceedWithBooking: true
});

// Payment request sent
EventBus.emit('PAYMENT_REQUEST_SENT', {
  userId: 'uuid',
  amount: 228,
  method: 'nequi',
  reason: 'Digital nomad meetup co-working + meals'
});
```

#### Revenue Streams
- **Group Booking Commission:** 5% on total trip value (3.2x higher than solo bookings)
- **Premium Group Features:** $19.99/trip for groups >6 people (polling + payment splitting)
- **Payment Processing Fee:** 1.5% on settlements via platform
- **White-Label for Event Planners:** $499/month for professional organizers

#### Benefits
- **User:** Eliminates planning coordination headaches, transparent expense tracking, democratic decisions
- **Platform:** 3.2x higher booking value for group trips vs. solo ($8,400 avg vs. $2,600)
- **Partners:** Larger guaranteed group bookings, advance notice for capacity planning

---

### Agent #5: Dynamic Event & Entertainment Curator 🎭

**Priority:** HIGH | **Revenue Impact:** HIGH | **User Demand:** HIGH

#### Purpose
Monitors and recommends events, concerts, festivals, sports matches, and pop-up experiences aligned with user interests and travel dates.

#### Core Capabilities
- **Event Aggregation:** Scrapes 200+ sources (Eventbrite, Facebook, venue websites, local flyers)
- **Serendipity Engine:** Recommends "happy accidents" - events user wouldn't search for but would love
- **Last-Minute Deals:** Alerts for discounted day-of tickets to unsold events
- **VIP Experience Matching:** Connects users to exclusive experiences (backstage passes, meet-and-greets)
- **Cultural Calendar:** Highlights festivals, holidays, local celebrations during travel dates

#### Workflows & Logic
```
User Profile Analysis → Event Database Scan → Interest Matching (ML) 
→ Timing Compatibility Check → Availability Verification 
→ Personalized Curation → Booking Integration

Ranking Algorithm:
- Interest match: 40% weight
- Timing compatibility: 25%
- Social proof (reviews/attendance): 20%
- Price/value ratio: 15%
```

#### Technical Implementation

**Input Schema:**
```typescript
interface EventCuratorInput {
  tripDetails: {
    destination: string;
    startDate: string;
    endDate: string;
  };
  userProfile: {
    interests: string[]; // ['football', 'live_music', 'food_festivals']
    musicPreferences?: string[]; // From Spotify integration
    eventHistory: Array<{
      type: string;
      enjoymentRating: number;
    }>;
    priceRange: 'free' | 'budget' | 'mid' | 'premium' | 'luxury';
  };
  preferences: {
    includeSerendipity: boolean; // Suggest unexpected events
    minAdvanceNotice: number; // hours before event
    autoAddToItinerary: boolean;
  };
}
```

**Gemini 3 Pro Features Used:**
- **Search Grounding:** Real-time event discovery across web sources
- **URL Context Tool:** Parse event pages for details, pricing, reviews
- **Deep Research:** Discover local events not listed on major platforms (Facebook groups, local newspapers)
- **Structured Output:** Event metadata normalized to consistent schema

**Event Aggregation Sources:**
```typescript
interface EventSource {
  name: string;
  category: 'official' | 'aggregator' | 'social' | 'local';
  coverage: 'global' | 'regional' | 'local';
  updateFrequency: 'realtime' | 'hourly' | 'daily';
  credibility: number; // 0.00 - 1.00
}

const EVENT_SOURCES: EventSource[] = [
  { name: 'Eventbrite', category: 'aggregator', coverage: 'global', updateFrequency: 'hourly', credibility: 0.90 },
  { name: 'Facebook Events', category: 'social', coverage: 'global', updateFrequency: 'realtime', credibility: 0.75 },
  { name: 'Estadio Atanasio Girardot', category: 'official', coverage: 'local', updateFrequency: 'daily', credibility: 0.95 },
  { name: 'Teatro Pablo Tobón Uribe', category: 'official', coverage: 'local', updateFrequency: 'hourly', credibility: 0.95 },
  { name: 'Local Instagram #MedellinEventos', category: 'social', coverage: 'local', updateFrequency: 'realtime', credibility: 0.60 },
  { name: 'El Colombiano (newspaper)', category: 'local', coverage: 'regional', updateFrequency: 'daily', credibility: 0.85 },
  // ... 194+ more sources
];
```

**Serendipity Engine Algorithm:**
```typescript
interface SerendipityMatch {
  event: Event;
  serendipityScore: number; // 0.00 - 1.00
  reasoning: string;
  interestBridge: string; // How it connects to known interests
}

// Example Logic:
// User loves: ['football', 'photography']
// Event found: 'Drone light show at Estadio Atanasio Girardot'
// Bridge: "You love football venues + photography. This is a tech art show 
//          at your favorite stadium, perfect for unique photos."
// Serendipity Score: 0.78 (not obvious match, but strong connection)
```

**Output Schema:**
```typescript
interface EventCuratorOutput {
  events: Array<{
    id: string;
    title: string;
    type: 'concert' | 'sports' | 'festival' | 'culture' | 'food' | 'nightlife' | 'art';
    date: string;
    time: string;
    venue: {
      name: string;
      location: { lat: number; lng: number };
      address: string;
    };
    pricing: {
      range: string; // "$20-$80"
      tiers: Array<{ name: string; price: number; availability: string }>;
    };
    matchScore: number; // 0.00 - 1.00
    matchReasons: string[];
    serendipityEvent: boolean;
    bookingUrl: string;
    sellOutProbability: number; // From Booking Assistant Agent
    sources: EventSource[];
  }>;
  curatedRecommendations: {
    mustSee: Event[]; // Top 3 highest match scores
    hiddenGems: Event[]; // High serendipity score
    lastMinuteDeals: Event[]; // Discounted tickets
    vipExperiences: Event[]; // Exclusive access
  };
}
```

#### Use Cases & Real-World Examples

**Example 1: Football Match - Predictive Discovery**
```
USER PROFILE:
- Interests: ['football', 'local_culture', 'photography']
- Spotify: Reggaeton, Latin pop
- Trip dates: Jan 14-19, 2026

AGENT DISCOVERY (7 days before trip):
**Atlético Nacional vs. Millonarios**
- Date: Saturday, Jan 16 (during trip)
- Venue: Estadio Atanasio Girardot
- Category: 'Clasico' rivalry match (biggest rivalry in Colombian football)
- Expected atmosphere: 95/100 (based on historical data)

MATCH ANALYSIS:
- Interest match: 0.95 (loves football + local culture)
- Timing: Perfect (Saturday evening, no other major plans)
- Sell-out prediction: 89% probability in 48 hours
- Social proof: 45,000+ stadium capacity, typically sells out
- Price: $60 for Tribuna Norte (best atmosphere section)

SERENDIPITY ELEMENT:
"I notice you love photography. The Tribuna Norte section is where
the most passionate fans gather - incredible photos of flags, 
smoke, choreographed displays. Sit in rows 15-20 for best angle."

AGENT ACTION:
- Sends alert immediately (7 days before trip)
- Creates comparison: $60 now vs. $120+ resale market if sold out
- Offers one-click booking with auto-add to itinerary
- Suggests nearby restaurants for pre-game dinner

USER DECISION: Books tickets immediately
OUTCOME: Attends match, takes viral-worthy photos, shares on Instagram, 
         tags Local Scout → 12 friends see post → 3 sign up for platform
```

**Example 2: Hidden Concert - Maluma Impromptu Set**
```
SCENARIO:
- User favorited reggaeton playlists on Spotify (Maluma is top artist)
- In Medellin Jan 14-19
- No official Maluma concerts during dates

AGENT MONITORING:
- Monitors social media for "secret shows" trend
- Detects Instagram post from Parque Lleras venue: 
  "Special guest tonight 10 PM 👀🎤 #MedellínSurprise"
- Cross-references with Maluma's Instagram location (tagged in Medellin same day)
- Confidence level: 70% probability it's Maluma

AGENT ALERT (sent at 6 PM, 4 hours before show):
"🚨 INSIDER TIP: Strong signals suggest Maluma might play surprise set 
tonight at Vintrash (Parque Lleras) at 10 PM.

Evidence:
- Venue teased 'special guest' + reggaeton emoji
- Maluma posted Instagram story in Medellin today
- Similar surprise show pattern from 2023

CAPACITY: 500 people (vs. 50,000 stadium tour)
TICKETS: $80 at door (if available) vs. $300+ for official tour
RISK: If it's NOT Maluma, still a good night of live music

Want me to secure your spot? I can get you on the list through 
our venue partnership."

USER DECISION: Takes the risk
OUTCOME: It WAS Maluma. Intimate show, incredible experience worth
         $1,000+ in value. User becomes platform evangelist.
```

**Example 3: Feria de las Flores - Cultural Calendar Integration**
```
USER BOOKING: Trip to Medellin, August 5-12, 2026

AGENT AUTOMATIC DETECTION:
"🌺 PERFECT TIMING! You'll be in Medellin during Feria de las Flores
(Flower Festival) - the city's most important cultural celebration.

📅 KEY EVENTS DURING YOUR TRIP:

**Desfile de Silleteros (Flower Parade)** - MUST SEE
- Date: Sunday, Aug 9
- Location: Avenida Guayabal (2.5 km route)
- Time: 8 AM - 4 PM
- What: 500+ flower farmers carry elaborate flower arrangements on their backs
- Cultural significance: UNESCO Intangible Cultural Heritage consideration
- Viewing: Free along route, OR premium seats $45 (elevated view, shade)
- Recommendation: Book premium seats (sells out 1 month early)

**Desfile de Autos Clásicos (Classic Car Parade)**
- Date: Friday, Aug 7
- Free event, great for photos

**Flower Farm Tours**
- Available all week, $35-$60
- Visit farms where silleteros grow flowers
- Hands-on silleta-making workshop

🎫 WHAT I'VE DONE:
- Added all events to your itinerary (tentative, review before confirming)
- Researched best viewing spots for parade photos
- Found flower farm tour with availability (4.9★, small group)

💰 ESTIMATED COSTS:
- Parade seats: $45/person x 2 = $90
- Flower farm tour: $50/person x 2 = $100
- Total: $190 for once-in-a-lifetime cultural experience

This festival only happens once per year. You got lucky with timing!"

USER REACTION:
- Had no idea about the festival
- Books everything immediately
- Adjusts other plans to prioritize festival events
- Shares excitement on social media → drives bookings from friends
```

**Example 4: Last-Minute Deal - Unsold Opera Tickets**
```
SCENARIO:
- User profile: Enjoys classical music (Spotify history)
- In Medellin for 5 days
- Budget: Mid-range ($50-$150/experience)

AGENT MONITORING:
- Teatro Metropolitano has opera performance tonight (8 PM)
- 35% of tickets unsold (unusual for this venue)
- Venue likely to discount at 4 PM to avoid empty seats

AGENT ALERT (3:45 PM same day):
"🎭 LAST-MINUTE OPPORTUNITY: Opera 'La Traviata' tonight

Teatro Metropolitano (Medellín's premier opera house)
- Tonight 8 PM
- Normal price: $120 (orchestra seats)
- Current status: 35% unsold

Based on historical patterns, venue will release $60 discounted tickets 
at 4 PM (15 minutes from now). I can auto-purchase when available.

Why the discount? Thursday night + competing football match.
But this is a WORLD-CLASS production - Colombian National Opera.

Reviews: 4.8★ average, 'Stunning vocals, beautiful staging'

Enable auto-purchase for $60 tickets?"

USER: Enables auto-purchase
AGENT: Secures tickets at 4:02 PM ($60 each, saved $120 total)
OUTCOME: User attends, loves experience, leaves 5-star review
```

#### Actions Triggered
```typescript
// Event discovered
EventBus.emit('EVENT_DISCOVERED', {
  eventId: 'uuid',
  title: 'Atlético Nacional vs. Millonarios',
  matchScore: 0.95,
  sellOutProbability: 0.89,
  recommendationUrgency: 'high'
});

// Serendipity match
EventBus.emit('SERENDIPITY_EVENT', {
  eventId: 'uuid',
  title: 'Maluma surprise show',
  serendipityScore: 0.78,
  confidenceLevel: 0.70,
  requiresUserReview: true
});

// Last-minute deal
EventBus.emit('LAST_MINUTE_DEAL', {
  eventId: 'uuid',
  originalPrice: 120,
  discountedPrice: 60,
  availableQuantity: 45,
  expiresIn: 3600 // seconds
});
```

#### Revenue Streams
- **Event Ticket Commission:** 8-12% per booking ($7.20 on $60 ticket)
- **Sponsored Event Placements:** $1,000/month for featured events
- **Premium Early Access:** $24.99/month for exclusive pre-sale opportunities
- **VIP Concierge Tier:** $99/month for white-glove event booking + backstage access
- **Venue Partnership Program:** Revenue share on group bookings

#### Benefits
- **User:** Discover unmissable local experiences, avoid FOMO, save money on last-minute deals
- **Platform:** $45 average commission per event booking, viral social sharing
- **Partners:** Sell-out challenging time slots, reach hyper-targeted audiences

---

### Agent #6: Restaurant & Dining Orchestrator 🍽️

**Priority:** HIGH | **Revenue Impact:** VERY HIGH | **User Demand:** ESSENTIAL

#### Purpose
Manages entire dining experience from discovery through reservation, order placement, dietary accommodations, and post-meal feedback.

#### Core Capabilities
- **Contextual Recommendations:** Suggests restaurants based on current itinerary context (post-museum lunch, celebration dinner, quick bite)
- **Dietary Intelligence:** Filters for allergies, preferences (vegan, halal, keto), translates restrictions to Spanish
- **Reservation Management:** Books across OpenTable, TheFork, direct restaurant systems, WhatsApp
- **Pre-Ordering:** Allows users to view menus, pre-select dishes, submit dietary notes before arrival
- **Wait Time Prediction:** ML model predicts actual wait times vs. quoted times with 85% accuracy

#### Workflows & Logic
```
Context Detection → Restaurant Database Query → Multi-Factor Ranking 
→ Availability Check → Reservation Booking → Menu Analysis 
→ Pre-Order Facilitation → Experience Tracking → Post-Meal Optimization

Ranking Factors:
- Food quality match to taste profile: 30%
- Location convenience to current/next itinerary item: 25%
- Price alignment with daily budget: 20%
- Ambiance match to occasion: 15%
- Availability: 10%
```

#### Technical Implementation

**Input Schema:**
```typescript
interface DiningOrchestratorInput {
  context: {
    currentLocation?: { lat: number; lng: number };
    nextItineraryItem?: {
      location: { lat: number; lng: number };
      time: string;
    };
    occasion: 'casual' | 'celebration' | 'business' | 'romantic' | 'family' | 'quick_bite';
    timeConstraint?: number; // minutes available for meal
  };
  preferences: {
    cuisine?: string[]; // ['Colombian', 'Italian', 'Asian']
    priceRange: '$' | '$$' | '$$$' | '$$$$';
    ambiance: string[]; // ['rooftop', 'quiet', 'lively', 'outdoor']
    dietary: {
      restrictions: string[]; // ['gluten-free', 'vegan', 'halal']
      allergies: string[];
      severityLevel: 'preference' | 'strict' | 'life_threatening';
    };
  };
  booking: {
    date: string;
    time: string;
    partySize: number;
    specialRequests?: string;
  };
}
```

**Gemini 3 Pro Features Used:**
- **Maps Grounding:** Nearby restaurants with real-time reviews, ratings, photos
- **Search Grounding:** Menu verification, dietary accommodation checks, availability
- **URL Context Tool:** Parse restaurant websites for menus, hours, booking policies
- **Function Calling:** Direct integration with booking APIs
- **Multimodal:** Analyze food photos for dish identification, menu translation via camera

**Contextual Ranking Algorithm:**
```typescript
interface RestaurantScore {
  restaurant: Restaurant;
  totalScore: number; // 0.00 - 1.00
  breakdown: {
    foodQualityMatch: number; // Based on taste profile + historical ratings
    locationConvenience: number; // Distance + travel time to/from itinerary items
    priceAlignment: number; // How well it fits budget
    ambianceMatch: number; // Occasion + atmosphere compatibility
    availabilityBonus: number; // Bonus for immediate availability
  };
  matchReasons: string[];
  warnings?: string[]; // "Popular spot, may have wait" | "Cash only"
}

// Example calculation:
// Post-museum lunch context:
// - User just left Museo de Antioquia (location weight: high)
// - Next: 4 PM Metrocable tour (need quick meal)
// - Occasion: Casual
// - Budget: $$

// Ranking:
// 1. Restaurant 500m away, fast service, $$: Score 0.92
// 2. Restaurant 2km away, slow service, $$$: Score 0.65
```

**Output Schema:**
```typescript
interface DiningOrchestratorOutput {
  recommendations: RestaurantScore[];
  contextualMessage: string; // "You have 90 minutes before your tour. Here are quick-service spots nearby."
  reservationOptions: Array<{
    restaurantId: string;
    availableTimes: string[];
    requiresDeposit: boolean;
    cancellationPolicy: string;
  }>;
  menuPreviews?: Array<{
    restaurantId: string;
    highlights: string[]; // Signature dishes
    dietaryOptions: string[]; // "5 vegan options available"
    priceRange: string; // "$12-$35 per entrée"
  }>;
  preOrderSupport: boolean; // If restaurant supports pre-ordering via platform
}
```

#### Use Cases & Real-World Examples

**Example 1: Gluten-Free Celiac - Advanced Dietary Management**
```
USER PROFILE:
- Severe celiac disease (gluten allergy)
- Traveling to Medellin (first time in Colombia)
- Concern: Communication barrier + kitchen cross-contamination

AGENT CAPABILITIES:
"I've identified 23 restaurants in El Poblado with DEDICATED gluten-free kitchens:

🏆 TOP PICK FOR YOUR CELEBRATION DINNER:
**Carmen Restaurant**
- Dedicated gluten-free prep station (verified via phone call)
- Chef trained in celiac protocols
- 4.9★ rating, 87% of reviews mention dietary accommodations
- Spanish-speaking staff, but I'll pre-notify them in Spanish about your allergy severity

📋 WHAT I'VE PREPARED:
1. Reservation for Saturday 8 PM (confirmed)
2. Pre-sent allergy notification (Spanish):
   'Cliente con enfermedad celíaca SEVERA. Requiere utensilios 
    limpios, superficie de preparación separada, sin contaminación 
    cruzada. Por favor confirmar con el chef antes de servir.'
3. Gluten-free menu items highlighted:
   - Robalo (sea bass): Safe
   - Lomo de res: Safe, but ask for sauce on side
   - Postre: Chocolate flourless torte (always safe)

4. Emergency card in Spanish (downloadable PDF):
   'Tengo alergia severa al gluten. ¿Esta comida contiene trigo, 
    cebada, centeno o avena?'

🚨 SAFETY VERIFICATION:
- I'll call restaurant 24 hours before to re-confirm
- Chef's name: María Gómez (she has celiac family member, extra careful)
- Kitchen inspection score: 98/100 (health department)

Want me to proceed with this booking?"

USER DECISION: Books with confidence
OUTCOME: 
- Zero cross-contamination incidents
- Chef comes to table to personally confirm each dish
- User feels safe traveling internationally with severe allergy
- Leaves emotional 5-star review mentioning platform's care
```

**Example 2: Business Lunch - Time-Constrained Optimization**
```
USER CONTEXT:
- Back-to-back meetings: 11 AM (Poblado) → 2 PM (Poblado)
- 90-minute gap for lunch
- Needs: Professional ambiance, fast service, WiFi for pre-meeting prep

AGENT ANALYSIS:
"I've detected a tight lunch window. Here's your optimized plan:

📍 LOCATION OPTIMIZATION:
Meeting 1: Calle 10 #40-45 (WeWork)
Meeting 2: Calle 7 #43-50 (Client office)
Midpoint: Parque Lleras area (equidistant, 12 min walk from both)

🍽️ BEST OPTION: **Hacienda Junín**
- Distance: 8 min walk from Meeting 1, 10 min to Meeting 2
- Service speed: 28 min average (analyzed 150 reviews)
- Ambiance: Business-appropriate (quiet, professional)
- WiFi: Yes, strong signal (verified via Google reviews)

⏱️ TIMELINE:
11:00 AM: Meeting 1 ends
11:12 AM: Arrive at Hacienda Junín (8-min walk)
11:15 AM: Seated (I pre-ordered, see below)
11:20 AM: Food arrives (28 min prep started at 11:00 when I detected your meeting ending via calendar)
11:45 AM: Finish meal, 15 min for WiFi work
12:00 PM: Depart for Meeting 2
12:10 PM: Arrive 20 min early (buffer for prep)

PRE-ORDER (to save time):
- Bandeja paisa (your favorite, based on history)
- Sparkling water
- Total: $28 (within your $50 lunch budget)

✅ I've coordinated with restaurant:
- Table reserved in quiet corner (you mentioned needing to review notes)
- Food prep starts at 11:00 AM
- Check printed and ready (pay via app, no waiting)

Approve this plan?"

USER: Approves
OUTCOME:
- Arrives exactly on schedule
- Food waiting within 5 minutes
- Uses extra time for meeting prep
- Arrives at Meeting 2 composed and prepared
- Tips generously via app (seamless experience)
```

**Example 3: Romantic Anniversary - Experience Orchestration**
```
USER PROFILE:
- Celebrating 5-year anniversary
- Partner's profile: Loves sunset views, wine, romantic ambiance
- Budget: $$$ (willing to splurge)

AGENT COMPREHENSIVE PLANNING:
"💕 ANNIVERSARY DINNER PERFECTION PLAN

🌅 RESTAURANT: **El Cielo** (Rooftop Level)
- Reservation: Saturday 7:30 PM (golden hour sunset)
- Table: #12 (corner table, best sunset view, verified via Instagram geo-tags)
- Ambiance: Live acoustic guitar (confirmed for that evening)

🍷 PRE-COORDINATED SURPRISES:
1. Champagne on arrival ($45, charged separately - surprise element)
2. Dessert plate with 'Happy 5 Years' in chocolate script
3. Rose petals on table (restaurant standard for celebrations)
4. Photographer: Local Instagram photographer available 8-8:30 PM
   - $80 for 15-min professional couple photos during sunset
   - 20 edited photos delivered within 48 hours
   - (Optional, but HIGHLY recommended for memories)

📸 POST-DINNER ROMANTIC WALK:
- Route: El Cielo → Pueblito Paisa (15-min Uber, $6)
- Timing: Arrive 9 PM (city lights fully on, stunning views)
- Duration: 45 min for photos + romantic stroll
- Return: Uber to hotel 10 PM

💰 TOTAL EXPERIENCE COST:
- Dinner for 2: $280 (estimated)
- Champagne surprise: $45
- Photographer: $80 (optional)
- Transport: $12
- Total: $417 ($497 with photographer)

🎁 SPECIAL TOUCH I ADDED:
- Reached out to your partner's Instagram (public post mentioned 
  loving Colombian coffee). Restaurant chef prepared custom 
  coffee-infused dessert (no extra charge, personal touch from chef).

Want me to book everything? The photographer gets booked fast on weekends."

USER REACTION:
- Emotional that AI remembered partner's coffee love from Instagram
- Books entire experience including photographer
- Partner cries during champagne surprise
- Photos become their Christmas card
- Leaves 5-star review: "Better than hiring a concierge"

OUTCOME:
- Platform generates $497 in bookings
- 8% commission = $39.76
- User becomes lifetime advocate
- Posts photos tagging platform → 15 signups from viral post
```

**Example 4: Family with Picky Eaters - Menu Analysis**
```
SCENARIO:
- Family of 5: 2 adults, 3 kids (ages 5, 8, 12)
- Challenge: Kids are extremely picky eaters
- Parents want authentic Colombian food, kids want "safe" options

AGENT MENU INTELLIGENCE:
"I understand the picky eater challenge. Here's the perfect solution:

🍔 **El Rancherito** (Family-Style Colombian)

WHY IT WORKS:
- Full kids menu (chicken fingers, fries, pasta) for picky eaters
- Authentic Colombian menu for adults (bandeja paisa, ajiaco)
- Large outdoor seating (kids can move around without disturbing others)

📋 MENU STRATEGY FOR YOUR FAMILY:

👨👩 Adults:
- Bandeja paisa (traditional platter): $18
- Ajiaco soup (chicken + 3 potatoes): $14

👧 Kid 1 (Age 5 - Very picky):
- Chicken fingers + fries: $8 (SAFE - plain, no sauce)

👦 Kid 2 (Age 8 - Moderate):
- Pollo asado (grilled chicken, plain): $10
- I've requested no seasoning, very mild

👧 Kid 3 (Age 12 - Adventurous):
- Mini bandeja paisa (kid portion of traditional): $12
- Gateway to trying Colombian food!

💡 PRO TIP I RESEARCHED:
- Reviews mention restaurant is extremely accommodating for kids
- Chef will make any modifications (verified via call)
- High chairs + coloring menus available

🎯 SPECIAL REQUEST I'LL SEND:
'Niños con preferencias limitadas de comida. Por favor, pollo 
simple sin condimentos para niño de 8 años. Chef puede 
modificar platos? Gracias!'

Total: $70 for family of 5 (within your $100 budget)

Reserve for tonight 6 PM?"

USER: Books immediately (relieved to find solution)
OUTCOME:
- Kids eat happily (chicken fingers were perfect)
- Adults enjoy authentic Colombian food
- Family has stress-free meal
- Parents tip 25% (grateful for accommodation)
```

#### Actions Triggered
```typescript
// Restaurant matched
EventBus.emit('RESTAURANT_MATCHED', {
  restaurantId: 'uuid',
  matchScore: 0.92,
  context: 'post_museum_quick_lunch',
  specialAccommodations: ['gluten-free kitchen']
});

// Reservation confirmed
EventBus.emit('RESERVATION_CONFIRMED', {
  bookingId: 'uuid',
  restaurant: 'Carmen',
  date: '2026-01-16',
  time: '20:00',
  specialRequests: ['celiac_notification', 'chef_verification']
});

// Pre-order placed
EventBus.emit('PRE_ORDER_PLACED', {
  bookingId: 'uuid',
  items: ['Bandeja paisa', 'Sparkling water'],
  prepStartTime: '11:00',
  estimatedReadyTime: '11:20'
});
```

#### Revenue Streams
- **Reservation Commission:** 8% per booking ($22.40 on $280 dinner)
- **Pre-Order Facilitation Fee:** $1.50 per transaction
- **Premium Dining Access:** $9.99/month for priority reservations at high-demand restaurants
- **Sponsored Restaurant Placements:** $800/month per restaurant (top-of-list visibility)
- **Menu Translation API:** $0.05/request (licensed to other travel apps)
- **Dietary Accommodation Service:** $2.99/meal for advanced allergy coordination

#### Benefits
- **User:** Stress-free dining, dietary safety, time savings, perfect occasion matches
- **Platform:** $12 average revenue per dining booking (highest margin category)
- **Partners:** Reduced no-shows (deposits via platform), higher per-table revenue (pre-orders), targeted marketing

---

### Agent #7: Temporary Real Estate Scout Agent 🏠

**Priority:** MEDIUM-HIGH | **Revenue Impact:** VERY HIGH | **User Demand:** MEDIUM-HIGH

#### Purpose
Assists digital nomads, extended-stay travelers, and potential expats in finding short-term rentals, co-living spaces, and property investment opportunities.

#### Core Capabilities
- **Neighborhood Matchmaking:** Analyzes lifestyle preferences to recommend ideal neighborhoods
- **Rental Comparison:** Aggregates Airbnb, Booking.com, local agencies, Facebook groups into unified search
- **Virtual Tour Coordination:** Schedules property viewings with bilingual agents via video calls
- **Lease Negotiation:** Provides local market data to help users negotiate monthly rates (average savings: 18%)
- **Expat Integration:** Connects users to utilities setup, bank account guidance, visa consultants

#### Workflows & Logic
```
User Profile (budget/duration/needs) → Neighborhood Analysis 
→ Property Aggregation → ML Ranking → Virtual Tour Booking 
→ Lease Negotiation Support → Move-In Coordination 
→ Local Integration Services

Ranking Algorithm:
- Neighborhood fit score: 35%
- Value for money: 30%
- Amenities match: 20%
- Landlord reliability (reviews): 15%
```

#### Technical Implementation

**Input Schema:**
```typescript
interface RealEstateScoutInput {
  purpose: 'short_term_rental' | 'long_term_rental' | 'relocation_scout' | 'investment';
  budget: {
    monthlyRent: { min: number; max: number };
    currency: 'USD' | 'COP';
  };
  duration: {
    months: number;
    flexibleDates: boolean;
  };
  requirements: {
    bedrooms: number;
    bathrooms: number;
    furnished: boolean;
    workspaceNeeded: boolean; // For digital nomads
    amenities: string[]; // ['wifi', 'gym', 'pool', 'parking', 'coworking']
  };
  lifestyle: {
    workStyle: 'remote_worker' | 'entrepreneur' | 'retired' | 'student';
    socialLevel: 'quiet' | 'moderate' | 'active_nightlife';
    familyStatus: 'solo' | 'couple' | 'family';
    priorities: string[]; // ['safety', 'walkability', 'restaurants', 'nature']
  };
}
```

**Gemini 3 Pro Features Used:**
- **Maps Grounding:** Neighborhood analysis (safety, amenities, transit)
- **Search Grounding:** Real-time rental listings across platforms
- **Deep Research:** Local market reports, expat forums, neighborhood reviews
- **URL Context Tool:** Parse landlord websites, Facebook group listings
- **Gemini Thinking:** Complex neighborhood matching (30+ factors)

**Neighborhood Matching Algorithm:**
```typescript
interface NeighborhoodScore {
  neighborhood: string;
  fitScore: number; // 0.00 - 1.00
  breakdown: {
    safetyScore: number; // Crime data, lighting, police presence
    walkabiity: number; // Transit, grocery, restaurants within 10 min
    socialMatch: number; // Nightlife level vs. user preference
    valueForMoney: number; // Rent per sqm vs. neighborhood average
    expat Friendliness: number; // English speakers, international community
    coworkingAccess: number; // Coworking spaces within 15 min
  };
  prosAndCons: {
    pros: string[];
    cons: string[];
  };
  typicalRent: {
    studio: string;
    oneBed: string;
    twoBed: string;
  };
  neighborhoodVibe: string; // "Family-friendly, quiet, traditional Colombian" | "Party central, young professionals, international"
}

// Example Neighborhoods for Medellin:
// El Poblado: Tourist hub, nightlife, expensive, English-friendly
// Laureles: Middle-class, family-friendly, authentic, moderate price
// Envigado: Quiet, suburban feel, very safe, cheaper, traditional
// Belén: Budget-friendly, local vibe, fewer expats, very authentic
// Sabaneta: Emerging expat hub, modern developments, good value
```

**Output Schema:**
```typescript
interface RealEstateScoutOutput {
  neighborhoodRecommendations: NeighborhoodScore[];
  propertyListings: Array<{
    id: string;
    neighborhood: string;
    type: 'apartment' | 'house' | 'studio' | 'coliving';
    price: number;
    currency: string;
    bedrooms: number;
    bathrooms: number;
    sqm: number;
    amenities: string[];
    photos: string[];
    landlordProfile: {
      name: string;
      rating: number;
      responseTime: string; // "Within 2 hours" | "Within 1 day"
      verified: boolean;
      languages: string[];
    };
    matchScore: number;
    matchReasons: string[];
    virtualTourAvailable: boolean;
    leaseFlexibility: 'strict' | 'negotiable' | 'very_flexible';
  }>;
  marketInsights: {
    averageRent: number;
    pricePerSqm: number;
    negotiationLikelihood: number; // 0-100% probability landlord will negotiate
    bestTimeToNegotiate: string; // "Early in month" | "Last week of month"
  };
  expat Services: Array<{
    service: 'utilities' | 'bank_account' | 'visa' | 'internet' | 'phone';
    provider: string;
    estimatedCost: number;
    setupTime: string;
    assistance Offered: boolean;
  }>;
}
```

#### Use Cases & Real-World Examples

**Example 1: Digital Nomad (3 months) - Neighborhood Comparison**
```
USER PROFILE:
- Budget: $800/month max
- Duration: 3 months (flexible)
- Needs: Strong WiFi, workspace, coworking nearby, moderate nightlife
- Priorities: Safety, walkability, café culture

AGENT ANALYSIS:
"I've compared 5 neighborhoods. Here's what fits YOU:

🏆 BEST MATCH: **Laureles** (Fit Score: 0.91)

WHY LAURELES WINS:
✅ Budget: $700/month avg for 2BR (vs. $1,200 in Poblado)
✅ Coworking: 3 spaces within 10-min walk (Atom House, Selina, WeWork)
✅ WiFi: Fiber optic standard in buildings (50+ Mbps)
✅ Walkability: 95/100 score (grocery, cafés, restaurants, gym all within 5 min)
✅ Nightlife: Moderate (bars/restaurants, but not party central like Poblado)
✅ Safety: 87/100 (well-lit streets, police presence, low crime)
✅ Expat community: 30% foreigners (but not overwhelming)

📊 LAURELES VS. EL POBLADO:
| Factor | Laureles | El Poblado |
|--------|----------|------------|
| Rent | $700 | $1,200 |
| Tourist level | Low | Very High |
| Authenticity | High | Medium |
| Coworking density | 3 | 8 |
| Spanish practice | Excellent | Limited (everyone speaks English) |

🏠 TOP PROPERTY IN LAURELES:
**2BR Apartment - Calle 40**
- $680/month (negotiable to $650 for 3-month commit)
- 65 sqm, fully furnished
- Fiber WiFi (100 Mbps), dedicated workspace nook
- Building: Pool, gym, rooftop terrace
- Landlord: Ana (4.9★, 23 reviews, responds within 1 hour, speaks English)
- 5-min walk to Atom House coworking
- Available Jan 10 (your dates)

📸 VIRTUAL TOUR:
I've scheduled video call with Ana for tomorrow 3 PM your time.
I'll join the call to translate if needed.

💡 NEGOTIATION STRATEGY:
- Ana's last 2 tenants stayed 6+ months (she values stability)
- Offer: $650/month IF you commit to 3 months upfront
- Likelihood of acceptance: 85% (based on her history)
- Savings: $150 total

🌎 EXPAT SUPPORT PACKAGE (optional $99):
- Utilities setup (electricity, water, gas): I'll call providers
- Bank account: Connect you with Bancolombia expat specialist
- Phone/internet: Negotiate better rate than tourist plans (save $20/month)
- WhatsApp communities: Add you to digital nomad groups
- Welcome package: Local SIM, transit card, neighborhood guide

Want me to book the virtual tour and start negotiation?"

USER DECISION: Books tour + expat package
OUTCOME:
- Negotiates to $650/month (saves $150)
- Moves in seamlessly with all utilities ready
- Joins expat WhatsApp groups (makes 5 friends first week)
- Stays 6 months instead of 3 (loves neighborhood)
- Brings 4 friends to platform (referral commission)
```

**Example 2: Relocation Scout (7-day "try before you move" trip)**
```
USER PROFILE:
- Considering permanent move from US to Medellin
- Trip: 7 days to "test" different neighborhoods
- Budget: Flexible (wants to experience accurately)
- Family: Couple, no kids, 35-40 years old
- Priorities: Safety, healthcare access, expat community

AGENT CUSTOMIZED ITINERARY:
"🔍 MEDELLIN RELOCATION SCOUTING ITINERARY

I've created a 'neighborhood sampling' plan so you experience life in 
each area authentically:

📅 7-DAY IMMERSION SCHEDULE:

**Days 1-2: El Poblado** (Tourist/Expat Hub)
- Stay: Airbnb 2BR ($90/night - your baseline for comparison)
- Daytime: Work from Selina coworking (test digital nomad life)
- Evening: Parque Lleras nightlife experience
- Real estate tour: View 3 apartments ($1,200-$1,800/month range)
- Healthcare: Tour hospital Pablo Tobón (English-speaking doctors)
- Expat meetup: Thursday drinks with Americans in Poblado Facebook group

**Days 3-4: Laureles** (Middle-Class Authentic)
- Stay: Local Airbnb ($60/night - 33% cheaper)
- Daytime: Cowork at Atom House, lunch at local restaurants (no English menus)
- Evening: Laureles nightlife (locals' scene vs. tourist)
- Real estate tour: View 3 apartments ($700-$900/month range)
- Walkability test: Grocery run, gym visit, café work session
- Cultural immersion: Attend local salsa class

**Days 5-6: Envigado** (Quiet Suburban)
- Stay: Apartment in residential building ($50/night)
- Daytime: Explore parks, family-oriented activities
- Evening: Quiet neighborhood restaurants (very traditional)
- Real estate tour: Houses ($600-$800/month range)
- Healthcare: Local clinic visit (public system, Spanish only)
- Meet locals: Coffee with Envigado expat couple (I'll connect you)

**Day 7: Decision Support**
- Morning: Compare neighborhoods with agent (I've arranged bilingual specialist)
- Afternoon: Revisit your top choice neighborhood
- Evening: Final dinner + debrief

🎯 WHAT I'VE COORDINATED:
- 6 Airbnb bookings (all cancellable, flexibility)
- 9 real estate viewings (3 per neighborhood)
- 2 hospital tours
- 3 expat meetups
- 1 bilingual real estate specialist (no obligation)
- WhatsApp introductions to 5 expats in each neighborhood

📊 COMPARISON DASHBOARD (I'll update daily):
| Neighborhood | Safety | Healthcare | Social | Budget | Overall |
|--------------|--------|------------|--------|--------|---------|
| Poblado | 85 | 95 | 90 | 60 | 82.5 |
| Laureles | 87 | 85 | 75 | 80 | 81.8 |
| Envigado | 92 | 75 | 65 | 90 | 80.5 |

(Scores update based on your daily feedback via app)

💰 TOTAL COST:
- Accommodations: $450 (7 nights)
- Meals: $280 (estimated)
- Transport: $50 (Uber between neighborhoods)
- Real estate agent: Free (commission-based if you rent)
- Total: $780 for complete relocation research

Alternative: Stay in one neighborhood blindly, sign 12-month lease, 
realize it's wrong fit, lose deposit + time.

This trip pays for itself by avoiding 1 bad decision.

Ready to book?"

USER DECISION: Books full itinerary
OUTCOME:
- Discovers Laureles is perfect fit (didn't expect this)
- Signs 12-month lease at $800/month
- Moves permanently 6 weeks later
- Platform earns 10% of first month = $80
- User refers 8 friends considering relocation
```

**Example 3: Investment Property - ROI Analysis**
```
USER PROFILE:
- Looking for rental income property
- Budget: $60K-$100K USD
- Goal: 8%+ annual return via Airbnb rentals
- Timeframe: 5-10 year hold

AGENT INVESTMENT ANALYSIS:
"🏦 MEDELLIN PROPERTY INVESTMENT REPORT

I've analyzed 50+ properties and identified the top opportunity:

🏠 **PROPERTY: 2BR Apartment - Sabaneta**
- Price: $85,000 USD
- Neighborhood: Emerging expat area (20% growth in foreigners last 2 years)
- Size: 68 sqm
- Building: 2019 construction, modern amenities (pool, gym, coworking space)

📊 ROI ANALYSIS:

RENTAL INCOME (Airbnb Short-Term):
- Nightly rate: $55-$70 (based on comp analysis of 15 nearby properties)
- Occupancy rate: 68% (Sabaneta average, vs. 55% citywide)
- Monthly income: $1,150 avg
- Annual income: $13,800

EXPENSES:
- Property tax: $600/year
- HOA fees: $100/month ($1,200/year)
- Utilities (avg): $80/month ($960/year)
- Cleaning/laundry: $15/booking x 20 bookings/month = $300/month ($3,600/year)
- Property management: 15% of income ($2,070/year)
- Maintenance reserve: $1,000/year
- Total annual expenses: $9,430

NET INCOME: $13,800 - $9,430 = $4,370/year
CASH-ON-CASH RETURN: $4,370 / $85,000 = **5.1%**

⚠️ CONSERVATIVE ESTIMATE. Here's upside potential:

OPTIMISTIC SCENARIO (achievable with smart management):
- Nightly rate: $75 (premium furnishing + professional photos)
- Occupancy: 75% (vs. 68% baseline)
- Annual income: $16,425
- Same expenses: $9,430
- Net income: $6,995
- **ROI: 8.2%** ✅ Exceeds your target

🌟 WHY SABANETA IS THE PLAY:
- Proximity to El Poblado (12 min Uber) but 40% cheaper rent
- Metro expansion planned (2026 completion) → Property appreciation
- Digital nomad discovery (still "undiscovered" vs. Poblado/Laureles)
- New coworking spaces opening (3 in last year)
- Government investment: Park renovations, safety improvements

📈 APPRECIATION POTENTIAL:
- Historical: Sabaneta properties appreciated 8% annually (2018-2023)
- Forecast: 10-12% annually next 3 years (metro completion catalyst)
- 5-year projection: $85K → $135K (58% appreciation)

🎯 TOTAL 5-YEAR RETURN:
- Rental income: $34,850 (cumulative)
- Appreciation: $50,000 (estimated)
- Total gain: $84,850
- Total return: **99.8%** over 5 years (15% annualized)

🤝 NEXT STEPS I'LL FACILITATE:
1. Virtual property tour (scheduled for Wednesday 2 PM)
2. Connect with bilingual real estate attorney ($500 flat fee)
3. Introduce property manager (Airbnb specialist, 15% commission)
4. Bank financing options (Colombian banks offer mortgages to foreigners)
5. Tax implications consultation (US + Colombia)

💰 ADDITIONAL OPTION:
- Cash purchase: $85K
- OR finance: 30% down ($25,500), finance $59,500 at 8% over 15 years
  - Monthly payment: $568
  - Net rental income after mortgage: $582/month
  - Infinite return (positive cash flow from day 1)

Want me to schedule the tour and attorney consultation?"

USER DECISION: Schedules tour + attorney
OUTCOME:
- Purchases property 6 weeks later
- Platform earns 3% of sale: $2,550
- User becomes investor client (buys 2 more properties via platform over 2 years)
- Lifetime value: $7,650 in commissions
```

#### Actions Triggered
```typescript
// Neighborhood matched
EventBus.emit('NEIGHBORHOOD_MATCHED', {
  neighborhood: 'Laureles',
  fitScore: 0.91,
  reasons: ['budget_fit', 'coworking_access', 'expat_community']
});

// Property tour scheduled
EventBus.emit('PROPERTY_TOUR_SCHEDULED', {
  propertyId: 'uuid',
  landlord: 'Ana',
  scheduledTime: '2024-12-21T15:00:00Z',
  virtual: true
});

// Investment opportunity
EventBus.emit('INVESTMENT_OPPORTUNITY', {
  propertyId: 'uuid',
  roi: 8.2,
  appreciationPotential: 58,
  totalReturn5Year: 99.8
});
```

#### Revenue Streams
- **Rental Booking Commission:** 10% of first month's rent ($70 on $700/month)
- **Long-Term Rental Referral:** $250 per signed lease (6+ months)
- **Property Purchase Commission:** 3% of sale price ($2,550 on $85K property)
- **Expat Service Bundle:** $199 for utilities/banking/visa support (one-time)
- **Neighborhood Report Premium Content:** $14.99 per detailed relocation guide
- **Recurring: Property Management:** 5% of monthly rent for platform-facilitated properties

#### Benefits
- **User:** Avoid tourist-priced rentals, safe neighborhood selection, local expertise, investment confidence
- **Platform:** $125 average commission per rental, $2,550 per property sale (very high LTV)
- **Partners:** Pre-qualified international clients for local real estate agents, consistent pipeline

---

### Agent #8: Adaptive Budget Guardian Agent 💰

**Priority:** MEDIUM-HIGH | **Revenue Impact:** MEDIUM | **User Demand:** HIGH

#### Purpose
Monitors trip spending in real-time, provides alerts when nearing limits, and dynamically reallocates budget across categories based on actual spending patterns.

#### Core Capabilities
- **Real-Time Expense Tracking:** Integrates with credit cards, receipt scanning, manual entry
- **Category-Based Budgeting:** Allocates across lodging, dining, activities, transport, shopping
- **Predictive Spending:** Forecasts total trip cost based on current trajectory with 92% accuracy
- **Smart Reallocation:** Suggests moving unused budget from one category to another
- **Savings Finder:** Identifies cheaper alternatives when approaching budget limits

#### Workflows & Logic
```
Budget Setup → Expense Monitoring → Category Tracking 
→ Threshold Detection → Reallocation Recommendations 
→ Alternative Suggestions → Post-Trip Analysis

Alert Tiers:
- 75% of category budget → Yellow alert, suggest monitoring
- 90% of category budget → Orange alert, recommend alternatives
- 100% of category budget → Red alert, present low-cost options
- On track to exceed total budget → Emergency mode
```

#### Technical Implementation

**Input Schema:**
```typescript
interface BudgetGuardianInput {
  tripId: string;
  totalBudget: number;
  currency: string;
  categoryAllocations: {
    lodging: number; // percentage or amount
    dining: number;
    activities: number;
    transport: number;
    shopping: number;
    emergency: number; // Recommended 10-15%
  };
  currentSpending: {
    category: string;
    amount: number;
    date: string;
    description: string;
  }[];
  tripProgress: {
    daysElapsed: number;
    daysRemaining: number;
  };
}
```

**Gemini 3 Pro Features Used:**
- **Code Execution:** Budget optimization algorithms, forecasting models
- **Gemini Thinking:** Multi-factor spending pattern analysis
- **Search Grounding:** Find cheaper alternatives when budget threatened
- **Structured Output:** Budget reports, reallocation suggestions

**Predictive Spending Forecast:**
```typescript
interface SpendingForecast {
  projectedTotal: number;
  confidence: number; // 0.00 - 1.00
  breakdown: {
    category: string;
    projected: number;
    allocated: number;
    variance: number; // Positive = under budget, Negative = over budget
    forecastMethod: 'linear' | 'historical_pattern' | 'seasonal_adjusted';
  }[];
  riskLevel: 'safe' | 'caution' | 'danger';
  recommendations: Array<{
    action: 'reduce_spending' | 'reallocate' | 'increase_budget' | 'no_action';
    category: string;
    description: string;
    impact: number; // $ saved or needed
  }>;
}

// Example Forecast:
// Day 3 of 7-day trip
// Dining spent: $250 (allocated: $300 for full trip)
// Current rate: $83/day
// Forecast: $83 x 7 days = $581 (OVER budget by $281)
// Risk: 'danger'
// Recommendation: Switch from restaurants to food markets for next 2 lunches
```

**Output Schema:**
```typescript
interface BudgetGuardianOutput {
  status: 'on_track' | 'approaching_limit' | 'over_budget';
  alerts: Array<{
    category: string;
    severity: 'info' | 'warning' | 'critical';
    message: string;
    currentSpend: number;
    allocated: number;
    percentageUsed: number;
  }>;
  forecast: SpendingForecast;
  alternatives?: Array<{
    originalItem: string;
    alternativeItem: string;
    savings: number;
    qualityTrade off: string; // "Similar quality" | "Slight downgrade" | "Different experience"
  }>;
  reallocationSuggestions?: Array<{
    fromCategory: string;
    toCategory: string;
    amount: number;
    reason: string;
  }>;
  emergencyOptions?: Array<{
    action: string;
    savings: number;
    impact: string;
  }>;
}
```

#### Use Cases & Real-World Examples

**Example 1: Dining Overspending - Course Correction**
```
USER BUDGET:
- Total: $2,000 for 5-day trip
- Dining allocated: $300 ($60/day avg)

CURRENT STATE (Day 3):
- Dining spent: $250 (83% of budget used, 60% of trip completed)
- Trajectory: $83/day x 5 days = $415 (38% over budget)

AGENT ALERT:
"🟡 DINING BUDGET WARNING

You've spent $250 on dining in 3 days ($83/day avg).
At this rate, you'll exceed your dining budget by $115.

📊 CURRENT TRAJECTORY:
- Days remaining: 2
- Budget remaining: $50
- Projected spending: $166 more
- Overage: $116

💡 SMART ADJUSTMENTS (choose one or mix):

**Option 1: Food Market Strategy** (Savings: $80)
- Next 2 lunches: Food markets instead of restaurants
  - Current lunch avg: $25/meal
  - Market lunch: $8-12/meal
  - Savings: $26/lunch x 2 = $52
- Keep dinner plans (those reservations are made)
- New projection: $64 over budget → manageable

**Option 2: Restaurant Downgrades** (Savings: $95)
- Tomorrow's planned dinner: El Cielo ($150 for 2)
  - Alternative: Carmen ($90 for 2, still excellent, 4.8★)
  - Savings: $60
- Keep other meals, but choose $$ instead of $$$ for tomorrow lunch
- Savings: $35 on lunch
- Result: WITHIN BUDGET by $1

**Option 3: Budget Reallocation** (Savings: $0, but legal)
- You're underspending on activities ($120 spent, $400 allocated)
- Transfer $120 from activities to dining
- New dining budget: $420
- Result: On track, but fewer activities

Which approach feels right? I can implement automatically."

USER DECISION: Option 2 (restaurant downgrade)
AGENT ACTION:
- Cancels El Cielo reservation
- Books Carmen for same time
- Sends message: "Carmen is one of Medellin's best. You're not sacrificing 
  quality, just luxury ambiance. Plus you'll save $60."

OUTCOME:
- Stays within budget
- Carmen meal is excellent (user doesn't feel compromise)
- Remaining $50 used for coffee shop work sessions
```

**Example 2: Underspending Opportunity - Budget Upgrade**
```
USER BUDGET:
- Total: $3,000 for 7-day trip
- Activities allocated: $800

CURRENT STATE (Day 5):
- Activities spent: $350 (44% of budget)
- Days remaining: 2

AGENT PROACTIVE ALERT:
"✨ OPPORTUNITY: You have $450 LEFT in activities budget!

You've been conservative with activities. Here's how you could 
maximize your last 2 days:

🎯 UPGRADE OPTIONS:

**Option 1: Premium Coffee Tour** ($120 vs. $45 basic)
- Current plan: Group coffee farm tour
- Upgrade: Private hacienda tour with coffee tasting + lunch
- Why: You LOVE coffee (Spotify history + morning routine patterns)
- Worth it: 4.9★, once-in-a-lifetime experience

**Option 2: Paragliding Over San Felix** ($110)
- Not on original itinerary
- Perfect weather forecast tomorrow
- You have free afternoon slot
- Matches your adventure preferences (based on past trips)

**Option 3: Upgrade Hotel Last Night** ($80 more)
- Current: 3★ hotel
- Upgrade: 5★ El Poblado luxury with rooftop pool
- Celebrate end of trip in style
- Still under budget

💰 FINANCIAL IMPACT:
- Current activities trajectory: $450 unspent (waste of allocated budget)
- If you do Options 1 + 2: $230 spent, $220 still saved
- Total trip spending: Still $220 UNDER overall budget

My recommendation: Do the coffee tour (fits your profile perfectly).
The paragliding is optional but epic for photos.

Want me to book?"

USER DECISION: Books both coffee tour + paragliding
OUTCOME:
- Coffee tour becomes trip highlight
- Paragliding photos get 500+ likes on Instagram (tags platform)
- User feels they maximized trip value
- Spent exactly as planned (smart budgeting, not deprivation)
```

**Example 3: Currency Fluctuation Opportunity**
```
USER BUDGET:
- $2,500 USD for 6-day trip
- Budget set 2 weeks before trip

CURRENT STATE (Day 2):
- USD/COP exchange rate improved 4% since budget creation
- Effective budget increase: $100

AGENT ALERT:
"💱 CURRENCY BONUS: You have extra $100 spending power!

When you set your budget, USD/COP was 4,200.
Today it's 4,370 (4% improvement).

Your $2,500 now has buying power of $2,600.

🎁 BONUS OPTIONS:

**Option 1: Add Experience** ($90)
- Guatapé day trip (you skipped due to budget)
- Now affordable with currency bonus
- Day 4 has free slot

**Option 2: Upgrade Dining** ($80)
- Change 2 lunches from $ to $$
- Better food quality, still within budget

**Option 3: Shopping Buffer** ($100)
- Add to shopping category
- Guilt-free souvenir purchases

**Option 4: Save It**
- Keep as emergency fund
- Use if something unexpected comes up

This is FREE money from exchange rate luck. How do you want to use it?"

USER DECISION: Option 1 (adds Guatapé trip)
OUTCOME:
- Guatapé becomes favorite day of trip
- User wouldn't have considered it without agent alert
- Platform books tour (8% commission on $90 = $7.20)
```

**Example 4: Emergency Budget Crisis - Flight Delay**
```
USER SITUATION:
- Flight home delayed 24 hours (airline's fault)
- Needs extra hotel night: $80
- Current budget: $1,950 spent of $2,000 (only $50 left)
- No emergency fund allocated

AGENT CRISIS MANAGEMENT:
"🚨 FLIGHT DELAY BUDGET EMERGENCY

I see your flight was delayed. You need an extra night.
Here's how we'll cover it without overspending:

💰 EMERGENCY REALLOCATION PLAN:

**CANCELLATIONS (Free to cancel):**
- Tomorrow's cooking class: $65 (refund processing)
- Tomorrow afternoon coffee tour: $35 (rescheduled for free)
- Savings: $100

**DOWNGRADES:**
- Tonight's dinner reservation (El Rancherito, $75 for 2)
  - Change to: La Provincia (excellent local spot, $45 for 2)
  - Savings: $30
  - Note: Still great food, just less touristy

**HOTEL OPTIONS:**
- Option A: Same hotel ($80) - Familiar, easy
- Option B: Budget hotel nearby ($45) - Clean, safe, just for sleeping
- Savings if Option B: $35

📊 FINANCIAL OUTCOME:
- Cancellations + downgrades: $130 recovered
- Hotel need: $80 (Option A) or $45 (Option B)
- Net impact: $50 saved (Option A) or $85 saved (Option B)

🎯 MY RECOMMENDATION: Option A (same hotel)
- You're stressed from flight delay
- Familiar room = less hassle
- Still end trip $50 under budget after covering emergency

I've already:
- ✅ Canceled cooking class (refund in 3-5 days)
- ✅ Rescheduled coffee tour (no charge)
- ✅ Changed dinner reservation (confirmed La Provincia)
- ⏳ Waiting for your approval to book hotel night

Approve?"

USER: Approves (relieved)
OUTCOME:
- Emergency handled without financial stress
- User impressed by proactive problem-solving
- Still ends trip under budget
- Writes review: "Saved my trip when flight delayed"
```

#### Actions Triggered
```typescript
// Budget threshold reached
EventBus.emit('BUDGET_THRESHOLD_REACHED', {
  category: 'dining',
  percentageUsed: 83,
  severity: 'warning',
  projectedOverage: 115
});

// Reallocation recommended
EventBus.emit('BUDGET_REALLOCATION_SUGGESTED', {
  fromCategory: 'activities',
  toCategory: 'dining',
  amount: 120,
  reason: 'Underspending activities, overspending dining'
});

// Currency bonus detected
EventBus.emit('CURRENCY_BONUS_DETECTED', {
  originalRate: 4200,
  currentRate: 4370,
  bonusAmount: 100,
  suggestions: [...]
});
```

#### Revenue Streams
- **Premium Budget Features:** $4.99/month for unlimited trips + advanced forecasting
- **Bank/Credit Card Partnership:** Data integration commissions (API licensing)
- **Affiliate Revenue:** Suggested budget-friendly alternatives generate booking fees
- **Financial API Licensing:** $0.01/forecast request to banking/travel apps
- **Currency Exchange Markup:** 1.5% on platform-facilitated currency conversions

#### Benefits
- **User:** Stay on budget, eliminate post-trip financial stress, optimize spending, discover opportunities
- **Platform:** Increased user trust (56% less churn when budgets managed), sticky retention feature
- **Partners:** More consistent booking volume across price tiers (predictable demand)

---

*[Continuing with Agents #9 and #10 in next message due to length...]*

**Next Agents:**
9. Safety & Crisis Response Agent 🚨
10. Post-Trip Memory & Loyalty Agent 📸

Would you like me to continue with the remaining 2 agents + the other PRD sections (Advanced AI Features, Revenue Models, Implementation Roadmap, etc.)?