import React, { useState } from 'react';
import { 
  Luggage, 
  Ticket, 
  UtensilsCrossed, 
  Home, 
  Map as MapIcon,
  Send,
  Loader2,
  AlertCircle,
  Sparkles,
  Check,
  X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { cn } from '../components/ui/utils';
import { ScrollArea } from '../components/ui/scroll-area';
import { Skeleton } from '../components/ui/skeleton';
import { TabNavigation, TabPanel, TabConfig, TabId } from '../components/chatbot/TabNavigation';

// Types
type StateType = 'empty' | 'loading' | 'results' | 'preview' | 'error';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface RestaurantResult {
  id: string;
  name: string;
  cuisine: string;
  priceLevel: string;
  distance: string;
  status: string;
  tags: string[];
  reason: string;
}

interface EventResult {
  id: string;
  name: string;
  time: string;
  distance: string;
  fitScore: number;
}

interface TripPlan {
  id: string;
  title: string;
  timeline: string;
  travelBuffer: string;
}

interface RentalResult {
  id: string;
  title: string;
  price: string;
  distance: string;
  valueScore: number;
}

// Mock Data
const MOCK_RESTAURANTS: RestaurantResult[] = [
  {
    id: '1',
    name: 'El Cielo',
    cuisine: 'Molecular Gastronomy',
    priceLevel: '$$$',
    distance: '8 min walk',
    status: 'Open now',
    tags: ['Rooftop', 'Date Night', 'Reservations Required'],
    reason: 'Matches your preference for fine dining and unique experiences'
  },
  {
    id: '2',
    name: 'Carmen',
    cuisine: 'Colombian Fusion',
    priceLevel: '$$',
    distance: '5 min walk',
    status: 'Closes 10pm',
    tags: ['Local Favorite', 'Outdoor Seating'],
    reason: 'Perfect for authentic Colombian cuisine in upscale setting'
  },
  {
    id: '3',
    name: 'Oci.Mde',
    cuisine: 'Mediterranean',
    priceLevel: '$$',
    distance: '12 min walk',
    status: 'Open now',
    tags: ['Casual', 'Good for Groups'],
    reason: 'Great value with consistently high ratings from locals'
  }
];

const MOCK_EVENTS: EventResult[] = [
  {
    id: '1',
    name: 'Comuna 13 Graffiti Tour',
    time: 'Tonight 6pm',
    distance: '15 min drive',
    fitScore: 95
  },
  {
    id: '2',
    name: 'Salsa Dancing at Son Havana',
    time: 'Tonight 9pm',
    distance: '10 min walk',
    fitScore: 88
  }
];

const MOCK_TRIPS: TripPlan[] = [
  {
    id: '1',
    title: 'Dinner + Salsa Night',
    timeline: '7:00pm - 11:30pm',
    travelBuffer: '15 min between activities'
  },
  {
    id: '2',
    title: 'Cultural Evening',
    timeline: '6:00pm - 10:00pm',
    travelBuffer: '20 min travel time'
  }
];

const MOCK_RENTALS: RentalResult[] = [
  {
    id: '1',
    title: 'Modern Studio in Poblado',
    price: '$45/night',
    distance: '2 min walk to restaurants',
    valueScore: 92
  }
];

export default function ChatbotPage() {
  const [activeTab, setActiveTab] = useState<TabId>('restaurants');
  const [state, setState] = useState<StateType>('empty');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  // Tab configuration
  const tabs: TabConfig[] = [
    { id: 'trips' as TabId, label: 'Trips', icon: Luggage, badge: 2 },
    { id: 'events' as TabId, label: 'Events', icon: Ticket, badge: 4 },
    { id: 'restaurants' as TabId, label: 'Restaurants', icon: UtensilsCrossed, badge: 12 },
    { id: 'rentals' as TabId, label: 'Rentals', icon: Home, badge: 1 },
    { id: 'map' as TabId, label: 'Map', icon: MapIcon, badge: 0 }
  ];

  // Handlers
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
    setState('loading');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: 'Here are great dinner spots near El Poblado. I also found events nearby and a couple of easy evening plans.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setState('results');
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Render functions for different states
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
        <Sparkles className="w-8 h-8 text-emerald-600" />
      </div>
      <h3 className="text-slate-900 mb-2">Start a conversation</h3>
      <p className="text-slate-500 text-sm max-w-sm">
        Ask me anything about restaurants, events, trips, or rentals. I'll help you explore your options.
      </p>
      <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-md">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setInputValue('Find restaurants near me')}
        >
          Find restaurants near me
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setInputValue('Plan my Saturday')}
        >
          Plan my Saturday
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setInputValue('Events tonight')}
        >
          Events tonight
        </Button>
      </div>
    </div>
  );

  const renderLoadingState = () => (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
          <Skeleton className="h-5 w-3/4 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-slate-900 mb-2">Something went wrong</h3>
      <p className="text-slate-500 text-sm max-w-sm mb-4">
        I couldn't complete your request. Please try again or rephrase your question.
      </p>
      <Button variant="outline" onClick={() => setState('empty')}>
        Start over
      </Button>
    </div>
  );

  const renderPreviewMode = () => (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-amber-700" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-slate-900 mb-1">AI Suggests</h4>
          <p className="text-sm text-slate-700 mb-3">
            Add 3 restaurants to Saturday dinner. These fit your cuisine preferences and are near your hotel.
          </p>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-6 h-6 rounded bg-green-100 flex items-center justify-center">
                <span className="text-green-700 text-xs">+</span>
              </div>
              <span className="text-slate-700">El Cielo (Molecular Gastronomy)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-6 h-6 rounded bg-green-100 flex items-center justify-center">
                <span className="text-green-700 text-xs">+</span>
              </div>
              <span className="text-slate-700">Carmen (Colombian Fusion)</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setPreviewMode(false)}>
              <Check className="w-4 h-4 mr-1" />
              Apply
            </Button>
            <Button size="sm" variant="outline" onClick={() => setPreviewMode(false)}>
              Preview
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setPreviewMode(false)}>
              <X className="w-4 h-4 mr-1" />
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRestaurantsTab = () => (
    <div className="space-y-3">
      {MOCK_RESTAURANTS.map(restaurant => (
        <div key={restaurant.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:border-emerald-200 hover:shadow-sm transition-all">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium text-slate-900 mb-1">{restaurant.name}</h4>
              <p className="text-sm text-slate-600">{restaurant.cuisine} · {restaurant.priceLevel}</p>
            </div>
            <Badge variant="secondary" className="text-xs">
              {restaurant.distance}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <Badge variant={restaurant.status === 'Open now' ? 'default' : 'secondary'} className="text-xs">
              {restaurant.status}
            </Badge>
            {restaurant.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <p className="text-sm text-slate-600 mb-3 italic">
            {restaurant.reason}
          </p>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              Save
            </Button>
            <Button size="sm" className="flex-1">
              Add to Trip
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEventsTab = () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-slate-500 mb-2">Tonight</h4>
        <div className="space-y-3">
          {MOCK_EVENTS.map(event => (
            <div key={event.id} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-medium text-slate-900">{event.name}</h5>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  {event.fitScore}% match
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 mb-3">
                <span>{event.time}</span>
                <span>·</span>
                <span>{event.distance}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Save
                </Button>
                <Button size="sm" className="flex-1">
                  Add to Trip
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTripsTab = () => (
    <div className="space-y-3">
      {MOCK_TRIPS.map(trip => (
        <div key={trip.id} className="bg-white rounded-xl border border-slate-200 p-4">
          <h4 className="font-medium text-slate-900 mb-2">{trip.title}</h4>
          <div className="space-y-1 text-sm text-slate-600 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-slate-400" />
              <span>{trip.timeline}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-slate-400" />
              <span>{trip.travelBuffer}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              Preview
            </Button>
            <Button size="sm" className="flex-1">
              Apply
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderRentalsTab = () => (
    <div className="space-y-3">
      {MOCK_RENTALS.map(rental => (
        <div key={rental.id} className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-slate-900">{rental.title}</h4>
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
              {rental.valueScore} value
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600 mb-3">
            <span className="font-medium">{rental.price}</span>
            <span>·</span>
            <span>{rental.distance}</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              Save
            </Button>
            <Button size="sm" className="flex-1">
              View Details
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMapTab = () => (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <MapIcon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-slate-900 mb-2">Map View</h3>
      <p className="text-slate-500 text-sm max-w-sm">
        All results shown as clustered pins with color-coding by type.
      </p>
    </div>
  );

  const renderResultsContent = () => {
    switch (activeTab) {
      case 'restaurants':
        return renderRestaurantsTab();
      case 'events':
        return renderEventsTab();
      case 'trips':
        return renderTripsTab();
      case 'rentals':
        return renderRentalsTab();
      case 'map':
        return renderMapTab();
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="max-w-4xl mx-auto px-4 py-6">
              {/* Messages */}
              {messages.length > 0 && (
                <div className="space-y-4 mb-6">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        message.role === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.role === 'ai' && (
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4 text-emerald-700" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-lg rounded-2xl px-4 py-3",
                          message.role === 'user'
                            ? "bg-emerald-600 text-white"
                            : "bg-white border border-slate-200 text-slate-900"
                        )}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Preview Mode */}
              {previewMode && state === 'results' && renderPreviewMode()}

              {/* Results Area */}
              {state === 'empty' && messages.length === 0 && renderEmptyState()}
              {state === 'loading' && renderLoadingState()}
              {state === 'error' && renderErrorState()}
              {state === 'results' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-slate-900">Results</h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPreviewMode(!previewMode)}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Try AI Suggestion
                    </Button>
                  </div>
                  {renderResultsContent()}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Message Input - Sticky Bottom */}
        <div className="border-t border-slate-200 bg-white p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about restaurants, events, trips, or rentals..."
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
                disabled={state === 'loading'}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || state === 'loading'}
                size="icon"
                className="h-12 w-12 rounded-xl"
              >
                {state === 'loading' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}