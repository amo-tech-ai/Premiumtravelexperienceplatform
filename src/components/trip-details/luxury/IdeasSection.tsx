import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronRight, Plus, MapPin, Clock, DollarSign, Calendar, X, Sparkles } from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '../../ui/utils';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { useDrag } from 'react-dnd';

export interface IdeaItem {
  id: string;
  title: string;
  category: 'food' | 'activity' | 'stay' | 'event';
  image?: string;
  duration?: string;
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
  neighborhood?: string;
  rating?: number;
  notes?: string;
}

interface DraggableIdeaCardProps {
  idea: IdeaItem;
  onAddToDay: (ideaId: string) => void;
  onRemove: (ideaId: string) => void;
  onPinOnMap: (ideaId: string) => void;
}

const DraggableIdeaCard = ({ idea, onAddToDay, onRemove, onPinOnMap }: DraggableIdeaCardProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'IDEA',
    item: { id: idea.id, type: 'IDEA', idea },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const categoryConfig = {
    food: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'Dining' },
    activity: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Activity' },
    stay: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Stay' },
    event: { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', label: 'Event' }
  };

  const config = categoryConfig[idea.category];

  return (
    <motion.div
      ref={drag}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group relative bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all cursor-grab active:cursor-grabbing",
        config.border,
        isDragging ? "opacity-40 ring-2 ring-emerald-400" : ""
      )}
    >
      {/* Image */}
      {idea.image && (
        <div className="relative h-40 overflow-hidden bg-slate-100">
          <ImageWithFallback 
            src={idea.image} 
            alt={idea.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          {/* Category Badge */}
          <div className={cn(
            "absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm border",
            config.bg, config.color, config.border
          )}>
            {config.label}
          </div>
          {/* Remove Button */}
          <button
            onClick={() => onRemove(idea.id)}
            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-110"
          >
            <X className="w-3.5 h-3.5 text-slate-600" />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-slate-900 leading-snug">
          {idea.title}
        </h3>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          {idea.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{idea.duration}</span>
            </div>
          )}
          {idea.priceRange && (
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              <span>{idea.priceRange}</span>
            </div>
          )}
          {idea.neighborhood && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{idea.neighborhood}</span>
            </div>
          )}
          {idea.rating && (
            <div className="flex items-center gap-1">
              <span>⭐</span>
              <span>{idea.rating}</span>
            </div>
          )}
        </div>

        {/* Notes */}
        {idea.notes && (
          <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg">
            "{idea.notes}"
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <Button
            size="sm"
            onClick={() => onAddToDay(idea.id)}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            Add to Day
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPinOnMap(idea.id)}
            className="px-3 border-slate-200 hover:bg-slate-50"
          >
            <MapPin className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

interface IdeasSectionProps {
  ideas: IdeaItem[];
  onAddToDay: (ideaId: string) => void;
  onRemove: (ideaId: string) => void;
  onPinOnMap: (ideaId: string) => void;
  onAddNewIdea: () => void;
}

export const IdeasSection = ({ ideas, onAddToDay, onRemove, onPinOnMap, onAddNewIdea }: IdeasSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-gradient-to-br from-slate-50 to-white border-b border-slate-200 pb-8">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          )}
          <div className="text-left">
            <h2 className="text-lg font-semibold text-slate-900">Ideas</h2>
            <p className="text-sm text-slate-500">
              {ideas.length} {ideas.length === 1 ? 'place' : 'places'} saved for later
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onAddNewIdea();
          }}
          className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Idea
        </Button>
      </button>

      {/* Ideas Grid */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {ideas.length === 0 ? (
              /* Empty State */
              <div className="px-6 py-12">
                <div className="max-w-md mx-auto text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    No ideas yet
                  </h3>
                  <p className="text-sm text-slate-600 mb-6">
                    Save places you're interested in to your Ideas bucket. Drag them to days when you're ready to schedule.
                  </p>
                  <Button
                    onClick={onAddNewIdea}
                    className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Idea
                  </Button>
                </div>
              </div>
            ) : (
              /* Ideas Grid */
              <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {ideas.map((idea) => (
                    <DraggableIdeaCard
                      key={idea.id}
                      idea={idea}
                      onAddToDay={onAddToDay}
                      onRemove={onRemove}
                      onPinOnMap={onPinOnMap}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
