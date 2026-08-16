"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { labApi } from "@/lib/api/lab";
import { LabDetailSkeleton } from "./components/lab-detail/LabDetailSkeleton";
import { LabHeroHeader } from "./components/lab-detail/LabHeroHeader";
import { LabTestsTab } from "./components/lab-detail/LabTestsTab";
import { LabOverviewTab } from "./components/lab-detail/LabOverviewTab";
import { LabFacilityTab } from "./components/lab-detail/LabFacilityTab";
import { LabReviewsTab } from "./components/lab-detail/LabReviewsTab";
import { LabSidebarCard } from "./components/lab-detail/LabSidebarCard";
import { LabPromoBanner } from "./components/lab-detail/LabPromoBanner";

export default function LabDetailConsumerPage({ id: propId }: { id?: string }) {
  const params = useParams();
  const id = propId || (params?.id as string);

  const { data: response, isLoading } = useQuery({
    queryKey: ["publicLab", id],
    queryFn: () => labApi.getLabByIdPublic(id!),
    enabled: !!id,
  });

  const lab = response?.data;

  const getRating = (reviews?: any[]) => {
    if (!reviews || reviews.length === 0) return "New";
    return (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1);
  };

  const getRatingDistribution = (reviews?: any[]) => {
    if (!reviews || reviews.length === 0) return [0, 0, 0, 0, 0];
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) counts[5 - Math.round(r.rating)]++;
    });
    return counts.map((c) => Math.round((c / reviews.length) * 100));
  };

  if (isLoading) return <LabDetailSkeleton />;
  if (!lab) return <div className="p-20 text-center text-muted-foreground">Laboratory not found.</div>;

  const rating = getRating(lab.reviews);
  const ratingDistribution = getRatingDistribution(lab.reviews);

  return (
    <div className="animate-fade-in min-h-screen bg-white pb-20">
      <LabHeroHeader lab={lab} rating={rating} />

      <div className="max-w-7xl mx-auto px-6 pt-10">
        <Tabs defaultValue="tests" className="space-y-5">
          <TabsList className="bg-white border-b border-slate-100 w-full justify-start h-auto p-0 gap-4 rounded-none sticky top-24 z-20">
            {["Tests", "Overview", "Facility Info", "Reviews"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab.toLowerCase().split(" ")[0]}
                className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] rounded-none border-b-2 border-transparent data-[state=active]:border-[#D32F2F] data-[state=active]:text-slate-800 text-slate-400 hover:text-slate-600 bg-transparent"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid lg:grid-cols-3 gap-12 pt-4">
            <div className="lg:col-span-2 space-y-12">
              <TabsContent value="tests" className="mt-0">
                <LabTestsTab lab={lab} />
              </TabsContent>
              <TabsContent value="overview" className="mt-0">
                <LabOverviewTab lab={lab} />
              </TabsContent>
              <TabsContent value="facility" className="mt-0">
                <LabFacilityTab lab={lab} />
              </TabsContent>
              <TabsContent value="reviews" className="mt-0">
                <LabReviewsTab lab={lab} rating={rating} ratingDistribution={ratingDistribution} />
              </TabsContent>
            </div>

            <LabSidebarCard lab={lab} />
          </div>
        </Tabs>
      </div>

      <LabPromoBanner />
    </div>
  );
}
