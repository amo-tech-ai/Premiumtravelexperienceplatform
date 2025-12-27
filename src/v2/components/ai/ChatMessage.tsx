/**
 * CHAT MESSAGE
 * 
 * Individual chat message bubble
 */

import { AIMessage } from '../../context/AIV2Context';
import { User, Sparkles } from 'lucide-react';

interface ChatMessageProps {
  message: AIMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };
  
  const getAgentIcon = () => {
    switch (message.agent) {
      case 'discovery':
        return '🔍';
      case 'planning':
        return '📅';
      case 'optimization':
        return '⚡';
      default:
        return null;
    }
  };
  
  if (isSystem) {
    return (
      <div className="text-center">
        <p className="text-xs text-neutral-500 bg-neutral-100 rounded-full px-3 py-1 inline-block">
          {message.content}
        </p>
      </div>
    );
  }
  
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-neutral-900' : 'bg-gradient-to-br from-blue-500 to-purple-600'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Sparkles className="w-4 h-4 text-white" />
        )}
      </div>
      
      {/* Message Content */}
      <div className={`flex-1 ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div className={`rounded-2xl px-4 py-2 max-w-[85%] ${
          isUser
            ? 'bg-neutral-900 text-white'
            : 'bg-neutral-100 text-neutral-900'
        }`}>
          {/* Agent badge */}
          {!isUser && message.agent && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{getAgentIcon()}</span>
              <span className="text-xs font-medium capitalize opacity-75">
                {message.agent} Agent
              </span>
            </div>
          )}
          
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        
        <p className={`text-xs text-neutral-500 mt-1 ${isUser ? 'text-right' : ''}`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
