-- ============================================================================
-- SOS Safety: Response Incidents
-- Live, staff-triggered emergency response tracking.
-- Distinct from `cases` (which is SOSCOMMAND-owned, created via WhatsApp/LINE).
-- This table captures what the hotel team did, minute by minute, before
-- and during EMS arrival — for clinical handoff and post-incident review.
-- ============================================================================

CREATE TABLE IF NOT EXISTS response_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  started_by uuid NOT NULL REFERENCES auth.users(id),

  -- Timing
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,

  -- Classification
  nature text NOT NULL DEFAULT 'unknown',
    -- 'cardiac_arrest' | 'chest_pain' | 'anaphylaxis' | 'choking'
    -- | 'stroke' | 'trauma' | 'drowning' | 'unresponsive' | 'other' | 'unknown'

  -- Location
  location text,          -- e.g. "Room 412", "Pool deck", "Lobby bar"
  room_number text,

  -- Patient (free-form; no PHI required)
  guest_name text,        -- optional, may be anonymised
  patient_age text,
  patient_sex text,
  patient_description text,

  -- Outcome / disposition
  ems_destination text,   -- receiving hospital
  disposition text,       -- 'transported' | 'refused' | 'resolved_onsite' | 'deceased' | 'other'
  notes text,

  -- Event timeline: ordered list of { t, kind, note }
  -- t = ISO timestamp, kind = 'ems_called' | 'aed_fetched' | 'cpr_started' | ...
  events jsonb NOT NULL DEFAULT '[]'::jsonb,

  -- Public handoff token (for a printed QR / link shown to EMS)
  handoff_token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(12), 'hex'),

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS response_incidents_partner_id_idx
  ON response_incidents(partner_id);
CREATE INDEX IF NOT EXISTS response_incidents_started_at_idx
  ON response_incidents(started_at DESC);
CREATE INDEX IF NOT EXISTS response_incidents_handoff_token_idx
  ON response_incidents(handoff_token);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION touch_response_incident_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS response_incidents_touch_updated_at ON response_incidents;
CREATE TRIGGER response_incidents_touch_updated_at
  BEFORE UPDATE ON response_incidents
  FOR EACH ROW EXECUTE FUNCTION touch_response_incident_updated_at();

-- ============================================================================
-- RLS
-- ============================================================================

ALTER TABLE response_incidents ENABLE ROW LEVEL SECURITY;

-- Members of the partner org can read their incidents
DROP POLICY IF EXISTS "members_read_own_partner_incidents" ON response_incidents;
CREATE POLICY "members_read_own_partner_incidents"
  ON response_incidents FOR SELECT
  USING (
    partner_id IN (
      SELECT partner_id FROM partner_memberships
      WHERE user_id = auth.uid() AND removed_at IS NULL
    )
  );

-- Members can start an incident (must be the starter)
DROP POLICY IF EXISTS "members_start_own_partner_incidents" ON response_incidents;
CREATE POLICY "members_start_own_partner_incidents"
  ON response_incidents FOR INSERT
  WITH CHECK (
    started_by = auth.uid()
    AND partner_id IN (
      SELECT partner_id FROM partner_memberships
      WHERE user_id = auth.uid() AND removed_at IS NULL
    )
  );

-- Members can update their org's incidents (log events, end incident, etc.)
DROP POLICY IF EXISTS "members_update_own_partner_incidents" ON response_incidents;
CREATE POLICY "members_update_own_partner_incidents"
  ON response_incidents FOR UPDATE
  USING (
    partner_id IN (
      SELECT partner_id FROM partner_memberships
      WHERE user_id = auth.uid() AND removed_at IS NULL
    )
  );

-- ============================================================================
-- Public handoff RPC
-- Responders can open a printed QR / link without logging in and see
-- exactly the fields needed for clinical handoff. SECURITY DEFINER lets us
-- bypass RLS and return only the specific incident matching the token.
-- ============================================================================

CREATE OR REPLACE FUNCTION get_incident_by_handoff_token(p_token text)
RETURNS TABLE (
  id uuid,
  partner_id uuid,
  started_at timestamptz,
  ended_at timestamptz,
  nature text,
  location text,
  room_number text,
  guest_name text,
  patient_age text,
  patient_sex text,
  patient_description text,
  ems_destination text,
  disposition text,
  notes text,
  events jsonb,
  partner_name text,
  partner_city text,
  partner_country text,
  partner_address text,
  partner_phone text
)
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT
    ri.id, ri.partner_id, ri.started_at, ri.ended_at, ri.nature,
    ri.location, ri.room_number, ri.guest_name, ri.patient_age,
    ri.patient_sex, ri.patient_description, ri.ems_destination,
    ri.disposition, ri.notes, ri.events,
    p.name, p.city, p.country, p.address, p.phone
  FROM response_incidents ri
  JOIN partners p ON p.id = ri.partner_id
  WHERE ri.handoff_token = p_token
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION get_incident_by_handoff_token(text) TO anon, authenticated;
