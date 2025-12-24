# PHASE 6: TRIPS MODULE
## Trip CRUD + Drag-Drop Itinerary + Wizard Flow + Supabase Integration

**Document:** 07-phase-6-trips-module.md  
**Phase:** 6 of 11  
**Duration:** 120-150 minutes  
**Prerequisites:** Phase 5 complete with working auth  
**Status:** Ready to Execute

---

## PHASE OBJECTIVE

Build complete trips feature module including trip list, trip detail with drag-and-drop itinerary builder, multi-step wizard for trip creation, and full Supabase database integration with Row Level Security.

---

## SUCCESS CRITERIA

- Trips table created in Supabase with RLS policies
- Trip items table for itinerary entries
- Trip list page showing user's trips
- Trip detail page with drag-drop itinerary
- 5-step wizard for creating new trips
- CRUD operations for trips and items
- Budget tracking per trip
- Map integration showing locations
- Mobile responsive itinerary builder

---

## STEP-BY-STEP INSTRUCTIONS

### Step 1: Design Database Schema

**Action:** Plan trips and trip_items table structures  

**Trips Table Schema:**  
id column as UUID primary key with default uuid_generate_v4. user_id column as UUID foreign key to auth.users. destination column as text (city, country). start_date column as date. end_date column as date. budget_total column as decimal. budget_spent column as decimal default 0. currency column as text default 'USD'. created_at and updated_at timestamps. title column as text for trip name. description column as text optional.  

**Trip Items Table Schema:**  
id column as UUID primary key. trip_id column as UUID foreign key to trips. type column as text (event, restaurant, rental, custom). title column as text. description column as text optional. scheduled_date column as date. scheduled_time column as time optional. duration_minutes column as integer optional. location column as text. cost column as decimal optional. position column as integer for drag-drop ordering. booked column as boolean default false. created_at timestamp.  

**Verification:** Schema designed with all necessary columns

### Step 2: Create Supabase Database Tables

**Action:** Execute SQL to create tables  

**Supabase Dashboard:**  
Navigate to SQL Editor. Create new query. Write CREATE TABLE statement for trips with all columns. Add RLS enable statement. Write CREATE TABLE statement for trip_items with foreign key. Add RLS enable statement. Execute query.  

**Indexes:**  
Add index on trips.user_id for fast user trip queries. Add index on trip_items.trip_id for fast item lookups. Add index on trip_items.position for ordering.  

**Verification:** Tables appear in Supabase table editor

### Step 3: Configure Row Level Security Policies

**Action:** Restrict data access to trip owners only  

**Trips Table Policies:**  
SELECT policy: users can select trips where user_id equals auth.uid(). INSERT policy: users can insert trips with user_id equals auth.uid(). UPDATE policy: users can update trips where user_id equals auth.uid(). DELETE policy: users can delete trips where user_id equals auth.uid().  

**Trip Items Table Policies:**  
SELECT policy: users can select items where trip.user_id equals auth.uid() (join required). INSERT policy: users can insert items for trips they own. UPDATE policy: users can update items for trips they own. DELETE policy: users can delete items for trips they own.  

**SQL Pattern:**  
Use auth.uid() function to get current user ID. Join trip_items to trips in policies. Enable RLS with ALTER TABLE ... ENABLE ROW LEVEL SECURITY.  

**Verification:** RLS policies active, test queries respect ownership

### Step 4: Create TypeScript Types for Trips

**Action:** Define type definitions for trip data models  

**File - src/types/models.ts:**  
Export interface Trip with all trip table columns. Include id as string, user_id as string, destination as string, dates as Date objects, budget fields as numbers. Export interface TripItem with all item table columns. Export type TripItemType as union of 'event', 'restaurant', 'rental', 'custom'. Export interface TripWithItems extending Trip and adding items array.  

**Verification:** Types exported and importable

### Step 5: Create Trips API Client

**Action:** Build API functions for trip CRUD operations  

**File - src/lib/api/trips.ts:**  
Import supabase client. Export async function fetchTrips returning array of trips for current user. Export async function fetchTripById accepting trip ID and returning single trip with items. Export async function createTrip accepting trip data and returning created trip. Export async function updateTrip accepting ID and partial trip data. Export async function deleteTrip accepting ID.  

**Implementation Pattern:**  
Each function uses supabase.from('trips').select/insert/update/delete. Include error handling with try-catch. Return typed data or throw errors. Use TypeScript types from models.ts.  

**Verification:** API functions defined with proper types

### Step 6: Create Trip Items API Client

**Action:** Build API functions for itinerary item operations  

**File - src/lib/api/tripItems.ts:**  
Export async function createTripItem accepting trip ID and item data. Export async function updateTripItem accepting item ID and partial data. Export async function deleteTripItem accepting item ID. Export async function reorderTripItems accepting array of item IDs in new order.  

**Reorder Function:**  
Accept item IDs array. Loop through and update position column for each item. Use batch update or individual updates. Ensure atomic operation if possible.  

**Verification:** Item API functions defined

### Step 7: Create useTrips Custom Hook

**Action:** Build React hook for trips data fetching  

**File - src/features/trips/useTrips.ts:**  
Export custom hook using useState for trips array and loading state. Use useEffect to fetch trips on mount. Call fetchTrips API function. Set trips state with results. Handle errors. Return trips, loading, error, and refetch function.  

**Refetch Function:**  
Allow components to manually refresh trip list. Useful after creating or deleting trips.  

**Verification:** Hook exports and compiles

### Step 8: Create useTripDetail Custom Hook

**Action:** Build hook for single trip with items  

**File - src/features/trips/useTripDetail.ts:**  
Accept trip ID as parameter. Fetch trip with items on mount. Return trip, items, loading, error states. Provide functions: addItem, updateItem, deleteItem, reorderItems. Each function calls API and updates local state.  

**Optimistic Updates:**  
Update local state immediately before API call. Revert on error. This makes UI feel faster.  

**Verification:** Hook exports with all CRUD functions

### Step 9: Create Trips List Page

**Action:** Build page showing user's all trips  

**File - src/pages/trips/TripsListPage.tsx:**  
Use useTrips hook to fetch trips. Show loading skeleton while fetching. Display trips in grid layout (3 columns desktop, 2 tablet, 1 mobile). Each trip shown as TripCard component. Include "Create New Trip" button navigating to wizard. Show empty state if no trips exist.  

**Empty State:**  
Friendly message: "You haven't created any trips yet". Large "Create Your First Trip" button. Illustration or icon related to travel.  

**Verification:** List page renders trips or empty state

### Step 10: Create Trip Card Component

**Action:** Build card for trip list display  

**File - src/components/trips/TripCard.tsx:**  
Accept trip prop with trip data. Display destination as heading. Show date range in readable format. Show budget progress bar (spent / total). Show thumbnail image (placeholder for now). Include action buttons: View, Edit, Delete. Add hover animation lifting card.  

**Card Actions:**  
View button navigates to /app/trips/:tripId. Edit button opens edit modal or navigates to edit page. Delete button shows confirmation dialog.  

**Verification:** Card component renders trip data attractively

### Step 11: Create Trip Detail Page

**Action:** Build main trip view with itinerary  

**File - src/pages/trips/TripDetailPage.tsx:**  
Get trip ID from route params using useParams. Use useTripDetail hook with trip ID. Show trip header with destination, dates, edit button. Show itinerary section with drag-drop list. Show map section with locations pinned. Show budget tracker sidebar. Show AI suggestions panel if right panel open.  

**Layout:**  
Use grid or flex layout. Itinerary takes main column. Map and budget in sidebar or secondary column. Mobile stacks vertically.  

**Verification:** Detail page renders trip information

### Step 12: Install Drag-and-Drop Library

**Action:** Add react-dnd for itinerary reordering  

**Installation:**  
Run npm install react-dnd react-dnd-html5-backend. These packages provide drag-drop functionality.  

**Setup:**  
Wrap itinerary section with DndProvider component. Provide HTML5Backend. This enables drag-drop context.  

**Verification:** Library installed and importable

### Step 13: Create Draggable Itinerary Item

**Action:** Build drag-drop enabled item component  

**File - src/components/trips/ItineraryItem.tsx:**  
Accept item prop with trip item data. Use useDrag hook from react-dnd for drag source. Use useDrop hook for drop target. Show item title, time, location, cost. Include icons based on item type (calendar for event, utensils for restaurant). Add grab handle icon for drag indicator. Show checkmark if item booked.  

**Drag Behavior:**  
On drag, apply dragging opacity or style. On drop, trigger reorder callback. Provide visual feedback of drop zone.  

**Verification:** Item component draggable and droppable

### Step 14: Create Itinerary List Component

**Action:** Build list container for itinerary items  

**File - src/components/trips/ItineraryList.tsx:**  
Accept items array and onReorder callback. Map items to ItineraryItem components. Wrap with DndProvider. Handle reorder logic when item dropped. Call reorderTripItems API function. Update local state optimistically.  

**Grouping:**  
Group items by date. Show date headers. Allow dragging within same day or across days.  

**Add Item Button:**  
Include "+ Add Activity" button at bottom or between days. Opens add item modal or form.  

**Verification:** List renders items, reordering works

### Step 15: Create Add Item Modal

**Action:** Build form for adding new itinerary items  

**File - src/components/trips/AddItemModal.tsx:**  
Create modal dialog with form. Include fields: item type dropdown (event, restaurant, rental, custom), title input, description textarea, date picker, time picker, duration input, location input, cost input. On submit, call addItem function from useTripDetail hook. Close modal on success.  

**Validation:**  
Require title and date fields. Validate cost is positive number. Validate date within trip date range.  

**Verification:** Modal opens, form submits, item added to list

### Step 16: Create Wizard Entry Component

**Action:** Build wizard index redirecting to first step  

**File - src/pages/trips/WizardIndexPage.tsx:**  
Use useEffect to redirect to first wizard step. Navigate to /app/trips/new/wizard/basics (or similar path). This ensures wizard always starts at step 1.  

**Trip ID Handling:**  
If creating new trip, generate temporary ID or create trip skeleton. If editing, use existing trip ID.  

**Verification:** Visiting wizard root redirects to step 1

### Step 17: Create Wizard Step 1 - Basics

**Action:** Build trip basics form (destination, dates, title)  

**File - src/pages/trips/WizardBasicsPage.tsx:**  
Render WizardLayout wrapping form. Show step indicator: 1 of 5. Form fields: trip title input, destination input (consider autocomplete), start date picker, end date picker. Next button validates and navigates to step 2. Store data in wizard state or context.  

**Validation:**  
Require all fields. Ensure end date after start date. Enable next button only when valid.  

**Verification:** Step 1 renders, validates, advances to step 2

### Step 18: Create Wizard Step 2 - Preferences

**Action:** Build preferences selection (travel style, interests, budget)  

**File - src/pages/trips/WizardPreferencesPage.tsx:**  
Show step 2 of 5 indicator. Form fields: travel style radio buttons (luxury, moderate, budget), interests multi-select chips (food, art, nightlife, nature, culture), budget total input, currency dropdown. Previous button returns to step 1. Next button advances to step 3.  

**Multi-Select Chips:**  
Use shadcn Badge or custom chip components. Allow selecting multiple interests. Highlight selected chips.  

**Verification:** Step 2 renders, selections persist, navigates both directions

### Step 19: Create Wizard Step 3 - Activities

**Action:** Show AI-suggested activities based on preferences  

**File - src/pages/trips/WizardActivitiesPage.tsx:**  
Show step 3 of 5. Display activity cards suggested by AI (placeholder suggestions for now). Each card has image, title, description, add to trip button. Allow selecting multiple activities. Selected activities marked with checkmark. Previous and next navigation buttons.  

**AI Integration Placeholder:**  
For now, show static placeholder activities. Will connect to AI agents in Phase 10. Activities should match destination from step 1.  

**Verification:** Step 3 shows activity options, allows selection

### Step 20: Create Wizard Step 4 - Dining

**Action:** Show restaurant recommendations  

**File - src/pages/trips/WizardDiningPage.tsx:**  
Show step 4 of 5. Display restaurant cards (placeholder for now). Each card shows cuisine, price level, brief description. Add to trip button. Allow selecting multiple restaurants. Previous and next navigation.  

**Placeholder Data:**  
Show example restaurants matching destination. Will connect to real data in Phase 8.  

**Verification:** Step 4 shows dining options

### Step 21: Create Wizard Step 5 - Review

**Action:** Show trip summary and finalize creation  

**File - src/pages/trips/WizardReviewPage.tsx:**  
Show step 5 of 5. Display summary of trip: destination, dates, selected activities, selected restaurants, total estimated budget. Include edit links to go back to specific steps. Finish button creates trip in database. On success, redirect to new trip detail page.  

**Trip Creation:**  
Call createTrip API with all wizard data. Create trip items for selected activities and restaurants. Show success message. Navigate to /app/trips/:newTripId.  

**Verification:** Review shows summary, finish button creates trip

### Step 22: Add Map Integration

**Action:** Display locations on map in trip detail  

**Preparation:**  
Consider map library: react-leaflet (open source) or Google Maps. For now, plan integration but can defer implementation. Add map container div in trip detail layout.  

**Map Features:**  
Show pins for each itinerary item with location. Center map on trip destination. Allow clicking pin to highlight item in list. Show route between locations if possible.  

**Verification:** Map container present, ready for integration

### Step 23: Create Budget Tracker Component

**Action:** Build budget visualization  

**File - src/components/trips/BudgetTracker.tsx:**  
Accept trip prop with budget data. Show total budget, spent amount, remaining amount. Display progress bar or pie chart. Break down by category (accommodation, food, activities, transport). Show warning if approaching or over budget.  

**Visual Design:**  
Use cards or panels. Apply color coding: green for under budget, yellow for close, red for over. Large numbers for key metrics.  

**Verification:** Budget tracker shows trip financial status

### Step 24: Add Delete Trip Functionality

**Action:** Allow users to delete trips with confirmation  

**Implementation:**  
Add delete button to trip detail page. On click, show confirmation dialog. Dialog warns: "This will permanently delete this trip and all its items". Confirm and cancel buttons. On confirm, call deleteTrip API. On success, navigate back to trips list.  

**Cascade Delete:**  
Ensure trip_items deleted when trip deleted. Use ON DELETE CASCADE in foreign key constraint or handle in API function.  

**Verification:** Delete trip removes from database and redirects

### Step 25: Test Complete Trips Flow

**Action:** Verify end-to-end trip functionality  

**Testing Checklist:**  
Create new trip via wizard completing all 5 steps. Verify trip appears in list. Open trip detail, verify data matches wizard inputs. Add new item to itinerary via add button. Edit item details. Drag and drop items to reorder. Delete an item. Update trip budget. Delete entire trip. Create second trip to verify list shows multiple. Test on mobile responsive layout.  

**Verification:** All trip CRUD operations working smoothly

---

## VALIDATION CHECKLIST

### Database Setup

- [ ] trips table created in Supabase
- [ ] trip_items table created in Supabase
- [ ] RLS policies enabled on both tables
- [ ] RLS policies test successfully (users see only their trips)
- [ ] Indexes created for performance

### TypeScript Types

- [ ] Trip interface defined
- [ ] TripItem interface defined
- [ ] TripItemType enum or union defined
- [ ] Types exported from models.ts

### API Layer

- [ ] fetchTrips function implemented
- [ ] fetchTripById function implemented
- [ ] createTrip function implemented
- [ ] updateTrip function implemented
- [ ] deleteTrip function implemented
- [ ] createTripItem function implemented
- [ ] updateTripItem function implemented
- [ ] deleteTripItem function implemented
- [ ] reorderTripItems function implemented

### Custom Hooks

- [ ] useTrips hook created
- [ ] Hook provides trips, loading, error, refetch
- [ ] useTripDetail hook created
- [ ] Hook provides CRUD functions for items

### Components

- [ ] TripCard component created
- [ ] ItineraryList component created
- [ ] ItineraryItem component draggable
- [ ] AddItemModal component with form
- [ ] BudgetTracker component created

### Pages

- [ ] TripsListPage shows trips grid
- [ ] TripDetailPage shows full trip
- [ ] WizardBasicsPage (step 1) works
- [ ] WizardPreferencesPage (step 2) works
- [ ] WizardActivitiesPage (step 3) works
- [ ] WizardDiningPage (step 4) works
- [ ] WizardReviewPage (step 5) works

### Functionality

- [ ] Trips list loads user's trips
- [ ] Empty state shows when no trips
- [ ] Create trip button navigates to wizard
- [ ] Wizard steps navigate forward and back
- [ ] Wizard finish creates trip in database
- [ ] Trip detail loads with items
- [ ] Drag-drop reordering works
- [ ] Add item modal opens and submits
- [ ] Edit item functionality works
- [ ] Delete item functionality works
- [ ] Budget tracker displays correctly
- [ ] Delete trip with confirmation works
- [ ] Mobile layout responsive

---

## TROUBLESHOOTING

### Issue: RLS Policies Blocking Queries

**Symptom:** Queries return empty array despite trips existing  
**Cause:** RLS policy too restrictive or auth.uid() null  
**Solution:** Verify user authenticated when querying. Check RLS policy uses correct auth.uid() function. Test policy in Supabase SQL editor with sample user ID.

### Issue: Drag-Drop Not Working

**Symptom:** Items don't drag or drop doesn't trigger  
**Cause:** DndProvider not wrapping components or incorrect hooks  
**Solution:** Ensure DndProvider with HTML5Backend wraps itinerary list. Verify useDrag and useDrop hooks configured correctly. Check drag handle has mouse cursor pointer.

### Issue: Wizard State Not Persisting

**Symptom:** Going back in wizard loses entered data  
**Cause:** Form state not preserved across navigation  
**Solution:** Use React context or state management for wizard data. Alternative: store partial trip in database and update each step. Use React Router location state to pass data between steps.

### Issue: Date Picker Not Working

**Symptom:** Date fields don't open picker or don't update  
**Cause:** Date picker component not installed or configured  
**Solution:** Install date picker from shadcn: npx shadcn-ui add calendar. Use with Popover component for dropdown calendar. Ensure value and onChange props wired correctly.

### Issue: TypeScript Errors on Supabase Queries

**Symptom:** Type errors when calling supabase.from().select()  
**Cause:** Supabase doesn't know your table schema  
**Solution:** Generate TypeScript types from Supabase schema using Supabase CLI. Alternatively, manually type the returned data. Use type assertions if necessary but verify at runtime.

---

## NEXT PHASE PREVIEW

**Phase 7:** Build Events module with event exploration, filtering, calendar view, and event detail pages. Integrate with Supabase events table. Connect to trip itinerary builder.

**What You'll Need:** Trips module complete. Understanding of calendar libraries. Event data schema designed.

**Estimated Time:** 90-120 minutes

---

**Phase Status:** ✅ Ready to Execute  
**Last Updated:** December 24, 2024  
**Dependencies:** Phase 5 (auth for user association)  
**Blocks:** Phase 7 (events integrate with trips)
