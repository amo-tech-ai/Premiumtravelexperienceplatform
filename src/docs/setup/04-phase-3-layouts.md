# PHASE 3: LAYOUTS & NAVIGATION
## 3-Panel Layout + Sidebar Navigation + Layout Routes

**Document:** 04-phase-3-layouts.md  
**Phase:** 3 of 11  
**Duration:** 60-90 minutes  
**Prerequisites:** Phase 2 complete with all routes rendering  
**Status:** Ready to Execute

---

## PHASE OBJECTIVE

Create professional layout components including the signature 3-panel structure (left sidebar, main content, right AI panel) for authenticated app, marketing layout for public pages, and wizard layout for multi-step flows.

---

## SUCCESS CRITERIA

- MarketingLayout with header and footer created
- AppLayout with 3-panel structure created
- WizardLayout with step indicator created
- Sidebar navigation with route links created
- Layouts wired to appropriate route groups
- Mobile responsive navigation working
- AI panel toggles open/closed
- Active route highlighting in sidebar

---

## STEP-BY-STEP INSTRUCTIONS

### Step 1: Install Required UI Dependencies

**Action:** Add Tailwind CSS and shadcn/ui foundation  

**Install Tailwind:**  
Run npm install -D tailwindcss postcss autoprefixer. Run npx tailwindcss init -p to generate config files. This creates tailwind.config.js and postcss.config.js.  

**Configure Tailwind:**  
Update tailwind.config.js content array to include ./index.html and ./src/**/*.{js,ts,jsx,tsx}. This ensures Tailwind scans all source files for classes.  

**Verification:** Config files created, content paths configured

### Step 2: Set Up Tailwind Base Styles

**Action:** Configure Tailwind directives and design tokens  

**File - src/styles/globals.css:**  
Add Tailwind directives: @tailwind base, @tailwind components, @tailwind utilities. Add CSS custom properties for design tokens (colors, spacing, shadows). Define primary, secondary, accent, neutral color variables. Define typography scale and font families.  

**Import in Entry:**  
Import globals.css at top of src/main.tsx. This loads Tailwind and custom tokens globally.  

**Verification:** Tailwind utilities work in components, custom CSS variables accessible

### Step 3: Install shadcn/ui Components

**Action:** Initialize shadcn/ui component library  

**Run Init Command:**  
Execute npx shadcn-ui@latest init. Answer prompts: TypeScript yes, style default or customize, base color slate or neutral, CSS variables yes, components location src/components/ui.  

**What This Creates:**  
Creates components.json config. Creates lib/utils.ts with cn helper. Creates ui folder in components directory.  

**Verification:** components.json exists, lib/utils.ts has cn function

### Step 4: Add Core UI Components

**Action:** Install essential shadcn components for layouts  

**Components to Install:**  
Run npx shadcn-ui@latest add button. Run npx shadcn-ui@latest add card. Run npx shadcn-ui@latest add separator. Run npx shadcn-ui@latest add sheet (for mobile menu). Run npx shadcn-ui@latest add avatar (for user menu).  

**Verification:** Each component appears in src/components/ui/ folder

### Step 5: Install Lucide Icons

**Action:** Add icon library for navigation and UI  

**Installation:**  
Run npm install lucide-react. This provides tree-shakeable icon components.  

**Usage Pattern:**  
Import specific icons like import { Home, Calendar, MapPin } from lucide-react. Use as React components with className and size props.  

**Verification:** Package in package.json, icons importable

### Step 6: Create Marketing Layout Component

**Action:** Build layout for public marketing pages  

**File - src/app/layouts/MarketingLayout.tsx:**  
Export default component accepting children prop. Render structure with Header component at top. Render main element with children in center. Render Footer component at bottom. Use semantic HTML (header, main, footer tags).  

**Styling:**  
Apply min-height full viewport to main element. Use flex column layout to push footer to bottom. Add max-width container for content area.  

**Verification:** Layout component created with proper structure

### Step 7: Create Header Component

**Action:** Build header for marketing layout  

**File - src/components/shared/Header.tsx:**  
Export default component rendering top navigation bar. Include logo/brand name on left. Include navigation links in center (Home, How It Works, Pricing, About). Include auth buttons on right (Login, Sign Up). Use NavLink from react-router-dom for active states.  

**Responsive Behavior:**  
Show full nav on desktop. Hide nav links on mobile, show hamburger menu icon. Use Sheet component for mobile menu drawer.  

**Verification:** Header renders with logo, links, and auth buttons

### Step 8: Create Footer Component

**Action:** Build footer for marketing layout  

**File - src/components/shared/Footer.tsx:**  
Export default component with footer content. Include three columns: Company (About, Contact), Product (How It Works, Pricing), Legal (Privacy, Terms). Include social media icons. Include copyright text with current year.  

**Styling:**  
Dark background with light text. Responsive grid: 3 columns on desktop, 1 column on mobile. Links use muted color, hover to primary.  

**Verification:** Footer renders with links and responsive grid

### Step 9: Create App Layout Component

**Action:** Build 3-panel layout for authenticated app  

**File - src/app/layouts/AppLayout.tsx:**  
Export default component with three-section structure. Left section for Sidebar component (fixed width, always visible on desktop). Middle section for main content with Outlet from react-router-dom. Right section for AIPanel component (collapsible, toggleable).  

**Layout Structure:**  
Use CSS Grid with three columns: sidebar (280px), main (1fr flexible), ai-panel (400px when open, 0px when closed). Make sidebar fixed position. Make main and ai-panel scrollable independently.  

**State Management:**  
Add state for AI panel open/closed using useState. Provide toggle function via context or prop to child components. Persist state to localStorage.  

**Verification:** Layout renders with three distinct panels

### Step 10: Create Sidebar Component

**Action:** Build left navigation sidebar  

**File - src/components/shared/Sidebar.tsx:**  
Export default component with vertical navigation. Include app logo at top. Include navigation items with icons and labels. Include user profile section at bottom. Use NavLink for each nav item to enable active states.  

**Navigation Items:**  
Dashboard (Home icon). My Trips (Map icon). Events (Calendar icon). Restaurants (Utensils icon). Rentals (Car icon). Saved (Bookmark icon). Chat (MessageSquare icon). Settings (Settings icon).  

**Active State Styling:**  
Active link shows primary background color. Active link shows bolder text. Add left border indicator for active item.  

**Verification:** Sidebar renders with all navigation links and icons

### Step 11: Create AI Panel Component

**Action:** Build collapsible right panel for AI assistant  

**File - src/components/ai/AIPanel.tsx:**  
Export default component accepting isOpen and onToggle props. Render panel with header showing "AI Assistant" title. Include toggle button to collapse panel. Include placeholder for chat interface (will populate in AI phase). Show "Powered by Gemini" attribution.  

**Collapse Behavior:**  
When closed, only show thin bar with expand button. When open, show full 400px width panel. Animate width transition smoothly. Panel fixed to right side of viewport.  

**Verification:** Panel toggles open/closed, animation smooth

### Step 12: Wire Marketing Layout to Routes

**Action:** Apply marketing layout to public routes  

**File - src/routes/marketing.ts:**  
Import MarketingLayout component. Create parent route object with path empty string. Set element to MarketingLayout. Move all marketing route objects into children array. Children use relative paths (remove leading slash for nested routes).  

**Nested Structure:**  
Parent route renders layout. Children render into layout's Outlet. This creates layout persistence across marketing pages.  

**Verification:** Navigate between marketing pages shows persistent header/footer

### Step 13: Wire App Layout to Routes

**Action:** Apply 3-panel layout to authenticated routes  

**File - src/routes/app.ts:**  
Import AppLayout component. Set parent /app route element to AppLayout. Ensure all app child routes nested inside. Children will render into AppLayout's main content Outlet.  

**Additional Config:**  
App routes should eventually check auth in loader. For now, layout renders without auth check (will add in Phase 5).  

**Verification:** Navigate to /app routes shows 3-panel layout with sidebar and AI panel

### Step 14: Create Wizard Layout Component

**Action:** Build layout for multi-step wizard flows  

**File - src/app/layouts/WizardLayout.tsx:**  
Export default component rendering wizard shell. Include step indicator at top showing current step and total steps. Include progress bar showing percentage complete. Include main content area with Outlet. Include prev/next navigation buttons at bottom.  

**Step Indicator:**  
Accept currentStep and totalSteps as props or derive from route. Show step labels (Basics, Preferences, Activities, Dining, Review). Highlight current step, show checkmarks for completed steps.  

**Verification:** Wizard layout renders with step indicator

### Step 15: Wire Wizard Layout to Trip Wizard Routes

**Action:** Apply wizard layout to wizard route group  

**File - src/routes/trips.ts:**  
Locate trip wizard route object (/app/trips/:tripId/wizard). Set element to WizardLayout. Nest wizard step routes as children. Each step route renders into wizard's Outlet.  

**Step Configuration:**  
Pass step metadata to layout via route handle or context. Layout knows current step from URL.  

**Verification:** Navigate to wizard routes shows step indicator and navigation

### Step 16: Add Mobile Responsive Navigation

**Action:** Make sidebar responsive for mobile screens  

**File - src/components/shared/Sidebar.tsx:**  
Add responsive behavior using Tailwind breakpoints. On mobile (< 768px), hide sidebar by default. Show hamburger menu button in header. Use Sheet component to show sidebar as drawer on mobile.  

**Mobile Menu Button:**  
Add button to Header component on mobile. Button toggles sidebar sheet. Sheet slides in from left with backdrop overlay.  

**Verification:** Resize browser to mobile width shows hamburger, sidebar becomes drawer

### Step 17: Add User Profile Menu

**Action:** Create user menu in sidebar footer  

**File - src/components/shared/UserMenu.tsx:**  
Export component showing user avatar and name. On click, show dropdown menu with options. Include Settings link. Include Billing link. Include Logout action. Use Avatar component from shadcn/ui.  

**Menu Options:**  
Profile (navigate to /app/settings). Billing (navigate to /app/billing). Logout (will implement in Phase 5). Use DropdownMenu component from shadcn for menu.  

**Integration:**  
Add UserMenu to bottom of Sidebar component.  

**Verification:** User menu renders, dropdown opens on click

### Step 18: Add AI Panel Toggle Button

**Action:** Create button to toggle AI panel visibility  

**File - src/components/shared/AIToggleButton.tsx:**  
Export button component triggering AI panel toggle. Show in app header or toolbar area. Use icon indicating panel state (ChevronLeft when open, ChevronRight when closed).  

**Placement:**  
Add to AppLayout toolbar or header area. Position near right side so close to panel. Fixed position or sticky to stay visible during scroll.  

**Verification:** Button toggles AI panel open/closed, icon updates

### Step 19: Add Active Route Highlighting

**Action:** Enhance NavLink styling to show active routes  

**File - src/components/shared/Sidebar.tsx:**  
Update NavLink components to use className function prop. Function receives isActive boolean. When active, apply primary background, bold text, left border. When inactive, apply muted text, no background.  

**Visual Indicators:**  
Active item has colored background. Active item has colored icon. Active item has left border accent. Inactive items dim on hover.  

**Verification:** Click navigation items highlights active route, previous item unhighlights

### Step 20: Test All Layouts

**Action:** Verify layouts render correctly and responsively  

**Testing Process:**  
Navigate to marketing pages, verify header/footer present. Navigate to app pages, verify 3-panel layout. Navigate to wizard, verify step indicator. Resize browser to mobile width, test hamburger menu. Toggle AI panel, verify animation. Click all sidebar links, verify active states.  

**Verification:** All layouts work, responsive behavior functions, no console errors

---

## VALIDATION CHECKLIST

### Dependencies & Configuration

- [ ] Tailwind CSS installed
- [ ] tailwind.config.js created and configured
- [ ] globals.css has Tailwind directives
- [ ] globals.css imported in main.tsx
- [ ] shadcn/ui initialized
- [ ] components.json exists
- [ ] lib/utils.ts has cn function
- [ ] lucide-react installed

### UI Components

- [ ] Button component in components/ui/
- [ ] Card component in components/ui/
- [ ] Separator component in components/ui/
- [ ] Sheet component in components/ui/
- [ ] Avatar component in components/ui/

### Layout Components

- [ ] MarketingLayout created in app/layouts/
- [ ] AppLayout created in app/layouts/
- [ ] WizardLayout created in app/layouts/
- [ ] All layouts use Outlet for nested routes

### Shared Components

- [ ] Header component created
- [ ] Footer component created
- [ ] Sidebar component created
- [ ] AIPanel component created
- [ ] UserMenu component created
- [ ] AIToggleButton component created
- [ ] All components use Tailwind for styling

### Route Integration

- [ ] Marketing layout wired to marketing routes
- [ ] App layout wired to app routes
- [ ] Wizard layout wired to wizard routes
- [ ] Nested routes render into parent Outlet

### Navigation

- [ ] Sidebar has all navigation links
- [ ] NavLink components used for routing
- [ ] Active route highlights correctly
- [ ] Icons display next to nav labels
- [ ] Links navigate to correct routes

### Responsive Behavior

- [ ] Header responsive (hamburger on mobile)
- [ ] Sidebar becomes drawer on mobile
- [ ] Footer stacks columns on mobile
- [ ] 3-panel layout adapts to mobile (single column)
- [ ] AI panel hides on mobile or becomes modal

### Functionality Tests

- [ ] Navigate between marketing pages maintains header/footer
- [ ] Navigate between app pages maintains sidebar
- [ ] Sidebar links navigate correctly
- [ ] Active link highlights update on navigation
- [ ] AI panel toggles open/closed
- [ ] AI panel toggle button updates icon
- [ ] Mobile hamburger opens sidebar drawer
- [ ] User menu dropdown works
- [ ] Wizard step indicator shows current step
- [ ] No layout shift during navigation

---

## TROUBLESHOOTING

### Issue: Tailwind Classes Not Applying

**Symptom:** Elements with Tailwind classes have no styling  
**Cause:** Tailwind not configured or globals.css not imported  
**Solution:** Verify tailwind.config.js content paths include all source files. Ensure globals.css imported at top of main.tsx. Check postcss.config.js exists. Restart dev server.

### Issue: Layouts Not Rendering

**Symptom:** Nested routes show blank screen  
**Cause:** Layout missing Outlet component  
**Solution:** Ensure each layout component renders Outlet from react-router-dom. Outlet is where child routes render. Without it, children have no outlet.

### Issue: Active Route Not Highlighting

**Symptom:** Sidebar links don't highlight when active  
**Cause:** NavLink className not using function pattern  
**Solution:** Change className from string to function receiving { isActive }. Return different classes based on isActive boolean.

### Issue: AI Panel Not Toggling

**Symptom:** Toggle button doesn't collapse panel  
**Cause:** State not properly wired  
**Solution:** Ensure useState for panel state exists in AppLayout. Toggle function passed to button. Panel component receives isOpen prop. CSS transitions configured.

### Issue: Mobile Menu Not Working

**Symptom:** Hamburger button doesn't open sidebar  
**Cause:** Sheet component not wired correctly  
**Solution:** Verify Sheet component from shadcn installed. Ensure Sheet open state managed. Trigger prop connects to hamburger button. Side prop set to "left".

---

## NEXT PHASE PREVIEW

**Phase 4:** Build out marketing pages with real content (hero sections, feature grids, pricing tables, contact forms). Install motion library for animations. Apply luxury design aesthetic.

**What You'll Need:** This phase complete with layouts working. Understanding of component composition. Design assets (images, illustrations).

**Estimated Time:** 90-120 minutes

---

**Phase Status:** ✅ Ready to Execute  
**Last Updated:** December 24, 2024  
**Dependencies:** Phase 2 (routing)  
**Blocks:** Phase 4 (marketing pages need layouts)
