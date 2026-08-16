import type { Metadata } from "next";
import HomePage from "@/views/user/HomePage";

export const metadata: Metadata = {
  title: "Litmus | Accredited Food & Diagnostic Testing Network",
  description: "Book verified food, water, agricultural, and clinical diagnostics across NABL & FSSAI certified laboratories in India.",
  openGraph: {
    title: "Litmus | Accredited Food & Diagnostic Testing Network",
    description: "Book verified food, water, agricultural, and clinical diagnostics across NABL & FSSAI certified laboratories in India.",
  },
};

export const revalidate = 60;

export default function Page() {
  return <HomePage />;
}
