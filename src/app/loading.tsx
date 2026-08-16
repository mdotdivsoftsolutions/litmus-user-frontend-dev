export default function GlobalLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4">
      <div className="relative flex flex-col items-center gap-6">
        {/* Animated Brand Logo Pulse */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute h-full w-full rounded-2xl bg-brand-primary/20 animate-ping opacity-75"></div>
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-action shadow-lg">
            <span className="text-2xl font-bold text-white tracking-wider">L</span>
          </div>
        </div>

        {/* Shimmer skeleton bar */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-1.5 w-48 overflow-hidden rounded-full bg-border">
            <div className="h-full w-full bg-gradient-to-r from-brand-action via-brand-primary to-brand-action animate-[shimmer_1.5s_infinite_linear] [background-size:200%_100%]"></div>
          </div>
          <p className="text-xs font-medium text-muted-foreground animate-pulse">
            Loading Litmus Food Analytics...
          </p>
        </div>
      </div>
    </div>
  );
}
