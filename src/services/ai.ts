import axios from 'axios';

const AZURE_API_KEY = process.env.NEXT_PUBLIC_AZURE_API_KEY;
const AZURE_ENDPOINT = process.env.NEXT_PUBLIC_AZURE_ENDPOINT;

export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  sentences: Array<{
    text: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
  }>;
}

export interface FaceDetection {
  faceId: string;
  faceRectangle: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  faceAttributes: {
    age: number;
    gender: string;
    smile: number;
    emotion: {
      anger: number;
      contempt: number;
      disgust: number;
      fear: number;
      happiness: number;
      neutral: number;
      sadness: number;
      surprise: number;
    };
  };
}

export interface MetaDescription {
  title: string;
  description: string;
  keywords: string[];
}

class AIService {
  private client = axios.create({
    baseURL: AZURE_ENDPOINT,
    headers: {
      'Ocp-Apim-Subscription-Key': AZURE_API_KEY,
      'Content-Type': 'application/json',
    },
  });

  async analyzeSentiment(text: string): Promise<SentimentAnalysis> {
    try {
      const response = await this.client.post('/text/analytics/v3.0/sentiment', {
        documents: [
          {
            id: '1',
            text,
          },
        ],
      });
      return response.data.documents[0];
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      throw error;
    }
  }

  async detectFaces(imageUrl: string): Promise<FaceDetection[]> {
    try {
      const response = await this.client.post('/face/v1.0/detect', {
        url: imageUrl,
      }, {
        params: {
          returnFaceAttributes: 'age,gender,smile,emotion',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error detecting faces:', error);
      throw error;
    }
  }

  async generateMetaDescription(content: string): Promise<MetaDescription> {
    try {
      const response = await this.client.post('/text/analytics/v3.0/keyphrases', {
        documents: [
          {
            id: '1',
            text: content,
          },
        ],
      });

      const keyPhrases = response.data.documents[0].keyPhrases;
      const title = this.generateTitle(content);
      const description = this.generateDescription(content, keyPhrases);

      return {
        title,
        description,
        keywords: keyPhrases,
      };
    } catch (error) {
      console.error('Error generating meta description:', error);
      throw error;
    }
  }

  private generateTitle(content: string): string {
    // Simple implementation - can be enhanced with more sophisticated logic
    const sentences = content.split(/[.!?]+/);
    return sentences[0].trim();
  }

  private generateDescription(content: string, keywords: string[]): string {
    // Simple implementation - can be enhanced with more sophisticated logic
    const sentences = content.split(/[.!?]+/);
    const relevantSentences = sentences.filter(sentence =>
      keywords.some(keyword => sentence.toLowerCase().includes(keyword.toLowerCase()))
    );
    return relevantSentences.slice(0, 2).join('. ') + '.';
  }

  async analyzeImage(imageUrl: string): Promise<any> {
    try {
      const response = await this.client.post('/vision/v3.2/analyze', {
        url: imageUrl,
      }, {
        params: {
          visualFeatures: 'Categories,Description,Color',
          details: 'Celebrities,Landmarks',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  }
}

export const aiService = new AIService(); 