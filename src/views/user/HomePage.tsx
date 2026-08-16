import { Suspense } from "react";
import { HomeHero } from "./components/HomeHero";
import { HomeTests, HomeTestsSkeleton } from "./components/HomeTests";
import { PartnerLabs } from "./components/home/PartnerLabs";
import { PromoBanner } from "./components/home/PromoBanner";
import { CustomerReviews } from "./components/home/CustomerReviews";
import { FAQ } from "./components/home/FAQ";
import { SpecialityCarousel } from "./components/home/SpecialityCarousel";
import { HowToBookProcess } from "./components/home/HowToBookProcess";
import { SafetyCheckupBanner } from "./components/home/SafetyCheckupBanner";
import { FooterSEO } from "@/components/layout/footer/FooterSEO";
import { packageApi } from "@/lib/api/package";
import { categoryApi } from "@/lib/api/category";
import { labApi } from "@/lib/api/lab";
import { reviewApi } from "@/lib/api/review";

const withTimeout = <T,>(promise: Promise<T>, ms = 2500): Promise<T | null> => {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]).catch(() => null);
};

async function PopularPackages() {
  const res = await withTimeout(packageApi.getAllPackages());
  return <HomeTests initialPackages={res} />;
}

async function CategorySection() {
  const res = await withTimeout(categoryApi.getCategories());
  return <SpecialityCarousel initialCategories={res} />;
}

async function LabsSection() {
  const res = await withTimeout(labApi.getLabsPublic({ isTrusted: true }));
  return <PartnerLabs initialLabs={res} />;
}

async function ReviewsSection() {
  const res = await withTimeout(reviewApi.getPublicReviews());
  return <CustomerReviews initialReviews={res} />;
}

export default function HomePage() {
  return (
    <div className="bg-white min-h-screen">
      <HomeHero />
      <Suspense fallback={<HomeTestsSkeleton />}>
        <PopularPackages />
      </Suspense>
      <PromoBanner className="pb-12 md:pb-16" />
      <Suspense fallback={null}>
        <CategorySection />
      </Suspense>
      <HowToBookProcess className="bg-white" />
      <Suspense fallback={null}>
        <LabsSection />
      </Suspense>
      <Suspense fallback={null}>
        <ReviewsSection />
      </Suspense>
      <SafetyCheckupBanner />
      <FAQ />
      <FooterSEO />
    </div>
  );
}
