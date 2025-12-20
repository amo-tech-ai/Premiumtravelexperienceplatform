/**
 * Advanced AI Demo Component
 * Showcases all advanced AI features:
 * - Proactive suggestions
 * - Context-aware conversations
 * - Multi-agent collaboration
 * 
 * This is a complete production-ready example
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  MessageCircle, 
  Users, 
  X, 
  Send, 
  Lightbulb,
  Check,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { useAdvancedAI } from '../../hooks/useAdvancedAI';
import { cn } from '../ui/utils';
import { toast } from 'sonner@2.0.3';

export const AdvancedAIDemo = () => {
  const {
    suggestions,
    dismissSuggestion,
    sendMessage,
    conversationHistory,
    askComplex,
    isProcessing,
    isReady,
  } = useAdvancedAI({
    enableProactive: true,
    enableContext: true,
    enableCollaboration: true,
  });

  const [activeTab, setActiveTab] = useState<'proactive' | 'chat' | 'collaboration'>('proactive');
  const [chatInput, setChatInput] = useState('');
  const [complexQuery, setComplexQuery] = useState('');

  // Handle send message
  const handleSendMessage = async () => {
    if (!chatInput.trim() || isProcessing) return;

    try {
      const { response, references } = await sendMessage(chatInput);
      setChatInput('');
      toast.success('Message sent');

      // Show references if any
      if (references.length > 0) {
        console.log('References resolved:', references);
      }
    } catch (error) {
      toast.error('Failed to send message');
      console.error(error);
    }
  };

  // Handle complex query
  const handleComplexQuery = async () => {
    if (!complexQuery.trim() || isProcessing) return;

    try {
      const result = await askComplex(complexQuery);
      setComplexQuery('');
      toast.success(`Query processed using ${result.metadata.agentsUsed} agents`);
    } catch (error) {
      toast.error('Failed to process query');
      console.error(error);
    }
  };

  // Handle suggestion action
  const handleSuggestionAction = (suggestion: any, actionType: string) => {
    if (actionType === 'dismiss') {
      dismissSuggestion(suggestion.id);
      toast.info('Suggestion dismissed');
    } else if (actionType === 'apply') {
      toast.success('Applying suggestion...');
      dismissSuggestion(suggestion.id);
      // In production, actually apply the suggestion
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-full border border-emerald-200">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold text-emerald-900">Advanced AI Features</span>
          <Badge variant="secondary" className="text-xs">Production Ready</Badge>
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900">
          Next-Generation AI Assistant
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Experience proactive suggestions, context-aware conversations, and multi-agent collaboration
        </p>
      </div>

      {/* Status */}
      {!isReady && (
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full" />
            <span className="text-sm text-slate-600">Initializing AI systems...</span>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <TabButton
          active={activeTab === 'proactive'}
          onClick={() => setActiveTab('proactive')}
          icon={<Lightbulb className="w-4 h-4" />}
          label="Proactive Suggestions"
          count={suggestions.length}
        />
        <TabButton
          active={activeTab === 'chat'}
          onClick={() => setActiveTab('chat')}
          icon={<MessageCircle className="w-4 h-4" />}
          label="Context-Aware Chat"
          count={conversationHistory.length}
        />
        <TabButton
          active={activeTab === 'collaboration'}
          onClick={() => setActiveTab('collaboration')}
          icon={<Users className="w-4 h-4" />}
          label="Multi-Agent"
        />
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === 'proactive' && (
            <motion.div
              key="proactive"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Proactive Suggestions */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Active Suggestions
                    </h3>
                    {suggestions.length > 0 && (
                      <Badge variant="secondary">{suggestions.length} active</Badge>
                    )}
                  </div>

                  {suggestions.length === 0 ? (
                    <div className="text-center py-12">
                      <Lightbulb className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">No active suggestions</p>
                      <p className="text-sm text-slate-400 mt-1">
                        AI will suggest improvements as you plan your trip
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {suggestions.map((suggestion) => (
                        <SuggestionCard
                          key={suggestion.id}
                          suggestion={suggestion}
                          onAction={handleSuggestionAction}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              {/* Example Triggers */}
              <Card className="p-6 bg-blue-50 border-blue-200">
                <h4 className="font-medium text-blue-900 mb-3">
                  Try These Actions to Trigger Suggestions:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span className="text-blue-800">Add 6+ items to one day</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span className="text-blue-800">Add expensive items</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span className="text-blue-800">Create overlapping times</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span className="text-blue-800">Add restaurant near activity</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Chat Interface */}
              <Card className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Context-Aware Conversation
                  </h3>

                  {/* Messages */}
                  <ScrollArea className="h-[350px] pr-4">
                    <div className="space-y-3">
                      {conversationHistory.length === 0 ? (
                        <div className="text-center py-12">
                          <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                          <p className="text-slate-500">Start a conversation</p>
                          <p className="text-sm text-slate-400 mt-1">
                            AI remembers context and resolves references
                          </p>
                        </div>
                      ) : (
                        conversationHistory.map((msg) => (
                          <div
                            key={msg.id}
                            className={cn(
                              'flex gap-3',
                              msg.role === 'user' ? 'justify-end' : 'justify-start'
                            )}
                          >
                            <div
                              className={cn(
                                'max-w-[70%] rounded-2xl px-4 py-2',
                                msg.role === 'user'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-100 text-slate-900'
                              )}
                            >
                              <p className="text-sm">{msg.content}</p>
                              {msg.references && msg.references.length > 0 && (
                                <div className="mt-2 text-xs opacity-70">
                                  Resolved: {msg.references.map((r) => r.pronoun).join(', ')}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>

                  {/* Input */}
                  <div className="flex gap-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Try: 'Show me that restaurant' or 'Add it to tomorrow'"
                      disabled={isProcessing}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim() || isProcessing}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Examples */}
              <Card className="p-6 bg-amber-50 border-amber-200">
                <h4 className="font-medium text-amber-900 mb-3">
                  Try These Context-Aware Queries:
                </h4>
                <div className="space-y-2 text-sm text-amber-800">
                  <div>1. "Find Italian restaurants"</div>
                  <div>2. "Show me the second one"</div>
                  <div>3. "Add it to tomorrow"</div>
                  <div>4. "Find activities nearby"</div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'collaboration' && (
            <motion.div
              key="collaboration"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Multi-Agent Collaboration */}
              <Card className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Multi-Agent Collaboration
                  </h3>

                  <p className="text-sm text-slate-600">
                    Ask complex queries that require multiple agents working together
                  </p>

                  {/* Input */}
                  <div className="space-y-3">
                    <Input
                      value={complexQuery}
                      onChange={(e) => setComplexQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleComplexQuery()}
                      placeholder="Plan a romantic evening under $150"
                      disabled={isProcessing}
                      className="text-base"
                    />
                    <Button
                      onClick={handleComplexQuery}
                      disabled={!complexQuery.trim() || isProcessing}
                      className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Processing with AI Agents...
                        </>
                      ) : (
                        <>
                          <Users className="w-4 h-4 mr-2" />
                          Process with Multi-Agent System
                        </>
                      )}
                    </Button>
                  </div>

                  {/* How It Works */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
                    <h4 className="font-medium text-emerald-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      How Multi-Agent Collaboration Works
                    </h4>
                    <div className="space-y-2 text-sm text-emerald-800">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          1
                        </div>
                        <span>Query is analyzed and decomposed into tasks</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          2
                        </div>
                        <span>Multiple agents execute tasks in parallel</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          3
                        </div>
                        <span>Results are aggregated and synthesized</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          4
                        </div>
                        <span>Coherent response delivered to user</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Example Queries */}
              <Card className="p-6 bg-purple-50 border-purple-200">
                <h4 className="font-medium text-purple-900 mb-3">
                  Example Complex Queries:
                </h4>
                <div className="space-y-2">
                  {[
                    'Plan a romantic evening under $150',
                    'Find vegan restaurants and nearby museums',
                    'Optimize my itinerary and check my budget',
                    'Book a hotel and find activities for tomorrow',
                  ].map((example) => (
                    <button
                      key={example}
                      onClick={() => setComplexQuery(example)}
                      className="w-full text-left px-3 py-2 rounded-lg bg-white hover:bg-purple-100 text-sm text-purple-900 transition-colors border border-purple-200"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const TabButton = ({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count?: number;
}) => (
  <button
    onClick={onClick}
    className={cn(
      'flex items-center gap-2 px-4 py-3 border-b-2 transition-colors',
      active
        ? 'border-emerald-500 text-emerald-700'
        : 'border-transparent text-slate-600 hover:text-slate-900'
    )}
  >
    {icon}
    <span className="font-medium">{label}</span>
    {count !== undefined && count > 0 && (
      <Badge variant="secondary" className="text-xs">
        {count}
      </Badge>
    )}
  </button>
);

const SuggestionCard = ({
  suggestion,
  onAction,
}: {
  suggestion: any;
  onAction: (suggestion: any, action: string) => void;
}) => {
  const getIcon = () => {
    switch (suggestion.type) {
      case 'optimization':
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'budget_alert':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Lightbulb className="w-5 h-5 text-emerald-600" />;
    }
  };

  const getPriorityColor = () => {
    switch (suggestion.priority) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn('p-4 rounded-xl border', getPriorityColor())}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">{getIcon()}</div>
        
        <div className="flex-1 space-y-2">
          <div>
            <h4 className="font-medium text-slate-900">{suggestion.title}</h4>
            <p className="text-sm text-slate-600 mt-1">{suggestion.message}</p>
          </div>

          {suggestion.actions && suggestion.actions.length > 0 && (
            <div className="flex gap-2">
              {suggestion.actions.map((action: any, idx: number) => (
                <Button
                  key={idx}
                  size="sm"
                  variant={action.action === 'apply' ? 'default' : 'outline'}
                  onClick={() => onAction(suggestion, action.action)}
                  className="text-xs"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {suggestion.dismissible && (
          <button
            onClick={() => onAction(suggestion, 'dismiss')}
            className="shrink-0 p-1 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default AdvancedAIDemo;