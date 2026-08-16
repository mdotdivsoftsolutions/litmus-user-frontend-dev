"use client";

import { useCartDrawer } from "./CartDrawerContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/lib/api/cart";
import { authApi } from "@/lib/api/auth";
import { CartDrawerItem } from "./CartDrawerItem";
import { CartDrawerFooter } from "./CartDrawerFooter";
import { CartDrawerEmpty } from "./CartDrawerEmpty";

interface CartDrawerProps {
  children: React.ReactNode;
}

export function CartDrawer({ children }: CartDrawerProps) {
  const { open: isOpen, setOpen: setIsOpen } = useCartDrawer();
  const queryClient = useQueryClient();

  const { data: cartResponse, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartApi.getCart(),
  });

  const { data: userResponse } = useQuery({
    queryKey: ["userProfile"],
    queryFn: authApi.getMe,
    retry: false,
  });
  const user = userResponse?.data;

  const cartItems = cartResponse?.data?.items || [];
  const subtotal = cartItems.reduce((a: number, b: any) => a + b.price, 0);
  const totalMrp = cartItems.reduce((a: number, b: any) => a + b.mrp, 0);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const removeMutation = useMutation({
    mutationFn: (id: string) => cartApi.removeFromCart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleCheckoutClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setIsOpen(false);
      window.dispatchEvent(new Event("openAuthModal"));
    } else {
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 rounded-none border-none flex flex-col h-full bg-slate-50">
        <SheetHeader className="p-5 bg-white border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
              <ShoppingCart className="h-5.5 w-5.5 text-slate-400" />
            </div>
            <div>
              <SheetTitle className="text-lg font-semibold text-slate-800 tracking-tight">
                Access Your Selection
              </SheetTitle>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-[0.15em]">
                {cartItems.length} Analytical Items Listed
              </p>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
            </div>
          ) : cartItems.length === 0 ? (
            <CartDrawerEmpty onClose={() => setIsOpen(false)} />
          ) : (
            <div className="px-6 space-y-2 py-4">
              {cartItems.map((item: any) => (
                <CartDrawerItem
                  key={item._id}
                  item={item}
                  onRemove={(id) => removeMutation.mutate(id)}
                  isRemoving={removeMutation.isPending && removeMutation.variables === item._id}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        {cartItems.length > 0 && (
          <CartDrawerFooter
            subtotal={subtotal}
            gst={gst}
            total={total}
            onClose={() => setIsOpen(false)}
            onCheckout={handleCheckoutClick}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
