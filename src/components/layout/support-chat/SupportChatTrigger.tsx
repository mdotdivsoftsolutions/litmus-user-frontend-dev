"use client";

import { MessageSquare, X, Sparkles, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

interface SupportChatTriggerProps {
  isOpen: boolean;
  onToggle: () => void;
  unreadCount?: number;
  hasOnlineAgents?: boolean;
}

export function SupportChatTrigger({
  isOpen,
  onToggle,
  unreadCount = 0,
  hasOnlineAgents = false,
}: SupportChatTriggerProps) {
  return (
    <div className="relative group">
      {!isOpen && (
        <>
          <div className="absolute inset-0 bg-brand-action rounded-full animate-ping opacity-25 scale-125 pointer-events-none" />
          <div className="absolute -inset-1 bg-brand-action rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
        </>
      )}

      {/* Floating Pill Trigger */}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 relative border border-white/20 overflow-hidden cursor-pointer",
          isOpen
            ? "bg-brand-action hover:bg-brand-action-hover text-white ring-4 ring-brand-action/25"
            : "bg-brand-action hover:bg-brand-action-hover text-white shadow-brand-action/30"
        )}
        aria-label="Toggle Live Support Chat"
      >
        <div className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity" />

        {isOpen ? (
          <X className="h-6 w-6 text-white stroke-[2.5]" />
        ) : (
          <div className="relative flex items-center justify-center">
            {hasOnlineAgents ? (
              <Headphones className="h-6 w-6 text-white" />
            ) : (
              <MessageSquare className="h-6 w-6 text-white" />
            )}
            {/* Live Indicator Dot */}
            <div
              className={cn(
                "absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white",
                hasOnlineAgents ? "bg-emerald-400 animate-pulse" : "bg-white/90"
              )}
            />
          </div>
        )}
      </button>

      {/* Unread Counter Badge */}
      {!isOpen && unreadCount > 0 && (
        <span className="absolute -top-1.5 -left-1.5 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-extrabold text-white shadow-lg ring-2 ring-white animate-bounce">
          {unreadCount}
        </span>
      )}
    </div>
  );
}
