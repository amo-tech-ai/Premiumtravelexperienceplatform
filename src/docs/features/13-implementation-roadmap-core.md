# 13 - Core Implementation Roadmap (Week 1-2)

**Status:** 🔴 CRITICAL PATH - Must Complete Before All Other Features  
**Current State:** 35% Complete (UI only, no backend)  
**Target:** 100% Core Foundation Production Ready

---

## 🚨 Critical Gaps Identified

### Missing Infrastructure (Blocks Everything)

**❌ No Supabase Integration:**
- Context providers use localStorage (data lost on clear)
- No database persistence
- No user authentication
- No Row Level Security

**❌ No AI Integration:**
- Intent detection uses keyword matching (not Gemini Thinking)
- Responses are hardcoded mock strings
- No real AI agent implementations

**❌ No Type Safety:**
- Missing database types
- Missing API response types
- Inconsistent interfaces across contexts

---

## ✅ Week 1: Core Backend Infrastructure

### Day 1-2: Supabase Foundation

**Files to Create:**

**1. `/lib/supabase/client.ts`** (Supabase Client Wrapper)
```typescript
Purpose: Initialize Supabase client with environment variables
Exports: supabase client instance
Dependencies: @supabase/supabase-js
Validation: Client connects successfully to project
```

**2. `/lib/supabase/types.ts`** (Database Types)
```typescript
Purpose: TypeScript interfaces for all 15 database tables
Exports: Database, Tables, User, Trip, ItineraryDay, etc.
Source: Generated from Supabase schema
Validation: Types match actual database columns
```

**3. `/lib/supabase/queries.ts`** (Database Query Helpers)
```typescript
Purpose: Reusable query functions (getTrips, createTrip, updateItinerary)
Exports: Query functions with error handling
Pattern: async/await with try/catch
Validation: All queries respect RLS policies
```

**Implementation Steps:**
1. Run `npx supabase init` to create local Supabase instance
2. Create migration file from Doc 04 schema (15 tables)
3. Apply migration: `npx supabase db push`
4. Generate types: `npx supabase gen types typescript > lib/supabase/types.ts`
5. Create client wrapper with error handling
6. Test connection: query users table, verify RLS works

**Success Criteria:**
- [ ] Supabase client connects without errors
- [ ] All 15 tables created with correct schema
- [ ] RLS policies enforce user isolation
- [ ] Types generated and imported successfully

---

### Day 3-4: Authentication System

**Files to Create:**

**4. `/lib/auth/AuthContext.tsx`** (Authentication Provider)
```typescript
Purpose: Manage user session, login/logout, protected routes
Exports: AuthContext, useAuth hook, user state
Methods: signUp, signIn, signOut, getCurrentUser
Validation: JWT tokens work, session persists
```

**5. `/lib/auth/ProtectedRoute.tsx`** (Route Guard Component)
```typescript
Purpose: Redirect unauthenticated users to login
Props: children (React element)
Logic: Check session, redirect if null, render if valid
Validation: Protected routes block access correctly
```

**6. `/components/auth/LoginForm.tsx`** (Login UI)
```typescript
Purpose: Email/password login form
Fields: email (text), password (password)
Validation: Email format, password min 8 chars
Submit: Call signIn, handle errors, redirect to dashboard
```

**7. `/components/auth/SignupForm.tsx`** (Signup UI)
```typescript
Purpose: New user registration
Fields: email, password, confirm password
Validation: Passwords match, email unique
Submit: Call signUp, redirect to onboarding
```

**Implementation Steps:**
1. Enable email provider in Supabase dashboard
2. Create AuthContext with Supabase auth.getSession()
3. Subscribe to auth state changes (auth.onAuthStateChange)
4. Build LoginForm with validation (react-hook-form)
5. Build SignupForm with matching password check
6. Wrap protected routes in App.tsx with ProtectedRoute
7. Test: signup new user, login, access protected route

**Success Criteria:**
- [ ] Users can signup with email/password
- [ ] Login works, JWT stored correctly
- [ ] Protected routes redirect to /login when not authenticated
- [ ] Session persists on page refresh

---

### Day 5: Migrate TripContext to Supabase

**Files to Modify:**

**8. `/context/TripContext.tsx`** (Replace localStorage with Supabase)
```typescript
Changes:
- Remove INITIAL_EVENTS/STAYS/EXPERIENCES mock data
- Replace useState with Supabase queries
- createTrip: Insert into trips table
- getTrips: Select from trips table where user_id = current user
- updateItinerary: Update itinerary_items table
- deleteTrip: Delete with cascade
- Subscribe to Realtime for collaborative editing
Validation: All operations persist to database
```

**Implementation Steps:**
1. Create `useTrips` hook that fetches from Supabase
2. Replace mock data with real queries
3. Add loading states (show skeletons while fetching)
4. Add error handling (show toast on failure)
5. Implement optimistic updates (update UI immediately, rollback on error)
6. Add Realtime subscription for itinerary_items table
7. Test: Create trip, add items, verify persistence

**Success Criteria:**
- [ ] Trips load from database on component mount
- [ ] New trips persist after page refresh
- [ ] Itinerary changes sync in real-time
- [ ] No data loss, all operations atomic

---

### Day 6-7: Core Database Operations

**Files to Create:**

**9. `/lib/supabase/trips.ts`** (Trip CRUD Operations)
```typescript
Functions:
- createTrip(data): Insert trip, return trip object
- getTrips(userId): Select all user's trips
- updateTrip(id, data): Update trip details
- deleteTrip(id): Delete trip (cascade to days/items)
- getTripById(id): Get single trip with days and items
Error Handling: try/catch, return { data, error }
Validation: All functions check RLS policies
```

**10. `/lib/supabase/itinerary.ts`** (Itinerary Operations)
```typescript
Functions:
- addItineraryItem(dayId, item): Insert item, increment order_index
- updateItineraryItem(id, data): Update item fields
- deleteItineraryItem(id): Remove item
- reorderItems(dayId, items): Bulk update order_index
- getItineraryForTrip(tripId): Fetch all days and items
Optimization: Use batch operations, minimize round-trips
```

**11. `/lib/supabase/realtime.ts`** (Realtime Subscriptions)
```typescript
Functions:
- subscribeToItinerary(tripId, callback): Listen for changes
- unsubscribeFromItinerary(subscription): Clean up
- broadcastChange(tripId, change): Notify other users
Pattern: useEffect subscription, cleanup on unmount
```

**Implementation Steps:**
1. Create trip CRUD functions with full error handling
2. Create itinerary operations with order management
3. Set up Realtime subscription helper
4. Test each function in isolation
5. Integration test: full trip creation flow
6. Load test: 100 itinerary items, verify performance

**Success Criteria:**
- [ ] All CRUD operations work correctly
- [ ] Batch updates are atomic (all or nothing)
- [ ] Realtime updates appear within 1 second
- [ ] Error messages are user-friendly

---

## ✅ Week 2: AI Foundation & First Agent

### Day 8-9: Gemini API Integration

**Files to Create:**

**12. `/lib/ai/gemini-client.ts`** (Gemini API Wrapper)
```typescript
Purpose: Initialize Gemini client, call API methods
Exports: generateText, classifyIntent, executeCode, getStructuredOutput
Config: API key from env, model selection (3.0 Pro vs Flash)
Error Handling: Timeout, quota exceeded, invalid response
```

**13. `/lib/ai/intent-classifier.ts`** (Intent Detection)
```typescript
Purpose: Replace keyword matching with Gemini Thinking
Input: User message, conversation history
Output: Intent (DINING, ITINERARY, BUDGET, etc.), confidence score
Prompt: Use Doc 08 intent classification template
Validation: 95%+ accuracy on test set
```

**14. `/lib/ai/response-synthesizer.ts`** (Natural Language Generation)
```typescript
Purpose: Generate conversational responses (not robotic)
Input: Agent outputs, user profile, context
Output: Human-like text with personality
Templates: By intent type (Doc 08 examples)
Validation: Responses feel natural, not generic
```

**Implementation Steps:**
1. Add VITE_GEMINI_API_KEY to .env
2. Install @google-cloud/generative-ai package
3. Create Gemini client wrapper with retry logic
4. Implement intent classifier using Gemini Thinking
5. Replace AIContext.detectIntent with Gemini version
6. Implement response synthesizer
7. Test with 20 real user messages

**Success Criteria:**
- [ ] Intent classification 95%+ accurate
- [ ] Responses generated in under 2 seconds
- [ ] Gemini API errors handled gracefully
- [ ] Multi-turn conversations maintain context

---

### Day 10-12: First AI Agent (Itinerary Optimizer)

**Files to Create:**

**15. `/lib/ai/agents/itinerary-optimizer.ts`** (Optimizer Agent)
```typescript
Purpose: Route optimization, conflict detection, budget allocation
Inputs: Itinerary items array, user preferences, constraints
Functions:
- optimizeRoute: Reorder by proximity (Code Execution: Haversine)
- detectConflicts: Find time overlaps
- suggestImprovements: Generate recommendations
Gemini Features: Code Execution (distance calc), Thinking (logic), Structured Outputs
Validation: Saves 30+ minutes on average trip
```

**16. `/lib/ai/utils/distance.ts`** (Distance Calculations)
```typescript
Purpose: Calculate distance between coordinates
Formula: Haversine (accounts for Earth curvature)
Input: Two lat/lng pairs
Output: Distance in kilometers
Validation: NYC to LA = 3944 km (±50 km)
```

**17. `/components/trip/OptimizationModal.tsx`** (Optimization UI)
```typescript
Purpose: Show suggestions, before/after timeline
Sections: Savings summary, suggestion cards, apply button
Props: suggestions array, onApply callback
Design: From Doc 01 Prompt 1-3 (Figma Make)
```

**Implementation Steps:**
1. Implement Haversine distance function
2. Create optimizer agent with route clustering
3. Build conflict detection (check time overlaps)
4. Implement budget allocation algorithm
5. Create Edge Function: /api/optimize-itinerary
6. Build OptimizationModal UI component
7. Connect button in itinerary to trigger optimization
8. Test with 5 sample itineraries

**Success Criteria:**
- [ ] Optimizer reduces travel time by 20%+ on average
- [ ] Conflict detection catches 100% of overlaps
- [ ] Suggestions have human-readable explanations
- [ ] Users accept 50%+ of suggestions

---

### Day 13-14: Integration & Testing

**Files to Create:**

**18. `/lib/supabase/edge-functions/optimize-itinerary.ts`** (Edge Function)
```typescript
Purpose: Server-side optimization (secure Gemini API key)
Endpoint: POST /functions/v1/optimize-itinerary
Input: trip_id, optimization_type
Process: Fetch trip, call optimizer agent, return suggestions
Security: Verify JWT, check user owns trip
```

**19. `/tests/integration/optimizer.test.ts`** (Integration Tests)
```typescript
Tests:
- Optimizer reduces distance by 20%+
- Conflicts detected accurately
- Budget allocation stays within limit
- Edge function returns valid JSON
Coverage: Critical paths 100%
```

**Implementation Steps:**
1. Create Edge Function with Deno runtime
2. Deploy to Supabase: `supabase functions deploy`
3. Connect frontend to Edge Function
4. Write integration tests
5. Run tests in CI/CD pipeline
6. Performance test: optimize 50-item itinerary in <5 seconds

**Success Criteria:**
- [ ] Edge Function deployed successfully
- [ ] All integration tests pass
- [ ] Performance meets targets (<5 sec for 50 items)
- [ ] Error handling covers all edge cases

---

## 📊 Production Readiness Checklist (Week 1-2)

### Backend Infrastructure ✅
- [ ] Supabase project created and configured
- [ ] 15 database tables created with schema from Doc 04
- [ ] RLS policies enforce user data isolation
- [ ] Database types generated and synced
- [ ] Query helpers handle all CRUD operations
- [ ] Realtime subscriptions work for collaborative editing

### Authentication ✅
- [ ] Users can signup with email/password
- [ ] Login works, sessions persist on refresh
- [ ] Protected routes redirect correctly
- [ ] JWT tokens refresh before expiry
- [ ] Password reset flow functional
- [ ] Social OAuth (Google) optional for MVP

### Data Migration ✅
- [ ] TripContext migrated from localStorage to Supabase
- [ ] All trips persist to database
- [ ] Itinerary changes sync in real-time
- [ ] No data loss during transition
- [ ] Optimistic updates improve perceived performance

### AI Integration ✅
- [ ] Gemini API client configured with API key
- [ ] Intent classification uses Gemini Thinking (95%+ accuracy)
- [ ] Response synthesis generates natural language
- [ ] Multi-turn conversations maintain context
- [ ] Error handling for API failures

### First AI Agent ✅
- [ ] Itinerary Optimizer agent implemented
- [ ] Distance calculations accurate (Haversine formula)
- [ ] Route optimization reduces travel time 20%+
- [ ] Conflict detection catches 100% of overlaps
- [ ] Edge Function deployed and functional

### Testing ✅
- [ ] Unit tests for distance calculations
- [ ] Integration tests for optimizer
- [ ] E2E test for full optimization flow
- [ ] Performance tests meet targets
- [ ] CI/CD pipeline blocks failing tests

---

## 🚀 Next Steps After Week 2

**Week 3:** Implement Local Scout (Doc 02) and Dining Orchestrator (Doc 03)  
**Week 4:** Implement Budget Guardian (Doc 05) and Booking Assistant (Doc 06)  
**Week 5:** Implement Group Coordination (Doc 07) and Mobile Optimization (Doc 09)  
**Week 6:** Production deployment (Doc 10) and comprehensive testing (Doc 12)

---

**Critical Success Factors:**
1. ✅ Follow Doc 04 prompts sequentially (don't skip steps)
2. ✅ Test each component in isolation before integration
3. ✅ Commit to Git after each working feature (rollback safety)
4. ✅ Update progress tracker daily (visibility for team)
5. ✅ Block bad code with CI/CD quality gates (prevent regression)

**Dependencies:**
- Supabase account created (Day 1)
- Gemini API key acquired (Day 8)
- Environment variables configured (Days 1, 8)
- Git repository with CI/CD pipeline (Day 13)

**Document Owner:** Engineering Team  
**Validation:** Daily standup review, end-of-week demo to stakeholders
