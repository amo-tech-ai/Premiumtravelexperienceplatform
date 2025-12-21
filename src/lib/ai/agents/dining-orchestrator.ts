/**
 * Dining Orchestrator Agent - Restaurant Recommendations
 */

import { BaseAgent, AgentResponse } from './base-agent';

const SYSTEM_PROMPT = `You are the Dining Orchestrator agent, specialized in restaurant recommendations and culinary experiences.

Your expertise:
- Fine dining and casual spots
- Local cuisine and international options
- Dietary restrictions and preferences
- Ambiance and occasion matching
- Reservations and timing advice

Guidelines:
- Match restaurants to occasion (romantic, business, casual, family)
- Consider dietary needs (vegan, gluten-free, etc.)
- Suggest specific dishes
- Mention price range clearly
- Include reservation tips

Format responses as JSON:
{
  "suggestions": [
    {
      "name": "Restaurant name",
      "cuisine": "Type of cuisine",
      "description": "Brief description",
      "price_level": 1-4,
      "occasion": ["romantic", "business", "casual"],
      "signature_dish": "Must-try dish",
      "reservation_tip": "Booking advice"
    }
  ],
  "reasoning": "Why these suggestions",
  "confidence": 0.0-1.0
}`;

export class DiningOrchestratorAgent extends BaseAgent {
  constructor() {
    super('DiningOrchestrator', SYSTEM_PROMPT);
  }

  protected parseResponse(content: string): AgentResponse {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        return {
          content,
          suggestions: data.suggestions || [],
          reasoning: data.reasoning || '',
          confidence: data.confidence || 0.85,
        };
      }
    } catch (e) {
      // Fallback
    }

    return {
      content,
      suggestions: this.extractRestaurants(content),
      reasoning: 'Based on culinary expertise and reviews',
      confidence: 0.75,
    };
  }

  private extractRestaurants(text: string): any[] {
    const suggestions: any[] = [];
    const lines = text.split('\n');

    let current: any = null;

    lines.forEach((line) => {
      const trimmed = line.trim();

      if (/^\d+\./.test(trimmed)) {
        if (current) suggestions.push(current);
        current = {
          name: trimmed.replace(/^\d+\.\s*/, '').replace(/\*\*/g, ''),
          cuisine: 'Various',
          price_level: 2,
        };
      } else if (current && trimmed.toLowerCase().includes('cuisine:')) {
        current.cuisine = trimmed.split(':')[1]?.trim() || 'Various';
      } else if (current && trimmed.toLowerCase().includes('price:')) {
        const priceMatch = trimmed.match(/\$+/);
        current.price_level = priceMatch ? priceMatch[0].length : 2;
      }
    });

    if (current) suggestions.push(current);

    return suggestions;
  }
}
