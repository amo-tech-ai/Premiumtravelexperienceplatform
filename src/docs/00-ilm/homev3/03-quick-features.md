# HOME V3 — SECTION 03: QUICK FEATURE OVERVIEW
## Design Prompt: Icon Grid Navigation Cards

**Purpose:** Provide immediate clarity on core platform offerings and enable quick navigation to key sections

---

## LAYOUT STRUCTURE

### Section Container
**Light background:**
- Slate-50 (soft off-white)
- Creates gentle contrast from surrounding sections
- 96px vertical padding (desktop)
- 64px vertical padding (mobile)

### Content Width
- Maximum 1120px (7xl)
- Horizontally centered
- Side padding: 24px

---

## GRID LAYOUT

### Desktop (> 1024px)
**5-column grid:**
- Equal width columns
- Horizontal layout (single row)
- 24px gaps between cards
- All cards visible simultaneously

**Rationale:** Showcase all offerings at a glance, emphasize breadth

### Tablet (768px - 1024px)
**3-column grid:**
- Top row: 3 cards
- Bottom row: 2 cards (centered)
- Maintains visual balance

### Mobile (< 768px)
**2-column grid:**
- Alternating 2-card rows
- Last card spans 1 column
- Or stack to 1-column if space tight

---

## FEATURE CARD DESIGN

### Card Container

#### Visual Treatment
- White background (pure white)
- Rounded corners (16px)
- Soft shadow (subtle elevation)
- Border: none (shadow provides depth)
- Vertical padding: 24px
- Horizontal padding: 24px

#### Dimensions
- Consistent height across all cards
- Width: Flexible (fills column)
- Minimum height to contain content
- Aspect ratio: Approximately square to portrait

#### Interaction States
**Default:**
- White background
- Subtle shadow
- Static position

**Hover:**
- Shadow increases (deeper, softer)
- Translate up by 4px (subtle lift)
- Smooth transition (300ms)
- Cursor: pointer
- Background remains white (or very subtle tint)

**Active/Click:**
- Navigate to relevant section
- Brief scale down (0.98x)
- Immediate navigation

---

### Icon Container

#### Visual Design
- Background: Emerald-50 (very light green)
- Size: 48x48px
- Rounded corners (12px)
- Centered icon inside
- Top of card (above text)
- 16px bottom margin

#### Icon Specifications
- Size: 24x24px
- Color: Emerald-700 (dark green, high contrast)
- Line weight: Consistent (Lucide React default)
- Style: Outline/stroke (not filled)

#### Interaction
**Hover (entire card):**
- Background transitions to Emerald-100 (slightly darker)
- Icon color remains Emerald-700
- Smooth transition (300ms)

**Icons per Feature:**
1. **Rentals:** Home icon
2. **Auto:** Car icon
3. **Restaurants:** Utensils/fork-knife icon
4. **Events:** Calendar icon
5. **Travel:** Plane icon

---

### Text Content

#### Feature Title
**Typography:**
- Bold weight
- Large size (18px)
- Slate-900 color (near-black)
- 8px bottom margin
- Single line preferred

**Content:**
- "Rentals"
- "Auto"
- "Restaurants"
- "Events"
- "Travel"

**Tone:** Clear, concise, category-focused

#### Feature Description
**Typography:**
- Regular weight
- Small size (14px)
- Slate-600 color (medium gray)
- Relaxed line height (1.6)
- 2-3 lines maximum

**Content Examples:**
- "Curated apartments for short and long stays"
- "Premium car rentals and road trip planning"
- "Local gems and fine dining experiences"
- "Concerts, meetups, and cultural experiences"
- "Day trips and weekend getaways"

**Purpose:** Provide context without overwhelming

**Tone:** Benefit-focused, approachable, descriptive

---

## CONTENT HIERARCHY

### Visual Flow (Top to Bottom)
1. **Icon** — Immediate visual recognition
2. **Title** — Category identifier
3. **Description** — Context and benefit

**Spacing:**
- Icon to Title: 16px
- Title to Description: 8px
- Consistent across all cards

---

## RESPONSIVE BEHAVIOR

### Grid Transformations

**Desktop (5 columns):**
```
[Rentals] [Auto] [Restaurants] [Events] [Travel]
```

**Tablet (3 columns):**
```
[Rentals] [Auto] [Restaurants]
   [Events]    [Travel]
```

**Mobile (2 columns):**
```
[Rentals]      [Auto]
[Restaurants]  [Events]
    [Travel]
```

### Typography Scaling
- Desktop: 18px title, 14px description
- Mobile: 16px title, 13px description
- Maintain line height ratios

### Card Padding
- Desktop: 24px all sides
- Mobile: 20px all sides (tighter on small screens)

---

## ANIMATION & MOTION

### On Scroll Into View
**Stagger entrance:**
- Cards fade in + slide up
- Opacity: 0 to 1
- Transform: translateY(20px) to 0
- Duration: 400ms
- Easing: ease-out

**Stagger Timing:**
- Card 1: 0ms delay
- Card 2: 100ms delay
- Card 3: 200ms delay
- Card 4: 300ms delay
- Card 5: 400ms delay

**Effect:** Creates wave-like reveal, draws attention left to right

### Hover Animation
**Lift effect:**
- Transform: translateY(-4px)
- Shadow: Increase spread and blur
- Duration: 300ms
- Easing: ease-out

**Icon container:**
- Background: Emerald-50 → Emerald-100
- Duration: 300ms
- Synchronized with card lift

---

## COLOR SYSTEM

### Background Colors
- Section: Slate-50 (F8FAFC)
- Card: White (FFFFFF)
- Icon container default: Emerald-50 (ECFDF5)
- Icon container hover: Emerald-100 (D1FAE5)

### Text Colors
- Title: Slate-900 (0F172A)
- Description: Slate-600 (475569)
- Icon: Emerald-700 (047857)

### Shadows
- Default: `0 2px 4px rgba(0,0,0,0.04)`
- Hover: `0 8px 16px rgba(0,0,0,0.08)`

**Philosophy:** Soft, approachable, never harsh

---

## NAVIGATION BEHAVIOR

### Click Targets

**Click Action:**
- Entire card is clickable (not just icon or title)
- Navigate to corresponding section:
  - Rentals → `/real-estate`
  - Auto → `/explore`
  - Restaurants → `/explore`
  - Events → `/explore`
  - Travel → `/experiences`

**Visual Feedback:**
- Brief scale down on click (0.98x, 150ms)
- Immediate navigation (no delay)
- Browser back button works normally

### Touch Optimization
- Minimum touch target: 48x48px (met by card size)
- No hover state on touch devices
- Tap highlights briefly
- No accidental double-tap issues

---

## ACCESSIBILITY

### Semantic HTML
- Each card is a clickable link (anchor tag)
- Clear heading hierarchy (h3 for titles)
- Description uses paragraph tag
- Icon has aria-hidden (decorative)

### Keyboard Navigation
- Tab order: Left to right, top to bottom
- Focus indicator visible (outline or shadow)
- Enter/Space activates link
- No keyboard traps

### Screen Readers
- Card announces as link
- Title read clearly
- Description provides context
- Icon decorative (not announced)

### Color Contrast
- Title (Slate-900) on White: Excellent (>10:1)
- Description (Slate-600) on White: Good (>7:1)
- Icon (Emerald-700) on Emerald-50: Sufficient (>3:1)

---

## PREMIUM DESIGN TOUCHES

### Visual Refinement
1. **Consistent spacing:** Every card feels aligned and intentional
2. **Soft shadows:** Create depth without harshness
3. **Subtle hover lift:** Feels responsive and interactive
4. **Color harmony:** Emerald accent ties to brand
5. **Generous padding:** Never feels cramped

### Interaction Details
1. **Smooth transitions:** All animations 300ms, ease-out
2. **Clear affordance:** Cards clearly clickable (cursor, hover)
3. **Immediate feedback:** Hover and click states instant
4. **No janky motion:** Hardware-accelerated transforms only

### Content Quality
1. **Icon choice:** Immediately recognizable symbols
2. **Concise titles:** No ambiguity
3. **Benefit-focused descriptions:** "What's in it for me?"
4. **Parallel structure:** Consistent description format

---

## UX BEST PRACTICES

### Scannability
- Icons provide instant recognition
- Titles bold and readable
- Descriptions secondary but clear
- Grid layout naturally guides eye

### Clarity
- One feature per card (no overloading)
- Clear category naming
- Benefits stated simply
- No jargon or marketing speak

### Discoverability
- All offerings visible without scrolling (desktop)
- Hover states signal interactivity
- Cursor changes to pointer
- Cards visually distinct from static content

### Mobile Considerations
- Touch-friendly card sizes
- Adequate spacing prevents mis-taps
- Descriptions remain readable
- Grid adapts naturally

---

## CONTENT STRATEGY

### Feature Selection
**Criteria:**
- Core platform offerings only
- Most commonly searched/needed
- Clear, distinct categories
- Broad appeal

**Excluded (for now):**
- Niche services
- Administrative pages
- Secondary features
- Promotional content

### Description Writing

#### Formula
"[Benefit] for [audience/context]"

**Examples:**
✅ "Curated apartments for short and long stays"  
✅ "Local gems and fine dining experiences"  
❌ "We have the best apartments in Medellín"  
❌ "Click here to see restaurants"

#### Tone
- Helpful, not salesy
- Confident, not boastful
- Specific, not vague
- Approachable, not formal

---

## PERFORMANCE CONSIDERATIONS

### Rendering
- CSS Grid for layout (native, fast)
- No JavaScript required for layout
- Hardware-accelerated transforms
- Repaint only on interaction

### Load Priority
- Static content (loads instantly)
- No external dependencies
- Icons inline (SVG)
- Minimal CSS required

### Optimization
- Icons from shared library (cached)
- Shadows using CSS (no images)
- Transitions use transform/opacity only
- No layout shifts on load

---

## TESTING CHECKLIST

- [ ] All 5 cards display correctly
- [ ] Grid adapts to screen size
- [ ] Icons centered and properly sized
- [ ] Text readable and properly spaced
- [ ] Hover state works (desktop)
- [ ] Click navigates to correct page
- [ ] Touch interaction works (mobile)
- [ ] Cards align properly at all breakpoints
- [ ] Animations smooth and performant
- [ ] Keyboard navigation functions
- [ ] Screen reader announces correctly
- [ ] Color contrast meets standards
- [ ] Focus indicators visible

---

## ALTERNATIVE APPROACHES

### Option: 4-Column Grid
- Remove one feature (e.g., Auto)
- More room per card
- Easier on tablet layout

**Trade-off:** Less comprehensive overview

### Option: 6-Column Grid
- Add "Guides" or "Community"
- More offerings visible

**Trade-off:** Cards feel cramped, harder to scan

### Option: Icon-Only Cards
- Remove descriptions
- Cleaner, more minimal

**Trade-off:** Less context for new users

**Recommendation:** Stick with 5 columns as designed—optimal balance

---

**Goal:** Provide instant understanding of platform breadth while creating clear pathways to explore each offering. Make every feature feel accessible, valuable, and just one click away.
