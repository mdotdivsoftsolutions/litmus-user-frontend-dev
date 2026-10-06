"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import {
  ChatActionSuggestion,
  DEFAULT_CHAT_PROMPTS,
  LIVE_SUPPORT_AWAY_MESSAGE,
  LIVE_SUPPORT_ATTEMPT_SECONDS,
  LIVE_SUPPORT_MAX_ATTEMPTS,
  LIVE_SUPPORT_TOTAL_SECONDS,
} from "@/lib/liveSupport";

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
  actionSuggestions?: ChatActionSuggestion[];
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

  const [queueStartedAt, setQueueStartedAt] = useState<number | null>(null);
  const [queueElapsedSec, setQueueElapsedSec] = useState(0);

  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const queueTimeoutSentRef = useRef(false);
  const isAuthenticated = Boolean(currentUser && (currentUser._id || currentUser.id));

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
            setChatStatus(res.session.status === "MISSED" ? "BOT" : res.session.status || "BOT");
            // Resume the retry countdown from the real queue time after a page reload.
            if (res.session.status === "QUEUED" && res.session.queuedAt) {
              setQueueStartedAt(new Date(res.session.queuedAt).getTime());
            }
            setHasOnlineAgents(Boolean(res.hasOnlineAgents));

            if (res.transcript && res.transcript.length > 0) {
              const enriched = res.transcript.map((m: any, idx: number) => {
                if (idx === 0 && m.senderType === "BOT" && (!m.actionSuggestions || m.actionSuggestions.length === 0)) {
                  return {
                    ...m,
                    actionSuggestions: DEFAULT_CHAT_PROMPTS,
                  };
                }
                return m;
              });
              setMessages(enriched);
            } else {
              // Add initial welcome message if no history
              setMessages([
                {
                  sessionId: res.session.sessionId,
                  senderType: "BOT",
                  senderName: "Litmus Intelligence",
                  text: "Hello! Welcome to Litmus Food & Laboratory Testing Assistance. How can we assist you today?",
                  actionSuggestions: DEFAULT_CHAT_PROMPTS,
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
      // Sanitize SYSTEM messages on the client side to hide employee names
      let sanitizedMsg = { ...msg };
      if (sanitizedMsg.senderType === "SYSTEM" && sanitizedMsg.text) {
        if (sanitizedMsg.text.toLowerCase().includes("forwarded to specialist")) {
          sanitizedMsg.text = "Conversation forwarded to Litmus Specialist.";
        }
      }

      setMessages((prev) => {
        // Deduplicate
        const exists = prev.some(
          (m) =>
            (m._id && sanitizedMsg._id && m._id === sanitizedMsg._id) ||
            (m.clientMessageId && sanitizedMsg.clientMessageId && m.clientMessageId === sanitizedMsg.clientMessageId)
        );
        if (exists) {
          return prev.map((m) =>
            m.clientMessageId === sanitizedMsg.clientMessageId ? { ...sanitizedMsg, status: "delivered" } : m
          );
        }
        return [...prev, { ...sanitizedMsg, status: "delivered" }];
      });
    });

    // ── Chat State Transitions ─────────────────────────────────────────────
    newSocket.on("chat_queued", (data: any) => {
      setChatStatus("QUEUED");
      setAgentDisconnectedAlert(false);
    });

    newSocket.on("chat_connected", (data: any) => {
      setChatStatus("ACTIVE");
      setAssignedAgentName("Litmus Specialist");
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

    newSocket.on("chat_cancelled", () => {
      setChatStatus("BOT");
      setAgentDisconnectedAlert(false);
    });

    // No specialist accepted within the retry window: server posted the "agents away" auto-reply.
    newSocket.on("chat_missed", () => {
      setChatStatus("BOT");
      setAgentDisconnectedAlert(false);
    });

    newSocket.on("agents_online_status", (data: { hasOnline: boolean }) => {
      setHasOnlineAgents(data.hasOnline);
    });

    return () => {
      newSocket.removeAllListeners();
      newSocket.disconnect();
    };
  }, [guestInfo?.guestId, currentUser?._id]);

  // ── Queue retry countdown (lives here so it survives tab switches) ────────
  useEffect(() => {
    if (chatStatus !== "QUEUED") {
      setQueueStartedAt(null);
      setQueueElapsedSec(0);
      queueTimeoutSentRef.current = false;
      return;
    }
    if (queueStartedAt === null) {
      setQueueStartedAt(Date.now());
      return;
    }
    const tick = () => setQueueElapsedSec(Math.max(0, Math.floor((Date.now() - queueStartedAt) / 1000)));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [chatStatus, queueStartedAt]);

  useEffect(() => {
    if (chatStatus !== "QUEUED" || queueElapsedSec < LIVE_SUPPORT_TOTAL_SECONDS) return;
    if (queueTimeoutSentRef.current || !socket || !sessionId) return;
    queueTimeoutSentRef.current = true;

    setChatStatus("BOT");
    socket
      .timeout(8000)
      .emit(
        "live_support_timeout",
        { sessionId, attempts: LIVE_SUPPORT_MAX_ATTEMPTS },
        (err: Error | null, res?: { success?: boolean; missed?: boolean }) => {
          // Server normally posts the auto-reply itself; fall back locally if it could not.
          if (err || !res?.success || !res.missed) {
            setMessages((prev) => [
              ...prev,
              {
                sessionId,
                senderType: "BOT",
                senderName: "Litmus Assistant",
                text: LIVE_SUPPORT_AWAY_MESSAGE,
                actionSuggestions: [{ label: "🔁 Try Live Chat Again", action: "request_live_support" }, ...DEFAULT_CHAT_PROMPTS.slice(0, 3)],
                createdAt: new Date().toISOString(),
              },
            ]);
          }
        }
      );
  }, [chatStatus, queueElapsedSec, socket, sessionId]);

  const queueAttempt = Math.min(LIVE_SUPPORT_MAX_ATTEMPTS, Math.floor(queueElapsedSec / LIVE_SUPPORT_ATTEMPT_SECONDS) + 1);

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

      socket.emit("bot_query", { sessionId, text: text.trim(), clientMessageId, isAuthenticated }, (res: any) => {
        setIsSubmitting(false);
        if (!res?.success) {
          setMessages((prev) =>
            prev.map((m) => (m.clientMessageId === clientMessageId ? { ...m, status: "failed" } : m))
          );
        }
      });
    },
    [socket, sessionId, isAuthenticated]
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
        const isRegistered = Boolean(currentUser && (currentUser._id || currentUser.id));
        socket.emit("request_live_support", {
          sessionId,
          guestInfo: isRegistered
            ? {
                guestId: guestInfo?.guestId || "",
                name: `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || currentUser.email,
                phone: currentUser.phone,
                email: currentUser.email,
              }
            : {
                guestId: guestInfo?.guestId || "",
                name: guestInfo?.name,
                phone: guestInfo?.phone,
                email: guestInfo?.email,
              },
          initialQuery: text,
          userId: isRegistered ? (currentUser._id || currentUser.id) : undefined,
          userType: isRegistered ? "REGISTERED" : "GUEST",
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
    [socket, sessionId, chatStatus, guestInfo, currentUser]
  );

  // ── Request Live Support ──────────────────────────────────────────────────
  const requestLiveSupport = useCallback(
    (info?: { name?: string; phone?: string; email?: string }) => {
      if (!socket || !sessionId) return;

      const isRegistered = Boolean(currentUser && (currentUser._id || currentUser.id));

      const customerFullName = isRegistered
        ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim()
        : undefined;

      const mergedGuestInfo = isRegistered
        ? {
            guestId: guestInfo?.guestId || "",
            name: customerFullName || currentUser?.email || "Registered Client",
            phone: currentUser?.phone,
            email: currentUser?.email,
          }
        : {
            guestId: guestInfo?.guestId || "",
            name: info?.name?.trim() || "Guest User",
            phone: info?.phone?.trim(),
            email: info?.email?.trim(),
          };

      // Only save to localStorage if guest info was specifically entered for guest
      if (!isRegistered && info?.name) {
        const updated = { ...guestInfo, ...mergedGuestInfo };
        setGuestInfo(updated);
        try {
          localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updated));
        } catch {}
      }

      setIsSubmitting(true);
      setChatStatus("QUEUED");
      socket.emit(
        "request_live_support",
        {
          sessionId,
          guestInfo: mergedGuestInfo,
          userId: isRegistered ? (currentUser._id || currentUser.id) : undefined,
          userType: isRegistered ? "REGISTERED" : "GUEST",
        },
        (res: any) => {
          setIsSubmitting(false);
          if (res?.success) {
            setChatStatus("QUEUED");
          }
        }
      );
    },
    [socket, sessionId, guestInfo, currentUser]
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
        setChatStatus("BOT");
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

  // ── Cancel Live Support Request ───────────────────────────────────────────
  const cancelLiveSupport = useCallback(() => {
    if (!socket || !sessionId) return;
    socket.emit("cancel_live_support", { sessionId, attempts: queueAttempt }, () => {
      setChatStatus("BOT");
    });
  }, [socket, sessionId, queueAttempt]);

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
    cancelLiveSupport,
    emitTyping,
    submitRating,
    requeueChat,
    setChatStatus,
    queueElapsedSec,
    queueAttempt,
    isAuthenticated,
  };
}
