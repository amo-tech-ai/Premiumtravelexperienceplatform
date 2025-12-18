import { LocalEvent } from './mockTripData';

/**
 * Calculates a confidence score (0.0 - 1.0) for an event based on data quality and relevance.
 * This simulates the AI's "Validation" step.
 */
export const calculateConfidence = (event: Partial<LocalEvent>, userInterests: string[] = []): number => {
  let score = 0.4; // Base confidence (40%)

  // 1. Data Quality Signals (The AI "Trusts" this event exists)
  if (event.venue?.lat && event.venue?.lng) score += 0.25; // Validated location
  if (event.booking_url) score += 0.15; // Ticket link exists = high signal
  if (event.time && event.date) score += 0.1; // Specific time
  if (event.image && !event.image.includes('placeholder')) score += 0.05; // Visual proof

  // 2. Relevance Signals (The AI thinks YOU will like it)
  // In a real app, this uses vector embeddings. Here, we do tag matching.
  const hasRelevance = userInterests.some(interest => 
    event.tags?.some(tag => tag.toLowerCase().includes(interest.toLowerCase())) || 
    event.category?.toLowerCase() === interest.toLowerCase()
  );
  
  if (hasRelevance) score += 0.15;

  return Math.min(0.99, Number(score.toFixed(2))); // Cap at 99%
};

/**
 * Returns a human-readable label and color class for a score.
 */
export const getConfidenceMetadata = (score: number) => {
  if (score >= 0.9) return { label: "Perfect Match", color: "text-amber-700 bg-amber-100 border-amber-200" };
  if (score >= 0.8) return { label: "Highly Recommended", color: "text-emerald-700 bg-emerald-100 border-emerald-200" };
  if (score >= 0.7) return { label: "Good Fit", color: "text-blue-700 bg-blue-100 border-blue-200" };
  return { label: "Suggested", color: "text-slate-600 bg-slate-100 border-slate-200" };
};
