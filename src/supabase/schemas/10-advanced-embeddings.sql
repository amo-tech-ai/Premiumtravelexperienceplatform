-- ============================================================================
-- ADVANCED SCHEMA: Vector Embeddings (pgvector)
-- ============================================================================
-- Description: Vector embeddings for semantic search and RAG
-- Phase: Advanced (Phase 2)
-- Dependencies: profiles, conversations, locations
-- ============================================================================

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- TABLE: embeddings
-- ============================================================================
-- Description: Vector embeddings for semantic search
-- RLS: Service-level access only
-- ============================================================================

CREATE TABLE IF NOT EXISTS embeddings (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- What this embedding represents
  entity_type TEXT NOT NULL CHECK (entity_type IN ('location', 'message', 'preference', 'context', 'user_history')),
  entity_id UUID NOT NULL,
  
  -- The actual embedding vector (1536 dimensions for text-embedding-ada-002 or Gemini)
  embedding vector(1536) NOT NULL,
  
  -- Content that was embedded
  content TEXT NOT NULL,
  content_hash TEXT NOT NULL, -- MD5 hash to detect changes
  
  -- Model used
  model TEXT DEFAULT 'text-embedding-ada-002',
  
  -- Metadata
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT embeddings_entity_unique UNIQUE (entity_type, entity_id, content_hash)
);

-- ============================================================================
-- TABLE: web_sources
-- ============================================================================
-- Description: Web content snapshots for AI grounding
-- RLS: Service-level access
-- ============================================================================

CREATE TABLE IF NOT EXISTS web_sources (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Source
  url TEXT NOT NULL,
  url_hash TEXT NOT NULL UNIQUE,
  domain TEXT NOT NULL,
  
  -- Content
  title TEXT,
  content TEXT NOT NULL,
  content_type TEXT DEFAULT 'html' CHECK (content_type IN ('html', 'json', 'text', 'pdf')),
  
  -- Metadata
  author TEXT,
  published_date TIMESTAMPTZ,
  last_modified TIMESTAMPTZ,
  language TEXT DEFAULT 'en',
  
  -- Embedding
  embedding_id UUID REFERENCES embeddings(id),
  
  -- Freshness
  fetched_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Vector similarity search (HNSW index for fast approximate nearest neighbor)
CREATE INDEX IF NOT EXISTS idx_embeddings_vector ON embeddings 
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Entity lookups
CREATE INDEX IF NOT EXISTS idx_embeddings_entity ON embeddings(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_embeddings_hash ON embeddings(content_hash);

-- Web sources
CREATE INDEX IF NOT EXISTS idx_web_sources_url_hash ON web_sources(url_hash);
CREATE INDEX IF NOT EXISTS idx_web_sources_domain ON web_sources(domain);
CREATE INDEX IF NOT EXISTS idx_web_sources_expires ON web_sources(expires_at) WHERE is_active = true;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service can manage embeddings"
  ON embeddings FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

ALTER TABLE web_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service can manage web sources"
  ON web_sources FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================================================
-- FUNCTIONS: Vector Search
-- ============================================================================

-- Function: Semantic search for locations
CREATE OR REPLACE FUNCTION search_locations_semantic(
  query_embedding vector(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  location_id UUID,
  content TEXT,
  similarity FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.entity_id AS location_id,
    e.content,
    1 - (e.embedding <=> query_embedding) AS similarity
  FROM embeddings e
  WHERE
    e.entity_type = 'location'
    AND 1 - (e.embedding <=> query_embedding) > match_threshold
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function: Search conversation history semantically
CREATE OR REPLACE FUNCTION search_conversation_history(
  p_user_id UUID,
  query_embedding vector(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  message_id UUID,
  content TEXT,
  similarity FLOAT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id AS message_id,
    m.content,
    1 - (e.embedding <=> query_embedding) AS similarity,
    m.created_at
  FROM embeddings e
  JOIN messages m ON m.id = e.entity_id
  JOIN conversations c ON c.id = m.conversation_id
  WHERE
    e.entity_type = 'message'
    AND c.user_id = p_user_id
    AND 1 - (e.embedding <=> query_embedding) > match_threshold
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function: Find similar places to a given place
CREATE OR REPLACE FUNCTION find_similar_places(
  p_location_id UUID,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  location_id UUID,
  name TEXT,
  similarity FLOAT
) AS $$
DECLARE
  query_embedding vector(1536);
BEGIN
  -- Get embedding for the query location
  SELECT embedding INTO query_embedding
  FROM embeddings
  WHERE entity_type = 'location' AND entity_id = p_location_id
  LIMIT 1;
  
  IF query_embedding IS NULL THEN
    RAISE EXCEPTION 'No embedding found for location %', p_location_id;
  END IF;
  
  RETURN QUERY
  SELECT
    l.id AS location_id,
    l.name,
    1 - (e.embedding <=> query_embedding) AS similarity
  FROM embeddings e
  JOIN locations l ON l.id = e.entity_id
  WHERE
    e.entity_type = 'location'
    AND e.entity_id != p_location_id
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update timestamps
CREATE TRIGGER update_embeddings_updated_at
  BEFORE UPDATE ON embeddings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_web_sources_updated_at
  BEFORE UPDATE ON web_sources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE embeddings IS 'Vector embeddings for semantic search using pgvector';
COMMENT ON TABLE web_sources IS 'Web content snapshots for AI grounding and context';
COMMENT ON COLUMN embeddings.embedding IS '1536-dimensional vector for semantic similarity';
COMMENT ON FUNCTION search_locations_semantic IS 'Semantic search for locations using vector similarity';
COMMENT ON FUNCTION find_similar_places IS 'Find places similar to a given place';
