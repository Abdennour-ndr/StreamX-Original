import OpenAI from 'openai';
import { OPENAI_CONFIG } from '@/config/openai';

interface CacheEntry {
  value: string;
  timestamp: number;
}

interface GenerateOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  useCache?: boolean;
}

class OpenAIService {
  private openai: OpenAI;
  private cache: Map<string, CacheEntry>;
  private cacheTTL: number;

  constructor() {
    this.openai = new OpenAI({
      apiKey: OPENAI_CONFIG.apiKey,
      organization: OPENAI_CONFIG.organization,
    });
    this.cache = new Map();
    this.cacheTTL = OPENAI_CONFIG.cacheTTL || 3600000; // 1 hour default
  }

  private generateCacheKey(prompt: string, options?: GenerateOptions): string {
    return JSON.stringify({ prompt, options });
  }

  private isCacheValid(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < this.cacheTTL;
  }

  private async retryWithExponentialBackoff<T>(
    operation: () => Promise<T>,
    maxAttempts: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt === maxAttempts) break;

        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError || new Error('Operation failed after multiple attempts');
  }

  async generateText(prompt: string, options: GenerateOptions = {}): Promise<string> {
    const {
      model = OPENAI_CONFIG.defaultModel,
      temperature = OPENAI_CONFIG.defaultTemperature,
      maxTokens = OPENAI_CONFIG.defaultMaxTokens,
      useCache = OPENAI_CONFIG.useCache,
    } = options;

    if (useCache) {
      const cacheKey = this.generateCacheKey(prompt, options);
      const cached = this.cache.get(cacheKey);
      if (cached && this.isCacheValid(cached)) {
        return cached.value;
      }
    }

    const response = await this.retryWithExponentialBackoff(async () => {
      const completion = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model,
        temperature,
        max_tokens: maxTokens,
      });

      return completion.choices[0]?.message?.content || '';
    });

    if (useCache) {
      const cacheKey = this.generateCacheKey(prompt, options);
      this.cache.set(cacheKey, {
        value: response,
        timestamp: Date.now(),
      });
    }

    return response;
  }

  async analyzeContent(content: string): Promise<string> {
    const prompt = `Please analyze the following content and provide insights:\n\n${content}`;
    return this.generateText(prompt, {
      temperature: 0.3,
      maxTokens: 500,
    });
  }

  async generatePersonalizedRecommendations(
    userPreferences: string,
    context: string
  ): Promise<string> {
    const prompt = `Based on the following user preferences:\n${userPreferences}\n\nAnd this context:\n${context}\n\nGenerate personalized recommendations.`;
    return this.generateText(prompt, {
      temperature: 0.7,
      maxTokens: 300,
    });
  }

  async generateResponse(userInput: string, context?: string): Promise<string> {
    const prompt = context
      ? `Context: ${context}\n\nUser Input: ${userInput}\n\nResponse:`
      : userInput;
    return this.generateText(prompt, {
      temperature: 0.7,
      maxTokens: 200,
    });
  }
}

export const openAIService = new OpenAIService(); 