# How It Works — Discover Screen Animation Plan

**Last Updated:** January 21, 2026  
**Status:** Planning Phase  
**Component:** `/components/demo-slides/DiscoverSlide.tsx`

---

## Overview

A **guided cursor animation** that teaches users how discovery works on the I Love Medellín platform. The animation runs as a single, smooth loop showing a natural user journey through the interface.

### Design Principles
- **Calm**: Slow, intentional movements
- **Intuitive**: Feels like a real user exploring
- **Educational**: Shows functionality without text
- **Accessible**: Respects `prefers-reduced-motion`

---

## Animation Sequence (8–12 seconds total)

### **Step 1 — Location Selection** (0–2s)
```
Action: Cursor moves to location selector
Element: "El Poblado ▼"
Duration: 500ms move + 300ms pause
Effect: Subtle pulse highlight on hover
```

**Motion:**
- Cursor eases from off-screen (top-left) to location header
- Gentle ease-in-out curve
- Location selector pulses once (scale 1 → 1.05 → 1)
- Soft emerald glow appears

**Visual Feedback:**
- Background: `bg-emerald-50` → `bg-emerald-100`
- Border pulse
- 300ms hold before next action

---

### **Step 2 — Search Input** (2–4s)
```
Action: Cursor moves to search bar, types "coffee"
Element: Search input field
Duration: 800ms move + 1200ms typing
Effect: Search bar glow, auto-typed text
```

**Motion:**
- Cursor smoothly moves to search bar
- Click animation (cursor scales 0.95 for 100ms)
- Search bar border glows: `ring-2 ring-emerald-500/20`
- Text appears letter-by-letter:
  - "c" → "co" → "cof" → "coff" → "coffe" → "coffee"
  - 150ms delay between letters
- Blinking cursor after text

**Visual Feedback:**
- Search icon color shifts: `text-slate-400` → `text-emerald-600`
- Placeholder fades out
- Input border brightens

---

### **Step 3 — Filter Selection** (4–6s)
```
Action: Cursor clicks "Trips" filter chip
Element: Category chip button
Duration: 600ms move + 400ms click + 500ms result update
Effect: Chip highlight, results fade-in
```

**Motion:**
- Cursor moves to "Trips" chip
- Hover state appears (slight scale 1.02)
- Click animation
- Chip transitions:
  - Background: `bg-slate-100` → `bg-emerald-700`
  - Text: `text-slate-700` → `text-white`
  - Scale pulse: 1 → 0.98 → 1

**Result Update:**
- Current cards fade to 70% opacity (200ms)
- New cards fade in from 0% → 100% (300ms)
- Stagger: 50ms between cards
- Section title updates: "Restaurants" → "Trips"

---

### **Step 4 — Result Hover** (6–8s)
```
Action: Cursor hovers first result card
Element: "El Cielo Restaurant" card
Duration: 700ms move + 800ms hover hold
Effect: Card lift, rating star pulse
```

**Motion:**
- Cursor moves to first card (top-left of card)
- Card hover effect:
  - Shadow increases: `shadow-md` → `shadow-lg`
  - Lift: `translateY(0)` → `translateY(-2px)`
  - Border brightens: `border-slate-200` → `border-emerald-200`
- Rating star pulses:
  - Scale: 1 → 1.15 → 1
  - Glow appears briefly
- AI note background pulses: `bg-amber-50` → `bg-amber-100`

**Visual Feedback:**
- Smooth transition (300ms ease-out)
- Cursor stays centered on card
- Hold for 500ms before moving on

---

### **Step 5 — Map Interaction** (8–10s)
```
Action: Cursor moves to map, clicks neighborhood
Element: "El Poblado" map label
Duration: 800ms move + 600ms zoom + 500ms glow
Effect: Map zoom, area highlight
```

**Motion:**
- Cursor smoothly moves to right column (map)
- Hovers over "El Poblado" label
- Label highlights:
  - Border: `border-slate-200` → `border-emerald-400`
  - Shadow increases
  - Scale: 1 → 1.05
- Click animation
- Map zoom effect:
  - Scale entire map: 1 → 1.08 (from center)
  - Blur edges slightly (vignette effect)
  - Duration: 600ms ease-in-out
- Area glow:
  - Emerald radial gradient appears around El Poblado
  - Opacity: 0 → 0.3 → 0.2 (pulse)
  - Soft blur filter

**Visual Feedback:**
- Other map labels fade to 50% opacity
- El Poblado label stays prominent
- Soft pulse animation on label (2 cycles)

---

### **Step 6 — AI Insight Highlight** (10–12s)
```
Action: AI context banner briefly highlights
Element: "Thursday Afternoon · 24°C · Perfect for..."
Duration: 1000ms highlight + 500ms fade
Effect: Gentle glow, scale pulse
```

**Motion:**
- No cursor movement (cursor stays on map or fades out)
- AI banner pulses:
  - Background: `bg-emerald-50` → `bg-emerald-100` → `bg-emerald-50`
  - Border: `border-emerald-200` → `border-emerald-400` → `border-emerald-200`
  - Scale: 1 → 1.02 → 1
  - Duration: 800ms total
- Sparkle icon animates:
  - Rotate: 0° → 360°
  - Scale pulse: 1 → 1.2 → 1
  - Glow effect

**Visual Feedback:**
- Soft emerald glow around banner
- Text briefly bolds
- Hold highlighted state for 400ms

---

### **Step 7 — Reset/Loop** (12s)
```
Action: Fade out and reset to beginning
Duration: 500ms fade + 1000ms pause
Effect: Smooth loop restart
```

**Motion:**
- Cursor fades out (opacity 1 → 0, 300ms)
- All highlights fade to default state (500ms)
- Cards return to neutral
- Map zooms back to default (500ms)
- 1000ms pause before loop restarts

---

## Technical Implementation

### **Cursor Component**
```tsx
<div className="cursor-pointer">
  {/* Custom cursor SVG */}
  <svg viewBox="0 0 24 24">
    <path d="M3 3l18 9-8 2-2 8z" />
  </svg>
  {/* Soft shadow */}
  <div className="shadow-lg" />
</div>
```

**Cursor Styles:**
- Size: 20×20px
- Color: White with dark outline
- Shadow: `0 4px 12px rgba(0,0,0,0.15)`
- Pointer: SVG arrow shape
- Smooth transitions: `transition-all duration-300 ease-in-out`

---

### **Animation Timing**
```typescript
const animationSequence = {
  location: { start: 0, duration: 2000 },
  search: { start: 2000, duration: 2000 },
  filter: { start: 4000, duration: 1500 },
  result: { start: 5500, duration: 1500 },
  map: { start: 7000, duration: 1900 },
  insight: { start: 8900, duration: 1500 },
  reset: { start: 10400, duration: 1500 },
  total: 11900 // ~12 seconds
};
```

---

### **Motion Library**
Use `motion/react` (formerly Framer Motion):

```tsx
import { motion } from 'motion/react';

// Cursor animation
<motion.div
  className="cursor-pointer"
  animate={{
    x: cursorPosition.x,
    y: cursorPosition.y,
    scale: isClicking ? 0.95 : 1
  }}
  transition={{
    duration: 0.4,
    ease: "easeInOut"
  }}
/>
```

---

### **Accessibility**
```tsx
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Disable animation if reduced motion
{!prefersReducedMotion && <CursorAnimation />}
```

**Fallback:**
- Show static screen with key features highlighted
- No cursor, no motion
- Clear visual indicators only

---

## Visual States

### **Default State**
- All elements in neutral position
- No highlights or glows
- Cursor hidden or off-screen

### **Active State (per step)**
Each element has 3 states:
1. **Inactive**: Default appearance
2. **Hover**: Cursor approaching/hovering
3. **Active**: Clicked/selected

**Example — Category Chip:**
```css
/* Inactive */
bg-slate-100 text-slate-700

/* Hover */
bg-slate-200 scale-102

/* Active */
bg-emerald-700 text-white scale-100
```

---

## Performance Considerations

### **Optimization**
- Use `transform` and `opacity` only (GPU-accelerated)
- Avoid `width`, `height`, `top`, `left` animations
- Use `will-change` sparingly
- Limit simultaneous animations to 3–4 elements

### **Hardware Acceleration**
```css
.animated-element {
  transform: translateZ(0);
  will-change: transform, opacity;
}
```

### **Loop Management**
- Use `requestAnimationFrame` for smooth 60fps
- Cleanup on component unmount
- Pause when tab is inactive
- Debounce on window resize

---

## Design Tokens

### **Timing**
```typescript
const timing = {
  cursorMove: 300, // ms between actions
  cursorSpeed: 400, // ms for movement
  hoverDelay: 200, // ms before hover effect
  clickDuration: 100, // ms for click visual
  fadeDuration: 300, // ms for fade effects
  pulseDuration: 800, // ms for pulse animations
};
```

### **Easing**
```typescript
const easing = {
  cursor: 'cubic-bezier(0.4, 0, 0.2, 1)', // ease-in-out
  hover: 'cubic-bezier(0, 0, 0.2, 1)', // ease-out
  click: 'cubic-bezier(0.4, 0, 1, 1)', // ease-in
  smooth: 'cubic-bezier(0.65, 0, 0.35, 1)', // custom smooth
};
```

### **Colors**
```typescript
const colors = {
  cursorOutline: 'rgba(0, 0, 0, 0.8)',
  cursorFill: 'rgba(255, 255, 255, 1)',
  cursorShadow: 'rgba(0, 0, 0, 0.15)',
  highlightGlow: 'rgba(16, 185, 129, 0.2)', // emerald-500/20
  activeGlow: 'rgba(16, 185, 129, 0.3)', // emerald-500/30
};
```

---

## Testing Checklist

### **Visual Testing**
- [ ] Cursor moves smoothly between all targets
- [ ] No jittery movements or jumps
- [ ] Hover states trigger at correct times
- [ ] Highlights are visible but not overwhelming
- [ ] Colors match brand (emerald, amber, slate)
- [ ] Loop restarts smoothly without flash

### **Performance Testing**
- [ ] Maintains 60fps throughout
- [ ] No layout shifts during animation
- [ ] CPU usage stays reasonable (<20%)
- [ ] Works on mobile devices (if enabled)
- [ ] No memory leaks after multiple loops

### **Accessibility Testing**
- [ ] Respects `prefers-reduced-motion`
- [ ] Static fallback displays correctly
- [ ] Screen readers announce purpose
- [ ] Can be paused/stopped by user
- [ ] Keyboard navigation still works

### **Cross-Browser Testing**
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS, iOS)
- [ ] Performance mode on low-end devices

---

## Implementation Priority

### **Phase 1: Core Structure** (30 min)
- [ ] Set up animation component
- [ ] Create cursor SVG component
- [ ] Position cursor off-screen initially
- [ ] Add basic motion library setup

### **Phase 2: Cursor Movement** (45 min)
- [ ] Implement cursor position keyframes
- [ ] Add smooth easing between positions
- [ ] Add click animation state
- [ ] Test cursor paths

### **Phase 3: Element Interactions** (60 min)
- [ ] Location selector hover/pulse
- [ ] Search bar typing effect
- [ ] Filter chip selection animation
- [ ] Card hover lift effect
- [ ] Map zoom and highlight

### **Phase 4: Polish** (30 min)
- [ ] AI insight highlight
- [ ] Loop reset and restart
- [ ] Timing refinement
- [ ] Visual polish (glows, shadows)

### **Phase 5: Accessibility** (20 min)
- [ ] Add reduced motion check
- [ ] Create static fallback
- [ ] Add ARIA labels
- [ ] Test keyboard navigation

### **Phase 6: Optimization** (15 min)
- [ ] Performance profiling
- [ ] GPU optimization
- [ ] Cleanup and code review

**Total Estimated Time:** ~3 hours

---

## Code Structure

```
/components
  /demo-slides
    /DiscoverSlide.tsx (existing - static version)
    /DiscoverSlideAnimated.tsx (new - animated version)
    /components
      /AnimatedCursor.tsx
      /AnimationController.tsx
    /hooks
      /useAnimationSequence.ts
      /useReducedMotion.ts
    /config
      /animationConfig.ts
```

---

## Next Steps

1. **Review this plan** with team
2. **Create AnimatedCursor component** (reusable)
3. **Build AnimationController hook** (orchestrates sequence)
4. **Implement Step 1** (location selection) as proof of concept
5. **Iterate and refine timing** based on feel
6. **Complete remaining steps** following sequence
7. **Test accessibility and performance**
8. **Deploy to `/demo-slide-preview`**

---

## Questions to Resolve

- [ ] Should animation auto-play or require user trigger?
- [ ] Should there be a pause/play control?
- [ ] Should cursor be visible on mobile (or disable animation)?
- [ ] Should we add sound effects (subtle clicks/swooshes)?
- [ ] Should loop run continuously or limited number of times?

---

## Success Criteria

✅ **Animation feels natural** — looks like a real user exploring  
✅ **Timing is calm** — no rushed movements  
✅ **Educational** — users understand discovery flow without text  
✅ **Accessible** — works with reduced motion preference  
✅ **Performant** — smooth 60fps, low CPU usage  
✅ **On-brand** — matches I Love Medellín luxury aesthetic  

---

**Status:** Ready for implementation  
**Approved by:** [Pending]  
**Implementation Start:** [TBD]
