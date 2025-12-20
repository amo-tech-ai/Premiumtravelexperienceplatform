# User Journey Diagrams — Experience Flows

**Date:** December 20, 2024  
**Status:** Current Journeys Documented  
**Purpose:** Map user experience from entry to value

---

## 4️⃣ USER JOURNEY DIAGRAMS

### Journey 1: First-Time User → Discovery → Saved → Trip

```mermaid
journey
    title New User Journey: From Discovery to Planning
    section Landing (Home Page)
      Sees hero: 5: User
      Reads value prop: 4: User
      Clicks Explore: 5: User
    section Discovery (Explore Page)
      Browses places: 5: User
      Filters by category: 4: User
      Clicks place card: 5: User
      Views detail drawer: 5: User
      Reads reviews/tags: 4: User
      Clicks Save: 5: User
      Sees confirmation: 5: System
    section Organization (Saved Page)
      Navigates to Saved: 4: User
      Views saved places: 5: User
      Browses collections: 3: User
      Clicks Add to Trip: 5: User
      Sees trip modal: 4: System
    section Planning (Create Trip)
      Fills trip details: 4: User
      Sets dates/budget: 4: User
      Confirms creation: 5: User
      Redirected to trip: 5: System
    section Itinerary (Trip Details)
      Sees empty itinerary: 3: User
      Adds saved place: 5: User
      Drags to organize: 5: User
      Sees budget update: 5: System
      Clicks Optimize: 5: User
      Reviews suggestions: 5: System
      Feels accomplished: 5: User
```

**Emotional Journey:**
- **Landing:** Curious (5) → Interested (4)
- **Discovery:** Engaged (5) → Delighted (5)
- **Organization:** Productive (4) → Satisfied (5)
- **Planning:** Focused (4) → Confident (5)
- **Itinerary:** Empowered (5) → Accomplished (5)

**Pain Points:**
1. ⚠️ No onboarding tutorial (User might miss features)
2. ⚠️ "Add to Trip" requires existing trip (friction)
3. ✅ Otherwise smooth flow!

---

### Journey 2: Return User → AI Chat → Smart Recommendations

```mermaid
journey
    title Return User: AI-Powered Discovery
    section Re-entry
      Opens app: 5: User
      Sees saved trips: 5: System
      Opens existing trip: 5: User
    section AI Interaction
      Opens Concierge: 5: User
      Types question: 5: User
      Sees typing indicator: 4: System
      Receives AI response: 5: System
      Sees recommendations: 5: User
    section Evaluation
      Browses suggestions: 5: User
      Clicks restaurant card: 5: User
      Views details: 5: System
      Likes the option: 5: User
    section Quick Action
      Clicks Save: 5: User
      Clicks Add to Trip: 5: User
      Selects day: 4: User
      Sees confirmation: 5: System
      Continues planning: 5: User
    section Optimization
      Notices conflict icon: 4: System
      Clicks Check Conflicts: 5: User
      Reviews issues: 4: System
      Clicks Optimize: 5: User
      Sees improvements: 5: System
      Applies changes: 5: User
      Feels confident: 5: User
```

**Emotional Journey:**
- **Re-entry:** Familiar (5) → Comfortable (5)
- **AI Interaction:** Curious (5) → Impressed (5)
- **Evaluation:** Browsing (5) → Excited (5)
- **Quick Action:** Efficient (5) → Satisfied (5)
- **Optimization:** Concerned (4) → Relieved (5) → Confident (5)

**Pain Points:**
1. ⚠️ AI suggestions not always relevant (need better context)
2. ⚠️ No undo for Apply changes (should confirm first)
3. ✅ Otherwise excellent flow!

---

### Journey 3: Mobile User → Quick Planning On-the-Go

```mermaid
journey
    title Mobile User: On-the-Go Planning
    section Mobile Entry
      Opens PWA on phone: 5: User
      Sees responsive design: 5: System
      Taps bottom nav: 5: User
    section Quick Discovery
      Swipes through places: 5: User
      Taps to view details: 5: User
      Pinches to zoom images: 5: User
      Double-taps to save: 5: User
    section Voice Input
      Opens Concierge: 5: User
      Taps mic icon: 4: User
      Speaks query: 5: User
      Sees transcription: 4: System
      Gets AI response: 5: System
    section Quick Add
      Taps Add to Trip: 5: User
      Sees trip selector: 4: System
      Taps day: 4: User
      Sees success toast: 5: System
    section Offline Mode
      Goes underground: 1: User
      Sees offline indicator: 4: System
      Continues browsing: 3: User
      Makes changes: 4: User
      Resurfaces: 5: User
      Auto-syncs: 5: System
      Feels relieved: 5: User
```

**Emotional Journey:**
- **Mobile Entry:** Convenient (5) → Pleased (5)
- **Quick Discovery:** Engaged (5) → Delighted (5)
- **Voice Input:** Experimental (4) → Impressed (5)
- **Quick Add:** Efficient (5) → Satisfied (5)
- **Offline Mode:** Worried (1) → Anxious (3) → Relieved (5)

**Pain Points:**
1. 🔴 Voice input not implemented (proposed feature)
2. 🔴 Offline mode not fully functional (syncs but limited)
3. ⚠️ Some gestures not working (swipe actions)

---

### Journey 4: Power User → Advanced Itinerary Management

```mermaid
journey
    title Power User: Complex Multi-Day Trip Planning
    section Setup
      Creates 7-day trip: 5: User
      Sets $2000 budget: 5: User
      Adds 4 travelers: 4: User
    section Bulk Add
      Opens Saved Places: 5: User
      Selects multiple: 5: User
      Bulk adds to trip: 5: User
      Sees all in itinerary: 5: System
    section Organization
      Drags items across days: 5: User
      Groups by area: 5: User
      Adjusts times: 4: User
      Adds notes: 4: User
    section AI Assistance
      Clicks AI Actions: 5: User
      Runs Optimize Route: 5: User
      Reviews 45min saved: 5: System
      Applies optimization: 5: User
      Runs Check Conflicts: 5: User
      Sees 2 conflicts: 4: System
      Resolves manually: 4: User
    section Budget Management
      Sees budget warning: 3: System
      Opens Budget Guardian: 4: User
      Reviews breakdown: 4: User
      Asks AI for savings: 5: User
      Gets suggestions: 5: System
      Swaps expensive items: 4: User
      Sees green status: 5: System
      Feels in control: 5: User
    section Sharing
      Clicks Export: 5: User
      Generates iCal: 5: System
      Imports to calendar: 5: User
      Shares link: 5: User
      Collaborates with group: 5: User
      Feels accomplished: 5: User
```

**Emotional Journey:**
- **Setup:** Determined (5) → Focused (5)
- **Bulk Add:** Efficient (5) → Productive (5)
- **Organization:** Meticulous (5) → Satisfied (4)
- **AI Assistance:** Curious (5) → Impressed (5)
- **Budget Management:** Concerned (3) → Relieved (5) → Empowered (5)
- **Sharing:** Collaborative (5) → Proud (5)

**Pain Points:**
1. ⚠️ Bulk select not implemented (would save time)
2. ⚠️ Conflict auto-fix not working (manual only)
3. ⚠️ Collaboration limited (no real-time multi-user)

---

### Journey 5: Budget Traveler → Cost-Conscious Planning

```mermaid
journey
    title Budget Traveler: Maximizing Value
    section Budget Setup
      Sets $500 budget: 5: User
      Filters by price: 5: User
      Sees $ options: 5: System
    section Discovery
      Browses budget places: 5: User
      Finds hidden gems: 5: User
      Saves free activities: 5: User
    section AI Guidance
      Asks AI for budget tips: 5: User
      Gets 10 suggestions: 5: System
      Clicks Show Cheaper: 5: User
      Sees alternatives: 5: System
      Compares prices: 4: User
    section Smart Choices
      Adds budget hostel: 5: User
      Adds free walking tour: 5: User
      Adds local restaurant: 5: User
      Sees budget at 60%: 5: System
      Feels smart: 5: User
    section Final Optimization
      Budget Guardian suggests: 5: System
      Switch to metro: 5: System
      Save $75 on transport: 5: System
      Apply suggestion: 5: User
      Final budget 48%: 5: System
      Feels accomplished: 5: User
```

**Emotional Journey:**
- **Budget Setup:** Careful (5) → Strategic (5)
- **Discovery:** Hopeful (5) → Excited (5)
- **AI Guidance:** Curious (5) → Delighted (5)
- **Smart Choices:** Confident (5) → Satisfied (5)
- **Final Optimization:** Impressed (5) → Accomplished (5)

**Pain Points:**
1. ⚠️ Budget Guardian reactive (should be proactive earlier)
2. ✅ Otherwise excellent for budget users!

---

## JOURNEY COMPARISON MATRIX

| Journey | Smoothness | Pain Points | AI Value | Status |
|---------|------------|-------------|----------|--------|
| **First-Time User** | 90% | 2 minor | Medium | ✅ Good |
| **Return User AI** | 95% | 2 minor | High | ✅ Excellent |
| **Mobile On-the-Go** | 75% | 3 major | Medium | ⚠️ Gaps |
| **Power User** | 85% | 3 medium | High | ✅ Good |
| **Budget Traveler** | 95% | 1 minor | Very High | ✅ Excellent |

---

## DETAILED JOURNEY FLOWS

### Flow A: Explore → Save (Detailed)

```mermaid
stateDiagram-v2
    [*] --> LandingPage
    LandingPage --> ExplorePage: Click Explore
    
    state ExplorePage {
        [*] --> BrowsePlaces
        BrowsePlaces --> ApplyFilters
        ApplyFilters --> BrowsePlaces
        BrowsePlaces --> ViewMap
        ViewMap --> BrowsePlaces
        BrowsePlaces --> ClickPlace
        ClickPlace --> PlaceDetailDrawer
        
        state PlaceDetailDrawer {
            [*] --> ViewImages
            ViewImages --> ReadReviews
            ReadReviews --> CheckPrice
            CheckPrice --> DecideSave
            DecideSave --> ClickSaveButton: User likes it
            DecideSave --> Close: Not interested
            ClickSaveButton --> SavedConfirmation
            SavedConfirmation --> [*]: Success
        }
        
        PlaceDetailDrawer --> BrowsePlaces: Close
    }
    
    ExplorePage --> SavedPage: Navigate to /saved
    SavedPage --> [*]
```

### Flow B: AI Chat → Action (Detailed)

```mermaid
stateDiagram-v2
    [*] --> OpenConcierge
    OpenConcierge --> TypeMessage
    TypeMessage --> SendMessage
    SendMessage --> ProcessingState
    
    state ProcessingState {
        [*] --> ShowTypingIndicator
        ShowTypingIndicator --> ClassifyIntent
        ClassifyIntent --> SelectAgents
        SelectAgents --> InvokeAgents
        
        state InvokeAgents {
            [*] --> LocalScout
            [*] --> DiningOrchestrator
            [*] --> EventCurator
            LocalScout --> AggregateResults
            DiningOrchestrator --> AggregateResults
            EventCurator --> AggregateResults
        }
        
        InvokeAgents --> FormatResponse
        FormatResponse --> [*]
    }
    
    ProcessingState --> DisplayResults
    DisplayResults --> UserReviewsResults
    
    state UserReviewsResults {
        [*] --> ChooseAction
        ChooseAction --> SavePlace: Click Save
        ChooseAction --> AddToTrip: Click Add
        ChooseAction --> ViewDetails: Click Details
        ChooseAction --> AskFollowUp: Continue chat
        
        SavePlace --> ConfirmationToast
        AddToTrip --> SelectDayModal
        ViewDetails --> DetailPage
        AskFollowUp --> TypeMessage
        
        ConfirmationToast --> [*]
        SelectDayModal --> [*]
        DetailPage --> [*]
    }
    
    UserReviewsResults --> [*]
```

---

## JOURNEY PAIN POINTS ANALYSIS

### Critical Issues (Must Fix)

1. **Mobile Offline Mode Incomplete** 🔴
   - **Journey:** Mobile User
   - **Impact:** High - Breaks trust
   - **Fix:** Implement full offline queue + sync

2. **No Undo for AI Actions** 🔴
   - **Journey:** Return User, Power User
   - **Impact:** Medium - User anxiety
   - **Fix:** Add undo toast after AI actions

3. **Voice Input Missing** 🔴
   - **Journey:** Mobile User
   - **Impact:** Medium - Expected feature
   - **Fix:** Add Web Speech API integration

### Important Issues (Should Fix)

4. **No Bulk Operations** 🟡
   - **Journey:** Power User
   - **Impact:** Medium - Time waste
   - **Fix:** Add multi-select UI

5. **Budget Guardian Reactive** 🟡
   - **Journey:** Budget Traveler
   - **Impact:** Low - Still works
   - **Fix:** Make proactive earlier in planning

6. **No Onboarding** 🟡
   - **Journey:** First-Time User
   - **Impact:** Medium - Feature discovery
   - **Fix:** Add 3-step tutorial overlay

### Nice to Have

7. **Better AI Context** 🟢
   - **Journey:** Return User
   - **Impact:** Low - Works but could be better
   - **Enhancement:** Improve context tracking

---

## USER SEGMENTS & JOURNEY PREFERENCES

| Segment | Primary Journey | Secondary Journey | Key Feature |
|---------|----------------|-------------------|-------------|
| **First-Time Visitors** | Discovery → Save → Plan | N/A | Easy exploration |
| **Return Planners** | AI Chat → Action | Trip Management | AI recommendations |
| **Mobile Users** | Quick Add | Voice Search | Speed & convenience |
| **Power Users** | Complex Planning | Optimization | Advanced features |
| **Budget Travelers** | Cost Filtering | Budget AI | Savings suggestions |

---

## JOURNEY SUCCESS METRICS

### Conversion Funnel

```
Landing Page → Explore → Save → Create Trip → Add Items → Complete
   100%         80%       60%      40%         30%        20%
```

**Current Drop-offs:**
- Landing → Explore: 20% (navigation unclear)
- Explore → Save: 20% (friction in save flow)
- Save → Create Trip: 20% (extra step)
- Create Trip → Add Items: 10% (good)
- Add Items → Complete: 10% (good)

**Target:**
- Reduce Landing → Explore drop to 10%
- Reduce Explore → Save drop to 10%
- Reduce Save → Create Trip drop to 10%

---

## 🎯 JOURNEY OPTIMIZATION RECOMMENDATIONS

### Immediate (Week 1)
1. ✅ **Add Onboarding Tutorial** (First-Time User journey)
2. ✅ **Add Undo Toasts** (All AI actions)
3. ✅ **Improve Mobile Gestures** (Mobile journey)

### Short-term (Week 2-3)
4. ➕ **Implement Offline Queue** (Mobile journey)
5. ➕ **Add Voice Input** (Mobile journey)
6. ➕ **Add Bulk Select** (Power User journey)

### Long-term (Month 2)
7. ➕ **Real-Time Collaboration** (Power User journey)
8. ➕ **Predictive Budget AI** (Budget Traveler journey)
9. ➕ **Smart Recommendations Engine** (All journeys)

---

**Status:** User journeys documented with pain points  
**Next Document:** `05-ai-agent-orchestration.md`
