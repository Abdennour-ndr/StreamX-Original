import OpenAI from 'openai';
import { AI_CONFIG, OPENAI_API_KEY } from './config';

class OpenAIService {
  private openai: OpenAI;
  private cache: Map<string, { result: any; timestamp: number }>;

  constructor() {
    this.openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });
    this.cache = new Map();
  }

  private getCacheKey(prompt: string, options: any = {}): string {
    return `${prompt}-${JSON.stringify(options)}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return AI_CONFIG.cache.enabled && 
           Date.now() - timestamp < AI_CONFIG.cache.ttl;
  }

  async generateText(prompt: string, options: Partial<typeof AI_CONFIG.openai> = {}) {
    const cacheKey = this.getCacheKey(prompt, options);
    const cached = this.cache.get(cacheKey);

    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.result;
    }

    const completion = await this.openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: options.model || AI_CONFIG.openai.model,
      temperature: options.temperature || AI_CONFIG.openai.temperature,
      max_tokens: options.maxTokens || AI_CONFIG.openai.maxTokens,
      top_p: options.topP || AI_CONFIG.openai.topP,
      frequency_penalty: options.frequencyPenalty || AI_CONFIG.openai.frequencyPenalty,
      presence_penalty: options.presencePenalty || AI_CONFIG.openai.presencePenalty,
    });

    const result = completion.choices[0].message.content;
    
    if (AI_CONFIG.cache.enabled) {
      this.cache.set(cacheKey, {
        result,
        timestamp: Date.now(),
      });
    }

    return result;
  }

  async analyzeContent(content: string) {
    const prompt = `Please analyze the following content and provide insights:
    
    ${content}
    
    Provide analysis in the following format:
    1. Main themes
    2. Sentiment
    3. Key takeaways
    4. Suggested improvements`;

    return this.generateText(prompt);
  }

  async generatePersonalizedRecommendations(
    userPreferences: any,
    userHistory: any
  ) {
    const prompt = `Based on the following user preferences and history, generate personalized content recommendations:
    
    User Preferences:
    ${JSON.stringify(userPreferences, null, 2)}
    
    User History:
    ${JSON.stringify(userHistory, null, 2)}
    
    Provide recommendations in the following format:
    1. Content type preferences
    2. Topic interests
    3. Specific recommendations
    4. Engagement optimization suggestions`;

    return this.generateText(prompt);
  }

  async generateResponse(
    userInput: string,
    context: any = {}
  ) {
    const prompt = `Given the following user input and context, generate an appropriate response:
    
    User Input: ${userInput}
    Context: ${JSON.stringify(context, null, 2)}
    
    Generate a natural, helpful response that addresses the user's needs while considering the provided context.`;

    return this.generateText(prompt);
  }
}

export const openAIService = new OpenAIService(); 