import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getModelResponse } from "@/utils/modelApis";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessages } from "@/components/ChatMessages";
import { ChatInput } from "@/components/ChatInput";
import type { ChatMessage, Model } from "@/types/chat";

const Index = () => {
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const clearContext = () => {
    setMessages([]);
    toast({
      title: "Context Cleared",
      description: "Started a new conversation",
    });
  };

  const handleSend = async (input: string) => {
    if (!selectedModel) {
      toast({
        title: "Error",
        description: "Please select a model first",
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
    setIsLoading(true);

    try {
      const relevantMessages = messages
        .filter((m) => !m.model || m.model === selectedModel.id)
        .map((m) => ({
          role: m.isUser ? ("user" as const) : ("assistant" as const),
          content: m.content,
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
        description:
          error instanceof Error ? error.message : "Failed to get response from the model",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const lastResponseTime =
    messages.filter((m) => !m.isUser).slice(-1)[0]?.responseTime || null;
  const averageResponseTime =
    messages.filter((m) => !m.isUser && m.responseTime).reduce(
      (acc, curr) => acc + (curr.responseTime || 0),
      0
    ) / messages.filter((m) => !m.isUser).length || null;

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col p-4 sm:p-6">
      <ChatHeader
        selectedModel={selectedModel}
        onModelSelect={setSelectedModel}
        onClearChat={clearContext}
        lastResponseTime={lastResponseTime}
        averageResponseTime={averageResponseTime}
      />
      <ChatMessages messages={messages} />
      <ChatInput
        onSend={handleSend}
        disabled={!selectedModel}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Index;