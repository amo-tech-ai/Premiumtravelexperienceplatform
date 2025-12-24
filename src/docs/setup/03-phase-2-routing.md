# PHASE 2: ROUTING ARCHITECTURE
## React Router 6 Data Router + Route Structure + Navigation

**Document:** 03-phase-2-routing.md  
**Phase:** 2 of 11  
**Duration:** 45-60 minutes  
**Prerequisites:** Phase 1 complete with passing validation  
**Status:** Ready to Execute

---

## PHASE OBJECTIVE

Install React Router 6 and configure data router pattern with professional route structure, lazy loading, error boundaries, and loading states for all major route groups.

---

## SUCCESS CRITERIA

- React Router installed and RouterProvider rendering
- Route structure defined for all 60+ routes from sitemap
- Public and authenticated route groups separated
- Lazy loading configured for all page components
- Error boundaries catching route errors
- Loading states showing during navigation
- 404 fallback route working

---

## STEP-BY-STEP INSTRUCTIONS

### Step 1: Install React Router

**Action:** Add React Router DOM v6.20 or higher to project  
**Command Pattern:** npm install react-router-dom  
**Version Check:** After install, verify version is 6.20+ using npm list react-router-dom  
**Verification:** Package appears in package.json dependencies

### Step 2: Create Router Configuration File

**Action:** Set up main router module using createBrowserRouter  

**File - src/routes/index.ts:**  
Import createBrowserRouter from react-router-dom. Import lazy from react. Create router constant using createBrowserRouter with empty array. Export router as default. Add comment explaining this is main router configuration and single source of truth for all routes.  

**Verification:** File exists and exports router constant

### Step 3: Create Route Module Structure

**Action:** Create separate route files for each major section  

**Files to Create in src/routes/:**  
marketing.ts for public marketing pages. auth.ts for login and signup flows. app.ts for authenticated app shell. trips.ts for trip module routes. events.ts for events module routes. restaurants.ts for restaurants module routes. rentals.ts for rentals module routes.  

**Each File Pattern:**  
Import type RouteObject from react-router-dom. Export routes array of type RouteObject array. Add comment header explaining route group purpose.  

**Verification:** All route module files exist with correct exports

### Step 4: Define Marketing Routes Structure

**Action:** Create public marketing route objects  

**File - src/routes/marketing.ts:**  
Create routes array with objects for each marketing page. Include route for slash path (homepage). Include route for /how-it-works path. Include route for /use-cases path. Include route for /pricing path. Include route for /about path. Include route for /contact path. Include route for /privacy path. Include route for /terms path.  

**Each Route Object Fields:**  
path field with route string. lazy field with dynamic import to page component. errorElement field for error boundary. Each route has comment explaining page purpose.  

**Verification:** Eight route objects defined matching sitemap marketing section

### Step 5: Define Auth Routes Structure

**Action:** Create authentication flow route objects  

**File - src/routes/auth.ts:**  
Create routes array for authentication pages. Include route for /login path. Include route for /signup path. Include route for /reset-password path. Include route for /auth/callback path for OAuth. Include route for /logout path.  

**Special Considerations:**  
Auth routes should not require authentication. Callback route handles OAuth provider redirects. Logout route should clear session and redirect.  

**Verification:** Five route objects defined matching sitemap auth section

### Step 6: Define App Shell Route Structure

**Action:** Create authenticated app container route with nested children  

**File - src/routes/app.ts:**  
Create parent route object for /app path. This route should have children array for nested routes. Include child route for empty path (index) redirecting to /app/trips. Include child route for /app/trips path. Include child route for /app/saved path. Include child route for /app/collections path. Include child route for /app/settings path. Include child route for /app/billing path. Include child route for /app/chat path.  

**Parent Route Special Config:**  
Loader function to check authentication status. ErrorElement for app-wide error handling. Element wrapper for app layout (will create in phase 3).  

**Verification:** App routes nested correctly with parent/child relationship

### Step 7: Define Trip Module Routes

**Action:** Create trip-specific routes including wizard flow  

**File - src/routes/trips.ts:**  
Create routes array with trip detail route using :tripId param. Create nested wizard routes under trip detail. Include route for /app/trips/:tripId/wizard with children. Wizard children include /basics, /preferences, /activities, /dining, /review paths.  

**Param Naming:**  
Use :tripId (not :id) for trip identifier. Use :step as optional param if needed. Document param format expectations in comments.  

**Verification:** Trip routes use consistent param naming, wizard routes nested

### Step 8: Define Events Module Routes

**Action:** Create event discovery and detail routes  

**File - src/routes/events.ts:**  
Create routes array for events section. Include route for /app/events (explore page). Include route for /app/events/:eventId (detail page). Include route for /app/events/calendar (calendar view). Include route for /app/events/search (search interface).  

**Param Naming:**  
Use :eventId for event identifier. Keep consistent with trip param pattern.  

**Verification:** Four event routes defined matching sitemap

### Step 9: Define Restaurants Module Routes

**Action:** Create restaurant search and detail routes  

**File - src/routes/restaurants.ts:**  
Create routes array for restaurants section. Include route for /app/restaurants (search page). Include route for /app/restaurants/:restaurantId (detail page). Include route for /app/restaurants/saved (saved list). Include route for /app/restaurants/map (map view).  

**Param Naming:**  
Use :restaurantId for restaurant identifier.  

**Verification:** Four restaurant routes defined matching sitemap

### Step 10: Define Rentals Module Routes

**Action:** Create rental car browse and booking routes  

**File - src/routes/rentals.ts:**  
Create routes array for rentals section. Include route for /app/rentals (browse page). Include route for /app/rentals/:rentalId (detail page). Include route for /app/rentals/bookings (user bookings list).  

**Param Naming:**  
Use :rentalId for rental car identifier.  

**Verification:** Three rental routes defined matching sitemap

### Step 11: Create 404 Catch-All Route

**Action:** Define fallback route for unmatched paths  

**File - src/routes/index.ts:**  
Add catch-all route object at end of routes array. Use path: star (asterisk) to match any unmatched route. Lazy load NotFoundPage component. This route catches any path not matched by other routes.  

**Verification:** 404 route defined as last route in array

### Step 12: Compose Complete Router

**Action:** Import all route modules and combine into single router  

**File - src/routes/index.ts:**  
Import routes arrays from all route module files. Combine arrays using spread operator into single routes array. Pass combined array to createBrowserRouter. Add future flags for v7 compatibility if desired.  

**Router Configuration Options:**  
Consider basename if app not at domain root. Consider future flags for React Router v7 features.  

**Verification:** Router imports all route modules, exports single router instance

### Step 13: Wire Router to App Component

**Action:** Replace App.tsx content with RouterProvider  

**File - src/App.tsx:**  
Import RouterProvider from react-router-dom. Import router from routes/index. Return RouterProvider component with router prop. Remove any default Vite template content.  

**Clean Component:**  
App.tsx should only render RouterProvider. No other logic or UI. Providers will wrap this in later phase.  

**Verification:** App.tsx renders RouterProvider with imported router

### Step 14: Create Placeholder Page Components

**Action:** Create minimal page components for all routes to test routing  

**Pattern for Each Page:**  
Create file in appropriate pages subdirectory. Export default function component named after page (HomePage, LoginPage, TripDetailPage). Return simple div with h1 showing page name and paragraph saying "Coming soon". Import useParams hook to display route params if applicable.  

**Pages to Create Now:**  
Marketing pages in pages/marketing/. Auth pages in pages/auth/. App pages in pages/app/. Trip pages in pages/trips/. Event pages in pages/events/. Restaurant pages in pages/restaurants/. Rental pages in pages/rentals/. NotFoundPage in pages/errors/.  

**Verification:** Every route from sitemap has corresponding placeholder page component

### Step 15: Configure Lazy Loading

**Action:** Update route definitions to use React.lazy for code splitting  

**File - All route module files:**  
Import lazy from react. For each route's element or lazy field, use lazy with dynamic import. Dynamic import path should use @ alias pointing to pages directory. Wrap page component import in lazy function.  

**Example Pattern:**  
lazy(() => import(@/pages/marketing/HomePage)). Ensure default export from page component.  

**Verification:** All routes use lazy loading, no direct page imports in route files

### Step 16: Add Error Boundary Components

**Action:** Create error boundary components for routes  

**File - src/pages/errors/RouteErrorBoundary.tsx:**  
Export default component that uses useRouteError hook from react-router-dom. Display error message in user-friendly format. Show different UI for 404 vs 500 errors. Include button to navigate back or to home.  

**File - src/pages/errors/RootErrorBoundary.tsx:**  
Similar to route error boundary but for app-wide errors. More severe errors like network failures. Provide app reset functionality.  

**Verification:** Error boundary components created and exported

### Step 17: Wire Error Boundaries to Routes

**Action:** Add error boundaries to route configurations  

**File - src/routes/index.ts:**  
Import RootErrorBoundary component. Add errorElement field to root route with RootErrorBoundary. Import RouteErrorBoundary. Add errorElement to individual routes or route groups as needed.  

**Verification:** Root route has error boundary, nested routes inherit or override

### Step 18: Add Loading Fallback Components

**Action:** Create loading states for Suspense boundaries  

**File - src/components/shared/LoadingSpinner.tsx:**  
Export default component showing loading spinner. Use Tailwind for styling. Keep simple but polished. Centered on screen with animation.  

**File - src/components/shared/PageSkeleton.tsx:**  
Export default component showing skeleton placeholders. Simulate page layout with gray rectangles. Different skeletons for different page types if needed.  

**Verification:** Loading components created and ready to use

### Step 19: Wrap Router with Suspense

**Action:** Add Suspense boundary for lazy-loaded routes  

**File - src/App.tsx:**  
Import Suspense from react. Wrap RouterProvider with Suspense component. Add fallback prop with LoadingSpinner component. This shows loading state during route transitions.  

**Verification:** App renders with Suspense wrapping router

### Step 20: Test All Routes

**Action:** Manually verify every route renders  

**Testing Process:**  
Start dev server. Navigate to each marketing route (/, /how-it-works, /pricing, etc). Navigate to each auth route (/login, /signup, etc). Attempt to navigate to app routes (should fail auth check - expected). Navigate to invalid route to test 404. Check browser console for errors.  

**Verification:** All public routes render placeholder pages, no console errors, 404 works

---

## VALIDATION CHECKLIST

### Installation & Configuration

- [ ] React Router DOM installed in package.json
- [ ] Version 6.20 or higher confirmed
- [ ] Router configuration file exists at src/routes/index.ts
- [ ] All route module files created (marketing, auth, app, trips, events, restaurants, rentals)
- [ ] Router exported from routes/index.ts

### Route Definitions

- [ ] Marketing routes array has 8 route objects
- [ ] Auth routes array has 5 route objects  
- [ ] App routes array has 7+ route objects
- [ ] Trip routes include wizard nested routes
- [ ] Events routes include 4 route objects
- [ ] Restaurants routes include 4 route objects
- [ ] Rentals routes include 3 route objects
- [ ] 404 catch-all route defined with path: asterisk
- [ ] All routes use lazy loading with React.lazy
- [ ] Route params follow naming convention (:tripId, :eventId, etc)

### Components

- [ ] Placeholder page created for every route
- [ ] All pages export default function component
- [ ] RouteErrorBoundary component created
- [ ] RootErrorBoundary component created
- [ ] LoadingSpinner component created
- [ ] PageSkeleton component created
- [ ] NotFoundPage component created

### Integration

- [ ] App.tsx imports and renders RouterProvider
- [ ] Router prop passed to RouterProvider
- [ ] Suspense wraps RouterProvider with loading fallback
- [ ] Error boundaries wired to routes
- [ ] All route paths start with / (absolute paths)

### Functionality Tests

- [ ] npm run dev starts without errors
- [ ] Navigate to / shows HomePage placeholder
- [ ] Navigate to /how-it-works shows page
- [ ] Navigate to /login shows LoginPage
- [ ] Navigate to /signup shows SignupPage
- [ ] Navigate to /random-path shows 404 page
- [ ] Browser URL updates on navigation
- [ ] Back button works correctly
- [ ] No console errors during navigation
- [ ] Loading spinner briefly visible during transitions

---

## TROUBLESHOOTING

### Issue: Router Not Rendering Anything

**Symptom:** App shows blank screen after adding RouterProvider  
**Cause:** Router not properly exported or imported  
**Solution:** Verify routes/index.ts exports router. Verify App.tsx imports router. Check browser console for errors. Ensure RouterProvider receives router prop.

### Issue: Routes Not Lazy Loading

**Symptom:** All routes load immediately, no code splitting  
**Cause:** Not using React.lazy or dynamic imports  
**Solution:** Ensure each route uses lazy(() => import(...)) pattern. Verify import paths use @ alias. Check that pages have default exports.

### Issue: 404 Route Not Catching

**Symptom:** Unmatched routes show blank screen  
**Cause:** Catch-all route not last in array or path incorrect  
**Solution:** Ensure 404 route is last route object in array. Verify path is exactly asterisk character. Ensure NotFoundPage component exists.

### Issue: Error Boundaries Not Working

**Symptom:** Errors show blank screen instead of error UI  
**Cause:** Error boundary not using useRouteError hook  
**Solution:** Verify error boundary component calls useRouteError. Ensure component catches and displays error. Check errorElement prop on routes.

### Issue: Path Alias Not Resolving in Routes

**Symptom:** Import from @/pages/... fails  
**Cause:** Vite config or TypeScript config missing  
**Solution:** Verify Phase 1 validation passed. Check vite.config.ts has resolve.alias. Restart dev server.

---

## NEXT PHASE PREVIEW

**Phase 3:** Create layout components (MarketingLayout, AppLayout with 3-panel structure, WizardLayout). Wire layouts to route groups. Add navigation sidebar with links.

**What You'll Need:** This phase complete with all routes rendering placeholders. Understanding of nested routing concepts.

**Estimated Time:** 60-90 minutes

---

**Phase Status:** ✅ Ready to Execute  
**Last Updated:** December 24, 2024  
**Dependencies:** Phase 1 (foundation)  
**Blocks:** Phase 3 (layouts need routes)
