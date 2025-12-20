/**
 * AI Orchestrator
 * Routes user intents to appropriate agents and coordinates responses
 */

import { getGeminiClient, GeminiClient } from './gemini-client';
import { getEventBus, EventBus } from './event-bus';
import { getLocalScout } from './agents/local-scout';
import { getDiningOrchestrator } from './agents/dining-orchestrator';
import { getItineraryOptimizer } from './agents/itinerary-optimizer';
import { getBookingAssistant } from './agents/booking-assistant';
import { getEventCurator } from './agents/event-curator';
import { getBudgetGuardian } from './agents/budget-guardian';
import type {
  UserIntent,
  IntentClassification,
  AgentRequest,
  AgentResponse,
  AgentType,
  OrchestrationPlan,
  AgentTask,
} from './types';

export class AIOrchestrator {
  private gemini: GeminiClient;
  private bus: EventBus;
  private activeTasks: Map<string, AgentTask>;

  constructor() {
    this.gemini = getGeminiClient();
    this.bus = getEventBus();
    this.activeTasks = new Map();

    // Initialize agents
    getLocalScout();
    getDiningOrchestrator();
    getItineraryOptimizer();
    getBookingAssistant();
    getEventCurator();
    getBudgetGuardian();

    // Subscribe to agent responses
    this.bus.on('agent:response', (payload) => {
      this.handleAgentResponse(payload.data);
    });
  }

  /**
   * Process user message and route to appropriate agents
   */
  async processUserMessage(
    message: string,
    context?: any
  ): Promise<{
    intent: UserIntent;
    responses: any[];
    suggestions: any[];
  }> {
    // 1. Classify intent
    const classification = await this.classifyIntent(message);

    // 2. Determine which agents to invoke
    const agents = this.selectAgents(classification);

    // 3. Create orchestration plan
    const plan = this.createOrchestrationPlan(message, agents, context);

    // 4. Execute plan
    const responses = await this.executePlan(plan);

    // 5. Aggregate suggestions
    const suggestions = this.aggregateSuggestions(responses);

    return {
      intent: classification.intent,
      responses,
      suggestions,
    };
  }

  /**
   * Classify user intent using Gemini or fallback
   */
  private async classifyIntent(message: string): Promise<IntentClassification> {
    if (this.gemini.isReady()) {
      try {
        const result = await this.gemini.classifyIntent(message);
        return {
          ...result,
          suggestedAgents: this.mapIntentToAgents(result.intent),
        };
      } catch (error) {
        console.error('[Orchestrator] Intent classification error:', error);
      }
    }

    // Fallback to keyword-based classification
    return this.classifyIntentFallback(message);
  }

  /**
   * Fallback intent classification
   */
  private classifyIntentFallback(message: string): IntentClassification {
    const lower = message.toLowerCase();

    let intent: UserIntent = 'general_question';
    const entities: Record<string, any> = {};

    if (/(event|activity|things to do|happening|festival|concert)/i.test(lower)) {
      intent = 'discover_events';
      entities.category = this.extractCategory(lower);
    } else if (/(restaurant|food|eat|dining|lunch|dinner)/i.test(lower)) {
      intent = 'find_restaurants';
      entities.cuisine = this.extractCuisine(lower);
    } else if (/(optimize|route|schedule)/i.test(lower)) {
      intent = 'optimize_route';
    } else if (/(budget|cost|price)/i.test(lower)) {
      intent = 'check_budget';
    } else if (/(book|reserve|reservation)/i.test(lower)) {
      intent = 'make_booking';
    }

    return {
      intent,
      confidence: 0.7,
      entities,
      suggestedAgents: this.mapIntentToAgents(intent),
    };
  }

  /**
   * Map intent to agent types
   */
  private mapIntentToAgents(intent: UserIntent): AgentType[] {
    const mapping: Record<UserIntent, AgentType[]> = {
      discover_events: ['local_scout', 'event_curator'],
      find_restaurants: ['dining_orchestrator'],
      optimize_route: ['itinerary_optimizer'],
      check_budget: ['budget_guardian'],
      make_booking: ['booking_assistant'],
      get_recommendations: ['local_scout', 'dining_orchestrator'],
      resolve_conflicts: ['itinerary_optimizer'],
      general_question: [],
    };

    return mapping[intent] || [];
  }

  /**
   * Select agents based on classification
   */
  private selectAgents(classification: IntentClassification): AgentType[] {
    // All 6 agents are now implemented and available
    return classification.suggestedAgents;
  }

  /**
   * Create orchestration plan
   */
  private createOrchestrationPlan(
    message: string,
    agents: AgentType[],
    context?: any
  ): OrchestrationPlan {
    const tasks: AgentTask[] = agents.map(agentType => ({
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      agentType,
      action: 'process',
      parameters: { message, context },
      status: 'pending',
    }));

    return {
      id: `plan_${Date.now()}`,
      userRequest: message,
      tasks,
      expectedDuration: tasks.length * 2000, // 2 seconds per task estimate
      status: 'planning',
    };
  }

  /**
   * Execute orchestration plan
   */
  private async executePlan(plan: OrchestrationPlan): Promise<AgentResponse[]> {
    plan.status = 'executing';

    const responses: AgentResponse[] = [];

    // Execute tasks in parallel
    const promises = plan.tasks.map(async (task) => {
      task.status = 'running';
      this.activeTasks.set(task.id, task);

      const request: AgentRequest = {
        id: task.id,
        agentType: task.agentType,
        intent: task.action,
        context: task.parameters.context || {},
        parameters: task.parameters,
        timestamp: Date.now(),
      };

      return new Promise<AgentResponse>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error(`Task ${task.id} timeout`));
        }, 10000); // 10 second timeout

        const subscriptionId = this.bus.on('agent:response', (payload) => {
          const response = payload.data as AgentResponse;
          if (response.requestId === task.id) {
            clearTimeout(timeout);
            this.bus.off(subscriptionId);
            task.status = 'completed';
            task.result = response;
            this.activeTasks.delete(task.id);
            resolve(response);
          }
        });

        // Emit the request
        this.bus.emit('agent:request', request);
      });
    });

    try {
      const results = await Promise.allSettled(promises);
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          responses.push(result.value);
        } else {
          console.error(`Task ${plan.tasks[index].id} failed:`, result.reason);
          plan.tasks[index].status = 'failed';
          plan.tasks[index].error = result.reason.message;
        }
      });

      plan.status = 'completed';
    } catch (error) {
      plan.status = 'failed';
      console.error('[Orchestrator] Plan execution error:', error);
    }

    return responses;
  }

  /**
   * Aggregate suggestions from multiple agents
   */
  private aggregateSuggestions(responses: AgentResponse[]): any[] {
    const allSuggestions: any[] = [];

    responses.forEach(response => {
      if (response.suggestions && response.suggestions.length > 0) {
        allSuggestions.push(...response.suggestions);
      }
    });

    // Sort by priority
    return allSuggestions.sort((a, b) => {
      const priorityOrder = { high: 3, normal: 2, low: 1 };
      return priorityOrder[b.priority || 'normal'] - priorityOrder[a.priority || 'normal'];
    });
  }

  /**
   * Extract category from message
   */
  private extractCategory(message: string): string[] {
    const categories: string[] = [];
    
    if (message.includes('music') || message.includes('concert')) categories.push('music');
    if (message.includes('art') || message.includes('gallery')) categories.push('art');
    if (message.includes('food') || message.includes('festival')) categories.push('food');
    if (message.includes('outdoor') || message.includes('nature')) categories.push('outdoor');
    if (message.includes('nightlife') || message.includes('party')) categories.push('nightlife');

    return categories;
  }

  /**
   * Extract cuisine from message
   */
  private extractCuisine(message: string): string[] {
    const cuisines: string[] = [];
    
    if (message.includes('italian')) cuisines.push('Italian');
    if (message.includes('japanese') || message.includes('sushi')) cuisines.push('Japanese');
    if (message.includes('colombian')) cuisines.push('Colombian');
    if (message.includes('asian')) cuisines.push('Asian');
    if (message.includes('mexican')) cuisines.push('Mexican');

    return cuisines;
  }

  /**
   * Handle agent response
   */
  private handleAgentResponse(response: AgentResponse): void {
    // Update task status
    const task = this.activeTasks.get(response.requestId);
    if (task) {
      task.status = response.status === 'complete' ? 'completed' : 'failed';
      task.result = response;
    }
  }

  /**
   * Get active tasks
   */
  getActiveTasks(): AgentTask[] {
    return Array.from(this.activeTasks.values());
  }

  /**
   * Cancel task
   */
  cancelTask(taskId: string): void {
    const task = this.activeTasks.get(taskId);
    if (task) {
      task.status = 'failed';
      task.error = 'Cancelled by user';
      this.activeTasks.delete(taskId);
    }
  }
}

// Singleton instance
let orchestratorInstance: AIOrchestrator | null = null;

export function getOrchestrator(): AIOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new AIOrchestrator();
  }
  return orchestratorInstance;
}

export function initializeOrchestrator(): AIOrchestrator {
  orchestratorInstance = new AIOrchestrator();
  return orchestratorInstance;
}

export default AIOrchestrator;