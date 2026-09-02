"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FlaskConical, Package, Stethoscope, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

export const headerNavLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Tests", href: "/tests", icon: FlaskConical },
  { label: "Packages", href: "/packages", icon: Package },
  { label: "Consultation", href: "/consultation", icon: Stethoscope },
  { label: "Support", href: "/support", icon: Headphones },
];

export function HeaderNavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center gap-1 ml-auto">
      {headerNavLinks.map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === "/" || pathname === "/home"
            : pathname === link.href || pathname?.startsWith(link.href + "/");

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "px-3 py-1.5 text-sm font-semibold transition-colors rounded-lg border-0 outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 select-none",
              isActive ? "text-brand-action font-bold" : "text-slate-700 hover:text-brand-action"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
