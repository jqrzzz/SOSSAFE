-- ============================================================================
-- SOS Safety: Local Knowledge Base
-- Staff and management contribute local safety intelligence that makes
-- SOSA smarter for real emergencies in their area.
-- Think "Google Maps reviews" but for safety-critical local info.
-- ============================================================================

-- CATEGORIES:
--   medical_facility  — Hospitals, clinics, pharmacies, dentists
--   transport          — Ambulance times, road conditions, helicopter access
--   hazard             — Flood zones, wildlife, unsafe areas, seasonal risks
--   emergency_contact  — Local police, coast guard, fire, tourist police
--   local_tip          — Cultural considerations, language, local customs

CREATE TABLE partner_local_knowledge (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  submitted_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Content
  category text NOT NULL CHECK (category IN (
    'medical_facility', 'transport', 'hazard', 'emergency_contact', 'local_tip'
  )),
  title text NOT NULL,
  content text NOT NULL, -- Main description / notes
  importance text NOT NULL DEFAULT 'normal' CHECK (importance IN ('critical', 'high', 'normal', 'low')),

  -- Structured location / contact fields (optional, depends on category)
  location_name text,       -- e.g., "Bangkok Hospital Phuket"
  location_address text,    -- Street address
  phone text,               -- Contact number
  operating_hours text,     -- e.g., "24/7" or "Mon-Fri 8am-6pm"
  estimated_response_time text, -- e.g., "15-20 min" (for transport/medical)

  -- Verification
  verified boolean NOT NULL DEFAULT false,
  verified_by uuid REFERENCES users(id),
  verified_at timestamptz,

  -- Flexible metadata for category-specific fields
  metadata jsonb NOT NULL DEFAULT '{}',

  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_local_knowledge_partner ON partner_local_knowledge(partner_id);
CREATE INDEX idx_local_knowledge_category ON partner_local_knowledge(partner_id, category);
CREATE INDEX idx_local_knowledge_submitted_by ON partner_local_knowledge(submitted_by);
CREATE INDEX idx_local_knowledge_verified ON partner_local_knowledge(partner_id, verified);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_local_knowledge_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_local_knowledge_updated_at
  BEFORE UPDATE ON partner_local_knowledge
  FOR EACH ROW EXECUTE FUNCTION update_local_knowledge_updated_at();

-- RLS
ALTER TABLE partner_local_knowledge ENABLE ROW LEVEL SECURITY;

-- All team members can view their partner's knowledge entries
CREATE POLICY "Team members can view partner knowledge"
  ON partner_local_knowledge FOR SELECT
  USING (
    partner_id IN (
      SELECT partner_id FROM partner_memberships
      WHERE user_id = auth.uid() AND removed_at IS NULL
    )
  );

-- Any team member can submit knowledge entries
CREATE POLICY "Team members can submit knowledge"
  ON partner_local_knowledge FOR INSERT
  WITH CHECK (
    submitted_by = auth.uid()
    AND partner_id IN (
      SELECT partner_id FROM partner_memberships
      WHERE user_id = auth.uid() AND removed_at IS NULL
    )
  );

-- Users can update their own entries; owners/managers can update any
CREATE POLICY "Users can update own entries or managers can update any"
  ON partner_local_knowledge FOR UPDATE
  USING (
    submitted_by = auth.uid()
    OR partner_id IN (
      SELECT partner_id FROM partner_memberships
      WHERE user_id = auth.uid()
        AND removed_at IS NULL
        AND role IN ('owner', 'manager')
    )
  );

-- Only owners/managers can delete entries
CREATE POLICY "Owners and managers can delete knowledge entries"
  ON partner_local_knowledge FOR DELETE
  USING (
    partner_id IN (
      SELECT partner_id FROM partner_memberships
      WHERE user_id = auth.uid()
        AND removed_at IS NULL
        AND role IN ('owner', 'manager')
    )
  );

COMMENT ON TABLE partner_local_knowledge IS
  'Local safety intelligence contributed by partner staff. '
  'Feeds into SOSA AI for smarter emergency triage in each region. '
  'Think Google Maps reviews but for safety-critical local info.';
