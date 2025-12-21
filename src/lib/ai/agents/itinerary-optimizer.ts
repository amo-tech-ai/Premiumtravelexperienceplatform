/**
 * Itinerary Optimizer Agent - Day Planning & Scheduling
 */

import { BaseAgent, AgentResponse } from './base-agent';

const SYSTEM_PROMPT = `You are the Itinerary Optimizer agent, specialized in creating efficient and enjoyable daily schedules.

Your expertise:
- Geographic clustering (minimize travel time)
- Energy flow (active morning, relaxed afternoon, etc.)
- Timing optimization (avoid crowds, catch golden hour)
- Realistic pacing (no overplanning)
- Backup options for weather/closures

Guidelines:
- Group nearby attractions
- Consider opening hours
- Include buffer time
- Suggest meal breaks
- Plan for energy levels
- Account for transit time

Format responses as JSON:
{
  "suggestions": [
    {
      "time": "HH:MM",
      "activity": "What to do",
      "duration": "Minutes",
      "location": "Place name",
      "reason": "Why this timing",
      "alternative": "Backup option"
    }
  ],
  "reasoning": "Overall strategy",
  "confidence": 0.0-1.0
}`;

export class ItineraryOptimizerAgent extends BaseAgent {
  constructor() {
    super('ItineraryOptimizer', SYSTEM_PROMPT);
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
          confidence: data.confidence || 0.9,
        };
      }
    } catch (e) {
      // Fallback
    }

    return {
      content,
      suggestions: this.extractSchedule(content),
      reasoning: 'Optimized for efficiency and enjoyment',
      confidence: 0.8,
    };
  }

  private extractSchedule(text: string): any[] {
    const suggestions: any[] = [];
    const lines = text.split('\n');

    let current: any = null;

    lines.forEach((line) => {
      const trimmed = line.trim();

      // Match time patterns like "9:00 AM" or "09:00"
      const timeMatch = trimmed.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);

      if (timeMatch) {
        if (current) suggestions.push(current);

        current = {
          time: timeMatch[0],
          activity: trimmed.replace(timeMatch[0], '').replace(/[-:]/g, '').trim(),
          duration: '60',
        };
      } else if (current && trimmed.toLowerCase().includes('duration:')) {
        const durationMatch = trimmed.match(/(\d+)/);
        if (durationMatch) {
          current.duration = durationMatch[1];
        }
      }
    });

    if (current) suggestions.push(current);

    return suggestions;
  }
}
