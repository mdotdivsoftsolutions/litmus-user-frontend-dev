import { cartApi } from "@/lib/api/cart";

export const cartService = {
  getCart: () => cartApi.getCart(),
  addItem: (item: any) => cartApi.addItem(item),
  removeItem: (itemId: string) => cartApi.removeItem(itemId),
  clearCart: () => cartApi.clearCart(),
};
