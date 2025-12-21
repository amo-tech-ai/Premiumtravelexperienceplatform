/**
 * Saved Places API Service
 * 
 * Production-ready service for saved places with:
 * - CRUD operations
 * - Collection management
 * - Type safety
 */

import api from './client';
import type {
  SavedPlace,
  Collection,
  SavePlaceRequest,
  CreateCollectionRequest,
} from './types';

// ============================================================================
// SAVED PLACES
// ============================================================================

/**
 * Get all saved places for current user
 */
export async function getSavedPlaces(): Promise<SavedPlace[]> {
  const response = await api.get<SavedPlace[]>('/saved');
  return response.data;
}

/**
 * Save a place
 */
export async function savePlace(data: SavePlaceRequest): Promise<SavedPlace> {
  const response = await api.post<SavedPlace>('/saved', data);
  return response.data;
}

/**
 * Unsave a place
 */
export async function unsavePlace(placeId: string): Promise<void> {
  await api.delete(`/saved/${placeId}`);
}

/**
 * Check if place is saved
 */
export async function isPlaceSaved(placeId: string): Promise<boolean> {
  try {
    const places = await getSavedPlaces();
    return places.some((p) => p.place_id === placeId);
  } catch {
    return false;
  }
}

// ============================================================================
// COLLECTIONS
// ============================================================================

/**
 * Get all collections for current user
 */
export async function getCollections(): Promise<Collection[]> {
  const response = await api.get<Collection[]>('/collections');
  return response.data;
}

/**
 * Create new collection
 */
export async function createCollection(
  data: CreateCollectionRequest
): Promise<Collection> {
  const response = await api.post<Collection>('/collections', data);
  return response.data;
}

/**
 * Add place to collection
 */
export async function addPlaceToCollection(
  collectionId: string,
  placeId: string
): Promise<Collection> {
  const response = await api.post<Collection>(
    `/collections/${collectionId}/places/${placeId}`
  );
  return response.data;
}

/**
 * Get saved places by category
 */
export function groupPlacesByCategory(
  places: SavedPlace[]
): Map<string, SavedPlace[]> {
  const grouped = new Map<string, SavedPlace[]>();

  places.forEach((place) => {
    const category = place.category || 'Uncategorized';
    const categoryPlaces = grouped.get(category) || [];
    categoryPlaces.push(place);
    grouped.set(category, categoryPlaces);
  });

  return grouped;
}

/**
 * Get saved places by collection
 */
export async function getPlacesByCollection(
  collectionId: string
): Promise<SavedPlace[]> {
  const places = await getSavedPlaces();
  return places.filter((p) => p.collections?.includes(collectionId));
}

/**
 * Search saved places
 */
export function searchSavedPlaces(
  places: SavedPlace[],
  query: string
): SavedPlace[] {
  const lowerQuery = query.toLowerCase();
  
  return places.filter(
    (place) =>
      place.title.toLowerCase().includes(lowerQuery) ||
      place.description?.toLowerCase().includes(lowerQuery) ||
      place.category?.toLowerCase().includes(lowerQuery) ||
      place.location?.address.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Filter saved places by rating
 */
export function filterPlacesByRating(
  places: SavedPlace[],
  minRating: number
): SavedPlace[] {
  return places.filter((place) => (place.rating || 0) >= minRating);
}

/**
 * Filter saved places by price level
 */
export function filterPlacesByPriceLevel(
  places: SavedPlace[],
  maxPriceLevel: number
): SavedPlace[] {
  return places.filter((place) => (place.price_level || 0) <= maxPriceLevel);
}

/**
 * Sort saved places
 */
export function sortSavedPlaces(
  places: SavedPlace[],
  sortBy: 'title' | 'rating' | 'saved_at' = 'saved_at'
): SavedPlace[] {
  const sorted = [...places];

  switch (sortBy) {
    case 'title':
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'rating':
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'saved_at':
      sorted.sort(
        (a, b) =>
          new Date(b.saved_at).getTime() - new Date(a.saved_at).getTime()
      );
      break;
  }

  return sorted;
}
