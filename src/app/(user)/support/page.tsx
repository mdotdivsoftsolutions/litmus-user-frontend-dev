import type { Metadata } from "next";
import SupportPage from "@/views/user/SupportPage";

export const metadata: Metadata = {
  title: "Support Policy & Customer Care | Litmus",
  description: "Get assistance with your bookings, sample logistics, order modifications, and lab communications.",
};

export default function Page() {
  return <SupportPage />;
}