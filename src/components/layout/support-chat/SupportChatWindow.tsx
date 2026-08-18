"use client";

import { useState, useEffect } from "react";
import { Bot, Headphones, ShieldCheck, X, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BotChatView } from "./BotChatView";
import { LiveChatView } from "./LiveChatView";
import { GuestAuthForm } from "./GuestAuthForm";
import { ChatMessageItem } from "@/hooks/useSocketChat";

interface SupportChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  chatStatus: "BOT" | "QUEUED" | "ACTIVE" | "RESOLVED" | "MISSED";
  messages: ChatMessageItem[];
  hasOnlineAgents: boolean;
  isAgentTyping: boolean;
  assignedAgentName?: string;
  agentDisconnectedAlert?: boolean;
  showRatingPrompt?: boolean;
  currentUser?: any;
  onSendBotMessage: (text: string) => void;
  onSendLiveMessage: (text: string) => void;
  onRequestLiveSupport: (info?: { name?: string; phone?: string; email?: string }) => void;
  onEmitTyping: (isTyping: boolean) => void;
  onRequeue: () => void;
  onSubmitRating: (score: number, feedback?: string) => void;
}

export function SupportChatWindow({
  isOpen,
  onClose,
  chatStatus,
  messages,
  hasOnlineAgents,
  isAgentTyping,
  assignedAgentName,
  agentDisconnectedAlert,
  showRatingPrompt,
  currentUser,
  onSendBotMessage,
  onSendLiveMessage,
  onRequestLiveSupport,
  onEmitTyping,
  onRequeue,
  onSubmitRating,
}: SupportChatWindowProps) {
  const [activeTab, setActiveTab] = useState<"bot" | "live">("bot");
  const [showGuestForm, setShowGuestForm] = useState(false);

  // Switch to live tab automatically if live chat is queued or active
  useEffect(() => {
    if (chatStatus === "QUEUED" || chatStatus === "ACTIVE") {
      setActiveTab("live");
      setShowGuestForm(false);
    }
  }, [chatStatus]);

  const handleStartLiveRequest = () => {
    if (currentUser) {
      onRequestLiveSupport();
      setActiveTab("live");
    } else {
      setShowGuestForm(true);
    }
  };

  const handleGuestSubmit = (data: { name: string; phone: string; email?: string }) => {
    setShowGuestForm(false);
    setActiveTab("live");
    onRequestLiveSupport(data);
  };

  return (
    <div
      className={cn(
        "fixed bottom-24 right-4 sm:right-8 w-[calc(100vw-32px)] sm:w-[410px] h-[580px] max-h-[82vh] transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) transform origin-bottom-right z-50",
        isOpen
          ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
          : "opacity-0 scale-90 translate-y-12 pointer-events-none"
      )}
    >
      <Card className="rounded-3xl border border-slate-800 bg-slate-950/95 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col h-full ring-1 ring-cyan-500/20">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 border-b border-slate-800 shrink-0 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/30">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-white text-base font-bold tracking-tight">Litmus Clinical AI</CardTitle>
                <div className="flex items-center gap-1.5">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      hasOnlineAgents ? "bg-emerald-400 animate-pulse" : "bg-cyan-400"
                    )}
                  />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {hasOnlineAgents ? "Live Specialists Online" : "AI Diagnostic Desk 24/7"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onClose}
                className="h-8 w-8 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80 mt-3">
            <button
              type="button"
              onClick={() => {
                setShowGuestForm(false);
                setActiveTab("bot");
              }}
              className={cn(
                "flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all",
                activeTab === "bot" && !showGuestForm
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              )}
            >
              <Bot className="h-3.5 w-3.5" />
              <span>AI Assistant</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (chatStatus === "BOT") {
                  handleStartLiveRequest();
                } else {
                  setActiveTab("live");
                }
              }}
              className={cn(
                "flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all relative",
                activeTab === "live" || showGuestForm
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              )}
            >
              <Headphones className="h-3.5 w-3.5" />
              <span>Live Specialist</span>
              {hasOnlineAgents && activeTab !== "live" && (
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping absolute top-1.5 right-2" />
              )}
            </button>
          </div>
        </CardHeader>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden relative">
          {showGuestForm ? (
            <GuestAuthForm
              onSubmit={handleGuestSubmit}
              onCancel={() => setShowGuestForm(false)}
            />
          ) : activeTab === "live" ? (
            <LiveChatView
              chatStatus={chatStatus}
              messages={messages}
              assignedAgentName={assignedAgentName}
              isAgentTyping={isAgentTyping}
              agentDisconnectedAlert={agentDisconnectedAlert}
              showRatingPrompt={showRatingPrompt}
              onSendMessage={onSendLiveMessage}
              onEmitTyping={onEmitTyping}
              onRequeue={onRequeue}
              onSubmitRating={onSubmitRating}
              onBackToBot={() => setActiveTab("bot")}
            />
          ) : (
            <BotChatView
              messages={messages}
              onSendMessage={onSendBotMessage}
              onRequestLiveSupport={handleStartLiveRequest}
              hasOnlineAgents={hasOnlineAgents}
            />
          )}
        </div>
      </Card>
    </div>
  );
}
