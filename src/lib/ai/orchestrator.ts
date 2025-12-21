/**
 * AI Agent Orchestrator - Coordinates Multiple Agents
 */

import { createAgent } from './agents';
import type { AgentContext, AgentResponse } from './agents/base-agent';

export type AgentType = 'local-scout' | 'dining' | 'itinerary' | 'general';

export interface OrchestratorRequest {
  query: string;
  context: AgentContext;
  agentType?: AgentType;
}

export interface OrchestratorResponse extends AgentResponse {
  agentUsed: AgentType;
}

/**
 * Determine which agent to use based on query
 */
function determineAgent(query: string): AgentType {
  const lowerQuery = query.toLowerCase();

  // Dining keywords
  if (
    lowerQuery.includes('restaurant') ||
    lowerQuery.includes('food') ||
    lowerQuery.includes('dining') ||
    lowerQuery.includes('eat') ||
    lowerQuery.includes('meal') ||
    lowerQuery.includes('breakfast') ||
    lowerQuery.includes('lunch') ||
    lowerQuery.includes('dinner')
  ) {
    return 'dining';
  }

  // Itinerary keywords
  if (
    lowerQuery.includes('itinerary') ||
    lowerQuery.includes('plan') ||
    lowerQuery.includes('schedule') ||
    lowerQuery.includes('day trip') ||
    lowerQuery.includes('organize') ||
    lowerQuery.match(/\d+\s*(day|days)/)
  ) {
    return 'itinerary';
  }

  // Local Scout keywords
  if (
    lowerQuery.includes('hidden') ||
    lowerQuery.includes('secret') ||
    lowerQuery.includes('local') ||
    lowerQuery.includes('authentic') ||
    lowerQuery.includes('off the beaten') ||
    lowerQuery.includes('gems')
  ) {
    return 'local-scout';
  }

  // Default to general (which uses base Gemini)
  return 'general';
}

/**
 * Orchestrate AI response using appropriate agent
 */
export async function orchestrateAI(
  request: OrchestratorRequest
): Promise<OrchestratorResponse> {
  // Determine agent
  const agentType = request.agentType || determineAgent(request.query);

  // For general queries, use base Gemini (no specialized agent)
  if (agentType === 'general') {
    const { generateGeminiResponse } = await import('./gemini');
    
    const response = await generateGeminiResponse({
      message: request.query,
    });

    return {
      content: response.content,
      suggestions: response.suggestions || [],
      reasoning: response.reasoning || '',
      confidence: 0.8,
      agentUsed: 'general',
    };
  }

  // Use specialized agent
  const agent = createAgent(agentType);

  const response = await agent.process({
    query: request.query,
    context: request.context,
  });

  return {
    ...response,
    agentUsed: agentType,
  };
}

/**
 * Get multiple agent responses (for comparison)
 */
export async function getMultiAgentResponses(
  request: OrchestratorRequest,
  agents: AgentType[]
): Promise<OrchestratorResponse[]> {
  const promises = agents.map((agentType) =>
    orchestrateAI({ ...request, agentType })
  );

  return Promise.all(promises);
}
