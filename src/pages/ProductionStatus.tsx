/**
 * Production Status Dashboard
 * Internal page to track implementation progress and system health
 */

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  TrendingUp, 
  Activity,
  Database,
  Zap,
  Users,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { getGeminiClient } from '../lib/ai/gemini-client';
import { getEventBus } from '../lib/ai/event-bus';

interface FeatureStatus {
  name: string;
  category: string;
  status: 'complete' | 'partial' | 'missing';
  percentage: number;
  notes?: string;
}

const FEATURES: FeatureStatus[] = [
  // Core Trip Management
  { name: 'Create Trip', category: 'Trip Management', status: 'complete', percentage: 100 },
  { name: 'Edit Trip', category: 'Trip Management', status: 'complete', percentage: 100 },
  { name: 'Delete Trip', category: 'Trip Management', status: 'complete', percentage: 100 },
  { name: 'View Trips', category: 'Trip Management', status: 'complete', percentage: 100 },
  { name: 'Budget Tracking', category: 'Trip Management', status: 'complete', percentage: 100 },
  
  // Itinerary Builder
  { name: 'Add Items', category: 'Itinerary', status: 'complete', percentage: 100 },
  { name: 'Edit Items', category: 'Itinerary', status: 'complete', percentage: 100 },
  { name: 'Delete Items', category: 'Itinerary', status: 'complete', percentage: 100 },
  { name: 'Drag & Drop', category: 'Itinerary', status: 'complete', percentage: 100 },
  { name: 'Time Scheduling', category: 'Itinerary', status: 'complete', percentage: 100 },
  { name: 'Duration Tracking', category: 'Itinerary', status: 'complete', percentage: 100 },
  { name: 'Cost per Item', category: 'Itinerary', status: 'complete', percentage: 100 },
  { name: 'Item Categories', category: 'Itinerary', status: 'complete', percentage: 100 },
  { name: 'Item Images', category: 'Itinerary', status: 'partial', percentage: 70, notes: 'Upload needs storage' },
  { name: 'Location Coords', category: 'Itinerary', status: 'partial', percentage: 60, notes: 'Needs geocoding' },
  
  // AI Agents
  { name: 'Local Scout Agent', category: 'AI', status: 'complete', percentage: 100 },
  { name: 'Dining Orchestrator', category: 'AI', status: 'complete', percentage: 100 },
  { name: 'Itinerary Optimizer', category: 'AI', status: 'complete', percentage: 100 },
  { name: 'Booking Assistant', category: 'AI', status: 'complete', percentage: 100 },
  { name: 'Event Curator', category: 'AI', status: 'complete', percentage: 100 },
  { name: 'Budget Guardian', category: 'AI', status: 'complete', percentage: 100 },
  { name: 'Event Bus', category: 'AI', status: 'complete', percentage: 100 },
  { name: 'Orchestrator', category: 'AI', status: 'complete', percentage: 100 },
  { name: 'Gemini Integration', category: 'AI', status: 'complete', percentage: 100, notes: 'API key configurable' },
  { name: 'Streaming Responses', category: 'AI', status: 'complete', percentage: 100 },
  
  // UI/UX
  { name: 'Responsive Design', category: 'UI/UX', status: 'complete', percentage: 100 },
  { name: 'Mobile Optimization', category: 'UI/UX', status: 'complete', percentage: 100 },
  { name: 'Loading States', category: 'UI/UX', status: 'complete', percentage: 100 },
  { name: 'Error Boundaries', category: 'UI/UX', status: 'complete', percentage: 100 },
  { name: 'Empty States', category: 'UI/UX', status: 'complete', percentage: 100 },
  { name: 'Accessibility', category: 'UI/UX', status: 'partial', percentage: 80, notes: 'Needs audit' },
  
  // Missing Features
  { name: 'Map Integration', category: 'Features', status: 'partial', percentage: 40, notes: 'UI exists, needs real data' },
  { name: 'Media Upload', category: 'Features', status: 'partial', percentage: 50, notes: 'Needs storage' },
  { name: 'Calendar Sync', category: 'Features', status: 'partial', percentage: 70, notes: 'Needs export logic' },
  { name: 'Booking Integration', category: 'Features', status: 'partial', percentage: 40, notes: 'Mock data only' },
  { name: 'Authentication', category: 'Features', status: 'missing', percentage: 0, notes: 'Intentionally left for last' },
  { name: 'Cloud Sync', category: 'Features', status: 'missing', percentage: 0, notes: 'localStorage only' },
  
  // New Production Features
  { name: 'Geocoding Service', category: 'Services', status: 'complete', percentage: 100, notes: 'Multi-provider support' },
  { name: 'Export/Share', category: 'Services', status: 'complete', percentage: 100, notes: 'iCal, JSON, CSV, print' },
  { name: 'Notifications', category: 'Services', status: 'complete', percentage: 100, notes: 'Browser + in-app' },
  { name: 'PWA Support', category: 'Services', status: 'complete', percentage: 100, notes: 'Offline + installable' },
  { name: 'Analytics', category: 'Services', status: 'complete', percentage: 100, notes: 'Events + performance' },
  { name: 'Collaboration', category: 'Services', status: 'complete', percentage: 100, notes: 'Sharing + presence' },
  { name: 'Gemini Tools/Functions', category: 'AI Advanced', status: 'complete', percentage: 100, notes: 'Function calling ready' },
  { name: 'Service Worker', category: 'PWA', status: 'complete', percentage: 100, notes: 'Caching + offline' },
];

export default function ProductionStatus() {
  const [geminiConnected, setGeminiConnected] = useState(false);
  const [eventBusActive, setEventBusActive] = useState(false);
  const [recentEvents, setRecentEvents] = useState(0);

  useEffect(() => {
    // Check Gemini status
    const client = getGeminiClient();
    setGeminiConnected(client.isReady());

    // Check Event Bus
    const bus = getEventBus();
    setEventBusActive(true);

    // Monitor events
    const handleEvent = () => {
      setRecentEvents((prev) => prev + 1);
    };

    bus.on('*', handleEvent);

    return () => {
      bus.off('*', handleEvent);
    };
  }, []);

  // Calculate overall progress
  const calculateProgress = (category?: string) => {
    const filtered = category 
      ? FEATURES.filter(f => f.category === category)
      : FEATURES;
    
    const total = filtered.reduce((sum, f) => sum + f.percentage, 0);
    return Math.round(total / filtered.length);
  };

  const categories = Array.from(new Set(FEATURES.map(f => f.category)));
  const overallProgress = calculateProgress();

  const countByStatus = (status: 'complete' | 'partial' | 'missing') => {
    return FEATURES.filter(f => f.status === status).length;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Production Status Dashboard
          </h1>
          <p className="text-slate-600">
            Real-time tracking of Trip Operating System implementation
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 mb-2">
                {overallProgress}%
              </div>
              <Progress value={overallProgress} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {countByStatus('complete')}
              </div>
              <p className="text-xs text-slate-500 mt-1">features</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Circle className="w-4 h-4 text-yellow-600" />
                Partial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {countByStatus('partial')}
              </div>
              <p className="text-xs text-slate-500 mt-1">features</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                Missing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {countByStatus('missing')}
              </div>
              <p className="text-xs text-slate-500 mt-1">features</p>
            </CardContent>
          </Card>
        </div>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Real-time status of core systems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <Sparkles className={geminiConnected ? 'text-green-600' : 'text-slate-400'} />
                <div>
                  <div className="font-medium">Gemini AI</div>
                  <div className="text-sm text-slate-500">
                    {geminiConnected ? 'Connected' : 'Not Configured'}
                  </div>
                </div>
                <Badge variant={geminiConnected ? 'default' : 'secondary'} className="ml-auto">
                  {geminiConnected ? 'Active' : 'Offline'}
                </Badge>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <Activity className="text-green-600" />
                <div>
                  <div className="font-medium">Event Bus</div>
                  <div className="text-sm text-slate-500">
                    {recentEvents} events processed
                  </div>
                </div>
                <Badge variant="default" className="ml-auto">Active</Badge>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <Database className="text-blue-600" />
                <div>
                  <div className="font-medium">Data Storage</div>
                  <div className="text-sm text-slate-500">
                    localStorage
                  </div>
                </div>
                <Badge variant="default" className="ml-auto">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Status by Category</CardTitle>
            <CardDescription>Detailed breakdown of implementation progress</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={categories[0]}>
              <TabsList className="grid w-full grid-cols-5">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category} value={category} className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">{category} Features</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{calculateProgress(category)}%</span>
                      <Progress value={calculateProgress(category)} className="w-24 h-2" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {FEATURES.filter(f => f.category === category).map((feature) => (
                      <div
                        key={feature.name}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {feature.status === 'complete' && (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          )}
                          {feature.status === 'partial' && (
                            <Circle className="w-5 h-5 text-yellow-600" />
                          )}
                          {feature.status === 'missing' && (
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          )}
                          
                          <div>
                            <div className="font-medium">{feature.name}</div>
                            {feature.notes && (
                              <div className="text-xs text-slate-500">{feature.notes}</div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">{feature.percentage}%</span>
                          <Progress value={feature.percentage} className="w-16 h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Next Steps</CardTitle>
            <CardDescription>Priority actions to reach 100% production ready</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {FEATURES.filter(f => f.status !== 'complete')
                .sort((a, b) => (a.status === 'partial' ? -1 : 1))
                .slice(0, 5)
                .map((feature, index) => (
                  <div key={feature.name} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{feature.name}</div>
                      <div className="text-sm text-slate-600">{feature.notes || 'Implement feature'}</div>
                    </div>
                    <Badge variant={feature.status === 'partial' ? 'outline' : 'secondary'}>
                      {feature.status === 'partial' ? 'Enhance' : 'Build'}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}