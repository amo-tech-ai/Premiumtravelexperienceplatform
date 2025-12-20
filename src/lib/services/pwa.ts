/**
 * PWA (Progressive Web App) Service
 * Installation, offline support, and app-like features
 */

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAInstallState {
  canInstall: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  platform: 'ios' | 'android' | 'desktop' | 'unknown';
}

// --- PWA SERVICE ---

export class PWAService {
  private installPrompt: BeforeInstallPromptEvent | null = null;
  private listeners: Set<(state: PWAInstallState) => void> = new Set();

  constructor() {
    this.init();
  }

  /**
   * Initialize PWA features
   */
  private init(): void {
    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.installPrompt = e as BeforeInstallPromptEvent;
      this.notifyListeners();
    });

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      console.log('PWA installed successfully');
      this.installPrompt = null;
      this.notifyListeners();
    });
  }

  /**
   * Get current PWA state
   */
  getState(): PWAInstallState {
    return {
      canInstall: this.installPrompt !== null,
      isInstalled: this.isInstalled(),
      isStandalone: this.isStandalone(),
      platform: this.getPlatform(),
    };
  }

  /**
   * Check if app is installed
   */
  private isInstalled(): boolean {
    // Check if running in standalone mode
    if (this.isStandalone()) {
      return true;
    }

    // Check if install prompt has been shown and dismissed
    return !this.installPrompt && !this.isStandalone();
  }

  /**
   * Check if app is running in standalone mode
   */
  private isStandalone(): boolean {
    // Check various standalone indicators
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return true;
    }

    // iOS
    if ((window.navigator as any).standalone === true) {
      return true;
    }

    // Android
    if (document.referrer.includes('android-app://')) {
      return true;
    }

    return false;
  }

  /**
   * Detect platform
   */
  private getPlatform(): 'ios' | 'android' | 'desktop' | 'unknown' {
    const userAgent = window.navigator.userAgent.toLowerCase();

    if (/iphone|ipad|ipod/.test(userAgent)) {
      return 'ios';
    }

    if (/android/.test(userAgent)) {
      return 'android';
    }

    if (/windows|macintosh|linux/.test(userAgent)) {
      return 'desktop';
    }

    return 'unknown';
  }

  /**
   * Prompt user to install app
   */
  async promptInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
    if (!this.installPrompt) {
      return 'unavailable';
    }

    try {
      await this.installPrompt.prompt();
      const choice = await this.installPrompt.userChoice;
      
      if (choice.outcome === 'accepted') {
        console.log('User accepted install');
      } else {
        console.log('User dismissed install');
      }

      this.installPrompt = null;
      this.notifyListeners();

      return choice.outcome;
    } catch (error) {
      console.error('Install prompt error:', error);
      return 'unavailable';
    }
  }

  /**
   * Get iOS install instructions
   */
  getIOSInstructions(): string[] {
    return [
      'Tap the Share button in Safari',
      'Scroll down and tap "Add to Home Screen"',
      'Tap "Add" in the top right corner',
    ];
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: PWAInstallState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify listeners of state change
   */
  private notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }
}

// --- SERVICE WORKER REGISTRATION ---

/**
 * Register service worker for offline support
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    console.log('Service workers not supported in this environment');
    return null;
  }

  // Check if we're in a secure context (required for service workers)
  if (!window.isSecureContext) {
    console.log('Service workers require a secure context (HTTPS)');
    return null;
  }

  // Don't register service workers in Figma's iframe environment
  if (window.location.hostname.includes('figma')) {
    console.log('Service worker disabled in Figma environment');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
    });

    console.log('Service worker registered:', registration);

    // Check for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            console.log('New service worker available');
            
            // Notify user about update
            if (window.confirm('A new version is available. Reload to update?')) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
            }
          }
        });
      }
    });

    return registration;
  } catch (error: any) {
    // Log detailed error information but don't throw
    if (error?.message?.includes('MIME type')) {
      console.log('Service worker file not found or incorrect MIME type - this is expected in development/preview environments');
    } else if (error?.name === 'SecurityError') {
      console.log('Service worker registration blocked by security policy - this is expected in some hosting environments');
    } else {
      console.warn('Service worker registration failed:', error?.message || error);
    }
    return null;
  }
}

/**
 * Unregister service worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const success = await registration.unregister();
    console.log('Service worker unregistered:', success);
    return success;
  } catch (error) {
    console.error('Service worker unregistration failed:', error);
    return false;
  }
}

// --- OFFLINE DETECTION ---

/**
 * Check if user is online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Listen for online/offline events
 */
export function onConnectivityChange(
  callback: (online: boolean) => void
): () => void {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Call immediately with current state
  callback(isOnline());

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

// --- CACHE MANAGEMENT ---

/**
 * Get cache size estimate
 */
export async function getCacheSize(): Promise<{ usage: number; quota: number } | null> {
  if (!('storage' in navigator) || !('estimate' in navigator.storage)) {
    return null;
  }

  try {
    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage || 0,
      quota: estimate.quota || 0,
    };
  } catch (error) {
    console.error('Failed to get cache size:', error);
    return null;
  }
}

/**
 * Clear all caches
 */
export async function clearAllCaches(): Promise<boolean> {
  if (!('caches' in window)) {
    return false;
  }

  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((name) => caches.delete(name)));
    console.log('All caches cleared');
    return true;
  } catch (error) {
    console.error('Failed to clear caches:', error);
    return false;
  }
}

// --- SINGLETON ---

let pwaService: PWAService | null = null;

export function getPWAService(): PWAService {
  if (!pwaService) {
    pwaService = new PWAService();
  }
  return pwaService;
}

// --- EXPORTS ---

export default PWAService;