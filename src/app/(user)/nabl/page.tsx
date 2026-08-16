import type { Metadata } from "next";
import NablDataPage from "@/views/user/NablDataPage";

export const metadata: Metadata = {
  title: "NABL & FSSAI Accredited Network | Litmus",
  description: "Learn about Litmus laboratory accreditation standards, ISO/IEC 17025 conformity, and regulatory recognition.",
};

export default function Page() {
  return <NablDataPage />;
}