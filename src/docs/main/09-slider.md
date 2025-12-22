# IMAGE SLIDER - DESIGN SPECIFICATION

**Component:** Product/Content Image Slider  
**Reference:** `figma:asset/facc8201133892debf69e9487b42bdae4af9ef80.png`  
**Style:** Modern, Minimal, E-commerce  
**Status:** Ready for Implementation

---

## DESIGN OVERVIEW

Create a horizontal image slider showcasing product photography or content with smooth transitions, touch gestures, and elegant navigation controls. Design prioritizes visual clarity, fast loading, and intuitive interaction.

---

## CORE SPECIFICATIONS

### Layout Structure
- **Container:** Full-width or constrained max-width (1280px)
- **Image Ratio:** 3:4 portrait or custom aspect ratio
- **Gap:** 16-24px between slides on desktop, 12px mobile
- **Slides Visible:** 3-5 on desktop, 1-2 on mobile
- **Overflow:** Hidden with smooth scroll snap

### Image Treatment
- **Quality:** High-resolution, optimized WebP with JPEG fallback
- **Loading:** Lazy load off-screen images, eager load first 3
- **Fit:** Object-fit cover, centered alignment
- **Background:** Preserve original image backgrounds (varied colors create visual interest)

### Navigation Controls
- **Arrows:** Circular or pill-shaped, 48px × 48px minimum
- **Position:** Centered vertically, 24px from container edges
- **Color:** Semi-transparent background (white/black 80%), hover 100%
- **Icons:** Chevron left/right, 24px size
- **Mobile:** Hide arrows, rely on touch/swipe

### Progress Indicators
- **Dots:** 8-10px circles, 12px spacing
- **Active State:** Larger (12px) or stretched pill (24px × 8px)
- **Position:** Bottom center, 24px from container edge
- **Color:** Inactive (opacity 30%), active (opacity 100%)
- **Alternative:** Progress bar (2-4px height, full width)

---

## INTERACTION PATTERNS

### Desktop Behavior
- **Click Arrows:** Advance one slide with smooth scroll (300ms ease-out)
- **Keyboard:** Left/Right arrows navigate, Tab focuses controls
- **Mouse Drag:** Optional horizontal drag to scrub through slides
- **Hover:** Pause auto-advance, show navigation controls

### Mobile/Touch Behavior
- **Swipe:** Horizontal swipe gesture with momentum
- **Snap:** Snap to nearest slide on release
- **Threshold:** 50px or 30% slide width to trigger advance
- **Feedback:** Elastic bounce at start/end boundaries

### Auto-Advance (Optional)
- **Interval:** 5-7 seconds between transitions
- **Pause:** On hover, focus, or user interaction
- **Resume:** After 2 seconds of inactivity
- **Loop:** Infinite loop or stop at last slide

---

## RESPONSIVE BREAKPOINTS

### Mobile (< 768px)
- Show 1 slide (full-width)
- Hide arrow navigation
- Enable touch swipe
- Reduce padding to 16px
- Stack dots below with 16px margin

### Tablet (768px - 1023px)
- Show 2 slides with gap
- Optional arrows (outside container)
- Touch + arrow navigation
- Padding 24px

### Desktop (1024px+)
- Show 3-5 slides based on container width
- Full arrow navigation visible
- Optional mouse drag
- Padding 32-48px
- Hover effects enabled

---

## BEST PRACTICES

### Performance
✅ Lazy load images beyond first viewport  
✅ Serve responsive images (srcset) based on screen size  
✅ Preload next/previous slides for instant transition  
✅ Use CSS transforms (translateX) not position/margin  
✅ Debounce resize events, throttle scroll handlers  

### Accessibility
✅ ARIA labels on all controls ("Next slide", "Previous slide", "Slide 1 of 5")  
✅ Keyboard navigation (arrows, tab, enter/space)  
✅ Focus indicators visible on all interactive elements  
✅ Pause auto-advance on focus (screen reader users)  
✅ Live region announces current slide to screen readers  

### UX Principles
✅ Show partial next slide to indicate scrollability  
✅ Smooth, natural easing (ease-out or cubic-bezier)  
✅ Immediate feedback on touch/click (no delay)  
✅ Clear active state on progress indicators  
✅ Respect reduced motion preferences (no auto-advance)  

### Visual Polish
✅ Consistent image aspect ratios across slides  
✅ High-quality photography with professional styling  
✅ Varied backgrounds create dynamic visual rhythm  
✅ Subtle shadows or borders enhance image separation  
✅ Loading skeletons match final image dimensions  

---

## DESIGN PROMPT

Create a modern image slider component for product showcase. Display 3-5 high-quality portrait images in a horizontal scrollable row with 20px gaps. Each image has natural studio backgrounds in varied colors (white, beige, charcoal, blue, gray) creating visual interest. Add circular navigation arrows (48px) positioned outside the slider on left and right edges, semi-transparent white background, black chevron icons. Below the slider, center-align dot indicators (10px circles) with the active dot expanded to a 24px pill shape. Use gold or navy accent color for active state. Enable smooth scroll snap behavior, swipe gestures on mobile, and keyboard arrow navigation. Images should maintain 3:4 aspect ratio, use object-fit cover, and lazy load efficiently. On mobile, show single full-width image with swipe, hiding arrow buttons. Add subtle fade-in animation when images enter viewport. Pause any auto-advance on hover or interaction. Design feels premium, minimal, and optimized for fast e-commerce browsing.

---

## ANIMATION DETAILS

### Slide Transition
```
Duration: 300-400ms
Easing: cubic-bezier(0.16, 1, 0.3, 1) /* Smooth ease-out */
Property: transform translateX()
```

### Dot Indicator
```
Active State: Scale 1.2 or width expand 24px
Transition: 200ms ease-out
Hover: Opacity 1, scale 1.1
```

### Arrow Buttons
```
Hover: Scale 1.1, shadow increase
Active: Scale 0.95
Disabled: Opacity 0.3, cursor not-allowed
```

### Image Load
```
Initial: Blur placeholder or skeleton
Loaded: Fade-in 300ms
Error: Fallback icon/message
```

---

## IMPLEMENTATION LIBRARIES

**Recommended:**
- **Swiper.js** - Feature-rich, accessible, 40KB gzipped
- **Keen-Slider** - Lightweight, vanilla JS, 5KB gzipped
- **Embla Carousel** - Flexible, framework-agnostic, 8KB gzipped
- **React Slick** - React wrapper, extensive options (if using React)

**Custom Build:**
- CSS Scroll Snap + IntersectionObserver for lazy load
- Touch events API for swipe gestures
- RequestAnimationFrame for smooth animations
- Resize Observer for responsive behavior

---

## VARIANT DESIGNS

### Minimal (Current Reference)
- Clean product focus
- Subtle controls
- Maximum image prominence

### Editorial
- Larger text overlays
- Gradient backgrounds on images
- Caption/description per slide

### Thumbnail Preview
- Small thumbnail strip below main slider
- Click thumbnail to jump to slide
- Active thumbnail highlighted

### Full-Screen Hero
- 100vh height
- Autoplay video support
- Parallax scroll effects
- Large typographic overlays

---

## CONTENT GUIDELINES

### Image Requirements
- **Dimensions:** Minimum 800×1200px (3:4 ratio)
- **Format:** WebP + JPEG fallback
- **Optimization:** Compress to <200KB per image
- **Alt Text:** Descriptive (e.g., "Woman in yellow sweater, blue background")

### Quantity Recommendations
- **Optimal:** 5-8 slides for engagement
- **Minimum:** 3 slides (less feels incomplete)
- **Maximum:** 12 slides (more causes fatigue)

### Visual Variety
- Mix backgrounds (light, dark, colored)
- Vary compositions (close-up, full-body, detail)
- Maintain consistent photography style
- Balance color palette across set

---

## SUCCESS METRICS

**Engagement:**
- 60%+ users interact with slider
- Average 3+ slides viewed
- <5% bounce rate on slider section

**Performance:**
- First slide LCP <2.5s
- Transition smoothness 60fps
- No layout shift during load

**Conversion:**
- 15%+ click-through to product pages
- 10%+ add-to-cart from slider products

---

**Status:** Ready for Development  
**Priority:** High (Homepage, Category Pages)  
**Effort:** Medium (2-3 days with library, 5-7 days custom)
