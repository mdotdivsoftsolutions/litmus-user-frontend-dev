"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, LogIn } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { headerNavLinks } from "./HeaderNavLinks";

interface HeaderMobileDrawerProps {
  open: boolean;
  onClose: () => void;
  user?: any;
  onLoginClick: () => void;
  onLogoutClick?: () => void;
}

export function HeaderMobileDrawer({
  open,
  onClose,
  user,
  onLoginClick,
  onLogoutClick,
}: HeaderMobileDrawerProps) {
  const pathname = usePathname();

  const getInitials = () => {
    if (!user) return "U";
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U";
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-72 bg-card shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <img src="/logo.webp" alt="Litmus" className="h-7 w-auto object-contain" />
          <button onClick={onClose} className="p-1.5 rounded-full text-muted-foreground hover:bg-muted transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {headerNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/"
                ? pathname === "/" || pathname === "/home"
                : pathname === link.href || pathname?.startsWith(link.href + "/");

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {!user ? (
          <div className="px-4 py-5 border-t border-border mb-14">
            <button
              onClick={() => {
                onClose();
                onLoginClick();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-action text-white text-sm font-bold shadow-md hover:bg-brand-action-hover transition-all active:scale-95"
            >
              <LogIn className="h-4 w-4" />
              Login / Sign Up
            </button>
          </div>
        ) : (
          <div className="px-4 py-5 border-t border-border mb-14 space-y-4">
            <div className="flex items-center gap-3 px-2">
              <Avatar className="h-10 w-10 ring-2 ring-slate-100 shadow-sm">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-foreground truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user.email || user.phone}</p>
                {user.role !== "USER" && (
                  <p className="text-[10px] text-brand-primary font-bold mt-0.5">{user.role} ACCOUNT</p>
                )}
              </div>
            </div>
            {user.role === "ADMIN" && (
              <Link
                href="/admin/dashboard"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-brand-primary/20 bg-brand-primary/5 text-brand-primary text-sm font-semibold hover:bg-brand-primary/10 transition-colors mb-2"
              >
                Go to Admin Dashboard
              </Link>
            )}
            {user.role === "LAB" && (
              <Link
                href="/lab/dashboard"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-brand-primary/20 bg-brand-primary/5 text-brand-primary text-sm font-semibold hover:bg-brand-primary/10 transition-colors mb-2"
              >
                Go to Lab Dashboard
              </Link>
            )}
            <button
              onClick={() => {
                onClose();
                if (onLogoutClick) onLogoutClick();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-foreground text-sm font-semibold hover:bg-muted transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
