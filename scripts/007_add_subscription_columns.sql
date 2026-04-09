-- ============================================================================
-- SOS Safety: Add Subscription & Trial Columns to Partners
-- Adds property_type, trial tracking, and subscription status
-- ============================================================================

-- Add property type column (hostel, guesthouse, hotel, tour_operator)
-- This is separate from partner_type enum which remains accommodation/tour_operator
ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS property_type text;

-- Trial tracking
ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz;

-- Subscription status: trialing, active, past_due, cancelled, expired
ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'trialing';

-- Stripe references (populated when Stripe is connected)
ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

-- Index for subscription queries
CREATE INDEX IF NOT EXISTS idx_partners_subscription_status ON partners(subscription_status);
CREATE INDEX IF NOT EXISTS idx_partners_trial_ends_at ON partners(trial_ends_at);
CREATE INDEX IF NOT EXISTS idx_partners_stripe_customer_id ON partners(stripe_customer_id);

COMMENT ON COLUMN partners.property_type IS 'Specific property type for pricing: hostel, guesthouse, hotel, tour_operator';
COMMENT ON COLUMN partners.trial_ends_at IS 'When the 30-day free trial expires. Set on partner creation.';
COMMENT ON COLUMN partners.subscription_status IS 'Subscription state: trialing, active, past_due, cancelled, expired';
COMMENT ON COLUMN partners.stripe_customer_id IS 'Stripe customer ID. Populated when payment is connected.';
COMMENT ON COLUMN partners.stripe_subscription_id IS 'Stripe subscription ID. Populated when subscription is created.';
