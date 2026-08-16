import type { Metadata } from "next";
import PackagesPage from "@/views/user/PackagesPage";

export const metadata: Metadata = {
  title: "Health & Food Testing Packages | Litmus",
  description: "Explore curated testing packages designed for comprehensive compliance, export screening, and quality certification.",
};

export default function Page() {
  return <PackagesPage />;
}