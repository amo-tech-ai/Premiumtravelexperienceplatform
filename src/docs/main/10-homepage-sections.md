# HOMEPAGE - DESIGN SPECIFICATION

**Page:** `/` (Home.tsx)  
**Style:** Luxury, Editorial, Calm Confidence  
**Status:** Production Ready

---

## PAGE STRUCTURE

```
1. Hero Section              - Full viewport, video background
2. How It Works              - 3-step process cards
3. AI Recommendations        - Interactive demo carousel
4. Get Inspired Gallery      - Masonry grid, destination cards
5. Curated Categories        - Icon grid, quick navigation
6. Stats Section             - Metrics, social proof
7. Pre-Footer CTA            - Final conversion prompt
```

---

## 01 - HERO SECTION

### Design Prompt
Create a luxury full-screen hero with ambient video background (subtle travel footage), dark gradient overlay (navy/black 60% opacity), and centered editorial typography. Main headline in serif font (56-72px), elegant subheadline (20-24px), primary CTA button (gold #D4AF37, 16px padding, rounded-xl, shadow-lg). Add subtle scroll indicator at bottom (animated chevron). On mobile, reduce headline to 36-48px, stack CTAs vertically. Background video pauses on mobile for performance.

### Specifications
- **Layout:** Full viewport height (100vh), flexbox centered
- **Typography:** Font-serif headline, sans-serif subheadline
- **CTA:** Primary (gold), Secondary (outline white)
- **Video:** Muted, autoplay, loop, cover fit
- **Overlay:** Linear gradient navy to black (60%)
- **Animation:** Fade-in headline (1s delay), button hover lift (-2px)

### Responsive
- **Mobile:** 1 column, 36-48px headline, stacked buttons
- **Tablet:** 1 column, 48-56px headline
- **Desktop:** 1 column centered, 56-72px headline

---

## 02 - HOW IT WORKS

### Design Prompt
Create a 3-column process section with numbered circular badges (gold), icon (48px lucide-react), headline, description, and optional micro-interaction. Each card has white background, rounded-2xl corners, subtle shadow (hover: shadow-xl), padding 32px. Numbers in gold circles (64px diameter) positioned top-left with -translate-y-1/2. Use connecting lines between cards on desktop (dotted gold). Responsive: stack vertically on mobile with timeline view (vertical line left side).

### Specifications
- **Cards:** 3 columns, equal width, 24px gap
- **Icons:** Play, Sparkles, Map (or custom)
- **Numbers:** 1, 2, 3 in gold circles
- **Animation:** Scroll-triggered fade-in, stagger 200ms
- **Colors:** White cards, gold accents, slate text

### Responsive
- **Mobile:** Stack vertical, show timeline line
- **Tablet:** 2 columns then 1
- **Desktop:** 3 columns horizontal

---

## 03 - AI RECOMMENDATIONS

### Design Prompt
Create an interactive AI recommendation carousel showing 4-6 destination cards with beautiful photography (16:9 ratio), location badge, AI score (0-100 with animated progress ring), quick stats (budget, days, activities), and hover reveal overlay with "View Details" CTA. Use smooth horizontal scroll snap, arrow navigation (hide on mobile), and dot indicators below. Each card has gradient overlay bottom (black to transparent), white text, rounded-xl corners, shadow-md.

### Specifications
- **Carousel:** Horizontal scroll, snap behavior
- **Cards:** 320px width, 16:9 image ratio
- **AI Score:** Circular progress (0-100), gold accent
- **Navigation:** Arrows (desktop), swipe (mobile), dots (all)
- **Hover:** Scale 1.02, shadow-xl, reveal details

### Responsive
- **Mobile:** 1 card visible, swipe navigation
- **Tablet:** 2 cards visible
- **Desktop:** 3-4 cards visible, mouse drag

---

## 04 - GET INSPIRED GALLERY

### Design Prompt
Create a masonry grid gallery with 8-12 destination cards in varying sizes (1x1, 1x2, 2x1 grid units). Each card shows high-quality photo, gradient overlay, location name, short description, category badge, and hover zoom effect. Use CSS Grid with auto-flow dense for optimal packing. Add "Load More" button at bottom (ghost style, gold hover). Images lazy load with blur placeholder transition.

### Specifications
- **Grid:** CSS Grid, auto-flow dense, 3 columns (desktop)
- **Cards:** Rounded-xl, overflow hidden, aspect-ratio varies
- **Images:** Object-fit cover, lazy load, blur placeholder
- **Overlay:** Linear gradient bottom, opacity 0 → 80% hover
- **Animation:** Zoom 1.05 on hover, smooth 400ms

### Responsive
- **Mobile:** 1 column, uniform heights
- **Tablet:** 2 columns
- **Desktop:** 3 columns, masonry layout

---

## 05 - CURATED CATEGORIES

### Design Prompt
Create an icon grid with 6-8 travel categories (Beach, Mountain, City, Culture, Adventure, Luxury, Budget, Family). Each tile is 200x200px, white background, rounded-2xl, centered icon (lucide-react 48px), label below, subtle hover lift (-4px) with shadow-lg. Icons in gold (#D4AF37), text in navy (#1A2332). Add smooth transitions (200ms ease-out). On mobile, show 2 columns; desktop shows 4 columns.

### Specifications
- **Grid:** 4 columns, 24px gap, equal squares
- **Icons:** 48px lucide-react, gold color
- **Cards:** 200x200px, white bg, centered content
- **Hover:** Lift -4px, shadow-lg, icon scale 1.1
- **Typography:** 18px semibold label

### Responsive
- **Mobile:** 2 columns, 160x160px cards
- **Tablet:** 3 columns
- **Desktop:** 4 columns, 200x200px cards

---

## 06 - STATS SECTION

### Design Prompt
Create a full-width stats banner with dark navy background (#1A2332), 4 centered metrics in white text. Each stat has large number (48-64px bold), small label below (14px opacity 70%), gold accent divider between (1px vertical line). Add subtle count-up animation when section enters viewport (Intersection Observer). Background can have subtle texture or gradient.

### Specifications
- **Layout:** Full-width, centered content, 4 columns
- **Typography:** 64px numbers (bold), 14px labels (light)
- **Colors:** Navy bg, white text, gold dividers
- **Animation:** Count-up from 0 when visible
- **Stats:** Trips Planned, Destinations, Happy Travelers, AI Agents

### Responsive
- **Mobile:** 2x2 grid, 36px numbers
- **Tablet:** 2x2 grid, 48px numbers
- **Desktop:** 1x4 row, 64px numbers

---

## 07 - PRE-FOOTER CTA

### Design Prompt
Create a final conversion section with gradient background (gold to bronze diagonal), centered editorial headline (48px serif), supporting text (20px), and prominent primary button (white bg, gold text, large padding 16x48px). Add subtle pattern overlay or travel icon watermark. Include trust badges below CTA (security, privacy, AI-powered icons). Full bleed background, max-width 1280px content container.

### Specifications
- **Background:** Gradient gold #D4AF37 to bronze #CD7F32
- **Typography:** Serif headline 48px, sans body 20px
- **CTA:** White bg, gold text, xl size, shadow-2xl
- **Trust Badges:** 3 icons horizontal, 24px size, opacity 60%
- **Padding:** 80px vertical, 32px horizontal

### Responsive
- **Mobile:** 36px headline, stack badges vertically
- **Tablet:** 40px headline
- **Desktop:** 48px headline, horizontal layout

---

## DESIGN TOKENS

### Colors
```css
Primary Gold: #D4AF37
Bronze: #CD7F32
Navy: #1A2332
Dark Slate: #2D3748
Cream: #FDFCF9
White: #FFFFFF
Text: #1A2332 (headings), #64748B (body)
```

### Typography
```css
Serif: Font-serif (Georgia, Times, serif)
Sans: System font stack
Headline: 56-72px (desktop), 36-48px (mobile)
Subheadline: 20-24px
Body: 16-18px
Label: 14px
```

### Spacing
```css
Section Padding: 80-120px vertical
Container Max Width: 1280px
Grid Gap: 24-32px
Card Padding: 24-32px
Button Padding: 12-16px vertical, 32-48px horizontal
```

### Animation
```css
Transition: 200-400ms ease-out
Hover Lift: -2px to -4px translateY
Scale: 1.02 to 1.05
Fade In: opacity 0 → 1, 400ms
Stagger Delay: 100-200ms between items
```

---

## BEST PRACTICES

### Performance
✅ Lazy load images below fold  
✅ Optimize hero video (webm + mp4, <5MB)  
✅ Use WebP images with JPEG fallback  
✅ Defer non-critical JavaScript  
✅ Preload critical fonts  
✅ Minimize layout shift (aspect-ratio boxes)  

### Accessibility
✅ ARIA labels on all interactive elements  
✅ Keyboard navigation (tab, enter, arrows)  
✅ Focus indicators visible (2px ring gold)  
✅ Alt text on all images (descriptive)  
✅ Sufficient color contrast (WCAG AA)  
✅ Reduced motion respect (prefers-reduced-motion)  

### UX Principles
✅ Clear visual hierarchy (F-pattern layout)  
✅ Generous white space (breathing room)  
✅ Obvious CTAs (size, color, position)  
✅ Fast page load (<3s LCP)  
✅ Mobile-first design (touch targets 44px min)  
✅ Progressive disclosure (reveal on scroll)  

### SEO & Content
✅ Semantic HTML (h1, h2, section, article)  
✅ Meta descriptions (150-160 chars)  
✅ Schema markup (Organization, Product)  
✅ Open Graph tags (social sharing)  
✅ Descriptive URLs (/how-it-works, /pricing)  
✅ Internal linking (footer, nav, content)  

---

## RESPONSIVE BREAKPOINTS

```css
/* Mobile First */
Base: 0-767px (1 column layouts)
Tablet: 768px-1023px (2 column layouts)
Desktop: 1024px-1279px (3-4 column layouts)
Large: 1280px+ (max-width container)

/* Common Patterns */
Mobile: Stack vertically, full width
Tablet: 2 columns, reduce font sizes 80%
Desktop: Multi-column grids, full typography
```

---

## ANIMATION TIMELINE

### Page Load Sequence
```
1. Hero fade-in (0-400ms)
2. Headline scale-in (400-800ms)
3. Subheadline fade-in (800-1200ms)
4. CTAs slide-up (1200-1600ms)
5. Scroll indicator pulse (1600ms+)
```

### Scroll Reveal
```
Trigger: Element 20% in viewport
Animation: Fade-in + translate-y (40px → 0)
Duration: 400ms ease-out
Stagger: 100ms per element
```

### Hover States
```
Cards: lift -4px, shadow-lg, 200ms
Buttons: lift -2px, shadow-xl, 200ms
Images: scale 1.05, 400ms ease-out
Icons: scale 1.1, rotate 5deg, 200ms
```

---

## COMPONENT LIBRARIES

**Current Stack:**
- React 18
- React Router 6
- Tailwind CSS 4.0
- Lucide React (icons)
- Motion/React (animations)

**Recommended Additions:**
- React Intersection Observer (scroll triggers)
- React Countup (number animations)
- React Masonry CSS (gallery layout)
- Swiper (if not using custom slider)

---

## CONTENT GUIDELINES

### Headlines
- **Length:** 4-8 words maximum
- **Tone:** Confident, aspirational, benefit-driven
- **Examples:**
  - "Your Next Adventure Awaits"
  - "Travel Planning Reimagined"
  - "AI-Powered Journeys, Perfectly Planned"

### Body Copy
- **Length:** 15-25 words per paragraph
- **Tone:** Warm, professional, concise
- **Voice:** Second person ("you"), active voice
- **Focus:** Benefits over features

### CTAs
- **Primary:** "Start Planning" / "Get Started"
- **Secondary:** "Learn More" / "See How It Works"
- **Urgency:** "Plan Your Trip Today" (use sparingly)

### Images
- **Style:** Professional travel photography
- **Quality:** Minimum 1920x1080 (hero), 800x600 (cards)
- **Subjects:** Real destinations, diverse travelers, authentic moments
- **Avoid:** Stock photo clichés, overly posed, low resolution

---

## SUCCESS METRICS

### Performance Targets
- **LCP:** < 2.5s (hero image/video)
- **FID:** < 100ms (interactive)
- **CLS:** < 0.1 (no layout shift)
- **Page Size:** < 2MB initial load

### Engagement Goals
- **Scroll Depth:** 60%+ reach section 4
- **CTA Click Rate:** 15%+ on primary buttons
- **Bounce Rate:** < 40%
- **Time on Page:** 45s+ average

### Conversion Funnel
1. Land on homepage (100%)
2. Scroll to How It Works (70%)
3. View AI Recommendations (50%)
4. Click CTA (15%)
5. Start planning flow (10%)

---

## QUALITY CHECKLIST

### Before Launch
- [ ] All images optimized (WebP + fallback)
- [ ] Hero video under 5MB, multiple formats
- [ ] Alt text on all images
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation tested
- [ ] Mobile responsive (all breakpoints)
- [ ] Cross-browser tested (Chrome, Safari, Firefox)
- [ ] Page speed score 90+ (Lighthouse)
- [ ] No console errors
- [ ] All links functional
- [ ] Forms validated (if present)
- [ ] Analytics tracking implemented

---

## VERSION HISTORY

**Current:** Home V1 (Production, `/`)  
**Next:** Home V2 (Preview, `/home-v2`)  

**V1 Components:**
- HeroSection (home-v2)
- HowItWorksSection (home-v2)
- RecommendationsSection (home-v2)
- GetInspiredGallery (home-v2)
- CuratedCategories (home)
- StatsSection (landing)
- PreFooterCTA (landing)

**V2 Enhancements:**
- 12 full sections
- Advanced animations
- Interactive AI demos
- Testimonial carousels
- Travel showcase slider
- Enhanced metrics

---

**Status:** Production Active  
**Route:** `/`  
**Last Updated:** December 22, 2024  
**Priority:** P0 (Critical)
