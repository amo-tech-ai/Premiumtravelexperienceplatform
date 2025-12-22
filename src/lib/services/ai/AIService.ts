/**
 * AI Service
 * Handles Gemini API integration and AI agent orchestration
 */

import { getGeminiClient } from '../../ai/gemini-client';
import type { AgentContext, AgentResponse } from '../../ai/agents/base-agent';
import { createAgent } from '../../ai/agents';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  context?: AgentContext;
  history?: ChatMessage[];
  agentType?: 'local-scout' | 'dining' | 'itinerary' | 'budget' | 'booking' | 'event';
}

export interface ChatResponse {
  message: string;
  agentUsed: string;
  suggestions?: string[];
  actions?: any[];
  metadata?: Record<string, any>;
}

export class AIService {
  private geminiClient: any;

  constructor() {
    this.geminiClient = getGeminiClient();
  }

  /**
   * Send a chat message and get AI response
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      // Determine which agent to use
      const agentType = request.agentType || this.determineAgentType(request.message);
      
      // Create agent
      const agent = createAgent(agentType);
      
      // Prepare context
      const context: AgentContext = request.context || {
        conversationHistory: request.history || [],
        userPreferences: {},
        currentLocation: '',
      };
      
      // Execute agent
      const response = await agent.execute(request.message, context);
      
      return {
        message: response.message,
        agentUsed: agentType,
        suggestions: response.suggestions || [],
        actions: response.actions || [],
        metadata: response.metadata || {},
      };
    } catch (error) {
      console.error('[AIService] Chat error:', error);
      throw error;
    }
  }

  /**
   * Stream a chat response
   */
  async* streamChat(request: ChatRequest): AsyncGenerator<string> {
    try {
      const prompt = this.buildPrompt(request);
      
      // Use Gemini streaming
      for await (const chunk of this.geminiClient.streamText(prompt)) {
        yield chunk;
      }
    } catch (error) {
      console.error('[AIService] Stream error:', error);
      throw error;
    }
  }

  /**
   * Generate itinerary using AI
   */
  async generateItinerary(params: {
    destination: string;
    duration: number;
    budget?: number;
    interests?: string[];
    travelers?: number;
  }): Promise<any> {
    try {
      const agent = createAgent('itinerary');
      
      const prompt = `Generate a ${params.duration}-day itinerary for ${params.destination}`;
      const context: AgentContext = {
        conversationHistory: [],
        userPreferences: {
          budget: params.budget,
          interests: params.interests || [],
          travelers: params.travelers || 1,
        },
        currentLocation: params.destination,
      };
      
      const response = await agent.execute(prompt, context);
      
      return {
        days: response.metadata?.days || [],
        suggestions: response.suggestions || [],
        totalCost: response.metadata?.totalCost || 0,
      };
    } catch (error) {
      console.error('[AIService] Generate itinerary error:', error);
      throw error;
    }
  }

  /**
   * Get recommendations for a specific category
   */
  async getRecommendations(params: {
    category: 'food' | 'activities' | 'stays';
    location: string;
    preferences?: any;
  }): Promise<any[]> {
    try {
      const agentType = this.mapCategoryToAgent(params.category);
      const agent = createAgent(agentType);
      
      const prompt = `Recommend ${params.category} in ${params.location}`;
      const context: AgentContext = {
        conversationHistory: [],
        userPreferences: params.preferences || {},
        currentLocation: params.location,
      };
      
      const response = await agent.execute(prompt, context);
      
      return response.metadata?.recommendations || [];
    } catch (error) {
      console.error('[AIService] Get recommendations error:', error);
      throw error;
    }
  }

  /**
   * Optimize itinerary route
   */
  async optimizeRoute(activities: any[]): Promise<any[]> {
    try {
      const agent = createAgent('itinerary');
      
      const prompt = `Optimize the route for these activities to minimize travel time`;
      const context: AgentContext = {
        conversationHistory: [],
        userPreferences: {},
        currentLocation: '',
        metadata: { activities },
      };
      
      const response = await agent.execute(prompt, context);
      
      return response.metadata?.optimizedActivities || activities;
    } catch (error) {
      console.error('[AIService] Optimize route error:', error);
      throw error;
    }
  }

  /**
   * Check budget and suggest alternatives
   */
  async checkBudget(params: {
    currentSpending: number;
    totalBudget: number;
    remainingDays: number;
  }): Promise<{
    isOverBudget: boolean;
    recommendations: string[];
    alternatives: any[];
  }> {
    try {
      const agent = createAgent('budget');
      
      const prompt = `Current spending: $${params.currentSpending}, Budget: $${params.totalBudget}, Remaining days: ${params.remainingDays}`;
      const context: AgentContext = {
        conversationHistory: [],
        userPreferences: {},
        currentLocation: '',
      };
      
      const response = await agent.execute(prompt, context);
      
      return {
        isOverBudget: params.currentSpending > params.totalBudget,
        recommendations: response.suggestions || [],
        alternatives: response.metadata?.alternatives || [],
      };
    } catch (error) {
      console.error('[AIService] Check budget error:', error);
      throw error;
    }
  }

  /**
   * Determine which agent to use based on message content
   */
  private determineAgentType(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('restaurant') || lowerMessage.includes('food') || lowerMessage.includes('dining')) {
      return 'dining';
    }
    
    if (lowerMessage.includes('itinerary') || lowerMessage.includes('plan') || lowerMessage.includes('schedule')) {
      return 'itinerary';
    }
    
    if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
      return 'budget';
    }
    
    if (lowerMessage.includes('book') || lowerMessage.includes('reserve')) {
      return 'booking';
    }
    
    if (lowerMessage.includes('event') || lowerMessage.includes('concert') || lowerMessage.includes('show')) {
      return 'event';
    }
    
    return 'local-scout';
  }

  /**
   * Map category to agent type
   */
  private mapCategoryToAgent(category: string): string {
    const mapping: Record<string, string> = {
      food: 'dining',
      activities: 'local-scout',
      stays: 'local-scout',
    };
    
    return mapping[category] || 'local-scout';
  }

  /**
   * Build prompt with context
   */
  private buildPrompt(request: ChatRequest): string {
    let prompt = request.message;
    
    // Add context if available
    if (request.context?.currentLocation) {
      prompt += `\n\nContext: User is in ${request.context.currentLocation}`;
    }
    
    // Add preferences
    if (request.context?.userPreferences) {
      const prefs = request.context.userPreferences;
      if (prefs.budget) {
        prompt += `\nBudget: $${prefs.budget}`;
      }
      if (prefs.interests && prefs.interests.length > 0) {
        prompt += `\nInterests: ${prefs.interests.join(', ')}`;
      }
    }
    
    // Add history
    if (request.history && request.history.length > 0) {
      prompt += '\n\nConversation history:\n';
      request.history.slice(-5).forEach(msg => {
        prompt += `${msg.role}: ${msg.content}\n`;
      });
    }
    
    return prompt;
  }
}

// Export singleton instance
export const aiService = new AIService();
