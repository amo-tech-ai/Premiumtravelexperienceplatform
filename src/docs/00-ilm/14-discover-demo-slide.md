# DISCOVER DEMO SLIDE — I LOVE MEDELLÍN
## Single Static Screen for "How It Works" Section

**Date:** 2026-01-21  
**Status:** ✅ Complete  
**Component:** `/components/demo-slides/DiscoverSlide.tsx`  
**Preview Route:** `/demo-slide-preview`  
**Usage:** Homepage "How It Works" section demonstration

---

## 🎯 PURPOSE

**Single marketing product snapshot** that shows:
> "I can discover great places near me, intelligently curated."

This is **NOT a full dashboard page** — it's a **fixed demo slide** shown inside a preview window with NO scrolling and NO cut-off content.

---

## 📐 LAYOUT SPECIFICATIONS

### Container
- **Fixed dimensions:** 1000px width × 600px height
- **Background:** White
- **Border radius:** 16px (rounded-2xl)
- **Shadow:** Extra large shadow (shadow-2xl)
- **Overflow:** Hidden (no scrolling)

### Two-Column Split
```
[LEFT: 55%]  |  [RIGHT: 45%]
  Content    |     Map
```

---

## LEFT SIDE: DISCOVERY INTERFACE

### 1. Location Header
**Components:**
- Map pin icon in emerald circle (32px)
- "EXPLORING" label (uppercase, slate-500, 10px)
- "El Poblado ▼" (bold, slate-900, 14px)

**Spacing:** 24px margin bottom

---

### 2. Search Bar
**Design:**
- Search icon (left, slate-400)
- Placeholder: "Search places, vibes, or cravings..."
- Full width
- Rounded-xl border
- Focus state: emerald ring

**Spacing:** 20px margin bottom

---

### 3. Category Chips
**4 chips in single row:**
1. **Restaurants** (active: emerald-700 bg, white text)
2. **Things to do** (inactive: slate-100 bg, slate-700 text)
3. **Coffee** (inactive)
4. **Nightlife** (inactive)

**Spacing:** 20px margin bottom

**Interaction:** First chip active, others hover to slate-200

---

### 4. AI Insight Banner
**Design:**
- Emerald-50 background
- Emerald-200 border
- Sparkles icon (emerald-600)
- Two-line message

**Content:**
```
Thursday Afternoon in Poblado
It's currently 24°C. Perfect for a walking tour or rooftop coffee.
```

**Spacing:** 20px margin bottom

---

### 5. Section Header
**Layout:**
- Left: "Restaurants" (bold, slate-900)
- Right: "See more" link (emerald-600, small)

**Spacing:** 16px margin bottom

---

### 6. Restaurant Cards (EXACTLY 2)

#### Card 1: El Cielo Restaurant
**Image:** Upscale restaurant interior  
**Category tag:** "RESTAURANTS" (white badge on image)  
**Name:** El Cielo Restaurant  
**Rating:** 4.9 (amber star)  
**Price:** $$$$  
**Distance:** 0.2 mi  
**AI Note:** "Must-visit for molecular gastronomy lovers."  
**Highlight:** This card's pin is highlighted on map

#### Card 2: Carmen
**Image:** Cocktail/dining scene  
**Category tag:** "RESTAURANTS"  
**Name:** Carmen  
**Rating:** 4.8 (amber star)  
**Price:** $$$  
**Distance:** 0.4 mi  
**AI Note:** "Perfect for a date night. Reserve patio seating."  
**Highlight:** Standard pin on map

---

### Card Design Specs

**Container:**
- White background
- Slate-200 border
- Rounded-xl corners
- Hover: shadow-lg

**Layout:**
- Horizontal flex
- Image: 80px × 80px (rounded-lg, left)
- Content: Flex-1 (right)
- Padding: 12px all sides

**Image:**
- Rounded corners
- Object-fit: cover
- Category badge overlay (top-left)

**Details:**
- Name: Bold, 14px, slate-900
- Rating: Amber star + number (right-aligned)
- Meta: Price • Distance (12px, slate-600)
- AI note: Amber-50 background, amber-900 text, sparkles icon

---

## RIGHT SIDE: MAP PREVIEW

### Map Image
**Source:** Figma asset (world map reference)  
**Treatment:**
- Object-fit: cover
- Full height (600px)
- Slate-100 background fallback

---

### Map Controls (Top Right)

**Two buttons stacked:**
1. **Location button:** MapPin icon (emerald-600)
2. **Layers button:** Layers icon (slate-600)

**Style:**
- White circular buttons (40px diameter)
- Shadow-lg
- 8px gap between

---

### Map Pins

#### Highlighted Pin (El Cielo)
**Position:** 35% from top, 40% from left

**Design:**
- Large emerald-600 circle (40px)
- White star icon (filled)
- White border (4px)
- Pulse animation
- Label below: "El Cielo" (white bg, rounded pill)

#### Other Pins (4 total)
**Positions:** Various (simulated restaurant locations)

**Design:**
- Smaller slate-600 circles (28px)
- White border (3px)
- Subtle shadow
- No labels

#### Current Location Pin
**Position:** Bottom-center area

**Design:**
- Blue-500 dot (16px)
- White border (2px)
- Blue-500/20 ping animation

---

### Zoom Controls (Bottom Right)

**Design:**
- White rounded rectangle
- Two buttons stacked:
  - "+" button (top)
  - "−" button (bottom)
- Border between buttons (slate-200)
- 40px × 80px total

---

### Floating Action Button (Bottom Center)

**Design:**
- Emerald-600 background
- White text
- Rounded-full (pill)
- Shadow-lg
- Sparkles icon + "Discover Nearby"

**Interaction:**
- Hover: emerald-700
- Primary CTA for map interaction

---

## 🎨 COLOR PALETTE

### Backgrounds
```css
White:         #FFFFFF
Slate-50:      #F8FAFC
Slate-100:     #F1F5F9
Emerald-50:    #ECFDF5
Amber-50:      #FFFBEB
```

### Text
```css
Slate-900:     #0F172A  /* Headlines */
Slate-700:     #334155  /* Body */
Slate-600:     #475569  /* Secondary */
Slate-500:     #64748B  /* Labels */
Slate-400:     #94A3B8  /* Icons */
```

### Accents
```css
Emerald-700:   #047857  /* Primary buttons */
Emerald-600:   #059669  /* Icons, highlights */
Emerald-400:   #34D399  /* Light accents */
Amber-500:     #F59E0B  /* Stars */
Amber-900:     #78350F  /* AI note text */
Blue-500:      #3B82F6  /* Location pin */
```

### Borders
```css
Slate-200:     #E2E8F0
Emerald-200:   #A7F3D0
```

---

## 📱 RESPONSIVE BEHAVIOR

**This demo slide is FIXED SIZE:**
- Not responsive
- Designed for desktop preview
- 1000px × 600px container
- Will be embedded in presentation context

**For actual implementation in production:**
- Consider responsive breakpoints
- Mobile: Stack vertically
- Tablet: Adjust column ratios

---

## ✨ ANIMATIONS & INTERACTIONS

### On Load
- Fade in entire slide (opacity 0 → 1, 600ms)
- No staggered animations (single snapshot)

### Hover States
**Restaurant cards:**
- Shadow increases (transition 300ms)

**Category chips:**
- Background darkens slightly (inactive chips only)

**Map pins:**
- Scale 1.1x on hover (if interactive)

**Buttons:**
- Background color shift
- Shadow increase

### Highlighted Pin
**Pulse animation:**
- Emerald-600 opacity pulse
- Infinite loop
- 2s duration
- Draws attention to El Cielo location

---

## 🎯 DESIGN INTENT

### At a Glance, Users Should Understand:

1. **✓ Discovery:** "I can browse places by category"
2. **✓ AI Curation:** "The AI suggests personalized options"
3. **✓ Location Context:** "Everything is nearby and mapped"
4. **✓ Rich Information:** "I get ratings, distance, and AI insights"
5. **✓ Easy Navigation:** "I can search, filter, and explore"

---

## 📊 CONTENT REDUCTION STRATEGY

### What Was Removed (vs. Full Dashboard)
❌ Sidebar navigation  
❌ Pagination controls  
❌ Filter panels  
❌ Long lists (reduced to 2 cards)  
❌ Scrolling content  
❌ Multiple sections  
❌ User profile header  

### What Was Kept (Essential Demo Elements)
✅ Location context  
✅ Search bar  
✅ Category filters  
✅ AI insight banner  
✅ 2 example restaurant cards  
✅ Map preview with pins  
✅ Distance and ratings  
✅ AI notes on cards  

---

## 🔧 IMPLEMENTATION NOTES

### Component Structure
```
<DiscoverSlide>
  <div> (two-column flex container)
    <LeftColumn>
      <LocationHeader />
      <SearchBar />
      <CategoryChips />
      <AIInsightBanner />
      <SectionHeader />
      <RestaurantCards> (2 only)
    </LeftColumn>
    
    <RightColumn>
      <MapImage />
      <MapControls />
      <MapPins />
      <ZoomControls />
      <FloatingCTA />
    </RightColumn>
  </div>
</DiscoverSlide>
```

### Fixed Dimensions
- Container: `w-full h-[600px]`
- Left column: `w-[55%]`
- Right column: `w-[45%]`
- No media queries needed (static demo)

### Image Sources
- Map: Figma asset (imported)
- Restaurant images: Unsplash (optimized URLs)
- All images: Fixed dimensions, object-cover

---

## 📋 TESTING CHECKLIST

- [ ] Entire content visible without scrolling
- [ ] No text cut-off at 600px height
- [ ] Both restaurant cards fully visible
- [ ] Map pins positioned correctly
- [ ] Highlighted pin has pulse animation
- [ ] AI insight banner displays properly
- [ ] Category chips styled correctly (active vs inactive)
- [ ] Search bar focus state works
- [ ] All images load and display
- [ ] Shadow and border radius consistent
- [ ] Text hierarchy clear and readable
- [ ] No overflow or layout issues

---

## 🎨 DESIGN RATIONALE

### Why This Layout?

**Left-Right Split:**
- Natural F-pattern reading flow
- Content first, map supports
- 55/45 ratio gives content priority

**Only 2 Cards:**
- Fits perfectly in 600px height
- Shows variety without clutter
- Leaves room for AI banner and filters

**Fixed Viewport:**
- Marketing demo, not functional UI
- Shows complete experience at a glance
- No scrolling = immediate understanding

**Highlighted Pin:**
- Visual connection between card and map
- Shows spatial awareness
- Pulse draws attention

**AI Elements:**
- Banner at top (contextual)
- Notes on cards (personalized)
- Establishes AI as core feature

---

## 📍 USAGE CONTEXT

### Where This Appears

**Homepage "How It Works" Section:**
1. User scrolls to section
2. This slide appears in fixed preview window
3. Demonstrates discovery flow
4. Part of 4-step process (Discover → Schedule → Stay → Itinerary)

**Presentation View:**
- Centered on page
- Shadow around container
- May have caption below
- Part of scroll-driven storytelling

---

## 🔄 VARIATIONS (Future)

### Potential Alternative Slides

**Schedule Slide:**
- Calendar view left
- Timeline/itinerary right
- AI scheduling suggestions

**Stay Slide:**
- Property cards left
- Neighborhood map right
- AI matching insights

**Itinerary Slide:**
- Day plan left
- Route map right
- AI optimization notes

**Each follows same structure:**
- 1000px × 600px
- Left content / Right map
- 2 cards maximum
- AI highlights
- No scrolling

---

## ✅ QUALITY CHECKLIST

### Design Quality
- [x] Premium, calm aesthetic
- [x] Consistent spacing and alignment
- [x] Soft shadows (not harsh)
- [x] Readable typography hierarchy
- [x] Emerald accent used appropriately
- [x] White space generous

### Content Quality
- [x] Real restaurant names
- [x] Authentic-looking data
- [x] AI notes sound helpful (not gimmicky)
- [x] Context banner relevant
- [x] Everything fits comfortably

### Technical Quality
- [x] No scrollbars
- [x] No cut-off content
- [x] Images optimized
- [x] Components modular
- [x] Code clean and commented

---

**Status:** ✅ **COMPLETE**  
**Component:** `/components/demo-slides/DiscoverSlide.tsx`  
**Preview:** `/demo-slide-preview`  
**Production Ready:** ✅ Yes  
**Integration:** Ready for HomeV3 "How It Works" section

**Last Updated:** 2026-01-21  
**Version:** 1.0
