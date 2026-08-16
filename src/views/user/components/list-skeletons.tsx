import { Skeleton } from "@/components/ui/skeleton";

export function OrderListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="grid gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="bg-card rounded-xl border border-border shadow-sm p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
        >
          <div className="flex-1 min-w-0 w-full flex flex-col md:flex-row gap-4 md:items-center">
            <div className="shrink-0 space-y-2 w-24">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="h-5 w-56 max-w-full" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-full shrink-0" />
          </div>
          <div className="shrink-0 flex items-center justify-between w-full md:w-auto md:gap-6 border-t md:border-t-0 border-border pt-3 md:pt-0">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-5 w-5 rounded-md hidden md:block" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReportListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="grid gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="bg-card rounded-xl border border-border shadow-sm p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
        >
          <div className="flex-1 min-w-0 w-full flex flex-col md:flex-row gap-4 md:items-center">
            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-48 max-w-[60%]" />
                <Skeleton className="h-5 w-16 rounded" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-40 hidden lg:block shrink-0" />
          </div>
          <div className="shrink-0 flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 border-border pt-3 md:pt-0">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
