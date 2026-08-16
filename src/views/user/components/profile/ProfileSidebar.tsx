"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShieldCheck, LogOut, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface ProfileSidebarProps {
  user: any;
  tabs: TabItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export function ProfileSidebar({ user, tabs, activeTab, setActiveTab, onLogout }: ProfileSidebarProps) {
  return (
    <div className="w-full md:w-64 shrink-0 space-y-4">
      <div className="bg-card rounded-xl p-5 border border-border shadow-sm flex flex-col items-center text-center">
        <Avatar className="h-20 w-20 ring-2 ring-primary/20 mb-3">
          <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
            {user.firstName?.charAt(0) || "U"}{user.lastName?.charAt(0) || ""}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-base font-bold text-foreground">
          {user.companyName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User Profile"}
        </h1>
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
          {user.isVerified ? (
            <>
              <ShieldCheck className="h-3 w-3 text-litmus-teal" /> Verified
            </>
          ) : (
            "Unverified"
          )}
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-row md:flex-col">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 p-3.5 text-sm font-medium transition-colors border-b-2 md:border-b-0 md:border-l-4",
              activeTab === tab.id
                ? "bg-primary/5 text-primary border-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground border-transparent"
            )}
          >
            <tab.icon className="h-4 w-4 shrink-0" />
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        ))}

        <button
          onClick={onLogout}
          className="flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 p-3.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors border-b-2 md:border-b-0 md:border-l-4 border-transparent"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
