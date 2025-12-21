/**
 * AI Agents - Central Export
 */

export { BaseAgent } from './base-agent';
export { LocalScoutAgent } from './local-scout';
export { DiningOrchestratorAgent } from './dining-orchestrator';
export { ItineraryOptimizerAgent } from './itinerary-optimizer';

export type { AgentContext, AgentRequest, AgentResponse } from './base-agent';

// Agent factory
export function createAgent(type: 'local-scout' | 'dining' | 'itinerary') {
  switch (type) {
    case 'local-scout':
      return new LocalScoutAgent();
    case 'dining':
      return new DiningOrchestratorAgent();
    case 'itinerary':
      return new ItineraryOptimizerAgent();
    default:
      throw new Error(`Unknown agent type: ${type}`);
  }
}
