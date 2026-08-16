import type { Metadata } from "next";
import RegisterPage from "@/views/RegisterPage";

export const metadata: Metadata = {
  title: "Create an Account | Litmus Diagnostics",
  description: "Register for a Litmus account to book laboratory tests, track sample shipments, and access certified digital reports.",
};

export default function Page() {
  return <RegisterPage />;
}