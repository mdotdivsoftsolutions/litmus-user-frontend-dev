import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import ContactPage from "@/views/user/ContactPage";

export const metadata: Metadata = pageMetadata({
  title: "Contact Litmus Labs | Book Food Testing in India",
  description:
    "Contact Litmus Labs to book food, water or agri testing in Chennai, Kochi and across India. Call, WhatsApp or write to us for quick help.",
  path: "/contact",
});

export default function Page() {
  return <ContactPage />;
}