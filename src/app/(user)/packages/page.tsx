import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PackagesPage from "@/views/user/PackagesPage";

export const metadata: Metadata = pageMetadata({
  title: "Food Safety Testing Packages | FSSAI | Litmus Labs",
  description:
    "Save up to 20% on Litmus Labs food safety packages for water, toxin & shelf life testing. NABL labs serving Chennai, Kochi & all of India.",
  path: "/packages",
});

export default function Page() {
  return <PackagesPage />;
}