# 12 - Testing Strategy Implementation Plan

**Feature:** Automated Testing, QA Processes, CI/CD Quality Gates  
**Priority:** High (Phase 2-4, ongoing)  
**Owner:** QA Team + Engineering  
**Stack:** Jest, React Testing Library, Playwright, Lighthouse CI

---

## Progress Tracker

| Phase | Task | Status | Owner | Validation |
|-------|------|--------|-------|-----------|
| **Unit Tests** | Core utility functions | 🔴 Not Started | Cursor AI | 80% code coverage |
| **Integration** | API and database tests | 🔴 Not Started | Cursor AI | All endpoints tested |
| **E2E Tests** | Critical user flows | 🔴 Not Started | QA Team | 10 scenarios pass |
| **CI Integration** | Tests run on every PR | 🔴 Not Started | DevOps | Blocks failing PRs |
| **Performance** | Lighthouse CI checks | 🔴 Not Started | DevOps | Score 90+ enforced |

---

## 1. Testing Goal

**Problem:** No automated tests means bugs reach production, manual testing is slow and inconsistent.

**Solution:** Comprehensive test suite covering unit, integration, E2E tests with CI/CD integration that blocks bad deployments.

**Outcome:** Catch 90% of bugs before production, deploy with confidence, faster development velocity.

**Success Metric:** 80% code coverage, zero critical bugs in production, 95% test pass rate.

---

## 2. Testing Pyramid

### Level 1: Unit Tests (70% of tests)

**What to Test:**
- Utility functions: distance calculations, budget math, date parsing
- React components: render correctly, handle props, respond to events
- Helper functions: form validation, data transformations

**Example Test Cases:**

**Distance Calculation (from Doc 01):**
```
Test: calculateDistance between NYC and LA
Expected: 3944 km (±50 km tolerance)
Test: calculateDistance same location
Expected: 0 km
Test: calculateDistance invalid coordinates
Expected: throw error or return null
```

**Budget Calculation (from Doc 05):**
```
Test: budget 800, spent 420, remaining should equal 380
Test: budget 500, spent 550, remaining should be negative -50
Test: budget forecasting with 3 days data predicts Day 5 accurately
```

**Intent Classification (from Doc 08):**
```
Test: "Find me a restaurant" → intent DINING (confidence >0.9)
Test: "Am I over budget?" → intent BUDGET (confidence >0.9)
Test: "What's happening tonight?" → intent EVENT_DISCOVERY (confidence >0.9)
```

---

### Level 2: Integration Tests (20% of tests)

**What to Test:**
- API endpoints: Edge Functions return correct responses
- Database operations: Supabase queries work correctly
- Third-party integrations: Gemini API, Google Maps API

**Example Test Cases:**

**Supabase Integration:**
```
Test: Create trip → trip appears in database with correct user_id
Test: Update itinerary item → change persists, Realtime broadcasts update
Test: Delete trip → cascades to itinerary_days and itinerary_items
Test: RLS policies → User A cannot access User B's trips
```

**Edge Function (Itinerary Optimizer):**
```
Test: POST /api/optimize with valid trip_id → returns suggestions JSON
Test: POST /api/optimize with invalid trip_id → returns 404
Test: POST /api/optimize without auth → returns 401
Test: POST /api/optimize with expired JWT → refreshes token and succeeds
```

**Gemini API Integration:**
```
Test: Call Gemini Thinking with intent prompt → returns structured output
Test: Call Gemini Code Execution with distance calc → returns numeric result
Test: Handle Gemini API timeout → returns cached result or friendly error
```

---

### Level 3: End-to-End Tests (10% of tests)

**What to Test:**
- Critical user flows from start to finish
- Multi-step processes: signup → onboarding → create trip → optimize → book

**Example Test Cases:**

**Flow 1: New User Signup to First Booking**
```
Step 1: Visit homepage, click "Get Started"
Step 2: Fill signup form (email, password), submit
Step 3: Complete onboarding wizard (5 steps)
Step 4: Create first trip (Medellín, Jan 14-19)
Step 5: Add Comuna 13 tour to Day 2
Step 6: Click "Optimize Itinerary"
Step 7: Accept optimization suggestion
Step 8: Search restaurants for dinner
Step 9: Click "Book Table" at Carmen
Step 10: Verify booking confirmation appears
Expected: All steps complete without errors, booking saved to database
```

**Flow 2: Budget Alert Workflow**
```
Step 1: User has trip with 400 budget for dining
Step 2: Add 3 restaurants totaling 320 (80% of budget)
Step 3: Try to add 4th restaurant (100, would exceed budget)
Step 4: Alert modal appears: "You'll exceed budget by 20"
Step 5: User clicks "Optimize Budget"
Step 6: System suggests cheaper alternative
Step 7: User accepts swap
Step 8: Budget stays within limit
Expected: Alert triggers correctly, optimization works, user stays under budget
```

**Flow 3: Group Trip Collaboration**
```
Step 1: User A creates trip, invites User B (via email)
Step 2: User B accepts invitation, joins trip
Step 3: User B adds activity to Day 2
Step 4: User A sees change in real-time (Realtime subscription)
Step 5: User A creates poll: "Where should we eat?"
Step 6: Both users vote
Step 7: System detects consensus, adds winner to itinerary
Expected: Real-time sync works, poll results accurate, no conflicts
```

---

## 3. Testing Tools Setup

### Jest (Unit Tests)

**Install:**
```
npm install --save-dev jest @types/jest ts-jest
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm install --save-dev @testing-library/user-event
```

**Config (jest.config.js):**
- Test environment: jsdom (for React components)
- Coverage threshold: 80% minimum
- Test match pattern: `**/*.test.ts` or `**/*.test.tsx`
- Setup files: mock Supabase client, mock Gemini API

**Mock Strategy:**
- Mock Supabase: return predefined data (avoid hitting real database in tests)
- Mock Gemini API: return sample responses (avoid API costs)
- Mock Google Maps API: return sample place data

---

### Playwright (E2E Tests)

**Install:**
```
npm install --save-dev @playwright/test
npx playwright install chromium firefox webkit
```

**Config (playwright.config.ts):**
- Base URL: `http://localhost:5173` (dev) or `https://preview-url.vercel.app` (CI)
- Browsers: Chromium (Chrome), Firefox, Webkit (Safari)
- Retry failed tests: 2 attempts
- Screenshot on failure: yes
- Video on failure: yes

**Test Organization:**
- `/tests/e2e/auth.spec.ts`: signup, login, password reset
- `/tests/e2e/trip-planning.spec.ts`: create trip, add items, optimize
- `/tests/e2e/booking.spec.ts`: search restaurants, book table
- `/tests/e2e/group.spec.ts`: invite users, collaborate, polls

---

### Lighthouse CI (Performance Tests)

**Install:**
```
npm install --save-dev @lhci/cli
```

**Config (.lighthouserc.js):**
- URLs to test: homepage, dashboard, trip details
- Assertions: performance >90, accessibility >95
- Collect: 3 runs per URL (average scores)
- Upload results: Lighthouse CI server or GitHub PR comments

---

## 4. CI/CD Integration (GitHub Actions)

### Test Workflow (.github/workflows/test.yml)

**Trigger:** On every pull request and push to main

**Jobs:**

**Job 1: Lint**
- Run ESLint on all TypeScript files
- Fail if any errors (warnings allowed)

**Job 2: Unit Tests**
- Run Jest tests
- Generate coverage report
- Fail if coverage <80%
- Upload coverage to Codecov (optional)

**Job 3: Integration Tests**
- Spin up Supabase local instance (Docker)
- Run database migrations
- Run API tests against local Supabase
- Tear down after tests

**Job 4: E2E Tests**
- Deploy preview to Vercel (automatic on PR)
- Wait for deployment to complete
- Run Playwright tests against preview URL
- Upload screenshots and videos as artifacts if failed
- Comment test results on PR

**Job 5: Lighthouse CI**
- Run Lighthouse on preview URL
- Check performance budget
- Fail if score <90
- Comment scores on PR

**Gate:** All jobs must pass before PR can be merged

---

## 5. Test Data Management

### Strategy: Seed Data for Tests

**Problem:** Tests need consistent, realistic data

**Solution:** Create seed scripts that populate test database with sample trips, users, restaurants

**Seed Data Files:**

**users.seed.json:**
```
[
  {
    "id": "test-user-1",
    "email": "test@example.com",
    "full_name": "Test User",
    "onboarding_completed": true
  }
]
```

**trips.seed.json:**
```
[
  {
    "id": "test-trip-1",
    "user_id": "test-user-1",
    "destination_city": "Medellín",
    "start_date": "2026-01-14",
    "end_date": "2026-01-19",
    "budget_total": 800
  }
]
```

**restaurants.seed.json:**
```
[
  {
    "id": "test-restaurant-1",
    "name": "Carmen",
    "google_place_id": "ChIJ123",
    "cuisine_types": ["Colombian", "Contemporary"],
    "price_level": 3,
    "rating": 4.8
  }
]
```

**Setup Script (before each test suite):**
1. Clear test database
2. Run seed scripts to populate data
3. Tests run against known data state
4. Teardown: clear database after tests

---

## 6. Critical Test Scenarios (Priority Order)

### Priority 1: Authentication (Blocks all other features)

**Test:** User signup with email/password
**Test:** User login with valid credentials
**Test:** Login fails with invalid credentials
**Test:** Password reset email sent successfully
**Test:** Protected routes redirect to login when not authenticated
**Test:** JWT token refresh works before expiry

---

### Priority 2: Trip Creation (Core feature)

**Test:** User creates new trip with valid data
**Test:** Trip appears in database with correct user_id
**Test:** Itinerary days auto-created based on date range
**Test:** RLS policy: User cannot see other users' trips

---

### Priority 3: Itinerary Management (Core feature)

**Test:** Add activity to itinerary
**Test:** Drag-and-drop reorder items
**Test:** Delete itinerary item
**Test:** Changes persist to Supabase
**Test:** Realtime sync: changes visible to collaborators instantly

---

### Priority 4: Budget Tracking (High value)

**Test:** Budget calculation accurate for 10+ test cases
**Test:** Alert triggers when category exceeds 80%
**Test:** Forecasting predicts within 15% accuracy
**Test:** Budget optimization finds cost savings

---

### Priority 5: AI Features (Core differentiator)

**Test:** Intent classification accuracy >95% on 100-message test set
**Test:** Dining Orchestrator returns restaurants matching criteria
**Test:** Local Scout discovers events for given dates
**Test:** Itinerary Optimizer reduces travel time by >15%

---

### Priority 6: Booking Flow (Revenue critical)

**Test:** Search restaurants returns results
**Test:** Check availability calls OpenTable API correctly
**Test:** Booking confirmation saves to database
**Test:** Price monitoring detects drops correctly

---

### Priority 7: Mobile Experience (90% users)

**Test:** All pages render correctly on 320px width
**Test:** Touch targets minimum 44px (Lighthouse audit)
**Test:** Forms work on mobile (keyboard types correct)
**Test:** Swipe gestures work smoothly

---

## 7. Implementation Prompts

### Cursor AI Prompts

**Prompt 1: Set Up Jest Testing**
"Create Jest testing setup. Install jest, ts-jest, testing-library/react. Create jest.config.js with jsdom environment, coverage threshold 80%, test match pattern test.ts and test.tsx. Create /tests/setup.ts to mock Supabase client (return sample data instead of real API calls). Write first test: calculateDistance function from utils/distance.ts. Test NYC to LA equals 3944km, same location equals 0km, invalid coords throws error."

**Prompt 2: Write Component Tests**
"Write React component tests using Testing Library. Test ItineraryItem component: renders item title, shows time correctly, edit button appears on hover, delete button triggers onDelete callback. Test RestaurantCard component: displays name/cuisine/price, rating shown as stars, click triggers navigation to detail page. Use userEvent for interactions, assert on rendered output, mock props where needed."

**Prompt 3: Create Integration Tests**
"Write integration tests for Supabase operations. Test createTrip function: inserts trip to database, returns trip object with id, user_id matches authenticated user. Test updateItineraryItem: changes persist, updated_at timestamp updates. Test deleteTrip: cascades to related tables (itinerary_days, itinerary_items). Use local Supabase instance (Docker), seed test data before each test, clean up after."

**Prompt 4: Set Up Playwright E2E Tests**
"Install Playwright, create /tests/e2e/ directory. Write signup flow test: navigate to homepage, click Get Started, fill email/password, submit form, verify redirect to onboarding. Write trip creation test: complete onboarding, click Create Trip, fill destination/dates, verify trip appears in dashboard. Use page.goto, page.fill, page.click, page.waitForSelector. Run against local dev server first, then against preview URLs in CI."

**Prompt 5: Add Lighthouse CI**
"Set up Lighthouse CI. Install @lhci/cli. Create .lighthouserc.js config: test homepage, dashboard, trip details URLs. Set performance budget: 90+ score, accessibility 95+, first-contentful-paint <1.5s, largest-contentful-paint <2.5s. Configure GitHub Action to run Lighthouse on PR preview URL, comment results on PR. Fail build if performance <90."

**Prompt 6: Create Test Data Seeds**
"Create seed data for tests. Write /tests/seed/users.seed.ts that creates 3 test users with different preferences. Write trips.seed.ts with 5 sample trips (Medellín, Cartagena, Bogotá). Write restaurants.seed.ts with 20 restaurants (mix of cuisines, price levels). Create seedDatabase function that clears existing test data, inserts seed data, returns IDs. Call in beforeEach hook so each test starts with clean state."

---

## 8. Quality Gates (Block Deployment)

### Must Pass Before Merge to Main:

- [ ] All unit tests pass (zero failures)
- [ ] Code coverage ≥80% (critical paths 100%)
- [ ] All integration tests pass
- [ ] All E2E tests pass (critical flows)
- [ ] Lighthouse performance score ≥90
- [ ] Lighthouse accessibility score ≥95
- [ ] Zero ESLint errors (warnings ok)
- [ ] TypeScript compiles without errors
- [ ] No console.error or console.warn in production build
- [ ] Bundle size <500KB (code splitting applied)

### Optional Warnings (Don't Block):

- [ ] Code coverage 80-90% (encourage >90%)
- [ ] Lighthouse best practices score <90
- [ ] Minor ESLint warnings
- [ ] Bundle size 500-750KB (optimize if possible)

---

## 9. Manual Testing Checklist (Pre-Launch)

### Device Matrix (Test on Real Devices):

**iOS:**
- [ ] iPhone SE (small screen, 320px width)
- [ ] iPhone 13 Pro (standard)
- [ ] iPhone 14 Pro Max (large screen)
- [ ] iPad Air (tablet, landscape + portrait)

**Android:**
- [ ] Samsung Galaxy S21 (standard)
- [ ] Google Pixel 7 (stock Android)
- [ ] Samsung Galaxy Tab (tablet)
- [ ] Budget Android (low-end CPU, test performance)

**Browsers:**
- [ ] Safari (iOS default)
- [ ] Chrome (Android default)
- [ ] Firefox (both platforms)
- [ ] Edge (desktop)

### Network Conditions:

- [ ] 4G LTE (typical mobile)
- [ ] 3G (slower networks, test loading times)
- [ ] Offline mode (PWA functionality)
- [ ] Flaky connection (intermittent drops)

### Accessibility:

- [ ] Screen reader (VoiceOver iOS, TalkBack Android)
- [ ] Keyboard-only navigation (tab through all forms)
- [ ] High contrast mode (text readable)
- [ ] Font scaling (200% zoom, layout doesn't break)

---

## 10. Bug Tracking Process

### Bug Severity Levels:

**P0 - Critical (Fix within 4 hours):**
- App completely broken (crashes on load)
- Authentication fails (users can't login)
- Data loss (trips deleted accidentally)
- Payment failures (money charged, no booking)

**P1 - High (Fix within 24 hours):**
- Major feature broken (optimizer doesn't work)
- Performance severely degraded (page load >10 seconds)
- Security vulnerability discovered

**P2 - Medium (Fix within 1 week):**
- Minor feature broken (saved items don't persist)
- Cosmetic issues (button color wrong)
- Edge case bugs (affects <5% users)

**P3 - Low (Fix eventually):**
- Cosmetic polish (icon alignment off by 2px)
- Feature requests (not bugs)

### Bug Report Template:

```
Title: [Component] Brief description
Severity: P0/P1/P2/P3
Steps to Reproduce:
1. Go to /dashboard
2. Click "Create Trip"
3. Leave destination empty, click Submit
Expected: Validation error shows
Actual: Form submits, app crashes
Environment: Chrome 120, macOS, production
Screenshot: [attached]
Console Errors: [paste logs]
```

---

## 11. Success Criteria

**MVP Launch:**
- 80% code coverage (unit + integration)
- 10 E2E tests covering critical flows
- All quality gates passing on main branch
- Zero P0/P1 bugs in production first week

**Production Maturity:**
- 90% code coverage
- 50+ E2E tests covering all user journeys
- Automated visual regression testing (screenshots)
- Performance monitoring (Real User Monitoring via PostHog)
- Chaos testing (simulate API failures, database outages)

---

## 12. Production Checklist

- [ ] Test suite runs in <5 minutes (parallel execution)
- [ ] CI/CD pipeline blocks bad code (quality gates enforced)
- [ ] Flaky tests identified and fixed (99% pass rate)
- [ ] Test data seeds realistic (based on production data patterns)
- [ ] E2E tests run on multiple browsers (Chrome, Firefox, Safari)
- [ ] Accessibility tests automated (axe-core integration)
- [ ] Performance budgets enforced (Lighthouse CI)
- [ ] Security scanning (Snyk for dependencies)
- [ ] Database migrations tested (up and down, rollback works)
- [ ] Error tracking verified (Sentry captures test errors)

---

**Reference Docs:**
- See Doc 04 (Backend) for database test setup
- See Doc 08 (Concierge) for intent classification test cases
- See Doc 10 (Deployment) for CI/CD pipeline integration

**Document Owner:** QA Team + Engineering  
**Dependencies:** Jest, Playwright, Lighthouse CI installed, Supabase local instance for tests
