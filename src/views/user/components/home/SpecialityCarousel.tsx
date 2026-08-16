"use client";

import Link from "next/link";
import { SectionHeader } from "./SectionHeader";

const FALLBACK_IMAGE = "/stock_image/speciality-1.png";

const TINTS = [
  "bg-[#e8f5e9]",
  "bg-[#e3f2fd]",
  "bg-[#e8f4f8]",
  "bg-[#e8eaf0]",
  "bg-[#fff3e0]",
  "bg-[#fce4ec]"
];

function PastelCategoryCard({
  href,
  title,
  subtitle,
  footnote,
  image,
  tint,
}: {
  href: string;
  title: string;
  subtitle: string;
  footnote: string;
  image: string;
  tint: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100/90 bg-white shadow-[0_10px_40px_-12px_rgba(15,23,42,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-16px_rgba(15,23,42,0.18)]"
    >
      <div
        className={`relative flex h-[120px] items-center justify-center overflow-hidden sm:h-[132px] ${tint}`}
      >
        <img
          src={image || FALLBACK_IMAGE}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 "
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        {/* Title — Nunito (H5: 16px, Bold, Line-height: 1.3) */}
        <h3 className="font-heading text-base font-bold leading-[1.3] tracking-tight text-slate-900 line-clamp-1">{title}</h3>
        {/* Subtitle — Manrope (14px/12px, Regular, Line-height: 1.5) */}
        <p className="font-body mt-1 text-xs leading-[1.5] text-slate-500 line-clamp-2">{subtitle}</p>
        {/* Footnote — Inter (Badges/Data: 12px, Semibold, Line-height: 1.4) */}
        <p className="font-data-badge mt-auto pt-2 text-xs font-semibold uppercase tracking-wider text-brand-primary">
          {footnote}
        </p>
      </div>
    </Link>
  );
}

export function SpecialityCarousel({ initialCategories }: { initialCategories?: any }) {
  const categories = Array.isArray(initialCategories?.data) 
    ? initialCategories.data 
    : (Array.isArray(initialCategories) ? initialCategories : (initialCategories?.data?.data || []));

  return (
    <section className="relative flex min-h-full flex-col justify-center overflow-hidden bg-white py-8 md:py-12">
      <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] translate-x-1/2 -translate-y-1/2 rounded-full bg-red-50/30 blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4">
        <SectionHeader
          badge="Clinical Specialities"
          title={
            <>
              Tests By Food{" "}
              <span className="text-gradient-brand">
                Category
              </span>
            </>
          }
          subtitle="Explore our comprehensive food testing solutions categorized by product type for fast, reliable regulatory compliance."
          action={{
            label: "View All Categories",
            href: "/tests",
          }}
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-6">
          {categories.length > 0 ? (
            categories.map((cat: any, i: number) => (
              <div key={cat._id}>
                <PastelCategoryCard
                  href={`/tests?category=${encodeURIComponent(cat._id)}`}
                  title={cat.name}
                  subtitle={cat.description || "Explore specialized diagnostic tests for this category."}
                  footnote={`${cat.testCount || 0} tests available`}
                  image={cat.imageUrl || FALLBACK_IMAGE}
                  tint={TINTS[i % TINTS.length]}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-muted-foreground">
              No categories available at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
