/**
 * EXPLORATION CONTEXT STORAGE
 * 
 * SessionStorage-based persistence for exploration contexts.
 * Contexts expire after 2 hours and are automatically cleaned up.
 * 
 * @see /docs/01-ai-features/02-context-state-contract.md
 */

import {
  ExplorationContext,
  ExplorationContextStorage,
  EXPLORATION_DEFAULTS,
  isContextExpired,
  isExplorationContext,
} from '../types/ExplorationTypes';

/**
 * Storage implementation using SessionStorage
 * 
 * Why SessionStorage vs localStorage?
 * - Contexts are temporary (2 hour lifetime)
 * - Don't need to persist across browser sessions
 * - Automatically cleared when tab closes
 * - More appropriate for ephemeral exploration state
 */
class ExplorationContextStorageImpl implements ExplorationContextStorage {
  private readonly storageKeyPrefix = EXPLORATION_DEFAULTS.STORAGE_KEY_PREFIX;
  private readonly latestKey = EXPLORATION_DEFAULTS.LATEST_CONTEXT_KEY;

  /**
   * Store a context
   */
  set(context: ExplorationContext): void {
    try {
      const key = this.getKey(context.id);
      
      // Serialize dates properly
      const serialized = JSON.stringify(context, (key, value) => {
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      });
      
      sessionStorage.setItem(key, serialized);
      
      // Update latest pointer
      sessionStorage.setItem(this.latestKey, context.id);
      
      // Cleanup expired contexts
      this.cleanup();
    } catch (error) {
      console.error('[ExplorationStorage] Failed to store context:', error);
      // Don't throw - graceful degradation
    }
  }

  /**
   * Retrieve a context by ID
   */
  get(id: string): ExplorationContext | null {
    try {
      const key = this.getKey(id);
      const serialized = sessionStorage.getItem(key);
      
      if (!serialized) {
        return null;
      }
      
      const parsed = JSON.parse(serialized, (key, value) => {
        // Deserialize dates
        if (key === 'createdAt' || key === 'expiresAt') {
          return new Date(value);
        }
        if (key === 'specificDate') {
          return value ? new Date(value) : undefined;
        }
        if (key === 'dateRange' && value) {
          return {
            start: new Date(value.start),
            end: new Date(value.end),
          };
        }
        return value;
      });
      
      // Validate structure
      if (!isExplorationContext(parsed)) {
        console.warn('[ExplorationStorage] Invalid context structure:', id);
        this.delete(id);
        return null;
      }
      
      // Check expiration
      if (isContextExpired(parsed)) {
        console.info('[ExplorationStorage] Context expired:', id);
        this.delete(id);
        return null;
      }
      
      return parsed;
    } catch (error) {
      console.error('[ExplorationStorage] Failed to retrieve context:', error);
      return null;
    }
  }

  /**
   * Get the most recently created context
   */
  getLatest(): ExplorationContext | null {
    try {
      const latestId = sessionStorage.getItem(this.latestKey);
      
      if (!latestId) {
        return null;
      }
      
      return this.get(latestId);
    } catch (error) {
      console.error('[ExplorationStorage] Failed to get latest context:', error);
      return null;
    }
  }

  /**
   * Delete a specific context
   */
  delete(id: string): void {
    try {
      const key = this.getKey(id);
      sessionStorage.removeItem(key);
      
      // If this was the latest, clear that too
      const latestId = sessionStorage.getItem(this.latestKey);
      if (latestId === id) {
        sessionStorage.removeItem(this.latestKey);
      }
    } catch (error) {
      console.error('[ExplorationStorage] Failed to delete context:', error);
    }
  }

  /**
   * Clear all exploration contexts
   */
  clear(): void {
    try {
      const keys = this.getAllKeys();
      keys.forEach(key => sessionStorage.removeItem(key));
      sessionStorage.removeItem(this.latestKey);
    } catch (error) {
      console.error('[ExplorationStorage] Failed to clear contexts:', error);
    }
  }

  /**
   * Remove expired contexts
   */
  cleanup(): void {
    try {
      const keys = this.getAllKeys();
      let cleanedCount = 0;
      
      keys.forEach(key => {
        try {
          const serialized = sessionStorage.getItem(key);
          if (!serialized) return;
          
          const parsed = JSON.parse(serialized);
          if (parsed.expiresAt && new Date(parsed.expiresAt) < new Date()) {
            sessionStorage.removeItem(key);
            cleanedCount++;
          }
        } catch (error) {
          // If can't parse, remove it
          sessionStorage.removeItem(key);
          cleanedCount++;
        }
      });
      
      if (cleanedCount > 0) {
        console.info(`[ExplorationStorage] Cleaned up ${cleanedCount} expired contexts`);
      }
    } catch (error) {
      console.error('[ExplorationStorage] Cleanup failed:', error);
    }
  }

  /**
   * Get all exploration context keys
   */
  private getAllKeys(): string[] {
    const keys: string[] = [];
    
    try {
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith(this.storageKeyPrefix)) {
          keys.push(key);
        }
      }
    } catch (error) {
      console.error('[ExplorationStorage] Failed to get keys:', error);
    }
    
    return keys;
  }

  /**
   * Get storage key for context ID
   */
  private getKey(id: string): string {
    return `${this.storageKeyPrefix}${id}`;
  }

  /**
   * Get all stored contexts (for debugging)
   */
  getAll(): ExplorationContext[] {
    const contexts: ExplorationContext[] = [];
    
    try {
      const keys = this.getAllKeys();
      keys.forEach(key => {
        const id = key.replace(this.storageKeyPrefix, '');
        const context = this.get(id);
        if (context) {
          contexts.push(context);
        }
      });
    } catch (error) {
      console.error('[ExplorationStorage] Failed to get all contexts:', error);
    }
    
    return contexts;
  }

  /**
   * Get storage info (for debugging)
   */
  getStorageInfo(): {
    totalContexts: number;
    expiredContexts: number;
    latestContextId: string | null;
    storageSize: number;
  } {
    const keys = this.getAllKeys();
    let expiredCount = 0;
    let totalSize = 0;
    
    keys.forEach(key => {
      try {
        const serialized = sessionStorage.getItem(key);
        if (serialized) {
          totalSize += serialized.length;
          const parsed = JSON.parse(serialized);
          if (parsed.expiresAt && new Date(parsed.expiresAt) < new Date()) {
            expiredCount++;
          }
        }
      } catch (error) {
        // Skip
      }
    });
    
    return {
      totalContexts: keys.length,
      expiredContexts: expiredCount,
      latestContextId: sessionStorage.getItem(this.latestKey),
      storageSize: totalSize,
    };
  }
}

/**
 * Singleton instance
 */
export const explorationStorage = new ExplorationContextStorageImpl();

/**
 * Storage utilities
 */
export const ExplorationStorageUtils = {
  /**
   * Debug: Log all stored contexts
   */
  debugPrintAll(): void {
    console.group('[ExplorationStorage] All Contexts');
    const contexts = explorationStorage.getAll();
    contexts.forEach(ctx => {
      console.log({
        id: ctx.id,
        source: ctx.source,
        intent: ctx.intent,
        area: ctx.area.name,
        createdAt: ctx.createdAt,
        expiresAt: ctx.expiresAt,
        primaryResults: ctx.primaryResults.length,
        isExpired: isContextExpired(ctx),
      });
    });
    console.groupEnd();
  },

  /**
   * Debug: Log storage info
   */
  debugPrintInfo(): void {
    const info = explorationStorage.getStorageInfo();
    console.group('[ExplorationStorage] Storage Info');
    console.log('Total contexts:', info.totalContexts);
    console.log('Expired contexts:', info.expiredContexts);
    console.log('Latest context ID:', info.latestContextId);
    console.log('Storage size:', `${Math.round(info.storageSize / 1024)}KB`);
    console.groupEnd();
  },

  /**
   * Force cleanup expired contexts
   */
  forceCleanup(): void {
    explorationStorage.cleanup();
  },

  /**
   * Clear all contexts
   */
  clearAll(): void {
    if (confirm('Clear all exploration contexts?')) {
      explorationStorage.clear();
      console.log('[ExplorationStorage] All contexts cleared');
    }
  },
};

/**
 * Make debug utils available in browser console
 */
if (typeof window !== 'undefined') {
  (window as any).__explorationStorageDebug = ExplorationStorageUtils;
}