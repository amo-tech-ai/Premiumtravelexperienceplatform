import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { stream } from "npm:hono/streaming";
import * as kv from "./kv_store.tsx";
import * as db from "./database-setup.tsx";
import { getAIService } from "./ai-service.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Extract user ID from Authorization header or use demo user
 * In production, this would validate the JWT and extract user ID
 */
function getUserId(req: any): string {
  const authHeader = req.header('Authorization');
  
  // For now, use a demo user ID if no auth header
  // In production, validate JWT and extract user ID
  if (!authHeader) {
    return 'demo-user';
  }
  
  // Extract token and decode (simplified - use Supabase auth in production)
  const token = authHeader.replace('Bearer ', '');
  
  // For demo, just use the token as user ID
  return token || 'demo-user';
}

/**
 * Error response helper
 */
function errorResponse(message: string, status: number = 400) {
  return {
    error: message,
    status,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Success response helper
 */
function successResponse(data: any, message?: string) {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get("/make-server-fd8c4bf7/health", (c) => {
  return c.json({ 
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// ============================================================================
// TRIPS ROUTES
// ============================================================================

// Get all trips for user
app.get("/make-server-fd8c4bf7/trips", async (c) => {
  try {
    const userId = getUserId(c.req);
    const trips = await db.getUserTrips(userId);
    
    return c.json(successResponse(trips));
  } catch (error) {
    console.error('Error fetching trips:', error);
    return c.json(errorResponse('Failed to fetch trips', 500), 500);
  }
});

// Get single trip
app.get("/make-server-fd8c4bf7/trips/:id", async (c) => {
  try {
    const userId = getUserId(c.req);
    const tripId = c.req.param('id');
    
    const trip = await db.getTrip(userId, tripId);
    
    if (!trip) {
      return c.json(errorResponse('Trip not found', 404), 404);
    }
    
    // Also get trip items
    const items = await db.getTripItems(tripId);
    
    return c.json(successResponse({ ...trip, items }));
  } catch (error) {
    console.error('Error fetching trip:', error);
    return c.json(errorResponse('Failed to fetch trip', 500), 500);
  }
});

// Create trip
app.post("/make-server-fd8c4bf7/trips", async (c) => {
  try {
    const userId = getUserId(c.req);
    const body = await c.req.json();
    
    // Validate required fields
    if (!body.title || !body.destination) {
      return c.json(errorResponse('Title and destination are required', 400), 400);
    }
    
    const trip = await db.createTrip(userId, body);
    
    return c.json(successResponse(trip, 'Trip created successfully'), 201);
  } catch (error) {
    console.error('Error creating trip:', error);
    return c.json(errorResponse('Failed to create trip', 500), 500);
  }
});

// Update trip
app.put("/make-server-fd8c4bf7/trips/:id", async (c) => {
  try {
    const userId = getUserId(c.req);
    const tripId = c.req.param('id');
    const body = await c.req.json();
    
    const trip = await db.updateTrip(userId, tripId, body);
    
    if (!trip) {
      return c.json(errorResponse('Trip not found', 404), 404);
    }
    
    return c.json(successResponse(trip, 'Trip updated successfully'));
  } catch (error) {
    console.error('Error updating trip:', error);
    return c.json(errorResponse('Failed to update trip', 500), 500);
  }
});

// Delete trip
app.delete("/make-server-fd8c4bf7/trips/:id", async (c) => {
  try {
    const userId = getUserId(c.req);
    const tripId = c.req.param('id');
    
    await db.deleteTrip(userId, tripId);
    
    return c.json(successResponse(null, 'Trip deleted successfully'));
  } catch (error) {
    console.error('Error deleting trip:', error);
    return c.json(errorResponse('Failed to delete trip', 500), 500);
  }
});

// ============================================================================
// TRIP ITEMS ROUTES
// ============================================================================

// Get trip items
app.get("/make-server-fd8c4bf7/trips/:id/items", async (c) => {
  try {
    const tripId = c.req.param('id');
    const items = await db.getTripItems(tripId);
    
    return c.json(successResponse(items));
  } catch (error) {
    console.error('Error fetching trip items:', error);
    return c.json(errorResponse('Failed to fetch trip items', 500), 500);
  }
});

// Add trip item
app.post("/make-server-fd8c4bf7/trips/:id/items", async (c) => {
  try {
    const tripId = c.req.param('id');
    const body = await c.req.json();
    
    // Validate required fields
    if (!body.title) {
      return c.json(errorResponse('Title is required', 400), 400);
    }
    
    const item = await db.addTripItem(tripId, body);
    
    return c.json(successResponse(item, 'Item added successfully'), 201);
  } catch (error) {
    console.error('Error adding trip item:', error);
    return c.json(errorResponse('Failed to add trip item', 500), 500);
  }
});

// Update trip item
app.put("/make-server-fd8c4bf7/trips/:tripId/items/:itemId", async (c) => {
  try {
    const tripId = c.req.param('tripId');
    const itemId = c.req.param('itemId');
    const body = await c.req.json();
    
    const item = await db.updateTripItem(tripId, itemId, body);
    
    if (!item) {
      return c.json(errorResponse('Item not found', 404), 404);
    }
    
    return c.json(successResponse(item, 'Item updated successfully'));
  } catch (error) {
    console.error('Error updating trip item:', error);
    return c.json(errorResponse('Failed to update trip item', 500), 500);
  }
});

// Delete trip item
app.delete("/make-server-fd8c4bf7/trips/:tripId/items/:itemId", async (c) => {
  try {
    const tripId = c.req.param('tripId');
    const itemId = c.req.param('itemId');
    
    await db.deleteTripItem(tripId, itemId);
    
    return c.json(successResponse(null, 'Item deleted successfully'));
  } catch (error) {
    console.error('Error deleting trip item:', error);
    return c.json(errorResponse('Failed to delete trip item', 500), 500);
  }
});

// ============================================================================
// SAVED PLACES ROUTES
// ============================================================================

// Get saved places
app.get("/make-server-fd8c4bf7/saved", async (c) => {
  try {
    const userId = getUserId(c.req);
    const places = await db.getSavedPlaces(userId);
    
    return c.json(successResponse(places));
  } catch (error) {
    console.error('Error fetching saved places:', error);
    return c.json(errorResponse('Failed to fetch saved places', 500), 500);
  }
});

// Save place
app.post("/make-server-fd8c4bf7/saved", async (c) => {
  try {
    const userId = getUserId(c.req);
    const body = await c.req.json();
    
    // Validate required fields
    if (!body.title) {
      return c.json(errorResponse('Title is required', 400), 400);
    }
    
    const place = await db.savePlace(userId, body);
    
    return c.json(successResponse(place, 'Place saved successfully'), 201);
  } catch (error) {
    console.error('Error saving place:', error);
    return c.json(errorResponse('Failed to save place', 500), 500);
  }
});

// Unsave place
app.delete("/make-server-fd8c4bf7/saved/:placeId", async (c) => {
  try {
    const userId = getUserId(c.req);
    const placeId = c.req.param('placeId');
    
    await db.unsavePlace(userId, placeId);
    
    return c.json(successResponse(null, 'Place removed successfully'));
  } catch (error) {
    console.error('Error removing saved place:', error);
    return c.json(errorResponse('Failed to remove place', 500), 500);
  }
});

// ============================================================================
// USER PREFERENCES ROUTES
// ============================================================================

// Get user preferences
app.get("/make-server-fd8c4bf7/preferences", async (c) => {
  try {
    const userId = getUserId(c.req);
    const prefs = await db.getUserPreferences(userId);
    
    return c.json(successResponse(prefs || {}));
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return c.json(errorResponse('Failed to fetch preferences', 500), 500);
  }
});

// Update user preferences
app.put("/make-server-fd8c4bf7/preferences", async (c) => {
  try {
    const userId = getUserId(c.req);
    const body = await c.req.json();
    
    const prefs = await db.updateUserPreferences(userId, body);
    
    return c.json(successResponse(prefs, 'Preferences updated successfully'));
  } catch (error) {
    console.error('Error updating preferences:', error);
    return c.json(errorResponse('Failed to update preferences', 500), 500);
  }
});

// ============================================================================
// COLLECTIONS ROUTES
// ============================================================================

// Get user collections
app.get("/make-server-fd8c4bf7/collections", async (c) => {
  try {
    const userId = getUserId(c.req);
    const collections = await db.getUserCollections(userId);
    
    return c.json(successResponse(collections));
  } catch (error) {
    console.error('Error fetching collections:', error);
    return c.json(errorResponse('Failed to fetch collections', 500), 500);
  }
});

// Create collection
app.post("/make-server-fd8c4bf7/collections", async (c) => {
  try {
    const userId = getUserId(c.req);
    const body = await c.req.json();
    
    if (!body.name) {
      return c.json(errorResponse('Collection name is required', 400), 400);
    }
    
    const collection = await db.createCollection(userId, body);
    
    return c.json(successResponse(collection, 'Collection created successfully'), 201);
  } catch (error) {
    console.error('Error creating collection:', error);
    return c.json(errorResponse('Failed to create collection', 500), 500);
  }
});

// Add place to collection
app.post("/make-server-fd8c4bf7/collections/:collectionId/places/:placeId", async (c) => {
  try {
    const userId = getUserId(c.req);
    const collectionId = c.req.param('collectionId');
    const placeId = c.req.param('placeId');
    
    const collection = await db.addPlaceToCollection(userId, collectionId, placeId);
    
    if (!collection) {
      return c.json(errorResponse('Collection not found', 404), 404);
    }
    
    return c.json(successResponse(collection, 'Place added to collection'));
  } catch (error) {
    console.error('Error adding place to collection:', error);
    return c.json(errorResponse('Failed to add place to collection', 500), 500);
  }
});

// ============================================================================
// AI / SEARCH ROUTES (Placeholder - will be implemented in Phase 3)
// ============================================================================

// AI chat endpoint - PRODUCTION READY
app.post("/make-server-fd8c4bf7/ai/chat", async (c) => {
  try {
    const userId = getUserId(c.req);
    const body = await c.req.json();
    
    const { message, conversationId, tripId, history } = body;
    
    if (!message) {
      return c.json(errorResponse('Message is required', 400), 400);
    }
    
    console.log(`📨 AI Chat Request from user ${userId}: "${message}"`);
    
    // Get AI service instance
    const aiService = getAIService();
    
    if (!aiService.isReady()) {
      console.warn('⚠️ AI Service not ready - using fallback');
    }
    
    // Process message with real AI
    const aiResponse = await aiService.processMessage({
      message,
      conversationId,
      tripId,
      userId,
      history,
    });
    
    console.log(`✅ AI Response from ${aiResponse.agent}: ${aiResponse.message.substring(0, 100)}...`);
    
    return c.json(successResponse({
      message: aiResponse.message,
      agent: aiResponse.agent,
      suggestions: aiResponse.suggestions || [],
      confidence: aiResponse.confidence,
    }));
  } catch (error) {
    console.error('❌ Error in AI chat:', error);
    return c.json(errorResponse(`Failed to process chat message: ${error instanceof Error ? error.message : 'Unknown error'}`, 500), 500);
  }
});

// AI chat endpoint with streaming - PRODUCTION READY
app.post("/make-server-fd8c4bf7/ai/chat/stream", async (c) => {
  try {
    const userId = getUserId(c.req);
    const body = await c.req.json();
    
    const { message, conversationId, tripId, history } = body;
    
    if (!message) {
      return c.json(errorResponse('Message is required', 400), 400);
    }
    
    console.log(`📨 AI Stream Request from user ${userId}: "${message}"`);
    
    // Get AI service instance
    const aiService = getAIService();
    
    return stream(c, async (streamWriter) => {
      try {
        const streamGenerator = aiService.processMessageStream({
          message,
          conversationId,
          tripId,
          userId,
          history,
        });
        
        for await (const chunk of streamGenerator) {
          await streamWriter.write(chunk);
        }
        
        console.log(`✅ AI Stream completed for user ${userId}`);
      } catch (error) {
        console.error('❌ Error in AI streaming:', error);
        await streamWriter.write(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
  } catch (error) {
    console.error('❌ Error setting up AI stream:', error);
    return c.json(errorResponse(`Failed to setup stream: ${error instanceof Error ? error.message : 'Unknown error'}`, 500), 500);
  }
});

// Search places endpoint
app.get("/make-server-fd8c4bf7/places/search", async (c) => {
  try {
    const query = c.req.query('q');
    const category = c.req.query('category');
    
    if (!query) {
      return c.json(errorResponse('Query parameter is required', 400), 400);
    }
    
    // TODO: Implement real search (Google Places API, etc.) in Phase 5
    // For now, return empty results
    
    return c.json(successResponse([]));
  } catch (error) {
    console.error('Error searching places:', error);
    return c.json(errorResponse('Failed to search places', 500), 500);
  }
});

// ============================================================================
// DEMO DATA SEED ROUTE
// ============================================================================

app.post("/make-server-fd8c4bf7/seed-demo", async (c) => {
  try {
    const userId = getUserId(c.req);
    await db.seedDemoData(userId);
    
    return c.json(successResponse(null, 'Demo data seeded successfully'));
  } catch (error) {
    console.error('Error seeding demo data:', error);
    return c.json(errorResponse('Failed to seed demo data', 500), 500);
  }
});

// ============================================================================
// START SERVER
// ============================================================================

Deno.serve(app.fetch);