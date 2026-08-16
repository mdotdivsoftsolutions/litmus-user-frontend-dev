"use client";

import { useState, useEffect } from "react";
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

export function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [scrolled, setScrolled] = useState(false);
  const [city, setCity] = useState("Chennai");
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
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setShowSearch(false);
  }, [pathname]);

  // Handle URL search params for login modal
  useEffect(() => {
    if (searchParams?.get("login") === "true") {
      setIsAuthModalOpen(true);
      // Clean up the URL without reloading the page
      window.history.replaceState({}, '', pathname);
    }
  }, [searchParams, pathname]);

  // Handle global event for opening auth modal
  useEffect(() => {
    const handleOpenAuth = () => setIsAuthModalOpen(true);
    window.addEventListener('openAuthModal', handleOpenAuth);
    return () => window.removeEventListener('openAuthModal', handleOpenAuth);
  }, []);

  return (
    <CartDrawerProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Header
          scrolled={scrolled}
          city={city}
          setCity={setCity}
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

        <FooterSearchLinks />

        <MainFooter />

        <FloatingSupportChat />
        <MobileTabNavigation cartCount={cartCount} />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          isSkippable={true}
        />
      </div>
    </CartDrawerProvider>
  );
}
