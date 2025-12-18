import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold text-white tracking-wide">
                MEDELLÍN <span className="text-amber-400">AI</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Your intelligent concierge for dining, events, and luxury stays. Curated by local experts, powered by AI.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Discover Column */}
          <div>
            <h3 className="text-amber-400 font-bold text-sm tracking-widest uppercase mb-6">Discover</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/map" className="hover:text-white transition-colors">Map Explorer</Link></li>
              <li><Link to="/concierge" className="hover:text-white transition-colors">AI Concierge</Link></li>
              <li><Link to="/experiences/medellin" className="hover:text-white transition-colors">Events & Dining</Link></li>
              <li><Link to="/real-estate" className="hover:text-white transition-colors">Real Estate & Stays</Link></li>
              <li><Link to="/itinerary" className="hover:text-white transition-colors">Plan a Trip</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-amber-400 font-bold text-sm tracking-widest uppercase mb-6">Company</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">How it Works</Link></li>
              <li><Link to="/concierge" className="hover:text-white transition-colors">Contact Concierge</Link></li>
              <li><Link to="/style-guide" className="hover:text-white transition-colors">Design System</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/legal" className="hover:text-white transition-colors">Legal & Privacy</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="text-amber-400 font-bold text-sm tracking-widest uppercase mb-6">Newsletter</h3>
            <p className="text-slate-400 text-sm mb-4">
              Subscribe for weekly curated picks and hidden gems.
            </p>
            <div className="space-y-3">
              <Input 
                type="email" 
                placeholder="Email address" 
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-amber-400/50 rounded-xl"
              />
              <Button className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-xl">
                Subscribe
              </Button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2025 Medellín AI Concierge. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
