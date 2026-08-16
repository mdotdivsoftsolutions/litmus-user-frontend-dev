import type { Metadata } from "next";
import CareersPage from "@/views/user/CareersPage";

export const metadata: Metadata = {
  title: "Careers & Openings | Litmus Diagnostics",
  description: "Join Litmus to build trustworthy diagnostics. Explore engineering, laboratory science, operations, and growth roles.",
};

export default function Page() {
  return <CareersPage />;
}