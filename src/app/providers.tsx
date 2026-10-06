"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";

import Lenis from "lenis";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

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
    const aosTimeout = setTimeout(() => {
      AOS.init({
        duration: 700,
        once: false,
        offset: 100,
      });
    }, 1000);

    const lenis = new Lenis();
    if (typeof window !== "undefined") {
      window.__lenis = lenis;
    }

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      clearTimeout(aosTimeout);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      if (typeof window !== "undefined") {
        delete window.__lenis;
      }
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
