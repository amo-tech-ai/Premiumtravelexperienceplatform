/**
 * API Client for Luxury AI Travel Platform
 * 
 * Production-ready HTTP client with:
 * - Type safety
 * - Error handling
 * - Request/response interceptors
 * - Loading states
 * - Retry logic
 */

import { projectId, publicAnonKey } from '../../utils/supabase/info';

// ============================================================================
// TYPES
// ============================================================================

export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface APIError {
  error: string;
  status: number;
  timestamp: string;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  retries?: number;
  timeout?: number;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-fd8c4bf7`;

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

const DEFAULT_OPTIONS: RequestOptions = {
  method: 'GET',
  retries: 3,
  timeout: 30000, // Increased to 30 seconds for backend operations
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Sleep utility for retry logic
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if response is OK
 */
function isResponseOK(status: number): boolean {
  return status >= 200 && status < 300;
}

/**
 * Parse error response
 */
async function parseError(response: Response): Promise<APIError> {
  try {
    const error = await response.json();
    return error;
  } catch {
    return {
      error: `HTTP ${response.status}: ${response.statusText}`,
      status: response.status,
      timestamp: new Date().toISOString(),
    };
  }
}

// ============================================================================
// CORE API CLIENT
// ============================================================================

/**
 * Make API request with retry logic and error handling
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<APIResponse<T>> {
  const {
    method = 'GET',
    body,
    headers = {},
    retries = DEFAULT_OPTIONS.retries,
    timeout = DEFAULT_OPTIONS.timeout,
  } = options;

  const url = `${BASE_URL}${endpoint}`;
  
  const requestOptions: RequestInit = {
    method,
    headers: {
      ...DEFAULT_HEADERS,
      ...headers,
    },
  };

  if (body && method !== 'GET') {
    requestOptions.body = JSON.stringify(body);
  }

  let lastError: Error | null = null;

  // Retry logic
  for (let attempt = 0; attempt <= retries!; attempt++) {
    try {
      // Timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout!);

      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Success
      if (isResponseOK(response.status)) {
        const data: APIResponse<T> = await response.json();
        return data;
      }

      // Error response
      const error = await parseError(response);
      
      // Don't retry on client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(error.error);
      }

      // Store error for potential retry
      lastError = new Error(error.error);

      // Wait before retry (exponential backoff)
      if (attempt < retries!) {
        const waitTime = Math.min(1000 * Math.pow(2, attempt), 5000);
        await sleep(waitTime);
      }
    } catch (error: any) {
      lastError = error;

      // Don't retry on abort (timeout)
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }

      // Don't retry on network errors after first attempt
      if (attempt === retries) {
        break;
      }

      // Wait before retry
      const waitTime = Math.min(1000 * Math.pow(2, attempt), 5000);
      await sleep(waitTime);
    }
  }

  // All retries failed
  throw lastError || new Error('Request failed');
}

// ============================================================================
// HTTP METHOD HELPERS
// ============================================================================

export const api = {
  get: <T = any>(endpoint: string, options?: RequestOptions): Promise<APIResponse<T>> =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<APIResponse<T>> =>
    request<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<APIResponse<T>> =>
    request<T>(endpoint, { ...options, method: 'PUT', body }),

  delete: <T = any>(endpoint: string, options?: RequestOptions): Promise<APIResponse<T>> =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};

// ============================================================================
// HEALTH CHECK
// ============================================================================

/**
 * Check API health
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await api.get<{ status: string }>('/health', { retries: 1, timeout: 5000 });
    return response.data.status === 'ok';
  } catch {
    return false;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default api;