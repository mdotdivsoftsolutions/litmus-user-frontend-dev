"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { packageApi } from "@/lib/api/package";
import { cartApi } from "@/lib/api/cart";
import { authApi } from "@/lib/api/auth";
import { useCartDrawer } from "@/components/cart/CartDrawerContext";
import { toast } from "sonner";
import { PackageDetailHeader } from "./components/package-detail/PackageDetailHeader";
import { PackageTestsIncluded } from "./components/package-detail/PackageTestsIncluded";
import { PackageFaqSection } from "./components/package-detail/PackageFaqSection";
import { PackageBookingSidebar } from "./components/package-detail/PackageBookingSidebar";

export default function PackageDetailPage({ id: propId }: { id?: string }) {
  const params = useParams();
  const id = propId || (params?.id as string);
  const router = useRouter();
  const { openCart } = useCartDrawer();
  const queryClient = useQueryClient();

  const { data: userResponse } = useQuery({ queryKey: ["userProfile"], queryFn: authApi.getMe, retry: false });
  const { data: cartResponse } = useQuery({ queryKey: ["cart"], queryFn: cartApi.getCart });
  const cartItems = cartResponse?.data?.items || [];
  const isInCart = cartItems.some((item: any) => item.itemType === "PACKAGE" && item.packageId?._id === id);

  const { data: packageResponse, isLoading } = useQuery({
    queryKey: ["package", id],
    queryFn: () => packageApi.getPackage(id!),
    enabled: !!id,
  });

  const pkg = packageResponse?.data;

  const handleBookNow = () => {
    if (!userResponse?.data) {
      window.dispatchEvent(new Event("openAuthModal"));
      return;
    }
    if (!pkg) return;
    router.push(`/bookings/new?packageId=${pkg._id}`);
  };

  const addMutation = useMutation({
    mutationFn: (data: any) => cartApi.addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Package added to cart!");
      openCart();
    },
    onError: () => toast.error("Failed to add to cart"),
  });

  const handleAddToCart = () => {
    if (!pkg || isInCart || addMutation.isPending) return;
    addMutation.mutate({ itemType: "PACKAGE", packageId: pkg._id });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="flex gap-8 w-full max-w-7xl">
          <Skeleton className="h-[400px] flex-1 rounded-xl" />
          <Skeleton className="h-[400px] w-[350px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">Package Not Found</h2>
          <p className="text-slate-500 mt-2">The package you are looking for does not exist.</p>
          <Button className="mt-6" onClick={() => router.push("/packages")}>Back to Packages</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 animate-fade-in mt-28">
      <div className="z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
          <nav className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
            <Link href="/packages" className="hover:text-brand-primary transition-colors">Packages</Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="text-slate-800 font-bold truncate max-w-[200px] sm:max-w-none">{pkg.name}</span>
          </nav>
          <Button
            onClick={handleBookNow}
            className="hidden sm:flex h-9 px-5 rounded-lg bg-gradient-to-r from-brand-card-from to-brand-card-to text-white font-bold text-xs shadow-md hover:shadow-lg transition-all"
          >
            Book Panel Now
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-5">
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          <div className="lg:col-span-8 space-y-8">
            <PackageDetailHeader pkg={pkg} />
            <PackageTestsIncluded pkg={pkg} />
            <PackageFaqSection />
          </div>

          <PackageBookingSidebar
            pkg={pkg}
            isInCart={isInCart}
            isAddingToCart={addMutation.isPending}
            onAddToCart={handleAddToCart}
            onBookNow={handleBookNow}
          />
        </div>
      </div>
    </div>
  );
}
