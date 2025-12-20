# Stage 5 — WhatsApp & Automations Schema

**Stage:** 5 of 5  
**Purpose:** Messaging, notifications, and workflow automation  
**Timeline:** Week 9-10  
**Dependencies:** Stage 1 (Core), optionally Stage 3 (AI for smart messages)  
**Status:** 🟢 Advanced engagement

---

## Overview

Stage 5 enables WhatsApp integration for trip updates, reminders, and automated notifications.

**Tables:** 6  
**Estimated rows (10K users, 1 year):** ~1M  
**Storage:** ~500 MB

---

## Tables

### whatsapp_accounts

```sql
create table public.whatsapp_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  phone_number text unique not null,
  country_code text not null,
  is_verified boolean default false,
  verification_code text,
  verification_expires_at timestamptz,
  opt_in_status text not null default 'pending' check (opt_in_status in ('pending', 'opted_in', 'opted_out')),
  opted_in_at timestamptz,
  opted_out_at timestamptz,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_whatsapp_accounts_user_id on public.whatsapp_accounts(user_id);
create index idx_whatsapp_accounts_phone on public.whatsapp_accounts(phone_number);
```

---

### whatsapp_messages

```sql
create table public.whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  whatsapp_account_id uuid not null references public.whatsapp_accounts(id) on delete cascade,
  trip_id uuid references public.trips(id) on delete cascade,
  direction text not null check (direction in ('outbound', 'inbound')),
  message_type text not null check (message_type in ('text', 'image', 'location', 'template')),
  content text not null,
  media_url text,
  external_id text unique, -- WhatsApp API message ID
  status text not null default 'pending' check (status in ('pending', 'sent', 'delivered', 'read', 'failed')),
  delivered_at timestamptz,
  read_at timestamptz,
  failed_reason text,
  retry_count integer default 0,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_whatsapp_messages_user_id on public.whatsapp_messages(user_id);
create index idx_whatsapp_messages_account_id on public.whatsapp_messages(whatsapp_account_id);
create index idx_whatsapp_messages_trip_id on public.whatsapp_messages(trip_id);
create index idx_whatsapp_messages_status on public.whatsapp_messages(status);
create index idx_whatsapp_messages_created_at on public.whatsapp_messages(created_at desc);
```

---

### notification_preferences

```sql
create table public.notification_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  trip_reminders boolean default true,
  booking_confirmations boolean default true,
  itinerary_updates boolean default true,
  budget_alerts boolean default true,
  ai_suggestions boolean default true,
  collaborator_updates boolean default true,
  marketing boolean default false,
  quiet_hours_enabled boolean default false,
  quiet_hours_start time,
  quiet_hours_end time,
  timezone text default 'UTC',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_notification_preferences_user_id on public.notification_preferences(user_id);
```

---

### automation_rules

```sql
create table public.automation_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  trigger_type text not null check (trigger_type in ('trip_start', 'trip_end', 'booking_pending', 'budget_exceeded', 'schedule')),
  trigger_config jsonb not null,
  action_type text not null check (action_type in ('send_whatsapp', 'send_email', 'run_ai_agent', 'update_trip')),
  action_config jsonb not null,
  is_active boolean default true,
  last_triggered_at timestamptz,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_automation_rules_user_id on public.automation_rules(user_id);
create index idx_automation_rules_active on public.automation_rules(is_active) where is_active = true;
```

**Example rules:**
```sql
-- Send reminder 1 day before trip
{
  "trigger_type": "trip_start",
  "trigger_config": {"days_before": 1},
  "action_type": "send_whatsapp",
  "action_config": {"template": "trip_reminder"}
}

-- Alert when budget exceeded
{
  "trigger_type": "budget_exceeded",
  "trigger_config": {"threshold_percent": 90},
  "action_type": "send_whatsapp",
  "action_config": {"template": "budget_alert"}
}
```

---

### scheduled_jobs

```sql
create table public.scheduled_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  automation_rule_id uuid references public.automation_rules(id) on delete cascade,
  trip_id uuid references public.trips(id) on delete cascade,
  job_type text not null,
  scheduled_for timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'running', 'completed', 'failed', 'cancelled')),
  result jsonb,
  error_message text,
  executed_at timestamptz,
  created_at timestamptz default now()
);

create index idx_scheduled_jobs_user_id on public.scheduled_jobs(user_id);
create index idx_scheduled_jobs_scheduled_for on public.scheduled_jobs(scheduled_for);
create index idx_scheduled_jobs_status on public.scheduled_jobs(status);
```

---

### delivery_logs

```sql
create table public.delivery_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  whatsapp_message_id uuid references public.whatsapp_messages(id) on delete set null,
  channel text not null check (channel in ('whatsapp', 'email', 'push', 'sms')),
  recipient text not null,
  status text not null check (status in ('sent', 'delivered', 'failed', 'bounced')),
  provider_response jsonb,
  error_message text,
  delivered_at timestamptz,
  created_at timestamptz default now()
);

create index idx_delivery_logs_user_id on public.delivery_logs(user_id);
create index idx_delivery_logs_whatsapp_message_id on public.delivery_logs(whatsapp_message_id);
create index idx_delivery_logs_status on public.delivery_logs(status);
```

---

## RLS Strategy

### whatsapp_accounts

```sql
alter table public.whatsapp_accounts enable row level security;

create policy "Users can view their own WhatsApp account"
  on public.whatsapp_accounts for select
  to authenticated
  using ( user_id = auth.uid() );

create policy "Users can update their own WhatsApp account"
  on public.whatsapp_accounts for update
  to authenticated
  using ( user_id = auth.uid() )
  with check ( user_id = auth.uid() );
```

### whatsapp_messages

```sql
alter table public.whatsapp_messages enable row level security;

create policy "Users can view their own messages"
  on public.whatsapp_messages for select
  to authenticated
  using ( user_id = auth.uid() );
```

### notification_preferences

```sql
alter table public.notification_preferences enable row level security;

create policy "Users can view their own preferences"
  on public.notification_preferences for select
  to authenticated
  using ( user_id = auth.uid() );

create policy "Users can update their own preferences"
  on public.notification_preferences for update
  to authenticated
  using ( user_id = auth.uid() )
  with check ( user_id = auth.uid() );
```

### automation_rules

```sql
alter table public.automation_rules enable row level security;

create policy "Users can manage their own automation rules"
  on public.automation_rules for all
  to authenticated
  using ( user_id = auth.uid() )
  with check ( user_id = auth.uid() );
```

---

## Edge Functions

### send-whatsapp-message

```typescript
// supabase/functions/send-whatsapp-message/index.ts
Deno.serve(async (req: Request) => {
  const { user_id, trip_id, message } = await req.json();
  
  // Get user's WhatsApp account
  const { data: account } = await supabase
    .from('whatsapp_accounts')
    .select('*')
    .eq('user_id', user_id)
    .eq('opt_in_status', 'opted_in')
    .single();
  
  if (!account) {
    return new Response(JSON.stringify({ error: 'No WhatsApp account or not opted in' }), { status: 400 });
  }
  
  // Create message record
  const { data: msgRecord } = await supabase
    .from('whatsapp_messages')
    .insert({
      user_id,
      whatsapp_account_id: account.id,
      trip_id,
      direction: 'outbound',
      message_type: 'text',
      content: message,
      status: 'pending'
    })
    .select()
    .single();
  
  try {
    // Send via WhatsApp Business API
    const response = await fetch(`https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('WHATSAPP_ACCESS_TOKEN')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: account.phone_number,
        type: 'text',
        text: { body: message }
      })
    });
    
    const result = await response.json();
    
    // Update message status
    await supabase
      .from('whatsapp_messages')
      .update({
        external_id: result.messages[0].id,
        status: 'sent'
      })
      .eq('id', msgRecord.id);
    
    // Log delivery
    await supabase.from('delivery_logs').insert({
      user_id,
      whatsapp_message_id: msgRecord.id,
      channel: 'whatsapp',
      recipient: account.phone_number,
      status: 'sent',
      provider_response: result
    });
    
    return new Response(JSON.stringify({ success: true, message_id: msgRecord.id }));
  } catch (error) {
    await supabase
      .from('whatsapp_messages')
      .update({
        status: 'failed',
        failed_reason: error.message
      })
      .eq('id', msgRecord.id);
    
    throw error;
  }
});
```

---

### trigger-automation

```typescript
// supabase/functions/trigger-automation/index.ts
// Runs on schedule to check automation rules

Deno.serve(async (req: Request) => {
  // Get active automation rules
  const { data: rules } = await supabase
    .from('automation_rules')
    .select('*')
    .eq('is_active', true);
  
  for (const rule of rules) {
    // Check if trigger conditions are met
    if (shouldTrigger(rule)) {
      // Execute action
      if (rule.action_type === 'send_whatsapp') {
        await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-whatsapp-message`, {
          method: 'POST',
          body: JSON.stringify({
            user_id: rule.user_id,
            message: rule.action_config.template
          })
        });
      }
      
      // Update last triggered
      await supabase
        .from('automation_rules')
        .update({ last_triggered_at: new Date() })
        .eq('id', rule.id);
    }
  }
  
  return new Response(JSON.stringify({ processed: rules.length }));
});

function shouldTrigger(rule: any): boolean {
  // Implementation depends on trigger_type
  // e.g., check if trip starts in X days
  return true;
}
```

---

## Realtime Usage

```sql
alter publication supabase_realtime add table public.whatsapp_messages;
```

**Live message updates:**
```typescript
const messagesChannel = supabase
  .channel('whatsapp-messages')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'whatsapp_messages',
      filter: `user_id=eq.${userId}`
    },
    (payload) => console.log('Message update:', payload)
  )
  .subscribe();
```

---

## Migration Notes

```bash
# Add schema files
supabase/schemas/012_whatsapp_tables.sql
supabase/schemas/013_whatsapp_rls.sql

# Generate migration
supabase stop
supabase db diff -f whatsapp_automation
supabase start

# Set WhatsApp secrets
supabase secrets set WHATSAPP_ACCESS_TOKEN=...
supabase secrets set WHATSAPP_PHONE_NUMBER_ID=...
```

---

## Database Functions

### Process scheduled jobs

```sql
create or replace function public.process_scheduled_jobs()
returns void
language plpgsql
security definer
set search_path = ''
volatile
as $$
declare
  v_job record;
begin
  for v_job in
    select * from public.scheduled_jobs
    where status = 'pending'
      and scheduled_for <= now()
    limit 100
  loop
    -- Mark as running
    update public.scheduled_jobs
    set status = 'running', executed_at = now()
    where id = v_job.id;
    
    -- Execute job (call Edge Function)
    -- ... implementation depends on job_type
    
    -- Mark as completed
    update public.scheduled_jobs
    set status = 'completed'
    where id = v_job.id;
  end loop;
end;
$$;

-- Schedule with pg_cron
select cron.schedule(
  'process-scheduled-jobs',
  '* * * * *', -- Every minute
  $$select public.process_scheduled_jobs();$$
);
```

---

## 🔗 Related Documentation

- **[Stage 4 - Payments Schema](/docs/supabase/schema/04-payments-stripe-schema.md)**
- **[Schema Index](/docs/supabase/schema/00-index.md)**

---

**Status:** ✅ Ready for implementation  
**Dependencies:** Stage 1  
**Next Stage:** None (final stage)
