import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import HelpCenterPage from "@/views/user/HelpCenterPage";

export const metadata: Metadata = pageMetadata({
  title: "Help Center | Food Testing Booking & Reports | Litmus Labs",
  description:
    "Find answers from Litmus Labs on booking, sample collection, refunds and report downloads for your food testing order in Chennai, Kochi and India.",
  path: "/help",
});

export default function Page() {
  return <HelpCenterPage />;
}