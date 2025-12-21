/**
 * Collaboration Engine
 * Coordinates multiple AI agents to work together on complex queries
 * 
 * Features:
 * - Multi-agent task decomposition
 * - Parallel agent execution
 * - Result aggregation and synthesis
 * - Inter-agent communication
 * - Dependency management
 */

import { getEventBus, type EventBus } from './event-bus';
import { getGeminiClient, type GeminiClient } from './gemini-client';
import { getContextManager } from './context-manager';
import type { AgentType } from './types';

// Import agents
import { LocalScoutAgent } from './agents/local-scout';
import { DiningOrchestratorAgent } from './agents/dining-orchestrator';
import { ItineraryOptimizerAgent } from './agents/itinerary-optimizer';
// Note: These agents don't exist yet, commenting out
// import { getBookingAssistant } from './agents/booking-assistant';
// import { getEventCurator } from './agents/event-curator';
// import { getBudgetGuardian } from './agents/budget-guardian';

// --- TYPES ---

export interface CollaborationTask {
  id: string;
  description: string;
  intent: string;
  requiredAgents: AgentType[];
  priority: number;
  dependencies?: string[]; // IDs of tasks that must complete first
  context: any;
}

export interface ExecutionPlan {
  id: string;
  tasks: CollaborationTask[];
  executionOrder: string[][]; // Array of parallel task batches
  estimatedDuration: number;
  metadata: Record<string, any>;
}

export interface AgentResult {
  agentType: AgentType;
  taskId: string;
  success: boolean;
  data?: any;
  error?: string;
  duration: number;
  metadata?: Record<string, any>;
}

export interface CollaborationResult {
  planId: string;
  success: boolean;
  results: AgentResult[];
  synthesizedResponse: string;
  suggestions: any[];
  metadata: {
    totalDuration: number;
    agentsUsed: number;
    tasksCompleted: number;
    errors: number;
  };
}

// --- COLLABORATION ENGINE CLASS ---

export class CollaborationEngine {
  private bus: EventBus;
  private gemini: GeminiClient;
  private activePlans: Map<string, ExecutionPlan>;
  private agentRegistry: Map<AgentType, any>;

  constructor() {
    this.bus = getEventBus();
    this.gemini = getGeminiClient();
    this.activePlans = new Map();
    this.agentRegistry = new Map();

    this.initializeAgents();
  }

  /**
   * Initialize and register all agents
   */
  private initializeAgents() {
    this.agentRegistry.set('local_scout', new LocalScoutAgent());
    this.agentRegistry.set('dining_orchestrator', new DiningOrchestratorAgent());
    this.agentRegistry.set('itinerary_optimizer', new ItineraryOptimizerAgent());
    // Note: These agents don't exist yet, commenting out
    // this.agentRegistry.set('booking_assistant', getBookingAssistant());
    // this.agentRegistry.set('event_curator', getEventCurator());
    // this.agentRegistry.set('budget_guardian', getBudgetGuardian());

    console.log(`[CollaborationEngine] Initialized ${this.agentRegistry.size} agents`);
  }

  /**
   * Process a complex query requiring multiple agents
   */
  async processComplexQuery(
    query: string,
    context?: any
  ): Promise<CollaborationResult> {
    const startTime = Date.now();

    // 1. Analyze query and create execution plan
    const plan = await this.createExecutionPlan(query, context);
    this.activePlans.set(plan.id, plan);

    console.log(`[CollaborationEngine] Created plan with ${plan.tasks.length} tasks`);

    // 2. Execute plan
    const results = await this.executePlan(plan);

    // 3. Synthesize results
    const synthesizedResponse = await this.synthesizeResults(query, results);

    // 4. Extract suggestions
    const suggestions = this.extractSuggestions(results);

    const totalDuration = Date.now() - startTime;

    return {
      planId: plan.id,
      success: results.every((r) => r.success),
      results,
      synthesizedResponse,
      suggestions,
      metadata: {
        totalDuration,
        agentsUsed: new Set(results.map((r) => r.agentType)).size,
        tasksCompleted: results.filter((r) => r.success).length,
        errors: results.filter((r) => !r.success).length,
      },
    };
  }

  /**
   * Create execution plan from query
   */
  private async createExecutionPlan(
    query: string,
    context: any
  ): Promise<ExecutionPlan> {
    const planId = `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Use AI to decompose query into tasks
    const tasks = this.gemini.isReady()
      ? await this.decomposeQueryWithAI(query, context)
      : this.decomposeQueryHeuristic(query, context);

    // Determine execution order based on dependencies
    const executionOrder = this.calculateExecutionOrder(tasks);

    // Estimate duration
    const estimatedDuration = this.estimateDuration(tasks, executionOrder);

    return {
      id: planId,
      tasks,
      executionOrder,
      estimatedDuration,
      metadata: {
        query,
        context,
        createdAt: Date.now(),
      },
    };
  }

  /**
   * Decompose query using AI
   */
  private async decomposeQueryWithAI(
    query: string,
    context: any
  ): Promise<CollaborationTask[]> {
    const prompt = `Break down this user request into specific tasks for different AI agents:

Query: "${query}"

Available agents:
- local_scout: General location recommendations and insights
- dining_orchestrator: Restaurant and food recommendations
- event_curator: Events, activities, things to do
- itinerary_optimizer: Route optimization, scheduling
- booking_assistant: Reservations and bookings
- budget_guardian: Budget tracking and cost optimization

Return JSON array of tasks:
[
  {
    "description": "Task description",
    "requiredAgents": ["agent_type"],
    "priority": 1-5,
    "dependencies": [] // task indices that must complete first
  }
]`;

    try {
      const response = await this.gemini.generate(prompt, { temperature: 0.3 });
      
      // Parse JSON from response
      const jsonMatch = response.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const taskDefinitions = JSON.parse(jsonMatch[0]);
        
        // Convert to CollaborationTask
        return taskDefinitions.map((def: any, index: number) => ({
          id: `task_${index}`,
          description: def.description,
          intent: this.inferIntent(def.description),
          requiredAgents: def.requiredAgents,
          priority: def.priority || 3,
          dependencies: def.dependencies?.map((i: number) => `task_${i}`),
          context,
        }));
      }
    } catch (error) {
      console.error('[CollaborationEngine] AI decomposition failed:', error);
    }

    // Fallback to heuristic
    return this.decomposeQueryHeuristic(query, context);
  }

  /**
   * Decompose query using heuristics
   */
  private decomposeQueryHeuristic(
    query: string,
    context: any
  ): CollaborationTask[] {
    const tasks: CollaborationTask[] = [];
    const lower = query.toLowerCase();

    // Check for budget mentions
    if (/(budget|cost|price|cheap|expensive|affordable)/i.test(lower)) {
      tasks.push({
        id: `task_${tasks.length}`,
        description: 'Check budget constraints',
        intent: 'check_budget',
        requiredAgents: ['budget_guardian'],
        priority: 5,
        context,
      });
    }

    // Check for dining
    if (/(restaurant|food|eat|dining|lunch|dinner|breakfast|brunch)/i.test(lower)) {
      tasks.push({
        id: `task_${tasks.length}`,
        description: 'Find restaurant recommendations',
        intent: 'find_restaurants',
        requiredAgents: ['dining_orchestrator'],
        priority: 4,
        dependencies: tasks.length > 0 ? [tasks[0].id] : undefined,
        context,
      });
    }

    // Check for events/activities
    if (/(event|activity|things to do|festival|concert|show)/i.test(lower)) {
      tasks.push({
        id: `task_${tasks.length}`,
        description: 'Find events and activities',
        intent: 'discover_events',
        requiredAgents: ['event_curator'],
        priority: 4,
        dependencies: tasks.length > 0 ? [tasks[0].id] : undefined,
        context,
      });
    }

    // Check for optimization
    if (/(optimize|route|schedule|plan)/i.test(lower)) {
      tasks.push({
        id: `task_${tasks.length}`,
        description: 'Optimize itinerary',
        intent: 'optimize_route',
        requiredAgents: ['itinerary_optimizer'],
        priority: 3,
        dependencies: tasks.slice(0, -1).map((t) => t.id),
        context,
      });
    }

    // Check for booking
    if (/(book|reserve|reservation)/i.test(lower)) {
      tasks.push({
        id: `task_${tasks.length}`,
        description: 'Handle booking request',
        intent: 'make_booking',
        requiredAgents: ['booking_assistant'],
        priority: 2,
        dependencies: tasks.slice(0, -1).map((t) => t.id),
        context,
      });
    }

    // Default: use local scout for general queries
    if (tasks.length === 0) {
      tasks.push({
        id: `task_0`,
        description: 'Provide general recommendations',
        intent: 'get_recommendations',
        requiredAgents: ['local_scout'],
        priority: 3,
        context,
      });
    }

    return tasks;
  }

  /**
   * Calculate execution order based on dependencies
   */
  private calculateExecutionOrder(tasks: CollaborationTask[]): string[][] {
    const order: string[][] = [];
    const completed = new Set<string>();
    const remaining = new Map(tasks.map((t) => [t.id, t]));

    while (remaining.size > 0) {
      const batch: string[] = [];

      // Find tasks with no incomplete dependencies
      for (const [id, task] of remaining) {
        const deps = task.dependencies || [];
        const canExecute = deps.every((depId) => completed.has(depId));

        if (canExecute) {
          batch.push(id);
        }
      }

      if (batch.length === 0) {
        // Circular dependency or error - add remaining tasks
        batch.push(...remaining.keys());
        console.warn('[CollaborationEngine] Circular dependency detected');
      }

      // Add batch to order and mark as completed
      order.push(batch);
      batch.forEach((id) => {
        completed.add(id);
        remaining.delete(id);
      });
    }

    return order;
  }

  /**
   * Execute the plan
   */
  private async executePlan(plan: ExecutionPlan): Promise<AgentResult[]> {
    const results: AgentResult[] = [];
    const taskMap = new Map(plan.tasks.map((t) => [t.id, t]));

    // Execute in batches (parallel within batch, sequential across batches)
    for (const batch of plan.executionOrder) {
      const batchResults = await Promise.all(
        batch.map((taskId) => {
          const task = taskMap.get(taskId);
          return task ? this.executeTask(task) : Promise.resolve(null);
        })
      );

      results.push(...batchResults.filter((r) => r !== null) as AgentResult[]);
    }

    return results;
  }

  /**
   * Execute a single task
   */
  private async executeTask(task: CollaborationTask): Promise<AgentResult> {
    const startTime = Date.now();

    try {
      // Get the required agents
      const agents = task.requiredAgents.map((type) => this.agentRegistry.get(type));

      if (agents.some((a) => !a)) {
        throw new Error(`Agent not found for task: ${task.id}`);
      }

      // For now, use the first agent (in production, coordinate multiple)
      const agent = agents[0];
      
      // Execute through event bus
      await this.bus.emit('agent:request', {
        agentType: task.requiredAgents[0],
        query: task.description,
        context: task.context,
      });

      // Wait for response (simplified - in production use proper response handling)
      // For demo, return mock success
      const duration = Date.now() - startTime;

      return {
        agentType: task.requiredAgents[0],
        taskId: task.id,
        success: true,
        data: { message: `Completed: ${task.description}` },
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      return {
        agentType: task.requiredAgents[0],
        taskId: task.id,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      };
    }
  }

  /**
   * Synthesize results from multiple agents
   */
  private async synthesizeResults(
    originalQuery: string,
    results: AgentResult[]
  ): Promise<string> {
    if (!this.gemini.isReady()) {
      // Fallback synthesis
      return this.synthesizeResultsFallback(results);
    }

    // Use AI to synthesize
    const prompt = `Synthesize these agent results into a coherent response:

Original Query: "${originalQuery}"

Agent Results:
${results.map((r, i) => `${i + 1}. ${r.agentType}: ${r.success ? 'Success' : 'Failed'} - ${JSON.stringify(r.data)}`).join('\n')}

Provide a natural, helpful response that combines all the information.`;

    try {
      const response = await this.gemini.generate(prompt, { temperature: 0.7 });
      return response.text;
    } catch (error) {
      console.error('[CollaborationEngine] Synthesis failed:', error);
      return this.synthesizeResultsFallback(results);
    }
  }

  /**
   * Fallback synthesis without AI
   */
  private synthesizeResultsFallback(results: AgentResult[]): string {
    const successful = results.filter((r) => r.success);
    
    if (successful.length === 0) {
      return "I encountered some issues processing your request. Please try again or rephrase your query.";
    }

    const parts: string[] = [];
    
    successful.forEach((result) => {
      if (result.data?.message) {
        parts.push(result.data.message);
      }
    });

    return parts.join(' ') || "I've processed your request successfully!";
  }

  /**
   * Extract actionable suggestions from results
   */
  private extractSuggestions(results: AgentResult[]): any[] {
    const suggestions: any[] = [];

    results.forEach((result) => {
      if (result.success && result.data?.suggestions) {
        suggestions.push(...result.data.suggestions);
      }
    });

    return suggestions;
  }

  /**
   * Estimate execution duration
   */
  private estimateDuration(
    tasks: CollaborationTask[],
    executionOrder: string[][]
  ): number {
    // Estimate based on number of sequential batches
    const batchCount = executionOrder.length;
    const avgBatchDuration = 2000; // 2 seconds per batch (estimate)
    
    return batchCount * avgBatchDuration;
  }

  /**
   * Infer intent from description
   */
  private inferIntent(description: string): string {
    const lower = description.toLowerCase();

    if (/restaurant|food|dining/.test(lower)) return 'find_restaurants';
    if (/event|activity/.test(lower)) return 'discover_events';
    if (/optimize|route/.test(lower)) return 'optimize_route';
    if (/budget|cost/.test(lower)) return 'check_budget';
    if (/book|reserve/.test(lower)) return 'make_booking';

    return 'general_question';
  }

  /**
   * Get active plans
   */
  getActivePlans(): ExecutionPlan[] {
    return Array.from(this.activePlans.values());
  }

  /**
   * Clear completed plans
   */
  clearCompletedPlans() {
    // In production, track plan status and clear old ones
    this.activePlans.clear();
  }
}

// --- SINGLETON INSTANCE ---

let collaborationEngineInstance: CollaborationEngine | null = null;

export function getCollaborationEngine(): CollaborationEngine {
  if (!collaborationEngineInstance) {
    collaborationEngineInstance = new CollaborationEngine();
  }
  return collaborationEngineInstance;
}

export function initializeCollaborationEngine(): CollaborationEngine {
  collaborationEngineInstance = new CollaborationEngine();
  return collaborationEngineInstance;
}

// --- EXPORTS ---

export default CollaborationEngine;