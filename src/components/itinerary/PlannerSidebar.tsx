import React from 'react';
import { Calendar as CalendarIcon, Users, Wallet } from 'lucide-react';
import { cn } from '../ui/utils';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface PlannerSidebarProps {
  preferences: string[];
  setPreferences: (prefs: string[]) => void;
  budget: number;
  setBudget: (budget: number) => void;
  savedItems: any[]; // Replace with proper type from context
}

export const PlannerSidebar: React.FC<PlannerSidebarProps> = ({
  preferences,
  setPreferences,
  budget,
  setBudget,
  savedItems = []
}) => {
  return (
    <div className="space-y-8">
      {/* Trip State */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-900 text-white flex items-center justify-center font-serif text-xl">
            M
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-slate-900">Medellín</h2>
            <p className="text-xs text-slate-500">Colombia • 5 Days</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm text-slate-600 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
            <CalendarIcon className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span>Jan 14 - Jan 19</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
            <Users className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span>2 Travelers</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
            <Wallet className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span>${budget} Budget</span>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Trip Pace</h3>
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
          {['Relaxed', 'Balanced', 'Packed'].map(p => (
            <button 
              key={p}
              className={cn(
                "flex-1 py-2 text-xs font-medium rounded-lg transition-all",
                p === 'Balanced' ? "bg-white text-emerald-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {p}
            </button>
          ))}
        </div>

        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mt-6">Interests</h3>
        <div className="flex flex-wrap gap-2">
          {['Foodie', 'Culture', 'Nature', 'Nightlife', 'Luxury', 'Local'].map(tag => (
            <button 
              key={tag}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs border transition-colors",
                preferences.includes(tag) 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                  : "bg-white border-slate-200 text-slate-600 hover:border-emerald-200"
              )}
              onClick={() => {
                if (preferences.includes(tag)) setPreferences(preferences.filter((t: string) => t !== tag));
                else setPreferences([...preferences, tag]);
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Saved Items Mini-view */}
      <div className="bg-emerald-900/5 rounded-2xl p-5 border border-emerald-900/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-emerald-900">Saved for Later</h3>
          <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{savedItems.length}</span>
        </div>
        <div className="space-y-3">
          {savedItems.slice(0, 3).map((item, i) => (
            <div key={item.id || i} className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-lg bg-white shrink-0 overflow-hidden">
                <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{item.title}</p>
                <p className="text-[10px] text-slate-500 capitalize">{item.type || 'Activity'}</p>
              </div>
            </div>
          ))}
          {savedItems.length === 0 && (
            <p className="text-xs text-slate-500 italic">No saved items yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
