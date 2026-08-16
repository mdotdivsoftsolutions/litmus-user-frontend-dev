import type { Metadata } from "next";
import CartPage from "@/views/user/CartPage";

export const metadata: Metadata = {
  title: "Your Cart | Litmus Diagnostics",
  description: "Review selected tests, testing packages, order summary, and proceed to booking.",
};

export default function Page() {
  return <CartPage />;
}