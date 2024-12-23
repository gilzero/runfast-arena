import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap } from "lucide-react";

export interface Model {
  id: string;
  name: string;
  speed: number; // Speed rating out of 100
  provider: string;
}

const models: Model[] = [
  { id: "gpt-3.5", name: "GPT-3.5 Turbo", speed: 90, provider: "OpenAI" },
  { id: "claude-haiku", name: "Claude Haiku", speed: 95, provider: "Anthropic" },
  { id: "groq", name: "Groq LLM", speed: 100, provider: "Groq" },
];

interface ModelSelectorProps {
  onModelSelect: (model: Model) => void;
  selectedModel: Model | null;
}

export const ModelSelector = ({ onModelSelect, selectedModel }: ModelSelectorProps) => {
  return (
    <div className="flex items-center gap-2 w-full max-w-xs">
      <Zap className="w-5 h-5 text-racing-yellow" />
      <Select
        onValueChange={(value) => {
          const model = models.find((m) => m.id === value);
          if (model) onModelSelect(model);
        }}
        value={selectedModel?.id}
      >
        <SelectTrigger className="w-full bg-black/50 border-racing-blue text-white">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent className="bg-black/90 border-racing-blue">
          {models.map((model) => (
            <SelectItem
              key={model.id}
              value={model.id}
              className="text-white hover:bg-racing-blue/20"
            >
              <div className="flex items-center justify-between w-full">
                <span>{model.name}</span>
                <span className="text-racing-yellow font-mono text-sm">
                  {model.speed}ms
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};