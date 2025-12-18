# 12-figma-screens-prompts.md — AI-Driven Figma Design Prompts

## 🔹 Executive Summary
This document provides **multi-step, detailed design prompts** to generate the complete UI/UX for the "Luxury AI Concierge" platform in Figma.
These prompts are optimized for AI design tools (like Figma AI, Midjourney for ref, or human designers) to create a **"Luxury Editorial"** aesthetic using **Emerald, Gold, and Off-white** tones.

**Core Flow:** Mode Selection → Mini-Wizard → AI Chat → Tabs → Map → Booking.

---

## 🎨 Global Design System Prompts
*Use these settings for all screens.*

> **Prompt:**
> "Design a luxury mobile and desktop web interface for a Medellín concierge service. Aesthetic: 'Tropical Brutalism' meets 'High-End Editorial'.
> **Color Palette:** Deep Emerald Green (#064E3B), Champagne Gold (#D4AF37), Cream/Off-White (#F7F7F5).
> **Typography:** 'Playfair Display' for elegant headings, 'Inter' for clean utility text.
> **Vibe:** Trustworthy, sophisticated, intelligent, calm. Use ample whitespace and high-quality photography."

---

## 1️⃣ Entry & Mode Selection

### Screen 1: Home / Entry Screen
**Goal:** Elegant entry point that sells the "AI Concierge" value.
> **Figma Prompt:**
> "Design a responsive Home Page.
> **Hero Section:** Full-screen high-end lifestyle photo of Medellín (rooftop or jungle view) with a dark overlay. Center text: 'Experience Medellín, effortlessly.'
> **Primary CTA:** A prominent, glowing button 'Ask Concierge'.
> **Secondary Section:** 'Explore by Category' with 4 large, visual cards: Restaurants, Events, Stays, Tourist.
> **Footer:** Minimalist links.
> **Style:** Premium, inviting, clean."

### Screen 2: Mode Selection Screen
**Goal:** Quick user intent declaration.
> **Figma Prompt:**
> "Design a 'Mode Selection' modal or interstitial screen.
> **Layout:** A 2x2 grid of interactive cards.
> **Cards:**
> 1. 🍽 Restaurants (Icon: Fork/Knife)
> 2. 🎟 Events (Icon: Ticket)
> 3. 🏠 Stays (Icon: Bed)
> 4. 🧭 Tourist (Icon: Compass)
> **Interaction:** Cards should look tappable with hover states (subtle scale up + gold border).
> **Header:** 'What are you looking for today?'
> **Background:** Blurred glass effect over the home screen."

---

## 2️⃣ Mini-Wizard Screens (The Setup)

### Screen 3: Mini-Wizard – Location
**Goal:** Establish geography without typing.
> **Figma Prompt:**
> "Design a 'Location Picker' step for a wizard.
> **Question:** 'Where should we focus?'
> **UI Elements:** Large, selectable 'Chips' or tiles for popular neighborhoods: 'Laureles', 'Poblado', 'Envigado', 'Anywhere'.
> **Map Option:** A subtle link or icon for 'Select on Map'.
> **Navigation:** 'Back' arrow (top left) and disabled 'Next' button (bottom right) that becomes active upon selection."

### Screen 4: Mini-Wizard – Preferences
**Goal:** Mode-specific filtering (Example: Events).
> **Figma Prompt:**
> "Design a 'Preferences' wizard step for Events.
> **Question:** 'What’s the vibe?'
> **Input Type:** Multi-select choice tags. Options: 'Live Music', 'Sports', 'Cultural', 'Nightlife', 'Family Friendly'.
> **Secondary Question:** 'When?' with options 'Tonight', 'This Weekend', 'Pick Dates'.
> **Visuals:** Clean, touch-friendly targets. Minimal text. Gold accent color for selected states."

---

## 3️⃣ AI Chatbot Screens (The Spine)

### Screen 5: AI Concierge – Chat Interface
**Goal:** The main hub. Chat streams mixed with rich UI.
> **Figma Prompt:**
> "Design a split-screen AI Chat Interface (Desktop) and full-screen Chat (Mobile).
> **Layout:**
> - **Left/Bottom:** Chat input field with 'Ask anything...' placeholder.
> - **Center:** Message thread. User messages (Right aligned, Gold/Cream bubble). AI messages (Left aligned, White/Emerald bubble).
> **AI States:** Show a 'Thinking...' animation (pulsing dots).
> **Confidence:** Design a 'Confidence Indicator' pill next to AI responses: Green Check ('Verified'), Yellow Warning ('Best Guess').
> **Style:** Conversational, airy, readable."

### Screen 6: Follow-Up Question Card
**Goal:** Structured data collection within chat.
> **Figma Prompt:**
> "Design a 'Follow-Up Question' component embedded in the chat stream.
> **Context:** AI asking for budget clarification.
> **Component:** A card with the question 'What is your budget per person?' and 3 quick-tap buttons: '$ (<50k)', '$$ (50-150k)', '$$$ (150k+)'.
> **Action:** 'Skip' text link below buttons.
> **Visual:** Distinct from normal chat bubbles—perhaps a thin gold border or slightly different background shade."

---

## 4️⃣ Tabs & Results Screens

### Screen 7: Navigation Tabs
**Goal:** Switching context without losing chat.
> **Figma Prompt:**
> "Design a 'Floating Tab Bar' to sit above the results area.
> **Tabs:** Icons + Text: Events, Restaurants, Rentals, Tourist, Map.
> **Active State:** Bold icon, gold underline, or filled pill shape.
> **Inactive State:** Grey/Opacity 60%.
> **Animation:** Show a subtle transition indicator between tabs."

### Screen 8: Results List
**Goal:** Browse AI recommendations.
> **Figma Prompt:**
> "Design a 'Results List' view.
> **Components:** Vertical stack of 'Result Cards'.
> **Card Content:**
> - **Image:** High-quality thumbnail (Left or Top).
> - **Info:** Title ('El Cielo Restaurant'), Rating (4.8 stars), Distance ('0.5 km'), Tags ('Fine Dining').
> - **Action:** Small 'Book' or 'View' button.
> **Context:** 'Based on your request' header.
> **Responsive:** Grid on Desktop, List on Mobile."

### Screen 9: Map View
**Goal:** Spatial context.
> **Figma Prompt:**
> "Design a 'Map View' interface.
> **Map Style:** Custom map skin—muted colors, emerald water, gold roads (Google Maps JSON style).
> **Pins:** Custom markers.
> - **Restaurant:** Fork icon pin.
> - **Event:** Ticket icon pin.
> - **Selected Pin:** Larger, gold color, shows a tooltip card.
> **Floating CTA:** 'Search this area' button at the top center.
> **Mobile:** Map takes full screen with a bottom sheet drawer for the list."

---

## 5️⃣ Detail & Booking Screens

### Screen 10: Detail View
**Goal:** Final persuasion before booking.
> **Figma Prompt:**
> "Design a 'Detail Page' for a Restaurant.
> **Header:** Large hero image slideshow.
> **Content:** Title, Description, Address (with mini-map), Hours, Amenities icons (WiFi, AC).
> **Sticky Footer:** 'Reserve Table' button (Primary) and 'Save' heart icon (Secondary).
> **Trust:** 'Verified by Concierge' badge."

### Screen 11: Booking Choice Modal
**Goal:** Route user to the right booking method.
> **Figma Prompt:**
> "Design a 'Booking Options' bottom sheet.
> **Title:** 'How would you like to book?'
> **Option A:** 'Instant Book via Official Site' (External Link icon).
> **Option B:** 'Request Concierge Reservation' (Premium service icon).
> **Visual:** Clean list of large, clickable rows.
> **Note:** 'Concierge requests may take 30 mins to confirm'."

### Screen 12: Internal Booking Form
**Goal:** Capture lead/reservation.
> **Figma Prompt:**
> "Design a simple 'Concierge Request Form'.
> **Fields:** Name, WhatsApp Number, Party Size, Time Preference.
> **Style:** Minimalist inputs with floating labels.
> **Submit:** 'Send Request' button.
> **Progress:** Simple step indicator if multi-page."

### Screen 13: Success / Confirmation
**Goal:** Reassurance and next steps.
> **Figma Prompt:**
> "Design a 'Success State' screen.
> **Icon:** Large, animated Gold Checkmark.
> **Text:** 'Request Sent! We’ll notify you on WhatsApp shortly.'
> **Cross-Sell:** 'While you wait, check out these nearby bars:' (Horizontal scroll list).
> **Actions:** 'Back to Chat', 'View Itinerary'."

---

## 6️⃣ Saved & Itinerary Screens

### Screen 14: Saved Items
**Goal:** Bookmarking.
> **Figma Prompt:**
> "Design a 'Saved Items' library screen.
> **Organization:** Tabs for 'All', 'To Book', 'Booked'.
> **List Items:** Compact cards with image, title, and action menu (three dots: Remove, Move to Itinerary).
> **Empty State:** 'Your shortlist is empty. Ask the Concierge to find gems.'"

### Screen 15: Itinerary Builder
**Goal:** Trip visualization.
> **Figma Prompt:**
> "Design a 'Trip Itinerary' timeline view.
> **Visual:** Vertical line connecting time slots (9:00 AM, 1:00 PM, 7:00 PM).
> **Items:** Cards attached to time slots.
> **Interactions:** Drag handles to reorder items.
> **Header:** Date picker or 'Day 1', 'Day 2' tabs."

---

## 7️⃣ Admin & Ops (Internal)

### Screen 16: Admin Dashboard
**Goal:** High-level system health.
> **Figma Prompt:**
> "Design an 'Admin Dashboard' for internal ops.
> **Widgets:**
> - 'Live AI Requests' (scrolling log).
> - 'Booking Conversion Rate' (Line chart).
> - 'Top Intents' (Pie chart: Restaurants vs Events).
> **Style:** Dense, data-heavy, dark mode option."

---

## 8️⃣ Special AI Components (The Secret Sauce)

### Component: "Near This Event" Highlight
**Goal:** Visual cross-selling.
> **Figma Prompt:**
> "Design a 'Cross-Sell Notification' banner.
> **Placement:** Appears inside the Restaurant tab when an Event is selected.
> **Text:** 'Showing dining options within 5 min walk of [Event Name].'
> **Visual:** Distinct background color (light emerald) with a link icon."

### Component: Confidence Note
**Goal:** Transparency.
> **Figma Prompt:**
> "Design a set of 'Confidence Badges'.
> 1. **Verified:** Green shield icon, text 'Verified by Team'.
> 2. **AI Generated:** Sparkle icon, text 'AI Suggestion'.
> 3. **Unverified:** Gray circle, text 'Unverified Info'.
> **Style:** Small, pill-shaped tags used on cards."

### Component: Watchlist/Alert UI
**Goal:** FOMO / Availability tracking.
> **Figma Prompt:**
> "Design a 'Set Alert' toggle.
> **Context:** Sold out event.
> **UI:** Bell icon switch.
> **Text:** 'Notify me if tickets become available.'
> **Active State:** Gold bell, toggle ON."
