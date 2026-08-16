import type { Metadata } from "next";
import FaqsPage from "@/views/user/FaqsPage";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Litmus Diagnostics",
  description: "Find clear answers on test booking, sample collection, lab testing turnaround, report downloads, and pricing.",
};

export default function Page() {
  return <FaqsPage />;
}