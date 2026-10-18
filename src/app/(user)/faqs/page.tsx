import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import FaqsPage from "@/views/user/FaqsPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqPageSchema } from "@/lib/schema";
import { faqs } from "@/views/user/components/policies/faqs-data";

export const metadata: Metadata = pageMetadata({
  title: "FAQs | Food Testing, NABL & FSSAI Reports | Litmus Labs",
  description:
    "Get answers on food test types, report timelines, sample pickup and FSSAI-accepted NABL reports from Litmus Labs in Chennai, Kochi and India.",
  path: "/faqs",
});

export default function Page() {
  return (
    <>
      <JsonLd data={faqPageSchema(faqs.map((f) => ({ question: f.q, answer: f.a })))} />
      <FaqsPage />
    </>
  );
}