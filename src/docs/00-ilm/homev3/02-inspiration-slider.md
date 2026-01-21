# HOME V3 — SECTION 02: GET INSPIRED SLIDER
## Design Prompt: Horizontal Scrolling Image Carousel

**Purpose:** Inspire wanderlust through curated destination imagery and encourage exploration

---

## LAYOUT STRUCTURE

### Section Container
**Full-width treatment:**
- Dark emerald background (emerald-950)
- Creates strong visual break from white hero
- Premium, sophisticated feel
- 96px vertical padding (desktop)
- 64px vertical padding (mobile)

### Content Width
- Maximum 1120px (7xl)
- Horizontally centered
- Side padding: 24px (mobile), 48px (desktop)

---

## SECTION HEADER

### Layout
**Two-column flex layout:**
- **Left:** Section title
- **Right:** Navigation controls (desktop only)
- Aligned to opposite edges
- 40px bottom margin before slider

### Section Title
**Typography:**
- Serif font family (editorial)
- Large size (3xl mobile, 4xl desktop)
- Bold weight
- White color (high contrast on dark)
- No text wrapping preferred

**Content:** "Get Inspired by Colombia"

**Tone:** Inviting, aspirational, discovery-focused

---

### Navigation Controls (Desktop Only)

#### Button Style
- Outline variant
- Semi-transparent white border (20% opacity)
- Semi-transparent white background (10% opacity)
- White icon color
- Rounded corners (8px)
- 40x40px size (icon button)
- Chevron icons (left/right)

#### Interaction States
- **Hover:** Background opacity increases to 20%
- **Active:** Slight scale down (0.95x)
- **Disabled:** 50% opacity when at start/end
- Smooth transitions (200ms)

#### Functionality
- Left button: Scroll 500px to the left
- Right button: Scroll 500px to the right
- Smooth scroll behavior
- Gap of 8px between buttons

**Hide on Mobile:** Touch users can swipe naturally

---

## SLIDER CONTAINER

### Scroll Behavior
**Horizontal overflow:**
- Scrollable container
- Hide scrollbar (custom CSS)
- Smooth momentum scrolling
- Snap to slides (optional)
- Touch-friendly on mobile

**Performance:**
- Hardware-accelerated scrolling
- No jank or lag
- 60fps scroll animation

---

## SLIDE CARDS

### Quantity
**5 curated slides** representing different Colombia experiences:
1. Medellín skyline
2. Coffee region escapes
3. Caribbean coast
4. Mountain adventures
5. Urban exploration

### Card Dimensions
- **Width:** 350px (fixed)
- **Height:** 400px (fixed)
- **Aspect Ratio:** 7:8 (portrait-ish)
- Maintains size across all breakpoints

### Card Spacing
- Horizontal gap: 24px between slides
- First slide: 0px left margin
- Last slide: 24px right padding (breathing room)

---

## SLIDE CARD DESIGN

### Image Treatment

#### Visual Quality
- High-resolution photography
- Professionally shot or curated
- Vibrant, saturated colors
- Sharp focus on subject
- Good composition

#### Styling
- Rounded corners (16px)
- Full coverage (object-cover)
- No borders
- Overflow hidden

#### Interactions
- **Hover:** Scale image 1.1x (zoom in)
- **Transition:** 500ms ease-out
- Cursor: pointer
- Smooth, fluid motion

**Purpose:** Creates dynamic, engaging interaction

---

### Gradient Overlay
**Purpose:** Ensure caption readability

**Specifications:**
- CSS gradient from bottom to top
- Bottom: Black at 70% opacity
- Middle: Black at 10% opacity
- Top: Transparent
- Positioned absolutely over image

**Effect:** Darkens bottom third while keeping top bright

---

### Caption

#### Positioning
- Absolute position
- Bottom: 24px from edge
- Left/Right: 24px from edges
- Z-index above gradient

#### Typography
- Serif font family (matches section title)
- Large size (20px)
- Normal weight (not bold)
- White color (100% opacity)
- Single line preferred

**Content Examples:**
- "Medellín skyline"
- "Coffee region escapes"
- "Caribbean coast"
- "Mountain adventures"
- "Urban exploration"

**Tone:** Evocative, concise, descriptive

---

## RESPONSIVE BEHAVIOR

### Desktop (> 1024px)
- Navigation controls visible
- 5 slides partially visible
- Smooth scroll with buttons
- Mouse wheel scrolling enabled

### Tablet (768px - 1024px)
- Hide navigation controls
- Swipe-based scrolling
- 3-4 slides partially visible
- Touch-optimized

### Mobile (< 768px)
- Touch/swipe only
- 1.5-2 slides visible
- Easier thumb navigation
- Snap to slides for clarity

---

## SCROLL MECHANICS

### Snap Points (Optional)
- CSS scroll-snap-type: x mandatory
- Each slide is a snap point
- Prevents awkward mid-slide stops
- Feels polished and intentional

**Consideration:** May reduce fluidity; test both approaches

### Momentum Scrolling
- Native browser momentum
- Feels natural on touch devices
- No custom JavaScript needed
- Better performance

---

## ANIMATION & MOTION

### On Scroll Into View
**Stagger entrance:**
1. Section title fades in + slides up (0ms delay)
2. Navigation controls fade in (100ms delay)
3. Slides fade in from right, one by one (150ms stagger)

**Motion Values:**
- Translate: 20px from right
- Opacity: 0 to 1
- Duration: 400-500ms
- Easing: ease-out

**Purpose:** Draws attention, feels dynamic

### Hover Animation
- Scale transform on image
- Smooth transition
- No layout shift
- Isolated to image layer (not entire card)

---

## CONTENT STRATEGY

### Image Selection Criteria

#### Diversity
- Mix of landscapes, cityscapes, culture
- Represent different regions of Colombia
- Show variety of experiences
- Balance color palettes

#### Emotional Impact
- Aspirational but achievable
- Authentic moments
- Strong composition
- Compelling subjects

#### Technical Quality
- Minimum 1200px width
- Sharp, well-lit
- Professional grade
- Color-corrected

### Caption Writing

#### Style
- Concise (2-4 words ideal)
- Descriptive, not salesy
- Evoke emotion or curiosity
- Avoid clichés

#### Examples
✅ "Coffee region escapes"  
✅ "Caribbean coast"  
❌ "Discover Amazing Coffee Tours!"  
❌ "The Best Beach You'll Ever See"

---

## ACCESSIBILITY

### Keyboard Navigation
- Tab to navigation buttons
- Arrow keys scroll slider
- Focus visible on active slide
- Escape key exits focus

### Screen Readers
- Announce slide count ("Slide 1 of 5")
- Read caption on focus
- Descriptive alt text for images
- ARIA labels on navigation buttons

### Motion Preferences
- Respect prefers-reduced-motion
- Disable auto-scroll if set
- Simplify entrance animations
- Keep hover effects minimal

---

## PREMIUM DESIGN TOUCHES

### Visual Refinement
1. **Gradient overlay:** Ensures text is always readable
2. **Rounded corners:** Softer, more modern than sharp edges
3. **Generous spacing:** Slides don't feel cramped
4. **High-quality images:** Sets premium tone
5. **Serif captions:** Editorial, sophisticated feel

### Interaction Details
1. **Smooth scrolling:** Native feel, no jank
2. **Hover zoom:** Engaging without being gimmicky
3. **Button states:** Clear feedback on interaction
4. **Snap points:** Polished, intentional positioning

### Color Psychology
- **Dark emerald background:** Luxurious, natural, calm
- **White text:** High contrast, readable, clean
- **Image vibrancy:** Pops against dark background
- **Subtle controls:** Present but not dominating

---

## UX BEST PRACTICES

### Discoverability
- Navigation buttons signal interactivity (desktop)
- Partial slide visibility hints at more content
- Captions provide context
- Cursor changes to pointer on hover

### Ease of Use
- Touch-friendly swipe on mobile
- Large, clear navigation buttons (desktop)
- Smooth, predictable scroll behavior
- No learning curve required

### Visual Hierarchy
1. Section title establishes purpose
2. Images draw eye immediately
3. Captions provide context
4. Navigation secondary but accessible

### Mobile Optimization
- Swipe is natural gesture
- No clutter from hidden buttons
- Slides sized for thumb navigation
- Snap points prevent confusion

---

## PERFORMANCE CONSIDERATIONS

### Image Optimization
- WebP format with JPEG fallback
- Responsive images (srcset)
- Lazy load slides 3-5
- Compress without quality loss

### Scroll Performance
- Use CSS transforms (GPU-accelerated)
- Avoid layout thrashing
- Throttle scroll events if tracking
- requestAnimationFrame for smooth updates

### Load Strategy
- Slides 1-2: Eager load (visible immediately)
- Slides 3-5: Lazy load (load on scroll proximity)
- Preload next slide on hover
- Progressive JPEG for better perceived speed

---

## TESTING CHECKLIST

- [ ] All 5 slides display correctly
- [ ] Images load and scale properly
- [ ] Captions readable on all images
- [ ] Navigation buttons scroll correctly
- [ ] Touch swipe works on mobile/tablet
- [ ] Hover zoom is smooth and isolated
- [ ] Scroll momentum feels natural
- [ ] Section title and buttons aligned
- [ ] Dark background provides good contrast
- [ ] Accessible via keyboard
- [ ] Screen reader announces slides correctly
- [ ] Respects reduced motion preferences

---

## VARIATION CONSIDERATIONS

### Auto-Play Option (Not Recommended)
- Could auto-advance every 5 seconds
- Pause on hover
- Pause button visible

**Why avoid:** 
- Users lose control
- Accessibility issues
- Can be annoying
- Reduces engagement

### Thumbnail Navigation (Alternative)
- Small dots below slider
- Indicate position
- Clickable to jump

**Trade-off:** Adds visual clutter for minimal benefit

---

**Goal:** Inspire visitors through stunning imagery while providing smooth, intuitive exploration of Colombia's diverse experiences. Balance visual impact with usability and performance.
