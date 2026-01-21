# HOME V3 — DESIGN DOCUMENTATION INDEX
## I Love Medellín Landing Page

**Version:** 3.0  
**Brand:** I Love Medellín  
**Route:** `/home-v3`  
**Last Updated:** 2026-01-21

---

## OVERVIEW

This directory contains comprehensive design prompts for each section of the Home V3 landing page. Each document focuses on **UI/UX best practices, layout strategy, responsive design, and premium content guidelines** without code implementation details.

---

## DESIGN PHILOSOPHY

### Core Principles
1. **Luxury, calm, confident aesthetic**
2. **Editorial typography** (serif headlines, italic emphasis)
3. **Illustrated cards** with soft shadows
4. **Motion with restraint and purpose**
5. **NO neon colors** anywhere in design
6. **Premium content quality**

### Visual Identity
- **Primary Colors:** Emerald-950 (dark), White, Slate-50
- **Accent Colors:** Amber-500, Rose-500, Emerald-700
- **Typography:** Serif headlines, sans-serif body
- **Spacing:** Generous, never cramped
- **Shadows:** Soft, realistic, never harsh

---

## SECTION BREAKDOWN

### [01 — HERO SECTION](./01-hero-section.md)
**Two-Column Layout with Masonry Grid**

**Purpose:** First impression, value communication, inspire exploration

**Key Elements:**
- Left: Brand mention, headline, supporting text, dual CTAs
- Right: 9-image masonry grid (Colombia destinations)
- White rounded container on slate-50 background
- Minimum height: 600px

**Responsive:**
- Desktop: 45/55 split (text/images)
- Mobile: Stacked vertical (text first, 2-column grid)

**Design Focus:**
- Powerful headline in serif
- High-quality, diverse imagery
- Clear primary/secondary CTA differentiation
- Scroll-triggered stagger animations

---

### [02 — INSPIRATION SLIDER](./02-inspiration-slider.md)
**Horizontal Scrolling Image Carousel**

**Purpose:** Inspire wanderlust, encourage exploration

**Key Elements:**
- Dark emerald-950 background
- Section title + navigation controls (desktop)
- 5 destination cards (350px width, 400px height)
- Portrait aspect ratio with gradient overlays
- Serif captions

**Responsive:**
- Desktop: Navigation buttons, partial visibility
- Mobile: Touch/swipe, no buttons

**Design Focus:**
- High-quality photography
- Readable captions on all images
- Smooth horizontal scroll
- Hover zoom effect

---

### [03 — QUICK FEATURES](./03-quick-features.md)
**Icon Grid Navigation Cards**

**Purpose:** Clarity on core offerings, quick navigation

**Key Elements:**
- Slate-50 background
- 5 equal-width cards (Rentals, Auto, Restaurants, Events, Travel)
- Icon container (emerald-50, emerald-700 icon)
- Title + description
- Clickable navigation

**Responsive:**
- Desktop: 5 columns (single row)
- Tablet: 3 columns
- Mobile: 2 columns or 1 column

**Design Focus:**
- Consistent card heights
- Clear iconography
- Hover lift effect
- Benefit-focused descriptions

---

### [04 — HOW IT WORKS](./04-how-it-works-scroll.md)
**Scroll-Driven Product Demonstration**

**Purpose:** Demonstrate workflow through interactive storytelling

**Key Elements:**
- Uses dedicated component `HowItWorksScrollSection`
- 4-step process (Tell AI → Curate → Review → Book)
- Scroll-triggered state changes
- Progress indicator

**Responsive:**
- Desktop: Side-by-side (content + visual)
- Mobile: Stacked or swipeable

**Design Focus:**
- Smooth scroll mechanics
- Clear step progression
- Visual mockups per step
- No jarring transitions

---

### [05 — ALTERNATING FEATURES](./05-alternating-features.md)
**Two-Column Feature Showcase with Image-Text Alternation**

**Purpose:** Deep-dive into differentiators with visual storytelling

**Key Elements:**
- 3-4 subsections
- Alternating layout (text-left/image-right, then reverse)
- Eyebrow label (amber-500, uppercase)
- Serif headline with italic emphasis
- Outline CTA button (emerald-700)

**Responsive:**
- Desktop: Side-by-side alternation
- Mobile: Consistent stack (image top, text below)

**Design Focus:**
- Benefit-focused headlines
- High-quality relevant imagery
- Rhythm through alternation
- Image hover zoom

---

### [06 — AI DIFFERENTIATION](./06-ai-differentiation.md)
**Dark Background Feature Grid**

**Purpose:** Establish AI as differentiator, build trust

**Key Elements:**
- Emerald-950 background
- 3-column grid
- Gradient icon containers (amber gradient)
- White titles, slate-300 descriptions
- Centered alignment

**Responsive:**
- Desktop: 3 columns
- Mobile: Single column stack

**Design Focus:**
- Addresses AI concerns (control, personalization, local)
- Premium dark aesthetic
- Clear, reassuring messaging
- No borders or chrome (minimal)

---

### [07 — CURATED COLLECTIONS](./07-curated-collections.md)
**Image Grid with Category Cards**

**Purpose:** Showcase content categories, inspire exploration

**Key Elements:**
- White background
- 4 portrait cards (350px height)
- Category tags (frosted glass effect)
- Serif titles on gradient overlay
- Clickable navigation

**Responsive:**
- Desktop: 4 columns (single row)
- Tablet: 2x2 grid
- Mobile: 2 columns or 1 column

**Design Focus:**
- High-quality, emotionally compelling images
- Readable text on all images (gradient overlay)
- Hover zoom effect
- Clear category differentiation

---

### [08 — TRUST & SOCIAL PROOF](./08-trust-social-proof.md)
**Three-Column Stats Grid**

**Purpose:** Build credibility before final CTA

**Key Elements:**
- Emerald-950 background
- 3 stats (scale, quality, reliability)
- Icon + large number + label
- White numbers, slate-400 labels

**Responsive:**
- Desktop: 3 columns
- Mobile: Vertical stack

**Design Focus:**
- Specific, verifiable metrics
- Large, bold numbers
- Emerald-400 icons
- Optional count-up animation

---

### [09 — FINAL CTA](./09-final-cta.md)
**Conversion-Focused Hero Moment**

**Purpose:** Convert visitors into users

**Key Elements:**
- Gradient background (slate-50 to white)
- Serif headline (question or statement)
- Supporting text
- Large rose-500 primary CTA button
- Optional secondary CTA

**Responsive:**
- Desktop: Centered, max-width 1024px
- Mobile: Full-width buttons, stacked

**Design Focus:**
- Clear single action
- Friction reduction
- Rose-500 for energy (complementary to emerald)
- Hover lift + arrow animation

---

## DOCUMENT STRUCTURE

Each section document includes:

### 1. Layout Structure
- Section background and container specs
- Content width and spacing
- Grid/column specifications

### 2. Content Hierarchy
- Eyebrow labels
- Headlines (typography, content examples)
- Supporting text
- CTAs/buttons

### 3. Visual Design
- Color specifications
- Icon/image treatment
- Shadows and effects
- Hover states

### 4. Responsive Behavior
- Breakpoint strategies
- Mobile adaptations
- Typography scaling
- Touch optimization

### 5. Animation & Motion
- Scroll reveals
- Hover effects
- Stagger timings
- Performance considerations

### 6. Accessibility
- Semantic HTML
- Keyboard navigation
- Screen reader support
- Color contrast

### 7. Premium Design Touches
- Visual refinement details
- Interaction polish
- Content quality guidelines

### 8. UX Best Practices
- Scannability
- Clarity
- Trust building
- Mobile-first considerations

### 9. Performance Considerations
- Image optimization
- Rendering strategy
- Load priority

### 10. Testing Checklist
- Quality assurance items
- Cross-browser/device testing

---

## CROSS-SECTION CONSISTENCY

### Typography Scale
```
Eyebrows:    12-14px, uppercase, wide tracking, bold
Headlines:   4xl-7xl, serif, bold, tight leading
Subheads:    2xl-3xl, serif, bold
Body Large:  18-20px, sans-serif, regular
Body:        16px, sans-serif, regular
Small:       13-14px, sans-serif, regular
```

### Color Palette
```
BACKGROUNDS:
- Light sections: White, Slate-50
- Dark sections: Emerald-950

TEXT:
- Headlines (light bg): Slate-900
- Headlines (dark bg): White
- Body (light bg): Slate-600
- Body (dark bg): Slate-300
- Labels: Amber-500, Amber-400

ACCENTS:
- Primary CTA: Rose-500
- Secondary CTA: Emerald-700
- Icons: Emerald-700, Emerald-400
- Links: Emerald-600
```

### Spacing System
```
Section padding (desktop): 96-128px
Section padding (mobile):  64-96px
Between elements:          24-48px
Between cards:             16-32px
Content max-width:         1120-1400px
Side padding:              24px
```

### Border Radius
```
Small cards/buttons:  8-12px
Medium cards:         16px
Large cards:          24px
Pills/CTAs:           9999px (full rounding)
```

### Shadows
```
Subtle:   0 2px 4px rgba(0,0,0,0.04)
Medium:   0 4px 12px rgba(0,0,0,0.1)
Large:    0 8px 20px rgba(0,0,0,0.15)
Hover:    Increase spread/blur by 50%
```

---

## RESPONSIVE BREAKPOINTS

### Standard Breakpoints
```
Mobile:   < 768px
Tablet:   768px - 1024px
Desktop:  > 1024px
```

### Mobile-First Approach
- Design for mobile first
- Enhance for larger screens
- Never hide critical content on mobile
- Touch targets minimum 44x44px

---

## ANIMATION TIMING

### Standard Durations
```
Fast interactions:     150-200ms
Standard transitions:  300ms
Smooth animations:     400-600ms
Scroll reveals:        600-800ms
```

### Easing Functions
```
Default:        ease-out
Entrances:      ease-out
Exits:          ease-in
Smooth motion:  ease-in-out
Bouncy:         spring (optional)
```

### Stagger Intervals
```
Small groups (3-5 items):   100-150ms
Medium groups (6-10 items): 50-100ms
Large groups (10+ items):   25-50ms
```

---

## CONTENT TONE & VOICE

### Writing Principles
1. **Clarity before cleverness** — Simple, direct language
2. **Benefit-focused** — "What's in it for me?"
3. **Conversational but confident** — Friendly expert
4. **Specific over vague** — Real numbers, real examples
5. **Active voice** — "Discover places" not "Places can be discovered"

### Avoid
- Jargon or technical terms
- Superlatives without proof ("best", "amazing")
- Corporate speak
- Vague promises
- Pressure tactics

---

## IMAGE GUIDELINES

### Quality Standards
- Minimum 1200px width
- High resolution (retina-ready)
- Sharp focus
- Professional grade
- Well-lit, color-corrected

### Content Criteria
- Authentic (not overly staged stock)
- Relevant to content
- Emotionally compelling
- Diverse representation
- Strong composition

### Technical Specs
- WebP format with JPEG fallback
- Compressed without visible loss
- Responsive srcset
- Descriptive alt text
- Fixed aspect ratios (prevent layout shift)

---

## ACCESSIBILITY STANDARDS

### WCAG 2.1 AA Compliance
- Color contrast minimum 4.5:1 (body text)
- Color contrast minimum 3:1 (large text, icons)
- Keyboard navigable
- Screen reader compatible
- Focus indicators visible
- No color-only communication

### Motion Considerations
- Respect `prefers-reduced-motion`
- Animations enhance, not required
- No auto-play videos
- Pause/stop controls available

---

## TESTING REQUIREMENTS

### Browser Support
- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Edge (latest)

### Device Testing
- Desktop (1920px, 1440px, 1280px)
- Tablet (iPad, 1024px, 768px)
- Mobile (iPhone, Android, 375px, 414px)

### Performance Targets
- Largest Contentful Paint: < 2.5s
- First Input Delay: < 100ms
- Cumulative Layout Shift: < 0.1
- 60fps animations

---

## DESIGN FILE STRUCTURE

```
/docs/00-ilm/homev3/
├── 00-index.md                    (this file)
├── 01-hero-section.md
├── 02-inspiration-slider.md
├── 03-quick-features.md
├── 04-how-it-works-scroll.md
├── 05-alternating-features.md
├── 06-ai-differentiation.md
├── 07-curated-collections.md
├── 08-trust-social-proof.md
└── 09-final-cta.md
```

---

## USAGE NOTES

### For Designers
- Use these prompts to create high-fidelity mockups
- Follow spacing and typography specs exactly
- Test responsive breakpoints
- Consider accessibility from start

### For Developers
- Reference for implementation details
- Understand design rationale
- Match specifications precisely
- Maintain consistency across sections

### For Content Writers
- Understand tone and voice guidelines
- See content examples and structures
- Follow character limits and formatting
- Maintain benefit-focused messaging

### For Stakeholders
- Understand design decisions
- See full user journey
- Review content strategy
- Approve before implementation

---

## VERSION HISTORY

**V3.0** (Current)
- "I Love Medellín" brand identity
- Dark emerald + amber color scheme
- Serif headlines with italic emphasis
- Premium, calm aesthetic
- 9 distinct sections

**V2.0** (Previous)
- Original brand exploration
- Different color palette
- Alternative layout approach

**V1.0** (Original)
- Basic landing page
- Generic travel focus

---

## RELATED DOCUMENTATION

- `/docs/00-ilm/08-build-fix-summary.md` — Build process
- `/docs/00-ilm/09-react-router-fix-progress.md` — Routing updates
- `/docs/00-ilm/10-react-router-fix-complete.md` — Final routing
- `/docs/00-ilm/13-how-it-works-v4-summary.md` — How It Works page

---

**Status:** ✅ **COMPLETE**  
**Total Sections:** 9  
**Total Documents:** 10 (including index)  
**Last Updated:** 2026-01-21  

**Purpose:** Comprehensive design documentation for the I Love Medellín Home V3 landing page, covering every section with detailed UI/UX guidance, responsive design best practices, and premium content standards.
