"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children?: React.ReactNode;
}

export const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const { data: userResponse, isLoading, isError } = useQuery({
    queryKey: ["userProfile"],
    queryFn: authApi.getMe,
    retry: false,
  });

  const user = userResponse?.data;

  useEffect(() => {
    if (isLoading) return;

    if (isError || !user) {
      let loginPath = "/?login=true";
      if (pathname.startsWith("/admin")) {
        loginPath = "/admin/login";
      } else if (pathname.startsWith("/lab")) {
        loginPath = "/laboratory/login";
      }
      router.replace(loginPath);
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      if (user.role === "ADMIN") router.replace("/admin/dashboard");
      else if (user.role === "LAB") router.replace("/lab/dashboard");
      else router.replace("/");
    }
  }, [isLoading, isError, user, pathname, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium animate-pulse">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};
