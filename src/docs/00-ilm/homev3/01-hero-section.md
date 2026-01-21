# HOME V3 — SECTION 01: HERO SECTION
## Design Prompt: Two-Column Layout with Masonry Grid

**Purpose:** Make a powerful first impression that communicates value and inspires exploration

---

## LAYOUT STRUCTURE

### Desktop Layout (1400px max-width)
**Two-column split:**
- **Left Column:** 45% width — Text and CTAs
- **Right Column:** 55% width — Masonry image grid

### Mobile Layout (< 1024px)
**Stacked vertical:**
- Text content first
- Masonry grid below
- Full-width elements

---

## LEFT COLUMN: CONTENT HIERARCHY

### Brand Mention (Eyebrow)
**Visual Treatment:**
- Small uppercase text
- Medium weight font
- Slate gray color (secondary)
- Wide letter spacing
- Positioned at top

**Content:** "I Love Medellín"

**Purpose:** Brand recognition without overwhelming the headline

---

### Main Headline
**Typography:**
- Largest text on page (4xl mobile, 6xl desktop)
- Serif font family for editorial feel
- Bold weight
- Dark slate color (near-black)
- Tight leading (line height)
- Maximum 2-3 lines

**Content:** "Your Next Adventure Starts Here in Colombia"

**Tone:** Aspirational, immediate, action-oriented

**Best Practices:**
- Focus on benefit, not features
- Create emotional connection
- Use active voice
- Keep it scannable

---

### Supporting Text
**Typography:**
- Large body size (18-20px)
- Regular weight
- Medium slate color (readable, not dominant)
- Relaxed leading for readability
- Maximum 2-3 sentences

**Content:** "Welcome to I Love Colombia — your guide to discovering cities, experiences, and unforgettable trips across the country."

**Purpose:** Expand on headline without overwhelming

**Best Practices:**
- Complement, don't repeat headline
- Introduce key value propositions
- Stay concise
- Avoid jargon

---

### Call-to-Action Buttons

#### Primary CTA
**Visual Treatment:**
- Rose/pink color (warm, inviting)
- Large size (generous padding)
- Rounded-full shape (pill)
- White text
- Medium-to-large shadow
- Arrow icon on right

**Content:** "Explore Colombia"

**Interaction:**
- Hover: Slightly darker shade
- Hover: Shadow increases
- Smooth transition (200-300ms)

#### Secondary CTA
**Visual Treatment:**
- Outline style (transparent background)
- Border matches text color
- Slate gray text
- Same size as primary
- Rounded-full shape

**Content:** "Learn More"

**Interaction:**
- Hover: Light background fill
- Hover: Border/text remains consistent

**Layout:**
- Side-by-side on desktop
- Stacked on mobile
- 16px gap between buttons
- Left-aligned within container

---

## RIGHT COLUMN: MASONRY IMAGE GRID

### Grid Pattern
**Structure:**
- Asymmetric layout (not uniform rows)
- Pinterest-style masonry
- Variable heights create visual interest
- Tight gaps between images (8-12px)
- Images flow naturally

**Image Count:** 9 curated photos

**Categories (Balanced Mix):**
1. City & Urban Life (2 images) — Medellín skyline, rooftop views
2. Nature & Landscapes (3 images) — Beaches, waterfalls, mountains
3. Experiences & Lifestyle (2 images) — Cafés, street life
4. Culture & Architecture (2 images) — Colorful buildings, sunset scenes

---

### Image Specifications

#### Dimensions
- Minimum width: 350px
- Variable heights (some 300px, some 400px, some 500px)
- Maintain aspect ratios
- Optimized for web (compressed)

#### Visual Quality
- High resolution (retina ready)
- Professional photography
- Bright, vibrant colors
- Sharp focus
- Good lighting

#### Content Guidelines
- Authentic Colombia/Medellín imagery
- Show diversity (nature, urban, culture)
- Aspirational but realistic
- No stock photo clichés
- Include people when relevant (lifestyle shots)

---

### Image Treatment

#### Styling
- Rounded corners (12-16px)
- Subtle shadow on hover
- No borders or frames
- Allow images to speak

#### Interactions
- Hover: Slight scale increase (1.05x)
- Hover: Overlay with gradient
- Hover: Caption appears (optional)
- Smooth transitions (400-500ms)
- Cursor: pointer

#### Loading
- Lazy load off-screen images
- Blur-up placeholder technique
- Graceful degradation
- Alt text for accessibility

---

## BACKGROUND & CONTAINER

### Section Background
- Light neutral color (slate-50 or off-white)
- Provides breathing room
- Doesn't compete with content

### Inner Container
**Treatment:**
- White background
- Large rounded corners (24px)
- Soft shadow (subtle elevation)
- Contains both columns
- Minimum height: 600px

**Purpose:** Creates card-like appearance, focuses attention

---

## RESPONSIVE BEHAVIOR

### Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### Mobile Adaptations
1. **Layout:** Stack vertically (text above, grid below)
2. **Typography:** Reduce headline size (4xl → 5xl max)
3. **Buttons:** Full width or stacked
4. **Masonry Grid:** 2-column grid instead of complex masonry
5. **Padding:** Reduce internal spacing (8px → 12px)
6. **Container:** Reduce rounded corners (16px)

### Tablet Adaptations
1. **Layout:** Can maintain two-column with adjusted ratios
2. **Typography:** Medium sizes
3. **Buttons:** Side-by-side, smaller padding
4. **Grid:** Simplified 3-column masonry

---

## SPACING & RHYTHM

### Vertical Spacing
- Section padding: 64px top/bottom (desktop)
- Section padding: 48px top/bottom (mobile)
- Content blocks: 24-32px apart
- Button group: 32px below text

### Horizontal Spacing
- Container padding: 24px sides (mobile)
- Container padding: 48px sides (desktop)
- Column gap: 48-64px
- Max content width: 1400px

---

## ANIMATION & MOTION

### On Page Load
**Text Content:**
- Fade in + slide up (30px)
- Duration: 600ms
- Easing: ease-out
- Stagger children by 100ms

**Sequence:**
1. Brand mention (0ms delay)
2. Headline (100ms delay)
3. Supporting text (200ms delay)
4. Buttons (300ms delay)

**Masonry Grid:**
- Fade in from bottom
- Stagger each image (50ms intervals)
- Start after text finishes (400ms delay)

### Scroll Behavior
- Section remains visible (no exit animation)
- Images can parallax slightly (advanced)
- Maintain performance (60fps)

---

## ACCESSIBILITY

### Semantic HTML
- Use proper heading hierarchy (h1 for headline)
- Descriptive alt text for all images
- Buttons have clear labels
- Sufficient color contrast ratios

### Keyboard Navigation
- Tab order: Logo → Headline → CTA1 → CTA2 → Images
- Focus indicators visible
- No keyboard traps

### Screen Readers
- Descriptive landmark labels
- Image captions available
- Button purpose clear from text alone

---

## PREMIUM DESIGN TOUCHES

### Visual Refinement
1. **Micro-interactions:** Buttons respond to hover with subtle animations
2. **Typography:** Careful attention to kerning and line-height
3. **Color harmony:** Warm rose CTA against cool slate backgrounds
4. **White space:** Generous padding prevents cramped feeling
5. **Shadows:** Soft, realistic (not harsh drop shadows)

### Content Quality
1. **Photography:** Professional, high-quality images only
2. **Copy:** Concise, benefit-focused, emotionally resonant
3. **Brand voice:** Friendly but sophisticated
4. **Consistency:** Visual language matches overall site

---

## UX BEST PRACTICES

### Scannability
- Headline draws eye immediately (size, weight, position)
- Supporting text readable at a glance
- CTAs clearly actionable (color, shape, copy)
- Grid provides visual interest without distraction

### Clarity
- One clear primary action ("Explore Colombia")
- Secondary action available but not competing
- No clutter or unnecessary elements
- Purpose obvious within 2 seconds

### Trust Building
- High-quality imagery signals professionalism
- Real photography (not generic stock)
- Clean, modern design inspires confidence
- Brand name prominently but tastefully displayed

### Mobile-First Considerations
- Critical content (headline, primary CTA) above fold on mobile
- Touch targets minimum 44x44px
- Text remains readable (16px minimum)
- Images optimize for smaller screens

---

## PERFORMANCE CONSIDERATIONS

### Image Optimization
- Modern formats (WebP with JPEG fallback)
- Responsive images (srcset for different sizes)
- Lazy loading for below-fold images
- Compression without visible quality loss

### Load Priority
1. Text content (instant)
2. Primary CTA (instant)
3. Above-fold images (high priority)
4. Below-fold images (lazy load)

### Target Metrics
- Largest Contentful Paint: < 2.5s
- First Input Delay: < 100ms
- Cumulative Layout Shift: < 0.1

---

## TESTING CHECKLIST

- [ ] Headline readable on all devices
- [ ] Both CTAs functional and clearly labeled
- [ ] All images load and display correctly
- [ ] Masonry grid adapts to screen size
- [ ] Hover states work on desktop
- [ ] Touch interactions work on mobile
- [ ] Text contrast meets WCAG AA standards
- [ ] Focus indicators visible for keyboard users
- [ ] Images have descriptive alt text
- [ ] Section looks premium and polished

---

**Goal:** Create an immediate emotional connection that makes visitors want to explore Colombia while establishing trust through premium design and high-quality imagery.
