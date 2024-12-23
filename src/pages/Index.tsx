import React, { useState, useRef, useEffect } from "react";
import { ModelSelector, type Model } from "@/components/ModelSelector";
import { SpeedMetrics } from "@/components/SpeedMetrics";
import { ChatMessage } from "@/components/ChatMessage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
  responseTime?: number;
}

const simulateModelResponse = async (model: Model, message: string) => {
  const startTime = Date.now();
  
  // Simulate different response times based on model speed
  const baseDelay = 1000; // 1 second base delay
  const speedFactor = (100 - model.speed) / 100; // Convert speed rating to delay factor
  const delay = baseDelay * speedFactor;
  
  await new Promise((resolve) => setTimeout(resolve, delay));
  
  return {
    content: `Response from ${model.name}: I received your message "${message}" and processed it at ${model.speed}% speed.`,
    responseTime: Date.now() - startTime
  };
};

const Index = () => {
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
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

  const handleSend = async () => {
    if (!input.trim() || !selectedModel) {
      toast({
        title: "Error",
        description: selectedModel ? "Please enter a message" : "Please select a model first",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { content, responseTime } = await simulateModelResponse(selectedModel, input);
      
      const botMessage: Message = {
        content,
        isUser: false,
        timestamp: new Date(),
        responseTime,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from the model",
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
        <h1 className="text-3xl font-bold text-white">
          run<span className="text-racing-blue">fa.st</span>
        </h1>
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