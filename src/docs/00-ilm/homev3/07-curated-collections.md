# HOME V3 — SECTION 07: CURATED COLLECTIONS
## Design Prompt: Image Grid with Category Cards

**Purpose:** Showcase platform's curated content categories through visual, clickable cards that inspire exploration

---

## LAYOUT STRUCTURE

### Section Background
**White background:**
- Clean, neutral canvas
- Provides breathing room after dark section
- Lets colorful images pop
- 128px vertical padding (desktop)
- 96px vertical padding (mobile)

---

### Content Width
- Maximum 1120px (7xl)
- Horizontally centered
- Side padding: 24px

---

## SECTION HEADER

### Eyebrow Label
**Typography:**
- Uppercase
- Wide letter spacing
- Small size (12-14px)
- Bold weight
- **Amber-500 color** (warm accent)

**Content:** "CURATED COLLECTIONS"

**Positioning:** Centered, 64px below section top

---

### Section Headline
**Typography:**
- Serif font family
- Very large (4xl mobile, 5xl desktop)
- Bold weight
- Slate-900 color (near-black)
- Centered alignment
- 48px bottom margin

**Content:** "Experiences designed for you"

**Tone:** Personal, thoughtful, curated

**Message:** Platform actively curates (not just lists) experiences

---

## COLLECTION GRID LAYOUT

### Grid Structure
**Desktop (> 1024px):**
- 4 equal columns
- Single row
- 24px gaps between cards
- All visible simultaneously

**Tablet (768px - 1024px):**
- 2 columns, 2 rows
- Maintains card size
- 24px gaps

**Mobile (< 768px):**
- 2 columns (narrow)
- Or 1 column (very small screens)
- Vertical scroll
- 16px gaps

---

## COLLECTION CARD DESIGN

### Card Structure
**Aspect ratio:**
- Portrait orientation (3:4 or 4:5)
- Fixed height: 350px (desktop)
- Width: fills column
- Maintains aspect on resize

**Visual Treatment:**
- Rounded corners: 16px
- Shadow: Medium (0 4px 12px rgba(0,0,0,0.1))
- Overflow: hidden
- Cursor: pointer

---

### Image Layer

#### Visual Quality
- High-resolution photography
- Professionally curated
- Strong composition
- Vibrant colors
- Clear subject/theme

#### Styling
- Full coverage (object-fit: cover)
- No borders
- Fills entire card
- Sharp, optimized

#### Categories & Imagery
1. **Vibrant Nightlife**
   - Tag: Events
   - Image: Concert, club scene, nighttime lights

2. **Nature Escapes**
   - Tag: Travel
   - Image: Mountains, forest, hiking trail

3. **Prime Real Estate**
   - Tag: Rentals
   - Image: Modern apartment, rooftop view

4. **Culinary Journey**
   - Tag: Restaurants
   - Image: Food plating, restaurant ambiance

---

### Gradient Overlay
**Purpose:** Ensure text readability across all images

**Specifications:**
- Linear gradient from bottom to top
- Bottom: Black at 70% opacity
- Middle: Black at 20% opacity
- Top: Transparent
- Positioned absolutely over image

**Effect:** Darkens bottom half for text, keeps top bright

---

### Category Tag

#### Positioning
- Absolute position
- Top: 16px from edge
- Left: 16px from edge
- Z-index above gradient

#### Visual Design
- Small pill shape
- Background: White with 90% opacity (semi-transparent)
- Backdrop blur: 8px (frosted glass effect)
- Rounded-full (pill shape)
- Padding: 6px horizontal, 4px vertical
- Small shadow

#### Typography
- Uppercase
- Bold weight
- Very small (11-12px)
- Slate-700 color
- Wide letter spacing

**Content:**
- "EVENTS"
- "TRAVEL"
- "RENTALS"
- "RESTAURANTS"

---

### Collection Title

#### Positioning
- Absolute position
- Bottom: 24px from edge
- Left: 24px, Right: 24px
- Z-index above gradient

#### Typography
- Serif font family (editorial)
- Large size (24px)
- Normal weight (not bold)
- White color (100% opacity)
- Leading tight
- 1-2 lines maximum

**Content:**
- "Vibrant Nightlife"
- "Nature Escapes"
- "Prime Real Estate"
- "Culinary Journey"

**Tone:** Evocative, aspirational, category-defining

---

## INTERACTION DESIGN

### Hover State (Desktop)

**Image:**
- Scale 1.1x (zoom in)
- Transition: 500ms ease-out
- No layout shift (overflow hidden)

**Gradient:**
- Darken slightly (from 70% to 80%)
- Transition: 500ms
- Enhances focus

**Tag:**
- Background opacity increases
- Slight scale up (1.05x)
- Draws attention

**Title:**
- No change (already prominent)
- Or slight glow effect (optional)

**Cursor:** Pointer

---

### Click/Tap Action
**Navigation:**
- Click card → Navigate to category page
- Destinations:
  - Vibrant Nightlife → Events page
  - Nature Escapes → Experiences/Travel page
  - Prime Real Estate → Rentals page
  - Culinary Journey → Restaurants page

**Feedback:**
- Brief scale down (0.98x, 150ms)
- Immediate navigation
- No loading state needed (static pages)

---

### Touch Optimization (Mobile)
- No hover state
- Tap highlights card briefly
- Larger touch target (entire card)
- No accidental double-tap

---

## RESPONSIVE BEHAVIOR

### Desktop (> 1024px)
- 4-column grid
- All cards visible
- Hover interactions active
- 350px card height

### Tablet (768px - 1024px)
- 2x2 grid
- Scroll not needed
- Touch-friendly
- 320px card height

### Mobile (< 768px)
- 2-column grid (if space allows)
- Or 1-column stack
- 280px card height
- Easy thumb navigation

**Typography Scaling:**
- Title: 24px → 20px
- Tag: 12px → 11px

---

## ANIMATION & MOTION

### On Scroll Into View

**Section Header:**
- Fade in + slide up (20px)
- Duration: 600ms
- Easing: ease-out

**Collection Cards (Staggered):**
- Fade in + slide up (30px)
- Opacity: 0 to 1
- Duration: 500ms
- Easing: ease-out

**Stagger Timing:**
- Card 1: 300ms delay
- Card 2: 400ms delay
- Card 3: 500ms delay
- Card 4: 600ms delay

**Effect:** Left-to-right reveal

---

### Hover Animation
- Image scale transition: 500ms ease-out
- Gradient darken: 500ms ease-out
- Tag scale/opacity: 300ms ease-out
- All synchronized

---

## COLOR STRATEGY

### Image Selection by Color Palette
1. **Nightlife:** Purples, blues, warm lights
2. **Nature:** Greens, earth tones, sky blues
3. **Real Estate:** Modern neutrals, glass, sky
4. **Culinary:** Warm tones, rich colors, textures

**Purpose:** Visual diversity across grid while maintaining cohesion

### Text & Overlay Colors
- Gradient overlay: Black (various opacities)
- Title: White (100%)
- Tag background: White (90% opacity)
- Tag text: Slate-700

---

## CONTENT STRATEGY

### Collection Selection
**Criteria:**
- Covers core platform categories
- Evokes emotion/aspiration
- Clear differentiation
- Broad appeal

**Categories Represented:**
1. Events (social, nightlife)
2. Travel (nature, adventure)
3. Rentals (living, comfort)
4. Restaurants (dining, culture)

---

### Title Writing

#### Style
- 2-3 words ideal
- Descriptive + Emotional
- Noun-focused or adjective + noun
- Evokes feeling

**Examples:**
✅ "Vibrant Nightlife"  
✅ "Nature Escapes"  
✅ "Culinary Journey"  
❌ "The Best Nightlife Events"  
❌ "Check Out These Nature Spots"

#### Tone
- Aspirational
- Inviting
- Not salesy
- Emotionally resonant

---

### Image Selection

#### Criteria
- **High quality:** Professional, sharp, well-lit
- **Emotionally compelling:** Makes you want to experience it
- **Clear subject:** No ambiguity about category
- **Authentic:** Real experiences, not overly staged
- **Diverse:** Different moods, times of day, settings

#### Avoid
- Generic stock photos
- Low resolution or blurry
- Overly edited/filtered
- Irrelevant imagery
- Crowded compositions

---

## ACCESSIBILITY

### Semantic HTML
- Section uses `<section>`
- Cards are links (`<a>`)
- Titles use appropriate heading level
- Images have descriptive alt text

### Keyboard Navigation
- Tab through cards (left to right, top to bottom)
- Enter/Space activates card
- Focus indicator visible (outline or shadow)
- No keyboard traps

### Screen Readers
- Card announces as link
- Alt text describes image content
- Tag provides category context
- Title read clearly

**Example Announcement:**
"Link: Vibrant Nightlife. Events category. Image of concert crowd with stage lights."

### Color Contrast
- Title (White) on dark gradient: Excellent (>10:1)
- Tag text (Slate-700) on White: Good (>7:1)
- Gradient ensures readability across all images

---

## PREMIUM DESIGN TOUCHES

### Visual Refinement
1. **High-quality imagery:** Sets premium tone
2. **Subtle shadows:** Depth without harshness
3. **Rounded corners:** Modern, approachable
4. **Frosted glass tag:** Contemporary, polished
5. **Gradient overlay:** Functional yet elegant

### Interaction Details
1. **Smooth hover zoom:** Engaging without being gimmicky
2. **Synchronized transitions:** All elements move together
3. **Cursor feedback:** Clear affordance
4. **Touch optimization:** Works naturally on mobile

### Typography
1. **Serif titles:** Editorial sophistication
2. **Uppercase tags:** Clear categorization
3. **Generous spacing:** Titles breathe
4. **High contrast:** Always readable

---

## UX BEST PRACTICES

### Discoverability
- All collections visible at once (desktop)
- Clear visual distinction between categories
- Tags provide immediate context
- Images telegraph content

### Clarity
- One category per card
- Titles concise and descriptive
- Tags reinforce category
- No ambiguity about destination

### Engagement
- Beautiful imagery inspires action
- Hover states invite interaction
- Titles evoke emotion
- Click targets large and obvious

### Mobile Optimization
- Cards sized for thumb navigation
- Grid adapts to screen
- Touch-friendly (no small targets)
- No reliance on hover

---

## PERFORMANCE CONSIDERATIONS

### Image Optimization
- WebP format with JPEG fallback
- Responsive images (srcset)
- Lazy load below-fold cards
- Compress without visible quality loss
- Fixed aspect ratio prevents layout shift

### Rendering
- CSS Grid for layout
- Transform for hover (GPU-accelerated)
- Backdrop-filter for frosted glass (progressive enhancement)
- Minimal DOM depth

### Load Strategy
- Prioritize first 2 cards (above fold)
- Lazy load cards 3-4
- Preload on hover (optional)
- Progressive JPEG for faster perceived load

---

## TESTING CHECKLIST

- [ ] All 4 cards display correctly
- [ ] Images load and fit properly
- [ ] Gradient overlays ensure text readability
- [ ] Tags positioned and styled correctly
- [ ] Titles use serif font
- [ ] Hover zoom smooth and isolated
- [ ] Grid adapts to screen size
- [ ] Click navigates to correct page
- [ ] Touch interaction works on mobile
- [ ] Keyboard navigation functional
- [ ] Screen reader announces correctly
- [ ] Alt text descriptive
- [ ] Color contrast sufficient
- [ ] No layout shifts on load

---

## ALTERNATIVE APPROACHES

### Option: 6 Collections
Add 2 more categories:
- "Coffee Culture"
- "Urban Exploration"

**Trade-off:** More options but less visual impact per card

### Option: Horizontal Scroll
Instead of grid:
- Single row, horizontal scroll
- More cards visible
- Mobile-friendly

**Trade-off:** Requires interaction to see all; less immediate

### Option: Larger Cards with Details
Bigger cards with:
- Collection description
- "Explore" button
- Item count

**Trade-off:** More information but less visual; only 2-3 fit

**Recommendation:** Keep 4-card grid—optimal balance of visual impact and scannability

---

**Goal:** Inspire exploration through visually stunning, category-defining cards that make users excited to dive into each curated collection. Balance beauty with clarity, emotion with function.
