"use client";

import { ReactNode } from "react";
import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: ReactNode;
  subtitle?: React.ReactNode;
  badge?: string;
  action?: {
    label: string;
    href: string;
  };
  rightContent?: ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  badge,
  action,
  rightContent,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("md:mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end", className)}>
      <div className="flex-1">
        {badge && (
          <div suppressHydrationWarning className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-card-from" data-aos="fade-right">
            {badge}
          </div>
        )}
        <h2 suppressHydrationWarning className="text-2xl font-bold leading-tight tracking-tight text-slate-800 lg:text-3xl" data-aos="fade-right" data-aos-delay="100">
          {title}
        </h2>
        {subtitle && (
          <p suppressHydrationWarning className="mt-4 text-base font-medium text-slate-500 max-w-xl leading-relaxed line-clamp-2" data-aos="fade-right" data-aos-delay="200">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {action && (
          <Link
            href={action.href}
            className="group flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-brand-action bg-brand-action px-6 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-brand-action-hover hover:shadow-md hover:scale-[1.02]"
          >
            {action.label}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
        {rightContent}
      </div>
    </div>
  );
}
