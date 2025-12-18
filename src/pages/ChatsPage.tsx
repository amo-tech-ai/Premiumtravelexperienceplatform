import React from 'react';
import { MessageSquare, Search, Plus, MoreVertical } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ChatInterface } from '../components/ai/ChatInterface';
import { cn } from '../components/ui/utils';
import { useAI } from '../context/AIContext';

// Mock Chat History
const MOCK_CHATS = [
  { id: '1', title: 'Medellín Itinerary Planning', preview: 'I can help you with that...', time: '2m ago', active: true },
  { id: '2', title: 'Restaurant Recommendations', preview: 'El Cielo is a great choice.', time: '1d ago', active: false },
  { id: '3', title: 'Flight Options', preview: 'Here are the flights...', time: '3d ago', active: false },
];

export default function ChatsPage() {
  const { resetChat } = useAI();

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Left Sidebar: Chat History */}
      <div className="w-80 border-r border-slate-200 bg-white flex flex-col hidden md:flex">
         <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/50 backdrop-blur z-10">
            <h2 className="font-serif font-bold text-lg text-slate-900">Messages</h2>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500" onClick={resetChat}>
               <Plus className="w-5 h-5" />
            </Button>
         </div>

         <div className="p-2">
            <div className="relative mb-4 px-2">
               <Search className="absolute left-4 top-2.5 w-4 h-4 text-slate-400" />
               <input 
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" 
                  placeholder="Search chats..."
               />
            </div>
            
            <div className="space-y-1">
               {MOCK_CHATS.map(chat => (
                  <button 
                     key={chat.id}
                     className={cn(
                        "w-full text-left p-3 rounded-xl flex gap-3 transition-all",
                        chat.active ? "bg-emerald-50 border border-emerald-100" : "hover:bg-slate-50 border border-transparent"
                     )}
                  >
                     <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                        chat.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                     )}>
                        <MessageSquare className="w-5 h-5" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                           <span className={cn("font-medium text-sm truncate", chat.active ? "text-slate-900" : "text-slate-700")}>{chat.title}</span>
                           <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{chat.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">{chat.preview}</p>
                     </div>
                  </button>
               ))}
            </div>
         </div>
      </div>

      {/* Main Area: Active Chat */}
      <div className="flex-1 flex flex-col h-full bg-white relative">
         {/* Header */}
         <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white z-10">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <MessageSquare className="w-5 h-5" />
               </div>
               <div>
                  <h3 className="font-bold text-slate-900">Medellín Itinerary Planning</h3>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                     <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                     Online
                  </p>
               </div>
            </div>
            <Button variant="ghost" size="icon">
               <MoreVertical className="w-5 h-5 text-slate-400" />
            </Button>
         </div>

         {/* Chat Interface */}
         <div className="flex-1 overflow-hidden relative">
            <ChatInterface />
         </div>
      </div>
    </div>
  );
}
