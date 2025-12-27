/**
 * AGENT SELECTOR
 * 
 * Quick selector for different AI agents
 */

import { useAIV2 } from '../../context/AIV2Context';
import { Search, Calendar, Zap } from 'lucide-react';

export function AgentSelector() {
  const { state, dispatch } = useAIV2();
  const { currentAgent } = state;
  
  const agents = [
    {
      id: 'discovery' as const,
      name: 'Discovery',
      icon: Search,
      description: 'Find restaurants & activities',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'planning' as const,
      name: 'Planning',
      icon: Calendar,
      description: 'Plan your days',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'optimization' as const,
      name: 'Optimization',
      icon: Zap,
      description: 'Optimize itinerary',
      color: 'from-orange-500 to-red-500',
    },
  ];
  
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {agents.map((agent) => {
        const Icon = agent.icon;
        const isActive = currentAgent === agent.id;
        
        return (
          <button
            key={agent.id}
            onClick={() => dispatch({ type: 'SET_AGENT', payload: agent.id })}
            className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              isActive
                ? 'bg-neutral-900 text-white shadow-lg'
                : 'bg-neutral-100 hover:bg-neutral-200'
            }`}
          >
            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${agent.color} flex items-center justify-center`}>
              <Icon className="w-3 h-3 text-white" />
            </div>
            <div className="text-left">
              <div className="text-xs font-medium">{agent.name}</div>
              {isActive && (
                <div className="text-xs opacity-75">{agent.description}</div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
