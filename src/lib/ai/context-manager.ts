/**
 * Context Manager
 * Maintains conversation context and resolves references across messages
 * 
 * Features:
 * - Session persistence (localStorage + memory)
 * - Reference resolution ("it", "that", "tomorrow")
 * - Entity tracking (places, dates, people)
 * - Conversation history
 * - Smart context pruning (keeps relevant, drops old)
 */

// --- TYPES ---

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  intent?: string;
  entities?: Record<string, any>;
  references?: Reference[];
}

export interface Reference {
  type: 'place' | 'date' | 'person' | 'item' | 'number';
  value: any;
  pronoun?: string; // "it", "that", "this", "them"
  confidence: number;
}

export interface ConversationContext {
  sessionId: string;
  userId?: string;
  tripId?: string;
  location?: {
    city: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  preferences?: {
    budget?: string;
    dietary?: string[];
    interests?: string[];
  };
  recentEntities: Map<string, EntityMemory>;
  messages: ConversationMessage[];
  metadata: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

export interface EntityMemory {
  type: string;
  value: any;
  lastMentioned: number;
  mentionCount: number;
  salience: number; // 0-1, how important is this entity
}

// --- CONTEXT MANAGER CLASS ---

export class ContextManager {
  private contexts: Map<string, ConversationContext>;
  private activeSessionId: string | null;
  private maxContextLength: number;
  private maxEntityMemory: number;

  constructor(maxContextLength: number = 20, maxEntityMemory: number = 50) {
    this.contexts = new Map();
    this.activeSessionId = null;
    this.maxContextLength = maxContextLength;
    this.maxEntityMemory = maxEntityMemory;

    this.loadFromStorage();
  }

  /**
   * Create a new conversation session
   */
  createSession(options?: {
    userId?: string;
    tripId?: string;
    location?: any;
    preferences?: any;
  }): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const context: ConversationContext = {
      sessionId,
      userId: options?.userId,
      tripId: options?.tripId,
      location: options?.location,
      preferences: options?.preferences,
      recentEntities: new Map(),
      messages: [],
      metadata: {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.contexts.set(sessionId, context);
    this.activeSessionId = sessionId;
    this.saveToStorage();

    console.log(`[ContextManager] Created session: ${sessionId}`);
    return sessionId;
  }

  /**
   * Get or create active session
   */
  getActiveSession(): ConversationContext {
    if (!this.activeSessionId || !this.contexts.has(this.activeSessionId)) {
      this.activeSessionId = this.createSession();
    }
    return this.contexts.get(this.activeSessionId)!;
  }

  /**
   * Set active session
   */
  setActiveSession(sessionId: string): boolean {
    if (this.contexts.has(sessionId)) {
      this.activeSessionId = sessionId;
      return true;
    }
    return false;
  }

  /**
   * Add message to active session
   */
  addMessage(
    role: 'user' | 'assistant' | 'system',
    content: string,
    metadata?: {
      intent?: string;
      entities?: Record<string, any>;
      references?: Reference[];
    }
  ): ConversationMessage {
    const context = this.getActiveSession();

    const message: ConversationMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: Date.now(),
      intent: metadata?.intent,
      entities: metadata?.entities,
      references: metadata?.references,
    };

    context.messages.push(message);
    context.updatedAt = Date.now();

    // Extract and track entities
    if (metadata?.entities) {
      this.trackEntities(context, metadata.entities);
    }

    // Prune old messages if needed
    if (context.messages.length > this.maxContextLength) {
      const pruned = this.pruneMessages(context);
      console.log(`[ContextManager] Pruned ${pruned} old messages`);
    }

    this.saveToStorage();
    return message;
  }

  /**
   * Resolve references in user message
   * Example: "Show me that restaurant" -> Finds which restaurant was mentioned
   */
  resolveReferences(message: string, context?: ConversationContext): {
    resolved: string;
    references: Reference[];
  } {
    const ctx = context || this.getActiveSession();
    const references: Reference[] = [];
    let resolved = message;

    // Pronouns to look for
    const pronounPatterns = [
      { pattern: /\b(it|its)\b/gi, type: 'singular' },
      { pattern: /\b(that|this)\b/gi, type: 'singular' },
      { pattern: /\b(them|those|these)\b/gi, type: 'plural' },
      { pattern: /\b(the second one|the first one|the \w+ one)\b/gi, type: 'ordinal' },
    ];

    // Check for pronouns
    for (const { pattern, type } of pronounPatterns) {
      const matches = message.match(pattern);
      if (matches) {
        // Find most recent relevant entity
        const entity = this.findMostRelevantEntity(ctx, type);
        if (entity) {
          references.push({
            type: entity.type as any,
            value: entity.value,
            pronoun: matches[0],
            confidence: entity.salience,
          });

          // Optionally replace pronoun with actual value
          // resolved = resolved.replace(pattern, entity.value.name || entity.value);
        }
      }
    }

    // Check for temporal references
    const temporalRefs = this.resolveTemporalReferences(message, ctx);
    references.push(...temporalRefs);

    return { resolved, references };
  }

  /**
   * Resolve temporal references (tomorrow, next week, etc.)
   */
  private resolveTemporalReferences(message: string, context: ConversationContext): Reference[] {
    const references: Reference[] = [];
    const now = new Date();

    // Tomorrow
    if (/\btomorrow\b/i.test(message)) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      references.push({
        type: 'date',
        value: tomorrow.toISOString().split('T')[0],
        pronoun: 'tomorrow',
        confidence: 1.0,
      });
    }

    // Today
    if (/\btoday\b/i.test(message)) {
      references.push({
        type: 'date',
        value: now.toISOString().split('T')[0],
        pronoun: 'today',
        confidence: 1.0,
      });
    }

    // Next week
    if (/\bnext week\b/i.test(message)) {
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      references.push({
        type: 'date',
        value: nextWeek.toISOString().split('T')[0],
        pronoun: 'next week',
        confidence: 0.9,
      });
    }

    return references;
  }

  /**
   * Find most relevant entity for reference resolution
   */
  private findMostRelevantEntity(
    context: ConversationContext,
    referenceType: string
  ): EntityMemory | null {
    // Sort entities by recency and salience
    const sortedEntities = Array.from(context.recentEntities.values()).sort((a, b) => {
      // Combine recency and salience
      const scoreA = (a.lastMentioned / Date.now()) * 0.5 + a.salience * 0.5;
      const scoreB = (b.lastMentioned / Date.now()) * 0.5 + b.salience * 0.5;
      return scoreB - scoreA;
    });

    // Return most relevant
    return sortedEntities[0] || null;
  }

  /**
   * Track entities mentioned in conversation
   */
  private trackEntities(context: ConversationContext, entities: Record<string, any>) {
    for (const [key, value] of Object.entries(entities)) {
      const entityKey = `${key}:${JSON.stringify(value)}`;

      if (context.recentEntities.has(entityKey)) {
        // Update existing entity
        const entity = context.recentEntities.get(entityKey)!;
        entity.lastMentioned = Date.now();
        entity.mentionCount += 1;
        entity.salience = Math.min(1.0, entity.salience + 0.1); // Increase salience with mentions
      } else {
        // Add new entity
        context.recentEntities.set(entityKey, {
          type: key,
          value,
          lastMentioned: Date.now(),
          mentionCount: 1,
          salience: 0.5,
        });
      }
    }

    // Prune old entities
    if (context.recentEntities.size > this.maxEntityMemory) {
      this.pruneEntities(context);
    }
  }

  /**
   * Prune old messages (keep important ones)
   */
  private pruneMessages(context: ConversationContext): number {
    const messages = context.messages;
    const keepCount = Math.floor(this.maxContextLength * 0.7); // Keep 70% newest
    
    if (messages.length <= keepCount) return 0;

    const toRemove = messages.length - keepCount;
    context.messages = messages.slice(toRemove);
    
    return toRemove;
  }

  /**
   * Prune old entities (keep frequently mentioned ones)
   */
  private pruneEntities(context: ConversationContext) {
    // Sort by recency * salience
    const sorted = Array.from(context.recentEntities.entries()).sort((a, b) => {
      const scoreA = (a[1].lastMentioned / Date.now()) * a[1].salience;
      const scoreB = (b[1].lastMentioned / Date.now()) * b[1].salience;
      return scoreB - scoreA;
    });

    // Keep top N
    const keepCount = Math.floor(this.maxEntityMemory * 0.8);
    const toKeep = sorted.slice(0, keepCount);

    context.recentEntities = new Map(toKeep);
  }

  /**
   * Get conversation history for AI
   */
  getConversationHistory(
    sessionId?: string,
    limit?: number
  ): ConversationMessage[] {
    const context = sessionId
      ? this.contexts.get(sessionId)
      : this.getActiveSession();

    if (!context) return [];

    const messages = context.messages;
    return limit ? messages.slice(-limit) : messages;
  }

  /**
   * Format conversation history for Gemini
   */
  formatForGemini(sessionId?: string): Array<{ role: 'user' | 'model'; content: string }> {
    const messages = this.getConversationHistory(sessionId);

    return messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
        content: m.content,
      }));
  }

  /**
   * Get context summary for AI
   */
  getContextSummary(sessionId?: string): string {
    const context = sessionId
      ? this.contexts.get(sessionId)
      : this.getActiveSession();

    if (!context) return '';

    const parts: string[] = [];

    if (context.location) {
      parts.push(`Location: ${context.location.city}, ${context.location.country}`);
    }

    if (context.tripId) {
      parts.push(`Trip ID: ${context.tripId}`);
    }

    if (context.preferences) {
      if (context.preferences.budget) {
        parts.push(`Budget: ${context.preferences.budget}`);
      }
      if (context.preferences.dietary && context.preferences.dietary.length > 0) {
        parts.push(`Dietary: ${context.preferences.dietary.join(', ')}`);
      }
    }

    // Add recent entities
    const topEntities = Array.from(context.recentEntities.values())
      .sort((a, b) => b.salience - a.salience)
      .slice(0, 5);

    if (topEntities.length > 0) {
      const entityStr = topEntities
        .map((e) => `${e.type}: ${JSON.stringify(e.value)}`)
        .join('; ');
      parts.push(`Recent topics: ${entityStr}`);
    }

    return parts.join(' | ');
  }

  /**
   * Clear session
   */
  clearSession(sessionId: string) {
    this.contexts.delete(sessionId);
    if (this.activeSessionId === sessionId) {
      this.activeSessionId = null;
    }
    this.saveToStorage();
  }

  /**
   * Clear all sessions
   */
  clearAll() {
    this.contexts.clear();
    this.activeSessionId = null;
    this.saveToStorage();
  }

  /**
   * Get all sessions
   */
  getAllSessions(): ConversationContext[] {
    return Array.from(this.contexts.values());
  }

  // --- PERSISTENCE ---

  /**
   * Load contexts from localStorage
   */
  private loadFromStorage() {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem('ai_conversation_contexts');
      if (saved) {
        const data = JSON.parse(saved);
        
        // Restore contexts
        for (const [id, ctx] of Object.entries(data.contexts as Record<string, any>)) {
          // Restore Map for entities
          const context: ConversationContext = {
            ...ctx,
            recentEntities: new Map(Object.entries(ctx.recentEntities || {})),
          };
          this.contexts.set(id, context);
        }

        this.activeSessionId = data.activeSessionId || null;
        console.log(`[ContextManager] Loaded ${this.contexts.size} sessions from storage`);
      }
    } catch (error) {
      console.error('[ContextManager] Failed to load from storage:', error);
    }
  }

  /**
   * Save contexts to localStorage
   */
  private saveToStorage() {
    if (typeof window === 'undefined') return;

    try {
      // Convert contexts to serializable format
      const contextsObj: Record<string, any> = {};
      
      for (const [id, ctx] of this.contexts) {
        contextsObj[id] = {
          ...ctx,
          recentEntities: Object.fromEntries(ctx.recentEntities),
        };
      }

      const data = {
        contexts: contextsObj,
        activeSessionId: this.activeSessionId,
        lastSaved: Date.now(),
      };

      localStorage.setItem('ai_conversation_contexts', JSON.stringify(data));
    } catch (error) {
      console.error('[ContextManager] Failed to save to storage:', error);
    }
  }

  /**
   * Export session for debugging
   */
  exportSession(sessionId?: string): string {
    const context = sessionId
      ? this.contexts.get(sessionId)
      : this.getActiveSession();

    if (!context) return '';

    return JSON.stringify(
      {
        ...context,
        recentEntities: Object.fromEntries(context.recentEntities),
      },
      null,
      2
    );
  }
}

// --- SINGLETON INSTANCE ---

let contextManagerInstance: ContextManager | null = null;

export function getContextManager(): ContextManager {
  if (!contextManagerInstance) {
    contextManagerInstance = new ContextManager();
  }
  return contextManagerInstance;
}

export function initializeContextManager(
  maxContextLength?: number,
  maxEntityMemory?: number
): ContextManager {
  contextManagerInstance = new ContextManager(maxContextLength, maxEntityMemory);
  return contextManagerInstance;
}

// --- EXPORTS ---

export default ContextManager;
