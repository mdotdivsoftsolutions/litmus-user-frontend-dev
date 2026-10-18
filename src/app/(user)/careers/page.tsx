import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import CareersPage from "@/views/user/CareersPage";

export const metadata: Metadata = pageMetadata({
  title: "Careers at Litmus Labs | Food Testing & Lab Jobs in India",
  description:
    "Join Litmus Labs. Explore food technology, lab and consulting jobs in Chennai, Kochi and across India. Apply today and grow with us.",
  path: "/careers",
});

export default function Page() {
  return <CareersPage />;
}