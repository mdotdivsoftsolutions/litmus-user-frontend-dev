import type { Metadata } from "next";
import ForgotPasswordPage from "@/views/ForgotPasswordPage";

export const metadata: Metadata = {
  title: "Reset Password | Litmus Diagnostics",
  description: "Reset your Litmus account password securely via email or SMS verification.",
};

export default function Page() {
  return <ForgotPasswordPage />;
}