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

  const handleBookNow = (e?: React.MouseEvent) => {
    const isAuthStored = typeof window !== "undefined" && localStorage.getItem("litmus_auth_active") === "1";
    if (!userResponse?.data && !isAuthStored) {
      if (e) e.preventDefault();
      window.dispatchEvent(new Event("openAuthModal"));
      return;
    }
  };

  const bookingHref = pkg ? `/bookings/new?packageId=${pkg._id}` : "/bookings/new";

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
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-16 space-y-8 animate-pulse">
        <Skeleton className="h-6 w-48 rounded" />
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-6">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground">Package Not Found</h2>
        <p className="text-muted-foreground mt-2">The requested package could not be found or is inactive.</p>
        <Button className="mt-6" onClick={() => router.push("/packages")}>Back to Packages</Button>
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
            asChild
            className="hidden sm:flex h-9 px-5 rounded-lg bg-gradient-to-r from-brand-card-from to-brand-card-to text-white font-bold text-xs shadow-md hover:shadow-lg transition-all"
          >
            <Link href={bookingHref} onClick={(e) => handleBookNow(e)}>
              Book Panel Now
            </Link>
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
            bookingHref={bookingHref}
          />
        </div>
      </div>
    </div>
  );
}
