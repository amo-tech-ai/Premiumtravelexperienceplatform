/**
 * EXPLORATION ROUTE UTILITIES
 * 
 * Utilities for parsing and generating /explore route parameters.
 * Handles the URL contract: /explore?source=ai&intent=restaurants&area=...
 * 
 * @see /docs/01-ai-features/02-context-state-contract.md
 */

import {
  ExplorationSource,
  ExplorationIntent,
  SearchRadius,
  ExploreRouteParams,
  isValidSource,
  isValidIntent,
} from '../types/ExplorationTypes';

/**
 * Parse URL search params into ExploreRouteParams
 */
export function parseExploreParams(searchParams: URLSearchParams): ExploreRouteParams {
  const params: ExploreRouteParams = {};

  // Source
  const source = searchParams.get('source');
  if (source && isValidSource(source)) {
    params.source = source;
  }

  // Intent
  const intent = searchParams.get('intent');
  if (intent && isValidIntent(intent)) {
    params.intent = intent;
  }

  // Area (URL-encoded location name)
  const area = searchParams.get('area');
  if (area) {
    params.area = decodeURIComponent(area);
  }

  // Context ID
  const contextId = searchParams.get('contextId');
  if (contextId) {
    params.contextId = contextId;
  }

  // Latitude
  const lat = searchParams.get('lat');
  if (lat) {
    params.lat = lat;
  }

  // Longitude
  const lng = searchParams.get('lng');
  if (lng) {
    params.lng = lng;
  }

  // Radius
  const radius = searchParams.get('radius');
  if (radius) {
    params.radius = radius as SearchRadius;
  }

  return params;
}

/**
 * Build URL search params from ExploreRouteParams
 */
export function buildExploreParams(params: ExploreRouteParams): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (params.source) {
    searchParams.set('source', params.source);
  }

  if (params.intent) {
    searchParams.set('intent', params.intent);
  }

  if (params.area) {
    searchParams.set('area', encodeURIComponent(params.area));
  }

  if (params.contextId) {
    searchParams.set('contextId', params.contextId);
  }

  if (params.lat) {
    searchParams.set('lat', params.lat);
  }

  if (params.lng) {
    searchParams.set('lng', params.lng);
  }

  if (params.radius) {
    searchParams.set('radius', params.radius);
  }

  return searchParams;
}

/**
 * Build full /explore URL with params
 */
export function buildExploreUrl(params: ExploreRouteParams): string {
  const searchParams = buildExploreParams(params);
  const query = searchParams.toString();
  return query ? `/explore?${query}` : '/explore';
}

/**
 * Navigate to /explore with params (React Router v6)
 */
export function navigateToExplore(
  navigate: (to: string) => void,
  params: ExploreRouteParams
): void {
  const url = buildExploreUrl(params);
  navigate(url);
}

/**
 * Get current explore params from window.location
 */
export function getCurrentExploreParams(): ExploreRouteParams {
  if (typeof window === 'undefined') {
    return {};
  }

  const searchParams = new URLSearchParams(window.location.search);
  return parseExploreParams(searchParams);
}

/**
 * Check if current route is /explore
 */
export function isExplorePage(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.location.pathname === '/explore';
}

/**
 * Default route params (used when params are missing)
 */
export const DEFAULT_EXPLORE_PARAMS: Required<ExploreRouteParams> = {
  source: 'manual',
  intent: 'restaurants',
  area: 'Current Location',
  contextId: '',
  lat: '0',
  lng: '0',
  radius: 'short_drive',
};

/**
 * Validate explore route params
 */
export function validateExploreParams(params: ExploreRouteParams): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Source validation
  if (params.source && !isValidSource(params.source)) {
    errors.push(`Invalid source: ${params.source}`);
  }

  // Intent validation
  if (params.intent && !isValidIntent(params.intent)) {
    errors.push(`Invalid intent: ${params.intent}`);
  }

  // Lat/Lng validation
  if (params.lat) {
    const lat = parseFloat(params.lat);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.push(`Invalid latitude: ${params.lat}`);
    }
  }

  if (params.lng) {
    const lng = parseFloat(params.lng);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.push(`Invalid longitude: ${params.lng}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Apply defaults to partial params
 */
export function applyDefaultParams(params: ExploreRouteParams): Required<ExploreRouteParams> {
  return {
    source: params.source || DEFAULT_EXPLORE_PARAMS.source,
    intent: params.intent || DEFAULT_EXPLORE_PARAMS.intent,
    area: params.area || DEFAULT_EXPLORE_PARAMS.area,
    contextId: params.contextId || '',
    lat: params.lat || DEFAULT_EXPLORE_PARAMS.lat,
    lng: params.lng || DEFAULT_EXPLORE_PARAMS.lng,
    radius: params.radius || DEFAULT_EXPLORE_PARAMS.radius,
  };
}

/**
 * Example usage:
 * 
 * // In Chat component - navigate to Explore with AI context
 * const handleViewAll = () => {
 *   navigateToExplore(navigate, {
 *     source: 'ai',
 *     intent: 'restaurants',
 *     area: 'el-poblado-medellin',
 *     contextId: context.id
 *   });
 * };
 * 
 * // In Explore component - parse URL params
 * const searchParams = useSearchParams()[0];
 * const params = parseExploreParams(searchParams);
 * 
 * // Load context if contextId provided
 * if (params.contextId) {
 *   const { context } = useExplorationContext({ contextId: params.contextId });
 * }
 */
