import type { Metadata } from "next";
import ConsumerProfilePage from "@/views/user/ConsumerProfilePage";

export const metadata: Metadata = {
  title: "My Account & Profile | Litmus",
  description: "Manage your personal profile, business details, FSSAI registration, security settings, and notifications.",
};

export default function Page() {
  return <ConsumerProfilePage />;
}
