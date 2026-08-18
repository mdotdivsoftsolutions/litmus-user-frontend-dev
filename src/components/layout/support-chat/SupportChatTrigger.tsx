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
          <div className="absolute inset-0 bg-slate-900 rounded-full animate-ping opacity-25 scale-125 pointer-events-none" />
          <div className="absolute -inset-1 bg-slate-900 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
        </>
      )}

      {/* Floating Pill Trigger */}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-500 hover:scale-105 active:scale-95 relative border-0 overflow-hidden",
          isOpen
            ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
            : "bg-slate-900 text-white"
        )}
        aria-label="Toggle Live Support Chat"
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />

        {isOpen ? (
          <X className="h-6 w-6 text-white" />
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
                "absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-slate-900",
                hasOnlineAgents ? "bg-emerald-400 animate-pulse" : "bg-white"
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
