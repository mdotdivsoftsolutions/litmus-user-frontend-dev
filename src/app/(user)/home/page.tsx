import type { Metadata } from "next";
import HomePage from "@/views/user/HomePage";
import { packageApi } from "@/lib/api/package";
import { categoryApi } from "@/lib/api/category";
import { labApi } from "@/lib/api/lab";
import { reviewApi } from "@/lib/api/review";

export const metadata: Metadata = {
  title: "Home | Litmus Diagnostic Testing Network",
  description: "Book verified food, water, agricultural, and clinical diagnostics across NABL & FSSAI certified laboratories in India.",
};

export const revalidate = 60; // Enable ISR (revalidate every 60s)

export default async function Page() {
  // Fetch home page data concurrently on the server (SSR)
  const [packagesRes, categoriesRes, labsRes, reviewsRes] = await Promise.allSettled([
    packageApi.getAllPackages().catch(() => null),
    categoryApi.getCategories().catch(() => null),
    labApi.getLabsPublic({ isTrusted: true }).catch(() => null),
    reviewApi.getPublicReviews().catch(() => null),
  ]);

  const initialPackages = packagesRes.status === "fulfilled" && packagesRes.value ? packagesRes.value : null;
  const initialCategories = categoriesRes.status === "fulfilled" && categoriesRes.value ? categoriesRes.value : null;
  const initialLabs = labsRes.status === "fulfilled" && labsRes.value ? labsRes.value : null;
  const initialReviews = reviewsRes.status === "fulfilled" && reviewsRes.value ? reviewsRes.value : null;

  return (
    <HomePage
      initialPackages={initialPackages}
      initialCategories={initialCategories}
      initialLabs={initialLabs}
      initialReviews={initialReviews}
    />
  );
}