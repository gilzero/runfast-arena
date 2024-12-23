export interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: Date;
  responseTime?: number;
  model?: string;
}

export interface Model {
  id: string;
  name: string;
  speed: number;
  provider: string;
}