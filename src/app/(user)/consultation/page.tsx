import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import ConsultationPage from "@/views/user/ConsultationPage";

export const metadata: Metadata = pageMetadata({
  title: "Free Food Safety Consultation in India | Litmus Labs",
  description:
    "Talk to Litmus Labs experts about FSSAI compliance, FoSTaC training & product development in Chennai and Kochi. Book your free consultation today.",
  path: "/consultation",
});

export default function Page() {
  return <ConsultationPage />;
}