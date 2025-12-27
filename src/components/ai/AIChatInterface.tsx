/**
 * AI Chat Interface - Production Component
 * 
 * FORENSIC VALIDATION:
 * ✓ User Journey: Type message → Submit → See response → Take action
 * ✓ Workflow: Input validation → API call → Stream response → Display
 * ✓ States: Idle, Typing, Streaming, Success, Error
 * ✓ Safety: Input sanitization, error recovery, user control
 * ✓ Tests: Message send, streaming, error handling, actions
 * 
 * TRIGGER: User submits message
 * CONDITIONS: Non-empty message, not already loading
 * ACTION: Call Gemini API, stream response
 * RESULT: Display AI response with actions
 * FAILURE: Show error, allow retry
 * ABORT: User can stop generation
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, StopCircle, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';
import { streamGeminiResponse, GeminiMessage, GeminiError } from '../../lib/ai/gemini';
import { sanitizeInput } from '../../lib/utils/validation';
import { parseRecommendationResponse, generateViewAllText } from '../../lib/ai/chatResponseParser';
import { ChatRecommendationCard } from './ChatRecommendationCard';

// ============================================================================
// TYPES
// ============================================================================

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  reasoning?: string;
  suggestions?: any[];
  component?: React.ReactNode; // NEW: For recommendation cards
  contextId?: string; // NEW: For navigation
}

interface AIChatInterfaceProps {
  initialMessage?: string;
  onMessageSent?: (message: string) => void;
  onResponse?: (response: string) => void;
  placeholder?: string;
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function AIChatInterface({
  initialMessage = '',
  onMessageSent,
  onResponse,
  placeholder = 'Ask me about travel plans, recommendations, or anything else...',
  className = '',
}: AIChatInterfaceProps) {
  // ============================================================================
  // STATE
  // ============================================================================

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialMessage);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  // Send initial message if provided
  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      handleSubmit(new Event('submit') as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  /**
   * Handle message submission
   * 
   * WORKFLOW:
   * 1. Validate input (non-empty, sanitized)
   * 2. Add user message to conversation
   * 3. Call Gemini API with streaming
   * 4. Stream response chunks
   * 5. Add complete response to conversation
   * 6. Handle errors gracefully
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    if (trimmedInput.length > 10000) {
      setError('Message is too long (max 10,000 characters)');
      return;
    }

    // Sanitize input
    const sanitized = sanitizeInput(trimmedInput, 10000);

    // Clear error
    setError(null);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: sanitized,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);
    setStreamingText('');

    // Callback
    if (onMessageSent) {
      onMessageSent(sanitized);
    }

    try {
      // Build conversation history
      const history: GeminiMessage[] = messages.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: msg.content,
      }));

      // Create abort controller
      abortControllerRef.current = new AbortController();

      // Stream response
      let fullResponse = '';

      const stream = streamGeminiResponse({
        message: sanitized,
        conversationHistory: history,
      });

      for await (const chunk of stream) {
        if (abortControllerRef.current?.signal.aborted) {
          break;
        }

        if (!chunk.isDone) {
          fullResponse += chunk.text;
          setStreamingText(fullResponse);
        }
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingText('');

      // Callback
      if (onResponse) {
        onResponse(fullResponse);
      }

      // Parse AI response for recommendations
      const { success, context, contextId, topResults } = parseRecommendationResponse(fullResponse, sanitized);
      
      if (success && context && topResults) {
        const intentLabel = {
          restaurants: 'restaurants',
          events: 'events',
          rentals: 'places',
          activities: 'activities',
          destinations: 'destinations',
          mixed: 'recommendations',
        }[context.intent] || 'places';

        const viewAllText = generateViewAllText(context);

        // Add recommendation cards to the last message
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.role === 'assistant') {
            return [
              ...prev.slice(0, -1),
              {
                ...lastMessage,
                component: (
                  <ChatRecommendationCard
                    results={topResults}
                    reasoning={context.ranking?.reasoning}
                    totalCount={context.primaryResults.length}
                    intentLabel={intentLabel}
                    areaName={context.area.name}
                    onViewAll={() => {
                      window.location.href = `/explore-v2?contextId=${contextId}`;
                    }}
                  />
                ),
                contextId,
              },
            ];
          }
          return prev;
        });
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      
      const errorMsg = err.message || 'An error occurred while processing your request';
      setError(errorMsg);

      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I apologize, but I encountered an error: ${errorMsg}. Please try again.`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      setStreamingText('');
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  /**
   * Stop streaming response
   */
  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      setStreamingText('');
    }
  };

  /**
   * Retry last message
   */
  const handleRetry = () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMessage) {
      setInput(lastUserMessage.content);
      // Remove last two messages (user + assistant)
      setMessages((prev) => prev.slice(0, -2));
    }
  };

  /**
   * Clear conversation
   */
  const handleClear = () => {
    setMessages([]);
    setError(null);
    setStreamingText('');
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-amber-500 text-white'
                    : 'bg-stone-100 text-stone-900'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="mb-2 flex items-center gap-2 text-sm text-amber-600">
                    <Sparkles className="h-4 w-4" />
                    <span>AI Concierge</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.reasoning && (
                  <div className="mt-2 border-t border-stone-200 pt-2 text-sm text-stone-600">
                    <strong>Reasoning:</strong> {message.reasoning}
                  </div>
                )}
                {message.component && (
                  <div className="mt-4">
                    {message.component}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Streaming Message */}
        {isStreaming && streamingText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="max-w-[80%] rounded-2xl bg-stone-100 px-4 py-3 text-stone-900">
              <div className="mb-2 flex items-center gap-2 text-sm text-amber-600">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span>AI Concierge</span>
              </div>
              <p className="whitespace-pre-wrap">{streamingText}</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-stone-500">
                <span className="animate-pulse">●</span>
                <span>Generating response...</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Typing Indicator */}
        {isStreaming && !streamingText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="rounded-2xl bg-stone-100 px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mb-4"
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setError(null)}
              >
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="border-t border-stone-200 bg-white p-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={isStreaming}
            className="min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
          />
          <div className="flex flex-col gap-2">
            {isStreaming ? (
              <Button
                type="button"
                size="icon"
                variant="destructive"
                onClick={handleStop}
              >
                <StopCircle className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
            {messages.length > 0 && !isStreaming && (
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={handleClear}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <p className="mt-2 text-xs text-stone-500">
          Press Enter to send, Shift+Enter for new line
        </p>
      </form>
    </div>
  );
}