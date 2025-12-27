/**
 * PLANNING AGENT
 * 
 * Quick actions for planning days
 */

import { useAIV2 } from '../../../context/AIV2Context';
import { Calendar, Sun, Sunset, Moon, Coffee as CoffeeIcon } from 'lucide-react';
import { Button } from '../../../../components/ui/button';

export function PlanningAgent() {
  const { askPlanning } = useAIV2();
  
  const quickPlans = [
    {
      label: 'Full Day',
      request: 'Plan my entire day from morning to evening',
      icon: Sun,
    },
    {
      label: 'Morning',
      request: 'Plan my morning activities (9am-12pm)',
      icon: CoffeeIcon,
    },
    {
      label: 'Afternoon',
      request: 'Plan my afternoon activities (12pm-6pm)',
      icon: Sunset,
    },
    {
      label: 'Evening',
      request: 'Plan my evening activities (6pm-11pm)',
      icon: Moon,
    },
  ];
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Calendar className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-medium text-sm">Planning Agent</h3>
          <p className="text-xs text-neutral-600">Auto-plan your days</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {quickPlans.map((plan) => {
          const Icon = plan.icon;
          return (
            <Button
              key={plan.label}
              variant="outline"
              size="sm"
              onClick={() => askPlanning(plan.request)}
              className="h-auto flex-col items-start p-3 text-left"
            >
              <Icon className="w-4 h-4 mb-1 text-purple-600" />
              <span className="text-xs font-medium">{plan.label}</span>
            </Button>
          );
        })}
      </div>
      
      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
        <p className="text-xs text-purple-900">
          💡 <strong>Tip:</strong> Tell me your interests and I'll create a personalized itinerary
        </p>
      </div>
    </div>
  );
}
