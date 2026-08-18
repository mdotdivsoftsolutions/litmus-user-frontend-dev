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
  const inputRef = useRef<HTMLInputElement>(null);

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
    <div className="flex flex-col flex-1 h-full min-h-0 w-full bg-white text-slate-900">
      {/* Bot Mode Banner */}
      <div className="px-3 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 overflow-hidden">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="h-2 w-2 rounded-full bg-slate-900 animate-pulse shrink-0" />
          <span className="text-slate-900 font-bold tracking-wide text-[10px] sm:text-[11px] truncate">
            AI Diagnostic Knowledge Assistant
          </span>
        </div>
        {hasOnlineAgents && (
          <button
            type="button"
            onClick={onRequestLiveSupport}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white hover:bg-slate-50 text-slate-900 font-bold text-[10px] tracking-wider border border-slate-200 transition-all hover:scale-105 active:scale-95 shadow-sm shrink-0 whitespace-nowrap"
          >
            <Headphones className="h-3 w-3 text-slate-900 shrink-0" />
            <span>Talk to Specialist</span>
          </button>
        )}
      </div>

      {/* Messages Stream */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
        {messages.map((msg, index) => {
          const isUser = msg.senderType === "USER";
          const isBot = msg.senderType === "BOT";
          const isSystem = msg.senderType === "SYSTEM";

          if (isSystem) {
            return (
              <div key={index} className="flex justify-center my-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 bg-white border border-slate-200 shadow-sm px-3 py-1 rounded-full">
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
                    "h-5 w-5 rounded-md flex items-center justify-center text-[10px] font-bold shadow-sm",
                    isUser ? "bg-slate-200 text-slate-700" : "bg-slate-100 text-slate-700 border border-slate-200"
                  )}
                >
                  {isUser ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                </div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  {isUser ? "You" : msg.senderName || "Litmus Assistant"}
                </span>
              </div>

              {/* Message Bubble */}
              <div
                className={cn(
                  "p-3 text-xs font-medium leading-relaxed max-w-[85%] whitespace-pre-wrap shadow-sm border",
                  isUser
                    ? "bg-slate-900 text-white rounded-l-2xl rounded-tr-xs rounded-br-2xl border-slate-900"
                    : "bg-slate-50 text-slate-800 rounded-tl-xs border-slate-200"
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
                        "px-3 py-1.5 rounded-full text-[10px] font-semibold border transition-all hover:scale-105 active:scale-95 whitespace-nowrap shadow-xs",
                        index === 0
                          ? "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
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
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200 w-fit">
            <div className="flex gap-1.5 p-3.5 bg-slate-50 rounded-r-2xl rounded-tl-xs rounded-bl-2xl border border-slate-200 max-w-fit shadow-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-900 animate-bounce [animation-delay:-0.3s]" />
              <div className="h-1.5 w-1.5 rounded-full bg-slate-900 animate-bounce [animation-delay:-0.15s]" />
              <div className="h-1.5 w-1.5 rounded-full bg-slate-900 animate-bounce" />
            </div>
            <span className="text-[11px]">Analyzing diagnostic requirements...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3.5 bg-white border-t border-slate-100">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about lab tests..."
              className="w-full h-11 rounded-xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus-visible:ring-slate-400 focus-visible:border-slate-400 pr-10 shadow-inner"
            />
            <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
          <Button
            type="submit"
            disabled={!inputText.trim()}
            className="h-11 w-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/10 border-0 p-0 flex items-center justify-center shrink-0 disabled:opacity-40 transition-colors"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
