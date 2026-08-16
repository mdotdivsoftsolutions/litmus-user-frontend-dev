"use client";

import { Building2 } from "lucide-react";
import { PolicyHero } from "./components/policies/PolicyHero";
import { AboutStorySection } from "./components/about/AboutStorySection";
import { AboutMetricsSection } from "./components/about/AboutMetricsSection";
import { AboutVisionMission } from "./components/about/AboutVisionMission";
import { AboutValuesPillars } from "./components/about/AboutValuesPillars";
import { AboutMilestonesQuality } from "./components/about/AboutMilestonesQuality";

export default function AboutPage() {
  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen">
      <PolicyHero
        wide
        icon={Building2}
        eyebrow="Company · About Litmus"
        title={
          <>
            Diagnostics infrastructure{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">
              for safer food
            </span>
          </>
        }
        subtitle="We connect brands, accredited laboratories, and consumers through one trusted layer — booking, logistics orchestration, and clear reporting. Demo narrative below; replace with counsel- and brand-approved copy."
      />

      <AboutStorySection />
      <AboutMetricsSection />
      <AboutVisionMission />
      <AboutValuesPillars />
      <AboutMilestonesQuality />
    </div>
  );
}
