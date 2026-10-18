import type { Metadata } from "next";
import ConsumerProfilePage from "@/views/user/ConsumerProfilePage";

export const metadata: Metadata = {
  // Signed-in / one-off page: keep it out of search results.
  robots: { index: false, follow: true },
  title: "My Account & Profile | Litmus Labs",
  description: "Manage your personal profile, business details, FSSAI registration, security settings, and notifications.",
};

export default function Page() {
  return <ConsumerProfilePage />;
}
