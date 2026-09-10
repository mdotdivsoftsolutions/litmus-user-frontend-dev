import type { Metadata } from "next";
import CareersPage from "@/views/user/CareersPage";

export const metadata: Metadata = {
  title: "Careers & Openings | Litmus Testing Labs",
  description: "Join Litmus to build trustworthy food safety testing. Explore engineering, laboratory science, operations, and growth roles.",
};

export default function Page() {
  return <CareersPage />;
}