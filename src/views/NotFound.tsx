"use client";

import Link from "next/link";
import { Home, Search, FlaskConical, Package, Stethoscope, Headphones, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-background">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Visual Badge */}
        <div className="relative mx-auto flex items-center justify-center">
          <span className="text-8xl sm:text-9xl font-extrabold font-nunito tracking-tighter text-muted/60 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-gradient-to-r from-brand-card-from to-brand-card-to px-6 py-2 shadow-lg">
              <span className="text-sm font-semibold tracking-wide uppercase text-white">
                Page Not Found
              </span>
            </div>
          </div>
        </div>

        {/* Messaging */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold font-nunito text-foreground">
            Looking for Food Testing Services?
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            The page you requested could not be found or may have been moved. Try searching or explore our certified lab tests below.
          </p>
        </div>

        {/* Quick Route Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <Link
            href="/tests"
            className="flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-card border border-border hover:border-brand-primary/40 hover:shadow-md transition-all group"
          >
            <div className="h-10 w-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
              <FlaskConical className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-foreground">Food Tests</span>
          </Link>

          <Link
            href="/packages"
            className="flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-card border border-border hover:border-brand-action/40 hover:shadow-md transition-all group"
          >
            <div className="h-10 w-10 rounded-xl bg-brand-action/10 flex items-center justify-center text-brand-action group-hover:scale-110 transition-transform">
              <Package className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-foreground">Packages</span>
          </Link>

          <Link
            href="/consultation"
            className="flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-card border border-border hover:border-brand-primary/40 hover:shadow-md transition-all group"
          >
            <div className="h-10 w-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
              <Stethoscope className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-foreground">Consultation</span>
          </Link>

          <Link
            href="/support"
            className="flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-card border border-border hover:border-brand-action/40 hover:shadow-md transition-all group"
          >
            <div className="h-10 w-10 rounded-xl bg-brand-action/10 flex items-center justify-center text-brand-action group-hover:scale-110 transition-transform">
              <Headphones className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-foreground">Help Center</span>
          </Link>
        </div>

        {/* Primary Action Button */}
        <div className="pt-4 flex justify-center">
          <Button asChild className="gap-2 bg-brand-action hover:bg-brand-action-hover text-white rounded-full px-7 h-12 shadow-md">
            <Link href="/home">
              <Home className="h-4 w-4" />
              Return to Homepage
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
