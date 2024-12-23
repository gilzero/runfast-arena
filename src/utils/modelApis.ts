import { supabase } from "@/integrations/supabase/client";
import Anthropic from "@anthropic-ai/sdk";

interface ModelResponse {
  content: string;
  responseTime: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const getApiKey = async (provider: string) => {
  const { data: { value }, error } = await supabase.functions.invoke('get-api-key', {
    body: { provider },
  });
  
  if (error) throw new Error(`Failed to get API key for ${provider}`);
  return value;
};

const callGroq = async (message: string, previousMessages: Message[] = []): Promise<ModelResponse> => {
  const startTime = Date.now();
  const apiKey = await getApiKey('GROQ');
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'mixtral-8x7b-32768',
      messages: [
        ...previousMessages,
        { role: 'user', content: message }
      ],
      temperature: 0.5,
    })
  });

  if (!response.ok) {
    throw new Error('Failed to get response from Groq');
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    responseTime: Date.now() - startTime
  };
};

const callClaude = async (message: string, previousMessages: Message[] = []): Promise<ModelResponse> => {
  const startTime = Date.now();
  const apiKey = await getApiKey('ANTHROPIC');
  
  const anthropic = new Anthropic({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      messages: [
        ...previousMessages,
        {
          role: "user",
          content: message
        }
      ]
    });

    const textContent = response.content.find(block => block.type === 'text');
    if (!textContent || typeof textContent.text !== 'string') {
      throw new Error('Unexpected response format from Claude API');
    }

    return {
      content: textContent.text,
      responseTime: Date.now() - startTime
    };
  } catch (error) {
    console.error('Claude API Error:', error);
    throw new Error(`Failed to get response from Claude: ${error.message || 'Unknown error'}`);
  }
};

const callOpenAI = async (message: string, previousMessages: Message[] = []): Promise<ModelResponse> => {
  const startTime = Date.now();
  const apiKey = await getApiKey('OPENAI');
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        ...previousMessages,
        { role: 'user', content: message }
      ],
      temperature: 0.7,
    })
  });

  if (!response.ok) {
    throw new Error('Failed to get response from OpenAI');
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    responseTime: Date.now() - startTime
  };
};

export const getModelResponse = async (
  model: string, 
  message: string, 
  previousMessages: Message[] = []
): Promise<ModelResponse> => {
  switch (model) {
    case 'groq':
      return callGroq(message, previousMessages);
    case 'claude-haiku':
      return callClaude(message, previousMessages);
    case 'gpt-3.5':
      return callOpenAI(message, previousMessages);
    default:
      throw new Error('Unsupported model');
  }
};