/**
 * Service Worker for Local Scout PWA
 * Handles offline caching and background sync
 */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `local-scout-${CACHE_VERSION}`;

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache first, then network (for static assets)
  CACHE_FIRST: 'cache-first',
  // Network first, then cache (for API calls)
  NETWORK_FIRST: 'network-first',
  // Network only (for real-time data)
  NETWORK_ONLY: 'network-only',
  // Cache only (for offline fallback)
  CACHE_ONLY: 'cache-only',
};

// --- INSTALL EVENT ---

self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching assets');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );

  // Activate immediately
  self.skipWaiting();
});

// --- ACTIVATE EVENT ---

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Take control immediately
  self.clients.claim();
});

// --- FETCH EVENT ---

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Determine caching strategy based on URL
  const strategy = getStrategyForURL(url);

  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      event.respondWith(cacheFirst(request));
      break;

    case CACHE_STRATEGIES.NETWORK_FIRST:
      event.respondWith(networkFirst(request));
      break;

    case CACHE_STRATEGIES.NETWORK_ONLY:
      event.respondWith(fetch(request));
      break;

    case CACHE_STRATEGIES.CACHE_ONLY:
      event.respondWith(caches.match(request));
      break;

    default:
      event.respondWith(networkFirst(request));
  }
});

// --- CACHING STRATEGIES ---

/**
 * Cache first, fallback to network
 */
async function cacheFirst(request) {
  const cached = await caches.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.error('[SW] Fetch failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Network first, fallback to cache
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);

    const cached = await caches.match(request);

    if (cached) {
      return cached;
    }

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlinePage = await caches.match('/offline.html');
      if (offlinePage) {
        return offlinePage;
      }
    }

    return new Response('Offline', { status: 503 });
  }
}

/**
 * Determine caching strategy for a URL
 */
function getStrategyForURL(url) {
  // Same-origin requests
  if (url.origin === location.origin) {
    // HTML pages - network first
    if (url.pathname.endsWith('.html') || url.pathname === '/' || !url.pathname.includes('.')) {
      return CACHE_STRATEGIES.NETWORK_FIRST;
    }

    // Static assets - cache first
    if (
      url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/i)
    ) {
      return CACHE_STRATEGIES.CACHE_FIRST;
    }

    // API calls - network first
    if (url.pathname.startsWith('/api/')) {
      return CACHE_STRATEGIES.NETWORK_FIRST;
    }

    return CACHE_STRATEGIES.NETWORK_FIRST;
  }

  // External APIs
  if (url.hostname.includes('googleapis.com') || url.hostname.includes('generativelanguage')) {
    return CACHE_STRATEGIES.NETWORK_ONLY;
  }

  // External images (Unsplash, etc.)
  if (url.hostname.includes('unsplash') || url.hostname.includes('images')) {
    return CACHE_STRATEGIES.CACHE_FIRST;
  }

  // Default to network first
  return CACHE_STRATEGIES.NETWORK_FIRST;
}

// --- BACKGROUND SYNC ---

self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'sync-trips') {
    event.waitUntil(syncTrips());
  }
});

async function syncTrips() {
  console.log('[SW] Syncing trips...');

  // Get pending changes from IndexedDB
  // In production, this would sync with backend

  try {
    // Placeholder for sync logic
    console.log('[SW] Trips synced successfully');
  } catch (error) {
    console.error('[SW] Sync failed:', error);
    throw error; // Retry later
  }
}

// --- PUSH NOTIFICATIONS ---

self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');

  const data = event.data ? event.data.json() : {};

  const options = {
    body: data.body || 'New notification from Local Scout',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [200, 100, 200],
    data: data.url || '/',
    actions: [
      {
        action: 'open',
        title: 'Open',
      },
      {
        action: 'close',
        title: 'Dismiss',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Local Scout', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data || '/')
    );
  }
});

// --- MESSAGES ---

self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});

console.log('[SW] Service worker loaded');
