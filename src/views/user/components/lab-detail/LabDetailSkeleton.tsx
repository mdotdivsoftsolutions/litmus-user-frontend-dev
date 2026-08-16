"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function LabDetailSkeleton() {
  return (
    <div className="animate-fade-in min-h-screen bg-white pb-20">
      <section className="relative pt-12 pb-12 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-10">
            <Skeleton className="h-28 w-28 rounded-[2rem] shrink-0" />
            <div className="flex-1 space-y-4">
              <div className="flex gap-3">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-32 rounded-full" />
              </div>
              <Skeleton className="h-10 w-3/4 max-w-md" />
              <div className="flex gap-6">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-40" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-6 pt-10 space-y-12">
        <Skeleton className="h-12 w-full max-w-md" />
        <div className="grid lg:grid-cols-3 gap-12 pt-4">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-64 w-full rounded-[2.5rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}
