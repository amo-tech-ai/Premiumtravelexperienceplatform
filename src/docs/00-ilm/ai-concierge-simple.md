# AI Concierge Panel - Simplified Implementation
## No Tabs, Pure Chat + Recommendations

**Version:** Simplified  
**Target:** Fast implementation, essential features only

---

## Wireframes

### Desktop Layout (420px Panel)

```
┌──────────────────────────────────────┐ ┌────────────────────────────────────────────┐
│  Main App Content                    │ │  ✨ AI Concierge          Context Aware  ✗│
│                                      │ │────────────────────────────────────────────│
│                                      │ │                                            │
│                                      │ │  ┌──────────────────────────────────────┐ │
│                                      │ │  │ ✨ AI Suggests • Pending             │ │
│                                      │ │  │                                      │ │
│                                      │ │  │ Add 3 restaurants to Saturday dinner │ │
│                                      │ │  │                                      │ │
│                                      │ │  │ ┌─┐ Carmen                          │ │
│  [Your trip content,                 │ │  │ │+│ Contemporary Colombian • $$$    │ │
│   search results,                    │ │  │ └─┘ Saturday, 7:00 PM              │ │
│   home page, etc.]                   │ │  │                                      │ │
│                                      │ │  │ ┌─┐ El Cielo                        │ │
│                                      │ │  │ │+│ Fine Dining • $$$$              │ │
│                                      │ │  │ └─┘ Saturday, 8:00 PM              │ │
│                                      │ │  │                                      │ │
│                                      │ │  │ ┌─┐ OCLMde                          │ │
│                                      │ │  │ │+│ Modern Colombian • $$$          │ │
│                                      │ │  │ └─┘ Saturday, 7:30 PM              │ │
│                                      │ │  │                                      │ │
│                                      │ │  │ [Accept All]  [Dismiss]             │ │
│                                      │ │  └──────────────────────────────────────┘ │
│                                      │ │                                            │
│                                      │ │  ┌──────────────────────────────────────┐ │
│                                      │ │  │ ✨ AI Suggests • Pending             │ │
│                                      │ │  │                                      │ │
│                                      │ │  │ Weekend events you might like        │ │
│                                      │ │  │                                      │ │
│                                      │ │  │ ┌─┐ Rooftop Jazz Night              │ │
│                                      │ │  │ │+│ Live Music • Free               │ │
│                                      │ │  │ └─┘ Friday, 8:00 PM                │ │
│                                      │ │  │                                      │ │
│                                      │ │  │ ┌─┐ Food Market                     │ │
│                                      │ │  │ │+│ Market • $                      │ │
│                                      │ │  │ └─┘ Sunday, 10:00 AM               │ │
│                                      │ │  │                                      │ │
│                                      │ │  │ [Accept All]  [Dismiss]             │ │
│                                      │ │  └──────────────────────────────────────┘ │
│                                      │ │                                            │
│                                      │ │                                          ↕ │
│                                      │ │                                            │
│                                      │ │────────────────────────────────────────────│
│                                      │ │  Ask me anything about Medellín...      ↑ │
│                                      │ │────────────────────────────────────────────│
└──────────────────────────────────────┘ └────────────────────────────────────────────┘
                                                    420px width
```

### Panel Closed State (Trigger Button)

```
┌──────────────────────────────────────────────────────────────┐
│  Main App Content                                            │
│                                                              │
│                                                              │
│                                                              │
│                                                              │
│                                                              │
│                                                              │
│                                                              │
│                                                              │
│                                                              │
│                                                          ┌───┐│
│                                                          │ ✨││  ← Floating trigger button
│                                                          └───┘│     (pulsing if new recs)
└──────────────────────────────────────────────────────────────┘
```

### Mobile Layout (Full-Screen)

```
┌──────────────────────┐
│ ✨ AI Concierge    ✗ │
│──────────────────────│
│                      │
│ ┌──────────────────┐ │
│ │ ✨ AI Suggests   │ │
│ │ • Pending        │ │
│ │                  │ │
│ │ Add 3 restaurants│ │
│ │ to Saturday...   │ │
│ │                  │ │
│ │ ┌─┐ Carmen       │ │
│ │ │+│ Contemporary │ │
│ │ └─┘ Colombian    │ │
│ │     • $$$        │ │
│ │     Sat, 7:00 PM │ │
│ │                  │ │
│ │ ┌─┐ El Cielo     │ │
│ │ │+│ Fine Dining  │ │
│ │ └─┘ • $$$$       │ │
│ │     Sat, 8:00 PM │ │
│ │                  │ │
│ │ ┌─┐ OCLMde       │ │
│ │ │+│ Modern       │ │
│ │ └─┘ Colombian    │ │
│ │     • $$$        │ │
│ │     Sat, 7:30 PM │ │
│ │                  │ │
│ │ [Accept] [Dismiss│ │
│ └──────────────────┘ │
│                      │
│ ┌──────────────────┐ │
│ │ ✨ AI Suggests   │ │
│ │ • Pending        │ │
│ │                  │ │
│ │ Weekend events...│ │
│ │                  │ │
│ │ (scrollable)     │ │
│ └──────────────────┘ │
│                      │
│                    ↕ │
│──────────────────────│
│ Ask me anything...↑ │
└──────────────────────┘
   Full width (100vw)
```

### Chat Conversation View

```
┌────────────────────────────────────────────┐
│  ✨ AI Concierge          Context Aware  ✗│
│────────────────────────────────────────────│
│                                            │
│  (Recommendations above - scrolled up)     │
│                                            │
│  ✨ Hi! I noticed you're planning a trip  │
│     to Medellín. I can help you find      │
│     great restaurants, events, and        │
│     activities. What are you looking for? │
│                                            │
│                                            │
│                   Show me rooftop bars 🗨 │
│                                            │
│  ✨ Great choice! Here are 5 amazing      │
│     rooftop bars in El Poblado:           │
│                                            │
│     [Recommendation card appears above]    │
│                                            │
│                                            │
│        What's the vibe like at Envy? 🗨  │
│                                            │
│  ✨ Envy has a sophisticated, upscale     │
│     vibe with 360° city views...          │
│     • • • (typing)                        │
│                                            │
│────────────────────────────────────────────│
│  [Rooftop bars] [Weekend events] [$50]    │← Quick suggestions
│────────────────────────────────────────────│
│  Ask me anything about Medellín...      ↑ │
└────────────────────────────────────────────┘
```

### Detailed Component Breakdown

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (64px height)                                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │  ✨  AI Concierge              Context Aware         ✗ │ │
│ │ 24px  Font: bold, 18px       Font: 12px, slate-500  24px│ │
│ │       emerald-500                                        │ │
│ └─────────────────────────────────────────────────────────┘ │
│────────────────────────────────────────────────────────────│
│                                                             │
│ CONTENT AREA (flex-1, overflow-y: auto)                     │
│ Background: slate-50                                        │
│ Padding: 16px                                               │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ RECOMMENDATION CARD                                     │ │
│ │ Background: white                                       │ │
│ │ Border: 1px solid slate-200                             │ │
│ │ Border-radius: 12px                                     │ │
│ │ Padding: 16px                                           │ │
│ │ Shadow: sm                                              │ │
│ │                                                         │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ ✨ AI Suggests • Pending                            │ │ │
│ │ │ 16px  12px font  10px   purple-100 bg               │ │ │
│ │ │ emerald→purple  slate-600   purple-700 text         │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │                                                         │ │
│ │ Add 3 restaurants to Saturday dinner                    │ │
│ │ Font: medium, 15px, slate-900                           │ │
│ │                                                         │ │
│ │ ┌───────────────────────────────────────────────────┐   │ │
│ │ │ ┌─┐  Carmen                                       │   │ │
│ │ │ │+│  Contemporary Colombian • $$$ • 0.3 mi        │   │ │
│ │ │ └─┘  Saturday, 7:00 PM                            │   │ │
│ │ │ 32px  Font: bold    slate-600  amber-500 emerald-600│ │
│ │ │ emerald-500                                         │   │ │
│ │ │      circle                                         │   │ │
│ │ └───────────────────────────────────────────────────┘   │ │
│ │                                                         │ │
│ │ (2 more items, same structure)                          │ │
│ │                                                         │ │
│ │ ┌─────────────────┐  ┌──────────────────┐              │ │
│ │ │   Accept All    │  │     Dismiss      │              │ │
│ │ │  emerald-500 bg │  │   ghost button   │              │ │
│ │ │   white text    │  │   slate-600      │              │ │
│ │ │   48px height   │  │                  │              │ │
│ │ └─────────────────┘  └──────────────────┘              │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ (More recommendation cards...)                              │
│                                                             │
│────────────────────────────────────────────────────────────│
│ CHAT INPUT (auto height, min 60px)                         │
│ Background: white                                           │
│ Border-top: 1px solid slate-200                             │
│ Padding: 16px                                               │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │  Ask me anything about Medellín...                   ┌─┐│ │
│ │  Textarea (pill shape)                               │↑││ │
│ │  Border-radius: 22px                                 └─┘│ │
│ │  Padding: 12px 48px 12px 16px                        36px│ │
│ │  Border: 1px solid slate-300                 emerald-500│ │
│ │  Focus: emerald-500 ring                            circle│ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Empty State

```
┌────────────────────────────────────────────┐
│  ✨ AI Concierge          Context Aware  ✗│
│────────────────────────────────────────────│
│                                            │
│                                            │
│                                            │
│                  ✨                        │
│              (slate-300)                   │
│          48px sparkle icon                 │
│                                            │
│           No suggestions yet               │
│         Font: semibold, slate-900          │
│                                            │
│      I'm learning your preferences...      │
│        Font: 14px, slate-500               │
│                                            │
│                                            │
│                                            │
│                                            │
│────────────────────────────────────────────│
│  Ask me anything about Medellín...      ↑ │
└────────────────────────────────────────────┘
```

### Loading State (Skeleton)

```
┌────────────────────────────────────────────┐
│  ✨ AI Concierge          Context Aware  ✗│
│────────────────────────────────────────────│
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ ▓▓▓▓▓▓▓▓ ░░░░░                      │ │
│  │                                      │ │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                   │ │
│  │                                      │ │
│  │ ░ ▓▓▓▓▓▓▓▓▓                          │ │
│  │ ░ ▓▓▓▓▓▓▓▓▓▓▓▓░░░                   │ │
│  │                                      │ │
│  │ ░ ▓▓▓▓▓▓▓▓▓                          │ │
│  │ ░ ▓▓▓▓▓▓▓▓▓▓▓▓░░░                   │ │
│  │                                      │ │
│  │ ▓▓▓▓▓▓▓ ▓▓▓▓▓▓                      │ │
│  └──────────────────────────────────────┘ │
│         ↑ Shimmer animation               │
│    Gradient: slate-100→slate-200          │
│         Duration: 1.5s infinite           │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ ▓▓▓▓▓▓▓▓ ░░░░░                      │ │
│  │ (skeleton card 2)                    │ │
│  └──────────────────────────────────────┘ │
│                                            │
│────────────────────────────────────────────│
│  Ask me anything about Medellín...      ↑ │
└────────────────────────────────────────────┘
```

### Interaction States

```
CARD ITEM - DEFAULT
┌───────────────────────────────────┐
│ ┌─┐  Carmen                       │
│ │+│  Contemporary Colombian • $$$ │  ← Hover: emerald-50 bg
│ └─┘  Saturday, 7:00 PM            │
└───────────────────────────────────┘

CARD ITEM - SELECTED
┌───────────────────────────────────┐
│ ┌─┐  Carmen                       │
│ │✓│  Contemporary Colombian • $$$ │  ← emerald-100 bg
│ └─┘  Saturday, 7:00 PM            │  ← checkmark appears
└───────────────────────────────────┘

CARD ITEM - DISMISSING
┌───────────────────────────────────┐
│ ┌─┐  Carmen                       │
│ │+│  Contemporary Colombian • $$$ │  ← Fading out + scale down
│ └─┘  Saturday, 7:00 PM            │  ← Opacity: 0.5 → 0
└───────────────────────────────────┘  ← Transform: scale(1) → scale(0.95)
```

---

## Overview

Floating AI panel with:
- ✅ Chat interface (bottom)
- ✅ AI recommendations (scrollable above chat)
- ✅ Context awareness
- ❌ NO tabs
- ❌ NO complex navigation
- ❌ NO image gallery (Phase 2 only)

**Goal:** Ship fast, add features later.

---

## Phase 1: Basic Panel (2 Hours)

### Prompt 1.1 - Panel Container

```
Create /components/concierge/AIConciergePanel.tsx

LAYOUT:
- Fixed position, right side of screen
- Width: 420px (desktop), 100vw (mobile)
- Height: 100vh
- Z-index: 50
- Background: white
- Shadow: -8px 0 32px rgba(0,0,0,0.12)
- Border-radius: 16px 0 0 16px (desktop only)

HEADER:
- Height: 64px
- Padding: 16px
- Border-bottom: 1px solid slate-200
- Logo: Sparkles icon (emerald-500)
- Title: "AI Concierge"
- Subtitle: "Context Aware"
- Close button: X icon (top-right)

CONTENT AREA:
- Flex-1 (fills space between header and chat)
- Overflow-y: auto
- Padding: 16px
- Background: slate-50

CHAT INPUT (FIXED BOTTOM):
- Height: auto (min 60px)
- Padding: 16px
- Background: white
- Border-top: 1px solid slate-200
- Textarea with send button

STATES:
- Closed: translateX(100%)
- Open: translateX(0)
- Transition: 300ms ease-out

TRIGGER BUTTON (when closed):
- Fixed bottom-right: 24px
- Size: 56x56px circle
- Background: emerald-500
- Icon: Sparkles
- Shadow: lg
- Pulse animation on new recommendations

Props:
{
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
}
```

---

## Phase 2: Recommendations (2 Hours)

### Prompt 2.1 - Recommendation Card

```
Create /components/concierge/RecommendationCard.tsx

CARD STRUCTURE:
┌─────────────────────────────────────┐
│ ✨ AI Suggests • Pending            │
│                                     │
│ Add 3 restaurants to Saturday dinner│
│                                     │
│ ┌─┐ Carmen                          │
│ │+│ Contemporary Colombian • $$$    │
│ └─┘ Saturday, 7:00 PM               │
│                                     │
│ ┌─┐ El Cielo                        │
│ │+│ Fine Dining • $$$$              │
│ └─┘ Saturday, 8:00 PM               │
│                                     │
│ ┌─┐ OCLMde                          │
│ │+│ Modern Colombian • $$$          │
│ └─┘ Saturday, 7:30 PM               │
│                                     │
│ [Accept All]  [Dismiss]             │
└─────────────────────────────────────┘

HEADER:
- Icon: Sparkles (gradient emerald to purple)
- Text: "AI Suggests"
- Badge: "Pending" (purple-100 bg, purple-700 text)
- Small, 12px font

TITLE:
- Font: medium, 15px
- Color: slate-900
- Margin-bottom: 12px

ITEM LIST:
- Gap: 8px between items
- Each item: 
  - Left: Circle with + icon (emerald-500)
  - Name: Bold
  - Category: text-sm, slate-600
  - Price: amber-500
  - Time: text-sm, emerald-600

FOOTER:
- Flex row, gap: 8px
- Accept All: emerald-500 button
- Dismiss: ghost button

STYLING:
- Background: white
- Border: 1px solid slate-200
- Border-radius: 12px
- Padding: 16px
- Margin-bottom: 12px
- Shadow: sm

INTERACTION:
- Click item to toggle selection (checkmark appears)
- Accept All: Adds all items to trip
- Dismiss: Removes card with fade-out animation

Props:
{
  recommendation: {
    id: string
    title: string
    items: Array<{
      id: string
      name: string
      category: string
      price: string
      time?: string
    }>
  }
  onAccept: (ids: string[]) => void
  onDismiss: (id: string) => void
}
```

### Prompt 2.2 - Recommendation List

```
Create /components/concierge/RecommendationList.tsx

LAYOUT:
- Stack recommendation cards vertically
- Gap: 12px
- Empty state when no recommendations

EMPTY STATE:
- Icon: Sparkles (slate-300)
- Title: "No suggestions yet"
- Description: "I'm learning your preferences..."
- Center aligned
- Padding: 48px 24px

LOADING STATE:
- 2-3 skeleton cards
- Shimmer animation
- Gradient: slate-100 to slate-200

Props:
{
  recommendations: Recommendation[]
  isLoading: boolean
  onAccept: (recId: string, itemIds: string[]) => void
  onDismiss: (recId: string) => void
}
```

---

## Phase 3: Chat Interface (2 Hours)

### Prompt 3.1 - Chat Input

```
Create /components/concierge/ChatInput.tsx

INPUT:
- Textarea (auto-resize, max 3 lines)
- Placeholder: "Ask me anything about Medellín..."
- Min-height: 44px
- Padding: 12px 48px 12px 16px
- Border: 1px solid slate-300
- Border-radius: 22px (pill shape)
- Focus: emerald-500 ring

SEND BUTTON:
- Position: absolute right inside input
- Size: 36x36px circle
- Background: emerald-500
- Icon: Arrow-up
- Disabled when input empty (slate-300)
- Hover: emerald-600

FEATURES:
- Enter to send (Shift+Enter for new line)
- Auto-resize as user types
- Max height: 100px (then scroll)
- Disable while sending

QUICK SUGGESTIONS (above input):
Show when input is empty and focused:
- Chips: "Rooftop bars" | "Weekend events" | "Under $50"
- Horizontal scroll
- Click to insert into input

Props:
{
  value: string
  onChange: (value: string) => void
  onSend: (message: string) => void
  isLoading: boolean
}
```

### Prompt 3.2 - Chat Messages

```
Create /components/concierge/ChatMessages.tsx

MESSAGE TYPES:

1. User Message:
- Align: right
- Background: emerald-500
- Text: white
- Border-radius: 18px 18px 4px 18px
- Max-width: 80%
- Padding: 10px 14px

2. AI Message:
- Align: left
- Background: slate-100
- Text: slate-900
- Border-radius: 18px 18px 18px 4px
- Max-width: 85%
- Padding: 10px 14px
- Avatar: Sparkles icon (16px, left of message)

3. System Message:
- Center aligned
- Text: slate-400, italic, 12px
- Example: "Recommendation sent"

TYPING INDICATOR:
- 3 dots animation
- Slate-400 color
- Shows when AI is responding

LAYOUT:
- Flex column, gap: 8px
- Padding: 16px
- Reverse (newest at bottom)
- Auto-scroll to bottom on new message

Props:
{
  messages: Array<{
    id: string
    type: 'user' | 'ai' | 'system'
    content: string
    timestamp: string
  }>
  isTyping: boolean
}
```

---

## Phase 4: State Management (1 Hour)

### Prompt 4.1 - Context Provider

```
Create /context/AIConciergeContext.tsx

STATE:
{
  isOpen: boolean
  recommendations: Recommendation[]
  messages: Message[]
  isTyping: boolean
  userContext: {
    currentPage: string
    recentSearches: string[]
    savedItems: string[]
    currentTrip?: Trip
  }
}

ACTIONS:
- openPanel()
- closePanel()
- addRecommendation(rec: Recommendation)
- dismissRecommendation(id: string)
- acceptRecommendation(id: string, itemIds: string[])
- sendMessage(content: string)
- addMessage(message: Message)
- updateContext(updates: Partial<UserContext>)

PERSISTENCE:
- Save to localStorage on change
- Key: 'ilm_concierge_state'
- Restore on mount
- Clear on logout

Export:
- useConcierge() hook
- AIConciergeProvider component
```

### Prompt 4.2 - Mock Data

```
Create /data/mockRecommendations.ts

MOCK RECOMMENDATIONS:
[
  {
    id: 'rec-1',
    title: 'Add 3 restaurants to Saturday dinner',
    agent: 'Local Scout',
    status: 'pending',
    items: [
      {
        id: 'rest-1',
        name: 'Carmen',
        category: 'Contemporary Colombian',
        price: '$$$',
        time: 'Saturday, 7:00 PM'
      },
      {
        id: 'rest-2',
        name: 'El Cielo',
        category: 'Fine Dining',
        price: '$$$$',
        time: 'Saturday, 8:00 PM'
      },
      {
        id: 'rest-3',
        name: 'OCLMde',
        category: 'Modern Colombian',
        price: '$$$',
        time: 'Saturday, 7:30 PM'
      }
    ]
  },
  {
    id: 'rec-2',
    title: 'Weekend events you might like',
    agent: 'Event Curator',
    status: 'pending',
    items: [
      {
        id: 'event-1',
        name: 'Rooftop Jazz Night',
        category: 'Live Music',
        price: 'Free',
        time: 'Friday, 8:00 PM'
      },
      {
        id: 'event-2',
        name: 'Food Market',
        category: 'Market',
        price: '$',
        time: 'Sunday, 10:00 AM'
      }
    ]
  }
]

MOCK MESSAGES:
[
  {
    id: 'msg-1',
    type: 'ai',
    content: 'Hi! I noticed you\'re planning a trip to Medellín. I can help you find great restaurants, events, and activities. What are you looking for?',
    timestamp: new Date().toISOString()
  }
]
```

---

## Phase 5: Integration (1 Hour)

### Prompt 5.1 - Add to App

```
Update /App.tsx:

1. Import AIConciergeProvider and wrap app:

import { AIConciergeProvider } from './context/AIConciergeContext';
import { AIConciergePanel } from './components/concierge/AIConciergePanel';

<AIConciergeProvider>
  <div className="relative">
    {/* Existing app content */}
    <Routes>...</Routes>
    
    {/* AI Concierge Panel */}
    <AIConciergePanel />
  </div>
</AIConciergeProvider>

2. Add trigger button (if panel closed):
The panel component handles its own trigger button internally.

3. Load mock data on mount:
Inside AIConciergePanel, useEffect to load mock recommendations.
```

### Prompt 5.2 - Context Tracking

```
Create /hooks/useContextTracking.ts

Track user behavior and update concierge context:

TRACK:
- Page views → Update currentPage
- Search queries → Add to recentSearches
- Item views → Track viewed items
- Saves → Update savedItems
- Trip changes → Update currentTrip

TRIGGER RECOMMENDATIONS:
- After search → Suggest related items
- After save → Suggest similar items
- Time-based → Morning coffee, evening dinner
- Location-based → Nearby suggestions

IMPLEMENTATION:
Use React Router to track navigation:

const location = useLocation();

useEffect(() => {
  updateContext({ currentPage: location.pathname });
}, [location]);

Use custom events:

window.addEventListener('ilm:search', (e) => {
  updateContext({ 
    recentSearches: [e.detail.query, ...recentSearches].slice(0, 5)
  });
});
```

---

## Phase 6: Polish (1 Hour)

### Prompt 6.1 - Animations

```
Add smooth animations:

PANEL SLIDE:
- Closed → Open: translateX(100%) to translateX(0)
- Duration: 300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

CARD ANIMATIONS:
- Appear: Fade in + slide down
- Dismiss: Fade out + scale down
- Duration: 200ms

MESSAGE ANIMATIONS:
- New message: Fade in + slide up
- Duration: 150ms
- Stagger: 50ms delay per message

TRIGGER BUTTON:
- Pulse: Scale 1.05 → 1.0 → 1.05
- Duration: 2s infinite
- Only when has new recommendations

LOADING:
- Shimmer: Gradient sweeps left to right
- Duration: 1.5s infinite
```

### Prompt 6.2 - Responsive Design

```
Responsive breakpoints:

MOBILE (< 768px):
- Width: 100vw
- Height: 100vh
- Border-radius: 0
- Slide from bottom (not right)
- Full-screen always

TABLET (768px - 1023px):
- Width: 420px
- Slide from right
- Same as desktop

DESKTOP (>= 1024px):
- Width: 420px
- Border-radius: 16px 0 0 16px
- Shadow on left side

TOUCH TARGETS:
- Minimum: 44x44px
- Buttons: 48px height
- Input: 44px minimum height
```

### Prompt 6.3 - Accessibility

```
Accessibility features:

KEYBOARD:
- Cmd/Ctrl + K: Toggle panel
- Escape: Close panel
- Tab: Navigate elements
- Enter: Send message / Accept

SCREEN READER:
- aria-label on icon buttons
- aria-live for new messages
- Announce recommendation changes
- Semantic HTML (nav, main, section)

FOCUS:
- Visible focus rings (emerald-500)
- Focus trap when panel open
- Return focus on close

COLOR CONTRAST:
- All text: 4.5:1 minimum
- Interactive elements: 3:1 minimum
- Test with axe DevTools
```

---

## Quick Implementation (All-in-One)

### Single Prompt Version

```
Build AI Concierge floating panel for "I Love Medellín":

PANEL:
- Fixed right side, 420px width (mobile: full-screen)
- Header: "AI Concierge" + close button
- Content: Scrollable recommendation cards
- Footer: Chat input (fixed bottom)

RECOMMENDATION CARD:
- Header: "✨ AI Suggests • Pending"
- Title: "Add 3 restaurants to Saturday dinner"
- Items list:
  ┌─┐ Carmen
  │+│ Contemporary Colombian • $$$
  └─┘ Saturday, 7:00 PM
  
  (+ 2 more items)
  
- Footer: [Accept All] [Dismiss]

CHAT:
- Input: Pill-shaped textarea with send button
- Messages: User (right, emerald) and AI (left, slate)
- Typing indicator when AI responding

STATE:
- Recommendations array
- Messages array
- isOpen boolean
- Context tracking (page, searches, saves)

STYLING:
- Emerald accents (#10b981)
- Purple AI badges (#8b5cf6)
- Amber prices (#f59e0b)
- Smooth animations (300ms)
- Calm, luxury aesthetic

FEATURES:
- Load mock recommendations on mount
- Click Accept to add to trip
- Click Dismiss to remove card
- Chat sends message to AI (mock response for now)
- Auto-scroll messages
- Trigger button when closed (pulse animation)

Create these files:
- /components/concierge/AIConciergePanel.tsx
- /components/concierge/RecommendationCard.tsx
- /components/concierge/ChatInput.tsx
- /components/concierge/ChatMessages.tsx
- /context/AIConciergeContext.tsx
- /data/mockRecommendations.ts
```

---

## File Structure

```
/components/concierge/
  ├── AIConciergePanel.tsx          # Main panel container
  ├── RecommendationCard.tsx        # AI suggestion card
  ├── RecommendationList.tsx        # List of cards
  ├── ChatInput.tsx                 # Message input
  ├── ChatMessages.tsx              # Conversation view
  └── TriggerButton.tsx             # Floating button (optional)

/context/
  └── AIConciergeContext.tsx        # State management

/data/
  └── mockRecommendations.ts        # Mock data

/hooks/
  └── useContextTracking.ts         # User behavior tracking

/types/
  └── concierge.ts                  # TypeScript types
```

---

## TypeScript Types

```typescript
// types/concierge.ts

export interface Recommendation {
  id: string
  title: string
  agent: string
  status: 'pending' | 'accepted' | 'dismissed'
  items: RecommendationItem[]
  createdAt: string
}

export interface RecommendationItem {
  id: string
  name: string
  category: string
  price: string
  time?: string
  location?: string
  imageUrl?: string
}

export interface Message {
  id: string
  type: 'user' | 'ai' | 'system'
  content: string
  timestamp: string
}

export interface UserContext {
  currentPage: string
  recentSearches: string[]
  savedItems: string[]
  currentTrip?: {
    id: string
    destination: string
    dates: string
  }
}

export interface ConciergeState {
  isOpen: boolean
  recommendations: Recommendation[]
  messages: Message[]
  isTyping: boolean
  userContext: UserContext
}
```

---

## Testing Checklist

**Manual Tests:**
- [ ] Panel opens with trigger button
- [ ] Panel closes with X button
- [ ] Panel closes with Escape key
- [ ] Recommendation cards display
- [ ] Accept All adds items (toast confirmation)
- [ ] Dismiss removes card
- [ ] Chat input sends message
- [ ] AI responds (mock)
- [ ] Messages auto-scroll
- [ ] Typing indicator shows
- [ ] Empty state shows when no recommendations
- [ ] Loading state shows skeletons
- [ ] Mobile: Full-screen panel
- [ ] Desktop: 420px width panel
- [ ] Animations are smooth
- [ ] Keyboard shortcuts work
- [ ] Screen reader accessible

**Performance:**
- [ ] Panel opens in < 100ms
- [ ] Recommendations load in < 500ms
- [ ] Chat response in < 2s (mock)
- [ ] No layout shift
- [ ] 60fps animations
- [ ] No memory leaks

---

## Timeline

**Total: 9-12 hours** for complete basic implementation

| Phase | Time | Deliverable |
|-------|------|-------------|
| Phase 1 | 2 hours | Panel structure |
| Phase 2 | 2 hours | Recommendation cards |
| Phase 3 | 2 hours | Chat interface |
| Phase 4 | 1 hour | State management |
| Phase 5 | 1 hour | Integration |
| Phase 6 | 1 hour | Polish |
| Testing | 1-2 hours | QA and fixes |

---

## Future Enhancements (Phase 2)

Once basic version is working, add:

1. **Real AI Integration**
   - Connect to Gemini/Claude API
   - Context-aware responses
   - Smart recommendations

2. **Image Gallery**
   - Side gallery in expanded mode
   - Medellín location photos
   - Lightbox view

3. **Advanced Features**
   - Voice input
   - Rich message cards
   - Quick actions
   - Multi-language support

4. **Analytics**
   - Track recommendation acceptance
   - Track chat engagement
   - A/B test different prompts

---

## Success Criteria

**MVP is successful when:**
✅ Panel opens/closes smoothly  
✅ Shows recommendation cards  
✅ Accept/Dismiss actions work  
✅ Chat sends/receives messages  
✅ Works on mobile and desktop  
✅ Looks polished and calm  
✅ No console errors  
✅ Passes accessibility audit  

---

**Ship it!** 🚀

Start with **Quick Implementation** prompt for fastest path to working prototype.