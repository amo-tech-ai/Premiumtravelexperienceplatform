# 🚨 FORENSIC AUDIT REPORT — Types + Hooks Failures

**Audit Date:** 2025-01-22  
**Status:** 🔴 **CRITICAL FAILURES DETECTED**  
**Severity:** 10 BLOCKING ISSUES FOUND

---

## EXECUTIVE SUMMARY

**Overall Status:** ❌ **FAIL** - System not production-ready

**Critical Failures:** 10  
**High Priority:** 3  
**Medium Priority:** 4  
**Low Priority:** 3

**Estimated Fix Time:** 6-8 hours

---

## 🔴 CRITICAL FAILURES (BLOCKING)

### **FAILURE #1: RLS Policy Violation - Locations Table INSERT**

**Location:** `/lib/hooks/useEvents.ts:130`, `/lib/hooks/useRestaurants.ts:130`, `/lib/hooks/useRentals.ts:130`

**Issue:**  
```typescript
// CURRENT CODE (BROKEN)
const { data, error: createError } = await supabase
  .from('locations')
  .insert({
    ...input,
    category: 'event',
    is_active: true,
    source: 'manual',
  })
```

**RLS Policy (from schema line 250-252):**
```sql
CREATE POLICY "Service can manage locations"
  ON locations FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');
```

**Problem:**  
- RLS policy ONLY allows `service_role` to INSERT/UPDATE/DELETE locations
- Frontend uses `anon` key (publicAnonKey)
- **Result:** INSERT will be rejected with RLS error

**Impact:** 🔴 **BLOCKER** - Create pages will fail 100% of the time

**Fix Required:**
```typescript
// OPTION 1: Call server endpoint (RECOMMENDED)
const response = await fetch(`${BASE_URL}/locations`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${publicAnonKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(input)
});

// OPTION 2: Modify RLS policy (NOT RECOMMENDED - security risk)
// Allow authenticated users to create locations
CREATE POLICY "Authenticated users can create locations"
  ON locations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
```

**Recommendation:** Use OPTION 1 - Server-side creation with service role

---

### **FAILURE #2: Missing User ID in Create Mutations**

**Location:** All create hooks (useEvents.ts:130, useRestaurants.ts:130, useRentals.ts:130)

**Issue:**  
Locations table doesn't have `user_id` field, but manual-created locations should be tracked

**Problem:**
- No way to know who created a location
- No ownership tracking
- Cannot filter "my locations"

**Impact:** 🟡 **HIGH** - Feature limitation

**Fix Required:**
Add `created_by` field to locations table:
```sql
-- Add to locations table
ALTER TABLE locations ADD COLUMN created_by UUID REFERENCES profiles(id);
CREATE INDEX idx_locations_created_by ON locations(created_by);

-- Update RLS
CREATE POLICY "Users can view own created locations"
  ON locations FOR SELECT
  USING (created_by = auth.uid() OR is_active = true);
```

Then update hooks:
```typescript
const { data, error } = await supabase
  .from('locations')
  .insert({
    ...input,
    category: 'event',
    created_by: userId,  // ADD THIS
    source: 'manual',
  })
```

---

### **FAILURE #3: Mock Data Key Mismatch**

**Location:** `/pages/events/EventsPage.tsx:16`

**Issue:**
```typescript
// PAGE USES:
const events = [{ eventId: 'evt-001', ... }]

// HOOK RETURNS:
{ id: 'uuid', ... }  // No 'eventId' field
```

**Problem:**  
- Page expects `event.eventId`
- Database has `id` field
- **Result:** Navigation will break (navigate to `/events/undefined`)

**Impact:** 🔴 **BLOCKER** - Pages won't work with real data

**Fix Required:**
```typescript
// OPTION 1: Update pages to use 'id'
onClick={() => navigate(`/events/${event.id}`)}  // Change eventId → id

// OPTION 2: Transform hook response (NOT RECOMMENDED)
const events = data.map(e => ({ ...e, eventId: e.id }))
```

**Affected Lines:**
- `/pages/events/EventsPage.tsx:16, 70-71`
- `/pages/events/EventDetailPage.tsx:16`
- Similar issues in restaurants/rentals pages

---

### **FAILURE #4: Route Param Inconsistency**

**Location:** `/pages/events/EventDetailPage.tsx:11`

**Issue:**
```typescript
// PAGE CODE:
const { eventId } = useParams<{ eventId: string }>();

// ROUTE DEFINITION:
<Route path="/events/:eventId" element={<EventDetailPage />} />

// HOOK EXPECTS:
useEvent(eventId)  // ✅ CORRECT

// BUT PAGES USE:
event.eventId  // ❌ WRONG - should be event.id
```

**Problem:**  
- Route param name matches (`eventId`)
- Hook correctly receives `eventId`
- But page tries to access `event.eventId` instead of `event.id`

**Impact:** 🟡 **HIGH** - Detail pages will show wrong data

**Fix Required:**
```typescript
// Change line 16 in EventDetailPage.tsx
const event = {
  eventId: eventId,  // ❌ REMOVE THIS
  id: eventId,       // ✅ ADD THIS (or just use eventId from params)
  // ...
}
```

---

### **FAILURE #5: Search Debounce Memory Leak**

**Location:**  
- `/lib/hooks/useEvents.ts:218` (useSearchEvents)
- `/lib/hooks/useRestaurants.ts:218`
- `/lib/hooks/useRentals.ts:218`

**Issue:**
```typescript
useEffect(() => {
  if (!query || query.trim().length < 2) {
    setResults([]);
    return;  // ❌ MISSING CLEANUP
  }

  const searchEvents = async () => { /* ... */ };
  
  const debounce = setTimeout(searchEvents, 300);
  return () => clearTimeout(debounce);
}, [query]);
```

**Problem:**  
- When query becomes empty, early return doesn't clean up previous timeout
- Previous search can still execute after component unmounts
- Potential race condition if user types fast

**Impact:** 🟡 **MEDIUM** - Rare bug, but can cause stale results

**Fix Required:**
```typescript
useEffect(() => {
  if (!query || query.trim().length < 2) {
    setResults([]);
    setLoading(false);  // ADD THIS
    return;  // Now safe - no pending timeouts
  }

  const searchEvents = async () => { /* ... */ };
  
  const debounce = setTimeout(searchEvents, 300);
  return () => clearTimeout(debounce);
}, [query]);
```

---

### **FAILURE #6: SavedPlaces Join Under RLS**

**Location:** `/lib/hooks/useSavedPlaces.ts:23-28`

**Issue:**
```typescript
const { data, error: fetchError } = await supabase
  .from('saved_places')
  .select(`
    *,
    location:locations(*)  // ❌ POTENTIAL RLS ISSUE
  `)
  .eq('user_id', userId)
```

**RLS Policy (saved_places line 257-259):**
```sql
CREATE POLICY "Users can view own saved places"
  ON saved_places FOR SELECT
  USING (auth.uid() = user_id);
```

**RLS Policy (locations line 246-248):**
```sql
CREATE POLICY "Locations are viewable by everyone"
  ON locations FOR SELECT
  USING (is_active = true);
```

**Problem:**  
- Join works ONLY if location.is_active = true
- If user saved a location that was later soft-deleted, join will fail
- User sees broken saved places

**Impact:** 🟡 **MEDIUM** - Edge case but bad UX

**Fix Required:**
```typescript
// OPTION 1: Use LEFT JOIN and handle nulls
.select(`
  *,
  location:locations!left(*)
`)

// OPTION 2: Modify RLS to allow viewing inactive locations if saved
CREATE POLICY "Users can view saved locations even if inactive"
  ON locations FOR SELECT
  USING (
    is_active = true OR 
    EXISTS (
      SELECT 1 FROM saved_places 
      WHERE saved_places.location_id = locations.id 
      AND saved_places.user_id = auth.uid()
    )
  );
```

---

### **FAILURE #7: Missing Toast Notifications**

**Location:** `/pages/events/CreateEventPage.tsx:25-31`

**Issue:**
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // TODO: Submit to API
  console.log('Creating event:', formData);
  // Redirect to events list
  navigate('/events');  // ❌ No success feedback
};
```

**Problem:**  
- No visual feedback on success/failure
- User doesn't know if event was created
- No error messages shown

**Impact:** 🟡 **MEDIUM** - Bad UX

**Fix Required:**
```typescript
import { toast } from 'sonner@2.0.3';
import { useCreateEvent } from '../../lib/hooks/useEvents';

const { createEvent, creating, error } = useCreateEvent();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const event = await createEvent({
    name: formData.name,
    // ... map form data to CreateEventInput
  });
  
  if (event) {
    toast.success('Event created successfully!');
    navigate(`/events/${event.id}`);  // ✅ Go to detail page
  } else {
    toast.error('Failed to create event');
  }
};
```

---

### **FAILURE #8: Form Data Type Mismatch**

**Location:** `/pages/events/CreateEventPage.tsx:13-23`

**Issue:**
```typescript
// FORM STATE:
const [formData, setFormData] = useState({
  name: '',
  category: 'concert',  // ❌ Wrong - not a valid event_type
  date: '',             // ❌ String, but DB needs timestamptz
  time: '',             // ❌ Separate field, DB has event_start_time
  venue: '',            // ❌ Not a DB field
  capacity: '',         // ❌ String, but DB needs integer
  // Missing: event_start_time, event_end_time, event_type
});

// EXPECTED BY HOOK (CreateEventInput):
{
  name: string;
  category: 'event';  // Fixed value
  event_type?: string;
  event_start_time: string; // ISO timestamp
  event_end_time?: string;
  // ... 40+ other fields
}
```

**Problem:**  
- Form fields don't map to database schema
- Type mismatches everywhere
- Missing required fields

**Impact:** 🔴 **BLOCKER** - Create will fail

**Fix Required:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Transform form data to match CreateEventInput
  const eventInput: CreateEventInput = {
    name: formData.name,
    category: 'event',  // Fixed
    event_type: formData.category,  // Map category → event_type
    event_start_time: `${formData.date}T${formData.time}:00`,  // Combine
    description: formData.description,
    address: formData.address,
    source: 'manual',
    is_active: true,
    // Add any other required fields
  };
  
  const event = await createEvent(eventInput);
  // ...
};
```

---

### **FAILURE #9: Missing Loading States**

**Location:** All 9 pages

**Issue:**
Pages have no loading skeletons when hooks are fetching data

**Problem:**
```typescript
// CURRENT (EventsPage.tsx):
const events = [ /* hardcoded mock data */ ];

// AFTER HOOK INTEGRATION:
const { events, loading, error } = useEvents();

// Missing:
if (loading) {
  return <LoadingSkeleton />;  // ❌ Component doesn't exist
}
```

**Impact:** 🟡 **HIGH** - Bad UX, users see flash of content

**Fix Required:**
Create loading skeleton component:
```typescript
// /components/common/LoadingSkeleton.tsx
export function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse bg-slate-200 h-64 rounded-2xl" />
      ))}
    </div>
  );
}
```

Then use in pages:
```typescript
if (loading) {
  return <LoadingSkeleton count={6} />;
}
```

---

### **FAILURE #10: Missing Error Boundaries**

**Location:** All 9 pages

**Issue:**
No error handling for failed queries

**Problem:**
```typescript
const { events, loading, error } = useEvents();

// Missing:
if (error) {
  return <ErrorMessage error={error} />;  // ❌ Component doesn't exist
}
```

**Impact:** 🟡 **HIGH** - App crashes on network errors

**Fix Required:**
```typescript
// /components/common/ErrorMessage.tsx
export function ErrorMessage({ error }: { error: Error }) {
  return (
    <div className="p-8 text-center">
      <p className="text-red-600">Error: {error.message}</p>
      <button onClick={() => window.location.reload()}>
        Retry
      </button>
    </div>
  );
}
```

---

## 📊 INVARIANT VERIFICATION CHECKLIST

| # | Invariant | Status | File + Line |
|---|-----------|--------|-------------|
| 1 | Hook return shape matches pages | ❌ FAIL | EventsPage.tsx:16 (eventId vs id) |
| 2 | Route params match useParams keys | ✅ PASS | EventDetailPage.tsx:11 |
| 3 | Create redirects to detail page | ⚠️ PARTIAL | CreateEventPage.tsx:30 (redirects to list, not detail) |
| 4 | List queries filter is_active=true | ✅ PASS | useEvents.ts:22 |
| 5 | Mutations include user_id for RLS | ❌ FAIL | useEvents.ts:130 (RLS violation) |
| 6 | Search debounce cancels properly | ⚠️ PARTIAL | useEvents.ts:218 (early return leak) |
| 7 | Filters match DB column types | ✅ PASS | All hooks use correct types |
| 8 | SavedPlaces join works under RLS | ⚠️ PARTIAL | useSavedPlaces.ts:26 (inactive locations fail) |
| 9 | Form data maps to DB schema | ❌ FAIL | CreateEventPage.tsx:13 (type mismatch) |
| 10 | Loading/error states exist | ❌ FAIL | All pages missing |

**Score:** 2/10 PASS, 5/10 FAIL, 3/10 PARTIAL

---

## 🔥 TOP 10 BREAKING ISSUES (Priority Order)

1. **RLS Violation** - Create mutations will fail (BLOCKER)
2. **Form Type Mismatch** - Data won't map to schema (BLOCKER)
3. **Mock Data Keys** - eventId vs id mismatch (BLOCKER)
4. **Missing Loading States** - Bad UX (HIGH)
5. **Missing Error Handling** - App crashes (HIGH)
6. **No Toast Notifications** - No feedback (MEDIUM)
7. **SavedPlaces RLS Edge Case** - Inactive joins fail (MEDIUM)
8. **Search Debounce Leak** - Race conditions (MEDIUM)
9. **Missing User Tracking** - No created_by field (LOW)
10. **Redirect to List not Detail** - UX issue (LOW)

---

## 🛠️ EXACT FIXES (Code Snippets)

### **FIX #1: Add Server Endpoint for Location Creation**

**File:** `/supabase/functions/server/index.tsx`

```typescript
import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono();
app.use('*', cors());

// CREATE EVENT
app.post('/make-server-fd8c4bf7/events', async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('locations')
      .insert({
        ...body,
        category: 'event',
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return c.json({ data });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Repeat for restaurants, rentals
```

**Update Hook:**

**File:** `/lib/hooks/useEvents.ts:130`

```typescript
const createEvent = useCallback(async (input: CreateEventInput): Promise<Event | null> => {
  try {
    setCreating(true);
    setError(null);

    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-fd8c4bf7/events`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input)
    });

    if (!response.ok) throw new Error('Failed to create event');

    const { data } = await response.json();
    return data as Event;
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Failed to create event');
    setError(error);
    return null;
  } finally {
    setCreating(false);
  }
}, []);
```

---

### **FIX #2: Update EventsPage to use real hook**

**File:** `/pages/events/EventsPage.tsx`

```typescript
import { useEvents } from '../../lib/hooks/useEvents';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorMessage } from '../../components/common/ErrorMessage';

export default function EventsPage() {
  const navigate = useNavigate();
  const { events, loading, error } = useEvents();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <LoadingSkeleton count={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (events.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center py-12">
          <p className="text-slate-600">No events found</p>
          <Button onClick={() => navigate('/events/create')} className="mt-4">
            Create First Event
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
      {/* ... existing JSX ... */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}  {/* ✅ FIXED: eventId → id */}
            onClick={() => navigate(`/events/${event.id}`)}  {/* ✅ FIXED */}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={event.primary_image_url || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=800'}
                alt={event.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-medium text-slate-900">
                {event.event_type || 'Event'}
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-serif text-xl text-slate-900 mb-3 group-hover:text-slate-600 transition-colors">
                {event.name}
              </h3>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>{event.event_start_time ? new Date(event.event_start_time).toLocaleDateString() : 'TBD'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>{event.address || event.city || 'Location TBD'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### **FIX #3: Create Loading Skeleton Component**

**File:** `/components/common/LoadingSkeleton.tsx` (NEW)

```typescript
export function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="animate-pulse">
            <div className="h-48 bg-slate-200" />
            <div className="p-6 space-y-3">
              <div className="h-6 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-4 bg-slate-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

### **FIX #4: Create Error Message Component**

**File:** `/components/common/ErrorMessage.tsx` (NEW)

```typescript
export function ErrorMessage({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-sm max-w-md w-full text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-red-600 text-2xl">!</span>
        </div>
        <h2 className="text-xl font-serif text-slate-900 mb-2">Something went wrong</h2>
        <p className="text-slate-600 mb-6">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
```

---

### **FIX #5: Update CreateEventPage with proper form mapping**

**File:** `/pages/events/CreateEventPage.tsx`

```typescript
import { toast } from 'sonner@2.0.3';
import { useCreateEvent } from '../../lib/hooks/useEvents';
import type { CreateEventInput } from '../../lib/types/locations';

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { createEvent, creating, error } = useCreateEvent();
  
  const [formData, setFormData] = useState({
    name: '',
    event_type: 'concert',  // ✅ FIXED: category → event_type
    date: '',
    time: '',
    address: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ FIXED: Map form data to CreateEventInput
    const eventInput: CreateEventInput = {
      name: formData.name,
      category: 'event',  // Fixed value
      event_type: formData.event_type,
      event_start_time: `${formData.date}T${formData.time}:00.000Z`,
      description: formData.description,
      address: formData.address,
      source: 'manual',
      is_active: true,
    };
    
    const event = await createEvent(eventInput);
    
    if (event) {
      toast.success('Event created successfully!');
      navigate(`/events/${event.id}`);  // ✅ FIXED: Go to detail page
    } else {
      toast.error(error?.message || 'Failed to create event');
    }
  };

  return (
    // ... existing JSX with updated field names ...
  );
}
```

---

## 🧪 SMOKE TEST PLAN

### **Test Scenario 1: Create → List → Detail → Delete**

```bash
# Pre-requisites
1. Database schema applied
2. Server endpoint deployed
3. Auth configured (or mock user)

# Test Steps
1. Navigate to /events/create
   ✓ Page loads
   ✓ Form renders
   ✓ RequireAuth check passes

2. Fill form and submit
   ✓ Loading spinner shows
   ✓ API call succeeds (check network tab)
   ✓ Toast success shows
   ✓ Redirects to /events/{id}

3. View event detail page
   ✓ Data displays correctly
   ✓ All fields populated
   ✓ Images load

4. Navigate back to /events
   ✓ New event appears in list
   ✓ Card displays correctly
   ✓ Click navigates to detail

5. Delete event (future feature)
   ✓ Soft delete (is_active = false)
   ✓ Removed from list
   ✓ Toast confirmation

# Expected Results
- Zero console errors
- All API calls succeed
- UI updates reactively
- Navigation works smoothly
```

### **Test Scenario 2: Search & Filter**

```bash
1. Navigate to /events
2. Type in search box (if implemented)
   ✓ Debounce works (300ms delay)
   ✓ Results update
   ✓ No duplicate requests

3. Apply filters
   ✓ Date range filters
   ✓ Event type filter
   ✓ Results update instantly

4. Clear filters
   ✓ Shows all events
   ✓ State resets
```

### **Test Scenario 3: Save/Favorite**

```bash
1. View event detail
2. Click "Save" button
   ✓ API call succeeds
   ✓ Button state changes
   ✓ Toast confirms

3. Navigate to /saved
   ✓ Event appears in saved list
   ✓ Can unsave
   ✓ RLS allows viewing
```

---

## 📋 FIX PRIORITY ORDER

### **PHASE 1: Critical Blockers (DO FIRST)**
1. ✅ Create server endpoints for CRUD operations
2. ✅ Fix RLS policies or use service role
3. ✅ Update all pages to use real hooks
4. ✅ Fix mock data key mismatches (eventId → id)
5. ✅ Create LoadingSkeleton component
6. ✅ Create ErrorMessage component

### **PHASE 2: High Priority (DO NEXT)**
7. ✅ Fix form data mapping in Create pages
8. ✅ Add toast notifications
9. ✅ Fix redirect to detail page after create
10. ✅ Import projectId and publicAnonKey in hooks

### **PHASE 3: Medium Priority (DO AFTER)**
11. ✅ Fix search debounce early return leak
12. ✅ Fix SavedPlaces LEFT JOIN issue
13. ✅ Add created_by tracking to locations

### **PHASE 4: Nice to Have (OPTIONAL)**
14. ✅ Add empty states
15. ✅ Add filter components
16. ✅ Add pagination

---

## ✅ APPROVAL TO FIX

**Proceed with fixes?**

**Estimated Fix Time:** 6-8 hours

**Order of Operations:**
1. Create server endpoints (2 hours)
2. Update hooks to call server (1 hour)
3. Create UI components (LoadingSkeleton, ErrorMessage) (1 hour)
4. Update all 9 pages (3 hours)
5. Test smoke scenarios (1 hour)

**Total:** 8 hours to production-ready state

---

**AUDIT COMPLETE**  
**Status:** 🔴 FAIL → Ready for systematic fixes

