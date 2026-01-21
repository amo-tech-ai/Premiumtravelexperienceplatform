# HOME V3 — SECTION 04: HOW IT WORKS (SCROLL SECTION)
## Design Prompt: Scroll-Driven Product Demonstration

**Purpose:** Demonstrate the platform's core workflow through interactive scroll-based storytelling

**Note:** This section uses a dedicated component `HowItWorksScrollSection` imported from `/components/HowItWorksScrollSection.tsx`

---

## LAYOUT STRUCTURE

### Section Background
**Dark or contrasting background:**
- Creates visual separation from adjacent sections
- Focuses attention on demonstration
- Sufficient vertical height for scroll effects
- Minimum height: 100vh (full viewport)

### Scroll Container
**Fixed viewport approach:**
- Content fixed while scrolling
- Elements animate based on scroll position
- Smooth transitions between states
- No jarring jumps

---

## CONTENT STRUCTURE

### Headline
**Purpose:** Set context for demonstration

**Typography:**
- Serif font (editorial tone)
- Very large (4xl-6xl)
- Bold weight
- Centered or left-aligned
- White or high-contrast color

**Content:** "See how it works" or "Your journey, simplified"

**Positioning:** Top of section, visible on entry

---

### Steps Overview

**Number of Steps:** 4 core steps

**Step Flow:**
1. Tell the AI what you want
2. AI curates options
3. You review and approve
4. Book and enjoy

**Visual Progression:** Left to right or top to bottom

---

## SCROLL MECHANICS

### Scroll-Triggered Animations

**As user scrolls down:**
- Progress bar fills
- Step numbers highlight sequentially
- Visual demos appear/disappear
- Text content fades in/out
- Background colors may shift

**Scroll Position Detection:**
- Use intersection observers
- Smooth interpolation
- No sudden jumps
- Feels connected to scroll input

### Sticky Elements
- Section title stays visible (or fades out)
- Progress indicator remains in view
- Current step highlighted
- Clear sense of position

---

## STEP DEMONSTRATION

### Visual Components per Step

#### Step Indicator
**Design:**
- Large step number (01, 02, 03, 04)
- Circle or badge background
- Color changes when active
- Positioned to the left or top

**States:**
- Inactive: Gray or muted
- Active: Bright color (emerald, amber, etc.)
- Completed: Checkmark or subtle color

#### Step Title
**Typography:**
- Large, bold
- Changes as you scroll
- Smooth fade transitions
- Clear hierarchy

**Examples:**
- "Tell the AI what you want"
- "AI curates options"
- "You review & approve"
- "Book and enjoy"

#### Step Description
**Typography:**
- Medium size
- Regular weight
- Supporting detail
- Fades in below title

**Content:**
- Brief explanation (1-2 sentences)
- Describes user action or system behavior
- Avoids technical jargon

#### Example Prompt/Result
**Visual:**
- Chat bubble or card
- Shows sample user input
- Shows sample AI response
- Changes per step

**Examples:**
- Step 1: "Find a 2-month apartment in Laureles with a view"
- Step 2: "Analyzing 300+ listings..."
- Step 3: "Found 8 perfect matches"
- Step 4: "Reservation confirmed ✓"

---

## VISUAL DESIGN

### Color Transitions
**Scroll-based color shifts:**
- Each step has associated color
- Background subtly shifts hue
- Text colors adjust for contrast
- Smooth gradients between states

**Example Palette:**
- Step 1: Amber accent
- Step 2: Blue accent
- Step 3: Emerald accent
- Step 4: Purple accent

### Illustration/Mockup
**Per-step visuals:**
- Could be UI mockup (chat interface, map, results)
- Could be illustration (simplified, branded)
- Could be animated icon
- Positioned prominently (right side or center)

**Animation:**
- Fades in as step activates
- Slight scale or parallax effect
- Smooth, not distracting

---

## RESPONSIVE BEHAVIOR

### Desktop (> 1024px)
**Side-by-side layout:**
- Left: Step content (text)
- Right: Visual demonstration
- Scroll progress vertical
- Wide aspect ratio utilized

### Tablet (768px - 1024px)
**Stacked or simplified:**
- Reduced complexity
- Larger touch targets
- Less scroll distance
- May simplify animations

### Mobile (< 768px)
**Vertical stack:**
- Step indicators at top
- Content centered
- Visuals below or integrated
- Shorter scroll distance per step

**Alternative:** Convert to swipeable carousel instead of scroll

---

## ANIMATION DETAILS

### Entrance (Section First Visible)
- Fade in headline
- Progress bar appears
- First step activates
- Initial visual loads

### Between Steps (On Scroll)
**Smooth transitions:**
- Step numbers highlight
- Previous content fades out
- New content fades in
- Visual swaps or transforms
- Duration: 600-800ms
- Easing: ease-in-out

### Exit (Section Leaving View)
- Content fades out
- Resets to initial state (if scrolling back up)
- No abrupt changes

---

## PROGRESS INDICATOR

### Visual Design
**Linear progress bar:**
- Horizontal bar across top
- Or vertical bar on left side
- Fills as you scroll through steps
- Color matches active step

**Alternative: Dot indicators:**
- Four dots representing steps
- Active dot highlighted
- Inactive dots muted
- Clickable to jump (optional)

### Positioning
- Fixed to viewport
- Always visible while in section
- Non-intrusive
- Clear and readable

---

## INTERACTION STATES

### Scroll Speed
**Adaptive pacing:**
- Slow scroll: Smooth transitions
- Fast scroll: Skip to next logical step
- No jarring mid-transition stops

### Manual Navigation (Optional)
- Click step numbers to jump
- Arrow buttons to advance/reverse
- Keyboard up/down arrows
- Enhances control

### Pause Points
- Natural breaks between steps
- Allows reading without scrolling
- Prevents content from advancing too quickly

---

## ACCESSIBILITY

### Keyboard Navigation
- Tab through step indicators
- Arrow keys advance/reverse steps
- Space/Enter activate step
- Focus visible and clear

### Screen Readers
- Announce step number and title
- Describe visual content
- Provide alternative text for demos
- Skip option available

### Motion Preferences
- Respect prefers-reduced-motion
- Disable scroll-triggered animations
- Provide step-by-step static view
- Maintain content clarity

### Color Contrast
- Text readable on all backgrounds
- Indicators meet WCAG standards
- Visual cues not color-dependent

---

## CONTENT STRATEGY

### Step Naming
**Clarity over cleverness:**
- Use active verbs
- User-focused language
- Parallel structure
- Avoid jargon

**Examples:**
✅ "Tell the AI what you want"  
✅ "Review curated options"  
❌ "Initiate query protocol"  
❌ "AI does its magic"

### Description Writing
**Concise explanations:**
- 1-2 sentences per step
- Focus on benefit
- Avoid technical details
- Conversational tone

**Formula:** "[Who does what] [how] [why]"

---

## PREMIUM DESIGN TOUCHES

### Visual Polish
1. **Smooth animations:** No janky transitions
2. **Subtle effects:** Parallax, fades, scales used sparingly
3. **Typography:** Careful kerning, line-height
4. **Color harmony:** Transitions feel natural
5. **Generous spacing:** Never cramped

### Interaction Refinement
1. **Responsive scrolling:** Feels connected to input
2. **Clear feedback:** Know which step is active
3. **Predictable behavior:** No surprises
4. **Performant:** 60fps animations

### Content Quality
1. **Real examples:** Actual user prompts/results
2. **Authentic voice:** Not corporate speak
3. **Visual clarity:** Demos show, not tell
4. **Emotional connection:** Aspirational but achievable

---

## UX BEST PRACTICES

### Cognitive Load
- One idea per step (no multitasking)
- Visual reinforces text
- Progression is obvious
- No guessing what comes next

### Engagement
- Interactive (scroll-driven)
- Visually dynamic
- Clear payoff (understanding workflow)
- Not passive reading

### Clarity
- Linear flow (A→B→C→D)
- Consistent structure per step
- Progress always visible
- Can jump back if needed

### Mobile Optimization
- Shorter scroll distance per step
- Larger text and touch targets
- Simplified visuals
- Alternative interaction (swipe vs. scroll)

---

## PERFORMANCE CONSIDERATIONS

### Scroll Performance
- Use CSS transforms (GPU-accelerated)
- Debounce scroll events
- requestAnimationFrame for updates
- Avoid layout thrashing

### Animation Efficiency
- Opacity and transform only
- No width/height changes
- Layer promotion for moving elements
- Minimize repaints

### Load Strategy
- Lazy load step visuals
- Preload next step on activation
- Minimize JavaScript dependencies
- Progressive enhancement

---

## TESTING CHECKLIST

- [ ] Section displays correctly on load
- [ ] Scroll triggers step transitions
- [ ] Animations smooth at 60fps
- [ ] Progress indicator updates
- [ ] Text readable on all backgrounds
- [ ] Visuals load and display properly
- [ ] Responsive on mobile/tablet
- [ ] Keyboard navigation works
- [ ] Screen reader accessible
- [ ] Reduced motion respected
- [ ] No layout shifts during scroll
- [ ] Works across browsers (Chrome, Safari, Firefox)

---

## ALTERNATIVE APPROACHES

### Option: Click/Tap Navigation
Instead of scroll:
- Buttons to advance/previous
- Auto-play with pause
- More explicit control

**Trade-off:** Less immersive than scroll

### Option: Video Demonstration
Instead of interactive:
- Play video showing workflow
- Simpler to implement
- Less interactive

**Trade-off:** Passive viewing, less engaging

### Option: Static Step Cards
Instead of scroll effects:
- Four cards side-by-side
- Hover to activate
- No scroll dependency

**Trade-off:** Less dynamic, more traditional

**Recommendation:** Scroll-driven is premium and engaging—keep it

---

## IMPLEMENTATION NOTES

### Component Structure
- Self-contained component
- Minimal props from parent
- Internal scroll logic
- Reusable across pages

### Dependencies
- Scroll detection library (optional: Intersection Observer API)
- Animation library (Framer Motion)
- No external data fetching
- Static content

### State Management
- Track current active step
- Track scroll position
- Update UI based on position
- No complex state needed

---

**Goal:** Create an immersive, scroll-driven experience that clearly demonstrates the platform's core workflow while feeling premium, interactive, and effortless to understand. Make users think "Oh, this is how it works—I get it now."
