# 🎨 Global Component Library Documentation

**Version:** 1.0  
**Last Updated:** December 20, 2024  
**Design System:** I Love Medellín AI Travel Platform

---

## 📚 Table of Contents

1. [Design Tokens](#design-tokens)
2. [Typography](#typography)
3. [Buttons](#buttons)
4. [Form Components](#form-components)
5. [Cards](#cards)
6. [Modals & Dialogs](#modals--dialogs)
7. [Navigation](#navigation)
8. [Layout Components](#layout-components)
9. [Feedback Components](#feedback-components)
10. [Data Display](#data-display)
11. [Custom Components](#custom-components)
12. [Usage Guidelines](#usage-guidelines)

---

## 🎨 Design Tokens

All design tokens are defined in `/styles/globals.css` and automatically applied through Tailwind CSS.

### Color Palette

#### Primary Colors
```css
--primary: #064E3B;           /* Emerald 900 - Main brand color */
--primary-foreground: #ffffff; /* White text on primary */
--secondary: #F0FDF4;          /* Emerald 50 - Light backgrounds */
--secondary-foreground: #064E3B; /* Dark text on secondary */
```

#### Accent Colors
```css
--accent: #FBBF24;            /* Amber 400 - Call-to-action, highlights */
--accent-foreground: #ffffff;  /* White text on accent */
```

#### Semantic Colors
```css
--destructive: #d4183d;       /* Red - Errors, delete actions */
--destructive-foreground: #ffffff;
--muted: #ececf0;             /* Light gray - Disabled states */
--muted-foreground: #717182;  /* Gray text */
```

#### Background Colors
```css
--background: #F7F7F5;        /* Off-white page background */
--foreground: oklch(0.145 0 0); /* Near-black text */
--card: #ffffff;              /* White cards */
--border: rgba(6, 78, 59, 0.1); /* Subtle emerald borders */
```

### Typography Scale

#### Font Families
- **Sans-serif (Body):** Inter (300, 400, 500, 600)
- **Serif (Headings):** Playfair Display (400, 500, 600, 700)

#### Font Sizes (Tailwind Classes)
```
text-xs:   12px / 0.75rem
text-sm:   14px / 0.875rem
text-base: 16px / 1rem (default)
text-lg:   18px / 1.125rem
text-xl:   20px / 1.25rem
text-2xl:  24px / 1.5rem
text-3xl:  30px / 1.875rem
text-4xl:  36px / 2.25rem
text-5xl:  48px / 3rem
text-6xl:  60px / 3.75rem
text-7xl:  72px / 4.5rem
```

#### Font Weights
- `font-light`: 300
- `font-normal`: 400
- `font-medium`: 500
- `font-semibold`: 600
- `font-bold`: 700

### Spacing Scale

```
gap-1:  4px
gap-2:  8px
gap-3:  12px
gap-4:  16px
gap-6:  24px
gap-8:  32px
gap-12: 48px
gap-16: 64px
gap-20: 80px
```

### Border Radius

```css
--radius: 1rem;              /* Default: 16px */

rounded-sm:   2px
rounded:      4px
rounded-md:   6px
rounded-lg:   8px
rounded-xl:   12px
rounded-2xl:  16px
rounded-3xl:  24px
rounded-full: 9999px
```

### Shadow Tokens

```css
shadow-sm:     0 1px 2px 0 rgb(0 0 0 / 0.05)
shadow:        0 1px 3px 0 rgb(0 0 0 / 0.1)
shadow-md:     0 4px 6px -1px rgb(0 0 0 / 0.1)
shadow-lg:     0 10px 15px -3px rgb(0 0 0 / 0.1)
shadow-xl:     0 20px 25px -5px rgb(0 0 0 / 0.1)
shadow-2xl:    0 25px 50px -12px rgb(0 0 0 / 0.25)
shadow-luxury: Custom luxury shadow for premium cards
```

---

## 📝 Typography

### Usage Examples

```tsx
// Headings (use serif font)
<h1 className="text-5xl font-serif font-bold text-slate-900">
  Main Page Heading
</h1>

<h2 className="text-4xl font-serif font-bold text-slate-900">
  Section Heading
</h2>

<h3 className="text-2xl font-serif font-semibold text-slate-900">
  Subsection Heading
</h3>

// Body text (sans-serif)
<p className="text-base text-slate-600 leading-relaxed">
  Regular paragraph text with comfortable line height.
</p>

// Small text
<span className="text-sm text-muted-foreground">
  Helper text or metadata
</span>

// Emphasis
<span className="text-lg font-semibold text-primary">
  Important information
</span>
```

### Typography Guidelines

- ✅ **DO** use `font-serif` for all headings (h1-h6)
- ✅ **DO** use sans-serif (default) for body text
- ✅ **DO** maintain consistent line-height with `leading-relaxed` or `leading-loose` for readability
- ❌ **DON'T** override font sizes unless specifically needed
- ❌ **DON'T** mix serif and sans-serif within the same text block

---

## 🔘 Buttons

**File:** `/components/ui/button.tsx`

### Component API

```tsx
import { Button } from '@/components/ui/button';

interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

### Variants

#### 1. Default (Primary)
**Use for:** Main call-to-action buttons

```tsx
<Button variant="default">
  Book Now
</Button>
```

**Styling:**
- Background: `bg-primary` (#064E3B emerald-900)
- Text: `text-primary-foreground` (white)
- Hover: `hover:bg-primary/90`
- Shadow: Yes
- Use case: Primary actions, form submissions

---

#### 2. Destructive
**Use for:** Delete, remove, cancel actions

```tsx
<Button variant="destructive">
  Delete Trip
</Button>
```

**Styling:**
- Background: `bg-destructive` (#d4183d red)
- Text: `text-white`
- Hover: `hover:bg-destructive/90`
- Focus ring: Red/destructive
- Use case: Dangerous actions that require user attention

---

#### 3. Outline
**Use for:** Secondary actions, form toggles

```tsx
<Button variant="outline">
  Learn More
</Button>
```

**Styling:**
- Background: `bg-background` (transparent/white)
- Border: `border` (subtle emerald)
- Text: `text-foreground`
- Hover: `hover:bg-accent` (light fill)
- Use case: Secondary CTAs, filter buttons

---

#### 4. Secondary
**Use for:** Tertiary actions, informational buttons

```tsx
<Button variant="secondary">
  View Details
</Button>
```

**Styling:**
- Background: `bg-secondary` (#F0FDF4 emerald-50)
- Text: `text-secondary-foreground` (#064E3B)
- Hover: `hover:bg-secondary/80`
- Use case: Less prominent actions

---

#### 5. Ghost
**Use for:** Navigation, icon buttons, minimal interaction

```tsx
<Button variant="ghost">
  Cancel
</Button>
```

**Styling:**
- Background: Transparent
- Text: Inherits color
- Hover: `hover:bg-accent` (subtle fill)
- Use case: Navigation items, toolbar buttons

---

#### 6. Link
**Use for:** Text links styled as buttons

```tsx
<Button variant="link" asChild>
  <a href="/pricing">View Pricing</a>
</Button>
```

**Styling:**
- Background: Transparent
- Text: `text-primary` with underline
- Hover: Underline on hover
- Use case: Inline links, breadcrumbs

---

### Sizes

```tsx
// Small (32px height)
<Button size="sm">Small</Button>

// Default (36px height)
<Button size="default">Default</Button>

// Large (40px height)
<Button size="lg">Large</Button>

// Icon only (36x36px)
<Button size="icon">
  <Search className="w-4 h-4" />
</Button>
```

### States

#### Disabled
```tsx
<Button disabled>
  Processing...
</Button>
```

#### Loading State (Custom)
```tsx
import { Loader2 } from 'lucide-react';

<Button disabled>
  <Loader2 className="w-4 h-4 animate-spin" />
  Loading...
</Button>
```

### Usage Examples

```tsx
// Primary CTA with icon
<Button size="lg" className="gap-2">
  <Calendar className="w-5 h-5" />
  Plan My Trip
</Button>

// Outline button as link
<Button variant="outline" asChild>
  <Link to="/explore">Explore Map</Link>
</Button>

// Icon button
<Button size="icon" variant="ghost">
  <Heart className="w-4 h-4" />
</Button>

// Full width button
<Button className="w-full">
  Subscribe
</Button>
```

### Best Practices

- ✅ **DO** use `variant="default"` for primary actions (limit 1-2 per screen)
- ✅ **DO** add loading states for async actions
- ✅ **DO** use `asChild` prop when wrapping links
- ✅ **DO** include icons with text for clarity
- ❌ **DON'T** use multiple default buttons in close proximity
- ❌ **DON'T** use destructive variant for non-dangerous actions
- ❌ **DON'T** make buttons too small (min 36px tap target)

---

## 📋 Form Components

### Input (Text, Email, Password, etc.)

**File:** `/components/ui/input.tsx`

```tsx
import { Input } from '@/components/ui/input';

// Basic text input
<Input 
  type="text" 
  placeholder="Enter your name"
/>

// Email input
<Input 
  type="email" 
  placeholder="email@example.com"
  required
/>

// Password input
<Input 
  type="password" 
  placeholder="••••••••"
  autoComplete="current-password"
/>

// With label
<div className="space-y-2">
  <Label htmlFor="email">Email Address</Label>
  <Input 
    id="email"
    type="email" 
    placeholder="you@example.com"
  />
</div>

// Error state
<Input 
  type="text"
  aria-invalid="true"
  className="border-destructive"
/>
```

**Styling:**
- Height: `h-9` (36px)
- Border: `border border-input`
- Border radius: `rounded-md`
- Focus: Emerald ring
- Padding: `px-3 py-1`

---

### Textarea

**File:** `/components/ui/textarea.tsx`

```tsx
import { Textarea } from '@/components/ui/textarea';

<Textarea 
  placeholder="Tell us about your trip..."
  rows={5}
  className="resize-none"
/>
```

**Styling:**
- Min height: 80px (5 rows)
- Same border/focus styles as Input
- Resizable by default (use `resize-none` to disable)

---

### Select (Dropdown)

**File:** `/components/ui/select.tsx`

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

<Select>
  <SelectTrigger className="w-[200px]">
    <SelectValue placeholder="Select a city" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="medellin">Medellín</SelectItem>
    <SelectItem value="bogota">Bogotá</SelectItem>
    <SelectItem value="cartagena">Cartagena</SelectItem>
  </SelectContent>
</Select>
```

---

### Checkbox

**File:** `/components/ui/checkbox.tsx`

```tsx
import { Checkbox } from '@/components/ui/checkbox';

<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">
    I accept the terms and conditions
  </Label>
</div>
```

**Styling:**
- Size: 16x16px
- Checked: Emerald background with white checkmark
- Border: `border-primary`

---

### Radio Group

**File:** `/components/ui/radio-group.tsx`

```tsx
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

<RadioGroup defaultValue="curator">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="explorer" id="explorer" />
    <Label htmlFor="explorer">Explorer (Free)</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="curator" id="curator" />
    <Label htmlFor="curator">Curator ($29/mo)</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="concierge" id="concierge" />
    <Label htmlFor="concierge">Concierge ($79/mo)</Label>
  </div>
</RadioGroup>
```

---

### Switch (Toggle)

**File:** `/components/ui/switch.tsx`

```tsx
import { Switch } from '@/components/ui/switch';

<div className="flex items-center gap-2">
  <Switch id="notifications" />
  <Label htmlFor="notifications">Enable notifications</Label>
</div>

// Controlled
const [enabled, setEnabled] = useState(false);

<Switch 
  checked={enabled} 
  onCheckedChange={setEnabled}
/>
```

**Styling:**
- Width: 44px
- Height: 24px
- Checked: `bg-emerald-600`
- Thumb: White circle (20x20px)

---

### Label

**File:** `/components/ui/label.tsx`

```tsx
import { Label } from '@/components/ui/label';

<Label htmlFor="email" className="font-medium">
  Email Address
</Label>
```

---

### Form Validation Pattern

```tsx
import { useForm } from 'react-hook-form@7.55.0';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register('name', { required: 'Name is required' })}
          aria-invalid={errors.name ? 'true' : 'false'}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
}
```

---

## 🃏 Cards

### Basic Card Component

**File:** `/components/ui/card.tsx`

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction
} from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Trip to Medellín</CardTitle>
    <CardDescription>5 days, 4 nights</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Explore the city of eternal spring...</p>
  </CardContent>
  <CardFooter>
    <Button>View Details</Button>
  </CardFooter>
</Card>
```

**Structure:**
- Border: `border`
- Border radius: `rounded-xl`
- Background: `bg-card` (white)
- Gap: `gap-6` between sections
- Padding: `p-6`

---

### LuxuryCard Component

**File:** `/components/ui/LuxuryCard.tsx`

Premium card with image, hover effects, and badges.

```tsx
import { LuxuryCard } from '@/components/ui/LuxuryCard';
import { Heart, MapPin, Calendar } from 'lucide-react';

<LuxuryCard
  image="https://images.unsplash.com/photo-..."
  title="Restaurant Name"
  subtitle="Colombian Cuisine"
  badge={{
    text: "Featured",
    variant: "emerald"
  }}
  metaPrimary={
    <span className="flex items-center gap-1">
      <MapPin className="w-4 h-4" />
      El Poblado
    </span>
  }
  metaSecondary={
    <span className="flex items-center gap-1">
      <Calendar className="w-4 h-4" />
      Open Now
    </span>
  }
  action={
    <button className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
      <Heart className="w-5 h-5" />
    </button>
  }
  onClick={() => navigate('/restaurants/123')}
/>
```

**Props:**
- `image`: Image URL
- `title`: Main heading
- `subtitle`: Supporting text
- `badge`: Optional badge with variant (emerald, gold, neutral)
- `metaPrimary`: Left metadata (price, location, etc.)
- `metaSecondary`: Right metadata (date, capacity, etc.)
- `action`: Top-right action button (save, share, etc.)
- `status`: 'active' | 'unavailable' | 'sold_out'
- `onClick`: Click handler

**Badge Variants:**
- `emerald`: Green background (featured, new)
- `gold`: Amber background (premium, VIP)
- `neutral`: White background (default)

**Status Overlay:**
- `unavailable`: Grayscale with "Unavailable" label
- `sold_out`: Grayscale with "Sold Out" label
- `active`: Normal (default)

---

### ExperienceCard Component

**File:** `/components/ui/ExperienceCard.tsx`

Specialized card for events and experiences.

```tsx
import { ExperienceCard } from '@/components/ui/ExperienceCard';

<ExperienceCard
  id="event-123"
  title="Tango Night"
  category="Nightlife"
  image="https://..."
  date="Dec 25, 2024"
  price="$45"
  location="El Poblado"
  onClick={() => navigate('/experiences/123')}
/>
```

---

### Card Grid Layouts

```tsx
// 3-column grid (responsive)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <LuxuryCard key={item.id} {...item} />
  ))}
</div>

// 4-column grid (dense)
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Cards */}
</div>

// With container
<div className="container mx-auto px-6 lg:px-12">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Cards */}
  </div>
</div>
```

---

## 🪟 Modals & Dialogs

### Dialog (Modal)

**File:** `/components/ui/dialog.tsx`

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Booking</DialogTitle>
      <DialogDescription>
        Are you sure you want to book this restaurant?
      </DialogDescription>
    </DialogHeader>
    
    <div className="py-4">
      {/* Modal content */}
      <p>Restaurant: La Deriva</p>
      <p>Date: Dec 25, 2024</p>
      <p>Time: 7:00 PM</p>
    </div>

    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Features:**
- Backdrop: Semi-transparent black (`bg-black/50`)
- Animation: Zoom in/out with fade
- Close button: Top-right X icon
- Keyboard: ESC to close
- Max width: `max-w-lg` (512px)

---

### Alert Dialog (Confirmation)

**File:** `/components/ui/alert-dialog.tsx`

For destructive or important confirmations.

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete Trip</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your trip.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

### Sheet (Drawer)

**File:** `/components/ui/sheet.tsx`

Slide-in panel from side or bottom.

```tsx
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open Filters</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Filter Options</SheetTitle>
      <SheetDescription>
        Refine your search results
      </SheetDescription>
    </SheetHeader>
    <div className="py-6">
      {/* Filter content */}
    </div>
  </SheetContent>
</Sheet>
```

**Sides:** `"top"` | `"right"` | `"bottom"` | `"left"`

---

### Popover

**File:** `/components/ui/popover.tsx`

Small floating content triggered by click.

```tsx
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

<Popover>
  <PopoverTrigger asChild>
    <Button variant="ghost" size="icon">
      <Info className="w-4 h-4" />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-80">
    <div className="space-y-2">
      <h4 className="font-medium">Pro Tip</h4>
      <p className="text-sm text-muted-foreground">
        Book early to get the best seats!
      </p>
    </div>
  </PopoverContent>
</Popover>
```

---

### Tooltip

**File:** `/components/ui/tooltip.tsx`

Small hint on hover.

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon">
        <HelpCircle className="w-4 h-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Click for more information</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

## 🧭 Navigation

### Navbar Component

**File:** `/components/layout/Navbar.tsx`

```tsx
import { Navbar } from '@/components/layout/Navbar';

// Usage in AppShell or layout
<Navbar variant="light" /> // Light text on dark bg
<Navbar variant="dark" />  // Dark text on light bg (default)
```

**Features:**
- Sticky positioning
- Scroll-triggered background blur
- Mobile hamburger menu
- Active link highlighting
- AI status indicator
- Settings button
- Search button
- "Plan My Trip" CTA

**Desktop Links:**
- Map Explorer
- Experiences
- Real Estate
- Concierge
- Pricing
- Dashboard

**Mobile:**
- Hamburger menu (AnimatePresence slide-in)
- Full-screen overlay
- Same links as desktop

---

### Navigation Menu (Dropdown)

**File:** `/components/ui/navigation-menu.tsx`

For complex multi-level navigation.

```tsx
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[400px] gap-3 p-4">
          <li>
            <NavigationMenuLink asChild>
              <a href="/map">Map Explorer</a>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <a href="/experiences">Experiences</a>
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

---

### Breadcrumb

**File:** `/components/ui/breadcrumb.tsx`

```tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/experiences">Experiences</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Tango Night</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

---

### Pagination

**File:** `/components/ui/pagination.tsx`

```tsx
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">3</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

---

### Tabs

**File:** `/components/ui/tabs.tsx`

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="reviews">Reviews</TabsTrigger>
    <TabsTrigger value="photos">Photos</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    <p>Overview content...</p>
  </TabsContent>
  <TabsContent value="reviews">
    <p>Reviews content...</p>
  </TabsContent>
  <TabsContent value="photos">
    <p>Photos content...</p>
  </TabsContent>
</Tabs>
```

---

## 🏗️ Layout Components

### Footer Component

**File:** `/components/layout/Footer.tsx`

```tsx
import { Footer } from '@/components/layout/Footer';

// Usage in AppShell
<Footer />
```

**Structure:**
- 4-column grid (responsive to 1 column on mobile)
- Brand column: Logo, tagline, social icons
- Discover column: Main navigation links
- Company column: Secondary links
- Newsletter column: Email signup form
- Bottom bar: Copyright, privacy links

**Colors:**
- Background: `bg-slate-900`
- Text: `text-slate-300`
- Headings: `text-amber-400`
- Links: Hover to white

---

### Container

**Standard container for content:**

```tsx
<div className="container mx-auto px-6 lg:px-12">
  {/* Content */}
</div>

// With max width
<div className="container mx-auto max-w-7xl px-6">
  {/* Content */}
</div>

// Narrow container
<div className="container mx-auto max-w-4xl px-6">
  {/* Content */}
</div>
```

**Breakpoints:**
- `container`: Responsive max-width per breakpoint
- `max-w-7xl`: 1280px
- `max-w-4xl`: 896px
- `px-6`: 24px horizontal padding
- `lg:px-12`: 48px on large screens

---

### Section Heading

**File:** `/components/ui/SectionHeading.tsx`

```tsx
import { SectionHeading } from '@/components/ui/SectionHeading';

<SectionHeading
  badge="Featured"
  title="Top Restaurants"
  subtitle="Handpicked by local experts"
  align="center"
/>
```

**Props:**
- `badge`: Optional badge text
- `title`: Main heading (h2)
- `subtitle`: Supporting text
- `align`: 'left' | 'center' (default: left)

---

### Grid Layouts

```tsx
// Responsive 3-column
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Items */}
</div>

// Auto-fit grid (variable columns)
<div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
  {/* Items */}
</div>

// Masonry-style (with library)
import Masonry from 'react-responsive-masonry';

<Masonry columnsCount={3} gutter="24px">
  {items.map(item => <Card key={item.id} {...item} />)}
</Masonry>
```

---

## 💬 Feedback Components

### Alert

**File:** `/components/ui/alert.tsx`

```tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

<Alert>
  <AlertCircle className="w-4 h-4" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    Your session will expire in 5 minutes.
  </AlertDescription>
</Alert>

// Destructive variant
<Alert variant="destructive">
  <AlertCircle className="w-4 h-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Unable to process your request.
  </AlertDescription>
</Alert>
```

**Variants:**
- `default`: Light gray background
- `destructive`: Red background

---

### Toast (Sonner)

**File:** `/components/ui/sonner.tsx`

```tsx
import { toast } from 'sonner@2.0.3';

// Success
toast.success('Trip saved successfully!');

// Error
toast.error('Failed to save trip');

// Info
toast('New message received');

// With action
toast('Event updated', {
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo')
  }
});

// Promise toast
toast.promise(
  fetch('/api/trips'),
  {
    loading: 'Loading...',
    success: 'Trip loaded!',
    error: 'Error loading trip'
  }
);
```

**Setup (in App.tsx):**
```tsx
import { Toaster } from 'sonner@2.0.3';

function App() {
  return (
    <>
      <Routes>...</Routes>
      <Toaster position="top-right" />
    </>
  );
}
```

---

### Progress Bar

**File:** `/components/ui/progress.tsx`

```tsx
import { Progress } from '@/components/ui/progress';

<Progress value={60} className="w-full" />

// With label
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span>Trip Planning</span>
    <span>60%</span>
  </div>
  <Progress value={60} />
</div>
```

---

### Skeleton Loader

**File:** `/components/ui/skeleton.tsx`

```tsx
import { Skeleton } from '@/components/ui/skeleton';

// Card skeleton
<div className="space-y-4">
  <Skeleton className="h-[200px] w-full rounded-xl" />
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
</div>

// Text skeleton
<div className="space-y-2">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-3/4" />
</div>
```

---

### Empty State

**File:** `/components/ui/EmptyState.tsx`

```tsx
import { EmptyState } from '@/components/ui/EmptyState';
import { Search } from 'lucide-react';

<EmptyState
  icon={<Search className="w-12 h-12" />}
  title="No results found"
  description="Try adjusting your search filters"
  action={
    <Button onClick={clearFilters}>
      Clear Filters
    </Button>
  }
/>
```

---

## 📊 Data Display

### Table

**File:** `/components/ui/table.tsx`

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Location</TableHead>
      <TableHead>Price</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Restaurant A</TableCell>
      <TableCell>El Poblado</TableCell>
      <TableCell>$$$</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

### Badge

**File:** `/components/ui/badge.tsx`

```tsx
import { Badge } from '@/components/ui/badge';

// Default (emerald)
<Badge>New</Badge>

// Secondary
<Badge variant="secondary">Featured</Badge>

// Destructive
<Badge variant="destructive">Sold Out</Badge>

// Outline
<Badge variant="outline">Draft</Badge>

// With icon
<Badge>
  <Star className="w-3 h-3" />
  Premium
</Badge>
```

---

### Avatar

**File:** `/components/ui/avatar.tsx`

```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

<Avatar>
  <AvatarImage src="https://i.pravatar.cc/100" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

// With different sizes
<Avatar className="w-8 h-8">...</Avatar>
<Avatar className="w-12 h-12">...</Avatar>
<Avatar className="w-16 h-16">...</Avatar>
```

---

### Accordion

**File:** `/components/ui/accordion.tsx`

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>What is included?</AccordionTrigger>
    <AccordionContent>
      All meals, accommodation, and guided tours.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Can I cancel?</AccordionTrigger>
    <AccordionContent>
      Yes, free cancellation up to 48 hours before.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

**Types:**
- `type="single"`: Only one open at a time
- `type="multiple"`: Multiple can be open

---

### Carousel

**File:** `/components/ui/carousel.tsx`

```tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

<Carousel className="w-full max-w-xs">
  <CarouselContent>
    {images.map((image, index) => (
      <CarouselItem key={index}>
        <img src={image} alt={`Slide ${index + 1}`} />
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

---

### Separator

**File:** `/components/ui/separator.tsx`

```tsx
import { Separator } from '@/components/ui/separator';

// Horizontal (default)
<Separator />

// Vertical
<Separator orientation="vertical" className="h-12" />

// With margin
<Separator className="my-6" />
```

---

## 🎨 Custom Components

### GlassButton

**File:** `/components/ui/GlassButton.tsx`

Glassmorphism button with backdrop blur.

```tsx
import { GlassButton } from '@/components/ui/GlassButton';

<GlassButton onClick={handleClick}>
  Explore
</GlassButton>
```

**Styling:**
- Background: `bg-white/20`
- Backdrop blur: `backdrop-blur-md`
- Border: White/30
- Text: White
- Hover: Lift and glow

---

### ImageWithFallback

**File:** `/components/figma/ImageWithFallback.tsx`

Image component with automatic fallback.

```tsx
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

<ImageWithFallback
  src="https://..."
  alt="Restaurant"
  className="w-full h-64 object-cover rounded-xl"
/>
```

**Features:**
- Automatic fallback to placeholder on error
- Lazy loading
- Object-fit support

---

## 📋 Usage Guidelines

### Component Selection Matrix

| Use Case | Component | Variant |
|----------|-----------|---------|
| Primary CTA | Button | default |
| Secondary action | Button | outline |
| Delete action | Button | destructive |
| Text input | Input | - |
| Long text | Textarea | - |
| Yes/No choice | Switch | - |
| Multi-choice | Checkbox | - |
| Single choice | Radio Group | - |
| Dropdown selection | Select | - |
| Info card | Card | - |
| Premium card | LuxuryCard | - |
| Confirmation | Alert Dialog | - |
| Form modal | Dialog | - |
| Side panel | Sheet | - |
| Quick info | Tooltip | - |
| Success message | Toast | success |
| Error message | Toast | error |
| No data | EmptyState | - |
| Loading | Skeleton | - |

---

### Accessibility Checklist

- ✅ **Labels:** All form inputs have associated labels
- ✅ **Focus states:** Visible focus rings on interactive elements
- ✅ **ARIA labels:** Icons have `aria-label` or `sr-only` text
- ✅ **Keyboard nav:** All interactive elements are keyboard accessible
- ✅ **Color contrast:** Text meets WCAG AA standards (4.5:1)
- ✅ **Screen readers:** Semantic HTML and ARIA attributes
- ✅ **Error messages:** `aria-invalid` on error states

---

### Performance Best Practices

1. **Lazy load images:**
   ```tsx
   <img loading="lazy" src="..." alt="..." />
   ```

2. **Code splitting:**
   ```tsx
   const HeavyComponent = lazy(() => import('./HeavyComponent'));
   ```

3. **Memoize expensive components:**
   ```tsx
   const MemoizedCard = React.memo(LuxuryCard);
   ```

4. **Virtualize long lists:**
   ```tsx
   import { FixedSizeList } from 'react-window';
   ```

5. **Optimize animations:**
   - Use `transform` and `opacity` for animations
   - Prefer CSS over JS animations
   - Use `will-change` sparingly

---

### Responsive Design Patterns

#### Breakpoints
```css
sm:  640px   /* Mobile landscape */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large desktop */
2xl: 1536px  /* Extra large */
```

#### Stack on Mobile
```tsx
<div className="flex flex-col md:flex-row gap-4">
  <div>Column 1</div>
  <div>Column 2</div>
</div>
```

#### Hide on Mobile
```tsx
<div className="hidden md:block">
  Desktop only content
</div>
```

#### Show on Mobile Only
```tsx
<div className="md:hidden">
  Mobile only content
</div>
```

#### Responsive Text
```tsx
<h1 className="text-3xl md:text-5xl lg:text-7xl">
  Responsive Heading
</h1>
```

#### Responsive Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>
```

---

### Component Composition Examples

#### Form with Validation
```tsx
<Card>
  <CardHeader>
    <CardTitle>Contact Us</CardTitle>
    <CardDescription>We'll get back to you within 24 hours</CardDescription>
  </CardHeader>
  <CardContent>
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="John Doe" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="john@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={5} placeholder="Your message..." />
      </div>
    </form>
  </CardContent>
  <CardFooter className="justify-end gap-2">
    <Button variant="outline">Cancel</Button>
    <Button>Send Message</Button>
  </CardFooter>
</Card>
```

#### Search with Filters
```tsx
<div className="space-y-4">
  <div className="flex gap-2">
    <Input placeholder="Search restaurants..." className="flex-1" />
    <Button variant="outline">
      <Search className="w-4 h-4" />
    </Button>
  </div>
  
  <div className="flex gap-2">
    <Select>
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="Cuisine" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="colombian">Colombian</SelectItem>
        <SelectItem value="italian">Italian</SelectItem>
        <SelectItem value="asian">Asian</SelectItem>
      </SelectContent>
    </Select>
    
    <Select>
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="Price" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="low">$</SelectItem>
        <SelectItem value="medium">$$</SelectItem>
        <SelectItem value="high">$$$</SelectItem>
      </SelectContent>
    </Select>
    
    <Button variant="outline" onClick={clearFilters}>
      Clear
    </Button>
  </div>
</div>
```

---

## 🎯 Quick Reference

### Most Common Components

```tsx
// Button
<Button>Click Me</Button>

// Input
<Input placeholder="Enter text" />

// Card
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Dialog
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
  </DialogContent>
</Dialog>

// Toast
toast.success('Success!');

// Badge
<Badge>New</Badge>

// Select
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
  </SelectContent>
</Select>
```

---

## 📦 Component Library Summary

**Total Components:** 50+

**Categories:**
- **Buttons:** 1 component, 6 variants
- **Forms:** 7 components (Input, Textarea, Select, Checkbox, Radio, Switch, Label)
- **Cards:** 3 components (Card, LuxuryCard, ExperienceCard)
- **Modals:** 5 components (Dialog, AlertDialog, Sheet, Popover, Tooltip)
- **Navigation:** 4 components (Navbar, Footer, Tabs, Breadcrumb)
- **Feedback:** 5 components (Alert, Toast, Progress, Skeleton, EmptyState)
- **Data Display:** 6 components (Table, Badge, Avatar, Accordion, Carousel, Separator)
- **Layout:** Container, SectionHeading, Grid utilities

**Design System:**
- Colors: 12 semantic tokens + emerald/slate scale
- Typography: 2 font families, 11 sizes, 5 weights
- Spacing: 8px base unit
- Radius: 1rem default
- Shadows: 6 levels + custom luxury shadow

---

## 🔗 Related Documentation

- [Style Guide](/style-guide) - Full design system
- [Architecture](/architecture) - Technical architecture
- [Component Source](/components/ui) - View source code
- [Figma Designs](link-to-figma) - Design files

---

**Maintained by:** Design System Team  
**Last Review:** December 20, 2024  
**Next Review:** March 2025  
**Status:** ✅ Production Ready
