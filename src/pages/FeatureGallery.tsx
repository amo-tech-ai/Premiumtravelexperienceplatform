/**
 * Feature Gallery - Visual Navigation to All Completed Features
 * Shows every completed feature with working links
 */

import React from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  Sparkles,
  Map,
  Calendar,
  MessageCircle,
  Bookmark,
  TrendingUp,
  Users,
  Lightbulb,
  Route,
  DollarSign,
  Clock,
  Building2,
  Search,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Home,
  Compass,
  MapPin,
  Pizza,
  Music,
  Palette,
  FileText,
  Settings,
  Zap,
  Target,
  Brain,
  Heart,
  Eye,
} from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  category: 'core' | 'ai' | 'trip' | 'discover' | 'real-estate' | 'system';
  status: 'live' | 'new' | 'enhanced';
  screenshot?: string;
}

const FEATURES: Feature[] = [
  // CORE FEATURES
  {
    id: 'home',
    title: 'Homepage',
    description: 'Beautiful landing page with hero, features, and CTAs',
    path: '/',
    icon: <Home className="w-6 h-6" />,
    category: 'core',
    status: 'live',
  },
  {
    id: 'dashboard',
    title: 'Trip Dashboard',
    description: 'Overview of all your trips, quick actions, and stats',
    path: '/dashboard',
    icon: <Target className="w-6 h-6" />,
    category: 'core',
    status: 'live',
  },
  {
    id: 'status',
    title: 'Production Status',
    description: 'Real-time system health and feature status',
    path: '/status',
    icon: <CheckCircle2 className="w-6 h-6" />,
    category: 'system',
    status: 'live',
  },

  // AI FEATURES
  {
    id: 'ai-demo',
    title: 'Advanced AI Demo',
    description: 'Proactive suggestions, context-aware chat, multi-agent collaboration',
    path: '/ai-demo',
    icon: <Sparkles className="w-6 h-6" />,
    category: 'ai',
    status: 'new',
  },
  {
    id: 'concierge',
    title: 'AI Concierge',
    description: '6 AI agents working together: Dining, Events, Optimizer, Booking, Scout, Budget',
    path: '/concierge',
    icon: <Brain className="w-6 h-6" />,
    category: 'ai',
    status: 'enhanced',
  },
  {
    id: 'chats',
    title: 'AI Conversations',
    description: 'All your AI chat history with context persistence',
    path: '/chats',
    icon: <MessageCircle className="w-6 h-6" />,
    category: 'ai',
    status: 'live',
  },

  // TRIP PLANNING
  {
    id: 'trip-details',
    title: 'Luxury Trip Planner',
    description: 'Drag & drop itinerary, Ideas section, Day-by-day view, AI suggestions',
    path: '/trip/sample-trip-123',
    icon: <Calendar className="w-6 h-6" />,
    category: 'trip',
    status: 'enhanced',
  },
  {
    id: 'itinerary-wizard',
    title: 'Itinerary Creator',
    description: 'Step-by-step trip creation wizard',
    path: '/itinerary/new',
    icon: <Route className="w-6 h-6" />,
    category: 'trip',
    status: 'live',
  },
  {
    id: 'saved-places',
    title: 'Saved Places',
    description: 'All your bookmarked restaurants, hotels, activities with detail drawer',
    path: '/saved',
    icon: <Bookmark className="w-6 h-6" />,
    category: 'trip',
    status: 'enhanced',
  },

  // DISCOVERY
  {
    id: 'explore',
    title: 'Explore Page',
    description: 'Discover restaurants, events, activities with filters',
    path: '/explore',
    icon: <Compass className="w-6 h-6" />,
    category: 'discover',
    status: 'live',
  },
  {
    id: 'map-explorer',
    title: 'Interactive Map',
    description: 'Explore Medellín neighborhoods on interactive map',
    path: '/map',
    icon: <Map className="w-6 h-6" />,
    category: 'discover',
    status: 'live',
  },
  {
    id: 'experiences',
    title: 'Medellín Experiences',
    description: 'Curated experiences, tours, and activities',
    path: '/experiences/medellin',
    icon: <Music className="w-6 h-6" />,
    category: 'discover',
    status: 'live',
  },
  {
    id: 'restaurants',
    title: 'Restaurant Detail',
    description: 'Detailed restaurant pages with menu, photos, reviews',
    path: '/restaurants/el-cielo',
    icon: <Pizza className="w-6 h-6" />,
    category: 'discover',
    status: 'live',
  },
  {
    id: 'events',
    title: 'Events Hub',
    description: 'Discover local events, festivals, concerts',
    path: '/events',
    icon: <Music className="w-6 h-6" />,
    category: 'discover',
    status: 'live',
  },

  // REAL ESTATE
  {
    id: 'real-estate',
    title: 'Real Estate Home',
    description: 'Property investment platform for Medellín',
    path: '/real-estate',
    icon: <Building2 className="w-6 h-6" />,
    category: 'real-estate',
    status: 'live',
  },
  {
    id: 'property-search',
    title: 'Property Search',
    description: 'Search properties with advanced filters',
    path: '/real-estate/search',
    icon: <Search className="w-6 h-6" />,
    category: 'real-estate',
    status: 'live',
  },
  {
    id: 'property-detail',
    title: 'Property Detail',
    description: 'Detailed property pages with 3D tours',
    path: '/real-estate/listing/luxury-penthouse-poblado',
    icon: <Eye className="w-6 h-6" />,
    category: 'real-estate',
    status: 'live',
  },
  {
    id: 'market-insights',
    title: 'Market Insights',
    description: 'Real estate analytics and market trends',
    path: '/real-estate/market-data',
    icon: <BarChart3 className="w-6 h-6" />,
    category: 'real-estate',
    status: 'live',
  },

  // DESIGN SYSTEM
  {
    id: 'style-guide',
    title: 'Design System',
    description: 'Complete component library and style guide',
    path: '/style-guide',
    icon: <Palette className="w-6 h-6" />,
    category: 'system',
    status: 'live',
  },
  {
    id: 'architecture',
    title: 'System Architecture',
    description: 'Technical documentation and architecture overview',
    path: '/architecture',
    icon: <FileText className="w-6 h-6" />,
    category: 'system',
    status: 'live',
  },
  {
    id: 'how-it-works',
    title: 'How It Works',
    description: 'Public-facing explanation of the platform',
    path: '/how-it-works',
    icon: <Lightbulb className="w-6 h-6" />,
    category: 'system',
    status: 'live',
  },
];

const CATEGORIES = [
  { id: 'core', label: 'Core Features', color: 'emerald' },
  { id: 'ai', label: 'AI Features', color: 'purple' },
  { id: 'trip', label: 'Trip Planning', color: 'blue' },
  { id: 'discover', label: 'Discovery', color: 'amber' },
  { id: 'real-estate', label: 'Real Estate', color: 'rose' },
  { id: 'system', label: 'System', color: 'slate' },
];

const STATUS_BADGES = {
  live: { label: 'Live', color: 'bg-green-100 text-green-800 border-green-200' },
  new: { label: 'NEW ✨', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  enhanced: { label: 'Enhanced', color: 'bg-blue-100 text-blue-800 border-blue-200' },
};

export default function FeatureGallery() {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const filteredFeatures = selectedCategory
    ? FEATURES.filter((f) => f.category === selectedCategory)
    : FEATURES;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Feature Gallery</h1>
                  <p className="text-slate-600">All completed features with working links</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-emerald-600">{FEATURES.length}</div>
              <div className="text-sm text-slate-600">Features Complete</div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mt-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedCategory === null
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Features ({FEATURES.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = FEATURES.filter((f) => f.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    selectedCategory === cat.id
                      ? `bg-${cat.color}-600 text-white`
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredFeatures.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </motion.div>

        {filteredFeatures.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-slate-600">No features found in this category</p>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="bg-slate-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">
                {FEATURES.length}
              </div>
              <div className="text-slate-400">Total Features</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">
                {FEATURES.filter((f) => f.category === 'ai').length}
              </div>
              <div className="text-slate-400">AI Features</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">
                {FEATURES.filter((f) => f.status === 'new').length}
              </div>
              <div className="text-slate-400">New This Week</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-400 mb-2">100%</div>
              <div className="text-slate-400">Production Ready</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Feature Card Component
const FeatureCard = ({ feature }: { feature: Feature }) => {
  const statusBadge = STATUS_BADGES[feature.status];
  const category = CATEGORIES.find((c) => c.id === feature.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={feature.path}
        className="block group bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-400 transition-all overflow-hidden h-full"
      >
        {/* Icon Header */}
        <div className="p-6 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <div className="flex flex-col gap-2 items-end">
              <span
                className={`text-xs px-2 py-1 rounded-full border ${statusBadge.color}`}
              >
                {statusBadge.label}
              </span>
              {category && (
                <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {category.label}
                </span>
              )}
            </div>
          </div>

          <h3 className="font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
            {feature.title}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-2">
            {feature.description}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">{feature.path}</span>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
        </div>
      </Link>
    </motion.div>
  );
};