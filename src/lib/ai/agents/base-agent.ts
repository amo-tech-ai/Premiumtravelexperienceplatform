/**
 * Base Agent Class
 * Abstract class for all AI agents
 */

import { getGeminiClient, GeminiClient } from '../gemini-client';
import { getEventBus, EventBus } from '../event-bus';
import type {
  AgentType,
  AgentStatus,
  AgentRequest,
  AgentResponse,
  AgentContext,
  AgentSuggestion,
  AgentConfig,
} from '../types';

export abstract class BaseAgent {
  protected gemini: GeminiClient;
  protected bus: EventBus;
  protected config: AgentConfig;
  protected status: AgentStatus = 'idle';

  constructor(config: AgentConfig) {
    this.gemini = getGeminiClient();
    this.bus = getEventBus();
    this.config = config;

    // Subscribe to agent requests
    this.bus.on('agent:request', async (payload) => {
      if (payload.data.agentType === this.config.type) {
        await this.handleRequest(payload.data);
      }
    });
  }

  /**
   * Main request handler - must be implemented by each agent
   */
  protected abstract processRequest(
    request: AgentRequest,
    context: AgentContext
  ): Promise<any>;

  /**
   * Generate suggestions based on results - optional override
   */
  protected generateSuggestions(data: any): AgentSuggestion[] {
    return [];
  }

  /**
   * Handle incoming request
   */
  private async handleRequest(request: AgentRequest): Promise<void> {
    this.status = 'thinking';

    try {
      this.bus.emit('agent:status', {
        agentType: this.config.type,
        status: 'thinking',
      });

      // Process the request
      const result = await this.processRequest(request, request.context);

      this.status = 'complete';

      // Generate suggestions
      const suggestions = this.generateSuggestions(result);

      // Create response
      const response: AgentResponse = {
        id: this.generateId(),
        requestId: request.id,
        agentType: this.config.type,
        status: 'complete',
        data: result,
        suggestions,
        confidence: this.calculateConfidence(result),
        timestamp: Date.now(),
      };

      // Emit response
      this.bus.emit('agent:response', response, {
        source: this.config.type,
      });

      this.status = 'idle';
    } catch (error) {
      this.status = 'error';

      console.error(`[${this.config.type}] Error:`, error);

      this.bus.emit('agent:error', {
        agentType: this.config.type,
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId: request.id,
      });

      this.status = 'idle';
    }
  }

  /**
   * Calculate confidence score - can be overridden
   */
  protected calculateConfidence(data: any): number {
    if (!data) return 0;
    if (Array.isArray(data)) {
      return data.length > 0 ? 0.8 : 0.2;
    }
    return 0.7;
  }

  /**
   * Generate unique ID
   */
  protected generateId(): string {
    return `${this.config.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get agent status
   */
  getStatus(): AgentStatus {
    return this.status;
  }

  /**
   * Get agent config
   */
  getConfig(): AgentConfig {
    return this.config;
  }

  /**
   * Check if agent is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Enable/disable agent
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }
}

export default BaseAgent;