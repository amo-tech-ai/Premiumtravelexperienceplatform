# AI Concierge Panel Implementation Guide
## Multi-Step Prompts for Right-Side Floating Panel

**Reference Image:** AI Concierge wireframe with restaurant recommendations

---

## Overview

This document provides step-by-step prompts to implement the **AI Concierge** floating panel for the "I Love Medellín" platform. The system consists of:
- **Floating Panel:** Right-side overlay with AI recommendations
- **Context Engine:** Tracks user behavior and preferences
- **AI Agent Integration:** Provides personalized suggestions
- **Chat Interface:** Natural language interaction
- **Visual Gallery:** Image-based discovery

---

## Phase 1: Base Panel Structure

### Prompt 1.1 - Create Floating Panel Component

```
Create /components/concierge/AIConciergePanel.tsx:

REQUIREMENTS:

Layout:
- Floating panel on right side of screen
- Width: 450px (desktop), 100vw (mobile)
- Height: 100vh
- Fixed position
- Z-index: 50
- Shadow: -8px 0 32px rgba(0,0,0,0.12)
- Background: white
- Border-radius: 16px 0 0 16px (desktop only)

Header:
- Logo: Sparkles icon with emerald gradient
- Title: "AI Concierge"
- Subtitle: "Context Aware • Always here"
- Expand button (top-right, diagonal arrows icon)
- Close button (X icon)
- Height: 72px
- Border-bottom: 1px solid slate-200

Panel States:
- Collapsed (hidden): translateX(100%)
- Open (normal): translateX(0)
- Expanded (full-screen): width 100vw, height 100vh
- Minimized (dock): width 80px, show only icon

Animations:
- Slide in/out: 300ms cubic-bezier(0.4, 0, 0.2, 1)
- Expand: 400ms ease-out
- Backdrop blur when expanded

Props:
- isOpen: boolean
- isExpanded: boolean
- onClose: () => void
- onExpand: () => void
- children: ReactNode
```

### Prompt 1.2 - Navigation Tabs

```
Create /components/concierge/ConciergeTabs.tsx:

TABS STRUCTURE:
| Icon | Label | Badge | Purpose |
|------|-------|-------|---------|
| Clipboard | Tasks | 4 | Active tasks/to-dos |
| Users | Trips | - | Trip planning |
| Sparkles | AI | 12 | AI suggestions (active) |
| Home | Local | - | Local recommendations |
| Map | Explore | - | Map view |

Features:
- Horizontal tab bar below header
- Active tab: emerald-500 color
- Inactive tabs: slate-400
- Badge: Small circle with number (emerald-500 background)
- Badge position: top-right of icon
- Min touch target: 44x44px
- Smooth transitions (200ms)
- Keyboard accessible (Tab + Arrow keys)

Styling:
- Height: 60px
- Padding: 12px 16px
- Border-bottom: 1px solid slate-200
- Active indicator: 3px bottom border (emerald-500)
- Icons: 24px size
- Badge: 18px diameter, white text, 11px font

State Management:
- Track active tab in context
- Persist last active tab in localStorage
- Update URL query param (?tab=ai)

Props:
- activeTab: string
- onTabChange: (tab: string) => void
- badges?: Record<string, number>
```

### Prompt 1.3 - Context Provider

```
Create /context/AIConciergeContext.tsx:

STATE:
- isOpen: boolean
- isExpanded: boolean
- activeTab: 'tasks' | 'trips' | 'ai' | 'local' | 'explore'
- recommendations: Recommendation[]
- pendingTasks: Task[]
- conversationHistory: Message[]
- userContext: UserContext

USER CONTEXT:
- currentLocation: { lat, lng, name }
- currentTime: Date
- recentSearches: string[]
- savedPlaces: string[]
- upcomingTrips: Trip[]
- preferences: {
    budget: 'low' | 'medium' | 'high'
    dietary: string[]
    interests: string[]
    pace: 'relaxed' | 'moderate' | 'packed'
  }

METHODS:
- openPanel(tab?: string)
- closePanel()
- toggleExpand()
- setActiveTab(tab: string)
- addRecommendation(rec: Recommendation)
- dismissRecommendation(id: string)
- addTask(task: Task)
- completeTask(id: string)
- sendMessage(content: string)
- updateUserContext(updates: Partial<UserContext>)

CONTEXT TRACKING:
- Track page visits
- Track search queries
- Track item views (restaurants, events, etc.)
- Track saved items
- Track time of day patterns
- Track location changes

AUTO-TRIGGERS:
- Show recommendations when context changes
- Badge updates when new suggestions arrive
- Notify on task deadlines
- Alert on trip conflicts
```

---

## Phase 2: AI Recommendations Card

### Prompt 2.1 - Recommendation Card Container

```
Create /components/concierge/RecommendationCard.tsx:

CARD STRUCTURE:

Header:
- Icon: Sparkles (gradient: emerald to purple)
- Title: "AI Suggests"
- Agent Label: "Local Scout" (smaller text)
- Status Badge: "Pending" | "Accepted" | "Dismissed"
  - Pending: purple-100 bg, purple-700 text
  - Accepted: emerald-100 bg, emerald-700 text
  - Dismissed: slate-100 bg, slate-500 text

Body:
- Action Suggestion: "Add 3 restaurants to Saturday dinner"
  - Font: medium, 15px, slate-900
  - Line-height: 1.4
- Item List: Scrollable list of suggested items
  - Max height: 300px
  - Overflow-y: auto
  - Smooth scroll

Footer:
- Primary CTA: "Accept All" (emerald button)
- Secondary CTA: "Dismiss" (ghost button)
- Tertiary: "Customize" (text link)

Styling:
- Background: white
- Border: 1px solid slate-200
- Border-radius: 12px
- Padding: 16px
- Shadow: sm on hover (md)
- Margin: 12px 16px

Animation:
- Slide in from top when new
- Pulse badge when status changes
- Collapse smoothly when dismissed

Props:
- recommendation: Recommendation
- onAccept: (id: string, items: string[]) => void
- onDismiss: (id: string) => void
- onCustomize: (id: string) => void
```

### Prompt 2.2 - Recommendation Item

```
Create /components/concierge/RecommendationItem.tsx:

ITEM STRUCTURE (Example: Restaurant Recommendation):

Layout:
- Horizontal layout
- Left: Plus icon in circle (emerald-500 bg)
- Center: Content area
- Right: Chevron or checkbox

Content:
- Name: "Carmen" (font-bold, text-base)
- Category: "Contemporary Colombian" (text-sm, slate-600)
- Price: "•" + "$$$" (amber-500)
- Details: "Saturday, 7:00 PM" (text-sm, emerald-600)

States:
- Default: White background
- Hover: emerald-50 background
- Selected: emerald-100 background, checkmark icon
- Loading: Skeleton shimmer

Features:
- Click to select/deselect
- Swipe left to dismiss (mobile)
- Long-press for details (mobile)
- Keyboard: Space to toggle

Styling:
- Height: 72px
- Padding: 12px
- Border-radius: 8px
- Gap: 12px between elements
- Icon: 32px circle
- Transition: all 150ms

Props:
- item: RecommendationItem
- isSelected: boolean
- onToggle: (id: string) => void
- onDismiss?: (id: string) => void
```

### Prompt 2.3 - Recommendation Types

```
Define recommendation types in /types/concierge.ts:

RECOMMENDATION INTERFACE:
{
  id: string
  type: 'restaurant' | 'activity' | 'event' | 'transport' | 'stay' | 'custom'
  title: string // "Add 3 restaurants to Saturday dinner"
  agent: string // "Local Scout" | "Trip Planner" | "Budget Optimizer"
  status: 'pending' | 'accepted' | 'dismissed' | 'expired'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  items: RecommendationItem[]
  reasoning: string // Why AI suggests this
  context: {
    triggerEvent: string // "User searched for dinner"
    userLocation?: string
    timeRelevant?: string // "Saturday 7pm"
    tripId?: string
  }
  createdAt: string
  expiresAt?: string
  actions: {
    accept: Action
    dismiss: Action
    customize?: Action
  }
}

RECOMMENDATION ITEM:
{
  id: string
  name: string
  category: string
  price?: number
  priceLevel?: '$' | '$$' | '$$$' | '$$$$'
  time?: string
  location?: string
  distance?: string
  rating?: number
  imageUrl?: string
  resourceId?: string // Link to actual listing
}

AI AGENTS:
- Local Scout: Restaurant/café/bar recommendations
- Trip Planner: Itinerary suggestions
- Budget Optimizer: Cost-saving alternatives
- Weather Advisor: Weather-based suggestions
- Conflict Detector: Schedule conflict alerts
- Gap Filler: Suggests activities for free time
```

---

## Phase 3: Content Sections

### Prompt 3.1 - Section Header

```
Create /components/concierge/SectionHeader.tsx:

HEADER STRUCTURE:
- Title: "Recommended Restaurants" (font-bold, text-lg)
- Count: "12 places" (text-sm, slate-600, right-aligned)
- Optional: Filter button (SlidersHorizontal icon)
- Optional: Sort dropdown

Layout:
- Flexbox: space-between
- Height: 48px
- Padding: 12px 16px
- Border-bottom: 1px solid slate-100
- Sticky top when scrolling

Styling:
- Background: white (with backdrop-blur when sticky)
- Z-index: 10
- Transition: shadow on scroll (add shadow when stuck)

Props:
- title: string
- count?: number
- showFilter?: boolean
- onFilterClick?: () => void
- sortOptions?: SortOption[]
```

### Prompt 3.2 - Quick Filter Chips

```
Create /components/concierge/QuickFilters.tsx:

FILTER CHIPS:
| Icon | Label | Type |
|------|-------|------|
| DollarSign | Under $100 | Budget |
| Heart | Date Night | Occasion |
| MapPin | Poblado | Location |
| Clock | Open Now | Time |
| Star | Top Rated | Rating |
| Utensils | Italian | Cuisine |

Features:
- Horizontal scrollable row
- Pills with icons
- Active state: emerald-500 background, white text
- Inactive: white background, slate-600 text, slate-300 border
- Multi-select (budget is single-select)
- Clear all button (appears when filters active)

Styling:
- Height: 36px
- Padding: 8px 14px
- Border-radius: 18px (full pill)
- Gap: 8px
- Font: 13px, medium
- Icon: 16px
- Scroll: hide scrollbar, smooth snap

Interaction:
- Click to toggle
- Keyboard: Tab + Space
- Screen reader: "Filter by Date Night, selected"

Props:
- filters: Filter[]
- activeFilters: string[]
- onFilterChange: (filterId: string) => void
- onClearAll: () => void
```

### Prompt 3.3 - Scrollable Content Area

```
Create /components/concierge/ScrollableContent.tsx:

LAYOUT:
- Flex-1 height (fills remaining space)
- Overflow-y: auto
- Padding: 16px
- Scroll-behavior: smooth

SECTIONS:
1. Active Recommendations (top)
   - AI Suggests cards
   - Stacked vertically
   - Gap: 12px

2. Content List
   - Restaurant items
   - Event items
   - Activity items
   - Gap: 8px

3. Empty State
   - Icon: Sparkles
   - Title: "No recommendations yet"
   - Description: "I'm learning your preferences..."
   - CTA: "Tell me what you like"

SCROLL FEATURES:
- Shadow at top when scrolled (indicates more content above)
- Shadow at bottom when not at end
- Pull-to-refresh (mobile)
- Infinite scroll (load more at bottom)
- Scroll-to-top button (appears after 200px scroll)

LOADING:
- Skeleton cards while loading
- Shimmer animation
- 3-4 skeleton items

Props:
- children: ReactNode
- isLoading?: boolean
- hasMore?: boolean
- onLoadMore?: () => void
```

---

## Phase 4: Chat Interface

### Prompt 4.1 - Chat Input

```
Create /components/concierge/ChatInput.tsx:

INPUT STRUCTURE:
- Textarea (auto-expanding, max 3 lines)
- Placeholder: "Ask about events, stays, or plans..."
- Left: No icon (clean)
- Right: Send button (arrow icon)

Features:
- Auto-resize as user types
- Max height: 100px (then scroll)
- Shift+Enter: New line
- Enter: Send message
- Paste image support
- Voice input button (optional)

Quick Suggestions (below input when empty):
- Chips: "Under $100" | "Date Night" | "Poblado"
- Click chip to insert into input
- Only show when input is focused and empty

Styling:
- Background: slate-50
- Border: 1px solid slate-200
- Border-radius: 12px
- Padding: 12px 16px
- Font: 15px
- Focus: emerald-500 ring

Send Button:
- Position: absolute bottom-right inside input
- Size: 36x36px
- Icon: Arrow-up in circle
- Background: emerald-500
- Disabled when input empty
- Transition: scale on click

Props:
- value: string
- onChange: (value: string) => void
- onSend: (message: string) => void
- placeholder?: string
- quickSuggestions?: string[]
- isLoading?: boolean
```

### Prompt 4.2 - Conversation View

```
Create /components/concierge/ConversationView.tsx:

MESSAGE TYPES:
1. User Message
   - Align right
   - Background: emerald-500
   - Text: white
   - Border-radius: 18px 18px 4px 18px
   - Max-width: 75%

2. AI Message
   - Align left
   - Background: slate-100
   - Text: slate-900
   - Border-radius: 18px 18px 18px 4px
   - Avatar: Sparkles icon (gradient)
   - Max-width: 85%

3. System Message
   - Center aligned
   - Text: slate-500, italic, small
   - No background
   - Example: "Recommendation accepted"

4. Card Message
   - Full-width interactive card
   - Restaurant preview
   - Event preview
   - Quick action buttons

MESSAGE FEATURES:
- Timestamp (show on hover)
- Read receipts
- Typing indicator (3 dots animation)
- Copy text button
- Like/dislike feedback

LAYOUT:
- Reverse column (newest at bottom)
- Padding: 16px
- Gap: 12px
- Auto-scroll to bottom on new message

ANIMATIONS:
- Fade in messages
- Typing indicator pulse
- Smooth scroll

Props:
- messages: Message[]
- isTyping?: boolean
- onMessageAction?: (messageId: string, action: string) => void
```

### Prompt 4.3 - Context Chips Display

```
Create /components/concierge/ContextChips.tsx:

CONTEXT AWARENESS DISPLAY:
Show active context at top of chat:

Examples:
- "Viewing: Carmen Restaurant"
- "Planning: Medellín Trip (Jan 14-19)"
- "Searching: Rooftop bars"
- "Location: El Poblado"

Chip Design:
- Small pill
- Icon + Text
- Background: emerald-50
- Text: emerald-700
- Dismissible (X button)
- Max 3 visible, "+" button for more

Features:
- Auto-update based on user actions
- Clickable to jump to context
- Persist during session
- Clear on logout

Styling:
- Height: 28px
- Padding: 6px 10px
- Border-radius: 14px
- Font: 12px, medium
- Gap: 6px between chips

Props:
- contexts: ContextChip[]
- onDismiss: (id: string) => void
- onChipClick: (id: string) => void
```

---

## Phase 5: Image Gallery

### Prompt 5.1 - Side Gallery

```
Create /components/concierge/ImageGallery.tsx:

LAYOUT:
- Positioned on left side of panel (in expanded mode)
- Width: 300px
- Height: 100vh
- Masonry grid (3 rows, staggered)
- Images: Medellín locations

IMAGES:
- Waterfall scene
- City skyline
- Wine tasting
- Nature views
- Local culture
- Architecture

Features:
- Click image to expand fullscreen
- Lazy loading
- Smooth fade-in
- Parallax scroll (subtle)
- Hover: Scale 1.05, show overlay with title

Overlay:
- Gradient: black to transparent (bottom to top)
- Title: "Comuna 13 Street Art"
- Location: "Comuna 13"
- Icon: MapPin

Styling:
- Border-radius: 12px
- Object-fit: cover
- Aspect ratios: Mix of 3:4, 4:3, 1:1
- Gap: 12px
- Shadow: md

Props:
- images: GalleryImage[]
- onImageClick: (image: GalleryImage) => void
```

### Prompt 5.2 - Lightbox Modal

```
Create /components/concierge/ImageLightbox.tsx:

LIGHTBOX:
- Full-screen overlay
- Background: black/95 with backdrop blur
- Image: Centered, max 90vw x 90vh
- Close button: Top-right (X)
- Navigation: Left/right arrows

Features:
- Swipe to navigate (mobile)
- Escape key to close
- Arrow keys to navigate
- Pinch to zoom
- Double-tap to zoom

Info Overlay:
- Title
- Location
- Description
- "Add to Trip" button
- "Save" button
- "Share" button

Animation:
- Fade in background (200ms)
- Scale image from thumbnail position
- Smooth transitions between images

Props:
- images: GalleryImage[]
- currentIndex: number
- onClose: () => void
- onNavigate: (direction: 'prev' | 'next') => void
```

---

## Phase 6: Panel Interactions

### Prompt 6.1 - Expand/Collapse Animations

```
Implement panel expansion system:

STATES:
1. Closed
   - translateX(100%)
   - Trigger button in corner

2. Normal (450px)
   - translateX(0)
   - Standard panel view

3. Expanded (full-screen)
   - Width: 100vw
   - Show image gallery on left
   - Panel content on right
   - Header spans full width

4. Minimized (dock)
   - Width: 80px
   - Show only icon + badge
   - Hover to show tooltip

TRANSITIONS:
- Closed <-> Normal: 300ms slide
- Normal <-> Expanded: 400ms width + opacity
- Normal <-> Minimized: 250ms width
- Backdrop: 300ms opacity

EXPAND MODE LAYOUT:
+------------------+----------------------+
| Image Gallery    | Panel Content        |
| (300px)          | (Remaining width)    |
|                  |                      |
| [Masonry Grid]   | [Header]             |
|                  | [Tabs]               |
|                  | [Recommendations]    |
|                  | [Chat]               |
+------------------+----------------------+

ANIMATIONS:
- Gallery slides in from left
- Panel content widens smoothly
- Cards re-flow
- Images fade in sequentially

GESTURES:
- Desktop: Click expand button
- Mobile: Swipe up from bottom
- Keyboard: Cmd+K to toggle
```

### Prompt 6.2 - Keyboard Shortcuts

```
Implement keyboard navigation:

SHORTCUTS:
- Cmd/Ctrl + K: Toggle panel
- Cmd/Ctrl + E: Expand panel
- Cmd/Ctrl + M: Minimize panel
- Escape: Close panel
- Tab: Navigate elements
- Arrow Up/Down: Navigate list
- Space: Select item
- Enter: Accept/Send
- Cmd/Ctrl + /: Focus chat input
- 1-5: Switch tabs

FOCUS MANAGEMENT:
- Trap focus within panel when open
- Return focus to trigger when closed
- Skip links for keyboard users
- Visible focus indicators

SCREEN READER:
- Announce panel state changes
- Announce new recommendations
- Label all interactive elements
- Provide context for icons
```

### Prompt 6.3 - Responsive Behavior

```
Implement responsive layouts:

MOBILE (< 768px):
- Full-screen panel (width: 100vw)
- Slide up from bottom
- Bottom sheet style
- Tabs at bottom (navigation)
- Swipe down to close
- No expand mode (always full)

TABLET (768px - 1023px):
- Width: 500px
- Slide from right
- Same features as desktop
- Touch-optimized targets

DESKTOP (>= 1024px):
- Width: 450px (normal)
- Width: 100vw (expanded)
- All features enabled
- Keyboard shortcuts
- Hover states

BREAKPOINT FEATURES:
- Adjust font sizes
- Adjust spacing
- Adjust touch targets
- Show/hide elements
- Reflow content
```

---

## Phase 7: AI Integration

### Prompt 7.1 - Recommendation Engine (Frontend)

```
Create /lib/ai/recommendationEngine.ts:

CONTEXT GATHERING:
Function: gatherUserContext()
Returns: {
  location: { current, recent }
  time: { now, upcoming }
  searches: { recent: string[], trending: string[] }
  savedItems: Item[]
  tripPlans: Trip[]
  preferences: UserPreferences
  behavior: {
    viewHistory: Item[]
    searchPatterns: string[]
    timePatterns: string[]
  }
}

RECOMMENDATION TRIGGERS:
1. Page View
   - Track what user is viewing
   - Suggest related items
   - Example: Viewing restaurant → Suggest nearby bars

2. Search Query
   - Analyze search intent
   - Suggest alternatives
   - Example: Search "rooftop" → Suggest rooftop venues

3. Time-Based
   - Morning: Coffee, breakfast
   - Afternoon: Activities, lunch
   - Evening: Dinner, nightlife
   - Weekend: Day trips

4. Trip Context
   - Has upcoming trip → Suggest activities
   - Empty day in itinerary → Suggest schedule
   - Budget remaining → Suggest within budget

5. Weather
   - Rainy → Indoor activities
   - Sunny → Outdoor activities
   - Hot → Cooling activities (pools, AC cafes)

RECOMMENDATION TYPES:
- Proactive: "You might like..."
- Reactive: "Based on your search for X..."
- Contextual: "Since you're in Poblado..."
- Time-sensitive: "This event starts in 2 hours..."
- Social: "Popular with similar travelers..."

SCORING ALGORITHM:
Each recommendation gets a score (0-100):
- Relevance to context: 30 points
- Match to preferences: 25 points
- Time appropriateness: 20 points
- Distance/convenience: 15 points
- Popularity/rating: 10 points

Sort by score, show top 5-10
```

### Prompt 7.2 - AI Agent Connector (Backend)

```
Create /lib/ai/agentConnector.ts:

AI AGENTS:
1. Local Scout
   - Model: gemini-flash-2.0
   - Purpose: Restaurant/venue recommendations
   - Input: Location, time, preferences
   - Output: Top 5 recommendations with reasoning

2. Trip Planner
   - Model: claude-sonnet-4
   - Purpose: Itinerary generation
   - Input: Trip details, interests, days
   - Output: Day-by-day itinerary

3. Budget Optimizer
   - Model: gemini-pro-2.0
   - Purpose: Find cost-saving alternatives
   - Input: Current selections, budget
   - Output: Cheaper alternatives with quality maintained

4. Conflict Detector
   - Model: gemini-flash-2.0
   - Purpose: Find schedule conflicts
   - Input: Itinerary items with times
   - Output: List of conflicts + suggestions

CONNECTOR FUNCTIONS:

async function callAgent(params: {
  agent: 'local_scout' | 'trip_planner' | 'budget_optimizer' | 'conflict_detector'
  context: UserContext
  prompt: string
  stream?: boolean
}): Promise<AgentResponse>

async function streamRecommendations(params: StreamParams): AsyncGenerator<RecommendationChunk>

function formatAgentPrompt(context: UserContext, query: string): string

PROMPT TEMPLATES:

Local Scout:
"""
You are a local expert for Medellín, Colombia. The user is:
- Located in: {location}
- Time: {time}
- Preferences: {preferences}
- Recent searches: {searches}

Task: Recommend 3 restaurants for {query}

Requirements:
- Match preferences
- Consider time (breakfast/lunch/dinner)
- Within budget
- Nearby ({distance} radius)

Format:
{
  "recommendations": [
    {
      "name": "Restaurant Name",
      "why": "One sentence explaining why this matches",
      "category": "Cuisine type",
      "price": "$$$",
      "bestFor": "Date night",
      "distance": "0.5 mi"
    }
  ]
}
"""

RESPONSE CACHING:
- Cache responses for 5 minutes
- Invalidate on context change
- Use Redis or in-memory cache
```

### Prompt 7.3 - Real-Time Updates

```
Implement real-time recommendation system:

WEBSOCKET CONNECTION:
- Connect to AI agent service
- Subscribe to user's recommendation channel
- Receive push notifications for new suggestions

EVENTS:
1. new_recommendation
   - Payload: Recommendation object
   - Action: Add to panel, show badge

2. recommendation_expired
   - Payload: { id: string }
   - Action: Remove from panel

3. context_change
   - Payload: UserContext
   - Action: Refresh recommendations

4. urgent_alert
   - Payload: Alert object
   - Action: Show notification

UPDATE STRATEGY:
- Debounce context updates (500ms)
- Batch recommendation requests
- Show loading state during fetch
- Optimistic UI updates

OFFLINE HANDLING:
- Cache last recommendations
- Show cached data when offline
- Queue actions for sync
- Reconnect on online event

NOTIFICATION SYSTEM:
- Browser notifications (with permission)
- In-app badge updates
- Toast messages for urgent items
- Email digest (optional, user setting)
```

---

## Phase 8: Data & State Management

### Prompt 8.1 - Local Storage Schema

```
Define localStorage structure:

KEY: 'ilm_concierge_state'
VALUE: {
  isOpen: boolean
  activeTab: string
  dismissedRecommendations: string[]
  acceptedRecommendations: string[]
  conversationHistory: Message[]
  userContext: UserContext
  preferences: {
    autoOpen: boolean
    notifications: boolean
    soundEnabled: boolean
  }
  lastUpdated: string
}

KEY: 'ilm_user_context'
VALUE: {
  location: Location
  recentSearches: string[]
  viewHistory: ViewEvent[]
  savedItems: string[]
  timePatterns: TimePattern[]
}

PERSISTENCE:
- Save on state change (debounced 1s)
- Restore on app load
- Clear on logout
- Encrypt sensitive data

EXPIRATION:
- Recommendations: 24 hours
- Conversation: 7 days
- View history: 30 days
- Preferences: Never (until cleared)
```

### Prompt 8.2 - Context Tracking System

```
Create /lib/tracking/contextTracker.ts:

EVENTS TO TRACK:
1. Page View
   - page: string
   - timestamp: string
   - duration: number
   - scrollDepth: number

2. Search Event
   - query: string
   - results: number
   - clickedResult?: string

3. Item View
   - itemId: string
   - itemType: string
   - viewDuration: number
   - actions: string[]

4. Location Change
   - from: Location
   - to: Location
   - method: 'auto' | 'manual'

5. Trip Interaction
   - tripId: string
   - action: 'create' | 'edit' | 'view' | 'delete'
   - changes: string[]

CONTEXT BUILDER:
Function: buildContext(): UserContext

Aggregates:
- Current page
- Current location
- Current time
- Recent actions (last 10)
- Active trip
- Saved items
- Search history

Updates on:
- Page navigation
- Search submission
- Item save/unsave
- Trip modification
- Location change
- Time intervals (every 15 min)

PRIVACY:
- PII is hashed
- Location rounded to 0.01 degrees
- Search queries anonymized
- No tracking in incognito mode
- User can clear history
```

### Prompt 8.3 - Backend API Endpoints

```
Define API routes for concierge system:

POST /api/concierge/recommendations
Body: {
  context: UserContext
  type: 'restaurant' | 'activity' | 'event'
  filters?: Filters
}
Response: {
  recommendations: Recommendation[]
  reasoning: string
  expiresAt: string
}

POST /api/concierge/chat
Body: {
  message: string
  context: UserContext
  conversationId?: string
}
Response: {
  reply: string
  actions?: Action[]
  conversationId: string
}

POST /api/concierge/accept-recommendation
Body: {
  recommendationId: string
  itemIds: string[]
  tripId?: string
  customizations?: Record<string, any>
}
Response: {
  success: boolean
  tasksCreated: Task[]
}

POST /api/concierge/dismiss-recommendation
Body: {
  recommendationId: string
  reason?: string
}
Response: { success: boolean }

GET /api/concierge/context
Query: { userId: string }
Response: {
  context: UserContext
  activeRecommendations: Recommendation[]
}

WEBHOOK: /api/concierge/webhook
For real-time AI agent updates
```

---

## Phase 9: Polish & Features

### Prompt 9.1 - Empty States

```
Design empty states for each tab:

TASKS TAB (No tasks):
- Icon: Checkbox with sparkles
- Title: "All caught up!"
- Description: "I'll let you know when there's something to do"
- CTA: "Plan a new trip"

AI TAB (No recommendations):
- Icon: Sparkles
- Title: "I'm learning your preferences"
- Description: "Explore Medellín to get personalized suggestions"
- CTA: "Browse restaurants"

TRIPS TAB (No trips):
- Icon: Calendar
- Title: "No trips planned yet"
- Description: "Create a trip to unlock AI-powered planning"
- CTA: "Create trip"

LOCAL TAB (No data):
- Icon: Map
- Title: "Enable location for local tips"
- Description: "I'll show you nearby hidden gems"
- CTA: "Enable location"

CHAT (No conversation):
- Starter prompts:
  - "Find romantic restaurants for Saturday"
  - "What's happening this weekend?"
  - "Plan a day trip to nearby towns"
  - "Suggest activities under $50"
```

### Prompt 9.2 - Loading States

```
Implement skeleton screens:

RECOMMENDATION CARD SKELETON:
- Shimmer header (80px wide)
- Shimmer badge (60px wide)
- Shimmer text (2 lines, varying width)
- 3 shimmer item rows

CHAT LOADING:
- Typing indicator (3 dots animation)
- "AI is thinking..." text
- Pulse animation

CONTENT LOADING:
- 3-4 skeleton cards
- Staggered animation (100ms delay each)

SHIMMER EFFECT:
- Gradient: slate-100 -> slate-200 -> slate-100
- Animation: 1.5s ease-in-out infinite
- Direction: Left to right

NO LOADING SPINNERS:
- Use skeleton screens instead
- Better perceived performance
- Less jarring experience
```

### Prompt 9.3 - Error Handling

```
Error states and recovery:

API ERROR:
- Show error message in place of content
- "Something went wrong" + retry button
- Log error to analytics
- Fallback to cached data if available

NETWORK ERROR:
- Offline banner at top
- "You're offline. Showing cached recommendations."
- Queue actions for sync
- Auto-retry on reconnect

AI AGENT ERROR:
- Show fallback suggestions (rule-based)
- "AI is taking a break, here are some popular picks"
- Still functional, just not personalized

PERMISSION ERROR:
- Location denied: Show city-wide suggestions
- Notifications denied: In-app badges only
- Clear messaging on impact

RATE LIMIT:
- "Too many requests, please wait"
- Show countdown (30 seconds)
- Cache responses more aggressively

ERROR TRACKING:
- Send to Sentry/Bugsnag
- Include context
- Include user actions leading to error
- Include device/browser info
```

### Prompt 9.4 - Accessibility Features

```
Ensure WCAG 2.1 AA compliance:

KEYBOARD NAVIGATION:
- All interactive elements focusable
- Logical tab order
- Visible focus indicators
- Keyboard shortcuts documented

SCREEN READER:
- Semantic HTML (nav, main, aside, article)
- ARIA labels on icon buttons
- ARIA live regions for updates
- Alt text on images
- Announce recommendation changes

COLOR CONTRAST:
- Text: 4.5:1 minimum
- Large text: 3:1 minimum
- Icons: 3:1 minimum
- Test with tools (axe, WAVE)

MOTION:
- Respect prefers-reduced-motion
- Disable animations if requested
- Provide non-animated alternatives

VOICE CONTROL:
- Clear labels on buttons
- Avoid icon-only buttons without labels
- Predictable behavior

ZOOM:
- Support up to 200% zoom
- Text reflows properly
- No horizontal scroll
- Touch targets remain 44x44px minimum
```

---

## Phase 10: Testing & Verification

### Prompt 10.1 - Manual Test Checklist

```
Test all user flows:

□ Panel opens with trigger button/shortcut
□ Panel closes with X button/Escape key
□ Panel expands to full-screen
□ Panel minimizes to dock
□ Tabs switch correctly
□ Badge counts update
□ Recommendations load
□ Items can be selected/deselected
□ Accept all adds items to trip
□ Dismiss removes recommendation
□ Chat input sends message
□ AI responds to messages
□ Quick filters work
□ Context chips display and dismiss
□ Image gallery loads
□ Lightbox opens and navigates
□ Keyboard shortcuts work
□ Touch gestures work (mobile)
□ Offline mode shows cached data
□ Errors display properly
□ Loading states show
□ Empty states show
□ Animations are smooth (60fps)
□ Screen reader announces updates
□ High contrast mode works
□ Zoom to 200% works
```

### Prompt 10.2 - Performance Benchmarks

```
Performance targets:

LOAD TIME:
- Panel open: < 100ms
- Recommendations load: < 500ms
- AI response: < 2s
- Image gallery: < 300ms

INTERACTION:
- Tab switch: < 100ms
- Filter apply: < 200ms
- Scroll: 60fps
- Animation: 60fps

BUNDLE SIZE:
- Panel component: < 50kb gzipped
- AI lib: < 20kb gzipped
- Total: < 150kb initial

MEMORY:
- Idle: < 50MB
- Active (with images): < 150MB
- No memory leaks over 30 min

NETWORK:
- Recommendation fetch: < 500ms
- AI chat: < 2s
- Image lazy load: < 200ms per image

OPTIMIZATION:
- Code splitting by tab
- Lazy load gallery
- Virtualize long lists
- Debounce inputs
- Cache API responses
- Optimize images (WebP, lazy load)
```

### Prompt 10.3 - Integration Testing

```
Test integration points:

WITH TRIP SYSTEM:
□ Accept recommendation adds items to trip
□ Trip context shows in concierge
□ Changes in trip update concierge
□ Conflict detection works

WITH SEARCH:
□ Search queries trigger recommendations
□ Search results influence suggestions
□ Recent searches show in context

WITH USER PROFILE:
□ Preferences affect recommendations
□ Saved items influence suggestions
□ Budget constraints respected

WITH ANALYTICS:
□ Events tracked correctly
□ Context updates logged
□ Errors reported
□ Performance metrics collected

WITH NOTIFICATIONS:
□ New recommendations trigger notifications
□ Urgent alerts show immediately
□ Badge counts sync
□ Push notifications work (if enabled)

AI AGENTS:
□ Local Scout returns valid recommendations
□ Trip Planner generates itineraries
□ Budget Optimizer finds alternatives
□ Conflict Detector identifies issues
□ Responses cached correctly
□ Fallback to rules if AI fails
```

---

## Quick Start (Condensed Prompt)

If you want to implement this in one go:

```
Build the AI Concierge floating panel for "I Love Medellín":

STRUCTURE:
- Floating panel (right side, 450px, slides in/out)
- Header: "AI Concierge" with expand/close buttons
- Tabs: Tasks, Trips, AI (active), Local, Explore
- Main content: Recommendation cards + chat interface

RECOMMENDATION CARD:
- Header: Sparkles icon, "AI Suggests", "Local Scout", "Pending" badge
- Body: "Add 3 restaurants to Saturday dinner"
- List: Carmen, El Cielo, OCLMde (with times, prices, categories)
- Each item: Emerald circle + icon, name, details, hover state
- Footer: "Accept All" button, "Dismiss" button

FEATURES:
- Scrollable content area
- Quick filter chips (Under $100, Date Night, Poblado)
- Chat input at bottom with placeholder
- Image gallery on left (expanded mode)
- Smooth animations (slide, fade, scale)
- Context tracking
- Real-time updates

STYLING:
- Emerald accent colors (#10b981)
- Purple for AI badges (#8b5cf6)
- Amber for prices (#f59e0b)
- Clean, calm, luxury aesthetic
- Soft shadows
- Smooth transitions (300ms)

RESPONSIVE:
- Desktop: 450px panel
- Expanded: Full-screen with gallery
- Mobile: Full-screen bottom sheet

Use existing ILM design system and components where possible.
```

---

## Component File Structure

```
/components/concierge/
  ├── AIConciergePanel.tsx          # Main container
  ├── ConciergeHeader.tsx           # Header with logo, actions
  ├── ConciergeTabs.tsx             # Tab navigation
  ├── RecommendationCard.tsx        # AI suggestion card
  ├── RecommendationItem.tsx        # Individual item in list
  ├── SectionHeader.tsx             # "Recommended Restaurants" header
  ├── QuickFilters.tsx              # Filter chips
  ├── ScrollableContent.tsx         # Main content area
  ├── ChatInput.tsx                 # Message input
  ├── ConversationView.tsx          # Chat messages
  ├── ContextChips.tsx              # Active context display
  ├── ImageGallery.tsx              # Side gallery (expanded)
  ├── ImageLightbox.tsx             # Full-screen image view
  └── types.ts                      # TypeScript types

/context/
  └── AIConciergeContext.tsx        # State management

/lib/ai/
  ├── recommendationEngine.ts       # Frontend recommendation logic
  ├── agentConnector.ts             # Backend AI agent calls
  └── contextTracker.ts             # User context tracking

/hooks/
  ├── useConcierge.ts              # Hook for panel state
  ├── useRecommendations.ts        # Hook for recommendations
  └── useChatbot.ts                # Hook for chat functionality
```

---

## Summary

This guide provides **10 phases** with **35+ detailed prompts** to build a production-ready AI Concierge panel. Follow the phases sequentially, testing after each phase.

**Estimated Timeline:**
- Phase 1-2: 6-8 hours (base structure)
- Phase 3-4: 8-10 hours (content sections, chat)
- Phase 5: 4-6 hours (image gallery)
- Phase 6: 4-6 hours (interactions)
- Phase 7: 8-10 hours (AI integration)
- Phase 8: 6-8 hours (data/state)
- Phase 9: 4-6 hours (polish)
- Phase 10: 4-6 hours (testing)

**Total: ~45-60 hours** for complete implementation

---

**Ready to build!** 🚀✨
