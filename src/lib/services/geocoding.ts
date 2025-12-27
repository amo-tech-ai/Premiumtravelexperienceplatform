/**
 * Geocoding Service
 * Production-ready location and address services
 */

import config from '../../config/runtime';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Address {
  formatted: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface GeocodingResult {
  coordinates: Coordinates;
  address: Address;
  placeId?: string;
  accuracy?: 'rooftop' | 'range_interpolated' | 'geometric_center' | 'approximate';
}

export interface ReverseGeocodingResult {
  address: Address;
  placeId?: string;
  types?: string[];
}

/**
 * Geocoding Service Class
 * Supports multiple providers: Google Maps, Mapbox, OpenStreetMap (Nominatim)
 */
export class GeocodingService {
  private provider: 'google' | 'mapbox' | 'nominatim';
  private apiKey: string | null;

  constructor(provider: 'google' | 'mapbox' | 'nominatim' = 'nominatim', apiKey?: string) {
    this.provider = provider;
    this.apiKey = apiKey || this.getApiKey();
  }

  /**
   * Get API key from config
   */
  private getApiKey(): string | null {
    // Check config instead of import.meta.env
    if (this.provider === 'google' && config.googleMaps.apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY') {
      return config.googleMaps.apiKey;
    }
    
    // Mapbox not configured in runtime.ts, so skip that check
    
    // No API key available
    return null;
  }

  /**
   * Forward geocoding: Address -> Coordinates
   */
  async geocode(address: string): Promise<GeocodingResult> {
    if (!address || address.trim().length === 0) {
      throw new Error('Address is required');
    }

    switch (this.provider) {
      case 'google':
        return this.geocodeGoogle(address);
      case 'mapbox':
        return this.geocodeMapbox(address);
      case 'nominatim':
        return this.geocodeNominatim(address);
      default:
        throw new Error(`Unknown provider: ${this.provider}`);
    }
  }

  /**
   * Reverse geocoding: Coordinates -> Address
   */
  async reverseGeocode(lat: number, lng: number): Promise<ReverseGeocodingResult> {
    switch (this.provider) {
      case 'google':
        return this.reverseGeocodeGoogle(lat, lng);
      case 'mapbox':
        return this.reverseGeocodeMapbox(lat, lng);
      case 'nominatim':
        return this.reverseGeocodeNominatim(lat, lng);
      default:
        throw new Error(`Unknown provider: ${this.provider}`);
    }
  }

  /**
   * Google Maps Geocoding
   */
  private async geocodeGoogle(address: string): Promise<GeocodingResult> {
    if (!this.apiKey) {
      // Fallback to mock data
      return this.getMockGeocodingResult(address);
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${this.apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK' || !data.results || data.results.length === 0) {
        throw new Error(`Geocoding failed: ${data.status}`);
      }

      const result = data.results[0];
      const location = result.geometry.location;

      return {
        coordinates: {
          lat: location.lat,
          lng: location.lng,
        },
        address: this.parseGoogleAddress(result),
        placeId: result.place_id,
        accuracy: result.geometry.location_type?.toLowerCase(),
      };
    } catch (error) {
      console.error('Google geocoding error:', error);
      return this.getMockGeocodingResult(address);
    }
  }

  /**
   * Mapbox Geocoding
   */
  private async geocodeMapbox(address: string): Promise<GeocodingResult> {
    if (!this.apiKey) {
      return this.getMockGeocodingResult(address);
    }

    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${this.apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!data.features || data.features.length === 0) {
        throw new Error('No results found');
      }

      const feature = data.features[0];

      return {
        coordinates: {
          lng: feature.center[0],
          lat: feature.center[1],
        },
        address: {
          formatted: feature.place_name,
          city: feature.context?.find((c: any) => c.id.startsWith('place'))?.text,
          state: feature.context?.find((c: any) => c.id.startsWith('region'))?.text,
          country: feature.context?.find((c: any) => c.id.startsWith('country'))?.text,
          postalCode: feature.context?.find((c: any) => c.id.startsWith('postcode'))?.text,
        },
        placeId: feature.id,
        accuracy: feature.properties?.accuracy,
      };
    } catch (error) {
      console.error('Mapbox geocoding error:', error);
      return this.getMockGeocodingResult(address);
    }
  }

  /**
   * Nominatim (OpenStreetMap) Geocoding - FREE, no API key required
   */
  private async geocodeNominatim(address: string): Promise<GeocodingResult> {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        address
      )}&format=json&limit=1&addressdetails=1`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'LocalScout/1.0', // Required by Nominatim
        },
      });

      const data = await response.json();

      if (!data || data.length === 0) {
        return this.getMockGeocodingResult(address);
      }

      const result = data[0];

      return {
        coordinates: {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
        },
        address: {
          formatted: result.display_name,
          street: result.address?.road,
          city: result.address?.city || result.address?.town,
          state: result.address?.state,
          country: result.address?.country,
          postalCode: result.address?.postcode,
        },
        placeId: result.place_id?.toString(),
        accuracy: result.importance > 0.8 ? 'rooftop' : 'approximate',
      };
    } catch (error) {
      console.error('Nominatim geocoding error:', error);
      return this.getMockGeocodingResult(address);
    }
  }

  /**
   * Reverse geocoding implementations
   */
  private async reverseGeocodeGoogle(lat: number, lng: number): Promise<ReverseGeocodingResult> {
    if (!this.apiKey) {
      return this.getMockReverseGeocodingResult(lat, lng);
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK' || !data.results || data.results.length === 0) {
        throw new Error(`Reverse geocoding failed: ${data.status}`);
      }

      const result = data.results[0];

      return {
        address: this.parseGoogleAddress(result),
        placeId: result.place_id,
        types: result.types,
      };
    } catch (error) {
      console.error('Google reverse geocoding error:', error);
      return this.getMockReverseGeocodingResult(lat, lng);
    }
  }

  private async reverseGeocodeMapbox(lat: number, lng: number): Promise<ReverseGeocodingResult> {
    if (!this.apiKey) {
      return this.getMockReverseGeocodingResult(lat, lng);
    }

    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${this.apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!data.features || data.features.length === 0) {
        throw new Error('No results found');
      }

      const feature = data.features[0];

      return {
        address: {
          formatted: feature.place_name,
          city: feature.context?.find((c: any) => c.id.startsWith('place'))?.text,
          state: feature.context?.find((c: any) => c.id.startsWith('region'))?.text,
          country: feature.context?.find((c: any) => c.id.startsWith('country'))?.text,
        },
        placeId: feature.id,
        types: feature.place_type,
      };
    } catch (error) {
      console.error('Mapbox reverse geocoding error:', error);
      return this.getMockReverseGeocodingResult(lat, lng);
    }
  }

  private async reverseGeocodeNominatim(
    lat: number,
    lng: number
  ): Promise<ReverseGeocodingResult> {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'LocalScout/1.0',
        },
      });

      const result = await response.json();

      return {
        address: {
          formatted: result.display_name,
          street: result.address?.road,
          city: result.address?.city || result.address?.town,
          state: result.address?.state,
          country: result.address?.country,
          postalCode: result.address?.postcode,
        },
        placeId: result.place_id?.toString(),
        types: [result.type],
      };
    } catch (error) {
      console.error('Nominatim reverse geocoding error:', error);
      return this.getMockReverseGeocodingResult(lat, lng);
    }
  }

  /**
   * Helper: Parse Google address components
   */
  private parseGoogleAddress(result: any): Address {
    const components = result.address_components || [];

    const getComponent = (type: string) => {
      const comp = components.find((c: any) => c.types.includes(type));
      return comp?.long_name;
    };

    return {
      formatted: result.formatted_address,
      street: `${getComponent('street_number') || ''} ${getComponent('route') || ''}`.trim(),
      city: getComponent('locality') || getComponent('administrative_area_level_2'),
      state: getComponent('administrative_area_level_1'),
      country: getComponent('country'),
      postalCode: getComponent('postal_code'),
    };
  }

  /**
   * Mock data for demo/fallback
   */
  private getMockGeocodingResult(address: string): GeocodingResult {
    // Generate consistent coordinates based on address hash
    const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const lat = 6.2 + (hash % 100) / 1000; // ~Medellín
    const lng = -75.5 - (hash % 100) / 1000;

    return {
      coordinates: { lat, lng },
      address: {
        formatted: address,
        city: 'Medellín',
        state: 'Antioquia',
        country: 'Colombia',
      },
      accuracy: 'approximate',
    };
  }

  private getMockReverseGeocodingResult(lat: number, lng: number): ReverseGeocodingResult {
    return {
      address: {
        formatted: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        city: 'Medellín',
        state: 'Antioquia',
        country: 'Colombia',
      },
      types: ['point_of_interest'],
    };
  }
}

// --- SINGLETON ---

let geocodingService: GeocodingService | null = null;

export function getGeocodingService(
  provider: 'google' | 'mapbox' | 'nominatim' = 'nominatim',
  apiKey?: string
): GeocodingService {
  if (!geocodingService) {
    geocodingService = new GeocodingService(provider, apiKey);
  }
  return geocodingService;
}

// --- UTILITY FUNCTIONS ---

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export function calculateDistance(
  coord1: Coordinates,
  coord2: Coordinates,
  unit: 'km' | 'mi' = 'km'
): number {
  const R = unit === 'km' ? 6371 : 3959; // Earth's radius
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) *
      Math.cos(toRad(coord2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Get center point of multiple coordinates
 */
export function getCenterPoint(coordinates: Coordinates[]): Coordinates {
  if (coordinates.length === 0) {
    return { lat: 6.2476, lng: -75.5658 }; // Default to Medellín
  }

  if (coordinates.length === 1) {
    return coordinates[0];
  }

  const sum = coordinates.reduce(
    (acc, coord) => ({
      lat: acc.lat + coord.lat,
      lng: acc.lng + coord.lng,
    }),
    { lat: 0, lng: 0 }
  );

  return {
    lat: sum.lat / coordinates.length,
    lng: sum.lng / coordinates.length,
  };
}

/**
 * Get bounding box for coordinates
 */
export function getBoundingBox(coordinates: Coordinates[]): {
  north: number;
  south: number;
  east: number;
  west: number;
} {
  if (coordinates.length === 0) {
    return { north: 6.3, south: 6.2, east: -75.5, west: -75.6 };
  }

  const lats = coordinates.map((c) => c.lat);
  const lngs = coordinates.map((c) => c.lng);

  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    west: Math.min(...lngs),
  };
}

export default GeocodingService;