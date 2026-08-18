"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { SupportChatTrigger } from "./support-chat/SupportChatTrigger";
import { SupportChatWindow } from "./support-chat/SupportChatWindow";
import { useSocketChat } from "@/hooks/useSocketChat";

export function FloatingSupportChat() {
  const [isOpen, setIsOpen] = useState(false);

  // Fetch logged-in user data if authenticated
  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const currentUser = userData?.data || userData?.user || null;

  const {
    chatStatus,
    messages,
    hasOnlineAgents,
    isAgentTyping,
    assignedAgentName,
    agentDisconnectedAlert,
    showRatingPrompt,
    unreadCount,
    sendBotQuery,
    sendLiveMessage,
    requestLiveSupport,
    emitTyping,
    submitRating,
    requeueChat,
  } = useSocketChat(currentUser);

  return (
    <div className="fixed bottom-20 right-5 md:bottom-8 md:right-8 z-[100]">
      <SupportChatTrigger
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        unreadCount={unreadCount}
        hasOnlineAgents={hasOnlineAgents}
      />
      <SupportChatWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        chatStatus={chatStatus}
        messages={messages}
        hasOnlineAgents={hasOnlineAgents}
        isAgentTyping={isAgentTyping}
        assignedAgentName={assignedAgentName}
        agentDisconnectedAlert={agentDisconnectedAlert}
        showRatingPrompt={showRatingPrompt}
        currentUser={currentUser}
        onSendBotMessage={sendBotQuery}
        onSendLiveMessage={sendLiveMessage}
        onRequestLiveSupport={requestLiveSupport}
        onEmitTyping={emitTyping}
        onRequeue={requeueChat}
        onSubmitRating={submitRating}
      />
    </div>
  );
}
