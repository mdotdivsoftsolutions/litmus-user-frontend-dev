"use client";

import { UserLayout } from "@/components/layout/UserLayout";
import { Suspense } from "react";

export default function UserGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium animate-pulse">Loading...</p>
        </div>
      </div>
    }>
      <UserLayout>{children}</UserLayout>
    </Suspense>
  );
}
