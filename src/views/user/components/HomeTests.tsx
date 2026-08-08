"use client";

import { type MouseEvent } from "react";
import { Link } from "@/lib/router-compat";
import { products } from "@/lib/placeholder-data";
import { Activity, FileText, Check, Loader2, CheckCircle2, Beaker, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./home/SectionHeader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { packageApi } from "@/lib/api/package";
import { cartApi } from "@/lib/api/cart";
import { authApi } from "@/lib/api/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useCartDrawer } from "@/components/cart/CartDrawerContext";

type Product = (typeof products)[number];

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

  const id = t?._id || p?.id || "unknown";

  // Determine if this is a package or a test
  // const isPackage = t && (t.name !== undefined || t.category !== undefined);
  const isTest = t && t.testName !== undefined;
  const itemType = isTest ? 'TEST' : 'PACKAGE';

  const name = t?.testName || t?.name || p?.name || "Food Safety Test";
  const parametersCount = t?.metadata?.parameters?.length || t?.testCount || p?.testCount || 0;

  // For tests offerPrice is the selling price, price is MRP. For packages, price is selling price, mrp is MRP.
  const price = t?.offerPrice ? t.offerPrice : (t?.price || (p?.testCount ? p.testCount * 150 + 999 : 999));
  const mrp = isTest ? t?.price : (t?.mrp || (p?.testCount ? p.testCount * 260 + 1500 : 1500));

  const discount = discountPct(price, mrp);
  const turnAroundTime = t?.turnAroundTime || t?.tat || "2-3 Days";

  const topBadgeLeft = t?.category || "COMPLIANCE";
  const topBadgeRight = t?.isPopular ? "MOST POPULAR" : (t?.tag || (p as Product & { badge?: string })?.badge);

  const description = t?.description || "Essential testing parameters for small-scale food manufacturers and businesses.";
  const features = t?.metadata?.parameters?.slice(0, 4) || t?.features?.slice(0, 4) || [
    "Microbial Load Analysis",
    "Moisture & Ash Content",
    "Heavy Metal Screening",
    "Shelf Life Prediction"
  ];

  // Support for custom icons/images
  const iconUrl = t?.image || t?.imageUrl || t?.icon;

  const { data: cartResponse } = useQuery({ queryKey: ['cart'], queryFn: cartApi.getCart });
  const cartItems = cartResponse?.data?.items || [];

  // Determine if this item is in the cart
  const isInCart = cartItems.some((item: { itemType: string; testId?: { _id: string }; packageId?: { _id: string } }) =>
    (item.itemType === 'TEST' && item.testId?._id === id) ||
    (item.itemType === 'PACKAGE' && item.packageId?._id === id)
  );

  const addMutation = useMutation({
    mutationFn: (data: { itemType: "TEST" | "PACKAGE"; testId?: string; packageId?: string; parameters?: string[] }) => cartApi.addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success("Added to cart!");
      openCart();
    },
    onError: (err: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  });

  const { data: userResponse } = useQuery({ queryKey: ["userProfile"], queryFn: authApi.getMe, retry: false });
  const user = userResponse?.data;

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!user) {
      window.dispatchEvent(new Event('openAuthModal'));
      return;
    }
    if (isInCart || addMutation.isPending) return;
    addMutation.mutate({
      itemType,
      ...(itemType === 'TEST' ? { testId: id } : { packageId: id }),
      parameters: []
    });
  };

  return (
    <Link
      to={itemType === 'TEST' ? `/tests/${id}` : `/packages/${id}`}
      className={cn("group m-2 flex w-[280px] shrink-0 flex-col overflow-hidden bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-brand-action/30 transition-all duration-300 cursor-pointer decoration-transparent", className)}
    >
      {/* Custom Icon / Image slot - Top Left */}
      <div className="h-14 w-14 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden shadow-sm mb-4">
        {iconUrl ? (
          <img src={iconUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <img src="/stock_image/WebApp Stock Images/Gemini_Generated_Image_3gjaol3gjaol3gja.png" alt="Litmus" className="h-full w-full object-cover" />
        )}
      </div>

      {/* Title */}
      <h3 className="text-[17px] font-bold text-slate-800 tracking-tight leading-snug group-hover:text-brand-action transition-colors line-clamp-2 min-h-[46px] mb-3">
        {name}
      </h3>

      {/* Subtitle & Details */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-[13px] text-slate-500 font-medium">
          <span className="text-emerald-600">{itemType === 'PACKAGE' ? 'Package' : 'Test'}</span>
          <span className="opacity-40">•</span>
          <span>{itemType === 'PACKAGE' ? `Contains ${parametersCount} tests` : `${parametersCount} parameters`}</span>
          <ChevronDown className="h-4 w-4 text-slate-400 ml-0.5" />
        </div>
        <p className="text-[13px] text-slate-500">
          Report within {turnAroundTime}
        </p>
      </div>

      {/* Price & Action */}
      <div className="mt-auto pt-6 flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xl font-black text-slate-800 tracking-tight">₹{price?.toLocaleString()}</span>
            {discount > 0 && (
              <>
                <span className="text-xs text-slate-400 line-through font-medium">₹{mrp?.toLocaleString()}</span>
                <span className="text-[11px] font-bold text-emerald-600 tracking-wide">{discount}% off</span>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isInCart || addMutation.isPending}
          className={cn(
            "inline-flex items-center justify-center h-10 px-6 rounded-lg font-bold text-[12px] uppercase tracking-wider transition-all border-2 shrink-0",
            isInCart
              ? "bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed"
              : "text-brand-action border-border-brand-action bg-brand-action text-white"
          )}
        >
          {addMutation.isPending ? "Adding" : (isInCart ? "Added" : "Book")}
        </button>
      </div>
    </Link>
  );
};

export type HomeTestsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartItems: Record<string, number>;
  addToCart: (id: string, e: MouseEvent<HTMLButtonElement>) => void;
  removeFromCart: (id: string, e: MouseEvent<HTMLButtonElement>) => void;
};

export const HomeTests = ({ cartItems, addToCart, removeFromCart }: HomeTestsProps) => {
  const { data: popularPackagesData, isLoading } = useQuery({
    queryKey: ['popularPackages'],
    queryFn: () => packageApi.getAllPackages()
  });

  const popularPackages = popularPackagesData?.data || [];
  // Take first 5 for UI, ideally should have isPopular param
  const displayPackages = popularPackages.slice(0, 5);

  return (
    <>
      <section className="pt-8 lg:pt-16 pb-10 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <SectionHeader
            title={
              <>
                Popular Food Testing <span className="text-gradient-brand">Packages</span>
              </>
            }
            subtitle="Our curated packages simplify food testing with pre-designed testing packages tailored to different product categories and help you save time, reduce costs, and ensure that critical parameters are not overlooked."
            action={{
              label: "View All Packages",
              href: "/packages",
            }}
          />

          <div className="flex overflow-x-auto scrollbar-hide pb-5 pt-2 -mx-2">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="m-2 flex w-[280px] shrink-0 flex-col overflow-hidden rounded-[1.25rem] border border-brand-card-from/10 bg-white">
                  <div className="h-[120px] bg-slate-100 rounded-b-[1.25rem] p-5 flex flex-col justify-end">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-8 w-1/3" />
                  </div>
                  <div className="flex-1 p-5 flex flex-col bg-gradient-to-b from-[#f4fafc] to-white">
                    <div className="mb-6 flex items-center justify-between">
                      <div className="w-1/2">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <div className="w-1/2 pl-4 border-l border-slate-100">
                        <Skeleton className="h-3 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                    <div className="mt-auto flex items-center gap-3">
                      <Skeleton className="h-11 flex-1 rounded-xl" />
                      <Skeleton className="h-11 flex-1 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))
            ) : displayPackages.length > 0 ? (
              displayPackages.map((t: TestItemType) => (
                <TestCard key={`popular-pkg-${t._id}`} t={t} cartItems={cartItems} addToCart={addToCart} removeFromCart={removeFromCart} />
              ))
            ) : (
              <div className="w-full text-center py-10 text-muted-foreground">
                No popular packages found.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
