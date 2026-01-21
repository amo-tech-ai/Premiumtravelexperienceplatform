/**
 * AI Features Section - Minimal Color Palette
 * Colors: Emerald (primary), Amber (accent), Slate (neutral) ONLY
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Star, 
  Sparkles, 
  Heart,
  Calendar,
  Map,
  ThumbsUp,
  Wand2,
  MessageSquare,
  Users,
  TrendingUp,
  Plus,
  MoreVertical,
  Check,
  Send,
  Image as ImageIcon
} from 'lucide-react';

export function AIFeaturesSection() {
  return (
    <section className="relative py-24 px-6 bg-[#F7F7F5] overflow-hidden">
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-2 leading-tight">
            Everything you need
          </h2>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
            for your next adventure
          </h2>
        </motion.div>

        {/* Feature Grid */}
        <div className="space-y-16">
          
          {/* Feature 1 - Photos, Maps & Reviews (Large, Centered) */}
          <motion.div
            className="bg-white rounded-3xl p-12 shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Text */}
              <div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">
                  Photos, maps + reviews
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Discover restaurants, stays, and experiences. With vibrant photos, interactive maps and reviews, you'll feel like you've already been there.
                </p>
              </div>

              {/* UI Mockup */}
              <div className="relative">
                {/* Map Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
                  <div className="relative h-64 bg-slate-200">
                    <img
                      src="https://images.unsplash.com/photo-1694953592902-46d9b0d0c19d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXAlMjBsb2NhdGlvbiUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzY4OTc4NzA5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Map"
                      className="w-full h-full object-cover opacity-90"
                    />
                    {/* Heart Icon */}
                    <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center">
                      <Heart className="w-5 h-5 text-slate-400" />
                    </div>
                    {/* Map Pins */}
                    <div className="absolute top-1/3 left-1/3">
                      <MapPin className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                    </div>
                    <div className="absolute top-1/2 left-1/2">
                      <MapPin className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                    </div>
                  </div>
                  
                  {/* Review Card */}
                  <div className="p-4">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-slate-700">Reviews</span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs text-slate-600">Pros</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Map className="w-4 h-4 text-slate-500" />
                            <span className="text-xs text-slate-600">Map</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-slate-900">4.9</div>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        </div>
                        <div className="text-xs text-slate-500 mt-1">4,329 reviews</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Small Image Card (Floating) */}
                <div className="absolute -top-6 -right-6 w-40 h-32 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                  <div className="relative h-full bg-slate-200 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-slate-400" />
                  </div>
                </div>

                {/* Small Map Icon (Floating) */}
                <div className="absolute -bottom-4 -right-4 w-32 h-24 bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
                  <div className="h-full bg-emerald-50 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-emerald-700" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2-Column Grid for Features 2 & 3 */}
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Feature 2 - Tailored Recommendations */}
            <motion.div
              className="bg-white rounded-3xl p-10 shadow-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Tailored recommendations
              </h3>
              <p className="text-base text-slate-600 leading-relaxed mb-8">
                From the best restaurants in your town to the best beaches around the world, we've got you covered. Explore the recommendations you like and add them to your trip plan.
              </p>

              {/* UI Mockup - Recommendation Cards */}
              <div className="space-y-3">
                {/* Card 1 - Location */}
                <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                      <span className="text-xs font-bold text-emerald-700 truncate">Tropical Beach</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 truncate">Paradise Cove</p>
                  </div>
                </div>

                {/* Card 2 - User Content */}
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex-shrink-0 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">JJ</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">Josh Jones</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="aspect-square rounded-lg bg-slate-200" />
                    <div className="aspect-square rounded-lg bg-slate-200" />
                    <div className="aspect-square rounded-lg bg-slate-200" />
                  </div>
                </div>

                {/* Card 3 - Categories */}
                <div className="bg-slate-50 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-12 rounded-lg bg-slate-200 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-900">Seafood</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-12 rounded-lg bg-slate-200 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <p className="text-xs font-bold text-emerald-700">The Solo Wanderer</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 3 - Customizable Trip Plans */}
            <motion.div
              className="bg-white rounded-3xl p-10 shadow-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Customizable trip plans
              </h3>
              <p className="text-base text-slate-600 leading-relaxed mb-8">
                In seconds, we'll create customizable itineraries for anywhere you've to go. Include specifics for your requests, so we can personalize your plans for you.
              </p>

              {/* UI Mockup - Trip Plan */}
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-bold text-slate-900">Trip to Portugal</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white -ml-2" />
                    <div className="w-6 h-6 rounded-full bg-slate-400 border-2 border-white -ml-2" />
                  </div>
                </div>

                {/* Itinerary Card */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Itinerary</div>
                  
                  {/* Day 1 */}
                  <div className="mb-4">
                    <div className="text-xs font-bold text-slate-900 mb-2">Day 1</div>
                    <div className="bg-white rounded-lg p-3 flex items-center gap-3 shadow-sm">
                      <div className="w-10 h-10 rounded-lg bg-slate-200 flex-shrink-0 flex items-center justify-center">
                        <span className="text-lg">🏖️</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span className="text-xs font-bold text-slate-900 truncate">Costa List</span>
                        </div>
                        <p className="text-xs text-slate-600 truncate">to 60 km</p>
                      </div>
                      <MoreVertical className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Belem Tower */}
                  <div className="bg-white rounded-lg p-3 flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-900 truncate">Belem Tower</span>
                      </div>
                      <p className="text-xs text-slate-600 truncate">to 30 km</p>
                    </div>
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Add to Trip Button */}
                <button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  Add to trip
                </button>
              </div>
            </motion.div>
          </div>

          {/* 2-Column Grid for Features 4 & 5 */}
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Feature 4 - Collaboration Tools */}
            <motion.div
              className="bg-white rounded-3xl p-10 shadow-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Collaboration tools
              </h3>
              <p className="text-base text-slate-600 leading-relaxed mb-8">
                Get your friends and family in on the trip-planning action! They can add to their new cards by adding comments or share things up with their own edits to the itinerary.
              </p>

              {/* UI Mockup - Collaboration */}
              <div className="bg-slate-50 rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-bold text-slate-900">Trip to Portugal</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white -ml-2" />
                    <div className="w-6 h-6 rounded-full bg-slate-400 border-2 border-white -ml-2" />
                    <div className="w-6 h-6 rounded-full bg-amber-500 border-2 border-white -ml-2" />
                  </div>
                </div>

                {/* Itinerary Item */}
                <div className="bg-white rounded-lg p-3 mb-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-200 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-900 truncate">Costa List</span>
                      </div>
                      <p className="text-xs text-slate-600">to San Jordi (5)</p>
                    </div>
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Comments */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-300 flex-shrink-0 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">M</span>
                    </div>
                    <div className="flex-1 bg-white rounded-lg p-2 shadow-sm">
                      <p className="text-xs text-slate-900"><span className="font-bold">Wow,</span> this hotel looks amazing!!</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-400 flex-shrink-0 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">J</span>
                    </div>
                    <div className="flex-1 bg-white rounded-lg p-2 shadow-sm">
                      <p className="text-xs text-slate-900">Yes, please</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 flex-shrink-0 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">A</span>
                    </div>
                    <div className="flex-1 bg-white rounded-lg p-2 border border-slate-200">
                      <p className="text-xs text-slate-400">Add a comment...</p>
                    </div>
                    <button className="w-6 h-6 flex items-center justify-center text-emerald-600">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 5 - Popular Itineraries */}
            <motion.div
              className="bg-white rounded-3xl p-10 shadow-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Popular itineraries
              </h3>
              <p className="text-base text-slate-600 leading-relaxed mb-8">
                Visit our <span className="text-emerald-700 font-bold">inspiration page</span> to get ideas and inspiration from other travelers. Add their suggestions to a new trip plan and customize it to make it your own.
              </p>

              {/* UI Mockup - Popular Itinerary */}
              <div className="bg-slate-50 rounded-xl overflow-hidden">
                {/* Hero Image */}
                <div className="relative h-48 bg-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1561330997-8fa103dd1c5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXJhdGVkJTIwdHJhdmVsJTIwZXhwZXJpZW5jZXN8ZW58MXx8fHwxNzY4OTc4NzEwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Itinerary"
                    className="w-full h-full object-cover opacity-90"
                  />
                  {/* Floating Icons */}
                  <div className="absolute top-3 left-3">
                    <div className="w-8 h-8 bg-white/95 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md">
                      <Heart className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="w-8 h-8 bg-white/95 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    </div>
                  </div>

                  {/* Small Preview Card */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white rounded-lg shadow-lg p-2 flex items-center gap-2">
                    <div className="w-12 h-12 rounded-lg bg-slate-200 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">Explore SF, California</p>
                      <div className="flex gap-1 mt-1">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                        <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-colors mb-2">
                    <Plus className="w-4 h-4" />
                    Customize a trip
                  </button>
                  <button className="w-full text-slate-600 hover:text-slate-900 rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                    <Heart className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
