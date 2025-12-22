/**
 * LoadingSkeleton Component
 * 
 * Reusable loading skeleton for list/grid views
 * Provides visual feedback during data fetching
 */

interface LoadingSkeletonProps {
  count?: number;
  variant?: 'grid' | 'list';
}

export function LoadingSkeleton({ 
  count = 3, 
  variant = 'grid' 
}: LoadingSkeletonProps) {
  const skeletonArray = Array.from({ length: count });

  if (variant === 'list') {
    return (
      <div className="space-y-4">
        {skeletonArray.map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="animate-pulse">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-slate-200 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skeletonArray.map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="animate-pulse">
            <div className="h-48 bg-slate-200" />
            <div className="p-6 space-y-3">
              <div className="h-6 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-4 bg-slate-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
