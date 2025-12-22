-- ============================================================================
-- ADVANCED SCHEMA: Automations & Background Jobs
-- ============================================================================
-- Description: AI automation rules and background job processing
-- Phase: Advanced (Phase 2)
-- Dependencies: profiles, trips, conversations
-- ============================================================================

-- ============================================================================
-- TABLE: automation_rules
-- ============================================================================
-- Description: User-defined automation rules
-- RLS: Enabled (users can only manage their own rules)
-- ============================================================================

CREATE TABLE IF NOT EXISTS automation_rules (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Rule info
  name TEXT NOT NULL,
  description TEXT,
  
  -- Trigger
  trigger_type TEXT NOT NULL CHECK (trigger_type IN (
    'time_based',        -- Scheduled
    'event_based',       -- On event
    'location_based',    -- Geofence
    'condition_based',   -- When condition met
    'webhook'            -- External trigger
  )),
  trigger_config JSONB NOT NULL, -- Configuration for trigger
  
  -- Conditions (all must be true)
  conditions JSONB DEFAULT '[]', -- Array of conditions
  
  -- Actions (executed in order)
  actions JSONB NOT NULL, -- Array of actions to execute
  
  -- Schedule (for time_based triggers)
  schedule_cron TEXT, -- Cron expression
  schedule_timezone TEXT DEFAULT 'UTC',
  next_run_at TIMESTAMPTZ,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_paused BOOLEAN DEFAULT false,
  
  -- Limits
  max_runs INTEGER, -- Max number of runs (null = unlimited)
  run_count INTEGER DEFAULT 0,
  
  -- Stats
  last_run_at TIMESTAMPTZ,
  last_run_status TEXT CHECK (last_run_status IN ('success', 'failed', 'partial')),
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- TABLE: automation_jobs
-- ============================================================================
-- Description: Background job queue for automation execution
-- RLS: Service-level access
-- ============================================================================

CREATE TABLE IF NOT EXISTS automation_jobs (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Related entities
  automation_rule_id UUID REFERENCES automation_rules(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
  
  -- Job details
  job_type TEXT NOT NULL CHECK (job_type IN (
    'ai_suggestion',
    'itinerary_optimize',
    'price_check',
    'availability_check',
    'reminder_send',
    'report_generate',
    'data_sync',
    'embedding_generate',
    'custom'
  )),
  
  -- Payload
  payload JSONB NOT NULL,
  
  -- Scheduling
  scheduled_for TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',
    'queued',
    'running',
    'success',
    'failed',
    'cancelled',
    'timeout'
  )),
  
  -- Priority
  priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
  
  -- Retry logic
  max_retries INTEGER DEFAULT 3,
  retry_count INTEGER DEFAULT 0,
  retry_delay_seconds INTEGER DEFAULT 60,
  
  -- Result
  result JSONB,
  error_message TEXT,
  error_stack TEXT,
  
  -- Performance
  execution_time_ms INTEGER,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- TABLE: automation_logs
-- ============================================================================
-- Description: Detailed logs of automation executions
-- RLS: Users can view logs for their own automations
-- ============================================================================

CREATE TABLE IF NOT EXISTS automation_logs (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Related entities
  automation_rule_id UUID REFERENCES automation_rules(id) ON DELETE CASCADE,
  automation_job_id UUID REFERENCES automation_jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Log details
  level TEXT NOT NULL CHECK (level IN ('debug', 'info', 'warning', 'error')),
  message TEXT NOT NULL,
  details JSONB,
  
  -- Step tracking
  step_name TEXT,
  step_number INTEGER,
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Automation Rules
CREATE INDEX IF NOT EXISTS idx_automation_rules_user_id ON automation_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_automation_rules_active ON automation_rules(is_active, is_paused) WHERE is_active = true AND is_paused = false;
CREATE INDEX IF NOT EXISTS idx_automation_rules_next_run ON automation_rules(next_run_at) WHERE is_active = true AND is_paused = false AND next_run_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_automation_rules_trigger_type ON automation_rules(trigger_type);

-- Automation Jobs
CREATE INDEX IF NOT EXISTS idx_automation_jobs_status ON automation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_automation_jobs_scheduled ON automation_jobs(scheduled_for, priority) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_automation_jobs_user_id ON automation_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_automation_jobs_rule_id ON automation_jobs(automation_rule_id);
CREATE INDEX IF NOT EXISTS idx_automation_jobs_type ON automation_jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_automation_jobs_created_at ON automation_jobs(created_at DESC);

-- Automation Logs
CREATE INDEX IF NOT EXISTS idx_automation_logs_rule_id ON automation_logs(automation_rule_id);
CREATE INDEX IF NOT EXISTS idx_automation_logs_job_id ON automation_logs(automation_job_id);
CREATE INDEX IF NOT EXISTS idx_automation_logs_user_id ON automation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_automation_logs_level ON automation_logs(level, created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Automation Rules
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own automation rules"
  ON automation_rules FOR ALL
  USING (auth.uid() = user_id);

-- Automation Jobs
ALTER TABLE automation_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own automation jobs"
  ON automation_jobs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service can manage automation jobs"
  ON automation_jobs FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Automation Logs
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own automation logs"
  ON automation_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service can create automation logs"
  ON automation_logs FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update timestamps
CREATE TRIGGER update_automation_rules_updated_at
  BEFORE UPDATE ON automation_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automation_jobs_updated_at
  BEFORE UPDATE ON automation_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Increment run count when job completes
CREATE OR REPLACE FUNCTION increment_automation_run_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('success', 'failed', 'partial') AND OLD.status NOT IN ('success', 'failed', 'partial') THEN
    UPDATE automation_rules
    SET
      run_count = run_count + 1,
      last_run_at = NEW.completed_at,
      last_run_status = NEW.status,
      success_count = CASE WHEN NEW.status = 'success' THEN success_count + 1 ELSE success_count END,
      failure_count = CASE WHEN NEW.status = 'failed' THEN failure_count + 1 ELSE failure_count END
    WHERE id = NEW.automation_rule_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_automation_job_completed
  AFTER UPDATE ON automation_jobs
  FOR EACH ROW
  EXECUTE FUNCTION increment_automation_run_count();

-- ============================================================================
-- FUNCTIONS: Job Queue Management
-- ============================================================================

-- Function: Get next pending job
CREATE OR REPLACE FUNCTION get_next_automation_job()
RETURNS UUID AS $$
DECLARE
  job_id UUID;
BEGIN
  SELECT id INTO job_id
  FROM automation_jobs
  WHERE
    status = 'pending'
    AND scheduled_for <= NOW()
  ORDER BY priority DESC, scheduled_for ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;
  
  IF job_id IS NOT NULL THEN
    UPDATE automation_jobs
    SET
      status = 'queued',
      started_at = NOW(),
      updated_at = NOW()
    WHERE id = job_id;
  END IF;
  
  RETURN job_id;
END;
$$ LANGUAGE plpgsql;

-- Function: Retry failed job
CREATE OR REPLACE FUNCTION retry_automation_job(p_job_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  job_record RECORD;
  can_retry BOOLEAN;
BEGIN
  SELECT * INTO job_record
  FROM automation_jobs
  WHERE id = p_job_id;
  
  can_retry := job_record.retry_count < job_record.max_retries;
  
  IF can_retry THEN
    UPDATE automation_jobs
    SET
      status = 'pending',
      retry_count = retry_count + 1,
      scheduled_for = NOW() + (retry_delay_seconds || ' seconds')::INTERVAL,
      error_message = NULL,
      error_stack = NULL,
      updated_at = NOW()
    WHERE id = p_job_id;
    
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate next run time from cron expression
-- Note: This is a simplified version. Production should use pg_cron or similar
CREATE OR REPLACE FUNCTION calculate_next_run(
  p_cron_expression TEXT,
  p_timezone TEXT DEFAULT 'UTC'
)
RETURNS TIMESTAMPTZ AS $$
BEGIN
  -- Simplified: just add 1 hour for demo
  -- In production, use pg_cron or parse cron expression properly
  RETURN NOW() + INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- EXAMPLE AUTOMATION RULES (Data)
-- ============================================================================

-- These would be inserted via Edge Functions, included here for reference

COMMENT ON TABLE automation_rules IS 'User-defined automation rules';
COMMENT ON TABLE automation_jobs IS 'Background job queue for automation execution';
COMMENT ON TABLE automation_logs IS 'Detailed logs of automation executions';

COMMENT ON COLUMN automation_rules.trigger_config IS 'JSON configuration for trigger (e.g., cron schedule, webhook URL, location coordinates)';
COMMENT ON COLUMN automation_rules.actions IS 'Array of actions to execute: [{"type": "send_notification", "config": {...}}, ...]';

-- Example automation rule structure:
-- {
--   "trigger_type": "time_based",
--   "trigger_config": {
--     "schedule": "0 9 * * *",
--     "timezone": "America/New_York"
--   },
--   "conditions": [
--     {
--       "type": "trip_status",
--       "operator": "equals",
--       "value": "active"
--     }
--   ],
--   "actions": [
--     {
--       "type": "ai_suggestion",
--       "config": {
--         "agent": "events",
--         "prompt": "Find events happening today"
--       }
--     },
--     {
--       "type": "send_notification",
--       "config": {
--         "title": "Today's Events",
--         "template": "events_daily_digest"
--       }
--     }
--   ]
-- }
