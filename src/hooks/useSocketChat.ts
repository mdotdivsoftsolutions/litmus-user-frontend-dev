"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

export interface ChatMessageItem {
  id?: string;
  _id?: string;
  clientMessageId?: string;
  sessionId: string;
  senderType: "USER" | "AGENT" | "BOT" | "SYSTEM";
  senderName?: string;
  text: string;
  attachments?: Array<{ url: string; name: string; type: string; size?: number }>;
  createdAt?: string | Date;
  status?: "pending" | "delivered" | "failed";
  actionSuggestions?: Array<{ label: string; action: string; payload?: any }>;
}

export interface GuestInfo {
  guestId: string;
  name?: string;
  phone?: string;
  email?: string;
}

const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  (process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1\/?$/, "")
    : "http://localhost:5000");

const GUEST_STORAGE_KEY = "litmus_chat_guest_session";

export function useSocketChat(currentUser?: any) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [chatStatus, setChatStatus] = useState<"BOT" | "QUEUED" | "ACTIVE" | "RESOLVED" | "MISSED">("BOT");
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [hasOnlineAgents, setHasOnlineAgents] = useState(false);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null);
  const [assignedAgentName, setAssignedAgentName] = useState<string>("Litmus Specialist");
  const [agentDisconnectedAlert, setAgentDisconnectedAlert] = useState(false);
  const [showRatingPrompt, setShowRatingPrompt] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize guest info from localStorage or generate new
  useEffect(() => {
    if (typeof window === "undefined") return;

    let saved = null;
    try {
      const item = localStorage.getItem(GUEST_STORAGE_KEY);
      if (item) saved = JSON.parse(item);
    } catch {}

    if (saved && saved.guestId) {
      setGuestInfo(saved);
      if (saved.sessionId) setSessionId(saved.sessionId);
    } else {
      const newGuest: GuestInfo = {
        guestId: `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      };
      setGuestInfo(newGuest);
      try {
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(newGuest));
      } catch {}
    }
  }, []);

  // Initialize Socket.io connection
  useEffect(() => {
    if (typeof window === "undefined" || !guestInfo) return;

    let guestToken: string | undefined;
    try {
      const saved = JSON.parse(localStorage.getItem(GUEST_STORAGE_KEY) || "{}");
      guestToken = saved.guestToken;
    } catch {}

    const newSocket = io(SOCKET_SERVER_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      auth: {
        token: guestToken,
      },
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);

      const activeSessionId = sessionId || `session_${guestInfo.guestId}`;

      // Initialize session on server
      newSocket.emit(
        "init_session",
        {
          sessionId: activeSessionId,
          userType: currentUser ? "REGISTERED" : "GUEST",
          userId: currentUser?._id || currentUser?.id,
          guestInfo: currentUser
            ? {
                guestId: guestInfo.guestId,
                name: `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim(),
                email: currentUser.email,
                phone: currentUser.phone,
              }
            : guestInfo,
          guestToken,
        },
        (res: any) => {
          if (res?.success) {
            setSessionId(res.session.sessionId);
            setChatStatus(res.session.status || "BOT");
            setHasOnlineAgents(Boolean(res.hasOnlineAgents));

            if (res.transcript && res.transcript.length > 0) {
              setMessages(res.transcript);
            } else {
              // Add initial welcome message if no history
              setMessages([
                {
                  sessionId: res.session.sessionId,
                  senderType: "BOT",
                  senderName: "Litmus Intelligence",
                  text: "Hello! Welcome to Litmus Diagnostic & Food Testing Assistance. How can we assist you today?",
                  actionSuggestions: [
                    { label: "🔬 Food Testing Services", action: "ask_faq", payload: "food_testing_overview" },
                    { label: "🥛 Dairy & Milk Quality", action: "ask_category", payload: "dairy" },
                    { label: "📦 How to Send Samples", action: "ask_faq", payload: "sample_submission" },
                    { label: "⏱️ Turnaround Times", action: "ask_faq", payload: "turnaround_time" },
                    { label: "👨‍🔬 Talk to Live Specialist", action: "request_live_support" },
                  ],
                  createdAt: new Date().toISOString(),
                },
              ]);
            }

            if (res.guestToken) {
              try {
                const updatedGuest = { ...guestInfo, guestToken: res.guestToken, sessionId: res.session.sessionId };
                localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updatedGuest));
                setGuestInfo(updatedGuest);
              } catch {}
            }
          }
        }
      );

      // Check online agents
      newSocket.emit("check_agents_online", (res: any) => {
        setHasOnlineAgents(Boolean(res?.hasOnline));
      });
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    // ── Incoming Messages ──────────────────────────────────────────────────
    newSocket.on("receive_message", (msg: ChatMessageItem) => {
      setMessages((prev) => {
        // Deduplicate
        const exists = prev.some(
          (m) =>
            (m._id && msg._id && m._id === msg._id) ||
            (m.clientMessageId && msg.clientMessageId && m.clientMessageId === msg.clientMessageId)
        );
        if (exists) {
          return prev.map((m) =>
            m.clientMessageId === msg.clientMessageId ? { ...msg, status: "delivered" } : m
          );
        }
        return [...prev, { ...msg, status: "delivered" }];
      });
    });

    // ── Chat State Transitions ─────────────────────────────────────────────
    newSocket.on("chat_queued", (data: any) => {
      setChatStatus("QUEUED");
      setAgentDisconnectedAlert(false);
    });

    newSocket.on("chat_connected", (data: any) => {
      setChatStatus("ACTIVE");
      setAssignedAgentName(data.agentName || "Litmus Specialist");
      setAgentDisconnectedAlert(false);
    });

    newSocket.on("user_typing", (data: { isTyping: boolean; senderType: string }) => {
      if (data.senderType === "AGENT") {
        setIsAgentTyping(data.isTyping);
      }
    });

    newSocket.on("chat_ended", (data: any) => {
      setChatStatus("RESOLVED");
      if (data?.showRatingPrompt) {
        setShowRatingPrompt(true);
      }
    });

    newSocket.on("agents_online_status", (data: { hasOnline: boolean }) => {
      setHasOnlineAgents(data.hasOnline);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [guestInfo?.guestId, currentUser?._id]);

  // ── Send Bot Query ────────────────────────────────────────────────────────
  const sendBotQuery = useCallback(
    (text: string) => {
      if (!socket || !text.trim() || !sessionId) return;

      const clientMessageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const optimisticMsg: ChatMessageItem = {
        clientMessageId,
        sessionId,
        senderType: "USER",
        text: text.trim(),
        createdAt: new Date().toISOString(),
        status: "pending",
      };

      setMessages((prev) => [...prev, optimisticMsg]);
      setIsSubmitting(true);

      socket.emit("bot_query", { sessionId, text: text.trim(), clientMessageId }, (res: any) => {
        setIsSubmitting(false);
        if (!res?.success) {
          setMessages((prev) =>
            prev.map((m) => (m.clientMessageId === clientMessageId ? { ...m, status: "failed" } : m))
          );
        }
      });
    },
    [socket, sessionId]
  );

  // ── Send Live Message ─────────────────────────────────────────────────────
  const sendLiveMessage = useCallback(
    (text: string, attachments?: any[]) => {
      if (!socket || (!text.trim() && (!attachments || attachments.length === 0)) || !sessionId) return;

      const clientMessageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const optimisticMsg: ChatMessageItem = {
        clientMessageId,
        sessionId,
        senderType: "USER",
        text: text ? text.trim() : "",
        attachments,
        createdAt: new Date().toISOString(),
        status: "pending",
      };

      setMessages((prev) => [...prev, optimisticMsg]);

      // Stop typing
      socket.emit("typing_indicator", { sessionId, isTyping: false });

      // If session was in BOT status, automatically transition to live queue
      if (chatStatus === "BOT") {
        setChatStatus("QUEUED");
        socket.emit("request_live_support", {
          sessionId,
          guestInfo: guestInfo || undefined,
          initialQuery: text,
        });
      }

      socket.emit(
        "send_message",
        {
          sessionId,
          clientMessageId,
          text: text ? text.trim() : "",
          attachments,
        },
        (res: any) => {
          if (res?.success) {
            setMessages((prev) =>
              prev.map((m) => (m.clientMessageId === clientMessageId ? { ...m, status: "delivered", _id: res.messageId } : m))
            );
          } else {
            setMessages((prev) =>
              prev.map((m) => (m.clientMessageId === clientMessageId ? { ...m, status: "failed" } : m))
            );
          }
        }
      );
    },
    [socket, sessionId, chatStatus, guestInfo]
  );

  // ── Request Live Support ──────────────────────────────────────────────────
  const requestLiveSupport = useCallback(
    (info?: { name?: string; phone?: string; email?: string }) => {
      if (!socket || !sessionId) return;

      const mergedGuestInfo = {
        name: info?.name || guestInfo?.name,
        phone: info?.phone || guestInfo?.phone,
        email: info?.email || guestInfo?.email,
      };

      // Update local storage with user contact details
      if (guestInfo) {
        const updated = { ...guestInfo, ...mergedGuestInfo };
        setGuestInfo(updated);
        try {
          localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updated));
        } catch {}
      }

      setIsSubmitting(true);
      setChatStatus("QUEUED");
      socket.emit("request_live_support", { sessionId, guestInfo: mergedGuestInfo }, (res: any) => {
        setIsSubmitting(false);
        if (res?.success) {
          setChatStatus("QUEUED");
        }
      });
    },
    [socket, sessionId, guestInfo]
  );

  // ── Emit Typing Indicator ─────────────────────────────────────────────────
  const emitTyping = useCallback(
    (isTyping: boolean) => {
      if (!socket || !sessionId || chatStatus !== "ACTIVE") return;

      socket.emit("typing_indicator", { sessionId, isTyping });

      if (isTyping) {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          socket.emit("typing_indicator", { sessionId, isTyping: false });
        }, 3000);
      }
    },
    [socket, sessionId, chatStatus]
  );

  // ── Rate Session ──────────────────────────────────────────────────────────
  const submitRating = useCallback(
    (score: number, feedback?: string) => {
      if (!socket || !sessionId) return;
      socket.emit("rate_session", { sessionId, score, feedback }, (res: any) => {
        setShowRatingPrompt(false);
      });
    },
    [socket, sessionId]
  );

  // ── Re-queue Session ──────────────────────────────────────────────────────
  const requeueChat = useCallback(() => {
    if (!socket || !sessionId) return;
    socket.emit("requeue_chat", { sessionId }, (res: any) => {
      if (res?.success) {
        setChatStatus("QUEUED");
        setAgentDisconnectedAlert(false);
      }
    });
  }, [socket, sessionId]);

  return {
    socket,
    isConnected,
    sessionId,
    chatStatus,
    messages,
    hasOnlineAgents,
    isAgentTyping,
    isSubmitting,
    guestInfo,
    assignedAgentName,
    agentDisconnectedAlert,
    showRatingPrompt,
    setShowRatingPrompt,
    unreadCount,
    setUnreadCount,
    sendBotQuery,
    sendLiveMessage,
    requestLiveSupport,
    emitTyping,
    submitRating,
    requeueChat,
    setChatStatus,
  };
}
