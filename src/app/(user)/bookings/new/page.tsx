import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingWizard } from "@/components/booking/BookingWizard";

export const metadata: Metadata = {
  title: "Book Diagnostic Tests | Litmus",
  description: "Schedule sample collection, specify sample metadata, select accredited testing labs, and complete test booking.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 animate-pulse" />}>
      <BookingWizard />
    </Suspense>
  );
}
