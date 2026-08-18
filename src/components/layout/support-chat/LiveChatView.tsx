"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Headphones, Clock, CheckCheck, Star, AlertCircle, RefreshCw, Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatMessageItem } from "@/hooks/useSocketChat";

interface LiveChatViewProps {
  chatStatus: "BOT" | "QUEUED" | "ACTIVE" | "RESOLVED" | "MISSED";
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
  onCancelRequest?: () => void;
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
  onCancelRequest,
}: LiveChatViewProps) {
  const [inputText, setInputText] = useState("");
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingFeedback, setRatingFeedback] = useState("");
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);
  const [queueSecondsElapsed, setQueueSecondsElapsed] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatStatus === "QUEUED") {
      const timer = setInterval(() => {
        setQueueSecondsElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setQueueSecondsElapsed(0);
    }
  }, [chatStatus]);

  useEffect(() => {
    if (chatStatus === "QUEUED" && queueSecondsElapsed >= 300) {
      if (onCancelRequest) onCancelRequest();
      else onBackToBot();
    }
  }, [chatStatus, queueSecondsElapsed, onCancelRequest, onBackToBot]);

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
    const cycle = Math.floor(queueSecondsElapsed / 60);
    const secondsInCycle = queueSecondsElapsed % 60;
    const progressPercent = (secondsInCycle / 60) * 100;
    const isBusy = cycle > 0;

    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-white text-slate-900">
        <div className="relative mb-6">
          <div className="h-20 w-20 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
            <Headphones className="h-10 w-10 animate-pulse" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-sm">
            <Clock className="h-3.5 w-3.5 text-white" />
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-1.5">
          {isBusy ? "Specialists are busy" : "Connecting to a Live Specialist"}
        </h3>
        <p className="text-xs text-slate-500 max-w-[260px] leading-relaxed mb-6">
          {isBusy
            ? "All our specialists are currently assisting other clients. Please wait another minute, or you can switch back to the AI Assistant."
            : "Your request has been dispatched to our diagnostic desk. An available specialist will accept shortly."}
        </p>

        <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-6 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>{isBusy ? `Wait time extended (${cycle}/5)` : "Estimated wait time"}</span>
            <span className="text-slate-900">&lt; 1 minute</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-900 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (onCancelRequest) onCancelRequest();
            else onBackToBot();
          }}
          className="h-10 px-4 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-2 shadow-sm"
        >
          <Bot className="h-4 w-4 text-slate-900" />
          <span>Switch back to Automated Assistant</span>
        </Button>
      </div>
    );
  }

  // ── 2. RATING MODAL (Post-Resolution) ──────────────────────────────────────
  if (showRatingPrompt && !isRatingSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-white text-slate-900">
        <div className="h-16 w-16 rounded-3xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 mb-4 shadow-sm">
          <Star className="h-8 w-8 fill-amber-500" />
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-1">How was your live consultation?</h3>
        <p className="text-xs text-slate-500 mb-5">Your feedback helps us maintain our diagnostic support standards.</p>

        <form onSubmit={handleRatingSubmit} className="w-full space-y-4">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRatingScore(star)}
                className="p-1 text-slate-300 hover:text-amber-500 transition-colors"
              >
                <Star
                  className={cn(
                    "h-7 w-7 transition-all",
                    star <= ratingScore ? "text-amber-500 fill-amber-500 scale-110 drop-shadow-sm" : "text-slate-200"
                  )}
                />
              </button>
            ))}
          </div>

          <Input
            value={ratingFeedback}
            onChange={(e) => setRatingFeedback(e.target.value)}
            placeholder="Additional comments (optional)..."
            className="h-11 rounded-xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs shadow-inner"
          />

          <div className="flex items-center gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onBackToBot}
              className="flex-1 h-10 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-semibold"
            >
              Skip
            </Button>
            <Button
              type="submit"
              className="flex-1 h-10 rounded-xl bg-brand-action hover:bg-brand-action-hover text-white text-xs font-bold shadow-lg shadow-brand-action/20 border-0"
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
    <div className="flex flex-col flex-1 h-full min-h-0 w-full bg-white text-slate-900 overflow-hidden">
      {/* Live Specialist Header */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="h-6 w-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-brand-action shadow-2xs">
              <Headphones className="h-3.5 w-3.5" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 animate-pulse border border-white" />
          </div>
          <div>
            <span className="text-slate-900 font-bold text-xs">{assignedAgentName}</span>
            <p className="text-[10px] text-slate-500 font-medium">Diagnostic Support Specialist</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToBot}
          className="text-[10px] text-slate-600 hover:text-brand-action font-bold px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 transition-colors shadow-2xs"
        >
          AI Assistant Mode
        </button>
      </div>

      {/* Mid-Chat Agent Disconnect Alert with 1-Click Requeue */}
      {agentDisconnectedAlert && (
        <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-100 flex items-center justify-between text-xs text-amber-800 shrink-0">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
            <span className="text-[11px] font-medium">Specialist temporarily disconnected.</span>
          </div>
          <button
            type="button"
            onClick={onRequeue}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100/50 text-amber-700 font-bold text-[10px] border border-amber-200 shadow-2xs"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Re-queue</span>
          </button>
        </div>
      )}

      {/* Chat Ended / Resolved Notification Banner */}
      {chatStatus === "RESOLVED" && (
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-700 shrink-0">
          <span className="text-[11px] font-medium text-slate-600">This live session has ended.</span>
          <button
            type="button"
            onClick={onBackToBot}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-action hover:bg-brand-action-hover text-white font-bold text-[10px] shadow-2xs transition-colors"
          >
            <span>Continue with AI</span>
          </button>
        </div>
      )}

      {/* Messages Feed */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300"
        style={{ touchAction: "pan-y" }}
      >
        {messages.map((msg, index) => {
          const isUser = msg.senderType === "USER";
          const isAgent = msg.senderType === "AGENT";
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
            <div key={index} className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
              <div className={cn("flex items-center gap-1.5 px-1", isUser ? "flex-row-reverse" : "flex-row")}>
                <div
                  className={cn(
                    "h-5 w-5 rounded-md flex items-center justify-center text-[10px] font-bold shadow-2xs",
                    isUser ? "bg-brand-action/15 text-brand-action font-bold" : "bg-slate-100 text-slate-700 border border-slate-200"
                  )}
                >
                  {isUser ? <User className="h-3 w-3" /> : <Headphones className="h-3 w-3" />}
                </div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  {isUser ? "You" : assignedAgentName}
                </span>
              </div>

              {/* Bubble */}
              <div
                className={cn(
                  "p-3 rounded-2xl text-xs font-medium leading-relaxed max-w-[85%] shadow-2xs whitespace-pre-wrap border",
                  isUser
                    ? "bg-brand-action text-white rounded-tr-xs border-brand-action"
                    : "bg-slate-50 text-slate-800 rounded-tl-xs border-slate-200"
                )}
              >
                {msg.text}
              </div>

              {/* Status footer for user messages */}
              {isUser && (
                <div className="flex items-center gap-1 px-1 text-[9px] text-slate-400 font-semibold">
                  <span>{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</span>
                  {msg.status === "delivered" && <CheckCheck className="h-3 w-3 text-brand-action" />}
                </div>
              )}
            </div>
          );
        })}

        {/* Real-time Agent Typing Indicator */}
        {isAgentTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 w-fit">
            <div className="flex gap-1 items-center">
              <div className="h-1.5 w-1.5 rounded-full bg-brand-action animate-bounce [animation-delay:-0.3s]" />
              <div className="h-1.5 w-1.5 rounded-full bg-brand-action animate-bounce [animation-delay:-0.15s]" />
              <div className="h-1.5 w-1.5 rounded-full bg-brand-action animate-bounce" />
            </div>
            <span className="text-[11px] font-medium">{assignedAgentName} is typing...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-slate-100 shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputText}
              onChange={handleInputChange}
              placeholder={chatStatus === "RESOLVED" ? "Type to start a new inquiry..." : "Type your message to specialist..."}
              className="w-full h-10 rounded-xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus-visible:ring-brand-action focus-visible:border-brand-action pr-4 shadow-inner"
            />
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
