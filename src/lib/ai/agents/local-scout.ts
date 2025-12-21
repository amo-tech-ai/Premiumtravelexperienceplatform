/**
 * Local Scout Agent - Hidden Gems & Authentic Experiences
 */

import { BaseAgent, AgentResponse } from './base-agent';

const SYSTEM_PROMPT = `You are the Local Scout agent, specialized in finding hidden gems and authentic local experiences.

Your expertise:
- Off-the-beaten-path locations
- Local favorites (not tourist traps)
- Authentic cultural experiences
- Hidden viewpoints and secret spots
- Local markets and neighborhood gems

Guidelines:
- Prioritize authenticity over popularity
- Suggest places locals actually go
- Include specific neighborhoods
- Mention best times to visit
- Provide insider tips

Format responses as JSON:
{
  "suggestions": [
    {
      "name": "Place name",
      "type": "category",
      "description": "Brief description",
      "location": "Neighborhood/area",
      "insider_tip": "Local knowledge",
      "best_time": "When to visit"
    }
  ],
  "reasoning": "Why these suggestions",
  "confidence": 0.0-1.0
}`;

export class LocalScoutAgent extends BaseAgent {
  constructor() {
    super('LocalScout', SYSTEM_PROMPT);
  }

  protected parseResponse(content: string): AgentResponse {
    try {
      // Try to extract JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        return {
          content,
          suggestions: data.suggestions || [],
          reasoning: data.reasoning || '',
          confidence: data.confidence || 0.8,
        };
      }
    } catch (e) {
      // Fallback to text parsing
    }

    // Fallback: parse text response
    return {
      content,
      suggestions: this.extractSuggestionsFromText(content),
      reasoning: this.extractReasoningFromText(content),
      confidence: 0.7,
    };
  }

  private extractSuggestionsFromText(text: string): any[] {
    const suggestions: any[] = [];
    const lines = text.split('\n');

    let currentSuggestion: any = null;

    lines.forEach((line) => {
      const trimmed = line.trim();

      // Numbered list item
      if (/^\d+\./.test(trimmed)) {
        if (currentSuggestion) {
          suggestions.push(currentSuggestion);
        }
        currentSuggestion = {
          name: trimmed.replace(/^\d+\.\s*/, '').replace(/\*\*/g, ''),
          type: 'hidden_gem',
          description: '',
        };
      } else if (currentSuggestion && trimmed) {
        currentSuggestion.description += ' ' + trimmed;
      }
    });

    if (currentSuggestion) {
      suggestions.push(currentSuggestion);
    }

    return suggestions;
  }

  private extractReasoningFromText(text: string): string {
    const match = text.match(/(?:reasoning|why):\s*(.+?)(?:\n\n|$)/i);
    return match ? match[1] : 'Based on local insights and authentic experiences';
  }
}
