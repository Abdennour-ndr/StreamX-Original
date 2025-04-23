import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_CONFIG } from '../config/gemini';

interface CacheItem {
  response: string;
  timestamp: number;
}

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private cache: Map<string, CacheItem>;

  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_CONFIG.apiKey);
    this.cache = new Map();
  }

  private getCacheKey(prompt: string, model: string): string {
    return `${model}:${prompt}`;
  }

  private getFromCache(prompt: string, model: string): string | null {
    if (!GEMINI_CONFIG.useCache) return null;
    
    const cacheKey = this.getCacheKey(prompt, model);
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < GEMINI_CONFIG.cacheTTL) {
      return cached.response;
    }
    
    return null;
  }

  private setCache(prompt: string, model: string, response: string): void {
    if (!GEMINI_CONFIG.useCache) return;
    
    const cacheKey = this.getCacheKey(prompt, model);
    this.cache.set(cacheKey, {
      response,
      timestamp: Date.now()
    });
  }

  async generateText(
    prompt: string,
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<string> {
    const model = options.model || GEMINI_CONFIG.defaultModel;
    const temperature = options.temperature || GEMINI_CONFIG.defaultTemperature;
    const maxTokens = options.maxTokens || GEMINI_CONFIG.defaultMaxTokens;

    // Check cache first
    const cachedResponse = this.getFromCache(prompt, model);
    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const modelInstance = this.genAI.getGenerativeModel({ model });
      
      const result = await modelInstance.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
        },
      });

      const response = result.response.text();
      
      // Cache the response
      this.setCache(prompt, model, response);
      
      return response;
    } catch (error) {
      console.error('Error generating text with Gemini:', error);
      throw error;
    }
  }

  async analyzeContent(
    content: string,
    options: {
      model?: string;
      temperature?: number;
    } = {}
  ): Promise<string> {
    const prompt = `Analyze the following content and provide insights:\n\n${content}`;
    return this.generateText(prompt, options);
  }
} 