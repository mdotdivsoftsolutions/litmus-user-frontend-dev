import type { Metadata } from "next";
import HelpCenterPage from "@/views/user/HelpCenterPage";

export const metadata: Metadata = {
  title: "Help Center & Support Hub | Litmus Testing",
  description: "Browse guides, test information, report access instructions, and get in touch with our laboratory operations desk.",
};

export default function Page() {
  return <HelpCenterPage />;
}