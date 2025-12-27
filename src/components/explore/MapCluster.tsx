/**
 * MAP CLUSTER COMPONENT
 * 
 * Groups nearby map pins into clusters
 * 
 * FEATURES:
 * - Automatic clustering based on zoom level
 * - Click to expand cluster
 * - Count badge
 * - Preserves selection during cluster changes
 * 
 * @see /docs/01-ai-features/03-map-list-sync-spec.md
 * @see /docs/01-ai-features/PROMPT-2-WEEK-2-COMPLETE.md
 */

import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Users } from 'lucide-react';
import { cn } from '../ui/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface ClusterProps {
  /** Cluster ID */
  id: string;

  /** Center position */
  lat: number;
  lng: number;

  /** Number of items in cluster */
  count: number;

  /** Item IDs in this cluster */
  itemIds: string[];

  /** Is this cluster selected */
  isSelected?: boolean;

  /** Is this cluster hovered */
  isHovered?: boolean;

  /** Click handler */
  onClick?: () => void;

  /** Hover handlers */
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;

  /** Size variant */
  size?: 'small' | 'medium' | 'large';
}

export interface ClusterItemProps {
  id: string;
  lat: number;
  lng: number;
}

// ============================================================================
// CLUSTER COMPONENT
// ============================================================================

/**
 * MapCluster Component
 * 
 * Visual representation of a cluster on the map
 */
export function MapCluster({
  id,
  count,
  isSelected = false,
  isHovered = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  size = 'medium',
}: ClusterProps) {
  const sizeClasses = {
    small: 'w-10 h-10 text-xs',
    medium: 'w-12 h-12 text-sm',
    large: 'w-16 h-16 text-base',
  };

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        'rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer',
        sizeClasses[size],
        isSelected
          ? 'bg-emerald-600 text-white ring-4 ring-emerald-200'
          : isHovered
          ? 'bg-emerald-500 text-white ring-2 ring-emerald-100'
          : 'bg-white text-slate-900 border-2 border-slate-200 hover:border-emerald-300'
      )}
      aria-label={`Cluster of ${count} places`}
    >
      <div className="flex flex-col items-center justify-center">
        <Users className={cn(
          size === 'small' ? 'w-3 h-3' : size === 'large' ? 'w-5 h-5' : 'w-4 h-4'
        )} />
        <span className="font-bold leading-none mt-0.5">{count}</span>
      </div>
    </motion.button>
  );
}

// ============================================================================
// CLUSTERING UTILITIES
// ============================================================================

/**
 * Calculate clusters from items based on distance
 */
export function calculateClusters<T extends { id: string; lat: number; lng: number }>(
  items: T[],
  clusterRadius: number,
  zoom: number,
  mapBounds?: { width: number; height: number }
): Array<{
  id: string;
  center: { lat: number; lng: number };
  count: number;
  itemIds: string[];
  items: T[];
}> {
  if (items.length === 0) return [];

  // Convert lat/lng to pixel coordinates based on zoom
  const toPixel = (lat: number, lng: number) => {
    const scale = Math.pow(2, zoom);
    const worldSize = 256 * scale;
    
    const x = ((lng + 180) / 360) * worldSize;
    const latRad = (lat * Math.PI) / 180;
    const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * worldSize;
    
    return { x, y };
  };

  const clusters: Array<{
    id: string;
    center: { lat: number; lng: number };
    count: number;
    itemIds: string[];
    items: T[];
  }> = [];

  const processed = new Set<string>();

  items.forEach((item) => {
    if (processed.has(item.id)) return;

    const itemPixel = toPixel(item.lat, item.lng);
    const clusterItems: T[] = [item];
    processed.add(item.id);

    // Find nearby items
    items.forEach((otherItem) => {
      if (processed.has(otherItem.id)) return;

      const otherPixel = toPixel(otherItem.lat, otherItem.lng);
      const distance = Math.sqrt(
        Math.pow(itemPixel.x - otherPixel.x, 2) +
        Math.pow(itemPixel.y - otherPixel.y, 2)
      );

      if (distance < clusterRadius) {
        clusterItems.push(otherItem);
        processed.add(otherItem.id);
      }
    });

    // Create cluster or single item
    if (clusterItems.length > 1) {
      // Calculate center
      const centerLat = clusterItems.reduce((sum, i) => sum + i.lat, 0) / clusterItems.length;
      const centerLng = clusterItems.reduce((sum, i) => sum + i.lng, 0) / clusterItems.length;

      clusters.push({
        id: `cluster_${clusters.length}`,
        center: { lat: centerLat, lng: centerLng },
        count: clusterItems.length,
        itemIds: clusterItems.map((i) => i.id),
        items: clusterItems,
      });
    } else {
      // Single item (not clustered)
      clusters.push({
        id: item.id,
        center: { lat: item.lat, lng: item.lng },
        count: 1,
        itemIds: [item.id],
        items: [item],
      });
    }
  });

  return clusters;
}

/**
 * Check if should show clusters at current zoom level
 */
export function shouldCluster(zoom: number, minZoom: number, maxZoom: number): boolean {
  return zoom >= minZoom && zoom <= maxZoom;
}

/**
 * Get cluster size based on count
 */
export function getClusterSize(count: number): 'small' | 'medium' | 'large' {
  if (count < 5) return 'small';
  if (count < 10) return 'medium';
  return 'large';
}

// ============================================================================
// USE CLUSTERING HOOK
// ============================================================================

/**
 * useClustering Hook
 * 
 * Manages clustering logic
 * 
 * @example
 * ```tsx
 * const { clusters, isCluster } = useClustering(places, zoom, {
 *   clusterRadius: 50,
 *   minZoom: 0,
 *   maxZoom: 14,
 * });
 * 
 * {clusters.map(cluster => 
 *   cluster.count > 1 ? (
 *     <MapCluster key={cluster.id} {...cluster} />
 *   ) : (
 *     <MapPin key={cluster.items[0].id} {...cluster.items[0]} />
 *   )
 * )}
 * ```
 */
export function useClustering<T extends { id: string; lat: number; lng: number }>(
  items: T[],
  zoom: number,
  config: {
    clusterRadius: number;
    minZoom: number;
    maxZoom: number;
  }
) {
  const [clusters, setClusters] = React.useState<
    Array<{
      id: string;
      center: { lat: number; lng: number };
      count: number;
      itemIds: string[];
      items: T[];
    }>
  >([]);

  React.useEffect(() => {
    if (shouldCluster(zoom, config.minZoom, config.maxZoom)) {
      const newClusters = calculateClusters(items, config.clusterRadius, zoom);
      setClusters(newClusters);
    } else {
      // No clustering, return individual items
      setClusters(
        items.map((item) => ({
          id: item.id,
          center: { lat: item.lat, lng: item.lng },
          count: 1,
          itemIds: [item.id],
          items: [item],
        }))
      );
    }
  }, [items, zoom, config.clusterRadius, config.minZoom, config.maxZoom]);

  const isCluster = React.useCallback(
    (clusterId: string) => {
      const cluster = clusters.find((c) => c.id === clusterId);
      return cluster ? cluster.count > 1 : false;
    },
    [clusters]
  );

  return {
    clusters,
    isCluster,
  };
}
