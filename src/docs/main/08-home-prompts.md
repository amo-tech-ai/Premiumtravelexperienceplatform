# HOMEPAGE V2 - BUILD PROMPTS

**Status:** Ready for Implementation  
**Sections:** 12  
**Style:** Luxury + AI Intelligence  
**Timeline:** 4 weeks

---

## DESIGN FOUNDATIONS

### Colors
- **Hero cream:** #FDFCF9
- **Deep navy:** #1A2332
- **Warm gold:** #D4AF37
- **Agent colors:** Green, Amber, Blue, Purple, Pink, Red

### Typography
- **Display:** Playfair Display (headlines)
- **Body:** Inter (paragraphs)
- **Hierarchy:** 80px hero → 64px sections → 48px subsections → 18px body

### Spacing
- **Sections:** 128px vertical gaps
- **Cards:** 24px padding, 16px border radius
- **Shadows:** Multi-layer soft shadows for luxury depth

---

## SECTION 1: HERO

Create a fullscreen hero section with warm gradient background from cream to light blue. Center a large headline "Your Dream Trip, Perfectly Orchestrated by AI" using serif display font. Below add subheadline about six specialized agents working together. Include two buttons: primary "Start Planning Free" in dark navy and secondary "Watch Demo" with outline style. At the bottom show three floating illustrated AI agent cards with subtle connecting lines between them. Add a subtle scroll indicator at very bottom. Make the background shift slightly on scroll for parallax effect.

---

## SECTION 2: TRUST BAR

Build a horizontal trust bar with light gray background. On the left side show partner logos scrolling infinitely in a loop. On the right display three animated stat counters: "50K+ Travelers", "2.4M+ Places", "95% Satisfaction". Make the numbers count up from zero when the section scrolls into view. Add subtle hover effects to logos that remove grayscale filter.

---

## SECTION 3: PROBLEM

Design a problem section with headline "Planning Travel Feels Like Work". Create three illustrated cards in a row showing travel pain points: scattered research across websites, endless comparison between tabs, and generic cookie-cutter itineraries. Each card has custom illustration at top, bold title, and description text. Cards should lift slightly and cast stronger shadows on hover. Animate cards to fade in with staggered timing when section becomes visible.

---

## SECTION 4: AI AGENTS SOLUTION

Create a showcase of six AI agents in two rows of three. Each agent card has a gradient border in its signature color, large icon, agent name, role description, and key capability. Show animated connector lines flowing between cards to visualize how agents collaborate. Add small animated particles traveling along the connection paths. Below the grid display three key metrics with icons: response time, accuracy percentage, and availability. Make connector lines draw in from left to right when section scrolls into view.

---

## SECTION 5: HOW IT WORKS TIMELINE

Build a vertical timeline with five major steps. Draw a progress line down the left side that fills with gold color based on scroll position. Each step has a circular numbered badge connected to the line, headline, description, and screenshot or illustration on the right. Steps alternate slightly left and right for visual interest. Each step fades in and slides up when it becomes 50% visible during scroll.

---

## SECTION 6: FEATURES GRID

Display six feature cards in a three-column grid. Each card has gradient background icon at top, feature headline, and short description. Features include: drag and drop itinerary, AI auto-generate plans, real-time chat, smart search, context awareness, and multi-modal views. Cards fade in with staggered delays. Icons should gently bounce and rotate on hover while card lifts up with enhanced shadow.

---

## SECTION 7: INTERACTIVE DEMO

Create an embedded chat demo interface centered in the section. Show AI message asking where user wants to go, input field for typing, and three suggested prompt pills like "Beach vacation under $2000" and "3-day food tour in Italy". Include a send button. Add typing indicator animation when AI is "responding". Below demo add small text "Powered by 6 AI agents working together" with sparkle emoji. Style the demo with premium shadows and rounded corners.

---

## SECTION 8: AI INTELLIGENCE METRICS

Design six metric cards in a grid showcasing AI performance. Include animated radial progress chart for 95% accuracy, line graph for 300ms response time, large counter for 2.4M+ places, trip counter for 50K+ trips, star rating visualization for 87% satisfaction, and pulse indicator for 24/7 monitoring. All charts and counters animate when section scrolls into view. Use smooth easing and staggered timing.

---

## SECTION 9: USE CASES

Build a horizontal scrolling row of use case cards. Show four scenarios: Family Vacation, Solo Adventure, Business Travel, and Romantic Getaway. Each card has hero image, title, and description of how AI helps that journey type. Cards snap to position when scrolling. Add arrow navigation buttons on left and right edges, plus dot indicators below showing current position. Images should zoom slightly on hover.

---

## SECTION 10: TESTIMONIALS

Create a testimonial carousel with one large card visible at a time. Each testimonial shows large quote in serif font, five gold stars, user photo in circular frame, user name and role, trip count, and optional video play button. Add left and right arrow controls plus dot navigation. Auto-rotate testimonials every 7 seconds but pause on hover. Transition between testimonials with smooth crossfade. Style quote with subtle opening quotation mark background element.

---

## SECTION 11: FINAL CTA

Design conversion-focused section with dark navy gradient background and subtle travel illustration overlay. Large white headline "Ready to Plan Your Dream Trip?" followed by subheadline about joining travelers who trust the platform. Prominent white button "Start Planning Free - No Credit Card" with subtle glow effect. Below button add "Or Watch Demo" link. At bottom show row of partner logos that appeared in press. Button should lift and glow more intensely on hover.

---

## SECTION 12: FOOTER

Build comprehensive footer with dark gradient background. Organize into five columns: Product links, Company links, Resources links, Connect social icons, and Newsletter signup. Newsletter section has headline, description, email input with glow-on-focus, and subscribe button. Social icons should be circular with subtle backgrounds that brighten on hover. Bottom row shows copyright, privacy links, and legal items. Make footer responsive by stacking columns on mobile.

---

## ANIMATIONS

### Scroll-Triggered
Set up intersection observer watching all major sections. Trigger fade-in and slide-up animations when sections reach 30% visibility. Use smooth easing with 0.8 second duration.

### Staggered Grids
When grid sections appear, animate child items with incremental delays of 0.15 seconds each. Creates cascading entrance effect.

### SVG Path Drawing
Connector lines between AI agents should draw from start to end over 1.5 seconds using stroke dashoffset animation technique.

### Number Counters
Animate stat numbers counting from zero to target over 2 seconds when scrolling into view. Use requestAnimationFrame for smooth counting.

### Hover States
Cards lift 8-12 pixels up with enhanced shadows. Icons scale 110% and rotate 5 degrees. Buttons translate up 2-4 pixels with glow effects. All transitions smooth at 0.3 seconds.

### Parallax
Hero background moves at 0.3x scroll speed. Floating elements move at variable speeds between 0.1x and 0.2x based on layer depth.

---

## RESPONSIVE BREAKPOINTS

### Mobile (320-767px)
- Single column layouts for all grids
- Stack hero buttons vertically full width
- Reduce headline sizes by 40-50%
- Simplify AI agent preview to icons only
- Remove parallax effects for performance
- Increase touch target sizes to 44px minimum
- Enable touch scrolling for horizontal sections

### Tablet (768-1023px)
- Two column grids for features and agents
- Reduce headline sizes by 20-30%
- Maintain most animations
- Adjust section padding to 64px vertical

### Desktop (1024px+)
- Three column grids
- Full animation system
- Maximum container width 1280px
- Generous whitespace and padding

---

## IMPLEMENTATION ORDER

**Week 1:** Design system setup, hero section, trust bar, problem cards  
**Week 2:** AI agents flowchart, timeline component, features grid  
**Week 3:** Demo interface, metrics charts, use case scroll  
**Week 4:** Testimonials carousel, CTA section, footer, polish

---

## SUCCESS METRICS

- **Load:** First paint under 1.5s, full load under 3.5s
- **Engagement:** 90+ seconds average time, 70%+ scroll depth
- **Conversion:** 5-8% click-through on CTAs, 15-20% demo interaction
- **Performance:** 60fps animations, smooth scroll, no jank

---

**Total Build Time:** 4 weeks  
**Conversion Goal:** 5-8% sign-ups  
**Mobile Traffic:** 40-50% of visitors
