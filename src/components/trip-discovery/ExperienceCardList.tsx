import React from 'react';
import { Clock, Map, Check } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from '../ui/button';

export interface Experience {
  id: string;
  title: string;
  image: string;
  duration: string;
  fit?: string; // "Easy to fit", "Half day", etc.
}

interface ExperienceCardListProps {
  experiences: Experience[];
  onAdd: (exp: Experience) => void;
  onHover?: (id: string) => void;
  onLeave?: () => void;
}

export function ExperienceCardList({ experiences, onAdd, onHover, onLeave }: ExperienceCardListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xl font-serif font-semibold text-emerald-950 flex items-center gap-2">
          <Map className="w-5 h-5 text-emerald-700" />
          Top Things To Do
        </h3>
        <Button variant="link" className="text-emerald-700 h-auto p-0">See all</Button>
      </div>
      
      <div className="space-y-3">
        {experiences.map((exp) => (
          <div 
            key={exp.id}
            onMouseEnter={() => onHover && onHover(exp.id)}
            onMouseLeave={() => onLeave && onLeave()}
            className="group relative flex bg-white rounded-2xl border border-emerald-900/5 shadow-sm hover:shadow-luxury transition-all duration-300 overflow-hidden cursor-pointer p-2"
          >
            {/* Image */}
            <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden">
               <ImageWithFallback 
                 src={exp.image} 
                 alt={exp.title}
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
               />
            </div>

            {/* Content */}
            <div className="flex-1 px-3 py-1 flex flex-col justify-center">
               <h4 className="font-medium text-emerald-950 text-base leading-tight mb-2 group-hover:text-emerald-700 transition-colors">
                 {exp.title}
               </h4>
               
               <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                 <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
                    <Clock className="w-3 h-3" />
                    {exp.duration}
                 </span>
                 {exp.fit && (
                   <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md font-medium">
                      <Check className="w-3 h-3" />
                      {exp.fit}
                   </span>
                 )}
               </div>
            </div>

            {/* Action */}
            <div className="flex items-center pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                   onClick={() => onAdd(exp)}
                   size="sm" 
                   variant="outline" 
                   className="h-8 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900"
                >
                    Add
                </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
