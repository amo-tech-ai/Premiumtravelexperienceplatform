# 🏠 HOME PAGE - COMPLETE DESIGN DOCUMENTATION
## Luxury Landing Experience

**Page:** `/` (Homepage)  
**Component:** `Home.tsx`  
**Status:** ✅ Complete  
**Last Updated:** December 22, 2024

---

## 📊 IMPLEMENTATION PROGRESS

```
Overall Design:        100% ████████████████████████
Hero Section:          100% ████████████████████████
How It Works:          100% ████████████████████████
Recommendations:       100% ████████████████████████
Inspiration Gallery:   100% ████████████████████████
Stats Section:         100% ████████████████████████
Pre-Footer CTA:        100% ████████████████████████
Responsive Design:     100% ████████████████████████
Animations:            100% ████████████████████████
Mobile Optimization:   100% ████████████████████████

Status: ✅ Production Ready
```

---

## 📑 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Page Structure](#page-structure)
3. [Section Wireframes](#section-wireframes)
4. [Visual Hierarchy](#visual-hierarchy)
5. [Typography System](#typography-system)
6. [Spacing & Layout](#spacing--layout)
7. [Scroll Effects & Animations](#scroll-effects--animations)
8. [Image Strategy](#image-strategy)
9. [User Journeys](#user-journeys)
10. [Implementation Prompts](#implementation-prompts)

---

## 🎯 OVERVIEW

### **Purpose**
The home page is the primary landing experience that introduces visitors to the Local Scout platform. It showcases AI-powered travel planning through a luxury editorial design with parallax scrolling, curated recommendations, and compelling calls-to-action.

### **Key Features**
- Fullscreen parallax hero with editorial typography
- AI-curated recommendations grid with interactive cards
- Horizontal scrolling inspiration gallery
- Trust-building statistics section
- Strategic CTAs throughout journey
- Scroll-triggered animations
- Mobile-optimized responsive design
- Performance-optimized images

### **Design Philosophy**
```
Aesthetic:    Luxury editorial, calm confidence
Typography:   Serif headlines (Canela 72px), sans-serif body
Colors:       Stone palette (900/600/100), amber accents
Layout:       Generous whitespace, asymmetric balance
Motion:       Purposeful, smooth, spring physics
Images:       High-quality, 4:3 aspect ratio, Unsplash
```

---

## 📐 PAGE STRUCTURE

### **Section Flow**

```
1. HERO SECTION (Fullscreen - 100vh)
   ↓ Parallax background with fade-out
   
2. HOW IT WORKS (2-column layout)
   ↓ Scroll-triggered card reveals
   
3. RECOMMENDATIONS (4-column grid)
   ↓ AI-curated place cards with actions
   
4. INSPIRATION GALLERY (Horizontal scroll)
   ↓ Snap-scroll destination cards
   
5. CURATED CATEGORIES (3-column grid)
   ↓ Category exploration cards
   
6. STATS SECTION (4-column counters)
   ↓ Animated number count-up
   
7. PRE-FOOTER CTA (Centered)
   ↓ Final conversion point
   
8. FOOTER (Full width)
   ↓ Links, social, legal
```

### **Vertical Rhythm**

```
Hero:           100vh (fullscreen)
Padding top:    96px (24 × 4) between sections
Padding bottom: 96px (24 × 4) between sections
Mobile padding: 64px (16 × 4) between sections
Container:      max-w-7xl (1280px)
Side padding:   24px (6 × 4) on all screens
```

---

## 🖼️ SECTION WIREFRAMES

### **1. HERO SECTION**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    [FULLSCREEN IMAGE]                       │
│                   [Parallax Background]                     │
│               [Gradient Overlay: black/40]                  │
│                                                             │
│                                                             │
│                                                             │
│              Your Next Adventure Awaits                     │
│               (Canela Serif, 72px, White)                   │
│                                                             │
│          AI-powered travel planning that feels              │
│            like having a personal concierge                 │
│               (Sans-serif, 18px, White/90)                  │
│                                                             │
│                                                             │
│       ┌──────────────────┐  ┌─────────────────────┐       │
│       │  Plan Your Trip  │  │ Explore Collections │       │
│       │   [Primary CTA]  │  │  [Secondary CTA]    │       │
│       └──────────────────┘  └─────────────────────┘       │
│                                                             │
│                                                             │
│                          Scroll                             │
│                            ↓                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Height: 100vh (fullscreen)
Background: Parallax image (0.5x scroll speed)
Overlay: Gradient from transparent to black/60 at bottom
Text: Center-aligned, white on dark
CTAs: Horizontal flex, gap-4, staggered animation
Scroll indicator: Bouncing chevron at bottom
```

---

### **2. HOW IT WORKS SECTION**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                      HOW IT WORKS                           │
│                    (Overline, Amber)                        │
│                                                             │
│              Your AI Travel Companion                       │
│                (Serif, 48px, Stone-900)                     │
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────┐       │
│  │    [Icon: Chat]     │    │    [Icon: Magic]    │       │
│  │                     │    │                     │       │
│  │  Tell us your dream │    │  AI finds perfect   │       │
│  │  destination and    │    │  places, creates    │       │
│  │  travel style       │    │  your itinerary     │       │
│  │                     │    │                     │       │
│  └─────────────────────┘    └─────────────────────┘       │
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────┐       │
│  │   [Icon: Calendar]  │    │   [Icon: Plane]     │       │
│  │                     │    │                     │       │
│  │  Customize every    │    │  Book and enjoy     │       │
│  │  detail with drag   │    │  your perfect trip  │       │
│  │  & drop             │    │                     │       │
│  │                     │    │                     │       │
│  └─────────────────────┘    └─────────────────────┘       │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Layout: 2x2 grid on desktop, single column mobile
Cards: White background, soft shadow, rounded-2xl
Icons: Large (48px), colored (emerald/amber/blue)
Text: Center-aligned within cards
Animation: Fade-up on scroll, staggered by 100ms
Spacing: gap-8 between cards, p-8 within cards
```

---

### **3. RECOMMENDATIONS SECTION**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                  PERSONALIZED FOR YOU                       │
│                    (Overline, Amber)                        │
│                                                             │
│           Recommendations curated by AI                     │
│              (Serif, 56px, Stone-900)                       │
│                                                             │
│     Our AI concierge analyzes thousands of places           │
│       to find perfect matches for your style                │
│                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐      │
│  │ [Image] │  │ [Image] │  │ [Image] │  │ [Image] │      │
│  │  4:3    │  │  4:3    │  │  4:3    │  │  4:3    │      │
│  │         │  │         │  │         │  │         │      │
│  │ ❤️ ℹ️   │  │ ❤️ ℹ️   │  │ ❤️ ℹ️   │  │ ❤️ ℹ️   │      │
│  ├─────────┤  ├─────────┤  ├─────────┤  ├─────────┤      │
│  │[Category│  │[Category│  │[Category│  │[Category│      │
│  │ La      │  │ Parque  │  │ Museo   │  │ Café    │      │
│  │ Deriva  │  │ Arví    │  │ de Art  │  │ Zeppelin│      │
│  │         │  │         │  │         │  │         │      │
│  │ Desc... │  │ Desc... │  │ Desc... │  │ Desc... │      │
│  │         │  │         │  │         │  │         │      │
│  │★4.8(247)│  │★4.6(892)│  │★4.7(1.5k│  │★4.9(428)│      │
│  │$$$ Poblad│ │$ Elena  │  │$ Centro │  │$$ Laurel│      │
│  │         │  │         │  │         │  │         │      │
│  │[+Trip]  │  │[+Trip]  │  │[+Trip]  │  │[+Trip]  │      │
│  │[Details]│  │[Details]│  │[Details]│  │[Details]│      │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘      │
│                                                             │
│                  [Explore More Places]                      │
│                    (Outline Button)                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Layout: 4 columns desktop, 2 columns tablet, 1 column mobile
Card structure:
  - Image: 4:3 aspect, hover scale 1.05
  - Actions: Heart (save), Info (AI reasoning) - absolute top
  - Category badge: Top of content, secondary variant
  - Title: text-lg, stone-900
  - Description: 2 lines max, text-sm, stone-600
  - Meta: Rating, price level, location - flex row
  - Buttons: "Add to Trip" (primary), "Details" (outline)
  
Animation: Fade-up on scroll, viewport trigger -50px
Hover: Card shadow sm → lg, image scale 1.05
Spacing: gap-6 between cards, p-4 within content
```

---

### **4. INSPIRATION GALLERY**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│     GET INSPIRED          [←] [→]                          │
│   (Overline, Amber)    (Nav Buttons)                       │
│                                                             │
│   Discover your next adventure                              │
│      (Serif, 48px, White)                                   │
│                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────��� →       │
│  │ [Tokyo] │ │ [Paris] │ │  [Bali] │ │ [New    │  Scroll │
│  │         │ │         │ │         │ │  York]  │         │
│  │         │ │         │ │         │ │         │         │
│  │         │ │         │ │         │ │         │         │
│  │         │ │         │ │         │ │         │         │
│  │ Ancient │ │ Romance │ │ Tropical│ │ The city│         │
│  │ temples │ │ art, and│ │ paradise│ │ that    │         │
│  │ meet    │ │ culinary│ │ and     │ │ never   │         │
│  │ neon... │ │ excellen│ │ spiritu.│ │ sleeps  │         │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Background: Stone-900 (dark section)
Text: White
Layout: Horizontal scroll, snap-scroll
Card size: 400px width × 500px height
Cards visible: 3.5 on desktop, 1.2 on mobile
Scroll behavior: Smooth scroll with snap-x snap-mandatory
Navigation: Arrow buttons (desktop only)
Text overlay: Bottom-left, white text on gradient overlay
Animation: Fade-in on scroll, no individual card animation
Spacing: gap-6 between cards, px-6 container padding
```

---

### **5. STATS SECTION**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│         ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│         │   50K+   │  │   1M+    │  │   98%    │          │
│         │  (Large) │  │  (Large) │  │  (Large) │          │
│         │          │  │          │  │          │          │
│         │  Trips   │  │  Places  │  │  Happy   │          │
│         │  Planned │  │  Curated │  │  Travelers│         │
│         └──────────┘  └──────────┘  └──────────┘          │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Layout: 3-4 columns, center-aligned
Numbers: Large serif font (text-5xl), stone-900
Labels: Small sans-serif (text-sm), stone-600
Animation: Count-up animation on scroll into view
Spacing: gap-12 between stat blocks
Background: Light stone-50 or white
Padding: py-24 (vertical)
```

---

### **6. PRE-FOOTER CTA**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              NOT SURE WHAT TO CHOOSE?                       │
│                  (Overline, Muted)                          │
│                                                             │
│         Let the Concierge Plan It For You                   │
│           (Serif, 48px, Stone-900)                          │
│                                                             │
│       Events, restaurants, stays, and experiences —         │
│         intelligently connected in one place.               │
│                  (Body, Stone-600)                          │
│                                                             │
│               ┌───────────────────────┐                     │
│               │ ✨ Ask the Concierge │                     │
│               │   [Primary Button]    │                     │
│               └───────────────────────┘                     │
│                                                             │
│               Takes less than a minute                      │
│                   (Small, Muted)                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Background: Stone-50 with radial gradient overlay
Text: Center-aligned
Button: Large, rounded-full, emerald primary
Icon: Sparkles with pulse animation on hover
Spacing: max-w-2xl container, py-24
Animation: Fade-up on scroll, button scale on hover
```

---

## 🎨 VISUAL HIERARCHY

### **Hierarchy Levels**

```
Level 1: Hero Headline (72px serif, white)
  ↓ Primary focus, immediate attention
  
Level 2: Section Headlines (48-56px serif, stone-900)
  ↓ Section dividers, scannable structure
  
Level 3: Card Titles (18-20px sans, stone-900)
  ↓ Content items, clickable elements
  
Level 4: Body Text (16-18px sans, stone-600)
  ↓ Supporting information, descriptions
  
Level 5: Metadata (14px sans, stone-500)
  ↓ Secondary info, ratings, locations
  
Level 6: Micro-copy (12px sans, stone-400)
  ↓ Labels, overlines, helper text
```

### **Color Emphasis**

```
Primary Actions:   Emerald-600 (CTAs, active states)
Accent Elements:   Amber-600 (overlines, icons, highlights)
Main Content:      Stone-900 (headlines, primary text)
Body Content:      Stone-600 (descriptions, paragraphs)
Secondary Info:    Stone-500 (metadata, labels)
Disabled/Muted:    Stone-400 (placeholders, disabled)
Backgrounds:       White, Stone-50, Stone-900 (dark sections)
```

### **Weight Distribution**

```
Headlines:    font-weight: 300 (light serif for elegance)
Subheadlines: font-weight: 400 (regular for readability)
Body text:    font-weight: 400 (regular, 1.6 line-height)
Buttons:      font-weight: 500 (medium for prominence)
Labels:       font-weight: 600 (semibold for clarity)
Overlines:    font-weight: 600 + uppercase + tracking-wider
```

---

## ✍️ TYPOGRAPHY SYSTEM

### **Font Families**

```
Primary Serif: Canela (or fallback: Georgia, serif)
  - Headlines, hero text, section titles
  - Weights: 300 (light), 400 (regular)
  - Use: Editorial luxury feel
  
Primary Sans: System font stack
  - Body text, UI elements, buttons
  - Weights: 400 (regular), 500 (medium), 600 (semibold)
  - Use: Optimal readability, performance
```

### **Type Scale**

```
Hero:        text-6xl (72px)   line-height: 1.1
Headline:    text-5xl (56px)   line-height: 1.2
Subheading:  text-4xl (48px)   line-height: 1.3
Card Title:  text-lg (18px)    line-height: 1.4
Body:        text-base (16px)  line-height: 1.6
Small:       text-sm (14px)    line-height: 1.5
Tiny:        text-xs (12px)    line-height: 1.4

Mobile Adjustments:
  Hero:      text-4xl (40px) instead of text-6xl
  Headline:  text-3xl (32px) instead of text-5xl
  Subheading text-2xl (24px) instead of text-4xl
```

### **Typography Rules**

```
1. Never use Tailwind font classes on elements with globals.css styles
2. Serif for emotional impact (hero, headlines)
3. Sans-serif for functional content (body, UI)
4. Max line length: 70 characters for body text
5. Letter spacing: Tight on large serif (-0.02em)
6. Letter spacing: Wide on overlines (+0.15em)
7. Text alignment: Center for marketing, left for content
8. Contrast ratio: Minimum 4.5:1 for accessibility
```

---

## 📏 SPACING & LAYOUT

### **Spacing Scale**

```
xs:   4px   (gap-1)   Tight spacing
sm:   8px   (gap-2)   Card internal elements
md:   16px  (gap-4)   Between related items
lg:   24px  (gap-6)   Between cards
xl:   32px  (gap-8)   Between card groups
2xl:  48px  (gap-12)  Between subsections
3xl:  64px  (gap-16)  Mobile section padding
4xl:  96px  (gap-24)  Desktop section padding
```

### **Section Padding**

```
Desktop:
  py-24 (96px top/bottom)
  px-6 (24px left/right)
  
Mobile:
  py-16 (64px top/bottom)
  px-4 (16px left/right)
  
Container:
  max-w-7xl (1280px)
  mx-auto (centered)
```

### **Grid System**

```
Recommendations Grid:
  Desktop:  4 columns (grid-cols-4)
  Tablet:   2 columns (sm:grid-cols-2)
  Mobile:   1 column  (grid-cols-1)
  Gap:      24px (gap-6)
  
How It Works Grid:
  Desktop:  2 columns (grid-cols-2)
  Mobile:   1 column  (grid-cols-1)
  Gap:      32px (gap-8)
  
Stats Grid:
  Desktop:  4 columns (grid-cols-4)
  Tablet:   2 columns (sm:grid-cols-2)
  Mobile:   1 column  (grid-cols-1)
  Gap:      48px (gap-12)
```

### **Card Dimensions**

```
Recommendation Cards:
  Width: Auto (flex-1 in grid)
  Image: 4:3 aspect ratio
  Padding: 16px (p-4)
  Border radius: 16px (rounded-2xl)
  
Inspiration Cards:
  Width: 400px fixed
  Height: 500px
  Padding: None (text overlay)
  Border radius: 12px (rounded-xl)
  
How It Works Cards:
  Padding: 32px (p-8)
  Min height: 300px
  Border radius: 16px (rounded-2xl)
```

---

## 🎬 SCROLL EFFECTS & ANIMATIONS

### **Hero Parallax**

```
Effect: Background scrolls slower than viewport
Implementation:
  - useScroll hook from motion/react
  - useTransform: scrollY [0, 500] → y [0, 250]
  - Background moves at 0.5x scroll speed
  - Creates depth and luxury feel
  
Content Fade:
  - useTransform: scrollY [0, 300] → opacity [1, 0]
  - Content fades out as user scrolls down
  - Smooth transition to next section
  
Scale Effect:
  - useTransform: scrollY [0, 300] → scale [1, 0.95]
  - Subtle zoom-out on scroll
  - Enhances parallax depth
```

### **Scroll-Triggered Reveals**

```
All Sections (except hero):
  - initial: { opacity: 0, y: 20 }
  - whileInView: { opacity: 1, y: 0 }
  - viewport: { once: true, margin: '-100px' }
  - transition: { duration: 0.6 }
  
Effect: Elements fade up as they enter viewport
Trigger: 100px before element enters screen
Once: Animation only happens once (no re-trigger)
```

### **Staggered Animations**

```
Recommendation Cards:
  - Each card: delay based on index
  - delay: index × 0.1 seconds
  - Maximum 4 cards = 0.4s total stagger
  - Creates flowing, sequential reveal
  
How It Works Cards:
  - Stagger: 100ms between cards
  - Creates cascade effect
  - Left-to-right, top-to-bottom
```

### **Hover Animations**

```
Recommendation Cards:
  - Shadow: sm → lg (duration: 200ms)
  - Image scale: 1 → 1.05 (duration: 300ms)
  - Transform: GPU-accelerated
  
Buttons:
  - Primary: scale 1 → 1.05, shadow increase
  - Outline: bg opacity 0 → 0.2
  - Duration: 200ms
  - Easing: ease-in-out
  
Inspiration Cards:
  - Image overlay: opacity 60 → 40
  - Text: slight upward shift (y: 0 → -4px)
```

### **Scroll Indicator**

```
Animation: Bounce
  - animate: { y: [0, 8, 0] }
  - duration: 1.5s
  - repeat: Infinity
  - easing: easeInOut
  
Fade on scroll:
  - Opacity linked to hero fade
  - Disappears as user scrolls
```

### **Count-Up Animation**

```
Stats Section:
  - Numbers animate from 0 to target
  - Duration: 2 seconds
  - Easing: ease-out
  - Trigger: Section enters viewport
  - Once: true (no repeat)
  
Implementation:
  - Use motion value with spring animation
  - Format: Add commas, suffixes (K, M)
  - Smooth, natural counting
```

---

## 🖼️ IMAGE STRATEGY

### **Image Sources**

```
All images: Unsplash.com
  - High quality, royalty-free
  - Consistent aesthetic
  - Professional photography
  
Hero: Landscape/cityscape
  - Resolution: 1920px width minimum
  - Format: JPG (optimized)
  - Aspect: Wide (16:9 or wider)
  
Recommendations: Places/venues
  - Resolution: 800px width
  - Format: WebP with JPG fallback
  - Aspect: 4:3 (consistent)
  
Inspiration: Destinations
  - Resolution: 800px width
  - Format: WebP with JPG fallback
  - Aspect: 5:6 (portrait-ish)
```

### **Image Optimization**

```
Lazy Loading:
  - All images below fold
  - Native loading="lazy" attribute
  - Intersection Observer for custom needs
  
Responsive Images:
  - srcset for different screen sizes
  - Desktop: 800px, Tablet: 600px, Mobile: 400px
  - Art direction: Different crops per breakpoint
  
Compression:
  - JPG: 80% quality
  - WebP: 85% quality
  - Total: ~30-40% smaller files
  
CDN:
  - Unsplash CDN (built-in)
  - w= parameter for dynamic sizing
  - q= parameter for quality control
  - auto=format for automatic WebP
```

### **Image Treatment**

```
Overlays:
  - Hero: Gradient from transparent to black/60
  - Cards: Black/20 default, black/40 on hover
  - Gallery: Black/30 constant
  
Filters:
  - None (preserve original colors)
  - Professional photos don't need filters
  
Border Radius:
  - Cards: rounded-2xl (16px)
  - Gallery: rounded-xl (12px)
  - Consistency across all images
```

### **Aspect Ratios**

```
Hero: Free-form (background cover)
Recommendations: 4:3 (aspect-[4/3])
Inspiration: 5:6 (aspect-[5/6])
Categories: 16:9 (aspect-video)
```

---

## 👤 USER JOURNEYS

### **Journey 1: First-Time Visitor → Sign Up**

**Steps:**
1. User lands on homepage
2. Sees fullscreen hero: "Your Next Adventure Awaits"
3. Scrolls down (parallax creates wow moment)
4. Reads "How It Works" - understands AI concept
5. Sees personalized recommendations
6. Clicks "Info" icon on La Deriva card
7. Reads AI reasoning: "Perfect for special occasions"
8. Clicks "Add to Trip" button
9. Modal appears: "Sign up to create your first trip"
10. User signs up with email
11. Redirected to trip builder with La Deriva pre-added

**Duration:** 2-3 minutes  
**Conversion Points:** 3 (Hero CTA, Recommendation action, Pre-footer CTA)  
**Key Moments:** Parallax scroll, AI reasoning reveal, seamless sign-up flow

---

### **Journey 2: Return Visitor → Explore Destinations**

**Steps:**
1. User returns to homepage (already logged in)
2. Scrolls past hero to recommendations
3. Sees different recommendations (personalized)
4. Scrolls to Inspiration Gallery
5. Swipes through destinations horizontally
6. Clicks on "Bali" card
7. Lands on Bali explore page with curated content
8. Saves 3 places to collection
9. Returns to homepage
10. Clicks "Plan Your Trip" in hero
11. Creates new trip with Bali as destination

**Duration:** 4-5 minutes  
**Engagement:** High (interactive gallery, multiple page views)  
**Outcome:** New trip created with saved places

---

### **Journey 3: Mobile User → Quick CTA**

**Steps:**
1. User opens homepage on mobile (portrait)
2. Hero fills entire screen (optimized)
3. Taps "Plan Your Trip" immediately
4. Skips reading other sections (intent is clear)
5. Lands on trip creation flow
6. Mobile-optimized wizard appears
7. Completes 3-step trip setup
8. Starts exploring recommendations

**Duration:** 1 minute  
**Mobile-Specific:** Touch-friendly buttons, simplified layout  
**Outcome:** Immediate conversion without scrolling

---

### **Journey 4: Research Mode → Learn More**

**Steps:**
1. User arrives from Google search "AI travel planner"
2. Reads hero headline and subheadline
3. Scrolls to "How It Works" section
4. Reads all 4 steps carefully
5. Scrolls to recommendations
6. Hovers over cards (desktop), sees image zoom
7. Clicks "Details" on multiple cards (opens in new tabs)
8. Reads detailed place info
9. Returns to homepage
10. Scrolls to Stats section
11. Sees "50K+ trips planned" - builds trust
12. Scrolls to Pre-footer CTA
13. Clicks "Ask the Concierge"
14. Engages with AI chat to learn more

**Duration:** 8-10 minutes  
**Behavior:** Deliberate, exploratory, comparative  
**Outcome:** Delayed conversion after building confidence

---

## 🛠️ IMPLEMENTATION PROMPTS

### **PROMPT 1: Initialize Home Page Structure**

Create the main Home page component that orchestrates all sections.

**Requirements:**
- Set up a flex column container with minimum full-screen height
- Import all section components: HeroSection, HowItWorksV2, RecommendationsSection, GetInspiredGallery, CuratedCategories, StatsSection, PreFooterCTA
- Arrange sections in vertical flow
- No spacing between sections (each section handles own padding)
- Ensure smooth scroll behavior on the entire page

**Layout:**
- Container: flex flex-col min-h-screen
- Each section: Full-width, self-contained
- Scroll: smooth (CSS or JS)
- Background: White default (sections override as needed)

**Responsive:**
- All sections respond independently
- No global breakpoint management needed
- Mobile-first approach throughout

---

### **PROMPT 2: Build Hero Section with Parallax**

Create a fullscreen hero with parallax background and editorial typography.

**Visual Design:**
- Height: 100vh (fullscreen)
- Background: High-quality landscape image from Unsplash
- Overlay: Gradient from stone-900/40 at top to stone-900/60 at bottom
- Text: White, center-aligned, maximum width 1024px

**Content Structure:**
- Headline: "Your Next Adventure Awaits"
  - Font: Canela serif (fallback Georgia)
  - Size: 72px on desktop, 48px on mobile
  - Weight: 300 (light)
  - Line height: 1.1
  - Color: White
- Subheadline: "AI-powered travel planning that feels like having a personal concierge"
  - Font: System sans-serif
  - Size: 18px (20px on desktop)
  - Color: White with 90% opacity
  - Max width: 640px, centered
- Primary CTA: "Plan Your Trip" button
  - Style: Large, emerald-600 background, white text
  - Height: 56px
  - Padding: 32px horizontal
  - Rounded: 12px
  - Shadow: Large
  - Links to: /trips
- Secondary CTA: "Explore Collections" button
  - Style: Outline, white border/text with 20% opacity
  - Background: White with 10% opacity, backdrop blur
  - Same size as primary
  - Links to: /explore
- Scroll Indicator: Bouncing chevron at bottom
  - Text: "Scroll" in uppercase, small, tracking-wider
  - Icon: ChevronDown from lucide-react
  - Animation: Bounce up-down 8px, 1.5s loop

**Parallax Implementation:**
- Background moves at 0.5x scroll speed
- Background container: 120vh height (allows parallax room)
- Use motion/react useScroll and useTransform hooks
- scrollY [0, 500] transforms to y [0, 250]
- Content fades out: scrollY [0, 300] → opacity [1, 0]
- Content scales down slightly: scrollY [0, 300] → scale [1, 0.95]

**Animations:**
- Headline: Fade up, delay 0.2s, duration 0.6s
- Subheadline: Fade up, delay 0.4s, duration 0.6s
- CTAs: Fade up, delay 0.6s, duration 0.6s
- Scroll indicator: Fade in, delay 1s, then bounce forever

**Responsive:**
- Mobile: Single column, smaller text, tighter spacing
- Tablet: Same as mobile with slightly larger text
- Desktop: Full layout as described
- Touch targets: Minimum 44px height on mobile

---

### **PROMPT 3: Design How It Works Section**

Create a 2x2 grid explaining the platform's four-step process.

**Section Header:**
- Overline: "HOW IT WORKS" in uppercase
  - Color: Amber-600
  - Size: 14px
  - Weight: 600 (semibold)
  - Tracking: 0.15em (wider)
  - Margin bottom: 16px
- Headline: "Your AI Travel Companion"
  - Font: Serif
  - Size: 48px desktop, 32px mobile
  - Color: Stone-900
  - Margin bottom: 24px
- Description (optional): Supporting paragraph
  - Max width: 768px
  - Color: Stone-600
  - Size: 18px

**Grid Layout:**
- Desktop: 2 columns × 2 rows (grid-cols-2)
- Mobile: 1 column (grid-cols-1)
- Gap: 32px between cards (gap-8)
- Container: max-width 1280px, centered

**Card Structure (4 cards total):**
Each card contains:
- Icon: Large 48px lucide-react icon
  - Card 1: MessageSquare (Chat)
  - Card 2: Wand2 (Magic)
  - Card 3: Calendar (Calendar)
  - Card 4: Plane (Plane)
  - Colors: Emerald, Amber, Blue, Purple (one per card)
  - Circular background: Icon color at 10% opacity, 80px diameter
- Title: Step description (e.g., "Tell us your dream destination")
  - Font: Sans-serif, semibold
  - Size: 20px
  - Color: Stone-900
  - Margin top: 24px
- Description: Explanatory text
  - Size: 16px
  - Color: Stone-600
  - Line height: 1.6
  - Max 2 lines

**Card Styling:**
- Background: White
- Padding: 32px all sides
- Rounded: 16px (rounded-2xl)
- Border: 1px stone-200
- Shadow: Small, increases on hover
- Text alignment: Center

**Animations:**
- Container: Fade up on scroll into view
- Cards: Stagger by 100ms each
- Initial state: opacity 0, y +20px
- Animated state: opacity 1, y 0
- Duration: 400ms
- Trigger: When section enters viewport (margin -100px)

**Hover Effects:**
- Card lifts: Shadow small → medium
- Slight scale: 1 → 1.02
- Icon background: Subtle color intensify
- Transition: 200ms ease

---

### **PROMPT 4: Create Recommendations Grid**

Build the AI-curated recommendations section with interactive cards.

**Section Header:**
- Overline: "PERSONALIZED FOR YOU"
  - Same style as How It Works overline
  - Color: Amber-600
- Headline: "Recommendations curated by AI"
  - Font: Serif, 56px desktop, 36px mobile
  - Color: Stone-900
- Description: "Our AI concierge analyzes thousands of places to find the perfect matches for your preferences and travel style."
  - Max width: 768px, centered
  - Color: Stone-600
  - Size: 18px

**Grid Layout:**
- Desktop: 4 columns (grid-cols-4)
- Tablet: 2 columns (sm:grid-cols-2)
- Mobile: 1 column (grid-cols-1)
- Gap: 24px (gap-6)
- Container: max-width 1280px

**Card Structure (4 cards shown, more available):**
Each card has two sections: image and content.

**Image Section:**
- Aspect ratio: 4:3 (aspect-[4/3])
- Image: Object-cover, full width/height
- Hover: Scale to 1.05, smooth transition 300ms
- Overlay: Always present, intensifies on hover
  - Default: Black with 20% opacity
  - Hover: Black with 40% opacity
- Top-right corner: Info button
  - Icon: Info from lucide-react (16px)
  - Background: White with 90% opacity, backdrop blur
  - Size: 32px circle
  - Color: Amber-600
  - Click: Shows AI reasoning tooltip below button
- Top-left corner: Heart button
  - Icon: Heart from lucide-react (16px)
  - Background: Same as info button
  - Filled state: Red-500 fill and stroke when saved
  - Unfilled: Stone-600 when not saved
  - Click: Toggles save state, optimistic update

**AI Reasoning Tooltip (appears on info click):**
- Position: Absolute, inset-x 12px, top 56px
- Background: Stone-900 with 95% opacity, backdrop blur
- Padding: 12px
- Rounded: 8px
- Text: White
- Title: "Why this?" in bold
- Description: AI reasoning text (e.g., "Perfect for special occasions")
- Animation: Fade in, slide down 10px

**Content Section:**
- Padding: 16px all sides
- Background: White

**Category Badge:**
- Component: Badge with secondary variant
- Text: Category name (e.g., "Fine Dining")
- Margin bottom: 8px

**Title:**
- Size: 18px
- Weight: Medium
- Color: Stone-900
- Margin bottom: 8px
- Single line, truncate if needed

**Description:**
- Size: 14px
- Color: Stone-600
- Lines: Max 2, clip overflow with ellipsis
- Margin bottom: 12px

**Meta Info Row:**
- Display: Flex row with gap-3
- Items: Rating, Price level, Location
- Size: 14px
- Color: Stone-600

**Rating:**
- Icon: Star (★) in amber-600
- Number: Bold, stone-900 (e.g., "4.8")
- Review count: In parentheses (e.g., "(247)")

**Price Level:**
- Display: Dollar signs (e.g., "$$$")
- Bold, stone-900

**Location:**
- Text: Neighborhood name
- Truncate if too long

**Action Buttons:**
- Two buttons, equal width, flex gap-2
- "Add to Trip": Primary emerald button
  - Icon: Plus (16px) before text
  - Click: Adds to trip (opens modal if not logged in)
- "Details": Outline button
  - Icon: ExternalLink (16px) before text
  - Click: Opens detail page

**Card Container:**
- Background: White
- Rounded: 16px (rounded-2xl)
- Border: 1px stone-100
- Shadow: Small default, large on hover
- Overflow: Hidden (for image)
- Transition: All 200ms

**Animations:**
- Each card: Fade up on scroll
- Stagger: 100ms per card (max 400ms for 4)
- Viewport trigger: -50px margin
- Once: true (no re-trigger)

**Bottom CTA:**
- Button: "Explore More Places"
- Style: Large, outline variant
- Position: Centered below grid
- Margin top: 48px
- Links to: /explore

---

### **PROMPT 5: Build Inspiration Gallery (Horizontal Scroll)**

Create a horizontally scrolling gallery of destination cards.

**Section Background:**
- Color: Stone-900 (dark section for contrast)
- Padding: 96px vertical desktop, 64px mobile
- All text: White

**Section Header:**
- Layout: Flex row, space-between (title left, buttons right)
- Overline: "GET INSPIRED"
  - Color: Amber-500 (lighter for dark bg)
  - Same uppercase, tracking, weight as others
- Headline: "Discover your next adventure"
  - Font: Serif, 48px desktop, 32px mobile
  - Color: White
- Navigation Buttons (desktop only):
  - Two icon buttons: ChevronLeft and ChevronRight
  - Style: Outline, white border/text with 20% opacity
  - Size: 40px square
  - Hover: White background 20%, smooth transition
  - Click: Scrolls gallery left/right by 400px

**Gallery Container:**
- Display: Flex row
- Overflow: Scroll horizontally, hidden vertically
- Scroll behavior: Smooth
- Snap: snap-x snap-mandatory (cards snap to position)
- Scrollbar: Hidden (scrollbar-hide class)
- Gap: 24px between cards
- Padding: 0 24px (allows peek of next card)

**Destination Cards (6 total, more can be added):**
Each card structure:
- Size: 400px width × 500px height (fixed)
- Snap: snap-start (aligns to scroll container start)
- Rounded: 12px (rounded-xl)
- Overflow: Hidden
- Position: Relative (for text overlay)

**Card Image:**
- Source: Unsplash destination photos
- Size: Cover entire card (object-cover)
- Position: Absolute, fills card
- No hover effects (mobile-friendly)

**Card Overlay:**
- Position: Absolute, covers card
- Background: Gradient from transparent at top to black/60 at bottom
- Pointer events: None (allows click-through to link)

**Card Text:**
- Position: Absolute, bottom-left
- Padding: 24px
- Color: White
- Z-index: Above overlay

**Title:**
- Font: Serif
- Size: 32px
- Weight: 400
- Margin bottom: 8px
- Example: "Tokyo", "Paris", "Bali"

**Subtitle:**
- Font: Sans-serif
- Size: 16px
- Color: White with 90% opacity
- Max 2 lines
- Example: "Ancient temples meet neon streets"

**Card Link:**
- Entire card is clickable
- Links to: /explore?destination=[city-slug]
- Cursor: Pointer
- No visible link styling (seamless)

**Responsive Behavior:**
- Desktop: Shows ~3.5 cards, encouraging scroll
- Tablet: Shows ~2.2 cards
- Mobile: Shows ~1.2 cards
- Cards maintain 400px width across all screens
- Navigation buttons: Hidden on mobile (<768px)

**Scroll Interaction:**
- Desktop: Arrow buttons or mouse drag
- Touch devices: Swipe gesture
- Keyboard: Arrow keys scroll (accessibility)
- Smooth momentum scrolling

**Animations:**
- Section header: Fade up on scroll
- Gallery: Fade in (no individual card animations for performance)
- Transition: 600ms duration

---

### **PROMPT 6: Design Stats Section**

Create a statistics section with animated counters to build trust.

**Section Layout:**
- Background: Stone-50 or White (light, neutral)
- Padding: 96px vertical desktop, 64px mobile
- Container: max-width 1280px, centered

**Grid:**
- Desktop: 4 columns (grid-cols-4)
- Tablet: 2 columns (sm:grid-cols-2)
- Mobile: 1 column (grid-cols-1)
- Gap: 48px (gap-12)
- Text alignment: Center

**Stat Block Structure (4 total):**
Each block contains:
- Number: Large display
  - Font: Serif
  - Size: 56px (text-5xl)
  - Color: Stone-900
  - Weight: 300 (light for elegance)
  - Format: Add commas, suffixes (50K+, 1M+, 98%)
- Label: Descriptive text
  - Font: Sans-serif
  - Size: 14px
  - Color: Stone-600
  - Weight: 400
  - Margin top: 8px

**Example Stats:**
1. "50K+" → "Trips Planned"
2. "1M+" → "Places Curated"
3. "98%" → "Happy Travelers"
4. "24/7" → "AI Concierge"

**Counter Animation:**
- Start: 0
- End: Target number
- Duration: 2 seconds
- Easing: ease-out (fast start, slow end)
- Trigger: When section enters viewport
- Once: true (animate only once)
- Format: Add commas during animation

**Implementation:**
- Use motion value from motion/react
- Spring animation for natural feel
- toFixed(0) for whole numbers
- Add suffixes (K, M, %) after animation completes

**Entrance Animation:**
- Fade up: opacity 0 → 1, y 20 → 0
- Duration: 600ms
- Viewport trigger: -100px margin
- Once: true

---

### **PROMPT 7: Create Pre-Footer CTA Section**

Build a final call-to-action before the footer to capture remaining conversions.

**Section Background:**
- Color: Stone-50
- Overlay: Radial gradient (white/50 from center to transparent)
- Opacity: 50% on overlay
- Padding: 96px vertical desktop, 64px mobile

**Content Container:**
- Max width: 640px (narrower for focus)
- Centered: mx-auto
- Text alignment: Center
- Spacing: vertical gap 24px (space-y-6)

**Overline:**
- Text: "NOT SURE WHAT TO CHOOSE?"
- Style: Uppercase, 12px, tracking-wider
- Color: Stone-500 (muted)
- Weight: 600

**Headline:**
- Text: "Let the Concierge Plan It For You"
- Font: Serif
- Size: 48px desktop, 32px mobile
- Color: Stone-900
- Weight: 400

**Description:**
- Text: "Events, restaurants, stays, and experiences — intelligently connected in one place."
- Font: Sans-serif
- Size: 18px
- Color: Stone-600
- Weight: 300 (light)
- Max width: 512px, centered

**CTA Button:**
- Text: "Ask the Concierge"
- Icon: Sparkles (before text, 20px)
- Style: Large primary button
  - Background: Emerald-600
  - Text: White
  - Height: 56px
  - Padding: 32px horizontal
  - Rounded: Full (rounded-full pill shape)
  - Shadow: Large
- Hover effects:
  - Scale: 1 → 1.05
  - Shadow: Increase
  - Icon: Pulse animation
- Links to: /concierge

**Helper Text:**
- Text: "Takes less than a minute"
- Size: 12px
- Color: Stone-400
- Weight: 500
- Margin top: 8px (tight to button)

**Animations:**
- Container: Fade up on scroll
- Duration: 600ms
- Viewport once: true
- Button hover: Scale with 300ms transition
- Icon pulse: On button hover, 1s duration

---

### **PROMPT 8: Optimize for Mobile Experience**

Ensure all sections are touch-friendly and performant on mobile devices.

**Global Mobile Adjustments:**
- Touch targets: Minimum 44px height and width
- Font sizes: Scale down by 1-2 levels
- Padding: Reduce from 96px to 64px vertical
- Gaps: Reduce from 32px to 24px
- Images: Load smaller sizes (srcset or w= param)

**Hero Section Mobile:**
- Height: 100vh (same, but adjust content size)
- Headline: 40px instead of 72px
- Buttons: Stack vertically (flex-col)
- Button width: Full width on small screens
- Spacing: Reduce gap from 16px to 12px

**How It Works Mobile:**
- Grid: 1 column (grid-cols-1)
- Cards: Full width, comfortable padding
- Icons: Maintain 48px (touch-friendly)
- Text: Slightly smaller but still readable

**Recommendations Mobile:**
- Grid: 1 column (grid-cols-1)
- Cards: Full width, no horizontal scroll
- Images: Load 400px width version
- Touch: Tap heart/info (no hover states)
- Actions: Buttons stack vertically if needed

**Inspiration Gallery Mobile:**
- Cards: Show 1.2 cards (peek next)
- Swipe: Natural touch gesture
- Buttons: Hide navigation arrows
- Snap: Enable for easy browsing

**Stats Mobile:**
- Grid: 1 column or 2 columns (2x2)
- Numbers: Maintain large size (important)
- Spacing: Comfortable gaps

**Pre-Footer Mobile:**
- Text: Smaller headlines (32px)
- Button: Full width below 640px
- Padding: Reduce overall

**Performance:**
- Lazy load: All images below fold
- Animations: Reduce motion for users with prefers-reduced-motion
- Bundle: Code-split sections if possible
- Critical CSS: Inline above-fold styles

**Touch Gestures:**
- Swipe: Horizontal gallery
- Tap: All interactive elements
- No hover: Use active states instead
- Feedback: Ripple or scale on tap

---

### **PROMPT 9: Implement Scroll Animations System**

Set up a consistent animation system across all sections using motion/react.

**Animation Pattern:**
Use whileInView for all scroll-triggered animations to improve performance and user experience.

**Standard Fade-Up:**
```
Properties:
  initial: { opacity: 0, y: 20 }
  whileInView: { opacity: 1, y: 0 }
  viewport: { once: true, margin: '-100px' }
  transition: { duration: 0.6 }

When to use:
  - Section headers
  - Text blocks
  - Single elements
```

**Staggered Children:**
```
Parent container:
  initial: "hidden"
  whileInView: "visible"
  viewport: { once: true }
  
Variants:
  hidden: { opacity: 0 }
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }

Child elements:
  variants: {
    hidden: { opacity: 0, y: 20 }
    visible: { opacity: 1, y: 0 }
  }

When to use:
  - Card grids
  - Lists
  - Multiple related items
```

**Parallax Scroll:**
```
Setup:
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 250])
  
Application:
  <motion.div style={{ y }}>
    Background content
  </motion.div>

When to use:
  - Hero backgrounds
  - Large images
  - Depth effects
```

**Hover States:**
```
Button example:
  whileHover: { scale: 1.05 }
  whileTap: { scale: 0.95 }
  transition: { duration: 0.2 }

Card example:
  whileHover: { y: -4, shadow: 'lg' }
  transition: { duration: 0.3 }

When to use:
  - Interactive elements
  - Cards
  - Buttons
```

**Count-Up Animation:**
```
Setup:
  const count = useMotionValue(0)
  const rounded = useTransform(count, Math.round)
  
Animation:
  useEffect(() => {
    const controls = animate(count, targetValue, {
      duration: 2,
      ease: 'easeOut'
    })
    return controls.stop
  }, [])

When to use:
  - Statistics
  - Numbers that should emphasize growth
```

**Performance Guidelines:**
- Use transform and opacity only (GPU-accelerated)
- Set once: true on viewport triggers
- Avoid animating width, height, top, left
- Use will-change sparingly
- Disable animations on low-power mode

---

### **PROMPT 10: Add Curated Categories Section**

Create a category exploration section with visual cards.

**Section Header:**
- Overline: "EXPLORE BY CATEGORY"
- Headline: "Find exactly what you're looking for"
- Description: Optional supporting text
- Alignment: Center
- Colors: Same pattern as other sections

**Grid Layout:**
- Desktop: 3 columns (grid-cols-3)
- Tablet: 2 columns (sm:grid-cols-2)
- Mobile: 1 column (grid-cols-1)
- Gap: 24px (gap-6)

**Category Card Structure:**
Each card represents a category (e.g., Dining, Stays, Experiences).

**Image Section:**
- Aspect: 16:9 (aspect-video)
- Image: Category representative photo
- Overlay: Black with 30% opacity
- Hover: Overlay lightens to 20%

**Text Overlay (on image):**
- Position: Absolute, bottom-left
- Padding: 24px
- Color: White
- Category name: 24px, serif, bold
- Count: "120+ places" below name, 14px, opacity 80%

**Card Styling:**
- Rounded: 16px
- Overflow: Hidden
- Cursor: Pointer
- Border: None (image fills)
- Shadow: Medium on hover

**Interactions:**
- Click: Navigate to /explore?category=[slug]
- Hover: Image scale 1.05, overlay lightens
- Transition: 300ms smooth

**Categories to Include:**
1. Restaurants & Dining
2. Stays & Hotels
3. Experiences & Activities
4. Coffee & Cafés
5. Nightlife & Entertainment
6. Nature & Parks

**Animation:**
- Staggered fade-up
- Delay: 100ms per card
- Trigger: Viewport entry

---

### **PROMPT 11: Polish and Accessibility**

Ensure the homepage meets accessibility standards and is production-ready.

**Semantic HTML:**
- Use proper heading hierarchy (h1 → h2 → h3)
- Hero headline: h1 (only one per page)
- Section headlines: h2
- Card titles: h3
- Landmark regions: nav, main, section, footer
- ARIA labels where needed

**Keyboard Navigation:**
- All interactive elements: Focusable
- Tab order: Logical top-to-bottom, left-to-right
- Focus indicators: Visible, high contrast
- Skip links: "Skip to main content" at top
- Escape key: Closes modals/tooltips

**Screen Reader Support:**
- Alt text: All images (descriptive, concise)
- ARIA labels: Icon-only buttons
- Live regions: For dynamic content (counters)
- Heading structure: Proper hierarchy
- Link text: Descriptive (not "click here")

**Color Contrast:**
- Text on backgrounds: Minimum 4.5:1 ratio
- Large text (18px+): Minimum 3:1 ratio
- Interactive elements: Clear focus states
- Test: Use browser DevTools contrast checker

**Motion Preferences:**
- Respect prefers-reduced-motion
- Disable parallax if reduced motion
- Disable complex animations
- Keep essential animations only
- Provide alternative static experience

**Performance:**
- Lighthouse score: 90+ on all metrics
- First Contentful Paint: Under 1.5s
- Largest Contentful Paint: Under 2.5s
- Cumulative Layout Shift: Under 0.1
- Total Blocking Time: Under 300ms

**SEO Optimization:**
- Title tag: Unique, descriptive, under 60 chars
- Meta description: Compelling, under 160 chars
- Open Graph tags: For social sharing
- Structured data: Schema.org markup
- Canonical URL: Prevent duplicates

**Testing Checklist:**
- Browser testing: Chrome, Safari, Firefox, Edge
- Device testing: iPhone, iPad, Android phones/tablets
- Screen reader: VoiceOver, NVDA, JAWS
- Keyboard only: Full navigation possible
- Slow network: 3G throttling test
- Low power mode: Animations disabled

---

### **PROMPT 12: Final Integration and Launch**

Bring all sections together and prepare for production deployment.

**Final Assembly:**
1. Verify all sections are in correct order
2. Check padding/spacing consistency
3. Test scroll flow top to bottom
4. Ensure all links work correctly
5. Verify all images load properly
6. Test all CTAs lead to correct destinations

**Cross-Section Consistency:**
- Typography: Same fonts, sizes across sections
- Colors: Consistent stone/amber/emerald palette
- Spacing: Uniform padding (96px/64px pattern)
- Animations: Consistent timing and easing
- Shadows: Same levels (sm, md, lg)

**Content Review:**
- Headlines: Compelling, action-oriented
- Descriptions: Clear, benefit-focused
- CTAs: Strong verbs, clear outcomes
- Images: High-quality, on-brand
- Alt text: Descriptive, concise

**Performance Optimization:**
- Image compression: 80% quality JPG, 85% WebP
- Code splitting: Lazy load below-fold sections
- Font loading: Display swap for web fonts
- Critical CSS: Inline above-fold styles
- Prefetch: Preload hero image

**Analytics Setup:**
- Page view tracking
- CTA click tracking
- Scroll depth tracking
- Time on page
- Exit points

**Launch Checklist:**
- [ ] All links tested and working
- [ ] All images loading correctly
- [ ] Mobile responsive on all devices
- [ ] Accessibility score 100
- [ ] Performance score 90+
- [ ] SEO tags in place
- [ ] Analytics configured
- [ ] Error tracking enabled
- [ ] Cross-browser tested
- [ ] Content reviewed and approved

---

## 🔗 ROUTES & LINKS

### **Primary Route**
```
/ → Home.tsx (homepage)
```

### **Internal Navigation Links**

| Element | Destination | Purpose |
|---------|-------------|---------|
| Hero "Plan Your Trip" | `/trips` | Start trip creation |
| Hero "Explore Collections" | `/explore` | Browse places |
| Recommendation "Add to Trip" | `/trips?add={id}` | Add place to trip |
| Recommendation "Details" | `/places/{id}` | View place details |
| Inspiration card click | `/explore?destination={slug}` | Explore destination |
| Category card click | `/explore?category={slug}` | Filter by category |
| "Explore More Places" | `/explore` | Full catalog |
| Pre-footer "Ask Concierge" | `/concierge` | AI chat |
| Logo (in nav) | `/` | Return home |

### **External Links**
- None on homepage (all internal)

### **Deep Linking**
```
/?ref=google       → Track marketing source
/?utm_campaign=x   → Campaign tracking
/#recommendations  → Scroll to section (optional)
```

---

## 📱 RESPONSIVE BREAKPOINTS

### **Breakpoint Strategy**
```
Mobile:    0-639px     (sm breakpoint)
Tablet:    640-1023px  (md breakpoint)
Desktop:   1024px+     (lg breakpoint)
```

### **Layout Changes by Breakpoint**

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Hero text | 40px | 56px | 72px |
| Hero CTAs | Stacked vertical | Horizontal row | Horizontal row |
| How It Works grid | 1 column | 1 column | 2 columns |
| Recommendations | 1 column | 2 columns | 4 columns |
| Inspiration cards | 1.2 visible | 2.2 visible | 3.5 visible |
| Stats grid | 1 column | 2 columns | 4 columns |
| Section padding | 64px | 80px | 96px |
| Container padding | 16px | 20px | 24px |

---

**Document Version:** 1.0.0  
**Lines:** 999  
**Status:** ✅ Complete  
**Implementation Ready:** Yes
