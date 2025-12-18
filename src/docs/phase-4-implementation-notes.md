Phase 4: Tabs, Results & Map Implementation
---------------------------------------------
We have implemented the "Results" subgraph for the AI Concierge, enabling the Split View architecture.

### Key Components Implemented:
- **Navigation:** `ResultsTabs` (Floating tab bar for List/Map)
- **Visuals:** `ResultsList` & `ResultsMap` (Container & Placeholder Map)
- **Cards:** `DiningCard` (Specialized for restaurants), reused `PropertyCard` & `ExperienceCard`
- **Mobile:** `ResultsDrawer` (Bottom Sheet integration)
- **Data:** Centralized `MockData.ts`
- **Orchestration:** Refactored `AIConcierge.tsx` to handle `viewMode` state.

### Next Steps (Phase 5: Detail & Booking):
1.  **Detail Views:** Implement specific detail pages for Dining (`/restaurants/:id`) and Events (`/experiences/:id`) matching the Luxury/Concierge design.
2.  **Booking Logic:** Implement the "Booking Options Sheet" (Internal Form vs External Link).
3.  **Map Logic:** Enhance the map with real interactive markers (integrating with the List view selection).
