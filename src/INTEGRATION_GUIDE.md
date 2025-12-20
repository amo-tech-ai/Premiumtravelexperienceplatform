# 🔧 Integration Guide - Advanced AI Features

**How to integrate the new AI features into your existing app**

---

## 📋 Quick Start (5 Minutes)

### Step 1: Add the Demo Page to Your Router

```typescript
// In App.tsx
import AdvancedAIDemo from './components/ai/AdvancedAIDemo';

// Add route
<Route path="/ai-demo" element={<AdvancedAIDemo />} />
```

**That's it!** Visit `/ai-demo` to see all features working.

---

## 🚀 Production Integration (30 Minutes)

### Integration Option 1: Add to Existing Trip Planning Page

**File:** `/pages/TripDetailsPage.tsx` or `/components/trip-details/luxury/LuxuryItineraryFeed.tsx`

```typescript
// 1. Import the hook
import { useAdvancedAI } from '../hooks/useAdvancedAI';

// 2. Add to your component
export const LuxuryItineraryFeed = () => {
  const {
    suggestions,
    dismissSuggestion,
    sendMessage,
    askComplex,
    isProcessing,
  } = useAdvancedAI({
    enableProactive: true,
    enableContext: true,
    enableCollaboration: true,
    tripId: currentTripId, // Pass your actual trip ID
  });

  // 3. Render suggestions panel (add anywhere in your layout)
  return (
    <div>
      {/* Your existing itinerary UI */}
      <YourItineraryComponent />

      {/* NEW: AI Suggestions Panel */}
      {suggestions.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md space-y-2">
          {suggestions.map((suggestion) => (
            <AIBannerCard
              key={suggestion.id}
              suggestion={suggestion}
              onDismiss={() => dismissSuggestion(suggestion.id)}
              onApply={() => handleApplySuggestion(suggestion)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// 4. Create a simple banner component
const AIBannerCard = ({ suggestion, onDismiss, onApply }) => (
  <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-emerald-200 animate-in slide-in-from-bottom">
    <div className="flex items-start gap-3">
      <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
      <div className="flex-1">
        <h4 className="font-semibold text-slate-900">{suggestion.title}</h4>
        <p className="text-sm text-slate-600 mt-1">{suggestion.message}</p>
        <div className="flex gap-2 mt-3">
          {suggestion.actions?.map((action, idx) => (
            <Button
              key={idx}
              size="sm"
              variant={action.action === 'apply' ? 'default' : 'outline'}
              onClick={() => action.action === 'apply' ? onApply() : onDismiss()}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
      <button onClick={onDismiss} className="shrink-0">
        <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
      </button>
    </div>
  </div>
);
```

---

### Integration Option 2: Add AI Chat Button

**Add a floating chat button that opens AI assistant:**

```typescript
// In your main layout or trip page
import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { useAdvancedAI } from '../hooks/useAdvancedAI';

export const AIAssistantButton = () => {
  const [open, setOpen] = useState(false);
  const {
    sendMessage,
    conversationHistory,
    isProcessing,
  } = useAdvancedAI({
    enableContext: true,
    enableCollaboration: true,
  });

  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput('');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>AI Travel Assistant</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-full mt-6">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {conversationHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.role === 'user'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isProcessing}
                className="rounded-full"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
```

---

### Integration Option 3: Add to Navigation Menu

**Add AI features to your sidebar or top navigation:**

```typescript
// In your navigation component
import { Sparkles } from 'lucide-react';
import { Badge } from './ui/badge';
import { useAdvancedAI } from '../hooks/useAdvancedAI';

export const Navigation = () => {
  const { suggestions } = useAdvancedAI({ enableProactive: true });

  return (
    <nav>
      {/* Your existing nav items */}
      <a href="/trips">My Trips</a>
      <a href="/explore">Explore</a>

      {/* NEW: AI Suggestions with badge */}
      <a href="/ai-suggestions" className="relative">
        <Sparkles className="w-5 h-5" />
        AI Suggestions
        {suggestions.length > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">
            {suggestions.length}
          </Badge>
        )}
      </a>
    </nav>
  );
};
```

---

## 🎯 Specific Use Cases

### Use Case 1: Budget Monitoring

**Auto-alert when budget is approaching limit:**

```typescript
// In your trip context or budget component
import { useAdvancedAI } from '../hooks/useAdvancedAI';
import { useEffect } from 'react';
import { getEventBus } from '../lib/ai/event-bus';

export const BudgetTracker = ({ budget, spent }) => {
  const { suggestions } = useAdvancedAI({ enableProactive: true });

  // Emit budget update events
  useEffect(() => {
    const bus = getEventBus();
    bus.emit('budget:updated', { budget, spent });
  }, [budget, spent]);

  // Filter for budget alerts
  const budgetAlerts = suggestions.filter(s => s.type === 'budget_alert');

  return (
    <div>
      {/* Your budget UI */}
      <BudgetDisplay budget={budget} spent={spent} />

      {/* AI Budget Alerts */}
      {budgetAlerts.map(alert => (
        <Alert key={alert.id} variant="warning">
          {alert.message}
        </Alert>
      ))}
    </div>
  );
};
```

---

### Use Case 2: Schedule Conflict Detection

**Auto-detect and resolve overlapping events:**

```typescript
// In your itinerary component
import { useAdvancedAI } from '../hooks/useAdvancedAI';
import { useEffect } from 'react';
import { getEventBus } from '../lib/ai/event-bus';

export const DaySchedule = ({ day, items }) => {
  const { suggestions, dismissSuggestion } = useAdvancedAI({ 
    enableProactive: true 
  });

  // Emit itinerary changes
  useEffect(() => {
    const bus = getEventBus();
    bus.emit('itinerary:changed', {
      days: [day],
      action: 'updated',
    });
  }, [items]);

  // Filter for conflict warnings
  const conflicts = suggestions.filter(s => s.type === 'warning');

  return (
    <div>
      {/* Show conflicts at top */}
      {conflicts.length > 0 && (
        <div className="mb-4 space-y-2">
          {conflicts.map(conflict => (
            <ConflictAlert
              key={conflict.id}
              conflict={conflict}
              onResolve={() => {
                // Your conflict resolution logic
                dismissSuggestion(conflict.id);
              }}
            />
          ))}
        </div>
      )}

      {/* Your schedule UI */}
      <ScheduleItems items={items} />
    </div>
  );
};
```

---

### Use Case 3: Smart Recommendations

**Show complementary activities when user adds a place:**

```typescript
// In your "Add to Trip" handler
import { getEventBus } from '../lib/ai/event-bus';

const handleAddPlace = (place) => {
  // Add place to trip
  addItemToDay(dayIndex, {
    title: place.name,
    type: place.type,
    // ...
  });

  // Emit event for AI to detect patterns
  const bus = getEventBus();
  bus.emit('user:action', {
    action: place.type === 'food' ? 'add_restaurant' : 'add_activity',
    context: {
      location: place.location,
      neighborhood: place.neighborhood,
      category: place.type,
    },
  });

  // AI will automatically suggest complementary activities!
};
```

---

### Use Case 4: Complex Trip Planning

**Add an "AI Trip Builder" button:**

```typescript
// In your trip creation page
import { useAdvancedAI } from '../hooks/useAdvancedAI';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';

export const TripCreationPage = () => {
  const { askComplex, isProcessing } = useAdvancedAI({
    enableCollaboration: true,
  });

  const handleAIBuilder = async () => {
    const result = await askComplex(
      `Plan a 3-day trip to Medellín for 2 people with interests in food, culture, and nightlife. Budget: $1500 total.`
    );

    // Result contains full trip plan from multiple agents
    console.log(result.synthesizedResponse);
    
    // Apply to your trip
    applyAIGeneratedPlan(result);
  };

  return (
    <div>
      <h2>Create Your Trip</h2>
      
      <Button
        onClick={handleAIBuilder}
        disabled={isProcessing}
        className="bg-gradient-to-r from-emerald-600 to-blue-600"
      >
        <Sparkles className="w-5 h-5 mr-2" />
        {isProcessing ? 'AI Planning Your Trip...' : 'Let AI Build My Trip'}
      </Button>

      {/* Your manual trip creation UI */}
    </div>
  );
};
```

---

## 🎨 UI Component Library

### Pre-built Components You Can Use:

1. **AdvancedAIDemo** (`/components/ai/AdvancedAIDemo.tsx`)
   - Full-featured demo with 3 tabs
   - Copy and customize as needed

2. **SuggestionCard** (from demo)
   - Reusable suggestion display
   - Built-in action buttons

3. **ChatInterface** (from demo)
   - Complete chat UI
   - Context-aware messaging

4. **AIStatusIndicator** (`/components/ai/AIStatusIndicator.tsx`)
   - Shows AI connection status
   - API key configuration

---

## 🔧 Configuration

### Enable/Disable Features Globally

```typescript
// Create a config file
// /config/ai-config.ts

export const AI_CONFIG = {
  proactiveSuggestions: true,  // Set to false to disable
  contextAwareChat: true,
  multiAgentCollaboration: true,
  
  // Feature flags
  features: {
    budgetAlerts: true,
    conflictDetection: true,
    complementaryRecommendations: true,
    routeOptimization: true,
  },
  
  // Thresholds
  thresholds: {
    budgetWarning: 0.8,  // 80%
    budgetCritical: 0.95, // 95%
    maxItemsPerDay: 6,
    maxEntityMemory: 50,
  },
};

// Use in hook
const ai = useAdvancedAI({
  enableProactive: AI_CONFIG.proactiveSuggestions,
  // ...
});
```

---

## 📊 Monitoring & Analytics

### Track AI Usage

```typescript
// Add analytics tracking
import { useAdvancedAI } from '../hooks/useAdvancedAI';
import { trackEvent } from '../lib/analytics';

const MyComponent = () => {
  const { sendMessage, askComplex } = useAdvancedAI({
    enableContext: true,
    enableCollaboration: true,
  });

  const handleMessage = async (msg) => {
    trackEvent('ai_chat_message_sent', { messageLength: msg.length });
    const result = await sendMessage(msg);
    trackEvent('ai_chat_response_received', {
      referencesResolved: result.references.length,
    });
  };

  const handleComplexQuery = async (query) => {
    trackEvent('ai_complex_query_started');
    const result = await askComplex(query);
    trackEvent('ai_complex_query_completed', {
      agentsUsed: result.metadata.agentsUsed,
      duration: result.metadata.totalDuration,
      success: result.success,
    });
  };

  // ...
};
```

---

## 🐛 Debugging

### Enable Debug Mode

```typescript
// In your browser console or app initialization
localStorage.setItem('eventbus_debug', 'true');

// Now you'll see all event bus activity in console:
// [EventBus] Emitting itinerary:changed: {...}
// [EventBus] Handler executed for itinerary:changed
// [ProactiveAssistant] Detected pattern: travel_time
// [CollaborationEngine] Created plan with 3 tasks
```

### View Active Suggestions

```typescript
// In browser console
import { getProactiveAssistant } from './lib/ai/proactive-assistant';
const assistant = getProactiveAssistant();
console.log(assistant.getActiveSuggestions());
```

### View Conversation History

```typescript
// In browser console
import { getContextManager } from './lib/ai/context-manager';
const manager = getContextManager();
console.log(manager.exportSession());
```

---

## ✅ Testing Checklist

### Manual Testing Steps:

1. **Proactive Suggestions**
   - [ ] Add 6+ items to one day → Should suggest "packed schedule"
   - [ ] Add expensive items → Should show budget alert
   - [ ] Create overlapping times → Should detect conflict
   - [ ] Add restaurant → Should suggest nearby activities

2. **Context-Aware Chat**
   - [ ] Ask "Find restaurants" → Get results
   - [ ] Ask "Show the second one" → Should resolve reference
   - [ ] Ask "Add it to tomorrow" → Should understand "it" and "tomorrow"

3. **Multi-Agent Collaboration**
   - [ ] Query: "Plan romantic evening under $150"
   - [ ] Should use 3+ agents
   - [ ] Should return synthesized response
   - [ ] Should show metadata (agents used, duration)

4. **Edge Cases**
   - [ ] Works without Gemini API key (mock mode)
   - [ ] Persists across page reloads
   - [ ] No memory leaks (check after 100 actions)
   - [ ] Mobile responsive
   - [ ] Keyboard accessible

---

## 🚀 Deployment Checklist

### Before Deploying:

- [ ] Set Gemini API key (optional, works without)
- [ ] Configure feature flags
- [ ] Set up analytics tracking
- [ ] Test on mobile devices
- [ ] Test with slow network
- [ ] Test offline (should gracefully degrade)
- [ ] Review localStorage usage (GDPR compliance)
- [ ] Add user preferences for enabling/disabling features

### Environment Variables:

```bash
# .env
VITE_GEMINI_API_KEY=your_api_key_here  # Optional

# Feature flags (optional)
VITE_ENABLE_PROACTIVE_AI=true
VITE_ENABLE_CONTEXT_CHAT=true
VITE_ENABLE_MULTI_AGENT=true
```

---

## 📚 Additional Resources

- **Main Documentation:** `/ADVANCED_AI_COMPLETE.md`
- **Enhancement Plan:** `/PRODUCTION_ENHANCEMENT_PLAN.md`
- **Demo Component:** `/components/ai/AdvancedAIDemo.tsx`
- **Hook Documentation:** `/hooks/useAdvancedAI.ts` (JSDoc comments)

---

## 💡 Best Practices

1. **Always provide tripId** to useAdvancedAI for better context
2. **Handle loading states** - AI operations can take time
3. **Show error messages** - Network issues, API limits, etc.
4. **Make suggestions dismissible** - Don't annoy users
5. **Respect user preferences** - Allow disabling features
6. **Track usage** - Know which features users love
7. **Provide feedback** - Show when AI is working
8. **Fallback gracefully** - Work without API key

---

## 🎉 You're Ready!

Your app now has **enterprise-grade AI features**. Choose any integration option above and you'll be live in minutes.

**Questions?** Check `/ADVANCED_AI_COMPLETE.md` for detailed documentation.

**Need help?** All code has extensive JSDoc comments and TypeScript types.

**Happy coding!** 🚀
