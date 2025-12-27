# CHAT → EXPLORE UX SIGNALING & COPY

**Status:** 🟡 In Progress  
**Owner:** Design + Content  
**Priority:** P1 - High  
**Created:** December 24, 2024

---

## 🎯 Executive Summary

**Problem:** Users don't understand what AI suggested vs what they're exploring, leading to confusion about what's been applied to their trip.

**Solution:** Clear, consistent visual signals and microcopy that distinguish AI suggestions from manual exploration from applied changes.

**Impact:** Builds trust, reduces confusion, prevents accidental trip modifications.

---

## 1️⃣ CHAT BEHAVIOR RULES

### Rule 1.1: Top 3 Only

**Principle:** Chat is advisory, not comprehensive

```tsx
// ✅ DO: Show exactly 3 results
<ChatMessage role="assistant">
  <AssistantText>
    I found 12 romantic restaurants in El Poblado. 
    Here are my top 3 recommendations:
  </AssistantText>
  
  <ResultCards items={results.slice(0, 3)} />
  
  <ViewMoreCTA>
    View all 12 on map →
  </ViewMoreCTA>
</ChatMessage>

// ❌ DON'T: Show all results in chat
<ChatMessage>
  <ResultCards items={results} />  {/* Too many! */}
</ChatMessage>
```

**Why only 3:**
- Chat is conversational, not a database dump
- Forces AI to prioritize
- Encourages user to explore on map
- Prevents chat scroll fatigue

**Exception:** If only 1-2 results exist, show all

```tsx
{results.length <= 2 ? (
  <ResultCards items={results} />
) : (
  <ResultCards items={results.slice(0, 3)} />
)}
```

### Rule 1.2: Explain Why Briefly

**Principle:** Show reasoning, build trust

```tsx
// ✅ DO: Include brief explanation
<ChatMessage role="assistant">
  <ReasoningText>
    Based on your interest in outdoor activities and local culture, 
    I found these experiences:
  </ReasoningText>
  
  <ResultCards items={results.slice(0, 3)} />
</ChatMessage>

// ❌ DON'T: Dump results without context
<ChatMessage role="assistant">
  <ResultCards items={results} />  {/* Why these? */}
</ChatMessage>
```

**Reasoning patterns:**

| User Input | Reasoning Template |
|------------|-------------------|
| "Romantic dinner" | "Based on your preference for **romantic** dining, here are upscale restaurants with ambiance:" |
| "Family activities" | "I found **family-friendly** activities with high safety ratings and kid amenities:" |
| "Budget-friendly" | "These options fit your **budget** while maintaining quality:" |
| "Nightlife" | "Based on your interest in **nightlife**, here are venues open late:" |
| No specific preference | "Here are **top-rated** options in {area}:" |

**Character limit:** 60-80 characters max

### Rule 1.3: One CTA Only

**Principle:** Clear next action, no decision paralysis

```tsx
// ✅ DO: Single, clear CTA
<ChatMessage role="assistant">
  <ResultCards items={results.slice(0, 3)} />
  
  <PrimaryCTA onClick={() => navigateToExplore(contextId)}>
    View all {totalCount} on map →
  </PrimaryCTA>
</ChatMessage>

// ❌ DON'T: Multiple competing CTAs
<ChatMessage role="assistant">
  <ResultCards items={results.slice(0, 3)} />
  
  <Button>View on map</Button>
  <Button>Refine search</Button>
  <Button>Add all to trip</Button>  {/* Too many! */}
</ChatMessage>
```

**CTA copy patterns:**

| Context | CTA Copy |
|---------|----------|
| More results available | "View all {count} on map →" |
| Exact count shown | "Explore {area} on map →" |
| Mixed results (restaurants + events) | "See all recommendations →" |
| Single result type | "View all {type} →" |

**CTA styling:**

```tsx
<Button
  variant="ghost"
  size="sm"
  rightIcon={<ChevronRight />}
  onClick={handleViewAll}
>
  View all {count} on map
</Button>
```

### Rule 1.4: No Auto-Add

**Principle:** AI suggests, user decides

```tsx
// ❌ FORBIDDEN: Auto-add to trip
function handleAISuggestion(items: Restaurant[]) {
  items.forEach(item => {
    dispatch({ type: 'ADD_TO_TRIP', item });  // ❌ NEVER!
  });
}

// ✅ CORRECT: Show preview
function handleAISuggestion(items: Restaurant[]) {
  const preview = {
    type: 'batch_add',
    items,
    requiresApproval: true,
  };
  dispatch({ type: 'SHOW_PREVIEW', preview });
}
```

**Individual card actions:**

```tsx
<ResultCard item={item}>
  {/* ✅ Preview action */}
  <CardCTA onClick={() => previewAdd(item)}>
    Add to trip
  </CardCTA>
  
  {/* ❌ Direct action */}
  <CardCTA onClick={() => addToTrip(item)}>
    Add to trip
  </CardCTA>
</ResultCard>
```

---

## 2️⃣ EXPLORE PAGE SIGNALS

### Context Banner (AI Source)

**When source === 'ai':**

```tsx
{context.source === 'ai' && context.aiContext && (
  <AIContextBanner>
    <Icon name="sparkles" size={20} />
    <BannerContent>
      <BannerTitle>AI Recommendations</BannerTitle>
      <BannerReasoning>{context.aiContext.reasoning}</BannerReasoning>
    </BannerContent>
    <BannerAction>
      <Button variant="ghost" size="xs" onClick={startNewSearch}>
        New search
      </Button>
    </BannerAction>
  </AIContextBanner>
)}
```

**Styling:**

```css
.ai-context-banner {
  background: linear-gradient(135deg, #FFF9F0 0%, #FFFFFF 100%);
  border: 1px solid #F0E6D6;
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.banner-title {
  font-size: 14px;
  font-weight: 600;
  color: #8B7355;
}

.banner-reasoning {
  font-size: 13px;
  color: #666;
  margin-top: 2px;
}
```

**When source === 'manual':**

```tsx
// No AI banner, just show filters/search
<FilterBar>
  <SearchInput placeholder="Search restaurants..." />
  <FilterButton>Filters</FilterButton>
</FilterBar>
```

### "AI Suggested" Badges

**Top 3 AI recommendations get badge:**

```tsx
{results.map((item, index) => (
  <RestaurantCard
    key={item.id}
    item={item}
    badge={context.source === 'ai' && index < 3 ? 'ai-recommended' : undefined}
  />
))}
```

**Badge component:**

```tsx
function AIRecommendedBadge() {
  return (
    <Badge
      variant="subtle"
      leftIcon={<Sparkles size={12} />}
      style={{
        background: '#FFF9F0',
        color: '#8B7355',
        border: '1px solid #F0E6D6',
      }}
    >
      AI Pick
    </Badge>
  );
}
```

**Placement:**

```tsx
<Card>
  <CardHeader>
    <CardTitle>{item.name}</CardTitle>
    {badge && <AIRecommendedBadge />}
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

### Section Headers

**AI Results:**

```tsx
<Section>
  <SectionHeader>
    <Icon name="sparkles" />
    <SectionTitle>Recommended for You</SectionTitle>
    <SectionCount>{aiResults.length}</SectionCount>
  </SectionHeader>
  
  <ResultGrid items={aiResults} />
</Section>
```

**All Results:**

```tsx
<Section>
  <SectionHeader>
    <SectionTitle>All Restaurants in El Poblado</SectionTitle>
    <SectionCount>{allResults.length}</SectionCount>
  </SectionHeader>
  
  <ResultGrid items={allResults} />
</Section>
```

**Nearby Alternatives (Secondary):**

```tsx
<CollapsibleSection defaultCollapsed>
  <SectionHeader>
    <Icon name="map-pin" />
    <SectionTitle>Also Consider</SectionTitle>
    <SectionCount>{nearbyResults.length} nearby</SectionCount>
  </SectionHeader>
  
  <ResultGrid items={nearbyResults} />
</CollapsibleSection>
```

---

## 3️⃣ LANGUAGE RULES

### Allowed Terms (Safe)

**Suggestions & Recommendations:**

```typescript
const ALLOWED_TERMS = [
  'suggested',
  'recommended',
  'based on your interests',
  'you might like',
  'popular for',
  'top-rated',
  'matches your preferences',
  'similar to',
];
```

**Usage examples:**

```tsx
// ✅ Good
"I found 12 restaurants that match your preferences"
"Based on your interest in rooftop bars, here are my recommendations"
"You might also like these nearby cafes"
"Top-rated options in El Poblado"

// ✅ Also good (passive voice)
"12 restaurants were found in your area"
"These options are popular for romantic dinners"
```

### Forbidden Terms (Implies Action)

**Autonomous language:**

```typescript
const FORBIDDEN_TERMS = [
  'done',            // Implies completed action
  'booked',          // Implies reservation made
  'added to trip',   // Implies modification
  'planned for you', // Implies decision made
  'scheduled',       // Implies calendar entry
  'reserved',        // Implies commitment
  'confirmed',       // Implies finalized
  'I booked',        // AI never "does"
  'I added',         // AI never "does"
];
```

**Bad examples:**

```tsx
// ❌ BAD - implies action taken
"I've added these restaurants to your trip"
"Your dinner is booked for 7pm"
"I scheduled this event for Saturday"
"These are confirmed for your itinerary"

// ✅ GOOD - suggests, doesn't do
"I recommend adding these restaurants to your trip"
"This restaurant has availability at 7pm"
"This event takes place on Saturday"
"These would fit well in your itinerary"
```

### Preview-Specific Language

**Before Preview Shown:**

```tsx
// ✅ Invitation to preview
<Button onClick={showPreview}>
  Preview adding to trip
</Button>

<Button onClick={showPreview}>
  See how this fits your schedule
</Button>
```

**During Preview:**

```tsx
// ✅ Clear preview state
<PreviewBanner>
  <Icon name="eye" />
  <Text>Preview: Adding 3 restaurants to Saturday</Text>
</PreviewBanner>

<PreviewActions>
  <Button onClick={applyPreview}>Apply changes</Button>
  <Button onClick={dismissPreview}>Cancel</Button>
</PreviewActions>
```

**After Applied:**

```tsx
// ✅ Past tense, user-controlled
<Toast>
  ✓ 3 restaurants added to your trip
  <Button onClick={undo}>Undo</Button>
</Toast>
```

---

## 4️⃣ TRUST SIGNALS

### Explanation Placement

**Visible by default:**

```tsx
// ✅ DO: Show reasoning inline
<AIRecommendation>
  <ReasoningText>
    This restaurant matches your preference for rooftop dining 
    and is within your budget.
  </ReasoningText>
  
  <RestaurantCard item={item} />
</AIRecommendation>

// ❌ DON'T: Hide reasoning behind tooltip
<AIRecommendation>
  <RestaurantCard item={item} />
  <Tooltip content="AI recommended because...">ℹ️</Tooltip>
</AIRecommendation>
```

**Exception:** Brief summary visible, full details collapsible

```tsx
<AIRecommendation>
  <ReasoningSummary>
    Matches your interests: rooftop, budget-friendly
  </ReasoningSummary>
  
  <CollapsibleDetails>
    <DetailedReasoning>
      This restaurant was selected because:
      • Located in your preferred area (El Poblado)
      • Price range matches your budget ($$$)
      • 4.8★ rating from 200+ reviews
      • Has rooftop seating (your preference)
    </DetailedReasoning>
  </CollapsibleDetails>
</AIRecommendation>
```

### Confidence Indicators

**High confidence (≥0.8):**

```tsx
<ConfidenceBadge level="high">
  <Icon name="thumbs-up" />
  <Text>Great match</Text>
</ConfidenceBadge>
```

**Medium confidence (0.5-0.8):**

```tsx
<ConfidenceBadge level="medium">
  <Icon name="star" />
  <Text>Good option</Text>
</ConfidenceBadge>
```

**Low confidence (<0.5):**

```tsx
// Don't show low confidence items in top 3
// If showing them, label clearly:
<ConfidenceBadge level="low">
  <Icon name="info" />
  <Text>Worth considering</Text>
</ConfidenceBadge>
```

**Don't show raw scores:**

```tsx
// ❌ DON'T: Technical scores
<Badge>Confidence: 0.87</Badge>
<Badge>Match score: 73%</Badge>

// ✅ DO: Human language
<Badge>Great match</Badge>
<Badge>Highly recommended</Badge>
```

### Source Attribution

**When using external data:**

```tsx
<RestaurantCard item={item}>
  <CardContent>
    {item.name}
    <Rating value={item.rating} />
    <Source>Rating from Google · 234 reviews</Source>
  </CardContent>
</RestaurantCard>
```

**When using AI reasoning:**

```tsx
<EventCard item={item}>
  <CardBadge>
    <Icon name="sparkles" size={12} />
    AI recommended based on your interests
  </CardBadge>
</EventCard>
```

### Alternative Options

**Always show user control:**

```tsx
<AIRecommendationSection>
  <SectionHeader>
    <Title>Recommended for You</Title>
    <AlternativeAction>
      <Button variant="ghost" onClick={showAllResults}>
        Browse all options
      </Button>
    </AlternativeAction>
  </SectionHeader>
  
  <ResultGrid items={aiResults} />
</AIRecommendationSection>
```

**"Not quite right" feedback:**

```tsx
<AIResultCard item={item}>
  <CardActions>
    <Button onClick={() => previewAdd(item)}>
      Add to trip
    </Button>
    
    <FeedbackButton onClick={() => showFeedback(item)}>
      Not quite right?
    </FeedbackButton>
  </CardActions>
</AIResultCard>
```

---

## 5️⃣ MICROCOPY LIBRARY

### Chat Messages

**Restaurant suggestions:**
```
"I found {count} {vibe} restaurants in {area}. Here are my top 3:"
"Based on your preference for {preference}, here are upscale dining options:"
"These restaurants match your budget and have rooftop seating:"
```

**Event suggestions:**
```
"I found {count} {type} events happening {timeframe}:"
"Based on your interest in {interest}, here are local experiences:"
"These events match your preferences and schedule:"
```

**Rental suggestions:**
```
"I found {count} {type} rentals in {area}:"
"These properties have {amenity} and fit your budget:"
"Based on your dates, here are available options:"
```

**Mixed suggestions:**
```
"I put together some recommendations for your trip to {city}:"
"Here's what I found for your {duration} in {area}:"
"Based on your interests, here's a mix of dining and activities:"
```

### Empty States

**No results found:**
```
"I couldn't find {type} matching all your criteria in {area}"
"Try adjusting your filters or exploring nearby areas"
```

**Filtered to zero:**
```
"No results match your current filters"
"Try removing some filters to see more options"
```

**Search errors:**
```
"I'm having trouble loading results right now"
"Check your connection and try again"
```

### Success Messages

**Preview applied:**
```
"✓ 3 restaurants added to Saturday"
"✓ Event added to your trip · 7:00 PM"
"✓ Changes applied to your itinerary"
```

**Item saved:**
```
"✓ Saved to your favorites"
"✓ Bookmark added"
```

**Shared:**
```
"✓ Trip shared with 2 people"
"✓ Link copied to clipboard"
```

### Error Messages

**Conflict detected:**
```
"⚠️ This overlaps with dinner at Carmen"
"⚠️ Travel time from previous activity: 45 minutes"
```

**Budget exceeded:**
```
"⚠️ This would exceed your daily budget by $50"
"⚠️ You've allocated $200 of $250 budget"
```

**Unavailable:**
```
"⚠️ This restaurant is closed on Sunday"
"⚠️ Event is sold out"
```

### Loading States

**Chat thinking:**
```
"Finding restaurants in El Poblado..."
"Analyzing your preferences..."
"Checking availability..."
```

**Map loading:**
```
"Loading results on map..."
"Finding nearby options..."
```

**Preview computing:**
```
"Checking your schedule..."
"Calculating travel times..."
```

---

## 6️⃣ VISUAL HIERARCHY FOR TRUST

### Information Density

**Chat (Low density):**
```tsx
<ChatMessage role="assistant">
  {/* Single thought */}
  <Paragraph>
    I found 12 romantic restaurants in El Poblado.
  </Paragraph>
  
  {/* Visual break */}
  <Spacer height={16} />
  
  {/* Top 3 only */}
  <ResultCards items={results.slice(0, 3)} />
  
  {/* Clear CTA */}
  <Spacer height={12} />
  <Button>View all 12 on map →</Button>
</ChatMessage>
```

**Explore (Medium density):**
```tsx
<ExplorePage>
  {/* Context banner */}
  <AIContextBanner>...</AIContextBanner>
  
  {/* Primary results (8-12 cards) */}
  <ResultGrid items={results} />
  
  {/* Secondary results (collapsed) */}
  <CollapsibleSection>...</CollapsibleSection>
</ExplorePage>
```

**Map (High density):**
```tsx
<MapView>
  {/* All results as pins */}
  <MapPins pins={allPins} />
  
  {/* Selected card preview */}
  {selection && <CardPreview item={selectedItem} />}
</MapView>
```

### AI Badge Prominence

**Subtle (recommended):**

```tsx
<Badge
  size="xs"
  variant="subtle"
  icon={<Sparkles size={10} />}
  style={{
    background: 'rgba(139, 115, 85, 0.1)',
    color: '#8B7355',
    border: 'none',
  }}
>
  AI Pick
</Badge>
```

**Too prominent (avoid):**

```tsx
// ❌ TOO BOLD
<Badge
  size="lg"
  variant="solid"
  icon={<Sparkles size={16} />}
  style={{
    background: '#FF6B00',  // Neon orange
    color: '#FFFFFF',
    animation: 'pulse 2s infinite',
  }}
>
  🤖 AI RECOMMENDED!
</Badge>
```

### Approval Buttons

**Preview state (before applying):**

```tsx
<PreviewActions>
  {/* Primary = Apply */}
  <Button variant="primary" size="md" onClick={applyPreview}>
    Apply changes
  </Button>
  
  {/* Secondary = Cancel */}
  <Button variant="ghost" size="md" onClick={dismissPreview}>
    Cancel
  </Button>
</PreviewActions>
```

**Applied state (show undo):**

```tsx
<Toast variant="success">
  <ToastContent>
    <Icon name="check-circle" />
    <Text>3 restaurants added to your trip</Text>
  </ToastContent>
  
  <ToastAction>
    <Button variant="ghost" size="sm" onClick={undo}>
      Undo
    </Button>
  </ToastAction>
</Toast>
```

---

## 7️⃣ IMPLEMENTATION CHECKLIST

### Phase 1: Chat Messages (Week 1)

- [ ] Implement Top 3 limit
- [ ] Add reasoning templates
- [ ] Build single CTA pattern
- [ ] Remove auto-add functionality
- [ ] Test message flow end-to-end

### Phase 2: Explore Signals (Week 2)

- [ ] Build AI context banner
- [ ] Add "AI Pick" badges to top 3
- [ ] Create section headers
- [ ] Implement collapsible secondary sections
- [ ] Add "New search" CTA

### Phase 3: Copy Audit (Week 2)

- [ ] Audit all AI copy for forbidden terms
- [ ] Replace "done/booked" language
- [ ] Add "preview" language to CTAs
- [ ] Update error messages
- [ ] Update success messages

### Phase 4: Trust Signals (Week 3)

- [ ] Add reasoning explanations
- [ ] Implement confidence badges (don't show raw scores)
- [ ] Add source attribution
- [ ] Build "Not quite right" feedback
- [ ] Add alternative options CTAs

### Phase 5: Visual Polish (Week 3)

- [ ] Finalize AI badge styling (subtle)
- [ ] Implement visual hierarchy
- [ ] Add loading state copy
- [ ] Create empty state messages
- [ ] Test information density

---

## 8️⃣ SUCCESS CRITERIA

### User Understanding

✅ **Clear AI Source**
- User can identify AI suggestions vs manual results
- AI reasoning is visible and understandable
- Confidence in recommendations is clear

✅ **Action Clarity**
- User knows nothing is added without approval
- Preview state is obvious
- Apply vs Cancel is unambiguous

✅ **Trust Signals**
- Explanations build confidence
- Alternative options available
- Feedback mechanism present

### Copy Quality

✅ **Language Safety**
- No "done/booked" language
- All copy suggests, never controls
- Passive voice where appropriate

✅ **Information Density**
- Chat: Low density (3 results)
- Explore: Medium density (12 results)
- Map: High density (all results)

✅ **Consistency**
- Badge copy consistent
- Section headers consistent
- CTA copy consistent

---

## 🔗 RELATED DOCUMENTATION

- [Context State Contract](/docs/01-ai-features/02-context-state-contract.md)
- [Preview System Guide](/docs/preview-system-guide.md)
- [AI Agent Specifications](/docs/ai-agents-spec.md)

---

**Document Status:** 🟡 Draft - Needs Copy Review  
**Next Review:** December 27, 2024  
**Approvers:** Content Lead, Design Lead, Product Lead
