"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft, Briefcase, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCareerBySlug } from "@/lib/company-careers-data";

export default function CareerDetailPage({ slug: propSlug }: { slug?: string }) {
  const params = useParams();
  const router = useRouter();
  const slug = propSlug || (params?.slug as string);
  const opening = slug ? getCareerBySlug(slug) : undefined;

  useEffect(() => {
    if (!opening && slug) {
      router.replace("/careers");
    }
  }, [opening, slug, router]);

  if (!opening) {
    return null;
  }

  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen pb-16">
      <section className="relative overflow-hidden bg-white border-b border-slate-100">
        <div className="absolute top-0 right-0 w-[55%] h-full bg-slate-50 skew-x-[-12deg] translate-x-1/4 pointer-events-none border-l border-slate-100/80" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 pt-10 pb-12 md:pt-12 md:pb-14">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-brand-primary transition-colors mb-8 mr-2 md:mr-5"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            All openings
          </Link>
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white shadow-sm border border-slate-100 text-brand-primary text-[10px] font-semibold uppercase tracking-[0.35em] mb-5">
            <Briefcase className="h-4 w-4 shrink-0" aria-hidden />
            {opening.category}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-[2rem] font-semibold text-slate-800 tracking-tight leading-tight mb-4">
            {opening.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <Badge variant="outline" className="text-[10px] font-semibold uppercase tracking-wider">
              {opening.type}
            </Badge>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4 text-slate-400" aria-hidden />
              {opening.location}
            </span>
            <span className="text-slate-400">Posted {opening.posted}</span>
          </div>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-6 pt-10 md:pt-12 space-y-10">
        <p className="text-[15px] md:text-lg text-slate-600 leading-relaxed">{opening.summary}</p>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 tracking-tight">What you will do</h2>
          <ul className="list-disc pl-5 space-y-2 text-[15px] md:text-base text-slate-600 leading-relaxed marker:text-slate-300">
            {opening.responsibilities.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 tracking-tight">What we look for</h2>
          <ul className="list-disc pl-5 space-y-2 text-[15px] md:text-base text-slate-600 leading-relaxed marker:text-slate-300">
            {opening.requirements.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <div className="pt-6 border-t border-slate-200">
          <Button asChild size="lg" className="rounded-xl px-8 bg-brand-action hover:bg-brand-action-hover text-white">
            <a href={`mailto:careers@litmustest.in?subject=Application:%20${encodeURIComponent(opening.title)}`}>
              Apply for this role
            </a>
          </Button>
        </div>
      </article>
    </div>
  );
}
