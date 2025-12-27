/**
 * LAZY ROUTES
 * 
 * Lazy-loaded route components for code splitting
 */

import { lazy, Suspense, ComponentType } from 'react';
import { PageSkeleton } from '../components/common/LoadingSkeletons';

/**
 * Lazy load wrapper with fallback
 */
function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc);
  
  return (props: any) => (
    <Suspense fallback={fallback || <PageSkeleton />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * V2 Trip System Routes (Lazy Loaded)
 */
export const LazyTripsHubPage = lazyLoad(
  () => import('../pages/TripsHubPage')
);

export const LazyCreateTripWizardPage = lazyLoad(
  () => import('../pages/CreateTripWizardPage')
);

export const LazyTripCommandCenterPage = lazyLoad(
  () => import('../pages/TripCommandCenterPage')
);

export const LazyItineraryBuilderPage = lazyLoad(
  () => import('../pages/ItineraryBuilderPage')
);

/**
 * Route preloading
 * Call these functions to preload routes before navigation
 */
export const preloadRoutes = {
  tripsHub: () => import('../pages/TripsHubPage'),
  createWizard: () => import('../pages/CreateTripWizardPage'),
  commandCenter: () => import('../pages/TripCommandCenterPage'),
  itineraryBuilder: () => import('../pages/ItineraryBuilderPage'),
};
