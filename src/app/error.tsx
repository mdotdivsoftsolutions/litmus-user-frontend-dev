"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home, AlertTriangle, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service if needed
    console.error("App boundary error caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shadow-sm">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground font-nunito tracking-tight sm:text-3xl">
            Something went wrong
          </h1>
          <p className="text-sm text-muted-foreground">
            We encountered an unexpected error while processing this page. Our team has been notified.
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground/70 font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl shadow"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto gap-2 border-border text-foreground hover:bg-muted rounded-xl"
          >
            <Link href="/home">
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </div>

        <div className="pt-6 border-t border-border text-xs text-muted-foreground flex items-center justify-center gap-1.5">
          <Headphones className="h-3.5 w-3.5 text-brand-action" />
          <span>Need help? Contact our</span>
          <Link href="/support" className="text-brand-action font-semibold hover:underline">
            Support Team
          </Link>
        </div>
      </div>
    </div>
  );
}
