import type { Metadata } from "next";
import PrivacyPage from "@/views/user/PrivacyPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Litmus Diagnostics",
  description: "Learn how Litmus protects, processes, and manages your personal and testing diagnostic data.",
};

export default function Page() {
  return <PrivacyPage />;
}