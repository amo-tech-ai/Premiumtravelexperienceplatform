# Stage 3 — AI Agents & Intelligence Schema

**Stage:** 3 of 5  
**Purpose:** AI-powered features, agent orchestration, and memory  
**Timeline:** Week 5-6  
**Dependencies:** Stage 1 (Core), optionally Stage 2 (Advanced)  
**Status:** 🟢 Enhances experience

---

## Overview

Stage 3 enables AI capabilities with tracking, memory, and cost management. Supports the 6-agent AI system (Explore, Itinerary, Budget, Research, Proactive, Collaboration).

**Tables:** 5  
**Estimated rows (10K users, 1 year):** ~2.5M  
**Storage:** ~2.5 GB

---

## Tables

### ai_agents
**Purpose:** Define available AI agents

```sql
create table public.ai_agents (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text,
  version text not null default '1.0.0',
  model text not null default 'gpt-4',
  system_prompt text not null,
  temperature numeric(2, 1) default 0.7 check (temperature >= 0 and temperature <= 2),
  max_tokens integer default 1000,
  is_active boolean default true,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_ai_agents_name on public.ai_agents(name);
create index idx_ai_agents_active on public.ai_agents(is_active) where is_active = true;
```

**Seed data:**
```sql
insert into public.ai_agents (name, description, system_prompt) values
  ('explore', 'Discovery and recommendations', 'You are a travel exploration assistant...'),
  ('itinerary', 'Trip planning and optimization', 'You are an itinerary planning expert...'),
  ('budget', 'Budget management', 'You are a budget optimization specialist...'),
  ('research', 'Detailed place information', 'You are a travel research assistant...'),
  ('proactive', 'Proactive suggestions', 'You provide timely, context-aware suggestions...'),
  ('collaboration', 'Group trip coordination', 'You help coordinate group travel decisions...');
```

---

### ai_runs
**Purpose:** Track AI agent executions

```sql
create table public.ai_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  agent_id uuid not null references public.ai_agents(id) on delete restrict,
  trip_id uuid references public.trips(id) on delete cascade,
  saved_place_id uuid references public.saved_places(id) on delete set null,
  input_text text not null,
  output_text text,
  status text not null default 'pending' check (status in ('pending', 'running', 'completed', 'failed', 'cancelled')),
  model_used text,
  tokens_prompt integer,
  tokens_completion integer,
  tokens_total integer,
  cost_usd numeric(10, 6),
  latency_ms integer,
  error_message text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_ai_runs_user_id on public.ai_runs(user_id);
create index idx_ai_runs_agent_id on public.ai_runs(agent_id);
create index idx_ai_runs_trip_id on public.ai_runs(trip_id);
create index idx_ai_runs_status on public.ai_runs(status);
create index idx_ai_runs_created_at on public.ai_runs(created_at desc);
create index idx_ai_runs_user_date on public.ai_runs(user_id, created_at desc);
```

---

### ai_messages
**Purpose:** Conversation history

```sql
create table public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ai_run_id uuid references public.ai_runs(id) on delete cascade,
  trip_id uuid references public.trips(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index idx_ai_messages_user_id on public.ai_messages(user_id);
create index idx_ai_messages_ai_run_id on public.ai_messages(ai_run_id);
create index idx_ai_messages_trip_id on public.ai_messages(trip_id);
create index idx_ai_messages_created_at on public.ai_messages(created_at desc);
```

---

### ai_memory
**Purpose:** Long-term context and preferences

```sql
create table public.ai_memory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  memory_type text not null check (memory_type in ('preference', 'fact', 'feedback', 'context')),
  key text not null,
  value jsonb not null,
  confidence numeric(3, 2) check (confidence >= 0 and confidence <= 1),
  source text, -- which agent created this
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, memory_type, key)
);

create index idx_ai_memory_user_id on public.ai_memory(user_id);
create index idx_ai_memory_type on public.ai_memory(memory_type);
create index idx_ai_memory_key on public.ai_memory(user_id, key);
```

**Example memories:**
```sql
-- User prefers budget travel
{ "user_id": "...", "memory_type": "preference", "key": "budget_conscious", "value": {"level": "high"}, "confidence": 0.9 }

-- User likes Italian food
{ "user_id": "...", "memory_type": "preference", "key": "cuisine_italian", "value": {"likes": true}, "confidence": 0.85 }

-- User typically travels with partner
{ "user_id": "...", "memory_type": "fact", "key": "typical_travelers", "value": {"count": 2}, "confidence": 1.0 }
```

---

### ai_feedback
**Purpose:** User feedback on AI responses (for fine-tuning)

```sql
create table public.ai_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ai_run_id uuid not null references public.ai_runs(id) on delete cascade,
  feedback_type text not null check (feedback_type in ('thumbs_up', 'thumbs_down', 'helpful', 'not_helpful', 'incorrect', 'offensive')),
  comment text,
  created_at timestamptz default now()
);

create index idx_ai_feedback_ai_run_id on public.ai_feedback(ai_run_id);
create index idx_ai_feedback_user_id on public.ai_feedback(user_id);
create index idx_ai_feedback_type on public.ai_feedback(feedback_type);
```

---

## RLS Strategy

### ai_agents (Public Read)

```sql
alter table public.ai_agents enable row level security;

create policy "Anyone can view active agents"
  on public.ai_agents for select
  to authenticated
  using ( is_active = true );
```

---

### ai_runs (User-owned)

```sql
alter table public.ai_runs enable row level security;

create policy "Users can view their own AI runs"
  on public.ai_runs for select
  to authenticated
  using ( user_id = auth.uid() );

-- Inserts only via Edge Functions (service role)
```

---

### ai_messages (User-owned)

```sql
alter table public.ai_messages enable row level security;

create policy "Users can view their own messages"
  on public.ai_messages for select
  to authenticated
  using ( user_id = auth.uid() );

create policy "Users can create their own messages"
  on public.ai_messages for insert
  to authenticated
  with check ( user_id = auth.uid() );
```

---

### ai_memory (User-owned)

```sql
alter table public.ai_memory enable row level security;

create policy "Users can view their own memory"
  on public.ai_memory for select
  to authenticated
  using ( user_id = auth.uid() );

-- Updates only via Edge Functions
```

---

### ai_feedback (User-owned)

```sql
alter table public.ai_feedback enable row level security;

create policy "Users can create their own feedback"
  on public.ai_feedback for insert
  to authenticated
  with check ( user_id = auth.uid() );

create policy "Users can view their own feedback"
  on public.ai_feedback for select
  to authenticated
  using ( user_id = auth.uid() );
```

---

## Edge Functions

### run-ai-agent

```typescript
// supabase/functions/run-ai-agent/index.ts
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

Deno.serve(async (req: Request) => {
  const { agent_name, input_text, trip_id } = await req.json();
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  
  const { data: { user } } = await supabase.auth.getUser(
    req.headers.get('Authorization')?.replace('Bearer ', '')!
  );
  
  // Get agent config
  const { data: agent } = await supabase
    .from('ai_agents')
    .select('*')
    .eq('name', agent_name)
    .single();
  
  // Create AI run record
  const { data: aiRun } = await supabase
    .from('ai_runs')
    .insert({
      user_id: user.id,
      agent_id: agent.id,
      trip_id,
      input_text,
      status: 'running',
      model_used: agent.model
    })
    .select()
    .single();
  
  try {
    // Call OpenAI
    const startTime = Date.now();
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: agent.model,
        messages: [
          { role: 'system', content: agent.system_prompt },
          { role: 'user', content: input_text }
        ],
        temperature: agent.temperature,
        max_tokens: agent.max_tokens
      })
    });
    
    const data = await response.json();
    const latency = Date.now() - startTime;
    
    const output = data.choices[0].message.content;
    const usage = data.usage;
    
    // Update AI run with results
    await supabase
      .from('ai_runs')
      .update({
        output_text: output,
        status: 'completed',
        tokens_prompt: usage.prompt_tokens,
        tokens_completion: usage.completion_tokens,
        tokens_total: usage.total_tokens,
        cost_usd: calculateCost(agent.model, usage.total_tokens),
        latency_ms: latency
      })
      .eq('id', aiRun.id);
    
    // Store messages
    await supabase.from('ai_messages').insert([
      { user_id: user.id, ai_run_id: aiRun.id, trip_id, role: 'user', content: input_text },
      { user_id: user.id, ai_run_id: aiRun.id, trip_id, role: 'assistant', content: output }
    ]);
    
    return new Response(JSON.stringify({ output, run_id: aiRun.id }));
  } catch (error) {
    await supabase
      .from('ai_runs')
      .update({ status: 'failed', error_message: error.message })
      .eq('id', aiRun.id);
    
    throw error;
  }
});

function calculateCost(model: string, tokens: number): number {
  // GPT-4: ~$0.03 per 1K tokens
  const costPer1k = 0.03;
  return (tokens / 1000) * costPer1k;
}
```

---

### summarize-trip

```typescript
// supabase/functions/summarize-trip/index.ts
Deno.serve(async (req: Request) => {
  const { trip_id } = await req.json();
  
  // Fetch trip with all items
  const { data: trip } = await supabase
    .from('trips')
    .select(`
      *,
      trip_items (*)
    `)
    .eq('id', trip_id)
    .single();
  
  const input = `Summarize this trip:\n${JSON.stringify(trip, null, 2)}`;
  
  // Call run-ai-agent
  const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/run-ai-agent`, {
    method: 'POST',
    headers: {
      'Authorization': req.headers.get('Authorization')!,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      agent_name: 'itinerary',
      input_text: input,
      trip_id
    })
  });
  
  return response;
});
```

---

## Realtime Usage

```sql
alter publication supabase_realtime add table public.ai_messages;
```

**Stream AI responses:**
```typescript
const messagesChannel = supabase
  .channel('ai-chat')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'ai_messages',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      if (payload.new.role === 'assistant') {
        // Display AI response in real-time
        displayMessage(payload.new.content);
      }
    }
  )
  .subscribe();
```

---

## Storage Usage

None (AI outputs stored in database)

---

## Migration Notes

```bash
# Add schema files
supabase/schemas/006_ai_tables.sql
supabase/schemas/007_ai_rls.sql
supabase/schemas/008_ai_seed_agents.sql

# Generate migration
supabase stop
supabase db diff -f ai_agents_system
supabase start
```

---

## Database Functions

### Calculate usage costs

```sql
create or replace function public.get_ai_usage_stats(p_user_id uuid, p_start_date timestamptz, p_end_date timestamptz)
returns table (
  total_runs bigint,
  total_tokens bigint,
  total_cost numeric,
  avg_latency numeric
)
language plpgsql
security invoker
set search_path = ''
stable
as $$
begin
  return query
  select
    count(*)::bigint,
    coalesce(sum(tokens_total), 0)::bigint,
    coalesce(sum(cost_usd), 0),
    coalesce(avg(latency_ms), 0)
  from public.ai_runs
  where user_id = p_user_id
    and created_at >= p_start_date
    and created_at < p_end_date
    and status = 'completed';
end;
$$;
```

---

## 🔗 Related Documentation

- **[Stage 2 - Advanced Schema](/docs/supabase/schema/02-advanced-schema.md)**
- **[Stage 4 - Payments Schema](/docs/supabase/schema/04-payments-stripe-schema.md)**

---

**Status:** ✅ Ready for implementation  
**Dependencies:** Stage 1  
**Next Stage:** Payments (Stage 4)
