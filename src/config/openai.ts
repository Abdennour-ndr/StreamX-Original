interface OpenAIConfigType {
  apiKey: string;
  organization?: string;
  defaultModel: string;
  defaultTemperature: number;
  defaultMaxTokens: number;
  useCache: boolean;
  cacheTTL: number;
}

export const OPENAI_CONFIG: OpenAIConfigType = {
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  organization: process.env.NEXT_PUBLIC_OPENAI_ORGANIZATION,
  defaultModel: 'gpt-3.5-turbo',
  defaultTemperature: 0.7,
  defaultMaxTokens: 500,
  useCache: true,
  cacheTTL: 3600000, // 1 hour
}; 