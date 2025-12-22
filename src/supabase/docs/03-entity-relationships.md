# Entity Relationship Diagrams

**Complete ERD for Local Scout AI Platform**

## Core Schema ERD

```mermaid
erDiagram
    auth_users ||--|| profiles : "has one"
    profiles ||--o{ user_preferences : "has one"
    profiles ||--o{ conversations : "creates many"
    profiles ||--o{ trips : "owns many"
    profiles ||--o{ saved_places : "saves many"
    profiles ||--o{ collections : "creates many"
    profiles ||--o{ reminders : "sets many"
    
    conversations ||--o{ messages : "contains many"
    conversations ||--o{ ai_runs : "generates many"
    
    messages ||--o{ ai_runs : "triggers"
    
    locations ||--o{ saved_places : "saved by users"
    locations ||--o{ itinerary_items : "referenced by"
    locations ||--o{ reminders : "reminds about"
    
    trips ||--o{ itinerary_items : "contains many"
    trips ||--o{ reminders : "has many"
    trips ||--o{ trip_collaborators : "has many"
    trips ||--o{ automation_jobs : "triggers jobs"
    
    itinerary_items ||--o{ reminders : "has reminders"
    
    profiles ||--o{ trip_collaborators : "collaborates on"
    
    auth_users {
        uuid id PK
        string email UK
        jsonb raw_user_meta_data
        timestamp created_at
    }
    
    profiles {
        uuid id PK, FK
        string email UK
        string full_name
        string avatar_url
        string default_city
        decimal default_latitude
        decimal default_longitude
        string timezone
        boolean is_premium
        timestamp created_at
        timestamp updated_at
    }
    
    user_preferences {
        uuid id PK
        uuid user_id FK
        text[] dietary_restrictions
        text[] favorite_cuisines
        text[] event_categories
        text[] travel_style
        string ai_proactivity_level
        decimal default_budget_per_day
        timestamp created_at
        timestamp updated_at
    }
    
    conversations {
        uuid id PK
        uuid user_id FK
        string title
        string context_type
        jsonb location_context
        jsonb trip_context
        integer message_count
        timestamp last_message_at
        timestamp created_at
    }
    
    messages {
        uuid id PK
        uuid conversation_id FK
        string role
        text content
        string display_format
        jsonb ui_data
        jsonb sources
        integer sequence_number
        timestamp created_at
    }
    
    ai_runs {
        uuid id PK
        uuid user_id FK
        uuid conversation_id FK
        uuid message_id FK
        string agent_type
        string model
        text prompt
        text response
        jsonb structured_output
        integer tokens_total
        integer latency_ms
        string status
        timestamp created_at
    }
    
    locations {
        uuid id PK
        string google_place_id UK
        string name
        string category
        text[] tags
        string city
        decimal latitude
        decimal longitude
        jsonb details
        text[] cuisine_types
        integer price_level
        decimal rating
        timestamp created_at
    }
    
    saved_places {
        uuid id PK
        uuid user_id FK
        uuid location_id FK
        string collection_name
        boolean is_favorite
        text notes
        timestamp reminder_date
        timestamp created_at
    }
    
    collections {
        uuid id PK
        uuid user_id FK
        string name
        text description
        boolean is_public
        integer place_count
        timestamp created_at
    }
    
    trips {
        uuid id PK
        uuid user_id FK
        uuid owner_id FK
        string title
        string destination
        date start_date
        date end_date
        string status
        decimal budget
        uuid[] collaborators
        timestamp created_at
    }
    
    itinerary_items {
        uuid id PK
        uuid trip_id FK
        uuid location_id FK
        string title
        string item_type
        integer day_number
        time start_time
        time end_time
        decimal estimated_cost
        string status
        integer sort_order
        timestamp created_at
    }
    
    reminders {
        uuid id PK
        uuid user_id FK
        uuid trip_id FK
        uuid itinerary_item_id FK
        uuid location_id FK
        string title
        string reminder_type
        timestamp remind_at
        string status
        timestamp created_at
    }
    
    trip_collaborators {
        uuid id PK
        uuid trip_id FK
        uuid user_id FK
        string role
        boolean can_edit
        string status
        timestamp invited_at
    }
```

## Advanced Schema ERD

```mermaid
erDiagram
    profiles ||--o{ automation_rules : "creates"
    profiles ||--o{ automation_jobs : "owns"
    profiles ||--o{ automation_logs : "generates"
    
    locations ||--o{ embeddings : "has embedding"
    messages ||--o{ embeddings : "has embedding"
    
    embeddings ||--o{ web_sources : "embedded from"
    
    automation_rules ||--o{ automation_jobs : "spawns"
    automation_rules ||--o{ automation_logs : "logs to"
    
    automation_jobs ||--o{ automation_logs : "generates logs"
    
    trips ||--o{ automation_jobs : "triggers"
    
    profiles {
        uuid id PK
        string email UK
        string full_name
    }
    
    automation_rules {
        uuid id PK
        uuid user_id FK
        string name
        string trigger_type
        jsonb trigger_config
        jsonb conditions
        jsonb actions
        string schedule_cron
        boolean is_active
        integer run_count
        timestamp last_run_at
        timestamp created_at
    }
    
    automation_jobs {
        uuid id PK
        uuid automation_rule_id FK
        uuid user_id FK
        uuid trip_id FK
        string job_type
        jsonb payload
        string status
        integer priority
        integer retry_count
        jsonb result
        timestamp scheduled_for
        timestamp created_at
    }
    
    automation_logs {
        uuid id PK
        uuid automation_rule_id FK
        uuid automation_job_id FK
        uuid user_id FK
        string level
        text message
        jsonb details
        timestamp created_at
    }
    
    embeddings {
        uuid id PK
        string entity_type
        uuid entity_id FK
        vector embedding
        text content
        string model
        jsonb metadata
        timestamp created_at
    }
    
    web_sources {
        uuid id PK
        string url
        string url_hash UK
        text content
        uuid embedding_id FK
        timestamp fetched_at
        timestamp expires_at
    }
    
    locations {
        uuid id PK
        string name
        string category
    }
    
    messages {
        uuid id PK
        text content
    }
    
    trips {
        uuid id PK
        string title
    }
```

## Complete System ERD (All Entities)

```mermaid
erDiagram
    %% Core User Flow
    auth_users ||--|| profiles : has
    profiles ||--|| user_preferences : configures
    
    %% Conversations & AI
    profiles ||--o{ conversations : initiates
    conversations ||--o{ messages : contains
    messages ||--o{ ai_runs : generates
    profiles ||--o{ ai_runs : requests
    
    %% Places & Locations
    locations ||--o{ saved_places : saved_by
    profiles ||--o{ saved_places : saves
    profiles ||--o{ collections : creates
    saved_places }o--|| collections : organized_in
    
    %% Trips & Itinerary
    profiles ||--o{ trips : creates
    trips ||--o{ itinerary_items : contains
    locations ||--o{ itinerary_items : included_in
    trips ||--o{ trip_collaborators : shared_with
    profiles ||--o{ trip_collaborators : collaborates
    
    %% Reminders
    profiles ||--o{ reminders : sets
    trips ||--o{ reminders : has
    itinerary_items ||--o{ reminders : triggers
    locations ||--o{ reminders : about
    
    %% Advanced: Embeddings
    locations ||--o{ embeddings : embedded_as
    messages ||--o{ embeddings : embedded_as
    embeddings ||--|| web_sources : sourced_from
    
    %% Advanced: Automations
    profiles ||--o{ automation_rules : defines
    automation_rules ||--o{ automation_jobs : creates
    trips ||--o{ automation_jobs : triggers
    automation_rules ||--o{ automation_logs : logs
    automation_jobs ||--o{ automation_logs : logs
```

## Data Flow Diagram: User Journey

```mermaid
flowchart TD
    Start([User Signs Up]) --> CreateProfile[Create Profile]
    CreateProfile --> SetPreferences[Set Preferences]
    SetPreferences --> StartConversation[Start AI Chat]
    
    StartConversation --> UserMessage[User Sends Message]
    UserMessage --> ClassifyIntent[Classify Intent]
    
    ClassifyIntent --> RouteAgent{Route to Agent}
    
    RouteAgent -->|Events| EventsAgent[Events Agent]
    RouteAgent -->|Restaurants| RestaurantsAgent[Restaurants Agent]
    RouteAgent -->|Rentals| RentalsAgent[Rentals Agent]
    RouteAgent -->|Maps| MapsAgent[Maps Agent]
    RouteAgent -->|General| ContextAgent[Context Agent]
    
    EventsAgent --> SearchAPI[Search External APIs]
    RestaurantsAgent --> SearchAPI
    RentalsAgent --> SearchAPI
    MapsAgent --> SearchAPI
    ContextAgent --> RAG[Semantic Search via pgvector]
    
    SearchAPI --> GenerateResponse[Generate AI Response]
    RAG --> GenerateResponse
    
    GenerateResponse --> SaveMessage[Save Message to DB]
    SaveMessage --> LogRun[Log AI Run]
    
    LogRun --> DisplayUI[Display UI Cards]
    
    DisplayUI --> UserAction{User Action}
    
    UserAction -->|Save Place| SaveToCollection[Add to Collection]
    UserAction -->|Add to Trip| AddToItinerary[Add to Itinerary]
    UserAction -->|Set Reminder| CreateReminder[Create Reminder]
    UserAction -->|Continue Chat| UserMessage
    
    SaveToCollection --> UpdateDB[(Update Database)]
    AddToItinerary --> UpdateDB
    CreateReminder --> UpdateDB
    
    UpdateDB --> TriggerAutomation{Automation Rule?}
    TriggerAutomation -->|Yes| QueueJob[Queue Background Job]
    TriggerAutomation -->|No| Done([End])
    
    QueueJob --> ProcessJob[Process Automation]
    ProcessJob --> Done
```

## Database Relationships Summary

### One-to-One Relationships
- `auth.users` → `profiles` (1:1)
- `profiles` → `user_preferences` (1:1)

### One-to-Many Relationships
- `profiles` → `conversations` (1:N)
- `profiles` → `trips` (1:N)
- `profiles` → `saved_places` (1:N)
- `conversations` → `messages` (1:N)
- `trips` → `itinerary_items` (1:N)
- `locations` → `saved_places` (1:N)

### Many-to-Many Relationships
- `trips` ↔ `profiles` (via `trip_collaborators`)
- `locations` ↔ `collections` (via `saved_places`)

### Polymorphic Relationships
- `reminders` → `trips`, `itinerary_items`, `locations` (polymorphic)
- `embeddings` → `locations`, `messages`, etc. (polymorphic via `entity_type`)

## Index Strategy by Table

### High-Traffic Tables (Optimized)

**messages**
- Primary: `id` (PK, automatic)
- Foreign: `conversation_id` (B-tree)
- Composite: `(conversation_id, sequence_number)` (B-tree)
- Time: `created_at DESC` (B-tree)

**locations**
- Primary: `id` (PK, automatic)
- Unique: `google_place_id` (B-tree)
- Category: `category` (B-tree)
- Geospatial: `(latitude, longitude)` (B-tree)
- Arrays: `tags`, `cuisine_types` (GIN)
- Rating: `rating DESC` (B-tree partial)

**itinerary_items**
- Primary: `id` (PK, automatic)
- Foreign: `trip_id`, `location_id` (B-tree)
- Composite: `(trip_id, day_number, sort_order)` (B-tree)
- Type: `item_type`, `status` (B-tree)

### Search-Optimized Tables

**embeddings**
- Vector: `embedding vector_cosine_ops` (HNSW)
- Entity: `(entity_type, entity_id)` (B-tree)
- Hash: `content_hash` (B-tree)

**search_cache**
- Hash: `query_hash` (B-tree, unique)
- Expiry: `expires_at` (B-tree partial)

## RLS Policy Patterns

### User-Owned Data Pattern
```sql
-- Pattern: Users can only access their own data
CREATE POLICY "policy_name"
  ON table_name
  FOR SELECT
  USING (auth.uid() = user_id);
```

**Applied to:**
- profiles
- user_preferences
- conversations
- saved_places
- collections
- trips (with owner_id)
- reminders

### Collaborative Data Pattern
```sql
-- Pattern: Users can access data they own OR are collaborators on
CREATE POLICY "policy_name"
  ON table_name
  FOR SELECT
  USING (
    auth.uid() = owner_id OR
    auth.uid() = ANY(collaborators)
  );
```

**Applied to:**
- trips
- itinerary_items

### Public Read Pattern
```sql
-- Pattern: Data is publicly readable but service-controlled
CREATE POLICY "public_read"
  ON table_name
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "service_write"
  ON table_name
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');
```

**Applied to:**
- locations
- search_cache
- web_sources

### Derived Access Pattern
```sql
-- Pattern: Access via foreign key relationship
CREATE POLICY "derived_access"
  ON child_table
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_table
      WHERE parent_table.id = child_table.parent_id
      AND parent_table.user_id = auth.uid()
    )
  );
```

**Applied to:**
- messages (via conversations)
- itinerary_items (via trips)
- trip_collaborators (via trips)

## Trigger Functions

### Auto-Create Triggers
1. **`handle_new_user()`** - Creates profile when user signs up
2. **`auto_create_booking_reminder()`** - Creates reminder for bookings

### Update Triggers
3. **`update_updated_at_column()`** - Updates `updated_at` timestamp
4. **`update_conversation_on_message()`** - Updates conversation metadata
5. **`increment_automation_run_count()`** - Tracks automation executions

### Cache Triggers
6. **`update_search_cache_access()`** - Tracks cache hits
7. **`update_ai_run_completion()`** - Sets completion timestamp

## Constraints Summary

### Check Constraints
- **Date ranges**: `end_date >= start_date`
- **Ratings**: `rating >= 1 AND rating <= 5`
- **Enums**: Status fields with IN clauses
- **Ranges**: Temperature, priority, price levels

### Unique Constraints
- **Natural keys**: `google_place_id`, `url_hash`
- **User uniqueness**: `(user_id, location_id)`, `(user_id, name)`
- **Sequence**: `(conversation_id, sequence_number)`

### Foreign Key Constraints
- **ON DELETE CASCADE**: User-owned data
- **ON DELETE SET NULL**: Optional references
- **ON DELETE RESTRICT**: Protected references (none currently)

---

**Next:** See `/supabase/docs/04-data-flows.md` for detailed data flow diagrams
