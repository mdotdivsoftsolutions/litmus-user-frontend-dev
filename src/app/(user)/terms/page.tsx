import type { Metadata } from "next";
import TermsPage from "@/views/user/TermsPage";

export const metadata: Metadata = {
  title: "Terms of Service | Litmus Diagnostics",
  description: "Read the terms of service governing usage of the Litmus marketplace platform, bookings, and diagnostic reports.",
};

export default function Page() {
  return <TermsPage />;
}