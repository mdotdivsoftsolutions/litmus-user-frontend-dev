"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartDrawer } from "@/components/cart/CartDrawerContext";

/** Visiting `/cart` opens the shared cart drawer and sends the user back (footer / deep link). */
export default function CartOpenerPage() {
  const { openCart } = useCartDrawer();
  const router = useRouter();

  useEffect(() => {
    openCart();
    const hasHistory = typeof window !== "undefined" && window.history.length > 1;
    if (hasHistory) {
      router.back();
    } else {
      router.replace("/home");
    }
  }, [openCart, router]);

  return null;
}
