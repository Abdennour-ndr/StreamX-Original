import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_CONFIG } from '@/config/gemini';

// Initialize Gemini with configuration
const genAI = new GoogleGenerativeAI(GEMINI_CONFIG.apiKey);

interface ErrorWithCode extends Error {
  code?: string;
  status?: number;
}

export async function POST(request: Request) {
  try {
    console.log('Received chat request');
    console.log('Using API key:', GEMINI_CONFIG.apiKey ? 'Present' : 'Missing');
    
    if (!GEMINI_CONFIG.apiKey) {
      console.error('Gemini API key not configured');
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log('Request body:', body);

    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string') {
      console.error('Invalid or missing prompt:', prompt);
      return NextResponse.json(
        { error: 'Invalid or missing prompt' },
        { status: 400 }
      );
    }

    console.log('Generating response with prompt:', prompt);
    const model = genAI.getGenerativeModel({ model: GEMINI_CONFIG.defaultModel });
    
    try {
      const result = await model.generateContent(prompt);

      console.log('Raw Gemini response:', result);

      if (!result || !result.response || !result.response.candidates || result.response.candidates.length === 0) {
        console.error('Invalid response structure from Gemini');
        throw new Error('Invalid response structure from Gemini');
      }

      const response = result.response.candidates[0].content.parts[0].text;
      console.log('Generated response:', response);

      if (!response) {
        console.error('Empty response from Gemini');
        throw new Error('Empty response from Gemini');
      }

      return NextResponse.json({
        response
      });
    } catch (apiError) {
      console.error('Gemini API call failed:', apiError);
      throw apiError;
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    
    const err = error as ErrorWithCode;
    
    // Handle specific error types
    if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') {
      return NextResponse.json(
        { error: 'Connection timeout. Please try again.' },
        { status: 504 }
      );
    }
    
    if (err.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: err.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 