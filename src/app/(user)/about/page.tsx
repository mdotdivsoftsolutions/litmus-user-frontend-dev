import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import AboutPage from "@/views/user/AboutPage";

export const metadata: Metadata = pageMetadata({
  title: "About Litmus Labs | NABL Accredited Food Testing Network",
  description:
    "Litmus Labs connects food businesses across India, including Chennai and Kochi, with NABL accredited, FSSAI approved labs for fast, trusted testing.",
  path: "/about",
});

export default function Page() {
  return <AboutPage />;
}