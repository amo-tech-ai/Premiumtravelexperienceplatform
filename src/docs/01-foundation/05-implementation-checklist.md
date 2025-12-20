# Design System Implementation — Master Checklist

**Date:** December 20, 2024  
**Status:** 📋 Ready for Execution  
**Estimated Time:** 13-14 hours  
**Version:** 1.1 (Corrected)

---

## 🎯 Quick Start

**Before You Begin:**
1. [ ] Read `/docs/01-foundation/03-audit-assessment.md` (understand what was corrected)
2. [ ] Read `/docs/01-foundation/04-corrections-applied.md` (see all changes)
3. [ ] Review `/docs/01-foundation/01-fix-design-system.md` (updated implementation plan)
4. [ ] Backup Figma file (create version checkpoint)
5. [ ] Set up time tracker (realistic: 13-14 hours total)

---

## 📊 Progress Tracking

### Overall Progress

| Phase | Est. Time | Status | Actual Time | Notes |
|-------|-----------|--------|-------------|-------|
| Phase 1: Variables & Tokens | 90 min | ⬜ Not Started | ___ min | |
| Phase 2: Typography | 60 min | ⬜ Not Started | ___ min | |
| Phase 3: Components | 180 min | ⬜ Not Started | ___ min | |
| Phase 4: Auto Layout | 120 min | ⬜ Not Started | ___ min | |
| Phase 5: Visual Consistency | 45 min | ⬜ Not Started | ___ min | |
| Phase 6: Image Standards | 30 min | ⬜ Not Started | ___ min | |
| Phase 7: Naming & Organization | 60 min | ⬜ Not Started | ___ min | |
| Phase 8: Prototyping | 90 min | ⬜ Not Started | ___ min | |
| Verification & Testing | 60 min | ⬜ Not Started | ___ min | |
| **Total** | **795 min (13.25h)** | **0% Complete** | **___** | |

**Status Legend:**
- ⬜ Not Started
- 🔵 In Progress
- ✅ Complete
- ⚠️ Issues Found
- 🔄 Needs Revision

---

## Phase 1: Variables & Tokens (90 min)

### Pre-Flight Check
- [ ] Figma file backup created
- [ ] Version checkpoint created
- [ ] Frame organization understood (Mobile 375px, Desktop 1440px)
- [ ] Team notified of work starting

### Step 1.1: Theme Variables (30 min)

**Create Theme Collection:**
- [ ] Collection created and named "Theme"
- [ ] Mode set to default

**Primary Colors:**
- [ ] `primary/default` → #064E3B
- [ ] `primary/hover` → #043D2E

**Accent Colors:**
- [ ] `accent/gold` → #D4AF37

**Background Colors:**
- [ ] `bg/canvas` → #F7F7F5
- [ ] `bg/surface` → #FFFFFF

**Text Colors:**
- [ ] `text/main` → #111827
- [ ] `text/muted` → #6B7280

**Status Colors:**
- [ ] `status/success` → #059669
- [ ] `status/error/default` → #991B1B
- [ ] `status/error/hover` → #7A1716 ⭐ NEW

**Verification:**
- [ ] Total: 12 color variables created
- [ ] All show correct hex values
- [ ] Variables grouped correctly (using `/`)
- [ ] No typos in names

### Step 1.2: Metrics Variables (20 min)

**Create Metrics Collection:**
- [ ] Collection created and named "Metrics"
- [ ] Mode set to Float

**Spacing Variables:**
- [ ] `spacing/4` → 4
- [ ] `spacing/8` → 8
- [ ] `spacing/12` → 12
- [ ] `spacing/16` → 16
- [ ] `spacing/24` → 24
- [ ] `spacing/32` → 32
- [ ] `spacing/48` → 48
- [ ] `spacing/64` → 64

**Radius Variables:**
- [ ] `radius/sm` → 4
- [ ] `radius/md` → 8
- [ ] `radius/lg` → 16
- [ ] `radius/full` → 999

**Verification:**
- [ ] Total: 12 metric variables created
- [ ] All values are numbers (not strings)
- [ ] Reference table consulted for usage

### Step 1.3: Replace Hardcoded Colors (20 min)

**Process:**
- [ ] Select all frames (Cmd+A)
- [ ] Filter by fill color
- [ ] Replace with appropriate variables

**Exception Tracking:**
- [ ] Gradients documented (OK to use hex)
- [ ] External assets documented (OK to keep)
- [ ] Zero other hardcoded colors

**Verification Test:**
- [ ] Search "#064E3B" → only in gradients ✅
- [ ] Search "16px" → only in text styles ✅
- [ ] Select button → fill shows "primary/default" ✅
- [ ] Select background → fill shows "bg/*" ✅

### Step 1.4: Apply Spacing Variables (10 min)

- [ ] All Auto Layout padding uses variables
- [ ] All Auto Layout gap uses variables
- [ ] No manual spacing values remain

### Step 1.5: Apply Radius Variables (10 min)

- [ ] All buttons use `radius/sm`
- [ ] All cards use `radius/md`
- [ ] All modals use `radius/lg`
- [ ] All avatars use `radius/full`

### Phase 1 Acceptance Test

**Test 1: Color Variables**
- [ ] Select button → shows "primary/default" ✅
- [ ] Select background → shows "bg/*" ✅
- [ ] Select text → shows "text/*" ✅

**Test 2: Spacing Variables**
- [ ] Select Auto Layout → padding shows "spacing/*" ✅
- [ ] Select Auto Layout → gap shows "spacing/*" ✅

**Test 3: Radius Variables**
- [ ] Select button → radius shows "radius/sm" ✅
- [ ] Select card → radius shows "radius/md" ✅

**Test 4: Zero Hardcoded Values**
- [ ] No hex colors outside gradients ✅
- [ ] No pixel values outside text styles ✅

**Phase 1 Status:** ⬜ Not Started → ✅ Complete

---

## Phase 2: Typography System (60 min)

### Pre-Phase Check
- [ ] Phase 1 complete and verified
- [ ] Frame breakpoints understood (Mobile vs Desktop)

### Step 2.1: Create Text Styles (30 min)

**Create 6 Text Styles:**

1. [ ] **Display/Bold/Desktop**
   - Font: Playfair Display
   - Weight: Bold (700)
   - Size: 48px
   - Line height: 56px
   - Letter spacing: -0.02em

2. [ ] **Display/Bold/Mobile**
   - Font: Playfair Display
   - Weight: Bold (700)
   - Size: 32px
   - Line height: 40px
   - Letter spacing: -0.01em

3. [ ] **Display/Semibold**
   - Font: Playfair Display
   - Weight: Semibold (600)
   - Size: 24px
   - Line height: 32px
   - Letter spacing: 0

4. [ ] **Body/Regular**
   - Font: Inter
   - Weight: Regular (400)
   - Size: 16px
   - Line height: 24px
   - Letter spacing: 0

5. [ ] **Body/Medium**
   - Font: Inter
   - Weight: Medium (500)
   - Size: 16px
   - Line height: 24px
   - Letter spacing: 0

6. [ ] **Caption/Regular**
   - Font: Inter
   - Weight: Regular (400)
   - Size: 14px
   - Line height: 20px
   - Letter spacing: 0

**Verification:**
- [ ] All 6 styles created
- [ ] Fonts correct (Playfair Display, Inter)
- [ ] Weights correct
- [ ] Sizes match exactly
- [ ] Line heights match exactly
- [ ] Letter spacing set correctly

### Step 2.2: Replace All Text Layers (30 min)

**Frame Identification:**
- [ ] Mobile frames identified (375px width)
- [ ] Desktop frames identified (1440px width)
- [ ] Identification method chosen (width, page, or name)

**Text Replacement:**

**Desktop Frames:**
- [ ] Headlines → Display/Bold/Desktop
- [ ] Subheadings → Display/Semibold
- [ ] Body → Body/Regular
- [ ] Labels → Body/Medium
- [ ] Captions → Caption/Regular

**Mobile Frames:**
- [ ] Headlines → Display/Bold/Mobile ⭐ (different from desktop)
- [ ] Subheadings → Display/Semibold (same)
- [ ] Body → Body/Regular (same)
- [ ] Labels → Body/Medium (same)
- [ ] Captions → Caption/Regular (same)

**Verification:**
- [ ] All headlines use Display styles
- [ ] All body text uses Body styles
- [ ] All captions use Caption styles
- [ ] Mobile frames use Mobile text style
- [ ] Desktop frames use Desktop text style
- [ ] No custom font sizes remain

### Phase 2 Acceptance Test

**Test 1: Text Style Coverage**
- [ ] Select all text → no "Mixed" in dropdown ✅
- [ ] All text shows style names ✅

**Test 2: Font Consistency**
- [ ] Display styles → Playfair Display ✅
- [ ] Body/Caption → Inter ✅

**Test 3: Custom Sizes Eliminated**
- [ ] No text shows "16px" or similar ✅
- [ ] All show style names ✅

**Test 4: Mobile vs Desktop**
- [ ] Mobile frames → Mobile styles ✅
- [ ] Desktop frames → Desktop styles ✅

**Phase 2 Status:** ⬜ Not Started → ✅ Complete

---

## Phase 3: Component Fixes (180 min)

### Pre-Phase Check
- [ ] Phases 1-2 complete
- [ ] Understand: Buttons don't scale, Cards do scale ⭐
- [ ] Design rationales read

### Step 3.1: Button Component (60 min)

**Create Component Set:**
- [ ] Base component created
- [ ] Auto Layout applied (horizontal)
- [ ] Component set created

**Add Properties:**
- [ ] Property "Type" → Primary, Secondary, Ghost, Danger
- [ ] Property "Size" → Small, Medium, Large
- [ ] Property "State" → Default, Hover, Active, Disabled, Loading
- [ ] Total: 60 variants (4×3×5)

**Small Size:**
- [ ] Padding: 8x16 (uses spacing/8 and spacing/16)
- [ ] Gap: 8 (uses spacing/8)
- [ ] Radius: radius/sm

**Medium Size:**
- [ ] Padding: 12x24 (uses spacing/12 and spacing/24)
- [ ] Gap: 8 (uses spacing/8)
- [ ] Radius: radius/sm

**Large Size:**
- [ ] Padding: 16x32 (uses spacing/16 and spacing/32)
- [ ] Gap: 12 (uses spacing/12)
- [ ] Radius: radius/sm

**Primary Type:**
- [ ] Fill: primary/default
- [ ] Text: bg/surface
- [ ] Hover: primary/hover
- [ ] Border: None

**Secondary Type:**
- [ ] Fill: Transparent
- [ ] Text: primary/default
- [ ] Hover: bg/canvas
- [ ] Border: 1px primary/default

**Ghost Type:**
- [ ] Fill: Transparent
- [ ] Text: text/main
- [ ] Hover: bg/canvas
- [ ] Border: None

**Danger Type:**
- [ ] Fill: status/error/default ⭐
- [ ] Text: bg/surface
- [ ] Hover: status/error/hover ⭐
- [ ] Border: None

**State: Default**
- [ ] Normal appearance
- [ ] Cursor: pointer

**State: Hover**
- [ ] Apply hover fills
- [ ] Scale: 1.0 (NO scale) ⭐
- [ ] Transition: 150ms
- [ ] Design rationale understood ⭐

**State: Active**
- [ ] Fill: Darken by 10%
- [ ] Scale: 0.98

**State: Disabled**
- [ ] Opacity: 0.5
- [ ] Cursor: not-allowed

**State: Loading**
- [ ] Show spinner
- [ ] Disabled state
- [ ] Text: "Loading..." or hide

**Verification:**
- [ ] 60 variants exist
- [ ] All use Auto Layout
- [ ] All use variables (no hardcoded values)
- [ ] Hover states work
- [ ] Loading shows spinner
- [ ] Disabled reduces opacity
- [ ] Text styles applied (Body/Medium)

### Step 3.2: Card Component (60 min)

**Create Component Set:**
- [ ] Base structure created
- [ ] Auto Layout applied
- [ ] Component set created

**Add Properties:**
- [ ] Property "Type" → Event, Restaurant, Rental, Tourist
- [ ] Property "Size" → Compact, Expanded
- [ ] Property "State" → Default, Hover, Selected, SoldOut
- [ ] Total: 32 variants (4×2×4)

**Compact Layout:**
- [ ] Direction: Horizontal
- [ ] Gap: 16 (spacing/16)
- [ ] Padding: 12 (spacing/12)
- [ ] Image: 120×120

**Expanded Layout:**
- [ ] Direction: Vertical
- [ ] Gap: 12 (spacing/12)
- [ ] Padding: 0 (image), 16 (content)
- [ ] Image: Full width × 180

**Type: Event**
- [ ] Badge: accent/gold
- [ ] Icon: Calendar
- [ ] Image: 16:9

**Type: Restaurant**
- [ ] Badge: primary/default
- [ ] Icon: Utensils
- [ ] Image: 4:3

**Type: Rental**
- [ ] Badge: status/success
- [ ] Icon: Home
- [ ] Image: 1:1

**Type: Tourist**
- [ ] Badge: text/muted
- [ ] Icon: MapPin
- [ ] Image: 16:9

**State: Default**
- [ ] Border: 1px primary/default at 10%
- [ ] Shadow: effect-subtle
- [ ] Background: bg/surface

**State: Hover**
- [ ] Border: 1px primary/default at 30%
- [ ] Shadow: effect-floating
- [ ] Scale: 1.02 ⭐
- [ ] Transition: 200ms
- [ ] Design rationale understood ⭐

**State: Selected**
- [ ] Border: 2px primary/default
- [ ] Shadow: effect-floating
- [ ] Background: primary/default at 5%

**State: SoldOut**
- [ ] Image: Grayscale filter
- [ ] Opacity: 0.6
- [ ] Badge: "Sold Out" overlay
- [ ] No hover effects

**Verification:**
- [ ] 32 variants exist
- [ ] Compact is horizontal
- [ ] Expanded is vertical
- [ ] Types have correct badges
- [ ] Hover scales to 1.02
- [ ] Selected shows border
- [ ] SoldOut is grayscale
- [ ] All use Auto Layout
- [ ] All use variables

### Step 3.3: ChatMessage Component (30 min)

**Create Component Set:**
- [ ] Base structure created
- [ ] Component set created

**Add Properties:**
- [ ] Property "Sender" → User, AI
- [ ] Property "State" → Typing, Sent, Error
- [ ] Property "Attachment" → None, Card, MapLink
- [ ] Total: 18 variants (2×3×3)

**User Message:**
- [ ] Align: Right
- [ ] Max width: 70%
- [ ] Background: primary/default
- [ ] Text: bg/surface
- [ ] Radius: Custom (asymmetric)

**AI Message:**
- [ ] Align: Left
- [ ] Max width: 70%
- [ ] Background: bg/canvas
- [ ] Text: text/main
- [ ] Avatar: 32×32 with radius/full

**State: Typing**
- [ ] Animated dots (Smart Animate)
- [ ] No message text
- [ ] No timestamp

**State: Sent**
- [ ] Message content visible
- [ ] Timestamp visible
- [ ] User: checkmarks (✓✓)

**State: Error**
- [ ] Border: 1px status/error/default
- [ ] Error icon visible
- [ ] Timestamp in red

**Attachments:**
- [ ] Card attachment embeds correctly
- [ ] MapLink shows preview

**Verification:**
- [ ] 18 variants exist
- [ ] User aligns right
- [ ] AI aligns left
- [ ] AI shows avatar
- [ ] Typing animates
- [ ] Attachments render

### Step 3.4: Input Component (30 min)

**Create Component Set:**
- [ ] Base structure created
- [ ] Component set created

**Add Properties:**
- [ ] Property "State" → Default, Focused, Error, Disabled
- [ ] Property "Type" → Text, Email, Number, Search
- [ ] Total: 16 variants (4×4)

**Layout:**
- [ ] Auto Layout: Horizontal
- [ ] Padding: 12x16 (spacing/12, spacing/16)
- [ ] Gap: 8 (spacing/8)
- [ ] Radius: radius/sm
- [ ] Height: 48px (fixed)

**State: Default**
- [ ] Border: 1px text/muted at 30%
- [ ] Background: bg/surface
- [ ] No shadow

**State: Focused**
- [ ] Border: 2px primary/default
- [ ] Background: bg/surface
- [ ] Shadow: effect-subtle

**State: Error**
- [ ] Border: 2px status/error/default
- [ ] Background: bg/surface
- [ ] Error icon (right)

**State: Disabled**
- [ ] Border: 1px text/muted at 10%
- [ ] Background: bg/canvas
- [ ] Opacity: 50%

**Type: Text**
- [ ] No icon
- [ ] Placeholder: "Enter text..."

**Type: Email**
- [ ] Icon: Mail (left)
- [ ] Placeholder: "Enter email..."

**Type: Number**
- [ ] Icon: Hash (left)
- [ ] Placeholder: "Enter number..."

**Type: Search**
- [ ] Icon: Search (left)
- [ ] Clear button (×) when focused

**Verification:**
- [ ] 16 variants exist
- [ ] All height: 48px
- [ ] Focused has thick border
- [ ] Error shows red
- [ ] Icons match types
- [ ] Search clear button logic works

### Phase 3 Acceptance Test

**Component Health Check:**

**Button:**
- [ ] 60 variants ✅
- [ ] All use Auto Layout ✅
- [ ] All use variables ✅
- [ ] Hover works (no scale) ✅
- [ ] Loading shows spinner ✅

**Card:**
- [ ] 32 variants ✅
- [ ] Compact horizontal ✅
- [ ] Expanded vertical ✅
- [ ] Hover scales 1.02 ✅
- [ ] Types differ ✅

**ChatMessage:**
- [ ] 18 variants ✅
- [ ] User right, AI left ✅
- [ ] Typing animates ✅
- [ ] Attachments work ✅

**Input:**
- [ ] 16 variants ✅
- [ ] Height 48px ✅
- [ ] States differ ✅
- [ ] Icons correct ✅

**Phase 3 Status:** ⬜ Not Started → ✅ Complete

---

## Phase 4: Auto Layout & Responsiveness (120 min)

### Step 4.1: Convert to Auto Layout (60 min)
- [ ] All page frames use Auto Layout
- [ ] All section frames use Auto Layout
- [ ] Parent frames use padding
- [ ] Child spacing uses gap
- [ ] No absolute positioning

### Step 4.2: Create Responsive Frames (60 min)

**Mobile Frames (375px):**
- [ ] All screens created
- [ ] Single column layout
- [ ] Bottom navigation
- [ ] Bottom sheets
- [ ] 16px margins

**Tablet Frames (768px):**
- [ ] All screens created
- [ ] 2-column grid
- [ ] Side navigation
- [ ] 24px margins

**Desktop Frames (1440px):**
- [ ] All screens created
- [ ] 3+ column grid
- [ ] Sticky header/sidebar
- [ ] Content max 1280px
- [ ] 32px margins

**Verification:**
- [ ] Mobile at 375px ✅
- [ ] Desktop at 1440px ✅
- [ ] Layouts differ appropriately ✅
- [ ] Content reflows ✅

**Phase 4 Status:** ⬜ Not Started → ✅ Complete

---

## Phase 5: Visual Consistency (45 min)

### Step 5.1: Create Effect Styles

**Subtle:**
- [ ] Name: effect-subtle
- [ ] Shadow: 0,2,4 emerald 5%
- [ ] Applied to inputs

**Floating:**
- [ ] Name: effect-floating
- [ ] Shadow: 0,10,15,-3 black 10%
- [ ] Applied to modals

**Card:**
- [ ] Name: effect-card
- [ ] Shadow: 0,1,3 black 10%
- [ ] Applied to cards

**Pressed:**
- [ ] Name: effect-pressed
- [ ] Inner shadow: 0,2,4 black 10%
- [ ] Applied to active buttons

**Verification:**
- [ ] 4 effect styles created ✅
- [ ] Applied consistently ✅
- [ ] Buttons are flat (no shadow) ✅

**Phase 5 Status:** ⬜ Not Started → ✅ Complete

---

## Phase 6: Image Standards (30 min)

### Aspect Ratios
- [ ] Heroes: 16:9
- [ ] Cards: 4:3 or 1:1
- [ ] Avatars: 1:1

### Radius
- [ ] Images: radius/md
- [ ] Avatars: radius/full

### Text Overlays
- [ ] Gradients applied
- [ ] Contrast ≥ 4.5:1 (WCAG AA)

**Phase 6 Status:** ⬜ Not Started → ✅ Complete

---

## Phase 7: Naming & Organization (60 min)

### Step 7.1: Rename Layers (30 min)
- [ ] Components: Component_Variant_State
- [ ] Frames: PageName/SectionName
- [ ] No "Frame 1" or "Rectangle 2"

### Step 7.2: Organize File (30 min)

**Pages Created:**
- [ ] 📐 Implementation Guide
- [ ] 🎨 Design System
- [ ] 🧱 Base Components
- [ ] 📦 Complex Components
- [ ] 📱 Pages — Mobile
- [ ] 💻 Pages — Desktop
- [ ] 🖼️ Assets

**Components Organized:**
- [ ] Base → Base Components
- [ ] Complex → Complex Components
- [ ] Screens → By breakpoint
- [ ] Assets → By type

**Phase 7 Status:** ⬜ Not Started → ✅ Complete

---

## Phase 8: Prototyping (90 min)

### Interactive States (40 min)
- [ ] Button hover interactions
- [ ] Button click interactions
- [ ] Card hover (scale 1.02)
- [ ] Card selection
- [ ] Input focus

### Page Transitions (30 min)
- [ ] Main flow connected
- [ ] Transitions: Smart Animate, 300ms
- [ ] Modals: Scale + fade
- [ ] Bottom sheets: Slide up

### Animations (20 min)
- [ ] Typing indicator animates
- [ ] Loading spinner rotates
- [ ] Skeleton shimmer moves

**Phase 8 Status:** ⬜ Not Started → ✅ Complete

---

## Verification & Testing (60 min)

### Final Quality Check

**Variables (100%):**
- [ ] Zero hardcoded colors (except gradients)
- [ ] Zero hardcoded spacing
- [ ] Zero hardcoded radius
- [ ] 12 color variables
- [ ] 12 metric variables

**Typography (100%):**
- [ ] 6 text styles created
- [ ] All text uses styles
- [ ] Mobile vs Desktop correct

**Components (100%):**
- [ ] Button: 60 variants
- [ ] Card: 32 variants
- [ ] ChatMessage: 18 variants
- [ ] Input: 16 variants
- [ ] Total: 126 variants

**Responsive (100%):**
- [ ] Mobile frames: 375px
- [ ] Desktop frames: 1440px
- [ ] Layouts adapt
- [ ] Components adapt

**Visual (100%):**
- [ ] 4 effect styles
- [ ] Shadows consistent
- [ ] Buttons flat
- [ ] Images standardized

**Organization (100%):**
- [ ] 7 pages organized
- [ ] Components organized
- [ ] All layers named
- [ ] No orphans

**Prototyping (100%):**
- [ ] Interactive states work
- [ ] Transitions smooth
- [ ] Animations smooth

### Test Results

**Overall Score:** ___/100

✅ 95-100: Excellent  
🟡 85-94: Good  
🟠 75-84: Fair  
🔴 <75: Needs Work

---

## 🎉 Final Handoff

### Before Marking Complete

- [ ] All phases complete
- [ ] All verification tests passed
- [ ] Team review completed
- [ ] Developer walkthrough scheduled
- [ ] Library published
- [ ] Documentation updated

### Handoff Package

- [ ] Figma file link shared
- [ ] Library access granted
- [ ] Font list provided (Playfair Display, Inter)
- [ ] Design system rules documented
- [ ] Handoff meeting scheduled

---

## 📊 Time Tracking Summary

**Planned:** 795 min (13.25 hours)  
**Actual:** ___ min (___ hours)  
**Variance:** ___ min (___ hours)

**Efficiency:** ___%  
(Actual / Planned × 100)

**Notes:**
- Issues encountered: ___
- Solutions found: ___
- Lessons learned: ___

---

## ✅ Sign-Off

**Designer:** _______________  
**Date Completed:** _______________  
**Quality Score:** ___/100  
**Ready for Development:** ☐ Yes ☐ No

**Notes:** _______________

---

**Last Updated:** December 20, 2024  
**Version:** 1.1 (Corrected)  
**Status:** Ready for Execution
