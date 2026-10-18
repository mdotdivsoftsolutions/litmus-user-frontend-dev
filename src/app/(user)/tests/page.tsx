import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import TestsListingPage from "@/views/user/TestsListingPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { testsServiceSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "Food & Water Testing Services in India | Litmus Labs",
  description:
    "Explore 500+ NABL accredited food tests at Litmus Labs: microbiology, heavy metals, pesticides & nutrition. Book online in Chennai, Kochi & India.",
  path: "/tests",
});

export default function Page() {
  return (
    <>
      <JsonLd data={testsServiceSchema} />
      <Suspense fallback={<div className="min-h-screen bg-slate-50 animate-pulse" />}>
        <TestsListingPage />
      </Suspense>
    </>
  );
}