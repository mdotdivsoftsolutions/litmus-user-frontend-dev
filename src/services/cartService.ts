import { cartApi } from "@/lib/api/cart";

export const cartService = {
  getCart: () => cartApi.getCart(),
  addItem: (item: { itemType: "TEST" | "PACKAGE"; testId?: string; packageId?: string; parameters?: string[] }) =>
    cartApi.addToCart(item),
  addToCart: (data: { itemType: "TEST" | "PACKAGE"; testId?: string; packageId?: string; parameters?: string[] }) =>
    cartApi.addToCart(data),
  removeItem: (itemId: string) => cartApi.removeFromCart(itemId),
  removeFromCart: (itemId: string) => cartApi.removeFromCart(itemId),
  clearCart: () => cartApi.clearCart(),
};
