"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FlaskConical, ShoppingCart, ClipboardList, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { CartDrawer } from "../cart/CartDrawer";

interface MobileTabNavigationProps {
  cartCount: number;
}

export function MobileTabNavigation({ cartCount }: MobileTabNavigationProps) {
  const pathname = usePathname();

  const bottomTabs = [
    { label: "Home", href: "/", icon: Home },
    { label: "Tests", href: "/tests", icon: FlaskConical },
    { label: "Cart", icon: ShoppingCart },
    { label: "Orders", href: "/orders", icon: ClipboardList },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-card border-t border-border lg:hidden" aria-label="Mobile Navigation Bar">
      <div className="flex items-center justify-around h-16">
        {bottomTabs.map((tab) => {
          const isActive =
            tab.href &&
            (tab.href === "/"
              ? pathname === "/" || pathname === "/home"
              : pathname?.startsWith(tab.href));

          const content = (
            <div className="flex flex-col items-center justify-center min-w-[48px] min-h-[48px] gap-0.5 py-1 px-3 relative cursor-pointer">
              <tab.icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-brand-primary" : "text-muted-foreground"
                )}
                aria-hidden="true"
              />
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-brand-primary font-semibold" : "text-muted-foreground"
                )}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-0 w-5 h-0.5 rounded-full bg-brand-primary" />
              )}
              {tab.label === "Cart" && cartCount > 0 && (
                <span className="absolute 1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </div>
          );

          if (tab.label === "Cart") {
            return (
              <CartDrawer key={tab.label}>
                <button
                  type="button"
                  aria-label={`Shopping Cart, ${cartCount} items`}
                  className="bg-transparent border-0 p-0 flex items-center justify-center"
                >
                  {content}
                </button>
              </CartDrawer>
            );
          }

          return (
            <Link
              key={tab.label}
              href={tab.href as string}
              aria-label={tab.label}
              className="flex items-center justify-center min-w-[48px] min-h-[48px]"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

