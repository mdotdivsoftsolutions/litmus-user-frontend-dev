"use client";

import { useRef, useEffect } from "react";
import { User, Activity, ShieldCheck, HeadphonesIcon, Waves, Send, Phone, HelpCircle, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SupportChatWindowProps {
  isOpen: boolean;
  messages: Array<{ id: number; text: string; sender: string; time: string }>;
  message: string;
  setMessage: (msg: string) => void;
  onSend: (e: React.FormEvent) => void;
}

export function SupportChatWindow({ isOpen, messages, message, setMessage, onSend }: SupportChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  return (
    <div
      className={cn(
        "absolute bottom-20 right-0 w-[360px] sm:w-[400px] transition-all duration-700 cubic-bezier(0.175, 0.885, 0.32, 1.275) transform origin-bottom-right z-50",
        isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-20 pointer-events-none"
      )}
    >
      <Card className="rounded-3xl border border-slate-200/50 bg-white shadow-[0_32px_64px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col h-[500px] max-h-[75vh]">
        <CardHeader className="bg-slate-950 p-8 relative overflow-hidden shrink-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-action/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-xl group-hover:bg-white/20 transition-all">
                <HeadphonesIcon className="h-7 w-7 text-blue-400" />
              </div>
              <div className="space-y-0.5">
                <CardTitle className="text-white text-xl font-bold tracking-tighter">Clinical Intelligence</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse outline outline-4 outline-emerald-500/20" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Safety Desk Live</span>
                </div>
              </div>
            </div>
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-white/40">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
        </CardHeader>

        <CardContent ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-transparent scrollbar-hide">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex flex-col gap-2", msg.sender === "user" ? "items-end" : "items-start")}>
              <div className={cn("flex items-center gap-2 px-2", msg.sender === "user" ? "flex-row-reverse" : "flex-row")}>
                <div
                  className={cn(
                    "h-7 w-7 rounded-lg flex items-center justify-center text-[10px] font-bold",
                    msg.sender === "user" ? "bg-slate-900 text-white" : "bg-brand-action/10 text-brand-action"
                  )}
                >
                  {msg.sender === "user" ? <User className="h-3.5 w-3.5" /> : <Activity className="h-3.5 w-3.5" />}
                </div>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                  {msg.sender === "user" ? "Client" : "Pathologist AI"}
                </span>
              </div>

              <div
                className={cn(
                  "p-5 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm relative group/msg",
                  msg.sender === "user"
                    ? "bg-gradient-to-br from-slate-800 to-slate-950 text-white rounded-tr-none border border-slate-700"
                    : "bg-white text-slate-600 rounded-tl-none border border-slate-100"
                )}
              >
                {msg.text}
                {msg.sender === "bot" && (
                  <div className="absolute -right-2 top-0 h-4 w-4 bg-emerald-500 rounded-full border-4 border-white shadow-sm" />
                )}
              </div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-4">{msg.time}</p>
            </div>
          ))}
        </CardContent>

        <CardFooter className="p-5 bg-slate-50/80 border-t border-slate-100 backdrop-blur-xl shrink-0">
          <form onSubmit={onSend} className="w-full space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Input
                  placeholder="Consult with our experts..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full h-14 rounded-2xl border-slate-100 bg-white/80 focus-visible:ring-brand-action text-sm font-medium pr-12 shadow-inner"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Waves className="h-4 w-4 text-slate-200 animate-pulse" />
                </div>
              </div>
              <Button
                type="submit"
                className="h-14 px-6 rounded-2xl bg-gradient-to-br from-brand-action to-blue-500 shadow-[0_12px_24px_rgba(0,75,96,0.3)] hover:shadow-brand-action/40 transition-all active:scale-95 border-0 text-white font-bold"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6">
              {[
                { icon: Phone, label: "Call Lab" },
                { icon: HelpCircle, label: "Safety Docs" },
                { icon: Heart, label: "Symptom Check" },
              ].map((act, i) => (
                <button
                  key={i}
                  type="button"
                  className="flex items-center gap-1.5 text-slate-400 hover:text-brand-action transition-colors group/act"
                >
                  <act.icon className="h-3.5 w-3.5 group-hover/act:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{act.label}</span>
                </button>
              ))}
            </div>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
