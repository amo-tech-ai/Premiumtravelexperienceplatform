# Stage 4 — Payments & Stripe Integration Schema

**Stage:** 4 of 5  
**Purpose:** Subscription management and usage-based billing  
**Timeline:** Week 7-8  
**Dependencies:** Stage 1 (Core), Stage 3 (AI for usage tracking)  
**Status:** 🟢 Revenue generation

---

## Overview

Stage 4 enables monetization through Stripe subscriptions, usage limits, and billing.

**CRITICAL:** Never store sensitive payment data. Only store Stripe IDs and metadata.

**Tables:** 5  
**Estimated rows (10K users, 1 year):** ~50K  
**Storage:** ~25 MB

---

## Tables

### subscriptions

```sql
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  stripe_customer_id text unique not null,
  stripe_subscription_id text unique,
  plan_id uuid references public.plans(id) on delete restrict,
  status text not null check (status in ('active', 'trialing', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  canceled_at timestamptz,
  trial_start timestamptz,
  trial_end timestamptz,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_subscriptions_stripe_customer_id on public.subscriptions(stripe_customer_id);
create index idx_subscriptions_status on public.subscriptions(status);
```

---

### plans

```sql
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text,
  stripe_price_id text unique not null,
  stripe_product_id text unique not null,
  price_usd numeric(10, 2) not null,
  interval text not null check (interval in ('month', 'year')),
  features jsonb default '[]'::jsonb,
  limits jsonb not null default '{
    "ai_runs_per_month": 100,
    "trips_max": 10,
    "collaborators_per_trip": 5
  }'::jsonb,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_plans_active on public.plans(is_active) where is_active = true;
```

**Seed data:**
```sql
insert into public.plans (name, stripe_price_id, stripe_product_id, price_usd, interval, limits) values
  ('Free', 'price_free', 'prod_free', 0, 'month', '{"ai_runs_per_month": 10, "trips_max": 3, "collaborators_per_trip": 0}'),
  ('Pro', 'price_pro', 'prod_pro', 9.99, 'month', '{"ai_runs_per_month": 500, "trips_max": 50, "collaborators_per_trip": 10}'),
  ('Enterprise', 'price_enterprise', 'prod_enterprise', 29.99, 'month', '{"ai_runs_per_month": -1, "trips_max": -1, "collaborators_per_trip": -1}');
```

---

### usage_limits

```sql
create table public.usage_limits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  ai_runs_used integer default 0,
  ai_runs_limit integer not null,
  trips_used integer default 0,
  trips_limit integer not null,
  reset_at timestamptz not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_usage_limits_user_id on public.usage_limits(user_id);
create index idx_usage_limits_reset_at on public.usage_limits(reset_at);
```

---

### invoices

```sql
create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_invoice_id text unique not null,
  stripe_subscription_id text,
  amount_due numeric(10, 2) not null,
  amount_paid numeric(10, 2) default 0,
  currency text default 'USD',
  status text not null check (status in ('draft', 'open', 'paid', 'uncollectible', 'void')),
  invoice_pdf text,
  hosted_invoice_url text,
  due_date timestamptz,
  paid_at timestamptz,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index idx_invoices_user_id on public.invoices(user_id);
create index idx_invoices_status on public.invoices(status);
create index idx_invoices_stripe_invoice_id on public.invoices(stripe_invoice_id);
```

---

### billing_events

```sql
create table public.billing_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  event_type text not null,
  stripe_event_id text unique not null,
  stripe_event_type text not null,
  data jsonb not null,
  processed boolean default false,
  processed_at timestamptz,
  error_message text,
  created_at timestamptz default now()
);

create index idx_billing_events_user_id on public.billing_events(user_id);
create index idx_billing_events_type on public.billing_events(event_type);
create index idx_billing_events_processed on public.billing_events(processed) where processed = false;
```

---

## RLS Strategy

All payment tables are **read-only from client**, **write-only via Edge Functions**.

### subscriptions

```sql
alter table public.subscriptions enable row level security;

create policy "Users can view their own subscription"
  on public.subscriptions for select
  to authenticated
  using ( user_id = auth.uid() );
```

### plans

```sql
alter table public.plans enable row level security;

create policy "Anyone can view active plans"
  on public.plans for select
  to authenticated
  using ( is_active = true );
```

### usage_limits

```sql
alter table public.usage_limits enable row level security;

create policy "Users can view their own usage"
  on public.usage_limits for select
  to authenticated
  using ( user_id = auth.uid() );
```

### invoices

```sql
alter table public.invoices enable row level security;

create policy "Users can view their own invoices"
  on public.invoices for select
  to authenticated
  using ( user_id = auth.uid() );
```

### billing_events

```sql
alter table public.billing_events enable row level security;

create policy "Users can view their own billing events"
  on public.billing_events for select
  to authenticated
  using ( user_id = auth.uid() );
```

---

## Edge Functions

### create-checkout-session

```typescript
// supabase/functions/create-checkout-session/index.ts
import Stripe from 'npm:stripe@14.0.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16'
});

Deno.serve(async (req: Request) => {
  const { price_id, success_url, cancel_url } = await req.json();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get or create Stripe customer
  let { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single();
  
  let customerId = subscription?.stripe_customer_id;
  
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id }
    });
    customerId = customer.id;
    
    await supabase
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        stripe_customer_id: customerId,
        status: 'incomplete'
      });
  }
  
  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [{ price: price_id, quantity: 1 }],
    mode: 'subscription',
    success_url,
    cancel_url,
    metadata: { user_id: user.id }
  });
  
  return new Response(JSON.stringify({ url: session.url }));
});
```

---

### handle-stripe-webhook

```typescript
// supabase/functions/handle-stripe-webhook/index.ts
import Stripe from 'npm:stripe@14.0.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);

Deno.serve(async (req: Request) => {
  const signature = req.headers.get('stripe-signature')!;
  const body = await req.text();
  
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    Deno.env.get('STRIPE_WEBHOOK_SECRET')!
  );
  
  // Log event
  await supabase.from('billing_events').insert({
    stripe_event_id: event.id,
    stripe_event_type: event.type,
    data: event.data,
    event_type: event.type
  });
  
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription;
      await supabase.from('subscriptions').upsert({
        user_id: subscription.metadata.user_id,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000),
        current_period_end: new Date(subscription.current_period_end * 1000)
      });
      break;
    
    case 'invoice.paid':
      const invoice = event.data.object as Stripe.Invoice;
      await supabase.from('invoices').insert({
        user_id: invoice.metadata?.user_id,
        stripe_invoice_id: invoice.id,
        amount_paid: invoice.amount_paid / 100,
        status: 'paid',
        paid_at: new Date(invoice.status_transitions.paid_at! * 1000)
      });
      break;
  }
  
  return new Response(JSON.stringify({ received: true }));
});
```

---

### enforce-usage-limits

```typescript
// Database function called before AI runs
create or replace function public.check_ai_usage_limit(p_user_id uuid)
returns boolean
language plpgsql
security invoker
set search_path = ''
volatile
as $$
declare
  v_limit record;
begin
  select * into v_limit
  from public.usage_limits
  where user_id = p_user_id;
  
  if not found then
    raise exception 'No usage limits found for user';
  end if;
  
  if v_limit.ai_runs_limit = -1 then
    return true; -- unlimited
  end if;
  
  if v_limit.ai_runs_used >= v_limit.ai_runs_limit then
    return false; -- limit exceeded
  end if;
  
  -- Increment usage
  update public.usage_limits
  set ai_runs_used = ai_runs_used + 1
  where user_id = p_user_id;
  
  return true;
end;
$$;
```

---

## Database Functions

### Reset monthly limits

```sql
create or replace function public.reset_monthly_usage_limits()
returns void
language plpgsql
security definer
set search_path = ''
volatile
as $$
begin
  update public.usage_limits
  set 
    ai_runs_used = 0,
    trips_used = 0,
    reset_at = now() + interval '1 month'
  where reset_at <= now();
end;
$$;

-- Schedule with pg_cron (or Supabase cron)
select cron.schedule(
  'reset-usage-limits',
  '0 0 1 * *', -- First day of each month
  $$select public.reset_monthly_usage_limits();$$
);
```

---

## Migration Notes

```bash
# Add schema files
supabase/schemas/009_payments_tables.sql
supabase/schemas/010_payments_rls.sql
supabase/schemas/011_payments_seed_plans.sql

# Generate migration
supabase stop
supabase db diff -f stripe_payments
supabase start

# Set Stripe secrets
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🔗 Related Documentation

- **[Stage 3 - AI Schema](/docs/supabase/schema/03-ai-agents-schema.md)**
- **[Stage 5 - WhatsApp Schema](/docs/supabase/schema/05-whatsapp-automation-schema.md)**

---

**Status:** ✅ Ready for implementation  
**Dependencies:** Stage 1, Stage 3 (for usage tracking)  
**Next Stage:** WhatsApp (Stage 5)
