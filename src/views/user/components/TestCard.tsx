"use client";

import { type MouseEvent } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/lib/api/cart";
import { toast } from "sonner";
import { useCartDrawer } from "@/components/cart/CartDrawerContext";
import type { Product } from "@/lib/placeholder-data";

export type TestItemType = {
  _id?: string;
  name?: string;
  testName?: string;
  category?: string;
  testCount?: number;
  offerPrice?: number;
  price?: number;
  mrp?: number;
  turnAroundTime?: string;
  tat?: string;
  isPopular?: boolean;
  tag?: string;
  description?: string;
  features?: (string | { name?: string })[];
  image?: string;
  imageUrl?: string;
  icon?: string;
  metadata?: {
    parameters?: string[];
  };
};

export type TestCardProps = {
  p?: Product;
  t?: TestItemType;
  cartItems?: Record<string, number>;
  addToCart?: (id: string, e: MouseEvent<HTMLButtonElement>) => void;
  removeFromCart?: (id: string, e: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
};

export const TestCard = ({ p, t, className }: TestCardProps) => {
  const queryClient = useQueryClient();
  const { openCart } = useCartDrawer();

  const discountPct = (price: number, mrp: number) => {
    if (!mrp || mrp <= price) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
  };

  const id = t?._id || (t as any)?.id || p?.id || "unknown";
  const isTest = (t && t.testName !== undefined) || (t && (t as any).itemType === "TEST") || (p && (p as any).itemType === "TEST");
  const itemType = isTest ? "TEST" : "PACKAGE";

  const name = t?.testName || t?.name || p?.name || "Food Safety Test";
  const parametersCount = t?.metadata?.parameters?.length || t?.testCount || p?.testCount || 0;

  const price = t?.offerPrice ? t.offerPrice : t?.price || (p?.testCount ? p.testCount * 150 + 999 : 999);
  const mrp = isTest ? t?.price : t?.mrp || (p?.testCount ? p.testCount * 260 + 1500 : 1500);

  const discount = discountPct(price, mrp);
  const turnAroundTime = t?.turnAroundTime || t?.tat || "2-3 Days";
  const iconUrl = t?.image || t?.imageUrl || t?.icon;

  const { data: cartResponse } = useQuery({ queryKey: ["cart"], queryFn: cartApi.getCart });
  const serverCartItems = cartResponse?.data?.items || [];

  const isInCart = serverCartItems.some(
    (item: { itemType: string; testId?: { _id: string }; packageId?: { _id: string } }) =>
      (item.itemType === "TEST" && item.testId?._id === id) ||
      (item.itemType === "PACKAGE" && item.packageId?._id === id)
  );

  const addMutation = useMutation({
    mutationFn: (data: { itemType: "TEST" | "PACKAGE"; testId?: string; packageId?: string; parameters?: string[] }) =>
      cartApi.addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart!");
      openCart();
    },
    onError: (err: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    },
  });

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (id === "unknown" || isInCart || addMutation.isPending) return;
    addMutation.mutate({
      itemType,
      ...(itemType === "TEST" ? { testId: id } : { packageId: id }),
      parameters: [],
    });
  };


  return (
    <Link
      href={itemType === "TEST" ? `/tests/${id}` : `/packages/${id}`}
      className={cn(
        "group m-2 flex w-[280px] shrink-0 flex-col overflow-hidden bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-brand-action/30 transition-all duration-300 cursor-pointer decoration-transparent",
        className
      )}
    >
      <div className="h-14 w-14 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden shadow-sm mb-4">
        {iconUrl ? (
          <img src={iconUrl} alt={name} width={56} height={56} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <img
            src="/stock_image/WebApp Stock Images/Gemini_Generated_Image_3gjaol3gjaol3gja.webp"
            alt={name || "Litmus"}
            width={56}
            height={56}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )}


      </div>

      <h3 className="font-heading text-lg font-bold text-slate-800 tracking-tight leading-[1.3] group-hover:text-brand-action transition-colors line-clamp-2 min-h-[46px] mb-3">
        {name}
      </h3>

      <div className="font-body flex flex-col gap-1.5 leading-[1.5]">
        <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
          <span className="text-brand-primary font-semibold">{itemType === "PACKAGE" ? "Package" : "Test"}</span>
          <span className="opacity-40">•</span>
          <span>{itemType === "PACKAGE" ? `Contains ${parametersCount} tests` : `${parametersCount} parameters`}</span>
          <ChevronDown className="h-4 w-4 text-slate-400 ml-0.5" />
        </div>
        <p className="text-xs text-slate-500 font-normal">Report within {turnAroundTime}</p>
      </div>

      <div className="mt-auto pt-6 flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span suppressHydrationWarning className="font-data text-xl font-bold text-slate-900 tracking-tight leading-[1.4]">
              ₹{formatCurrency(price)}
            </span>
            {discount > 0 && (
              <>
                <span suppressHydrationWarning className="font-data text-xs text-slate-400 line-through font-normal">
                  ₹{formatCurrency(mrp)}
                </span>
                <span className="font-data text-xs font-semibold text-emerald-600 tracking-wide">{discount}% off</span>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isInCart || addMutation.isPending}
          className={cn(
            "inline-flex items-center justify-center h-10 px-6 rounded-xl font-bold text-[12px] uppercase tracking-wider transition-all border shrink-0",
            isInCart
              ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
              : "bg-brand-action text-white border-brand-action hover:bg-brand-action-hover shadow-sm hover:shadow-md active:scale-95"
          )}
        >
          {addMutation.isPending ? "Adding" : isInCart ? "Added" : "Book"}
        </button>
      </div>
    </Link>
  );
};
