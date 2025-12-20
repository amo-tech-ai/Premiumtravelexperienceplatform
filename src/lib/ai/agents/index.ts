/**
 * AI Agents Index
 * Central export for all AI agents
 */

export { BaseAgent } from './base-agent';
export { LocalScoutAgent, getLocalScout } from './local-scout';
export { DiningOrchestratorAgent, getDiningOrchestrator } from './dining-orchestrator';
export { ItineraryOptimizerAgent, getItineraryOptimizer } from './itinerary-optimizer';
export { BookingAssistantAgent, getBookingAssistant } from './booking-assistant';
export { EventCuratorAgent, getEventCurator } from './event-curator';
export { BudgetGuardianAgent, getBudgetGuardian } from './budget-guardian';

/**
 * Initialize all agents at once
 */
export function initializeAllAgents(): void {
  const { getLocalScout } = require('./local-scout');
  const { getDiningOrchestrator } = require('./dining-orchestrator');
  const { getItineraryOptimizer } = require('./itinerary-optimizer');
  const { getBookingAssistant } = require('./booking-assistant');
  const { getEventCurator } = require('./event-curator');
  const { getBudgetGuardian } = require('./budget-guardian');

  // Initialize all agents (creates singleton instances)
  getLocalScout();
  getDiningOrchestrator();
  getItineraryOptimizer();
  getBookingAssistant();
  getEventCurator();
  getBudgetGuardian();

  console.log('[AI] All 6 agents initialized and ready');
}

/**
 * Get agent status for debugging
 */
export function getAgentStatus(): Record<string, boolean> {
  try {
    const { getLocalScout } = require('./local-scout');
    const { getDiningOrchestrator } = require('./dining-orchestrator');
    const { getItineraryOptimizer } = require('./itinerary-optimizer');
    const { getBookingAssistant } = require('./booking-assistant');
    const { getEventCurator } = require('./event-curator');
    const { getBudgetGuardian } = require('./budget-guardian');

    return {
      local_scout: !!getLocalScout(),
      dining_orchestrator: !!getDiningOrchestrator(),
      itinerary_optimizer: !!getItineraryOptimizer(),
      booking_assistant: !!getBookingAssistant(),
      event_curator: !!getEventCurator(),
      budget_guardian: !!getBudgetGuardian(),
    };
  } catch (error) {
    console.error('[AI] Error checking agent status:', error);
    return {
      local_scout: false,
      dining_orchestrator: false,
      itinerary_optimizer: false,
      booking_assistant: false,
      event_curator: false,
      budget_guardian: false,
    };
  }
}
