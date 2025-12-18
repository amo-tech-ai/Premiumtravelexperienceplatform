import React, { useState, useEffect } from 'react';
import { Send, Mic, Plus, MessageSquare, History, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import { useTripDetails } from './TripDetailsContext';

// Placeholder Chat Data
const PAST_CHATS = [
  { id: '1', title: 'Dinner options in Poblado', date: 'Yesterday' },
  { id: '2', title: 'Flight search for 2', date: '2 days ago' },
];

export function TripChat() {
  const { addItemToDay } = useTripDetails();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add User Message
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
        setIsTyping(false);
        
        let aiContent = "I've noted that. Anything else for your itinerary?";
        let action = null;

        if (input.toLowerCase().includes('lunch') || input.toLowerCase().includes('food')) {
            aiContent = "I recommend 'El Cielo' for a unique sensory experience. Would you like to add it to your plan?";
            action = {
                label: 'Add El Cielo to Day 1',
                data: { title: 'Lunch at El Cielo', type: 'food', time: '1:00 PM', duration: '2h' }
            };
        } else if (input.toLowerCase().includes('coffee')) {
            aiContent = "Pergamino Café is a local favorite. I can add a coffee break to your morning.";
            action = {
                label: 'Add Coffee Break',
                data: { title: 'Pergamino Café', type: 'food', time: '10:00 AM', duration: '45m' }
            };
        } else if (input.toLowerCase().includes('tour') || input.toLowerCase().includes('activity')) {
             aiContent = "The Comuna 13 Graffiti Tour is a must-do. It takes about 3 hours.";
             action = {
                 label: 'Add Comuna 13 Tour',
                 data: { title: 'Comuna 13 Graffiti Tour', type: 'activity', time: '2:00 PM', duration: '3h' }
             };
        }

        setMessages(prev => [...prev, { role: 'ai', content: aiContent, action }]);
    }, 1500);
  };

  const handleAction = (action: any) => {
      addItemToDay(0, action.data);
      // Disable action or show success? For now just add a system message
      setMessages(prev => [...prev, { role: 'system', content: `Added "${action.data.title}" to Day 1` }]);
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-100 font-sans">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Sparkles className="w-4 h-4" />
           </div>
           <span className="font-semibold text-slate-900">Trip Assistant</span>
        </div>
        <Button variant="ghost" size="icon" className="text-slate-400">
           <History className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
               <MessageSquare className="w-8 h-8 text-slate-300" />
             </div>
             <p className="text-sm font-medium text-slate-600 mb-1">Start planning your trip</p>
             <p className="text-xs">Ask about flights, hotels, or things to do.</p>
             
             <div className="mt-8 w-full space-y-2">
               <p className="text-xs font-semibold text-left text-slate-300 uppercase tracking-wider mb-2">Recent Chats</p>
               {PAST_CHATS.map(chat => (
                 <button key={chat.id} className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between group">
                    <span className="text-sm text-slate-700 truncate">{chat.title}</span>
                    <span className="text-[10px] text-slate-400 group-hover:text-slate-500">{chat.date}</span>
                 </button>
               ))}
             </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
             <div key={idx} className={cn("flex flex-col gap-2", msg.role === 'user' ? "items-end" : "items-start")}>
                <div className={cn(
                  "max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                  msg.role === 'user' ? "bg-slate-900 text-white rounded-tr-none" : 
                  msg.role === 'system' ? "bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs italic text-center w-full" : 
                  "bg-white border border-slate-100 text-slate-800 rounded-tl-none"
                )}>
                   {msg.content}
                </div>
                
                {/* AI Action Button */}
                {msg.action && (
                    <Button 
                        size="sm" 
                        onClick={() => handleAction(msg.action)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md text-xs h-8 rounded-xl ml-2 animate-in fade-in slide-in-from-top-2"
                    >
                        <Plus className="w-3 h-3 mr-1.5" />
                        {msg.action.label}
                    </Button>
                )}
             </div>
          ))
        )}
        
        {isTyping && (
           <div className="flex justify-start">
              <div className="bg-slate-50 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1">
                 <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                 <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                 <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
           </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-full border border-slate-200 focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
          <Button size="icon" variant="ghost" className="rounded-full h-9 w-9 text-slate-400 hover:text-emerald-600 hover:bg-white">
            <Plus className="w-4 h-4" />
          </Button>
          <input 
            className="flex-1 bg-transparent border-none text-sm focus:outline-none px-2 min-w-0"
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button size="icon" variant="ghost" className="rounded-full h-9 w-9 text-slate-400 hover:text-emerald-600 hover:bg-white">
            <Mic className="w-4 h-4" />
          </Button>
          <Button 
            size="icon" 
            className={cn("rounded-full h-9 w-9 shadow-sm transition-all", input.trim() ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-slate-200 text-slate-400")}
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
