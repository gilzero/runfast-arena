import { supabase } from "@/integrations/supabase/client";
import Anthropic from "@anthropic-ai/sdk";

interface ModelResponse {
  content: string;
  responseTime: number;
}

const getApiKey = async (provider: string) => {
  const { data: { value }, error } = await supabase.functions.invoke('get-api-key', {
    body: { provider },
  });
  
  if (error) throw new Error(`Failed to get API key for ${provider}`);
  return value;
};

const callGroq = async (message: string): Promise<ModelResponse> => {
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
      messages: [{ role: 'user', content: message }],
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

const callClaude = async (message: string): Promise<ModelResponse> => {
  const startTime = Date.now();
  const apiKey = await getApiKey('ANTHROPIC');
  
  const anthropic = new Anthropic({
    apiKey: apiKey
  });

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: message
        }
      ]
    });

    return {
      content: response.content[0].text,
      responseTime: Date.now() - startTime
    };
  } catch (error) {
    console.error('Claude API Error:', error);
    throw new Error(`Failed to get response from Claude: ${error.message || 'Unknown error'}`);
  }
};

const callOpenAI = async (message: string): Promise<ModelResponse> => {
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
      messages: [{ role: 'user', content: message }],
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

export const getModelResponse = async (model: string, message: string): Promise<ModelResponse> => {
  switch (model) {
    case 'groq':
      return callGroq(message);
    case 'claude-haiku':
      return callClaude(message);
    case 'gpt-3.5':
      return callOpenAI(message);
    default:
      throw new Error('Unsupported model');
  }
};