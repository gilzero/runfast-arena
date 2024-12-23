import React, { useRef, useEffect } from "react";
import { ChatMessage as Message } from "@/components/ChatMessage";
import type { ChatMessage } from "@/types/chat";

interface ChatMessagesProps {
  messages: ChatMessage[];
}

export const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-[400px] max-h-[600px] p-4">
      {messages.map((message, index) => (
        <Message key={index} {...message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};