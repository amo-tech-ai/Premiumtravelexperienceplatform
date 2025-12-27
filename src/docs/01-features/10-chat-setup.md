# AI Concierge Chat System

**Status:** Design Complete · Implementation Ready  
**Location:** Right sidebar panel  
**Mode:** Context-aware · Always available

---

## Progress Tracker

```
┌─────────────────────────────────────────────────────────┐
│ Multi-Step Prompt Flow                                  │
├─────────────────────────────────────────────────────────┤
│ 1. Discovery    ━━━━━●━━━━  (Chat suggestions)         │
│ 2. Refinement   ━━━━━●━━━━  (Filter & adjust)          │
│ 3. Preview      ━━━━━●━━━━  (Action cards)             │
│ 4. Confirmation ━━━━━●━━━━  (User approval)            │
│ 5. Execution    ━━━━━●━━━━  (Dashboard update)         │
└─────────────────────────────────────────────────────────┘
```

---

## 1. Purpose & Philosophy

### What It Does
The AI Concierge helps users discover, refine, and plan travel experiences through natural conversation.

### What It Doesn't Do
- Replace the main dashboard
- Auto-execute changes
- Make decisions for users

### Core Principles
- **Calm:** Non-intrusive, always available
- **Transparent:** Always explain "why"
- **Controlled:** User confirms all actions
- **Contextual:** Aware of current view/state

---

## 2. UI/UX Layout

### Container Structure

**Right Sidebar Panel**
- Width: 420px (desktop), 100% (mobile)
- Position: Fixed right, overlays content
- States: Expanded, Collapsed, Hidden
- Background: Soft white with subtle shadow
- Z-index: Above main content

### Header
```
┌─────────────────────────────────────────┐
│ ✦ AI Concierge            [expand] [×] │
│ Context Aware · Always here             │
└─────────────────────────────────────────┘
```

**Elements:**
- Icon: Sparkle/assistant mark
- Title: "AI Concierge"
- Status: Dynamic context indicator
- Controls: Expand, minimize, close

### Navigation Tabs
```
┌─────────────────────────────────────────┐
│  [Trips] [Plans] [Events] [🍴12] [⌂] [📍] │
└─────────────────────────────────────────┘
```

**Tab Badges:**
- Numbers indicate pending suggestions
- Active state shows current context
- Quick switch between content types

### Body (Scrollable)
```
┌─────────────────────────────────────────┐
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ AI Suggests        [Pending]    │   │
│  │ Local Scout                     │   │
│  │                                 │   │
│  │ Add 3 restaurants to Saturday   │   │
│  │                                 │   │
│  │ • Carmen                        │   │
│  │   Contemporary Colombian • $$$  │   │
│  │   Saturday, 7:00 PM             │   │
│  │                                 │   │
│  │ • El Cielo                      │   │
│  │   Fine Dining • $$$$            │   │
│  │   Saturday, 8:30 PM             │   │
│  │                                 │   │
│  │            [Accept All]         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Welcome to Medellín. I am your        │
│  personal concierge. Ask me about      │
│  events, stays, or planning...         │
│                                         │
└─────────────────────────────────────────┘
```

### Footer
```
┌─────────────────────────────────────────┐
│ [$Under $100] [♥Date Night] [📍Poblado] │
│                                         │
│ Ask about events, stays, or plans...    │
│                                    [→]  │
└─────────────────────────────────────────┘
```

**Quick Chips:**
- Context-based suggestions
- Budget, vibe, neighborhood filters
- One-tap refinement

---

## 3. Content Workflows

### Trips Workflow

**User Journey:**
1. User opens "New Trip" or browses existing
2. Chat detects trip context
3. AI suggests: accommodations, dates, neighborhoods
4. User refines with natural language
5. AI previews itinerary structure
6. User confirms → Trip created

**Content Types:**
- Trip overview suggestions
- Neighborhood recommendations
- Duration & timing optimization
- Budget allocation ideas

---

### Plans Workflow

**User Journey:**
1. User has active trip
2. Views empty day or timeline
3. Chat suggests: daily themes, activities, timing
4. User filters by preferences
5. AI shows time-blocked preview
6. User confirms → Day plan populated

**Content Types:**
- Daily themes (Beach Day, Food Tour, Culture)
- Time block suggestions
- Travel time calculations
- Energy level balancing

---

### Events Workflow

**User Journey:**
1. User explores city calendar
2. Chat shows: concerts, festivals, local happenings
3. User asks "anything this weekend?"
4. AI filters by date + preferences
5. Shows event cards with booking status
6. User adds to plan

**Content Types:**
- Upcoming events calendar
- Ticket availability status
- Event conflicts warnings
- Related recommendations

---

### Restaurants Workflow

**User Journey:**
1. User planning dinner time
2. Chat suggests based on: cuisine, budget, location
3. User refines: "something romantic under $100"
4. AI narrows options with explanation
5. Shows reservation times
6. User confirms → Added to Saturday 7pm

**Content Types:**
- Cuisine & vibe matching
- Price range filtering
- Reservation availability
- Location clustering

---

### Stays Workflow

**User Journey:**
1. User sets trip dates
2. Chat suggests neighborhoods
3. User indicates preferences
4. AI shows: hotels, Airbnb, boutique stays
5. Filters by amenities
6. User saves favorites

**Content Types:**
- Neighborhood character profiles
- Stay type recommendations
- Proximity to planned activities
- Price vs. value analysis

---

### Maps Workflow

**User Journey:**
1. User adds multiple locations
2. Chat detects routing opportunity
3. AI suggests optimal order
4. Shows travel times between stops
5. Warns about conflicts
6. User accepts route

**Content Types:**
- Distance calculations
- Traffic time estimates
- Walking vs. driving suggestions
- Clustering opportunities

---

## 4. AI Agents System

### Agent Architecture

```
┌──────────────────────────────────────────┐
│           Event Bus (Central)            │
└──────────────────────────────────────────┘
         ▲         ▲         ▲         ▲
         │         │         │         │
    ┌────┴───┐ ┌──┴───┐ ┌───┴────┐ ┌──┴────┐
    │ Local  │ │Plan  │ │Optimize│ │Explain│
    │ Scout  │ │ner   │ │r       │ │er     │
    └────────┘ └──────┘ └────────┘ └───────┘
         │         │         │         │
         └─────────┴─────────┴─────────┘
                     │
            ┌────────▼────────┐
            │  Chat Interface │
            └─────────────────┘
```

### Agent Responsibilities

| Agent | Input | Processing | Output |
|-------|-------|------------|--------|
| **Local Scout** | User preferences, location context | Searches venues, experiences, local insights | Ranked recommendations with explanations |
| **Planner** | Selected items, time constraints | Organizes into time blocks, checks durations | Structured itinerary preview |
| **Optimizer** | Multiple locations, schedule | Calculates routes, detects conflicts | Warnings, alternative suggestions |
| **Explainer** | Any AI suggestion | Analyzes reasoning behind choices | Human-readable "why this" text |
| **Collaborator** | Shared trip data | Tracks changes, manages permissions | Sync notifications, conflict resolution |
| **Proactive Assistant** | User behavior patterns | Predicts needs, monitors deadlines | Unprompted helpful suggestions |

### Agent Communication Flow

```
User Input
    ↓
Chat Interface
    ↓
Event Bus (broadcasts intent)
    ↓
Relevant Agents (listen & respond)
    ↓
Aggregator (combines responses)
    ↓
Chat Interface (presents options)
    ↓
User Confirmation
    ↓
Action Executor (updates dashboard)
```

---

## 5. Chat Content Types

| Type | Visual Pattern | When Used | Example |
|------|----------------|-----------|---------|
| **Greeting** | Simple text bubble | First interaction, context change | "Welcome to Medellín. I'm your concierge." |
| **Suggestion Card** | Elevated card with icon, status badge | AI proposes action | "Add 3 restaurants to Saturday dinner" |
| **Action Preview** | Highlighted card with details | Before user confirms | Shows restaurant cards with time, price |
| **Tip/Insight** | Subtle info box, no action | Provide context | "Poblado is 15 min from your hotel" |
| **Confirmation** | Button-focused card | Requires user decision | [Accept All] [Customize] [Dismiss] |
| **Status Update** | Inline text with icon | After action completes | "✓ Added 3 restaurants to your plan" |
| **Question** | Input-focused bubble | AI needs clarification | "What time would you like dinner?" |
| **Warning** | Amber accent card | Conflict detected | "⚠ This overlaps with your 7pm reservation" |

---

## 6. Automation Rules

### Context Sync Automations

| Trigger | Detection | Chat Response |
|---------|-----------|---------------|
| User enters Explore view | Page route change | Updates context chips, suggests relevant filters |
| User filters by neighborhood | Filter state change | "Showing Poblado restaurants. Want rooftop options?" |
| User saves multiple items | Save events captured | "I noticed you saved 3 cafés. Group them into a morning?" |
| User creates new trip | Trip creation event | "Let's start planning. What's your travel style?" |
| User views empty day | Calendar view + empty state | "Want me to suggest a theme for Thursday?" |

### Conflict Detection Automations

| Conflict Type | Detection Logic | Chat Alert |
|---------------|-----------------|------------|
| **Time Overlap** | Two events same time slot | "⚠ Dinner at Carmen overlaps with concert at 8pm" |
| **Distance Issue** | Travel time > buffer | "⚠40 min between stops. Want a closer option?" |
| **Budget Exceeded** | Daily total > user limit | "⚠ Today's total is $450. Your budget is $300." |
| **Closed Hours** | Venue hours vs. plan time | "⚠ This museum closes at 5pm, you have it at 6pm" |

### Proactive Suggestions

| Timing | Condition | Suggestion |
|--------|-----------|------------|
| **3 days before trip** | No accommodation booked | "Still need a place to stay. Want recommendations?" |
| **Morning of day** | Empty afternoon block | "You're free after 2pm. Nearby hiking trail?" |
| **After adding 3+ same type** | Pattern detected | "You love coffee shops. Want a café crawl route?" |
| **Weekend in view** | Events available | "Salsa festival this Saturday. Interested?" |

---

## 7. Decision Logic Flow

### User Message Processing

```
User sends message
    ↓
┌─────────────────────────────────┐
│ Is it a question?               │
│ Yes → Route to relevant agent   │
│ No → Check for intent           │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ Read current context:           │
│ • Active trip                   │
│ • Current view (Explore/Plan)   │
│ • Saved items                   │
│ • User preferences              │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ Generate suggestions:           │
│ • Local Scout finds matches     │
│ • Planner organizes timing      │
│ • Optimizer checks feasibility  │
│ • Explainer adds "why" context  │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ Create action preview:          │
│ • Show detailed cards           │
│ • Display time/price/location   │
│ • Add status badges             │
│ • Provide accept/customize btns │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ User confirms?                  │
│ Yes → Update dashboard          │
│ No → Return to suggestions      │
└─────────────────────────────────┘
```

### Suggestion Ranking Logic

**Priority Factors:**
1. **Context relevance** (40%) - Matches current view/trip
2. **User preference history** (30%) - Aligns with past choices
3. **Timing appropriateness** (15%) - Fits schedule constraints
4. **Local popularity** (10%) - High ratings + authentic
5. **Availability** (5%) - Currently bookable/open

**Filtering Rules:**
- Must match user's budget range (if specified)
- Must be within user's preferred neighborhoods
- Must be open during planned time
- Must not conflict with existing plans

---

## 8. User Journey Maps

### First-Time User

```
Step 1: Dashboard Load
    ↓ Chat greets with onboarding
    
Step 2: User browses Explore
    ↓ Chat updates context chips
    
Step 3: User asks "best tacos?"
    ↓ Local Scout suggests 5 options
    
Step 4: User refines "under $20, Poblado"
    ↓ Narrows to 2 options with details
    
Step 5: User clicks "Add to Thursday lunch"
    ↓ Planner shows time preview
    
Step 6: User confirms
    ↓ Dashboard updates, success message
```

### Experienced User (Quick Path)

```
User: "romantic dinner Saturday"
    ↓ Immediate suggestion: 3 restaurants
    ↓ One-tap accept all
    ↓ Added to plan in 5 seconds
```

### Power User (Complex Planning)

```
User: "Full day Saturday: museum morning, lunch Poblado, coffee, dinner Laureles, nightlife"
    ↓ Planner creates time-blocked structure
    ↓ Local Scout fills each block
    ↓ Optimizer checks route & timing
    ↓ Shows full preview with map
    ↓ User adjusts one item
    ↓ Confirms refined version
    ↓ Complete day plan created
```

---

## 9. State Management

### Chat States

| State | Visual | Behavior |
|-------|--------|----------|
| **Idle** | Minimal, greeting text | Monitors context, shows quick chips |
| **Listening** | Input focused, cursor blinking | Waiting for user message |
| **Processing** | Loading indicator | Agents working, brief pause |
| **Suggesting** | Cards expanded | Shows AI recommendations |
| **Awaiting Confirmation** | Buttons highlighted | User must choose action |
| **Executing** | Progress indicator | Updating dashboard |
| **Complete** | Success checkmark | Confirmation message |

### Context Awareness

**Active Context Tracking:**
- Current route (Explore, Plan, Trips, etc.)
- Selected trip ID
- Active date/time view
- Applied filters
- Saved items count
- Recent user actions

**Context Updates Trigger:**
- Route navigation
- Filter changes
- Item save/unsave
- Calendar date selection
- Trip switch

---

## 10. Visual Design System

### Typography
- **Header:** Editorial serif, medium weight
- **Body text:** Clean sans-serif, readable
- **Action labels:** Slightly bolder, clear hierarchy

### Color Palette
- **Primary:** Soft sage/emerald (calm, trustworthy)
- **Background:** Warm white (#FAFAF8)
- **Accent:** Subtle amber for warnings
- **Status badges:** Purple (pending), green (confirmed), gray (neutral)

### Spacing & Rhythm
- Generous padding (16-24px)
- Clear card separation (12px gaps)
- Breathing room around actions

### Shadows & Depth
- Soft, subtle shadows
- Elevated cards for AI suggestions
- No harsh borders

### Motion Principles
- Purposeful, not decorative
- Smooth transitions (200-300ms)
- Directional (shows causality)
- Respects reduced motion preferences

---

## 11. Interaction Patterns

### Quick Chips (Filter Shortcuts)
- One-tap refinement
- Context-aware options
- Visually distinct, pill-shaped
- Limited to 3-4 visible at once

### Suggestion Cards
- Swipe to dismiss (mobile)
- Click to expand details
- Bulk actions available
- Individual item control

### Input Field
- Natural language encouraged
- Voice input option (future)
- Smart autocomplete
- Recent queries accessible

### Confirmation Buttons
- Primary: "Accept All" (full suggestion)
- Secondary: "Customize" (partial/edit)
- Tertiary: "Dismiss" (reject)

---

## 12. Edge Cases & Error States

| Scenario | Chat Behavior |
|----------|---------------|
| **No results found** | "I couldn't find tacos in Poblado under $10. Try $15?" |
| **API failure** | "I'm having trouble connecting. Try again?" |
| **User offline** | "You're offline. I'll save this and help when connected." |
| **Ambiguous request** | "Did you mean dinner or lunch? Let me know." |
| **Too many options** | "I found 47 options. Want to narrow it down?" |
| **Conflicting criteria** | "Luxury and under $50 is tough. Want mid-range instead?" |

---

## 13. Success Metrics

### User Engagement
- Average messages per session
- Suggestion acceptance rate
- Time from question to booking

### AI Performance
- Suggestion relevance score
- Context accuracy
- Response time (< 2 seconds)

### User Satisfaction
- Feature usage frequency
- User feedback ratings
- Task completion rate

---

## 14. Future Enhancements

- **Voice interaction** - Hands-free planning
- **Multi-modal input** - Photo-based search
- **Collaborative chat** - Group trip planning
- **Smart notifications** - Proactive trip updates
- **Learning preferences** - Personalized over time

---

## Implementation Notes

- Chat state persists across sessions
- Messages stored locally (privacy-first)
- Agent responses cached for performance
- Real-time updates via event bus
- Graceful degradation without AI

---

**Last Updated:** December 27, 2024  
**Version:** 1.0  
**Status:** Ready for implementation
