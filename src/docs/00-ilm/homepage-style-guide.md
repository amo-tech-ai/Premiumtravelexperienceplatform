# Homepage Style Guide

## Design Philosophy
Luxury, calm, and confident aesthetic with editorial typography, illustrated cards, soft shadows, and purposeful motion. Strictly avoid neon colors.

---

## Color Palette

### Primary Colors
- **Deep Emerald Green**: `emerald-950` - Hero, footer, and feature sections
- **White/Off-White**: Content backgrounds and text on dark sections
- **Slate Grays**: `slate-50`, `slate-100` - Subtle background variations

### Accent Colors
- **Amber/Gold**: `amber-400`, `amber-500` - CTAs, highlights, brand accents
- **Emerald**: `emerald-400`, `emerald-500` - Success states, feature highlights

### Text Colors
- **Primary Text**: `slate-900` on light, `white` on dark
- **Secondary Text**: `slate-600` on light, `slate-300` on dark
- **Tertiary Text**: `slate-500` on light, `slate-400` on dark

---

## Typography

### Font Families
- **Serif**: Headlines, hero titles, section headings (luxury editorial feel)
- **Sans-Serif**: Body text, UI elements, buttons (clean readability)

### Hierarchy
- **Hero**: 56-72px serif, bold
- **H1**: 48-60px serif, tracking tight
- **H2**: 40-48px serif, tracking tight
- **H3**: 32-36px serif
- **Overline**: 12-14px, uppercase, wide tracking, amber color
- **Body**: 16-18px sans-serif
- **Small**: 14px sans-serif

---

## Layout Structure

### Section Spacing
- **Desktop**: 128-160px (py-32 to py-40) vertical padding
- **Mobile**: 64-96px (py-16 to py-24) vertical padding
- **Between Elements**: 48-64px margins

### Container Widths
- **Max Width**: 1280px (max-w-7xl)
- **Content Width**: 1024px (max-w-5xl) for text-heavy sections
- **Horizontal Padding**: 24px (px-6) mobile, 48px (px-12) desktop

---

## Component Patterns

### Hero Section
- Full viewport height or near-full
- Deep emerald green background
- Large serif headline with amber accent words
- Subtle gradient overlays
- Single primary CTA (amber button)

### Feature Sections
- Alternating backgrounds (white, emerald-950, slate-50)
- Overline + serif headline pattern
- Three-column grid on desktop, stack on mobile
- Illustrated icons or cards
- Generous white space

### Cards
- Rounded corners (16-24px)
- Soft shadows (subtle, not harsh)
- Hover states with gentle scale (1.02-1.05)
- Image aspect ratio: 4:3 or 3:2
- White background with slate borders

### Buttons
- **Primary**: Amber background, bold text, rounded-xl
- **Secondary**: Outline, white or emerald border
- **Ghost**: Transparent with hover state
- Consistent padding: px-6 py-3 minimum

### Images
- High quality, editorial style
- Soft overlays when text is on top
- Rounded corners matching cards
- Always include alt text

---

## Wireframe Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         NAVIGATION                               │
│  Logo [Amber AI]          Links          [Dashboard] [CTA]      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    HERO SECTION                                  │
│              (Deep Emerald Green bg-emerald-950)                 │
│                                                                   │
│         OVERLINE (Amber, uppercase, tracking-wide)              │
│                                                                   │
│        MAIN HEADLINE (Serif, 60px, White)                       │
│        with [Amber Accent] words                                 │
│                                                                   │
│         Subtitle text (18px, slate-300)                          │
│                                                                   │
│              [Primary CTA Button - Amber]                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  FEATURES SECTION                                │
│                  (White or slate-50 bg)                          │
│                                                                   │
│              OVERLINE (Amber, uppercase)                         │
│         Section Headline (Serif, 48px, slate-900)               │
│                                                                   │
│    ┌──────────┐    ┌──────────┐    ┌──────────┐               │
│    │  ICON    │    │  ICON    │    │  ICON    │               │
│    │          │    │          │    │          │               │
│    │  Title   │    │  Title   │    │  Title   │               │
│    │  Text    │    │  Text    │    │  Text    │               │
│    └──────────┘    └──────────┘    └──────────┘               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              DISCOVER YOUR NEXT ADVENTURE                        │
│              (Deep Emerald Green bg-emerald-950)                 │
│                                                                   │
│    OVERLINE (Amber)     [← Navigation Buttons →]                │
│    Headline (Serif, 48px, White)                                 │
│                                                                   │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  → Horizontal        │
│  │IMG  │ │IMG  │ │IMG  │ │IMG  │ │IMG  │     Scroll            │
│  │City │ │City │ │City │ │City │ │City │                       │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    WHY CHOOSE US                                 │
│              (Deep Emerald Green bg-emerald-950)                 │
│                                                                   │
│              OVERLINE (Amber, uppercase)                         │
│         Section Headline (Serif, 48px, White)                   │
│                                                                   │
│    ┌──────────┐    ┌──────────┐    ┌──────────┐               │
│    │  Icon    │    │  Icon    │    │  Icon    │               │
│    │  Title   │    │  Title   │    │  Title   │               │
│    │  Desc    │    │  Desc    │    │  Desc    │               │
│    └──────────┘    └──────────┘    └──────────┘               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       TESTIMONIALS                               │
│                    (White or slate-50 bg)                        │
│                                                                   │
│              OVERLINE (Amber, uppercase)                         │
│         Section Headline (Serif, 48px, slate-900)               │
│                                                                   │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │ "Quote text"   │  │ "Quote text"   │  │ "Quote text"   │   │
│  │                │  │                │  │                │   │
│  │ — Name         │  │ — Name         │  │ — Name         │   │
│  │   Location     │  │   Location     │  │   Location     │   │
│  └────────────────┘  └────────────────┘  └────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    CTA SECTION                                   │
│              (Gradient or emerald-950 bg)                        │
│                                                                   │
│         Large Headline (Serif, 48px, White)                     │
│         Subheadline (18px, slate-300)                            │
│                                                                   │
│              [Primary CTA Button - Amber]                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          FOOTER                                  │
│              (Deep Emerald Green bg-emerald-950)                 │
│                                                                   │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────┐       │
│  │  Brand  │  │ Discover│  │ Company │  │ Newsletter  │       │
│  │  Logo   │  │  Links  │  │  Links  │  │   Signup    │       │
│  │  Desc   │  │         │  │         │  │             │       │
│  │  Social │  │         │  │         │  │   [Button]  │       │
│  └─────────┘  └─────────┘  └─────────┘  └─────────────┘       │
│                                                                   │
│  ────────────────────────────────────────────────────────────   │
│  © 2025 Brand          Privacy | Terms                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Motion & Interaction

### Animation Principles
- **Subtle**: No excessive bouncing or flashy effects
- **Purpose-Driven**: Animations guide attention and provide feedback
- **Smooth**: 300-500ms transitions for most interactions
- **Scroll Effects**: Fade-in-up on scroll with stagger delays

### Hover States
- **Cards**: Scale 1.02-1.05, lift shadow slightly
- **Buttons**: Darken or lighten background 10-20%
- **Images**: Scale 1.1 with overflow hidden
- **Links**: Color shift, no underline by default

### Scroll Behavior
- Smooth scroll on anchor links
- Parallax effects used sparingly
- Sticky navigation on scroll
- Progressive reveal of content

---

## Best Practices

### DO
- Use generous white space
- Maintain consistent vertical rhythm
- Keep emerald green for section backgrounds
- Use amber sparingly for important CTAs
- Include overlines above section headlines
- Use serif fonts for headlines
- Optimize images for web
- Test on mobile devices

### DON'T
- Use neon colors anywhere
- Over-animate
- Crowd sections with too many elements
- Mix too many font weights
- Use harsh shadows
- Create walls of text
- Ignore mobile breakpoints
- Forget alt text on images

---

## Responsive Breakpoints

### Mobile First Approach
- **Mobile**: < 768px - Stack all columns, larger touch targets
- **Tablet**: 768px - 1024px - Two columns where appropriate
- **Desktop**: > 1024px - Full multi-column layouts
- **Large Desktop**: > 1280px - Max width constraint

### Mobile Adjustments
- Reduce font sizes by 30-40%
- Stack horizontal scrolls remain horizontal
- Increase padding on touch targets (44px minimum)
- Simplify navigation to hamburger menu
- Reduce vertical spacing by 40-50%
