/**
 * SUGGESTION CARD
 * 
 * AI suggestion with accept/reject actions
 */

import { AISuggestion, useAIV2 } from '../../context/AIV2Context';
import { useTripV2 } from '../../context/TripV2Context';
import { Check, X, TrendingUp } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';

interface SuggestionCardProps {
  suggestion: AISuggestion;
}

export function SuggestionCard({ suggestion }: SuggestionCardProps) {
  const { acceptSuggestion, rejectSuggestion, state: aiState } = useAIV2();
  const { addItineraryItem } = useTripV2();
  
  const handleAccept = () => {
    // Add to itinerary if it's an activity/restaurant
    if (suggestion.type === 'activity' || suggestion.type === 'restaurant') {
      const item = {
        id: `item-${Date.now()}`,
        type: suggestion.type,
        name: suggestion.title,
        description: suggestion.description,
        startTime: '09:00', // Default, user can edit
        duration: suggestion.data?.duration || 60,
        cost: suggestion.data?.cost || 0,
        currency: 'USD' as const,
        costType: 'per_person' as const,
        location: suggestion.data?.location ? {
          address: '',
          neighborhood: suggestion.data.location,
          coordinates: { lat: 0, lng: 0 },
        } : undefined,
        bookingStatus: 'none' as const,
        details: {
          aiSuggested: true,
          confidence: suggestion.confidence,
        },
        addedBy: 'ai' as const,
        createdAt: new Date().toISOString(),
      };
      
      // Add to current day from context
      const dayNumber = aiState.context.dayNumber || 1;
      addItineraryItem(dayNumber, item);
    }
    
    acceptSuggestion(suggestion.id);
  };
  
  const getTypeIcon = () => {
    switch (suggestion.type) {
      case 'restaurant':
        return '🍽️';
      case 'activity':
        return '🎯';
      case 'optimization':
        return '⚡';
      case 'plan':
        return '📅';
      default:
        return '✨';
    }
  };
  
  const getConfidenceColor = () => {
    if (suggestion.confidence >= 0.9) return 'text-green-600';
    if (suggestion.confidence >= 0.7) return 'text-blue-600';
    return 'text-yellow-600';
  };
  
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-3 hover:border-neutral-300 transition-colors">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="text-2xl">{getTypeIcon()}</div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-medium text-sm">{suggestion.title}</h4>
            <div className="flex items-center gap-1 flex-shrink-0">
              <TrendingUp className={`w-3 h-3 ${getConfidenceColor()}`} />
              <span className={`text-xs ${getConfidenceColor()}`}>
                {Math.round(suggestion.confidence * 100)}%
              </span>
            </div>
          </div>
          
          <p className="text-xs text-neutral-600 mb-2">
            {suggestion.description}
          </p>
          
          {/* Metadata */}
          {(suggestion.data?.cost || suggestion.data?.duration || suggestion.data?.location) && (
            <div className="flex flex-wrap gap-2 mb-2">
              {suggestion.data.cost && (
                <Badge variant="secondary" className="text-xs">
                  ${suggestion.data.cost}
                </Badge>
              )}
              {suggestion.data.duration && (
                <Badge variant="secondary" className="text-xs">
                  {Math.floor(suggestion.data.duration / 60)}h {suggestion.data.duration % 60}m
                </Badge>
              )}
              {suggestion.data.location && (
                <Badge variant="secondary" className="text-xs">
                  {suggestion.data.location}
                </Badge>
              )}
            </div>
          )}
          
          {/* Plan details */}
          {suggestion.type === 'plan' && suggestion.data?.activities && (
            <div className="mb-2 p-2 bg-neutral-50 rounded text-xs space-y-1">
              {suggestion.data.activities.slice(0, 3).map((activity: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-neutral-500">{activity.time}</span>
                  <span>{activity.name}</span>
                </div>
              ))}
              {suggestion.data.activities.length > 3 && (
                <p className="text-neutral-500">+{suggestion.data.activities.length - 3} more</p>
              )}
            </div>
          )}
          
          {/* Optimization details */}
          {suggestion.type === 'optimization' && suggestion.data?.changes && (
            <div className="mb-2 p-2 bg-neutral-50 rounded text-xs space-y-1">
              {suggestion.data.changes.map((change: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>{change}</span>
                </div>
              ))}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleAccept}
              size="sm"
              className="flex-1 h-8 text-xs gap-1"
            >
              <Check className="w-3 h-3" />
              {suggestion.action?.label || 'Accept'}
            </Button>
            <Button
              onClick={() => rejectSuggestion(suggestion.id)}
              variant="outline"
              size="sm"
              className="h-8 text-xs"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
