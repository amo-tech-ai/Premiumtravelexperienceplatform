/**
 * Base Agent Class - Production Implementation
 * All specialized agents extend this
 */

import { generateGeminiResponse, GeminiMessage } from '../gemini';

export interface AgentContext {
  userId?: string;
  tripId?: string;
  location?: string;
  preferences?: any;
  budget?: { min: number; max: number; currency: string };
}

export interface AgentRequest {
  query: string;
  context: AgentContext;
  conversationHistory?: GeminiMessage[];
}

export interface AgentResponse {
  content: string;
  suggestions: any[];
  reasoning: string;
  confidence: number;
  metadata?: any;
}

export abstract class BaseAgent {
  protected agentName: string;
  protected systemPrompt: string;

  constructor(agentName: string, systemPrompt: string) {
    this.agentName = agentName;
    this.systemPrompt = systemPrompt;
  }

  /**
   * Process agent request
   */
  async process(request: AgentRequest): Promise<AgentResponse> {
    const startTime = Date.now();

    try {
      // Build enhanced prompt
      const enhancedPrompt = this.buildPrompt(request);

      // Call Gemini
      const response = await generateGeminiResponse({
        message: enhancedPrompt,
        conversationHistory: request.conversationHistory,
        systemPrompt: this.systemPrompt,
      });

      // Parse response
      const parsed = this.parseResponse(response.content);

      // Log execution
      this.logExecution(request, parsed, Date.now() - startTime);

      return parsed;
    } catch (error: any) {
      console.error(`${this.agentName} error:`, error);
      throw error;
    }
  }

  /**
   * Build context-aware prompt
   */
  protected buildPrompt(request: AgentRequest): string {
    let prompt = request.query;

    // Add context
    if (request.context.location) {
      prompt += `\n\nLocation: ${request.context.location}`;
    }

    if (request.context.budget) {
      prompt += `\n\nBudget: ${request.context.budget.min}-${request.context.budget.max} ${request.context.budget.currency}`;
    }

    if (request.context.preferences) {
      prompt += `\n\nPreferences: ${JSON.stringify(request.context.preferences)}`;
    }

    return prompt;
  }

  /**
   * Parse AI response into structured format
   */
  protected abstract parseResponse(content: string): AgentResponse;

  /**
   * Log agent execution
   */
  protected logExecution(
    request: AgentRequest,
    response: AgentResponse,
    durationMs: number
  ): void {
    console.log(`[${this.agentName}] Executed in ${durationMs}ms`, {
      query: request.query.substring(0, 100),
      confidence: response.confidence,
      suggestionsCount: response.suggestions.length,
    });
  }
}
