/**
 * BOTTOM NAVIGATION
 * 
 * Mobile-optimized bottom navigation bar
 * Persistent across V2 routes
 */

import { useNavigate, useLocation } from 'react-router';
import { Home, Map, Sparkles, User } from 'lucide-react';
import { useAIV2 } from '../../context/AIV2Context';
import { motion } from 'motion/react';

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { togglePanel } = useAIV2();
  
  // Only show on V2 routes and on mobile
  const isV2Route = location.pathname.startsWith('/v2');
  
  if (!isV2Route) return null;
  
  const navItems = [
    {
      id: 'trips',
      label: 'Trips',
      icon: Home,
      onClick: () => navigate('/v2/trips'),
      isActive: location.pathname === '/v2/trips',
    },
    {
      id: 'itinerary',
      label: 'Itinerary',
      icon: Map,
      onClick: () => {
        // Navigate to current trip's itinerary if available
        // For now, just show a placeholder
        const pathParts = location.pathname.split('/');
        if (pathParts.length >= 4 && pathParts[2] === 'trips') {
          const tripId = pathParts[3];
          navigate(`/v2/trips/${tripId}/itinerary`);
        }
      },
      isActive: location.pathname.includes('/itinerary'),
    },
    {
      id: 'ai',
      label: 'AI',
      icon: Sparkles,
      onClick: togglePanel,
      isActive: false,
      highlight: true,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      onClick: () => {
        // Placeholder for profile
        console.log('Profile clicked');
      },
      isActive: location.pathname.includes('/profile'),
    },
  ];
  
  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-neutral-200 safe-area-inset-bottom"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive;
          
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className="flex flex-col items-center justify-center flex-1 h-full relative"
            >
              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  item.highlight
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600'
                    : isActive
                    ? 'bg-neutral-900'
                    : 'bg-transparent hover:bg-neutral-100'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    item.highlight || isActive ? 'text-white' : 'text-neutral-600'
                  }`}
                />
              </div>
              
              {/* Label */}
              <span
                className={`text-xs mt-1 ${
                  item.highlight
                    ? 'font-medium text-blue-600'
                    : isActive
                    ? 'font-medium text-neutral-900'
                    : 'text-neutral-600'
                }`}
              >
                {item.label}
              </span>
              
              {/* Active indicator */}
              {isActive && !item.highlight && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-neutral-900 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}