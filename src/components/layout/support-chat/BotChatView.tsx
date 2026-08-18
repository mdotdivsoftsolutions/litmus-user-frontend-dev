"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Headphones, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatMessageItem } from "@/hooks/useSocketChat";

interface BotChatViewProps {
  messages: ChatMessageItem[];
  onSendMessage: (text: string) => void;
  onRequestLiveSupport: () => void;
  isSubmitting?: boolean;
  hasOnlineAgents?: boolean;
}

export function BotChatView({
  messages,
  onSendMessage,
  onRequestLiveSupport,
  isSubmitting = false,
  hasOnlineAgents = false,
}: BotChatViewProps) {
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSubmitting) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleChipClick = (suggestion: { label: string; action: string; payload?: any }) => {
    if (suggestion.action === "request_live_support") {
      onRequestLiveSupport();
    } else if (suggestion.action === "navigate" && suggestion.payload) {
      window.location.href = suggestion.payload;
    } else {
      // Send the query/label as bot input
      onSendMessage(suggestion.payload || suggestion.label);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/95 text-slate-100">
      {/* Bot Mode Banner */}
      <div className="px-4 py-2.5 bg-cyan-950/40 border-b border-cyan-800/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-200 font-semibold tracking-wide text-[11px]">
            AI Diagnostic Knowledge Assistant
          </span>
        </div>
        {hasOnlineAgents && (
          <button
            type="button"
            onClick={onRequestLiveSupport}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-bold text-[10px] tracking-wider border border-cyan-500/30 transition-all hover:scale-105 active:scale-95"
          >
            <Headphones className="h-3 w-3 text-cyan-400" />
            <span>Talk to Specialist</span>
          </button>
        )}
      </div>

      {/* Messages Stream */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((msg, index) => {
          const isUser = msg.senderType === "USER";
          const isBot = msg.senderType === "BOT";
          const isSystem = msg.senderType === "SYSTEM";

          if (isSystem) {
            return (
              <div key={index} className="flex justify-center my-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-full">
                  {msg.text}
                </span>
              </div>
            );
          }

          return (
            <div key={index} className={cn("flex flex-col gap-1.5", isUser ? "items-end" : "items-start")}>
              <div className={cn("flex items-center gap-1.5 px-1", isUser ? "flex-row-reverse" : "flex-row")}>
                <div
                  className={cn(
                    "h-5 w-5 rounded-md flex items-center justify-center text-[10px] font-bold shadow-xs",
                    isUser ? "bg-slate-800 text-cyan-400" : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  )}
                >
                  {isUser ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                </div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {isUser ? "You" : msg.senderName || "Litmus Assistant"}
                </span>
              </div>

              {/* Message Bubble */}
              <div
                className={cn(
                  "p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed max-w-[85%] shadow-md whitespace-pre-wrap",
                  isUser
                    ? "bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-tr-xs border border-cyan-500/30"
                    : "bg-slate-900/90 text-slate-200 rounded-tl-xs border border-slate-800"
                )}
              >
                {msg.text}
              </div>

              {/* Interactive Quick Reply Suggestion Chips */}
              {isBot && msg.actionSuggestions && msg.actionSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1 pl-1 max-w-[90%]">
                  {msg.actionSuggestions.map((suggestion, chipIdx) => (
                    <button
                      key={chipIdx}
                      type="button"
                      onClick={() => handleChipClick(suggestion)}
                      className={cn(
                        "text-[11px] font-semibold px-3 py-1.5 rounded-xl border transition-all text-left flex items-center gap-1.5 shadow-xs hover:scale-[1.02] active:scale-95",
                        suggestion.action === "request_live_support"
                          ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-300 hover:border-cyan-400"
                          : "bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-600"
                      )}
                    >
                      <span>{suggestion.label}</span>
                      <ArrowRight className="h-2.5 w-2.5 opacity-60" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isSubmitting && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 w-fit">
            <div className="flex gap-1 items-center">
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]" />
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" />
            </div>
            <span className="text-[11px]">Analyzing diagnostic requirements...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3.5 bg-slate-900/90 border-t border-slate-800/80 backdrop-blur-xl">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about food testing, TAT, pricing, NABL..."
              className="w-full h-11 rounded-xl bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-500 text-xs sm:text-sm focus-visible:ring-cyan-500 focus-visible:border-cyan-500 pr-10 shadow-inner"
            />
            <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400/40 pointer-events-none" />
          </div>
          <Button
            type="submit"
            disabled={!inputText.trim() || isSubmitting}
            className="h-11 w-11 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 border-0 p-0 flex items-center justify-center shrink-0 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
