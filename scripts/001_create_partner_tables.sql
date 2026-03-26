-- ============================================================================
-- SOS Safety: Partner Tables Migration
-- Creates tables for accommodation providers and tour operators
-- These are SEPARATE from medical providers (which use the providers table)
-- ============================================================================

-- 1. CREATE ENUMS
-- ============================================================================

-- Partner types: accommodation providers and tour operators only
-- (Medical facilities use the existing providers table via SOS Professional)
CREATE TYPE partner_type AS ENUM (
  'accommodation',
  'tour_operator'
);

-- Certification status lifecycle
CREATE TYPE certification_status AS ENUM (
  'pending',
  'in_review', 
  'approved',
  'expired',
  'revoked'
);

-- Certification tiers
CREATE TYPE certification_tier AS ENUM (
  'sos_safe_basic',
  'sos_safe_premium',
  'sos_safe_elite'
);

-- Partner membership roles
CREATE TYPE partner_membership_role AS ENUM (
  'owner',
  'manager',
  'staff'
);

-- 2. CREATE TABLES
-- ============================================================================

-- PARTNERS: Hotels, accommodations, tour operators
-- Distinct from medical providers table
CREATE TABLE partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type partner_type NOT NULL,
  
  -- Location
  country text,
  region text,
  city text,
  address text,
  
  -- Contact
  phone text,
  email text,
  website text,
  
  -- Status
  is_active boolean DEFAULT true,
  
  -- Flexible metadata for property-specific details
  -- e.g., room count, tour types, emergency equipment on-site
  metadata jsonb DEFAULT '{}',
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- PARTNER_MEMBERSHIPS: Links shared users to partner organizations
-- Uses the shared users table (NOT a separate identity)
CREATE TABLE partner_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Role within the partner organization
  role partner_membership_role NOT NULL DEFAULT 'staff',
  is_primary_contact boolean DEFAULT false,
  
  -- Invitation tracking
  invited_at timestamptz DEFAULT now(),
  accepted_at timestamptz,
  removed_at timestamptz,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  
  -- A user can only have one membership per partner
  UNIQUE(partner_id, user_id)
);

-- CERTIFICATIONS: SOS Safe certification records
-- Own lifecycle, distinct from agreements table
CREATE TABLE certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  
  -- Certification details
  certification_tier certification_tier NOT NULL DEFAULT 'sos_safe_basic',
  status certification_status NOT NULL DEFAULT 'pending',
  
  -- Validity period
  issued_at timestamptz,
  expires_at timestamptz,
  
  -- Review tracking (Command Center reviewer)
  reviewed_by_user_id uuid REFERENCES users(id),
  review_notes text,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- CERTIFICATION_SUBMISSIONS: Training/survey responses for certification
CREATE TABLE certification_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certification_id uuid NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  
  -- Submission type (maps to survey categories)
  submission_type text NOT NULL, -- 'facility_assessment', 'emergency_preparedness', 'communication_protocols'
  
  -- Survey responses stored as JSON
  responses jsonb NOT NULL DEFAULT '{}',
  
  -- Calculated assessment score (0-100)
  score numeric,
  
  -- Who submitted
  submitted_by_user_id uuid REFERENCES users(id),
  submitted_at timestamptz DEFAULT now(),
  
  -- Timestamps
  created_at timestamptz DEFAULT now()
);

-- 3. CREATE INDEXES
-- ============================================================================

-- Partners
CREATE INDEX idx_partners_type ON partners(type);
CREATE INDEX idx_partners_country ON partners(country);
CREATE INDEX idx_partners_region ON partners(region);
CREATE INDEX idx_partners_is_active ON partners(is_active);

-- Partner memberships
CREATE INDEX idx_partner_memberships_partner_id ON partner_memberships(partner_id);
CREATE INDEX idx_partner_memberships_user_id ON partner_memberships(user_id);

-- Certifications
CREATE INDEX idx_certifications_partner_id ON certifications(partner_id);
CREATE INDEX idx_certifications_status ON certifications(status);
CREATE INDEX idx_certifications_expires_at ON certifications(expires_at);

-- Certification submissions
CREATE INDEX idx_certification_submissions_certification_id ON certification_submissions(certification_id);
CREATE INDEX idx_certification_submissions_type ON certification_submissions(submission_type);

-- 4. CREATE TRIGGERS FOR updated_at
-- ============================================================================

-- Trigger function (may already exist, create if not)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to partners
CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply to certifications
CREATE TRIGGER update_certifications_updated_at
  BEFORE UPDATE ON certifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all new tables
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_submissions ENABLE ROW LEVEL SECURITY;

-- PARTNERS POLICIES
-- Users can view partners they are members of
CREATE POLICY "Users can view their own partners"
  ON partners FOR SELECT
  USING (
    id IN (
      SELECT partner_id FROM partner_memberships 
      WHERE user_id = auth.uid() AND removed_at IS NULL
    )
  );

-- Users can update partners they own/manage
CREATE POLICY "Owners and managers can update partners"
  ON partners FOR UPDATE
  USING (
    id IN (
      SELECT partner_id FROM partner_memberships 
      WHERE user_id = auth.uid() 
        AND role IN ('owner', 'manager')
        AND removed_at IS NULL
    )
  );

-- Any authenticated user can create a partner (during onboarding)
CREATE POLICY "Authenticated users can create partners"
  ON partners FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- PARTNER_MEMBERSHIPS POLICIES
-- Users can view memberships for their partners
CREATE POLICY "Users can view memberships for their partners"
  ON partner_memberships FOR SELECT
  USING (
    partner_id IN (
      SELECT partner_id FROM partner_memberships 
      WHERE user_id = auth.uid() AND removed_at IS NULL
    )
  );

-- Owners can manage memberships
CREATE POLICY "Owners can insert memberships"
  ON partner_memberships FOR INSERT
  WITH CHECK (
    partner_id IN (
      SELECT partner_id FROM partner_memberships 
      WHERE user_id = auth.uid() 
        AND role = 'owner'
        AND removed_at IS NULL
    )
    OR NOT EXISTS (
      SELECT 1 FROM partner_memberships WHERE partner_id = partner_memberships.partner_id
    )
  );

CREATE POLICY "Owners can update memberships"
  ON partner_memberships FOR UPDATE
  USING (
    partner_id IN (
      SELECT partner_id FROM partner_memberships 
      WHERE user_id = auth.uid() 
        AND role = 'owner'
        AND removed_at IS NULL
    )
  );

-- CERTIFICATIONS POLICIES
-- Users can view their partner's certifications
CREATE POLICY "Users can view their partner certifications"
  ON certifications FOR SELECT
  USING (
    partner_id IN (
      SELECT partner_id FROM partner_memberships 
      WHERE user_id = auth.uid() AND removed_at IS NULL
    )
  );

-- Users can create certifications for their partners
CREATE POLICY "Users can create certifications for their partners"
  ON certifications FOR INSERT
  WITH CHECK (
    partner_id IN (
      SELECT partner_id FROM partner_memberships 
      WHERE user_id = auth.uid() AND removed_at IS NULL
    )
  );

-- CERTIFICATION_SUBMISSIONS POLICIES
-- Users can view submissions for their partner's certifications
CREATE POLICY "Users can view their certification submissions"
  ON certification_submissions FOR SELECT
  USING (
    certification_id IN (
      SELECT c.id FROM certifications c
      JOIN partner_memberships pm ON pm.partner_id = c.partner_id
      WHERE pm.user_id = auth.uid() AND pm.removed_at IS NULL
    )
  );

-- Users can create submissions for their partner's certifications
CREATE POLICY "Users can create certification submissions"
  ON certification_submissions FOR INSERT
  WITH CHECK (
    certification_id IN (
      SELECT c.id FROM certifications c
      JOIN partner_memberships pm ON pm.partner_id = c.partner_id
      WHERE pm.user_id = auth.uid() AND pm.removed_at IS NULL
    )
  );

-- 6. COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE partners IS 'Hotels, accommodations, and tour operators in the SOS Safe network. Separate from medical providers.';
COMMENT ON TABLE partner_memberships IS 'Links users from the shared users table to partner organizations.';
COMMENT ON TABLE certifications IS 'SOS Safe certification records with own lifecycle. Tracks certification status and validity.';
COMMENT ON TABLE certification_submissions IS 'Training and survey responses submitted during the certification process.';

COMMENT ON COLUMN partners.metadata IS 'Flexible JSON for property-specific details: room count, tour types, emergency equipment, etc.';
COMMENT ON COLUMN certifications.reviewed_by_user_id IS 'Command Center user who reviewed the certification application.';
COMMENT ON COLUMN certification_submissions.submission_type IS 'Survey category: facility_assessment, emergency_preparedness, communication_protocols, etc.';
