# UI Screens Validation
## Complete Screen Inventory & Verification

**Status:** ✅ Validated  
**Last Updated:** December 18, 2025

---

## Screen Completeness Matrix

| Route | Purpose | Prompt Doc | States | Responsive | A11y | Status |
|-------|---------|------------|--------|------------|------|--------|
| `/` | Landing page | ⚠️ Missing | — | — | — | 🟡 Required |
| `/trip/new` | Create trip | ⚠️ Missing | — | — | — | 🟡 Required |
| `/trip/:tripId` | Trip dashboard | ✅ 02-phase-1.md | ✅ 4+ | ✅ Yes | ✅ Yes | 🟢 Complete |
| `/trip/:tripId/timeline` | Full timeline | ⚠️ Partial | Loading, Empty | ✅ Yes | ⚠️ Partial | 🟡 Needs work |
| `/trip/:tripId/dining` | Dining hub | ✅ 04-dining | ✅ 4 | ✅ Yes | ✅ WCAG AA | 🟢 Complete |
| `/trip/:tripId/dining/:id` | Restaurant detail | ✅ 04-dining | ✅ 4 | ✅ Yes | ✅ WCAG AA | 🟢 Complete |
| `/trip/:tripId/optimizer` | Optimizer | ✅ 05-optimizer | ✅ 4 | ✅ Yes | ✅ WCAG AA | 🟢 Complete |
| `/trip/:tripId/bookings` | Bookings hub | ✅ 06-booking | ✅ 5 | ✅ Yes | ✅ WCAG AA | 🟢 Complete |
| `/trip/:tripId/events` | Events hub | ✅ 07-events | ✅ 4 | ✅ Yes | ✅ WCAG AA | 🟢 Complete |
| `/trip/:tripId/events/:id` | Event detail | ✅ 07-events | ✅ Error | ✅ Yes | ✅ Yes | 🟢 Complete |
| `/trip/:tripId/insider` | Insider feed | ✅ 08-insider | ✅ 4 | ✅ Yes | ✅ Yes | 🟢 Complete |
| `/trip/:tripId/insider/:id` | Place detail | ✅ 08-insider | ✅ Yes | ✅ Yes | ✅ Yes | 🟢 Complete |
| `/trip/:tripId/budget` | Budget | ✅ 09-budget | ✅ 4 | ✅ Yes | ✅ Yes | 🟢 Complete |
| `/account` | User settings | ⚠️ Missing | — | — | — | 🟡 Required |
| `/account/payment` | Payment | ⚠️ Missing | — | — | — | 🟡 Required |

**Status Summary:**
- ✅ Complete: 10 screens
- 🟡 Missing: 5 screens
- Coverage: 67%

---

## Required Screens (Not Yet Specified)

### 1. Landing Page (`/`)

**Purpose:** First impression, explain value prop, convert visitors

**Required Sections:**
- Hero with search bar
- Value propositions (save time, AI-powered, authentic)
- How it works (3 steps)
- Social proof (testimonials, stats)
- CTA (Sign up / Create trip)

**States:** Loading, Error (API down)

**Next Action:** Create `/docs/features/prompts/landing-page.md`

---

### 2. Trip Creation Wizard (`/trip/new`)

**Purpose:** Onboard new users, collect trip details

**Required Steps:**
1. Where are you going? (city autocomplete)
2. When? (date range picker)
3. Who's traveling? (solo, couple, group)
4. Budget? (optional, can set later)
5. Interests? (3-5 tags: food, adventure, culture, nightlife)

**States:** Loading cities, validation errors, creation success

**Next Action:** Create `/docs/features/prompts/trip-wizard.md`

---

### 3. Timeline Full View (`/trip/:tripId/timeline`)

**Purpose:** See entire trip itinerary at a glance

**Required:**
- Day-by-day breakdown with times
- Drag-and-drop to reorder
- Add item inline
- View on map toggle
- Export to calendar

**Next Action:** Enhance specification in existing docs

---

### 4. Account Settings (`/account`)

**Purpose:** Manage profile, preferences, subscription

**Tabs:**
- Profile (name, email, phone, avatar)
- Preferences (dietary, interests, travel style)
- AI Settings (auto-optimize, auto-book toggles)
- Subscription (plan, billing, invoices)
- Security (password, 2FA, sessions)

**Next Action:** Create `/docs/features/prompts/account-settings.md`

---

### 5. Payment Methods (`/account/payment`)

**Purpose:** Manage cards for bookings

**Required:**
- List saved cards (last 4 digits, brand, expiry)
- Add new card (Stripe Elements)
- Set default card
- Remove card (with confirmation)
- Billing history

**Next Action:** Create `/docs/features/prompts/payment-methods.md`

---

## Validation Checklist

For each screen to be marked ✅ Complete:

- [ ] Multi-step Figma prompt written
- [ ] All states defined (loading, empty, error, success)
- [ ] Mobile, tablet, desktop layouts specified
- [ ] Accessibility requirements (WCAG AA)
- [ ] Touch targets min 44x44px
- [ ] Color contrast 4.5:1 minimum
- [ ] Keyboard navigation support
- [ ] Screen reader labels
- [ ] Error handling graceful
- [ ] Performance targets (<2s load)

---

## Cross-References

- Detailed prompts: `/docs/features/04-09-*.md`
- Design system: `/docs/features/02-phase-1.md` Task 1.1.1
- Component library: Design system doc
- Progress tracker: `/docs/features/00-progress-tracker.md`

**Next Steps:**
1. Create 5 missing screen prompt documents
2. Update progress tracker with completion status
3. Run accessibility audit on all screens once implemented
