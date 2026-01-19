/**
 * How It Works - Mobile Layout (≤767px)
 * Simple stacked cards with static screenshots
 * No scroll-driven behavior, no cursor animations
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, Home } from 'lucide-react';
import { CalendarScreen } from './CalendarScreen';

interface StepCardProps {
  step: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

function StepCard({ step, title, description, children }: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Step Header */}
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
          {step}
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
          <p className="text-base text-slate-600 leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Screenshot/Content */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Browser Chrome */}
        <div className="bg-slate-100 px-4 py-3 flex items-center gap-2 border-b border-slate-200">
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="flex-1 ml-3">
            <div className="bg-white rounded-md px-3 py-1 text-xs text-slate-500 max-w-[200px]">
              app.ilovemedellin.com
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-slate-50 p-6">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

export function HowItWorksMobile() {
  return (
    <div className="space-y-16 px-6 py-12">
      
      {/* Step 1 - Discover */}
      <StepCard
        step="01"
        title="Discover"
        description="Tell us your vibe. We surface the best nearby picks."
      >
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-slate-900">Exploring El Poblado</h4>
          
          {/* Search */}
          <div className="bg-white rounded-lg p-3 border border-slate-200">
            <input 
              type="text" 
              placeholder="Search places..." 
              className="w-full text-sm outline-none text-slate-900"
              readOnly
            />
          </div>

          {/* AI Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-start gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-900">Thursday Afternoon</p>
                <p className="text-emerald-700 text-xs">24°C — perfect rooftop coffee</p>
              </div>
            </div>
          </div>

          {/* 2 Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg overflow-hidden border border-emerald-200 shadow-sm">
              <div className="h-20 bg-gradient-to-br from-emerald-100 to-emerald-50" />
              <div className="p-3">
                <p className="font-bold text-sm text-slate-900 mb-1">El Cielo</p>
                <p className="text-xs text-slate-600">⭐ 4.8 · 0.5km</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm">
              <div className="h-20 bg-gradient-to-br from-slate-100 to-slate-50" />
              <div className="p-3">
                <p className="font-bold text-sm text-slate-900 mb-1">Carmen</p>
                <p className="text-xs text-slate-600">⭐ 4.9 · 1.2km</p>
              </div>
            </div>
          </div>
        </div>
      </StepCard>

      {/* Step 2 - Plan */}
      <StepCard
        step="02"
        title="Plan"
        description="AI matches your time and location with what's happening."
      >
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-slate-900">Tonight in Laureles</h4>
          
          {/* Search */}
          <div className="bg-white rounded-lg p-3 border border-slate-200">
            <input 
              type="text" 
              placeholder="Search events..." 
              className="w-full text-sm outline-none text-slate-900"
              readOnly
            />
          </div>

          {/* AI Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-2 text-sm">
              <Calendar className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900">Tonight's Plan</p>
                <p className="text-amber-700 text-xs">Best start: 8:00 PM</p>
              </div>
            </div>
          </div>

          {/* Featured Event */}
          <div className="bg-white rounded-lg p-4 border border-emerald-200 shadow-sm">
            <div className="flex gap-3">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-slate-900 mb-1">Jazz Night @ Alambique</p>
                <p className="text-xs text-slate-600 mb-2">⏰ 8:00 PM · 1.5km</p>
                <span className="inline-block text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-medium">🎯 Best match</span>
              </div>
            </div>
          </div>
        </div>
      </StepCard>

      {/* Step 3 - Stay */}
      <StepCard
        step="03"
        title="Stay"
        description="Find the right neighborhood, not just a listing."
      >
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-slate-900">Stays in Envigado</h4>
          
          {/* Budget Slider */}
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <p className="text-xs text-slate-600 mb-3 font-medium">Budget: $500 — $2000</p>
            <div className="relative h-2 bg-slate-100 rounded-full">
              <div className="absolute top-0 left-0 h-2 w-2/3 bg-emerald-600 rounded-full" />
              <div className="absolute top-1/2 left-2/3 w-4 h-4 bg-emerald-600 rounded-full -translate-y-1/2 -translate-x-1/2 border-2 border-white shadow" />
            </div>
          </div>

          {/* Neighborhood Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-start gap-2 text-sm">
              <Home className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-900">Best for your stay</p>
                <p className="text-emerald-700 text-xs">Envigado is calmer and walkable</p>
              </div>
            </div>
          </div>

          {/* Featured Rental */}
          <div className="bg-white rounded-lg overflow-hidden border border-emerald-200 shadow-sm">
            <div className="h-24 bg-gradient-to-br from-emerald-100 to-emerald-50" />
            <div className="p-4">
              <p className="font-bold text-base text-slate-900 mb-1">Modern Studio</p>
              <p className="text-sm text-slate-600 mb-1">$850/mo · ⭐ 4.9</p>
              <p className="text-xs text-slate-500 mb-2">Fast Wi-Fi · Quiet</p>
              <span className="inline-block text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-medium">🎯 Matches your stay</span>
            </div>
          </div>
        </div>
      </StepCard>

      {/* Step 4 - Itinerary */}
      <StepCard
        step="04"
        title="Itinerary"
        description="Turn picks into a day plan. Approve, save, go."
      >
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-bold text-slate-900">Saturday in Medellín</h4>
            <p className="text-xs text-slate-600">El Poblado → Laureles</p>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 border border-emerald-200 shadow-sm">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-lg flex-shrink-0 flex items-center justify-center text-base">
                  ☕
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Morning</p>
                  <p className="font-bold text-sm text-slate-900">Café Velvet</p>
                  <p className="text-xs text-slate-600">9:00 AM</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-50 rounded-lg flex-shrink-0 flex items-center justify-center text-base">
                  🌳
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Afternoon</p>
                  <p className="font-bold text-sm text-slate-900">Parque Lleras</p>
                  <p className="text-xs text-slate-600">2:00 PM</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 border border-emerald-200 shadow-sm">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-lg flex-shrink-0 flex items-center justify-center text-base">
                  🎵
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Night</p>
                  <p className="font-bold text-sm text-slate-900">Jazz Night</p>
                  <p className="text-xs text-slate-600">8:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Suggestion */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-amber-600 flex-shrink-0" />
              <p className="text-xs text-amber-900">
                <span className="font-semibold">AI:</span> Save 18 min by swapping dinner
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <button className="w-full bg-emerald-600 text-white rounded-lg py-3 text-sm font-bold hover:bg-emerald-700 transition-colors shadow-md">
            Approve Plan
          </button>
        </div>
      </StepCard>

    </div>
  );
}