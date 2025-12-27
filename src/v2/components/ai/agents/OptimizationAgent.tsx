/**
 * OPTIMIZATION AGENT
 * 
 * Quick actions for optimizing itinerary
 */

import { useAIV2 } from '../../../context/AIV2Context';
import { Zap, Clock, DollarSign, MapPin, TrendingUp } from 'lucide-react';
import { Button } from '../../../../components/ui/button';

interface OptimizationAgentProps {
  dayNumber?: number;
}

export function OptimizationAgent({ dayNumber = 1 }: OptimizationAgentProps) {
  const { askOptimization } = useAIV2();
  
  const optimizations = [
    {
      label: 'Save Time',
      description: 'Minimize travel time',
      icon: Clock,
    },
    {
      label: 'Save Money',
      description: 'Reduce overall cost',
      icon: DollarSign,
    },
    {
      label: 'Best Route',
      description: 'Optimize location order',
      icon: MapPin,
    },
    {
      label: 'Balance Day',
      description: 'Distribute activities evenly',
      icon: TrendingUp,
    },
  ];
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-medium text-sm">Optimization Agent</h3>
          <p className="text-xs text-neutral-600">Improve your itinerary</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {optimizations.map((opt) => {
          const Icon = opt.icon;
          return (
            <Button
              key={opt.label}
              variant="outline"
              size="sm"
              onClick={() => askOptimization(dayNumber)}
              className="h-auto flex-col items-start p-3 text-left"
            >
              <Icon className="w-4 h-4 mb-1 text-orange-600" />
              <span className="text-xs font-medium">{opt.label}</span>
              <span className="text-xs text-neutral-500">{opt.description}</span>
            </Button>
          );
        })}
      </div>
      
      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
        <div className="flex items-start gap-2">
          <Zap className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-orange-900">
            I analyze your itinerary and suggest improvements to save time, money, and effort.
          </p>
        </div>
      </div>
    </div>
  );
}
