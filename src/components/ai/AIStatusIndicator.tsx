/**
 * AI Status Indicator
 * Shows real-time status of AI agents and Gemini connection
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Wifi, WifiOff, Check, Loader2, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { getGeminiClient } from '../../lib/ai/gemini-client';
import { getEventBus } from '../../lib/ai/event-bus';
import { APIKeyModal } from '../settings/APIKeyModal';
import { cn } from '../ui/utils';

interface AgentStatus {
  name: string;
  type: string;
  status: 'idle' | 'active' | 'error';
  lastActivity?: number;
}

export const AIStatusIndicator: React.FC<{ className?: string }> = ({ className }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [recentActivity, setRecentActivity] = useState(0);
  const [showAPIKeyModal, setShowAPIKeyModal] = useState(false);

  // Check Gemini connection status
  useEffect(() => {
    const checkConnection = () => {
      const client = getGeminiClient();
      setIsConnected(client.isReady());
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);

    return () => clearInterval(interval);
  }, []);

  // Monitor agent activity via Event Bus
  useEffect(() => {
    const bus = getEventBus();
    
    // Track active agents
    const activeAgents = new Map<string, AgentStatus>();

    const handleAgentRequest = (payload: any) => {
      const agentType = payload.data?.agentType || 'unknown';
      activeAgents.set(agentType, {
        name: formatAgentName(agentType),
        type: agentType,
        status: 'active',
        lastActivity: Date.now(),
      });
      
      setAgents(Array.from(activeAgents.values()));
      setRecentActivity(Date.now());
    };

    const handleAgentResponse = (payload: any) => {
      const agentType = payload.data?.agentType || 'unknown';
      const agent = activeAgents.get(agentType);
      
      if (agent) {
        agent.status = 'idle';
        agent.lastActivity = Date.now();
        activeAgents.set(agentType, agent);
        setAgents(Array.from(activeAgents.values()));
      }
    };

    const handleAgentError = (payload: any) => {
      const agentType = payload.data?.agentType || 'unknown';
      const agent = activeAgents.get(agentType);
      
      if (agent) {
        agent.status = 'error';
        agent.lastActivity = Date.now();
        activeAgents.set(agentType, agent);
        setAgents(Array.from(activeAgents.values()));
      }
    };

    bus.on('agent:request', handleAgentRequest);
    bus.on('agent:response', handleAgentResponse);
    bus.on('agent:error', handleAgentError);

    return () => {
      bus.off('agent:request', handleAgentRequest);
      bus.off('agent:response', handleAgentResponse);
      bus.off('agent:error', handleAgentError);
    };
  }, []);

  // Format agent type to readable name
  const formatAgentName = (type: string): string => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get status color and icon
  const getStatusIcon = (status: 'idle' | 'active' | 'error') => {
    switch (status) {
      case 'active':
        return <Loader2 className="w-3 h-3 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      case 'idle':
      default:
        return <Check className="w-3 h-3 text-green-500" />;
    }
  };

  const isActive = agents.some(a => a.status === 'active');

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'relative gap-2 transition-all',
              isActive && 'bg-blue-50',
              className
            )}
          >
            <motion.div
              animate={isActive ? { scale: [1, 1.2, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Sparkles className={cn(
                'w-4 h-4',
                isActive ? 'text-blue-600' : 'text-slate-400'
              )} />
            </motion.div>
            
            <span className="text-xs">
              AI {isConnected ? 'Connected' : 'Offline'}
            </span>

            {/* Connection indicator */}
            <motion.div
              className={cn(
                'w-2 h-2 rounded-full',
                isConnected ? 'bg-green-500' : 'bg-slate-300'
              )}
              animate={isConnected ? { opacity: [1, 0.5, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">AI System Status</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isConnected 
                    ? 'Connected to Gemini AI' 
                    : 'Using mock responses (demo mode)'}
                </p>
              </div>
              {isConnected ? (
                <Wifi className="w-5 h-5 text-green-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-slate-400" />
              )}
            </div>

            {/* Gemini Status */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Gemini API</span>
                <Badge variant={isConnected ? 'default' : 'secondary'}>
                  {isConnected ? 'Active' : 'Not Configured'}
                </Badge>
              </div>
              
              {!isConnected && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowAPIKeyModal(true)}
                >
                  Configure API Key
                </Button>
              )}
            </div>

            {/* Active Agents */}
            {agents.length > 0 && (
              <div className="space-y-2 pt-2 border-t">
                <span className="text-sm font-medium">Active Agents</span>
                <div className="space-y-2">
                  {agents.map((agent) => (
                    <div
                      key={agent.type}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(agent.status)}
                        <span className="text-slate-700">{agent.name}</span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {agent.lastActivity
                          ? `${Math.round((Date.now() - agent.lastActivity) / 1000)}s ago`
                          : 'idle'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {agents.length === 0 && (
              <div className="text-center py-4 text-sm text-slate-500">
                No recent agent activity
              </div>
            )}

            {/* System Info */}
            <div className="pt-2 border-t text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Available Agents:</span>
                <span>6 of 6</span>
              </div>
              {recentActivity > 0 && (
                <div className="flex justify-between mt-1">
                  <span>Last Activity:</span>
                  <span>{Math.round((Date.now() - recentActivity) / 1000)}s ago</span>
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <APIKeyModal
        open={showAPIKeyModal}
        onOpenChange={setShowAPIKeyModal}
      />
    </>
  );
};
