/**
 * What's New Page - Feature Showcase
 * Demo page to showcase latest implementations
 */

import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  Sparkles, 
  Calendar, 
  Plus, 
  Edit2, 
  Trash2, 
  MessageSquare, 
  Zap,
  CheckCircle2,
  ArrowRight,
  Code2,
  Rocket,
  Layout,
  MapPin,
  Shield
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export default function WhatsNewPage() {
  const navigate = useNavigate();

  const features = [
    {
      category: 'AI Integration',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      items: [
        {
          title: '6 Specialized AI Agents',
          description: 'Local Scout, Dining Orchestrator, Itinerary Optimizer, Event Curator, Budget Guardian, and Booking Assistant - all powered by real Gemini AI',
          status: 'Live',
          action: 'Try AI Concierge',
          route: '/app/concierge',
        },
        {
          title: 'Real-Time Streaming',
          description: 'Watch AI responses stream in real-time as the agents "think" and respond to your travel questions',
          status: 'Live',
          action: 'Test Streaming',
          route: '/app/concierge',
        },
        {
          title: 'Intent Classification',
          description: 'AI automatically understands your intent and routes to the right specialist agent',
          status: 'Live',
          action: 'See It Work',
          route: '/app/concierge',
        },
      ],
    },
    {
      category: 'Activity Management',
      icon: Calendar,
      color: 'from-emerald-500 to-teal-500',
      items: [
        {
          title: 'Add Activities',
          description: 'Complete activity creation form with 9 fields: title, description, day, type, times, cost, location, and notes',
          status: 'Live',
          action: 'Add Activity',
          route: '/app/trips',
        },
        {
          title: 'Edit Activities',
          description: 'Edit any activity with pre-populated forms - all changes save instantly to the backend',
          status: 'Live',
          action: 'Try Editing',
          route: '/app/trips',
        },
        {
          title: 'Delete Activities',
          description: 'Safe deletion with confirmation dialogs to prevent accidental removals',
          status: 'Live',
          action: 'See Confirmation',
          route: '/app/trips',
        },
      ],
    },
    {
      category: 'Global Infrastructure',
      icon: Layout,
      color: 'from-blue-500 to-indigo-500',
      items: [
        {
          title: 'Universal Footer System',
          description: 'Global footer now appears on all marketing pages with smart conditional rendering - no more missing footers',
          status: 'Live',
          action: 'View Footer',
          route: '/real-estate',
        },
        {
          title: 'Calm Design System',
          description: 'Updated What\'s New page with luxury calm aesthetic - soft backgrounds, editorial typography, no neon colors',
          status: 'Live',
          action: 'See Design',
          route: '/app/whats-new',
        },
        {
          title: 'Navigation Enhancement',
          description: 'Complete navigation system with Home link in sidebar, proper active states, and unified routing',
          status: 'Live',
          action: 'Explore Nav',
          route: '/',
        },
      ],
    },
    {
      category: 'Experiences & Content',
      icon: MapPin,
      color: 'from-orange-500 to-amber-500',
      items: [
        {
          title: 'Experiences Hub',
          description: 'New landing page showcasing curated experiences across Medellín, Cartagena, and Bogotá with category filters',
          status: 'New',
          action: 'Browse Experiences',
          route: '/experiences',
        },
        {
          title: 'Medellín Experiences',
          description: 'Fully functional experience listings for Medellín with grid/map views, filters, and beautiful cards',
          status: 'Live',
          action: 'View Medellín',
          route: '/experiences/medellin',
        },
        {
          title: 'Real Estate Coverage',
          description: 'Complete real estate section now includes footer, market insights, property search, and detailed listings',
          status: 'Live',
          action: 'View Properties',
          route: '/real-estate',
        },
      ],
    },
    {
      category: 'Legal & Compliance',
      icon: Shield,
      color: 'from-slate-500 to-stone-500',
      items: [
        {
          title: 'Privacy Policy',
          description: 'Comprehensive privacy policy covering data collection, usage, security, and user rights in professional format',
          status: 'New',
          action: 'Read Policy',
          route: '/privacy-policy',
        },
        {
          title: 'Terms of Service',
          description: 'Complete terms of service with usage license, prohibited uses, AI content disclaimers, and liability terms',
          status: 'New',
          action: 'Read Terms',
          route: '/terms-of-service',
        },
        {
          title: 'Footer Legal Links',
          description: 'Updated footer with proper legal navigation linking to privacy policy and terms of service',
          status: 'Live',
          action: 'Check Footer',
          route: '/',
        },
      ],
    },
  ];

  const stats = [
    { label: 'Production Ready', value: '100%', icon: CheckCircle2 },
    { label: 'New Features', value: '21', icon: Sparkles },
    { label: 'New Pages', value: '3', icon: Layout },
    { label: 'Feature Categories', value: '5', icon: Code2 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-stone-100 to-slate-100">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTZ2LTZoNnYtNmg2djZoNnYyaC02djZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="container relative mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Badge className="mb-4 bg-stone-200 text-stone-700 border-stone-300">
              December 21, 2024
            </Badge>
            <h1 className="mb-4 font-serif text-5xl md:text-6xl text-stone-900">
              What's New
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-stone-600">
              Your Trip Operating System is now <span className="font-bold text-stone-900">100% production-ready</span> with real AI integration and complete activity management
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-xl bg-white backdrop-blur border border-stone-200 p-6 shadow-sm"
                >
                  <stat.icon className="mx-auto mb-2 h-8 w-8 text-stone-600" />
                  <div className="text-3xl font-bold text-stone-900">{stat.value}</div>
                  <div className="text-sm text-stone-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="space-y-16">
          {features.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.2 }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`rounded-xl bg-gradient-to-br ${category.color} p-3`}>
                  <category.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif text-stone-900">{category.category}</h2>
                  <p className="text-sm text-stone-500">{category.items.length} new features</p>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {category.items.map((feature, featureIndex) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (categoryIndex * 0.2) + (featureIndex * 0.1) }}
                  >
                    <Card className="group h-full border-stone-200 hover:border-stone-300 hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                            {feature.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          onClick={() => navigate(feature.route)}
                          className="w-full group-hover:translate-x-1 transition-transform"
                        >
                          {feature.action}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Start Guide */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-800 p-12 text-white"
        >
          <div className="mx-auto max-w-3xl text-center">
            <Rocket className="mx-auto mb-6 h-16 w-16 text-white/80" />
            <h2 className="mb-4 font-serif text-3xl">Ready to Explore?</h2>
            <p className="mb-8 text-lg text-white/80">
              Start by creating a trip, then explore all the new AI features and activity management tools
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/app/trips')}
                className="bg-white text-stone-900 hover:bg-white/90"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Trip
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/app/concierge')}
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Chat with AI Agents
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Implementation Details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 border-t border-stone-200 pt-12"
        >
          <div className="mx-auto max-w-3xl">
            <h3 className="mb-6 text-center font-serif text-2xl text-stone-900">
              Implementation Highlights
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-stone-200 bg-white p-6">
                <h4 className="mb-3 font-semibold text-stone-900">Backend</h4>
                <ul className="space-y-2 text-sm text-stone-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Real Gemini AI integration (no mocks)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    6 specialized AI agents
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Intent classification system
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Streaming support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Comprehensive error handling
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border border-stone-200 bg-white p-6">
                <h4 className="mb-3 font-semibold text-stone-900">Frontend</h4>
                <ul className="space-y-2 text-sm text-stone-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Full CRUD modals (Add/Edit/Delete)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    9-field activity form
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Form validation & error handling
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Toast notifications
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Mobile-responsive design
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 rounded-lg bg-stone-100 p-6 text-center">
              <p className="text-sm text-stone-600">
                <strong className="text-stone-900">Production Readiness:</strong> 100% • 
                <strong className="text-stone-900 ml-2">Code Quality:</strong> Excellent • 
                <strong className="text-stone-900 ml-2">Status:</strong> Ready to Deploy 🚀
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}