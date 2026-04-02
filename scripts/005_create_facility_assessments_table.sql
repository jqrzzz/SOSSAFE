-- ============================================================================
-- Facility Assessments: SOSA-conducted property interviews
-- Stores structured answers from the interactive facility assessment
-- that SOSA conducts with property owners/managers.
-- Used to generate custom Policies & Procedures documents.
-- ============================================================================

CREATE TABLE facility_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,

  -- Which question was answered
  question_id text NOT NULL,
  category text NOT NULL,

  -- The structured answer
  answer text NOT NULL,

  -- AI-extracted structured data from the answer (equipment counts, locations, etc.)
  extracted_data jsonb DEFAULT '{}',

  -- Who provided the answer
  answered_by uuid NOT NULL REFERENCES users(id),

  -- Tracking
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- One answer per question per partner (upsert on re-interview)
  UNIQUE(partner_id, question_id)
);

-- Policy documents generated from assessment data
CREATE TABLE facility_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,

  -- The generated document
  title text NOT NULL DEFAULT 'Emergency Policies & Procedures',
  content text NOT NULL,

  -- Which assessment answers were used (snapshot for versioning)
  based_on_answers jsonb DEFAULT '[]',

  -- Generation metadata
  generated_at timestamptz DEFAULT now(),
  generated_by uuid REFERENCES users(id),

  -- Version tracking (latest per partner)
  version integer NOT NULL DEFAULT 1,

  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_facility_assessments_partner_id ON facility_assessments(partner_id);
CREATE INDEX idx_facility_assessments_category ON facility_assessments(category);
CREATE INDEX idx_facility_policies_partner_id ON facility_policies(partner_id);

-- Auto-update trigger for assessments
CREATE TRIGGER update_facility_assessments_updated_at
  BEFORE UPDATE ON facility_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE facility_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE facility_policies ENABLE ROW LEVEL SECURITY;

-- Team members can view their partner's assessments
CREATE POLICY "Team members can view facility assessments"
  ON facility_assessments FOR SELECT
  USING (
    partner_id IN (
      SELECT partner_id FROM partner_memberships
      WHERE user_id = auth.uid() AND removed_at IS NULL
    )
  );

-- Owners and managers can insert/update assessments
CREATE POLICY "Managers can insert facility assessments"
  ON facility_assessments FOR INSERT
  WITH CHECK (
    partner_id IN (
      SELECT partner_id FROM partner_memberships
      WHERE user_id = auth.uid()
        AND role IN ('owner', 'manager')
        AND removed_at IS NULL
    )
  );

CREATE POLICY "Managers can update facility assessments"
  ON facility_assessments FOR UPDATE
  USING (
    partner_id IN (
      SELECT partner_id FROM partner_memberships
      WHERE user_id = auth.uid()
        AND role IN ('owner', 'manager')
        AND removed_at IS NULL
    )
  );

-- Team members can view policies
CREATE POLICY "Team members can view facility policies"
  ON facility_policies FOR SELECT
  USING (
    partner_id IN (
      SELECT partner_id FROM partner_memberships
      WHERE user_id = auth.uid() AND removed_at IS NULL
    )
  );

-- Owners and managers can insert policies
CREATE POLICY "Managers can insert facility policies"
  ON facility_policies FOR INSERT
  WITH CHECK (
    partner_id IN (
      SELECT partner_id FROM partner_memberships
      WHERE user_id = auth.uid()
        AND role IN ('owner', 'manager')
        AND removed_at IS NULL
    )
  );

COMMENT ON TABLE facility_assessments IS 'SOSA-conducted facility interview answers. One answer per question per partner, upsertable.';
COMMENT ON TABLE facility_policies IS 'Generated Policies & Procedures documents based on facility assessment answers.';
