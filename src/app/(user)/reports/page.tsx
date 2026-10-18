import type { Metadata } from "next";
import ConsumerReportsPage from "@/views/user/ConsumerReportsPage";

export const metadata: Metadata = {
  // Signed-in / one-off page: keep it out of search results.
  robots: { index: false, follow: true },
  title: "Verified Test Reports | Litmus Labs",
  description: "Access and download digital, verified test reports issued by accredited laboratory partners.",
};

export default function Page() {
  return <ConsumerReportsPage />;
}
