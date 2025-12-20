import React, { useMemo, useState } from 'react';
import { Layout, Calendar, BookOpen, Image as ImageIcon, Key, ChevronLeft, ChevronRight, MapPin, Search, Plus, Globe, DollarSign, Zap, Sun, Cloud, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '../ui/utils';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useTripDetails } from './TripDetailsContext';
import { useTrip } from '../../context/TripContext';
import { useAI } from '../../context/AIContext';
import { useDrag } from 'react-dnd';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AIActionsPanel } from './AIActionsPanel';

type PanelType = 'itinerary' | 'bookings' | 'ideas' | 'media' | 'details' | 'calendar' | 'ai-actions' | null;

const NAV_ITEMS = [
  { id: 'ai-actions', label: 'AI Actions', icon: Zap, desc: 'Smart optimizations', badge: '✨' },
  { id: 'itinerary', label: 'Itinerary', icon: Layout, desc: 'Day-by-day plan', count: '3 Days' },
  { id: 'bookings', label: 'Bookings', icon: BookOpen, desc: 'Flights, stays, tickets', count: '2' },
  { id: 'ideas', label: 'Ideas', icon: Search, desc: 'Saved places & inspiration', count: '12' },
  { id: 'media', label: 'Media', icon: ImageIcon, desc: 'Photos & screenshots', count: '8' },
  { id: 'details', label: 'Key Details', icon: Key, desc: 'Preferences & logistics' },
  { id: 'calendar', label: 'Calendar', icon: Calendar, desc: 'Timeline view' },
];

const MOCK_BOOKINGS = [
  { id: '1', type: 'Flight', title: 'MIA → MDE', code: 'AA 1123', status: 'Confirmed', date: 'Jan 15' },
  { id: '2', type: 'Stay', title: 'Click Clack Hotel', code: 'RES-992', status: 'Booked', date: 'Jan 15-20' },
  { id: '3', type: 'Activity', title: 'Comuna 13 Tour', code: 'TICKET-88', status: 'Confirmed', date: 'Jan 16' },
];

const MOCK_MEDIA = [
  "https://images.unsplash.com/photo-1599582106603-946654a9388c?q=80&w=400",
  "https://images.unsplash.com/photo-1596395819057-d37e954c7d0d?q=80&w=400",
  "https://images.unsplash.com/photo-1583531352515-8884af319dc1?q=80&w=400",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=400",
  "https://images.unsplash.com/photo-1526634332515-d56d78772322?q=80&w=400",
  "https://images.unsplash.com/photo-1506543730435-e2c1d455b57d?q=80&w=400"
];

const MOCK_DETAILS = [
  { label: 'Visa', value: 'Not Required (90 days)', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Currency', value: 'COP (Colombian Peso)', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { label: 'Power', value: 'Type A / B (110V)', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
  { label: 'Weather', value: '24°C / 75°F (Spring)', icon: Sun, color: 'text-orange-500', bg: 'bg-orange-50' },
];

// Draggable Card Component
import { TripMap } from './TripMap';

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

interface TripSidebarProps {
   collapsed?: boolean;
   onToggle?: () => void;
}

export function TripSidebar({ collapsed = false, onToggle }: TripSidebarProps) {
  const { activePanel, setActivePanel, addItemToDay } = useTripDetails();
  const { events, stays, experiences, savedIds } = useTrip();
  const { savedItems } = useAI();

  // Dialog State
  const [isAddBookingOpen, setIsAddBookingOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({ title: '', code: '', type: 'Flight' });

  // Combine Real Data
  const ideaItems = useMemo(() => {
     // 1. Prioritize AI Saved Items (Global State from Discovery)
     if (savedItems && savedItems.length > 0) {
         return savedItems.map(item => ({
             id: item.id,
             title: item.title,
             image: item.image,
             category: item.type === 'property' ? 'Stays' : item.type === 'event' ? 'Events' : 'Attractions',
             type: item.type
         }));
     }

     // 2. Fallback to Local Trip Context Saved IDs (Legacy/Direct Saves)
     const allItems = [
         ...events.map(e => ({ ...e, category: 'Events' })),
         ...stays.map(s => ({ ...s, category: 'Stays' })),
         ...experiences.map(x => ({ ...x, category: 'Attractions' }))
     ];

     if (savedIds.length > 0) {
         const saved = allItems.filter(item => savedIds.includes(item.id));
         return saved.length > 0 ? saved : allItems.slice(0, 6);
     }
     
     // 3. Absolute Fallback
     return allItems.slice(0, 8); 
  }, [events, stays, experiences, savedIds, savedItems]);

  const handleAddIdea = (idea: any) => {
     addItemToDay(0, {
        title: idea.title,
        type: idea.category === 'Stays' ? 'stay' : idea.category === 'Food' ? 'food' : 'activity',
        time: 'TBD',
        duration: '1.5h',
        image: idea.image
     });
  };

  const handleAddBooking = () => {
      addItemToDay(0, {
          title: newBooking.title,
          type: 'logistics',
          time: 'TBD',
          notes: `Confirmation: ${newBooking.code} (${newBooking.type})`,
          status: 'confirmed'
      });
      setIsAddBookingOpen(false);
      setNewBooking({ title: '', code: '', type: 'Flight' });
  };

  const renderPanelContent = () => {
    switch (activePanel) {
      case 'ideas':
        return (
          <div className="space-y-4 p-4">
            <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saved Places</p>
                <Button variant="link" size="sm" className="h-auto p-0 text-emerald-600 text-xs">View All</Button>
            </div>
            {ideaItems.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                    {ideaItems.map(idea => (
                        <DraggableIdeaCard key={idea.id} idea={idea} onAdd={handleAddIdea} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                    No saved ideas yet. Ask the concierge to find some!
                </div>
            )}
            <Button variant="outline" className="w-full border-dashed text-slate-400 mt-2">
               + Find More Ideas
            </Button>
          </div>
        );
      case 'bookings':
        return (
           <div className="space-y-3 p-4">
              {MOCK_BOOKINGS.map(b => (
                 <div key={b.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group cursor-pointer hover:border-emerald-200 hover:shadow-md transition-all">
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
                       onClick={(e) => {
                           e.stopPropagation();
                           addItemToDay(0, { title: b.title, type: 'logistics', time: 'TBD', status: 'confirmed' });
                       }}
                    >
                       <Plus className="w-4 h-4" />
                    </Button>
                 </div>
              ))}
              
              <Dialog open={isAddBookingOpen} onOpenChange={setIsAddBookingOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-slate-900 text-white mt-4">
                        + Add Booking
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                      <DialogHeader>
                          <DialogTitle>Add Manual Booking</DialogTitle>
                          <DialogDescription>Enter the details of your booking to add it to your trip.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                          <div className="space-y-2">
                              <Label>Booking Title</Label>
                              <Input 
                                placeholder="e.g. Flight to Bogota" 
                                value={newBooking.title}
                                onChange={e => setNewBooking({...newBooking, title: e.target.value})}
                              />
                          </div>
                          <div className="space-y-2">
                              <Label>Confirmation Code</Label>
                              <Input 
                                placeholder="e.g. AA1234" 
                                value={newBooking.code}
                                onChange={e => setNewBooking({...newBooking, code: e.target.value})}
                              />
                          </div>
                      </div>
                      <DialogFooter>
                          <Button onClick={handleAddBooking}>Add Booking</Button>
                      </DialogFooter>
                  </DialogContent>
              </Dialog>
           </div>
        );
      case 'media':
          return (
            <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                    {MOCK_MEDIA.map((src, i) => (
                        <div key={i} className="aspect-square rounded-lg overflow-hidden relative group">
                            <ImageWithFallback src={src} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        </div>
                    ))}
                    <div className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-emerald-200 transition-colors cursor-pointer">
                        <Plus className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">Add Photo</span>
                    </div>
                </div>
            </div>
          );
      case 'details':
          return (
              <div className="p-4 space-y-4">
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4">
                      {MOCK_DETAILS.map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", item.bg, item.color)}>
                                  <item.icon className="w-4 h-4" />
                              </div>
                              <div>
                                  <p className="text-xs text-slate-500 font-medium">{item.label}</p>
                                  <p className="text-sm font-semibold text-slate-900">{item.value}</p>
                              </div>
                          </div>
                      ))}
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-start gap-3">
                          <Cloud className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                              <p className="text-sm font-bold text-blue-900">Pack for Rain</p>
                              <p className="text-xs text-blue-700 mt-1">Light showers expected in the afternoons. Bring a waterproof jacket.</p>
                          </div>
                      </div>
                  </div>

                   <Button variant="outline" className="w-full justify-start gap-2">
                      <FileText className="w-4 h-4" /> View Travel Docs
                   </Button>
              </div>
          );
      case 'calendar':
          return (
              <div className="p-4 space-y-4 h-full flex flex-col">
                  {/* Calendar Widget */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
                      <h4 className="font-bold text-slate-900 mb-4">January 2025</h4>
                      <div className="grid grid-cols-7 gap-1 text-xs mb-2 text-slate-400">
                          <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-sm">
                          {Array.from({ length: 31 }).map((_, i) => {
                              const day = i + 1;
                              const isTrip = day >= 15 && day <= 20;
                              const isStart = day === 15;
                              const isEnd = day === 20;
                              return (
                                  <div key={i} className={cn(
                                      "aspect-square flex items-center justify-center rounded-full relative z-10",
                                      isTrip ? "bg-emerald-100 text-emerald-900 font-bold rounded-none" : "hover:bg-slate-50",
                                      isStart ? "rounded-l-full bg-emerald-500 text-white" : "",
                                      isEnd ? "rounded-r-full bg-emerald-500 text-white" : ""
                                  )}>
                                      {day}
                                  </div>
                              )
                          })}
                      </div>
                  </div>

                  {/* Integrated Map View for Context */}
                  <div className="flex-1 min-h-[200px] rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                      <TripMap />
                  </div>
              </div>
          );
      case 'ai-actions':
          return (
              <div className="p-4 space-y-4">
                  <AIActionsPanel />
              </div>
          );
      default:
        return <div className="p-8 text-center text-slate-400 text-sm">Select a tool to view details.</div>;
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-slate-50", !collapsed && "border-l border-slate-200")}>
      
      {/* Header (Dynamic) */}
      <div className={cn("p-4 border-b border-slate-200 bg-white/50 backdrop-blur sticky top-0 z-10 flex items-center", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && (
           activePanel ? (
              <div className="flex items-center gap-2">
                 <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full" onClick={() => setActivePanel(null)}>
                    <ChevronLeft className="w-4 h-4" />
                 </Button>
                 <h3 className="font-serif font-bold text-slate-900 capitalize">{NAV_ITEMS.find(n => n.id === activePanel)?.label}</h3>
              </div>
           ) : (
              <h3 className="font-serif font-bold text-slate-900">Trip Tools</h3>
           )
        )}
        
        {/* Toggle Button */}
        {onToggle && (
           <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8 text-slate-500 hover:text-slate-900">
               {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
           </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
         {collapsed ? (
            // Collapsed Icon Mode
            <div className="flex flex-col gap-2 p-2 items-center">
               {NAV_ITEMS.map(item => (
                  <Tooltip key={item.id}>
                     <TooltipTrigger asChild>
                        <Button 
                           variant="ghost" 
                           size="icon"
                           onClick={() => {
                              onToggle?.(); 
                              setActivePanel(item.id as any);
                           }}
                           className={cn(
                              "h-10 w-10 rounded-xl transition-all",
                              activePanel === item.id ? "bg-emerald-100 text-emerald-700" : "text-slate-500 hover:bg-slate-100"
                           )}
                        >
                           <item.icon className="w-5 h-5" />
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent side="left">
                        <p>{item.label}</p>
                     </TooltipContent>
                  </Tooltip>
               ))}
            </div>
         ) : (
            // Expanded Mode
            activePanel ? (
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
            )
         )}
      </ScrollArea>
    </div>
  );
}