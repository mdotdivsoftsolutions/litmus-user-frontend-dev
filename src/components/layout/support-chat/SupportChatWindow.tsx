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
  onCancelLiveSupport: () => void;
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
  onCancelLiveSupport,
  onEmitTyping,
  onRequeue,
  onSubmitRating,
}: SupportChatWindowProps) {
  const [activeTab, setActiveTab] = useState<"bot" | "live">("bot");
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [showConnectConfirm, setShowConnectConfirm] = useState(false);

  // Switch to live tab automatically if live chat is queued or active
  useEffect(() => {
    if (chatStatus === "QUEUED" || chatStatus === "ACTIVE") {
      setActiveTab("live");
      setShowGuestForm(false);
      setShowConnectConfirm(false);
    }
  }, [chatStatus]);

  const handleLiveTabClick = () => {
    if (chatStatus === "BOT") {
      setShowConnectConfirm(true);
    } else {
      setActiveTab("live");
    }
  };

  const handleConfirmConnectLive = () => {
    setShowConnectConfirm(false);
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
      data-lenis-prevent="true"
      onWheel={(e) => e.stopPropagation()}
      className={cn(
        "fixed bottom-24 right-4 sm:right-8 w-[calc(100vw-32px)] sm:w-[360px] h-[520px] max-h-[80vh] transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) transform origin-bottom-right z-50 overscroll-contain",
        isOpen
          ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
          : "opacity-0 scale-90 translate-y-12 pointer-events-none"
      )}
    >
      <Card
        data-lenis-prevent="true"
        className="rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col h-full overscroll-contain relative"
      >
        {/* Header */}
        <CardHeader className="bg-white p-4 border-b border-slate-100 shrink-0 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-brand-action/10 flex items-center justify-center text-brand-action shadow-2xs border border-brand-action/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-slate-900 text-base font-bold tracking-tight">Litmus Clinical AI</CardTitle>
                <div className="flex items-center gap-1.5">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      hasOnlineAgents ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                    )}
                  />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {hasOnlineAgents ? "Live Specialists Online" : "AI Diagnostic Desk 24/7"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onClose}
                className="h-8 w-8 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/50 mt-3">
            <button
              type="button"
              onClick={() => {
                setShowGuestForm(false);
                setShowConnectConfirm(false);
                setActiveTab("bot");
              }}
              className={cn(
                "flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                activeTab === "bot" && !showGuestForm && !showConnectConfirm
                  ? "bg-white text-brand-action shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              )}
            >
              <Bot className="h-3.5 w-3.5" />
              <span>AI Assistant</span>
            </button>

            <button
              type="button"
              onClick={handleLiveTabClick}
              className={cn(
                "flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all relative cursor-pointer",
                activeTab === "live" || showGuestForm || showConnectConfirm
                  ? "bg-white text-brand-action shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              )}
            >
              <Headphones className="h-3.5 w-3.5" />
              <span>Live Specialist</span>
              {hasOnlineAgents && activeTab !== "live" && (
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping absolute top-1.5 right-2" />
              )}
            </button>
          </div>
        </CardHeader>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden relative flex flex-col min-h-0">
          {showConnectConfirm ? (
            /* Confirmation Dialog Before Connecting Live Support */
            <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-white">
              <div className="relative mb-4">
                <div className="h-16 w-16 rounded-3xl bg-brand-action/10 border border-brand-action/20 flex items-center justify-center text-brand-action shadow-sm">
                  <Headphones className="h-8 w-8 animate-pulse" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xs">
                  <div className="h-2 w-2 rounded-full bg-white animate-ping" />
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Connect with Live Support?
              </h3>
              <p className="text-xs text-slate-500 max-w-[260px] leading-relaxed mb-6">
                Can we connect you to our live specialist team? A certified diagnostic expert is ready to assist you directly.
              </p>

              <div className="w-full space-y-2.5">
                <button
                  type="button"
                  onClick={handleConfirmConnectLive}
                  className="w-full h-10 rounded-xl bg-brand-action hover:bg-brand-action-hover text-white text-xs font-bold transition-all shadow-md shadow-brand-action/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Headphones className="h-4 w-4" />
                  <span>Yes, Connect to Live Team</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowConnectConfirm(false);
                    setActiveTab("bot");
                  }}
                  className="w-full h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold transition-all cursor-pointer"
                >
                  Stay with AI Assistant
                </button>
              </div>
            </div>
          ) : showGuestForm ? (
            <GuestAuthForm
              onSubmit={handleGuestSubmit}
              onCancel={() => {
                setShowGuestForm(false);
                setActiveTab("bot");
              }}
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
              onCancelRequest={() => {
                onCancelLiveSupport();
                setActiveTab("bot");
              }}
            />
          ) : (
            <BotChatView
              messages={messages}
              onSendMessage={onSendBotMessage}
              onRequestLiveSupport={() => setShowConnectConfirm(true)}
              hasOnlineAgents={hasOnlineAgents}
            />
          )}
        </div>
      </Card>
    </div>
  );
}
