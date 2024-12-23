interface ModelResponse {
  content: string;
  responseTime: number;
}

const callGroq = async (message: string, apiKey: string): Promise<ModelResponse> => {
  const startTime = Date.now();
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

const callClaude = async (message: string, apiKey: string): Promise<ModelResponse> => {
  const startTime = Date.now();
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [{ role: 'user', content: message }]
    })
  });

  if (!response.ok) {
    throw new Error('Failed to get response from Claude');
  }

  const data = await response.json();
  return {
    content: data.content[0].text,
    responseTime: Date.now() - startTime
  };
};

const callOpenAI = async (message: string, apiKey: string): Promise<ModelResponse> => {
  const startTime = Date.now();
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

export const getModelResponse = async (model: string, message: string, apiKey: string): Promise<ModelResponse> => {
  switch (model) {
    case 'groq':
      return callGroq(message, apiKey);
    case 'claude-haiku':
      return callClaude(message, apiKey);
    case 'gpt-3.5':
      return callOpenAI(message, apiKey);
    default:
      throw new Error('Unsupported model');
  }
};