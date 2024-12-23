import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ModelSelector } from "@/components/ModelSelector";
import { SpeedMetrics } from "@/components/SpeedMetrics";
import type { Model } from "@/types/chat";

interface ChatHeaderProps {
  selectedModel: Model | null;
  onModelSelect: (model: Model) => void;
  onClearChat: () => void;
  lastResponseTime: number | null;
  averageResponseTime: number | null;
}

export const ChatHeader = ({
  selectedModel,
  onModelSelect,
  onClearChat,
  lastResponseTime,
  averageResponseTime,
}: ChatHeaderProps) => {
  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold text-white">
          run<span className="text-racing-blue">fa.st</span>
        </h1>
        <Button
          onClick={onClearChat}
          variant="outline"
          className="border-racing-blue text-racing-blue hover:bg-racing-blue hover:text-white transition-colors"
          size="sm"
        >
          <Trash2 className="w-4 h-4" />
          Clear Chat
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <ModelSelector
          selectedModel={selectedModel}
          onModelSelect={onModelSelect}
        />
        <SpeedMetrics
          lastResponseTime={lastResponseTime}
          averageResponseTime={averageResponseTime}
        />
      </div>
    </header>
  );
};