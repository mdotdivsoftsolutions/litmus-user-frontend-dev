import type { Metadata } from "next";
import HelpCenterPage from "@/views/user/HelpCenterPage";

export const metadata: Metadata = {
  title: "Help Center & Support Hub | Litmus Diagnostics",
  description: "Browse guides, test information, report access instructions, and get in touch with our clinical operations desk.",
};

export default function Page() {
  return <HelpCenterPage />;
}