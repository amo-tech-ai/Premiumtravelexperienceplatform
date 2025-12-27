/**
 * Service Worker Registration
 * PWA support for offline capabilities and caching
 */

/**
 * Register service worker
 * Gracefully fails in environments that don't support service workers
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  // Check if service workers are supported
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    // For now, we don't have a service worker file yet
    // This is a stub that will be implemented when PWA functionality is needed
    return null;
  } catch (error) {
    // Silent fail - service worker is optional
    console.warn('Service worker registration failed:', error);
    return null;
  }
}

/**
 * Unregister service worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.unregister();
  } catch (error) {
    console.warn('Service worker unregistration failed:', error);
    return false;
  }
}
