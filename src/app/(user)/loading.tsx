export default function UserLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      {/* Hero Banner Skeleton */}
      <div className="w-full h-72 md:h-96 rounded-3xl bg-muted/60 relative overflow-hidden flex flex-col justify-end p-8 gap-4">
        <div className="h-6 w-32 bg-muted-foreground/20 rounded-full"></div>
        <div className="h-10 md:h-14 w-3/4 max-w-xl bg-muted-foreground/20 rounded-2xl"></div>
        <div className="h-5 w-1/2 max-w-md bg-muted-foreground/20 rounded-lg"></div>
        <div className="flex gap-3 pt-2">
          <div className="h-12 w-36 bg-muted-foreground/20 rounded-xl"></div>
          <div className="h-12 w-36 bg-muted-foreground/20 rounded-xl"></div>
        </div>
      </div>

      {/* Categories / Grid Skeleton */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-7 w-48 bg-muted-foreground/20 rounded-lg"></div>
          <div className="h-5 w-24 bg-muted-foreground/20 rounded-lg"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-muted/50 p-4 flex flex-col items-center justify-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted-foreground/20"></div>
              <div className="h-4 w-16 bg-muted-foreground/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Cards Skeleton */}
      <div className="space-y-4 pt-4">
        <div className="h-7 w-56 bg-muted-foreground/20 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-muted/50 p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-5 w-24 bg-muted-foreground/20 rounded-full"></div>
                <div className="h-6 w-3/4 bg-muted-foreground/20 rounded-lg"></div>
                <div className="h-4 w-full bg-muted-foreground/20 rounded"></div>
              </div>
              <div className="h-10 w-full bg-muted-foreground/20 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
