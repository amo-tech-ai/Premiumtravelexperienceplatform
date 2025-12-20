/**
 * Distance Calculation Utilities
 * Uses Haversine formula for accurate Earth surface distance
 */

/**
 * Calculate distance between two coordinates using Haversine formula
 * Accounts for Earth's curvature for accurate results
 * 
 * @param lat1 - Latitude of first point (degrees)
 * @param lng1 - Longitude of first point (degrees)
 * @param lat2 - Latitude of second point (degrees)
 * @param lng2 - Longitude of second point (degrees)
 * @returns Distance in kilometers
 * 
 * @example
 * // New York to Los Angeles
 * calculateDistance(40.7128, -74.0060, 34.0522, -118.2437)
 * // Returns: 3944 km
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  // Validate inputs
  if (!isValidCoordinate(lat1, lng1) || !isValidCoordinate(lat2, lng2)) {
    console.warn('Invalid coordinates provided to calculateDistance');
    return 0;
  }

  // Earth's radius in kilometers
  const R = 6371;

  // Convert degrees to radians
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Validate if coordinates are valid
 */
function isValidCoordinate(lat: number, lng: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

/**
 * Calculate total distance for a route (series of points)
 * 
 * @param points - Array of coordinates [lat, lng]
 * @returns Total distance in kilometers
 * 
 * @example
 * calculateRouteDistance([
 *   [40.7128, -74.0060], // New York
 *   [41.8781, -87.6298], // Chicago
 *   [34.0522, -118.2437] // Los Angeles
 * ])
 */
export function calculateRouteDistance(points: [number, number][]): number {
  if (points.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const [lat1, lng1] = points[i];
    const [lat2, lng2] = points[i + 1];
    totalDistance += calculateDistance(lat1, lng1, lat2, lng2);
  }

  return Math.round(totalDistance * 10) / 10;
}

/**
 * Find the nearest location from a reference point
 * 
 * @param refLat - Reference latitude
 * @param refLng - Reference longitude
 * @param locations - Array of locations with lat/lng
 * @returns Nearest location with distance
 */
export function findNearest<T extends { location_lat: number; location_lng: number }>(
  refLat: number,
  refLng: number,
  locations: T[]
): { location: T; distance: number } | null {
  if (locations.length === 0) return null;

  let nearest = locations[0];
  let minDistance = calculateDistance(
    refLat,
    refLng,
    nearest.location_lat,
    nearest.location_lng
  );

  for (let i = 1; i < locations.length; i++) {
    const loc = locations[i];
    const distance = calculateDistance(
      refLat,
      refLng,
      loc.location_lat,
      loc.location_lng
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = loc;
    }
  }

  return { location: nearest, distance: minDistance };
}

/**
 * Group locations by proximity
 * Clusters locations that are within threshold distance of each other
 * 
 * @param locations - Array of locations with lat/lng
 * @param thresholdKm - Maximum distance for grouping (default: 2km)
 * @returns Array of location clusters
 */
export function clusterByProximity<T extends { id: string; location_lat: number; location_lng: number }>(
  locations: T[],
  thresholdKm: number = 2
): T[][] {
  if (locations.length === 0) return [];

  const clusters: T[][] = [];
  const visited = new Set<string>();

  for (const loc of locations) {
    if (visited.has(loc.id)) continue;

    const cluster: T[] = [loc];
    visited.add(loc.id);

    // Find all nearby locations
    for (const otherLoc of locations) {
      if (visited.has(otherLoc.id)) continue;

      const distance = calculateDistance(
        loc.location_lat,
        loc.location_lng,
        otherLoc.location_lat,
        otherLoc.location_lng
      );

      if (distance <= thresholdKm) {
        cluster.push(otherLoc);
        visited.add(otherLoc.id);
      }
    }

    clusters.push(cluster);
  }

  return clusters;
}

/**
 * Sort locations by proximity to a reference point
 * Useful for "nearest first" sorting
 */
export function sortByProximity<T extends { location_lat: number; location_lng: number }>(
  refLat: number,
  refLng: number,
  locations: T[]
): T[] {
  return [...locations].sort((a, b) => {
    const distA = calculateDistance(refLat, refLng, a.location_lat, a.location_lng);
    const distB = calculateDistance(refLat, refLng, b.location_lat, b.location_lng);
    return distA - distB;
  });
}

/**
 * Calculate center point (centroid) of multiple locations
 * Useful for map centering
 */
export function calculateCentroid(
  locations: Array<{ location_lat: number; location_lng: number }>
): { lat: number; lng: number } | null {
  if (locations.length === 0) return null;

  const sum = locations.reduce(
    (acc, loc) => ({
      lat: acc.lat + loc.location_lat,
      lng: acc.lng + loc.location_lng,
    }),
    { lat: 0, lng: 0 }
  );

  return {
    lat: sum.lat / locations.length,
    lng: sum.lng / locations.length,
  };
}

/**
 * Format distance for display
 * Shows in km or m depending on size
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  } else if (km < 10) {
    return `${km.toFixed(1)}km`;
  } else {
    return `${Math.round(km)}km`;
  }
}

/**
 * Estimate walking time based on distance
 * Assumes average walking speed of 5 km/h
 */
export function estimateWalkingTime(km: number): number {
  const WALKING_SPEED_KMH = 5;
  return Math.round((km / WALKING_SPEED_KMH) * 60); // Returns minutes
}

/**
 * Estimate driving time based on distance
 * Assumes average city driving speed of 30 km/h
 */
export function estimateDrivingTime(km: number): number {
  const CITY_SPEED_KMH = 30;
  return Math.round((km / CITY_SPEED_KMH) * 60); // Returns minutes
}
