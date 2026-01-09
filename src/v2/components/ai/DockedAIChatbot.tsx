/**
 * DOCKED AI CHATBOT - Mobile-optimized AI assistant
 * 
 * Three states:
 * 1. Collapsed (56px bar) - Always visible
 * 2. Medium (50% screen) - Active chat
 * 3. Full (85% screen) - Focus mode
 * 
 * Features:
 * - Swipe to resize/dismiss
 * - Agent tabs (Discovery, Planning, Optimization)
 * - Context-aware suggestions
 * - Maintains context behind sheet
 */

import React, { useState, useRef, useEffect } from 'react';
import { X, Minimize2, Maximize2, Send, Mic } from 'lucide-react';
import { useAIV2 } from '../../context/AIV2Context';
import { TouchTargetButton } from '../mobile/TouchTarget';

type DockedState = 'collapsed' | 'medium' | 'full';
type AgentType = 'discovery' | 'planning' | 'optimization';

interface DockedAIChatbotProps {
  tripId?: string;
  className?: string;
}

export function DockedAIChatbot({ tripId, className = '' }: DockedAIChatbotProps) {
  const [state, setState] = useState<DockedState>('collapsed');
  const [activeAgent, setActiveAgent] = useState<AgentType>('discovery');
  const [message, setMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  
  const { messages, sendMessage, isTyping } = useAIV2();
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (state !== 'collapsed') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, state]);

  // Update unread count when collapsed
  useEffect(() => {
    if (state === 'collapsed' && messages.length > 0) {
      setUnreadCount(prev => prev + 1);
    } else {
      setUnreadCount(0);
    }
  }, [messages, state]);

  const handleExpand = () => {
    if (state === 'collapsed') {
      setState('medium');
      setUnreadCount(0);
    }
  };

  const handleCollapse = () => {
    setState('collapsed');
  };

  const handleToggleSize = () => {
    setState(state === 'medium' ? 'full' : 'medium');
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    await sendMessage(message, activeAgent);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;

    if (sheetRef.current && state !== 'collapsed') {
      // Allow pulling down, not up
      if (diff > 0) {
        sheetRef.current.style.transform = `translateY(${diff}px)`;
      }
    }
  };

  const handleTouchEnd = () => {
    const diff = currentY.current - startY.current;
    const threshold = 100;

    if (diff > threshold) {
      // Swipe down far enough
      if (state === 'full') {
        setState('medium');
      } else if (state === 'medium') {
        setState('collapsed');
      }
    }

    // Reset transform
    if (sheetRef.current) {
      sheetRef.current.style.transform = '';
    }

    startY.current = 0;
    currentY.current = 0;
  };

  const agents = [
    { id: 'discovery', label: 'Discovery', icon: '🔍' },
    { id: 'planning', label: 'Planning', icon: '📅' },
    { id: 'optimization', label: 'Optimization', icon: '⚡' },
  ];

  const heightClasses = {
    collapsed: 'h-14',
    medium: 'h-[50vh]',
    full: 'h-[85vh]',
  };

  return (
    <>
      {/* Backdrop - only shown when expanded */}
      {state !== 'collapsed' && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300 z-40"
          onClick={handleCollapse}
          aria-hidden="true"
        />
      )}

      {/* Docked Chatbot */}
      <div
        ref={sheetRef}
        className={`
          fixed bottom-0 left-0 right-0 z-50
          bg-white shadow-2xl
          transition-all duration-300 ease-out
          ${state === 'collapsed' ? '' : 'rounded-t-2xl'}
          ${heightClasses[state]}
          ${className}
        `}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Collapsed State */}
        {state === 'collapsed' && (
          <button
            onClick={handleExpand}
            className="w-full h-full flex items-center justify-between px-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">🤖</span>
              </div>
              <span className="font-medium text-gray-900">AI Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <span className="w-6 h-6 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </div>
          </button>
        )}

        {/* Expanded State */}
        {state !== 'collapsed' && (
          <div className="flex flex-col h-full">
            {/* Drag Handle */}
            <div className="flex justify-center pt-2">
              <div className="w-8 h-1 bg-gray-300 rounded-full" aria-hidden="true" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-base">🤖</span>
                </div>
                <span className="font-semibold text-gray-900">AI Assistant</span>
              </div>
              <div className="flex items-center gap-1">
                <TouchTargetButton
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleSize}
                  aria-label={state === 'medium' ? 'Maximize' : 'Minimize'}
                >
                  {state === 'medium' ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </TouchTargetButton>
                <TouchTargetButton
                  variant="ghost"
                  size="sm"
                  onClick={handleCollapse}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </TouchTargetButton>
              </div>
            </div>

            {/* Agent Tabs */}
            <div className="flex border-b border-gray-200">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setActiveAgent(agent.id as AgentType)}
                  className={`
                    flex-1 py-3 px-2 text-sm font-medium transition-colors
                    ${
                      activeAgent === agent.id
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  <span className="mr-1">{agent.icon}</span>
                  {agent.label}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">
                      {agents.find(a => a.id === activeAgent)?.icon}
                    </span>
                  </div>
                  <p className="text-gray-900 font-medium mb-2">
                    {activeAgent === 'discovery' && "Hi! I'm your Discovery Agent"}
                    {activeAgent === 'planning' && "Hi! I'm your Planning Agent"}
                    {activeAgent === 'optimization' && "Hi! I'm your Optimization Agent"}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    {activeAgent === 'discovery' && "I can help you find restaurants and activities"}
                    {activeAgent === 'planning' && "I can help you plan your days"}
                    {activeAgent === 'optimization' && "I can optimize your itinerary"}
                  </p>
                  
                  {/* Quick Suggestions */}
                  <div className="space-y-2 max-w-sm mx-auto">
                    {activeAgent === 'discovery' && (
                      <>
                        <button
                          onClick={() => setMessage("Find restaurants near me")}
                          className="w-full p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm transition-colors"
                        >
                          Find restaurants near me
                        </button>
                        <button
                          onClick={() => setMessage("What activities are popular here?")}
                          className="w-full p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm transition-colors"
                        >
                          What activities are popular here?
                        </button>
                      </>
                    )}
                    {activeAgent === 'planning' && (
                      <>
                        <button
                          onClick={() => setMessage("Plan my day tomorrow")}
                          className="w-full p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm transition-colors"
                        >
                          Plan my day tomorrow
                        </button>
                        <button
                          onClick={() => setMessage("Create a full itinerary")}
                          className="w-full p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm transition-colors"
                        >
                          Create a full itinerary
                        </button>
                      </>
                    )}
                    {activeAgent === 'optimization' && (
                      <>
                        <button
                          onClick={() => setMessage("Optimize my schedule")}
                          className="w-full p-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg text-sm transition-colors"
                        >
                          Optimize my schedule
                        </button>
                        <button
                          onClick={() => setMessage("Reduce travel time")}
                          className="w-full p-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg text-sm transition-colors"
                        >
                          Reduce travel time
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`
                          max-w-[85%] px-4 py-3 rounded-2xl
                          ${
                            msg.sender === 'user'
                              ? 'bg-blue-600 text-white rounded-br-sm'
                              : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                          }
                        `}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] px-4 py-3 rounded-2xl bg-gray-100 rounded-bl-sm">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Ask ${activeAgent} agent...`}
                  className="flex-1 h-12 px-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
                <TouchTargetButton
                  variant="primary"
                  size="md"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isTyping}
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </TouchTargetButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
