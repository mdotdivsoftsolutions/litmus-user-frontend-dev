import type { Metadata } from "next";
import PrivacyPage from "@/views/user/PrivacyPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Litmus Testing",
  description: "Learn how Litmus protects, processes, and manages your personal and laboratory testing data.",
};

export default function Page() {
  return <PrivacyPage />;
}