import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Lightbulb } from 'lucide-react';
import { ThinkingDots } from './ThinkingDots';
import { FollowUpQuestion, FollowUpOption } from './FollowUpQuestion';

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content?: string;
  isThinking?: boolean;
  type?: 'text' | 'card' | 'question';
  data?: any; // For card data or question options
  confidence?: 'verified' | 'suggestion'; 
  questionData?: {
    question: string;
    options: FollowUpOption[];
  };
}

interface ChatBubbleProps {
  message: Message;
  onOptionSelect?: (value: string) => void; // Callback for questions
}

export const ChatBubble = ({ message, onOptionSelect }: ChatBubbleProps) => {
  const isUser = message.role === 'user';

  // Confidence Badges
  const renderConfidenceBadge = () => {
    if (message.confidence === 'verified') {
      return (
        <div className="flex items-center gap-1 mt-2 text-[10px] font-medium text-emerald-600 uppercase tracking-wider">
          <CheckCircle2 className="w-3 h-3" /> Verified by Concierge
        </div>
      );
    }
    if (message.confidence === 'suggestion') {
      return (
        <div className="flex items-center gap-1 mt-2 text-[10px] font-medium text-amber-600 uppercase tracking-wider">
          <Lightbulb className="w-3 h-3" /> Best Suggestion
        </div>
      );
    }
    return null;
  };

  const isQuestion = message.type === 'question';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
        
        {/* Avatar */}
        <div className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden
          ${isUser ? 'bg-slate-200' : 'bg-emerald-50 border border-emerald-100'}
        `}>
          {isUser ? (
             // Simple User initial
             <span className="text-xs font-medium text-slate-600">ME</span>
          ) : (
             // AI Logo
             <div className="w-full h-full bg-white flex items-center justify-center">
                <span className="text-emerald-700 font-serif font-bold text-xs">AI</span>
             </div>
          )}
        </div>

        {/* Bubble */}
        <div className={
          isQuestion 
            ? "" // No bubble styles for questions
            : `relative px-6 py-4 rounded-2xl text-sm leading-relaxed shadow-sm flex flex-col
               ${isUser 
                 ? 'bg-[#FFFBEB] text-slate-800 rounded-br-none border border-amber-100/50' // User: Cream/Gold
                 : 'bg-white text-slate-600 rounded-bl-none border border-slate-100 shadow-sm'}` // AI: White
        }>
          {/* AI Header Name */}
          {!isUser && !message.isThinking && !isQuestion && (
             <span className="text-xs font-bold text-emerald-700 mb-1 block">Concierge</span>
          )}

          {message.isThinking ? (
            <ThinkingDots />
          ) : isQuestion && message.questionData ? (
             <FollowUpQuestion 
               question={message.questionData.question}
               options={message.questionData.options}
               onSelect={(val) => onOptionSelect?.(val)}
               onSkip={() => onOptionSelect?.('SKIP')}
             />
          ) : (
            <>
              <div className="font-normal text-[15px]">
                {message.content}
              </div>
              {!isUser && renderConfidenceBadge()}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
