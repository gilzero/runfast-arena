import React, { useState, useRef, useEffect } from "react";
import { ModelSelector, type Model } from "@/components/ModelSelector";
import { SpeedMetrics } from "@/components/SpeedMetrics";
import { ChatMessage } from "@/components/ChatMessage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getModelResponse, type Message as ApiMessage } from "@/utils/modelApis";

interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: Date;
  responseTime?: number;
  model?: string;
}

const Index = () => {
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const clearContext = () => {
    setMessages([]);
    toast({
      title: "Context Cleared",
      description: "Started a new conversation",
    });
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedModel) {
      toast({
        title: "Error",
        description: selectedModel ? "Please enter a message" : "Please select a model first",
        variant: "destructive",
      });
      return;
    }

    const userMessage: ChatMessage = {
      content: input,
      isUser: true,
      timestamp: new Date(),
      model: selectedModel.id,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const relevantMessages = messages
        .filter(m => !m.model || m.model === selectedModel.id)
        .map(m => ({
          role: m.isUser ? "user" as const : "assistant" as const,
          content: m.content
        }));

      const { content, responseTime } = await getModelResponse(
        selectedModel.id,
        input,
        relevantMessages
      );

      const botMessage: ChatMessage = {
        content,
        isUser: false,
        timestamp: new Date(),
        responseTime,
        model: selectedModel.id,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response from the model",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const lastResponseTime = messages.filter(m => !m.isUser).slice(-1)[0]?.responseTime || null;
  const averageResponseTime = messages.filter(m => !m.isUser && m.responseTime)
    .reduce((acc, curr) => acc + (curr.responseTime || 0), 0) / messages.filter(m => !m.isUser).length || null;

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col p-4 sm:p-6">
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-white">
            run<span className="text-racing-blue">fa.st</span>
          </h1>
          <Button
            onClick={clearContext}
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
            onModelSelect={setSelectedModel}
          />
          <SpeedMetrics
            lastResponseTime={lastResponseTime}
            averageResponseTime={averageResponseTime}
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-[400px] max-h-[600px] p-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} {...message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent h-20 -top-20 pointer-events-none" />
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
            placeholder="Type your message..."
            className="bg-black/50 border-racing-blue text-white"
            disabled={!selectedModel || isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!selectedModel || !input.trim() || isLoading}
            className="bg-racing-blue hover:bg-racing-blue/80"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;