import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import NablDataPage from "@/views/user/NablDataPage";

export const metadata: Metadata = pageMetadata({
  title: "NABL Accreditation Details | Litmus Labs",
  description:
    "View NABL accreditation scope and certificate details of Litmus Labs partner labs, trusted for food testing and FSSAI compliance across India.",
  path: "/nabl",
});

export default function Page() {
  return <NablDataPage />;
}