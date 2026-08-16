import type { Metadata } from "next";
import { Suspense } from "react";
import TestsListingPage from "@/views/user/TestsListingPage";

export const metadata: Metadata = {
  title: "Diagnostic & Food Safety Tests Directory | Litmus",
  description: "Explore all accredited laboratory tests for food matrices, nutritional profiling, microbiology, chemical residue, and safety compliance.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 animate-pulse" />}>
      <TestsListingPage />
    </Suspense>
  );
}