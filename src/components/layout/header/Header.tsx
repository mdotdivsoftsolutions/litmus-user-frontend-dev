"use client";

import Link from "next/link";
import { ShoppingCart, Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CartDrawer } from "../../cart/CartDrawer";
import { SearchAutocomplete } from "@/components/common/SearchAutocomplete";
import { HeaderLocationSelector } from "./HeaderLocationSelector";
import { HeaderNavLinks } from "./HeaderNavLinks";
import { HeaderUserMenu } from "./HeaderUserMenu";
import { HeaderMobileDrawer } from "./HeaderMobileDrawer";

interface HeaderProps {
  scrolled: boolean;
  cartCount: number;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onLoginClick: () => void;
  onLogoutClick?: () => void;
  user?: any;
}

export function Header({
  scrolled,
  cartCount,
  showSearch,
  mobileMenuOpen,
  setMobileMenuOpen,
  onLoginClick,
  onLogoutClick,
  user,
}: HeaderProps) {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 w-full z-50 pointer-events-none pt-0 md:pt-4" style={{ paddingRight: "var(--removed-body-scroll-bar-size, 0px)" }}>
        <header
          className={cn(
            "pointer-events-auto mx-auto w-full transition-all duration-300 backdrop-blur-md",
            "md:max-w-7xl md:px-3 md:rounded-full",
            scrolled ? "bg-white shadow-md border-b border-slate-200 md:border" : "bg-white/90 shadow-sm border-b border-transparent md:border"
          )}
        >
          <div className="max-w-7xl mx-auto flex items-center h-16 px-4 gap-3">
            <Link href="/" className="flex items-center shrink-0 py-1" aria-label="Litmus Food Analytics Home">
              <img src="/logo.webp" alt="Litmus Food Analytics" className="h-8 sm:h-9 w-auto object-contain" />
            </Link>

            <HeaderLocationSelector />

            <div className="hidden lg:flex flex-1 max-w-md mx-4 relative">
              <SearchAutocomplete
                placeholder="Search for tests, products..."
                className="w-full"
                inputClassName="h-10 rounded-full border-border focus:border-accent bg-background text-sm"
              />
            </div>

            <HeaderNavLinks />

            <div className="flex-1 lg:hidden" />

            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Call Customer Support"
                className="h-9 w-9 hidden sm:flex group/phone hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none outline-none"
                asChild
              >
                <a href="tel:+917356924029" aria-label="Call Customer Support at +91 73569 24029">
                  <Phone className="h-4 w-4 text-foreground group-hover/phone:text-brand-primary" />
                </a>
              </Button>

              <CartDrawer>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Shopping Cart with ${cartCount} items`}
                  className="pr-2 h-9 w-9 relative hover:bg-transparent active:bg-transparent focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none outline-none group/cart transition-all duration-300 hidden sm:flex"
                >
                  <ShoppingCart className="h-4.5 w-4.5 text-foreground group-hover/cart:text-brand-primary transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-action text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </CartDrawer>

              <HeaderUserMenu user={user} onLoginClick={onLoginClick} onLogoutClick={onLogoutClick} />

              <Button
                variant="ghost"
                size="icon"
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
                className="h-9 w-9 lg:hidden hover:bg-transparent active:bg-transparent focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
              </Button>
            </div>
          </div>


          {showSearch && (
            <div className="lg:hidden px-4 pb-3 animate-fade-in">
              <SearchAutocomplete
                placeholder="Search for tests, products..."
                className="w-full"
                inputClassName="h-10 rounded-full border-border bg-background text-sm"
              />
            </div>
          )}
        </header>
      </div>

      <HeaderMobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        onLoginClick={onLoginClick}
        onLogoutClick={onLogoutClick}
      />
    </>
  );
}
