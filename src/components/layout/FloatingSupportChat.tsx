"use client";

import { useState } from "react";
import { SupportChatTrigger } from "./support-chat/SupportChatTrigger";
import { SupportChatWindow } from "./support-chat/SupportChatWindow";

export function FloatingSupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Clinical assistance active. How can I help you with your diagnostic requirements today?",
      sender: "bot",
      time: "10:02 AM",
    },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newUserMsg = {
      id: Date.now(),
      text: message,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newUserMsg]);
    setMessage("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Analyzing query. A certified Litmus pathologist will connect with you within 2 minutes for professional consultation.",
          sender: "bot",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed bottom-20 right-5 md:bottom-8 md:right-8 z-[100]">
      <SupportChatTrigger isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
      <SupportChatWindow
        isOpen={isOpen}
        messages={messages}
        message={message}
        setMessage={setMessage}
        onSend={handleSend}
      />
    </div>
  );
}
