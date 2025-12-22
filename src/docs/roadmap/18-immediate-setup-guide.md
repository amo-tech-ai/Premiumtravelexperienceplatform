# Immediate Setup Guide - Get to Production Ready

**Priority:** 🔴 **CRITICAL - DO THESE FIRST**  
**Time Required:** 2-4 hours  
**Goal:** Make AI features actually work

---

## Step 1: Set Up Gemini API (30 minutes)

### 1.1 Get API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API key"
3. Copy the key (starts with `AIza...`)

### 1.2 Add to Project

```bash
# Create .env file in project root
cp .env.example .env

# Edit .env and add your key
nano .env
```

Add this line:
```
VITE_GEMINI_API_KEY=AIza... your_actual_key_here
```

### 1.3 Verify It Works

```bash
# Restart dev server
npm run dev

# Open browser and test AI chat
# Should see real responses, not mock data
```

### 1.4 Test API Directly

```bash
# Test with curl
curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "contents": [{
      "parts":[{"text": "Hello, can you recommend restaurants in Medellín?"}]
    }]
  }'

# Should return JSON with AI response
```

**Success Criteria:**
- ✅ API key set in .env
- ✅ Curl test returns 200 OK
- ✅ AI chat shows real responses
- ✅ No "mock mode" warnings

---

## Step 2: Set Up Google Maps API (30 minutes)

### 2.1 Get API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Directions API

4. Go to "Credentials" → "Create Credentials" → "API key"
5. Copy the key

### 2.2 Restrict API Key (Important for Security)

1. Click on your API key to edit
2. Under "API restrictions":
   - Select "Restrict key"
   - Enable only:
     - Maps JavaScript API
     - Places API
     - Geocoding API
     - Directions API

3. Under "Website restrictions":
   - Add `localhost:5173` (dev)
   - Add your production domain

4. Save

### 2.3 Add to Project

```bash
# Edit .env
nano .env
```

Add this line:
```
VITE_GOOGLE_MAPS_API_KEY=AIza... your_maps_key_here
```

### 2.4 Test Integration

```bash
# Restart server
npm run dev

# Test geocoding
curl "https://maps.googleapis.com/maps/api/geocode/json?address=Medellin,Colombia&key=YOUR_KEY"

# Should return coordinates
```

**Success Criteria:**
- ✅ Maps API key set
- ✅ APIs enabled
- ✅ Key restricted for security
- ✅ Geocoding test returns results

---

## Step 3: Connect AI Agents to Backend (2 hours)

### 3.1 Current Problem

AI agents exist as isolated files but aren't connected to the orchestrator or backend.

```typescript
// BEFORE: Generic AI only
const response = await gemini.generateContent(prompt);

// AFTER: Routed to specialized agents
const agent = selectAgent(intent);
const response = await agent.process(request);
```

### 3.2 Fix Orchestrator

**File:** `/lib/ai/orchestrator.ts`

Add agent registration:

```typescript
import { LocalScoutAgent } from './agents/local-scout';
import { DiningOrchestratorAgent } from './agents/dining-orchestrator';
import { ItineraryOptimizerAgent } from './agents/itinerary-optimizer';
import { EventCuratorAgent } from './agents/event-curator';
import { BudgetGuardianAgent } from './agents/budget-guardian';
import { BookingAssistantAgent } from './agents/booking-assistant';

export class AIOrchestrator {
  private agents: Map<string, BaseAgent>;

  constructor() {
    this.agents = new Map();
    
    // Register all agents
    this.agents.set('local_scout', new LocalScoutAgent());
    this.agents.set('dining', new DiningOrchestratorAgent());
    this.agents.set('optimizer', new ItineraryOptimizerAgent());
    this.agents.set('events', new EventCuratorAgent());
    this.agents.set('budget', new BudgetGuardianAgent());
    this.agents.set('booking', new BookingAssistantAgent());
  }

  async routeRequest(intent: string, request: any) {
    // Select appropriate agent based on intent
    const agentKey = this.selectAgent(intent);
    const agent = this.agents.get(agentKey);
    
    if (!agent) {
      throw new Error(`Agent not found: ${agentKey}`);
    }
    
    return await agent.process(request);
  }

  private selectAgent(intent: string): string {
    // Intent → Agent mapping
    const mapping = {
      'event_discovery': 'events',
      'dining': 'dining',
      'optimization': 'optimizer',
      'budget': 'budget',
      'booking': 'booking',
      'local_discovery': 'local_scout',
    };
    
    return mapping[intent] || 'local_scout'; // Default
  }
}
```

### 3.3 Update Backend AI Service

**File:** `/supabase/functions/server/ai-service.tsx`

Replace generic processing with orchestrator:

```typescript
import { AIOrchestrator } from './ai-orchestrator'; // Need to create this

const orchestrator = new AIOrchestrator();

export async function processAIRequest(request: AIRequest): Promise<AIResponse> {
  // 1. Classify intent
  const intent = classifyIntent(request.message);
  
  // 2. Route to appropriate agent
  const response = await orchestrator.routeRequest(intent.intent, {
    message: request.message,
    userId: request.userId,
    tripId: request.tripId,
    context: await buildContext(request),
  });
  
  // 3. Return formatted response
  return {
    message: response.message,
    agent: response.agent,
    suggestions: response.suggestions,
    confidence: intent.confidence,
  };
}
```

### 3.4 Create Orchestrator for Backend

**File:** `/supabase/functions/server/ai-orchestrator.ts` (NEW FILE)

```typescript
// Copy agent logic from frontend
// Adapt for Deno environment
// Use same agent structure
```

**Success Criteria:**
- ✅ Orchestrator instantiated
- ✅ All 6 agents registered
- ✅ Intent classification working
- ✅ Agent routing functional
- ✅ Test each agent responds correctly

---

## Step 4: Add Error Monitoring (30 minutes)

### 4.1 Sign Up for Sentry

1. Go to [sentry.io](https://sentry.io)
2. Create free account
3. Create new project (React)
4. Copy DSN

### 4.2 Install Sentry

```bash
npm install @sentry/react
```

### 4.3 Initialize Sentry

**File:** `/src/main.tsx` or top of App.tsx

```typescript
import * as Sentry from '@sentry/react';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay(),
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
```

### 4.4 Add to .env

```
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

**Success Criteria:**
- ✅ Sentry installed
- ✅ DSN configured
- ✅ Test error captured
- ✅ Dashboard shows errors

---

## Step 5: Basic Authentication Setup (3-4 hours)

### 5.1 Enable Supabase Auth

Supabase auth is already configured on the backend, just need to add frontend UI.

### 5.2 Create Sign Up Page

**File:** `/pages/auth/SignUp.tsx` (NEW)

```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner@2.0.3';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) throw error;

      toast.success('Account created! Check your email to verify.');
      navigate('/app/trips');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-3xl">Create Account</h1>
        
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Sign Up'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-stone-600">
          Already have an account?{' '}
          <a href="/auth/sign-in" className="text-amber-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
```

### 5.3 Create Sign In Page

**File:** `/pages/auth/SignIn.tsx` (NEW)

```typescript
// Similar structure to SignUp
// Use supabase.auth.signInWithPassword()
```

### 5.4 Add Routes

**File:** `/App.tsx`

```typescript
// Add auth routes
<Route path="/auth/sign-up" element={<SignUp />} />
<Route path="/auth/sign-in" element={<SignIn />} />
```

### 5.5 Add Auth Guard

**File:** `/components/auth/AuthGuard.tsx` (NEW)

```typescript
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/auth/sign-in" />;

  return <>{children}</>;
}
```

### 5.6 Protect Routes

```typescript
// Wrap protected routes
<Route
  path="/app/*"
  element={
    <AuthGuard>
      <Routes>
        <Route path="trips" element={<TripsPage />} />
        {/* ... */}
      </Routes>
    </AuthGuard>
  }
/>
```

**Success Criteria:**
- ✅ Sign up page working
- ✅ Sign in page working
- ✅ Routes protected
- ✅ Session persisted
- ✅ Logout working

---

## Step 6: Verification Checklist

After completing steps 1-5, verify:

### Gemini AI
- [ ] API key in .env
- [ ] AI chat returns real responses
- [ ] No mock mode warnings
- [ ] Responses are contextual

### Google Maps
- [ ] API key in .env
- [ ] Maps display correctly
- [ ] Geocoding works
- [ ] Place search works

### AI Agents
- [ ] Orchestrator instantiated
- [ ] 6 agents registered
- [ ] Intent routing works
- [ ] Each agent responds correctly

### Error Monitoring
- [ ] Sentry installed
- [ ] DSN configured
- [ ] Errors tracked
- [ ] Dashboard accessible

### Authentication
- [ ] Sign up works
- [ ] Sign in works
- [ ] Routes protected
- [ ] Session persists
- [ ] Logout works

---

## Expected Outcomes

**BEFORE:**
- ❌ AI shows mock responses
- ❌ Maps don't work
- ❌ Single demo user
- ❌ No error tracking
- ❌ Generic AI responses

**AFTER:**
- ✅ AI shows real Gemini responses
- ✅ Maps work with real data
- ✅ Multiple users supported
- ✅ Errors tracked in Sentry
- ✅ Specialized agent responses

---

## Time Breakdown

| Task | Time | Priority |
|------|------|----------|
| Gemini API setup | 30 min | P0 |
| Google Maps setup | 30 min | P0 |
| Connect AI agents | 2 hours | P0 |
| Error monitoring | 30 min | P1 |
| Authentication | 3-4 hours | P0 |

**Total:** 6-8 hours of focused work

---

## Next Steps After This

Once these are complete, move to:
1. Split large files into modules
2. Remove dead code
3. Add drag & drop to itinerary
4. Complete save places feature
5. Write E2E tests

---

## Need Help?

### Gemini API Issues
- [API Documentation](https://ai.google.dev/docs)
- [API Key Management](https://aistudio.google.com/app/apikey)
- [Quota Limits](https://ai.google.dev/pricing)

### Google Maps Issues
- [Maps Documentation](https://developers.google.com/maps/documentation)
- [API Console](https://console.cloud.google.com/)
- [Billing](https://cloud.google.com/maps-platform/pricing)

### Supabase Auth Issues
- [Auth Documentation](https://supabase.com/docs/guides/auth)
- [Auth UI Components](https://supabase.com/docs/guides/auth/auth-helpers/auth-ui)

---

**Start Here:** Step 1 (Gemini API)  
**Then:** Step 2 (Google Maps)  
**Then:** Step 5 (Authentication)  
**Then:** Step 3 (AI Agents)  
**Finally:** Step 4 (Error Monitoring)

**Status after completion:** 🟢 **70% PRODUCTION READY**
