import type { Metadata } from "next";
import { Suspense } from "react";
import NewBookingPage from "@/views/user/NewBookingPage";

export const metadata: Metadata = {
  // Signed-in / one-off page: keep it out of search results.
  robots: { index: false, follow: true },
  title: "Book Laboratory Tests | Litmus Labs",
  description: "Schedule sample collection, specify sample metadata, select accredited testing labs, and complete test booking.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 animate-pulse" />}>
      <NewBookingPage />
    </Suspense>
  );
}
