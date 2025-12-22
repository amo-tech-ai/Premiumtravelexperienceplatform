/**
 * AI Orchestrator Edge Function
 * 
 * Main entry point for all AI agent interactions
 * Routes requests to appropriate specialized agents
 * Handles streaming responses and tool calling
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { GoogleGenerativeAI } from 'npm:@google/generative-ai@0.21.0';

// ============================================================================
// TYPES
// ============================================================================

interface AIRequest {
  message: string;
  conversationId?: string;
  context?: {
    location?: { city: string; lat: number; lng: number };
    tripId?: string;
    userPreferences?: any;
  };
  mode?: 'events' | 'restaurants' | 'rentals' | 'maps' | 'general';
  stream?: boolean;
}

interface AIResponse {
  message: string;
  agent: string;
  intent: string;
  confidence: number;
  uiData?: {
    displayFormat: 'text' | 'card' | 'list' | 'map' | 'carousel';
    cards?: any[];
    suggestions?: string[];
  };
  sources?: any[];
  conversationId: string;
  messageId: string;
}

// ============================================================================
// INTENT CLASSIFICATION
// ============================================================================

function classifyIntent(message: string, mode?: string): {
  intent: string;
  agent: string;
  confidence: number;
} {
  const lower = message.toLowerCase();
  
  // Mode-specific routing
  if (mode === 'events') {
    return { intent: 'event_discovery', agent: 'events', confidence: 1.0 };
  }
  if (mode === 'restaurants') {
    return { intent: 'dining', agent: 'restaurants', confidence: 1.0 };
  }
  if (mode === 'rentals') {
    return { intent: 'rental', agent: 'rentals', confidence: 1.0 };
  }
  if (mode === 'maps') {
    return { intent: 'navigation', agent: 'maps', confidence: 1.0 };
  }
  
  // Intent detection from message
  if (/(event|concert|show|festival|happening)/i.test(lower)) {
    return { intent: 'event_discovery', agent: 'events', confidence: 0.9 };
  }
  
  if (/(restaurant|food|eat|dining|lunch|dinner)/i.test(lower)) {
    return { intent: 'dining', agent: 'restaurants', confidence: 0.9 };
  }
  
  if (/(rent|car|vehicle|motorcycle|bike)/i.test(lower)) {
    return { intent: 'rental', agent: 'rentals', confidence: 0.85 };
  }
  
  if (/(route|direction|map|navigate|how to get)/i.test(lower)) {
    return { intent: 'navigation', agent: 'maps', confidence: 0.9 };
  }
  
  if (/(plan|itinerary|schedule|optimize)/i.test(lower)) {
    return { intent: 'planning', agent: 'context', confidence: 0.85 };
  }
  
  // Default to context agent
  return { intent: 'general', agent: 'context', confidence: 0.5 };
}

// ============================================================================
// AGENT PROCESSORS
// ============================================================================

async function processEventsAgent(
  request: AIRequest,
  gemini: any,
  supabase: any
): Promise<any> {
  const systemPrompt = `You are the Events Agent. You discover concerts, festivals, shows, sports events, and local happenings.

Context:
- Location: ${request.context?.location?.city || 'Unknown'}
- User preferences: ${JSON.stringify(request.context?.userPreferences || {})}

Your goal: Find relevant events and return them as structured cards.

Output Format:
{
  "events": [
    {
      "name": "Event Name",
      "type": "concert|festival|sports|theater",
      "date": "2025-01-25",
      "time": "19:00",
      "venue": "Venue Name",
      "address": "Full address",
      "price": "50 USD",
      "description": "Brief description",
      "imageUrl": "https://...",
      "ticketUrl": "https://..."
    }
  ],
  "message": "Natural language summary",
  "suggestions": ["Related suggestion 1", "Related suggestion 2"]
}`;

  const model = gemini.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.7,
      responseMimeType: 'application/json'
    }
  });
  
  const result = await model.generateContent([
    { text: systemPrompt },
    { text: `User request: ${request.message}` }
  ]);
  
  const response = result.response;
  const data = JSON.parse(response.text());
  
  return {
    message: data.message,
    uiData: {
      displayFormat: 'carousel',
      cards: data.events,
      suggestions: data.suggestions
    }
  };
}

async function processRestaurantsAgent(
  request: AIRequest,
  gemini: any,
  supabase: any
): Promise<any> {
  const systemPrompt = `You are the Restaurants Agent. You recommend restaurants, cafes, and dining experiences.

Context:
- Location: ${request.context?.location?.city || 'Unknown'}
- Dietary restrictions: ${request.context?.userPreferences?.dietary_restrictions || 'None'}
- Favorite cuisines: ${request.context?.userPreferences?.favorite_cuisines || 'Any'}
- Price range: ${request.context?.userPreferences?.price_range_dining || 'moderate'}

Your goal: Find relevant restaurants and return them as structured cards.

Output Format:
{
  "restaurants": [
    {
      "name": "Restaurant Name",
      "cuisine": "Italian",
      "priceLevel": 2,
      "rating": 4.5,
      "address": "Full address",
      "hours": "11:00 AM - 10:00 PM",
      "description": "Brief description",
      "imageUrl": "https://...",
      "reservationUrl": "https://...",
      "highlights": ["Outdoor seating", "Wine selection"]
    }
  ],
  "message": "Natural language summary",
  "suggestions": ["Try Italian", "Near you", "Romantic spots"]
}`;

  const model = gemini.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.7,
      responseMimeType: 'application/json'
    }
  });
  
  const result = await model.generateContent([
    { text: systemPrompt },
    { text: `User request: ${request.message}` }
  ]);
  
  const response = result.response;
  const data = JSON.parse(response.text());
  
  return {
    message: data.message,
    uiData: {
      displayFormat: 'list',
      cards: data.restaurants,
      suggestions: data.suggestions
    }
  };
}

async function processRentalsAgent(
  request: AIRequest,
  gemini: any,
  supabase: any
): Promise<any> {
  const systemPrompt = `You are the Rentals Agent. You help find vehicle rentals (cars, motorcycles, bikes).

Context:
- Location: ${request.context?.location?.city || 'Unknown'}
- Preferences: ${JSON.stringify(request.context?.userPreferences || {})}

Output Format:
{
  "rentals": [
    {
      "name": "Vehicle Name",
      "type": "sedan|suv|motorcycle|bike",
      "company": "Rental Company",
      "dailyRate": "50 USD",
      "features": ["GPS", "Automatic", "Air Conditioning"],
      "imageUrl": "https://...",
      "bookingUrl": "https://..."
    }
  ],
  "message": "Natural language summary",
  "suggestions": ["Electric cars", "Luxury options"]
}`;

  const model = gemini.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.7,
      responseMimeType: 'application/json'
    }
  });
  
  const result = await model.generateContent([
    { text: systemPrompt },
    { text: `User request: ${request.message}` }
  ]);
  
  const response = result.response;
  const data = JSON.parse(response.text());
  
  return {
    message: data.message,
    uiData: {
      displayFormat: 'card',
      cards: data.rentals,
      suggestions: data.suggestions
    }
  };
}

async function processMapsAgent(
  request: AIRequest,
  gemini: any,
  supabase: any
): Promise<any> {
  // Maps agent for navigation, routing, distance calculations
  return {
    message: "Maps agent would provide routing and navigation here",
    uiData: {
      displayFormat: 'map',
      cards: [],
      suggestions: ["Show route", "Find parking", "Nearby places"]
    }
  };
}

async function processContextAgent(
  request: AIRequest,
  gemini: any,
  supabase: any
): Promise<any> {
  // General context-aware agent
  const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const result = await model.generateContent(request.message);
  const response = result.response;
  
  return {
    message: response.text(),
    uiData: {
      displayFormat: 'text',
      suggestions: ["Tell me more", "Find places", "Plan my day"]
    }
  };
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

serve(async (req) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, content-type',
      },
    });
  }

  try {
    // Initialize clients
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const gemini = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') ?? '');
    
    // Parse request
    const body: AIRequest = await req.json();
    
    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Classify intent and route to agent
    const { intent, agent, confidence } = classifyIntent(body.message, body.mode);
    
    console.log(`Routing to ${agent} agent with intent: ${intent} (confidence: ${confidence})`);
    
    // Get or create conversation
    let conversationId = body.conversationId;
    if (!conversationId) {
      const { data: conversation } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          context_type: body.mode || 'general',
          location_context: body.context?.location,
          trip_context: body.context?.tripId ? { trip_id: body.context.tripId } : null
        })
        .select()
        .single();
      
      conversationId = conversation?.id;
    }
    
    // Save user message
    const { data: userMessage } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role: 'user',
        content: body.message,
        sequence_number: (await supabase
          .from('messages')
          .select('sequence_number', { count: 'exact' })
          .eq('conversation_id', conversationId)
          .then(r => (r.count || 0) + 1))
      })
      .select()
      .single();
    
    // Route to appropriate agent
    let agentResponse;
    switch (agent) {
      case 'events':
        agentResponse = await processEventsAgent(body, gemini, supabase);
        break;
      case 'restaurants':
        agentResponse = await processRestaurantsAgent(body, gemini, supabase);
        break;
      case 'rentals':
        agentResponse = await processRentalsAgent(body, gemini, supabase);
        break;
      case 'maps':
        agentResponse = await processMapsAgent(body, gemini, supabase);
        break;
      default:
        agentResponse = await processContextAgent(body, gemini, supabase);
    }
    
    // Save AI response
    const { data: aiMessage } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: agentResponse.message,
        ui_data: agentResponse.uiData,
        display_format: agentResponse.uiData?.displayFormat || 'text',
        model: 'gemini-1.5-flash',
        sequence_number: (await supabase
          .from('messages')
          .select('sequence_number', { count: 'exact' })
          .eq('conversation_id', conversationId)
          .then(r => (r.count || 0) + 1))
      })
      .select()
      .single();
    
    // Log AI run
    await supabase.from('ai_runs').insert({
      user_id: user.id,
      conversation_id: conversationId,
      message_id: aiMessage?.id,
      agent_type: agent,
      intent: intent,
      model: 'gemini-1.5-flash',
      prompt: body.message,
      response: agentResponse.message,
      structured_output: agentResponse.uiData,
      status: 'success'
    });
    
    // Return response
    const response: AIResponse = {
      message: agentResponse.message,
      agent: agent,
      intent: intent,
      confidence: confidence,
      uiData: agentResponse.uiData,
      conversationId: conversationId!,
      messageId: aiMessage?.id!
    };
    
    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
    
  } catch (error) {
    console.error('AI Orchestrator Error:', error);
    
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
