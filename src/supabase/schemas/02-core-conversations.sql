-- ============================================================================
-- CORE SCHEMA: AI Conversations & Messages
-- ============================================================================
-- Description: Chat conversations between users and AI agents
-- Phase: Core (Phase 1)
-- Dependencies: profiles
-- ============================================================================

-- ============================================================================
-- TABLE: conversations
-- ============================================================================
-- Description: Chat conversation sessions with AI
-- RLS: Enabled (users can only access their own conversations)
-- ============================================================================

CREATE TABLE IF NOT EXISTS conversations (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Conversation metadata
  title TEXT,
  context_type TEXT DEFAULT 'general' CHECK (context_type IN ('general', 'events', 'restaurants', 'rentals', 'maps', 'itinerary')),
  
  -- State
  is_active BOOLEAN DEFAULT true,
  is_archived BOOLEAN DEFAULT false,
  last_message_at TIMESTAMPTZ,
  message_count INTEGER DEFAULT 0,
  
  -- Context
  location_context JSONB, -- { "city": "Medellín", "lat": 6.2442, "lng": -75.5812 }
  trip_context JSONB, -- { "trip_id": "uuid", "dates": [...] }
  user_intent TEXT, -- Last detected user intent
  
  -- AI settings for this conversation
  model_used TEXT DEFAULT 'gemini-1.5-flash',
  temperature DECIMAL(3, 2) DEFAULT 0.7,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Indexes
  CONSTRAINT conversations_temperature_check CHECK (temperature >= 0 AND temperature <= 2.0)
);

-- ============================================================================
-- TABLE: messages
-- ============================================================================
-- Description: Individual messages in conversations
-- RLS: Enabled (users can only access messages from their conversations)
-- ============================================================================

CREATE TABLE IF NOT EXISTS messages (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  
  -- Message content
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'function')),
  content TEXT NOT NULL,
  content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'json', 'markdown', 'html')),
  
  -- AI metadata
  model TEXT,
  tokens_used INTEGER,
  finish_reason TEXT,
  confidence_score DECIMAL(3, 2),
  
  -- Function calling
  function_name TEXT,
  function_args JSONB,
  function_result JSONB,
  
  -- Grounding & sources
  grounded BOOLEAN DEFAULT false,
  sources JSONB, -- Array of source URLs/references
  search_queries TEXT[],
  
  -- UI rendering hints
  display_format TEXT DEFAULT 'text' CHECK (display_format IN ('text', 'card', 'list', 'map', 'table', 'carousel')),
  ui_data JSONB, -- Structured data for rendering (cards, lists, etc.)
  
  -- User feedback
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  user_feedback TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Order
  sequence_number INTEGER NOT NULL,
  
  -- Constraints
  CONSTRAINT messages_sequence_unique UNIQUE (conversation_id, sequence_number)
);

-- ============================================================================
-- TABLE: ai_runs
-- ============================================================================
-- Description: Track AI agent execution runs for analytics and debugging
-- RLS: Enabled (users can only access their own AI runs)
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_runs (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  
  -- Run details
  agent_type TEXT NOT NULL CHECK (agent_type IN ('events', 'restaurants', 'rentals', 'maps', 'context', 'scoring', 'memory', 'orchestrator')),
  intent TEXT,
  
  -- Model details
  model TEXT NOT NULL,
  temperature DECIMAL(3, 2),
  max_tokens INTEGER,
  
  -- Input
  prompt TEXT NOT NULL,
  context JSONB,
  tools_available TEXT[],
  
  -- Output
  response TEXT,
  structured_output JSONB,
  
  -- Performance
  tokens_input INTEGER,
  tokens_output INTEGER,
  tokens_total INTEGER,
  latency_ms INTEGER,
  cost_estimate DECIMAL(10, 6),
  
  -- Tool usage
  tools_called JSONB, -- Array of tool calls made
  grounding_used BOOLEAN DEFAULT false,
  search_grounding_queries TEXT[],
  
  -- Result
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'success', 'error', 'timeout')),
  error_message TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Conversations
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_active ON conversations(user_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_conversations_context_type ON conversations(context_type);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC);

-- Messages
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sequence ON messages(conversation_id, sequence_number);
CREATE INDEX IF NOT EXISTS idx_messages_role ON messages(role);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- AI Runs
CREATE INDEX IF NOT EXISTS idx_ai_runs_user_id ON ai_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_runs_conversation_id ON ai_runs(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_runs_agent_type ON ai_runs(agent_type);
CREATE INDEX IF NOT EXISTS idx_ai_runs_status ON ai_runs(status);
CREATE INDEX IF NOT EXISTS idx_ai_runs_created_at ON ai_runs(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON conversations FOR DELETE
  USING (auth.uid() = user_id);

-- Messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages from own conversations"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in own conversations"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

-- AI Runs
ALTER TABLE ai_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ai_runs"
  ON ai_runs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service can create ai_runs"
  ON ai_runs FOR INSERT
  WITH CHECK (true); -- Edge functions will create these

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update conversation metadata when message is added
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET
    last_message_at = NEW.created_at,
    message_count = message_count + 1,
    updated_at = NOW()
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_message_created
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_on_message();

-- Update AI run completion time
CREATE OR REPLACE FUNCTION update_ai_run_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('success', 'error', 'timeout') AND OLD.completed_at IS NULL THEN
    NEW.completed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_ai_run_completed
  BEFORE UPDATE ON ai_runs
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_run_completion();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE conversations IS 'AI chat conversation sessions';
COMMENT ON TABLE messages IS 'Individual messages in AI conversations';
COMMENT ON TABLE ai_runs IS 'AI agent execution tracking for analytics';
COMMENT ON COLUMN messages.ui_data IS 'Structured JSON data for rendering UI cards, lists, maps, etc.';
COMMENT ON COLUMN ai_runs.tools_called IS 'JSON array of tool calls made during this run';
