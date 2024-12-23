import React from "react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp: Date;
  responseTime?: number;
}

export const ChatMessage = ({ content, isUser, timestamp, responseTime }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 max-w-[80%] rounded-lg p-4",
        isUser ? "ml-auto bg-racing-blue/20" : "bg-black/30"
      )}
    >
      <p className="text-white">{content}</p>
      <div className="flex items-center justify-between gap-2 mt-1">
        <span className="text-xs text-gray-400">
          {timestamp.toLocaleTimeString()}
        </span>
        {!isUser && responseTime && (
          <span className="text-xs font-mono text-racing-yellow">
            {responseTime}ms
          </span>
        )}
      </div>
    </div>
  );
};