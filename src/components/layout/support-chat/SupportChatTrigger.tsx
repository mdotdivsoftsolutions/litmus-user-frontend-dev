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
          <div className="absolute inset-0 bg-cyan-500 rounded-full animate-ping opacity-25 scale-125 pointer-events-none" />
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur-md opacity-40 group-hover:opacity-75 transition-opacity" />
        </>
      )}

      {/* Floating Pill Trigger */}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "h-14 w-14 rounded-full shadow-[0_12px_40px_rgba(6,182,212,0.35)] flex items-center justify-center transition-all duration-500 hover:scale-105 active:scale-95 relative border-0 overflow-hidden",
          isOpen
            ? "bg-slate-900 rotate-90 text-white"
            : "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white border border-cyan-500/30"
        )}
        aria-label="Toggle Live Support Chat"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />

        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <div className="relative flex items-center justify-center">
            {hasOnlineAgents ? (
              <Headphones className="h-6 w-6 text-cyan-400" />
            ) : (
              <MessageSquare className="h-6 w-6 text-cyan-400" />
            )}
            {/* Live Indicator Dot */}
            <div
              className={cn(
                "absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-slate-950",
                hasOnlineAgents ? "bg-emerald-400 animate-pulse" : "bg-cyan-400"
              )}
            />
          </div>
        )}
      </button>

      {/* Unread Counter Badge */}
      {!isOpen && unreadCount > 0 && (
        <span className="absolute -top-1.5 -left-1.5 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-extrabold text-white shadow-lg ring-2 ring-slate-950 animate-bounce">
          {unreadCount}
        </span>
      )}
    </div>
  );
}
