import type { Metadata } from "next";
import HomePage from "@/views/user/HomePage";
import { packageApi } from "@/lib/api/package";
import { categoryApi } from "@/lib/api/category";
import { labApi } from "@/lib/api/lab";
import { reviewApi } from "@/lib/api/review";

export const metadata: Metadata = {
  title: "Litmus | Accredited Food & Diagnostic Testing Network",
  description: "Book verified food, water, agricultural, and clinical diagnostics across NABL & FSSAI certified laboratories in India.",
  openGraph: {
    title: "Litmus | Accredited Food & Diagnostic Testing Network",
    description: "Book verified food, water, agricultural, and clinical diagnostics across NABL & FSSAI certified laboratories in India.",
  },
};

export const revalidate = 60; // Enable ISR (revalidate every 60s)

const withTimeout = <T,>(promise: Promise<T>, ms = 2500): Promise<T | null> => {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]).catch(() => null);
};

export default async function Page() {
  // Fetch home page data concurrently on the server (SSR) with timeout guard
  const [packagesRes, categoriesRes, labsRes, reviewsRes] = await Promise.allSettled([
    withTimeout(packageApi.getAllPackages()),
    withTimeout(categoryApi.getCategories()),
    withTimeout(labApi.getLabsPublic({ isTrusted: true })),
    withTimeout(reviewApi.getPublicReviews()),
  ]);

  const initialPackages = packagesRes.status === "fulfilled" ? packagesRes.value : null;
  const initialCategories = categoriesRes.status === "fulfilled" ? categoriesRes.value : null;
  const initialLabs = labsRes.status === "fulfilled" ? labsRes.value : null;
  const initialReviews = reviewsRes.status === "fulfilled" ? reviewsRes.value : null;

  return (
    <HomePage
      initialPackages={initialPackages}
      initialCategories={initialCategories}
      initialLabs={initialLabs}
      initialReviews={initialReviews}
    />
  );
}
