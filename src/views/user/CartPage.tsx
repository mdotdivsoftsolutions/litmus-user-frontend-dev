"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ShoppingCart, Lock, Shield, Tag, LogIn, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cartApi } from "@/lib/api/cart";
import { authApi } from "@/lib/api/auth";

export default function CartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [couponApplied, setCouponApplied] = useState(false);

  // Live cart query
  const { data: cartResponse, isLoading: isCartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartApi.getCart(),
  });

  // User profile query
  const { data: userResponse, isLoading: isUserLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: authApi.getMe,
    retry: false,
  });

  const user = userResponse?.data;
  const items = cartResponse?.data?.items || [];

  // Auto open login modal if ?auth=login query parameter is present and user is not authenticated
  useEffect(() => {
    const authAction = searchParams.get("auth");
    if (authAction === "login" && !user && !isUserLoading) {
      window.dispatchEvent(new Event("openAuthModal"));
    }
  }, [searchParams, user, isUserLoading]);

  // Remove item mutation
  const removeMutation = useMutation({
    mutationFn: (id: string) => cartApi.removeFromCart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Item removed from cart");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to remove item");
    },
  });

  // Calculations
  const subtotal = items.reduce((sum: number, item: any) => sum + (Number(item.price) || 0), 0);
  const totalMrp = items.reduce((sum: number, item: any) => sum + (Number(item.mrp) || Number(item.price) || 0), 0);
  const discount = Math.max(0, totalMrp - subtotal);
  const couponDiscount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const gst = Math.round((subtotal - couponDiscount) * 0.18);
  const total = Math.max(0, subtotal - couponDiscount + gst);
  const totalSavings = discount + couponDiscount + 150; // including free platform fee

  const handleApplyCoupon = () => {
    if (couponApplied) {
      setCouponApplied(false);
      toast.info("Coupon removed");
    } else {
      setCouponApplied(true);
      toast.success("Coupon LITMUS10 applied! 10% extra discount added.");
    }
  };

  const handleProceedToBook = (e: React.MouseEvent) => {
    const isAuthStored = typeof window !== "undefined" && localStorage.getItem("litmus_auth_active") === "1";
    if (!user && !isAuthStored) {
      e.preventDefault();
      toast.info("Please log in to proceed with your booking.");
      window.dispatchEvent(new Event("openAuthModal"));
    } else {
      router.push("/bookings/new");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2 leading-[1.3]">
          <ShoppingCart className="h-6 w-6 text-brand-action" /> Your Cart
        </h1>
        {items.length > 0 && (
          <span className="text-xs sm:text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-fit">
            {items.length} {items.length === 1 ? "Item" : "Items"} Selected
          </span>
        )}
      </div>

      {/* Guest Login Banner (Only shown if user is not logged in) */}
      {!user && !isUserLoading && (
        <div className="bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border border-sky-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-100 text-brand-action flex items-center justify-center shrink-0">
              <LogIn className="h-5 w-5 text-brand-primary" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-slate-900 text-sm sm:text-base">
                Have an existing booking or saved tests?
              </h3>
              <p className="font-body text-xs sm:text-sm text-slate-600">
                Log in to restore your saved cart and priority slots.
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={() => window.dispatchEvent(new Event("openAuthModal"))}
            className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary/90 text-white font-body font-semibold text-xs sm:text-sm rounded-xl px-5 h-10 shrink-0 shadow-sm transition-all"
          >
            Log In
          </Button>
        </div>
      )}

      {/* Cart Content State */}
      {isCartLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
          <p className="text-sm font-medium text-slate-500">Loading your cart items...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 sm:py-20 space-y-5 max-w-md mx-auto">
          <div className="h-20 w-20 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
            <ShoppingCart className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-heading text-xl font-bold text-slate-800">Your Cart is Empty</h2>
            <p className="font-body text-slate-500 text-sm leading-relaxed">
              {!user
                ? "Have an existing booking or saved tests? Log in to restore your cart, or browse our comprehensive test directory."
                : "You have not added any food tests or packages to your cart yet."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {!user && (
              <Button
                onClick={() => window.dispatchEvent(new Event("openAuthModal"))}
                className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary/90 text-white font-body font-semibold text-sm rounded-xl px-6 h-11 shadow-sm"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Log In to View Saved Cart
              </Button>
            )}
            <Button
              asChild
              variant={user ? "default" : "outline"}
              className={
                user
                  ? "w-full sm:w-auto bg-brand-action hover:bg-brand-action-hover text-white font-body font-semibold text-sm rounded-xl px-6 h-11 shadow-md"
                  : "w-full sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-50 font-body font-semibold text-sm rounded-xl px-6 h-11"
              }
            >
              <Link href="/tests">Browse Tests</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Cart Items List */}
          <div className="lg:col-span-3 space-y-3">
            {items.map((item: any) => {
              const title = item.itemType === "TEST" 
                ? (item.testId?.testName || "Food Test") 
                : (item.packageId?.name || "Test Package");
              const isPackage = item.itemType === "PACKAGE";
              const parametersCount = item.parameters?.length || 0;
              const isRemoving = removeMutation.isPending && removeMutation.variables === item._id;

              return (
                <Card key={item._id} className="border border-slate-100 rounded-2xl shadow-sm bg-white overflow-hidden hover:border-slate-200 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-heading font-bold text-base text-slate-900 leading-[1.3] truncate">
                            {title}
                          </h3>
                          <Badge variant={isPackage ? "default" : "secondary"} className="text-[10px] font-semibold tracking-wider uppercase">
                            {isPackage ? "Package" : "Test"}
                          </Badge>
                        </div>

                        <p className="font-body text-xs sm:text-sm text-slate-500 font-medium leading-[1.5]">
                          {isPackage 
                            ? (item.packageId?.tests ? `${item.packageId.tests.length} tests included in package` : "Comprehensive Analytical Package")
                            : parametersCount > 0 
                              ? `${parametersCount} ${parametersCount === 1 ? "parameter" : "parameters"} selected`
                              : "Standard parameter set"}
                        </p>

                        {/* Parameter list tags if test */}
                        {!isPackage && item.parameters && item.parameters.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {item.parameters.slice(0, 3).map((param: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-[10px] font-normal bg-slate-50 text-slate-600 border-slate-200">
                                {param}
                              </Badge>
                            ))}
                            {item.parameters.length > 3 && (
                              <span className="text-[10px] text-slate-400 self-center">
                                +{item.parameters.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Turnaround Time or Lab info */}
                        {item.testId?.turnAroundTime && (
                          <p className="text-[11px] font-medium text-slate-400 pt-0.5">
                            Estimated TAT: <span className="text-slate-600 font-semibold">{item.testId.turnAroundTime}</span>
                          </p>
                        )}
                      </div>

                      {/* Pricing and Action */}
                      <div className="text-right space-y-1 shrink-0">
                        {item.mrp > item.price && (
                          <p className="font-data text-xs text-slate-400 line-through font-normal">
                            ₹{Number(item.mrp).toLocaleString()}
                          </p>
                        )}
                        <p className="font-data font-bold text-brand-action text-xl leading-[1.4]">
                          ₹{Number(item.price).toLocaleString()}
                        </p>
                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => removeMutation.mutate(item._id)}
                            disabled={isRemoving}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1 disabled:opacity-50"
                            title="Remove from cart"
                          >
                            {isRemoving ? (
                              <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <Card className="rounded-2xl shadow-sm border border-slate-100 bg-white">
                <CardContent className="p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="font-body font-bold text-slate-900 text-sm">
                      {items.length} {items.length === 1 ? "Product" : "Products"} Added
                    </span>
                    <div className="text-right">
                      {totalMrp > subtotal && (
                        <span className="font-data text-xs text-slate-400 line-through mr-2 font-normal">
                          ₹{totalMrp.toLocaleString()}
                        </span>
                      )}
                      <span className="font-data text-xl font-bold text-brand-action leading-[1.4]">
                        ₹{subtotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleProceedToBook}
                    className="w-full bg-brand-action hover:bg-brand-action-hover text-white rounded-xl h-12 font-body font-semibold text-base shadow-md hover:shadow-lg transition-all active:scale-95"
                  >
                    Proceed to Book
                  </Button>

                  {/* Coupon Box */}
                  <div className="border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-brand-action" />
                        <span className="font-data font-bold text-slate-900 text-sm">LITMUS10</span>
                      </div>
                      <Button
                        type="button"
                        onClick={handleApplyCoupon}
                        variant="outline"
                        size="sm"
                        className={
                          couponApplied
                            ? "rounded-lg border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold h-8 px-3"
                            : "rounded-lg border-brand-action text-brand-action hover:bg-brand-action/10 text-xs font-semibold h-8 px-3"
                        }
                      >
                        {couponApplied ? "REMOVE" : "APPLY"}
                      </Button>
                    </div>
                    {couponApplied ? (
                      <p className="font-body text-xs text-emerald-600 font-medium mt-1.5 flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" />
                        Saved ₹{couponDiscount.toLocaleString()} with coupon LITMUS10!
                      </p>
                    ) : (
                      <p className="font-body text-xs text-slate-500 font-medium mt-1">
                        Apply to save 10% extra on this order
                      </p>
                    )}
                  </div>

                  {/* Payment Breakdown */}
                  <div className="border-t border-slate-100 pt-4 space-y-2.5 text-sm font-body">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total MRP</span>
                      <span className="font-data font-medium text-slate-700">₹{totalMrp.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-brand-action font-semibold">Discount on MRP</span>
                        <span className="font-data text-emerald-600 font-bold">- ₹{discount.toLocaleString()}</span>
                      </div>
                    )}
                    {couponApplied && (
                      <div className="flex justify-between">
                        <span className="text-brand-action font-semibold">Coupon Discount</span>
                        <span className="font-data text-emerald-600 font-bold">- ₹{couponDiscount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">Platform Fee</span>
                      <span>
                        <span className="font-data line-through text-slate-400 mr-1.5">₹150</span>
                        <span className="font-data text-emerald-600 font-bold">FREE</span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">GST (18%)</span>
                      <span className="font-data font-medium text-slate-700">₹{gst.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-base text-slate-900">
                      <span>To Pay</span>
                      <span className="font-data text-xl text-brand-action font-bold leading-[1.4]">
                        ₹{total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {totalSavings > 0 && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3.5 py-2.5 text-center">
                      <span className="font-body text-xs text-emerald-800 font-semibold">
                        🏷 You will save ₹{totalSavings.toLocaleString()} on this order.
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-2 font-data">
                    <span className="flex items-center gap-1">
                      <Lock className="h-3.5 w-3.5 text-slate-400" /> Secure Payment
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="h-3.5 w-3.5 text-emerald-600" /> FSSAI Compliant
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
