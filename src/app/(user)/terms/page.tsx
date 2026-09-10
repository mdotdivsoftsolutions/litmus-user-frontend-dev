import type { Metadata } from "next";
import TermsPage from "@/views/user/TermsPage";

export const metadata: Metadata = {
  title: "Terms of Service | Litmus",
  description: "Read the terms of service governing usage of the Litmus marketplace platform, bookings, and laboratory test reports.",
};

export default function Page() {
  return <TermsPage />;
}