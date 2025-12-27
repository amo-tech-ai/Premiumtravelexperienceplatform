/**
 * AI FLOATING BUTTON
 * 
 * Floating action button to open AI Concierge
 */

import { useAIV2 } from '../../context/AIV2Context';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export function AIFloatingButton() {
  const { togglePanel, state } = useAIV2();
  const { isPanelOpen } = state;
  
  if (isPanelOpen) return null;
  
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={togglePanel}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 shadow-2xl flex items-center justify-center z-40 hover:shadow-3xl transition-shadow"
    >
      <Sparkles className="w-6 h-6 text-white" />
      
      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 animate-ping opacity-20" />
    </motion.button>
  );
}
