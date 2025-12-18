# 🤝 Design → Code Contract & Data Contracts

> **Purpose**: Define strict interfaces between Figma (Visuals), Cursor (Logic/Code), Supabase (Data), and AI (Intelligence) to prevent "drift" during implementation.
> **Rule**: Figma defines LOOKS. Cursor defines LOGIC. Contracts define DATA.

---

## 1. 🎨 Figma ↔ Cursor Boundary Rules

| Responsibility | **Figma (Designer)** | **Cursor (Engineer)** |
| :--- | :--- | :--- |
| **Visuals** | Spacing, Typography, Colors, Shadows | Tailwind Classes, Theme Configuration |
| **Components** | States (Hover, Active, Disabled), Variants | React Props, Event Handlers, Animations |
| **Layout** | Responsive behavior (Mobile/Desktop views) | Flex/Grid implementation, Media Queries |
| **Content** | Editorial copy, Image selection | CMS integration, API data binding |
| **Logic** | **NONE** (Only visual representation of states) | State Management, Hooks, Routing, API Calls |

---

## 2. 🧩 Component Contracts (React Props)

These interfaces must be respected by both Design (visual representation) and Code (implementation).

### 2.1 `LuxuryCard` (Base for Events & Properties)
```typescript
interface LuxuryCardProps {
  id: string;
  title: string;
  image: string; // URL or local path
  badge?: {
    text: string;
    variant: 'emerald' | 'gold' | 'neutral';
  };
  subtitle: string; // Location or Date
  footerRight: React.ReactNode; // Price or Action
  footerLeft: React.ReactNode; // Stats or Tags
  onClick: () => void;
  onHover?: () => void; // Trigger "Quick View"
}
```

### 2.2 `EventCard` (Extends LuxuryCard)
```typescript
interface EventCardProps {
  event: {
    id: string;
    title: string;
    date: Date;
    location: string;
    category: 'Nightlife' | 'Culture' | 'Gastronomy';
    imageUrl: string;
    price: string; // "$$$" or "$20"
  };
  isSaved?: boolean;
  onToggleSave: (id: string) => void;
}
```

### 2.3 `PropertyCard` (Extends LuxuryCard)
```typescript
interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    location: string;
    price: number;
    currency: 'USD' | 'COP';
    specs: {
      beds: number;
      baths: number;
      sqft: number;
    };
    roi?: number; // Annual yield
    imageUrl: string;
    aiInsight?: string; // "High Appreciation Potential"
  };
}
```

---

## 3. 🤖 AI Data Contracts (Inputs & Outputs)

Strict schemas for the AI Concierge to ensure the UI knows what to render.

### 3.1 Intent Classification Schema
**Input**: User Message string.
**Output**:
```json
{
  "intent": "REAL_ESTATE" | "EVENTS" | "ITINERARY" | "GENERAL",
  "entities": {
    "location": "Poblado" | "Laureles" | null,
    "budget": number | null,
    "category": string | null
  },
  "requiresAuth": boolean
}
```

### 3.2 Visual Drawer Result Schema
**Context**: `REAL_ESTATE`
```json
{
  "type": "property_list",
  "summary": "Found 3 properties in Poblado under $400k.",
  "items": [
    {
      "id": "prop_123",
      "title": "Modern Loft",
      "price": 350000,
      "specs": { "beds": 2, "baths": 2, "sqft": 1200 },
      "matchScore": 0.95,
      "aiReason": "Matches your budget and location preference."
    }
  ]
}
```

**Context**: `EVENTS`
```json
{
  "type": "event_list",
  "summary": "Here are 2 jazz events happening tonight.",
  "items": [
    {
      "id": "evt_456",
      "title": "Rooftop Jazz",
      "date": "2023-10-27T20:00:00Z",
      "location": "El Poblado",
      "matchScore": 0.88
    }
  ]
}
```

---

## 4. 🗄️ Database Schema Contracts (Supabase)

### 4.1 `profiles`
*   `id` (uuid, PK)
*   `email` (text)
*   `full_name` (text)
*   `role` ('user', 'admin', 'agent')
*   `preferences` (jsonb): `{ "currency": "USD", "theme": "dark" }`

### 4.2 `properties`
*   `id` (uuid, PK)
*   `title` (text)
*   `description` (text)
*   `price` (numeric)
*   `location_area` (text)
*   `specs` (jsonb): `{ "beds": 3, "baths": 2, "sqft": 1500 }`
*   `features` (text[])
*   `images` (text[])
*   `roi_stats` (jsonb): `{ "shortTermYield": 0.12, "longTermAppreciation": 0.05 }`

### 4.3 `events`
*   `id` (uuid, PK)
*   `title` (text)
*   `start_time` (timestamptz)
*   `end_time` (timestamptz)
*   `venue_name` (text)
*   `category` (text)
*   `ticket_link` (text)
*   `booking_mode` ('external', 'internal')

---

## 5. 🎟️ Booking Modes & CTAs

Every CTA must map to one of these defined behaviors:

| Mode | Behavior | Used For |
| :--- | :--- | :--- |
| **`EXTERNAL_LINK`** | Opens new tab with `rel="noopener noreferrer"`. | Ticketmaster, Eventbrite |
| **`INTERNAL_FORM`** | Opens Modal/Drawer with form. Submits to Supabase `leads`. | Custom Tours, Concierge Requests |
| **`LEAD_CAPTURE`** | Opens "Contact Agent" Modal. Sends email/notification. | Real Estate Inquiries |
| **`DEEP_LINK`** | Navigates to app route (e.g., `/itinerary`). | "Add to Plan", "View Map" |

---

## 6. ⚠️ System States (Figma Checklist)

Designer must provide visual states for:

*   [ ] **Loading**: Skeleton screens (shimmer effect) matching the card layout.
*   [ ] **Empty**: "No properties found matching your filters." (with 'Clear Filters' CTA).
*   [ ] **Error**: "Connection lost." (with 'Retry' button).
*   [ ] **AI Thinking**: Visual indicator (pulsing dot/ring) while waiting for LLM.
*   [ ] **Auth Wall**: "Sign in to save this itinerary." (Glassmorphism overlay).
