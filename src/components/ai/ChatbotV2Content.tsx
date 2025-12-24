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
  ArrowRight,
  Bookmark,
  MessageCircle,
  Plus,
  Navigation,
  Timer
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';
import { ScrollArea } from '../ui/scroll-area';
import { TabNavigation, TabPanel, TabConfig, TabId } from '../chatbot/TabNavigation';
import { InteractiveMap } from '../chatbot/InteractiveMap';
import { AIPreviewCard, RecentlyAddedBadge } from '../chatbot/AIPreviewCard';
import { TripPlanCard } from '../chatbot/TripPlanCard';
import { TripPlanPreview } from '../chatbot/TripPlanPreview';
import { PropertyCard, PropertyComparisonTable } from '../chatbot/PropertyCard';
import { EventCard, TimeGroupHeader, Event, EventTimeGroup } from '../chatbot/EventCard';
import { EventDetailModal } from '../chatbot/EventDetailModal';
import { PreviewManager, createRestaurantAddBatch, createEventAddBatch, createTripModifyBatch } from '../chatbot/preview';

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

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  price: string;
  location: string;
  rating: string;
  reviews: string;
  distance: string;
  walkTime: string;
  driveTime: string;
  status: 'open' | 'closes-soon' | 'closed';
  closingTime?: string;
  tags: string[];
  aiReason: string;
  saved?: boolean;
  addedToTrip?: boolean;
}

interface ChatbotV2ContentProps {
  onClose?: () => void;
  isExpanded?: boolean;
}

export default function ChatbotV2Content({ onClose, isExpanded = false }: ChatbotV2ContentProps) {
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

  // Restaurant state management
  const [restaurants, setRestaurants] = useState<Restaurant[]>([
    {
      id: '1',
      name: 'Carmen',
      cuisine: 'Contemporary Colombian',
      price: '$$$',
      location: 'El Poblado',
      rating: '4.8',
      reviews: '1.2K',
      distance: '1.2 km',
      walkTime: '15 min',
      driveTime: '5 min',
      status: 'open',
      closingTime: '11:00 PM',
      tags: ['Rooftop', 'Romantic', 'Fine Dining'],
      aiReason: 'Matches your preference for upscale Colombian cuisine with romantic ambiance.',
      saved: false,
      addedToTrip: false
    },
    {
      id: '2',
      name: 'El Cielo',
      cuisine: 'Fine Dining',
      price: '$$$$',
      location: 'El Poblado',
      rating: '4.9',
      reviews: '892',
      distance: '0.8 km',
      walkTime: '10 min',
      driveTime: '3 min',
      status: 'open',
      closingTime: '10:30 PM',
      tags: ['Fine Dining', 'Tasting Menu', 'Special Occasion'],
      aiReason: 'Michelin-recommended with innovative tasting experiences you enjoy.',
      saved: true,
      addedToTrip: false
    },
    {
      id: '3',
      name: 'OCI.Mde',
      cuisine: 'Mediterranean',
      price: '$$$',
      location: 'Parque Lleras',
      rating: '4.7',
      reviews: '654',
      distance: '1.5 km',
      walkTime: '18 min',
      driveTime: '6 min',
      status: 'closes-soon',
      closingTime: '9:00 PM',
      tags: ['Mediterranean', 'Casual', 'Outdoor Seating'],
      aiReason: 'Mediterranean flavors in a relaxed setting near Parque Lleras.',
      saved: false,
      addedToTrip: true
    },
    {
      id: '4',
      name: "Mondongo's",
      cuisine: 'Traditional Colombian',
      price: '$$',
      location: 'Laureles',
      rating: '4.6',
      reviews: '1.8K',
      distance: '3.2 km',
      walkTime: '38 min',
      driveTime: '12 min',
      status: 'open',
      closingTime: '8:00 PM',
      tags: ['Local Favorite', 'Casual', 'Traditional'],
      aiReason: 'Authentic local experience with traditional bandeja paisa.',
      saved: false,
      addedToTrip: false
    },
    {
      id: '5',
      name: 'Hatoviejo',
      cuisine: 'Steakhouse',
      price: '$$$',
      location: 'Golden Mile',
      rating: '4.7',
      reviews: '978',
      distance: '2.1 km',
      walkTime: '25 min',
      driveTime: '8 min',
      status: 'open',
      closingTime: '11:30 PM',
      tags: ['Steakhouse', 'Business Dining', 'Premium'],
      aiReason: 'Top-rated steaks in an elegant atmosphere for special dinners.',
      saved: false,
      addedToTrip: false
    }
  ]);

  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [hoveredRestaurant, setHoveredRestaurant] = useState<string | null>(null);

  // Restaurant action handlers
  const toggleSave = (id: string) => {
    setRestaurants(prev => prev.map(r => 
      r.id === id ? { ...r, saved: !r.saved } : r
    ));
  };

  const toggleAddToTrip = (id: string) => {
    setRestaurants(prev => prev.map(r => 
      r.id === id ? { ...r, addedToTrip: !r.addedToTrip } : r
    ));
  };

  const handleMessage = (id: string) => {
    const restaurant = restaurants.find(r => r.id === id);
    if (restaurant) {
      setInput(`Tell me more about ${restaurant.name}`);
    }
  };

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
    const query = input.toLowerCase();
    setInput('');
    setIsLoading(true);

    // Simulate AI response with actual filtering
    setTimeout(() => {
      let aiResponse = '';
      let shouldSwitchTab = false;
      let targetTab: TabId = activeTab;

      // Parse query and filter restaurants
      if (query.includes('restaurant') || query.includes('food') || query.includes('eat') || query.includes('dining')) {
        // Filter restaurants based on query
        let filteredRestaurants = [...restaurants];
        
        // Price filters
        if (query.includes('cheap') || query.includes('budget') || query.includes('under')) {
          filteredRestaurants = restaurants.filter(r => r.price === '$' || r.price === '$$');
          aiResponse = `Found ${filteredRestaurants.length} budget-friendly restaurants for you.`;
        } else if (query.includes('expensive') || query.includes('fine dining') || query.includes('upscale')) {
          filteredRestaurants = restaurants.filter(r => r.price === '$$$' || r.price === '$$$$');
          aiResponse = `Found ${filteredRestaurants.length} upscale dining options.`;
        }
        
        // Cuisine filters
        else if (query.includes('colombian') || query.includes('local')) {
          filteredRestaurants = restaurants.filter(r => 
            r.cuisine.toLowerCase().includes('colombian') || 
            r.tags.some(t => t.toLowerCase().includes('traditional'))
          );
          aiResponse = `Found ${filteredRestaurants.length} Colombian restaurants.`;
        } else if (query.includes('mediterranean')) {
          filteredRestaurants = restaurants.filter(r => r.cuisine.toLowerCase().includes('mediterranean'));
          aiResponse = `Found ${filteredRestaurants.length} Mediterranean restaurants.`;
        } else if (query.includes('steak')) {
          filteredRestaurants = restaurants.filter(r => r.cuisine.toLowerCase().includes('steak'));
          aiResponse = `Found ${filteredRestaurants.length} steakhouses.`;
        }
        
        // Ambiance filters
        else if (query.includes('romantic') || query.includes('date')) {
          filteredRestaurants = restaurants.filter(r => 
            r.tags.some(t => t.toLowerCase().includes('romantic'))
          );
          aiResponse = `Found ${filteredRestaurants.length} romantic restaurants perfect for a date.`;
        } else if (query.includes('rooftop')) {
          filteredRestaurants = restaurants.filter(r => 
            r.tags.some(t => t.toLowerCase().includes('rooftop'))
          );
          aiResponse = `Found ${filteredRestaurants.length} restaurants with rooftop seating.`;
        }
        
        // Top/best filters
        else if (query.includes('top') || query.includes('best')) {
          // Extract number if specified
          const numberMatch = query.match(/\d+/);
          const count = numberMatch ? parseInt(numberMatch[0]) : 5;
          
          // Sort by rating and limit
          filteredRestaurants = [...restaurants]
            .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
            .slice(0, count);
          
          aiResponse = `Here are the top ${count} highest-rated restaurants in Medellín.`;
        }
        
        // Default restaurant query
        else {
          aiResponse = `Found ${restaurants.length} recommended restaurants. Showing all options.`;
        }

        // Update the restaurant list
        setRestaurants(filteredRestaurants.length > 0 ? filteredRestaurants : restaurants);
        shouldSwitchTab = true;
        targetTab = 'restaurants';
      }
      
      // Event queries
      else if (query.includes('event') || query.includes('tonight') || query.includes('concert') || query.includes('show')) {
        aiResponse = 'Found 4 events happening tonight. Check the Events tab.';
        shouldSwitchTab = true;
        targetTab = 'events';
      }
      
      // Property/rental queries
      else if (query.includes('apartment') || query.includes('property') || query.includes('rent') || query.includes('stay')) {
        aiResponse = 'I can help you find properties in Medellín. What are you looking for - short-term vacation rental or long-term apartment?';
        shouldSwitchTab = true;
        targetTab = 'rentals';
      }
      
      // Trip planning queries
      else if (query.includes('plan') || query.includes('trip') || query.includes('itinerary') || query.includes('visit')) {
        aiResponse = 'I can help you plan your trip to Medellín. How many days will you be staying?';
        shouldSwitchTab = true;
        targetTab = 'trips';
      }
      
      // Map/location queries
      else if (query.includes('map') || query.includes('where') || query.includes('location') || query.includes('near')) {
        aiResponse = 'I\'ve marked all recommended locations on the map for you.';
        shouldSwitchTab = true;
        targetTab = 'map';
      }
      
      // Default response
      else {
        aiResponse = `I can help you with restaurants, events, properties, trip planning, and more. What would you like to know?`;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      
      if (shouldSwitchTab) {
        setActiveTab(targetTab);
      }
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
    <div className="h-full bg-white flex flex-col">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">AI Concierge</h2>
            <p className="text-xs text-slate-500">Context Aware • Always here</p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" className="rounded-full md:hidden" onClick={onClose}>
            <X className="w-5 h-5 text-slate-500" />
          </Button>
        )}
      </div>

      {/* Tab Navigation - Icon Only at Top */}
      <div className="flex-shrink-0 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-around px-4 py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all",
                  isActive 
                    ? "text-emerald-600" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                )}
              >
                <Icon className="w-5 h-5" />
                {tab.badge > 0 && (
                  <span className={cn(
                    "absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold px-1",
                    isActive
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-600 text-white"
                  )}>
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* RESULTS PANELS - Main content area in the middle */}
      <div className="bg-slate-50 flex-1 overflow-y-auto min-h-0">
        <TabPanel id="trips" isActive={activeTab === 'trips'}>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900">Trip Plans</h3>
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-xs">3 options</Badge>
            </div>

            {/* Trip Plan Preview - AI suggests multiple options */}
            <TripPlanPreview
              agentName="Local Scout"
              summary="Plan your Saturday in Medellín"
              plans={[
                {
                  id: 'plan-a',
                  title: 'Food-Focused Saturday',
                  subtitle: 'Culinary tour with cultural stops',
                  date: 'Saturday, Dec 28',
                  totalDuration: '8 hours',
                  totalCost: '$120-150',
                  pacing: 'moderate',
                  highlights: ['Fine Dining', 'Rooftop Views', 'Cultural', 'Walking'],
                  tradeoffs: 'More activities, faster pace, focuses on food experiences.',
                  activities: [
                    {
                      id: 'a1',
                      name: 'Morning Coffee at Pergamino',
                      type: 'restaurant',
                      startTime: '9:00 AM',
                      endTime: '10:00 AM',
                      duration: '1 hour',
                      location: 'El Poblado',
                      cost: '$8'
                    },
                    {
                      id: 'a2',
                      name: 'Walk to Museum',
                      type: 'travel',
                      startTime: '10:00 AM',
                      endTime: '10:15 AM',
                      duration: '15 min',
                      location: '',
                      distance: '800m'
                    },
                    {
                      id: 'a3',
                      name: 'Museum of Modern Art',
                      type: 'event',
                      startTime: '10:15 AM',
                      endTime: '12:30 PM',
                      duration: '2 hours',
                      location: 'Centro',
                      cost: '$12'
                    },
                    {
                      id: 'a4',
                      name: 'Lunch at Mondongo\'s',
                      type: 'restaurant',
                      startTime: '1:00 PM',
                      endTime: '2:30 PM',
                      duration: '1.5 hours',
                      location: 'Laureles',
                      cost: '$25',
                      notes: 'Traditional Colombian cuisine'
                    },
                    {
                      id: 'a5',
                      name: 'Free time / Rest',
                      type: 'flex',
                      startTime: '3:00 PM',
                      endTime: '6:00 PM',
                      duration: '3 hours',
                      location: 'Hotel',
                      notes: 'Relax before dinner'
                    },
                    {
                      id: 'a6',
                      name: 'Dinner at Carmen',
                      type: 'restaurant',
                      startTime: '7:00 PM',
                      endTime: '9:30 PM',
                      duration: '2.5 hours',
                      location: 'El Poblado',
                      cost: '$75',
                      notes: 'Rooftop dining with city views'
                    }
                  ]
                },
                {
                  id: 'plan-b',
                  title: 'Relaxed Cultural Day',
                  subtitle: 'Slower pace with more downtime',
                  date: 'Saturday, Dec 28',
                  totalDuration: '6 hours',
                  totalCost: '$80-100',
                  pacing: 'relaxed',
                  highlights: ['Casual', 'Cultural', 'Budget-Friendly', 'Flexible'],
                  tradeoffs: 'Relaxed pacing, includes more downtime, moderate cost.',
                  activities: [
                    {
                      id: 'b1',
                      name: 'Brunch at Local Café',
                      type: 'restaurant',
                      startTime: '10:30 AM',
                      endTime: '12:00 PM',
                      duration: '1.5 hours',
                      location: 'Laureles',
                      cost: '$18'
                    },
                    {
                      id: 'b2',
                      name: 'Art Gallery Visit',
                      type: 'event',
                      startTime: '2:00 PM',
                      endTime: '4:00 PM',
                      duration: '2 hours',
                      location: 'Ciudad del Río',
                      cost: 'Free'
                    },
                    {
                      id: 'b3',
                      name: 'Evening at El Cielo',
                      type: 'restaurant',
                      startTime: '7:30 PM',
                      endTime: '10:00 PM',
                      duration: '2.5 hours',
                      location: 'El Poblado',
                      cost: '$85',
                      notes: 'Tasting menu experience'
                    }
                  ]
                },
                {
                  id: 'plan-c',
                  title: 'Action-Packed Adventure',
                  subtitle: 'See and do as much as possible',
                  date: 'Saturday, Dec 28',
                  totalDuration: '10 hours',
                  totalCost: '$150-200',
                  pacing: 'packed',
                  highlights: ['High Energy', 'Variety', 'Full Day', 'Active'],
                  tradeoffs: 'Most activities, tight schedule, highest cost, very active.',
                  activities: [
                    {
                      id: 'c1',
                      name: 'Early Coffee & Breakfast',
                      type: 'restaurant',
                      startTime: '8:00 AM',
                      endTime: '9:00 AM',
                      duration: '1 hour',
                      location: 'El Poblado',
                      cost: '$12'
                    },
                    {
                      id: 'c2',
                      name: 'Comuna 13 Graffiti Tour',
                      type: 'event',
                      startTime: '9:30 AM',
                      endTime: '12:30 PM',
                      duration: '3 hours',
                      location: 'Comuna 13',
                      cost: '$25'
                    },
                    {
                      id: 'c3',
                      name: 'Lunch in Laureles',
                      type: 'restaurant',
                      startTime: '1:00 PM',
                      endTime: '2:00 PM',
                      duration: '1 hour',
                      location: 'Laureles',
                      cost: '$20'
                    },
                    {
                      id: 'c4',
                      name: 'Museum Visit',
                      type: 'event',
                      startTime: '3:00 PM',
                      endTime: '5:00 PM',
                      duration: '2 hours',
                      location: 'Centro',
                      cost: '$12'
                    },
                    {
                      id: 'c5',
                      name: 'Quick Rest',
                      type: 'flex',
                      startTime: '5:30 PM',
                      endTime: '6:30 PM',
                      duration: '1 hour',
                      location: 'Hotel'
                    },
                    {
                      id: 'c6',
                      name: 'Dinner at Hatoviejo',
                      type: 'restaurant',
                      startTime: '7:00 PM',
                      endTime: '9:00 PM',
                      duration: '2 hours',
                      location: 'Golden Mile',
                      cost: '$70'
                    },
                    {
                      id: 'c7',
                      name: 'Rooftop Bar',
                      type: 'event',
                      startTime: '9:30 PM',
                      endTime: '11:00 PM',
                      duration: '1.5 hours',
                      location: 'El Poblado',
                      cost: '$30'
                    }
                  ]
                }
              ]}
              onApply={(planId) => console.log('Applied plan:', planId)}
              onDismiss={() => console.log('Dismissed plans')}
            />
          </div>
        </TabPanel>

        <TabPanel id="events" isActive={activeTab === 'events'}>
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900">Events Near You</h3>
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-xs">4 events</Badge>
            </div>
            
            {/* Event Cards - Compact Version */}
            {[
              { title: 'Live Jazz at Pergamino', time: '8:00 PM', location: 'El Poblado', price: 'Free', rating: '4.8' },
              { title: 'Salsa Night', time: '9:30 PM', location: 'Laureles', price: '$15', rating: '4.9' },
              { title: 'Art Gallery Opening', time: '7:00 PM', location: 'Ciudad del Río', price: 'Free', rating: '4.7' },
              { title: 'Rooftop Cinema', time: '8:30 PM', location: 'El Poblado', price: '$12', rating: '4.9' }
            ].map((event, i) => (
              <div key={i} className="bg-white rounded-lg p-3 border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-slate-900 text-sm">{event.title}</h4>
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">Tonight</Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600 mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {event.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {event.location}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-medium">{event.rating}</span>
                  </div>
                  <span className="text-xs font-medium text-emerald-600">{event.price}</span>
                </div>
              </div>
            ))}

            <Button className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white" size="sm">
              View All Events
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Button>
          </div>
        </TabPanel>

        <TabPanel id="restaurants" isActive={activeTab === 'restaurants'}>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900">Recommended Restaurants</h3>
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-xs">12 places</Badge>
            </div>

            {/* AI Preview Card - Demo */}
            <AIPreviewCard
              agentName="Local Scout"
              summary="Add 3 restaurants to Saturday dinner"
              changes={[
                {
                  id: '1',
                  type: 'add',
                  item: {
                    name: 'Carmen',
                    details: 'Contemporary Colombian • $$$',
                    time: 'Saturday, 7:00 PM'
                  }
                },
                {
                  id: '2',
                  type: 'add',
                  item: {
                    name: 'El Cielo',
                    details: 'Fine Dining • $$$$',
                    time: 'Saturday, 8:30 PM'
                  }
                },
                {
                  id: '3',
                  type: 'add',
                  item: {
                    name: 'OCI.Mde',
                    details: 'Mediterranean • $$$',
                    time: 'Saturday, 9:00 PM'
                  }
                }
              ]}
              explanation="These fit your cuisine preferences and are near your hotel in El Poblado. All three have rooftop seating for a romantic evening."
              onApply={() => console.log('Applied changes')}
              onDismiss={() => console.log('Dismissed')}
              onPreview={() => console.log('Preview clicked')}
            />

            {/* Enhanced Restaurant Cards with All Features */}
            {restaurants.map((restaurant) => {
              const isHovered = hoveredRestaurant === restaurant.id;
              const isSelected = selectedRestaurant === restaurant.id;
              
              return (
                <div 
                  key={restaurant.id}
                  onClick={() => setSelectedRestaurant(isSelected ? null : restaurant.id)}
                  onMouseEnter={() => setHoveredRestaurant(restaurant.id)}
                  onMouseLeave={() => setHoveredRestaurant(null)}
                  className={cn(
                    "bg-white rounded-xl p-4 border transition-all cursor-pointer group relative max-h-[250px]",
                    isSelected 
                      ? "border-emerald-500 shadow-md ring-2 ring-emerald-100" 
                      : isHovered
                      ? "border-emerald-300 shadow-sm"
                      : "border-slate-200 hover:shadow-sm",
                    restaurant.saved && "ring-1 ring-amber-200",
                    restaurant.addedToTrip && "bg-emerald-50/30"
                  )}
                >
                  {/* Header Row: Name + Status */}
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 mb-1">{restaurant.name}</h4>
                      <p className="text-xs text-slate-600">{restaurant.cuisine} • {restaurant.price}</p>
                    </div>
                    <Badge className={cn(
                      "text-xs flex-shrink-0",
                      restaurant.status === 'open' && "bg-emerald-100 text-emerald-700 border-emerald-200",
                      restaurant.status === 'closes-soon' && "bg-amber-100 text-amber-700 border-amber-200",
                      restaurant.status === 'closed' && "bg-red-100 text-red-700 border-red-200"
                    )}>
                      {restaurant.status === 'open' && `Open • Closes ${restaurant.closingTime}`}
                      {restaurant.status === 'closes-soon' && `Closes soon • ${restaurant.closingTime}`}
                      {restaurant.status === 'closed' && 'Closed'}
                    </Badge>
                  </div>

                  {/* Location + Distance/Time Row */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <MapPin className="w-3 h-3" />
                      <span>{restaurant.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Navigation className="w-3 h-3" />
                        {restaurant.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Timer className="w-3 h-3" />
                        {restaurant.walkTime}
                      </span>
                    </div>
                  </div>

                  {/* Tags Row */}
                  <div className="flex gap-1.5 mb-3 flex-wrap">
                    {restaurant.tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className={cn(
                          "text-[10px] px-2 py-1 rounded-full border",
                          tag === 'Rooftop' && "bg-blue-50 text-blue-700 border-blue-200",
                          tag === 'Romantic' && "bg-pink-50 text-pink-700 border-pink-200",
                          tag === 'Fine Dining' && "bg-purple-50 text-purple-700 border-purple-200",
                          tag === 'Tasting Menu' && "bg-indigo-50 text-indigo-700 border-indigo-200",
                          tag === 'Special Occasion' && "bg-rose-50 text-rose-700 border-rose-200",
                          tag === 'Mediterranean' && "bg-cyan-50 text-cyan-700 border-cyan-200",
                          tag === 'Casual' && "bg-slate-50 text-slate-700 border-slate-200",
                          tag === 'Outdoor Seating' && "bg-green-50 text-green-700 border-green-200",
                          tag === 'Local Favorite' && "bg-orange-50 text-orange-700 border-orange-200",
                          tag === 'Traditional' && "bg-amber-50 text-amber-700 border-amber-200",
                          tag === 'Steakhouse' && "bg-red-50 text-red-700 border-red-200",
                          tag === 'Business Dining' && "bg-gray-50 text-gray-700 border-gray-200",
                          tag === 'Premium' && "bg-yellow-50 text-yellow-700 border-yellow-200"
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* AI Reason Row */}
                  <div className="mb-3 bg-gradient-to-r from-emerald-50 to-transparent p-2.5 rounded-lg border border-emerald-100">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] text-slate-700 leading-relaxed">{restaurant.aiReason}</p>
                    </div>
                  </div>

                  {/* Rating + Actions Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-medium">{restaurant.rating}</span>
                      <span className="text-xs text-slate-400">({restaurant.reviews})</span>
                    </div>

                    {/* Quick Actions - Show on hover or when selected */}
                    <div className={cn(
                      "flex items-center gap-1 transition-all",
                      (isHovered || isSelected) ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave(restaurant.id);
                        }}
                        className={cn(
                          "h-7 w-7 p-0 hover:bg-amber-100",
                          restaurant.saved && "bg-amber-100"
                        )}
                      >
                        <Bookmark className={cn(
                          "w-3.5 h-3.5",
                          restaurant.saved ? "fill-amber-600 text-amber-600" : "text-slate-600"
                        )} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAddToTrip(restaurant.id);
                        }}
                        className={cn(
                          "h-7 w-7 p-0 hover:bg-emerald-100",
                          restaurant.addedToTrip && "bg-emerald-100"
                        )}
                      >
                        <Plus className={cn(
                          "w-3.5 h-3.5",
                          restaurant.addedToTrip ? "text-emerald-600" : "text-slate-600"
                        )} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMessage(restaurant.id);
                        }}
                        className="h-7 w-7 p-0 hover:bg-blue-100"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-slate-600" />
                      </Button>
                    </div>
                  </div>

                  {/* State Indicators */}
                  {restaurant.saved && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5">Saved</Badge>
                    </div>
                  )}
                  {restaurant.addedToTrip && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.5">In Trip</Badge>
                    </div>
                  )}
                </div>
              );
            })}

            <Button className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white" size="sm">
              View All Restaurants
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Button>
          </div>
        </TabPanel>

        <TabPanel id="rentals" isActive={activeTab === 'rentals'}>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900">Properties & Stays</h3>
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-xs">3 listings</Badge>
            </div>

            {/* Property Cards */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Recommended Properties</h4>
              <div className="space-y-3">
                <PropertyCard
                  property={{
                    id: '1',
                    name: 'Luxury Loft El Poblado',
                    type: 'penthouse',
                    price: '$850',
                    pricePerMonth: '$850',
                    location: 'Medellín',
                    neighborhood: 'El Poblado',
                    size: '95 m²',
                    bedrooms: 2,
                    bathrooms: 2,
                    images: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
                    amenities: ['High-speed WiFi', 'Gym & Pool', 'Parking', '24/7 Security', 'Rooftop Terrace', 'Modern Kitchen'],
                    distance: '1.2 km',
                    walkTime: '15 min',
                    rating: '4.9',
                    reviews: '87',
                    valueScore: -15,
                    availability: 'available',
                    furnished: true,
                    petFriendly: false,
                    shortTerm: true,
                    longTerm: true,
                    aiReason: 'Great value at 15% below market for this upscale neighborhood. Modern amenities and walkable to restaurants you enjoy.',
                    saved: false
                  }}
                  onSave={(id) => console.log('Saved:', id)}
                  onMessage={(id) => console.log('Message:', id)}
                  onViewDetails={(id) => console.log('View:', id)}
                />

                <PropertyCard
                  property={{
                    id: '2',
                    name: 'Modern Studio Laureles',
                    type: 'studio',
                    price: '$650',
                    pricePerMonth: '$650',
                    location: 'Medellín',
                    neighborhood: 'Laureles',
                    size: '45 m²',
                    bedrooms: 1,
                    bathrooms: 1,
                    images: ['img1.jpg', 'img2.jpg'],
                    amenities: ['WiFi included', 'Gym access', 'Security', 'Furnished'],
                    distance: '3.5 km',
                    walkTime: '42 min',
                    rating: '4.7',
                    reviews: '52',
                    valueScore: -8,
                    availability: 'ending-soon',
                    furnished: true,
                    petFriendly: true,
                    shortTerm: true,
                    longTerm: false,
                    aiReason: 'Excellent location in trendy Laureles. Pet-friendly and below market average for furnished studios.',
                    saved: true
                  }}
                  onSave={(id) => console.log('Saved:', id)}
                  onMessage={(id) => console.log('Message:', id)}
                  onViewDetails={(id) => console.log('View:', id)}
                />

                <PropertyCard
                  property={{
                    id: '3',
                    name: 'Spacious House Envigado',
                    type: 'house',
                    price: '$1,200',
                    pricePerMonth: '$1,200',
                    location: 'Envigado',
                    neighborhood: 'Envigado Centro',
                    size: '150 m²',
                    bedrooms: 3,
                    bathrooms: 2.5,
                    images: ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg'],
                    amenities: ['Private parking', 'Garden', 'WiFi', 'Security gate', 'Full kitchen', 'Laundry'],
                    distance: '8.2 km',
                    rating: '4.8',
                    reviews: '63',
                    valueScore: 5,
                    availability: 'available',
                    furnished: false,
                    petFriendly: true,
                    shortTerm: false,
                    longTerm: true,
                    aiReason: 'Perfect for families. Quiet neighborhood with good schools nearby. Slightly above market but includes private garden.',
                    saved: false
                  }}
                  onSave={(id) => console.log('Saved:', id)}
                  onMessage={(id) => console.log('Message:', id)}
                  onViewDetails={(id) => console.log('View:', id)}
                />
              </div>
            </div>

            {/* Comparison Table */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Compare Properties</h4>
              <PropertyComparisonTable
                properties={[
                  {
                    id: '1',
                    name: 'Luxury Loft El Poblado',
                    type: 'penthouse',
                    price: '$850',
                    pricePerMonth: '$850',
                    location: 'Medellín',
                    neighborhood: 'El Poblado',
                    size: '95 m²',
                    bedrooms: 2,
                    bathrooms: 2,
                    images: [],
                    amenities: [],
                    distance: '1.2 km',
                    valueScore: -15,
                    availability: 'available',
                    furnished: true,
                    petFriendly: false,
                    shortTerm: true,
                    longTerm: true,
                    aiReason: ''
                  },
                  {
                    id: '2',
                    name: 'Modern Studio Laureles',
                    type: 'studio',
                    price: '$650',
                    pricePerMonth: '$650',
                    location: 'Medellín',
                    neighborhood: 'Laureles',
                    size: '45 m²',
                    bedrooms: 1,
                    bathrooms: 1,
                    images: [],
                    amenities: [],
                    distance: '3.5 km',
                    valueScore: -8,
                    availability: 'ending-soon',
                    furnished: true,
                    petFriendly: true,
                    shortTerm: true,
                    longTerm: false,
                    aiReason: ''
                  },
                  {
                    id: '3',
                    name: 'Spacious House Envigado',
                    type: 'house',
                    price: '$1,200',
                    pricePerMonth: '$1,200',
                    location: 'Envigado',
                    neighborhood: 'Envigado Centro',
                    size: '150 m²',
                    bedrooms: 3,
                    bathrooms: 2.5,
                    images: [],
                    amenities: [],
                    distance: '8.2 km',
                    valueScore: 5,
                    availability: 'available',
                    furnished: false,
                    petFriendly: true,
                    shortTerm: false,
                    longTerm: true,
                    aiReason: ''
                  }
                ]}
              />
            </div>
          </div>
        </TabPanel>

        <TabPanel id="map" isActive={activeTab === 'map'}>
          <div className="h-full">
            <InteractiveMap />
          </div>
        </TabPanel>
      </div>

      {/* Chat Messages Area - At the bottom */}
      <div 
        ref={scrollRef}
        className="flex-shrink-0 bg-white border-t border-slate-200 p-3 max-h-32 overflow-y-auto"
      >
        <div className="space-y-2">
          {messages.slice(-3).map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-3 py-2 text-xs",
                  message.role === 'user'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-900'
                )}
              >
                <p className="leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-2xl px-3 py-2 flex items-center gap-2">
                <Loader2 className="w-3 h-3 text-slate-500 animate-spin" />
                <span className="text-xs text-slate-500">Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Chips */}
      <div className="px-4 pb-3 flex-shrink-0">
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
      <div className="bg-white border-t border-slate-200 p-4 flex-shrink-0">
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
            className="rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}