"use client";

import { MessageSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SupportChatTriggerProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function SupportChatTrigger({ isOpen, onToggle }: SupportChatTriggerProps) {
  return (
    <div className="relative">
      {!isOpen && (
        <>
          <div className="absolute inset-0 bg-brand-action rounded-full animate-ping opacity-20 scale-150 pointer-events-none" />
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-pulse opacity-10 scale-125 pointer-events-none" />
        </>
      )}

      <button
        onClick={onToggle}
        className={cn(
          "h-12 w-12 rounded-full shadow-[0_20px_50px_rgba(0,75,96,0.4)] flex items-center justify-center transition-all duration-700 hover:scale-105 active:scale-95 group relative border-0 overflow-hidden",
          isOpen ? "bg-slate-950 rotate-180" : "bg-gradient-to-br from-brand-action to-blue-500"
        )}
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? (
          <X className="h-7 w-7 text-white" />
        ) : (
          <div className="relative">
            <MessageSquare className="h-5 w-5 text-white fill-white/20" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 border-2 border-white rounded-full" />
          </div>
        )}
      </button>
    </div>
  );
}
