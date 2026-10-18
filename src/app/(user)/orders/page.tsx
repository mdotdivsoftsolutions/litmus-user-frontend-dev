import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import OrdersPage from "@/views/user/OrdersPage";

export const metadata: Metadata = pageMetadata({
  title: "Track Your Food Test Sample & Report | Litmus Labs",
  description:
    "Track your food test sample in real time and download digital NABL accredited reports from your Litmus Labs account. Available across India.",
  path: "/orders",
});

export default function Page() {
  return <OrdersPage />;
}
