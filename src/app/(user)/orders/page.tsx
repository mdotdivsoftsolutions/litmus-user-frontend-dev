import type { Metadata } from "next";
import OrdersPage from "@/views/user/OrdersPage";

export const metadata: Metadata = {
  title: "My Orders & Sample Tracking | Litmus",
  description: "Track the status of your diagnostic orders, sample collection visits, and download verified laboratory reports.",
};

export default function Page() {
  return <OrdersPage />;
}
