/**
 * Quick Access Menu
 * Floating menu for quick navigation to all features
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  Sparkles,
  Map,
  Calendar,
  Compass,
  Brain,
  Building2,
  Eye,
  Zap,
} from 'lucide-react';

export const QuickAccessMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const quickLinks = [
    {
      label: 'Feature Gallery',
      path: '/features',
      icon: <Eye className="w-5 h-5" />,
      color: 'from-emerald-500 to-blue-500',
      description: 'See all features',
    },
    {
      label: 'AI Demo',
      path: '/ai-demo',
      icon: <Sparkles className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500',
      description: 'Advanced AI features',
    },
    {
      label: 'AI Concierge',
      path: '/concierge',
      icon: <Brain className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
      description: '6 AI agents',
    },
    {
      label: 'Trip Planner',
      path: '/trip/sample-trip-123',
      icon: <Calendar className="w-5 h-5" />,
      color: 'from-emerald-500 to-teal-500',
      description: 'Luxury itinerary',
    },
    {
      label: 'Explore',
      path: '/explore',
      icon: <Compass className="w-5 h-5" />,
      color: 'from-amber-500 to-orange-500',
      description: 'Discover places',
    },
    {
      label: 'Interactive Map',
      path: '/map',
      icon: <Map className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500',
      description: 'Explore on map',
    },
    {
      label: 'Real Estate',
      path: '/real-estate',
      icon: <Building2 className="w-5 h-5" />,
      color: 'from-rose-500 to-red-500',
      description: 'Property investment',
    },
    {
      label: 'Production Status',
      path: '/status',
      icon: <Zap className="w-5 h-5" />,
      color: 'from-slate-500 to-slate-700',
      description: 'System health',
    },
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6 group-hover:rotate-90 transition-transform" />
        )}
      </motion.button>

      {/* Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border-2 border-slate-200 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-4 text-white">
                <h3 className="font-bold text-lg">Quick Access</h3>
                <p className="text-sm text-emerald-50">Navigate to any feature</p>
              </div>

              {/* Links */}
              <div className="p-2 max-h-[60vh] overflow-y-auto">
                {quickLinks.map((link, idx) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block group"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all"
                    >
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${link.color} rounded-lg flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform`}
                      >
                        {link.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          {link.label}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {link.description}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
                <p className="text-xs text-slate-600">
                  {quickLinks.length} features available
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuickAccessMenu;
