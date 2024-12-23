import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  isLoading: boolean;
}

export const ChatInput = ({ onSend, disabled, isLoading }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent h-20 -top-20 pointer-events-none" />
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
          placeholder="Type your message..."
          className="bg-black/50 border-racing-blue text-white"
          disabled={disabled || isLoading}
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !input.trim() || isLoading}
          className="bg-racing-blue hover:bg-racing-blue/80"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};