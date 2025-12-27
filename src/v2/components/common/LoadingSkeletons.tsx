/**
 * LOADING SKELETONS
 * 
 * Skeleton components for loading states
 */

export function TripCardSkeleton() {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-neutral-200" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-6 bg-neutral-200 rounded w-3/4" />
        
        {/* Dates */}
        <div className="h-4 bg-neutral-200 rounded w-1/2" />
        
        {/* Stats */}
        <div className="flex gap-4">
          <div className="h-4 bg-neutral-200 rounded w-16" />
          <div className="h-4 bg-neutral-200 rounded w-16" />
          <div className="h-4 bg-neutral-200 rounded w-16" />
        </div>
        
        {/* Button */}
        <div className="h-10 bg-neutral-200 rounded w-full" />
      </div>
    </div>
  );
}

export function ItineraryItemSkeleton() {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-4 animate-pulse">
      <div className="flex gap-3">
        {/* Time */}
        <div className="w-16 flex-shrink-0">
          <div className="h-4 bg-neutral-200 rounded w-12" />
        </div>
        
        {/* Content */}
        <div className="flex-1 space-y-2">
          {/* Title */}
          <div className="h-5 bg-neutral-200 rounded w-3/4" />
          
          {/* Description */}
          <div className="h-4 bg-neutral-200 rounded w-full" />
          <div className="h-4 bg-neutral-200 rounded w-2/3" />
          
          {/* Meta */}
          <div className="flex gap-2 mt-2">
            <div className="h-6 bg-neutral-200 rounded-full w-16" />
            <div className="h-6 bg-neutral-200 rounded-full w-20" />
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-neutral-200 rounded" />
          <div className="w-8 h-8 bg-neutral-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export function DayAccordionSkeleton() {
  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden animate-pulse">
      {/* Header */}
      <div className="p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-6 bg-neutral-200 rounded w-32" />
            <div className="h-4 bg-neutral-200 rounded w-48" />
          </div>
          <div className="w-8 h-8 bg-neutral-200 rounded" />
        </div>
      </div>
      
      {/* Items */}
      <div className="p-4 space-y-3 bg-neutral-50">
        <ItineraryItemSkeleton />
        <ItineraryItemSkeleton />
        <ItineraryItemSkeleton />
      </div>
    </div>
  );
}

export function ChatMessageSkeleton() {
  return (
    <div className="flex gap-3 animate-pulse">
      {/* Avatar */}
      <div className="w-8 h-8 bg-neutral-200 rounded-full flex-shrink-0" />
      
      {/* Message */}
      <div className="flex-1 space-y-2">
        <div className="bg-neutral-200 rounded-2xl p-4 space-y-2 max-w-[85%]">
          <div className="h-4 bg-neutral-300 rounded w-full" />
          <div className="h-4 bg-neutral-300 rounded w-3/4" />
        </div>
        <div className="h-3 bg-neutral-200 rounded w-16" />
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 bg-neutral-200 rounded w-64" />
        <div className="h-4 bg-neutral-200 rounded w-96" />
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-neutral-200 rounded-lg p-4 space-y-2">
            <div className="h-4 bg-neutral-200 rounded w-24" />
            <div className="h-8 bg-neutral-200 rounded w-16" />
          </div>
        ))}
      </div>
      
      {/* Content */}
      <div className="space-y-4">
        <div className="h-6 bg-neutral-200 rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <TripCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
