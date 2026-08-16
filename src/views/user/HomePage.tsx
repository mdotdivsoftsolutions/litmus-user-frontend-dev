"use client";

import { HomeHero } from "./components/HomeHero";
import { useState, useEffect, type MouseEvent } from "react";
import { HomeTests } from "./components/HomeTests";
import { PartnerLabs } from "./components/home/PartnerLabs";
import { PromoBanner } from "./components/home/PromoBanner";
import { WhatsAppBanner } from "./components/home/WhatsAppBanner";
import { CustomerReviews } from "./components/home/CustomerReviews";
import { FAQ } from "./components/home/FAQ";
import { SpecialityCarousel } from "./components/home/SpecialityCarousel";
import { ConsultancyServices } from "./components/home/ConsultancyServices";
import { HowToBookProcess } from "./components/home/HowToBookProcess";
import { SafetyCheckupBanner } from "./components/home/SafetyCheckupBanner";
import { FooterSEO } from "@/components/layout/footer/FooterSEO";

interface HomePageProps {
  initialPackages?: any;
  initialCategories?: any;
  initialLabs?: any;
  initialReviews?: any;
}

export default function HomePage({
  initialPackages,
  initialCategories,
  initialLabs,
  initialReviews,
}: HomePageProps = {}) {
  const [activeTab, setActiveTab] = useState("tests");
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const addToCart = (id: string, e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCartItems(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string, e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCartItems(prev => {
      const next = { ...prev };
      if (next[id] > 1) next[id]--;
      else delete next[id];
      return next;
    });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* ═══════════ HERO & METRICS ═══════════ */}
      <HomeHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* ═══════════ POPULAR TESTS CAROUSEL ═══════════ */}
      <HomeTests
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartItems={cartItems}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        initialPackages={initialPackages}
      />

      {/* ═══════════ POPULAR PACKAGES ═══════════ */}
      <PromoBanner className="pb-12 md:pb-16" />

      {/* ═══════════ TESTS BY FOOD CATEGORY ═══════════ */}
      <SpecialityCarousel initialCategories={initialCategories} />

      {/* ═══════════ HOW WE WORK ═══════════ */}
      <HowToBookProcess className="bg-white" />

      {/* ═══════════ TRUSTED PARTNER LABORATORIES ═══════════ */}
      <PartnerLabs initialLabs={initialLabs} />

      {/* ═══════════ CUSTOMER REVIEWS ═══════════ */}
      <CustomerReviews initialReviews={initialReviews} />

      {/* ═══════════ SAFETY CHECKUP BANNER ═══════════ */}
      <SafetyCheckupBanner />

      {/* ═══════════ FAQ ═══════════ */}
      <FAQ />

      {/* ═══════════ SEO CONTENT ═══════════ */}
      <FooterSEO />
    </div>
  );
}
