interface GeminiConfigType {
  apiKey: string;
  defaultModel: string;
  defaultTemperature: number;
  defaultMaxTokens: number;
  useCache: boolean;
  cacheTTL: number;
}

export const GEMINI_CONFIG: GeminiConfigType = {
  apiKey: process.env.GEMINI_API_KEY || 'AIzaSyDs8iGVdDbwkgkNm9aPvePPOXyh_t_Ejzk',
  defaultModel: 'gemini-pro',
  defaultTemperature: 0.7,
  defaultMaxTokens: 2048,
  useCache: true,
  cacheTTL: 3600000, // 1 hour
}; 