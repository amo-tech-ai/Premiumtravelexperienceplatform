/**
 * AI Concierge Page - Full-Screen Chat
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { AIChatInterface } from '../../components/ai/AIChatInterface';

export default function ConciergePage() {
  // Get query parameter if exists
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q') || '';

  return (
    <div className="flex h-screen flex-col bg-stone-50">
      {/* Header */}
      <div className="border-b border-stone-200 bg-white px-6 py-4">
        <div className="container mx-auto flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
            <Sparkles className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-lg text-stone-900">AI Travel Concierge</h1>
            <p className="text-sm text-stone-600">
              Ask me anything about travel planning
            </p>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto h-full">
          <AIChatInterface
            initialMessage={initialQuery}
            placeholder="Ask about destinations, activities, restaurants, or planning tips..."
            className="h-full bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Suggestions Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-t border-stone-200 bg-white px-6 py-4"
      >
        <div className="container mx-auto">
          <p className="mb-3 text-sm text-stone-600">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'Plan a 5-day trip to Tokyo',
              'Find hidden gems in Paris',
              'Best restaurants in Barcelona',
              'Weekend itinerary for Rome',
              'Family-friendly activities in Bali',
            ].map((suggestion, i) => (
              <button
                key={i}
                onClick={() => {
                  const input = document.querySelector('textarea');
                  if (input) {
                    (input as HTMLTextAreaElement).value = suggestion;
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                  }
                }}
                className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-700 transition-colors hover:border-amber-500 hover:text-amber-600"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
