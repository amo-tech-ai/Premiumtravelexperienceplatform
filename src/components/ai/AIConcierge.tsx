import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, MapPin, Search } from 'lucide-react';
import { ChatBubble } from './ChatBubble';
import { ResultsDrawer } from './ResultsDrawer';
import { useAI } from '../../context/AIContext';
import { ResultsTabs, ViewMode } from './ResultsTabs';
import { ResultsList } from './ResultsList';
import { ResultsMap } from './ResultsMap';
import { AgentStatusPanel } from './AgentStatusPanel';
import { useNavigate } from 'react-router';

export const AIConcierge = () => {
  const navigate = useNavigate();
  const { messages, intent, isTyping, sendMessage, resetChat } = useAI();
  const [input, setInput] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('LIST');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Logic to determine if we should show results
  // For now, we assume if there's more than 1 message (initial greeting), we show results
  const hasResults = messages.length > 1;

  // Render the Right Panel Content
  const renderVisualContent = () => {
    if (!hasResults) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-start p-8 overflow-y-auto">
          {/* Welcome Section */}
          <div className="w-full max-w-2xl text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-6 mx-auto">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-serif text-slate-800 mb-2">AI-Powered Travel Assistant</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              6 intelligent agents ready to help you discover, plan, and optimize your trip
            </p>
          </div>

          {/* Agent Status Panel */}
          <div className="w-full max-w-2xl">
            <AgentStatusPanel onTestAgent={(agentId, query) => {
              setInput(query);
              // Auto-send after a short delay to show the query
              setTimeout(() => {
                sendMessage(query);
              }, 100);
            }} />
          </div>

          {/* Quick Tips */}
          <div className="w-full max-w-2xl mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="font-semibold text-blue-900 mb-3">💡 Quick Tips</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Click any agent above to see example queries</li>
              <li>• All agents work together to give you the best recommendations</li>
              <li>• Currently using mock data - connect Gemini for AI-powered responses</li>
            </ul>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full">
         <AnimatePresence mode="wait">
            {viewMode === 'MAP' ? (
                <motion.div 
                    key="map"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full"
                >
                    <ResultsMap intent={intent} />
                </motion.div>
            ) : (
                <motion.div 
                    key="list"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full h-full"
                >
                    <ResultsList intent={intent} />
                </motion.div>
            )}
         </AnimatePresence>

         {/* Floating Tabs */}
         <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
            <div className="pointer-events-auto">
                <ResultsTabs 
                    activeView={viewMode} 
                    onViewChange={setViewMode} 
                    resultCount={4} // This should be dynamic based on actual results
                />
            </div>
         </div>
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
      
      {/* LEFT COLUMN: CHAT (Desktop 40%, Mobile 100%) */}
      <div className="w-full lg:w-[40%] flex flex-col h-full bg-white border-r border-slate-200 shadow-xl z-20">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full animate-pulse ${intent === 'REAL_ESTATE' ? 'bg-emerald-700' : 'bg-emerald-500'}`} />
            <span className="text-sm font-serif font-medium text-slate-700">
              {intent === 'REAL_ESTATE' ? 'Real Estate AI' : 'Concierge AI'}
            </span>
          </div>
          <button 
            onClick={resetChat}
            className="text-xs text-slate-400 hover:text-primary transition-colors"
          >
            Clear Chat
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {isTyping && (
             <ChatBubble message={{ id: 'thinking', role: 'ai', isThinking: true }} />
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl shadow-inner focus-within:ring-2 focus-within:ring-emerald-100 focus-within:border-emerald-300 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={intent === 'REAL_ESTATE' ? "Ask about properties, prices, or neighborhoods..." : "Ask about restaurants, tours, or hidden gems..."}
              className="w-full py-4 pl-4 pr-12 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 font-light"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2 bg-emerald-900 text-white rounded-xl hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: VISUAL RESULTS (Desktop 60%) */}
      <div className="hidden lg:block w-[60%] h-full bg-slate-100 relative">
        {renderVisualContent()}
      </div>
      
      {/* Mobile Drawer (Only shows list view for now on mobile) */}
      <ResultsDrawer hasResults={hasResults}>
         <ResultsList intent={intent} />
      </ResultsDrawer>

    </div>
  );
};