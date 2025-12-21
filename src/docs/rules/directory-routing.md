# Directory Structure & Routing

**Purpose:** Define project structure and routing rules  
**Principle:** Structure follows user journeys, not developer preference

---

## CORE PRINCIPLE

**One route = one screen = one purpose = one primary action**

Structure must be:
- Scalable (add features without refactoring)
- Predictable (anyone knows where code lives)
- Production-safe (no circular deps, clear ownership)

---

## TOP-LEVEL STRUCTURE

```
/
├── routes/              → Route definitions, guards, grouping
├── layouts/             → Route-level layouts (public, app, wizard)
├── screens/             → Full pages tied 1:1 to routes
├── features/            → Feature logic (data, actions, AI triggers)
├── components/          → Reusable UI only (no business logic)
├── services/            → API + Edge Function clients
├── ai/                  → Agents, prompts, schemas
├── lib/                 → Shared utilities and config
├── types/               → Shared TypeScript types
├── assets/              → Static files (images, fonts)
├── styles/              → Global CSS, Tailwind config
├── docs/                → Rules and specs
├── supabase/            → Backend (Edge Functions, migrations)
└── public/              → Public static assets
```

---

## OWNERSHIP RULES

```
Routes own → Screens
Screens compose → Features
Features own → Logic, data, AI actions
Components → UI only (no business logic)
AI → Lives inside the feature that uses it
```

**Decision Tree:**

```
Where does this code go?
├─ Is it a route definition? → /routes
├─ Is it a full page? → /screens
├─ Is it feature logic? → /features
├─ Is it reusable UI? → /components
├─ Is it an API call? → /services
├─ Is it AI-related? → /ai (or /features/[feature]/ai)
├─ Is it a utility? → /lib
└─ Don't know? → /features (default)
```

---

## DIRECTORY DETAILS

### /routes

**Purpose:** Route configuration, guards, and grouping

```
/routes
├── index.tsx              → Root route config
├── public.tsx             → Public routes (marketing, auth)
├── app.tsx                → Authenticated app routes
├── wizard.tsx             → Multi-step flows
├── guards/
│   ├── AuthGuard.tsx      → Require authentication
│   ├── GuestGuard.tsx     → Redirect if authenticated
│   └── PermissionGuard.tsx → Role-based access
└── types.ts               → Route metadata types
```

**Example:**
```typescript
// routes/app.tsx
export const appRoutes = [
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardScreen /> },
      { path: 'trip/:id', element: <TripDetailScreen /> },
      { path: 'search', element: <SearchScreen /> },
      { path: 'collections', element: <CollectionsScreen /> },
      { path: 'settings', element: <SettingsScreen /> }
    ]
  }
];
```

---

### /layouts

**Purpose:** Wrap groups of routes with shared UI

```
/layouts
├── PublicLayout.tsx       → Marketing, landing, auth
├── AppLayout.tsx          → Dashboard, main app
├── WizardLayout.tsx       → Multi-step flows
└── components/
    ├── Header.tsx
    ├── Sidebar.tsx
    └── Footer.tsx
```

**Rules:**
- Layouts define navigation structure
- Layouts never contain business logic
- Layouts are route-aware (show active state)
- Each layout has one clear purpose

---

### /screens

**Purpose:** Full-page components tied 1:1 to routes

```
/screens
├── public/
│   ├── HomePage.tsx
│   ├── HowItWorksPage.tsx
│   ├── PricingPage.tsx
│   └── LoginPage.tsx
├── app/
│   ├── DashboardScreen.tsx
│   ├── TripDetailScreen.tsx
│   ├── SearchScreen.tsx
│   ├── CollectionsScreen.tsx
│   └── SettingsScreen.tsx
└── wizard/
    ├── OnboardingWizard.tsx
    └── TripBuilderWizard.tsx
```

**Rules:**
- One screen = one route
- Screens compose features
- Screens handle:
  - Layout composition
  - Feature orchestration
  - Route-level states (loading, error, empty)
- Screens NEVER contain:
  - Business logic
  - API calls
  - Data transformations

**Example:**
```typescript
// screens/app/TripDetailScreen.tsx
export function TripDetailScreen() {
  const { id } = useParams();
  const { trip, loading, error } = useTripDetail(id);

  if (loading) return <TripDetailSkeleton />;
  if (error) return <ErrorState error={error} />;
  if (!trip) return <EmptyState message="Trip not found" />;

  return (
    <div>
      <TripHeader trip={trip} />
      <TripItinerary items={trip.items} />
      <TripActions tripId={trip.id} />
    </div>
  );
}
```

---

### /features

**Purpose:** Feature-specific logic, data, and AI

```
/features
├── trips/
│   ├── index.ts                  → Public API (barrel export)
│   ├── hooks/
│   │   ├── useTripDetail.ts      → Data fetching
│   │   ├── useTripActions.ts     → Actions (save, delete)
│   │   └── useTripSync.ts        → Real-time sync
│   ├── components/
│   │   ├── TripHeader.tsx
│   │   ├── TripItinerary.tsx
│   │   └── TripActions.tsx
│   ├── ai/
│   │   ├── planItinerary.ts      → AI agent call
│   │   └── optimizeRoute.ts      → AI optimization
│   ├── services/
│   │   └── tripService.ts        → API client
│   ├── types.ts
│   └── utils.ts
│
├── search/
│   ├── index.ts
│   ├── hooks/
│   ├── components/
│   ├── ai/
│   └── services/
│
└── recommendations/
    ├── index.ts
    ├── hooks/
    ├── components/
    ├── ai/
    └── services/
```

**Rules:**
- Features are self-contained
- Features expose public API via `index.ts`
- Features can use other features (import from index only)
- AI logic lives inside the feature that uses it

**Example:**
```typescript
// features/trips/index.ts (barrel export)
export { useTripDetail } from './hooks/useTripDetail';
export { useTripActions } from './hooks/useTripActions';
export { TripHeader } from './components/TripHeader';
export { TripItinerary } from './components/TripItinerary';
export type { Trip, TripItem } from './types';
```

---

### /components

**Purpose:** Reusable UI components (NO business logic)

```
/components
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Card.tsx
│   └── Tooltip.tsx
├── layout/
│   ├── Container.tsx
│   ├── Grid.tsx
│   └── Stack.tsx
├── feedback/
│   ├── Loading.tsx
│   ├── ErrorState.tsx
│   ├── EmptyState.tsx
│   └── Toast.tsx
└── animations/
    ├── FadeIn.tsx
    ├── SlideIn.tsx
    └── StaggerChildren.tsx
```

**Rules:**
- Components are "dumb" (no data fetching, no business logic)
- Components receive all data via props
- Components are fully controlled by parent
- Components have clear prop types
- Components handle their own loading/error UI

**Bad Example:**
```typescript
// ❌ BAD: Component fetches data
function ProductCard({ productId }) {
  const { product } = useProduct(productId); // NO!
  return <div>{product.name}</div>;
}
```

**Good Example:**
```typescript
// ✅ GOOD: Component receives data
function ProductCard({ product }) {
  return <div>{product.name}</div>;
}
```

---

### /services

**Purpose:** API clients and Edge Function wrappers

```
/services
├── api/
│   ├── client.ts              → Base API client (fetch wrapper)
│   ├── trips.ts               → Trip endpoints
│   ├── search.ts              → Search endpoints
│   └── recommendations.ts     → Recommendation endpoints
├── supabase/
│   ├── client.ts              → Supabase client
│   └── auth.ts                → Auth helpers
└── storage/
    └── fileUpload.ts          → File upload service
```

**Example:**
```typescript
// services/api/trips.ts
import { apiClient } from './client';

export const tripsService = {
  getTrip: (id: string) => 
    apiClient.get(`/trips/${id}`),
    
  createTrip: (data: CreateTripInput) => 
    apiClient.post('/trips', data),
    
  updateTrip: (id: string, data: UpdateTripInput) => 
    apiClient.put(`/trips/${id}`, data),
    
  deleteTrip: (id: string) => 
    apiClient.delete(`/trips/${id}`)
};
```

---

### /ai

**Purpose:** AI agents, prompts, and shared AI logic

```
/ai
├── agents/
│   ├── orchestrator.ts        → Main AI orchestrator
│   ├── context.ts             → Context & memory agent
│   ├── retrieval.ts           → RAG agent
│   ├── reasoning.ts           → Reasoning agent
│   ├── execution.ts           → Execution agent
│   └── grounding.ts           → Grounding agent
├── prompts/
│   ├── system.ts              → System prompts
│   ├── itinerary.ts           → Itinerary planning prompts
│   └── recommendations.ts     → Recommendation prompts
├── schemas/
│   ├── itinerary.ts           → Structured output schemas
│   └── recommendation.ts
├── config.ts                  → Gemini config
└── types.ts
```

**When to use /ai vs /features/[feature]/ai:**

```
Global AI (shared across features) → /ai
Feature-specific AI → /features/[feature]/ai

Example:
- Orchestrator → /ai/agents/orchestrator.ts (used everywhere)
- Trip planning AI → /features/trips/ai/planItinerary.ts (trips only)
```

---

### /lib

**Purpose:** Shared utilities and configuration

```
/lib
├── utils/
│   ├── date.ts                → Date formatting
│   ├── string.ts              → String helpers
│   ├── validation.ts          → Input validation
│   └── format.ts              → Number, currency formatting
├── hooks/
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── useMediaQuery.ts
├── constants/
│   ├── routes.ts              → Route paths
│   ├── config.ts              → App config
│   └── api.ts                 → API endpoints
└── errors/
    ├── AppError.ts
    └── errorHandler.ts
```

---

## ROUTING PATTERNS

### Route Structure

```typescript
// ✅ GOOD: Clear, hierarchical, RESTful
/                          → Homepage
/how-it-works              → Marketing
/pricing                   → Marketing
/login                     → Auth
/signup                    → Auth

/app                       → Dashboard
/app/trip/:id              → Trip detail
/app/trip/:id/edit         → Edit trip
/app/search                → Search
/app/collections           → Collections
/app/collections/:id       → Collection detail
/app/settings              → Settings
/app/settings/profile      → Profile settings
/app/settings/billing      → Billing settings

/wizard/onboarding         → Onboarding flow
/wizard/trip-builder       → Trip builder flow
```

**Rules:**
- Public routes: `/[page]`
- App routes: `/app/[feature]` or `/app/[feature]/:id`
- Wizard routes: `/wizard/[flow-name]`
- Settings: `/app/settings/[section]`
- Params = identity (`:id`, `:slug`)
- Query strings = state (`?filter=active&sort=date`)

---

### Route Guards

```typescript
// routes/app.tsx
import { AuthGuard } from './guards/AuthGuard';

export const appRoutes = [
  {
    path: '/app',
    element: <AuthGuard><AppLayout /></AuthGuard>,
    children: [
      // All children are protected
    ]
  }
];
```

**Guard Types:**
- `AuthGuard` → Require authentication
- `GuestGuard` → Redirect if authenticated (login, signup)
- `PermissionGuard` → Role-based access
- `OnboardingGuard` → Force onboarding if incomplete

---

### Route Metadata

```typescript
// types/routes.ts
export interface RouteMetadata {
  title: string;
  description?: string;
  requiresAuth: boolean;
  permissions?: string[];
  layout: 'public' | 'app' | 'wizard';
  breadcrumbs?: Breadcrumb[];
}
```

---

## IMPORT PATH RULES

### Path Aliases

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/features/*": ["./src/features/*"],
      "@/screens/*": ["./src/screens/*"],
      "@/layouts/*": ["./src/layouts/*"],
      "@/services/*": ["./src/services/*"],
      "@/ai/*": ["./src/ai/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

### Import Order

```typescript
// 1. External dependencies
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

// 2. Internal aliases (grouped by layer)
import { Button, Card } from '@/components/ui';
import { useTripDetail } from '@/features/trips';
import { tripsService } from '@/services/api/trips';
import { formatDate } from '@/lib/utils/date';

// 3. Relative imports (same feature/directory)
import { TripHeader } from './TripHeader';
import type { Trip } from './types';
```

### Import Rules

**✅ DO:**
```typescript
// Import from feature's public API (barrel export)
import { useTripDetail, TripHeader } from '@/features/trips';

// Import from component library
import { Button, Modal } from '@/components/ui';

// Import from lib
import { formatCurrency } from '@/lib/utils/format';
```

**❌ DON'T:**
```typescript
// Don't bypass barrel exports
import { useTripDetail } from '@/features/trips/hooks/useTripDetail';

// Don't use relative paths across features
import { SearchBar } from '../../../features/search/components/SearchBar';

// Don't import from screens
import { DashboardScreen } from '@/screens/app/DashboardScreen';
```

---

## BARREL EXPORTS (INDEX FILES)

### Feature Public API

```typescript
// features/trips/index.ts

// Hooks
export { useTripDetail } from './hooks/useTripDetail';
export { useTripActions } from './hooks/useTripActions';

// Components
export { TripHeader } from './components/TripHeader';
export { TripItinerary } from './components/TripItinerary';

// Types (use type-only imports)
export type { Trip, TripItem, CreateTripInput } from './types';

// Utils (if needed externally)
export { calculateTripDuration } from './utils';
```

**Rules:**
- Only export what's needed externally
- Keep internal utilities/components private
- Use `export type` for TypeScript types
- Document public API in comments

---

## FILE NAMING CONVENTIONS

```
Components:      PascalCase      → Button.tsx, TripHeader.tsx
Hooks:           camelCase       → useTripDetail.ts, useAuth.ts
Utilities:       camelCase       → formatDate.ts, validation.ts
Services:        camelCase       → tripService.ts, apiClient.ts
Types:           camelCase       → types.ts, trip.types.ts
Constants:       camelCase       → constants.ts, routes.ts
Screens:         PascalCase      → DashboardScreen.tsx
Layouts:         PascalCase      → AppLayout.tsx
Config:          camelCase       → config.ts, tailwind.config.js
```

**Pattern:**
- React components → PascalCase
- Everything else → camelCase
- Test files → `[name].test.ts` or `[name].spec.ts`

---

## STATE MANAGEMENT RULES

### Screen-Level States (MANDATORY)

Every screen must define:

```typescript
// screens/app/TripDetailScreen.tsx
export function TripDetailScreen() {
  const { id } = useParams();
  const { trip, loading, error } = useTripDetail(id);

  // 1. LOADING STATE
  if (loading) {
    return <TripDetailSkeleton />;
  }

  // 2. ERROR STATE
  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // 3. EMPTY STATE
  if (!trip) {
    return (
      <EmptyState
        title="Trip not found"
        action={{ label: 'Go to Dashboard', href: '/app' }}
      />
    );
  }

  // 4. SUCCESS STATE
  return <TripDetailContent trip={trip} />;
}
```

**No blank screens. Ever.**

---

## AI + ROUTING RULES

### AI Never Changes Routes

```typescript
// ❌ BAD: AI navigates
async function handleAIResponse(response) {
  // Process response...
  navigate('/app/trip/123'); // NO!
}

// ✅ GOOD: AI suggests, UI controls navigation
async function handleAIResponse(response) {
  // Process response...
  return {
    suggestion: '/app/trip/123',
    action: 'view-trip'
  };
}

// UI decides what to do
function ChatInterface() {
  const navigate = useNavigate();
  
  const handleAction = (action) => {
    if (action.type === 'view-trip') {
      navigate(action.suggestion);
    }
  };
}
```

### AI Results Screen

Long-running AI tasks route to a results screen:

```
User triggers AI → Loading screen → Results screen
```

```typescript
// Trigger
navigate('/app/ai/analyze', { state: { query } });

// AI processing happens on this screen
// When done, show results or route to next action
```

---

## DEEP LINKING RULES

All routes must support deep linking:

```typescript
// ✅ GOOD: Works when shared
/app/trip/abc123
/app/search?q=paris&dates=2024-12-15
/app/collections/my-favorites

// ❌ BAD: Requires session state
/app/trip (needs to load from context)
```

**Test:** Can you share this URL and have it work?

---

## VALIDATION CHECKLIST

```
STRUCTURE
[ ] Every route maps to a screen
[ ] Every screen maps to a feature owner
[ ] Features are self-contained
[ ] Components have no business logic
[ ] AI lives in /ai or /features/[feature]/ai

ROUTING
[ ] Routes reflect user workflows
[ ] Public/app/wizard routes separated
[ ] Deep links work (shareable URLs)
[ ] Back/forward navigation works
[ ] No route is a dead end

IMPORTS
[ ] Path aliases configured
[ ] Barrel exports for features
[ ] No circular dependencies
[ ] No bypassing public APIs
[ ] Import order consistent

STATES
[ ] Every screen has loading state
[ ] Every screen has error state
[ ] Every screen has empty state
[ ] No blank screens
[ ] All async operations handle errors

AI INTEGRATION
[ ] AI doesn't control navigation
[ ] AI outputs lead to clear next screen
[ ] Long AI tasks have status screens
[ ] AI actions belong to feature
```

---

## ANTI-PATTERNS

### ❌ DON'T: Bypass Barrel Exports

```typescript
// ❌ BAD
import { useTripDetail } from '@/features/trips/hooks/useTripDetail';

// ✅ GOOD
import { useTripDetail } from '@/features/trips';
```

### ❌ DON'T: Business Logic in Components

```typescript
// ❌ BAD
function TripCard({ tripId }) {
  const { trip } = useTripDetail(tripId); // Logic in component
  return <div>{trip.name}</div>;
}

// ✅ GOOD
function TripCard({ trip }) {
  return <div>{trip.name}</div>;
}
```

### ❌ DON'T: Deep Relative Imports

```typescript
// ❌ BAD
import { SearchBar } from '../../../features/search/components/SearchBar';

// ✅ GOOD
import { SearchBar } from '@/features/search';
```

### ❌ DON'T: Route State Without URL

```typescript
// ❌ BAD: State not in URL
const [filter, setFilter] = useState('active');

// ✅ GOOD: State in URL (shareable, bookmarkable)
const [searchParams, setSearchParams] = useSearchParams();
const filter = searchParams.get('filter') || 'active';
```

### ❌ DON'T: Missing States

```typescript
// ❌ BAD: No loading/error handling
function Screen() {
  const { data } = useData();
  return <div>{data.name}</div>; // Will crash if loading or error
}

// ✅ GOOD: Handle all states
function Screen() {
  const { data, loading, error } = useData();
  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (!data) return <Empty />;
  return <div>{data.name}</div>;
}
```

---

## MIGRATION GUIDE

If existing code violates these rules:

**Step 1: Identify violations**
```bash
# Find components with business logic
grep -r "useEffect.*fetch" src/components/

# Find deep imports
grep -r "import.*\.\./\.\./\.\." src/
```

**Step 2: Create feature structure**
```bash
mkdir -p src/features/trips/{hooks,components,services,ai}
```

**Step 3: Move code**
- Logic → `/features/[feature]/hooks`
- API calls → `/features/[feature]/services`
- AI → `/features/[feature]/ai`

**Step 4: Create barrel export**
```typescript
// features/trips/index.ts
export { useTripDetail } from './hooks/useTripDetail';
```

**Step 5: Update imports**
```typescript
// Before
import { useTripDetail } from '../hooks/useTripDetail';

// After
import { useTripDetail } from '@/features/trips';
```

---

## QUICK REFERENCE

**Where does this code go?**

| Code Type | Location | Example |
|-----------|----------|---------|
| Route definition | `/routes` | `appRoutes.tsx` |
| Full page | `/screens` | `DashboardScreen.tsx` |
| Feature logic | `/features/[name]` | `features/trips/hooks/useTripDetail.ts` |
| Reusable UI | `/components` | `Button.tsx` |
| API client | `/services` | `tripsService.ts` |
| AI agent | `/ai` or `/features/[name]/ai` | `orchestrator.ts` |
| Utility | `/lib` | `formatDate.ts` |
| Type | `/types` or `/features/[name]/types.ts` | `trip.types.ts` |

**How do I import?**

```typescript
// ✅ DO
import { useTripDetail } from '@/features/trips';
import { Button } from '@/components/ui';
import { formatDate } from '@/lib/utils/date';

// ❌ DON'T
import { useTripDetail } from '@/features/trips/hooks/useTripDetail';
import { Button } from '../../../components/ui/Button';
```

---

**This rule is followed if:**
- Every URL works when shared
- New features don't require refactoring routes
- Imports never go more than 2 levels deep
- No circular dependencies
- All screens handle loading/error/empty states

**If any rule is broken, the structure must be fixed before shipping.**
