import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Sparkles, MapPin, Brain, Clock } from 'lucide-react';

/**
 * Landing Page
 * Marketing page with hero, value props, and CTAs
 * Production-ready with responsive design
 */
export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-blue-600" />
              <span className="text-xl text-gray-900">Local Scout</span>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">
                  Start Planning
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
            <Brain className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800">AI-Powered Trip Planning</span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-gray-900">
            Plan Your Perfect Trip in Minutes, Not Hours
          </h1>

          {/* Subheadline */}
          <p className="mb-8 text-xl text-gray-600 max-w-2xl mx-auto">
            Your personal AI concierge finds the best restaurants, optimizes your schedule, and books everything — saving you 75% of planning time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button variant="primary" size="lg" fullWidth>
                Create Your First Trip
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Watch Demo (2 min)
            </Button>
          </div>

          {/* Social Proof */}
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              {/* Avatar Stack */}
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white" />
                <div className="w-8 h-8 rounded-full bg-amber-200 border-2 border-white" />
                <div className="w-8 h-8 rounded-full bg-green-200 border-2 border-white" />
                <div className="w-8 h-8 rounded-full bg-purple-200 border-2 border-white" />
              </div>
              <span>10,000+ travelers</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-amber-500">★★★★★</span>
              <span>4.8 from 2,000+ reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Prop 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="mb-3 text-gray-900">Save 90 Minutes Every Day</h3>
            <p className="text-gray-600">
              Our AI optimizer eliminates scheduling conflicts and finds the fastest routes between activities.
            </p>
          </div>

          {/* Prop 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="mb-3 text-gray-900">Discover Hidden Gems</h3>
            <p className="text-gray-600">
              Skip tourist traps. Get personalized recommendations from locals and recent travelers.
            </p>
          </div>

          {/* Prop 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="mb-3 text-gray-900">Auto-Book Best Deals</h3>
            <p className="text-gray-600">
              Monitor prices 24/7 and automatically book when prices drop — you save $47 on average.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center mb-12 text-gray-900">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                1
              </div>
              <h3 className="mb-2 text-gray-900">Tell Us Your Destination</h3>
              <p className="text-gray-600">
                Where, when, and who's traveling. Takes 30 seconds.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                2
              </div>
              <h3 className="mb-2 text-gray-900">AI Builds Your Itinerary</h3>
              <p className="text-gray-600">
                Get personalized picks for dining, activities, and events in seconds.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                3
              </div>
              <h3 className="mb-2 text-gray-900">Relax & Enjoy</h3>
              <p className="text-gray-600">
                We optimize, book, and remind you. Just show up and have fun.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="mb-4 text-gray-900">
          Ready to Plan Smarter?
        </h2>
        <p className="mb-8 text-xl text-gray-600">
          Join 10,000+ travelers who've saved 75% of their planning time.
        </p>
        <Link to="/signup">
          <Button variant="primary" size="lg">
            Start Planning for Free
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="mb-3 text-gray-900">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Features</a></li>
                <li><a href="#" className="hover:text-blue-600">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-600">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-gray-900">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600">About</a></li>
                <li><a href="#" className="hover:text-blue-600">Blog</a></li>
                <li><a href="#" className="hover:text-blue-600">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-gray-900">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact</a></li>
                <li><a href="#" className="hover:text-blue-600">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-gray-900">Legal</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-600">Terms</a></li>
                <li><a href="#" className="hover:text-blue-600">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500">
            <p>&copy; 2025 Local Scout. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}