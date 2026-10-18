import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import CartPage from "@/views/user/CartPage";

export const metadata: Metadata = pageMetadata({
  title: "Your Cart | Food Testing Booking | Litmus Labs",
  description:
    "Review your selected food and water tests and complete your secure booking with Litmus Labs.",
  path: "/cart",
});

export default function Page() {
  return (
    <Suspense fallback={
      <div className="max-w-5xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-action"></div>
      </div>
    }>
      <CartPage />
    </Suspense>
  );
}