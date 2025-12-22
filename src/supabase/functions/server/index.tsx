import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { stream } from "npm:hono/streaming";
import * as kv from "./kv_store.tsx";
import * as db from "./database-setup.tsx";
import { getAIService } from "./ai-service.tsx";
import * as jobService from "./job-service.ts";

// ============================================================================
// DB SERVICES (Supabase-first)
// ============================================================================
import * as dbEvents from './db-events-service.ts';
import * as dbRestaurants from './db-restaurants-service.ts';
import * as dbRentals from './db-rentals-service.ts';
import * as dbLocations from './db-locations-service.ts';

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
// EVENTS ROUTES
// ============================================================================

// Get all events (with filters)
app.get("/make-server-fd8c4bf7/events", async (c) => {
  try {
    // Query Postgres (single source of truth - NO auto-seed)
    const search = c.req.query('search');
    const category = c.req.query('category');
    const area = c.req.query('area');
    
    let events;
    if (search) {
      events = await dbEvents.search(search);
    } else {
      events = await dbEvents.getAll({ category, area });
    }
    
    return c.json(successResponse(events));
  } catch (error) {
    console.error('Error fetching events:', error);
    return c.json(errorResponse('Failed to fetch events', 500), 500);
  }
});

// Get single event
app.get("/make-server-fd8c4bf7/events/:id", async (c) => {
  try {
    const eventId = c.req.param('id');
    const event = await dbEvents.getById(eventId);
    
    if (!event) {
      return c.json(errorResponse('Event not found', 404), 404);
    }
    
    return c.json(successResponse(event));
  } catch (error) {
    console.error('Error fetching event:', error);
    return c.json(errorResponse('Failed to fetch event', 500), 500);
  }
});

// Create event
app.post("/make-server-fd8c4bf7/events", async (c) => {
  try {
    const body = await c.req.json();
    
    // Validate required fields
    if (!body.name) {
      return c.json(errorResponse('Event name is required', 400), 400);
    }

    const event = await dbEvents.create(body);
    
    return c.json(successResponse(event, 'Event created successfully'), 201);
  } catch (error) {
    console.error('Error creating event:', error);
    return c.json(errorResponse('Failed to create event', 500), 500);
  }
});

// Update event
app.put("/make-server-fd8c4bf7/events/:id", async (c) => {
  try {
    const eventId = c.req.param('id');
    const body = await c.req.json();
    
    const event = await dbEvents.update(eventId, body);
    
    if (!event) {
      return c.json(errorResponse('Event not found', 404), 404);
    }
    
    return c.json(successResponse(event, 'Event updated successfully'));
  } catch (error) {
    console.error('Error updating event:', error);
    return c.json(errorResponse('Failed to update event', 500), 500);
  }
});

// Delete event (soft delete)
app.delete("/make-server-fd8c4bf7/events/:id", async (c) => {
  try {
    const eventId = c.req.param('id');
    
    const deleted = await dbEvents.softDelete(eventId);
    
    if (!deleted) {
      return c.json(errorResponse('Event not found', 404), 404);
    }
    
    return c.json(successResponse(null, 'Event deleted successfully'));
  } catch (error) {
    console.error('Error deleting event:', error);
    return c.json(errorResponse('Failed to delete event', 500), 500);
  }
});

// ============================================================================
// RESTAURANTS ROUTES
// ============================================================================

// Get all restaurants (with filters)
app.get("/make-server-fd8c4bf7/restaurants", async (c) => {
  try {
    // Query Postgres (single source of truth - NO auto-seed)
    const search = c.req.query('search');
    const cuisine = c.req.query('cuisine');
    const area = c.req.query('area');
    const minRating = c.req.query('minRating');
    
    let restaurants;
    if (search) {
      restaurants = await dbRestaurants.search(search);
    } else {
      restaurants = await dbRestaurants.getAll({ 
        cuisine, 
        area,
        minRating: minRating ? parseFloat(minRating) : undefined
      });
    }
    
    return c.json(successResponse(restaurants));
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return c.json(errorResponse('Failed to fetch restaurants', 500), 500);
  }
});

// Get single restaurant
app.get("/make-server-fd8c4bf7/restaurants/:id", async (c) => {
  try {
    const restaurantId = c.req.param('id');
    const restaurant = await dbRestaurants.getById(restaurantId);
    
    if (!restaurant) {
      return c.json(errorResponse('Restaurant not found', 404), 404);
    }
    
    return c.json(successResponse(restaurant));
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return c.json(errorResponse('Failed to fetch restaurant', 500), 500);
  }
});

// Create restaurant
app.post("/make-server-fd8c4bf7/restaurants", async (c) => {
  try {
    const body = await c.req.json();
    
    // Validate required fields
    if (!body.name) {
      return c.json(errorResponse('Restaurant name is required', 400), 400);
    }

    const restaurant = await dbRestaurants.create(body);
    
    return c.json(successResponse(restaurant, 'Restaurant created successfully'), 201);
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return c.json(errorResponse('Failed to create restaurant', 500), 500);
  }
});

// Update restaurant
app.put("/make-server-fd8c4bf7/restaurants/:id", async (c) => {
  try {
    const restaurantId = c.req.param('id');
    const body = await c.req.json();
    
    const restaurant = await dbRestaurants.update(restaurantId, body);
    
    if (!restaurant) {
      return c.json(errorResponse('Restaurant not found', 404), 404);
    }
    
    return c.json(successResponse(restaurant, 'Restaurant updated successfully'));
  } catch (error) {
    console.error('Error updating restaurant:', error);
    return c.json(errorResponse('Failed to update restaurant', 500), 500);
  }
});

// Delete restaurant (soft delete)
app.delete("/make-server-fd8c4bf7/restaurants/:id", async (c) => {
  try {
    const restaurantId = c.req.param('id');
    
    const deleted = await dbRestaurants.softDelete(restaurantId);
    
    if (!deleted) {
      return c.json(errorResponse('Restaurant not found', 404), 404);
    }
    
    return c.json(successResponse(null, 'Restaurant deleted successfully'));
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    return c.json(errorResponse('Failed to delete restaurant', 500), 500);
  }
});

// ============================================================================
// RENTALS ROUTES
// ============================================================================

// Get all rentals (with filters)
app.get("/make-server-fd8c4bf7/rentals", async (c) => {
  try {
    // Query Postgres (single source of truth - NO auto-seed)
    const search = c.req.query('search');
    const rental_type = c.req.query('rental_type');
    const area = c.req.query('area');
    const maxPrice = c.req.query('maxPrice');
    
    let rentals;
    if (search) {
      rentals = await dbRentals.search(search);
    } else {
      rentals = await dbRentals.getAll({ 
        rental_type, 
        area,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined
      });
    }
    
    return c.json(successResponse(rentals));
  } catch (error) {
    console.error('Error fetching rentals:', error);
    return c.json(errorResponse('Failed to fetch rentals', 500), 500);
  }
});

// Get single rental
app.get("/make-server-fd8c4bf7/rentals/:id", async (c) => {
  try {
    const rentalId = c.req.param('id');
    const rental = await dbRentals.getById(rentalId);
    
    if (!rental) {
      return c.json(errorResponse('Rental not found', 404), 404);
    }
    
    return c.json(successResponse(rental));
  } catch (error) {
    console.error('Error fetching rental:', error);
    return c.json(errorResponse('Failed to fetch rental', 500), 500);
  }
});

// Create rental
app.post("/make-server-fd8c4bf7/rentals", async (c) => {
  try {
    const body = await c.req.json();
    
    // Validate required fields
    if (!body.name) {
      return c.json(errorResponse('Rental name is required', 400), 400);
    }

    const rental = await dbRentals.create(body);
    
    return c.json(successResponse(rental, 'Rental created successfully'), 201);
  } catch (error) {
    console.error('Error creating rental:', error);
    return c.json(errorResponse('Failed to create rental', 500), 500);
  }
});

// Update rental
app.put("/make-server-fd8c4bf7/rentals/:id", async (c) => {
  try {
    const rentalId = c.req.param('id');
    const body = await c.req.json();
    
    const rental = await dbRentals.update(rentalId, body);
    
    if (!rental) {
      return c.json(errorResponse('Rental not found', 404), 404);
    }
    
    return c.json(successResponse(rental, 'Rental updated successfully'));
  } catch (error) {
    console.error('Error updating rental:', error);
    return c.json(errorResponse('Failed to update rental', 500), 500);
  }
});

// Delete rental (soft delete)
app.delete("/make-server-fd8c4bf7/rentals/:id", async (c) => {
  try {
    const rentalId = c.req.param('id');
    
    const deleted = await dbRentals.softDelete(rentalId);
    
    if (!deleted) {
      return c.json(errorResponse('Rental not found', 404), 404);
    }
    
    return c.json(successResponse(null, 'Rental deleted successfully'));
  } catch (error) {
    console.error('Error deleting rental:', error);
    return c.json(errorResponse('Failed to delete rental', 500), 500);
  }
});

// ============================================================================
// UNIFIED SEARCH ROUTE
// ============================================================================

app.get("/make-server-fd8c4bf7/locations/search", async (c) => {
  try {
    const query = c.req.query('q');
    const category = c.req.query('category') as 'event' | 'restaurant' | 'rental' | undefined;
    
    if (!query) {
      return c.json(errorResponse('Query parameter is required', 400), 400);
    }

    // Search across all entity types using new services
    let results: any[] = [];
    
    if (category === 'event') {
      results = await dbEvents.search(query);
    } else if (category === 'restaurant') {
      results = await dbRestaurants.search(query);
    } else if (category === 'rental') {
      results = await dbRentals.search(query);
    } else {
      // Search across all categories
      const [events, restaurants, rentals] = await Promise.all([
        dbEvents.search(query),
        dbRestaurants.search(query),
        dbRentals.search(query),
      ]);
      results = [...events, ...restaurants, ...rentals];
    }
    
    return c.json(successResponse(results));
  } catch (error) {
    console.error('Error searching locations:', error);
    return c.json(errorResponse('Failed to search locations', 500), 500);
  }
});

// ============================================================================
// AI / SEARCH ROUTES (Placeholder - will be implemented in Phase 3)
// ============================================================================

// ============================================================================
// JOB QUEUE ROUTES - ASYNC OPERATIONS
// ============================================================================

// Create a new job
app.post("/make-server-fd8c4bf7/jobs", async (c) => {
  try {
    const userId = getUserId(c.req);
    const body = await c.req.json();
    
    const { type, input } = body;
    
    if (!type || !input) {
      return c.json(errorResponse('Type and input are required', 400), 400);
    }
    
    // Create job
    const job = await jobService.createJob(userId, { type, input });
    
    // Start processing in background (don't await)
    jobService.processJob(job.id).catch(error => {
      console.error(`Background job ${job.id} failed:`, error);
    });
    
    return c.json(successResponse(job, 'Job created and processing'), 201);
  } catch (error) {
    console.error('Error creating job:', error);
    return c.json(errorResponse('Failed to create job', 500), 500);
  }
});

// Get job status
app.get("/make-server-fd8c4bf7/jobs/:id", async (c) => {
  try {
    const jobId = c.req.param('id');
    const job = await jobService.getJob(jobId);
    
    if (!job) {
      return c.json(errorResponse('Job not found', 404), 404);
    }
    
    return c.json(successResponse(job));
  } catch (error) {
    console.error('Error fetching job:', error);
    return c.json(errorResponse('Failed to fetch job', 500), 500);
  }
});

// Get all jobs for user
app.get("/make-server-fd8c4bf7/jobs", async (c) => {
  try {
    const userId = getUserId(c.req);
    const jobs = await jobService.getUserJobs(userId);
    
    return c.json(successResponse(jobs));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return c.json(errorResponse('Failed to fetch jobs', 500), 500);
  }
});

// Cancel a job
app.post("/make-server-fd8c4bf7/jobs/:id/cancel", async (c) => {
  try {
    const jobId = c.req.param('id');
    const job = await jobService.cancelJob(jobId);
    
    if (!job) {
      return c.json(errorResponse('Job not found', 404), 404);
    }
    
    return c.json(successResponse(job, 'Job cancelled'));
  } catch (error) {
    console.error('Error cancelling job:', error);
    return c.json(errorResponse('Failed to cancel job', 500), 500);
  }
});

// Delete a job
app.delete("/make-server-fd8c4bf7/jobs/:id", async (c) => {
  try {
    const userId = getUserId(c.req);
    const jobId = c.req.param('id');
    
    await jobService.deleteJob(userId, jobId);
    
    return c.json(successResponse(null, 'Job deleted'));
  } catch (error) {
    console.error('Error deleting job:', error);
    return c.json(errorResponse('Failed to delete job', 500), 500);
  }
});

// Cleanup expired jobs (cron endpoint)
app.post("/make-server-fd8c4bf7/jobs/cleanup", async (c) => {
  try {
    const cleaned = await jobService.cleanupExpiredJobs();
    
    return c.json(successResponse({ cleaned }, `Cleaned up ${cleaned} jobs`));
  } catch (error) {
    console.error('Error cleaning up jobs:', error);
    return c.json(errorResponse('Failed to cleanup jobs', 500), 500);
  }
});

// ============================================================================
// AI / SEARCH ROUTES
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