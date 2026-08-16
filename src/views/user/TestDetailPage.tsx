"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartDrawer } from "@/components/cart/CartDrawerContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { testApi } from "@/lib/api/test";
import { cartApi } from "@/lib/api/cart";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";
import { TestDetailHeader } from "./components/test-detail/TestDetailHeader";
import { TestParametersSelector } from "./components/test-detail/TestParametersSelector";
import { TestBookingSidebar } from "./components/test-detail/TestBookingSidebar";

export default function TestDetailPage({ id: propId }: { id?: string }) {
  const params = useParams();
  const id = propId || (params?.id as string);
  const [testObj, setTestObj] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedParams, setSelectedParams] = useState<string[]>([]);
  const { openCart } = useCartDrawer();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: userResponse } = useQuery({ queryKey: ["userProfile"], queryFn: authApi.getMe, retry: false });
  const { data: cartResponse } = useQuery({ queryKey: ["cart"], queryFn: cartApi.getCart });
  const cartItems = cartResponse?.data?.items || [];

  const isInCart = !!(testObj && cartItems.some((item: any) => item.itemType === "TEST" && item.testId?._id === testObj._id));

  const addMutation = useMutation({
    mutationFn: (data: any) => cartApi.addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart!");
      openCart();
    },
    onError: () => toast.error("Failed to add to cart"),
  });

  const handleAddToCart = () => {
    if (!testObj || isInCart || addMutation.isPending) return;
    addMutation.mutate({ itemType: "TEST", testId: testObj._id, parameters: selectedParams });
  };

  const handleBookNow = () => {
    if (!userResponse?.data) {
      window.dispatchEvent(new Event("openAuthModal"));
      return;
    }
    if (!testObj) return;
    const searchParams = new URLSearchParams();
    searchParams.set("testId", testObj._id);
    if (selectedParams.length > 0) searchParams.set("params", selectedParams.join(","));
    router.push(`/bookings/new?${searchParams.toString()}`);
  };

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await testApi.getTestById(id as string);
        if (response.data) {
          setTestObj(response.data);
          setSelectedParams(response.data.metadata?.parameters?.map((p: any) => p.name) || []);
        }
      } catch (err) {
        console.error("Failed to fetch test:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTest();
  }, [id]);

  const toggleParameter = (paramName: string) => {
    setSelectedParams((prev) => (prev.includes(paramName) ? prev.filter((p) => p !== paramName) : [...prev, paramName]));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 md:pb-20 space-y-6 animate-pulse">
        <Skeleton className="h-4 w-48 mb-6" />
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-6">
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-[450px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!testObj) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in duration-500">
        <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 border-8 border-slate-50">
          <FlaskConical className="h-10 w-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Test Not Found</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8">We couldn&apos;t find the test you&apos;re looking for.</p>
        <Button asChild className="bg-brand-action hover:bg-brand-action-hover h-11 px-8 rounded-xl font-medium shadow-sm">
          <Link href="/tests">Browse All Tests</Link>
        </Button>
      </div>
    );
  }

  const parameters = testObj.metadata?.parameters || [];
  const calculatedPrice = parameters.reduce((sum: number, p: any) => (selectedParams.includes(p.name) ? sum + (Number(p.price) || 0) : sum), 0);
  const originalPrice = calculatedPrice > 0 ? calculatedPrice : testObj.price || 0;
  let discountAmount = 0;
  if (testObj.discountType === "PERCENTAGE") discountAmount = originalPrice * ((testObj.discountValue || 0) / 100);
  else if (testObj.discountType === "FLAT") discountAmount = testObj.discountValue || 0;
  const price = Math.max(0, originalPrice - discountAmount);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:pb-20 space-y-6 animate-fade-in">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/tests" className="hover:text-foreground">Tests</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{testObj.testName}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <TestDetailHeader testObj={testObj} />
          <TestParametersSelector parameters={parameters} selectedParams={selectedParams} toggleParameter={toggleParameter} />
        </div>

        <TestBookingSidebar
          testObj={testObj}
          price={price}
          originalPrice={originalPrice}
          discountAmount={discountAmount}
          selectedParamsCount={selectedParams.length}
          totalParamsCount={parameters.length}
          isInCart={isInCart}
          isAddingToCart={addMutation.isPending}
          onAddToCart={handleAddToCart}
          onBookNow={handleBookNow}
        />
      </div>
    </div>
  );
}
