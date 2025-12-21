# Core Animations Library

**Purpose:** Production-ready animation patterns for daily use  
**Coverage:** 90% of UI animation needs

---

## 🎯 MICRO-INTERACTIONS

### Hover Lift

**Code:**
```typescript
<motion.div
  whileHover={{ y: -4, scale: 1.02 }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
  className="shadow-lg hover:shadow-xl"
/>
```

**Values:**
- Duration: 200ms
- Lift: -2 to -8px
- Scale: 1.01-1.05
- Shadow: upgrade one level

**Use:** Buttons, cards, interactive elements

---

### Click/Press Feedback

**Code:**
```typescript
<motion.button
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.1 }}
/>
```

**Values:**
- Duration: 100ms (fast)
- Scale: 0.95-0.98
- Use: All clickable elements

---

### Focus Ring

**Code:**
```typescript
<motion.input
  whileFocus={{
    boxShadow: '0 0 0 2px #3b82f6',
    scale: 1.01
  }}
  transition={{ duration: 0.15 }}
/>
```

**Values:**
- Duration: 150ms
- Ring: 2px, brand color
- Required: Accessibility

---

### Toggle Switch

**Code:**
```typescript
<motion.div
  animate={{ x: isOn ? 20 : 0 }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
  className="toggle-handle"
/>
```

**Values:**
- Duration: 200-250ms
- Movement: Handle width distance
- Background: Color transition

---

## 🎬 ENTRANCE ANIMATIONS

### Fade In

**Code:**
```typescript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
/>
```

**Values:**
- Duration: 300-600ms
- Easing: Ease-out
- Use: General content reveal

---

### Slide In (from bottom)

**Code:**
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
/>
```

**Variants:**
```typescript
// From left
initial={{ opacity: 0, x: -40 }}
animate={{ opacity: 1, x: 0 }}

// From right
initial={{ opacity: 0, x: 40 }}
animate={{ opacity: 1, x: 0 }}

// From top
initial={{ opacity: 0, y: -20 }}
animate={{ opacity: 1, y: 0 }}
```

**Values:**
- Duration: 400-600ms
- Offset: 20-40px
- Always combine with opacity

---

### Scale In

**Code:**
```typescript
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
/>
```

**With Bounce:**
```typescript
transition={{
  type: 'spring',
  stiffness: 300,
  damping: 20
}}
```

**Values:**
- Duration: 300-500ms
- Start scale: 0.8-0.95
- Use: Icons, badges, small elements

---

### Stagger Children

**Code:**
```typescript
<motion.div
  initial="hidden"
  animate="visible"
  variants={containerVariants}
>
  {items.map((item, i) => (
    <motion.div key={i} variants={itemVariants}>
      {item}
    </motion.div>
  ))}
</motion.div>

// Variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};
```

**Values:**
- Stagger delay: 80-150ms
- Max items: 10-12 (longer feels slow)
- Use: Card grids, feature lists

---

## 📜 SCROLL EFFECTS

### Scroll Reveal (IntersectionObserver)

**Code:**
```typescript
const ref = useRef(null);
const isInView = useInView(ref, {
  once: true,
  margin: '-100px'
});

<motion.div
  ref={ref}
  initial={{ opacity: 0, y: 50 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
/>
```

**Values:**
- Margin: -50px to -100px (trigger before visible)
- Once: true (don't repeat)
- Duration: 500-700ms

---

### Scroll Progress

**Code:**
```typescript
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ['start end', 'end start']
});

<motion.div style={{ opacity: scrollYProgress }} />
```

**Common transforms:**
```typescript
// Fade based on scroll
const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

// Parallax
const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

// Scale
const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
```

---

## 🔄 TRANSITIONS

### Modal Open/Close

**Code:**
```typescript
<AnimatePresence>
  {isOpen && (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black"
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="modal"
      >
        {children}
      </motion.div>
    </>
  )}
</AnimatePresence>
```

**Values:**
- Open: 300-400ms
- Close: 250-300ms (faster)
- Backdrop: 200ms

---

### Tab Switching

**Code:**
```typescript
<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -10 }}
    transition={{ duration: 0.25 }}
  >
    {tabContent[activeTab]}
  </motion.div>
</AnimatePresence>

// Tab indicator
<motion.div
  className="absolute bottom-0 h-0.5 bg-blue-600"
  animate={{ x: tabOffsets[activeTab] }}
  transition={{ duration: 0.25, ease: 'easeOut' }}
/>
```

**Values:**
- Content fade: 200-300ms
- Indicator slide: 250ms
- Mode: 'wait' (old exits before new enters)

---

## 💬 FEEDBACK ANIMATIONS

### Loading Spinner

**Code:**
```typescript
<motion.div
  animate={{ rotate: 360 }}
  transition={{
    duration: 1,
    repeat: Infinity,
    ease: 'linear'
  }}
  className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"
/>
```

**Values:**
- Duration: 1000ms per rotation
- Easing: linear
- Size: 16-32px

---

### Progress Bar

**Code:**
```typescript
<motion.div
  initial={{ width: 0 }}
  animate={{ width: `${progress}%` }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
  className="h-2 bg-blue-600 rounded-full"
/>
```

**Values:**
- Duration: 300ms (update smoothness)
- Height: 2-8px
- Update on progress change

---

### Toast Notification

**Code:**
```typescript
<AnimatePresence>
  {toasts.map(toast => (
    <motion.div
      key={toast.id}
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="toast"
    >
      {toast.message}
    </motion.div>
  ))}
</AnimatePresence>
```

**Auto-dismiss:**
```typescript
useEffect(() => {
  const timer = setTimeout(() => removeToast(toast.id), 5000);
  return () => clearTimeout(timer);
}, []);
```

**Values:**
- Enter: 300ms
- Exit: 250ms
- Hold: 3000-5000ms
- Position: top-right or bottom-right

---

## ✅ FORM FEEDBACK

### Validation - Error Shake

**Code:**
```typescript
const shakeVariants = {
  shake: {
    x: [0, -10, 10, -8, 8, -4, 4, 0],
    transition: { duration: 0.4 }
  }
};

<motion.input
  variants={shakeVariants}
  animate={hasError ? 'shake' : ''}
  className={hasError ? 'border-red-500' : 'border-gray-300'}
/>
```

**Values:**
- Duration: 400ms
- Movement: ±10px max
- Border: Red on error

---

### Validation - Success Checkmark

**Code:**
```typescript
<AnimatePresence>
  {isValid && (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 15
      }}
      className="checkmark"
    >
      <CheckCircle2 className="text-green-600" />
    </motion.div>
  )}
</AnimatePresence>
```

**Values:**
- Spring animation for "pop"
- Icon: 16-24px
- Color: Green (#10b981)

---

### Submit Button States

**Code:**
```typescript
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  animate={{
    opacity: isLoading ? 0.7 : 1
  }}
  disabled={isLoading}
>
  {isLoading ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2"
    >
      <Spinner />
      <span>Submitting...</span>
    </motion.div>
  ) : isSuccess ? (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring' }}
    >
      <CheckCircle2 /> Success!
    </motion.div>
  ) : (
    'Submit'
  )}
</motion.button>
```

**States:**
1. Default → Hover/tap animations
2. Loading → Spinner + disabled
3. Success → Checkmark (2s) → Default
4. Error → Shake + message

---

## 🎨 LAYOUT ANIMATIONS

### AnimatePresence (List)

**Code:**
```typescript
<AnimatePresence>
  {items.map(item => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      {item.content}
    </motion.div>
  ))}
</AnimatePresence>
```

**Use:** Todo lists, search results, dynamic content

---

### Layout Animation (Reorder)

**Code:**
```typescript
<motion.div layout transition={{ duration: 0.3, ease: 'easeOut' }}>
  {content}
</motion.div>
```

**Use:** Grid reordering, filter/sort animations

---

## ⚡ PERFORMANCE TIPS

```
DO:
✓ Animate opacity and transform only
✓ Use will-change sparingly
✓ Reduce motion on mobile (shorter duration)
✓ Stagger max 10-12 items
✓ Use AnimatePresence for exit animations
✓ Test on real devices

DON'T:
✗ Animate width, height, margin, padding
✗ Nest too many animated components
✗ Run 20+ animations simultaneously
✗ Forget exit animations
✗ Skip reduced motion check
```

---

## ♿ ACCESSIBILITY

**Reduced Motion:**
```typescript
import { useReducedMotion } from 'motion/react';

function Component() {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.01 : 0.5 }}
    />
  );
}
```

**Focus Management:**
```typescript
<motion.button
  whileFocus={{
    outline: '2px solid #3b82f6',
    outlineOffset: '2px'
  }}
  transition={{ duration: 0.15 }}
/>
```

---

## 📋 QUICK CHECKLIST

```
BEFORE SHIPPING:
[ ] Animation has clear purpose
[ ] Duration 200-600ms (not slower)
[ ] Only animates opacity/transform
[ ] Respects prefers-reduced-motion
[ ] Focus states visible
[ ] Tested on mobile device
[ ] No jank (60fps)
[ ] Exit animations included
```

---

**For advanced patterns, see:** `/docs/rules/animations-advanced.md`
