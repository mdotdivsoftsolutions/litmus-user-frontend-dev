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
      // Send clean human-readable label for user chat bubble
      onSendMessage(suggestion.label);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 w-full bg-white text-slate-900 overflow-hidden">
      {/* Messages Stream */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300"
        style={{ touchAction: "pan-y" }}
      >
        {messages.map((msg, index) => {
          const isUser = msg.senderType === "USER";
          const isBot = msg.senderType === "BOT";
          const isSystem = msg.senderType === "SYSTEM";

          if (isSystem) {
            return (
              <div key={index} className="flex justify-center my-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 bg-slate-50 border border-slate-200 shadow-2xs px-3 py-1 rounded-full text-center">
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
                    "h-5 w-5 rounded-md flex items-center justify-center text-[10px] font-bold shadow-2xs",
                    isUser ? "bg-brand-action/15 text-brand-action font-bold" : "bg-brand-action/10 text-brand-action border border-brand-action/20"
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
                  "p-3 text-xs font-medium leading-relaxed max-w-[85%] whitespace-pre-wrap shadow-2xs border",
                  isUser
                    ? "bg-brand-action text-white rounded-l-2xl rounded-tr-xs rounded-br-2xl border-brand-action"
                    : "bg-slate-50 text-slate-800 rounded-tl-xs rounded-r-2xl rounded-bl-2xl border-slate-200"
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
                        "px-3 py-1.5 rounded-full text-[10px] font-semibold border transition-all hover:scale-105 active:scale-95 whitespace-nowrap shadow-2xs flex items-center gap-1",
                        index === 0
                          ? "bg-brand-action/5 border-brand-action/25 text-brand-action hover:bg-brand-action/10 font-bold"
                          : "bg-white border-slate-200 text-slate-700 hover:border-brand-action/30 hover:bg-brand-action/5 hover:text-brand-action"
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
            <div className="flex gap-1 p-2 bg-white rounded-xl border border-slate-200 max-w-fit shadow-2xs">
              <div className="h-1.5 w-1.5 rounded-full bg-brand-action animate-bounce [animation-delay:-0.3s]" />
              <div className="h-1.5 w-1.5 rounded-full bg-brand-action animate-bounce [animation-delay:-0.15s]" />
              <div className="h-1.5 w-1.5 rounded-full bg-brand-action animate-bounce" />
            </div>
            <span className="text-[11px]">Analyzing diagnostic requirements...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-slate-100 shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about lab tests..."
              className="w-full h-10 rounded-xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus-visible:ring-brand-action focus-visible:border-brand-action pr-9 shadow-inner"
            />
            <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-brand-action/60 pointer-events-none" />
          </div>
          <Button
            type="submit"
            disabled={!inputText.trim()}
            className="h-10 w-10 rounded-xl bg-brand-action hover:bg-brand-action-hover text-white shadow-md shadow-brand-action/20 border-0 p-0 flex items-center justify-center shrink-0 disabled:opacity-40 transition-all cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
