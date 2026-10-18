import type { Metadata } from "next";
import ForgotPasswordPage from "@/views/ForgotPasswordPage";

export const metadata: Metadata = {
  // Signed-in / one-off page: keep it out of search results.
  robots: { index: false, follow: true },
  title: "Reset Password | Litmus Labs",
  description: "Reset your Litmus account password securely via email or SMS verification.",
};

export default function Page() {
  return <ForgotPasswordPage />;
}