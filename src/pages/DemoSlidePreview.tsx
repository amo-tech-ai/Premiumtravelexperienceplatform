/**
 * Demo Slide Preview Page
 * Shows the DiscoverSlide component with animated cursor guide
 */

import React, { useState } from 'react';
import { DiscoverSlide } from '../components/demo-slides/DiscoverSlide';
import { DiscoverSlideAnimated } from '../components/demo-slides/DiscoverSlideAnimated';
import { useNavigate } from 'react-router';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function DemoSlidePreview() {
  const navigate = useNavigate();
  const [showAnimated, setShowAnimated] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-12 px-6">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/home-v3')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home V3
        </Button>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            How It Works: Discover Screen
          </h1>
          <p className="text-slate-600 mb-4">
            {showAnimated 
              ? 'Guided cursor animation shows discovery flow' 
              : 'Static demo slide for homepage'}
          </p>
          
          {/* Toggle Button */}
          <Button
            variant="outline"
            onClick={() => setShowAnimated(!showAnimated)}
            className="gap-2"
          >
            {showAnimated ? (
              <>
                <Pause className="w-4 h-4" />
                Show Static Version
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Show Animated Version
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Demo Slide Container */}
      <div className="max-w-6xl mx-auto">
        {showAnimated ? <DiscoverSlideAnimated /> : <DiscoverSlide />}
      </div>

      {/* Notes */}
      <div className="max-w-6xl mx-auto mt-8 bg-white rounded-xl p-6 shadow-lg">
        <h3 className="font-bold text-slate-900 mb-3">
          {showAnimated ? 'Animation Features' : 'Design Notes'}
        </h3>
        {showAnimated ? (
          <ul className="space-y-2 text-sm text-slate-600">
            <li>✓ Guided cursor animation (~12 second loop)</li>
            <li>✓ Step 1: Location selection with pulse effect</li>
            <li>✓ Step 2: Search bar with typing animation ("coffee")</li>
            <li>✓ Step 3: Filter chip selection (Trips)</li>
            <li>✓ Step 4: Card hover with star pulse</li>
            <li>✓ Step 5: Map interaction with zoom effect</li>
            <li>✓ Step 6: AI insight highlight</li>
            <li>✓ Respects prefers-reduced-motion setting</li>
            <li>✓ Smooth, calm transitions - no jarring movements</li>
          </ul>
        ) : (
          <ul className="space-y-2 text-sm text-slate-600">
            <li>✓ Fixed viewport (600px height) - no scrolling needed</li>
            <li>✓ Everything fits on screen - no cut-off content</li>
            <li>✓ Left side: Discovery interface with 4 content cards</li>
            <li>✓ Right side: Map preview with pins and controls</li>
            <li>✓ AI insights highlighted in emerald/amber</li>
            <li>✓ Clean, premium design with soft shadows</li>
            <li>✓ At a glance: "I can discover great places near me"</li>
          </ul>
        )}
      </div>

    </div>
  );
}