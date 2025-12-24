import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  Navigation, 
  DollarSign, 
  Users,
  Sparkles,
  Calendar,
  ArrowRight,
  Check,
  Eye,
  Timer
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';
import { motion } from 'motion/react';

// Types
interface TripActivity {
  id: string;
  name: string;
  type: 'restaurant' | 'event' | 'travel' | 'flex';
  startTime: string;
  endTime: string;
  duration: string;
  location: string;
  distance?: string;
  cost?: string;
  notes?: string;
}

interface TripPlan {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  totalDuration: string;
  totalCost: string;
  pacing: 'relaxed' | 'moderate' | 'packed';
  activities: TripActivity[];
  highlights: string[];
  tradeoffs: string;
}

interface TripPlanCardProps {
  plan: TripPlan;
  isRecommended?: boolean;
  onPreview?: () => void;
  onApply?: () => void;
  isApplied?: boolean;
}

export function TripPlanCard({ 
  plan, 
  isRecommended = false,
  onPreview,
  onApply,
  isApplied = false
}: TripPlanCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPacingColor = (pacing: string) => {
    switch (pacing) {
      case 'relaxed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'moderate': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'packed': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'restaurant': return '🍴';
      case 'event': return '🎫';
      case 'travel': return '🚗';
      case 'flex': return '⏰';
      default: return '📍';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white rounded-xl border transition-all",
        isApplied 
          ? "border-emerald-500 ring-2 ring-emerald-100 bg-emerald-50/30"
          : "border-slate-200 hover:border-emerald-300",
        isRecommended && !isApplied && "ring-2 ring-purple-100 border-purple-300"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-slate-900">{plan.title}</h3>
              {isRecommended && !isApplied && (
                <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-[10px]">
                  <Sparkles className="w-2.5 h-2.5 mr-1" />
                  Recommended
                </Badge>
              )}
              {isApplied && (
                <Badge className="bg-emerald-600 text-white text-[10px]">
                  <Check className="w-2.5 h-2.5 mr-1" />
                  Active
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-600">{plan.subtitle}</p>
          </div>
          <Badge className={cn("text-xs", getPacingColor(plan.pacing))}>
            {plan.pacing.charAt(0).toUpperCase() + plan.pacing.slice(1)}
          </Badge>
        </div>

        {/* Meta Information */}
        <div className="flex items-center gap-3 text-xs text-slate-600 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {plan.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {plan.totalDuration}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            {plan.totalCost}
          </span>
        </div>

        {/* Highlights */}
        <div className="flex gap-1.5 flex-wrap">
          {plan.highlights.map((highlight, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
            >
              {highlight}
            </span>
          ))}
        </div>
      </div>

      {/* Timeline - Always visible but compact */}
      <div className="p-4">
        <div className="space-y-2">
          {plan.activities.slice(0, isExpanded ? undefined : 3).map((activity, idx) => (
            <div key={activity.id} className="flex gap-3">
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                {idx < plan.activities.length - 1 && (
                  <div className={cn(
                    "w-0.5 flex-1 my-1",
                    activity.type === 'travel' ? "border-l-2 border-dashed border-slate-300" : "bg-slate-200"
                  )}></div>
                )}
              </div>

              {/* Activity Details */}
              <div className="flex-1 pb-3">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1">
                    <p className={cn(
                      "text-sm",
                      activity.type === 'travel' ? "text-slate-500 italic" : "text-slate-900 font-medium"
                    )}>
                      {activity.name}
                    </p>
                    {activity.location && activity.type !== 'travel' && (
                      <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {activity.location}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 ml-2 flex-shrink-0">
                    {activity.startTime}
                  </div>
                </div>

                {/* Activity Meta */}
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    {activity.type === 'travel' ? (
                      <>
                        <Navigation className="w-3 h-3" />
                        {activity.distance}
                      </>
                    ) : (
                      <>
                        <Timer className="w-3 h-3" />
                        {activity.duration}
                      </>
                    )}
                  </span>
                  {activity.cost && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {activity.cost}
                    </span>
                  )}
                </div>

                {activity.notes && (
                  <p className="text-xs text-slate-600 mt-1 italic">{activity.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Show More/Less */}
        {plan.activities.length > 3 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium mt-2 flex items-center gap-1"
          >
            {isExpanded ? 'Show Less' : `Show ${plan.activities.length - 3} More Activities`}
            <ArrowRight className={cn(
              "w-3 h-3 transition-transform",
              isExpanded && "rotate-90"
            )} />
          </button>
        )}
      </div>

      {/* Tradeoffs */}
      {plan.tradeoffs && (
        <div className="px-4 pb-4">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div className="flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 leading-relaxed">{plan.tradeoffs}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-4 pt-0 flex gap-2">
        {onPreview && (
          <Button
            onClick={onPreview}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            Preview
          </Button>
        )}
        {onApply && !isApplied && (
          <Button
            onClick={onApply}
            size="sm"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Check className="w-3.5 h-3.5 mr-1.5" />
            Apply Plan
          </Button>
        )}
        {isApplied && (
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-emerald-300 text-emerald-700 bg-emerald-50"
            disabled
          >
            <Check className="w-3.5 h-3.5 mr-1.5" />
            Currently Active
          </Button>
        )}
      </div>
    </motion.div>
  );
}

// Compact Timeline Component (for preview mode)
export function CompactTimeline({ activities }: { activities: TripActivity[] }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {activities.map((activity, idx) => (
        <React.Fragment key={activity.id}>
          <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-full">
            <span className="text-xs">{activity.type === 'travel' ? '→' : activity.name}</span>
            <span className="text-[10px] text-slate-500">{activity.startTime}</span>
          </div>
          {idx < activities.length - 1 && activity.type !== 'travel' && (
            <ArrowRight className="w-3 h-3 text-slate-400" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
