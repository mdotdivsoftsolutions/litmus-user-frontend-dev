import type { Metadata } from "next";
import ContactPage from "@/views/user/ContactPage";

export const metadata: Metadata = {
  title: "Contact Us & Corporate Enquiries | Litmus",
  description: "Get in touch with Litmus for institutional testing partnerships, corporate RFPs, and customer inquiries.",
};

export default function Page() {
  return <ContactPage />;
}