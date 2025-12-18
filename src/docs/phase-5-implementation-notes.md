Phase 5: Detail & Booking Implementation
----------------------------------------
We have implemented the "Detail" and "Transaction" subgraphs of the sitemap.

### Key Components Implemented:
- **Booking Engine:**
  - `BookingSheet`: A unified "Action" component handling both instant external bookings and internal concierge requests.
  - `DetailBookingCard`: The sidebar trigger component that integrates with the page layout.
  
- **Detail Pages:**
  - `/restaurants/:id`: Specialized view for dining with Menu highlights and Dress Code info.
  - `/experiences/:id`: Specialized view for events with Itinerary timelines.
  
- **Routing:**
  - Dynamic routing (`:id`) enables a scalable CMS-like structure using our mock data.

### Next Steps (Phase 6: Refinement & Polish):
1.  **Map Integration:** Connect the "Map View" in the Concierge to these new detail pages.
2.  **Mobile Optimization:** Ensure the Detail pages look perfect on mobile (stacking order, bottom sheet behavior).
3.  **Search/Filter:** Add simple filtering to the Concierge results.
