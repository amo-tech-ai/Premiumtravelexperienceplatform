/**
 * Animation Configuration
 * All timing, positions, and easing curves for the Discover animation
 */

export const timing = {
  // Cursor movement speeds
  cursorMove: 300, // ms pause between actions
  cursorSpeed: 400, // ms for movement duration
  hoverDelay: 200, // ms before hover effect triggers
  clickDuration: 100, // ms for click visual feedback
  
  // Effect durations
  fadeDuration: 300, // ms for fade in/out
  pulseDuration: 800, // ms for pulse animations
  typingSpeed: 150, // ms between typed letters
  
  // Total loop time
  totalLoop: 12000, // 12 seconds
};

export const easing = {
  cursor: [0.4, 0, 0.2, 1] as [number, number, number, number], // ease-in-out
  hover: [0, 0, 0.2, 1] as [number, number, number, number], // ease-out
  click: [0.4, 0, 1, 1] as [number, number, number, number], // ease-in
  smooth: [0.65, 0, 0.35, 1] as [number, number, number, number], // custom smooth
};

// Animation sequence timeline (in milliseconds)
export const animationSequence = {
  location: { start: 0, duration: 2000 },
  search: { start: 2000, duration: 2000 },
  filter: { start: 4000, duration: 1500 },
  result: { start: 5500, duration: 1500 },
  map: { start: 7000, duration: 1900 },
  insight: { start: 8900, duration: 1500 },
  reset: { start: 10400, duration: 1600 },
  total: 12000,
};

// Cursor positions (x, y coordinates in pixels relative to slide container)
// These will be calculated dynamically based on element positions
export const cursorPositions = {
  start: { x: -50, y: -50 }, // Off-screen start
  location: { x: 80, y: 45 }, // Location selector
  search: { x: 200, y: 95 }, // Search bar
  filterTrips: { x: 90, y: 145 }, // Trips filter chip
  firstCard: { x: 150, y: 280 }, // First result card
  mapLabel: { x: 480, y: 300 }, // El Poblado on map
  insight: { x: 150, y: 175 }, // AI insight banner
  end: { x: -50, y: -50 }, // Off-screen end
};

// Search typing animation
export const searchText = 'coffee';
export const searchTypingSteps = [
  { text: 'c', delay: 0 },
  { text: 'co', delay: 150 },
  { text: 'cof', delay: 300 },
  { text: 'coff', delay: 450 },
  { text: 'coffe', delay: 600 },
  { text: 'coffee', delay: 750 },
];

// Visual effect states
export const highlightStates = {
  location: {
    default: 'bg-white',
    hover: 'bg-emerald-50',
    active: 'bg-emerald-100',
  },
  search: {
    default: 'border-slate-200',
    focus: 'border-emerald-500 ring-2 ring-emerald-500/20',
  },
  chip: {
    inactive: 'bg-slate-100 text-slate-700',
    hover: 'bg-slate-200 text-slate-700',
    active: 'bg-emerald-700 text-white',
  },
  card: {
    default: 'shadow-none',
    hover: 'shadow-md -translate-y-0.5',
  },
  mapLabel: {
    default: 'border-slate-200',
    active: 'border-emerald-400 scale-105',
  },
  insight: {
    default: 'bg-emerald-50 border-emerald-200',
    highlight: 'bg-emerald-100 border-emerald-400',
  },
};

// Colors for glows and effects
export const colors = {
  cursorOutline: 'rgba(0, 0, 0, 0.8)',
  cursorFill: 'rgba(255, 255, 255, 1)',
  cursorShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  highlightGlow: 'rgba(16, 185, 129, 0.2)', // emerald-500/20
  activeGlow: 'rgba(16, 185, 129, 0.3)', // emerald-500/30
};
