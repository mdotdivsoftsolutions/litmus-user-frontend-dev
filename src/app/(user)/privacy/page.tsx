import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PrivacyPage from "@/views/user/PrivacyPage";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy | Litmus Labs",
  description:
    "Learn how Litmus Labs collects, uses and protects your personal data when you book food and laboratory testing services in India.",
  path: "/privacy",
});

export default function Page() {
  return <PrivacyPage />;
}