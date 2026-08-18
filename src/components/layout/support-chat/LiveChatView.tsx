"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Headphones, Clock, CheckCheck, Star, AlertCircle, RefreshCw, Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatMessageItem } from "@/hooks/useSocketChat";

interface LiveChatViewProps {
  chatStatus: "QUEUED" | "ACTIVE" | "RESOLVED" | "MISSED";
  messages: ChatMessageItem[];
  assignedAgentName?: string;
  isAgentTyping?: boolean;
  agentDisconnectedAlert?: boolean;
  showRatingPrompt?: boolean;
  onSendMessage: (text: string) => void;
  onEmitTyping: (isTyping: boolean) => void;
  onRequeue: () => void;
  onSubmitRating: (score: number, feedback?: string) => void;
  onBackToBot: () => void;
}

export function LiveChatView({
  chatStatus,
  messages,
  assignedAgentName = "Litmus Specialist",
  isAgentTyping = false,
  agentDisconnectedAlert = false,
  showRatingPrompt = false,
  onSendMessage,
  onEmitTyping,
  onRequeue,
  onSubmitRating,
  onBackToBot,
}: LiveChatViewProps) {
  const [inputText, setInputText] = useState("");
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingFeedback, setRatingFeedback] = useState("");
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAgentTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText("");
    onEmitTyping(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    onEmitTyping(e.target.value.length > 0);
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitRating(ratingScore, ratingFeedback);
    setIsRatingSubmitted(true);
  };

  // ── 1. QUEUE STATE ────────────────────────────────────────────────────────
  if (chatStatus === "QUEUED") {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-slate-950 text-white">
        <div className="relative mb-6">
          <div className="h-20 w-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Headphones className="h-10 w-10 animate-pulse" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
            <Clock className="h-3.5 w-3.5 text-white" />
          </div>
        </div>

        <h3 className="text-base font-bold text-white mb-1.5">Connecting to a Live Specialist</h3>
        <p className="text-xs text-slate-400 max-w-[260px] leading-relaxed mb-6">
          Your request has been dispatched to our diagnostic desk. An available specialist will accept shortly.
        </p>

        <div className="w-full bg-slate-900/80 rounded-2xl p-4 border border-slate-800 mb-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Estimated wait time</span>
            <span className="text-cyan-400">&lt; 1 minute</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-[pulse_1.5s_infinite] w-3/4 rounded-full" />
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onBackToBot}
          className="h-10 px-4 rounded-xl border-slate-800 hover:bg-slate-900 text-slate-300 text-xs font-semibold flex items-center gap-2"
        >
          <Bot className="h-3.5 w-3.5 text-cyan-400" />
          <span>Switch back to Automated Assistant</span>
        </Button>
      </div>
    );
  }

  // ── 2. RATING MODAL (Post-Resolution) ──────────────────────────────────────
  if (showRatingPrompt && !isRatingSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-slate-950 text-white">
        <div className="h-16 w-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
          <Star className="h-8 w-8 fill-amber-400" />
        </div>

        <h3 className="text-base font-bold text-white mb-1">How was your live consultation?</h3>
        <p className="text-xs text-slate-400 mb-5">Your feedback helps us maintain our diagnostic support standards.</p>

        <form onSubmit={handleRatingSubmit} className="w-full space-y-4">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRatingScore(star)}
                className="p-1 text-slate-600 hover:text-amber-400 transition-colors"
              >
                <Star
                  className={cn(
                    "h-7 w-7 transition-all",
                    star <= ratingScore ? "text-amber-400 fill-amber-400 scale-110" : "text-slate-700"
                  )}
                />
              </button>
            ))}
          </div>

          <Input
            value={ratingFeedback}
            onChange={(e) => setRatingFeedback(e.target.value)}
            placeholder="Additional comments (optional)..."
            className="h-11 rounded-xl bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 text-xs"
          />

          <div className="flex items-center gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onBackToBot}
              className="flex-1 h-10 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
            >
              Skip
            </Button>
            <Button
              type="submit"
              className="flex-1 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 border-0"
            >
              Submit Feedback
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // ── 3. ACTIVE LIVE CHAT STREAM ────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-slate-950/95 text-slate-100">
      {/* Live Specialist Header */}
      <div className="px-4 py-2.5 bg-emerald-950/40 border-b border-emerald-800/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="h-6 w-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Headphones className="h-3.5 w-3.5" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 animate-pulse border border-slate-950" />
          </div>
          <div>
            <span className="text-emerald-300 font-bold text-xs">{assignedAgentName}</span>
            <p className="text-[10px] text-emerald-400/80 font-medium">Diagnostic Support Specialist</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToBot}
          className="text-[10px] text-slate-400 hover:text-slate-200 font-semibold px-2 py-1 rounded-md hover:bg-slate-900 transition-colors"
        >
          View Bot
        </button>
      </div>

      {/* Mid-Chat Agent Disconnect Alert with 1-Click Requeue */}
      {agentDisconnectedAlert && (
        <div className="px-4 py-2.5 bg-amber-950/80 border-b border-amber-800/50 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="text-[11px]">Specialist temporarily disconnected.</span>
          </div>
          <button
            type="button"
            onClick={onRequeue}
            className="flex items-center gap-1 px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[10px] border border-amber-500/40"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Re-queue</span>
          </button>
        </div>
      )}

      {/* Messages Feed */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((msg, index) => {
          const isUser = msg.senderType === "USER";
          const isAgent = msg.senderType === "AGENT";
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
            <div key={index} className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
              <div className={cn("flex items-center gap-1.5 px-1", isUser ? "flex-row-reverse" : "flex-row")}>
                <div
                  className={cn(
                    "h-5 w-5 rounded-md flex items-center justify-center text-[10px] font-bold shadow-xs",
                    isUser ? "bg-slate-800 text-cyan-400" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  )}
                >
                  {isUser ? <User className="h-3 w-3" /> : <Headphones className="h-3 w-3" />}
                </div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {isUser ? "You" : assignedAgentName}
                </span>
              </div>

              {/* Bubble */}
              <div
                className={cn(
                  "p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed max-w-[85%] shadow-md whitespace-pre-wrap",
                  isUser
                    ? "bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-tr-xs border border-cyan-500/30"
                    : "bg-slate-900 text-slate-200 rounded-tl-xs border border-slate-800"
                )}
              >
                {msg.text}
              </div>

              {/* Status footer for user messages */}
              {isUser && (
                <div className="flex items-center gap-1 px-1 text-[9px] text-slate-500 font-semibold">
                  <span>{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</span>
                  {msg.status === "delivered" && <CheckCheck className="h-3 w-3 text-cyan-400" />}
                </div>
              )}
            </div>
          );
        })}

        {/* Real-time Agent Typing Indicator */}
        {isAgentTyping && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/30 w-fit">
            <div className="flex gap-1 items-center">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]" />
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]" />
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" />
            </div>
            <span className="text-[11px] font-medium">{assignedAgentName} is typing...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-3.5 bg-slate-900/90 border-t border-slate-800/80 backdrop-blur-xl">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputText}
              onChange={handleInputChange}
              placeholder="Type your message to specialist..."
              className="w-full h-11 rounded-xl bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-500 text-xs sm:text-sm focus-visible:ring-emerald-500 focus-visible:border-emerald-500 pr-4 shadow-inner"
            />
          </div>
          <Button
            type="submit"
            disabled={!inputText.trim()}
            className="h-11 w-11 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 border-0 p-0 flex items-center justify-center shrink-0 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
