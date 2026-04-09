-- ============================================================================
-- Add verification_code to certifications
-- Enables public verification pages where travelers/insurers can confirm
-- a property's SOS Safe certification is authentic and current.
-- Format: SOS-XXXXXX (6 alphanumeric chars, no ambiguous characters)
-- ============================================================================

ALTER TABLE certifications ADD COLUMN verification_code text UNIQUE;

CREATE INDEX idx_certifications_verification_code
  ON certifications(verification_code)
  WHERE verification_code IS NOT NULL;

-- Allow public (anonymous) reads of certifications by verification code
-- This powers the /verify/[code] page (no login required)
CREATE POLICY "Anyone can verify certifications by code"
  ON certifications FOR SELECT
  USING (verification_code IS NOT NULL);

-- Allow public reads of partner basic info for certified partners
-- Only partners with a verification code are visible (i.e., certified)
CREATE POLICY "Anyone can view partner basic info for verification"
  ON partners FOR SELECT
  USING (
    id IN (
      SELECT partner_id FROM certifications WHERE verification_code IS NOT NULL
    )
  );
