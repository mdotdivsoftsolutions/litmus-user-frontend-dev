import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import SupportPage from "@/views/user/SupportPage";

export const metadata: Metadata = pageMetadata({
  title: "Customer Support for Food Testing Orders | Litmus Labs",
  description:
    "Need help with your food test booking, sample pickup or report? Chat with Litmus Labs support Mon–Sat, 9 AM–7 PM, or message us on WhatsApp.",
  path: "/support",
});

export default function Page() {
  return <SupportPage />;
}