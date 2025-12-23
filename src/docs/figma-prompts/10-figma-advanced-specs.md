# FIGMA ADVANCED SPECIFICATIONS
## Complex Interactions & Edge Cases

**Document:** 10-figma-advanced-specs.md  
**Last Updated:** December 22, 2024  
**Purpose:** Advanced design specifications for complex features

---

## 🎯 ADVANCED INTERACTIONS

### Drag & Drop Itinerary
- **Behavior:** Reorder activities by dragging
- **Visual Feedback:** Lift effect, drop zones highlight
- **Constraints:** Can't drag across days
- **Mobile:** Long press to activate drag mode

### AI Chat Streaming
- **Behavior:** Text appears word-by-word
- **Loading State:** Typing indicator with animated dots
- **Error State:** Inline error message with retry
- **History:** Scroll to load more messages

### Map Integration
- **Markers:** Custom icons for each activity type
- **Clustering:** Group nearby markers at low zoom
- **Info Windows:** Pop-up with activity details
- **Routes:** Connect activities with polylines

---

## 🔄 STATE MANAGEMENT

### Loading States
- **Skeleton screens** for initial load
- **Spinners** for actions
- **Progress bars** for long operations
- **Shimmer effect** for content loading

### Empty States
- **Illustration** + helpful message
- **Primary CTA** to add content
- **Examples** or templates
- **Onboarding** hints

### Error States
- **Inline errors** for form fields
- **Toast notifications** for actions
- **Full-page errors** for critical failures
- **Retry buttons** for temporary failures

---

## 🎨 ANIMATION SPECIFICATIONS

### Transitions
- **Duration:** 200-300ms
- **Easing:** ease-in-out
- **Types:** Fade, slide, scale

### Micro-interactions
- **Button hover:** Scale 1.02, shadow increase
- **Card hover:** Lift 4px, shadow intensify
- **Input focus:** Ring appear, border color change
- **Success:** Check mark animation (300ms)

---

## 📱 MOBILE-SPECIFIC

### Bottom Sheets
- **Height:** 60% viewport
- **Drag Handle:** Visual indicator at top
- **Backdrop:** Semi-transparent overlay
- **Snap Points:** 60%, 90%, closed

### Swipe Gestures
- **Swipe Left:** Delete action
- **Swipe Right:** Archive action
- **Pull to Refresh:** Top of lists
- **Swipe to Go Back:** Navigation

---

## ♿ ACCESSIBILITY

### WCAG AA Compliance
- **Contrast:** 4.5:1 minimum
- **Focus Indicators:** Visible on all interactive elements
- **Keyboard Navigation:** Tab order logical
- **Screen Reader:** ARIA labels on all controls

### Touch Targets
- **Minimum Size:** 44x44px
- **Spacing:** 8px between targets
- **Mobile:** 48x48px recommended

---

**Document Location:** `/docs/figma-prompts/10-figma-advanced-specs.md`  
**Previous Location:** `/docs/13-figma-advanced-specs.md`  
**Full specifications:** See original file for complete details
