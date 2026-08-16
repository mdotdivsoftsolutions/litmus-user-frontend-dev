import type { Metadata } from "next";
import LabsListingPage from "@/views/user/LabsListingPage";

export const metadata: Metadata = {
  title: "Accredited Partner Laboratories | Litmus",
  description: "Browse NABL accredited and FSSAI approved food, water, and diagnostics laboratories across India.",
};

export default function Page() {
  return <LabsListingPage />;
}