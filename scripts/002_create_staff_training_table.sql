-- ============================================================================
-- SOS Safety: Staff Training Tracking
-- Tracks individual staff member training completions per module
-- Separate from partner-level certification_submissions
-- ============================================================================

-- STAFF_TRAINING_COMPLETIONS: Individual training records per user per module
CREATE TABLE staff_training_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Which module was completed
  module_id text NOT NULL, -- 'facility_assessment', 'emergency_preparedness', 'communication_protocols'

  -- Results
  score numeric NOT NULL, -- 0-100
  passed boolean NOT NULL DEFAULT false,

  -- Timestamps
  completed_at timestamptz DEFAULT now(),
  expires_at timestamptz, -- Training valid for 1 year from completion
  created_at timestamptz DEFAULT now(),

  -- Each user has one record per module per partner (latest attempt wins)
  UNIQUE(partner_id, user_id, module_id)
);

-- Indexes
CREATE INDEX idx_staff_training_partner_id ON staff_training_completions(partner_id);
CREATE INDEX idx_staff_training_user_id ON staff_training_completions(user_id);
CREATE INDEX idx_staff_training_module_id ON staff_training_completions(module_id);

-- RLS
ALTER TABLE staff_training_completions ENABLE ROW LEVEL SECURITY;

-- Users can view training completions for their partner
CREATE POLICY "Users can view their partner training completions"
  ON staff_training_completions FOR SELECT
  USING (
    partner_id IN (
      SELECT partner_id FROM partner_memberships
      WHERE user_id = auth.uid() AND removed_at IS NULL
    )
  );

-- Users can insert/update their own training completions
CREATE POLICY "Users can record their own training"
  ON staff_training_completions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own training"
  ON staff_training_completions FOR UPDATE
  USING (user_id = auth.uid());

COMMENT ON TABLE staff_training_completions IS 'Individual staff training records. Tracks each team member''s module completion separately from the org-level certification.';
