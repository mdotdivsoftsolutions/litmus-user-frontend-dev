"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  RefreshCw, 
  Home, 
  FlaskConical, 
  Headphones, 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  Package, 
  Building2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // Log error to console / monitoring telemetry
    console.error("Litmus platform boundary caught exception:", error);
  }, [error]);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      reset();
      setIsRetrying(false);
    }, 400);
  };

  return (
    <div className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden px-4 py-16 bg-slate-50/60">
      {/* Ambient background glow effects */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-cyan-100/50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-xl w-full">
        {/* Main Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,117,31,0.06)] backdrop-blur-xl text-center space-y-8">
          
          {/* Litmus Scientific Badge Emblem */}
          <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-primary/10 via-brand-action/10 to-emerald-100 animate-pulse" />
            <div className="absolute inset-2 rounded-full bg-white border border-slate-100 shadow-inner flex items-center justify-center" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-card-from to-brand-card-to text-white shadow-md">
              <FlaskConical className="h-7 w-7" />
            </div>
            {/* Live status orbit indicator */}
            <span className="absolute bottom-1 right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-primary border-2 border-white" />
            </span>
          </div>

          {/* Header Typography */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/80 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-primary">
              <Activity className="h-3.5 w-3.5" />
              Platform Diagnostics
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-nunito tracking-tight leading-tight">
              We Encountered a Temporary Interruption
            </h1>
            <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto leading-relaxed">
              Our automated diagnostic pipeline intercepted an unexpected state. Your data remains secure and no sample orders were affected.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              onClick={handleRetry}
              disabled={isRetrying}
              className="w-full sm:w-auto h-12 px-7 gap-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-sm rounded-xl shadow-md transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              <RefreshCw className={cn("h-4 w-4", isRetrying && "animate-spin")} />
              {isRetrying ? "Reconnecting..." : "Refresh & Try Again"}
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto h-12 px-7 gap-2.5 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-bold text-sm rounded-xl transition-all"
            >
              <Link href="/home">
                <Home className="h-4 w-4 text-slate-400" />
                Return to Homepage
              </Link>
            </Button>
          </div>

          {/* Quick Navigation Directory */}
          <div className="pt-6 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3.5">
              Explore Our Certified Services
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              <Link
                href="/tests"
                className="group flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-100 hover:border-emerald-200 transition-all text-center"
              >
                <FlaskConical className="h-4 w-4 text-brand-primary group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-slate-700 group-hover:text-brand-primary">
                  All Tests
                </span>
              </Link>

              <Link
                href="/packages"
                className="group flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-50 hover:bg-cyan-50/50 border border-slate-100 hover:border-cyan-200 transition-all text-center"
              >
                <Package className="h-4 w-4 text-brand-action group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-slate-700 group-hover:text-brand-action">
                  Packages
                </span>
              </Link>

              <Link
                href="/labs"
                className="group flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-100 hover:border-emerald-200 transition-all text-center"
              >
                <Building2 className="h-4 w-4 text-brand-primary group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-slate-700 group-hover:text-brand-primary">
                  Partner Labs
                </span>
              </Link>
            </div>
          </div>

          {/* Technical Diagnostics (Collapsible) */}
          <div className="pt-2">
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              <span>Incident Diagnostics</span>
              {showTechnicalDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            {showTechnicalDetails && (
              <div className="mt-3 rounded-xl bg-slate-900 text-slate-300 p-4 text-left font-mono text-xs space-y-1.5 overflow-x-auto">
                <div className="flex items-center justify-between text-slate-400 text-[10px] pb-1 border-b border-slate-800">
                  <span>SYSTEM TELEMETRY</span>
                  <span>STATUS: LOGGED</span>
                </div>
                {error.digest && (
                  <p className="text-emerald-400">
                    <span className="text-slate-400">Digest: </span>{error.digest}
                  </p>
                )}
                <p className="text-rose-300 break-all">
                  <span className="text-slate-400">Message: </span>{error.message || "Uncaught runtime exception"}
                </p>
              </div>
            )}
          </div>

          {/* Footer Assistance */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-brand-primary" />
              <span>NABL & FSSAI Compliant Infrastructure</span>
            </div>
            <Link
              href="/support"
              className="inline-flex items-center gap-1 font-semibold text-brand-action hover:underline"
            >
              <Headphones className="h-3.5 w-3.5" />
              <span>Contact Lab Support Desk</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
