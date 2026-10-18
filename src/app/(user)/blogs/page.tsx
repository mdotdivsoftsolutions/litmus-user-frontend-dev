import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import BlogsPage from "@/views/user/BlogsPage";

export const metadata: Metadata = pageMetadata({
  title: "Food Safety Blog | FSSAI & Testing Guides | Litmus Labs",
  description:
    "Read expert guides from Litmus Labs on FSSAI compliance, food testing, shelf life and food safety for businesses in Chennai, Kochi and India.",
  path: "/blogs",
});

export default function Page() {
  return <BlogsPage />;
}