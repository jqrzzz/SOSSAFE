-- ============================================================================
-- Add UPDATE policies for certifications and certification_submissions
-- Required for auto-approval flow (client updates status to 'approved')
-- and for module retakes (client updates existing submission scores)
-- ============================================================================

-- Users can update their partner's certifications (for auto-approval on completion)
CREATE POLICY "Users can update their partner certifications"
  ON certifications FOR UPDATE
  USING (
    partner_id IN (
      SELECT partner_id FROM partner_memberships
      WHERE user_id = auth.uid() AND removed_at IS NULL
    )
  );

-- Users can update their own certification submissions (for retakes)
CREATE POLICY "Users can update their certification submissions"
  ON certification_submissions FOR UPDATE
  USING (
    certification_id IN (
      SELECT c.id FROM certifications c
      JOIN partner_memberships pm ON pm.partner_id = c.partner_id
      WHERE pm.user_id = auth.uid() AND pm.removed_at IS NULL
    )
  );
