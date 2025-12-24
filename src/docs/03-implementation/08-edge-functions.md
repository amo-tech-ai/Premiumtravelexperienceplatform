# SUPABASE EDGE FUNCTIONS - COMPLETE SYSTEM
## Production-Ready API Endpoints for AI Trip Operating System

**Document:** 08-edge-functions.md  
**Created:** December 24, 2024  
**Purpose:** Define all Supabase Edge Functions for complete system  
**Status:** Production-Ready Architecture

---

## 📋 TABLE OF CONTENTS

1. [Edge Functions Overview](#edge-functions-overview)
2. [AI & Gemini Integration](#ai--gemini-integration)
3. [Trip Management](#trip-management)
4. [Conversations & Chat](#conversations--chat)
5. [Locations & Discovery](#locations--discovery)
6. [User Management](#user-management)
7. [Advanced AI Features](#advanced-ai-features)
8. [Background Jobs](#background-jobs)
9. [Webhooks & Integrations](#webhooks--integrations)
10. [Best Practices](#best-practices)

---

## 🎯 EDGE FUNCTIONS OVERVIEW

### Architecture Pattern

```
Frontend → Edge Function → Gemini API → Response
                ↓
           Supabase DB
```

### Functional Areas

| Area | Functions Count | Priority | Status |
|------|----------------|----------|---------|
| **AI & Gemini** | 8 | P0 - Critical | ⏳ To Build |
| **Trip Management** | 12 | P0 - Critical | 🟡 Partial |
| **Conversations** | 6 | P0 - Critical | ⏳ To Build |
| **Locations** | 8 | P0 - Critical | 🟢 Partial |
| **User Management** | 5 | P1 - High | ⏳ To Build |
| **Advanced AI** | 10 | P1 - High | ⏳ To Build |
| **Background Jobs** | 5 | P1 - High | 🟡 Partial |
| **Webhooks** | 4 | P2 - Medium | ⏳ To Build |
| **TOTAL** | **58** | - | 🔴 Needs Work |

---

## 🤖 AI & GEMINI INTEGRATION

### 1.1 Core AI Chat Endpoints

#### Function: `ai-chat`
**File:** `/supabase/functions/ai-chat/index.ts`

```typescript
/**
 * POST /ai-chat
 * Main AI chat endpoint - routes to appropriate agent
 */
{
  method: "POST",
  route: "/ai-chat",
  auth: "required",
  rateLimit: "100 requests/hour",
  
  input: {
    message: string,
    conversationId?: string,
    tripId?: string,
    context?: object
  },
  
  output: {
    message: string,
    agent: string,
    conversationId: string,
    suggestions?: string[]
  }
}
```

**Implementation:**
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.1.3";

serve(async (req) => {
  try {
    // 1. Authenticate user
    const authHeader = req.headers.get("Authorization");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader! } } }
    );
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401 
      });
    }

    // 2. Parse request
    const { message, conversationId, tripId, context } = await req.json();
    
    // 3. Load or create conversation
    let conversation;
    if (conversationId) {
      const { data } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", conversationId)
        .single();
      conversation = data;
    } else {
      const { data } = await supabase
        .from("conversations")
        .insert({
          user_id: user.id,
          title: message.substring(0, 50),
          agent_type: "general_concierge",
          trip_id: tripId
        })
        .select()
        .single();
      conversation = data;
    }
    
    // 4. Load conversation context
    const { data: contextData } = await supabase
      .from("ai_context")
      .select("*")
      .eq("conversation_id", conversation.id)
      .single();
    
    // 5. Classify intent and route to agent
    const intent = await classifyIntent(message, contextData);
    const agentName = routeToAgent(intent);
    
    // 6. Call Gemini API
    const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY")!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = buildPrompt(message, contextData, agentName);
    const startTime = Date.now();
    const result = await model.generateContent(prompt);
    const duration = Date.now() - startTime;
    const response = await result.response;
    const text = response.text();
    
    // 7. Save messages
    await supabase.from("messages").insert([
      {
        conversation_id: conversation.id,
        role: "user",
        content: message
      },
      {
        conversation_id: conversation.id,
        role: "assistant",
        content: text,
        agent_name: agentName,
        latency_ms: duration
      }
    ]);
    
    // 8. Update context
    await updateContext(supabase, conversation.id, { message, response: text });
    
    // 9. Log AI run
    await supabase.from("ai_runs").insert({
      user_id: user.id,
      conversation_id: conversation.id,
      agent_name: agentName,
      agent_type: getAgentType(agentName),
      status: "success",
      input_data: { message },
      output_data: { response: text },
      duration_ms: duration,
      model_name: "gemini-1.5-flash"
    });
    
    return new Response(JSON.stringify({
      message: text,
      agent: agentName,
      conversationId: conversation.id
    }), {
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error("AI chat error:", error);
    return new Response(JSON.stringify({ 
      error: "Internal server error",
      details: error.message 
    }), { 
      status: 500 
    });
  }
});
```

---

#### Function: `ai-chat-stream`
**File:** `/supabase/functions/ai-chat-stream/index.ts`

```typescript
/**
 * POST /ai-chat-stream
 * Streaming AI chat for real-time responses
 */
{
  method: "POST",
  route: "/ai-chat-stream",
  auth: "required",
  rateLimit: "100 requests/hour",
  responseType: "text/event-stream",
  
  input: {
    message: string,
    conversationId?: string,
    tripId?: string
  },
  
  output: "Server-Sent Events (SSE) stream"
}
```

**Implementation:**
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Setup (same as ai-chat)
        const { message, conversationId } = await req.json();
        
        // Stream from Gemini
        const result = await model.generateContentStream(prompt);
        
        let fullResponse = "";
        for await (const chunk of result.stream) {
          const text = chunk.text();
          fullResponse += text;
          
          // Send SSE
          controller.enqueue(
            new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\n`)
          );
        }
        
        // Save after complete
        await saveMessages(fullResponse);
        
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    }
  });
  
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    }
  });
});
```

---

### 1.2 Agent-Specific Endpoints

#### Function: `ai-agent-local-scout`
```typescript
/**
 * POST /ai-agent-local-scout
 * Local Scout agent for destination recommendations
 */
{
  method: "POST",
  route: "/ai-agent-local-scout",
  auth: "required",
  
  input: {
    query: string,
    destination: string,
    preferences?: object,
    tripId?: string
  },
  
  output: {
    recommendations: Array<{
      name: string,
      type: string,
      description: string,
      reasoning: string,
      confidence: number
    }>,
    sources: string[]
  }
}
```

#### Function: `ai-agent-dining`
```typescript
/**
 * POST /ai-agent-dining
 * Dining Orchestrator for restaurant recommendations
 */
{
  method: "POST",
  route: "/ai-agent-dining",
  auth: "required",
  
  input: {
    preferences: {
      cuisine?: string[],
      priceLevel?: number,
      dietary?: string[],
      occasion?: string
    },
    location: { lat: number, lng: number },
    datetime: string,
    partySize: number
  },
  
  output: {
    restaurants: Array<{
      id: string,
      name: string,
      cuisine: string,
      match_score: number,
      reasoning: string,
      booking_available: boolean
    }>
  }
}
```

#### Function: `ai-agent-itinerary-optimizer`
```typescript
/**
 * POST /ai-agent-itinerary-optimizer
 * Optimize itinerary for time, cost, and experience
 */
{
  method: "POST",
  route: "/ai-agent-itinerary-optimizer",
  auth: "required",
  
  input: {
    tripId: string,
    optimizationGoals: string[], // ['time', 'cost', 'experience']
    constraints?: object
  },
  
  output: {
    optimizedItinerary: object,
    improvements: Array<{
      type: string,
      description: string,
      impact: string
    }>,
    score: number
  }
}
```

#### Function: `ai-agent-event-curator`
```typescript
/**
 * POST /ai-agent-event-curator
 * Curate events and activities
 */
{
  method: "POST",
  route: "/ai-agent-event-curator",
  auth: "required",
  
  input: {
    destination: string,
    dates: { start: string, end: string },
    interests: string[],
    tripId?: string
  },
  
  output: {
    events: Array<{
      name: string,
      date: string,
      type: string,
      relevance_score: number,
      why_recommended: string
    }>
  }
}
```

#### Function: `ai-agent-budget-guardian`
```typescript
/**
 * POST /ai-agent-budget-guardian
 * Monitor budget and suggest optimizations
 */
{
  method: "POST",
  route: "/ai-agent-budget-guardian",
  auth: "required",
  
  input: {
    tripId: string,
    action?: 'analyze' | 'optimize' | 'alert'
  },
  
  output: {
    status: 'on_track' | 'warning' | 'over_budget',
    spent: number,
    remaining: number,
    recommendations: Array<{
      type: string,
      description: string,
      potential_savings: number
    }>,
    alerts: Array<object>
  }
}
```

#### Function: `ai-agent-booking-assistant`
```typescript
/**
 * POST /ai-agent-booking-assistant
 * Multi-step booking workflow
 */
{
  method: "POST",
  route: "/ai-agent-booking-assistant",
  auth: "required",
  
  input: {
    workflowId?: string,
    action: 'start' | 'continue' | 'confirm',
    data: object
  },
  
  output: {
    workflowId: string,
    currentStep: string,
    nextActions: string[],
    requiresInput: boolean,
    status: 'pending' | 'confirmed' | 'failed'
  }
}
```

---

### 1.3 AI Utility Functions

#### Function: `ai-classify-intent`
```typescript
/**
 * POST /ai-classify-intent
 * Classify user intent for routing
 */
{
  method: "POST",
  route: "/ai-classify-intent",
  auth: "required",
  rateLimit: "200 requests/hour",
  
  input: {
    message: string,
    context?: object
  },
  
  output: {
    intent: string,
    confidence: number,
    suggested_agent: string,
    entities: object
  }
}
```

#### Function: `ai-context-update`
```typescript
/**
 * PUT /ai-context/:conversationId
 * Update conversation context
 */
{
  method: "PUT",
  route: "/ai-context/:conversationId",
  auth: "required",
  
  input: {
    session_context?: object,
    user_context?: object,
    global_context?: object,
    entities?: object
  },
  
  output: {
    success: boolean,
    version: number
  }
}
```

---

## 🗺️ TRIP MANAGEMENT

### 2.1 Trip CRUD Operations

#### Function: `trips-list`
```typescript
/**
 * GET /trips
 * List user's trips with filtering
 */
{
  method: "GET",
  route: "/trips",
  auth: "required",
  cache: "60 seconds",
  
  queryParams: {
    status?: string,
    limit?: number,
    offset?: number,
    sort?: 'created_at' | 'start_date' | 'title'
  },
  
  output: {
    trips: Array<Trip>,
    total: number,
    hasMore: boolean
  }
}
```

**Implementation:**
```typescript
serve(async (req) => {
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const offset = parseInt(url.searchParams.get("offset") || "0");
  
  const { data: user } = await supabase.auth.getUser();
  
  let query = supabase
    .from("trips")
    .select("*, itinerary_items(count)", { count: "exact" })
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (status) {
    query = query.eq("status", status);
  }
  
  const { data, error, count } = await query;
  
  return new Response(JSON.stringify({
    trips: data,
    total: count,
    hasMore: count > offset + limit
  }));
});
```

#### Function: `trips-create`
```typescript
/**
 * POST /trips
 * Create new trip
 */
{
  method: "POST",
  route: "/trips",
  auth: "required",
  
  input: {
    title: string,
    description?: string,
    destination: string,
    start_date: string,
    end_date: string,
    budget_total?: number,
    currency?: string
  },
  
  output: {
    trip: Trip,
    conversationId?: string // Auto-created planning conversation
  }
}
```

#### Function: `trips-get`
```typescript
/**
 * GET /trips/:id
 * Get single trip with full details
 */
{
  method: "GET",
  route: "/trips/:id",
  auth: "required",
  cache: "30 seconds",
  
  output: {
    trip: Trip,
    items: ItineraryItem[],
    budget: BudgetTracking,
    conflicts: Conflict[],
    suggestions: Suggestion[]
  }
}
```

#### Function: `trips-update`
```typescript
/**
 * PUT /trips/:id
 * Update trip details
 */
{
  method: "PUT",
  route: "/trips/:id",
  auth: "required",
  
  input: Partial<Trip>,
  
  output: {
    trip: Trip
  }
}
```

#### Function: `trips-delete`
```typescript
/**
 * DELETE /trips/:id
 * Soft delete trip
 */
{
  method: "DELETE",
  route: "/trips/:id",
  auth: "required",
  
  output: {
    success: boolean
  }
}
```

---

### 2.2 Itinerary Item Operations

#### Function: `itinerary-items-list`
```typescript
/**
 * GET /trips/:tripId/items
 * Get all items for a trip
 */
{
  method: "GET",
  route: "/trips/:tripId/items",
  auth: "required",
  cache: "30 seconds",
  
  queryParams: {
    day?: number,
    type?: string
  },
  
  output: {
    items: ItineraryItem[],
    groupedByDay?: Record<number, ItineraryItem[]>
  }
}
```

#### Function: `itinerary-items-create`
```typescript
/**
 * POST /trips/:tripId/items
 * Add item to itinerary
 */
{
  method: "POST",
  route: "/trips/:tripId/items",
  auth: "required",
  
  input: {
    title: string,
    type: string,
    day_number: number,
    start_time?: string,
    end_time?: string,
    location_id?: string,
    cost?: number,
    notes?: string
  },
  
  output: {
    item: ItineraryItem,
    conflicts?: Conflict[] // Auto-detect conflicts
  }
}
```

#### Function: `itinerary-items-update`
```typescript
/**
 * PUT /trips/:tripId/items/:itemId
 * Update itinerary item
 */
{
  method: "PUT",
  route: "/trips/:tripId/items/:itemId",
  auth: "required",
  
  input: Partial<ItineraryItem>,
  
  output: {
    item: ItineraryItem,
    conflicts?: Conflict[]
  }
}
```

#### Function: `itinerary-items-reorder`
```typescript
/**
 * POST /trips/:tripId/items/reorder
 * Reorder items in itinerary
 */
{
  method: "POST",
  route: "/trips/:tripId/items/reorder",
  auth: "required",
  
  input: {
    items: Array<{ id: string, day_number: number, sort_order: number }>
  },
  
  output: {
    success: boolean,
    optimizationSuggestions?: string[]
  }
}
```

#### Function: `itinerary-optimize`
```typescript
/**
 * POST /trips/:tripId/optimize
 * AI-optimize entire itinerary
 */
{
  method: "POST",
  route: "/trips/:tripId/optimize",
  auth: "required",
  rateLimit: "10 requests/hour",
  
  input: {
    goals: string[], // ['time', 'cost', 'experience']
    constraints?: object
  },
  
  output: {
    optimizedItems: ItineraryItem[],
    changes: Array<{
      type: string,
      description: string,
      impact: string
    }>,
    score: {
      before: number,
      after: number,
      improvement: number
    }
  }
}
```

---

## 💬 CONVERSATIONS & CHAT

#### Function: `conversations-list`
```typescript
/**
 * GET /conversations
 * List user's conversations
 */
{
  method: "GET",
  route: "/conversations",
  auth: "required",
  
  queryParams: {
    status?: string,
    agent_type?: string,
    trip_id?: string,
    limit?: number
  },
  
  output: {
    conversations: Conversation[]
  }
}
```

#### Function: `conversations-get`
```typescript
/**
 * GET /conversations/:id
 * Get conversation with messages
 */
{
  method: "GET",
  route: "/conversations/:id",
  auth: "required",
  cache: "10 seconds",
  
  output: {
    conversation: Conversation,
    messages: Message[],
    context: AIContext
  }
}
```

#### Function: `conversations-create`
```typescript
/**
 * POST /conversations
 * Create new conversation
 */
{
  method: "POST",
  route: "/conversations",
  auth: "required",
  
  input: {
    title: string,
    agent_type: string,
    trip_id?: string
  },
  
  output: {
    conversation: Conversation
  }
}
```

#### Function: `conversations-update`
```typescript
/**
 * PUT /conversations/:id
 * Update conversation (title, status)
 */
{
  method: "PUT",
  route: "/conversations/:id",
  auth: "required",
  
  input: {
    title?: string,
    status?: string
  },
  
  output: {
    conversation: Conversation
  }
}
```

#### Function: `conversations-archive`
```typescript
/**
 * POST /conversations/:id/archive
 * Archive conversation
 */
{
  method: "POST",
  route: "/conversations/:id/archive",
  auth: "required",
  
  output: {
    success: boolean
  }
}
```

#### Function: `messages-create`
```typescript
/**
 * POST /conversations/:id/messages
 * Add message to conversation (user message only, AI response via /ai-chat)
 */
{
  method: "POST",
  route: "/conversations/:id/messages",
  auth: "required",
  
  input: {
    content: string,
    role: 'user'
  },
  
  output: {
    message: Message
  }
}
```

---

## 📍 LOCATIONS & DISCOVERY

#### Function: `locations-search`
```typescript
/**
 * GET /locations/search
 * Search locations with filters
 */
{
  method: "GET",
  route: "/locations/search",
  auth: "optional",
  cache: "5 minutes",
  
  queryParams: {
    q?: string, // Full-text search
    category?: string,
    city?: string,
    lat?: number,
    lng?: number,
    radius_km?: number,
    min_rating?: number,
    price_level?: number,
    tags?: string[],
    limit?: number
  },
  
  output: {
    locations: Location[],
    total: number
  }
}
```

**Implementation:**
```typescript
serve(async (req) => {
  const url = new URL(req.url);
  const q = url.searchParams.get("q");
  const category = url.searchParams.get("category");
  const lat = parseFloat(url.searchParams.get("lat") || "0");
  const lng = parseFloat(url.searchParams.get("lng") || "0");
  const radiusKm = parseInt(url.searchParams.get("radius_km") || "10");
  
  let query = supabase
    .from("locations")
    .select("*")
    .is("deleted_at", null)
    .eq("is_active", true);
  
  if (category) query = query.eq("category", category);
  
  // Full-text search
  if (q) {
    query = query.textSearch("name", q, { 
      type: "websearch",
      config: "english"
    });
  }
  
  // Geo-proximity (if lat/lng provided)
  if (lat && lng) {
    // Call DB function for distance calculation
    const { data } = await supabase.rpc("search_nearby_locations", {
      p_latitude: lat,
      p_longitude: lng,
      p_radius_km: radiusKm,
      p_category: category
    });
    
    return new Response(JSON.stringify({
      locations: data,
      total: data?.length || 0
    }));
  }
  
  const { data, count } = await query;
  
  return new Response(JSON.stringify({
    locations: data,
    total: count
  }));
});
```

#### Function: `locations-get`
```typescript
/**
 * GET /locations/:id
 * Get location details
 */
{
  method: "GET",
  route: "/locations/:id",
  auth: "optional",
  cache: "10 minutes",
  
  output: {
    location: Location,
    related: Location[], // Similar locations
    reviews?: object[] // If integrated with external API
  }
}
```

#### Function: `locations-create`
```typescript
/**
 * POST /locations
 * Create new location (user-generated content)
 */
{
  method: "POST",
  route: "/locations",
  auth: "required",
  
  input: {
    name: string,
    category: string,
    address?: string,
    latitude?: number,
    longitude?: number,
    description?: string,
    tags?: string[],
    // Category-specific fields in details JSONB
    details?: object
  },
  
  output: {
    location: Location
  }
}
```

#### Function: `locations-nearby`
```typescript
/**
 * GET /locations/nearby
 * Find nearby locations (geo-search)
 */
{
  method: "GET",
  route: "/locations/nearby",
  auth: "optional",
  cache: "2 minutes",
  
  queryParams: {
    lat: number,
    lng: number,
    radius_km?: number,
    category?: string,
    limit?: number
  },
  
  output: {
    locations: Array<Location & { distance_km: number }>
  }
}
```

#### Function: `locations-import-google`
```typescript
/**
 * POST /locations/import/google
 * Import location from Google Places API
 */
{
  method: "POST",
  route: "/locations/import/google",
  auth: "required",
  rateLimit: "50 requests/hour",
  
  input: {
    place_id: string // Google Place ID
  },
  
  output: {
    location: Location,
    created: boolean // true if new, false if already exists
  }
}
```

---

## 👤 USER MANAGEMENT

#### Function: `users-profile-get`
```typescript
/**
 * GET /users/profile
 * Get current user profile
 */
{
  method: "GET",
  route: "/users/profile",
  auth: "required",
  cache: "30 seconds",
  
  output: {
    profile: Profile,
    stats: {
      trips_count: number,
      conversations_count: number,
      ai_usage: object
    }
  }
}
```

#### Function: `users-profile-update`
```typescript
/**
 * PUT /users/profile
 * Update user profile
 */
{
  method: "PUT",
  route: "/users/profile",
  auth: "required",
  
  input: Partial<Profile>,
  
  output: {
    profile: Profile
  }
}
```

#### Function: `users-preferences-get`
```typescript
/**
 * GET /users/preferences
 * Get user preferences for AI personalization
 */
{
  method: "GET",
  route: "/users/preferences",
  auth: "required",
  
  output: {
    preferences: {
      travel: object,
      dining: object,
      budget: object,
      ai_settings: object
    }
  }
}
```

#### Function: `users-preferences-update`
```typescript
/**
 * PUT /users/preferences
 * Update user preferences
 */
{
  method: "PUT",
  route: "/users/preferences",
  auth: "required",
  
  input: {
    travel?: object,
    dining?: object,
    budget?: object,
    ai_settings?: object
  },
  
  output: {
    success: boolean
  }
}
```

#### Function: `users-onboarding-complete`
```typescript
/**
 * POST /users/onboarding/complete
 * Mark onboarding as complete and collect preferences
 */
{
  method: "POST",
  route: "/users/onboarding/complete",
  auth: "required",
  
  input: {
    full_name: string,
    preferences: object,
    interests: string[]
  },
  
  output: {
    success: boolean,
    profile: Profile
  }
}
```

---

## 🚀 ADVANCED AI FEATURES

### 7.1 Proactive Suggestions

#### Function: `suggestions-list`
```typescript
/**
 * GET /suggestions
 * Get active proactive suggestions
 */
{
  method: "GET",
  route: "/suggestions",
  auth: "required",
  
  queryParams: {
    trip_id?: string,
    status?: string,
    type?: string
  },
  
  output: {
    suggestions: Suggestion[]
  }
}
```

#### Function: `suggestions-respond`
```typescript
/**
 * POST /suggestions/:id/respond
 * Accept or reject suggestion
 */
{
  method: "POST",
  route: "/suggestions/:id/respond",
  auth: "required",
  
  input: {
    action: 'accept' | 'reject',
    feedback?: string
  },
  
  output: {
    success: boolean,
    applied_changes?: object // If accepted
  }
}
```

#### Function: `suggestions-generate`
```typescript
/**
 * POST /suggestions/generate
 * Manually trigger proactive suggestions
 */
{
  method: "POST",
  route: "/suggestions/generate",
  auth: "required",
  rateLimit: "20 requests/hour",
  
  input: {
    trip_id: string,
    context?: object
  },
  
  output: {
    suggestions: Suggestion[]
  }
}
```

---

### 7.2 Conflict Resolution

#### Function: `conflicts-detect`
```typescript
/**
 * POST /conflicts/detect
 * Manually trigger conflict detection
 */
{
  method: "POST",
  route: "/conflicts/detect",
  auth: "required",
  
  input: {
    trip_id: string
  },
  
  output: {
    conflicts: Conflict[]
  }
}
```

#### Function: `conflicts-resolve`
```typescript
/**
 * POST /conflicts/:id/resolve
 * Apply conflict resolution
 */
{
  method: "POST",
  route: "/conflicts/:id/resolve",
  auth: "required",
  
  input: {
    resolution: object, // Selected resolution option
    auto_apply: boolean
  },
  
  output: {
    success: boolean,
    updated_items: ItineraryItem[]
  }
}
```

---

### 7.3 Budget Tracking

#### Function: `budget-get`
```typescript
/**
 * GET /trips/:tripId/budget
 * Get budget tracking for trip
 */
{
  method: "GET",
  route: "/trips/:tripId/budget",
  auth: "required",
  cache: "30 seconds",
  
  output: {
    budget: BudgetTracking,
    breakdown: {
      by_category: object,
      by_day: object
    },
    alerts: object[]
  }
}
```

#### Function: `budget-update`
```typescript
/**
 * PUT /trips/:tripId/budget
 * Update budget settings
 */
{
  method: "PUT",
  route: "/trips/:tripId/budget",
  auth: "required",
  
  input: {
    total_budget?: number,
    categories?: object,
    alert_threshold?: number
  },
  
  output: {
    budget: BudgetTracking
  }
}
```

#### Function: `budget-optimize`
```typescript
/**
 * POST /trips/:tripId/budget/optimize
 * Get AI budget optimization suggestions
 */
{
  method: "POST",
  route: "/trips/:tripId/budget/optimize",
  auth: "required",
  rateLimit: "10 requests/hour",
  
  output: {
    current_spending: object,
    recommendations: Array<{
      type: string,
      description: string,
      potential_savings: number,
      trade_offs: string[]
    }>,
    alternative_options: object[]
  }
}
```

---

### 7.4 Collections & Saved Places

#### Function: `saved-places-list`
```typescript
/**
 * GET /saved-places
 * List user's saved places
 */
{
  method: "GET",
  route: "/saved-places",
  auth: "required",
  
  queryParams: {
    collection_id?: string,
    tags?: string[]
  },
  
  output: {
    saved_places: Array<SavedPlace & { location: Location }>
  }
}
```

#### Function: `saved-places-add`
```typescript
/**
 * POST /saved-places
 * Save a location
 */
{
  method: "POST",
  route: "/saved-places",
  auth: "required",
  
  input: {
    location_id: string,
    collection_id?: string,
    tags?: string[],
    notes?: string
  },
  
  output: {
    saved_place: SavedPlace
  }
}
```

#### Function: `collections-list`
```typescript
/**
 * GET /collections
 * List user's collections
 */
{
  method: "GET",
  route: "/collections",
  auth: "required",
  
  output: {
    collections: Collection[]
  }
}
```

#### Function: `collections-create`
```typescript
/**
 * POST /collections
 * Create new collection
 */
{
  method: "POST",
  route: "/collections",
  auth: "required",
  
  input: {
    name: string,
    description?: string,
    emoji?: string,
    is_public?: boolean
  },
  
  output: {
    collection: Collection
  }
}
```

---

## ⚙️ BACKGROUND JOBS

#### Function: `jobs-create`
```typescript
/**
 * POST /jobs
 * Create background job
 */
{
  method: "POST",
  route: "/jobs",
  auth: "required",
  
  input: {
    type: 'optimize_itinerary' | 'generate_suggestions' | 'import_data',
    data: object
  },
  
  output: {
    job: {
      id: string,
      status: 'pending',
      created_at: string
    }
  }
}
```

#### Function: `jobs-status`
```typescript
/**
 * GET /jobs/:id
 * Get job status
 */
{
  method: "GET",
  route: "/jobs/:id",
  auth: "required",
  
  output: {
    job: {
      id: string,
      type: string,
      status: 'pending' | 'running' | 'completed' | 'failed',
      progress?: number,
      result?: object,
      error?: string
    }
  }
}
```

#### Function: `jobs-process` (Internal - Cron trigger)
```typescript
/**
 * Background job processor
 * Triggered by Supabase Cron
 */
{
  trigger: "cron: */5 * * * *", // Every 5 minutes
  method: "POST",
  route: "/jobs/process",
  auth: "service_role",
  
  processing: {
    fetch_pending_jobs: true,
    execute_job: true,
    update_status: true,
    cleanup_old_jobs: true
  }
}
```

---

## 🔗 WEBHOOKS & INTEGRATIONS

#### Function: `webhooks-google-places`
```typescript
/**
 * POST /webhooks/google-places
 * Receive updates from Google Places API
 */
{
  method: "POST",
  route: "/webhooks/google-places",
  auth: "webhook_secret",
  
  input: {
    place_id: string,
    update_type: string,
    data: object
  }
}
```

#### Function: `webhooks-booking-confirmation`
```typescript
/**
 * POST /webhooks/booking
 * Receive booking confirmations from external services
 */
{
  method: "POST",
  route: "/webhooks/booking",
  auth: "webhook_secret",
  
  input: {
    booking_reference: string,
    status: string,
    details: object
  }
}
```

#### Function: `integrations-calendar-sync`
```typescript
/**
 * POST /integrations/calendar/sync
 * Sync trip to Google Calendar / iCal
 */
{
  method: "POST",
  route: "/integrations/calendar/sync",
  auth: "required",
  
  input: {
    trip_id: string,
    calendar_type: 'google' | 'apple' | 'outlook'
  },
  
  output: {
    success: boolean,
    events_created: number,
    calendar_url?: string
  }
}
```

---

## 🎯 BEST PRACTICES

### 1. Authentication Pattern

```typescript
// Standard auth middleware
async function authenticate(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    throw new Error("Missing authorization header");
  }
  
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );
  
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Unauthorized");
  }
  
  return { user, supabase };
}
```

### 2. Error Handling Pattern

```typescript
serve(async (req) => {
  try {
    // Business logic
    const result = await processRequest();
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error("Function error:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    const statusCode = error.message === "Unauthorized" ? 401 :
                       error.message === "Not found" ? 404 :
                       error.message === "Validation error" ? 400 : 500;
    
    return new Response(JSON.stringify({
      error: error.message,
      code: error.code || "INTERNAL_ERROR",
      timestamp: new Date().toISOString()
    }), {
      status: statusCode,
      headers: { "Content-Type": "application/json" }
    });
  }
});
```

### 3. Rate Limiting

```typescript
// Use Supabase Edge Runtime rate limiting
import { rateLimit } from "npm:@supabase/rate-limit@1.0.0";

const limiter = rateLimit({
  interval: "1h",
  uniqueTokenPerInterval: 500
});

serve(async (req) => {
  const { user } = await authenticate(req);
  
  try {
    await limiter.check(user.id, 100); // 100 requests per hour
  } catch {
    return new Response(JSON.stringify({
      error: "Rate limit exceeded"
    }), { status: 429 });
  }
  
  // Continue processing
});
```

### 4. Caching Strategy

```typescript
// Response caching headers
function withCache(seconds: number) {
  return {
    "Cache-Control": `public, max-age=${seconds}, s-maxage=${seconds}`,
    "CDN-Cache-Control": `public, max-age=${seconds}`
  };
}

// Usage
return new Response(JSON.stringify(data), {
  headers: {
    "Content-Type": "application/json",
    ...withCache(300) // 5 minutes
  }
});
```

### 5. Logging & Monitoring

```typescript
// Structured logging
function log(level: string, message: string, metadata?: object) {
  console.log(JSON.stringify({
    level,
    message,
    metadata,
    timestamp: new Date().toISOString()
  }));
}

// Usage
log("info", "AI chat request received", { userId, conversationId });
log("error", "Gemini API failed", { error: error.message, duration });
```

### 6. Input Validation

```typescript
import { z } from "npm:zod@3.22.0";

const TripCreateSchema = z.object({
  title: z.string().min(1).max(200),
  destination: z.string().min(1),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  budget_total: z.number().positive().optional()
});

// Usage
const body = await req.json();
const validated = TripCreateSchema.parse(body); // Throws if invalid
```

---

## 📊 FUNCTION SUMMARY

### Total Functions: 58

| Category | Count | Files |
|----------|-------|-------|
| **AI & Gemini** | 8 | ai-chat, ai-chat-stream, ai-agent-* (6), ai-classify-intent, ai-context-update |
| **Trip Management** | 12 | trips-*, itinerary-* |
| **Conversations** | 6 | conversations-*, messages-* |
| **Locations** | 8 | locations-* |
| **User Management** | 5 | users-* |
| **Advanced AI** | 10 | suggestions-*, conflicts-*, budget-* |
| **Saved Places** | 4 | saved-places-*, collections-* |
| **Background Jobs** | 3 | jobs-* |
| **Webhooks** | 2 | webhooks-* |

---

## 🗂️ FILE STRUCTURE

```
/supabase/functions/
├── ai-chat/
│   └── index.ts
├── ai-chat-stream/
│   └── index.ts
├── ai-agent-local-scout/
│   └── index.ts
├── ai-agent-dining/
│   └── index.ts
├── ai-agent-itinerary-optimizer/
│   └── index.ts
├── ai-agent-event-curator/
│   └── index.ts
├── ai-agent-budget-guardian/
│   └── index.ts
├── ai-agent-booking-assistant/
│   └── index.ts
├── ai-classify-intent/
│   └── index.ts
├── ai-context-update/
│   └── index.ts
├── trips-list/
│   └── index.ts
├── trips-create/
│   └── index.ts
├── trips-get/
│   └── index.ts
├── trips-update/
│   └── index.ts
├── trips-delete/
│   └── index.ts
├── itinerary-items-list/
│   └── index.ts
├── itinerary-items-create/
│   └── index.ts
├── itinerary-items-update/
│   └── index.ts
├── itinerary-items-reorder/
│   └── index.ts
├── itinerary-optimize/
│   └── index.ts
├── conversations-list/
│   └── index.ts
├── conversations-get/
│   └── index.ts
├── conversations-create/
│   └── index.ts
├── conversations-update/
│   └── index.ts
├── conversations-archive/
│   └── index.ts
├── messages-create/
│   └── index.ts
├── locations-search/
│   └── index.ts
├── locations-get/
│   └── index.ts
├── locations-create/
│   └── index.ts
├── locations-nearby/
│   └── index.ts
├── locations-import-google/
│   └── index.ts
├── users-profile-get/
│   └── index.ts
├── users-profile-update/
│   └── index.ts
├── users-preferences-get/
│   └── index.ts
├── users-preferences-update/
│   └── index.ts
├── users-onboarding-complete/
│   └── index.ts
├── suggestions-list/
│   └── index.ts
├── suggestions-respond/
│   └── index.ts
├── suggestions-generate/
│   └── index.ts
├── conflicts-detect/
│   └── index.ts
├── conflicts-resolve/
│   └── index.ts
├── budget-get/
│   └── index.ts
├── budget-update/
│   └── index.ts
├── budget-optimize/
│   └── index.ts
├── saved-places-list/
│   └── index.ts
├── saved-places-add/
│   └── index.ts
├── collections-list/
│   └── index.ts
├── collections-create/
│   └── index.ts
├── jobs-create/
│   └── index.ts
├── jobs-status/
│   └── index.ts
├── jobs-process/
│   └── index.ts
├── webhooks-google-places/
│   └── index.ts
├── webhooks-booking-confirmation/
│   └── index.ts
├── integrations-calendar-sync/
│   └── index.ts
└── _shared/
    ├── auth.ts          # Shared auth utilities
    ├── errors.ts        # Error handling
    ├── validation.ts    # Input validation schemas
    ├── gemini.ts        # Gemini client wrapper
    └── utils.ts         # Common utilities
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Phase 1: Core AI (Week 1-2)
- [ ] ai-chat
- [ ] ai-chat-stream
- [ ] ai-classify-intent
- [ ] ai-context-update
- [ ] trips-get (enhance with AI context)
- [ ] conversations-create
- [ ] messages-create

### Phase 2: Agent-Specific (Week 2-3)
- [ ] ai-agent-local-scout
- [ ] ai-agent-dining
- [ ] ai-agent-itinerary-optimizer
- [ ] ai-agent-event-curator
- [ ] ai-agent-budget-guardian
- [ ] ai-agent-booking-assistant

### Phase 3: Trip Management (Week 3-4)
- [ ] Complete all trips-* functions
- [ ] Complete all itinerary-items-* functions
- [ ] itinerary-optimize

### Phase 4: Advanced AI (Week 4-5)
- [ ] suggestions-* functions
- [ ] conflicts-* functions
- [ ] budget-* functions

### Phase 5: Polish & Integrations (Week 5-6)
- [ ] locations-* functions
- [ ] collections-* functions
- [ ] webhooks
- [ ] background jobs

---

**Document Status:** ✅ Complete & Production-Ready  
**Last Updated:** December 24, 2024  
**Total Functions:** 58  
**Next Step:** Begin Phase 1 implementation  
**Owner:** Backend Team
