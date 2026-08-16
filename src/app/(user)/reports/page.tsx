import type { Metadata } from "next";
import ConsumerReportsPage from "@/views/user/ConsumerReportsPage";

export const metadata: Metadata = {
  title: "Verified Test Reports | Litmus",
  description: "Access and download digital, verified test reports issued by accredited laboratory partners.",
};

export default function Page() {
  return <ConsumerReportsPage />;
}
