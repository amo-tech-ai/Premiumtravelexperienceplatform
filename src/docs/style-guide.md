# Design System Style Guide
## Local Scout - Luxury Travel Platform

**Version:** 1.0  
**Last Updated:** December 18, 2024  
**Status:** 🔒 Design Locked

---

## Overview

Premium travel platform with editorial aesthetics, inspired by luxury travel publications. Design prioritizes **calm intelligence**, **sophisticated minimalism**, and **trust**.

**Core Principles:**
- Luxury without clutter
- Intelligence without intimidation
- Data without overwhelm

---

## Color Palette

### Primary Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--primary` | `#064E3B` | Emerald 900 - Primary actions, headers |
| `--accent` | `#FBBF24` | Amber 400 - Highlights, CTAs |
| `--background` | `#F7F7F5` | Warm off-white background |
| `--cream` | `#FDFBF7` | Itinerary feed background |
| `--card` | `#FFFFFF` | White cards |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--secondary` | `#F0FDF4` | Emerald 50 - Subtle highlights |
| `--muted` | `#ECECF0` | Disabled states, borders |
| `--destructive` | `#D4183D` | Errors, deletions |

### Usage Rules

✅ **Do:**
- Use `primary` for main navigation, key CTAs
- Use `accent` sparingly (10% of UI max)
- Maintain 4.5:1 contrast ratio minimum

❌ **Don't:**
- Mix primary + accent in same button
- Use pure black (#000) - use foreground token
- Override background on body element

---

## Typography

### Font Families

```css
--font-serif: "Playfair Display", serif;  /* Headings */
--font-sans: "Inter", sans-serif;         /* Body, UI */
```

### Type Scale

| Element | Family | Size | Weight | Line Height | Usage |
|---------|--------|------|--------|-------------|-------|
| `h1` | Serif | 4xl | 500 | 1.2 | Page titles |
| `h2` | Serif | 3xl | 500 | 1.3 | Section headings |
| `h3` | Serif | 2xl | 500 | 1.4 | Card titles |
| `h4` | Serif | xl | 500 | 1.5 | Subsections |
| `body` | Sans | base | 400 | 1.5 | Paragraph text |
| `button` | Sans | base | 500 | 1.5 | Interactive elements |
| `label` | Sans | base | 500 | 1.5 | Form labels |

### Typography Rules

✅ **Do:**
- Let headings use serif by default (globals.css handles this)
- Use sans-serif for UI components, buttons, inputs
- Maintain hierarchy: h1 → h2 → h3 → h4

❌ **Don't:**
- Add font size classes (`text-2xl`, etc.) unless intentionally overriding
- Use font-weight classes - defaults are optimized
- Mix serif in body copy (editorial content exception)

---

## Spacing & Layout

### Spacing Scale

```
xs:  4px   (0.25rem)
sm:  8px   (0.5rem)
md:  16px  (1rem)
lg:  24px  (1.5rem)
xl:  32px  (2rem)
2xl: 48px  (3rem)
3xl: 64px  (4rem)
```

### Layout Patterns

**Container Widths:**
- Max width: `1280px` (desktop)
- Padding: `px-6` (mobile), `px-12` (desktop)

**Grid Systems:**
```tsx
// 3-Column Desktop
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

// Dashboard Layout (Trip OS)
<div className="flex h-screen">
  <nav className="w-64" />        {/* Sidebar */}
  <main className="flex-1" />     {/* Content */}
  <aside className="w-[360px]" /> {/* Tools Panel */}
</div>
```

---

## Components

### Buttons

**Variants:**
- `default` - Primary emerald, white text
- `outline` - Border, transparent bg
- `secondary` - Emerald 50 bg
- `ghost` - No background, hover highlight
- `destructive` - Red, for deletions

**Sizes:**
- `sm` - Height 32px, compact UI
- `default` - Height 36px, standard
- `lg` - Height 40px, hero CTAs
- `icon` - 36x36px square

**Usage:**
```tsx
// Primary CTA
<Button size="lg" className="rounded-full">
  Plan Your Trip
</Button>

// Secondary action
<Button variant="outline" className="rounded-full">
  Learn More
</Button>

// Destructive
<Button variant="destructive">
  Delete Trip
</Button>
```

### Cards

**Standard Card:**
```tsx
<div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
  <h3>Card Title</h3>
  <p className="text-muted-foreground">Description</p>
</div>
```

**Luxury Shadow:**
```css
box-shadow: var(--shadow-luxury); /* 0 25px 50px -12px rgba(6, 78, 59, 0.15) */
```

### Inputs

```tsx
<input className="h-10 rounded-xl border border-border bg-input-background px-4 
                  focus:outline-none focus:ring-2 focus:ring-ring" />
```

---

## Animations & Interactions

### Scroll-Driven (Hero sections)

```tsx
import { motion, useScroll, useTransform } from "motion/react";

const { scrollY } = useScroll();
const backgroundY = useTransform(scrollY, [0, 500], [0, 200]);

<motion.div style={{ y: backgroundY }}>
  {/* Parallax background */}
</motion.div>
```

### Micro-Interactions

**Card Hover:**
```tsx
<div className="transition-all hover:shadow-lg hover:-translate-y-1">
```

**Button Press:**
```tsx
<Button className="active:scale-95 transition-transform">
```

**Fade In:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
/>
```

### Performance Rules

✅ **Do:**
- Use `transform` for animations (GPU-accelerated)
- Add `will-change-transform` for known animations
- Use `transition-all` sparingly (prefer specific properties)

❌ **Don't:**
- Animate `height`, `width` (causes reflow)
- Use animations >0.8s duration (feels sluggish)
- Add animations to list items (performance hit on scroll)

---

## Icons

**Library:** `lucide-react`

**Verification Required:**
```tsx
// ALWAYS verify icon exists before importing
// Check: node_modules/lucide-react/dist/esm/icons/index.js
import { MapPin, Calendar, Users } from 'lucide-react';
```

**Standard Sizes:**
- Small: `className="w-4 h-4"` (16px)
- Default: `className="w-5 h-5"` (20px)
- Large: `className="w-6 h-6"` (24px)

---

## Border Radius

```css
--radius: 1rem; /* Base 16px */

--radius-sm: 12px;  /* Small elements */
--radius-md: 14px;  /* Medium cards */
--radius-lg: 16px;  /* Default */
--radius-xl: 20px;  /* Large cards */
```

**Usage:**
- Buttons: `rounded-full` (pill shape) or `rounded-xl`
- Cards: `rounded-xl` (16px)
- Inputs: `rounded-xl` (16px)
- Modals: `rounded-2xl` (24px top corners)

---

## Imagery

### Sources

**Unsplash Integration:**
```tsx
import { unsplash_tool } from 'tools';
const imageUrl = await unsplash_tool({ query: "medellin mountains" });
```

**Figma Assets:**
```tsx
// Raster images (NO path prefix!)
import img from "figma:asset/abc123.png";

// SVGs (relative path)
import svgPaths from "./imports/svg-wg56ef214f";
```

### Image Component

```tsx
import { ImageWithFallback } from './components/figma/ImageWithFallback';

<ImageWithFallback
  src="..."
  alt="Descriptive alt text"
  className="w-full h-64 object-cover rounded-xl"
/>
```

### Aspect Ratios

- Hero images: `aspect-video` (16:9)
- Card images: `aspect-[4/3]`
- Square thumbnails: `aspect-square`
- Profile photos: `aspect-square rounded-full`

---

## Responsive Breakpoints

```css
sm:  640px   /* Mobile landscape */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Wide desktop */
2xl: 1536px  /* Ultra-wide */
```

**Mobile-First Approach:**
```tsx
// Base: Mobile
// md: Tablet and up
// lg: Desktop and up
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

---

## Accessibility

### Contrast Requirements

- Normal text: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum
- Interactive elements: 3:1 minimum

### Focus States

All interactive elements must have visible focus:
```css
focus-visible:ring-2 focus-visible:ring-ring
```

### Semantic HTML

✅ **Do:**
- Use `<button>` for actions
- Use `<a>` for navigation
- Use proper heading hierarchy (h1 → h2 → h3)
- Add `alt` text to all images

❌ **Don't:**
- Use `<div onClick>` (use button)
- Skip heading levels (h1 → h3)
- Forget ARIA labels for icon-only buttons

---

## Dark Mode (Optional)

Currently not implemented. If needed:

```tsx
// Check: .dark class on root element
<html className="dark">
```

All colors have dark mode variants in globals.css.

---

## Component Library Location

```
/components/ui/          # Base components (button, input, card, etc.)
/components/layout/      # Layout components (navbar, footer, sidebar)
/components/home/        # Landing page sections
/components/itinerary/   # Trip planning UI
/components/ai/          # AI chat interfaces
```

---

## Utilities

### Scrollbar Hide

```tsx
<div className="scrollbar-hide overflow-auto">
  {/* Content with hidden scrollbar */}
</div>
```

### Conditional Styling

```tsx
import { cn } from './components/ui/utils';

<div className={cn(
  "base-classes",
  isActive && "bg-primary text-white",
  isDisabled && "opacity-50 pointer-events-none"
)} />
```

---

## Quality Checklist

Before shipping a component:

- [ ] Matches color palette (no hardcoded hex)
- [ ] Uses design tokens (--primary, --accent, etc.)
- [ ] Responsive on mobile, tablet, desktop
- [ ] Keyboard navigable (tab order makes sense)
- [ ] Focus states visible
- [ ] Images have alt text
- [ ] Animations <0.8s duration
- [ ] No layout shift on load
- [ ] Lighthouse score >90

---

## Resources

- **Figma:** [Design files location]
- **Component Docs:** `/components/ui/*`
- **Icons:** [Lucide React](https://lucide.dev/)
- **Fonts:** Google Fonts (Inter, Playfair Display)

---

**Maintained by:** Design Team  
**Questions:** See `/docs/` for PRD and architecture docs
