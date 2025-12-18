import React, { useMemo } from 'react';
import { Layout, Calendar, BookOpen, Image as ImageIcon, Key, ChevronLeft, MapPin, Search, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '../ui/utils';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useTripDetails } from './TripDetailsContext';
import { useTrip } from '../../context/TripContext';
import { useDrag } from 'react-dnd';

type PanelType = 'itinerary' | 'bookings' | 'ideas' | 'media' | 'details' | 'calendar' | null;

const NAV_ITEMS = [
  { id: 'itinerary', label: 'Itinerary', icon: Layout, desc: 'Day-by-day plan', count: '3 Days' },
  { id: 'bookings', label: 'Bookings', icon: BookOpen, desc: 'Flights, stays, tickets', count: '2' },
  { id: 'ideas', label: 'Ideas', icon: Search, desc: 'Saved places & inspiration', count: '12' },
  { id: 'media', label: 'Media', icon: ImageIcon, desc: 'Photos & screenshots', count: '5' },
  { id: 'details', label: 'Key Details', icon: Key, desc: 'Preferences & logistics' },
  { id: 'calendar', label: 'Calendar', icon: Calendar, desc: 'Timeline view' },
];

const MOCK_BOOKINGS = [
  { id: '1', type: 'Flight', title: 'MIA → MDE', code: 'AA 1123', status: 'Confirmed', date: 'Jan 15' },
  { id: '2', type: 'Stay', title: 'Click Clack Hotel', code: 'RES-992', status: 'Booked', date: 'Jan 15-20' },
];

// Draggable Card Component
const DraggableIdeaCard = ({ idea, onAdd }: { idea: any, onAdd: (idea: any) => void }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'IDEA',
    item: { 
        title: idea.title, 
        type: idea.category === 'Stays' ? 'stay' : idea.category === 'Food' ? 'food' : 'activity',
        image: idea.image,
        duration: '1.5h'
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
     <div 
        ref={drag}
        className={cn(
            "relative aspect-square rounded-xl overflow-hidden group cursor-grab active:cursor-grabbing bg-slate-100 transition-all",
            isDragging ? "opacity-50 scale-95 ring-2 ring-emerald-500" : "opacity-100 hover:scale-[1.02]"
        )}
     >
        <ImageWithFallback src={idea.image} alt={idea.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
        <div className="absolute bottom-2 left-2 right-2 text-white">
           <p className="text-xs font-bold truncate">{idea.title}</p>
           <p className="text-[10px] opacity-80">{idea.category}</p>
        </div>
        {/* Add Button */}
        <button 
           onClick={(e) => { e.stopPropagation(); onAdd(idea); }}
           className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-500 hover:text-white shadow-sm"
           title="Add to Day 1"
        >
           <Plus className="w-3 h-3" />
        </button>
     </div>
  );
};

export function TripSidebar() {
  const { activePanel, setActivePanel, addItemToDay } = useTripDetails();
  const { events, stays, experiences, savedIds } = useTrip();

  // Combine Real Data
  const ideaItems = useMemo(() => {
     // Flatten all items
     const allItems = [
         ...events.map(e => ({ ...e, category: 'Events' })),
         ...stays.map(s => ({ ...s, category: 'Stays' })),
         ...experiences.map(x => ({ ...x, category: 'Attractions' }))
     ];

     // Filter by savedIds if any, else return a slice for suggestions
     if (savedIds.length > 0) {
         const saved = allItems.filter(item => savedIds.includes(item.id));
         // If saved is empty (maybe IDs don't match mock data versions), fallback
         return saved.length > 0 ? saved : allItems.slice(0, 6);
     }
     return allItems.slice(0, 8); // Default suggestions
  }, [events, stays, experiences, savedIds]);

  const handleAddIdea = (idea: any) => {
     addItemToDay(0, {
        title: idea.title,
        type: idea.category === 'Stays' ? 'stay' : idea.category === 'Food' ? 'food' : 'activity',
        time: 'TBD',
        duration: '1.5h',
        image: idea.image
     });
  };

  const renderPanelContent = () => {
    switch (activePanel) {
      case 'ideas':
        return (
          <div className="space-y-4 p-4">
            <div className="grid grid-cols-2 gap-3">
               {ideaItems.map(idea => (
                 <DraggableIdeaCard key={idea.id} idea={idea} onAdd={handleAddIdea} />
               ))}
            </div>
            <Button variant="outline" className="w-full border-dashed text-slate-400">
               + Add Idea
            </Button>
          </div>
        );
      case 'bookings':
        return (
           <div className="space-y-3 p-4">
              {MOCK_BOOKINGS.map(b => (
                 <div key={b.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group">
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", b.status === 'Confirmed' ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700")}>{b.type}</span>
                          <span className="text-xs text-slate-400">{b.date}</span>
                       </div>
                       <p className="font-semibold text-sm text-slate-800">{b.title}</p>
                       <p className="text-xs text-slate-500 font-mono mt-0.5">{b.code}</p>
                    </div>
                    {/* Quick Add Action */}
                    <Button 
                       variant="ghost" 
                       size="icon" 
                       className="opacity-0 group-hover:opacity-100 text-emerald-600 hover:bg-emerald-50"
                       onClick={() => addItemToDay(0, { title: b.title, type: 'logistics', time: 'TBD', status: 'confirmed' })}
                    >
                       <Plus className="w-4 h-4" />
                    </Button>
                 </div>
              ))}
           </div>
        );
      default:
        return <div className="p-8 text-center text-slate-400 text-sm">Panel content coming soon.</div>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 border-l border-slate-200">
      
      {/* Header (Dynamic) */}
      <div className="p-4 border-b border-slate-200 bg-white/50 backdrop-blur sticky top-0 z-10">
        {activePanel ? (
           <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full" onClick={() => setActivePanel(null)}>
                 <ChevronLeft className="w-4 h-4" />
              </Button>
              <h3 className="font-serif font-bold text-slate-900 capitalize">{NAV_ITEMS.find(n => n.id === activePanel)?.label}</h3>
           </div>
        ) : (
           <h3 className="font-serif font-bold text-slate-900">Trip Tools</h3>
        )}
      </div>

      <ScrollArea className="flex-1">
         {activePanel ? (
            // Detail View
            renderPanelContent()
         ) : (
            // Navigation List
            <div className="p-4 space-y-3">
               {NAV_ITEMS.map(item => (
                  <button 
                    key={item.id}
                    onClick={() => setActivePanel(item.id as any)}
                    className="w-full text-left bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group flex items-start gap-4"
                  >
                     <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                        item.id === 'itinerary' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600"
                     )}>
                        <item.icon className="w-5 h-5" />
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-center mb-0.5">
                           <span className="font-semibold text-slate-900">{item.label}</span>
                           {item.count && <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">{item.count}</span>}
                        </div>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                     </div>
                  </button>
               ))}
            </div>
         )}
      </ScrollArea>
    </div>
  );
}
