import { useRef, useEffect, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { useAI } from "../../context/AIContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../ui/utils";

export function ChatInterface() {
  const { messages, sendMessage, isTyping } = useAI();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-white md:rounded-l-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-white/50 backdrop-blur-sm flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-serif font-medium text-foreground">AI Concierge</h3>
          <p className="text-xs text-muted-foreground">Always here to help</p>
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
                "max-w-[80%] px-4 py-3 text-sm rounded-2xl shadow-sm",
                msg.role === "user"
                  ? "bg-primary text-white rounded-tr-none"
                  : "bg-muted text-foreground rounded-tl-none"
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
            <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-none flex gap-1">
              <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-white">
        <div className="relative flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about events, properties, or trips..."
            className="rounded-full pr-12 bg-muted/50 border-transparent focus:bg-white transition-colors"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="absolute right-1 rounded-full w-8 h-8 bg-primary hover:bg-primary/90"
            disabled={!input.trim()}
          >
            <Send className="w-4 h-4 text-white" />
          </Button>
        </div>
      </form>
    </div>
  );
}
