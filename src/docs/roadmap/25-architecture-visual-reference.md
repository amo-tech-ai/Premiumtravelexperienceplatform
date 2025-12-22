# 🗺️ System Architecture Visual Reference

**Companion to:** `/docs/roadmap/23-frontend-backend-wiring-analysis.md`

---

## System Overview Diagram

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React UI Components]
        Hooks[React Hooks<br/>useTrips, useEvents, etc.]
        APIClient[API Client Layer]
    end
    
    subgraph "API Gateway"
        EdgeFunc[Supabase Edge Function<br/>/make-server-fd8c4bf7]
    end
    
    subgraph "Business Logic"
        DB_Service[Database Setup Service]
        Locations_Service[KV Locations Service]
        AI_Service[AI Service]
        Job_Service[Job Queue Service]
    end
    
    subgraph "Data Layer - Current"
        KV[KV Store<br/>kv_store_fd8c4bf7<br/>✅ ACTIVE]
    end
    
    subgraph "Data Layer - Target"
        SQL_Core[(Postgres Tables<br/>trips, locations, saved_places<br/>❌ NOT CREATED)]
        SQL_AI[(AI Tables<br/>conversations, messages, ai_runs<br/>❌ NOT CREATED)]
        SQL_Embed[(Embeddings<br/>pgvector<br/>❌ NOT CREATED)]
        SQL_Auto[(Automations<br/>jobs, rules, logs<br/>❌ NOT CREATED)]
    end
    
    subgraph "External Services"
        Gemini[Google Gemini AI<br/>❌ NOT CONNECTED]
        Maps[Google Maps API<br/>❌ NOT SET]
    end
    
    UI --> Hooks
    Hooks --> APIClient
    APIClient -->|HTTP/JSON| EdgeFunc
    
    EdgeFunc --> DB_Service
    EdgeFunc --> Locations_Service
    EdgeFunc --> AI_Service
    EdgeFunc --> Job_Service
    
    DB_Service -->|Currently uses| KV
    Locations_Service -->|Currently uses| KV
    AI_Service -->|Should use| SQL_AI
    Job_Service -->|Should use| SQL_Auto
    
    DB_Service -.->|Target| SQL_Core
    Locations_Service -.->|Target| SQL_Core
    
    AI_Service -.->|Should call| Gemini
    AI_Service -.->|Should query| SQL_Embed
    
    style KV fill:#9f9,stroke:#090,stroke-width:2px
    style SQL_Core fill:#f99,stroke:#900,stroke-width:2px,stroke-dasharray: 5 5
    style SQL_AI fill:#f99,stroke:#900,stroke-width:2px,stroke-dasharray: 5 5
    style SQL_Embed fill:#f99,stroke:#900,stroke-width:2px,stroke-dasharray: 5 5
    style SQL_Auto fill:#f99,stroke:#900,stroke-width:2px,stroke-dasharray: 5 5
    style Gemini fill:#f99,stroke:#900,stroke-width:2px,stroke-dasharray: 5 5
    style Maps fill:#ff9,stroke:#990,stroke-width:2px,stroke-dasharray: 5 5
```

---

## Database Schema Relationships

```mermaid
erDiagram
    PROFILES ||--o{ TRIPS : owns
    PROFILES ||--o{ SAVED_PLACES : saves
    PROFILES ||--o{ CONVERSATIONS : has
    PROFILES ||--o{ AUTOMATION_RULES : creates
    
    TRIPS ||--o{ ITINERARY_ITEMS : contains
    TRIPS ||--o{ REMINDERS : has
    TRIPS ||--o{ TRIP_COLLABORATORS : shares
    
    LOCATIONS ||--o{ SAVED_PLACES : references
    LOCATIONS ||--o{ ITINERARY_ITEMS : references
    LOCATIONS ||--o{ EMBEDDINGS : has
    
    CONVERSATIONS ||--o{ MESSAGES : contains
    MESSAGES ||--o{ EMBEDDINGS : generates
    
    AUTOMATION_RULES ||--o{ AUTOMATION_JOBS : creates
    AUTOMATION_JOBS ||--o{ AUTOMATION_LOGS : logs
    
    PROFILES {
        uuid id PK
        text email
        text full_name
        boolean is_premium
        timestamp created_at
    }
    
    TRIPS {
        uuid id PK
        uuid user_id FK
        text title
        date start_date
        date end_date
        text status
    }
    
    ITINERARY_ITEMS {
        uuid id PK
        uuid trip_id FK
        uuid location_id FK
        int day_number
        time start_time
        text status
    }
    
    LOCATIONS {
        uuid id PK
        text category
        text name
        decimal latitude
        decimal longitude
        text source
    }
    
    CONVERSATIONS {
        uuid id PK
        uuid user_id FK
        text context_type
        timestamp last_message_at
    }
    
    MESSAGES {
        uuid id PK
        uuid conversation_id FK
        text role
        text content
        jsonb ui_data
    }
    
    EMBEDDINGS {
        uuid id PK
        text entity_type
        uuid entity_id
        vector_1536 embedding
        text model
    }
```

**Legend:**
- ✅ **Green**: Currently implemented (KV store)
- ❌ **Red dashed**: Schema defined, not created
- 🔵 **Solid lines**: Foreign key relationships

---

## Request Flow Diagrams

### Trip Creation Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Frontend UI
    participant Hook as useCreateTrip Hook
    participant API as Edge Function
    participant Service as Database Service
    participant KV as KV Store
    participant SQL as SQL Tables ❌
    
    User->>UI: Clicks "Create Trip"
    UI->>Hook: createTrip({title, destination, ...})
    Hook->>API: POST /trips<br/>Bearer: demo-user
    
    API->>API: getUserId() → "demo-user"
    API->>Service: createTrip(userId, data)
    
    Service->>KV: SET trips:demo-user:{id}
    KV-->>Service: Success
    
    Service-.->SQL: Would INSERT INTO trips
    Note over SQL: ❌ Table doesn't exist
    
    Service-->>API: Return Trip object
    API-->>Hook: {success: true, data: Trip}
    Hook-->>UI: Update state
    UI->>User: Show success toast
    
    Note over UI,User: Trip appears in list
```

### AI Chat Flow (Current)

```mermaid
sequenceDiagram
    actor User
    participant UI as ChatInterface
    participant Hook as useAIChat
    participant API as POST /ai/chat
    participant AIService as AI Service
    participant Gemini as Gemini API ❌
    participant DB as Database ❌
    
    User->>UI: Types "Find restaurants"
    UI->>Hook: sendMessage({message, history})
    Hook->>API: POST with message
    
    API->>AIService: processMessage()
    AIService->>AIService: Check API key
    
    alt No API Key
        AIService->>AIService: Use mock/fallback
        AIService-->>API: Mock response
    else Has API Key
        AIService-.->Gemini: Call Gemini
        Gemini-.->AIService: AI response
    end
    
    AIService-.->DB: Would save conversation
    Note over DB: ❌ Tables don't exist
    
    AIService-->>API: Return response
    API-->>Hook: {message, agent, suggestions}
    Hook-->>UI: Display message
    UI->>User: Show AI response
    
    Note over UI: History lost on refresh
```

### Reminder Automation Flow (Target)

```mermaid
sequenceDiagram
    participant User
    participant API as Edge Function
    participant DB as Postgres
    participant Trigger as Database Trigger
    participant Worker as Cron Worker ❌
    participant Notify as Notification Service ❌
    
    User->>API: POST /trips/:id/items<br/>{booking_status: "needed"}
    API->>DB: INSERT INTO itinerary_items
    
    DB->>Trigger: After Insert Trigger
    Trigger->>Trigger: Check booking_status
    
    alt Booking Needed
        Trigger->>DB: INSERT INTO reminders<br/>remind_at = 3 days before
    end
    
    DB-->>API: Item created
    API-->>User: Success
    
    Note over Worker: Every 5 minutes
    Worker-.->DB: SELECT pending reminders
    DB-.->Worker: Return due reminders
    
    loop For each reminder
        Worker-.->Notify: Send email/push
        Worker-.->DB: UPDATE status = 'sent'
    end
    
    Notify-.->User: 📬 Reminder notification
    
    Note over Worker,Notify: ❌ Not implemented yet
```

---

## Data Storage: Current vs Target

### Current State (KV Store)

```
kv_store_fd8c4bf7
├── trips:demo-user:trip-1        → {id, title, destination, ...}
├── trips:demo-user:trip-2        → {id, title, destination, ...}
├── trip_items:trip-1:item-1      → {id, title, day, type, ...}
├── trip_items:trip-1:item-2      → {id, title, day, type, ...}
├── saved:demo-user:place-1       → {id, title, location, ...}
├── user_prefs:demo-user          → {travel_style, interests, ...}
├── location:event:{id}           → {name, description, date, ...}
├── location:restaurant:{id}      → {name, cuisine, rating, ...}
├── location:rental:{id}          → {name, type, price, ...}
├── location:index:event          → [id1, id2, id3]
├── location:index:restaurant     → [id1, id2, id3]
└── location:index:rental         → [id1, id2, id3]
```

**Pros:**
- ✅ Works immediately
- ✅ No migration needed
- ✅ Simple key-value access

**Cons:**
- ❌ No relationships
- ❌ No indexes
- ❌ No RLS (security risk)
- ❌ No transactions
- ❌ Difficult to query

### Target State (SQL Tables)

```
Postgres Database
├── Core Tables
│   ├── profiles (users)
│   ├── trips
│   ├── itinerary_items
│   ├── saved_places
│   ├── collections
│   └── locations
├── AI Tables
│   ├── conversations
│   ├── messages
│   └── ai_runs
├── Advanced Tables
│   ├── embeddings (pgvector)
│   ├── web_sources
│   ├── automation_rules
│   ├── automation_jobs
│   └── automation_logs
└── Auxiliary
    ├── reminders
    └── trip_collaborators
```

**Pros:**
- ✅ RLS security
- ✅ Foreign keys
- ✅ Indexes for performance
- ✅ ACID transactions
- ✅ Complex queries
- ✅ Vector search (embeddings)

**Cons:**
- ⚠️ Requires migration
- ⚠️ More complex queries

---

## Authentication Flow

### Current (Demo Mode)

```mermaid
flowchart LR
    A[User Request] --> B{Has Token?}
    B -->|No| C[Use demo-user]
    B -->|Yes| D[Use token as userId]
    C --> E[Access all data<br/>❌ No security]
    D --> E
    E --> F[Return data]
```

### Target (Supabase Auth)

```mermaid
flowchart LR
    A[User Request] --> B{Has JWT?}
    B -->|No| C[Return 401 Unauthorized]
    B -->|Yes| D[Verify JWT signature]
    D --> E{Valid?}
    E -->|No| F[Return 403 Forbidden]
    E -->|Yes| G[Extract user_id from JWT]
    G --> H[Query with RLS<br/>✅ User sees only their data]
    H --> I[Return filtered data]
```

---

## AI Agent Architecture

```mermaid
graph TB
    subgraph "Frontend"
        Input[User Input]
    end
    
    subgraph "Edge Function"
        Router[Route Handler]
        AIService[AI Service]
    end
    
    subgraph "AI Processing"
        ContextBuilder[Context Builder]
        ModelSelector[Model Selector]
        ToolManager[Tool Manager]
        ResponseGen[Response Generator]
    end
    
    subgraph "Tools ❌ Not Implemented"
        SearchTool[Google Search]
        MapsTool[Google Maps/Places]
        URLTool[URL Fetcher]
        VectorTool[Vector Search]
    end
    
    subgraph "Data Sources"
        UserPrefs[(User Preferences<br/>❌ Not queried)]
        ConvHistory[(Conversation History<br/>❌ Not persisted)]
        Embeddings[(Vector Embeddings<br/>❌ Not created)]
        Locations[(Locations<br/>✅ KV Store)]
    end
    
    subgraph "External AI"
        Gemini[Google Gemini<br/>❌ Not connected]
    end
    
    Input --> Router
    Router --> AIService
    AIService --> ContextBuilder
    
    ContextBuilder -.->|Should query| UserPrefs
    ContextBuilder -.->|Should query| ConvHistory
    ContextBuilder --> Locations
    
    AIService --> ModelSelector
    ModelSelector -->|Select| Gemini
    
    AIService --> ToolManager
    ToolManager -.-> SearchTool
    ToolManager -.-> MapsTool
    ToolManager -.-> URLTool
    ToolManager -.-> VectorTool
    
    VectorTool -.-> Embeddings
    
    Gemini -.-> ResponseGen
    ResponseGen --> Input
    
    ResponseGen -.->|Should save| ConvHistory
    
    style UserPrefs fill:#f99,stroke:#900,stroke-dasharray: 5 5
    style ConvHistory fill:#f99,stroke:#900,stroke-dasharray: 5 5
    style Embeddings fill:#f99,stroke:#900,stroke-dasharray: 5 5
    style Gemini fill:#f99,stroke:#900,stroke-dasharray: 5 5
    style SearchTool fill:#f99,stroke:#900,stroke-dasharray: 5 5
    style MapsTool fill:#f99,stroke:#900,stroke-dasharray: 5 5
    style URLTool fill:#f99,stroke:#900,stroke-dasharray: 5 5
    style VectorTool fill:#f99,stroke:#900,stroke-dasharray: 5 5
    style Locations fill:#9f9,stroke:#090,stroke-width:2px
```

---

## Automation Job Queue

```mermaid
stateDiagram-v2
    direction LR
    
    [*] --> Created: User creates automation rule
    Created --> Scheduled: Cron evaluates schedule
    Scheduled --> Pending: Time matches schedule
    Pending --> Queued: Worker picks up job
    Queued --> Running: Worker starts execution
    
    Running --> Success: Job completes
    Running --> Failed: Error occurs
    Running --> Timeout: Exceeds time limit
    
    Failed --> Retry: retry_count < max_retries
    Retry --> Pending: Exponential backoff
    
    Failed --> Dead: Max retries exceeded
    Success --> [*]: Logs saved
    Dead --> [*]: Error logged
    Timeout --> Failed
    
    note right of Created
        automation_rules table
        ❌ Doesn't exist
    end note
    
    note right of Pending
        automation_jobs table
        status = 'pending'
        ❌ Doesn't exist
    end note
    
    note right of Running
        Edge Function or
        background worker
        ❌ Not implemented
    end note
```

---

## Performance: Current vs Target

### Query Performance Comparison

| Operation | Current (KV) | Target (SQL) | Improvement |
|-----------|--------------|--------------|-------------|
| Get user trips | O(n) scan | O(log n) index | 10-100x faster |
| Search locations | O(n) filter | O(log n) index | 10-100x faster |
| Get trip items | O(1) key lookup | O(log n) index | Similar |
| Semantic search | ❌ Not possible | O(log n) vector | New capability |
| Complex joins | ❌ Not possible | O(n*log n) | New capability |

### Scalability

```
Current System (KV):
├── 100 users → Works fine
├── 1,000 users → Slower, manageable
├── 10,000 users → Very slow
└── 100,000 users → ❌ Not feasible

Target System (SQL + Indexes + RLS):
├── 100 users → Very fast
├── 1,000 users → Fast
├── 10,000 users → Good
├── 100,000 users → Manageable
└── 1,000,000 users → ✅ Scales with optimization
```

---

## Security Model

### RLS Policy Example

```sql
-- trips table policy
CREATE POLICY "Users can view own trips"
ON trips FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = owner_id OR auth.uid() = ANY(collaborators));

-- This policy automatically filters queries:
SELECT * FROM trips;  -- User A sees only their trips
                      -- User B sees different set
                      -- Admin sees nothing (not in policy)
```

### Security Layers

```mermaid
graph TD
    Request[HTTP Request] --> TLS{HTTPS?}
    TLS -->|No| Reject1[❌ Reject]
    TLS -->|Yes| CORS{Valid Origin?}
    CORS -->|No| Reject2[❌ Reject]
    CORS -->|Yes| JWT{Valid JWT?}
    JWT -->|No| Reject3[❌ 401 Unauthorized]
    JWT -->|Yes| RLS{RLS Check}
    RLS -->|Denied| Reject4[❌ 403 Forbidden]
    RLS -->|Allowed| Data[✅ Return Filtered Data]
    
    style Reject1 fill:#f99
    style Reject2 fill:#f99
    style Reject3 fill:#f99
    style Reject4 fill:#f99
    style Data fill:#9f9
```

---

## Migration Strategy

### Option A: Gradual (Recommended)

```mermaid
gantt
    title Gradual Migration Timeline
    dateFormat YYYY-MM-DD
    section Phase 1
    Run SQL migrations           :done, 2024-12-23, 1d
    Verify tables created        :done, 2024-12-23, 0.5d
    section Phase 2
    Migrate user data            :active, 2024-12-24, 1d
    Test dual-write to SQL+KV    :active, 2024-12-24, 1d
    section Phase 3
    Switch reads to SQL          :2024-12-25, 1d
    Monitor performance          :2024-12-25, 2d
    section Phase 4
    Deprecate KV for user data   :2024-12-26, 1d
    Keep KV for locations        :2024-12-26, 1d
```

### Option B: Big Bang (Risky)

```mermaid
gantt
    title Big Bang Migration
    dateFormat YYYY-MM-DD
    section Preparation
    Run all SQL migrations       :crit, 2024-12-23, 1d
    Backup KV data              :crit, 2024-12-23, 0.5d
    section Migration
    Migrate all data            :crit, 2024-12-24, 1d
    Update all services         :crit, 2024-12-24, 1d
    section Testing
    Full system test            :crit, 2024-12-25, 1d
    Rollback if needed          :crit, 2024-12-25, 0.5d
```

**Recommendation:** Use Option A (Gradual) to minimize risk

---

## Monitoring Dashboard (Target)

```
┌─────────────────────────────────────────────────────────────┐
│ Local Scout - System Health Dashboard                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Database Status:                  API Performance:         │
│ • Connections: 15/100 ✅          • Avg response: 45ms ✅  │
│ • Query time: 12ms ✅             • P95 response: 89ms ✅  │
│ • Table size: 2.3GB ✅            • Error rate: 0.02% ✅   │
│                                                             │
│ AI Service:                       Automations:             │
│ • Conversations: 1,234 ✅         • Pending jobs: 5 ✅     │
│ • Messages today: 5,678 ✅        • Success rate: 98% ✅   │
│ • Avg latency: 1.8s ✅            • Failed jobs: 3 ⚠️      │
│ • Cost today: $12.34 ✅                                     │
│                                                             │
│ Embeddings:                       Users:                   │
│ • Total vectors: 45,678 ✅        • Active: 234 ✅         │
│ • Search latency: 23ms ✅         • Signups today: 12 ✅   │
│ • Cache hit rate: 87% ✅          • Premium: 45 ✅         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Status:** ❌ Not implemented - no monitoring in place

---

## Next Steps Checklist

### Week 1: Foundation
- [ ] Day 1: Run SQL migrations
- [ ] Day 2: Update backend services
- [ ] Day 3: Add AI persistence
- [ ] Day 4: Implement auth
- [ ] Day 5: Testing

### Week 2: Optimization
- [ ] Day 1: Add embeddings
- [ ] Day 2: Set up automations
- [ ] Day 3: Performance tuning
- [ ] Day 4: Monitoring setup
- [ ] Day 5: Production deploy

### Week 3: Polish
- [ ] Day 1: Load testing
- [ ] Day 2: Security audit
- [ ] Day 3: Documentation
- [ ] Day 4: User training
- [ ] Day 5: Launch prep

---

**Reference Documents:**
- Full Analysis: `/docs/roadmap/23-frontend-backend-wiring-analysis.md`
- Quick Summary: `/docs/roadmap/24-wiring-executive-summary.md`
- SQL Schemas: `/supabase/schemas/*.sql`
