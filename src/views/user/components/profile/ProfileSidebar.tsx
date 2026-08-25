"use client";

import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShieldCheck, ShieldAlert, LogOut, LucideIcon, Mail, Phone, Building2, CheckCircle2, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string | number;
}

interface ProfileSidebarProps {
  user: any;
  tabs: TabItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export function ProfileSidebar({ user, tabs, activeTab, setActiveTab, onLogout }: ProfileSidebarProps) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "User Profile";
  const initials = `${user.firstName?.charAt(0) || "U"}${user.lastName?.charAt(0) || ""}`.toUpperCase();
  const company = user.companyName;
  const isVerified = user.isVerified || Boolean(user.fssaiNumber);

  // Calculate profile completeness
  const fields = [user.firstName, user.lastName, user.phone, user.email, user.companyName, user.fssaiNumber, user.address?.city];
  const filledCount = fields.filter(Boolean).length;
  const completeness = Math.min(100, Math.round((filledCount / fields.length) * 100));

  return (
    <div className="w-full shrink-0 space-y-4">
      {/* User Identity Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Subtle decorative gradient backdrop */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-brand-action/10 via-brand-card-to/10 to-brand-action/10" />

        <div className="relative flex flex-col items-center text-center pt-2">
          <div className="relative mb-3">
            <Avatar className="h-20 w-20 ring-4 ring-white shadow-md">
              <AvatarFallback className="bg-brand-action text-white text-2xl font-bold tracking-tight">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span
              className={cn(
                "absolute bottom-0 right-0 h-4 w-4 rounded-full ring-2 ring-white",
                isVerified ? "bg-brand-action" : "bg-amber-400"
              )}
              title={isVerified ? "Verified Account" : "Pending Verification"}
            />
          </div>

          <h2 className="text-base font-bold text-slate-900 leading-snug truncate max-w-full">
            {fullName}
          </h2>

          {company && (
            <div className="flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold max-w-full">
              <Building2 className="h-3 w-3 text-slate-500 shrink-0" />
              <span className="truncate">{company}</span>
            </div>
          )}

          <div className="mt-2.5">
            {isVerified ? (
              <Badge variant="outline" className="bg-brand-action/10 text-brand-action border-brand-action/20 gap-1 text-[11px] font-semibold py-0.5 px-2.5">
                <ShieldCheck className="h-3.5 w-3.5 text-brand-action" /> Verified Account
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 gap-1 text-[11px] font-semibold py-0.5 px-2.5">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-600" /> Unverified Account
              </Badge>
            )}
          </div>

          {/* Quick Contact Snippet */}
          <div className="w-full mt-4 pt-3.5 border-t border-slate-100 space-y-1.5 text-left text-xs text-slate-600">
            {user.email && (
              <div className="flex items-center gap-2 truncate">
                <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
            )}
            {user.phone && (
              <div className="flex items-center gap-2 truncate">
                <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>{user.phone}</span>
              </div>
            )}
          </div>

          {/* Completeness Bar */}
          <div className="w-full mt-3.5 pt-3 border-t border-slate-100 text-left">
            <div className="flex items-center justify-between text-[11px] mb-1.5 font-medium">
              <span className="text-slate-500">Profile Completion</span>
              <span className="font-bold text-brand-action">{completeness}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-action to-brand-card-to rounded-full transition-all duration-500"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2 flex flex-col gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left",
                isActive
                  ? "bg-brand-action text-white shadow-xs font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <tab.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-slate-400")} />
                <span className="truncate">{tab.label}</span>
              </div>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold",
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-2 border-t border-slate-100 mt-1 space-y-0.5">
          <Link
            href="/help"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
          >
            <HelpCircle className="h-4 w-4 shrink-0 text-slate-400" />
            <span>Help Center</span>
          </Link>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
          >
            <LogOut className="h-4 w-4 shrink-0 text-rose-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
