# I LOVE MEDELLÍN - INITIAL SETUP FROM SCRATCH
## Production-Ready Frontend Architecture Blueprint

**Document:** 01-setup.md  
**Created:** December 24, 2024  
**Purpose:** Complete setup plan for rebuilding I Love Medellín from scratch  
**Status:** Ready for Implementation

---

## 1) EXECUTIVE SETUP SUMMARY

### What We Are Building

I Love Medellín is a luxury AI-powered travel planning platform that helps users discover and plan authentic experiences in Medellín, Colombia. The application features six specialized AI agents working through an event bus to automate trip planning, with a central drag-and-drop itinerary builder, event discovery, restaurant recommendations, and rental car booking. The interface uses a distinctive 3-panel layout with left navigation, main content canvas, and right-side AI assistant panel, following a calm, confident, editorial design aesthetic with illustrated cards and restrained motion.

### Setup Goals

- **Clean Foundation:** Establish Vite + React + TypeScript project with zero technical debt from day one
- **Scalable Architecture:** Implement feature-based folder structure that supports independent module development
- **Type Safety:** Enforce strict TypeScript across all routes, components, and API integrations
- **Route Excellence:** Use React Router data router pattern with proper code splitting and loading states
- **Path Consistency:** Configure absolute imports with `@/` alias to eliminate relative path hell
- **Production Ready:** All routes render placeholders, navigation works, auth gates function, build passes
- **AI Integration:** Clear separation between UI components and AI agent communication layer
- **Mobile First:** Responsive layouts from initial implementation, not retrofitted later
- **Developer Experience:** Hot reload, clear error messages, fast builds, predictable file locations

### Non-Goals

- **Backend Implementation:** Supabase edge functions are separate concern, covered in other docs
- **AI Agent Logic:** Agent implementations exist separately, this focuses on UI integration points
- **Design System Creation:** Using existing Tailwind + shadcn/ui components, not building from scratch
- **Authentication Details:** Auth flows use Supabase client, not custom implementation
- **Data Fetching Library:** Starting with native fetch, can add React Query later if needed
- **Testing Setup:** Will be added in Phase 2, not blocking initial scaffold
- **CI/CD Pipeline:** Deployment configuration comes after core structure is stable
- **SEO Optimization:** Meta tags and structured data are Phase 2 enhancements

---

## 2) TECH STACK DECISIONS

### Core Framework Stack

**Vite + React 18 + TypeScript 5**  
- **Why Vite:** Lightning-fast HMR, modern ESM-based build, zero config for React + TS
- **Why React 18:** Concurrent features, Suspense support, automatic batching, future-ready
- **Why TypeScript:** Catch errors at compile time, better IDE support, self-documenting APIs

**React Router 6.20+ (Data Router Pattern)**  
- **Why Data Router:** Loader/action pattern separates data fetching from rendering
- **Why v6.20+:** Stable async APIs, typed route params, built-in error boundaries
- **Pattern:** Use `createBrowserRouter` with route objects, not JSX `<Routes>`
- **Benefit:** Colocate data requirements with route definitions, automatic loading states

### Styling Approach

**Tailwind CSS 4.0 + shadcn/ui Components**  
- **Why Tailwind:** Utility-first matches design system, no CSS file sprawl, tree-shakeable
- **Why shadcn/ui:** Copy-paste components we own, no runtime dependency, full customization
- **Configuration:** Tailwind v4 with design tokens in `/styles/globals.css`
- **Custom:** Editorial typography, calm color palette, soft shadows, luxury feel

### State Management Strategy

**Start Simple, Expand Later**  
- **URL State:** React Router for navigation state, filters, pagination
- **Server State:** Fetch in loaders, cache in React Router, no external library initially
- **UI State:** React useState/useReducer for modals, forms, local interactions
- **Global State:** Context for auth user, theme, AI panel toggle
- **Future:** Add Zustand or Jotai only when clear need emerges

### Environment & Configuration

**Vite Environment Variables**  
- **Pattern:** `VITE_` prefix for client-accessible vars
- **Required Vars:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_GEMINI_API_KEY`
- **Storage:** `.env.local` for secrets (gitignored), `.env.example` for documentation
- **Validation:** Runtime check on app boot, fail fast with clear error messages

**TypeScript Configuration**  
- **Mode:** Strict mode enabled (`strict: true`)
- **Paths:** Absolute imports via `@/*` alias mapped to `src/*`
- **Target:** ES2020 for modern browser support
- **Checks:** `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`

---

## 3) FOLDER STRUCTURE (FINAL)

### Complete Source Tree

```
src/
├── app/
│   ├── providers/        # Context providers (Auth, Theme, AI)
│   ├── layouts/          # Layout components (Marketing, App, Wizard)
│   ├── guards/           # Route guards (ProtectedRoute, PublicOnly)
│   └── App.tsx           # Root app component with router
│
├── routes/
│   ├── index.ts          # Main router configuration
│   ├── marketing.ts      # Public marketing routes
│   ├── auth.ts           # Login/signup routes
│   ├── app.ts            # Authenticated app routes
│   ├── trips.ts          # Trip module routes
│   ├── events.ts         # Events module routes
│   ├── restaurants.ts    # Restaurants module routes
│   └── rentals.ts        # Rentals module routes
│
├── pages/
│   ├── marketing/        # Marketing pages (Home, HowItWorks, Pricing)
│   ├── auth/             # Auth pages (Login, Signup, Reset)
│   ├── app/              # Core app pages (Dashboard, Settings)
│   ├── trips/            # Trip pages (List, Detail, Wizard)
│   ├── events/           # Event pages (Explore, Detail)
│   ├── restaurants/      # Restaurant pages (Search, Detail)
│   ├── rentals/          # Rental pages (Browse, Detail)
│   └── errors/           # Error pages (404, 500, Offline)
│
├── components/
│   ├── ui/               # shadcn/ui base components (Button, Card, Input)
│   ├── shared/           # Shared components (Header, Footer, Nav)
│   ├── ai/               # AI-specific UI (ChatPanel, SuggestionCard)
│   └── layouts/          # Reusable layout components (3PanelLayout)
│
├── features/
│   ├── trips/            # Trip domain (hooks, types, utils)
│   ├── events/           # Events domain (hooks, types, utils)
│   ├── restaurants/      # Restaurants domain (hooks, types, utils)
│   ├── rentals/          # Rentals domain (hooks, types, utils)
│   ├── auth/             # Auth domain (useAuth hook, types)
│   └── ai/               # AI domain (agent clients, event bus)
│
├── lib/
│   ├── api/              # API client and fetch wrappers
│   ├── supabase/         # Supabase client initialization
│   ├── utils/            # Utility functions (dates, formatting)
│   └── constants.ts      # App-wide constants
│
├── types/
│   ├── api.ts            # API response types
│   ├── models.ts         # Domain models (Trip, Event, Restaurant, Rental)
│   ├── ai.ts             # AI agent types
│   └── index.ts          # Type exports
│
├── styles/
│   ├── globals.css       # Tailwind base + design tokens
│   └── fonts/            # Custom font files
│
├── assets/
│   ├── images/           # Static images
│   ├── icons/            # SVG icons
│   └── illustrations/    # Illustrated cards
│
└── main.tsx              # Vite entry point
```

### Folder Purpose & Rules

**`app/`** - Application bootstrap and infrastructure  
Providers wrap the entire app (AuthProvider, ThemeProvider, AIProvider). Layouts define page shells (MarketingLayout has header/footer, AppLayout has 3-panel structure). Guards enforce authentication rules. Only App.tsx and infrastructure code belongs here.

**`routes/`** - Route configuration files  
Each file exports route objects using createBrowserRouter format. Routes are grouped by feature area (marketing, auth, trips, etc). Loaders and actions are defined inline or imported from feature modules. This is the single source of truth for all navigation.

**`pages/`** - Page-level components (one per route)  
Each page is a default export named after the route (HomePage, TripDetailPage). Pages compose components and features but contain minimal logic. Pages receive data from route loaders via useLoaderData. Never import pages directly - always route through React Router.

**`components/`** - Presentational UI components  
`ui/` contains shadcn/ui primitives (Button, Dialog, Card) - never modify these directly. `shared/` has app-wide components (Header, Sidebar, SearchBar). `ai/` contains AI-specific UI. `layouts/` has structural components (ThreePanelLayout). All components are pure and testable.

**`features/`** - Domain-specific business logic  
Each feature is self-contained with its own hooks (useTrips, useEvents), utilities (tripHelpers.ts), and types. Features can import from `lib/` and `components/` but never from other features. This enforces clean boundaries and prevents circular dependencies.

**`lib/`** - Shared libraries and utilities  
`api/` contains the base fetch client and API method builders. `supabase/` initializes the Supabase client. `utils/` has pure functions (formatDate, calculateDistance). This is the foundation layer - never import from `features/` or `pages/`.

**`types/`** - TypeScript type definitions  
Centralized type definitions shared across the app. `models.ts` defines core domain objects. `api.ts` defines request/response shapes. `ai.ts` defines agent interfaces. All exports re-exported through index.ts for clean imports.

**`styles/`** - Global styles and design tokens  
`globals.css` contains Tailwind directives, CSS custom properties for design tokens, and typography defaults. Font files stored in `fonts/`. No component-specific CSS files - use Tailwind utilities instead.

**`assets/`** - Static assets  
Images, SVGs, and illustrations imported as ESM imports. Vite automatically optimizes and fingerprints assets. Use ImageWithFallback component for user-uploaded images, direct imports for static assets.

---

## 4) ROUTING ARCHITECTURE (BEST PRACTICES)

### Route Organization Strategy

**Public vs Authenticated Route Groups**  
Marketing routes (/, /how-it-works, /pricing) are public and use MarketingLayout with header/footer. Auth routes (/login, /signup) are public but use minimal AuthLayout. App routes (/app/*) require authentication and use AppLayout with 3-panel structure. Wizard routes (/app/trips/:tripId/wizard/*) use WizardLayout with step indicator.

**Layout Route Hierarchy**  
Root layout provides error boundary and global providers. MarketingLayout adds header, footer, and marketing-specific styling. AppLayout adds left sidebar navigation, main content area, and collapsible right AI panel. WizardLayout adds step progress indicator and prev/next navigation. Nested routes inherit parent layouts automatically.

**Protected Route Pattern**  
All /app/* routes wrapped in ProtectedRoute guard component. Guard checks for active Supabase session before rendering. Unauthenticated users redirected to /login with return URL. Auth state loaded in root loader, available to all child routes via useRouteLoaderData. No per-route auth checks needed.

**Route Parameter Conventions**  
Trip routes use `:tripId` param. Event routes use `:eventId`. Restaurant routes use `:restaurantId`. Rental routes use `:rentalId`. Always UUID format, validated in loader. Wizard routes use `:step` param for step navigation. Search params used for filters (?category=food&priceLevel=2).

**Error Boundary Strategy**  
Root error boundary catches app-wide errors (network failures, unhandled exceptions). Route-level error boundaries catch loader/action errors (404s, validation failures). Error components receive error object, display user-friendly message, provide recovery actions. Development shows full stack traces, production shows sanitized errors.

**Loading State Patterns**  
Route-level loading fallbacks using Suspense boundaries. Show skeleton screens during initial load. Show inline spinners during mutations. Loading states defined per route, inherit from parent if not specified. Use React.lazy for code splitting, Suspense for async boundaries.

### Example Route Structure Patterns

**Nested Layout Routes**  
Root route contains providers and error boundary. Marketing route group contains layout and public pages. App route group contains protected layout and authenticated pages. Trip detail route nests wizard routes as children. Each level can define own loader, action, error boundary.

**Lazy Loading Strategy**  
Page components loaded lazily using React.lazy. Route modules loaded eagerly to enable preloading. Critical routes (/, /app, /app/trips) preloaded on app boot. Non-critical routes loaded on demand. Bundle splitting per route group (marketing chunk, app chunk, trips chunk).

**404 Handling Pattern**  
Catch-all route at end of route array with path "*". 404ErrorPage component with helpful navigation. Shows search functionality, popular destinations, back button. In app context, shows recent trips and events. Logs 404s for monitoring broken links.

**Redirect Patterns**  
Root path (/) shows marketing homepage if not authenticated, redirects to /app if authenticated. /app redirects to /app/trips (default authenticated landing). Old URLs redirect to new structure using loader redirects. External links (OAuth callbacks) handled via dedicated redirect pages.

---

## 5) FULL SITEMAP (ROUTES)

### Marketing Routes (Public)

| Route | Page Name | Access | Primary Purpose | Key UI Areas |
|-------|-----------|--------|-----------------|--------------|
| `/` | HomePage | Public | Landing page, hero, value props | Hero banner, features grid, testimonials, CTA |
| `/how-it-works` | HowItWorksPage | Public | Explain 6 AI agents & workflow | Step-by-step guide, agent showcase, demo video |
| `/use-cases` | UseCasesPage | Public | Example trips & scenarios | Use case cards, sample itineraries, user stories |
| `/pricing` | PricingPage | Public | Pricing tiers & features | Pricing table, feature comparison, FAQ |
| `/about` | AboutPage | Public | Company story & team | Mission statement, team photos, contact info |
| `/contact` | ContactPage | Public | Contact form & info | Contact form, email, social links |
| `/privacy` | PrivacyPage | Public | Privacy policy | Legal text, last updated date |
| `/terms` | TermsPage | Public | Terms of service | Legal text, acceptance checkbox |

### Authentication Routes (Public)

| Route | Page Name | Access | Primary Purpose | Key UI Areas |
|-------|-----------|--------|-----------------|--------------|
| `/login` | LoginPage | Public | Email/password login | Login form, OAuth buttons, forgot password link |
| `/signup` | SignupPage | Public | Create new account | Signup form, OAuth buttons, terms acceptance |
| `/reset-password` | ResetPasswordPage | Public | Password reset flow | Email input, reset instructions |
| `/auth/callback` | AuthCallbackPage | Public | OAuth callback handler | Loading spinner, error handling |
| `/logout` | LogoutPage | Public | Sign out & redirect | Confirmation message, redirect countdown |

### Core App Routes (Authenticated)

| Route | Page Name | Access | Primary Purpose | Key UI Areas |
|-------|-----------|--------|-----------------|--------------|
| `/app` | DashboardPage | Auth | Main dashboard, recent activity | Stats cards, recent trips, AI suggestions, quick actions |
| `/app/trips` | TripsListPage | Auth | View all user trips | Trip cards grid, filters, sort, create new button |
| `/app/trips/:tripId` | TripDetailPage | Auth | Single trip itinerary view | Drag-drop timeline, map, budget tracker, AI panel |
| `/app/saved` | SavedPlacesPage | Auth | Saved locations & bookmarks | Saved items grid, collections, tags filter |
| `/app/collections` | CollectionsPage | Auth | User-created collections | Collection cards, create new, share options |
| `/app/settings` | SettingsPage | Auth | User preferences & account | Profile form, preferences, notifications, danger zone |
| `/app/billing` | BillingPage | Auth | Subscription & payment | Plan details, payment method, invoices, upgrade CTA |

### Trip Wizard Routes (Authenticated)

| Route | Page Name | Access | Primary Purpose | Key UI Areas |
|-------|-----------|--------|-----------------|--------------|
| `/app/trips/:tripId/wizard` | WizardIndexPage | Auth | Wizard entry point, redirect to step 1 | - |
| `/app/trips/:tripId/wizard/basics` | WizardBasicsPage | Auth | Trip title, destination, dates | Form inputs, step 1/5 indicator |
| `/app/trips/:tripId/wizard/preferences` | WizardPreferencesPage | Auth | Travel style, interests, budget | Multi-select chips, step 2/5 indicator |
| `/app/trips/:tripId/wizard/activities` | WizardActivitiesPage | Auth | AI-suggested activities | Activity cards with add button, step 3/5 indicator |
| `/app/trips/:tripId/wizard/dining` | WizardDiningPage | Auth | Restaurant recommendations | Restaurant cards, dietary filters, step 4/5 indicator |
| `/app/trips/:tripId/wizard/review` | WizardReviewPage | Auth | Review & confirm itinerary | Summary view, edit links, finish button, step 5/5 |

### Events Module Routes (Authenticated)

| Route | Page Name | Access | Primary Purpose | Key UI Areas |
|-------|-----------|--------|-----------------|--------------|
| `/app/events` | EventsExplorePage | Auth | Browse all events in Medellín | Events grid, category filters, date range, map view |
| `/app/events/:eventId` | EventDetailPage | Auth | Single event details | Hero image, description, tickets, add to trip button |
| `/app/events/calendar` | EventsCalendarPage | Auth | Calendar view of events | Month calendar, event dots, day drill-down |
| `/app/events/search` | EventsSearchPage | Auth | Search events by keyword | Search bar, results list, advanced filters |

### Restaurants Module Routes (Authenticated)

| Route | Page Name | Access | Primary Purpose | Key UI Areas |
|-------|-----------|--------|-----------------|--------------|
| `/app/restaurants` | RestaurantsSearchPage | Auth | Browse restaurants | Restaurant cards, cuisine filters, price level, ratings |
| `/app/restaurants/:restaurantId` | RestaurantDetailPage | Auth | Single restaurant details | Photos carousel, menu, reviews, reservation button |
| `/app/restaurants/saved` | SavedRestaurantsPage | Auth | User's saved restaurants | Saved list, remove option, add to trip |
| `/app/restaurants/map` | RestaurantsMapPage | Auth | Map view of restaurants | Interactive map, clustered markers, info windows |

### Rentals Module Routes (Authenticated)

| Route | Page Name | Access | Primary Purpose | Key UI Areas |
|-------|-----------|--------|-----------------|--------------|
| `/app/rentals` | RentalsBrowsePage | Auth | Browse rental cars | Vehicle cards, type filters, price range, availability |
| `/app/rentals/:rentalId` | RentalDetailPage | Auth | Single rental car details | Vehicle photos, specs, pricing, book button |
| `/app/rentals/bookings` | RentalBookingsPage | Auth | User's rental bookings | Booking list, status, cancel/modify options |

### AI & Chat Routes (Authenticated)

| Route | Page Name | Access | Primary Purpose | Key UI Areas |
|-------|-----------|--------|-----------------|--------------|
| `/app/chat` | ChatPage | Auth | AI concierge conversations | Chat interface, agent selector, conversation history |
| `/app/chat/:conversationId` | ConversationPage | Auth | Single conversation thread | Message thread, input box, context display |

### Utility & System Routes

| Route | Page Name | Access | Primary Purpose | Key UI Areas |
|-------|-----------|--------|-----------------|--------------|
| `/404` | NotFoundPage | Public | Page not found | Error message, search, popular links, back button |
| `/500` | ServerErrorPage | Public | Server error | Error message, retry button, support contact |
| `/offline` | OfflinePage | Public | Network offline | Offline message, cached content, retry button |
| `/style-guide` | StyleGuidePage | Public/Dev | Design system showcase | Component examples, color palette, typography |

---

## 6) SETUP STEPS (COPY-PASTE PLAN)

### Step 1: Initialize Vite Project

Create new Vite project with React + TypeScript template. Navigate into project directory. Install base dependencies (React Router, Tailwind CSS, shadcn/ui setup). Initialize git repository and create initial commit.

**Command Sequence:**  
Run `npm create vite@latest i-love-medellin -- --template react-ts` to scaffold project. Change directory with `cd i-love-medellin`. Run `npm install` to install base dependencies. Initialize git with `git init` and create `.gitignore`.

**Verification:**  
App boots with Vite welcome screen. TypeScript compilation works without errors. Hot module replacement functions correctly.

### Step 2: Configure Path Aliases

Update `tsconfig.json` to add path mapping for `@/*` alias pointing to `src/*`. Update `vite.config.ts` to resolve the alias for bundling. Test import from `@/components/ui/Button` to verify alias works.

**Files to Modify:**  
Add paths configuration to `tsconfig.json` compiler options. Add resolve.alias to `vite.config.ts` using path.resolve. Restart TypeScript server and Vite dev server.

**Verification:**  
Import `@/lib/utils` from any file compiles successfully. IDE autocomplete suggests paths starting with `@/`. Build completes without module resolution errors.

### Step 3: Install Router & Core Dependencies

Install React Router v6 using `npm install react-router-dom`. Install Tailwind CSS v4 using `npm install -D tailwindcss postcss autoprefixer`. Run Tailwind init to generate config. Install shadcn/ui CLI and initialize with `npx shadcn-ui@latest init`.

**Package Versions:**  
React Router DOM version 6.20 or higher. Tailwind CSS version 4.0 or higher. TypeScript version 5.3 or higher. Ensure peer dependencies compatible.

**Verification:**  
Run `npm list react-router-dom` shows correct version. Tailwind processes CSS without errors. shadcn/ui components directory created at `src/components/ui`.

### Step 4: Create Folder Structure

Create all directories from folder structure section using `mkdir -p` command. Create index files in each directory for documentation. Add README.md files explaining each folder's purpose and rules.

**Directory Creation:**  
Create `app/`, `routes/`, `pages/`, `components/`, `features/`, `lib/`, `types/`, `styles/`, `assets/` at `src/` level. Create subdirectories for each module (trips, events, restaurants, rentals).

**Verification:**  
Run `tree src/` shows complete folder structure. Each directory has index.ts or README.md. No empty directories without purpose.

### Step 5: Set Up Layouts & Route Guards

Create `MarketingLayout.tsx` with header and footer. Create `AppLayout.tsx` with 3-panel structure (sidebar, main, AI panel). Create `WizardLayout.tsx` with step indicator. Create `ProtectedRoute.tsx` guard component checking auth state.

**Layout Components:**  
MarketingLayout renders children with Header and Footer wrappers. AppLayout renders Sidebar, Outlet for main content, and collapsible RightPanel. WizardLayout renders StepIndicator and WizardNavigation with Outlet.

**Verification:**  
Layouts render with placeholder content. ProtectedRoute redirects to login when not authenticated. Nested routes inherit parent layouts correctly.

### Step 6: Configure Router & Routes

Create `routes/index.ts` exporting router created with createBrowserRouter. Import and compose all route modules (marketing, auth, app, trips, events, restaurants, rentals). Define loaders, actions, error boundaries per route.

**Route Configuration:**  
Each route module exports route objects with path, element, loader, action, errorElement. Import page components lazily. Compose route tree with proper nesting. Export single router instance.

**Verification:**  
Navigate to every route path renders correct page. URL bar updates on navigation. Browser back/forward works. Route params parse correctly.

### Step 7: Create Placeholder Pages

For every route in sitemap table, create placeholder page component. Each page exports default component with route name and coming soon message. Import lucide-react icons for visual decoration.

**Page Template:**  
Each page default exports named component (HomePage, TripDetailPage). Render heading with page name and placeholder text. Add link back to parent route. Use consistent layout and styling.

**Verification:**  
Visit every route shows placeholder page. No blank screens or broken imports. Component names match file names. Route breadcrumbs show correctly.

### Step 8: Wire Navigation Structure

Create `Sidebar.tsx` component with navigation links using NavLink from React Router. Add active state styling with Tailwind. Wire to route paths from sitemap. Add mobile hamburger menu with motion animation.

**Navigation Links:**  
Dashboard, Trips, Events, Restaurants, Rentals, Saved, Chat, Settings links. Use lucide-react icons for each nav item. Active link shows primary color and indicator. Collapsed state shows icons only.

**Verification:**  
Click navigation links navigates to correct route. Active link highlights correctly. Mobile menu opens and closes smoothly. Keyboard navigation works (tab, enter).

### Step 9: Add Error Boundaries & Loading States

Create `RootErrorBoundary.tsx` catching app-wide errors. Create `RouteErrorBoundary.tsx` for route-specific errors. Add Suspense boundaries with loading skeletons. Create `LoadingSkeleton.tsx` components for major sections.

**Error Handling:**  
RootErrorBoundary shows friendly error page with refresh button. RouteErrorBoundary shows error specific to route (404, 500, etc). Errors logged to console in development. Production errors sanitized.

**Verification:**  
Throw test error in route loader shows error boundary. Network error during navigation shows error page. Refresh button resets error state. Loading spinners show during route transitions.

### Step 10: Environment Variables Setup

Create `.env.example` file with all required variables documented. Create `.env.local` file (gitignored) with development values. Add validation function checking required vars at app boot.

**Required Variables:**  
VITE_SUPABASE_URL pointing to Supabase project URL. VITE_SUPABASE_ANON_KEY with anonymous access key. VITE_GEMINI_API_KEY for AI agent access. VITE_APP_URL with base application URL.

**Verification:**  
App boots and validates all required env vars present. Missing var shows clear error message. Vars accessible via `import.meta.env.VITE_*`. Build includes vars in bundle.

### Step 11: Configure Tailwind & Design Tokens

Update `styles/globals.css` with Tailwind v4 directives. Add CSS custom properties for design tokens (colors, spacing, shadows, typography). Import custom fonts. Configure theme extension in Tailwind config.

**Design System:**  
Define CSS variables for primary, secondary, accent, neutral colors. Set typography scale (headings, body, small). Define spacing scale (xs, sm, md, lg, xl). Set shadow levels (sm, md, lg, xl).

**Verification:**  
Tailwind utilities apply correctly. Custom color classes work (text-primary, bg-accent). Typography styles render with correct fonts. Shadows and spacing match design system.

### Step 12: Run Build Validation

Run `npm run build` to create production bundle. Check build output for size and chunks. Run `npm run preview` to test production build locally. Run TypeScript check with `npx tsc --noEmit`.

**Build Checks:**  
No TypeScript errors. No missing imports or dead code. Bundle size under 500KB (before gzip). Code splitting creates separate chunks per route group. All assets fingerprinted and copied.

**Verification:**  
Build completes without errors or warnings. Preview server runs production build successfully. All routes accessible in production mode. Console shows no errors.

---

## 7) VALIDATION CHECKLIST (MUST PASS)

### Critical Functionality Tests

- **App Boots Successfully:** Run `npm run dev` and navigate to localhost:5173 shows homepage without errors
- **No Console Errors:** Browser console clean on initial load and navigation between routes
- **TypeScript Compiles:** Run `npx tsc --noEmit` returns zero errors
- **All Routes Render:** Visit every route from sitemap table shows placeholder page, not blank screen
- **Navigation Links Work:** Click every sidebar link navigates to correct route and updates URL
- **Protected Routes Redirect:** Visit `/app/trips` when not logged in redirects to `/login`
- **404 Page Works:** Navigate to random invalid path like `/asdfasdf` shows 404 page
- **Layout Nesting:** App routes render inside AppLayout with sidebar and panels visible
- **Route Params Parse:** Visit `/app/trips/test-id` shows test-id in page content
- **Build Passes:** Run `npm run build` completes successfully and creates dist folder

### Import & Path Tests

- **Absolute Imports Work:** Import from `@/components/ui/Button` compiles without error
- **No Relative Path Hell:** Search codebase shows no imports like `../../../components`
- **Barrel Exports Present:** Each feature folder has index.ts exporting public API
- **Circular Dependencies Avoided:** Build doesn't hang or error from circular imports
- **All Pages Lazy Loaded:** Search route config shows React.lazy wrapping page imports

### Styling & UI Tests

- **Tailwind Classes Apply:** Elements with `bg-primary` and `text-lg` render correctly
- **Fonts Load:** Custom fonts from `styles/fonts/` display in headings
- **Responsive Layout:** Resize browser window shows mobile nav and collapsed panels at <768px
- **Dark Mode Ready:** CSS variables support dark mode tokens even if not implemented yet
- **Icons Render:** lucide-react icons display in navigation and buttons

### Error Handling Tests

- **Error Boundary Catches:** Throw error in component renders error boundary, not white screen
- **Network Error Handled:** Simulate offline shows offline page or error message
- **Loading States Show:** Navigate between routes shows loading skeleton briefly
- **Form Validation Works:** Submit empty form shows validation errors (if any forms exist)
- **404 Boundary Works:** Visit non-existent route shows 404 page with back navigation

### Developer Experience Tests

- **Hot Reload Works:** Edit component file and save triggers instant browser update
- **TypeScript Errors Visible:** Add type error to code shows red squiggly in IDE
- **Import Autocomplete:** Type `import { } from '@/` shows autocomplete suggestions
- **Lint Passes:** Run `npm run lint` completes without errors (if ESLint configured)
- **Git Clean State:** Run `git status` shows no untracked files except .env.local

---

## 8) SYSTEM RULES (GUARDRAILS)

### Architectural Boundaries

**Rule 1: Feature Isolation**  
Features in `features/` directory cannot import from other features. Cross-feature communication must go through shared interfaces in `types/` or via events. This prevents tight coupling and enables independent development.

**Rule 2: Page Component Purity**  
Pages in `pages/` directory must be thin orchestration layers. Business logic belongs in feature hooks, not in page components. Pages compose components and features but contain no domain logic.

**Rule 3: Unidirectional Dependencies**  
Dependencies flow one direction only: `pages` → `features` → `components` → `lib`. Lower layers cannot import from higher layers. This creates clear boundaries and prevents circular dependencies.

**Rule 4: Layout Route Hierarchy**  
All routes must specify parent layout route. No orphaned routes without layout context. Layouts can nest (MarketingLayout → AppLayout → WizardLayout) but must maintain hierarchy.

### Import & Module Rules

**Rule 5: Absolute Path Imports Only**  
All imports must use `@/` alias. Relative imports like `../../../` are forbidden. Exception: importing from same directory can use `./filename`.

**Rule 6: Barrel Export Pattern**  
Each feature folder must have `index.ts` exporting public API. Internal files not exported in barrel are considered private. External imports must use barrel, not direct file imports.

**Rule 7: No Direct Component Library Imports**  
Never import shadcn/ui components directly from `components/ui`. Wrap or extend them in feature-specific components. This enables design system changes without touching features.

### Route & Navigation Rules

**Rule 8: Route Param Naming Convention**  
Route params must follow pattern: `:resourceId` where resource is singular (tripId, eventId, restaurantId, rentalId). Never use generic `:id` or abbreviated names.

**Rule 9: All Routes in Sitemap**  
Every route added to app must be documented in sitemap table before implementation. No stealth routes. Sitemap is single source of truth for navigation structure.

**Rule 10: Loader/Action Colocation**  
Route loaders and actions should be defined in route module or feature hook. Never define data fetching logic inside page components. Keeps rendering and data fetching separate.

### Security & Data Rules

**Rule 11: No Secrets in Client**  
Never commit API keys, tokens, or sensitive data to repository. All secrets must use environment variables with VITE_ prefix. Example: VITE_SUPABASE_ANON_KEY not hardcoded string.

**Rule 12: Validate Route Params**  
All route params must be validated in loader before use. Throw 404 error for invalid IDs. Never trust user input from URL parameters.

**Rule 13: Auth State Centralized**  
Authentication state managed only in AuthProvider context. No local auth state in components. All auth checks use useAuth hook from features/auth.

### Code Quality Rules

**Rule 14: TypeScript Strict Mode**  
All TypeScript must compile in strict mode. No `any` types except in edge cases with comment explaining why. Prefer `unknown` over `any` when type truly unknown.

**Rule 15: Component Naming Convention**  
Components must be PascalCase and match filename. Page components must end with "Page" suffix (TripDetailPage). Layout components must end with "Layout" suffix.

---

## 9) SUCCESS CRITERIA

### Phase 1 Complete When

- All 60+ routes from sitemap render placeholder pages
- Navigation works between all routes without errors
- Protected routes redirect to login when not authenticated
- Build completes and preview server runs production bundle
- No TypeScript errors, no console errors, no broken imports
- Validation checklist 100% passing
- Documentation up to date with actual implementation

### Ready for Phase 2 When

- Real page content replaces placeholders for marketing pages
- Supabase client integrated and auth flow working
- First feature module (trips) has real components not placeholders
- AI panel can toggle open/close and maintain state
- Mobile responsive verified on real devices
- Design system tokens applied consistently

### Production Ready When

- All features implemented with real data from Supabase
- AI agents connected and responding to user queries
- Error boundaries tested with real error scenarios
- Performance metrics meet targets (LCP < 2.5s, FID < 100ms)
- SEO meta tags and structured data added
- Accessibility audit passed (WCAG 2.1 AA)
- Security audit passed (no exposed secrets, XSS protection)

---

**Document Status:** ✅ Ready for Implementation  
**Last Updated:** December 24, 2024  
**Next Steps:** Execute setup steps 1-12, then validate with checklist  
**Owner:** Frontend Team
