-- ============================================================================
-- SOS Safety: Add Billing Cycle Columns to Partners
-- Tracks plan interval (monthly/annual) and current billing period end
-- ============================================================================

-- Billing interval: monthly or annual
ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS plan_interval text;

-- Current billing period end (from Stripe subscription)
ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS current_period_end timestamptz;

COMMENT ON COLUMN partners.plan_interval IS 'Billing cycle: monthly or annual. Set when subscription is created.';
COMMENT ON COLUMN partners.current_period_end IS 'End of current billing period from Stripe. Updated on each invoice.paid event.';
