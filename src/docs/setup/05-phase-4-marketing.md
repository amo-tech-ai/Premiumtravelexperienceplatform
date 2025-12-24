# PHASE 4: MARKETING PAGES
## Public Website Content + Hero Sections + Feature Showcase

**Document:** 05-phase-4-marketing.md  
**Phase:** 4 of 11  
**Duration:** 90-120 minutes  
**Prerequisites:** Phase 3 complete with layouts working  
**Status:** Ready to Execute

---

## PHASE OBJECTIVE

Build professional marketing pages with compelling content, hero sections, feature showcases, pricing tables, and contact forms following luxury, calm, confident aesthetic with editorial typography and illustrated cards.

---

## SUCCESS CRITERIA

- Homepage with hero, features, testimonials, and CTA
- How It Works page explaining 6 AI agents
- Use Cases page with example scenarios
- Pricing page with tier comparison
- About page with company story
- Contact page with working form
- Privacy and Terms pages with legal content
- Motion animations used with restraint
- Mobile responsive on all pages

---

## STEP-BY-STEP INSTRUCTIONS

### Step 1: Install Motion Library

**Action:** Add animation library for subtle motion effects  

**Installation:**  
Run npm install motion. This installs the modern motion library (formerly Framer Motion). Provides motion components for React.  

**Usage Pattern:**  
Import motion from motion/react. Use motion.div, motion.button for animated elements. Apply variants for enter/exit animations.  

**Verification:** Package installed, motion importable

### Step 2: Install Unsplash Tool

**Action:** Set up image sourcing for marketing pages  

**Note:** Unsplash integration may require tool setup. For now, plan to use placeholder images or store images in src/assets/images/. Prepare image folders for hero images, feature illustrations, team photos.  

**Image Organization:**  
Create folders: assets/images/hero/, assets/images/features/, assets/images/team/, assets/images/illustrations/. Store high-quality images in WebP format for performance.  

**Verification:** Asset folders created and organized

### Step 3: Create Homepage Hero Section

**Action:** Build impactful hero with headline, subheadline, and CTA  

**File - src/pages/marketing/HomePage.tsx:**  
Create Hero component as first section. Include main headline: "Your AI-Powered Trip Operating System for Medellín". Include subheadline explaining value proposition (6 AI agents, automated planning, authentic experiences). Include primary CTA button "Start Planning" linking to /signup. Include secondary CTA "See How It Works" linking to /how-it-works. Add hero image or illustration on right side.  

**Styling:**  
Use large, editorial typography (4xl to 6xl heading). Apply gradient or accent color to key words. Add subtle motion fade-in animation. Full viewport height for above-fold impact.  

**Verification:** Hero section renders with headline, CTAs, and image

### Step 4: Create Homepage Features Grid

**Action:** Showcase key features with icon cards  

**Component - FeatureCard:**  
Create reusable card component accepting icon, title, description props. Card has soft shadow, rounded corners, padding. Icon in primary color at top. Title in bold. Description in muted text.  

**Features to Highlight:**  
Six AI Agents (each specialized for different tasks). Drag-and-Drop Itinerary (visual trip builder). Real-Time Collaboration (share with travel companions). Smart Recommendations (personalized to preferences). Budget Tracking (stay within budget). Offline Access (view trips without internet).  

**Grid Layout:**  
Three columns on desktop, two on tablet, one on mobile. Equal height cards with consistent spacing. Add stagger animation on scroll into view.  

**Verification:** Features grid renders with 6 cards, responsive, animated

### Step 5: Create Homepage Testimonials Section

**Action:** Add social proof with user testimonials  

**Component - TestimonialCard:**  
Create card with user quote, avatar, name, and location. Use Card component from shadcn/ui as base. Include star rating or highlighted quote.  

**Testimonials Content:**  
Three testimonials from different user types. Solo traveler praising AI recommendations. Family appreciating itinerary organization. Business traveler loving time savings. Use placeholder names and photos for now.  

**Layout:**  
Three columns on desktop, scroll carousel on mobile. Cards with slightly elevated shadow. Include quotation mark icon.  

**Verification:** Testimonials section renders with 3 cards

### Step 6: Create Homepage Final CTA Section

**Action:** Add conversion-focused call-to-action before footer  

**Section Content:**  
Headline: "Ready to Experience Medellín Like Never Before?". Subheadline emphasizing ease and AI assistance. Large primary button "Get Started Free". Smaller text below: "No credit card required". Background with subtle gradient or pattern.  

**Styling:**  
Full-width section with contrasting background. Centered content. Large, prominent button. Add motion parallax or subtle animation.  

**Verification:** CTA section renders with button linking to signup

### Step 7: Create How It Works Page

**Action:** Explain the 6 AI agents and workflow  

**File - src/pages/marketing/HowItWorksPage.tsx:**  
Create page explaining trip planning process. Include intro section explaining Trip Operating System concept. Create section for each of 6 AI agents with icon, name, and purpose.  

**Six Agents to Explain:**  
Local Scout (destination insights, cultural guidance). Dining Orchestrator (restaurant recommendations). Event Curator (activities and events). Itinerary Optimizer (route and time optimization). Budget Guardian (cost tracking and alerts). Booking Assistant (reservation management).  

**Agent Card Design:**  
Each agent gets illustrated card. Agent icon or avatar. Agent name in heading. Bullet points of responsibilities. Example use case or scenario.  

**Workflow Diagram:**  
Show visual flow: User inputs preferences → Agents collaborate via event bus → Itinerary automatically generated → User reviews and adjusts → Booking completed. Use arrows or flowchart style.  

**Verification:** Page explains all 6 agents with clear descriptions

### Step 8: Create Use Cases Page

**Action:** Showcase real-world trip scenarios  

**File - src/pages/marketing/UseCasesPage.tsx:**  
Create page with 4-6 use case examples. Each use case tells story of different traveler type.  

**Use Cases to Include:**  
Solo Digital Nomad (remote work + exploration). Family Vacation (kid-friendly activities). Romantic Getaway (couples experiences). Adventure Seeker (outdoor activities). Foodie Tour (culinary experiences). Business Trip (mix work and leisure).  

**Use Case Card:**  
Traveler persona and photo. Trip goals and constraints. How AI agents helped. Final itinerary highlights. Call-out quote from traveler.  

**Layout:**  
Alternating left-right layout for visual interest. Full-width image on one side, content on other. Scroll-triggered animations revealing content.  

**Verification:** Page shows multiple use cases with variety of traveler types

### Step 9: Create Pricing Page

**Action:** Build pricing tiers with feature comparison  

**File - src/pages/marketing/PricingPage.tsx:**  
Create pricing table with multiple tiers. Suggest 3 tiers: Free (basic features), Pro (full AI features), Team (collaboration features).  

**Pricing Table Components:**  
Tier cards with name, price, description. Feature list with checkmarks. Primary CTA button ("Get Started" or "Choose Plan"). Popular/Recommended badge on middle tier.  

**Features to Compare:**  
Number of trips allowed. AI agent access level. Collaboration features. Priority support. Offline access. Advanced customization.  

**Layout:**  
Three columns on desktop, stack on mobile. Middle tier elevated or highlighted. Consistent spacing and alignment.  

**FAQ Section:**  
Below pricing table, add common questions. "Can I change plans?" "What's included in free tier?" "Do you offer refunds?" Use accordion component for expand/collapse.  

**Verification:** Pricing page shows tiers, features, and FAQ

### Step 10: Create About Page

**Action:** Tell company story and mission  

**File - src/pages/marketing/AboutPage.tsx:**  
Create page with company narrative. Include mission statement section. Include team section with photos. Include values or principles section.  

**Mission Section:**  
Headline explaining why I Love Medellín exists. Paragraph about making travel planning effortless. Paragraph about AI democratizing personalized travel. Emphasis on authentic local experiences.  

**Team Section:**  
Grid of team member cards (can be placeholder). Each card has photo, name, role, brief bio. Consider using Avatar components.  

**Values Section:**  
Four core values with icons. Authenticity (real local experiences). Innovation (AI-powered technology). Simplicity (effortless planning). Community (supporting local businesses).  

**Verification:** About page tells compelling story with mission and team

### Step 11: Create Contact Page

**Action:** Build contact form and information  

**File - src/pages/marketing/ContactPage.tsx:**  
Create page with contact form on left, contact info on right. Form includes name, email, subject, message fields. Submit button sends to backend endpoint (placeholder for now).  

**Form Fields:**  
Name input (required). Email input (required, validated). Subject dropdown (General, Support, Partnership, Press). Message textarea (required, multiline). Submit button with loading state.  

**Contact Information:**  
Email address for support. Social media links. Office address if applicable. Response time expectation.  

**Form Validation:**  
Use basic HTML5 validation for now. Required fields marked with asterisk. Email format validated. Show error messages below fields.  

**Verification:** Contact form renders and validates inputs

### Step 12: Create Privacy Policy Page

**Action:** Add legal privacy policy content  

**File - src/pages/marketing/PrivacyPage.tsx:**  
Create page with privacy policy text. Include standard sections: Information Collection, Data Usage, Third-Party Services, Cookies, User Rights, Contact Information.  

**Content:**  
Use template privacy policy for SaaS product. Customize with I Love Medellín specifics. Include last updated date at top. Include table of contents for long document.  

**Styling:**  
Use prose typography for readability. Left-aligned text, readable line length. Section headings with anchors. Sticky table of contents sidebar on desktop.  

**Verification:** Privacy page displays legal content clearly

### Step 13: Create Terms of Service Page

**Action:** Add legal terms and conditions  

**File - src/pages/marketing/TermsPage.tsx:**  
Create page with terms of service text. Include standard sections: Acceptance of Terms, User Accounts, Service Description, Prohibited Uses, Limitation of Liability, Governing Law.  

**Content:**  
Use template terms of service for SaaS. Customize with platform specifics. Include effective date. Include amendment policy.  

**Styling:**  
Same prose typography as privacy page. Consistent formatting. Section numbering (1.0, 1.1, 1.2, etc). Links to privacy policy and other legal docs.  

**Verification:** Terms page displays legal content clearly

### Step 14: Add Typography Styles

**Action:** Implement editorial typography system  

**File - src/styles/globals.css:**  
Define typography scale using CSS custom properties. Set heading sizes (h1 through h6) with responsive scaling. Set body text sizes and line heights. Define font families (display font for headings, readable font for body).  

**Font Loading:**  
Consider using Google Fonts or local fonts. Add font-display: swap for performance. Preload critical fonts.  

**Typography Classes:**  
Create utility classes for editorial styles: .text-editorial-headline, .text-editorial-body, .text-editorial-caption. Apply appropriate font, size, weight, spacing.  

**Verification:** Typography renders with correct fonts and sizing

### Step 15: Add Motion Animations

**Action:** Apply subtle animations to enhance experience  

**Animation Principles:**  
Use motion with restraint and purpose. Fade-in on scroll for sections. Stagger animations for card grids. Subtle hover effects on interactive elements. Page transitions smooth but quick.  

**Implementation Pattern:**  
Wrap sections with motion.div. Add initial and animate props for enter animations. Use whileInView for scroll-triggered animations. Add whileHover for interactive feedback.  

**Example Animations:**  
Hero fades up from below on load. Features stagger in on scroll. Cards lift slightly on hover. Buttons scale slightly on press. Section backgrounds parallax subtly.  

**Verification:** Animations feel polished, not distracting or excessive

### Step 16: Add Illustrated Cards

**Action:** Create illustrated feature and use case cards  

**Design Approach:**  
Use soft, calm illustration style. Pastel or muted colors, not neon. Simple vector illustrations. Consistent style across all illustrations.  

**Card Components:**  
Feature cards have icon illustrations. Use case cards have scenario illustrations. Testimonial cards have user avatars. Agent cards have agent character illustrations.  

**Implementation:**  
Store illustrations as SVG in assets/illustrations/. Import and use in card components. Ensure illustrations responsive and accessible (alt text).  

**Verification:** Cards display illustrations consistently

### Step 17: Add Soft Shadows and Depth

**Action:** Apply elevation system with shadows  

**File - src/styles/globals.css:**  
Define shadow custom properties. Create elevation levels: shadow-sm (subtle), shadow-md (default), shadow-lg (elevated), shadow-xl (floating). Use soft, diffused shadows, not harsh edges.  

**Application:**  
Cards use shadow-md. Hover states elevate to shadow-lg. Modals and dialogs use shadow-xl. Buttons use subtle shadow-sm.  

**Color:**  
Shadows should have slight color tint, not pure black. Use primary color at very low opacity for shadow tint.  

**Verification:** Shadows create depth without harshness

### Step 18: Ensure Mobile Responsiveness

**Action:** Test and refine all marketing pages on mobile  

**Testing Process:**  
Resize browser to mobile widths (375px, 414px, 768px). Check hero section scales properly. Verify feature grids stack to single column. Ensure forms remain usable. Test navigation menu on mobile.  

**Adjustments:**  
Reduce heading sizes on mobile. Adjust padding and spacing. Ensure touch targets large enough (min 44px). Test carousel swipe on touch devices.  

**Verification:** All pages functional and attractive on mobile devices

### Step 19: Add Meta Tags and SEO Basics

**Action:** Prepare pages for search engines  

**Implementation:**  
For each marketing page, add title and description meta tags. Use React Helmet or similar library for meta management. Include Open Graph tags for social sharing.  

**Page Titles:**  
Homepage: "I Love Medellín - AI-Powered Trip Planning for Medellín". How It Works: "How It Works - 6 AI Agents for Perfect Trips". Pricing: "Pricing - Choose Your Plan". Etc.  

**Descriptions:**  
Write compelling 150-160 character descriptions. Include relevant keywords naturally. Focus on value proposition.  

**Verification:** View page source shows meta tags, title updates per page

### Step 20: Final Polish and Testing

**Action:** Review all marketing pages for quality  

**Review Checklist:**  
Proofread all copy for typos and grammar. Check all links navigate correctly. Verify all images load. Test forms submit properly (or show placeholder message). Ensure consistent spacing and alignment. Check color contrast for accessibility. Test animations don't cause motion sickness.  

**Cross-Browser Testing:**  
Test in Chrome, Firefox, Safari. Verify layout consistent. Check animations work across browsers.  

**Verification:** All pages polished, professional, bug-free

---

## VALIDATION CHECKLIST

### Dependencies

- [ ] motion library installed
- [ ] Image assets organized in assets/ folders
- [ ] Fonts loaded and configured
- [ ] All UI components from shadcn available

### Homepage

- [ ] Hero section with headline, subheadline, CTAs
- [ ] Features grid with 6 feature cards
- [ ] Testimonials section with 3+ testimonials
- [ ] Final CTA section before footer
- [ ] All sections responsive on mobile
- [ ] Animations applied subtly

### How It Works Page

- [ ] Intro section explaining system
- [ ] 6 AI agent cards with descriptions
- [ ] Workflow diagram or visual
- [ ] Clear, educational content
- [ ] Responsive layout

### Use Cases Page

- [ ] 4-6 use case scenarios
- [ ] Variety of traveler types
- [ ] Alternating layout
- [ ] Visual interest with images
- [ ] Responsive on mobile

### Pricing Page

- [ ] 3 pricing tiers displayed
- [ ] Feature comparison clear
- [ ] CTA buttons on each tier
- [ ] FAQ section with common questions
- [ ] Responsive pricing table

### About Page

- [ ] Mission statement section
- [ ] Team section (even if placeholder)
- [ ] Company values highlighted
- [ ] Compelling narrative
- [ ] Responsive layout

### Contact Page

- [ ] Contact form with all fields
- [ ] Form validation working
- [ ] Contact information displayed
- [ ] Submit button (placeholder action ok)
- [ ] Responsive form layout

### Legal Pages

- [ ] Privacy policy page with content
- [ ] Terms of service page with content
- [ ] Readable typography
- [ ] Table of contents or navigation
- [ ] Last updated dates

### Design & Polish

- [ ] Editorial typography applied
- [ ] Soft shadows on cards
- [ ] Illustrated cards (or placeholders)
- [ ] Motion animations subtle
- [ ] No neon colors anywhere
- [ ] Calm, confident aesthetic
- [ ] Consistent spacing system
- [ ] Mobile responsive all pages

### Functionality

- [ ] All marketing links navigate correctly
- [ ] Hero CTAs link to signup/how-it-works
- [ ] Form inputs validate
- [ ] Images load properly
- [ ] No console errors
- [ ] Animations performant

---

## TROUBLESHOOTING

### Issue: Animations Janky or Laggy

**Symptom:** Motion animations stutter or drop frames  
**Cause:** Animating expensive properties or too many simultaneous animations  
**Solution:** Animate only transform and opacity (GPU-accelerated). Reduce number of animated elements. Use will-change CSS hint sparingly. Test on lower-end devices.

### Issue: Images Not Loading

**Symptom:** Image tags show broken image icon  
**Cause:** Incorrect import path or file not in public folder  
**Solution:** Verify image files in assets/ directory. Use import syntax for images from src. Check file extensions match (case-sensitive). Verify Vite config handles image imports.

### Issue: Forms Not Submitting

**Symptom:** Click submit button does nothing  
**Cause:** No form submission handler  
**Solution:** Add onSubmit handler to form element. Prevent default behavior. Show success message or console log for now. Will wire to backend in later phase.

### Issue: Typography Not Applying

**Symptom:** Headings and text using default browser fonts  
**Cause:** Fonts not loaded or CSS not imported  
**Solution:** Verify globals.css imported in main.tsx. Check font files in assets/fonts/. Ensure font-face declarations in CSS. Verify font-family applied to elements.

### Issue: Mobile Layout Broken

**Symptom:** Content overflows or misaligned on mobile  
**Cause:** Fixed widths or missing responsive classes  
**Solution:** Use Tailwind responsive prefixes (sm:, md:, lg:). Avoid fixed pixel widths. Test with browser dev tools device emulation. Use max-width containers.

---

## NEXT PHASE PREVIEW

**Phase 5:** Implement authentication system with Supabase. Create login and signup pages. Add session management. Implement protected route guards. Enable OAuth providers.

**What You'll Need:** Marketing pages complete and polished. Supabase project created. Understanding of Supabase Auth concepts.

**Estimated Time:** 60-90 minutes

---

**Phase Status:** ✅ Ready to Execute  
**Last Updated:** December 24, 2024  
**Dependencies:** Phase 3 (layouts)  
**Blocks:** Phase 5 (auth flows need marketing pages for unauthenticated redirect)
