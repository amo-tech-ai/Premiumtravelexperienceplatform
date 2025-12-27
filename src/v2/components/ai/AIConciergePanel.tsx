/**
 * AI CONCIERGE PANEL
 * 
 * Side panel for AI chat and suggestions
 * Desktop: Slide-out panel | Mobile: Full screen
 */

import { useEffect, useRef, useState } from 'react';
import { useAIV2 } from '../../context/AIV2Context';
import { X, Send, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { SuggestionCard } from './SuggestionCard';
import { AgentSelector } from './AgentSelector';
import { motion, AnimatePresence } from 'motion/react';

export function AIConciergePanel() {
  const { state, closePanel, sendMessage } = useAIV2();
  const { isPanelOpen, messages, isStreaming, pendingSuggestions, currentAgent } = state;
  
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input when panel opens
  useEffect(() => {
    if (isPanelOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isPanelOpen]);
  
  const handleSend = () => {
    if (!inputValue.trim() || isStreaming) return;
    sendMessage(inputValue);
    setInputValue('');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <AnimatePresence>
      {isPanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePanel}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full lg:w-[480px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="border-b border-neutral-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-medium">AI Concierge</h2>
                  <p className="text-xs text-neutral-600">
                    {currentAgent === 'discovery' && 'Discovering activities'}
                    {currentAgent === 'planning' && 'Planning your day'}
                    {currentAgent === 'optimization' && 'Optimizing itinerary'}
                    {!currentAgent && 'How can I help?'}
                  </p>
                </div>
              </div>
              
              <Button variant="ghost" size="icon" onClick={closePanel}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Agent Selector */}
            <div className="border-b border-neutral-200 p-3">
              <AgentSelector />
            </div>
            
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h3 className="font-medium mb-2">AI Concierge Ready</h3>
                    <p className="text-sm text-neutral-600 max-w-sm mx-auto">
                      Ask me to discover restaurants, plan your day, or optimize your itinerary.
                    </p>
                  </div>
                )}
                
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                
                {isStreaming && (
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Suggestions Area */}
            {pendingSuggestions.length > 0 && (
              <div className="border-t border-neutral-200 p-4 bg-neutral-50">
                <h3 className="text-sm font-medium mb-3">Suggestions</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {pendingSuggestions.map((suggestion) => (
                    <SuggestionCard key={suggestion.id} suggestion={suggestion} />
                  ))}
                </div>
              </div>
            )}
            
            {/* Input Area */}
            <div className="border-t border-neutral-200 p-4">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask AI to help plan your trip..."
                  disabled={isStreaming}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isStreaming}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => setInputValue('Find restaurants near me')}
                  className="text-xs px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                >
                  Find restaurants
                </button>
                <button
                  onClick={() => setInputValue('Plan my entire day')}
                  className="text-xs px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                >
                  Plan my day
                </button>
                <button
                  onClick={() => setInputValue('Optimize my schedule')}
                  className="text-xs px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                >
                  Optimize schedule
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}