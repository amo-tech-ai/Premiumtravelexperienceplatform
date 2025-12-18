import { useRef, useEffect, useState } from "react";
import { Send, Sparkles, MapPin, DollarSign, Users, Calendar } from "lucide-react";
import { useAI } from "../../context/AIContext";
import { useWizard } from "../../context/WizardContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../ui/utils";

export function ChatInterface() {
  const { messages, sendMessage, isTyping, injectMessage } = useAI();
  const { updateFilters, filters, setIntent } = useWizard();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Simple Command Parser
  const processCommands = (text: string) => {
    const lower = text.toLowerCase();
    let actionTaken = false;

    // 1. Budget Detection
    const budgetMatch = lower.match(/(?:under|max|budget|less than)\s?\$?(\d+)/);
    if (budgetMatch) {
      const amount = parseInt(budgetMatch[1]);
      if (!isNaN(amount)) {
        updateFilters({ budget: { ...filters.budget, max: amount } });
        actionTaken = true;
      }
    }

    // 2. Guest/Context Detection
    if (lower.includes('couple') || lower.includes('date')) {
      updateFilters({ guests: 2, tags: [...filters.tags, 'Romantic'] });
      actionTaken = true;
    } else if (lower.includes('party') || lower.includes('group')) {
      updateFilters({ guests: 4, tags: [...filters.tags, 'Nightlife'] });
      actionTaken = true;
    }

    // 3. Location Detection
    const locations = ['poblado', 'laureles', 'envigado', 'centro'];
    const foundLoc = locations.find(l => lower.includes(l));
    if (foundLoc) {
        updateFilters({ location: { ...filters.location!, address: foundLoc.charAt(0).toUpperCase() + foundLoc.slice(1) } });
        actionTaken = true;
    }

    return actionTaken;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Process context-aware commands
    const hasCommand = processCommands(input);
    
    // Send to global AI context
    sendMessage(input);

    if (hasCommand) {
        // Optional: You could inject a system confirmation here, 
        // but AIContext usually replies. We'll let AIContext handle the verbal reply.
    }

    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-white md:rounded-l-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-white/50 backdrop-blur-sm flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-emerald-700" />
        </div>
        <div>
          <h3 className="font-serif font-medium text-foreground">AI Concierge</h3>
          <p className="text-xs text-muted-foreground">Context Aware &bull; Always here</p>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
      >
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex w-full",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] px-4 py-3 text-sm rounded-2xl shadow-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-emerald-900 text-white rounded-tr-none"
                  : "bg-slate-100 text-slate-800 rounded-tl-none"
              )}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Context Chips (Quick Actions) */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
         <button onClick={() => setInput("Budget under $100")} className="flex-shrink-0 text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors">
            💰 Under $100
         </button>
         <button onClick={() => setInput("Romantic date night")} className="flex-shrink-0 text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors">
            🌹 Date Night
         </button>
         <button onClick={() => setInput("In Poblado")} className="flex-shrink-0 text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors">
            📍 Poblado
         </button>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-white">
        <div className="relative flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about events, properties..."
            className="rounded-full pr-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-emerald-500 transition-all h-12"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="absolute right-1.5 rounded-full w-9 h-9 bg-emerald-900 hover:bg-emerald-800 shadow-sm"
            disabled={!input.trim()}
          >
            <Send className="w-4 h-4 text-white" />
          </Button>
        </div>
      </form>
    </div>
  );
}
