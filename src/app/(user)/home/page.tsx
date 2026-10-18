import type { Metadata } from "next";
import HomePage from "@/views/user/HomePage";
import { pageMetadata } from "@/lib/seo";

// Same content as "/": the canonical tag points search engines at the root URL.
export const metadata: Metadata = pageMetadata({
  title: "Litmus Labs | Food Testing Lab in India | NABL & FSSAI",
  description:
    "Litmus Labs offers NABL accredited food, water & agri testing across India, including Chennai & Kochi. FSSAI-approved reports & up to 15% off.",
  path: "/",
});

export const revalidate = 60;

export default function Page() {
  return <HomePage />;
}
