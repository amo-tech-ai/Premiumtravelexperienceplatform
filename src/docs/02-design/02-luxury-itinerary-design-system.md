# 🎨 Luxury Itinerary Design System
## Complete Component Library & Implementation Guide

---

## 📐 Design Philosophy

**Calm Luxury** - High-end concierge experience
- Editorial spacing (generous whitespace)
- Soft cards with subtle shadows
- Confident typography (clear hierarchy)
- Premium micro-interactions (smooth animations)
- Trust-building elements (clear reasoning, explainable AI)

---

## 🏗️ Architecture Overview

### Desktop Layout (2-Column)
```
┌──────────────────────────────────────────────────────┐
│  Header: Back | Title | Invite | Save                │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────────┐  ┌────────────────────────┐ │
│  │                    │  │                        │ │
│  │  LEFT (40%)        │  │  RIGHT (60%)           │ │
│  │  Planning Area     │  │  Map (Sticky)          │ │
│  │                    │  │                        │ │
│  │  • Ideas Section   │  │  • Interactive Map     │ │
│  │  • Day 1           │  │  • Category Pins       │ │
│  │  • Day 2           │  │  • Route Lines         │ │
│  │  • Day 3           │  │  • Selected Details    │ │
│  │  • ...             │  │  • Filter Chips        │ │
│  │                    │  │                        │ │
│  │  (Scrollable)      │  │  (Sticky Position)     │ │
│  │                    │  │                        │ │
│  └────────────────────┘  └────────────────────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Mobile Layout (Stack + Sheets)
```
┌──────────────────────────┐
│  Compact Map (Collapsible) │
├──────────────────────────┤
│                          │
│  Ideas Section           │
│  Day 1 ▼                 │
│  Day 2 ▼                 │
│  Day 3 ▼                 │
│                          │
│  (Scrollable)            │
│                          │
├──────────────────────────┤
│  [+ Add] Floating Button │
└──────────────────────────┘

Bottom Sheets:
• Search/Add modal
• Place details
• AI suggestions
```

---

## 🎯 Component Library

### 1. **TripHeader** (`/components/trip-details/luxury/TripHeader.tsx`)

**Purpose:** Top navigation with trip metadata and actions

**Features:**
- ✅ Editable trip title (inline editing)
- ✅ Trip metadata display (destination, dates, travelers)
- ✅ Invite collaborators (with roles)
- ✅ Save trip CTA (for non-authenticated users)
- ✅ More menu (copy link, download PDF, delete)

**States:**
- Default: Display mode
- Editing: Inline title editor
- Invite sheet open
- More menu open

**Example Usage:**
```tsx
<TripHeader
  tripId="abc123"
  title="Medellín Design Week"
  destination="Medellín, Colombia"
  dates="Jan 15-20, 2025"
  travelers={2}
  onTitleChange={(newTitle) => updateTrip({ title: newTitle })}
  onInvite={() => trackEvent('invite_clicked')}
  showSavePrompt={!isAuthenticated}
/>
```

---

### 2. **IdeasSection** (`/components/trip-details/luxury/IdeasSection.tsx`)

**Purpose:** "Saved for later" bucket before scheduling

**Features:**
- ✅ Collapsible section (save space)
- ✅ Draggable idea cards
- ✅ Rich preview (image, category, duration, price)
- ✅ Quick actions: Add to Day, Pin on Map, Remove
- ✅ Empty state with AI suggestions

**Card Structure:**
```
┌─────────────────────────┐
│ [Image with category]   │
│ "Comuna 13 Tour"        │
│ 🎯 Activity · 3h · $$   │
│ ⭐ 4.8 · El Poblado     │
│ [Add to Day] [📍]      │
└─────────────────────────┘
```

**Drag & Drop:**
- Ideas can be dragged to any day
- Drop zones highlight on hover
- Visual feedback during drag

**Example Usage:**
```tsx
<IdeasSection
  ideas={savedIdeas}
  onAddToDay={(ideaId) => scheduleIdea(ideaId)}
  onRemove={(ideaId) => removeIdea(ideaId)}
  onPinOnMap={(ideaId) => focusOnMap(ideaId)}
  onAddNewIdea={() => openSearchModal()}
/>
```

---

### 3. **DaySection** (`/components/trip-details/luxury/DaySection.tsx`)

**Purpose:** Collapsible day container with summary stats

**Features:**
- ✅ Expandable/collapsible (accordion style)
- ✅ Day summary (stops, duration, distance)
- ✅ Time distribution pills (morning/afternoon/evening)
- ✅ Conflict warnings
- ✅ Quick "Optimize" action
- ✅ Empty state with AI prompt

**Header Information:**
```
Day 1 · Mon, Jan 15
📍 5 stops · ⏱ 8h total · 📏 15 km
🌅 2 morning · ☕ 2 afternoon · 🌙 1 evening
⚠️ Conflicts detected
```

**Empty State:**
```
No plans for this day yet
Add activities, meals, or experiences

[Add First Item] [Let AI Build]
```

**Example Usage:**
```tsx
<DaySection
  day={tripDay}
  dayIndex={0}
  isExpanded={expandedDay === 0}
  onToggle={() => setExpandedDay(expandedDay === 0 ? null : 0)}
  onAddItem={() => openAddModal(0)}
  onOptimize={() => optimizeDay(0)}
  totalDuration="8h 30m"
  totalDistance="15.2 km"
  hasConflicts={dayConflicts.length > 0}
>
  {/* Itinerary items */}
</DaySection>
```

---

### 4. **ItineraryItemCard** (`/components/trip-details/luxury/ItineraryItemCard.tsx`)

**Purpose:** Individual activity/meal/stay card in timeline

**Features:**
- ✅ Draggable (reorder within/across days)
- ✅ Time + duration display
- ✅ Category badge (food/activity/stay/logistics)
- ✅ Cost badge
- ✅ Status badge (planned/booked/confirmed)
- ✅ Notes section
- ✅ Image preview
- ✅ Warning banner (conflicts/closures)
- ✅ Context menu (edit, duplicate, move, delete)

**Card Layout:**
```
┌─────────────────────────────────────┐
│ ⚠️ Museum closes at 5 PM            │ ← Warning
├─────────────────────────────────────┤
│ 2:00 PM   Comuna 13 Tour        [≡] │
│   3h      🎯 Activity · $25         │
│           ✓ Booked                  │
│           "Reservation #4492"       │
│           [Image Preview]           │
│                                     │
│ ● ← Timeline dot                    │
└─────────────────────────────────────┘
```

**Drag States:**
- Default: White background, subtle shadow
- Hover: Elevated shadow, border highlight
- Dragging: 40% opacity, ring, scale up
- Drop zone: Emerald highlight

**Example Usage:**
```tsx
<ItineraryItemCard
  item={tripItem}
  dayIndex={0}
  onEdit={() => openEditModal(item.id)}
  onDelete={() => deleteItem(item.id)}
  onDuplicate={() => duplicateItem(item.id)}
  onMoveToDay={() => showDayPicker(item.id)}
  showWarning={item.time && isPastClosing(item.time, item.location)}
  warningMessage="Arrives after closing time"
/>
```

---

### 5. **AddPlaceModal** (`/components/trip-details/luxury/AddPlaceModal.tsx`)

**Purpose:** Search and add places/experiences

**Features:**
- ✅ Tabbed interface (Search / Saved)
- ✅ Real-time search with filters
- ✅ Category chips (All, Dining, Activities, Stays, Events)
- ✅ Rich result cards (image, rating, neighborhood, hours)
- ✅ Quick actions: Add to Day OR Add to Ideas
- ✅ Saved collections (future)

**Search Flow:**
```
1. User clicks "+ Add" button
2. Modal opens with search tab active
3. Type query → Results filter instantly
4. Click category chip → Refine results
5. Click "Add to Day" → Select day → Modal closes
   OR
   Click bookmark → Add to Ideas → Modal closes
```

**Result Card:**
```
┌───────────────────────┐
│ [Image] 🔥 Trending   │
│ El Cielo              │
│ Avant-garde Colombian │
│ 📍 El Poblado · $$$$  │
│ ⭐ 4.9 (1,240)        │
│ [Add to Day] [💾]     │
└───────────────────────┘
```

**Example Usage:**
```tsx
<AddPlaceModal
  open={isAddModalOpen}
  onClose={() => setIsAddModalOpen(false)}
  onAddToIdeas={(place) => saveToIdeas(place)}
  onAddToDay={(place, dayIndex) => addToDay(place, dayIndex)}
  defaultTab="search"
/>
```

---

### 6. **AISuggestionsPanel** (`/components/trip-details/luxury/AISuggestionsPanel.tsx`)

**Purpose:** Show AI-powered recommendations to improve trip

**Features:**
- ✅ 4 suggestion types (optimize, add, swap, warning)
- ✅ Impact metrics (time saved, money saved, distance saved)
- ✅ Expandable cards with reasoning
- ✅ One-click apply
- ✅ Dismiss option
- ✅ Feedback buttons (helpful/not helpful)
- ✅ Preview for add/swap suggestions

**Suggestion Types:**

**Optimize:**
```
🎯 Reorder Day 2 activities
Group Comuna 13 tour with nearby coffee shop
⏱ 45 min saved · 📏 8 km saved
[Apply]
```

**Add:**
```
✨ Add sunset viewpoint
Pueblito Paisa offers golden hour views
[Preview image]
[Add to Day 2]
```

**Swap:**
```
💰 Cheaper dinner option
Try Mondongos instead of El Cielo
💵 $120 saved
[Preview comparison]
[Swap]
```

**Warning:**
```
⏰ Museum closes at 5 PM
Current schedule arrives at 4:30 PM
⚠️ Not enough time
[Move earlier]
```

**Example Usage:**
```tsx
<AISuggestionsPanel
  suggestions={aiSuggestions}
  onApply={(id) => applySuggestion(id)}
  onDismiss={(id) => dismissSuggestion(id)}
  onFeedback={(id, helpful) => trackFeedback(id, helpful)}
/>
```

---

## 🎨 Design Tokens

### Colors

**Primary Palette:**
```css
--emerald-50: #ecfdf5
--emerald-100: #d1fae5
--emerald-500: #10b981
--emerald-600: #059669
--emerald-700: #047857
```

**Category Colors:**
```css
Food:     --orange-600 on --orange-50
Activity: --emerald-600 on --emerald-50
Stay:     --blue-600 on --blue-50
Event:    --purple-600 on --purple-50
Logistics:--slate-600 on --slate-50
```

**Status Colors:**
```css
Planned:   --slate-500 on --slate-100
Booked:    --blue-600 on --blue-50
Confirmed: --emerald-600 on --emerald-50
Warning:   --amber-600 on --amber-50
Error:     --red-600 on --red-50
```

### Typography

**Headers:**
```css
Trip Title:     text-xl font-semibold
Day Header:     text-lg font-semibold
Card Title:     text-base font-semibold
Meta Info:      text-sm text-slate-600
Micro Copy:     text-xs text-slate-500
```

**Spacing:**
```css
Section Gap:    mb-6 (24px)
Card Padding:   p-4 (16px) or p-6 (24px)
Card Gap:       gap-4 (16px)
Button Gap:     gap-2 (8px)
```

### Shadows

```css
Card Default:   shadow-sm
Card Hover:     shadow-lg
Modal:          shadow-xl
Floating:       shadow-2xl
```

### Borders

```css
Card:           border border-slate-200 rounded-xl
Button:         rounded-lg
Pill/Badge:     rounded-full
Modal:          rounded-2xl
```

---

## 🔧 AI Agent Integration

### 1. **Itinerary Optimizer**

**Triggers:**
- User clicks "Optimize Day"
- User clicks "Optimize" in AI Actions panel
- Auto-suggestion after adding 3+ items

**Logic:**
```typescript
1. Get all items for the day
2. Cluster by geographic proximity
3. Calculate optimal sequence (minimize travel time)
4. Respect time constraints (opening hours, duration)
5. Insert buffers (travel time, rest breaks)
6. Return new order + savings metrics
```

**UI Response:**
```tsx
// Show modal with preview
<OptimizePreview
  before={originalOrder}
  after={optimizedOrder}
  impact={{
    timeSaved: "45 min",
    distanceSaved: "8.2 km"
  }}
  onApply={() => applyOptimization()}
  onCancel={() => close()}
/>
```

---

### 2. **Local Scout (Ideas Generator)**

**Triggers:**
- Empty day state → "Let AI Build" button
- Empty ideas section → "Get AI Suggestions"
- User asks in chat: "What should I do in Medellín?"

**Logic:**
```typescript
1. Analyze user profile (interests, pace, budget)
2. Query events API (Ticketmaster, local calendar)
3. Filter by:
   - Date availability
   - Category match
   - Price range
   - Rating threshold (4.5+)
4. Rank by popularity + personalization
5. Return 5-10 suggestions
```

**UI Response:**
```tsx
// Add to Ideas section automatically
ideas.forEach(idea => {
  addToIdeas({
    ...idea,
    aiGenerated: true,
    reason: "Based on your interest in art & culture"
  });
});
```

---

### 3. **Dining Orchestrator**

**Triggers:**
- User searches for "restaurant" or "food"
- Meal time gap detected (>4 hours without food)
- User clicks "Add meal" in day builder

**Logic:**
```typescript
1. Detect cuisine preferences from past trips
2. Filter by:
   - Open at requested time
   - Price range match
   - Location proximity to other activities
3. Prioritize:
   - Reservable restaurants
   - High ratings (4.5+)
   - Unique experiences
4. Return with reservation availability
```

**UI Response:**
```tsx
// Show in search results with special badge
<RestaurantCard
  {...restaurant}
  reservationAvailable={true}
  availableTimes={["6:00 PM", "7:00 PM", "8:00 PM"]}
  matchReason="Colombian fusion matches your preferences"
/>
```

---

### 4. **Booking Assistant**

**Triggers:**
- User clicks "Reserve" on any item
- Confirmation required for expensive items
- Auto-suggest for stays (arrival day)

**Logic:**
```typescript
1. Detect booking type (flight, hotel, restaurant, activity)
2. Search availability for requested dates/times
3. Compare prices across providers
4. Show top 3-5 options
5. Store confirmation details when booked
```

**UI Response:**
```tsx
<BookingFlow
  type="restaurant"
  item={restaurant}
  onComplete={(confirmation) => {
    updateItem({
      status: "confirmed",
      notes: `Confirmation #${confirmation.number}`
    });
  }}
/>
```

---

### 5. **Event Curator**

**Triggers:**
- User dates overlap with local events
- Trending events in destination city
- User searches "events" or "concerts"

**Logic:**
```typescript
1. Query event APIs (Ticketmaster, Eventbrite, local)
2. Filter by:
   - Date range of trip
   - Category preferences
   - Ticket availability
3. Rank by:
   - Trending/popular
   - Sold out risk
   - Price match
4. Surface in Ideas section + suggestions
```

**UI Response:**
```tsx
<EventCard
  {...event}
  ticketStatus="Almost sold out! 🔥"
  urgency="high"
  addedBy="AI Event Curator"
/>
```

---

### 6. **Budget Guardian**

**Triggers:**
- Real-time as items are added/removed
- Budget threshold crossed (50%, 75%, 100%)
- Expensive item added (>20% of budget)

**Logic:**
```typescript
1. Sum all costs per category
2. Calculate % of total budget
3. Detect overspending
4. Find savings opportunities:
   - Cheaper alternatives
   - Free activities
   - Transportation hacks
5. Alert + suggest fixes
```

**UI Response:**
```tsx
// Top of page: Budget bar
<BudgetBar
  total={1500}
  spent={1280}
  breakdown={{
    food: 450,
    activities: 380,
    stay: 400,
    logistics: 50
  }}
  status="warning" // safe, warning, exceeded
/>

// AI Suggestion:
<AISuggestion
  type="swap"
  title="Save $120 on dinner"
  description="Try Mondongos instead of El Cielo"
  impact={{ moneySaved: "$120" }}
/>
```

---

## 📱 Responsive Behavior

### Desktop (>1024px)
- 2-column layout (40% / 60%)
- Map is sticky and always visible
- Sidebar panels slide in from right
- Hover states active

### Tablet (768px - 1024px)
- Map becomes collapsible header
- Single column itinerary
- Bottom sheets for details
- Simplified actions

### Mobile (<768px)
- Stack layout
- Compact map at top (swipe to hide)
- Bottom sheets for all modals
- Floating "+ Add" button
- Swipe gestures for navigation

---

## 🎭 States & Variations

### Empty States

**No Ideas:**
```
✨ No ideas yet
Save places you're interested in to your Ideas bucket

[Add Your First Idea]
```

**Empty Day:**
```
📅 No plans for this day yet
Add activities, meals, or experiences

[Add First Item] [Let AI Build]
```

**No Search Results:**
```
🔍 No results found
Try adjusting your search or filters

[Clear Filters]
```

---

### Loading States

**Itinerary Loading:**
```tsx
<Skeleton className="h-48 w-full rounded-xl" /> // Day header
<Skeleton className="h-32 w-full rounded-xl ml-4" /> // Item 1
<Skeleton className="h-32 w-full rounded-xl ml-4" /> // Item 2
```

**AI Suggestions Loading:**
```tsx
<div className="flex items-center gap-2 text-slate-500">
  <Sparkles className="w-5 h-5 animate-pulse" />
  <span>AI is thinking...</span>
</div>
```

---

### Error States

**Failed to Load Trip:**
```
⚠️ Couldn't load trip
Please refresh or try again later

[Retry] [Go to Dashboard]
```

**AI Suggestion Failed:**
```
❌ AI couldn't process this request
Suggestion dismissed
```

---

## 🚀 User Flows

### Flow 1: Solo Traveler (First-Time User)

```
1. Land on empty itinerary page
   ↓
2. See "Let AI Build" button in empty day
   ↓
3. Click → Modal: "Tell us about your trip"
   - Interests: Art, Food, Culture
   - Pace: Relaxed
   - Budget: Moderate
   ↓
4. AI generates 5-day itinerary
   ↓
5. Review → Apply
   ↓
6. Itinerary populated
   ↓
7. Drag items to reorder
   ↓
8. Click "Optimize Day 2"
   ↓
9. See preview → Apply
   ↓
10. Share link with friend
```

---

### Flow 2: Group Planning

```
1. User A creates trip
   ↓
2. Clicks "Invite"
   ↓
3. Enters emails for Users B & C
   ↓
4. B & C receive invite links
   ↓
5. Everyone adds items to Ideas
   ↓
6. AI suggests "Most popular picks"
   ↓
7. Group votes on top 10
   ↓
8. Schedule winners to days
   ↓
9. Optimize for minimal travel
   ↓
10. Book together
```

---

### Flow 3: Budget-Conscious Planner

```
1. Create trip with $500 budget
   ↓
2. Add expensive hotel ($300/night)
   ↓
3. Budget Guardian alerts: "Over budget!"
   ↓
4. AI suggests cheaper alternative
   ↓
5. Swap → Save $200
   ↓
6. Continue adding activities
   ↓
7. Real-time budget bar updates
   ↓
8. Green = under budget ✅
   ↓
9. Final check: "Trip ready!"
```

---

## ✅ Production Checklist

### Must-Have Features
- [x] Drag & drop reordering
- [x] Add/edit/delete items
- [x] Ideas section (saved for later)
- [x] AI suggestions panel
- [x] Budget tracking
- [x] Conflict detection
- [x] Empty states
- [x] Loading states
- [x] Mobile responsive

### Nice-to-Have Features
- [ ] Collaborative editing (real-time)
- [ ] Map integration (Google Maps)
- [ ] Booking API integration
- [ ] PDF export
- [ ] Calendar sync
- [ ] Weather integration
- [ ] Auto-translate
- [ ] Offline mode

### Polish
- [x] Smooth animations
- [x] Hover states
- [x] Focus states (accessibility)
- [x] Error boundaries
- [ ] Loading skeletons
- [ ] Toast notifications
- [ ] Undo/redo
- [ ] Keyboard shortcuts

---

## 📊 Success Metrics

**Speed:**
- Add a place in < 2 taps
- Reorder updates map instantly (<500ms)
- AI suggestions appear within 2s

**Clarity:**
- AI explains reasoning for every suggestion
- Conflicts shown with clear fixes
- Budget status always visible

**Trust:**
- All changes are reversible
- Confirmation for destructive actions
- Transparent pricing (no hidden fees)

**Mobile:**
- Usable with one hand
- No horizontal scroll
- Touch targets >44px

---

## 🎓 Next Steps

1. **Wire up AI Agents**
   - Connect itinerary optimizer to UI
   - Hook budget guardian to real-time calculations
   - Integrate event curator API

2. **Add Map Integration**
   - Google Maps iframe
   - Custom pins per category
   - Route polylines
   - Click to focus

3. **Implement Booking Flow**
   - Restaurant reservations (OpenTable API)
   - Activity bookings (Viator/GetYourGuide)
   - Flight search (Skyscanner API)
   - Hotel search (Booking.com)

4. **Production Polish**
   - Error boundaries
   - Loading skeletons
   - Accessibility audit (WCAG AA)
   - Performance optimization

5. **Testing**
   - Unit tests (components)
   - Integration tests (flows)
   - E2E tests (Playwright)
   - User testing (5 participants)

---

**Ready to implement?** Start with `TripHeader` + `IdeasSection` + `DaySection` for the core structure, then layer in AI features. 🚀
