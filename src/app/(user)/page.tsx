import type { Metadata } from "next";
import HomePage from "@/views/user/HomePage";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { faqPageSchema, organizationSchema } from "@/lib/schema";
import { homeFaqs } from "@/views/user/components/home/faq-data";

export const metadata: Metadata = pageMetadata({
  title: "Litmus Labs | Food Testing Lab in India | NABL & FSSAI",
  description:
    "Litmus Labs offers NABL accredited food, water & agri testing across India, including Chennai & Kochi. FSSAI-approved reports & up to 15% off.",
  path: "/",
});

export const revalidate = 60;

export default function Page() {
  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={faqPageSchema(homeFaqs)} />
      <HomePage />
    </>
  );
}
