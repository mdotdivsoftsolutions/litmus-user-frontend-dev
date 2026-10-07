"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useEffect, useState } from "react";
import { initScrollReveal } from "@/lib/scrollReveal";
import { initSmoothScroll } from "@/lib/smoothScroll";

/**
 * One QueryClient per browser session / per server render. A module-level client would be
 * shared by every SSR request (cache and memory shared across users).
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Focus refetch stays on (cart/orders sync across tabs) but only for stale data.
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
      },
    },
  });
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient);

  useEffect(() => {
    const stopReveal = initScrollReveal();

    // Smooth scrolling is a nice-to-have: load it once the browser is idle, off the critical path.
    let stopSmoothScroll: (() => void) | undefined;
    let cancelled = false;
    const start = () => {
      initSmoothScroll().then((stop) => {
        if (cancelled) stop();
        else stopSmoothScroll = stop;
      });
    };
    // Safari has no requestIdleCallback: fall back to a short timeout.
    const hasIdle = typeof window.requestIdleCallback === "function";
    const idleId = hasIdle ? window.requestIdleCallback(start, { timeout: 2000 }) : setTimeout(start, 1200);

    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(idleId as number);
      else clearTimeout(idleId);
      stopReveal();
      stopSmoothScroll?.();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
