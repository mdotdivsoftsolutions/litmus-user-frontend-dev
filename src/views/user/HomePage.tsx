"use client";

import { HomeHero } from "./components/HomeHero";
import { useState, type MouseEvent } from "react";
import { HomeTests } from "./components/HomeTests";
import { PartnerLabs } from "./components/home/PartnerLabs";
import { PromoBanner } from "./components/home/PromoBanner";
import { WhatsAppBanner } from "./components/home/WhatsAppBanner";
import { CustomerReviews } from "./components/home/CustomerReviews";
import { FAQ } from "./components/home/FAQ";
import { SpecialityCarousel } from "./components/home/SpecialityCarousel";
import { HowToBookProcess } from "./components/home/HowToBookProcess";
import { SafetyCheckupBanner } from "./components/home/SafetyCheckupBanner";
import { FooterSEO } from "@/components/layout/footer/FooterSEO";
import { motion } from "framer-motion";

const FadeIn = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

export default function HomePage() {
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
    <div className="bg-white min-h-screen overflow-x-hidden">

      {/* ═══════════ HERO & METRICS ═══════════ */}
      <HomeHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* ═══════════ POPULAR TESTS CAROUSEL ═══════════ */}
      <FadeIn>
        <HomeTests
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          cartItems={cartItems}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />
      </FadeIn>

      {/* ═══════════ POPULAR PACKAGES ═══════════ */}
      <FadeIn>
        <PromoBanner className="pb-12 md:pb-16" />
      </FadeIn>

      {/* ═══════════ TESTS BY FOOD CATEGORY ═══════════ */}
      <FadeIn>
        <SpecialityCarousel />
      </FadeIn>

      {/* ═══════════ HOW WE WORK ═══════════ */}
      <FadeIn>
        <HowToBookProcess className="bg-white" />
      </FadeIn>

      {/* ═══════════ TRUSTED PARTNER LABORATORIES ═══════════ */}
      <FadeIn>
        <PartnerLabs />
      </FadeIn>

      {/* ═══════════ CUSTOMER REVIEWS ═══════════ */}
      <FadeIn>
        <CustomerReviews />
      </FadeIn>

      {/* ═══════════ SAFETY CHECKUP BANNER ═══════════ */}
      <FadeIn>
        <SafetyCheckupBanner />
      </FadeIn>

      {/* ═══════════ FAQ ═══════════ */}
      <FadeIn>
        <FAQ />
      </FadeIn>

      {/* ═══════════ SEO CONTENT ═══════════ */}
      <FadeIn>
        <FooterSEO />
      </FadeIn>
    </div>
  );
}
