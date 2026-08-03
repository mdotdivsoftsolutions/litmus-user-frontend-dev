"use client";

import { Suspense } from "react";
import NotFound from "@/views/NotFound";

export default function NotFoundPage() { 
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <NotFound />
    </Suspense>
  );
}
