/**
 * Gemini AI Client
 * Production-ready wrapper for Google's Gemini API
 */

import { GoogleGenerativeAI, GenerativeModel, GenerationConfig } from '@google/generative-ai';

// --- TYPES ---

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface GeminiResponse {
  text: string;
  finishReason?: string;
  safetyRatings?: any[];
}

export interface GeminiConfig {
  temperature?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
}

export interface GeminiStreamCallback {
  onChunk: (text: string) => void;
  onComplete: (fullText: string) => void;
  onError: (error: Error) => void;
}

// --- CONFIGURATION ---

const DEFAULT_MODEL = 'gemini-1.5-flash'; // Fast, good for most use cases
const ADVANCED_MODEL = 'gemini-1.5-pro'; // More powerful, use for complex tasks

const DEFAULT_CONFIG: GenerationConfig = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 2048,
};

// --- CLIENT ---

export class GeminiClient {
  private client: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;
  private apiKey: string | null = null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || this.getApiKey();
    
    if (this.apiKey) {
      this.initialize();
    }
  }

  /**
   * Get API key from environment or localStorage
   */
  private getApiKey(): string | null {
    // Check environment variable
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) {
      return import.meta.env.VITE_GEMINI_API_KEY;
    }

    // Fallback to localStorage (for demo purposes)
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gemini_api_key');
    }

    return null;
  }

  /**
   * Reinitialize with new API key (async for validation)
   */
  async initialize(apiKey?: string): Promise<void> {
    if (apiKey) {
      this.apiKey = apiKey;
      if (typeof window !== 'undefined') {
        localStorage.setItem('gemini_api_key', apiKey);
      }
    }

    if (!this.apiKey) {
      console.warn('Gemini API key not found. AI features will use mock responses.');
      return;
    }

    try {
      this.client = new GoogleGenerativeAI(this.apiKey);
      this.model = this.client.getGenerativeModel({ model: DEFAULT_MODEL });
    } catch (error) {
      console.error('Failed to initialize Gemini client:', error);
      this.client = null;
      this.model = null;
      throw error;
    }
  }

  /**
   * Check if client is initialized and ready
   */
  isReady(): boolean {
    return this.client !== null && this.model !== null;
  }

  /**
   * Set or update API key
   */
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    
    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('gemini_api_key', apiKey);
    }
    
    this.initialize();
  }

  /**
   * Generate a response (non-streaming)
   */
  async generate(
    prompt: string,
    config?: Partial<GeminiConfig>,
    useAdvancedModel: boolean = false
  ): Promise<GeminiResponse> {
    if (!this.isReady()) {
      return this.getMockResponse(prompt);
    }

    try {
      // Use advanced model if requested
      const model = useAdvancedModel
        ? this.client!.getGenerativeModel({ model: ADVANCED_MODEL })
        : this.model!;

      const generationConfig = { ...DEFAULT_CONFIG, ...config };

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
      });

      const response = result.response;
      const text = response.text();

      return {
        text,
        finishReason: response.candidates?.[0]?.finishReason,
        safetyRatings: response.candidates?.[0]?.safetyRatings,
      };
    } catch (error) {
      console.error('Gemini generation error:', error);
      throw new Error(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a streaming response
   */
  async generateStream(
    prompt: string,
    callbacks: GeminiStreamCallback,
    config?: Partial<GeminiConfig>
  ): Promise<void> {
    if (!this.isReady()) {
      // Mock streaming for demo
      const mockResponse = this.getMockResponse(prompt);
      let currentText = '';
      
      for (const char of mockResponse.text) {
        currentText += char;
        callbacks.onChunk(currentText);
        await new Promise(resolve => setTimeout(resolve, 20)); // Simulate typing
      }
      
      callbacks.onComplete(currentText);
      return;
    }

    try {
      const generationConfig = { ...DEFAULT_CONFIG, ...config };

      const result = await this.model!.generateContentStream({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
      });

      let fullText = '';

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        callbacks.onChunk(fullText);
      }

      callbacks.onComplete(fullText);
    } catch (error) {
      console.error('Gemini streaming error:', error);
      callbacks.onError(error as Error);
    }
  }

  /**
   * Chat conversation (maintains history)
   */
  async chat(
    messages: GeminiMessage[],
    config?: Partial<GeminiConfig>
  ): Promise<GeminiResponse> {
    if (!this.isReady()) {
      const lastMessage = messages[messages.length - 1];
      return this.getMockResponse(lastMessage.parts[0].text);
    }

    try {
      const generationConfig = { ...DEFAULT_CONFIG, ...config };

      const chat = this.model!.startChat({
        history: messages.slice(0, -1).map(msg => ({
          role: msg.role,
          parts: msg.parts,
        })),
        generationConfig,
      });

      const lastMessage = messages[messages.length - 1];
      const result = await chat.sendMessage(lastMessage.parts[0].text);
      const text = result.response.text();

      return {
        text,
        finishReason: result.response.candidates?.[0]?.finishReason,
        safetyRatings: result.response.candidates?.[0]?.safetyRatings,
      };
    } catch (error) {
      console.error('Gemini chat error:', error);
      throw new Error(`Failed to chat: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Classify user intent (custom for our use case)
   */
  async classifyIntent(userMessage: string): Promise<{
    intent: 'event_discovery' | 'dining' | 'optimization' | 'budget' | 'booking' | 'general';
    confidence: number;
    entities: Record<string, any>;
  }> {
    const prompt = `Classify the user's intent from their message. Return JSON only.

User message: "${userMessage}"

Possible intents:
- event_discovery: Looking for events, activities, things to do
- dining: Restaurant recommendations, food questions
- optimization: Route optimization, scheduling, conflicts
- budget: Budget questions, cost estimates
- booking: Reservation or booking requests
- general: General travel questions

Extract any entities like dates, locations, cuisines, budgets, etc.

Return format:
{
  "intent": "intent_name",
  "confidence": 0.0-1.0,
  "entities": { "date": "...", "location": "...", etc }
}`;

    try {
      const response = await this.generate(prompt, { temperature: 0.3 });
      
      // Parse JSON from response
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback
      return {
        intent: 'general',
        confidence: 0.5,
        entities: {},
      };
    } catch (error) {
      console.error('Intent classification error:', error);
      
      // Fallback to keyword matching
      return this.classifyIntentFallback(userMessage);
    }
  }

  /**
   * Fallback intent classification (keyword-based)
   */
  private classifyIntentFallback(message: string): {
    intent: 'event_discovery' | 'dining' | 'optimization' | 'budget' | 'booking' | 'general';
    confidence: number;
    entities: Record<string, any>;
  } {
    const lower = message.toLowerCase();

    if (/(event|activity|things to do|happening|festival|concert)/i.test(lower)) {
      return { intent: 'event_discovery', confidence: 0.8, entities: {} };
    }
    
    if (/(restaurant|food|eat|dining|lunch|dinner|breakfast)/i.test(lower)) {
      return { intent: 'dining', confidence: 0.8, entities: {} };
    }
    
    if (/(optimize|route|schedule|conflict|overlap|reorder)/i.test(lower)) {
      return { intent: 'optimization', confidence: 0.8, entities: {} };
    }
    
    if (/(budget|cost|price|expensive|cheap|afford)/i.test(lower)) {
      return { intent: 'budget', confidence: 0.8, entities: {} };
    }
    
    if (/(book|reserve|reservation|confirm)/i.test(lower)) {
      return { intent: 'booking', confidence: 0.8, entities: {} };
    }

    return { intent: 'general', confidence: 0.5, entities: {} };
  }

  /**
   * Mock response for demo/fallback
   */
  private getMockResponse(prompt: string): GeminiResponse {
    const lower = prompt.toLowerCase();

    if (lower.includes('event') || lower.includes('activity')) {
      return {
        text: "I found some great events happening in Medellín! Let me search for specific dates and show you the best options. Would you like cultural events, music, food festivals, or outdoor activities?",
      };
    }

    if (lower.includes('restaurant') || lower.includes('food')) {
      return {
        text: "I can help you find amazing restaurants in Medellín! What type of cuisine are you interested in? I can recommend anything from traditional Colombian to fine dining experiences.",
      };
    }

    if (lower.includes('optimize') || lower.includes('route')) {
      return {
        text: "I'll optimize your itinerary to minimize travel time and maximize your experience! Give me a moment to analyze your schedule and suggest improvements.",
      };
    }

    return {
      text: "I'm here to help plan your trip to Medellín! I can discover events, recommend restaurants, optimize your route, track your budget, and make bookings. What would you like to do?",
    };
  }
}

// --- SINGLETON INSTANCE ---

let geminiInstance: GeminiClient | null = null;

export function getGeminiClient(): GeminiClient {
  if (!geminiInstance) {
    geminiInstance = new GeminiClient();
  }
  return geminiInstance;
}

export function initializeGemini(apiKey: string): GeminiClient {
  geminiInstance = new GeminiClient(apiKey);
  return geminiInstance;
}

// --- EXPORTS ---

export default GeminiClient;