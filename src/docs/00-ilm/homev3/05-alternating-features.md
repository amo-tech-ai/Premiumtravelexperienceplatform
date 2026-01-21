# HOME V3 — SECTION 05: ALTERNATING FEATURE SECTIONS
## Design Prompt: Two-Column Feature Showcase with Image-Text Alternation

**Purpose:** Deep-dive into key platform differentiators with visual storytelling and benefit-driven messaging

---

## LAYOUT STRUCTURE

### Section Pattern
**Repeating alternating layout:**
- Multiple subsections (3-4 features)
- Two-column grid per subsection
- Image and text swap sides
- Visual rhythm creates engagement

**Alternation Pattern:**
```
Section 1: [Text] [Image]
Section 2: [Image] [Text]
Section 3: [Text] [Image]
Section 4: [Image] [Text]
```

---

## INDIVIDUAL SUBSECTION DESIGN

### Container
**Full-width section:**
- Alternating background colors:
  - Even sections: Slate-50 (light gray)
  - Odd sections: White
- 96px vertical padding (desktop)
- 64px vertical padding (mobile)

### Content Width
- Maximum 1120px (7xl)
- Horizontally centered
- Side padding: 24px

### Grid Layout
**Desktop two-column:**
- 50/50 split or 45/55 split
- 48-64px gap between columns
- Vertical center alignment
- Responsive reordering

---

## TEXT COLUMN DESIGN

### Eyebrow Label
**Purpose:** Category or context label

**Typography:**
- Uppercase
- Wide letter spacing (tracking)
- Small size (12-14px)
- Bold weight
- Amber-500 color (warm accent)

**Content Examples:**
- "SMART SEARCH"
- "LOCAL EXPERTISE"
- "CURATED MATCHES"

**Positioning:** Above headline, 16px margin below

---

### Feature Headline
**Typography:**
- Serif font family (editorial)
- Very large (4xl mobile, 5xl desktop)
- Bold weight
- Slate-900 color (near-black)
- Tight leading
- 24px bottom margin

**Content Structure:**
- Benefit-focused statement
- Italic emphasis on key phrase
- 1-2 lines maximum

**Examples:**
- "Find the right place — not just any place"
- "Powered by local knowledge"
- "Discover hidden gems only locals know"

**Italic Usage:**
- Emphasize emotional/key phrase
- Creates editorial, premium feel
- Examples: "right place", "local knowledge", "hidden gems"

---

### Feature Description
**Typography:**
- Sans-serif (readable body)
- Large body size (18px)
- Regular weight
- Slate-600 color (medium gray)
- Relaxed leading (1.7)
- 32px bottom margin

**Content:**
- 2-4 sentences
- Expand on benefit
- Address pain point or desire
- Conversational but professional

**Structure:**
1. State problem or context
2. Explain solution
3. Highlight unique value

---

### Call-to-Action Button

**Visual Treatment:**
- Outline style (not filled)
- Emerald-700 border (2px)
- Emerald-700 text
- Large size (generous padding)
- Rounded-xl (medium rounding)
- Arrow icon on right

**Interaction:**
- **Hover:** Background fills with emerald-700
- **Hover:** Text turns white
- **Transition:** Smooth (300ms)

**Content:** Action-oriented
- "Explore Rentals"
- "See How It Works"
- "Browse Restaurants"

---

## IMAGE COLUMN DESIGN

### Image Container
**Dimensions:**
- Fixed height: 400px (desktop)
- Flexible height: 300px (mobile)
- Full width of column
- Rounded corners: 16px
- Overflow: hidden

### Image Treatment
**Visual:**
- High-quality photography
- Relevant to feature described
- Object-fit: cover
- Good focal point

**Interaction:**
- **Hover:** Scale 1.05x (subtle zoom)
- **Transition:** Slow (500ms ease-out)
- No other effects

**Examples:**
- Map interface showing pins
- Restaurant interior
- User reviewing options on phone
- Community/local scene

---

## RESPONSIVE BEHAVIOR

### Desktop (> 1024px)
**Side-by-side layout:**
- Two equal or weighted columns
- Text and image horizontal
- Alternation clearly visible

**Column Order:**
- Section 1: Text left, Image right
- Section 2: Image left, Text right
- Section 3: Text left, Image right
- Uses CSS Grid `grid-flow-dense` for reordering

### Tablet (768px - 1024px)
**Simplified:**
- Reduce image height
- Smaller typography
- Maintain alternation

### Mobile (< 768px)
**Vertical stack:**
- Always: Image on top, Text below
- No alternation on mobile (consistency)
- Full-width images
- Centered text

**Rationale:** Mobile users scroll vertically; horizontal alternation adds no value

---

## FEATURE CONTENT EXAMPLES

### Feature 1: Smart Discovery
**Eyebrow:** "SMART SEARCH"

**Headline:** "Find the right place — not just *any* place"

**Description:** "Our AI doesn't just show you what's available. It learns your preferences, understands context, and surfaces options that actually match your lifestyle. No endless scrolling through irrelevant listings."

**CTA:** "See How It Works"

**Image:** Map interface with curated pins, filters active

---

### Feature 2: Local Expertise
**Eyebrow:** "LOCAL EXPERTISE"

**Headline:** "Powered by *local knowledge*"

**Description:** "Every recommendation is informed by people who actually live in Medellín. We combine AI intelligence with real human insights to ensure you get authentic, trusted suggestions."

**CTA:** "Explore Rentals"

**Image:** Local café or community scene, people interacting

---

### Feature 3: Curated Matches
**Eyebrow:** "CURATED MATCHES"

**Headline:** "Discover *hidden gems* only locals know"

**Description:** "Go beyond the tourist traps. Our platform highlights restaurants, events, and experiences that aren't on typical travel lists but are beloved by residents. Authentic Medellín awaits."

**CTA:** "Browse Restaurants"

**Image:** Unique restaurant interior or cultural event

---

## ANIMATION & MOTION

### On Scroll Into View
**Text Column:**
- Fade in + slide from side (30px)
- Opacity: 0 to 1
- Duration: 600ms
- Easing: ease-out
- Direction: From left if text-left, from right if text-right

**Image Column:**
- Fade in + slide from opposite side
- Same timing as text
- Creates balanced entrance
- Delay: 200ms after text starts

**Purpose:** Draw attention, create visual interest, reinforce alternation

### Hover State
**Image only:**
- Scale transform (1.05x)
- Smooth, slow transition (500ms)
- No layout shift (overflow hidden)

**Button:**
- Background fill transition
- Color inversion
- Icon shifts slightly (optional)

---

## COLOR SYSTEM

### Background Alternation
- Section 1, 3, 5: Slate-50 (F8FAFC)
- Section 2, 4: White (FFFFFF)

**Purpose:** Visual rhythm, breaks monotony, guides eye

### Text Colors
- Eyebrow: Amber-500 (F59E0B)
- Headline: Slate-900 (0F172A)
- Description: Slate-600 (475569)
- Button text: Emerald-700 (047857)
- Button hover text: White

### Accent Colors
- Button border/text: Emerald-700
- Button hover background: Emerald-700

---

## CONTENT STRATEGY

### Feature Selection
**Criteria:**
- Core differentiators (what makes platform unique)
- Benefit-focused (not feature lists)
- Address user pain points
- Build trust and credibility

**Number of Features:** 3-4 ideal
- Too few: Misses opportunity to educate
- Too many: Overwhelming, repetitive

---

### Headline Writing

#### Formula
"[Benefit statement] — [differentiator qualifier]"

**Best Practices:**
- Lead with benefit, not feature
- Use em dash or "not just X" framing
- Italicize key emotional phrase
- Active voice

**Examples:**
✅ "Find the right place — not just *any* place"  
✅ "Powered by *local knowledge*"  
❌ "Our AI search is really good"  
❌ "We have local experts on staff"

---

### Description Writing

#### Structure
1. **Problem/Context:** What's frustrating or missing currently
2. **Solution:** How this feature solves it
3. **Unique Value:** Why this platform specifically

**Tone:**
- Conversational but confident
- Empathetic to user frustration
- Clear and jargon-free
- Benefit-focused

**Length:** 60-100 words (2-4 sentences)

---

### Image Selection

#### Criteria
- **Relevance:** Directly illustrates feature
- **Quality:** Professional, high-resolution
- **Authenticity:** Real (not overly staged stock photos)
- **Diversity:** Mix of UI, lifestyle, and location shots
- **Emotion:** Conveys feeling, not just information

#### Types
1. **UI Screenshots:** Show actual interface (map, search results)
2. **Lifestyle Photos:** People using platform or enjoying experiences
3. **Location Shots:** Beautiful imagery of Medellín or Colombia

**Avoid:**
- Generic stock photos
- Overly corporate imagery
- Low-quality or blurry images
- Irrelevant visuals

---

## ACCESSIBILITY

### Semantic HTML
- Proper heading hierarchy (h2 for headlines)
- Paragraphs for descriptions
- Buttons/links clearly labeled
- Image alt text descriptive

### Keyboard Navigation
- Tab to button
- Enter/Space activates
- Focus indicator visible
- Logical tab order

### Screen Readers
- Eyebrow read as context
- Headline as main point
- Description provides detail
- Button purpose clear
- Image alt describes content

### Color Contrast
- Headline (Slate-900) on White/Slate-50: Excellent
- Description (Slate-600) on White/Slate-50: Good
- Eyebrow (Amber-500) on White/Slate-50: Sufficient

---

## PREMIUM DESIGN TOUCHES

### Visual Refinement
1. **Alternation rhythm:** Creates visual interest, prevents monotony
2. **Generous spacing:** Never feels cramped
3. **Serif headlines:** Editorial, premium feel
4. **Italic emphasis:** Adds personality and focus
5. **Soft shadows on images:** Subtle depth

### Interaction Details
1. **Image hover zoom:** Engaging without being gimmicky
2. **Button state transitions:** Smooth, polished
3. **Scroll animations:** Draws attention naturally
4. **Consistent timing:** All animations feel unified

### Content Quality
1. **Benefit-focused copy:** Never just feature lists
2. **Real imagery:** Authentic, not stock
3. **Concise descriptions:** Respects user time
4. **Clear CTAs:** Action-oriented, not vague

---

## UX BEST PRACTICES

### Scannability
- Eyebrow provides context at a glance
- Headline communicates core benefit
- Description expandable (optional read)
- Image reinforces message

### Visual Hierarchy
1. Eyebrow (contextual label)
2. Headline (main message)
3. Description (supporting detail)
4. CTA (next action)

### Engagement
- Alternating layout prevents predictability
- Images create emotional connection
- CTAs provide clear next step
- Animations draw attention

### Mobile Optimization
- Consistent image-then-text order
- Adequate touch targets (buttons)
- Readable text sizes
- Full-width images impactful

---

## PERFORMANCE CONSIDERATIONS

### Image Optimization
- WebP format with JPEG fallback
- Responsive images (srcset)
- Lazy load below-fold sections
- Compress without quality loss
- Fixed aspect ratio prevents layout shift

### Animation Performance
- Use CSS transforms (GPU-accelerated)
- Opacity transitions only
- No width/height animations
- requestAnimationFrame if JS needed

### Rendering
- CSS Grid for layout (native, fast)
- Minimal DOM depth
- No unnecessary wrappers
- Repaints isolated to hover areas

---

## TESTING CHECKLIST

- [ ] All sections display correctly
- [ ] Text and images alternate properly
- [ ] Images load and zoom on hover
- [ ] Headlines use serif font
- [ ] Italic emphasis applied correctly
- [ ] CTAs navigate to correct pages
- [ ] Backgrounds alternate (slate-50/white)
- [ ] Mobile stacks consistently (image top)
- [ ] Animations smooth and performant
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Color contrast meets standards

---

## VARIATION CONSIDERATIONS

### 3-Column Option
Instead of 2-column:
- Text | Image | Stats sidebar

**Trade-off:** More complex, harder to read on mobile

### Video Instead of Image
Some sections could use:
- Looping video demo
- Animated mockup

**Trade-off:** Larger file size, accessibility concerns

### Icon Grid Addition
Below description, add:
- 3-4 icon bullets
- Quick feature highlights

**Trade-off:** More clutter, reduces focus

**Recommendation:** Keep 2-column alternating—proven, clean, effective

---

**Goal:** Communicate key platform differentiators through compelling storytelling that balances visual appeal with clear, benefit-focused messaging. Make visitors understand "why this platform" while feeling inspired by the imagery.
