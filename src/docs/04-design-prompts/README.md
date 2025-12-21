# Design Prompts & Specifications

**Purpose:** Comprehensive UI/UX design prompts for premium AI travel platform sections  
**Date:** December 20, 2024  
**Status:** ✅ Production-Ready Documentation

---

## 📁 Documentation Structure

| File | Purpose | Contents |
|------|---------|----------|
| `01-smart-city-section.md` | Complete design prompt | Design brief, specifications, animations, implementation |
| `02-smart-city-wireframes.md` | Visual wireframes | ASCII layouts, Mermaid diagrams, responsive views |
| `README.md` | **This file** | Overview and quick reference |

---

## 🎯 "Your Smart City" Section Overview

### Design Concept
A premium hero section showcasing intelligent urban discovery through:
- **Central AI avatar** (local concierge persona)
- **6 floating image cards** (city categories)
- **Category pill labels** with icons
- **Interactive chat input** at bottom
- **Gentle orbital motion** creating magical feel
- **Mouse parallax depth** for premium touch

### Layout Pattern
```
┌──────────────────────┬─────────────────────────┐
│                      │                         │
│  Left Column (40%)   │  Right Column (60%)     │
│                      │                         │
│  • Headline          │  • Floating Cards (6)   │
│  • Body Copy         │  • Central Avatar       │
│  • CTA Button        │  • Category Labels      │
│                      │  • Chat Input Bar       │
│                      │                         │
└──────────────────────┴─────────────────────────┘
```

---

## 📐 Key Specifications

### Visual Elements

| Element | Size (Desktop) | Size (Mobile) | Animation |
|---------|---------------|---------------|-----------|
| Central Avatar | 120×120px | 100×100px | Pulse (3s loop) |
| Large Cards | 180×180px | 140×140px | Orbital + parallax |
| Medium Cards | 160×160px | 140×140px | Orbital + parallax |
| Small Cards | 140×140px | 120×120px | Orbital + parallax |
| Chat Input | 500px wide | 90% width | Slide up on scroll |
| Pill Labels | Auto × 40px | Auto × 48px | Fade in, lift on hover |

### Six Categories

1. **☕ Cafés & Coffee** - Artisan coffee shops
2. **🎵 Nightlife** - Rooftop bars, clubs
3. **🌿 Parks & Nature** - Urban green spaces
4. **🛍️ Local Markets** - Street vendors, markets
5. **🎨 Art & Culture** - Galleries, murals
6. **✨ Hidden Gems** - Secret spots

---

## 🎬 Animation System

### 1. Entrance Sequence (Scroll-Triggered)
```
Timeline (on scroll into view):
0ms    → Background fade in
200ms  → Headline slide up
300ms  → Avatar scale in
400ms  → Card 1 reveal
480ms  → Card 2 reveal (stagger 80ms)
560ms  → Card 3 reveal
640ms  → Card 4 reveal
720ms  → Card 5 reveal
800ms  → Card 6 reveal
900ms  → Labels fade in
1000ms → Chat input slide up
1400ms → Orbital loop starts
```

### 2. Continuous Orbital Motion
- **Pattern:** Circular orbit around avatar
- **Radius:** 10px (subtle)
- **Speed:** 5 seconds per rotation
- **Offset:** Each card starts 60° apart
- **Easing:** Spring physics

### 3. Mouse Parallax
- **Trigger:** Desktop hover over collage
- **Depth layers:** Cards move 2-4x cursor speed
- **Effect:** Creates 3D depth illusion
- **Combination:** Works with orbital motion

### 4. Hover Interactions
- **Card hover:** Scale 1.05, lift 8px, elevate shadow
- **Label hover:** Connected card glows
- **Connection:** Bidirectional highlight system

### 5. Scroll Effects
- **Background parallax:** Slower than content
- **Collage parallax:** Moderate speed
- **Glow intensity:** Tied to scroll progress

---

## 📱 Responsive Behavior

### Desktop (≥1440px)
✅ Full two-column layout  
✅ Complete orbital animation  
✅ Mouse parallax active  
✅ All hover states  
✅ Scroll parallax enabled

### Tablet (768-1023px)
✅ Two-column balanced  
✅ Simplified orbit (smaller radius)  
⚠️ No mouse parallax  
✅ Touch tap states  
✅ Reduced scroll effects

### Mobile (<768px)
✅ Single column stack  
✅ Visual-first layout  
✅ Static 2×3 card grid  
⚠️ No orbital animation  
⚠️ No parallax  
✅ Touch-optimized (48px+ targets)

---

## 🎨 Design System Integration

### Typography
- **Headline:** font-serif, 48-56px, bold
- **Body:** font-sans, 18-20px, regular
- **Labels:** 14px, medium weight

### Colors
- **Primary:** Amber-400 (#fbbf24)
- **Gradient:** Amber-500 → Orange-600
- **Text:** Slate-900 / Slate-600
- **Cards:** White with soft shadows

### Shadows
- **Card default:** `0 8px 24px rgba(0,0,0,0.08)`
- **Card hover:** `0 20px 40px rgba(0,0,0,0.15)`
- **Avatar glow:** `0 0 40px rgba(251,191,36,0.3)`
- **Input bar:** `0 12px 32px rgba(0,0,0,0.12)`

### Border Radius
- **Cards:** 24px (rounded-3xl)
- **Labels:** 9999px (rounded-full)
- **Avatar:** 9999px (circular)
- **Input:** 32px (pill shape)

---

## 🔄 Mermaid Diagrams Included

The wireframes document contains:

1. **Component Architecture** - System structure
2. **Card Positioning Layout** - Orbital arrangement
3. **User Interaction Flow** - Sequence diagrams
4. **Animation Timeline** - Gantt chart
5. **Responsive Breakpoints** - Decision tree
6. **State Diagrams** - Interaction states
7. **Depth Layers** - Parallax system
8. **Hover Logic** - Connection flowchart
9. **Data Flow** - Component architecture
10. **Responsive Matrix** - Behavior table

---

## 🚀 Implementation Phases

### Phase 1: Structure (2 hours)
- Create section container
- Build two-column layout
- Set up responsive grid

### Phase 2: Visual Elements (3 hours)
- Card component with images
- Label/pill component
- Central avatar with glow
- Chat input bar

### Phase 3: Entrance Animations (2 hours)
- Scroll trigger setup
- Stagger reveal cards
- Fade in labels
- Text animations

### Phase 4: Interactive Animations (3 hours)
- Orbital rotation system
- Mouse parallax logic
- Hover states
- Connection highlighting

### Phase 5: Scroll Effects (2 hours)
- Background parallax
- Collage parallax
- Glow intensity control

### Phase 6: Polish (2 hours)
- Mobile responsive
- Accessibility (reduced motion)
- Performance optimization
- Testing

**Total:** 14 hours

---

## ✅ Quality Checklist

### Visual Quality
- [ ] Premium luxury aesthetic
- [ ] Soft depth (not flat)
- [ ] Cards feel floating
- [ ] Avatar is focal point
- [ ] Labels readable and elegant

### Animation Quality
- [ ] Smooth entrance (60fps)
- [ ] Orbital motion subtle
- [ ] Parallax feels natural
- [ ] Hover feedback instant
- [ ] No jank or stutter
- [ ] Respects `prefers-reduced-motion`

### Interaction Quality
- [ ] Cards respond to hover
- [ ] Labels highlight connections
- [ ] Chat input clear focus
- [ ] Touch targets ≥48px (mobile)
- [ ] Keyboard accessible

### Performance
- [ ] 60fps animations
- [ ] No layout shift
- [ ] Images lazy load
- [ ] Smooth on mid-range devices
- [ ] Mobile simplified appropriately

### Responsiveness
- [ ] Desktop: Full features
- [ ] Tablet: Balanced layout
- [ ] Mobile: Touch-optimized
- [ ] Breakpoints smooth
- [ ] Content readable all sizes

---

## 📚 File Contents Summary

### 01-smart-city-section.md (50+ pages)
Comprehensive design prompt including:
- Design brief and goals
- Layout specifications
- Visual element details
- Mermaid architecture diagrams
- Complete animation specs
- Scroll effect documentation
- Content specifications
- Design token system
- Implementation phases
- Acceptance criteria

### 02-smart-city-wireframes.md (40+ pages)
Visual wireframes with:
- ASCII art layouts (Desktop/Tablet/Mobile)
- Component-level wireframes
- 10 Mermaid diagrams
- Interaction state diagrams
- Animation timelines (Gantt)
- Responsive behavior matrix
- Touch target specifications
- Data flow architecture
- Developer handoff notes

---

## 🎯 Design Goals

### Primary Goal
Introduce users to intelligent city discovery through:
- **Personal** - Central avatar creates human connection
- **Comprehensive** - 6 categories show full coverage
- **Delightful** - Orbital motion feels magical
- **Trustworthy** - Premium design signals quality

### Success Metrics
- ✅ Users scroll to view full section (engagement)
- ✅ Users hover/interact with cards (curiosity)
- ✅ Users click chat input (conversion intent)
- ✅ Time on section >8 seconds (attention)

---

## 🔗 Related Documentation

### Foundation Docs
- `/docs/01-foundation/01-fix-design-system.md` - Design token system
- `/docs/01-foundation/02-directory-routing.md` - Component structure

### Implementation Reference
- `/components/landing/HowItWorksSection.tsx` - Similar pattern (existing)
- `/pages/HowItWorksV2.tsx` - Scroll-driven example

---

## 🎬 Next Steps

1. **✅ Design documentation complete** (this folder)
2. **→ Create Figma mockups** - High-fidelity visuals
3. **→ Build component library** - Reusable pieces
4. **→ Implement in phases** - Structure → Visuals → Animations
5. **→ User testing** - Validate interactions
6. **→ Performance audit** - Ensure 60fps
7. **→ Ship to production** - Deploy with feature flag

---

## 💡 Tips for Implementation

### Animation Performance
- Use `transform` and `opacity` only (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly (only during animation)
- Implement `IntersectionObserver` for scroll triggers

### Accessibility
- Wrap animations in `prefers-reduced-motion` check
- Ensure keyboard navigation works
- Add ARIA labels to interactive elements
- Test with screen readers

### Mobile Optimization
- Disable orbital animation on mobile
- Use static grid instead
- Increase touch targets to 48px+
- Simplify or remove parallax effects

### Image Optimization
- Use WebP format with fallbacks
- Lazy load images below fold
- Add blur placeholders
- Optimize for 2x retina displays

---

## 📞 Quick Reference

**Need layout specs?** → `02-smart-city-wireframes.md` (ASCII layouts)  
**Need animation details?** → `01-smart-city-section.md` (Animation specs)  
**Need Mermaid diagrams?** → Both files (10 diagrams total)  
**Need implementation plan?** → `01-smart-city-section.md` (Phases)  
**Need design tokens?** → `01-smart-city-section.md` (Design tokens)

---

**Status:** ✅ **DESIGN DOCUMENTATION 100% COMPLETE**  
**Contains:** 2 comprehensive documents with 90+ pages  
**Diagrams:** 10 Mermaid diagrams + ASCII wireframes  
**Ready for:** Figma mockup creation → Development

**Last Updated:** December 20, 2024
