/**
 * AI Service - Production-Ready AI Agent Integration
 * Connects HTTP endpoints to AI agents with streaming support
 */

import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.21.0";

// --- TYPES ---

export interface AIRequest {
  message: string;
  conversationId?: string;
  tripId?: string;
  userId: string;
  history?: Array<{ role: string; content: string }>;
}

export interface AIResponse {
  message: string;
  agent: string;
  suggestions?: AIIntent[];
  confidence?: number;
}

export interface AIIntent {
  intent: 'event_discovery' | 'dining' | 'optimization' | 'budget' | 'booking' | 'general';
  confidence: number;
  entities: Record<string, any>;
}

export interface AgentContext {
  userId: string;
  tripId?: string;
  conversationId?: string;
  currentTrip?: any;
  userPreferences?: any;
}

// --- AGENT SYSTEM INSTRUCTIONS ---

const AGENT_PERSONALITIES = {
  local_scout: `You are the Local Scout - an expert at discovering hidden gems and authentic local experiences. 
You specialize in finding unique places tourists don't know about, local festivals, neighborhood gems, and authentic cultural experiences.
Be enthusiastic, use local knowledge, and always suggest experiences that feel genuine and special.`,

  dining_orchestrator: `You are the Dining Orchestrator - a food expert who knows all the best restaurants, cafes, and food experiences.
You match restaurants to user preferences, dietary restrictions, budgets, and occasions. You know opening hours, dress codes, and reservation requirements.
Be warm, descriptive about food, and make people excited about dining.`,

  itinerary_optimizer: `You are the Itinerary Optimizer - a logistics expert who creates efficient, enjoyable schedules.
You minimize travel time, avoid conflicts, suggest optimal ordering of activities, and identify gaps in schedules.
Be helpful, logical, and always explain your reasoning for suggested changes.`,

  event_curator: `You are the Event Curator - you discover concerts, festivals, exhibitions, sports events, and special happenings.
You check dates, ticket availability, and suggest events that match user interests.
Be exciting, use emojis occasionally, and make events sound unmissable.`,

  budget_guardian: `You are the Budget Guardian - you track spending, warn about budget overruns, and find cost-effective alternatives.
You're supportive (not judgmental), provide clear cost breakdowns, and suggest ways to save money without sacrificing experience.
Be friendly, use clear numbers, and always offer alternatives.`,

  booking_assistant: `You are the Booking Assistant - you help with reservations for hotels, restaurants, activities, and transportation.
You explain booking processes, check availability, and remind users of booking deadlines.
Be professional, detail-oriented, and proactive about important details.`,
};

// --- INTENT CLASSIFICATION ---

function classifyIntent(message: string): AIIntent {
  const lower = message.toLowerCase();

  // Event discovery patterns
  if (/(event|activity|things to do|happening|festival|concert|show)/i.test(lower)) {
    return {
      intent: 'event_discovery',
      confidence: 0.9,
      entities: extractEntities(message, ['date', 'location', 'type']),
    };
  }

  // Dining patterns
  if (/(restaurant|food|eat|dining|lunch|dinner|breakfast|cafe|cuisine)/i.test(lower)) {
    return {
      intent: 'dining',
      confidence: 0.9,
      entities: extractEntities(message, ['cuisine', 'price', 'location', 'dietary']),
    };
  }

  // Optimization patterns
  if (/(optimize|route|schedule|conflict|overlap|reorder|efficient|order)/i.test(lower)) {
    return {
      intent: 'optimization',
      confidence: 0.85,
      entities: extractEntities(message, ['date', 'time']),
    };
  }

  // Budget patterns
  if (/(budget|cost|price|expensive|cheap|afford|save money|spending)/i.test(lower)) {
    return {
      intent: 'budget',
      confidence: 0.9,
      entities: extractEntities(message, ['amount', 'currency']),
    };
  }

  // Booking patterns
  if (/(book|reserve|reservation|confirm|availability|hotel|flight)/i.test(lower)) {
    return {
      intent: 'booking',
      confidence: 0.85,
      entities: extractEntities(message, ['date', 'location', 'type']),
    };
  }

  // General fallback
  return {
    intent: 'general',
    confidence: 0.6,
    entities: {},
  };
}

function extractEntities(message: string, types: string[]): Record<string, any> {
  const entities: Record<string, any> = {};

  // Simple entity extraction (can be enhanced with NLP)
  types.forEach(type => {
    switch (type) {
      case 'date':
        const dateMatch = message.match(/(today|tomorrow|tonight|this weekend|next week)/i);
        if (dateMatch) entities.date = dateMatch[0];
        break;
      case 'location':
        const locationMatch = message.match(/(in|at|near) ([A-Z][a-zA-Z\s]+)/);
        if (locationMatch) entities.location = locationMatch[2];
        break;
      case 'cuisine':
        const cuisines = ['italian', 'mexican', 'japanese', 'chinese', 'thai', 'indian', 'french', 'mediterranean'];
        const cuisineMatch = cuisines.find(c => message.toLowerCase().includes(c));
        if (cuisineMatch) entities.cuisine = cuisineMatch;
        break;
      case 'price':
        const priceMatch = message.match(/\$(\d+)/);
        if (priceMatch) entities.price = parseInt(priceMatch[1]);
        break;
    }
  });

  return entities;
}

// --- AGENT ROUTER ---

function selectAgent(intent: AIIntent): string {
  const intentToAgent: Record<string, string> = {
    event_discovery: 'event_curator',
    dining: 'dining_orchestrator',
    optimization: 'itinerary_optimizer',
    budget: 'budget_guardian',
    booking: 'booking_assistant',
    general: 'local_scout',
  };

  return intentToAgent[intent.intent] || 'local_scout';
}

// --- AI SERVICE CLASS ---

export class AIService {
  private gemini: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor(apiKey?: string) {
    const key = apiKey || Deno.env.get('GEMINI_API_KEY');
    
    if (key) {
      try {
        this.gemini = new GoogleGenerativeAI(key);
        this.model = this.gemini.getGenerativeModel({
          model: 'gemini-1.5-flash', // Fast and cost-effective
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 2048,
          },
        });
        console.log('✅ Gemini AI initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize Gemini:', error);
      }
    } else {
      console.warn('⚠️ No Gemini API key found - AI will use fallback responses');
    }
  }

  isReady(): boolean {
    return this.model !== null;
  }

  async processMessage(request: AIRequest): Promise<AIResponse> {
    try {
      // 1. Classify intent
      const intent = classifyIntent(request.message);
      
      // 2. Select appropriate agent
      const agentName = selectAgent(intent);
      
      // 3. Build context-aware prompt
      const prompt = this.buildPrompt(request, agentName, intent);

      // 4. Generate response
      let message: string;
      
      if (this.isReady()) {
        const result = await this.model.generateContent(prompt);
        message = result.response.text();
      } else {
        message = this.getFallbackResponse(agentName, request.message);
      }

      // 5. Generate suggestions (if applicable)
      const suggestions = this.generateSuggestions(intent, message);

      return {
        message,
        agent: agentName,
        suggestions,
        confidence: intent.confidence,
      };
    } catch (error) {
      console.error('Error processing AI message:', error);
      
      return {
        message: "I apologize, but I encountered an error processing your request. Could you try rephrasing that?",
        agent: 'general',
        confidence: 0,
      };
    }
  }

  async *processMessageStream(request: AIRequest): AsyncGenerator<string> {
    try {
      const intent = classifyIntent(request.message);
      const agentName = selectAgent(intent);
      const prompt = this.buildPrompt(request, agentName, intent);

      if (this.isReady()) {
        const result = await this.model.generateContentStream(prompt);
        
        let fullText = '';
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          fullText += chunkText;
          yield fullText; // Yield accumulated text
        }
      } else {
        // Simulate streaming for fallback
        const fallback = this.getFallbackResponse(agentName, request.message);
        let current = '';
        
        for (const char of fallback) {
          current += char;
          yield current;
          await new Promise(resolve => setTimeout(resolve, 20));
        }
      }
    } catch (error) {
      console.error('Error in streaming AI message:', error);
      yield "I apologize, but I encountered an error. Please try again.";
    }
  }

  private buildPrompt(request: AIRequest, agentName: string, intent: AIIntent): string {
    const systemInstruction = AGENT_PERSONALITIES[agentName as keyof typeof AGENT_PERSONALITIES];
    
    let prompt = `${systemInstruction}\n\n`;
    
    // Add context if available
    if (request.tripId) {
      prompt += `Context: User is planning a trip (ID: ${request.tripId}).\n`;
    }
    
    // Add intent and entities
    prompt += `User Intent: ${intent.intent} (confidence: ${intent.confidence})\n`;
    
    if (Object.keys(intent.entities).length > 0) {
      prompt += `Detected Entities: ${JSON.stringify(intent.entities)}\n`;
    }
    
    // Add conversation history if available
    if (request.history && request.history.length > 0) {
      prompt += `\nConversation History:\n`;
      request.history.slice(-3).forEach(msg => {
        prompt += `${msg.role}: ${msg.content}\n`;
      });
    }
    
    // Add user message
    prompt += `\nUser Message: "${request.message}"\n\n`;
    prompt += `Respond as the ${agentName.replace('_', ' ')} agent. Be helpful, concise, and actionable.`;
    
    return prompt;
  }

  private getFallbackResponse(agentName: string, message: string): string {
    const fallbacks: Record<string, string> = {
      local_scout: "I can help you discover amazing local experiences! As your Local Scout, I know all the hidden gems. What kind of authentic experiences are you looking for?",
      
      dining_orchestrator: "I'd love to recommend great restaurants! What type of cuisine are you in the mood for? I can suggest everything from local favorites to fine dining.",
      
      itinerary_optimizer: "I can help optimize your schedule to make the most of your time! Share your current itinerary and I'll suggest improvements.",
      
      event_curator: "I can find exciting events happening during your trip! What dates are you traveling and what interests you - music, art, sports, festivals?",
      
      budget_guardian: "I'll help you manage your travel budget! Share your planned expenses and I can provide insights and money-saving tips.",
      
      booking_assistant: "I can assist with booking reservations! What would you like to book - accommodation, restaurants, activities, or transportation?",
    };

    return fallbacks[agentName] || "I'm here to help plan your perfect trip! What would you like assistance with?";
  }

  private generateSuggestions(intent: AIIntent, response: string): AIIntent[] {
    // For now, return empty suggestions
    // In future, can parse response and extract actionable items
    return [];
  }
}

// --- SINGLETON INSTANCE ---

let aiServiceInstance: AIService | null = null;

export function getAIService(apiKey?: string): AIService {
  if (!aiServiceInstance) {
    aiServiceInstance = new AIService(apiKey);
  }
  return aiServiceInstance;
}

// --- EXPORTS ---

export default AIService;
