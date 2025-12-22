/**
 * Streaming Chat Interface
 * Advanced chat UI with real-time streaming responses from Gemini
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Loader2, Sparkles, Bot, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { getGeminiClient } from '../../lib/ai/gemini-client';
import { cn } from '../../lib/utils/utils';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

interface StreamingChatInterfaceProps {
  className?: string;
  onMessage?: (message: string, response: string) => void;
  initialMessages?: Message[];
  placeholder?: string;
}

export const StreamingChatInterface: React.FC<StreamingChatInterfaceProps> = ({
  className,
  onMessage,
  initialMessages = [],
  placeholder = 'Ask me anything about your trip...',
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamId, setCurrentStreamId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle send message
  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    const streamId = `msg-${Date.now() + 1}`;
    const aiMessage: Message = {
      id: streamId,
      role: 'ai',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setInput('');
    setIsStreaming(true);
    setCurrentStreamId(streamId);

    try {
      const client = getGeminiClient();

      // Convert messages to Gemini format
      const history = messages.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

      // Add current user message
      history.push({
        role: 'user',
        parts: [{ text: userMessage.content }],
      });

      // Stream response
      await client.generateStream(
        userMessage.content,
        {
          onChunk: (text) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === streamId
                  ? { ...msg, content: text, isStreaming: true }
                  : msg
              )
            );
          },
          onComplete: (fullText) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === streamId
                  ? { ...msg, content: fullText, isStreaming: false }
                  : msg
              )
            );
            setIsStreaming(false);
            setCurrentStreamId(null);

            // Callback
            if (onMessage) {
              onMessage(userMessage.content, fullText);
            }
          },
          onError: (error) => {
            console.error('Streaming error:', error);
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === streamId
                  ? {
                      ...msg,
                      content: 'Sorry, I encountered an error. Please try again.',
                      isStreaming: false,
                    }
                  : msg
              )
            );
            setIsStreaming(false);
            setCurrentStreamId(null);
          },
        }
      );
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === streamId
            ? {
                ...msg,
                content: 'Sorry, I encountered an error. Please try again.',
                isStreaming: false,
              }
            : msg
        )
      );
      setIsStreaming(false);
      setCurrentStreamId(null);
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn('flex flex-col h-full bg-white rounded-lg border border-slate-200', className)}>
      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'ai' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}

                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3',
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-900'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  
                  {message.isStreaming && (
                    <motion.span
                      className="inline-block w-2 h-4 ml-1 bg-current"
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                    />
                  )}
                </div>

                {message.role === 'user' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                AI Travel Assistant
              </h3>
              <p className="text-sm text-slate-500 max-w-md">
                I can help you discover events, find restaurants, optimize your itinerary, 
                track your budget, and more. What would you like to know?
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isStreaming}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            size="icon"
          >
            {isStreaming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        {isStreaming && (
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>AI is thinking...</span>
          </div>
        )}
      </div>
    </div>
  );
};