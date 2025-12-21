# Advanced Animations

**Purpose:** Complex patterns for premium experiences  
**Prerequisites:** Read animations-core.md first

---

## 🌊 PARALLAX & SCROLL

### Multi-Layer Parallax

**Code:**
```typescript
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ['start end', 'end start']
});

// Different speeds for depth
const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]); // Fast
const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]); // Medium
const y3 = useTransform(scrollYProgress, [0, 1], [0, -50]);  // Slow

<div ref={ref}>
  <motion.div style={{ y: y1 }} className="foreground" />
  <motion.div style={{ y: y2 }} className="midground" />
  <motion.div style={{ y: y3 }} className="background" />
</div>
```

**Values:**
- Background: 30-50% speed
- Midground: 70-90% speed  
- Foreground: 110-150% speed
- Test performance on mobile

---

### Sticky Header with Transform

**Code:**
```typescript
const { scrollY } = useScroll();
const headerY = useTransform(scrollY, [0, 100], [0, -100]);
const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);

<motion.header
  style={{ y: headerY, opacity: headerOpacity }}
  className="sticky top-0"
/>
```

---

### Reading Progress Bar

**Code:**
```typescript
const { scrollYProgress } = useScroll();
const scaleX = useSpring(scrollYProgress, {
  stiffness: 100,
  damping: 30
});

<motion.div
  style={{ scaleX }}
  className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left"
/>
```

---

## 🔢 NUMBER & DATA

### Number Counter

**Code:**
```typescript
function Counter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    
    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Ease-out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * target));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
    >
      {count.toLocaleString()}
    </motion.div>
  );
}
```

**Values:**
- Duration: 1500-2500ms
- Easing: Ease-out (fast start, slow end)
- Format: Add commas, currency symbols

---

### Chart/Graph Animation

**Code:**
```typescript
// Bar chart
{data.map((value, i) => (
  <motion.div
    key={i}
    initial={{ height: 0 }}
    animate={{ height: `${value}%` }}
    transition={{
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1]
    }}
    className="bar"
  />
))}

// Line chart (SVG path)
<motion.path
  d={pathData}
  initial={{ pathLength: 0 }}
  animate={{ pathLength: 1 }}
  transition={{ duration: 1.5, ease: 'easeOut' }}
/>
```

---

## ✍️ TEXT EFFECTS

### Typewriter

**Code:**
```typescript
function Typewriter({ text, delay = 50 }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span>
      {displayText}
      <motion.span
        animate={{ opacity: showCursor ? 1 : 0 }}
        transition={{ duration: 0 }}
      >
        |
      </motion.span>
    </span>
  );
}
```

**Values:**
- Character delay: 30-80ms
- Cursor blink: 500ms
- Max length: ~100 characters

---

### Text Reveal (Word by Word)

**Code:**
```typescript
const words = text.split(' ');

<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: { transition: { staggerChildren: 0.08 } }
  }}
>
  {words.map((word, i) => (
    <motion.span
      key={i}
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
      }}
      className="inline-block mr-1"
    >
      {word}
    </motion.span>
  ))}
</motion.div>
```

---

## 🎭 COMPLEX TRANSITIONS

### Accordion with Height Animation

**Code:**
```typescript
<motion.div
  initial={false}
  animate={{ height: isOpen ? 'auto' : 0 }}
  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
  style={{ overflow: 'hidden' }}
>
  <div className="p-4">
    {content}
  </div>
</motion.div>

// Chevron rotation
<motion.div
  animate={{ rotate: isOpen ? 90 : 0 }}
  transition={{ duration: 0.2 }}
>
  <ChevronRight />
</motion.div>
```

**Issue:** `height: auto` can cause janky animation  
**Fix:** Use `max-height` or measure content

---

### Carousel with Gesture Support

**Code:**
```typescript
const [[page, direction], setPage] = useState([0, 0]);

const paginate = (newDirection) => {
  setPage([page + newDirection, newDirection]);
};

<motion.div
  key={page}
  custom={direction}
  variants={slideVariants}
  initial="enter"
  animate="center"
  exit="exit"
  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  dragElastic={1}
  onDragEnd={(e, { offset, velocity }) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeThreshold) {
      paginate(1);
    } else if (swipe > swipeThreshold) {
      paginate(-1);
    }
  }}
>
  {slides[page]}
</motion.div>

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};
```

---

### Page Transition

**Code:**
```typescript
// App.tsx
<AnimatePresence mode="wait">
  <Routes location={location} key={location.pathname}>
    <Route path="/" element={<PageTransition><Home /></PageTransition>} />
    {/* ... */}
  </Routes>
</AnimatePresence>

// PageTransition component
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

---

## 🎨 MORPHING & SHAPES

### Icon Morph (Menu → Close)

**Code:**
```typescript
<svg viewBox="0 0 24 24" className="w-6 h-6">
  <motion.path
    d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    animate={{ d: isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16" }}
    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
  />
</svg>
```

---

### Button Morph (Submit → Loading → Success)

**Code:**
```typescript
<motion.button
  animate={{
    width: state === 'loading' ? 48 : state === 'success' ? 56 : 120
  }}
  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
  className="relative overflow-hidden"
>
  <AnimatePresence mode="wait">
    {state === 'idle' && (
      <motion.span
        key="idle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        Submit
      </motion.span>
    )}
    {state === 'loading' && (
      <motion.div
        key="loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, rotate: 360 }}
        exit={{ opacity: 0 }}
        transition={{ rotate: { duration: 1, repeat: Infinity, ease: 'linear' } }}
      >
        <Loader className="w-4 h-4" />
      </motion.div>
    )}
    {state === 'success' && (
      <motion.div
        key="success"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500 }}
      >
        <Check className="w-5 h-5" />
      </motion.div>
    )}
  </AnimatePresence>
</motion.button>
```

---

## 🎯 INTERACTIVE EFFECTS

### Mouse Follow Effect

**Code:**
```typescript
const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
const springConfig = { damping: 25, stiffness: 150 };
const x = useSpring(0, springConfig);
const y = useSpring(0, springConfig);

useEffect(() => {
  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) / 10;
    const deltaY = (e.clientY - centerY) / 10;
    
    x.set(deltaX);
    y.set(deltaY);
  };
  
  window.addEventListener('mousemove', handleMouseMove);
  return () => window.removeEventListener('mousemove', handleMouseMove);
}, []);

<motion.div ref={ref} style={{ x, y }} />
```

---

### Magnetic Button

**Code:**
```typescript
function MagneticButton({ children }) {
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 300, damping: 20 });
  const y = useSpring(0, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distance = Math.sqrt(
      Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
    );
    
    if (distance < 100) {
      x.set((e.clientX - centerX) * 0.3);
      y.set((e.clientY - centerY) * 0.3);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.button>
  );
}
```

---

## 🎊 CELEBRATION EFFECTS

### Confetti

**Code:**
```typescript
function Confetti() {
  const [particles] = useState(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      rotation: Math.random() * 360,
      color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 4)]
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{
            x: `${p.x}%`,
            y: -20,
            rotate: p.rotation,
            opacity: 1
          }}
          animate={{
            y: '110vh',
            rotate: p.rotation + 360,
            opacity: 0
          }}
          transition={{
            duration: 2 + Math.random(),
            ease: 'linear'
          }}
          className="absolute w-2 h-2 rounded-sm"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}
```

---

### Ripple Effect

**Code:**
```typescript
function RippleButton({ children }) {
  const [ripples, setRipples] = useState([]);

  const addRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      x,
      y,
      id: Date.now()
    };
    
    setRipples([...ripples, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <button onClick={addRipple} className="relative overflow-hidden">
      {children}
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute rounded-full bg-white"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            marginLeft: -10,
            marginTop: -10
          }}
        />
      ))}
    </button>
  );
}
```

---

## 🎬 MULTI-STEP SEQUENCES

### Hero Entrance Sequence

**Code:**
```typescript
const sequence = async () => {
  await controls.start({ opacity: 1 }); // Logo
  await controls.start({ y: 0, opacity: 1 }); // Headline
  await new Promise(resolve => setTimeout(resolve, 300));
  await controls.start({ scale: 1, opacity: 1 }); // CTA
};

useEffect(() => {
  sequence();
}, []);

<div>
  <motion.div
    initial={{ opacity: 0 }}
    animate={controls}
    className="logo"
  />
  <motion.h1
    initial={{ y: 20, opacity: 0 }}
    animate={controls}
    transition={{ delay: 0.3 }}
  />
  <motion.button
    initial={{ scale: 0.8, opacity: 0 }}
    animate={controls}
    transition={{ delay: 0.8 }}
  />
</div>
```

---

### Orchestrated Card Grid

**Code:**
```typescript
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: {
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.12
      }
    }
  }}
  className="grid grid-cols-3 gap-6"
>
  {cards.map((card, i) => (
    <motion.div
      key={i}
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.9 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: 'spring',
            stiffness: 100,
            damping: 12
          }
        }
      }}
    />
  ))}
</motion.div>
```

---

## 🔧 PERFORMANCE OPTIMIZATION

### Virtual Scrolling with Animation

```typescript
// Only animate items in viewport
const visibleItems = items.slice(startIndex, endIndex);

<div ref={scrollRef} onScroll={handleScroll}>
  <div style={{ height: totalHeight }}>
    <div style={{ transform: `translateY(${offsetY}px)` }}>
      {visibleItems.map(item => (
        <AnimatedCard key={item.id} />
      ))}
    </div>
  </div>
</div>
```

---

### GPU Acceleration

```typescript
// Force GPU acceleration
<motion.div
  style={{
    transform: 'translateZ(0)', // or
    willChange: 'transform' // Use sparingly!
  }}
/>
```

---

### Debounced Scroll

```typescript
const throttledScroll = useMemo(
  () =>
    throttle(() => {
      // Expensive scroll logic
    }, 100),
  []
);

useEffect(() => {
  window.addEventListener('scroll', throttledScroll);
  return () => window.removeEventListener('scroll', throttledScroll);
}, []);
```

---

## ♿ ADVANCED ACCESSIBILITY

### Custom Reduced Motion Hook

```typescript
function useAccessibleAnimation(fullAnimation, reducedAnimation) {
  const shouldReduceMotion = useReducedMotion();
  
  return shouldReduceMotion ? reducedAnimation : fullAnimation;
}

// Usage
const animation = useAccessibleAnimation(
  { opacity: 0, y: 20, scale: 0.9 },
  { opacity: 0 } // Reduced: only fade
);
```

---

### Focus Trap in Modal

```typescript
useEffect(() => {
  if (!isOpen) return;
  
  const focusableElements = modalRef.current.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  const handleTab = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };
  
  modalRef.current.addEventListener('keydown', handleTab);
  firstElement.focus();
  
  return () => modalRef.current?.removeEventListener('keydown', handleTab);
}, [isOpen]);
```

---

## 📋 ADVANCED CHECKLIST

```
COMPLEX ANIMATIONS:
[ ] Tested on low-end devices
[ ] GPU acceleration where needed (sparingly)
[ ] Debounced/throttled scroll events
[ ] Virtual scrolling for long lists
[ ] Cleanup intervals/timers
[ ] Memory leak check (DevTools)
[ ] Reduced motion alternative
[ ] Focus management (modals, carousels)
[ ] ARIA live regions for dynamic content
[ ] Performance budget: <16ms per frame
```

---

**Back to basics:** `/docs/rules/animations-core.md`  
**Quick reference:** `/docs/rules/animations-index.md`
