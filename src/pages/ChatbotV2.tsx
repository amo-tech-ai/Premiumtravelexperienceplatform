import React, { useState, useRef, useEffect } from 'react';
import { 
  X,
  Send,
  Loader2,
  Sparkles,
  MapPin,
  DollarSign,
  Heart,
  Luggage,
  Ticket,
  UtensilsCrossed,
  Home,
  Map as MapIcon,
  Calendar,
  Clock,
  Star,
  Users,
  ArrowRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { cn } from '../components/ui/utils';
import { ScrollArea } from '../components/ui/scroll-area';
import { TabNavigation, TabPanel, TabConfig, TabId } from '../components/chatbot/TabNavigation';
import conciergeIcon from 'figma:asset/e180de77b27e7d27e4e27e370b21aa46c28a0d34.png';

// Types
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  query: string;
}

export default function ChatbotV2() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to Medellín. I am your personal concierge. Ask me about events, real estate, or planning your trip.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('restaurants');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Quick action chips
  const quickActions: QuickAction[] = [
    { 
      id: '1', 
      label: 'Under $100', 
      icon: <DollarSign className="w-3.5 h-3.5" />,
      query: 'Show me restaurants under $100'
    },
    { 
      id: '2', 
      label: 'Date Night', 
      icon: <Heart className="w-3.5 h-3.5" />,
      query: 'Recommend romantic date night spots'
    },
    { 
      id: '3', 
      label: 'Poblado', 
      icon: <MapPin className="w-3.5 h-3.5" />,
      query: 'What to do in El Poblado'
    }
  ];

  // Tab configuration
  const tabs: TabConfig[] = [
    { id: 'trips', label: 'Trips', icon: Luggage, badge: 0 },
    { id: 'events', label: 'Events', icon: Ticket, badge: 4 },
    { id: 'restaurants', label: 'Restaurants', icon: UtensilsCrossed, badge: 12 },
    { id: 'rentals', label: 'Rentals', icon: Home, badge: 0 },
    { id: 'map', label: 'Map', icon: MapIcon, badge: 0 }
  ];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I found 12 restaurants matching "${input}". Check the Restaurants tab to see them all.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      setActiveTab('restaurants');
    }, 1500);
  };

  const handleQuickAction = (action: QuickAction) => {
    setInput(action.query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">AI Concierge</h2>
              <p className="text-xs text-slate-500">Context Aware • Always here</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <X className="w-5 h-5 text-slate-500" />
          </Button>
        </div>

        {/* Chat Messages Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3",
                  message.role === 'user'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-900'
                )}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />
                <span className="text-sm text-slate-500">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Chips */}
        <div className="px-6 pb-4">
          <div className="flex gap-2 flex-wrap">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action)}
                className="rounded-full border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
              >
                {action.icon}
                <span className="ml-1.5">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="bg-white border-t border-slate-200 p-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about events, stays, or plans..."
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Panels */}
        <div className="bg-slate-50 flex-1 overflow-y-auto">
          <TabPanel id="trips" isActive={activeTab === 'trips'}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Trip Plans</h3>
                <Badge variant="secondary" className="bg-slate-100 text-slate-600">0 trips</Badge>
              </div>
              <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Luggage className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">No trips planned yet</h4>
                <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
                  Let me help you plan the perfect trip to Medellín. I can create custom itineraries based on your interests.
                </p>
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => setInput('Plan a 3-day trip to Medellín')}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Plan My Trip
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      className="flex-1 text-sm"
                      onClick={() => setInput('Weekend getaway ideas')}
                    >
                      Weekend Trip
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 text-sm"
                      onClick={() => setInput('One week in Medellín')}
                    >
                      Week-Long Stay
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel id="events" isActive={activeTab === 'events'}>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Events Near You</h3>
                <Badge variant="secondary" className="bg-slate-100 text-slate-600">4 events</Badge>
              </div>
              
              {/* Event 1 */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">Live Jazz Night at Pergamino</h4>
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Tonight
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        8:00 PM
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      El Poblado • 0.3 mi away
                    </p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">Tonight</Badge>
                </div>
                <p className="text-sm text-slate-500 mb-3">Live jazz trio performing classic standards. Perfect for date night with craft cocktails.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium">4.8</span>
                    <span className="text-sm text-slate-400">(124 reviews)</span>
                  </div>
                  <span className="text-sm font-medium text-emerald-600">Free Entry</span>
                </div>
              </div>

              {/* Event 2 */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">Salsa Night at Donde Aquellos</h4>
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Tonight
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        9:30 PM
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Laureles • 1.2 mi away
                    </p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">Tonight</Badge>
                </div>
                <p className="text-sm text-slate-500 mb-3">Authentic salsa dancing with live band. Beginner-friendly with free lessons at 9 PM.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium">4.9</span>
                    <span className="text-sm text-slate-400">(89 reviews)</span>
                  </div>
                  <span className="text-sm font-medium text-emerald-600">$15 Cover</span>
                </div>
              </div>

              {/* Event 3 */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">Art Gallery Opening: Local Artists</h4>
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Tonight
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        7:00 PM
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Ciudad del Río • 2.1 mi away
                    </p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">Tonight</Badge>
                </div>
                <p className="text-sm text-slate-500 mb-3">Contemporary art exhibition featuring 12 local Medellín artists. Wine & canapés included.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium">4.7</span>
                    <span className="text-sm text-slate-400">(56 reviews)</span>
                  </div>
                  <span className="text-sm font-medium text-emerald-600">Free Entry</span>
                </div>
              </div>

              {/* Event 4 */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">Rooftop Cinema: Classic Film Night</h4>
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Tonight
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        8:30 PM
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      El Poblado • 0.5 mi away
                    </p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">Tonight</Badge>
                </div>
                <p className="text-sm text-slate-500 mb-3">Outdoor cinema under the stars. Tonight: Casablanca. Bring blankets or reserve lounge seats.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium">4.9</span>
                    <span className="text-sm text-slate-400">(203 reviews)</span>
                  </div>
                  <span className="text-sm font-medium text-emerald-600">$12 Ticket</span>
                </div>
              </div>

              <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white">
                View All Events
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </TabPanel>

          <TabPanel id="restaurants" isActive={activeTab === 'restaurants'}>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Recommended Restaurants</h3>
                <Badge variant="secondary" className="bg-slate-100 text-slate-600">12 places</Badge>
              </div>

              {/* Restaurant 1 */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">Carmen</h4>
                    <p className="text-sm text-slate-600 mb-2">Contemporary Colombian • $$$ • 0.8 mi</p>
                    <p className="text-sm text-slate-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      El Poblado, Carrera 36
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Open Now</Badge>
                </div>
                <p className="text-sm text-slate-500 mb-3">Rooftop dining with panoramic city views. Colombian ingredients with French techniques. Reserve ahead for sunset tables.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium">4.8</span>
                    <span className="text-sm text-slate-400">(1,247 reviews)</span>
                  </div>
                  <span className="text-sm font-medium text-slate-600">$$$ • Great for dates</span>
                </div>
              </div>

              {/* Restaurant 2 */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">El Cielo</h4>
                    <p className="text-sm text-slate-600 mb-2">Fine Dining • $$$$ • 1.2 mi</p>
                    <p className="text-sm text-slate-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      El Poblado, Calle 10
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Open Now</Badge>
                </div>
                <p className="text-sm text-slate-500 mb-3">Michelin-level sensory dining experience. 12-course tasting menu with molecular gastronomy. Chef Juan Manuel Barrientos.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium">4.9</span>
                    <span className="text-sm text-slate-400">(892 reviews)</span>
                  </div>
                  <span className="text-sm font-medium text-slate-600">$$$$ • Special occasion</span>
                </div>
              </div>

              {/* Restaurant 3 */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">OCI.Mde</h4>
                    <p className="text-sm text-slate-600 mb-2">Mediterranean Fusion • $$$ • 0.5 mi</p>
                    <p className="text-sm text-slate-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      El Poblado, Parque Lleras
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Open Now</Badge>
                </div>
                <p className="text-sm text-slate-500 mb-3">Fresh Mediterranean cuisine with local ingredients. Excellent wine list. Intimate courtyard seating available.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium">4.7</span>
                    <span className="text-sm text-slate-400">(654 reviews)</span>
                  </div>
                  <span className="text-sm font-medium text-slate-600">$$$ • Wine bar</span>
                </div>
              </div>

              {/* Restaurant 4 */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">Mondongo's</h4>
                    <p className="text-sm text-slate-600 mb-2">Traditional Colombian • $$ • 1.8 mi</p>
                    <p className="text-sm text-slate-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Laureles, Av Jardín
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Open Now</Badge>
                </div>
                <p className="text-sm text-slate-500 mb-3">Authentic Paisa cuisine. Famous for bandeja paisa and mondongo soup. Large portions, family-style dining.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium">4.6</span>
                    <span className="text-sm text-slate-400">(1,832 reviews)</span>
                  </div>
                  <span className="text-sm font-medium text-slate-600">$$ • Casual dining</span>
                </div>
              </div>

              {/* Restaurant 5 */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">Hatoviejo</h4>
                    <p className="text-sm text-slate-600 mb-2">Steakhouse • $$$ • 0.9 mi</p>
                    <p className="text-sm text-slate-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      El Poblado, Golden Mile
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Open Now</Badge>
                </div>
                <p className="text-sm text-slate-500 mb-3">Premium Colombian beef cuts. Traditional parrilla experience. Great for groups and business dinners.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium">4.7</span>
                    <span className="text-sm text-slate-400">(978 reviews)</span>
                  </div>
                  <span className="text-sm font-medium text-slate-600">$$$ • Meat lover</span>
                </div>
              </div>

              <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white">
                View All Restaurants
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </TabPanel>

          <TabPanel id="rentals" isActive={activeTab === 'rentals'}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Properties & Stays</h3>
                <Badge variant="secondary" className="bg-slate-100 text-slate-600">0 saved</Badge>
              </div>
              <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-amber-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">No saved properties</h4>
                <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
                  Discover luxury apartments, penthouses, and investment properties in the best neighborhoods of Medellín.
                </p>
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={() => setInput('Show me luxury apartments in El Poblado')}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Browse Properties
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      className="flex-1 text-sm"
                      onClick={() => setInput('Short-term rentals')}
                    >
                      Vacation Rentals
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 text-sm"
                      onClick={() => setInput('Long-term apartments')}
                    >
                      Long-term
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel id="map" isActive={activeTab === 'map'}>
            <div className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Map View</h3>
              <div className="bg-slate-200 rounded-lg h-96 flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <MapIcon className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                  <p className="text-sm">Map integration coming soon</p>
                </div>
              </div>
            </div>
          </TabPanel>
        </div>
      </div>
    </div>
  );
}