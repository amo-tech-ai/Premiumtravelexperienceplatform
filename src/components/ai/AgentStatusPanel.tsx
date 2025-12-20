import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  Utensils, 
  Map, 
  Plane, 
  Calendar, 
  DollarSign,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';

interface Agent {
  id: string;
  name: string;
  type: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  description: string;
  capabilities: string[];
  status: 'active' | 'inactive';
  demoQuery: string;
}

const agents: Agent[] = [
  {
    id: 'local_scout',
    name: 'Local Scout',
    type: 'local_scout',
    icon: Compass,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Discovers local events, activities, and attractions',
    capabilities: [
      'Event discovery',
      'Activity recommendations',
      'Local insights',
      'Trending spots'
    ],
    status: 'active',
    demoQuery: 'What should I do in Medellín this weekend?'
  },
  {
    id: 'dining_orchestrator',
    name: 'Dining Orchestrator',
    type: 'dining_orchestrator',
    icon: Utensils,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    description: 'Finds restaurants and suggests dining experiences',
    capabilities: [
      'Restaurant search',
      'Cuisine matching',
      'Reservation help',
      'Price filtering'
    ],
    status: 'active',
    demoQuery: 'Best Italian restaurants in El Poblado'
  },
  {
    id: 'itinerary_optimizer',
    name: 'Itinerary Optimizer',
    type: 'itinerary_optimizer',
    icon: Map,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    description: 'Optimizes routes and resolves schedule conflicts',
    capabilities: [
      'Route optimization',
      'Conflict detection',
      'Smart scheduling',
      'Distance calculation'
    ],
    status: 'active',
    demoQuery: 'Optimize my itinerary for tomorrow'
  },
  {
    id: 'booking_assistant',
    name: 'Booking Assistant',
    type: 'booking_assistant',
    icon: Plane,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'Helps find and book flights, hotels, and activities',
    capabilities: [
      'Flight search',
      'Hotel search',
      'Activity booking',
      'Price comparison'
    ],
    status: 'active',
    demoQuery: 'Find hotels in El Poblado under $150/night'
  },
  {
    id: 'event_curator',
    name: 'Event Curator',
    type: 'event_curator',
    icon: Calendar,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    description: 'Discovers events and checks ticket availability',
    capabilities: [
      'Event discovery',
      'Ticket availability',
      'Personalized picks',
      'Category filtering'
    ],
    status: 'active',
    demoQuery: 'What concerts are happening this week?'
  },
  {
    id: 'budget_guardian',
    name: 'Budget Guardian',
    type: 'budget_guardian',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    description: 'Monitors budget and suggests cost savings',
    capabilities: [
      'Budget tracking',
      'Cost analysis',
      'Savings suggestions',
      'Expense alerts'
    ],
    status: 'active',
    demoQuery: 'How can I save money on this trip?'
  }
];

interface AgentStatusPanelProps {
  onTestAgent?: (agentId: string, query: string) => void;
}

export function AgentStatusPanel({ onTestAgent }: AgentStatusPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const activeAgents = agents.filter(a => a.status === 'active');

  const handleTestAgent = (agent: Agent) => {
    setSelectedAgent(agent.id);
    if (onTestAgent) {
      onTestAgent(agent.id, agent.demoQuery);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-slate-900">AI Agents</h3>
            <p className="text-sm text-slate-500">
              {activeAgents.length} agents active
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {/* Agent List */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-slate-200"
        >
          <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
            {agents.map((agent) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all cursor-pointer",
                  selectedAgent === agent.id
                    ? "border-purple-300 bg-purple-50"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                )}
                onClick={() => setSelectedAgent(agent.id)}
              >
                {/* Agent Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", agent.bgColor)}>
                    <agent.icon className={cn("w-5 h-5", agent.color)} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900">{agent.name}</h4>
                      {agent.status === 'active' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300" />
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{agent.description}</p>
                  </div>
                </div>

                {/* Capabilities */}
                {selectedAgent === agent.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase mb-2">
                        Capabilities
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {agent.capabilities.map((cap, idx) => (
                          <div
                            key={idx}
                            className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-700"
                          >
                            • {cap}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Demo Query */}
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase mb-2">
                        Try asking
                      </p>
                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                        <p className="text-sm text-slate-700 italic mb-2">
                          "{agent.demoQuery}"
                        </p>
                        <Button
                          size="sm"
                          onClick={() => handleTestAgent(agent)}
                          className="w-full"
                        >
                          Test Agent
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Footer Info */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-3 h-3 text-blue-600" />
              </div>
              <div className="text-xs text-slate-600">
                <p className="font-medium mb-1">All agents ready!</p>
                <p>
                  Currently using mock data. Connect Gemini API for AI-powered responses.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
