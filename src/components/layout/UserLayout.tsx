"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { cartApi } from "@/lib/api/cart";
import { CartDrawerProvider } from "../cart/CartDrawerContext";
import { Header } from "./header/Header";
import { AuthModal } from "../auth/AuthModal";
import { MainFooter } from "./footer/MainFooter";
import { FloatingSupportChat } from "./FloatingSupportChat";
import { MobileTabNavigation } from "./MobileTabNavigation";
import { FooterSearchLinks } from "./footer/FooterSearchLinks";
import { LocationProvider } from "@/components/location/LocationContext";

function AuthLoginQuerySync({ setOpen }: { setOpen: (open: boolean) => void }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    if (searchParams?.get("login") === "true") {
      handled.current = true;
      setOpen(true);
      window.history.replaceState({}, "", pathname);
    }
  }, [searchParams, pathname, setOpen]);

  return null;
}

export function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const { data: userResponse } = useQuery({
    queryKey: ["userProfile"],
    queryFn: authApi.getMe,
    retry: false,
  });

  const { data: cartResponse } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartApi.getCart(),
  });

  const user = userResponse?.data;
  const cartCount = cartResponse?.data?.items?.length || 0;

  const handleLogout = async () => {
    try {
      await authApi.logout();
      queryClient.clear();
      localStorage.removeItem('litmus_session_id');
      toast.success("Logged out successfully");
      // Force a hard reload to completely reset all React and Query state
      window.location.href = "/";
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setShowSearch(false);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if ((window as any).__lenis) {
      (window as any).__lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  // Handle global event for opening auth modal
  useEffect(() => {
    const handleOpenAuth = () => setIsAuthModalOpen(true);
    window.addEventListener('openAuthModal', handleOpenAuth);
    return () => window.removeEventListener('openAuthModal', handleOpenAuth);
  }, []);

  return (
    <LocationProvider>
    <CartDrawerProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Header
          scrolled={scrolled}
          cartCount={cartCount}
          showSearch={showSearch}
          setShowSearch={setShowSearch}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          onLoginClick={() => setIsAuthModalOpen(true)}
          onLogoutClick={handleLogout}
          user={user}
        />

        <main className="flex-1 pb-20 lg:pb-0">
          {children}
        </main>

        {!pathname.startsWith("/profile") && <FooterSearchLinks />}

        <MainFooter />

        <FloatingSupportChat />
        <MobileTabNavigation cartCount={cartCount} />

        <Suspense fallback={null}>
          <AuthLoginQuerySync setOpen={setIsAuthModalOpen} />
        </Suspense>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          isSkippable={true}
        />
      </div>
    </CartDrawerProvider>
    </LocationProvider>
  );
}
