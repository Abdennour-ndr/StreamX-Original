export const AI_CONFIG = {
  openai: {
    model: 'gpt-4-turbo-preview',
    temperature: 0.7,
    maxTokens: 2000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
  },
  features: {
    contentRecommendation: true,
    experiencePersonalization: true,
    behaviorAnalysis: true,
    intelligentAssistant: true,
  },
  learning: {
    enableContinuousLearning: true,
    feedbackCollection: true,
    modelUpdateInterval: 24 * 60 * 60 * 1000, // 24 hours
  },
  cache: {
    enabled: true,
    ttl: 60 * 60 * 1000, // 1 hour
  },
};

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is not set');
} 