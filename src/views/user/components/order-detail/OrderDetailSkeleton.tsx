import { Skeleton } from "@/components/ui/skeleton";

export function OrderDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 md:pt-28 pb-16 md:pb-20 space-y-6 animate-pulse">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-5">
          <div className="space-y-2 w-full max-w-md">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>

        <div className="flex items-start pt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start min-w-0 flex-1 last:flex-none">
              <div className="flex flex-col items-center w-[4.25rem] sm:w-[5.5rem] shrink-0">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="mt-2 h-3 w-12 sm:w-16" />
              </div>
              {i < 4 && (
                <div className="flex-1 min-w-[12px] pt-4">
                  <Skeleton className="h-0.5 w-full" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-card rounded-xl p-5 border border-border space-y-3">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl p-6 border border-border space-y-4">
        <Skeleton className="h-5 w-40" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3 border-t border-border">
            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
