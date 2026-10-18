import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import TermsPage from "@/views/user/TermsPage";

export const metadata: Metadata = pageMetadata({
  title: "Terms & Conditions | Litmus Labs",
  description:
    "Read the terms and conditions for booking food and laboratory testing services with Litmus Labs, India's NABL accredited testing network.",
  path: "/terms",
});

export default function Page() {
  return <TermsPage />;
}