/**
 * DISCOVERY AGENT
 * 
 * Quick actions for discovering restaurants and activities
 */

import { useAIV2 } from '../../../context/AIV2Context';
import { Search, Coffee, Utensils, MapPin, Camera } from 'lucide-react';
import { Button } from '../../../../components/ui/button';

export function DiscoveryAgent() {
  const { askDiscovery } = useAIV2();
  
  const quickSearches = [
    {
      label: 'Best Restaurants',
      query: 'Find the best restaurants in the area',
      icon: Utensils,
    },
    {
      label: 'Coffee Shops',
      query: 'Find good coffee shops nearby',
      icon: Coffee,
    },
    {
      label: 'Top Attractions',
      query: 'What are the top attractions to visit?',
      icon: MapPin,
    },
    {
      label: 'Hidden Gems',
      query: 'Show me hidden gems and local favorites',
      icon: Camera,
    },
  ];
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <Search className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-medium text-sm">Discovery Agent</h3>
          <p className="text-xs text-neutral-600">Find restaurants & activities</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {quickSearches.map((search) => {
          const Icon = search.icon;
          return (
            <Button
              key={search.label}
              variant="outline"
              size="sm"
              onClick={() => askDiscovery(search.query)}
              className="h-auto flex-col items-start p-3 text-left"
            >
              <Icon className="w-4 h-4 mb-1 text-blue-600" />
              <span className="text-xs font-medium">{search.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
