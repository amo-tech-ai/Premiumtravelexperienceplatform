/**
 * Server API Client
 * 
 * Utility functions for calling the Supabase Edge Function server
 */

import { projectId, publicAnonKey } from '../../utils/supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-fd8c4bf7`;

/**
 * Standard response from server
 */
interface ServerResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

/**
 * Server error response
 */
interface ServerError {
  error: string;
  status: number;
  timestamp: string;
}

/**
 * Generic GET request to server
 */
export async function serverGet<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  
  // Add query parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData: ServerError = await response.json();
    throw new Error(errorData.error || `Server error: ${response.status}`);
  }

  const result: ServerResponse<T> = await response.json();
  return result.data;
}

/**
 * Generic POST request to server
 */
export async function serverPost<T>(
  endpoint: string,
  body: any
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData: ServerError = await response.json();
    throw new Error(errorData.error || `Server error: ${response.status}`);
  }

  const result: ServerResponse<T> = await response.json();
  return result.data;
}

/**
 * Generic PUT request to server
 */
export async function serverPut<T>(
  endpoint: string,
  body: any
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData: ServerError = await response.json();
    throw new Error(errorData.error || `Server error: ${response.status}`);
  }

  const result: ServerResponse<T> = await response.json();
  return result.data;
}

/**
 * Generic DELETE request to server
 */
export async function serverDelete(endpoint: string): Promise<void> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData: ServerError = await response.json();
    throw new Error(errorData.error || `Server error: ${response.status}`);
  }
}
