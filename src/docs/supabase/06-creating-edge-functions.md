# Creating Supabase Edge Functions

**Date:** December 20, 2024  
**Purpose:** Guidelines for creating Supabase Edge Functions with TypeScript and Deno  
**Compliance:** Required for all serverless functions

---

## 🎯 Overview

You're an expert in writing TypeScript and Deno JavaScript runtime. Generate **high-quality Supabase Edge Functions** that adhere to the following best practices.

This document provides the complete guidelines for creating Supabase Edge Functions in the Trip Operating System.

---

## Guidelines

### 1. Prefer Web APIs and Deno Core APIs

**Rule:** Try to use Web APIs and Deno's core APIs instead of external dependencies.

**Why:** Reduces bundle size, improves cold start performance, and leverages native optimizations.

**Examples:**
- ✅ Use `fetch` instead of Axios
- ✅ Use WebSockets API instead of node-ws
- ✅ Use `crypto.randomUUID()` instead of uuid package
- ✅ Use Deno.env instead of dotenv package

#### ❌ Avoid

```tsx
import axios from "npm:axios@1.6.0";

const response = await axios.get('https://api.example.com/data');
```

#### ✅ Prefer

```tsx
const response = await fetch('https://api.example.com/data');
const data = await response.json();
```

---

### 2. Share Utilities via `_shared` Directory

**Rule:** If you are reusing utility methods between Edge Functions, add them to `supabase/functions/_shared` and import using a relative path. Do NOT have cross dependencies between Edge Functions.

**Structure:**

```
supabase/
└── functions/
    ├── _shared/
    │   ├── supabase.ts       # Shared Supabase client
    │   ├── validators.ts     # Shared validation logic
    │   ├── types.ts          # Shared TypeScript types
    │   └── utils.ts          # Shared utilities
    ├── generate-trip/
    │   └── index.ts
    └── search-places/
        └── index.ts
```

#### ✅ Correct

```tsx
// supabase/functions/_shared/supabase.ts
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

export const createSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  );
};

// supabase/functions/generate-trip/index.ts
import { createSupabaseClient } from '../_shared/supabase.ts';

const supabase = createSupabaseClient();
```

#### ❌ Incorrect

```tsx
// Don't import from other functions
import { helper } from '../other-function/helper.ts';
```

---

### 3. Use Proper Import Specifiers

**Rule:** Do NOT use bare specifiers when importing dependencies. If you need to use an external dependency, make sure it's prefixed with either `npm:` or `jsr:`.

**Examples:**

```tsx
// ✅ Correct - with npm: prefix
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

// ✅ Correct - with jsr: prefix
import { z } from 'jsr:@std/zod@0.1.0';

// ❌ Incorrect - bare specifier
import { createClient } from '@supabase/supabase-js';
```

---

### 4. Always Define Versions

**Rule:** For external imports, always define a version.

**Why:** Ensures reproducible builds and prevents breaking changes.

#### ❌ Incorrect

```tsx
import express from "npm:express";
```

#### ✅ Correct

```tsx
import express from "npm:express@4.18.2";
```

---

### 5. Prefer npm: and jsr: Over CDNs

**Rule:** For external dependencies, importing via `npm:` and `jsr:` is preferred. Minimize the use of imports from `deno.land/x`, `esm.sh` and `unpkg.com`.

**Migration Examples:**

```tsx
// ❌ Old CDN style
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// ✅ New style - use built-in Deno.serve
Deno.serve(async (req) => { ... });

// ❌ Old CDN style
import { z } from "https://esm.sh/zod@3.22.0";

// ✅ New style
import { z } from "npm:zod@3.22.0";
```

---

### 6. Use Node Built-in APIs When Needed

**Rule:** You can use Node built-in APIs. You will need to import them using `node:` specifier. Use Node APIs when you find gaps in Deno APIs.

**Examples:**

```tsx
import { randomBytes } from "node:crypto";
import { createServer } from "node:http";
import process from "node:process";
import { Buffer } from "node:buffer";
import fs from "node:fs";
```

---

### 7. Use Built-in Deno.serve

**Rule:** Do NOT use `import { serve } from "https://deno.land/std@0.168.0/http/server.ts"`. Instead use the built-in `Deno.serve`.

#### ❌ Incorrect

```tsx
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve((req) => {
  return new Response("Hello");
});
```

#### ✅ Correct

```tsx
Deno.serve(async (req) => {
  return new Response("Hello");
});
```

---

### 8. Pre-populated Environment Variables

**Rule:** Following environment variables (ie. secrets) are pre-populated in both local and hosted Supabase environments. Users don't need to manually set them:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`

**Example:**

```tsx
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);
```

---

### 9. Setting Custom Environment Variables

**Rule:** To set other environment variables (ie. secrets) users can put them in a env file and run:

```bash
supabase secrets set --env-file path/to/env-file
```

**Example `.env` file:**

```bash
OPENAI_API_KEY=sk-...
GOOGLE_MAPS_API_KEY=AIza...
STRIPE_SECRET_KEY=sk_test_...
```

**Setting secrets:**

```bash
# Set from .env file
supabase secrets set --env-file .env.production

# Set individual secret
supabase secrets set OPENAI_API_KEY=sk-...

# List secrets
supabase secrets list
```

**Using in function:**

```tsx
const openaiKey = Deno.env.get('OPENAI_API_KEY');
if (!openaiKey) {
  throw new Error('OPENAI_API_KEY is not set');
}
```

---

### 10. Handle Multiple Routes

**Rule:** A single Edge Function can handle multiple routes. It is recommended to use a library like Express or Hono to handle the routes as it's easier for developer to understand and maintain. Each route must be prefixed with `/function-name` so they are routed correctly.

**Example with Hono:**

```tsx
import { Hono } from 'npm:hono@3.12.0';

const app = new Hono();

// All routes prefixed with /ai-assistant
app.get('/ai-assistant/health', (c) => {
  return c.json({ status: 'ok' });
});

app.post('/ai-assistant/chat', async (c) => {
  const { message } = await c.req.json();
  return c.json({ response: `You said: ${message}` });
});

app.get('/ai-assistant/suggestions', (c) => {
  return c.json({ suggestions: ['Paris', 'Tokyo', 'New York'] });
});

Deno.serve(app.fetch);
```

---

### 11. File Write Operations

**Rule:** File write operations are ONLY permitted on `/tmp` directory. You can use either Deno or Node File APIs.

**Why:** Edge Functions run in a sandboxed environment with limited filesystem access.

**Examples:**

```tsx
// ✅ Correct - write to /tmp
await Deno.writeTextFile('/tmp/output.json', JSON.stringify(data));

// ✅ Correct - read from /tmp
const content = await Deno.readTextFile('/tmp/output.json');

// ❌ Incorrect - cannot write to other directories
await Deno.writeTextFile('/var/data/output.json', data); // Will fail

// ✅ Using Node APIs
import fs from "node:fs/promises";
await fs.writeFile('/tmp/output.json', JSON.stringify(data));
```

---

### 12. Background Tasks with waitUntil

**Rule:** Use `EdgeRuntime.waitUntil(promise)` static method to run long-running tasks in the background without blocking response to a request. Do NOT assume it is available in the request / execution context.

**Example:**

```tsx
Deno.serve(async (req) => {
  // Process immediately
  const result = await processQuickTask();
  
  // Run in background - don't await
  EdgeRuntime.waitUntil(
    sendAnalytics(result)
  );
  
  // Return response immediately
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' }
  });
});

async function sendAnalytics(data: any) {
  // This runs in background after response is sent
  await fetch('https://analytics.example.com/track', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
```

---

## Example Templates

### Simple Hello World Function

```tsx
interface reqPayload {
	name: string;
}

console.info('server started');

Deno.serve(async (req: Request) => {
	const { name }: reqPayload = await req.json();
	const data = {
		message: `Hello ${name} from foo!`,
	};

	return new Response(
		JSON.stringify(data),
		{ headers: { 'Content-Type': 'application/json', 'Connection': 'keep-alive' }}
		);
});
```

---

### Example Function using Node built-in API

```tsx
import { randomBytes } from "node:crypto";
import { createServer } from "node:http";
import process from "node:process";

const generateRandomString = (length) => {
    const buffer = randomBytes(length);
    return buffer.toString('hex');
};

const randomString = generateRandomString(10);
console.log(randomString);

const server = createServer((req, res) => {
    const message = `Hello`;
    res.end(message);
});

server.listen(9999);
```

---

### Using npm packages in Functions

```tsx
import express from "npm:express@4.18.2";

const app = express();

app.get(/(.*)/, (req, res) => {
    res.send("Welcome to Supabase");
});

app.listen(8000);
```

---

### Generate embeddings using built-in @Supabase.ai API

```tsx
const model = new Supabase.ai.Session('gte-small');

Deno.serve(async (req: Request) => {
	const params = new URL(req.url).searchParams;
	const input = params.get('text');
	const output = await model.run(input, { mean_pool: true, normalize: true });
	return new Response(
		JSON.stringify(
			output,
		),
		{
			headers: {
				'Content-Type': 'application/json',
				'Connection': 'keep-alive',
			},
		},
	);
});
```

---

## Trip Operating System Examples

### Example 1: Generate AI Trip Suggestions

```tsx
// supabase/functions/generate-trip/index.ts
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import { z } from 'npm:zod@3.22.0';

// Types
interface TripRequest {
  destination: string;
  duration: number;
  budget?: number;
  interests?: string[];
}

interface TripResponse {
  trip_id: string;
  name: string;
  destination: string;
  suggestions: string[];
}

// Validation schema
const tripRequestSchema = z.object({
  destination: z.string().min(1),
  duration: z.number().min(1).max(365),
  budget: z.number().optional(),
  interests: z.array(z.string()).optional(),
});

console.info('Generate Trip function started');

Deno.serve(async (req: Request) => {
  try {
    // CORS headers
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Validate method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate request
    const body = await req.json();
    const validatedData = tripRequestSchema.parse(body);

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get user from auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate AI suggestions (placeholder - replace with actual AI)
    const suggestions = [
      `Visit ${validatedData.destination} for ${validatedData.duration} days`,
      'Explore local cuisine',
      'Visit historic landmarks',
    ];

    // Create trip in database
    const { data: trip, error: dbError } = await supabase
      .from('trips')
      .insert({
        user_id: user.id,
        name: `Trip to ${validatedData.destination}`,
        destination: validatedData.destination,
        duration: validatedData.duration,
        budget: validatedData.budget,
        status: 'planning',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to create trip' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Prepare response
    const response: TripResponse = {
      trip_id: trip.id,
      name: trip.name,
      destination: trip.destination,
      suggestions,
    };

    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: error.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
```

---

### Example 2: Search Places with Google Maps API

```tsx
// supabase/functions/search-places/index.ts
import { Hono } from 'npm:hono@3.12.0';
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

const app = new Hono();

interface PlaceSearchRequest {
  query: string;
  location?: { lat: number; lng: number };
  radius?: number;
}

app.post('/search-places', async (c) => {
  try {
    const { query, location, radius = 5000 }: PlaceSearchRequest = await c.req.json();

    // Get Google Maps API key from environment
    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!apiKey) {
      return c.json({ error: 'Google Maps API key not configured' }, 500);
    }

    // Build API URL
    const params = new URLSearchParams({
      query,
      key: apiKey,
    });

    if (location) {
      params.append('location', `${location.lat},${location.lng}`);
      params.append('radius', radius.toString());
    }

    // Call Google Places API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?${params}`
    );

    if (!response.ok) {
      return c.json({ error: 'Failed to search places' }, 500);
    }

    const data = await response.json();

    // Transform results
    const places = data.results.map((place: any) => ({
      id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      location: place.geometry.location,
      rating: place.rating,
      types: place.types,
    }));

    return c.json({ places });
  } catch (error) {
    console.error('Search error:', error);
    return c.json({ error: 'Search failed' }, 500);
  }
});

app.get('/search-places/health', (c) => {
  return c.json({ status: 'ok', service: 'search-places' });
});

Deno.serve(app.fetch);
```

---

### Example 3: AI Chat with OpenAI

```tsx
// supabase/functions/ai-chat/index.ts
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

interface ChatRequest {
  message: string;
  trip_id?: string;
  context?: Record<string, any>;
}

interface ChatResponse {
  response: string;
  suggestions?: string[];
}

Deno.serve(async (req: Request) => {
  try {
    // CORS
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Validate method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405 }
      );
    }

    // Parse request
    const { message, trip_id, context }: ChatRequest = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400 }
      );
    }

    // Get OpenAI API key
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500 }
      );
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    // Get trip context if trip_id provided
    let tripContext = '';
    if (trip_id) {
      const { data: trip } = await supabase
        .from('trips')
        .select('name, destination, start_date, end_date')
        .eq('id', trip_id)
        .eq('user_id', user.id)
        .single();

      if (trip) {
        tripContext = `The user is planning a trip to ${trip.destination} from ${trip.start_date} to ${trip.end_date}.`;
      }
    }

    // Call OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a helpful travel planning assistant. ${tripContext}`,
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text();
      console.error('OpenAI error:', error);
      return new Response(
        JSON.stringify({ error: 'AI request failed' }),
        { status: 500 }
      );
    }

    const aiData = await openaiResponse.json();
    const aiMessage = aiData.choices[0]?.message?.content || 'No response';

    // Store conversation in background
    EdgeRuntime.waitUntil(
      supabase.from('chat_history').insert({
        user_id: user.id,
        trip_id,
        user_message: message,
        ai_response: aiMessage,
      })
    );

    // Return response
    const response: ChatResponse = {
      response: aiMessage,
    };

    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
});
```

---

### Example 4: Export Trip to PDF

```tsx
// supabase/functions/export-trip/index.ts
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import { Buffer } from "node:buffer";

interface ExportRequest {
  trip_id: string;
  format: 'pdf' | 'json';
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    const { trip_id, format = 'json' }: ExportRequest = await req.json();

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    // Get trip with places
    const { data: trip, error } = await supabase
      .from('trips')
      .select(`
        *,
        places (*)
      `)
      .eq('id', trip_id)
      .eq('user_id', user.id)
      .single();

    if (error || !trip) {
      return new Response(
        JSON.stringify({ error: 'Trip not found' }),
        { status: 404 }
      );
    }

    if (format === 'json') {
      return new Response(JSON.stringify(trip), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Generate PDF (simplified - use actual PDF library in production)
    const pdfContent = `
Trip: ${trip.name}
Destination: ${trip.destination}
Duration: ${trip.start_date} to ${trip.end_date}

Places:
${trip.places?.map((p: any) => `- ${p.name}`).join('\n')}
    `;

    // Save to /tmp
    const filename = `/tmp/trip-${trip_id}.txt`;
    await Deno.writeTextFile(filename, pdfContent);

    // Read and return
    const content = await Deno.readTextFile(filename);
    const buffer = Buffer.from(content);

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="trip-${trip.name}.txt"`,
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return new Response(
      JSON.stringify({ error: 'Export failed' }),
      { status: 500 }
    );
  }
});
```

---

### Example 5: Webhook Handler for External Services

```tsx
// supabase/functions/webhooks/index.ts
import { Hono } from 'npm:hono@3.12.0';
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import { createHmac } from "node:crypto";

const app = new Hono();

// Helper to verify webhook signature
function verifySignature(payload: string, signature: string, secret: string): boolean {
  const hmac = createHmac('sha256', secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');
  return signature === expectedSignature;
}

// Stripe webhook
app.post('/webhooks/stripe', async (c) => {
  try {
    const signature = c.req.header('stripe-signature');
    const secret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!signature || !secret) {
      return c.json({ error: 'Invalid signature' }, 400);
    }

    const rawBody = await c.req.text();
    
    if (!verifySignature(rawBody, signature, secret)) {
      return c.json({ error: 'Signature verification failed' }, 401);
    }

    const event = JSON.parse(rawBody);

    // Create service role client for database updates
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        await supabase
          .from('payments')
          .update({ status: 'succeeded' })
          .eq('stripe_payment_id', event.data.object.id);
        break;

      case 'payment_intent.failed':
        await supabase
          .from('payments')
          .update({ status: 'failed' })
          .eq('stripe_payment_id', event.data.object.id);
        break;
    }

    return c.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return c.json({ error: 'Webhook processing failed' }, 500);
  }
});

// Google Calendar webhook
app.post('/webhooks/google-calendar', async (c) => {
  try {
    const notification = await c.req.json();

    // Process calendar update
    console.log('Calendar notification:', notification);

    return c.json({ received: true });
  } catch (error) {
    console.error('Calendar webhook error:', error);
    return c.json({ error: 'Webhook processing failed' }, 500);
  }
});

app.get('/webhooks/health', (c) => {
  return c.json({ status: 'ok', service: 'webhooks' });
});

Deno.serve(app.fetch);
```

---

### Example 6: Scheduled Background Job

```tsx
// supabase/functions/cleanup-old-trips/index.ts
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

// This function can be triggered by Supabase cron scheduler
Deno.serve(async (req: Request) => {
  try {
    // Verify this is a cron request (optional)
    const authHeader = req.headers.get('Authorization');
    const cronSecret = Deno.env.get('CRON_SECRET');
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    // Create service role client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Delete trips older than 1 year with status 'archived'
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const { data, error } = await supabase
      .from('trips')
      .delete()
      .eq('status', 'archived')
      .lt('end_date', oneYearAgo.toISOString())
      .select();

    if (error) {
      console.error('Cleanup error:', error);
      return new Response(
        JSON.stringify({ error: 'Cleanup failed' }),
        { status: 500 }
      );
    }

    console.log(`Deleted ${data?.length || 0} old trips`);

    return new Response(
      JSON.stringify({
        success: true,
        deleted_count: data?.length || 0,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Cleanup error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
});
```

---

## Shared Utilities

### _shared/supabase.ts

```tsx
// supabase/functions/_shared/supabase.ts
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

export interface SupabaseClientOptions {
  useServiceRole?: boolean;
  authHeader?: string;
}

export function createSupabaseClient(options: SupabaseClientOptions = {}) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL is not set');
  }

  const key = options.useServiceRole
    ? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    : Deno.env.get('SUPABASE_ANON_KEY');

  if (!key) {
    throw new Error('Supabase key is not set');
  }

  const clientOptions: any = {};

  if (options.authHeader) {
    clientOptions.global = {
      headers: { Authorization: options.authHeader },
    };
  }

  return createClient(supabaseUrl, key, clientOptions);
}
```

---

### _shared/validators.ts

```tsx
// supabase/functions/_shared/validators.ts
import { z } from 'npm:zod@3.22.0';

export const tripSchema = z.object({
  name: z.string().min(1).max(200),
  destination: z.string().min(1).max(200),
  start_date: z.string().datetime().or(z.date()),
  end_date: z.string().datetime().or(z.date()),
  budget: z.number().min(0).optional(),
  travelers: z.number().min(1).max(50).default(1),
});

export const placeSchema = z.object({
  trip_id: z.string().uuid(),
  name: z.string().min(1).max(200),
  category: z.enum(['accommodation', 'activity', 'restaurant', 'transport', 'other']),
  price: z.number().min(0).optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
});

export const chatMessageSchema = z.object({
  message: z.string().min(1).max(5000),
  trip_id: z.string().uuid().optional(),
  context: z.record(z.any()).optional(),
});

export type TripInput = z.infer<typeof tripSchema>;
export type PlaceInput = z.infer<typeof placeSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
```

---

### _shared/cors.ts

```tsx
// supabase/functions/_shared/cors.ts

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
};

export function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }
  return null;
}
```

---

### _shared/error-handler.ts

```tsx
// supabase/functions/_shared/error-handler.ts
import { z } from 'npm:zod@3.22.0';
import { corsHeaders } from './cors.ts';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown): Response {
  console.error('Error:', error);

  if (error instanceof z.ZodError) {
    return new Response(
      JSON.stringify({
        error: 'Validation failed',
        details: error.errors,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  if (error instanceof AppError) {
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.details,
      }),
      {
        status: error.statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(
    JSON.stringify({
      error: 'Internal server error',
    }),
    {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}
```

---

### _shared/types.ts

```tsx
// supabase/functions/_shared/types.ts

export interface Database {
  public: {
    Tables: {
      trips: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          destination: string;
          start_date: string;
          end_date: string;
          budget: number | null;
          status: 'planning' | 'booked' | 'completed' | 'archived';
          travelers: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['trips']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['trips']['Insert']>;
      };
      places: {
        Row: {
          id: string;
          trip_id: string;
          name: string;
          category: string;
          price: number | null;
          latitude: number | null;
          longitude: number | null;
          day_number: number;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['places']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['places']['Insert']>;
      };
    };
  };
}
```

---

## Testing Edge Functions

### Local Testing

```bash
# Start Supabase (includes Edge Functions runtime)
supabase start

# Test function locally
supabase functions serve generate-trip --env-file .env.local

# Make request
curl -i --location --request POST 'http://localhost:54321/functions/v1/generate-trip' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"destination": "Paris", "duration": 7}'
```

---

### Testing with TypeScript Client

```typescript
// test-edge-function.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'http://localhost:54321',
  'YOUR_ANON_KEY'
);

async function testGenerateTrip() {
  const { data, error } = await supabase.functions.invoke('generate-trip', {
    body: {
      destination: 'Paris',
      duration: 7,
      budget: 2000,
      interests: ['food', 'art', 'history'],
    },
  });

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success:', data);
  }
}

testGenerateTrip();
```

---

### Testing with curl

```bash
# Test health endpoint
curl http://localhost:54321/functions/v1/search-places/health

# Test with authentication
curl -i --location --request POST \
  'http://localhost:54321/functions/v1/ai-chat' \
  --header 'Authorization: Bearer YOUR_SUPABASE_JWT' \
  --header 'Content-Type: application/json' \
  --data '{
    "message": "What should I do in Paris?",
    "trip_id": "123e4567-e89b-12d3-a456-426614174000"
  }'

# Test OPTIONS (CORS)
curl -i --location --request OPTIONS \
  'http://localhost:54321/functions/v1/generate-trip' \
  --header 'Access-Control-Request-Method: POST' \
  --header 'Access-Control-Request-Headers: Content-Type'
```

---

## Deployment

### Deploy Functions

```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy generate-trip

# Deploy with environment variables
supabase secrets set OPENAI_API_KEY=sk-... GOOGLE_MAPS_API_KEY=AIza...
supabase functions deploy

# List deployed functions
supabase functions list
```

---

### Set Secrets

```bash
# From .env file
supabase secrets set --env-file .env.production

# Individual secret
supabase secrets set OPENAI_API_KEY=sk-...

# List secrets (values are hidden)
supabase secrets list

# Delete secret
supabase secrets unset OPENAI_API_KEY
```

---

### Invoke Deployed Functions

```typescript
// Production
const { data, error } = await supabase.functions.invoke('generate-trip', {
  body: { destination: 'Paris', duration: 7 },
});

// Or via HTTP
const response = await fetch(
  'https://your-project.supabase.co/functions/v1/generate-trip',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ destination: 'Paris', duration: 7 }),
  }
);
```

---

## Performance Best Practices

### 1. Minimize Cold Starts

```tsx
// ❌ Import heavy libraries only when needed
import { heavyLibrary } from 'npm:heavy-library@1.0.0';

Deno.serve(async (req) => {
  // heavyLibrary loaded on every cold start
});

// ✅ Lazy load when actually needed
Deno.serve(async (req) => {
  if (needsHeavyProcessing) {
    const { heavyLibrary } = await import('npm:heavy-library@1.0.0');
    // Only loads when needed
  }
});
```

---

### 2. Cache External API Responses

```tsx
// In-memory cache (resets on cold start)
const cache = new Map<string, { data: any; expiry: number }>();

async function getCachedData(key: string, ttl: number = 300000) {
  const cached = cache.get(key);
  
  if (cached && cached.expiry > Date.now()) {
    return cached.data;
  }

  const data = await fetchFromExternalAPI(key);
  cache.set(key, { data, expiry: Date.now() + ttl });
  
  return data;
}
```

---

### 3. Use Streaming Responses

```tsx
// For large responses, use streaming
Deno.serve(async (req) => {
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < 100; i++) {
        const chunk = JSON.stringify({ index: i }) + '\n';
        controller.enqueue(new TextEncoder().encode(chunk));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'application/x-ndjson' },
  });
});
```

---

### 4. Optimize Database Queries

```tsx
// ❌ Multiple queries
const trip = await supabase.from('trips').select('*').eq('id', tripId).single();
const places = await supabase.from('places').select('*').eq('trip_id', tripId);
const user = await supabase.from('users').select('*').eq('id', trip.user_id).single();

// ✅ Single query with joins
const { data } = await supabase
  .from('trips')
  .select(`
    *,
    places (*),
    users (*)
  `)
  .eq('id', tripId)
  .single();
```

---

## Error Handling Patterns

### Structured Error Responses

```tsx
import { handleCors } from '../_shared/cors.ts';
import { handleError, AppError } from '../_shared/error-handler.ts';

Deno.serve(async (req: Request) => {
  try {
    // Handle CORS
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    // Your logic here
    if (!isValid) {
      throw new AppError('Validation failed', 400, { field: 'destination' });
    }

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    return handleError(error);
  }
});
```

---

## Security Best Practices

### 1. Always Validate Input

```tsx
import { z } from 'npm:zod@3.22.0';

const schema = z.object({
  email: z.string().email(),
  amount: z.number().min(0).max(10000),
});

Deno.serve(async (req) => {
  const body = await req.json();
  const validated = schema.parse(body); // Throws if invalid
  // Use validated data
});
```

---

### 2. Verify User Authentication

```tsx
const { data: { user }, error } = await supabase.auth.getUser();

if (error || !user) {
  return new Response(
    JSON.stringify({ error: 'Unauthorized' }),
    { status: 401 }
  );
}
```

---

### 3. Use RLS Policies

```tsx
// Don't bypass RLS unless necessary
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')!, // ✅ Uses RLS
  {
    global: {
      headers: { Authorization: req.headers.get('Authorization')! },
    },
  }
);

// Only use service role when absolutely needed
const adminSupabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // ⚠️ Bypasses RLS
);
```

---

### 4. Rate Limiting

```tsx
// Simple in-memory rate limiter
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string, maxRequests = 100, windowMs = 60000): boolean {
  const now = Date.now();
  const userLimit = requestCounts.get(userId);

  if (!userLimit || userLimit.resetAt < now) {
    requestCounts.set(userId, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (userLimit.count >= maxRequests) {
    return false;
  }

  userLimit.count++;
  return true;
}

Deno.serve(async (req) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!checkRateLimit(user.id)) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded' }),
      { status: 429 }
    );
  }

  // Process request
});
```

---

## Logging and Monitoring

### Structured Logging

```tsx
function log(level: 'info' | 'error' | 'warn', message: string, data?: any) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    data,
  };
  console.log(JSON.stringify(logEntry));
}

Deno.serve(async (req) => {
  log('info', 'Request received', {
    method: req.method,
    url: req.url,
  });

  try {
    // Process request
    log('info', 'Request processed successfully');
  } catch (error) {
    log('error', 'Request failed', { error: error.message });
  }
});
```

---

## Quick Reference Checklist

### Before Creating Function

- [ ] Determine function purpose
- [ ] Plan required environment variables
- [ ] Design request/response schema
- [ ] Choose appropriate packages
- [ ] Plan error handling

### Creating Function

- [ ] Use `Deno.serve()`
- [ ] Set `search_path = ''` for database functions
- [ ] Use proper import specifiers (npm:, jsr:, node:)
- [ ] Add version numbers to all imports
- [ ] Validate all inputs with Zod
- [ ] Handle CORS properly
- [ ] Add authentication checks
- [ ] Use structured error handling
- [ ] Add logging
- [ ] Only write to /tmp directory

### After Creating Function

- [ ] Test locally with `supabase functions serve`
- [ ] Test with different inputs
- [ ] Test error cases
- [ ] Test authentication
- [ ] Set required secrets
- [ ] Deploy to staging
- [ ] Test deployed function
- [ ] Monitor logs
- [ ] Deploy to production

---

## 🔗 Related Documentation

- **[Creating Migrations](/docs/supabase/03-creating-migrations.md)** - Database migrations
- **[Creating RLS Policies](/docs/supabase/04-creating-rls-policies.md)** - Row level security
- **[Creating Functions](/docs/supabase/05-creating-functions.md)** - Database functions
- **[Postgres SQL Style Guide](/docs/supabase/02-postgres-sql-style-guide.md)** - SQL standards

---

## 📚 Additional Resources

### Official Documentation
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Deno Runtime](https://deno.land/manual)
- [Deno Deploy](https://deno.com/deploy/docs)

---

**Status:** Required for all serverless functions  
**Last Updated:** December 20, 2024  
**Maintained by:** Backend Team
